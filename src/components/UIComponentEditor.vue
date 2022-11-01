<template>
  <div style="width: 100%; height: 100%; overflow: auto">
    <table style="width: 100%">
      <tr>
        <td>Name:</td>
        <td><InputText v-model="component.name" @change="emitRecompile()" style="width: 95%"/></td>
      </tr>
      <tr v-if="component.inputType!==undefined">
        <td>Eingabetyp:</td>
        <td><InputText @change="emitUpdate()" v-model="component.inputType" style="width: 95%"/></td>
      </tr>
      <tr v-if="component.value!==undefined">
        <td>Wert:</td>
        <td><InputText @change="emitUpdate()" v-model="component.value" style="width: 95%"/></td>
      </tr>
      <tr v-if="component.placeholder!==undefined">
        <td>Platzhalter:</td>
        <td><InputText @change="emitUpdate()" v-model="component.placeholder" style="width: 95%"/></td>
      </tr>
      <tr v-if="component.template!==undefined">
        <td>Template:</td>
        <td><InputText @change="emitUpdate()" v-model="component.template" style="width: 95%"/></td>
      </tr>
      <tr>
        <td>CSS-Klasse:</td>
        <td><InputText @change="emitUpdate()" v-model="component.cssClass" style="width: 95%"/></td>
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
</template>

<script>
  let timer;
  let oldName=null;
  export default{
    props: {
      component: Object
    },
    computed: {
      type(){
        return this.component.type;
      }
    },
    methods: {
      emitRecompile(){
        console.log("ui comp editor emit recompile");
        this.$emit("recompile");  
      },
      emitUpdate(){
        console.log("ui comp editor emit update");
        this.$emit("update");  
      }
    },
    components: {
    }
  }
</script>
