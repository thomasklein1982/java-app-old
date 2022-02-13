import { CompileFunctions } from "../CompileFunctions";
import { Block } from "./Block";

export function ForStatement(node,source,scope){
  let code="for(";
  node=node.firstChild;
  node=node.nextSibling;
  console.log(node);
  let forSpec=node;
  node=node.firstChild;
  if(node.name!=="("){

  }
  node=node.nextSibling;
  let p1=CompileFunctions.get(node,source)(node,source,scope);
  code+=p1.code;
  node=node.nextSibling;
  if(node){
    let p2=CompileFunctions.get(node,source)(node,source,scope);
    code+=p2.code;
    node=node.nextSibling;
    node=node.nextSibling;
    let p3=CompileFunctions.get(node,source)(node,source,scope);
    code+=";"+p3.code;
  }
  code+=")";
  let block=forSpec.nextSibling;
  block=Block(block,source,scope);
  code+="{"+block.code+"}";
  return {
    code: code,
    type: null
  }
}