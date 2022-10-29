<template>
  <div :style="{flex: 1, display: 'flex', 'flex-direction': 'row', overflow: 'hidden'}">
    <draggable 
      v-model="componentList"
      item-key="id"
      :group="{
        name: 'components',
        pull: 'clone',
        put: false
      }"
      ghost-class="drag-ghost"
      @start="startDrag"
      @end="endDrag"
      :clone="cloneItem"
      :sort="false"
      :style="{display: 'flex', 'flex-direction': 'column', 'align-items': 'stretch'}"
      style="overflow: auto"
    >
      <template #item="{element}">
        <UIComponent :component="element"/>
      </template>
    </draggable>
    <div :style="{flex: 1}" style="overflow: auto">
      <div>UI-Klasse {{clazz.name}}</div>
      <UIComponent :component="clazz" is-editable @clickcomponent="clickComponent" :selected-component="selectedComponent"/>
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
    data: function(){
      return {
        componentList: [{type: "JLabel", value: "JLabel"},{type: "JButton", value: "JButton"},{type: "JTextField", inputType: "text", value: "", placeholder: "JTextField"},{type: "JTextArea", value: "", placeholder: "JTextArea"},{type: "DataTable"},{type: "JPanel", components: [], template: "1"}],
        selectedComponent: null
      };
    },
    methods: {
      startDrag(ev){
        console.log(ev);
        let component=ev.item.__draggable_context.element;
        console.log(component.type);
      },
      endDrag(ev){
        console.log("end",ev);
        let component=ev.item.__draggable_context.element;
        

      },
      cloneItem(item){
        
        let copy=JSON.parse(JSON.stringify(item));
        copy.x=50;
        copy.y=50;
        copy.width=100;
        copy.height=100;
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