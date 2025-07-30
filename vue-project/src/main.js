import "primeicons/primeicons.css";
import "./flags.css";

import { createApp } from "vue";
import PrimeVue from "primevue/config";
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';

import Select from 'primevue/select';




import App from "./App.vue";
import AppState from './plugins/appState.js';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import Noir from './presets/Noir.js';
import router from "@/router";


const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Noir,
        options: {
            prefix: 'p',
            darkModeSelector: '.p-dark',
            cssLayer: false,
        }
    }
});
app.use(AppState);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
app.component('InputNumber', InputNumber);
app.component('InputText', InputText);
app.component('Select', Select);

app.component('ThemeSwitcher', ThemeSwitcher);

app.use(router)
app.mount("#app");
