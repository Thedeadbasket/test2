import { createRouter, createWebHistory } from 'vue-router'

import EstimationView from "@/views/EstimationView.vue";
import Home from "@/views/HomeView.vue";
import Settings from "@/views/SettingsView.vue"
import Analysis from "@/views/AnalysisView.vue";
import Risk from "@/views/RiskView.vue";
import Staff from "@/views/StaffView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/estimation',
      name: 'estimation',
      component: EstimationView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: Analysis,
    },
    {
      path: '/staff',
      name: 'staff',
      component: Staff,
    },
    {
      path: '/risk',
      name: 'risk',
      component: Risk,
    }


  ],
})

export default router
