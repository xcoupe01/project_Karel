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
        this.commandList = []; // user defined commands list
        this.conditionList = []; // user defined condition list
        this.running = false; // tells if Karel is executing code
        this.blockProg; // graphical object of block programing window
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
     * Sets Karel to specified language (just the keywords)
     * @param {string} language is the language name (now "czech" and "english")
     */
    languageSetter(language){
        this.langPack = [];
        switch(language){
            case "czech":
                this.langPack.function = "prikaz";
                this.langPack.condition = "podminka";
                this.langPack.end = "konec";
                this.langPack.forward = "krok";
                this.langPack.right = "vpravo";
                this.langPack.left = "vlevo";
                this.langPack.place = "poloz";
                this.langPack.pick = "zvedni";
                this.langPack.placeMark = "oznac";
                this.langPack.unmark = "odznac";
                this.langPack.do = "udelej";
                this.langPack.times = "krat";
                this.langPack.while = "dokud";
                this.langPack.is = "je";
                this.langPack.isNot = "neni";
                this.langPack.wall = "zed";
                this.langPack.brick = "cihla";
                this.langPack.mark = "znacka";
                this.langPack.if = "kdyz";
                this.langPack.then = "tak";
                this.langPack.else = "jinak";
                this.langPack.true = "pravda";
                this.langPack.false = "nepravda";
                break;
            case "english":
                this.langPack.function = "function";
                this.langPack.condition = "condition";
                this.langPack.end = "end";
                this.langPack.forward = "step";
                this.langPack.right = "right";
                this.langPack.left = "left";
                this.langPack.place = "place";
                this.langPack.pick = "pick";
                this.langPack.placeMark = "mark";
                this.langPack.unmark = "unmark";
                this.langPack.do = "do";
                this.langPack.times = "times";
                this.langPack.while = "while";
                this.langPack.is = "is";
                this.langPack.isNot = "isnt";
                this.langPack.wall = "wall";
                this.langPack.brick = "brick";
                this.langPack.mark = "mark";
                this.langPack.if = "if";
                this.langPack.then = "then";
                this.langPack.else = "else";
                this.langPack.true = "true";
                this.langPack.false = "false";
                break;
        }
        this.langPack.reservedWords = [this.langPack.function, this.langPack.condition, this.langPack.end, this.langPack.forward, this.langPack.right,
                this.langPack.left, this.langPack.place, this.langPack.pick, this.langPack.placeMark, this.langPack.unmark, this.langPack.do, 
                this.langPack.times, this.langPack.while, this.langPack.is, this.langPack.isNot, this.langPack.wall, this.langPack.brick,
                this.langPack.mark, this.langPack.if, this.langPack.then, this.langPack.else, this.langPack.true, this.langPack.false];

        this.langPack.functions = [this.langPack.forward, this.langPack.right, this.langPack.left, this.langPack.place, this.langPack.pick,
                this.langPack.placeMark, this.langPack.unmark, this.langPack.true, this.langPack.false];
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
     * Corrects the height of the graphical object of the robot
     */
    correctHeight(){
       this.graphicalObject.position.y = 0.55 + this.room.brickThickness * this.room.roomDataArray[this.positionX][this.positionY].bricks;
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
     * Toggles mark on the position of the robot
     * Used in manual controls
     */
    markSwitch(){
        if(this.room.roomDataArray[this.positionX][this.positionY].mark){
            this.room.unmarkPosition(this.positionX, this.positionY);
        } else {
            this.room.markPosition(this.positionX, this.positionY);
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

    /**
     * Stops Karel from executing code
     */
    stopExecuting(){
        this.running = false;
    }

    /**
     * Tells if Karel is executing code
     */
    getRunning(){
        return this.running;
    }

    /**
     * Executes the code written in editor
     * @param {editor} editor is the editor which contains the code to be executed
     */
    async interpretTextCode(editor){
        if(this.running){
            console.log("ITC error - cannot run multiple programs at the same time");
            return; //cannot run multiple codes at once
        }

        this.running = true;
        var n = editor.selection.getCursor().row;
        var code = editor.getValue().split(/\r?\n/); //cuts the whole string in the editor to lines

        if(!this.textSyntaxChecker(code)){
            this.running = false;
            return;
        }

        var activeCounters = []; //used for DO loops
        var programQueue = [];  //used to jump to other programs and return back (saves position from which was jumped)
        var lastConditionResult = "undef";
        var words = code[n].match(/[^\ ]+/g);

        while(words[0] != this.langPack.function && words[0] != this.langPack.condition){      
            // rolls the code pointer to the begining of function which was selected to be executed
            n --;
            if(n < 0 || code[n] == this.langPack.end){
                console.log("ITC error - function to be executed not found");
                this.running = false;
                return;
            }
            words = code[n].match(/[^\ ]+/g);
        }

        while(this.running){
            editor.gotoLine(n + 1);
            words = code[n].match(/[^\ ]+/g);
            for(var i = 0; i < words.length; i++){ //weird stuff happening with this approach. Need to be redesigned
                switch(words[i]){
                    case this.langPack.function:
                    case this.langPack.condition:
                        i++; //skip the name of the function or condition
                         break;
                    case this.langPack.end:
                        if(programQueue.length == 0){
                            this.running = false;
                            return;
                        } else {
                            n = programQueue[programQueue.length - 1] - 1; //in next step the N will be incremented so we need to substract the addition to maintain the correct jump
                            programQueue.pop();
                        }
                        break;
                    case this.langPack.forward:
                        this.goForward();
                        break;
                    case this.langPack.right:
                        this.turnRight();
                        break;
                    case this.langPack.left:
                        this.turnLeft();
                        break;
                    case this.langPack.place:
                        this.placeBrick();
                        break;
                    case this.langPack.pick:
                        this.pickUpBrick();
                        break;
                    case this.langPack.placeMark:
                        this.markOn();
                        break;
                    case this.langPack.unmark:
                        this.markOff();
                        break;
                    case this.langPack.do:
                        if(parseInt(words[1]) == 0){
                            n = this.codeJumper(this.langPack.do, false, code, n);
                        } else {
                            activeCounters.push(words[1]); 
                        }
                        i += 2; // skips number and times
                        break;
                    case "*" + this.langPack.do:
                        activeCounters[activeCounters.length - 1]--;
                        if(activeCounters[activeCounters.length - 1] > 0){
                            n = this.codeJumper(this.langPack.do, true, code, n);
                        } else {
                            activeCounters.pop();
                        }
                        break;
                    case this.langPack.while:
                        if([this.langPack.wall, this.langPack.brick, this.langPack.mark].includes(words[2])){
                            if(!this.checkBaseCondition(words[1], words[2])){
                                n = this.codeJumper(this.langPack.while, false, code, n);
                            }
                        } else {
                            if(lastConditionResult == "undef"){
                                var found = false;
                                for(var j = 0; j < this.conditionList.length; j++){
                                    if(words[2] == this.conditionList[j][0]){
                                        found = true;
                                        programQueue.push(n);
                                        n = this.conditionList[j][1];
                                    }
                                }
                            } else {
                                if((lastConditionResult == false && words[1] == this.langPack.is) || 
                                    (lastConditionResult == true && words[1] == this.langPack.isNot)){
                                    n = this.codeJumper(this.langPack.while, false, code, n);
                                }
                                lastConditionResult = "undef";
                            }
                        }
                        i += 2; // skips condition prefix and name
                        break;
                    case "*" + this.langPack.while:
                        n = this.codeJumper(this.langPack.while, true, code, n) - 1;
                        break;
                    case this.langPack.if:
                        if([this.langPack.wall, this.langPack.brick, this.langPack.mark].includes(words[2])){
                            if(!this.checkBaseCondition(words[1], words[2])){
                                n = this.codeJumper(this.langPack.if, false, code, n);
                            }
                        } else {
                            if(lastConditionResult == "undef"){
                                var found = false;
                                for(var j = 0; j < this.conditionList.length; j++){
                                    if(words[2] == this.conditionList[j][0]){
                                        found = true;
                                        programQueue.push(n);
                                        n = this.conditionList[j][1];
                                    }
                                }
                            } else {
                                if((lastConditionResult == false && words[1] == this.langPack.is) || 
                                    (lastConditionResult == true && words[1] == this.langPack.isNot)){
                                    n = this.codeJumper(this.langPack.while, false, code, n);
                                }
                                lastConditionResult = "undef";
                            }
                        }
                        i += 2; // skips condition prefix and name
                        break;
                    case this.langPack.else:
                        n = this.codeJumper(this.langPack.if, false, code, n);
                        break;
                    case this.langPack.then:
                    case "*" + this.langPack.if:
                        break;
                    case this.langPack.true:
                        lastConditionResult = true;
                        break;
                    case this.langPack.false:
                        lastConditionResult = false;
                        break;
                    case "#":
                        // skip commentary - not connected yet - TODO
                        i = words.length;
                        break;
                    default:
                        var found = false;
                        for(var j = 0; j < this.commandList.length; j++){
                            if(this.commandList[j][0] == words[i]){
                                //do this command
                                // TODO - also save the position in the line for better jumps
                                programQueue.push(n + 1); //not sure if correct
                                n = this.commandList[j][1];
                                found = true;
                                break;
                            }
                        }
                        if(!found){
                            console.log("ITC error - unexpected word - " + words[i]);
                        }
                }
            }
            n++;
            await sleep(125);
        }
    this.running = false;
    }

    /**
     * Checks syntax of given code
     * @param {Array} code code to be checked
     */
    textSyntaxChecker(code){
        var inDefinition = false; // looking for end of definition
        var activeStructures = [];  
        this.commandList = [];
        this.conditionList = [];

        for(var i = 0; i < code.length; i++){
            var line = code[i].trim();
            if(line.indexOf(' ') > 0){ // split done so i can tell if lane have more then one command, some Karel's commands must be alone on line
                // mutiple commands on one line, function, condition, loops (for, while), if
                var words = line.match(/[^\ ]+/g);
                switch(words[0]){
                    case this.langPack.function:
                        // begin of command definition
                        if(words.length != 2 || inDefinition){
                            // correct number of arguments - FUNCTION
                            console.log("TSC error - wrong funcion definition at line " + i);
                            return false;
                        }
                        for(var j = 0; j < this.commandList.length; j++){
                            // redefinition of user defined command - FUNCTION     TODO - add condition name check ??
                            if(this.commandList[j][0] == words[1]){
                                console.log("TSC error - redefiniton of command at line " + i);
                                return false;
                            }
                        }
                        for(var j = 0; j < this.langPack.reservedWords.length; j++){
                            // definition of command name from reserved list - FUNCTION
                            if(this.langPack.reservedWords[j] == words[1]){
                                console.log("TSC error - redefinition of reserved command at line " + i);
                                return false;
                            }
                        }
                        this.commandList.push([words[1], i]);
                        inDefinition = true;
                        break;
                    case this.langPack.condition:
                        // begin of condition definition - CONDITION
                        if(words.length != 2 || inDefinition){
                            // correct number of arguments
                            console.log("TSC error - wrong funcion definition at line " + i);
                            return false;
                        }
                        for(var j = 0; j < this.conditionList.length; j++){
                            // redefinition of user defined condition - CONDITION   TODO - add command name check ??
                            if(this.conditionList[j][0] == words[1]){
                                console.log("TSC error - redefiniton of command at line " + i);
                                return false;
                            }
                        }
                        for(var j = 0; j < this.langPack.reservedWords.length; j++){
                            // definition of condition name from reserved list - CONDITION
                            if(this.langPack.reservedWords[j] == words[1]){
                                console.log("TSC error - redefinition of reserved command at line " + i);
                                return false;
                            }
                        }
                        this.conditionList.push([words[1], i]);
                        inDefinition = true;
                        break;
                    case this.langPack.do:
                        // checking number of arguments and what are they - DO LOOP
                        if(words.length != 3 || words[2] != this.langPack.times || isNaN(parseInt(words[1])) || !inDefinition){
                            console.log("TSC error - wrong DO definition at line " + i);
                            return false;
                        }
                        activeStructures.push(this.langPack.do);
                        break;
                    case this.langPack.while:
                        // checking number of arguments and what are they - WHILE LOOP
                        if(words.length != 3 || ![this.langPack.is, this.langPack.isNot].includes(words[1]) || !inDefinition){
                            console.log("TSC error - wrong WHILE definiton at line " + i);
                            return false;
                        }
                        // checking if the condition is defined - IF STATEMENT
                        if(![this.langPack.wall, this.langPack.brick, this.langPack.mark].includes(words[2])){
                            var found = false;
                            for(var j = 0; j < this.conditionList.length; j++){
                                if(words[2] == this.conditionList[j][0]){
                                    found = true;
                                }
                            }
                            if(!found){
                                //TODO - rework for it to be able to call conditions written later in the text
                                console.log("TSC error - contition not found at line " + i);
                                return false;
                            }
                        }
                        activeStructures.push(this.langPack.while);
                        break;
                    case this.langPack.if:
                        // checking number of arguments and what are they - IF STATEMENT
                        if(words.length != 3 || ![this.langPack.is, this.langPack.isNot].includes(words[1]) || !inDefinition){
                            console.log("TSC error - wrong IF definition at line " + i);
                            return false;
                        }
                        // checking if the condition is defined - IF STATEMENT
                        if(![this.langPack.wall, this.langPack.brick, this.langPack.mark].includes(words[2])){
                            var found = false;
                            for(var j = 0; j < this.conditionList.length; j++){
                                if(words[2] == this.conditionList[j][0]){
                                    found = true;
                                }
                            }
                            if(!found){
                                //TODO - rework for it to be able to call conditions written later in the text
                                console.log("TSC error - contition not found at line " + i);
                                return false;
                            }
                        }
                        activeStructures.push(this.langPack.if);
                        break;
                    case this.langPack.else:
                    case this.langPack.then:
                        if(activeStructures[activeStructures.length - 1] != this.langPack.if){
                            console.log("TSC error - IF fail, wrong structure at line " + i);
                            return false;
                        }
                        break;
                    default:
                        console.log("TSC warning - uncomplete state entered at line " + i);
                        // words that cannot be here - konec, podminka, prikaz, udelej (all) ... 
                        // search if Karel knows these commands
                }
            } else {
                switch(line){
                    // single commands 
                    case this.langPack.end:
                        if(!inDefinition){
                            console.log("TSC error - wrong end of definiton at line " + i);
                            return false;
                        }
                        if(activeStructures.length > 0){
                            console.log("TSC error - missing end of syntax structure at line " + i);
                            return false;
                        }
                        inDefinition = false;
                        break;
                    case "*" + this.langPack.do:
                        if(activeStructures[activeStructures.length - 1] != this.langPack.do){
                            console.log("TSC error - missing end of structure at line " + i  + " - structure " + activeStructures[activeStructures.length - 1]);
                            return false;
                        }
                        activeStructures.pop();
                        break;
                    case "*" + this.langPack.while:
                        if(activeStructures[activeStructures.length - 1] != this.langPack.while){
                            console.log("TSC error - missing end of structure at line " + i  + " - structure " + activeStructures[activeStructures.length - 1]);
                            return false;
                        }
                        activeStructures.pop();
                        break;
                    case this.langPack.else:
                    case this.langPack.then:
                        if(activeStructures[activeStructures.length - 1] != this.langPack.if){
                            console.log("TSC error - IF fail, wrong structure at line " + i);
                            return false;
                        }
                        break;
                    case "*" + this.langPack.if:
                        if(activeStructures[activeStructures.length - 1] != this.langPack.if){
                            console.log("TSC error - missing end of structure at line " + i  + " - structure " + activeStructures[activeStructures.length - 1])
                        }
                        activeStructures.pop();
                        break;
                    default:
                        var found = false;
                        if(!inDefinition && line == ""){
                            found = true;
                        }
                        for(var j = 0; j < this.langPack.functions.length; j++){
                            if(line == this.langPack.functions[j]){
                                found = true;
                                break;
                            }
                        }
                        if(!found){
                            for(var j = 0; j < this.commandList.length; j++){
                                if(line == this.commandList[j][0]){
                                    found = true;
                                    break;
                                }
                            }
                        }
                        if(!found){
                            //TODO rework so it would also scan codes lower in the text file
                            console.log("TSC error - unknown word at line " + i + " " + line);
                            return false;
                        }
                }
            }
        }
        if(inDefinition){
            console.log("TSC error - missing end of definition at line " + i);
            return false;
        }
        return true;
    }

    /**
     * Evaluates a given basic condition
     * @param {string} prefix is the Karel prefix of condition (is/isnt)
     * @param {string} condition is the condition itself
     */
    checkBaseCondition(prefix, condition){
        // karel is while true
        if(prefix == this.langPack.is){
            // true line
            switch(condition){
                case this.langPack.wall:
                    return this.isWall();
                case this.langPack.brick:
                    return this.isBrick();
                case this.langPack.mark:
                    return this.isMark();
            }
        } else {
            // not line
            switch(condition){
                case this.langPack.wall:
                    return !this.isWall();
                case this.langPack.brick:
                    return !this.isBrick();
                case this.langPack.mark:
            }
        }
        return false;
    }

    /**
     * Makes a specified jump in the code, have special sence for IF constructions
     * @param {string} command is the comand which tells the type of jump
     * @param {boolean} up if true, jumps up, otherwise down
     * @param {array} code is the array of strings of the code
     * @param {number} pos is the actual position in the code
     */
    codeJumper(command, up, code, pos){
        var numSkip = 0;
        if(command == this.langPack.if){
            while(true){
                pos++;
                var words = code[pos].match(/[^\ ]+/g);
                if(words[0] == command){
                    numSkip++;
                } else if(words[0] == "*" + command && numSkip > 0){
                    numSkip--;
                } else if((words[0] == this.langPack.else && numSkip == 0) || (words[0] == "*" + command && numSkip == 0)){
                    return pos;
                }
            }
        }
        if(up){
            while(true){
                pos--;
                var words = code[pos].match(/[^\ ]+/g);
                if(words[0] == "*" + command){
                    numSkip++;
                } else if(words[0] == command && numSkip > 0){
                    numSkip--;
                } else if(words[0] == command && numSkip == 0){
                    return pos;
                }
            }
        } else {
            while(true){
                pos++;
                var words = code[pos].match(/[^\ ]+/g);
                if(words[0] == command){
                    numSkip++;
                } else if(words[0] == "*" + command && numSkip > 0){
                    numSkip--;
                } else if(words[0] == "*" + command && numSkip == 0){
                    return pos;
                }
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}