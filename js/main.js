import {karel} from './source/karel.js';
import * as THREE from './three/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';
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
    mainKarel.draw();
    mainKarel.homeCamera(camera);
    var mainInterpret =  new interpret(editor, mainKarel);

    document.querySelector('#roomCanvas').addEventListener('keydown', function(event) {
        if(mainInterpret.getRunning() == false){
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
 * @param {*} Interpret is the interpret which language pack will be used
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
 * @param {*} langFile is the server path to language file (for example js/source/languages/en.js)
 */
function changeLanguage(langFile){
    import(langFile)
    .then((module) => {
        mainInterpret.languageSetter(module.setLang());
        blocklySetBlockLang(module.setLang());
        workspace.updateToolbox(createBasicToolboxByLang(mainInterpret));
        editor.session.$mode.$highlightRules.setKeywords(mainInterpret.dictionary["ACE"]["highlight"]);
        editor.session.$foldMode.__proto__.foldingStartMarker = mainInterpret.dictionary["ACE"]["fold"]["foldStartMarker"];
        editor.session.$foldMode.__proto__.foldingStopMarker = mainInterpret.dictionary["ACE"]["fold"]["foldStopMarker"];
        editor.session.$foldMode.indentKeywords = mainInterpret.dictionary["ACE"]["fold"]["indentKeywords"];
        editor.session.bgTokenizer.start(0);

        // UI set
        document.querySelector('#mainMenuIcon').title = mainInterpret.dictionary["UI"]["menu"];
        document.querySelector('#languagesIcon').title = mainInterpret.dictionary["UI"]["languages"];
        document.querySelector('#runCode').title = mainInterpret.dictionary["UI"]["run"];
        document.querySelector('#runDebug').title = mainInterpret.dictionary["UI"]["debug"];
        document.querySelector('#stop').title = mainInterpret.dictionary["UI"]["stop"];
        document.querySelector('#openChangeRoomDialog').text = mainInterpret.dictionary["UI"]["changeRoom"];
        document.querySelector('#homeCamera').text = mainInterpret.dictionary["UI"]["homeCamera"];
        document.querySelector('#makeBlocks').text = mainInterpret.dictionary["UI"]["makeBlocks"];
        document.querySelector('#openSaveDialog').text = mainInterpret.dictionary["UI"]["save"];
        document.querySelector('#openLoadDialog').text = mainInterpret.dictionary["UI"]["load"];
        document.querySelector('#resizeRoomDialog').title = mainInterpret.dictionary["UI"]["changeRoomDialog"]["dialogTitle"];
        document.querySelector('#resizeRoomText').textContent = mainInterpret.dictionary["UI"]["changeRoomDialog"]["dialogText"];
        document.querySelector('#xAxisLabel').textContent = mainInterpret.dictionary["UI"]["changeRoomDialog"]["xAxisLabel"]; 
        document.querySelector('#yAxisLabel').textContent = mainInterpret.dictionary["UI"]["changeRoomDialog"]["yAxisLabel"];
        document.querySelector('#room').value = mainInterpret.dictionary["UI"]["changeRoomDialog"]["button"];
        document.querySelector('#saveDialog').title = mainInterpret.dictionary["UI"]["saveDialog"]["dialogTitle"];
        document.querySelector('#saveText').textContent = mainInterpret.dictionary["UI"]["saveDialog"]["dialogText"];
        document.querySelector('#roomSaveLabel').textContent = mainInterpret.dictionary["UI"]["saveDialog"]["roomLabel"];
        document.querySelector('#blocksSaveLabel').textContent = mainInterpret.dictionary["UI"]["saveDialog"]["blocksLabel"];
        document.querySelector('#codeSaveLabel').textContent = mainInterpret.dictionary["UI"]["saveDialog"]["codeLabel"];
        document.querySelector('#saveName').value = mainInterpret.dictionary["UI"]["saveDialog"]["fileName"];
        document.querySelector('#saveButton').value = mainInterpret.dictionary["UI"]["saveDialog"]["button"];
        document.querySelector('#LoadDialog').title = mainInterpret.dictionary["UI"]["loadDialog"]["dialogTitle"];
        document.querySelector('#loadText').textContent = mainInterpret.dictionary["UI"]["loadDialog"]["dialogText"];
        document.querySelector('#loadButton').value = mainInterpret.dictionary["UI"]["loadDialog"]["button"];
    });
}

/**
 * Sets Karel's syntax closer (eg.: *while)
 * @param {*} closer is the closer character
 */
function changeSyntaxCloser(closer){
    mainInterpret.closer = closer;
    blocklySetCloser(closer);
}

// ACE settings
ace.require("ace/ext/language_tools");
var editor = ace.edit("textEditor");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: false,
    mode: 'ace/mode/karel',
    scrollPastEnd: 0.5,
});
editor.setTheme('ace/theme/chrome');
editor.commands.on("afterExec", function (event) {
    if (event.command.name == "insertstring" && /^[\w.]$/.test(event.args)) {
        editor.execCommand("startAutocomplete");
    }
});
editor.on("guttermousedown", function(e) {
    var target = e.domEvent.target; 
    if (target.className.indexOf("ace_gutter-cell") == -1)
        return; 
    if (!editor.isFocused()) 
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
})

// ------------------------------------------------

// Blockly settings
var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv, {toolbox: document.getElementById('toolbox'),
                                            zoom:{
                                                controls: true,
                                                wheel: true,
                                                startScale: 1.0,
                                                maxScale: 3,
                                                minScale: 0.3,
                                                scaleSpeed: 1.2
                                            },
                                            trashcan: true});
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
function myUpdateFunction(event) {
    var code = Blockly.Karel.workspaceToCode(workspace);
    document.getElementById('textArea').value = code;
}
workspace.addChangeListener(myUpdateFunction);

