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
  <main>
    <section class="earn-section">
      <div class="earn-offer">
        <div class="earn-offer__avatar">
          <img src="@/assets/coins-stack.svg" width="24" height="24" alt="Earn icon">
        </div>
        <h2 class="headline semi-bold">
          Earn more coins
        </h2>
      </div>

<!--      &lt;!&ndash; you can also use <button> instead of <a> tag &ndash;&gt;-->
<!--      <a href="#" class="cta-widget invite-friends">-->
<!--        <div class="cta-widget__content">-->
<!--          <div class="cta-widget__icon">-->
<!--            <img src="@/assets/hearts-floating.svg" width="24" height="24" alt="Hearts floating icon">-->
<!--          </div>-->
<!--          <div class="cta-widget__info">-->
<!--            <div class="cta-widget__info-title">-->
<!--              <strong class="sub-headline-2">Invite Friends</strong>-->
<!--            </div>-->
<!--            <div class="cta-widget__info-message">-->
<!--              up to <strong>30 000</strong> for friend-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <img src="@/assets/arrow-right-circle.svg" class="cta-widget__arrow" width="32" height="32"-->
<!--             alt="Arrow right icon">-->
<!--      </a>-->

      <div class="earn-body">
        <div class="earn-block">
          <h4 class="earn-block__title title-3">Channels</h4>
          <div class="earn-block__card card">
            <a
                @click.prevent="openChannelLink(channel)"
                class="cta-widget"
                v-for="channel in channelsStore.channels"
                :key="channel.id">
              <div class="cta-widget__content">
<!--                <div class="cta-widget__icon"></div>-->
                <div class="cta-widget__info">
                  <div class="cta-widget__info-title">
                    <strong class="sub-headline-2">{{channel.title}}</strong>
                  </div>
                  <div class="cta-widget__info-message">
                    <strong v-if="channel.is_available">+{{channel.reward.toLocaleString()}}</strong>
                    <strong v-else>Reward reached</strong>
                  </div>
                </div>
              </div>
              <img src="@/assets/arrow-right-circle.svg" class="cta-widget__arrow" width="32"
                   height="32" alt="Arrow right icon">
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
<!--  <div class="telegram-channels">-->
<!--    <div class="earn-title">-->
<!--      🤑 Earn-->
<!--    </div>-->
<!--    <div class="channels-title">-->
<!--      📢 Channels-->
<!--    </div>-->
<!--    <div class="channels-list">-->
<!--      <div v-for="channel in channelsStore.channels" :key="channel.id" @click="openChannelLink(channel)" class="channel">-->
<!--        <div class="channel-info">-->
<!--          <span class="name">{{ channel.title }}</span>-->
<!--        </div>-->
<!--        <div class="channel-action">-->
<!--          <span v-if="channel.is_available" class="reward">🪙 {{ channel.reward.toLocaleString() }}</span>-->
<!--          <span v-else class="reward">💠 Reward reached</span>-->
<!--          <svg class="arrow">-->
<!--            <use xlink:href="@/assets/images/sprite.svg#chevron-right"></use>-->
<!--          </svg>-->
<!--&lt;!&ndash;          <button v-if="channel.is_available" class="button" @click="openChannelLink(channel)">Join</button>&ndash;&gt;-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="channel" @click="wn.openTelegramLink('https://t.me/jetton?start=ccpGavsXUFo')">-->
<!--        <div class="channel-info">-->
<!--          <span class="name">JetTon</span>-->
<!--        </div>-->
<!--        <div class="channel-action">-->
<!--          <span class="reward" style="font-size: 12px;">🪙 100K after first deposit</span>-->
<!--          <svg class="arrow">-->
<!--            <use xlink:href="@/assets/images/sprite.svg#chevron-right"></use>-->
<!--          </svg>-->
<!--&lt;!&ndash;          <button class="button" @click="wn.openTelegramLink('https://t.me/jetton?start=ccpGavsXUFo')">Play</button>&ndash;&gt;-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>
