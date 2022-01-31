import { CompileFunctions } from "../CompileFunctions";

export function ArgumentList(node,source,scope,parameters){
  node=node.firstChild;
  let list=[];
  let code="(";
  let codeArgs=[];
  let i=0;
  let pcount=parameters? parameters.count:0;
  while(node.nextSibling && node.nextSibling.name!==")"){
    if(!parameters || i>=pcount){
      throw source.createError("Nur "+parameters.count+" Argumente erwartet. Zu viele Argumente!",node);
    }
    let p=parameters.parameters[i];
    
    node=node.nextSibling;
    if(node.name===","){
      if(node.nextSibling.type.isError){
        throw source.createError("Weiteres Argument erwartet.",node);
      }
      node=node.nextSibling;
    }
    let f=CompileFunctions.get(node,source);
    let arg=f(node,source,scope);
    if(arg.error){
      throw source.createError(arg.error,node);
    }
    p.type.autoCastValue(arg);
    if(!arg.type.isSubtypeOf(p.type)){
      throw source.createError( "Das "+(i+1)+"-te Argument '"+arg.code+"' ist kein "+p.type+".",node);
    }
    codeArgs.push(arg.code);
    list.push(arg);
    i++;
  }
  if(i<pcount){
    throw source.createError("Zu wenig Argumente! Es müssen "+pcount+" Argumente sein.",node);
  }
  code+=codeArgs.join(",");
  code+=")";
  return {
    list, code
  };
}