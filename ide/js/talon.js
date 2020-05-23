(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaneOutput {
    constructor(pane) {
        this.pane = pane;
    }
    clear() {
        this.pane.innerText = "";
    }
    debug(line) {
        this.pane.innerText += line + "\n";
        this.pane.scrollTo(0, this.pane.scrollHeight);
    }
    write(line) {
        this.pane.innerText += line + "\n";
        this.pane.scrollTo(0, this.pane.scrollHeight);
    }
}
exports.PaneOutput = PaneOutput;
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TalonCompiler_1 = require("./compiler/TalonCompiler");
const PaneOutput_1 = require("./PaneOutput");
const TalonRuntime_1 = require("./runtime/TalonRuntime");
class TalonIde {
    constructor() {
        this.compiledTypes = [];
        this.codePane = TalonIde.getById("code-pane");
        this.gamePane = TalonIde.getById("game-pane");
        this.compilationOutput = TalonIde.getById("compilation-output");
        this.gameLogOutput = TalonIde.getById("log-pane");
        this.example1Button = TalonIde.getById("example1");
        this.compileButton = TalonIde.getById("compile");
        this.startNewGameButton = TalonIde.getById("start-new-game");
        this.userCommandText = TalonIde.getById("user-command-text");
        this.sendUserCommandButton = TalonIde.getById("send-user-command");
        this.example1Button.addEventListener('click', e => this.loadExample());
        this.compileButton.addEventListener('click', e => this.compile());
        this.startNewGameButton.addEventListener('click', e => this.startNewGame());
        this.sendUserCommandButton.addEventListener('click', e => this.sendUserCommand());
        this.userCommandText.addEventListener('keyup', e => {
            if (e.keyCode == 13) { // enter key
                this.sendUserCommand();
            }
        });
        this.codePane.addEventListener('keydown', e => {
            console.log("HIT");
            const getCaretPosition = (element) => {
                var _a;
                var range = (_a = window === null || window === void 0 ? void 0 : window.getSelection()) === null || _a === void 0 ? void 0 : _a.getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                return preCaretRange.toString().length;
            };
            if (e.keyCode == 9) { // tab key
                console.log("INSIDE");
                var pos = getCaretPosition(this.codePane);
                var preText = this.codePane.innerText.substring(0, pos);
                var postText = this.codePane.innerText.substring(pos, this.codePane.innerText.length);
                this.codePane.innerText = preText + "    " + postText; // input tab key
                //this.setCaretPosition(this.codePane.innerText, pos + 1);
                e.preventDefault();
            }
        });
        this.compilationOutputPane = new PaneOutput_1.PaneOutput(this.compilationOutput);
        this.runtimeOutputPane = new PaneOutput_1.PaneOutput(this.gamePane);
        this.runtimeLogOutputPane = new PaneOutput_1.PaneOutput(this.gameLogOutput);
        this.compiler = new TalonCompiler_1.TalonCompiler(this.compilationOutputPane);
        this.runtime = new TalonRuntime_1.TalonRuntime(this.runtimeOutputPane, this.runtimeLogOutputPane);
    }
    static getById(name) {
        return document.getElementById(name);
    }
    sendUserCommand() {
        const command = this.userCommandText.value;
        this.runtime.sendCommand(command);
    }
    compile() {
        const code = this.codePane.innerText;
        this.compilationOutputPane.clear();
        this.compiledTypes = this.compiler.compile(code);
    }
    startNewGame() {
        this.runtimeOutputPane.clear();
        this.runtimeLogOutputPane.clear();
        if (this.runtime.loadFrom(this.compiledTypes)) {
            this.runtime.start();
        }
    }
    loadExample() {
        this.codePane.innerText =
            "say \"This is the start.\".\n\n" +
                "understand \"look\" as describing. \n" +
                "understand \"north\" as directions. \n" +
                "understand \"south\" as directions.\n" +
                "understand \"go\" as moving. \n" +
                "understand \"take\" as taking. \n" +
                "understand \"inv\" as inventory. \n" +
                "understand \"drop\" as dropping. \n\n" +
                "an Inn is a kind of place. \n" +
                "it is where the player starts. \n" +
                "it is described as \"The inn is a cozy place, with a crackling fire on the hearth. The bartender is behind the bar. An open door to the north leads outside.\" and if it contains 1 Coin then \"There's also a coin here.\" else \"There is just dust.\".\n" +
                "it contains 1 Coin, 1 Fireplace.\n" +
                "it can reach the Walkway by going \"north\". \n" +
                "it has a \"value\" that is 1. \n" +
                "when the player exits: \n" +
                "say \"The bartender waves goodbye.\"; \n" +
                "set \"value\" to 2; \n" +
                "and then stop. \n\n" +
                "a Fireplace is a kind of decoration. \n" +
                "it is described as \"The fireplace crackles. It's full of fire.\". \n\n" +
                "a Walkway is a kind of place. \n" +
                "it is described as \"The walkway in front of the inn is empty, just a cobblestone entrance. The inn is to the south.\". \n" +
                "it can reach the Inn by going \"south\". \n" +
                "when the player enters:\n" +
                "say \"You walk onto the cobblestones. They're nice, if you like that sort of thing.\"; \n" +
                "say \"There's nobody around. The wind whistles a little bit.\"; \n" +
                "and then stop. \n\n" +
                "say \"This is the middle.\".\n\n" +
                "a Coin is a kind of item. \n" +
                "it is described as \"It's a small coin.\".\n\n" +
                "say \"This is the end.\".\n";
    }
}
exports.TalonIde = TalonIde;
},{"./PaneOutput":1,"./compiler/TalonCompiler":11,"./runtime/TalonRuntime":68}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventType;
(function (EventType) {
    EventType[EventType["None"] = 0] = "None";
    EventType[EventType["PlayerEntersPlace"] = 1] = "PlayerEntersPlace";
    EventType[EventType["PlayerExitsPlace"] = 2] = "PlayerExitsPlace";
})(EventType = exports.EventType || (exports.EventType = {}));
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Field {
    constructor() {
        this.name = "";
        this.typeName = "";
    }
}
exports.Field = Field;
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCode_1 = require("./OpCode");
class Instruction {
    constructor(opCode, value) {
        this.opCode = OpCode_1.OpCode.NoOp;
        this.opCode = opCode;
        this.value = value;
    }
    static assign() {
        return new Instruction(OpCode_1.OpCode.Assign);
    }
    static invokeDelegate() {
        return new Instruction(OpCode_1.OpCode.InvokeDelegate);
    }
    static isTypeOf(typeName) {
        return new Instruction(OpCode_1.OpCode.TypeOf, typeName);
    }
    static loadNumber(value) {
        return new Instruction(OpCode_1.OpCode.LoadNumber, value);
    }
    static loadString(value) {
        return new Instruction(OpCode_1.OpCode.LoadString, value);
    }
    static loadInstance(typeName) {
        return new Instruction(OpCode_1.OpCode.LoadInstance, typeName);
    }
    static loadField(fieldName) {
        return new Instruction(OpCode_1.OpCode.LoadField, fieldName);
    }
    static loadProperty(fieldName) {
        return new Instruction(OpCode_1.OpCode.LoadProperty, fieldName);
    }
    static loadLocal(localName) {
        return new Instruction(OpCode_1.OpCode.LoadLocal, localName);
    }
    static loadThis() {
        return new Instruction(OpCode_1.OpCode.LoadThis);
    }
    static instanceCall(methodName) {
        return new Instruction(OpCode_1.OpCode.InstanceCall, methodName);
    }
    static concatenate() {
        return new Instruction(OpCode_1.OpCode.Concatenate);
    }
    static staticCall(typeName, methodName) {
        return new Instruction(OpCode_1.OpCode.StaticCall, `${typeName}.${methodName}`);
    }
    static externalCall(methodName) {
        return new Instruction(OpCode_1.OpCode.ExternalCall, methodName);
    }
    static print() {
        return new Instruction(OpCode_1.OpCode.Print);
    }
    static return() {
        return new Instruction(OpCode_1.OpCode.Return);
    }
    static readInput() {
        return new Instruction(OpCode_1.OpCode.ReadInput);
    }
    static parseCommand() {
        return new Instruction(OpCode_1.OpCode.ParseCommand);
    }
    static handleCommand() {
        return new Instruction(OpCode_1.OpCode.HandleCommand);
    }
    static goTo(lineNumber) {
        return new Instruction(OpCode_1.OpCode.GoTo, lineNumber);
    }
    static branchRelative(count) {
        return new Instruction(OpCode_1.OpCode.BranchRelative, count);
    }
    static branchRelativeIfFalse(count) {
        return new Instruction(OpCode_1.OpCode.BranchRelativeIfFalse, count);
    }
}
exports.Instruction = Instruction;
},{"./OpCode":7}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventType_1 = require("./EventType");
class Method {
    constructor() {
        this.name = "";
        this.parameters = [];
        this.actualParameters = [];
        this.body = [];
        this.returnType = "";
        this.eventType = EventType_1.EventType.None;
    }
}
exports.Method = Method;
},{"./EventType":3}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OpCode;
(function (OpCode) {
    OpCode[OpCode["NoOp"] = 0] = "NoOp";
    OpCode[OpCode["Assign"] = 1] = "Assign";
    OpCode[OpCode["Print"] = 2] = "Print";
    OpCode[OpCode["LoadString"] = 3] = "LoadString";
    OpCode[OpCode["NewInstance"] = 4] = "NewInstance";
    OpCode[OpCode["ParseCommand"] = 5] = "ParseCommand";
    OpCode[OpCode["HandleCommand"] = 6] = "HandleCommand";
    OpCode[OpCode["ReadInput"] = 7] = "ReadInput";
    OpCode[OpCode["GoTo"] = 8] = "GoTo";
    OpCode[OpCode["Return"] = 9] = "Return";
    OpCode[OpCode["BranchRelative"] = 10] = "BranchRelative";
    OpCode[OpCode["BranchRelativeIfFalse"] = 11] = "BranchRelativeIfFalse";
    OpCode[OpCode["Concatenate"] = 12] = "Concatenate";
    OpCode[OpCode["LoadNumber"] = 13] = "LoadNumber";
    OpCode[OpCode["LoadField"] = 14] = "LoadField";
    OpCode[OpCode["LoadProperty"] = 15] = "LoadProperty";
    OpCode[OpCode["LoadInstance"] = 16] = "LoadInstance";
    OpCode[OpCode["LoadLocal"] = 17] = "LoadLocal";
    OpCode[OpCode["LoadThis"] = 18] = "LoadThis";
    OpCode[OpCode["InstanceCall"] = 19] = "InstanceCall";
    OpCode[OpCode["StaticCall"] = 20] = "StaticCall";
    OpCode[OpCode["ExternalCall"] = 21] = "ExternalCall";
    OpCode[OpCode["TypeOf"] = 22] = "TypeOf";
    OpCode[OpCode["InvokeDelegate"] = 23] = "InvokeDelegate";
})(OpCode = exports.OpCode || (exports.OpCode = {}));
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parameter {
    constructor(name, typeName) {
        this.name = name;
        this.typeName = typeName;
    }
}
exports.Parameter = Parameter;
},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Type {
    constructor(name, baseTypeName) {
        this.name = name;
        this.baseTypeName = baseTypeName;
        this.fields = [];
        this.methods = [];
        this.attributes = [];
    }
    get isSystemType() {
        return this.name.startsWith("~");
    }
    get isAnonymousType() {
        return this.name.startsWith("<~>");
    }
}
exports.Type = Type;
},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Version {
    constructor(major, minor, patch) {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }
    toString() {
        return `${this.major}.${this.minor}.${this.patch}`;
    }
}
exports.Version = Version;
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Type_1 = require("../common/Type");
const Method_1 = require("../common/Method");
const Any_1 = require("../library/Any");
const Instruction_1 = require("../common/Instruction");
const EntryPointAttribute_1 = require("../library/EntryPointAttribute");
const TalonLexer_1 = require("./lexing/TalonLexer");
const TalonParser_1 = require("./parsing/TalonParser");
const TalonSemanticAnalyzer_1 = require("./semantics/TalonSemanticAnalyzer");
const TalonTransformer_1 = require("./transforming/TalonTransformer");
const Version_1 = require("../common/Version");
const CompilationError_1 = require("./exceptions/CompilationError");
const Delegate_1 = require("../library/Delegate");
class TalonCompiler {
    constructor(out) {
        this.out = out;
    }
    get languageVersion() {
        return new Version_1.Version(1, 0, 0);
    }
    get version() {
        return new Version_1.Version(1, 0, 0);
    }
    compile(code) {
        this.out.write("Starting compilation...");
        try {
            const lexer = new TalonLexer_1.TalonLexer(this.out);
            const parser = new TalonParser_1.TalonParser(this.out);
            const analyzer = new TalonSemanticAnalyzer_1.TalonSemanticAnalyzer(this.out);
            const transformer = new TalonTransformer_1.TalonTransformer(this.out);
            const tokens = lexer.tokenize(code);
            const ast = parser.parse(tokens);
            const analyzedAst = analyzer.analyze(ast);
            const types = transformer.transform(analyzedAst);
            const entryPoint = this.createEntryPoint();
            types.push(entryPoint);
            return types;
        }
        catch (ex) {
            if (ex instanceof CompilationError_1.CompilationError) {
                this.out.write(`Error: ${ex.message}`);
            }
            else {
                this.out.write(`Unhandled Error: ${ex}`);
            }
            return [];
        }
        finally {
            this.out.write("Compilation complete.");
        }
    }
    createEntryPoint() {
        const type = new Type_1.Type("~entryPoint", "~empty");
        type.attributes.push(new EntryPointAttribute_1.EntryPointAttribute());
        const main = new Method_1.Method();
        main.name = Any_1.Any.main;
        main.body.push(Instruction_1.Instruction.loadString(`Talon Language v.${this.languageVersion}, Compiler v.${this.version}`), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString("================================="), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.staticCall("~globalSays", "~say"), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString("What would you like to do?"), Instruction_1.Instruction.print(), Instruction_1.Instruction.readInput(), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.parseCommand(), Instruction_1.Instruction.handleCommand(), Instruction_1.Instruction.isTypeOf(Delegate_1.Delegate.typeName), Instruction_1.Instruction.branchRelativeIfFalse(2), Instruction_1.Instruction.invokeDelegate(), Instruction_1.Instruction.branchRelative(-4), Instruction_1.Instruction.goTo(9));
        type.methods.push(main);
        return type;
    }
}
exports.TalonCompiler = TalonCompiler;
},{"../common/Instruction":5,"../common/Method":6,"../common/Type":9,"../common/Version":10,"../library/Any":48,"../library/Delegate":51,"../library/EntryPointAttribute":52,"./exceptions/CompilationError":12,"./lexing/TalonLexer":15,"./parsing/TalonParser":19,"./semantics/TalonSemanticAnalyzer":45,"./transforming/TalonTransformer":47}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompilationError {
    constructor(message) {
        this.message = message;
    }
}
exports.CompilationError = CompilationError;
},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Keywords {
    static getAll() {
        const allKeywords = new Set();
        const names = Object.getOwnPropertyNames(Keywords);
        for (let keyword of names) {
            const value = Keywords[keyword];
            if (typeof value === "string" && value != "Keywords") {
                allKeywords.add(value);
            }
        }
        return allKeywords;
    }
}
exports.Keywords = Keywords;
Keywords.an = "an";
Keywords.a = "a";
Keywords.the = "the";
Keywords.is = "is";
Keywords.kind = "kind";
Keywords.of = "of";
Keywords.place = "place";
Keywords.item = "item";
Keywords.it = "it";
Keywords.has = "has";
Keywords.if = "if";
Keywords.description = "description";
Keywords.understand = "understand";
Keywords.as = "as";
Keywords.describing = "describing";
Keywords.described = "described";
Keywords.where = "where";
Keywords.player = "player";
Keywords.starts = "starts";
Keywords.contains = "contains";
Keywords.say = "say";
Keywords.directions = "directions";
Keywords.moving = "moving";
Keywords.taking = "taking";
Keywords.inventory = "inventory";
Keywords.can = "can";
Keywords.reach = "reach";
Keywords.by = "by";
Keywords.going = "going";
Keywords.and = "and";
Keywords.then = "then";
Keywords.else = "else";
Keywords.when = "when";
Keywords.enters = "enters";
Keywords.exits = "exits";
Keywords.stop = "stop";
Keywords.dropping = "dropping";
Keywords.that = "that";
Keywords.set = "set";
Keywords.to = "to";
Keywords.decoration = "decoration";
Keywords.visible = "visible";
Keywords.not = "not";
Keywords.observed = "observed";
},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Punctuation {
}
exports.Punctuation = Punctuation;
Punctuation.period = ".";
Punctuation.colon = ":";
Punctuation.semicolon = ";";
Punctuation.comma = ",";
},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("./Token");
const Keywords_1 = require("./Keywords");
const Punctuation_1 = require("./Punctuation");
const TokenType_1 = require("./TokenType");
class TalonLexer {
    constructor(out) {
        this.out = out;
    }
    tokenize(code) {
        let currentLine = 1;
        let currentColumn = 1;
        const tokens = [];
        for (let index = 0; index < code.length;) {
            const currentChar = code.charAt(index);
            if (currentChar == " ") {
                currentColumn++;
                index++;
                continue;
            }
            if (currentChar == "\n") {
                currentColumn = 1;
                currentLine++;
                index++;
                continue;
            }
            let tokenValue = this.consumeTokenCharsAt(code, index);
            if (tokenValue.length > 0) {
                const token = new Token_1.Token(currentLine, currentColumn, tokenValue);
                tokens.push(token);
            }
            currentColumn += tokenValue.length;
            index += tokenValue.length;
        }
        return this.classify(tokens);
    }
    classify(tokens) {
        for (let token of tokens) {
            if (token.value == Punctuation_1.Punctuation.period) {
                token.type = TokenType_1.TokenType.Terminator;
            }
            else if (token.value == Punctuation_1.Punctuation.semicolon) {
                token.type = TokenType_1.TokenType.SemiTerminator;
            }
            else if (token.value == Punctuation_1.Punctuation.colon) {
                token.type = TokenType_1.TokenType.OpenMethodBlock;
            }
            else if (token.value == Punctuation_1.Punctuation.comma) {
                token.type = TokenType_1.TokenType.ListSeparator;
            }
            else if (TalonLexer.allKeywords.has(token.value)) {
                token.type = TokenType_1.TokenType.Keyword;
            }
            else if (token.value.startsWith("\"") && token.value.endsWith("\"")) {
                token.type = TokenType_1.TokenType.String;
            }
            else if (!isNaN(Number(token.value))) {
                token.type = TokenType_1.TokenType.Number;
            }
            else {
                token.type = TokenType_1.TokenType.Identifier;
            }
        }
        return tokens;
    }
    consumeTokenCharsAt(code, index) {
        const tokenChars = [];
        const stringDelimiter = "\"";
        let isConsumingString = false;
        for (let readAheadIndex = index; readAheadIndex < code.length; readAheadIndex++) {
            const currentChar = code.charAt(readAheadIndex);
            if (isConsumingString && currentChar != stringDelimiter) {
                tokenChars.push(currentChar);
                continue;
            }
            if (currentChar == stringDelimiter) {
                tokenChars.push(currentChar);
                isConsumingString = !isConsumingString;
                if (isConsumingString) {
                    continue;
                }
                else {
                    break;
                }
            }
            if (currentChar == " " ||
                currentChar == "\n" ||
                currentChar == Punctuation_1.Punctuation.period ||
                currentChar == Punctuation_1.Punctuation.colon ||
                currentChar == Punctuation_1.Punctuation.semicolon ||
                currentChar == Punctuation_1.Punctuation.comma) {
                if (tokenChars.length == 0) {
                    tokenChars.push(currentChar);
                }
                break;
            }
            tokenChars.push(currentChar);
        }
        return tokenChars.join("");
    }
}
exports.TalonLexer = TalonLexer;
TalonLexer.allKeywords = Keywords_1.Keywords.getAll();
},{"./Keywords":13,"./Punctuation":14,"./Token":16,"./TokenType":17}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TokenType_1 = require("./TokenType");
const Place_1 = require("../../library/Place");
const Any_1 = require("../../library/Any");
const WorldObject_1 = require("../../library/WorldObject");
const BooleanType_1 = require("../../library/BooleanType");
const Item_1 = require("../../library/Item");
const List_1 = require("../../library/List");
const Decoration_1 = require("../../library/Decoration");
class Token {
    constructor(line, column, value) {
        this.line = line;
        this.column = column;
        this.value = value;
        this.type = TokenType_1.TokenType.Unknown;
    }
    static get empty() {
        return Token.getTokenWithTypeOf("~empty", TokenType_1.TokenType.Unknown);
    }
    static get forAny() {
        return Token.getTokenWithTypeOf(Any_1.Any.typeName, TokenType_1.TokenType.Keyword);
    }
    static get forPlace() {
        return Token.getTokenWithTypeOf(Place_1.Place.typeName, TokenType_1.TokenType.Keyword);
    }
    static get forItem() {
        return Token.getTokenWithTypeOf(Item_1.Item.typeName, TokenType_1.TokenType.Keyword);
    }
    static get forDecoration() {
        return Token.getTokenWithTypeOf(Decoration_1.Decoration.typeName, TokenType_1.TokenType.Keyword);
    }
    static get forWorldObject() {
        return Token.getTokenWithTypeOf(WorldObject_1.WorldObject.typeName, TokenType_1.TokenType.Keyword);
    }
    static get forBoolean() {
        return Token.getTokenWithTypeOf(BooleanType_1.BooleanType.typeName, TokenType_1.TokenType.Keyword);
    }
    static get forList() {
        return Token.getTokenWithTypeOf(List_1.List.typeName, TokenType_1.TokenType.Keyword);
    }
    static getTokenWithTypeOf(name, type) {
        const token = new Token(-1, -1, name);
        token.type = type;
        return token;
    }
    toString() {
        return `${this.line}|${this.column}: Found token '${this.value}' of type '${this.type}'`;
    }
}
exports.Token = Token;
},{"../../library/Any":48,"../../library/BooleanType":49,"../../library/Decoration":50,"../../library/Item":54,"../../library/List":55,"../../library/Place":57,"../../library/WorldObject":62,"./TokenType":17}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Unknown"] = 0] = "Unknown";
    TokenType[TokenType["Keyword"] = 1] = "Keyword";
    TokenType[TokenType["Terminator"] = 2] = "Terminator";
    TokenType[TokenType["SemiTerminator"] = 3] = "SemiTerminator";
    TokenType[TokenType["String"] = 4] = "String";
    TokenType[TokenType["Identifier"] = 5] = "Identifier";
    TokenType[TokenType["Number"] = 6] = "Number";
    TokenType[TokenType["OpenMethodBlock"] = 7] = "OpenMethodBlock";
    TokenType[TokenType["ListSeparator"] = 8] = "ListSeparator";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("../lexing/Token");
