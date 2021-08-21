import { parseJava } from "../functions/parseJava";
import {Attribute} from "./Attribute"
import {Error} from "./Error"

export class Clazz{
  constructor(){
    
  }

  toString(){
    var t="Klasse '"+this.name+"'\n";
    t+="Attribute:";
    for(var a in this.attributes){
      var at=this.attributes[a];
      t+="\n\  "+at;
    }
    return t;
  }

  async generateTreeAndState(src){
    var viewUpdate=await parseJava(src);
    this.setSrcTreeAndState(src,viewUpdate.state);
  }

  setSrcTreeAndState(src,state){
    this.src=src;
    this.name=null;
    this.superClazz=null;
    this.attributes={};
    this.constructors=[];
    this.methods=[];
    this.state=state;
    this.tree=state.tree;
  }

  /**
   * Kompiliert alle Methoden der Klasse
   * @param {Project} project 
   */
  compileMethods(project){
    let errors=[];
    return errors;
  }

  async compileDefinitionFromSource(src){
    await this.generateTreeAndState(src);
    this.compileDefinition();
  }

  compile(){
    let errors=this.compileDefinition();
    errors=errors.concat(this.compileMethods());
    return errors;
  }

  /**
   * Kompiliert alle deklarativen Aspekte der Klasse, nicht aber die Methoden
   */
  compileDefinition(){
    var errors=[];
    let src=this.src;
    let state=this.state;
    let tree=this.tree;
    var node=this.tree.topNode.firstChild;
    if(node.type.name!=="ClassDeclaration"){
      errors.push(new Error("Du musst mit der Deklaration einer Klasse beginnen.",this.node,this.state));
    }else{
      node=node.firstChild;
      while(node.nextSibling && node.name!=="Definition"){
        node=node.nextSibling;
      }
      this.name=src.substring(node.from,node.to);
      while(node.nextSibling && node.name!=="ClassBody"){
        node=node.nextSibling;
      }
      if(node.name!=="ClassBody"){
        errors.push(new Error("'{' erwartet",this.node,this.state));
      }else{
        /**Klassenkoerper parsen: */
        node=node.firstChild.nextSibling;
        while(node.nextSibling){
          if(node.name==="FieldDeclaration"){
            var a=new Attribute();
            errors=errors.concat(a.fromCodeTree(src,node,state));
            if(this.attributes[a.name]){
              errors.push(new Error("Es gibt bereits ein Attribut namens '"+a.name+"'.",node,state));
            }else{
              this.attributes[a.name]=a;
            }
          }else{
            errors.push(new Error("Attributs- oder Methodendeklaration erwartet.",node,state));
          }
          node=node.nextSibling;
        }
        if(node.type.isError || !node.name==="}"){
          errors.push(new Error("Hier fehlt eine '}'",node,state));
        }
        node=node.parent;
        while(node){
          if(node.nextSibling){
            errors.push(new Error("Nach Abschluss der Klasse darf kein weiterer Code folgen",node.nextSibling,state));
            break;
          }
          node=node.parent;
        }
      }
      return errors;
    }
  }
}