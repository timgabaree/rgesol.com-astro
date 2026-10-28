import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {parse} from 'node-html-parser';

const root=new URL('../dist-production/',import.meta.url);
const routes=['/','/about','/contact','/privacy','/sitemap','/thank-you','/404'];
const documents=new Map();
let checks=0;
for(const route of routes){
 const html=await readFile(new URL(route==='/'?'index.html':route.slice(1)+'.html',root),'utf8');
 const doc=parse(html);documents.set(route,doc);
 assert.equal(doc.querySelectorAll('main').length,1,route+' main landmark');
 assert.equal(doc.querySelectorAll('h1').length,1,route+' h1');
 assert.ok(doc.querySelector('html[lang]'),route+' language');
 for(const node of doc.querySelectorAll('script[type="application/ld+json"]'))JSON.parse(node.textContent);
 assert.ok(doc.querySelector('title').textContent.trim());
 assert.ok(doc.querySelector('meta[name="description"]').getAttribute('content').trim());
 checks+=5;
}
for(const [route,doc] of documents){
 for(const element of doc.querySelectorAll('[href], [src]')){
  const value=element.getAttribute('href')??element.getAttribute('src');
  if(!value||/^(mailto:|tel:|data:)/.test(value))continue;
  const url=new URL(value,'https://rgesol.com'+route);
  if(url.origin!=='https://rgesol.com')continue;
  if(documents.has(url.pathname)){
   if(url.hash)assert.ok(documents.get(url.pathname).querySelectorAll('[id]').some(e=>e.id===decodeURIComponent(url.hash.slice(1))),`${route}: broken fragment ${value}`);
  }else{
   assert.ok(!url.pathname.includes('..'));
   assert.ok((await stat(new URL(url.pathname.slice(1),root))).isFile(),`${route}: missing asset ${value}`);
  }
  checks++;
 }
 for(const image of doc.querySelectorAll('img')){assert.ok(image.hasAttribute('alt'),route+' alt');checks++;}
 for(const input of doc.querySelectorAll('input:not([type="hidden"]),select,textarea')){
  assert.ok(doc.querySelectorAll('label').some(label=>label.getAttribute('for')===input.id),route+' form label');checks++;
 }
}
const sitemap=await readFile(new URL('sitemap.xml',root),'utf8');
assert.doesNotMatch(sitemap,/xml-stylesheet|\.xsl|thank-you|\/404/);checks++;
for(const match of sitemap.matchAll(/<(?:loc|image:loc)>(.*?)<\/(?:loc|image:loc)>/g)){
 const url=new URL(match[1]);assert.equal(url.origin,'https://rgesol.com');
 if(!documents.has(url.pathname))assert.ok((await stat(new URL(url.pathname.slice(1),root))).isFile());checks++;
}
const vcard=await readFile(new URL('rgesolutions.vcf',root),'utf8');
assert.match(vcard,/BEGIN:VCARD/);assert.match(vcard,/END:VCARD/);assert.match(vcard,/TEL.*571.*210.*0586/);checks+=3;
assert.equal(vcard.match(/^ADR[^:]*:(.*)$/m)[1].split(';').length,7,'vCard address has seven fields');checks++;
for(const match of vcard.matchAll(/^(?:URL|PHOTO[^:]*):(https:\/\/rgesol\.com[^\r\n]*)/gm)){
 const url=new URL(match[1]);if(!['','/'].includes(url.pathname))assert.ok((await stat(new URL(url.pathname.slice(1),root))).isFile());checks++;
}
const robots=await readFile(new URL('robots.txt',root),'utf8');
assert.match(robots,/Sitemap: https:\/\/rgesol.com\/sitemap.xml/);assert.doesNotMatch(robots,/Disallow: \/\s*$/m);checks++;
console.log(`${checks} production page, link, asset, schema, sitemap and download checks passed.`);
