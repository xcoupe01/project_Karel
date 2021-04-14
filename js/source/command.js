export{command};

/**
 * This class is used to manipulate with Karel. It translates commands to Karel's actions and executes them
 * It also stores information about user defined commands and conditions.
 */
class command{

    constructor(karel, math){
        this.karel = karel;                     // given robot karel to operate with
        this.commandList = {};                  // user defined commands list dictionary
        this.conditionList = {};                // user defined condition list dictionary
        this.speed = 120;                       // tells the time for interpret step (from 20 to 520)
        this.speedStep = 10;                    // is the speed increment step
        this.lastConditionResult = "undef";     // used for user defined condition evaluation
        this.math = math;
        this.math.assignCommand(this);
    }

    /**
     * Prepares variables to load user defined commands and conditions
     */
    prepareCheck(){
        this.commandList = {};
        this.conditionList = {};
    }

    /**
     * Prepares variables to interpret code
     */
    prepareRun(){
        this.lastConditionResult = "undef";
    }

    /**
     * Defines command in the command list, saves the given init tokens and create its structure.
     * @param {token} token is the token that initializes the command.
     * @param {array} init are the tokes that will be added directly to the new record.
     */
    defineCommand(token, init){
        this.commandList[token.value] = {code: init, definingToken: init.length};
    }

    /**
     * Defines condition in the condition list, saves the given init tokens and create its structure.
     * @param {token} token is the token that initializes the condition.
     * @param {array} init is the tokes that will be added directly to the new record.
     */
    defineCondition(token, init){
        this.conditionList[token.value] = {code: init, definingToken: init.length, result: "undef"};
    }

    /**
     * Tells the function name by the given token or codePointer.
     * If the position of this token or code pointer are in some function, its name will be returned.
     * @param {token structure or codePointer structure} token is the token or code pointer to search for.
     * @returns name of function which the token or codePointer is in.
     */
    getFunctionByToken(token){
        for(var key in this.commandList){
            if(this.commandList[key].code[0].row < token.row && this.commandList[key].code[this.commandList[key].code.length - 1].row > token.row ||
                this.commandList[key].code[0].row == token.row && this.commandList[key].code[0].column <= token.column ||
                this.commandList[key].code[this.commandList[key].code.length - 1].row == token.row && 
                this.commandList[key].code[this.commandList[key].code.length - 1].column + 
                this.commandList[key].code[this.commandList[key].code.length - 1].value.length >= token.column){
                return key;
            }
        }
        for(var key in this.conditionList){
            if(this.conditionList[key].code[0].row < token.row && this.conditionList[key].code[this.conditionList[key].code.length - 1].row > token.row ||
                this.conditionList[key].code[0].row == token.row && this.conditionList[key].code[0].column <= token.column ||
                this.conditionList[key].code[this.conditionList[key].code.length - 1].row == token.row && 
                this.conditionList[key].code[this.conditionList[key].code.length - 1].column +
                this.conditionList[key].code[this.conditionList[key].code.length - 1].value.length >= token.column){
                return key;
            }
        }
        return;
    }

    /**
     * Tells functions defining token (its first identifier) by given function name.
     * @param {string} functionName is the name of the function we want the defining token of.
     * @returns the defining toke of specified function.
     */
    getDefiningToken(functionName){
        if(functionName in this.commandList){
            return this.commandList[functionName].code[this.commandList[functionName].definingToken];
        } else if(functionName in this.conditionList){
            return this.conditionList[functionName].code[this.conditionList[functionName].definingToken];
        }
        return;
    }

    /**
     * Returns token by given code pointer.
     * @param {codePointer structure} codePointer is the codePointer of token we want to get.
     * @returns token that corresponds to given codePointer 
     */
    getToken(codePointer){
        if(Object.keys(this.commandList).includes(codePointer.functionName)){
            return this.commandList[codePointer.functionName].code[codePointer.tokenPointer];
        } else if (Object.keys(this.conditionList).includes(codePointer.functionName)){
            return this.conditionList[codePointer.functionName].code[codePointer.tokenPointer];
        } else {
            karelConsoleLog("internalError");
            console.log("codePointer: ", codePointer);
            throw "Unreachable token by codePointer";
        }
    }

