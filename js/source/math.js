export {math}

/**
 * This class will be use in the future to manipulate with numbers and variables in Karel's language
 */
class math{

    constructor(){
        this.variables = {};                                                                    // Holds all variables scope and value information
        this.numberOfVariables = 10;                                                            // Tells the number of variables - not used
        this.command;                                                                           // Connection to the command object
        this.binaryOps = ["+", "-", "*", "/", "%"];                                             // List of all binary operators
        this.assignOps = ["="];                                                                 // List of all asign operators
        this.compareOps = ["<", "<=", ">", ">=", "==", "!="];                                   // List of all compare operators
        this.expectingNext = this.binaryOps + this.assignOps + this.compareOps + ["("];         // List of all operators that expect next operand
        this.allOperators = this.binaryOps + this.assignOps + this.compareOps + ["(", ")"];     // List of all operators
        this.globalScopeName = "*global*";                                                      // Name of the global scope
    }

    /**
     * Assings command object.
     * @param {command} command is the command object to be assigned.
     */
    assignCommand(command){
        this.command = command;
    }

    /**
     * Prepares math for checking and executing code.
     */
    clearMath(){
        this.variables = {};
        this.variables[this.globalScopeName] = [];
        this.variables[this.globalScopeName].push({});
    }

    /**
     * Registers variables scope array for given function
     * @param {string} name is the name of the function we want to register scope array for.
     */
    registerFunctionScopes(name){
        this.variables[name] = [];
    }

    /**
     * Appends scope array for given function - increases the scope level.
     * @param {string} name is name of the function we want to append scope array for.
     */
    appendScope(name){
        this.variables[name].push({});
    }

    /**
     * Pops scope array for given function - lowers the scope level
     * @param {string} name is name of the function we want to pop scope array for.
     */
    deleteScope(name){
        this.variables[name].pop();
    }

    /**
     * Sets variable to a given value in the top scope level.
     * @param {string} name is the name of the variable.
     * @param {string} scope is the scope of the variable.
     * @param {number} value is the value of the variable.
     */
    setVariable(name, scope, value){
        this.variables[scope][this.variables[scope].length - 1][name] = value;
    }

    /**
     * Tells value of a given variable. can throw errors if we read undefined variable.
     * it firstly looks into local scope, the to the global scope. It always looks at the top
     * level of the scope.
     * @param {string} name is the name of the variable. 
     * @param {string} scope is the scope of the variable.
     * @returns value of the variable
     */
    getVariable(name, scope){
        if(scope in this.variables && this.variables[scope].length > 0 && name in this.variables[scope][this.variables[scope].length - 1]){
            return this.variables[scope][this.variables[scope].length - 1][name];
        } else if(this.globalScopeName in this.variables && this.variables[this.globalScopeName].length > 0 && 
                    name in this.variables[this.globalScopeName][this.variables[this.globalScopeName].length - 1]){
            return this.variables[this.globalScopeName][this.variables[this.globalScopeName].length - 1][name];
        }
        console.log(name, this.variables);
        throw {name: "undefVarRead", message: "Undefined variable read"};
    }

    /**
     * ACE sometimes produces tokens that are expresion but presented as identifiers (like "((+").
     * This function can tell the diference between those tokes which should be expressions and the ones that souldnt.
     * This function takes the code array and the list of operators we want to be recognized, repairs the code array and
     * tells if the repair was done.
     * @param {codeArray} codeArray is the code array that contains the bad tokens.
     * @returns true of the array war repaired, false otherwise
     */
    checkIdentifiersMixing(codeArray){
        var testedToken = codeArray[0];
        var insertTokens = [];
        while(testedToken.value.length > 0){
            if(this.allOperators.includes(testedToken.value[0] + testedToken.value[1])){
                insertTokens.push({
                    value: testedToken.value[0] + testedToken.value[1] , 
                    meaning: "expression", 
                    row: testedToken.row, 
                    column: testedToken.column, 
                    psaMeaning: testedToken.value[0] + testedToken.value[1], 
                    psaTerminal: true
                });
                testedToken.column += 2;
                testedToken.value = testedToken.value.substring(2);
            } else if(this.allOperators.includes(testedToken.value[0])){
                insertTokens.push({
                    value: testedToken.value[0], 
                    meaning: "expression", 
                    row: testedToken.row, 
                    column: testedToken.column, 
                    psaMeaning: testedToken.value[0], 
                    psaTerminal: true
                });
                testedToken.column ++;
                testedToken.value = testedToken.value.substring(1);
            } else {
                return false;
            }
        }
        codeArray.shift();
        while(insertTokens.length > 0){
            codeArray.unshift(insertTokens.pop());
        }
        return true;
    }

