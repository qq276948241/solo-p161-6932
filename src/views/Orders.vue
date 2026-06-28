<template>
  <div class="page-container orders-page">
    <div class="orders-header">
      <h1 class="page-title">我的订单</h1>
      <p class="page-title-en font-handwriting">My Orders</p>
    </div>

    <div v-if="orders.length === 0" class="empty-orders">
      <span class="empty-icon">📋</span>
      <h3 class="empty-title">暂无订单</h3>
      <p class="empty-desc">还没有下过单呢，去挑一杯咖啡吧～</p>
      <router-link to="/home" class="go-menu-btn">
        去选咖啡
      </router-link>
    </div>

    <div v-else class="orders-list">
      <div
        v-for="order in orders"
        :key="order.id"
        class="order-card"
      >
        <div class="order-card-header">
          <div class="order-time-wrap">
            <span class="order-time">{{ formatDate(order.createdAt) }}</span>
            <span class="order-id font-handwriting">#{{ order.id.slice(-6) }}</span>
          </div>
          <span class="status-tag" :class="order.status">
            {{ order.statusText }}
          </span>
        </div>

        <div class="order-items">
          <div class="thumbs-wrap">
            <div
              v-for="(item, index) in order.items.slice(0, 4)"
              :key="item.cartItemId"
              class="thumb-item"
              :style="{ zIndex: 5 - index }"
            >
              <span class="thumb-emoji">{{ item.icon }}</span>
            </div>
            <div v-if="order.items.length > 4" class="thumb-more">
              +{{ order.items.length - 4 }}
            </div>
          </div>

          <div class="items-count">
            共 {{ getOrderDrinkCount(order) }} 杯
          </div>
        </div>

        <div class="order-card-footer">
          <div class="drinks-names">
            <span v-for="(item, i) in order.items.slice(0, 3)" :key="i" class="drink-chip">
              {{ item.name }}
              <span v-if="i < order.items.length - 1 && i < 2" class="chip-sep">、</span>
            </span>
            <span v-if="order.items.length > 3" class="drink-chip">
              等{{ order.items.length }}款
            </span>
          </div>
          <div class="order-total">
            <span class="total-label">实付</span>
            <span class="total-amount">
              <span class="currency">¥</span>{{ order.total }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrders, formatDate } from '../utils/storage.js'

const orders = ref([])

function getOrderDrinkCount(order) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

onMounted(() => {
  orders.value = getOrders().sort((a, b) => b.createdAt - a.createdAt)
})
</script>

<style scoped>
.orders-page {
  padding-bottom: calc(var(--nav-height) + var(--safe-bottom) + 20px);
}

.orders-header {
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

.empty-orders {
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

.orders-list {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.order-card {
  background-color: var(--color-white);
  border-radius: var(--radius-md);
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

.order-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.order-time-wrap {
  display: flex;
  flex-direction: column;
}

.order-time {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.order-id {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1;
  margin-top: 2px;
}

.status-tag {
  padding: 5px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
}

.status-tag.completed {
  background-color: var(--color-caramel-light);
  color: var(--color-brown-deep);
}

.status-tag.pending {
  background-color: #FFF3E0;
  color: #E65100;
}

.order-items {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: var(--color-cream);
  border-radius: var(--radius-sm);
  margin-bottom: 14px;
}

.thumbs-wrap {
  display: flex;
  align-items: center;
  position: relative;
}

.thumb-item {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-cream-dark) 0%, var(--color-caramel-light) 100%);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -10px;
  border: 2px solid var(--color-cream);
}

.thumb-item:first-child {
  margin-left: 0;
}

.thumb-emoji {
  font-size: 22px;
}

.thumb-more {
  width: 40px;
  height: 40px;
  background-color: var(--color-brown-deep);
  color: var(--color-white);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-left: -10px;
  border: 2px solid var(--color-cream);
}

.items-count {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.order-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.drinks-names {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
}

.drink-chip {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.chip-sep {
  color: var(--color-text-muted);
}

.order-total {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-shrink: 0;
}

.total-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.total-amount {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-brown-deep);
}

.total-amount .currency {
  font-size: 13px;
  font-weight: 600;
}
</style>
