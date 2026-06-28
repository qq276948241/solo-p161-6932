<template>
  <div class="page-container cart-page">
    <div class="cart-header">
      <h1 class="page-title">我的点单</h1>
      <p class="page-title-en font-handwriting">My Order</p>
    </div>

    <div v-if="cart.length === 0" class="empty-cart">
      <span class="empty-icon">☕</span>
      <h3 class="empty-title">购物车空空如也</h3>
      <p class="empty-desc">快去挑选一杯喜欢的咖啡吧～</p>
      <router-link to="/home" class="go-menu-btn">
        去选咖啡
      </router-link>
    </div>

    <div v-else class="cart-list">
      <div
        v-for="item in cart"
        :key="item.cartItemId"
        class="cart-item"
      >
        <div class="item-image-wrap">
          <span class="item-emoji">{{ item.icon }}</span>
        </div>

        <div class="item-info">
          <div class="item-names">
            <h3 class="item-name">{{ item.name }}</h3>
            <p class="item-name-en font-handwriting">{{ item.nameEn }}</p>
          </div>

          <div class="cup-size-selector">
            <button
              v-for="size in getDrinkCupSizes(item.drinkId)"
              :key="size.id"
              class="size-chip"
              :class="{ active: item.cupSize.id === size.id }"
              @click="changeCupSize(item, size)"
            >
              {{ size.name }}
              <span v-if="size.priceAdd > 0" class="chip-add">+¥{{ size.priceAdd }}</span>
            </button>
          </div>

          <div class="item-bottom">
            <span class="item-price">
              <span class="currency">¥</span>{{ getItemPrice(item) }}
            </span>

            <div class="quantity-control">
              <button class="qty-btn" @click="decreaseQty(item)">−</button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button class="qty-btn" @click="increaseQty(item)">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="cart.length > 0" class="checkout-bar">
      <div class="checkout-info">
        <div class="total-row">
          <span class="total-label">合计</span>
          <span class="total-amount">
            <span class="currency">¥</span>{{ cartTotal }}
          </span>
        </div>
        <span class="item-count">共 {{ cartCount }} 杯</span>
      </div>
      <button class="checkout-btn" @click="showConfirmModal = true">
        去下单
      </button>
    </div>

    <Transition name="fade">
      <div v-if="showConfirmModal" class="mask" @click="showConfirmModal = false"></div>
    </Transition>
    <Transition name="slide-up">
      <div v-if="showConfirmModal" class="confirm-modal">
        <div class="modal-content">
          <div class="modal-header">
            <span class="modal-icon">🧾</span>
            <h2 class="modal-title">确认下单</h2>
          </div>

          <div class="order-summary">
            <div class="summary-list">
              <div v-for="item in cart" :key="item.cartItemId" class="summary-item">
                <div class="summary-left">
                  <span class="summary-emoji">{{ item.icon }}</span>
                  <div class="summary-info">
                    <span class="summary-name">{{ item.name }}</span>
                    <span class="summary-size">{{ item.cupSize.name }} × {{ item.quantity }}</span>
                  </div>
                </div>
                <span class="summary-price">¥{{ getItemPrice(item) }}</span>
              </div>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-total">
              <span class="summary-total-label">应付金额</span>
              <span class="summary-total-amount">
                <span class="currency">¥</span>{{ cartTotal }}
              </span>
            </div>
          </div>

          <div class="modal-actions">
            <button class="modal-btn cancel-btn" @click="showConfirmModal = false">
              取消
            </button>
            <button class="modal-btn confirm-btn" @click="submitOrder">
              确认支付
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showSuccessToast" class="success-toast">
        <span class="toast-icon">✓</span>
        <span class="toast-text">下单成功！</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { drinks } from '../data/menu.js'
import {
  getCart,
  updateCartItemQuantity,
  updateCartItemCupSize,
  getCartItemPrice,
  getCartTotal,
  getCartCount,
  createOrder
} from '../utils/storage.js'

const router = useRouter()

const cart = ref(getCart())
const showConfirmModal = ref(false)
const showSuccessToast = ref(false)

const cartTotal = computed(() => getCartTotal(cart.value))
const cartCount = computed(() => getCartCount(cart.value))

function getDrinkCupSizes(drinkId) {
  const drink = drinks.find(d => d.id === drinkId)
  return drink ? drink.cupSizes : []
}

function getItemPrice(item) {
  return getCartItemPrice(item)
}

function refreshCart() {
  cart.value = getCart()
}

function increaseQty(item) {
  cart.value = updateCartItemQuantity(item.cartItemId, item.quantity + 1)
}

function decreaseQty(item) {
  if (item.quantity <= 1) {
    cart.value = updateCartItemQuantity(item.cartItemId, 0)
  } else {
    cart.value = updateCartItemQuantity(item.cartItemId, item.quantity - 1)
  }
}

function changeCupSize(item, newSize) {
  const drink = drinks.find(d => d.id === item.drinkId)
  if (drink) {
    cart.value = updateCartItemCupSize(item.cartItemId, drink, newSize)
  }
}

