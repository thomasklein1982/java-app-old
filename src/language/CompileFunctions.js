import { MethodInvocation } from "./compile/MethodInvocation";
import { ExpressionStatement } from "./compile/ExpressionStatement";
import { StringLiteral } from "./compile/StringLiteral";
import { ArgumentList } from "./compile/ArgumentList";
import {Identifier} from "./compile/Identifier";

function doNothing(){}

export const CompileFunctions={
  get(node,source,errors){
    let compile=this.functions[node.name];
    if(!compile){
      errors.push(source.createError("Unbekanntes Sprachkonstrukt. Sorry, ich verstehe das (noch) nicht :(", node));
      return doNothing;
    }
    return compile;
  },
  functions: {
    MethodInvocation,ExpressionStatement,StringLiteral,ArgumentList,Identifier
  }
}