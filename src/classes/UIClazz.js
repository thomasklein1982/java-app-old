import { parseJava } from "../functions/parseJava";
import { CompileFunctions } from "../language/CompileFunctions";
import { createAttribute } from "../language/helper/createAttribute";
import { createMethod } from "../language/helper/createMethod";
import { Java } from "../language/java";
import { Scope } from "./Scope";
import { Source } from "./Source";
import { Type } from "./Type";

/**
 * UIClazz ist eine Klasse, die von JPanel erbt
 */
export class UIClazz {
  static UIClazzes={
    JButton: {
      params: ["value","x","y","width","height"],
      labels: {
        value: "Der angezeigte Text des Buttons."
      }
    },
    JTextField: {
      params: ["inputType","placeholder","x","y","width","height"],
      labels: {
        value: "Der eingegebene Wert des Textfelds."
      }
    },
    JLabel: {
      params: ["value","x","y","width","height"],
      labels: {
        value: "Der angezeigte Text."
      }
    },
    JImage: {
      params: ["value","x","y","width","height"],
      labels: {
        value: "Die URL zur Bilddatei."
      }
    },
    JTextArea: {
      params: ["placeholder","x","y","width","height"],
      labels: {
        value: "Der eingebene Text der TextArea."
      }
    },
    DataTable: {
      params: []
    },
    JPanel: {
      params: ["template","x","y","width","height"],
    },
    JCheckBox: {
      params: ["label","x","y","width","height"],
      labels: {
        value: "Ist die Checkbox markiert oder nicht."
      }
    },
    JComboBox: {
      params: ["options","x","y","width","height"],
      labels: {
        value: "Die aktuell ausgewählte Option."
      }
    }
  };

