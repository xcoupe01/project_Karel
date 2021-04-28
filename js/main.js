import {karel} from './source/karel.js';
import * as THREE from './three/three.module.js';
import {OrbitControls} from './three/OrbitControls.js';
import {interpret} from './source/interpret.js';

/**
 * Starting function, that creates the main structures and generate the main objects of the app
 * sets camera scene ect
 */
function start() {
    const canvas = document.querySelector('#roomCanvas');
    const renderer = new THREE.WebGLRenderer({canvas});

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    const controls = new OrbitControls(camera, canvas);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('gray'); 

    var mainKarel = new karel(scene, controls);
    mainKarel.draw(tryLoad);
    mainKarel.homeCamera(camera);
    var mainInterpret =  new interpret(editor, blocklyReader, mainKarel);

    document.querySelector('#roomCanvas').addEventListener('keydown', function(event) {
        if(!mainInterpret.getRunning()){
            if(event.keyCode == 87){
                mainKarel.goForward();
            }
            else if(event.keyCode == 68){
                mainKarel.turnRight();
            }
            else if(event.keyCode == 65){
                mainKarel.turnLeft();
            }
            else if(event.keyCode == 80){
                mainKarel.placeBrick();
            }
            else if(event.keyCode == 90){
                mainKarel.pickUpBrick();
            }
            else if(event.keyCode == 79){
                mainKarel.markSwitch();
            }
            else if(event.keyCode == 73){
                mainKarel.toggleRoomBlock();
            }
        }
    });

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

  requestAnimationFrame(render);
  return mainInterpret;
}

/**
 * Creates basic tool box in blockly environment while using given language pack assigned to interpret
 * @param {Interpret Object} Interpret is the interpret which language pack will be used
 * @returns Json ready for blocky toolbox
 */
function createBasicToolboxByLang(Interpret){
    var template = {
        "base" : [
            "0",
            [
                "base_function", 
                "base_condition"
            ]
        ],
        "functions" : [
            "90" , 
            [
                "function_step", 
                "function_right", 
                "function_left", 
                "function_place", 
                "function_pick", 
                "function_placemark", 
                "function_unmark", 
                "function_true", 
                "function_false", 
                "function_faster",
                "function_slower",
                "function_beep",
                "function_userDefined"
            ]
        ],
        "progFlow" : [
            "180",
            [
                "control_repeat",
                "control_while",
                "control_if",
                "control_ifelse"
            ]
        ],
        "condition" : [
            "270", 
            [
                "condition_brick",
                "condition_wall",
                "condition_mark",
                "condition_vacant",
                "condition_userdefined"
            ]
        ],
        "math": [
            "230",
            [
                "math_number",
                "math_variable",
                "math_operators",
                "math_compare",
                "math_brackets",
                "math_global_var",
                "math_local_var"
            ]
        ] 
    };
    var returnJson = {
        "kind" : "categoryToolbox",
        "contents":[]
    };
    var index = 0;
    for (var key in template){
        returnJson["contents"].push({
            "kind" : "category",
            "name" : Interpret.dictionary["blocklyCategory"][key],
            "colour" : template[key][0],
            "contents" : []
        });
        for(var i = 0; i < template[key][1].length; i++){
            returnJson["contents"][index]["contents"].push({
                "kind" : "block",
                "type" : template[key][1][i]
            })
        }
        index ++;
    };
    return returnJson;
}

/**
 * Changes language of the application by given language file
 * @param {string} langFile is the server path to language file (for example js/source/languages/en.js)
 * @param firstRun true if we don't want to do translation of code, false otherwise
 */
