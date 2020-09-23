Blockly.Blocks['function_step'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("krok");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['function_right'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("vpravo");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['function_left'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("vlevo");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['function_place'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("poloz");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['function_pick'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("zvedni");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['function_placemark'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("oznac");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['function_unmark'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("odznac");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['function_true'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("pravda");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['function_false'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("nepravda");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['control_repeat'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("opakuj")
        .appendField(new Blockly.FieldNumber(0), "NAME")
        .appendField("krat");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("*dokud");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['control_while'] = {
  init: function() {
    this.appendValueInput("condition")
        .setCheck("condition")
        .appendField("dokud")
        .appendField(new Blockly.FieldDropdown([["je","optionIs"], ["neni","oprionIsNot"]]), "conditionPrefix");
    this.appendStatementInput("statements")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("*dokud");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['control_if'] = {
  init: function() {
    this.appendValueInput("conditon")
        .setCheck(null)
        .appendField("kdyz")
        .appendField(new Blockly.FieldDropdown([["je","oprtionIs"], ["neni","optionIsNot"]]), "coditionPrefix");
    this.appendStatementInput("NAME")
        .setCheck(null)
        .appendField("tak");
    this.appendDummyInput()
        .appendField("*kdyz");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['control_ifelse'] = {
  init: function() {
    this.appendValueInput("condition")
        .setCheck(null)
        .appendField("kdyz")
        .appendField(new Blockly.FieldDropdown([["je","optionIs"], ["neni","optionIsNot"]]), "conditionPrefix");
    this.appendStatementInput("thenPath")
        .setCheck(null)
        .appendField("tak");
    this.appendStatementInput("elsePath")
        .setCheck(null)
        .appendField("jinak");
    this.appendDummyInput()
        .appendField("*kdyz");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['condition_wall'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("zed");
    this.setOutput(true, "condition");
    this.setColour(90);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['condition_brick'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("cihla");
    this.setOutput(true, "condition");
    this.setColour(90);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['condition_mark'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("znacka");
    this.setOutput(true, "condition");
    this.setColour(90);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['base_function'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("prikaz")
        .appendField(new Blockly.FieldTextInput(""), "NAME");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("konec");
    this.setColour(180);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['base_condition'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("podminka")
        .appendField(new Blockly.FieldTextInput(""), "NAME");
    this.appendStatementInput("NAME")
        .setCheck(null);
    this.appendDummyInput()
        .appendField("konec");
    this.setColour(180);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};