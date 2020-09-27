export function setLang(){
    var dictionary = {};
    var keywords = {};
    var blocklyCategory = {};
    keywords["function"] = "function";
    keywords["condition"] = "condition";
    keywords["end"] = "end";
    keywords["forward"] = "forward";
    keywords["right"] = "right";
    keywords["left"] = "left";
    keywords["placeBrick"] = "place";
    keywords["pickBrick"] = "pick";
    keywords["placeMark"] = "mark";
    keywords["pickMark"] = "unmark";
    keywords["do"] = "do";
    keywords["times"] = "times";
    keywords["while"] = "while";
    keywords["is"] = "is";
    keywords["isNot"] = "not";
    keywords["wall"] = "wall";
    keywords["brick"] = "brick";
    keywords["mark"] = "marked";
    keywords["if"] = "if";
    keywords["then"] = "then";
    keywords["else"] = "else";
    keywords["true"] = "true";
    keywords["false"] = "false";

    blocklyCategory["base"] = "Base";
    blocklyCategory["functions"] = "Functions";
    blocklyCategory["progFlow"] = "Flow control";
    blocklyCategory["condition"] = "Conditions";

    dictionary["keywords"] = keywords;
    dictionary["blocklyCategory"] = blocklyCategory;
    return dictionary;
}