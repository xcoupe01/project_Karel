import * as THREE from '../three/three.module.js';

/**
 * Class of Karel
 * - graphical and logical representation of robot Karel.
 */
export {karel};
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
