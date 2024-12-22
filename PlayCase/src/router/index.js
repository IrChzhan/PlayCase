import { createRouter, createWebHistory } from 'vue-router';
import TeamNameInput from '@/views/TeamNameInput.vue';
import TeamNameDisplay from '@/views/TeamNameDisplay.vue';
import MenuApp from '@/views/MenuApp.vue';
import MenuRestourant from '@/views/MenuRestourant.vue'
import AdminHome from "@/admin/AdminHome.vue";
import AdminPlaces from "@/admin/Place/AdminPlaces.vue";
import AdminPlace from "@/admin/Place/AdminPlace.vue";
import Rules from '@/components/widgets/Rules.vue';
import WinnerPage from '@/views/WinnerPage.vue';
import ModalTypePay from '@/components/widgets/ModalTypePay.vue';
import HomePage from "@/views/HomePage.vue";
import AdminAuthPage from "@/views/AdminAuthPage.vue";
import AdminUsers from "@/admin/Place/AdminUsers.vue";

const routes = [
    {
        path: `${import.meta.env.VITE_Path_App}`,
        name: 'HomePage',
        component: HomePage,
    },
    {
        path: '/auth',
        name: 'AdminAuthPage',
        component: AdminAuthPage
    },
    {
        path: `/TeamNameInput`,
        name: 'TeamNameInput',
        component: TeamNameInput,
    },
    {
        path: '/admin/users',
        name: 'AdminUsers',
        component: AdminUsers
    },
    {
        path: '/display/:teamName/:teamTable',
        name: 'TeamNameDisplay',
        component: TeamNameDisplay,
        props: true,
    },
    {
        path: '/menu-app/:teamName/:teamTable',
        name: 'MenuApp',
        component: MenuApp,
        props: true
    },
    {
        path: '/restourant-menu',
        name: 'RestourantMenu',
        component: MenuRestourant,
        props: true
    },
    {
        path: '/rules',
        name: 'Rules',
        component: Rules,
        props: true
    },

    {
        path: '/winnerpage',
        name: 'WinnerPage',
        component: WinnerPage,
        props: true
    },

    {
        path: '/admin',
        name: 'AdminHome',
        component: AdminHome,
        props: true
    },
    {
        path: '/admin/places',
        name: 'AdminPlaces',
        component: AdminPlaces,
        props: true
    },
    {
        path: '/admin/place/:id',
        name: 'Place',
        component: AdminPlace,
        props: true
    },
    {
        path: '/typepay',
        name: 'ModalTypePay',
        component: ModalTypePay,
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;