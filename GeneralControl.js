
var clock = new THREE.Clock(); //动画更新需要
var mixer; //动画更新需要
var snowDom = document.getElementById("snow-game");
var stockDom = document.getElementById("stock-game");
let isInit = -1;
function initGame(ev){
    if(isInit!=-1)return;
    let markerId = ev.data.marker.id;
    if(markerId==0){
        stockDom.style.display='block';
        snowDom.style.display='none';
        isInit = markerId;
        return;
    }
    if(markerId==1){
        snowDom.style.display='block';
        stockDom.style.display='none';
        isInit = markerId;
        return;
    }
}