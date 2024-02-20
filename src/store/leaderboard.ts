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
};

export interface Leaderboard {
    players: LeaderboardPosition[]
    me: LeaderboardPosition
}

export const useLeaderboardStore = defineStore('leaderboard', {
    state: () => ({
        leaderboard: null as Leaderboard | null,
        lastFetch: 0
    }),
    actions: {
        async fetchLeaderboard() {
            console.log("fetched leaderboard")
            const now = Date.now();
            // Перевірка, чи минуло 3 хвилини з моменту останнього запиту
            if (now - this.lastFetch < 3 * 60 * 1000 && this.leaderboard) {
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
        }
    },
})