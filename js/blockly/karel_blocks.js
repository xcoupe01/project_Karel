function blocklySetBlockLang(dictionary){
  Blockly.langDictionary = dictionary;
}

var runMe;
function blocklySetRunMe(setToFunc){
  runMe = setToFunc;
};

Blockly.Blocks['function_step'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["forward"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_right'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["right"]);
    this.setPreviousStatement(true, null);
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
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_place'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["placeBrick"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_pick'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["pickBrick"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_placemark'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["placeMark"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_unmark'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["pickMark"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_true'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["true"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_false'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["false"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_faster'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["faster"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_slower'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["slower"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['function_beep'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["beep"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
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
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(90);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['control_repeat'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["do"])
        .appendField(new Blockly.FieldNumber(0), "DO_TIMES")
        .appendField(Blockly.langDictionary["keywords"]["times"]);
    this.appendStatementInput("INNER_CODE")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("*"+Blockly.langDictionary["keywords"]["do"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['control_while'] = {
  init: function() {
    this.appendValueInput("COND")
        .setCheck("condition")
        .appendField(Blockly.langDictionary["keywords"]["while"])
        .appendField(new Blockly.FieldDropdown([[Blockly.langDictionary["keywords"]["is"],"optionIs"], [Blockly.langDictionary["keywords"]["isNot"],"optionIsNot"]]), "COND_PREF");
    this.appendStatementInput("INNER_CODE")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("*"+Blockly.langDictionary["keywords"]["while"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['control_if'] = {
  init: function() {
    this.appendValueInput("COND")
        .setCheck(null)
        .appendField(Blockly.langDictionary["keywords"]["if"])
        .appendField(new Blockly.FieldDropdown([[Blockly.langDictionary["keywords"]["is"],"optionIs"], [Blockly.langDictionary["keywords"]["isNot"],"optionIsNot"]]), "COND_PREF");
    this.appendStatementInput("INNER_CODE_THEN")
        .setCheck(null)
        .appendField(Blockly.langDictionary["keywords"]["then"]);
    this.appendDummyInput()
        .appendField("*"+Blockly.langDictionary["keywords"]["if"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['control_ifelse'] = {
  init: function() {
    this.appendValueInput("COND")
        .setCheck(null)
        .appendField(Blockly.langDictionary["keywords"]["if"])
        .appendField(new Blockly.FieldDropdown([[Blockly.langDictionary["keywords"]["is"],"optionIs"], [Blockly.langDictionary["keywords"]["isNot"],"optionIsNot"]]), "COND_PREF");
    this.appendStatementInput("INNER_CODE_THEN")
        .setCheck(null)
        .appendField(Blockly.langDictionary["keywords"]["then"]);
    this.appendStatementInput("INNER_CODE_ELSE")
        .setCheck(null)
        .appendField(Blockly.langDictionary["keywords"]["else"]);
    this.appendDummyInput()
        .appendField("*"+Blockly.langDictionary["keywords"]["if"]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
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

Blockly.Blocks['base_function'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("/img/play.png", 25, 25, "*",runMe))
        .appendField(Blockly.langDictionary["keywords"]["function"])
        .appendField(new Blockly.FieldTextInput(Blockly.langDictionary["blocklyCategory"]["name"]), "NAME");
    this.appendStatementInput("INNER_CODE")
        .setCheck(null);
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
       .appendField(new Blockly.FieldImage("/img/play.png", 25, 25, "*",runMe))
        .appendField(Blockly.langDictionary["keywords"]["condition"])
        .appendField(new Blockly.FieldTextInput(Blockly.langDictionary["blocklyCategory"]["name"]), "NAME");
    this.appendStatementInput("INNER_CODE")
        .setCheck(null);
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["end"]);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};