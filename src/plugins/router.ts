import { createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/', name: 'miner', component: () => import('@/components/Miner.vue')
    },
    {
        path: '/leaderboard', name: 'leaderboard', component: () => import('@/components/Leaderboard.vue')
    },
    {
        path: '/boosts', name: 'boosts', component: () => import('@/components/boosts/BoostsIndex.vue')
    },
    {
        path: '/channels', name: 'channels', component: () => import('@/components/Channels.vue')
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router