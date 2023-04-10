import { createRouter, createWebHashHistory } from 'vue-router'
import { asyncRoutes } from './routes'
const router = createRouter({
    history: createWebHashHistory(),
    routes: asyncRoutes,
    // scrollBehavior: () => ({ left: 0, top: 0 }),
})

export default router