  constructor(name,project){
    this.name=name;
    this.project=project;
    this.methods={};
    this.errors=[];
    this.props=[];
    this.variablesRaw="";
    this.variables=[];
    this.variablesErrors=[];
    this.components=[];
    this.componentCode="";
    this.rerenderMethod=createMethod({
      name: "rerender",
      params: []
    },this,false,false);
    this.cssClass="";
    this.template="1";
    this.forceAbsolute=false;
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

  isUIClazz(){
    return true;
  }

  compileVariables(scope){
    this.variables=[];
    this.variablesErrors=[];
    this.methods={};
    let source=this.variablesRaw;
    if(source){
      source=source.trim(); 
    }else{
      this.variablesRaw="";
      return;
    }
    let tree=parseJava(source);
    let node=tree.topNode.firstChild;
    source=new Source(source,tree);
    let code=[];
    while(node){
      if(node.name==="LocalVariableDeclaration"){
        let f=CompileFunctions.get(node,source);
        try{
          let c=f(node,source,scope);
          for(let i=0;i<c.updateLocalVariablesAfter.length;i++){
            let a=createAttribute({
              name: c.updateLocalVariablesAfter[i],
              type: c.type
            },this,false,"private");
            a.initialValue=c.initialValues[i];
            a.isNamedComponent=false;
            this.attributes[a.name]=a;
            let setterMethodName="set"+a.name.charAt(0).toUpperCase()+a.name.substring(1);
            this.methods[setterMethodName]=createMethod({
              name: setterMethodName,
              args: [{
                name: a.name,
                type: a.type
              }],
              jscode: "this."+a.name+"="+a.name+";\nthis.rerender();"
            },this,false,false);
          }
        }catch(e){
          this.variablesErrors.push(e);
        }
      }
      node=node.nextSibling;
    }
    console.log(this.attributes);
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
    let m=this.methods[name];
    if(m) return m;
    m=this.superClazz.getMethod(name,staticAccess);
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
    code+="\nasync $constructor(){";
    for(let i in this.attributes){
      let a=this.attributes[i];
      if(!a.isNamedComponent){
        code+="\n"+a.getJavaScriptCode();
        if(a.initialValue){
          code+="\nthis."+a.name+"="+a.initialValue+";";
        }
      }
    }
    code+="\nthis.rerender();"
    code+="\nreturn this;"
    code+="\n}";
    code+="\nrerender(){\nlet lastComponent,component=this,container;";
    code+="\nif(this.$el.replaceChildren) this.$el.replaceChildren(); else this.$el.innerHTML='';\n";
    code+="\n"+this.componentCode;
    code+="\n}";
    for(let i in this.methods){
      let m=this.methods[i];
      code+="\n"+m.getJavaScriptCode();
    }
    code+="\n}";
    console.log(code);
    return code;
  }

  

  appendJavaScriptCodeForComponents(comp,startIndex,codeObject,containerString){
    let index=startIndex;
    for(let i=0;i<comp.components.length;i++){
      let c=comp.components[i];
      if(c.controlComponent){
        if(c.type==='For'){
          let length=c.value;
          for(let j=0;j<length;j++){
            index=this.appendJavaScriptCodeForComponent(c,index,codeObject,containerString);
          }
        }
        continue;
      }
      let name="this.components["+index+"]";
      codeObject.code+="\n "+name+"=";
      codeObject.code+="new "+c.type+"(";
      let clazz=UIClazz.UIClazzes[c.type];
      let args=[];
      for(let j=0;j<clazz.params.length;j++){
        let p=clazz.params[j];
        if(p==="x" || p==="y" || p==="width" || p==="height"){
          args.push(c[p]);
        }else if(p==="options"){
          try{
            let array=JSON.parse(c[p]);
            args.push("new $App.Array('String',"+array.length+","+JSON.stringify(array)+")");
          }catch(e){

          }
        }else{
          args.push(JSON.stringify(c[p]));
        }
      }
      codeObject.code+=args.join(",");
      codeObject.code+=");";
      codeObject.code+="\n"+containerString+".add("+name+");";
      if(c.name){
        //codeObject.code+="\nif("
        if(c.array){
          codeObject.code+="\nthis."+c.name+".push("+name+");";
        }else{
          codeObject.code+="\nthis."+c.name+"= "+name+";";
        }
      }
      if(c.cssClass){
        codeObject.code+="\n"+name+".setCSSClass("+JSON.stringify(c.cssClass)+");";
      }
      if(c.forceAbsolute){
        codeObject.code+="\n"+name+".setStyle('position','absolute');";
        codeObject.code+="\n"+name+".$el.updatePosition();";
      }
      if(c.value!==null && c.value!==undefined){
        let v;
        if(c.value.slice){
          v=JSON.stringify(c.value);
        }else{
          v=c.value;
        }
        console.log(c.value,v);
        
        codeObject.code+="\n"+name+".value="+v+";";
      }
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
      variablesRaw: this.variablesRaw,
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
    this.variablesRaw=obj.variablesRaw;
    this.cssClass=obj.cssClass;
    this.template=obj.template;
    this.x=obj.x;
    this.y=obj.y;
    this.width=obj.width;
    this.height=obj.height;
  }

  compile(){
    let scope=new Scope(this.project,undefined,undefined,false);
    this.attributes={};
    this.compileVariables(scope);
    let namedComponents=UIClazz.getAllAttributesFromComponent(this,{},undefined);
    console.log("compile ui clazz",namedComponents);
    for(let name in namedComponents){
      let c=namedComponents[name];
      let a=createAttribute({
        name,
        type: c.array? {baseType: c.type, dimension: 1} : c.type
      },this,false);
      a.isNamedComponent=true;
      this.attributes[name]=a;
    }
    this.componentCode="";
    let codeObject={code: "var container0=this;\n"};
    scope=new Scope(this.project,this.rerenderMethod,undefined,false);
    this.appendJavaScriptCodeForComponent(scope,this,codeObject,0);
    console.log(codeObject.code);
    this.componentCode=codeObject.code;
  }

  parseInterpolatedString(scope,src){
    let parts=[];
    let pos2=-1;
    let pos=src.indexOf("{{");
    let lastPos2=0;
    while(pos>=0){
      pos2=src.indexOf("}}",pos);
      if(pos2>=pos){
        if(lastPos2<pos){
          parts.push(JSON.stringify(src.substring(lastPos2,pos)));
        }
        let code=src.substring(pos+2,pos2);
        let res=this.parseJavaStatement(scope,code);
        parts.push(res.code);
        pos=src.indexOf("{{",pos2+1);
        lastPos2=pos2+2;
      }else{
        pos=-1;
      }
    }
    if(parts.length===0){
      return JSON.stringify(src);
    }
    if(pos2+2<src.length){
      parts.push(JSON.stringify(src.substring(pos2+2)));
    }
    return parts.join("+");
  }

  parseJavaStatement(scope,src){
    try{
      let tree=parseJava(src);
      let node=tree.topNode.firstChild;
      if(node.name!=="ExpressionStatement"){
        throw "Kein Java-Ausdruck";
      }
      node=node.firstChild;
      let source=new Source(src,tree);
      let f=CompileFunctions.get(node,source);
      if(f){
        var res=f(node,source,scope);
        return res;
      }else{
        return {code: src};
      }
    }catch(e){
      console.error(e);
      return {code: src};
    }
  }

  appendJavaScriptCodeForComponent(scope,comp,codeObject,containerIndex){
    for(let i=0;i<comp.components.length;i++){
      let c=comp.components[i];
      if(c.controlComponent){
        if(c.type==='For'){
          scope.pushLayer();
          let min=this.parseJavaStatement(scope,c.controlComponent.min);
          let max=this.parseJavaStatement(scope,c.controlComponent.max);
          let variable=c.controlComponent.variable;
          scope.pushLocalVariable(variable,new Type(Java.datatypes.int, 0));
          codeObject.code+="for(let "+variable+"="+min.code+";"+variable+"<="+max.code+";"+variable+"++){\n";
          this.appendJavaScriptCodeForComponent(scope, c,codeObject,containerIndex);
          codeObject.code+="\n}\n";
          scope.popLayer();
        }else if(c.type==='If'){
          let condition=this.parseJavaStatement(scope,c.controlComponent.condition);
          codeObject.code+="if("+condition.code+"){\n";
          this.appendJavaScriptCodeForComponent(scope, c,codeObject,containerIndex);
          codeObject.code+="\n}\n";
        }
        continue;
      }
      let last="component";
      codeObject.code+="{\n";
      codeObject.code+="\nlet "+last+"=";
      codeObject.code+="new "+c.type+"(";
      let clazz=UIClazz.UIClazzes[c.type];
      let args=[];
      for(let j=0;j<clazz.params.length;j++){
        let p=clazz.params[j];
        if(p==="x" || p==="y" || p==="width" || p==="height"){
          args.push(c[p]);
        }else if(p==="options"){
          try{
            let array=JSON.parse(c[p]);
            args.push("new $App.Array('String',"+array.length+","+JSON.stringify(array)+")");
          }catch(e){

          }
        }else{
          args.push(JSON.stringify(c[p]));
        }
      }
      codeObject.code+=args.join(",");
      codeObject.code+=");";
      codeObject.code+="\ncontainer"+containerIndex+".add("+last+");";
      if(c.name){
        codeObject.code+="\nthis."+c.name+"= "+last+";";
      }
      if(c.actionCommand){
        codeObject.code+="\n"+last+".setActionCommand("+this.parseInterpolatedString(scope, c.actionCommand)+");";
      }
      if(c.cssClass){
        codeObject.code+="\n"+last+".setCSSClass("+JSON.stringify(c.cssClass)+");";
      }
      if(c.forceAbsolute){
        codeObject.code+="\n"+last+".setStyle('position','absolute');";
        codeObject.code+="\n"+last+".$el.updatePosition();";
      }
      if(c.value!==null && c.value!==undefined){
        let v=this.parseInterpolatedString(scope,c.value);
        
        codeObject.code+="\n"+last+".value="+v+";";
      }
      if(c.components){
        codeObject.code+="\nlet container"+(containerIndex+1)+"="+last+";";
        this.appendJavaScriptCodeForComponent(scope,c,codeObject,containerIndex+1);
      }
      codeObject.code+="}\n";
    }
  }

  getRealSuperClazz(){
    return this.superClazz;
  }
  
  getRuntimeInfos(){
    
  }

  compileMethodDeclarations(){

  }

  compileAttributeDeclarations(){
    
  }

  compileMethods(){

  }

  resolveSuperClazz(){

  }
}