function changeLanguage(langFile, firstRun){
    window.localStorage.setItem('language', langFile);
    langFile = './source/languages/' + langFile + '.js';
    import(langFile)
    .then((module) => {
        var codeArray;
        if(!firstRun){
            codeArray = mainInterpret.nativeCodeTokenizer(mainInterpret.textEditor, false);
        } 
        mainInterpret.languageSetter(module.setLang());
        window.dictionary = mainInterpret.dictionary["consoleLogs"];
        karelConsoleClear();
        karelConsoleLog("greetings");
        if(!firstRun){
            mainInterpret.textEditor.setValue(mainInterpret.tokensToStringConvertor(mainInterpret.translate(codeArray)));
            mainInterpret.textEditor.clearSelection();
        }
        blocklySetBlockLang(module.setLang());
        setBlocklyMessageLang(langFile.substring(19, 21));
        workspace.updateToolbox(createBasicToolboxByLang(mainInterpret));
        editor.session.$mode.$highlightRules.setKeywords(mainInterpret.dictionary["ACE"]["highlight"]);
        blocklyReader.session.$mode.$highlightRules.setKeywords(mainInterpret.dictionary["ACE"]["highlight"]);
        editor.session.$foldMode.__proto__.foldingStartMarker = mainInterpret.dictionary["ACE"]["fold"]["foldStartMarker"];
        editor.session.$foldMode.__proto__.foldingStopMarker = mainInterpret.dictionary["ACE"]["fold"]["foldStopMarker"];
        editor.session.$foldMode.indentKeywords = mainInterpret.dictionary["ACE"]["fold"]["indentKeywords"];
        editor.session.$mode.indentKeywords = mainInterpret.dictionary["ACE"]["indentation"]["indentKeywords"];
        editor.session.$mode.outdentKeywords = mainInterpret.dictionary["ACE"]["indentation"]["outdentKeywords"];
        editor.session.bgTokenizer.start(0);
        blocklyReader.session.bgTokenizer.start(0);

        // UI set
        document.querySelector('#mainMenuIcon').title = mainInterpret.dictionary["UI"]["menu"];
        document.querySelector('#languagesIcon').title = mainInterpret.dictionary["UI"]["languages"];
        document.querySelector('#runCode').title = mainInterpret.dictionary["UI"]["run"];
        document.querySelector('#runDebug').title = mainInterpret.dictionary["UI"]["debug"];
        document.querySelector('#stop').title = mainInterpret.dictionary["UI"]["stop"];
        document.querySelector('#openChangeRoomDialog').text = mainInterpret.dictionary["UI"]["changeRoom"];
        document.querySelector('#homeCameraButton').textContent = mainInterpret.dictionary["UI"]["homeCameraButton"];
        document.querySelector('#controlIndicator').textContent = mainInterpret.dictionary["UI"]["roomFocusIndicator"];
        document.querySelector('#runIndicator').textContent = mainInterpret.dictionary["UI"]["runningIndicator"];  
        document.querySelector('#makeBlocks').text = mainInterpret.dictionary["UI"]["makeBlocks"];
        document.querySelector('#openSaveDialog').text = mainInterpret.dictionary["UI"]["saveToPC"];
        document.querySelector('#openLoadDialog').text = mainInterpret.dictionary["UI"]["loadFromPC"];
        $('#resizeRoomDialog').dialog({title: mainInterpret.dictionary["UI"]["changeRoomDialog"]["dialogTitle"]}).dialog('close');
        document.querySelector('#resizeRoomText').textContent = mainInterpret.dictionary["UI"]["changeRoomDialog"]["dialogText"];
        document.querySelector('#xAxisLabel').textContent = mainInterpret.dictionary["UI"]["changeRoomDialog"]["xAxisLabel"]; 
        document.querySelector('#yAxisLabel').textContent = mainInterpret.dictionary["UI"]["changeRoomDialog"]["yAxisLabel"];
        document.querySelector('#room').textContent = mainInterpret.dictionary["UI"]["changeRoomDialog"]["button"];
        $('#SaveDialog').dialog({title: mainInterpret.dictionary["UI"]["saveDialog"]["dialogTitle"]}).dialog('close');
        document.querySelector('#saveText').textContent = mainInterpret.dictionary["UI"]["saveDialog"]["dialogText"];
        document.querySelector('#roomSaveLabel').textContent = mainInterpret.dictionary["UI"]["saveDialog"]["roomLabel"];
        document.querySelector('#blocksSaveLabel').textContent = mainInterpret.dictionary["UI"]["saveDialog"]["blocksLabel"];
        document.querySelector('#codeSaveLabel').textContent = mainInterpret.dictionary["UI"]["saveDialog"]["codeLabel"];
        document.querySelector('#saveName').value = mainInterpret.dictionary["UI"]["saveDialog"]["fileName"];
        document.querySelector('#saveButton').textContent = mainInterpret.dictionary["UI"]["saveDialog"]["button"];
        $('#LoadDialog').dialog({title: mainInterpret.dictionary["UI"]["loadDialog"]["dialogTitle"]}).dialog('close');
        document.querySelector('#loadText').textContent = mainInterpret.dictionary["UI"]["loadDialog"]["dialogText"];
        document.querySelector('#loadButton').textContent = mainInterpret.dictionary["UI"]["loadDialog"]["button"];
        document.querySelector('#showTextCodeTitle').textContent = mainInterpret.dictionary["UI"]["textEditorLabel"];
        document.querySelector('#showBlocklyCodeTitle').textContent = mainInterpret.dictionary["UI"]["blocklyEditorLabel"];
        document.querySelector('#resetView').textContent = mainInterpret.dictionary["UI"]["resetView"];
        document.querySelector('#showControls').textContent = mainInterpret.dictionary["UI"]["showControls"];
        document.querySelector('#resetConsole').textContent = mainInterpret.dictionary["UI"]["resetConsole"];
        document.querySelector('#setWindows').textContent = mainInterpret.dictionary["UI"]["setWindows"];
        document.querySelector('#speedSetterWrapper').title = mainInterpret.dictionary["UI"]["speed"];
        document.querySelector('#deleteAllBreakpoints').text = mainInterpret.dictionary["UI"]["removeBreakpoints"];
        document.querySelector('#autocompleteLabel').textContent = mainInterpret.dictionary["UI"]["autocompleteToggle"];
        document.querySelector('#autoindentLabel').textContent = mainInterpret.dictionary["UI"]["autoindentToggle"];
        document.querySelector('#interpretMovesCursorLabel').textContent = mainInterpret.dictionary["UI"]["moveCursor"];
        document.querySelector('#loadFromCloud').text = mainInterpret.dictionary["UI"]["loadFromCloud"];
        document.querySelector('#saveToCloud').text = mainInterpret.dictionary["UI"]["saveToCloud"];
        $('#LoadFromCloudDialog').dialog({title: mainInterpret.dictionary["UI"]["LoadFromCloudDialog"]["dialogTitle"]}).dialog('close');
        $('#SaveToCloudDialog').dialog({title: mainInterpret.dictionary["UI"]["SaveToCloudDialog"]["dialogTitle"]}).dialog('close');
        document.querySelector('#loadCloudText').textContent = mainInterpret.dictionary["UI"]["LoadFromCloudDialog"]["dialogText"];
        document.querySelector('#saveCloudText').textContent = mainInterpret.dictionary["UI"]["SaveToCloudDialog"]["dialogText"];
        document.querySelector('#saveCloudButton').value = mainInterpret.dictionary["UI"]["SaveToCloudDialog"]["saveButton"];

        mainInterpret.updateVariableOverview();
        blocklyUpdateFunction();
        mainInterpret.lockBlocklyTextEditor = true;
        workspace.clear();
        mainInterpret.makeBlocksFromNativeCode(workspace, mainInterpret.nativeCodeTokenizer(mainInterpret.blocklyTextRepresentation, false));
        mainInterpret.lockBlocklyTextEditor = false;
    });
}

