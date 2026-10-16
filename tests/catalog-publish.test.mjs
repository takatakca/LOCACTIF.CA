import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, readdir, rm, rename } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { reviewCatalogUpdate, publishCatalogAtomically } from "../scripts/catalog-publish.mjs";

const item = id=>({id:String(id),name:"Test",description:"Fixture uniquement",categories:["Essai"],url:"https://locactif.ca/item/"+id,price:null,currency:null});
const catalog=(ids,origin="https://locactif.ca")=>({
  schema_version:1,source_origin:origin,imported_at:ids.length?"2026-10-15T12:00:00.000Z":null,items:ids.map(id=>({...item(id),url:origin+"/item/"+id}))
});

test("declines unknown origin and major catalogue losses unless explicitly approved",()=>{
  assert.deepEqual(reviewCatalogUpdate(catalog([1,2]),catalog([2,3])),{retained:1,added:1,removed:1});
  assert.throws(()=>reviewCatalogUpdate(catalog([1]),catalog([2],"https://other.example")),/origin changed/);
  assert.throws(()=>reviewCatalogUpdate(catalog([1,2,3]),catalog([1])),/more than 50%/);
  assert.deepEqual(reviewCatalogUpdate(catalog([1,2,3]),catalog([1]),{confirmShrink:true}),{retained:1,added:0,removed:2});
  assert.throws(()=>reviewCatalogUpdate(catalog([1]),catalog([])),/Empty catalogue/);
  assert.deepEqual(reviewCatalogUpdate(catalog([1]),catalog([]),{allowEmpty:true,confirmShrink:true}),{retained:0,added:0,removed:1});
  assert.throws(()=>reviewCatalogUpdate(null,catalog([1])),/Existing catalog is required/);
});

test("atomic publication replaces file completely; a failed rename preserves previous catalog",async()=>{
  const folder=await mkdtemp(join(tmpdir(),"locactif-catalog-"));
  const file=join(folder,"catalog.json");
  try{
    const initial=catalog([1]);
    const next=catalog([2,3]);
    await writeFile(file,JSON.stringify(initial)+"\n");
    await publishCatalogAtomically(file,next);
    assert.deepEqual(JSON.parse(await readFile(file,"utf8")),next);
    await assert.rejects(publishCatalogAtomically(file,catalog([4]),{
      writeFile,rm,
      rename:async()=>{throw new Error("simulated filesystem failure");}
    }),/simulated filesystem failure/);
    assert.deepEqual(JSON.parse(await readFile(file,"utf8")),next);
    assert.deepEqual((await readdir(folder)).sort(),["catalog.json"]);
    await assert.rejects(publishCatalogAtomically(file,{...next,items:[{unsafe:"yes"}]}),/invalid catalog/);
    assert.deepEqual(JSON.parse(await readFile(file,"utf8")),next);
  } finally {await rm(folder,{force:true,recursive:true});}
});
