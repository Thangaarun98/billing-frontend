import { createRouter, createWebHistory } from 'vue-router';
import BillingCalculator from './../components/BillingCalculator.vue';
import receipt from './../components/receipt.vue';

const routes = [
        { path: '/', name: 'billingCalculator', component: BillingCalculator },
        { path: '/receipt/:billingId', name: 'receipt', component: receipt , props: true },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;