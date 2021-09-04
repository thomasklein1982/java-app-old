import { Java } from "../language/java";
import { Attribute } from "./Attribute";

export class Scope{
  constructor(project,method){
    this.project=project;
    this.method=method;
    this.stack=[];
    this.indent="    ";
  }

  /**Liefert die lokale Variable zu diesem Namen zurueck, falls vorhanden */
  getLocalVariable(name){
    let searching=true;
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
   * @returns {Attribute} Das Attribut 
   */
  getAttribute(name,static){
    let c=this.method.clazz;
    let a=c.getAttribute(name,static);
    if(a.error){
      return null;
    }else{
      return a;
    }
  }
  
  getClazzByName(name){
    let c=this.project.getClazzByName(name);
    if(!c){
      c=Java.datatypes[name];
    }
    return c;
  }

}