// Karel core for Karel project for VUT FIT university and Gymnasium Šlapanice
// Three.js - Load .OBJ - ?
// from https://threejsfundamentals.org/threejs/threejs-load-obj-wat.html

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
    const far = 100;
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

// ACE settings
ace.require("ace/ext/language_tools");
var editor = ace.edit("textEditor");
//editor.setTheme("ace/theme/github");
//editor.getSession().setMode("ace/mode/text");
//editor.setTheme("ace/theme/tommorrow");
editor.getSession().setMode("ace/mode/karel");
/* future upgrade
editor.setTheme("ace/chrome");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: false
});
*/
//document.getElementById('deska').onkeydown = function(e) { 
// ------------------------------------------------


// Blockly settings
var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv,
    {toolbox: document.getElementById('toolbox')});
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
onresize();
Blockly.svgResize(workspace);

// setting block listener
function myUpdateFunction(event) {
    var code = Blockly.Karel.workspaceToCode(workspace);
    document.getElementById('textArea').value = code;
}
workspace.addChangeListener(myUpdateFunction);
// -----------------------------

// setting of language
var mainInterpret = start();
import('./source/languages/cs.js')
    .then((module) => {
        mainInterpret.languageSetter(module.setLang());
        blocklySetBlockLang(module.setLang());
});

// setting the blockly image listeners for play
var runMeFunc = function (eventpat){
    mainInterpret.nativeCodeInterpretFromBlockly(eventpat.sourceBlock_.inputList[0].fieldRow[2].value_);
  return 0;
};
blocklySetRunMe(runMeFunc);

document.querySelector('#runCode').onclick = function() {mainInterpret.nativeCodeInterpretFromEditor()};
document.querySelector('#runDebug').onclick = function() {mainInterpret.nativeCodeDebugInterpretFromEditor();};
document.querySelector('#stop').onclick = function() {mainInterpret.stopExecuting()};
document.querySelector('#room').onclick = function(){mainInterpret.karel.resizeRoom(document.getElementById('xVal').value,document.getElementById('yVal').value)};
document.querySelector('#homeCamera').onclick = function() {mainInterpret.karel.homeCamera()};
document.querySelector('#makeBlocks').onclick = function() {mainInterpret.conversionTest(workspace);};
document.querySelector('#test').onclick = function() { 
    
    // make block text representation disappear
    
    var x = document.getElementById("textArea");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
    
    /*
   //way to change languages 
   import('./source/languages/en.js')
    .then((module) => {
        mainInterpret.languageSetter(module.setLang());
        blocklySetBlockLang(module.setLang());
    });
    */

/*
    var mainBlock = workspace.newBlock("base_function");
    mainBlock.initSvg();
    mainBlock.render();
    for(var i = 0; i < 3; i++){
        var newBlock = workspace.newBlock("function_step");
        newBlock.initSvg();
        newBlock.render();
        mainBlock.getInput('INNER_CODE').connection.connect(newBlock.previousConnection);
    }
   */

   
    //mainInterpret.conversionTest(workspace);
};
