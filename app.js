const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const KEY = "habitzen-starter-v1";
const todayKey = (() => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
})();
const defaults = [
  {id:"water",name:"Drink enough water",tag:"HEALTH"},
  {id:"move",name:"Move for 20 minutes",tag:"FITNESS"},
  {id:"read",name:"Read or learn",tag:"GROWTH"},
  {id:"sleep",name:"Wind down on time",tag:"REST"}
];
let data;
try { data = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { data = {}; }
data.habits ||= defaults;
data.completed ||= {};
data.workouts ||= [];
data.urgeLogs ||= [];
function save(){ localStorage.setItem(KEY, JSON.stringify(data)); }
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200);}
$("#today").textContent = new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"}).toUpperCase();
function doneIds(){return data.completed[todayKey] || [];}
function renderHabits(){
  const ids=doneIds();
  const markup=data.habits.map(h=>`<div class="habit-row ${ids.includes(h.id)?"is-done":""}"><button class="check ${ids.includes(h.id)?"done":""}" data-toggle="${escapeHtml(h.id)}" aria-label="Toggle ${escapeHtml(h.name)}">${ids.includes(h.id)?"✓":""}</button><span class="habit-name">${escapeHtml(h.name)}</span><span class="habit-tag">${escapeHtml(h.tag||"PERSONAL")}</span></div>`).join("") || '<p class="muted">No habits yet. Add one below to get started.</p>';
  $("#habit-list").innerHTML=markup; $("#habit-list-full").innerHTML=markup;
  $$("[data-toggle]").forEach(b=>b.addEventListener("click",()=>{const id=b.dataset.toggle;let list=doneIds();data.completed[todayKey]=list.includes(id)?list.filter(x=>x!==id):[...list,id];save();render();}));
}
function render(){
  renderHabits();const total=data.habits.length,done=doneIds().length;
  $("#completed").textContent=`${done} / ${total}`;$("#consistency").textContent=`${total?Math.round(done/total*100):0}%`;
  $("#streak").textContent=(done===total&&total>0)?"1 day":"0 days";
  $("#sessions").textContent=String(data.workouts.length);
  $("#minutes-total").innerHTML=`${data.workouts.reduce((n,w)=>n+w.minutes,0)} <span>min</span>`;
  $("#workout-list").innerHTML=data.workouts.slice(-5).reverse().map(w=>`<div class="workout-item"><span>${escapeHtml(w.activity)} · ${escapeHtml(w.date)}</span><strong>${w.minutes} min</strong></div>`).join("")||'<p class="muted small">Your logged sessions will appear here.</p>';
}
function addHabit(input){const name=input.value.trim();if(!name)return;data.habits.push({id:"h"+Date.now(),name,tag:"PERSONAL"});input.value="";save();render();toast("Habit added");}
$("#add-habit-form").addEventListener("submit",e=>{e.preventDefault();addHabit($("#habit-input"));});
$("#add-habit-form-full").addEventListener("submit",e=>{e.preventDefault();addHabit($("#habit-input-full"));});
function showView(view){$$(".view").forEach(el=>el.classList.toggle("hidden",el.id!==`view-${view}`));$$(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===view));window.scrollTo({top:0,behavior:"smooth"});}
$$("[data-view]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
$$("[data-jump]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.jump)));
$("#show-habits").addEventListener("click",()=>showView("habits"));
$("#workout-form").addEventListener("submit",e=>{e.preventDefault();const minutes=Number($("#duration").value);if(!Number.isFinite(minutes)||minutes<1){$("#fitness-message").textContent="Enter a valid duration.";return;}data.workouts.push({activity:$("#activity").value,minutes,date:new Date().toLocaleDateString()});save();render();$("#fitness-message").textContent="Workout saved on this device.";toast("Workout saved");});
$("#weight-form").addEventListener("submit",e=>{e.preventDefault();const val=$("#weight-input").value;if(!val)return;localStorage.setItem("habitzen-weight",val);$("#weight-message").textContent=`Saved ${val} kg on this device.`;});
let selectedUrge=0;
$$("[data-urge]").forEach(b=>b.addEventListener("click",()=>{selectedUrge=Number(b.dataset.urge);$$("[data-urge]").forEach(x=>x.classList.toggle("selected",x===b));}));
$("#urge-save").addEventListener("click",()=>{if(!selectedUrge){$("#urge-message").textContent="Choose an intensity first.";return;}data.urgeLogs.push({level:selectedUrge,at:new Date().toISOString()});save();$("#urge-message").textContent="Check-in saved locally. Try a slow breath and notice what you need.";});
$("#journal").value=localStorage.getItem("habitzen-journal")||"";
$("#journal-save").addEventListener("click",()=>{localStorage.setItem("habitzen-journal",$("#journal").value);$("#journal-message").textContent="Saved in this browser on this device.";});
let breathing=false,breathInterval=null;
$("#breath-start").addEventListener("click",()=>{if(breathing){clearInterval(breathInterval);breathing=false;$("#breath-circle").className="breath-circle";$("#breath-circle").textContent="Ready";$("#breath-start").textContent="Start breathing";$("#breath-message").textContent="Breathing paused.";return;}breathing=true;let sec=0;$("#breath-start").textContent="Stop breathing";$("#breath-message").textContent="Stop anytime if you feel uncomfortable.";const tick=()=>{const phase=sec%8;const c=$("#breath-circle");if(phase<4){c.className="breath-circle inhale";c.textContent="Breathe in";}else{c.className="breath-circle exhale";c.textContent="Breathe out";}sec++;if(sec>=60){clearInterval(breathInterval);breathing=false;c.className="breath-circle";c.textContent="Complete";$("#breath-start").textContent="Start again";$("#breath-message").textContent="One minute completed. Notice how you feel.";}};tick();breathInterval=setInterval(tick,1000);});
const dialog=$("#premium-dialog");
$("#premium-button").addEventListener("click",()=>dialog.showModal());
$("#modal-close").addEventListener("click",()=>dialog.close());
$("#notify-button").addEventListener("click",()=>{dialog.close();toast("Premium payment is not connected yet");});
if("serviceWorker" in navigator && location.protocol.startsWith("http")) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();
