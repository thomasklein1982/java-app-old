import { createMethod } from "../helper/createMethod";
import { Java } from "../java";


export function defineMatrix(clazz){
  clazz.name="Matrix";
  createMethod({
    args: [
      {name: "rows", type: "int", info: "Anzahl der Zeilen"},
      {name: "cols", type: "int", info: "Anzahl der Spalten"}
    ]
  },clazz,false,true);
  createMethod({
    name: "set",
    args: [
      {name: "r", type: "int", info: "Zeilennummer (beginnt mit 1)"},
      {name: "c", type: "int", info: "Spaltennummer (beginnt mit 1)"},
      {name: "value", type: "double", info: "Neuer Wert an dieser Stelle"}
    ],
    info: "Legt den Eintrag in der r-ten Zeile und der c-ten Spalte fest."
  },clazz,false,false);
  createMethod({
    name: "get",
    args: [
      {name: "r", type: "int", info: "Zeilennummer (beginnt mit 1)"},
      {name: "c", type: "int", info: "Spaltennummer (beginnt mit 1)"}
    ],
    returnType: "double",
    info: "Gibt den Wert des Eintrags in der r-ten Zeile und der c-ten Spalte zurück."
  },clazz,false,false);
  createMethod({
    name: "getRowCount",
    args: [],
    returnType: "int",
    info: "Gibt die Anzahl der Zeilen der Matrix zurück."
  },clazz,false,false);
  createMethod({
    name: "getColCount",
    args: [],
    returnType: "int",
    info: "Gibt die Anzahl der Spalten der Matrix zurück."
  },clazz,false,false);
  createMethod({
    name: "setColumn",
    args: [
      {name: "c", type: "int", info: "Spaltennummer (beginnt mit 1)"},
      {name: "values", type: {baseType: "double", dimension: 1}, info: "Die neuen Werte für die Spalte."}
    ],
    info: "Legt die Werte der c-ten Spalte fest."
  },clazz,false,false);
  createMethod({
    name: "getColumn",
    args: [
      {name: "c", type: "int", info: "Spaltennummer (beginnt mit 1)"}
    ],
    returnType: {
      baseType: "double",
      dimension: 1
    },
    info: "Gibt die c-te Spalte zurück."
  },clazz,false,false);
  createMethod({
    name: "setRow",
    args: [
      {name: "r", type: "int", info: "Zeilennummer (beginnt mit 1)"},
      {name: "values", type: {baseType: "double", dimension: 1}, info: "Die neuen Werte für die Zeile."}
    ],
    info: "Legt die Werte der r-ten Zeile fest."
  },clazz,false,false);
  createMethod({
    name: "getRow",
    args: [
      {name: "r", type: "int", info: "Zeilennummer (beginnt mit 1)"}
    ],
    returnType: {
      baseType: "double",
      dimension: 1
    },
    info: "Gibt die r-te Zeile zurück."
  },clazz,false,false);
  createMethod({
    name: "multiply",
    args: [
      {name: "m", type: "Matrix", info: "Die Matrix, mit der multipliziert wird. Muss so viele Zeilen haben wie diese Matrix Spalte hat."}
    ],
    returnType: "Matrix",
    info: "Multipliziert diese Matrix mit der Matrix m und gibt die Ergebnis-Matrix zurück."
  },clazz,false,false);
  createMethod({
    name: "add",
    args: [
      {name: "m", type: "Matrix", info: "Die Matrix, die addiert wird. Muss diesen Dimensionen wie diese Matrix haben."}
    ],
    returnType: "Matrix",
    info: "Addiert zu dieser Matrix die Matrix m und gibt die Ergebnis-Matrix zurück."
  },clazz,false,false);
  createMethod({
    name: "sub",
    args: [
      {name: "m", type: "Matrix", info: "Die Matrix, die subtrahiert wird. Muss diesen Dimensionen wie diese Matrix haben."}
    ],
    returnType: "Matrix",
    info: "Subtrahiert von dieser Matrix die Matrix m und gibt die Ergebnis-Matrix zurück."
  },clazz,false,false);
  createMethod({
    name: "scale",
    args: [
      {name: "s", type: "double", info: "Der Faktor, mit dem die Matrix skaliert wird."}
    ],
    returnType: "Matrix",
    info: "Mutipliziert alle Einträge dieser Matrix mit s."
  },clazz,false,false);

  // multiply(m){
  //   if(m.rowCount!==this.colCount){
  //     throw new Exception("Die Matrix hat "+m.rowCount+" Zeilen, sie muss aber "+this.colCount+" Zeilen haben.");
  //   }
  //   let res=new Matrix(this.rowCount,m.colCount);
  //   for(let i=0;i<this.rowCount;i++){
  //     let row=this.rows[i];
  //     for(let j=0;j<m.colCount;j++){
  //       let e=0;
  //       for(let k=0;k<this.colCount;k++){
  //         e+=row[k]*m.rows[k][j];
  //       }
  //       res.setEntry(i+1,j+1,e);
  //     }
  //   }
  //   return res;
  // }
}