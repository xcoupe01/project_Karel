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
     * Sets Karel to specified language
     * @param {dictionary} dictionary is the JS dictionary set of Karel words
     */
    languageSetter(dictionary){
        this.dictionary = dictionary;
        this.reservedWords = [];
        this.functions = [];
        for(const [key, value] of Object.entries(this.dictionary["keywords"])){
            this.reservedWords.push(value);
            if(["forward", "right", "left", "placeBrick", "pickBrick", "placeMark", "pickMark", 
                    "true", "false", "wall", "brick", "mark", "vacant", "faster", "slower", "beep"].includes(key)){
                this.functions.push(value);
            }
        }
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
     * Checks if given word is command, if not, it's saved with a line to be defined later.
     * The format of the save is javascript dictionary where the line is he key and its value is string of the error.
     * @param {string} word is the command name to be checked for
     * @param {number} line is the line were the command was spotted
     */
    checkCommand(word, line){
        if(!this.functions.includes(word) && !(word in this.commandList) && word != ""){
            this.expectDefinition[line] = word;
        }
    }

    /**
     * Checks if given word is condition, if not, it's saved with a line to be defined later.
     * The format of the save is javascript dictionary where the line is he key and its value is string of the error.
     * @param {string} word is the condition name to be checked for
     * @param {number} line is the line where the condition was spotted
     */
    checkCondition(word, line){
        if(![this.dictionary["keywords"]["wall"], this.dictionary["keywords"]["brick"], 
            this.dictionary["keywords"]["mark"], this.dictionary["keywords"]["vacant"]].includes(word) 
            && !(word in this.conditionList)){
                this.expectDefinition[line] = word;
        }
    }


    /**
     * Adds command record to the command dictionary to make it callable.
     * If an error occurs (redefinig of some sort), it will be written in the `outputReport`.
     * The `outputReport` is a javascript dictionary formated in a way where key is line of 
     * the error and its content is the string of the error. 
     * There cannot be any command or condition with same name.
     * @param {string} name is the name of the command
     * @param {number} line is the starting line of the command
     * @param {dictionary} outputReport is a report to save error to
     */
    addCommandToList(name, line, outputReport){
        for(var key in this.expectDefinition){
            if(this.expectDefinition[key] == name){
                delete this.expectDefinition[key];
            }
        }
        if(name in this.commandList || name in this.conditionList){
            outputReport[line] = "ACommaTL error - name redefiniton";
        } else if(this.reservedWords.includes(name)){
            outputReport[line] = "ACommaTL error - redefining reserved word";
        } else {
            this.commandList[name] = line;
        }
    }

    /**
     * Adds condition record to the condition dictionary to make it callable.
     * The `outputReport` is a javascript dictionary formated in a way where key is line of 
     * the error and its content is the string of the error. 
     * There cannot be any command or condition with same name.
     * @param {string} name is the name of the condition
     * @param {number} line is the starting line of the condition
     * @param {dictionary} outputReport is a report to save error to
     */
    addConditionToList(name, line, outputReport){
        for(var key in this.expectDefinition){
            if(this.expectDefinition[key] == name){
                delete this.expectDefinition[key];
            }
        }
        if(name in this.conditionList || name in this.commandList){
            outputReport[line] = "ACondTL error - name redefiniton";
        } else if(this.reservedWords.includes(name)){
            outputReport[line] = "ACommaTL error - redefining reserved word";
        } else {
            this.conditionList[name] = line;
        }
    }

    /**
     * Evaluates a given basic condition
     * @param {string} prefix is the Karel prefix of condition (is/isnt)
     * @param {string} condition is the condition itself
     * @returns the result of the condition and its prefix
     */
    evalBaseCondition(prefix, condition){
        if(prefix == this.dictionary["keywords"]["is"]){
            switch(condition){
                case this.dictionary["keywords"]["wall"]:
                    return this.karel.isWall();
                case this.dictionary["keywords"]["brick"]:
                    return this.karel.isBrick();
                case this.dictionary["keywords"]["mark"]:
                    return this.karel.isMark();
                case this.dictionary["keywords"]["vacant"]:
                    return this.karel.isVacant();
            }
        } else {
            switch(condition){
                case this.dictionary["keywords"]["wall"]:
                    return !this.karel.isWall();
                case this.dictionary["keywords"]["brick"]:
                    return !this.karel.isBrick();
                case this.dictionary["keywords"]["mark"]:
                    return !this.karel.isMark();
                case this.dictionary["keywords"]["vacant"]:
                    return !this.karel.isVacant();
            }
        }
        return false;
    }

    /**
     * Evaluates given condition in native code
     * The function can evaluate Karels base conditions as well as user defined conditions
     * For base conditions the `checkBaseCondition` function is used
     * To check user defined conditions the function returns "undef" string and makes jump to desired condition
     * While evaluating user defined conditon the result is stored and when the condition ends and we jump back to original
     * code point, the stored value is processed and correct answer is returned
     * It requires to manipulate with `this.line` and `this.programQueue` variables if needed (that is implemented in interprets evalNativeCodeCondition function)
     * Also it takes in mind the Karel's condition prefix
     * @param conditionName is the name of the condition we want to evaluate
     * @param conditionPrefix is the prefix of condition
     * @returns array where zero position is string "true" if the result was true, string "false" if the result was false and "undef" if a jump is needed,
     * and second position is the recomended jump (if -1 do not jump)
     */
    nativeCodeConditionEval(conditionName, conditionPrefix){
        if([this.dictionary["keywords"]["wall"], this.dictionary["keywords"]["brick"], 
                this.dictionary["keywords"]["mark"], this.dictionary["keywords"]["vacant"]].includes(conditionName)){
            this.lastConditionResult = "undef";
            return [(this.evalBaseCondition(conditionPrefix, conditionName) === true) ? "true" : "false", -1];
        }
        if(this.lastConditionResult != "undef"){
            if(conditionPrefix == this.dictionary["keywords"]["is"]){
                return [(this.lastConditionResult == "true") ? "true" : "false", -1];
            } else {
                return [(this.lastConditionResult == "false") ? "true" : "false", -1];
            }
        }
        return ["undef", this.conditionList[conditionName]];
    }

    /**
     * Takes a command and executes it with ("moves" with Karel).
     * If jump is required to execute the given commadn, its starting line is returned.
     * @param {string} command is the command to be executed
     * @returns line number if jump is required, ₋1 if jump is not required and -2 when error
     */
    nativeCodeCommandEval(command){
        switch(command){
            case this.dictionary["keywords"]["forward"]:
                this.karel.goForward();
                break;
            case this.dictionary["keywords"]["right"]:
                this.karel.turnRight();
                break;
            case this.dictionary["keywords"]["left"]:
                this.karel.turnLeft();
                break;
            case this.dictionary["keywords"]["placeBrick"]:
                this.karel.placeBrick();
                break;
            case this.dictionary["keywords"]["pickBrick"]:
                this.karel.pickUpBrick();
                break;
            case this.dictionary["keywords"]["placeMark"]:
                this.karel.markOn();
                break;
            case this.dictionary["keywords"]["pickMark"]:
                this.karel.markOff();
                break;
            case this.dictionary["keywords"]["true"]:
                this.lastConditionResult = "true";
                break;
            case this.dictionary["keywords"]["false"]:
                this.lastConditionResult = "false";
                break;
            case this.dictionary["keywords"]["faster"]:
                this.speedUpKarel();
                break;
            case this.dictionary["keywords"]["slower"]:
                this.slowDownKarel();
                break;
            case this.dictionary["keywords"]["beep"]:
                this.karel.beep();
                break;
            default:
                if(!(command in this.commandList)){
                    console.log("nativeCodeCommandEval error - unexpected word - [" + word + "]");
                    return -2;
                }
                return this.commandList[command]
        }
        return -1

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