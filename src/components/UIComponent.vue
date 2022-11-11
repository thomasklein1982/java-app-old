<template>
  <div style="position: relative; padding: 0.1rem" :style="{'user-select': 'none',border: selectedComponent===component? '2pt solid gold':'2pt solid transparent'}" >
    <div v-if="!isContainer" :style="{display: 'flex'}">
      <span class="pi handle pi-arrows-alt"/>
      <div style="position: relative" :style="{flex: 1}">
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
        <div @click="handleClick" style="cursor: pointer; position: absolute; left: 0; right: 0; top: 0; bottom: 0"></div>
      </div>
    </div>
    <template v-else>
      <div>
        <div v-if="isUIClazz" class="ui-clazz-top" @click="handleClick">UIKlasse {{component.name}}</div>
        <div v-else class="jpanel-color" :style="{display: 'flex'}">
          <span class="pi handle" :class="isEditable? 'pi-arrows-v' :'pi-arrows-h'"/>
          <div :style="{flex: 1}" @click="handleClick" class="jpanel-top">JPanel</div>
        </div>
        <div style="width: 100%" :class="isUIClazz? 'ui-clazz-body':''" :style="{display: 'flex', 'flex-direction': 'row'}">
          <div v-if="!isUIClazz" @click="handleClick" class="jpanel-left">&nbsp;</div>
          <draggable
            v-model="component.components"
            item-key="id"
            :disabled="!isEditable"
            :removeCloneOnHide="false"
            :group="{
              name: 'components',
              put: true
            }"
            handle=".handle"
            ghost-class="drag-ghost-component"
            :style="{flex: 1,'padding-bottom': isUIClazz? '100%':'2rem'}"
            @end="endDrag"
            @add="emitIsolatedUpdate()"
            @sort="emitIsolatedUpdate()"
          >
            <template #item="{element}">
              <UIComponent @recompile="$emit('recompile')" @isolatedupdate="emitIsolatedUpdate()" :component="element" is-editable @clickcomponent="forwardClick" :selected-component="selectedComponent"/>
            </template>
          </draggable>
        </div>
        <div v-if="!isUIClazz" @click="handleClick" class="jpanel-bottom">&nbsp;</div>
      </div>
    </template>
    <Badge v-if="showName" :value="component.name" severity="info" style="position: absolute; top: 0; right: 0"></Badge>
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
      isUIClazz(){
        return this.component instanceof UIClazz;
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
        this.$emit('clickcomponent',this.component);
      },
      forwardClick(c){
        this.$emit('clickcomponent',c);
      },
      handleAdd(ev){
        this.emitIsolatedUpdate();
      },
      emitIsolatedUpdate(){
        this.$emit('isolatedupdate');
      },
      endDrag(ev){
        window.drag=ev;
        let from=ev.from;
        while(from && from.className!=="ui-clazz"){
          from=from.parentElement;
        }
        let remove=false;
        if(from){
          let rect=from.getBoundingClientRect();
          let x=ev.originalEvent.clientX;
          let y=ev.originalEvent.clientY;
          if(x<rect.x || x>rect.x+rect.width || y<rect.y || y>rect.y+rect.height){
            remove=true;
          }
        }else{
          remove=true;
        }
        if(remove){
          let list=ev.from.__draggable_component__.realList;
          if(list){
            list.splice(ev.oldIndex,1);
            this.$emit("recompile");
          }
        }
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
  .ui-class-top{
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
    min-height: 0.8cm;
    line-height: 0.8cm;
    padding: 0.2rem;
  }
  .jpanel-color,.jpanel-left,.jpanel-top,.jpanel-bottom{
    background-color: #DDD;
    cursor: pointer;
  }
  .jpanel-left{
    width: 0.3cm;
  }
  .datatable{
    width: 100%;
  }
  .handle{
    cursor: pointer;
    width: 1cm;
    height: 1cm;
    display: inline-block;
    line-height: 1cm;
    text-align: center;
    background-color: rgba(0,0,0,0);
  }
  .drag-ghost-component{
    opacity: 0.4;
  }
</style>