function submitOrder() {
  createOrder(cart.value)
  showConfirmModal.value = false
  showSuccessToast.value = true

  setTimeout(() => {
    showSuccessToast.value = false
    router.push('/orders')
  }, 1200)
}

watch(() => cart.value, () => {
  if (cart.value.length === 0 && showConfirmModal.value) {
    showConfirmModal.value = false
  }
}, { deep: true })
</script>

<style scoped>
.cart-page {
  padding-bottom: calc(var(--nav-height) + var(--safe-bottom) + 100px);
}

.cart-header {
  padding: 20px 20px 16px;
  background: linear-gradient(180deg, var(--color-cream-dark) 0%, var(--color-cream) 100%);
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-brown-deep);
  line-height: 1.2;
}

.page-title-en {
  font-size: 20px;
  color: var(--color-caramel-dark);
  line-height: 1;
  margin-top: 2px;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
}

.empty-icon {
  font-size: 72px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-bottom: 28px;
}

.go-menu-btn {
  padding: 12px 36px;
  background: linear-gradient(135deg, var(--color-brown-deep) 0%, var(--color-brown) 100%);
  color: var(--color-white);
  font-size: 15px;
  font-weight: 600;
  border-radius: var(--radius-full);
  transition: transform 0.2s ease;
}

.go-menu-btn:active {
  transform: scale(0.97);
}

.cart-list {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cart-item {
  display: flex;
  gap: 14px;
  padding: 14px;
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.item-image-wrap {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--color-cream-dark) 0%, var(--color-caramel-light) 100%);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-emoji {
  font-size: 38px;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.item-names {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.item-name-en {
  font-size: 14px;
  color: var(--color-caramel-dark);
  line-height: 1;
}

.cup-size-selector {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.size-chip {
  padding: 4px 10px;
  background-color: var(--color-cream-dark);
  border-radius: var(--radius-full);
  font-size: 12px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 2px;
  transition: all 0.2s ease;
}

.size-chip.active {
  background-color: var(--color-brown-deep);
  color: var(--color-white);
}

.chip-add {
  font-size: 11px;
  opacity: 0.8;
}

.item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.item-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-brown-deep);
}

.item-price .currency {
  font-size: 13px;
  font-weight: 600;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 14px;
  background-color: var(--color-cream-dark);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

.qty-btn {
  width: 26px;
  height: 26px;
  background-color: var(--color-white);
  border-radius: var(--radius-sm);
  font-size: 18px;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background-color 0.2s ease;
}

.qty-btn:active {
  background-color: var(--color-caramel-light);
}

.qty-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 20px;
  text-align: center;
}

.checkout-bar {
  position: fixed;
  bottom: calc(var(--nav-height) + var(--safe-bottom));
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  padding: 12px 20px;
  background-color: var(--color-white);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 -2px 12px rgba(62, 39, 35, 0.08);
  z-index: 40;
}

.checkout-info {
  display: flex;
  flex-direction: column;
}

.total-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.total-label {
  font-size: 13px;
  color: var(--color-text-secondary);
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

.item-count {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.checkout-btn {
  height: 48px;
  padding: 0 36px;
  background: linear-gradient(135deg, var(--color-brown-deep) 0%, var(--color-brown) 100%);
  color: var(--color-white);
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: transform 0.2s ease;
}

.checkout-btn:active {
  transform: scale(0.97);
}

.confirm-modal {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  z-index: 101;
}

.modal-content {
  background-color: var(--color-white);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding: 24px 20px calc(24px + var(--safe-bottom));
  max-height: 75vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.modal-icon {
  font-size: 44px;
  margin-bottom: 8px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.order-summary {
  background-color: var(--color-cream);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 20px;
  overflow-y: auto;
  flex: 1;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.summary-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.summary-emoji {
  font-size: 28px;
  flex-shrink: 0;
}

.summary-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.summary-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.summary-size {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.summary-price {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-brown-deep);
  flex-shrink: 0;
}

.summary-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 16px 0;
}

.summary-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-total-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.summary-total-amount {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-brown-deep);
}

.summary-total-amount .currency {
  font-size: 16px;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: transform 0.2s ease;
}

.modal-btn:active {
  transform: scale(0.97);
}

.cancel-btn {
  background-color: var(--color-cream-dark);
  color: var(--color-text-secondary);
}

.confirm-btn {
  background: linear-gradient(135deg, var(--color-brown-deep) 0%, var(--color-brown) 100%);
  color: var(--color-white);
}

.success-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 28px 44px;
  background-color: var(--color-brown-deep);
  border-radius: var(--radius-lg);
  z-index: 200;
  box-shadow: var(--shadow-lg);
}

.toast-icon {
  width: 48px;
  height: 48px;
  background-color: var(--color-white);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--color-brown-deep);
  font-weight: 700;
}

.toast-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-white);
}
</style>
