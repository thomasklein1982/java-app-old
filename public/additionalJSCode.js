function additionalJSCode(){

  function $u(v){if(v===undefined){throw {message: "Undefinierter Wert."}} return v;}
  function $N(v,name){if(v===null){throw {message: "NullPointerException: Der Wert von '"+name+"' ist null, deshalb kannst du nicht auf Methoden oder Attribute zugreifen."}} return v;}
  function $v(v){if(Number.isNaN(v*1)){throw {message: "'"+v+"' ist keine Zahl."}}else{return v*1;}}
  function $i(v){if(Number.isNaN(v*1)){throw {message: "'"+v+"' ist keine Zahl."}}else{v*=1; return v>=0? Math.floor(v):Math.ceil(v);}}
  function $m(v,message,line){if(v===undefined){throw {message: message, line: line}}else{return v;}}
  function $n(a){return a;}
  Object.defineProperty(String.prototype,'len',{value: function(){return this.length;}, writeable: false});

  function $getElementById(uiclazz, id){
    //return new HTMLElement(document.getElementById(uiclazz.constructor.name+"-"+id));
    let e=document.getElementById(id);
    if(!e) return null;
    return new HTMLElement(e);
  }

  function $getFromArray(array,index){
    if(array.get){
      return array.get(index);
    }else{
      return array[index];
    }
  }

  function $setInArray(array,index,value,assignOp){
    if(assignOp==="+="){
      value=$getFromArray(array,index)+value;
    }else if(assignOp==="-="){
      value=$getFromArray(array,index)-value;
    }else if(assignOp==="*="){
      value=$getFromArray(array,index)*value;
    }else if(assignOp==="/="){
      value=$getFromArray(array,index)/value;
    }else if(assignOp==="%="){
      value=$getFromArray(array,index)%value;
    }
    if(array.set){
      array.set(index,value);
    }else{
      array[index]=value;
    }
  }

  function $getIndexOfComponentInParent(comp){
    var index=0;
    while(comp.previousElementSibling){
      index++;
      comp=comp.previousElementSibling;
    }
    return index;
  }

  function $castObject(object,destTypeName,destDimension){
    if(object===null) return object;
    let m="Objekt kann nicht gecastet werden";
    //console.log("caste",object,"nach",destTypeName,destDimension,$clazzRuntimeInfos);
    if(destDimension>0){
      let dim=[];
      let v=object;
      for(let i=0;i<destDimension;i++){
        dim.push(v.values.length);
        v=v.values[0];
      }
      let array=new $App.Array({name: destTypeName},dim);
      for(let i=0;i<object.values.length;i++){
        let v=object.values[i];
        array.values[i]=$castObject(v,destTypeName,destDimension-1);
      }
      return array;
    }
    var dest;
    var destRuntimeInfos=$clazzRuntimeInfos[destTypeName];
    if(destRuntimeInfos){
      eval("dest=new "+destTypeName+"();");
      for(let a in destRuntimeInfos.attributes){
        let at=destRuntimeInfos.attributes[a];
        if(!(a in object)){
          m+=". Attribut '"+a+"' nicht vorhanden.";
          App.console.log(m);
          throw m;
        }
        dest[a]=$castObject(object[a],at.baseType,at.dimension);
      }
    }else{
      return object;
    }
    return dest;
  }

  function $object_toString(obj){
    return obj.toString();
  }

  function $object_serialize(obj){
    try{
      return JSON.stringify(obj);
    }catch(e){
      throw {
        message: e.message
      };
    }
  }

  function $object_deserialize(obj,s){
    try{
      let data=JSON.parse(s);
      return data;
    }catch(e){
      throw {
        message: "String konnte nicht deserialisiert werden"
      }
    }
  }

  async function $asyncFunctionCallVariableObject(object,objectWithMethod,methodname,argumentsArray){
    return await objectWithMethod[methodname].apply(object,argumentsArray);
  };

  function $getFileName(obj){
    return obj.fileName;
  }

  function $getFileContentAsString(obj){
    return obj.data;
  }

  function $toRadians(obj,x){
    return x*Math.PI/180;
  }

  function $toDegrees(obj,x){
    return x*180/Math.PI;
  }

  // <div id="dialog-backdrop" style="display: none">
  //   <div id="dialog-frame">
  //     <div id="dialog-content">Hallo</div>
  //     <input type="text" id="dialog-input" style="display: none"></input>
  //     <div class="dialog-footer" id="dialog-footer-alert" style="display: none">
  //       <button class="dialog-footer-button" onclick="$clickDialogButton('alert')">OK</button>
  //     </div>
  //     <div class="dialog-footer" id="dialog-footer-confirm" style="display: none">
  //       <button class="dialog-footer-button" onclick="$clickDialogButton('yes')">Ja</button>
  //       <button class="dialog-footer-button" onclick="$clickDialogButton('no')">Nein</button>
  //     </div>
  //     <div class="dialog-footer" id="dialog-footer-prompt" style="display: none">
  //       <button class="dialog-footer-button" onclick="$clickDialogButton('prompt')">OK</button>
  //     </div>
  //   </div>
  // </div>
  function $setupDialog(){
    if($App.customDialog) return;
    $App.customDialog={
      backdrop: document.createElement("div"),
      frame: document.createElement("div"),
      content: document.createElement("div"),
      input: document.createElement("input"),
      footerAlert: document.createElement("div"),
      footerPrompt: document.createElement("div"),
      footerConfirm: document.createElement("div"),
      resolve: null
    };
    let ui=$App.customDialog;
    ui.backdrop.style="display: none";
    ui.backdrop.id="dialog-backdrop";
    ui.frame.id="dialog-frame";
    ui.backdrop.appendChild(ui.frame);
    ui.content.id="dialog-content";
    ui.frame.appendChild(ui.content);
    ui.input.id="dialog-input";
    ui.input.style="display: none";
    ui.frame.appendChild(ui.input);
    ui.footerAlert.className="dialog-footer";
    ui.footerAlert.id="dialog-footer-alert";
    let button=document.createElement("button");
    button.className="dialog-footer-button";
    button.onclick=function(){$clickDialogButton('alert')};
    button.innerHTML="OK";
    ui.footerAlert.appendChild(button);
    ui.frame.appendChild(ui.footerAlert);
    
    ui.footerConfirm.id="dialog-footer-confirm";
    ui.footerConfirm.className="dialog-footer";
    button=document.createElement("button");
    button.className="dialog-footer-button";
    button.onclick=function(){$clickDialogButton('yes')};
    button.innerHTML="Ja";
    ui.footerConfirm.appendChild(button);
    button=document.createElement("button");
    button.className="dialog-footer-button";
    button.onclick=function(){$clickDialogButton('no')};
    button.innerHTML="Nein";
    ui.footerConfirm.appendChild(button);
    ui.frame.appendChild(ui.footerConfirm);

    ui.footerPrompt.id="dialog-footer-prompt";
    ui.footerPrompt.className="dialog";
    button=document.createElement("button");
    button.className="dialog-footer-button";
    button.onclick=function(){$clickDialogButton('prompt')};
    button.innerHTML="OK";
    ui.footerPrompt.appendChild(button);
    ui.frame.appendChild(ui.footerPrompt);
    document.body.appendChild(ui.backdrop);
  }

  $clickDialogButton=function(button){
    if(button==="alert"){
      $App.customDialog.resolve();
    }else if(button==="yes"){
      $App.customDialog.resolve(true);
    }else if(button==="no"){
      $App.customDialog.resolve(false);
    }else if(button==="prompt"){
      $App.customDialog.resolve($App.customDialog.input.value);
    }
  }

  $showDialog=function(message,input,footerAlert,footerPrompt,footerConfirm){
    $App.handleModalDialog();
    $App.customDialog.input.value=null;
    $App.customDialog.content.innerHTML=message;
    $App.customDialog.input.style.display=input;
    $App.customDialog.footerAlert.style.display=footerAlert;
    $App.customDialog.footerPrompt.style.display=footerPrompt;
    $App.customDialog.footerConfirm.style.display=footerConfirm;
    $App.customDialog.backdrop.style.display="";
    $App.customDialog.frame.style.transition="";
    $App.customDialog.frame.style.opacity=0;
    $App.customDialog.frame.style.transition="opacity 0.5s";
    setTimeout(()=>{$App.customDialog.frame.style.opacity=1},10);
  }

  App.alert=async function(message){
    $setupDialog();
    $showDialog(message,"none","","none","none");
    let p=new Promise((resolve,reject)=>{
      $App.customDialog.resolve=resolve;
    });
    let q=await p;
    $App.customDialog.backdrop.style.display="none";
  };

  App.prompt=async function(message){
    $setupDialog();
    $App.customDialog.input.type="text";
    $showDialog(message,"","none","","none");
    let p=new Promise((resolve,reject)=>{
      $App.customDialog.resolve=resolve;
    });
    let q=await p;
    $App.customDialog.backdrop.style.display="none";
    return q;
  };

  App.promptNumber=async function(message){
    $setupDialog();
    $App.customDialog.input.type="number";
    $showDialog(message,"","none","","none");
    let p=new Promise((resolve,reject)=>{
      $App.customDialog.resolve=resolve;
    });
    let q=await p;
    $App.customDialog.backdrop.style.display="none";
    return q;
  };

  App.confirm=async function(message){
    $setupDialog();
    $App.handleModalDialog();
    $showDialog(message,"none","none","none","");
    let p=new Promise((resolve,reject)=>{
      $App.customDialog.resolve=resolve;
    });
    let q=await p;
    $App.customDialog.backdrop.style.display="none";
    return q;
  };

  function $StringFormat(StringClazz,format,object){
    let v=format;
    if(!format) return format;
    let pos=format.indexOf("%s");
    if(pos>=0){
      return format.substring(0,pos)+object+format.substring(pos+2);
    }
    let m=/%.(\d+)f/.exec(format);
    if(m){
      let z=object*1;
      if(isNaN(z)){
        return format;
      }
      z=z.toFixed(m[1]*1);
      return format.replace("%."+m[1]+"f",z);
    }
    
    return format;
  }

  function $StringReplaceAll(string,s,r){
    var regexp=new RegExp(s,"g");
    return string.replace(regexp,r);
  }
  
  function $StringReplaceFirst(string,s,r){
    var regexp=new RegExp(s);
    return string.replace(regexp,r);
  }

  function $StringSplit(string,regexp,limit){
    var r=new RegExp(regexp);
    var s=string.split(r,limit);
    var a=new $App.Array("String",s.length,s);
    return a;
  }

  function $StringContains(string,string2){
    return string.indexOf(string2)>=0;
  }

  function $StringApplyRegExp(string,regexp,flags){
    if(!flags) flags="";
    try{
      var r=new RegExp(regexp,flags);
    }catch(e){

    }
    var res=r.exec(string);
    if(res){
      return res;
    }else{
      return null;
    }
  }

  function $StringCompareTo(string1,string2){
    var l1=string1.length;
    var l2=string2.length;
    for(var i=0;i<l1;i++){
      if(i>=l2){
        return l1-l2;
      }
      var c1=string1.codePointAt(i);
      var c2=string2.codePointAt(i);
      if(c1!==c2){
        return c1-c2;
      }
    }
    return l2-l1;
  }

  function $StringCompareToIgnoreCase(string1,string2){
    return $StringCompareTo(string1.toLowerCase(),string2.toLowerCase());
  }

  function $StringEquals(string1,string2){
    return string1===string2;
  }

  function $StringEqualsIgnoreCase(string1,string2){
    return $StringEquals(string1.toLowerCase(),string2.toLowerCase());
  }

  function $StringMatches(string,regexp){
    var r=new RegExp(regexp);
    return r.test(string);
  }

  function onAction(element){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onAction){
      $main.onAction(element.component);
    }
  }

  function onNextFrame(){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onNextFrame){
      $main.onNextFrame();
    }else{
      delete window.onNextFrame;
    }
  }

  function onMouseDown(){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onMouseDown){
      $main.onMouseDown();
    }
  }

  function onMouseUp(){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onMouseUp){
      $main.onMouseUp();
    }
  }

  function onMouseMove(){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onMouseMove){
      $main.onMouseMove();
    }
  }

  function onTimeout(name){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onTimeout){
      $main.onTimeout(name);
    }
  }
  
  function onGamepadDown(button){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onGamepadDown){
      $main.onGamepadDown(button);
    }
  }

  function onGamepadUp(){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onGamepadUp){
      $main.onGamepadUp();
    }
  }

  window.onTileDraw=async function onTileDraw(x,y,type){
    if($main && $main.onTileDraw){
      await $main.onTileDraw(x,y,type);
    }else{
      delete window.onTileDraw;
    }
  }

  window.onMessage=function onMessage(sender,message){
    if($main && $main.onMessage){
      $main.onMessage(sender,message);
    }else{
      delete window.onMessage;
    }
  }

  App.gamepad.setA=function(keycode){
    this.A=keycode;
  }
  App.gamepad.setB=function(keycode){
    this.B=keycode;
  }
  App.gamepad.setX=function(keycode){
    this.X=keycode;
  }
  App.gamepad.setY=function(keycode){
    this.Y=keycode;
  }
  App.gamepad.setE=function(keycode){
    this.E=keycode;
  }
  App.gamepad.setF=function(keycode){
    this.F=keycode;
  }
  App.gamepad.setUp=function(keycode){
    this.up=keycode;
  }
  App.gamepad.setDown=function(keycode){
    this.down=keycode;
  }
  App.gamepad.setLeft=function(keycode){
    this.left=keycode;
  }
  App.gamepad.setRight=function(keycode){
    this.right=keycode;
  }

  class PrintStream{
    println(text){
      console.log(text);
    }
  }

  class System{
    static out=new PrintStream();
    constructor(){
    }
  }

  class JComponent{
    constructor(x,y,width,height){
      this.x=x;
      this.y=y;
      this.width=width;
      this.height=height;
      this.$el=null;
      this.actionCommand="";
      this.actionObject=null;
    }
    setActionCommand(ac){
      this.actionCommand=ac;
    }
    getActionCommand(){
      return this.actionCommand;
    }
    setActionObject(object){
      this.actionObject=object;
    }
    getActionObject(){
      return this.actionObject;
    }
    collides(comp){
      let r1=this.$el.getBoundingClientRect();
      let r2=comp.$el.getBoundingClientRect();
      return !(r1.left+r1.width<r2.left || r2.left+r2.width<r1.left || r1.top+r1.height<r2.top || r2.top+r2.height<r1.top);
    }
    show(){
      this.setVisible(true);
    }
    hide(){
      this.setVisible(false);
    }
    setVisible(v){
      this.visible=v;
      this.$el.visible=v;
    }
    isVisible(){
      return this.$el.visible;
    }
    setEnabled(v){
      this.$el.disabled=!v;
    }
    isEnabled(){
      return this.$el.disabled;
    }
    setValue(v){
      this.value=v;
      this.$el.value=v;
    }
    getValue(){
      return this.$el.value;
    }
    setX(v){
      this.x=v;
      this.$el.cx=v;
    }
    getX(){
      return this.$el.cx;
    }
    changeX(dx){
      this.setX(this.getX()+dx);
    }
    changeY(dy){
      this.setY(this.getY()+dy);
    }
    setY(v){
      this.y=v;
      this.$el.cy=v;
    }
    getY(){
      return this.$el.cy;
    }
    setWidth(v){
      this.width=v;
      this.$el.width=v;
    }
    getWidth(){
      return this.$el.width;
    }
    setHeight(v){
      this.height=v;
      this.$el.height=v;
    }
    getHeight(){
      return this.$el.height;
    }
    changeWidth(dw){
      this.setWidth(this.getWidth()+dw);
    }
    changeHeight(dh){
      this.setHeight(this.getHeight()+dh);
    }
    getStyle(name){
      return this.$el.style[name];
    }
    setStyle(name, value){
      this.$el.style[name]=value;
    }
    setCSS(css){
      this.$el.style=css;
    }
    setCSSClass(className){
      this.$el.className=className;
    }
    getCSSClass(){
      return this.$el.className;
    }
    setAlign(a){
      this.$el.align=a;
    }
    setAlignContent(a){
      this.$el.alignContent=a;
    }
    getPanel(){
      let p=this.$el.parentNode;
      if(p && p.component){
        return p.component;
      }else{
        return null;
      }
    }
    getIndex(){
      let p=this.getPanel();
      if(p && p.getIndexOf){
        return p.getIndexOf(this);
      }else{
        return -1;
      }
    }
    getRow(){
      let p=this.getPanel();
      if(p && p.getRowOf){
        return p.getRowOf(this);
      }else{
        return -1;
      }
    }
    getColumn(){
      let p=this.getPanel();
      if(p && p.getColumnOf){
        return p.getColumnOf(this);
      }else{
        return -1;
      }
    }
  }

  class HTMLElement extends JComponent{
    constructor(element){
      super(0,0,0,0);
      this.$el=element;
      this.$lastDisplayValue=this.$el.style.display;;
    }
    getValue(){
      if(!this.$el) return null;
      if('selectedIndex' in this.$el){
        return this.$el.selectedIndex;
      }else if('checked' in this.$el){
        return this.$el.checked; 
      }else if('value' in this.$el){
        return this.$el.value;
      }
      return this.$el.innerHTML;
    }
    setValue(v){
      if(!this.$el) return;
      if('selectedIndex' in this.$el){
        this.$el.selectedIndex=v;
      }else if('checked' in this.$el){
        this.$el.checked=v;
      }else if('value' in this.$el){
        this.$el.value=v;
      }else{
        this.$el.innerHTML=v;
      }
    }
    setVisible(v){
      if(!v){
        this.$lastDisplayValue=this.$el.style.display;
        this.$el.style.display="none";
      }else{
        this.$el.style.display=this.$lastDisplayValue;
      }
    }
    isVisible(){
      return this.$el.style.display!=="none";
    }
  }

  class UIControlStatement{
    constructor(type){
      this.type=type;
      this.$el=document.createElement("span");
      this.$el.style.display="none";
      this.$el.component=this;
      this.$el.appJSData={};
      this.attachedComponents=[];
    }
    prepareForUpdate(){
      this.removeAll();
      window.$insertPosition=$getIndexOfComponentInParent(this.$el)+1;
    }
    attachComponent(c){
      this.attachedComponents.push(c);
    }
    removeAll(){
      for(var i=0;i<this.attachedComponents.length;i++){
        var parent=this.attachedComponents[i].$el.parentNode;
        parent.removeChild(this.attachedComponents[i].$el);
      }
      this.attachedComponents=[];
    }
  }

  class JButton extends JComponent{
    constructor(label,x,y,width,height){
      super(x,y,width,height);
      this.$el=ui.button(label,x,y,width,height);
      this.$el.component=this;
    }
  }

  class JImage extends JComponent{
    constructor(url,x,y,width,height){
      super(x,y,width,height);
      this.$el=ui.image(url,x,y,width,height);
      this.$el.component=this;
    }
  }

  class JPanel extends JComponent{
    constructor(template,x,y,width,height){
      super(x,y,width,height);
      this.template=template;
      this.$el=ui.panel(template,x,y,width,height);
      this.$el.component=this;
    }
    add(comp,index){
      this.$el.add(comp.$el,index);
    }
    remove(comp){
      try{
        this.$el.removeChild(comp.$el);
      }catch(e){
        return false;
      }
      return true;
    }
    removeAll(){
      if(this.$el.replaceChildren){
        this.$el.replaceChildren();
      }else{
        this.$el.innerHTML="";
      }
    }
    getChildCount(){
      let count=0;
      let n=this.$el.children.length;
      for(let i=0;i<n;i++){
        let c=this.$el.children[i];
        if(c.component && !(c.component instanceof UIControlStatement)){
          count++;
        }
      }
      return count;
    }
    getChild(index){
      let realIndex=-1;
      let n=this.$el.children.length;
      for(let i=0;i<n;i++){
        let c=this.$el.children[i];
        if(c.component && !(c.component instanceof UIControlStatement)){
          realIndex++;
        }
        if(realIndex===index){
          return c.component;
        }
      }
      return null;
      // let el=this.$el.children[index];
      // if(el && el.component){
      //   return el.component;
      // }else{
      //   return null;
      // }
    }
    getChildInGrid(row,col,colCount){
      if(row<0 || col<0) return null;
      if(colCount===undefined){
        colCount=this.getRowAndColumnCount().cols;
      }
      if(col>=colCount) return null;
      return this.getChild(row*colCount+col);
    }
    _getPositionOf(child,rowAndColCount){
      let rc=rowAndColCount? rowAndColCount : this.getRowAndColumnCount();
      for(let i=0;i<rc.rows;i++){
        for(let j=0;j<rc.cols;j++){
          let c=this.getChildInGrid(i,j,rc.cols);
          if(c===child){
            return [i,j];
          }
        }
      }
      return null;
    }
    getIndexOf(child){
      let n=this.getChildCount();
      let index=0;
      for(let i=0;i<n;i++){
        let c=this.getChild(i);
        if(c===child){
          return index;
        }
        if(!(c instanceof UIControlStatement)){
          index++;
        }
      }
      return -1;
    }
    getRowOf(child){
      let rc=this.getRowAndColumnCount();
      let p=this._getPositionOf(child,rc);
      if(p){
        return p[0];
      }else{
        return -1;
      }
    }
    getColumnOf(child){
      let rc=this.getRowAndColumnCount();
      let p=this._getPositionOf(child,rc);
      if(p){
        return p[1];
      }else{
        return -1;
      }
    }
    getRowAndColumnCount(){
      let cs=getComputedStyle(this.$el);
      return {
        rows: cs.getPropertyValue("grid-template-rows").split(" ").length,
        cols: cs.getPropertyValue("grid-template-columns").split(" ").length
      }
    }
    getRowCount(){
      return this.getRowAndColumnCount().rows;
    }
    getColumnCount(){
      return this.getRowAndColumnCount().cols;
    }
  }

  class JLabel extends JComponent{
    constructor(text,x,y,width,height){
      super(x,y,width,height);
      this.$el=ui.label(text,x,y,width,height);
      this.$el.component=this;
    }
  }

  class Canvas extends JPanel{
    constructor(minX,maxX,minY,maxY,x,y,width,height){
      super(x,y,width,height);
      this.$el.parentNode.removeChild(this.$el);
      this.$el=ui.canvas(maxX-minX,maxY-minY,x,y,width,height);
      this.$el.component=this;
      this.setOrigin(-minX,-minY);
    }
    add(comp){
      this.$el.canvas.add(comp.$el);
    }
    save(){
      this.$el.canvas.save();
    }
    restore(){
      this.$el.canvas.restore();
    }
    reset(){
      this.$el.canvas.reset();
    }
    rotate(angle,x,y){
      this.$el.canvas.rotate(angle,x,y);
    }
    translate(x,y){
      this.$el.canvas.translate(x,y);
    }
    shear(sx,sy){
      this.$el.canvas.shear(sx,sy);
    }
    scale(sx,sy,x,y){
      this.$el.canvas.scale(sx,sy,x,y);
    }
    setTransform(m00,m10,m01,m11,m02,m12){
      this.$el.canvas.setTransform(m00,m10,m01,m11,m02,m12);
    }
    redraw(){
      this.$el.canvas.redraw();
    }
    setOrigin(x,y){
      this.$el.canvas.setOrigin(x,y);
    }
    setSize(internalWidth,internalHeight,width,height){
      this.$el.setSize(internalWidth,internalHeight,width,height);
    }

    setMirrored(m){
      this.$el.canvas.setMirrored(m);
    }
    setRotation(angle){
      this.$el.canvas.setRotation(angle);
    }
    setOpacity(o){
      this.$el.canvas.setOpacity(o);
    }
    clear(){
      this.$el.canvas.clear();
    }
    clearRect(cx,cy,w,h){
      this.$el.canvas.clearRect(cx,cy,w,h);
    }
    setFontsize(s){
      this.$el.canvas.setFontsize(s);
    }
    setFont(fontName){
      this.$el.canvas.setFont(fontName);
    }
    setLinewidth(w){
      this.$el.canvas.setLinewidth(w);
    }
    write(text,x,y,align){
      this.$el.canvas.write(text,x,y,align);
    }
    drawCircle(x,y,r){
      this.$el.canvas.drawCircle(x,y,r);
    }
    fillCircle(x,y,r){
      this.$el.canvas.fillCircle(x,y,r);
    }
    drawRect(cx,cy,w,h){
      this.$el.canvas.drawRect(cx,cy,w,h);
    }
    fillRect(cx,cy,w,h){
      this.$el.canvas.fillRect(cx,cy,w,h);
    }
    drawLine(x1,y1,x2,y2){
      this.$el.canvas.drawLine(x1,y1,x2,y2);
    }
    beginPath(x,y){
      this.$el.canvas.beginPath(x,y);
    }
    lineTo(x,y){
      this.$el.canvas.lineTo(x,y);
    }
    closePath(){
      this.$el.canvas.closePath();
    }
    drawPath(){
      this.$el.canvas.drawPath();
    }
    fillPath(){
      this.$el.canvas.fillPath();
    }
    isPointInPath(x,y){
      return this.$el.canvas.isPointInPath(x,y);
    }
    setColor(c){
      this.$el.canvas.setColor(c);
    }
    drawImage(image,cx,cy,w,h,angle,mirrored){
      this.$el.canvas.drawImage(image,cx,cy,w,h,angle,mirrored);
    }
    drawImagePart(image,cx,cy,width,height,scx,scy,swidth,sheight,rotation,mirrored){
      this.$el.canvas.drawImagePart(image,cx,cy,width,height,scx,scy,swidth,sheight,rotation,mirrored);
    }
  }

  class JTextField extends JComponent{
    constructor(type,placeholder,x,y,width,height){
      super(x,y,width,height);
      this.$el=ui.input(type,placeholder,x,y,width,height);
      this.$el.spellcheck=false;
      this.$el.component=this;
    }
    setPlaceholder(text){
      this.$el.placeholder=text;
    }
  }

  class JComboBox extends JComponent{
    constructor(options,x,y,width,height){
      super(x,y,width,height);
      this.$el=ui.select(options.values,x,y,width,height);
      this.$el.component=this;
    }
    getSelectedIndex(){
      return this.$el.selectedIndex;
    }
    setSelectedIndex(index){
      this.$el.selectedIndex=index;
    }
    setOptions(options){
      console.log(options);
      this.$el.options=options.values;
    }
  }

  class JCheckBox extends JComponent{
    constructor(label,x,y,width,height){
      super(x,y,width,height);
      this.$el=ui.input("checkbox",label,x,y,width,height);
      this.$el.component=this;
    }
  }

  class JTextArea extends JComponent{
    constructor(placeholder,x,y,width,height){
      super(x,y,width,height);
      this.$el=ui.textarea(placeholder,x,y,width,height);
      this.$el.spellcheck=false;
      this.$el.component=this;
    }
    setPlaceholder(text){
      this.$el.placeholder=text;
    }
  }

  class DataTable extends JComponent{
    constructor(x,y,width,height){
      super(x,y,width,height);
      this.$el=ui.datatable(null,x,y,width,height);
      this.$el.component=this;
    }
    setArray(array){
      this.$el.array=array;
    }
    getSelectedIndex(){
      return this.$el.selectedIndex;
    }
  }

  class Matrix{
    constructor(rows,cols){
      this.rows=[];
      this.rowCount=rows;
      this.colCount=cols;
      for(let i=0;i<rows;i++){
        let z=[];
        for(let j=0;j<cols;j++){
          z.push(0);
        }
        this.rows.push(z);
      }
    }
    getRowCount(){
      return this.rowCount;
    }
    getColCount(){
      return this.colCount;
    }
    set(r,c,value){
      if(r<1 ||r>this.rowCount){
        throw new Exception("Diese Matrix hat keine "+r+"-te Zeile, sondern nur die Zeilen 1 bis "+this.rowCount+".");
      }
      if(c<1 ||c>this.colCount){
        throw new Exception("Diese Matrix hat keine "+c+"-te Spalte, sondern nur die Spalten 1 bis "+this.colCount+".");
      }
      this.rows[r-1][c-1]=value;
    }
    get(r,c){
      if(r<1 ||r>this.rowCount){
        throw new Exception("Diese Matrix hat keine "+r+"-te Zeile, sondern nur die Zeilen 1 bis "+this.rowCount+".");
      }
      if(c<1 ||c>this.colCount){
        throw new Exception("Diese Matrix hat keine "+c+"-te Spalte, sondern nur die Spalten 1 bis "+this.colCount+".");
      }
      if(!this.rows[r-1]){
        console.log("fehler");
      }
      return this.rows[r-1][c-1];
    }
    getRow(r){
      if(r<1 ||r>this.rowCount){
        throw new Exception("Diese Matrix hat keine "+r+"-te Zeile, sondern nur die Zeilen 1 bis "+this.rowCount+".");
      }
      let array=new $App.Array("double",[this.colCount]);
      let row=this.rows[r-1];
      for(let i=0;i<this.colCount;i++){
        array.set(i,row[i]);
      }
      return row;
    }
    setRow(r,values){
      if(r<1 ||r>this.rowCount){
        throw new Exception("Diese Matrix hat keine "+r+"-te Zeile, sondern nur die Zeilen 1 bis "+this.rowCount+".");
      }
      if(values.length!==this.colCount){
        throw new Exception("Die neue Zeile muss genau "+this.colCount+" Einträge haben. Sie hat aber "+values.length+".");
      }
      let row=this.rows[r-1];
      for(let i=0;i<this.colCount;i++){
        row[i]=values.get(i);
      }
    }
    getColumn(c){
      if(c<1 ||c>this.colCount){
        throw new Exception("Diese Matrix hat keine "+c+"-te Spalte, sondern nur die Spalten 1 bis "+this.colCount+".");
      }
      let col=new $App.Array("double",[this.rowCount]);
      for(let i=0;i<this.rowCount;i++){
        col.set(i,this.rows[i][c-1]);
      }
      return col;
    }
    setColumn(c,values){
      if(c<1 ||c>this.colCount){
        throw new Exception("Diese Matrix hat keine "+c+"-te Spalte, sondern nur die Spalten 1 bis "+this.colCount+".");
      }
      if(values.length!==this.rowCount){
        throw new Exception("Die neue Spalte muss genau "+this.rowCount+" Einträge haben. Sie hat aber "+values.length+".");
      }
      for(let i=0;i<this.rowCount;i++){
        this.rows[i][c-1]=values.get(i);
      }
    }
    multiply(m){
      if(m.rowCount!==this.colCount){
        throw new Exception("Die Matrix hat "+m.rowCount+" Zeilen, sie muss aber "+this.colCount+" Zeilen haben.");
      }
      let res=new Matrix(this.rowCount,m.colCount);
      for(let i=0;i<this.rowCount;i++){
        for(let j=0;j<m.colCount;j++){
          let e=0;
          for(let k=0;k<this.colCount;k++){
            e+=this.rows[i][k]*m.rows[k][j];
          }
          res.rows[i][j]=e;
        }
      }
      return res;
    }
    multiplyVector(v){
      if(v.size!==this.colCount){
        throw new Exception("Der Vektor hat "+v.rowCount+" Zeilen, er muss aber "+this.colCount+" Zeilen haben.");
      }
      let res=new Vector(this.rowCount);
      for(let i=0;i<this.rowCount;i++){
        let e=0;
        let row=this.rows[i];
        for(let k=0;k<this.colCount;k++){
          e+=row[k]*v.components[k];
        }
        res.components[i]=e;
      }
      return res;
    }
    add(m){
      if(m.rowCount!==this.rowCount || m.colCount!==this.colCount){
        throw new Exception("Die Matrix hat "+m.rowCount+" Zeilen und "+m.colCount+" Spalten, sie muss aber "+this.rowCount+" Zeilen und "+this.colCount+" Spalten haben.");
      }
      let res=new Matrix(this.rowCount,this.colCount);
      for(let i=0;i<this.rowCount;i++){
        let row=this.rows[i];
        let row2=m.rows[i];
        for(let j=0;j<this.colCount;j++){
          res.rows[i][j]=row[j]+row2[j];
        }
      }
      return res;
    }
    sub(m){
      if(m.rowCount!==this.rowCount || m.colCount!==this.colCount){
        throw new Exception("Die Matrix hat "+m.rowCount+" Zeilen und "+m.colCount+" Spalten, sie muss aber "+this.rowCount+" Zeilen und "+this.colCount+" Spalten haben.");
      }
      let res=new Matrix(this.rowCount,this.colCount);
      for(let i=0;i<this.rowCount;i++){
        let row=this.rows[i];
        let row2=m.rows[i];
        for(let j=0;j<this.colCount;j++){
          res.rows[i][j]=row[j]-row2[j];
        }
      }
      return res;
    }
    scale(s){
      let res=new Matrix(this.rowCount,this.colCount);
      for(let i=0;i<this.rowCount;i++){
        for(let j=0;j<this.colCount;j++){
          res.rows[i][j]=s*this.rows[i][j];
        }
      }
      return res;
    }
    toString(){
      let t="(";
      for(let i=0;i<this.rowCount;i++){
        if(i>0){
          t+=" | ";
        }
        for(let j=0;j<this.colCount;j++){
          if(j>0) t+=" ";
          t+=this.rows[i][j].toFixed(2);
        }
      }
      t+=")";
      return t;
    }
    lengthSquared(){
      let s=0;
      for(let i=0;i<this.rowCount;i++){
        let row=this.rows[i];
        for(let k=0;k<this.colCount;k++){
          s+=row[k]*row[k];
        }
      }
      return s;
    }
    length(){
      return Math.sqrt(this.lengthSquared());
    }
    getCopy(){
      let M=new Matrix(this.rowCount,this.colCount);
      for(let i=0;i<this.rowCount;i++){
        let row=this.rows[i];
        for(let j=0;j<this.colCount;j++){
          M.rows[i][j]=row[j];
        }
      }
      return M;
    }
  }

  class Vector{
    constructor(size){
      if(size<1){
        throw new Exception("Die Länge des neuen Vektors muss mindestens 1 betragen.");
      }
      this.components=[];
      this.size=size;
      for(let i=0;i<size;i++){
        this.components.push(0);
      }
    }
    getSize(){
      return this.size;
    }
    set(pos,value){
      if(pos<1 || pos>this.size){
        throw new Exception("Vector.set: Position "+pos+" gibt es nicht in einem Vektor der Länge "+this.size+".");
      }
      this.components[pos-1]=value;
    }
    get(pos){
      if(pos<1 || pos>this.size){
        throw new Exception("Vector.get: Position "+pos+" gibt es nicht in einem Vektor der Länge "+this.size+".");
      }
      return this.components[pos-1];
    }
    getAsArray(){
      let array=new $App.Array("double",[this.size]);
      for(let i=0;i<this.size;i++){
        array.set(i,this.components[i]);
      }
      return array;
    }
    setFromArray(array){
      if(array.length!==this.size){
        throw new Exception("Das Array hat "+array.length+" Einträge, er muss aber "+this.size+" Einträge haben.");
      }
      for(let i=0;i<array.length;i++){
        this.components[i]=array.get(i);
      }
    }
    toString(){
      let t="[";
      for(let i=0;i<this.size;i++){
        if(i>0){
          t+=" ";
        }
        t+=this.components[i].toFixed(2);
      }
      t+="]";
      return t;
    }
    scale(s){
      let res=new Vector(this.size);
      for(let i=0;i<this.size;i++){
        res.components[i]=this.components[i]*s;
      }
      return res;
    }
    add(v){
      if(v.size!==this.size){
        throw new Exception("Der Vektor hat "+v.size+" Zeilen, er muss aber "+this.size+" Zeilen haben.");
      }
      let res=new Vector(this.size);
      for(let i=0;i<this.size;i++){
        res.components[i]=this.components[i]+v.components[i];
      }
      return res;
    }
    sub(v){
      if(v.size!==this.size){
        throw new Exception("Der Vektor hat "+v.size+" Zeilen, er muss aber "+this.size+" Zeilen haben.");
      }
      let res=new Vector(this.size);
      for(let i=0;i<this.size;i++){
        res.components[i]=this.components[i]-v.components[i];
      }
      return res;
    }
    lengthSquared(){
      let s=0;
      for(let i=0;i<this.size;i++){
        s+=this.components[i]*this.components[i];
      }
      return s;
    }
    length(){
      return Math.sqrt(this.lengthSquared());
    }
    getCopy(){
      let v=new Vector(this.size);
      for(let i=0;i<this.size;i++){
        v.components[i]=this.components[i];
      }
      return v;
    }
  }

  class Database{
    constructor(){

    }
    prepareStatement(sqlSource){
      /**muss kopiert werden in additionalJScode! */
      let ast=alasql.parse(sqlSource);
      /**untersucht die statements darauf, ob mehr als eine Tabelle abgefragt wird
       * falls ja, werden alle mehrfach vorkommenden Spaltennamen per 'as' in 'Tabelle.Spalte' umbenannt
       * Sinn: doppelt vorkommende Spaltennamen kollabieren ansonsten
       * damit StringValue erzeugt werden kann, musste in alasql.min.ja folgender Code eingefügt werden:
       * window.alasqlX=X;
       * an der Stelle:
       * X=(T.Recordset=function(e){q(this,e)},y.yy=T.yy={});window.alasqlX=X;X.extend=
       */
      for(let i=0;i<ast.statements.length;i++){
        let s=ast.statements[i];
        if(!s.columns || !s.from || s.from.length===0) continue;
        let tables={};
        for(let j=0;j<s.from.length;j++){
          let t=s.from[j];
          let label=t.as? t.as:t.tableid;
          tables[label]=t.tableid;
        }
        /**spezialfall 'select *': * durch alle Spalten ersetzen: */
        if(s.columns.length===1 && s.columns[0].columnid==='*'){
          let spalten=[];
          for(let j=0;j<s.from.length;j++){
            let t=s.from[j];
            let label=t.as? t.as:t.tableid;
            let table=alasql.tables[t.tableid];
            if(!table) continue;
            for(let k=0;k<table.columns.length;k++){
              let c=table.columns[k];
              let spalte=label+"."+c.columnid;
              spalten.push({
                spalte, columnid: c.columnid, tableid: label
              });
            }
          }
          for(let j=0;j<spalten.length;j++){
            let spalte=spalten[j];
            s.columns[j]=new alasqlX.Column({columnid: spalte.columnid, tableid: spalte.tableid});
          }
        }
        /**finde doppelte spalten: */
        for(let j=0;j<s.columns.length;j++){
          let c=s.columns[j];
          if(c.as) continue;
          let changeC=false;
          for(let k=j+1;k<s.columns.length;k++){
            let c2=s.columns[k];
            if(c2.as) continue;
            if(c2.columnid===c.columnid){
              changeC=true;
              let tableid=tables[c2.tableid];
              c2.as=new window.alasqlX.StringValue({value: tableid+"."+c2.columnid});
            }
          }
          if(changeC){
            let tableid=tables[c.tableid];
            c.as=new window.alasqlX.StringValue({value: tableid+"."+c.columnid});
          }
        }
      }
      return ast.toString();
    }
    query(sqlSource){
      try{
        let prep;
        if(sqlSource.trim().toLowerCase().startsWith("insert")){
          prep=sqlSource;
        }else{
          prep=this.prepareStatement(sqlSource);
        }
        var r=alasql(prep);
        return r;
      }catch(e){
        console.log(e.message);
        throw e;
      }
    }
    sql(cmd){
      try{
        var result=this.query(cmd);
        var records=[];
        if(result){
          for(var i=0;i<result.length;i++){
            var r=new Record(result[i]);
            records.push(r);
          }
        }
        var a=new $App.Array("Record",records.length,records);
        return a;
      }catch(e){
        return null;
      }
    }
    sqlError(cmd){
      try{
        alasql(cmd);
        return null;
      }catch(e){
        return e.message;
      }
    }
    areResultsEqualIgnoreOrder(array1,array2){
      if(!array1 || !array2) return false;
      if(array1.values.length===0){
        if(array2.values.length===0){
          return true;
        }else{
          return false;
        }
      }else{
        if(array2.values.length===0 || array2.values.length!==array1.values.length){
          return false;
        }
      }
      var r1=array1.values[0];
      var r2=array2.values[0];
      var attributes=[];
      var sortFunc=(r,s)=>{
        for(var attr in r1.$data){
          if(r.$data[attr]<s.$data[attr]){
            return -1;
          }else if(r.$data[attr]>s.$data[attr]){
            return 1;
          }
        }
        return -1;
      };
      array1.values.sort(sortFunc);
      array2.values.sort(sortFunc);
      return this.areResultsEqual(array1,array2);
    }
    areResultsEqual(array1,array2){
      if(!array1 || !array2) return false;
      if(array1.length!==array2.length){
        return false;
      }
      if(array1.length===0){
        return true;
      }
      var n1=0;
      var r1=array1.values[0];
      for(var a in r1){
        n1++;
      }
      var r2=array2.values[0];
      var n2=0;
      for(var a in r2){
        n2++;
      }
      if(n1!==n2) return false;
      for(var i=0;i<n1;i++){
        var r1=array1.values[i];
        var s1=0;
        for(var a in r1.$data){
          s1++;
        }
        var s2=0;
        for(var a in r2.$data){
          s2++;
        }
        if(s1!==s2) return false;
        var r2=array2.values[i];
        for(var a in r1.$data){
          if(a in r2.$data){
            if(r1.$data[a]!==r2.$data[a]) return false;
          }else{
            return false;
          }
        }
      }
      return true;
    }
  }

  class Record{
    constructor($data){
      this.$data=$data;
    }
    get(attribute){
      return this.$data[attribute.toLowerCase()];
    }
  }

  function $clearAlaSQL(){
    var tables=Object.keys(alasql.tables);
    if(tables){
      for(var i=0;i<tables.length;i++){
        var c="drop table "+tables[i];
        try{
          alasql(c);
        }catch(e){
          console.log(e);
        }
      }
    }
  }

  class Exception{
    constructor(text){
      this.text=text;
    }
  }

  class Pattern{
    static CASE_INSENSITIVITY=1;
    static MULTI_LINE=2;
    static DOT_ALL=4;
    constructor(regex, flags){
      if(!flags){
        flags=0;
      }
      this._regex=regex;
      this._flags=flags;
      let flagInfos=["i","m","s"];
      let index=0;
      this._jsFlags="";
      while(flags>0 && index<flagInfos.length){
        if(flags%2 === 1){
          this._jsFlags+=flagInfos[index];
          flags=(flags-1)/2;
        }else{
          flags=flags/2;
        }
        index++;
      }
      this._jsRegexp=new RegExp(regex,this._jsFlags);
      this._jsRegexpGlobal=new RegExp(regex,this._jsFlags+"g");
    }
    static compile(regex, flags){
      let p=new Pattern(regex, flags);
      return p;
    }
    flags(){
      return this._flags;
    }
    pattern(){
      return this._regex;
    }
    split(input){
      return input.split(this._jsRegexp);
    }
    matcher(input){
      return new Matcher(this,input)
    }
  }

  class Matcher{
    constructor(pattern,input){
      this.usePattern(pattern);
      this.reset(input);
    }
    find(start){
      let text=this._input;
      if(start!==undefined){
        this.reset(this._input);
        text=text.substring(start);
      }else{
        start=0;
      }
      this._findOffset=start;
      this._groups=this._regexpGlobal.exec(text);
      return (this._groups!==null);
    }
    group(group){
      if(!group) group=0;
      if(group<0 || !this._groups || group>=this._groups.length){
        throw new Exception("Index außerhalb der Array-Grenzen");
      }
      return this._groups[group];
    }
    groupCount(){
      return this._groupCount;
    }
    hitEnd(){

    }
    matches(){
      let lastIndex=this._regexpGlobal.lastIndex;
      this._regexpGlobal.lastIndex=0;
      let b=this.find();
      this._regexpGlobal.lastIndex=lastIndex;
      if(!b){
        return false;
      }
      if(this._groups[0].length===this._input.length){
        return true;
      }else{
        return false;
      }
    }
    pattern(){
      return this._pattern;
    }
    region(start,end){

    }
    regionStart(){

    }
    regionEnd(){

    }
    replaceAll(replacement){
      return this._input.replace(this._pattern._jsRegexpGlobal,replacement);
    }
    replaceFirst(replacement){
      return this._input.replace(this._pattern._jsRegexp,replacement);
    }
    requiresEnd(){

    }
    reset(input){
      this._input=input;
      this._regionStart=-1;
      this._regionEnd=-1;
      this._findOffset=0;
      this._regexp.lastIndex=0;
      this._regexpGlobal.lastIndex=0;
    }
    _bounds(group){
      if(!group){
        group=0;
      }
      if(!this._groups || group>=this._groups.length){
        throw new Exception("Diese Gruppe gibt es nicht.");
      }
      group=this._groups[group];
      let all=this._groups[0];
      let pos=all.indexOf(group);
      let start=this._groups.index+pos+this._findOffset;
      let end=start+group.length;
      return [start,end];
    }
    start(group){
      return this._bounds(group)[0];
    }
    end(group){
      return this._bounds(group)[1];
    }
    usePattern(pattern){
      this._pattern=pattern;
      this._regexp=new RegExp(pattern._regex,pattern._jsFlags);
      this._regexpGlobal=new RegExp(pattern._regex,pattern._jsFlags+"g");
      this._groupCount=(new RegExp(pattern._regex+"|")).exec('').length-1;
    }
  }

  class ArrayList{
    constructor(typeArguments,initialCapacity){
      this.$elementType=typeArguments["T"];
      if(initialCapacity===undefined){
        initialCapacity=10;
      }
      this.capacity=initialCapacity;
      this.elements=[];
      this.$size=0;
    }
    $isIndexOutOfBounds(index){
      return (index<0 || index>this.$size);
    }
    $getIndexOutOfBoundsException(index){
      return new Exception("IndexOutOfBoundsException: Der Index "+index+" liegt außerhalb der Grenzen von 0 bis "+this.$size+".");
    }
    $grow(){
      if(this.$size>=this.capacity){
        this.capacity*=2;
        return true;
      }
      return false;
    }
    add(index,element){
      if(element===undefined){
        this.elements.push(index);
      }else{
        if(this.$isIndexOutOfBounds(index)){
          throw this.$getIndexOutOfBoundsException(index);
        }
        this.elements.splice(index,0,element);
      }
      this.$size++;
      this.$grow();
      return true;
    }
    remove(index){
      if(typeof index===this.$elementType.name){
        index=this.elements.indexOf(index);
        if(index<0){
          return false;
        }
      }else{
        if(this.$isIndexOutOfBounds(index)){
          throw this.$getIndexOutOfBoundsException(index);
        }
      }
      this.elements.splice(index,1);
      return true;
    }
    clear(){
      this.elements=[];
      this.$size=0;
    }
    addAll(index,collection){
      let append=false;
      if(collection===undefined){
        collection=index;
        append=true;
      }
      if(collection===null){
        throw new Exception("NullPointerException: Die übergebene Kollektion ist null.");
      }
      if(collection.elements.length===0) return false;
      this.$size+=collection.elements.length;
      if(append){
        this.elements=this.elements.concat(collection.elements);
      }else{
        this.elements.splice.apply(this.elements,[index,0].concat(collection.elements));
      }
      while(this.$grow()){};
      return true;
    }
    get(index){
      if(this.$isIndexOutOfBounds(index)){
        throw this.$getIndexOutOfBoundsException(index);
      }
      return this.elements[index];
    }
    set(index,element){
      if(this.$isIndexOutOfBounds(index)){
        throw this.$getIndexOutOfBoundsException(index);
      }
      this.elements[index]=element;
    }
    toArray(){
      let array=[];
      for(let i=0;i<this.$size;i++){
        array.push(this.elements[i]);
      }
      return new $App.Array(this.$elementType,1,array);
    }
    size(){
      return this.$size;
    }
    isEmpty(){
      return this.$size===0;
    }
    contains(element){
      return (this.indexOf(element)>=0);
    }
    indexOf(element){
      return this.elements.indexOf(element);
    }
    lastIndexOf(element){
      return this.elements.lastIndexOf(element);
    }
    removeRange(fromIndex,toIndex){
      if(this.$isIndexOutOfBounds(fromIndex)){
        throw this.$getIndexOutOfBoundsException(fromIndex);
      }
      if(this.$isIndexOutOfBounds(toIndex)){
        throw this.$getIndexOutOfBoundsException(toIndex);
      }
      if(fromIndex>toIndex){
        throw new Exception("IndexOutOfBoundsException: Der erste Index darf nicht größer sein als der zweite.");
      }
      this.elements.splice(fromIndex,toIndex-fromIndex);
      this.$size-=toIndex-fromIndex;
    }
    removeAll(collection){
      let changed=false;
      for(let i=0;i<this.elements.length;i++){
        let e=this.elements[i];
        if(collection.contains(e)){
          this.elements.splice(i,1);
          changed=true;
          this.$size--;
          i--;
        }
      }
      return changed;
    }
    sort(comparator){
      this.elements.sort(comparator);
    }
  }
}