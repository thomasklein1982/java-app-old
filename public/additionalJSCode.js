
function additionalJSCode(){
  function $u(v){if(v===undefined){throw {message: "Undefinierter Wert."}} return v;}
  function $v(v){if(Number.isNaN(v*1)){throw {message: "'"+v+"' ist keine Zahl."}}else{return v*1;}}
  function $i(v){if(Number.isNaN(v*1)){throw {message: "'"+v+"' ist keine Zahl."}}else{v*=1; return v>=0? Math.floor(v):Math.ceil(v);}}
  function $n(a){return a;}
  Object.defineProperty(String.prototype,'len',{value: function(){return this.length;}, writeable: false});

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
    return string.split(r,limit);
  }

  function $StringContains(string,string2){
    return string.indexOf(string2)>=0;
  }

  function $StringApplyRegexp(string,regexp,flags){
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
    if($main && $main.onAction){
      $main.onAction(element.component);
    }
  }

  function onNextFrame(){
    if($main && $main.onNextFrame){
      $main.onNextFrame();
    }else{
      delete window.onNextFrame;
    }
  }

  function onMouseDown(){
    if($main && $main.onMouseDown){
      $main.onMouseDown();
    }
  }

  function onMouseUp(){
    if($main && $main.onMouseUp){
      $main.onMouseUp();
    }
  }

  function onMouseMove(){
    if($main && $main.onMouseMove){
      $main.onMouseMove();
    }
  }

  function onTimeout(name){
    if($main && $main.onTimeout){
      $main.onTimeout(name);
    }
  }
  
  function onGamepadDown(button){
    if($main && $main.onGamepadDown){
      $main.onGamepadDown(button);
    }
  }

  function onGamepadUp(){
    if($main && $main.onGamepadUp){
      $main.onGamepadUp();
    }
  }

  window.onTileDraw=function onTileDraw(x,y,type){
    if($main && $main.onTileDraw){
      $main.onTileDraw(x,y,type);
    }else{
      delete window.onTileDraw;
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

  class JComponent{
    constructor(x,y,width,height){
      this.x=x;
      this.y=y;
      this.width=width;
      this.height=height;
      this.$el=null;
      this.standardDisplayValue=null;
    }
    setVisible(v){
      this.visible=v;
    }
    isVisible(){
      return this.visible;
    }
    setEnabled(v){
      this.$el.disabled=!v;
    }
    isEnabled(){
      return this.$el.disabled;
    }
    get visible(){
      return this.$el.visible;
    }
    set visible(v){
      this.$el.visible=v;
    }
    setValue(v){
      this.value=v;
    }
    getValue(){
      return this.value;
    }
    get value(){
      return this.$el.value+"";
    }
    set value(label){
      this.$el.value=label;
    }
    setX(v){
      this.$el.cx=v;
    }
    getX(){
      return this.$el.cx;
    }
    setY(v){
      this.$el.cy=v;
    }
    getY(){
      return this.$el.cy;
    }
    setWidth(v){
      this.$el.width=v;
    }
    getWidth(){
      return this.$el.width;
    }
    setHeight(v){
      this.$el.height=v;
    }
    getHeight(){
      return this.$el.height;
    }
    getStyle(name){
      return this.$el.style[name];
    }
    setStyle(name, value){
      this.$el.style[name]=value;
    }
    setAlign(a){
      this.$el.align=a;
    }
    setAlignContent(a){
      this.$el.alignContent=a;
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
      this.$el=ui.panel(template,x,y,width,height);
      this.$el.component=this;
    }
    add(comp){
      this.$el.add(comp.$el);
    }
    remove(comp){
      this.$el.remove(comp.$el);
    }
  }

  class JLabel extends JComponent{
    constructor(text,x,y,width,height){
      super(x,y,width,height);
      this.$el=ui.label(text,x,y,width,height);
      this.$el.component=this;
    }
  }

  class JTextField extends JComponent{
    constructor(type,placeholder,x,y,width,height){
      super(x,y,width,height);
      this.$el=ui.input(type,placeholder,x,y,width,height);
      this.$el.component=this;
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
      this.$el.component=this;
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
  }

  class Database{
    constructor(){

    }
    sql(cmd){
      try{
        var result=alasql(cmd);
        var records=[];
        if(result){
          for(var i=0;i<result.length;i++){
            var r=new Record(result[i]);
            records.push(r);
          }
        }
        return records;
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
    areResultsEqual(array1,array2){
      if(!array1 || !array2) return false;
      if(array1.length!==array2.length){
        return false;
      }
      if(array1.length===0){
        return true;
      }
      var n1=0;
      var r1=array1[0];
      for(var a in r1){
        n1++;
      }
      var r2=array2[0];
      var n2=0;
      for(var a in r2){
        n2++;
      }
      if(n1!==n2) return false;
      for(var i=0;i<n1;i++){
        var r1=array1[i];
        var s1=0;
        for(var a in r1.$data){
          s1++;
        }
        var s2=0;
        for(var a in r2.$data){
          s2++;
        }
        if(s1!==s2) return false;
        var r2=array2[i];
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
      return this.$data[attribute];
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
}