var texture;
var renderer;
var scene;
var camera;
var composer=null;

function init() {

	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	
	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	camera = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, -1.0, 1.0 );
	scene.add( camera );
	
	texture = THREE.ImageUtils.loadTexture("../../Assets/Images/lena.png", THREE.UVMapping, onLoadTexture);
	var txtMaterial = new THREE.MeshBasicMaterial( { 
					map : texture
					} );
	// Plane
	var planeGeometry 	= new THREE.PlaneBufferGeometry(1.0, 1.0, 20, 20);                 
	var plane = new THREE.Mesh( planeGeometry, txtMaterial );
	plane.position.set(0.0, 0.0, -0.5);
	scene.add( plane );	
	
	document.getElementById("WebGL-output").appendChild(renderer.domElement);	
};

function onLoadTexture() {

	renderer.setSize(texture.image.width, texture.image.height);
	
	composer = new THREE.EffectComposer(renderer);
	
	// Cria os passos de renderizacao
	composer.addPass( new THREE.RenderPass(scene, camera));
	
	var grayShaderPass = new THREE.ShaderPass(THREE.grayShader);
	composer.addPass(grayShaderPass);
//	grayShaderPass.renderToScreen = true;

	var smoothShaderPass = new THREE.ShaderPass(THREE.smoothShader);
	smoothShaderPass.uniforms['uPixelSize'].value = new THREE.Vector2(1.0/texture.image.width, 1.0/texture.image.height);
	smoothShaderPass.renderToScreen = true;
	composer.addPass(smoothShaderPass);
	
	composer.render();
	var renderPass = new THREE.RenderPass(scene, camera);
	composer.addPass(renderPass);

	var doNothingShaderPass = new THREE.ShaderPass(THREE.doNothingShader);
	doNothingShaderPass.renderToScreen = true;
	composer.addPass(doNothingShaderPass);

	render();
}

