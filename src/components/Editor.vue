<template>
  <div v-if="project" style="width: 100%; height: 100%; overflow: hidden" :style="{display: 'flex', flexDirection: 'column'}">
    <EditorMenubar
      @download="downloadProject"
      @upload="uploadProject"
      
    />
    <Splitter :style="{flex: 1}" style="overflow: hidden;width: 100%;">
      <SplitterPanel style="overflow: hidden; height: 100%" :style="{display: 'flex', flexDirection: 'column'}">
        <TabView @tab-change="" v-model="activeTab" scrollable class="editor-tabs" >
          <TabPanel v-for="(c,i) in project.clazzes" :key="'tab-'+i">
            <template #header>
              {{c.name}} <span v-if="c.errors.length===0" style="font-size: small; color: lime" class="pi pi-check-circle"/><span v-else style="font-size: small; color: red" class="pi pi-exclamation-circle"></span>
            </template>
            <CodeMirror
              :clazz="c"
              ref="editor"
            />
          </TabPanel>
          <TabPanel>
            <template #header>
              <span class="pi pi-fw pi-plus"/>
            </template>
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
    <span style="position: fixed; bottom: 0.5rem; right: 0.5rem" class="p-buttonset">
      <Button :disabled="running && !paused" @click="resume()" icon="pi pi-play" />
      <Button v-if="paused" @click="step()" icon="pi pi-arrow-right" />
      <Button v-if="running" @click="stop()" icon="pi pi-times" />
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
import Outline from './Outline.vue';
import { download, saveLocally, upload } from '../functions/helper.js';
import { createAppCode, extractProjectCodeFromAppCode } from "../functions/appcode.js";
import { STORAGE_PROJECT } from '../consts/strings.js';
import { uploadProject } from "../functions/uploadProject.js";

export default {
  props: {
    project: null
  },
  data(){
    return {
      useBlockEditor: false,
      currentClazz: null,
      activeTab: 0,
      paused: false,
      running: false
    };
  },
  mounted(){
    let timer=setInterval(()=>{
      saveLocally(STORAGE_PROJECT,this.project.toSaveString());
    },1000);
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
    resume(){
      this.$root.currentPos=-1;
      if(this.paused){
        this.paused=false;
        //this.$refs.controlArea.resume();
      }else if(!this.running){
        this.running=true;
        this.$refs.preview.reload(this.project.getJavaScriptCode());
      }
      this.$refs.preview.focus();
    },
    step(){
      this.$root.currentPos=-1;
      this.$refs.controlArea.step();
    },
    stop(){
      this.$refs.preview.stop();
      this.paused=false;
      this.running=false;
      //this.$root.currentPos=-1;
    },
    addClazz(name){
      var c=new Clazz(name,this.project);
      this.project.clazzes.push(c);
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
    Outline,
    AppPreview
  }
}
</script>

<style scoped>

</style>