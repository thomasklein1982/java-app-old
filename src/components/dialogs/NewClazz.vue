<template>
<Dialog :style="{width: '50vw'}" :closable="false" header="Neue Klasse" :visible="show"> 
  <div class="p-field">
    <InputText style="width: 100%" id="name" autofocus placeholder="Name der neuen Klasse" type="text" v-model="name" aria-describedby="name-help"/>
    <small id="name-help" class="p-error">{{nameFehler}}</small>
  </div>
  <template #footer>
    <Button @click="confirm()" :disabled="nameFehler!==null" label="OK" icon="pi pi-check" />
    <Button label="No" icon="pi pi-times" class="p-button-text"/>
  </template>
</Dialog>
</template>

<script>

export default{
  props: {
    clazzes: {
      type: Array
    }
  },
  data: function(){
    return {
      show: false,
      name: ''
    }
  },
  computed: {
    nameFehler: function(){
      if(this.name.length===0){
        return "";
      }
      var t=/^[A-Z][A-Za-z_0-9]*$/.test(this.name);
      if(!t) return "Der Name muss mit einem Großbuchstaben beginnen und darf nur aus Buchstaben, Unterstrichen und Ziffern bestehen.";
      for(var i=0;i<this.clazzes.length;i++){
        var c=this.clazzes[i];
        if(this.name===c.name){
          return "Es gibt bereits eine Klasse mit diesem Namen";
        }
      }
      return null;
    }
  },
  methods: {
    open: function(){
      this.show=true;
    },
    close: function(){
      this.show=false;
    },
    confirm: function(){
      this.$emit('ok',this.name);
      this.name="";
      this.close();
    }
  }
}
</script>

<style scoped>
  .p-field * {
    display: block;
  }
</style>

