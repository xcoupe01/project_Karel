<html>
    <head>
        <title>Karel 3D</title>
        <!--<link rel="stylesheet" href="css/main.css"/>-->
        <script type="text/javascript" src="js/split/split.min.js"></script>
        <link rel="stylesheet" href="css/split.css"/>
        <meta charset="utf-8"/>
    </head>
    <body>
    <div id="row1" class="split"> 
        <div id="a" class="split split-horizontal">
            <div class="content">
                <canvas id="roomCanvas" style="height:100%; width:100%;"></canvas>
            </div>
        </div>
    
        <div id="b" class="split split-horizontal"> 
            <div class="content" >
                <div id="blocklyArea" style="position: relative;  width: 100%; height:100%; ">
                    <div id="blocklyDiv" style="width:100%;"></div>
                </div>  
            </div> 
        </div>
        <div id="c" class="split split-horizontal">
            <div class="content">
                <div id="textEditor" style="height:100%"><?php include('saves/initial_test_save.txt'); ?></object></div>
            </div>
        </div>  
    </div>

    <div id="row2" class="split"> 
        <div id="roomButton">
            <input type="button" value="stop" id="stop">
            <br>
            <label for="xVal">X value</label>
            <input type="text" name="xVal" id="xVal">
            <br>
            <label for="yVal">Y value</label>
            <input type="text" name="yVal" id="yVal">
            <input type="button" value="room" id="room">
            <br>
            <input type="button" value="home camera" id="homeCamera">
        </div>
        <div id="blocklyButton">
            <input type="button" value="make blocks" id="makeBlocks">
        </div>
        <div id="textButton">
            <input type="button" value="run code" id="runCode">
            <input type="button" value="run debug" id="runDebug">
        </div>
        <!-- save/load menu -->
        <div id="saveLoadMenu">
            <div id="save">
                <label>room</label>
                <input type="checkbox" id="roomSaveCheckbox" checked>
                <br>
                <label>blocks</label>
                <input type="checkbox" id="blocksSaveCheckbox" checked>
                <br>
                <label>code</label>
                <input type="checkbox" id="codeSaveCheckbox" checked>
                <br>
                <input type="text" value="file_name" id="saveName">
                <input type="button" value="save" id="saveButton">
            </div>
            <div id="load">
                <input type="file" id="loadFile">
                <input type="button" value="load" id="loadButton">
                <br>
                <input type="button" value="test" id="test">
                <br>
                <textarea id="textArea" style="display:none"></textarea>
                <input type="file" id="initialLoad" style="display: none;" enctype="multipart/form-data">
            </div>
            <div id="language">
                <input type="button" value="Čeština" id="setCzech">
                <input type="button" value="English" id="setEnglish">
            </div>
        </div>
    </div>

    <!-- ace settings - best works here -->
    <script src="js/ace/ace.js" charset="utf-8"></script>
    <script src="js/ace/ext-language_tools.js"></script>

    <!-- blockly settings -->
    <script src="js/blockly/blockly_compressed.js"></script>
    <script src="js/blockly/karel_blocks.js"></script>
    <script src="js/blockly/karel_blocks_generator.js"></script>
    <script src="js/blockly/msg/js/en.js"></script>

    <div id="blocklyToolBox">
        <xml id="toolbox" style="display: none">
            <category name="NULL">
            </category>
        </xml>
    </div>

    <script type="module" src="js/main.js"></script>

    <script type="text/javascript">
        Split(['#a','#b','#c'], {
        /*elementStyle: function (dimension, size, gutterSize) { 
            $(window).trigger('resize'); // Optional
            return {'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)'}
        },
        gutterStyle: function (dimension, gutterSize) { return {'flex-basis':  gutterSize + 'px'} },
        */
            gutterSize: 8,
            cursor: 'col-resize',
            minSize: [1, 1, 1],
            sizes:[25,50,25],
            onDrag: function(){Blockly.onresize();}
        });

        Split(['#row1', '#row2'], {
            gutterSize: 8,
            cursor: 'row-resize',
            direction: 'vertical',
            sizes: [70, 30],
            minSize: [1, 1],
            onDrag: function(){Blockly.onresize();}
        });
    </script>  
    </body>
</html>
