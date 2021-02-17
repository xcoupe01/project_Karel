import {math} from './math.js';
import {command} from './command.js';
export {interpret};

/**
 * This class is used to represent interpret in the structure.
 * Its main job is manipulate with the users code (like save it, load it, interpret if from many sources ect.)
 * It does not handle Karel, this is done through command object
 */
class interpret{

    constructor(textEditor, blocklyTextRep, karel){
        this.dictionary = {};                               // current language dictionary
        this.math = new math()                              // math handlerer module
        this.command = new command(karel, this.math)        // comand handlerer module
        this.textEditor = textEditor;                       // given text editor to interpret
        this.blocklyTextRepresentation = blocklyTextRep;    // read only blockly text representaton editor
        this.running = false;                               // tells if Karel is executing code
        this.activeCounters = [];                           // used for DO loops
        this.programQueue = [];                             // used to jump to other programs and return back (saves position from which was jumped)
        this.debug = {codePointer: {}, active: false};      // saves codePointer during debug and if debug is active
        this.closer = "*";                                  // tells the ending character (default is '*')
        this.closerRegex = new RegExp(/^\*/);               // Regular expression of closer
        this.commentary = new RegExp(/^#/);                 // Regular expression of comments (default is '#')
        this.lockBlocklyTextEditor = false;                 // Blocks Blockly from writing to blockly text representation editor if true
        this.counter = -1;                                  // Step counter
        this.updateCounter();
    }
    
    /**
     * Sets Karel's interpret to specified language with all its dependent objects.
     * @param {dictionary} dictionary is the JS dictionary set of Karel words.
     */
    languageSetter(dictionary){
        this.dictionary = dictionary;
    }

    /**
     * Tells if Karel is executing code.
     * @returns the running status of Karel's interpret.
     */
    getRunning(){
        return this.running;
    }

    /**
     * Sets interpret to running state and swithces the indicator in the UI.
     * Needs div in the html vith `runningIndicator` id !!!
     */
    setRunningTrue(){
        this.running = true;
        this.originalIndicatorColor = document.querySelector('#runningIndicator').style.backgroundColor;
        document.querySelector('#runningIndicator').style.backgroundColor = "red";
    }

    /**
     * Sets interpret to not running state and swithces off the indicator in the UI.
     * Needs div in the html vith `runningIndicator` id !!! 
     */
    setRunningFalse(){
        this.running = false;
        document.querySelector('#runningIndicator').style.backgroundColor = this.originalIndicatorColor;
    }

    /**
     * Resets the important variables and objects for interpret and sets the textEditor to read only mode.
     */
    resetNativeCodeInterpret(editor){
        this.activeCounters = [];
        this.programQueue = [];
        this.command.prepareRun();
        if(editor !== undefined){
            editor.setReadOnly(true);
        }
    }

    /**
     * Makes the interpret stop and unsets the given editor read only mode.
     * If the editor is the blockly representation editor, it wont switch the read only mode.
     * @param editor is the editor to be set to read only mode 
     */
    turnOffInterpret(editor){
        this.debug.active = false;
        this.debug.codePointer = {};
        this.setRunningFalse();
        if(editor !== undefined && editor != this.blocklyTextRepresentation){
            editor.setReadOnly(false);
        }
    }

    /**
     * Inccrements the step counter and updates its display.
     * Needs div in the html vith `counterDisplay` id !!!
     */
    updateCounter(){
        this.counter ++;
        document.getElementById('counterDisplay').textContent = this.counter;
    }

    /**
     * Sets the step counter to zero adn updtaes its display.
     * Needs div in the html vith `counterDisplay` id !!!
     */
    resetCounter(){
        this.counter = 0;
        document.getElementById('counterDisplay').textContent = this.counter;
    }

    /**
     * Tokenizes input from given ACE editor. Uses TokenIterator avalible from ACE library.
     * Designed to process Karel's native programming language, does not matter on world language if the current dictionary is set correctly.
     * Goes through the code and parses it to tokens which are returned in a javascript dictionary.
     * The code is separated in the dictionary like the folowing example:
     * {"function name" : [tokens of that function]} 
     * There are all tokens that corresponds to this function (even name and defining words).
     * Token consist of these values:
     *  - value: is the actual word that was read from the editor
     *  - meaning: is the syntactical meaning of the word (terminal)
     *  - dictKey: is the key to the dictionary for this word (if the key is avalible)
     *  - row: is the row where the token was found
     *  - column: is the column where the token was found
     * There are these possible meaning (terminals):
     *  - function-def, condition-def, end, command, condition, identifier, output, number, do-start, do-end,
     *     times, while-start, while-end, if-start, if-end, then, else, condition-prefix
     * @param {ACE editor} editor is the editor we want to be tokenized from 
     * @returns dictionary of functions that contains its tokens.  
     */
    nativeCodeTokenizer(editor){
        var TokenIterator = require("ace/token_iterator").TokenIterator;
        var tokenizer = new TokenIterator(editor.session, 0, 0);
    
        // addresses some issues with the first run of the ACE tokenizer
        tokenizer.stepForward();
        while(tokenizer.getCurrentToken() !== undefined){
            tokenizer.stepBackward();
        }
        tokenizer.stepForward();
        
        let commands = [this.dictionary["keywords"]["forward"], this.dictionary["keywords"]["left"], this.dictionary["keywords"]["right"],
            this.dictionary["keywords"]["placeBrick"], this.dictionary["keywords"]["pickBrick"], this.dictionary["keywords"]["placeMark"],
            this.dictionary["keywords"]["pickMark"], this.dictionary["keywords"]["faster"], this.dictionary["keywords"]["slower"],
            this.dictionary["keywords"]["beep"]];
        
        let conditions = [this.dictionary["keywords"]["wall"], this.dictionary["keywords"]["brick"], 
            this.dictionary["keywords"]["mark"], this.dictionary["keywords"]["vacant"]];

        let outputs = [this.dictionary["keywords"]["true"], this.dictionary["keywords"]["false"]];

        var codeArray = [[]];
        var iterator = 0;
        var closerLast = false;
        while(tokenizer.getCurrentToken() !== undefined){
            if(!(/^\s+$/).test(tokenizer.getCurrentToken().value) && !this.commentary.test(tokenizer.getCurrentToken().value)){
                var token = {
                    value: tokenizer.getCurrentToken().value,
                    meaning: 'identifier',
                    dictKey: "",
                    row: tokenizer.getCurrentTokenRow(),
                    column: tokenizer.getCurrentTokenColumn(),
                }
                for(var key in this.dictionary["keywords"]){
                    if(token.value == this.dictionary["keywords"][key]){
                        token.dictKey = key;
                        break;
                    }
                }
                if(commands.includes(token.value)){
                    token.meaning = "command";
                } else if(conditions.includes(token.value)){
                    token.meaning = "condition";
                } else if(outputs.includes(token.value)){
                    token.meaning = "output";
                } else if(Number.isInteger(parseInt(token.value))){
                    token.meaning = "number";
                } else {
                    switch(token.dictKey){
                        case "function":
                            token.meaning = "function-def";
                            break;
                        case "condition":
                            token.meaning = "condition-def";
                            break;
                        case "end":
                            token.meaning = "end";
                            break;
                        case "do":
                            if(closerLast){
                                codeArray[iterator].pop();
                                token.meaning = "do-end";
                                token.column -= this.closer.length;
                                token.value = this.closer + token.value;
                            } else {
                                token.meaning = "do-start";
                            }
                            break;
                        case "times":
                            token.meaning = "times";
                            break;
                        case "do":
                            token.meaning = "do-end";
                            token.column -= this.closer.length;
                            break;
                        case "while":
                            if(closerLast){
                                codeArray[iterator].pop();
                                token.meaning = "while-end";
                                token.column -= this.closer.length;
                                token.value = this.closer + token.value;
                            } else {
                                token.meaning = "while-start";
                            }
                            break;
                        case "while":
                            token.meaning = "while-end";
                            token.column -= this.closer.length;
                            break;
                        case "if":
                            if(closerLast){
                                codeArray[iterator].pop();
                                token.meaning = "if-end";
                                token.column -= this.closer.length;
                                token.value = this.closer + token.value;
                            } else {
                                token.meaning = "if-start";
                            }
                            break;
                        case "then":
                            token.meaning = "then";
                            break;
                        case "else":
                            token.meaning = "else";
                            break;
                        case "if":
                            token.meaning = "if-end"
                            token.column -= this.closer.length;
                            break;
                        case "is":
                        case "isNot":
                            token.meaning = "condition-prefix";
                            break;
                    }
                }
                codeArray[iterator].push(token);
                if(token.meaning == "end"){
                    iterator ++;
                    codeArray.push([]);
                }
                if(token.value == this.closer){
                    closerLast = true;
                } else {
                    closerLast = false;
                }
            }
            tokenizer.stepForward();
        }
        return codeArray;
    }

    /**
     * Provides sytax checking based on LL1 table. The table is defined on the begining of the functinon.
     * For more informations about the table and the rules visit folowing URL:
     * https://docs.google.com/spreadsheets/d/1ZHOjsJgSekrjLMMdATj4ccAKeb4HEqrpOBlI2Gh33ko/edit?usp=sharing
     * For more infotmations about the LL1 grammar checking visit folowing URL:
     * https://en.wikipedia.org/wiki/LL_parser
     * Apart from checking the syntax, the function prepares the code to be interpreted. For this purpouse,
     * it creates list of user defined commands and conditions in the command object in a similar fashion,
     * as the nativeCodeTokenizer created its output. The tokens are stored there in arrays and you can get to them
     * by the function name (for example this.command.commandList["test"].code tells you the array of tokens for command "test").
     * The userdefined commands are avalible in commandList property and the userdefined conditions are stored in conditionList.
     * In the records of commands and condtions there are properties:
     *  - code: the array of all tokens that belongs to specific function
     *  - definingToken: is the token that gave the specific function a name
     *  - result: only for condition! array of results which is used when called.
     * It processes each function by itself, when an error is found, the analysis ends and an error is recorded.
     * At the end all the errors are returned in an array with their labels and tokens that caused them.
     * @param {ACE editor} editor is the editor which will be checked and processed
     * @returns array of errors 
     */
    syntaxCheck(editor){
        this.command.prepareCheck();
        var codeArray = this.nativeCodeTokenizer(editor);
        let rules = [
            /* 0 */     [
                            {item: "function-def",      checks: []}, 
                            {item: "identifier",        checks: ["define-command"]}, 
                            {item: "<command-block>",   checks: []}, 
                            {item: "end",               checks: []}
                        ],
            /* 1 */     [
                            {item: "condition-def",     checks: ["condition-expected"]}, 
                            {item: "identifier",        checks: ["define-condition"]}, 
                            {item: "<command-block>",   checks: []}, 
                            {item: "end",               checks: []}
                        ],
            /* 2 */     [
                            {item: "command",           checks: []}, 
                            {item: "<command-block>",   checks: []}],
            /* 3 */     [
                            {item: "identifier",        checks: ["reachable"]}, 
                            {item: "<command-block>",   checks: []}
                        ],
            /* 4 */     [
                            {item: "if-start",          checks: []}, 
                            {item: "condition-prefix",  checks: []}, 
                            {item: "<condition-core>",  checks: []}, 
                            {item: "then",              checks: []}, 
                            {item: "<command-block>",   checks: []}, 
                            {item: "<end-if>",          checks: []}
                        ],
            /* 5 */     [
                            {item: "if-end",            checks: []}, 
                            {item: "<command-block>",   checks: []}
                        ],
            /* 6 */     [
                            {item: "else",              checks: []}, 
                            {item: "<command-block>",   checks: []}, 
                            {item: "if-end",            checks: []}, 
                            {item: "<command-block>",   checks: []}
                        ],
            /* 7 */     [   
                            {item: "while-start",       checks: []}, 
                            {item: "condition-prefix",  checks: []}, 
                            {item: "<condition-core>",  checks: []}, 
                            {item: "<command-block>",   checks: []}, 
                            {item: "while-end",         checks: []}, 
                            {item: "<command-block>",   checks: []}
                        ],
            /* 8 */     [
                            {item: "do-start",          checks: []}, 
                            {item: "number",            checks: []}, 
                            {item: "times",             checks: []}, 
                            {item: "<command-block>",   checks: []}, 
                            {item: "do-end",            checks: []}, 
                            {item: "<command-block>",   checks: []}
                        ],
            /* 9 */     [],
            /* 10 */    [
                            {item: "identifier",        checks: ["reachable-condition"]}
                        ],
            /* 11 */    [
                            {item: "condition",         checks: []}
                        ],
            /* 12 */    [
                            {item: "output",            checks: ["remove-expected"]},
                            {item: "<command-block>",   checks: []}
                        ]
        ];
        let xAxisTable = ["function-def", "condition-def", "end", "identifier", "command", "condition", "do-start", "times", 
            "do-end", "while-start", "while-end", "if-start", "then", "else", "if-end", "condition-prefix", "number", "output"]; // all terminals
        let yAxisTable = ["<start>", "<command-block>", "<end-if>", "<condition-core>"]; // all neterminals
        let table = [
                        //    0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17
                        //   fud cod end ide com con dos tim doe whs whe ifs the els ife cop num out
            /* start */     [ 0,  1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            /* com-block */ [-1, -1,  9,  3,  2, -1,  8, -1,  9,  7,  9,  4, -1,  9,  9, -1, -1, 12],
            /* end-if */    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  6,  5, -1, -1, -1],
            /* cond-core */ [-1, -1, -1, 10, -1, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
        ]   // LL1 table

        var errors = [];

        for(var i = 0; i < codeArray.length; i++){
            if(codeArray[i].length <= 0){
                break;
            }
            var stack = [{item: "<start>"}];
            var expected = [];
            var buffer = [];
            while(stack.length > 0){
                var noError = true;
                while(stack.length > 0 && stack[0].item == codeArray[i][0].meaning){
                    for(var j = 0; j < stack[0].checks.length; j++){
                        switch(stack[0].checks[j]){
                            case "define-command":
                                noError = this.command.defineCommand(codeArray[i][0], buffer, errors, this.dictionary)
                                break;
                            case "define-condition":
                                noError = this.command.defineCondition(codeArray[i][0], buffer, errors, this.dictionary)
                                break;
                            case "condition-expected":
                                expected.push(this.dictionary["keywords"]["true"], this.dictionary["keywords"]["false"]);
                                break;
                            case "reachable":
                                this.command.checkReachable(codeArray[i][0]);
                                break;
                            case "reachable-condition":
                                this.command.checkReachableCondition(codeArray[i][0], errors, this.dictionary);
                                break;
                            case "remove-expected":
                                if(expected.includes(codeArray[i][0].value)){
                                    expected.splice(expected.indexOf(codeArray[i][0].value), 1);
                                }
                                break;
                        }
                    }
                    if(!noError){
                        break;
                    }
                    stack.shift();
                    buffer.push(codeArray[i].shift());
                }
                if(!noError){
                    break;
                }
                if(stack.length <= 0){
                    break;
                }
                if(xAxisTable.includes(stack[0].item)){
                    errors.push({
                        error: this.dictionary["checkerErrorMessages"]["unexpectedWord"][0] + 
                        codeArray[i][0].value + 
                        this.dictionary["checkerErrorMessages"]["unexpectedWord"][1] + 
                        stack[0].item, 
                        token: codeArray[i][0]});
                    break;
                }
                let searchX = xAxisTable.indexOf(codeArray[i][0].meaning);
                let searchY = yAxisTable.indexOf(stack[0].item);
                if(searchX == -1 || searchY == -1){
                    console.log("X: ",searchX, " Y: ",searchY);
                    console.log("stack: ",stack);
                    console.log("testedCommand: ",codeArray[i]);
                    throw "Table error - bad index";
                }
                if(table[searchY][searchX] != -1){
                    stack.shift()
                    stack = rules[table[searchY][searchX]].concat(stack);
                } else {
                    errors.push({
                        error: this.dictionary["checkerErrorMessages"]["unexpectedWord"][0] + 
                        codeArray[i][0].value + 
                        this.dictionary["checkerErrorMessages"]["unexpectedWord"][1] + 
                        stack[0].item, 
                        token: codeArray[i][0]});
                    break;
                }
            }
            if(expected.length > 0){
                errors.push({error: this.dictionary["checkerErrorMessages"]["missing"] + expected , token: this.command.getDefiningToken(this.command.getFunctionByToken(buffer[0]))})
            }
        }
        for(var key in this.command.expectDefinition){
            for(var i = 0; i < this.command.expectDefinition[key].tokens.length; i++){
                errors.push({error: this.dictionary["checkerErrorMessages"]["missingDef"] + this.command.expectDefinition[key].type, token: this.command.expectDefinition[key].tokens[i]})
            }
        }
        return errors;
    }

    /**
     * Processes error aray whitch is generated by syntaxCheck functon.
     * Sets markers with descriptions at the editor gutter and underlines the words,
     * which caused these errors.
     * @param {array} errors is the array of errors which creates syntaxCheck function.
     * @param {ACE edtor} editor is the editor where the errors will be visualized.
     */
    processErrors(errors, editor){
        editor.getSession().clearAnnotations();
        for(var key in editor.getSession().$backMarkers){
            if(editor.getSession().$backMarkers[key].clazz == "errorMarker"){
                editor.getSession().removeMarker(editor.getSession().$backMarkers[key].id);
            }
        }
        if(errors.length > 0){
            var annotationsToSet = [];
            var Range = ace.require('ace/range').Range;
            for(var i = 0; i < errors.length; i++){
                editor.session.addMarker(
                    new Range(errors[i].token.row, 
                        errors[i].token.column, 
                        errors[i].token.row, 
                        errors[i].token.column + errors[i].token.value.length), 
                    "errorMarker", 
                    "text"
                );
                annotationsToSet.push({
                    row: errors[i].token.row,
                    colum: errors[i].token.column,
                    text: errors[i].error,
                    type: "error" // also "warning" and "information"
                })
            }
            editor.getSession().setAnnotations(annotationsToSet);
            editor.getSession().on('change', function(){
                for(var key in editor.getSession().$backMarkers){
                    if(editor.getSession().$backMarkers[key].clazz == "errorMarker"){
                        editor.getSession().removeMarker(editor.getSession().$backMarkers[key].id);
                    }
                }
            })
            return true;
        }
        return false;
    }

    /**
     * Executes jumps given by the labels. To process the jump there is rules table by which it knows what
     * jump is needed. The rule is defined like the following description:
     *  - start:
     *  - ends: array of possible jump endings
     *      - value: is the token meaning value for jump end
     *      - definitive: true if the token ends the jump label, false otherwise (else does not end the if structure, if-end does)
     *  - forward: true if we want to jump forward, false if backward
     * It chooses the rule by the given token (which is found by given codePointer).
     * The rule must be in the rules dictionary by the key of the given token meaning.
     * @param {codePointer object} codePointer is the codePointer that will define the jump and it will be jumped with
     */
    tokenJumper(codePointer){
        var nestedCycles = 0;
        let jumpRules = {
            "do-start":     {start: "do-start",     ends: [{value: "do-end", definitive: true}],        forward: true},
            "do-end":       {start: "do-end",       ends: [{value: "do-start", definitive: true}],      forward: false},
            "while-start":  {start: "while-start",  ends: [{value: "while-end", definitive: true}],     forward: true},
            "while-end":    {start: "while-end",    ends: [{value: "while-start", definitive: true}],   forward: false},
            "if-start":     {start: "if-start",     ends: [{value: "if-end", definitive: true}, {value: "else", definitive: false}], forward: true},
            "else":         {start: "if-start",     ends: [{value: "if-end", definitive: true}],        forward: true},
        };
        let rule = jumpRules[this.command.getToken(codePointer).meaning];
        if(rule === undefined){
            console.log(this.command.getToken(codePointer));
            throw "No jump rule for this token!";
        }
        while(true){
            if(rule.forward){
                codePointer.tokenPointer ++;
            } else {
                codePointer.tokenPointer --;
            }
            if(this.command.getToken(codePointer).meaning == rule.start){
                nestedCycles ++;
            } else {
                var searchResult = -1;
                for(var i = 0; i < rule.ends.length; i++){
                    if(this.command.getToken(codePointer).meaning == rule.ends[i].value){
                        searchResult = i;
                        break;
                    }
                }
                if(searchResult != -1){
                    if(nestedCycles > 0){
                        if(rule.ends[searchResult].definitive){
                            nestedCycles --;
                        }
                    } else {
                        break;
                    }
                }
            }
        }
    }

    /**
     * Iterprets one token of code by given code pointer, the code pointer is incremeted at the end,
     * or setted as needed. This function requires to run properly, that the code is checked and prosessed by 
     * the syntaxCheck function.
     * @param {codePointer structure} codePointer is the code pointer to the token we want to be executed.
     * @returns true if interpetation should end, false otherwise.
     */
    interpretToken(codePointer){
        switch(this.command.getToken(codePointer).meaning){
            case "function-def":
            case "condition-def":
                codePointer.tokenPointer ++;
                break;
            case "end":
                if(this.programQueue.length > 0){
                    if(Object.keys(this.command.conditionList).includes(codePointer.functionName)){
                        this.command.conditionList[codePointer.functionName].result = this.command.lastConditionResult;
                        this.command.lastConditionResult == "undef";
                    }
                    Object.assign(codePointer, this.programQueue[this.programQueue.length - 1]);
                    this.programQueue.pop();
                } else {
                    if(this.command.lastConditionResult != "undef"){
                        console.log(this.command.lastConditionResult);
                    }
                    return true;
                }
                break;
            case "command":
            case "output":
                this.command.executeCommand(this.command.getToken(codePointer).dictKey);
                break;
            case "identifier":
                this.programQueue.push(Object.assign({}, codePointer));
                codePointer.functionName = this.command.getToken(codePointer).value
                codePointer.tokenPointer = -1;
                break;
            case "do-start":
                codePointer.tokenPointer ++; // iterating to number
                if(parseInt(this.command.getToken(codePointer).value) > 0){
                    this.activeCounters.push(parseInt(this.command.getToken(codePointer).value));
                    codePointer.tokenPointer ++; // skipping keyword times
                } else {
                    codePointer.tokenPointer --;
                    this.tokenJumper(codePointer);
                }
                break;
            case "do-end":
                this.activeCounters[this.activeCounters.length - 1] --;
                if(this.activeCounters[this.activeCounters.length - 1] > 0){
                    this.tokenJumper(codePointer);
                    codePointer.tokenPointer += 2; // skiping number and keyword times
                } else {
                    this.activeCounters.pop();
                }
                break;
            case "while-start":
                codePointer.tokenPointer ++; // skipping to condition prefix
                var result = this.command.evalCondition(codePointer, this.programQueue);
                if(result !== undefined){
                    codePointer.tokenPointer ++ ; // skiping to condition core
                    if(this.command.getToken(codePointer).meaning == "identifier"){
                        this.command.conditionList[this.command.getToken(codePointer).value].result = "undef";
                    }
                    if(!result){
                        codePointer.tokenPointer -= 2;  // going back to while token to jump correctly
                        this.tokenJumper(codePointer);
                    }
                }
                break;
            case "while-end":
                this.tokenJumper(codePointer);
                codePointer.tokenPointer -=1 ;
                break;
            case "if-start":
                codePointer.tokenPointer ++; // skipping to condition prefix
                var result = this.command.evalCondition(codePointer, this.programQueue);
                if(result !== undefined){
                    codePointer.tokenPointer ++ ; // skiping to condition core
                    if(this.command.getToken(codePointer).meaning == "identifier"){
                        this.command.conditionList[this.command.getToken(codePointer).value].result = "undef";
                    }
                    if(!result){
                        codePointer.tokenPointer -= 2; // going back to if token for jumping
                        this.tokenJumper(codePointer);
                    } else {
                        codePointer.tokenPointer ++;
                    }
                }
                break;
            case "if-end":
                break;
            case "else":
                this.tokenJumper(codePointer);
                break;
            case "condition":
            case "number":
            case "times":
            case "then":
            case "condition-prefix":
                // cannot happen
                console.log(this.command.getToken(codePointer));
                throw "Unexpected token";
            default:
                console.log(token);
                throw "Unknown token";
        }
        codePointer.tokenPointer ++;
        return false;
    }

    /**
     * Interprets function in Karel's language. The code must be processed before it can be interpreted.
     * @param {codePointer structure} codePointer is the codePointer which will define which function will be interpreted.
     * @param {boolean} moveCursor true to move the cursor in the given editor, false otherwise.
     * @param {ACE editor} editor is teh editor where the code is written.
     */
    async codeInterpret(codePointer, moveCursor, editor){
        while(this.running){
            if(moveCursor){
                editor.gotoLine(this.command.getToken(codePointer).row + 1);
            }
            if(this.interpretToken(codePointer)){
                this.turnOffInterpret(editor);
            } else {
                this.updateCounter();
            }
            if(this.debug.active){
                break;
            } else {
                await sleep(this.command.speed);
            }
        }
    }

    /**
     * Checks and inteprets code from ACE text editor.
     */
    textEditorInterpret(){
        if(this.running){
            console.log("You cannot run two programs at the same time");
            return;
        };
        if(this.processErrors(this.syntaxCheck(this.textEditor), this.textEditor)){
            console.log("Errors found - cannot interpret");
            return;
        };
        var toRun = this.command.getFunctionByToken(this.textEditor.selection.getCursor());
        if(toRun === undefined){
            console.log("No function selected to run");
            return;
        };
        this.resetNativeCodeInterpret(this.textEditor);
        this.setRunningTrue();
        this.debug.active = false;
        var codePointer = {functionName: toRun, tokenPointer: 0};
        this.codeInterpret(codePointer, true, this.textEditor);
    }

    /**
     * Checks and interprets code from Blockly edotor (with help of ACE representation editor in read only mode).
     * @param {string} toRun is the name of the function we want to run.
     */
    blocklyEditorInterpret(toRun){
        if(this.running){
            console.log("You cannot run two programs at the same time");
            return;
        };
        if(this.processErrors(this.syntaxCheck(this.blocklyTextRepresentation), this.blocklyTextRepresentation)){
            console.log("Errors found - cannot interpret");
            return;
        };
        if(toRun === undefined){
            console.log("No function selected to run");
            return;
        };
        this.resetNativeCodeInterpret();
        this.setRunningTrue();
        this.debug.active = false;
        var codePointer = {functionName: toRun, tokenPointer: 0};
        this.codeInterpret(codePointer, true, this.blocklyTextRepresentation);
    }

    /**
     * Checks and inteprets code from ACE text editor in debug mode.
     */
    debugTextEditorInterpret(){
        if(this.running && !this.debug.active){
            console.log("You cannot run two programs at the same time");
            return;
        }
        if(!this.running){
            console.log(this.textEditor.session.getBreakpoints().length);
            console.log(this.textEditor.session.getBreakpoints());

            if(this.processErrors(this.syntaxCheck(this.textEditor), this.textEditor)){
                console.log("Errors found - cannot interpret");
                return;
            };
            var toRun = this.command.getFunctionByToken(this.textEditor.selection.getCursor());
            if(toRun === undefined){
                console.log("No function selected to run");
                return;
            };
            this.resetNativeCodeInterpret(this.textEditor);
            this.setRunningTrue();
            this.debug.active = true;
            this.debug.codePointer = {functionName: toRun, tokenPointer: 0};
            console.log(JSON.stringify(this.debug.codePointer));
        }
        this.codeInterpret(this.debug.codePointer, true, this.textEditor);
    }

    /**
     * Tells the blockly block name for condition by its string in code
     * If the word in code is not among the base condition set special block is created
     * @param {string} dictKey is the dictionary key of the condition
     */
    tellCondBlockByWord(dictKey){
        switch(dictKey){
            case "wall":
                return "condition_wall";
            case "brick":
                return "condition_brick";
            case "mark":
                return "condition_mark";
            case "vacant":
                return "condition_vacant";
            default:
                return "condition_userdefined";
        }
    }
    
    /**
     * Translates text code to blockly blocks. It generates those blocks by tokens
     * that are expexted to be passed.
     * @param {blockly worspace} workspace is the workspace where the blocks will be created
     * @param {array of tokens} codeArray is array of tokens to be converted
     */
    makeBlocksFromNativeCode(workspace, codeArray){
        var connectTo = [];
        var rules = {
            "function": {   create: ["base_function"],        action: ["addName", "insertConnection", "setCollapse"],},
            "condition": {  create: ["base_condition"],       action: ["addName", "insertConnection", "setCollapse"],},
            "end": {        create: [],                       action: ["colapseBlock", "popConnectionArray", "collapse"],},
            "forward": {    create: ["function_step"],        action: ["connectBlock"],},
            "right": {      create: ["function_right"],       action: ["connectBlock"],}, 
            "left": {       create: ["function_left"],        action: ["connectBlock"],},
            "placeBrick": { create: ["function_place"],       action: ["connectBlock"],},
            "pickBrick" : { create: ["function_pick"],        action: ["connectBlock"],}, 
            "placeMark": {  create: ["function_placemark"],   action: ["connectBlock"],},
            "pickMark": {   create: ["function_unmark"],      action: ["connectBlock"],},
            "true": {       create: ["function_true"],        action: ["connectBlock"],},
            "false": {      create: ["function_false"],       action: ["connectBlock"],},
            "faster": {     create: ["function_faster"],      action: ["connectBlock"],}, 
            "slower": {     create: ["function_slower"],      action: ["connectBlock"],},
            "beep": {       create: ["function_beep"],        action: ["connectBlock"],},
            "do": {         create: ["control_repeat"],       action: ["connectBlock", "insertConnection", "manageNumber"],},
            "while": {      create: ["control_while"],        action: ["connectBlock", "insertConnection", "manageCondition"],},
            "if": {         create: ["if_creator"],           action: ["connectBlock", "insertConnection", "manageCondition"],},
            "else": {       create: [],                       action: ["popConnectionArray"],},
            "then": {       create: [],                       action: []},
            "times": {      create: [],                       action: []}
        }
        var currentRule;
        var toCollapse;
        var numOfCollapsedBlocks = 0;
        for(var i = 1; i <  codeArray.length; i++){
            codeArray[0] = codeArray[0].concat(codeArray[i]);
        }
        codeArray = codeArray[0];
        for(var tokenIter = 0; tokenIter < codeArray.length; tokenIter ++){
            currentRule = {};
            if(this.closerRegex.test(codeArray[tokenIter].value)){
                currentRule = {action : ["popConnectionArray"],}
            } else if(codeArray[tokenIter].dictKey in rules){
                currentRule = rules[codeArray[tokenIter].dictKey];
                var newBlock;
                if(currentRule.create.length > 0){
                    if(currentRule.create[0] == "if_creator"){
                        let result = this.ifOrIfElse(tokenIter, codeArray);
                        if(result === undefined){
                            console.log("err - missing end of if structure");
                            return;
                        }else if(result){
                            newBlock = workspace.newBlock("control_if");
                        } else {
                            newBlock = workspace.newBlock("control_ifelse");
                        }
                    } else {
                        newBlock = workspace.newBlock(currentRule.create);
                    }
                }
            } else {
                newBlock = workspace.newBlock("function_userDefined");
                currentRule = {action : ["connectBlock", "insertName"]}
            }
            if(newBlock !== undefined){
                newBlock.initSvg();
                newBlock.render();
            }
            for(var i = 0; i < currentRule.action.length; i++){
                switch(currentRule.action[i]){
                    case "addName":
                        tokenIter ++;
                        if(codeArray[tokenIter].meaning == "identifier"){
                            newBlock.setFieldValue(codeArray[tokenIter].value, "NAME");
                        } else {
                            console.log("error - bad token to set the name by");
                            return;
                        }
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
                        tokenIter ++;
                        if(codeArray[tokenIter].meaning != "condition-prefix"){
                            console.log("error - condtion prefix expected");
                            return;
                        }
                        if(codeArray[tokenIter].dictKey == "isNot"){
                            newBlock.getField('COND_PREF').setValue("optionIsNot");
                        }
                        tokenIter ++;
                        var conditionBlock = workspace.newBlock(this.tellCondBlockByWord(codeArray[tokenIter].dictKey));
                        conditionBlock.initSvg();
                        conditionBlock.render();
                        newBlock.getInput('COND').connection.connect(conditionBlock.outputConnection);
                        if(conditionBlock.type == "condition_userdefined"){
                            conditionBlock.getField('FC_NAME').setValue(codeArray[tokenIter].value);
                        }
                        break;
                    case "manageNumber":
                        tokenIter ++;
                        if(codeArray[tokenIter].meaning == "number"){
                            newBlock.getField('DO_TIMES').setValue(codeArray[tokenIter].value);
                        } else {
                            console.log("err - number expected");
                            return;
                        }
                        break;
                    case "insertName":
                        newBlock.getField('FC_NAME').setValue(codeArray[tokenIter].value);
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
     * Tells if simple 'if' structure of 'if else' structure should be used based on code tokes and given token pointer.
     * @param {number} tokenIter the token pointer 
     * @param {array of tokens} codeArray is the code represented by tokens in array
     * @returns true if simple `if then` should be generate false for `if then else`
     */
    ifOrIfElse(tokenIter, codeArray){
        let saveTokenIter = tokenIter
        var skipIf = -1;
        for(; tokenIter < codeArray.length; tokenIter ++){
            switch(codeArray[tokenIter].meaning){
                case "if-start":
                    skipIf ++;
                    break;
                case "else":
                    if(skipIf == 0){
                        tokenIter = saveTokenIter;
                        return false;
                    }
                    break;
                case "if-end":
                    if(skipIf == 0){
                        tokenIter = saveTokenIter;
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
     * @param {workspace} workspace is the workspace where the blocks will be created
     */
    textToBlocklyConvertor(workspace){
        this.lockBlocklyTextEditor = true;
        this.blocklyTextRepresentation.setValue(this.textEditor.getSelectedText());
        this.makeBlocksFromNativeCode(workspace, this.nativeCodeTokenizer(this.blocklyTextRepresentation));
        this.lockBlocklyTextEditor = false;
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
     * @returns item that failed, undefined otherwise
     */
    checkLoadedFile(dataJson){
        for(var item in dataJson){
            switch(item){
                case "karelAndRoom":
                    if(!this.command.karel.checkLoadFileKarelAndRoom(dataJson[item])){
                        return item;
                    }
                    break;
                case "code":
                    break;
                case "blockly":
                    /*  This code performs check of the save codes - deleted because users can save codes with errors
                    if(item == "code"){
                        editor = this.textEditor;
                    } else {
                        this.lockBlocklyTextEditor = true;
                        editor = this.blocklyTextRepresentation;
                    }
                    editor.setValue(dataJson[item]);
                    if(this.syntaxCheck(editor).length > 0){
                        editor.setValue("");
                        this.lockBlocklyTextEditor = false;
                        return item;
                    };
                    this.lockBlocklyTextEditor = false;
                    */
                    break;
                default:
                    return item;
            }
        }
        return;
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
                    interpret.lockBlocklyTextEditor = true;
                    interpret.blocklyTextRepresentation.setValue(fileLoadedEvent.target.result);
                    interpret.makeBlocksFromNativeCode(workspace, interpret.nativeCodeTokenizer(interpret.blocklyTextRepresentation));
                    interpret.lockBlocklyTextEditor = false;
                    break;
                case "code":
                    interpret.textEditor.setValue(fileLoadedEvent.target.result);
                    break;
                case "all":
                    var dataJson = JSON.parse(fileLoadedEvent.target.result);
                    interpret.command.karel.loadRoomWithKarel(dataJson["karelAndRoom"]);
                    workspace.clear();
                    interpret.lockBlocklyTextEditor = true;
                    interpret.blocklyTextRepresentation.setValue(dataJson["blockly"]);
                    interpret.makeBlocksFromNativeCode(workspace, interpret.nativeCodeTokenizer(interpret.blocklyTextRepresentation));
                    interpret.lockBlocklyTextEditor = false;
                    interpret.textEditor.setValue(dataJson["code"]);
                    break;
                case "byFile":
                    try{
                        var dataJson = JSON.parse(fileLoadedEvent.target.result);
                        let result = interpret.checkLoadedFile(dataJson);
                        if(result !== undefined){
                            console.log("Checking failed at: ",result);
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
                                interpret.lockBlocklyTextEditor = true;
                                interpret.blocklyTextRepresentation.setValue(dataJson["blockly"]);
                                interpret.makeBlocksFromNativeCode(workspace, interpret.nativeCodeTokenizer(interpret.blocklyTextRepresentation));
                                interpret.lockBlocklyTextEditor = false;
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
