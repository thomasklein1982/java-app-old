import {codeEditor} from "./../components/code-editor"
import { editorScreen } from "../components/editor-screen";
import { dialogNewClazz } from "../components/dialog-new-clazz";
import { startScreen } from "../components/start-screen";
import { app } from "../components/app";
import { dialogNewProject } from "../components/dialog-new-project";
import { blockEditor } from "../components/block-editor";

export function registerComponents(vue){
  codeEditor(vue);
  editorScreen(vue);
  dialogNewClazz(vue);
  startScreen(vue);
  app(vue);
  dialogNewProject(vue);
  blockEditor(vue);
  vue.directive('ripple',primevue.ripple);
  vue.component('InputText',primevue.inputtext);
  vue.component('p-button',primevue.button);
};