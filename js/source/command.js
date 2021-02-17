export{command};

/**
 * This class is used to manipulate with Karel. It translates commands to Karel's actions and executes them
 * It also stores information about user defined commands and conditions.
 */
class command{

    constructor(karel){
        this.karel = karel;                     // given robot karel to operate with
        this.commandList = {};                  // user defined commands list dictionary
        this.conditionList = {};                // user defined condition list dictionary
        this.speed = 125;                       // tells the time for interpet step
        this.lastConditionResult = "undef";     // used for user defined condition evaluation
        this.expectDefinition = {};
    }

    /**
     * Prepares variables to load user defined commands and conditions
     */
    prepareCheck(){
        this.commandList = {};
        this.conditionList = {};
        this.expectDefinition = {};
    }

    /**
     * Prepares variables to interpret code
     */
    prepareRun(){
        this.lastConditionResult = "undef";
        this.speed = 125;
    }

    /**
     * Defines command in the command list, saves the given init tokens and create its structure.
     * Controls redefinition and previous occurances of the command
     * @param {token structure} token is the token that initializes the command.
     * @param {array of tokens} init is the tokes that will be added directly to the new record.
     * @param {array of errors} errors if errors occures, they will be passed in this array.
     * @param {JSON} dictionary dictionary from which error texts are taken.
     */
    defineCommand(token, init, errors, dictionary){
        if(token.value in this.commandList || token.value in this.conditionList){
            console.log("defineCommand error - redefinition of " + token.value);
            errors.push({error: dictionary["checkerErrorMessages"]["redefinition"], token: token}); 
        } else {
            this.commandList[token.value] = {code: init, definingToken: init.length};
            if(token.value in this.expectDefinition){
                if(!(this.expectDefinition[token.value].type == "function")){
                    for(var i = 0; i < this.expectDefinition[token.value].tokens.length; i++){
                        errors.push({error: dictionary["checkerErrorMessages"]["badUsage"], token: this.expectDefinition[token.value].tokens[i]});
                    }
                }
                delete this.expectDefinition[token.value];
            }
            return true;
        }
        return false;
    }

    /**
     * Defines condition in the condition list, saves the given init tokens and create its structure.
     * Controls redefinition and previous occurances of the condtition.
     * @param {token structure} token is the token that initializes the command.
     * @param {array of tokens} init is the tokes that will be added directly to the new record.
     * @param {array of errors} errors if errors occures, they will be passed in this array.
     * @param {JSON} dictionary dictionary from which error texts are taken.
     */
    defineCondition(token, init, errors, dictionary){
        if(token.value in this.commandList || token.value in this.conditionList){
            console.log("defineCondition error - redefiniton of " + token.value);
            errors.push({error: dictionary["checkerErrorMessages"]["redefinition"], token: token});
        } else {
            this.conditionList[token.value] = {code: init, definingToken: init.length, result: "undef"};
            if(token.value in this.expectDefinition){
                if(!(this.expectDefinition[token.value].type == "condition" || this.expectDefinition[token.value].type == "function")){
                    for(var i = 0; i < this.expectDefinition[token.value].tokens.length; i++){
                        errors.push({error: dictionary["checkerErrorMessages"]["badUsage"], token: this.expectDefinition[token.value].tokens[i]});
                    }
                }
                delete this.expectDefinition[token.value];
            }
            return true;
        }
        return false;
    }

    /**
     * Tells the function name by the given token or codePointer.
     * If the position of this token or code pointer are in some function, its name will be returned.
     * @param {token structure or codePointer strzcture} token is the token or code pointer to search for.
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
     * Tells funtions definig token (its first identifier) by given function name.
     * @param {string} functionName is the name of the function we want the defininf token of.
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
     * Checks if given identifier is defined, if not, it will be added to the expected definition list with its type.
     * If it will not be defined, it will cause an error.
     * @param {token structure} token is the token we need to be reachable.
     */
    checkReachable(token){
        if(!(token.value in this.commandList || token.value in this.conditionList)){
            if(this.expectDefinition[token.value] === undefined){
                this.expectDefinition[token.value] = {tokens: [token], type: "function"};
            } else {
                this.expectDefinition[token.value].tokens.push(token);
            }
        }
    }

    /**
     * Checks if given condition identifier is reachable, if not, it will be added to the expected definition list with its type.
     * If it will not be defined, it will cause an error.
     * @param {token structure} token is the token we need to be reachable as condition.
     */
    checkReachableCondition(token, errors, dictionary){
        if(token.value in this.commandList){
            errors.push({error: dictionary["checkerErrorMessages"]["badUsageNotCondition"], token: token});
            return;
        }
        if(!(token.value in this.conditionList)){
            if(this.expectDefinition[token.value] === undefined){
                this.expectDefinition[token.value] = {tokens: [token], type: "condition"};
            } else {
                this.expectDefinition[token.value].type = "condition";
                this.expectDefinition[token.value].tokens.push(token);
            }
        }
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
            console.log("codePointer: ", codePointer);
            throw "Unreachable token by codePointer";
        }
    }

    /**
     * Evaluates condition at given code pointer. If it is not a basic condition, it will move the code pointer to the userdefined
     * condition and takes care of its evaluation. It also counts with its prefix.
     * @param {codePointer structure} codePointer is the current code pointer.
     * @param {array} programQueue is the program queue to wich this function might add record. 
     * @returns true or false based on the condition, undefined if userdefined evaluation is needed.
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
                    console.log(conditionCore);
                    throw "Bad condition for evaluation";
            }
        } else {
            if(this.conditionList[conditionCore.value].result == "undef"){
                codePointer.tokenPointer -= 2; // setting code pointer to the begining of the structire (if-start, while-start)
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
                this.karel.pickBrick();
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
                console.log(dictKey);
                throw "Unexpected dictKey";
        }
    }

    /**
     * Sets the speed of the interpret step to 125 miliseconds
     */
    speedUpKarel(){
        this.speed = 125;
    }

    /**
     * Sets the speed of the interpret step to 250 miliseconds
     */
    slowDownKarel(){
        this.speed = 250;
    }
}