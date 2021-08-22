import { Clazz } from "./Clazz";

export class Project{
  constructor(){
    this.clazzes=[];
    var c=new Clazz("App");
    c.src="class App{\n\n  public static void main(String[] args){\n    new App();\n  }\n}";
    this.clazzes.push(c);
  }
  async initialize(){
    var c=this.clazzes[0];
    await c.generateTreeAndState(c.src);
    c.compileDeclaration();
    c.compileMemberDeclarations();
  }
  deleteClazzes(){
    while(this.clazzes.length>0) this.clazzes.pop();
  }
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
      clazzesSourceCode: t
    });
  }
  async fromSaveString(saveString){
    var o=JSON.parse(saveString);
    this.deleteClazzes();
    for(var i=0;i<o.clazzesSourceCode.length;i++){
      var src=o.clazzesSourceCode[i];
      var c=new Clazz();
      await c.generateTreeAndState(src);
      c.compileDeclaration();
      c.compileMemberDeclarations();
      this.clazzes.push(c);
    }
  }
}