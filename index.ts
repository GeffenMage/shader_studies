import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Shaders } from './shader_paths.js';
import Stats from 'stats.js';

const LIGHT_COLOR = new THREE.Color(0xffffff); // white
const LIGHT_POS = new THREE.Vector3(0, 5, 10.0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
const loader = new THREE.FileLoader();

const light = new THREE.DirectionalLight(LIGHT_COLOR, 1);
light.position.set(LIGHT_POS.x, LIGHT_POS.y, LIGHT_POS.z);
scene.add(light);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({color: THREE.Color.NAMES.teal}));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
ground.translateZ(-5);
scene.add(ground);

camera.position.z = 5;

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

async function createObject(key: string) {

	const vertPath = Shaders.get(key)?.vertex;
	const fragPath = Shaders.get(key)?.fragment;
	
	let vertShader: string | ArrayBuffer;
	let fragShader: string | ArrayBuffer;

	const decoder = new TextDecoder('utf-8');

	if (!vertPath || !fragPath) {
		console.error("Shader paths not found");
		return;
	}

	vertShader = await loader.loadAsync(vertPath, () => {
		console.log("Loading vertex shader...");
	},);
	
	fragShader = await loader.loadAsync(fragPath, () => {
		console.log("Loading fragment shader...");
	},);

	const geometry = new THREE.SphereGeometry( 1, 32, 32 );

	const material = new THREE.ShaderMaterial({
		uniforms: {
			lightColor: { value: LIGHT_COLOR },
			albedoColor: { value: new THREE.Color(0xffffff) },
			lightPos: { value: LIGHT_POS },
		},
		vertexShader: typeof vertShader === "string" ? vertShader : decoder.decode(vertShader),
		fragmentShader: typeof fragShader === "string" ? fragShader : decoder.decode(fragShader),
	});

	const sphere = new THREE.Mesh( geometry, material );
	return sphere;
}

let crearedObject = await createObject("lambert_diffuse");

window.addEventListener("keyup", (event: KeyboardEvent) => {
	if (event.key == "87") {
		console.log("W");
		crearedObject?.translateY(0.1);
	}
	if (event.key === "83") {
		crearedObject?.translateY(-0.1);
	}
	if (event.key === "65") {
		crearedObject?.translateX(0.1);
	}
	if (event.key === "68") {
		crearedObject?.translateX(-0.1);
	}

	animate();
}, false);


async function addObjectToScene(obj: THREE.Mesh | undefined) {
	if (!obj) return;
	
	scene.add(obj);
}

function animate() {
	stats.begin();
	
	controls.update();
	renderer.render( scene, camera );

	stats.end();
}

addObjectToScene(crearedObject);

renderer.setAnimationLoop( animate );