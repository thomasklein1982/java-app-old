export class Modifiers{
  constructor(){
    this.visibility='public';
    this.isStatic=false;
  }
  toString(){
    return this.visibility+" "+this.isStatic;
  }
  fromCodeTree(src,node,state){
    var errors=[];
    node=node.firstChild;
    this.visibility=null;
    while(node){
      if(node.name==="public"||node.name==="private"){
        if(this.visibility){
          errors.push(new Error("Die Sichtbarkeit wurde bereits auf '"+this.visibility+"' festgelegt.",node,state));
        }else{
          this.visibility=node.name;
        }
      }else if(node.name==="static"){
        if(this.isStatic){
          errors.push(new Error("Doppeltes Schlüsselwert 'static'.",node,state));
        }else{
          this.isStatic=true;
        }
        
      }else{
        console.log("modifier");
        console.log(node);
      }
      node=node.nextSibling;
    }
    return errors;
  }
}