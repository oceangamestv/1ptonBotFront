<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import { ref } from 'vue';
import Balance from '../account/Balance.vue';

const userStore = useUserStore()
userStore.getBoosts()
const isPopupVisible = ref(false);

function closePopup() {
    isPopupVisible.value = false;
}
const selectedBoost = ref({
    id: 'multitap',
    name: '👆 Multitap',
    description: 'Increase amount of coins you can earn per one tap',
    nextLevelSpec: '',
    price: 1999,
    next_level: 5,
    level: 1
});

function showPurchasePopup(boost: string) {
    if (!userStore.boosts || !userStore.user) {
        return;
    }
    switch (boost) {
        case 'multitap':
            if (userStore.boosts?.mine_level_price > userStore.user.balance) {
                return;
            }
            selectedBoost.value = {
                id: 'multitap',
                name: '👆 Multitap',
                description: 'Increase amount of coins you can earn per one tap',
                nextLevelSpec: "+1 per tap for each level.",
                price: userStore.boosts?.mine_level_price,
                next_level: userStore.boosts?.current_mine_level + 1,
                level: userStore.boosts?.current_mine_level
            }
            break;
        case 'energy':
            if (userStore.boosts?.energy_level_price > userStore.user.balance) {
                return;
            }
            if (userStore.boosts?.current_energy_level >= 4) {
                return;
            }
            selectedBoost.value = {
                id: 'energy',
                name: '👆 Energy Recharging',
                description: "Increase the energy recharging speed. Max level is 4",
                nextLevelSpec: "+1 / sec for each level.",
                price: userStore.boosts?.energy_level_price,
                next_level: userStore.boosts?.current_energy_level + 1,
                level: userStore.boosts?.current_energy_level
            }
            break;
        case 'max_energy':
            if (userStore.boosts?.max_energy_price > userStore.user.balance) {
                return;
            }
            selectedBoost.value = {
                id: 'max_energy',
                name: '🔋 Energy Capacity',
                description: 'Increase your energy limit, so you can mine more per session',
                nextLevelSpec: "+500 energy points for each level.",
                price: userStore.boosts?.max_energy_price,
                next_level: userStore.user?.max_energy_level + 2,
                level: userStore.user?.max_energy_level + 2
            }
            break;
    }
    isPopupVisible.value = true;
}

const purchaseBoost = () => {
    userStore.purchaseBoost(selectedBoost.value.id)
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
                <div>Energy Recharging<span class="badge">{{ userStore.boosts?.current_energy_level }} level</span></div>
                <div class="price">🪙 {{ userStore.boosts?.energy_level_price.toLocaleString() }}</div>
            </div>
        </div>
        <div class="boost" @click="showPurchasePopup('max_energy')">
            <div class="icon-box">🔋</div>
            <div class="text-container">
                <div>Energy Capacity<span class="badge">{{ (userStore.user?.max_energy_level ?? 0) + 1 }} level</span></div>
                <div class="price">🪙 {{ userStore.boosts?.max_energy_price.toLocaleString() }}</div>
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
            <div class="popup-body">
                <p>{{ selectedBoost.description }}</p>
                <p class="boost-desc-hint">{{ selectedBoost.nextLevelSpec }}</p>
                <p>🪙{{ selectedBoost.price.toLocaleString() }}<span class="price-hint">/ {{ selectedBoost.next_level }}
                        level</span></p>
                <button class="boost-purchase-button" @click="purchaseBoost">Get</button>
            </div>
        </div>
    </div>
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
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
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
</style>
