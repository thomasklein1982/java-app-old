export class Error{
  constructor(message,node,source){
    this.line=source.state.doc.lineAt(node.from);
    this.col=node.from-this.line.from;
    this.message=message;
  }
  toString(){
    return this.line.number+":"+this.col+": "+this.message;
  }
}