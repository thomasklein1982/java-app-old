import { Type } from "../../classes/Type";
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
    if(left.type.isSubtypeOf(Java.datatypes.boolean) && right.type.isSubtypeOf(Java.datatypes.boolean)){
      code=left.code+op+right.code;
      type=new Type(Java.datatypes.boolean,0);
    }else{
      throw source.createError("Der Operator '"+op+"' funktioniert nur mit Wahrheitswerten (boolean).",node);
    }
  }else if(op==="=="){
    if(!left.type.isSubtypeOf(right.type) && !right.type.isSubtypeOf(left.type)){
      throw source.createError("Die Datentypen '"+left.type+"' und '"+right.type+"' sind nicht kompatibel.",node);
    }
    code=left.code+"==="+right.code;
    type=new Type(Java.datatypes.boolean,0);
  }else if(op==="<" || op==="<=" ||op===">" ||op===">="){
    if(left.type.isNumericOrString() && right.type.isNumericOrString()){
      code=left.code+op+right.code;
      type=new Type(Java.datatypes.boolean,0);
    }else{
      throw source.createError("Der Operator '"+op+"' funktioniert nur mit Zahlen oder Strings.",node);
    }
  }
  return {
    code,type
  }
};