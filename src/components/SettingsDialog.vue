<template>
  <Dialog header="Einstellungen" v-model:visible="show"  :maximizable="true" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
    <Button label="Neu starten" @click="restart()"/>
    <div style="padding: 0.2rem" :style="{display: 'flex', 'justify-content': 'center', 'align-items':'center'}">
      <Button icon="pi pi-minus" @click="changeFontSize(-1)"/>
      <span style="padding: 0.2rem">{{myFontSize}}px</span>
      <Button icon="pi pi-plus" @click="changeFontSize(1)"/>
    </div>
  </Dialog>
</template>

<script>
export default {
  props: {
    fontSize: Number
  },
  computed: {
    
  },
  data(){
    return {
      show: false,
      myFontSize: this.fontSize
    };
  },
  methods: {
    changeFontSize(ds){
      this.myFontSize+=ds;
      this.$emit("changefontsize",this.myFontSize);
    },
    setVisible(v){
      this.show=v;
    },
    confirm(){
      this.show=false;
      this.$emit("confirm",this.template);
    },
    restart(){
      location.reload();
    }
  }
}
</script>