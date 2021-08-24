export class Statement{
  constructor(){

  }

  fromCodeTree(src,node,state){
    let errors=[];
    console.log("new statement",node);
    if(node.name==="ExpressionStatement"){
      node=node.firstChild;
      if(node.nextSibling.type.isError || node.nextSibling.name!==";"){
        errors.push(new Error("';' erwartet.",node,state));
      }
      if(node.name==="AssignmentExpression"){
        
      }
    }
    console.log("statement end");
    return errors;
  }
}