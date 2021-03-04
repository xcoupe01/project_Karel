export function setLang(){
    return {
        "keywords" : {
            "function"      : "function",
            "condition"     : "condition",
            "definition"    : "definition",
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
            "functions"         : "Commands",
            "progFlow"          : "Flow control",
            "condition"         : "Conditions",
            "math"              : "Math",
            "name"              : "name",
            "userDefinedFunc"   : "command",
            "userDefinedCond"   : "condition",
            "setvar"            : "set",
            "defvar"            : "define",
            "variable"          : "variable",
        },
        "checkerErrorMessages" : {
            "unexpectedWord": ["Unexpected expression - i got: ", " but i expected: "],
            "missing": "Missing in definition: ",
            "missingDef": "Missing definition of type ",
            "redefinition": "Redefinition",
            "badUsage": "Badly used function",
            "badUsageNotCondition": "This is not a condition" 
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
        },
        "UI" : {
            "menu": "Menu",
            "languages": "Languages",
            "run": "Run",
            "debug": "Debug",
            "stop": "Stop",
            "changeRoom": "Change Room",
            "homeCameraButton": "Home camera",
            "roomFocusIndicator": "Room focus",
            "runningIndicator": "Running",
            "ACEeditorToggle": "Toggle ACE",
            "makeBlocks": "Make blocks",
            "save": "Save",
            "load": "Load",
            "changeRoomDialog": {
                "dialogTitle": "Change room dimensions",
                "dialogText": "Changes room dimensions in X and Y axis. The currenct room will be erased and replaced with the new one with the specified dimensions.",
                "xAxisLabel": "X axis",
                "yAxisLabel": "Y axis",
                "button": "Change"
            },
            "saveDialog": {
                "dialogTitle": "Save work",
                "dialogText": "Creates and downloads save of the app state. Lower you can select what will be saved.",
                "roomLabel": "Room",
                "blocksLabel": "Blocks",
                "codeLabel": "Code",
                "fileName": "karel_save",
                "button": "Save"
            },
            "loadDialog": {
                "dialogTitle": "Load work",
                "dialogText": "Loads given file with save position.",
                "button": "Load"
            }
        }
    };
}