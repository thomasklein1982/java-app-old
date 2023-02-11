<template>
  <div style="position: relative; padding: 0.1rem" :style="{'user-select': 'none',border: selectedComponent===component? '2pt solid gold':'2pt solid transparent'}" >
    <span style="color: red" class="pi handle pi-exclamation-circle" v-if="component.errors && component.errors.length>0"/>
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
          <input type="text" class="component jtextfield" :value="isEditable? component.value:'JTextField'" :placeholder="component.placeholder"/>
        </template>
        <template v-if="type==='JImage'">
          <img class="jimage" :src="component.value"/>
        </template>
        <template v-if="type==='JCheckBox'">
          <input type="checkbox" :checked="component.value"/> {{component.label}}
        </template>
        <template v-if="type==='JTextArea'">
          <textarea type="text" class="component jtextarea" :value="isEditable? component.value:'JTextArea'" :placeholder="component.placeholder"/>
        </template>
        <template v-if="type==='JComboBox'">
          <select class="component jcombobox">
            <option>{{isEditable? component.value: 'JComboBox'}}</option>
          </select>
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
        <div style="position: absolute; top: 0; right: 0">
          <Badge v-if="showName" :value="component.name" severity="info" ></Badge>
        </div>
        <div @click="handleClick" style="cursor: pointer; position: absolute; left: 0; right: 0; top: 0; bottom: 0"></div>
      </div>
      <Button icon="pi pi-trash" @click="clickRemove($event)" v-show="selectedComponent===component"/>
    </div>
    <template v-else>
      <div>
        <template v-if="isUIClazz">
          <div class="ui-clazz-top" @click="handleClick">UI-Klasse {{component.name}}</div>
          <TextArea class="ui-clazz-variables" auto-resize style="width: 100%" v-model="component.variablesRaw" @change="$emit('recompile')"/>
          <div style="font-family: monospace; color: red">
            <div v-for="(e,i) in component.variablesErrors"><template v-if="e.line">Z{{ e.line.number }}: {{ e.message }}</template><template v-else>{{ e }}</template></div>
          </div>
        </template>
        <div v-else class="jpanel-color" :style="{display: 'flex'}">
          <span class="pi handle pi-arrows-alt"/><button @click="toggleHideContent()">{{hideContent? '+':'-'}}</button>
          <div v-if="type==='JPanel'" :style="{flex: 1}" style="position: relative" @click="handleClick" class="jpanel-top">JPanel
            <Badge v-if="showName" :value="component.name" severity="info" style="position: absolute; top: 0; right: 0"></Badge>
          </div>
          <div v-else-if="type==='UIClazz'" :style="{flex: 1}" style="position: relative" @click="handleClick" class="jpanel-top">{{component.componentName}}
            <Badge v-if="showName" :value="component.name" severity="info" style="position: absolute; top: 0; right: 0"></Badge>
          </div>
          <div v-else-if="type==='For'" :style="{flex: 1}" style="position: relative" @click="handleClick" class="jpanel-top">Wiederhole für <strong>{{component.controlComponent.variable}}</strong> = <strong>{{component.controlComponent.min}}</strong> bis <strong>{{component.controlComponent.max}}</strong>:
          </div>
          <div v-else-if="type==='If'" :style="{flex: 1}" style="position: relative" @click="handleClick" class="jpanel-top">Falls <strong>{{component.controlComponent.condition}}</strong>:
          </div>
          <div v-else-if="type==='ElseIf'" :style="{flex: 1}" style="position: relative" @click="handleClick" class="jpanel-top">Ansonsten falls <strong>{{component.controlComponent.condition}}</strong>:
          </div>
          <div v-else-if="type==='Else'" :style="{flex: 1}" style="position: relative" @click="handleClick" class="jpanel-top">Ansonsten:
          </div>
          <Button icon="pi pi-trash" @click="clickRemove($event)" v-show="selectedComponent===component"/>
        </div>
        <div v-show="!hideContent" style="width: 100%" :class="isUIClazz? 'ui-clazz-body':''" :style="{display: 'flex', 'flex-direction': 'row'}">
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
            :style="{flex: 1,'padding-bottom': (!$root.printMode && isUIClazz)? '100%':'2rem'}"
            @end="endDrag"
            @add="$emit('recompile')"
            @sort="$emit('recompile')"
          >
            <template #item="{element}">
              <div>
                <UIComponent @removethis="removeChildComponent(element)" @recompile="$emit('recompile')" @isolatedupdate="emitIsolatedUpdate()" :component="element" is-editable @clickcomponent="forwardClick" :selected-component="selectedComponent"/>
                <ConfirmPopup></ConfirmPopup>
              </div>
            </template>
          </draggable>
        </div>
        <div v-if="!isUIClazz" @click="handleClick" class="jpanel-bottom">&nbsp;</div>
      </div>
    </template>
    
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
        return this.type==="JPanel" || this.type==="UIClazz" || this.component instanceof UIClazz || this.component.controlComponent;
      },
      label(){
        if(this.isEditable && this.component.name){
          return this.component.name+" ["+this.component.type+"]";
        }else{
          return this.component.type;
        }
      }
    },
    data(){
      return {
        hideContent: false
      }
    },
    methods: {
      toggleHideContent(){
        this.hideContent=!this.hideContent;
      }, 
      removeChildComponent(comp){
        for(let i=0;i<this.component.components.length;i++){
          let c=this.component.components[i];
          if(c===comp){
            this.component.components.splice(i,1);
            return true;
          }
        }
        return false;
      },
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
      clickRemove(event) {
        this.$confirm.require({
          target: event.currentTarget,
          message: 'Diese UI-Komponente löschen?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.$emit("removethis");
            this.$emit('recompile');
          },
          reject: () => {
              //callback to execute when user rejects the action
          }
        });
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
    min-height: 1cm;
    max-height: 2cm;
    overflow: hidden;
  }
  .jimage{
    min-height: 1cm;
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
    color: black;
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
    height: 0.5cm;
  }
</style>