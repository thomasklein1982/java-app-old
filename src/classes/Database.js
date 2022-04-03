import {Table} from "./Table";
alasql_code();
export class Database{

  static String={name: "String", id: "STRING"};
  static Number={name: "Number", id: "NUMERIC"};
  static Date={name: "Date", id: "DATE"};
  constructor(sourceCSV,fileName){
    this.clear();
    this.tables=[];
  }
  addTable(name){
    var t=new Table(name);
    this.tables.push(t);
  }
  isEmpty(){
    return this.tables.length===0;
  }
  clear(){
    var tables=Object.keys(alasql.tables);
    if(tables){
      for(var i=0;i<tables.length;i++){
        try{
          alasql("drop table "+tables[i]);
        }catch(e){
          console.log(e);
        }
      }
    }
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
      var td=tableData[i];
      if(td.length===0){
        continue;
      }
      var table=new Table();
      table.fromCSVString(td,this.separator);
      this.tables.push(table);
    }
  }
  toCSVString(){
    var s="";
    for(var tn in this.tables){
      var t=this.tables[tn];
      s+=t.toCSVString(this.separator)+this.separator+this.separator+"\n";
    }
    s=s.substring(0,s.length-1);
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