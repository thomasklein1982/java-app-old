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