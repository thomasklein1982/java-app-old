export function getClazzFromState(state){
  let clazz=null;
  try{
    let node=state.tree.topNode.firstChild;
    while(node && node.name!=="ClassDeclaration"){
      node=node.nextSibling;
    }
    if(node){
      node=node.firstChild;
      while(node && node.name!=="Definition"){
        node=node.nextSibling;
      }
      let clazzname=state.doc.sliceString(node.from,node.to);
      clazz=app.getProject().getClazzByName(clazzname);
    }
  }catch(e){
    console.error(e);
  }
  return clazz;
}