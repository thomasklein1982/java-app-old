<template>
  <div v-if="project" style="width: 100%; height: 100%; overflow: hidden" :style="{display: 'flex', flexDirection: 'column'}">
  
    <EditorMenubar
      @download="downloadProject"
      @upload="uploadProject"
      @new="newProject"
    />
    <Splitter :style="{flex: 1}" style="overflow: hidden;width: 100%;">
      <SplitterPanel style="overflow: hidden; height: 100%" :style="{display: 'flex', flexDirection: 'column'}">        
        <TabView v-model:activeIndex="activeTab" :scrollable="true" class="editor-tabs" >
          <TabPanel v-for="(c,i) in project.clazzes" :key="'tab-'+c.name">
            <template #header>
              {{c.name}} <span v-if="c.errors.length===0" style="font-size: small; color: lime" class="pi pi-check-circle"/><span v-else style="font-size: small; color: red" class="pi pi-exclamation-circle"></span>
            </template>
            <CodeMirror
              :clazz="c"
              :font-size="fontSize"
              :current="paused ? current : null"
              ref="editor"
            />
          </TabPanel>
          <TabPanel>
            <template #header>
              &thinsp;<span class="pi pi-fw pi-plus"/>&thinsp;
            </template>
            <NewClazzWizard :project="project" @confirm="addNewClazz"/>
          </TabPanel>
        </TabView>
        
      </SplitterPanel>
      <SplitterPanel style="overflow: hidden; height: 100%" :style="{display: 'flex', flexDirection: 'column'}">  
        <Splitter layout="vertical" :style="{flex: 1}" style="overflow: hidden;width: 100%;">
          <SplitterPanel style="overflow: hidden;">
            <AppPreview :paused="paused" :breakpoints="breakpoints" ref="preview"/>
          </SplitterPanel>
          <SplitterPanel style="overflow: hidden;" :style="{display: 'flex', flexDirection: 'column'}">
            <Outline 
              @click="outlineClick"
              :style="{flex: 1}" 
              ref="outline"
              :project="project"
            />
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>
    </Splitter>
    <span style="position: fixed; bottom: 0.5rem; right: 0.5rem">
      <Button v-if="currentClazz && activeTab>0" icon="pi pi-trash" @click="trashCurrentClazz()" style="margin-right: 0.5rem"/>
      <span class="p-buttonset">
        <Button :disabled="running && !paused" @click="resume()" icon="pi pi-play" />
        <Button v-if="paused" @click="step()" icon="pi pi-arrow-right" />
        <Button v-if="running" @click="stop()" icon="pi pi-times" />
      </span>
    </span>
  </div>
</template>

<script>
import { Project } from "../classes/Project.js";
import { Clazz } from "../classes/Clazz.js";
import EditorMenubar from "./EditorMenubar.vue";
import CodeMirror from "./CodeMirror.vue";
import BlockEditor from "./BlockEditor.vue";
import ProjectExplorer from './ProjectExplorer.vue';
import AppPreview from './AppPreview.vue';
import NewClazzWizard from './NewClazzWizard.vue';
import Outline from './Outline.vue';
import { download, saveLocally, upload } from '../functions/helper.js';
import { createAppCode, extractProjectCodeFromAppCode } from "../functions/appcode.js";
import { STORAGE_PROJECT } from '../consts/strings.js';
import { uploadProject } from "../functions/uploadProject.js";

export default {
  props: {
    current: Object,
    paused: Boolean
  },
  data(){
    return {
      useBlockEditor: false,
      activeTab: 0,
      running: false,
      project: null,
      fontSize: 20,
      breakpoints: [],
    };
  },
  watch: {
    current(nv,ov){
      if(nv!==null){
        let name=nv.name;
        for(let i=0;i<this.project.clazzes.length;i++){
          let c=this.project.clazzes[i];
          if(c.name===name){
            this.activeTab=i;
            return;
          }
        }
      }
    }

  },
  computed: {
    currentClazz(){
      if(this.project.clazzes.length===0 || this.activeTab>=this.project.clazzes.length){
        return null;
      }
      return this.project.clazzes[this.activeTab];
    }
  },
  mounted(){
    let timer=setInterval(()=>{
      if(!this.project) return;
      saveLocally(STORAGE_PROJECT,this.project.toSaveString());
    },1000);
  },
  methods: {
    setBreakpoints(breakpoints){
      this.$refs.preview.setBreakpoints(breakpoints);
    },
    openProject(p){
      this.project=p;
    },
    getProject(){
      return this.project;
    },
    async newProject(){
      let p=new Project();
      await p.initialize();
      this.openProject(p);
    },
    downloadProject(){
      download(createAppCode(this.project),this.project.getName(),"text/html");
    },
    async uploadProject(){
      let p=await uploadProject();
      if(!p) return;
      this.openProject(p,this.useBlockEditor);
    },
    resume(){
      this.$root.resetCurrent();
      
      if(this.paused){
        this.$root.paused=false;
        this.$refs.preview.resume();
        //this.$refs.controlArea.resume();
      }else if(!this.running){
        this.running=true;
        this.$refs.preview.reload(this.project.getJavaScriptCode());
      }
    },
    step(){
      this.$root.currentLine=-1;
      this.$refs.preview.step();
    },
    stop(){
      this.$refs.preview.stop();
      this.$root.paused=false;
      this.running=false;
      this.$root.currentLine=-1;
    },
    addNewClazz(clazzData){
      var c=new Clazz(clazzData.name,this.project);
      this.project.addClazz(c);
    },
    trashCurrentClazz(){
      let a=confirm("Willst du die Klasse '"+this.currentClazz.name+"' wirklich löschen?");
      if(a){
        this.project.removeClazz(this.currentClazz);
      }
    },
    outlineClick(){

    }
  },
  components: {
    EditorMenubar: EditorMenubar,
    CodeMirror,
    BlockEditor,
    ProjectExplorer,
    Outline,
    AppPreview,
    NewClazzWizard
  }
}
</script>

<style scoped>

</style>