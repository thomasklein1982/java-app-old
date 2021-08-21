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
              label: 'Neues Projekt',
              icon: 'pi pi-add',
              command: (ev)=>{
                console.log(ev);
              }
            }
          ]
        }
      ]
    };
  }
}
</script>

<style scoped>

</style>