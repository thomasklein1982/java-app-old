import { createApp } from 'vue'
import App from './App.vue'
import { EditorView,EditorState,basicSetup } from "@codemirror/basic-setup";
import { java } from "@codemirror/lang-java";
import  * as PrimeVue  from "primevue/config";
import  Button from "primevue/button";
import * as Dialog  from "primevue/dialog";

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

let app=createApp(App);
app.use(PrimeVue.default);
app.component('Button',Button);
app.component('Dialog',Dialog.default)
app.mount('#app');
let editorElement=document.getElementById("editor");

let editor=new EditorView({
  state: EditorState.create({
    extensions: [basicSetup, java()]
  }),
  parent: editorElement
});