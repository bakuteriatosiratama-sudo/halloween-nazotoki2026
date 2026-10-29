(()=>{
'use strict';
const isStage2=!!document.getElementById('locked');
const root=isStage2?'../':'./';
const gameId='halloween-nazotoki';
const key=(n)=>`nazotoki_${gameId}_stage${n}_clear`;
const clear1=()=>localStorage.getItem(key(1))==='true';
const clear2=()=>localStorage.getItem(key(2))==='true';
const nav=document.createElement('nav');nav.className='game-bottom-nav';nav.setAttribute('aria-label','ステージとクリア画面の切り替え');
const items=[
 {text:'ステージ１の問題を見る',page:'s1p',enabled:()=>true},
 {text:'ステージ２の問題を見る',page:'s2p',enabled:clear1},
 {text:'ステージ１のクリア画面を表示する',page:'s1c',enabled:clear1},
 {text:'ステージ２のクリア画面を表示する',page:'s2c',enabled:clear2}
];
function current(){return (isStage2?'s2':'s1')+(document.getElementById('story').classList.contains('visible')?'c':'p')}
function openPage(page){
 const targetStage2=page.startsWith('s2'),targetClear=page.endsWith('c');
 if(targetStage2!==isStage2){location.href=root+(targetStage2?'stage2/':'')+(targetClear?'?view=story':'');return}
 if(targetClear){if(isStage2&&!clear2()||!isStage2&&!clear1())return;
 if(typeof renderStory==='function')renderStory();show('story')}
 else show('puzzle');
 update();
}
function update(){const active=current();items.forEach((item,i)=>{const b=nav.children[i];b.disabled=!item.enabled();b.setAttribute('aria-current',active===item.page?'page':'false');b.title=b.disabled?'前のステージをクリアすると解放されます':''})}
items.forEach(item=>{const button=document.createElement('button');button.type='button';button.textContent=item.text;button.addEventListener('click',()=>{if(item.enabled())openPage(item.page)});nav.append(button)});
document.body.append(nav);
// 既存の正解判定と画面表示を変更せず、表示状態に合わせてメニューだけ同期する。
const observer=new MutationObserver(update);
observer.observe(document.getElementById('story'),{attributes:true,attributeFilter:['class']});
window.addEventListener('pageshow',update);
window.addEventListener('storage',update);
window.addEventListener('focus',update);
update();
})();
