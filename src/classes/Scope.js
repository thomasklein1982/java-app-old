import { Java } from "../language/java";
import { Attribute } from "./Attribute";
import { Clazz } from "./Clazz";

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
    if(a.isStatic && a.isStatic()||a.static){
      if(!isStatic){
        return {
          error: "Das Attribut '"+name+"' ist statisch. Schreibe stattdessen '"+c.name+"."+name+"'."
        };  
      }
    }else{
      if(this.method.isStatic()){
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
  getMethod(name,argumentList,isStatic,clazz){
    let c=clazz? clazz : this.method.clazz;
    let m=c.getMethod(name,isStatic);
    if(m.error){
      return m;
    }
    if(m.isStatic && m.isStatic() || m.static){
      if(!isStatic){
        return {
          error: "Die Methode '"+name+"' ist statisch. Schreibe stattdessen '"+c.name+"."+name+"(...)'."
        };  
      }
    }
    if(m.matchesArgumentList(argumentList)){
      return m;
    }
    return {
      error: "Die Argumente stimmen nicht"
    };
  }

  getClazzByName(name){
    let c=this.project.getClazzByName(name);
    if(!c){
      c=Java.datatypes[name];
    }
    return c;
  }

}