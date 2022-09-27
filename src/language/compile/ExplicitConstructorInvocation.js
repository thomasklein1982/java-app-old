import { ArgumentList } from "./ArgumentList";

export function ExplicitConstructorInvocation(node,source,scope){
  console.log(node);
  node=node.firstChild;
  if(node.name!=="super"){
    throw source.createError("'super' erwartet",node);
  }
  node=node.nextSibling;
  let superclazz=scope.method.clazz.superClazz;
  if(!superclazz){
    throw source.createError("Diese Klasse hat keine Oberklasse, also kann auch nicht der Konstruktor der Oberklasse aufgerufen werden!",node);
  }
  let al=ArgumentList(node,source,scope,superclazz.getConstructorParameters());
  let code="";
  if(!superclazz.isNative()){
    code+="await $asyncFunctionCallVariableObject(this,new "+superclazz.name+"(),'$constructor',["+al.code.substring(1,al.code.length-1)+"])";
  }else{
    code+="super"+al.code+"";
  }
  return {
    code
  }
}