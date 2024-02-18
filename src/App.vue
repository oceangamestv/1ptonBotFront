<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useWebAppViewport, useWebApp, useWebAppBackButton, useWebAppTheme } from 'vue-tg'
import { useUserStore } from './store/user'
import { useRoute, useRouter } from 'vue-router';
import Popup from '@/components/Popup.vue'

const router = useRouter()
const route = useRoute()

useWebAppViewport().expand()
useWebAppTheme().headerColor.value = "#000000";
useWebAppTheme().backgroundColor.value = "#514500";

useWebAppBackButton().onBackButtonClicked(() => {
  router.push("/")
  useWebAppBackButton().hideBackButton()
})

let rechargeID: NodeJS.Timeout | null

const farmerPopup = ref(false)
const farmerPopupText = ref("")
const farmerProfit = ref(0)
const farmerPopupClose = () => {
  const user = useUserStore()
  if (user.user) {
    user.user.balance += farmerProfit.value
  }
}
onMounted(() => {
  const userStore = useUserStore()
  userStore.login(useWebApp().initData).then(user => {
    if (!user) {
      return
    }
    if (user.auto_farmer_profit > 0) {
      farmerPopup.value = true
      farmerPopupText.value = `The Farmer mined ${user.auto_farmer_profit} coins.`
      farmerProfit.value = user.auto_farmer_profit
    }
  })

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
  <Popup v-if="farmerPopup" header="👨‍🌾 Auto farmer" :body="farmerPopupText" action="Claim" :closeCallback="farmerPopupClose"></Popup>
</template>

<style scoped></style>
