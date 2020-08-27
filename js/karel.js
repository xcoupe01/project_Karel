// Karel core for Karel project for VUT FIT university and Gymnasium Šlapanice
// Three.js - Load .OBJ - ?
// from https://threejsfundamentals.org/threejs/threejs-load-obj-wat.html

import * as THREE from './three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';

/**
 * Class of Karel
 * - graphical and logical representation of robot Karel.
 */
class karel{
    /**
     * Connects the object of the robot to the given scene where it should be drawn and to given room where it should operate
     * @param {*} scene is the scene to be draw to
     * @param {*} room is the room in which tre robot will operate
     */
    constructor(scene, room){
        this.scene = scene;
        this.room = room;
    }
    /**
     * Draws, creates and sets all object and variables needed for robot
     * Position [0,0] orientation [0]
     */
    draw(){
        this.orientation = 0;
        this.positionX = 0;
        this.positionY = 0;
        // graphical object of Karel
        const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9); 
        const material = [
            new THREE.MeshBasicMaterial({color : 0x94a8ff}),
            new THREE.MeshBasicMaterial({color : 0x94a8ff}),
            new THREE.MeshBasicMaterial({color : 0x94a8ff}),
            new THREE.MeshBasicMaterial({color : 0x94a8ff}),
            new THREE.MeshBasicMaterial({color : 0x94a8ff}),
            new THREE.MeshBasicMaterial({color : 0x0073ff}), //front side
            new THREE.MeshBasicMaterial({color : 0x94a8ff}),
        ]
        this.graphicalObject = new THREE.Mesh(geometry, material);
        this.scene.add(this.graphicalObject);
        this.graphicalObject.position.y = 0.55;
    }
    /**
     * Turns robot to the right
     */
    turnRight(){
       this.orientation++;
        if(this.orientation > 3){
            this.orientation = 0;
        }
        console.log(this.orientation);
        this.graphicalObject.rotateY(-Math.PI/2);
    }
    /**
     * Turns robot to the left
     */
    turnLeft(){
        this.orientation--;
        if(this.orientation < 0){
            this.orientation = 3;
        }
        console.log(this.orientation);
        this.graphicalObject.rotateY(Math.PI/2);
    }
    /**
     * Makes step in a given direction, also controls to not get out of the room and for step height limitation
     */
    goForward(){
        const maxStepUp = 1;
        switch(this.orientation){
            case 0:
                if(this.positionY > 0 && 
                    this.room.roomDataArray[this.positionX][this.positionY].blocks + maxStepUp >= 
                    this.room.roomDataArray[this.positionX][this.positionY - 1].blocks){
                   this.positionY--;
                   this.graphicalObject.position.z -= (this.room.blockSize + this.room.blockGap); 
                   this.correctHeight();
               }
               break;
            case 1:
                if(this.positionX < this.room.roomDataArray.length - 1 && 
                    this.room.roomDataArray[this.positionX][this.positionY].blocks + maxStepUp >= 
                    this.room.roomDataArray[this.positionX + 1][this.positionY].blocks){
                    this.positionX++;
                    this.graphicalObject.position.x += (this.room.blockSize + this.room.blockGap);
                    this.correctHeight();
                }
                break;
            case 2:
                if(this.positionY < this.room.roomDataArray[this.positionX].length - 1 && 
                    this.room.roomDataArray[this.positionX][this.positionY].blocks + maxStepUp >= 
                    this.room.roomDataArray[this.positionX][this.positionY + 1].blocks){
                    this.positionY++;
                    this.graphicalObject.position.z += (this.room.blockSize + this.room.blockGap);
                    this.correctHeight();
                }
                break;
            case 3:
                if(this.positionX > 0 && 
                    this.room.roomDataArray[this.positionX][this.positionY].blocks + maxStepUp >= 
                    this.room.roomDataArray[this.positionX - 1][this.positionY].blocks){
                    this.positionX--;
                    this.graphicalObject.position.x -= (this.room.blockSize + this.room.blockGap);
                    this.correctHeight();
                }
                break;
        }
    }
    /**
     * Corrects the height of the graphical object of the robot
     */
    correctHeight(){
       this.graphicalObject.position.y = 0.55 + this.room.placeBlockThickness * this.room.roomDataArray[this.positionX][this.positionY].blocks;
    }
    /**
     * Places block in front of the robot.
     * Checks for room limitations.
     */
    placeBlock(){
        switch(this.orientation){
            case 0:
                if(this.positionY > 0){
                    this.room.addBlockToPos(this.positionX, this.positionY - 1);
               }
               break;
            case 1:
                if(this.positionX < this.room.roomDataArray.length - 1){
                    this.room.addBlockToPos(this.positionX + 1, this.positionY);
                }
                break;
            case 2:
                if(this.positionY < this.room.roomDataArray[this.positionX].length - 1){
                    this.room.addBlockToPos(this.positionX, this.positionY + 1);
                }
                break;
            case 3:
                if(this.positionX > 0){
                    this.room.addBlockToPos(this.positionX - 1, this.positionY);
                }
                break;
        }
    }
    /**
     * Picks up block in front of the robot
     * Checks for room limitation
     */
    pickUpBlock(){
        switch(this.orientation){
            case 0:
                if(this.positionY > 0){
                    this.room.removeBlockFromPos(this.positionX, this.positionY - 1);
               }
               break;
            case 1:
                if(this.positionX < this.room.roomDataArray.length - 1){
                    this.room.removeBlockFromPos(this.positionX + 1, this.positionY);
                }
                break;
            case 2:
                if(this.positionY < this.room.roomDataArray[this.positionX].length - 1){
                    this.room.removeBlockFromPos(this.positionX, this.positionY + 1);
                }
                break;
            case 3:
                if(this.positionX > 0){
                    this.room.removeBlockFromPos(this.positionX - 1, this.positionY);
                }
                break;
        }
    }
    /**
     * Toggles mark on the position of the robot
     */
    markSwitch(){
        if(this.room.roomDataArray[this.positionX][this.positionY].mark){
            this.room.unmarkPosition(this.positionX, this.positionY);
        } else {
            this.room.markPosition(this.positionX, this.positionY);
        }
    }
}

 /**
  * Class of room
  * - graphical and logical representation of room
  * - when the room is on its basic position (at the start of the app) the X axis is from left to middle and the Y axis is from middle to right
  */
