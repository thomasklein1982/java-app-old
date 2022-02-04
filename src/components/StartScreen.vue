<template>
  <div style="text-align: center; position: absolute; left: 0; top: 0; background-color: white; z-index: 2; width: 100%; height: 100%">
      <h1 style="margin-bottom: 0">Willkommen bei</h1>
      <img src="../assets/logo.png" style="width: 3cm">
      <p>Version {{$root.version}}</p>
      <p>Mit JavaApp kannst du Web-Apps mit Java programmieren, die auf allen Geräten laufen.</p>
      <p>Wähle eine der folgenden Möglichkeiten:</p>
      <div style="text-align: center">
        <Button :disabled="lastProject===null" style="margin: 0.5rem;" icon="pi pi-replay" @click="restoreApp()" label="Letzte App wiederherstellen"/>
        <Button style="margin: 0.5rem;" icon="pi pi-file" @click="createNewApp()" label="Neue App erstellen"/>
        <Button style="margin: 0.5rem;" icon="pi pi-upload" @click="clickUploadApp()" label="App hochladen"/>
      </div>
    </div>
</template>

<script>
import {Project} from "../classes/Project.js";
import { loadLocally } from "../functions/helper.js";
import { STORAGE_PROJECT } from "../consts/strings.js";
import { uploadProject } from "../functions/uploadProject.js";

export default {
  data(){
    return {
      lastProject: null
    }
  },
  mounted(){
    loadLocally(STORAGE_PROJECT).then((p)=>{
      this.lastProject=p;
      console.log('letzte daten geladen',p);
    });
  },
  methods: {
    async restoreApp(){
      var p=new Project();
      await p.fromSaveString(this.lastProject);
      this.$emit('open-project',p);
    },
    async createNewApp(){
      var p=new Project();
      await p.initialize();
      this.$emit('open-project',p);
    },
    async clickUploadApp(){
      let p=await uploadProject();
      if(!p) return;
      this.$emit('open-project',p);
    }
  }
}
</script>

<style scoped>

</style>