    /**
     * Loads expression and from code array and returns information about it.
     * This function assumes that there is a expression in begining of code array, the
     * expression is shifted from the array and the colected information about the 
     * expression is returned in the output object.
     * Return object contains:
     *  - expressionArray - array of tokens that belong to the current expression.
     *  - assignNum - number of assigning operators.
     *  - expressionString - is the text representation of the expression.
     * This function ca run in the strict mode. When enabled, it takes only expression
     * tokens as part of the expression, if turned off, it loads also identifier tokens, 
     * if there is a binary operator before them.
     * @param {codeArray} codeArray is the code array to scan the expression from.
     * @param {boolean} strict  true enables the strict mode, false turns it off.
     * @returns object containing information about the expression (described above).
     */
    loadExpression(codeArray, strict){
        var expressionArray = [];
        var assignNum = 0;
        var expressionString = "";

        if((!strict) && codeArray[0] !== undefined && codeArray[0].meaning == "identifier"){
            codeArray[0].meaning = "expression";
            codeArray[0].psaMeaning = "variable";
            codeArray[0].psaTerminal = true;
        }

        while(codeArray[0] !== undefined && codeArray[0].meaning == "expression"){
            if(codeArray[0].psaMeaning === undefined){
                if(Number.isInteger(parseInt(codeArray[0].value))){
                    codeArray[0].psaMeaning = "number";
                } else {
                    codeArray[0].psaMeaning = codeArray[0].value;
                    if(this.assignOps.includes(codeArray[0].value)){
                        assignNum ++;
                    }
                }
            }
            codeArray[0].psaTerminal = true;
            expressionString += codeArray[0].value;
            expressionArray.push(codeArray.shift());
            if((!strict) && codeArray[0] !== undefined && codeArray[0].meaning == "identifier" && (expressionArray.length == 0 || 
                    this.expectingNext.includes(expressionArray[expressionArray.length - 1].value))){
                codeArray[0].meaning = "expression";
                codeArray[0].psaMeaning = "variable";
                codeArray[0].psaTerminal = true;
            }
        }
        return {expressionArray: expressionArray, assignNum: assignNum, expressionString: expressionString};
    }

