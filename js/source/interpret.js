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
        this.math = new math()                              // math handle module
        this.command = new command(karel, this.math)        // command handle module
        this.textEditor = textEditor;                       // given text editor to interpret
        this.blocklyTextRepresentation = blocklyTextRep;    // read only blockly text representation editor
        this.running = false;                               // tells if Karel is executing code
        this.activeCounters = [];                           // used for DO loops
        this.programQueue = [];                             // used to jump to other programs and return back (saves position from which was jumped)
        this.debug = {                                      // saves codePointer during debug, if debug is active and debug mode status 
            codePointer: {}, 
            active: false, 
            run:false
        };   
        this.closer = "*";                                  // tells the ending character (default is '*')
        this.closerRegex = new RegExp(/^\*/);               // Regular expression of closer
        this.commentary = new RegExp(/^#/);                 // Regular expression of comments (default is '#')
        this.lockBlocklyTextEditor = false;                 // Blocks Blockly from writing to blockly text representation editor if true
        this.counter = 0;                                   // Step counter
        this.moveCursor = true;                             // Tells if to move cursor in the text editor
        this.resetCounter();
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
     * Sets interpret to running state and switches the indicator in the UI.
     * Needs div in the html with `runIndicator` id !!!
     */
    setRunningTrue(){
        this.running = true;
        document.querySelector('#runIndicator').style.display = "block";
    }

    /**
     * Sets interpret to not running state and switches off the indicator in the UI.
     * Needs div in the html with `runIndicator` id !!! 
     */
    setRunningFalse(){
        this.running = false;
        document.querySelector('#runIndicator').style.display = "none";
        if(document.querySelector('#roomCanvas') == document.activeElement){
            document.querySelector('#roomCanvas').blur();
            document.querySelector('#roomCanvas').focus();
        }
    }

    /**
     * Resets the important variables and objects for interpret and sets the textEditor to read only mode.
     */
    resetNativeCodeInterpret(editor){
        this.activeCounters = [];
        this.programQueue = [];
        this.command.prepareRun();
        if(editor == this.textEditor){
            editor.setReadOnly(true);
        }
    }

    /**
     * Makes the interpret stop and unset the given editor read only mode.
     * If the editor is the blockly representation editor, it wont switch the read only mode.
     * @param editor is the editor to be set to read only mode 
     */
    turnOffInterpret(){
        this.debug.active = false;
        this.debug.codePointer = {};
        this.debug.run = false;
        this.setRunningFalse();
        this.textEditor.setReadOnly(false);
    }

    /**
     * Increments the step counter and updates its display.
     * Needs div in the html with `counterDisplay` id !!!
     */
    updateCounter(){
        this.counter ++;
        document.getElementById('counterDisplay').textContent = this.dictionary["UI"]["counter"] + ": " + this.counter;
        document.getElementById('counterDisplay').style.display = "block";
    }

    /**
     * Sets the step counter to zero adn updates its display.
     * Needs div in the html with `counterDisplay` id !!!
     */
    resetCounter(){
        this.counter = 0;
        document.getElementById('counterDisplay').style.display = "none";
    }

    /**
     * Updates variable overview in the user interface
     * Needs div in the html with `variableOverview` id !!!
     */
    updateVariableOverview(){
        document.getElementById('variableOverview').innerHTML = this.math.createVariableOverview(this.dictionary);
    }

    /**
     * Tokenizes input from given ACE editor. Uses TokenIterator available from ACE library.
     * Designed to process Karel's native programming language, does not matter on world language if the current dictionary is set correctly.
     * Goes through the code and parses it to tokens which are returned in a javascript dictionary.
     * The code is separated in the dictionary like the following example:
     * {"function name" : [tokens of that function]} 
     * There are all tokens that corresponds to this function (even name and defining words).
     * Token consist of these values:
     *  - value: is the actual word that was read from the editor
     *  - meaning: is the syntactical meaning of the word (terminal)
     *  - dictKey: is the key to the dictionary for this word (if the key is available)
     *  - row: is the row where the token was found
     *  - column: is the column where the token was found
     * There are these possible meaning (terminals):
     *  - function-def, condition-def, end, command, condition, identifier, output, expression, do-start, do-end,
     *     times, while-start, while-end, if-start, if-end, then, else, condition-prefix, global, local, kw-var
     * In the end the global variable definitions are shifted to the start if wanted and the mixed expression tokens which
     * ACE creates are repaired.
     * @param {ACE editor} editor is the editor we want to be tokenized from.
     * @param forInterpretation if true, the global variable definitions are pushed to the top and commentaries are skipped,
     * if false, the code is tokenized as it it present in the editor and passed with commentaries and global definitions in their
     * given place which is useful for translation.
     * @returns dictionary of functions that contains its tokens.  
     */
    nativeCodeTokenizer(editor, forInterpretation){
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
                } else if(Number.isInteger(parseInt(token.value)) || this.math.allOperators.includes(token.value)){
                    token.meaning = "expression";
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
                                codeArray[codeArray.length - 1].pop();
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
                        case "while":
                            if(closerLast){
                                codeArray[codeArray.length - 1].pop();
                                token.meaning = "while-end";
                                token.column -= this.closer.length;
                                token.value = this.closer + token.value;
                            } else {
                                token.meaning = "while-start";
                            }
                            break;
                        case "if":
                            if(closerLast){
                                codeArray[codeArray.length - 1].pop();
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
                        case "is":
                        case "isNot":
                            token.meaning = "condition-prefix";
                            break;
                        case "local":
                        case "global":
                            token.meaning = token.dictKey;
                            break;
                        case "variable":
                            token.meaning = "kw-var";
                            break;
                    }
                }
                if(token.meaning == "function-def" || token.meaning == "condition-def"){
                    codeArray.push([]);
                }
                codeArray[codeArray.length - 1].push(token);
                if(token.meaning == "end"){
                    codeArray.push([]);
                }
            } else if(!forInterpretation && this.commentary.test(tokenizer.getCurrentToken().value)){
                var token = {
                    value: tokenizer.getCurrentToken().value,
                    meaning: 'commentary',
                    dictKey: "",
                    row: tokenizer.getCurrentTokenRow(),
                    column: tokenizer.getCurrentTokenColumn(),
                }
                codeArray[codeArray.length - 1].push(token);
            }
            if(tokenizer.getCurrentToken().value == this.closer){
                closerLast = true;
            } else {
                closerLast = false;
            }
            tokenizer.stepForward();
        }
        if(forInterpretation){
            // putting definition blocks to the front in the original order
            var temp = [];
            for(var i = 0; i < codeArray.length; i++){
                if(codeArray[i].length == 0){
                    codeArray.splice(i, 1);
                    i --;
                } else if(codeArray[i][0].dictKey == "global"){
                    var [tempCA] = codeArray.splice(i, 1);
                    temp.push(tempCA);
                    i --;
                }
            }
            codeArray = temp.concat(codeArray);
        }
        // repairing ace mixed operators evaluated as identifiers
        for(var i = 0; i <  codeArray.length; i++){
            for(var j = 0; j < codeArray[i].length; j++){
                if(codeArray[i][j].meaning == "identifier"){
                    var beginCodeArray = codeArray[i].slice(0, j);
                    var endCodeArray = codeArray[i].slice(j, codeArray[i].length);
                    if(this.math.checkIdentifiersMixing(endCodeArray)){
                        codeArray[i] = beginCodeArray.concat(endCodeArray);
                    }
                }
            }
        }
        return codeArray;
    }

    /**
     * Pre checks the code array for identifiers. Its goal is to change every identifier token
     * to either expression, use-command or user-condition tokens. It makes checks about redefinition,
     * illegal definitions ect. and pushes them into error array.
     * @param {codeArray} codeArray is the code array to be pre checked.
     * @param {array} errors is the array errors will be passed to.
     */
    preCheckTokenRepair(codeArray, errors){
        // scanning user defined commands and conditions
        var names = {commands: [], conditions: []};
        for(var i = 0; i < codeArray.length; i++){
            switch(codeArray[i][0].meaning){
                case "function-def":
                    if(codeArray[i][1] !== undefined && codeArray[i][1].meaning == "identifier"){
                        if(names.commands.concat(names.conditions).includes(codeArray[i][1].value)){
                            errors.push({error: this.dictionary["checkerErrorMessages"]["redefinition"], token: codeArray[i][1]});
                        } else {
                            names.commands.push(codeArray[i][1].value)
                        }
                    } else {
                        if(codeArray[i][1] === undefined){
                            errors.push({error: this.dictionary["checkerErrorMessages"]["uncompletedDefinition"], token: codeArray[i][0]});
                        } else {
                            errors.push({error: this.dictionary["checkerErrorMessages"]["commandNameError"], token: codeArray[i][1]});
                        }
                    }
                    break;
                case "condition-def":
                    if(codeArray[i][1] !== undefined && codeArray[i][1].meaning == "identifier"){
                        if(names.commands.concat(names.conditions).includes(codeArray[i][1].value)){
                            errors.push({error: this.dictionary["checkerErrorMessages"]["redefinition"], token: codeArray[i][1]});
                        } else {
                            names.conditions.push(codeArray[i][1].value)
                        }
                    } else {
                        if(codeArray[i][1] === undefined){
                            errors.push({error: this.dictionary["checkerErrorMessages"]["uncompletedDefinition"], token: codeArray[i][0]});
                        } else {
                            errors.push({error: this.dictionary["checkerErrorMessages"]["variableNameError"], token: codeArray[i][1]});
                        }
                    }
                    break;
            }
        }
        
        // scanning variables
        var globalVars = [];
        for(var i = 0; i < codeArray.length; i++){
            var globalScope = true;
            var localVars = [];
            for(var j = 0; j < codeArray[i].length; j++){
                switch(codeArray[i][j].meaning){
                    case "function-def":
                    case "condition-def":
                        globalScope = false;
                        break;
                    case "global":
                        j++;
                        if(codeArray[i][j] !== undefined && codeArray[i][j].meaning == "kw-var"){
                            codeArray[i].splice(j, 1);
                        }
                        if(codeArray[i][j] !== undefined && codeArray[i][j].meaning == "identifier"){
                            if(names.commands.concat(names.conditions).includes(codeArray[i][j].value)){
                                errors.push({error: this.dictionary["checkerErrorMessages"]["redefinition"], token: codeArray[i][j]});
                            }
                            if(globalScope){
                                if(!globalVars.includes(codeArray[i][j].value)){
                                    globalVars.push(codeArray[i][j].value);
                                }
                                codeArray[i][j].meaning = "expression";
                                codeArray[i][j].psaMeaning = "variable";
                            } else {
                                if(!globalVars.includes(codeArray[i][j].value)){
                                    errors.push({error: this.dictionary["checkerErrorMessages"]["definingGlobalInLocal"], token: codeArray[i][j]});
                                }
                                codeArray[i][j].meaning = "expression";
                                codeArray[i][j].psaMeaning = "variable";
                            }
                        } else {
                            if(codeArray[i][j] === undefined){
                                errors.push({error: this.dictionary["checkerErrorMessages"]["uncompletedDefinition"], token: codeArray[i][j - 1]});
                            } else {
                                errors.push({error: this.dictionary["checkerErrorMessages"]["variableNameError"], token: codeArray[i][j]});
                            }
                        }
                        break;
                    case "local":
                        if(globalScope){
                            errors.push({error: this.dictionary["checkerErrorMessages"]["definingLocalInGlobal"], token: codeArray[i][j]});
                        }
                        j++;
                        if(codeArray[i][j] !== undefined && codeArray[i][j].meaning == "kw-var"){
                            codeArray[i].splice(j, 1);
                        }
                        if(codeArray[i][j] === undefined){
                            errors.push({error: this.dictionary["checkerErrorMessages"]["uncompletedDefinition"], token: codeArray[i][j - 1]});
                        } else if(codeArray[i][j].meaning != "identifier"){
                            errors.push({error: this.dictionary["checkerErrorMessages"]["variableNameError"], token: codeArray[i][j]});
                        } else if(globalVars.includes(codeArray[i][j].value || names.commands.concat(names.conditions).includes(codeArray[i][j].value))){
                            errors.push({error: this.dictionary["checkerErrorMessages"]["redefinition"], token: codeArray[i][j]});
                        } else if(!localVars.includes(codeArray[i][j].value)){
                            localVars.push(codeArray[i][j].value);
                        }
                        codeArray[i][j].meaning = "expression";
                        codeArray[i][j].psaMeaning = "variable";
                        break;
                    case "identifier":
                        if(globalVars.concat(localVars).includes(codeArray[i][j].value)){
                            codeArray[i][j].meaning = "expression";
                            codeArray[i][j].psaMeaning = "variable";
                        } else if(names.commands.includes(codeArray[i][j].value)){
                            codeArray[i][j].meaning = "user-command";
                        } else if(names.conditions.includes(codeArray[i][j].value)){
                            codeArray[i][j].meaning = "user-condition";
                        } else {
                            errors.push({error: this.dictionary["checkerErrorMessages"]["undefinedIdentifier"], token: codeArray[i][j]});
                        }
                        break;
                }
            }
        }
    }

    /**
     * Provides syntax checking based on LL1 table. The table is defined on the beginning of the function.
     * For more information about the table and the rules visit following URL:
     * https://docs.google.com/spreadsheets/d/1ZHOjsJgSekrjLMMdATj4ccAKeb4HEqrpOBlI2Gh33ko/edit?usp=sharing
     * For more information about the LL1 grammar checking visit following URL:
     * https://en.wikipedia.org/wiki/LL_parser
     * Apart from checking the syntax, the function prepares the code to be interpreted. For this purpose,
     * it creates list of user defined commands and conditions in the command object in a similar fashion,
     * as the nativeCodeTokenizer created its output. The tokens are stored there in arrays and you can get to them
     * by the function name (for example this.command.commandList["test"].code tells you the array of tokens for command "test").
     * The user defined commands are available in commandList property and the user defined conditions are stored in conditionList.
     * In the records of commands and conditions there are properties:
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
        this.math.clearMath();
        var codeArray = this.nativeCodeTokenizer(editor, true);
        let rules = [
            /* 0 */     [
                            {item: "function-def",      checks: []}, 
                            {item: "user-command",      checks: ["define-command"]},
                            {item: "<command-block>",   checks: []}, 
                            {item: "end",               checks: []}
                        ],
            /* 1 */     [
                            {item: "condition-def",     checks: ["condition-expected"]}, 
                            {item: "user-condition",    checks: ["define-condition"]}, 
                            {item: "<command-block>",   checks: []}, 
                            {item: "end",               checks: []}
                        ],
            /* 2 */     [
                            {item: "command",           checks: []}, 
                            {item: "<command-block>",   checks: []}],
            /* 3 */     [
                            {item: "user-command",      checks: []}, 
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
                            {item: "expression",        checks: ["check-expression", "no-asign"]}, 
                            {item: "times",             checks: []}, 
                            {item: "<command-block>",   checks: []}, 
                            {item: "do-end",            checks: []}, 
                            {item: "<command-block>",   checks: []}
                        ],
            /* 9 */     [],
            /* 10 */    [
                            {item: "user-condition",    checks: []}
                        ],
            /* 11 */    [
                            {item: "condition",         checks: []}
                        ],
            /* 12 */    [
                            {item: "output",            checks: ["remove-expected"]},
                            {item: "<command-block>",   checks: []}
                        ],
            /* 13 */    [
                            {item: "global",            checks: []},
                            {item: "expression",        checks: ["check-expression", "one-asign", "compute-expression"]},
                            {item: "<start>",           checks: []}
                        ],
            /* 14 */    [
                            {item: "global",            checks: []},
                            {item: "expression",        checks: ["check-expression", "one-asign"]},
                            {item: "<command-block>",   checks: []}
                        ],
            /* 15 */    [
                            {item: "local",             checks: []},
                            {item: "expression",        checks: ["check-expression", "one-asign"]},
                            {item: "<command-block>",   checks: []}
                        ],
            /* 16 */    [
                            {item: "expression",        checks: ["check-expression", "no-asign"]}
                        ]
        ];
        let xAxisTable = ["function-def", "condition-def", "end", "user-command", "user-condition", "command", "condition", 
            "do-start", "times", "do-end", "while-start", "while-end", "if-start", "then", "else", "if-end", "condition-prefix", 
            "expression", "output", "global", "local"]; // all terminals
        let yAxisTable = ["<start>", "<command-block>", "<end-if>", "<condition-core>"]; // all non terminals
        let table = [
                        //    0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21
                        //   fud cod end ucm ucn com con dos tim doe whs whe ifs the els ife cop exp out glo loc [n] 
            /* start     */ [ 0,  1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 13, -1,  9],
            /* com-block */ [-1, -1,  9,  3, -1,  2, -1,  8, -1,  9,  7,  9,  4, -1,  9,  9, -1, -1, 12, 14, 15, -1],
            /* end-if    */ [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  6,  5, -1, -1, -1, -1, -1, -1],
            /* cond-core */ [-1, -1, -1, -1, 10, -1, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 16, -1, -1, -1, -1]
        ]   // LL1 table

        var errors = [];

        this.preCheckTokenRepair(codeArray, errors);

        if(errors.length > 0){
            return errors;
        }

        for(var i = 0; i < codeArray.length; i++){
            if(codeArray[i].length <= 0){
                break;
            }
            var stack = [{item: "<start>"}];
            var expected = [];
            var buffer = [];
            var noError = true;
            while(stack.length > 0){
                while(stack.length > 0 && codeArray[i].length > 0 && stack[0].item == codeArray[i][0].meaning){
                    for(var j = 0; j < stack[0].checks.length; j++){
                        switch(stack[0].checks[j]){
                            case "define-command":
                                this.command.defineCommand(codeArray[i][0], buffer);
                                this.math.registerFunctionScopes(codeArray[i][0].value);
                                break;
                            case "define-condition":
                                this.command.defineCondition(codeArray[i][0], buffer);
                                this.math.registerFunctionScopes(codeArray[i][0].value);
                                break;
                            case "condition-expected":
                                expected.push(this.dictionary["keywords"]["true"], this.dictionary["keywords"]["false"]);
                                break;
                            case "remove-expected":
                                if(expected.includes(codeArray[i][0].value)){
                                    expected.splice(expected.indexOf(codeArray[i][0].value), 1);
                                }
                                break;
                            case "check-expression":
                                noError = this.math.checkExpression(codeArray[i], errors, this.dictionary, true);
                                break;
                            case "compute-expression":
                                if(noError){
                                    try{
                                        this.math.computeExpression(codeArray[i][0], this.math.globalScopeName, this.math.globalScopeName);
                                    }
                                    catch(err){
                                        switch(err.name){
                                            case "undefVarRead":
                                                this.math.createExpressionErrors(codeArray[i][0], this.dictionary["checkerErrorMessages"]["undefVarRead"], errors);
                                                break;
                                            case "zeroDivision":
                                                this.math.createExpressionErrors(codeArray[i][0], this.dictionary["checkerErrorMessages"]["zeroDivisionError"], errors);
                                                break;
                                            default:
                                                throw err;
                                        }
                                    }
                                }
                                break;
                            case "no-asign":
                                if(codeArray[i][0].saveTo.length > 0){
                                    noError = false;
                                    this.math.createExpressionErrors(codeArray[i][0], this.dictionary["checkerErrorMessages"]["illegalAsign"], errors);
                                }
                                break;
                            case "one-asign":
                                if(codeArray[i][0].saveTo.length != 1){
                                    noError = false;
                                    this.math.createExpressionErrors(codeArray[i][0], this.dictionary["checkerErrorMessages"]["oneAsignExpected"], errors);
                                }
                                break;
                            default:
                                karelConsoleLog("internalError");
                                console.log(stack[0].checks[j], stack[0]);
                                throw "Undefined check";
                        }
                    }
                    if(!noError){
                        break;
                    }
                    stack.shift();
                    buffer.push(codeArray[i].shift());
                }
                if(!noError || stack.length <= 0){
                    break;
                }
                
                if(xAxisTable.includes(stack[0].item)){
                    noError = false;
                    this.createError(codeArray[i], stack, buffer, errors);
                    break;
                }
                    
                var searchX;
                if(codeArray[i][0] === undefined){
                    searchX = xAxisTable.length;
                } else {
                    searchX = xAxisTable.indexOf(codeArray[i][0].meaning);
                }
                let searchY = yAxisTable.indexOf(stack[0].item);
                    
                if(searchX == -1 || searchY == -1){
                    karelConsoleLog("internalError");
                    console.log("X: ",searchX, " Y: ",searchY);
                    console.log("stack: ",stack);
                    console.log("testedCommand: ",codeArray[i]);
                    throw "Table error - bad index";
                }
                    
                if(table[searchY][searchX] != -1){
                    stack.shift()
                    stack = rules[table[searchY][searchX]].concat(stack);
                } else {
                    noError = false;
                    // when end is missing -- error here TODO
                    this.createError(codeArray[i], stack, buffer, errors);
                    break;
                }
            }
                         
            if(noError && codeArray[i].length > 0){
                errors.push({error: "what is that ?", token: codeArray[i][0]});
            }

            if(expected.length > 0 && stack.length == 0){
                errors.push({error: this.dictionary["checkerErrorMessages"]["missing"] + expected, 
                token: this.command.getDefiningToken(this.command.getFunctionByToken(buffer[0]))});
            }
        }
        return errors;
    }

    /**
     * Handles errors from the LL1 checking and makes them more readable for the user.
     * @param {codeArray} codeArray is the code array on which top there is an error.
     * @param {array} stack is the LL1 checking stack.
     * @param {array} buffer is the buffer of the function, where error was found.
     * @param {array} errors is the array of errors.
     */
    createError(codeArray, stack, buffer, errors){
        if(codeArray.length == 0 && stack.length > 0){
            errors.push({error: this.dictionary["checkerErrorMessages"]["unexpectedEnd"], token: buffer[buffer.length - 1]});
            return;
        }
        switch(stack[0].item){
            case "<start>":
                errors.push({error: this.dictionary["checkerErrorMessages"]["definitionStart"], token: codeArray[0]});
                return;
            case "<command-block>":
                errors.push({error: this.dictionary["checkerErrorMessages"]["commandExpected"], token: codeArray[0]});
                return;
            case "<end-if>":
                errors.push({error: this.dictionary["checkerErrorMessages"]["ifEndExpected"], token: codeArray[0]});
                return;
            case "<condition-core>":
                errors.push({error: this.dictionary["checkerErrorMessages"]["conditionCoreExpected"], token: codeArray[0]});
                return;
        }
        console.log(stack[0]);
        errors.push({
            error: this.dictionary["checkerErrorMessages"]["unexpectedWord"][0] + 
            codeArray[0].value + 
            this.dictionary["checkerErrorMessages"]["unexpectedWord"][1] + 
            this.dictionary["checkerErrorMessages"]["tokenAliases"][stack[0].item], 
            token: codeArray[0]}
        );
    }

    /**
     * Processes error array which is generated by syntaxCheck function.
     * Sets markers with descriptions at the editor gutter and underlines the words,
     * which caused these errors.
     * @param {array} errors is the array of errors which creates syntaxCheck function.
     * @param {ACE editor} editor is the editor where the errors will be visualized.
     */
    processErrors(errors, editor){
        editor.getSession().clearAnnotations();
        for(var key in editor.getSession().$backMarkers){
            if(editor.getSession().$backMarkers[key].clazz == "errorMarker"){
                editor.getSession().removeMarker(editor.getSession().$backMarkers[key].id);
            }
        }
        if(errors.length > 0){
            console.log(errors);
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
            karelConsoleLog("internalError");
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
     * Interprets one token of code by given code pointer, the code pointer is incremented at the end,
     * or set as needed. This function requires to run properly, that the code is checked and processed by 
     * the syntaxCheck function.
     * @param {codePointer structure} codePointer is the code pointer to the token we want to be executed.
     * @returns true if interpretation should end, false otherwise.
     */
    interpretToken(codePointer){
        switch(this.command.getToken(codePointer).meaning){
            case "function-def":
            case "condition-def":
                codePointer.tokenPointer ++;
                this.math.appendScope(codePointer.functionName);
                break;
            case "end":
                this.math.deleteScope(codePointer.functionName);
                if(this.programQueue.length > 0){
                    if(Object.keys(this.command.conditionList).includes(codePointer.functionName)){
                        this.command.conditionList[codePointer.functionName].result = this.command.lastConditionResult;
                        this.command.lastConditionResult == "undef";
                    }
                    Object.assign(codePointer, this.programQueue[this.programQueue.length - 1]);
                    this.programQueue.pop();
                } else {
                    if(this.command.lastConditionResult != "undef"){
                        if(this.command.lastConditionResult == "true"){
                            karelConsoleLog("logTrue");
                        } else {
                            karelConsoleLog("logFalse");
                        }
                    }
                    return true;
                }
                break;
            case "command":
            case "output":
                this.command.executeCommand(this.command.getToken(codePointer).dictKey);
                break;
            case "user-command":
                this.programQueue.push(Object.assign({}, codePointer));
                codePointer.functionName = this.command.getToken(codePointer).value
                codePointer.tokenPointer = -1;
                break;
            case "do-start":
                codePointer.tokenPointer ++; // iterating to number
                var number = 0;
                try{
                    number = this.math.computeExpression(this.command.getToken(codePointer), undefined, codePointer.functionName);
                }
                catch(err){
                    switch(err.name){
                        case "zeroDivision":
                            karelConsoleLog("zeroDivisionError");
                            return true;
                            break;
                        case "undefVarRead":
                            karelConsoleLog("undefinedVariableRead");
                            return true;
                            break;
                        default:
                            throw err;
                    }
                }
                if(number > 0){
                    this.activeCounters.push(number);
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
                    codePointer.tokenPointer += 2; // skipping number and keyword times
                } else {
                    this.activeCounters.pop();
                }
                break;
            case "while-start":
                codePointer.tokenPointer ++; // skipping to condition prefix
                var result;
                try{
                    result = this.command.evalCondition(codePointer, this.programQueue);
                }
                catch(err){
                    switch(err.name){
                        case "zeroDivision":
                            karelConsoleLog("zeroDivisionError");
                            return true;
                        case "undefVarRead":
                            karelConsoleLog("undefinedVariableRead");
                            return true;
                        default:
                            throw err;
                    }
                }   
                if(result !== undefined){
                    codePointer.tokenPointer ++ ; // skipping to condition core
                    if(this.command.getToken(codePointer).meaning == "user-condition"){
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
                var result;
                try{
                    result = this.command.evalCondition(codePointer, this.programQueue);
                }
                catch(err){
                    switch(err.name){
                        case "zeroDivision":
                            karelConsoleLog("zeroDivisionError");
                            return true;
                        case "undefVarRead":
                            karelConsoleLog("undefinedVariableRead");
                            return true;
                        default:
                            throw err;
                    }
                }  
                if(result !== undefined){
                    codePointer.tokenPointer ++ ; // skipping to condition core
                    if(this.command.getToken(codePointer).meaning == "user-condition"){
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
            case "global":
                codePointer.tokenPointer++;
                try{
                    this.math.computeExpression(this.command.getToken(codePointer), this.math.globalScopeName, codePointer.functionName);
                }
                catch(err){
                    switch(err.name){
                        case "zeroDivision":
                            karelConsoleLog("zeroDivisionError");
                            return true;
                        case "undefVarRead":
                            karelConsoleLog("undefinedVariableRead");
                            return true;
                        default:
                            throw err;
                    }
                }
                break;
            case "local":
                codePointer.tokenPointer++;
                try{
                    this.math.computeExpression(this.command.getToken(codePointer), codePointer.functionName, codePointer.functionName);
                }
                catch(err){
                    switch(err.name){
                        case "zeroDivision":
                            karelConsoleLog("zeroDivisionError");
                            return true;
                        case "undefVarRead":
                            karelConsoleLog("undefinedVariableRead");
                            return true;
                        default:
                            throw err;
                    }
                }
                break;
            case "condition":
            case "number":
            case "times":
            case "then":
            case "condition-prefix":
            default:
                // cannot happen
                karelConsoleLog("internalError");
                console.log(this.command.getToken(codePointer));
                throw "Unexpected token";
        }
        codePointer.tokenPointer ++;
        return false;
    }

    /**
     * Interprets function in Karel's language. The code must be processed before it can be interpreted.
     * The cursor is moved with the interpret if the value of this.moveCursor in true.
     * @param {codePointer structure} codePointer is the codePointer which will define which function will be interpreted.
     * @param {ACE editor} editor is teh editor where the code is written.
     */
    async codeInterpret(codePointer, editor){
        while(this.running){
            if(this.interpretToken(codePointer)){
                this.turnOffInterpret();
            } else {
                this.updateCounter();
                this.updateVariableOverview();
            }
            if(this.moveCursor){
                editor.gotoLine(this.command.getToken(codePointer).row + 1);
            }
            if(this.debug.active && !(this.debug.run && editor.session.getBreakpoints()[this.command.getToken(codePointer).row] === undefined)){
                break;
            } else {
                await sleep(this.command.speed);
            }
        }
    }

    /**
     * Checks and interprets code from ACE text editor.
     * @param editor is the editor we want to take the code from.
     */
    textEditorInterpret(editor){
        if(this.running){
            karelConsoleLog("twoRunningError");
            return;
        };
        if(this.processErrors(this.syntaxCheck(editor), editor)){
            karelConsoleLog("checkErrorsFound");
            return;
        };
        var toRun = this.command.getFunctionByToken(editor.selection.getCursor());
        if(toRun === undefined){
            karelConsoleLog("noSelectedFunction");
            return;
        };
        this.resetNativeCodeInterpret(editor);
        this.setRunningTrue();
        this.debug.active = false;
        var codePointer = {functionName: toRun, tokenPointer: 0};
        this.codeInterpret(codePointer, editor);
    }

    /**
     * Checks and interprets code from Blockly editor (with help of ACE representation editor in read only mode).
     * @param {string} toRun is the name of the function we want to run.
     */
    blocklyEditorInterpret(toRun){
        if(this.running){
            karelConsoleLog("twoRunningError");
            return;
        };
        if(this.processErrors(this.syntaxCheck(this.blocklyTextRepresentation), this.blocklyTextRepresentation)){
            karelConsoleLog("checkErrorsFound");
            return;
        };
        if(toRun === undefined){
            karelConsoleLog("noSelectedFunction");
            return;
        };
        this.resetNativeCodeInterpret();
        this.setRunningTrue();
        this.debug.active = false;
        var codePointer = {functionName: toRun, tokenPointer: 0};
        this.codeInterpret(codePointer, this.blocklyTextRepresentation);
    }

    /**
     * Checks and interprets code from ACE text editor in debug mode.
     */
    debugTextEditorInterpret(editor){
        if(this.running && !this.debug.active){
            karelConsoleLog("twoRunningError");
            return;
        }
        if(!this.running){
            //console.log(editor.session.getBreakpoints());
            for(var i = 0; i < editor.session.getBreakpoints().length; i++){
                if(editor.session.getBreakpoints()[i] !== undefined){
                    this.debug.run = true;
                    break;
                }
            }
            if(this.processErrors(this.syntaxCheck(editor), editor)){
                karelConsoleLog("checkErrorsFound");
                return;
            };
            var toRun = this.command.getFunctionByToken(editor.selection.getCursor());
            if(toRun === undefined){
                karelConsoleLog("noSelectedFunction");
                return;
            };
            this.resetNativeCodeInterpret(editor);
            this.setRunningTrue();
            this.debug.active = true;
            this.debug.codePointer = {functionName: toRun, tokenPointer: 0};
        }
        this.codeInterpret(this.debug.codePointer, editor);
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
     * TODO - remake
     * Translates text code to blockly blocks. It generates those blocks by tokens
     * that are expected to be passed. The function tries to save as many commentaries as possible,
     * but some are deleted, especially in math expressions.
     * @param {blockly workspace} workspace is the workspace where the blocks will be created
     * @param {array of tokens} codeArray is array of tokens to be converted
     */
    makeBlocksFromNativeCode(workspace, codeArray){
        var connectTo = [];
        var rules = {
            "function": {   create: ["base_function"],        action: ["addName", "clearConnections", "insertConnection", "setCollapse"],},
            "condition": {  create: ["base_condition"],       action: ["addName", "clearConnections", "insertConnection", "setCollapse"],},
            "end": {        create: [],                       action: ["popConnectionArray", "collapse"],},
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
            "global":{      create: ["math_global_var"],      action: ["connectBlock", "manageExpression"],},
            "local":{       create: ["math_local_var"],       action: ["connectBlock", "manageExpression"],},
            "do": {         create: ["control_repeat"],       action: ["connectBlock", "insertConnection", "manageExpression"],},
            "while": {      create: ["control_while"],        action: ["connectBlock", "insertConnection", "manageCondition"],},
            "if": {         create: ["if_creator"],           action: ["connectBlock", "insertConnection", "manageCondition"],},
            "else": {       create: [],                       action: ["popConnectionArray"],},
            "then": {       create: [],                       action: []},
            "times": {      create: [],                       action: []}
        }
        var currentRule;
        var toCollapse;
        var numOfCollapsedBlocks = 0;
        var variables = [];
        var commentText = "";

        for(var i = 1; i <  codeArray.length; i++){
            codeArray[0] = codeArray[0].concat(codeArray[i]);
        }
        codeArray = codeArray[0];

        if(codeArray === undefined){
            return;
        }

        while(codeArray.length > 0){
            currentRule = {};
            while(codeArray[0] !== undefined && codeArray[0].meaning == "commentary"){
                commentText += codeArray[0].value.substring(1);
                codeArray.shift();
            }
            if(this.closerRegex.test(codeArray[0].value)){
                currentRule = {action : ["popConnectionArray"]};
            } else if(codeArray[0].dictKey in rules){
                currentRule = rules[codeArray[0].dictKey];
                var newBlock;
                if(currentRule.create.length > 0){
                    if(currentRule.create[0] == "if_creator"){
                        let result = this.ifOrIfElse(0, codeArray);
                        if(result === undefined){
                            karelConsoleLog("blockConversionError");
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
                variables.push(codeArray[0].value);
                currentRule = {action : ["connectBlock", "insertName"]};
            }
            if(newBlock !== undefined){
                newBlock.initSvg();
                newBlock.render();
                if(commentText != ""){
                    newBlock.setCommentText(commentText);
                    commentText = "";
                }
            }

            for(var i = 0; i < currentRule.action.length; i++){
                switch(currentRule.action[i]){
                    case "addName":
                        codeArray.shift();
                        while(codeArray[0] !== undefined && codeArray[0].meaning == "commentary"){
                            codeArray.shift();
                        }
                        if(codeArray[0] !== undefined && codeArray[0].meaning == "identifier"){
                            newBlock.setFieldValue(codeArray[0].value, "NAME");
                        } else {
                            karelConsoleLog("blockConversionError");
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
                    case "clearConnections":
                        connectTo = [];
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
                        codeArray.shift();
                        var conditionComment = "";
                        while(codeArray[0] !== undefined && codeArray[0].meaning == "commentary"){
                            conditionComment += codeArray[0].value.substring(1);
                            codeArray.shift();
                        }
                        if(codeArray[0] === undefined || codeArray[0].meaning != "condition-prefix"){
                            karelConsoleLog("blockConversionError");
                            console.log("error - condition prefix expected");
                            return;
                        }
                        if(codeArray[0].dictKey == "isNot"){
                            newBlock.getField('COND_PREF').setValue("optionIsNot");
                        }
                        codeArray.shift();
                        while(codeArray[0] !== undefined && codeArray[0].meaning == "commentary"){
                            conditionComment += codeArray[0].value.substring(1);
                            codeArray.shift();
                        }
                        var conditionBlock;
                        if(codeArray[0] === undefined){
                            karelConsoleLog("blockConversionError");
                            console.log("error - condition expected");
                            return;
                        }
                        if((codeArray[0] !== undefined && variables.includes(codeArray[0].value)) || 
                                codeArray[0].meaning == "expression" || (codeArray[1] !== undefined && codeArray[1].meaning == "expression")){
                            currentRule.action.push("manageExpression");
                            codeArray.unshift({});
                        } else {
                            conditionBlock = workspace.newBlock(this.tellCondBlockByWord(codeArray[0].dictKey));
                            if(conditionBlock.type == "condition_userdefined"){
                                conditionBlock.getField('FC_NAME').setValue(codeArray[0].value);
                            }
                            conditionBlock.initSvg();
                            conditionBlock.render();
                            if(conditionComment != ""){
                                conditionBlock.setCommentText(conditionComment);
                            }
                            newBlock.getInput('COND').connection.connect(conditionBlock.outputConnection);
                        }
                        break;
                    case "manageExpression":
                        codeArray.shift();
                        if(codeArray[0] !== undefined && codeArray[0].dictKey == "variable"){
                            codeArray.shift();
                        }
                        var exprConnection = newBlock.getInput('EXPRESSION');
                        if(exprConnection == null){
                            exprConnection = newBlock.getInput('COND');
                        }
                        exprConnection = exprConnection.connection;
                        var result = this.math.checkExpression(codeArray, [], this.dictionary, false);
                        if(result){
                            if(codeArray[0].saveTo.length > 1){
                                karelConsoleLog("blockConversionError");
                            }
                            if(["math_global_var", "math_local_var"].includes(newBlock.type[0])){
                                newBlock.getField('VAR_NAME').setValue(codeArray[0].saveTo[0]);
                            }
                            this.math.createBlocklyExpression(codeArray[0].expressionTree, exprConnection, workspace);
                        } else {
                            karelConsoleLog("blockConversionError");
                            var expressionBlock = workspace.newBlock("math_variable");
                            if(codeArray[0].expressionString.indexOf(this.math.assignOps[0]) != -1){
                                expressionBlock.setFieldValue(
                                    codeArray[0].expressionString.substring(
                                        codeArray[0].expressionString.indexOf(this.math.assignOps[0]) + 1, 
                                        codeArray[0].expressionString.length), 
                                    "VAR_NAME");
                                newBlock.getField('VAR_NAME').setValue(codeArray[0].expressionString.substring(
                                    0, 
                                    codeArray[0].expressionString.indexOf(this.math.assignOps[0])));
                            } else {
                                expressionBlock.setFieldValue(codeArray[0].expressionString, "VAR_NAME");
                            }
                            expressionBlock.initSvg();
                            expressionBlock.render();
                            exprConnection.connect(expressionBlock.outputConnection);
                        }
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
                    case "insertName":
                        newBlock.getField('FC_NAME').setValue(codeArray[0].value);
                        break;
                    default:
                        karelConsoleLog("internalError");
                        console.log(currentRule.action[i]);
                        throw "Unknown action";
                }
            }
            codeArray.shift();
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
        if(this.textEditor.getSelectedText() != ""){
            this.lockBlocklyTextEditor = true;
            this.blocklyTextRepresentation.setValue(this.textEditor.getSelectedText());
            this.makeBlocksFromNativeCode(workspace, this.nativeCodeTokenizer(this.blocklyTextRepresentation, false));
            this.lockBlocklyTextEditor = false;
        }
    }

    /**
     * Creates specified save file
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
     *  "code": contains data about code editor
     * @param {string} mode is the mode the function will execute
     * @param {workspace} workspace is the blockly workspace
     */
    createSaveFileText(mode, workspace){
        var saveJson = {};
        saveJson["lang"] = localStorage['language'];
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
                karelConsoleLog("internalError");
                console.log("saveFile - unsupported mode [" + mode + "]");
                throw "unsupported save mode"; 
        }
        return saveJson;
    }

    /**
     * Creates save file and downloads it.
     * @param {string} mode is the save mode described in function `createSaveFileText`.
     * @param {string} name is the file name without the file suffix.
     * @param {workspace} workspace is the blockly workspace.
     */
    saveFile(mode, name, workspace){
        saveTextAsFile(JSON.stringify(this.createSaveFileText(mode, workspace)), name + '.karel');
    }

    /**
     * Checks if save file is correct
     * @param {dictionary} dataJson parsed save file to JSON dictionary
     * @returns item that failed, undefined otherwise
     */
    checkLoadedFile(dataJson){
        if(dataJson['lang'] === undefined){
            return 'lang';
        }
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
                case "exercise":
                    if(typeof dataJson[item] != "string"){
                        return item;
                    }
                    break;
                case "lang":
                    if(dataJson[item] === undefined || 
                        typeof dataJson[item] != "string" || 
                        !['cs', 'en'].includes(dataJson[item])){
                        return item;
                    }
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
     *  `room`: loads and applies only data that specifies the room and karel's position in it
     *  `blockly`: loads and applies only data that specifies blockly workspace
     *  `code`: loads and applies only data that specifies code editor
     *  `all`: loads and applies all information (all above, no control) 
     *  `byFile`: loads and applies only mentioned data (some of above)
     * Use check loader function before loading file to prevent bugs.
     * The save format is expected the save as described in `saveFile` function
     * @param {string} mode is the mode which the function will run 
     * @param {workspace} workspace is the blockly workspace
     * @param {elementID} dataJson is the JSON load structure
     */
    performLoad(dataJson, mode, workspace){
        switch(mode){
            case "room":
                if(this.command.karel.checkLoadFileKarelAndRoom(dataJson)){
                    this.command.karel.loadRoomWithKarel(dataJson);
                }
                break;
            case "blockly":
                workspace.clear();
                this.lockBlocklyTextEditor = true;
                this.blocklyTextRepresentation.setValue(fileLoadedEvent.target.result);
                this.makeBlocksFromNativeCode(workspace, this.nativeCodeTokenizer(this.blocklyTextRepresentation, false));
                this.lockBlocklyTextEditor = false;
                this.blocklyTextRepresentation.setValue("");
                this.blocklyTextRepresentation.setValue(Blockly.Karel.workspaceToCode(workspace));
                this.blocklyTextRepresentation.clearSelection();
                break;
            case "code":
                this.textEditor.setValue(fileLoadedEvent.target.result);
                this.textEditor.clearSelection();
                break;
            case "all":
                this.command.karel.loadRoomWithKarel(dataJson["karelAndRoom"]);
                workspace.clear();
                this.lockBlocklyTextEditor = true;
                this.blocklyTextRepresentation.setValue(dataJson["blockly"]);
                this.makeBlocksFromNativeCode(workspace, this.nativeCodeTokenizer(this.blocklyTextRepresentation, false));
                this.lockBlocklyTextEditor = false;
                this.textEditor.setValue(dataJson["code"]);
                break;
            case "byFile":
                try{
                    let result = this.checkLoadedFile(dataJson);
                    if(result !== undefined){
                        karelConsoleLog("corruptedSaveFile");
                        console.log("Checking failed at: ",result);
                        throw "Corrupted save file";
                    }
                }
                catch(err){
                    karelConsoleLog("corruptedSaveFile");
                    console.log("loadFromFile error - Corrupted save file")
                    return;
                }
                for(var key in dataJson){
                    switch(key){
                        case "karelAndRoom":
                            this.command.karel.loadRoomWithKarel(dataJson["karelAndRoom"]);
                            break;
                        case "blockly":
                            workspace.clear();
                            this.lockBlocklyTextEditor = true;
                            this.blocklyTextRepresentation.setValue(dataJson["blockly"]);
                            this.makeBlocksFromNativeCode(workspace, this.nativeCodeTokenizer(this.blocklyTextRepresentation, false));
                            this.lockBlocklyTextEditor = false;
                            this.blocklyTextRepresentation.setValue("");
                            this.blocklyTextRepresentation.setValue(Blockly.Karel.workspaceToCode(workspace));
                            this.blocklyTextRepresentation.clearSelection();
                            break;
                        case "code":
                            this.textEditor.setValue(dataJson["code"]);
                            this.textEditor.clearSelection();
                            break;
                        case "exercise":
                            document.getElementById('exerciseText').innerHTML = 
                                dataJson["exercise"] +
                                '<br><br><a href="javascript:closeExerciseWindow()" style="float: left; color: lime" id="closeExercise">' + 
                                this.dictionary['UI']['close'] + 
                                '</a>';
                            document.getElementById('exerciseText').style.display = "block";
                            break;
                        case "lang":
                            break;
                        default:
                            karelConsoleLog("corruptedSaveFile");
                            console.log("LoadFromFile warning - unknown save tree [" + key + "]");
                            break;
                    }
                }
                break;
            default:
                karelConsoleLog("internalError");
                console.log("LoadFromFile error - unsupported mode [" + mode + "]");
                return;
        }
    }

    /**
     * Triggers the load sequence which checks the current language
     * to the save language and it tries to load and translate the load file
     * to the correct currently used language.
     * @param {JSON} dataJson is the data to be loaded in a JSON format.
     * @param {string} mode is the loader mode - described in `performLoad` function.
     * @param {workspace} workspace is the blockly workspace
     */
    loadSequence(dataJson, mode, workspace){
        if(dataJson['lang'] != localStorage['language']){
            var tempDict = this.dictionary;
            var interpret = this;
            if(dataJson['lang'] === undefined){
                karelConsoleLog("corruptedSaveFile");
                console.log('no lang specified for save');
                return;
            }
            import('./languages/' + dataJson['lang'] + '.js').then((module) => {
                interpret.dictionary = module.setLang();
                this.performLoad(dataJson, mode, workspace);
                var codeArray = interpret.nativeCodeTokenizer(interpret.textEditor, false);
                interpret.dictionary = tempDict;
                interpret.textEditor.setValue(interpret.tokensToStringConvertor(interpret.translate(codeArray)));
                interpret.textEditor.clearSelection();
            });
        } else {
            this.performLoad(dataJson, mode, workspace);
        }
    }

    /**
     * Load data from file and sets the app by them
     * This function can run in a different modes:
     *  `room`: loads and applies only data that specifies the room and karel's position in it
     *  `blockly`: loads and applies only data that specifies blockly workspace
     *  `code`: loads and applies only data that specifies code editor
     *  `all`: loads and applies all information's (all above, no control) 
     *  `byFile`: loads and applies only mentioned data (some of above)
     * Use check loader function before loading file to prevent bugs.
     * The save format is expected the save as described in `saveFile` function
     * @param {string} mode is the mode which the function will run 
     * @param {workspace} workspace is the blockly workspace
     * @param {elementID} fileToLoadID is the ID of HTML element where is the file
     */
    loadFromFile(mode, workspace, fileToLoadID){
        var fileToLoad = document.getElementById(fileToLoadID).files[0];
        var fileReader = new FileReader();
        var interpret = this;
        document.getElementById('exerciseText').style.display = "none";
        fileReader.onload = function(fileLoadedEvent) 
        {   
            var dataJson = JSON.parse(fileLoadedEvent.target.result);
            interpret.loadSequence(dataJson, mode, workspace);
        };
        try {
            fileReader.readAsText(fileToLoad, "UTF-8");
        } catch(err) {
            karelConsoleLog("noFileToLoad");
      };  
    }
    
    /**
     * Loader directly from JSON used in server loads.
     * @param {JSON} dataJson the data file in JSON format.
     * @param {workspace} workspace blockly workspace
     */
    loadFromJSON(dataJson, workspace){
        this.loadSequence(dataJson, "byFile", workspace);
    }

    /**
     * Converts tokens into string representation of the code.
     * @param {codeArray} codeArray is the code array we want to represent as a string. 
     * @returns string representation of given code array.
     */
    tokensToStringConvertor(codeArray){
        var outputString = "";
        var row = 0;
        for(var i = 1; i <  codeArray.length; i++){
            codeArray[0] = codeArray[0].concat(codeArray[i]);
        }
        codeArray = codeArray[0];

        if(codeArray[0] !== undefined){
            for(var i = 0; i < codeArray[0].column; i++){
                outputString += " ";
            }
        }

        while(codeArray.length > 0){
            while(codeArray[0] !== undefined && codeArray[0].row == row){
                outputString += codeArray[0].value + " ";
                codeArray.shift();
            }
            if(codeArray[0] !== undefined){
                while(row != codeArray[0].row){
                    outputString += "\n";
                    row ++;
                }
                for(var i = 0; i < codeArray[0].column; i++){
                    outputString += " ";
                }
            }
        }
        return outputString;
    }

    /**
     * Translates given code array token values into current interpret dictionary.
     * To use tokenize the code before language change, change the language and pass
     * the previously tokenized code to this function. The output is code array with
     * translated token values. It can generate warning if keyword collision is detected.
     * @param {codeArray} codeArray is the code array we want to translate.
     * @returns translated code array.
     */
    translate(codeArray){
        for(var i = 0; i < codeArray.length; i++){
            for(var j = 0; j <  codeArray[i].length; j++){
                if(codeArray[i][j].dictKey !== undefined && codeArray[i][j].dictKey != ""){
                    if(this.closerRegex.test(codeArray[i][j].value)){
                        codeArray[i][j].value = this.closer + this.dictionary["keywords"][codeArray[i][j].dictKey];
                    } else {
                        codeArray[i][j].value = this.dictionary["keywords"][codeArray[i][j].dictKey];
                    }
                } else {
                    for(var key in this.dictionary["keywords"]){
                        if(codeArray[i][j].value == this.dictionary["keywords"][key]){
                            karelConsoleLog("translationIdentifierError");
                            break;
                        }
                    }
                }
            }
        }
        return codeArray;
    }
}

/**
 * Makes the code wait for given amount of milliseconds
 * @param {number} ms is the amount of milliseconds to wait for
 * @returns javascript promise to wait for
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Saves a string to a .txt file
 * @param {string} textToWrite is the string to be saved
 * @param {string} fileNameToSaveAs is the name of the file that will be downloaded
 */
function saveTextAsFile(textToWrite, fileNameToSaveAs){

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
