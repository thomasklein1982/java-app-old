import {Type} from "./Type"
import {Modifiers} from "./Modifiers"
import {Error} from "./Error"

export class Attribute{
  constructor(clazz){
    this.clazz=clazz;
    this.type=null;
    this.name=null;
    this.modifiers=null;
  }

  getSignatureString(){
    return this.name+" : "+this.type.toString();
  }

  getSingleAttributes(){
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

  compile(node,source){
    var errors=[];
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
    var names=[];
    while(true){
      if(node.name==="VariableDeclarator"){
        var name=source.getText(node);
        names.push(name);
        node=node.nextSibling;
        if(node.name===","){
          this.multiple=true;
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
    this.name=names;
    return errors;
  }
}