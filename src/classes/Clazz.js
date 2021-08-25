import { parseJava } from "../functions/parseJava";
import {Attribute} from "./Attribute"
import {Error} from "./Error"
import { Method } from "./Method";
import { Source } from "./Source";

export class Clazz{
  constructor(name){
    this.name=name;
    this.superClazz=null;
    this.errors=null;
    this.src="class "+this.name+"{\n  \n}";
    this.clazzBody=null;
    this.attributes={};
    this.methods=[];
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
    this.source=new Source(src,state);
  }

  /**
   * Kompiliert alle Methoden der Klasse
   * @param {Project} project 
   */
  compileMethods(node,source,project){
    let errors=[];
    for(let i=0;i<this.methods.length;i++){
      let m=this.methods[i];
      errors=errors.concat(m.compileBody(source,project));
    }
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
    var node=this.source.state.tree.topNode.firstChild;
    if(node.type.name!=="ClassDeclaration"){
      errors.push(this.source.createError("Du musst mit der Deklaration einer Klasse beginnen.",node));
    }else{
      node=node.firstChild;
      while(node.nextSibling && node.name!=="Definition"){
        node=node.nextSibling;
      }
      this.name=this.source.getText(node);
      node=node.nextSibling;
      if(node.name!=="ClassBody"){
        errors.push(this.source.createError("'{' erwartet",node));
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
    let errors=this.errors;
    var node=this.clazzBody;
    if(!node) return;
    /**Klassenkoerper parsen: */
    node=node.firstChild.nextSibling;
    while(node.nextSibling){
      if(node.name==="FieldDeclaration"){
        var a=new Attribute();
        errors=errors.concat(a.compile(node,this.source));
        let attr=a.getSingleAttributes();
        for(var i=0;i<attr.length;i++){
          let sa=attr[i];
          if(this.attributes[sa.name]){
            errors.push(this.source.createError("Es gibt bereits ein Attribut namens '"+sa.name+"'.",node));
          }else{
            this.attributes[sa.name]=sa;
          }
        }
      }else if(node.name==='MethodDeclaration'){
        let m=new Method(this);
        errors=errors.concat(m.compileDeclaration(node,this.source));
        this.methods.push(m);
      }else{
        errors.push(this.source.createError("Attributs- oder Methodendeklaration erwartet.",node));
      }
      node=node.nextSibling;
    }
    if(node.type.isError || !node.name==="}"){
      errors.push(this.source.createError("Hier fehlt eine '}'",node));
    }
    node=node.parent;
    while(node){
      if(node.nextSibling){
        errors.push(this.source.createError("Nach Abschluss der Klasse darf kein weiterer Code folgen",node.nextSibling));
        break;
      }
      node=node.parent;
    }
    this.errors=errors;
    return errors;
  }
}