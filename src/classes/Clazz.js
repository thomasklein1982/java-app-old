import { parseJava } from "../functions/parseJava";
import { Java } from "../language/java";
import {Attribute} from "./Attribute"
import { Method } from "./Method";
import { Scope } from "./Scope";
import { Source } from "./Source";
import { Type } from "./Type";
import { UIClazz } from "./UIClazz";

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
    this.constructor=null;
    this.node=null;
    this.references=[];
    this._isBuiltIn=project===undefined;
  }
  isNative(){
    return this.project===undefined;
  }
  getJavaScriptCode(){
    let code="class "+this.name;
    if(this.superClazz){
      code+=" extends "+this.superClazz.name;
    }
    code+="{";
    code+="\nconstructor(){";
    if(this.superClazz){
      code+="super();";
    }
    if(this.hasStaticMainMethod()){
      code+="if(!window.$main){window.$main=this;}";
    }
    let attributesInitCode="";
    for(let i in this.attributes){
      let a=this.attributes[i];
      code+="\n"+a.getJavaScriptCode();
      if(a.initialValue){
        attributesInitCode+="\nthis."+a.name+"="+a.initialValue+";";
      }
    }
    code+="\n}";
    if(this.constructor){
      let c=this.constructor;
      code+="\n"+c.getJavaScriptCode(attributesInitCode+"\n");
    }else{
      code+="\nasync $constructor(){\n"+attributesInitCode+"\nreturn this;}";
    }
    for(let i in this.methods){
      let m=this.methods[i];
      code+="\n"+m.getJavaScriptCode();
    }
    code+="\n}";
    return code;
  }

  getAllAttributeNames(names){
    if(!names) names={};
    for(let a in this.attributes){
      names[this.attributes[a].name]=true;
    }
    if(this.superClazz){
      return this.superClazz.getAllAttributeNames(names);
    }
    return names;
  }

  getAllDynamicAttributeNamesAndTypes(names){
    if(!names) names={};
    for(let a in this.attributes){
      let at=this.attributes[a];
      if(at.isStatic()) continue;
      names[at.name]={
        baseType: at.type.baseType.name,
        dimension: at.type.dimension
      };
    }
    if(this.superClazz){
      return this.superClazz.getAllAttributeNames(names);
    }
    return names;
  }

  getRealSuperClazz(){
    if(this.superClazz){
      return this.superClazz;
    }
    /**einfaches ==, weil der Proxy dazwischenfunkt */
    let c=this;
    if(c.name===Java.clazzes.Object.name){
      return null;
    }else{
      return Java.clazzes.Object;
    }
  }

  /**
   * 
   * @param {String} name 
   * @param {Boolean} staticAccess 
   * @returns 
   */
   getAttribute(name,staticAccess){
    let a=this.attributes[name];
    if(!a){
      let sc=this.getRealSuperClazz();
      if(sc){
        a=sc.getAttribute(name,staticAccess);
        if(a && a.error){
          a=null;
        }
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

  hasStaticMainMethod(){
    let m=this.methods['main'];
    if(!m) return false;
    if(m.isStatic && m.isStatic()){
      return true;
    }else{
      return false;
    }
  }

  getMethod(name,staticAccess){
    let m=this.methods[name];
    if(!m){
      let sc=this.getRealSuperClazz();
      if(sc){
        m=sc.getMethod(name,staticAccess);
        if(m && m.error){
          m=null;
        }
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

  isSubtypeOf(type){
    if(!type || type.name === Java.datatypes.Object.name) return true;

    if(type instanceof Type){
      if(type.dimension===0){
        type=type.baseType;
      }else{
        return false;
      }
    }
    if(type instanceof Clazz || type instanceof UIClazz){
      if(type.name==="Object" || this.name===type.name){
        return true;
      }
      return (this.superClazz && this.superClazz.isSubtypeOf(type));
    }
    return false;
  }

  getRuntimeInfos(){
    let superClazz=this.getRealSuperClazz();
    let infos={
      attributes: this.getAllDynamicAttributeNamesAndTypes(),
      name: this.name,
      superClazzName: superClazz? superClazz.name : null
    };
    return infos;
  }

  isBuiltIn(){
    return this._isBuiltIn;
  }

  toString(){
    return this.name;
  }

  generateSrcAndTree(src){
    var tree=parseJava(src);
    this.setSrcAndTree(src,tree);
  }

  setSrcAndTree(src,tree){
    this.src=src;
    this.name=null;
    this.superClazz=null;
    this.attributes={};
    this.constructor=null;
    this.methods={};
    this.source=new Source(src,tree);
  }

  compile(fromSource,optimizeCompiler){
    if(fromSource){
      this.generateSrcAndTree(this.src);
    }
    this.compileDeclaration();
    this.compileMemberDeclarations();
    this.compileMethods(optimizeCompiler);
  }

  isUIClazz(){
    return false;
  }

  compileDeclaration(){
    var errors=[];
    this.errors=errors;
    var node=this.source.tree.topNode.firstChild;
    if(node.type.name!=="ClassDeclaration"){
      errors.push(this.source.createError("Du musst mit der Deklaration einer Klasse beginnen.",node));
    }else{
      node=node.firstChild;
      while(node.nextSibling && node.name!=="Definition"){
        node=node.nextSibling;
      }
      this.name=this.source.getText(node);
      this.node=node;
      node=node.nextSibling;
      if(node.name==="Superclass"){
        let subnode=node.firstChild;
        if(subnode.name!=="extends"){
          errors.push(this.source.createError("'extends' erwartet",node));
        }else{
          subnode=subnode.nextSibling;
          this.superClazz=this.source.getText(subnode);
        }
        node=node.nextSibling;
      }
      if(node.name!=="ClassBody"){
        errors.push(this.source.createError("'{' erwartet",node));
      }else{
        this.clazzBody=node;
      }
    }
    return errors;
  }

  resolveSuperClazz(project){
    if(this.superClazz){
      let c=project.getClazzByName(this.superClazz);
      if(c){
        this.superClazz=c;
      }
    }
  }

  compileMethodDeclarations(){
    this.methods={};
    this.constructor=null;
    let errors=this.errors;
    var node=this.clazzBody;
    if(!node) return;
    /**Klassenkoerper parsen: */
    let scope=new Scope(this.project);
    node=node.firstChild.nextSibling;
    while(node.nextSibling){
      if(node.name==="FieldDeclaration"){
      }else if(node.name==='MethodDeclaration'){
        let m=new Method(this,false);
        errors=errors.concat(m.compileDeclaration(node,this.source));
        if(m.name){
          if(this.methods[m.name]){
            errors.push(this.source.createError("Es gibt bereits eine Methode namens '"+m.name+"'.",m.node));
          }else if(this.attributes[m.name]){
            errors.push(this.source.createError("Es gibt bereits ein Attribut namens '"+m.name+"'.",m.node));
          }else{
            this.methods[m.name]=m;
          }
        }
      }else if(node.name=="ConstructorDeclaration"){
        if(this.constructor){
          errors.push(this.source.createError("Eine Klasse kann höchstens einen Konstruktor besitzen.",node));
        }else{
          let c=new Method(this,true);
          errors=errors.concat(c.compileDeclaration(node,this.source));
          this.constructor=c;
        }
      }else if(node.name!=="LineComment"){
        errors.push(this.source.createError("Attributs- oder Methoden- oder Konstruktordeklaration erwartet.",node));
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

  compileAttributeDeclarations(){
    this.attributes={};
    var node=this.clazzBody;
    if(!node) return;
    /**Klassenkoerper parsen: */
    let scope=new Scope(this.project);
    node=node.firstChild.nextSibling;
    while(node.nextSibling){
      if(node.name==="FieldDeclaration"){
        var a=new Attribute(this);
        this.errors=this.errors.concat(a.compile(node,this.source,scope));
        let attr=a.getSingleAttributes();
        for(var i=0;i<attr.length;i++){
          let sa=attr[i];
          if(sa.name){
            if(this.attributes[sa.name]){
              this.errors.push(this.source.createError("Es gibt bereits ein Attribut namens '"+sa.name+"'.",sa.node));
            }else if(this.methods[sa.name]){
              this.errors.push(this.source.createError("Es gibt bereits eine Methode namens '"+sa.name+"'.",sa.node));
            }else{
              this.attributes[sa.name]=sa;
            }
          }
        }
      }
      node=node.nextSibling;
    }
    return this.errors;
  }

  /**
   * Kompiliert alle Member-Deklarationen
   */
  compileMemberDeclarations(){
    this.attributes={};
    this.methods={};
    this.constructor=null;
    let errors=this.errors;
    var node=this.clazzBody;
    if(!node) return;
    /**Klassenkoerper parsen: */
    let scope=new Scope(this.project);
    node=node.firstChild.nextSibling;
    while(node.nextSibling){
      if(node.name==="FieldDeclaration"){
        var a=new Attribute(this);
        errors=errors.concat(a.compile(node,this.source,scope));
        let attr=a.getSingleAttributes();
        for(var i=0;i<attr.length;i++){
          let sa=attr[i];
          if(sa.name){
            if(this.attributes[sa.name]){
              errors.push(this.source.createError("Es gibt bereits ein Attribut namens '"+sa.name+"'.",sa.node));
            }else if(this.methods[sa.name]){
              errors.push(this.source.createError("Es gibt bereits eine Methode namens '"+sa.name+"'.",sa.node));
            }else{
              this.attributes[sa.name]=sa;
            }
          }
        }
      }else if(node.name==='MethodDeclaration'){
        let m=new Method(this,false);
        errors=errors.concat(m.compileDeclaration(node,this.source));
        if(m.name){
          if(this.methods[m.name]){
            errors.push(this.source.createError("Es gibt bereits eine Methode namens '"+m.name+"'.",m.node));
          }else if(this.attributes[m.name]){
            errors.push(this.source.createError("Es gibt bereits ein Attribut namens '"+m.name+"'.",m.node));
          }else{
            this.methods[m.name]=m;
          }
        }
      }else if(node.name=="ConstructorDeclaration"){
        if(this.constructor){
          errors.push(this.source.createError("Eine Klasse kann höchstens einen Konstruktor besitzen.",node));
        }else{
          let c=new Method(this,true);
          errors=errors.concat(c.compileDeclaration(node,this.source));
          this.constructor=c;
        }
      }else if(node.name!=="LineComment"){
        errors.push(this.source.createError("Attributs- oder Methoden- oder Konstruktordeklaration erwartet.",node));
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

  getConstructorParameters(){
    return this.constructor? this.constructor.params: null;
  }

  /**
   * Kompiliert alle Methoden (inklusive Konstruktoren) der Klasse
   */
  compileMethods(optimizeCompiler){
    for(let mi in this.methods){
      let m=this.methods[mi];
      m.compileBody(this.source,optimizeCompiler);
    }
    if(this.constructor){
      let c=this.constructor;
      c.compileBody(this.source,optimizeCompiler);
    }
  }
}