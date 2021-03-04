export {math}

/**
 * This class will be use in the future to manipulate with numbers and variables in Karel's language
 */
class math{

    constructor(){
        this.variables = {};
        this.numberOfVariables = 10;
        this.command;
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
    }

    /**
     * Defnes variable in the Karel's global scope. The value is checked for redefinition.
     * @param {token} token is the variable name token.
     * @param {array} errors all errors are pushed there. 
     * @param {dictionary} dictionary texts of the errors are defined here.
     */
    defineVariable(token, errors, dictionary){
        if(token.value in this.command.commandList || token.value in this.command.conditionList  || 
            token.value in this.command.expectDefinition || token.value in this.variables ){
            errors.push({error: dictionary["checkerErrorMessages"]["redefinition"], token: token});
                return;
        }
        this.variables[token.value] = "undefined";
    }

    /**
     * Tells variable value by a given name.
     * @param {string} name is the name of a variable we want the value of.
     * @returns value of the variable. 
     */
    getVariable(name){
        if(!(name in this.variables)){
            console.log(name);
            throw "undefined variable";
        }
        return this.variables[name];
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
     * @returns object that contains new codeArray and the result of the checking.
     */
    checkExpression(codeArray){
        var expressionArray = [];
        var expressionToken = Object.assign({}, codeArray[0]);

        let binaryOps = ["+", "-", "*", "/", "%"];
        let assignOps = ["="];
        let compareOps = ["<", "<=", ">", ">=", "==", "!="];
        let expectingNext = binaryOps + assignOps + compareOps + ["("];
        let allOperators = binaryOps + assignOps + compareOps + ["(", ")"];

        var assignNum = 0;
        var compare = {expression: false, error: false};

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

        /**
         * ACE sometimes produces tokens that are expresion but presented as identifiers (like "((+").
         * This function can tell the diference between those tokes which should be expressions and the ones that souldnt.
         * This function takes the code array and the list of operators we want to be recognized, repairs the code array and
         * tells if the repair was done.
         * @param {codeArray} codeArray is the code array that contains the bad tokens.
         * @param {array} allOperators all the operatos we want to be recognized.
         * @returns object that contains result (if the operation was done) and the repaired code array.
         */
        function checkIdentifiersMixing(codeArray, allOperators){
            var testedToken = codeArray[0];
            var insertTokens = [];
            while(testedToken.value.length > 0){
                if(allOperators.includes(testedToken.value[0] + testedToken.value[1])){
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
                } else if(allOperators.includes(testedToken.value[0])){
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
                    return {result: false};
                }
            }
            codeArray.shift();
            codeArray = insertTokens.concat(codeArray);
            return {result: true, codeArray: codeArray};
        }

        // loading the expression
        while(codeArray[0].meaning == "expression" || codeArray[0].meaning == "identifier"){
            if(codeArray[0].meaning == "identifier"){
                var operMix = checkIdentifiersMixing(codeArray, allOperators);
                if(expectingNext.includes(expressionArray[expressionArray.length - 1].value) && codeArray[0].value in this.variables){
                    codeArray[0].meaning = "expression";
                    codeArray[0].psaMeaning = "variable";
                } else if(operMix.result){
                    codeArray = operMix.codeArray;
                    if(assignOps.includes(codeArray[0].value)){
                        assignNum ++;
                    } else if(compareOps.includes(codeArray[0].value)){
                        compare.error = compare.expression;
                        compare.expression = true;
                    }
                } else {
                    break;
                }
            } else {
                if(Number.isInteger(parseInt(codeArray[0].value))){
                    codeArray[0].psaMeaning = "number";
                } else {
                    if(codeArray[0].value in this.variables){
                        codeArray[0].psaMeaning = "variable";
                    } else {
                        codeArray[0].psaMeaning = codeArray[0].value;
                    }
                }
                if(assignOps.includes(codeArray[0].value)){
                    assignNum ++;
                } else if(compareOps.includes(codeArray[0].value)){
                    compare.error = compare.expression;
                    compare.expression = true;
                }
            }
            //console.log(codeArray.slice());
            codeArray[0].psaTerminal = true;
            expressionArray.push(codeArray.shift());
        }

        // creating token folder
        expressionToken.includes = expressionArray.slice();
        delete expressionToken.value;
        delete expressionToken.dictKey;
        expressionToken.saveTo = [];
        codeArray.unshift(expressionToken);

        // telling the expression type
        if((compare.expression && assignNum > 0) || compare.error){
            console.log("expression type error");
            return {result: false, codeArray: codeArray};
        }
        if(assignNum > 0){
            for(assignNum; assignNum > 0; assignNum --){
                if(!expressionArray[0].value in this.variables){
                    console.log("error - bad assign");
                    return {result: false, codeArray: codeArray};
                }
                expressionToken.saveTo.push(expressionArray.shift().value);
                if(!assignOps.includes(expressionArray[0].value)){
                    console.log("error - bad assign");
                    return {result: false, codeArray: codeArray};
                }
                expressionArray.shift();
            }
            expressionToken.type = "assigning";
        } else if(compare.expression){
            expressionToken.type = "compare";
        } else {
            expressionToken.type = "compute"; 
        }

        // checking the expression by PSA
        var stack = [{value: "", meaning: "expression", psaMeaning: "$", psaTerminal: true}];
        expressionArray.push({value: "", meaning: "expression", psaMeaning: "$", psaTerminal: true});

        do{
            switch(table[getTableIndexByToken(stack[getTopTermIndex(stack)], this.variables)][getTableIndexByToken(expressionArray[0], this.variables)]){
                case "=":
                    stack.push(expressionArray.shift());
                    break;
                case "<":
                    stack.splice(getTopTermIndex(stack) + 1, 0, {psaMeaning: "<", psaTerminal: false});
                    stack.push(expressionArray.shift());
                    break;
                case ">":
                    var currentRule = getStackRuleClosure(stack);
                    console.log("current rule: ",currentRule);
                    if(currentRule.rule in rules){
                        stack.push({psaMeaning: "E", psaTerminal: false, tokens: currentRule.tokens});
                    } else {
                        console.log("error");
                        return {result: false, codeArray: codeArray};
                    }
                    break;
                case " ":
                default:
                    console.log("error");
                    return {result: false, codeArray: codeArray};
            }
        }while(!(expressionArray[0].psaMeaning == "$" && stackEndCheck(stack)));
        expressionToken.expressionTree = stack[1];
        console.log("success -> ", expressionToken);
        return {result: true, codeArray: codeArray};
    }

    /**
     * Computes givet token expression folder. It uses recursion processing of the 
     * expression tree described in the `computeToken` function to evaluate the espression.
     * @param {token} expressionToken is the token expression folder.
     * @returns if it is not an assigning expression, the value is returned.
     */
    computeExpression(expressionToken){
        switch(expressionToken.type){
            case "compare":
            case "compute":
                return this.computeToken(expressionToken.expressionTree);
            case "assigning":
                var result = this.computeToken(expressionToken.expressionTree);
                for(var i = 0; i < expressionToken.saveTo.length; i++){
                    this.variables[expressionToken.saveTo[i]] = result;
                }
                break;
        }
    }

    /**
     * Evaluates expression by the expression tree by recursion
     * @param {expression tree node} expressionTree is the root node of the expression tree we want to evaluate.
     * @returns value of the expression tree.
     */
    computeToken(expressionTree){
        if(expressionTree.psaTerminal){
            switch(expressionTree.psaMeaning){
                case "number":
                    return parseInt(expressionTree.value);
                case "variable":
                    if(expressionTree.value in this.variables && this.variables[expressionTree.value] != "undefined"){
                        return this.variables[expressionTree.value];
                    } else {
                        console.log("variables: ",this.variables);
                        throw "undefined variable read";
                    }
                default:
                    console.log(expressionTree);
                    throw "Unknown psaMeaning";
            }
        } else {
            if(expressionTree.tokens.length == 1){
                return this.computeToken(expressionTree.tokens[0]);
            } else {
                switch(expressionTree.tokens[1].psaMeaning){
                    case "E":
                        return this.computeToken(expressionTree.tokens[1]);
                    case "+":
                        return this.computeToken(expressionTree.tokens[0]) + this.computeToken(expressionTree.tokens[2]);
                    case "-":
                        return this.computeToken(expressionTree.tokens[0]) - this.computeToken(expressionTree.tokens[2]);
                    case "*":
                        return this.computeToken(expressionTree.tokens[0]) * this.computeToken(expressionTree.tokens[2]);
                    case "/":
                        return Math.floor(this.computeToken(expressionTree.tokens[0]) / this.computeToken(expressionTree.tokens[2]));
                    case "%":
                        return this.computeToken(expressionTree.tokens[0]) % this.computeToken(expressionTree.tokens[2]);
                    case ">":
                        if(this.computeToken(expressionTree.tokens[0]) > this.computeToken(expressionTree.tokens[2])){
                            return 1;
                        }
                        return 0;
                    case ">=":
                        if(this.computeToken(expressionTree.tokens[0]) >= this.computeToken(expressionTree.tokens[2])){
                            return 1;
                        }
                        return 0;
                    case "<":
                        if(this.computeToken(expressionTree.tokens[0]) < this.computeToken(expressionTree.tokens[2])){
                            return 1;
                        }
                        return 0;
                    case "<=":
                        if(this.computeToken(expressionTree.tokens[0]) <= this.computeToken(expressionTree.tokens[2])){
                            return 1;
                        }
                        return 0;
                    case "==":
                        if(this.computeToken(expressionTree.tokens[0]) == this.computeToken(expressionTree.tokens[2])){
                            return 1;
                        }
                        return 0;
                    case "!=":
                        if(this.computeToken(expressionTree.tokens[0]) != this.computeToken(expressionTree.tokens[2])){
                            return 1;
                        }
                        return 0;
                    default:
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
            while(currentRow == expressionToken.includes[i]){
                i++;
            }
            var valueString = "";
            for(var j = 0; j < expressionToken[i].column - currentColumn; j++){
                valueString += "x";
            }
            errors.push({error: errorString, token: {value: valueString, row: currentRow, column: currentColumn}});
        }
    }
}