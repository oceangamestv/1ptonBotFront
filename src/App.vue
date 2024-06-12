<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watchEffect} from 'vue'
import {useWebAppViewport, useWebApp, useWebAppBackButton, useWebAppTheme, useWebAppClosingConfirmation} from 'vue-tg'
import { useUserStore } from './store/user'
import { useRoute, useRouter } from 'vue-router';
import BottomMenu from "@/components/BottomMenu.vue";

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()


useWebAppViewport().expand()
useWebAppClosingConfirmation().enableClosingConfirmation()
useWebAppTheme().headerColor.value = "#131313";
useWebAppTheme().backgroundColor.value = "#131313";

useWebAppBackButton().onBackButtonClicked(() => {
  router.push("/")
  useWebAppBackButton().hideBackButton()
})

let rechargeID: NodeJS.Timeout | null

const farmerPopup = ref(false)
const farmerPopupText = ref("")
const farmerProfit = ref(0)

onMounted(() => {
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

const isUserLoggedIn = computed(() => userStore.user !== null);

</script>

<template>
  <RouterView v-if="isUserLoggedIn" />
  <BottomMenu />
</template>

<style scoped></style>
