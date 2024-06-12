import {useUserStore} from "@/store/user.ts";
import {computed} from "vue";

export const useEnergy = () => {
  const userStore = useUserStore();

  const energy = computed(() => userStore.user?.energy || 0);
  const maxEnergy = computed(() => userStore.getMaxEnergy);
  const energyPct = computed(() => {
    return (energy.value / maxEnergy.value) * 100;
  });
  return {
    energy,
    maxEnergy,
    energyPct
  }
}