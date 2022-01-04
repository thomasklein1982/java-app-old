<template>
  <div style="width: 100%; height: 100%; overflow: hidden">
    <StartScreen 
      v-if="screen==='start'"
      @open-project="openProject"
    />
    <Editor
      v-else-if="screen==='editor'"
      :project="project"
      ref="editor"
    />
    
  </div>
</template>

<script>
import StartScreen from "./components/StartScreen.vue";
import Editor from "./components/Editor.vue";
import { nextTick } from '@vue/runtime-core';

export default{
  data(){
    return {
      screen: 'start',
      version: 1,
      project: null
    }
  },
  methods: {
    showScreen: function(name){
      this.screen=name;
    },
    openProject: function(project){
      this.project=project;      
      this.showScreen("editor");
    },
    getJavaScriptCode(){
      return this.project.getJavaScriptCode();
    }
  },
  components: {
    StartScreen,
    Editor
  }
}


</script>

<style>
#app {
  font-family: sans-serif;
}

</style>
