export {interpret};

class interpret{

    constructor(textEditor, karel){
        this.dictionary = {};
        this.karel = karel;             // given robot karel to operate with
        this.textEditor = textEditor;   // given text editor to interpret
        this.commandList = [];          // user defined commands list
        this.conditionList = [];        // user defined condition list
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
            if(["forward", "right", "left", "placeBrick", "pickBrick", "placeMark", "pickMark", "true", "false"].includes(key)){
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
     * Executes the code written in editor
     * the interpret splits the given code into lines and then further into words. 
     * It processes one line at a time
     */
    async interpretTextCode(){
        if(this.running){
            console.log("ITC error - cannot run multiple programs at the same time");
            return; //cannot run multiple codes at once
        }

        this.running = true;
        var n = this.textEditor.selection.getCursor().row;
        var code = this.textEditor.getValue().split(/\r?\n/); //cuts the whole string in the editor to lines

        if(!this.textSyntaxChecker(code)){
            this.running = false;
            return;
        }

        var activeCounters = [];    //used for DO loops
        var programQueue = [];      //used to jump to other programs and return back (saves position from which was jumped)
        var lastConditionResult = "undef";
        var words = code[n].match(/[^\ ]+/g);

        while(words[0] != this.dictionary["keywords"]["function"] && words[0] != this.dictionary["keywords"]["condition"]){      
            // rolls the code pointer to the begining of function which was selected to be executed
            n --;
            if(n < 0 || code[n] == this.dictionary["keywords"]["end"]){
                console.log("ITC error - function to be executed not found");
                this.running = false;
                return;
            }
            words = code[n].match(/[^\ ]+/g);
        }

        while(this.running){
            this.textEditor.gotoLine(n + 1);
            words = code[n].match(/[^\ ]+/g);
            for(var i = 0; i < words.length; i++){ //weird stuff happening with this approach. Need to be redesigned
                switch(words[i]){
                    case this.dictionary["keywords"]["function"]:
                    case this.dictionary["keywords"]["condition"]:
                        i++; //skip the name of the function or condition
                         break;
                    case this.dictionary["keywords"]["end"]:
                        if(programQueue.length == 0){
                            this.running = false;
                            return;
                        } else {
                            n = programQueue[programQueue.length - 1] - 1; //in next step the N will be incremented so we need to substract the addition to maintain the correct jump
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
                        if(parseInt(words[1]) == 0){
                            n = this.codeJumper(this.dictionary["keywords"]["do"], false, code, n);
                        } else {
                            activeCounters.push(words[1]); 
                        }
                        i += 2; // skips number and times
                        break;
                    case "*" + this.dictionary["keywords"]["do"]:
                        activeCounters[activeCounters.length - 1]--;
                        if(activeCounters[activeCounters.length - 1] > 0){
                            n = this.codeJumper(this.dictionary["keywords"]["do"], true, code, n);
                        } else {
                            activeCounters.pop();
                        }
                        break;
                    case this.dictionary["keywords"]["while"]:
                        if([this.dictionary["keywords"]["wall"], this.dictionary["keywords"]["brick"], this.dictionary["keywords"]["mark"]].includes(words[2])){
                            if(!this.checkBaseCondition(words[1], words[2])){
                                n = this.codeJumper(this.dictionary["keywords"]["while"], false, code, n);
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
                                if((lastConditionResult == false && words[1] == this.dictionary["keywords"]["is"]) || 
                                    (lastConditionResult == true && words[1] == this.dictionary["keywords"]["isNot"])){
                                    n = this.codeJumper(this.dictionary["keywords"]["while"], false, code, n);
                                }
                                lastConditionResult = "undef";
                            }
                        }
                        i += 2; // skips condition prefix and name
                        break;
                    case "*" + this.dictionary["keywords"]["while"]:
                        n = this.codeJumper(this.dictionary["keywords"]["while"], true, code, n) - 1;
                        break;
                    case this.dictionary["keywords"]["if"]:
                        if([this.dictionary["keywords"]["wall"], this.dictionary["keywords"]["brick"], this.dictionary["keywords"]["mark"]].includes(words[2])){
                            if(!this.checkBaseCondition(words[1], words[2])){
                                n = this.codeJumper(this.dictionary["keywords"]["if"], false, code, n);
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
                                if((lastConditionResult == false && words[1] == this.dictionary["keywords"]["is"]) || 
                                    (lastConditionResult == true && words[1] == this.dictionary["keywords"]["isNot"])){
                                    n = this.codeJumper(this.dictionary["keywords"]["while"], false, code, n);
                                }
                                lastConditionResult = "undef";
                            }
                        }
                        i += 2; // skips condition prefix and name
                        break;
                    case this.dictionary["keywords"]["else"]:
                        n = this.codeJumper(this.dictionary["keywords"]["if"], false, code, n);
                        break;
                    case this.dictionary["keywords"]["then"]:
                    case "*" + this.dictionary["keywords"]["if"]:
                        break;
                    case this.dictionary["keywords"]["true"]:
                        lastConditionResult = true;
                        break;
                    case this.dictionary["keywords"]["false"]:
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
                    case this.dictionary["keywords"]["function"]:
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
                        for(var j = 0; j < this.reservedWords.length; j++){
                            // definition of command name from reserved list - FUNCTION
                            if(this.reservedWords[j] == words[1]){
                                console.log("TSC error - redefinition of reserved command at line " + i);
                                return false;
                            }
                        }
                        this.commandList.push([words[1], i]);
                        inDefinition = true;
                        break;
                    case this.dictionary["keywords"]["condition"]:
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
                        for(var j = 0; j < this.reservedWords.length; j++){
                            // definition of condition name from reserved list - CONDITION
                            if(this.reservedWords[j] == words[1]){
                                console.log("TSC error - redefinition of reserved command at line " + i);
                                return false;
                            }
                        }
                        this.conditionList.push([words[1], i]);
                        inDefinition = true;
                        break;
                    case this.dictionary["keywords"]["do"]:
                        // checking number of arguments and what are they - DO LOOP
                        if(words.length != 3 || words[2] != this.dictionary["keywords"]["times"] || isNaN(parseInt(words[1])) || !inDefinition){
                            console.log("TSC error - wrong DO definition at line " + i);
                            return false;
                        }
                        activeStructures.push(this.dictionary["keywords"]["do"]);
                        break;
                    case this.dictionary["keywords"]["while"]:
                        // checking number of arguments and what are they - WHILE LOOP
                        if(words.length != 3 || ![this.dictionary["keywords"]["is"], this.dictionary["keywords"]["isNot"]].includes(words[1]) || !inDefinition){
                            console.log("TSC error - wrong WHILE definiton at line " + i);
                            return false;
                        }
                        // checking if the condition is defined - IF STATEMENT
                        if(![this.dictionary["keywords"]["wall"], this.dictionary["keywords"]["brick"], this.dictionary["keywords"]["mark"]].includes(words[2])){
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
                        activeStructures.push(this.dictionary["keywords"]["while"]);
                        break;
                    case this.dictionary["keywords"]["if"]:
                        // checking number of arguments and what are they - IF STATEMENT
                        if(words.length != 3 || ![this.dictionary["keywords"]["is"], this.dictionary["keywords"]["isNot"]].includes(words[1]) || !inDefinition){
                            console.log("TSC error - wrong IF definition at line " + i);
                            return false;
                        }
                        // checking if the condition is defined - IF STATEMENT
                        if(![this.dictionary["keywords"]["wall"], this.dictionary["keywords"]["brick"], this.dictionary["keywords"]["mark"]].includes(words[2])){
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
                        activeStructures.push(this.dictionary["keywords"]["if"]);
                        break;
                    case this.dictionary["keywords"]["then"]:
                    case this.dictionary["keywords"]["else"]:
                        if(activeStructures[activeStructures.length - 1] != tthis.dictionary["keywords"]["if"]){
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
                    case this.dictionary["keywords"]["end"]:
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
                    case "*" + this.dictionary["keywords"]["do"]:
                        if(activeStructures[activeStructures.length - 1] != this.dictionary["keywords"]["do"]){
                            console.log("TSC error - missing end of structure at line " + i  + " - structure " + activeStructures[activeStructures.length - 1]);
                            return false;
                        }
                        activeStructures.pop();
                        break;
                    case "*" + this.dictionary["keywords"]["while"]:
                        if(activeStructures[activeStructures.length - 1] != this.dictionary["keywords"]["while"]){
                            console.log("TSC error - missing end of structure at line " + i  + " - structure " + activeStructures[activeStructures.length - 1]);
                            return false;
                        }
                        activeStructures.pop();
                        break;
                    case this.dictionary["keywords"]["then"]:
                    case this.dictionary["keywords"]["else"]:
                        if(activeStructures[activeStructures.length - 1] != this.dictionary["keywords"]["if"]){
                            console.log("TSC error - IF fail, wrong structure at line " + i);
                            return false;
                        }
                        break;
                    case "*" + this.dictionary["keywords"]["if"]:
                        if(activeStructures[activeStructures.length - 1] != this.dictionary["keywords"]["if"]){
                            console.log("TSC error - missing end of structure at line " + i  + " - structure " + activeStructures[activeStructures.length - 1])
                        }
                        activeStructures.pop();
                        break;
                    default:
                        var found = false;
                        if(!inDefinition && line == ""){
                            found = true;
                        }
                        for(var j = 0; j < this.functions.length; j++){
                            if(line == this.functions[j]){
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
        if(prefix == this.dictionary["keywords"]["is"]){
            // true line
            switch(condition){
                case this.dictionary["keywords"]["wall"]:
                    return this.karel.isWall();
                case this.dictionary["keywords"]["brick"]:
                    return this.karel.isBrick();
                case this.dictionary["keywords"]["mark"]:
                    return this.karel.isMark();
            }
        } else {
            // not line
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
     * Makes a specified jump in the code, have special sence for IF constructions
     * @param {string} command is the comand which tells the type of jump
     * @param {boolean} up if true, jumps up, otherwise down
     * @param {array} code is the array of strings of the code
     * @param {number} pos is the actual position in the code
     */
    codeJumper(command, up, code, pos){
        var numSkip = 0;
        if(command == this.dictionary["keywords"]["if"]){
            while(true){
                pos++;
                var words = code[pos].match(/[^\ ]+/g);
                if(words[0] == command){
                    numSkip++;
                } else if(words[0] == "*" + command && numSkip > 0){
                    numSkip--;
                } else if((words[0] == this.dictionary["keywords"]["else"] && numSkip == 0) || (words[0] == "*" + command && numSkip == 0)){
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
