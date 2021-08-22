<template>
  <div id="root">
    <transition name="fade">
      <Button @click="show=true" v-show="!show" style="position: absolute; left: 0; top: 50%" icon="pi pi-chevron-right" id=""></Button>
    </transition>
    <transition name="fade">
      <Panel class="panel-full" id="panel" v-show="show">
        <template #header>
          Projekt-Explorer
        </template>
        <template #icons>
          <Button class="p-button-rounded p-button-text" icon="pi pi-times" @click="show=false"/>
        </template>
        <Tree 
          :value="treeNodes"
          selectionMode="single"
          v-model:selectionKeys="selectedKey"
          @node-select="nodeSelected"
          class="project-explorer"
        >
          <template #cmds>
            <Button @click="$refs.dialogNewClazz.open()" icon="pi pi-plus" class="p-button-rounded"></Button>
          </template>
          <template #clazz="data">
            {{data.node.label}} <Badge v-if="data.node.data.errors && data.node.data.errors.length>0" severity="danger" :value="data.node.data.errors.length"/>
          </template>
        </Tree>

      </Panel>
    </transition>
    <NewClazz ref="dialogNewClazz" :clazzes="project.clazzes" @ok="addClazz"></NewClazz>
  </div>
</template>

<script>
import { nextTick } from '@vue/runtime-core';
import NewClazz from './dialogs/NewClazz.vue';

export default {
  props: {
    project: Object
  },
  computed: {
    treeNodes(){
      return [
        {
          key: 'clazzes',
          selectable: false,
          label: 'Klassen',
          type: 'clazzes-root',
          children: ((project)=>{
            var list=[];
            list.push({
              key: 'cmds',
              type: 'cmds',
              selectable: false
            });
            for(var i=0;i<project.clazzes.length;i++){
              let c=project.clazzes[i];
              list.push({
                key: 'clazzes-'+i,
                label: c.name,
                data: c,
                type: "clazz"
              });
            }
            return list;
          })(this.project)
        },
        {
          key: 'ressources',
          label: 'Ressourcen',
          selectable: false,
          children: [
              
          ]
        }
      ];
    }
  },
  data(){
    return {
      show: true,
      selectedKey: {'clazzes-0': true}
    };
  },
  methods: {
    nodeSelected(node){
      console.log(node);
      if(node.type==='clazz'){
        this.$emit("clazz-selected",node.data);
      }
      
    },
    addClazz(name){
      this.$emit('add-clazz',name);
      nextTick(()=>{
        var key={};
        key['clazzes-'+(this.project.clazzes.length-1)]= true;
        this.selectedKey=key;
      });
    }
  },
  components: {
    NewClazz
  }
}
</script>

<style scoped>
  #root{
    display: flex;
    flex-direction: column;
    max-width: 20rem;
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