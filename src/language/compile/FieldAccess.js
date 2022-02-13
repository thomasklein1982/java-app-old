import { Clazz } from "../../classes/Clazz";
import { Error } from "../../classes/Error";
import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { CompileFunctions } from "../CompileFunctions";
import { ArrayAccess } from "./ArrayAccess";
import { Identifier } from "./Identifier";
import { ThisExpression } from "./ThisExpression";

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
      type: fa.type,
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
      type: fa.type,
      static: false
    };
  }else if(node.name==="this"){
    let This=ThisExpression(node,source,scope);
    code+=This.code;
    node=node.nextSibling;
    owner={
      type: This.type,
      static: false
    };
  }else if(node.name==="Identifier"){
    let ident=Identifier(node,source,scope);
    code+=ident.code;
    node=node.nextSibling;
    if(ident.object instanceof Clazz){
      owner={
        type: ident.object,
        static: true
      };
    }else{
      owner={
        type: ident.type,
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