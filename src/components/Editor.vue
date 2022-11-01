<template>
  <div v-if="project" style="width: 100%; height: 100%; overflow: hidden" :style="{display: 'flex', flexDirection: 'column'}">
  
    <EditorMenubar
      :right-closed="rightClosed"
      @download="downloadProject"
      @upload="uploadProject"
      @new="$refs.dialogNewApp.setVisible(true)"
      @prettify="prettifyCode"
      @rename="renameSelection"
      @undo="$refs.editor[activeTab].undo()"
      @redo="$refs.editor[activeTab].redo()"
      @search="$refs.editor[activeTab].openSearchPanel()"
      @lint="$refs.editor[activeTab].toggleLintPanel()"
      @toggleright="toggleRight()"
      @resources="$refs.dialogResources.setVisible(true)"
      @database="$refs.dialogDatabase.setVisible(true)"
    />
    <LinksDialog
      ref="dialogResources"
    />
    <NewAppDialog @newapp="createNewApp" ref="dialogNewApp"/>
    <DatabaseDialog :database="database" ref="dialogDatabase"/>
    <Splitter ref="splitter" @resizeend="handleResize" :style="{flex: 1}" style="overflow: hidden;width: 100%;">
      <SplitterPanel :size="sizeCode" style="overflow: hidden; height: 100%" :style="{display: 'flex', flexDirection: 'column'}">        
        <TabView v-model:activeIndex="activeTab" :scrollable="true" class="editor-tabs" >
          <TabPanel v-for="(c,i) in project.clazzes" :key="'tab-'+c.name">
            <template #header>
              {{c.name}} <span v-if="c.errors.length===0" style="font-size: small; color: lime" class="pi pi-check-circle"/><span v-else style="font-size: small; color: red" class="pi pi-exclamation-circle"></span>
            </template>
            <UIEditor 
              v-if="isUIClazz(c)" 
              :clazz="c"
              @select="updateSelectedUIComponent"
              @recompile="compileProjectAndUpdateUIPreview()"
              @isolatedupdate="updateUIPreview()"
            >
            </UIEditor>
            <CodeMirror
              v-else
              :clazz="c"
              :project="project"
              :font-size="fontSize"
              :current="paused && i===activeTab ? current : null"
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
      <SplitterPanel :size="100-sizeCode" style="overflow: hidden; height: 100%" :style="{display: 'flex', flexDirection: 'column'}">  
        <Splitter layout="vertical" :style="{flex: 1}" style="overflow: hidden;width: 100%;">
          <SplitterPanel style="overflow: hidden;">
            <UIPreview ref="uipreview" v-if="isCurrentClazzUIClazz" :ui-clazz="currentClazz"/>
            <AppPreview v-else :paused="paused" :breakpoints="breakpoints" :project="project" ref="preview"/>
          </SplitterPanel>
          <SplitterPanel style="overflow: hidden;" :style="{display: 'flex', flexDirection: 'column'}">
            <UIComponentEditor 
              v-if="showUIEditor && selectedUIComponent" :component="selectedUIComponent"
              @recompile="compileProjectAndUpdateUIPreview()"
              @update="updateUIPreview()"
            />
            <Outline
              v-else
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
      <span class="p-buttonset" v-if="!isCurrentClazzUIClazz">
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
import { UIClazz } from "../classes/UIClazz.js";
import EditorMenubar from "./EditorMenubar.vue";
import CodeMirror from "./CodeMirror.vue";
import BlockEditor from "./BlockEditor.vue";
import ProjectExplorer from './ProjectExplorer.vue';
import AppPreview from './AppPreview.vue';
import UIEditor from './UIEditor.vue';
import UIComponentEditor from "./UIComponentEditor.vue";
import NewClazzWizard from './NewClazzWizard.vue';
import Outline from './Outline.vue';
import { download, saveLocally, upload } from '../functions/helper.js';
import { STORAGE_PROJECT } from '../consts/strings.js';
import { uploadProject } from "../functions/uploadProject.js";
import LinksDialog from "./LinksDialog.vue";
import NewAppDialog from "./NewAppDialog.vue";
import DatabaseDialog from "./DatabaseDialog.vue";
import {database} from "../classes/Database.js";
import UIPreview from "./UIPreview.vue";
import { nextTick } from "vue";


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
      sizeCode: 60,
      rightClosed: false,
      sizeCodeSaved: 60,
      closeRightAfterStopping: false,
      database: database,
      selectedUIComponent: null
    };
  },
  watch: {
    activeTab(nv,ov){
      if(this.$refs.editor && nv<this.$refs.editor.length){
        let ed=this.$refs.editor[nv];
        ed.updateLinter();
      }else{
        nextTick(()=>{
          this.updateUIPreview();
        });
        
      }
    },
    sizeCode(nv,ov){
      if(nv!==ov){
        this.setSplitterSizes(nv);
      }
    },
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
    },
    isCurrentClazzUIClazz(){
      return this.isUIClazz(this.currentClazz);
    },
    showUIEditor(){
      return (this.currentClazz && this.currentClazz instanceof UIClazz);
    }
  },
  mounted(){
    let timer=setInterval(()=>{
      if(!this.project) return;
      saveLocally(STORAGE_PROJECT,this.project.toSaveString());
    },1000);
  },
  methods: {
    compileProjectAndUpdateUIPreview(){
      this.compileProject();
      this.updateUIPreview();
    },
    updateUIPreview(){
      this.$refs.uipreview.reload();
    },
    compileProject(){
      this.project.compile();
    },
    updateSelectedUIComponent(c){
      this.selectedUIComponent=c;
    },
    recompileOtherClazzes(index){
      console.log("recompile all but "+index);
      let t1=Date.now();
      for(let i=0;i<this.project.clazzes.length;i++){
        if(i!==index){
          let c=this.project.clazzes[i];
          c.compile(this.project);
        }
      }
      let t2=Date.now();
      console.log("other clazzes recompiled in "+(t2-t1)+"ms");
    },
    renameSelection(){
      let cm=this.$refs.editor[this.activeTab];
      let node=cm.getSelectedNode();
      if(!node || !node.parent) return;
      if(node.name==="VariableDeclarator"){

      }else if(node.name==="Definition"){
        if(node.parent.name==="ClassDeclaration"){
          console.log("kalsse")
        }else if(node.parent.name==="MethodDeclaration"){
          console.log("methode")
        }
      }
    },
    toggleRight(){
      if(!this.rightClosed){
        this.sizeCodeSaved=this.sizeCode;
        this.sizeCode=100;
      }else{
        this.sizeCode=Math.max(10,this.sizeCodeSaved);
      }
      this.rightClosed=!this.rightClosed;
    },
    setSplitterSizes(left){
      let s=this.$refs.splitter;
      s.panelSizes=[left,100-left];
      let children = [...s.$el.children];
      let j=0;
      children.forEach((child, i) => {
        if(child.className.indexOf("p-splitter-panel")>=0){
          child.style.flexBasis = 'calc(' + s.panelSizes[j] + '% - ' + ((s.panels.length - 1) * s.gutterSize) + 'px)';
          j++;
        }
      });
      this.sizeCode=left;
    },
    handleResize(ev){
      this.sizeCode=ev.sizes[0];
    },
    setRuntimeError(error){
      let i=this.project.getClazzIndexByName(error.name);
      if(i>=0){
        this.$refs.editor[i].setRuntimeError(error);
        this.activeTab=i;
      }else{
        
      }
    },
    getEditorByName(name){
      let i=this.project.getClazzIndexByName(name);
      if(i>=0){
        return this.$refs.editor[i];
      }else{
        return null;
      }
    },
    setBreakpoints(breakpoints){
      this.$refs.preview.setBreakpoints(breakpoints);
    },
    openProject(p){
      this.project=p;
    },
    getProject(){
      return this.project;
    },
    async createNewApp(name,code){
      let p=new Project(name,code);
      this.database.clear();
      await p.initialize();
      this.openProject(p);
    },
    downloadProject(){
      if(this.project){
        download(this.project.getFullAppCode("",true),this.project.getName(),"text/html");
      }
    },
    async uploadProject(){
      this.database.clear();
      let p=await uploadProject();
      if(!p) return;
      this.openProject(p,this.useBlockEditor);
    },
    prettifyCode(){
      this.$refs.editor[this.activeTab].prettifyCode();
    },
    resume(){
      if(this.rightClosed){
        this.closeRightAfterStopping=true;
        this.toggleRight();
      }else{
        this.closeRightAfterStopping=false;
      }
      this.$root.resetCurrent();
      
      if(this.paused){
        this.$root.paused=false;
        this.$refs.preview.resume();
        //this.$refs.controlArea.resume();
      }else if(!this.running){
        this.running=true;
        this.$refs.preview.reload();
      }
    },
    step(){
      this.$root.resetCurrent();
      this.$refs.preview.step();
    },
    stop(){
      if(this.closeRightAfterStopping && !this.rightClosed){
        this.toggleRight();
      }
      this.$refs.preview.stop();
      this.$root.paused=false;
      this.running=false;
      this.$root.resetCurrent();
    },
    addNewClazz(clazzData){
      if(clazzData.ui){
        var c=new UIClazz(clazzData.name,this.project);
      }else{
        var c=new Clazz(clazzData.name,this.project);
      }
      this.project.addClazz(c);
    },
    trashCurrentClazz(){
      let a=confirm("Willst du die Klasse '"+this.currentClazz.name+"' wirklich löschen?");
      if(a){
        this.project.removeClazz(this.currentClazz);
      }
    },
    outlineClick(){

    },
    isUIClazz(c){
      return (c instanceof UIClazz);
    }
  },
  components: {
    EditorMenubar: EditorMenubar,
    CodeMirror,
    BlockEditor,
    ProjectExplorer,
    Outline,
    AppPreview,
    NewClazzWizard,
    LinksDialog,
    NewAppDialog,
    DatabaseDialog,
    UIEditor,
    UIComponentEditor,
    UIPreview
  }
}
</script>

<style scoped>

</style>