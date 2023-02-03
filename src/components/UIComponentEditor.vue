<template>
  <div style="width: 100%; height: 100%; overflow: auto">
    <table style="width: 100%">
      <tr>
        <td>Name:</td>
        <td><InputText spellcheck="false" v-model="component.name" @change="emitRecompile()" style="width: 95%"/></td>
      </tr>
      <tr v-if="component.options!==undefined">
        <td>Optionen:</td>
        <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.options" style="width: 95%"/></td>
      </tr>
      <tr v-if="component.label!==undefined">
        <td>Text:</td>
        <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.label" style="width: 95%"/></td>
      </tr>
      <tr v-if="component.inputType!==undefined">
        <td>Eingabetyp:</td>
        <td><Dropdown @change="emitUpdate()" :options="['text','number']" v-model="component.inputType" style="width: 95%"/></td>
      </tr>
      <tr v-if="type && type.labels && type.labels.value!==undefined">
        <td>Wert:</td>
        <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.value" style="width: 95%"/></td>
      </tr>
      <tr v-if="component.placeholder!==undefined">
        <td>Platzhalter:</td>
        <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.placeholder" style="width: 95%"/></td>
      </tr>
      <template v-if="component.template!==undefined">
        <tr>
          <td rowSpan="2">Template:</td>
          <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.template" style="width: 95%" /></td>
        </tr>
        <tr><td><Button icon="pi pi-pencil" label="Bearbeiten" @click="$refs.templateDialog.setVisible(true,component.template)"/></td></tr>
      </template>
      <tr>
        <td>CSS-Klasse:</td>
        <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.cssClass" style="width: 95%"/></td>
      </tr>
      <tr>
        <td>Absolute Position:</td>
        <td><InputSwitch @change="emitUpdate()" v-model="component.forceAbsolute"/></td>
      </tr>
      <tr>
        <td>x:</td>
        <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.x" style="width: 95%"/></td>
      </tr>
      <tr>
        <td>y:</td>
        <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.y" style="width: 95%"/></td>
      </tr>
      <tr>
        <td>Breite:</td>
        <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.width" style="width: 95%"/></td>
      </tr>
      <tr>
        <td>Höhe:</td>
        <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.height" style="width: 95%"/></td>
      </tr>
    </table>
  </div>
  <TemplateDialog ref="templateDialog" @confirm="applyTemplate"/>
</template>

<script>
import { UIClazz } from '../classes/UIClazz';
import TemplateDialog from './TemplateDialog.vue';

  let timer;
  let oldName=null;
  export default{
    props: {
      component: Object
    },
    computed: {
      type(){
        return UIClazz.UIClazzes[this.component.type];
      }
    },
    methods: {
      applyTemplate(template){
        this.component.template=template;
        this.emitUpdate();
      },
      emitRecompile(){
        console.log("ui comp editor emit recompile");
        this.$emit("recompile");  
      },
      emitUpdate(){
        console.log("ui comp editor emit update");
        this.$emit("update");  
      }
    },
    emits: ["update","recompile"],
    components: {
      TemplateDialog
    }
  }
</script>
