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

  compile(node,source){
    let errors=[];
    node=node.firstChild;
    node=node.nextSibling;
    while(node.name==="FormalParameter"){
      let p=new Parameter();
      p.compile(node,source);
      this.parameters.push(p);
      node=node.nextSibling;
      if(node.name!==","){

      }else{
        node=node.nextSibling;
      }
    }
    if(node.type.isError || node.name!==")"){
      errors.push(source.createError("')' erwartet",node));
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

  compile(node,source){
    let errors=[];
    
    node=node.firstChild;
    if(node.name.indexOf("Type")>=0){
      var t=new Type;
      errors=errors.concat(t.compile(node,source));
      this.type=t;
    }else{

    }
    node=node.nextSibling;
    if(node.name==='Definition'){
      this.name=source.getText(node);
    }else{
      errors.push(source.createError("Parametername erwartet",node));
    }
    return errors;
  }
}