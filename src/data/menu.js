export const categories = [
  { id: 'pour-over', name: '手冲', nameEn: 'Pour Over' },
  { id: 'espresso', name: '意式', nameEn: 'Espresso' },
  { id: 'non-coffee', name: '非咖啡', nameEn: 'Non-Coffee' }
]

export const drinks = [
  {
    id: 1,
    categoryId: 'pour-over',
    name: '耶加雪菲',
    nameEn: 'Yirgacheffe',
    price: 32,
    icon: '☕',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    flavor: '柑橘、茉莉花、蜂蜜般的甜感',
    description: '来自埃塞俄比亚的精品咖啡豆，水洗处理，明亮的果酸与花香交织，余韵悠长。',
    ingredients: ['埃塞俄比亚耶加雪菲咖啡豆 15g', '纯净水 220ml', '水温 92°C'],
    cupSizes: [
      { id: 'S', name: '小杯', ml: 200, priceAdd: 0 },
      { id: 'M', name: '中杯', ml: 300, priceAdd: 5 },
      { id: 'L', name: '大杯', ml: 400, priceAdd: 10 }
    ]
  },
  {
    id: 2,
    categoryId: 'pour-over',
    name: '瑰夏',
    nameEn: 'Geisha',
    price: 58,
    icon: '🌸',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
    flavor: '茉莉花香、热带水果、茶感',
    description: '巴拿马瑰夏，咖啡界的传奇品种，极致的花香与复杂层次，值得细品。',
    ingredients: ['巴拿马翡翠庄园瑰夏豆 15g', '纯净水 220ml', '水温 90°C'],
    cupSizes: [
      { id: 'S', name: '小杯', ml: 200, priceAdd: 0 },
      { id: 'M', name: '中杯', ml: 300, priceAdd: 8 },
      { id: 'L', name: '大杯', ml: 400, priceAdd: 15 }
    ]
  },
  {
    id: 3,
    categoryId: 'pour-over',
    name: '曼特宁',
    nameEn: 'Mandheling',
    price: 28,
    icon: '🌿',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    flavor: '草本、焦糖、醇厚低酸',
    description: '印尼苏门答腊曼特宁，湿刨处理法，浓郁的草本气息与醇厚口感。',
    ingredients: ['印尼曼特宁咖啡豆 15g', '纯净水 220ml', '水温 93°C'],
    cupSizes: [
      { id: 'S', name: '小杯', ml: 200, priceAdd: 0 },
      { id: 'M', name: '中杯', ml: 300, priceAdd: 5 },
      { id: 'L', name: '大杯', ml: 400, priceAdd: 10 }
    ]
  },
  {
    id: 4,
    categoryId: 'espresso',
    name: '拿铁',
    nameEn: 'Latte',
    price: 26,
    icon: '🥛',
    image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400',
    flavor: '奶香浓郁、咖啡醇厚',
    description: '意式浓缩与丝滑牛奶的经典组合，表面拉花，温暖治愈。',
    ingredients: ['意式浓缩咖啡 30ml', '鲜牛奶 200ml', '奶泡'],
    cupSizes: [
      { id: 'S', name: '小杯', ml: 240, priceAdd: 0 },
      { id: 'M', name: '中杯', ml: 360, priceAdd: 4 },
      { id: 'L', name: '大杯', ml: 480, priceAdd: 8 }
    ]
  },
  {
    id: 5,
    categoryId: 'espresso',
    name: '焦糖玛奇朵',
    nameEn: 'Caramel Macchiato',
    price: 30,
    icon: '🍯',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    flavor: '焦糖香甜、香草顺滑',
    description: '香草糖浆、牛奶、浓缩咖啡层层叠加，顶部淋上诱人的焦糖酱。',
    ingredients: ['香草糖浆 15ml', '鲜牛奶 200ml', '意式浓缩 30ml', '焦糖酱'],
    cupSizes: [
      { id: 'S', name: '小杯', ml: 240, priceAdd: 0 },
      { id: 'M', name: '中杯', ml: 360, priceAdd: 4 },
      { id: 'L', name: '大杯', ml: 480, priceAdd: 8 }
    ]
  },
  {
    id: 6,
    categoryId: 'espresso',
    name: '卡布奇诺',
    nameEn: 'Cappuccino',
    price: 26,
    icon: '☁️',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    flavor: '奶泡绵密、咖啡浓郁',
    description: '1:1:1的完美比例，浓缩、牛奶、奶泡三位一体，经典意式风味。',
    ingredients: ['意式浓缩咖啡 30ml', '鲜牛奶 60ml', '奶泡 60ml', '可可粉'],
    cupSizes: [
      { id: 'S', name: '小杯', ml: 180, priceAdd: 0 },
      { id: 'M', name: '中杯', ml: 270, priceAdd: 4 },
      { id: 'L', name: '大杯', ml: 360, priceAdd: 8 }
    ]
  },
  {
    id: 7,
    categoryId: 'espresso',
    name: '摩卡',
    nameEn: 'Mocha',
    price: 30,
    icon: '🍫',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400',
    flavor: '巧克力醇厚、微苦回甘',
    description: '巧克力与咖啡的浪漫邂逅，甜蜜又不失咖啡的深邃。',
    ingredients: ['巧克力酱 20ml', '意式浓缩 30ml', '鲜牛奶 150ml', '鲜奶油'],
    cupSizes: [
      { id: 'S', name: '小杯', ml: 240, priceAdd: 0 },
      { id: 'M', name: '中杯', ml: 360, priceAdd: 4 },
      { id: 'L', name: '大杯', ml: 480, priceAdd: 8 }
    ]
  },
  {
    id: 8,
    categoryId: 'non-coffee',
    name: '抹茶拿铁',
    nameEn: 'Matcha Latte',
    price: 28,
    icon: '🍵',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400',
    flavor: '抹茶清香、奶香温润',
    description: '宇治抹茶与鲜牛奶的融合，清新淡雅，回味无穷。',
    ingredients: ['宇治抹茶粉 5g', '热水 20ml', '鲜牛奶 200ml'],
    cupSizes: [
      { id: 'S', name: '小杯', ml: 240, priceAdd: 0 },
      { id: 'M', name: '中杯', ml: 360, priceAdd: 4 },
      { id: 'L', name: '大杯', ml: 480, priceAdd: 8 }
    ]
  },
  {
    id: 9,
    categoryId: 'non-coffee',
    name: '热可可',
    nameEn: 'Hot Cocoa',
    price: 25,
    icon: '🍩',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400',
    flavor: '浓郁巧克力、甜蜜温暖',
    description: '浓郁的热巧克力，冬日暖心首选，搭配棉花糖更美味。',
    ingredients: ['可可粉 15g', '黑巧克力 20g', '鲜牛奶 250ml', '棉花糖'],
    cupSizes: [
      { id: 'S', name: '小杯', ml: 240, priceAdd: 0 },
      { id: 'M', name: '中杯', ml: 360, priceAdd: 4 },
      { id: 'L', name: '大杯', ml: 480, priceAdd: 8 }
    ]
  },
  {
    id: 10,
    categoryId: 'non-coffee',
    name: '蜜桃乌龙',
    nameEn: 'Peach Oolong',
    price: 24,
    icon: '🍑',
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400',
    flavor: '蜜桃香甜、乌龙回甘',
    description: '新鲜蜜桃搭配清香乌龙茶，果香与茶香的完美结合。',
    ingredients: ['乌龙茶包 1个', '新鲜蜜桃 50g', '蜂蜜 10ml', '热水 300ml'],
    cupSizes: [
      { id: 'S', name: '小杯', ml: 300, priceAdd: 0 },
      { id: 'M', name: '中杯', ml: 450, priceAdd: 4 },
      { id: 'L', name: '大杯', ml: 600, priceAdd: 8 }
    ]
  },
  {
    id: 11,
    categoryId: 'non-coffee',
    name: '玫瑰荔枝气泡',
    nameEn: 'Rose Lychee Soda',
    price: 26,
    icon: '🌹',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400',
    flavor: '玫瑰芬芳、荔枝清甜、气泡清爽',
    description: '浪漫玫瑰与甜美荔枝的碰撞，夏日清凉首选。',
    ingredients: ['玫瑰糖浆 15ml', '新鲜荔枝 3颗', '气泡水 250ml', '干玫瑰花瓣'],
    cupSizes: [
      { id: 'S', name: '小杯', ml: 300, priceAdd: 0 },
      { id: 'M', name: '中杯', ml: 450, priceAdd: 4 },
      { id: 'L', name: '大杯', ml: 600, priceAdd: 8 }
    ]
  },
  {
    id: 12,
    categoryId: 'pour-over',
    name: '哥伦比亚',
    nameEn: 'Colombia',
    price: 30,
    icon: '🍎',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400',
    flavor: '红苹果、坚果、巧克力尾韵',
    description: '来自哥伦比亚的精品豆，平衡的酸甜感，适合大多数咖啡爱好者。',
    ingredients: ['哥伦比亚慧兰咖啡豆 15g', '纯净水 220ml', '水温 92°C'],
    cupSizes: [
      { id: 'S', name: '小杯', ml: 200, priceAdd: 0 },
      { id: 'M', name: '中杯', ml: 300, priceAdd: 5 },
      { id: 'L', name: '大杯', ml: 400, priceAdd: 10 }
    ]
  }
]

export const banners = [
  {
    id: 1,
    title: '夏日限定',
    subtitle: 'Summer Special',
    description: '瑰夏冷萃 · 限时8折',
    gradient: 'linear-gradient(135deg, #D4A574 0%, #8B6F47 100%)',
    icon: '❄️'
  },
  {
    id: 2,
    title: '当季特调',
    subtitle: 'Seasonal Drink',
    description: '桂花拿铁 · 秋日桂香',
    gradient: 'linear-gradient(135deg, #E8C99B 0%, #C19A6B 100%)',
    icon: '🌼'
  },
  {
    id: 3,
    title: '会员专享',
    subtitle: 'Members Only',
    description: '手冲系列第二杯半价',
    gradient: 'linear-gradient(135deg, #B8956F 0%, #6F4E37 100%)',
    icon: '✨'
  }
]
