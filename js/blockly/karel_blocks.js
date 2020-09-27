function blocklySetBlockLang(dictionary){
  Blockly.langDictionary = dictionary;
}

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
        .appendField(Blockly.langDictionary["keywords"]["placeBlock"]);
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
        .appendField(Blockly.langDictionary["keywords"]["pickBlock"]);
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

Blockly.Blocks['control_repeat'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["do"])
        .appendField(new Blockly.FieldNumber(0), "NAME")
        .appendField(Blockly.langDictionary["keywords"]["times"]);
    this.appendStatementInput("NAME")
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
    this.appendValueInput("condition")
        .setCheck("condition")
        .appendField(Blockly.langDictionary["keywords"]["while"])
        .appendField(new Blockly.FieldDropdown([[Blockly.langDictionary["keywords"]["is"],"optionIs"], [Blockly.langDictionary["keywords"]["isNot"],"oprionIsNot"]]), "conditionPrefix");
    this.appendStatementInput("statements")
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
    this.appendValueInput("conditon")
        .setCheck(null)
        .appendField(Blockly.langDictionary["keywords"]["if"])
        .appendField(new Blockly.FieldDropdown([[Blockly.langDictionary["keywords"]["is"],"oprtionIs"], [Blockly.langDictionary["keywords"]["isNot"],"optionIsNot"]]), "coditionPrefix");
    this.appendStatementInput("NAME")
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
    this.appendValueInput("condition")
        .setCheck(null)
        .appendField(Blockly.langDictionary["keywords"]["if"])
        .appendField(new Blockly.FieldDropdown([[Blockly.langDictionary["keywords"]["is"],"optionIs"], [Blockly.langDictionary["keywords"]["isNot"],"optionIsNot"]]), "conditionPrefix");
    this.appendStatementInput("thenPath")
        .setCheck(null)
        .appendField(Blockly.langDictionary["keywords"]["then"]);
    this.appendStatementInput("elsePath")
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

Blockly.Blocks['base_function'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["function"])
        .appendField(new Blockly.FieldTextInput(""), "NAME");
    this.appendStatementInput("NAME")
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
        .appendField(Blockly.langDictionary["keywords"]["condition"])
        .appendField(new Blockly.FieldTextInput(""), "NAME");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.appendDummyInput()
        .appendField(Blockly.langDictionary["keywords"]["end"]);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};