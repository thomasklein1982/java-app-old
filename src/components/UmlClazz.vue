<template>
  <div id="root">
    <div id="clazzname">
      {{clazz.name}}
    </div>
    <div id="attributes">
      <UmlMember :member="a" v-for="(a,i) in clazz.attributes" :key="'attr'+i"></UmlMember>
    </div>
    <div id="methods">
      <UmlMember :member="a" v-for="(a,i) in clazz.methods" :key="'attr'+i"></UmlMember>
    </div>
  </div>
</template>

<script>
import UmlMember from "./UmlMember.vue";

export default {
  props: {
    clazz: Object
  },
  components: {
    UmlMember
  }
}
</script>

<style scoped>
  #root{
    border: 1pt solid black;
    border-radius: 0.1rem;
  }
  #clazzname{
    border-bottom: 1pt solid black;
    text-align: center;
    font-weight: bold;
  }
  #attributes{
    border-bottom: 1pt solid black;
  }
  #attributes,#methods{
    min-height: 1rem;
  }
</style>