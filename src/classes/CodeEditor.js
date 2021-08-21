import {Clazz} from "./Clazz"

export class CodeEditor{
  constructor(editor){
    this.errors=[];
    this.clazz=null;
    this.editor=editor;
  }
  
  setVisible(v){
    this.editor.$element.style.display=v? "block" : "none";
  }

  setClazz(c){
    this.clazz=c;
    var old=this.editor.state.doc.toString();
    this.editor.dispatch({
      changes: {from: 0, to: old.length, insert: c.src}
    });
  }

  update(viewUpdate){
    if(app && app.$refs && app.$refs.app && app.$refs.app.$refs.editor){
      this.errors=[];
      var state=viewUpdate.state;
      var src=state.doc.toString();
      var editor=app.$refs.app.$refs.editor;
      editor.currentClazz.setSrcTreeAndState(src,state);
      this.errors=editor.currentClazz.compile();
      console.log(editor.currentClazz.toString());
      console.log(this.errors);
    }
    
  }
}