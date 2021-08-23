import { Error } from "./Error";
import { Type } from "./Type";

export class ParameterList{
  constructor(){
    this.parameters=[];
  }

  toString(){
    var t="";
    for(var i=0;i<this.parameters.length;i++){
      if(i>0) t+=", ";
      let p=this.parameters[i];
      t+=p.toString();
    }
    return t;
  }

  fromCodeTree(src,node,state){
    let errors=[];
    node=node.firstChild;
    node=node.nextSibling;
    while(node.name==="FormalParameter"){
      let p=new Parameter();
      p.fromCodeTree(src,node,state);
      this.parameters.push(p);
      node=node.nextSibling;
      if(node.name!==","){

      }else{
        node=node.nextSibling;
      }
    }
    if(node.type.isError || node.name!==")"){
      new Error("')' erwartet",node,state);
    }else{
      node=node.nextSibling;
    }
    console.log(this.parameters);
    return errors;
  }
}

export class Parameter{
  constructor(){
    this.type=null;
    this.name=null;
  }

  toString(){
    return this.type.toString()+" "+this.name;
  };

  fromCodeTree(src,node,state){
    let errors=[];
    
    node=node.firstChild;
    if(node.name.indexOf("Type")>=0){
      var t=new Type;
      errors=errors.concat(t.fromCodeTree(src,node,state));
      this.type=t;
    }else{

    }
    node=node.nextSibling;
    if(node.name==='Definition'){
      this.name=src.substring(node.from,node.to);
    }else{
      errors.push(new Error("Parametername erwartet",node,state));
    }
    window.node=node;
    return errors;
  }
}