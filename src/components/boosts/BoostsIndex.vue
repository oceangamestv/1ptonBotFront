<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import { ref } from 'vue';
import Balance from '../account/Balance.vue';
import { useWebAppPopup } from 'vue-tg'
import moment from 'moment';

const userStore = useUserStore()
userStore.getBoosts()
const isPopupVisible = ref(false);
const justOpened = ref(false);
const lootboxContent = ref({
    coin: 0,
    energy: 0,
    isOpen: false
});

function closePopup() {
  if (justOpened.value) {
    justOpened.value = false;
    return;
  }
  isPopupVisible.value = false;
}
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
            if (userStore.boosts?.mine_level_price > userStore.user.balance) {
                useWebAppPopup().showAlert("You don't have enough coins to buy this")
                return;
            }
            selectedBoost.value = {
                id: 'multitap',
                name: '👆 Multitap',
                description: 'Increase amount of coins you can earn per one tap',
                nextLevelSpec: ["+1 per tap for each level."],
                price: userStore.boosts?.mine_level_price,
                next_level: userStore.boosts?.current_mine_level + 1,
                level: userStore.boosts?.current_mine_level,
                action: "Get"
            }
            break;
        case 'energy':
            if (userStore.boosts?.current_energy_level >= 4) {
                return;
            }
            if (userStore.boosts?.energy_level_price > userStore.user.balance) {
                useWebAppPopup().showAlert("You don't have enough coins to buy this")
                return;
            }
            selectedBoost.value = {
                id: 'energy',
                name: '👆 Energy Recharging',
                description: "Increase the energy recharging speed. Max level is 4",
                nextLevelSpec: ["+1 / sec for each level."],
                price: userStore.boosts?.energy_level_price,
                next_level: userStore.boosts?.current_energy_level + 1,
                level: userStore.boosts?.current_energy_level,
                action: "Get"
            }
            break;
        case 'max_energy':
            if (userStore.boosts?.max_energy_price > userStore.user.balance) {
                useWebAppPopup().showAlert("You don't have enough coins to buy this")
                return;
            }
            selectedBoost.value = {
                id: 'max_energy',
                name: '⚡️ Energy Capacity',
                description: 'Increase your energy limit, so you can mine more per session',
                nextLevelSpec: ["+500 energy points for each level."],
                price: userStore.boosts?.max_energy_price,
                next_level: userStore.user?.max_energy_level + 2,
                level: userStore.user?.max_energy_level + 2,
                action: "Get"
            }
            break;
        case 'daily_lootbox':
            if (moment(userStore.user?.daily_booster_available_at).isAfter(moment())) {
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
            if (userStore.user?.auto_farmer) {
                useWebAppPopup().showAlert("Your auto farmer already works")
                return;
            }
            if (userStore.boosts?.auto_farmer_price > userStore.user.balance) {
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
                price: userStore.boosts?.auto_farmer_price,
                next_level: 0,
                level: 0,
                action: "Get"
            }
            break;
    }
    isPopupVisible.value = true;
    justOpened.value = true;
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
        userStore.purchaseBoost(selectedBoost.value.id)
    }
    closePopup()
}
const claimDailyBooster = () => {
    lootboxContent.value.isOpen = false
    lootboxContent.value.coin = 0
    lootboxContent.value.energy = 0

    closePopup()
}
</script>

<template>
    <Balance />
    <div class="boosts">
        <div class="boost" @click="showPurchasePopup('multitap')">
            <div class="icon-box">👆</div>
            <div class="text-container">
                <div>Multitap<span class="badge">{{ userStore.boosts?.current_mine_level }} level</span></div>
                <div class="price">🪙 {{ userStore.boosts?.mine_level_price.toLocaleString() }}</div>
            </div>
        </div>
        <div class="boost" @click="showPurchasePopup('energy')">
            <div class="icon-box">⚡️</div>
            <div class="text-container">
                <div>
                    Energy Recharging
                    <span v-if="(userStore.boosts?.current_energy_level ?? 0) < 4" class="badge">{{
                        userStore.boosts?.current_energy_level }} level</span>
                    <span v-else class="badge">max</span>
                </div>
                <div v-if="(userStore.boosts?.current_energy_level ?? 0) < 4" class="price">🪙 {{
                    userStore.boosts?.energy_level_price.toLocaleString() }}</div>
            </div>
        </div>
        <div class="boost" @click="showPurchasePopup('max_energy')">
            <div class="icon-box">🔋</div>
            <div class="text-container">
                <div>Energy Capacity<span class="badge">{{ (userStore.user?.max_energy_level ?? 0) + 1 }} level</span></div>
                <div class="price">🪙 {{ userStore.boosts?.max_energy_price.toLocaleString() }}</div>
            </div>
        </div>
        <div class="boost daily-boost" @click="showPurchasePopup('auto_farmer')">
            <div class="icon-box">👨‍🌾</div>
            <div class="text-container">
                <div>Auto Farmer</div>
                <div v-if="!(userStore.user?.auto_farmer ?? false)" class="price">🪙 {{
                    userStore.boosts?.auto_farmer_price.toLocaleString() }}</div>
                <div v-else>✅ Enabled</div>
            </div>
        </div>
        <div class="boost daily-boost" @click="showPurchasePopup('daily_lootbox')">
            <div class="icon-box">🎁</div>
            <div class="text-container">
                <div>Daily Lootbox</div>
                <div v-if="moment(userStore.user?.daily_booster_available_at).isBefore(moment())">Available</div>
                <div class="price" v-else>⏳ {{ moment(userStore.user?.daily_booster_available_at ?? new Date()).fromNow() }}
                </div>
            </div>
        </div>
    </div>
    <!-- Модальне вікно для купівлі бусту -->
    <div class="boost-purchase-popup" :class="{ 'visible': isPopupVisible }">
