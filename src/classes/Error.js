export class Error{
  constructor(message,node,source){
    this.from=node.from;
    this.to=node.to;
    this.line=source.state.doc.lineAt(node.from);
    this.col=node.from-this.line.from;
    if(!message){
      message="Syntax-Fehler";
    }
    this.message=message;
  }
  toString(){
    return this.line.number+":"+this.col+": "+this.message;
  }
}