const products = [
  {id:"pubg",name:"PUBG Mobile",desc:"شحن UC",icon:"🎯",category:"games",packages:["باقة تجريبية A","باقة تجريبية B","باقة تجريبية C"]},
  {id:"freefire",name:"Free Fire",desc:"شحن Diamonds",icon:"🔥",category:"games",packages:["باقة تجريبية A","باقة تجريبية B","باقة تجريبية C"]},
  {id:"ml",name:"Mobile Legends",desc:"شحن Diamonds",icon:"⚔️",category:"games",packages:["باقة تجريبية A","باقة تجريبية B"]},
  {id:"tiktok",name:"TikTok",desc:"عملات TikTok",icon:"♪",category:"apps",packages:["باقة تجريبية A","باقة تجريبية B"]},
  {id:"snap",name:"Snapchat",desc:"خدمات رقمية",icon:"👻",category:"apps",packages:["خدمة تجريبية A"]},
  {id:"ps",name:"PlayStation",desc:"بطاقات رقمية",icon:"🎮",category:"cards",packages:["بطاقة تجريبية A","بطاقة تجريبية B"]}
];
const grid=document.getElementById("productGrid");
const productDialog=document.getElementById("productDialog");
const orderDialog=document.getElementById("orderDialog");
const ordersDialog=document.getElementById("ordersDialog");
let chosen=null, deferredPrompt=null;

function renderProducts(category="all"){
  grid.innerHTML="";
  products.filter(p=>category==="all"||p.category===category).forEach(p=>{
    const card=document.createElement("article");card.className="product-card";
    card.innerHTML=`<div class="product-icon">${p.icon}</div><h3>${p.name}</h3><p>${p.desc}</p><button type="button">عرض الباقات ←</button>`;
    card.querySelector("button").addEventListener("click",()=>showProduct(p));
    grid.appendChild(card);
  });
}
function showProduct(p){
  chosen=p;
  document.getElementById("productDetails").innerHTML=`<span class="eyebrow">اختيار المنتج</span><h2>${p.icon} ${p.name}</h2><p style="color:#9ca9c4;font-size:12px">${p.desc}</p><div class="package-list">${p.packages.map((pkg,i)=>`<button class="package-option" data-index="${i}" style="display:block;width:100%;text-align:right;margin-top:10px;padding:14px;border-radius:11px;border:1px solid #29456b;background:#13213a;color:#fff;cursor:pointer">${pkg}<small style="display:block;color:#f4c95d;margin-top:5px">السعر سيُعلن عند إطلاق المتجر</small></button>`).join("")}</div>`;
  document.querySelectorAll(".package-option").forEach(btn=>btn.addEventListener("click",()=>openOrder(p,p.packages[Number(btn.dataset.index)])));
  productDialog.showModal();
}
function openOrder(p,pkg){
  chosen={...p,selectedPackage:pkg};productDialog.close();
  document.getElementById("orderTitle").textContent="طلب "+p.name;
  document.getElementById("selectedPackage").textContent=pkg+" — "+p.name;
  orderDialog.showModal();
}
document.getElementById("closeOrder").onclick=()=>orderDialog.close();
document.getElementById("orderForm").addEventListener("submit",e=>{
  e.preventDefault();
  const order={number:"SK"+Date.now().toString().slice(-8),product:chosen.name,package:chosen.selectedPackage,playerId:document.getElementById("playerId").value.trim(),phone:document.getElementById("phone").value.trim(),payment:document.getElementById("payment").value,notes:document.getElementById("notes").value,status:"بانتظار المراجعة",created:new Date().toLocaleString("ar-MR")};
  const orders=JSON.parse(localStorage.getItem("seckOrders")||"[]");orders.unshift(order);localStorage.setItem("seckOrders",JSON.stringify(orders));
  e.target.reset();orderDialog.close();
  alert("تم حفظ الطلب التجريبي على هذا الجهاز. رقم الطلب: "+order.number+" — لم يتم إرسال الطلب إلى المتجر أو تنفيذ أي دفع.");
});
function showOrders(){
  const orders=JSON.parse(localStorage.getItem("seckOrders")||"[]"),list=document.getElementById("ordersList");
  list.innerHTML=orders.length?orders.map(o=>`<div class="order-item"><b>${o.product} — ${o.package}</b><small>رقم الطلب: ${o.number}</small><small>الحالة: ${o.status} • ${o.created}</small></div>`).join(""):'<div class="empty">لا توجد طلبات محفوظة على هذا الجهاز بعد.</div>';
  ordersDialog.showModal();
}
document.getElementById("ordersNav").onclick=showOrders;
document.querySelectorAll(".category-card").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".category-card").forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");renderProducts(btn.dataset.category);
}));
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installBtn").hidden=false;});
document.getElementById("installBtn").addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;});
if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(()=>{});
