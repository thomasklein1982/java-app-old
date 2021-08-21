export class Type{
  constructor(name,dimension,isPrimitive,superType){
    this.name=name;
    this.dimension=dimension;
    this.isPrimitive=isPrimitive;
  }

  toString(){
    var t="Typ '"+this.name+"' "+this.dimension+" "+this.isPrimitive;
    return t;
  }

  fromCodeTree(src,node,state){
    var errors=[];
    if(node.name==="PrimitiveType"){
      this.name=src.substring(node.from,node.to);
      this.dimension=0;
      this.isPrimitive=true;
    }else if(node.name==="TypeName"){
      this.name=src.substring(node.from,node.to);
      this.dimension=0;
      this.isPrimitive=false;
    }else if(node.name==="ArrayType"){
      node=node.firstChild;
      if(node.name==="PrimitiveType"){
        this.isPrimitive=true;
        this.name=src.substring(node.from,node.to);
      }else{
        this.isPrimitive=false;
        this.name=src.substring(node.from,node.to);
      }
      node=node.nextSibling;
      var parent=node;
      /**jetzt Folge von [] */
      this.dimension=0;
      while(parent){
        node=parent.firstChild;
        if(node.name==="["){
          
        }else{
          errors.push(new Error("'[' erwartet.",node,state));
          break;
        }
        node=node.nextSibling;
        if(node.name==="]"){
          
        }else{
          errors.push(new Error("']' erwartet.",node,state));
          break;
        }
        parent=parent.nextSibling;
        this.dimension++;
      }
    }
    return errors;
  }
}