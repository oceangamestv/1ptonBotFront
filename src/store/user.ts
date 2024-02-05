import { defineStore } from 'pinia'
import axios from 'axios'

export interface User {
    id: number;
    balance: number;
    first_name: string;
    energy: number;
    energy_level: number;
    max_energy_level: number;
    mine_level: number;
    access_token: string;
    avatar_url?: string;
    access_token_expires_at: string;
};

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null
    }),
    actions: {
        setUser(user: User) {
            this.user = user
        },
        async login(initData: string) {
            try {
                const response = await axios.post<User>(`${import.meta.env.VITE_API_HOST}/authorize`, initData);
                console.log(response.data)
                this.setUser(response.data);
            } catch (error) {
                console.error('Login error:', error);
                // Обробка помилок або відображення повідомлення користувачу
            }
        },
        mineCoins() {
            if (this.user) {
                this.user.balance += this.user.mine_level
                this.user.energy -= this.user.energy_level
            }
        },
        recharge() {
            if (this.user) {
                if (this.user.energy + this.user.energy_level > (1000 + this.user.max_energy_level)) {
                    this.user.energy = 1000 + this.user.max_energy_level
                    return
                }
                this.user.energy += this.user.energy_level
            }
        },
        logout() {
            this.user = null
        }
    }
})