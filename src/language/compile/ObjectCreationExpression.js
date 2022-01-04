import { CompileFunctions } from "../CompileFunctions";
import { ArgumentList } from "./ArgumentList";
import { TypeName } from "./TypeName";

/**
 * 
 * @param {*} node 
 * @param {Source} source 
 * @param {Scope} scope 
 */
export function ObjectCreationExpression(node,source,scope){
  let code;
  node=node.firstChild;
  if(node.name==='new'){
    code="new ";
  }
  node=node.nextSibling;
  if(node.name!=='TypeName'){

  }
  
  let typename=TypeName(node,source,scope);
  code+=typename.code;
  node=node.nextSibling;
  if(node.name!=='ArgumentList'){
    
  }
  let al=ArgumentList(node,source,scope);
  code+=al.code;
  return {
    code,
    clazz: typename.type,
    type: typename.type
  };
  // let method=scope.getMethod(mn,al.list,owner.static,owner.clazz);
  // if(method.error){
  //   throw (source.createError(method.error,node));
  // }
  // return {
  //   method,arguments: al, code
  // }
}