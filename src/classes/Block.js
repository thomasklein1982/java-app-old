import { Error } from "./Error";
import { Statement } from "./Statement";

export class Block{
  constructor(){

  }
  compile(node,source,scope){
    this.statements=[];
    let src,state;
    let errors=[];
    node=node.firstChild;
    if(node.type.isError || node.name!=='{'){
      errors.push(source.createError("'{' erwartet",node));
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
          errors.push(source.createError("Anweisung erwartet.",node));
        }else{
          let s=new Statement();
          errors=errors.concat(s.compile(node,source,scope));
          this.statements.push(s);
        }
      }
    }
    if(open){
      errors.push(source.createError("Die Methode wird nicht geschlossen.",node));
    }
    return errors;
  }
}