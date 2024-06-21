<script lang="ts" setup>
import {ApiError, useUserStore} from '@/store/user';
import {computed, ref} from 'vue';
import { useWebAppPopup } from 'vue-tg'
import moment from 'moment';
import {useAnimatedBalance} from "@/hooks/balance.ts";
import {AxiosError} from "axios";

const userStore = useUserStore()
userStore.getBoosts()
const isPopupVisible = ref(false);
const justOpened = ref(false);
const lootboxContent = ref({
    coin: 0,
    energy: 0,
    isOpen: false
});

console.log(moment(userStore.user?.daily_booster_available_at).isBefore(new Date()))
console.log(userStore.user?.daily_booster_available_at.toString())
console.log(moment(userStore.user?.daily_booster_available_at).toString())
console.log(new Date())
console.log(moment().toString())
const selectedBoost = ref({
    id: 'multitap',
    name: '👆 Multitap',
    description: 'Increase amount of coins you can earn per one tap',
    nextLevelSpec: [''],
    price: 1999,
    next_level: 5,
    level: 1,
    action: "Get"
});


function showPurchasePopup(boost: string) {
    if (!userStore.boosts || !userStore.user) {
        return;
    }
    switch (boost) {
        case 'multitap':
            if (userStore.boosts.mine_level_price > userStore.user.balance) {
                openMoneyErrorModal()
                return;
            }
            selectedBoost.value = {
                id: 'multitap',
                name: 'Tap',
                description: 'Increase amount of coins you can earn per one tap',
                nextLevelSpec: ["+1 per tap for each level."],
                price: userStore.boosts.mine_level_price,
                next_level: userStore.boosts.current_mine_level + 1,
                level: userStore.boosts.current_mine_level,
                action: "Get"
            }
            break;
        case 'energy':
            if (userStore.boosts.current_energy_level >= 4) {
                return;
            }
            if (userStore.boosts.energy_level_price > userStore.user.balance) {
                openMoneyErrorModal()
                return;
            }
            selectedBoost.value = {
                id: 'energy',
                name: 'Recharge',
                description: "Increase the energy recharging speed. Max level is 4",
                nextLevelSpec: ["+1 / sec for each level."],
                price: userStore.boosts.energy_level_price,
                next_level: userStore.boosts.current_energy_level + 1,
                level: userStore.boosts.current_energy_level,
                action: "Get"
            }
            break;
        case 'max_energy':
            if (userStore.boosts.max_energy_price > userStore.user.balance) {
                openMoneyErrorModal()
                return;
            }
            selectedBoost.value = {
                id: 'max_energy',
                name: 'Capacity',
                description: 'Increase your energy limit, so you can mine more per session',
                nextLevelSpec: ["+500 energy points for each level."],
                price: userStore.boosts.max_energy_price,
                next_level: userStore.user.max_energy_level + 1,
                level: userStore.user.max_energy_level,
                action: "Get"
            }
            break;
        case 'daily_lootbox':
            if (moment(userStore.user.daily_booster_available_at).isAfter(moment())) {
                useWebAppPopup().showAlert("Daily lootbox unavailable yet")
                return;
            }
            selectedBoost.value = {
                id: 'daily_lootbox',
                name: '🎁 Daily lootbox',
                description: 'One of the listed gifts',
                nextLevelSpec: [
                    "🪙 from 500 to 5000",
                    "⚡️ from 1000 to full"
                ],
                price: 0,
                next_level: 0,
                level: 0,
                action: "Open"
            }
            break;
        case 'auto_farmer':
            if (userStore.user.auto_farmer) {
                useWebAppPopup().showAlert("Your auto farmer already works")
                return;
            }
            if (userStore.boosts.auto_farmer_price > userStore.user.balance) {
                useWebAppPopup().showAlert("You don't have enough coins to buy this")
                return;
            }
            selectedBoost.value = {
                id: 'auto_farmer',
                name: '👨‍🌾 Auto Farmer',
                description: 'Farmer mines coins when you AFK more then 1 hour.',
                nextLevelSpec: [
                    "Mining value = Energy Recharning level.",
                    "Maxium 12 hours"
                ],
                price: userStore.boosts.auto_farmer_price,
                next_level: 0,
                level: 0,
                action: "Get"
            }
            break;
    }
    isPopupVisible.value = true;
    justOpened.value = true;

    openPurchaseModal()
}

