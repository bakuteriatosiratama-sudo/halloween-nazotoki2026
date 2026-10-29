
(()=>{
'use strict';

const isStage2=location.pathname.includes('/stage2/');
const root=isStage2?'../':'./';
const cfg=window.GAME_CONFIG||{};
const gameId=cfg.gameId||'halloween-nazotoki';
const clearKey=(n)=>`nazotoki_${gameId}_stage${n}_clear`;
const discoveryKey=`nazotoki_${gameId}_stage2_discovered`;

const clear1=()=>localStorage.getItem(clearKey(1))==='true';
const clear2=()=>localStorage.getItem(clearKey(2))==='true';

if(isStage2){
 localStorage.setItem(discoveryKey,'true');
}

const discovered=()=>localStorage.getItem(discoveryKey)==='true';

const nav=document.createElement('nav');
nav.className='game-bottom-nav';
nav.setAttribute('aria-label','画面の切り替え');

const items=[
 {text:'ステージ１の問題を見る',page:'s1p',enabled:()=>true},
 {text:'ステージ２の問題を見る',page:'s2p',enabled:discovered},
 {text:'ステージ１のクリア画面を表示する',page:'s1c',enabled:clear1},
 {text:'ステージ２のクリア画面を表示する',page:'s2c',enabled:clear2}
];

function current(){
 const story=document.getElementById('story');
 return (isStage2?'s2':'s1')+
 (story&&story.classList.contains('visible')?'c':'p');
}

function visibleItems(){
 return isStage2||discovered()
  ?items
  :items.filter(item=>item.page==='s1p'||item.page==='s1c');
}

function openPage(page){
 const targetStage2=page.startsWith('s2');
 const targetClear=page.endsWith('c');

 if(targetStage2!==isStage2){
  location.href=root+(targetStage2?'stage2/':'')+
   (targetClear?'?view=story':'');
  return;
 }

 if(targetClear){
  if((isStage2&&!clear2())||(!isStage2&&!clear1()))return;
  if(typeof renderStory==='function')renderStory();
  show('story');
 }else{
  show('puzzle');
 }
 update();
}

function update(){
 nav.replaceChildren();

 visibleItems().forEach(item=>{
  const button=document.createElement('button');
  button.type='button';
  button.textContent=item.text;
  button.disabled=!item.enabled();
  button.setAttribute('aria-current',
   current()===item.page?'page':'false');
  button.title=button.disabled
   ?'この画面はまだ解放されていません':'';

  button.addEventListener('click',()=>{
   if(item.enabled())openPage(item.page);
  });

  nav.append(button);
 });
}

document.body.append(nav);

const story=document.getElementById('story');
if(story){
 const observer=new MutationObserver(update);
 observer.observe(story,{
  attributes:true,
  attributeFilter:['class']
 });
}

window.addEventListener('pageshow',update);
window.addEventListener('storage',update);
window.addEventListener('focus',update);

update();
})();
