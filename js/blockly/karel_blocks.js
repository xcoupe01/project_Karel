/**
 * Definition of blocks for Karel language
 * Author: Vojtěch Čoupek
 */


/**
 * Sets language for blocks
 * @param {JSON} dictionary aplication dictionary in JSON format
 */
function blocklySetBlockLang(dictionary){
  Blockly.langDictionary = dictionary;
}

/**
 * Sets the closer for the blocks
 * @param {char} closer the closing character of Karel language
 */
function blocklySetCloser(closer){
  Blockly.closer = closer;
}

var runMe;

/**
 * Sets the running function to specified name
 * @param {string} setToFunc is the name of the function
 */
function blocklySetRunMe(setToFunc){
  runMe = setToFunc;
};

Blockly.Blocks['function_step'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["forward"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_right'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["right"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_left'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["left"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_place'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["placeBrick"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_pick'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["pickBrick"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_placemark'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["placeMark"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_unmark'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["pickMark"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_true'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["true"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_false'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["false"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_faster'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["faster"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_slower'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["slower"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_beep'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["beep"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_userDefined'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["blocklyCategory"]["userDefinedFunc"])
        .appendField(new Blockly.FieldTextInput(Blockly.langDictionary["blocklyCategory"]["name"]), "FC_NAME");
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(90);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['control_repeat'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["do"]);
    this.appendValueInput("EXPRESSION")
        .setCheck("number");
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["times"]);
    this.appendStatementInput("INNER_CODE")
        .setCheck("command");
    this.appendDummyInput()
        .appendField(Blockly.closer+Blockly.langDictionary["keywords"]["do"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
    var numBlock = this.workspace.newBlock('math_number');
    numBlock.setShadow(true);
    numBlock.initSvg();
    numBlock.render();
    this.getInput('EXPRESSION').connection.connect(numBlock.outputConnection);
  }
};

Blockly.Blocks['control_while'] = {
  init: function() {
    this.appendValueInput("COND")
        .setCheck(["condition", "number"])
        .appendField(Blockly.langDictionary["keywords"]["while"])
        .appendField(new Blockly.FieldDropdown([[Blockly.langDictionary["keywords"]["is"],"optionIs"], [Blockly.langDictionary["keywords"]["isNot"],"optionIsNot"]]), "COND_PREF");
    this.appendStatementInput("INNER_CODE")
        .setCheck("command");
    this.appendDummyInput()
        .appendField(Blockly.closer+Blockly.langDictionary["keywords"]["while"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['control_if'] = {
  init: function() {
    this.appendValueInput("COND")
        .setCheck(["condition", "number"])
        .appendField(Blockly.langDictionary["keywords"]["if"])
        .appendField(new Blockly.FieldDropdown([[Blockly.langDictionary["keywords"]["is"],"optionIs"], [Blockly.langDictionary["keywords"]["isNot"],"optionIsNot"]]), "COND_PREF");
    this.appendStatementInput("INNER_CODE_THEN")
        .setCheck("command")
        .appendField(Blockly.langDictionary["keywords"]["then"]);
    this.appendDummyInput()
        .appendField(Blockly.closer+Blockly.langDictionary["keywords"]["if"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['control_ifelse'] = {
  init: function() {
    this.appendValueInput("COND")
        .setCheck(["condition", "number"])
        .appendField(Blockly.langDictionary["keywords"]["if"])
        .appendField(new Blockly.FieldDropdown([[Blockly.langDictionary["keywords"]["is"],"optionIs"], [Blockly.langDictionary["keywords"]["isNot"],"optionIsNot"]]), "COND_PREF");
    this.appendStatementInput("INNER_CODE_THEN")
        .setCheck("command")
        .appendField(Blockly.langDictionary["keywords"]["then"]);
    this.appendStatementInput("INNER_CODE_ELSE")
        .setCheck("command")
        .appendField(Blockly.langDictionary["keywords"]["else"]);
    this.appendDummyInput()
        .appendField(Blockly.closer+Blockly.langDictionary["keywords"]["if"]);
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['condition_wall'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["wall"]);
    this.setOutput(true, "condition");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['condition_brick'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["brick"]);
    this.setOutput(true, "condition");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['condition_mark'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["mark"]);
    this.setOutput(true, "condition");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['condition_vacant'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["vacant"]);
    this.setOutput(true, "condition");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['condition_userdefined'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["blocklyCategory"]["userDefinedCond"])
        .appendField(new Blockly.FieldTextInput(Blockly.langDictionary["blocklyCategory"]["name"]), "FC_NAME");
    this.setOutput(true, "condition");
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['math_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0, 0, Infinity, 1), "VALUE");
    this.setOutput(true, "number");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['math_variable'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(Blockly.langDictionary["blocklyCategory"]["varName"]), "VAR_NAME");
    this.setOutput(true, "number");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['math_operators'] = {
  init: function() {
    this.appendValueInput("LEFT_SIDE")
        .setCheck("number");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["+","+"], ["-","-"], ["*","*"], ["/","/"], ["%","%"]]), "OPERATOR");
    this.appendValueInput("RIGHT_SIDE")
        .setCheck("number");
    this.setOutput(true, "number");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
    var numBlock = this.workspace.newBlock('math_number');
    numBlock.setShadow(true);
    numBlock.initSvg();
    numBlock.render();
    this.getInput('LEFT_SIDE').connection.connect(numBlock.outputConnection);
    numBlock = this.workspace.newBlock('math_number');
    numBlock.setShadow(true);
    numBlock.initSvg();
    numBlock.render();
    this.getInput('RIGHT_SIDE').connection.connect(numBlock.outputConnection);
  }
};

Blockly.Blocks['math_compare'] = {
  init: function() {
    this.appendValueInput("LEFT_SIDE")
        .setCheck("number");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[">",">"], [">=",">="], ["<","<"], ["<=","<="], ["==","=="], ["!=","!="]]), "OPERATOR");
    this.appendValueInput("RIGHT_SIDE")
        .setCheck("number");
    this.setOutput(true, "number");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
    var numBlock = this.workspace.newBlock('math_number');
    numBlock.setShadow(true);
    numBlock.initSvg();
    numBlock.render();
    this.getInput('LEFT_SIDE').connection.connect(numBlock.outputConnection);
    numBlock = this.workspace.newBlock('math_number');
    numBlock.setShadow(true);
    numBlock.initSvg();
    numBlock.render();
    this.getInput('RIGHT_SIDE').connection.connect(numBlock.outputConnection);
  }
};

Blockly.Blocks['math_brackets'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("(");
    this.appendValueInput("VALUE")
        .setCheck("number");
    this.appendDummyInput()
        .appendField(")");
    this.setOutput(true, "number");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
    var numBlock = this.workspace.newBlock('math_number');
    numBlock.setShadow(true);
    numBlock.initSvg();
    numBlock.render();
    this.getInput('VALUE').connection.connect(numBlock.outputConnection);
  }
};

Blockly.Blocks['math_global_var'] = {
  init: function() {
    this.appendValueInput("EXPRESSION")
        .setCheck("number")
        .appendField(Blockly.langDictionary["keywords"]["global"] + " " + Blockly.langDictionary["keywords"]["variable"])
        .appendField(new Blockly.FieldTextInput(Blockly.langDictionary["blocklyCategory"]["varName"]), "VAR_NAME")
        .appendField("=");
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
    var numBlock = this.workspace.newBlock('math_number');
    numBlock.setShadow(true);
    numBlock.initSvg();
    numBlock.render();
    this.getInput('EXPRESSION').connection.connect(numBlock.outputConnection);
  }
};

Blockly.Blocks['math_local_var'] = {
  init: function() {
    this.appendValueInput("EXPRESSION")
        .setCheck("number")
        .appendField(Blockly.langDictionary["keywords"]["local"] + " " + Blockly.langDictionary["keywords"]["variable"])
        .appendField(new Blockly.FieldTextInput(Blockly.langDictionary["blocklyCategory"]["varName"]), "VAR_NAME")
        .appendField("=");
    this.setPreviousStatement(true, "command");
    this.setNextStatement(true, "command");
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
    var numBlock = this.workspace.newBlock('math_number');
    numBlock.setShadow(true);
    numBlock.initSvg();
    numBlock.render();
    this.getInput('EXPRESSION').connection.connect(numBlock.outputConnection);
  }
};

Blockly.Blocks['base_function'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("img/play-solid.svg", 25, 25, "*",runMe))
        .appendField(Blockly.langDictionary["keywords"]["function"])
        .appendField(new Blockly.FieldTextInput(Blockly.langDictionary["blocklyCategory"]["name"]), "NAME")
    this.appendStatementInput("INNER_CODE")
        .setCheck("command");
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["end"]);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['base_condition'] = {
  init: function() {
    this.appendDummyInput()
       .appendField(new Blockly.FieldImage("img/play-solid.svg", 25, 25, "*",runMe))
        .appendField(Blockly.langDictionary["keywords"]["condition"])
        .appendField(new Blockly.FieldTextInput(Blockly.langDictionary["blocklyCategory"]["name"]), "NAME");
    this.appendStatementInput("INNER_CODE")
        .setCheck("command");
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["end"]);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};