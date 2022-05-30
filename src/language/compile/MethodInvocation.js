import { Error } from "../../classes/Error";
import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { ArgumentList } from "./ArgumentList";
import { FieldAccess } from "./FieldAccess";
import { Identifier } from "./Identifier";
import { Clazz } from "../../classes/Clazz";
import { Java } from "../java";
import { Type } from "../../classes/Type";
/**
 * 
 * @param {*} node 
 * @param {Source} source 
 * @param {Scope} scope 
 */
export function MethodInvocation(node,source,scope){
  node=node.firstChild;
  
  let mn,al,methods;
  let code="";
  let owner={
    clazz: null,
    static: false
  };
  if(node.name==="MethodName"){
    code+="this";
  }else{
    if(node.name==="Identifier"){
      let id=Identifier(node,source,scope);
      code+=id.code;
      if(id.object instanceof Clazz){
        owner={
          clazz: id.object,
          static: true
        };
      }else{
        owner={
          clazz: id.object.type.baseType,
          static: false
        };
      }
    }else if(node.name==="FieldAccess"){
      let fa=FieldAccess(node,source,scope);
      code+=fa.code;
      owner={
        clazz: fa.type.baseType,
        static: false
      };
    }
    node=node.nextSibling;
    if(node.name==="."){
    }else{
      throw (source.createError(null,node));
    }
    node=node.nextSibling;
  }
  if(node.name!=="MethodName"){
  }
  mn=source.getText(node);
  let method=scope.getMethod(mn,owner.static,owner.clazz);
  if(method.isExtraFunction){
    
  }else{ 
    code+=".";
    if(method.jsName){
      code+=method.jsName;
    }else{
      code+=mn;
    }
  }
  node=node.nextSibling;
  if(method.error){
    throw (source.createError(method.error,node));
  }
  if(node.name!=="ArgumentList"){
  }
  al=ArgumentList(node,source,scope,method.params);
  if(method.isExtraFunction){
    code=method.jsName+"("+code+","+al.code.substring(1);
  }else{
    code+=al.code;
  }
  code="await "+code;
  return {
    method,arguments: al, code, type: method.type? method.type: null
  }
}