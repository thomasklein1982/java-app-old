let start="<!--Project Code Start";
let stop="Project Code Stop-->";



export function createAppCode(project){
  let save=project.toSaveString();
  let src=;
  var c=`<!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body>
      `+src+`
      <!--
      `+start+"\n"+save+"\n"+stop+`
      -->
    </body>
  </html>`;
  return c;
}

export function extractProjectCodeFromAppCode(appcode){
  var pos=appcode.indexOf(start);
  if(pos<0) return null;
  var pos2=appcode.indexOf(stop,pos);
  if(pos2<0) return null;
  var pc=appcode.substring(pos+start.length,pos2);
  return pc;
}