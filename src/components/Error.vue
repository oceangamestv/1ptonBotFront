<template>
  <div class="modal-backdrop" :class="isPopupActive" @click="closePopup"></div>
  <div class="error-popup popup" :class="isPopupActive" @click="closePopup">
    <button class="popup__close" @click="closePopup">
      <img src="@/assets/cancel.svg" width="20" height="20" alt="Close popup">
    </button>
    <div class="popup__content">
      <div class="error-popup__avatar">
        <img src="@/assets/face-wink.svg" alt="Face icon">
      </div>

      <h5 class="error-popup__title title-2">
        {{ message }}
      </h5>

      <button class="primary-btn" data-close="error">
        <span>Okay</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const isPopupActive = computed(() => {
  return props.modelValue ? 'active' : '';
});

function closePopup() {
  emit('update:modelValue', false);
}
</script>

<style scoped>

</style>
