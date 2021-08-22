import { Clazz } from "./Clazz";

export class Project{
  constructor(name){
    this.clazzes=[];
    var c=new Clazz();
    c.src="class App{\n\n  public static void main(String[] args){\n    new App();\n  }\n}";
    c.name="App";
    this.clazzes.push(c);
    this.name=name;
  }
  async initialize(){
    var c=this.clazzes[0];
    await c.compileDefinitionFromSource(c.src);
  }
  deleteClazzes(){
    while(this.clazzes.length>0) this.clazzes.pop();
  }
  /*copyFrom(project){
    this.deleteClazzes();
    this.name=project.name;
    for(var i=0;i<project.clazzes.length;i++){
      this.clazzes.push(project.clazzes[i]);
    }
  }*/
  addClazz(c){
    this.clazzes.push(c);
  }
  toSaveString(){
    var t=[];
    for(var i=0;i<this.clazzes.length;i++){
      var c=this.clazzes[i];
      t.push(c.src);
    }
    return JSON.stringify({
      name: this.name,
      clazzesSourceCode: t
    });
  }
  async fromSaveString(saveString){
    var o=JSON.parse(saveString);
    this.name=o.name;
    this.deleteClazzes();
    for(var i=0;i<o.clazzesSourceCode.length;i++){
      var src=o.clazzesSourceCode[i];
      var c=new Clazz();
      await c.generateTreeAndState(src);
      c.compileDefinition();
      this.clazzes.push(c);
    }
  }
}