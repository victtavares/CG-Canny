var scene 			= null;
var renderer		= null;
var composer = null;
var camera 			= null;
var pointLight		= null;
var orbitControls	= null;
var day 			= 0.0;
var year			= 0.0;
var month			= 0.0;
var clock;
var fs_GUI			= 0.1;
var bs_GUI			= 0.1;
var bb_GUI			= 0.1;
var ssb_GUI			= 0.1;
var fh_GUI			= 0.1;
var bh_GUI			= 0.1;
var sbh_GUI			= 0.1;
var matShader		= null;

function init() {

	clock = new THREE.Clock();
	
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(1.0, 1.0, 1.0));
	renderer.setSize(window.innerWidth*0.7, window.innerHeight*0.7);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(60.0, 1.0, 0.1, 1000.0);
	scene.add(camera);
	
	// Controle de Camera Orbital
	orbitControls = new THREE.OrbitControls(camera);
	orbitControls.autoRotate = false;

	loadMeshes();
		
	initGUI();
	renderer.clear();
	//render();
}

function loadMeshes() {
	// Load Mesh
	var loader = new THREE.OBJLoader();
	loader.load('../Assets/Models/mario.obj', buildScene);		
}

function render() {
	var delta = clock.getDelta();
    orbitControls.update(delta);
		
    //renderer.render(scene, camera);
  composer.render();
	requestAnimationFrame(render);
}

function buildScene(loadedMesh) {              

	// Bounding Box	
	var BBox = new THREE.BoundingBoxHelper(loadedMesh, 0xffffff);
	BBox.update();
	
	// Adjust Camera Position and LookAt	
	var maxCoord = Math.max(BBox.box.max.x,BBox.box.max.y,BBox.box.max.z);
	
	camera.position.x 	= 
	camera.position.y 	= 
	camera.position.z 	= maxCoord*1.5;
	camera.far 			= new THREE.Vector3(	maxCoord*2.5, 
												maxCoord*2.5, 
												maxCoord*2.5).length();

	camera.lookAt(new THREE.Vector3(	(BBox.box.max.x + BBox.box.min.x)/2.0,
										(BBox.box.max.y + BBox.box.min.y)/2.0,
										(BBox.box.max.z + BBox.box.min.z)/2.0));
	camera.updateProjectionMatrix();
	
	// Global Axis
	var globalAxis = new THREE.AxisHelper(maxCoord*1.3);
	scene.add( globalAxis );
	
	var light = new THREE.PointLight(0xffffff, 1.0);
	// We want it to be very close to our character
	light.position.set(BBox.box.max.x*1.2, BBox.box.max.y*1.2, BBox.box.max.z*1.2);
	light.name = "light";
	scene.add(light);	
	
	uniforms = {
		uCamPos	: 	{ type: "v3", value:camera.position},
		uLPos	:	{ type: "v3", value:light.position}, 
		fs		:	{ type: "f", value:fs_GUI}, 
		bs		:	{ type: "f", value:bs_GUI}, 
		bb		:	{ type: "f", value:bb_GUI}, 
		ssb		:	{ type: "f", value:ssb_GUI}, 
		fh		: 	{ type: "f", value:fh_GUI},
		bh		:  	{ type: "f", value:bh_GUI},
		sbh		:  	{ type: "f", value:sbh_GUI}
		};
	
	matShader = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById( 'toon-vs' ).textContent,
		fragmentShader: document.getElementById( 'toon-fs' ).textContent
		} );
	

	loadedMesh.traverse(function (child) {	
		if (child instanceof THREE.Mesh) {
			child.material = matShader;
			if ( (child.geometry.attributes.normal != undefined) && (child.geometry.attributes.normal.length == 0)) {
				console.log(child.geometry.attributes.normal.length);
				child.geometry.computeFaceNormals();
				child.geometry.computeVertexNormals();
				child.geometry.normalsNeedUpdate = true;
				}
			}
		});

			scene.add(loadedMesh);

		//Renderizações
		composer = new THREE.EffectComposer(renderer);
		
		composer.addPass( new THREE.RenderPass(scene, camera));
		var grayShaderPass = new THREE.ShaderPass(THREE.grayShader);
		//grayShaderPass.renderToScreen = true;
		composer.addPass(grayShaderPass);

		var smoothShaderPass = new THREE.ShaderPass(THREE.smoothShader);
		smoothShaderPass.uniforms['uPixelSize'].value = new THREE.Vector2(1.0/window.innerWidth*0.7, 1.0/window.innerHeight*0.7);
		//smoothShaderPass.renderToScreen = true;
		composer.addPass(smoothShaderPass);

		var gradientShaderPass = new THREE.ShaderPass(THREE.gradientShader);
		gradientShaderPass.uniforms['uPixelSize'].value = new THREE.Vector2(1.0/window.innerWidth*0.7, 1.0/window.innerHeight*0.7);
		//gradientShaderPass.renderToScreen = true;
		composer.addPass(gradientShaderPass);

		var thresholdingShaderPass = new THREE.ShaderPass(THREE.thresholdingShader);
		thresholdingShaderPass.uniforms['uPixelSize'].value = new THREE.Vector2(1.0/window.innerWidth*0.7, 1.0/window.innerHeight*0.7);
		thresholdingShaderPass.renderToScreen = true;
		composer.addPass(thresholdingShaderPass);

		render();
}


function initGUI() {

	controls = new function () {
		this.fs 	= fs_GUI;
		this.bs 	= bs_GUI;
		this.bb     = bb_GUI;
		this.ssb 	= ssb_GUI;
		this.fh		= fh_GUI;
		this.bh		= bh_GUI;
		this.sbh	= sbh_GUI;
		}

	var gui = new dat.GUI();

	var Mi = gui.addFolder('Mi');
	Mi.add(controls, 'fs', 0.0, 1.0).onChange(function (value) {
		fs_GUI 						= 
		matShader.uniforms.fs.value	=  controls.fs;
		});
	Mi.add(controls, 'bs', 0.0, 1.0).onChange(function (value) {
		bs_GUI 						=
		matShader.uniforms.bs.value	=  controls.bs;
		});	
	Mi.add(controls, 'bb', 0.0, 1.0).onChange(function (value) {
		bb_GUI   					=
		matShader.uniforms.bb.value	=  controls.bb;
		});
	Mi.add(controls, 'ssb', 0.0, 1.0).onChange(function (value) {
		ssb_GUI   					=
		matShader.uniforms.ssb.value=  controls.ssb;
		});
	
	var Vm = gui.addFolder('Vm');
	Vm.add(controls, 'fh', 0.0, 1.0).onChange(function (value) {
		fh_GUI 						= 
		matShader.uniforms.fh.value	=  controls.fh;
		});
	Vm.add(controls, 'bh', 0.0, 1.0).onChange(function (value) {
		bh_GUI   					= 
		matShader.uniforms.bh.value	=  controls.bh;
		});	
	Vm.add(controls, 'sbh', 0.0, 1.0).onChange(function (value) {
		sbh_GUI  					= 
		matShader.uniforms.sbh.value=  controls.sbh;
		});
	
};
