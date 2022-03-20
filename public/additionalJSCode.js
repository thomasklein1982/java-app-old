function additionalJSCode(){
  function $u(v){if(v===undefined){throw {message: "Undefinierter Wert."}} return v;}
  function $v(v){if(Number.isNaN(v*1)){throw {message: "'"+v+"' ist keine Zahl."}}else{return v*1;}}
  function $i(v){if(Number.isNaN(v*1)){throw {message: "'"+v+"' ist keine Zahl."}}else{v*=1; return v>=0? Math.floor(v):Math.ceil(v);}}
  function $n(a){return a;}
  Object.defineProperty(String.prototype,'len',{value: function(){return this.length;}, writeable: false});

  function onAction(element){
    if($main && $main.onAction){
      $main.onAction(element.component);
    }
  }

  function onNextFrame(){
    if($main && $main.onNextFrame){
      $main.onNextFrame();
    }
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
    getX(){
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

  class Datatable extends JComponent{
    constructor(array,x,y,width,height){
      super(x,y,width,height);
      this.$el=ui.datatable(array,x,y,width,height);
      this.$el.component=this;
    }
  }
}