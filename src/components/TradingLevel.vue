<script setup lang="ts">
import {TradingLevels, useUserStore} from "@/store/user.ts";
import {onMounted, ref} from "vue";
import {useWebAppNavigation} from "vue-tg";

const tradingLevels = ref<TradingLevels | null>(null);
const wn = useWebAppNavigation()
onMounted(async () => {
  const userStore = useUserStore();
  const res = await userStore.getTradingLevels();
  if (res) {
    tradingLevels.value = res;
  }
})
</script>

<template>
  <main>
    <section class="trading-lvl-section">
      <div class="trading-lvl-offer">
        <div class="trading-lvl-offer__avatar">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.25581 11.4531C6.37673 8.80315 8.47407 6.56029 11.3174 5.31431M11.3174 5.31431L10.9251 7.53336M11.3174 5.31431L9.09838 4.92196M26.7441 20.547C25.6232 23.197 23.5259 25.4398 20.6825 26.6858M20.6825 26.6858L21.0749 24.4667M20.6825 26.6858L22.9016 27.0781M16 23.5C16 19.3579 12.6421 16 8.5 16C4.35786 16 1 19.3579 1 23.5C1 27.6421 4.35786 31 8.5 31C12.6421 31 16 27.6421 16 23.5ZM31 8.5C31 4.35786 27.6421 1 23.5 1C19.3579 1 16 4.35786 16 8.5C16 12.6421 19.3579 16 23.5 16C27.6421 16 31 12.6421 31 8.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="trading-lvl-offer__title title-3">
          Trading level
        </h1>
        <p class="trading-lvl-offer__message caption-1">
          For each level you increase maximum amount for token salling
        </p>
      </div>

      <ul class="trading-lvl-list">
        <li class="trading-lvl-list__item" v-for="level in tradingLevels?.trading_levels">
          <div>
            <div class="trading-lvl-list__item-top">
              <span>Level {{level.level}}</span> ${{level.price_usd.toLocaleString()}}
            </div>
            <div class="trading-lvl-list__item-bottom">
              Max {{ level.max_value.toLocaleString() }} USDT
            </div>
          </div>
          <button class="primary-btn sm" @click="wn.openTelegramLink(tradingLevels?.manager ?? '')">
            <img src="@/assets/arrow-up-circle_black.svg" width="24" height="24" alt="Arrow up icon">
            <span>Buy</span>
          </button>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>

</style>