const CompilationError_1 = require("../exceptions/CompilationError");
const TokenType_1 = require("../lexing/TokenType");
class ParseContext {
    constructor(tokens, out) {
        this.tokens = tokens;
        this.out = out;
        this.index = 0;
        this.out.write(`${tokens.length} tokens discovered, parsing...`);
    }
    get isDone() {
        return this.index >= this.tokens.length;
    }
    get currentToken() {
        return this.tokens[this.index];
    }
    consumeCurrentToken() {
        const token = this.currentToken;
        this.index++;
        return token;
    }
    is(tokenValue) {
        var _a;
        return ((_a = this.currentToken) === null || _a === void 0 ? void 0 : _a.value) == tokenValue;
    }
    isTypeOf(type) {
        return this.currentToken.type == type;
    }
    isAnyTypeOf(...types) {
        for (const type of types) {
            if (this.isTypeOf(type)) {
                return true;
            }
        }
        return false;
    }
    isAnyOf(...tokenValues) {
        for (let value of tokenValues) {
            if (this.is(value)) {
                return true;
            }
        }
        return false;
    }
    isTerminator() {
        return this.currentToken.type == TokenType_1.TokenType.Terminator;
    }
    expectAnyOf(...tokenValues) {
        if (!this.isAnyOf(...tokenValues)) {
            throw new CompilationError_1.CompilationError("Expected tokens");
        }
        return this.consumeCurrentToken();
    }
    expect(tokenValue) {
        if (this.currentToken.value != tokenValue) {
            throw new CompilationError_1.CompilationError(`Expected token '${tokenValue}'`);
        }
        return this.consumeCurrentToken();
    }
    expectString() {
        if (this.currentToken.type != TokenType_1.TokenType.String) {
            throw new CompilationError_1.CompilationError("Expected string");
        }
        const token = this.consumeCurrentToken();
        // We need to strip off the double quotes from their string after we consume it.
        return new Token_1.Token(token.line, token.column, token.value.substring(1, token.value.length - 1));
    }
    expectNumber() {
        if (this.currentToken.type != TokenType_1.TokenType.Number) {
            throw new CompilationError_1.CompilationError("Expected number");
        }
        return this.consumeCurrentToken();
    }
    expectIdentifier() {
        if (this.currentToken.type != TokenType_1.TokenType.Identifier) {
            throw new CompilationError_1.CompilationError("Expected identifier");
        }
        return this.consumeCurrentToken();
    }
    expectTerminator() {
        if (this.currentToken.type != TokenType_1.TokenType.Terminator) {
            throw new CompilationError_1.CompilationError("Expected expression terminator");
        }
        return this.consumeCurrentToken();
    }
    expectSemiTerminator() {
        if (this.currentToken.type != TokenType_1.TokenType.SemiTerminator) {
            throw new CompilationError_1.CompilationError("Expected semi expression terminator");
        }
        return this.consumeCurrentToken();
    }
    expectOpenMethodBlock() {
        if (this.currentToken.type != TokenType_1.TokenType.OpenMethodBlock) {
            throw new CompilationError_1.CompilationError("Expected open method block");
        }
        return this.consumeCurrentToken();
    }
}
exports.ParseContext = ParseContext;
},{"../exceptions/CompilationError":12,"../lexing/Token":16,"../lexing/TokenType":17}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramVisitor_1 = require("./visitors/ProgramVisitor");
const ParseContext_1 = require("./ParseContext");
class TalonParser {
    constructor(out) {
        this.out = out;
    }
    parse(tokens) {
        const context = new ParseContext_1.ParseContext(tokens, this.out);
        const visitor = new ProgramVisitor_1.ProgramVisitor();
        return visitor.visit(context);
    }
}
exports.TalonParser = TalonParser;
},{"./ParseContext":18,"./visitors/ProgramVisitor":39}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
class ActionsExpression extends Expression_1.Expression {
    constructor(actions) {
        super();
        this.actions = actions;
    }
}
exports.ActionsExpression = ActionsExpression;
},{"./Expression":24}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
class BinaryExpression extends Expression_1.Expression {
}
exports.BinaryExpression = BinaryExpression;
},{"./Expression":24}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinaryExpression_1 = require("./BinaryExpression");
class ConcatenationExpression extends BinaryExpression_1.BinaryExpression {
}
exports.ConcatenationExpression = ConcatenationExpression;
},{"./BinaryExpression":21}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
class ContainsExpression extends Expression_1.Expression {
    constructor(targetName, count, typeName) {
        super();
        this.targetName = targetName;
        this.count = count;
        this.typeName = typeName;
    }
}
exports.ContainsExpression = ContainsExpression;
},{"./Expression":24}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Expression {
}
exports.Expression = Expression;
},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
class FieldDeclarationExpression extends Expression_1.Expression {
    constructor() {
        super(...arguments);
        this.name = "";
        this.typeName = "";
        this.associatedExpressions = [];
    }
}
exports.FieldDeclarationExpression = FieldDeclarationExpression;
},{"./Expression":24}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
class IfExpression extends Expression_1.Expression {
    constructor(conditional, ifBlock, elseBlock) {
        super();
        this.conditional = conditional;
        this.ifBlock = ifBlock;
        this.elseBlock = elseBlock;
    }
}
exports.IfExpression = IfExpression;
},{"./Expression":24}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
class ListExpression extends Expression_1.Expression {
    constructor(items) {
        super();
        this.items = items;
    }
}
exports.ListExpression = ListExpression;
},{"./Expression":24}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
class LiteralExpression extends Expression_1.Expression {
    constructor(typeName, value) {
        super();
        this.typeName = typeName;
        this.value = value;
    }
}
exports.LiteralExpression = LiteralExpression;
},{"./Expression":24}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
class ProgramExpression extends Expression_1.Expression {
    constructor(expressions) {
        super();
        this.expressions = expressions;
    }
}
exports.ProgramExpression = ProgramExpression;
},{"./Expression":24}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
class SayExpression extends Expression_1.Expression {
    constructor(text) {
        super();
        this.text = text;
    }
}
exports.SayExpression = SayExpression;
},{"./Expression":24}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
class SetVariableExpression extends Expression_1.Expression {
    constructor(instanceName, variableName, evaluationExpression) {
        super();
        this.instanceName = instanceName;
        this.variableName = variableName;
        this.evaluationExpression = evaluationExpression;
    }
}
exports.SetVariableExpression = SetVariableExpression;
},{"./Expression":24}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
class TypeDeclarationExpression extends Expression_1.Expression {
    constructor(nameToken, baseTypeNameToken) {
        super();
        this.nameToken = nameToken;
        this.baseTypeNameToken = baseTypeNameToken;
        this.name = "";
        this.fields = [];
        this.events = [];
        this.name = nameToken.value;
    }
}
exports.TypeDeclarationExpression = TypeDeclarationExpression;
},{"./Expression":24}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
class UnderstandingDeclarationExpression extends Expression_1.Expression {
    constructor(value, meaning) {
        super();
        this.value = value;
        this.meaning = meaning;
    }
}
exports.UnderstandingDeclarationExpression = UnderstandingDeclarationExpression;
},{"./Expression":24}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
class WhenDeclarationExpression extends Expression_1.Expression {
    constructor(actor, eventKind, actions) {
        super();
        this.actor = actor;
        this.eventKind = eventKind;
        this.actions = actions;
    }
}
exports.WhenDeclarationExpression = WhenDeclarationExpression;
},{"./Expression":24}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExpressionVisitor_1 = require("./ExpressionVisitor");
const Keywords_1 = require("../../lexing/Keywords");
const ActionsExpression_1 = require("../expressions/ActionsExpression");
class EventExpressionVisitor extends ExpressionVisitor_1.ExpressionVisitor {
    visit(context) {
        const actions = [];
        while (!context.is(Keywords_1.Keywords.and)) {
            const action = super.visit(context);
            actions.push(action);
            context.expectSemiTerminator();
        }
        context.expect(Keywords_1.Keywords.and);
        context.expect(Keywords_1.Keywords.then);
        context.expect(Keywords_1.Keywords.stop);
        context.expectTerminator();
        return new ActionsExpression_1.ActionsExpression(actions);
    }
}
exports.EventExpressionVisitor = EventExpressionVisitor;
},{"../../lexing/Keywords":13,"../expressions/ActionsExpression":20,"./ExpressionVisitor":36}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Visitor_1 = require("./Visitor");
const Keywords_1 = require("../../lexing/Keywords");
const IfExpressionVisitor_1 = require("./IfExpressionVisitor");
const CompilationError_1 = require("../../exceptions/CompilationError");
const ContainsExpression_1 = require("../expressions/ContainsExpression");
const SayExpression_1 = require("../expressions/SayExpression");
const TokenType_1 = require("../../lexing/TokenType");
const SetVariableExpression_1 = require("../expressions/SetVariableExpression");
const LiteralExpression_1 = require("../expressions/LiteralExpression");
const NumberType_1 = require("../../../library/NumberType");
const StringType_1 = require("../../../library/StringType");
const ListExpression_1 = require("../expressions/ListExpression");
class ExpressionVisitor extends Visitor_1.Visitor {
    visit(context) {
        if (context.is(Keywords_1.Keywords.if)) {
            const visitor = new IfExpressionVisitor_1.IfExpressionVisitor();
            return visitor.visit(context);
        }
        else if (context.is(Keywords_1.Keywords.it)) {
            context.expect(Keywords_1.Keywords.it);
            context.expect(Keywords_1.Keywords.contains);
            const count = context.expectNumber();
            const typeName = context.expectIdentifier();
            return new ContainsExpression_1.ContainsExpression("~it", Number(count.value), typeName.value);
        }
        else if (context.is(Keywords_1.Keywords.set)) {
            context.expect(Keywords_1.Keywords.set);
            let variableName;
            if (context.isTypeOf(TokenType_1.TokenType.String)) {
                variableName = context.expectString().value;
            }
            else {
                // TODO: Support dereferencing arbitrary instances.
                throw new CompilationError_1.CompilationError("Currently unable to dereference a field, planned for a future release");
            }
            context.expect(Keywords_1.Keywords.to);
            const visitor = new ExpressionVisitor();
            const value = visitor.visit(context);
            return new SetVariableExpression_1.SetVariableExpression(undefined, variableName, value);
        }
        else if (context.is(Keywords_1.Keywords.say)) {
            context.expect(Keywords_1.Keywords.say);
            const text = context.expectString();
            return new SayExpression_1.SayExpression(text.value);
        }
        else if (context.isTypeOf(TokenType_1.TokenType.String)) {
            const value = context.expectString();
            return new LiteralExpression_1.LiteralExpression(StringType_1.StringType.typeName, value.value);
        }
        else if (context.isTypeOf(TokenType_1.TokenType.Number)) {
            const value = context.expectNumber();
            return new LiteralExpression_1.LiteralExpression(NumberType_1.NumberType.typeName, value.value);
        }
        else if (context.isTypeOf(TokenType_1.TokenType.ListSeparator)) {
            const items = [];
            while (context.isTypeOf(TokenType_1.TokenType.ListSeparator)) {
                context.consumeCurrentToken();
                const item = this.visit(context);
                items.push(item);
            }
            return new ListExpression_1.ListExpression(items);
        }
        else {
            throw new CompilationError_1.CompilationError("Unable to parse expression");
        }
    }
}
exports.ExpressionVisitor = ExpressionVisitor;
},{"../../../library/NumberType":56,"../../../library/StringType":60,"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../../lexing/TokenType":17,"../expressions/ContainsExpression":23,"../expressions/ListExpression":27,"../expressions/LiteralExpression":28,"../expressions/SayExpression":30,"../expressions/SetVariableExpression":31,"./IfExpressionVisitor":38,"./Visitor":43}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Visitor_1 = require("./Visitor");
const Keywords_1 = require("../../lexing/Keywords");
const FieldDeclarationExpression_1 = require("../expressions/FieldDeclarationExpression");
const Place_1 = require("../../../library/Place");
const BooleanType_1 = require("../../../library/BooleanType");
const CompilationError_1 = require("../../exceptions/CompilationError");
const WorldObject_1 = require("../../../library/WorldObject");
const StringType_1 = require("../../../library/StringType");
const List_1 = require("../../../library/List");
const ExpressionVisitor_1 = require("./ExpressionVisitor");
const ConcatenationExpression_1 = require("../expressions/ConcatenationExpression");
const TokenType_1 = require("../../lexing/TokenType");
const NumberType_1 = require("../../../library/NumberType");
class FieldDeclarationVisitor extends Visitor_1.Visitor {
    visit(context) {
        const field = new FieldDeclarationExpression_1.FieldDeclarationExpression();
        context.expect(Keywords_1.Keywords.it);
        if (context.is(Keywords_1.Keywords.is)) {
            context.expect(Keywords_1.Keywords.is);
            if (context.isAnyOf(Keywords_1.Keywords.not, Keywords_1.Keywords.visible)) {
                let isVisible = true;
                if (context.is(Keywords_1.Keywords.not)) {
                    context.expect(Keywords_1.Keywords.not);
                    isVisible = false;
                }
                context.expect(Keywords_1.Keywords.visible);
                field.name = WorldObject_1.WorldObject.visible;
                field.typeName = BooleanType_1.BooleanType.typeName;
                field.initialValue = isVisible;
            }
            else if (context.is(Keywords_1.Keywords.observed)) {
                context.expect(Keywords_1.Keywords.observed);
                context.expect(Keywords_1.Keywords.as);
                const observation = context.expectString();
                field.name = WorldObject_1.WorldObject.observation;
                field.typeName = StringType_1.StringType.typeName;
                field.initialValue = observation.value;
            }
            else if (context.is(Keywords_1.Keywords.described)) {
                context.expect(Keywords_1.Keywords.described);
                context.expect(Keywords_1.Keywords.as);
                const description = context.expectString();
                field.name = WorldObject_1.WorldObject.description;
                field.typeName = StringType_1.StringType.typeName;
                field.initialValue = description.value;
                while (context.is(Keywords_1.Keywords.and)) {
                    context.expect(Keywords_1.Keywords.and);
                    const expressionVisitor = new ExpressionVisitor_1.ExpressionVisitor();
                    const expression = expressionVisitor.visit(context);
                    const leftExpression = (field.associatedExpressions.length == 0) ? field : field.associatedExpressions[field.associatedExpressions.length - 1];
                    const concat = new ConcatenationExpression_1.ConcatenationExpression();
                    concat.left = leftExpression;
                    concat.right = expression;
                    field.associatedExpressions.push(concat);
                }
            }
            else if (context.is(Keywords_1.Keywords.where)) {
                context.expect(Keywords_1.Keywords.where);
                context.expect(Keywords_1.Keywords.the);
                context.expect(Keywords_1.Keywords.player);
                context.expect(Keywords_1.Keywords.starts);
                field.name = Place_1.Place.isPlayerStart;
                field.typeName = BooleanType_1.BooleanType.typeName;
                field.initialValue = true;
            }
            else {
                throw new CompilationError_1.CompilationError("Unable to determine property field");
            }
        }
        else if (context.is(Keywords_1.Keywords.has)) {
            context.expect(Keywords_1.Keywords.has);
            context.expect(Keywords_1.Keywords.a);
            const name = context.expectString();
            context.expect(Keywords_1.Keywords.that);
            context.expect(Keywords_1.Keywords.is);
            if (context.isTypeOf(TokenType_1.TokenType.String)) {
                field.typeName = StringType_1.StringType.typeName;
                field.initialValue = context.expectString().value;
            }
            else if (context.isTypeOf(TokenType_1.TokenType.Number)) {
                field.typeName = NumberType_1.NumberType.typeName;
                field.initialValue = context.expectNumber().value;
            }
            else {
                throw new CompilationError_1.CompilationError(`Expected a string or a number but found '${context.currentToken.value}'`);
            }
            field.name = name.value;
        }
        else if (context.is(Keywords_1.Keywords.contains)) {
            context.expect(Keywords_1.Keywords.contains);
            const expectPair = () => {
                const count = context.expectNumber();
                const name = context.expectIdentifier();
                return [Number(count.value), name.value];
            };
            const items = [expectPair()];
            while (context.isTypeOf(TokenType_1.TokenType.ListSeparator)) {
                context.consumeCurrentToken();
                items.push(expectPair());
            }
            field.name = WorldObject_1.WorldObject.contents;
            field.typeName = List_1.List.typeName;
            field.initialValue = items;
        }
        else if (context.is(Keywords_1.Keywords.can)) {
            context.expect(Keywords_1.Keywords.can);
            context.expect(Keywords_1.Keywords.reach);
            context.expect(Keywords_1.Keywords.the);
            const placeName = context.expectIdentifier();
            context.expect(Keywords_1.Keywords.by);
            context.expect(Keywords_1.Keywords.going);
            const direction = context.expectString();
            field.name = `~${direction.value}`;
            field.typeName = StringType_1.StringType.typeName;
            field.initialValue = `${placeName.value}`;
        }
        else {
            throw new CompilationError_1.CompilationError("Unable to determine field");
        }
        context.expectTerminator();
        return field;
    }
}
exports.FieldDeclarationVisitor = FieldDeclarationVisitor;
},{"../../../library/BooleanType":49,"../../../library/List":55,"../../../library/NumberType":56,"../../../library/Place":57,"../../../library/StringType":60,"../../../library/WorldObject":62,"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../../lexing/TokenType":17,"../expressions/ConcatenationExpression":22,"../expressions/FieldDeclarationExpression":25,"./ExpressionVisitor":36,"./Visitor":43}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Visitor_1 = require("./Visitor");
const Expression_1 = require("../expressions/Expression");
const Keywords_1 = require("../../lexing/Keywords");
const ExpressionVisitor_1 = require("./ExpressionVisitor");
const IfExpression_1 = require("../expressions/IfExpression");
class IfExpressionVisitor extends Visitor_1.Visitor {
    visit(context) {
        context.expect(Keywords_1.Keywords.if);
        const expressionVisitor = new ExpressionVisitor_1.ExpressionVisitor();
        const conditional = expressionVisitor.visit(context);
        context.expect(Keywords_1.Keywords.then);
        const ifBlock = expressionVisitor.visit(context);
        if (context.is(Keywords_1.Keywords.else)) {
            context.expect(Keywords_1.Keywords.else);
            const elseBlock = expressionVisitor.visit(context);
            return new IfExpression_1.IfExpression(conditional, ifBlock, elseBlock);
        }
        return new IfExpression_1.IfExpression(conditional, ifBlock, new Expression_1.Expression());
    }
}
exports.IfExpressionVisitor = IfExpressionVisitor;
},{"../../lexing/Keywords":13,"../expressions/Expression":24,"../expressions/IfExpression":26,"./ExpressionVisitor":36,"./Visitor":43}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Visitor_1 = require("./Visitor");
const Keywords_1 = require("../../lexing/Keywords");
const TypeDeclarationVisitor_1 = require("./TypeDeclarationVisitor");
const ProgramExpression_1 = require("../expressions/ProgramExpression");
const CompilationError_1 = require("../../exceptions/CompilationError");
const UnderstandingDeclarationVisitor_1 = require("./UnderstandingDeclarationVisitor");
const SayExpressionVisitor_1 = require("./SayExpressionVisitor");
class ProgramVisitor extends Visitor_1.Visitor {
    visit(context) {
        let expressions = [];
        while (!context.isDone) {
            if (context.is(Keywords_1.Keywords.understand)) {
                const understandingDeclaration = new UnderstandingDeclarationVisitor_1.UnderstandingDeclarationVisitor();
                const expression = understandingDeclaration.visit(context);
                expressions.push(expression);
            }
            else if (context.isAnyOf(Keywords_1.Keywords.a, Keywords_1.Keywords.an)) {
                const typeDeclaration = new TypeDeclarationVisitor_1.TypeDeclarationVisitor();
                const expression = typeDeclaration.visit(context);
                expressions.push(expression);
            }
            else if (context.is(Keywords_1.Keywords.say)) {
                const sayExpression = new SayExpressionVisitor_1.SayExpressionVisitor();
                const expression = sayExpression.visit(context);
                // At the top level, a say expression must have a terminator. We're evaluating it out here
                // because a say expression normally doesn't require one.
                context.expectTerminator();
                expressions.push(expression);
            }
            else {
                throw new CompilationError_1.CompilationError(`Found unexpected token '${context.currentToken}'`);
            }
        }
        return new ProgramExpression_1.ProgramExpression(expressions);
    }
}
exports.ProgramVisitor = ProgramVisitor;
},{"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../expressions/ProgramExpression":29,"./SayExpressionVisitor":40,"./TypeDeclarationVisitor":41,"./UnderstandingDeclarationVisitor":42,"./Visitor":43}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Visitor_1 = require("./Visitor");
const Keywords_1 = require("../../lexing/Keywords");
const SayExpression_1 = require("../expressions/SayExpression");
class SayExpressionVisitor extends Visitor_1.Visitor {
    visit(context) {
        context.expect(Keywords_1.Keywords.say);
        const text = context.expectString();
        return new SayExpression_1.SayExpression(text.value);
    }
}
exports.SayExpressionVisitor = SayExpressionVisitor;
},{"../../lexing/Keywords":13,"../expressions/SayExpression":30,"./Visitor":43}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Visitor_1 = require("./Visitor");
const Keywords_1 = require("../../lexing/Keywords");
const TypeDeclarationExpression_1 = require("../expressions/TypeDeclarationExpression");
const FieldDeclarationVisitor_1 = require("./FieldDeclarationVisitor");
const WhenDeclarationVisitor_1 = require("./WhenDeclarationVisitor");
class TypeDeclarationVisitor extends Visitor_1.Visitor {
    visit(context) {
        context.expectAnyOf(Keywords_1.Keywords.a, Keywords_1.Keywords.an);
        const name = context.expectIdentifier();
        context.expect(Keywords_1.Keywords.is);
        context.expect(Keywords_1.Keywords.a);
        context.expect(Keywords_1.Keywords.kind);
        context.expect(Keywords_1.Keywords.of);
        const baseType = this.expectBaseType(context);
        context.expectTerminator();
        const fields = [];
        while (context.is(Keywords_1.Keywords.it)) {
            const fieldVisitor = new FieldDeclarationVisitor_1.FieldDeclarationVisitor();
            const field = fieldVisitor.visit(context);
            fields.push(field);
        }
        const events = [];
        while (context.is(Keywords_1.Keywords.when)) {
            const whenVisitor = new WhenDeclarationVisitor_1.WhenDeclarationVisitor();
            const when = whenVisitor.visit(context);
            events.push(when);
        }
        const typeDeclaration = new TypeDeclarationExpression_1.TypeDeclarationExpression(name, baseType);
        typeDeclaration.fields = fields;
        typeDeclaration.events = events;
        return typeDeclaration;
    }
    expectBaseType(context) {
        if (context.isAnyOf(Keywords_1.Keywords.place, Keywords_1.Keywords.item, Keywords_1.Keywords.decoration)) {
            return context.consumeCurrentToken();
        }
        else {
            return context.expectIdentifier();
        }
    }
}
exports.TypeDeclarationVisitor = TypeDeclarationVisitor;
},{"../../lexing/Keywords":13,"../expressions/TypeDeclarationExpression":32,"./FieldDeclarationVisitor":37,"./Visitor":43,"./WhenDeclarationVisitor":44}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Visitor_1 = require("./Visitor");
const Keywords_1 = require("../../lexing/Keywords");
const UnderstandingDeclarationExpression_1 = require("../expressions/UnderstandingDeclarationExpression");
class UnderstandingDeclarationVisitor extends Visitor_1.Visitor {
    visit(context) {
        context.expect(Keywords_1.Keywords.understand);
        const value = context.expectString();
        context.expect(Keywords_1.Keywords.as);
        const meaning = context.expectAnyOf(Keywords_1.Keywords.describing, Keywords_1.Keywords.moving, Keywords_1.Keywords.directions, Keywords_1.Keywords.taking, Keywords_1.Keywords.inventory, Keywords_1.Keywords.dropping);
        context.expectTerminator();
        return new UnderstandingDeclarationExpression_1.UnderstandingDeclarationExpression(value.value, meaning.value);
    }
}
exports.UnderstandingDeclarationVisitor = UnderstandingDeclarationVisitor;
},{"../../lexing/Keywords":13,"../expressions/UnderstandingDeclarationExpression":33,"./Visitor":43}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Visitor {
}
exports.Visitor = Visitor;
},{}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Visitor_1 = require("./Visitor");
const Keywords_1 = require("../../lexing/Keywords");
const WhenDeclarationExpression_1 = require("../expressions/WhenDeclarationExpression");
const EventExpressionVisitor_1 = require("./EventExpressionVisitor");
class WhenDeclarationVisitor extends Visitor_1.Visitor {
    visit(context) {
        context.expect(Keywords_1.Keywords.when);
        context.expect(Keywords_1.Keywords.the);
        context.expect(Keywords_1.Keywords.player);
        const eventKind = context.expectAnyOf(Keywords_1.Keywords.enters, Keywords_1.Keywords.exits);
        context.expectOpenMethodBlock();
        const actionsVisitor = new EventExpressionVisitor_1.EventExpressionVisitor();
        const actions = actionsVisitor.visit(context);
        return new WhenDeclarationExpression_1.WhenDeclarationExpression(Keywords_1.Keywords.player, eventKind.value, actions);
    }
}
exports.WhenDeclarationVisitor = WhenDeclarationVisitor;
},{"../../lexing/Keywords":13,"../expressions/WhenDeclarationExpression":34,"./EventExpressionVisitor":35,"./Visitor":43}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramExpression_1 = require("../parsing/expressions/ProgramExpression");
const TypeDeclarationExpression_1 = require("../parsing/expressions/TypeDeclarationExpression");
const Token_1 = require("../lexing/Token");
const TokenType_1 = require("../lexing/TokenType");
class TalonSemanticAnalyzer {
    constructor(out) {
        this.out = out;
        this.any = new TypeDeclarationExpression_1.TypeDeclarationExpression(Token_1.Token.forAny, Token_1.Token.empty);
        this.worldObject = new TypeDeclarationExpression_1.TypeDeclarationExpression(Token_1.Token.forWorldObject, Token_1.Token.forAny);
        this.place = new TypeDeclarationExpression_1.TypeDeclarationExpression(Token_1.Token.forPlace, Token_1.Token.forWorldObject);
        this.item = new TypeDeclarationExpression_1.TypeDeclarationExpression(Token_1.Token.forItem, Token_1.Token.forWorldObject);
        this.booleanType = new TypeDeclarationExpression_1.TypeDeclarationExpression(Token_1.Token.forBoolean, Token_1.Token.forAny);
        this.list = new TypeDeclarationExpression_1.TypeDeclarationExpression(Token_1.Token.forList, Token_1.Token.forAny);
        this.decoration = new TypeDeclarationExpression_1.TypeDeclarationExpression(Token_1.Token.forDecoration, Token_1.Token.forWorldObject);
    }
    analyze(expression) {
        const types = [this.any, this.worldObject, this.place, this.booleanType, this.item, this.decoration];
        if (expression instanceof ProgramExpression_1.ProgramExpression) {
            for (let child of expression.expressions) {
                if (child instanceof TypeDeclarationExpression_1.TypeDeclarationExpression) {
                    types.push(child);
                }
            }
        }
        const typesByName = new Map(types.map(x => [x.name, x]));
        for (const declaration of types) {
            const baseToken = declaration.baseTypeNameToken;
            if (baseToken.type == TokenType_1.TokenType.Keyword && !baseToken.value.startsWith("~")) {
                const name = `~${baseToken.value}`;
                declaration.baseType = typesByName.get(name);
            }
            else {
                declaration.baseType = typesByName.get(baseToken.value);
            }
            for (const field of declaration.fields) {
                field.type = typesByName.get(field.typeName);
            }
        }
        return expression;
    }
}
exports.TalonSemanticAnalyzer = TalonSemanticAnalyzer;
},{"../lexing/Token":16,"../lexing/TokenType":17,"../parsing/expressions/ProgramExpression":29,"../parsing/expressions/TypeDeclarationExpression":32}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExpressionTransformationMode;
(function (ExpressionTransformationMode) {
    ExpressionTransformationMode[ExpressionTransformationMode["None"] = 0] = "None";
    ExpressionTransformationMode[ExpressionTransformationMode["IgnoreResultsOfSayExpression"] = 1] = "IgnoreResultsOfSayExpression";
})(ExpressionTransformationMode = exports.ExpressionTransformationMode || (exports.ExpressionTransformationMode = {}));
},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Type_1 = require("../../common/Type");
const ProgramExpression_1 = require("../parsing/expressions/ProgramExpression");
const CompilationError_1 = require("../exceptions/CompilationError");
const TypeDeclarationExpression_1 = require("../parsing/expressions/TypeDeclarationExpression");
const UnderstandingDeclarationExpression_1 = require("../parsing/expressions/UnderstandingDeclarationExpression");
const Understanding_1 = require("../../library/Understanding");
const Field_1 = require("../../common/Field");
const Any_1 = require("../../library/Any");
const WorldObject_1 = require("../../library/WorldObject");
const Place_1 = require("../../library/Place");
const BooleanType_1 = require("../../library/BooleanType");
const StringType_1 = require("../../library/StringType");
const Item_1 = require("../../library/Item");
const NumberType_1 = require("../../library/NumberType");
const List_1 = require("../../library/List");
const Player_1 = require("../../library/Player");
const SayExpression_1 = require("../parsing/expressions/SayExpression");
const Method_1 = require("../../common/Method");
const Say_1 = require("../../library/Say");
const Instruction_1 = require("../../common/Instruction");
const Parameter_1 = require("../../common/Parameter");
const IfExpression_1 = require("../parsing/expressions/IfExpression");
const ConcatenationExpression_1 = require("../parsing/expressions/ConcatenationExpression");
const ContainsExpression_1 = require("../parsing/expressions/ContainsExpression");
const FieldDeclarationExpression_1 = require("../parsing/expressions/FieldDeclarationExpression");
const Keywords_1 = require("../lexing/Keywords");
const EventType_1 = require("../../common/EventType");
const ExpressionTransformationMode_1 = require("./ExpressionTransformationMode");
const SetVariableExpression_1 = require("../parsing/expressions/SetVariableExpression");
const LiteralExpression_1 = require("../parsing/expressions/LiteralExpression");
const Decoration_1 = require("../../library/Decoration");
class TalonTransformer {
    constructor(out) {
        this.out = out;
    }
    createSystemTypes() {
        const types = [];
        // These are only here as stubs for external runtime types that allow us to correctly resolve field types.
        types.push(new Type_1.Type(Any_1.Any.typeName, Any_1.Any.parentTypeName));
        types.push(new Type_1.Type(WorldObject_1.WorldObject.typeName, WorldObject_1.WorldObject.parentTypeName));
        types.push(new Type_1.Type(Place_1.Place.typeName, Place_1.Place.parentTypeName));
        types.push(new Type_1.Type(BooleanType_1.BooleanType.typeName, BooleanType_1.BooleanType.parentTypeName));
        types.push(new Type_1.Type(StringType_1.StringType.typeName, StringType_1.StringType.parentTypeName));
        types.push(new Type_1.Type(NumberType_1.NumberType.typeName, NumberType_1.NumberType.parentTypeName));
        types.push(new Type_1.Type(Item_1.Item.typeName, Item_1.Item.parentTypeName));
        types.push(new Type_1.Type(List_1.List.typeName, List_1.List.parentTypeName));
        types.push(new Type_1.Type(Player_1.Player.typeName, Player_1.Player.parentTypeName));
        types.push(new Type_1.Type(Say_1.Say.typeName, Say_1.Say.parentTypeName));
        types.push(new Type_1.Type(Decoration_1.Decoration.typeName, Decoration_1.Decoration.parentTypeName));
        return new Map(types.map(x => [x.name, x]));
    }
    transform(expression) {
        const typesByName = this.createSystemTypes();
        let dynamicTypeCount = 0;
        if (expression instanceof ProgramExpression_1.ProgramExpression) {
            for (const child of expression.expressions) {
                if (child instanceof UnderstandingDeclarationExpression_1.UnderstandingDeclarationExpression) {
                    const type = new Type_1.Type(`~${Understanding_1.Understanding.typeName}_${dynamicTypeCount}`, Understanding_1.Understanding.typeName);
                    const action = new Field_1.Field();
                    action.name = Understanding_1.Understanding.action;
                    action.defaultValue = child.value;
                    const meaning = new Field_1.Field();
                    meaning.name = Understanding_1.Understanding.meaning;
                    meaning.defaultValue = child.meaning;
                    type.fields.push(action);
                    type.fields.push(meaning);
                    dynamicTypeCount++;
                    typesByName.set(type.name, type);
                }
                else if (child instanceof TypeDeclarationExpression_1.TypeDeclarationExpression) {
                    const type = this.transformInitialTypeDeclaration(child);
                    typesByName.set(type.name, type);
                }
            }
            for (const child of expression.expressions) {
                if (child instanceof TypeDeclarationExpression_1.TypeDeclarationExpression) {
                    const type = typesByName.get(child.name);
                    for (const fieldExpression of child.fields) {
                        const field = new Field_1.Field();
                        field.name = fieldExpression.name;
                        field.typeName = fieldExpression.typeName;
                        field.type = typesByName.get(fieldExpression.typeName);
                        if (fieldExpression.initialValue) {
                            if (field.typeName == StringType_1.StringType.typeName) {
                                const value = fieldExpression.initialValue;
                                field.defaultValue = value;
                            }
                            else if (field.typeName == NumberType_1.NumberType.typeName) {
                                const value = Number(fieldExpression.initialValue);
                                field.defaultValue = value;
                            }
                            else if (field.typeName == BooleanType_1.BooleanType.typeName) {
                                const value = Boolean(fieldExpression.initialValue);
                                field.defaultValue = value;
                            }
                            else {
                                field.defaultValue = fieldExpression.initialValue;
                            }
                        }
                        if (fieldExpression.associatedExpressions.length > 0) {
                            const getField = new Method_1.Method();
                            getField.name = `~get_${field.name}`;
                            getField.parameters.push(new Parameter_1.Parameter("~value", field.typeName));
                            getField.returnType = field.typeName;
                            for (const associated of fieldExpression.associatedExpressions) {
                                getField.body.push(...this.transformExpression(associated));
                            }
                            getField.body.push(Instruction_1.Instruction.return());
                            type === null || type === void 0 ? void 0 : type.methods.push(getField);
                        }
                        type === null || type === void 0 ? void 0 : type.fields.push(field);
                    }
                    let isWorldObject = false;
                    for (let current = type; current; current = typesByName.get(current.baseTypeName)) {
                        if (current.name == WorldObject_1.WorldObject.typeName) {
                            isWorldObject = true;
                            break;
                        }
                    }
                    if (isWorldObject) {
                        const describe = new Method_1.Method();
                        describe.name = WorldObject_1.WorldObject.describe;
                        describe.body.push(Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadProperty(WorldObject_1.WorldObject.visible), Instruction_1.Instruction.branchRelativeIfFalse(3), Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadProperty(WorldObject_1.WorldObject.description), Instruction_1.Instruction.print(), Instruction_1.Instruction.return());
                        type === null || type === void 0 ? void 0 : type.methods.push(describe);
                        const observe = new Method_1.Method();
                        observe.name = WorldObject_1.WorldObject.observe;
                        observe.body.push(Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadProperty(WorldObject_1.WorldObject.visible), Instruction_1.Instruction.branchRelativeIfFalse(3), Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadProperty(WorldObject_1.WorldObject.observation), Instruction_1.Instruction.print(), Instruction_1.Instruction.return());
                        type === null || type === void 0 ? void 0 : type.methods.push(observe);
                        if (!(type === null || type === void 0 ? void 0 : type.fields.find(x => x.name == WorldObject_1.WorldObject.visible))) {
                            const visible = new Field_1.Field();
                            visible.name = WorldObject_1.WorldObject.visible;
                            visible.typeName = BooleanType_1.BooleanType.typeName;
                            visible.defaultValue = true;
                            type === null || type === void 0 ? void 0 : type.fields.push(visible);
                        }
                        if (!(type === null || type === void 0 ? void 0 : type.fields.find(x => x.name == WorldObject_1.WorldObject.contents))) {
                            const contents = new Field_1.Field();
                            contents.name = WorldObject_1.WorldObject.contents;
                            contents.typeName = List_1.List.typeName;
                            contents.defaultValue = [];
                            type === null || type === void 0 ? void 0 : type.fields.push(contents);
                        }
                        if (!(type === null || type === void 0 ? void 0 : type.fields.find(x => x.name == WorldObject_1.WorldObject.observation))) {
                            const observation = new Field_1.Field();
                            observation.name = WorldObject_1.WorldObject.observation;
                            observation.typeName = StringType_1.StringType.typeName;
                            observation.defaultValue = "";
                            type === null || type === void 0 ? void 0 : type.fields.push(observation);
                        }
                        let duplicateEventCount = 0;
                        for (const event of child.events) {
                            const method = new Method_1.Method();
                            method.name = `~event_${event.actor}_${event.eventKind}_${duplicateEventCount}`;
                            method.eventType = this.transformEventKind(event.eventKind);
                            duplicateEventCount++;
                            const actions = event.actions;
                            for (const action of actions.actions) {
                                const body = this.transformExpression(action, ExpressionTransformationMode_1.ExpressionTransformationMode.IgnoreResultsOfSayExpression);
                                method.body.push(...body);
                            }
                            method.body.push(Instruction_1.Instruction.return());
                            type === null || type === void 0 ? void 0 : type.methods.push(method);
                        }
                    }
                }
            }
            const globalSays = expression.expressions.filter(x => x instanceof SayExpression_1.SayExpression);
            const type = new Type_1.Type(`~globalSays`, Say_1.Say.typeName);
            const method = new Method_1.Method();
            method.name = Say_1.Say.typeName;
            method.parameters = [];
            const instructions = [];
            for (const say of globalSays) {
                const sayExpression = say;
                instructions.push(Instruction_1.Instruction.loadString(sayExpression.text), Instruction_1.Instruction.print());
            }
            instructions.push(Instruction_1.Instruction.return());
            method.body = instructions;
            type.methods.push(method);
            typesByName.set(type.name, type);
        }
        else {
            throw new CompilationError_1.CompilationError("Unable to partially transform");
        }
        this.out.write(`Created ${typesByName.size} types...`);
        return Array.from(typesByName.values());
    }
    transformEventKind(kind) {
        switch (kind) {
            case Keywords_1.Keywords.enters: {
                return EventType_1.EventType.PlayerEntersPlace;
            }
            case Keywords_1.Keywords.exits: {
                return EventType_1.EventType.PlayerExitsPlace;
            }
            default: {
                throw new CompilationError_1.CompilationError(`Unable to transform unsupported event kind '${kind}'`);
            }
        }
    }
    transformExpression(expression, mode) {
        const instructions = [];
        if (expression instanceof IfExpression_1.IfExpression) {
            const conditional = this.transformExpression(expression.conditional, mode);
            instructions.push(...conditional);
            const ifBlock = this.transformExpression(expression.ifBlock, mode);
            const elseBlock = this.transformExpression(expression.elseBlock, mode);
            ifBlock.push(Instruction_1.Instruction.branchRelative(elseBlock.length));
            instructions.push(Instruction_1.Instruction.branchRelativeIfFalse(ifBlock.length));
            instructions.push(...ifBlock);
            instructions.push(...elseBlock);
        }
        else if (expression instanceof SayExpression_1.SayExpression) {
            instructions.push(Instruction_1.Instruction.loadString(expression.text));
            instructions.push(Instruction_1.Instruction.print());
            if (mode != ExpressionTransformationMode_1.ExpressionTransformationMode.IgnoreResultsOfSayExpression) {
                instructions.push(Instruction_1.Instruction.loadString(expression.text));
            }
        }
        else if (expression instanceof ContainsExpression_1.ContainsExpression) {
            instructions.push(Instruction_1.Instruction.loadNumber(expression.count), Instruction_1.Instruction.loadString(expression.typeName), Instruction_1.Instruction.loadInstance(expression.targetName), Instruction_1.Instruction.loadField(WorldObject_1.WorldObject.contents), Instruction_1.Instruction.instanceCall(List_1.List.contains));
        }
        else if (expression instanceof ConcatenationExpression_1.ConcatenationExpression) {
            const left = this.transformExpression(expression.left, mode);
            const right = this.transformExpression(expression.right, mode);
            instructions.push(...left);
            instructions.push(...right);
            instructions.push(Instruction_1.Instruction.concatenate());
        }
        else if (expression instanceof FieldDeclarationExpression_1.FieldDeclarationExpression) {
            instructions.push(Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadField(expression.name));
        }
        else if (expression instanceof SetVariableExpression_1.SetVariableExpression) {
            const right = this.transformExpression(expression.evaluationExpression);
            instructions.push(...right, Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadField(expression.variableName), Instruction_1.Instruction.assign());
        }
        else if (expression instanceof LiteralExpression_1.LiteralExpression) {
            if (expression.typeName == StringType_1.StringType.typeName) {
                instructions.push(Instruction_1.Instruction.loadString(expression.value));
            }
            else if (expression.typeName == NumberType_1.NumberType.typeName) {
                instructions.push(Instruction_1.Instruction.loadNumber(Number(expression.value)));
            }
            else {
                throw new CompilationError_1.CompilationError(`Unable to transform unsupported literal expression '${expression}'`);
            }
        }
        else {
            throw new CompilationError_1.CompilationError("Unable to transform unsupported expression");
        }
        return instructions;
    }
    transformInitialTypeDeclaration(expression) {
        return new Type_1.Type(expression.name, expression.baseType.name);
    }
}
exports.TalonTransformer = TalonTransformer;
},{"../../common/EventType":3,"../../common/Field":4,"../../common/Instruction":5,"../../common/Method":6,"../../common/Parameter":8,"../../common/Type":9,"../../library/Any":48,"../../library/BooleanType":49,"../../library/Decoration":50,"../../library/Item":54,"../../library/List":55,"../../library/NumberType":56,"../../library/Place":57,"../../library/Player":58,"../../library/Say":59,"../../library/StringType":60,"../../library/Understanding":61,"../../library/WorldObject":62,"../exceptions/CompilationError":12,"../lexing/Keywords":13,"../parsing/expressions/ConcatenationExpression":22,"../parsing/expressions/ContainsExpression":23,"../parsing/expressions/FieldDeclarationExpression":25,"../parsing/expressions/IfExpression":26,"../parsing/expressions/LiteralExpression":28,"../parsing/expressions/ProgramExpression":29,"../parsing/expressions/SayExpression":30,"../parsing/expressions/SetVariableExpression":31,"../parsing/expressions/TypeDeclarationExpression":32,"../parsing/expressions/UnderstandingDeclarationExpression":33,"./ExpressionTransformationMode":46}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExternCall_1 = require("./ExternCall");
class Any {
}
exports.Any = Any;
Any.parentTypeName = "";
Any.typeName = "~any";
Any.main = "~main";
Any.externToString = ExternCall_1.ExternCall.of("~toString");
},{"./ExternCall":53}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class BooleanType {
}
exports.BooleanType = BooleanType;
BooleanType.parentTypeName = Any_1.Any.typeName;
BooleanType.typeName = "~boolean";
},{"./Any":48}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Decoration {
}
exports.Decoration = Decoration;
Decoration.parentTypeName = WorldObject_1.WorldObject.typeName;
Decoration.typeName = "~decoration";
},{"./WorldObject":62}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class Delegate {
}
exports.Delegate = Delegate;
Delegate.typeName = "~delegate";
Delegate.parentTypeName = Any_1.Any.typeName;
},{"./Any":48}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntryPointAttribute {
    constructor() {
        this.name = "~entryPoint";
    }
}
exports.EntryPointAttribute = EntryPointAttribute;
},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExternCall {
    constructor(name, ...args) {
        this.name = "";
        this.args = [];
        this.name = name;
        this.args = args;
    }
    static of(name, ...args) {
        return new ExternCall(name, ...args);
    }
}
exports.ExternCall = ExternCall;
},{}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Item {
}
exports.Item = Item;
Item.typeName = "~item";
Item.parentTypeName = WorldObject_1.WorldObject.typeName;
},{"./WorldObject":62}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class List {
}
exports.List = List;
List.typeName = "~list";
List.parentTypeName = Any_1.Any.typeName;
List.contains = "~contains";
List.typeNameParameter = "~typeName";
List.countParameter = "~count";
},{"./Any":48}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class NumberType {
}
exports.NumberType = NumberType;
NumberType.typeName = "~number";
NumberType.parentTypeName = Any_1.Any.typeName;
},{"./Any":48}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Place {
}
exports.Place = Place;
Place.parentTypeName = WorldObject_1.WorldObject.typeName;
Place.typeName = "~place";
Place.isPlayerStart = "~isPlayerStart";
},{"./WorldObject":62}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Player {
}
exports.Player = Player;
Player.typeName = "~player";
Player.parentTypeName = WorldObject_1.WorldObject.typeName;
},{"./WorldObject":62}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class Say {
}
exports.Say = Say;
Say.typeName = "~say";
Say.parentTypeName = Any_1.Any.typeName;
},{"./Any":48}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class StringType {
}
exports.StringType = StringType;
StringType.parentTypeName = Any_1.Any.typeName;
StringType.typeName = "~string";
},{"./Any":48}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class Understanding {
}
exports.Understanding = Understanding;
Understanding.parentTypeName = Any_1.Any.typeName;
Understanding.typeName = "~understanding";
Understanding.describing = "~describing";
Understanding.moving = "~moving";
Understanding.direction = "~direction";
Understanding.taking = "~taking";
Understanding.inventory = "~inventory";
Understanding.dropping = "~dropping";
Understanding.action = "~action";
Understanding.meaning = "~meaning";
},{"./Any":48}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class WorldObject {
}
exports.WorldObject = WorldObject;
WorldObject.parentTypeName = Any_1.Any.typeName;
WorldObject.typeName = "~worldObject";
WorldObject.description = "~description";
WorldObject.contents = "~contents";
WorldObject.observation = "~observation";
WorldObject.describe = "~describe";
WorldObject.observe = "~observe";
WorldObject.visible = "~visible";
},{"./Any":48}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TalonIde_1 = require("./TalonIde");
var ide = new TalonIde_1.TalonIde();
},{"./TalonIde":2}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EvaluationResult;
(function (EvaluationResult) {
    EvaluationResult[EvaluationResult["Continue"] = 0] = "Continue";
    EvaluationResult[EvaluationResult["SuspendForInput"] = 1] = "SuspendForInput";
})(EvaluationResult = exports.EvaluationResult || (exports.EvaluationResult = {}));
},{}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StackFrame_1 = require("./StackFrame");
const RuntimeError_1 = require("./errors/RuntimeError");
class MethodActivation {
    constructor(method) {
        this.stack = [];
        this.method = method;
        this.stackFrame = new StackFrame_1.StackFrame(method);
    }
    stackSize() {
        return this.stack.length;
    }
    peek() {
        if (this.stack.length == 0) {
            throw new RuntimeError_1.RuntimeError(`Stack Imbalance! Attempted to peek an empty stack.`);
        }
        return this.stack[this.stack.length - 1];
    }
    pop() {
        if (this.stack.length == 0) {
            throw new RuntimeError_1.RuntimeError(`Stack Imbalance! Attempted to pop an empty stack.`);
        }
        return this.stack.pop();
    }
    push(runtimeAny) {
        this.stack.push(runtimeAny);
    }
}
exports.MethodActivation = MethodActivation;
},{"./StackFrame":67,"./errors/RuntimeError":71}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCode_1 = require("../common/OpCode");
const EvaluationResult_1 = require("./EvaluationResult");
class OpCodeHandler {
    constructor() {
        this.code = OpCode_1.OpCode.NoOp;
    }
    handle(thread) {
        return EvaluationResult_1.EvaluationResult.Continue;
    }
}
exports.OpCodeHandler = OpCodeHandler;
},{"../common/OpCode":7,"./EvaluationResult":64}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Variable_1 = require("./library/Variable");
class StackFrame {
    constructor(method) {
        this.locals = [];
        this.currentInstruction = -1;
        for (var parameter of method.parameters) {
            const variable = new Variable_1.Variable(parameter.name, parameter.type);
            this.locals.push(variable);
        }
    }
}
exports.StackFrame = StackFrame;
},{"./library/Variable":111}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Thread_1 = require("./Thread");
const EntryPointAttribute_1 = require("../library/EntryPointAttribute");
const Any_1 = require("../library/Any");
const MethodActivation_1 = require("./MethodActivation");
const EvaluationResult_1 = require("./EvaluationResult");
const OpCode_1 = require("../common/OpCode");
const PrintHandler_1 = require("./handlers/PrintHandler");
const NoOpHandler_1 = require("./handlers/NoOpHandler");
const LoadStringHandler_1 = require("./handlers/LoadStringHandler");
const NewInstanceHandler_1 = require("./handlers/NewInstanceHandler");
const Memory_1 = require("./common/Memory");
const ReadInputHandler_1 = require("./handlers/ReadInputHandler");
const ParseCommandHandler_1 = require("./handlers/ParseCommandHandler");
const GoToHandler_1 = require("./handlers/GoToHandler");
const HandleCommandHandler_1 = require("./handlers/HandleCommandHandler");
const Place_1 = require("../library/Place");
const Player_1 = require("../library/Player");
const ReturnHandler_1 = require("./handlers/ReturnHandler");
const StaticCallHandler_1 = require("./handlers/StaticCallHandler");
const RuntimeError_1 = require("./errors/RuntimeError");
const LoadInstanceHandler_1 = require("./handlers/LoadInstanceHandler");
const LoadNumberHandler_1 = require("./handlers/LoadNumberHandler");
const InstanceCallHandler_1 = require("./handlers/InstanceCallHandler");
const LoadPropertyHandler_1 = require("./handlers/LoadPropertyHandler");
const LoadFieldHandler_1 = require("./handlers/LoadFieldHandler");
const ExternalCallHandler_1 = require("./handlers/ExternalCallHandler");
const LoadLocalHandler_1 = require("./handlers/LoadLocalHandler");
const LoadThisHandler_1 = require("./handlers/LoadThisHandler");
const BranchRelativeHandler_1 = require("./handlers/BranchRelativeHandler");
const BranchRelativeIfFalseHandler_1 = require("./handlers/BranchRelativeIfFalseHandler");
const ConcatenateHandler_1 = require("./handlers/ConcatenateHandler");
const AssignVariableHandler_1 = require("./handlers/AssignVariableHandler");
const TypeOfHandler_1 = require("./handlers/TypeOfHandler");
const InvokeDelegateHandler_1 = require("./handlers/InvokeDelegateHandler");
class TalonRuntime {
    constructor(userOutput, logOutput) {
        this.userOutput = userOutput;
        this.logOutput = logOutput;
        this.handlers = new Map();
        this.userOutput = userOutput;
        this.handlers.set(OpCode_1.OpCode.NoOp, new NoOpHandler_1.NoOpHandler());
        this.handlers.set(OpCode_1.OpCode.LoadString, new LoadStringHandler_1.LoadStringHandler());
        this.handlers.set(OpCode_1.OpCode.Print, new PrintHandler_1.PrintHandler(this.userOutput));
        this.handlers.set(OpCode_1.OpCode.NewInstance, new NewInstanceHandler_1.NewInstanceHandler());
        this.handlers.set(OpCode_1.OpCode.ReadInput, new ReadInputHandler_1.ReadInputHandler());
        this.handlers.set(OpCode_1.OpCode.ParseCommand, new ParseCommandHandler_1.ParseCommandHandler());
        this.handlers.set(OpCode_1.OpCode.HandleCommand, new HandleCommandHandler_1.HandleCommandHandler(this.userOutput));
        this.handlers.set(OpCode_1.OpCode.GoTo, new GoToHandler_1.GoToHandler());
        this.handlers.set(OpCode_1.OpCode.Return, new ReturnHandler_1.ReturnHandler());
        this.handlers.set(OpCode_1.OpCode.StaticCall, new StaticCallHandler_1.StaticCallHandler());
        this.handlers.set(OpCode_1.OpCode.LoadInstance, new LoadInstanceHandler_1.LoadInstanceHandler());
        this.handlers.set(OpCode_1.OpCode.LoadNumber, new LoadNumberHandler_1.LoadNumberHandler());
        this.handlers.set(OpCode_1.OpCode.InstanceCall, new InstanceCallHandler_1.InstanceCallHandler());
        this.handlers.set(OpCode_1.OpCode.LoadProperty, new LoadPropertyHandler_1.LoadPropertyHandler());
        this.handlers.set(OpCode_1.OpCode.LoadField, new LoadFieldHandler_1.LoadFieldHandler());
        this.handlers.set(OpCode_1.OpCode.ExternalCall, new ExternalCallHandler_1.ExternalCallHandler());
        this.handlers.set(OpCode_1.OpCode.LoadLocal, new LoadLocalHandler_1.LoadLocalHandler());
        this.handlers.set(OpCode_1.OpCode.LoadThis, new LoadThisHandler_1.LoadThisHandler());
        this.handlers.set(OpCode_1.OpCode.BranchRelative, new BranchRelativeHandler_1.BranchRelativeHandler());
        this.handlers.set(OpCode_1.OpCode.BranchRelativeIfFalse, new BranchRelativeIfFalseHandler_1.BranchRelativeIfFalseHandler());
        this.handlers.set(OpCode_1.OpCode.Concatenate, new ConcatenateHandler_1.ConcatenateHandler());
        this.handlers.set(OpCode_1.OpCode.Assign, new AssignVariableHandler_1.AssignVariableHandler());
        this.handlers.set(OpCode_1.OpCode.TypeOf, new TypeOfHandler_1.TypeOfHandler());
        this.handlers.set(OpCode_1.OpCode.InvokeDelegate, new InvokeDelegateHandler_1.InvokeDelegateHandler());
    }
    start() {
        var _a, _b, _c, _d;
        if (((_a = this.thread) === null || _a === void 0 ? void 0 : _a.allTypes.length) == 0) {
            (_b = this.thread.log) === null || _b === void 0 ? void 0 : _b.debug("Unable to start runtime without types.");
            return;
        }
        const places = (_c = this.thread) === null || _c === void 0 ? void 0 : _c.allTypes.filter(x => x.baseTypeName == Place_1.Place.typeName).map(x => Memory_1.Memory.allocate(x));
        const getPlayerStart = (place) => { var _a; return ((_a = place.fields.get(Place_1.Place.isPlayerStart)) === null || _a === void 0 ? void 0 : _a.value); };
        const isPlayerStart = (place) => { var _a; return ((_a = getPlayerStart(place)) === null || _a === void 0 ? void 0 : _a.value) === true; };
        const currentPlace = places === null || places === void 0 ? void 0 : places.find(isPlayerStart);
        this.thread.currentPlace = currentPlace;
        const player = (_d = this.thread) === null || _d === void 0 ? void 0 : _d.knownTypes.get(Player_1.Player.typeName);
        this.thread.currentPlayer = Memory_1.Memory.allocate(player);
        this.runWith("");
    }
    stop() {
    }
    loadFrom(types) {
        var _a;
        if (types.length == 0) {
            (_a = this.logOutput) === null || _a === void 0 ? void 0 : _a.debug("No types were provided, unable to load runtime!");
            return false;
        }
        const loadedTypes = Memory_1.Memory.loadTypes(types);
        const entryPoint = loadedTypes.find(x => x.attributes.findIndex(attribute => attribute instanceof EntryPointAttribute_1.EntryPointAttribute) > -1);
        const mainMethod = entryPoint === null || entryPoint === void 0 ? void 0 : entryPoint.methods.find(x => x.name == Any_1.Any.main);
        const activation = new MethodActivation_1.MethodActivation(mainMethod);
        this.thread = new Thread_1.Thread(loadedTypes, activation);
        this.thread.log = this.logOutput;
        return true;
    }
    sendCommand(input) {
        this.runWith(input);
    }
    runWith(command) {
        // We're going to keep their command in the visual history to make things easier to understand.
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.userOutput.write(command);
        // Now we can go ahead and process their command.
        const instruction = this.thread.currentInstruction;
        if ((instruction === null || instruction === void 0 ? void 0 : instruction.opCode) == OpCode_1.OpCode.ReadInput) {
            const text = Memory_1.Memory.allocateString(command);
            (_a = this.thread) === null || _a === void 0 ? void 0 : _a.currentMethod.push(text);
            (_b = this.thread) === null || _b === void 0 ? void 0 : _b.moveNext();
        }
        if (((_c = this.thread) === null || _c === void 0 ? void 0 : _c.currentInstruction) == undefined) {
            (_d = this.thread) === null || _d === void 0 ? void 0 : _d.moveNext();
        }
        if (((_e = this.thread) === null || _e === void 0 ? void 0 : _e.currentInstruction) == undefined) {
            throw new RuntimeError_1.RuntimeError("Unable to execute command, no instruction found");
        }
        try {
            for (let instruction = this.evaluateCurrentInstruction(); instruction == EvaluationResult_1.EvaluationResult.Continue; instruction = this.evaluateCurrentInstruction()) {
                (_f = this.thread) === null || _f === void 0 ? void 0 : _f.moveNext();
            }
        }
        catch (ex) {
            if (ex instanceof RuntimeError_1.RuntimeError) {
                (_g = this.logOutput) === null || _g === void 0 ? void 0 : _g.debug(`Runtime Error: ${ex.message}`);
                (_h = this.logOutput) === null || _h === void 0 ? void 0 : _h.debug(`Stack Trace: ${ex.stack}`);
            }
            else {
                (_j = this.logOutput) === null || _j === void 0 ? void 0 : _j.debug(`Encountered unhandled error: ${ex}`);
            }
        }
    }
    evaluateCurrentInstruction() {
        var _a;
        const instruction = (_a = this.thread) === null || _a === void 0 ? void 0 : _a.currentInstruction;
        const handler = this.handlers.get(instruction === null || instruction === void 0 ? void 0 : instruction.opCode);
        if (handler == undefined) {
            throw new RuntimeError_1.RuntimeError(`Encountered unsupported OpCode '${instruction === null || instruction === void 0 ? void 0 : instruction.opCode}'`);
        }
        return handler === null || handler === void 0 ? void 0 : handler.handle(this.thread);
    }
}
exports.TalonRuntime = TalonRuntime;
},{"../common/OpCode":7,"../library/Any":48,"../library/EntryPointAttribute":52,"../library/Place":57,"../library/Player":58,"./EvaluationResult":64,"./MethodActivation":65,"./Thread":69,"./common/Memory":70,"./errors/RuntimeError":71,"./handlers/AssignVariableHandler":72,"./handlers/BranchRelativeHandler":73,"./handlers/BranchRelativeIfFalseHandler":74,"./handlers/ConcatenateHandler":75,"./handlers/ExternalCallHandler":76,"./handlers/GoToHandler":77,"./handlers/HandleCommandHandler":78,"./handlers/InstanceCallHandler":79,"./handlers/InvokeDelegateHandler":80,"./handlers/LoadFieldHandler":81,"./handlers/LoadInstanceHandler":82,"./handlers/LoadLocalHandler":83,"./handlers/LoadNumberHandler":84,"./handlers/LoadPropertyHandler":85,"./handlers/LoadStringHandler":86,"./handlers/LoadThisHandler":87,"./handlers/NewInstanceHandler":88,"./handlers/NoOpHandler":89,"./handlers/ParseCommandHandler":90,"./handlers/PrintHandler":91,"./handlers/ReadInputHandler":92,"./handlers/ReturnHandler":93,"./handlers/StaticCallHandler":94,"./handlers/TypeOfHandler":95}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MethodActivation_1 = require("./MethodActivation");
const Understanding_1 = require("../library/Understanding");
const RuntimeEmpty_1 = require("./library/RuntimeEmpty");
class Thread {
    constructor(types, method) {
        this.allTypes = [];
        this.knownTypes = new Map();
        this.knownUnderstandings = [];
        this.knownPlaces = [];
        this.methods = [];
        this.allTypes = types;
        this.knownTypes = new Map(types.map(type => [type.name, type]));
        this.knownUnderstandings = types.filter(x => x.baseTypeName === Understanding_1.Understanding.typeName);
        this.methods.push(method);
    }
    get currentMethod() {
        return this.methods[this.methods.length - 1];
    }
    get currentInstruction() {
        var _a;
        const activation = this.currentMethod;
        return (_a = activation.method) === null || _a === void 0 ? void 0 : _a.body[activation.stackFrame.currentInstruction];
    }
    activateMethod(method) {
        var _a, _b;
        const activation = new MethodActivation_1.MethodActivation(method);
        const current = this.currentMethod;
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(`${(_b = current.method) === null || _b === void 0 ? void 0 : _b.name} => ${method.name}`);
        this.methods.push(activation);
    }
    moveNext() {
        this.currentMethod.stackFrame.currentInstruction++;
    }
    jumpToLine(lineNumber) {
        this.currentMethod.stackFrame.currentInstruction = lineNumber;
    }
    returnFromCurrentMethod() {
        var _a, _b, _c;
        const expectReturnType = this.currentMethod.method.returnType != "";
        const returnedMethod = this.methods.pop();
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(`${(_b = this.currentMethod.method) === null || _b === void 0 ? void 0 : _b.name} <= ${(_c = returnedMethod === null || returnedMethod === void 0 ? void 0 : returnedMethod.method) === null || _c === void 0 ? void 0 : _c.name}`);
        if (!expectReturnType) {
            return new RuntimeEmpty_1.RuntimeEmpty();
        }
        const returnValue = returnedMethod === null || returnedMethod === void 0 ? void 0 : returnedMethod.stack.pop();
        return returnValue;
    }
}
exports.Thread = Thread;
},{"../library/Understanding":61,"./MethodActivation":65,"./library/RuntimeEmpty":102}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Place_1 = require("../../library/Place");
const RuntimePlace_1 = require("../library/RuntimePlace");
const RuntimeError_1 = require("../errors/RuntimeError");
const Variable_1 = require("../library/Variable");
const StringType_1 = require("../../library/StringType");
const RuntimeString_1 = require("../library/RuntimeString");
const RuntimeEmpty_1 = require("../library/RuntimeEmpty");
const RuntimeCommand_1 = require("../library/RuntimeCommand");
const BooleanType_1 = require("../../library/BooleanType");
const RuntimeBoolean_1 = require("../library/RuntimeBoolean");
const List_1 = require("../../library/List");
const RuntimeList_1 = require("../library/RuntimeList");
const Item_1 = require("../../library/Item");
const RuntimeItem_1 = require("../library/RuntimeItem");
const Player_1 = require("../../library/Player");
const RuntimePlayer_1 = require("../library/RuntimePlayer");
const Say_1 = require("../../library/Say");
const RuntimeSay_1 = require("../library/RuntimeSay");
const RuntimeInteger_1 = require("../library/RuntimeInteger");
const NumberType_1 = require("../../library/NumberType");
const RuntimeDecoration_1 = require("../library/RuntimeDecoration");
const Decoration_1 = require("../../library/Decoration");
class Memory {
    static findInstanceByName(name) {
        const instances = Memory.heap.get(name);
        if (!instances || instances.length == 0) {
            throw new RuntimeError_1.RuntimeError("Object not found");
        }
        if (instances.length > 1) {
            throw new RuntimeError_1.RuntimeError("Located more than one instance");
        }
        return instances[0];
    }
    static loadTypes(types) {
        Memory.typesByName = new Map(types.map(x => [x.name, x]));
        // Override any provided type stubs with the actual runtime type definitions.
        const place = RuntimePlace_1.RuntimePlace.type;
        const item = RuntimeItem_1.RuntimeItem.type;
        const player = RuntimePlayer_1.RuntimePlayer.type;
        const decoration = RuntimeDecoration_1.RuntimeDecoration.type;
        Memory.typesByName.set(place.name, place);
        Memory.typesByName.set(item.name, item);
        Memory.typesByName.set(player.name, player);
        Memory.typesByName.set(decoration.name, decoration);
        return Array.from(Memory.typesByName.values());
    }
    static allocateCommand() {
        return new RuntimeCommand_1.RuntimeCommand();
    }
    static allocateBoolean(value) {
        return new RuntimeBoolean_1.RuntimeBoolean(value);
    }
    static allocateNumber(value) {
        return new RuntimeInteger_1.RuntimeInteger(value);
    }
    static allocateString(text) {
        return new RuntimeString_1.RuntimeString(text);
    }
    static allocate(type) {
        const instance = Memory.constructInstanceFrom(type);
        const instancePool = Memory.heap.get(type.name) || [];
        instancePool.push(instance);
        Memory.heap.set(type.name, instancePool);
        return instance;
    }
    static initializeVariableWith(field) {
        const variable = Memory.constructVariableFrom(field);
        variable.value = Memory.instantiateDefaultValueFor(variable, field.defaultValue);
        return variable;
    }
    static constructVariableFrom(field) {
        if (field.type) {
            return new Variable_1.Variable(field.name, field.type);
        }
        const type = Memory.typesByName.get(field.typeName);
        if (!type) {
            throw new RuntimeError_1.RuntimeError(`Unable to construct unknown type '${field.typeName}'`);
        }
        return new Variable_1.Variable(field.name, type);
    }
    static instantiateDefaultValueFor(variable, defaultValue) {
        switch (variable.type.name) {
            case StringType_1.StringType.typeName: return new RuntimeString_1.RuntimeString(defaultValue ? defaultValue : "");
            case BooleanType_1.BooleanType.typeName: return new RuntimeBoolean_1.RuntimeBoolean(defaultValue ? defaultValue : false);
            case NumberType_1.NumberType.typeName: return new RuntimeInteger_1.RuntimeInteger(defaultValue ? defaultValue : 0);
            case List_1.List.typeName: return new RuntimeList_1.RuntimeList(defaultValue ? this.instantiateList(defaultValue) : []);
            default:
                return new RuntimeEmpty_1.RuntimeEmpty();
        }
    }
    static instantiateList(items) {
        const runtimeItems = [];
        for (const item of items) {
            const itemList = item;
            const count = itemList[0];
            const typeName = itemList[1];
            const type = Memory.typesByName.get(typeName);
            for (let current = 0; current < count; current++) {
                const instance = Memory.allocate(type);
                runtimeItems.push(instance);
            }
        }
        return runtimeItems;
    }
    static constructInstanceFrom(type) {
        let seenTypes = new Set();
        let inheritanceChain = [];
        for (let current = type; current; current = Memory.typesByName.get(current.baseTypeName)) {
            if (seenTypes.has(current.name)) {
                throw new RuntimeError_1.RuntimeError("You can't have cycles in a type hierarchy");
            }
            seenTypes.add(current.name);
            inheritanceChain.push(current);
        }
        const firstSystemTypeAncestorIndex = inheritanceChain.findIndex(x => x.isSystemType);
        if (firstSystemTypeAncestorIndex < 0) {
            throw new RuntimeError_1.RuntimeError("Type must ultimately inherit from a system type");
        }
        const instance = this.allocateSystemTypeByName(inheritanceChain[firstSystemTypeAncestorIndex].name);
        instance.parentTypeName = instance.typeName;
        instance.typeName = inheritanceChain[0].name;
        // TODO: Inherit more than just fields/methods.
        // TODO: Type check field inheritance for shadowing/overriding.
        // Inherit fields/methods from types in the hierarchy from least to most derived.
        for (let i = firstSystemTypeAncestorIndex; i >= 0; i--) {
            const currentType = inheritanceChain[i];
            for (const field of currentType.fields) {
                const variable = this.initializeVariableWith(field);
                instance.fields.set(field.name, variable);
            }
            for (const method of currentType.methods) {
                instance.methods.set(method.name, method);
            }
        }
        return instance;
    }
    static allocateSystemTypeByName(typeName) {
        switch (typeName) {
            case Place_1.Place.typeName: return new RuntimePlace_1.RuntimePlace();
            case Item_1.Item.typeName: return new RuntimeItem_1.RuntimeItem();
            case Player_1.Player.typeName: return new RuntimePlayer_1.RuntimePlayer();
            case List_1.List.typeName: return new RuntimeList_1.RuntimeList([]);
            case Say_1.Say.typeName: return new RuntimeSay_1.RuntimeSay();
            case Decoration_1.Decoration.typeName: return new RuntimeDecoration_1.RuntimeDecoration();
            default: {
                throw new RuntimeError_1.RuntimeError(`Unable to instantiate type '${typeName}'`);
            }
        }
    }
}
exports.Memory = Memory;
Memory.typesByName = new Map();
Memory.heap = new Map();
},{"../../library/BooleanType":49,"../../library/Decoration":50,"../../library/Item":54,"../../library/List":55,"../../library/NumberType":56,"../../library/Place":57,"../../library/Player":58,"../../library/Say":59,"../../library/StringType":60,"../errors/RuntimeError":71,"../library/RuntimeBoolean":98,"../library/RuntimeCommand":99,"../library/RuntimeDecoration":100,"../library/RuntimeEmpty":102,"../library/RuntimeInteger":103,"../library/RuntimeItem":104,"../library/RuntimeList":105,"../library/RuntimePlace":106,"../library/RuntimePlayer":107,"../library/RuntimeSay":108,"../library/RuntimeString":109,"../library/Variable":111}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RuntimeError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.RuntimeError = RuntimeError;
},{}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeString_1 = require("../library/RuntimeString");
const RuntimeError_1 = require("../errors/RuntimeError");
const RuntimeInteger_1 = require("../library/RuntimeInteger");
class AssignVariableHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a;
        (_a = thread.log) === null || _a === void 0 ? void 0 : _a.debug(".st.var");
        const instance = thread.currentMethod.pop();
        const value = thread.currentMethod.pop();
        if (instance instanceof RuntimeString_1.RuntimeString) {
            instance.value = value.value;
        }
        else if (instance instanceof RuntimeInteger_1.RuntimeInteger) {
            instance.value = value.value;
        }
        else {
            throw new RuntimeError_1.RuntimeError("Encountered unsupported type on the stack");
        }
        return super.handle(thread);
    }
}
exports.AssignVariableHandler = AssignVariableHandler;
},{"../OpCodeHandler":66,"../errors/RuntimeError":71,"../library/RuntimeInteger":103,"../library/RuntimeString":109}],73:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
class BranchRelativeHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b;
        const relativeAmount = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`br.rel ${relativeAmount}`);
        thread.jumpToLine(thread.currentMethod.stackFrame.currentInstruction + relativeAmount);
        return super.handle(thread);
    }
}
exports.BranchRelativeHandler = BranchRelativeHandler;
},{"../OpCodeHandler":66}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
class BranchRelativeIfFalseHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b;
        const relativeAmount = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const value = thread.currentMethod.pop();
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`br.rel.false ${relativeAmount} // ${value}`);
        if (!value.value) {
            thread.jumpToLine(thread.currentMethod.stackFrame.currentInstruction + relativeAmount);
        }
        return super.handle(thread);
    }
}
exports.BranchRelativeIfFalseHandler = BranchRelativeIfFalseHandler;
},{"../OpCodeHandler":66}],75:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const Memory_1 = require("../common/Memory");
class ConcatenateHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a;
        const last = thread.currentMethod.pop();
        const first = thread.currentMethod.pop();
        (_a = thread.log) === null || _a === void 0 ? void 0 : _a.debug(`.concat '${first.value}' '${last.value}'`);
        const concatenated = Memory_1.Memory.allocateString(first.value + " " + last.value);
        thread.currentMethod.push(concatenated);
        return super.handle(thread);
    }
}
exports.ConcatenateHandler = ConcatenateHandler;
},{"../OpCodeHandler":66,"../common/Memory":70}],76:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
class ExternalCallHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b;
        const methodName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const instance = thread.currentMethod.pop();
        const method = this.locateFunction(instance, methodName);
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`.call.extern\t${instance === null || instance === void 0 ? void 0 : instance.typeName}::${methodName}(...${method.length})`);
        const args = [];
        for (let i = 0; i < method.length; i++) {
            args.push(thread.currentMethod.pop());
        }
        const result = method.call(instance, ...args);
        thread.currentMethod.push(result);
        return super.handle(thread);
    }
    locateFunction(instance, methodName) {
        return instance[methodName];
    }
}
exports.ExternalCallHandler = ExternalCallHandler;
},{"../OpCodeHandler":66}],77:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeError_1 = require("../errors/RuntimeError");
class GoToHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b;
        const instructionNumber = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        if (typeof instructionNumber === "number") {
            // We need to jump one previous to the desired instruction because after 
            // evaluating this goto we'll move forward (which will move to the desired one).
            (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`.br ${instructionNumber}`);
            thread.jumpToLine(instructionNumber - 1);
        }
        else {
            throw new RuntimeError_1.RuntimeError("Unable to goto");
        }
        return super.handle(thread);
    }
}
exports.GoToHandler = GoToHandler;
},{"../OpCodeHandler":66,"../errors/RuntimeError":71}],78:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeCommand_1 = require("../library/RuntimeCommand");
const RuntimeError_1 = require("../errors/RuntimeError");
const Understanding_1 = require("../../library/Understanding");
const Meaning_1 = require("../library/Meaning");
const RuntimeWorldObject_1 = require("../library/RuntimeWorldObject");
const WorldObject_1 = require("../../library/WorldObject");
const Memory_1 = require("../common/Memory");
const Type_1 = require("../../common/Type");
const Player_1 = require("../../library/Player");
const EventType_1 = require("../../common/EventType");
const RuntimeDelegate_1 = require("../library/RuntimeDelegate");
const Variable_1 = require("../library/Variable");
const RuntimeItem_1 = require("../library/RuntimeItem");
class HandleCommandHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor(output) {
        super();
        this.output = output;
    }
    handle(thread) {
        var _a;
        const command = thread.currentMethod.pop();
        if (!(command instanceof RuntimeCommand_1.RuntimeCommand)) {
            throw new RuntimeError_1.RuntimeError(`Unable to handle a non-command, found '${command}`);
        }
        const action = command.action.value;
        const targetName = command.targetName.value;
        (_a = thread.log) === null || _a === void 0 ? void 0 : _a.debug(`.handle.cmd '${action} ${targetName}'`);
        const understandingsByAction = new Map(thread.knownUnderstandings.map(x => { var _a; return [(_a = x.fields.find(field => field.name == Understanding_1.Understanding.action)) === null || _a === void 0 ? void 0 : _a.defaultValue, x]; }));
        const understanding = understandingsByAction.get(action);
        if (!understanding) {
            this.output.write("I don't know how to do that.");
            return super.handle(thread);
        }
        const meaningField = understanding.fields.find(x => x.name == Understanding_1.Understanding.meaning);
        const meaning = this.determineMeaningFor(meaningField === null || meaningField === void 0 ? void 0 : meaningField.defaultValue);
        const actualTarget = this.inferTargetFrom(thread, targetName, meaning);
        if (!actualTarget) {
            this.output.write("I don't know what you're referring to.");
            return super.handle(thread);
        }
        switch (meaning) {
            case Meaning_1.Meaning.Describing: {
                this.describe(thread, actualTarget, false);
                break;
            }
            case Meaning_1.Meaning.Moving: {
                const nextPlace = actualTarget;
                const currentPlace = thread.currentPlace;
                thread.currentPlace = nextPlace;
                this.describe(thread, actualTarget, false);
                this.raiseEvent(thread, nextPlace, EventType_1.EventType.PlayerEntersPlace);
                this.raiseEvent(thread, currentPlace, EventType_1.EventType.PlayerExitsPlace);
                break;
            }
            case Meaning_1.Meaning.Taking: {
                if (!(actualTarget instanceof RuntimeItem_1.RuntimeItem)) {
                    this.output.write("I can't take that.");
                    return super.handle(thread);
                }
                const list = thread.currentPlace.getContentsField();
                list.items = list.items.filter(x => x.typeName != targetName);
                const inventory = thread.currentPlayer.getContentsField();
                inventory.items.push(actualTarget);
                this.describe(thread, thread.currentPlace, false);
                break;
            }
            case Meaning_1.Meaning.Inventory: {
                const inventory = actualTarget.getContentsField();
                this.describeContents(thread, inventory);
                break;
            }
            case Meaning_1.Meaning.Dropping: {
                const list = thread.currentPlayer.getContentsField();
                list.items = list.items.filter(x => x.typeName != targetName);
                const contents = thread.currentPlace.getContentsField();
                contents.items.push(actualTarget);
                this.describe(thread, thread.currentPlace, false);
                break;
            }
            default:
                throw new RuntimeError_1.RuntimeError("Unsupported meaning found");
        }
        return super.handle(thread);
    }
    raiseEvent(thread, location, type) {
        const events = Array.from(location.methods.values()).filter(x => x.eventType == type);
        for (const event of events) {
            const method = location.methods.get(event.name);
            method.actualParameters = [new Variable_1.Variable("~this", new Type_1.Type(location === null || location === void 0 ? void 0 : location.typeName, location === null || location === void 0 ? void 0 : location.parentTypeName), location)];
            const delegate = new RuntimeDelegate_1.RuntimeDelegate(method);
            thread.currentMethod.push(delegate);
        }
    }
    inferTargetFrom(thread, targetName, meaning) {
        var _a, _b, _c, _d;
        const lookupInstance = (name) => {
            try {
                return Memory_1.Memory.findInstanceByName(name);
            }
            catch (ex) {
                return undefined;
            }
        };
        if (meaning === Meaning_1.Meaning.Moving) {
            const placeName = (_b = (_a = thread.currentPlace) === null || _a === void 0 ? void 0 : _a.fields.get(`~${targetName}`)) === null || _b === void 0 ? void 0 : _b.value;
            if (!placeName) {
                return undefined;
            }
            return lookupInstance(placeName.value);
        }
        else if (meaning === Meaning_1.Meaning.Inventory) {
            return lookupInstance(Player_1.Player.typeName);
        }
        else if (meaning === Meaning_1.Meaning.Describing) {
            if (!targetName) {
                return thread.currentPlace;
            }
            const placeContents = (_c = thread.currentPlace) === null || _c === void 0 ? void 0 : _c.getContentsField();
            const itemOrDecoration = placeContents.items.find(x => x.typeName.toLowerCase() == targetName.toLowerCase());
            if (itemOrDecoration instanceof RuntimeWorldObject_1.RuntimeWorldObject) {
                return itemOrDecoration;
            }
            return lookupInstance((_d = thread.currentPlace) === null || _d === void 0 ? void 0 : _d.typeName);
        }
        else if (meaning === Meaning_1.Meaning.Taking) {
            const list = thread.currentPlace.getContentsField();
            const matchingItems = list.items.filter(x => x.typeName === targetName);
            if (matchingItems.length == 0) {
                return undefined;
            }
            return matchingItems[0];
        }
        else if (meaning === Meaning_1.Meaning.Dropping) {
            const list = thread.currentPlayer.getContentsField();
            const matchingItems = list.items.filter(x => x.typeName === targetName);
            if (matchingItems.length == 0) {
                return undefined;
            }
            return matchingItems[0];
        }
        else {
            return undefined;
        }
    }
    describe(thread, target, isShallowDescription) {
        if (!isShallowDescription) {
            const contents = target.getFieldAsList(WorldObject_1.WorldObject.contents);
            this.describeContents(thread, contents);
        }
        const describe = target.methods.get(WorldObject_1.WorldObject.describe);
        describe.actualParameters.unshift(new Variable_1.Variable("~this", new Type_1.Type(target === null || target === void 0 ? void 0 : target.typeName, target === null || target === void 0 ? void 0 : target.parentTypeName), target));
        thread.currentMethod.push(new RuntimeDelegate_1.RuntimeDelegate(describe));
    }
    observe(thread, target) {
        const observe = target.methods.get(WorldObject_1.WorldObject.observe);
        observe.actualParameters.unshift(new Variable_1.Variable("~this", new Type_1.Type(target === null || target === void 0 ? void 0 : target.typeName, target === null || target === void 0 ? void 0 : target.parentTypeName), target));
        thread.currentMethod.push(new RuntimeDelegate_1.RuntimeDelegate(observe));
    }
    describeContents(thread, target) {
        for (const item of target.items) {
            this.observe(thread, item);
        }
    }
    determineMeaningFor(action) {
        const systemAction = `~${action}`;
        // TODO: Support custom actions better.
        switch (systemAction) {
            case Understanding_1.Understanding.describing: return Meaning_1.Meaning.Describing;
            case Understanding_1.Understanding.moving: return Meaning_1.Meaning.Moving;
            case Understanding_1.Understanding.direction: return Meaning_1.Meaning.Direction;
            case Understanding_1.Understanding.taking: return Meaning_1.Meaning.Taking;
            case Understanding_1.Understanding.inventory: return Meaning_1.Meaning.Inventory;
            case Understanding_1.Understanding.dropping: return Meaning_1.Meaning.Dropping;
            default:
                return Meaning_1.Meaning.Custom;
        }
    }
}
exports.HandleCommandHandler = HandleCommandHandler;
},{"../../common/EventType":3,"../../common/Type":9,"../../library/Player":58,"../../library/Understanding":61,"../../library/WorldObject":62,"../OpCodeHandler":66,"../common/Memory":70,"../errors/RuntimeError":71,"../library/Meaning":96,"../library/RuntimeCommand":99,"../library/RuntimeDelegate":101,"../library/RuntimeItem":104,"../library/RuntimeWorldObject":110,"../library/Variable":111}],79:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const Variable_1 = require("../library/Variable");
const Type_1 = require("../../common/Type");
class InstanceCallHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor(methodName) {
        super();
        this.methodName = methodName;
    }
    handle(thread) {
        var _a, _b;
        const current = thread.currentMethod;
        if (!this.methodName) {
            this.methodName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        }
        const instance = current.pop();
        const method = instance === null || instance === void 0 ? void 0 : instance.methods.get(this.methodName);
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`.call.inst\t${instance === null || instance === void 0 ? void 0 : instance.typeName}::${this.methodName}(...${method.parameters.length})`);
        const parameterValues = [];
        for (let i = 0; i < method.parameters.length; i++) {
            const parameter = method.parameters[i];
            const instance = current.pop();
            const variable = new Variable_1.Variable(parameter.name, parameter.type, instance);
            parameterValues.push(variable);
        }
        // HACK: We shouldn't create our own type, we should inherently know what it is.
        parameterValues.unshift(new Variable_1.Variable("~this", new Type_1.Type(instance === null || instance === void 0 ? void 0 : instance.typeName, instance === null || instance === void 0 ? void 0 : instance.parentTypeName), instance));
        method.actualParameters = parameterValues;
        thread.activateMethod(method);
        return super.handle(thread);
    }
}
exports.InstanceCallHandler = InstanceCallHandler;
},{"../../common/Type":9,"../OpCodeHandler":66,"../library/Variable":111}],80:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeDelegate_1 = require("../library/RuntimeDelegate");
const RuntimeError_1 = require("../errors/RuntimeError");
class InvokeDelegateHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a;
        (_a = thread.log) === null || _a === void 0 ? void 0 : _a.debug(".call.delegate");
        const instance = thread.currentMethod.pop();
        if (instance instanceof RuntimeDelegate_1.RuntimeDelegate) {
            const activation = thread.activateMethod(instance.wrappedMethod);
        }
        else {
            throw new RuntimeError_1.RuntimeError(`Unable to invoke delegate for non-delegate instance '${instance}'`);
        }
        return super.handle(thread);
    }
}
exports.InvokeDelegateHandler = InvokeDelegateHandler;
},{"../OpCodeHandler":66,"../errors/RuntimeError":71,"../library/RuntimeDelegate":101}],81:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
class LoadFieldHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b;
        const instance = thread.currentMethod.pop();
        const fieldName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const field = instance === null || instance === void 0 ? void 0 : instance.fields.get(fieldName);
        const value = field === null || field === void 0 ? void 0 : field.value;
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`.ld.field\t\t${instance === null || instance === void 0 ? void 0 : instance.typeName}::${fieldName} // ${value}`);
        thread.currentMethod.push(value);
        return super.handle(thread);
    }
}
exports.LoadFieldHandler = LoadFieldHandler;
},{"../OpCodeHandler":66}],82:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeError_1 = require("../errors/RuntimeError");
class LoadInstanceHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b;
        const typeName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        if (typeName === "~it") {
            const subject = thread.currentPlace;
            thread.currentMethod.push(subject);
            (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(".ld.curr.place");
        }
        else {
            throw new RuntimeError_1.RuntimeError(`Unable to load instance for unsupported type '${typeName}'`);
        }
        return super.handle(thread);
    }
}
exports.LoadInstanceHandler = LoadInstanceHandler;
},{"../OpCodeHandler":66,"../errors/RuntimeError":71}],83:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
class LoadLocalHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b, _c;
        const localName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const parameter = (_b = thread.currentMethod.method) === null || _b === void 0 ? void 0 : _b.actualParameters.find(x => x.name == localName);
        thread.currentMethod.push(parameter === null || parameter === void 0 ? void 0 : parameter.value);
        (_c = thread.log) === null || _c === void 0 ? void 0 : _c.debug(`.ld.param\t\t${localName}=${parameter === null || parameter === void 0 ? void 0 : parameter.value}`);
        return super.handle(thread);
    }
}
exports.LoadLocalHandler = LoadLocalHandler;
},{"../OpCodeHandler":66}],84:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const Memory_1 = require("../common/Memory");
class LoadNumberHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b;
        const value = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const runtimeValue = Memory_1.Memory.allocateNumber(value);
        thread.currentMethod.push(runtimeValue);
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`.ld.const.num\t${value}`);
        return super.handle(thread);
    }
}
exports.LoadNumberHandler = LoadNumberHandler;
},{"../OpCodeHandler":66,"../common/Memory":70}],85:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const InstanceCallHandler_1 = require("./InstanceCallHandler");
const LoadThisHandler_1 = require("./LoadThisHandler");
const EvaluationResult_1 = require("../EvaluationResult");
class LoadPropertyHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor(fieldName) {
        super();
        this.fieldName = fieldName;
    }
    handle(thread) {
        var _a, _b;
        const instance = thread.currentMethod.pop();
        if (!this.fieldName) {
            this.fieldName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        }
        try {
            const field = instance === null || instance === void 0 ? void 0 : instance.fields.get(this.fieldName);
            const value = field === null || field === void 0 ? void 0 : field.value;
            const getField = instance === null || instance === void 0 ? void 0 : instance.methods.get(`~get_${this.fieldName}`);
            (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`.ld.prop\t\t${instance === null || instance === void 0 ? void 0 : instance.typeName}::${this.fieldName} {get=${getField != undefined}} // ${value}`);
            if (getField) {
                thread.currentMethod.push(value);
                const loadThis = new LoadThisHandler_1.LoadThisHandler();
                const result = loadThis.handle(thread);
                if (result != EvaluationResult_1.EvaluationResult.Continue) {
                    return result;
                }
                const handler = new InstanceCallHandler_1.InstanceCallHandler(getField.name);
                handler.handle(thread);
                //getField.actualParameters.push(new Variable("~value", field?.type!, value));
                //thread.activateMethod(getField);
            }
            else {
                thread.currentMethod.push(value);
            }
            return super.handle(thread);
        }
        finally {
            this.fieldName = undefined;
        }
    }
}
exports.LoadPropertyHandler = LoadPropertyHandler;
},{"../EvaluationResult":64,"../OpCodeHandler":66,"./InstanceCallHandler":79,"./LoadThisHandler":87}],86:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeString_1 = require("../library/RuntimeString");
const RuntimeError_1 = require("../errors/RuntimeError");
class LoadStringHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a;
        const value = thread.currentInstruction.value;
        if (typeof value === "string") {
            const stringValue = new RuntimeString_1.RuntimeString(value);
            thread.currentMethod.push(stringValue);
            (_a = thread.log) === null || _a === void 0 ? void 0 : _a.debug(`.ld.const.str\t"${value}"`);
        }
        else {
            throw new RuntimeError_1.RuntimeError("Expected a string");
        }
        return super.handle(thread);
    }
}
exports.LoadStringHandler = LoadStringHandler;
},{"../OpCodeHandler":66,"../errors/RuntimeError":71,"../library/RuntimeString":109}],87:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
class LoadThisHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b;
        const instance = (_a = thread.currentMethod.method) === null || _a === void 0 ? void 0 : _a.actualParameters[0].value;
        thread.currentMethod.push(instance);
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`.ld.this`);
        return super.handle(thread);
    }
}
exports.LoadThisHandler = LoadThisHandler;
},{"../OpCodeHandler":66}],88:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeError_1 = require("../errors/RuntimeError");
const Memory_1 = require("../common/Memory");
class NewInstanceHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a;
        const typeName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        if (typeof typeName === "string") {
            const type = thread.knownTypes.get(typeName);
            if (type == null) {
                throw new RuntimeError_1.RuntimeError("Unable to locate type");
            }
            const instance = Memory_1.Memory.allocate(type);
            thread.currentMethod.push(instance);
        }
        return super.handle(thread);
    }
}
exports.NewInstanceHandler = NewInstanceHandler;
},{"../OpCodeHandler":66,"../common/Memory":70,"../errors/RuntimeError":71}],89:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const EvaluationResult_1 = require("../EvaluationResult");
class NoOpHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        return EvaluationResult_1.EvaluationResult.Continue;
    }
}
exports.NoOpHandler = NoOpHandler;
},{"../EvaluationResult":64,"../OpCodeHandler":66}],90:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeString_1 = require("../library/RuntimeString");
const RuntimeError_1 = require("../errors/RuntimeError");
const Memory_1 = require("../common/Memory");
class ParseCommandHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a;
        (_a = thread.log) === null || _a === void 0 ? void 0 : _a.debug(`.handle.cmd.parse`);
        const text = thread.currentMethod.pop();
        if (text instanceof RuntimeString_1.RuntimeString) {
            const commandText = text.value;
            const command = this.parseCommand(commandText);
            thread.currentMethod.push(command);
        }
        else {
            throw new RuntimeError_1.RuntimeError("Unable to parse command");
        }
        return super.handle(thread);
    }
    parseCommand(text) {
        const pieces = text.split(" ");
        const command = Memory_1.Memory.allocateCommand();
        command.action = Memory_1.Memory.allocateString(pieces[0]);
        command.targetName = Memory_1.Memory.allocateString(pieces[1]);
        return command;
    }
}
exports.ParseCommandHandler = ParseCommandHandler;
},{"../OpCodeHandler":66,"../common/Memory":70,"../errors/RuntimeError":71,"../library/RuntimeString":109}],91:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeString_1 = require("../library/RuntimeString");
const RuntimeError_1 = require("../errors/RuntimeError");
const OpCodeHandler_1 = require("../OpCodeHandler");
class PrintHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor(output) {
        super();
        this.output = output;
    }
    handle(thread) {
        var _a;
        const text = thread.currentMethod.pop();
        if (text instanceof RuntimeString_1.RuntimeString) {
            (_a = thread.log) === null || _a === void 0 ? void 0 : _a.debug(".print");
            this.output.write(text.value);
        }
        else {
            throw new RuntimeError_1.RuntimeError("Unable to print, encountered a type on the stack other than string");
        }
        return super.handle(thread);
    }
}
exports.PrintHandler = PrintHandler;
},{"../OpCodeHandler":66,"../errors/RuntimeError":71,"../library/RuntimeString":109}],92:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const EvaluationResult_1 = require("../EvaluationResult");
class ReadInputHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a;
        (_a = thread.log) === null || _a === void 0 ? void 0 : _a.debug(".read.in");
        return EvaluationResult_1.EvaluationResult.SuspendForInput;
    }
}
exports.ReadInputHandler = ReadInputHandler;
},{"../EvaluationResult":64,"../OpCodeHandler":66}],93:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const EvaluationResult_1 = require("../EvaluationResult");
const RuntimeEmpty_1 = require("../library/RuntimeEmpty");
const RuntimeError_1 = require("../errors/RuntimeError");
class ReturnHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        // TODO: Handle returning top value on stack based on return type of method.
        var _a, _b, _c, _d, _e;
        const current = thread.currentMethod;
        const size = current.stackSize();
        const hasReturnType = ((_a = current.method) === null || _a === void 0 ? void 0 : _a.returnType) != "";
        if (hasReturnType) {
            if (size == 0) {
                throw new RuntimeError_1.RuntimeError("Expected return value from method but found no instance on the stack");
            }
            else if (size > 1) {
                throw new RuntimeError_1.RuntimeError(`Stack Imbalance! Returning from '${(_b = current.method) === null || _b === void 0 ? void 0 : _b.name}' found '${size}' instances left but expected one.`);
            }
        }
        else {
            if (size > 0) {
                throw new RuntimeError_1.RuntimeError(`Stack Imbalance! Returning from '${(_c = current.method) === null || _c === void 0 ? void 0 : _c.name}' found '${size}' instances left but expected zero.`);
            }
        }
        const returnValue = thread.returnFromCurrentMethod();
        if (!(returnValue instanceof RuntimeEmpty_1.RuntimeEmpty)) {
            (_d = thread.log) === null || _d === void 0 ? void 0 : _d.debug(`.ret\t\t${returnValue}`);
            thread === null || thread === void 0 ? void 0 : thread.currentMethod.push(returnValue);
        }
        else {
            (_e = thread.log) === null || _e === void 0 ? void 0 : _e.debug(".ret void");
        }
        return EvaluationResult_1.EvaluationResult.Continue;
    }
}
exports.ReturnHandler = ReturnHandler;
},{"../EvaluationResult":64,"../OpCodeHandler":66,"../errors/RuntimeError":71,"../library/RuntimeEmpty":102}],94:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
class StaticCallHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b;
        const callText = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const pieces = callText.split(".");
        const typeName = pieces[0];
        const methodName = pieces[1];
        const type = thread.knownTypes.get(typeName);
        const method = type === null || type === void 0 ? void 0 : type.methods.find(x => x.name === methodName);
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`.call.static\t${typeName}::${methodName}()`);
        thread.activateMethod(method);
        return super.handle(thread);
    }
}
exports.StaticCallHandler = StaticCallHandler;
},{"../OpCodeHandler":66}],95:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const Memory_1 = require("../common/Memory");
class TypeOfHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b;
        const typeName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`.typeof ${typeName}`);
        if (thread.currentMethod.stackSize() == 0) {
            const value = Memory_1.Memory.allocateBoolean(false);
            thread.currentMethod.push(value);
        }
        else {
            const instance = thread.currentMethod.peek();
            const isType = (instance === null || instance === void 0 ? void 0 : instance.typeName) == typeName;
            const result = Memory_1.Memory.allocateBoolean(isType);
            thread.currentMethod.push(result);
        }
        return super.handle(thread);
    }
}
exports.TypeOfHandler = TypeOfHandler;
},{"../OpCodeHandler":66,"../common/Memory":70}],96:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Meaning;
(function (Meaning) {
    Meaning[Meaning["Describing"] = 0] = "Describing";
    Meaning[Meaning["Taking"] = 1] = "Taking";
    Meaning[Meaning["Moving"] = 2] = "Moving";
    Meaning[Meaning["Direction"] = 3] = "Direction";
    Meaning[Meaning["Inventory"] = 4] = "Inventory";
    Meaning[Meaning["Dropping"] = 5] = "Dropping";
    Meaning[Meaning["Quitting"] = 6] = "Quitting";
    Meaning[Meaning["Custom"] = 7] = "Custom";
})(Meaning = exports.Meaning || (exports.Meaning = {}));
},{}],97:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("../../library/Any");
class RuntimeAny {
    constructor() {
        this.parentTypeName = "";
        this.typeName = Any_1.Any.typeName;
        this.fields = new Map();
        this.methods = new Map();
    }
    toString() {
        return this.typeName;
    }
}
exports.RuntimeAny = RuntimeAny;
},{"../../library/Any":48}],98:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeAny_1 = require("./RuntimeAny");
class RuntimeBoolean extends RuntimeAny_1.RuntimeAny {
    constructor(value) {
        super();
        this.value = value;
    }
    toString() {
        return this.value.toString();
    }
}
exports.RuntimeBoolean = RuntimeBoolean;
},{"./RuntimeAny":97}],99:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeAny_1 = require("./RuntimeAny");
class RuntimeCommand extends RuntimeAny_1.RuntimeAny {
    constructor(targetName, action) {
        super();
        this.targetName = targetName;
        this.action = action;
    }
}
exports.RuntimeCommand = RuntimeCommand;
},{"./RuntimeAny":97}],100:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeWorldObject_1 = require("./RuntimeWorldObject");
const Decoration_1 = require("../../library/Decoration");
class RuntimeDecoration extends RuntimeWorldObject_1.RuntimeWorldObject {
    constructor() {
        super(...arguments);
        this.parentTypeName = Decoration_1.Decoration.parentTypeName;
        this.typeName = Decoration_1.Decoration.typeName;
    }
}
exports.RuntimeDecoration = RuntimeDecoration;
},{"../../library/Decoration":50,"./RuntimeWorldObject":110}],101:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeAny_1 = require("./RuntimeAny");
const Any_1 = require("../../library/Any");
const Delegate_1 = require("../../library/Delegate");
class RuntimeDelegate extends RuntimeAny_1.RuntimeAny {
    constructor(wrappedMethod) {
        super();
        this.wrappedMethod = wrappedMethod;
        this.parentTypeName = Any_1.Any.typeName;
        this.typeName = Delegate_1.Delegate.typeName;
    }
}
exports.RuntimeDelegate = RuntimeDelegate;
},{"../../library/Any":48,"../../library/Delegate":51,"./RuntimeAny":97}],102:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeAny_1 = require("./RuntimeAny");
const Any_1 = require("../../library/Any");
class RuntimeEmpty extends RuntimeAny_1.RuntimeAny {
    constructor() {
        super(...arguments);
        this.parentTypeName = Any_1.Any.typeName;
        this.typeName = "~empty";
    }
}
exports.RuntimeEmpty = RuntimeEmpty;
},{"../../library/Any":48,"./RuntimeAny":97}],103:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeAny_1 = require("./RuntimeAny");
class RuntimeInteger extends RuntimeAny_1.RuntimeAny {
    constructor(value) {
        super();
        this.value = value;
    }
    toString() {
        return this.value.toString();
    }
}
exports.RuntimeInteger = RuntimeInteger;
},{"./RuntimeAny":97}],104:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeWorldObject_1 = require("./RuntimeWorldObject");
const WorldObject_1 = require("../../library/WorldObject");
const Item_1 = require("../../library/Item");
class RuntimeItem extends RuntimeWorldObject_1.RuntimeWorldObject {
    constructor() {
        super(...arguments);
        this.parentTypeName = WorldObject_1.WorldObject.typeName;
        this.typeName = Item_1.Item.typeName;
    }
    static get type() {
        const type = RuntimeWorldObject_1.RuntimeWorldObject.type;
        type.name = Item_1.Item.typeName;
        return type;
    }
}
exports.RuntimeItem = RuntimeItem;
},{"../../library/Item":54,"../../library/WorldObject":62,"./RuntimeWorldObject":110}],105:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeAny_1 = require("./RuntimeAny");
const List_1 = require("../../library/List");
const Method_1 = require("../../common/Method");
const Parameter_1 = require("../../common/Parameter");
const NumberType_1 = require("../../library/NumberType");
const StringType_1 = require("../../library/StringType");
const Instruction_1 = require("../../common/Instruction");
const Memory_1 = require("../common/Memory");
const BooleanType_1 = require("../../library/BooleanType");
class RuntimeList extends RuntimeAny_1.RuntimeAny {
    constructor(items) {
        super();
        this.items = items;
        const contains = new Method_1.Method();
        contains.name = List_1.List.contains;
        contains.parameters.push(new Parameter_1.Parameter(List_1.List.typeNameParameter, StringType_1.StringType.typeName), new Parameter_1.Parameter(List_1.List.countParameter, NumberType_1.NumberType.typeName));
        contains.returnType = BooleanType_1.BooleanType.typeName;
        contains.body.push(Instruction_1.Instruction.loadLocal(List_1.List.countParameter), Instruction_1.Instruction.loadLocal(List_1.List.typeNameParameter), Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.externalCall("containsType"), Instruction_1.Instruction.return());
        this.methods.set(List_1.List.contains, contains);
    }
    containsType(typeName, count) {
        const foundItems = this.items.filter(x => x.typeName === typeName.value);
        const found = foundItems.length === count.value;
        return Memory_1.Memory.allocateBoolean(found);
    }
}
exports.RuntimeList = RuntimeList;
},{"../../common/Instruction":5,"../../common/Method":6,"../../common/Parameter":8,"../../library/BooleanType":49,"../../library/List":55,"../../library/NumberType":56,"../../library/StringType":60,"../common/Memory":70,"./RuntimeAny":97}],106:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeWorldObject_1 = require("./RuntimeWorldObject");
const WorldObject_1 = require("../../library/WorldObject");
const Place_1 = require("../../library/Place");
class RuntimePlace extends RuntimeWorldObject_1.RuntimeWorldObject {
    constructor() {
        super(...arguments);
        this.parentTypeName = WorldObject_1.WorldObject.parentTypeName;
        this.typeName = Place_1.Place.typeName;
    }
    static get type() {
        const type = RuntimeWorldObject_1.RuntimeWorldObject.type;
        type.name = Place_1.Place.typeName;
        return type;
    }
}
exports.RuntimePlace = RuntimePlace;
},{"../../library/Place":57,"../../library/WorldObject":62,"./RuntimeWorldObject":110}],107:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeWorldObject_1 = require("./RuntimeWorldObject");
const Player_1 = require("../../library/Player");
class RuntimePlayer extends RuntimeWorldObject_1.RuntimeWorldObject {
    static get type() {
        const type = RuntimeWorldObject_1.RuntimeWorldObject.type;
        type.name = Player_1.Player.typeName;
        return type;
    }
}
exports.RuntimePlayer = RuntimePlayer;
},{"../../library/Player":58,"./RuntimeWorldObject":110}],108:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeAny_1 = require("./RuntimeAny");
class RuntimeSay extends RuntimeAny_1.RuntimeAny {
    constructor() {
        super(...arguments);
        this.message = "";
    }
}
exports.RuntimeSay = RuntimeSay;
},{"./RuntimeAny":97}],109:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeAny_1 = require("./RuntimeAny");
const Any_1 = require("../../library/Any");
class RuntimeString extends RuntimeAny_1.RuntimeAny {
    constructor(value) {
        super();
        this.parentTypeName = Any_1.Any.typeName;
        this.typeName = "~string";
        this.value = value;
    }
    toString() {
        return `"${this.value}"`;
    }
}
exports.RuntimeString = RuntimeString;
},{"../../library/Any":48,"./RuntimeAny":97}],110:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeAny_1 = require("./RuntimeAny");
const WorldObject_1 = require("../../library/WorldObject");
const Any_1 = require("../../library/Any");
const RuntimeError_1 = require("../errors/RuntimeError");
const Type_1 = require("../../common/Type");
const Field_1 = require("../../common/Field");
const List_1 = require("../../library/List");
const StringType_1 = require("../../library/StringType");
class RuntimeWorldObject extends RuntimeAny_1.RuntimeAny {
    constructor() {
        super(...arguments);
        this.parentTypeName = Any_1.Any.typeName;
        this.typeName = WorldObject_1.WorldObject.typeName;
    }
    static get type() {
        const type = new Type_1.Type(WorldObject_1.WorldObject.typeName, WorldObject_1.WorldObject.parentTypeName);
        const contents = new Field_1.Field();
        contents.name = WorldObject_1.WorldObject.contents;
        contents.typeName = List_1.List.typeName;
        contents.defaultValue = [];
        const description = new Field_1.Field();
        description.name = WorldObject_1.WorldObject.description;
        description.typeName = StringType_1.StringType.typeName;
        description.defaultValue = "";
        type.fields.push(contents);
        type.fields.push(description);
        return type;
    }
    getFieldValueByName(name) {
        var _a;
        const instance = (_a = this.fields.get(name)) === null || _a === void 0 ? void 0 : _a.value;
        if (instance == undefined) {
            throw new RuntimeError_1.RuntimeError(`Attempted field access for unknown field '${name}'`);
        }
        return instance;
    }
    getContentsField() {
        return this.getFieldAsList(WorldObject_1.WorldObject.contents);
    }
    getFieldAsList(name) {
        return this.getFieldValueByName(name);
    }
    getFieldAsString(name) {
        return this.getFieldValueByName(name);
    }
}
exports.RuntimeWorldObject = RuntimeWorldObject;
},{"../../common/Field":4,"../../common/Type":9,"../../library/Any":48,"../../library/List":55,"../../library/StringType":60,"../../library/WorldObject":62,"../errors/RuntimeError":71,"./RuntimeAny":97}],111:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Variable {
    constructor(name, type, value) {
        this.name = name;
        this.type = type;
        this.value = value;
    }
}
exports.Variable = Variable;
},{}]},{},[63])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL25vcmhhL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInRhbG9uL1BhbmVPdXRwdXQudHMiLCJ0YWxvbi9UYWxvbklkZS50cyIsInRhbG9uL2NvbW1vbi9FdmVudFR5cGUudHMiLCJ0YWxvbi9jb21tb24vRmllbGQudHMiLCJ0YWxvbi9jb21tb24vSW5zdHJ1Y3Rpb24udHMiLCJ0YWxvbi9jb21tb24vTWV0aG9kLnRzIiwidGFsb24vY29tbW9uL09wQ29kZS50cyIsInRhbG9uL2NvbW1vbi9QYXJhbWV0ZXIudHMiLCJ0YWxvbi9jb21tb24vVHlwZS50cyIsInRhbG9uL2NvbW1vbi9WZXJzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvVGFsb25Db21waWxlci50cyIsInRhbG9uL2NvbXBpbGVyL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvci50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9LZXl3b3Jkcy50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9QdW5jdHVhdGlvbi50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9UYWxvbkxleGVyLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1Rva2VuLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1Rva2VuVHlwZS50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvUGFyc2VDb250ZXh0LnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9UYWxvblBhcnNlci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvQWN0aW9uc0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0JpbmFyeUV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0NvbmNhdGVuYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Db250YWluc0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0ZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9JZkV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0xpc3RFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9MaXRlcmFsRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvUHJvZ3JhbUV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL1NheUV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL1NldFZhcmlhYmxlRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvRXZlbnRFeHByZXNzaW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvRXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL0ZpZWxkRGVjbGFyYXRpb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9JZkV4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9Qcm9ncmFtVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvU2F5RXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1R5cGVEZWNsYXJhdGlvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1Zpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1doZW5EZWNsYXJhdGlvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9zZW1hbnRpY3MvVGFsb25TZW1hbnRpY0FuYWx5emVyLnRzIiwidGFsb24vY29tcGlsZXIvdHJhbnNmb3JtaW5nL0V4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGUudHMiLCJ0YWxvbi9jb21waWxlci90cmFuc2Zvcm1pbmcvVGFsb25UcmFuc2Zvcm1lci50cyIsInRhbG9uL2xpYnJhcnkvQW55LnRzIiwidGFsb24vbGlicmFyeS9Cb29sZWFuVHlwZS50cyIsInRhbG9uL2xpYnJhcnkvRGVjb3JhdGlvbi50cyIsInRhbG9uL2xpYnJhcnkvRGVsZWdhdGUudHMiLCJ0YWxvbi9saWJyYXJ5L0VudHJ5UG9pbnRBdHRyaWJ1dGUudHMiLCJ0YWxvbi9saWJyYXJ5L0V4dGVybkNhbGwudHMiLCJ0YWxvbi9saWJyYXJ5L0l0ZW0udHMiLCJ0YWxvbi9saWJyYXJ5L0xpc3QudHMiLCJ0YWxvbi9saWJyYXJ5L051bWJlclR5cGUudHMiLCJ0YWxvbi9saWJyYXJ5L1BsYWNlLnRzIiwidGFsb24vbGlicmFyeS9QbGF5ZXIudHMiLCJ0YWxvbi9saWJyYXJ5L1NheS50cyIsInRhbG9uL2xpYnJhcnkvU3RyaW5nVHlwZS50cyIsInRhbG9uL2xpYnJhcnkvVW5kZXJzdGFuZGluZy50cyIsInRhbG9uL2xpYnJhcnkvV29ybGRPYmplY3QudHMiLCJ0YWxvbi9tYWluLnRzIiwidGFsb24vcnVudGltZS9FdmFsdWF0aW9uUmVzdWx0LnRzIiwidGFsb24vcnVudGltZS9NZXRob2RBY3RpdmF0aW9uLnRzIiwidGFsb24vcnVudGltZS9PcENvZGVIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9TdGFja0ZyYW1lLnRzIiwidGFsb24vcnVudGltZS9UYWxvblJ1bnRpbWUudHMiLCJ0YWxvbi9ydW50aW1lL1RocmVhZC50cyIsInRhbG9uL3J1bnRpbWUvY29tbW9uL01lbW9yeS50cyIsInRhbG9uL3J1bnRpbWUvZXJyb3JzL1J1bnRpbWVFcnJvci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvQXNzaWduVmFyaWFibGVIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9CcmFuY2hSZWxhdGl2ZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0JyYW5jaFJlbGF0aXZlSWZGYWxzZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0NvbmNhdGVuYXRlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvRXh0ZXJuYWxDYWxsSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvR29Ub0hhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0hhbmRsZUNvbW1hbmRIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9JbnN0YW5jZUNhbGxIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9JbnZva2VEZWxlZ2F0ZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRGaWVsZEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRJbnN0YW5jZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRMb2NhbEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWROdW1iZXJIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkUHJvcGVydHlIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkU3RyaW5nSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZFRoaXNIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9OZXdJbnN0YW5jZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL05vT3BIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9QYXJzZUNvbW1hbmRIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9QcmludEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1JlYWRJbnB1dEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1JldHVybkhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1N0YXRpY0NhbGxIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9UeXBlT2ZIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L01lYW5pbmcudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUFueS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lQm9vbGVhbi50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lQ29tbWFuZC50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lRGVjb3JhdGlvbi50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lRGVsZWdhdGUudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUVtcHR5LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVJbnRlZ2VyLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVJdGVtLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVMaXN0LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVQbGFjZS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lUGxheWVyLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVTYXkudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVN0cmluZy50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lV29ybGRPYmplY3QudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvVmFyaWFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0dBLE1BQWEsVUFBVTtJQUNuQixZQUFvQixJQUFtQjtRQUFuQixTQUFJLEdBQUosSUFBSSxDQUFlO0lBRXZDLENBQUM7SUFFRCxLQUFLO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBWTtRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFZO1FBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNsRCxDQUFDO0NBQ0o7QUFsQkQsZ0NBa0JDOzs7O0FDckJELDREQUF5RDtBQUV6RCw2Q0FBMEM7QUFFMUMseURBQXNEO0FBR3RELE1B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aWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4vcnVudGltZS9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IElMb2dPdXRwdXQgfSBmcm9tIFwiLi9ydW50aW1lL0lMb2dPdXRwdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYW5lT3V0cHV0IGltcGxlbWVudHMgSU91dHB1dCwgSUxvZ091dHB1dHtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFuZTpIVE1MRGl2RWxlbWVudCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyKCl7XHJcbiAgICAgICAgdGhpcy5wYW5lLmlubmVyVGV4dCA9IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZGVidWcobGluZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wYW5lLmlubmVyVGV4dCArPSBsaW5lICsgXCJcXG5cIjtcclxuICAgICAgICB0aGlzLnBhbmUuc2Nyb2xsVG8oMCwgdGhpcy5wYW5lLnNjcm9sbEhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgd3JpdGUobGluZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wYW5lLmlubmVyVGV4dCArPSBsaW5lICsgXCJcXG5cIjtcclxuICAgICAgICB0aGlzLnBhbmUuc2Nyb2xsVG8oMCwgdGhpcy5wYW5lLnNjcm9sbEhlaWdodCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUYWxvbkNvbXBpbGVyIH0gZnJvbSBcIi4vY29tcGlsZXIvVGFsb25Db21waWxlclwiO1xyXG5cclxuaW1wb3J0IHsgUGFuZU91dHB1dCB9IGZyb20gXCIuL1BhbmVPdXRwdXRcIjtcclxuXHJcbmltcG9ydCB7IFRhbG9uUnVudGltZSB9IGZyb20gXCIuL3J1bnRpbWUvVGFsb25SdW50aW1lXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi9jb21tb24vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uSWRle1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb2RlUGFuZTpIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZ2FtZVBhbmU6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBpbGF0aW9uT3V0cHV0OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBnYW1lTG9nT3V0cHV0OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBleGFtcGxlMUJ1dHRvbjpIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcGlsZUJ1dHRvbjpIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RhcnROZXdHYW1lQnV0dG9uOkhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSB1c2VyQ29tbWFuZFRleHQ6SFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2VuZFVzZXJDb21tYW5kQnV0dG9uOkhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcGlsYXRpb25PdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJ1bnRpbWVPdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJ1bnRpbWVMb2dPdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21waWxlcjpUYWxvbkNvbXBpbGVyO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBydW50aW1lOlRhbG9uUnVudGltZTtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBjb21waWxlZFR5cGVzOlR5cGVbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldEJ5SWQ8VCBleHRlbmRzIEhUTUxFbGVtZW50PihuYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIDxUPmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb2RlUGFuZSA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTERpdkVsZW1lbnQ+KFwiY29kZS1wYW5lXCIpITtcclxuICAgICAgICB0aGlzLmdhbWVQYW5lID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MRGl2RWxlbWVudD4oXCJnYW1lLXBhbmVcIikhO1xyXG4gICAgICAgIHRoaXMuY29tcGlsYXRpb25PdXRwdXQgPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxEaXZFbGVtZW50PihcImNvbXBpbGF0aW9uLW91dHB1dFwiKSE7XHJcbiAgICAgICAgdGhpcy5nYW1lTG9nT3V0cHV0ID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MRGl2RWxlbWVudD4oXCJsb2ctcGFuZVwiKSE7XHJcbiAgICAgICAgdGhpcy5leGFtcGxlMUJ1dHRvbiA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiZXhhbXBsZTFcIikhO1xyXG4gICAgICAgIHRoaXMuY29tcGlsZUJ1dHRvbiA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiY29tcGlsZVwiKSE7XHJcbiAgICAgICAgdGhpcy5zdGFydE5ld0dhbWVCdXR0b24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxCdXR0b25FbGVtZW50PihcInN0YXJ0LW5ldy1nYW1lXCIpITtcclxuICAgICAgICB0aGlzLnVzZXJDb21tYW5kVGV4dCA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTElucHV0RWxlbWVudD4oXCJ1c2VyLWNvbW1hbmQtdGV4dFwiKSE7XHJcbiAgICAgICAgdGhpcy5zZW5kVXNlckNvbW1hbmRCdXR0b24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxCdXR0b25FbGVtZW50PihcInNlbmQtdXNlci1jb21tYW5kXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZXhhbXBsZTFCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHRoaXMubG9hZEV4YW1wbGUoKSk7XHJcbiAgICAgICAgdGhpcy5jb21waWxlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB0aGlzLmNvbXBpbGUoKSk7XHJcbiAgICAgICAgdGhpcy5zdGFydE5ld0dhbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHRoaXMuc3RhcnROZXdHYW1lKCkpO1xyXG4gICAgICAgIHRoaXMuc2VuZFVzZXJDb21tYW5kQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB0aGlzLnNlbmRVc2VyQ29tbWFuZCgpKTtcclxuICAgICAgICB0aGlzLnVzZXJDb21tYW5kVGV4dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGUgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7IC8vIGVudGVyIGtleVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kVXNlckNvbW1hbmQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvZGVQYW5lLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJISVRcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IGdldENhcmV0UG9zaXRpb24gPSAoZWxlbWVudDpIVE1MRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJhbmdlID0gd2luZG93Py5nZXRTZWxlY3Rpb24oKT8uZ2V0UmFuZ2VBdCgwKSE7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJlQ2FyZXRSYW5nZSA9IHJhbmdlLmNsb25lUmFuZ2UoKTtcclxuICAgICAgICAgICAgICAgIHByZUNhcmV0UmFuZ2Uuc2VsZWN0Tm9kZUNvbnRlbnRzKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgcHJlQ2FyZXRSYW5nZS5zZXRFbmQocmFuZ2UuZW5kQ29udGFpbmVyLCByYW5nZS5lbmRPZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZUNhcmV0UmFuZ2UudG9TdHJpbmcoKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gOSkgeyAvLyB0YWIga2V5XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklOU0lERVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBnZXRDYXJldFBvc2l0aW9uKHRoaXMuY29kZVBhbmUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZVRleHQgPSB0aGlzLmNvZGVQYW5lLmlubmVyVGV4dC5zdWJzdHJpbmcoMCwgcG9zKTtcclxuICAgICAgICAgICAgICAgIHZhciBwb3N0VGV4dCA9IHRoaXMuY29kZVBhbmUuaW5uZXJUZXh0LnN1YnN0cmluZyhwb3MsIHRoaXMuY29kZVBhbmUuaW5uZXJUZXh0Lmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2RlUGFuZS5pbm5lclRleHQgPSBwcmVUZXh0ICsgXCIgICAgXCIgKyBwb3N0VGV4dDsgLy8gaW5wdXQgdGFiIGtleVxyXG5cclxuICAgICAgICAgICAgICAgIC8vdGhpcy5zZXRDYXJldFBvc2l0aW9uKHRoaXMuY29kZVBhbmUuaW5uZXJUZXh0LCBwb3MgKyAxKTtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBpbGF0aW9uT3V0cHV0UGFuZSA9IG5ldyBQYW5lT3V0cHV0KHRoaXMuY29tcGlsYXRpb25PdXRwdXQpO1xyXG4gICAgICAgIHRoaXMucnVudGltZU91dHB1dFBhbmUgPSBuZXcgUGFuZU91dHB1dCh0aGlzLmdhbWVQYW5lKTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWVMb2dPdXRwdXRQYW5lID0gbmV3IFBhbmVPdXRwdXQodGhpcy5nYW1lTG9nT3V0cHV0KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21waWxlciA9IG5ldyBUYWxvbkNvbXBpbGVyKHRoaXMuY29tcGlsYXRpb25PdXRwdXRQYW5lKTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWUgPSBuZXcgVGFsb25SdW50aW1lKHRoaXMucnVudGltZU91dHB1dFBhbmUsIHRoaXMucnVudGltZUxvZ091dHB1dFBhbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VuZFVzZXJDb21tYW5kKCl7XHJcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMudXNlckNvbW1hbmRUZXh0LnZhbHVlO1xyXG4gICAgICAgIHRoaXMucnVudGltZS5zZW5kQ29tbWFuZChjb21tYW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbXBpbGUoKXtcclxuICAgICAgICBjb25zdCBjb2RlID0gdGhpcy5jb2RlUGFuZS5pbm5lclRleHQ7XHJcblxyXG4gICAgICAgIHRoaXMuY29tcGlsYXRpb25PdXRwdXRQYW5lLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5jb21waWxlZFR5cGVzID0gdGhpcy5jb21waWxlci5jb21waWxlKGNvZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhcnROZXdHYW1lKCl7XHJcbiAgICAgICAgdGhpcy5ydW50aW1lT3V0cHV0UGFuZS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMucnVudGltZUxvZ091dHB1dFBhbmUuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucnVudGltZS5sb2FkRnJvbSh0aGlzLmNvbXBpbGVkVHlwZXMpKXtcclxuICAgICAgICAgICAgdGhpcy5ydW50aW1lLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9hZEV4YW1wbGUoKXtcclxuICAgICAgICAgICAgdGhpcy5jb2RlUGFuZS5pbm5lclRleHQgPSBcclxuICAgICAgICAgICAgICAgIFwic2F5IFxcXCJUaGlzIGlzIHRoZSBzdGFydC5cXFwiLlxcblxcblwiICtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXCJ1bmRlcnN0YW5kIFxcXCJsb29rXFxcIiBhcyBkZXNjcmliaW5nLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcIm5vcnRoXFxcIiBhcyBkaXJlY3Rpb25zLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcInNvdXRoXFxcIiBhcyBkaXJlY3Rpb25zLlxcblwiICtcclxuICAgICAgICAgICAgICAgIFwidW5kZXJzdGFuZCBcXFwiZ29cXFwiIGFzIG1vdmluZy4gXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJ1bmRlcnN0YW5kIFxcXCJ0YWtlXFxcIiBhcyB0YWtpbmcuIFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwidW5kZXJzdGFuZCBcXFwiaW52XFxcIiBhcyBpbnZlbnRvcnkuIFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwidW5kZXJzdGFuZCBcXFwiZHJvcFxcXCIgYXMgZHJvcHBpbmcuIFxcblxcblwiICtcclxuXHJcbiAgICAgICAgICAgICAgICBcImFuIElubiBpcyBhIGtpbmQgb2YgcGxhY2UuIFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwiaXQgaXMgd2hlcmUgdGhlIHBsYXllciBzdGFydHMuIFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwiaXQgaXMgZGVzY3JpYmVkIGFzIFxcXCJUaGUgaW5uIGlzIGEgY296eSBwbGFjZSwgd2l0aCBhIGNyYWNrbGluZyBmaXJlIG9uIHRoZSBoZWFydGguIFRoZSBiYXJ0ZW5kZXIgaXMgYmVoaW5kIHRoZSBiYXIuIEFuIG9wZW4gZG9vciB0byB0aGUgbm9ydGggbGVhZHMgb3V0c2lkZS5cXFwiIGFuZCBpZiBpdCBjb250YWlucyAxIENvaW4gdGhlbiBcXFwiVGhlcmUncyBhbHNvIGEgY29pbiBoZXJlLlxcXCIgZWxzZSBcXFwiVGhlcmUgaXMganVzdCBkdXN0LlxcXCIuXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJpdCBjb250YWlucyAxIENvaW4sIDEgRmlyZXBsYWNlLlxcblwiICsgXHJcbiAgICAgICAgICAgICAgICBcIml0IGNhbiByZWFjaCB0aGUgV2Fsa3dheSBieSBnb2luZyBcXFwibm9ydGhcXFwiLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGhhcyBhIFxcXCJ2YWx1ZVxcXCIgdGhhdCBpcyAxLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIndoZW4gdGhlIHBsYXllciBleGl0czogXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJzYXkgXFxcIlRoZSBiYXJ0ZW5kZXIgd2F2ZXMgZ29vZGJ5ZS5cXFwiOyBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInNldCBcXFwidmFsdWVcXFwiIHRvIDI7IFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwiYW5kIHRoZW4gc3RvcC4gXFxuXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcImEgRmlyZXBsYWNlIGlzIGEga2luZCBvZiBkZWNvcmF0aW9uLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGlzIGRlc2NyaWJlZCBhcyBcXFwiVGhlIGZpcmVwbGFjZSBjcmFja2xlcy4gSXQncyBmdWxsIG9mIGZpcmUuXFxcIi4gXFxuXFxuXCIgK1xyXG5cclxuICAgICAgICAgICAgICAgIFwiYSBXYWxrd2F5IGlzIGEga2luZCBvZiBwbGFjZS4gXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJpdCBpcyBkZXNjcmliZWQgYXMgXFxcIlRoZSB3YWxrd2F5IGluIGZyb250IG9mIHRoZSBpbm4gaXMgZW1wdHksIGp1c3QgYSBjb2JibGVzdG9uZSBlbnRyYW5jZS4gVGhlIGlubiBpcyB0byB0aGUgc291dGguXFxcIi4gXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJpdCBjYW4gcmVhY2ggdGhlIElubiBieSBnb2luZyBcXFwic291dGhcXFwiLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIndoZW4gdGhlIHBsYXllciBlbnRlcnM6XFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJzYXkgXFxcIllvdSB3YWxrIG9udG8gdGhlIGNvYmJsZXN0b25lcy4gVGhleSdyZSBuaWNlLCBpZiB5b3UgbGlrZSB0aGF0IHNvcnQgb2YgdGhpbmcuXFxcIjsgXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJzYXkgXFxcIlRoZXJlJ3Mgbm9ib2R5IGFyb3VuZC4gVGhlIHdpbmQgd2hpc3RsZXMgYSBsaXR0bGUgYml0LlxcXCI7IFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwiYW5kIHRoZW4gc3RvcC4gXFxuXFxuXCIgK1xyXG5cclxuICAgICAgICAgICAgICAgIFwic2F5IFxcXCJUaGlzIGlzIHRoZSBtaWRkbGUuXFxcIi5cXG5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFwiYSBDb2luIGlzIGEga2luZCBvZiBpdGVtLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGlzIGRlc2NyaWJlZCBhcyBcXFwiSXQncyBhIHNtYWxsIGNvaW4uXFxcIi5cXG5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFwic2F5IFxcXCJUaGlzIGlzIHRoZSBlbmQuXFxcIi5cXG5cIjtcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIEV2ZW50VHlwZXtcclxuICAgIE5vbmUsXHJcbiAgICBQbGF5ZXJFbnRlcnNQbGFjZSxcclxuICAgIFBsYXllckV4aXRzUGxhY2VcclxufSIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi9UeXBlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpZWxke1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgdHlwZU5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHR5cGU/OlR5cGU7XHJcbiAgICBkZWZhdWx0VmFsdWU/Ok9iamVjdDtcclxufSIsImltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydWN0aW9ue1xyXG4gICAgc3RhdGljIGFzc2lnbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkFzc2lnbik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGludm9rZURlbGVnYXRlKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuSW52b2tlRGVsZWdhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpc1R5cGVPZih0eXBlTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLlR5cGVPZiwgdHlwZU5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkTnVtYmVyKHZhbHVlOm51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZE51bWJlciwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkU3RyaW5nKHZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZFN0cmluZywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkSW5zdGFuY2UodHlwZU5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkSW5zdGFuY2UsIHR5cGVOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZEZpZWxkKGZpZWxkTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRGaWVsZCwgZmllbGROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZFByb3BlcnR5KGZpZWxkTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRQcm9wZXJ0eSwgZmllbGROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZExvY2FsKGxvY2FsTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRMb2NhbCwgbG9jYWxOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZFRoaXMoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkVGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGluc3RhbmNlQ2FsbChtZXRob2ROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuSW5zdGFuY2VDYWxsLCBtZXRob2ROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY29uY2F0ZW5hdGUoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Db25jYXRlbmF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN0YXRpY0NhbGwodHlwZU5hbWU6c3RyaW5nLCBtZXRob2ROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuU3RhdGljQ2FsbCwgYCR7dHlwZU5hbWV9LiR7bWV0aG9kTmFtZX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZXh0ZXJuYWxDYWxsKG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5FeHRlcm5hbENhbGwsIG1ldGhvZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwcmludCgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLlByaW50KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmV0dXJuKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuUmV0dXJuKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmVhZElucHV0KCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuUmVhZElucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcGFyc2VDb21tYW5kKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuUGFyc2VDb21tYW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaGFuZGxlQ29tbWFuZCgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkhhbmRsZUNvbW1hbmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnb1RvKGxpbmVOdW1iZXI6bnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Hb1RvLCBsaW5lTnVtYmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYnJhbmNoUmVsYXRpdmUoY291bnQ6bnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5CcmFuY2hSZWxhdGl2ZSwgY291bnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBicmFuY2hSZWxhdGl2ZUlmRmFsc2UoY291bnQ6bnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5CcmFuY2hSZWxhdGl2ZUlmRmFsc2UsIGNvdW50KTtcclxuICAgIH1cclxuXHJcbiAgICBvcENvZGU6T3BDb2RlID0gT3BDb2RlLk5vT3A7XHJcbiAgICB2YWx1ZT86T2JqZWN0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wQ29kZTpPcENvZGUsIHZhbHVlPzpPYmplY3Qpe1xyXG4gICAgICAgIHRoaXMub3BDb2RlID0gb3BDb2RlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFBhcmFtZXRlciB9IGZyb20gXCIuL1BhcmFtZXRlclwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4uL3J1bnRpbWUvbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBFdmVudFR5cGUgfSBmcm9tIFwiLi9FdmVudFR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZXRob2R7XHJcbiAgICBuYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICBwYXJhbWV0ZXJzOlBhcmFtZXRlcltdID0gW107XHJcbiAgICBhY3R1YWxQYXJhbWV0ZXJzOlZhcmlhYmxlW10gPSBbXTtcclxuICAgIGJvZHk6SW5zdHJ1Y3Rpb25bXSA9IFtdO1xyXG4gICAgcmV0dXJuVHlwZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgZXZlbnRUeXBlOkV2ZW50VHlwZSA9IEV2ZW50VHlwZS5Ob25lO1xyXG59IiwiZXhwb3J0IGVudW0gT3BDb2RlIHtcclxuICAgIE5vT3AsXHJcbiAgICBBc3NpZ24sXHJcbiAgICBQcmludCxcclxuICAgIExvYWRTdHJpbmcsXHJcbiAgICBOZXdJbnN0YW5jZSxcclxuICAgIFBhcnNlQ29tbWFuZCxcclxuICAgIEhhbmRsZUNvbW1hbmQsXHJcbiAgICBSZWFkSW5wdXQsXHJcbiAgICBHb1RvLFxyXG4gICAgUmV0dXJuLFxyXG4gICAgQnJhbmNoUmVsYXRpdmUsXHJcbiAgICBCcmFuY2hSZWxhdGl2ZUlmRmFsc2UsXHJcbiAgICBDb25jYXRlbmF0ZSxcclxuICAgIExvYWROdW1iZXIsXHJcbiAgICBMb2FkRmllbGQsXHJcbiAgICBMb2FkUHJvcGVydHksXHJcbiAgICBMb2FkSW5zdGFuY2UsXHJcbiAgICBMb2FkTG9jYWwsXHJcbiAgICBMb2FkVGhpcyxcclxuICAgIEluc3RhbmNlQ2FsbCxcclxuICAgIFN0YXRpY0NhbGwsXHJcbiAgICBFeHRlcm5hbENhbGwsXHJcbiAgICBUeXBlT2YsXHJcbiAgICBJbnZva2VEZWxlZ2F0ZVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuL1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJhbWV0ZXJ7XHJcbiAgICBcclxuICAgIHR5cGU/OlR5cGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG5hbWU6c3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHR5cGVOYW1lOnN0cmluZyl7XHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi9NZXRob2RcIjtcclxuaW1wb3J0IHsgQXR0cmlidXRlIH0gZnJvbSBcIi4vQXR0cmlidXRlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHlwZXsgICAgICBcclxuICAgIGZpZWxkczpGaWVsZFtdID0gW107XHJcbiAgICBtZXRob2RzOk1ldGhvZFtdID0gW107IFxyXG4gICAgYXR0cmlidXRlczpBdHRyaWJ1dGVbXSA9IFtdO1xyXG5cclxuICAgIGdldCBpc1N5c3RlbVR5cGUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5uYW1lLnN0YXJ0c1dpdGgoXCJ+XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0Fub255bW91c1R5cGUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5uYW1lLnN0YXJ0c1dpdGgoXCI8fj5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6c3RyaW5nLCBwdWJsaWMgYmFzZVR5cGVOYW1lOnN0cmluZyl7XHJcblxyXG4gICAgfSAgICBcclxufSIsImV4cG9ydCBjbGFzcyBWZXJzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG1ham9yOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBtaW5vcjpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgcGF0Y2g6bnVtYmVyKXtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLm1ham9yfS4ke3RoaXMubWlub3J9LiR7dGhpcy5wYXRjaH1gO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tIFwiLi4vY29tbW9uL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IEVudHJ5UG9pbnRBdHRyaWJ1dGUgfSBmcm9tIFwiLi4vbGlicmFyeS9FbnRyeVBvaW50QXR0cmlidXRlXCI7XHJcbmltcG9ydCB7IFRhbG9uTGV4ZXIgfSBmcm9tIFwiLi9sZXhpbmcvVGFsb25MZXhlclwiO1xyXG5pbXBvcnQgeyBUYWxvblBhcnNlciB9IGZyb20gXCIuL3BhcnNpbmcvVGFsb25QYXJzZXJcIjtcclxuaW1wb3J0IHsgVGFsb25TZW1hbnRpY0FuYWx5emVyIH0gZnJvbSBcIi4vc2VtYW50aWNzL1RhbG9uU2VtYW50aWNBbmFseXplclwiO1xyXG5pbXBvcnQgeyBUYWxvblRyYW5zZm9ybWVyIH0gZnJvbSBcIi4vdHJhbnNmb3JtaW5nL1RhbG9uVHJhbnNmb3JtZXJcIjtcclxuaW1wb3J0IHsgVmVyc2lvbiB9IGZyb20gXCIuLi9jb21tb24vVmVyc2lvblwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uL3J1bnRpbWUvSU91dHB1dFwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IERlbGVnYXRlIH0gZnJvbSBcIi4uL2xpYnJhcnkvRGVsZWdhdGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvbkNvbXBpbGVye1xyXG4gICAgZ2V0IGxhbmd1YWdlVmVyc2lvbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVyc2lvbigxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmVyc2lvbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVyc2lvbigxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuICAgIH1cclxuXHJcbiAgICBjb21waWxlKGNvZGU6c3RyaW5nKTpUeXBlW117XHJcbiAgICAgICAgdGhpcy5vdXQud3JpdGUoXCJTdGFydGluZyBjb21waWxhdGlvbi4uLlwiKTtcclxuXHJcbiAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICBjb25zdCBsZXhlciA9IG5ldyBUYWxvbkxleGVyKHRoaXMub3V0KTtcclxuICAgICAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IFRhbG9uUGFyc2VyKHRoaXMub3V0KTtcclxuICAgICAgICAgICAgY29uc3QgYW5hbHl6ZXIgPSBuZXcgVGFsb25TZW1hbnRpY0FuYWx5emVyKHRoaXMub3V0KTtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSBuZXcgVGFsb25UcmFuc2Zvcm1lcih0aGlzLm91dCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0b2tlbnMgPSBsZXhlci50b2tlbml6ZShjb2RlKTtcclxuICAgICAgICAgICAgY29uc3QgYXN0ID0gcGFyc2VyLnBhcnNlKHRva2Vucyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuYWx5emVkQXN0ID0gYW5hbHl6ZXIuYW5hbHl6ZShhc3QpO1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRyYW5zZm9ybWVyLnRyYW5zZm9ybShhbmFseXplZEFzdCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBlbnRyeVBvaW50ID0gdGhpcy5jcmVhdGVFbnRyeVBvaW50KCk7XHJcblxyXG4gICAgICAgICAgICB0eXBlcy5wdXNoKGVudHJ5UG9pbnQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVzO1xyXG4gICAgICAgIH0gY2F0Y2goZXgpe1xyXG4gICAgICAgICAgICBpZiAoZXggaW5zdGFuY2VvZiBDb21waWxhdGlvbkVycm9yKXtcclxuICAgICAgICAgICAgICAgIHRoaXMub3V0LndyaXRlKGBFcnJvcjogJHtleC5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vdXQud3JpdGUoYFVuaGFuZGxlZCBFcnJvcjogJHtleH1gKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH0gZmluYWxseXtcclxuICAgICAgICAgICAgdGhpcy5vdXQud3JpdGUoXCJDb21waWxhdGlvbiBjb21wbGV0ZS5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlRW50cnlQb2ludCgpe1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBuZXcgVHlwZShcIn5lbnRyeVBvaW50XCIsIFwifmVtcHR5XCIpO1xyXG5cclxuICAgICAgICB0eXBlLmF0dHJpYnV0ZXMucHVzaChuZXcgRW50cnlQb2ludEF0dHJpYnV0ZSgpKTtcclxuXHJcbiAgICAgICAgY29uc3QgbWFpbiA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICBtYWluLm5hbWUgPSBBbnkubWFpbjtcclxuICAgICAgICBtYWluLmJvZHkucHVzaChcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhgVGFsb24gTGFuZ3VhZ2Ugdi4ke3RoaXMubGFuZ3VhZ2VWZXJzaW9ufSwgQ29tcGlsZXIgdi4ke3RoaXMudmVyc2lvbn1gKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoXCJcIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnN0YXRpY0NhbGwoXCJ+Z2xvYmFsU2F5c1wiLCBcIn5zYXlcIiksICAgICAgICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIlwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIldoYXQgd291bGQgeW91IGxpa2UgdG8gZG8/XCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5yZWFkSW5wdXQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIlwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucGFyc2VDb21tYW5kKCksICAgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5oYW5kbGVDb21tYW5kKCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmlzVHlwZU9mKERlbGVnYXRlLnR5cGVOYW1lKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmVJZkZhbHNlKDIpLCAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5pbnZva2VEZWxlZ2F0ZSgpLCAgICAgICAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlKC00KSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uZ29Ubyg5KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHR5cGUubWV0aG9kcy5wdXNoKG1haW4pO1xyXG5cclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBDb21waWxhdGlvbkVycm9ye1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBtZXNzYWdlOnN0cmluZyl7XHJcblxyXG4gICAgfVxyXG59IiwiaW50ZXJmYWNlIEluZGV4YWJsZXtcclxuICAgIFtrZXk6c3RyaW5nXTphbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBLZXl3b3Jkc3tcclxuICAgIFxyXG4gICAgc3RhdGljIHJlYWRvbmx5IGFuID0gXCJhblwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGEgPSBcImFcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0aGUgPSBcInRoZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGlzID0gXCJpc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGtpbmQgPSBcImtpbmRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBvZiA9IFwib2ZcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwbGFjZSA9IFwicGxhY2VcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpdGVtID0gXCJpdGVtXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaXQgPSBcIml0XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaGFzID0gXCJoYXNcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpZiA9IFwiaWZcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZXNjcmlwdGlvbiA9IFwiZGVzY3JpcHRpb25cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB1bmRlcnN0YW5kID0gXCJ1bmRlcnN0YW5kXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYXMgPSBcImFzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGVzY3JpYmluZyA9IFwiZGVzY3JpYmluZ1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRlc2NyaWJlZCA9IFwiZGVzY3JpYmVkXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgd2hlcmUgPSBcIndoZXJlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGxheWVyID0gXCJwbGF5ZXJcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBzdGFydHMgPSBcInN0YXJ0c1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNvbnRhaW5zID0gXCJjb250YWluc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHNheSA9IFwic2F5XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGlyZWN0aW9ucyA9IFwiZGlyZWN0aW9uc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG1vdmluZyA9IFwibW92aW5nXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdGFraW5nID0gXCJ0YWtpbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpbnZlbnRvcnkgPSBcImludmVudG9yeVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNhbiA9IFwiY2FuXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcmVhY2ggPSBcInJlYWNoXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYnkgPSBcImJ5XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZ29pbmcgPSBcImdvaW5nXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYW5kID0gXCJhbmRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0aGVuID0gXCJ0aGVuXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZWxzZSA9IFwiZWxzZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHdoZW4gPSBcIndoZW5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBlbnRlcnMgPSBcImVudGVyc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGV4aXRzID0gXCJleGl0c1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHN0b3AgPSBcInN0b3BcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkcm9wcGluZyA9IFwiZHJvcHBpbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0aGF0ID0gXCJ0aGF0XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc2V0ID0gXCJzZXRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0byA9IFwidG9cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZWNvcmF0aW9uID0gXCJkZWNvcmF0aW9uXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdmlzaWJsZSA9IFwidmlzaWJsZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG5vdCA9IFwibm90XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgb2JzZXJ2ZWQgPSBcIm9ic2VydmVkXCI7XHJcblxyXG4gICAgc3RhdGljIGdldEFsbCgpOlNldDxzdHJpbmc+e1xyXG4gICAgICAgIHR5cGUgS2V5d29yZFByb3BlcnRpZXMgPSBrZXlvZiBLZXl3b3JkcztcclxuXHJcbiAgICAgICAgY29uc3QgYWxsS2V5d29yZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhLZXl3b3Jkcyk7XHJcblxyXG4gICAgICAgIGZvcihsZXQga2V5d29yZCBvZiBuYW1lcyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gKEtleXdvcmRzIGFzIEluZGV4YWJsZSlba2V5d29yZF07XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmIHZhbHVlICE9IFwiS2V5d29yZHNcIil7XHJcbiAgICAgICAgICAgICAgICBhbGxLZXl3b3Jkcy5hZGQodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYWxsS2V5d29yZHM7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgUHVuY3R1YXRpb257XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGVyaW9kID0gXCIuXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY29sb24gPSBcIjpcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBzZW1pY29sb24gPSBcIjtcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBjb21tYSA9IFwiLFwiO1xyXG59IiwiaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi9Ub2tlblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFB1bmN0dWF0aW9uIH0gZnJvbSBcIi4vUHVuY3R1YXRpb25cIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25MZXhlcntcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGFsbEtleXdvcmRzID0gS2V5d29yZHMuZ2V0QWxsKCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXQ6SU91dHB1dCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRva2VuaXplKGNvZGU6c3RyaW5nKTpUb2tlbltde1xyXG4gICAgICAgIGxldCBjdXJyZW50TGluZSA9IDE7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRDb2x1bW4gPSAxO1xyXG5cclxuICAgICAgICBjb25zdCB0b2tlbnM6VG9rZW5bXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb2RlLmxlbmd0aDsgKXtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSBjb2RlLmNoYXJBdChpbmRleCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gXCIgXCIpe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvbHVtbisrO1xyXG4gICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gXCJcXG5cIil7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29sdW1uID0gMTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lKys7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB0b2tlblZhbHVlID0gdGhpcy5jb25zdW1lVG9rZW5DaGFyc0F0KGNvZGUsIGluZGV4KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0b2tlblZhbHVlLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBuZXcgVG9rZW4oY3VycmVudExpbmUsIGN1cnJlbnRDb2x1bW4sIHRva2VuVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50Q29sdW1uICs9IHRva2VuVmFsdWUubGVuZ3RoO1xyXG4gICAgICAgICAgICBpbmRleCArPSB0b2tlblZhbHVlLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzaWZ5KHRva2Vucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGFzc2lmeSh0b2tlbnM6VG9rZW5bXSk6VG9rZW5bXXtcclxuICAgICAgICBmb3IobGV0IHRva2VuIG9mIHRva2Vucyl7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PSBQdW5jdHVhdGlvbi5wZXJpb2Qpe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5UZXJtaW5hdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlID09IFB1bmN0dWF0aW9uLnNlbWljb2xvbil7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLlNlbWlUZXJtaW5hdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlID09IFB1bmN0dWF0aW9uLmNvbG9uKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuT3Blbk1ldGhvZEJsb2NrO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlID09IFB1bmN0dWF0aW9uLmNvbW1hKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuTGlzdFNlcGFyYXRvcjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChUYWxvbkxleGVyLmFsbEtleXdvcmRzLmhhcyh0b2tlbi52YWx1ZSkpe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5LZXl3b3JkO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlLnN0YXJ0c1dpdGgoXCJcXFwiXCIpICYmIHRva2VuLnZhbHVlLmVuZHNXaXRoKFwiXFxcIlwiKSl7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLlN0cmluZztcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghaXNOYU4oTnVtYmVyKHRva2VuLnZhbHVlKSkpIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuTnVtYmVyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5JZGVudGlmaWVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW5zO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29uc3VtZVRva2VuQ2hhcnNBdChjb2RlOnN0cmluZywgaW5kZXg6bnVtYmVyKTpzdHJpbmd7XHJcbiAgICAgICAgY29uc3QgdG9rZW5DaGFyczpzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHN0cmluZ0RlbGltaXRlciA9IFwiXFxcIlwiO1xyXG5cclxuICAgICAgICBsZXQgaXNDb25zdW1pbmdTdHJpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yKGxldCByZWFkQWhlYWRJbmRleCA9IGluZGV4OyByZWFkQWhlYWRJbmRleCA8IGNvZGUubGVuZ3RoOyByZWFkQWhlYWRJbmRleCsrKXtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSBjb2RlLmNoYXJBdChyZWFkQWhlYWRJbmRleCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNDb25zdW1pbmdTdHJpbmcgJiYgY3VycmVudENoYXIgIT0gc3RyaW5nRGVsaW1pdGVyKXtcclxuICAgICAgICAgICAgICAgIHRva2VuQ2hhcnMucHVzaChjdXJyZW50Q2hhcik7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDaGFyID09IHN0cmluZ0RlbGltaXRlcil7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdG9rZW5DaGFycy5wdXNoKGN1cnJlbnRDaGFyKTsgICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgaXNDb25zdW1pbmdTdHJpbmcgPSAhaXNDb25zdW1pbmdTdHJpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzQ29uc3VtaW5nU3RyaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gXCIgXCIgfHwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q2hhciA9PSBcIlxcblwiIHx8IFxyXG4gICAgICAgICAgICAgICAgY3VycmVudENoYXIgPT0gUHVuY3R1YXRpb24ucGVyaW9kIHx8IFxyXG4gICAgICAgICAgICAgICAgY3VycmVudENoYXIgPT0gUHVuY3R1YXRpb24uY29sb24gfHwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q2hhciA9PSBQdW5jdHVhdGlvbi5zZW1pY29sb24gfHxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDaGFyID09IFB1bmN0dWF0aW9uLmNvbW1hKXtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbkNoYXJzLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbkNoYXJzLnB1c2goY3VycmVudENoYXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRva2VuQ2hhcnMucHVzaChjdXJyZW50Q2hhcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW5DaGFycy5qb2luKFwiXCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvSXRlbVwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBEZWNvcmF0aW9uIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvRGVjb3JhdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRva2Vue1xyXG4gICAgc3RhdGljIGdldCBlbXB0eSgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoXCJ+ZW1wdHlcIiwgVG9rZW5UeXBlLlVua25vd24pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yQW55KCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihBbnkudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvclBsYWNlKCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihQbGFjZS50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9ySXRlbSgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoSXRlbS50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yRGVjb3JhdGlvbigpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoRGVjb3JhdGlvbi50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yV29ybGRPYmplY3QoKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKFdvcmxkT2JqZWN0LnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JCb29sZWFuKCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihCb29sZWFuVHlwZS50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yTGlzdCgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoTGlzdC50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldFRva2VuV2l0aFR5cGVPZihuYW1lOnN0cmluZywgdHlwZTpUb2tlblR5cGUpe1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gbmV3IFRva2VuKC0xLC0xLG5hbWUpO1xyXG4gICAgICAgIHRva2VuLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH1cclxuXHJcbiAgICB0eXBlOlRva2VuVHlwZSA9IFRva2VuVHlwZS5Vbmtub3duO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBsaW5lOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBjb2x1bW46bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHZhbHVlOnN0cmluZyl7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gYCR7dGhpcy5saW5lfXwke3RoaXMuY29sdW1ufTogRm91bmQgdG9rZW4gJyR7dGhpcy52YWx1ZX0nIG9mIHR5cGUgJyR7dGhpcy50eXBlfSdgO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gVG9rZW5UeXBlIHtcclxuICAgIFVua25vd24sXHJcbiAgICBLZXl3b3JkLFxyXG4gICAgVGVybWluYXRvcixcclxuICAgIFNlbWlUZXJtaW5hdG9yLFxyXG4gICAgU3RyaW5nLFxyXG4gICAgSWRlbnRpZmllcixcclxuICAgIE51bWJlcixcclxuICAgIE9wZW5NZXRob2RCbG9jayxcclxuICAgIExpc3RTZXBhcmF0b3JcclxufSIsImltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4uL2xleGluZy9Ub2tlblwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4uL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvclwiO1xyXG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuVHlwZVwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uLy4uL3J1bnRpbWUvSU91dHB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhcnNlQ29udGV4dHtcclxuICAgIGluZGV4Om51bWJlciA9IDA7XHJcblxyXG4gICAgZ2V0IGlzRG9uZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ID49IHRoaXMudG9rZW5zLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudFRva2VuKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdG9rZW5zOlRva2VuW10sIHByaXZhdGUgcmVhZG9ubHkgb3V0OklPdXRwdXQpe1xyXG4gICAgICAgIHRoaXMub3V0LndyaXRlKGAke3Rva2Vucy5sZW5ndGh9IHRva2VucyBkaXNjb3ZlcmVkLCBwYXJzaW5nLi4uYCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3VtZUN1cnJlbnRUb2tlbigpe1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5jdXJyZW50VG9rZW47XHJcblxyXG4gICAgICAgIHRoaXMuaW5kZXgrKztcclxuXHJcbiAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgfVxyXG5cclxuICAgIGlzKHRva2VuVmFsdWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VG9rZW4/LnZhbHVlID09IHRva2VuVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNUeXBlT2YodHlwZTpUb2tlblR5cGUpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUb2tlbi50eXBlID09IHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNBbnlUeXBlT2YoLi4udHlwZXM6VG9rZW5UeXBlW10pe1xyXG4gICAgICAgIGZvcihjb25zdCB0eXBlIG9mIHR5cGVzKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNUeXBlT2YodHlwZSkpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0FueU9mKC4uLnRva2VuVmFsdWVzOnN0cmluZ1tdKXtcclxuICAgICAgICBmb3IobGV0IHZhbHVlIG9mIHRva2VuVmFsdWVzKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXModmFsdWUpKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaXNUZXJtaW5hdG9yKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRva2VuLnR5cGUgPT0gVG9rZW5UeXBlLlRlcm1pbmF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0QW55T2YoLi4udG9rZW5WYWx1ZXM6c3RyaW5nW10pe1xyXG4gICAgICAgIGlmICghdGhpcy5pc0FueU9mKC4uLnRva2VuVmFsdWVzKSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiRXhwZWN0ZWQgdG9rZW5zXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0KHRva2VuVmFsdWU6c3RyaW5nKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9rZW4udmFsdWUgIT0gdG9rZW5WYWx1ZSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKGBFeHBlY3RlZCB0b2tlbiAnJHt0b2tlblZhbHVlfSdgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RTdHJpbmcoKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9rZW4udHlwZSAhPSBUb2tlblR5cGUuU3RyaW5nKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJFeHBlY3RlZCBzdHJpbmdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG5cclxuICAgICAgICAvLyBXZSBuZWVkIHRvIHN0cmlwIG9mZiB0aGUgZG91YmxlIHF1b3RlcyBmcm9tIHRoZWlyIHN0cmluZyBhZnRlciB3ZSBjb25zdW1lIGl0LlxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBuZXcgVG9rZW4odG9rZW4ubGluZSwgdG9rZW4uY29sdW1uLCB0b2tlbi52YWx1ZS5zdWJzdHJpbmcoMSwgdG9rZW4udmFsdWUubGVuZ3RoIC0gMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdE51bWJlcigpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi50eXBlICE9IFRva2VuVHlwZS5OdW1iZXIpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIG51bWJlclwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RJZGVudGlmaWVyKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRva2VuLnR5cGUgIT0gVG9rZW5UeXBlLklkZW50aWZpZXIpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIGlkZW50aWZpZXJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0VGVybWluYXRvcigpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi50eXBlICE9IFRva2VuVHlwZS5UZXJtaW5hdG9yKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJFeHBlY3RlZCBleHByZXNzaW9uIHRlcm1pbmF0b3JcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0U2VtaVRlcm1pbmF0b3IoKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9rZW4udHlwZSAhPSBUb2tlblR5cGUuU2VtaVRlcm1pbmF0b3Ipe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIHNlbWkgZXhwcmVzc2lvbiB0ZXJtaW5hdG9yXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdE9wZW5NZXRob2RCbG9jaygpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi50eXBlICE9IFRva2VuVHlwZS5PcGVuTWV0aG9kQmxvY2spe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIG9wZW4gbWV0aG9kIGJsb2NrXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFByb2dyYW1WaXNpdG9yIH0gZnJvbSBcIi4vdmlzaXRvcnMvUHJvZ3JhbVZpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25QYXJzZXJ7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHBhcnNlKHRva2VuczpUb2tlbltdKTpFeHByZXNzaW9ue1xyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgUGFyc2VDb250ZXh0KHRva2VucywgdGhpcy5vdXQpO1xyXG4gICAgICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgUHJvZ3JhbVZpc2l0b3IoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFjdGlvbnNFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBhY3Rpb25zOkV4cHJlc3Npb25bXSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmluYXJ5RXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBsZWZ0PzpFeHByZXNzaW9uO1xyXG4gICAgcmlnaHQ/OkV4cHJlc3Npb247XHJcbn0iLCJpbXBvcnQgeyBCaW5hcnlFeHByZXNzaW9uIH0gZnJvbSBcIi4vQmluYXJ5RXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmNhdGVuYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgQmluYXJ5RXhwcmVzc2lvbntcclxuICAgIFxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb250YWluc0V4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHRhcmdldE5hbWU6c3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGNvdW50Om51bWJlciwgXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdHlwZU5hbWU6c3RyaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIEV4cHJlc3Npb257XHJcbiAgICBcclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEJpbmFyeUV4cHJlc3Npb24gfSBmcm9tIFwiLi9CaW5hcnlFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgdHlwZU5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIGluaXRpYWxWYWx1ZT86T2JqZWN0O1xyXG4gICAgdHlwZT86VHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbjtcclxuICAgIGFzc29jaWF0ZWRFeHByZXNzaW9uczpCaW5hcnlFeHByZXNzaW9uW10gPSBbXTtcclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSWZFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBjb25kaXRpb25hbDpFeHByZXNzaW9uLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGlmQmxvY2s6RXhwcmVzc2lvbixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBlbHNlQmxvY2s6RXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlzdEV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGl0ZW1zOkV4cHJlc3Npb25bXSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGl0ZXJhbEV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHR5cGVOYW1lOnN0cmluZywgcHVibGljIHJlYWRvbmx5IHZhbHVlOk9iamVjdCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZ3JhbUV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZXhwcmVzc2lvbnM6RXhwcmVzc2lvbltdKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTYXlFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZXh0OnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0VmFyaWFibGVFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBpbnN0YW5jZU5hbWU6c3RyaW5nfHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB2YXJpYWJsZU5hbWU6c3RyaW5nLCBcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBldmFsdWF0aW9uRXhwcmVzc2lvbjpFeHByZXNzaW9uKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4vRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuL1doZW5EZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIGJhc2VUeXBlPzpUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uO1xyXG4gICAgZmllbGRzOkZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuICAgIGV2ZW50czpXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZVRva2VuOlRva2VuLCByZWFkb25seSBiYXNlVHlwZU5hbWVUb2tlbjpUb2tlbil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lVG9rZW4udmFsdWU7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB2YWx1ZTpzdHJpbmcsIHB1YmxpYyByZWFkb25seSBtZWFuaW5nOnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgYWN0b3I6c3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGV2ZW50S2luZDpzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgYWN0aW9uczpFeHByZXNzaW9uKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQdW5jdHVhdGlvbiB9IGZyb20gXCIuLi8uLi9sZXhpbmcvUHVuY3R1YXRpb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IEFjdGlvbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0FjdGlvbnNFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRXZlbnRFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIEV4cHJlc3Npb25WaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDpQYXJzZUNvbnRleHQpOkV4cHJlc3Npb257XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgYWN0aW9uczpFeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUoIWNvbnRleHQuaXMoS2V5d29yZHMuYW5kKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbiA9IHN1cGVyLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goYWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0U2VtaVRlcm1pbmF0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmFuZCk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlbik7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuc3RvcCk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQWN0aW9uc0V4cHJlc3Npb24oYWN0aW9ucyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgSWZFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0lmRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi8uLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgQ29udGFpbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0NvbnRhaW5zRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBTYXlFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1NheUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xleGluZy9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgU2V0VmFyaWFibGVFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1NldFZhcmlhYmxlRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBMaXRlcmFsRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9MaXRlcmFsRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBOdW1iZXJUeXBlIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvTnVtYmVyVHlwZVwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5pbXBvcnQgeyBMaXN0RXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9MaXN0RXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmlmKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgSWZFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuaXQpKXtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXQpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5jb250YWlucyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IGNvbnRleHQuZXhwZWN0TnVtYmVyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVOYW1lID0gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbnRhaW5zRXhwcmVzc2lvbihcIn5pdFwiLCBOdW1iZXIoY291bnQudmFsdWUpLCB0eXBlTmFtZS52YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLnNldCkpe1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5zZXQpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHZhcmlhYmxlTmFtZTpzdHJpbmc7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuU3RyaW5nKSl7XHJcbiAgICAgICAgICAgICAgICB2YXJpYWJsZU5hbWUgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpLnZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogU3VwcG9ydCBkZXJlZmVyZW5jaW5nIGFyYml0cmFyeSBpbnN0YW5jZXMuXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkN1cnJlbnRseSB1bmFibGUgdG8gZGVyZWZlcmVuY2UgYSBmaWVsZCwgcGxhbm5lZCBmb3IgYSBmdXR1cmUgcmVsZWFzZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudG8pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdmlzaXRvciA9IG5ldyBFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFNldFZhcmlhYmxlRXhwcmVzc2lvbih1bmRlZmluZWQsIHZhcmlhYmxlTmFtZSwgdmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5zYXkpKXtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuc2F5KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTYXlFeHByZXNzaW9uKHRleHQudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuU3RyaW5nKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGl0ZXJhbEV4cHJlc3Npb24oU3RyaW5nVHlwZS50eXBlTmFtZSwgdmFsdWUudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuTnVtYmVyKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dC5leHBlY3ROdW1iZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGl0ZXJhbEV4cHJlc3Npb24oTnVtYmVyVHlwZS50eXBlTmFtZSwgdmFsdWUudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuTGlzdFNlcGFyYXRvcikpe1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtczpFeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLkxpc3RTZXBhcmF0b3IpKXtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMudmlzaXQoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IExpc3RFeHByZXNzaW9uKGl0ZW1zKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byBwYXJzZSBleHByZXNzaW9uXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgQW5kRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9BbmRFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xleGluZy9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGaWVsZERlY2xhcmF0aW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuXHJcbiAgICAgICAgY29uc3QgZmllbGQgPSBuZXcgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24oKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXQpO1xyXG5cclxuICAgICAgICBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5pcykpe1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5pc0FueU9mKEtleXdvcmRzLm5vdCwgS2V5d29yZHMudmlzaWJsZSkpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzVmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMubm90KSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMubm90KTtcclxuICAgICAgICAgICAgICAgICAgICBpc1Zpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy52aXNpYmxlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaWVsZC5uYW1lID0gV29ybGRPYmplY3QudmlzaWJsZTtcclxuICAgICAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gQm9vbGVhblR5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBpc1Zpc2libGU7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMub2JzZXJ2ZWQpKXtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLm9ic2VydmVkKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmFzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBvYnNlcnZhdGlvbiA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IFdvcmxkT2JqZWN0Lm9ic2VydmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gb2JzZXJ2YXRpb24udmFsdWU7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuZGVzY3JpYmVkKSl7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5kZXNjcmliZWQpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaWVsZC5uYW1lID0gV29ybGRPYmplY3QuZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IFN0cmluZ1R5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBkZXNjcmlwdGlvbi52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY29udGV4dC5pcyhLZXl3b3Jkcy5hbmQpKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb25WaXNpdG9yID0gbmV3IEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb25WaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0RXhwcmVzc2lvbiA9IChmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnMubGVuZ3RoID09IDApID8gZmllbGQgOiBmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnNbZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zLmxlbmd0aCAtIDFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25jYXQgPSBuZXcgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uY2F0LmxlZnQgPSBsZWZ0RXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgICAgICAgICBjb25jYXQucmlnaHQgPSBleHByZXNzaW9uO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnMucHVzaChjb25jYXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLndoZXJlKSl7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy53aGVyZSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy50aGUpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMucGxheWVyKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnN0YXJ0cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IFBsYWNlLmlzUGxheWVyU3RhcnQ7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IEJvb2xlYW5UeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiVW5hYmxlIHRvIGRldGVybWluZSBwcm9wZXJ0eSBmaWVsZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5oYXMpKXtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmhhcyk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmEpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy50aGF0KTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLlN0cmluZykpe1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gY29udGV4dC5leHBlY3RTdHJpbmcoKS52YWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzVHlwZU9mKFRva2VuVHlwZS5OdW1iZXIpKXtcclxuICAgICAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gTnVtYmVyVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IGNvbnRleHQuZXhwZWN0TnVtYmVyKCkudmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgRXhwZWN0ZWQgYSBzdHJpbmcgb3IgYSBudW1iZXIgYnV0IGZvdW5kICcke2NvbnRleHQuY3VycmVudFRva2VuLnZhbHVlfSdgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBuYW1lLnZhbHVlO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuY29udGFpbnMpKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmNvbnRhaW5zKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGV4cGVjdFBhaXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb3VudCA9IGNvbnRleHQuZXhwZWN0TnVtYmVyKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtOdW1iZXIoY291bnQudmFsdWUpLCBuYW1lLnZhbHVlXTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0gW2V4cGVjdFBhaXIoKV07XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuTGlzdFNlcGFyYXRvcikpe1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaChleHBlY3RQYWlyKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaWVsZC5uYW1lID0gV29ybGRPYmplY3QuY29udGVudHM7XHJcbiAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gTGlzdC50eXBlTmFtZTtcclxuICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gaXRlbXM7IFxyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5jYW4pKXtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmNhbik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnJlYWNoKTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlTmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYnkpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5nb2luZyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgZmllbGQubmFtZSA9IGB+JHtkaXJlY3Rpb24udmFsdWV9YDtcclxuICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBgJHtwbGFjZU5hbWUudmFsdWV9YDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byBkZXRlcm1pbmUgZmllbGRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0VGVybWluYXRvcigpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmllbGQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBJZkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvSWZFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSWZFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pZik7XHJcblxyXG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb25WaXNpdG9yID0gbmV3IEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgY29uc3QgY29uZGl0aW9uYWwgPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlbik7XHJcblxyXG4gICAgICAgIGNvbnN0IGlmQmxvY2sgPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuZWxzZSkpe1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5lbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGVsc2VCbG9jayA9IGV4cHJlc3Npb25WaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBJZkV4cHJlc3Npb24oY29uZGl0aW9uYWwsIGlmQmxvY2ssIGVsc2VCbG9jayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IElmRXhwcmVzc2lvbihjb25kaXRpb25hbCwgaWZCbG9jaywgbmV3IEV4cHJlc3Npb24oKSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL1R5cGVEZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgUHJvZ3JhbUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvUHJvZ3JhbUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi8uLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgU2F5RXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9TYXlFeHByZXNzaW9uVmlzaXRvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb2dyYW1WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGxldCBleHByZXNzaW9uczpFeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUoIWNvbnRleHQuaXNEb25lKXtcclxuICAgICAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMudW5kZXJzdGFuZCkpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uID0gbmV3IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB1bmRlcnN0YW5kaW5nRGVjbGFyYXRpb24udmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzQW55T2YoS2V5d29yZHMuYSwgS2V5d29yZHMuYW4pKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVEZWNsYXJhdGlvbiA9IG5ldyBUeXBlRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gdHlwZURlY2xhcmF0aW9uLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5zYXkpKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNheUV4cHJlc3Npb24gPSBuZXcgU2F5RXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBzYXlFeHByZXNzaW9uLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEF0IHRoZSB0b3AgbGV2ZWwsIGEgc2F5IGV4cHJlc3Npb24gbXVzdCBoYXZlIGEgdGVybWluYXRvci4gV2UncmUgZXZhbHVhdGluZyBpdCBvdXQgaGVyZVxyXG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSBhIHNheSBleHByZXNzaW9uIG5vcm1hbGx5IGRvZXNuJ3QgcmVxdWlyZSBvbmUuXHJcblxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYEZvdW5kIHVuZXhwZWN0ZWQgdG9rZW4gJyR7Y29udGV4dC5jdXJyZW50VG9rZW59J2ApO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb2dyYW1FeHByZXNzaW9uKGV4cHJlc3Npb25zKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBTYXlFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1NheUV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTYXlFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5zYXkpO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0ID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBTYXlFeHByZXNzaW9uKHRleHQudmFsdWUpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4uLy4uL2xleGluZy9Ub2tlblwiO1xyXG5pbXBvcnQgeyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1R5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvblZpc2l0b3IgfSBmcm9tIFwiLi9GaWVsZERlY2xhcmF0aW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1doZW5EZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgV2hlbkRlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL1doZW5EZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBlRGVjbGFyYXRpb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0QW55T2YoS2V5d29yZHMuYSwgS2V5d29yZHMuYW4pO1xyXG5cclxuICAgICAgICBjb25zdCBuYW1lID0gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmlzKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5raW5kKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5vZik7XHJcblxyXG4gICAgICAgIGNvbnN0IGJhc2VUeXBlID0gdGhpcy5leHBlY3RCYXNlVHlwZShjb250ZXh0KTtcclxuICAgICAgICBcclxuICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZmllbGRzOkZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGNvbnRleHQuaXMoS2V5d29yZHMuaXQpKXtcclxuICAgICAgICAgICAgY29uc3QgZmllbGRWaXNpdG9yID0gbmV3IEZpZWxkRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gZmllbGRWaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgZmllbGRzLnB1c2goPEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uPmZpZWxkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGV2ZW50czpXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGNvbnRleHQuaXMoS2V5d29yZHMud2hlbikpe1xyXG4gICAgICAgICAgICBjb25zdCB3aGVuVmlzaXRvciA9IG5ldyBXaGVuRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHdoZW4gPSB3aGVuVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIGV2ZW50cy5wdXNoKDxXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uPndoZW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHlwZURlY2xhcmF0aW9uID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24obmFtZSwgYmFzZVR5cGUpO1xyXG5cclxuICAgICAgICB0eXBlRGVjbGFyYXRpb24uZmllbGRzID0gZmllbGRzO1xyXG4gICAgICAgIHR5cGVEZWNsYXJhdGlvbi5ldmVudHMgPSBldmVudHM7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlRGVjbGFyYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBleHBlY3RCYXNlVHlwZShjb250ZXh0OlBhcnNlQ29udGV4dCl7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXNBbnlPZihLZXl3b3Jkcy5wbGFjZSwgS2V5d29yZHMuaXRlbSwgS2V5d29yZHMuZGVjb3JhdGlvbikpe1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnVuZGVyc3RhbmQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYXMpO1xyXG5cclxuICAgICAgICBjb25zdCBtZWFuaW5nID0gY29udGV4dC5leHBlY3RBbnlPZihLZXl3b3Jkcy5kZXNjcmliaW5nLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy5tb3ZpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2V5d29yZHMuZGlyZWN0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy50YWtpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2V5d29yZHMuaW52ZW50b3J5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEtleXdvcmRzLmRyb3BwaW5nKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbih2YWx1ZS52YWx1ZSwgbWVhbmluZy52YWx1ZSk7ICAgICAgICBcclxuICAgIH1cclxufSIsImltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVmlzaXRvcntcclxuICAgIGFic3RyYWN0IHZpc2l0KGNvbnRleHQ6UGFyc2VDb250ZXh0KTpFeHByZXNzaW9uO1xyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQdW5jdHVhdGlvbiB9IGZyb20gXCIuLi8uLi9sZXhpbmcvUHVuY3R1YXRpb25cIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBFdmVudEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXZlbnRFeHByZXNzaW9uVmlzaXRvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoZW5EZWNsYXJhdGlvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMud2hlbik7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5wbGF5ZXIpO1xyXG5cclxuICAgICAgICBjb25zdCBldmVudEtpbmQgPSBjb250ZXh0LmV4cGVjdEFueU9mKEtleXdvcmRzLmVudGVycywgS2V5d29yZHMuZXhpdHMpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdE9wZW5NZXRob2RCbG9jaygpO1xyXG5cclxuICAgICAgICBjb25zdCBhY3Rpb25zVmlzaXRvciA9IG5ldyBFdmVudEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IGFjdGlvbnNWaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24oS2V5d29yZHMucGxheWVyLCBldmVudEtpbmQudmFsdWUsIGFjdGlvbnMpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFByb2dyYW1FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvUHJvZ3JhbUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1R5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25TZW1hbnRpY0FuYWx5emVye1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYW55ID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yQW55LCBUb2tlbi5lbXB0eSk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHdvcmxkT2JqZWN0ID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yV29ybGRPYmplY3QsIFRva2VuLmZvckFueSk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBsYWNlID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yUGxhY2UsIFRva2VuLmZvcldvcmxkT2JqZWN0KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgaXRlbSA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvckl0ZW0sIFRva2VuLmZvcldvcmxkT2JqZWN0KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYm9vbGVhblR5cGUgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JCb29sZWFuLCBUb2tlbi5mb3JBbnkpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBsaXN0ID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yTGlzdCwgVG9rZW4uZm9yQW55KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGVjb3JhdGlvbiA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvckRlY29yYXRpb24sIFRva2VuLmZvcldvcmxkT2JqZWN0KTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFuYWx5emUoZXhwcmVzc2lvbjpFeHByZXNzaW9uKTpFeHByZXNzaW9ue1xyXG4gICAgICAgIGNvbnN0IHR5cGVzOlR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25bXSA9IFt0aGlzLmFueSwgdGhpcy53b3JsZE9iamVjdCwgdGhpcy5wbGFjZSwgdGhpcy5ib29sZWFuVHlwZSwgdGhpcy5pdGVtLCB0aGlzLmRlY29yYXRpb25dO1xyXG5cclxuICAgICAgICBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIFByb2dyYW1FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgZm9yKGxldCBjaGlsZCBvZiBleHByZXNzaW9uLmV4cHJlc3Npb25zKXtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVzLnB1c2goY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0eXBlc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uPih0eXBlcy5tYXAoeCA9PiBbeC5uYW1lLCB4XSkpO1xyXG5cclxuICAgICAgICBmb3IoY29uc3QgZGVjbGFyYXRpb24gb2YgdHlwZXMpe1xyXG4gICAgICAgICAgICBjb25zdCBiYXNlVG9rZW4gPSBkZWNsYXJhdGlvbi5iYXNlVHlwZU5hbWVUb2tlbjtcclxuXHJcbiAgICAgICAgICAgIGlmIChiYXNlVG9rZW4udHlwZSA9PSBUb2tlblR5cGUuS2V5d29yZCAmJiAhYmFzZVRva2VuLnZhbHVlLnN0YXJ0c1dpdGgoXCJ+XCIpKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBgfiR7YmFzZVRva2VuLnZhbHVlfWA7XHJcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbi5iYXNlVHlwZSA9IHR5cGVzQnlOYW1lLmdldChuYW1lKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uLmJhc2VUeXBlID0gdHlwZXNCeU5hbWUuZ2V0KGJhc2VUb2tlbi52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBmaWVsZCBvZiBkZWNsYXJhdGlvbi5maWVsZHMpe1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZSA9IHR5cGVzQnlOYW1lLmdldChmaWVsZC50eXBlTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBleHByZXNzaW9uO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gRXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZXtcclxuICAgIE5vbmUsXHJcbiAgICBJZ25vcmVSZXN1bHRzT2ZTYXlFeHByZXNzaW9uXHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFByb2dyYW1FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvUHJvZ3JhbUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1R5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZyB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1VuZGVyc3RhbmRpbmdcIjtcclxuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL0ZpZWxkXCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvSXRlbVwiO1xyXG5pbXBvcnQgeyBOdW1iZXJUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTnVtYmVyVHlwZVwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgU2F5RXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1NheUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9NZXRob2RcIjtcclxuaW1wb3J0IHsgU2F5IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU2F5XCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9JbnN0cnVjdGlvblwiO1xyXG5pbXBvcnQgeyBQYXJhbWV0ZXIgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1BhcmFtZXRlclwiO1xyXG5pbXBvcnQgeyBJZkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9JZkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9Db25jYXRlbmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBDb250YWluc0V4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9Db250YWluc0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBBY3Rpb25zRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0FjdGlvbnNFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBFdmVudFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL0V2ZW50VHlwZVwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uVHJhbnNmb3JtYXRpb25Nb2RlIH0gZnJvbSBcIi4vRXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZVwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uLy4uL3J1bnRpbWUvSU91dHB1dFwiO1xyXG5pbXBvcnQgeyBTZXRWYXJpYWJsZUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9TZXRWYXJpYWJsZUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgTGl0ZXJhbEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9MaXRlcmFsRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBEZWNvcmF0aW9uIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvRGVjb3JhdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uVHJhbnNmb3JtZXJ7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgY3JlYXRlU3lzdGVtVHlwZXMoKXtcclxuICAgICAgICBjb25zdCB0eXBlczpUeXBlW10gPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBUaGVzZSBhcmUgb25seSBoZXJlIGFzIHN0dWJzIGZvciBleHRlcm5hbCBydW50aW1lIHR5cGVzIHRoYXQgYWxsb3cgdXMgdG8gY29ycmVjdGx5IHJlc29sdmUgZmllbGQgdHlwZXMuXHJcblxyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoQW55LnR5cGVOYW1lLCBBbnkucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFdvcmxkT2JqZWN0LnR5cGVOYW1lLCBXb3JsZE9iamVjdC5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoUGxhY2UudHlwZU5hbWUsIFBsYWNlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShCb29sZWFuVHlwZS50eXBlTmFtZSwgQm9vbGVhblR5cGUucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFN0cmluZ1R5cGUudHlwZU5hbWUsIFN0cmluZ1R5cGUucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKE51bWJlclR5cGUudHlwZU5hbWUsIE51bWJlclR5cGUucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKEl0ZW0udHlwZU5hbWUsIEl0ZW0ucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKExpc3QudHlwZU5hbWUsIExpc3QucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFBsYXllci50eXBlTmFtZSwgUGxheWVyLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShTYXkudHlwZU5hbWUsIFNheS5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoRGVjb3JhdGlvbi50eXBlTmFtZSwgRGVjb3JhdGlvbi5wYXJlbnRUeXBlTmFtZSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IE1hcDxzdHJpbmcsIFR5cGU+KHR5cGVzLm1hcCh4ID0+IFt4Lm5hbWUsIHhdKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtKGV4cHJlc3Npb246RXhwcmVzc2lvbik6VHlwZVtde1xyXG4gICAgICAgIGNvbnN0IHR5cGVzQnlOYW1lID0gdGhpcy5jcmVhdGVTeXN0ZW1UeXBlcygpO1xyXG4gICAgICAgIGxldCBkeW5hbWljVHlwZUNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBQcm9ncmFtRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBjaGlsZCBvZiBleHByZXNzaW9uLmV4cHJlc3Npb25zKXtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBuZXcgVHlwZShgfiR7VW5kZXJzdGFuZGluZy50eXBlTmFtZX1fJHtkeW5hbWljVHlwZUNvdW50fWAsIFVuZGVyc3RhbmRpbmcudHlwZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5uYW1lID0gVW5kZXJzdGFuZGluZy5hY3Rpb247XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLmRlZmF1bHRWYWx1ZSA9IGNoaWxkLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZWFuaW5nID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVhbmluZy5uYW1lID0gVW5kZXJzdGFuZGluZy5tZWFuaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lYW5pbmcuZGVmYXVsdFZhbHVlID0gY2hpbGQubWVhbmluZztcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0eXBlLmZpZWxkcy5wdXNoKGFjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZS5maWVsZHMucHVzaChtZWFuaW5nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pY1R5cGVDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0eXBlc0J5TmFtZS5zZXQodHlwZS5uYW1lLCB0eXBlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gdGhpcy50cmFuc2Zvcm1Jbml0aWFsVHlwZURlY2xhcmF0aW9uKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0eXBlc0J5TmFtZS5zZXQodHlwZS5uYW1lLCB0eXBlKTtcclxuICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBjaGlsZCBvZiBleHByZXNzaW9uLmV4cHJlc3Npb25zKXtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoY2hpbGQubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvcihjb25zdCBmaWVsZEV4cHJlc3Npb24gb2YgY2hpbGQuZmllbGRzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGQgPSBuZXcgRmllbGQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IGZpZWxkRXhwcmVzc2lvbi5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IGZpZWxkRXhwcmVzc2lvbi50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQudHlwZSA9IHR5cGVzQnlOYW1lLmdldChmaWVsZEV4cHJlc3Npb24udHlwZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkRXhwcmVzc2lvbi5pbml0aWFsVmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkLnR5cGVOYW1lID09IFN0cmluZ1R5cGUudHlwZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gPHN0cmluZz5maWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC50eXBlTmFtZSA9PSBOdW1iZXJUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IE51bWJlcihmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZU5hbWUgPT0gQm9vbGVhblR5cGUudHlwZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gQm9vbGVhbihmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkRXhwcmVzc2lvbi5hc3NvY2lhdGVkRXhwcmVzc2lvbnMubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnZXRGaWVsZCA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLm5hbWUgPSBgfmdldF8ke2ZpZWxkLm5hbWV9YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLnBhcmFtZXRlcnMucHVzaChuZXcgUGFyYW1ldGVyKFwifnZhbHVlXCIsIGZpZWxkLnR5cGVOYW1lKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5yZXR1cm5UeXBlID0gZmllbGQudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihjb25zdCBhc3NvY2lhdGVkIG9mIGZpZWxkRXhwcmVzc2lvbi5hc3NvY2lhdGVkRXhwcmVzc2lvbnMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLmJvZHkucHVzaCguLi50aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oYXNzb2NpYXRlZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLmJvZHkucHVzaChJbnN0cnVjdGlvbi5yZXR1cm4oKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8ubWV0aG9kcy5wdXNoKGdldEZpZWxkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8uZmllbGRzLnB1c2goZmllbGQpOyAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzV29ybGRPYmplY3QgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBjdXJyZW50ID0gdHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IHR5cGVzQnlOYW1lLmdldChjdXJyZW50LmJhc2VUeXBlTmFtZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQubmFtZSA9PSBXb3JsZE9iamVjdC50eXBlTmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNXb3JsZE9iamVjdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzV29ybGRPYmplY3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmliZSA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpYmUubmFtZSA9IFdvcmxkT2JqZWN0LmRlc2NyaWJlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmliZS5ib2R5LnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFByb3BlcnR5KFdvcmxkT2JqZWN0LnZpc2libGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmVJZkZhbHNlKDMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRQcm9wZXJ0eShXb3JsZE9iamVjdC5kZXNjcmlwdGlvbiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucmV0dXJuKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/Lm1ldGhvZHMucHVzaChkZXNjcmliZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvYnNlcnZlID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlLm5hbWUgPSBXb3JsZE9iamVjdC5vYnNlcnZlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlLmJvZHkucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkUHJvcGVydHkoV29ybGRPYmplY3QudmlzaWJsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5icmFuY2hSZWxhdGl2ZUlmRmFsc2UoMyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFByb3BlcnR5KFdvcmxkT2JqZWN0Lm9ic2VydmF0aW9uKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5yZXR1cm4oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8ubWV0aG9kcy5wdXNoKG9ic2VydmUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlPy5maWVsZHMuZmluZCh4ID0+IHgubmFtZSA9PSBXb3JsZE9iamVjdC52aXNpYmxlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2aXNpYmxlID0gbmV3IEZpZWxkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZS5uYW1lID0gV29ybGRPYmplY3QudmlzaWJsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGUudHlwZU5hbWUgPSBCb29sZWFuVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGUuZGVmYXVsdFZhbHVlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5maWVsZHMucHVzaCh2aXNpYmxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlPy5maWVsZHMuZmluZCh4ID0+IHgubmFtZSA9PSBXb3JsZE9iamVjdC5jb250ZW50cykpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudHMgPSBuZXcgRmllbGQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50cy5uYW1lID0gV29ybGRPYmplY3QuY29udGVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50cy50eXBlTmFtZSA9IExpc3QudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50cy5kZWZhdWx0VmFsdWUgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5maWVsZHMucHVzaChjb250ZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdHlwZT8uZmllbGRzLmZpbmQoeCA9PiB4Lm5hbWUgPT0gV29ybGRPYmplY3Qub2JzZXJ2YXRpb24pKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9ic2VydmF0aW9uID0gbmV3IEZpZWxkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2YXRpb24ubmFtZSA9IFdvcmxkT2JqZWN0Lm9ic2VydmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2YXRpb24udHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2YXRpb24uZGVmYXVsdFZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5maWVsZHMucHVzaChvYnNlcnZhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkdXBsaWNhdGVFdmVudENvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgY2hpbGQuZXZlbnRzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGhvZCA9IG5ldyBNZXRob2QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QubmFtZSA9IGB+ZXZlbnRfJHtldmVudC5hY3Rvcn1fJHtldmVudC5ldmVudEtpbmR9XyR7ZHVwbGljYXRlRXZlbnRDb3VudH1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmV2ZW50VHlwZSA9IHRoaXMudHJhbnNmb3JtRXZlbnRLaW5kKGV2ZW50LmV2ZW50S2luZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVwbGljYXRlRXZlbnRDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGlvbnMgPSA8QWN0aW9uc0V4cHJlc3Npb24+ZXZlbnQuYWN0aW9ucztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IoY29uc3QgYWN0aW9uIG9mIGFjdGlvbnMuYWN0aW9ucyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYm9keSA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihhY3Rpb24sIEV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGUuSWdub3JlUmVzdWx0c09mU2F5RXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmJvZHkucHVzaCguLi5ib2R5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QuYm9keS5wdXNoKEluc3RydWN0aW9uLnJldHVybigpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5tZXRob2RzLnB1c2gobWV0aG9kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGdsb2JhbFNheXMgPSBleHByZXNzaW9uLmV4cHJlc3Npb25zLmZpbHRlcih4ID0+IHggaW5zdGFuY2VvZiBTYXlFeHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBuZXcgVHlwZShgfmdsb2JhbFNheXNgLCBTYXkudHlwZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgICAgICBtZXRob2QubmFtZSA9IFNheS50eXBlTmFtZTtcclxuICAgICAgICAgICAgbWV0aG9kLnBhcmFtZXRlcnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RydWN0aW9uczpJbnN0cnVjdGlvbltdID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3Qgc2F5IG9mIGdsb2JhbFNheXMpe1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2F5RXhwcmVzc2lvbiA9IDxTYXlFeHByZXNzaW9uPnNheTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKHNheUV4cHJlc3Npb24udGV4dCksXHJcbiAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24ucmV0dXJuKCkpO1xyXG5cclxuICAgICAgICAgICAgbWV0aG9kLmJvZHkgPSBpbnN0cnVjdGlvbnM7XHJcblxyXG4gICAgICAgICAgICB0eXBlLm1ldGhvZHMucHVzaChtZXRob2QpO1xyXG5cclxuICAgICAgICAgICAgdHlwZXNCeU5hbWUuc2V0KHR5cGUubmFtZSwgdHlwZSk7ICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byBwYXJ0aWFsbHkgdHJhbnNmb3JtXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5vdXQud3JpdGUoYENyZWF0ZWQgJHt0eXBlc0J5TmFtZS5zaXplfSB0eXBlcy4uLmApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHR5cGVzQnlOYW1lLnZhbHVlcygpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybUV2ZW50S2luZChraW5kOnN0cmluZyl7XHJcbiAgICAgICAgc3dpdGNoKGtpbmQpe1xyXG4gICAgICAgICAgICBjYXNlIEtleXdvcmRzLmVudGVyczp7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRXZlbnRUeXBlLlBsYXllckVudGVyc1BsYWNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgS2V5d29yZHMuZXhpdHM6e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEV2ZW50VHlwZS5QbGF5ZXJFeGl0c1BsYWNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6e1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYFVuYWJsZSB0byB0cmFuc2Zvcm0gdW5zdXBwb3J0ZWQgZXZlbnQga2luZCAnJHtraW5kfSdgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbjpFeHByZXNzaW9uLCBtb2RlPzpFeHByZXNzaW9uVHJhbnNmb3JtYXRpb25Nb2RlKXtcclxuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbnM6SW5zdHJ1Y3Rpb25bXSA9IFtdO1xyXG5cclxuICAgICAgICBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIElmRXhwcmVzc2lvbil7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbmFsID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24uY29uZGl0aW9uYWwsIG1vZGUpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5jb25kaXRpb25hbCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpZkJsb2NrID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24uaWZCbG9jaywgbW9kZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsc2VCbG9jayA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmVsc2VCbG9jaywgbW9kZSk7XHJcblxyXG4gICAgICAgICAgICBpZkJsb2NrLnB1c2goSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmUoZWxzZUJsb2NrLmxlbmd0aCkpO1xyXG5cclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmVJZkZhbHNlKGlmQmxvY2subGVuZ3RoKSlcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goLi4uaWZCbG9jayk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmVsc2VCbG9jayk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgU2F5RXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmxvYWRTdHJpbmcoZXhwcmVzc2lvbi50ZXh0KSk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLnByaW50KCkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1vZGUgIT0gRXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZS5JZ25vcmVSZXN1bHRzT2ZTYXlFeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmxvYWRTdHJpbmcoZXhwcmVzc2lvbi50ZXh0KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBDb250YWluc0V4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWROdW1iZXIoZXhwcmVzc2lvbi5jb3VudCksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGV4cHJlc3Npb24udHlwZU5hbWUpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEluc3RhbmNlKGV4cHJlc3Npb24udGFyZ2V0TmFtZSksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkRmllbGQoV29ybGRPYmplY3QuY29udGVudHMpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uaW5zdGFuY2VDYWxsKExpc3QuY29udGFpbnMpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIENvbmNhdGVuYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgY29uc3QgbGVmdCA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmxlZnQhLCBtb2RlKTtcclxuICAgICAgICAgICAgY29uc3QgcmlnaHQgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5yaWdodCEsIG1vZGUpO1xyXG5cclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goLi4ubGVmdCk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLnJpZ2h0KTtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24uY29uY2F0ZW5hdGUoKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkRmllbGQoZXhwcmVzc2lvbi5uYW1lKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIFNldFZhcmlhYmxlRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24uZXZhbHVhdGlvbkV4cHJlc3Npb24pO1xyXG5cclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICAuLi5yaWdodCxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkRmllbGQoZXhwcmVzc2lvbi52YXJpYWJsZU5hbWUpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uYXNzaWduKClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBMaXRlcmFsRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGlmIChleHByZXNzaW9uLnR5cGVOYW1lID09IFN0cmluZ1R5cGUudHlwZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyg8c3RyaW5nPmV4cHJlc3Npb24udmFsdWUpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uLnR5cGVOYW1lID09IE51bWJlclR5cGUudHlwZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24ubG9hZE51bWJlcihOdW1iZXIoZXhwcmVzc2lvbi52YWx1ZSkpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKGBVbmFibGUgdG8gdHJhbnNmb3JtIHVuc3VwcG9ydGVkIGxpdGVyYWwgZXhwcmVzc2lvbiAnJHtleHByZXNzaW9ufSdgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiVW5hYmxlIHRvIHRyYW5zZm9ybSB1bnN1cHBvcnRlZCBleHByZXNzaW9uXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RydWN0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybUluaXRpYWxUeXBlRGVjbGFyYXRpb24oZXhwcmVzc2lvbjpUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICByZXR1cm4gbmV3IFR5cGUoZXhwcmVzc2lvbi5uYW1lLCBleHByZXNzaW9uLmJhc2VUeXBlIS5uYW1lKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4dGVybkNhbGwgfSBmcm9tIFwiLi9FeHRlcm5DYWxsXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQW55eyAgICAgICAgXHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHN0YXRpYyB0eXBlTmFtZTpzdHJpbmcgPSBcIn5hbnlcIjsgIFxyXG4gICAgXHJcbiAgICBzdGF0aWMgbWFpbiA9IFwifm1haW5cIjtcclxuICAgIHN0YXRpYyBleHRlcm5Ub1N0cmluZyA9IEV4dGVybkNhbGwub2YoXCJ+dG9TdHJpbmdcIik7XHJcbn1cclxuIiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQm9vbGVhblR5cGV7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn5ib29sZWFuXCI7XHJcbn0iLCJpbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuL1dvcmxkT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRGVjb3JhdGlvbntcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+ZGVjb3JhdGlvblwiO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRGVsZWdhdGV7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn5kZWxlZ2F0ZVwiO1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG59IiwiZXhwb3J0IGNsYXNzIEVudHJ5UG9pbnRBdHRyaWJ1dGV7XHJcbiAgICBuYW1lOnN0cmluZyA9IFwifmVudHJ5UG9pbnRcIjtcclxufSIsImV4cG9ydCBjbGFzcyBFeHRlcm5DYWxse1xyXG4gICAgc3RhdGljIG9mKG5hbWU6c3RyaW5nLCAuLi5hcmdzOnN0cmluZ1tdKXtcclxuICAgICAgICByZXR1cm4gbmV3IEV4dGVybkNhbGwobmFtZSwgLi4uYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgYXJnczpzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6c3RyaW5nLCAuLi5hcmdzOnN0cmluZ1tdKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuL1dvcmxkT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbXtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifml0ZW1cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlzdHtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifmxpc3RcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY29udGFpbnMgPSBcIn5jb250YWluc1wiO1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZVBhcmFtZXRlciA9IFwifnR5cGVOYW1lXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY291bnRQYXJhbWV0ZXIgPSBcIn5jb3VudFwiO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTnVtYmVyVHlwZXtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifm51bWJlclwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi9Xb3JsZE9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYWNlIHtcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+cGxhY2VcIjtcclxuXHJcbiAgICBzdGF0aWMgaXNQbGF5ZXJTdGFydCA9IFwifmlzUGxheWVyU3RhcnRcIjtcclxufSIsImltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vV29ybGRPYmplY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJ7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWUgPSBcIn5wbGF5ZXJcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lOyAgICBcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNheXtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifnNheVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RyaW5nVHlwZXtcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHN0YXRpYyB0eXBlTmFtZSA9IFwifnN0cmluZ1wiO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVW5kZXJzdGFuZGluZ3tcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHN0YXRpYyB0eXBlTmFtZSA9IFwifnVuZGVyc3RhbmRpbmdcIjtcclxuXHJcbiAgICBzdGF0aWMgZGVzY3JpYmluZyA9IFwifmRlc2NyaWJpbmdcIjsgIFxyXG4gICAgc3RhdGljIG1vdmluZyA9IFwifm1vdmluZ1wiO1xyXG4gICAgc3RhdGljIGRpcmVjdGlvbiA9IFwifmRpcmVjdGlvblwiO1xyXG4gICAgc3RhdGljIHRha2luZyA9IFwifnRha2luZ1wiO1xyXG4gICAgc3RhdGljIGludmVudG9yeSA9IFwifmludmVudG9yeVwiO1xyXG4gICAgc3RhdGljIGRyb3BwaW5nID0gXCJ+ZHJvcHBpbmdcIjtcclxuXHJcbiAgICBzdGF0aWMgYWN0aW9uID0gXCJ+YWN0aW9uXCI7XHJcbiAgICBzdGF0aWMgbWVhbmluZyA9IFwifm1lYW5pbmdcIjsgIFxyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRPYmplY3Qge1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+d29ybGRPYmplY3RcIjtcclxuXHJcbiAgICBzdGF0aWMgZGVzY3JpcHRpb24gPSBcIn5kZXNjcmlwdGlvblwiO1xyXG4gICAgc3RhdGljIGNvbnRlbnRzID0gXCJ+Y29udGVudHNcIjsgICAgXHJcbiAgICBzdGF0aWMgb2JzZXJ2YXRpb24gPSBcIn5vYnNlcnZhdGlvblwiO1xyXG5cclxuICAgIHN0YXRpYyBkZXNjcmliZSA9IFwifmRlc2NyaWJlXCI7XHJcbiAgICBzdGF0aWMgb2JzZXJ2ZSA9IFwifm9ic2VydmVcIjtcclxuICAgIFxyXG4gICAgc3RhdGljIHZpc2libGUgPSBcIn52aXNpYmxlXCI7XHJcbn0iLCJpbXBvcnQgeyBUYWxvbklkZSB9IGZyb20gXCIuL1RhbG9uSWRlXCI7XHJcblxyXG5cclxudmFyIGlkZSA9IG5ldyBUYWxvbklkZSgpOyIsImV4cG9ydCBlbnVtIEV2YWx1YXRpb25SZXN1bHR7XHJcbiAgICBDb250aW51ZSxcclxuICAgIFN1c3BlbmRGb3JJbnB1dFxyXG59IiwiaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9NZXRob2RcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IFN0YWNrRnJhbWUgfSBmcm9tIFwiLi9TdGFja0ZyYW1lXCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4uL2NvbW1vbi9JbnN0cnVjdGlvblwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZXRob2RBY3RpdmF0aW9ue1xyXG4gICAgbWV0aG9kPzpNZXRob2Q7XHJcbiAgICBzdGFja0ZyYW1lOlN0YWNrRnJhbWU7XHJcbiAgICBzdGFjazpSdW50aW1lQW55W10gPSBbXTtcclxuXHJcbiAgICBzdGFja1NpemUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdGFjay5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcGVlaygpe1xyXG4gICAgICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgU3RhY2sgSW1iYWxhbmNlISBBdHRlbXB0ZWQgdG8gcGVlayBhbiBlbXB0eSBzdGFjay5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV07XHJcbiAgICB9XHJcblxyXG4gICAgcG9wKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBTdGFjayBJbWJhbGFuY2UhIEF0dGVtcHRlZCB0byBwb3AgYW4gZW1wdHkgc3RhY2suYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5zdGFjay5wb3AoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdXNoKHJ1bnRpbWVBbnk6UnVudGltZUFueSl7XHJcbiAgICAgICAgdGhpcy5zdGFjay5wdXNoKHJ1bnRpbWVBbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1ldGhvZDpNZXRob2Qpe1xyXG4gICAgICAgIHRoaXMubWV0aG9kID0gbWV0aG9kO1xyXG4gICAgICAgIHRoaXMuc3RhY2tGcmFtZSA9IG5ldyBTdGFja0ZyYW1lKG1ldGhvZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBPcENvZGVIYW5kbGVye1xyXG4gICAgY29kZTpPcENvZGUgPSBPcENvZGUuTm9PcDtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuQ29udGludWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuL2xpYnJhcnkvVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9NZXRob2RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdGFja0ZyYW1le1xyXG4gICAgbG9jYWxzOlZhcmlhYmxlW10gPSBbXTtcclxuICAgIGN1cnJlbnRJbnN0cnVjdGlvbjpudW1iZXIgPSAtMTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXRob2Q6TWV0aG9kKXtcclxuICAgICAgICBmb3IodmFyIHBhcmFtZXRlciBvZiBtZXRob2QucGFyYW1ldGVycyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlID0gbmV3IFZhcmlhYmxlKHBhcmFtZXRlci5uYW1lLCBwYXJhbWV0ZXIudHlwZSEpO1xyXG4gICAgICAgICAgICB0aGlzLmxvY2Fscy5wdXNoKHZhcmlhYmxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBFbnRyeVBvaW50QXR0cmlidXRlIH0gZnJvbSBcIi4uL2xpYnJhcnkvRW50cnlQb2ludEF0dHJpYnV0ZVwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgTWV0aG9kQWN0aXZhdGlvbiB9IGZyb20gXCIuL01ldGhvZEFjdGl2YXRpb25cIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUHJpbnRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvUHJpbnRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IE5vT3BIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTm9PcEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZFN0cmluZ0hhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkU3RyaW5nSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBOZXdJbnN0YW5jZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9OZXdJbnN0YW5jZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZUNvbW1hbmQgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVDb21tYW5kXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgUmVhZElucHV0SGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1JlYWRJbnB1dEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUGFyc2VDb21tYW5kSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1BhcnNlQ29tbWFuZEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgR29Ub0hhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Hb1RvSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBIYW5kbGVDb21tYW5kSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0hhbmRsZUNvbW1hbmRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYWNlIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lUGxhY2VcIjtcclxuaW1wb3J0IHsgUnVudGltZUJvb2xlYW4gfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVCb29sZWFuXCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuLi9saWJyYXJ5L1BsYXllclwiO1xyXG5pbXBvcnQgeyBTYXkgfSBmcm9tIFwiLi4vbGlicmFyeS9TYXlcIjtcclxuaW1wb3J0IHsgUnVudGltZUVtcHR5IH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lRW1wdHlcIjtcclxuaW1wb3J0IHsgUmV0dXJuSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1JldHVybkhhbmRsZXJcIjtcclxuaW1wb3J0IHsgU3RhdGljQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9TdGF0aWNDYWxsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGF5ZXIgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgTG9hZEluc3RhbmNlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRJbnN0YW5jZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZE51bWJlckhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkTnVtYmVySGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJbnN0YW5jZUNhbGxIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvSW5zdGFuY2VDYWxsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkUHJvcGVydHlIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZFByb3BlcnR5SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkRmllbGRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZEZpZWxkSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBFeHRlcm5hbENhbGxIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvRXh0ZXJuYWxDYWxsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkTG9jYWxIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZExvY2FsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJTG9nT3V0cHV0IH0gZnJvbSBcIi4vSUxvZ091dHB1dFwiO1xyXG5pbXBvcnQgeyBMb2FkVGhpc0hhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkVGhpc0hhbmRsZXJcIjtcclxuaW1wb3J0IHsgQnJhbmNoUmVsYXRpdmVIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvQnJhbmNoUmVsYXRpdmVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEJyYW5jaFJlbGF0aXZlSWZGYWxzZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9CcmFuY2hSZWxhdGl2ZUlmRmFsc2VIYW5kbGVyXCI7XHJcbmltcG9ydCB7IENvbmNhdGVuYXRlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0NvbmNhdGVuYXRlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBBc3NpZ25WYXJpYWJsZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Bc3NpZ25WYXJpYWJsZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVHlwZU9mSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1R5cGVPZkhhbmRsZXJcIjtcclxuaW1wb3J0IHsgSW52b2tlRGVsZWdhdGVIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvSW52b2tlRGVsZWdhdGVIYW5kbGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25SdW50aW1le1xyXG5cclxuICAgIHByaXZhdGUgdGhyZWFkPzpUaHJlYWQ7XHJcbiAgICBwcml2YXRlIGhhbmRsZXJzOk1hcDxPcENvZGUsIE9wQ29kZUhhbmRsZXI+ID0gbmV3IE1hcDxPcENvZGUsIE9wQ29kZUhhbmRsZXI+KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB1c2VyT3V0cHV0OklPdXRwdXQsIHByaXZhdGUgcmVhZG9ubHkgbG9nT3V0cHV0PzpJTG9nT3V0cHV0KXtcclxuICAgICAgICB0aGlzLnVzZXJPdXRwdXQgPSB1c2VyT3V0cHV0O1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTm9PcCwgbmV3IE5vT3BIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkU3RyaW5nLCBuZXcgTG9hZFN0cmluZ0hhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLlByaW50LCBuZXcgUHJpbnRIYW5kbGVyKHRoaXMudXNlck91dHB1dCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5OZXdJbnN0YW5jZSwgbmV3IE5ld0luc3RhbmNlSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuUmVhZElucHV0LCBuZXcgUmVhZElucHV0SGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuUGFyc2VDb21tYW5kLCBuZXcgUGFyc2VDb21tYW5kSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuSGFuZGxlQ29tbWFuZCwgbmV3IEhhbmRsZUNvbW1hbmRIYW5kbGVyKHRoaXMudXNlck91dHB1dCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Hb1RvLCBuZXcgR29Ub0hhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLlJldHVybiwgbmV3IFJldHVybkhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLlN0YXRpY0NhbGwsIG5ldyBTdGF0aWNDYWxsSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTG9hZEluc3RhbmNlLCBuZXcgTG9hZEluc3RhbmNlSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTG9hZE51bWJlciwgbmV3IExvYWROdW1iZXJIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5JbnN0YW5jZUNhbGwsIG5ldyBJbnN0YW5jZUNhbGxIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkUHJvcGVydHksIG5ldyBMb2FkUHJvcGVydHlIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkRmllbGQsIG5ldyBMb2FkRmllbGRIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5FeHRlcm5hbENhbGwsIG5ldyBFeHRlcm5hbENhbGxIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkTG9jYWwsIG5ldyBMb2FkTG9jYWxIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkVGhpcywgbmV3IExvYWRUaGlzSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuQnJhbmNoUmVsYXRpdmUsIG5ldyBCcmFuY2hSZWxhdGl2ZUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkJyYW5jaFJlbGF0aXZlSWZGYWxzZSwgbmV3IEJyYW5jaFJlbGF0aXZlSWZGYWxzZUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkNvbmNhdGVuYXRlLCBuZXcgQ29uY2F0ZW5hdGVIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Bc3NpZ24sIG5ldyBBc3NpZ25WYXJpYWJsZUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLlR5cGVPZiwgbmV3IFR5cGVPZkhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkludm9rZURlbGVnYXRlLCBuZXcgSW52b2tlRGVsZWdhdGVIYW5kbGVyKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCl7XHJcbiAgICAgICAgaWYgKHRoaXMudGhyZWFkPy5hbGxUeXBlcy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgIHRoaXMudGhyZWFkLmxvZz8uZGVidWcoXCJVbmFibGUgdG8gc3RhcnQgcnVudGltZSB3aXRob3V0IHR5cGVzLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGxhY2VzID0gdGhpcy50aHJlYWQ/LmFsbFR5cGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LmJhc2VUeXBlTmFtZSA9PSBQbGFjZS50eXBlTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCh4ID0+IDxSdW50aW1lUGxheWVyPk1lbW9yeS5hbGxvY2F0ZSh4KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGdldFBsYXllclN0YXJ0ID0gKHBsYWNlOlJ1bnRpbWVQbGFjZSkgPT4gPFJ1bnRpbWVCb29sZWFuPihwbGFjZS5maWVsZHMuZ2V0KFBsYWNlLmlzUGxheWVyU3RhcnQpPy52YWx1ZSk7XHJcbiAgICAgICAgY29uc3QgaXNQbGF5ZXJTdGFydCA9IChwbGFjZTpSdW50aW1lUGxhY2UpID0+IGdldFBsYXllclN0YXJ0KHBsYWNlKT8udmFsdWUgPT09IHRydWU7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRQbGFjZSA9IHBsYWNlcz8uZmluZChpc1BsYXllclN0YXJ0KTtcclxuXHJcbiAgICAgICAgdGhpcy50aHJlYWQhLmN1cnJlbnRQbGFjZSA9IGN1cnJlbnRQbGFjZTtcclxuXHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy50aHJlYWQ/Lmtub3duVHlwZXMuZ2V0KFBsYXllci50eXBlTmFtZSkhO1xyXG5cclxuICAgICAgICB0aGlzLnRocmVhZCEuY3VycmVudFBsYXllciA9IDxSdW50aW1lUGxheWVyPk1lbW9yeS5hbGxvY2F0ZShwbGF5ZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnJ1bldpdGgoXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcCgpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBsb2FkRnJvbSh0eXBlczpUeXBlW10pe1xyXG4gICAgICAgIGlmICh0eXBlcy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgIHRoaXMubG9nT3V0cHV0Py5kZWJ1ZyhcIk5vIHR5cGVzIHdlcmUgcHJvdmlkZWQsIHVuYWJsZSB0byBsb2FkIHJ1bnRpbWUhXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBsb2FkZWRUeXBlcyA9IE1lbW9yeS5sb2FkVHlwZXModHlwZXMpO1xyXG5cclxuICAgICAgICBjb25zdCBlbnRyeVBvaW50ID0gbG9hZGVkVHlwZXMuZmluZCh4ID0+IHguYXR0cmlidXRlcy5maW5kSW5kZXgoYXR0cmlidXRlID0+IGF0dHJpYnV0ZSBpbnN0YW5jZW9mIEVudHJ5UG9pbnRBdHRyaWJ1dGUpID4gLTEpO1xyXG4gICAgICAgIGNvbnN0IG1haW5NZXRob2QgPSBlbnRyeVBvaW50Py5tZXRob2RzLmZpbmQoeCA9PiB4Lm5hbWUgPT0gQW55Lm1haW4pOyAgICAgICAgXHJcbiAgICAgICAgY29uc3QgYWN0aXZhdGlvbiA9IG5ldyBNZXRob2RBY3RpdmF0aW9uKG1haW5NZXRob2QhKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRocmVhZCA9IG5ldyBUaHJlYWQobG9hZGVkVHlwZXMsIGFjdGl2YXRpb24pOyAgXHJcbiAgICAgICAgdGhpcy50aHJlYWQubG9nID0gdGhpcy5sb2dPdXRwdXQ7ICAgICAgXHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbmRDb21tYW5kKGlucHV0OnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5ydW5XaXRoKGlucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJ1bldpdGgoY29tbWFuZDpzdHJpbmcpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFdlJ3JlIGdvaW5nIHRvIGtlZXAgdGhlaXIgY29tbWFuZCBpbiB0aGUgdmlzdWFsIGhpc3RvcnkgdG8gbWFrZSB0aGluZ3MgZWFzaWVyIHRvIHVuZGVyc3RhbmQuXHJcblxyXG4gICAgICAgIHRoaXMudXNlck91dHB1dC53cml0ZShjb21tYW5kKTtcclxuXHJcbiAgICAgICAgLy8gTm93IHdlIGNhbiBnbyBhaGVhZCBhbmQgcHJvY2VzcyB0aGVpciBjb21tYW5kLlxyXG5cclxuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IHRoaXMudGhyZWFkIS5jdXJyZW50SW5zdHJ1Y3Rpb247XHJcblxyXG4gICAgICAgIGlmIChpbnN0cnVjdGlvbj8ub3BDb2RlID09IE9wQ29kZS5SZWFkSW5wdXQpe1xyXG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gTWVtb3J5LmFsbG9jYXRlU3RyaW5nKGNvbW1hbmQpO1xyXG4gICAgICAgICAgICB0aGlzLnRocmVhZD8uY3VycmVudE1ldGhvZC5wdXNoKHRleHQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50aHJlYWQ/Lm1vdmVOZXh0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50aHJlYWQ/LmN1cnJlbnRJbnN0cnVjdGlvbiA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aGlzLnRocmVhZD8ubW92ZU5leHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRocmVhZD8uY3VycmVudEluc3RydWN0aW9uID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gZXhlY3V0ZSBjb21tYW5kLCBubyBpbnN0cnVjdGlvbiBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeXtcclxuICAgICAgICAgICAgZm9yKGxldCBpbnN0cnVjdGlvbiA9IHRoaXMuZXZhbHVhdGVDdXJyZW50SW5zdHJ1Y3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9uID09IEV2YWx1YXRpb25SZXN1bHQuQ29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbiA9IHRoaXMuZXZhbHVhdGVDdXJyZW50SW5zdHJ1Y3Rpb24oKSl7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy50aHJlYWQ/Lm1vdmVOZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoKGV4KXtcclxuICAgICAgICAgICAgaWYgKGV4IGluc3RhbmNlb2YgUnVudGltZUVycm9yKXtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nT3V0cHV0Py5kZWJ1ZyhgUnVudGltZSBFcnJvcjogJHtleC5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dPdXRwdXQ/LmRlYnVnKGBTdGFjayBUcmFjZTogJHtleC5zdGFja31gKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nT3V0cHV0Py5kZWJ1ZyhgRW5jb3VudGVyZWQgdW5oYW5kbGVkIGVycm9yOiAke2V4fWApO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV2YWx1YXRlQ3VycmVudEluc3RydWN0aW9uKCl7XHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSB0aGlzLnRocmVhZD8uY3VycmVudEluc3RydWN0aW9uO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5oYW5kbGVycy5nZXQoaW5zdHJ1Y3Rpb24/Lm9wQ29kZSEpO1xyXG5cclxuICAgICAgICBpZiAoaGFuZGxlciA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBFbmNvdW50ZXJlZCB1bnN1cHBvcnRlZCBPcENvZGUgJyR7aW5zdHJ1Y3Rpb24/Lm9wQ29kZX0nYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBoYW5kbGVyPy5oYW5kbGUodGhpcy50aHJlYWQhKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi9NZXRob2RBY3RpdmF0aW9uXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1VuZGVyc3RhbmRpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYWNlIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lUGxhY2VcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYXllciB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZVBsYXllclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRW1wdHkgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVFbXB0eVwiO1xyXG5pbXBvcnQgeyBJTG9nT3V0cHV0IH0gZnJvbSBcIi4vSUxvZ091dHB1dFwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRocmVhZHtcclxuICAgIGFsbFR5cGVzOlR5cGVbXSA9IFtdO1xyXG4gICAga25vd25UeXBlczpNYXA8c3RyaW5nLCBUeXBlPiA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlPigpO1xyXG4gICAga25vd25VbmRlcnN0YW5kaW5nczpUeXBlW10gPSBbXTtcclxuICAgIGtub3duUGxhY2VzOlJ1bnRpbWVQbGFjZVtdID0gW107XHJcbiAgICBtZXRob2RzOk1ldGhvZEFjdGl2YXRpb25bXSA9IFtdO1xyXG4gICAgY3VycmVudFBsYWNlPzpSdW50aW1lUGxhY2U7XHJcbiAgICBjdXJyZW50UGxheWVyPzpSdW50aW1lUGxheWVyO1xyXG4gICAgbG9nPzpJTG9nT3V0cHV0O1xyXG4gICAgXHJcbiAgICBnZXQgY3VycmVudE1ldGhvZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tZXRob2RzW3RoaXMubWV0aG9kcy5sZW5ndGggLSAxXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudEluc3RydWN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRpb24gPSB0aGlzLmN1cnJlbnRNZXRob2Q7XHJcbiAgICAgICAgcmV0dXJuIGFjdGl2YXRpb24ubWV0aG9kPy5ib2R5W2FjdGl2YXRpb24uc3RhY2tGcmFtZS5jdXJyZW50SW5zdHJ1Y3Rpb25dO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHR5cGVzOlR5cGVbXSwgbWV0aG9kOk1ldGhvZEFjdGl2YXRpb24pe1xyXG4gICAgICAgIHRoaXMuYWxsVHlwZXMgPSB0eXBlcztcclxuICAgICAgICB0aGlzLmtub3duVHlwZXMgPSBuZXcgTWFwPHN0cmluZywgVHlwZT4odHlwZXMubWFwKHR5cGUgPT4gW3R5cGUubmFtZSwgdHlwZV0pKTtcclxuICAgICAgICB0aGlzLmtub3duVW5kZXJzdGFuZGluZ3MgPSB0eXBlcy5maWx0ZXIoeCA9PiB4LmJhc2VUeXBlTmFtZSA9PT0gVW5kZXJzdGFuZGluZy50eXBlTmFtZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tZXRob2RzLnB1c2gobWV0aG9kKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3RpdmF0ZU1ldGhvZChtZXRob2Q6TWV0aG9kKXtcclxuICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gbmV3IE1ldGhvZEFjdGl2YXRpb24obWV0aG9kKTtcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5jdXJyZW50TWV0aG9kO1xyXG5cclxuICAgICAgICB0aGlzLmxvZz8uZGVidWcoYCR7Y3VycmVudC5tZXRob2Q/Lm5hbWV9ID0+ICR7bWV0aG9kLm5hbWV9YCk7XHJcblxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5wdXNoKGFjdGl2YXRpb24pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBtb3ZlTmV4dCgpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudE1ldGhvZC5zdGFja0ZyYW1lLmN1cnJlbnRJbnN0cnVjdGlvbisrO1xyXG4gICAgfVxyXG5cclxuICAgIGp1bXBUb0xpbmUobGluZU51bWJlcjpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudE1ldGhvZC5zdGFja0ZyYW1lLmN1cnJlbnRJbnN0cnVjdGlvbiA9IGxpbmVOdW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuRnJvbUN1cnJlbnRNZXRob2QoKXtcclxuICAgICAgICBjb25zdCBleHBlY3RSZXR1cm5UeXBlID0gdGhpcy5jdXJyZW50TWV0aG9kLm1ldGhvZCEucmV0dXJuVHlwZSAhPSBcIlwiO1xyXG4gICAgICAgIGNvbnN0IHJldHVybmVkTWV0aG9kID0gdGhpcy5tZXRob2RzLnBvcCgpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZz8uZGVidWcoYCR7dGhpcy5jdXJyZW50TWV0aG9kLm1ldGhvZD8ubmFtZX0gPD0gJHtyZXR1cm5lZE1ldGhvZD8ubWV0aG9kPy5uYW1lfWApO1xyXG5cclxuICAgICAgICBpZiAoIWV4cGVjdFJldHVyblR5cGUpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVFbXB0eSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSByZXR1cm5lZE1ldGhvZD8uc3RhY2sucG9wKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlITtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxhY2UgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lUGxhY2VcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuLi8uLi9jb21tb24vRmllbGRcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVtcHR5IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUVtcHR5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVDb21tYW5kIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUNvbW1hbmRcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQm9vbGVhbiB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVCb29sZWFuXCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVMaXN0IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUxpc3RcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0l0ZW1cIjtcclxuaW1wb3J0IHsgUnVudGltZUl0ZW0gfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSXRlbVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYXllciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgU2F5IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU2F5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTYXkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU2F5XCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZURlY29yYXRpb24gfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lRGVjb3JhdGlvblwiO1xyXG5pbXBvcnQgeyBEZWNvcmF0aW9uIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvRGVjb3JhdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lbW9yeXtcclxuICAgIHByaXZhdGUgc3RhdGljIHR5cGVzQnlOYW1lID0gbmV3IE1hcDxzdHJpbmcsIFR5cGU+KCk7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZWFwID0gbmV3IE1hcDxzdHJpbmcsIFJ1bnRpbWVBbnlbXT4oKTtcclxuXHJcbiAgICBzdGF0aWMgZmluZEluc3RhbmNlQnlOYW1lKG5hbWU6c3RyaW5nKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZXMgPSBNZW1vcnkuaGVhcC5nZXQobmFtZSk7XHJcblxyXG4gICAgICAgIGlmICghaW5zdGFuY2VzIHx8IGluc3RhbmNlcy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJPYmplY3Qgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGluc3RhbmNlcy5sZW5ndGggPiAxKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIkxvY2F0ZWQgbW9yZSB0aGFuIG9uZSBpbnN0YW5jZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZXNbMF07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRUeXBlcyh0eXBlczpUeXBlW10pe1xyXG4gICAgICAgIE1lbW9yeS50eXBlc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlPih0eXBlcy5tYXAoeCA9PiBbeC5uYW1lLCB4XSkpOyAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIE92ZXJyaWRlIGFueSBwcm92aWRlZCB0eXBlIHN0dWJzIHdpdGggdGhlIGFjdHVhbCBydW50aW1lIHR5cGUgZGVmaW5pdGlvbnMuXHJcblxyXG4gICAgICAgIGNvbnN0IHBsYWNlID0gUnVudGltZVBsYWNlLnR5cGU7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IFJ1bnRpbWVJdGVtLnR5cGU7XHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gUnVudGltZVBsYXllci50eXBlO1xyXG4gICAgICAgIGNvbnN0IGRlY29yYXRpb24gPSBSdW50aW1lRGVjb3JhdGlvbi50eXBlO1xyXG5cclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUuc2V0KHBsYWNlLm5hbWUsIHBsYWNlKTtcclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUuc2V0KGl0ZW0ubmFtZSwgaXRlbSk7XHJcbiAgICAgICAgTWVtb3J5LnR5cGVzQnlOYW1lLnNldChwbGF5ZXIubmFtZSwgcGxheWVyKTsgIFxyXG4gICAgICAgIE1lbW9yeS50eXBlc0J5TmFtZS5zZXQoZGVjb3JhdGlvbi5uYW1lLCBkZWNvcmF0aW9uKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShNZW1vcnkudHlwZXNCeU5hbWUudmFsdWVzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZUNvbW1hbmQoKTpSdW50aW1lQ29tbWFuZHtcclxuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVDb21tYW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG9jYXRlQm9vbGVhbih2YWx1ZTpib29sZWFuKTpSdW50aW1lQm9vbGVhbntcclxuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVCb29sZWFuKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGVOdW1iZXIodmFsdWU6bnVtYmVyKTpSdW50aW1lSW50ZWdlcntcclxuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVJbnRlZ2VyKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGVTdHJpbmcodGV4dDpzdHJpbmcpOlJ1bnRpbWVTdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lU3RyaW5nKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZSh0eXBlOlR5cGUpOlJ1bnRpbWVBbnl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBNZW1vcnkuY29uc3RydWN0SW5zdGFuY2VGcm9tKHR5cGUpO1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZVBvb2wgPSBNZW1vcnkuaGVhcC5nZXQodHlwZS5uYW1lKSB8fCBbXTtcclxuXHJcbiAgICAgICAgaW5zdGFuY2VQb29sLnB1c2goaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICBNZW1vcnkuaGVhcC5zZXQodHlwZS5uYW1lLCBpbnN0YW5jZVBvb2wpO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5pdGlhbGl6ZVZhcmlhYmxlV2l0aChmaWVsZDpGaWVsZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhcmlhYmxlID0gTWVtb3J5LmNvbnN0cnVjdFZhcmlhYmxlRnJvbShmaWVsZCk7ICAgICAgICBcclxuICAgICAgICB2YXJpYWJsZS52YWx1ZSA9IE1lbW9yeS5pbnN0YW50aWF0ZURlZmF1bHRWYWx1ZUZvcih2YXJpYWJsZSwgZmllbGQuZGVmYXVsdFZhbHVlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZhcmlhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNvbnN0cnVjdFZhcmlhYmxlRnJvbShmaWVsZDpGaWVsZCl7XHJcbiAgICAgICAgaWYgKGZpZWxkLnR5cGUpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhcmlhYmxlKGZpZWxkLm5hbWUsIGZpZWxkLnR5cGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHlwZSA9IE1lbW9yeS50eXBlc0J5TmFtZS5nZXQoZmllbGQudHlwZU5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoIXR5cGUpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBVbmFibGUgdG8gY29uc3RydWN0IHVua25vd24gdHlwZSAnJHtmaWVsZC50eXBlTmFtZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFZhcmlhYmxlKGZpZWxkLm5hbWUsIHR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbnRpYXRlRGVmYXVsdFZhbHVlRm9yKHZhcmlhYmxlOlZhcmlhYmxlLCBkZWZhdWx0VmFsdWU6T2JqZWN0fHVuZGVmaW5lZCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3dpdGNoKHZhcmlhYmxlLnR5cGUhLm5hbWUpe1xyXG4gICAgICAgICAgICBjYXNlIFN0cmluZ1R5cGUudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVN0cmluZyhkZWZhdWx0VmFsdWUgPyA8c3RyaW5nPmRlZmF1bHRWYWx1ZSA6IFwiXCIpO1xyXG4gICAgICAgICAgICBjYXNlIEJvb2xlYW5UeXBlLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVCb29sZWFuKGRlZmF1bHRWYWx1ZSA/IDxib29sZWFuPmRlZmF1bHRWYWx1ZSA6IGZhbHNlKTtcclxuICAgICAgICAgICAgY2FzZSBOdW1iZXJUeXBlLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVJbnRlZ2VyKGRlZmF1bHRWYWx1ZSA/IDxudW1iZXI+ZGVmYXVsdFZhbHVlIDogMCk7XHJcbiAgICAgICAgICAgIGNhc2UgTGlzdC50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lTGlzdChkZWZhdWx0VmFsdWUgPyB0aGlzLmluc3RhbnRpYXRlTGlzdCg8T2JqZWN0W10+ZGVmYXVsdFZhbHVlKSA6IFtdKTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUnVudGltZUVtcHR5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbnRpYXRlTGlzdChpdGVtczpPYmplY3RbXSl7XHJcbiAgICAgICAgY29uc3QgcnVudGltZUl0ZW1zOlJ1bnRpbWVBbnlbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IoY29uc3QgaXRlbSBvZiBpdGVtcyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1MaXN0ID0gPE9iamVjdFtdPml0ZW07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gPG51bWJlcj5pdGVtTGlzdFswXTtcclxuICAgICAgICAgICAgY29uc3QgdHlwZU5hbWUgPSA8c3RyaW5nPml0ZW1MaXN0WzFdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHlwZSA9IE1lbW9yeS50eXBlc0J5TmFtZS5nZXQodHlwZU5hbWUpITtcclxuXHJcbiAgICAgICAgICAgIGZvcihsZXQgY3VycmVudCA9IDA7IGN1cnJlbnQgPCBjb3VudDsgY3VycmVudCsrKXsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IE1lbW9yeS5hbGxvY2F0ZSh0eXBlKTtcclxuICAgICAgICAgICAgICAgIHJ1bnRpbWVJdGVtcy5wdXNoKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJ1bnRpbWVJdGVtcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjb25zdHJ1Y3RJbnN0YW5jZUZyb20odHlwZTpUeXBlKXtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc2VlblR5cGVzID0gbmV3IFNldDxzdHJpbmc+KCk7XHJcbiAgICAgICAgbGV0IGluaGVyaXRhbmNlQ2hhaW46VHlwZVtdID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgY3VycmVudDpUeXBlfHVuZGVmaW5lZCA9IHR5cGU7IFxyXG4gICAgICAgICAgICBjdXJyZW50OyBcclxuICAgICAgICAgICAgY3VycmVudCA9IE1lbW9yeS50eXBlc0J5TmFtZS5nZXQoY3VycmVudC5iYXNlVHlwZU5hbWUpKXtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHNlZW5UeXBlcy5oYXMoY3VycmVudC5uYW1lKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIllvdSBjYW4ndCBoYXZlIGN5Y2xlcyBpbiBhIHR5cGUgaGllcmFyY2h5XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHNlZW5UeXBlcy5hZGQoY3VycmVudC5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGluaGVyaXRhbmNlQ2hhaW4ucHVzaChjdXJyZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGZpcnN0U3lzdGVtVHlwZUFuY2VzdG9ySW5kZXggPSBpbmhlcml0YW5jZUNoYWluLmZpbmRJbmRleCh4ID0+IHguaXNTeXN0ZW1UeXBlKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGlmIChmaXJzdFN5c3RlbVR5cGVBbmNlc3RvckluZGV4IDwgMCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJUeXBlIG11c3QgdWx0aW1hdGVseSBpbmhlcml0IGZyb20gYSBzeXN0ZW0gdHlwZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5hbGxvY2F0ZVN5c3RlbVR5cGVCeU5hbWUoaW5oZXJpdGFuY2VDaGFpbltmaXJzdFN5c3RlbVR5cGVBbmNlc3RvckluZGV4XS5uYW1lKTtcclxuICAgICAgICBcclxuICAgICAgICBpbnN0YW5jZS5wYXJlbnRUeXBlTmFtZSA9IGluc3RhbmNlLnR5cGVOYW1lO1xyXG4gICAgICAgIGluc3RhbmNlLnR5cGVOYW1lID0gaW5oZXJpdGFuY2VDaGFpblswXS5uYW1lO1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBJbmhlcml0IG1vcmUgdGhhbiBqdXN0IGZpZWxkcy9tZXRob2RzLlxyXG4gICAgICAgIC8vIFRPRE86IFR5cGUgY2hlY2sgZmllbGQgaW5oZXJpdGFuY2UgZm9yIHNoYWRvd2luZy9vdmVycmlkaW5nLlxyXG5cclxuICAgICAgICAvLyBJbmhlcml0IGZpZWxkcy9tZXRob2RzIGZyb20gdHlwZXMgaW4gdGhlIGhpZXJhcmNoeSBmcm9tIGxlYXN0IHRvIG1vc3QgZGVyaXZlZC5cclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGkgPSBmaXJzdFN5c3RlbVR5cGVBbmNlc3RvckluZGV4OyBpID49IDA7IGktLSl7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUeXBlID0gaW5oZXJpdGFuY2VDaGFpbltpXTtcclxuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBmaWVsZCBvZiBjdXJyZW50VHlwZS5maWVsZHMpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSB0aGlzLmluaXRpYWxpemVWYXJpYWJsZVdpdGgoZmllbGQpO1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuZmllbGRzLnNldChmaWVsZC5uYW1lLCB2YXJpYWJsZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBtZXRob2Qgb2YgY3VycmVudFR5cGUubWV0aG9kcyl7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5tZXRob2RzLnNldChtZXRob2QubmFtZSwgbWV0aG9kKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYWxsb2NhdGVTeXN0ZW1UeXBlQnlOYW1lKHR5cGVOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgc3dpdGNoKHR5cGVOYW1lKXtcclxuICAgICAgICAgICAgY2FzZSBQbGFjZS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lUGxhY2UoKTtcclxuICAgICAgICAgICAgY2FzZSBJdGVtLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVJdGVtKCk7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWVyLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVQbGF5ZXIoKTtcclxuICAgICAgICAgICAgY2FzZSBMaXN0LnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVMaXN0KFtdKTsgICAgIFxyXG4gICAgICAgICAgICBjYXNlIFNheS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lU2F5KCk7ICAgIFxyXG4gICAgICAgICAgICBjYXNlIERlY29yYXRpb24udHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZURlY29yYXRpb24oKTsgICBcclxuICAgICAgICAgICAgZGVmYXVsdDp7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBVbmFibGUgdG8gaW5zdGFudGlhdGUgdHlwZSAnJHt0eXBlTmFtZX0nYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgUnVudGltZUVycm9yIGV4dGVuZHMgRXJyb3J7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSW50ZWdlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFzc2lnblZhcmlhYmxlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoXCIuc3QudmFyXCIpO1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJ1bnRpbWVTdHJpbmcpe1xyXG4gICAgICAgICAgICBpbnN0YW5jZS52YWx1ZSA9ICg8UnVudGltZVN0cmluZz52YWx1ZSkudmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJ1bnRpbWVJbnRlZ2VyKXtcclxuICAgICAgICAgICAgaW5zdGFuY2UudmFsdWUgPSAoPFJ1bnRpbWVJbnRlZ2VyPnZhbHVlKS52YWx1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiRW5jb3VudGVyZWQgdW5zdXBwb3J0ZWQgdHlwZSBvbiB0aGUgc3RhY2tcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJyYW5jaFJlbGF0aXZlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpdmVBbW91bnQgPSA8bnVtYmVyPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgYnIucmVsICR7cmVsYXRpdmVBbW91bnR9YCk7XHJcblxyXG4gICAgICAgIHRocmVhZC5qdW1wVG9MaW5lKHRocmVhZC5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uICsgcmVsYXRpdmVBbW91bnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVCb29sZWFuIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUJvb2xlYW5cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCcmFuY2hSZWxhdGl2ZUlmRmFsc2VIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCByZWxhdGl2ZUFtb3VudCA9IDxudW1iZXI+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWU7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSA8UnVudGltZUJvb2xlYW4+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGBici5yZWwuZmFsc2UgJHtyZWxhdGl2ZUFtb3VudH0gLy8gJHt2YWx1ZX1gKVxyXG5cclxuICAgICAgICBpZiAoIXZhbHVlLnZhbHVlKXsgICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhyZWFkLmp1bXBUb0xpbmUodGhyZWFkLmN1cnJlbnRNZXRob2Quc3RhY2tGcmFtZS5jdXJyZW50SW5zdHJ1Y3Rpb24gKyByZWxhdGl2ZUFtb3VudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29uY2F0ZW5hdGVIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBsYXN0ID0gPFJ1bnRpbWVTdHJpbmc+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcbiAgICAgICAgY29uc3QgZmlyc3QgPSA8UnVudGltZVN0cmluZz50aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5jb25jYXQgJyR7Zmlyc3QudmFsdWV9JyAnJHtsYXN0LnZhbHVlfSdgKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29uY2F0ZW5hdGVkID0gTWVtb3J5LmFsbG9jYXRlU3RyaW5nKGZpcnN0LnZhbHVlICsgXCIgXCIgKyBsYXN0LnZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChjb25jYXRlbmF0ZWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5cclxuaW50ZXJmYWNlIElJbmRleGFibGV7XHJcbiAgICBbbmFtZTpzdHJpbmddOiguLi5hcmdzOlJ1bnRpbWVBbnlbXSk9PlJ1bnRpbWVBbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFeHRlcm5hbENhbGxIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIFxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgbWV0aG9kID0gdGhpcy5sb2NhdGVGdW5jdGlvbihpbnN0YW5jZSEsIDxzdHJpbmc+bWV0aG9kTmFtZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAuY2FsbC5leHRlcm5cXHQke2luc3RhbmNlPy50eXBlTmFtZX06OiR7bWV0aG9kTmFtZX0oLi4uJHttZXRob2QubGVuZ3RofSlgKTtcclxuXHJcbiAgICAgICAgY29uc3QgYXJnczpSdW50aW1lQW55W10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1ldGhvZC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGFyZ3MucHVzaCh0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKSEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gbWV0aG9kLmNhbGwoaW5zdGFuY2UsIC4uLmFyZ3MpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHJlc3VsdCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvY2F0ZUZ1bmN0aW9uKGluc3RhbmNlOk9iamVjdCwgbWV0aG9kTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiAoPElJbmRleGFibGU+aW5zdGFuY2UpW21ldGhvZE5hbWVdO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdvVG9IYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25OdW1iZXIgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBpbnN0cnVjdGlvbk51bWJlciA9PT0gXCJudW1iZXJcIil7XHJcbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8ganVtcCBvbmUgcHJldmlvdXMgdG8gdGhlIGRlc2lyZWQgaW5zdHJ1Y3Rpb24gYmVjYXVzZSBhZnRlciBcclxuICAgICAgICAgICAgLy8gZXZhbHVhdGluZyB0aGlzIGdvdG8gd2UnbGwgbW92ZSBmb3J3YXJkICh3aGljaCB3aWxsIG1vdmUgdG8gdGhlIGRlc2lyZWQgb25lKS5cclxuICAgICAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5iciAke2luc3RydWN0aW9uTnVtYmVyfWApXHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuanVtcFRvTGluZShpbnN0cnVjdGlvbk51bWJlciAtIDEpO1xyXG4gICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBnb3RvXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUNvbW1hbmQgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQ29tbWFuZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvVW5kZXJzdGFuZGluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lVW5kZXJzdGFuZGluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVVbmRlcnN0YW5kaW5nXCI7XHJcbmltcG9ydCB7IE1lYW5pbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9NZWFuaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVXb3JsZE9iamVjdCB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVXb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vSU91dHB1dFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lTGlzdCB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVMaXN0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGFjZSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVQbGFjZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYXllclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxheWVyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVBsYXllclwiO1xyXG5pbXBvcnQgeyBMb2FkUHJvcGVydHlIYW5kbGVyIH0gZnJvbSBcIi4vTG9hZFByb3BlcnR5SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBQcmludEhhbmRsZXIgfSBmcm9tIFwiLi9QcmludEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgSW5zdGFuY2VDYWxsSGFuZGxlciB9IGZyb20gXCIuL0luc3RhbmNlQ2FsbEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgRXZlbnRUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9FdmVudFR5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZURlbGVnYXRlIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZURlbGVnYXRlXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4uL2xpYnJhcnkvVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUl0ZW0gfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSXRlbVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhhbmRsZUNvbW1hbmRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgb3V0cHV0OklPdXRwdXQpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgaWYgKCEoY29tbWFuZCBpbnN0YW5jZW9mIFJ1bnRpbWVDb21tYW5kKSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFVuYWJsZSB0byBoYW5kbGUgYSBub24tY29tbWFuZCwgZm91bmQgJyR7Y29tbWFuZH1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IGNvbW1hbmQuYWN0aW9uIS52YWx1ZTtcclxuICAgICAgICBjb25zdCB0YXJnZXROYW1lID0gY29tbWFuZC50YXJnZXROYW1lIS52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5oYW5kbGUuY21kICcke2FjdGlvbn0gJHt0YXJnZXROYW1lfSdgKTtcclxuXHJcbiAgICAgICAgY29uc3QgdW5kZXJzdGFuZGluZ3NCeUFjdGlvbiA9IG5ldyBNYXA8T2JqZWN0LCBUeXBlPih0aHJlYWQua25vd25VbmRlcnN0YW5kaW5ncy5tYXAoeCA9PiBbeC5maWVsZHMuZmluZChmaWVsZCA9PiBmaWVsZC5uYW1lID09IFVuZGVyc3RhbmRpbmcuYWN0aW9uKT8uZGVmYXVsdFZhbHVlISwgeF0pKTtcclxuXHJcbiAgICAgICAgY29uc3QgdW5kZXJzdGFuZGluZyA9IHVuZGVyc3RhbmRpbmdzQnlBY3Rpb24uZ2V0KGFjdGlvbik7XHJcblxyXG4gICAgICAgIGlmICghdW5kZXJzdGFuZGluZyl7XHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0LndyaXRlKFwiSSBkb24ndCBrbm93IGhvdyB0byBkbyB0aGF0LlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbWVhbmluZ0ZpZWxkID0gdW5kZXJzdGFuZGluZy5maWVsZHMuZmluZCh4ID0+IHgubmFtZSA9PSBVbmRlcnN0YW5kaW5nLm1lYW5pbmcpO1xyXG5cclxuICAgICAgICBjb25zdCBtZWFuaW5nID0gdGhpcy5kZXRlcm1pbmVNZWFuaW5nRm9yKDxzdHJpbmc+bWVhbmluZ0ZpZWxkPy5kZWZhdWx0VmFsdWUhKTtcclxuICAgICAgICBjb25zdCBhY3R1YWxUYXJnZXQgPSB0aGlzLmluZmVyVGFyZ2V0RnJvbSh0aHJlYWQsIHRhcmdldE5hbWUsIG1lYW5pbmcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghYWN0dWFsVGFyZ2V0KXtcclxuICAgICAgICAgICAgdGhpcy5vdXRwdXQud3JpdGUoXCJJIGRvbid0IGtub3cgd2hhdCB5b3UncmUgcmVmZXJyaW5nIHRvLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpdGNoKG1lYW5pbmcpe1xyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuRGVzY3JpYmluZzp7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaWJlKHRocmVhZCwgYWN0dWFsVGFyZ2V0LCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuTW92aW5nOiB7ICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dFBsYWNlID0gPFJ1bnRpbWVQbGFjZT5hY3R1YWxUYXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UGxhY2UgPSB0aHJlYWQuY3VycmVudFBsYWNlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRocmVhZC5jdXJyZW50UGxhY2UgPSBuZXh0UGxhY2U7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpYmUodGhyZWFkLCBhY3R1YWxUYXJnZXQsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmFpc2VFdmVudCh0aHJlYWQsIG5leHRQbGFjZSwgRXZlbnRUeXBlLlBsYXllckVudGVyc1BsYWNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmFpc2VFdmVudCh0aHJlYWQsIGN1cnJlbnRQbGFjZSEsIEV2ZW50VHlwZS5QbGF5ZXJFeGl0c1BsYWNlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTWVhbmluZy5UYWtpbmc6IHtcclxuICAgICAgICAgICAgICAgIGlmICghKGFjdHVhbFRhcmdldCBpbnN0YW5jZW9mIFJ1bnRpbWVJdGVtKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXQud3JpdGUoXCJJIGNhbid0IHRha2UgdGhhdC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3QgPSB0aHJlYWQuY3VycmVudFBsYWNlIS5nZXRDb250ZW50c0ZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICBsaXN0Lml0ZW1zID0gbGlzdC5pdGVtcy5maWx0ZXIoeCA9PiB4LnR5cGVOYW1lICE9IHRhcmdldE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnZlbnRvcnkgPSB0aHJlYWQuY3VycmVudFBsYXllciEuZ2V0Q29udGVudHNGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgaW52ZW50b3J5Lml0ZW1zLnB1c2goYWN0dWFsVGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaWJlKHRocmVhZCwgdGhyZWFkLmN1cnJlbnRQbGFjZSEsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTWVhbmluZy5JbnZlbnRvcnk6e1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW52ZW50b3J5ID0gKDxSdW50aW1lUGxheWVyPmFjdHVhbFRhcmdldCkuZ2V0Q29udGVudHNGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZUNvbnRlbnRzKHRocmVhZCwgaW52ZW50b3J5KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTWVhbmluZy5Ecm9wcGluZzp7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gdGhyZWFkLmN1cnJlbnRQbGF5ZXIhLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgICAgIGxpc3QuaXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUgIT0gdGFyZ2V0TmFtZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRzID0gdGhyZWFkLmN1cnJlbnRQbGFjZSEuZ2V0Q29udGVudHNGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgY29udGVudHMuaXRlbXMucHVzaChhY3R1YWxUYXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpYmUodGhyZWFkLCB0aHJlYWQuY3VycmVudFBsYWNlISwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbnN1cHBvcnRlZCBtZWFuaW5nIGZvdW5kXCIpO1xyXG4gICAgICAgIH0gIFxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByYWlzZUV2ZW50KHRocmVhZDpUaHJlYWQsIGxvY2F0aW9uOlJ1bnRpbWVQbGFjZSwgdHlwZTpFdmVudFR5cGUpe1xyXG4gICAgICAgIGNvbnN0IGV2ZW50cyA9IEFycmF5LmZyb20obG9jYXRpb24ubWV0aG9kcy52YWx1ZXMoKSEpLmZpbHRlcih4ID0+IHguZXZlbnRUeXBlID09IHR5cGUpO1xyXG5cclxuICAgICAgICBmb3IoY29uc3QgZXZlbnQgb2YgZXZlbnRzKXtcclxuICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gbG9jYXRpb24ubWV0aG9kcy5nZXQoZXZlbnQubmFtZSkhO1xyXG4gICAgICAgICAgICBtZXRob2QuYWN0dWFsUGFyYW1ldGVycyA9IFtuZXcgVmFyaWFibGUoXCJ+dGhpc1wiLCBuZXcgVHlwZShsb2NhdGlvbj8udHlwZU5hbWUhLCBsb2NhdGlvbj8ucGFyZW50VHlwZU5hbWUhKSwgbG9jYXRpb24pXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRlID0gbmV3IFJ1bnRpbWVEZWxlZ2F0ZShtZXRob2QpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChkZWxlZ2F0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5mZXJUYXJnZXRGcm9tKHRocmVhZDpUaHJlYWQsIHRhcmdldE5hbWU6c3RyaW5nLCBtZWFuaW5nOk1lYW5pbmcpOlJ1bnRpbWVXb3JsZE9iamVjdHx1bmRlZmluZWR7XHJcbiAgICAgICAgY29uc3QgbG9va3VwSW5zdGFuY2UgPSAobmFtZTpzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgdHJ5eyAgICAgXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gPFJ1bnRpbWVXb3JsZE9iamVjdD5NZW1vcnkuZmluZEluc3RhbmNlQnlOYW1lKG5hbWUpO1xyXG4gICAgICAgICAgICB9IGNhdGNoKGV4KXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAobWVhbmluZyA9PT0gTWVhbmluZy5Nb3Zpbmcpe1xyXG4gICAgICAgICAgICBjb25zdCBwbGFjZU5hbWUgPSA8UnVudGltZVN0cmluZz50aHJlYWQuY3VycmVudFBsYWNlPy5maWVsZHMuZ2V0KGB+JHt0YXJnZXROYW1lfWApPy52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICghcGxhY2VOYW1lKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBsb29rdXBJbnN0YW5jZShwbGFjZU5hbWUudmFsdWUpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSBpZiAobWVhbmluZyA9PT0gTWVhbmluZy5JbnZlbnRvcnkpe1xyXG4gICAgICAgICAgICByZXR1cm4gbG9va3VwSW5zdGFuY2UoUGxheWVyLnR5cGVOYW1lKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1lYW5pbmcgPT09IE1lYW5pbmcuRGVzY3JpYmluZyl7XHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0TmFtZSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhyZWFkLmN1cnJlbnRQbGFjZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcGxhY2VDb250ZW50cyA9IHRocmVhZC5jdXJyZW50UGxhY2U/LmdldENvbnRlbnRzRmllbGQoKSE7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpdGVtT3JEZWNvcmF0aW9uID0gcGxhY2VDb250ZW50cy5pdGVtcy5maW5kKHggPT4geC50eXBlTmFtZS50b0xvd2VyQ2FzZSgpID09IHRhcmdldE5hbWUudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXRlbU9yRGVjb3JhdGlvbiBpbnN0YW5jZW9mIFJ1bnRpbWVXb3JsZE9iamVjdCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbU9yRGVjb3JhdGlvbjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGxvb2t1cEluc3RhbmNlKHRocmVhZC5jdXJyZW50UGxhY2U/LnR5cGVOYW1lISk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfSBlbHNlIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLlRha2luZyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSB0aHJlYWQuY3VycmVudFBsYWNlIS5nZXRDb250ZW50c0ZpZWxkKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoaW5nSXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUgPT09IHRhcmdldE5hbWUpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKG1hdGNoaW5nSXRlbXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIDxSdW50aW1lV29ybGRPYmplY3Q+bWF0Y2hpbmdJdGVtc1swXTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1lYW5pbmcgPT09IE1lYW5pbmcuRHJvcHBpbmcpe1xyXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gdGhyZWFkLmN1cnJlbnRQbGF5ZXIhLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgY29uc3QgbWF0Y2hpbmdJdGVtcyA9IGxpc3QuaXRlbXMuZmlsdGVyKHggPT4geC50eXBlTmFtZSA9PT0gdGFyZ2V0TmFtZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAobWF0Y2hpbmdJdGVtcy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gPFJ1bnRpbWVXb3JsZE9iamVjdD5tYXRjaGluZ0l0ZW1zWzBdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVzY3JpYmUodGhyZWFkOlRocmVhZCwgdGFyZ2V0OlJ1bnRpbWVXb3JsZE9iamVjdCwgaXNTaGFsbG93RGVzY3JpcHRpb246Ym9vbGVhbil7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICBpZiAoIWlzU2hhbGxvd0Rlc2NyaXB0aW9uKXtcclxuICAgICAgICAgICAgY29uc3QgY29udGVudHMgPSB0YXJnZXQuZ2V0RmllbGRBc0xpc3QoV29ybGRPYmplY3QuY29udGVudHMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5kZXNjcmliZUNvbnRlbnRzKHRocmVhZCwgY29udGVudHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZGVzY3JpYmUgPSB0YXJnZXQubWV0aG9kcy5nZXQoV29ybGRPYmplY3QuZGVzY3JpYmUpITtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUuYWN0dWFsUGFyYW1ldGVycy51bnNoaWZ0KG5ldyBWYXJpYWJsZShcIn50aGlzXCIsIG5ldyBUeXBlKHRhcmdldD8udHlwZU5hbWUhLCB0YXJnZXQ/LnBhcmVudFR5cGVOYW1lISksIHRhcmdldCkpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKG5ldyBSdW50aW1lRGVsZWdhdGUoZGVzY3JpYmUpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9ic2VydmUodGhyZWFkOlRocmVhZCwgdGFyZ2V0OlJ1bnRpbWVXb3JsZE9iamVjdCl7XHJcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZSA9IHRhcmdldC5tZXRob2RzLmdldChXb3JsZE9iamVjdC5vYnNlcnZlKSE7XHJcblxyXG4gICAgICAgIG9ic2VydmUuYWN0dWFsUGFyYW1ldGVycy51bnNoaWZ0KG5ldyBWYXJpYWJsZShcIn50aGlzXCIsIG5ldyBUeXBlKHRhcmdldD8udHlwZU5hbWUhLCB0YXJnZXQ/LnBhcmVudFR5cGVOYW1lISksIHRhcmdldCkpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKG5ldyBSdW50aW1lRGVsZWdhdGUob2JzZXJ2ZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVzY3JpYmVDb250ZW50cyh0aHJlYWQ6VGhyZWFkLCB0YXJnZXQ6UnVudGltZUxpc3Qpe1xyXG4gICAgICAgIGZvcihjb25zdCBpdGVtIG9mIHRhcmdldC5pdGVtcyl7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSh0aHJlYWQsIDxSdW50aW1lV29ybGRPYmplY3Q+aXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGV0ZXJtaW5lTWVhbmluZ0ZvcihhY3Rpb246c3RyaW5nKTpNZWFuaW5ne1xyXG4gICAgICAgIGNvbnN0IHN5c3RlbUFjdGlvbiA9IGB+JHthY3Rpb259YDtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogU3VwcG9ydCBjdXN0b20gYWN0aW9ucyBiZXR0ZXIuXHJcblxyXG4gICAgICAgIHN3aXRjaChzeXN0ZW1BY3Rpb24pe1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcuZGVzY3JpYmluZzogcmV0dXJuIE1lYW5pbmcuRGVzY3JpYmluZztcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLm1vdmluZzogcmV0dXJuIE1lYW5pbmcuTW92aW5nO1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcuZGlyZWN0aW9uOiByZXR1cm4gTWVhbmluZy5EaXJlY3Rpb247XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy50YWtpbmc6IHJldHVybiBNZWFuaW5nLlRha2luZztcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLmludmVudG9yeTogcmV0dXJuIE1lYW5pbmcuSW52ZW50b3J5O1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcuZHJvcHBpbmc6IHJldHVybiBNZWFuaW5nLkRyb3BwaW5nO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1lYW5pbmcuQ3VzdG9tO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4uL01ldGhvZEFjdGl2YXRpb25cIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RhbmNlQ2FsbEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBtZXRob2ROYW1lPzpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhyZWFkLmN1cnJlbnRNZXRob2Q7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5tZXRob2ROYW1lKXtcclxuICAgICAgICAgICAgdGhpcy5tZXRob2ROYW1lID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGN1cnJlbnQucG9wKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGluc3RhbmNlPy5tZXRob2RzLmdldCh0aGlzLm1ldGhvZE5hbWUpITtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5jYWxsLmluc3RcXHQke2luc3RhbmNlPy50eXBlTmFtZX06OiR7dGhpcy5tZXRob2ROYW1lfSguLi4ke21ldGhvZC5wYXJhbWV0ZXJzLmxlbmd0aH0pYCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgcGFyYW1ldGVyVmFsdWVzOlZhcmlhYmxlW10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1ldGhvZCEucGFyYW1ldGVycy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlciA9IG1ldGhvZCEucGFyYW1ldGVyc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjdXJyZW50LnBvcCgpITtcclxuICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSBuZXcgVmFyaWFibGUocGFyYW1ldGVyLm5hbWUsIHBhcmFtZXRlci50eXBlISwgaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgcGFyYW1ldGVyVmFsdWVzLnB1c2godmFyaWFibGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBIQUNLOiBXZSBzaG91bGRuJ3QgY3JlYXRlIG91ciBvd24gdHlwZSwgd2Ugc2hvdWxkIGluaGVyZW50bHkga25vdyB3aGF0IGl0IGlzLlxyXG5cclxuICAgICAgICBwYXJhbWV0ZXJWYWx1ZXMudW5zaGlmdChuZXcgVmFyaWFibGUoXCJ+dGhpc1wiLCBuZXcgVHlwZShpbnN0YW5jZT8udHlwZU5hbWUhLCBpbnN0YW5jZT8ucGFyZW50VHlwZU5hbWUhKSwgaW5zdGFuY2UpKTtcclxuXHJcbiAgICAgICAgbWV0aG9kLmFjdHVhbFBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJWYWx1ZXM7XHJcblxyXG4gICAgICAgIHRocmVhZC5hY3RpdmF0ZU1ldGhvZChtZXRob2QpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRGVsZWdhdGUgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lRGVsZWdhdGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnZva2VEZWxlZ2F0ZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhcIi5jYWxsLmRlbGVnYXRlXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCkhO1xyXG5cclxuICAgICAgICBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBSdW50aW1lRGVsZWdhdGUpe1xyXG4gICAgICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gdGhyZWFkLmFjdGl2YXRlTWV0aG9kKGluc3RhbmNlLndyYXBwZWRNZXRob2QpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFVuYWJsZSB0byBpbnZva2UgZGVsZWdhdGUgZm9yIG5vbi1kZWxlZ2F0ZSBpbnN0YW5jZSAnJHtpbnN0YW5jZX0nYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZEZpZWxkSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuICAgICAgICBjb25zdCBmaWVsZE5hbWUgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuXHJcbiAgICAgICAgY29uc3QgZmllbGQgPSBpbnN0YW5jZT8uZmllbGRzLmdldChmaWVsZE5hbWUpO1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGZpZWxkPy52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5sZC5maWVsZFxcdFxcdCR7aW5zdGFuY2U/LnR5cGVOYW1lfTo6JHtmaWVsZE5hbWV9IC8vICR7dmFsdWV9YCk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkSW5zdGFuY2VIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIGlmICh0eXBlTmFtZSA9PT0gXCJ+aXRcIil7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aHJlYWQuY3VycmVudFBsYWNlITtcclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChzdWJqZWN0KTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKFwiLmxkLmN1cnIucGxhY2VcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGxvYWQgaW5zdGFuY2UgZm9yIHVuc3VwcG9ydGVkIHR5cGUgJyR7dHlwZU5hbWV9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkTG9jYWxIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgbG9jYWxOYW1lID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICBjb25zdCBwYXJhbWV0ZXIgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5tZXRob2Q/LmFjdHVhbFBhcmFtZXRlcnMuZmluZCh4ID0+IHgubmFtZSA9PSBsb2NhbE5hbWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHBhcmFtZXRlcj8udmFsdWUhKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5sZC5wYXJhbVxcdFxcdCR7bG9jYWxOYW1lfT0ke3BhcmFtZXRlcj8udmFsdWV9YCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZE51bWJlckhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZSA9IDxudW1iZXI+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG4gICAgICAgIGNvbnN0IHJ1bnRpbWVWYWx1ZSA9IE1lbW9yeS5hbGxvY2F0ZU51bWJlcih2YWx1ZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2gocnVudGltZVZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5sZC5jb25zdC5udW1cXHQke3ZhbHVlfWApO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4uL01ldGhvZEFjdGl2YXRpb25cIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBJbnN0YW5jZUNhbGxIYW5kbGVyIH0gZnJvbSBcIi4vSW5zdGFuY2VDYWxsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkVGhpc0hhbmRsZXIgfSBmcm9tIFwiLi9Mb2FkVGhpc0hhbmRsZXJcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZFByb3BlcnR5SGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZpZWxkTmFtZT86c3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpZWxkTmFtZSl7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGROYW1lID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gaW5zdGFuY2U/LmZpZWxkcy5nZXQodGhpcy5maWVsZE5hbWUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBmaWVsZD8udmFsdWUhO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZ2V0RmllbGQgPSBpbnN0YW5jZT8ubWV0aG9kcy5nZXQoYH5nZXRfJHt0aGlzLmZpZWxkTmFtZX1gKTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAubGQucHJvcFxcdFxcdCR7aW5zdGFuY2U/LnR5cGVOYW1lfTo6JHt0aGlzLmZpZWxkTmFtZX0ge2dldD0ke2dldEZpZWxkICE9IHVuZGVmaW5lZH19IC8vICR7dmFsdWV9YCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZ2V0RmllbGQpe1xyXG4gICAgICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaCh2YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9hZFRoaXMgPSBuZXcgTG9hZFRoaXNIYW5kbGVyKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBsb2FkVGhpcy5oYW5kbGUodGhyZWFkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IEV2YWx1YXRpb25SZXN1bHQuQ29udGludWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgSW5zdGFuY2VDYWxsSGFuZGxlcihnZXRGaWVsZC5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXIuaGFuZGxlKHRocmVhZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9nZXRGaWVsZC5hY3R1YWxQYXJhbWV0ZXJzLnB1c2gobmV3IFZhcmlhYmxlKFwifnZhbHVlXCIsIGZpZWxkPy50eXBlISwgdmFsdWUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3RocmVhZC5hY3RpdmF0ZU1ldGhvZChnZXRGaWVsZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgICAgIH0gZmluYWxseXtcclxuICAgICAgICAgICAgdGhpcy5maWVsZE5hbWUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkU3RyaW5nSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uIS52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIil7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0cmluZ1ZhbHVlID0gbmV3IFJ1bnRpbWVTdHJpbmcodmFsdWUpO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHN0cmluZ1ZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAubGQuY29uc3Quc3RyXFx0XCIke3ZhbHVlfVwiYCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIkV4cGVjdGVkIGEgc3RyaW5nXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCJcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRUaGlzSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5tZXRob2Q/LmFjdHVhbFBhcmFtZXRlcnNbMF0udmFsdWUhO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5sZC50aGlzYCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV3SW5zdGFuY2VIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCB0eXBlTmFtZSA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHR5cGVOYW1lID09PSBcInN0cmluZ1wiKXtcclxuICAgICAgICAgICAgY29uc3QgdHlwZSA9IHRocmVhZC5rbm93blR5cGVzLmdldCh0eXBlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZSA9PSBudWxsKXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gbG9jYXRlIHR5cGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gTWVtb3J5LmFsbG9jYXRlKHR5cGUpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChpbnN0YW5jZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOb09wSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuQ29udGludWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQ29tbWFuZCB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVDb21tYW5kXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyc2VDb21tYW5kSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5oYW5kbGUuY21kLnBhcnNlYCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgdGV4dCA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAodGV4dCBpbnN0YW5jZW9mIFJ1bnRpbWVTdHJpbmcpe1xyXG4gICAgICAgICAgICBjb25zdCBjb21tYW5kVGV4dCA9IHRleHQudmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLnBhcnNlQ29tbWFuZChjb21tYW5kVGV4dCk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKGNvbW1hbmQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gcGFyc2UgY29tbWFuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBhcnNlQ29tbWFuZCh0ZXh0OnN0cmluZyk6UnVudGltZUNvbW1hbmR7XHJcbiAgICAgICAgY29uc3QgcGllY2VzID0gdGV4dC5zcGxpdChcIiBcIik7XHJcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IE1lbW9yeS5hbGxvY2F0ZUNvbW1hbmQoKTtcclxuICAgICAgICBcclxuICAgICAgICBjb21tYW5kLmFjdGlvbiA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhwaWVjZXNbMF0pO1xyXG4gICAgICAgIGNvbW1hbmQudGFyZ2V0TmFtZSA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhwaWVjZXNbMV0pO1xyXG5cclxuICAgICAgICByZXR1cm4gY29tbWFuZDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5pbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQcmludEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHJpdmF0ZSBvdXRwdXQ6SU91dHB1dDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvdXRwdXQ6SU91dHB1dCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm91dHB1dCA9IG91dHB1dDtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAodGV4dCBpbnN0YW5jZW9mIFJ1bnRpbWVTdHJpbmcpe1xyXG4gICAgICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhcIi5wcmludFwiKTtcclxuICAgICAgICAgICAgdGhpcy5vdXRwdXQud3JpdGUodGV4dC52YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBwcmludCwgZW5jb3VudGVyZWQgYSB0eXBlIG9uIHRoZSBzdGFjayBvdGhlciB0aGFuIHN0cmluZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlYWRJbnB1dEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKFwiLnJlYWQuaW5cIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuU3VzcGVuZEZvcklucHV0O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFbXB0eSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVFbXB0eVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJldHVybkhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSByZXR1cm5pbmcgdG9wIHZhbHVlIG9uIHN0YWNrIGJhc2VkIG9uIHJldHVybiB0eXBlIG9mIG1ldGhvZC5cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhyZWFkLmN1cnJlbnRNZXRob2Q7XHJcbiAgICAgICAgY29uc3Qgc2l6ZSA9IGN1cnJlbnQuc3RhY2tTaXplKCk7XHJcbiAgICAgICAgY29uc3QgaGFzUmV0dXJuVHlwZSA9IGN1cnJlbnQubWV0aG9kPy5yZXR1cm5UeXBlICE9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmIChoYXNSZXR1cm5UeXBlKXtcclxuICAgICAgICAgICAgaWYgKHNpemUgPT0gMCl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiRXhwZWN0ZWQgcmV0dXJuIHZhbHVlIGZyb20gbWV0aG9kIGJ1dCBmb3VuZCBubyBpbnN0YW5jZSBvbiB0aGUgc3RhY2tcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2l6ZSA+IDEpe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgU3RhY2sgSW1iYWxhbmNlISBSZXR1cm5pbmcgZnJvbSAnJHtjdXJyZW50Lm1ldGhvZD8ubmFtZX0nIGZvdW5kICcke3NpemV9JyBpbnN0YW5jZXMgbGVmdCBidXQgZXhwZWN0ZWQgb25lLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHNpemUgPiAwKXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFN0YWNrIEltYmFsYW5jZSEgUmV0dXJuaW5nIGZyb20gJyR7Y3VycmVudC5tZXRob2Q/Lm5hbWV9JyBmb3VuZCAnJHtzaXplfScgaW5zdGFuY2VzIGxlZnQgYnV0IGV4cGVjdGVkIHplcm8uYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0gdGhyZWFkIS5yZXR1cm5Gcm9tQ3VycmVudE1ldGhvZCgpO1xyXG5cclxuICAgICAgICBpZiAoIShyZXR1cm5WYWx1ZSBpbnN0YW5jZW9mIFJ1bnRpbWVFbXB0eSkpe1xyXG4gICAgICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLnJldFxcdFxcdCR7cmV0dXJuVmFsdWV9YCk7XHJcbiAgICAgICAgICAgIHRocmVhZD8uY3VycmVudE1ldGhvZC5wdXNoKHJldHVyblZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhcIi5yZXQgdm9pZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBFdmFsdWF0aW9uUmVzdWx0LkNvbnRpbnVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgTWV0aG9kQWN0aXZhdGlvbiB9IGZyb20gXCIuLi9NZXRob2RBY3RpdmF0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhdGljQ2FsbEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IGNhbGxUZXh0ID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIGNvbnN0IHBpZWNlcyA9IGNhbGxUZXh0LnNwbGl0KFwiLlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSBwaWVjZXNbMF07XHJcbiAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IHBpZWNlc1sxXTtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZSA9IHRocmVhZC5rbm93blR5cGVzLmdldCh0eXBlTmFtZSkhO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHR5cGU/Lm1ldGhvZHMuZmluZCh4ID0+IHgubmFtZSA9PT0gbWV0aG9kTmFtZSkhOyAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmNhbGwuc3RhdGljXFx0JHt0eXBlTmFtZX06OiR7bWV0aG9kTmFtZX0oKWApO1xyXG5cclxuICAgICAgICB0aHJlYWQuYWN0aXZhdGVNZXRob2QobWV0aG9kKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBlT2ZIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCB0eXBlTmFtZSA9IDxzdHJpbmc+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLnR5cGVvZiAke3R5cGVOYW1lfWApO1xyXG5cclxuICAgICAgICBpZiAodGhyZWFkLmN1cnJlbnRNZXRob2Quc3RhY2tTaXplKCkgPT0gMCl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gTWVtb3J5LmFsbG9jYXRlQm9vbGVhbihmYWxzZSk7XHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucGVlaygpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaXNUeXBlID0gaW5zdGFuY2U/LnR5cGVOYW1lID09IHR5cGVOYW1lO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBNZW1vcnkuYWxsb2NhdGVCb29sZWFuKGlzVHlwZSk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBNZWFuaW5ne1xyXG4gICAgRGVzY3JpYmluZyxcclxuICAgIFRha2luZyxcclxuICAgIE1vdmluZyxcclxuICAgIERpcmVjdGlvbixcclxuICAgIEludmVudG9yeSxcclxuICAgIERyb3BwaW5nLFxyXG4gICAgUXVpdHRpbmcsXHJcbiAgICBDdXN0b21cclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuL1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUFueXtcclxuICAgIHBhcmVudFR5cGVOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICB0eXBlTmFtZTpzdHJpbmcgPSBBbnkudHlwZU5hbWU7XHJcblxyXG4gICAgZmllbGRzOk1hcDxzdHJpbmcsIFZhcmlhYmxlPiA9IG5ldyBNYXA8c3RyaW5nLCBWYXJpYWJsZT4oKTtcclxuICAgIG1ldGhvZHM6TWFwPHN0cmluZywgTWV0aG9kPiA9IG5ldyBNYXA8c3RyaW5nLCBNZXRob2Q+KCk7XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy50eXBlTmFtZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUJvb2xlYW4gZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOmJvb2xlYW4pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuL1J1bnRpbWVTdHJpbmdcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lQ29tbWFuZCBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGFyZ2V0TmFtZT86UnVudGltZVN0cmluZywgcHVibGljIGFjdGlvbj86UnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVXb3JsZE9iamVjdCB9IGZyb20gXCIuL1J1bnRpbWVXb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBEZWNvcmF0aW9uIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvRGVjb3JhdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVEZWNvcmF0aW9uIGV4dGVuZHMgUnVudGltZVdvcmxkT2JqZWN0e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBEZWNvcmF0aW9uLnBhcmVudFR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBEZWNvcmF0aW9uLnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IERlbGVnYXRlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvRGVsZWdhdGVcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9NZXRob2RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lRGVsZWdhdGUgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IERlbGVnYXRlLnR5cGVOYW1lO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB3cmFwcGVkTWV0aG9kOk1ldGhvZCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVFbXB0eSBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gXCJ+ZW1wdHlcIjtcclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUludGVnZXIgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOm51bWJlcil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lV29ybGRPYmplY3QgfSBmcm9tIFwiLi9SdW50aW1lV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvSXRlbVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUl0ZW0gZXh0ZW5kcyBSdW50aW1lV29ybGRPYmplY3R7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBJdGVtLnR5cGVOYW1lO1xyXG5cclxuICAgIHN0YXRpYyBnZXQgdHlwZSgpOlR5cGV7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IFJ1bnRpbWVXb3JsZE9iamVjdC50eXBlO1xyXG5cclxuICAgICAgICB0eXBlLm5hbWUgPSBJdGVtLnR5cGVOYW1lO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9NZXRob2RcIjtcclxuaW1wb3J0IHsgUGFyYW1ldGVyIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9QYXJhbWV0ZXJcIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tIFwiLi4vLi4vY29tbW9uL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4vUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVMaXN0IGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpdGVtczpSdW50aW1lQW55W10pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5zID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgIGNvbnRhaW5zLm5hbWUgPSBMaXN0LmNvbnRhaW5zO1xyXG4gICAgICAgIGNvbnRhaW5zLnBhcmFtZXRlcnMucHVzaChcclxuICAgICAgICAgICAgbmV3IFBhcmFtZXRlcihMaXN0LnR5cGVOYW1lUGFyYW1ldGVyLCBTdHJpbmdUeXBlLnR5cGVOYW1lKSxcclxuICAgICAgICAgICAgbmV3IFBhcmFtZXRlcihMaXN0LmNvdW50UGFyYW1ldGVyLCBOdW1iZXJUeXBlLnR5cGVOYW1lKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5zLnJldHVyblR5cGUgPSBCb29sZWFuVHlwZS50eXBlTmFtZTtcclxuXHJcbiAgICAgICAgY29udGFpbnMuYm9keS5wdXNoKFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkTG9jYWwoTGlzdC5jb3VudFBhcmFtZXRlciksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRMb2NhbChMaXN0LnR5cGVOYW1lUGFyYW1ldGVyKSwgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5leHRlcm5hbENhbGwoXCJjb250YWluc1R5cGVcIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnJldHVybigpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tZXRob2RzLnNldChMaXN0LmNvbnRhaW5zLCBjb250YWlucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb250YWluc1R5cGUodHlwZU5hbWU6UnVudGltZVN0cmluZywgY291bnQ6UnVudGltZUludGVnZXIpe1xyXG4gICAgICAgIGNvbnN0IGZvdW5kSXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUgPT09IHR5cGVOYW1lLnZhbHVlKTtcclxuICAgICAgICBjb25zdCBmb3VuZCA9IGZvdW5kSXRlbXMubGVuZ3RoID09PSBjb3VudC52YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIE1lbW9yeS5hbGxvY2F0ZUJvb2xlYW4oZm91bmQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVBsYWNlIGV4dGVuZHMgUnVudGltZVdvcmxkT2JqZWN0e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC5wYXJlbnRUeXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gUGxhY2UudHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIGdldCB0eXBlKCk6VHlwZXtcclxuICAgICAgICBjb25zdCB0eXBlID0gUnVudGltZVdvcmxkT2JqZWN0LnR5cGU7XHJcblxyXG4gICAgICAgIHR5cGUubmFtZSA9IFBsYWNlLnR5cGVOYW1lO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxheWVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVBsYXllciBleHRlbmRzIFJ1bnRpbWVXb3JsZE9iamVjdHtcclxuICAgIHN0YXRpYyBnZXQgdHlwZSgpOlR5cGV7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IFJ1bnRpbWVXb3JsZE9iamVjdC50eXBlO1xyXG5cclxuICAgICAgICB0eXBlLm5hbWUgPSBQbGF5ZXIudHlwZU5hbWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lU2F5IGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIG1lc3NhZ2U6c3RyaW5nID0gXCJcIjtcclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVTdHJpbmcgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgdmFsdWU6c3RyaW5nO1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IFwifnN0cmluZ1wiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gYFwiJHt0aGlzLnZhbHVlfVwiYDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVMaXN0IH0gZnJvbSBcIi4vUnVudGltZUxpc3RcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuL1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVXb3JsZE9iamVjdCBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIGdldCB0eXBlKCk6VHlwZXtcclxuICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoV29ybGRPYmplY3QudHlwZU5hbWUsIFdvcmxkT2JqZWN0LnBhcmVudFR5cGVOYW1lKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjb250ZW50cyA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgIGNvbnRlbnRzLm5hbWUgPSBXb3JsZE9iamVjdC5jb250ZW50cztcclxuICAgICAgICBjb250ZW50cy50eXBlTmFtZSA9IExpc3QudHlwZU5hbWU7XHJcbiAgICAgICAgY29udGVudHMuZGVmYXVsdFZhbHVlID0gW107XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgZGVzY3JpcHRpb24ubmFtZSA9IFdvcmxkT2JqZWN0LmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uLnR5cGVOYW1lID0gU3RyaW5nVHlwZS50eXBlTmFtZTtcclxuICAgICAgICBkZXNjcmlwdGlvbi5kZWZhdWx0VmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICB0eXBlLmZpZWxkcy5wdXNoKGNvbnRlbnRzKTtcclxuICAgICAgICB0eXBlLmZpZWxkcy5wdXNoKGRlc2NyaXB0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRGaWVsZFZhbHVlQnlOYW1lKG5hbWU6c3RyaW5nKTpSdW50aW1lQW55e1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5maWVsZHMuZ2V0KG5hbWUpPy52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGluc3RhbmNlID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYEF0dGVtcHRlZCBmaWVsZCBhY2Nlc3MgZm9yIHVua25vd24gZmllbGQgJyR7bmFtZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29udGVudHNGaWVsZCgpOlJ1bnRpbWVMaXN0e1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEZpZWxkQXNMaXN0KFdvcmxkT2JqZWN0LmNvbnRlbnRzKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRGaWVsZEFzTGlzdChuYW1lOnN0cmluZyk6UnVudGltZUxpc3R7XHJcbiAgICAgICAgcmV0dXJuIDxSdW50aW1lTGlzdD50aGlzLmdldEZpZWxkVmFsdWVCeU5hbWUobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RmllbGRBc1N0cmluZyhuYW1lOnN0cmluZyk6UnVudGltZVN0cmluZ3tcclxuICAgICAgICByZXR1cm4gPFJ1bnRpbWVTdHJpbmc+dGhpcy5nZXRGaWVsZFZhbHVlQnlOYW1lKG5hbWUpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZhcmlhYmxle1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBuYW1lOnN0cmluZywgXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdHlwZTpUeXBlLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHZhbHVlPzpSdW50aW1lQW55KXtcclxuICAgIH1cclxufSJdfQ==
