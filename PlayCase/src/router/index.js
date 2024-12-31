import { createRouter, createWebHistory } from 'vue-router'

import AdminHome from '@/admin/AdminHome.vue'
import AdminGames from '@/admin/Place/AdminGames.vue'
import AdminMenuPlace from '@/admin/Place/AdminMenuPlace.vue'
import AdminPlaces from '@/admin/Place/AdminPlaces.vue'
import AdminResults from '@/admin/Place/AdminResults.vue'
import AdminTeams from '@/admin/Place/AdminTeams.vue'
import AdminPlacesCreatePlace from '@/admin/Places/AdminPlacesCreatePlace.vue'
import AdminPlacesHome from '@/admin/Places/AdminPlacesHome.vue'
import AdminPlace from '@/admin/Places/AdminPlacesPlace.vue'
import AdminPlacesPlace from '@/admin/Places/AdminPlacesPlace.vue'
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
    path: `${import.meta.env.VITE_Path_App}/auth`,
    name: 'AdminAuthPage',
    component: AdminAuthPage,
  },
  {
    path: `${import.meta.env.VITE_Path_App}/TeamNameInput`,
    name: 'TeamNameInput',
    component: TeamNameInput,
  },
  {
    path: `${import.meta.env.VITE_Path_App}/display`,
    name: 'TeamNameDisplay',
    component: TeamNameDisplay,
    props: true,
  },
  {
    path: `${import.meta.env.VITE_Path_App}/menu-app`,
    name: 'MenuApp',
    component: MenuApp,
    props: true,
  },
  {
    path: `${import.meta.env.VITE_Path_App}/restourant-menu`,
    name: 'RestourantMenu',
    component: MenuRestourant,
    props: true,
  },
  {
    path: `${import.meta.env.VITE_Path_App}/rules`,
    name: 'Rules',
    component: Rules,
    props: true,
  },

  {
    path: `${import.meta.env.VITE_Path_App}/winnerpage`,
    name: 'WinnerPage',
    component: WinnerPage,
    props: true,
  },

  {
    path: `${import.meta.env.VITE_Path_App}/admin`,
    component: AdminHome,
    children: [
      {
        path: `${import.meta.env.VITE_Path_App}/admin/users`,
        name: 'AdminUsersHome',
        component: AdminUsersHome,
        children: [
          {
            path: `${import.meta.env.VITE_Path_App}/admin/users/personal`,
            name: 'AdminUsersPersonal',
            component: AdminUsersPersonal,
          },
          {
            path: `${import.meta.env.VITE_Path_App}/admin/users/players`,
            name: 'AdminUsersPlayers',
            component: AdminUsersPlayers,
          },
          {
            path: `${import.meta.env.VITE_Path_App}/admin/users/players/create`,
            name: 'AdminUserCreatePlayers',
            component: AdminUserCreatePlayer,
          },
          {
            path: `${import.meta.env.VITE_Path_App}/admin/users/personal/create`,
            name: 'AdminUserCreatePersonal',
            component: AdminUserCreatePersonal,
          },
          {
            path: `${import.meta.env.VITE_Path_App}/admin/users/personal/change:id`,
            name: 'AdminUserChangePersonal',
            component: AdminUserChangePersonal,
          },
          {
            path: `${import.meta.env.VITE_Path_App}/admin/users/players/change:id`,
            name: 'AdminUserChangePlayer',
            component: AdminUserChangePlayer,
          },
        ],
      },
      {
        path: `${import.meta.env.VITE_Path_App}/admin/places`,
        name: 'AdminPlacesHome',
        component: AdminPlacesHome,
        children: [
          {
            path: `${import.meta.env.VITE_Path_App}/admin/places/create`,
            name: 'AdminPlacesCreatePlace',
            component: AdminPlacesCreatePlace,
          },
          {
            path: `${import.meta.env.VITE_Path_App}/admin/places/place/:id`,
            name: 'AdminPlacesPlace',
            component: AdminPlacesPlace,
            props: true,
          },
          {
            path: `${import.meta.env.VITE_Path_App}/admin/place/:id/category/:categoryId`,
            name: 'AdminMenuPlace',
            component: AdminMenuPlace,
            props: true,
          },
        ],
      },
      {
        path: `${import.meta.env.VITE_Path_App}/admin/game/:gameId`,
        name: 'AdminTeams',
        component: AdminTeams,
        props: true,
      },
      {
        path: `${import.meta.env.VITE_Path_App}/admin/game/:gameId/teams/results`,
        name: 'AdminResults',
        component: AdminResults,
        props: true,
      },
      {
        path: `${import.meta.env.VITE_Path_App}/admin/games`,
        name: 'AdminGames',
        component: AdminGames,
        props: true,
      },
    ],
  },
  {
    path: `${import.meta.env.VITE_Path_App}/registrateusers`,
    name: 'RegistrateUsers',
    component: RegistrateUsers,
    props: true,
  },
  {
    path: `${import.meta.env.VITE_Path_App}/resultsExcel`,
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
