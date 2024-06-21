<script setup lang="ts">
import {Asset, TradingResponse, useUserStore} from "@/store/user.ts";
import {computed, onMounted, ref, watch} from "vue";
import Error from "@/components/Error.vue";
import {useWebAppPopup} from "vue-tg";

const userStore = useUserStore();
const trading = ref<TradingResponse | null>(null);
const onMountedFunc = async () => {
  const res = await userStore.getTrading();
  if (res) {
    trading.value = res;
    if (res.assets.length > 0) {
      selectedAsset.value = res.assets[0];
    }
  }
}
onMounted(onMountedFunc)

const selectedAsset = ref<Asset | null>(null);

const assetAmount = ref(0);
const valueUsd = ref(0);

watch(assetAmount, (newVal) => {
  if (isNaN(newVal)) {
    assetAmount.value = 0;
    return;
  }

  if (selectedAsset.value) {
    valueUsd.value = Math.round(newVal * selectedAsset.value.price_usd * 1000000) / 1000000;
  }
})

const isErrorPopupActive = ref(false);
const errorPopupMessage = ref("");

const showErrorPopup = (message: string) => {
  isErrorPopupActive.value = true;
  errorPopupMessage.value = message;
}

const sellAsset = () => {
  if (!selectedAsset.value) {
    showErrorPopup("Please select asset");
    return;
  }
  if (assetAmount.value <= 0) {
    showErrorPopup("Please enter amount");
    return;
  }
  if (valueUsd.value <= 0) {
    showErrorPopup("Please enter value");
    return;
  }
  if (valueUsd.value > (trading.value?.max_value??0)) {
    showErrorPopup("Value exceeds the maximum amount");
    return;
  }
  if ((trading.value?.referral_count ?? 0) < 3) {
    showErrorPopup("You need at least 3 referrals to sell assets\nYou have " + (trading.value?.referral_count ?? 0) + " referrals");
    return;
  }

  userStore.sellAsset(selectedAsset.value.id, assetAmount.value).then(res => {
    if (res) {
      assetAmount.value = 0;
      valueUsd.value = 0;
      onMountedFunc();
    }
  }).catch(err => {
    const errorCode = err.response?.data?.error || 'Unknown error';
    showErrorPopup(errorCode);
  });
}

const isSelectToken = ref(false);
const isSelectTokenActive = computed(() => {
  return isSelectToken.value ? 'active' : '';
});

function closeSelectTokenModal() {
  isSelectToken.value = false;
}

const selectAsset = (asset: Asset) => {
  assetAmount.value = 0;
  selectedAsset.value = asset;
  closeSelectTokenModal();
}

const truncatedReferralLink = computed(() => {
  return truncate(trading.value?.referral_link ?? "", 30);
});

const truncate = (str: string, maxLength: number) => {
  if (str.length <= maxLength) {
    return str;
  }

  const start = str.substring(0, maxLength - 3);
  return `${start}...`;
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    useWebAppPopup().showAlert("Copied to clipboard")
  }).catch(() => {
    useWebAppPopup().showAlert("Failed to copy to clipboard")
  });
}

</script>

<template>
  <main>
    <section class="swap-section">
      <div class="referal">
        <div class="referal__info">
                        <span class="referal__info-label">
                            Your referal link
                        </span>
          <a href="#" class="referal__info-link">
            {{truncatedReferralLink}}
          </a>
        </div>
        <button class="referal__copy" @click="copyToClipboard(trading?.referral_link ?? '')">
          <img src="@/assets/copy.svg" width="24" height="24" alt="Copy icon">
        </button>
      </div>

<!--      <div class="stats card">-->
<!--        <div class="stats__row level-wrap">-->
<!--          <p class="stats__label">-->
<!--            Trading level-->
<!--          </p>-->
<!--          <router-link to="/tradingLevel" class="stats-level-link">-->
<!--            <span class="sub-headline-2">{{ trading?.trading_level }}</span> <img src="@/assets/arrow-up-circle.svg" width="20"-->
<!--                                                       height="20" alt="Arrow Up icon">-->
<!--          </router-link>-->
<!--        </div>-->
<!--        <div class="stats__divider"></div>-->
<!--        <div class="stats__row amount-wrap">-->
<!--          <p class="stats__label">-->
<!--            Max amount-->
<!--          </p>-->
<!--          <p class="stats__value sub-headline-2">-->
<!--            {{trading?.max_value}} USDT-->
<!--          </p>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="sell card">-->
<!--        <div class="sell__row top">-->
<!--          <div class="control-widget">-->
<!--            <input type="text" v-model="assetAmount" class="control-widget__input">-->

