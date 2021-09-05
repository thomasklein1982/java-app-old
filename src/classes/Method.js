import { Block } from "../language/compile/Block";
import { Modifiers } from "./Modifiers";
import { ParameterList } from "./Parameters";
import { Scope } from "./Scope";
import { Type } from "./Type";

export class Method{
  constructor(clazz){
    this.clazz=clazz;
    this.name=null;
    this.params=null;
    this.type=null;
    this.modifiers=null;
    this.body=null;
    this.errors=[];
  }
  define(name,isStatic,data){
    this.name=name;
    this.type=data.type;
    this.params=new ParameterList(this);
    this.params.define(data.params);
    this.modifiers=new Modifiers();
    this.modifiers.isStatic=isStatic;
    this.body=null;
  }
  isStatic(){
    return (!this.modifiers || this.modifiers.isStatic);
  }
  getSignatureString(){
    var t=this.name+"(";
    if(this.params){
      t+=this.params.toString();
    }
    t+=")";
    if(this.type){
      t+=" : "+this.type.toString();
    }
    return t;
  }

  compileDeclaration(node,source){
    let errors=[];
    node=node.firstChild;
    var m=new Modifiers();
    this.modifiers=m;
    if(node.name==="Modifiers"){
      errors=errors.concat(m.compile(node,source));
      node=node.nextSibling;
    }
    if(node.name.indexOf("Type")>=0){
      this.type=Type.compile(node,source,this.clazz.project,errors);
    }else if(node.name==='void'){
      this.type=null;
    }
    if(this.type && !this.type.baseType){
      return errors;
    }
    node=node.nextSibling;
    
    if(node.name==='Definition'){
      this.name=source.getText(node);
    }else{
      errors.push(source.createError("Name erwartet",node));
      return errors;
    }
    node=node.nextSibling;

    if(node.name==='FormalParameters'){
      let list=new ParameterList(this);
      errors=errors.concat(list.compile(node,source));
      this.params=list;
    }

    if(node){
      if(node.type.isError){
        errors.push(source.createError("'}' erwartet",node));
      }
    }
    node=node.nextSibling;
    if(!node || node.name!=="Block"){
      errors.push(source.createError("'{' erwartet.",node));
    }else{
      this.bodyNode=node;
    }
    return errors;
  }

  compileBody(source){
    let errors=[];
    if(!this.bodyNode){
      return {
        errors,
        code: ''
      }
    }
    let scope=new Scope(this.clazz.project,this);
    this.block=Block(this.bodyNode,source,scope);
    return this.block;
  }
}