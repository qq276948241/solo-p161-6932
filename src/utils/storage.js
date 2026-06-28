const CART_KEY = 'coffee_shop_cart'
const ORDER_KEY = 'coffee_shop_orders'
const FAVORITES_KEY = 'favorites'

export function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  } catch (e) {
    console.error('Failed to save cart:', e)
  }
}

export function clearCart() {
  localStorage.removeItem(CART_KEY)
}

export function addToCart(drink, cupSize, quantity = 1) {
  const cart = getCart()
  const cartItemId = `${drink.id}_${cupSize.id}`
  const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId)

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity
  } else {
    const size = drink.cupSizes.find(s => s.id === cupSize.id)
    cart.push({
      cartItemId,
      drinkId: drink.id,
      name: drink.name,
      nameEn: drink.nameEn,
      icon: drink.icon,
      image: drink.image,
      basePrice: drink.price,
      cupSize: {
        id: size.id,
        name: size.name,
        ml: size.ml,
        priceAdd: size.priceAdd
      },
      quantity
    })
  }

  saveCart(cart)
  return cart
}

export function updateCartItemQuantity(cartItemId, quantity) {
  const cart = getCart()
  const index = cart.findIndex(item => item.cartItemId === cartItemId)

  if (index > -1) {
    if (quantity <= 0) {
      cart.splice(index, 1)
    } else {
      cart[index].quantity = quantity
    }
    saveCart(cart)
  }

  return cart
}

export function updateCartItemCupSize(cartItemId, drink, newCupSize) {
  const cart = getCart()
  const index = cart.findIndex(item => item.cartItemId === cartItemId)

  if (index > -1) {
    const oldItem = cart[index]
    const newCartItemId = `${drink.id}_${newCupSize.id}`
    const existingIndex = cart.findIndex(item => item.cartItemId === newCartItemId && item.cartItemId !== cartItemId)

    if (existingIndex > -1) {
      cart[existingIndex].quantity += oldItem.quantity
      cart.splice(index, 1)
    } else {
      cart[index].cartItemId = newCartItemId
      cart[index].cupSize = {
        id: newCupSize.id,
        name: newCupSize.name,
        ml: newCupSize.ml,
        priceAdd: newCupSize.priceAdd
      }
    }
    saveCart(cart)
  }

  return cart
}

export function removeFromCart(cartItemId) {
  const cart = getCart()
  const newCart = cart.filter(item => item.cartItemId !== cartItemId)
  saveCart(newCart)
  return newCart
}

export function getCartItemPrice(item) {
  return (item.basePrice + item.cupSize.priceAdd) * item.quantity
}

export function getCartTotal(cart) {
  return cart.reduce((total, item) => total + getCartItemPrice(item), 0)
}

export function getCartCount(cart) {
  return cart.reduce((count, item) => count + item.quantity, 0)
}

export function getOrders() {
  try {
    const data = localStorage.getItem(ORDER_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

export function saveOrders(orders) {
  try {
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders))
  } catch (e) {
    console.error('Failed to save orders:', e)
  }
}

export function createOrder(cart) {
  if (cart.length === 0) return null

  const orders = getOrders()
  const total = getCartTotal(cart)
  const order = {
    id: `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: Date.now(),
    items: cart.map(item => ({ ...item })),
    total,
    status: 'completed',
    statusText: '已完成'
  }

  orders.unshift(order)
  saveOrders(orders)
  clearCart()

  return order
}

export function getFavorites() {
  try {
    const data = localStorage.getItem(FAVORITES_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch (e) {
    console.error('Failed to save favorites:', e)
  }
}

export function toggleFavorite(drinkId) {
  const favorites = getFavorites()
  const index = favorites.indexOf(drinkId)
  if (index > -1) {
    favorites.splice(index, 1)
  } else {
    favorites.push(drinkId)
  }
  saveFavorites(favorites)
  return favorites
}

export function isFavorite(drinkId) {
  return getFavorites().includes(drinkId)
}

export function formatDate(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