const purchaseBoost = () => {
    if (selectedBoost.value.id === 'daily_lootbox') {
        // Припустимо, ви вирішили, що в коробці "випало" 1000 монет
        lootboxContent.value.coin = 500;
        lootboxContent.value.isOpen = true;
        // Показати анімацію випадання предмета
        // Тут можна використати setTimeout, щоб показати анімацію після невеликої затримки
        userStore.openDailyBooster().then(dailyBooster => {
            lootboxContent.value.coin = dailyBooster?.coin ?? 0
            lootboxContent.value.energy = dailyBooster?.energy ?? 0
            isPopupVisible.value = true;
            if (userStore.user && dailyBooster) {
                userStore.user.balance += lootboxContent.value.coin
                userStore.user.energy += lootboxContent.value.energy
                userStore.user.daily_booster_available_at = dailyBooster.next_at
            }
        })
    } else {
      userStore.purchaseBoost(selectedBoost.value.id).catch((e: AxiosError) => {
        const resp = e.response?.data as ApiError
        if (resp && resp.message === "insufficient balance") {
          openMoneyErrorModal()
        } else {
          console.error(e);
        }
      })
      // try {
      //   userStore.purchaseBoost(selectedBoost.value.id)
      // } catch (e: any) {
      //   alert(123)
      //   if (e.response && e.response.data && e.response.data.message === "insufficient balance") {
      //     alert("Insufficient balance to purchase this boost.");
      //   } else {
      //     console.error(e);
      //   }
      // }
    }
    closePurchaseModal()
}

const animatedBalance = useAnimatedBalance()
const formatedAnimatedBalance = computed(() => {
  return animatedBalance.value.toLocaleString();
});

const isPurchase = ref(false);
const isPurchaseActive = computed(() => {
  return isPurchase.value ? 'active' : '';
});

function openPurchaseModal() {
  isPurchase.value = true;
}

function closePurchaseModal() {
  isPurchase.value = false;
}

const isMoneyError = ref(false);
const isMoneyErrorActive = computed(() => {
  return isMoneyError.value ? 'active' : '';
});

function openMoneyErrorModal() {
  isMoneyError.value = true;
}

function closeMoneyErrorModal() {
  isMoneyError.value = false;
}

</script>

