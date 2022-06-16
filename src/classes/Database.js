import {Table} from "./Table";
alasql_code();
alasql.options.casesensitive=false;

export class Database{

  static String={name: "String", id: "STRING", value: "", icon: "pi pi-comment"};
  static Numeric={name: "Numeric", id: "NUMERIC", value: 0, icon : "pi pi-percentage"};
  static Date={name: "Date", id: "date", value: "1970-01-01", icon: "pi pi-calendar"};
  constructor(sourceCSV,fileName){
    this.clearFromMemory();
    this.tables=[];
    this.separator=";";
    this.changed=false;
  }

  static getTypeByName(type){
    type=type.toLowerCase();
    if(type==="string"){
      return Database.String;
    }else if(type==="numeric"){
      return Database.Numeric;
    }else if(type==="date"){
      return Database.Date;
    }
    return null;
  }

  addTable(name){
    var t=new Table(this,name);
    this.tables.push(t);
    this.changed=true;
  }
  getTableByName(name){
    for(var i=0;i<this.tables.length;i++){
      var t=this.tables[i];
      if(t.name===name){
        return t;
      }
    }
    return null;
  }
  isEmpty(){
    return this.tables.length===0;
  }
  clearFromMemory(){
    var tables=Object.keys(alasql.tables);
    if(tables){
      for(var i=0;i<tables.length;i++){
        var c="drop table "+tables[i];
        try{
          alasql(c);
        }catch(e){
          console.log(e);
        }
      }
    }
  }
  clear(){
    this.clearFromMemory();
    this.tables=[];
    this.separator=";";
    this.changed=true;
  }
  createInMemory(commandsOnly){
    if(!commandsOnly){
      this.clearFromMemory();
    }
    var s=[];
    for(var i=0;i<this.tables.length;i++){
      var t=this.tables[i];
      s=s.concat(t.createInMemory(commandsOnly));
    }
    this.changed=false;
    return s;
  }
  query(sqlSource){
    try{
      var r=alasql(sqlSource);
      return r;
    }catch(e){
      throw e.message;
    }
  }
  fromCSVString(s){
    this.clear();
    var tableData=s.split(this.separator+this.separator+"\n");
    for(let i=0;i<tableData.length;i++){
      var td=tableData[i].trim();
      if(td.length===0){
        continue;
      }
      var table=new Table(this);
      table.fromCSVString(td,this.separator);
      this.tables.push(table);
    }
    this.changed=true;
  }
  toCSVString(){
    var s="";
    for(var tn in this.tables){
      var t=this.tables[tn];
      s+=t.toCSVString(this.separator)+this.separator+this.separator+"\n";
    }
    s=s.substring(0,s.length-3);
    return s;
  }
  parseNextTable(){
    this.skipEmptyLines();
    /*tabellenname:*/
    var name=this.csv.get(this.currentLine,0);
    if(name!==null && name.length>0){
      name=name.toUpperCase();
      var table=new Table(name);
      this.currentLine++;
      /*attribute:*/
      var attributes=[];
      for(var i=0;i<this.csv.colCount;i++){
        var a=this.csv.get(this.currentLine,i);
        if(a!==null && a.length>0){
          a=a.toLowerCase();
          attributes.push(a);
          table.addAttribute(a);
        }else{
          break;
        }
      }
      this.currentLine++;
      /*datensaetze:*/
      while(this.currentLine<this.csv.rowCount){
        if(this.isCurrentLineEmpty()){
          break;
        }
        var r=new Record();
        for(var i=0;i<table.attributes.length;i++){
          var d=this.csv.get(this.currentLine,i);
          if(d===undefined||d.length===0||d.toLowerCase()==="null"){
            d=undefined;
          }
          r.set(i,d);
        }
        table.addRecord(r);
        this.currentLine++;
      }
      table.calcDatatypes();
      this.tables[table.name]=table;
      return true;
    }else{
      return false;
    }
  }
  skipEmptyLines(){
    while(this.isCurrentLineEmpty() && this.currentLine<this.csv.rowCount){
      this.currentLine++;
    }
  }
  isCurrentLineEmpty(){
    for(var i=0;i<this.csv.colCount;i++){
      var t=this.csv.get(this.currentLine,i);
      if(t===null){
        return true;
      }
      if(t.length>0){
        return false;
      }
    }
    return true;
  }
};

export const database=new Database();

window.database=database;