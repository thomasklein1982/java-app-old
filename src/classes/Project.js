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
  getClazzNyName(name){
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      if(c.name===name){
        return c;
      }
    }
  }
  /**Kompiliert das gesamte Projekt */
  async compile(fromSource){
    /**
     * 1. Alle Klassendeklarationen parsen
     * 2. Alle Memberdeklarationen parsen
     * 3. Alle Methoden parsen
     */
    /**Klassen-Deklarationen: */
    let toCompile=[];
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      if(fromSource){
        await c.generateTreeAndState(c.src);
      }
      toCompile.push(c);
    }
    while(toCompile.length>0){
      let c=toCompile.pop();
      c.compileDeclaration();
      if(c.superClazz){
        /**ist die Oberklasse schon deklariert? wenn nein, wieder in die queue! */
        if(toCompile.length>0 && !this.getClazzNyName(c.superClazz)){
          toCompile.splice(0,0,c);
        }
      }
    }

    /**Member-Deklarationen: */
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      c.compileMemberDeclarations();
    }
  }
  deleteClazzes(){
    while(this.clazzes.length>0) this.clazzes.pop();
  }
  addClazz(c){
    this.clazzes.push(c);
  }
  deleteClazz(c){
    let index=this.clazzes.indexOf(c);
    if(index<=0) return false;
    this.clazzes.splice(index,1);
    return true;
  }
  getName(){
    return this.clazzes[0].name;
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
      c.src=src;
      this.clazzes.push(c);
    }
    await this.compile(true);
  }
}