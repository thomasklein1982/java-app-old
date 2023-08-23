export class Options{
  /**
   * 
   * @param {*} classOptional class ...{} bei Hauptklasse optional
   * @param {*} voidOptional void kann weggelassen werden
   * @param {*} mainOptional keine main-Methode notwendig; erste Klasse ist immer Hauptklasse
   * @param {*} autocast primitive Typen und Strings werden automatisch implizit ineinander umgewandelt
   * @param {*} instantiateUIClasses für jede UI-Klasse wird automatisch ein Attribut in der Hauptklasse mit gleichem Namen erzeugt, das eine Instanz der UI-Klasse enthält. Alle diese UI-Klassen sind zu Beginn unsichtbar, außer, es gibt genau eine UI-KLasse.
   */
  constructor(classOptional, voidOptional, mainOptional, autocast, instantiateUIClasses){
    this.classOptional=classOptional;
    this.voidOptional=voidOptional;
    this.mainOptional=mainOptional;
    this.autocast=autocast;
    this.instantiateUIClasses=instantiateUIClasses;
  }
  static createFromHash(){
    let options=new Options(true,true,true,true,true);
    return options;
  }
}

export const options=Options.createFromHash();