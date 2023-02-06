<template>
  <Dialog header="Template-Editor" v-model:visible="show"  :maximizable="true" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
    <SelectButton @change="selectExample()" :options="examples" optionLabel="name" v-model="selectedExample"/>
    <InputText v-model="template" style="width: 95%"/>
    <p v-if="interpretation.error" style="color: red">{{interpretation.text}}</p>
    <template v-else>
      <p v-for="(t,i) in interpretation.text">{{t}}</p>
    </template>
    <div :style="interpretation.style" style="width: 5cm; height: 5cm">
      <div v-for="i in interpretation.compCount" style="border: 1pt dotted white">&nbsp;</div>
    </div>
    <div style="text-align: right">
      <Button @click="confirm()" label="OK"/>
      <Button @click="show=false" class="p-button-secondary" label="Abbrechen"/>
    </div>
  </Dialog>
</template>

<script>
export default {
  computed: {
    interpretation(){
      let teile;
      let template=this.template.trim();
      let style={};
      if(template.length===0){
        return {
          text: ["Alle Komponenten werden absolut positioniert, d.h., nach ihren x- und y-Koordinaten mit der angegebenen Breite und Höhe."],
          template: "",
          error: false,
          style
        };
      }else{
        teile=template.split("/");
        if(teile.length>2){
          return {
            text: "Der Template-String darf höchstens 1 '/' enthalten.",
            error: true,
            style
          }
        }
      }
      let text,compCount=1;
      if(teile.length===2){
        text=["Zeilen","Spalten"];
      }else{
        text=["Spalten","Zeilen"];
      } 
      for(let i=0;i<2;i++){
        let t=i<teile.length? teile[i].trim(): null;
        let c=1;
        if(!t){
          text[i]="beliebig viele gleiche "+text[i];
          c=2;
        }else if(/^\d+$/.test(t)){
          teile[i]="repeat("+t+",minmax(0,1fr))";
          text[i]=t+" gleiche "+text[i];
          c=t*1;
        }else{
          let entries=t.split(" ");
          c=0;
          for(let j=0;j<entries.length;j++){
            let e=entries[j];
            if(e){
              c++;
            }
          }
          text[i]=text[i] + " nach dem Schema "+JSON.stringify(t);
        }
        compCount*=c;
      }
      if(teile.length===2){
        style.gridTemplateRows=teile[0];
        style.gridTemplateColumns=teile[1];
      }else{
        style.gridTemplateColumns=teile[0];
      }
      style.gridAutoRows="minmax(0,1fr)";
      style.display="grid"; 
      style.alignItems="stretch";
      style.justifyContent="stretch";
      return {
        text: text,
        error: false,
        style,
        compCount
      };
    }
  },
  data(){
    return {
      show: false,
      template: "",
      selectedExample: null,
      examples: [
        {
          name: "absolut",
          template: ""
        },
        {
          name: "1-spaltig",
          template: "1"
        },
        {
          name: "2-spaltig",
          template: "2"
        },
        {
          name: "3-spaltig",
          template: "3"
        },
        {
          name: "4 x 2",
          template: "auto 1fr 1cm auto / 1fr 2fr"
        },
      ]
    };
  },
  methods: {
    selectExample(){
      if(this.selectedExample){
        this.template=this.selectedExample.template;
      }
    },
    setVisible(v,template){
      this.show=v;
      this.template=template;
    },
    confirm(){
      this.show=false;
      this.$emit("confirm",this.template);
    },
    getCSSStyle(template){
      var style={
      };
      template=template.trim();
      if(!template){
        return style;
      }
        
    }
  }
}
</script>