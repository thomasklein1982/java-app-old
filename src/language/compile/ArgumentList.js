import { CompileFunctions } from "../CompileFunctions";

export function ArgumentList(node,source,scope,errors){
  node=node.firstChild;
  let list=[];
  let signature="";
  while(node.nextSibling && node.nextSibling.name!==")"){
    node=node.nextSibling;
    let f=CompileFunctions.get(node,source);
    let arg=f(node,source,scope);
    list.push(arg);
    signature+=arg.type.toString()+",";
  }
  return {
    list,
    signature
  };
}