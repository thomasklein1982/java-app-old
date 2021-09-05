import { MethodInvocation } from "./compile/MethodInvocation";
import { ExpressionStatement } from "./compile/ExpressionStatement";
import { StringLiteral } from "./compile/StringLiteral";
import { IntegerLiteral } from "./compile/IntegerLiteral";
import { BooleanLiteral } from "./compile/BooleanLiteral";
import { ArgumentList } from "./compile/ArgumentList";
import {Identifier} from "./compile/Identifier";
import { FieldAccess } from "./compile/FieldAccess";

function doNothing(){}

export const CompileFunctions={
  get(node,source){
    let compile=this.functions[node.name];
    if(!compile){
      throw source.createError("Unbekanntes Sprachkonstrukt. Sorry, ich verstehe das (noch) nicht :(", node);
    }
    return compile;
  },
  functions: {
    MethodInvocation,ExpressionStatement,StringLiteral,ArgumentList,Identifier,FieldAccess,IntegerLiteral, BooleanLiteral
  }
}