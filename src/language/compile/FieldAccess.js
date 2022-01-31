import { Clazz } from "../../classes/Clazz";
import { Error } from "../../classes/Error";
import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { CompileFunctions } from "../CompileFunctions";
import { ArrayAccess } from "./ArrayAccess";
import { Identifier } from "./Identifier";

/**
 * 
 * @param {*} node 
 * @param {Source} source 
 * @param {Scope} scope 
 * @returns 
 */
export function FieldAccess(node,source,scope){
  node=node.firstChild;
  let code="";
  let owner;
  if(node.name==="FieldAccess"){
    let fa=FieldAccess(node,source,scope);
    node=node.nextSibling;
    code+=fa.code;
    owner={
      clazz: fa.object.type,
      static: false
    };
  }else if(node.name==="ArrayAccess"){
    let fa=ArrayAccess(node,source,scope);
    node=node.nextSibling;
    code+=fa.code;
    if(fa.type.dimension>0){
      throw source.createError("Ein Array hat keine Attribute.",node.node);
    }
    owner={
      clazz: fa.type.baseType,
      static: false
    };
  }else if(node.name==="Identifier"){
    let ident=Identifier(node,source,scope);
    code+=ident.code;
    node=node.nextSibling;
    if(ident.object instanceof Clazz){
      owner={
        clazz: ident.object,
        static: true
      };
    }else{
      owner={
        clazz: ident.type.baseType,
        static: false
      };
    }
  }
  let object=null;
  if(node.name==="."){
    code+=".";
    node=node.nextSibling;
    if(node.name==="Identifier"){
      object=Identifier(node,source,scope,owner);
      code+=object.code;
    }
  }else{
    let f=CompileFunctions.get(node,source);
    object=f(node,source,scope);
    code+=object.code;
    //throw (source.createError(null,node));
  }
  return {
    code,type: object.type
  };
}