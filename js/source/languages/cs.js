export function setLang(){
    var dictionary = {};
    var keywords = {};
    var blocklyCategory = {};
    keywords["function"] = "prikaz";
    keywords["condition"] = "podminka";
    keywords["end"] = "konec";
    keywords["forward"] = "krok";
    keywords["right"] = "vpravo";
    keywords["left"] = "vlevo";
    keywords["placeBrick"] = "poloz";
    keywords["pickBrick"] = "zvedni";
    keywords["placeMark"] = "oznac";
    keywords["pickMark"] = "odznac";
    keywords["do"] = "udelej";
    keywords["times"] = "krat";
    keywords["while"] = "dokud";
    keywords["is"] = "je";
    keywords["isNot"] = "neni";
    keywords["wall"] = "zed";
    keywords["brick"] = "cihla";
    keywords["mark"] = "znacka";
    keywords["if"] = "kdyz";
    keywords["then"] = "tak";
    keywords["else"] = "jinak";
    keywords["true"] = "pravda";
    keywords["false"] = "nepravda";

    blocklyCategory["base"] = "Základ";
    blocklyCategory["functions"] = "Funkce";
    blocklyCategory["progFlow"] = "Řízení toku";
    blocklyCategory["condition"] = "Podmínky";

    dictionary["keywords"] = keywords;
    dictionary["blocklyCategory"] = blocklyCategory;
    return dictionary;
}

