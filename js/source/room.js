import * as THREE from '../three/three.module.js';
/**
  * Class of room
  * - graphical and logical representation of room
  * - when the room is on its basic position (at the start of the app) the X axis is from left to middle and the Y axis is from middle to right
  */
export{room};
class room{
    /**
     * Connects the room object to the scene where it should be drawn
     * @param {scene} scene is the scene where we want the room to be drawn
     */
    constructor(scene){
        this.scene = scene;
    }
    /**
     * Draws the room and sets all its variables and arrays.
     * @param {controls} controls is the controls of the scene which will be altered here to point at the centre of the room
     * @param {number} countX is the count of blocks in the room in X axis
     * @param {number} countY is the count of blocks in the room in Y axis
     */
    draw(controls, countX, countY){
        this.blockSize = 0.9;
        this.blockGap = 0.05;
        this.blockThickness = 0.1;
        this.brickThickness = 0.25;
        controls.target.set(countX/2 * this.blockSize/2, 0, countY/2 * this.blockSize/2);
        controls.update();
        this.roomDataArray = [];
        for(var currX = 0; currX < countX; currX++){
            this.roomDataArray[currX] = [];
            for(var currY = 0; currY < countY; currY++){
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
                this.roomDataArray[currX][currY].blockObject = {};
                this.roomDataArray[currX][currY].blockObject.cube = cube;
                this.roomDataArray[currX][currY].blockObject.line = line;
                this.roomDataArray[currX][currY].bricks = 0;
                this.roomDataArray[currX][currY].mark = false;
                this.roomDataArray[currX][currY].brickObjects = [];
                this.roomDataArray[currX][currY].brickObjectsLines = [];
                this.roomDataArray[currX][currY].markObject;
                this.roomDataArray[currX][currY].inRoom = true;
            }
        }
    }

    /**
     * Erases every object of the room (all blocks, bricks marks ect.)
     * Room does not inluce Karel in this case (Karel wont be erased)
     */
    erase(){
        for(var currX = 0; currX < this.roomDataArray.length; currX++){
            for(var currY = 0; currY < this.roomDataArray[currX].length; currY++){
                if(this.roomDataArray[currX][currY].mark){
                    this.scene.remove(this.roomDataArray[currX][currY].markObject);
                }
                while(this.roomDataArray[currX][currY].bricks > 0){
                    this.removeBrickFromPos(currX, currY);
                }
                this.scene.remove(this.roomDataArray[currX][currY].blockObject.cube);
                this.scene.remove(this.roomDataArray[currX][currY].blockObject.line);
            }
        }
    }

    /**
     * Adds brick to a specified position in the room
     * Also handles all graphical objects and saves them into the roomDataArray
     * Controls if the brick is in the room
     * @param {number} posX is the X axis coordinate
     * @param {number} posY is the Y axis coordinate
     */
    addBrickToPos(posX, posY){
        if(posX >= this.roomDataArray.length || posY >= this.roomDataArray[posX].length){
            console.log("ROOM ABTP error - cannot add brick out of room");
            return;
        }
        const geometry = new THREE.BoxGeometry(this.blockSize, this.brickThickness, this.blockSize);
        const material = new THREE.MeshBasicMaterial({color : 0xff0000});
        const brick = new THREE.Mesh(geometry, material);
        const brickEdges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(brickEdges, new THREE.LineBasicMaterial({color : 0xffffff}));
        brick.position.x = line.position.x = posX * (this.blockSize+this.blockGap);
        brick.position.z = line.position.z = posY * (this.blockSize+this.blockGap);
        brick.position.y = line.position.y = this.brickThickness/2 + 0.05 + this.brickThickness * this.roomDataArray[posX][posY].bricks;
        this.roomDataArray[posX][posY].bricks++;
        this.scene.add(brick);
        this.scene.add(line);
        this.roomDataArray[posX][posY].brickObjects.push(brick);
        this.roomDataArray[posX][posY].brickObjectsLines.push(line);
        if(this.roomDataArray[posX][posY].mark){
            this.updateMark(posX, posY);
        }
    }

