import { createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/', name: 'miner', component: () => import('../components/Miner.vue')
    },
    {
        path: '/leaderboard', name: 'leaderboard', component: () => import('../components/Leaderboard.vue')
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router