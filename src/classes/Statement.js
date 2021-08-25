export class Statement{
  constructor(){

  }

  compile(node,source,scope){
    let errors=[];
    console.log("new statement",node);
    if(node.name==="ExpressionStatement"){
      node=node.firstChild;
      if(node.nextSibling.type.isError || node.nextSibling.name!==";"){
        errors.push(source.createError("';' erwartet.",node));
      }
      if(node.name==="AssignmentExpression"){

      }
    }
    console.log("statement end");
    return errors;
  }
}