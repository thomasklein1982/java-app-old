import {Type} from "./Type"
import {Modifiers} from "./Modifiers"
import {Error} from "./Error"

export class Attribute{
  constructor(){
    this.type=null;
    this.names=null;
    this.modifiers=null;
  }

  toString(){
    var t="Attribut(e) '"+this.names.join(",")+"' vom Typ "+this.type+" mit: "+this.modifiers;
    return t;
  }
  fromCodeTree(src,node,state){
    var errors=[];
    node=node.firstChild;
    if(node.name==="Modifiers"){
      var m=new Modifiers();
      errors=errors.concat(m.fromCodeTree(src,node,state));
      this.modifiers=m;
      node=node.nextSibling;
    }
    if(node.name.indexOf("Type")>=0){
      var t=new Type;
      errors=errors.concat(t.fromCodeTree(src,node,state));
      this.type=t;
      node=node.nextSibling;
    }
    /**beliebig viele Variablennamen, mit Komma getrennt */
    this.names=[];
    while(true){
      if(node.name==="VariableDeclarator"){
        var name=src.substring(node.from,node.to);
        this.names.push(name);
        node=node.nextSibling;
        if(node.name===","){
          node=node.nextSibling;
          if(node.isError){
            errors.push(new Error("Attributsname erwartet",node,state));
            break;
          }
        }else{
          break;
        }
      }else{
        errors.push(new Error("Attributsname erwartet",node,state));
        break;
      }
    }
    console.log("attribute");
    if(node){
      if(node.type.isError || node.name!==";"){
        errors.push(new Error("';' erwartet",node,state));
      }
    }
    return errors;
  }
}