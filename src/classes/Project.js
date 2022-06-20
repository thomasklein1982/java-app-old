import { Java } from "../language/java.js";
import { Clazz } from "./Clazz";
import {database} from "./Database";

let start="Project Code Start";
let stop="Project Code Stop";

export class Project{
  constructor(name,code){
    this.clazzes=[];
    if(!name){
      name="MyApp";
      code="class MyApp{\n  \n  void onStart(){\n    \n  }\n\n  public static void main(String[] args){\n    new MyApp();\n  }\n}";
    }
    var c=new Clazz(name,this);
    c.src=code;
    this.clazzes.push(c);
  }
  // let code="\<script\>window.language='java';"+window.appJScode+" "+window.additionalJSCode;
  //       code+='\n\</script\>\n\<script\>'+src+'\n\</script\>';
  getFullAppCode(additionalCode, includeSave){
    let databaseCode="";
    let cmds=database.createInMemory(true);
    if(cmds && cmds.length>1){
      databaseCode+=alasql_code+"\nalasql_code();alasql.options.casesensitive=false;\n";
      databaseCode+="$clearAlaSQL();\ntry{";
      for(var i=0;i<cmds.length;i++){
        databaseCode+="alasql("+JSON.stringify(cmds[i])+");\n";
      }
      databaseCode+="}catch(e){console.log('** Datenbank-Fehler: **');console.log(e);console.log('**************')}\n";
    }
    
    let js=this.getJavaScriptCode();
    let body="";
    if(includeSave){
      let save=this.toSaveString();
      body=`<textarea style="display: none">${save}</textarea>`;
    }
    let code=`<!doctype html>
<html>
    <head>
      <meta charset="utf-8">
      <script>
        window.language="java";
        ${window.appJScode}
        ${includeSave? 'console.hide()':''}
        ${window.additionalJSCode}
        ${additionalCode}
        ${databaseCode}
        ${js}
      </script>
    </head>
    <body>
      ${body}
    </body>
</html>`;
    return code;
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
    if(mainClazz){
      code+="\nasync function onStart(){if($main.onStart){$main.onStart();}}\n\n(async function(){await "+mainClazz.name+".main([]);})()";
    }
    return code;
  }
  async initialize(){
    var c=this.clazzes[0];
    await c.generateTreeAndState(c.src);
    c.compileDeclaration();
    c.compileMemberDeclarations();
  }
  getClazzByName(name){
    let i=this.getClazzIndexByName(name);
    if(i>=0){
      return this.clazzes[i];
    }else{
      return null;
    }
  }
  getClazzIndexByName(name){
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      if(c.name===name){
        return i;
      }
    }
    return -1;
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
    let start=new Date();
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
    let end=new Date();
    console.log("parsing done in "+(end-start)+"ms");
  }
  deleteClazzes(){
    while(this.clazzes.length>0) this.clazzes.pop();
  }
  removeClazz(c){
    let index=this.clazzes.indexOf(c);
    if(index<=0) return false;
    this.clazzes.splice(index,1);
    return true;
  }
  async addClazz(c){
    await c.compile(true);
    this.clazzes.push(c);
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
    let db=database.toCSVString();
    return start+JSON.stringify({
      clazzesSourceCode: t,
      database: db
    })+stop;
  }
  async fromSaveString(appcode){
    var pos=appcode.indexOf(start);
    let saveString;
    if(pos<0){
      saveString=appcode;
    }else{
      var pos2=appcode.indexOf(stop,pos);
      if(pos2<0) return null;
      saveString=appcode.substring(pos+start.length,pos2);
    }
    try{
      var o=JSON.parse(saveString);
      if(o.database){
        database.fromCSVString(o.database);
      }
    }catch(e){
      return;
    }
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