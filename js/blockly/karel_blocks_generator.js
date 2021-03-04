Blockly.Karel = new Blockly.Generator('Karel');
Blockly.Karel.INDENT = "    ";

Blockly.Karel['function_step'] = function(block) {
    var code = Blockly.langDictionary["keywords"]["forward"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
};

Blockly.Karel['function_right'] = function(block){
    var code = Blockly.langDictionary["keywords"]["right"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['function_left'] = function(block){
    var code = Blockly.langDictionary["keywords"]["left"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['function_place'] = function(block){
    var code = Blockly.langDictionary["keywords"]["placeBrick"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['function_pick'] = function(block){
    var code = Blockly.langDictionary["keywords"]["pickBrick"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['function_placemark'] = function(block){
    var code = Blockly.langDictionary["keywords"]["placeMark"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['function_unmark'] = function(block){
    var code = Blockly.langDictionary["keywords"]["pickMark"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['function_true'] = function(block){
    var code = Blockly.langDictionary["keywords"]["true"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['function_false'] = function(block){
    var code = Blockly.langDictionary["keywords"]["false"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['function_faster'] = function(block){
    var code = Blockly.langDictionary["keywords"]["faster"] + "\n";
    if(block.getNextBlock() != null){
        code +=  Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['function_slower'] = function(block){
    var code = Blockly.langDictionary["keywords"]["slower"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['function_beep'] = function(block){
    var code = Blockly.langDictionary["keywords"]["beep"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['function_userDefined'] = function(block){
    var code = block.getFieldValue('FC_NAME') + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['control_repeat'] = function(block){
    var code = Blockly.langDictionary["keywords"]["do"] + " " + Blockly.Karel.valueToCode(block, 'EXPRESSION', 0) + " " + Blockly.langDictionary["keywords"]["times"] + "\n";
    code += Blockly.Karel.statementToCode(block, 'INNER_CODE');
    code += Blockly.closer + Blockly.langDictionary["keywords"]["do"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['control_while'] = function(block){
    var condPref;
    var condVal = Blockly.Karel.valueToCode(block, 'COND', 0);
    if(block.getFieldValue('COND_PREF') == "optionIs"){
        condPref = Blockly.langDictionary["keywords"]["is"];
    } else {
        condPref = Blockly.langDictionary["keywords"]["isNot"]
    }
    var code = Blockly.langDictionary["keywords"]["while"] + " " + condPref + " " + condVal + "\n";
    code += Blockly.Karel.statementToCode(block, 'INNER_CODE');
    code += Blockly.closer + Blockly.langDictionary["keywords"]["while"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['control_if'] = function(block){
    var condPref;
    var condVal = Blockly.Karel.valueToCode(block, 'COND', 0);
    if(block.getFieldValue('COND_PREF') == "optionIs"){
        condPref = Blockly.langDictionary["keywords"]["is"];
    } else {
        condPref = Blockly.langDictionary["keywords"]["isNot"]
    }
    var code = Blockly.langDictionary["keywords"]["if"] + " " + condPref + " " + condVal + "\n" + Blockly.langDictionary["keywords"]["then"] + "\n";
    code += Blockly.Karel.statementToCode(block, 'INNER_CODE_THEN');
    code += Blockly.closer + Blockly.langDictionary["keywords"]["if"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['control_ifelse'] = function(block){
    var condPref;
    var condVal = Blockly.Karel.valueToCode(block, 'COND', 0);
    if(block.getFieldValue('COND_PREF') == "optionIs"){
        condPref = Blockly.langDictionary["keywords"]["is"];
    } else {
        condPref = Blockly.langDictionary["keywords"]["isNot"]
    }
    var code = Blockly.langDictionary["keywords"]["if"] + " " + condPref + " " + condVal + "\n" + Blockly.langDictionary["keywords"]["then"] + "\n";
    code += Blockly.Karel.statementToCode(block, 'INNER_CODE_THEN');
    code += Blockly.langDictionary["keywords"]["else"] + "\n";
    code += Blockly.Karel.statementToCode(block, 'INNER_CODE_ELSE')
    code += Blockly.closer + Blockly.langDictionary["keywords"]["if"] + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
}

Blockly.Karel['condition_wall'] = function(){
    return [Blockly.langDictionary["keywords"]["wall"], 0];
}

Blockly.Karel['condition_brick'] = function(){
    return [Blockly.langDictionary["keywords"]["brick"], 0];
}

Blockly.Karel['condition_mark'] = function(){
    return [Blockly.langDictionary["keywords"]["mark"], 0];
}

Blockly.Karel['condition_vacant'] = function(){
    return [Blockly.langDictionary["keywords"]["vacant"], 0];
}

Blockly.Karel['condition_userdefined'] = function(block){
    return [block.getFieldValue('FC_NAME'), 0];
}

Blockly.Karel['math_number'] = function(block){
    return [block.getFieldValue('VALUE').toString() , 0];
}

Blockly.Karel['math_variable'] = function(block){
    return [block.getFieldValue('VAR_NAME'), 0];
}

Blockly.Karel['math_operators'] = function(block){
    var value_left_side = Blockly.Karel.valueToCode(block, 'LEFT_SIDE', 0);
    var dropdown_operator = block.getFieldValue('OPERATOR');
    var value_right_side = Blockly.Karel.valueToCode(block, 'RIGHT_SIDE', 0);
    return [value_left_side + " " + dropdown_operator + " " + value_right_side, 0];
}

Blockly.Karel['math_compare'] = function(block){
    var value_left_side = Blockly.Karel.valueToCode(block, 'LEFT_SIDE', 0);
    var dropdown_operator = block.getFieldValue('OPERATOR');
    var value_right_side = Blockly.Karel.valueToCode(block, 'RIGHT_SIDE', 0);
    return [value_left_side + " " + dropdown_operator + " " + value_right_side, 0];
}

Blockly.Karel['math_brackets'] = function(block){
    return ["( " + Blockly.Karel.valueToCode(block, 'VALUE', 0) + " )", 0];
}

Blockly.Karel['math_definevar'] = function(block) {
    var text_var_name = block.getFieldValue('VAR_NAME');
    var value_expression = Blockly.Karel.valueToCode(block, 'EXPRESSION', 0);
    if(value_expression != ""){
        text_var_name = text_var_name + " = " + value_expression;
    }
    var code = text_var_name + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
  };

Blockly.Karel['math_setvar'] = function(block) {
    var text_var_name = block.getFieldValue('VAR_NAME');
    var value_expression = Blockly.Karel.valueToCode(block, 'EXPRESSION', 0);
    if(value_expression != ""){
        text_var_name = text_var_name + " = " + value_expression;
    }
    var code = text_var_name + "\n";
    if(block.getNextBlock() != null){
        code += Blockly.Karel.blockToCode(block.getNextBlock());
    }
    return code;
};

Blockly.Karel['base_function'] = function(block){
    var code = Blockly.langDictionary["keywords"]["function"] + " " + block.getFieldValue('NAME') + "\n";
    code += Blockly.Karel.statementToCode(block, 'INNER_CODE');
    code += Blockly.langDictionary["keywords"]["end"] + "\n";
    return code + "\n";
}

Blockly.Karel['base_condition'] = function(block){
    var code = Blockly.langDictionary["keywords"]["condition"] + " " + block.getFieldValue('NAME') + "\n";
    code += Blockly.Karel.statementToCode(block, 'INNER_CODE');
    code += Blockly.langDictionary["keywords"]["end"] + "\n";
    return code + "\n";
}

Blockly.Karel['base_definition'] = function(block){
    var code = Blockly.langDictionary["keywords"]["definition"] + "\n";
    code += Blockly.Karel.statementToCode(block, 'INNER_CODE');
    code += Blockly.langDictionary["keywords"]["end"] + "\n";
    return code + "\n";
}