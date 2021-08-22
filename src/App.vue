<template>
  <div style="width: 100%; height: 100%; overflow: hidden">
    <StartScreen 
      v-if="screen==='start'"
      @open-project="openProject"
    />
    <EditorScreen
      v-else-if="screen==='editor'"
      ref="editor"
    />
    
  </div>
</template>

<script>
import StartScreen from "./components/StartScreen.vue";
import EditorScreen from "./components/EditorScreen.vue";
import { nextTick } from '@vue/runtime-core';

export default{
  data(){
    return {
      screen: 'start'
    }
  },
  methods: {
    showScreen: function(name){
      this.screen=name;
    },
    openProject: function(project,useBlockEditor){
      
      this.showScreen("editor");
      nextTick(()=>{
        this.$refs.editor.openProject(project,useBlockEditor);
      });
    }
  },
  components: {
    StartScreen: StartScreen,
    EditorScreen: EditorScreen
  }
}

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md
</script>

<style>
#app {
  font-family: sans-serif;
}

</style>
