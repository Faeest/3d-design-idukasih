import * as THREE from "three";

import Stats from "three/addons/libs/stats.module.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";


const clock = new THREE.Clock();
const container = document.getElementById("3d-container");
if (!container) console.error("Container not Preserved!");
const stats = new Stats();
if (DEBUG) container.appendChild(stats.dom);
const getDimension = (x = true) => {
	let w = container.clientWidth;
	if (w > 896) {
		w = 896;
	}
	if (x == "x" || x == "X" || x == true) {
		return w;
	} else if (x == "y" || x == "Y" || x == false) {
		return (w / 16) * 9;
	}
};
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(getDimension("x"), getDimension("y"));
container.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);

const scene = new THREE.Scene();
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

const camera = new THREE.PerspectiveCamera(50, getDimension("x") / getDimension("y"));
camera.position.set(1.5, 1.5, 1.5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
controls.autoRotate = true;
controls.enablePan = false;
controls.enableDamping = true;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("jsm/libs/draco/gltf/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load(
	"assets/crate_box/scene.gltf",
	function (gltf) {
		const model = gltf.scene;
		model.scale.set(0.015, 0.015, 0.015);
		model.up.set(0,0,0)
		model.position.set(0,-0.5,0)
		model.name = "theModel";
		scene.add(model);
		animate();
	},
	undefined,
	function (e) {
		console.error(e);
	}
);

window.onresize = function () {
	camera.aspect = getDimension("x") / getDimension("y");
	camera.updateProjectionMatrix();

	renderer.setSize(getDimension("x"), getDimension("y"));
};
function animate() {
	requestAnimationFrame(animate);
	if (DEBUG && clock.getElapsedTime() % 1 == 0) {
		document.querySelectorAll("*").forEach((e) => (e.style.outline = "grey 1px solid"));
	}
	const delta = clock.getDelta();
	controls.update();
	if (DEBUG) stats.update();
	renderer.render(scene, camera);
}
