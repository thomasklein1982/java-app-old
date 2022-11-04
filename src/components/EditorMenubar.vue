<template>
  <Menubar :model="items">
    <template #start>
      <img alt="logo" src="/icon-transparent.png" height="40" >
    </template>
    <template #end>
      <Button class="p-button-secondary" style="margin-right: 0.5rem" label="" icon="pi pi-star" @click="$emit('resources')"/>
      <Button class="p-button-secondary" style="margin-right: 0.5rem" label="" icon="pi pi-search" @click="$emit('search')"/>
      <Button class="p-button-secondary" style="margin-right: 0.5rem" label="" icon="pi pi-exclamation-circle" @click="$emit('lint')"/>
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
                this.$emit('new');
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
            },
            {
              separator:true
            },
            {
              label: 'CSS',
              icon: 'pi pi-palette',
              command: (ev)=>{
                this.$emit('css');
              }
            },
            {
              label: 'Datenbank',
              icon: 'pi pi-database',
              command: (ev)=>{
                this.$emit('database');
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
          label: 'Umbenennen',
          icon: 'pi pi-fw pi-pencil',
          command: (ev)=>{
            this.$emit("rename");
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