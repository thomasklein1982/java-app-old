<template>
  <div style="position: relative; padding: 0.1rem" :style="{border: selectedComponent===component? '2pt solid gold':'2pt solid transparent'}" >
    <Badge v-if="showName" :value="component.name" severity="info" style="position: absolute; top: 0; right: 0"></Badge>
    <template v-if="type==='JButton'">
      <button class="component jbutton">{{component.value}}</button>
    </template>
    <template v-if="type==='JLabel'">
      <div class="component jlabel">{{component.value}}</div>
    </template>
    <template v-if="type==='JTextField'">
      <input type="text" class="component jtextfield" :value="component.value" :placeholder="component.placeholder"/>
    </template>
    <template v-if="type==='JTextArea'">
      <textarea type="text" class="component jtextarea" :value="component.value" :placeholder="component.placeholder"/>
    </template>
    <template v-if="isContainer">
      <div>
        <div @click="handleClick" class="jpanel-top">JPanel</div>
        <div style="width: 100%" :style="{display: 'flex', 'flex-direction': 'row'}">
          <div @click="handleClick" style="background-color: blue">&nbsp;</div>
          <draggable
            v-model="component.components"
            item-key="id"
            :disabled="!isEditable"
            :removeOnSpill="true"
            :removeCloneOnHide="false"
            :group="{
              name: 'components',
              put: true
            }"
            ghost-class="drag-ghost-component"
            :style="{flex: 1}"
            style="padding-bottom: 1rem"
            @end="endDrag"
          >
            <template #item="{element}">
              <UIComponent :component="element" is-editable @clickcomponent="forwardClick" :selected-component="selectedComponent"/>
            </template>
          </draggable>
        </div>
        <div @click="handleClick" class="jpanel-bottom">&nbsp;</div>
      </div>
    </template>
    <template v-if="type==='DataTable'">
      <table class="datatable">
        <tr>
          <th colSpan="3">DataTable</th>
        </tr>
        <tr style="background-color: lightgray">
          <td v-for="j in 3">&nbsp;</td>
        </tr>
      </table>
    </template>
    <div v-if="!isContainer" @click="handleClick" style="cursor: pointer; position: absolute; left: 0; right: 0; top: 0; bottom: 0"></div>
  </div>
</template>

<script>
  import draggable from "vuedraggable";
import { UIClazz } from "../classes/UIClazz";
  export default{
    props: {
      component: Object,
      selectedComponent: Object,
      isEditable: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      showName(){
        if(this.component instanceof UIClazz){
          return false;
        }
        if(!this.component.name){
          return false;
        }
        return true;
      },
      type(){
        return this.component.type;
      },
      isContainer(){
        return this.type==="JPanel" || this.component instanceof UIClazz;
      },
      label(){
        if(this.isEditable && this.component.name){
          return this.component.name+" ["+this.component.type+"]";
        }else{
          return this.component.type;
        }
      }
    },
    methods: {
      handleClick(){
        console.log("handle click",this.component);
        this.$emit('clickcomponent',this.component);
      },
      forwardClick(c){
        console.log("forward click",c);
        this.$emit('clickcomponent',c);
      },
      endDrag(ev){
        // if(ev.from===ev.to) return;
        // let index=ev.newIndex;
        // console.log("end drag",ev);
        // ev.to.removeChild(ev.item);
      }
    },
    components: {
      draggable
    }
  }
</script>

<style scoped>
  .component{
    width: 100%;
    height: 1cm;
  }
  .jlabel{
    border: 1pt dotted black;
  }
  .datatable{
    border: 1pt solid black;
  }
  .jpanel{
    border: 1pt solid black;
    width: 100%;
  }
  .jpanel-top,.jpanel-bottom{
    width: 100%;
    background-color: red;
  }
  .datatable{
    width: 100%;
  }
  .drag-handle{
    cursor: pointer;
  }
  .drag-ghost-component{
    opacity: 0.4;
  }
</style>