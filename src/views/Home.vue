<template>
  <div class="page-container home-page">
    <div class="shop-header">
      <div class="shop-logo">☕</div>
      <div class="shop-info">
        <h1 class="shop-name">慢时光咖啡</h1>
        <p class="shop-name-en font-handwriting">Slow Time Coffee</p>
      </div>
    </div>

    <div class="banner-carousel">
      <div class="banner-track" :style="{ transform: `translateX(-${currentBanner * 100}%)` }">
        <div
          v-for="banner in banners"
          :key="banner.id"
          class="banner-slide"
          :style="{ background: banner.gradient }"
        >
          <div class="banner-content">
            <span class="banner-icon">{{ banner.icon }}</span>
            <div class="banner-text">
              <h3 class="banner-subtitle font-handwriting">{{ banner.subtitle }}</h3>
              <h2 class="banner-title">{{ banner.title }}</h2>
              <p class="banner-desc">{{ banner.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="banner-dots">
        <span
          v-for="(banner, index) in banners"
          :key="banner.id"
          class="dot"
          :class="{ active: currentBanner === index }"
          @click="currentBanner = index"
        ></span>
      </div>
    </div>

    <div class="category-tabs">
      <div
        v-for="cat in categoryList"
        :key="cat.id"
        class="category-tab"
        :class="{ active: currentCategory === cat.id }"
        @click="currentCategory = cat.id"
      >
        <span class="cat-name">{{ cat.name }}</span>
        <span class="cat-name-en font-handwriting">{{ cat.nameEn }}</span>
      </div>
    </div>

    <div v-if="currentCategory === 'favorites' && filteredDrinks.length === 0" class="empty-favorites">
      <svg class="empty-star-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-caramel)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>
      </svg>
      <h3 class="empty-fav-title">还没有收藏</h3>
      <p class="empty-fav-desc">点击饮品卡片上的星星即可收藏</p>
    </div>

    <div v-else class="drinks-grid">
      <div
        v-for="drink in filteredDrinks"
        :key="drink.id"
        class="drink-card"
        @click="openDetail(drink)"
      >
        <div class="drink-image-wrap">
          <span class="drink-emoji">{{ drink.icon }}</span>
          <button class="fav-btn" :class="{ favorited: favoriteIds.includes(drink.id) }" @click.stop="handleToggleFavorite(drink.id)">
            <svg v-if="!favoriteIds.includes(drink.id)" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-caramel)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="var(--color-caramel)" stroke="var(--color-caramel)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/>
            </svg>
          </button>
        </div>
        <div class="drink-info">
          <div class="drink-names">
            <h3 class="drink-name">{{ drink.name }}</h3>
            <p class="drink-name-en font-handwriting">{{ drink.nameEn }}</p>
          </div>
          <p class="drink-flavor text-ellipsis-2">{{ drink.flavor }}</p>
          <div class="drink-bottom">
            <span class="drink-price">
              <span class="currency">¥</span>{{ drink.price }}
            </span>
            <button class="add-btn" @click.stop="quickAdd(drink)">
              <span>+</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showDetail" class="mask" @click="closeDetail"></div>
    </Transition>
    <Transition name="slide-right">
      <div v-if="showDetail && selectedDrink" class="detail-drawer">
        <div class="drawer-header">
          <button class="close-btn" @click="closeDetail">×</button>
        </div>

        <div class="drawer-image-wrap">
          <span class="drawer-emoji">{{ selectedDrink.icon }}</span>
        </div>

        <div class="drawer-content">
          <div class="drink-title-row">
            <h2 class="drawer-name">{{ selectedDrink.name }}</h2>
            <p class="drawer-name-en font-handwriting">{{ selectedDrink.nameEn }}</p>
          </div>

          <p class="drawer-flavor">{{ selectedDrink.flavor }}</p>
          <p class="drawer-desc">{{ selectedDrink.description }}</p>

          <div class="drawer-section">
            <h4 class="section-title">配料</h4>
            <ul class="ingredients-list">
              <li v-for="(ing, i) in selectedDrink.ingredients" :key="i">
                <span class="dot-bullet"></span>{{ ing }}
              </li>
            </ul>
          </div>

          <div class="drawer-section">
            <h4 class="section-title">选择杯型</h4>
            <div class="cup-size-options">
              <div
                v-for="size in selectedDrink.cupSizes"
                :key="size.id"
                class="cup-size-option"
                :class="{ active: selectedSizeId === size.id }"
                @click="selectedSizeId = size.id"
              >
                <span class="size-name">{{ size.name }}</span>
                <span class="size-ml">{{ size.ml }}ml</span>
                <span v-if="size.priceAdd > 0" class="size-add">+¥{{ size.priceAdd }}</span>
              </div>
            </div>
          </div>

          <div class="drawer-section">
            <h4 class="section-title">数量</h4>
            <div class="quantity-control">
              <button class="qty-btn" :disabled="quantity <= 1" @click="quantity--">−</button>
              <span class="qty-value">{{ quantity }}</span>
              <button class="qty-btn" @click="quantity++">+</button>
            </div>
          </div>
        </div>

        <div class="drawer-footer">
          <div class="total-price">
            <span class="total-label">合计</span>
            <span class="total-amount">
              <span class="currency">¥</span>{{ currentTotalPrice }}
            </span>
          </div>
          <button class="add-cart-btn" @click="addToCart">
            加入购物车
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { categories, drinks, banners } from '../data/menu.js'
import { addToCart as addToCartStorage, getFavorites, toggleFavorite } from '../utils/storage.js'

const currentBanner = ref(0)
const currentCategory = ref('pour-over')
const showDetail = ref(false)
const selectedDrink = ref(null)
const selectedSizeId = ref('M')
const quantity = ref(1)
const favoriteIds = ref(getFavorites())

let bannerTimer = null

const categoryList = computed(() => {
  return [
    ...categories,
    { id: 'favorites', name: '收藏', nameEn: 'Favorites' }
  ]
})

const filteredDrinks = computed(() => {
  if (currentCategory.value === 'favorites') {
    return drinks.filter(d => favoriteIds.value.includes(d.id))
  }
  return drinks.filter(d => d.categoryId === currentCategory.value)
})

const selectedSize = computed(() => {
  if (!selectedDrink.value) return null
  return selectedDrink.value.cupSizes.find(s => s.id === selectedSizeId.value)
})

const currentTotalPrice = computed(() => {
  if (!selectedDrink.value || !selectedSize.value) return 0
  return (selectedDrink.value.price + selectedSize.value.priceAdd) * quantity.value
})

function openDetail(drink) {
  selectedDrink.value = drink
  selectedSizeId.value = drink.cupSizes[1]?.id || drink.cupSizes[0].id
  quantity.value = 1
  showDetail.value = true
}

function closeDetail() {
  showDetail.value = false
}

function handleToggleFavorite(drinkId) {
  favoriteIds.value = toggleFavorite(drinkId)
}

function quickAdd(drink) {
  const size = drink.cupSizes[1] || drink.cupSizes[0]
  addToCartStorage(drink, size, 1)
}

function addToCart() {
  if (!selectedDrink.value || !selectedSize.value) return
  addToCartStorage(selectedDrink.value, selectedSize.value, quantity.value)
  closeDetail()
}

function startBannerAutoPlay() {
  bannerTimer = setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % banners.length
  }, 4000)
}

