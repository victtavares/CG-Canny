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

	var sobelShaderPass = new THREE.ShaderPass(THREE.kernel3x3Shader);
	var kernel = new THREE.Matrix3;
//	kernel.set(-1.0, 0.0, 1.0, -2.0, 0.0, 2.0, -1.0, 0.0, 1.0);
	kernel.set(-1.0, -2.0, -1.0, 0.0, 0.0, 0.0, 1.0, 2.0, 1.0);
	sobelShaderPass.uniforms['uKernel'].value = kernel;
	sobelShaderPass.uniforms['uPixelSize'].value = new THREE.Vector2(1.0/texture.image.width, 1.0/texture.image.height);
	sobelShaderPass.uniforms['uShift'].value = 0.0;
	sobelShaderPass.renderToScreen = true;
	composer.addPass(sobelShaderPass);
	
	composer.render();
}

