<template>
  <div class="umlclazz">
    <div class="clazzname">
      {{clazz.name}}
    </div>
    <div class="attributes">
      <UmlMember :member="a" v-for="(a,i) in clazz.attributes" :key="'attr'+i"></UmlMember>
    </div>
    <div class="methods">
      <UmlMember v-if="clazz.constructor" :member="clazz.constructor"/>
      <template v-for="(m,i) in methods" :key="'ms'+i">
        <UmlMember :member="m"></UmlMember>
      </template>
    </div>
  </div>
</template>

<script>
import UmlMember from "./UmlMember.vue";

export default {
  props: {
    clazz: Object
  },
  computed: {
    methods(){
      let methods=[];
      for(let a in this.clazz.methods){
        let m=this.clazz.methods[a];
        methods.push(m);
      }
      return methods;
    }
  },
  components: {
    UmlMember
  }
}
</script>

<style scoped>
  .umlclazz{
    border: 1pt solid black;
    border-radius: 0.1rem;
    margin-top: 0.3rem;
  }
  .clazzname{
    border-bottom: 1pt solid black;
    text-align: center;
    font-weight: bold;
  }
  .attributes{
    border-bottom: 1pt solid black;
  }
  .attributes,.methods{
    min-height: 1rem;
  }
</style>