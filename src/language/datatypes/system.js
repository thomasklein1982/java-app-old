export function defineSystem(datatypes){
  let m={
    a: {
      out: {
        static: true,
        type: datatypes.PrintStream
      }
    }
  }
  datatypes.System.define(datatypes.Object,"Die System-Klasse stellt statische Basis-Methoden zur Ein- und Ausgabe zur Verfügung.",m,true);
}