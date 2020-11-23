export function setLang(){
    return {
        "keywords" : {
            "function"      : "function",
            "condition"     : "condition",
            "end"           : "end",
            "forward"       : "forward",
            "right"         : "right",
            "left"          : "left",
            "placeBrick"    : "place",
            "pickBrick"     : "pick",
            "placeMark"     : "mark",
            "pickMark"      : "unmark",
            "do"            : "do",
            "times"         : "times",
            "while"         : "while",
            "is"            : "is",
            "isNot"         : "not",
            "wall"          : "wall",
            "brick"         : "brick",
            "mark"          : "marked",
            "vacant"        : "vacant",
            "if"            : "if",
            "then"          : "then",
            "else"          : "else",
            "true"          : "true",
            "false"         : "false",
            "faster"        : "faster",
            "slower"        : "slower",
            "beep"          : "beep"
        },
        "blocklyCategory" : {
            "base"              : "Base",
            "functions"         : "Functions",
            "progFlow"          : "Flow control",
            "condition"         : "Conditions",
            "name"              : "name",
            "userDefinedFunc"   : "Function",
            "userDefinedCond"   : "Condition"
        },
        "checkerErrorMessages" : {
            "numOfWords"    : "bad number of words",
            "notInDef"      : "notInDef check failed",
            "inDef"         : "InDef check failed",
            "checkActive"   : "checkActive check failed",
            "checkKWTimes"  : "checkKWTimes check failed",
            "checkNumber"   : "checkNumber check failed",
            "checkCondPref" : "checkCondPrefix check failed",
            "checkNextThen" : "checkNextThen check failed",
            "checkExpWords" : "checkExpectedWords check failed",
            "checkDef"      : "checkDef check failed with word",
        },
        "ACE" : {
            "highlight" : {
                "entity.name.function" : "function|condition|end",
                "keyword.control" : "if|then|else|\*if|do|\*do|while|\*while|times",
                "variable.parameter" : "wall|brick|marked|is|not|vacant",
                "constant.language" : "true|false",
                "support.function": "forward|left|right|mark|unmark|place|pick|faster|slower|beep"
            },
            "fold" : {
                "foldStartMarker": /\b(function|condition)\b/,
                "foldStopMarker": /\bend\b/,
                "indentKeywords": {
                    "function": 1,
                    "condition": 1,
                    "end": -1,
                }
            }
        }
    };
}