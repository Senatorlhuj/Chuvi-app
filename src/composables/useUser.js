// src/composables/useUser.js
import { ref } from 'vue'
import { fetchUserProfile } from '@/services/api'

const user = ref(null)
const isLoadingUser = ref(false)
const userError = ref(null)

export function useUser() {
  const loadUser = async () => {
    if (user.value) return user.value
    try {
      isLoadingUser.value = true
      const data = await fetchUserProfile()
      
      // ✅ Fix: store actual user data
      user.value = data?.user || data

      // Optional: log for debugging
      console.log("👤 Loaded user:", user.value)

      return user.value
    } catch (err) {
      console.error('Failed to load user profile:', err)
      userError.value = err?.message || JSON.stringify(err)
      return null
    } finally {
      isLoadingUser.value = false
    }
  }

  const setUser = (newUserData) => {
    user.value = newUserData
  }

  return { user, isLoadingUser, userError, loadUser, setUser }
}
