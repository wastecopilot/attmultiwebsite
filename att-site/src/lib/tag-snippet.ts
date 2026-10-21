/**
 * Builds the inline script that is rendered as the FIRST element of <head> on every page
 * (src/app/layout.tsx). It runs synchronously before any other script:
 *   1. defines window.dataLayer and gtag(),
 *   2. sets Google Consent Mode v2 defaults (region-aware, GPC-aware),
 *   3. re-applies a stored consent choice,
 *   4. queues the GA4 / Google Ads config, including the website call-conversion number swap.
 *   5. immediately injects gtag.js (and GTM when a GTM- ID is used) as async scripts.
 * Injecting from this snippet (rather than rendering <script async src> in JSX, which React hoists above
 * inline scripts) guarantees the consent defaults exist before any Google tag can load, while the
 * request still starts during HTML parsing — no delay and no waiting for user interaction.
 */
import { CONSENT_COOKIE, CONSENT_VERSION, STRICT_CONSENT_REGIONS } from "./consent";
import { env, ga4Id } from "./env";

export function buildTagSnippet(): string {
  const cfg = {
    ga4: ga4Id,
    ads: env.adsId,
    swap: env.adsSwapLabel ? `${env.adsId}/${env.adsSwapLabel}` : "",
    phone: env.phoneDisplay,
    regions: STRICT_CONSENT_REGIONS,
    cookie: CONSENT_COOKIE,
    v: CONSENT_VERSION,
    gtm: env.tagId.startsWith("GTM-"),
    gtagSrc: gtagSrc(),
    gtmSrc: gtmSrc(),
  };
  // Kept small and dependency-free; it is inlined into every HTML document.
  return `(function(c){
var w=window,d=document;d.documentElement.className+=' js';w.dataLayer=w.dataLayer||[];
function gtag(){w.dataLayer.push(arguments);}w.gtag=gtag;
var D='denied',G='granted',gpc=navigator.globalPrivacyControl===true,tz='';
try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';}catch(e){}
gtag('consent','default',{ad_storage:D,ad_user_data:D,ad_personalization:D,analytics_storage:D,functionality_storage:G,security_storage:G,wait_for_update:500,region:c.regions});
var a=gpc?D:G;
gtag('consent','default',{ad_storage:a,ad_user_data:a,ad_personalization:a,analytics_storage:G,functionality_storage:G,security_storage:G});
var strictTz=!tz||/^Europe\\//.test(tz)||/^Atlantic\\/(Reykjavik|Canary|Madeira|Azores|Faroe)$/.test(tz);
w.__attConsentDefaultAds=!gpc&&!strictTz;
var m=d.cookie.match(new RegExp('(?:^|; )'+c.cookie+'=([^;]+)'));
d.documentElement.setAttribute('data-consent',m?'set':'unset');
if(m){try{var s=JSON.parse(decodeURIComponent(m[1]));if(s.v===c.v){var x=s.ads?G:D;gtag('consent','update',{ad_storage:x,ad_user_data:x,ad_personalization:x,analytics_storage:s.analytics?G:D});}}catch(e){}}
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
gtag('js',new Date());
if(c.ga4)gtag('config',c.ga4);
if(c.ads)gtag('config',c.ads);
if(c.swap&&c.phone)gtag('config',c.swap,{phone_conversion_number:c.phone});
if(c.gtm)w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
function load(src,id){if(!src)return;var s=d.createElement('script');s.async=true;s.src=src;s.id=id;var f=d.getElementsByTagName('script')[0];f&&f.parentNode?f.parentNode.insertBefore(s,f):d.head.appendChild(s);}
load(c.gtagSrc,'gtag-js');load(c.gtmSrc,'gtm-js');
})(${JSON.stringify(cfg)});`;
}

/** The gtag.js URL. Loaded with the Ads ID when present (it also serves GA4 config), else the GA4 ID. */
export function gtagSrc(): string {
  const id = env.adsId || ga4Id;
  return id ? `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}` : "";
}

export function gtmSrc(): string {
  return env.tagId.startsWith("GTM-") ? `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(env.tagId)}` : "";
}
