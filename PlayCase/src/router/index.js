import { createRouter, createWebHistory } from 'vue-router'

import AdminHome from '@/admin/AdminHome.vue'
import AdminGames from '@/admin/Games/AdminGames.vue'
import AdminGamesCreate from '@/admin/Games/AdminGamesCreate.vue'
import AdminGamesGame from '@/admin/Games/AdminGamesGame.vue'
import AdminGamesGameChange from '@/admin/Games/AdminGamesGameChange.vue'
import AdminGamesGameTeams from '@/admin/Games/AdminGamesGameTeams.vue'
import AdminGamesGameTeamsChange from '@/admin/Games/AdminGamesGameTeamsChange.vue'
import AdminGamesGameTeamsCreate from '@/admin/Games/AdminGamesGameTeamsCreate.vue'
import AdminGamesSetUser from '@/admin/Games/AdminGamesSetUser.vue'
import AdminLotoRegistrate from '@/admin/Games/AdminLotoRegistrate.vue'
import AdminResults from '@/admin/Games/AdminResults.vue'
import AdminPlacesCategories from '@/admin/Places/AdminPlacesCategories.vue'
import AdminPlacesChangeCategory from '@/admin/Places/AdminPlacesChangeCategory.vue'
import AdminPlacesChangeMeal from '@/admin/Places/AdminPlacesChangeMeal.vue'
import AdminPlacesChangePlace from '@/admin/Places/AdminPlacesChangePlace.vue'
import AdminPlacesCreateCategories from '@/admin/Places/AdminPlacesCreateCategories.vue'
import AdminPlacesCreateMeal from '@/admin/Places/AdminPlacesCreateMeal.vue'
import AdminPlacesCreatePlace from '@/admin/Places/AdminPlacesCreatePlace.vue'
import AdminPlacesHome from '@/admin/Places/AdminPlacesHome.vue'
import AdminPlacesMenu from '@/admin/Places/AdminPlacesMenu.vue'
import AdminUserChangePersonal from '@/admin/Users/AdminUserChangePersonal.vue'
import AdminUserChangePlayer from '@/admin/Users/AdminUserChangePlayer.vue'
import AdminUserCreatePersonal from '@/admin/Users/AdminUserCreatePersonal.vue'
import AdminUserCreatePlayer from '@/admin/Users/AdminUserCreatePlayer.vue'
import AdminUsersHome from '@/admin/Users/AdminUsersHome.vue'
import AdminUsersPersonal from '@/admin/Users/AdminUsersPersonal.vue'
import AdminUsersPlayers from '@/admin/Users/AdminUsersPlayers.vue'
import Rules from '@/components/widgets/Rules.vue'
import AdminAuthPage from '@/views/AdminAuthPage.vue'
import HomePage from '@/views/HomePage.vue'
import MenuApp from '@/views/MenuApp.vue'
import MenuRestourant from '@/views/MenuRestourant.vue'
import RegistrateUsers from '@/views/RegistrateUsers.vue'
import ResultsExcel from '@/views/ResultsExcel.vue'
import TeamNameDisplay from '@/views/TeamNameDisplay.vue'
import TeamNameInput from '@/views/TeamNameInput.vue'
import WinnerPage from '@/views/WinnerPage.vue'
import AdminGamesGameChangeStatus from "@/admin/Games/AdminGamesGameChangeStatus.vue";
import AdminPay from '@/admin/Games/AdminPay.vue';
import CompanyInfo from '@/views/CompanyInfo.vue'

