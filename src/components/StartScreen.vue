<template>
  <div style="position: absolute; left: 0; top: 0; background-color: white; z-index: 2; width: 100%; height: 100%">
      <h1>Willkommen bei JavaBlox</h1>
      <p>Wähle eine der folgenden Möglichkeiten:</p>
      <div>
        
        <Button style="margin: 0.5rem; display: block" icon="pi pi-replay" @click="" label="Letzte App wiederherstellen"/>
        <Button style="margin: 0.5rem; display: block" icon="pi pi-file" @click="clickNewApp()" label="Neue App erstellen"/>
        <Button style="margin: 0.5rem; display: block" icon="pi pi-upload" @click="clickUploadApp()" label="App hochladen"/>
      </div>
      <div>
        <Checkbox binary input-id="use-blocks" v-model="useBlockEditor"></Checkbox>
        <label for="use-blocks">Block-Editor verwenden</label>
      </div>

      <DialogNewProject @ok="createNewApp" ref="dialogNewProject"/>
    </div>
</template>

<script>
import DialogNewProject from "./dialogs/NewProject.vue";
import {Project} from "../classes/Project.js";

export default {
  data(){
    return {
      useBlockEditor: true
    }
  },
  methods: {
    clickNewApp(){
      this.$refs.dialogNewProject.open();
    },
    async createNewApp(name){
      var p=new Project(name);
      await p.initialize();
      this.$emit('open-project',p,this.useBlockEditor);
    },
    async clickUploadApp(){
      let file=await upload();
      var pc=extractProjectCodeFromAppCode(file.code);
      var p=new Project();
      await p.fromSaveString(pc);
      this.$emit('open-project',p,this.useBlockEditor);
    }
  },
  components: {
    DialogNewProject: DialogNewProject
  }
}
</script>

<style scoped>

</style>