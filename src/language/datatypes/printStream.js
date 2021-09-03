export function definePrintStream(datatypes){
  let m={
    m: {
      println: {
        info: "Gibt den angegebenen Text aus und macht anschließend einen Zeilenumbruch.",
        params: [null],
        exec: function(t){
          console.log(t);
        }
      }
    }
  };
  datatypes.PrintStream.defineMembers(m);
  datatypes.PrintStream.cannotBeInstantiated=true;
}