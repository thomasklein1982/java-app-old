import { createParamsString } from "../functions/snippets";
import { Block } from "../language/compile/Block";
import { Modifiers } from "./Modifiers";
import { ParameterList } from "./Parameters";
import { Scope } from "./Scope";
import { Type } from "./Type";

export class Method{
  constructor(clazz,isConstructor){
    this.isConstructor=isConstructor;
    this.clazz=clazz;
    this.name=null;
    this.params=null;
    this.type=null;
    this.modifiers=null;
    this.bodyNode=null;
    this.block=null;
    this.errors=[];
    this.comment=null;
    this.typeAnnotations={};
    this.jsName=null;
  }
  createParamsString(){
    
  }
  getJavaScriptCode(){
    let code;
    if(this.isConstructor){
      code="async $constructor";
    }else{
      code=this.modifiers.getJavaScriptCode()+" async "+this.name;
    }
    code+=this.params.getJavaScriptCode()+"{";
    if(this.block){
      code+="\n"+this.block.code;
    }
    code+="\nreturn this;\n}";
    return code;
  }
  isStatic(){
    return (!this.modifiers || this.modifiers.isStatic);
  }
  matchesArgumentList(argumentList){
    return this.params.matchesArgumentList(argumentList);
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
    if(!this.isConstructor){
      if(node.name.indexOf("Type")>=0){
        this.type=Type.compile(node,source,this.clazz.project,errors);
      }else if(node.name==='void'){
        this.type=null;
      }
      if(this.type && !this.type.baseType){
        return errors;
      }
      node=node.nextSibling;
    }
    if(node.name==='Definition'){
      this.name=source.getText(node);
      if(this.isConstructor && this.name!==this.clazz.name){
        errors.push(source.createError("Der Konstruktor muss genauso heißen wie die Klasse.",node));  
      }
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
    if(!node || node.name!=="Block" && node.name!=="ConstructorBody"){
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
    this.typeAnnotations=scope.typeAnnotations;
    return this.block;
  }
}