const routes = [{
        path: `${import.meta.env.VITE_Path_App}`,
        name: 'HomePage',
        component: HomePage,
    },
    {
        path: `/auth`,
        name: 'AdminAuthPage',
        component: AdminAuthPage,
    },
    {
        path: `/TeamNameInput`,
        name: 'TeamNameInput',
        component: TeamNameInput,
    },
    {
        path: `/display`,
        name: 'TeamNameDisplay',
        component: TeamNameDisplay,
        props: true,
    },
    {
        path: `/menu-app`,
        name: 'MenuApp',
        component: MenuApp,
        props: true,
    },
    {
        path: `/restourant-menu`,
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
        path: '/inn',
        name: 'CompanyInfo',
        component: CompanyInfo,
        props: true
    },

    {
        path: '/winnerpage',
        name: 'WinnerPage',
        component: WinnerPage,
        props: true,
    },

    {
        path: '/admin',
        component: AdminHome,
        children: [{
                path: '/admin/users',
                name: 'AdminUsersHome',
                component: AdminUsersHome,
                children: [{
                        path: '/admin/users/personal',
                        name: 'AdminUsersPersonal',
                        component: AdminUsersPersonal,
                    },
                    {
                        path: '/admin/users/players',
                        name: 'AdminUsersPlayers',
                        component: AdminUsersPlayers,
                    },
                    {
                        path: '/admin/users/players/create',
                        name: 'AdminUserCreatePlayers',
                        component: AdminUserCreatePlayer,
                    },
                    {
                        path: '/admin/users/personal/create',
                        name: 'AdminUserCreatePersonal',
                        component: AdminUserCreatePersonal,
                    },
                    {
                        path: '/admin/users/personal/change:id',
                        name: 'AdminUserChangePersonal',
                        component: AdminUserChangePersonal,
                    },
                    {
                        path: '/admin/users/players/change:id',
                        name: 'AdminUserChangePlayer',
                        component: AdminUserChangePlayer,
                    },
                ],
            },
            {
                path: '/admin/places',
                name: 'AdminPlacesHome',
                component: AdminPlacesHome,
                children: [{
                        path: '/admin/places/create',
                        name: 'AdminPlacesCreatePlace',
                        component: AdminPlacesCreatePlace,
                    },
                    {
                        path: '/admin/places/changePlace/:id',
                        name: 'AdminPlaceChangePlace',
                        component: AdminPlacesChangePlace,
                    },
                    {
                        path: '/admin/places/changeCategory/:id/:categoryId',
                        name: 'AdminPlacesChangeCategory',
                        component: AdminPlacesChangeCategory,
                    },
                    {
                        path: '/admin/places/changeMeal/:id/:categoryId/:mealId',
                        name: 'AdminPlacesChangeMeal',
                        component: AdminPlacesChangeMeal,
                    },
                    {
                        path: '/admin/places/createMeal/:id/:categoryId',
                        name: 'AdminPlacesCreateMeal',
                        component: AdminPlacesCreateMeal,
                    },
                    {
                        path: '/admin/places/createCategories/:id',
                        name: 'AdminPlacesCreateCategories',
                        component: AdminPlacesCreateCategories,
                    },
                    {
                        path: '/admin/places/categories/:id',
                        name: 'AdminPlacesCategories',
                        component: AdminPlacesCategories,
                        children: [{
                            path: '/admin/places/categories/:id/menu/:categoryId',
                            name: 'AdminPlacesMenu',
                            component: AdminPlacesMenu,
                            props: true,
                        }, ],
                    },
                ],
            },
            {
                path: '/admin/games',
                name: 'AdminGames',
                component: AdminGames,
            },
            {
                path: '/admin/games/create',
                name: 'AdminGamesCreate',
                component: AdminGamesCreate,
            },
            {
                path: '/admin/games/game/:gameId/change',
                name: 'AdminGamesGameChange',
                component: AdminGamesGameChange,
            },
            {
                path: '/admin/games/game/:gameId/changeStatus',
                name: 'AdminGamesGameChangeStatus',
                component: AdminGamesGameChangeStatus
            },
            {
                path: '/admin/games/game:gameId',
                name: 'AdminGamesGame',
                component: AdminGamesGame,
                children: [{
                        path: '/admin/games/:gameId/team',
                        name: 'AdminGamesGameTeams',
                        component: AdminGamesGameTeams,
                    },
                    {
                        path: '/admin/games/:gameId/teams/results',
                        name: 'AdminResults',
                        component: AdminResults,
                        props: true,
                    },
                    {
                        path: '/admin/games/:gameId/teams/loto',
                        name: 'AdminLotoRegistrate',
                        component: AdminLotoRegistrate,
                        props: true,
                    },
                    {
                        path: '/admin/games/:gameId/teams/pay',
                        name: 'AdminPay',
                        component: AdminPay,
                        props: true,
                    },
                    {
                        path: '/admin/games/:gameId/team/:teamId/setUser',
                        name: 'AdminGamesSetUser',
                        component: AdminGamesSetUser,
                    },
                    {
                        path: '/admin/games/:gameId/team/create',
                        name: 'AdminGamesGameTeamsCreate',
                        component: AdminGamesGameTeamsCreate,
                    },
                    {
                        path: '/admin/games/:gameId/team/:teamId/changeTeam',
                        name: 'AdminGamesGameTeamsChange',
                        component: AdminGamesGameTeamsChange,
                    },
                ],
            },
        ],
    },
    {
        path: '/registrateusers',
        name: 'RegistrateUsers',
        component: RegistrateUsers,
        props: true,
    },
    {
        path: '/resultsExcel',
        name: 'ResultsExcel',
        component: ResultsExcel,
        props: true,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router