const clockDomStock = document.getElementById("clock-stock")
		const scoreDomStock = document.getElementById("score-stock")
		var shotNumStock = 0;// 接了多少个
		var lastScoreStock = 0;// 积分
		var timesStock = 30; // 倒计时多少秒
		var timerStock = null;
		var createObjTimerStock = null;
		var objNumStock=[3,1]; //每秒产生的礼物个数、炸弹个数
// 开始游戏
		function startGameStock(){
			isShowStartMaskStock(0)
			timerStock = setInterval(()=>{
				timesStock--;
				clockDomStock.innerHTML=timesStock;
				if(timesStock<=5){
					document.getElementById("fivetime-stock").innerHTML=timesStock
					document.getElementById("fivetime-stock").style.display='block'
				}
				if(timesStock<=0){
					overGameStock();
				}
			},1000)
			createObjTimerStock = setInterval(()=>{
				if(Math.random()<=0.2){
					for(let i=0;i<objNumStock[1];i++){	
						createBoom();
					}
				}
				for(let i=0;i<objNumStock[0];i++){	
					createTargetStock();
				}
			},1000)
		}
// 结束游戏
		function overGameStock(f){
			clearInterval(timerStock)
			clearInterval(createObjTimerStock)
			document.getElementById("fivetime-stock").style.display='none'
			if(f=='boom'){
				document.getElementById("score-text-stock").innerHTML='';
				document.getElementById("boombg").src='./img/overModelStock2.png';
			}else{
				document.getElementById("last-score-stock").innerHTML=lastScoreStock;
			}
			isShowoverMaskStock(1);
		}
// bye游戏
		function returnGameStock(){
			resetGameStock();
			isShowoverMaskStock(0);
			isShowStartMaskStock(1);
		}
// 重新游戏
		function againGameStock(){
			resetGameStock();
			isShowoverMaskStock(0);
			startGameStock();
		}
// 重置游戏数据
		function resetGameStock(){
			// 重置数据
			timesStock=30;
			lastScoreStock=0;
		    shotNumStock = 0;
			// 重置画面
			clockDomStock.innerHTML=timesStock;
			scoreDomStock.innerHTML=lastScoreStock;
			document.getElementById("score-text-stock").innerHTML='袜子已经塞了 <span id="last-score-stock">0</span> 个礼物';
			document.getElementById("boombg").src='./img/overModelStock1.png';
		}				
// 是否显示开始界面
		function isShowStartMaskStock(f){
			let maskDom = document.getElementById("ready-mask-stock");
			if(f){
				maskDom.style.display='block'
			}else{
				maskDom.style.display='none'
			}
		}

// 是否显示结束界面
		function isShowoverMaskStock(f){
			let maskDom = document.getElementById("over-mask-stock");
			if(f){
				maskDom.style.display='block'
			}else{
				maskDom.style.display='none'
			}
		}
// 计分
		function countScoreStock(){
			lastScoreStock=shotNumStock;
			scoreDomStock.innerHTML=lastScoreStock;
		}

