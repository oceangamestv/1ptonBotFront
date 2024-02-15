<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import { ref } from 'vue';
import Balance from '../account/Balance.vue';
import { useWebAppPopup } from 'vue-tg'
import moment from 'moment';

const userStore = useUserStore()
userStore.getBoosts()
const isPopupVisible = ref(false);
const lootboxContent = ref({
    coin: 0,
    energy: 0,
    isOpen: false
});

function closePopup() {
    isPopupVisible.value = false;
    // lootboxContent.value.isOpen = false;

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
    }
    isPopupVisible.value = true;
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
            if (userStore.user && dailyBooster) userStore.user.daily_booster_available_at = dailyBooster.next_at
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
    <div class="boost-purchase-popup" v-if="isPopupVisible">
        <div class="popup-overlay" @click="closePopup"></div>
        <div class="popup-content">
            <div class="popup-header">
                <h2>{{ selectedBoost.name }}</h2>
                <button class="close-button" @click="closePopup">✖</button>
            </div>
            <div v-if="!lootboxContent.isOpen" class="popup-body">
                <p>{{ selectedBoost.description }}</p>
                <p v-for="spec in selectedBoost.nextLevelSpec" class="boost-desc-hint">{{ spec }}</p>
                <p v-if="selectedBoost.price != 0">🪙{{ selectedBoost.price.toLocaleString() }}<span class="price-hint">/ {{
                    selectedBoost.next_level }}
                        level</span></p>
                <button class="boost-purchase-button" @click="purchaseBoost">{{ selectedBoost.action }}</button>
            </div>
            <div v-else class="lootbox-items">
                <p class="lootbox-item">Your gift:</p>
                <p v-if="lootboxContent.coin > 0">🪙 +{{lootboxContent.coin}}</p>
                <p v-if="lootboxContent.energy > 0">⚡️ +{{lootboxContent.energy}}</p>
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
    border-radius: 8px;
    cursor: pointer;
}

.daily-boost {
    background: rgba(255, 221, 0, 0.1);
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
    border-radius: 8px;
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
    color: #FFD700;
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
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
    position: relative;
    width: 90%;
    margin: 10px;
    max-width: 400px;
    background-color: rgba(39, 39, 39, 0.4);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 20px;
    border-radius: 10px;
    z-index: 1001;
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