/**
 * Sets Karel's syntax closer (eg.: *while)
 * @param {character} closer is the closer character
 */
function changeSyntaxCloser(closer){
    mainInterpret.closer = closer;
    blocklySetCloser(closer);
}

/**
 * manages breakpoint addition and deletion update
 * @param {event} e 
 */
function manageBreakpoint(e) {
    var target = e.domEvent.target; 
    if (target.className.indexOf("ace_gutter-cell") == -1)
        return; 
    if (!e.editor.isFocused()) 
        return; 
    //console.log(e.clientX > 25 + target.getBoundingClientRect().left);
    //console.log(e.clientX, 25 + target.getBoundingClientRect().left);
    if (e.clientX > 25 + target.getBoundingClientRect().left) 
        return; 
    var breakpoints = e.editor.session.getBreakpoints(row, 0);
    var row = e.getDocumentPosition().row;
    if(typeof breakpoints[row] === typeof undefined)
        e.editor.session.setBreakpoint(row);
    else
        e.editor.session.clearBreakpoint(row);
    e.stop();
}

/** 
 * This is called after the Karel Graphics is ready and tries to load
 * example if it is in URL otherwise it does nothing
 */ 
function tryLoad() {
    if(mainInterpret.dictionary.keywords === undefined){
    	setTimeout(tryLoad, 500);
        return;
    }
    if (window.location.href.indexOf("?")>0){
        var exercise=window.location.href.substring(window.location.href.indexOf("?")+1);
        $.ajax({
            type: 'GET',
            url: 'index.php?f=json&prid='+exercise,
            timeout: 2000,
            success: function(data) {
                /* data is a json message */
                if (typeof data['Err'] !== typeof undefined){
                    console.log(data['Err']);
                }else{
                    mainInterpret.loadFromJSON(data,workspace);
                }  
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Timeout contacting server..');
            }
        });
    } else if(window.localStorage.getItem("onUnload") != "undefined"){
        mainInterpret.loadFromJSON(JSON.parse(window.localStorage.getItem("onUnload")), workspace);
    }
};

