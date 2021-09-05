import { parseJava } from "../functions/parseJava";
import {Attribute} from "./Attribute"
import { Method } from "./Method";
import { Source } from "./Source";

export class Clazz{
  constructor(name,project){
    this.name=name;
    this.cannotBeInstantiated=false;
    this.description="";
    this.project=project;
    this.superClazz=null;
    this.errors=null;
    this.src="class "+this.name+"{\n  \n}";
    this.clazzBody=null;
    this.attributes={};
    this.methods={};
  }

  getJavaScriptCode(){
    let code="class "+this.name;
    if(this.superClazz){
      code+=" extends "+this.superClazz.name;
    }
    code+="{";
    code+="\nconstructor(){";
    for(let i in this.attributes){
      let a=this.attributes[i];
      code+="\n"+a.getJavaScriptCode();
    }
    code+="\n}";
    code+="\n}";
    return code;
  }

  /**
   * 
   * @param {String} name 
   * @param {Boolean} staticAccess 
   * @returns 
   */
   getAttribute(name,staticAccess){
    let a=this.attributes[name];
    if(!a && this.superClazz){
      a=this.superClazz.getAttribute(name,staticAccess);
      if(a && a.error){
        a=null;
      }
    }
    if(!a){
      return {
        error: "Die Klasse '"+this.name+"' hat kein "+(staticAccess? "statisches ":"")+"Attribut namens '"+name+"'."
      };
    }
    if(staticAccess){
      if(a.isStatic && a.isStatic() || a.static){
        return a;
      }else{
        return {
          error: "Das Attribut '"+name+"' ist nicht statisch."
        };
      }
    }else{
      if(a.isStatic && a.isStatic() || a.static){
        return {
          error: "Das Attribut '"+name+"' ist statisch. Verwende '"+this.name+"."+name+"' um darauf zuzugreifen."
        };
      }else{
        return a;
      }
    }
  }

  getMethods(name,staticAccess){
    let m=this.methods[name];
    if(!m && this.superClazz){
      m=this.superClazz.getMethods(name,staticAccess);
      if(m && m.error){
        m=null;
      }
    }
    if(!m){
      return {
        error: "Die Klasse '"+this.name+"' hat keine "+(staticAccess? "statische ":"")+"Methode namens '"+name+"'."
      };
    }
    if(staticAccess){
      if(m.isStatic && m.isStatic() || m.static){
        return m;
      }else{
        return {
          error: "Die Methode '"+name+"' ist nicht statisch."
        };
      }
    }else{
      if(m.isStatic && m.isStatic() || m.static){
        return {
          error: "Die Methode '"+name+"' ist statisch. Verwende '"+this.name+"."+name+"(...)' um darauf zuzugreifen."
        };
      }else{
        return m;
      }
    }
  }

  define(superClazz,description,members,cannotBeInstantiated){
    this.cannotBeInstantiated=cannotBeInstantiated===true;
    this.superClazz=superClazz;
    this.description=description;
    if(members.a){
      this.attributes=members.a;
      for(var i in this.attributes){
        this.attributes[i].name=i;
      }
    }
    if(members.c){
      this.constructors=members.c;
    }
    if(members.m){
      this.methods=members.m;
    }
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
    this.methods={};
    this.source=new Source(src,state);
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
        var a=new Attribute(this);
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
        if(!this.methods[m.name]){
          this.methods[m.name]=[];
        }
        this.methods[m.name].push(m);
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

  /**
   * Kompiliert alle Methoden der Klasse
   */
   compileMethods(){
    let errors=[];
    for(let mi in this.methods){
      let ms=this.methods[mi];
      for(let i=0;i<ms.length;i++){
        let m=ms[i];
        errors=errors.concat(m.compileBody(this.source).errors);
      }
    }
    
    this.errors=this.errors.concat(errors);
    return errors;
  }
}