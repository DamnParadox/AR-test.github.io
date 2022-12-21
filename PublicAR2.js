
// 光
var ambient=new THREE.AmbientLight(0xffffff);
scene.add(ambient);

var directctionalLight=new THREE.DirectionalLight(0xffffff);
directctionalLight.position.set(1,1,1).normalize();
scene.add(directctionalLight);



//===成像相关================================================================================================================
//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////
var stats = new Stats();
// document.body.appendChild(stats.dom);
// render the scene
onRenderFcts.push(function () {
    // 更新动画帧
    if(mixer){
        mixer.update(clock.getDelta());
    }
    renderer.render(scene, camera);
    stats.update();

})

// run the rendering loop
var lastTimeMsec = null
requestAnimationFrame(function animate(nowMsec) {
    // keep looping
    requestAnimationFrame(animate);
    // measure time
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec = nowMsec
    // call each update function
    onRenderFcts.forEach(function (onRenderFct) {
        onRenderFct(deltaMsec / 1000, nowMsec / 1000)
    })
    Object.values(onRenderFctsmy).forEach(function (onRenderFct) {
        onRenderFct(deltaMsec / 1000, nowMsec / 1000)
    })

})
//###========================================================================================================================