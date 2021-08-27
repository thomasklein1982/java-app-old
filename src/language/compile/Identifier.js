export function Identifier(node,source,scope,errors){
  console.log(node);
  let name=source.getText(node);
  let obj=scope.get(name);
  return {
    code: source.getText(node),
    type: Java.datatypes.String
  };
}