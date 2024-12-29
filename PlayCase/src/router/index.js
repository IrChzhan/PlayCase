import { createRouter, createWebHistory } from 'vue-router'

import AdminHome from '@/admin/AdminHome.vue'
import AdminGames from '@/admin/Place/AdminGames.vue'
import AdminMenuPlace from '@/admin/Place/AdminMenuPlace.vue'
import AdminPlace from '@/admin/Place/AdminPlace.vue'
import AdminPlaces from '@/admin/Place/AdminPlaces.vue'
import AdminResults from '@/admin/Place/AdminResults.vue'
import AdminTeams from '@/admin/Place/AdminTeams.vue'
import AdminUsers from '@/admin/Place/AdminUsers.vue'
import ModalTypePay from '@/components/widgets/ModalTypePay.vue'
import Rules from '@/components/widgets/Rules.vue'
import AdminAuthPage from '@/views/AdminAuthPage.vue'
import HomePage from '@/views/HomePage.vue'
import MenuApp from '@/views/MenuApp.vue'
import MenuRestourant from '@/views/MenuRestourant.vue'
import RegistrateUsers from '@/views/RegistrateUsers.vue'
import TeamNameDisplay from '@/views/TeamNameDisplay.vue'
import TeamNameInput from '@/views/TeamNameInput.vue'
import WinnerPage from '@/views/WinnerPage.vue'
import { compile } from 'vue'
import ResultsExcel from '@/views/ResultsExcel.vue'

const routes = [{
        path: `${import.meta.env.VITE_Path_App}`,
        name: 'HomePage',
        component: HomePage,
    },
    {
        path: '/auth',
        name: 'AdminAuthPage',
        component: AdminAuthPage,
    },
    {
        path: `/TeamNameInput`,
        name: 'TeamNameInput',
        component: TeamNameInput,
    },
    {
        path: '/admin/users',
        name: 'AdminUsers',
        component: AdminUsers,
    },
    {
        path: '/display',
        name: 'TeamNameDisplay',
        component: TeamNameDisplay,
        props: true,
    },
    {
        path: '/menu-app',
        name: 'MenuApp',
        component: MenuApp,
        props: true,
    },
    {
        path: '/restourant-menu',
        name: 'RestourantMenu',
        component: MenuRestourant,
        props: true,
    },
    {
        path: '/rules',
        name: 'Rules',
        component: Rules,
        props: true,
    },

    {
        path: '/winnerpage',
        name: 'WinnerPage',
        component: WinnerPage,
        props: true,
    },

    {
        path: '/admin',
        name: 'AdminHome',
        component: AdminHome,
        props: true,
    },

    {
        path: '/admin/game/:gameId',
        name: 'AdminTeams',
        component: AdminTeams,
        props: true,
    },

    {
        path: '/admin/game/:gameId/teams/results',
        name: 'AdminResults',
        component: AdminResults,
        props: true,
    },

    {
        path: '/admin/games',
        name: 'AdminGames',
        component: AdminGames,
        props: true,
    },

    {
        path: '/admin/places',
        name: 'AdminPlaces',
        component: AdminPlaces,
        props: true,
    },
    {
        path: '/admin/place/:id',
        name: 'Place',
        component: AdminPlace,
        props: true,
    },
    {
        path: '/typepay',
        name: 'ModalTypePay',
        component: ModalTypePay,
        props: true,
    },
    {
        path: '/registrateusers',
        name: 'RegistrateUsers',
        component: RegistrateUsers,
        props: true,
    },
    {
        path: '/admin/place/:id/category/:categoryId',
        name: 'AdminMenuPlace',
        component: AdminMenuPlace,
        props: true,
    },
    {
        path: '/resultsExcel',
        name: 'ResultsExcel',
        component: ResultsExcel,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router