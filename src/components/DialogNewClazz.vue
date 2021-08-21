<template>
<Dialog v-model="show">
  <ui-dialog-title>Neue Klasse hinzufügen</ui-dialog-title>
  <ui-dialog-content>
    <ui-textfield label="Name der neuen Klasse" required pattern="[A-Z][a-z0-9_]*" v-model="name"></ui-textfield>
  </ui-dialog-content>
  <ui-dialog-actions>
    <ui-button  @click="confirm()" :disabled="!nameOK">OK</ui-button>
    <ui-button :class="buttonClass" @click="close()">Abbrechen</ui-button>
  </ui-dialog-actions>
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
    nameOK: function(){
      return (/^[A-Z][A-Za-z_0-9]*$/.test(this.name) && this.clazzes.indexOf(this.name)<0);
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

