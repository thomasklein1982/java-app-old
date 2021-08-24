import { Error } from "./Error";
import { Statement } from "./Statement";

export class CodeBlock{
  constructor(){

  }
  compile(src,node,state,project,method,localScope,indent){
    this.statements=[];
    let errors=[];
    node=node.firstChild;
    if(node.type.isError || node.name!=='{'){
      errors.push(new Error("'{' erwartet",node,state));
      return errors;
    }
    node=node.nextSibling;
    let open=true;
    while(node.nextSibling){
      node=node.nextSibling;
      if(node.name==='}'){
        open=false;
      }else{
        if(node.type.isError || node.name.indexOf('Statement')<0){
          errors.push(new Error("Anweisung erwartet.",node,state));
        }else{
          let s=new Statement();
          errors=errors.concat(s.fromCodeTree(src,node,state));
          this.statements.push(s);
        }
      }
    }
    if(open){
      errors.push(new Error("Die Methode wird nicht geschlossen.",node,state));
    }
    return errors;
  }
}