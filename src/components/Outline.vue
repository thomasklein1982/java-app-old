<template>
  <div id="root">
    <UmlClazz v-for="(c,i) in project.clazzes" :key="'clazz'+i" :clazz="c"></UmlClazz>
  </div>
</template>

<script>
import UmlClazz from "./UmlClazz.vue";

export default {
  props: {
    project: Object
  },
  computed: {
    
  },
  data(){
    return {
      show: true,
      
    };
  },
  methods: {
    
  },
  components: {
    UmlClazz
  }
}
</script>

<style scoped>
  #root{
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
  #panel{
    flex: 1;
  }
  .p-tree{
    border: none;
  }
  .p-tree{
    padding: 0;
  }
</style>>