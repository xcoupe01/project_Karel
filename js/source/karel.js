import * as THREE from '../three/three.module.js';
import {GLTFLoader} from '../three/GLTFLoader.js';
import {room} from './room.js';

/**
 * Class of Karel
 * - graphical and logical representation of robot Karel.
 */
export {karel}; 
class karel{

    /**
     * Connects the object of the robot to the given scene where it should be drawn and the controls of the scene
     * The code will create room to be shown in the scene
     * @param {scene} scene is the scene to be draw to
     * @param {contols} controls are the controls of the camera of the scene
     */
    constructor(scene, controls){
        this.scene = scene;                         // scene handle
        this.controls = controls;                   // controls handle
        this.room = new room(scene);                // creates himself a room to be in
        this.room.draw(controls, 8, 8);             // implicitly the room is 8 by 8
        this.sound = new Audio();                   // audio handle
        this.sound.src = "sounds/karelBeep.mp3";    // connecting file to the handle
        this.maxStepUp = 1;                         // number of bricks that Karel can climb
        this.heightModifier = -0.3;                 // graphical model height modifier
    }

    /**
     * Draws, creates and sets all object and variables needed for robot
     * Position [0,0] orientation [0], 
     * Orientation hint :
     * 0 : down, 1 left, 2 up, 3 right (with base camera)
     */
    draw(){
        this.orientation = 0;
        this.positionX = 0;
        this.positionY = 0;
        // graphical object of Karel
        var karel = this;
        var loader = new GLTFLoader();
        loader.load('objects/karel.glb', function (gltf){
            karel.graphicalObject = gltf.scene;
            karel.graphicalObject.scale.set(0.35, 0.35, 0.35);
            karel.graphicalObject.rotateY(Math.PI);
            karel.graphicalObject.position.y = karel.heightModifier;
            karel.scene.add(karel.graphicalObject);
            karel.correctHeight()
        }, undefined, function (error){
            console.log(error);
        });
        
    }

    /**
     * Erases the robot model from the scene
     */
    erase(){
        this.scene.remove(this.graphicalObject);
    }
    
    /**
     * Corrects the height of the graphical object of the robot
     */
    correctHeight(){
        this.graphicalObject.position.y = this.heightModifier + this.room.brickThickness * this.room.roomDataArray[this.positionX][this.positionY].bricks;
    }

    tellPositionInFrontX(){
        switch(this.orientation){
            case 1:
                return this.positionX + 1;
            case 3:
                return this.positionX - 1;
        }
        return this.positionX;
    }

    tellPosotionInFrontY(){
        switch(this.orientation){
            case 0:
                return this.positionY - 1;
            case 2:
                return this.positionY + 1;
        }
        return this.positionY;
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
        if(this.isVacant()){
            switch(this.orientation){
                case 0:
                    this.positionY--;
                    this.graphicalObject.position.z -= (this.room.blockSize + this.room.blockGap); 
                    break;
                case 1:
                    this.positionX++;
                    this.graphicalObject.position.x += (this.room.blockSize + this.room.blockGap);
                    break;
                case 2:
                    this.positionY++;
                    this.graphicalObject.position.z += (this.room.blockSize + this.room.blockGap);
                    break;
                case 3:
                    this.positionX--;
                    this.graphicalObject.position.x -= (this.room.blockSize + this.room.blockGap);
                    break;
            }
            this.correctHeight();
        }
    }

