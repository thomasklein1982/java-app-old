import { CompileFunctions } from "../CompileFunctions";

export function ArgumentList(node,source,scope,errors){
  node=node.firstChild;
  let list=[];
  let code="(";
  let codeArgs=[];
  while(node.nextSibling && node.nextSibling.name!==")"){
    node=node.nextSibling;
    if(node.name===","){
      if(node.nextSibling.type.isError){
        throw source.createError("Weiteres Argument erwartet.",node);
      }
      node=node.nextSibling;
    }
    let f=CompileFunctions.get(node,source);
    let arg=f(node,source,scope);
    if(arg.error){
      throw source.createError(arg.error,node);
    }
    codeArgs.push(arg.code);
    list.push(arg);
  }
  code+=codeArgs.join(",");
  code+=")";
  return {
    list, code
  };
}