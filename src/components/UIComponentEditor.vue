<template>
  <div style="width: 100%; height: 100%; overflow: auto">
    <table style="width: 100%">
      <tr>
        <td>Name:</td>
        <td><InputText v-model="component.name" @change="emitRecompile()" style="width: 95%" v-tooltip.focus.bottom="'Unter diesem Namen kann die Komponente im Programmcode verwendet werden.'"/></td>
      </tr>
      <tr v-if="component.options!==undefined">
        <td>Optionen:</td>
        <td><InputText @change="emitUpdate()" v-model="component.options" style="width: 95%" v-tooltip.focus.bottom="'Die Optionen, die in dieser ComboBox angezeigt werden. Mit Komma getrennt.'"/></td>
      </tr>
      <tr v-if="component.inputType!==undefined">
        <td>Eingabetyp:</td>
        <td><InputText @change="emitUpdate()" v-model="component.inputType" style="width: 95%" v-tooltip.focus.bottom="'Legt fest, welcher Datentyp eingegeben werden kann. Möglich sind \'text\', \'number\' und viele andere.'"/></td>
      </tr>
      <tr v-if="type && type.labels.value!==undefined">
        <td>Wert:</td>
        <td><InputText @change="emitUpdate()" v-model="component.value" style="width: 95%" v-tooltip.focus.bottom="type.labels.value"/></td>
      </tr>
      <tr v-if="component.placeholder!==undefined">
        <td>Platzhalter:</td>
        <td><InputText @change="emitUpdate()" v-model="component.placeholder" style="width: 95%" v-tooltip.focus.bottom="'Platzhalter-Text, der angezeigt wird, wenn nichts eingeben wurde.'"/></td>
      </tr>
      <template v-if="component.template!==undefined">
        <tr>
          <td rowSpan="2">Template:</td>
          <td><InputText @change="emitUpdate()" v-model="component.template" style="width: 95%" v-tooltip.focus.bottom="'Legt das Layout fest. Klicke den Button für mehr Informationen.'"/></td>
        </tr>
        <tr><td><Button icon="pi pi-pencil" label="Bearbeiten" @click="$refs.templateDialog.setVisible(true,component.template)"/></td></tr>
      </template>
      <tr>
        <td>CSS-Klasse:</td>
        <td><InputText @change="emitUpdate()" v-model="component.cssClass" style="width: 95%"/></td>
      </tr>
      <tr>
        <td>Absolute Position:</td>
        <td><InputSwitch @change="emitUpdate()" v-model="component.forceAbsolute"/></td>
      </tr>
      <tr>
        <td>x:</td>
        <td><InputText @change="emitUpdate()" v-model="component.x" style="width: 95%"/></td>
      </tr>
      <tr>
        <td>y:</td>
        <td><InputText @change="emitUpdate()" v-model="component.y" style="width: 95%"/></td>
      </tr>
      <tr>
        <td>Breite:</td>
        <td><InputText @change="emitUpdate()" v-model="component.width" style="width: 95%"/></td>
      </tr>
      <tr>
        <td>Höhe:</td>
        <td><InputText @change="emitUpdate()" v-model="component.height" style="width: 95%"/></td>
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