    /**
     * Checks expression based on the PSA analysis. The checker loads the whole 
     * expression, checks it and creates the expression tree, which will later 
     * be used for calculating the outcome of the expression. The table and rules
     * can be seen in this google sheet:
     * https://docs.google.com/spreadsheets/d/1ZHOjsJgSekrjLMMdATj4ccAKeb4HEqrpOBlI2Gh33ko/edit?usp=sharing
     * All the tokens that belongs to the expression will be removed from the given code Array and placed
     * in to special token that will be pushed to the original spot of the expression in the code array.
     * This special token contains all the expression tokens, its expression tree, expression type and where the 
     * outcome should be saved.
     * @param {codeArray} codeArray is the code array on whichs top, there is the expression
     * @param {array} errors array of errors to be processed. 
     * @param {distionary} dictionary aplication dictionary used to determine error texts.
     * @param {boolean} strict tells the mode of the expression loader function above.
     * @returns false if any error is found, true otherwise.
     */
    checkExpression(codeArray, errors, dictionary, strict){
        var expressionToken = Object.assign({}, codeArray[0]);
        var loadedExpression = this.loadExpression(codeArray, strict);
        var assignNum = loadedExpression.assignNum;
        var expressionArray = loadedExpression.expressionArray;
        //console.log("codeArray: ",codeArray.slice(), " expression Array: ", expressionArray.slice(), " assignNum: ", assignNum);

        let table = [
        /*    predical        *    +    <   num                */
        /*     table          /    -   <=   var   (    )    $  */
        /*                   ...  ...  ...                     */
        /* *, / ...     */  [">", ">", ">", "<", "<", ">", ">"],
        /* +, -         */  ["<", ">", ">", "<", "<", ">", ">"],
        /* <, <= ...    */  ["<", "<", " ", "<", "<", ">", ">"],
        /* num, var     */  [">", ">", ">", " ", " ", ">", ">"],
        /* (            */  ["<", "<", "<", "<", "<", "=", " "],
        /* )            */  [">", ">", ">", " ", " ", ">", ">"],
        /* $            */  ["<", "<", "<", "<", "<", " ", " "]
        ];

        let rules = {
            "number":       {psaMeaning: "E", psaTerminal: false},
            "variable":     {psaMeaning: "E", psaTerminal: false},
            "E+E":          {psaMeaning: "E", psaTerminal: false},
            "E-E":          {psaMeaning: "E", psaTerminal: false},
            "E*E":          {psaMeaning: "E", psaTerminal: false},
            "E/E":          {psaMeaning: "E", psaTerminal: false},
            "E%E":          {psaMeaning: "E", psaTerminal: false},
            "E>E":          {psaMeaning: "E", psaTerminal: false},
            "E>=E":         {psaMeaning: "E", psaTerminal: false},
            "E<E":          {psaMeaning: "E", psaTerminal: false},
            "E<=E":         {psaMeaning: "E", psaTerminal: false},
            "E==E":         {psaMeaning: "E", psaTerminal: false},
            "E!=E":         {psaMeaning: "E", psaTerminal: false},
            "(E)":          {psaMeaning: "E", psaTerminal: false}
        };

        /**
         * Tells the index in the table by token.
         * @param {token} token is the token we wnat to know the index to the PSA table of.
         * @returns index to the PSA table for the token.
         */
        function getTableIndexByToken(token){
            switch(token.psaMeaning){
                case "*":
                case "/":
                case "%":
                    return 0;
                case "+":
                case "-":
                    return 1;
                case "<":
                case "<=":
                case ">":
                case ">=":
                case "==":
                case "!=":
                    return 2;
                case "variable":
                case "number":
                    return 3;
                case "(":
                    return 4;
                case ")":
                    return 5;
                case "$":
                    return 6;
                default:
                    karelConsoleLog("internaError");
                    console.log(token)
                    throw "Unknown expression token";
            }
        }

        /**
         * tells top stack terminal.
         * @param {array} stack is the stack we want to know the top terminal of.
         * @returns index into this array of the top terminal.
         */
        function getTopTermIndex(stack){
            var i = stack.length - 1;
            while(!stack[i].psaTerminal){
                i --;
            }
            return i;
        }

        /**
         * Gets the stack closure (to the last "<" psaMeaning token).
         * @param {array} stack is the stack we want to het the top rule enclosure from.
         * @returns object with rule string and the tokens that corresponds to this rule. 
         */
        function getStackRuleClosure(stack){
            var stackRule = [];
            var popedTokens = [];
            var rule = "";
            while(!(stack[stack.length - 1].psaMeaning == "<" && !stack[stack.length - 1].psaTerminal) && stack[stack.length - 1].psaMeaning != "$"){
                stackRule.push(stack[stack.length - 1].psaMeaning);
                popedTokens.push(stack.pop());
            }
            if(stack[stack.length - 1].psaMeaning == "<" && !stack[stack.length - 1].psaTerminal){
                stack.pop();
            }
            stackRule = stackRule.reverse();
            popedTokens = popedTokens.reverse();
            for(var i = 0; i < stackRule.length; i++){
                rule += stackRule[i];
            }
            return {rule: rule, tokens: popedTokens};
        }

        /**
         * Tells if the stack is in the needed ending state ($E state).
         * @param {array} stack is the stack array.
         * @returns true if the stack is in the ending state, false otherwise.
         */
        function stackEndCheck(stack){
            if(stack.length != 2){
                return false;
            }
            if(stack[0].psaMeaning != "$"){
                return false;
            }
            if(stack[1].psaMeaning == "E" && !stack[1].psaTerminal){
                return true;
            }
            return false;
        }

        // creating token folder
        expressionToken.includes = expressionArray.slice();
        expressionToken.expressionString = loadedExpression.expressionString;
        delete expressionToken.value;
        delete expressionToken.dictKey;
        expressionToken.saveTo = [];
        expressionToken.meaning = "expression";
        codeArray.unshift(expressionToken);

        // telling the expression type
        if(assignNum > 0){
            for(assignNum; assignNum > 0; assignNum --){
                if(!(expressionArray[0].psaMeaning == "variable")){
                    errors.push({error: dictionary["checkerErrorMessages"]["variableExpected"], token: expressionArray[0]});
                    return false;
                }
                expressionToken.saveTo.push(expressionArray.shift().value);
                if(!this.assignOps.includes(expressionArray[0].value)){
                    errors.push({error: dictionary["checkerErrorMessages"]["assignExpected"], token: expressionArray[0]});
                    return false;
                }
                expressionArray.shift();
            }
        }

        // checking the expression by PSA
        var stack = [{value: "", meaning: "expression", psaMeaning: "$", psaTerminal: true}];
        expressionArray.push({value: "", meaning: "expression", psaMeaning: "$", psaTerminal: true});

        do{
            switch(table[getTableIndexByToken(stack[getTopTermIndex(stack)])][getTableIndexByToken(expressionArray[0])]){
                case "=":
                    stack.push(expressionArray.shift());
                    break;
                case "<":
                    stack.splice(getTopTermIndex(stack) + 1, 0, {psaMeaning: "<", psaTerminal: false});
                    stack.push(expressionArray.shift());
                    break;
                case ">":
                    var currentRule = getStackRuleClosure(stack);
                    //console.log("current rule: ",currentRule);
                    if(currentRule.rule in rules){
                        stack.push({psaMeaning: "E", psaTerminal: false, tokens: currentRule.tokens});
                    } else {
                        console.log("current rule: ",currentRule);
                        this.createExpressionErrors(expressionToken, dictionary["checkerErrorMessages"]["badExpression"], errors);
                        return false;
                    }
                    break;
                case " ":
                default:
                    this.createExpressionErrors(expressionToken, dictionary["checkerErrorMessages"]["badExpression"], errors);
                    return false;
            }
        }while(!(expressionArray[0].psaMeaning == "$" && stackEndCheck(stack)));
        expressionToken.expressionTree = stack[1];
        //console.log("success -> ", expressionToken);
        return true;
    }

