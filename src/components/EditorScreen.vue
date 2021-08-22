<template>
  <div style="width: 100%; height: 100%; overflow: hidden" :style="{display: 'flex', 'flex-direction': 'column'}">
    <EditorMenubar/>
    <div :style="{flex: 1, display: 'flex', 'flex-direction': 'row'}">
      <ProjectExplorer/>
      <CodeMirror v-show="!useBlockEditor"/>
      <BlockEditor v-show="useBlockEditor"/>
    </div>
    
  </div>
</template>

<script>
import { Project } from "../classes/Project.js";
import EditorMenubar from "./EditorMenubar.vue";
import CodeMirror from "./CodeMirror.vue";
import BlockEditor from "./BlockEditor.vue";
import ProjectExplorer from './ProjectExplorer.vue';

export default {
  data(){
    return {
      useBlockEditor: false,
      project: new Project()
    };
  },
  methods: {
    openProject(p,useBlockEditor){
      this.project=p;
      this.useBlockEditor=useBlockEditor;
      this.clickClazz(this.project.clazzes[0]);
    },
    clickClazz(c){
      if(this.currentClazz===c) return;
      //this.openDrawer=false;
      this.currentClazz=c;
      //this.codeEditor.setClazz(this.currentClazz);
    }
  },
  components: {
    EditorMenubar: EditorMenubar,
    CodeMirror,
    BlockEditor,
    ProjectExplorer
  }
}
</script>

<style scoped>

</style>