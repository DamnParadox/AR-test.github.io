const clockDomSnow = document.getElementById("clock-snow")
const scoreDomSnow = document.getElementById("score-snow")
var ballFlag=0; // 限制连续点击
var shotNumSnow = 0;// 打中了多少个
var ballNum = 0; // 用了多少颗子弹
var lastScoreSnow = 0;// 积分
var timesSnow = 30; // 倒计时多少秒
var timerSnow = null;
// 开始游戏
function startGameSnow(){
    isShowStartMaskSnow(0)
    timerSnow = setInterval(()=>{
        timesSnow--;
        clockDomSnow.innerHTML=timesSnow;
        if(timesSnow<=5){
            document.getElementById("fivetime-snow").innerHTML=timesSnow
            document.getElementById("fivetime-snow").style.display='block'
        }
        if(timesSnow<=0){
            overGameSnow();
            clearInterval(timerSnow)
        }
    },1000)
}
// 结束游戏
function overGameSnow(){
    document.getElementById("fivetime-snow").style.display='none'
    document.getElementById("last-score-snow").innerHTML=lastScoreSnow;
    isShowOverMaskSnow(1);
}
// bye游戏
function returnGameSnow(){
    resetGameSnow();
    isShowOverMaskSnow(0);
    isShowStartMaskSnow(1);
}
// 重新游戏
function againGameSnow(){
    resetGameSnow();
    isShowOverMaskSnow(0);
    startGameSnow();
}
// 重置游戏数据
function resetGameSnow(){
    // 重置数据
    timesSnow=30;
    lastScoreSnow=0;
    ballFlag=0;
    shotNumSnow = 0;
    ballNum = 0;

    // 重置画面
    clockDomSnow.innerHTML=timesSnow;
    scoreDomSnow.innerHTML=lastScoreSnow;
    for(let i=0;i<20;i++){
        if(onRenderFctsmy['selfAnim'+i]){
            delete onRenderFctsmy['selfAnim'+i];
            arWorldRootSnow.remove(targetsSnow[i]);
        }
    }
    addtargetsSnow();		
}				
// 是否显示开始界面
function isShowStartMaskSnow(f){
    let maskDom = document.getElementById("ready-mask-snow");
    if(f){
        maskDom.style.display='block'
    }else{
        maskDom.style.display='none'
    }
}

// 是否显示结束界面
function isShowOverMaskSnow(f){
    let maskDom = document.getElementById("over-mask-snow");
    if(f){
        maskDom.style.display='block'
    }else{
        maskDom.style.display='none'
    }
}
// 计分
function countScoreSnow(){
    let s = shotNumSnow*5 - ballNum;
    if(s<0){
        shotNumSnow=0;
        ballNum=0;
        s=0;
    }
    lastScoreSnow=s;
    scoreDomSnow.innerHTML=lastScoreSnow;
}

// ar元素控制
// ==加载贴图和模型---------------------------------------------------------
var textureLoader = new THREE.TextureLoader();
// 雪人大炮材质
var xuerenUrl = "https://ued.united-imaging.com/doc_server/doc_server/resource/src/bdf1577230b2cffdd1f1e7aaed27cc8a.png";  // 节点服务器-模型图片
// var xuerenUrl = "https://ued.united-imaging.com/doc_server/doc_server/resource/src/8b4fe9749b44583a92cc324565e80b97.png";  // 节点服务器-模型图片
var xuerenTexture = textureLoader.load(xuerenUrl);
var xuerenMat= new THREE.MeshPhongMaterial({
    transparent:true,
    map:xuerenTexture,
    normalMap:xuerenTexture,
    bumpMap:xuerenTexture
});
var xuerenGeometry = new THREE.BoxGeometry(0.5, 0.001, 0.8);
var xueren = new THREE.Mesh(xuerenGeometry, xuerenMat);
xueren.position.set(0,0.1,1.2);
arWorldRootSnow.add(xueren);
// 横杠材质
var lineUrl = "https://ued.united-imaging.com/doc_server/doc_server/resource/src/45aa83dde7ebae5352bf548c59139801.png";  // 节点服务器-模型图片
var lineTexture = textureLoader.load(lineUrl);
var lineMat= new THREE.MeshPhongMaterial({
    transparent:true,
    map:lineTexture,
    normalMap:lineTexture,
    bumpMap:lineTexture
});
var lineGeometry = new THREE.BoxGeometry(6, 0.001, 0.24);
var line = new THREE.Mesh(lineGeometry, lineMat);
line.position.set(0,0.15,-0.8);
arWorldRootSnow.add(line);
// 目标物材质
var targersUrl = [
    "https://ued.united-imaging.com/doc_server/doc_server/resource/src/f96da7838618e32e4a3a0856d474ace6.png",
    "https://ued.united-imaging.com/doc_server/doc_server/resource/src/b091212bebe411cf5067a01c70d98993.png",
    "https://ued.united-imaging.com/doc_server/doc_server/resource/src/cec0ec1eb3ccf86597bd0cc2238684bd.png",
    "https://ued.united-imaging.com/doc_server/doc_server/resource/src/294e45561d0ed3edc15700ce53d38b88.png",
    "https://ued.united-imaging.com/doc_server/doc_server/resource/src/904e187c8285d60fc514aa8f302c59ef.png",
    "https://ued.united-imaging.com/doc_server/doc_server/resource/src/a79533f1f95969ab45b41a8e95379977.png",
    "https://ued.united-imaging.com/doc_server/doc_server/resource/src/d2f0566de3636f070b7691147ab7654d.png",
    "https://ued.united-imaging.com/doc_server/doc_server/resource/src/166b9458119ca55a8f107d6be2f84669.png"]; // 节点服务器-模型图片

