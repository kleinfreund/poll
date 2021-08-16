async function a(a,e,i=(()=>!1)){e=Math.max(0,e);do{if(await a(),i())break;await new Promise((a=>setTimeout(a,e)))}while(!i())}export{a as poll};
