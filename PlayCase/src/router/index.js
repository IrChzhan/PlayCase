import { createRouter, createWebHistory } from 'vue-router';
import TeamNameInput from '@/components/TeamNameInput.vue';
import TeamNameDisplay from '@/components/TeamNameDisplay.vue';
import MenuApp from '@/components/MenuApp.vue';

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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;