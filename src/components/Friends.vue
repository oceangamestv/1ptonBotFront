<script setup lang="ts">
import {Friend, useUserStore} from "@/store/user.ts";
import {onMounted, ref} from "vue";
import {useWebAppNavigation} from "vue-tg";

const friends = ref<Friend[]>([]);
const friendCount = ref(0);
const friendLink = ref("");

const userStore = useUserStore()

onMounted(async () => {
  const friendsResult = await userStore.friends()
  if (friendsResult) {
    friends.value = friendsResult.friends
    friendLink.value = friendsResult.friend_link
    friendCount.value = friendsResult.friends.length
  }
})

const wn = useWebAppNavigation()

const shareLink = () => {
  wn.openTelegramLink(friendLink.value)
}

const getInitials = (name: string) => {
  if (name.startsWith("@")) {
    name = name.slice(1)
  }

  return name.split(' ').map((n) => n[0]).join('')
}

const limitText = (text: string, limit: number) => {
  if (text.length > limit) {
    return text.slice(0, limit) + '...';
  }
  return text;
}

</script>

<template>
  <main>
    <section class="friends-section">
      <div class="friends-offer">
        <div class="friends-offer__avatar">
          <img src="@/assets/friend.svg" alt="friend-avatar">
        </div>
        <h2 class="headline semi-bold">
          Friends
        </h2>
        <p class="caption-1 regular">
          You and your friends will receive bonuses
        </p>
      </div>

      <!-- you can also use <button> instead of <a> tag -->
      <a @click.prevent="shareLink" class="cta-widget invite-friends">
        <div class="cta-widget__content">
          <div class="cta-widget__icon-friends">
            <img src="@/assets/telegram.svg" width="24" height="24" alt="Telegram icon">
          </div>
          <div class="cta-widget__info">
            <div class="cta-widget__info-title">
              <strong class="sub-headline-2">Invite Friends</strong>
            </div>
          </div>
        </div>
        <img src="@/assets/arrow-right-circle.svg" class="cta-widget__arrow" width="32" height="32"
             alt="Arrow right icon">
      </a>

      <div class="friends-body">
        <div class="friends-block">
          <h4 class="friends-block__title title-3">Friends</h4>
          <div class="friends-block__card card" v-if="friends.length > 0">
            <div class="friends-block__card-subtitle">
              <p class="caption-1 regular">Username</p>
              <p class="caption-1 regular">Reward</p>
            </div>
            <div class="friends__divider"></div>
            <div v-for="(friend, index) in friends" :key="friend.identity">
              <div class="reward-widget">
                <div class="reward-widget__content">
                  <div class="reward-widget__icon">
                    <p class="title-3 bold">{{ getInitials(friend.identity) }}</p>
                  </div>
                  <div class="reward-widget__info">
                    <div class="reward-widget__info-title">
                      <strong>{{ limitText(friend.identity, 16) }}</strong>
                    </div>
                    <!-- <div class="reward-widget__info-date"> -->
                    <!-- <p class="sub-headline-2">Yesterday</p> -->
                    <!-- </div> -->
                  </div>
                </div>
                <div class="reward-widget__info">
                  <div class="reward-widget__info-title">
                    <p class="regular">+{{ friend.reward / 100 }}</p>
                  </div>
                  <div class="reward-widget__info-description">
                    <p class="sub-headline-2">Reward</p>
                  </div>
                </div>
              </div>
              <div v-if="index < friends.length - 1" class="friends__divider"></div>
            </div>
          </div>
          <div class="friends-block__card card" v-else style="text-align: center">
            No friends yet
          </div>

        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>

</style>