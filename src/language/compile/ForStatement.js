import { CompileFunctions } from "../CompileFunctions";
import { Block } from "./Block";

export function ForStatement(node,source,scope){
  let code="for(";
  node=node.firstChild;
  node=node.nextSibling;
  console.log(node);
  code+="let i=0;i<10;i++";
  code+=")";
  let block=node.nextSibling;
  block=Block(block,source,scope);
  code+=block.code;
  return {
    code: code,
    type: null
  }
}