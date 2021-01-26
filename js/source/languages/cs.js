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
        },
        "UI" : {
            "menu": "Menu",
            "languages": "Jazyky",
            "run": "Spusť",
            "debug": "Krokuj",
            "stop": "Zastav",
            "changeRoom": "Změň místnost",
            "homeCamera": "Resetuj kameru",
            "makeBlocks": "Vytvoř bloky",
            "save": "Ulož",
            "load": "Načti",
            "changeRoomDialog": {
                "dialogTitle": "Změň rozměry místnosti",
                "dialogText": "Umožňuje změnu rozměrů místnosti. Níže zadejte požadované rozměry místnosti v ose X a ose Y, Tlačítkem 'Změň' bude současná místnost smazána a vytvořena nová se zadanými rozměry.",
                "xAxisLabel": "Osa X",
                "yAxisLabel": "Osa Y",
                "button": "Změň"
            },
            "saveDialog": {
                "dialogTitle": "Ulož práci",
                "dialogText": "Uloží současný stav aplikace. Níže můžete zvolit, co vše bude uloženo a vybrat název souboru. Po kliknutí na tlačítko 'Ulož' bude tento sobor uložen do počítače.",
                "roomLabel": "Místnost",
                "blocksLabel": "Bloky",
                "codeLabel": "Kód",
                "fileName": "karel_save",
                "button": "Ulož"
            },
            "loadDialog": {
                "dialogTitle": "Načti práci",
                "dialogText": "Provede načtení zadaného souboru pro načtení uložené pozice.",
                "button": "Načti"
            }
        }
    };
}

