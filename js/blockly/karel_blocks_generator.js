Blockly.Karel = new Blockly.Generator('Karel');

Blockly.Karel['function_step'] = function(block) {
    var code = Blockly.langDictionary["keywords"]["forward"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    } else {
        code += "\n";
    }
    return code;
};

Blockly.Karel['function_right'] = function(block){
    var code = Blockly.langDictionary["keywords"]["right"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
    }
    return code;
}

Blockly.Karel['function_left'] = function(block){
    var code = Blockly.langDictionary["keywords"]["left"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
    }
    return code;
}

Blockly.Karel['function_place'] = function(block){
    var code = Blockly.langDictionary["keywords"]["placeBrick"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
    }
    return code;
}

Blockly.Karel['function_pick'] = function(block){
    var code = Blockly.langDictionary["keywords"]["pickBrick"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
    }
    return code;
}

Blockly.Karel['function_placemark'] = function(block){
    var code = Blockly.langDictionary["keywords"]["placeMark"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
    }
    return code;
}

Blockly.Karel['function_unmark'] = function(block){
    var code = Blockly.langDictionary["keywords"]["pickMark"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
    }
    return code;
}

Blockly.Karel['function_true'] = function(block){
    var code = Blockly.langDictionary["keywords"]["true"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
    }
    return code;
}

Blockly.Karel['function_false'] = function(block){
    var code = Blockly.langDictionary["keywords"]["false"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
    }
    return code;
}

Blockly.Karel['function_faster'] = function(block){
    var code = Blockly.langDictionary["keywords"]["faster"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
    }
    return code;
}

Blockly.Karel['function_slower'] = function(block){
    var code = Blockly.langDictionary["keywords"]["slower"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
    }
    return code;
}

Blockly.Karel['function_beep'] = function(block){
    var code = Blockly.langDictionary["keywords"]["beep"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
    }
    return code;
}

Blockly.Karel['function_userDefined'] = function(block){
    var code = block.getFieldValue('FC_NAME');
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
    }
    return code;
}

Blockly.Karel['control_repeat'] = function(block){
    var code = Blockly.langDictionary["keywords"]["do"] + " " + block.getFieldValue('DO_TIMES') + " " + Blockly.langDictionary["keywords"]["times"] + "\n";
    code += Blockly.Karel.statementToCode(block, 'INNER_CODE');
    code += Blockly.closer + Blockly.langDictionary["keywords"]["do"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
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
    code += Blockly.closer + Blockly.langDictionary["keywords"]["while"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
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
    code += Blockly.closer + Blockly.langDictionary["keywords"]["if"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
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
    code += Blockly.closer + Blockly.langDictionary["keywords"]["if"];
    if(block.getNextBlock() != null){
        code += "\n" + Blockly.Karel.blockToCode(block.getNextBlock())
    }else {
        code += "\n";
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