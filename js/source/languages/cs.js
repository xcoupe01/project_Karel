export function setLang(){
    return {
        "keywords" : {
            "function"      : "prikaz",
            "condition"     : "podminka",
            "end"           : "konec",
            "forward"       : "krok",
            "right"         : "vpravo",
            "left"          : "vlevo",
            "placeBrick"    : "poloz",
            "pickBrick"     : "zvedni",
            "placeMark"     : "oznac",
            "pickMark"      : "odznac",
            "do"            : "udelej",
            "times"         : "krat",
            "while"         : "dokud",
            "is"            : "je",
            "isNot"         : "neni",
            "wall"          : "zed",
            "brick"         : "cihla",
            "mark"          : "znacka",
            "vacant"        : "volno",
            "if"            : "kdyz",
            "then"          : "tak",
            "else"          : "jinak",
            "true"          : "pravda",
            "false"         : "nepravda",
            "faster"        : "rychle",
            "slower"        : "pomalu",
            "beep"          : "pip"
        },
        "blocklyCategory" : {
            "base"            : "Základ",
            "functions"       : "Funkce",
            "progFlow"        : "Řízení toku",
            "condition"       : "Podmínky",
            "name"            : "název",
            "userDefinedFunc" : "funkce",
            "userDefinedCond" : "podmínka"
        },
        "checkerErrorMessages" : {
            "numOfWords"    : "numOfWords - špatný počet slov na řádku",
            "notInDef"      : "notInDef - definice v definici",
            "inDef"         : "InDef - příkaz mimo definici",
            "checkActive"   : "checkActive - ",
            "checkKWTimes"  : "checkKWTimes - chybí klíčové slovo \"krát\"",
            "checkNumber"   : "checkNumber - špatně zadané číslo",
            "checkCondPref" : "checkCondPrefix - špatný prefix podmínky",
            "checkNextThen" : "checkNextThen - nenalezeno klíčové slovo \"tak\"",
            "checkExpWords" : "checkExpectedWords - chybí očekávaná slova",
            "checkDef"      : "checkDef - nenalezena definice slova",
        },
        "ACE" : {
            "highlight" : {
                "entity.name.function" : "prikaz|podminka|konec",
                "keyword.control" : "kdyz|tak|jinak|\*kdyz|udelej|\*udelej|dokud|\*dokud|krat",
                "variable.parameter" : "zed|cihla|znacka|je|neni|volno",
                "constant.language" : "pravda|nepravda",
                "support.function": "krok|vlevo|vpravo|oznac|odznac|poloz|zvedni|rychle|pomalu|pip"
            },
            "fold" : {
                "foldStartMarker": /\b(prikaz|podminka)\b/,
                "foldStopMarker": /\bkonec\b/,
                "indentKeywords": {
                    "prikaz": 1,
                    "podminka": 1,
                    "konec": -1,
                }
            }
        }
    };
}

