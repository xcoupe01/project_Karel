<html>
    <head>
        <title>Karel 3D</title>
        <link rel="icon" type="image/png" sizes="32x32" href="favicon.ico">
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
                        <a href="javascript:setDefaultSizes()" id="setWindows">Ulož okna</a>
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
                        <div class="overlay">
                            <div id='counterDisplay'></div>
                            <div id='runIndikator' style="background-color: var(--bg-red);"></div>
                            <div id='controlIndikator' style="background-color: var(--bg-red);"></div>
                        </div>
                        <canvas id="roomCanvas" style="height:100%; width:100%; outline: 0; outline-color: transparent; box-shadow: none;" onfocus="roomFocus()" onblur="roomUnfocus()"></canvas>
                    </div>
                </div>  
                <div id="row2" class="split" style="position: relative; overflow:auto;">
                    <div class="content" style="background-color: white">
                        <div id="dashboard" style="min-width: 15.4rem">
                            <div class="controls" id="controlButtons" style="display: none;">
                                <div id="control-left">
                                    <svg aria-hidden="true" 
                                        focusable="false" 
                                        data-prefix="fas" 
                                        data-icon="chevron-left" 
                                        class="svg-inline--fa fa-chevron-left fa-w-10" 
                                        role="img" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 320 512">
                                        <path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
                                    </svg>
                                </div>
                                <div id="control-forward">
                                    <svg aria-hidden="true" 
                                        focusable="false" 
                                        data-prefix="fas" 
                                        data-icon="chevron-up" 
                                        class="svg-inline--fa fa-chevron-up fa-w-14" 
                                        role="img" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 448 512">
                                        <path fill="currentColor" d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path>
                                    </svg>
                                </div>
                                <div id="control-right">
                                    <svg aria-hidden="true" 
                                        focusable="false" 
                                        data-prefix="fas" 
                                        data-icon="chevron-right" 
                                        class="svg-inline--fa fa-chevron-right fa-w-10" 
                                        role="img" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 320 512">
                                        <path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
                                    </svg>
                                </div>
                                <div id="control-place">
                                    <svg aria-hidden="true" 
                                        focusable="false" 
                                        data-prefix="fas" 
                                        data-icon="level-down-alt" 
                                        class="svg-inline--fa fa-level-down-alt fa-w-10" 
                                        role="img" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 320 512">
                                        <path fill="currentColor" d="M313.553 392.331L209.587 504.334c-9.485 10.214-25.676 10.229-35.174 0L70.438 392.331C56.232 377.031 67.062 352 88.025 352H152V80H68.024a11.996 11.996 0 0 1-8.485-3.515l-56-56C-4.021 12.926 1.333 0 12.024 0H208c13.255 0 24 10.745 24 24v328h63.966c20.878 0 31.851 24.969 17.587 40.331z"></path>
                                    </svg>
                                </div>
                                <div id="control-pick">
                                    <svg aria-hidden="true" 
                                        focusable="false" 
                                        data-prefix="fas" 
                                        data-icon="level-up-alt"
                                        class="svg-inline--fa fa-level-up-alt fa-w-10"
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 320 512">
                                        <path fill="currentColor" d="M313.553 119.669L209.587 7.666c-9.485-10.214-25.676-10.229-35.174 0L70.438 119.669C56.232 134.969 67.062 160 88.025 160H152v272H68.024a11.996 11.996 0 0 0-8.485 3.515l-56 56C-4.021 499.074 1.333 512 12.024 512H208c13.255 0 24-10.745 24-24V160h63.966c20.878 0 31.851-24.969 17.587-40.331z"></path>
                                    </svg>
                                </div>
                                <div id="control-mark">
                                    <svg aria-hidden="true" 
                                        focusable="false" 
                                        data-prefix="fas" 
                                        data-icon="flag" 
                                        class="svg-inline--fa fa-flag fa-w-16" 
                                        role="img" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M349.565 98.783C295.978 98.783 251.721 64 184.348 64c-24.955 0-47.309 4.384-68.045 12.013a55.947 55.947 0 0 0 3.586-23.562C118.117 24.015 94.806 1.206 66.338.048 34.345-1.254 8 24.296 8 56c0 19.026 9.497 35.825 24 45.945V488c0 13.255 10.745 24 24 24h16c13.255 0 24-10.745 24-24v-94.4c28.311-12.064 63.582-22.122 114.435-22.122 53.588 0 97.844 34.783 165.217 34.783 48.169 0 86.667-16.294 122.505-40.858C506.84 359.452 512 349.571 512 339.045v-243.1c0-23.393-24.269-38.87-45.485-29.016-34.338 15.948-76.454 31.854-116.95 31.854z"></path>
                                    </svg>
                                </div>
                                <div id="control-delete">
                                    <svg aria-hidden="true" 
                                        focusable="false" 
                                        data-prefix="fas" 
                                        data-icon="times" 
                                        class="svg-inline--fa fa-times fa-w-11" 
                                        role="img" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 352 512">
                                        <path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="dashboard-buttons">
                                <div id='homeCameraButton' style='cursor:pointer;'></div>
                                <div id="showControls" style='cursor:pointer;'></div>
                                <div style='cursor:pointer;' onclick="resetView();" id="resetView"></div>
                                <div id='test' style='cursor:pointer;'>Test</div>
                                <div class="dashboard-slider">
                                    <div style="width: 100%; min-width: 6.5rem;">
                                        <input type="range" min="20" max="1000" value="125" class="slider" id="speedSlider">
                                    </div>
                                    <div style="width: 75px;">
                                        <input type="number" min="20" max="1000" value="125" class="numberPicker" id="speedNumber">
                                    </div>
                                </div>
                                <div class="dashboard-textbox-console" id="consoleWrapper">
                                    <div id="console"></div>
                                </div>
                                <div class="dashboard-textbox-console" id="variableOverview"></div>
                            </div>
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
                    <div class="codeNavbar" style="height: 2.25rem">
                        <div id="showTextCode" style="background-color: var(--bg-secondary); color: var(--text-primary);">
                            <svg aria-hidden="true" 
                                focusable="false" 
                                data-prefix="far" 
                                data-icon="file-code" 
                                class="svg-inline--fa fa-file-code fa-w-12" 
                                role="img" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 384 512">
                                <path fill="currentColor" d="M149.9 349.1l-.2-.2-32.8-28.9 32.8-28.9c3.6-3.2 4-8.8.8-12.4l-.2-.2-17.4-18.6c-3.4-3.6-9-3.7-12.4-.4l-57.7 54.1c-3.7 3.5-3.7 9.4 0 12.8l57.7 54.1c1.6 1.5 3.8 2.4 6 2.4 2.4 0 4.8-1 6.4-2.8l17.4-18.6c3.3-3.5 3.1-9.1-.4-12.4zm220-251.2L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM256 51.9l76.1 76.1H256zM336 464H48V48h160v104c0 13.3 10.7 24 24 24h104zM209.6 214c-4.7-1.4-9.5 1.3-10.9 6L144 408.1c-1.4 4.7 1.3 9.6 6 10.9l24.4 7.1c4.7 1.4 9.6-1.4 10.9-6L240 231.9c1.4-4.7-1.3-9.6-6-10.9zm24.5 76.9l.2.2 32.8 28.9-32.8 28.9c-3.6 3.2-4 8.8-.8 12.4l.2.2 17.4 18.6c3.3 3.5 8.9 3.7 12.4.4l57.7-54.1c3.7-3.5 3.7-9.4 0-12.8l-57.7-54.1c-3.5-3.3-9.1-3.2-12.4.4l-17.4 18.6c-3.3 3.5-3.1 9.1.4 12.4z"></path>
                            </svg>
                            <div id="showTextCodeTitle"></div>
                        </div>
                        <div id="showBlocklyCode">
                            <svg aria-hidden="true" 
                                focusable="false" 
                                data-prefix="fas" 
                                data-icon="th-large" 
                                class="svg-inline--fa fa-th-large fa-w-16" 
                                role="img" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 512 512">
                                <path fill="currentColor" d="M296 32h192c13.255 0 24 10.745 24 24v160c0 13.255-10.745 24-24 24H296c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24zm-80 0H24C10.745 32 0 42.745 0 56v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24zM0 296v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm296 184h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H296c-13.255 0-24 10.745-24 24v160c0 13.255 10.745 24 24 24z"></path>
                            </svg>
                            <div id="showBlocklyCodeTitle"></div>
                        </div>
                    </div>
                    <div id="textEditor" style="height:100%"><?php include('saves/math_revised2.txt'); ?></div>
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
            var mainSplitSizes = [35,40,25];
            var roomSplitSizes = [85, 15]

            var mainSplit = Split(['#a','#b','#c'], {
                gutterSize: 8,
                cursor: 'col-resize',
                minSize: [1, 1, 1],
                sizes: mainSplitSizes,
                onDrag: function(){Blockly.onresize();}
            });

            var roomSplit = Split(['#row1', '#row2'], {
                gutterSize: 8,
                cursor: 'row-resize',
                direction: 'vertical',
                sizes: roomSplitSizes,
                minSize: [1, 1],
            });

            function resetView(){
                mainSplit.setSizes(mainSplitSizes);
                roomSplit.setSizes(roomSplitSizes);
                Blockly.onresize()
            }

            function setDefaultSizes(){
                mainSplitSizes = mainSplit.getSizes();
                roomSplitSizes = roomSplit.getSizes();
                karelConsoleLog("defaultWindowSizeSet");
            }

            function roomFocus(){
                if(document.querySelector('#runIndikator').style.display != "block"){
                    document.querySelector('#controlIndikator').style.display = 'block';
                    document.querySelector('#roomCanvas').focus();
                }
            }

            function roomUnfocus(){
                document.querySelector('#controlIndikator').style.display = 'none';
            }

            window.dictionary;

            function karelConsoleClear(){
                document.querySelector('#console').innerHTML = "";
            }

            function karelConsoleLog(key){
                var date = new Date();
                document.querySelector('#console').innerHTML += 
                    String("0" + date.getHours()).slice(-2) + 
                    ":" + 
                    String("0" + date.getMinutes()).slice(-2) + 
                    ":" +
                    String("0" + date.getSeconds()).slice(-2) +
                    " - " + 
                    window.dictionary[key] + 
                    "<br>";
                document.querySelector('#consoleWrapper').scrollBy(0, document.querySelector('#consoleWrapper').scrollHeight);
            }
        </script>

        <!-- dialogs -->
        <div id="resizeRoomDialog" title="" style="display: none;">
            <p id="resizeRoomText"></p>

            <table>
                <tbody>
                <tr>
                <td><label for="xVal" id="xAxisLabel"></label></td>
                <td><input type="number" min="2" max="100" name="xVal" id="xVal"></td>
                </tr>
                <tr>
                <td><label for="yVal" id="yAxisLabel"></label></td>
                <td><input type="number" min="2" max="100" name="yVal" id="yVal"></td>
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