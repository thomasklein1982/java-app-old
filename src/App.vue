<template>
  <div style="position: fixed; width: 100%; height: 100%; overflow: hidden">
    <StartScreen 
      v-if="screen==='start'"
      @open-project="openProject"
    />
    <Editor
      v-show="screen==='editor'"
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
      version: 2
    }
  },
  methods: {
    showScreen: function(name){
      this.screen=name;
    },
    openProject: function(project){
      this.$refs.editor.openProject(project);      
      this.showScreen("editor");
    },
    getJavaScriptCode(){
      return this.$refs.editor.getProject().getJavaScriptCode();
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
