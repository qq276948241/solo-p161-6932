# 咖啡店点单小程序 · 架构说明

> 大白话版，不想写八股，扫一眼能看懂就行。

## 一、项目里有啥

```
src/
├── App.vue                 # 外壳，就干一件事：放 router-view
├── main.js                 # 入口，挂载 Vue + Router + 全局样式
├── styles/global.css       # 配色变量（奶油白/深棕/焦糖）+ 字体（Caveat 手写体 + Noto Sans SC）
├── data/menu.js            # 所有饮品、分类、Banner 的本地 JSON 数据，纯模拟
├── utils/storage.js        # localStorage 读写的唯一入口，所有页面都从这里拿数据
├── composables/useFavorites.js  # 收藏功能的组合式函数，封装收藏逻辑
├── components/TabBar.vue   # 底部固定导航（首页 / 点单 / 我的订单）
├── router/index.js         # Vue Router 配置，三个路由对应三个页面
└── views/
    ├── Home.vue            # 首页：Banner + 分类 + 卡片 + 右侧抽屉详情
    ├── Cart.vue            # 点单页：购物车 + 结算
    └── Orders.vue          # 我的订单页：历史订单列表
```

---

## 二、三个页面怎么通过 storage.js 交换数据

核心原则：**所有页面都不直接碰 localStorage，全走 `storage.js` 暴露的函数。**

### localStorage 里现在存了 3 个 key

| Key | 管什么 | 长啥样 |
|---|---|---|
| `coffee_shop_cart` | 购物车 | 数组，每项是 `{ drinkId, sizeId, quantity }`，同饮品同杯型合并数量 |
| `coffee_shop_orders` | 历史订单 | 数组，每项是 `{ id, timestamp, items, total, status }`，按时间倒序 |
| `favorites` | 我的收藏 | 纯字符串 ID 数组，比如 `["ethiopia", "latte"]` |

### 数据流转

- **首页 Home.vue**：用户加购 → 调 `addToCart(item)` → storage.js 写入 `coffee_shop_cart`
- **点单页 Cart.vue**：页面一渲染就 `getCart()` 从 storage 读；改数量/杯型 → `updateCartItem()` / `removeFromCart()` → 写回 storage
- **我的订单 Orders.vue**：页面一渲染就 `getOrders()` 从 storage 读；只负责展示，不写
- **下单**：点单页点"去下单" → Cart.vue 调 `createOrder(items, total)` → storage.js 把购物车整体挪到 `coffee_shop_orders` 里 → 再调 `clearCart()` 清空购物车

所以三个页面之间没有直接互相调用，都是通过 **storage.js 作为中间件** 交换数据，谁改谁写，谁看谁读，刷新不丢。

---

## 三、底部 TabBar + Vue Router 切换是怎么玩的

`router/index.js` 里注册了三条路由：

```
/          → Home.vue    (首页)
/cart      → Cart.vue    (点单)
/orders    → Orders.vue  (我的订单)
```

`components/TabBar.vue` 是底部三个 `<router-link to="...">`，用 `to` 的路径匹配当前路由，哪个匹配上就加 `.active` 类把 icon 点亮。

`App.vue` 里的布局就是：上面一个 `<router-view />`，下面贴一个 `<TabBar />`，TabBar 永远固定在底部，页面切换只切上面的内容。

---

## 四、收藏功能数据流

收藏逻辑被抽在 `composables/useFavorites.js` 里，对外暴露 4 个接口：

```js
const { favoriteIds, toggle, isFav, refresh } = useFavorites()
```

数据流非常短：

```
用户点卡片右上角星星
  → Home.vue 调 toggle(drinkId)
    → useFavorites.js 直接改 favoriteIds.value（ref，唯一真相源）
      → saveFavorites() 同步写入 localStorage 的 favorites key
        → Vue 检测到 ref 变了，卡片上的星星 SVG 自动变实心/空心
```

切换到"收藏"分类时，Home.vue 拿 `favoriteIds` 去菜单数据里 `filter` 一把就出来了，不需要额外请求。刷新页面时 composable 在 `ref(getFavorites())` 阶段同步从 localStorage 恢复，首帧就有正确状态，不会闪。

---

## 五、完整下单流程 ASCII 图

```
┌─────────────────────────────────────────────────────────────────┐
│                        Home.vue (首页)                           │
│                                                                 │
│   ┌──────────────┐      点击卡片       ┌─────────────────────┐   │
│   │  饮品卡片    │ ─────────────────→ │   右侧抽屉 Detail    │   │
│   │  (带星星)    │                     │  选杯型 / 调数量    │   │
│   └──────┬───────┘                     └──────────┬──────────┘   │
│          │ 点+快捷加购                   点"加入购物车" │            │
│          └───────────────┬───────────────────────────┘            │
│                          ↓                                        │
│                 storage.addToCart(item)                          │
│                 ↓ 写入 coffee_shop_cart                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   │  点底部 TabBar 的 "点单"
                                   ↓
┌─────────────────────────────────────────────────────────────────┐
│                        Cart.vue (点单页)                         │
│                                                                 │
│   storage.getCart() 读购物车 ←─────────────────────────────┐    │
│   渲染已选列表，改杯型/数量 → storage.updateCartItem() ─────┘    │
│                                                                 │
│                          点"去下单"                               │
│                              ↓                                   │
│                   ┌─────────────────────┐                       │
│                   │   底部确认 Modal    │                       │
│                   │   显示金额和杯数     │                       │
│                   └──────────┬──────────┘                       │
│                      点"确认支付" │                               │
│                              ↓                                   │
│              storage.createOrder(items, total)  → 写入 orders    │
│              storage.clearCart()           → 清空 cart           │
│                              ↓                                   │
│                        跳到 /orders                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Orders.vue (我的订单)                       │
│                                                                 │
│   storage.getOrders() 读历史订单                                 │
│   按时间倒序渲染卡片：下单时间 + 缩略图 + 总价 + 状态              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

一句话总结：**首页选 → storage 暂存 → 点单页结算 → storage 挪成订单 → 订单页展示**。

---

## 六、改代码的时候改哪儿

| 想改什么 | 改哪个文件 |
|---|---|
| 加一款饮品 / 改价格 / 改分类 | `data/menu.js` |
| 改配色 / 改字体 | `styles/global.css` 里的 `:root` 变量 |
| 改路由 / 加新页面 | `router/index.js` + `views/` 下新建文件 + `TabBar.vue` |
| 改购物车/订单逻辑 | `utils/storage.js` |
| 改收藏逻辑 | `composables/useFavorites.js` |
| 改底部导航图标 | `components/TabBar.vue` |