    /**
     * Computes givet token expression folder. It uses recursion processing of the 
     * expression tree described in the `computeToken` function to evaluate the espression.
     * @param {token} expressionToken is the token expression folder.
     * @param {string} scopeSave in case of saving variable value, it uses this scope.
     * @param {string} scopeLoad in case of loading a variable, it uses firstly this scope, then global.
     * @returns the value is returned.
     */
    computeExpression(expressionToken, scopeSave, scopeLoad){
        var result = this.computeToken(expressionToken.expressionTree, scopeLoad);
        for(var i = 0; i < expressionToken.saveTo.length; i++){
            this.setVariable(expressionToken.saveTo[i], scopeSave, result);
        }
        return result;
    }

    /**
     * Evaluates expression by the expression tree by recursion. When zero division detected, warning posted.
     * @param {expression tree node} expressionTree is the root node of the expression tree we want to evaluate.
     * @returns value of the expression tree.
     */
    computeToken(expressionTree, scope){
        if(expressionTree.psaTerminal){
            switch(expressionTree.psaMeaning){
                case "number":
                    return parseInt(expressionTree.value);
                case "variable":
                    return this.getVariable(expressionTree.value, scope);
                default:
                    karelConsoleLog("internaError");
                    console.log(expressionTree, expressionTree.psaMeaning);
                    throw "Unknown psaMeaning";
            }
        } else {
            if(expressionTree.tokens.length == 1){
                return this.computeToken(expressionTree.tokens[0], scope);
            } else {
                switch(expressionTree.tokens[1].psaMeaning){
                    case "E":
                        return this.computeToken(expressionTree.tokens[1], scope);
                    case "+":
                        return this.computeToken(expressionTree.tokens[0], scope) + this.computeToken(expressionTree.tokens[2], scope);
                    case "-":
                        return this.computeToken(expressionTree.tokens[0], scope) - this.computeToken(expressionTree.tokens[2], scope);
                    case "*":
                        return this.computeToken(expressionTree.tokens[0], scope) * this.computeToken(expressionTree.tokens[2], scope);
                    case "/":
                        var divby = this.computeToken(expressionTree.tokens[2], scope);
                        if(divby == 0){
                            throw {name: "zeroDivision", message: "Zero division error"};
                        }
                        return Math.floor(this.computeToken(expressionTree.tokens[0], scope) / divby);
                    case "%":
                        var divby = this.computeToken(expressionTree.tokens[2], scope);
                        if(divby == 0){
                            throw {name: "zeroDivision", message: "Zero division error"};
                        }
                        return this.computeToken(expressionTree.tokens[0], scope) % divby;
                    case ">":
                        if(this.computeToken(expressionTree.tokens[0], scope) > this.computeToken(expressionTree.tokens[2], scope)){
                            return 1;
                        }
                        return 0;
                    case ">=":
                        if(this.computeToken(expressionTree.tokens[0], scope) >= this.computeToken(expressionTree.tokens[2], scope)){
                            return 1;
                        }
                        return 0;
                    case "<":
                        if(this.computeToken(expressionTree.tokens[0], scope) < this.computeToken(expressionTree.tokens[2], scope)){
                            return 1;
                        }
                        return 0;
                    case "<=":
                        if(this.computeToken(expressionTree.tokens[0], scope) <= this.computeToken(expressionTree.tokens[2], scope)){
                            return 1;
                        }
                        return 0;
                    case "==":
                        if(this.computeToken(expressionTree.tokens[0], scope) == this.computeToken(expressionTree.tokens[2], scope)){
                            return 1;
                        }
                        return 0;
                    case "!=":
                        if(this.computeToken(expressionTree.tokens[0], scope) != this.computeToken(expressionTree.tokens[2], scope)){
                            return 1;
                        }
                        return 0;
                    default:
                        karelConsoleLog("internaError");
                        console.log(expressionTree);
                        throw "Unknown middle token";
                }
            }
        }
    }

