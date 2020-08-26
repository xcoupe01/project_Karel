// Karel core for Karel project for VUT FIT university and Gymnasium Šlapanice
// Three.js - Load .OBJ - ?
// from https://threejsfundamentals.org/threejs/threejs-load-obj-wat.html

import * as THREE from './three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';

class room{
    constructor(scene){
        this.scene = scene;
    }
    draw(controls, countX, countY){
        this.blockSize = 0.9;
        this.blockGap = 0.05;
        this.blockThickness = 0.1;
        this.placeBlockThickness = 0.25;
        controls.target.set(countX/2 - this.blockSize/2, 0, countY/2 - this.blockSize/2);
        controls.update();
        this.roomDataArray = [];
        for(let currX = 0; currX < countX; currX++){
            this.roomDataArray[currX] = [];
            for(let currY = 0; currY < countY; currY++){
                const geometry = new THREE.BoxGeometry(this.blockSize, this.blockThickness, this.blockSize);
                const material = new THREE.MeshBasicMaterial({color : 0xffffff});
                const cube = new THREE.Mesh(geometry, material);
                const edges = new THREE.EdgesGeometry(geometry);
                const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color : 0x000000}));
                this.scene.add(cube);
                this.scene.add(line);
                cube.position.x = line.position.x = currX * (this.blockSize+this.blockGap);
                cube.position.z = line.position.z = currY * (this.blockSize+this.blockGap);
                this.roomDataArray[currX][currY] = {};
                this.roomDataArray[currX][currY].blocks = 0;
                this.roomDataArray[currX][currY].mark = false;
                this.roomDataArray[currX][currY].blockObjects = [];
                this.roomDataArray[currX][currY].blockObjectsLines = [];
                this.roomDataArray[currX][currY].markObject;
            }
        }
    }
    addBlockToPos(posX, posY){
        const geometry = new THREE.BoxGeometry(this.blockSize, this.placeBlockThickness, this.blockSize);
        const material = new THREE.MeshBasicMaterial({color : 0xff0000});
        const block = new THREE.Mesh(geometry, material);
        const blockEdges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(blockEdges, new THREE.LineBasicMaterial({color : 0xffffff}));
        block.position.x = line.position.x = posX * (this.blockSize+this.blockGap);
        block.position.z = line.position.z = posY * (this.blockSize+this.blockGap);
        block.position.y = line.position.y = this.placeBlockThickness/2 + 0.05 + this.placeBlockThickness * this.roomDataArray[posX][posY].blocks;
        this.roomDataArray[posX][posY].blocks++;
        this.scene.add(block);
        this.scene.add(line);
        this.roomDataArray[posX][posY].blockObjects.push(block);
        this.roomDataArray[posX][posY].blockObjectsLines.push(line);
        if(this.roomDataArray[posX][posY].mark){
            this.updateMark(posX, posY);
        }
    }
    removeBlockFromPos(posX, posY){
        if(this.roomDataArray[posX][posY].blocks > 0){
            this.scene.remove(this.roomDataArray[posX][posY].blockObjects[this.roomDataArray[posX][posY].blockObjects.length - 1]);
            this.scene.remove(this.roomDataArray[posX][posY].blockObjectsLines[this.roomDataArray[posX][posY].blockObjectsLines.length - 1]);
            this.roomDataArray[posX][posY].blockObjects.pop();
            this.roomDataArray[posX][posY].blockObjectsLines.pop();
            this.roomDataArray[posX][posY].blocks--;
            if(this.roomDataArray[posX][posY].mark){
                this.updateMark(posX, posY);
            }
        } else {
            console.log("Failed removeBlockFromPos at [" + posX + "][" + posY + "] - nothing to pick up");
        }
    }
    markPosition(posX, posY){
        if(!this.roomDataArray[posX][posY].mark){
            this.roomDataArray[posX][posY].mark = true;
            const geometry = new THREE.BoxGeometry(this.blockSize, 0, this.blockSize);
            const material = new THREE.MeshBasicMaterial({color : 0xa0ff9e});
            const mark = new THREE.Mesh(geometry, material);
            mark.position.x = posX * (this.blockSize+this.blockGap);
            mark.position.z = posY * (this.blockSize+this.blockGap);
            mark.position.y = 0.06 + this.placeBlockThickness * (this.roomDataArray[posX][posY].blocks);
            this.scene.add(mark);
            this.roomDataArray[posX][posY].markObject = mark;
        } else {
            console.log("Failed markPosition at [" + posX + "][" + posY + "] - already marked");
        }
    }
    unmarkPosition(posX, posY){
        if(this.roomDataArray[posX][posY].mark){
            this.scene.remove(this.roomDataArray[posX][posY].markObject);
            this.roomDataArray[posX][posY].markObject = {};
            this.roomDataArray[posX][posY].mark = false;
        } else {
            console.log("Failed unmarkPosition at [" + posX + "][" + posY + "] - not marked");
        }
    }
    updateMark(posX, posY){
        this.roomDataArray[posX][posY].markObject.position.y = 0.06 + this.placeBlockThickness * (this.roomDataArray[posX][posY].blocks);
    }
}

class karel{
   constructor(scene){
        this.orientation = 0;
        this.positionX = 0;
        this.positionY = 0;
        // graphical object of Karel
        const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9); 
        const material = new THREE.MeshBasicMaterial({color : 0x94a8ff});
        this.graphicalObject = new THREE.Mesh(geometry, material);
        scene.add(this.graphicalObject);
        this.graphicalObject.position.y = 0.55;
        // setting listeners for manual controls
        document.querySelector('#c').addEventListener('keydown', function(event) {
            if(event.keyCode == 87) {
                this.goForward();
            }
            else if(event.keyCode == 68) {
                this.turnRight();
            }
            else if(event.keyCode == 65){
                this.turnLeft();
            }
        });
    }
    turnRight(){
        this.orientation++;
        if(this.orientation > 3){
            this.orientation = 0;
        }
        console.log(this.orientation);
        this.graphicalObject.rotateY(Math.PI/2);
    }
    turnLeft(){
        this.orientation--;
        if(this.orientation < 0){
            this.orientation = 3;
        }
        console.log(this.orientation);
        this.graphicalObject.rotateY(-Math.PI/2);
    }
    goForward(){
        switch(this.orientation){
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }
}

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(10, 10, 10);

  const controls = new OrbitControls(camera, canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('gray');   

  room = new room(scene);
  room.draw(controls, 8, 8);
  room.addBlockToPos(2,2);
  room.addBlockToPos(2,2);
  room.addBlockToPos(2,2);
  room.addBlockToPos(2,2);
  room.removeBlockFromPos(2,2);
  room.markPosition(2,2);
  room.addBlockToPos(2,2);
  karel = new karel(scene);
  karel.turnRight();
  console.log(room.roomDataArray[2][2]);

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
}

main();
