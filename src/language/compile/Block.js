import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { CompileFunctions } from "../CompileFunctions";

function createUpdateLocalVariablesCode(scope){
  let locals=scope.getLocalVariables();
  return "var $locals="+JSON.stringify(locals)+";for(var $a in $locals){eval('$locals[$a]='+$a)};$App.console.updateLocalVariables($locals);";
}


/**
 * 
 * @param {*} node 
 * @param {Source} source 
 * @param {Scope} scope 
 * @returns 
 */
export function Block(node,source,scope){
  let code="";
  let errors=scope.method.clazz.errors;
  node=node.firstChild;
  if(node.type.isError || node.name!=='{'){
    errors.push(source.createError("'{' erwartet.",node));
    return {
      code,errors
    }
  }
  code+=createUpdateLocalVariablesCode(scope);
  scope.pushLayer();
  let open=true;
  while(node.nextSibling){
    node=node.nextSibling;
    if(node.name==='}'){
      open=false;
    }else{
      try{
        let f=CompileFunctions.get(node,source);
        let res=f(node,source,scope);
        let line=source.state.doc.lineAt(node.from).number;
        code+="\nawait $App.debug.line("+line+","+JSON.stringify(scope.method.clazz.name)+");"+res.code;
        if(res.updateLocalVariablesAfter){
          let name=res.updateLocalVariablesAfter;
          code+="/*test*/;eval('$locals["+JSON.stringify(name)+"]="+name+"',$App.console.updateLocalVariables($locals));";
        }
      }catch(e){
        errors.push(e);
      }
    }
  }
  if(open){
    errors.push(source.createError("'}' erwartet.",node));
  }
  scope.popLayer();
  code+=createUpdateLocalVariablesCode(scope);
  return {
    code
  }
}