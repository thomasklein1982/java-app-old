<template>
  <Menubar :model="items">

  </Menubar>  
</template>

<script>
export default {
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
                
              }
            },
            {
              label: 'Hochladen',
              icon: 'pi pi-upload',
              command: (ev)=>{
                
              }
            },
            {
              label: 'Herunterladen',
              icon: 'pi pi-download',
              command: (ev)=>{
                
              }
            }
          ]
        },
        {
          label: 'Ausführen',
          icon: 'pi pi-play',
          command: (ev)=>{
            
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
  }
}
</script>

<style scoped>

</style>