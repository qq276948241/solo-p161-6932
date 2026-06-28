import { ref } from 'vue'
import { getFavorites, saveFavorites } from '../utils/storage.js'

export function useFavorites() {
  const favoriteIds = ref(getFavorites())

  function toggle(drinkId) {
    const prev = favoriteIds.value
    const filtered = prev.filter(id => id !== drinkId)
    if (filtered.length === prev.length) {
      favoriteIds.value = [...filtered, drinkId]
    } else {
      favoriteIds.value = filtered.length ? [...filtered] : []
    }
    saveFavorites(favoriteIds.value)
  }

  function isFav(drinkId) {
    return favoriteIds.value.includes(drinkId)
  }

  function refresh() {
    favoriteIds.value = getFavorites()
  }

  return {
    favoriteIds,
    toggle,
    isFav,
    refresh
  }
}
