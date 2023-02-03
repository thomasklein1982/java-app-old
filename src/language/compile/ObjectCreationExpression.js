import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { ArgumentList } from "./ArgumentList";
import { Identifier } from "./Identifier";
import { PrimitiveType } from "../../classes/PrimitiveType";
import { TypeName } from "./TypeName";

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
  
  let typename=TypeName(node,source,scope);
  let clazz=typename.type.baseType;
  if(clazz instanceof PrimitiveType){
    throw source.createError("Zu dem primitiven Datentyp '"+clazz.name+"' kann kein Objekt erzeugt werden.",node);
  }
  node=node.nextSibling;
  if(node.name!=='ArgumentList'){
    
  }
  let al=ArgumentList(node,source,scope,clazz.getConstructorParameters());
  code="new "+typename.code;
  if(!clazz.isNative()){
    code="await $App.asyncFunctionCall("+code+"(),'$constructor',["+al.code.substring(1,al.code.length-1)+"])";
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