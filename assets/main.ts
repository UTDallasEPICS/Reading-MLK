import { createApp } from "vue";
import App from "./App.vue";

import { VueSelect } from "vue-select";

createApp(App)
    .component("v-select", VueSelect)
    .mount("#app");