    /**
     * Creates error token for represenation in the ACE gutter for expression and the errors
     * is pushed among other errors to be dealed with later.
     * @param {token} expressionToken is the bad expression token folder.
     * @param {string} errorString is the text of the error.
     * @param {array} errors is the errors array.
     */
     createExpressionErrors(expressionToken, errorString, errors){
        for(var i = 0; i < expressionToken.includes.length; i++){
            var currentRow = expressionToken.includes[i].row;
            var currentColumn = expressionToken.includes[i].column;
            while(expressionToken.includes[i + 1] !== undefined && currentRow == expressionToken.includes[i + 1].row){
                i++;
            }
            var valueString = "";
            for(var j = currentColumn; j < expressionToken.includes[i].column + expressionToken.includes[i].value.length; j++){
                valueString += "x";
            }
            errors.push({error: errorString, token: {value: valueString, row: currentRow, column: currentColumn, expression: expressionToken}});
        }
    }

    /**
     * Creates HTML table which tells all the variables and its value. The table is displayed in the UI.
     * @param {dictionary} dictionary is the app dictionary.
     * @returns string with HTML table with information about variables.
     */
    createVariableOverview(dictionary){
        var outputText = "<table> <tr><td colspan=\"4\"> " + dictionary["UI"]["varTable"]["variables"] + "</td></tr>";
        outputText += "<tr><td>" + dictionary["UI"]["varTable"]["names"] + "</td><td>" + dictionary["UI"]["varTable"]["values"] + 
            "</td><td>" + dictionary["UI"]["varTable"]["scope"] + "</td><td>" + dictionary["UI"]["varTable"]["level"] + "</td></tr>";
        if(this.globalScopeName in this.variables){
            for(var i = 0; i < this.variables[this.globalScopeName].length; i++){
                for(var varname in this.variables[this.globalScopeName][i]){
                    outputText += "<tr><td>" + varname + "</td><td>" + this.variables[this.globalScopeName][i][varname] + 
                        "</td><td>" + dictionary["keywords"]["global"] + "</td><td> - </td></tr>";
                }
            }
        }
        for(var scope in this.variables){
            if(scope != this.globalScopeName){
                for(var i = 0; i < this.variables[scope].length; i++){
                    for(var varname in this.variables[scope][i]){
                        outputText += "<tr><td>" + varname + "</td><td>" + this.variables[scope][i][varname] + 
                            "</td><td>" + scope + "</td><td>" + i + "</td></tr>";
                    }
                }
            }
        }
        outputText += "</table>"
        return outputText;
    }

