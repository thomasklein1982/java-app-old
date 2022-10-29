<template>
  <div style="width: 100%; height: 100%; overflow: auto">
    <table style="width: 100%">
      <tr>
        <td>Name:</td>
        <td><InputText v-model="component.name" style="width: 95%"/></td>
      </tr>
      <tr v-if="component.inputType!==undefined">
        <td>Eingabetyp:</td>
        <td><InputText v-model="component.inputType" style="width: 95%"/></td>
      </tr>
      <tr v-if="component.value!==undefined">
        <td>Wert:</td>
        <td><InputText v-model="component.value" style="width: 95%"/></td>
      </tr>
      <tr v-if="component.placeholder!==undefined">
        <td>Platzhalter:</td>
        <td><InputText v-model="component.placeholder" style="width: 95%"/></td>
      </tr>
      <tr v-if="component.template!==undefined">
        <td>Template:</td>
        <td><InputText v-model="component.template" style="width: 95%"/></td>
      </tr>
      <tr>
        <td>CSS-Klasse:</td>
        <td><InputText v-model="component.cssClass" style="width: 95%"/></td>
      </tr>
      <tr>
        <td>x:</td>
        <td><InputText v-model="component.x" style="width: 95%"/></td>
      </tr>
      <tr>
        <td>y:</td>
        <td><InputText v-model="component.y" style="width: 95%"/></td>
      </tr>
      <tr>
        <td>Breite:</td>
        <td><InputText v-model="component.width" style="width: 95%"/></td>
      </tr>
      <tr>
        <td>Höhe:</td>
        <td><InputText v-model="component.height" style="width: 95%"/></td>
      </tr>
    </table>
  </div>
</template>

<script>
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
      
    },
    components: {
    }
  }
</script>
