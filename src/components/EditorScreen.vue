<template>
  <div style="width: 100%; height: 100%">
    <EditorMenubar/>
    
  </div>
</template>

<script>
import { Project } from "../classes/Project.js";
import EditorMenubar from "./EditorMenubar.vue";

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
    EditorMenubar: EditorMenubar
  }
}
</script>

<style scoped>

</style>