function processLoad(slabel){
    $.ajax({
        type: 'GET',
        url: 'index.php?f=json&slabel='+slabel,
        timeout: 2000,
        success: function(data) {
            /* data is a json message */
            //var data = JSON.parse(data);
            if (typeof data['Err'] !== typeof undefined){
                $("#ListFromCloud").html(data['Err']);
            } else {
                console.log(data);
                mainInterpret.loadFromJSON(data,workspace);
            }  
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $("#ListFromCloud").html('Timeout contacting server..');
        }
    });
}

/*---------------------------------------------------------------------------*/

// ACE settings - editor
ace.require("ace/ext/language_tools");
var editor = ace.edit("textEditor");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: false,
    mode: 'ace/mode/karel',
    scrollPastEnd: 0.5,
    fixedWidthGutter: true,
});
var autocompleteEnabled = true;
editor.setTheme('ace/theme/chrome');
editor.commands.on("afterExec", function (event) {
    if (event.command.name == "insertstring" && /^[\w.]$/.test(event.args) && autocompleteEnabled) {
            editor.execCommand("startAutocomplete");
    }
});
editor.on("guttermousedown", function (event) {manageBreakpoint(event)});

// ACE settings - blockly reader
var blocklyReader = ace.edit("blocklyReader");
blocklyReader.setOptions({
    mode: 'ace/mode/karel',
    readOnly: true,
    fixedWidthGutter: true,
});
blocklyReader.setTheme('ace/theme/chrome');
blocklyReader.on("guttermousedown", function (event) {manageBreakpoint (event)});

// ------------------------------------------------

// Blockly settings
var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv, {
    toolbox: document.getElementById('toolbox'),
    zoom:{
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
    },
    trashcan: true}
);
var onresize = function(e) {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    var element = blocklyArea;
    var x = 0;
    var y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
    Blockly.svgResize(workspace);
};
window.addEventListener('resize', onresize, false);
document.getElementById('blocklyArea').addEventListener('resize', onresize, false);
onresize();
Blockly.svgResize(workspace);
Blockly.onresize=onresize;

// setting block listener
function blocklyUpdateFunction() {
    if(!mainInterpret.lockBlocklyTextEditor){
        blocklyReader.setValue("");
        blocklyReader.setValue(Blockly.Karel.workspaceToCode(workspace));
        blocklyReader.clearSelection();
    }
}
workspace.addChangeListener(blocklyUpdateFunction);

