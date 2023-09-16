import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";
import { TypeName } from "./TypeName";

export function InstanceofExpression(node,source,scope){
  console.log("instanceof",node);
  node=node.firstChild;
  let f=CompileFunctions.get(node,source);
  let obj=f(node,source,scope);
  console.log(obj);
  return;
}