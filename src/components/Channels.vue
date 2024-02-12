<script lang="ts" setup>
import { useChannelsStore } from '@/store/channel';
import { useWebAppNavigation } from 'vue-tg'

const channelsStore = useChannelsStore();
const wn = useWebAppNavigation()
channelsStore.fetchChannels();
</script>

<template>
    <div class="telegram-channels">
        <div class="channels-title">
            📢 Subscribe & Earn Coins
        </div>
        <div class="channels-list">
            <div v-for="channel in channelsStore.channels" :key="channel.id" class="channel">
                <div class="channel-info">
                    <span class="name">{{ channel.title }}</span>
                </div>
                <div class="channel-action">
                    <span class="reward">🪙 {{ channel.reward.toLocaleString() }}</span>
                    <button class="button" @click="wn.openTelegramLink(channel.invite_link)">Join</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.channel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  background: rgba(128, 128, 128, 0.1);
  color: #fff;
  padding: 10px;
  border-radius: 8px;
}

.channels-title {
  margin: 10px;
  font-size: 24px;
}

.channel-info {
  display: flex;
  flex-direction: column;
}

.channel-action {
  display: flex;
  align-items: center;
}

.name, .description, .reward {
  margin-right: 15px;
}

.button {
  padding: 10px 10px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
