import { createRouter, createWebHistory } from 'vue-router';
import TeamNameInput from '@/views/TeamNameInput.vue';
import TeamNameDisplay from '@/views/TeamNameDisplay.vue';
import MenuApp from '@/views/MenuApp.vue';
import MenuRestourant from '@/views/MenuRestourant.vue'

const routes = [{
        path: '/',
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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;