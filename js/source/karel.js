import * as THREE from '../three/three.module.js';

/**
 * Class of Karel
 * - graphical and logical representation of robot Karel.
 */
export {karel}; 
class karel{

    /**
     * Connects the object of the robot to the given scene where it should be drawn and to given room where it should operate
     * @param {scene} scene is th   console.log("bing");e scene to be draw to
     * @param {room} room is the room in which tre robot will operate
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
        const geometry = new THREE.BoxGeometry(this.room.blockSize, this.room.blockSize, this.room.blockSize); 
        const material = [
            new THREE.MeshBasicMaterial({color : 0x94a8ff}), //right side
            new THREE.MeshBasicMaterial({color : 0x94a8ff}), //left side
            new THREE.MeshBasicMaterial({color : 0x94a8ff}), //top side
            new THREE.MeshBasicMaterial({color : 0x94a8ff}), //bottom side
            new THREE.MeshBasicMaterial({color : 0x94a8ff}), //front side
            new THREE.MeshBasicMaterial({color : 0x0073ff})  //back side
        ]
        this.graphicalObject = new THREE.Mesh(geometry, material);
        this.scene.add(this.graphicalObject);
        this.graphicalObject.position.y = 0.55;
    }
    
     /**
     * Corrects the height of the graphical object of the robot
     */
    correctHeight(){
        this.graphicalObject.position.y = 0.55 + this.room.brickThickness * this.room.roomDataArray[this.positionX][this.positionY].bricks;
     }

    /**
     * Turns robot to the right
     */
    turnRight(){
       this.orientation++;
        if(this.orientation > 3){
            this.orientation = 0;
        }
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
        this.graphicalObject.rotateY(Math.PI/2);
    }

    /**
     * Makes step in a given direction, also controls to not get out of the room and for step height limitation
     */
    goForward(){
        const maxStepUp = 1; // number of bricks that Karel can climb
        if(!this.isWall()){
            switch(this.orientation){
                case 0:
                    if(this.room.roomDataArray[this.positionX][this.positionY].bricks + maxStepUp >= 
                        this.room.roomDataArray[this.positionX][this.positionY - 1].bricks){
                       this.positionY--;
                       this.graphicalObject.position.z -= (this.room.blockSize + this.room.blockGap); 
                       this.correctHeight();
                   }
                   break;
                case 1:
                    if(this.room.roomDataArray[this.positionX][this.positionY].bricks + maxStepUp >= 
                        this.room.roomDataArray[this.positionX + 1][this.positionY].bricks){
                        this.positionX++;
                        this.graphicalObject.position.x += (this.room.blockSize + this.room.blockGap);
                        this.correctHeight();
                    }
                    break;
                case 2:
                    if(this.room.roomDataArray[this.positionX][this.positionY].bricks + maxStepUp >= 
                        this.room.roomDataArray[this.positionX][this.positionY + 1].bricks){
                        this.positionY++;
                        this.graphicalObject.position.z += (this.room.blockSize + this.room.blockGap);
                        this.correctHeight();
                    }
                    break;
                case 3:
                    if(this.room.roomDataArray[this.positionX][this.positionY].bricks + maxStepUp >= 
                        this.room.roomDataArray[this.positionX - 1][this.positionY].bricks){
                        this.positionX--;
                        this.graphicalObject.position.x -= (this.room.blockSize + this.room.blockGap);
                        this.correctHeight();
                    }
                    break;
            }
        }
    }

    /**
     * Places brick in front of the robot.
     * Checks for room limitations.
     */
    placeBrick(){
        if(!this.isWall()){
            switch(this.orientation){
                case 0:
                    this.room.addBrickToPos(this.positionX, this.positionY - 1);
                    break;
                case 1:
                    this.room.addBrickToPos(this.positionX + 1, this.positionY);
                    break;
                case 2:
                    this.room.addBrickToPos(this.positionX, this.positionY + 1);
                    break;
                case 3:
                    this.room.addBrickToPos(this.positionX - 1, this.positionY);
                    break;
            }
        } else {
            console.log("PlB error - cannot place brick to wall")
        }
        
    }

    /**
     * Picks up brick in front of the robot
     * Checks for room limitation
     */
    pickUpBrick(){
        if(!this.isWall()){
            switch(this.orientation){
                case 0:
                    this.room.removeBrickFromPos(this.positionX, this.positionY - 1);
                    break;
                case 1:
                    this.room.removeBrickFromPos(this.positionX + 1, this.positionY);
                    break;
                case 2:
                    this.room.removeBrickFromPos(this.positionX, this.positionY + 1);
                    break;
                case 3:
                    this.room.removeBrickFromPos(this.positionX - 1, this.positionY);
                    break;
            }
        } else {
            console.log("PiB error - cannot pic up outside the room");
        }
    }

    /**
     * Marks current roboths location
     * Used in code
     */
    markOn(){
        this.room.markPosition(this.positionX, this.positionY);
    }
    /**
     * Unmarks current robot location
     * Used in code
     */
    markOff(){
        this.room.unmarkPosition(this.positionX, this.positionY);
    }

    /**
     * Toggles mark on the position of the robot
     * Used in manual controls
     */
    markSwitch(){
        if(this.room.roomDataArray[this.positionX][this.positionY].mark){
            this.markOff();
        } else {
            this.markOn();
        }
    }
    
    /**
     * Tells if the robot looks directly to the wall
     * TODO - add placable walls (if karel cant go (more then 1 brick step) => wall ??)
     */
    isWall(){
        switch(this.orientation){
            case 0:
                return this.positionY == 0;
            case 1:
                return this.positionX == this.room.roomDataArray.length - 1;
            case 2:
                return this.positionY == this.room.roomDataArray[this.positionX].length - 1;
            case 3:
                return this.positionX == 0;
        }
    }

    /**
     * Tells if there is at least one brick in front of robot
     */
    isBrick(){
        if(this.isWall()){
            return false;
        }
        switch(this.orientation){
            case 0:
                return this.room.roomDataArray[this.positionX][this.positionY - 1].bricks > 0;
            case 1:
                return this.room.roomDataArray[this.positionX + 1][this.positionY].bricks > 0;
            case 2:
                return this.room.roomDataArray[this.positionX][this.positionY + 1].bricks > 0;
            case 3:
                return this.room.roomDataArray[this.positionX - 1][this.positionY].bricks > 0;
        }
    }

    /**
     * Tells if robot stays on mark or not
     */
    isMark(){
        return this.room.roomDataArray[this.positionX][this.positionY].mark;
    }
}