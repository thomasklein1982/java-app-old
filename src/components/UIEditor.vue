<template>
  <div :style="{flex: 1, display: 'flex', 'flex-direction': 'row', overflow: 'hidden'}">
    <draggable 
      v-model="allComponents"
      item-key="id"
      :group="{
        name: 'components',
        pull: 'clone',
        put: false
      }"
      handle=".handle"
      ghost-class="drag-ghost"
      @drop="handleDrop"
      @add="handleAdd"
      :clone="cloneItem"
      :sort="false"
      :style="{display: 'flex', 'flex-direction': 'column', 'align-items': 'stretch'}"
      style="overflow: auto"
    >
      <template #item="{element}">
        <UIComponent :component="element"/>
      </template>
    </draggable>
    <div class="ui-clazz" :style="{flex: 1}" style="overflow: auto">
      <UIComponent :component="clazz" is-editable @clickcomponent="clickComponent" :selected-component="selectedComponent" @recompile="$emit('recompile')" @isolatedupdate="$emit('isolatedupdate')" @duplicate="duplicateSelectedComponent()"/>
    </div>
  </div>
</template>

<script>
  import UIComponent from "./UIComponent.vue";
  import draggable from "vuedraggable";
  export default{
    props: {
      clazz: {
        type: Object
      }
    },
    computed: {
      allComponents(){
        let components=[];
        components=components.concat(this.componentList);
        let project=this.clazz.project;
        for(let i=0;i<project.clazzes.length;i++){
          let c=project.clazzes[i];
          if(c.isUIClazz()){
            components.push(c.getComponentObject());
          }
        }
        return components;
      }
    },
    data: function(){
      return {
        componentList: [{type: "JPanel", components: [], template: "1", onAction: false}, {type: "JLabel", value: "JLabel", valueType: "html", onAction: false},{type: "JButton", value: "JButton", valueType: "html", actionCommand: ""},{type: "JTextField", inputType: "text", value: "", placeholder: "JTextField", valueType: "inline-text", onAction: false},{type: "JTextArea", value: "", placeholder: "JTextArea", valueType: "text"}, {type: "JCheckBox", value: true, label: "JCheckBox", valueType: "Boolean", onAction: true}, {type: "JComboBox", value: "Ja", options: '["Ja","Nein","Vielleicht"]',valueType: "text", onAction: false}, {type: "DataTable"}, {type: "JImage", value: "https://thomaskl.uber.space/Webapps/Assets/graphics/overworld/house-front.png", valueType: "text", onAction: false}, {type: "Canvas", components: [], internalWidth: 100, internalHeight: 100, onAction: false}, {type: "For", controlComponent: {min: 1, max: 10, variable: "i"}}, {type: "If", controlComponent: {condition: "true"}}, {type: "ElseIf", controlComponent: {condition: "true"}}, {type: "Else", controlComponent: {}}],
        selectedComponent: null
      };
    },
    methods: {
      duplicateSelectedComponent(){
        
      },
      handleDrop(ev){
        console.log("dropped",ev);
      },
      handleAdd(ev){
        console.log("add",ev);
      },
      cloneItem(item){
        
        let copy=JSON.parse(JSON.stringify(item));
        if(copy.controlComponent){
          copy.components=[];
        }else{
          copy.x=50;
          copy.y=50;
          copy.width=100;
          copy.height=100;
          copy.cssClass=copy.type.toLowerCase();
          copy.cssCode="";
        }
        return copy;
      },
      clickComponent(c){
        if(this.selectedComponent===c){
          this.selectedComponent=null;
        }else{
          this.selectedComponent=c;
        }
        this.$emit("select",this.selectedComponent);
      }
    },
    components: {
      UIComponent, draggable
    }
  }
</script>

<style>
  .drag-ghost{
    opacity: 0;
  }
</style>