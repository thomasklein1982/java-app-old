import { Modifiers } from "./Modifiers";
import { ParameterList } from "./Parameters";
import { Type } from "./Type";

export class Method{
  constructor(){
    this.name=null;
    this.params=null;
    this.type=null;
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

  fromCodeTree(src,node,state){
    var errors=[];
    node=node.firstChild;
    var m=new Modifiers();
    this.modifiers=m;
    if(node.name==="Modifiers"){
      errors=errors.concat(m.fromCodeTree(src,node,state));
      node=node.nextSibling;
    }
    if(node.name.indexOf("Type")>=0){
      var t=new Type();
      errors=errors.concat(t.fromCodeTree(src,node,state));
      this.type=t;
    }else if(node.name==='void'){
      this.type=null;
    }
    node=node.nextSibling;
    
    if(node.name==='Definition'){
      this.name=src.substring(node.from,node.to);
    }else{
      errors.push(new Error("Name erwartet",node,state));
    }
    node=node.nextSibling;

    if(node.name==='FormalParameters'){
      let list=new ParameterList();
      errors=errors.concat(list.fromCodeTree(src,node,state));
      this.params=list;
    }

    if(node){
      if(node.type.isError){
        errors.push(new Error("'}' erwartet",node,state));
      }
    }
    return errors;
  }
}