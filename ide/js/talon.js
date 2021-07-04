(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaneOutput = void 0;
class PaneOutput {
    constructor(pane) {
        this.pane = pane;
    }
    clear() {
        this.pane.innerHTML = "";
    }
    debug(line) {
        if (line.startsWith('.')) {
            const parts = line.split(' ');
            parts[0] = `<strong>${parts[0]}</strong>`;
            line = parts.join(' ');
        }
        this.pane.innerHTML += line + "<br />";
        this.pane.scrollTo(0, this.pane.scrollHeight);
    }
    write(line) {
        this.pane.innerHTML += line + "<br />";
        this.pane.scrollTo(0, this.pane.scrollHeight);
    }
}
exports.PaneOutput = PaneOutput;
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalonIde = void 0;
const TalonCompiler_1 = require("./compiler/TalonCompiler");
const PaneOutput_1 = require("./PaneOutput");
const TalonRuntime_1 = require("./runtime/TalonRuntime");
const AnalysisCoordinator_1 = require("./ide/AnalysisCoordinator");
const CodePaneAnalyzer_1 = require("./ide/analyzers/CodePaneAnalyzer");
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
        this.caretPosition = TalonIde.getById("caret-position");
        this.example1Button.addEventListener('click', e => this.loadExample());
        this.compileButton.addEventListener('click', e => this.compile());
        this.startNewGameButton.addEventListener('click', e => this.startNewGame());
        this.sendUserCommandButton.addEventListener('click', e => this.sendUserCommand());
        this.userCommandText.addEventListener('keyup', e => {
            if (e.key === "Enter") {
                this.sendUserCommand();
            }
        });
        this.compilationOutputPane = new PaneOutput_1.PaneOutput(this.compilationOutput);
        this.runtimeOutputPane = new PaneOutput_1.PaneOutput(this.gamePane);
        this.runtimeLogOutputPane = new PaneOutput_1.PaneOutput(this.gameLogOutput);
        this.codePaneAnalyzer = new CodePaneAnalyzer_1.CodePaneAnalyzer(this.codePane);
        this.analysisCoordinator = new AnalysisCoordinator_1.AnalysisCoordinator(this.codePaneAnalyzer, this.caretPosition);
        this.compiler = new TalonCompiler_1.TalonCompiler(this.compilationOutputPane);
        this.runtime = new TalonRuntime_1.TalonRuntime(this.runtimeOutputPane, this.runtimeLogOutputPane);
    }
    static getById(name) {
        return document.getElementById(name);
    }
    sendUserCommand() {
        const command = this.userCommandText.value;
        this.runtime.sendCommand(command);
        this.userCommandText.value = "";
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
                "it is described as \"The inn is a cozy place, with a crackling fire on the hearth. The bartender is behind the bar. An open door to the north leads outside.\" and if it contains 1 Coin then \"There's also a coin here.\"; or else \"There is just dust.\"; and then continue.\n" +
                "it contains 1 Coin, 1 Fireplace.\n" +
                "it can reach the Walkway by going \"north\". \n" +
                "it has a value that is 1. \n" +
                "when the player exits: \n" +
                "if value is 1 then say \"The bartender waves goodbye.\"; or else say \"The bartender cleans the bar.\"; and then continue;\n" +
                "set value to 2; \n" +
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
},{"./PaneOutput":1,"./compiler/TalonCompiler":11,"./ide/AnalysisCoordinator":52,"./ide/analyzers/CodePaneAnalyzer":54,"./runtime/TalonRuntime":75}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType[EventType["None"] = 0] = "None";
    EventType[EventType["PlayerEntersPlace"] = 1] = "PlayerEntersPlace";
    EventType[EventType["PlayerExitsPlace"] = 2] = "PlayerExitsPlace";
})(EventType = exports.EventType || (exports.EventType = {}));
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
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
exports.Instruction = void 0;
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
    static compareEqual() {
        return new Instruction(OpCode_1.OpCode.CompareEqual);
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
exports.Method = void 0;
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
exports.OpCode = void 0;
var OpCode;
(function (OpCode) {
    OpCode["NoOp"] = ".noop";
    OpCode["Assign"] = ".set.var";
    OpCode["CompareEqual"] = ".compare.eq";
    OpCode["Print"] = ".print";
    OpCode["LoadString"] = ".load.str";
    OpCode["NewInstance"] = ".new";
    OpCode["ParseCommand"] = ".parse.cmd";
    OpCode["HandleCommand"] = ".handle.cmd";
    OpCode["ReadInput"] = ".read.in";
    OpCode["GoTo"] = ".br";
    OpCode["Return"] = ".ret";
    OpCode["BranchRelative"] = ".br.rel";
    OpCode["BranchRelativeIfFalse"] = ".br.rel.false";
    OpCode["Concatenate"] = ".concat";
    OpCode["LoadNumber"] = ".load.num";
    OpCode["LoadField"] = ".load.fld";
    OpCode["LoadProperty"] = ".load.prop";
    OpCode["LoadInstance"] = ".load.inst";
    OpCode["LoadLocal"] = ".load.loc";
    OpCode["LoadThis"] = ".load.this";
    OpCode["InstanceCall"] = ".call.inst";
    OpCode["StaticCall"] = ".call.static";
    OpCode["ExternalCall"] = ".call.extern";
    OpCode["TypeOf"] = ".typeof";
    OpCode["InvokeDelegate"] = ".call.func";
})(OpCode = exports.OpCode || (exports.OpCode = {}));
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parameter = void 0;
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
exports.Type = void 0;
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
exports.Version = void 0;
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
exports.TalonCompiler = void 0;
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
        this.out.write("<strong>Starting compilation...</strong>");
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
                this.out.write(`<em>Error: ${ex.message}</em>`);
            }
            else {
                this.out.write(`<em>Unhandled Error: ${ex}</em>`);
            }
            return [];
        }
        finally {
            this.out.write("<strong>Compilation complete.</strong>");
        }
    }
    createEntryPoint() {
        const type = new Type_1.Type("~game", Any_1.Any.typeName);
        type.attributes.push(new EntryPointAttribute_1.EntryPointAttribute());
        const main = new Method_1.Method();
        main.name = Any_1.Any.main;
        main.body.push(Instruction_1.Instruction.loadString(`Talon Language v.${this.languageVersion}, Compiler v.${this.version}`), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString("================================="), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.staticCall("~globalSays", "~say"), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString("What would you like to do?"), Instruction_1.Instruction.print(), Instruction_1.Instruction.readInput(), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.parseCommand(), Instruction_1.Instruction.handleCommand(), Instruction_1.Instruction.isTypeOf(Delegate_1.Delegate.typeName), Instruction_1.Instruction.branchRelativeIfFalse(2), Instruction_1.Instruction.invokeDelegate(), Instruction_1.Instruction.branchRelative(-4), Instruction_1.Instruction.goTo(9));
        type.methods.push(main);
        return type;
    }
}
exports.TalonCompiler = TalonCompiler;
},{"../common/Instruction":5,"../common/Method":6,"../common/Type":9,"../common/Version":10,"../library/Any":55,"../library/Delegate":58,"../library/EntryPointAttribute":59,"./exceptions/CompilationError":12,"./lexing/TalonLexer":15,"./parsing/TalonParser":19,"./semantics/TalonSemanticAnalyzer":49,"./transforming/TalonTransformer":51}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompilationError = void 0;
class CompilationError {
    constructor(message) {
        this.message = message;
    }
}
exports.CompilationError = CompilationError;
},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keywords = void 0;
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
Keywords.or = "or";
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
Keywords.continue = "continue";
},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Punctuation = void 0;
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
exports.TalonLexer = void 0;
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
exports.Token = void 0;
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
        return `${this.line}, ${this.column}: Found token '${this.value}' of type '${this.type}'`;
    }
}
exports.Token = Token;
},{"../../library/Any":55,"../../library/BooleanType":56,"../../library/Decoration":57,"../../library/Item":61,"../../library/List":62,"../../library/Place":64,"../../library/WorldObject":69,"./TokenType":17}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType["Unknown"] = "Unknown";
    TokenType["Keyword"] = "Keyword";
    TokenType["Terminator"] = "Terminator";
    TokenType["SemiTerminator"] = "SemiTerminator";
    TokenType["String"] = "String";
    TokenType["Identifier"] = "Identifier";
    TokenType["Number"] = "Number";
    TokenType["OpenMethodBlock"] = "OpenMethodBlock";
    TokenType["ListSeparator"] = "ListSeparator";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseContext = void 0;
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
    get nextToken() {
        return this.tokens[this.index + 1];
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
    isFollowedBy(tokenValue) {
        var _a;
        return ((_a = this.nextToken) === null || _a === void 0 ? void 0 : _a.value) == tokenValue;
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
        const token = this.expectAndConsume(TokenType_1.TokenType.String, "Expected string");
        // We need to strip off the double quotes from their string after we consume it.
        return new Token_1.Token(token.line, token.column, token.value.substring(1, token.value.length - 1));
    }
    expectNumber() {
        return this.expectAndConsume(TokenType_1.TokenType.Number, "Expected number");
    }
    expectIdentifier() {
        return this.expectAndConsume(TokenType_1.TokenType.Identifier, "Expected identifier");
    }
    expectTerminator() {
        this.expectAndConsume(TokenType_1.TokenType.Terminator, "Expected expression terminator");
    }
    expectSemiTerminator() {
        this.expectAndConsume(TokenType_1.TokenType.SemiTerminator, "Expected semi expression terminator");
    }
    expectOpenMethodBlock() {
        this.expectAndConsume(TokenType_1.TokenType.OpenMethodBlock, "Expected open method block");
    }
    expectAndConsume(tokenType, errorMessage) {
        if (this.currentToken.type != tokenType) {
            throw this.createCompilationErrorForCurrentToken(errorMessage);
        }
        return this.consumeCurrentToken();
    }
    createCompilationErrorForCurrentToken(message) {
        return new CompilationError_1.CompilationError(`${message}: ${this.currentToken}`);
    }
}
exports.ParseContext = ParseContext;
},{"../exceptions/CompilationError":12,"../lexing/Token":16,"../lexing/TokenType":17}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalonParser = void 0;
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
},{"./ParseContext":18,"./visitors/ProgramVisitor":43}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionsExpression = void 0;
const Expression_1 = require("./Expression");
class ActionsExpression extends Expression_1.Expression {
    constructor(actions) {
        super();
        this.actions = actions;
    }
}
exports.ActionsExpression = ActionsExpression;
},{"./Expression":25}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryExpression = void 0;
const Expression_1 = require("./Expression");
class BinaryExpression extends Expression_1.Expression {
}
exports.BinaryExpression = BinaryExpression;
},{"./Expression":25}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparisonExpression = void 0;
const BinaryExpression_1 = require("./BinaryExpression");
class ComparisonExpression extends BinaryExpression_1.BinaryExpression {
    constructor(identifier, comparedTo) {
        super();
        this.left = identifier;
        this.right = comparedTo;
    }
}
exports.ComparisonExpression = ComparisonExpression;
},{"./BinaryExpression":21}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcatenationExpression = void 0;
const BinaryExpression_1 = require("./BinaryExpression");
class ConcatenationExpression extends BinaryExpression_1.BinaryExpression {
}
exports.ConcatenationExpression = ConcatenationExpression;
},{"./BinaryExpression":21}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainsExpression = void 0;
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
},{"./Expression":25}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expression = void 0;
class Expression {
}
exports.Expression = Expression;
},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldDeclarationExpression = void 0;
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
},{"./Expression":25}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierExpression = void 0;
const Expression_1 = require("./Expression");
class IdentifierExpression extends Expression_1.Expression {
    constructor(instanceName, variableName) {
        super();
        this.instanceName = instanceName;
        this.variableName = variableName;
    }
}
exports.IdentifierExpression = IdentifierExpression;
},{"./Expression":25}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfExpression = void 0;
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
},{"./Expression":25}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListExpression = void 0;
const Expression_1 = require("./Expression");
class ListExpression extends Expression_1.Expression {
    constructor(items) {
        super();
        this.items = items;
    }
}
exports.ListExpression = ListExpression;
},{"./Expression":25}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiteralExpression = void 0;
const Expression_1 = require("./Expression");
class LiteralExpression extends Expression_1.Expression {
    constructor(typeName, value) {
        super();
        this.typeName = typeName;
        this.value = value;
    }
}
exports.LiteralExpression = LiteralExpression;
},{"./Expression":25}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramExpression = void 0;
const Expression_1 = require("./Expression");
class ProgramExpression extends Expression_1.Expression {
    constructor(expressions) {
        super();
        this.expressions = expressions;
    }
}
exports.ProgramExpression = ProgramExpression;
},{"./Expression":25}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SayExpression = void 0;
const Expression_1 = require("./Expression");
class SayExpression extends Expression_1.Expression {
    constructor(text) {
        super();
        this.text = text;
    }
}
exports.SayExpression = SayExpression;
},{"./Expression":25}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetVariableExpression = void 0;
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
},{"./Expression":25}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeDeclarationExpression = void 0;
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
},{"./Expression":25}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnderstandingDeclarationExpression = void 0;
const Expression_1 = require("./Expression");
class UnderstandingDeclarationExpression extends Expression_1.Expression {
    constructor(value, meaning) {
        super();
        this.value = value;
        this.meaning = meaning;
    }
}
exports.UnderstandingDeclarationExpression = UnderstandingDeclarationExpression;
},{"./Expression":25}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhenDeclarationExpression = void 0;
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
},{"./Expression":25}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockExpressionVisitor = void 0;
const Keywords_1 = require("../../lexing/Keywords");
const ActionsExpression_1 = require("../expressions/ActionsExpression");
const ExpressionVisitor_1 = require("./ExpressionVisitor");
const Visitor_1 = require("./Visitor");
class BlockExpressionVisitor extends Visitor_1.Visitor {
    visit(context) {
        const actions = [];
        const expressionVisitor = new ExpressionVisitor_1.ExpressionVisitor();
        while (!context.is(Keywords_1.Keywords.and) && !context.is(Keywords_1.Keywords.or)) {
            const action = expressionVisitor.visit(context);
            actions.push(action);
            context.expectSemiTerminator();
        }
        return new ActionsExpression_1.ActionsExpression(actions);
    }
}
exports.BlockExpressionVisitor = BlockExpressionVisitor;
},{"../../lexing/Keywords":13,"../expressions/ActionsExpression":20,"./ExpressionVisitor":40,"./Visitor":47}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparisonExpressionVisitor = void 0;
const Keywords_1 = require("../../lexing/Keywords");
const ComparisonExpression_1 = require("../expressions/ComparisonExpression");
const IdentifierExpression_1 = require("../expressions/IdentifierExpression");
const ExpressionVisitor_1 = require("./ExpressionVisitor");
const Visitor_1 = require("./Visitor");
class ComparisonExpressionVisitor extends Visitor_1.Visitor {
    visit(context) {
        const identifier = context.expectIdentifier();
        const identifierExpression = new IdentifierExpression_1.IdentifierExpression(undefined, identifier.value);
        context.expect(Keywords_1.Keywords.is);
        var visitor = new ExpressionVisitor_1.ExpressionVisitor();
        var comparedTo = visitor.visit(context);
        return new ComparisonExpression_1.ComparisonExpression(identifierExpression, comparedTo);
    }
}
exports.ComparisonExpressionVisitor = ComparisonExpressionVisitor;
},{"../../lexing/Keywords":13,"../expressions/ComparisonExpression":22,"../expressions/IdentifierExpression":27,"./ExpressionVisitor":40,"./Visitor":47}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventExpressionVisitor = void 0;
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
},{"../../lexing/Keywords":13,"../expressions/ActionsExpression":20,"./ExpressionVisitor":40}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionVisitor = void 0;
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
const ComparisonExpressionVisitor_1 = require("./ComparisonExpressionVisitor");
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
            if (context.isTypeOf(TokenType_1.TokenType.Identifier)) {
                variableName = context.expectIdentifier().value;
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
        else if (context.isFollowedBy(Keywords_1.Keywords.is)) {
            const visitor = new ComparisonExpressionVisitor_1.ComparisonExpressionVisitor();
            return visitor.visit(context);
        }
        else {
            throw new CompilationError_1.CompilationError(`Unable to parse expression at ${context.currentToken}`);
        }
    }
}
exports.ExpressionVisitor = ExpressionVisitor;
},{"../../../library/NumberType":63,"../../../library/StringType":67,"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../../lexing/TokenType":17,"../expressions/ContainsExpression":24,"../expressions/ListExpression":29,"../expressions/LiteralExpression":30,"../expressions/SayExpression":32,"../expressions/SetVariableExpression":33,"./ComparisonExpressionVisitor":38,"./IfExpressionVisitor":42,"./Visitor":47}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldDeclarationVisitor = void 0;
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
            const name = context.expectIdentifier();
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
},{"../../../library/BooleanType":56,"../../../library/List":62,"../../../library/NumberType":63,"../../../library/Place":64,"../../../library/StringType":67,"../../../library/WorldObject":69,"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../../lexing/TokenType":17,"../expressions/ConcatenationExpression":23,"../expressions/FieldDeclarationExpression":26,"./ExpressionVisitor":40,"./Visitor":47}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfExpressionVisitor = void 0;
const Visitor_1 = require("./Visitor");
const Keywords_1 = require("../../lexing/Keywords");
const ExpressionVisitor_1 = require("./ExpressionVisitor");
const IfExpression_1 = require("../expressions/IfExpression");
const BlockExpressionVisitor_1 = require("./BlockExpressionVisitor");
const CompilationError_1 = require("../../exceptions/CompilationError");
class IfExpressionVisitor extends Visitor_1.Visitor {
    visit(context) {
        context.expect(Keywords_1.Keywords.if);
        const expressionVisitor = new ExpressionVisitor_1.ExpressionVisitor();
        const conditional = expressionVisitor.visit(context);
        context.expect(Keywords_1.Keywords.then);
        const blockVisitor = new BlockExpressionVisitor_1.BlockExpressionVisitor();
        const ifBlock = blockVisitor.visit(context);
        const elseBlock = this.tryVisitElseBlock(context);
        if (context.is(Keywords_1.Keywords.and)) {
            context.expect(Keywords_1.Keywords.and);
            context.expect(Keywords_1.Keywords.then);
            context.expect(Keywords_1.Keywords.continue);
        }
        else {
            throw new CompilationError_1.CompilationError(`You need to end an 'if' expression correctly, not with: ${context.currentToken}`);
        }
        return new IfExpression_1.IfExpression(conditional, ifBlock, elseBlock);
    }
    tryVisitElseBlock(context) {
        if (!context.is(Keywords_1.Keywords.or)) {
            return null;
        }
        const blockVisitor = new BlockExpressionVisitor_1.BlockExpressionVisitor();
        context.expect(Keywords_1.Keywords.or);
        context.expect(Keywords_1.Keywords.else);
        return blockVisitor.visit(context);
    }
}
exports.IfExpressionVisitor = IfExpressionVisitor;
},{"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../expressions/IfExpression":28,"./BlockExpressionVisitor":37,"./ExpressionVisitor":40,"./Visitor":47}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramVisitor = void 0;
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
},{"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../expressions/ProgramExpression":31,"./SayExpressionVisitor":44,"./TypeDeclarationVisitor":45,"./UnderstandingDeclarationVisitor":46,"./Visitor":47}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SayExpressionVisitor = void 0;
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
},{"../../lexing/Keywords":13,"../expressions/SayExpression":32,"./Visitor":47}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeDeclarationVisitor = void 0;
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
},{"../../lexing/Keywords":13,"../expressions/TypeDeclarationExpression":34,"./FieldDeclarationVisitor":41,"./Visitor":47,"./WhenDeclarationVisitor":48}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnderstandingDeclarationVisitor = void 0;
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
},{"../../lexing/Keywords":13,"../expressions/UnderstandingDeclarationExpression":35,"./Visitor":47}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitor = void 0;
class Visitor {
}
exports.Visitor = Visitor;
},{}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhenDeclarationVisitor = void 0;
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
},{"../../lexing/Keywords":13,"../expressions/WhenDeclarationExpression":36,"./EventExpressionVisitor":39,"./Visitor":47}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalonSemanticAnalyzer = void 0;
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
},{"../lexing/Token":16,"../lexing/TokenType":17,"../parsing/expressions/ProgramExpression":31,"../parsing/expressions/TypeDeclarationExpression":34}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionTransformationMode = void 0;
var ExpressionTransformationMode;
(function (ExpressionTransformationMode) {
    ExpressionTransformationMode[ExpressionTransformationMode["None"] = 0] = "None";
    ExpressionTransformationMode[ExpressionTransformationMode["IgnoreResultsOfSayExpression"] = 1] = "IgnoreResultsOfSayExpression";
})(ExpressionTransformationMode = exports.ExpressionTransformationMode || (exports.ExpressionTransformationMode = {}));
},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalonTransformer = void 0;
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
const ActionsExpression_1 = require("../parsing/expressions/ActionsExpression");
const Keywords_1 = require("../lexing/Keywords");
const EventType_1 = require("../../common/EventType");
const ExpressionTransformationMode_1 = require("./ExpressionTransformationMode");
const SetVariableExpression_1 = require("../parsing/expressions/SetVariableExpression");
const LiteralExpression_1 = require("../parsing/expressions/LiteralExpression");
const Decoration_1 = require("../../library/Decoration");
const ComparisonExpression_1 = require("../parsing/expressions/ComparisonExpression");
const IdentifierExpression_1 = require("../parsing/expressions/IdentifierExpression");
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
        if (expression == null) {
            return instructions;
        }
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
        else if (expression instanceof IdentifierExpression_1.IdentifierExpression) {
            instructions.push(Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadField(expression.variableName));
        }
        else if (expression instanceof ComparisonExpression_1.ComparisonExpression) {
            const right = this.transformExpression(expression.right);
            const left = this.transformExpression(expression.left);
            instructions.push(...left, ...right, Instruction_1.Instruction.compareEqual());
        }
        else if (expression instanceof ActionsExpression_1.ActionsExpression) {
            expression.actions.forEach(x => instructions.push(...this.transformExpression(x, mode)));
        }
        else {
            throw new CompilationError_1.CompilationError(`Unable to transform unsupported expression: ${expression}`);
        }
        return instructions;
    }
    transformInitialTypeDeclaration(expression) {
        return new Type_1.Type(expression.name, expression.baseType.name);
    }
}
exports.TalonTransformer = TalonTransformer;
},{"../../common/EventType":3,"../../common/Field":4,"../../common/Instruction":5,"../../common/Method":6,"../../common/Parameter":8,"../../common/Type":9,"../../library/Any":55,"../../library/BooleanType":56,"../../library/Decoration":57,"../../library/Item":61,"../../library/List":62,"../../library/NumberType":63,"../../library/Place":64,"../../library/Player":65,"../../library/Say":66,"../../library/StringType":67,"../../library/Understanding":68,"../../library/WorldObject":69,"../exceptions/CompilationError":12,"../lexing/Keywords":13,"../parsing/expressions/ActionsExpression":20,"../parsing/expressions/ComparisonExpression":22,"../parsing/expressions/ConcatenationExpression":23,"../parsing/expressions/ContainsExpression":24,"../parsing/expressions/FieldDeclarationExpression":26,"../parsing/expressions/IdentifierExpression":27,"../parsing/expressions/IfExpression":28,"../parsing/expressions/LiteralExpression":30,"../parsing/expressions/ProgramExpression":31,"../parsing/expressions/SayExpression":32,"../parsing/expressions/SetVariableExpression":33,"../parsing/expressions/TypeDeclarationExpression":34,"../parsing/expressions/UnderstandingDeclarationExpression":35,"./ExpressionTransformationMode":50}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisCoordinator = void 0;
class AnalysisCoordinator {
    constructor(analyzer, output) {
        this.analyzer = analyzer;
        this.output = output;
        analyzer.currentPane.addEventListener("keyup", e => this.update());
        analyzer.currentPane.addEventListener("click", e => this.update());
    }
    update() {
        this.updateCaretPositionValues();
    }
    updateCaretPositionValues() {
        const position = this.analyzer.currentCaretPosition;
        const formattedPosition = `Line ${position.row}, Column ${position.column}`;
        this.output.innerHTML = formattedPosition;
    }
}
exports.AnalysisCoordinator = AnalysisCoordinator;
},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaretPosition = void 0;
class CaretPosition {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
}
exports.CaretPosition = CaretPosition;
},{}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodePaneAnalyzer = void 0;
const CaretPosition_1 = require("../CaretPosition");
class CodePaneAnalyzer {
    constructor(pane) {
        this.pane = pane;
        this.caretRow = 0;
        this.caretColumn = 0;
        pane.addEventListener("keyup", e => this.updateCurrentCaretPosition());
        pane.addEventListener("click", e => this.updateCurrentCaretPosition());
    }
    get currentCaretPosition() {
        return new CaretPosition_1.CaretPosition(this.caretRow, this.caretColumn);
    }
    get currentPane() {
        return this.pane;
    }
    updateCurrentCaretPosition() {
        var sel = document.getSelection(); // Using 'any' because 'modify' isn't officially supported.
        if (sel.toString().length > 0) {
            return;
        }
        sel.modify("extend", "backward", "lineboundary");
        var position = sel.toString().length;
        if (sel.anchorNode != undefined) {
            sel.collapseToEnd();
        }
        this.caretColumn = position;
        sel = document.getSelection();
        sel.modify("extend", "backward", "documentboundary");
        this.caretRow = ((sel.toString().substring(0)).split("\n")).length;
        if (sel.anchorNode != undefined) {
            sel.collapseToEnd();
        }
    }
}
exports.CodePaneAnalyzer = CodePaneAnalyzer;
},{"../CaretPosition":53}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Any = void 0;
const ExternCall_1 = require("./ExternCall");
class Any {
}
exports.Any = Any;
Any.parentTypeName = "";
Any.typeName = "~any";
Any.main = "~main";
Any.externToString = ExternCall_1.ExternCall.of("~toString");
},{"./ExternCall":60}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanType = void 0;
const Any_1 = require("./Any");
class BooleanType {
}
exports.BooleanType = BooleanType;
BooleanType.parentTypeName = Any_1.Any.typeName;
BooleanType.typeName = "~boolean";
},{"./Any":55}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decoration = void 0;
const WorldObject_1 = require("./WorldObject");
class Decoration {
}
exports.Decoration = Decoration;
Decoration.parentTypeName = WorldObject_1.WorldObject.typeName;
Decoration.typeName = "~decoration";
},{"./WorldObject":69}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delegate = void 0;
const Any_1 = require("./Any");
class Delegate {
}
exports.Delegate = Delegate;
Delegate.typeName = "~delegate";
Delegate.parentTypeName = Any_1.Any.typeName;
},{"./Any":55}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryPointAttribute = void 0;
class EntryPointAttribute {
    constructor() {
        this.name = "~entryPoint";
    }
}
exports.EntryPointAttribute = EntryPointAttribute;
},{}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternCall = void 0;
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
},{}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const WorldObject_1 = require("./WorldObject");
class Item {
}
exports.Item = Item;
Item.typeName = "~item";
Item.parentTypeName = WorldObject_1.WorldObject.typeName;
},{"./WorldObject":69}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const Any_1 = require("./Any");
class List {
}
exports.List = List;
List.typeName = "~list";
List.parentTypeName = Any_1.Any.typeName;
List.contains = "~contains";
List.typeNameParameter = "~typeName";
List.countParameter = "~count";
},{"./Any":55}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberType = void 0;
const Any_1 = require("./Any");
class NumberType {
}
exports.NumberType = NumberType;
NumberType.typeName = "~number";
NumberType.parentTypeName = Any_1.Any.typeName;
},{"./Any":55}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Place = void 0;
const WorldObject_1 = require("./WorldObject");
class Place {
}
exports.Place = Place;
Place.parentTypeName = WorldObject_1.WorldObject.typeName;
Place.typeName = "~place";
Place.isPlayerStart = "~isPlayerStart";
},{"./WorldObject":69}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const WorldObject_1 = require("./WorldObject");
class Player {
}
exports.Player = Player;
Player.typeName = "~player";
Player.parentTypeName = WorldObject_1.WorldObject.typeName;
},{"./WorldObject":69}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Say = void 0;
const Any_1 = require("./Any");
class Say {
}
exports.Say = Say;
Say.typeName = "~say";
Say.parentTypeName = Any_1.Any.typeName;
},{"./Any":55}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringType = void 0;
const Any_1 = require("./Any");
class StringType {
}
exports.StringType = StringType;
StringType.parentTypeName = Any_1.Any.typeName;
StringType.typeName = "~string";
},{"./Any":55}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Understanding = void 0;
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
},{"./Any":55}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldObject = void 0;
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
},{"./Any":55}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TalonIde_1 = require("./TalonIde");
var ide = new TalonIde_1.TalonIde();
},{"./TalonIde":2}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationResult = void 0;
var EvaluationResult;
(function (EvaluationResult) {
    EvaluationResult[EvaluationResult["Continue"] = 0] = "Continue";
    EvaluationResult[EvaluationResult["SuspendForInput"] = 1] = "SuspendForInput";
})(EvaluationResult = exports.EvaluationResult || (exports.EvaluationResult = {}));
},{}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodActivation = void 0;
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
},{"./StackFrame":74,"./errors/RuntimeError":78}],73:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpCodeHandler = void 0;
const EvaluationResult_1 = require("./EvaluationResult");
class OpCodeHandler {
    logInteraction(thread, ...parameters) {
        var _a;
        let formattedLine = this.code.toString();
        if (parameters && parameters.length > 0) {
            formattedLine += ' ' + parameters.join(' ');
        }
        (_a = thread.log) === null || _a === void 0 ? void 0 : _a.debug(formattedLine);
    }
    handle(thread) {
        return EvaluationResult_1.EvaluationResult.Continue;
    }
}
exports.OpCodeHandler = OpCodeHandler;
},{"./EvaluationResult":71}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackFrame = void 0;
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
},{"./library/Variable":119}],75:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalonRuntime = void 0;
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
const ComparisonHandler_1 = require("./handlers/ComparisonHandler");
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
        this.handlers.set(OpCode_1.OpCode.CompareEqual, new ComparisonHandler_1.ComparisonHandler());
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
        Memory_1.Memory.clear();
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
},{"../common/OpCode":7,"../library/Any":55,"../library/EntryPointAttribute":59,"../library/Place":64,"../library/Player":65,"./EvaluationResult":71,"./MethodActivation":72,"./Thread":76,"./common/Memory":77,"./errors/RuntimeError":78,"./handlers/AssignVariableHandler":79,"./handlers/BranchRelativeHandler":80,"./handlers/BranchRelativeIfFalseHandler":81,"./handlers/ComparisonHandler":82,"./handlers/ConcatenateHandler":83,"./handlers/ExternalCallHandler":84,"./handlers/GoToHandler":85,"./handlers/HandleCommandHandler":86,"./handlers/InstanceCallHandler":87,"./handlers/InvokeDelegateHandler":88,"./handlers/LoadFieldHandler":89,"./handlers/LoadInstanceHandler":90,"./handlers/LoadLocalHandler":91,"./handlers/LoadNumberHandler":92,"./handlers/LoadPropertyHandler":93,"./handlers/LoadStringHandler":94,"./handlers/LoadThisHandler":95,"./handlers/NewInstanceHandler":96,"./handlers/NoOpHandler":97,"./handlers/ParseCommandHandler":98,"./handlers/PrintHandler":99,"./handlers/ReadInputHandler":100,"./handlers/ReturnHandler":101,"./handlers/StaticCallHandler":102,"./handlers/TypeOfHandler":103}],76:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thread = void 0;
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
    currentInstructionValueAs() {
        var _a;
        return (_a = this.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
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
},{"../library/Understanding":68,"./MethodActivation":72,"./library/RuntimeEmpty":110}],77:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
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
    static clear() {
        Memory.typesByName = new Map();
        Memory.heap = new Map();
    }
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
},{"../../library/BooleanType":56,"../../library/Decoration":57,"../../library/Item":61,"../../library/List":62,"../../library/NumberType":63,"../../library/Place":64,"../../library/Player":65,"../../library/Say":66,"../../library/StringType":67,"../errors/RuntimeError":78,"../library/RuntimeBoolean":106,"../library/RuntimeCommand":107,"../library/RuntimeDecoration":108,"../library/RuntimeEmpty":110,"../library/RuntimeInteger":111,"../library/RuntimeItem":112,"../library/RuntimeList":113,"../library/RuntimePlace":114,"../library/RuntimePlayer":115,"../library/RuntimeSay":116,"../library/RuntimeString":117,"../library/Variable":119}],78:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeError = void 0;
class RuntimeError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.RuntimeError = RuntimeError;
},{}],79:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignVariableHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeString_1 = require("../library/RuntimeString");
const RuntimeError_1 = require("../errors/RuntimeError");
const RuntimeInteger_1 = require("../library/RuntimeInteger");
const OpCode_1 = require("../../common/OpCode");
class AssignVariableHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.Assign;
    }
    handle(thread) {
        this.logInteraction(thread);
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
},{"../../common/OpCode":7,"../OpCodeHandler":73,"../errors/RuntimeError":78,"../library/RuntimeInteger":111,"../library/RuntimeString":117}],80:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchRelativeHandler = void 0;
const OpCode_1 = require("../../common/OpCode");
const OpCodeHandler_1 = require("../OpCodeHandler");
class BranchRelativeHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.BranchRelative;
    }
    handle(thread) {
        var _a;
        const relativeAmount = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        this.logInteraction(thread, relativeAmount);
        thread.jumpToLine(thread.currentMethod.stackFrame.currentInstruction + relativeAmount);
        return super.handle(thread);
    }
}
exports.BranchRelativeHandler = BranchRelativeHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":73}],81:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchRelativeIfFalseHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const OpCode_1 = require("../../common/OpCode");
class BranchRelativeIfFalseHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.BranchRelativeIfFalse;
    }
    handle(thread) {
        var _a;
        const relativeAmount = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const value = thread.currentMethod.pop();
        this.logInteraction(thread, relativeAmount, '//', value);
        if (!value.value) {
            thread.jumpToLine(thread.currentMethod.stackFrame.currentInstruction + relativeAmount);
        }
        return super.handle(thread);
    }
}
exports.BranchRelativeIfFalseHandler = BranchRelativeIfFalseHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":73}],82:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparisonHandler = void 0;
const OpCode_1 = require("../../common/OpCode");
const Memory_1 = require("../common/Memory");
const RuntimeError_1 = require("../errors/RuntimeError");
const RuntimeBoolean_1 = require("../library/RuntimeBoolean");
const RuntimeInteger_1 = require("../library/RuntimeInteger");
const RuntimeString_1 = require("../library/RuntimeString");
const OpCodeHandler_1 = require("../OpCodeHandler");
class ComparisonHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.CompareEqual;
    }
    handle(thread) {
        this.logInteraction(thread);
        var instance = thread.currentMethod.pop();
        var comparand = thread.currentMethod.pop();
        if (instance instanceof RuntimeString_1.RuntimeString && comparand instanceof RuntimeString_1.RuntimeString) {
            var value = Memory_1.Memory.allocateBoolean(instance.value == comparand.value);
            thread.currentMethod.push(value);
        }
        else if (instance instanceof RuntimeInteger_1.RuntimeInteger && comparand instanceof RuntimeInteger_1.RuntimeInteger) {
            var value = Memory_1.Memory.allocateBoolean(instance.value == comparand.value);
            thread.currentMethod.push(value);
        }
        else if (instance instanceof RuntimeBoolean_1.RuntimeBoolean && comparand instanceof RuntimeBoolean_1.RuntimeBoolean) {
            var value = Memory_1.Memory.allocateBoolean(instance.value == comparand.value);
            thread.currentMethod.push(value);
        }
        else {
            throw new RuntimeError_1.RuntimeError(`Encountered type mismatch on stack during comparison: ${instance === null || instance === void 0 ? void 0 : instance.typeName} == ${comparand === null || comparand === void 0 ? void 0 : comparand.typeName}`);
        }
        return super.handle(thread);
    }
}
exports.ComparisonHandler = ComparisonHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":73,"../common/Memory":77,"../errors/RuntimeError":78,"../library/RuntimeBoolean":106,"../library/RuntimeInteger":111,"../library/RuntimeString":117}],83:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcatenateHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const Memory_1 = require("../common/Memory");
const OpCode_1 = require("../../common/OpCode");
class ConcatenateHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.Concatenate;
    }
    handle(thread) {
        const last = thread.currentMethod.pop();
        const first = thread.currentMethod.pop();
        this.logInteraction(thread, first.value, last.value);
        const concatenated = Memory_1.Memory.allocateString(first.value + " " + last.value);
        thread.currentMethod.push(concatenated);
        return super.handle(thread);
    }
}
exports.ConcatenateHandler = ConcatenateHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":73,"../common/Memory":77}],84:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalCallHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const OpCode_1 = require("../../common/OpCode");
class ExternalCallHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.ExternalCall;
    }
    handle(thread) {
        var _a;
        const methodName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const instance = thread.currentMethod.pop();
        const method = this.locateFunction(instance, methodName);
        this.logInteraction(thread, `${instance === null || instance === void 0 ? void 0 : instance.typeName}::${methodName}(...${method.length})`);
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
},{"../../common/OpCode":7,"../OpCodeHandler":73}],85:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoToHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeError_1 = require("../errors/RuntimeError");
const OpCode_1 = require("../../common/OpCode");
class GoToHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.BranchRelative;
    }
    handle(thread) {
        var _a;
        const instructionNumber = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        this.logInteraction(thread, instructionNumber);
        if (typeof instructionNumber === "number") {
            // We need to jump one previous to the desired instruction because after 
            // evaluating this goto we'll move forward (which will move to the desired one).
            thread.jumpToLine(instructionNumber - 1);
        }
        else {
            throw new RuntimeError_1.RuntimeError("Unable to goto");
        }
        return super.handle(thread);
    }
}
exports.GoToHandler = GoToHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":73,"../errors/RuntimeError":78}],86:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleCommandHandler = void 0;
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
const OpCode_1 = require("../../common/OpCode");
class HandleCommandHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor(output) {
        super();
        this.output = output;
        this.code = OpCode_1.OpCode.HandleCommand;
    }
    handle(thread) {
        const command = thread.currentMethod.pop();
        if (!(command instanceof RuntimeCommand_1.RuntimeCommand)) {
            throw new RuntimeError_1.RuntimeError(`Unable to handle a non-command, found '${command}`);
        }
        const action = command.action.value;
        const targetName = command.targetName.value;
        this.logInteraction(thread, `'${action} ${targetName}'`);
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
                list.items = list.items.filter(x => x.typeName.toLowerCase() !== targetName.toLowerCase());
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
                list.items = list.items.filter(x => x.typeName.toLowerCase() !== targetName.toLowerCase());
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
            method.actualParameters = [Variable_1.Variable.forThis(new Type_1.Type(location === null || location === void 0 ? void 0 : location.typeName, location === null || location === void 0 ? void 0 : location.parentTypeName), location)];
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
            const itemOrDecoration = placeContents.items.find(x => x.typeName.toLowerCase() === targetName.toLowerCase());
            if (itemOrDecoration instanceof RuntimeWorldObject_1.RuntimeWorldObject) {
                return itemOrDecoration;
            }
            return lookupInstance((_d = thread.currentPlace) === null || _d === void 0 ? void 0 : _d.typeName);
        }
        else if (meaning === Meaning_1.Meaning.Taking) {
            const list = thread.currentPlace.getContentsField();
            const matchingItems = list.items.filter(x => x.typeName.toLowerCase() === targetName.toLowerCase());
            if (matchingItems.length == 0) {
                return undefined;
            }
            return matchingItems[0];
        }
        else if (meaning === Meaning_1.Meaning.Dropping) {
            const list = thread.currentPlayer.getContentsField();
            const matchingItems = list.items.filter(x => x.typeName.toLowerCase() === targetName.toLowerCase());
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
        describe.actualParameters.unshift(Variable_1.Variable.forThis(new Type_1.Type(target === null || target === void 0 ? void 0 : target.typeName, target === null || target === void 0 ? void 0 : target.parentTypeName), target));
        thread.currentMethod.push(new RuntimeDelegate_1.RuntimeDelegate(describe));
    }
    observe(thread, target) {
        const observe = target.methods.get(WorldObject_1.WorldObject.observe);
        observe.actualParameters.unshift(Variable_1.Variable.forThis(new Type_1.Type(target === null || target === void 0 ? void 0 : target.typeName, target === null || target === void 0 ? void 0 : target.parentTypeName), target));
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
},{"../../common/EventType":3,"../../common/OpCode":7,"../../common/Type":9,"../../library/Player":65,"../../library/Understanding":68,"../../library/WorldObject":69,"../OpCodeHandler":73,"../common/Memory":77,"../errors/RuntimeError":78,"../library/Meaning":104,"../library/RuntimeCommand":107,"../library/RuntimeDelegate":109,"../library/RuntimeItem":112,"../library/RuntimeWorldObject":118,"../library/Variable":119}],87:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceCallHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const Variable_1 = require("../library/Variable");
const Type_1 = require("../../common/Type");
const OpCode_1 = require("../../common/OpCode");
class InstanceCallHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor(methodName) {
        super();
        this.methodName = methodName;
        this.code = OpCode_1.OpCode.InstanceCall;
    }
    handle(thread) {
        var _a;
        const current = thread.currentMethod;
        if (!this.methodName) {
            this.methodName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        }
        const instance = current.pop();
        const method = instance === null || instance === void 0 ? void 0 : instance.methods.get(this.methodName);
        this.logInteraction(thread, `${instance === null || instance === void 0 ? void 0 : instance.typeName}::${this.methodName}(...${method.parameters.length})`);
        const parameterValues = [];
        for (let i = 0; i < method.parameters.length; i++) {
            const parameter = method.parameters[i];
            const instance = current.pop();
            const variable = new Variable_1.Variable(parameter.name, parameter.type, instance);
            parameterValues.push(variable);
        }
        // HACK: We shouldn't create our own type, we should inherently know what it is.
        parameterValues.unshift(Variable_1.Variable.forThis(new Type_1.Type(instance === null || instance === void 0 ? void 0 : instance.typeName, instance === null || instance === void 0 ? void 0 : instance.parentTypeName), instance));
        method.actualParameters = parameterValues;
        thread.activateMethod(method);
        return super.handle(thread);
    }
}
exports.InstanceCallHandler = InstanceCallHandler;
},{"../../common/OpCode":7,"../../common/Type":9,"../OpCodeHandler":73,"../library/Variable":119}],88:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvokeDelegateHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeDelegate_1 = require("../library/RuntimeDelegate");
const RuntimeError_1 = require("../errors/RuntimeError");
const OpCode_1 = require("../../common/OpCode");
class InvokeDelegateHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.InvokeDelegate;
    }
    handle(thread) {
        this.logInteraction(thread);
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
},{"../../common/OpCode":7,"../OpCodeHandler":73,"../errors/RuntimeError":78,"../library/RuntimeDelegate":109}],89:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadFieldHandler = void 0;
const OpCode_1 = require("../../common/OpCode");
const OpCodeHandler_1 = require("../OpCodeHandler");
class LoadFieldHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.LoadField;
    }
    handle(thread) {
        const instance = thread.currentMethod.pop();
        const fieldName = thread.currentInstructionValueAs();
        const field = instance === null || instance === void 0 ? void 0 : instance.fields.get(fieldName);
        const value = field === null || field === void 0 ? void 0 : field.value;
        this.logInteraction(thread, `${instance === null || instance === void 0 ? void 0 : instance.typeName}::${fieldName}`, '//', value);
        thread.currentMethod.push(value);
        return super.handle(thread);
    }
}
exports.LoadFieldHandler = LoadFieldHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":73}],90:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadInstanceHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeError_1 = require("../errors/RuntimeError");
const OpCode_1 = require("../../common/OpCode");
class LoadInstanceHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.LoadInstance;
    }
    handle(thread) {
        var _a;
        const typeName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        this.logInteraction(thread, typeName);
        if (typeName === "~it") {
            const subject = thread.currentPlace;
            thread.currentMethod.push(subject);
        }
        else {
            throw new RuntimeError_1.RuntimeError(`Unable to load instance for unsupported type '${typeName}'`);
        }
        return super.handle(thread);
    }
}
exports.LoadInstanceHandler = LoadInstanceHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":73,"../errors/RuntimeError":78}],91:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadLocalHandler = void 0;
const OpCode_1 = require("../../common/OpCode");
const OpCodeHandler_1 = require("../OpCodeHandler");
class LoadLocalHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.LoadLocal;
    }
    handle(thread) {
        var _a, _b;
        const localName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const parameter = (_b = thread.currentMethod.method) === null || _b === void 0 ? void 0 : _b.actualParameters.find(x => x.name == localName);
        thread.currentMethod.push(parameter === null || parameter === void 0 ? void 0 : parameter.value);
        this.logInteraction(thread, localName, '//', parameter === null || parameter === void 0 ? void 0 : parameter.value);
        return super.handle(thread);
    }
}
exports.LoadLocalHandler = LoadLocalHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":73}],92:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadNumberHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const Memory_1 = require("../common/Memory");
const OpCode_1 = require("../../common/OpCode");
class LoadNumberHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.LoadNumber;
    }
    handle(thread) {
        var _a;
        const value = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const runtimeValue = Memory_1.Memory.allocateNumber(value);
        thread.currentMethod.push(runtimeValue);
        this.logInteraction(thread, value);
        return super.handle(thread);
    }
}
exports.LoadNumberHandler = LoadNumberHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":73,"../common/Memory":77}],93:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadPropertyHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const InstanceCallHandler_1 = require("./InstanceCallHandler");
const LoadThisHandler_1 = require("./LoadThisHandler");
const EvaluationResult_1 = require("../EvaluationResult");
const OpCode_1 = require("../../common/OpCode");
class LoadPropertyHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor(fieldName) {
        super();
        this.fieldName = fieldName;
        this.code = OpCode_1.OpCode.LoadProperty;
    }
    handle(thread) {
        var _a;
        const instance = thread.currentMethod.pop();
        if (!this.fieldName) {
            this.fieldName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        }
        try {
            const field = instance === null || instance === void 0 ? void 0 : instance.fields.get(this.fieldName);
            const value = field === null || field === void 0 ? void 0 : field.value;
            const getField = instance === null || instance === void 0 ? void 0 : instance.methods.get(`~get_${this.fieldName}`);
            this.logInteraction(thread, `${instance === null || instance === void 0 ? void 0 : instance.typeName}::${this.fieldName}`, `{get=${getField != undefined}}`, '//', value);
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
},{"../../common/OpCode":7,"../EvaluationResult":71,"../OpCodeHandler":73,"./InstanceCallHandler":87,"./LoadThisHandler":95}],94:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadStringHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeString_1 = require("../library/RuntimeString");
const RuntimeError_1 = require("../errors/RuntimeError");
const OpCode_1 = require("../../common/OpCode");
class LoadStringHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.LoadString;
    }
    handle(thread) {
        const value = thread.currentInstruction.value;
        this.logInteraction(thread, value);
        if (typeof value === "string") {
            const stringValue = new RuntimeString_1.RuntimeString(value);
            thread.currentMethod.push(stringValue);
        }
        else {
            throw new RuntimeError_1.RuntimeError("Expected a string");
        }
        return super.handle(thread);
    }
}
exports.LoadStringHandler = LoadStringHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":73,"../errors/RuntimeError":78,"../library/RuntimeString":117}],95:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadThisHandler = void 0;
const OpCode_1 = require("../../common/OpCode");
const OpCodeHandler_1 = require("../OpCodeHandler");
class LoadThisHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.LoadThis;
    }
    handle(thread) {
        var _a;
        const instance = (_a = thread.currentMethod.method) === null || _a === void 0 ? void 0 : _a.actualParameters[0].value;
        thread.currentMethod.push(instance);
        this.logInteraction(thread);
        return super.handle(thread);
    }
}
exports.LoadThisHandler = LoadThisHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":73}],96:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewInstanceHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeError_1 = require("../errors/RuntimeError");
const Memory_1 = require("../common/Memory");
const OpCode_1 = require("../../common/OpCode");
class NewInstanceHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.NewInstance;
    }
    handle(thread) {
        var _a;
        const typeName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        this.logInteraction(thread, typeName);
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
},{"../../common/OpCode":7,"../OpCodeHandler":73,"../common/Memory":77,"../errors/RuntimeError":78}],97:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoOpHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const OpCode_1 = require("../../common/OpCode");
class NoOpHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.NoOp;
    }
    handle(thread) {
        this.logInteraction(thread);
        return super.handle(thread);
    }
}
exports.NoOpHandler = NoOpHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":73}],98:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseCommandHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeString_1 = require("../library/RuntimeString");
const RuntimeError_1 = require("../errors/RuntimeError");
const Memory_1 = require("../common/Memory");
const OpCode_1 = require("../../common/OpCode");
class ParseCommandHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.ParseCommand;
    }
    handle(thread) {
        this.logInteraction(thread);
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
},{"../../common/OpCode":7,"../OpCodeHandler":73,"../common/Memory":77,"../errors/RuntimeError":78,"../library/RuntimeString":117}],99:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintHandler = void 0;
const RuntimeString_1 = require("../library/RuntimeString");
const RuntimeError_1 = require("../errors/RuntimeError");
const OpCodeHandler_1 = require("../OpCodeHandler");
const OpCode_1 = require("../../common/OpCode");
class PrintHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor(output) {
        super();
        this.code = OpCode_1.OpCode.Print;
        this.output = output;
    }
    handle(thread) {
        const text = thread.currentMethod.pop();
        this.logInteraction(thread);
        if (text instanceof RuntimeString_1.RuntimeString) {
            this.output.write(text.value);
        }
        else {
            throw new RuntimeError_1.RuntimeError("Unable to print, encountered a type on the stack other than string");
        }
        return super.handle(thread);
    }
}
exports.PrintHandler = PrintHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":73,"../errors/RuntimeError":78,"../library/RuntimeString":117}],100:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadInputHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const EvaluationResult_1 = require("../EvaluationResult");
const OpCode_1 = require("../../common/OpCode");
class ReadInputHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.ReadInput;
    }
    handle(thread) {
        this.logInteraction(thread);
        return EvaluationResult_1.EvaluationResult.SuspendForInput;
    }
}
exports.ReadInputHandler = ReadInputHandler;
},{"../../common/OpCode":7,"../EvaluationResult":71,"../OpCodeHandler":73}],101:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const EvaluationResult_1 = require("../EvaluationResult");
const RuntimeEmpty_1 = require("../library/RuntimeEmpty");
const RuntimeError_1 = require("../errors/RuntimeError");
const OpCode_1 = require("../../common/OpCode");
class ReturnHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.Return;
    }
    handle(thread) {
        // TODO: Handle returning top value on stack based on return type of method.
        var _a, _b, _c;
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
            this.logInteraction(thread, returnValue);
            thread === null || thread === void 0 ? void 0 : thread.currentMethod.push(returnValue);
        }
        else {
            this.logInteraction(thread, 'void');
        }
        return EvaluationResult_1.EvaluationResult.Continue;
    }
}
exports.ReturnHandler = ReturnHandler;
},{"../../common/OpCode":7,"../EvaluationResult":71,"../OpCodeHandler":73,"../errors/RuntimeError":78,"../library/RuntimeEmpty":110}],102:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticCallHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const OpCode_1 = require("../../common/OpCode");
class StaticCallHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.StaticCall;
    }
    handle(thread) {
        var _a;
        const callText = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const pieces = callText.split(".");
        const typeName = pieces[0];
        const methodName = pieces[1];
        const type = thread.knownTypes.get(typeName);
        const method = type === null || type === void 0 ? void 0 : type.methods.find(x => x.name === methodName);
        this.logInteraction(thread, `${typeName}::${methodName}()`);
        thread.activateMethod(method);
        return super.handle(thread);
    }
}
exports.StaticCallHandler = StaticCallHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":73}],103:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOfHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const Memory_1 = require("../common/Memory");
const OpCode_1 = require("../../common/OpCode");
class TypeOfHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.TypeOf;
    }
    handle(thread) {
        var _a;
        const typeName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        this.logInteraction(thread, typeName);
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
},{"../../common/OpCode":7,"../OpCodeHandler":73,"../common/Memory":77}],104:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meaning = void 0;
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
},{}],105:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeAny = void 0;
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
},{"../../library/Any":55}],106:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeBoolean = void 0;
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
},{"./RuntimeAny":105}],107:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeCommand = void 0;
const RuntimeAny_1 = require("./RuntimeAny");
class RuntimeCommand extends RuntimeAny_1.RuntimeAny {
    constructor(targetName, action) {
        super();
        this.targetName = targetName;
        this.action = action;
    }
}
exports.RuntimeCommand = RuntimeCommand;
},{"./RuntimeAny":105}],108:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeDecoration = void 0;
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
},{"../../library/Decoration":57,"./RuntimeWorldObject":118}],109:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeDelegate = void 0;
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
},{"../../library/Any":55,"../../library/Delegate":58,"./RuntimeAny":105}],110:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeEmpty = void 0;
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
},{"../../library/Any":55,"./RuntimeAny":105}],111:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeInteger = void 0;
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
},{"./RuntimeAny":105}],112:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeItem = void 0;
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
},{"../../library/Item":61,"../../library/WorldObject":69,"./RuntimeWorldObject":118}],113:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeList = void 0;
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
},{"../../common/Instruction":5,"../../common/Method":6,"../../common/Parameter":8,"../../library/BooleanType":56,"../../library/List":62,"../../library/NumberType":63,"../../library/StringType":67,"../common/Memory":77,"./RuntimeAny":105}],114:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimePlace = void 0;
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
},{"../../library/Place":64,"../../library/WorldObject":69,"./RuntimeWorldObject":118}],115:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimePlayer = void 0;
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
},{"../../library/Player":65,"./RuntimeWorldObject":118}],116:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeSay = void 0;
const RuntimeAny_1 = require("./RuntimeAny");
class RuntimeSay extends RuntimeAny_1.RuntimeAny {
    constructor() {
        super(...arguments);
        this.message = "";
    }
}
exports.RuntimeSay = RuntimeSay;
},{"./RuntimeAny":105}],117:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeString = void 0;
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
},{"../../library/Any":55,"./RuntimeAny":105}],118:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeWorldObject = void 0;
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
},{"../../common/Field":4,"../../common/Type":9,"../../library/Any":55,"../../library/List":62,"../../library/StringType":67,"../../library/WorldObject":69,"../errors/RuntimeError":78,"./RuntimeAny":105}],119:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = void 0;
class Variable {
    constructor(name, type, value) {
        this.name = name;
        this.type = type;
        this.value = value;
    }
    static forThis(type, value) {
        return new Variable(Variable.thisTypeName, type, value);
    }
}
exports.Variable = Variable;
Variable.thisTypeName = "~this";
},{}]},{},[70])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL25vcmhhL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInRhbG9uL1BhbmVPdXRwdXQudHMiLCJ0YWxvbi9UYWxvbklkZS50cyIsInRhbG9uL2NvbW1vbi9FdmVudFR5cGUudHMiLCJ0YWxvbi9jb21tb24vRmllbGQudHMiLCJ0YWxvbi9jb21tb24vSW5zdHJ1Y3Rpb24udHMiLCJ0YWxvbi9jb21tb24vTWV0aG9kLnRzIiwidGFsb24vY29tbW9uL09wQ29kZS50cyIsInRhbG9uL2NvbW1vbi9QYXJhbWV0ZXIudHMiLCJ0YWxvbi9jb21tb24vVHlwZS50cyIsInRhbG9uL2NvbW1vbi9WZXJzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvVGFsb25Db21waWxlci50cyIsInRhbG9uL2NvbXBpbGVyL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvci50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9LZXl3b3Jkcy50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9QdW5jdHVhdGlvbi50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9UYWxvbkxleGVyLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1Rva2VuLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1Rva2VuVHlwZS50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvUGFyc2VDb250ZXh0LnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9UYWxvblBhcnNlci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvQWN0aW9uc0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0JpbmFyeUV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0NvbXBhcmlzb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Db25jYXRlbmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29udGFpbnNFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvSWRlbnRpZmllckV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0lmRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvTGlzdEV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0xpdGVyYWxFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Qcm9ncmFtRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2F5RXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2V0VmFyaWFibGVFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9XaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9CbG9ja0V4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9Db21wYXJpc29uRXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL0V2ZW50RXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL0V4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9GaWVsZERlY2xhcmF0aW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvSWZFeHByZXNzaW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvUHJvZ3JhbVZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1NheUV4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9UeXBlRGVjbGFyYXRpb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9XaGVuRGVjbGFyYXRpb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvc2VtYW50aWNzL1RhbG9uU2VtYW50aWNBbmFseXplci50cyIsInRhbG9uL2NvbXBpbGVyL3RyYW5zZm9ybWluZy9FeHByZXNzaW9uVHJhbnNmb3JtYXRpb25Nb2RlLnRzIiwidGFsb24vY29tcGlsZXIvdHJhbnNmb3JtaW5nL1RhbG9uVHJhbnNmb3JtZXIudHMiLCJ0YWxvbi9pZGUvQW5hbHlzaXNDb29yZGluYXRvci50cyIsInRhbG9uL2lkZS9DYXJldFBvc2l0aW9uLnRzIiwidGFsb24vaWRlL2FuYWx5emVycy9Db2RlUGFuZUFuYWx5emVyLnRzIiwidGFsb24vbGlicmFyeS9BbnkudHMiLCJ0YWxvbi9saWJyYXJ5L0Jvb2xlYW5UeXBlLnRzIiwidGFsb24vbGlicmFyeS9EZWNvcmF0aW9uLnRzIiwidGFsb24vbGlicmFyeS9EZWxlZ2F0ZS50cyIsInRhbG9uL2xpYnJhcnkvRW50cnlQb2ludEF0dHJpYnV0ZS50cyIsInRhbG9uL2xpYnJhcnkvRXh0ZXJuQ2FsbC50cyIsInRhbG9uL2xpYnJhcnkvSXRlbS50cyIsInRhbG9uL2xpYnJhcnkvTGlzdC50cyIsInRhbG9uL2xpYnJhcnkvTnVtYmVyVHlwZS50cyIsInRhbG9uL2xpYnJhcnkvUGxhY2UudHMiLCJ0YWxvbi9saWJyYXJ5L1BsYXllci50cyIsInRhbG9uL2xpYnJhcnkvU2F5LnRzIiwidGFsb24vbGlicmFyeS9TdHJpbmdUeXBlLnRzIiwidGFsb24vbGlicmFyeS9VbmRlcnN0YW5kaW5nLnRzIiwidGFsb24vbGlicmFyeS9Xb3JsZE9iamVjdC50cyIsInRhbG9uL21haW4udHMiLCJ0YWxvbi9ydW50aW1lL0V2YWx1YXRpb25SZXN1bHQudHMiLCJ0YWxvbi9ydW50aW1lL01ldGhvZEFjdGl2YXRpb24udHMiLCJ0YWxvbi9ydW50aW1lL09wQ29kZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL1N0YWNrRnJhbWUudHMiLCJ0YWxvbi9ydW50aW1lL1RhbG9uUnVudGltZS50cyIsInRhbG9uL3J1bnRpbWUvVGhyZWFkLnRzIiwidGFsb24vcnVudGltZS9jb21tb24vTWVtb3J5LnRzIiwidGFsb24vcnVudGltZS9lcnJvcnMvUnVudGltZUVycm9yLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Bc3NpZ25WYXJpYWJsZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0JyYW5jaFJlbGF0aXZlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvQ29tcGFyaXNvbkhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0NvbmNhdGVuYXRlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvRXh0ZXJuYWxDYWxsSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvR29Ub0hhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0hhbmRsZUNvbW1hbmRIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9JbnN0YW5jZUNhbGxIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9JbnZva2VEZWxlZ2F0ZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRGaWVsZEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRJbnN0YW5jZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRMb2NhbEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWROdW1iZXJIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkUHJvcGVydHlIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkU3RyaW5nSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZFRoaXNIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9OZXdJbnN0YW5jZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL05vT3BIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9QYXJzZUNvbW1hbmRIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9QcmludEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1JlYWRJbnB1dEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1JldHVybkhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1N0YXRpY0NhbGxIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9UeXBlT2ZIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L01lYW5pbmcudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUFueS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lQm9vbGVhbi50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lQ29tbWFuZC50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lRGVjb3JhdGlvbi50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lRGVsZWdhdGUudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUVtcHR5LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVJbnRlZ2VyLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVJdGVtLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVMaXN0LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVQbGFjZS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lUGxheWVyLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVTYXkudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVN0cmluZy50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lV29ybGRPYmplY3QudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvVmFyaWFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNHQSxNQUFhLFVBQVU7SUFDbkIsWUFBb0IsSUFBbUI7UUFBbkIsU0FBSSxHQUFKLElBQUksQ0FBZTtJQUV2QyxDQUFDO0lBRUQsS0FBSztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lB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Q0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0NBQ0o7QUE1Q0QsZ0RBNENDOzs7OztBQ3JERCxNQUFhLFFBQVE7SUFJakIsWUFBNEIsSUFBVyxFQUNYLElBQVMsRUFDbEIsS0FBaUI7UUFGUixTQUFJLEdBQUosSUFBSSxDQUFPO1FBQ1gsU0FBSSxHQUFKLElBQUksQ0FBSztRQUNsQixVQUFLLEdBQUwsS0FBSyxDQUFZO0lBQ3BDLENBQUM7SUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLElBQVMsRUFBRSxLQUFpQjtRQUN2QyxPQUFPLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVELENBQUM7O0FBWEwsNEJBWUM7QUFWMkIscUJBQVksR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4vcnVudGltZS9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IElMb2dPdXRwdXQgfSBmcm9tIFwiLi9ydW50aW1lL0lMb2dPdXRwdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYW5lT3V0cHV0IGltcGxlbWVudHMgSU91dHB1dCwgSUxvZ091dHB1dHtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFuZTpIVE1MRGl2RWxlbWVudCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyKCl7XHJcbiAgICAgICAgdGhpcy5wYW5lLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZGVidWcobGluZTogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmIChsaW5lLnN0YXJ0c1dpdGgoJy4nKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gbGluZS5zcGxpdCgnICcpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcGFydHNbMF0gPSBgPHN0cm9uZz4ke3BhcnRzWzBdfTwvc3Ryb25nPmA7XHJcblxyXG4gICAgICAgICAgICBsaW5lID0gcGFydHMuam9pbignICcpO1xyXG4gICAgICAgIH0gXHJcblxyXG4gICAgICAgIHRoaXMucGFuZS5pbm5lckhUTUwgKz0gbGluZSArIFwiPGJyIC8+XCI7XHJcbiAgICAgICAgdGhpcy5wYW5lLnNjcm9sbFRvKDAsIHRoaXMucGFuZS5zY3JvbGxIZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHdyaXRlKGxpbmU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucGFuZS5pbm5lckhUTUwgKz0gbGluZSArIFwiPGJyIC8+XCI7XHJcbiAgICAgICAgdGhpcy5wYW5lLnNjcm9sbFRvKDAsIHRoaXMucGFuZS5zY3JvbGxIZWlnaHQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVGFsb25Db21waWxlciB9IGZyb20gXCIuL2NvbXBpbGVyL1RhbG9uQ29tcGlsZXJcIjtcclxuXHJcbmltcG9ydCB7IFBhbmVPdXRwdXQgfSBmcm9tIFwiLi9QYW5lT3V0cHV0XCI7XHJcblxyXG5pbXBvcnQgeyBUYWxvblJ1bnRpbWUgfSBmcm9tIFwiLi9ydW50aW1lL1RhbG9uUnVudGltZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgQW5hbHlzaXNDb29yZGluYXRvciB9IGZyb20gXCIuL2lkZS9BbmFseXNpc0Nvb3JkaW5hdG9yXCI7XHJcbmltcG9ydCB7IENvZGVQYW5lQW5hbHl6ZXIgfSBmcm9tIFwiLi9pZGUvYW5hbHl6ZXJzL0NvZGVQYW5lQW5hbHl6ZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvbklkZXtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29kZVBhbmU6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGdhbWVQYW5lOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21waWxhdGlvbk91dHB1dDpIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZ2FtZUxvZ091dHB1dDpIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZXhhbXBsZTFCdXR0b246SFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBpbGVCdXR0b246SFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHN0YXJ0TmV3R2FtZUJ1dHRvbjpIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgdXNlckNvbW1hbmRUZXh0OkhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNlbmRVc2VyQ29tbWFuZEJ1dHRvbjpIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2FyZXRQb3NpdGlvbjpIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBpbGF0aW9uT3V0cHV0UGFuZTpQYW5lT3V0cHV0O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBydW50aW1lT3V0cHV0UGFuZTpQYW5lT3V0cHV0O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBydW50aW1lTG9nT3V0cHV0UGFuZTpQYW5lT3V0cHV0O1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29kZVBhbmVBbmFseXplcjpDb2RlUGFuZUFuYWx5emVyO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhbmFseXNpc0Nvb3JkaW5hdG9yOkFuYWx5c2lzQ29vcmRpbmF0b3I7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21waWxlcjpUYWxvbkNvbXBpbGVyO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBydW50aW1lOlRhbG9uUnVudGltZTtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBjb21waWxlZFR5cGVzOlR5cGVbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldEJ5SWQ8VCBleHRlbmRzIEhUTUxFbGVtZW50PihuYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIDxUPmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb2RlUGFuZSA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTERpdkVsZW1lbnQ+KFwiY29kZS1wYW5lXCIpITtcclxuICAgICAgICB0aGlzLmdhbWVQYW5lID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MRGl2RWxlbWVudD4oXCJnYW1lLXBhbmVcIikhO1xyXG4gICAgICAgIHRoaXMuY29tcGlsYXRpb25PdXRwdXQgPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxEaXZFbGVtZW50PihcImNvbXBpbGF0aW9uLW91dHB1dFwiKSE7XHJcbiAgICAgICAgdGhpcy5nYW1lTG9nT3V0cHV0ID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MRGl2RWxlbWVudD4oXCJsb2ctcGFuZVwiKSE7XHJcbiAgICAgICAgdGhpcy5leGFtcGxlMUJ1dHRvbiA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiZXhhbXBsZTFcIikhO1xyXG4gICAgICAgIHRoaXMuY29tcGlsZUJ1dHRvbiA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiY29tcGlsZVwiKSE7XHJcbiAgICAgICAgdGhpcy5zdGFydE5ld0dhbWVCdXR0b24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxCdXR0b25FbGVtZW50PihcInN0YXJ0LW5ldy1nYW1lXCIpITtcclxuICAgICAgICB0aGlzLnVzZXJDb21tYW5kVGV4dCA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTElucHV0RWxlbWVudD4oXCJ1c2VyLWNvbW1hbmQtdGV4dFwiKSE7XHJcbiAgICAgICAgdGhpcy5zZW5kVXNlckNvbW1hbmRCdXR0b24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxCdXR0b25FbGVtZW50PihcInNlbmQtdXNlci1jb21tYW5kXCIpO1xyXG4gICAgICAgIHRoaXMuY2FyZXRQb3NpdGlvbiA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTERpdkVsZW1lbnQ+KFwiY2FyZXQtcG9zaXRpb25cIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5leGFtcGxlMUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4gdGhpcy5sb2FkRXhhbXBsZSgpKTtcclxuICAgICAgICB0aGlzLmNvbXBpbGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHRoaXMuY29tcGlsZSgpKTtcclxuICAgICAgICB0aGlzLnN0YXJ0TmV3R2FtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4gdGhpcy5zdGFydE5ld0dhbWUoKSk7XHJcbiAgICAgICAgdGhpcy5zZW5kVXNlckNvbW1hbmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHRoaXMuc2VuZFVzZXJDb21tYW5kKCkpO1xyXG4gICAgICAgIHRoaXMudXNlckNvbW1hbmRUZXh0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gXCJFbnRlclwiKSB7IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kVXNlckNvbW1hbmQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBpbGF0aW9uT3V0cHV0UGFuZSA9IG5ldyBQYW5lT3V0cHV0KHRoaXMuY29tcGlsYXRpb25PdXRwdXQpO1xyXG4gICAgICAgIHRoaXMucnVudGltZU91dHB1dFBhbmUgPSBuZXcgUGFuZU91dHB1dCh0aGlzLmdhbWVQYW5lKTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWVMb2dPdXRwdXRQYW5lID0gbmV3IFBhbmVPdXRwdXQodGhpcy5nYW1lTG9nT3V0cHV0KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2RlUGFuZUFuYWx5emVyID0gbmV3IENvZGVQYW5lQW5hbHl6ZXIodGhpcy5jb2RlUGFuZSk7XHJcbiAgICAgICAgdGhpcy5hbmFseXNpc0Nvb3JkaW5hdG9yID0gbmV3IEFuYWx5c2lzQ29vcmRpbmF0b3IodGhpcy5jb2RlUGFuZUFuYWx5emVyLCB0aGlzLmNhcmV0UG9zaXRpb24pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBpbGVyID0gbmV3IFRhbG9uQ29tcGlsZXIodGhpcy5jb21waWxhdGlvbk91dHB1dFBhbmUpO1xyXG4gICAgICAgIHRoaXMucnVudGltZSA9IG5ldyBUYWxvblJ1bnRpbWUodGhpcy5ydW50aW1lT3V0cHV0UGFuZSwgdGhpcy5ydW50aW1lTG9nT3V0cHV0UGFuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZW5kVXNlckNvbW1hbmQoKXtcclxuICAgICAgICBjb25zdCBjb21tYW5kID0gdGhpcy51c2VyQ29tbWFuZFRleHQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5ydW50aW1lLnNlbmRDb21tYW5kKGNvbW1hbmQpO1xyXG5cclxuICAgICAgICB0aGlzLnVzZXJDb21tYW5kVGV4dC52YWx1ZSA9IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb21waWxlKCl7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IHRoaXMuY29kZVBhbmUuaW5uZXJUZXh0O1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBpbGF0aW9uT3V0cHV0UGFuZS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuY29tcGlsZWRUeXBlcyA9IHRoaXMuY29tcGlsZXIuY29tcGlsZShjb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXJ0TmV3R2FtZSgpe1xyXG4gICAgICAgIHRoaXMucnVudGltZU91dHB1dFBhbmUuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWVMb2dPdXRwdXRQYW5lLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJ1bnRpbWUubG9hZEZyb20odGhpcy5jb21waWxlZFR5cGVzKSl7XHJcbiAgICAgICAgICAgIHRoaXMucnVudGltZS5zdGFydCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWRFeGFtcGxlKCl7XHJcbiAgICAgICAgICAgIHRoaXMuY29kZVBhbmUuaW5uZXJUZXh0ID0gXHJcbiAgICAgICAgICAgICAgICBcInNheSBcXFwiVGhpcyBpcyB0aGUgc3RhcnQuXFxcIi5cXG5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFwidW5kZXJzdGFuZCBcXFwibG9va1xcXCIgYXMgZGVzY3JpYmluZy4gXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJ1bmRlcnN0YW5kIFxcXCJub3J0aFxcXCIgYXMgZGlyZWN0aW9ucy4gXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJ1bmRlcnN0YW5kIFxcXCJzb3V0aFxcXCIgYXMgZGlyZWN0aW9ucy5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcImdvXFxcIiBhcyBtb3ZpbmcuIFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwidW5kZXJzdGFuZCBcXFwidGFrZVxcXCIgYXMgdGFraW5nLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcImludlxcXCIgYXMgaW52ZW50b3J5LiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcImRyb3BcXFwiIGFzIGRyb3BwaW5nLiBcXG5cXG5cIiArXHJcblxyXG4gICAgICAgICAgICAgICAgXCJhbiBJbm4gaXMgYSBraW5kIG9mIHBsYWNlLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGlzIHdoZXJlIHRoZSBwbGF5ZXIgc3RhcnRzLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGlzIGRlc2NyaWJlZCBhcyBcXFwiVGhlIGlubiBpcyBhIGNvenkgcGxhY2UsIHdpdGggYSBjcmFja2xpbmcgZmlyZSBvbiB0aGUgaGVhcnRoLiBUaGUgYmFydGVuZGVyIGlzIGJlaGluZCB0aGUgYmFyLiBBbiBvcGVuIGRvb3IgdG8gdGhlIG5vcnRoIGxlYWRzIG91dHNpZGUuXFxcIiBhbmQgaWYgaXQgY29udGFpbnMgMSBDb2luIHRoZW4gXFxcIlRoZXJlJ3MgYWxzbyBhIGNvaW4gaGVyZS5cXFwiOyBvciBlbHNlIFxcXCJUaGVyZSBpcyBqdXN0IGR1c3QuXFxcIjsgYW5kIHRoZW4gY29udGludWUuXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJpdCBjb250YWlucyAxIENvaW4sIDEgRmlyZXBsYWNlLlxcblwiICsgXHJcbiAgICAgICAgICAgICAgICBcIml0IGNhbiByZWFjaCB0aGUgV2Fsa3dheSBieSBnb2luZyBcXFwibm9ydGhcXFwiLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGhhcyBhIHZhbHVlIHRoYXQgaXMgMS4gXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJ3aGVuIHRoZSBwbGF5ZXIgZXhpdHM6IFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwiaWYgdmFsdWUgaXMgMSB0aGVuIHNheSBcXFwiVGhlIGJhcnRlbmRlciB3YXZlcyBnb29kYnllLlxcXCI7IG9yIGVsc2Ugc2F5IFxcXCJUaGUgYmFydGVuZGVyIGNsZWFucyB0aGUgYmFyLlxcXCI7IGFuZCB0aGVuIGNvbnRpbnVlO1xcblwiICtcclxuICAgICAgICAgICAgICAgIFwic2V0IHZhbHVlIHRvIDI7IFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwiYW5kIHRoZW4gc3RvcC4gXFxuXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcImEgRmlyZXBsYWNlIGlzIGEga2luZCBvZiBkZWNvcmF0aW9uLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGlzIGRlc2NyaWJlZCBhcyBcXFwiVGhlIGZpcmVwbGFjZSBjcmFja2xlcy4gSXQncyBmdWxsIG9mIGZpcmUuXFxcIi4gXFxuXFxuXCIgK1xyXG5cclxuICAgICAgICAgICAgICAgIFwiYSBXYWxrd2F5IGlzIGEga2luZCBvZiBwbGFjZS4gXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJpdCBpcyBkZXNjcmliZWQgYXMgXFxcIlRoZSB3YWxrd2F5IGluIGZyb250IG9mIHRoZSBpbm4gaXMgZW1wdHksIGp1c3QgYSBjb2JibGVzdG9uZSBlbnRyYW5jZS4gVGhlIGlubiBpcyB0byB0aGUgc291dGguXFxcIi4gXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJpdCBjYW4gcmVhY2ggdGhlIElubiBieSBnb2luZyBcXFwic291dGhcXFwiLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIndoZW4gdGhlIHBsYXllciBlbnRlcnM6XFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJzYXkgXFxcIllvdSB3YWxrIG9udG8gdGhlIGNvYmJsZXN0b25lcy4gVGhleSdyZSBuaWNlLCBpZiB5b3UgbGlrZSB0aGF0IHNvcnQgb2YgdGhpbmcuXFxcIjsgXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJzYXkgXFxcIlRoZXJlJ3Mgbm9ib2R5IGFyb3VuZC4gVGhlIHdpbmQgd2hpc3RsZXMgYSBsaXR0bGUgYml0LlxcXCI7IFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwiYW5kIHRoZW4gc3RvcC4gXFxuXFxuXCIgK1xyXG5cclxuICAgICAgICAgICAgICAgIFwic2F5IFxcXCJUaGlzIGlzIHRoZSBtaWRkbGUuXFxcIi5cXG5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFwiYSBDb2luIGlzIGEga2luZCBvZiBpdGVtLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGlzIGRlc2NyaWJlZCBhcyBcXFwiSXQncyBhIHNtYWxsIGNvaW4uXFxcIi5cXG5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFwic2F5IFxcXCJUaGlzIGlzIHRoZSBlbmQuXFxcIi5cXG5cIjtcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIEV2ZW50VHlwZXtcclxuICAgIE5vbmUsXHJcbiAgICBQbGF5ZXJFbnRlcnNQbGFjZSxcclxuICAgIFBsYXllckV4aXRzUGxhY2VcclxufSIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi9UeXBlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpZWxke1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgdHlwZU5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHR5cGU/OlR5cGU7XHJcbiAgICBkZWZhdWx0VmFsdWU/Ok9iamVjdDtcclxufSIsImltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydWN0aW9ue1xyXG4gICAgc3RhdGljIGFzc2lnbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkFzc2lnbik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbXBhcmVFcXVhbCgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkNvbXBhcmVFcXVhbCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBpbnZva2VEZWxlZ2F0ZSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkludm9rZURlbGVnYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaXNUeXBlT2YodHlwZU5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5UeXBlT2YsIHR5cGVOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZE51bWJlcih2YWx1ZTpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWROdW1iZXIsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZFN0cmluZyh2YWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRTdHJpbmcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZEluc3RhbmNlKHR5cGVOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZEluc3RhbmNlLCB0eXBlTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRGaWVsZChmaWVsZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkRmllbGQsIGZpZWxkTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRQcm9wZXJ0eShmaWVsZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkUHJvcGVydHksIGZpZWxkTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRMb2NhbChsb2NhbE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkTG9jYWwsIGxvY2FsTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRUaGlzKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZFRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbnN0YW5jZUNhbGwobWV0aG9kTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkluc3RhbmNlQ2FsbCwgbWV0aG9kTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbmNhdGVuYXRlKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuQ29uY2F0ZW5hdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzdGF0aWNDYWxsKHR5cGVOYW1lOnN0cmluZywgbWV0aG9kTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLlN0YXRpY0NhbGwsIGAke3R5cGVOYW1lfS4ke21ldGhvZE5hbWV9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGV4dGVybmFsQ2FsbChtZXRob2ROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuRXh0ZXJuYWxDYWxsLCBtZXRob2ROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcHJpbnQoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5QcmludCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJldHVybigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLlJldHVybik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJlYWRJbnB1dCgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLlJlYWRJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHBhcnNlQ29tbWFuZCgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLlBhcnNlQ29tbWFuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGhhbmRsZUNvbW1hbmQoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5IYW5kbGVDb21tYW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ29UbyhsaW5lTnVtYmVyOm51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuR29UbywgbGluZU51bWJlcik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGJyYW5jaFJlbGF0aXZlKGNvdW50Om51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuQnJhbmNoUmVsYXRpdmUsIGNvdW50KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYnJhbmNoUmVsYXRpdmVJZkZhbHNlKGNvdW50Om51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuQnJhbmNoUmVsYXRpdmVJZkZhbHNlLCBjb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgb3BDb2RlOk9wQ29kZSA9IE9wQ29kZS5Ob09wO1xyXG4gICAgdmFsdWU/Ok9iamVjdDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvcENvZGU6T3BDb2RlLCB2YWx1ZT86T2JqZWN0KXtcclxuICAgICAgICB0aGlzLm9wQ29kZSA9IG9wQ29kZTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBQYXJhbWV0ZXIgfSBmcm9tIFwiLi9QYXJhbWV0ZXJcIjtcclxuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tIFwiLi9JbnN0cnVjdGlvblwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9ydW50aW1lL2xpYnJhcnkvVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgRXZlbnRUeXBlIH0gZnJvbSBcIi4vRXZlbnRUeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWV0aG9ke1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgcGFyYW1ldGVyczpQYXJhbWV0ZXJbXSA9IFtdO1xyXG4gICAgYWN0dWFsUGFyYW1ldGVyczpWYXJpYWJsZVtdID0gW107XHJcbiAgICBib2R5Okluc3RydWN0aW9uW10gPSBbXTtcclxuICAgIHJldHVyblR5cGU6c3RyaW5nID0gXCJcIjtcclxuICAgIGV2ZW50VHlwZTpFdmVudFR5cGUgPSBFdmVudFR5cGUuTm9uZTtcclxufSIsImV4cG9ydCBlbnVtIE9wQ29kZSB7XHJcbiAgICBOb09wID0gJy5ub29wJyxcclxuICAgIEFzc2lnbiA9ICcuc2V0LnZhcicsXHJcbiAgICBDb21wYXJlRXF1YWwgPSBcIi5jb21wYXJlLmVxXCIsXHJcbiAgICBQcmludCA9ICcucHJpbnQnLFxyXG4gICAgTG9hZFN0cmluZyA9ICcubG9hZC5zdHInLFxyXG4gICAgTmV3SW5zdGFuY2UgPSAnLm5ldycsXHJcbiAgICBQYXJzZUNvbW1hbmQgPSAnLnBhcnNlLmNtZCcsXHJcbiAgICBIYW5kbGVDb21tYW5kID0gJy5oYW5kbGUuY21kJyxcclxuICAgIFJlYWRJbnB1dCA9ICcucmVhZC5pbicsXHJcbiAgICBHb1RvID0gJy5icicsXHJcbiAgICBSZXR1cm4gPSAnLnJldCcsXHJcbiAgICBCcmFuY2hSZWxhdGl2ZSA9ICcuYnIucmVsJyxcclxuICAgIEJyYW5jaFJlbGF0aXZlSWZGYWxzZSA9ICcuYnIucmVsLmZhbHNlJyxcclxuICAgIENvbmNhdGVuYXRlID0gJy5jb25jYXQnLFxyXG4gICAgTG9hZE51bWJlciA9ICcubG9hZC5udW0nLFxyXG4gICAgTG9hZEZpZWxkID0gJy5sb2FkLmZsZCcsXHJcbiAgICBMb2FkUHJvcGVydHkgPSAnLmxvYWQucHJvcCcsXHJcbiAgICBMb2FkSW5zdGFuY2UgPSAnLmxvYWQuaW5zdCcsXHJcbiAgICBMb2FkTG9jYWwgPSAnLmxvYWQubG9jJyxcclxuICAgIExvYWRUaGlzID0gJy5sb2FkLnRoaXMnLFxyXG4gICAgSW5zdGFuY2VDYWxsID0gJy5jYWxsLmluc3QnLFxyXG4gICAgU3RhdGljQ2FsbCA9ICcuY2FsbC5zdGF0aWMnLFxyXG4gICAgRXh0ZXJuYWxDYWxsID0gJy5jYWxsLmV4dGVybicsXHJcbiAgICBUeXBlT2YgPSAnLnR5cGVvZicsXHJcbiAgICBJbnZva2VEZWxlZ2F0ZSA9ICcuY2FsbC5mdW5jJ1xyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuL1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJhbWV0ZXJ7XHJcbiAgICBcclxuICAgIHR5cGU/OlR5cGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG5hbWU6c3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHR5cGVOYW1lOnN0cmluZyl7XHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi9NZXRob2RcIjtcclxuaW1wb3J0IHsgQXR0cmlidXRlIH0gZnJvbSBcIi4vQXR0cmlidXRlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHlwZXsgICAgICBcclxuICAgIGZpZWxkczpGaWVsZFtdID0gW107XHJcbiAgICBtZXRob2RzOk1ldGhvZFtdID0gW107IFxyXG4gICAgYXR0cmlidXRlczpBdHRyaWJ1dGVbXSA9IFtdO1xyXG5cclxuICAgIGdldCBpc1N5c3RlbVR5cGUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5uYW1lLnN0YXJ0c1dpdGgoXCJ+XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0Fub255bW91c1R5cGUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5uYW1lLnN0YXJ0c1dpdGgoXCI8fj5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6c3RyaW5nLCBwdWJsaWMgYmFzZVR5cGVOYW1lOnN0cmluZyl7XHJcblxyXG4gICAgfSAgICBcclxufSIsImV4cG9ydCBjbGFzcyBWZXJzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG1ham9yOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBtaW5vcjpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgcGF0Y2g6bnVtYmVyKXtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLm1ham9yfS4ke3RoaXMubWlub3J9LiR7dGhpcy5wYXRjaH1gO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tIFwiLi4vY29tbW9uL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IEVudHJ5UG9pbnRBdHRyaWJ1dGUgfSBmcm9tIFwiLi4vbGlicmFyeS9FbnRyeVBvaW50QXR0cmlidXRlXCI7XHJcbmltcG9ydCB7IFRhbG9uTGV4ZXIgfSBmcm9tIFwiLi9sZXhpbmcvVGFsb25MZXhlclwiO1xyXG5pbXBvcnQgeyBUYWxvblBhcnNlciB9IGZyb20gXCIuL3BhcnNpbmcvVGFsb25QYXJzZXJcIjtcclxuaW1wb3J0IHsgVGFsb25TZW1hbnRpY0FuYWx5emVyIH0gZnJvbSBcIi4vc2VtYW50aWNzL1RhbG9uU2VtYW50aWNBbmFseXplclwiO1xyXG5pbXBvcnQgeyBUYWxvblRyYW5zZm9ybWVyIH0gZnJvbSBcIi4vdHJhbnNmb3JtaW5nL1RhbG9uVHJhbnNmb3JtZXJcIjtcclxuaW1wb3J0IHsgVmVyc2lvbiB9IGZyb20gXCIuLi9jb21tb24vVmVyc2lvblwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uL3J1bnRpbWUvSU91dHB1dFwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IERlbGVnYXRlIH0gZnJvbSBcIi4uL2xpYnJhcnkvRGVsZWdhdGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvbkNvbXBpbGVye1xyXG4gICAgZ2V0IGxhbmd1YWdlVmVyc2lvbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVyc2lvbigxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmVyc2lvbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVyc2lvbigxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuICAgIH1cclxuXHJcbiAgICBjb21waWxlKGNvZGU6c3RyaW5nKTpUeXBlW117XHJcbiAgICAgICAgdGhpcy5vdXQud3JpdGUoXCI8c3Ryb25nPlN0YXJ0aW5nIGNvbXBpbGF0aW9uLi4uPC9zdHJvbmc+XCIpO1xyXG5cclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIGNvbnN0IGxleGVyID0gbmV3IFRhbG9uTGV4ZXIodGhpcy5vdXQpO1xyXG4gICAgICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgVGFsb25QYXJzZXIodGhpcy5vdXQpO1xyXG4gICAgICAgICAgICBjb25zdCBhbmFseXplciA9IG5ldyBUYWxvblNlbWFudGljQW5hbHl6ZXIodGhpcy5vdXQpO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1lciA9IG5ldyBUYWxvblRyYW5zZm9ybWVyKHRoaXMub3V0KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VucyA9IGxleGVyLnRva2VuaXplKGNvZGUpO1xyXG4gICAgICAgICAgICBjb25zdCBhc3QgPSBwYXJzZXIucGFyc2UodG9rZW5zKTtcclxuICAgICAgICAgICAgY29uc3QgYW5hbHl6ZWRBc3QgPSBhbmFseXplci5hbmFseXplKGFzdCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gdHJhbnNmb3JtZXIudHJhbnNmb3JtKGFuYWx5emVkQXN0KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5UG9pbnQgPSB0aGlzLmNyZWF0ZUVudHJ5UG9pbnQoKTtcclxuXHJcbiAgICAgICAgICAgIHR5cGVzLnB1c2goZW50cnlQb2ludCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHlwZXM7XHJcbiAgICAgICAgfSBjYXRjaChleCl7XHJcbiAgICAgICAgICAgIGlmIChleCBpbnN0YW5jZW9mIENvbXBpbGF0aW9uRXJyb3Ipe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vdXQud3JpdGUoYDxlbT5FcnJvcjogJHtleC5tZXNzYWdlfTwvZW0+YCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm91dC53cml0ZShgPGVtPlVuaGFuZGxlZCBFcnJvcjogJHtleH08L2VtPmApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfSBmaW5hbGx5e1xyXG4gICAgICAgICAgICB0aGlzLm91dC53cml0ZShcIjxzdHJvbmc+Q29tcGlsYXRpb24gY29tcGxldGUuPC9zdHJvbmc+XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUVudHJ5UG9pbnQoKXtcclxuICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoXCJ+Z2FtZVwiLCBBbnkudHlwZU5hbWUpO1xyXG5cclxuICAgICAgICB0eXBlLmF0dHJpYnV0ZXMucHVzaChuZXcgRW50cnlQb2ludEF0dHJpYnV0ZSgpKTtcclxuXHJcbiAgICAgICAgY29uc3QgbWFpbiA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICBtYWluLm5hbWUgPSBBbnkubWFpbjtcclxuICAgICAgICBtYWluLmJvZHkucHVzaChcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhgVGFsb24gTGFuZ3VhZ2Ugdi4ke3RoaXMubGFuZ3VhZ2VWZXJzaW9ufSwgQ29tcGlsZXIgdi4ke3RoaXMudmVyc2lvbn1gKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoXCJcIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnN0YXRpY0NhbGwoXCJ+Z2xvYmFsU2F5c1wiLCBcIn5zYXlcIiksICAgICAgICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIlwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIldoYXQgd291bGQgeW91IGxpa2UgdG8gZG8/XCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5yZWFkSW5wdXQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIlwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucGFyc2VDb21tYW5kKCksICAgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5oYW5kbGVDb21tYW5kKCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmlzVHlwZU9mKERlbGVnYXRlLnR5cGVOYW1lKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmVJZkZhbHNlKDIpLCAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5pbnZva2VEZWxlZ2F0ZSgpLCAgICAgICAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlKC00KSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uZ29Ubyg5KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHR5cGUubWV0aG9kcy5wdXNoKG1haW4pO1xyXG5cclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBDb21waWxhdGlvbkVycm9ye1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBtZXNzYWdlOnN0cmluZyl7XHJcblxyXG4gICAgfVxyXG59IiwiaW50ZXJmYWNlIEluZGV4YWJsZXtcclxuICAgIFtrZXk6c3RyaW5nXTphbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBLZXl3b3Jkc3tcclxuICAgIFxyXG4gICAgc3RhdGljIHJlYWRvbmx5IGFuID0gXCJhblwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGEgPSBcImFcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0aGUgPSBcInRoZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGlzID0gXCJpc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGtpbmQgPSBcImtpbmRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBvZiA9IFwib2ZcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwbGFjZSA9IFwicGxhY2VcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpdGVtID0gXCJpdGVtXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaXQgPSBcIml0XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaGFzID0gXCJoYXNcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpZiA9IFwiaWZcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZXNjcmlwdGlvbiA9IFwiZGVzY3JpcHRpb25cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB1bmRlcnN0YW5kID0gXCJ1bmRlcnN0YW5kXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYXMgPSBcImFzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGVzY3JpYmluZyA9IFwiZGVzY3JpYmluZ1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRlc2NyaWJlZCA9IFwiZGVzY3JpYmVkXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgd2hlcmUgPSBcIndoZXJlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGxheWVyID0gXCJwbGF5ZXJcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBzdGFydHMgPSBcInN0YXJ0c1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNvbnRhaW5zID0gXCJjb250YWluc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHNheSA9IFwic2F5XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGlyZWN0aW9ucyA9IFwiZGlyZWN0aW9uc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG1vdmluZyA9IFwibW92aW5nXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdGFraW5nID0gXCJ0YWtpbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpbnZlbnRvcnkgPSBcImludmVudG9yeVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNhbiA9IFwiY2FuXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcmVhY2ggPSBcInJlYWNoXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYnkgPSBcImJ5XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZ29pbmcgPSBcImdvaW5nXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYW5kID0gXCJhbmRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBvciA9IFwib3JcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0aGVuID0gXCJ0aGVuXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZWxzZSA9IFwiZWxzZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHdoZW4gPSBcIndoZW5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBlbnRlcnMgPSBcImVudGVyc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGV4aXRzID0gXCJleGl0c1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHN0b3AgPSBcInN0b3BcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkcm9wcGluZyA9IFwiZHJvcHBpbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0aGF0ID0gXCJ0aGF0XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc2V0ID0gXCJzZXRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0byA9IFwidG9cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZWNvcmF0aW9uID0gXCJkZWNvcmF0aW9uXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdmlzaWJsZSA9IFwidmlzaWJsZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG5vdCA9IFwibm90XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgb2JzZXJ2ZWQgPSBcIm9ic2VydmVkXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY29udGludWUgPSBcImNvbnRpbnVlXCI7XHJcblxyXG4gICAgc3RhdGljIGdldEFsbCgpOlNldDxzdHJpbmc+e1xyXG4gICAgICAgIHR5cGUgS2V5d29yZFByb3BlcnRpZXMgPSBrZXlvZiBLZXl3b3JkcztcclxuXHJcbiAgICAgICAgY29uc3QgYWxsS2V5d29yZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhLZXl3b3Jkcyk7XHJcblxyXG4gICAgICAgIGZvcihsZXQga2V5d29yZCBvZiBuYW1lcyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gKEtleXdvcmRzIGFzIEluZGV4YWJsZSlba2V5d29yZF07XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmIHZhbHVlICE9IFwiS2V5d29yZHNcIil7XHJcbiAgICAgICAgICAgICAgICBhbGxLZXl3b3Jkcy5hZGQodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYWxsS2V5d29yZHM7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgUHVuY3R1YXRpb257XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGVyaW9kID0gXCIuXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY29sb24gPSBcIjpcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBzZW1pY29sb24gPSBcIjtcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBjb21tYSA9IFwiLFwiO1xyXG59IiwiaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi9Ub2tlblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFB1bmN0dWF0aW9uIH0gZnJvbSBcIi4vUHVuY3R1YXRpb25cIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25MZXhlcntcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGFsbEtleXdvcmRzID0gS2V5d29yZHMuZ2V0QWxsKCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXQ6SU91dHB1dCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRva2VuaXplKGNvZGU6c3RyaW5nKTpUb2tlbltde1xyXG4gICAgICAgIGxldCBjdXJyZW50TGluZSA9IDE7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRDb2x1bW4gPSAxO1xyXG5cclxuICAgICAgICBjb25zdCB0b2tlbnM6VG9rZW5bXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb2RlLmxlbmd0aDsgKXtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSBjb2RlLmNoYXJBdChpbmRleCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gXCIgXCIpe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvbHVtbisrO1xyXG4gICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gXCJcXG5cIil7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29sdW1uID0gMTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lKys7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB0b2tlblZhbHVlID0gdGhpcy5jb25zdW1lVG9rZW5DaGFyc0F0KGNvZGUsIGluZGV4KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0b2tlblZhbHVlLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBuZXcgVG9rZW4oY3VycmVudExpbmUsIGN1cnJlbnRDb2x1bW4sIHRva2VuVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50Q29sdW1uICs9IHRva2VuVmFsdWUubGVuZ3RoO1xyXG4gICAgICAgICAgICBpbmRleCArPSB0b2tlblZhbHVlLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzaWZ5KHRva2Vucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGFzc2lmeSh0b2tlbnM6VG9rZW5bXSk6VG9rZW5bXXtcclxuICAgICAgICBmb3IobGV0IHRva2VuIG9mIHRva2Vucyl7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PSBQdW5jdHVhdGlvbi5wZXJpb2Qpe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5UZXJtaW5hdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlID09IFB1bmN0dWF0aW9uLnNlbWljb2xvbil7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLlNlbWlUZXJtaW5hdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlID09IFB1bmN0dWF0aW9uLmNvbG9uKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuT3Blbk1ldGhvZEJsb2NrO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlID09IFB1bmN0dWF0aW9uLmNvbW1hKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuTGlzdFNlcGFyYXRvcjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChUYWxvbkxleGVyLmFsbEtleXdvcmRzLmhhcyh0b2tlbi52YWx1ZSkpe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5LZXl3b3JkO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlLnN0YXJ0c1dpdGgoXCJcXFwiXCIpICYmIHRva2VuLnZhbHVlLmVuZHNXaXRoKFwiXFxcIlwiKSl7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLlN0cmluZztcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghaXNOYU4oTnVtYmVyKHRva2VuLnZhbHVlKSkpIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuTnVtYmVyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5JZGVudGlmaWVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW5zO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29uc3VtZVRva2VuQ2hhcnNBdChjb2RlOnN0cmluZywgaW5kZXg6bnVtYmVyKTpzdHJpbmd7XHJcbiAgICAgICAgY29uc3QgdG9rZW5DaGFyczpzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHN0cmluZ0RlbGltaXRlciA9IFwiXFxcIlwiO1xyXG5cclxuICAgICAgICBsZXQgaXNDb25zdW1pbmdTdHJpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yKGxldCByZWFkQWhlYWRJbmRleCA9IGluZGV4OyByZWFkQWhlYWRJbmRleCA8IGNvZGUubGVuZ3RoOyByZWFkQWhlYWRJbmRleCsrKXtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSBjb2RlLmNoYXJBdChyZWFkQWhlYWRJbmRleCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNDb25zdW1pbmdTdHJpbmcgJiYgY3VycmVudENoYXIgIT0gc3RyaW5nRGVsaW1pdGVyKXtcclxuICAgICAgICAgICAgICAgIHRva2VuQ2hhcnMucHVzaChjdXJyZW50Q2hhcik7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDaGFyID09IHN0cmluZ0RlbGltaXRlcil7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdG9rZW5DaGFycy5wdXNoKGN1cnJlbnRDaGFyKTsgICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgaXNDb25zdW1pbmdTdHJpbmcgPSAhaXNDb25zdW1pbmdTdHJpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzQ29uc3VtaW5nU3RyaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gXCIgXCIgfHwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q2hhciA9PSBcIlxcblwiIHx8IFxyXG4gICAgICAgICAgICAgICAgY3VycmVudENoYXIgPT0gUHVuY3R1YXRpb24ucGVyaW9kIHx8IFxyXG4gICAgICAgICAgICAgICAgY3VycmVudENoYXIgPT0gUHVuY3R1YXRpb24uY29sb24gfHwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q2hhciA9PSBQdW5jdHVhdGlvbi5zZW1pY29sb24gfHxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDaGFyID09IFB1bmN0dWF0aW9uLmNvbW1hKXtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbkNoYXJzLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbkNoYXJzLnB1c2goY3VycmVudENoYXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRva2VuQ2hhcnMucHVzaChjdXJyZW50Q2hhcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW5DaGFycy5qb2luKFwiXCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvSXRlbVwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBEZWNvcmF0aW9uIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvRGVjb3JhdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRva2Vue1xyXG4gICAgc3RhdGljIGdldCBlbXB0eSgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoXCJ+ZW1wdHlcIiwgVG9rZW5UeXBlLlVua25vd24pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yQW55KCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihBbnkudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvclBsYWNlKCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihQbGFjZS50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9ySXRlbSgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoSXRlbS50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yRGVjb3JhdGlvbigpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoRGVjb3JhdGlvbi50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yV29ybGRPYmplY3QoKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKFdvcmxkT2JqZWN0LnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JCb29sZWFuKCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihCb29sZWFuVHlwZS50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yTGlzdCgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoTGlzdC50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldFRva2VuV2l0aFR5cGVPZihuYW1lOnN0cmluZywgdHlwZTpUb2tlblR5cGUpe1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gbmV3IFRva2VuKC0xLC0xLG5hbWUpO1xyXG4gICAgICAgIHRva2VuLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH1cclxuXHJcbiAgICB0eXBlOlRva2VuVHlwZSA9IFRva2VuVHlwZS5Vbmtub3duO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBsaW5lOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBjb2x1bW46bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHZhbHVlOnN0cmluZyl7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gYCR7dGhpcy5saW5lfSwgJHt0aGlzLmNvbHVtbn06IEZvdW5kIHRva2VuICcke3RoaXMudmFsdWV9JyBvZiB0eXBlICcke3RoaXMudHlwZX0nYDtcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIFRva2VuVHlwZSB7XHJcbiAgICBVbmtub3duID0gJ1Vua25vd24nLFxyXG4gICAgS2V5d29yZCA9ICdLZXl3b3JkJyxcclxuICAgIFRlcm1pbmF0b3IgPSAnVGVybWluYXRvcicsXHJcbiAgICBTZW1pVGVybWluYXRvciA9ICdTZW1pVGVybWluYXRvcicsXHJcbiAgICBTdHJpbmcgPSAnU3RyaW5nJyxcclxuICAgIElkZW50aWZpZXIgPSAnSWRlbnRpZmllcicsXHJcbiAgICBOdW1iZXIgPSAnTnVtYmVyJyxcclxuICAgIE9wZW5NZXRob2RCbG9jayA9ICdPcGVuTWV0aG9kQmxvY2snLFxyXG4gICAgTGlzdFNlcGFyYXRvciA9ICdMaXN0U2VwYXJhdG9yJ1xyXG59IiwiaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyc2VDb250ZXh0e1xyXG4gICAgaW5kZXg6bnVtYmVyID0gMDtcclxuXHJcbiAgICBnZXQgaXNEb25lKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXggPj0gdGhpcy50b2tlbnMubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJyZW50VG9rZW4oKXtcclxuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5pbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG5leHRUb2tlbigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmluZGV4ICsgMV07XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB0b2tlbnM6VG9rZW5bXSwgcHJpdmF0ZSByZWFkb25seSBvdXQ6SU91dHB1dCl7XHJcbiAgICAgICAgdGhpcy5vdXQud3JpdGUoYCR7dG9rZW5zLmxlbmd0aH0gdG9rZW5zIGRpc2NvdmVyZWQsIHBhcnNpbmcuLi5gKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdW1lQ3VycmVudFRva2VuKCl7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLmN1cnJlbnRUb2tlbjtcclxuXHJcbiAgICAgICAgdGhpcy5pbmRleCsrO1xyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9XHJcblxyXG4gICAgaXModG9rZW5WYWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUb2tlbj8udmFsdWUgPT0gdG9rZW5WYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0ZvbGxvd2VkQnkodG9rZW5WYWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5leHRUb2tlbj8udmFsdWUgPT0gdG9rZW5WYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc1R5cGVPZih0eXBlOlRva2VuVHlwZSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRva2VuLnR5cGUgPT0gdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0FueVR5cGVPZiguLi50eXBlczpUb2tlblR5cGVbXSl7XHJcbiAgICAgICAgZm9yKGNvbnN0IHR5cGUgb2YgdHlwZXMpe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1R5cGVPZih0eXBlKSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQW55T2YoLi4udG9rZW5WYWx1ZXM6c3RyaW5nW10pe1xyXG4gICAgICAgIGZvcihsZXQgdmFsdWUgb2YgdG9rZW5WYWx1ZXMpe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pcyh2YWx1ZSkpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpc1Rlcm1pbmF0b3IoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VG9rZW4udHlwZSA9PSBUb2tlblR5cGUuVGVybWluYXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RBbnlPZiguLi50b2tlblZhbHVlczpzdHJpbmdbXSl7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzQW55T2YoLi4udG9rZW5WYWx1ZXMpKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJFeHBlY3RlZCB0b2tlbnNcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3QodG9rZW5WYWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi52YWx1ZSAhPSB0b2tlblZhbHVlKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYEV4cGVjdGVkIHRva2VuICcke3Rva2VuVmFsdWV9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdFN0cmluZygpe1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5leHBlY3RBbmRDb25zdW1lKFRva2VuVHlwZS5TdHJpbmcsIFwiRXhwZWN0ZWQgc3RyaW5nXCIpO1xyXG5cclxuICAgICAgICAvLyBXZSBuZWVkIHRvIHN0cmlwIG9mZiB0aGUgZG91YmxlIHF1b3RlcyBmcm9tIHRoZWlyIHN0cmluZyBhZnRlciB3ZSBjb25zdW1lIGl0LlxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBuZXcgVG9rZW4odG9rZW4ubGluZSwgdG9rZW4uY29sdW1uLCB0b2tlbi52YWx1ZS5zdWJzdHJpbmcoMSwgdG9rZW4udmFsdWUubGVuZ3RoIC0gMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdE51bWJlcigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4cGVjdEFuZENvbnN1bWUoVG9rZW5UeXBlLk51bWJlciwgXCJFeHBlY3RlZCBudW1iZXJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0SWRlbnRpZmllcigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4cGVjdEFuZENvbnN1bWUoVG9rZW5UeXBlLklkZW50aWZpZXIsIFwiRXhwZWN0ZWQgaWRlbnRpZmllclwiKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RUZXJtaW5hdG9yKCl7XHJcbiAgICAgICAgdGhpcy5leHBlY3RBbmRDb25zdW1lKFRva2VuVHlwZS5UZXJtaW5hdG9yLCBcIkV4cGVjdGVkIGV4cHJlc3Npb24gdGVybWluYXRvclwiKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RTZW1pVGVybWluYXRvcigpe1xyXG4gICAgICAgIHRoaXMuZXhwZWN0QW5kQ29uc3VtZShUb2tlblR5cGUuU2VtaVRlcm1pbmF0b3IsIFwiRXhwZWN0ZWQgc2VtaSBleHByZXNzaW9uIHRlcm1pbmF0b3JcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0T3Blbk1ldGhvZEJsb2NrKCl7XHJcbiAgICAgICAgdGhpcy5leHBlY3RBbmRDb25zdW1lKFRva2VuVHlwZS5PcGVuTWV0aG9kQmxvY2ssIFwiRXhwZWN0ZWQgb3BlbiBtZXRob2QgYmxvY2tcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBleHBlY3RBbmRDb25zdW1lKHRva2VuVHlwZTpUb2tlblR5cGUsIGVycm9yTWVzc2FnZTpzdHJpbmcpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi50eXBlICE9IHRva2VuVHlwZSl7XHJcbiAgICAgICAgICAgIHRocm93IHRoaXMuY3JlYXRlQ29tcGlsYXRpb25FcnJvckZvckN1cnJlbnRUb2tlbihlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlQ29tcGlsYXRpb25FcnJvckZvckN1cnJlbnRUb2tlbihtZXNzYWdlOnN0cmluZyk6Q29tcGlsYXRpb25FcnJvcntcclxuICAgICAgICByZXR1cm4gbmV3IENvbXBpbGF0aW9uRXJyb3IoYCR7bWVzc2FnZX06ICR7dGhpcy5jdXJyZW50VG9rZW59YCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5cIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgUHJvZ3JhbVZpc2l0b3IgfSBmcm9tIFwiLi92aXNpdG9ycy9Qcm9ncmFtVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi8uLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvblBhcnNlcntcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgb3V0OklPdXRwdXQpe1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgcGFyc2UodG9rZW5zOlRva2VuW10pOkV4cHJlc3Npb257XHJcbiAgICAgICAgY29uc3QgY29udGV4dCA9IG5ldyBQYXJzZUNvbnRleHQodG9rZW5zLCB0aGlzLm91dCk7XHJcbiAgICAgICAgY29uc3QgdmlzaXRvciA9IG5ldyBQcm9ncmFtVmlzaXRvcigpO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQWN0aW9uc0V4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGFjdGlvbnM6RXhwcmVzc2lvbltdKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCaW5hcnlFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGxlZnQ/OkV4cHJlc3Npb247XHJcbiAgICByaWdodD86RXhwcmVzc2lvbjtcclxufSIsImltcG9ydCB7IEJpbmFyeUV4cHJlc3Npb24gfSBmcm9tIFwiLi9CaW5hcnlFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IElkZW50aWZpZXJFeHByZXNzaW9uIH0gZnJvbSBcIi4vSWRlbnRpZmllckV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21wYXJpc29uRXhwcmVzc2lvbiBleHRlbmRzIEJpbmFyeUV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihpZGVudGlmaWVyOklkZW50aWZpZXJFeHByZXNzaW9uLCBjb21wYXJlZFRvOkV4cHJlc3Npb24pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5sZWZ0ID0gaWRlbnRpZmllcjtcclxuICAgICAgICB0aGlzLnJpZ2h0ID0gY29tcGFyZWRUbztcclxuICAgIH1cclxufSIsImltcG9ydCB7IEJpbmFyeUV4cHJlc3Npb24gfSBmcm9tIFwiLi9CaW5hcnlFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24gZXh0ZW5kcyBCaW5hcnlFeHByZXNzaW9ue1xyXG4gICAgXHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbnRhaW5zRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdGFyZ2V0TmFtZTpzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgY291bnQ6bnVtYmVyLCBcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB0eXBlTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgRXhwcmVzc2lvbntcclxuICAgIFxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuL1R5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQmluYXJ5RXhwcmVzc2lvbiB9IGZyb20gXCIuL0JpbmFyeUV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBuYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICB0eXBlTmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgaW5pdGlhbFZhbHVlPzpPYmplY3Q7XHJcbiAgICB0eXBlPzpUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uO1xyXG4gICAgYXNzb2NpYXRlZEV4cHJlc3Npb25zOkJpbmFyeUV4cHJlc3Npb25bXSA9IFtdO1xyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJZGVudGlmaWVyRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgaW5zdGFuY2VOYW1lOnN0cmluZ3x1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdmFyaWFibGVOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSWZFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBjb25kaXRpb25hbDpFeHByZXNzaW9uLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGlmQmxvY2s6RXhwcmVzc2lvbixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBlbHNlQmxvY2s6RXhwcmVzc2lvbnxudWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMaXN0RXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaXRlbXM6RXhwcmVzc2lvbltdKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMaXRlcmFsRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdHlwZU5hbWU6c3RyaW5nLCBwdWJsaWMgcmVhZG9ubHkgdmFsdWU6T2JqZWN0KXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9ncmFtRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBleHByZXNzaW9uczpFeHByZXNzaW9uW10pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNheUV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHRleHQ6c3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTZXRWYXJpYWJsZUV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGluc3RhbmNlTmFtZTpzdHJpbmd8dW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHZhcmlhYmxlTmFtZTpzdHJpbmcsIFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGV2YWx1YXRpb25FeHByZXNzaW9uOkV4cHJlc3Npb24pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuLi8uLi9sZXhpbmcvVG9rZW5cIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4vV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgYmFzZVR5cGU/OlR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb247XHJcbiAgICBmaWVsZHM6RmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25bXSA9IFtdO1xyXG4gICAgZXZlbnRzOldoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb25bXSA9IFtdO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBuYW1lVG9rZW46VG9rZW4sIHJlYWRvbmx5IGJhc2VUeXBlTmFtZVRva2VuOlRva2VuKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWVUb2tlbi52YWx1ZTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHZhbHVlOnN0cmluZywgcHVibGljIHJlYWRvbmx5IG1lYW5pbmc6c3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBhY3RvcjpzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgZXZlbnRLaW5kOnN0cmluZyxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBhY3Rpb25zOkV4cHJlc3Npb24pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgQWN0aW9uc0V4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvQWN0aW9uc0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJsb2NrRXhwcmVzc2lvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDpQYXJzZUNvbnRleHQpOkV4cHJlc3Npb257XHJcblxyXG4gICAgICAgIGNvbnN0IGFjdGlvbnM6RXhwcmVzc2lvbltdID0gW107XHJcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvblZpc2l0b3IgPSBuZXcgRXhwcmVzc2lvblZpc2l0b3IoKTtcclxuXHJcbiAgICAgICAgd2hpbGUoIWNvbnRleHQuaXMoS2V5d29yZHMuYW5kKSAmJiAhY29udGV4dC5pcyhLZXl3b3Jkcy5vcikpe1xyXG4gICAgICAgICAgICBjb25zdCBhY3Rpb24gPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKGFjdGlvbik7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdFNlbWlUZXJtaW5hdG9yKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFjdGlvbnNFeHByZXNzaW9uKGFjdGlvbnMpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IENvbXBhcmlzb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0NvbXBhcmlzb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBJZGVudGlmaWVyRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9JZGVudGlmaWVyRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21wYXJpc29uRXhwcmVzc2lvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29uc3QgaWRlbnRpZmllciA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG4gICAgICAgIGNvbnN0IGlkZW50aWZpZXJFeHByZXNzaW9uID0gbmV3IElkZW50aWZpZXJFeHByZXNzaW9uKHVuZGVmaW5lZCwgaWRlbnRpZmllci52YWx1ZSk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmlzKTtcclxuXHJcbiAgICAgICAgdmFyIHZpc2l0b3IgPSBuZXcgRXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICB2YXIgY29tcGFyZWRUbyA9IHZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQ29tcGFyaXNvbkV4cHJlc3Npb24oaWRlbnRpZmllckV4cHJlc3Npb24sIGNvbXBhcmVkVG8pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQdW5jdHVhdGlvbiB9IGZyb20gXCIuLi8uLi9sZXhpbmcvUHVuY3R1YXRpb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IEFjdGlvbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0FjdGlvbnNFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRXZlbnRFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIEV4cHJlc3Npb25WaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDpQYXJzZUNvbnRleHQpOkV4cHJlc3Npb257XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgYWN0aW9uczpFeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUoIWNvbnRleHQuaXMoS2V5d29yZHMuYW5kKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbiA9IHN1cGVyLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goYWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0U2VtaVRlcm1pbmF0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmFuZCk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlbik7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuc3RvcCk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQWN0aW9uc0V4cHJlc3Npb24oYWN0aW9ucyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgSWZFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0lmRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi8uLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgQ29udGFpbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0NvbnRhaW5zRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBTYXlFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1NheUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xleGluZy9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgU2V0VmFyaWFibGVFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1NldFZhcmlhYmxlRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBMaXRlcmFsRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9MaXRlcmFsRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBOdW1iZXJUeXBlIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvTnVtYmVyVHlwZVwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5pbXBvcnQgeyBMaXN0RXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9MaXN0RXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBDb21wYXJpc29uRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9Db21wYXJpc29uRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5pZikpe1xyXG4gICAgICAgICAgICBjb25zdCB2aXNpdG9yID0gbmV3IElmRXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLml0KSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLml0KTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuY29udGFpbnMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY291bnQgPSBjb250ZXh0LmV4cGVjdE51bWJlcigpO1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlTmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb250YWluc0V4cHJlc3Npb24oXCJ+aXRcIiwgTnVtYmVyKGNvdW50LnZhbHVlKSwgdHlwZU5hbWUudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5zZXQpKXtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuc2V0KTtcclxuXHJcbiAgICAgICAgICAgIGxldCB2YXJpYWJsZU5hbWU6c3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLklkZW50aWZpZXIpKXtcclxuICAgICAgICAgICAgICAgIHZhcmlhYmxlTmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpLnZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogU3VwcG9ydCBkZXJlZmVyZW5jaW5nIGFyYml0cmFyeSBpbnN0YW5jZXMuXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkN1cnJlbnRseSB1bmFibGUgdG8gZGVyZWZlcmVuY2UgYSBmaWVsZCwgcGxhbm5lZCBmb3IgYSBmdXR1cmUgcmVsZWFzZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudG8pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdmlzaXRvciA9IG5ldyBFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFNldFZhcmlhYmxlRXhwcmVzc2lvbih1bmRlZmluZWQsIHZhcmlhYmxlTmFtZSwgdmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5zYXkpKXtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuc2F5KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTYXlFeHByZXNzaW9uKHRleHQudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuU3RyaW5nKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGl0ZXJhbEV4cHJlc3Npb24oU3RyaW5nVHlwZS50eXBlTmFtZSwgdmFsdWUudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuTnVtYmVyKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dC5leHBlY3ROdW1iZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGl0ZXJhbEV4cHJlc3Npb24oTnVtYmVyVHlwZS50eXBlTmFtZSwgdmFsdWUudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuTGlzdFNlcGFyYXRvcikpe1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtczpFeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLkxpc3RTZXBhcmF0b3IpKXtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMudmlzaXQoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IExpc3RFeHByZXNzaW9uKGl0ZW1zKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXNGb2xsb3dlZEJ5KEtleXdvcmRzLmlzKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgQ29tcGFyaXNvbkV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKGBVbmFibGUgdG8gcGFyc2UgZXhwcmVzc2lvbiBhdCAke2NvbnRleHQuY3VycmVudFRva2VufWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgQW5kRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9BbmRFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xleGluZy9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGaWVsZERlY2xhcmF0aW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuXHJcbiAgICAgICAgY29uc3QgZmllbGQgPSBuZXcgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24oKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXQpO1xyXG5cclxuICAgICAgICBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5pcykpe1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5pc0FueU9mKEtleXdvcmRzLm5vdCwgS2V5d29yZHMudmlzaWJsZSkpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzVmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMubm90KSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMubm90KTtcclxuICAgICAgICAgICAgICAgICAgICBpc1Zpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy52aXNpYmxlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaWVsZC5uYW1lID0gV29ybGRPYmplY3QudmlzaWJsZTtcclxuICAgICAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gQm9vbGVhblR5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBpc1Zpc2libGU7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMub2JzZXJ2ZWQpKXtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLm9ic2VydmVkKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmFzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBvYnNlcnZhdGlvbiA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IFdvcmxkT2JqZWN0Lm9ic2VydmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gb2JzZXJ2YXRpb24udmFsdWU7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuZGVzY3JpYmVkKSl7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5kZXNjcmliZWQpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaWVsZC5uYW1lID0gV29ybGRPYmplY3QuZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IFN0cmluZ1R5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBkZXNjcmlwdGlvbi52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY29udGV4dC5pcyhLZXl3b3Jkcy5hbmQpKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb25WaXNpdG9yID0gbmV3IEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb25WaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0RXhwcmVzc2lvbiA9IChmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnMubGVuZ3RoID09IDApID8gZmllbGQgOiBmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnNbZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zLmxlbmd0aCAtIDFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25jYXQgPSBuZXcgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uY2F0LmxlZnQgPSBsZWZ0RXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgICAgICAgICBjb25jYXQucmlnaHQgPSBleHByZXNzaW9uO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnMucHVzaChjb25jYXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLndoZXJlKSl7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy53aGVyZSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy50aGUpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMucGxheWVyKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnN0YXJ0cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IFBsYWNlLmlzUGxheWVyU3RhcnQ7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IEJvb2xlYW5UeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiVW5hYmxlIHRvIGRldGVybWluZSBwcm9wZXJ0eSBmaWVsZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5oYXMpKXtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmhhcyk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmEpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhhdCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmlzKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmlzVHlwZU9mKFRva2VuVHlwZS5TdHJpbmcpKXtcclxuICAgICAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gU3RyaW5nVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCkudmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuTnVtYmVyKSl7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IE51bWJlclR5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBjb250ZXh0LmV4cGVjdE51bWJlcigpLnZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYEV4cGVjdGVkIGEgc3RyaW5nIG9yIGEgbnVtYmVyIGJ1dCBmb3VuZCAnJHtjb250ZXh0LmN1cnJlbnRUb2tlbi52YWx1ZX0nYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmaWVsZC5uYW1lID0gbmFtZS52YWx1ZTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmNvbnRhaW5zKSl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5jb250YWlucyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBleHBlY3RQYWlyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY291bnQgPSBjb250ZXh0LmV4cGVjdE51bWJlcigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBbTnVtYmVyKGNvdW50LnZhbHVlKSwgbmFtZS52YWx1ZV07XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IFtleHBlY3RQYWlyKCldO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLkxpc3RTZXBhcmF0b3IpKXtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goZXhwZWN0UGFpcigpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmllbGQubmFtZSA9IFdvcmxkT2JqZWN0LmNvbnRlbnRzO1xyXG4gICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IExpc3QudHlwZU5hbWU7XHJcbiAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IGl0ZW1zOyBcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuY2FuKSl7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5jYW4pO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5yZWFjaCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnRoZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwbGFjZU5hbWUgPSBjb250ZXh0LmV4cGVjdElkZW50aWZpZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmJ5KTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuZ29pbmcpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBgfiR7ZGlyZWN0aW9uLnZhbHVlfWA7XHJcbiAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gU3RyaW5nVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gYCR7cGxhY2VOYW1lLnZhbHVlfWA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJVbmFibGUgdG8gZGV0ZXJtaW5lIGZpZWxkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZpZWxkO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgSWZFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0lmRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBCbG9ja0V4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vQmxvY2tFeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4uLy4uL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIElmRXhwcmVzc2lvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaWYpO1xyXG5cclxuICAgICAgICBjb25zdCBleHByZXNzaW9uVmlzaXRvciA9IG5ldyBFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbmFsID0gZXhwcmVzc2lvblZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnRoZW4pO1xyXG5cclxuICAgICAgICBjb25zdCBibG9ja1Zpc2l0b3IgPSBuZXcgQmxvY2tFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgIGNvbnN0IGlmQmxvY2sgPSBibG9ja1Zpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcbiAgICAgICAgY29uc3QgZWxzZUJsb2NrID0gdGhpcy50cnlWaXNpdEVsc2VCbG9jayhjb250ZXh0KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5hbmQpKXsgICAgICAgICAgICBcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYW5kKTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlbik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmNvbnRpbnVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgWW91IG5lZWQgdG8gZW5kIGFuICdpZicgZXhwcmVzc2lvbiBjb3JyZWN0bHksIG5vdCB3aXRoOiAke2NvbnRleHQuY3VycmVudFRva2VufWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBJZkV4cHJlc3Npb24oY29uZGl0aW9uYWwsIGlmQmxvY2ssIGVsc2VCbG9jayk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0cnlWaXNpdEVsc2VCbG9jayhjb250ZXh0OlBhcnNlQ29udGV4dCl7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0LmlzKEtleXdvcmRzLm9yKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGNvbnN0IGJsb2NrVmlzaXRvciA9IG5ldyBCbG9ja0V4cHJlc3Npb25WaXNpdG9yKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLm9yKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5lbHNlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJsb2NrVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBUeXBlRGVjbGFyYXRpb25WaXNpdG9yIH0gZnJvbSBcIi4vVHlwZURlY2xhcmF0aW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQcm9ncmFtRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9Qcm9ncmFtRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4uLy4uL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvclwiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25WaXNpdG9yIH0gZnJvbSBcIi4vVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBTYXlFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL1NheUV4cHJlc3Npb25WaXNpdG9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZ3JhbVZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgbGV0IGV4cHJlc3Npb25zOkV4cHJlc3Npb25bXSA9IFtdO1xyXG5cclxuICAgICAgICB3aGlsZSghY29udGV4dC5pc0RvbmUpe1xyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy51bmRlcnN0YW5kKSl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1bmRlcnN0YW5kaW5nRGVjbGFyYXRpb24gPSBuZXcgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbi52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXNBbnlPZihLZXl3b3Jkcy5hLCBLZXl3b3Jkcy5hbikpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZURlY2xhcmF0aW9uID0gbmV3IFR5cGVEZWNsYXJhdGlvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB0eXBlRGVjbGFyYXRpb24udmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLnNheSkpe1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2F5RXhwcmVzc2lvbiA9IG5ldyBTYXlFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHNheUV4cHJlc3Npb24udmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQXQgdGhlIHRvcCBsZXZlbCwgYSBzYXkgZXhwcmVzc2lvbiBtdXN0IGhhdmUgYSB0ZXJtaW5hdG9yLiBXZSdyZSBldmFsdWF0aW5nIGl0IG91dCBoZXJlXHJcbiAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIGEgc2F5IGV4cHJlc3Npb24gbm9ybWFsbHkgZG9lc24ndCByZXF1aXJlIG9uZS5cclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgRm91bmQgdW5leHBlY3RlZCB0b2tlbiAnJHtjb250ZXh0LmN1cnJlbnRUb2tlbn0nYCk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvZ3JhbUV4cHJlc3Npb24oZXhwcmVzc2lvbnMpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFNheUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvU2F5RXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNheUV4cHJlc3Npb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnNheSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRleHQgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFNheUV4cHJlc3Npb24odGV4dC52YWx1ZSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBGaWVsZERlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL0ZpZWxkRGVjbGFyYXRpb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0ZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBXaGVuRGVjbGFyYXRpb25WaXNpdG9yIH0gZnJvbSBcIi4vV2hlbkRlY2xhcmF0aW9uVmlzaXRvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFR5cGVEZWNsYXJhdGlvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3RBbnlPZihLZXl3b3Jkcy5hLCBLZXl3b3Jkcy5hbik7XHJcblxyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBjb250ZXh0LmV4cGVjdElkZW50aWZpZXIoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXMpO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmEpO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmtpbmQpO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLm9mKTtcclxuXHJcbiAgICAgICAgY29uc3QgYmFzZVR5cGUgPSB0aGlzLmV4cGVjdEJhc2VUeXBlKGNvbnRleHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0VGVybWluYXRvcigpO1xyXG5cclxuICAgICAgICBjb25zdCBmaWVsZHM6RmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25bXSA9IFtdO1xyXG5cclxuICAgICAgICB3aGlsZSAoY29udGV4dC5pcyhLZXl3b3Jkcy5pdCkpe1xyXG4gICAgICAgICAgICBjb25zdCBmaWVsZFZpc2l0b3IgPSBuZXcgRmllbGREZWNsYXJhdGlvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgY29uc3QgZmllbGQgPSBmaWVsZFZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICBmaWVsZHMucHVzaCg8RmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24+ZmllbGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZXZlbnRzOldoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb25bXSA9IFtdO1xyXG5cclxuICAgICAgICB3aGlsZSAoY29udGV4dC5pcyhLZXl3b3Jkcy53aGVuKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHdoZW5WaXNpdG9yID0gbmV3IFdoZW5EZWNsYXJhdGlvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgY29uc3Qgd2hlbiA9IHdoZW5WaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgZXZlbnRzLnB1c2goPFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24+d2hlbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0eXBlRGVjbGFyYXRpb24gPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihuYW1lLCBiYXNlVHlwZSk7XHJcblxyXG4gICAgICAgIHR5cGVEZWNsYXJhdGlvbi5maWVsZHMgPSBmaWVsZHM7XHJcbiAgICAgICAgdHlwZURlY2xhcmF0aW9uLmV2ZW50cyA9IGV2ZW50cztcclxuXHJcbiAgICAgICAgcmV0dXJuIHR5cGVEZWNsYXJhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4cGVjdEJhc2VUeXBlKGNvbnRleHQ6UGFyc2VDb250ZXh0KXtcclxuICAgICAgICBpZiAoY29udGV4dC5pc0FueU9mKEtleXdvcmRzLnBsYWNlLCBLZXl3b3Jkcy5pdGVtLCBLZXl3b3Jkcy5kZWNvcmF0aW9uKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0LmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudW5kZXJzdGFuZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1lYW5pbmcgPSBjb250ZXh0LmV4cGVjdEFueU9mKEtleXdvcmRzLmRlc2NyaWJpbmcsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEtleXdvcmRzLm1vdmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy5kaXJlY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEtleXdvcmRzLnRha2luZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy5pbnZlbnRvcnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2V5d29yZHMuZHJvcHBpbmcpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uKHZhbHVlLnZhbHVlLCBtZWFuaW5nLnZhbHVlKTsgICAgICAgIFxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWaXNpdG9ye1xyXG4gICAgYWJzdHJhY3QgdmlzaXQoY29udGV4dDpQYXJzZUNvbnRleHQpOkV4cHJlc3Npb247XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9XaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFB1bmN0dWF0aW9uIH0gZnJvbSBcIi4uLy4uL2xleGluZy9QdW5jdHVhdGlvblwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0V4cHJlc3Npb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IEV2ZW50RXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FdmVudEV4cHJlc3Npb25WaXNpdG9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV2hlbkRlY2xhcmF0aW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy53aGVuKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy50aGUpO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnBsYXllcik7XHJcblxyXG4gICAgICAgIGNvbnN0IGV2ZW50S2luZCA9IGNvbnRleHQuZXhwZWN0QW55T2YoS2V5d29yZHMuZW50ZXJzLCBLZXl3b3Jkcy5leGl0cyk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0T3Blbk1ldGhvZEJsb2NrKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGFjdGlvbnNWaXNpdG9yID0gbmV3IEV2ZW50RXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICBjb25zdCBhY3Rpb25zID0gYWN0aW9uc1Zpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbihLZXl3b3Jkcy5wbGF5ZXIsIGV2ZW50S2luZC52YWx1ZSwgYWN0aW9ucyk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgUHJvZ3JhbUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9Qcm9ncmFtRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5cIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uL2xleGluZy9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi8uLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvblNlbWFudGljQW5hbHl6ZXJ7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhbnkgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JBbnksIFRva2VuLmVtcHR5KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgd29ybGRPYmplY3QgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JXb3JsZE9iamVjdCwgVG9rZW4uZm9yQW55KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGxhY2UgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JQbGFjZSwgVG9rZW4uZm9yV29ybGRPYmplY3QpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBpdGVtID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9ySXRlbSwgVG9rZW4uZm9yV29ybGRPYmplY3QpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBib29sZWFuVHlwZSA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvckJvb2xlYW4sIFRva2VuLmZvckFueSk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxpc3QgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JMaXN0LCBUb2tlbi5mb3JBbnkpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWNvcmF0aW9uID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yRGVjb3JhdGlvbiwgVG9rZW4uZm9yV29ybGRPYmplY3QpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgb3V0OklPdXRwdXQpe1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgYW5hbHl6ZShleHByZXNzaW9uOkV4cHJlc3Npb24pOkV4cHJlc3Npb257XHJcbiAgICAgICAgY29uc3QgdHlwZXM6VHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbltdID0gW3RoaXMuYW55LCB0aGlzLndvcmxkT2JqZWN0LCB0aGlzLnBsYWNlLCB0aGlzLmJvb2xlYW5UeXBlLCB0aGlzLml0ZW0sIHRoaXMuZGVjb3JhdGlvbl07XHJcblxyXG4gICAgICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgUHJvZ3JhbUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBmb3IobGV0IGNoaWxkIG9mIGV4cHJlc3Npb24uZXhwcmVzc2lvbnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZXMucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHR5cGVzQnlOYW1lID0gbmV3IE1hcDxzdHJpbmcsIFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24+KHR5cGVzLm1hcCh4ID0+IFt4Lm5hbWUsIHhdKSk7XHJcblxyXG4gICAgICAgIGZvcihjb25zdCBkZWNsYXJhdGlvbiBvZiB0eXBlcyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGJhc2VUb2tlbiA9IGRlY2xhcmF0aW9uLmJhc2VUeXBlTmFtZVRva2VuO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJhc2VUb2tlbi50eXBlID09IFRva2VuVHlwZS5LZXl3b3JkICYmICFiYXNlVG9rZW4udmFsdWUuc3RhcnRzV2l0aChcIn5cIikpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGB+JHtiYXNlVG9rZW4udmFsdWV9YDtcclxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uLmJhc2VUeXBlID0gdHlwZXNCeU5hbWUuZ2V0KG5hbWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb24uYmFzZVR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoYmFzZVRva2VuLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IGZpZWxkIG9mIGRlY2xhcmF0aW9uLmZpZWxkcyl7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlID0gdHlwZXNCeU5hbWUuZ2V0KGZpZWxkLnR5cGVOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGV4cHJlc3Npb247XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBFeHByZXNzaW9uVHJhbnNmb3JtYXRpb25Nb2Rle1xyXG4gICAgTm9uZSxcclxuICAgIElnbm9yZVJlc3VsdHNPZlNheUV4cHJlc3Npb25cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUHJvZ3JhbUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9Qcm9ncmFtRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4uL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvclwiO1xyXG5pbXBvcnQgeyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvVW5kZXJzdGFuZGluZ1wiO1xyXG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuLi8uLi9jb21tb24vRmllbGRcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IFN0cmluZ1R5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9TdHJpbmdUeXBlXCI7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9JdGVtXCI7XHJcbmltcG9ydCB7IE51bWJlclR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9OdW1iZXJUeXBlXCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYXllclwiO1xyXG5pbXBvcnQgeyBTYXlFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2F5RXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vLi4vY29tbW9uL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBTYXkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9TYXlcIjtcclxuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tIFwiLi4vLi4vY29tbW9uL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IFBhcmFtZXRlciB9IGZyb20gXCIuLi8uLi9jb21tb24vUGFyYW1ldGVyXCI7XHJcbmltcG9ydCB7IElmRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0lmRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBDb25jYXRlbmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0NvbmNhdGVuYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IENvbnRhaW5zRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0NvbnRhaW5zRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0ZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEFjdGlvbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvQWN0aW9uc0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IEV2ZW50VHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vRXZlbnRUeXBlXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGUgfSBmcm9tIFwiLi9FeHByZXNzaW9uVHJhbnNmb3JtYXRpb25Nb2RlXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IFNldFZhcmlhYmxlRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1NldFZhcmlhYmxlRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBMaXRlcmFsRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0xpdGVyYWxFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IERlY29yYXRpb24gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9EZWNvcmF0aW9uXCI7XHJcbmltcG9ydCB7IENvbXBhcmlzb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29tcGFyaXNvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgSWRlbnRpZmllckV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9JZGVudGlmaWVyRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uVHJhbnNmb3JtZXJ7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgY3JlYXRlU3lzdGVtVHlwZXMoKXtcclxuICAgICAgICBjb25zdCB0eXBlczpUeXBlW10gPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBUaGVzZSBhcmUgb25seSBoZXJlIGFzIHN0dWJzIGZvciBleHRlcm5hbCBydW50aW1lIHR5cGVzIHRoYXQgYWxsb3cgdXMgdG8gY29ycmVjdGx5IHJlc29sdmUgZmllbGQgdHlwZXMuXHJcblxyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoQW55LnR5cGVOYW1lLCBBbnkucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFdvcmxkT2JqZWN0LnR5cGVOYW1lLCBXb3JsZE9iamVjdC5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoUGxhY2UudHlwZU5hbWUsIFBsYWNlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShCb29sZWFuVHlwZS50eXBlTmFtZSwgQm9vbGVhblR5cGUucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFN0cmluZ1R5cGUudHlwZU5hbWUsIFN0cmluZ1R5cGUucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKE51bWJlclR5cGUudHlwZU5hbWUsIE51bWJlclR5cGUucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKEl0ZW0udHlwZU5hbWUsIEl0ZW0ucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKExpc3QudHlwZU5hbWUsIExpc3QucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFBsYXllci50eXBlTmFtZSwgUGxheWVyLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShTYXkudHlwZU5hbWUsIFNheS5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoRGVjb3JhdGlvbi50eXBlTmFtZSwgRGVjb3JhdGlvbi5wYXJlbnRUeXBlTmFtZSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IE1hcDxzdHJpbmcsIFR5cGU+KHR5cGVzLm1hcCh4ID0+IFt4Lm5hbWUsIHhdKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtKGV4cHJlc3Npb246RXhwcmVzc2lvbik6VHlwZVtde1xyXG4gICAgICAgIGNvbnN0IHR5cGVzQnlOYW1lID0gdGhpcy5jcmVhdGVTeXN0ZW1UeXBlcygpO1xyXG4gICAgICAgIGxldCBkeW5hbWljVHlwZUNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBQcm9ncmFtRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBjaGlsZCBvZiBleHByZXNzaW9uLmV4cHJlc3Npb25zKXtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBuZXcgVHlwZShgfiR7VW5kZXJzdGFuZGluZy50eXBlTmFtZX1fJHtkeW5hbWljVHlwZUNvdW50fWAsIFVuZGVyc3RhbmRpbmcudHlwZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5uYW1lID0gVW5kZXJzdGFuZGluZy5hY3Rpb247XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLmRlZmF1bHRWYWx1ZSA9IGNoaWxkLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZWFuaW5nID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVhbmluZy5uYW1lID0gVW5kZXJzdGFuZGluZy5tZWFuaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lYW5pbmcuZGVmYXVsdFZhbHVlID0gY2hpbGQubWVhbmluZztcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0eXBlLmZpZWxkcy5wdXNoKGFjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZS5maWVsZHMucHVzaChtZWFuaW5nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pY1R5cGVDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0eXBlc0J5TmFtZS5zZXQodHlwZS5uYW1lLCB0eXBlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gdGhpcy50cmFuc2Zvcm1Jbml0aWFsVHlwZURlY2xhcmF0aW9uKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0eXBlc0J5TmFtZS5zZXQodHlwZS5uYW1lLCB0eXBlKTtcclxuICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBjaGlsZCBvZiBleHByZXNzaW9uLmV4cHJlc3Npb25zKXtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoY2hpbGQubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvcihjb25zdCBmaWVsZEV4cHJlc3Npb24gb2YgY2hpbGQuZmllbGRzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGQgPSBuZXcgRmllbGQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IGZpZWxkRXhwcmVzc2lvbi5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IGZpZWxkRXhwcmVzc2lvbi50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQudHlwZSA9IHR5cGVzQnlOYW1lLmdldChmaWVsZEV4cHJlc3Npb24udHlwZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkRXhwcmVzc2lvbi5pbml0aWFsVmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkLnR5cGVOYW1lID09IFN0cmluZ1R5cGUudHlwZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gPHN0cmluZz5maWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC50eXBlTmFtZSA9PSBOdW1iZXJUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IE51bWJlcihmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZU5hbWUgPT0gQm9vbGVhblR5cGUudHlwZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gQm9vbGVhbihmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkRXhwcmVzc2lvbi5hc3NvY2lhdGVkRXhwcmVzc2lvbnMubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnZXRGaWVsZCA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLm5hbWUgPSBgfmdldF8ke2ZpZWxkLm5hbWV9YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLnBhcmFtZXRlcnMucHVzaChuZXcgUGFyYW1ldGVyKFwifnZhbHVlXCIsIGZpZWxkLnR5cGVOYW1lKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5yZXR1cm5UeXBlID0gZmllbGQudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihjb25zdCBhc3NvY2lhdGVkIG9mIGZpZWxkRXhwcmVzc2lvbi5hc3NvY2lhdGVkRXhwcmVzc2lvbnMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLmJvZHkucHVzaCguLi50aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oYXNzb2NpYXRlZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLmJvZHkucHVzaChJbnN0cnVjdGlvbi5yZXR1cm4oKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8ubWV0aG9kcy5wdXNoKGdldEZpZWxkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8uZmllbGRzLnB1c2goZmllbGQpOyAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzV29ybGRPYmplY3QgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBjdXJyZW50ID0gdHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IHR5cGVzQnlOYW1lLmdldChjdXJyZW50LmJhc2VUeXBlTmFtZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQubmFtZSA9PSBXb3JsZE9iamVjdC50eXBlTmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNXb3JsZE9iamVjdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzV29ybGRPYmplY3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmliZSA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpYmUubmFtZSA9IFdvcmxkT2JqZWN0LmRlc2NyaWJlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmliZS5ib2R5LnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFByb3BlcnR5KFdvcmxkT2JqZWN0LnZpc2libGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmVJZkZhbHNlKDMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRQcm9wZXJ0eShXb3JsZE9iamVjdC5kZXNjcmlwdGlvbiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucmV0dXJuKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/Lm1ldGhvZHMucHVzaChkZXNjcmliZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvYnNlcnZlID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlLm5hbWUgPSBXb3JsZE9iamVjdC5vYnNlcnZlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlLmJvZHkucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkUHJvcGVydHkoV29ybGRPYmplY3QudmlzaWJsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5icmFuY2hSZWxhdGl2ZUlmRmFsc2UoMyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFByb3BlcnR5KFdvcmxkT2JqZWN0Lm9ic2VydmF0aW9uKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5yZXR1cm4oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8ubWV0aG9kcy5wdXNoKG9ic2VydmUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlPy5maWVsZHMuZmluZCh4ID0+IHgubmFtZSA9PSBXb3JsZE9iamVjdC52aXNpYmxlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2aXNpYmxlID0gbmV3IEZpZWxkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZS5uYW1lID0gV29ybGRPYmplY3QudmlzaWJsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGUudHlwZU5hbWUgPSBCb29sZWFuVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGUuZGVmYXVsdFZhbHVlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5maWVsZHMucHVzaCh2aXNpYmxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlPy5maWVsZHMuZmluZCh4ID0+IHgubmFtZSA9PSBXb3JsZE9iamVjdC5jb250ZW50cykpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudHMgPSBuZXcgRmllbGQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50cy5uYW1lID0gV29ybGRPYmplY3QuY29udGVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50cy50eXBlTmFtZSA9IExpc3QudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50cy5kZWZhdWx0VmFsdWUgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5maWVsZHMucHVzaChjb250ZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdHlwZT8uZmllbGRzLmZpbmQoeCA9PiB4Lm5hbWUgPT0gV29ybGRPYmplY3Qub2JzZXJ2YXRpb24pKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9ic2VydmF0aW9uID0gbmV3IEZpZWxkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2YXRpb24ubmFtZSA9IFdvcmxkT2JqZWN0Lm9ic2VydmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2YXRpb24udHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2YXRpb24uZGVmYXVsdFZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5maWVsZHMucHVzaChvYnNlcnZhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkdXBsaWNhdGVFdmVudENvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgY2hpbGQuZXZlbnRzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGhvZCA9IG5ldyBNZXRob2QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QubmFtZSA9IGB+ZXZlbnRfJHtldmVudC5hY3Rvcn1fJHtldmVudC5ldmVudEtpbmR9XyR7ZHVwbGljYXRlRXZlbnRDb3VudH1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmV2ZW50VHlwZSA9IHRoaXMudHJhbnNmb3JtRXZlbnRLaW5kKGV2ZW50LmV2ZW50S2luZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVwbGljYXRlRXZlbnRDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGlvbnMgPSA8QWN0aW9uc0V4cHJlc3Npb24+ZXZlbnQuYWN0aW9ucztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IoY29uc3QgYWN0aW9uIG9mIGFjdGlvbnMuYWN0aW9ucyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYm9keSA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihhY3Rpb24sIEV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGUuSWdub3JlUmVzdWx0c09mU2F5RXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmJvZHkucHVzaCguLi5ib2R5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QuYm9keS5wdXNoKEluc3RydWN0aW9uLnJldHVybigpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5tZXRob2RzLnB1c2gobWV0aG9kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGdsb2JhbFNheXMgPSBleHByZXNzaW9uLmV4cHJlc3Npb25zLmZpbHRlcih4ID0+IHggaW5zdGFuY2VvZiBTYXlFeHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBuZXcgVHlwZShgfmdsb2JhbFNheXNgLCBTYXkudHlwZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgICAgICBtZXRob2QubmFtZSA9IFNheS50eXBlTmFtZTtcclxuICAgICAgICAgICAgbWV0aG9kLnBhcmFtZXRlcnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RydWN0aW9uczpJbnN0cnVjdGlvbltdID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3Qgc2F5IG9mIGdsb2JhbFNheXMpe1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2F5RXhwcmVzc2lvbiA9IDxTYXlFeHByZXNzaW9uPnNheTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKHNheUV4cHJlc3Npb24udGV4dCksXHJcbiAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24ucmV0dXJuKCkpO1xyXG5cclxuICAgICAgICAgICAgbWV0aG9kLmJvZHkgPSBpbnN0cnVjdGlvbnM7XHJcblxyXG4gICAgICAgICAgICB0eXBlLm1ldGhvZHMucHVzaChtZXRob2QpO1xyXG5cclxuICAgICAgICAgICAgdHlwZXNCeU5hbWUuc2V0KHR5cGUubmFtZSwgdHlwZSk7ICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byBwYXJ0aWFsbHkgdHJhbnNmb3JtXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5vdXQud3JpdGUoYENyZWF0ZWQgJHt0eXBlc0J5TmFtZS5zaXplfSB0eXBlcy4uLmApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHR5cGVzQnlOYW1lLnZhbHVlcygpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybUV2ZW50S2luZChraW5kOnN0cmluZyl7XHJcbiAgICAgICAgc3dpdGNoKGtpbmQpe1xyXG4gICAgICAgICAgICBjYXNlIEtleXdvcmRzLmVudGVyczp7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRXZlbnRUeXBlLlBsYXllckVudGVyc1BsYWNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgS2V5d29yZHMuZXhpdHM6e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEV2ZW50VHlwZS5QbGF5ZXJFeGl0c1BsYWNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6e1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYFVuYWJsZSB0byB0cmFuc2Zvcm0gdW5zdXBwb3J0ZWQgZXZlbnQga2luZCAnJHtraW5kfSdgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbjpFeHByZXNzaW9ufG51bGwsIG1vZGU/OkV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGUpe1xyXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uczpJbnN0cnVjdGlvbltdID0gW107XHJcblxyXG4gICAgICAgIGlmIChleHByZXNzaW9uID09IG51bGwpe1xyXG4gICAgICAgICAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBJZkV4cHJlc3Npb24peyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb25hbCA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmNvbmRpdGlvbmFsLCBtb2RlKTtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goLi4uY29uZGl0aW9uYWwpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaWZCbG9jayA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmlmQmxvY2ssIG1vZGUpO1xyXG4gICAgICAgICAgICBjb25zdCBlbHNlQmxvY2sgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5lbHNlQmxvY2ssIG1vZGUpO1xyXG5cclxuICAgICAgICAgICAgaWZCbG9jay5wdXNoKEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlKGVsc2VCbG9jay5sZW5ndGgpKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlSWZGYWxzZShpZkJsb2NrLmxlbmd0aCkpXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmlmQmxvY2spO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5lbHNlQmxvY2spO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIFNheUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGV4cHJlc3Npb24udGV4dCkpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5wcmludCgpKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtb2RlICE9IEV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGUuSWdub3JlUmVzdWx0c09mU2F5RXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGV4cHJlc3Npb24udGV4dCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgQ29udGFpbnNFeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkTnVtYmVyKGV4cHJlc3Npb24uY291bnQpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhleHByZXNzaW9uLnR5cGVOYW1lKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRJbnN0YW5jZShleHByZXNzaW9uLnRhcmdldE5hbWUpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEZpZWxkKFdvcmxkT2JqZWN0LmNvbnRlbnRzKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmluc3RhbmNlQ2FsbChMaXN0LmNvbnRhaW5zKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBDb25jYXRlbmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5sZWZ0ISwgbW9kZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24ucmlnaHQhLCBtb2RlKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmxlZnQpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5yaWdodCk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmNvbmNhdGVuYXRlKCkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEZpZWxkKGV4cHJlc3Npb24ubmFtZSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBTZXRWYXJpYWJsZUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBjb25zdCByaWdodCA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmV2YWx1YXRpb25FeHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgLi4ucmlnaHQsXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEZpZWxkKGV4cHJlc3Npb24udmFyaWFibGVOYW1lKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmFzc2lnbigpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgTGl0ZXJhbEV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpZiAoZXhwcmVzc2lvbi50eXBlTmFtZSA9PSBTdHJpbmdUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmxvYWRTdHJpbmcoPHN0cmluZz5leHByZXNzaW9uLnZhbHVlKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbi50eXBlTmFtZSA9PSBOdW1iZXJUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmxvYWROdW1iZXIoTnVtYmVyKGV4cHJlc3Npb24udmFsdWUpKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgVW5hYmxlIHRvIHRyYW5zZm9ybSB1bnN1cHBvcnRlZCBsaXRlcmFsIGV4cHJlc3Npb24gJyR7ZXhwcmVzc2lvbn0nYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBJZGVudGlmaWVyRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRGaWVsZChleHByZXNzaW9uLnZhcmlhYmxlTmFtZSkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIENvbXBhcmlzb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgY29uc3QgcmlnaHQgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5yaWdodCEpO1xyXG4gICAgICAgICAgICBjb25zdCBsZWZ0ID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24ubGVmdCEpO1xyXG5cclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICAuLi5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgLi4ucmlnaHQsXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5jb21wYXJlRXF1YWwoKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIEFjdGlvbnNFeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgZXhwcmVzc2lvbi5hY3Rpb25zLmZvckVhY2goeCA9PiBpbnN0cnVjdGlvbnMucHVzaCguLi50aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oeCwgbW9kZSkpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgVW5hYmxlIHRvIHRyYW5zZm9ybSB1bnN1cHBvcnRlZCBleHByZXNzaW9uOiAke2V4cHJlc3Npb259YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtSW5pdGlhbFR5cGVEZWNsYXJhdGlvbihleHByZXNzaW9uOlR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgIHJldHVybiBuZXcgVHlwZShleHByZXNzaW9uLm5hbWUsIGV4cHJlc3Npb24uYmFzZVR5cGUhLm5hbWUpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgSVBhbmVBbmFseXplciB9IGZyb20gXCIuL2FuYWx5emVycy9JUGFuZUFuYWx5emVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQW5hbHlzaXNDb29yZGluYXRvciB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGFuYWx5emVyOiBJUGFuZUFuYWx5emVyLCBcclxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgb3V0cHV0OiBIVE1MRGl2RWxlbWVudCkgeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgYW5hbHl6ZXIuY3VycmVudFBhbmUuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGUgPT4gdGhpcy51cGRhdGUoKSk7XHJcbiAgICAgICAgYW5hbHl6ZXIuY3VycmVudFBhbmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4gdGhpcy51cGRhdGUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGUoKXtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNhcmV0UG9zaXRpb25WYWx1ZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUNhcmV0UG9zaXRpb25WYWx1ZXMoKXtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuYW5hbHl6ZXIuY3VycmVudENhcmV0UG9zaXRpb247XHJcbiAgICAgICAgY29uc3QgZm9ybWF0dGVkUG9zaXRpb24gPSBgTGluZSAke3Bvc2l0aW9uLnJvd30sIENvbHVtbiAke3Bvc2l0aW9uLmNvbHVtbn1gO1xyXG5cclxuICAgICAgICB0aGlzLm91dHB1dC5pbm5lckhUTUwgPSBmb3JtYXR0ZWRQb3NpdGlvbjtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBDYXJldFBvc2l0aW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHJvdzpudW1iZXIsIHB1YmxpYyByZWFkb25seSBjb2x1bW46bnVtYmVyKXtcclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBJUGFuZUFuYWx5emVyIH0gZnJvbSBcIi4vSVBhbmVBbmFseXplclwiO1xyXG5pbXBvcnQgeyBDYXJldFBvc2l0aW9uIH0gZnJvbSBcIi4uL0NhcmV0UG9zaXRpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2RlUGFuZUFuYWx5emVyIGltcGxlbWVudHMgSVBhbmVBbmFseXplcntcclxuICAgIHByaXZhdGUgY2FyZXRSb3c6bnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgY2FyZXRDb2x1bW46bnVtYmVyID0gMDtcclxuXHJcbiAgICBnZXQgY3VycmVudENhcmV0UG9zaXRpb24oKTogQ2FyZXRQb3NpdGlvbntcclxuICAgICAgICByZXR1cm4gbmV3IENhcmV0UG9zaXRpb24odGhpcy5jYXJldFJvdywgdGhpcy5jYXJldENvbHVtbik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnJlbnRQYW5lKCk6SFRNTERpdkVsZW1lbnR7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFuZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHBhbmU6SFRNTERpdkVsZW1lbnQpe1xyXG4gICAgICAgIHBhbmUuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGUgPT4gdGhpcy51cGRhdGVDdXJyZW50Q2FyZXRQb3NpdGlvbigpKTtcclxuICAgICAgICBwYW5lLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHRoaXMudXBkYXRlQ3VycmVudENhcmV0UG9zaXRpb24oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVDdXJyZW50Q2FyZXRQb3NpdGlvbigpe1xyXG4gICAgICAgIHZhciBzZWwgPSBkb2N1bWVudC5nZXRTZWxlY3Rpb24oKSBhcyBhbnk7IC8vIFVzaW5nICdhbnknIGJlY2F1c2UgJ21vZGlmeScgaXNuJ3Qgb2ZmaWNpYWxseSBzdXBwb3J0ZWQuXHJcblxyXG4gICAgICAgIGlmIChzZWwudG9TdHJpbmcoKS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsLm1vZGlmeShcImV4dGVuZFwiLCBcImJhY2t3YXJkXCIsIFwibGluZWJvdW5kYXJ5XCIpO1xyXG4gICAgICAgIHZhciBwb3NpdGlvbiA9IHNlbC50b1N0cmluZygpLmxlbmd0aCBhcyBudW1iZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoc2VsLmFuY2hvck5vZGUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHNlbC5jb2xsYXBzZVRvRW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2FyZXRDb2x1bW4gPSBwb3NpdGlvbjtcclxuXHJcbiAgICAgICAgc2VsID0gZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKCkgYXMgYW55O1xyXG4gICAgICAgIHNlbC5tb2RpZnkoXCJleHRlbmRcIiwgXCJiYWNrd2FyZFwiLCBcImRvY3VtZW50Ym91bmRhcnlcIik7XHJcblxyXG4gICAgICAgIHRoaXMuY2FyZXRSb3cgPSAoKHNlbC50b1N0cmluZygpLnN1YnN0cmluZygwLCkpLnNwbGl0KFwiXFxuXCIpKS5sZW5ndGg7XHJcblxyXG4gICAgICAgIGlmKHNlbC5hbmNob3JOb2RlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzZWwuY29sbGFwc2VUb0VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4dGVybkNhbGwgfSBmcm9tIFwiLi9FeHRlcm5DYWxsXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQW55eyAgICAgICAgXHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHN0YXRpYyB0eXBlTmFtZTpzdHJpbmcgPSBcIn5hbnlcIjsgIFxyXG4gICAgXHJcbiAgICBzdGF0aWMgbWFpbiA9IFwifm1haW5cIjtcclxuICAgIHN0YXRpYyBleHRlcm5Ub1N0cmluZyA9IEV4dGVybkNhbGwub2YoXCJ+dG9TdHJpbmdcIik7XHJcbn1cclxuIiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQm9vbGVhblR5cGV7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn5ib29sZWFuXCI7XHJcbn0iLCJpbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuL1dvcmxkT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRGVjb3JhdGlvbntcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+ZGVjb3JhdGlvblwiO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRGVsZWdhdGV7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn5kZWxlZ2F0ZVwiO1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG59IiwiZXhwb3J0IGNsYXNzIEVudHJ5UG9pbnRBdHRyaWJ1dGV7XHJcbiAgICBuYW1lOnN0cmluZyA9IFwifmVudHJ5UG9pbnRcIjtcclxufSIsImV4cG9ydCBjbGFzcyBFeHRlcm5DYWxse1xyXG4gICAgc3RhdGljIG9mKG5hbWU6c3RyaW5nLCAuLi5hcmdzOnN0cmluZ1tdKXtcclxuICAgICAgICByZXR1cm4gbmV3IEV4dGVybkNhbGwobmFtZSwgLi4uYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgYXJnczpzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6c3RyaW5nLCAuLi5hcmdzOnN0cmluZ1tdKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuL1dvcmxkT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbXtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifml0ZW1cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlzdHtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifmxpc3RcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY29udGFpbnMgPSBcIn5jb250YWluc1wiO1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZVBhcmFtZXRlciA9IFwifnR5cGVOYW1lXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY291bnRQYXJhbWV0ZXIgPSBcIn5jb3VudFwiO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTnVtYmVyVHlwZXtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifm51bWJlclwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi9Xb3JsZE9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYWNlIHtcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+cGxhY2VcIjtcclxuXHJcbiAgICBzdGF0aWMgaXNQbGF5ZXJTdGFydCA9IFwifmlzUGxheWVyU3RhcnRcIjtcclxufSIsImltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vV29ybGRPYmplY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJ7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWUgPSBcIn5wbGF5ZXJcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lOyAgICBcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNheXtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifnNheVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RyaW5nVHlwZXtcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHN0YXRpYyB0eXBlTmFtZSA9IFwifnN0cmluZ1wiO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVW5kZXJzdGFuZGluZ3tcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHN0YXRpYyB0eXBlTmFtZSA9IFwifnVuZGVyc3RhbmRpbmdcIjtcclxuXHJcbiAgICBzdGF0aWMgZGVzY3JpYmluZyA9IFwifmRlc2NyaWJpbmdcIjsgIFxyXG4gICAgc3RhdGljIG1vdmluZyA9IFwifm1vdmluZ1wiO1xyXG4gICAgc3RhdGljIGRpcmVjdGlvbiA9IFwifmRpcmVjdGlvblwiO1xyXG4gICAgc3RhdGljIHRha2luZyA9IFwifnRha2luZ1wiO1xyXG4gICAgc3RhdGljIGludmVudG9yeSA9IFwifmludmVudG9yeVwiO1xyXG4gICAgc3RhdGljIGRyb3BwaW5nID0gXCJ+ZHJvcHBpbmdcIjtcclxuXHJcbiAgICBzdGF0aWMgYWN0aW9uID0gXCJ+YWN0aW9uXCI7XHJcbiAgICBzdGF0aWMgbWVhbmluZyA9IFwifm1lYW5pbmdcIjsgIFxyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRPYmplY3Qge1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+d29ybGRPYmplY3RcIjtcclxuXHJcbiAgICBzdGF0aWMgZGVzY3JpcHRpb24gPSBcIn5kZXNjcmlwdGlvblwiO1xyXG4gICAgc3RhdGljIGNvbnRlbnRzID0gXCJ+Y29udGVudHNcIjsgICAgXHJcbiAgICBzdGF0aWMgb2JzZXJ2YXRpb24gPSBcIn5vYnNlcnZhdGlvblwiO1xyXG5cclxuICAgIHN0YXRpYyBkZXNjcmliZSA9IFwifmRlc2NyaWJlXCI7XHJcbiAgICBzdGF0aWMgb2JzZXJ2ZSA9IFwifm9ic2VydmVcIjtcclxuICAgIFxyXG4gICAgc3RhdGljIHZpc2libGUgPSBcIn52aXNpYmxlXCI7XHJcbn0iLCJpbXBvcnQgeyBUYWxvbklkZSB9IGZyb20gXCIuL1RhbG9uSWRlXCI7XHJcblxyXG5cclxudmFyIGlkZSA9IG5ldyBUYWxvbklkZSgpOyIsImV4cG9ydCBlbnVtIEV2YWx1YXRpb25SZXN1bHR7XHJcbiAgICBDb250aW51ZSxcclxuICAgIFN1c3BlbmRGb3JJbnB1dFxyXG59IiwiaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9NZXRob2RcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IFN0YWNrRnJhbWUgfSBmcm9tIFwiLi9TdGFja0ZyYW1lXCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4uL2NvbW1vbi9JbnN0cnVjdGlvblwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZXRob2RBY3RpdmF0aW9ue1xyXG4gICAgbWV0aG9kPzpNZXRob2Q7XHJcbiAgICBzdGFja0ZyYW1lOlN0YWNrRnJhbWU7XHJcbiAgICBzdGFjazpSdW50aW1lQW55W10gPSBbXTtcclxuXHJcbiAgICBzdGFja1NpemUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdGFjay5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcGVlaygpe1xyXG4gICAgICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgU3RhY2sgSW1iYWxhbmNlISBBdHRlbXB0ZWQgdG8gcGVlayBhbiBlbXB0eSBzdGFjay5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV07XHJcbiAgICB9XHJcblxyXG4gICAgcG9wKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBTdGFjayBJbWJhbGFuY2UhIEF0dGVtcHRlZCB0byBwb3AgYW4gZW1wdHkgc3RhY2suYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5zdGFjay5wb3AoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdXNoKHJ1bnRpbWVBbnk6UnVudGltZUFueSl7XHJcbiAgICAgICAgdGhpcy5zdGFjay5wdXNoKHJ1bnRpbWVBbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1ldGhvZDpNZXRob2Qpe1xyXG4gICAgICAgIHRoaXMubWV0aG9kID0gbWV0aG9kO1xyXG4gICAgICAgIHRoaXMuc3RhY2tGcmFtZSA9IG5ldyBTdGFja0ZyYW1lKG1ldGhvZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBPcENvZGVIYW5kbGVye1xyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgY29kZTpPcENvZGU7XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBsb2dJbnRlcmFjdGlvbih0aHJlYWQ6VGhyZWFkLCAuLi5wYXJhbWV0ZXJzOmFueVtdKXtcclxuICAgICAgICBsZXQgZm9ybWF0dGVkTGluZSA9IHRoaXMuY29kZS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICBpZiAocGFyYW1ldGVycyAmJiBwYXJhbWV0ZXJzLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICBmb3JtYXR0ZWRMaW5lICs9ICcgJyArIHBhcmFtZXRlcnMuam9pbignICcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1Zyhmb3JtYXR0ZWRMaW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuQ29udGludWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuL2xpYnJhcnkvVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9NZXRob2RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdGFja0ZyYW1le1xyXG4gICAgbG9jYWxzOlZhcmlhYmxlW10gPSBbXTtcclxuICAgIGN1cnJlbnRJbnN0cnVjdGlvbjpudW1iZXIgPSAtMTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXRob2Q6TWV0aG9kKXtcclxuICAgICAgICBmb3IodmFyIHBhcmFtZXRlciBvZiBtZXRob2QucGFyYW1ldGVycyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlID0gbmV3IFZhcmlhYmxlKHBhcmFtZXRlci5uYW1lLCBwYXJhbWV0ZXIudHlwZSEpO1xyXG4gICAgICAgICAgICB0aGlzLmxvY2Fscy5wdXNoKHZhcmlhYmxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBFbnRyeVBvaW50QXR0cmlidXRlIH0gZnJvbSBcIi4uL2xpYnJhcnkvRW50cnlQb2ludEF0dHJpYnV0ZVwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgTWV0aG9kQWN0aXZhdGlvbiB9IGZyb20gXCIuL01ldGhvZEFjdGl2YXRpb25cIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUHJpbnRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvUHJpbnRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IE5vT3BIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTm9PcEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZFN0cmluZ0hhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkU3RyaW5nSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBOZXdJbnN0YW5jZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9OZXdJbnN0YW5jZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZUNvbW1hbmQgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVDb21tYW5kXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgUmVhZElucHV0SGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1JlYWRJbnB1dEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUGFyc2VDb21tYW5kSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1BhcnNlQ29tbWFuZEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgR29Ub0hhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Hb1RvSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBIYW5kbGVDb21tYW5kSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0hhbmRsZUNvbW1hbmRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYWNlIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lUGxhY2VcIjtcclxuaW1wb3J0IHsgUnVudGltZUJvb2xlYW4gfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVCb29sZWFuXCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuLi9saWJyYXJ5L1BsYXllclwiO1xyXG5pbXBvcnQgeyBTYXkgfSBmcm9tIFwiLi4vbGlicmFyeS9TYXlcIjtcclxuaW1wb3J0IHsgUnVudGltZUVtcHR5IH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lRW1wdHlcIjtcclxuaW1wb3J0IHsgUmV0dXJuSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1JldHVybkhhbmRsZXJcIjtcclxuaW1wb3J0IHsgU3RhdGljQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9TdGF0aWNDYWxsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGF5ZXIgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgTG9hZEluc3RhbmNlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRJbnN0YW5jZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZE51bWJlckhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkTnVtYmVySGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJbnN0YW5jZUNhbGxIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvSW5zdGFuY2VDYWxsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkUHJvcGVydHlIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZFByb3BlcnR5SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkRmllbGRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZEZpZWxkSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBFeHRlcm5hbENhbGxIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvRXh0ZXJuYWxDYWxsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkTG9jYWxIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZExvY2FsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJTG9nT3V0cHV0IH0gZnJvbSBcIi4vSUxvZ091dHB1dFwiO1xyXG5pbXBvcnQgeyBMb2FkVGhpc0hhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkVGhpc0hhbmRsZXJcIjtcclxuaW1wb3J0IHsgQnJhbmNoUmVsYXRpdmVIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvQnJhbmNoUmVsYXRpdmVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEJyYW5jaFJlbGF0aXZlSWZGYWxzZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9CcmFuY2hSZWxhdGl2ZUlmRmFsc2VIYW5kbGVyXCI7XHJcbmltcG9ydCB7IENvbmNhdGVuYXRlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0NvbmNhdGVuYXRlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBBc3NpZ25WYXJpYWJsZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Bc3NpZ25WYXJpYWJsZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVHlwZU9mSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1R5cGVPZkhhbmRsZXJcIjtcclxuaW1wb3J0IHsgSW52b2tlRGVsZWdhdGVIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvSW52b2tlRGVsZWdhdGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IENvbXBhcmlzb25IYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvQ29tcGFyaXNvbkhhbmRsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvblJ1bnRpbWV7XHJcblxyXG4gICAgcHJpdmF0ZSB0aHJlYWQ/OlRocmVhZDtcclxuICAgIHByaXZhdGUgaGFuZGxlcnM6TWFwPE9wQ29kZSwgT3BDb2RlSGFuZGxlcj4gPSBuZXcgTWFwPE9wQ29kZSwgT3BDb2RlSGFuZGxlcj4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHVzZXJPdXRwdXQ6SU91dHB1dCwgcHJpdmF0ZSByZWFkb25seSBsb2dPdXRwdXQ/OklMb2dPdXRwdXQpe1xyXG4gICAgICAgIHRoaXMudXNlck91dHB1dCA9IHVzZXJPdXRwdXQ7XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Ob09wLCBuZXcgTm9PcEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRTdHJpbmcsIG5ldyBMb2FkU3RyaW5nSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuUHJpbnQsIG5ldyBQcmludEhhbmRsZXIodGhpcy51c2VyT3V0cHV0KSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLk5ld0luc3RhbmNlLCBuZXcgTmV3SW5zdGFuY2VIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5SZWFkSW5wdXQsIG5ldyBSZWFkSW5wdXRIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5QYXJzZUNvbW1hbmQsIG5ldyBQYXJzZUNvbW1hbmRIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5IYW5kbGVDb21tYW5kLCBuZXcgSGFuZGxlQ29tbWFuZEhhbmRsZXIodGhpcy51c2VyT3V0cHV0KSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkdvVG8sIG5ldyBHb1RvSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuUmV0dXJuLCBuZXcgUmV0dXJuSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuU3RhdGljQ2FsbCwgbmV3IFN0YXRpY0NhbGxIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkSW5zdGFuY2UsIG5ldyBMb2FkSW5zdGFuY2VIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkTnVtYmVyLCBuZXcgTG9hZE51bWJlckhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkluc3RhbmNlQ2FsbCwgbmV3IEluc3RhbmNlQ2FsbEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRQcm9wZXJ0eSwgbmV3IExvYWRQcm9wZXJ0eUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRGaWVsZCwgbmV3IExvYWRGaWVsZEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkV4dGVybmFsQ2FsbCwgbmV3IEV4dGVybmFsQ2FsbEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRMb2NhbCwgbmV3IExvYWRMb2NhbEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRUaGlzLCBuZXcgTG9hZFRoaXNIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5CcmFuY2hSZWxhdGl2ZSwgbmV3IEJyYW5jaFJlbGF0aXZlSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuQnJhbmNoUmVsYXRpdmVJZkZhbHNlLCBuZXcgQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuQ29uY2F0ZW5hdGUsIG5ldyBDb25jYXRlbmF0ZUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkFzc2lnbiwgbmV3IEFzc2lnblZhcmlhYmxlSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuVHlwZU9mLCBuZXcgVHlwZU9mSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuSW52b2tlRGVsZWdhdGUsIG5ldyBJbnZva2VEZWxlZ2F0ZUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkNvbXBhcmVFcXVhbCwgbmV3IENvbXBhcmlzb25IYW5kbGVyKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCl7XHJcbiAgICAgICAgaWYgKHRoaXMudGhyZWFkPy5hbGxUeXBlcy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgIHRoaXMudGhyZWFkLmxvZz8uZGVidWcoXCJVbmFibGUgdG8gc3RhcnQgcnVudGltZSB3aXRob3V0IHR5cGVzLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGxhY2VzID0gdGhpcy50aHJlYWQ/LmFsbFR5cGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LmJhc2VUeXBlTmFtZSA9PSBQbGFjZS50eXBlTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCh4ID0+IDxSdW50aW1lUGxheWVyPk1lbW9yeS5hbGxvY2F0ZSh4KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGdldFBsYXllclN0YXJ0ID0gKHBsYWNlOlJ1bnRpbWVQbGFjZSkgPT4gPFJ1bnRpbWVCb29sZWFuPihwbGFjZS5maWVsZHMuZ2V0KFBsYWNlLmlzUGxheWVyU3RhcnQpPy52YWx1ZSk7XHJcbiAgICAgICAgY29uc3QgaXNQbGF5ZXJTdGFydCA9IChwbGFjZTpSdW50aW1lUGxhY2UpID0+IGdldFBsYXllclN0YXJ0KHBsYWNlKT8udmFsdWUgPT09IHRydWU7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRQbGFjZSA9IHBsYWNlcz8uZmluZChpc1BsYXllclN0YXJ0KTtcclxuXHJcbiAgICAgICAgdGhpcy50aHJlYWQhLmN1cnJlbnRQbGFjZSA9IGN1cnJlbnRQbGFjZTtcclxuXHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy50aHJlYWQ/Lmtub3duVHlwZXMuZ2V0KFBsYXllci50eXBlTmFtZSkhO1xyXG5cclxuICAgICAgICB0aGlzLnRocmVhZCEuY3VycmVudFBsYXllciA9IDxSdW50aW1lUGxheWVyPk1lbW9yeS5hbGxvY2F0ZShwbGF5ZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnJ1bldpdGgoXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcCgpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBsb2FkRnJvbSh0eXBlczpUeXBlW10pe1xyXG4gICAgICAgIGlmICh0eXBlcy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgIHRoaXMubG9nT3V0cHV0Py5kZWJ1ZyhcIk5vIHR5cGVzIHdlcmUgcHJvdmlkZWQsIHVuYWJsZSB0byBsb2FkIHJ1bnRpbWUhXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBNZW1vcnkuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgbG9hZGVkVHlwZXMgPSBNZW1vcnkubG9hZFR5cGVzKHR5cGVzKTtcclxuXHJcbiAgICAgICAgY29uc3QgZW50cnlQb2ludCA9IGxvYWRlZFR5cGVzLmZpbmQoeCA9PiB4LmF0dHJpYnV0ZXMuZmluZEluZGV4KGF0dHJpYnV0ZSA9PiBhdHRyaWJ1dGUgaW5zdGFuY2VvZiBFbnRyeVBvaW50QXR0cmlidXRlKSA+IC0xKTtcclxuICAgICAgICBjb25zdCBtYWluTWV0aG9kID0gZW50cnlQb2ludD8ubWV0aG9kcy5maW5kKHggPT4geC5uYW1lID09IEFueS5tYWluKTsgICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRpb24gPSBuZXcgTWV0aG9kQWN0aXZhdGlvbihtYWluTWV0aG9kISk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50aHJlYWQgPSBuZXcgVGhyZWFkKGxvYWRlZFR5cGVzLCBhY3RpdmF0aW9uKTsgIFxyXG4gICAgICAgIHRoaXMudGhyZWFkLmxvZyA9IHRoaXMubG9nT3V0cHV0OyAgICAgIFxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZW5kQ29tbWFuZChpbnB1dDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMucnVuV2l0aChpbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBydW5XaXRoKGNvbW1hbmQ6c3RyaW5nKXtcclxuICAgICAgICBcclxuICAgICAgICAvLyBXZSdyZSBnb2luZyB0byBrZWVwIHRoZWlyIGNvbW1hbmQgaW4gdGhlIHZpc3VhbCBoaXN0b3J5IHRvIG1ha2UgdGhpbmdzIGVhc2llciB0byB1bmRlcnN0YW5kLlxyXG5cclxuICAgICAgICB0aGlzLnVzZXJPdXRwdXQud3JpdGUoY29tbWFuZCk7XHJcblxyXG4gICAgICAgIC8vIE5vdyB3ZSBjYW4gZ28gYWhlYWQgYW5kIHByb2Nlc3MgdGhlaXIgY29tbWFuZC5cclxuXHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSB0aGlzLnRocmVhZCEuY3VycmVudEluc3RydWN0aW9uO1xyXG5cclxuICAgICAgICBpZiAoaW5zdHJ1Y3Rpb24/Lm9wQ29kZSA9PSBPcENvZGUuUmVhZElucHV0KXtcclxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhjb21tYW5kKTtcclxuICAgICAgICAgICAgdGhpcy50aHJlYWQ/LmN1cnJlbnRNZXRob2QucHVzaCh0ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGhyZWFkPy5tb3ZlTmV4dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMudGhyZWFkPy5jdXJyZW50SW5zdHJ1Y3Rpb24gPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhpcy50aHJlYWQ/Lm1vdmVOZXh0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50aHJlYWQ/LmN1cnJlbnRJbnN0cnVjdGlvbiA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGV4ZWN1dGUgY29tbWFuZCwgbm8gaW5zdHJ1Y3Rpb24gZm91bmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaW5zdHJ1Y3Rpb24gPSB0aGlzLmV2YWx1YXRlQ3VycmVudEluc3RydWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbiA9PSBFdmFsdWF0aW9uUmVzdWx0LkNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24gPSB0aGlzLmV2YWx1YXRlQ3VycmVudEluc3RydWN0aW9uKCkpe1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudGhyZWFkPy5tb3ZlTmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaChleCl7XHJcbiAgICAgICAgICAgIGlmIChleCBpbnN0YW5jZW9mIFJ1bnRpbWVFcnJvcil7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ091dHB1dD8uZGVidWcoYFJ1bnRpbWUgRXJyb3I6ICR7ZXgubWVzc2FnZX1gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nT3V0cHV0Py5kZWJ1ZyhgU3RhY2sgVHJhY2U6ICR7ZXguc3RhY2t9YCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ091dHB1dD8uZGVidWcoYEVuY291bnRlcmVkIHVuaGFuZGxlZCBlcnJvcjogJHtleH1gKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBldmFsdWF0ZUN1cnJlbnRJbnN0cnVjdGlvbigpe1xyXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uID0gdGhpcy50aHJlYWQ/LmN1cnJlbnRJbnN0cnVjdGlvbjtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHRoaXMuaGFuZGxlcnMuZ2V0KGluc3RydWN0aW9uPy5vcENvZGUhKTtcclxuXHJcbiAgICAgICAgaWYgKGhhbmRsZXIgPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgRW5jb3VudGVyZWQgdW5zdXBwb3J0ZWQgT3BDb2RlICcke2luc3RydWN0aW9uPy5vcENvZGV9J2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gaGFuZGxlcj8uaGFuZGxlKHRoaXMudGhyZWFkISk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9VbmRlcnN0YW5kaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGFjZSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZVBsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGF5ZXIgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZUVtcHR5IH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lRW1wdHlcIjtcclxuaW1wb3J0IHsgSUxvZ091dHB1dCB9IGZyb20gXCIuL0lMb2dPdXRwdXRcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9NZXRob2RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUaHJlYWR7XHJcbiAgICBhbGxUeXBlczpUeXBlW10gPSBbXTtcclxuICAgIGtub3duVHlwZXM6TWFwPHN0cmluZywgVHlwZT4gPSBuZXcgTWFwPHN0cmluZywgVHlwZT4oKTtcclxuICAgIGtub3duVW5kZXJzdGFuZGluZ3M6VHlwZVtdID0gW107XHJcbiAgICBrbm93blBsYWNlczpSdW50aW1lUGxhY2VbXSA9IFtdO1xyXG4gICAgbWV0aG9kczpNZXRob2RBY3RpdmF0aW9uW10gPSBbXTtcclxuICAgIGN1cnJlbnRQbGFjZT86UnVudGltZVBsYWNlO1xyXG4gICAgY3VycmVudFBsYXllcj86UnVudGltZVBsYXllcjtcclxuICAgIGxvZz86SUxvZ091dHB1dDtcclxuICAgIFxyXG4gICAgZ2V0IGN1cnJlbnRNZXRob2QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWV0aG9kc1t0aGlzLm1ldGhvZHMubGVuZ3RoIC0gMV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnJlbnRJbnN0cnVjdGlvbigpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gdGhpcy5jdXJyZW50TWV0aG9kO1xyXG4gICAgICAgIHJldHVybiBhY3RpdmF0aW9uLm1ldGhvZD8uYm9keVthY3RpdmF0aW9uLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uXTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlczpUeXBlW10sIG1ldGhvZDpNZXRob2RBY3RpdmF0aW9uKXtcclxuICAgICAgICB0aGlzLmFsbFR5cGVzID0gdHlwZXM7XHJcbiAgICAgICAgdGhpcy5rbm93blR5cGVzID0gbmV3IE1hcDxzdHJpbmcsIFR5cGU+KHR5cGVzLm1hcCh0eXBlID0+IFt0eXBlLm5hbWUsIHR5cGVdKSk7XHJcbiAgICAgICAgdGhpcy5rbm93blVuZGVyc3RhbmRpbmdzID0gdHlwZXMuZmlsdGVyKHggPT4geC5iYXNlVHlwZU5hbWUgPT09IFVuZGVyc3RhbmRpbmcudHlwZU5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5wdXNoKG1ldGhvZCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3VycmVudEluc3RydWN0aW9uVmFsdWVBczxUPigpe1xyXG4gICAgICAgIHJldHVybiA8VD50aGlzLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGl2YXRlTWV0aG9kKG1ldGhvZDpNZXRob2Qpe1xyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRpb24gPSBuZXcgTWV0aG9kQWN0aXZhdGlvbihtZXRob2QpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmN1cnJlbnRNZXRob2Q7XHJcblxyXG4gICAgICAgIHRoaXMubG9nPy5kZWJ1ZyhgJHtjdXJyZW50Lm1ldGhvZD8ubmFtZX0gPT4gJHttZXRob2QubmFtZX1gKTtcclxuXHJcbiAgICAgICAgdGhpcy5tZXRob2RzLnB1c2goYWN0aXZhdGlvbik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdmVOZXh0KCl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uKys7XHJcbiAgICB9XHJcblxyXG4gICAganVtcFRvTGluZShsaW5lTnVtYmVyOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uID0gbGluZU51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm5Gcm9tQ3VycmVudE1ldGhvZCgpe1xyXG4gICAgICAgIGNvbnN0IGV4cGVjdFJldHVyblR5cGUgPSB0aGlzLmN1cnJlbnRNZXRob2QubWV0aG9kIS5yZXR1cm5UeXBlICE9IFwiXCI7XHJcbiAgICAgICAgY29uc3QgcmV0dXJuZWRNZXRob2QgPSB0aGlzLm1ldGhvZHMucG9wKCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9nPy5kZWJ1ZyhgJHt0aGlzLmN1cnJlbnRNZXRob2QubWV0aG9kPy5uYW1lfSA8PSAke3JldHVybmVkTWV0aG9kPy5tZXRob2Q/Lm5hbWV9YCk7XHJcblxyXG4gICAgICAgIGlmICghZXhwZWN0UmV0dXJuVHlwZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUnVudGltZUVtcHR5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXR1cm5WYWx1ZSA9IHJldHVybmVkTWV0aG9kPy5zdGFjay5wb3AoKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWUhO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGFjZSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVQbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRW1wdHkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lRW1wdHlcIjtcclxuaW1wb3J0IHsgUnVudGltZUNvbW1hbmQgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQ29tbWFuZFwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVCb29sZWFuIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUJvb2xlYW5cIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgUnVudGltZUxpc3QgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lTGlzdFwiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvSXRlbVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lSXRlbSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJdGVtXCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYXllclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxheWVyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVBsYXllclwiO1xyXG5pbXBvcnQgeyBTYXkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9TYXlcIjtcclxuaW1wb3J0IHsgUnVudGltZVNheSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTYXlcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9NZXRob2RcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBOdW1iZXJUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTnVtYmVyVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRGVjb3JhdGlvbiB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVEZWNvcmF0aW9uXCI7XHJcbmltcG9ydCB7IERlY29yYXRpb24gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9EZWNvcmF0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWVtb3J5e1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdHlwZXNCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgVHlwZT4oKTtcclxuICAgIHByaXZhdGUgc3RhdGljIGhlYXAgPSBuZXcgTWFwPHN0cmluZywgUnVudGltZUFueVtdPigpO1xyXG5cclxuICAgIHN0YXRpYyBjbGVhcigpe1xyXG4gICAgICAgIE1lbW9yeS50eXBlc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlPigpO1xyXG4gICAgICAgIE1lbW9yeS5oZWFwID0gbmV3IE1hcDxzdHJpbmcsIFJ1bnRpbWVBbnlbXT4oKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZmluZEluc3RhbmNlQnlOYW1lKG5hbWU6c3RyaW5nKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZXMgPSBNZW1vcnkuaGVhcC5nZXQobmFtZSk7XHJcblxyXG4gICAgICAgIGlmICghaW5zdGFuY2VzIHx8IGluc3RhbmNlcy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJPYmplY3Qgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGluc3RhbmNlcy5sZW5ndGggPiAxKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIkxvY2F0ZWQgbW9yZSB0aGFuIG9uZSBpbnN0YW5jZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZXNbMF07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRUeXBlcyh0eXBlczpUeXBlW10pe1xyXG4gICAgICAgIE1lbW9yeS50eXBlc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlPih0eXBlcy5tYXAoeCA9PiBbeC5uYW1lLCB4XSkpOyAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIE92ZXJyaWRlIGFueSBwcm92aWRlZCB0eXBlIHN0dWJzIHdpdGggdGhlIGFjdHVhbCBydW50aW1lIHR5cGUgZGVmaW5pdGlvbnMuXHJcblxyXG4gICAgICAgIGNvbnN0IHBsYWNlID0gUnVudGltZVBsYWNlLnR5cGU7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IFJ1bnRpbWVJdGVtLnR5cGU7XHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gUnVudGltZVBsYXllci50eXBlO1xyXG4gICAgICAgIGNvbnN0IGRlY29yYXRpb24gPSBSdW50aW1lRGVjb3JhdGlvbi50eXBlO1xyXG5cclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUuc2V0KHBsYWNlLm5hbWUsIHBsYWNlKTtcclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUuc2V0KGl0ZW0ubmFtZSwgaXRlbSk7XHJcbiAgICAgICAgTWVtb3J5LnR5cGVzQnlOYW1lLnNldChwbGF5ZXIubmFtZSwgcGxheWVyKTsgIFxyXG4gICAgICAgIE1lbW9yeS50eXBlc0J5TmFtZS5zZXQoZGVjb3JhdGlvbi5uYW1lLCBkZWNvcmF0aW9uKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShNZW1vcnkudHlwZXNCeU5hbWUudmFsdWVzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZUNvbW1hbmQoKTpSdW50aW1lQ29tbWFuZHtcclxuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVDb21tYW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG9jYXRlQm9vbGVhbih2YWx1ZTpib29sZWFuKTpSdW50aW1lQm9vbGVhbntcclxuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVCb29sZWFuKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGVOdW1iZXIodmFsdWU6bnVtYmVyKTpSdW50aW1lSW50ZWdlcntcclxuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVJbnRlZ2VyKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGVTdHJpbmcodGV4dDpzdHJpbmcpOlJ1bnRpbWVTdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lU3RyaW5nKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZSh0eXBlOlR5cGUpOlJ1bnRpbWVBbnl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBNZW1vcnkuY29uc3RydWN0SW5zdGFuY2VGcm9tKHR5cGUpO1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZVBvb2wgPSBNZW1vcnkuaGVhcC5nZXQodHlwZS5uYW1lKSB8fCBbXTtcclxuXHJcbiAgICAgICAgaW5zdGFuY2VQb29sLnB1c2goaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICBNZW1vcnkuaGVhcC5zZXQodHlwZS5uYW1lLCBpbnN0YW5jZVBvb2wpO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5pdGlhbGl6ZVZhcmlhYmxlV2l0aChmaWVsZDpGaWVsZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhcmlhYmxlID0gTWVtb3J5LmNvbnN0cnVjdFZhcmlhYmxlRnJvbShmaWVsZCk7ICAgICAgICBcclxuICAgICAgICB2YXJpYWJsZS52YWx1ZSA9IE1lbW9yeS5pbnN0YW50aWF0ZURlZmF1bHRWYWx1ZUZvcih2YXJpYWJsZSwgZmllbGQuZGVmYXVsdFZhbHVlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZhcmlhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNvbnN0cnVjdFZhcmlhYmxlRnJvbShmaWVsZDpGaWVsZCl7XHJcbiAgICAgICAgaWYgKGZpZWxkLnR5cGUpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhcmlhYmxlKGZpZWxkLm5hbWUsIGZpZWxkLnR5cGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHlwZSA9IE1lbW9yeS50eXBlc0J5TmFtZS5nZXQoZmllbGQudHlwZU5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoIXR5cGUpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBVbmFibGUgdG8gY29uc3RydWN0IHVua25vd24gdHlwZSAnJHtmaWVsZC50eXBlTmFtZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFZhcmlhYmxlKGZpZWxkLm5hbWUsIHR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbnRpYXRlRGVmYXVsdFZhbHVlRm9yKHZhcmlhYmxlOlZhcmlhYmxlLCBkZWZhdWx0VmFsdWU6T2JqZWN0fHVuZGVmaW5lZCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3dpdGNoKHZhcmlhYmxlLnR5cGUhLm5hbWUpe1xyXG4gICAgICAgICAgICBjYXNlIFN0cmluZ1R5cGUudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVN0cmluZyhkZWZhdWx0VmFsdWUgPyA8c3RyaW5nPmRlZmF1bHRWYWx1ZSA6IFwiXCIpO1xyXG4gICAgICAgICAgICBjYXNlIEJvb2xlYW5UeXBlLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVCb29sZWFuKGRlZmF1bHRWYWx1ZSA/IDxib29sZWFuPmRlZmF1bHRWYWx1ZSA6IGZhbHNlKTtcclxuICAgICAgICAgICAgY2FzZSBOdW1iZXJUeXBlLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVJbnRlZ2VyKGRlZmF1bHRWYWx1ZSA/IDxudW1iZXI+ZGVmYXVsdFZhbHVlIDogMCk7XHJcbiAgICAgICAgICAgIGNhc2UgTGlzdC50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lTGlzdChkZWZhdWx0VmFsdWUgPyB0aGlzLmluc3RhbnRpYXRlTGlzdCg8T2JqZWN0W10+ZGVmYXVsdFZhbHVlKSA6IFtdKTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUnVudGltZUVtcHR5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbnRpYXRlTGlzdChpdGVtczpPYmplY3RbXSl7XHJcbiAgICAgICAgY29uc3QgcnVudGltZUl0ZW1zOlJ1bnRpbWVBbnlbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IoY29uc3QgaXRlbSBvZiBpdGVtcyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1MaXN0ID0gPE9iamVjdFtdPml0ZW07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gPG51bWJlcj5pdGVtTGlzdFswXTtcclxuICAgICAgICAgICAgY29uc3QgdHlwZU5hbWUgPSA8c3RyaW5nPml0ZW1MaXN0WzFdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHlwZSA9IE1lbW9yeS50eXBlc0J5TmFtZS5nZXQodHlwZU5hbWUpITtcclxuXHJcbiAgICAgICAgICAgIGZvcihsZXQgY3VycmVudCA9IDA7IGN1cnJlbnQgPCBjb3VudDsgY3VycmVudCsrKXsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IE1lbW9yeS5hbGxvY2F0ZSh0eXBlKTtcclxuICAgICAgICAgICAgICAgIHJ1bnRpbWVJdGVtcy5wdXNoKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJ1bnRpbWVJdGVtcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjb25zdHJ1Y3RJbnN0YW5jZUZyb20odHlwZTpUeXBlKXtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc2VlblR5cGVzID0gbmV3IFNldDxzdHJpbmc+KCk7XHJcbiAgICAgICAgbGV0IGluaGVyaXRhbmNlQ2hhaW46VHlwZVtdID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgY3VycmVudDpUeXBlfHVuZGVmaW5lZCA9IHR5cGU7IFxyXG4gICAgICAgICAgICBjdXJyZW50OyBcclxuICAgICAgICAgICAgY3VycmVudCA9IE1lbW9yeS50eXBlc0J5TmFtZS5nZXQoY3VycmVudC5iYXNlVHlwZU5hbWUpKXtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYgKHNlZW5UeXBlcy5oYXMoY3VycmVudC5uYW1lKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIllvdSBjYW4ndCBoYXZlIGN5Y2xlcyBpbiBhIHR5cGUgaGllcmFyY2h5XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHNlZW5UeXBlcy5hZGQoY3VycmVudC5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGluaGVyaXRhbmNlQ2hhaW4ucHVzaChjdXJyZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGZpcnN0U3lzdGVtVHlwZUFuY2VzdG9ySW5kZXggPSBpbmhlcml0YW5jZUNoYWluLmZpbmRJbmRleCh4ID0+IHguaXNTeXN0ZW1UeXBlKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGlmIChmaXJzdFN5c3RlbVR5cGVBbmNlc3RvckluZGV4IDwgMCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJUeXBlIG11c3QgdWx0aW1hdGVseSBpbmhlcml0IGZyb20gYSBzeXN0ZW0gdHlwZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5hbGxvY2F0ZVN5c3RlbVR5cGVCeU5hbWUoaW5oZXJpdGFuY2VDaGFpbltmaXJzdFN5c3RlbVR5cGVBbmNlc3RvckluZGV4XS5uYW1lKTtcclxuICAgICAgICBcclxuICAgICAgICBpbnN0YW5jZS5wYXJlbnRUeXBlTmFtZSA9IGluc3RhbmNlLnR5cGVOYW1lO1xyXG4gICAgICAgIGluc3RhbmNlLnR5cGVOYW1lID0gaW5oZXJpdGFuY2VDaGFpblswXS5uYW1lO1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBJbmhlcml0IG1vcmUgdGhhbiBqdXN0IGZpZWxkcy9tZXRob2RzLlxyXG4gICAgICAgIC8vIFRPRE86IFR5cGUgY2hlY2sgZmllbGQgaW5oZXJpdGFuY2UgZm9yIHNoYWRvd2luZy9vdmVycmlkaW5nLlxyXG5cclxuICAgICAgICAvLyBJbmhlcml0IGZpZWxkcy9tZXRob2RzIGZyb20gdHlwZXMgaW4gdGhlIGhpZXJhcmNoeSBmcm9tIGxlYXN0IHRvIG1vc3QgZGVyaXZlZC5cclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IGkgPSBmaXJzdFN5c3RlbVR5cGVBbmNlc3RvckluZGV4OyBpID49IDA7IGktLSl7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUeXBlID0gaW5oZXJpdGFuY2VDaGFpbltpXTtcclxuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBmaWVsZCBvZiBjdXJyZW50VHlwZS5maWVsZHMpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSB0aGlzLmluaXRpYWxpemVWYXJpYWJsZVdpdGgoZmllbGQpO1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuZmllbGRzLnNldChmaWVsZC5uYW1lLCB2YXJpYWJsZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBtZXRob2Qgb2YgY3VycmVudFR5cGUubWV0aG9kcyl7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5tZXRob2RzLnNldChtZXRob2QubmFtZSwgbWV0aG9kKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgYWxsb2NhdGVTeXN0ZW1UeXBlQnlOYW1lKHR5cGVOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgc3dpdGNoKHR5cGVOYW1lKXtcclxuICAgICAgICAgICAgY2FzZSBQbGFjZS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lUGxhY2UoKTtcclxuICAgICAgICAgICAgY2FzZSBJdGVtLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVJdGVtKCk7XHJcbiAgICAgICAgICAgIGNhc2UgUGxheWVyLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVQbGF5ZXIoKTtcclxuICAgICAgICAgICAgY2FzZSBMaXN0LnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVMaXN0KFtdKTsgICAgIFxyXG4gICAgICAgICAgICBjYXNlIFNheS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lU2F5KCk7ICAgIFxyXG4gICAgICAgICAgICBjYXNlIERlY29yYXRpb24udHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZURlY29yYXRpb24oKTsgICBcclxuICAgICAgICAgICAgZGVmYXVsdDp7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBVbmFibGUgdG8gaW5zdGFudGlhdGUgdHlwZSAnJHt0eXBlTmFtZX0nYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgUnVudGltZUVycm9yIGV4dGVuZHMgRXJyb3J7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFzc2lnblZhcmlhYmxlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcm90ZWN0ZWQgY29kZTogT3BDb2RlID0gT3BDb2RlLkFzc2lnbjtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQpO1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJ1bnRpbWVTdHJpbmcpe1xyXG4gICAgICAgICAgICBpbnN0YW5jZS52YWx1ZSA9ICg8UnVudGltZVN0cmluZz52YWx1ZSkudmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJ1bnRpbWVJbnRlZ2VyKXtcclxuICAgICAgICAgICAgaW5zdGFuY2UudmFsdWUgPSAoPFJ1bnRpbWVJbnRlZ2VyPnZhbHVlKS52YWx1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiRW5jb3VudGVyZWQgdW5zdXBwb3J0ZWQgdHlwZSBvbiB0aGUgc3RhY2tcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCcmFuY2hSZWxhdGl2ZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHJvdGVjdGVkIGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5CcmFuY2hSZWxhdGl2ZTtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpdmVBbW91bnQgPSA8bnVtYmVyPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCwgcmVsYXRpdmVBbW91bnQpO1xyXG5cclxuICAgICAgICB0aHJlYWQuanVtcFRvTGluZSh0aHJlYWQuY3VycmVudE1ldGhvZC5zdGFja0ZyYW1lLmN1cnJlbnRJbnN0cnVjdGlvbiArIHJlbGF0aXZlQW1vdW50KTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQm9vbGVhbiB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVCb29sZWFuXCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcm90ZWN0ZWQgY29kZTogT3BDb2RlID0gT3BDb2RlLkJyYW5jaFJlbGF0aXZlSWZGYWxzZTtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpdmVBbW91bnQgPSA8bnVtYmVyPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gPFJ1bnRpbWVCb29sZWFuPnRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCwgcmVsYXRpdmVBbW91bnQsICcvLycsIHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKCF2YWx1ZS52YWx1ZSl7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRocmVhZC5qdW1wVG9MaW5lKHRocmVhZC5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uICsgcmVsYXRpdmVBbW91bnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQm9vbGVhbiB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVCb29sZWFuXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21wYXJpc29uSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcm90ZWN0ZWQgY29kZTogT3BDb2RlID0gT3BDb2RlLkNvbXBhcmVFcXVhbDtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQpO1xyXG5cclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuICAgICAgICB2YXIgY29tcGFyYW5kID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJ1bnRpbWVTdHJpbmcgJiYgY29tcGFyYW5kIGluc3RhbmNlb2YgUnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IE1lbW9yeS5hbGxvY2F0ZUJvb2xlYW4oaW5zdGFuY2UudmFsdWUgPT0gY29tcGFyYW5kLnZhbHVlKTtcclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJ1bnRpbWVJbnRlZ2VyICYmIGNvbXBhcmFuZCBpbnN0YW5jZW9mIFJ1bnRpbWVJbnRlZ2VyKXtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gTWVtb3J5LmFsbG9jYXRlQm9vbGVhbihpbnN0YW5jZS52YWx1ZSA9PSBjb21wYXJhbmQudmFsdWUpO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgUnVudGltZUJvb2xlYW4gJiYgY29tcGFyYW5kIGluc3RhbmNlb2YgUnVudGltZUJvb2xlYW4pe1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBNZW1vcnkuYWxsb2NhdGVCb29sZWFuKGluc3RhbmNlLnZhbHVlID09IGNvbXBhcmFuZC52YWx1ZSk7XHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYEVuY291bnRlcmVkIHR5cGUgbWlzbWF0Y2ggb24gc3RhY2sgZHVyaW5nIGNvbXBhcmlzb246ICR7aW5zdGFuY2U/LnR5cGVOYW1lfSA9PSAke2NvbXBhcmFuZD8udHlwZU5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmNhdGVuYXRlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcm90ZWN0ZWQgY29kZTogT3BDb2RlID0gT3BDb2RlLkNvbmNhdGVuYXRlO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBsYXN0ID0gPFJ1bnRpbWVTdHJpbmc+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcbiAgICAgICAgY29uc3QgZmlyc3QgPSA8UnVudGltZVN0cmluZz50aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGZpcnN0LnZhbHVlLCBsYXN0LnZhbHVlKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29uY2F0ZW5hdGVkID0gTWVtb3J5LmFsbG9jYXRlU3RyaW5nKGZpcnN0LnZhbHVlICsgXCIgXCIgKyBsYXN0LnZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChjb25jYXRlbmF0ZWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuaW50ZXJmYWNlIElJbmRleGFibGV7XHJcbiAgICBbbmFtZTpzdHJpbmddOiguLi5hcmdzOlJ1bnRpbWVBbnlbXSk9PlJ1bnRpbWVBbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFeHRlcm5hbENhbGxIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHByb3RlY3RlZCBjb2RlOiBPcENvZGUgPSBPcENvZGUuRXh0ZXJuYWxDYWxsO1xyXG4gICAgXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMubG9jYXRlRnVuY3Rpb24oaW5zdGFuY2UhLCA8c3RyaW5nPm1ldGhvZE5hbWUpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCwgYCR7aW5zdGFuY2U/LnR5cGVOYW1lfTo6JHttZXRob2ROYW1lfSguLi4ke21ldGhvZC5sZW5ndGh9KWApO1xyXG5cclxuICAgICAgICBjb25zdCBhcmdzOlJ1bnRpbWVBbnlbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWV0aG9kLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgYXJncy5wdXNoKHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpISk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQgPSBtZXRob2QuY2FsbChpbnN0YW5jZSwgLi4uYXJncyk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2gocmVzdWx0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9jYXRlRnVuY3Rpb24oaW5zdGFuY2U6T2JqZWN0LCBtZXRob2ROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuICg8SUluZGV4YWJsZT5pbnN0YW5jZSlbbWV0aG9kTmFtZV07XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lSW50ZWdlciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJbnRlZ2VyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR29Ub0hhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHJvdGVjdGVkIGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5CcmFuY2hSZWxhdGl2ZTtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uTnVtYmVyID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCBpbnN0cnVjdGlvbk51bWJlcik7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgaW5zdHJ1Y3Rpb25OdW1iZXIgPT09IFwibnVtYmVyXCIpe1xyXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIGp1bXAgb25lIHByZXZpb3VzIHRvIHRoZSBkZXNpcmVkIGluc3RydWN0aW9uIGJlY2F1c2UgYWZ0ZXIgXHJcbiAgICAgICAgICAgIC8vIGV2YWx1YXRpbmcgdGhpcyBnb3RvIHdlJ2xsIG1vdmUgZm9yd2FyZCAod2hpY2ggd2lsbCBtb3ZlIHRvIHRoZSBkZXNpcmVkIG9uZSkuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aHJlYWQuanVtcFRvTGluZShpbnN0cnVjdGlvbk51bWJlciAtIDEpO1xyXG4gICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBnb3RvXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUNvbW1hbmQgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQ29tbWFuZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvVW5kZXJzdGFuZGluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lVW5kZXJzdGFuZGluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVVbmRlcnN0YW5kaW5nXCI7XHJcbmltcG9ydCB7IE1lYW5pbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9NZWFuaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVXb3JsZE9iamVjdCB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVXb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vSU91dHB1dFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lTGlzdCB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVMaXN0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGFjZSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVQbGFjZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYXllclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxheWVyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVBsYXllclwiO1xyXG5pbXBvcnQgeyBMb2FkUHJvcGVydHlIYW5kbGVyIH0gZnJvbSBcIi4vTG9hZFByb3BlcnR5SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBQcmludEhhbmRsZXIgfSBmcm9tIFwiLi9QcmludEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgSW5zdGFuY2VDYWxsSGFuZGxlciB9IGZyb20gXCIuL0luc3RhbmNlQ2FsbEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgRXZlbnRUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9FdmVudFR5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZURlbGVnYXRlIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZURlbGVnYXRlXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4uL2xpYnJhcnkvVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUl0ZW0gfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSXRlbVwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhhbmRsZUNvbW1hbmRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHByb3RlY3RlZCBjb2RlOiBPcENvZGUgPSBPcENvZGUuSGFuZGxlQ29tbWFuZDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dHB1dDpJT3V0cHV0KXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjb21tYW5kID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGlmICghKGNvbW1hbmQgaW5zdGFuY2VvZiBSdW50aW1lQ29tbWFuZCkpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBVbmFibGUgdG8gaGFuZGxlIGEgbm9uLWNvbW1hbmQsIGZvdW5kICcke2NvbW1hbmR9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhY3Rpb24gPSBjb21tYW5kLmFjdGlvbiEudmFsdWU7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0TmFtZSA9IGNvbW1hbmQudGFyZ2V0TmFtZSEudmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCBgJyR7YWN0aW9ufSAke3RhcmdldE5hbWV9J2ApO1xyXG5cclxuICAgICAgICBjb25zdCB1bmRlcnN0YW5kaW5nc0J5QWN0aW9uID0gbmV3IE1hcDxPYmplY3QsIFR5cGU+KHRocmVhZC5rbm93blVuZGVyc3RhbmRpbmdzLm1hcCh4ID0+IFt4LmZpZWxkcy5maW5kKGZpZWxkID0+IGZpZWxkLm5hbWUgPT0gVW5kZXJzdGFuZGluZy5hY3Rpb24pPy5kZWZhdWx0VmFsdWUhLCB4XSkpO1xyXG5cclxuICAgICAgICBjb25zdCB1bmRlcnN0YW5kaW5nID0gdW5kZXJzdGFuZGluZ3NCeUFjdGlvbi5nZXQoYWN0aW9uKTtcclxuXHJcbiAgICAgICAgaWYgKCF1bmRlcnN0YW5kaW5nKXtcclxuICAgICAgICAgICAgdGhpcy5vdXRwdXQud3JpdGUoXCJJIGRvbid0IGtub3cgaG93IHRvIGRvIHRoYXQuXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtZWFuaW5nRmllbGQgPSB1bmRlcnN0YW5kaW5nLmZpZWxkcy5maW5kKHggPT4geC5uYW1lID09IFVuZGVyc3RhbmRpbmcubWVhbmluZyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1lYW5pbmcgPSB0aGlzLmRldGVybWluZU1lYW5pbmdGb3IoPHN0cmluZz5tZWFuaW5nRmllbGQ/LmRlZmF1bHRWYWx1ZSEpO1xyXG4gICAgICAgIGNvbnN0IGFjdHVhbFRhcmdldCA9IHRoaXMuaW5mZXJUYXJnZXRGcm9tKHRocmVhZCwgdGFyZ2V0TmFtZSwgbWVhbmluZyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCFhY3R1YWxUYXJnZXQpe1xyXG4gICAgICAgICAgICB0aGlzLm91dHB1dC53cml0ZShcIkkgZG9uJ3Qga25vdyB3aGF0IHlvdSdyZSByZWZlcnJpbmcgdG8uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2l0Y2gobWVhbmluZyl7XHJcbiAgICAgICAgICAgIGNhc2UgTWVhbmluZy5EZXNjcmliaW5nOntcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpYmUodGhyZWFkLCBhY3R1YWxUYXJnZXQsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTWVhbmluZy5Nb3Zpbmc6IHsgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0UGxhY2UgPSA8UnVudGltZVBsYWNlPmFjdHVhbFRhcmdldDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQbGFjZSA9IHRocmVhZC5jdXJyZW50UGxhY2U7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRQbGFjZSA9IG5leHRQbGFjZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZSh0aHJlYWQsIGFjdHVhbFRhcmdldCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYWlzZUV2ZW50KHRocmVhZCwgbmV4dFBsYWNlLCBFdmVudFR5cGUuUGxheWVyRW50ZXJzUGxhY2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYWlzZUV2ZW50KHRocmVhZCwgY3VycmVudFBsYWNlISwgRXZlbnRUeXBlLlBsYXllckV4aXRzUGxhY2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBNZWFuaW5nLlRha2luZzoge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEoYWN0dWFsVGFyZ2V0IGluc3RhbmNlb2YgUnVudGltZUl0ZW0pKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dC53cml0ZShcIkkgY2FuJ3QgdGFrZSB0aGF0LlwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IHRocmVhZC5jdXJyZW50UGxhY2UhLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgICAgIGxpc3QuaXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGFyZ2V0TmFtZS50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW52ZW50b3J5ID0gdGhyZWFkLmN1cnJlbnRQbGF5ZXIhLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgICAgIGludmVudG9yeS5pdGVtcy5wdXNoKGFjdHVhbFRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZSh0aHJlYWQsIHRocmVhZC5jdXJyZW50UGxhY2UhLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuSW52ZW50b3J5OntcclxuICAgICAgICAgICAgICAgIGNvbnN0IGludmVudG9yeSA9ICg8UnVudGltZVBsYXllcj5hY3R1YWxUYXJnZXQpLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpYmVDb250ZW50cyh0aHJlYWQsIGludmVudG9yeSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuRHJvcHBpbmc6e1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IHRocmVhZC5jdXJyZW50UGxheWVyIS5nZXRDb250ZW50c0ZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICBsaXN0Lml0ZW1zID0gbGlzdC5pdGVtcy5maWx0ZXIoeCA9PiB4LnR5cGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09IHRhcmdldE5hbWUudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRzID0gdGhyZWFkLmN1cnJlbnRQbGFjZSEuZ2V0Q29udGVudHNGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgY29udGVudHMuaXRlbXMucHVzaChhY3R1YWxUYXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpYmUodGhyZWFkLCB0aHJlYWQuY3VycmVudFBsYWNlISwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbnN1cHBvcnRlZCBtZWFuaW5nIGZvdW5kXCIpO1xyXG4gICAgICAgIH0gIFxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByYWlzZUV2ZW50KHRocmVhZDpUaHJlYWQsIGxvY2F0aW9uOlJ1bnRpbWVQbGFjZSwgdHlwZTpFdmVudFR5cGUpe1xyXG4gICAgICAgIGNvbnN0IGV2ZW50cyA9IEFycmF5LmZyb20obG9jYXRpb24ubWV0aG9kcy52YWx1ZXMoKSEpLmZpbHRlcih4ID0+IHguZXZlbnRUeXBlID09IHR5cGUpO1xyXG5cclxuICAgICAgICBmb3IoY29uc3QgZXZlbnQgb2YgZXZlbnRzKXtcclxuICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gbG9jYXRpb24ubWV0aG9kcy5nZXQoZXZlbnQubmFtZSkhO1xyXG4gICAgICAgICAgICBtZXRob2QuYWN0dWFsUGFyYW1ldGVycyA9IFtWYXJpYWJsZS5mb3JUaGlzKG5ldyBUeXBlKGxvY2F0aW9uPy50eXBlTmFtZSEsIGxvY2F0aW9uPy5wYXJlbnRUeXBlTmFtZSEpLCBsb2NhdGlvbildO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGVsZWdhdGUgPSBuZXcgUnVudGltZURlbGVnYXRlKG1ldGhvZCk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKGRlbGVnYXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbmZlclRhcmdldEZyb20odGhyZWFkOlRocmVhZCwgdGFyZ2V0TmFtZTpzdHJpbmcsIG1lYW5pbmc6TWVhbmluZyk6UnVudGltZVdvcmxkT2JqZWN0fHVuZGVmaW5lZHtcclxuICAgICAgICBjb25zdCBsb29rdXBJbnN0YW5jZSA9IChuYW1lOnN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICB0cnl7ICAgICBcclxuICAgICAgICAgICAgICAgIHJldHVybiA8UnVudGltZVdvcmxkT2JqZWN0Pk1lbW9yeS5maW5kSW5zdGFuY2VCeU5hbWUobmFtZSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2goZXgpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLk1vdmluZyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlTmFtZSA9IDxSdW50aW1lU3RyaW5nPnRocmVhZC5jdXJyZW50UGxhY2U/LmZpZWxkcy5nZXQoYH4ke3RhcmdldE5hbWV9YCk/LnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwbGFjZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGxvb2t1cEluc3RhbmNlKHBsYWNlTmFtZS52YWx1ZSk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfSBlbHNlIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLkludmVudG9yeSl7XHJcbiAgICAgICAgICAgIHJldHVybiBsb29rdXBJbnN0YW5jZShQbGF5ZXIudHlwZU5hbWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobWVhbmluZyA9PT0gTWVhbmluZy5EZXNjcmliaW5nKXtcclxuICAgICAgICAgICAgaWYgKCF0YXJnZXROYW1lKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aHJlYWQuY3VycmVudFBsYWNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwbGFjZUNvbnRlbnRzID0gdGhyZWFkLmN1cnJlbnRQbGFjZT8uZ2V0Q29udGVudHNGaWVsZCgpITtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1PckRlY29yYXRpb24gPSBwbGFjZUNvbnRlbnRzLml0ZW1zLmZpbmQoeCA9PiB4LnR5cGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IHRhcmdldE5hbWUudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXRlbU9yRGVjb3JhdGlvbiBpbnN0YW5jZW9mIFJ1bnRpbWVXb3JsZE9iamVjdCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbU9yRGVjb3JhdGlvbjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGxvb2t1cEluc3RhbmNlKHRocmVhZC5jdXJyZW50UGxhY2U/LnR5cGVOYW1lISk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfSBlbHNlIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLlRha2luZyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSB0aHJlYWQuY3VycmVudFBsYWNlIS5nZXRDb250ZW50c0ZpZWxkKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoaW5nSXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gdGFyZ2V0TmFtZS50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChtYXRjaGluZ0l0ZW1zLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8UnVudGltZVdvcmxkT2JqZWN0Pm1hdGNoaW5nSXRlbXNbMF07XHJcbiAgICAgICAgfSBlbHNlIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLkRyb3BwaW5nKXtcclxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IHRocmVhZC5jdXJyZW50UGxheWVyIS5nZXRDb250ZW50c0ZpZWxkKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoaW5nSXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gdGFyZ2V0TmFtZS50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChtYXRjaGluZ0l0ZW1zLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8UnVudGltZVdvcmxkT2JqZWN0Pm1hdGNoaW5nSXRlbXNbMF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXNjcmliZSh0aHJlYWQ6VGhyZWFkLCB0YXJnZXQ6UnVudGltZVdvcmxkT2JqZWN0LCBpc1NoYWxsb3dEZXNjcmlwdGlvbjpib29sZWFuKXtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICghaXNTaGFsbG93RGVzY3JpcHRpb24pe1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50cyA9IHRhcmdldC5nZXRGaWVsZEFzTGlzdChXb3JsZE9iamVjdC5jb250ZW50cyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaWJlQ29udGVudHModGhyZWFkLCBjb250ZW50cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkZXNjcmliZSA9IHRhcmdldC5tZXRob2RzLmdldChXb3JsZE9iamVjdC5kZXNjcmliZSkhO1xyXG5cclxuICAgICAgICBkZXNjcmliZS5hY3R1YWxQYXJhbWV0ZXJzLnVuc2hpZnQoVmFyaWFibGUuZm9yVGhpcyhuZXcgVHlwZSh0YXJnZXQ/LnR5cGVOYW1lISwgdGFyZ2V0Py5wYXJlbnRUeXBlTmFtZSEpLCB0YXJnZXQpKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChuZXcgUnVudGltZURlbGVnYXRlKGRlc2NyaWJlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvYnNlcnZlKHRocmVhZDpUaHJlYWQsIHRhcmdldDpSdW50aW1lV29ybGRPYmplY3Qpe1xyXG4gICAgICAgIGNvbnN0IG9ic2VydmUgPSB0YXJnZXQubWV0aG9kcy5nZXQoV29ybGRPYmplY3Qub2JzZXJ2ZSkhO1xyXG5cclxuICAgICAgICBvYnNlcnZlLmFjdHVhbFBhcmFtZXRlcnMudW5zaGlmdChWYXJpYWJsZS5mb3JUaGlzKG5ldyBUeXBlKHRhcmdldD8udHlwZU5hbWUhLCB0YXJnZXQ/LnBhcmVudFR5cGVOYW1lISksIHRhcmdldCkpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKG5ldyBSdW50aW1lRGVsZWdhdGUob2JzZXJ2ZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVzY3JpYmVDb250ZW50cyh0aHJlYWQ6VGhyZWFkLCB0YXJnZXQ6UnVudGltZUxpc3Qpe1xyXG4gICAgICAgIGZvcihjb25zdCBpdGVtIG9mIHRhcmdldC5pdGVtcyl7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSh0aHJlYWQsIDxSdW50aW1lV29ybGRPYmplY3Q+aXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGV0ZXJtaW5lTWVhbmluZ0ZvcihhY3Rpb246c3RyaW5nKTpNZWFuaW5ne1xyXG4gICAgICAgIGNvbnN0IHN5c3RlbUFjdGlvbiA9IGB+JHthY3Rpb259YDtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogU3VwcG9ydCBjdXN0b20gYWN0aW9ucyBiZXR0ZXIuXHJcblxyXG4gICAgICAgIHN3aXRjaChzeXN0ZW1BY3Rpb24pe1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcuZGVzY3JpYmluZzogcmV0dXJuIE1lYW5pbmcuRGVzY3JpYmluZztcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLm1vdmluZzogcmV0dXJuIE1lYW5pbmcuTW92aW5nO1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcuZGlyZWN0aW9uOiByZXR1cm4gTWVhbmluZy5EaXJlY3Rpb247XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy50YWtpbmc6IHJldHVybiBNZWFuaW5nLlRha2luZztcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLmludmVudG9yeTogcmV0dXJuIE1lYW5pbmcuSW52ZW50b3J5O1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcuZHJvcHBpbmc6IHJldHVybiBNZWFuaW5nLkRyb3BwaW5nO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1lYW5pbmcuQ3VzdG9tO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4uL01ldGhvZEFjdGl2YXRpb25cIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RhbmNlQ2FsbEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHJvdGVjdGVkIGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5JbnN0YW5jZUNhbGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBtZXRob2ROYW1lPzpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhyZWFkLmN1cnJlbnRNZXRob2Q7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5tZXRob2ROYW1lKXtcclxuICAgICAgICAgICAgdGhpcy5tZXRob2ROYW1lID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGN1cnJlbnQucG9wKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGluc3RhbmNlPy5tZXRob2RzLmdldCh0aGlzLm1ldGhvZE5hbWUpITtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGAke2luc3RhbmNlPy50eXBlTmFtZX06OiR7dGhpcy5tZXRob2ROYW1lfSguLi4ke21ldGhvZC5wYXJhbWV0ZXJzLmxlbmd0aH0pYCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgcGFyYW1ldGVyVmFsdWVzOlZhcmlhYmxlW10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1ldGhvZCEucGFyYW1ldGVycy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlciA9IG1ldGhvZCEucGFyYW1ldGVyc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjdXJyZW50LnBvcCgpITtcclxuICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSBuZXcgVmFyaWFibGUocGFyYW1ldGVyLm5hbWUsIHBhcmFtZXRlci50eXBlISwgaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgcGFyYW1ldGVyVmFsdWVzLnB1c2godmFyaWFibGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBIQUNLOiBXZSBzaG91bGRuJ3QgY3JlYXRlIG91ciBvd24gdHlwZSwgd2Ugc2hvdWxkIGluaGVyZW50bHkga25vdyB3aGF0IGl0IGlzLlxyXG5cclxuICAgICAgICBwYXJhbWV0ZXJWYWx1ZXMudW5zaGlmdChWYXJpYWJsZS5mb3JUaGlzKG5ldyBUeXBlKGluc3RhbmNlPy50eXBlTmFtZSEsIGluc3RhbmNlPy5wYXJlbnRUeXBlTmFtZSEpLCBpbnN0YW5jZSkpO1xyXG5cclxuICAgICAgICBtZXRob2QuYWN0dWFsUGFyYW1ldGVycyA9IHBhcmFtZXRlclZhbHVlcztcclxuXHJcbiAgICAgICAgdGhyZWFkLmFjdGl2YXRlTWV0aG9kKG1ldGhvZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVEZWxlZ2F0ZSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVEZWxlZ2F0ZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEludm9rZURlbGVnYXRlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcm90ZWN0ZWQgY29kZTogT3BDb2RlID0gT3BDb2RlLkludm9rZURlbGVnYXRlO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCkhO1xyXG5cclxuICAgICAgICBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBSdW50aW1lRGVsZWdhdGUpe1xyXG4gICAgICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gdGhyZWFkLmFjdGl2YXRlTWV0aG9kKGluc3RhbmNlLndyYXBwZWRNZXRob2QpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFVuYWJsZSB0byBpbnZva2UgZGVsZWdhdGUgZm9yIG5vbi1kZWxlZ2F0ZSBpbnN0YW5jZSAnJHtpbnN0YW5jZX0nYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZEZpZWxkSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcm90ZWN0ZWQgY29kZTogT3BDb2RlID0gT3BDb2RlLkxvYWRGaWVsZDtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuICAgICAgICBjb25zdCBmaWVsZE5hbWUgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uVmFsdWVBczxzdHJpbmc+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGZpZWxkID0gaW5zdGFuY2U/LmZpZWxkcy5nZXQoZmllbGROYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBmaWVsZD8udmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCBgJHtpbnN0YW5jZT8udHlwZU5hbWV9Ojoke2ZpZWxkTmFtZX1gLCAnLy8nLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkSW5zdGFuY2VIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHByb3RlY3RlZCBjb2RlOiBPcENvZGUgPSBPcENvZGUuTG9hZEluc3RhbmNlO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCB0eXBlTmFtZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHR5cGVOYW1lID09PSBcIn5pdFwiKXtcclxuICAgICAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRocmVhZC5jdXJyZW50UGxhY2UhO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHN1YmplY3QpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFVuYWJsZSB0byBsb2FkIGluc3RhbmNlIGZvciB1bnN1cHBvcnRlZCB0eXBlICcke3R5cGVOYW1lfSdgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZExvY2FsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcm90ZWN0ZWQgY29kZTogT3BDb2RlID0gT3BDb2RlLkxvYWRMb2NhbDtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvY2FsTmFtZSA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICBjb25zdCBwYXJhbWV0ZXIgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5tZXRob2Q/LmFjdHVhbFBhcmFtZXRlcnMuZmluZCh4ID0+IHgubmFtZSA9PSBsb2NhbE5hbWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHBhcmFtZXRlcj8udmFsdWUhKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGxvY2FsTmFtZSwgJy8vJywgcGFyYW1ldGVyPy52YWx1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZE51bWJlckhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHJvdGVjdGVkIGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5Mb2FkTnVtYmVyO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSA8bnVtYmVyPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICBjb25zdCBydW50aW1lVmFsdWUgPSBNZW1vcnkuYWxsb2NhdGVOdW1iZXIodmFsdWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHJ1bnRpbWVWYWx1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9JbnN0YW5jZUNhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRUaGlzSGFuZGxlciB9IGZyb20gXCIuL0xvYWRUaGlzSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkUHJvcGVydHlIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHByb3RlY3RlZCBjb2RlOiBPcENvZGUgPSBPcENvZGUuTG9hZFByb3BlcnR5O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZmllbGROYW1lPzpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZmllbGROYW1lKXtcclxuICAgICAgICAgICAgdGhpcy5maWVsZE5hbWUgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeXtcclxuICAgICAgICAgICAgY29uc3QgZmllbGQgPSBpbnN0YW5jZT8uZmllbGRzLmdldCh0aGlzLmZpZWxkTmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZmllbGQ/LnZhbHVlITtcclxuICAgICAgICAgICAgY29uc3QgZ2V0RmllbGQgPSBpbnN0YW5jZT8ubWV0aG9kcy5nZXQoYH5nZXRfJHt0aGlzLmZpZWxkTmFtZX1gKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCBgJHtpbnN0YW5jZT8udHlwZU5hbWV9Ojoke3RoaXMuZmllbGROYW1lfWAsIGB7Z2V0PSR7Z2V0RmllbGQgIT0gdW5kZWZpbmVkfX1gLCAnLy8nLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZ2V0RmllbGQpe1xyXG4gICAgICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaCh2YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9hZFRoaXMgPSBuZXcgTG9hZFRoaXNIYW5kbGVyKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBsb2FkVGhpcy5oYW5kbGUodGhyZWFkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IEV2YWx1YXRpb25SZXN1bHQuQ29udGludWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgSW5zdGFuY2VDYWxsSGFuZGxlcihnZXRGaWVsZC5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXIuaGFuZGxlKHRocmVhZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9nZXRGaWVsZC5hY3R1YWxQYXJhbWV0ZXJzLnB1c2gobmV3IFZhcmlhYmxlKFwifnZhbHVlXCIsIGZpZWxkPy50eXBlISwgdmFsdWUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3RocmVhZC5hY3RpdmF0ZU1ldGhvZChnZXRGaWVsZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgICAgIH0gZmluYWxseXtcclxuICAgICAgICAgICAgdGhpcy5maWVsZE5hbWUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkU3RyaW5nSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcm90ZWN0ZWQgY29kZTogT3BDb2RlID0gT3BDb2RlLkxvYWRTdHJpbmc7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbiEudmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpe1xyXG4gICAgICAgICAgICBjb25zdCBzdHJpbmdWYWx1ZSA9IG5ldyBSdW50aW1lU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChzdHJpbmdWYWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIkV4cGVjdGVkIGEgc3RyaW5nXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCJcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRUaGlzSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcm90ZWN0ZWQgY29kZTogT3BDb2RlID0gT3BDb2RlLkxvYWRUaGlzO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLm1ldGhvZD8uYWN0dWFsUGFyYW1ldGVyc1swXS52YWx1ZSE7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV3SW5zdGFuY2VIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHByb3RlY3RlZCBjb2RlOiBPcENvZGUgPSBPcENvZGUuTmV3SW5zdGFuY2U7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHR5cGVOYW1lID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCB0eXBlTmFtZSk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdHlwZU5hbWUgPT09IFwic3RyaW5nXCIpe1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gdGhyZWFkLmtub3duVHlwZXMuZ2V0KHR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlID09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBsb2NhdGUgdHlwZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBNZW1vcnkuYWxsb2NhdGUodHlwZSk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKGluc3RhbmNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5vT3BIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHByb3RlY3RlZCBjb2RlOiBPcENvZGUgPSBPcENvZGUuTm9PcDtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQ29tbWFuZCB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVDb21tYW5kXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyc2VDb21tYW5kSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcm90ZWN0ZWQgY29kZTogT3BDb2RlID0gT3BDb2RlLlBhcnNlQ29tbWFuZDtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB0ZXh0ID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0IGluc3RhbmNlb2YgUnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRUZXh0ID0gdGV4dC52YWx1ZTtcclxuICAgICAgICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMucGFyc2VDb21tYW5kKGNvbW1hbmRUZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goY29tbWFuZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBwYXJzZSBjb21tYW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VDb21tYW5kKHRleHQ6c3RyaW5nKTpSdW50aW1lQ29tbWFuZHtcclxuICAgICAgICBjb25zdCBwaWVjZXMgPSB0ZXh0LnNwbGl0KFwiIFwiKTtcclxuICAgICAgICBjb25zdCBjb21tYW5kID0gTWVtb3J5LmFsbG9jYXRlQ29tbWFuZCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbW1hbmQuYWN0aW9uID0gTWVtb3J5LmFsbG9jYXRlU3RyaW5nKHBpZWNlc1swXSk7XHJcbiAgICAgICAgY29tbWFuZC50YXJnZXROYW1lID0gTWVtb3J5LmFsbG9jYXRlU3RyaW5nKHBpZWNlc1sxXSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb21tYW5kO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcbmltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByaW50SGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcm90ZWN0ZWQgY29kZTogT3BDb2RlID0gT3BDb2RlLlByaW50O1xyXG5cclxuICAgIHByaXZhdGUgb3V0cHV0OklPdXRwdXQ7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3V0cHV0OklPdXRwdXQpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5vdXRwdXQgPSBvdXRwdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0ZXh0IGluc3RhbmNlb2YgUnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0LndyaXRlKHRleHQudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gcHJpbnQsIGVuY291bnRlcmVkIGEgdHlwZSBvbiB0aGUgc3RhY2sgb3RoZXIgdGhhbiBzdHJpbmdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWFkSW5wdXRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHByb3RlY3RlZCBjb2RlOiBPcENvZGUgPSBPcENvZGUuUmVhZElucHV0O1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuU3VzcGVuZEZvcklucHV0O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFbXB0eSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVFbXB0eVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJldHVybkhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHJvdGVjdGVkIGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5SZXR1cm47XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSByZXR1cm5pbmcgdG9wIHZhbHVlIG9uIHN0YWNrIGJhc2VkIG9uIHJldHVybiB0eXBlIG9mIG1ldGhvZC5cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhyZWFkLmN1cnJlbnRNZXRob2Q7XHJcbiAgICAgICAgY29uc3Qgc2l6ZSA9IGN1cnJlbnQuc3RhY2tTaXplKCk7XHJcbiAgICAgICAgY29uc3QgaGFzUmV0dXJuVHlwZSA9IGN1cnJlbnQubWV0aG9kPy5yZXR1cm5UeXBlICE9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmIChoYXNSZXR1cm5UeXBlKXtcclxuICAgICAgICAgICAgaWYgKHNpemUgPT0gMCl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiRXhwZWN0ZWQgcmV0dXJuIHZhbHVlIGZyb20gbWV0aG9kIGJ1dCBmb3VuZCBubyBpbnN0YW5jZSBvbiB0aGUgc3RhY2tcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2l6ZSA+IDEpe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgU3RhY2sgSW1iYWxhbmNlISBSZXR1cm5pbmcgZnJvbSAnJHtjdXJyZW50Lm1ldGhvZD8ubmFtZX0nIGZvdW5kICcke3NpemV9JyBpbnN0YW5jZXMgbGVmdCBidXQgZXhwZWN0ZWQgb25lLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHNpemUgPiAwKXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFN0YWNrIEltYmFsYW5jZSEgUmV0dXJuaW5nIGZyb20gJyR7Y3VycmVudC5tZXRob2Q/Lm5hbWV9JyBmb3VuZCAnJHtzaXplfScgaW5zdGFuY2VzIGxlZnQgYnV0IGV4cGVjdGVkIHplcm8uYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0gdGhyZWFkIS5yZXR1cm5Gcm9tQ3VycmVudE1ldGhvZCgpO1xyXG5cclxuICAgICAgICBpZiAoIShyZXR1cm5WYWx1ZSBpbnN0YW5jZW9mIFJ1bnRpbWVFbXB0eSkpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIHJldHVyblZhbHVlKTtcclxuICAgICAgICAgICAgdGhyZWFkPy5jdXJyZW50TWV0aG9kLnB1c2gocmV0dXJuVmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCAndm9pZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuQ29udGludWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4uL01ldGhvZEFjdGl2YXRpb25cIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdGF0aWNDYWxsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcm90ZWN0ZWQgY29kZTogT3BDb2RlID0gT3BDb2RlLlN0YXRpY0NhbGw7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IGNhbGxUZXh0ID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIGNvbnN0IHBpZWNlcyA9IGNhbGxUZXh0LnNwbGl0KFwiLlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSBwaWVjZXNbMF07XHJcbiAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IHBpZWNlc1sxXTtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZSA9IHRocmVhZC5rbm93blR5cGVzLmdldCh0eXBlTmFtZSkhO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHR5cGU/Lm1ldGhvZHMuZmluZCh4ID0+IHgubmFtZSA9PT0gbWV0aG9kTmFtZSkhOyAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCwgYCR7dHlwZU5hbWV9Ojoke21ldGhvZE5hbWV9KClgKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmFjdGl2YXRlTWV0aG9kKG1ldGhvZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHlwZU9mSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcm90ZWN0ZWQgY29kZTogT3BDb2RlID0gT3BDb2RlLlR5cGVPZjtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIHR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKHRocmVhZC5jdXJyZW50TWV0aG9kLnN0YWNrU2l6ZSgpID09IDApe1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IE1lbW9yeS5hbGxvY2F0ZUJvb2xlYW4oZmFsc2UpO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBlZWsoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGlzVHlwZSA9IGluc3RhbmNlPy50eXBlTmFtZSA9PSB0eXBlTmFtZTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gTWVtb3J5LmFsbG9jYXRlQm9vbGVhbihpc1R5cGUpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gTWVhbmluZ3tcclxuICAgIERlc2NyaWJpbmcsXHJcbiAgICBUYWtpbmcsXHJcbiAgICBNb3ZpbmcsXHJcbiAgICBEaXJlY3Rpb24sXHJcbiAgICBJbnZlbnRvcnksXHJcbiAgICBEcm9wcGluZyxcclxuICAgIFF1aXR0aW5nLFxyXG4gICAgQ3VzdG9tXHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vLi4vY29tbW9uL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVBbnl7XHJcbiAgICBwYXJlbnRUeXBlTmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgdHlwZU5hbWU6c3RyaW5nID0gQW55LnR5cGVOYW1lO1xyXG5cclxuICAgIGZpZWxkczpNYXA8c3RyaW5nLCBWYXJpYWJsZT4gPSBuZXcgTWFwPHN0cmluZywgVmFyaWFibGU+KCk7XHJcbiAgICBtZXRob2RzOk1hcDxzdHJpbmcsIE1ldGhvZD4gPSBuZXcgTWFwPHN0cmluZywgTWV0aG9kPigpO1xyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZU5hbWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVCb29sZWFuIGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTpib29sZWFuKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi9SdW50aW1lU3RyaW5nXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUNvbW1hbmQgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHRhcmdldE5hbWU/OlJ1bnRpbWVTdHJpbmcsIHB1YmxpYyBhY3Rpb24/OlJ1bnRpbWVTdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lV29ybGRPYmplY3QgfSBmcm9tIFwiLi9SdW50aW1lV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgRGVjb3JhdGlvbiB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0RlY29yYXRpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lRGVjb3JhdGlvbiBleHRlbmRzIFJ1bnRpbWVXb3JsZE9iamVjdHtcclxuICAgIHBhcmVudFR5cGVOYW1lID0gRGVjb3JhdGlvbi5wYXJlbnRUeXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gRGVjb3JhdGlvbi50eXBlTmFtZTtcclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBEZWxlZ2F0ZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0RlbGVnYXRlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZURlbGVnYXRlIGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBEZWxlZ2F0ZS50eXBlTmFtZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgd3JhcHBlZE1ldGhvZDpNZXRob2Qpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lRW1wdHkgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IFwifmVtcHR5XCI7XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVJbnRlZ2VyIGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTpudW1iZXIpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0l0ZW1cIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVJdGVtIGV4dGVuZHMgUnVudGltZVdvcmxkT2JqZWN0e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gSXRlbS50eXBlTmFtZTtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IHR5cGUoKTpUeXBle1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBSdW50aW1lV29ybGRPYmplY3QudHlwZTtcclxuXHJcbiAgICAgICAgdHlwZS5uYW1lID0gSXRlbS50eXBlTmFtZTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IFBhcmFtZXRlciB9IGZyb20gXCIuLi8uLi9jb21tb24vUGFyYW1ldGVyXCI7XHJcbmltcG9ydCB7IE51bWJlclR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9OdW1iZXJUeXBlXCI7XHJcbmltcG9ydCB7IFN0cmluZ1R5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9TdHJpbmdUeXBlXCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9JbnN0cnVjdGlvblwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4vUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lSW50ZWdlciB9IGZyb20gXCIuL1J1bnRpbWVJbnRlZ2VyXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IEJvb2xlYW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQm9vbGVhblR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lTGlzdCBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaXRlbXM6UnVudGltZUFueVtdKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250YWlucyA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICBjb250YWlucy5uYW1lID0gTGlzdC5jb250YWlucztcclxuICAgICAgICBjb250YWlucy5wYXJhbWV0ZXJzLnB1c2goXHJcbiAgICAgICAgICAgIG5ldyBQYXJhbWV0ZXIoTGlzdC50eXBlTmFtZVBhcmFtZXRlciwgU3RyaW5nVHlwZS50eXBlTmFtZSksXHJcbiAgICAgICAgICAgIG5ldyBQYXJhbWV0ZXIoTGlzdC5jb3VudFBhcmFtZXRlciwgTnVtYmVyVHlwZS50eXBlTmFtZSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb250YWlucy5yZXR1cm5UeXBlID0gQm9vbGVhblR5cGUudHlwZU5hbWU7XHJcblxyXG4gICAgICAgIGNvbnRhaW5zLmJvZHkucHVzaChcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZExvY2FsKExpc3QuY291bnRQYXJhbWV0ZXIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkTG9jYWwoTGlzdC50eXBlTmFtZVBhcmFtZXRlciksICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uZXh0ZXJuYWxDYWxsKFwiY29udGFpbnNUeXBlXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5yZXR1cm4oKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5zZXQoTGlzdC5jb250YWlucywgY29udGFpbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29udGFpbnNUeXBlKHR5cGVOYW1lOlJ1bnRpbWVTdHJpbmcsIGNvdW50OlJ1bnRpbWVJbnRlZ2VyKXtcclxuICAgICAgICBjb25zdCBmb3VuZEl0ZW1zID0gdGhpcy5pdGVtcy5maWx0ZXIoeCA9PiB4LnR5cGVOYW1lID09PSB0eXBlTmFtZS52YWx1ZSk7XHJcbiAgICAgICAgY29uc3QgZm91bmQgPSBmb3VuZEl0ZW1zLmxlbmd0aCA9PT0gY291bnQudmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiBNZW1vcnkuYWxsb2NhdGVCb29sZWFuKGZvdW5kKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVXb3JsZE9iamVjdCB9IGZyb20gXCIuL1J1bnRpbWVXb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVQbGFjZSBleHRlbmRzIFJ1bnRpbWVXb3JsZE9iamVjdHtcclxuICAgIHBhcmVudFR5cGVOYW1lID0gV29ybGRPYmplY3QucGFyZW50VHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IFBsYWNlLnR5cGVOYW1lO1xyXG5cclxuICAgIHN0YXRpYyBnZXQgdHlwZSgpOlR5cGV7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IFJ1bnRpbWVXb3JsZE9iamVjdC50eXBlO1xyXG5cclxuICAgICAgICB0eXBlLm5hbWUgPSBQbGFjZS50eXBlTmFtZTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVXb3JsZE9iamVjdCB9IGZyb20gXCIuL1J1bnRpbWVXb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYXllclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVQbGF5ZXIgZXh0ZW5kcyBSdW50aW1lV29ybGRPYmplY3R7XHJcbiAgICBzdGF0aWMgZ2V0IHR5cGUoKTpUeXBle1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBSdW50aW1lV29ybGRPYmplY3QudHlwZTtcclxuXHJcbiAgICAgICAgdHlwZS5uYW1lID0gUGxheWVyLnR5cGVOYW1lO1xyXG5cclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVNheSBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBtZXNzYWdlOnN0cmluZyA9IFwiXCI7XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lU3RyaW5nIGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIHZhbHVlOnN0cmluZztcclxuICAgIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBcIn5zdHJpbmdcIjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIGBcIiR7dGhpcy52YWx1ZX1cImA7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lTGlzdCB9IGZyb20gXCIuL1J1bnRpbWVMaXN0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4vVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuLi8uLi9jb21tb24vRmllbGRcIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lV29ybGRPYmplY3QgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG5cclxuICAgIHN0YXRpYyBnZXQgdHlwZSgpOlR5cGV7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IG5ldyBUeXBlKFdvcmxkT2JqZWN0LnR5cGVOYW1lLCBXb3JsZE9iamVjdC5wYXJlbnRUeXBlTmFtZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY29udGVudHMgPSBuZXcgRmllbGQoKTtcclxuICAgICAgICBjb250ZW50cy5uYW1lID0gV29ybGRPYmplY3QuY29udGVudHM7XHJcbiAgICAgICAgY29udGVudHMudHlwZU5hbWUgPSBMaXN0LnR5cGVOYW1lO1xyXG4gICAgICAgIGNvbnRlbnRzLmRlZmF1bHRWYWx1ZSA9IFtdO1xyXG5cclxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uLm5hbWUgPSBXb3JsZE9iamVjdC5kZXNjcmlwdGlvbjtcclxuICAgICAgICBkZXNjcmlwdGlvbi50eXBlTmFtZSA9IFN0cmluZ1R5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgZGVzY3JpcHRpb24uZGVmYXVsdFZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgdHlwZS5maWVsZHMucHVzaChjb250ZW50cyk7XHJcbiAgICAgICAgdHlwZS5maWVsZHMucHVzaChkZXNjcmlwdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0RmllbGRWYWx1ZUJ5TmFtZShuYW1lOnN0cmluZyk6UnVudGltZUFueXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZmllbGRzLmdldChuYW1lKT8udmFsdWU7XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZSA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBBdHRlbXB0ZWQgZmllbGQgYWNjZXNzIGZvciB1bmtub3duIGZpZWxkICcke25hbWV9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnRlbnRzRmllbGQoKTpSdW50aW1lTGlzdHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRGaWVsZEFzTGlzdChXb3JsZE9iamVjdC5jb250ZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RmllbGRBc0xpc3QobmFtZTpzdHJpbmcpOlJ1bnRpbWVMaXN0e1xyXG4gICAgICAgIHJldHVybiA8UnVudGltZUxpc3Q+dGhpcy5nZXRGaWVsZFZhbHVlQnlOYW1lKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEZpZWxkQXNTdHJpbmcobmFtZTpzdHJpbmcpOlJ1bnRpbWVTdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIDxSdW50aW1lU3RyaW5nPnRoaXMuZ2V0RmllbGRWYWx1ZUJ5TmFtZShuYW1lKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWYXJpYWJsZXtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSB0aGlzVHlwZU5hbWUgPSBcIn50aGlzXCI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG5hbWU6c3RyaW5nLCBcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB0eXBlOlR5cGUsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgdmFsdWU/OlJ1bnRpbWVBbnkpe1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmb3JUaGlzKHR5cGU6VHlwZSwgdmFsdWU/OlJ1bnRpbWVBbnkpe1xyXG4gICAgICAgIHJldHVybiBuZXcgVmFyaWFibGUoVmFyaWFibGUudGhpc1R5cGVOYW1lLCB0eXBlLCB2YWx1ZSk7XHJcbiAgICB9XHJcbn0iXX0=