// setting of language
var mainInterpret = start();
if(window.localStorage.getItem('language') != undefined){
    changeLanguage(window.localStorage.getItem('language'), true);
} else {
    changeLanguage('cs', true);
}

// setting the blockly image listeners for play
var runMeFunc = function (eventpath){
    mainInterpret.blocklyEditorInterpret(eventpath.sourceBlock_.inputList[0].fieldRow[2].value_);
  return 0;
};
blocklySetRunMe(runMeFunc);

changeSyntaxCloser('*');

// ----------------------------- UI set

// room dialog
document.querySelector('#room').onclick = function(){
    mainInterpret.command.karel.resizeRoom(document.getElementById('xVal').value,document.getElementById('yVal').value);
    $('#resizeRoomDialog').dialog('close');
};

// save dialog
document.querySelector('#saveButton').onclick = function() {
    mainInterpret.saveFile("byChoice", document.getElementById('saveName').value, workspace);
    $('#SaveDialog').dialog('close');
};

// load dialog
document.querySelector('#loadButton').onclick = function() {
    mainInterpret.loadFromFile("byFile", workspace, 'loadFile');
    $('#LoadDialog').dialog('close');
};

// languages menu
document.querySelector('#setCzech').onclick = function() {
    changeLanguage('cs', false);
    document.querySelector('#setCzech').blur();
};
document.querySelector('#setEnglish').onclick = function() {
    changeLanguage('en', false);
    document.querySelector('#setEnglish').blur();
};

// navbar items
document.querySelector('#runCode').onclick = function() {
    if(document.querySelector('#textEditor').style.display == "none"){
        mainInterpret.textEditorInterpret(blocklyReader);
    } else {
        mainInterpret.textEditorInterpret(editor);
    }
};
document.querySelector('#runDebug').onclick = function() {
    if(document.querySelector('#textEditor').style.display == "none"){
        mainInterpret.debugTextEditorInterpret(blocklyReader);
    } else {
        mainInterpret.debugTextEditorInterpret(editor);
    }
};
document.querySelector('#stop').onclick = function() {mainInterpret.turnOffInterpret()};

// main menu items
document.querySelector('#openChangeRoomDialog').onclick = function() {
    $('#resizeRoomDialog').dialog({width: 400});
    document.getElementById('xVal').value = mainInterpret.command.karel.room.roomDataArray.length;
    document.getElementById('yVal').value = mainInterpret.command.karel.room.roomDataArray[0].length;
    document.querySelector('#openChangeRoomDialog').blur();
};
document.querySelector('#openSaveDialog').onclick = function() {
    $('#SaveDialog').dialog({width: 400});
    document.querySelector('#openSaveDialog').blur();
};
document.querySelector('#openLoadDialog').onclick = function() {
    $('#LoadDialog').dialog({width: 400});
    document.querySelector('#openLoadDialog').blur();
};

document.querySelector('#loadFromCloud').onclick = function() {
    function getSavesTable (data){
        if(data.length > 0){
            var s='<table style="width: 100%">';
            for(var i = 0; i < data.length; i++){
                s += '<tr><td><span id="slabel' + i + '" style="color:red; cursor: pointer">' +
                data[i]["SLABEL"] + '</span></td><td>' + data[i]["TEXTTIME"] + "</td></tr>";
            }
            s += '</table>'
            $("#ListFromCloud").html(s);
            for(var i = 0; i < data.length; i++){
                document.querySelector('#slabel' + i).onclick = function() {
                processLoad(this.innerHTML);
                };
            }
        } else {
            $("#ListFromCloud").html(mainInterpret.dictionary["UI"]["LoadFromCloudDialog"]["noAvalibleSaves"])
        }
    }
    $('#LoadFromCloudDialog').dialog({width: 400});
    $.ajax({
        type: 'GET',
        url: 'index.php?f=json',
        timeout: 2000,
        success: function(data){  getSavesTable(data);},
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $("#ListFromCloud").html('Timeout contacting server..');
        }
    });
};

