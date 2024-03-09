import axios from 'axios';
import { defineStore } from 'pinia'
import { useUserStore } from './user';

export interface LeaderboardPosition {
    id: number;
    score: number;
    identity: string;
    position: number;
    avatar_url?: string;
    is_premium: boolean;
}

export interface Leaderboard {
    players: LeaderboardPosition[]
    me: LeaderboardPosition | null
}

export const useLeaderboardStore = defineStore('leaderboard', {
    state: () => ({
        leaderboard: null as Leaderboard | null,
        lastFetch: 0,
        dailyLeaderboard: null as Leaderboard | null,
        dailyLastFetch: 0,
        monthlyLeaderboard: null as Leaderboard | null,
        monthlyLastFetch: 0,
    }),
    actions: {
        async fetchLeaderboard() {
            const now = Date.now();
            // Перевірка, чи минуло 3 хвилини з моменту останнього запиту
            if (now - this.lastFetch < 60 * 1000 && this.leaderboard) {
                return;
            }
            try {
                const userStore = useUserStore();
                const response = await axios.get<Leaderboard>(`${import.meta.env.VITE_API_HOST}/leaderboard`, {
                    headers: {
                        'x-api-key': userStore.getAccessToken,
                    }
                });
                this.leaderboard = response.data;
                this.lastFetch = now;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async fetchDailyLeaderboard() {
            const now = Date.now();
            // Перевірка, чи минуло 3 хвилини з моменту останнього запиту
            if (now - this.dailyLastFetch < 60 * 1000 && this.dailyLeaderboard) {
                return;
            }
            try {
                const userStore = useUserStore();
                const response = await axios.get<Leaderboard>(`${import.meta.env.VITE_API_HOST}/leaderboard/daily`, {
                    headers: {
                        'x-api-key': userStore.getAccessToken,
                    }
                });
                this.dailyLeaderboard = response.data;
                this.dailyLastFetch = now;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async fetchMonthlyLeaderboard() {
            const now = Date.now();
            // Перевірка, чи минуло 3 хвилини з моменту останнього запиту
            if (now - this.monthlyLastFetch < 60 * 1000 && this.monthlyLeaderboard) {
                return;
            }
            try {
                const userStore = useUserStore();
                const response = await axios.get<Leaderboard>(`${import.meta.env.VITE_API_HOST}/leaderboard/monthly`, {
                    headers: {
                        'x-api-key': userStore.getAccessToken,
                    }
                });
                this.monthlyLeaderboard = response.data;
                this.monthlyLastFetch = now;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    },
})