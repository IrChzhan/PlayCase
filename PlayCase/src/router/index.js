import { createRouter, createWebHistory } from 'vue-router'

import AdminHome from '@/admin/AdminHome.vue'
import AdminGames from '@/admin/Place/AdminGames.vue'
import AdminMenuPlace from '@/admin/Place/AdminMenuPlace.vue'
import AdminPlace from '@/admin/Place/AdminPlace.vue'
import AdminPlaces from '@/admin/Place/AdminPlaces.vue'
import AdminResults from '@/admin/Place/AdminResults.vue'
import AdminTeams from '@/admin/Place/AdminTeams.vue'
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

const routes = [
  {
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
    component: AdminHome,
    children: [
      {
        path: '/admin/users',
        name: 'AdminUsersHome',
        component: AdminUsersHome,
        children: [
          {
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
        path: '',
        name: 'AdminPlaces',
        component: AdminPlaces,
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
        path: '/admin/place/:id',
        name: 'Place',
        component: AdminPlace,
        props: true,
      },
      {
        path: '/admin/place/:id/category/:categoryId',
        name: 'AdminMenuPlace',
        component: AdminMenuPlace,
        props: true,
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