function stopBannerAutoPlay() {
  if (bannerTimer) {
    clearInterval(bannerTimer)
    bannerTimer = null
  }
}

onMounted(() => {
  startBannerAutoPlay()
  favoriteIds.value = getFavorites()
})

onUnmounted(() => {
  stopBannerAutoPlay()
})
</script>

<style scoped>
.home-page {
  padding-bottom: calc(var(--nav-height) + var(--safe-bottom) + 20px);
}

.shop-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 20px 16px;
  background: linear-gradient(180deg, var(--color-cream-dark) 0%, var(--color-cream) 100%);
}

.shop-logo {
  width: 52px;
  height: 52px;
  background: var(--color-brown-deep);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.shop-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-brown-deep);
  line-height: 1.2;
}

.shop-name-en {
  font-size: 20px;
  color: var(--color-caramel-dark);
  line-height: 1;
  margin-top: 2px;
}

.banner-carousel {
  margin: 0 20px 20px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  box-shadow: var(--shadow-md);
}

.banner-track {
  display: flex;
  transition: transform 0.5s ease;
}

.banner-slide {
  min-width: 100%;
  height: 140px;
  padding: 20px;
  display: flex;
  align-items: center;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.banner-icon {
  font-size: 52px;
}

.banner-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1;
}

.banner-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-white);
  margin: 4px 0 4px;
}

.banner-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

.banner-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
}

.dot.active {
  width: 18px;
  background-color: var(--color-white);
}

.category-tabs {
  display: flex;
  padding: 0 20px;
  margin-bottom: 16px;
  gap: 8px;
  overflow-x: auto;
}

.category-tab {
  flex-shrink: 0;
  padding: 8px 18px;
  background-color: var(--color-white);
  border-radius: var(--radius-full);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  transition: all 0.25s ease;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
}

