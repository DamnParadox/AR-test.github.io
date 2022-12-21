//==成像相关===========================================================================================================
		//////////////////////////////////////////////////////////////////////////////////
		//		Init
		//////////////////////////////////////////////////////////////////////////////////

		// init renderer
		var renderer = new THREE.WebGLRenderer({
			antialias: true,
			precision: "highp", //333
			alpha: true
		});
		renderer.setClearColor(new THREE.Color('lightgrey'), 0)
		renderer.setPixelRatio(window.devicePixelRatio); //333
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.domElement.style.position = 'absolute'
		renderer.domElement.style.top = '0px'
		renderer.domElement.style.left = '0px'
		document.getElementById("armain-stock").appendChild(renderer.domElement);

		// array of functions for the rendering loop
		var onRenderFcts = [];
		var onRenderFctsmy = {};

		var arToolkitContext, artoolkitMarkerStock, artoolkitMarkerSnow,markerRootStock,markerRootSnow;

		// init scene and camera
		var scene = new THREE.Scene();

		//////////////////////////////////////////////////////////////////////////////////
		//		Initialize a basic camera
		//////////////////////////////////////////////////////////////////////////////////

		// Create a camera
		var camera = new THREE.Camera();
		scene.add(camera);

		markerRootStock = new THREE.Group
		scene.add(markerRootStock)

		markerRootSnow = new THREE.Group
		scene.add(markerRootSnow)

		////////////////////////////////////////////////////////////////////////////////
		//          handle arToolkitSource
		////////////////////////////////////////////////////////////////////////////////

		var arToolkitSource = new THREEx.ArToolkitSource({
			// to read from the webcam
			sourceType: 'webcam',

			// to read from an image
			// sourceType : 'image',
			// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',

			// to read from a video
			// sourceType : 'video',
			// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
		})

		arToolkitSource.init(function onReady() {
			initARContext()
			onResize()
		})

		// handle resize
		window.addEventListener('resize', function () {
			onResize()
		})
		function onResize() {

			arToolkitSource.onResizeElement()
			arToolkitSource.copyElementSizeTo(renderer.domElement)
			if (window.arToolkitContext.arController !== null) {
				arToolkitSource.copyElementSizeTo(window.arToolkitContext.arController.canvas)
			}
		}
		////////////////////////////////////////////////////////////////////////////////
		//          initialize arToolkitContext
		////////////////////////////////////////////////////////////////////////////////


		// create atToolkitContext
		function initARContext() {
			console.log('initARContext()');

			arToolkitContext = new THREEx.ArToolkitContext({
				// cameraParametersUrl: 'https://jeromeetienne.github.io/AR.js/data/data/camera_para.dat',
				cameraParametersUrl: 'https://ued.united-imaging.com/doc_server/doc_server/resource/src/343c761a5174cf7f427e30ba75ceb63f.dat',  // 节点服务器-AR.js相机文件
				detectionMode: 'mono',
				maxDetectionRate: 30,
				canvasWidth: 80 * 3,
				canvasHeight: 60 * 3,
			})
			// initialize it
			arToolkitContext.init(function onCompleted() {
				// copy projection matrix to camera
				camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
				arToolkitContext.arController.orientation = getSourceOrientation();
				arToolkitContext.arController.options.orientation = getSourceOrientation();



				// 回调接口
				arToolkitContext.arController.addEventListener('getMarker', function (ev) {
					initGame(ev);
				})


				console.log('arToolkitContext', arToolkitContext);
				window.arToolkitContext = arToolkitContext;
			})
			artoolkitMarkerStock = new THREEx.ArMarkerControls(arToolkitContext, markerRootStock, {
				type: 'pattern',
				// patternUrl: 'https://ued.united-imaging.com//doc_server//doc_server//arlib//pattern//123//pattern.patt'  // 节点服务器-识别图
				patternUrl: 'https://ued.united-imaging.com//doc_server//doc_server//resource//src//41e31a4ce57970c49385f10ce87c34e2.patt'
				// patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji'
			})

			
			artoolkitMarkerSnow = new THREEx.ArMarkerControls(arToolkitContext, markerRootSnow, {
				type: 'pattern',
				patternUrl: 'https://ued.united-imaging.com//doc_server//doc_server//arlib//pattern//123//pattern.patt'  // 节点服务器-识别图
				// patternUrl: 'https://ued.united-imaging.com//doc_server//doc_server//resource//src//41e31a4ce57970c49385f10ce87c34e2.patt'
				// patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji'
			})

		}

		function getSourceOrientation() {
			if (!arToolkitSource) {
				return null;
			}

			console.log(
				'actual source dimensions',
				arToolkitSource.domElement.videoWidth,
				arToolkitSource.domElement.videoHeight
			);

			if (arToolkitSource.domElement.videoWidth > arToolkitSource.domElement.videoHeight) {
				console.log('source orientation', 'landscape');
				return 'landscape';
			} else {
				console.log('source orientation', 'portrait');
				return 'portrait';
			}
		}

		// update artoolkit on every frame
		onRenderFcts.push(function () {
			if (!arToolkitContext || !arToolkitSource || !arToolkitSource.ready) {
				return;
			}

			arToolkitContext.update(arToolkitSource.domElement)
		})


		////////////////////////////////////////////////////////////////////////////////
		//          Create a ArMarkerControls
		////////////////////////////////////////////////////////////////////////////////
		// build a smoothedControls
		var smoothedRootStock = new THREE.Group()
		scene.add(smoothedRootStock)
		var smoothedControls = new THREEx.ArSmoothedControls(smoothedRootStock, {
			lerpPosition: 0.4,
			lerpQuaternion: 0.3,
			lerpScale: 1,
		})
		onRenderFcts.push(function (delta) {
			smoothedControls.update(markerRootStock)
		})

		var smoothedRootSnow = new THREE.Group()
		scene.add(smoothedRootSnow)
		var smoothedControls2 = new THREEx.ArSmoothedControls(smoothedRootSnow, {
			lerpPosition: 0.4,
			lerpQuaternion: 0.3,
			lerpScale: 1,
		})
		onRenderFcts.push(function (delta) {
			smoothedControls2.update(markerRootSnow)
		})
		//////////////////////////////////////////////////////////////////////////////////
		//		add an object in the scene
		//////////////////////////////////////////////////////////////////////////////////

		var arWorldRootStock = smoothedRootStock;
		var arWorldRootSnow = smoothedRootSnow;
//###========================================================================================================================
