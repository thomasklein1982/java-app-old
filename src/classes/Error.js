export class Error{
  constructor(message,node,source){
    this.from=node.from;
    this.to=node.to;
    this.line=source.getLine(node.from);
    this.col=node.from-this.line.startIndex;
    if(!message){
      message="Syntax-Fehler";
    }
    this.message=message;
  }
  toString(){
    return this.line.number+":"+this.col+": "+this.message;
  }
}