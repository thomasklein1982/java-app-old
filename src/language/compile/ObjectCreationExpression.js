import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { ArgumentList } from "./ArgumentList";
import { Identifier } from "./Identifier";
import { PrimitiveType } from "../../classes/PrimitiveType";
import { TypeName } from "./TypeName";
import { GenericType } from "./GenericType";

/**
 * 
 * @param {*} node 
 * @param {Source} source 
 * @param {Scope} scope 
 */
export function ObjectCreationExpression(node,source,scope){
  let code;
  let root=node;
  node=node.firstChild;
  if(node.name!=='new'){
    let dot=node.nextSibling;
    if(dot.name==="."){
      /**Seltsames Verhalten? Hier scheinen alle Ausdruecke zu landen, die mit einem . enden */
      /**TODO: Autocompletion klappt nicht bei mehr als einer Ebene: screen.bmi.=> keine Completion! */
      let node=root.firstChild;
      console.log("ende mit .",node);
      while(node && node.nextSibling && !node.nextSibling.type.isError){
        let f=CompileFunctions.get(node,source);
        if(f){
          try{
            f(node,source,scope);
          }catch(e){

          }
        }
        node=node.nextSibling;
      }
      throw source.createError("Unerwartetes Ende der Anweisung: Attribut oder Methode erwartet.", node);
      // let src=source.getText(root);

      // src=src.substring(0,src.length-1);
      // return Identifier({node: root, src: src, from: root.from,to: root.to-1},source,scope);
    }
    if(node.name==="Identifier"){
      Identifier(node,source,scope);
      console.log(source.getText(node));
    }
  }
  node=node.nextSibling;
  if(node.name!=='TypeName'){

  }
  let clazz,typename,typeArguments;
  if(node.name==="TypeName"){
    typename=TypeName(node,source,scope);
    clazz=typename.type.baseType;
    typeArguments=[];
  }else if(node.name==="GenericType"){
    typename=GenericType(node,source,scope);
    clazz=typename.type.baseType;
    let typeParameters=clazz.typeParameters;
    let typeArguments=typename.type.typeArguments;
    if(!typeParameters){
      throw source.createError("Die Klasse '"+clazz.name+"' deklariert keine Generics.");
    }
    if(typeArguments.length>0 && typeParameters.length!==typeArguments.length){
      throw source.createError("Falsche Anzahl an Datentypen.",node);
    }
    for(let i=0;i<typeParameters.length;i++){
      let p=typeParameters[i];
      let a=typeArguments[i];
    }
    typeArguments=[];
    typeArguments.$hideFromConsole=true;
    for(let i=0;i<typename.type.typeArguments.length;i++){
      typeArguments[i]={
        baseType: typename.type.typeArguments[i].baseType.name,
        dimension: typename.type.typeArguments[i].dimension
      };
    }
    console.log("new generic type",clazz,typeArguments);
  }
  if(clazz instanceof PrimitiveType){
    throw source.createError("Zu dem primitiven Datentyp '"+clazz.name+"' kann kein Objekt erzeugt werden.",node);
  }
  node=node.nextSibling;
  if(node.name!=='ArgumentList'){
    
  }
  let al=ArgumentList(node,source,scope,clazz.getConstructorParameters());
  code="new "+typename.code;
  if(!clazz.isNative()){
    code="await $App.asyncFunctionCall("+code+"(),'$constructor',["+JSON.stringify(typeArguments)+","+al.code.substring(1,al.code.length-1)+"])";
  }else{
    code+=al.code;
  }
  return {
    code,
    clazz: clazz,
    type: new Type(clazz,0)
  };
  // let method=scope.getMethod(mn,al.list,owner.static,owner.clazz);
  // if(method.error){
  //   throw (source.createError(method.error,node));
  // }
  // return {
  //   method,arguments: al, code
  // }
}