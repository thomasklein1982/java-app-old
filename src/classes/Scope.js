export class Scope{
  constructor(project,method){
    this.project=project;
    this.method=method;
    this.stack=[];
    this.indent="    ";
  }

}