// Karel core for Karel project for VUT FIT university and Gymnasium Šlapanice
// Three.js - Load .OBJ - ?
// from https://threejsfundamentals.org/threejs/threejs-load-obj-wat.html

import {karel} from './source/karel.js'
import {room} from './source/room.js'
import * as THREE from './three/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';

/**
 * Starting function, that creates the main structures and generate the main objects of the app
 * sets camera scene ect
 */
function start() {
    const canvas = document.querySelector('#roomCanvas');
    const renderer = new THREE.WebGLRenderer({canvas});

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-10, 10, -10);

    const controls = new OrbitControls(camera, canvas);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('gray');  

    var mainRoom = new room(scene);
    mainRoom.draw(controls, 8, 8);
    var mainKarel = new karel(scene, mainRoom);
    document.querySelector('#roomCanvas').addEventListener('keydown', function(event) {
    if(event.keyCode == 87 && !mainKarel.getRunning()){
            mainKarel.goForward();
        }
        else if(event.keyCode == 68 && !mainKarel.getRunning()){
            mainKarel.turnRight();
        }
        else if(event.keyCode == 65 && !mainKarel.getRunning()){
            mainKarel.turnLeft();
        }
        else if(event.keyCode == 80 && !mainKarel.getRunning()){
            mainKarel.placeBrick();
        }
        else if(event.keyCode == 90 && !mainKarel.getRunning()){
            mainKarel.pickUpBrick();
        }
        else if(event.keyCode == 79 && !mainKarel.getRunning()){
            mainKarel.markSwitch();
        }
    });

    mainKarel.draw();
    mainKarel.languageSetter("czech");

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    }

  requestAnimationFrame(render);
  return mainKarel;
}

var mainKarel = start();
document.querySelector('#run').onclick = function() {mainKarel.interpretTextCode(editor)};
document.querySelector('#stop').onclick = function() {mainKarel.stopExecuting()};
document.querySelector('#test').onclick = function() { 
    var x = document.getElementById("textEditor");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
};
