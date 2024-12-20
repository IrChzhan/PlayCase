import { createRouter, createWebHistory } from 'vue-router';
import TeamNameInput from '@/views/TeamNameInput.vue';
import TeamNameDisplay from '@/views/TeamNameDisplay.vue';
import MenuApp from '@/views/MenuApp.vue';
import MenuRestourant from '@/views/MenuRestourant.vue'
import AdminHome from "@/admin/AdminHome.vue";
import AdminPlaces from "@/admin/AdminPlaces.vue";
import AdminPlace from "@/admin/AdminPlace.vue";

const routes = [{
        path: '/PlayCase',
        name: 'TeamNameInput',
        component: TeamNameInput,
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
        path: '/admin',
        name: 'AdminHome',
        component: AdminHome,
        props: true
    },
    {
        path: '/admin/places',
        name: 'AdminPlaces',
        component: AdminPlaces,
        props:true
    },
    {
        path: '/place/:id',
        name: 'Place',
        component: AdminPlace,
        props: true
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;