import { createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/', name: 'miner', component: () => import('@/components/Miner.vue')
    },
    {
        path: '/swap', name: 'swap', component: () => import('@/components/Swap.vue')
    },
    {
        path: '/tradingLevel', name: 'tradingLevel', component: () => import('@/components/TradingLevel.vue')
    },
    {
        path: '/leaderboard', name: 'leaderboard', component: () => import('@/components/Leaderboard.vue')
    },
    {
        path: '/boosts', name: 'boosts', component: () => import('@/components/boosts/BoostsIndex.vue')
    },
    {
        path: '/earn', name: 'earn', component: () => import('@/components/Channels.vue')
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router