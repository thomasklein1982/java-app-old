<template>
  <h1>Neue Klasse hinzufügen</h1>
  <InputText clazz="nameError?'':'p-invalid'" v-model.trim="name" placeholder="Name der neuen Klasse"/>
  <small v-if="nameError" class="p-error">{{nameError}}</small>
  <small v-else>Der Name geht in Ordnung.</small>
  <Button label="Hinzufügen" :disabled="disableConfirm" icon="pi pi-check" @click="confirm()"/>
</template>

<script>
export default {
  props: {
    project: Object
  },
  emits: [
    'confirm'
  ],
  data: function(){
    return {
      name: ''
    };
  },
  computed: {
    disableConfirm(){
      if(this.nameError){
        return true;
      }else{
        return false;
      }
    },
    realName(){
      if(this.name.length===0) return this.name;
      return this.name.charAt(0).toUpperCase()+this.name.substring(1);
    },
    nameError(){
      if(this.realName.length===0){
        return "Der Name muss aus mindestens einem Zeichen bestehen.";
      }
      if(!/^[A-Za-z]/.test(this.realName)){
        return "Der Name muss mit einem Buchstaben beginnen."
      }
      if(!/^[A-Za-z][A-Za-z0-9_]*$/.test(this.realName)){
        return "Der Name darf nur aus Buchstaben, Ziffern und dem Unterstrich bestehen.";
      }
      if(this.realName==='App'){
        return "Der Name 'App' ist reserviert. Wähle einen anderen Namen.";
      }
      if(this.project.getClazzByName(this.name)){
        return "Es gibt bereits eine Klasse mit diesem Namen.";
      }
      return false;
    }
  },
  methods: {
    confirm(){
      this.$emit("confirm",{name: this.realName});
    }
  }
}
</script>