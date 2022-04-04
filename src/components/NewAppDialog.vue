<template>
  <Dialog header="Neue App" v-model:visible="show"  :maximizable="true" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
    <div style="margin-top: 0.5rem;">
      Name der neuen App:
      <InputText placeholdertext="Name der neuen App" v-model="name"/>
      <small v-if="nameerror" style="display: block; color: red">{{nameerror}}</small>
    </div>
    <div style="margin-top: 0.5rem">Wähle eine Vorlage für die neue App:</div>
    <Listbox optionLabel="name" :options="templates" v-model="template"/>
    <small style="display: block">{{template? template.description: 'Keine Vorlage ausgewählt'}}</small>
    <div style="text-align: right">
      <Button :disabled="nameerror || !template" @click="clickOK()" label="OK"/> <Button @click="show=false" label="Abbrechen"/>
    </div>
  </Dialog>
</template>

<script>
export default {
  computed: {
    nameerror(){
      if(this.name.length===0){
        return "Der Name muss aus mindestens einem Zeichen bestehen.";
      }
      if(/\W/g.test(this.name)){
        return "Der Name darf nur aus Buchstaben, Ziffern und dem Unterstrich bestehen.";
      }
      if(!/[A-Za-z]/.test(this.name.charAt(0))){
        return "Der Name muss mit einem Buchstaben beginnen.";
      }
      return null;
    }
  },
  data(){
    return {
      show: false,
      name: "MyApp",
      template: null,
      templates: [
        {
          name: "Leere App",
          description: "Eine normale, leere App. Bereit zu coden!",
          code: "class NAME{\n  \n  void onStart(){\n    \n  }\n\n  public static void main(String[] args){\n    new NAME();\n  }\n}"
        },
        {
          name: "Spiel mit Gamepad-Steuerung",
          description: "Eine App, die bereits den nötigen Code enthält, um ein Spiel mit Gamepad-Steuerung zu programmieren.",
          code: "class NAME{\n  int x, y;\n  \n  void onStart(){\n    App.gamepad.show();\n    x = 50;\n    y = 50;\n  }\n\n  void onNextFrame(){\n    App.clear();\n    if( App.gamepad.left ){\n      x = x - 1;\n    }\n    if( App.gamepad.right ){\n      x = x + 1;\n    }\n    if( App.gamepad.up ){\n      y = y + 1;\n    }\n    if( App.gamepad.down ){\n      y = y - 1;\n    }\n    App.setMirrored( true );\n    App.write(\"🐝\",x,y,\"center\");\n    App.setMirrored( true );\n  }\n  \n  public static void main(String[] args){\n     App.setupApp(\"NAME\",\"🐝\",100,100,\"lime\");\n    new NAME();\n  }\n}"
        },
      ]
    };
  },
  mounted(){
    this.template=this.templates[0];
  },
  methods: {
    clickOK(){
      if(this.nameerror || !this.template){
        return;
      }
      console.log(this.template);
      let name=this.name;
      let c=name.charAt(0).toUpperCase();
      name=c+name.substring(1);
      let code=this.template.code.replace(/NAME/g,name);
      this.$emit("newapp",name,code);
      this.setVisible(false);
    },
    setVisible(v){
      this.show=v;
    }
  }
}
</script>