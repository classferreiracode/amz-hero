import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Intro',
        component: () => import('@/components/Intro.vue')
    },
    {
        path: '/preludio',
        name: 'Preludio',
        component: () => import('@/components/PreludioFase1.vue')
    },
    {
        path: '/fase1',
        name: 'Fase1',
        component: () => import('@/components/Fase1.vue')
    },
    {
        path: '/preludio2',
        name: 'Preludio2',
        component: () => import('@/components/PreludioFase2.vue')
    },
    {
        path: '/fase2',
        name: 'Fase2',
        component: () => import('@/components/Fase2.vue')
    },
    {
        path: '/preludio3',
        name: 'Preludio3',
        component: () => import('@/components/PreludioFase3.vue')
    },
    {
        path: '/fase3',
        name: 'Fase3',
        component: () => import('@/components/Fase3.vue')
    },
    {
        path: '/preludio4',
        name: 'Preludio4',
        component: () => import('@/components/PreludioFase4.vue')
    },
    {
        path: '/fasefinal',
        name: 'Final',
        component: () => import('@/components/FaseFinal.vue')
    }
]

const router = createRouter({
    history: createWebHistory('/'),
    routes
})

export default router
