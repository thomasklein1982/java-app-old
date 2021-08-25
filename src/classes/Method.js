import { Block } from "./Block";
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
    this.body=null;
    this.errors=[];
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
      var t=new Type();
      errors=errors.concat(t.compile(node,source));
      this.type=t;
    }else if(node.name==='void'){
      this.type=null;
    }
    node=node.nextSibling;
    
    if(node.name==='Definition'){
      this.name=source.getText(node);
    }else{
      errors.push(source.createError("Name erwartet",node));
    }
    node=node.nextSibling;

    if(node.name==='FormalParameters'){
      let list=new ParameterList();
      errors=errors.concat(list.compile(node,source));
      this.params=list;
    }

    if(node){
      if(node.type.isError){
        errors.push(source.createError("'}' erwartet",node));
      }
    }
    node=node.nextSibling;
    this.bodyNode=node;
    return errors;
  }

  compileBody(source,project){
    let errors=[];
    this.body=new Block();
    let scope=new Scope(project,this);
    errors=errors.concat(this.body.compile(this.bodyNode,source,scope));
    this.errors=errors;
    return errors;
  }
}