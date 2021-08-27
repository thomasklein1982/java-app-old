

export function defineObject(object,string,boolean){
  let m={
    a: {},
    c: [
      {
        params: [],
        exec: function(){
          return new Blox.Object();
        }
      }
    ],
    m: {
      equals: {
        info: "Prueft, ob dieses und das angegebene Objekt identisch sind.",
        params: [object],
        returns: boolean,
        exec: function(a){
          return this===a;
        }
      },
      toString: {
        info: "Wandelt das Objekt in einen String um.",
        params: [],
        returns: string,
      }
    }
  }
  object.defineMembers(m);
}