import { MethodInvocation } from "./compile/MethodInvocation";
import { ExpressionStatement } from "./compile/ExpressionStatement";
import { StringLiteral } from "./compile/StringLiteral";
import { IntegerLiteral } from "./compile/IntegerLiteral";
import { BooleanLiteral } from "./compile/BooleanLiteral";
import { ArgumentList } from "./compile/ArgumentList";
import {Identifier} from "./compile/Identifier";
import { FieldAccess } from "./compile/FieldAccess";
import { ObjectCreationExpression } from "./compile/ObjectCreationExpression";
import { TypeName } from "./compile/TypeName";
import { LocalVariableDeclaration } from "./compile/LocalVariableDeclaration";
import { PrimitiveType } from "./compile/PrimitiveType";
import { AssignmentExpression } from "./compile/AssignmentExpression";
import { VariableDeclarator } from "./compile/VariableDeclarator";
import { BinaryExpression } from "./compile/BinaryExpression";
import { ParenthesizedExpression } from "./compile/ParenthesizedExpression";

function doNothing(){}

export const CompileFunctions={
  get(node,source){
    let compile=this.functions[node.name];
    if(!compile){
      throw source.createError("Unbekanntes Sprachkonstrukt. Sorry, ich verstehe das (noch) nicht :( ["+node.name+"]", node);
    }
    return compile;
  },
  functions: {
    MethodInvocation,ExpressionStatement,StringLiteral,ArgumentList,Identifier,FieldAccess,IntegerLiteral, BooleanLiteral, ObjectCreationExpression, TypeName, LocalVariableDeclaration, PrimitiveType, AssignmentExpression, IntegerLiteral, VariableDeclarator, BinaryExpression, ParenthesizedExpression
  }
}