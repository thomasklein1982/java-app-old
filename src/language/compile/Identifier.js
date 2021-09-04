import { Error } from "../../classes/Error";
import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { Java } from "../java";

/**wenn owner=null: top level identifier, ansonsten ist owner ein Objekt mit folgenden Eigenschaften: 
 * clazz: Clazz Die Klasse des Objektes in der Hierarchie darueber 
 * static: boolean Gibt an, ob das Objekt in der Hierarchie darueber eine Klasse ist, also ob der Identifier statisch sein muss
 * @param {*} node 
 * @param {Source} source 
 * @param {Scope} scope 
 * @param {Error[]} errors 
 * @param {Object} owner 
 * @returns 
 */
export function Identifier(node,source,scope,errors,owner){
  console.log(node);
  let name=source.getText(node);
  let obj;
  if(owner && owner.clazz){
    obj=owner.clazz.getAttribute(owner.static);
    if(!obj){
      errors.push(source.createError("Die Klasse "+owner.clazz.name+" hat kein "+(owner.static? "statisches":"")+" Attribut ",node));
    }
  }else{
    //Top-Level
    obj=scope.getLocalVariable(name);
    if(!obj){
      obj=scope.getAttribute(name,false);
    }
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