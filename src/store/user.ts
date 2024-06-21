import {defineStore} from 'pinia'
import axios from 'axios'
import TradingLevel from "@/components/TradingLevel.vue";

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
    premium_expires_at: Date | null;
    is_premium: boolean;
    daily_booster_available_at: Date;
};

export interface ApiError {
    message: string;
    code: number;
}

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

export interface Asset {
    id: number;
    name: string;
    code: string;
    network: string;
    price_usd: number;
}

export interface Order {
    id: string; // Assuming uuid.UUID is represented as a string in JSON
    asset_code: string;
    asset_amount: number;
    amount_usd: number;
    status: string;
}

export interface TradingLevel {
    level: number;
    price_usd: number;
    max_value: number;
}

export interface TradingLevels {
    trading_levels: TradingLevel[];
    manager: string;
}

export interface TradingResponse {
    referral_link: string;
    referral_count: number;
    trading_level: number;
    max_value: number;
    assets: Asset[];
    orders: Order[];
    trading_levels: TradingLevel[];
}

export interface Friend {
    avatar?: string;
    identity: string;
    reward: number;
}

export interface Friends {
    friends: Friend[];
    friend_count: number;
    friend_link: string;
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
        boosts: null as Boosts | null,
        tradingLevels: null as TradingLevel[] | null
    }),
    getters: {
        getAccessToken: (state) => state.user?.access_token,
        getMaxEnergy(): number {
            if (this.user) {
                return 1000 + (this.user.max_energy_level-1) * 500
            }
            return 0
        }
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
                    const response = await axios.get<User>(`${import.meta.env.VITE_API_HOST}/getMe`, {
                        headers: {
                            'x-api-key': apiKey,
                        }
                    });
                    this.setUser(response.data);
                } catch (error) {
                    console.error('Login via ready token error:', error);
                    // Обробка помилок або відображення повідомлення користувачу
                }
            } else {
                try {
                    const response = await axios.post<User>(`${import.meta.env.VITE_API_HOST}/authorize`, initData);
                    this.setUser(response.data);
                } catch (error) {
                    console.error('Login error:', error);
                    // Обробка помилок або відображення повідомлення користувачу
                }
            }
            if (!this.user) {
                return
            }
            if (this.user.auto_farmer_profit > 0) {
                this.user.balance -= this.user.auto_farmer_profit
            }
            return this.user
        },
        mineCoins() {
            if (this.user && this.user.energy >= this.user.mine_level) {
                var mul = 1
                if (this.user.is_premium) {
                    mul = 2
                }
                this.user.balance += this.user.mine_level * mul
                this.user.energy -= this.user.mine_level
            }
        },
        async getTrading() {
            if (!this.user) {
                return
            }
            const response = await axios.get<TradingResponse>(`${import.meta.env.VITE_API_HOST}/swap`, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            this.tradingLevels = response.data.trading_levels
            return response.data
        },
        async getTradingLevels() {
            if (!this.user) {
                return
            }
            const response = await axios.get<TradingLevels>(`${import.meta.env.VITE_API_HOST}/tradingLevels`, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            return response.data
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

            return result.data
        },
        async sellAsset(asset_id: number, amount: number) {
            if (!this.user) {
                return;
            }

            return await axios.post<Order>(`${import.meta.env.VITE_API_HOST}/swap`, {
                asset_id: asset_id,
                amount: amount,
            }, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            })
        },
        async friends() {
            if (!this.user) {
                return
            }
            const response = await axios.get<Friends>(`${import.meta.env.VITE_API_HOST}/friends`, {
                headers: {
                    'x-api-key': this.user.access_token,
                }
            });
            return response.data
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
                if (this.user.energy + this.user.energy_level > this.getMaxEnergy) {
                    this.user.energy = this.getMaxEnergy
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