    /**
     * Places brick in front of the robot.
     * Checks for room limitations.
     */
    placeBrick(){
        if(!this.isWall()){
            this.room.addBrickToPos(this.tellPositionInFrontX(), this.tellPosotionInFrontY());
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
            this.room.removeBrickFromPos(this.tellPositionInFrontX(), this.tellPosotionInFrontY());
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
     * Plays a predefined sound
     */
    beep(){
        this.sound.play();
    }

    /**
     * Teleports Karel to specified position and with specified orientation
     * @param {number} positionX is the X coordinate
     * @param {number} positionY is the Y coordinate
     * @param {number} orientation is the orientation
     */
    teleportToLocation(positionX, positionY, orientation){
        var deltaX = this.positionX - positionX;
        var deltaY = this.positionY - positionY;
        this.positionX = positionX;
        this.positionY = positionY;
        this.graphicalObject.position.x -= deltaX * (this.room.blockSize + this.room.blockGap);
        this.graphicalObject.position.z -= deltaY * (this.room.blockSize + this.room.blockGap);
        this.correctHeight();
        while(this.orientation != orientation){
            this.turnRight();
        }
    }
    
    /**
     * Tells if the robot looks directly to the wall, also checks for the "holes" in the room
     * @returns true if there is a wall in front of Karel
     */
    isWall(){
        switch(this.orientation){
            case 0:
                return this.positionY == 0 || this.room.roomDataArray[this.positionX][this.positionY - 1].inRoom == false;
            case 1:
                return this.positionX == this.room.roomDataArray.length - 1 || this.room.roomDataArray[this.positionX + 1][this.positionY].inRoom == false;
            case 2:
                return this.positionY == this.room.roomDataArray[this.positionX].length - 1 || this.room.roomDataArray[this.positionX][this.positionY + 1].inRoom == false;
            case 3:
                return this.positionX == 0 || this.room.roomDataArray[this.positionX - 1][this.positionY].inRoom == false;
        }
    }

    /**
     * Tells if there is at least one brick in front of robot
     * @returns true if there is at least one brick in fron of Karel
     */
    isBrick(){
        if(this.isWall()){
            return false;
        }
        return this.room.roomDataArray[this.tellPositionInFrontX()][this.tellPosotionInFrontY()].bricks > 0;
    }

    /**
     * Tells if robot stays on mark or not
     * @returns true if there is mark on the current Karel's position
     */
    isMark(){
        return this.room.roomDataArray[this.positionX][this.positionY].mark;
    }

    /**
     * Tells if robot can go to the facing block
     * @returns true if the block in front of him is vacant (so he is able to go there), false otherwise
     */
    isVacant(){
        if(!this.isWall()){
            if(this.room.roomDataArray[this.positionX][this.positionY].bricks + this.maxStepUp >= 
                this.room.roomDataArray[this.tellPositionInFrontX()][this.tellPosotionInFrontY()].bricks){
               return true;
            }
        }
        return false;
    }

    /**
     * Toggles room block activity (aka places wall) in front of Karel
     */
    toggleRoomBlock(){
        if(!this.isWall()){
            this.room.toggleRoomBlockPos(this.tellPositionInFrontX(), this.tellPosotionInFrontY());
        } else {
            console.log("TRB error - cannot toggle block outside of the room at [" + this.tellPositionInFrontX() + "," + this.tellPosotionInFrontY() + "]");
        }
    }

    /**
     * Resizes room to a specified dimensions
     * The dimensions must be greater then 1 and less or equal the 100 for now
     * The current data before calling this method will be forgotten
     * The program asks the user if he really want to delete the old room
     * @param {number} valueX is the X dimension of the new room
     * @param {number} valueY is the Y dimension of the new room
     */
    resizeRoom(valueX, valueY){
        if(typeof valueX != "string" || typeof valueY != "string"){
            console.log("RR error - bad input, not a string");
            return;
        }
        if(isNaN(valueX) || isNaN(valueY)){
            console.log("RR error - input not a number");
            return;
        }
        if(valueX > 100 || valueY > 100){
            console.log("RR error - too large numbers");
            return;
        }
        if(valueX < 1 || valueY < 1){
            console.log("RR error - bad values to resize");
            return;
        }
        var alert = window.confirm("To resize the room I need to remove all stuff present in the room. Is it OK ?");
        if(alert){
            this.room.erase();
            this.room.draw(this.controls, valueX, valueY);
            this.erase();
            this.draw();
        }
    }

    /**
     * Sets the camera and the controls in the room to the starting point
     */
    homeCamera(){
        this.controls.object.position.set(-10, 10, -10);
        this.controls.target.set(
            ((this.room.roomDataArray.length - 1) * (this.room.blockSize + this.room.blockGap)/2),
            0, 
            ((this.room.roomDataArray[0].length - 1) * (this.room.blockSize + this.room.blockGap)/2));
        this.controls.update();
    }

    /**
     * Creates save dictionary (JSON) by actual room state with Karel's position
     * @returns the save dicitionary (JSON)
     */
    saveRoomWithKarel(){
        var saveJson = {};
        saveJson["room"] = this.room.saveRoom();
        saveJson["karel"] = {};
        saveJson["karel"]["position"] = [this.positionX, this.positionY];
        saveJson["karel"]["orientation"] = this.orientation;
        return saveJson;
    }

    /**
     * Sets the room state adn Karel's position in it to match data from specified dictionary (JSON)
     * WARNING - Does not expect bugs in the structure and no checks are made
     * @param {dictionary} dataJson is the state to set the room to
     */
    loadRoomWithKarel(dataJson){
        this.room.loadRoom(this.controls, dataJson["room"]);
        this.teleportToLocation(dataJson["karel"]["position"][0], dataJson["karel"]["position"][1], dataJson["karel"]["orientation"]);
    }

    /**
     * Checks save structure related to Karel and room
     * @param {dictionary} dataJson class karel part of save structure
     * @returns true if the structure is fine, false otherwise
     */
    checkLoadFileKarelAndRoom(dataJson){
        for(var key in dataJson){
            switch(key){
                case "karel":
                    for(var karelKey in dataJson[key]){
                        switch(karelKey){
                            case "orientation":
                                if(typeof dataJson[key][karelKey] != 'number' || dataJson[key][karelKey] < 0 || dataJson[key][karelKey] > 3){
                                    return false;
                                }
                                break;
                            case "position":
                                if(dataJson[key][karelKey].length > 2){
                                    return false;
                                }
                                try{
                                    if(typeof dataJson[key][karelKey][0] != 'number' || dataJson[key][karelKey][0] < 0 ||
                                        dataJson[key][karelKey][0] > Object.keys(dataJson["room"]).length){
                                        return false;
                                    }
                                    if(typeof dataJson[key][karelKey][1] != 'number' || dataJson[key][karelKey][1] < 0 ||
                                        dataJson[key][karelKey][1] > Object.keys(dataJson["room"][0]).length){
                                        return false;
                                    }
                                }
                                catch(err){
                                    return false;
                                }
                                break;
                            default:
                                return false;
                        }
                    }
                    break;
                case "room":
                    if(!this.room.checkLoadFileRoom(dataJson["room"])){
                        return false;
                    }
                    break;
                default:
                    return false;
            }
        }
        return true;
    }

    /**
     * Loads 3D model from file
     */
    test(){
        var scene = this.scene;
        var loader = new GLTFLoader();
        loader.load('objects/karel.glb', function (gltf){
            gltf.scene.scale.set(0.35, 0.35, 0.35);
            gltf.scene.rotateY(Math.PI);
            gltf.scene.position.y = -0.3;
            scene.add(gltf.scene);
        }, undefined, function (error){
            console.log(error);
        });
    }
}