    /**
     * Evaluates condition at given code pointer. If it is not a basic condition, it will move the code pointer to the user defined
     * condition and takes care of its evaluation. It also counts with its prefix.
     * @param {codePointer structure} codePointer is the current code pointer.
     * @param {array} programQueue is the program queue to which this function might add record. 
     * @returns true or false based on the condition, undefined if user defined evaluation is needed.
     */
    evalCondition(codePointer, programQueue){
        let conditionPrefix = this.getToken({functionName: codePointer.functionName, tokenPointer: codePointer.tokenPointer});
        let conditionCore = this.getToken({functionName: codePointer.functionName, tokenPointer: codePointer.tokenPointer + 1});
        var result;
        if(conditionCore.meaning == "condition"){
            switch(conditionCore.dictKey){
                case "wall":
                    result = this.karel.isWall();
                    break;
                case "brick":
                    result = this.karel.isBrick();
                    break;
                case "mark":
                    result = this.karel.isMark();
                    break;
                case "vacant":
                    result = this.karel.isVacant();
                    break;
                default:
                    karelConsoleLog("internalError");
                    console.log(conditionCore);
                    throw "Bad condition for evaluation";
            }
        } else if(conditionCore.meaning == "expression"){
            if(this.math.computeExpression(conditionCore, undefined, codePointer.functionName) == 0){
                result = false;
            } else {
                result = true;
            }
        } else {
            if(this.conditionList[conditionCore.value].result == "undef"){
                codePointer.tokenPointer -= 2; // setting code pointer to the beginning of the structure (if-start, while-start)
                programQueue.push(Object.assign({}, codePointer));
                codePointer.functionName = conditionCore.value;
                codePointer.tokenPointer = -1;
                return;
            } else {
                switch(this.conditionList[conditionCore.value].result){
                    case "true":
                        result = true;
                        break;
                    case "false":
                        result = false;
                        break;
                    default:
                        karelConsoleLog("internalError");
                        console.log(this.conditionList[conditionCore.value]);
                        throw "Undefined condition result";
                }
            }
        }
        if(conditionPrefix.dictKey == "is"){
            return result;
        } else {
            return !result;
        }
    }

    /**
     * Executes basic Karel's commands based on dictKey of the token.
     * @param {string} dictKey is the dict key of the token. 
     */
    executeCommand(dictKey){
        switch(dictKey){
            case "forward":
                this.karel.goForward();
                break;
            case "right":
                this.karel.turnRight();
                break;
            case "left":
                this.karel.turnLeft();
                break;
            case "placeBrick":
                this.karel.placeBrick();
                break;
            case "pickBrick":
                this.karel.pickUpBrick();
                break;
            case "placeMark":
                this.karel.markOn();
                break;
            case "pickMark":
                this.karel.markOff();
                break;
            case "true":
                this.lastConditionResult = "true";
                break;
            case "false":
                this.lastConditionResult = "false";
                break;
            case "faster":
                this.speedUpKarel();
                break;
            case "slower":
                this.slowDownKarel();
                break;
            case "beep":
                this.karel.beep();
                break;
            default:
                karelConsoleLog("internalError");
                console.log(dictKey);
                throw "Unexpected dictKey";
        }
    }

    /**
     * Sets the speed to given value. The value is expected to be from 1 to 100.
     * @param value is the speed we want to set.
     */
    setSpeed(value){
        this.speed =  20 + (5 * (100 - value));
    }

    /**
     * Speeds up the robot by speed step in the speed limit.
     * Also sets the iu directly - `speedNumber` and `speedSlider` elements needed.
     */
    speedUpKarel(){
        if(this.speed >= (20 + this.speedStep)){
            this.speed -= this.speedStep;
            document.querySelector('#speedNumber').value = -(((this.speed - 20) / 5) - 100);
            document.querySelector('#speedSlider').value = -(((this.speed - 20) / 5) - 100);
        }
    }

    /**
     * Slows down the robot by speed step in the speed limit.
     * Also sets the iu directly - `speedNumber` and `speedSlider` elements needed.
     */
    slowDownKarel(){
        if(this.speed <= (520 - this.speedStep)){
            this.speed += this.speedStep;
            document.querySelector('#speedNumber').value = -(((this.speed - 20) / 5) - 100);
            document.querySelector('#speedSlider').value = -(((this.speed - 20) / 5) - 100);
        }
    }
}