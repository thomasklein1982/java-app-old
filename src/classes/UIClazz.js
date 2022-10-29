/**
 * UIClazz ist eine Klasse, die von JPanel erbt
 */
export class UIClazz {
  static UIClazzes={
    JButton: {
      params: ["value","x","y","width","height"]
    },
    JTextField: {
      params: ["inputType","placeholder","x","y","width","height"]
    },
    JLabel: {
      params: ["value","x","y","width","height"]
    },
    JTextArea: {
      params: ["placeholder","x","y","width","height"]
    }
  };

  constructor(name){
    this.name=name;
    this.errors=[];
    this.props=[];
    this.variables=[];
    this.components=[];
    this.cssClass="";
    this.template="1";
    this.x=50;
    this.y=50;
    this.width=100;
    this.height=100;
    this.cssCode="";
    /**Komponente:
     * type
     * name
     * x,y,width,height
     * style
     * css-class
     * components
     * template
     */
  }

  isNative(){
    return false;
  }

  isSubtypeOf(clazz){
    return true;
  }

  getJavaScriptCode(){
    let code="class "+this.name+" extends JPanel";
    code+="{";
    code+="\nconstructor(){";
      code+="super("+this.template+","+this.x+","+this.y+","+this.width+","+this.height+");";
    for(let i in this.attributes){
      let a=this.attributes[i];
      code+="\n"+a.getJavaScriptCode();
    }
    code+="\n}";
    code+="\n$constructor(){";
    code+="this.components=[]";
    for(let i=0;i<this.components.length;i++){
      let c=this.components[i];
      code+="\n this.components["+i+"]=";
      code+="new "+c.type+"(";
      let clazz=UIClazz.UIClazzes[c.type];
      let args=[];
      for(let j=0;j<clazz.params.length;j++){
        let p=clazz.params[j];
        if(p==="x" || p==="y" || p==="width" || p==="height"){
          args.push(c[p]);
        }else{
          args.push(JSON.stringify(c[p]));
        }
      }
      code+=args.join(",");
      code+=");";
      code+="\nthis.add(this.components["+i+"]);";
      if(c.name){
        code+="\nthis."+c.name+"= this.components["+i+"];";
      }
    }
    code+="\nreturn this;"
    code+="\n}";
    code+="\n}";
    return code;
  }

  getConstructorParameters(){
    return [];
  }

  getSaveObject(){
    return {
      name: this.name,
      components: this.components,
      cssClass: this.cssClass,
      template: this.template,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  restoreFromSaveObject(obj){
    this.name=obj.name;
    this.components=obj.components;
    this.cssClass=obj.cssClass;
    this.template=obj.template;
    this.x=obj.x;
    this.y=obj.y;
    this.width=obj.width;
    this.height=obj.height;
  }

  compile(){

  }

  compileMemberDeclarations(){

  }

  compileMethods(){

  }

  resolveSuperClazz(){

  }
}