var targersMatList = [];
targersUrl.forEach((item)=>{
    let meshTexture = textureLoader.load(item);
    // 注意：不能使用MeshBasicMaterial
    targersMatList.push(new THREE.MeshPhongMaterial({
        transparent:true,
        map:meshTexture,
        normalMap:meshTexture,
        bumpMap:meshTexture
    }));
})
var targetMesh = new THREE.BoxGeometry(0.25, 0.001, 0.44);
var targetsSnow = [];
for(let i=0;i<20;i++){
    let num = parseInt(Math.random()*8);
    let mesh = new THREE.Mesh(targetMesh, targersMatList[num]);
    mesh.position.set(-6.6+i*0.6,0.1,-0.6);
    targetsSnow.push(mesh);
}
// ==加目标
function addtargetsSnow(){
    targetsSnow.forEach((item,i)=>{
        item.position.set(-6.6+i*0.6,0.1,-0.6); // 重置位置
        arWorldRootSnow.add(item);
        onRenderFctsmy['selfAnim'+i]=function () {
            if(item.position.x>=6){
                item.position.x = -6.6;
            }
            item.position.x += 0.025;
        }
    })
}
addtargetsSnow();



// 碰撞检测
function hitTestSnow(obj1,obj2){
    if(obj1.position.y!=obj2.position.y)return false;
    if(obj1.position.x<obj2.position.x+0.15 && obj1.position.x>obj2.position.x-0.15){
        return true;
    }
    return false;
}
// 射击

var ballMat = new THREE.MeshPhongMaterial( {
    color: 0xffffff
});
function shotSnow(){
    if(ballFlag){return;}

    let geometry4 = new THREE.SphereGeometry(0.05);
    let ball = new THREE.Mesh(geometry4, ballMat);
    ball.position.set(xueren.position.x,0.1,0.8);
    arWorldRootSnow.add(ball);
    ballNum+=1;countScoreSnow();
    ballFlag=1;
    let num = Math.random()*10000;
    onRenderFctsmy['ballMove'+num]=function () {
        ball.position.z-=1.2/10 // 上升
        if(ball.position.z <=-0.6){
            delete onRenderFctsmy['ballMove'+num];
            delete onRenderFctsmy.isShot;
            arWorldRootSnow.remove(ball);
            ballFlag=0;
        }
    }
    onRenderFctsmy.isShot=function () {
        if(ball.position.z <=-0.55){
            targetsSnow.forEach((item,i)=>{
                if(hitTestSnow(ball,item)){
                    item.position.y=0.05;
                    shotNumSnow+=1;countScoreSnow();
                    onRenderFctsmy['selfAnim'+i]=function (){
                        if(item.position.z>3){
                            delete onRenderFctsmy['selfAnim'+i]
                            arWorldRootSnow.remove(item);
                            if((shotNumSnow % 20) == 0 ){
                                addtargetsSnow();
                            }
                            return;
                        }
                        item.position.z+=0.1;
                    }
                }
            })
        }
    }
}

// 移动雪人
function moveSnow(num,type){
    switch(type){
        case 'left':
            if(xueren.position.x>-0.6){
                xueren.position.x-=num;
            }
            break;
        case 'right':
            if(xueren.position.x<0.6){
                xueren.position.x+=num;
            }
            break;
    }
}