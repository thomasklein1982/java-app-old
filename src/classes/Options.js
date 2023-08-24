export class Options{
  /**
   * 
   * @param {*} classOptional class ...{} bei Hauptklasse optional
   * @param {*} voidOptional void kann weggelassen werden
   * @param {*} mainOptional keine main-Methode notwendig; erste Klasse ist immer Hauptklasse
   * @param {*} autocast primitive Typen und Strings werden automatisch implizit ineinander umgewandelt
   * @param {*} instantiateUIClasses für jede UI-Klasse wird automatisch ein Attribut in der Hauptklasse mit gleichem Namen erzeugt, das eine Instanz der UI-Klasse enthält. Alle diese UI-Klassen sind zu Beginn unsichtbar, außer, es gibt genau eine UI-Klasse.
   */
  constructor(classOptional, voidOptional, mainOptional, autocast, instantiateUIClasses){
    this.classOptional=classOptional;
    this.voidOptional=voidOptional;
    this.mainOptional=mainOptional;
    this.autocast=autocast;
    this.instantiateUIClasses=instantiateUIClasses;
  }
  static createFromHash(){
    let options=new Options(false,false,false,false,false);
    let hash=location.hash;
    if(hash.length>0){
      hash=hash.toLowerCase();
      for(let a in options){
        if(hash.indexOf(a.toLowerCase())>=0){
          options[a]=true;
        }
      }
    }
    console.log(options);
    return options;
  }
}

export const options=Options.createFromHash();