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
        />

      </Panel>
    </transition>
  </div>
</template>

<script>
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
          children: ((project)=>{
            var list=[];
            list.push({
              key: 'cmd-add-class',
              label: 'Neue Klasse',
              icon: 'plus',
              type: 'cmd'
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
          children: [
              
          ]
        }
      ];
    }
  },
  data(){
    return {
      show: true,
      selectedKey: null
    };
  },
  methods: {
    nodeSelected(node){
      if(node.key==='cmd-add-clazz'){
        
      }
      if(node.type==='clazz'){
        this.$emit("clazz-selected",node.data);
      }
      
    }
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