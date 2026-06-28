import { ref, onMounted } from 'vue'
import { getFavorites, toggleFavorite as storageToggleFavorite } from '../utils/storage.js'

export function useFavorites() {
  const favoriteIds = ref([])

  function refresh() {
    favoriteIds.value = getFavorites()
  }

  function toggle(drinkId) {
    favoriteIds.value = storageToggleFavorite(drinkId)
  }

  function isFav(drinkId) {
    return favoriteIds.value.includes(drinkId)
  }

  onMounted(() => {
    refresh()
  })

  return {
    favoriteIds,
    toggle,
    isFav,
    refresh
  }
}