<!--        <div class="popup-overlay" @click="closePopup"></div>-->
        <div class="popup-content"  v-click-outside="closePopup">
            <div class="popup-header">
                <h2>{{ selectedBoost.name }}</h2>
                <button class="close-button" @click="closePopup">
                  <svg class="close-icon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="16px" height="16px">
                    <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>
                  </svg>
                </button>
            </div>
            <div v-if="!lootboxContent.isOpen" class="popup-body">
                <p>{{ selectedBoost.description }}</p>
                <p v-for="spec in selectedBoost.nextLevelSpec" class="boost-desc-hint">{{ spec }}</p>
                <p v-if="selectedBoost.price != 0">🪙{{ selectedBoost.price.toLocaleString() }}<span v-if="selectedBoost.next_level != 0" class="price-hint">/ {{
                    selectedBoost.next_level }}
                        level</span></p>
                <button class="boost-purchase-button" @click="purchaseBoost">{{ selectedBoost.action }}</button>
            </div>
            <div v-else class="lootbox-items">
                <p class="lootbox-item">Your gift:</p>
                <p v-if="lootboxContent.coin > 0">🪙 +{{ lootboxContent.coin }}</p>
                <p v-if="lootboxContent.energy > 0">⚡️ +{{ lootboxContent.energy }}</p>
                <button style="margin-top:10px" class="boost-purchase-button" @click="claimDailyBooster">Claim</button>
            </div>
        </div>
    </div>
    <!-- Умовно відображаємо вміст коробки, якщо він існує
    <div v-if="lootboxContent.isOpen" class="lootbox-item">
        {{ lootboxContent }}
    </div> -->
</template>

<style scoped>
.boosts-title {
    margin: 10px;
    font-size: 24px;
}

.boost {
    display: flex;
    align-items: center;
    margin: 10px;
    background: rgba(128, 128, 128, 0.1);
    color: #fff;
    padding: 10px;
    border-radius: 15px;
    border: 1px solid #595959;
    cursor: pointer;
}

.daily-boost {
    background: rgba(88, 66, 128, 0.57);
}

.icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    /* Center the icon vertically and horizontally */
    margin-right: 10px;
    /* Add some space between the icon and the text */
    background: rgba(128, 128, 128, 0.2);
    color: #fff;
    padding: 10px;
    font-size: 20px;
    border-radius: 15px;
    /* Apply rounded corners */
    width: 40px;
    /* Set a fixed width for a square shape */
    height: 40px;
    /* Set a fixed height for a square shape */
}

.text-container {
    display: flex;
    flex-direction: column;
}

.price {
    font-weight: 500;
    color: #c8a8ff;
    /* Gold color for the price */
    font-size: 16px;
    /* Smaller font size for the price */
}

.badge {
    background: rgba(128, 128, 128, 0.4);
    color: white;
    padding: 2px 8px;
    font-size: 12px;
    border-radius: 10px;
    margin-left: 5px;
}

.boost-purchase-popup {
  transform: translateY(100%); /* Start off the bottom of the screen */
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end; /* Align the modal at the bottom */
  z-index: 1000;
  transition: transform 0.2s ease; /* Smooth transition for the transform property */
  color: white;
}

.boost-purchase-popup.visible {
  transform: translateY(0); /* Position it inside the viewport */
}

.popup-content {
  position: relative;
  background: rgba(256,256,256,.15);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-radius: 10px 10px 0 0; /* Тільки верхні кути округлені */
  z-index: 1001;
  padding: 20px 20px 45px;
  width: 100%;
  box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.5);
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.close-button {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 24px;
    color: white;
}

.popup-body h3,
.popup-body p {
    margin: 10px 0;
}

.boost-purchase-button {
    padding: 10px 20px;
    border: none;
    background-color: #2c2c2c;
    color: white;
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
}

.boost-desc-hint {
    color: #c5c5c5;
    font-size: 14px;
}

.price-hint {
    color: #aeaeae;
    margin-left: 5px;
    font-size: 12px;
}

@keyframes drop {
    0% {
        opacity: 0;
        transform: translateY(-20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.lootbox-items {
    animation: drop 0.5s ease-out;
    /* Застосовуємо анімацію до елементу */
}

.lootbox-item {
    margin-top: 10px;
}
</style>
