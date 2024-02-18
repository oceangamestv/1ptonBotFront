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
    auto_farmer: boolean;
    auto_farmer_profit: number;
    access_token_expires_at: string;
    daily_booster_available_at: Date;
};

export interface Boosts {
    current_mine_level: number;
    mine_level_price: number;
    current_energy_level: number;
    energy_level_price: number;
    current_max_energy: number;
    max_energy_price: number;
    auto_farmer_price: number;
}

export interface UserWithBoosts {
    user: User;
    boosts: Boosts;
}

export interface DailyBooster {
    coin: number;
    energy: number;
    next_at: Date;
}

export interface MiningResult {
    balance: number;
    mined: number;
    newEnergy: number;
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
        boosts: null as Boosts | null
    }),
    getters: {
        getAccessToken: (state) => state.user?.access_token,
    },
    actions: {
        setUser(user: User) {
            this.user = user
        },
        setBoosts(boosts: Boosts) {
            this.boosts = boosts
        },
        async login(initData: string) {
            const apiKey = import.meta.env.VITE_API_KEY
            if (apiKey !== undefined && apiKey !== "") {
                try {
                    console.log(apiKey)
                    const response = await axios.get<User>(`${import.meta.env.VITE_API_HOST}/getMe`, {
                        headers: {
                            'x-api-key': apiKey,
                        }
                    });
                    console.log(response.data)
                    this.setUser(response.data);
                    if (!this.user) {
                        return
                    }
                    if (this.user.auto_farmer_profit > 0) {
                        this.user.balance -= this.user.auto_farmer_profit
                    }
                    return this.user
                } catch (error) {
                    console.error('Login via ready token error:', error);
                    // Обробка помилок або відображення повідомлення користувачу
                }
            } else {
                try {
                    const response = await axios.post<User>(`${import.meta.env.VITE_API_HOST}/authorize`, initData);
                    console.log(response.data)
                    this.setUser(response.data);
                } catch (error) {
                    console.error('Login error:', error);
                    // Обробка помилок або відображення повідомлення користувачу
                }
            }
        },
        mineCoins() {
            if (this.user && this.user.energy >= this.user.mine_level) {
                this.user.balance += this.user.mine_level
                this.user.energy -= this.user.mine_level
            }
        },
        async sendMineCoins(clicks: number) {
            if (!this.user) {
                return;
            }
            let energy = this.user.energy + this.user.mine_level * clicks

            console.log("clicks", clicks)
            console.log("energy", energy)
            console.log("to mine", this.user.mine_level * clicks)
            console.log("rouned", Math.round((energy / this.user.mine_level)))
            if (energy < this.user.mine_level * clicks && clicks > 1) {
                clicks = Math.round((energy / this.user.mine_level))
                if (clicks < 1) {
                    return
                }
            }
            const result = await axios.post<MiningResult>(`${import.meta.env.VITE_API_HOST}/mine`, {
                count: clicks,
            }, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });

            this.user.balance = result.data.balance
            this.user.energy = result.data.newEnergy
        },
        async getBoosts() {
            if (!this.user) {
                return
            }
            const response = await axios.get<Boosts>(`${import.meta.env.VITE_API_HOST}/boosts`, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            this.setBoosts(response.data);
        },
        async purchaseBoost(boost: string) {
            if (!this.user) {
                return;
            }

            const result = await axios.post<UserWithBoosts>(`${import.meta.env.VITE_API_HOST}/boosts`, {
                boost: boost,
            }, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            this.setUser(result.data.user)
            this.setBoosts(result.data.boosts)
            // this.user.balance = result.data.balance
            // this.user.energy = result.data.newEnergy
        },
        async openDailyBooster() {
            if (!this.user) {
                return;
            }

            const result = await axios.post<DailyBooster>(`${import.meta.env.VITE_API_HOST}/dailyBooster`, {}, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            return result.data
        },
        recharge() {
            if (this.user) {
                if (this.user.energy + this.user.energy_level > (1000 + this.user.max_energy_level * 500)) {
                    this.user.energy = 1000 + this.user.max_energy_level * 500
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