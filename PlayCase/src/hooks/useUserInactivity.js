import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

export default function useIdleRedirect(timeout = 300000) {
  const idleTimeout = ref(null);
  const router = useRouter();

  const resetIdleTimer = () => {
    if (idleTimeout.value) {
      clearTimeout(idleTimeout.value);
    }

    idleTimeout.value = setTimeout(() => {
      router.push({ name: 'TeamNameDisplay' });
    }, timeout);
  };

  const events = ['mousemove', 'keydown', 'scroll', 'click'];

  onMounted(() => {
    resetIdleTimer();

    events.forEach(event => {
      window.addEventListener(event, resetIdleTimer);
    });
  });

  onBeforeUnmount(() => {
    events.forEach(event => {
      window.removeEventListener(event, resetIdleTimer);
    });

    if (idleTimeout.value) {
      clearTimeout(idleTimeout.value);
    }
  });
}
