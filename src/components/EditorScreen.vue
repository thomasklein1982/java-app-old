<template>
  <div style="width: 100%; height: 100%; overflow: hidden" :style="{display: 'flex', flexDirection: 'column'}">
    <EditorMenubar
      @download="downloadProject"
      @upload="uploadProject"
    />
    <div :style="{flex: 1, display: 'flex', flexDirection: 'row', overflowY: 'hidden'}">
      <ProjectExplorer 
        :project="project"
        :current-clazz="currentClazz"
        @clazz-selected="openClazz"
        @add-clazz="addClazz"
        @delete-clazz="deleteClazz"
      />
      <CodeMirror ref="codemirror" v-show="!useBlockEditor"/>
      <BlockEditor v-show="useBlockEditor"/>
      <Outline
        :project="project"
      />
    </div>
    
  </div>
</template>

<script>
import { Project } from "../classes/Project.js";
import { Clazz } from "../classes/Clazz.js";
import EditorMenubar from "./EditorMenubar.vue";
import CodeMirror from "./CodeMirror.vue";
import BlockEditor from "./BlockEditor.vue";
import ProjectExplorer from './ProjectExplorer.vue';
import Outline from './Outline.vue';
import { download, saveLocally, upload } from '../functions/helper.js';
import { createAppCode, extractProjectCodeFromAppCode } from "../functions/appcode.js";
import { STORAGE_PROJECT } from '../consts/strings.js';
import { uploadProject } from "../functions/uploadProject.js";

export default {
  data(){
    return {
      useBlockEditor: false,
      project: new Project(),
      currentClazz: null
    };
  },
  mounted(){
    let timer=setInterval(()=>{
      saveLocally(STORAGE_PROJECT,this.project.toSaveString());
    },1000);
    this.openProject(this.project);
  },
  methods: {
    downloadProject(){
      download(createAppCode(this.project),this.project.getName(),"text/html");
    },
    async uploadProject(){
      let p=await uploadProject();
      if(!p) return;
      this.openProject(p,this.useBlockEditor);
    },
    async openProject(p,useBlockEditor){
      console.log("open project");
      this.project=p;
      this.useBlockEditor=useBlockEditor;
      this.openClazz(this.project.clazzes[0]);
    },
    openClazz(c){
      console.log(c,this.currentClazz===c);
      if(this.currentClazz===c) return;
      this.currentClazz=c;
      this.$refs.codemirror.setClazz(this.currentClazz);
    },
    addClazz(name){
      var c=new Clazz(name);
      this.project.clazzes.push(c);
      console.log(this.project);
      this.openClazz(c);
    },
    deleteClazz(clazz){
      if(this.project.deleteClazz(clazz)){
        this.openClazz(this.project.clazzes[0]);
        this.project.compile();
      }
    }
  },
  components: {
    EditorMenubar: EditorMenubar,
    CodeMirror,
    BlockEditor,
    ProjectExplorer,
    Outline
  }
}
</script>

<style scoped>

</style>