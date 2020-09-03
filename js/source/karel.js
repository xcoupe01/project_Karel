import * as THREE from '../three/three.module.js';

/**
 * Class of Karel
 * - graphical and logical representation of robot Karel.
 */
export {karel}; 
class karel{
    /**
     * Connects the object of the robot to the given scene where it should be drawn and to given room where it should operate
     * @param {*} scene is th   console.log("bing");e scene to be draw to
     * @param {*} room is the room in which tre robot will operate
     */
    constructor(scene, room){
        this.scene = scene;
        this.room = room;
        this.commandList = []; // user defined commands list
        this.conditionList = []; // user defined condition list
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
     * Sets Karel to specified language (just the keywords)
     * @param {*} language is the language name (now "czech" and "english")
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
                this.langPack.reservedWords = ["prikaz", "podminka", "konec", "krok", "vpravo",
                    "vlevo", "poloz", "zvedni", "oznac", "odznac", "udelej", "krat", "dokud", "je",
                    "neni", "zed", "cihla", "znacka", "kdyz", "tak", "jinak"];
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
                this.langPack.mark = "mark";
                this.langPack.unmark = "unmark";
                this.langPack.do = "fo";
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
                this.langPack.reservedWords = ["function", "condition", "end", "step", "right", 
                    "left", "place", "pick", "mark", "unmark", "do", "times", "while", "is", "isnt",
                    "wall", "brick", "mark", "if", "then", "else"];
                break;
        }
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
     * TODO add placable walls
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
                return this.room.roomDataArray[this.positionX][this.positionY - 1].blocks > 0;
            case 1:
                return this.room.roomDataArray[this.positionX + 1][this.positionY].blocks > 0;
            case 2:
                return this.room.roomDataArray[this.positionX][this.positionY + 1].blocks > 0;
            case 3:
                return this.room.roomDataArray[this.positionX - 1][this.positionY].blocks > 0;
        }
    }

    /**
     * Tells if robot stays on mark or not
     */
    isMark(){
        return this.room.roomDataArray[this.positionX][this.positionY].mark;
    }

    /**
     * Executes the code written in editor
     * @param {*} editor is the editor which contains the code to be executed
     * TODO - make it work - redo udelej
     */
    async interpretTextCode(editor){
        var n = editor.selection.getCursor().row;
        var code = editor.getValue();
        code = code.match(/[^\n]+/g); //cuts the whole string in the editor to words
        if(this.textSyntaxChecker(code)){
            // rolls the code pointer to the begining of function which was selected to be executed
            for(var i = 0 ; i < code.lenght; i ++){
                code[i] = code[i].trim();
            }
            var words = code[n].match(/[^\ ]+/g);
            while(words[0] != this.langPack.function){
                n --;
                if(n < 0 || code[n] == this.langPack.end){
                    console.log("ITC error - function to be executed not found");
                    return;
                }
                words = code[n].match(/[^\ ]+/g);
            }
            // primitive function to execute the code
            var activeCounters = []; //used for DO loops
            while(true){
                editor.gotoLine(n + 1);
                words = code[n].match(/[^\ ]+/g);
                for(var i = 0; i < words.length; i++){ //weird stuff happening with this approach. Need to be redesigned
                    switch(words[i]){
                        case this.langPack.function:
                            i++; //skip the name of the function
                            break;
                        case this.langPack.end: //never happen
                            return;
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
                            this.placeBlock();
                            break;
                        case this.langPack.pick:
                            this.pickUpBlock();
                            break;
                        case this.langPack.placeMark:
                            this.markOn();
                            break;
                        case this.langPack.unmark:
                            this.markOff();
                            break;
                        case this.langPack.do:
                            if(parseInt(words[1] == 0)){
                                n = this.codeJumper(this.langPack.do, false, code, n);
                            } else {
                                activeCounters.push(words[1]);
                                i += 2;  
                            }
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
                            if(!this.checkCondition(words[1], words[2])){
                                n = this.codeJumper(this.langPack.while, false, code, n);
                            }
                            i += 2;
                            break;
                        case "*" + this.langPack.while:
                            n = this.codeJumper(this.langPack.while, true, code, n) - 1;
                            break;
                        case this.langPack.if:
                            if(!this.checkCondition(words[1], words[2])){
                                n = this.codeJumper(this.langPack.if, false, code, n);
                            }
                            i += 2;
                            break;
                        case this.langPack.else:
                            n = this.codeJumper(this.langPack.if, false, code, n);
                            break;
                        case this.langPack.then:
                        case "*" + this.langPack.if:
                            break;
                        default:
                            console.log("ITC error - weird word - " + words[i]);
                    }
                }
                n++;
                await sleep(125);
            }
        }
        //console.log(this.commandList);
        //console.log(activeCounters);
    }

    /**
     * Checks syntax of given code
     * @param {*} code code to be checked
     * TODO - add while anf if structures
     */
    textSyntaxChecker(code){
        var inDefinition = false; // looking for end of definition
        var activeStructures = [];
        this.commandList = [];
        this.conditionList = [];
        for(var i = 0; i < code.length; i++){
            var line = code[i].trim();
            if(line.indexOf(' ') > 0){
                // mutiple commansd on one line, function, condition, loops (for, while), if
                var words = line.match(/[^\ ]+/g);
                for(var j = 0; j < words.lenght; j++){
                    words[j] = words[j].trim();
                }
                switch(words[0]){
                    case this.langPack.function:
                        // begin of command definition
                        if(words.length != 2 || inDefinition){
                            // correct number of arguments
                            console.log("TSC error - wrong funcion definition at line " + i);
                            return false;
                        }
                        for(var j = 0; j < this.commandList.length; j++){
                            // redefinition of user defined command
                            if(this.commandList[j][0] == words[1]){
                                console.log("TSC error - redefiniton of command at line " + i);
                                return false;
                            }
                        }
                        for(var j = 0; j < this.langPack.reservedWords.length; j++){
                            // definition of command name from reserved list
                            if(this.langPack.reservedWords[j] == words[1]){
                                console.log("TSC error - redefinition of reserved command at line " + i);
                                return false;
                            }
                        }
                        this.commandList.push([words[1], i]);
                        inDefinition = true;
                        break;
                    case this.langPack.condition:
                        // begin of condition definition
                        if(words.length != 2 || inDefinition){
                            // correct number of arguments
                            console.log("TSC error - wrong funcion definition at line " + i);
                            return false;
                        }
                        for(var j = 0; j < this.commandList.length; j++){
                            // redefinition of user defined condition
                            if(this.commandList[j][0] == words[1]){
                                console.log("TSC error - redefiniton of command at line " + i);
                                return false;
                            }
                        }
                        for(var j = 0; j < this.langPack.reservedWords.length; j++){
                            // definition of condition name from reserved list
                            if(this.langPack.reservedWords[j] == words[1]){
                                console.log("TSC error - redefinition of reserved command at line " + i);
                                return false;
                            }
                        }
                        this.conditionList.push([words[1], i]);
                        inDefinition = true;
                        break;
                    case this.langPack.do:
                        if(words.length != 3 || words[2] != this.langPack.times || isNaN(parseInt(words[1]))){
                            console.log("TSC error - wrong DO definition at line " + i);
                            return false;
                        }
                        activeStructures.push(this.langPack.do);
                        break;
                    case this.langPack.while:
                        if(words.length != 3 || ![this.langPack.is, this.langPack.isNot].includes(words[1])){
                            console.log("TSC error - wrong WHILE definiton at line " + i);
                            return false;
                        }
                        if(![this.langPack.wall, this.langPack.brick, this.langPack.mark].includes(words[2])){
                            var found = false;
                            for(var j = 0; j < this.conditionList.lenght; j++){
                                if(words[2] == this.conditionList[j]){
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
                        if(words.length != 3 || ![this.langPack.is, this.langPack.isNot].includes(words[1])){
                            console.log("TSC error - wrong IF definition at line " + i);
                            return false;
                        }
                        if(![this.langPack.wall, this.langPack.brick, this.langPack.mark].includes(words[2])){
                            var found = false;
                            for(var j = 0; j < this.conditionList.lenght; j++){
                                if(words[2] == this.conditionList[j]){
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
                        // words that cannot be here - konec, podminka, prikaz, udelej (all)
                        // search if Karel knows these commands
                }
            } else {
                switch(line){
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
                        for(var j = 0; j < this.langPack.reservedWords.length; j++){
                            if(line == this.langPack.reservedWords[j]){
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
                            console.log("TSC error - unknown word at line " + i);
                            return false;
                        }
                }
                // do karel know this word ?
            }
        }
        if(inDefinition){
            console.log("TSC error - missing end of definition at line " + i);
            return false;
        }
        return true;
    }

    checkCondition(prefix, condition){
        // karel is while true
        if(prefix == this.langPack.is){
            // true line
            switch(condition){
                case this.langPack.wall:
                    if(this.isWall()){
                        return true;
                    }
                    break;
                case this.langPack.brick:
                    if(this.isBrick()){
                        return true;
                    }
                    break;
                case this.langPack.mark:
                    if(this.isMark()){
                        return true;
                    }
                    break;
                default:
                    // TODO - user defined conditions from conditionList
            }
        } else {
            // not line
            switch(condition){
                case this.langPack.wall:
                    if(!this.isWall()){
                        return true;
                    }
                    break;
                case this.langPack.brick:
                    if(!this.isBrick()){
                        return true;
                    }
                    break;
                case this.langPack.mark:
                    if(!this.isMark()){
                        return true;
                    }
                    break;
                default:
                    // TODO - user defined conditions from conditionList
            }
        }
        return false;
    }

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
                    return pos - 1;
                }
            }
        }
        if(up){
            while(true){
                pos--;
                var words = code[pos].match(/[^\ ]+/g);
                if(words[0] == "*" + command){
                    numSkip++;
                } else if(words[0] == command){
                    if(numSkip > 0){
                        numSkip--;
                    }else{
                        return pos;
                    }
                }
            }
        } else {
            while(true){
                pos++;
                var words = code[pos].match(/[^\ ]+/g);
                if(words[0] == command){
                    numSkip++;
                } else if(words[0] == "*" + command){
                    if(numSkip > 0){
                        numSkip--;
                    }else{
                        return pos;
                    }
                }
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}