import { Java } from "../language/java.js";
import { Clazz } from "./Clazz";

export class Project{
  constructor(){
    this.clazzes=[];
    var c=new Clazz("NameDerApp",this);
    c.src="class NameDerApp{\n\n  public static void main(String[] args){\n    new NameDerApp();\n  }\n}";
    this.clazzes.push(c);
  }
  getJavaScriptCode(){
    let code="";
    let mainClazz=null;
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      if(!mainClazz && c.hasStaticMainMethod()){
        mainClazz=c;
      }
      code+="\n"+c.getJavaScriptCode();
    }
    code+="\nfunction onStart(){"+mainClazz.name+".main([])}";
    return code;
  }
  async initialize(){
    var c=this.clazzes[0];
    await c.generateTreeAndState(c.src);
    c.compileDeclaration();
    c.compileMemberDeclarations();
  }
  getClazzByName(name){
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      if(c.name===name){
        return c;
      }
    }
    return null;
  }
  getTypeByName(name){
    let t=Java.datatypes[name];
    if(t) return t;
    return this.getClazzByName(name);
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
      c.compileMemberDeclarations(this);
    }

    /**Methoden: */
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      c.compileMethods(this);
    }
  }
  deleteClazzes(){
    while(this.clazzes.length>0) this.clazzes.pop();
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
      var c=new Clazz(null,this);
      c.src=src;
      this.clazzes.push(c);
    }
    await this.compile(true);
  }
}