document.querySelector('#saveToCloud').onclick = function() {
    function getSavesTable (data){
        if(data.length > 0){
            var s='<table style="width: 100%">';
            for(var i = 0; i < data.length; i++){
                s += '<tr><td><span id="savelabel' + i + '" style="color:blue; cursor: pointer">' +
                data[i]["SLABEL"] + '</span></td><td>' + data[i]["TEXTTIME"] + "</td></tr>";
            }
            s += '</table>'
            $("#listOfSaves").html(s);
            for(var i = 0; i < data.length; i++){
                document.querySelector('#savelabel' + i).onclick = function() {
                    document.querySelector('#slabel').value = (this.innerHTML);
                };
            }
        } else {
            $("#listOfSaves").html(mainInterpret.dictionary["UI"]["LoadFromCloudDialog"]["noAvalibleSaves"])
        }
    }
    $.ajax({
        type: 'GET',
        url: 'index.php?f=json',
        timeout: 2000,
        success: function(data){  getSavesTable(data);},
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $("#listOfSaves").html('Timeout contacting server..');
        }
    });
    $('#SaveToCloudDialog').dialog({width: 400});
    /* fill the hidden input with the JSON to store*/
    var saveJson = {};
    saveJson["karelAndRoom"] = mainInterpret.command.karel.saveRoomWithKarel();
    saveJson["blockly"] = Blockly.Karel.workspaceToCode(workspace);
    saveJson["code"] = mainInterpret.textEditor.getValue();
    saveJson["lang"] = localStorage['language'];
    $('#ssource').val(JSON.stringify(saveJson)); 
};

document.querySelector('#saveCloudButton').onclick=function(){
    /* lets post the data to the server */
    fetch("index.php?f=json&slabel=" + $('#slabel').val() + '&store=1', {
            method: "POST", 
            body: $('#ssource').val()
        }).then(res => {
            $('#saveCloudResponse').html(mainInterpret.dictionary["UI"]["SaveToCloudDialog"]["saveComplete"]);
            function getSavesTable (data){   
                var s='<table style="width: 100%">';
                for(var i = 0; i < data.length; i++){
                    s += '<tr><td><span id="savelabel' + i + '" style="color:blue; cursor: pointer">' +
                    data[i]["SLABEL"] + '</span></td><td>' + data[i]["TEXTTIME"] + "</td></tr>";
                }
                s += '</table>'
                $("#listOfSaves").html(s);
                for(var i = 0; i < data.length; i++){
                    document.querySelector('#savelabel' + i).onclick = function() {
                        document.querySelector('#slabel').value = (this.innerHTML);
                    };
                }
            }
            $.ajax({
                type: 'GET',
                url: 'index.php?f=json',
                timeout: 2000,
                success: function(data){  getSavesTable(data);},
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $("#ListFromCloud").html('Timeout contacting server..');
                }
            });
            document.querySelector('#slabel').value = "";
        }
    );
};

// quick status bar
document.querySelector('#homeCameraButton').onclick = function() {mainInterpret.command.karel.homeCamera()};
document.querySelector('#showControls').onclick = function() {
    if(document.querySelector('#controlButtons').style.display == "none"){
        document.querySelector('#controlButtons').style.display = "flex";
    } else {
        document.querySelector('#controlButtons').style.display = "none";
    }
}

// speed slider
function setSpeed(value){
    document.querySelector('#speedSlider').value = value;
    document.querySelector('#speedNumber').value = value;
    mainInterpret.command.setSpeed(value);
};
document.querySelector('#speedSlider').oninput = function(){setSpeed(document.querySelector('#speedSlider').value)};
document.querySelector('#speedNumber').addEventListener("change", function(){setSpeed(document.querySelector('#speedNumber').value)});
setSpeed(80);