<template>
  <section class="boost-section">
    <div class="boost-offer">
      <p class="boost-offer__subtitle">
        Your balance
      </p>
      <h1 class="boost-offer__title">
        {{ formatedAnimatedBalance }}
      </h1>
    </div>

    <div class="boost-body">
      <h4 class="boost-body__title title-3">
        Boosts
      </h4>
      <ul class="boost-list">
        <li>
          <button class="cta-widget boost-btn recharge" @click="showPurchasePopup('energy')">
            <div class="cta-widget__content">
              <div class="cta-widget__icon">
                <img src="@/assets/lightning-stroke.svg" width="24" height="24"
                     alt="Lightning icon">
              </div>
              <div class="cta-widget__info">
                <div class="cta-widget__info-title">
                  <strong class="sub-headline-2">Recharge</strong>
                  <div class="boost-levels">
                    {{userStore.boosts?.current_energy_level}} lvl → {{(userStore.boosts?.current_energy_level??1)+1}} lvl
                  </div>
                </div>
                <div class="cta-widget__info-message">
                  <span>{{userStore.boosts?.energy_level_price.toLocaleString()}}</span>
                </div>
              </div>
            </div>
            <img src="@/assets/arrow-up-circle.svg" class="cta-widget__arrow" width="32"
                 height="32" alt="Arrow up icon">
          </button>
        </li>
        <li>
          <button class="cta-widget boost-btn tap" data-open="boost" @click="showPurchasePopup('multitap')">
            <div class="cta-widget__content">
              <div class="cta-widget__icon">
                <img src="@/assets/tap.svg" width="24" height="24" alt="Tap icon">
              </div>
              <div class="cta-widget__info">
                <div class="cta-widget__info-title">
                  <strong class="sub-headline-2">Tap</strong>
                  <div class="boost-levels">
                    {{userStore.boosts?.current_mine_level}} lvl → {{(userStore.boosts?.current_mine_level??1)+1}} lvl
                  </div>
                </div>
                <div class="cta-widget__info-message">
                  <span>{{userStore.boosts?.mine_level_price.toLocaleString()}}</span>
                </div>
              </div>
            </div>
            <img src="@/assets/arrow-up-circle.svg" class="cta-widget__arrow" width="32"
                 height="32" alt="Arrow up icon">
          </button>
        </li>
        <li>
          <button class="cta-widget boost-btn capacity" data-open="boost" @click="showPurchasePopup('max_energy')">
            <div class="cta-widget__content">
              <div class="cta-widget__icon">
                <img src="@/assets/battery-saver.svg" width="24" height="24"
                     alt="Battery saver icon">
              </div>
              <div class="cta-widget__info">
                <div class="cta-widget__info-title">
                  <strong class="sub-headline-2">Capacity</strong>
                  <div class="boost-levels">
                    {{userStore.user?.max_energy_level}} lvl → {{(userStore.user?.max_energy_level??1)+1}} lvl
                  </div>
                </div>
                <div class="cta-widget__info-message">
                  <span>{{userStore.boosts?.max_energy_price.toLocaleString()}}</span>
                </div>
              </div>
            </div>
            <img src="@/assets/arrow-up-circle.svg" class="cta-widget__arrow" width="32"
                 height="32" alt="Arrow up icon">
          </button>
        </li>
      </ul>
    </div>
  </section>
  <!-- Error modal start -->
  <div class="modal-backdrop" :class="isMoneyErrorActive" @click="closeMoneyErrorModal"></div>
  <div class="error-popup popup" :class="isMoneyErrorActive" @click="closeMoneyErrorModal">
    <button class="popup__close" @click="closeMoneyErrorModal">
      <img src="@/assets/cancel.svg" width="20" height="20" alt="Close popup">
    </button>
    <div class="popup__content">
      <div class="error-popup__avatar">
        <img src="@/assets/face-wink.svg" alt="Face icon">
      </div>

      <h5 class="error-popup__title title-2">
        Insufficient funds
      </h5>

      <button class="primary-btn" data-close="error">
        <span>Okay</span>
      </button>
    </div>
  </div>
  <!-- Error modal end -->
  <!-- Boost modal start -->
  <div class="modal-backdrop" :class="isPurchaseActive" @click="closePurchaseModal"></div>
  <div class="boost-popup popup" :class="isPurchaseActive" @click="closePurchaseModal">
    <button class="popup__close" @click="closePurchaseModal">
      <img src="@/assets/cancel.svg" width="20" height="20" alt="Close popup">
    </button>
    <div class="popup__content">
      <!-- capacity / tap / recharge classes to change color -->
      <div v-if="selectedBoost.id==='max_energy'" class="boost-popup__avatar capacity">
        <img src="@/assets/battery-saver.svg" alt="Battery saver icon">
      </div>
      <div v-else-if="selectedBoost.id==='multitap'" class="boost-popup__avatar tap">
        <img src="@/assets/tap.svg" alt="Tap icon">
      </div>
      <div v-if="selectedBoost.id==='energy'" class="boost-popup__avatar recharge">
        <img src="@/assets/lightning-stroke.svg" alt="Lightning icon">
      </div>
      <h5 class="boost-popup__title title-3">
        {{ selectedBoost.name }}
      </h5>
      <div class="boost-popup__message caption-1">
        <span>{{ selectedBoost.description }}</span>

      </div>
      <strong class="boost-popup__cost">
        {{ selectedBoost.price.toLocaleString() }}
      </strong>
      <span v-for="spec in selectedBoost.nextLevelSpec" :key="spec" class="boost-popup__level">
        {{ spec }}
      </span>
      <button class="primary-btn" @click="purchaseBoost">
        <img src="@/assets/arrow-up-circle_black.svg" width="24" height="24" alt="Arrow up icon">
        <span>Upgrade</span>
      </button>
    </div>
  </div>
  <!-- Boost modal end -->
</template>

