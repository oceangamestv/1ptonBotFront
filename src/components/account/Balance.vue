<script lang="ts" setup>
import { useUserStore } from '@/store/user';

const userStore = useUserStore()


</script>

<template>
    <div class="balance-panel">
            <span class="balance-hint">Your balance</span>
            <div class="balance">🪙 {{userStore.user?.balance}}</div>
        </div>
</template>

<style scoped>
.balance-panel {
  background-color: rgba(128, 128, 128, 0.1);
  border-radius: 15px;
  padding: 10px 20px;
  margin: 20px;
  color: white;
  text-align: center;
  user-select: none; /* Додаємо цю властивість */
  pointer-events: none; /* Це запобігає взаємодії з елементом через курсор */
}
.balance-hint {
  color: gray;
}
.balance {
  font-size: 40px;
  font-weight: bold;
}
</style>