// setting of language
var mainInterpret = start();
changeLanguage('./source/languages/cs.js')

// setting the blockly image listeners for play
var runMeFunc = function (eventpat){
    mainInterpret.nativeCodeInterpretFromBlockly(eventpat.sourceBlock_.inputList[0].fieldRow[2].value_);
  return 0;
};
blocklySetRunMe(runMeFunc);

changeSyntaxCloser('*');
// -----------------------------


// room menu
document.querySelector('#stop').onclick = function() {mainInterpret.turnOffInterpret()};
document.querySelector('#room').onclick = function(){
    mainInterpret.command.karel.resizeRoom(document.getElementById('xVal').value,document.getElementById('yVal').value);
    $('#resizeRoomDialog').dialog('close');
};
document.querySelector('#homeCamera').onclick = function() {mainInterpret.command.karel.homeCamera()};
// blockly menu
document.querySelector('#makeBlocks').onclick = function() {mainInterpret.conversionTest(workspace)};
// code menu
document.querySelector('#runCode').onclick = function() {mainInterpret.nativeCodeInterpretFromEditor()};
document.querySelector('#runDebug').onclick = function() {mainInterpret.nativeCodeDebugInterpretFromEditor()};
// save/load menu
document.querySelector('#saveButton').onclick = function() {
    mainInterpret.saveFile("byChoice", document.getElementById('saveName').value, workspace);
    $('#SaveDialog').dialog('close');
};
document.querySelector('#loadButton').onclick = function() {
    mainInterpret.loadFromFile("byFile", workspace, 'loadFile');
    $('#LoadDialog').dialog('close');
};
document.querySelector('#setCzech').onclick = function() {changeLanguage('./source/languages/cs.js')};
document.querySelector('#setEnglish').onclick = function() {changeLanguage('./source/languages/en.js')};
// main menu items
document.querySelector('#openChangeRoomDialog').onclick = function() {
    $('#resizeRoomDialog').dialog({width: 400});
    document.getElementById('xVal').value = mainInterpret.command.karel.room.roomDataArray.length;
    document.getElementById('yVal').value = mainInterpret.command.karel.room.roomDataArray[0].length;
};
document.querySelector('#openSaveDialog').onclick = function() {$('#SaveDialog').dialog({width: 400});};
document.querySelector('#openLoadDialog').onclick = function() {$('#LoadDialog').dialog({width: 400});};

var TokenIterator = require("ace/token_iterator").TokenIterator;
var tokenizer = new TokenIterator(editor.session, 0, 0);
var firstRun = true;

document.querySelector('#test').onclick = function() { 
    /*
    // make block text representation disappear
    var x = document.getElementById("textArea");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
    */
    /*
    if(firstRun){
        firstRun = false;
        tokenizer.stepForward();
        while(tokenizer.getCurrentToken() !== undefined){
            tokenizer.stepBackward();
        }
        tokenizer.stepForward();
    }
    while(tokenizer.getCurrentToken() !== undefined){
        if(!(/^\s+$/).test(tokenizer.getCurrentToken().value)){
            console.log(tokenizer.getCurrentToken());
        }
        tokenizer.stepForward();
    }
    tokenizer.stepBackward();
    while(tokenizer.getCurrentToken() !== undefined){
        tokenizer.stepBackward();
    }
    tokenizer.stepForward();
    */
    //console.log(editor.session.getBreakpoints());
    mainInterpret.command.karel.test();
};