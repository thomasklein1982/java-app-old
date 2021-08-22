<template>
  <div style="width: 100%; height: 100%; overflow: hidden" :style="{display: 'flex', 'flex-direction': 'column'}">
    <EditorMenubar/>
    <div :style="{flex: 1, display: 'flex', 'flex-direction': 'row'}">
      <ProjectExplorer 
        :project="project"
        @class-selected="openClazz"
        @add-clazz="addClazz"
      />
      <CodeMirror ref="codemirror" v-show="!useBlockEditor"/>
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
      project: new Project(),
      currentClazz: null
    };
  },
  mounted(){
    this.openProject(this.project);
  },
  methods: {
    openProject(p,useBlockEditor){
      console.log("open project");
      this.project=p;
      this.useBlockEditor=useBlockEditor;
      this.openClazz(this.project.clazzes[0]);
    },
    openClazz(c){
      
      if(this.currentClazz===c) return;
      this.currentClazz=c;
      this.$refs.codemirror.setClazz(this.currentClazz);
    },
    addClazz(){
      
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