.category-tab.active {
  background: linear-gradient(135deg, var(--color-brown-deep) 0%, var(--color-brown) 100%);
}

.cat-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  transition: color 0.25s ease;
}

.cat-name-en {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1;
  transition: color 0.25s ease;
}

.category-tab.active .cat-name {
  color: var(--color-white);
}

.category-tab.active .cat-name-en {
  color: var(--color-caramel-light);
}

.drinks-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 20px;
}

.drink-card {
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  padding: 14px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.drink-card:active {
  transform: scale(0.97);
}

.drink-image-wrap {
  width: 100%;
  height: 80px;
  background: linear-gradient(135deg, var(--color-cream-dark) 0%, var(--color-caramel-light) 100%);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  position: relative;
}

.fav-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  background-color: rgba(255, 248, 240, 0.85);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background-color 0.2s ease;
  backdrop-filter: blur(4px);
}

.fav-btn:active {
  transform: scale(0.85);
}

.fav-btn.favorited {
  background-color: rgba(212, 165, 116, 0.2);
}

.empty-favorites {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
}

.empty-star-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-fav-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.empty-fav-desc {
  font-size: 13px;
  color: var(--color-text-muted);
}

.drink-emoji {
  font-size: 42px;
}

.drink-names {
  margin-bottom: 4px;
}

.drink-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.drink-name-en {
  font-size: 14px;
  color: var(--color-caramel-dark);
  line-height: 1;
}

.drink-flavor {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 10px;
  min-height: 34px;
}

.drink-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.drink-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-brown-deep);
}

.drink-price .currency {
  font-size: 13px;
  font-weight: 600;
}

.add-btn {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, var(--color-brown-deep) 0%, var(--color-brown) 100%);
  color: var(--color-white);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 1;
  transition: transform 0.2s ease;
}

.add-btn:active {
  transform: scale(0.9);
}

.detail-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 88%;
  max-width: 420px;
  background-color: var(--color-cream);
  z-index: 101;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer-header {
  padding: 16px 16px 0;
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  width: 36px;
  height: 36px;
  background-color: var(--color-white);
  border-radius: var(--radius-full);
  font-size: 24px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  line-height: 1;
}

.drawer-image-wrap {
  height: 160px;
  margin: 12px 20px 0;
  background: linear-gradient(135deg, var(--color-cream-dark) 0%, var(--color-caramel-light) 100%);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-emoji {
  font-size: 80px;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.drink-title-row {
  margin-bottom: 8px;
}

.drawer-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.drawer-name-en {
  font-size: 20px;
  color: var(--color-caramel-dark);
  line-height: 1;
  margin-top: 2px;
}

.drawer-flavor {
  font-size: 14px;
  color: var(--color-brown);
  font-weight: 500;
  margin-bottom: 10px;
}

.drawer-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: 20px;
}

.drawer-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ingredients-list li {
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot-bullet {
  width: 5px;
  height: 5px;
  background-color: var(--color-caramel);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.cup-size-options {
  display: flex;
  gap: 10px;
}

.cup-size-option {
  flex: 1;
  padding: 12px 8px;
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: 2px solid transparent;
  transition: all 0.25s ease;
  cursor: pointer;
}

.cup-size-option.active {
  border-color: var(--color-brown-deep);
  background-color: var(--color-cream-dark);
}

.size-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.size-ml {
  font-size: 12px;
  color: var(--color-text-muted);
}

.size-add {
  font-size: 12px;
  color: var(--color-caramel-dark);
  font-weight: 500;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: var(--color-white);
  padding: 8px;
  border-radius: var(--radius-md);
  width: fit-content;
}

.qty-btn {
  width: 36px;
  height: 36px;
  background-color: var(--color-cream-dark);
  border-radius: var(--radius-sm);
  font-size: 22px;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background-color 0.2s ease;
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-btn:not(:disabled):active {
  background-color: var(--color-caramel-light);
}

.qty-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  min-width: 30px;
  text-align: center;
}

.drawer-footer {
  padding: 16px 20px calc(16px + var(--safe-bottom));
  background-color: var(--color-white);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.total-price {
  display: flex;
  flex-direction: column;
}

.total-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.total-amount {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-brown-deep);
}

.total-amount .currency {
  font-size: 16px;
  font-weight: 600;
}

.add-cart-btn {
  flex: 1;
  height: 48px;
  background: linear-gradient(135deg, var(--color-brown-deep) 0%, var(--color-brown) 100%);
  color: var(--color-white);
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: transform 0.2s ease;
}

.add-cart-btn:active {
  transform: scale(0.97);
}
</style>
