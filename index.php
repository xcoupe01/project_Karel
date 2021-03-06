<html>
    <head>
        <title>Karel 3D</title>
        <link rel="shortcut icon" href="favicon.ico" />
        <script type="text/javascript" src="js/split/split.min.js"></script>
        <link rel="stylesheet" href="css/style.css"/>
        <link rel="stylesheet" href="css/jquery-ui.css">
        <meta charset="utf-8"/>
    </head>
    <body>
        <!-- App menu bar -->
        <nav class="navbar">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a href="#" class="nav-dropdown" title="Menu" id="mainMenuIcon">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="fas" 
                            data-icon="bars" 
                            class="svg-inline--fa fa-bars fa-w-14" role="img" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 448 512">
                            <path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
                        </svg>
                    </a>
                    <div class="nav-dropdown-content">
                        <a href="javascript:void(0)" id="openChangeRoomDialog">Change room</a>
                        <a href="javascript:void(0)" id="makeBlocks">Make blocks</a>
                        <a href="javascript:void(0)" id="openSaveDialog">Save</a>
                        <a href="javascript:void(0)" id="openLoadDialog">Load</a>
                    </div>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-dropdown" title="Languages" id="languagesIcon">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="fas" 
                            data-icon="language" 
                            class="svg-inline--fa fa-language fa-w-20" 
                            role="img" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 640 512">
                            <path fill="currentColor" d="M152.1 236.2c-3.5-12.1-7.8-33.2-7.8-33.2h-.5s-4.3 21.1-7.8 33.2l-11.1 37.5H163zM616 96H336v320h280c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24zm-24 120c0 6.6-5.4 12-12 12h-11.4c-6.9 23.6-21.7 47.4-42.7 69.9 8.4 6.4 17.1 12.5 26.1 18 5.5 3.4 7.3 10.5 4.1 16.2l-7.9 13.9c-3.4 5.9-10.9 7.8-16.7 4.3-12.6-7.8-24.5-16.1-35.4-24.9-10.9 8.7-22.7 17.1-35.4 24.9-5.8 3.5-13.3 1.6-16.7-4.3l-7.9-13.9c-3.2-5.6-1.4-12.8 4.2-16.2 9.3-5.7 18-11.7 26.1-18-7.9-8.4-14.9-17-21-25.7-4-5.7-2.2-13.6 3.7-17.1l6.5-3.9 7.3-4.3c5.4-3.2 12.4-1.7 16 3.4 5 7 10.8 14 17.4 20.9 13.5-14.2 23.8-28.9 30-43.2H412c-6.6 0-12-5.4-12-12v-16c0-6.6 5.4-12 12-12h64v-16c0-6.6 5.4-12 12-12h16c6.6 0 12 5.4 12 12v16h64c6.6 0 12 5.4 12 12zM0 120v272c0 13.3 10.7 24 24 24h280V96H24c-13.3 0-24 10.7-24 24zm58.9 216.1L116.4 167c1.7-4.9 6.2-8.1 11.4-8.1h32.5c5.1 0 9.7 3.3 11.4 8.1l57.5 169.1c2.6 7.8-3.1 15.9-11.4 15.9h-22.9a12 12 0 0 1-11.5-8.6l-9.4-31.9h-60.2l-9.1 31.8c-1.5 5.1-6.2 8.7-11.5 8.7H70.3c-8.2 0-14-8.1-11.4-15.9z"></path>
                        </svg>
                    </a>
                    <div class="nav-dropdown-content">
                        <a href="javascript:void(0)" id="setCzech">Čeština</a>
                        <a href="javascript:void(0)" id="setEnglish">English</a>
                    </div>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" title="Run" id="runCode">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="fas" 
                            data-icon="play" 
                            class="svg-inline--fa fa-play fa-w-14" 
                            role="img" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 448 512">
                            <path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path>
                        </svg>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" title="Debug" id="runDebug">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="fas" 
                            data-icon="bug" 
                            class="svg-inline--fa fa-bug fa-w-16" 
                            role="img" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 512 512">
                            <path fill="currentColor" d="M511.988 288.9c-.478 17.43-15.217 31.1-32.653 31.1H424v16c0 21.864-4.882 42.584-13.6 61.145l60.228 60.228c12.496 12.497 12.496 32.758 0 45.255-12.498 12.497-32.759 12.496-45.256 0l-54.736-54.736C345.886 467.965 314.351 480 280 480V236c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v244c-34.351 0-65.886-12.035-90.636-32.108l-54.736 54.736c-12.498 12.497-32.759 12.496-45.256 0-12.496-12.497-12.496-32.758 0-45.255l60.228-60.228C92.882 378.584 88 357.864 88 336v-16H32.666C15.23 320 .491 306.33.013 288.9-.484 270.816 14.028 256 32 256h56v-58.745l-46.628-46.628c-12.496-12.497-12.496-32.758 0-45.255 12.498-12.497 32.758-12.497 45.256 0L141.255 160h229.489l54.627-54.627c12.498-12.497 32.758-12.497 45.256 0 12.496 12.497 12.496 32.758 0 45.255L424 197.255V256h56c17.972 0 32.484 14.816 31.988 32.9zM257 0c-61.856 0-112 50.144-112 112h224C369 50.144 318.856 0 257 0z"></path>
                        </svg>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" title="Stop" id="stop">
                        <svg aria-hidden="true" 
                            focusable="false" 
                            data-prefix="fas" 
                            data-icon="stop" 
                            class="svg-inline--fa fa-stop fa-w-14" 
                            role="img" xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 448 512">
                            <path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"></path>
                        </svg>
                    </a>
                </li>
            </ul>
        </nav>

       <main>
            <!-- Room canvas -->
            <div id="a" class="split split-horizontal">
                <div id="row1" class="split-hidden"> 
                    <div class="content">
                        <canvas id="roomCanvas" style="height:100%; width:100%;" onfocus="roomFocus()" onblur="roomUnfocus()"></canvas>
                    </div>
                </div>  
                <div id="row2" class="split">
                    <div class="content">
                        <div class="flex-container">
                            <div id='counterDisplay' style='cursor:pointer;'></div>
                            <div id='runningIndicator'></div>
                            <div id='roomFocusIndicator' style='cursor:pointer;' onclick="document.querySelector('#roomCanvas').focus();"></div>
                            <div id='homeCameraButton' style='cursor:pointer;'></div>
                            <div id='ACEeditorToggle' style='cursor:pointer;'></div>
                            <div id='test' style='cursor:pointer;'>Test</div>
                            <div id='fullScreenButton'></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Blockly editor -->
            <div id="b" class="split split-horizontal"> 
                <div class="content" >
                    <div id="blocklyArea" style="position: relative;  width: 100%; height:100%; ">
                        <div id="blocklyDiv" style="width:100%;"></div>
                    </div>  
                </div> 
            </div>
            <!-- ACE code editor -->
            <div id="c" class="split split-horizontal">
                <div class="content">
                    <div id="textEditor" style="height:100%"><?php include('saves/initial_test_save.txt'); ?></div>
                    <div id="blocklyReader" style="height:100%; display:none;"></div>
                </div>
            </div>  
        </main>

        <!-- ace startup -->
        <script src="js/ace/ace.js" charset="utf-8"></script>
        <script src="js/ace/ext-language_tools.js"></script>

        <!-- blockly startup -->
        <script src="js/blockly/blockly_compressed.js"></script>
        <script src="js/blockly/karel_blocks.js"></script>
        <script src="js/blockly/karel_blocks_generator.js"></script>
        <script src="js/blockly/msg/js/cs.js"></script>

        <div id="blocklyToolBox">
            <xml id="toolbox" style="display: none">
                <category name="NULL">
                </category>
            </xml>
        </div>

        <!-- JQuery startup -->
        <script src="js/jquery/jquery-3.5.1.min.js"></script>
        <script src="js/jquery/jquery-ui.js"></script>

        <!-- app startup -->
        <script type="module" src="js/main.js"></script>

        <script type="text/javascript">
            Split(['#a','#b','#c'], {
                gutterSize: 8,
                cursor: 'col-resize',
                minSize: [1, 1, 1],
                sizes:[30,40,30],
                onDrag: function(){Blockly.onresize();}
            });

            Split(['#row1', '#row2'], {
                gutterSize: 8,
                cursor: 'row-resize',
                direction: 'vertical',
                sizes: [87, 13],
                minSize: [500, 0],
            });

            var startColor;

            function roomFocus(){
                startColor = document.querySelector('#roomFocusIndicator').style.backgroundColor;
                document.querySelector('#roomFocusIndicator').style.backgroundColor = "red";
                document.querySelector('#roomCanvas').focus();
            }

            function roomUnfocus(){
                document.querySelector('#roomFocusIndicator').style.backgroundColor = startColor;
            }
        </script>

        <!-- dialogs -->
        <div id="resizeRoomDialog" title="" style="display: none;">
            <p id="resizeRoomText"></p>

            <table>
                <tbody>
                <tr>
                <td><label for="xVal" id="xAxisLabel"></label></td>
                <td><input type="text" name="xVal" id="xVal"></td>
                </tr>
                <tr>
                <td><label for="yVal" id="yAxisLabel"></label></td>
                <td><input type="text" name="yVal" id="yVal"></td>
                </tr>
                </tbody>
            </table>
            <input type="button" value="room" id="room">
        </div>

        <div id="SaveDialog" title="" style="display: none;">
            <p id="saveText"></p>

            <table>
                <tbody>
                <tr>
                <td><label for="roomSaveCheckbox" id="roomSaveLabel"></label></td>
                <td><input type="checkbox" id="roomSaveCheckbox" checked></td>
                </tr>
                <tr>
                <td><label for="blocksSaveCheckbox" id="blocksSaveLabel"></label></td>
                <td><input type="checkbox" id="blocksSaveCheckbox" checked></td>
                </tr>
                <tr>
                <td><label for="blocksSaveCheckbox" id="codeSaveLabel"></label></td>
                <td><input type="checkbox" id="codeSaveCheckbox" checked></td>
                </tr>
                </tbody>
            </table>
            <input type="text" id="saveName">
            <input type="button" value="save" id="saveButton">
        </div>

        <div id="LoadDialog" title="" style="display: none;">
            <p id="loadText"></p>
            <input type="file" id="loadFile">
            <input type="button" value="load" id="loadButton">
            <br>
        </div>
        
    </body>
</html>