import { CompileFunctions } from "../CompileFunctions";

export function ExpressionStatement(node,source,scope,errors){
  node=node.firstChild;
  if(node.nextSibling.type.isError || node.nextSibling.name!==";"){
    errors.push(source.createError("';' erwartet.",node));
  }
  let f=CompileFunctions.get(node,source,errors);
  return f(node,source,scope,errors);
}