// controls
document.querySelector('#control-left').onclick = function() {
    if(!mainInterpret.getRunning()){
        mainInterpret.command.karel.turnLeft();
    }
};
document.querySelector('#control-forward').onclick = function() {
    if(!mainInterpret.getRunning()){
        mainInterpret.command.karel.goForward();
    }
};
document.querySelector('#control-right').onclick = function() {
    if(!mainInterpret.getRunning()){
        mainInterpret.command.karel.turnRight();
    }
};
document.querySelector('#control-place').onclick = function() {
    if(!mainInterpret.getRunning()){
        mainInterpret.command.karel.placeBrick();
    }
};
document.querySelector('#control-pick').onclick = function() {
    if(!mainInterpret.getRunning()){
        mainInterpret.command.karel.pickUpBrick();
    }
};
document.querySelector('#control-mark').onclick = function() {
    if(!mainInterpret.getRunning()){
        mainInterpret.command.karel.markSwitch();
    }
};
document.querySelector('#control-delete').onclick = function() {
    if(!mainInterpret.getRunning()){
        mainInterpret.command.karel.toggleRoomBlock();
    }
};

// code tab selector
document.querySelector('#showTextCode').onclick = function() {
    document.getElementById('showBlocklyCode').style.backgroundColor = 'var(--bg-terciary)';
    document.getElementById('showBlocklyCode').style.color = 'var(--bg-secondary)';
    document.getElementById('showTextCode').style.backgroundColor = 'var(--bg-secondary)';
    document.getElementById('showTextCode').style.color = 'var(--text-primary)';
    document.getElementById('blocklyReader').style.display = 'none';
    document.getElementById('textEditor').style.display = 'block';
    editor.renderer.updateFull();
};
document.querySelector('#showBlocklyCode').onclick = function(){
    document.getElementById('showTextCode').style.backgroundColor = 'var(--bg-terciary)';
    document.getElementById('showTextCode').style.color = 'var(--bg-secondary)';
    document.getElementById('showBlocklyCode').style.backgroundColor = 'var(--bg-secondary)';
    document.getElementById('showBlocklyCode').style.color = 'var(--text-primary)';
    document.getElementById('textEditor').style.display = 'none';
    document.getElementById('blocklyReader').style.display = 'block';
    blocklyReader.renderer.updateFull();
};

// code settings
document.querySelector('#makeBlocks').onclick = function() {mainInterpret.textToBlocklyConvertor(workspace)};
document.querySelector('#deleteAllBreakpoints').onclick = function() {
    if(document.querySelector('#textEditor').style.display == "block"){
        editor.session.clearBreakpoints();
    } else {
        blocklyReader.session.clearBreakpoints();
    }
};
document.querySelector('#autocompleteCheckbox').addEventListener('change', function (event){
    if(event.currentTarget.checked){
        autocompleteEnabled = true;
    } else {
        autocompleteEnabled = false;
    }
});
document.querySelector('#autoindentCheckbox').addEventListener('change', function (event){
    if(event.currentTarget.checked){
        editor.session.$mode.indentationHelperOn = true;
    } else {
        editor.session.$mode.indentationHelperOn = false;
    }
});
document.querySelector('#interpretMoveCursorCheckbox').addEventListener('change', function (event){
    if(event.currentTarget.checked){
        mainInterpret.moveCursor = true;
    } else {
        mainInterpret.moveCursor = false;
    }
});

// room overlay
document.querySelector('#counterDisplay').onclick = function() {mainInterpret.resetCounter()};
document.querySelector('#runIndicator').onclick = function() {mainInterpret.turnOffInterpret()};

document.querySelector('#resetConsole').onclick = function() {document.querySelector('#console').innerHTML = ""};

window.onbeforeunload = function(){
    window.localStorage.setItem("onUnload", JSON.stringify(mainInterpret.createSaveFileText("all", workspace)));
}


$.ajax({
        type: 'GET',
        url: 'index.php?f=json&__ACCOUNT=1',
        timeout: 2000,
        success: function(data) {
           if(data['Account'] == ''){
             document.querySelector('#loadFromCloud').style.display='none';
             document.querySelector('#saveToCloud').style.display='none';
           }
        }
    }
);        


