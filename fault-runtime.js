(function(){
  const cfg=window.APP_CONFIG||{};
  const status=(msg)=>{const el=document.getElementById('faultDbStatus');if(el)el.textContent=msg;};
  let client=null,overrides=Object.create(null);
  window.refreshFaultClassifications=async function(){
    if(!cfg.SUPABASE_URL||!cfg.SUPABASE_ANON_KEY||cfg.SUPABASE_URL.includes('YOUR-PROJECT')||!window.supabase){status('Original catalogue active');return false;}
    try{
      if(!client)client=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
      const {data,error}=await client.from('fault_classifications').select('code,message,categories,is_deleted');
      if(error)throw error;
      const next=Object.create(null);
      (data||[]).forEach(r=>{next[String(r.code).trim()]={cats:Array.isArray(r.categories)?r.categories:[],message:r.message||'',deleted:!!r.is_deleted};});
      overrides=next;
      const mgr=window.__consolidatorFaultsManager;
      if(mgr&&!mgr.__liveOverridesInstalled){
        const original=mgr.classify.bind(mgr);
        mgr.classify=function(code){
          let key=String(code??'').trim().replace(/\.0$/,'');
          if(Object.prototype.hasOwnProperty.call(overrides,key)){
            const row=overrides[key];
            if(row.deleted||!row.cats.length)return null;
            return {cats:row.cats,msgs:Object.fromEntries(row.cats.map(c=>[c,row.message]))};
          }
          return original(code);
        };
        mgr.__liveOverridesInstalled=true;
      }
      status('Live catalogue connected · '+Object.keys(overrides).length+' overrides');
      return true;
    }catch(e){console.warn('Live fault catalogue unavailable; embedded defaults remain active.',e);status('Offline · original catalogue active');return false;}
  };
})();