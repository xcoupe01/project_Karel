define("ace/mode/karel_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var karelHighlightRules = function() {
    
    this.setKeywords = function(kwMap) {
        this.keywordRule.onMatch = this.createKeywordMapper(kwMap, "identifier");
    }

    this.keywordRule = {
        regex : "\\w+",
        onMatch : function() {return "text"}
    }

    var decimalInteger = "(?:(?:[1-9]\\d*)|(?:0))";
    var hexInteger = "(?:0[xX][\\dA-Fa-f]+)";
    var integer = "(?:" + decimalInteger + "|" + hexInteger + ")";

    /* enables Floats to be recognizeg - pt1
    var fraction = "(?:\\.\\d+)";
    var intPart = "(?:\\d+)";
    var pointFloat = "(?:(?:" + intPart + "?" + fraction + ")|(?:" + intPart + "\\.))";
    var floatNumber = "(?:" + pointFloat + ")";
    */

    this.$rules = { //rules just for highlighting
        "start" : [
        {
            token : "comment",          // single line comment
            regex : "#.*$"
        },
        /* enables Floats to be recognizeg - pt2
        {
            token : "constant.numeric", // float
            regex : floatNumber
        }, 
        */
        {
            token : "constant.numeric", // integer
            regex : integer + "\\b"
        }, 
        this.keywordRule
        , {
            token : "keyword.operator", //operators
            regex : "\\+|\\-|\\*|\\/|\\%|<|>|<=|=>|==|=|!=|\\)|\\("
        }, {
            token : "text",             //text
            regex : "\\s+|\\w+"
        } ]
    };
    
    this.normalizeRules();
}

oop.inherits(karelHighlightRules, TextHighlightRules);

exports.karelHighlightRules = karelHighlightRules;
});

define("ace/mode/folding/karel",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range","ace/token_iterator"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var BaseFoldMode = require("./fold_mode").FoldMode;
var Range = require("../../range").Range;
var TokenIterator = require("../../token_iterator").TokenIterator;


var FoldMode = exports.FoldMode = function() {};

oop.inherits(FoldMode, BaseFoldMode);

(function() {

    this.foldingStartMarker = /\bnone\b/;
    this.foldingStopMarker = /\bnone\b/;
    this.indentKeywords = {};

    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
        var isStart = this.foldingStartMarker.test(line);
        var isEnd = this.foldingStopMarker.test(line);
        if (isStart && !isEnd) {
            var match = line.match(this.foldingStartMarker);
            if (match[1]) {
                return "start";
            }
        }
        return "";
    };

    this.getFoldWidgetRange = function(session, foldStyle, row) {
        var line = session.doc.getLine(row);
        var match = this.foldingStartMarker.exec(line);
        if (match[1]){
            return this.karelBlock(session, row, match.index + 1);
        }
        
    };

    this.karelBlock = function(session, row, column) {
        var stream = new TokenIterator(session, row, column);

        var token = stream.getCurrentToken();
        
        if (!token) return;

        var val = token.value;
        var stack = [val];
        var dir = this.indentKeywords[val];

        if (!dir)
            return;

        var startColumn = dir === -1 ? stream.getCurrentTokenColumn() : session.getLine(row).length;
        var startRow = row;

        stream.step = dir === -1 ? stream.stepBackward : stream.stepForward;
        while(token = stream.step()) {
            var level = dir * this.indentKeywords[token.value];

            if (level > 0) {
                stack.unshift(token.value);
            } else if (level <= 0) {
                stack.shift();
                if (!stack.length)
                    break;
                if (level === 0)
                    stack.unshift(token.value);
            }
        }

        if(!token){
            return;
        }

        var row = stream.getCurrentTokenRow();
        if (dir === -1)
            return new Range(row, session.getLine(row).length, startRow, startColumn);
        else
            return new Range(startRow, startColumn, row, stream.getCurrentTokenColumn());
    };

}).call(FoldMode.prototype);
});

define("ace/mode/karel",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/karel_highlight_rules","ace/mode/folding/karel","ace/range","ace/worker/worker_client"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var KarelHighlightRules = require("./karel_highlight_rules").karelHighlightRules;
var KarelFoldMode = require("./folding/karel").FoldMode;
var Range = require("../range").Range;
//var WorkerClient = require("../worker/worker_client").WorkerClient;

var Mode = function() {
    this.HighlightRules = KarelHighlightRules;
    this.foldingRules = new KarelFoldMode();

    this.outdentKeywords = [];

    this.indentKeywords = {};
    this.indentationHelperOn = true;


};
oop.inherits(Mode, TextMode);

(function() {
   
    this.lineCommentStart = "#";
    // this.blockComment = {start: "--[", end: "]--"};
    // tells when the editor should automaticaly indent and dedent

    this.getNetIndentLevel = function(tokens) {
        var level = 0;
        for (var i = 0; i < tokens.length; i++){
            if(tokens[i - 1] !== undefined && tokens[i - 1].value + tokens[i].value in this.indentKeywords){
                level += this.indentKeywords[tokens[i - 1].value + tokens[i].value];
            } else if (tokens[i].value in this.indentKeywords) {
                level += this.indentKeywords[tokens[i].value];
            }
        }
        if (level < 0) {
            return -1;
        } else if (level > 0) {
            return 1;
        } else {
            return 0;
        }
    }

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);
        if(!this.indentationHelperOn){
            return indent;
        }
        var level = 0;

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;

        if (state == "start") {
            level = this.getNetIndentLevel(tokens);
        }
        if (level > 0) {
            return indent + tab;
        } else if (level < 0 && indent.substr(indent.length - tab.length) == tab) {
            if (!this.checkOutdent(state, line, "\n")) {
                return indent.substr(0, indent.length - tab.length);
            }
        }
        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        if (input != "\n" && input != "\r" && input != "\r\n")
            return false;

        if(!this.indentationHelperOn) return false;

        var tokens = this.getTokenizer().getLineTokens(line.trim(), state).tokens;

        if (!tokens || !tokens.length)
            return false;
        
        if(tokens.length > 1 && tokens[tokens.length - 2].value == "*"){
            tokens[tokens.length - 1].value = "*" + tokens[tokens.length - 1].value;
        }

        return (this.outdentKeywords.indexOf(tokens[tokens.length - 1].value) != -1);
    };

    this.autoOutdent = function(state, session, row) {
        var prevLine = session.getLine(row - 1);
        var prevIndent = this.$getIndent(prevLine).length;
        var prevTokens = this.getTokenizer().getLineTokens(prevLine, "start").tokens;
        var tabLength = session.getTabString().length;
        var expectedIndent = prevIndent + tabLength * this.getNetIndentLevel(prevTokens);
        var curIndent = this.$getIndent(session.getLine(row)).length;
        if (curIndent < expectedIndent) {
            return;
        }
        session.outdentRows(new Range(row, 0, row + 2, 0));
    };
    
    /*
    var WorkerClient = require('ace/worker/worker_client').WorkerClient;
    this.createWorker = function(session) {
        var worker = new WorkerClient(
            ["ace"], 
            "ace/mode/javascript_worker", 
            "JavaScriptWorker");
        worker.attachToDocument(session.getDocument());

        worker.on("annotate", function(results) {
            console.log(results.data)
            //session.setAnnotations(results.data);
        });

        worker.on("terminate", function() {
            //session.clearAnnotations();
        });

        return worker;
    };
    */
    this.$id = "ace/mode/karel";
}).call(Mode.prototype);

exports.Mode = Mode;
});

