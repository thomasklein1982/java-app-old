import { ArgumentList } from "./ArgumentList";
import { FieldAccess } from "./FieldAccess";

export function MethodInvocation(node,source,scope,errors){
  node=node.firstChild;
  
  let ob,mn,al,methods;
  console.log(node);
  if(node.name==="Identifier"){

  }else if(node.name==="FieldAccess"){
    let fa=FieldAccess(node,source,scope,errors);
  }
  if(node.name==="MethodName"){
    mn=source.getText(node);
    node=node.nextSibling;
  }
  if(!ob){
    let c=scope.method.clazz;
    methods=c.getMethods(mn,false);
    if(!methods){
      errors.push(source.createError("Die Klasse '"+c.name+"' hat keine Methode namens '"+mn+"'.",node));
    }
  }
  if(node.name==="ArgumentList"){
    al=ArgumentList(node,source,scope,errors);
  }
  
  console.log(mn,al);
}