class room{
    /**
     * Connects the room object to the scene where it should be drawn
     * @param {*} scene is the scene where we want the room to be drawn
     */
    constructor(scene){
        this.scene = scene;
    }
    /**
     * Draws the room and sets all its variables and arrays.
     * @param {*} controls is the controls of the scene which will be altered here to point at the centre of the room
     * @param {*} countX is the count of blocks in the room in X axis
     * @param {*} countY is the count of blocks in the room in Y axis
     */
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
    /**
     * Adds block to a specified position in the room
     * Also handles all graphical objects and saves them into the roomDataArray
     * @param {*} posX is the X axis coordinate
     * @param {*} posY is the Y axis coordinate
     */
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
    /**
     * Removes block from a specified position in the room
     * Also handles all graphical objects and saves changes into the roomDataArray
     * @param {*} posX is the X axis coordinate
     * @param {*} posY is the Y axis coordinate
     */
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
    /**
     * Marks a specified position in the room
     * Also handles all graphical objects and saves them into the roomDataArray
     * @param {*} posX is the X axis coordinate
     * @param {*} posY is the Y axis coordinate
     */
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
    /**
     * Removes mark from the room on the specified position
     * Also handles all graphical objects and saves them into the roomDataArray
     * @param {*} posX is the X axis coordinate
     * @param {*} posY is the Y axis coordinate
     */
    unmarkPosition(posX, posY){
        if(this.roomDataArray[posX][posY].mark){
            this.scene.remove(this.roomDataArray[posX][posY].markObject);
            this.roomDataArray[posX][posY].markObject = {};
            this.roomDataArray[posX][posY].mark = false;
        } else {
            console.log("Failed unmarkPosition at [" + posX + "][" + posY + "] - not marked");
        }
    }
    /**
     * Updates a mark height based on number of blocks on a specified position
     * @param {*} posX is the X axis coordinate
     * @param {*} posY is the Y axis coordinate
     */
    updateMark(posX, posY){
        this.roomDataArray[posX][posY].markObject.position.y = 0.06 + this.placeBlockThickness * (this.roomDataArray[posX][posY].blocks);
    }
}

/**
 * Starting function, that creates the main structures and generate the main objects of the app
 * sets camera scene ect
 */
function start() {
    const canvas = document.querySelector('#c');
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

    room = new room(scene);
    room.draw(controls, 8, 8);
    karel = new karel(scene, room);
    document.querySelector('#c').addEventListener('keydown', function(event) {
    if(event.keyCode == 87) {
            karel.goForward();
        }
        else if(event.keyCode == 68) {
            karel.turnRight();
        }
        else if(event.keyCode == 65){
            karel.turnLeft();
        }
        else if(event.keyCode == 80){
            karel.placeBlock();
        }
        else if(event.keyCode == 90){
            karel.pickUpBlock();
        }
        else if(event.keyCode == 79){
            karel.markSwitch();
        }
    });
    karel.draw();
    console.log(room.roomDataArray[2][2]);
    console.log(karel);

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

start();
