import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function ArrayAccess(node,source,scope){
  node=node.firstChild;
  let code="";
  let f=CompileFunctions.get(node,source);
  let object=f(node,source,scope);
  if(object.type.dimension===0){
    throw source.createError("Dieser Ausdruck ist kein Array.",node);
  }
  code+=object.code;
  let codeSet=code;
  node=node.nextSibling;
  if(node.name!=="["){

  }
  var indices=[];
  node=node.nextSibling;
  f=CompileFunctions.get(node,source);
  let index=f(node,source,scope);
  if(!index.type.isSubtypeOf(Java.datatypes.int)){
    throw source.createError("'int' erwartet, aber '"+index.type+"' gefunden.",node);
  }
  indices.push(index.code);
  code+=".get("+index.code+")";
  codeSet+=".checkBounds("+index.code+").set("+index.code+",";
  let type=new Type(object.type.baseType,object.type.dimension-indices.length)
  scope.addTypeAnnotation(node.to,type,false);
  return {
    code, codeSet,type: type
  }
}