<!--            <div class="control-widget__token" data-open="select-token" @click="isSelectToken = true">-->
<!--              <img src="@/assets/ton.svg" class="control-widget__token-icon" width="20" height="20"-->
<!--                   alt="TON">-->
<!--              <span class="sub-headline-2">{{ selectedAsset?.code }}</span>-->
<!--              <img src="@/assets/arrow-down-circle.svg" alt="Arrow down icon">-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="sell__divider">-->
<!--          <div class="sell__divider-line"></div>-->
<!--          <img src="@/assets/arrow-down.svg" class="sell__divider-icon" width="24" height="24"-->
<!--               alt="Arrow down icon">-->
<!--        </div>-->
<!--        <div class="sell__row bottom">-->
<!--          <div class="control-widget">-->
<!--            <input type="text" v-model="valueUsd" class="control-widget__input">-->

<!--            <div class="control-widget__token" data-open="select-token">-->
<!--              <img src="@/assets/usdt.svg" class="control-widget__token-icon" width="20" height="20"-->
<!--                   alt="TON">-->
<!--              <span class="sub-headline-2">USDT</span>-->
<!--              <img src="@/assets/arrow-down-circle_gray.svg" alt="Arrow down icon">-->
<!--            </div>-->
<!--          </div>-->

<!--          <button @click="sellAsset" class="primary-btn" data-open="error">-->
<!--            <img src="@/assets/arrow-up-circle_black.svg" width="24" height="24" alt="Arrow up icon">-->
<!--            <span>Sell</span>-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="history card">-->
<!--        <h6 class="history__title caption-1">-->
<!--          Transaction history-->
<!--        </h6>-->
<!--        <ul class="history-list" v-if="trading?.orders.length ?? 0 > 0">-->
<!--          <li class="history-list__item" v-for="order in trading?.orders">-->
<!--            <div class="history-list__item-info">-->
<!--              <div class="history-list__item-hash">-->
<!--                <span class="sub-headline-2">{{truncate(order.id, 20)}}</span>-->
<!--                <button class="copy-btn" @click="copyToClipboard(order.id)">-->
<!--                  <img src="@/assets/copy.svg" width="20" height="20" alt="Copy">-->
<!--                </button>-->
<!--              </div>-->
<!--              <div class="history-list__item-details">-->
<!--                {{ order.asset_amount }} {{ order.asset_code }} → {{order.amount_usd}} USDT-->
<!--              </div>-->
<!--            </div>-->
<!--            <div v-if="order.status==='completed'" class="history-list__item-status sub-headline-2 success">-->
<!--              Completed-->
<!--            </div>-->
<!--            <div v-else class="history-list__item-status sub-headline-2">-->
<!--              {{ order.status }}-->
<!--            </div>-->
<!--          </li>-->
<!--        </ul>-->
<!--        <div v-else class="history-list__empty">-->
<!--          <p class="history-list__empty-text">-->
<!--            No transactions yet-->
<!--          </p>-->
<!--        </div>-->
<!--      </div>-->

    </section>
  </main>
  <Error :message="errorPopupMessage" v-model="isErrorPopupActive" />
  <!-- Select token modal start -->
  <div class="modal-backdrop" :class="isSelectTokenActive" @click="closeSelectTokenModal"></div>
  <div class="modal select-token-modal" :class="isSelectTokenActive">
    <button class="popup__close" @click="closeSelectTokenModal">
      <img src="@/assets/cancel.svg" width="20" height="20" alt="Close popup">
    </button>

    <h4 class="modal__title">
      Select a token
    </h4>

    <div class="modal__body">
<!--      <div class="search">-->
<!--        <input type="text" class="search__input" placeholder="Search">-->
<!--        <img src="@/assets/search.svg" class="search__icon" width="20" height="20" alt="Search icon">-->
<!--      </div>-->

      <ul class="tokens-list">
        <li v-for="asset in trading?.assets" :key="asset.id" @click="selectAsset(asset)">
          <button class="cta-widget token-item">
            <div class="cta-widget__content">
              <div class="cta-widget__icon"></div>
              <div class="cta-widget__info">
                <div class="cta-widget__info-title">
                  <strong class="sub-headline-2">{{ asset.name }}</strong>
                </div>
                <div class="cta-widget__info-message">
                  <div class="token-name">{{ asset.code }}</div>
                  <div class="token-badge">{{ asset.network }}</div>
                </div>
              </div>
            </div>
            <img src="@/assets/arrow-right-circle.svg" class="cta-widget__arrow" width="32" height="32"
                 alt="Arrow right icon">
          </button>
        </li>
      </ul>
    </div>
  </div>
  <!-- Select token modal end -->
</template>

<style scoped>

</style>