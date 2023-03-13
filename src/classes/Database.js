import {Table} from "./Table";
alasql_code();
alasql.fn.datepart=function(date_part,date){
  if(/^\d\d(?:\:\d\d(?:\:\d\d)?)?$/.test(date)){
    let s=date.split(':');
    let part=date_part.toLowerCase();
    if(part==='second' || part==='ss'){
      if(s.length>2){
        return s[2]*1;
      }
    }else if(part==='minute'||part==='mm'){
      if(s.length>1){
        return s[1]*1;
      }
    }else if(part==='hour'|| part==="hh"){
      if(s.length>0){
        return s[0]*1;
      }
    }
    return 0;
  } 
  return null;
};
alasql.options.casesensitive=false;

export const SQL_KEYWORDS=['alter','create','table','add','constraint','all','column','and','any','as','asc','backup','database','between','case','check','create','index','replace','default','delete','desc','distinct','drop','view','exec','exists','foreign','key','from','full','outer','join','group','by','having','in','inner','insert','into','select','null','not','left','right','like','limit','or','order','primary','procedure','rownum','top','set','truncate','union','all','unique','update','values','where'];

export class Database{

  static String={name: "String", id: "STRING", value: "", icon: "pi pi-comment", comment: "Eine beliebige Zeichenkette."};
  static Numeric={name: "Numeric", id: "NUMERIC", value: 0, icon : "pi pi-percentage", comment: "Eine Zahl (mit oder ohne Komma bzw. Punkt). Arithmetische Operationen und Aggregatfunktionen wie SUM, MIN und MAX sind anwendbar."};
  static Date={name: "Date", id: "date", value: "1970-01-01", icon: "pi pi-calendar", comment: "Ein Datum in der Form jjjj-mm-tt. Funktionen wie YEAR, MONTH und DAY sind anwendbar."};
  static Time={name: "Time", id: "TIME", value: "13:45:30", icon: "pi pi-clock", comment: "Eine Uhrzeit in der Form hh:mm:ss. Aggregatfunktionen wie YEAR, MONTH und DAY sind anwendbar."};
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
    }else if(type==="time"){
      return Database.Time;
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
      console.log(e.message);
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