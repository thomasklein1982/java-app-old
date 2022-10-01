import { CompileFunctions } from "../CompileFunctions";

export function ExpressionStatement(node,source,scope){
  node=node.firstChild;
  let f=CompileFunctions.get(node,source);
  let a=f(node,source,scope);
  if(node.nextSibling.type.isError || node.nextSibling.name!==";"){
    throw (source.createError("';' erwartet.",node));
  }
  a.code+=";";
  return a;
}