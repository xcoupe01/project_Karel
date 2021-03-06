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
            "beep"          : "pip",
            "global"        : "globalni",
            "local"         : "lokalni",
            "variable"      : "promenna"
        },
        "blocklyCategory" : {
            "base"            : "Základ",
            "functions"       : "Funkce",
            "progFlow"        : "Řízení toku",
            "condition"       : "Podmínky",
            "math"            : "Matematika",
            "name"            : "nazev",
            "userDefinedFunc" : "funkce",
            "userDefinedCond" : "podminka",
            "varName"         : "nazev",
        },
        "checkerErrorMessages" : {
            "redefinition": "Redefinice",
            "commandNameError": "Očekával jsem název příkazu",
            "conditionNameError": "Očekával jsem název podmínky",
            "variableNameError": "Očekával jsem název proměnné",
            "definingGlobalInLocal": "Definice globální proměnné ve funkci",
            "definingLocalInGlobal": "Definice lokální proměnné mimo funkci",
            "uncompleteDefinition": "Neúplná definice",
            "undefinedIdentifier": "Nedefinovaný identifikátor",
            "variableExpected": "Očekával jsem proměnnou",
            "assignExpected": "Očekával jsem znamínko `=`",
            "badExpression": "Chybný výraz",
            "undefVarRead": "Čtení nedefinované proměnné",
            "zeroDivisionError": "Dělení nulou",
            "illegalAsign": "Zde nelze přiřadit hodnotu proměnné",
            "oneAsignExpected": "Ve výrazu musí být právě jedno přiřazení",
            "missing": "V definici chybí: ",
            "unexpectedEnd": "Neočekávaný konec",
            "definitionStart": "Očekával jsem začátek definice příkazu, podmínky nebo globální proměnné",
            "commandExpected": "Očekával jsem příkaz",
            "ifEndExpected": "Očekával jsem ukončení struktury kdyz",
            "conditionCoreExpected": "Očekával jsem podmínku",
            "unexpectedWord": ["Neočekávaný výraz - dostal jsem ", " ale očekával jsem "],
            "tokenAliases": {
                "function-def": "definici funkce",
                "condition-def": "definice podmínky",
                "end": "konec definice",
                "user-command": "uživatelský příkaz",
                "user-condition": "uživatelskou podmínku",
                "command": "příkaz",
                "condition": "podmnku",
                "do-start": "začátek konstrukce udelej",
                "times": "klíčové slovo krát",
                "do-end": "konec konstrukce udelej",
                "while-start": "začátek konstukce dokud",
                "while-end": "konec konstrukce dokud",
                "if-start": "začátek konstrukce kdyz",
                "then": "klíčové slovo tak",
                "else": "klíčové slovo jinak",
                "if-end": "konec konstrikce kdyz",
                "condition-prefix": "předponu podmínky",
                "expression": "matematický výraz",
                "output": "výstup",
                "global": "uvození globální proměnné",
                "local": "uvození lokální proměnné",
            },
        },
        "ACE" : {
            "highlight" : {
                "entity.name.function" : "prikaz|podminka|konec",
                "keyword.control" : "kdyz|tak|jinak|\*kdyz|udelej|\*udelej|dokud|\*dokud|krat",
                "variable.parameter" : "zed|cihla|znacka|je|neni|volno",
                "constant.language" : "pravda|nepravda",
                "support.function": "krok|vlevo|vpravo|oznac|odznac|poloz|zvedni|rychle|pomalu|pip|promenna",
                "markup.heading" : "globalni|lokalni"
            },
            "fold" : {
                "foldStartMarker": /prikaz |podminka /,
                "foldStopMarker": /konec /,
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
            "homeCameraButton": "Reset kamery",
            "roomFocusIndicator": "Ovládáš",
            "runningIndicator": "Běží",
            "ACEeditorToggle": "Změň ACE",
            "makeBlocks": "Vytvoř bloky",
            "save": "Ulož",
            "load": "Načti",
            "counter": "Počítadlo",
            "textEditorLabel": "Kód",
            "blocklyEditorLabel": "Bloky",
            "showControls": "Ovládání",
            "resetView": "Reset oken",
            "setWindows": "Nastav okna",
            "speed": "Rychlost",
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
                "fileName": "nazev_souboru",
                "button": "Ulož"
            },
            "loadDialog": {
                "dialogTitle": "Načti práci",
                "dialogText": "Provede načtení zadaného souboru pro načtení uložené pozice.",
                "button": "Načti"
            },
            "varTable": {
                "variables": "Proměnné",
                "names": "Názvy",
                "values": "Hodnoty",
                "scope": "Působnost"
            }
        },
        "consoleLogs": {
            "greetings": "Ahoj, já jsem Karel :)",
            "internaError": "Nastala vnitřní chyba aplikace",
            "logTrue": "Podmínka dopadla pravdou",
            "logFalse": "Podmínka dopadla nepravdou",
            "zeroDivisionError": "Dělení nulou detekováno",
            "undefinedVariableRead": "Čtení z nedefinované proměnné",
            "twoRunningError": "Nemůžu spustit dva programy zaráz",
            "checkErrorsFound": "Během kontroly byly nalezeny chyby, běh přerušen",
            "noSelectedFunction": "Nebyl vybrán program, který bych mohl spustit",
            "blockConversionError": "Nastala chyba během transoformace na bloky",
            "corruptedSaveFile": "Načítaný soubor je poškozený",
            "noFileToLoad": "Nebyl vyrán soubor pro načtení",
            "outOfRoomError": "Nemohu operovat mimo místnost",
            "nothingToPickUpError": "Nemám cihlu, kterou bych zvedl",
            "alreadyMarkedError": "Políčko je již označeno",
            "alreadyUnmarkedError": "Poličko již označeno není",
            "blockAlreadyRemovedError": "Poličko je již odebráno",
            "cannotRemoveBricksError": "Nemohu odstranit políčko, jsou na něm cihly",
            "cannotRemoveMarkError": "Nemohu odstranit políčko, je na něm značka",
            "blockAlreadyPresentError": "Políčko je již v místnoti",
            "cantReachError": "Nedosáhnu na vrchol cihle před sebou",
            "badRoomInputError": "Nemohu vygenerovat tuto místnost, očekávám čísla od 2 do 100",
            "defaultWindowSizeSet": "Nové výchozí velikosti oken nastaveny",
            "translationIdentifierError": "Během překladu byl nalezen identifikátor, který koliduje s klíčovým slovem jazyka",
        }
    };
}