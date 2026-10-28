import {test} from 'node:test';
import assert from 'node:assert/strict';
import {persistMailIssue} from '../worker/monitoring.ts';
import fs from 'node:fs';

test('RGE immediate failures use only its own durable primary/fallback identities',async t=>{
 t.mock.method(console,'error',()=>{});
 for(const ENVIRONMENT of ['production','staging']){
  const writes=[];
  const DELIVERY_STATUS={idFromName:name=>name,get:name=>({fetch:async(_url,options)=>{
   writes.push({name,data:JSON.parse(options.body)});
   return name.endsWith('/contact-delivery')?new Response(null,{status:503}):Response.json({fresh:true});
  }})};
  await persistMailIssue({ENVIRONMENT,DELIVERY_STATUS},'send_rejected');
  assert.deepEqual(writes.map(w=>w.name),['rgesol/contact-delivery','rgesol/contact-delivery','rgesol/contact-delivery','rgesol/contact-delivery-fallback']);
  assert.equal(new Set(writes.map(w=>w.data.key)).size,1);
  assert.deepEqual(Object.keys(writes[0].data).sort(),['environment','issue','key']);
  assert.equal(writes[0].data.environment,ENVIRONMENT);
 }
});
test('missing live monitoring binding fails closed; local mode sends no telemetry',async t=>{
 t.mock.method(console,'error',()=>{});
 await assert.rejects(persistMailIssue({ENVIRONMENT:'production'},'send_configuration'));
 await persistMailIssue({ENVIRONMENT:'local'},'send_configuration');
});
test('both deployments bind the shared monitor without replacing contact state',()=>{
 for(const file of ['wrangler.jsonc','wrangler.production.jsonc']){
  const c=JSON.parse(fs.readFileSync(file,'utf8'));
  assert.ok(c.durable_objects.bindings.some(b=>b.name==='CONTACT_STATE'));
  assert.deepEqual(c.durable_objects.bindings.find(b=>b.name==='DELIVERY_STATUS'),{name:'DELIVERY_STATUS',class_name:'DeliveryStatus',script_name:'family-sites-email-monitor'});
 }
});
