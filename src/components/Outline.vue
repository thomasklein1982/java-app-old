<template>
  <div id="root">
    <transition name="fade">
      <Button @click="show=true" v-show="!show" style="z-index: 2; position: absolute; right: 0; top: 50%" icon="pi pi-chevron-left" id=""></Button>
    </transition>
    <transition name="fade">
      <Panel class="panel-full" id="panel" v-show="show">
        <template #header>
          UML-Klassendiagramm
        </template>
        <template #icons>
          <Button class="p-button-rounded p-button-text" icon="pi pi-times" @click="show=false"/>
        </template>
        <UmlClazz v-for="(c,i) in project.clazzes" :key="'clazz'+i" :clazz="c"></UmlClazz>
      </Panel>
    </transition>
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