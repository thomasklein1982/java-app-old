import { Attribute } from "./Attribute";
import { Clazz } from "./Clazz";
import { Java } from "../language/java";
import { PrimitiveType } from "./PrimitiveType";

export class Scope{
  constructor(project,method,endPosition){
    this.project=project;
    this.method=method;
    this.endPosition=endPosition;
    this.stack=[];
    this.typeAnnotations={};
    this.pushLayer();
    this.pushParameterList(method.params);
  }

  isNodeBeyondEndPosition(node){
    return (this.endPosition!==undefined && node.from>this.endPosition);
  }

  addTypeAnnotation(node,type,isStatic){
    this.typeAnnotations[node.to]={
      type,isStatic
    };
    
  }

  pushLayer(){
    this.stack.push({});
  }

  popLayer(){
    this.stack.pop();
  }

  pushParameterList(plist){
    for(let i=0;i<plist.parameters.length;i++){
      let p=plist.parameters[i];
      this.pushLocalVariable(p.name,p.type);
    }
  }

  
  pushLocalVariable(name,type){
    if(this.getLocalVariable(name)){
      throw "Es gibt bereits eine lokale Variable namens '"+name+"'.";
    }
    let c=this.getClazzByName(name);
    if(c){
      throw "Eine Variable darf nicht denselben Namen wie eine Klasse haben.";
    }
    let obj={
      name: name,
      type: type
    };
    let s=this.stack[this.stack.length-1];
    s[name]=obj;
  }

  getLocalVariableNames(){
    let obj={};
    for(let i=0;i<this.stack.length;i++){
      let s=this.stack[i];
      for(var a in s){
        obj[a]=true;
      }
    }
    return obj;
  }

  getLocalVariables(){
    let obj={};
    for(let i=0;i<this.stack.length;i++){
      let s=this.stack[i];
      for(var a in s){
        obj[a]=s[a];
      }
    }
    return obj;
  }


  /**Liefert die lokale Variable zu diesem Namen zurueck, falls vorhanden */
  getLocalVariable(name){
    let index=this.stack.length-1;
    /**Lokalen Stack durchsuchen: */
    while(index>=0){
      let s=this.stack[index];
      index--;
      let obj=s[name];
      if(obj){
        return obj;
      }
    }
    return null;
  }

  /**
   * Liefert das Attribut mit dem gegebenen Namen der aktuellen Klasse zurueck, falls dieses existiert 
   * @param {String} name 
   * @param {Boolean} isStatic 
   * @param {Clazz} clazz optional: die Klasse, zu der das Attribut gehoert
   * @returns 
   */
  getAttribute(name,isStatic,clazz){
    let c=clazz? clazz : this.method.clazz;

    let a=c.getAttribute(name,isStatic);
    if(a.error){
      return a;
    }
    if(a.isPrivate() && this.method.clazz.name!==c.name){
      return {
        error: "Das Attribut '"+name+"' ist private."
      };
    }
    if(a.isStatic()){
      if(!isStatic){
        return {
          error: "Das Attribut '"+name+"' ist statisch. Schreibe stattdessen '"+c.name+"."+name+"'."
        };  
      }
    }else{
      if(!clazz && !isStatic && this.method.isStatic()){
        return {
          error: "Innerhalb einer statischen Methode kannst du nicht auf das dynamische Attribut '"+name+"' zugreifen."
        };
      }
    }
    
    return a;
  }
  
  /**
   * 
   * @param {String} name 
   * @param {ArgumentList} parameterSignature
   * @param {Boolean} isStatic 
   * @param {Clazz} clazz 
   * @returns 
   */
  getMethod(name,isStatic,clazz){
    let c=clazz? clazz : this.method.clazz;
    console.log(c);
    if(c.name==="null"){
      return {
        error: "Das null-Objekt kann keine Methode aufrufen."
      };
    }
    let m=c.getMethod(name,isStatic);
    if(m.error){
      return m;
    }
    if(m.isPrivate() && this.method.clazz!==clazz){
      return {
        error: "Die Methode '"+name+"' ist private."
      };
    }
    if(m.isStatic && m.isStatic() || m.static){
      if(!isStatic){
        return {
          error: "Die Methode '"+name+"' ist statisch. Schreibe stattdessen '"+c.name+"."+name+"(...)'."
        };  
      }
    }
    return m;
  }

  getClazzByName(name){
    let c=this.project.getClazzByName(name);
    if(!c){
      return this.getPrimitiveTypeByName(name);
    }
    return c;
  }

  getPrimitiveTypeByName(name){
    let c=Java.datatypes[name];
    if(!c) return null;
    return c;
  }
}