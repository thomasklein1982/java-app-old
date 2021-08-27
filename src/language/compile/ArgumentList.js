import { CompileFunctions } from "../CompileFunctions";

export function ArgumentList(node,source,scope,errors){
  node=node.firstChild;
  let list=[];
  while(node.nextSibling && node.nextSibling.name!==")"){
    node=node.nextSibling;
    let f=CompileFunctions.get(node,source,errors);
    let arg=f(node,source,scope,errors);
    list.push(arg);
  }
  return list;
}