import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Dimension } from "./Dimension";
import { TypeName } from "./TypeName";

export function ArrayCreationExpression(node,source,scope,errors){
  node=node.firstChild;
  let code;
  if(node.name!=="new"){

  }
  code="new $App.Array(";
  node=node.nextSibling;
  if(node.name!=="TypeName"){

  }
  let type=TypeName(node,source,scope);
  code+=JSON.stringify(type.code)+",[";
  node=node.nextSibling;
  let dimensions=[];
  while(node && node.name==="Dimension"){
    let dim=Dimension(node,source,scope);
    dimensions.push(dim.code);
    node=node.nextSibling;
  }
  
  code+=dimensions.join(",");
  code+="])";
  return {
    code,
    type: new Type(type.type,dimensions.length)
  }
}