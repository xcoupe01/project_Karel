import {math} from './math.js';
import {command} from './command.js'
export {interpret};

/**
 * This class is used to represent interpret in the structure.
 * Its main job is manipulate with the users code (like save it, load it, interpret if from many sources ect.)
 * It does not handle Karel, this is done through command object
 */
class interpret{

    constructor(textEditor, karel){
        this.dictionary = {};                               // current language dictionary
        this.math = new math()                              // math handlerer module
        this.command = new command(karel, this.math)        // comand handlerer module
        this.textEditor = textEditor;                       // given text editor to interpret
        this.running = false;                               // tells if Karel is executing code
        this.activeCounters = [];                           // used for DO loops
        this.programQueue = [];                             // used to jump to other programs and return back (saves position from which was jumped)
        this.interpretMode = "standard";                    // tells in which state is the interpret
        this.line = 0;                                      // actual interpret line position in the code 
        this.code = [];                                     // code formated by function nativeCodeSplitter
    }
    
    /**
     * Sets Karel's interpret to specified language with all its dependent objects
     * @param {dictionary} dictionary is the JS dictionary set of Karel words
     */
    languageSetter(dictionary){
        this.command.languageSetter(dictionary)
        this.dictionary = dictionary;
    }

    /**
     * Tells if Karel is executing code
     * @returns the running status of Karel's interpret
     */
    getRunning(){
        return this.running;
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
                "action": ["unsetDef", "resetExpWords"]
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
                "checks": [1, "checkDef", "inDef"],
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
     * Checks Karel's native code.
     * If an error is found, it is stored in the local dictionary which is outputed at the end of scanning. 
     * The output is formated as dictionary in a way where key is line of the code where error happend and the value is
     * the text information of the error.
     * Code thats beeing checked is located in `this.code`.
     * It does not utulize the `this.line` varibale and it uses its own line variable as well as this.command handeler object.
     * It also scans for command and condition definitions and stores them in catalogue (`this.commandList` and `this.conditionList`).
     * Utulizes the rules created by `createNativeRulesTable` function.
     * @returns dictionary with saved errors.
     */
    nativeCodeChecker(){
        this.command.prepareCheck();
        var inDefinition = false;
        var activeStructures = []; 
        var rules = this.createNativeRulesTable();
        var currentRule;
        var expectedWords = {"true" : false, "false" : false};
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
                    if(this.code[line][0].startsWith("#") || this.code[line] == ""){
                        currentRule = rules["comment"];
                    } else {
                        currentRule = rules["def"];
                    }
            }
            if(currentRule["token"] != "comment" && this.code[line].length != currentRule["checks"][0]){
                outputReport[line] = this.dictionary["checkerErrorMessages"]["numOfWords"];
            }
            for(var i = 1; i < currentRule["checks"].length; i++){
                switch(currentRule["checks"][i]){
                    case "notInDef":
                        if(inDefinition){
                            outputReport[line] = this.dictionary["checkerErrorMessages"]["notInDef"];
                        }
                        break;
                    case "inDef":
                        if(!inDefinition){
                            outputReport[line] = this.dictionary["checkerErrorMessages"]["inDef"];
                        }
                        break;
                    case "checkActive":
                        if(currentRule["token"] == "end"){
                            if(activeStructures.length > 0){
                                outputReport[line] = this.dictionary["checkerErrorMessages"]["checkActive"];
                            }
                            activeStructures = [];
                        } else {
                            if(activeStructures[activeStructures.length - 1] != currentRule["token"]){
                                outputReport[line] = this.dictionary["checkerErrorMessages"]["checkActive"];
                            }
                        }
                        break;
                    case "checkKWTimes":
                        if(this.code[line][2] != this.dictionary["keywords"]["times"]){
                            outputReport[line] = this.dictionary["checkerErrorMessages"]["checkKWTimes"];
                        }
                        break;
                    case "checkNumber":
                        if(this.math.isNumber(this.code[line][1])){
                            outputReport[line] = this.dictionary["checkerErrorMessages"]["checkNumber"];
                        }
                        break;
                    case "checkCondPrefix":
                        if(![this.dictionary["keywords"]["is"], this.dictionary["keywords"]["isNot"]].includes(this.code[line][1])){
                            outputReport[line] = this.dictionary["checkerErrorMessages"]["checkCondPref"];
                        }
                        break;
                    case "checkCondition":
                        this.command.checkCondition(this.code[line][2], line)
                        break;
                    case "checkDef":
                        this.command.checkCommand(this.code[line][0], line)
                        break;
                    case "checkNextThen":
                        if(this.code[line + 1][0] != this.dictionary["keywords"]["then"]){
                            outputReport[line + 1] = this.dictionary["checkerErrorMessages"]["checkNextThen"];
                        }
                        break;
                    case "checkExpectedWords":
                        for(var key in expectedWords){
                            if(expectedWords[key] == true){
                                outputReport[line] = this.dictionary["checkerErrorMessages"]["checkExpWords"];
                            }
                        }
                        break;
                }
            }
            for(var i = 0; i < currentRule["action"].length; i++){
                switch(currentRule["action"][i]){
                    case "addToCommadnList":
                        this.command.addCommandToList(this.code[line][1], line, outputReport)
                        break;
                    case "addToConditionList":
                        this.command.addConditionToList(this.code[line][1], line, outputReport);
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
                    case "resetExpWords":
                        for(var key in expectedWords){
                            expectedWords[key] = false;
                        }
                }
            }
        }
        if(Object.keys(this.command.expectDefinition).length !== 0){
            for(var key in this.command.expectDefinition){
                outputReport[key] = this.dictionary["checkerErrorMessages"]["checkDef"] + " " + this.command.expectDefinition[key];
            }
        }
        return outputReport;
    }

    /**
     * Outputs the `outputReport` dictionary to the console.
     * The `outputReport` is meant to be the result of `nativeCodeChecker` function.
     * The format of the dictionary is that key is line of error and the value is the error message.
     * Its also tells of there is an error in the report (if there isnt any, it returns true)
     * @param {dictionary} outputReport 
     * @returns true if the input is empty, false otherwise
     */
    printNativeCodeCheckerOutput(outputReport){
        this.textEditor.getSession().clearAnnotations()
        if(Object.keys(outputReport).length === 0){
            return true;
        } else {
            var annotationsToSet = []
            for(var line in outputReport){
                console.log(outputReport[line] + " at line [" + line + "]");
                annotationsToSet.push({
                    row: line,
                    column: 0,
                    text: outputReport[line],
                    type: "error" // also "warning" and "information"
                  });
            }
            this.textEditor.getSession().setAnnotations(annotationsToSet);
            return false;
        }
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
     * Resets the important variables and objects for interpret and sets the textEditor to read only mode
     */
    resetNativeCodeInterpret(){
        this.activeCounters = [];
        this.programQueue = [];
        this.command.prepareRun();
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
     * @returns true if the line is found, false otherwise
     */
    nativeCodeFindStartLine(){
        while(this.code[this.line][0] != this.dictionary["keywords"]["function"] && this.code[this.line][0] != this.dictionary["keywords"]["condition"]){
            this.line --;
            if(this.line < 0 || this.code[this.line][0] == this.dictionary["keywords"]["end"]){
                console.log("nativeCodeFindStartLine error - begining of code to be interpreted not found");
                return false;
            }
        }
        return true;
    }

    /**
     * Calls fucntion in `this.command` object to evaluate condition on current line.
     * For more details look in the description of `nativeCodeConditionEval` in `command.js` file.
     * The output of mentioned function is directly aplyed to current interpretation (line is switched and program queue is pushed)
     */
    evalNativeCodeCondition(){
        var result = this.command.nativeCodeConditionEval(this.code[this.line][2], this.code[this.line][1], this.line);
        if(result[1] != -1){
            this.programQueue.push(this.line - 1)
            this.line = result[1]
        }
        return result[0]
    }

    /**
     * Makes a one step (interpets on line) of Karel's native language.
     * To run, it needs `this.code`, `this.line` and `this.command` to be initiated properly.
     * Its meant to run in a loop, The loop should end when this function returns true.
     * Its highly recomended to use `this.resetNativeCodeInterpret` function before interpret loop.
     * and its also highly recomended to call `turnOffInterpret` to end the interpretation becase these 
     * functions will set the corect object variable values.
     * The code you want to interpret shoul be error free because there are no syntax checks. 
     * To check the syntax of the code use `nativeCodeChecker` function.
     * The commands are handeled by `this.commad` object.
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
                    if(this.command.lastConditionResult != "undef"){
                        // TODO - not a good solution, need to be redesigned
                        alert(this.command.lastConditionResult);
                    }
                    return true;
                } else {
                    this.line = this.programQueue[this.programQueue.length - 1]; 
                    //in next step the N will be incremented so we need to substract the addition to maintain the correct jump
                    this.programQueue.pop();
                }
                break;
            case this.dictionary["keywords"]["do"]:
                if(this.math.getNumber(this.code[this.line][1]) == 0){
                    this.nativeCodeJumper(this.dictionary["keywords"]["do"], false);
                } else {
                    this.activeCounters.push(this.math.getNumber(this.code[this.line][1]));
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
                var result = this.evalNativeCodeCondition();
                this.command.lastConditionResult = "undef";
                if(result == "false"){
                    this.nativeCodeJumper(this.dictionary["keywords"]["while"], false);
                }
                break;
            case "*" + this.dictionary["keywords"]["while"]:
                this.nativeCodeJumper(this.dictionary["keywords"]["while"], true);
                this.line --;
                break;
            case this.dictionary["keywords"]["if"]:
                var result = this.evalNativeCodeCondition();
                this.command.lastConditionResult = "undef";
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
            case "#":
            case "":
                break;
            default:
                result = this.command.nativeCodeCommandEval(this.code[this.line][0])
                if(result == -2){
                    return true;
                } else if(result != -1){
                    this.programQueue.push(this.line);
                    console.log(result)
                    this.line = result;
                }
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
        while(this.running){
            if(cursor){
                this.textEditor.gotoLine(this.line + 1);
            }
            if(this.nativeCodeInterpretStep(this.code)){
                this.turnOffInterpret();
            };
            await sleep(this.command.speed);
            if(this.interpretMode == "debug"){
                return;
            }
        }  
    }

    /**
     * Searches for name in command list and condition list and sets the line to be executed to start of
     * command or condition defined by the name
     * @param {string} name is the name of command or condition we want to run
     * @returns true if the name is found, false otherwise
     */
    searchForNameSetLine(name){
        var startLine = this.command.searchForNameGetLine(name);
        if(startLine == -1){
            console.log("searchForNameSetLine error - name [" + name + "] not found")
            return false;   
        }
        this.line = startLine;
        return true;
    }

    /**
     * Interprets native code from text editor
     * Checks the code for bugs
     * Ends with any kind of error (syntax error in code, nothing found to run ect.)
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
     * Interprets native Blockly generated code
     * Runs command or condition specified by name
     * Checks the code for bugs
     * WARNING - Needs a `textarea` element in the source HTML file
     * @param {string} name is the name of command or condition to be executed
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
     * Checks the code for bugs
     * Ends with any kind of error (syntax error in code, nothing found to run ect.)
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
     * Tells the blockly block name for condition by its string in code
     * If the word in code is not among the base condition set special block is created
     * @param {string} word is the string that we create the condition by
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
     * @param {number} line is the line to start scanning from
     * @returns true if simple `if then` should be generate false for `if then else`
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
     * WARNING - Needs `conversionTest` element in the source
     * @param {workspace} workspace is the workspace where the blocks will be created
     */
    conversionTest(workspace){
        this.nativeCodeSplitter(this.textEditor.getSelectedText());
        this.makeBlocksFromNativeCode(workspace);
    }

    /**
     * Creates and downoalds specified save file
     * This function can run in different modes:
     *  `room`: makes save file that saves actual room configuration
     *  `blockly`: makes save file that saves actual blocks in blockly workspace
     *  `code`: makes save file that saves actual code in code editors
     *  `all`: makes save containing all aspects of the app (all above)
     *  `byChoice`: makes save file containing user specified parts (direct connection to HTML checkboxes)
     * WARNING -  direct connection to HTML checkboxes.
     * The file is in .txt format and contains JSON structure.
     * Format of this structure is:
     *  "karelAndRoom": contains data about room and Karel's position inside
     *  "blockly": contains data about blockly workspace
     *  "code": contains data abot code editor
     * @param {string} mode is the mode the function will execute
     * @param {workspace} workspace is the blockly workspace
     * @param {string} name is the name of the file that will be generated
     */
    saveFile(mode, name, workspace){
        var saveJson = {};
        switch(mode){
            case "room":
                saveJson["karelAndRoom"] = this.command.karel.saveRoomWithKarel();
                break;
            case "blockly":
                saveJson["blockly"] = Blockly.Karel.workspaceToCode(workspace);
                break;
            case "code":
                saveJson["code"] = this.textEditor.getValue();
                break;
            case "all":
                saveJson["karelAndRoom"] = this.command.karel.saveRoomWithKarel();
                saveJson["blockly"] = Blockly.Karel.workspaceToCode(workspace);
                saveJson["code"] = this.textEditor.getValue();
                this.saveTextAsFile(JSON.stringify(saveJson), "allSaveTest");
            case "byChoice":
                if(document.getElementById('roomSaveCheckbox').checked){
                    saveJson["karelAndRoom"] = this.command.karel.saveRoomWithKarel();
                }
                if(document.getElementById('blocksSaveCheckbox').checked){
                    saveJson["blockly"] = Blockly.Karel.workspaceToCode(workspace);
                }
                if(document.getElementById('codeSaveCheckbox').checked){
                    saveJson["code"] = this.textEditor.getValue();   
                }
                break;
            default:
                console.log("saveFile - unsuported mode [" + mode + "]");
                return; 
        }
        saveTextAsFile(JSON.stringify(saveJson), name);
    }

    /**
     * Checks if save file is correct
     * @param {dictionary} dataJson parsed save file to JSON dictionary
     * @returns true if the given save JSON is correct for this app, false otherwise
     */
    checkLoadedFile(dataJson){
        for(var item in dataJson){
            switch(item){
                case "karelAndRoom":
                    if(!this.command.karel.checkLoadFileKarelAndRoom(dataJson[item])){
                        return false;
                    }
                    break;
                case "code":
                case "blockly":
                    this.nativeCodeSplitter(dataJson[item]);
                    if(!this.printNativeCodeCheckerOutput(this.nativeCodeChecker())){
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
     * Load data from file and sets the app by them
     * This function can run in a different modes:
     *  `room`: loads and applyes only data that specifies the room and karel's position in it
     *  `blockly`: loads and applyes only data that specifies blockly workspace
     *  `code`: loads and applyes only data that specifies code editor
     *  `all`: loads and applyes all informations (all above, no contorl) 
     *  `byFile`: loads and applyes only mentioned data (some of above)
     * Use check loader fucntion before loading file to prevent bugs.
     * The save format is expected the save as desribed in `saveFile` function
     * @param {string} mode is the mode which the function will run 
     * @param {workspace} workspace is the blockly workspace
     * @param {elementID} fileToLoadID is the ID of HTML element where is the file
     */
    loadFromFile(mode, workspace, fileToLoadID){
        var fileToLoad = document.getElementById(fileToLoadID).files[0];
        var fileReader = new FileReader();
        var interpret = this;
        fileReader.onload = function(fileLoadedEvent) 
        {
            switch(mode){
                case "room":
                    interpret.command.karel.loadRoomWithKarel(JSON.parse(fileLoadedEvent.target.result));
                    break;
                case "blockly":
                    workspace.clear();
                    interpret.nativeCodeSplitter(fileLoadedEvent.target.result);
                    interpret.makeBlocksFromNativeCode(workspace);
                    break;
                case "code":
                    interpret.textEditor.setValue(fileLoadedEvent.target.result);
                    break;
                case "all":
                    var dataJson = JSON.parse(fileLoadedEvent.target.result);
                    interpret.command.karel.loadRoomWithKarel(dataJson["karelAndRoom"]);
                    workspace.clear();
                    interpret.nativeCodeSplitter(dataJson["blockly"]);
                    interpret.makeBlocksFromNativeCode(workspace);
                    interpret.textEditor.setValue(dataJson["code"]);
                    break;
                case "byFile":
                    try{
                        var dataJson = JSON.parse(fileLoadedEvent.target.result);
                        if(!interpret.checkLoadedFile(dataJson)){
                            throw "Corrupted save file";
                        }
                    }
                    catch(err){
                        console.log("loadFromFile error - Corupted save file")
                        return;
                    }
                    for(var key in dataJson){
                        switch(key){
                            case "karelAndRoom":
                                interpret.command.karel.loadRoomWithKarel(dataJson["karelAndRoom"]);
                                break;
                            case "blockly":
                                workspace.clear();
                                interpret.nativeCodeSplitter(dataJson["blockly"]);
                                interpret.makeBlocksFromNativeCode(workspace);
                                break;
                            case "code":
                                interpret.textEditor.setValue(dataJson["code"]);
                                break;
                            default:
                                console.log("LoadFromFile warning - unknown save tree [" + key + "]");
                                break;
                        }
                    }
                    break;
                default:
                    console.log("LoadFromFile error - unsuported mode [" + mode + "]");
                    return;
            } 
        };
        try {
            fileReader.readAsText(fileToLoad, "UTF-8");
        } catch(err) {
            alert('No file to load');
      };  
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

/**
 * Saves a string to a .txt file
 * @param {string} textToWrite is the string to be saved
 * @param {string} fileNameToSaveAs is the name of the file that will be downalded
 */
function saveTextAsFile(textToWrite,fileNameToSaveAs){

    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Upload File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    
    downloadLink.click();
}
