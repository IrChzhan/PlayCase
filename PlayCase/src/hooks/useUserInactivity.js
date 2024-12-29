import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export function useUserInactivity(timeout = 300000) {
  const isInactive = ref(false)
  const router = useRouter()
  let timer = null

  const resetTimer = () => {
    isInactive.value = false
    clearTimeout(timer)
    timer = setTimeout(() => {
      isInactive.value = true
      router.push({
        name: 'TeamNameDisplay',
      })
    }, timeout)
  }

  const handleUserActivity = (event) => {
    console.log(2)
    resetTimer()
  }

  onMounted(() => {
    resetTimer()
    window.addEventListener('keydown', handleUserActivity)
    document.addEventListener('click', handleUserActivity)
  })

  onUnmounted(() => {
    clearTimeout(timer)
    window.removeEventListener('keydown', handleUserActivity)
    document.removeEventListener('click', handleUserActivity)
  })

  return { isInactive }
}
