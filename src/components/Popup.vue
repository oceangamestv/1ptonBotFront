<template>
    <div class="popup" v-if="isPopupVisible">
        <div class="popup-overlay" @click="closePopup"></div>
        <div class="popup-content">
            <div class="popup-header">
                <h2>{{ header }}</h2>
                <button class="close-button" @click="closePopup">✖</button>
            </div>
            <div class="popup-body" style="margin-top: 10px;">
                {{ body }}
                <button class="boost-action-button" @click="closePopup" style="margin-top: 10px;">{{ action }}</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
    header: String,
    body: String,
    action: String,
    closeCallback: Function
})

const isPopupVisible = ref(true)

const closePopup = () => {
    isPopupVisible.value = false
    if (props.closeCallback) props.closeCallback()
}
</script>

<style scoped>
.popup {
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

.boost-action-button {
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
</style>