var texture;
var renderer;
var scene;
var camera;

function init() {

	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	
	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	camera = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, -1.0, 1.0 );
	scene.add( camera );
	
	texture = THREE.ImageUtils.loadTexture("../../Assets/Images/lena.png", THREE.UVMapping, onLoadTexture);
	
	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	renderer.clear();
};


function onLoadTexture() {

	renderer.setSize(texture.image.width, texture.image.height);
	
	uniforms = {
		uSampler: 	{ type: "t", value:texture },
		uPixelSize:	{ type: "v2", value: new THREE.Vector2(1.0/texture.image.width, 1.0/texture.image.height) } 
		};
	
	var matShader = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById( 'suaviza-vs' ).textContent,
			fragmentShader: document.getElementById( 'suaviza-fs' ).textContent
			} );
	
	// Plane
	var planeGeometry = new THREE.PlaneBufferGeometry(1.0, 1.0, 20, 20);                 
	var plane = new THREE.Mesh( planeGeometry, matShader );
	plane.position.set(0.0, 0.0, -0.5);
	scene.add( plane );	

	renderer.render(scene, camera);
}

