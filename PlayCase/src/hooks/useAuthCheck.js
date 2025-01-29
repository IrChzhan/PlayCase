import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuthCheck() {
  const router = useRouter()
  const teamName = ref(null)
  onMounted(async () => {
    const team = localStorage.getItem('team')
    const token = localStorage.getItem('token')

    if (!team) {
      try {
        if (token) {
          try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/game/current/team`, {
              headers: { Authorization: `Bearer ${token}` },
            })

            localStorage.setItem('team', JSON.stringify(response.data.name))
            teamName.value = response.data.name
          } catch (e) {
            await router.push('/watch')
          }
        } else {
          await router.push('/TeamNameInput')
          return
        }
      } catch (error) {
        console.error('Ошибка при запросе currentTeam:', error)
        await router.push('/TeamNameInput')
        return
      }
    } else {
      try {
        teamName.value = JSON.parse(team)
      } catch {
        console.error('Ошибка парсинга команды из localStorage')
        localStorage.removeItem('team')
      }
    }

    if (!token) {
      await router.push('/TeamNameInput')
    }
  })
  return {
    teamName
  }
}
