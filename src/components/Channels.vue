<script lang="ts" setup>
import {Channel, useChannelsStore} from '@/store/channel';
import { useWebAppNavigation } from 'vue-tg'
import {onMounted} from "vue";

const channelsStore = useChannelsStore();
const wn = useWebAppNavigation()
onMounted(() => {
  channelsStore.fetchChannels();
});
// channelsStore.fetchChannels();

const openChannelLink = (channel: Channel) => {
  channel.is_available = false
  wn.openTelegramLink(channel.invite_link)
}
</script>

<template>
  <div class="telegram-channels">
    <div class="earn-title">
      🤑 Earn
    </div>
    <div class="channels-title">
      📢 Channels
    </div>
    <div class="channels-list">
      <div v-for="channel in channelsStore.channels" :key="channel.id" @click="openChannelLink(channel)" class="channel">
        <div class="channel-info">
          <span class="name">{{ channel.title }}</span>
        </div>
        <div class="channel-action">
          <span v-if="channel.is_available" class="reward">🪙 {{ channel.reward.toLocaleString() }}</span>
          <span v-else class="reward">💠 Reward reached</span>
          <svg class="arrow">
            <use xlink:href="@/assets/images/sprite.svg#chevron-right"></use>
          </svg>
<!--          <button v-if="channel.is_available" class="button" @click="openChannelLink(channel)">Join</button>-->
        </div>
      </div>
      <div class="channel" @click="wn.openTelegramLink('https://t.me/jetton?start=ccpGavsXUFo')">
        <div class="channel-info">
          <span class="name">JetTon</span>
        </div>
        <div class="channel-action">
          <span class="reward" style="font-size: 12px;">🪙 100K after first deposit</span>
          <svg class="arrow">
            <use xlink:href="@/assets/images/sprite.svg#chevron-right"></use>
          </svg>
<!--          <button class="button" @click="wn.openTelegramLink('https://t.me/jetton?start=ccpGavsXUFo')">Play</button>-->
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
  padding: 20px 10px;
  border-radius: 8px;
}

.earn-title {
  margin: 25px 10px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
.channels-title {
  margin: 10px;
  font-size: 24px;
  font-weight: bolder;
}

.channel-info {
  display: flex;
  flex-direction: column;
  /* font-size: 18px; */
}

.channel-action {
  display: flex;
  align-items: center;
}

.name,
.description,
.reward {
  margin-right: 15px;
}

.button {
  padding: 10px 10px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: large;
  font-weight: bold;
}
</style>
