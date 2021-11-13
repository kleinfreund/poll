async function a(a,i,t=(()=>!1)){i=Math.max(0,i);do{if(await a(),await t())break;await new Promise((a=>setTimeout(a,i)))}while(!await t())}export{a as poll};