    /**
     * Removes brick from a specified position in the room
     * Also handles all graphical objects and saves changes into the roomDataArray
     * Controls if the coordinates are in the room
     * @param {number} posX is the X axis coordinate
     * @param {number} posY is the Y axis coordinate
     */
    removeBrickFromPos(posX, posY){
        if(posX >= this.roomDataArray.length || posY >= this.roomDataArray[posX].length){
            console.log("ROOM RBFP error - cannot remove brick out of room");
            return;
        }
        if(this.roomDataArray[posX][posY].bricks > 0){
            this.scene.remove(this.roomDataArray[posX][posY].brickObjects[this.roomDataArray[posX][posY].brickObjects.length - 1]);
            this.scene.remove(this.roomDataArray[posX][posY].brickObjectsLines[this.roomDataArray[posX][posY].brickObjectsLines.length - 1]);
            this.roomDataArray[posX][posY].brickObjects.pop();
            this.roomDataArray[posX][posY].brickObjectsLines.pop();
            this.roomDataArray[posX][posY].bricks--;
            if(this.roomDataArray[posX][posY].mark){
                this.updateMark(posX, posY);
            }
        } else {
            console.log("ROOM RBFP error - nothing to pick up at [" + posX + "][" + posY + "]");
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
            mark.position.y = 0.06 + this.brickThickness * (this.roomDataArray[posX][posY].bricks);
            this.scene.add(mark);
            this.roomDataArray[posX][posY].markObject = mark;
        } else {
            console.log("Failed markPosition at [" + posX + "][" + posY + "] - already marked");
        }
    }

    /**
     * Removes mark from the room on the specified position
     * Also handles all graphical objects and saves them into the roomDataArray
     * @param {number} posX is the X axis coordinate
     * @param {number} posY is the Y axis coordinate
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
     * Updates a mark height based on number of bricks on a specified position
     * @param {number} posX is the X axis coordinate
     * @param {number} posY is the Y axis coordinate
     */
    updateMark(posX, posY){
        this.roomDataArray[posX][posY].markObject.position.y = 0.06 + this.brickThickness * (this.roomDataArray[posX][posY].bricks);
    }

    /**
     * Makes walls in the room by removing given block. It erases and blocks block on a given position
     * @param {*} posX is the X coordinate of the block to be removed
     * @param {*} posY is the Y coordinate of the block to be removed
     */
    removeBlockFromRoomPos(posX, posY){
        if(!this.roomDataArray[posX][posY].inRoom){
            console.log("RBFRP error - block already removed at [" + posX + "," + posY + "]");
            return;
        }
        if(this.roomDataArray[posX][posY].bricks > 0){
            console.log("RBFRP error - cannot remove becase of bricks at [" + posX + "," + posY + "]");
            return;
        }
        if(this.roomDataArray[posX][posY].mark){
            console.log("RBFRP error - cannot remove becase of mark at [" + posX + "," + posY + "]");
            return;
        }
        this.scene.remove(this.roomDataArray[posX][posY].blockObject.cube);
        this.scene.remove(this.roomDataArray[posX][posY].blockObject.line);
        this.roomDataArray[posX][posY].inRoom = false;
    }

    /**
     * Restores erased block by function `removeBlockFromPos`. It activate given block and draws him back
     * @param {*} posX is the X coordinate of the block to be activated
     * @param {*} posY is the Y coordinate of the block to be activated
     */
    putBlockToRoomPos(posX, posY){
        if(this.roomDataArray[posX][posY].inRoom){
            console.log("PBTRP error - block already present at [" + posX + "," + posY + "]");
            return;
        }
        this.scene.add(this.roomDataArray[posX][posY].blockObject.cube);
        this.scene.add(this.roomDataArray[posX][posY].blockObject.line);
        this.roomDataArray[posX][posY].inRoom = true;
    }

    /**
     * Toggles given block active status
     * @param {*} posX is the X coordinate of the block to be toggled
     * @param {*} posY is the Y coordinate of the block to be toggled
     */
    toggleRoomBlockPos(posX, posY){
        if(this.roomDataArray[posX][posY].inRoom){
            this.removeBlockFromRoomPos(posX, posY);
        } else {
            this.putBlockToRoomPos(posX, posY);
        }
    }
}