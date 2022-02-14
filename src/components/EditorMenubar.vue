<template>
  <Menubar :model="items">
    <template #start>
      <img alt="logo" src="../assets/icon-transparent.png" height="40" >
    </template>
    <template #end>
      <Button class="p-button-secondary" style="margin-right: 0.5rem" label="" icon="pi pi-search" @click="$emit('search')"/>
      <Button class="p-button-secondary" style="margin-right: 0.5rem" label="" icon="pi pi-undo" @click="$emit('undo')"/>
      <Button class="p-button-secondary" style="margin-right: 0.5rem" label="" icon="pi pi-refresh" @click="$emit('redo')"/>
      <Button class="p-button-secondary" style="margin-right: 0.5rem" label="" :icon="rightClosed? 'pi pi-eye-slash': 'pi pi-eye'" @click="$emit('toggleright')"/>
    </template>
  </Menubar>  
</template>

<script>
export default {
  props: {
    rightClosed: Boolean
  },
  data(){
    return {
      items: [
        {
          label: 'Projekt',
          icon: 'pi pi-fw pi-file',
          items: [
            {
              label: 'Neu',
              icon: 'pi pi-file',
              command: (ev)=>{
                let a=confirm('Willst du wirklich ein neues Projekt beginnen?\nDer bisherige Code geht verloren!');
                if(a){
                  this.$emit('new');
                }
              }
            },
            {
              label: 'Hochladen',
              icon: 'pi pi-upload',
              command: (ev)=>{
                this.$emit('upload');
              }
            },
            {
              label: 'Herunterladen',
              icon: 'pi pi-download',
              command: (ev)=>{
                this.$emit('download');
              }
            }
          ]
        },
        {
          label: 'Formatieren',
          icon: 'pi pi-fw pi-align-left',
          command: (ev)=>{
            this.$emit("prettify");
          }
        },
        {
          label: 'Einstellungen',
          icon: 'pi pi-cog',
          command: (ev)=>{
            
          }
        }
      ]
    };
  },
  methods: {
    updateItems(){
    } 
  }
}
</script>

<style scoped>

</style>