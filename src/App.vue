<template>
  <div style="position: fixed; width: 100%; height: 100%; overflow: hidden">
    <StartScreen 
      v-if="screen==='start'"
      @open-project="openProject"
    />
    <Editor
      v-show="screen==='editor'"
      :paused="paused"
      :current="current"
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
      version: 4,
      paused: false,
      current: {line: -1, name: null}
    }
  },
  methods: {
    resetCurrent(){
      this.current={line: -1, name: this.current.name};
    },
    showScreen: function(name){
      this.screen=name;
    },
    openProject: function(project){
      this.$refs.editor.openProject(project);      
      this.showScreen("editor");
    },
    getProject(){
      return this.$refs.editor.getProject();
    },
    getJavaScriptCode(){
      return this.$refs.editor.getProject().getJavaScriptCode();
    },
    updateBreakpoints(breakpointSet,document,clazz){
      var n=breakpointSet.size;
      var iter=breakpointSet.iter(0);
      let bp=[];
      for(let i=0;i<n;i++){
        let pos=iter.from;
        let line=document.lineAt(pos);
        bp.push({
          n: line.number,
          f: clazz.name
        });
        iter.next();
      }
      this.$refs.editor.setBreakpoints(bp);
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
