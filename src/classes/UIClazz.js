import { createAttribute } from "../language/helper/createAttribute";
import { Java } from "../language/java";

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
    },
    DataTable: {
      params: []
    },
    JPanel: {
      params: ["template","x","y","width","height"]
    }
  };

  constructor(name,project){
    this.name=name;
    this.project=project;
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
    this.superClazz=Java.clazzes.JPanel;
    this.attributes={};
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

  

  getAttribute(name,staticAccess){
    if(staticAccess){
      return {
        error: "Die Klasse '"+this.name+"' hat kein "+(staticAccess? "statisches ":"")+"Attribut namens '"+name+"'."
      };
    } 
    let a=this.attributes[name];
    if(!a && this.superClazz){
      a=this.superClazz.getAttribute(name,staticAccess);
      if(a && a.error){
        a=null;
      }
    }
    if(!a){
      return {
        error: "Die Klasse '"+this.name+"' hat kein "+(staticAccess? "statisches ":"")+"Attribut namens '"+name+"'."
      };
    }
    return a;
  }

  getMethod(name,staticAccess){
    if(staticAccess){
      return {
        error: "Die Klasse '"+this.name+"' hat keine "+(staticAccess? "statische ":"")+"Methode namens '"+name+"'."
      };
    }
    let m=this.superClazz.getMethod(name,staticAccess);
    if(m && m.error){
      m=null;
    }
    if(!m){
      return {
        error: "Die Klasse '"+this.name+"' hat keine "+(staticAccess? "statische ":"")+"Methode namens '"+name+"'."
      };
    }
    return m;
  }

  static getAllAttributesFromComponent(component,names,standardValue){
    for(let i=0;i<component.components.length;i++){
      let c=component.components[i];
      if(c.name){
        if(standardValue!==undefined){
          names[c.name]=standardValue;
        }else{
          names[c.name]=c;
        }
      }
      if(c.components){
        UIClazz.getAllAttributesFromComponent(c,names,standardValue);
      }
    }
    return names;
  }

  getAllAttributeNames(names){
    if(!names) names={};
    UIClazz.getAllAttributesFromComponent(this,names,true);
    if(this.superClazz){
      return this.superClazz.getAllAttributeNames(names);
    }
    return names;
  }


  isNative(){
    return false;
  }

  isSubtypeOf(clazz){
    if(!clazz || clazz===this || this.superClazz.isSubtypeOf(clazz)){
      return true;
    }
    return false;
  }

  hasStaticMainMethod(){
    return false;
  }

  isBuiltIn(){
    return false;
  }

  getUIPreviewCode(){
    let code=this.project.getFullAppCode("\n$uiPreviewMode=true;\nconsole.hide();\nasync function onStart(){\n\n(new "+this.name+"("+")).$constructor();}");
    return code;
  }

  getJavaScriptCode(){
    let code="class "+this.name+" extends JPanel";
    code+="{";
    code+="\nconstructor(){";
      code+="super("+JSON.stringify(this.template)+","+this.x+","+this.y+","+this.width+","+this.height+");";
    for(let i in this.attributes){
      let a=this.attributes[i];
      code+="\n"+a.getJavaScriptCode();
    }
    code+="\n}";
    code+="\n$constructor(){";
    code+="this.components=[]";
    let codeObject={code: ""};
    this.appendJavaScriptCodeForComponent(this,0,codeObject,"this");
    code+=codeObject.code;
    code+="\nreturn this;"
    code+="\n}";
    code+="\n}";
    return code;
  }

  appendJavaScriptCodeForComponent(comp,startIndex,codeObject,containerString){
    let index=startIndex;
    for(let i=0;i<comp.components.length;i++){
      let c=comp.components[i];
      let name="this.components["+index+"]";
      codeObject.code+="\n "+name+"=";
      codeObject.code+="new "+c.type+"(";
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
      codeObject.code+=args.join(",");
      codeObject.code+=");";
      codeObject.code+="\n"+containerString+".add("+name+");";
      if(c.name){
        codeObject.code+="\nthis."+c.name+"= "+name+";";
      }
      codeObject.code+="\n"+name+".setCSSClass("+JSON.stringify(c.cssClass)+");";
      index++;
      if(c.components){
        index=this.appendJavaScriptCodeForComponent(c,index,codeObject,name);
      }
    }
    return index;
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
    this.attributes={};
    let namedComponents=UIClazz.getAllAttributesFromComponent(this,{});
    console.log("compile ui clazz",namedComponents);
    for(let name in namedComponents){
      let c=namedComponents[name];
      let a=createAttribute({
        name,
        type: c.type
      },this,false);
      this.attributes[name]=a;
    }
  }

  getRealSuperClazz(){
    return this.superClazz;
  }
  
  getRuntimeInfos(){
    
  }

  compileMemberDeclarations(){

  }

  compileMethods(){

  }

  resolveSuperClazz(){

  }
}
