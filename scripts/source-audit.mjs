import { lookup } from "node:dns/promises";

const allowedHosts = new Set(["locactif.ca","www.locactif.ca"]);
const origin = "https://locactif.ca";
const timeout = 12000;

async function request(path) {
  let current = new URL(path,origin);
  for (let i=0;i<4;i++) {
    if (current.protocol !== "https:" || !allowedHosts.has(current.hostname) || current.username || current.password) {
      throw new Error("Unsafe or unexpected redirect outside locactif.ca");
    }
    const response = await fetch(current,{method:"GET",redirect:"manual",signal:AbortSignal.timeout(timeout),headers:{"accept":"application/json,text/html;q=0.9,*/*;q=0.8"}});
    if ([301,302,303,307,308].includes(response.status)) {
      const next=response.headers.get("location");
      if (!next) throw new Error("Redirect without Location");
      await response.body?.cancel();
      current=new URL(next,current);
      continue;
    }
    const reader=response.body?.getReader();
    let text="",readBytes=0;
    if(reader) {
      const decoder=new TextDecoder();
      while(true) {
        const {done,value}=await reader.read();
        if(done) break;
        readBytes+=value.byteLength;
        if(readBytes>300000) { await reader.cancel(); throw new Error("Response exceeds inspection limit"); }
        text+=decoder.decode(value,{stream:true});
      }
      text+=decoder.decode();
    }
    return {status:response.status,url:current.href,contentType:response.headers.get("content-type")||"",body:text};
  }
  throw new Error("More than three redirects");
}

console.log("LOCACTIF HISTORICAL SOURCE AUDIT — read-only HTTPS GET; no auth, no writes");
try {
  const addresses = await lookup("locactif.ca",{all:true});
  console.log("DNS locactif.ca:", addresses.length ? "resolves ("+addresses.length+" records)" : "no records");
} catch(error) {
  console.log("DNS locactif.ca: unavailable ("+error.code+")");
}
for (const [label,path] of [
  ["homepage","/"],
  ["wp-json index","/wp-json/"],
  ["WooCommerce Store API sample","/wp-json/wc/store/v1/products?per_page=1"]
]) {
  try {
    const r=await request(path);
    console.log(label+": HTTP "+r.status+" at "+r.url+" ("+r.contentType+")");
    if(label==="homepage") {
      const html=r.body.toLowerCase();
      console.log("WordPress markup fingerprint:", html.includes("/wp-content/")||html.includes("wp-json") ? "detected" : "not detected");
    } else if (r.status===200 && r.contentType.includes("json")) {
      try {
        const data=JSON.parse(r.body);
        if(label==="wp-json index"){
          const routes=Object.keys(data.routes||{});
          console.log("WP REST index:", data.namespaces ? "namespaces present" : "unrecognized format", "| WooCommerce Store API route:",routes.some(x=>x.includes("/wc/store/")) ? "listed" : "not listed");
        } else {
          console.log("Public Store API:", Array.isArray(data) ? "array of "+data.length+" sample item(s) (NOT full inventory)" : "not a product array");
        }
      } catch(error){console.log("JSON parse error:",error.message);}
    }
  } catch(error) {
    console.log(label+": unavailable — "+error.message);
  }
}
console.log("Audit finished. This read-only probe does NOT establish ownership, booking integrity, or permission to migrate customer data.");
