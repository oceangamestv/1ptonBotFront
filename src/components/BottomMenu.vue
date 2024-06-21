<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute()

console.log(route.path === "/")

const isActive = (routeName: string): string => {
  return route.path === routeName ? "active" : "";
}

</script>

<template>
  <!-- Navigaton start -->
  <nav class="nav">
    <ul class="nav-list">
      <li class="nav-list__item" :class="isActive('/')">
        <router-link to="/" class="nav-list__link">
          <div class="nav-list__item-icon">
            <img src="@/assets/tabler_pick.svg" width="20" height="20" alt="Miner icon">
          </div>
          <span class="caption-1 semi-bold">Miner</span>
        </router-link>
      </li>
<!--      <li class="nav-list__item" :class="isActive('/swap')">-->
<!--        <router-link to="/swap" class="nav-list__link">-->
<!--          <div class="nav-list__item-icon">-->
<!--            <img src="@/assets/coins-convert.svg" width="20" height="20" alt="Swap icon">-->
<!--          </div>-->
<!--          <span class="caption-1 semi-bold">Friends</span>-->
<!--        </router-link>-->
<!--      </li>-->
      <li class="nav-list__item" :class="isActive('/friends')">
        <router-link to="/friends" class="nav-list__link">
          <div class="nav-list__item-icon">
            <img src="@/assets/friends-tab.svg" width="20" height="20" alt="Friends icon">
          </div>
          <span class="caption-1 semi-bold">Friends</span>
        </router-link>
      </li>
      <li class="nav-list__item" :class="isActive('/earn')">
        <router-link to="/earn" class="nav-list__link">
          <div class="nav-list__item-icon">
            <img src="@/assets/coins-stack.svg" width="20" height="20" alt="Earn icon">
          </div>
          <span class="caption-1 semi-bold">Earn</span>
        </router-link>
      </li>
      <li class="nav-list__item" :class="isActive('/boosts')">
        <router-link to="/boosts" class="nav-list__link">
          <div class="nav-list__item-icon">
            <img src="@/assets/rocket-alt.svg" width="20" height="20" alt="Boost icon">
          </div>
          <span class="caption-1 semi-bold">Boost</span>
        </router-link>
      </li>
    </ul>
  </nav>
  <!-- Navigaton end -->
</template>


