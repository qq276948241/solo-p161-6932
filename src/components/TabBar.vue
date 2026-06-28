<template>
  <div class="tab-bar">
    <router-link
      v-for="item in tabs"
      :key="item.path"
      :to="item.path"
      class="tab-item"
      :class="{ active: isActive(item.path) }"
    >
      <div class="tab-icon">
        <span class="icon">{{ item.icon }}</span>
        <span v-if="item.path === '/cart' && cartCount > 0" class="badge">{{ cartCount > 99 ? '99+' : cartCount }}</span>
      </div>
      <span class="tab-label">{{ item.label }}</span>
      <span class="tab-label-en font-handwriting">{{ item.labelEn }}</span>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCart, getCartCount } from '../utils/storage.js'

const route = useRoute()

const tabs = [
  { path: '/home', label: '菜单', labelEn: 'Menu', icon: '🏠' },
  { path: '/cart', label: '点单', labelEn: 'Cart', icon: '🛒' },
  { path: '/orders', label: '订单', labelEn: 'Orders', icon: '📋' }
]

const cart = computed(() => getCart())
const cartCount = computed(() => getCartCount(cart.value))

function isActive(path) {
  return route.path === path
}
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: calc(var(--nav-height) + var(--safe-bottom));
  padding-bottom: var(--safe-bottom);
  background-color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -2px 12px rgba(62, 39, 35, 0.06);
  z-index: 50;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 2px;
  transition: all 0.25s ease;
}

.tab-icon {
  position: relative;
  font-size: 22px;
  line-height: 1;
  transition: transform 0.25s ease;
}

.tab-item.active .tab-icon {
  transform: scale(1.15);
}

.badge {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background-color: var(--color-caramel);
  color: var(--color-white);
  font-size: 10px;
  font-weight: 700;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: color 0.25s ease;
}

.tab-label-en {
  font-size: 13px;
  line-height: 1;
  color: var(--color-text-muted);
  transition: color 0.25s ease;
}

.tab-item.active .tab-label,
.tab-item.active .tab-label-en {
  color: var(--color-brown-deep);
}

.tab-item.active .tab-label-en {
  color: var(--color-caramel-dark);
  font-weight: 700;
}
</style>
