async function a(a,t,e=(()=>!1)){do{if(await a(),await e())break;const i="number"==typeof t?t:t();await new Promise((a=>setTimeout(a,Math.max(0,i))))}while(!await e())}export{a as poll};