    /**
     * Creates blockly representation of expression. It operates in a recursion.
     * @param {expression tree node} expressionTreeNode is the expression tree node.
     * @param {connection} connectTo is the connection where we want the result to be connected.
     * @param {workspace} workspace is the blockly workspace, where the representation will be generated.
     */
    createBlocklyExpression(expressionTreeNode, connectTo, workspace){
        if(expressionTreeNode.tokens.length == 3){
            switch(expressionTreeNode.tokens[1].psaMeaning){
                case "E":
                    var newBlock = workspace.newBlock('math_brackets');
                    newBlock.initSvg();
                    newBlock.render();
                    connectTo.connect(newBlock.outputConnection);
                    this.createBlocklyExpression(expressionTreeNode.tokens[1], newBlock.getInput('VALUE').connection, workspace);
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    var newBlock = workspace.newBlock("math_operators");
                    newBlock.initSvg();
                    newBlock.render();
                    newBlock.getField('OPERATOR').setValue(expressionTreeNode.tokens[1].psaMeaning);
                    connectTo.connect(newBlock.outputConnection);
                    this.createBlocklyExpression(expressionTreeNode.tokens[0], newBlock.getInput('LEFT_SIDE').connection, workspace);
                    this.createBlocklyExpression(expressionTreeNode.tokens[2], newBlock.getInput('RIGHT_SIDE').connection, workspace);
                    break;
                case ">":
                case ">=":
                case "<":
                case "<=":
                case "==":
                case "!=":
                    var newBlock = workspace.newBlock("math_compare");
                    newBlock.initSvg();
                    newBlock.render();
                    newBlock.getField('OPERATOR').setValue(expressionTreeNode.tokens[1].psaMeaning);
                    connectTo.connect(newBlock.outputConnection);
                    this.createBlocklyExpression(expressionTreeNode.tokens[0], newBlock.getInput('LEFT_SIDE').connection, workspace);
                    this.createBlocklyExpression(expressionTreeNode.tokens[2], newBlock.getInput('RIGHT_SIDE').connection, workspace);
                    break;
                default:
                    console.log(expressionTreeNode);
                    throw "unknown middle token";
            }
        } else {
            if(expressionTreeNode.tokens[0].psaMeaning == "number"){
                var newBlock = workspace.newBlock('math_number');
                newBlock.setFieldValue(expressionTreeNode.tokens[0].value , "VALUE");
            } else {
                var newBlock = workspace.newBlock('math_variable');
                newBlock.setFieldValue(expressionTreeNode.tokens[0].value , "VAR_NAME");
            }
            newBlock.initSvg();
            newBlock.render();
            connectTo.connect(newBlock.outputConnection);
        }
    }
}