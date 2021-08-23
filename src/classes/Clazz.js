import { parseJava } from "../functions/parseJava";
import {Attribute} from "./Attribute"
import {Error} from "./Error"
import { Method } from "./Method";

export class Clazz{
  constructor(name){
    this.name=name;
    this.superClazz=null;
    this.errors=null;
    this.src="class "+this.name+"{\n  \n}";
    this.clazzBody=null;
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
    this.errors=this.errors.concat(errors);
    return errors;
  }

  async compileDefinitionFromSource(src){
    await this.generateTreeAndState(src);
    this.compileMemberDeclarations();
  }

  async compile(fromSource){
    if(fromSource){
      await this.generateTreeAndState(this.src);
    }
    this.compileDeclaration();
    this.compileMemberDeclarations();
    this.compileMethods();
  }

  compileDeclaration(){
    var errors=[];
    this.errors=errors;
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
      node=node.nextSibling;
      if(node.name!=="ClassBody"){
        errors.push(new Error("'{' erwartet",node,this.state));
      }else{
        this.clazzBody=node;
      }
    }
    return errors;
  }

  /**
   * Kompiliert alle Member-Deklarationen
   */
  compileMemberDeclarations(){
    this.attributes={};
    let src=this.src;
    let tree=this.tree;
    let state=this.state;
    let errors=this.errors;
    var node=this.clazzBody;
    if(!node) return;
    /**Klassenkoerper parsen: */
    node=node.firstChild.nextSibling;
    while(node.nextSibling){
      if(node.name==="FieldDeclaration"){
        var a=new Attribute();
        errors=errors.concat(a.fromCodeTree(src,node,state));
        let attr=a.getSingleAttributes();
        for(var i=0;i<attr.length;i++){
          let sa=attr[i];
          if(this.attributes[sa.name]){
            errors.push(new Error("Es gibt bereits ein Attribut namens '"+sa.name+"'.",node,state));
          }else{
            this.attributes[sa.name]=sa;
          }
        }
      }else if(node.name==='MethodDeclaration'){
        let m=new Method();
        errors=errors.concat(m.fromCodeTree(src,node,state));
        this.methods.push(m);
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
    this.errors=errors;
    return errors;
  }
}