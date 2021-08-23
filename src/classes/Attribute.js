import {Type} from "./Type"
import {Modifiers} from "./Modifiers"
import {Error} from "./Error"

export class Attribute{
  constructor(){
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
      let a=new Attribute();
      a.type=this.type;
      a.name=n;
      a.modifiers=this.modifiers;
      array.push(a);
    }
    return array;
  }

  toString(){
    var t="Attribut(e) '"+this.name+"' vom Typ "+this.type+" mit: "+this.modifiers;
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
      node=node.nextSibling;
    }
    /**beliebig viele Variablennamen, mit Komma getrennt */
    var names=[];
    while(true){
      if(node.name==="VariableDeclarator"){
        var name=src.substring(node.from,node.to);
        names.push(name);
        node=node.nextSibling;
        if(node.name===","){
          this.multiple=true;
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
    if(node){
      if(node.type.isError || node.name!==";"){
        errors.push(new Error("';' erwartet",node,state));
      }
    }
    this.name=names;
    return errors;
  }
}