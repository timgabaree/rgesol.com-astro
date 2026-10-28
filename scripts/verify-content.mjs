import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const source=new URL('../../rgesol.com/',import.meta.url);
const text=html=>{
 const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
 assert.ok(main,'Expected main content in source response');
 return parse(main[1].replace(/<!--[^]*?-->/g,'').replace(/<[^>]*>/g,' ')).textContent.replace(/\s+/g,' ').trim();
};
const results=[];
await mkdir(new URL('.local/',root),{recursive:true});
for(const name of ['index','about','contact','privacy','thank-you']){
 const local=execFileSync('/opt/homebrew/bin/php',['-r',`$_SERVER['REQUEST_METHOD']='GET';$_SERVER['HTTP_HOST']='rgesol.com';$_SERVER['REQUEST_URI']='/${name==='index'?'':name}';require '${fileURLToPath(new URL(name+'.php',source))}';`],{encoding:'utf8'});
 const built=await readFile(new URL('dist/'+name+'.html',root),'utf8');
 const liveResponse=await fetch('https://rgesol.com/'+(name==='index'?'':name));
 assert.equal(liveResponse.status,200);
 const live=await liveResponse.text();
 const baselineText=text(local),builtText=text(built);
 for(const [kind,html] of [['local',local],['live',live]]) {
   await writeFile(new URL(`.local/${name}-${kind}-text.txt`,root),text(html).replace(/([.!?])\s+/g,'$1\n')+'\n');
 }
 if(['index','about','thank-you'].includes(name)) assert.equal(builtText,baselineText,name+' visible main-content parity');
 const doc=parse(built);
 for(const img of doc.querySelectorAll('img'))assert.ok(img.hasAttribute('alt'),name+' missing alt');
 assert.equal(doc.querySelectorAll('h1').length,1,name+' one h1');
 const ids=doc.querySelectorAll('[id]').map(e=>e.getAttribute('id')); assert.equal(ids.length,new Set(ids).size,name+' unique IDs');
 results.push({page:name,liveMatchesLocalText:text(live)===baselineText,astroMatchesLocalText:builtText===baselineText,approvedDifferences:name==='privacy'?'Updated providers and privacy controls':name==='contact'?'Secure form and no-JavaScript email fallback':null,liveGoogleIds:[...new Set(live.match(/G-[A-Z0-9]{7,}/g)||[])],cloudflareBeacon:live.match(/data-cf-beacon='([^']+)'/)?.[1]??null});
}
await mkdir(new URL('.local/',root),{recursive:true});
await writeFile(new URL('.local/content-comparison.json',root),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results,null,2));
