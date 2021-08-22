import {EditorState, EditorView} from "@codemirror/basic-setup"
import {java} from "@codemirror/lang-java"

const offscreenEditor=new EditorView({
  state: EditorState.create({
    doc: "",
    extensions: [
      EditorView.updateListener.of((viewUpdate) => {
        parsingDone(viewUpdate);
      }),
      java()
    ]
  })
});
offscreenEditor.textLength=0;

let parsingResolve;
export async function parseJava(src){
  var p=new Promise(function(resolve,reject){
    parsingResolve=resolve;
    offscreenEditor.dispatch({
      changes: {from: 0, to: offscreenEditor.textLength, insert: src}
    });
  });
  let viewUpdate=await p;
  offscreenEditor.textLength=src.length;
  return viewUpdate;
}

function parsingDone(viewUpdate){
  if(!parsingResolve) return;
  parsingResolve(viewUpdate);
}