<script setup lang="ts">
import { onMounted, onUnmounted, watchEffect } from 'vue'
import { useWebAppViewport, useWebApp, useWebAppBackButton } from 'vue-tg'
import { useUserStore } from './store/user'
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()

useWebAppViewport().expand()

useWebAppBackButton().onBackButtonClicked(() => {
  router.push("/")
  useWebAppBackButton().hideBackButton()
})

let rechargeID: NodeJS.Timeout | null
onMounted(() => {
  const userStore = useUserStore()
  userStore.login(useWebApp().initData)

  rechargeID = setInterval(() => {
    userStore.recharge()
  }, 1000)
})

onUnmounted(() => {
  if (rechargeID) clearInterval(rechargeID)
})

watchEffect(() => {
  if (route.path !== '/') {
    useWebAppBackButton().showBackButton()
  }
})

</script>

<template>
  <RouterView />
</template>

<style scoped></style>
