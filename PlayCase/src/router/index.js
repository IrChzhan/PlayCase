import { createRouter, createWebHistory } from 'vue-router';
import TeamNameDisplay from '@/views/TeamNameDisplay.vue';
import MenuApp from '@/views/MenuApp.vue';
import MenuRestourant from '@/views/MenuRestourant.vue'
import AdminHome from "@/admin/AdminHome.vue";
import AdminPlaces from "@/admin/AdminPlaces.vue";
import AdminPlace from "@/admin/AdminPlace.vue";
import Rules from '@/components/widgets/Rules.vue';
import WinnerPage from '@/views/WinnerPage.vue';
import ModalTypePay from '@/components/widgets/ModalTypePay.vue';
import RegistrateUsers from '@/views/RegistrateUsers.vue';

const routes = [{
        path: '/',
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
        path: '/place/:id',
        name: 'Place',
        component: AdminPlace,
        props: true
    },
    {
        path: '/typepay',
        name: 'ModalTypePay',
        component: ModalTypePay,
        props: true
    },
    {
        path: '/registrateusers',
        name: 'RegistrateUsers',
        component: RegistrateUsers,
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;