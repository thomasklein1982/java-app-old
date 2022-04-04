<template>
  <Dialog header="Neue Relation" modal v-model:visible="show">
    <div class="field">
      <label for="relationname">Name</label>
      <InputText autofocus id="relationname" v-model="name" type="text" />
      <small>Der Name der neuen Relation.</small>
    </div>
    <template #footer>
      <Button @click="clickOK()" label="OK"/>
      <Button @click="setVisible(false)" class="p-button-outlined" label="Abbrechen"/>
    </template>
  </Dialog>
</template>

<script>
export default {
  data(){
    return {
      show: false,
      name: ""
    }
  },
  methods: {
    setVisible(v){
      this.show=v;
    },
    clickOK(){
      this.setVisible(false);
      this.$emit('confirm',this.name)
    }
  }
}
</script>

<style scoped>
  .field *{
    display: block;
  }
</style>