export {interpret};

class interpret{

    constructor(textEditor, karel){
        this.dictionary = {};                   // current language dictionary
        this.karel = karel;                     // given robot karel to operate with
        this.textEditor = textEditor;           // given text editor to interpret
        this.commandList = {};                  // user defined commands list dictionary
        this.conditionList = {};                // user defined condition list dictionary
        this.running = false;                   // tells if Karel is executing code
        this.speed = 125;                       // tells the time for interpet step
        this.activeCounters = [];               // used for DO loops
        this.programQueue = [];                 // used to jump to other programs and return back (saves position from which was jumped)
        this.lastConditionResult = "undef";     // used for user defined condition evaluation
        this.interpretMode = "standard";        // tells in which state is the interpret
        this.line = 0;                          // actual interpret line position in the code 
        this.code = [];                         // code formated by function nativeCodeSplitter
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
     * Stops Karel from executing code
     */
    stopExecuting(){
        this.running = false;
    }

    /**
     * Tells if Karel is executing code
     * @returns the running status of Karel's interpret
     */
    getRunning(){
        return this.running;
    }

    /**
     * Adds command record to the interprets dictionary to make it callable.
     * If an error occurs (redefinig of some sort), it will be written in the `outputReport`.
     * The `outputReport` is a javascript dictionary formated in a way where key is line of 
     * the error and its content is the string of the error. 
     * There cannot be any command or condition with same name.
     * @param {string} name is the name of the command
     * @param {number} line is the starting line of the command
     * @param {dictionary} outputReport is a report to save error to
     */
    addCommandToList(name, line, outputReport){
        if(name in this.commandList || name in this.conditionList){
            outputReport[line] = "ACommaTL error - name redefiniton";
        } else if(this.reservedWords.includes(name)){
            outputReport[line] = "ACommaTL error - redefining reserved word";
        } else {
            this.commandList[name] = line;
        }
    }

    /**
     * Adds condition record to the interprets dictionary to make it callable.
     * The `outputReport` is a javascript dictionary formated in a way where key is line of 
     * the error and its content is the string of the error. 
     * There cannot be any command or condition with same name.
     * @param {string} name is the name of the condition
     * @param {number} line is the starting line of the condition
     * @param {dictionary} outputReport is a report to save error to
     */
    addConditionToList(name, line, outputReport){
        if(name in this.conditionList || name in this.commandList){
            outputReport[line] = "ACondTL error - name redefiniton";
        } else if(this.reservedWords.includes(name)){
            outputReport[line] = "ACommaTL error - redefining reserved word";
        } else {
            this.conditionList[name] = line;
        }
    }

    /**
     * Splits the native code to array, Its use as a basic interpret format here
     * The result is stored in `this.code` variable
     * @param {string} codeString is the string to be splitted
     */
    nativeCodeSplitter(codeString){
        this.code = [];
        var splitCode = codeString.split(/\r?\n/);
        for(var i = 0; i < splitCode.length; i++){
            splitCode[i] = splitCode[i].trim();
            this.code[i] = splitCode[i].split(/\ +/);
        }
    }

    /**
     * Returns Rule dictionary for the native syntax checker function
     * Rules are related to the words of the language
     * Its format requires that every end node contains string `token`, array `checks` and array `action`
     * The checker will control the `checks` section and trigger the `action` section
     * @returns the rules dictionary
     */
    createNativeRulesTable(){
        return {
            "function" : {
                "token": "function",
                "checks": [2, "notInDef"],
                "action": ["addToCommadnList", "setDef"]
            },
            "condition" : {
                "token": "condition",
                "checks": [2, "notInDef"],
                "action": ["addToConditionList", "setDef", "addExpectedWords"]
            },
            "end" : {
                "token": "end",
                "checks": [1, "inDef", "checkActive", "checkExpectedWords"],
                "action": ["unsetDef"]
            },
            "do" : {
                "start": {
                    "token" : "do",
                    "checks": [3, "checkKWTimes", "checkNumber", "inDef"],
                    "action": ["pushActive"]
                },
                "end":{
                    "token" : "do",
                    "checks":[1, "checkActive" ,"inDef"],
                    "action":["popActive"]
                }
            },
            "while" : {
                "start": {
                    "token" : "while",
                    "checks": [3, "checkCondPrefix", "checkCondition", "inDef"],
                    "action": ["pushActive"]
                },
                "end" : {
                    "token" : "while",
                    "checks": [1, "checkActive", "inDef"],
                    "action": ["popActive"]
                }
            },
            "if" : {
                "start": {
                    "token" : "if",
                    "checks": [3, "checkCondPrefix", "checkCondition", "inDef", "checkNextThen"],
                    "action": ["pushActive"]
                },
                "in": {
                    "token" : "if",
                    "checks": [1, "checkActive", "inDef"],
                    "action": []
                },
                "end" : {
                    "token" : "if",
                    "checks": [1, "checkActive", "inDef"],
                    "action": ["popActive"]
                }
            },
            "def" : {
                "token" : "def",
                "checks": [1, "checkDef"],
                "action": []
            },
            "comment" : {
                "token" : "comment",
                "checks": [],
                "action": []
            },
            "trueOrFalse" : {
                "token" : "trueOrFalse",
                "checks": [1, "checkDef"],
                "action": ["alterExpectedWords"]
            }
        }
    }

    /**
     * Sets the speed of the interpret step to 125 miliseconds
     */
    speedUpInterpret(){
        this.speed = 125;
    }

    /**
     * Sets the speed of the interpret step to 250 miliseconds
     */
    slowDownInterpret(){
        this.speed = 250;
    }

    /**
     * Checks Karel's native code.
     * If an error is found, it is stored in the local dictionary which is outputed at the end of scanning. 
     * The output is formated as dictionary in a way where key is line of the code where error happend and the value is
     * the text information of the error.
     * Code thats beeing checked is located in `this.code`.
     * it does not utulize the `this.line` varibale and it uses its own line variable.
     * It also scans for command and condition definitions and stores them in catalogue (`this.commandList` and `this.conditionList`).
     * Utulizes the rules created by `createNativeRulesTable` function.
     * @returns dictionary with saved errors.
     */
    nativeCodeChecker(){

        this.commandList = {};
        this.conditionList = {};
        var inDefinition = false;
        var activeStructures = []; 
        var rules = this.createNativeRulesTable();
        var currentRule;
        var expectedWords = {"true" : false, "false" : false};
        var expectDefinition = {};
        var outputReport = {};

        for(var line = 0; line < this.code.length; line++){
            currentRule = [];
            switch(this.code[line][0]){
                case this.dictionary["keywords"]["function"]:
                    currentRule = rules["function"];
                    break;
                case this.dictionary["keywords"]["condition"]:
                    currentRule = rules["condition"];
                    break;
                case this.dictionary["keywords"]["end"]:
                    currentRule = rules["end"];
                    break;
                case this.dictionary["keywords"]["do"]:
                    currentRule = rules["do"]["start"];
                    break;
                case "*" + this.dictionary["keywords"]["do"]:
                    currentRule = rules["do"]["end"];
                    break;
                case this.dictionary["keywords"]["while"]:
                    currentRule = rules["while"]["start"];
                    break;
                case "*" + this.dictionary["keywords"]["while"]:
                    currentRule = rules["while"]["end"];
                    break;
                case this.dictionary["keywords"]["if"]:
                    currentRule = rules["if"]["start"];
                    break;
                case this.dictionary["keywords"]["then"]:
                case this.dictionary["keywords"]["else"]:
                    currentRule = rules["if"]["in"];
                    break;
                case "*" + this.dictionary["keywords"]["if"]:
                    currentRule = rules["if"]["end"];
                    break;
                case this.dictionary["keywords"]["true"]:
                case this.dictionary["keywords"]["false"]:
                    currentRule = rules["trueOrFalse"];
                    break;
                default:
                    if(this.code[line][0].startsWith("#")){
                        currentRule = rules["comment"];
                    } else {
                        currentRule = rules["def"];
                    }
            }

            if(currentRule["token"] != "comment" && this.code[line].length != currentRule["checks"][0]){
                outputReport[line] = "nativeCodeChecker error - bad number of words";
            }

            for(var i = 1; i < currentRule["checks"].length; i++){
                switch(currentRule["checks"][i]){
                    case "notInDef":
                        if(inDefinition){
                            outputReport[line] = "nativeCodeChecker error - notInDef check failed";
                        }
                        break;
                    case "inDef":
                        if(!inDefinition){
                            outputReport[line] = "nativeCodeChecker error - InDef check failed";
                        }
                        break;
                    case "checkActive":
                        if(currentRule["token"] == "end"){
                            if(activeStructures.length > 0){
                                outputReport[line] = "nativeCodeChecker error - checkActive check failed";
                            }
                            activeStructures = [];
                        } else {
                            if(activeStructures[activeStructures.length - 1] != currentRule["token"]){
                                outputReport[line] = "nativeCodeChecker error - checkActive check failed";
                            }
                        }
                        break;
                    case "checkKWTimes":
                        if(this.code[line][2] != this.dictionary["keywords"]["times"]){
                            outputReport[line] = "nativeCodeChecker error - checkKWTimes check failed";
                        }
                        break;
                    case "checkNumber":
                        if(isNaN(parseInt(this.code[line][1]))){
                            outputReport[line] = "nativeCodeChecker error - checkNumber check failed";
                        }
                        break;
                    case "checkCondPrefix":
                        if(![this.dictionary["keywords"]["is"], this.dictionary["keywords"]["isNot"]].includes(this.code[line][1])){
                            outputReport[line] = "nativeCodeChecker error - checkCondPrefix check failed";
                        }
                        break;
                    case "checkCondition":
                        if(![this.dictionary["keywords"]["wall"], this.dictionary["keywords"]["brick"], 
                                this.dictionary["keywords"]["mark"], this.dictionary["keywords"]["vacant"]].includes(this.code[line][2]) 
                                && !(this.code[line][2] in this.conditionList)){
                                expectDefinition[line] = this.code[line][2];
                        }
                        break;
                    case "checkDef":
                        if(!this.functions.includes(this.code[line][0]) && !(this.code[line][0] in this.commandList) && this.code[line] != ""){
                            expectDefinition[line] = this.code[line][0];
                        }
                        break;
                    case "checkNextThen":
                        if(this.code[line + 1][0] != this.dictionary["keywords"]["then"]){
                            outputReport[line] = "nativeCodeChecker error - checkNextThen check failed";
                        }
                        break;
                    case "checkExpectedWords":
                        for(var key in expectedWords){
                            if(expectedWords[key] == true){
                                outputReport[line] = "nativeCodeChecker error - checkExpectedWords check failed";
                            }
                        }
                        break;
                }
            }

            for(var i = 0; i < currentRule["action"].length; i++){
                switch(currentRule["action"][i]){
                    case "addToCommadnList":
                        for(var key in expectDefinition){
                            if(expectDefinition[key] == this.code[line][1]){
                                delete expectDefinition[key];
                            }
                        }
                        this.addCommandToList(this.code[line][1], line, outputReport);
                        break;
                    case "addToConditionList":
                        for(var key in expectDefinition){
                            if(expectDefinition[key] == this.code[line][1]){
                                delete expectDefinition[key];
                            }
                        }
                        this.addConditionToList(this.code[line][1], line, outputReport);
                        break;
                    case "setDef":
                        inDefinition = true;
                        break;
                    case "unsetDef":
                        inDefinition = false;
                        break;
                    case "pushActive":
                        activeStructures.push(currentRule["token"]);
                        break;
                    case "popActive":
                        activeStructures.pop();
                        break;
                    case "addExpectedWords":
                        expectedWords["true"] = true;
                        expectedWords["false"] = true;
                        break;
                    case "alterExpectedWords":
                        if(this.code[line][0] == this.dictionary["keywords"]["true"]){
                            expectedWords["true"] = false;
                        } else {
                            expectedWords["false"] = false;
                        }
                        break;
                }
            }
        }
        if(Object.keys(expectDefinition).length !== 0){
            for(var key in expectDefinition){
                outputReport[line] = "nativeCodeChecker error - checkDef check failed with word " + expectDefinition[key];
            }
        }
        return outputReport;
    }

    /**
     * Outputs the `outputReport` dictionary to the console.
     * The `outputReport` is meant to be the result of `nativeCodeChecker` function.
     * The format of the dictionary is that key is line of error and the value is the error message.
     * @param {dictionary} outputReport 
     */
    printNativeCodeCheckerOutput(outputReport){
        if(Object.keys(outputReport).length === 0){
            return true;
        } else {
            for(var line in outputReport){
                console.log(outputReport[line] + " at line [" + line + "]");
            }
            return false;
        }
    }

    /**
     * Evaluates a given basic condition
     * @param {string} prefix is the Karel prefix of condition (is/isnt)
     * @param {string} condition is the condition itself
     * @returns the result of the condition and its prefix
     */
    checkBaseCondition(prefix, condition){
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
     * It manipulates with `this.line` and `this.programQueue` variables if needed
     * Also it takes in mind the Karel's condition prefix
     * @returns string "true" if the result was true, string "false" if the result was false and "undef" if a jump is needed
     */
    nativeCodeConditionEval(){
        if([this.dictionary["keywords"]["wall"], this.dictionary["keywords"]["brick"], 
                this.dictionary["keywords"]["mark"], this.dictionary["keywords"]["vacant"]].includes(this.code[this.line][2])){
            this.lastConditionResult = "undef";
            return (this.checkBaseCondition(this.code[this.line][1], this.code[this.line][2]) === true) ? "true" : "false";
        }
        if(this.lastConditionResult != "undef"){
            if(this.code[this.line][1] == this.dictionary["keywords"]["is"]){
                return (this.lastConditionResult == "true") ? "true" : "false";
            } else {
                return (this.lastConditionResult == "false") ? "true" : "false";
            }
        }
        this.programQueue.push(this.line - 1);
        this.line = this.conditionList[this.code[this.line][2]];
        return "undef";
    }

    /**
     * Computes where to jump in code based on given values
     * The computed jump is then directly stored in `this.line`
     * @param {string} command is the command which requires jump
     * @param {boolean} up if true, the jump is upwards in the code, downwards otherwise
     */
    nativeCodeJumper(command, up){
        var numSkip = 0;
        if(command == this.dictionary["keywords"]["if"]){
            while(true){
                this.line ++;
                if(this.code[this.line][0] == command){
                    numSkip ++;
                } else if(this.code[this.line][0] == "*" + command && numSkip > 0){
                    numSkip--;
                } else if((this.code[this.line][0] == this.dictionary["keywords"]["else"] && numSkip == 0) || 
                            (this.code[this.line][0] == "*" + command && numSkip == 0)){
                    return;
                }
            }
        }
        if(up){
            while(true){
                this.line --;
                if(this.code[this.line][0] == "*" + command){
                    numSkip++;
                } else if(this.code[this.line][0] == command && numSkip > 0){
                    numSkip--;
                } else if(this.code[this.line][0] == command && numSkip == 0){
                    return;
                }
            }
        } else {
            while(true){
                this.line ++;
                if(this.code[this.line][0] == command){
                    numSkip++;
                } else if(this.code[this.line][0] == "*" + command && numSkip > 0){
                    numSkip--;
                } else if(this.code[this.line][0] == "*" + command && numSkip == 0){
                    return;
                }
            }
        }
    }

    /**
     * Resets the important variables for interpret and sets the textEditor to read only mode
     */
    resetNativeCodeInterpret(){
        this.activeCounters = [];
        this.programQueue = [];
        this.lastConditionResult = "undef";
        this.speed = 125;
        this.textEditor.setReadOnly(true);
    }

    /**
     * Makes the interpret stop and unsets the text's editor read only mode
     */
    turnOffInterpret(){
        this.interpretMode = "none";
        this.running = false;
        this.textEditor.setReadOnly(false);
    }

    /**
     * Sets the `this.line` to start of a command or condition
     * It can end with an error if end of file is found or "end" in the text is found
     */
    nativeCodeFindStartLine(){
        while(this.code[this.line][0] != this.dictionary["keywords"]["function"] && this.code[this.line][0] != this.dictionary["keywords"]["condition"]){
            this.line --;
            if(this.line < 0 || this.code[this.line][0] == this.dictionary["keywords"]["end"]){
                console.log("nativeCodeFindStartLine error - behining of code to be interpreted not found");
                return false;
            }
        }
        return true;
    }

    /**
     * Makes a one step (interpets on line) of Karel's native language.
     * To run, it needs `this.code` and `this.line` to be initiated properly.
     * Its meant to run in a loop, The loop should end when this function returns true.
     * Its highly recomended to use `this.resetNativeCodeInterpret` function before interpret loop.
     * and its also highly recomended to call `turnOffInterpret` to end the interpretation becase these 
     * functions will set the coreect object variable values.
     * The code you want to interpret shoul be error free because there are no syntax checks. 
     * To check the syntax of the code use `nativeCodeChecker` function.
     * @returns true if the interpretation should end, false otherwise
     */
    nativeCodeInterpretStep(){
        if(this.line >= this.code.length){
            console.log("nativeCodeInterpret warning - end not found but EOF emerged, shutting down");
            return true;
        }
        switch(this.code[this.line][0]){
            case this.dictionary["keywords"]["function"]:
            case this.dictionary["keywords"]["condition"]:
                break;
            case this.dictionary["keywords"]["end"]:
                if(this.programQueue.length == 0){
                    if(this.lastConditionResult != "undef"){
                        alert(this.lastConditionResult);
                    }
                    return true;
                } else {
                    this.line = this.programQueue[this.programQueue.length - 1]; 
                    //in next step the N will be incremented so we need to substract the addition to maintain the correct jump
                    this.programQueue.pop();
                }
                break;
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
            case this.dictionary["keywords"]["do"]:
                if(parseInt(this.code[this.line][1]) == 0){
                    this.nativeCodeJumper(this.dictionary["keywords"]["do"], false);
                } else {
                    this.activeCounters.push(this.code[this.line][1]); 
                }
                break;
            case "*" + this.dictionary["keywords"]["do"]:
                this.activeCounters[this.activeCounters.length - 1] --;
                if(this.activeCounters[this.activeCounters.length - 1] > 0){
                    this.nativeCodeJumper(this.dictionary["keywords"]["do"], true);
                } else {
                    this.activeCounters.pop();
                }
                break;
            case this.dictionary["keywords"]["while"]:
                var result = this.nativeCodeConditionEval();
                this.lastConditionResult = "undef";
                if(result == "false"){
                    this.nativeCodeJumper(this.dictionary["keywords"]["while"], false);
                }
                break;
            case "*" + this.dictionary["keywords"]["while"]:
                this.nativeCodeJumper(this.dictionary["keywords"]["while"], true);
                this.line --;
                break;
            case this.dictionary["keywords"]["if"]:
                var result = this.nativeCodeConditionEval();
                this.lastConditionResult = "undef";
                if(result == "false"){
                    this.nativeCodeJumper(this.dictionary["keywords"]["if"], false);
                }
                break;
            case this.dictionary["keywords"]["else"]:
                this.nativeCodeJumper(this.dictionary["keywords"]["if"], false);
                break;
            case this.dictionary["keywords"]["then"]:
            case "*" + this.dictionary["keywords"]["if"]:
                break;
            case this.dictionary["keywords"]["true"]:
                this.lastConditionResult = "true";
                break;
            case this.dictionary["keywords"]["false"]:
                this.lastConditionResult = "false";
                break;
            case "#":
            case "":
                break;
            case this.dictionary["keywords"]["faster"]:
                this.speedUpInterpret();
                break;
            case this.dictionary["keywords"]["slower"]:
                this.slowDownInterpret();
                break;
            case this.dictionary["keywords"]["beep"]:
                this.karel.beep();
                break;
            default:
                if(!(this.code[this.line][0] in this.commandList)){
                    console.log("ITC error - unexpected word - [" + this.code[this.line][0] + "]");
                    return true;
                }
                this.programQueue.push(this.line);
                this.line = this.commandList[this.code[this.line][0]];
        }
        this.line ++;
        return false;
    }

    /**
     * Interprets Karel's native code.
     * The code should be error free, use `nativeCodeChecker`
     * Look in the desription of `nativeCodeInterpretStep` becase lots of the information there
     * corresponds with this function. Its basicaly a loop wrap for it.
     * It utulizes the `turnOffInterpret` funtion
     * Also moves the cursor in the code editor if you wish
     * It can run in two modes:
     *  `standard` mode - runs till the end of the command
     *  `debug` mode - makes one step and waits for event (probably button press)
     * @param {boolean} cursor tells if the cursor will be moved, true means yes, false no
     */
    async nativeCodeInterpret(cursor){
        this.textEditor.read
        while(this.running){
            if(cursor){
                this.textEditor.gotoLine(this.line + 1);
            }
            if(this.nativeCodeInterpretStep(this.code)){
                this.turnOffInterpret();
            };
            await sleep(this.speed);
            if(this.interpretMode == "debug"){
                return;
            }
        }  
    }

    /**
     * Searches for name in command list and condition list and sets the line to be executed to start of
     * command or condition defined by the name
     * @param {string} name is the name of command or condition we want to run
     */
    searchForNameSetLine(name){
        if(name in this.commandList){
            this.line = this.commandList[name];
            return true;
        }
        if(name in this.conditionList){
            this.line = this.conditionList[name];
            return true;
        }
        console.log("searchForNameSetLine error - name [" + name + "] not found")
        return false;
    }

    /**
     * Interprets native code from text editor
     */
    nativeCodeInterpretFromEditor(){

        if(this.running){
            console.log("nativeCodeInterpretFromEditor error - cannot run multiple programs at the same time");
            return;
        }

        this.line = this.textEditor.selection.getCursor().row;
        this.nativeCodeSplitter(this.textEditor.getValue());

        if(!this.nativeCodeFindStartLine()){
            return;
        }

        if(!this.printNativeCodeCheckerOutput(this.nativeCodeChecker())){
            return;
        }

        this.resetNativeCodeInterpret();
        this.running = true;
        this.interpretMode = "standard";

        this.nativeCodeInterpret(true);
    }

    /**
     *  Interprets native Blockly generated code
     */
    nativeCodeInterpretFromBlockly(name){
        if(this.running){
            console.log("ITC error - cannot run multiple programs at the same time");
            return;
        }

        this.nativeCodeSplitter(document.getElementById('textArea').value);

        if(!this.printNativeCodeCheckerOutput(this.nativeCodeChecker())){
            return;
        }

        if(!this.searchForNameSetLine(name)){
            return;
        }

        this.resetNativeCodeInterpret();
        this.running = true;
        this.interpretMode = "standard";

        this.nativeCodeInterpret(false); 
    }

    /**
     * Runs debug mode Interpret from text code editor
     */
    nativeCodeDebugInterpretFromEditor(){
        if(this.running && this.interpretMode == "standard"){
            console.log("nativeCodeInterpretFromEditor error - cannot run multiple programs at the same time");
            return;
        }
        if(!this.running){
            this.line = this.textEditor.selection.getCursor().row;
            this.nativeCodeSplitter(this.textEditor.getValue());
            if(!this.nativeCodeFindStartLine()){
                return;
            }
            if(!this.printNativeCodeCheckerOutput(this.nativeCodeChecker())){
                return;
            }
            this.resetNativeCodeInterpret();
            this.running = true;
            this.interpretMode = "debug";
        }
        this.nativeCodeInterpret(true);
    }

    /**
     * Creates table for conversion from text code to blockly
     */
    createConversionTable(){            
        var returnTable = {};
        returnTable[this.dictionary["keywords"]["function"]] = {
            "create" : ["base_function"],
            "action" : ["addName", "insertConnection", "setCollapse"],
        }
        returnTable[this.dictionary["keywords"]["condition"]] = {
            "create" : ["base_condition"],
            "action" : ["addName", "insertConnection", "setCollapse"],
        }
        returnTable[this.dictionary["keywords"]["end"]] = {
            "create" : [],
            "action" : ["colapseBlock", "popConnectionArray", "collapse"],
        }
        returnTable[this.dictionary["keywords"]["forward"]] = {
            "create" : ["function_step"],
            "action" : ["connectBlock"],
        }
        returnTable[this.dictionary["keywords"]["right"]] = {
            "create" : ["function_right"],
            "action" : ["connectBlock"],
        }
        returnTable[this.dictionary["keywords"]["left"]] = {
            "create" : ["function_left"],
            "action" : ["connectBlock"],
        }
        returnTable[this.dictionary["keywords"]["placeBrick"]] = {
            "create" : ["function_place"],
            "action" : ["connectBlock"],
        }
        returnTable[this.dictionary["keywords"]["pickBrick"]] = {
            "create" : ["function_pick"],
            "action" : ["connectBlock"],
        }
        returnTable[this.dictionary["keywords"]["placeMark"]] = {
            "create" : ["function_placemark"],
            "action" : ["connectBlock"],
        }
        returnTable[this.dictionary["keywords"]["pickMark"]] = {
            "create" : ["function_unmark"],
            "action" : ["connectBlock"],
        }
        returnTable[this.dictionary["keywords"]["true"]] = {
            "create" : ["function_true"],
            "action" : ["connectBlock"],
        }
        returnTable[this.dictionary["keywords"]["false"]] = {
            "create" : ["function_false"],
            "action" : ["connectBlock"],
        }
        returnTable[this.dictionary["keywords"]["faster"]] = {
            "create" : ["function_faster"],
            "action" : ["connectBlock"],
        }
        returnTable[this.dictionary["keywords"]["slower"]] = {
            "create" : ["function_slower"],
            "action" : ["connectBlock"],
        }
        returnTable[this.dictionary["keywords"]["beep"]] = {
            "create" : ["function_beep"],
            "action" : ["connectBlock"],
        }
        returnTable[this.dictionary["keywords"]["do"]] = {
            "create" : ["control_repeat"],
            "action" : ["connectBlock", "insertConnection", "manageNumber"],
        }
        returnTable["*" + this.dictionary["keywords"]["do"]] = {
            "create" : [],
            "action" : ["popConnectionArray"],
        }
        returnTable[this.dictionary["keywords"]["while"]] = {
            "create" : ["control_while"],
            "action" : ["connectBlock", "insertConnection", "manageCondition"],
        }
        returnTable["*" + this.dictionary["keywords"]["while"]] = {
            "create" : [],
            "action" : ["popConnectionArray"],
        }
        returnTable[this.dictionary["keywords"]["if"]] = {
            "create" : ["if_creator"],
            "action" : ["connectBlock", "insertConnection", "manageCondition"],
        }
        returnTable[this.dictionary["keywords"]["then"]] = {
            "create" : [],
            "action" : [],
        }
        returnTable[this.dictionary["keywords"]["else"]] = {
            "create" : [],
            "action" : ["popConnectionArray"],
        }
        returnTable["*" + this.dictionary["keywords"]["if"]] = {
            "create" : [],
            "action" : ["popConnectionArray"],
        }
        return returnTable;
    }

    /**
     * 
     * @param {string} word 
     */
    tellCondBlockByWord(word){
        switch(word){
            case this.dictionary["keywords"]["wall"]:
                return "condition_wall";
            case this.dictionary["keywords"]["brick"]:
                return "condition_brick";
            case this.dictionary["keywords"]["mark"]:
                return "condition_mark";
            case this.dictionary["keywords"]["vacant"]:
                return "condition_vacant";
            default:
                return "condition_userdefined";
        }
    }
    
    /**
     * Translates text code to blockly blocks. The text is loaded from `this.code`
     * and it expects that the code is error free to make meaningfull structures. 
     * To check this use function `nativeCodeChecker()`.
     * It can handle errored code but it wont run (properly or simply wont run).
     * It does not use `this.line` and uses its one `line` variable.
     * @param workspace is the workspace where the blocks will be created
     */
    makeBlocksFromNativeCode(workspace){
        var connectTo = [];
        var rules = this.createConversionTable();
        var currentRule;
        var toCollapse;
        var numOfCollapsedBlocks = 0;
        for(var line = 0; line < this.code.length; line ++){
            currentRule = {};
            if(this.code[line][0] == "" || this.code[line][0] == "#"){
                continue;
            }
            if(this.code[line][0] in rules){
                currentRule = rules[this.code[line][0]];
                var newBlock;
                if(currentRule["create"].length > 0){
                    if(currentRule["create"][0] == "if_creator"){
                        if(this.ifOrIfElse(line)){
                            newBlock = workspace.newBlock("control_if");
                        } else {
                            newBlock = workspace.newBlock("control_ifelse");
                        }
                    } else {
                        newBlock = workspace.newBlock(currentRule["create"]);
                    }
                }
            } else {
                newBlock = workspace.newBlock("function_userDefined");
                currentRule = {"action" : ["connectBlock", "insertName"]}
            }
            if(newBlock !== undefined){
                newBlock.initSvg();
                newBlock.render();
            }
            for(var i = 0; i < currentRule["action"].length; i++){
                switch(currentRule["action"][i]){
                    case "addName":
                        newBlock.setFieldValue(this.code[line][1], "NAME");
                        break;
                    case "insertConnection":
                        if(newBlock.type == "control_if"){
                            connectTo.push(newBlock.getInput('INNER_CODE_THEN').connection);
                        } else if (newBlock.type == "control_ifelse"){
                            connectTo.push(newBlock.getInput('INNER_CODE_ELSE').connection);
                            connectTo.push(newBlock.getInput('INNER_CODE_THEN').connection); 
                        } else {
                            connectTo.push(newBlock.getInput('INNER_CODE').connection);
                        }
                        break;
                    case "connectBlock":
                        if(connectTo.length > 0){
                            connectTo[connectTo.length - 1].connect(newBlock.previousConnection);
                            connectTo.pop();
                        }
                        connectTo.push(newBlock.nextConnection);
                        break;
                    case "popConnectionArray":
                        connectTo.pop();
                        break;
                    case "manageCondition":
                        if(this.code[line][1] == this.dictionary["keywords"]["isNot"]){
                            newBlock.getField('COND_PREF').setValue("optionIsNot");
                        }
                        var conditionBlock = workspace.newBlock(this.tellCondBlockByWord(this.code[line][2]));
                        conditionBlock.initSvg();
                        conditionBlock.render();
                        newBlock.getInput('COND').connection.connect(conditionBlock.outputConnection);
                        if(conditionBlock.type == "condition_userdefined"){
                            conditionBlock.getField('FC_NAME').setValue(this.code[line][2]);
                        }
                        break;
                    case "manageNumber":
                        newBlock.getField('DO_TIMES').setValue(this.code[line][1]);
                        break;
                    case "insertName":
                        newBlock.getField('FC_NAME').setValue(this.code[line][0]);
                        break;
                    case "setCollapse":
                        toCollapse = newBlock;
                        break;
                    case "collapse":
                        if(toCollapse !== undefined){
                            toCollapse.setCollapsed(true);
                            toCollapse.moveBy(0, 40 * numOfCollapsedBlocks);
                            numOfCollapsedBlocks ++;
                            toCollapse = undefined;
                        }
                        break;
                }
            }
        }
    }

    /**
     * Tells if simple if structure of if else structure should be used based on `this.code`
     * and given line.
     * returns true if simple `if then` should be generate false for `if then else`
     * @param {number} line is the line to start scanning from
     */
    ifOrIfElse(line){
        var skipIf = -1;
        for(; line < this.code.length; line ++){
            switch(this.code[line][0]){
                case this.dictionary["keywords"]["if"]:
                    skipIf ++;
                    break;
                case this.dictionary["keywords"]["else"]:
                    if(skipIf == 0){
                        return false;
                    }
                    break;
                case "*" + this.dictionary["keywords"]["if"]:
                    if(skipIf == 0){
                        return true;
                    } else {
                        skipIf --;
                    }
                    break;
            }
        }
    }

    /**
     * Simple code to blockly conversion function.
     * It loades content from HTML textarea named conversionTest
     * @param {workspace} workspace is the workspace where the blocks will be created
     */
    conversionTest(workspace){
        this.nativeCodeSplitter(document.getElementById('conversionTest').value);
        this.makeBlocksFromNativeCode(workspace);
    }
}

/**
 * Makes the code wait for given amount of miliseconds
 * @param {number} ms is the amount of miliseconds to wait for
 * @returns javascript promise to wait for
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
