import { CompileFunctions } from "../CompileFunctions";

export function Dimension(node,source,scope){
  node=node.firstChild;
  if(node.name!=="["){

  }
  let code="";
  node=node.nextSibling;
  let f=CompileFunctions.get(node,source);
  let val=f(node,source,scope);
  code+=val.code;
  return {
    code: code,
    type: val.type
  }
}