// ar元素控制
// ==加载贴图和模型---------------------------------------------------------
		var textureLoader = new THREE.TextureLoader();
		// 袜子材质
		var stockUrl = "https://ued.united-imaging.com/doc_server/doc_server/resource/src/2f891ff32da8c767512d9201e926c9ba.png";  // 节点服务器-模型图片
		var stockTexture = textureLoader.load(stockUrl);
		var stockMat= new THREE.MeshPhongMaterial({
			transparent:true,
			map:stockTexture,
			normalMap:stockTexture,
			bumpMap:stockTexture
		});
		var stockGeometry = new THREE.BoxGeometry(0.6, 0.001, 0.65);
		var stockMesh = new THREE.Mesh(stockGeometry, stockMat);
		stockMesh.position.set(0,0.1,2);
		arWorldRootStock.add(stockMesh);

		// 炸弹材质
		var boomUrl = "https://ued.united-imaging.com/doc_server/doc_server/resource/src/b331f2f12ea88adeca388a26f079a7eb.png";  // 节点服务器-模型图片
		var boomTexture = textureLoader.load(boomUrl);
		var boomMat= new THREE.MeshPhongMaterial({
			transparent:true,
			map:boomTexture,
			normalMap:boomTexture,
			bumpMap:boomTexture
		});
        // 创建炸弹
		function createBoom(){
			let boomGeometry = new THREE.BoxGeometry(0.25, 0.001, 0.25);
			let boom = new THREE.Mesh(boomGeometry, boomMat);
			boom.position.set(Math.random()*4-2,0.1,-2);
			boom.rotation.y = ((20*Math.random()-10) * Math.PI) / 180;
			arWorldRootStock.add(boom);
			let ballWho = Math.random()*100000;

			onRenderFctsmy['boomMove'+ballWho]=function () {
				boom.position.z+=0.08*Math.random()+0.005 // 下落
				if(boom.position.z >=2){
					if(hitTestStock(boom,stockMesh)){
						overGameStock('boom')
						boom.position.y=0.05;
						delete onRenderFctsmy['boomMove'+ballWho];
						arWorldRootStock.remove(boom);
						return;
					}
				}
				if(boom.position.z >=2.5){
					delete onRenderFctsmy['boomMove'+ballWho];
					arWorldRootStock.remove(boom);
					return;
				}
			}
		}

		// 礼物材质
		var giftUrl = [
			"https://ued.united-imaging.com/doc_server/doc_server/resource/src/0cdb0027994dde5087597623df7aeffe.png",
			"https://ued.united-imaging.com/doc_server/doc_server/resource/src/f01f981f4413d0aec1d06a70688e4d69.png",
			"https://ued.united-imaging.com/doc_server/doc_server/resource/src/0bac763f0008f45fc80adc7763a6dff9.png",
			"https://ued.united-imaging.com/doc_server/doc_server/resource/src/b32f13c84471ac1a72d5e1df47b97b2f.png",
			"https://ued.united-imaging.com/doc_server/doc_server/resource/src/635a38834a7e5cfe92649b7b346b111b.png",
			"https://ued.united-imaging.com/doc_server/doc_server/resource/src/9015ccf5b6c20ec24ea0f307e92816cc.png",
			"https://ued.united-imaging.com/doc_server/doc_server/resource/src/298fa773fc714f1efbfb36dc56227497.png"]; // 节点服务器-模型图片
		var giftMatList = [];
		giftUrl.forEach((item)=>{
			let meshTexture = textureLoader.load(item);
			// 注意：不能使用MeshBasicMaterial
			giftMatList.push(new THREE.MeshPhongMaterial({
				transparent:true,
				map:meshTexture,
				normalMap:meshTexture,
				bumpMap:meshTexture
			}));
		})
		console.log(giftMatList);
		// 创建目标礼物
		function createTargetStock(){
			let geometry = new THREE.BoxGeometry(0.25, 0.001, 0.25);
			let num = parseInt(Math.random()*7);
			let target = new THREE.Mesh(geometry, giftMatList[num]);
			target.position.set(Math.random()*4-2,0.1,-2);
			target.rotation.y = ((20*Math.random()-10) * Math.PI) / 180;
			arWorldRootStock.add(target);
			let targetWho = Math.random()*100000;

			onRenderFctsmy['targetMove'+targetWho]=function () {
				target.position.z+=0.08*Math.random()+0.005 // 下落
				if(target.position.z >=2){
					if(hitTestStock(target,stockMesh)){
						shotNumStock++;
						countScoreStock();
						target.position.y=0.05;
						delete onRenderFctsmy['targetMove'+targetWho];
						arWorldRootStock.remove(target);
						return;
					}
				}
				if(target.position.z >=2.5){
					delete onRenderFctsmy['targetMove'+targetWho];
					arWorldRootStock.remove(target);
					return;
				}
			}
		}


// 碰撞检测
		function hitTestStock(obj1,obj2){
			if(obj1.position.y!=obj2.position.y)return false;
			if(obj1.position.x<obj2.position.x+0.2 && obj1.position.x>obj2.position.x-0.2){
				return true;
			}
			return false;
		}


// 调整袜子位置
        // 禁止双击放大
		document.getElementById("left-btn-stock").addEventListener('click',function(e){
			e.preventDefault();
		});
		document.getElementById("right-btn-stock").addEventListener('click',function(e){
			e.preventDefault();
		});

		// 移动位置
		function moveWazi(num,type){
			switch(type){
				case 'left':
					if(stockMesh.position.x>-2){
						stockMesh.position.x-=num;
					}
					break;
				case 'right':
					if(stockMesh.position.x<2){
						stockMesh.position.x+=num;
					}
					break;
			}
		}