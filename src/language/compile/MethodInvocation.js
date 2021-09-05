import { Error } from "../../classes/Error";
import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { ArgumentList } from "./ArgumentList";
import { FieldAccess } from "./FieldAccess";
import { Identifier } from "./Identifier";

/**
 * 
 * @param {*} node 
 * @param {Source} source 
 * @param {Scope} scope 
 * @param {Error[]} errors 
 */
export function MethodInvocation(node,source,scope,errors){
  node=node.firstChild;
  
  let mn,al,methods;
  let code="";
  let owner={
    clazz: null,
    static: false
  };
  if(node.name!=="MethodName"){
    if(node.name==="Identifier"){
      let id=Identifier(node,source,scope,errors);
      code=id.code;
      if(id.object instanceof Clazz){
        owner={
          clazz: id.object,
          static: true
        };
      }else{
        owner={
          clazz: id.object.type,
          static: false
        };
      }
    }else if(node.name==="FieldAccess"){
      let fa=FieldAccess(node,source,scope,errors);
      code=fa.code;
      owner={
        clazz: fa.object.type,
        static: false
      };
    }
    node=node.nextSibling;
    if(node.name==="."){
      code+=".";
    }else{
      errors.push(source.createError(null,node));
    }
    node=node.nextSibling;
  }
  if(node.name==="MethodName"){
    mn=source.getText(node);
    code+=mn;
    node=node.nextSibling;
  }
  console.log(node);
  methods=scope.getMethods(mn,owner.static,owner.clazz);
  if(!methods){
    errors.push(source.createError("Die Klasse '"+owner.clazz.name+"' hat keine "+(owner.static? "statische ":"")+"Methode namens '"+mn+"'.",node));
  }
  if(node.name==="ArgumentList"){
    al=ArgumentList(node,source,scope,errors);
    
  }
  
  console.log(mn,al);
}