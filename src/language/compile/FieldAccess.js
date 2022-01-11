import { Clazz } from "../../classes/Clazz";
import { Error } from "../../classes/Error";
import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
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
        clazz: ident.type,
        static: false
      };
    }
  }
  if(node.name==="."){
    code+=".";
    node=node.nextSibling;
  }else{
    throw (source.createError(null,node));
  }
  if(node.name==="Identifier"){
    let object=Identifier(node,source,scope,owner);
    code+=object.code;
    return {
      code,object: object.object
    };
  }
}