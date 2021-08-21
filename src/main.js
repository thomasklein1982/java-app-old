import { createApp } from 'vue'
import App from './App.vue'
import { EditorView,EditorState,basicSetup } from "@codemirror/basic-setup";
import { java } from "@codemirror/lang-java";
import  * as PrimeVue  from "primevue/config";
import  Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import * as Dialog  from "primevue/dialog";
import Menubar from 'primevue/menubar';
import EditorScreen from './components/EditorScreen.vue';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import router from "./router";

let app=createApp(App);
app.use(router);
app.use(PrimeVue.default);
app.component('Button',Button);
app.component('Dialog',Dialog.default);
app.component('Checkbox',Checkbox);
app.component('InputText',InputText);
app.component('InputNumber',InputNumber);
app.component('Menubar',Menubar);
app.mount('#app');