import { Error } from "../../classes/Error";
import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { ArgumentList } from "./ArgumentList";
import { FieldAccess } from "./FieldAccess";
import { Identifier } from "./Identifier";
import { Clazz } from "../../classes/Clazz";
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
  if(node.name!=="MethodName"){
    if(node.name==="Identifier"){
      let id=Identifier(node,source,scope);
      code=id.code;
      if(id.object instanceof Clazz){
        owner={
          clazz: id.object,
          static: true
        };
      }else{
        owner={
          clazz: id.object.type,
          static: false
        };
      }
    }else if(node.name==="FieldAccess"){
      let fa=FieldAccess(node,source,scope);
      code=fa.code;
      owner={
        clazz: fa.object.type,
        static: false
      };
    }
    node=node.nextSibling;
    if(node.name==="."){
      code+=".";
    }else{
      throw (source.createError(null,node));
    }
    node=node.nextSibling;
  }
  if(node.name==="MethodName"){
    mn=source.getText(node);
    code+=mn;
    node=node.nextSibling;
  }
  if(node.name!=="ArgumentList"){
  }
  al=ArgumentList(node,source,scope);
  code+=al.code;
  let method=scope.getMethod(mn,al.list,owner.static,owner.clazz);
  if(method.error){
    throw (source.createError(method.error,node));
  }
  return {
    method,arguments: al, code, type: method.type
  }
}