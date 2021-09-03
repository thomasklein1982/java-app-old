export function defineSystem(datatypes){
  let m={
    a: {
      out: {
        static: true,
        type: datatypes.PrintStream
      }
    }
  }
  datatypes.System.defineMembers(m);
  datatypes.System.cannotBeInstantiated=true;
}