import {Type} from "./Type"
import {Modifiers} from "./Modifiers"
import {Error} from "./Error"
import { Clazz } from "./Clazz";
import { VariableDeclarator } from "../language/compile/VariableDeclarator";

export class Attribute{
  constructor(clazz){
    this.clazz=clazz;
    this.type=null;
    this.name=null;
    this.attributes=null;
    this.modifiers=null;
    this.node=null;
    this.initialValue=null;
  }

  isPrivate(){
    return (this.modifiers && this.modifiers.visibility==="private");
  }

  getJavaScriptCode(){
    let code="this."+this.name+"=";
    let v;
    if(this.type.baseType instanceof Clazz || this.type.dimension>0){
      v="null";
    }else{
      v=JSON.stringify(this.type.baseType.initialValue);
    }
    code+=v+";";
    return code;
  }
  
  isStatic(){
    return !this.modifiers || this.modifiers.isStatic;
  }

  getSignatureString(){
    return this.name+" : "+this.type.toString();
  }

  getSingleAttributes(){
    return this.attributes;
    let array=[];
    for(let i=0;i<this.name.length;i++){
      let n=this.name[i];
      let a=new Attribute(this.clazz);
      a.type=this.type;
      a.name=n;
      a.modifiers=this.modifiers;
      array.push(a);
    }
    return array;
  }

  compile(node,source,scope){
    if(!scope){
      console.error("compile attribute without scope");
    }
    var errors=[];
    this.node=node;
    node=node.firstChild;
    var m=new Modifiers();
    this.modifiers=m;
    if(node.name==="Modifiers"){
      errors=errors.concat(m.compile(node,source));
      node=node.nextSibling;
    }
    if(node.name.indexOf("Type")>=0){
      this.type=Type.compile(node,source,this.clazz.project,errors);
      node=node.nextSibling;
    }
    /**beliebig viele Variablennamen, mit Komma getrennt */
    this.attributes=[];
    while(true){
      if(node.name==="VariableDeclarator"){
        let vdekl=VariableDeclarator(node,source,scope,this.type);
        let a=new Attribute(this.clazz);
        a.type=this.type;
        a.name=vdekl.name;
        a.modifiers=this.modifiers;
        a.initialValue=vdekl.initialValue;
        a.node=node;
        this.attributes.push(a);
        node=node.nextSibling;
        if(node.name===","){
          node=node.nextSibling;
          if(node.isError){
            errors.push(source.createError("Attributsname erwartet",node));
            break;
          }
        }else{
          break;
        }
      }else{
        errors.push(source.createError("Attributsname erwartet",node));
        break;
      }
    }
    if(node){
      if(node.type.isError || node.name!==";"){
        errors.push(source.createError("';' erwartet",node));
      }
    }
    return errors;
  }
}