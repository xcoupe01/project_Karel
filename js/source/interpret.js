export {interpret};

class interpret{

    constructor(textEditor, karel){
        this.dictionary = {};           // current language dictionary
        this.karel = karel;             // given robot karel to operate with
        this.textEditor = textEditor;   // given text editor to interpret
        this.commandList = {};          // user defined commands list dictionary
        this.conditionList = {};        // user defined condition list dictionary
        this.running = false;           // tells if Karel is executing code
    }


    // code gutted from karel.js -- need to redone but it works
    
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
            if(["forward", "right", "left", "placeBrick", "pickBrick", "placeMark", "pickMark", "true", "false", "wall", "brick", "mark"].includes(key)){
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
     */
    getRunning(){
        return this.running;
    }

    /**
     * Adds command record to the interprets dictionary to make it callable
     * @param {string} name is the name of the command
     * @param {number} line is the starting line of the command
     */
    addCommandToList(name, line){
        if(name in this.commandList){
            console.log("ACommaTL error - command redefiniton at line [" + line + "]");
            return false;
        } else if(this.reservedWords.includes(name)){
            console.log("ACommaTL error - redefining reserved word at line [" + line + "]");
            return false;
        } else {
            this.commandList[name] = line;
            return true;
        }
    }

    /**
     * Adds condition record to the interprets dictionary to make it callable
     * @param {string} name is the name of the condition
     * @param {number} line is the starting line of the condition
     */
    addConditionToList(name, line){
        if(name in this.conditionList){
            console.log("ACondTL error - condition redefiniton at line [" + line + "]");
            return false;
        } else if(this.reservedWords.includes(name)){
            console.log("ACommaTL error - redefining reserved word at line [" + line + "]");
            return false;
        } else {
            this.conditionList[name] = line;
            return true;
        }
    }

    /**
     * Splits the native code to array, Its use as a basic interpret format here
     * @param {string} code is the string to be splitted
     */
    nativeCodeSplitter(code){
        var arrayCode = [];
        var splitCode = code.split(/\r?\n/);
        for(var i = 0; i < splitCode.length; i++){
            splitCode[i] = splitCode[i].trim();
            arrayCode[i] = splitCode[i].split(/\ +/);
        }
        return arrayCode;
    }

    /**
     * Returns Rule dictionary for the native syntax checker function
     * Rules are related to the words of the language
     * Its format requires that every end node contains string `token`, array `checks` and array `action`
     * The checker will control the `checks` section and trigger the `action` section
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
                "action": ["addToConditionList", "setDef"]
            },
            "end" : {
                "token": "end",
                "checks": [1, "inDef", "checkActive"],
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
                    "checks": [3, "checkCondPrefix", "checkCondition", "inDef"],
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
            }
        }
    }

    /**
     * Interprets native Karel code
     * @param {string} code is the code to be interpreted
     */
    nativeCodeChecker(code){

        this.commandList = {};
        this.conditionList = {};
        var inDefinition = false;
        var activeStructures = []; 
        var rules = this.createNativeRulesTable();
        var currentRule;

        for(var line = 0; line < code.length; line++){
            currentRule = [];
            switch(code[line][0]){
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
                default:
                    if(code[line][0].startsWith("#")){
                        currentRule = rules["comment"];
                    } else {
                        currentRule = rules["def"];
                    }
            }

            if(currentRule["token"] != "comment" && code[line].length != currentRule["checks"][0]){
                console.log("nativeCodeChecker error - bad number of word on line [" + line + "]");
                return false;
            }

            for(var i = 1; i < currentRule["checks"].length; i++){
                switch(currentRule["checks"][i]){
                    case "notInDef":
                        if(inDefinition){
                            console.log("nativeCodeChecker error - notInDef check failed at line [" + line + "]");
                            return false;
                        }
                        break;
                    case "inDef":
                        if(!inDefinition){
                            console.log("nativeCodeChecker error - InDef check failed at line [" + line + "]");
                            return false;
                        }
                        break;
                    case "checkActive":
                        if(currentRule["token"] == "end"){
                            if(activeStructures.length > 0){
                                console.log("nativeCodeChecker error - checkActive check failed at line [" + line + "]");
                                return false;
                            }
                        } else {
                            if(activeStructures[activeStructures.length - 1] != currentRule["token"]){
                                console.log("nativeCodeChecker error - checkActive check failed at line [" + line + "]");
                                return false;
                            }
                        }
                        break;
                    case "checkKWTimes":
                        if(code[line][2] != this.dictionary["keywords"]["times"]){
                            console.log("nativeCodeChecker error - checkKWTimes check failed at line [" + line + "]");
                            return false;
                        }
                        break;
                    case "checkNumber":
                        if(isNaN(parseInt(code[line][1]))){
                            console.log("nativeCodeChecker error - checkNumber check failed at line [" + line + "]");
                            return false;
                        }
                        break;
                    case "checkCondPrefix":
                        if(![this.dictionary["keywords"]["is"], this.dictionary["keywords"]["isNot"]].includes(code[line][1])){
                            console.log("nativeCodeChecker error - checkCondPrefix check failed at line [" + line + "]");
                            return false;
                        }
                        break;
                    case "checkCondition":
                        if(![this.dictionary["keywords"]["wall"], this.dictionary["keywords"]["brick"], this.dictionary["keywords"]["mark"]].includes(code[line][2]) 
                            && !(code[line][2] in this.conditionList)){
                            console.log("nativeCodeChecker error - checkCondition check failed at line [" + line + "]");
                            return false;
                        }
                        break;
                    case "checkDef":
                        if(!this.functions.includes(code[line][0]) && !(code[line][0] in this.commandList) && code[line] != ""){
                            console.log("nativeCodeChecker error - checkDef check failed at line [" + line + "]");
                            return false;
                        }
                        break;
                }
            }

            for(var i = 0; i < currentRule["action"].length; i++){
                switch(currentRule["action"][i]){
                    case "addToCommadnList":
                        if(!this.addCommandToList(code[line][1], line)){
                            return false;
                        }
                        break;
                    case "addToConditionList":
                        if(!this.addConditionToList(code[line][1], line)){
                            return false;
                        }
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
                }
            }
        }
        return true;
    }

    /**
     * Evaluates a given basic condition
     * @param {string} prefix is the Karel prefix of condition (is/isnt)
     * @param {string} condition is the condition itself
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
            }
        } else {
            switch(condition){
                case this.dictionary["keywords"]["wall"]:
                    return !this.karel.isWall();
                case this.dictionary["keywords"]["brick"]:
                    return !this.karel.isBrick();
                case this.dictionary["keywords"]["mark"]:
                    return !this.karel.isMark();
            }
        }
        return false;
    }

    /**
     * Evaluates given condition in native code
     * @param {string} codeLine the line where the condition appears
     * @param {string} lastConditionResult to pass new result
     * @param {number} line to pass jump to user defined condition
     */
    nativeCodeConditionEval(codeLine, lastConditionResult, line){
        if([this.dictionary["keywords"]["wall"], this.dictionary["keywords"]["brick"], this.dictionary["keywords"]["mark"]].includes(codeLine[2])){
            return [(this.checkBaseCondition(codeLine[1], codeLine[2]) === true) ? "true" : "false", line] ;
        }
        if(lastConditionResult != "undef"){
            if(codeLine[1] == this.dictionary["keywords"]["is"]){
                return [(lastConditionResult == "true") ? "true" : "false", line];
            } else {
                return [(lastConditionResult == "false") ? "true" : "false", line];
            }
        }
        return ["undef", this.conditionList[codeLine[2]]];
    }

    /**
     * Computes where to jump in code based on given values
     * @param {string} command is the command which requires jump
     * @param {boolean} up if true, the jump is upwards in the code, downwards otherwise
     * @param {Array} code is the array thats produced by nativeCodeSplitter
     * @param {number} line is the current place in code
     */
    nativeCodeJumper(command, up, code, line){
        var numSkip = 0;
        if(command == this.dictionary["keywords"]["if"]){
            while(true){
                line ++;
                if(code[line][0] == command){
                    numSkip ++;
                } else if(code[line][0] == "*" + command && numSkip > 0){
                    numSkip--;
                } else if((code[line][0] == this.dictionary["keywords"]["else"] && numSkip == 0) || (code[line][0] == "*" + command && numSkip == 0)){
                    return line;
                }
            }
        }
        if(up){
            while(true){
                line --;
                if(code[line][0] == "*" + command){
                    numSkip++;
                } else if(code[line][0] == command && numSkip > 0){
                    numSkip--;
                } else if(code[line][0] == command && numSkip == 0){
                    return line;
                }
            }
        } else {
            while(true){
                line ++;
                if(code[line][0] == command){
                    numSkip++;
                } else if(code[line][0] == "*" + command && numSkip > 0){
                    numSkip--;
                } else if(code[line][0] == "*" + command && numSkip == 0){
                    return line;
                }
            }
        }
    }

    /**
     * Interpret native code from Editor
     */
    async nativeCodeInterpretFromEditor(){
        if(this.running){
            console.log("ITC error - cannot run multiple programs at the same time");
            return;
        }

        this.running = true;
        var line = this.textEditor.selection.getCursor().row;
        var code = this.nativeCodeSplitter(this.textEditor.getValue());

        if(!this.nativeCodeChecker(code)){
            this.running = false;
            return;
        }

        var activeCounters = [];    //used for DO loops
        var programQueue = [];      //used to jump to other programs and return back (saves position from which was jumped)
        var lastConditionResult = "undef";

        while(code[line][0] != this.dictionary["keywords"]["function"] && code[line][0] != this.dictionary["keywords"]["condition"]){
            line --;
            if(line < 0 || code[line][0] == this.dictionary["keywords"]["end"]){
                console.log("nativeCodeInterpret error - behining of code to be interpreted not found");
                this.running = false;
                return;
            }
        }

        while(this.running){
            this.textEditor.gotoLine(line + 1);
            switch(code[line][0]){
                case this.dictionary["keywords"]["function"]:
                case this.dictionary["keywords"]["condition"]:
                    break;
                case this.dictionary["keywords"]["end"]:
                    if(programQueue.length == 0){
                        this.running = false;
                        return;
                    } else {
                        line = programQueue[programQueue.length - 1]; 
                        //in next step the N will be incremented so we need to substract the addition to maintain the correct jump
                        programQueue.pop();
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
                    if(parseInt(code[line][1]) == 0){
                        line = this.nativeCodeJumper(this.dictionary["keywords"]["do"], false, code, line);
                    } else {
                        activeCounters.push(code[line][1]); 
                    }
                    break;
                case "*" + this.dictionary["keywords"]["do"]:
                    activeCounters[activeCounters.length - 1] --;
                    if(activeCounters[activeCounters.length - 1] > 0){
                        line = this.nativeCodeJumper(this.dictionary["keywords"]["do"], true, code, line);
                    } else {
                        activeCounters.pop();
                    }
                    break;
                case this.dictionary["keywords"]["while"]:
                    var result = this.nativeCodeConditionEval(code[line], lastConditionResult, line);
                    lastConditionResult = "undef";
                    if(result[0] == "undef"){
                        programQueue.push(line - 1);
                        line = result[1];
                    } else if(result[0] == "false"){
                        line = this.nativeCodeJumper(this.dictionary["keywords"]["while"], false, code, line);
                    }
                    break;
                case "*" + this.dictionary["keywords"]["while"]:
                    line = this.nativeCodeJumper(this.dictionary["keywords"]["while"], true, code, line) - 1;
                    break;
                case this.dictionary["keywords"]["if"]:
                    var result = this.nativeCodeConditionEval(code[line], lastConditionResult, line);
                    lastConditionResult = "undef";
                    if(result[0] == "undef"){
                        programQueue.push(line - 1);
                        line = result[1];
                    } else if(result[0] == "false"){
                        line = this.nativeCodeJumper(this.dictionary["keywords"]["if"], false, code, line);
                    }
                    break;
                case this.dictionary["keywords"]["else"]:
                    line = this.nativeCodeJumper(this.dictionary["keywords"]["if"], false, code, line);
                    break;
                case this.dictionary["keywords"]["then"]:
                case "*" + this.dictionary["keywords"]["if"]:
                    break;
                case this.dictionary["keywords"]["true"]:
                    lastConditionResult = "true";
                    break;
                case this.dictionary["keywords"]["false"]:
                    lastConditionResult = "false";
                    break;
                case "#":
                    break;
                default:
                    if(!(code[line][0] in this.commandList)){
                        console.log("ITC error - unexpected word - " + code[line][0]);
                        return;
                    }
                    programQueue.push(line);
                    line = this.commandList[code[line][0]];
            }
            line ++;
            await sleep(125);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
