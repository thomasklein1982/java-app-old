import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function BinaryExpression(node,source,scope){
  let code;
  let type;
  node=node.firstChild;
  let left=node;
  let op=node.nextSibling;
  let right=op.nextSibling;
  left=CompileFunctions.get(left)(left,source,scope);
  if(op.name!=="ArithOp"){

  }
  op=source.getText(op);
  right=CompileFunctions.get(right)(right,source,scope);
  
  if(op==="+"){
    if(left.type.isNumeric && right.type.isNumeric){
      if(left.type.isSubtypeOf(right.type)){
        type=right.type;
      }else{
        type=left.type;
      }
    }else{
      type=Java.datatypes.String;
    }
    code=left.code+op+right.code;
  }else if(op==="*"||op==="-"||op==="/"||op==="%"){
    if(left.type.isNumeric && right.type.isNumeric){
      if(op==="/" && left.type===Java.datatypes.int && right.type===Java.datatypes.int){
        code="Math.floor("+left.code+op+right.code+")";
        type=left.type;
      }else{
        code=left.code+op+right.code;
        if(left.type.isSubtypeOf(right.type)){
          type=right.type;
        }else{
          type=left.type;
        }
      }
    }else{
      throw source.createError("Der Operator '"+op+"' funktioniert nur mit Zahlen.",node);
    }
  }else if(op==="&"||op==="&&"||op==="|"||op==="||"){
    if(left.type===Java.datatypes.boolean && right.type===Java.datatypes.boolean){
      code=left.code+op+right.code;
      type=left.type;
    }else{
      throw source.createError("Der Operator '"+op+"' funktioniert nur mit Wahrheitswerten (boolean).",node);
    }
  }
  return {
    code,type
  }
};