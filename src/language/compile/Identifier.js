import { Java } from "../java";

export function Identifier(node,source,scope,errors,context){
  console.log(node);
  let name=source.getText(node);
  let obj;
  if(context && context.ownerClazz){
    obj=context.ownerClazz.getAttribute(context.static);
    if(!obj){
      errors.push(source.createError("Die Klasse "+context.ownerClazz.name+" hat kein "+(context.static? "statisches":"")+" Attribut ",node));
    }
  }else{
    obj=scope.getLocalVariable(name);
    if(!obj){
      obj=scope.getClazzByName(name);
    }
    if(!obj){
      errors.push(source.createError("'"+name+"' ist undefiniert",node));
    }
  }
  
  return {
    code: name,
    object: obj
  };
}