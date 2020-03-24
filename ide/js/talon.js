(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaneOutput {
    constructor(pane) {
        this.pane = pane;
    }
    clear() {
        this.pane.innerHTML = "";
    }
    debug(line) {
        this.pane.innerHTML += line + "</br>";
    }
    write(line) {
        this.pane.innerHTML += line + "</br>";
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
                "it is described as \"The inn is a cozy place, with a crackling fire on the hearth. The bartender is behind the bar. An open door to the north leads outside.\" and if it contains 1 Coin then say \"There's also a coin here.\" else say \"There is just dust.\".\n" +
                "it contains 1 Coin.\n" +
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
},{"./PaneOutput":1,"./compiler/TalonCompiler":11,"./runtime/TalonRuntime":67}],3:[function(require,module,exports){
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
},{"../common/Instruction":5,"../common/Method":6,"../common/Type":9,"../common/Version":10,"../library/Any":47,"../library/Delegate":50,"../library/EntryPointAttribute":51,"./exceptions/CompilationError":12,"./lexing/TalonLexer":15,"./parsing/TalonParser":19,"./semantics/TalonSemanticAnalyzer":44,"./transforming/TalonTransformer":46}],12:[function(require,module,exports){
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
            if (currentChar == " " || currentChar == "\n" || currentChar == Punctuation_1.Punctuation.period || currentChar == Punctuation_1.Punctuation.colon || currentChar == Punctuation_1.Punctuation.semicolon) {
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
},{"../../library/Any":47,"../../library/BooleanType":48,"../../library/Decoration":49,"../../library/Item":53,"../../library/List":54,"../../library/Place":56,"../../library/WorldObject":61,"./TokenType":17}],17:[function(require,module,exports){
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
},{"./ParseContext":18,"./visitors/ProgramVisitor":38}],20:[function(require,module,exports){
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
class LiteralExpression extends Expression_1.Expression {
    constructor(typeName, value) {
        super();
        this.typeName = typeName;
        this.value = value;
    }
}
exports.LiteralExpression = LiteralExpression;
},{"./Expression":24}],28:[function(require,module,exports){
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
},{"./Expression":24}],29:[function(require,module,exports){
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
},{"./Expression":24}],30:[function(require,module,exports){
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
},{"./Expression":24}],31:[function(require,module,exports){
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
},{"./Expression":24}],32:[function(require,module,exports){
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
},{"./Expression":24}],33:[function(require,module,exports){
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
},{"./Expression":24}],34:[function(require,module,exports){
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
},{"../../lexing/Keywords":13,"../expressions/ActionsExpression":20,"./ExpressionVisitor":35}],35:[function(require,module,exports){
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
            let value;
            if (context.isTypeOf(TokenType_1.TokenType.String)) {
                value = new LiteralExpression_1.LiteralExpression(StringType_1.StringType.typeName, context.expectString().value);
            }
            else if (context.isTypeOf(TokenType_1.TokenType.Number)) {
                value = new LiteralExpression_1.LiteralExpression(NumberType_1.NumberType.typeName, context.expectNumber().value);
            }
            else {
                // TODO: Support dereferencing arbitrary instances.
                throw new CompilationError_1.CompilationError("Current unable to support assigning from derefenced instances, planned for a future release");
            }
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
        else {
            throw new CompilationError_1.CompilationError("Unable to parse expression");
        }
    }
}
exports.ExpressionVisitor = ExpressionVisitor;
},{"../../../library/NumberType":55,"../../../library/StringType":59,"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../../lexing/TokenType":17,"../expressions/ContainsExpression":23,"../expressions/LiteralExpression":27,"../expressions/SayExpression":29,"../expressions/SetVariableExpression":30,"./IfExpressionVisitor":37,"./Visitor":42}],36:[function(require,module,exports){
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
            const count = context.expectNumber();
            const name = context.expectIdentifier();
            // TODO: Support multiple content entries.
            field.name = WorldObject_1.WorldObject.contents;
            field.typeName = List_1.List.typeName;
            field.initialValue = [[Number(count.value), name.value]];
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
},{"../../../library/BooleanType":48,"../../../library/List":54,"../../../library/NumberType":55,"../../../library/Place":56,"../../../library/StringType":59,"../../../library/WorldObject":61,"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../../lexing/TokenType":17,"../expressions/ConcatenationExpression":22,"../expressions/FieldDeclarationExpression":25,"./ExpressionVisitor":35,"./Visitor":42}],37:[function(require,module,exports){
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
},{"../../lexing/Keywords":13,"../expressions/Expression":24,"../expressions/IfExpression":26,"./ExpressionVisitor":35,"./Visitor":42}],38:[function(require,module,exports){
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
},{"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../expressions/ProgramExpression":28,"./SayExpressionVisitor":39,"./TypeDeclarationVisitor":40,"./UnderstandingDeclarationVisitor":41,"./Visitor":42}],39:[function(require,module,exports){
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
},{"../../lexing/Keywords":13,"../expressions/SayExpression":29,"./Visitor":42}],40:[function(require,module,exports){
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
},{"../../lexing/Keywords":13,"../expressions/TypeDeclarationExpression":31,"./FieldDeclarationVisitor":36,"./Visitor":42,"./WhenDeclarationVisitor":43}],41:[function(require,module,exports){
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
},{"../../lexing/Keywords":13,"../expressions/UnderstandingDeclarationExpression":32,"./Visitor":42}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Visitor {
}
exports.Visitor = Visitor;
},{}],43:[function(require,module,exports){
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
},{"../../lexing/Keywords":13,"../expressions/WhenDeclarationExpression":33,"./EventExpressionVisitor":34,"./Visitor":42}],44:[function(require,module,exports){
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
},{"../lexing/Token":16,"../lexing/TokenType":17,"../parsing/expressions/ProgramExpression":28,"../parsing/expressions/TypeDeclarationExpression":31}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExpressionTransformationMode;
(function (ExpressionTransformationMode) {
    ExpressionTransformationMode[ExpressionTransformationMode["None"] = 0] = "None";
    ExpressionTransformationMode[ExpressionTransformationMode["IgnoreResultsOfSayExpression"] = 1] = "IgnoreResultsOfSayExpression";
})(ExpressionTransformationMode = exports.ExpressionTransformationMode || (exports.ExpressionTransformationMode = {}));
},{}],46:[function(require,module,exports){
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
},{"../../common/EventType":3,"../../common/Field":4,"../../common/Instruction":5,"../../common/Method":6,"../../common/Parameter":8,"../../common/Type":9,"../../library/Any":47,"../../library/BooleanType":48,"../../library/Decoration":49,"../../library/Item":53,"../../library/List":54,"../../library/NumberType":55,"../../library/Place":56,"../../library/Player":57,"../../library/Say":58,"../../library/StringType":59,"../../library/Understanding":60,"../../library/WorldObject":61,"../exceptions/CompilationError":12,"../lexing/Keywords":13,"../parsing/expressions/ConcatenationExpression":22,"../parsing/expressions/ContainsExpression":23,"../parsing/expressions/FieldDeclarationExpression":25,"../parsing/expressions/IfExpression":26,"../parsing/expressions/LiteralExpression":27,"../parsing/expressions/ProgramExpression":28,"../parsing/expressions/SayExpression":29,"../parsing/expressions/SetVariableExpression":30,"../parsing/expressions/TypeDeclarationExpression":31,"../parsing/expressions/UnderstandingDeclarationExpression":32,"./ExpressionTransformationMode":45}],47:[function(require,module,exports){
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
},{"./ExternCall":52}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class BooleanType {
}
exports.BooleanType = BooleanType;
BooleanType.parentTypeName = Any_1.Any.typeName;
BooleanType.typeName = "~boolean";
},{"./Any":47}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Decoration {
}
exports.Decoration = Decoration;
Decoration.parentTypeName = WorldObject_1.WorldObject.typeName;
Decoration.typeName = "~decoration";
},{"./WorldObject":61}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class Delegate {
}
exports.Delegate = Delegate;
Delegate.typeName = "~delegate";
Delegate.parentTypeName = Any_1.Any.typeName;
},{"./Any":47}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntryPointAttribute {
    constructor() {
        this.name = "~entryPoint";
    }
}
exports.EntryPointAttribute = EntryPointAttribute;
},{}],52:[function(require,module,exports){
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
},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Item {
}
exports.Item = Item;
Item.typeName = "~item";
Item.parentTypeName = WorldObject_1.WorldObject.typeName;
},{"./WorldObject":61}],54:[function(require,module,exports){
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
},{"./Any":47}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class NumberType {
}
exports.NumberType = NumberType;
NumberType.typeName = "~number";
NumberType.parentTypeName = Any_1.Any.typeName;
},{"./Any":47}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Place {
}
exports.Place = Place;
Place.parentTypeName = WorldObject_1.WorldObject.typeName;
Place.typeName = "~place";
Place.isPlayerStart = "~isPlayerStart";
},{"./WorldObject":61}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Player {
}
exports.Player = Player;
Player.typeName = "~player";
Player.parentTypeName = WorldObject_1.WorldObject.typeName;
},{"./WorldObject":61}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class Say {
}
exports.Say = Say;
Say.typeName = "~say";
Say.parentTypeName = Any_1.Any.typeName;
},{"./Any":47}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class StringType {
}
exports.StringType = StringType;
StringType.parentTypeName = Any_1.Any.typeName;
StringType.typeName = "~string";
},{"./Any":47}],60:[function(require,module,exports){
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
},{"./Any":47}],61:[function(require,module,exports){
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
},{"./Any":47}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TalonIde_1 = require("./TalonIde");
var ide = new TalonIde_1.TalonIde();
},{"./TalonIde":2}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EvaluationResult;
(function (EvaluationResult) {
    EvaluationResult[EvaluationResult["Continue"] = 0] = "Continue";
    EvaluationResult[EvaluationResult["SuspendForInput"] = 1] = "SuspendForInput";
})(EvaluationResult = exports.EvaluationResult || (exports.EvaluationResult = {}));
},{}],64:[function(require,module,exports){
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
},{"./StackFrame":66,"./errors/RuntimeError":70}],65:[function(require,module,exports){
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
},{"../common/OpCode":7,"./EvaluationResult":63}],66:[function(require,module,exports){
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
},{"./library/Variable":110}],67:[function(require,module,exports){
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
},{"../common/OpCode":7,"../library/Any":47,"../library/EntryPointAttribute":51,"../library/Place":56,"../library/Player":57,"./EvaluationResult":63,"./MethodActivation":64,"./Thread":68,"./common/Memory":69,"./errors/RuntimeError":70,"./handlers/AssignVariableHandler":71,"./handlers/BranchRelativeHandler":72,"./handlers/BranchRelativeIfFalseHandler":73,"./handlers/ConcatenateHandler":74,"./handlers/ExternalCallHandler":75,"./handlers/GoToHandler":76,"./handlers/HandleCommandHandler":77,"./handlers/InstanceCallHandler":78,"./handlers/InvokeDelegateHandler":79,"./handlers/LoadFieldHandler":80,"./handlers/LoadInstanceHandler":81,"./handlers/LoadLocalHandler":82,"./handlers/LoadNumberHandler":83,"./handlers/LoadPropertyHandler":84,"./handlers/LoadStringHandler":85,"./handlers/LoadThisHandler":86,"./handlers/NewInstanceHandler":87,"./handlers/NoOpHandler":88,"./handlers/ParseCommandHandler":89,"./handlers/PrintHandler":90,"./handlers/ReadInputHandler":91,"./handlers/ReturnHandler":92,"./handlers/StaticCallHandler":93,"./handlers/TypeOfHandler":94}],68:[function(require,module,exports){
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
},{"../library/Understanding":60,"./MethodActivation":64,"./library/RuntimeEmpty":101}],69:[function(require,module,exports){
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
},{"../../library/BooleanType":48,"../../library/Decoration":49,"../../library/Item":53,"../../library/List":54,"../../library/NumberType":55,"../../library/Place":56,"../../library/Player":57,"../../library/Say":58,"../../library/StringType":59,"../errors/RuntimeError":70,"../library/RuntimeBoolean":97,"../library/RuntimeCommand":98,"../library/RuntimeDecoration":99,"../library/RuntimeEmpty":101,"../library/RuntimeInteger":102,"../library/RuntimeItem":103,"../library/RuntimeList":104,"../library/RuntimePlace":105,"../library/RuntimePlayer":106,"../library/RuntimeSay":107,"../library/RuntimeString":108,"../library/Variable":110}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RuntimeError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.RuntimeError = RuntimeError;
},{}],71:[function(require,module,exports){
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
},{"../OpCodeHandler":65,"../errors/RuntimeError":70,"../library/RuntimeInteger":102,"../library/RuntimeString":108}],72:[function(require,module,exports){
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
},{"../OpCodeHandler":65}],73:[function(require,module,exports){
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
},{"../OpCodeHandler":65}],74:[function(require,module,exports){
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
},{"../OpCodeHandler":65,"../common/Memory":69}],75:[function(require,module,exports){
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
},{"../OpCodeHandler":65}],76:[function(require,module,exports){
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
},{"../OpCodeHandler":65,"../errors/RuntimeError":70}],77:[function(require,module,exports){
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
        const actualTargetName = this.inferTargetFrom(thread, targetName, meaning);
        if (!actualTargetName) {
            this.output.write("I don't know what you're referring to.");
            return super.handle(thread);
        }
        const target = thread.knownTypes.get(actualTargetName);
        if (!target) {
            throw new RuntimeError_1.RuntimeError("Unable to locate type");
        }
        const instance = this.locateTargetInstance(thread, target, meaning);
        if (!(instance instanceof RuntimeWorldObject_1.RuntimeWorldObject)) {
            throw new RuntimeError_1.RuntimeError("Unable to locate world type");
        }
        switch (meaning) {
            case Meaning_1.Meaning.Describing: {
                this.describe(thread, instance, false);
                break;
            }
            case Meaning_1.Meaning.Moving: {
                const nextPlace = instance;
                const currentPlace = thread.currentPlace;
                thread.currentPlace = nextPlace;
                this.describe(thread, instance, false);
                this.raiseEvent(thread, nextPlace, EventType_1.EventType.PlayerEntersPlace);
                this.raiseEvent(thread, currentPlace, EventType_1.EventType.PlayerExitsPlace);
                break;
            }
            case Meaning_1.Meaning.Taking: {
                if (!(instance instanceof RuntimeItem_1.RuntimeItem)) {
                    this.output.write("I can't take that.");
                    return super.handle(thread);
                }
                const list = thread.currentPlace.getContentsField();
                list.items = list.items.filter(x => x.typeName != target.name);
                const inventory = thread.currentPlayer.getContentsField();
                inventory.items.push(instance);
                this.describe(thread, thread.currentPlace, false);
                break;
            }
            case Meaning_1.Meaning.Inventory: {
                const inventory = instance.getContentsField();
                this.describeContents(thread, inventory);
                break;
            }
            case Meaning_1.Meaning.Dropping: {
                const list = thread.currentPlayer.getContentsField();
                list.items = list.items.filter(x => x.typeName != target.name);
                const contents = thread.currentPlace.getContentsField();
                contents.items.push(instance);
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
    locateTargetInstance(thread, target, meaning) {
        var _a, _b;
        if (meaning === Meaning_1.Meaning.Taking) {
            const list = (_a = thread.currentPlace.fields.get(WorldObject_1.WorldObject.contents)) === null || _a === void 0 ? void 0 : _a.value;
            const matchingItems = list.items.filter(x => x.typeName === target.name);
            if (matchingItems.length == 0) {
                return undefined;
            }
            return matchingItems[0];
        }
        else if (meaning === Meaning_1.Meaning.Dropping) {
            const list = (_b = thread.currentPlayer.fields.get(WorldObject_1.WorldObject.contents)) === null || _b === void 0 ? void 0 : _b.value;
            const matchingItems = list.items.filter(x => x.typeName === target.name);
            if (matchingItems.length == 0) {
                return undefined;
            }
            return matchingItems[0];
        }
        else {
            return Memory_1.Memory.findInstanceByName(target.name);
        }
    }
    inferTargetFrom(thread, targetName, meaning) {
        var _a, _b;
        if (meaning === Meaning_1.Meaning.Moving) {
            const placeName = (_b = (_a = thread.currentPlace) === null || _a === void 0 ? void 0 : _a.fields.get(`~${targetName}`)) === null || _b === void 0 ? void 0 : _b.value;
            if (!placeName) {
                return undefined;
            }
            return placeName.value;
        }
        if (meaning === Meaning_1.Meaning.Inventory) {
            return Player_1.Player.typeName;
        }
        return targetName;
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
},{"../../common/EventType":3,"../../common/Type":9,"../../library/Player":57,"../../library/Understanding":60,"../../library/WorldObject":61,"../OpCodeHandler":65,"../common/Memory":69,"../errors/RuntimeError":70,"../library/Meaning":95,"../library/RuntimeCommand":98,"../library/RuntimeDelegate":100,"../library/RuntimeItem":103,"../library/RuntimeWorldObject":109,"../library/Variable":110}],78:[function(require,module,exports){
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
},{"../../common/Type":9,"../OpCodeHandler":65,"../library/Variable":110}],79:[function(require,module,exports){
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
},{"../OpCodeHandler":65,"../errors/RuntimeError":70,"../library/RuntimeDelegate":100}],80:[function(require,module,exports){
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
},{"../OpCodeHandler":65}],81:[function(require,module,exports){
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
},{"../OpCodeHandler":65,"../errors/RuntimeError":70}],82:[function(require,module,exports){
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
},{"../OpCodeHandler":65}],83:[function(require,module,exports){
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
},{"../OpCodeHandler":65,"../common/Memory":69}],84:[function(require,module,exports){
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
},{"../EvaluationResult":63,"../OpCodeHandler":65,"./InstanceCallHandler":78,"./LoadThisHandler":86}],85:[function(require,module,exports){
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
},{"../OpCodeHandler":65,"../errors/RuntimeError":70,"../library/RuntimeString":108}],86:[function(require,module,exports){
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
},{"../OpCodeHandler":65}],87:[function(require,module,exports){
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
},{"../OpCodeHandler":65,"../common/Memory":69,"../errors/RuntimeError":70}],88:[function(require,module,exports){
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
},{"../EvaluationResult":63,"../OpCodeHandler":65}],89:[function(require,module,exports){
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
},{"../OpCodeHandler":65,"../common/Memory":69,"../errors/RuntimeError":70,"../library/RuntimeString":108}],90:[function(require,module,exports){
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
},{"../OpCodeHandler":65,"../errors/RuntimeError":70,"../library/RuntimeString":108}],91:[function(require,module,exports){
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
},{"../EvaluationResult":63,"../OpCodeHandler":65}],92:[function(require,module,exports){
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
},{"../EvaluationResult":63,"../OpCodeHandler":65,"../errors/RuntimeError":70,"../library/RuntimeEmpty":101}],93:[function(require,module,exports){
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
},{"../OpCodeHandler":65}],94:[function(require,module,exports){
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
},{"../OpCodeHandler":65,"../common/Memory":69}],95:[function(require,module,exports){
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
},{}],96:[function(require,module,exports){
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
},{"../../library/Any":47}],97:[function(require,module,exports){
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
},{"./RuntimeAny":96}],98:[function(require,module,exports){
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
},{"./RuntimeAny":96}],99:[function(require,module,exports){
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
},{"../../library/Decoration":49,"./RuntimeWorldObject":109}],100:[function(require,module,exports){
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
},{"../../library/Any":47,"../../library/Delegate":50,"./RuntimeAny":96}],101:[function(require,module,exports){
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
},{"../../library/Any":47,"./RuntimeAny":96}],102:[function(require,module,exports){
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
},{"./RuntimeAny":96}],103:[function(require,module,exports){
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
},{"../../library/Item":53,"../../library/WorldObject":61,"./RuntimeWorldObject":109}],104:[function(require,module,exports){
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
},{"../../common/Instruction":5,"../../common/Method":6,"../../common/Parameter":8,"../../library/BooleanType":48,"../../library/List":54,"../../library/NumberType":55,"../../library/StringType":59,"../common/Memory":69,"./RuntimeAny":96}],105:[function(require,module,exports){
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
},{"../../library/Place":56,"../../library/WorldObject":61,"./RuntimeWorldObject":109}],106:[function(require,module,exports){
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
},{"../../library/Player":57,"./RuntimeWorldObject":109}],107:[function(require,module,exports){
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
},{"./RuntimeAny":96}],108:[function(require,module,exports){
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
},{"../../library/Any":47,"./RuntimeAny":96}],109:[function(require,module,exports){
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
},{"../../common/Field":4,"../../common/Type":9,"../../library/Any":47,"../../library/List":54,"../../library/StringType":59,"../../library/WorldObject":61,"../errors/RuntimeError":70,"./RuntimeAny":96}],110:[function(require,module,exports){
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
},{}]},{},[62])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL25vcmhhL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInRhbG9uL1BhbmVPdXRwdXQudHMiLCJ0YWxvbi9UYWxvbklkZS50cyIsInRhbG9uL2NvbW1vbi9FdmVudFR5cGUudHMiLCJ0YWxvbi9jb21tb24vRmllbGQudHMiLCJ0YWxvbi9jb21tb24vSW5zdHJ1Y3Rpb24udHMiLCJ0YWxvbi9jb21tb24vTWV0aG9kLnRzIiwidGFsb24vY29tbW9uL09wQ29kZS50cyIsInRhbG9uL2NvbW1vbi9QYXJhbWV0ZXIudHMiLCJ0YWxvbi9jb21tb24vVHlwZS50cyIsInRhbG9uL2NvbW1vbi9WZXJzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvVGFsb25Db21waWxlci50cyIsInRhbG9uL2NvbXBpbGVyL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvci50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9LZXl3b3Jkcy50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9QdW5jdHVhdGlvbi50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9UYWxvbkxleGVyLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1Rva2VuLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1Rva2VuVHlwZS50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvUGFyc2VDb250ZXh0LnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9UYWxvblBhcnNlci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvQWN0aW9uc0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0JpbmFyeUV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0NvbmNhdGVuYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Db250YWluc0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0ZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9JZkV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0xpdGVyYWxFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Qcm9ncmFtRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2F5RXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2V0VmFyaWFibGVFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9XaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9FdmVudEV4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9FeHByZXNzaW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvRmllbGREZWNsYXJhdGlvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL0lmRXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1Byb2dyYW1WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9TYXlFeHByZXNzaW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvVHlwZURlY2xhcmF0aW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvV2hlbkRlY2xhcmF0aW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3NlbWFudGljcy9UYWxvblNlbWFudGljQW5hbHl6ZXIudHMiLCJ0YWxvbi9jb21waWxlci90cmFuc2Zvcm1pbmcvRXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZS50cyIsInRhbG9uL2NvbXBpbGVyL3RyYW5zZm9ybWluZy9UYWxvblRyYW5zZm9ybWVyLnRzIiwidGFsb24vbGlicmFyeS9BbnkudHMiLCJ0YWxvbi9saWJyYXJ5L0Jvb2xlYW5UeXBlLnRzIiwidGFsb24vbGlicmFyeS9EZWNvcmF0aW9uLnRzIiwidGFsb24vbGlicmFyeS9EZWxlZ2F0ZS50cyIsInRhbG9uL2xpYnJhcnkvRW50cnlQb2ludEF0dHJpYnV0ZS50cyIsInRhbG9uL2xpYnJhcnkvRXh0ZXJuQ2FsbC50cyIsInRhbG9uL2xpYnJhcnkvSXRlbS50cyIsInRhbG9uL2xpYnJhcnkvTGlzdC50cyIsInRhbG9uL2xpYnJhcnkvTnVtYmVyVHlwZS50cyIsInRhbG9uL2xpYnJhcnkvUGxhY2UudHMiLCJ0YWxvbi9saWJyYXJ5L1BsYXllci50cyIsInRhbG9uL2xpYnJhcnkvU2F5LnRzIiwidGFsb24vbGlicmFyeS9TdHJpbmdUeXBlLnRzIiwidGFsb24vbGlicmFyeS9VbmRlcnN0YW5kaW5nLnRzIiwidGFsb24vbGlicmFyeS9Xb3JsZE9iamVjdC50cyIsInRhbG9uL21haW4udHMiLCJ0YWxvbi9ydW50aW1lL0V2YWx1YXRpb25SZXN1bHQudHMiLCJ0YWxvbi9ydW50aW1lL01ldGhvZEFjdGl2YXRpb24udHMiLCJ0YWxvbi9ydW50aW1lL09wQ29kZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL1N0YWNrRnJhbWUudHMiLCJ0YWxvbi9ydW50aW1lL1RhbG9uUnVudGltZS50cyIsInRhbG9uL3J1bnRpbWUvVGhyZWFkLnRzIiwidGFsb24vcnVudGltZS9jb21tb24vTWVtb3J5LnRzIiwidGFsb24vcnVudGltZS9lcnJvcnMvUnVudGltZUVycm9yLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Bc3NpZ25WYXJpYWJsZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0JyYW5jaFJlbGF0aXZlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvQ29uY2F0ZW5hdGVIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9FeHRlcm5hbENhbGxIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Hb1RvSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvSGFuZGxlQ29tbWFuZEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0luc3RhbmNlQ2FsbEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0ludm9rZURlbGVnYXRlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZEZpZWxkSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZEluc3RhbmNlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZExvY2FsSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZE51bWJlckhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRQcm9wZXJ0eUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRTdHJpbmdIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkVGhpc0hhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL05ld0luc3RhbmNlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTm9PcEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1BhcnNlQ29tbWFuZEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1ByaW50SGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvUmVhZElucHV0SGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvUmV0dXJuSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvU3RhdGljQ2FsbEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1R5cGVPZkhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvTWVhbmluZy50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lQW55LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVCb29sZWFuLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVDb21tYW5kLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVEZWNvcmF0aW9uLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVEZWxlZ2F0ZS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lRW1wdHkudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUludGVnZXIudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUl0ZW0udHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUxpc3QudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVBsYWNlLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVQbGF5ZXIudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVNheS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lU3RyaW5nLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVXb3JsZE9iamVjdC50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9WYXJpYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0EsTUFBYSxVQUFVO0lBQ25CLFlBQW9CLElBQW1CO1FBQW5CLFNBQUksR0FBSixJQUFJLENBQWU7SUFFdkMsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFZO1FBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQztJQUMxQyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQVk7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDO0lBQzFDLENBQUM7Q0FDSjtBQWhCRCxnQ0FnQkM7Ozs7QUNuQkQsNERBQXlEO0FBRXpELDZDQUEwQztBQUUxQyx5REFBc0Q7QUFHdEQsTUFBYSxRQUFRO0lBd0JqQjtRQU5RLGtCQUFhLEdBQVUsRUFBRSxDQUFDO1FBUTlCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBaUIsV0FBVyxDQUFFLENBQUM7UUFDL0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFpQixXQUFXLENBQUUsQ0FBQztRQUMvRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBaUIsb0JBQW9CLENBQUUsQ0FBQztRQUNqRixJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQWlCLFVBQVUsQ0FBRSxDQUFDO1FBQ25FLElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBb0IsVUFBVSxDQUFFLENBQUM7UUFDdkUsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFvQixTQUFTLENBQUUsQ0FBQztRQUNyRSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBb0IsZ0JBQWdCLENBQUUsQ0FBQztRQUNqRixJQUFJLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQW1CLG1CQUFtQixDQUFFLENBQUM7UUFDaEYsSUFBSSxDQUFDLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQW9CLG1CQUFtQixDQUFDLENBQUM7UUFFdEYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDbEYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDL0MsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsRUFBRSxFQUFFLFlBQVk7Z0JBQy9CLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzthQUMxQjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksdUJBQVUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSx1QkFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSx1QkFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUUvRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksMkJBQVksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDdkYsQ0FBQztJQWhDTyxNQUFNLENBQUMsT0FBTyxDQUF3QixJQUFXO1FBQ3JELE9BQVUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBZ0NPLGVBQWU7UUFDbkIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUM7UUFDM0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVPLE9BQU87UUFDWCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUVyQyxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRU8sWUFBWTtRQUNoQixJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBRWxDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFDO1lBQzFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDeEI7SUFDTCxDQUFDO0lBRU8sV0FBVztRQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUztZQUNuQixpQ0FBaUM7Z0JBRWpDLHVDQUF1QztnQkFDdkMsd0NBQXdDO2dCQUN4Qyx1Q0FBdUM7Z0JBQ3ZDLGlDQUFpQztnQkFDakMsbUNBQW1DO2dCQUNuQyxxQ0FBcUM7Z0JBQ3JDLHVDQUF1QztnQkFFdkMsK0JBQStCO2dCQUMvQixtQ0FBbUM7Z0JBQ25DLHFRQUFxUTtnQkFDclEsdUJBQXVCO2dCQUN2QixpREFBaUQ7Z0JBQ2pELGtDQUFrQztnQkFDbEMsMkJBQTJCO2dCQUMzQiwwQ0FBMEM7Z0JBQzFDLHdCQUF3QjtnQkFDeEIscUJBQXFCO2dCQUVyQix5Q0FBeUM7Z0JBQ3pDLHlFQUF5RTtnQkFFekUsa0NBQWtDO2dCQUNsQyw0SEFBNEg7Z0JBQzVILDZDQUE2QztnQkFDN0MsMkJBQTJCO2dCQUMzQiwyRkFBMkY7Z0JBQzNGLG9FQUFvRTtnQkFDcEUscUJBQXFCO2dCQUVyQixrQ0FBa0M7Z0JBRWxDLDhCQUE4QjtnQkFDOUIsZ0RBQWdEO2dCQUVoRCw2QkFBNkIsQ0FBQztJQUMxQyxDQUFDO0NBQ0o7QUFwSEQsNEJBb0hDOzs7O0FDM0hELElBQVksU0FJWDtBQUpELFdBQVksU0FBUztJQUNqQix5Q0FBSSxDQUFBO0lBQ0osbUVBQWlCLENBQUE7SUFDakIsaUVBQWdCLENBQUE7QUFDcEIsQ0FBQyxFQUpXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBSXBCOzs7O0FDREQsTUFBYSxLQUFLO0lBQWxCO1FBQ0ksU0FBSSxHQUFVLEVBQUUsQ0FBQztRQUNqQixhQUFRLEdBQVUsRUFBRSxDQUFDO0lBR3pCLENBQUM7Q0FBQTtBQUxELHNCQUtDOzs7O0FDUkQscUNBQWtDO0FBRWxDLE1BQWEsV0FBVztJQTRGcEIsWUFBWSxNQUFhLEVBQUUsS0FBYTtRQUh4QyxXQUFNLEdBQVUsZUFBTSxDQUFDLElBQUksQ0FBQztRQUl4QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBOUZELE1BQU0sQ0FBQyxNQUFNO1FBQ1QsT0FBTyxJQUFJLFdBQVcsQ0FBQyxlQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELE1BQU0sQ0FBQyxjQUFjO1FBQ2pCLE9BQU8sSUFBSSxXQUFXLENBQUMsZUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQWU7UUFDM0IsT0FBTyxJQUFJLFdBQVcsQ0FBQyxlQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQVk7UUFDMUIsT0FBTyxJQUFJLFdBQVcsQ0FBQyxlQUFNLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQVk7UUFDMUIsT0FBTyxJQUFJLFdBQVcsQ0FBQyxlQUFNLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQWU7UUFDL0IsT0FBTyxJQUFJLFdBQVcsQ0FBQyxlQUFNLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQWdCO1FBQzdCLE9BQU8sSUFBSSxXQUFXLENBQUMsZUFBTSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFnQjtRQUNoQyxPQUFPLElBQUksV0FBVyxDQUFDLGVBQU0sQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBZ0I7UUFDN0IsT0FBTyxJQUFJLFdBQVcsQ0FBQyxlQUFNLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUTtRQUNYLE9BQU8sSUFBSSxXQUFXLENBQUMsZUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQWlCO1FBQ2pDLE9BQU8sSUFBSSxXQUFXLENBQUMsZUFBTSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQVc7UUFDZCxPQUFPLElBQUksV0FBVyxDQUFDLGVBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFlLEVBQUUsVUFBaUI7UUFDaEQsT0FBTyxJQUFJLFdBQVcsQ0FBQyxlQUFNLENBQUMsVUFBVSxFQUFFLEdBQUcsUUFBUSxJQUFJLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBaUI7UUFDakMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxlQUFNLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSztRQUNSLE9BQU8sSUFBSSxXQUFXLENBQUMsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTTtRQUNULE9BQU8sSUFBSSxXQUFXLENBQUMsZUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxNQUFNLENBQUMsU0FBUztRQUNaLE9BQU8sSUFBSSxXQUFXLENBQUMsZUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxNQUFNLENBQUMsWUFBWTtRQUNmLE9BQU8sSUFBSSxXQUFXLENBQUMsZUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxNQUFNLENBQUMsYUFBYTtRQUNoQixPQUFPLElBQUksV0FBVyxDQUFDLGVBQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFpQjtRQUN6QixPQUFPLElBQUksV0FBVyxDQUFDLGVBQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBWTtRQUM5QixPQUFPLElBQUksV0FBVyxDQUFDLGVBQU0sQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFZO1FBQ3JDLE9BQU8sSUFBSSxXQUFXLENBQUMsZUFBTSxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hFLENBQUM7Q0FTSjtBQWhHRCxrQ0FnR0M7Ozs7QUMvRkQsMkNBQXdDO0FBRXhDLE1BQWEsTUFBTTtJQUFuQjtRQUNJLFNBQUksR0FBVSxFQUFFLENBQUM7UUFDakIsZUFBVSxHQUFlLEVBQUUsQ0FBQztRQUM1QixxQkFBZ0IsR0FBYyxFQUFFLENBQUM7UUFDakMsU0FBSSxHQUFpQixFQUFFLENBQUM7UUFDeEIsZUFBVSxHQUFVLEVBQUUsQ0FBQztRQUN2QixjQUFTLEdBQWEscUJBQVMsQ0FBQyxJQUFJLENBQUM7SUFDekMsQ0FBQztDQUFBO0FBUEQsd0JBT0M7Ozs7QUNaRCxJQUFZLE1BeUJYO0FBekJELFdBQVksTUFBTTtJQUNkLG1DQUFJLENBQUE7SUFDSix1Q0FBTSxDQUFBO0lBQ04scUNBQUssQ0FBQTtJQUNMLCtDQUFVLENBQUE7SUFDVixpREFBVyxDQUFBO0lBQ1gsbURBQVksQ0FBQTtJQUNaLHFEQUFhLENBQUE7SUFDYiw2Q0FBUyxDQUFBO0lBQ1QsbUNBQUksQ0FBQTtJQUNKLHVDQUFNLENBQUE7SUFDTix3REFBYyxDQUFBO0lBQ2Qsc0VBQXFCLENBQUE7SUFDckIsa0RBQVcsQ0FBQTtJQUNYLGdEQUFVLENBQUE7SUFDViw4Q0FBUyxDQUFBO0lBQ1Qsb0RBQVksQ0FBQTtJQUNaLG9EQUFZLENBQUE7SUFDWiw4Q0FBUyxDQUFBO0lBQ1QsNENBQVEsQ0FBQTtJQUNSLG9EQUFZLENBQUE7SUFDWixnREFBVSxDQUFBO0lBQ1Ysb0RBQVksQ0FBQTtJQUNaLHdDQUFNLENBQUE7SUFDTix3REFBYyxDQUFBO0FBQ2xCLENBQUMsRUF6QlcsTUFBTSxHQUFOLGNBQU0sS0FBTixjQUFNLFFBeUJqQjs7OztBQ3ZCRCxNQUFhLFNBQVM7SUFJbEIsWUFBNEIsSUFBVyxFQUNYLFFBQWU7UUFEZixTQUFJLEdBQUosSUFBSSxDQUFPO1FBQ1gsYUFBUSxHQUFSLFFBQVEsQ0FBTztJQUUzQyxDQUFDO0NBQ0o7QUFSRCw4QkFRQzs7OztBQ05ELE1BQWEsSUFBSTtJQWFiLFlBQW1CLElBQVcsRUFBUyxZQUFtQjtRQUF2QyxTQUFJLEdBQUosSUFBSSxDQUFPO1FBQVMsaUJBQVksR0FBWixZQUFZLENBQU87UUFaMUQsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUNwQixZQUFPLEdBQVksRUFBRSxDQUFDO1FBQ3RCLGVBQVUsR0FBZSxFQUFFLENBQUM7SUFZNUIsQ0FBQztJQVZELElBQUksWUFBWTtRQUNaLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELElBQUksZUFBZTtRQUNmLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkMsQ0FBQztDQUtKO0FBaEJELG9CQWdCQzs7OztBQ3BCRCxNQUFhLE9BQU87SUFDaEIsWUFBNEIsS0FBWSxFQUNaLEtBQVksRUFDWixLQUFZO1FBRlosVUFBSyxHQUFMLEtBQUssQ0FBTztRQUNaLFVBQUssR0FBTCxLQUFLLENBQU87UUFDWixVQUFLLEdBQUwsS0FBSyxDQUFPO0lBQ3hDLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdkQsQ0FBQztDQUNKO0FBVEQsMEJBU0M7Ozs7QUNURCx5Q0FBc0M7QUFDdEMsNkNBQTBDO0FBQzFDLHdDQUFxQztBQUNyQyx1REFBb0Q7QUFDcEQsd0VBQXFFO0FBQ3JFLG9EQUFpRDtBQUNqRCx1REFBb0Q7QUFDcEQsNkVBQTBFO0FBQzFFLHNFQUFtRTtBQUNuRSwrQ0FBNEM7QUFFNUMsb0VBQWlFO0FBQ2pFLGtEQUErQztBQUUvQyxNQUFhLGFBQWE7SUFTdEIsWUFBNkIsR0FBVztRQUFYLFFBQUcsR0FBSCxHQUFHLENBQVE7SUFDeEMsQ0FBQztJQVRELElBQUksZUFBZTtRQUNmLE9BQU8sSUFBSSxpQkFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQUksT0FBTztRQUNQLE9BQU8sSUFBSSxpQkFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUtELE9BQU8sQ0FBQyxJQUFXO1FBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUUxQyxJQUFHO1lBQ0MsTUFBTSxLQUFLLEdBQUcsSUFBSSx1QkFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QyxNQUFNLE1BQU0sR0FBRyxJQUFJLHlCQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sUUFBUSxHQUFHLElBQUksNkNBQXFCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sV0FBVyxHQUFHLElBQUksbUNBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRW5ELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFDLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFakQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFFM0MsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUV2QixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUFDLE9BQU0sRUFBRSxFQUFDO1lBQ1AsSUFBSSxFQUFFLFlBQVksbUNBQWdCLEVBQUM7Z0JBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7YUFDMUM7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDNUM7WUFFRCxPQUFPLEVBQUUsQ0FBQztTQUNiO2dCQUFRO1lBQ0wsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUMzQztJQUNMLENBQUM7SUFFTyxnQkFBZ0I7UUFDcEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFJLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRS9DLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUkseUNBQW1CLEVBQUUsQ0FBQyxDQUFDO1FBRWhELE1BQU0sSUFBSSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFHLENBQUMsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNWLHlCQUFXLENBQUMsVUFBVSxDQUFDLG9CQUFvQixJQUFJLENBQUMsZUFBZSxnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQzlGLHlCQUFXLENBQUMsS0FBSyxFQUFFLEVBQ25CLHlCQUFXLENBQUMsVUFBVSxDQUFDLG1DQUFtQyxDQUFDLEVBQzNELHlCQUFXLENBQUMsS0FBSyxFQUFFLEVBQ25CLHlCQUFXLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUMxQix5QkFBVyxDQUFDLEtBQUssRUFBRSxFQUNuQix5QkFBVyxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLEVBQzdDLHlCQUFXLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUMxQix5QkFBVyxDQUFDLEtBQUssRUFBRSxFQUNuQix5QkFBVyxDQUFDLFVBQVUsQ0FBQyw0QkFBNEIsQ0FBQyxFQUNwRCx5QkFBVyxDQUFDLEtBQUssRUFBRSxFQUNuQix5QkFBVyxDQUFDLFNBQVMsRUFBRSxFQUN2Qix5QkFBVyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFDMUIseUJBQVcsQ0FBQyxLQUFLLEVBQUUsRUFDbkIseUJBQVcsQ0FBQyxZQUFZLEVBQUUsRUFDMUIseUJBQVcsQ0FBQyxhQUFhLEVBQUUsRUFDM0IseUJBQVcsQ0FBQyxRQUFRLENBQUMsbUJBQVEsQ0FBQyxRQUFRLENBQUMsRUFDdkMseUJBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFDcEMseUJBQVcsQ0FBQyxjQUFjLEVBQUUsRUFDNUIseUJBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDOUIseUJBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQ3RCLENBQUM7UUFFRixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV4QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUEvRUQsc0NBK0VDOzs7O0FDN0ZELE1BQWEsZ0JBQWdCO0lBRXpCLFlBQXFCLE9BQWM7UUFBZCxZQUFPLEdBQVAsT0FBTyxDQUFPO0lBRW5DLENBQUM7Q0FDSjtBQUxELDRDQUtDOzs7O0FDREQsTUFBYSxRQUFRO0lBK0NqQixNQUFNLENBQUMsTUFBTTtRQUdULE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7UUFFdEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRW5ELEtBQUksSUFBSSxPQUFPLElBQUksS0FBSyxFQUFDO1lBQ3JCLE1BQU0sS0FBSyxHQUFJLFFBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFL0MsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxJQUFJLFVBQVUsRUFBQztnQkFDakQsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMxQjtTQUNKO1FBRUQsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQzs7QUEvREwsNEJBZ0VDO0FBOURtQixXQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ1YsVUFBQyxHQUFHLEdBQUcsQ0FBQztBQUNSLFlBQUcsR0FBRyxLQUFLLENBQUM7QUFDWixXQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ1YsYUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNkLFdBQUUsR0FBRyxJQUFJLENBQUM7QUFDVixjQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ2hCLGFBQUksR0FBRyxNQUFNLENBQUM7QUFDZCxXQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ1YsWUFBRyxHQUFHLEtBQUssQ0FBQztBQUNaLFdBQUUsR0FBRyxJQUFJLENBQUM7QUFDVixvQkFBVyxHQUFHLGFBQWEsQ0FBQztBQUM1QixtQkFBVSxHQUFHLFlBQVksQ0FBQztBQUMxQixXQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ1YsbUJBQVUsR0FBRyxZQUFZLENBQUM7QUFDMUIsa0JBQVMsR0FBRyxXQUFXLENBQUM7QUFDeEIsY0FBSyxHQUFHLE9BQU8sQ0FBQztBQUNoQixlQUFNLEdBQUcsUUFBUSxDQUFDO0FBQ2xCLGVBQU0sR0FBRyxRQUFRLENBQUM7QUFDbEIsaUJBQVEsR0FBRyxVQUFVLENBQUM7QUFDdEIsWUFBRyxHQUFHLEtBQUssQ0FBQztBQUNaLG1CQUFVLEdBQUcsWUFBWSxDQUFDO0FBQzFCLGVBQU0sR0FBRyxRQUFRLENBQUM7QUFDbEIsZUFBTSxHQUFHLFFBQVEsQ0FBQztBQUNsQixrQkFBUyxHQUFHLFdBQVcsQ0FBQztBQUN4QixZQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ1osY0FBSyxHQUFHLE9BQU8sQ0FBQztBQUNoQixXQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ1YsY0FBSyxHQUFHLE9BQU8sQ0FBQztBQUNoQixZQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ1osYUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNkLGFBQUksR0FBRyxNQUFNLENBQUM7QUFDZCxhQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsZUFBTSxHQUFHLFFBQVEsQ0FBQztBQUNsQixjQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ2hCLGFBQUksR0FBRyxNQUFNLENBQUM7QUFDZCxpQkFBUSxHQUFHLFVBQVUsQ0FBQztBQUN0QixhQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsWUFBRyxHQUFHLEtBQUssQ0FBQztBQUNaLFdBQUUsR0FBRyxJQUFJLENBQUM7QUFDVixtQkFBVSxHQUFHLFlBQVksQ0FBQztBQUMxQixnQkFBTyxHQUFHLFNBQVMsQ0FBQztBQUNwQixZQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ1osaUJBQVEsR0FBRyxVQUFVLENBQUM7Ozs7QUNqRDFDLE1BQWEsV0FBVzs7QUFBeEIsa0NBSUM7QUFIbUIsa0JBQU0sR0FBRyxHQUFHLENBQUM7QUFDYixpQkFBSyxHQUFHLEdBQUcsQ0FBQztBQUNaLHFCQUFTLEdBQUcsR0FBRyxDQUFDOzs7O0FDSHBDLG1DQUFnQztBQUNoQyx5Q0FBc0M7QUFDdEMsK0NBQTRDO0FBQzVDLDJDQUF3QztBQUd4QyxNQUFhLFVBQVU7SUFHbkIsWUFBNkIsR0FBVztRQUFYLFFBQUcsR0FBSCxHQUFHLENBQVE7SUFFeEMsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFXO1FBQ2hCLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFFdEIsTUFBTSxNQUFNLEdBQVcsRUFBRSxDQUFDO1FBRTFCLEtBQUksSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHO1lBQ3JDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFdkMsSUFBSSxXQUFXLElBQUksR0FBRyxFQUFDO2dCQUNuQixhQUFhLEVBQUUsQ0FBQztnQkFDaEIsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsU0FBUzthQUNaO1lBRUQsSUFBSSxXQUFXLElBQUksSUFBSSxFQUFDO2dCQUNwQixhQUFhLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQixXQUFXLEVBQUUsQ0FBQztnQkFDZCxLQUFLLEVBQUUsQ0FBQztnQkFDUixTQUFTO2FBQ1o7WUFFRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRXZELElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7Z0JBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksYUFBSyxDQUFDLFdBQVcsRUFBRSxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ2hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEI7WUFFRCxhQUFhLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQztZQUNuQyxLQUFLLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQztTQUM5QjtRQUVELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRU8sUUFBUSxDQUFDLE1BQWM7UUFDM0IsS0FBSSxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUM7WUFDcEIsSUFBSSxLQUFLLENBQUMsS0FBSyxJQUFJLHlCQUFXLENBQUMsTUFBTSxFQUFDO2dCQUNsQyxLQUFLLENBQUMsSUFBSSxHQUFHLHFCQUFTLENBQUMsVUFBVSxDQUFDO2FBQ3JDO2lCQUFNLElBQUksS0FBSyxDQUFDLEtBQUssSUFBSSx5QkFBVyxDQUFDLFNBQVMsRUFBQztnQkFDNUMsS0FBSyxDQUFDLElBQUksR0FBRyxxQkFBUyxDQUFDLGNBQWMsQ0FBQzthQUN6QztpQkFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLElBQUkseUJBQVcsQ0FBQyxLQUFLLEVBQUM7Z0JBQ3hDLEtBQUssQ0FBQyxJQUFJLEdBQUcscUJBQVMsQ0FBQyxlQUFlLENBQUM7YUFDMUM7aUJBQU0sSUFBSSxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUM7Z0JBQy9DLEtBQUssQ0FBQyxJQUFJLEdBQUcscUJBQVMsQ0FBQyxPQUFPLENBQUM7YUFDbEM7aUJBQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQztnQkFDbEUsS0FBSyxDQUFDLElBQUksR0FBRyxxQkFBUyxDQUFDLE1BQU0sQ0FBQzthQUNqQztpQkFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDcEMsS0FBSyxDQUFDLElBQUksR0FBRyxxQkFBUyxDQUFDLE1BQU0sQ0FBQzthQUNqQztpQkFBTTtnQkFDSCxLQUFLLENBQUMsSUFBSSxHQUFHLHFCQUFTLENBQUMsVUFBVSxDQUFDO2FBQ3JDO1NBQ0o7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU8sbUJBQW1CLENBQUMsSUFBVyxFQUFFLEtBQVk7UUFDakQsTUFBTSxVQUFVLEdBQVksRUFBRSxDQUFDO1FBQy9CLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQztRQUU3QixJQUFJLGlCQUFpQixHQUFHLEtBQUssQ0FBQztRQUU5QixLQUFJLElBQUksY0FBYyxHQUFHLEtBQUssRUFBRSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsRUFBQztZQUMzRSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRWhELElBQUksaUJBQWlCLElBQUksV0FBVyxJQUFJLGVBQWUsRUFBQztnQkFDcEQsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDN0IsU0FBUzthQUNaO1lBRUQsSUFBSSxXQUFXLElBQUksZUFBZSxFQUFDO2dCQUMvQixVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUU3QixpQkFBaUIsR0FBRyxDQUFDLGlCQUFpQixDQUFDO2dCQUV2QyxJQUFJLGlCQUFpQixFQUFDO29CQUNsQixTQUFTO2lCQUNaO3FCQUFNO29CQUNILE1BQU07aUJBQ1Q7YUFDSjtZQUVELElBQUksV0FBVyxJQUFJLEdBQUcsSUFBSSxXQUFXLElBQUksSUFBSSxJQUFJLFdBQVcsSUFBSSx5QkFBVyxDQUFDLE1BQU0sSUFBSSxXQUFXLElBQUkseUJBQVcsQ0FBQyxLQUFLLElBQUksV0FBVyxJQUFJLHlCQUFXLENBQUMsU0FBUyxFQUFDO2dCQUMzSixJQUFJLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFDO29CQUN2QixVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUNoQztnQkFDRCxNQUFNO2FBQ1Q7WUFFRCxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ2hDO1FBRUQsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLENBQUM7O0FBdEdMLGdDQXVHQztBQXRHMkIsc0JBQVcsR0FBRyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDOzs7O0FDUDVELDJDQUF3QztBQUN4QywrQ0FBNEM7QUFDNUMsMkNBQXdDO0FBQ3hDLDJEQUF3RDtBQUN4RCwyREFBd0Q7QUFDeEQsNkNBQTBDO0FBQzFDLDZDQUEwQztBQUMxQyx5REFBc0Q7QUFFdEQsTUFBYSxLQUFLO0lBeUNkLFlBQTRCLElBQVcsRUFDWCxNQUFhLEVBQ2IsS0FBWTtRQUZaLFNBQUksR0FBSixJQUFJLENBQU87UUFDWCxXQUFNLEdBQU4sTUFBTSxDQUFPO1FBQ2IsVUFBSyxHQUFMLEtBQUssQ0FBTztRQUp4QyxTQUFJLEdBQWEscUJBQVMsQ0FBQyxPQUFPLENBQUM7SUFLbkMsQ0FBQztJQTNDRCxNQUFNLEtBQUssS0FBSztRQUNaLE9BQU8sS0FBSyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxxQkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxNQUFNLEtBQUssTUFBTTtRQUNiLE9BQU8sS0FBSyxDQUFDLGtCQUFrQixDQUFDLFNBQUcsQ0FBQyxRQUFRLEVBQUUscUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQsTUFBTSxLQUFLLFFBQVE7UUFDZixPQUFPLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxhQUFLLENBQUMsUUFBUSxFQUFFLHFCQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELE1BQU0sS0FBSyxPQUFPO1FBQ2QsT0FBTyxLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBSSxDQUFDLFFBQVEsRUFBRSxxQkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxNQUFNLEtBQUssYUFBYTtRQUNwQixPQUFPLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyx1QkFBVSxDQUFDLFFBQVEsRUFBRSxxQkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxNQUFNLEtBQUssY0FBYztRQUNyQixPQUFPLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyx5QkFBVyxDQUFDLFFBQVEsRUFBRSxxQkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxNQUFNLEtBQUssVUFBVTtRQUNqQixPQUFPLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyx5QkFBVyxDQUFDLFFBQVEsRUFBRSxxQkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxNQUFNLEtBQUssT0FBTztRQUNkLE9BQU8sS0FBSyxDQUFDLGtCQUFrQixDQUFDLFdBQUksQ0FBQyxRQUFRLEVBQUUscUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRU8sTUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQVcsRUFBRSxJQUFjO1FBQ3pELE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFTRCxRQUFRO1FBQ0osT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sa0JBQWtCLElBQUksQ0FBQyxLQUFLLGNBQWMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO0lBQzdGLENBQUM7Q0FDSjtBQWpERCxzQkFpREM7Ozs7QUMxREQsSUFBWSxTQVNYO0FBVEQsV0FBWSxTQUFTO0lBQ2pCLCtDQUFPLENBQUE7SUFDUCwrQ0FBTyxDQUFBO0lBQ1AscURBQVUsQ0FBQTtJQUNWLDZEQUFjLENBQUE7SUFDZCw2Q0FBTSxDQUFBO0lBQ04scURBQVUsQ0FBQTtJQUNWLDZDQUFNLENBQUE7SUFDTiwrREFBZSxDQUFBO0FBQ25CLENBQUMsRUFUVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQVNwQjs7OztBQ1RELDJDQUF3QztBQUN4QyxxRUFBa0U7QUFDbEUsbURBQWdEO0FBR2hELE1BQWEsWUFBWTtJQVdyQixZQUE2QixNQUFjLEVBQW1CLEdBQVc7UUFBNUMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFtQixRQUFHLEdBQUgsR0FBRyxDQUFRO1FBVnpFLFVBQUssR0FBVSxDQUFDLENBQUM7UUFXYixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLGdDQUFnQyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQVZELElBQUksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUM1QyxDQUFDO0lBRUQsSUFBSSxZQUFZO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBTUQsbUJBQW1CO1FBQ2YsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUVoQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFYixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsRUFBRSxDQUFDLFVBQWlCOztRQUNoQixPQUFPLE9BQUEsSUFBSSxDQUFDLFlBQVksMENBQUUsS0FBSyxLQUFJLFVBQVUsQ0FBQztJQUNsRCxDQUFDO0lBRUQsUUFBUSxDQUFDLElBQWM7UUFDbkIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7SUFDMUMsQ0FBQztJQUVELFdBQVcsQ0FBQyxHQUFHLEtBQWlCO1FBQzVCLEtBQUksTUFBTSxJQUFJLElBQUksS0FBSyxFQUFDO1lBQ3BCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQztnQkFDcEIsT0FBTyxJQUFJLENBQUM7YUFDZjtTQUNKO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELE9BQU8sQ0FBQyxHQUFHLFdBQW9CO1FBQzNCLEtBQUksSUFBSSxLQUFLLElBQUksV0FBVyxFQUFDO1lBQ3pCLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBQztnQkFDZixPQUFPLElBQUksQ0FBQzthQUNmO1NBQ0o7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsWUFBWTtRQUNSLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUkscUJBQVMsQ0FBQyxVQUFVLENBQUM7SUFDMUQsQ0FBQztJQUVELFdBQVcsQ0FBQyxHQUFHLFdBQW9CO1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsV0FBVyxDQUFDLEVBQUM7WUFDOUIsTUFBTSxJQUFJLG1DQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDakQ7UUFFRCxPQUFPLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFFRCxNQUFNLENBQUMsVUFBaUI7UUFDcEIsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssSUFBSSxVQUFVLEVBQUM7WUFDdEMsTUFBTSxJQUFJLG1DQUFnQixDQUFDLG1CQUFtQixVQUFVLEdBQUcsQ0FBQyxDQUFDO1NBQ2hFO1FBRUQsT0FBTyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRUQsWUFBWTtRQUNSLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUkscUJBQVMsQ0FBQyxNQUFNLEVBQUM7WUFDM0MsTUFBTSxJQUFJLG1DQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDakQ7UUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUV6QyxnRkFBZ0Y7UUFFaEYsT0FBTyxJQUFJLGFBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakcsQ0FBQztJQUVELFlBQVk7UUFDUixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLHFCQUFTLENBQUMsTUFBTSxFQUFDO1lBQzNDLE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQ2pEO1FBRUQsT0FBTyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBRUQsZ0JBQWdCO1FBQ1osSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxxQkFBUyxDQUFDLFVBQVUsRUFBQztZQUMvQyxNQUFNLElBQUksbUNBQWdCLENBQUMscUJBQXFCLENBQUMsQ0FBQztTQUNyRDtRQUVELE9BQU8sSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVELGdCQUFnQjtRQUNaLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUkscUJBQVMsQ0FBQyxVQUFVLEVBQUM7WUFDL0MsTUFBTSxJQUFJLG1DQUFnQixDQUFDLGdDQUFnQyxDQUFDLENBQUM7U0FDaEU7UUFFRCxPQUFPLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFFRCxvQkFBb0I7UUFDaEIsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxxQkFBUyxDQUFDLGNBQWMsRUFBQztZQUNuRCxNQUFNLElBQUksbUNBQWdCLENBQUMscUNBQXFDLENBQUMsQ0FBQztTQUNyRTtRQUVELE9BQU8sSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVELHFCQUFxQjtRQUNqQixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLHFCQUFTLENBQUMsZUFBZSxFQUFDO1lBQ3BELE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1NBQzVEO1FBRUQsT0FBTyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0NBQ0o7QUExSEQsb0NBMEhDOzs7O0FDN0hELDhEQUEyRDtBQUMzRCxpREFBOEM7QUFHOUMsTUFBYSxXQUFXO0lBQ3BCLFlBQTZCLEdBQVc7UUFBWCxRQUFHLEdBQUgsR0FBRyxDQUFRO0lBRXhDLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBYztRQUNoQixNQUFNLE9BQU8sR0FBRyxJQUFJLDJCQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRCxNQUFNLE9BQU8sR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUVyQyxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNKO0FBWEQsa0NBV0M7Ozs7QUNqQkQsNkNBQTBDO0FBRTFDLE1BQWEsaUJBQWtCLFNBQVEsdUJBQVU7SUFDN0MsWUFBNEIsT0FBb0I7UUFDNUMsS0FBSyxFQUFFLENBQUM7UUFEZ0IsWUFBTyxHQUFQLE9BQU8sQ0FBYTtJQUVoRCxDQUFDO0NBQ0o7QUFKRCw4Q0FJQzs7OztBQ05ELDZDQUEwQztBQUUxQyxNQUFhLGdCQUFpQixTQUFRLHVCQUFVO0NBRy9DO0FBSEQsNENBR0M7Ozs7QUNMRCx5REFBc0Q7QUFFdEQsTUFBYSx1QkFBd0IsU0FBUSxtQ0FBZ0I7Q0FFNUQ7QUFGRCwwREFFQzs7OztBQ0pELDZDQUEwQztBQUUxQyxNQUFhLGtCQUFtQixTQUFRLHVCQUFVO0lBQzlDLFlBQTRCLFVBQWlCLEVBQ2pCLEtBQVksRUFDWixRQUFlO1FBQzNCLEtBQUssRUFBRSxDQUFDO1FBSEksZUFBVSxHQUFWLFVBQVUsQ0FBTztRQUNqQixVQUFLLEdBQUwsS0FBSyxDQUFPO1FBQ1osYUFBUSxHQUFSLFFBQVEsQ0FBTztJQUUzQyxDQUFDO0NBQ0o7QUFORCxnREFNQzs7OztBQ1JELE1BQWEsVUFBVTtDQUV0QjtBQUZELGdDQUVDOzs7O0FDRkQsNkNBQTBDO0FBSTFDLE1BQWEsMEJBQTJCLFNBQVEsdUJBQVU7SUFBMUQ7O1FBQ0ksU0FBSSxHQUFVLEVBQUUsQ0FBQztRQUNqQixhQUFRLEdBQVUsRUFBRSxDQUFDO1FBR3JCLDBCQUFxQixHQUFzQixFQUFFLENBQUM7SUFDbEQsQ0FBQztDQUFBO0FBTkQsZ0VBTUM7Ozs7QUNWRCw2Q0FBMEM7QUFFMUMsTUFBYSxZQUFhLFNBQVEsdUJBQVU7SUFDeEMsWUFBNEIsV0FBc0IsRUFDdEIsT0FBa0IsRUFDbEIsU0FBb0I7UUFDaEMsS0FBSyxFQUFFLENBQUM7UUFISSxnQkFBVyxHQUFYLFdBQVcsQ0FBVztRQUN0QixZQUFPLEdBQVAsT0FBTyxDQUFXO1FBQ2xCLGNBQVMsR0FBVCxTQUFTLENBQVc7SUFFcEMsQ0FBQztDQUNoQjtBQU5ELG9DQU1DOzs7O0FDUkQsNkNBQTBDO0FBRTFDLE1BQWEsaUJBQWtCLFNBQVEsdUJBQVU7SUFDN0MsWUFBNEIsUUFBZSxFQUFrQixLQUFZO1FBQ3JFLEtBQUssRUFBRSxDQUFDO1FBRGdCLGFBQVEsR0FBUixRQUFRLENBQU87UUFBa0IsVUFBSyxHQUFMLEtBQUssQ0FBTztJQUV6RSxDQUFDO0NBQ0o7QUFKRCw4Q0FJQzs7OztBQ05ELDZDQUEwQztBQUUxQyxNQUFhLGlCQUFrQixTQUFRLHVCQUFVO0lBQzdDLFlBQXFCLFdBQXdCO1FBQ3pDLEtBQUssRUFBRSxDQUFDO1FBRFMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7SUFFN0MsQ0FBQztDQUNKO0FBSkQsOENBSUM7Ozs7QUNORCw2Q0FBMEM7QUFFMUMsTUFBYSxhQUFjLFNBQVEsdUJBQVU7SUFDekMsWUFBbUIsSUFBVztRQUMxQixLQUFLLEVBQUUsQ0FBQztRQURPLFNBQUksR0FBSixJQUFJLENBQU87SUFFOUIsQ0FBQztDQUNKO0FBSkQsc0NBSUM7Ozs7QUNORCw2Q0FBMEM7QUFFMUMsTUFBYSxxQkFBc0IsU0FBUSx1QkFBVTtJQUNqRCxZQUE0QixZQUE2QixFQUM3QixZQUFtQixFQUNuQixvQkFBK0I7UUFDdkQsS0FBSyxFQUFFLENBQUM7UUFIZ0IsaUJBQVksR0FBWixZQUFZLENBQWlCO1FBQzdCLGlCQUFZLEdBQVosWUFBWSxDQUFPO1FBQ25CLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBVztJQUUzRCxDQUFDO0NBQ0o7QUFORCxzREFNQzs7OztBQ1JELDZDQUEwQztBQUsxQyxNQUFhLHlCQUEwQixTQUFRLHVCQUFVO0lBTXJELFlBQXFCLFNBQWUsRUFBVyxpQkFBdUI7UUFDbEUsS0FBSyxFQUFFLENBQUM7UUFEUyxjQUFTLEdBQVQsU0FBUyxDQUFNO1FBQVcsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFNO1FBTHRFLFNBQUksR0FBVSxFQUFFLENBQUM7UUFFakIsV0FBTSxHQUFnQyxFQUFFLENBQUM7UUFDekMsV0FBTSxHQUErQixFQUFFLENBQUM7UUFJcEMsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDO0lBQ2hDLENBQUM7Q0FFSjtBQVhELDhEQVdDOzs7O0FDaEJELDZDQUEwQztBQUUxQyxNQUFhLGtDQUFtQyxTQUFRLHVCQUFVO0lBQzlELFlBQTRCLEtBQVksRUFBa0IsT0FBYztRQUNwRSxLQUFLLEVBQUUsQ0FBQztRQURnQixVQUFLLEdBQUwsS0FBSyxDQUFPO1FBQWtCLFlBQU8sR0FBUCxPQUFPLENBQU87SUFFeEUsQ0FBQztDQUNKO0FBSkQsZ0ZBSUM7Ozs7QUNORCw2Q0FBMEM7QUFFMUMsTUFBYSx5QkFBMEIsU0FBUSx1QkFBVTtJQUNyRCxZQUE0QixLQUFZLEVBQ1osU0FBZ0IsRUFDaEIsT0FBa0I7UUFDMUMsS0FBSyxFQUFFLENBQUM7UUFIZ0IsVUFBSyxHQUFMLEtBQUssQ0FBTztRQUNaLGNBQVMsR0FBVCxTQUFTLENBQU87UUFDaEIsWUFBTyxHQUFQLE9BQU8sQ0FBVztJQUU5QyxDQUFDO0NBQ0o7QUFORCw4REFNQzs7OztBQ1JELDJEQUF3RDtBQUl4RCxvREFBaUQ7QUFDakQsd0VBQXFFO0FBRXJFLE1BQWEsc0JBQXVCLFNBQVEscUNBQWlCO0lBQ3pELEtBQUssQ0FBQyxPQUFvQjtRQUV0QixNQUFNLE9BQU8sR0FBZ0IsRUFBRSxDQUFDO1FBRWhDLE9BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLG1CQUFRLENBQUMsR0FBRyxDQUFDLEVBQUM7WUFDNUIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXJCLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQ2xDO1FBRUQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFM0IsT0FBTyxJQUFJLHFDQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FDSjtBQW5CRCx3REFtQkM7Ozs7QUMxQkQsdUNBQW9DO0FBR3BDLG9EQUFpRDtBQUNqRCwrREFBNEQ7QUFDNUQsd0VBQXFFO0FBQ3JFLDBFQUF1RTtBQUN2RSxnRUFBNkQ7QUFDN0Qsc0RBQW1EO0FBQ25ELGdGQUE2RTtBQUM3RSx3RUFBcUU7QUFDckUsNERBQXlEO0FBQ3pELDREQUF5RDtBQUV6RCxNQUFhLGlCQUFrQixTQUFRLGlCQUFPO0lBQzFDLEtBQUssQ0FBQyxPQUFxQjtRQUN2QixJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUN4QixNQUFNLE9BQU8sR0FBRyxJQUFJLHlDQUFtQixFQUFFLENBQUM7WUFDMUMsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pDO2FBQU0sSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLG1CQUFRLENBQUMsRUFBRSxDQUFDLEVBQUM7WUFFL0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVsQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDckMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFFNUMsT0FBTyxJQUFJLHVDQUFrQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3RTthQUFNLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFDO1lBQ2hDLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUU3QixJQUFJLFlBQW1CLENBQUM7WUFFeEIsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLHFCQUFTLENBQUMsTUFBTSxDQUFDLEVBQUM7Z0JBQ25DLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsS0FBSyxDQUFDO2FBQy9DO2lCQUFNO2dCQUNILG1EQUFtRDtnQkFDbkQsTUFBTSxJQUFJLG1DQUFnQixDQUFDLHVFQUF1RSxDQUFDLENBQUM7YUFDdkc7WUFFRCxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFNUIsSUFBSSxLQUFZLENBQUM7WUFFakIsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLHFCQUFTLENBQUMsTUFBTSxDQUFDLEVBQUM7Z0JBQ25DLEtBQUssR0FBRyxJQUFJLHFDQUFpQixDQUFDLHVCQUFVLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNwRjtpQkFBTSxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMscUJBQVMsQ0FBQyxNQUFNLENBQUMsRUFBQztnQkFDMUMsS0FBSyxHQUFHLElBQUkscUNBQWlCLENBQUMsdUJBQVUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3BGO2lCQUFNO2dCQUNILG1EQUFtRDtnQkFDbkQsTUFBTSxJQUFJLG1DQUFnQixDQUFDLDZGQUE2RixDQUFDLENBQUM7YUFDN0g7WUFFRCxPQUFPLElBQUksNkNBQXFCLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNwRTthQUFNLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFDO1lBQ2hDLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUU3QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFcEMsT0FBTyxJQUFJLDZCQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hDO2FBQU0sSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLHFCQUFTLENBQUMsTUFBTSxDQUFDLEVBQUM7WUFDMUMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRXJDLE9BQU8sSUFBSSxxQ0FBaUIsQ0FBQyx1QkFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEU7YUFBTTtZQUNILE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1NBQzVEO0lBQ0wsQ0FBQztDQUVKO0FBdkRELDhDQXVEQzs7OztBQ3JFRCx1Q0FBb0M7QUFHcEMsb0RBQWlEO0FBQ2pELDBGQUF1RjtBQUN2RixrREFBK0M7QUFDL0MsOERBQTJEO0FBQzNELHdFQUFxRTtBQUNyRSw4REFBMkQ7QUFDM0QsNERBQXlEO0FBQ3pELGdEQUE2QztBQUU3QywyREFBd0Q7QUFDeEQsb0ZBQWlGO0FBQ2pGLHNEQUFtRDtBQUNuRCw0REFBeUQ7QUFFekQsTUFBYSx1QkFBd0IsU0FBUSxpQkFBTztJQUNoRCxLQUFLLENBQUMsT0FBcUI7UUFFdkIsTUFBTSxLQUFLLEdBQUcsSUFBSSx1REFBMEIsRUFBRSxDQUFDO1FBRS9DLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU1QixJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQVEsQ0FBQyxFQUFFLENBQUMsRUFBQztZQUN4QixPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFNUIsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLG1CQUFRLENBQUMsR0FBRyxFQUFFLG1CQUFRLENBQUMsT0FBTyxDQUFDLEVBQUM7Z0JBQ2hELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztnQkFFckIsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLG1CQUFRLENBQUMsR0FBRyxDQUFDLEVBQUM7b0JBQ3pCLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDN0IsU0FBUyxHQUFHLEtBQUssQ0FBQztpQkFDckI7Z0JBRUQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUVqQyxLQUFLLENBQUMsSUFBSSxHQUFHLHlCQUFXLENBQUMsT0FBTyxDQUFDO2dCQUNqQyxLQUFLLENBQUMsUUFBUSxHQUFHLHlCQUFXLENBQUMsUUFBUSxDQUFDO2dCQUN0QyxLQUFLLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQzthQUVsQztpQkFBTSxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQVEsQ0FBQyxRQUFRLENBQUMsRUFBQztnQkFDckMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNsQyxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRTVCLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFFM0MsS0FBSyxDQUFDLElBQUksR0FBRyx5QkFBVyxDQUFDLFdBQVcsQ0FBQztnQkFDckMsS0FBSyxDQUFDLFFBQVEsR0FBRyx1QkFBVSxDQUFDLFFBQVEsQ0FBQztnQkFDckMsS0FBSyxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO2FBRTFDO2lCQUFNLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFDO2dCQUN0QyxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ25DLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFFNUIsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUUzQyxLQUFLLENBQUMsSUFBSSxHQUFHLHlCQUFXLENBQUMsV0FBVyxDQUFDO2dCQUNyQyxLQUFLLENBQUMsUUFBUSxHQUFHLHVCQUFVLENBQUMsUUFBUSxDQUFDO2dCQUNyQyxLQUFLLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7Z0JBRXZDLE9BQU8sT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFDO29CQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRTdCLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxxQ0FBaUIsRUFBRSxDQUFDO29CQUNsRCxNQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRXBELE1BQU0sY0FBYyxHQUFHLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFFL0ksTUFBTSxNQUFNLEdBQUcsSUFBSSxpREFBdUIsRUFBRSxDQUFDO29CQUU3QyxNQUFNLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQztvQkFDN0IsTUFBTSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUM7b0JBRTFCLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQzVDO2FBRUo7aUJBQU0sSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLG1CQUFRLENBQUMsS0FBSyxDQUFDLEVBQUM7Z0JBQ2xDLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDL0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QixPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2hDLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFaEMsS0FBSyxDQUFDLElBQUksR0FBRyxhQUFLLENBQUMsYUFBYSxDQUFDO2dCQUNqQyxLQUFLLENBQUMsUUFBUSxHQUFHLHlCQUFXLENBQUMsUUFBUSxDQUFDO2dCQUN0QyxLQUFLLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzthQUU3QjtpQkFBTTtnQkFDSCxNQUFNLElBQUksbUNBQWdCLENBQUMsb0NBQW9DLENBQUMsQ0FBQzthQUNwRTtTQUNKO2FBQU0sSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLG1CQUFRLENBQUMsR0FBRyxDQUFDLEVBQUM7WUFFaEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUzQixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFcEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlCLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUU1QixJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMscUJBQVMsQ0FBQyxNQUFNLENBQUMsRUFBQztnQkFDbkMsS0FBSyxDQUFDLFFBQVEsR0FBRyx1QkFBVSxDQUFDLFFBQVEsQ0FBQztnQkFDckMsS0FBSyxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsS0FBSyxDQUFDO2FBQ3JEO2lCQUFNLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFDO2dCQUMxQyxLQUFLLENBQUMsUUFBUSxHQUFHLHVCQUFVLENBQUMsUUFBUSxDQUFDO2dCQUNyQyxLQUFLLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUM7YUFDckQ7aUJBQU07Z0JBQ0gsTUFBTSxJQUFJLG1DQUFnQixDQUFDLDRDQUE0QyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7YUFDekc7WUFFRCxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7U0FFM0I7YUFBTSxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQVEsQ0FBQyxRQUFRLENBQUMsRUFBQztZQUVyQyxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFbEMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3JDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBRXhDLDBDQUEwQztZQUUxQyxLQUFLLENBQUMsSUFBSSxHQUFHLHlCQUFXLENBQUMsUUFBUSxDQUFDO1lBQ2xDLEtBQUssQ0FBQyxRQUFRLEdBQUcsV0FBSSxDQUFDLFFBQVEsQ0FBQztZQUMvQixLQUFLLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzVEO2FBQU0sSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLG1CQUFRLENBQUMsR0FBRyxDQUFDLEVBQUM7WUFFaEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQixPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFN0IsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFFN0MsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUvQixNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFekMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNuQyxLQUFLLENBQUMsUUFBUSxHQUFHLHVCQUFVLENBQUMsUUFBUSxDQUFDO1lBQ3JDLEtBQUssQ0FBQyxZQUFZLEdBQUcsR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDN0M7YUFBTTtZQUNILE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1NBQzNEO1FBRUQsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFM0IsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztDQUNKO0FBbklELDBEQW1JQzs7OztBQ3BKRCx1Q0FBb0M7QUFFcEMsMERBQXVEO0FBQ3ZELG9EQUFpRDtBQUNqRCwyREFBd0Q7QUFDeEQsOERBQTJEO0FBRTNELE1BQWEsbUJBQW9CLFNBQVEsaUJBQU87SUFDNUMsS0FBSyxDQUFDLE9BQXFCO1FBQ3ZCLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU1QixNQUFNLGlCQUFpQixHQUFHLElBQUkscUNBQWlCLEVBQUUsQ0FBQztRQUNsRCxNQUFNLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTlCLE1BQU0sT0FBTyxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqRCxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQztZQUMxQixPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFOUIsTUFBTSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRW5ELE9BQU8sSUFBSSwyQkFBWSxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDNUQ7UUFFRCxPQUFPLElBQUksMkJBQVksQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLElBQUksdUJBQVUsRUFBRSxDQUFDLENBQUM7SUFDcEUsQ0FBQztDQUNKO0FBckJELGtEQXFCQzs7OztBQzVCRCx1Q0FBb0M7QUFHcEMsb0RBQWlEO0FBQ2pELHFFQUFrRTtBQUNsRSx3RUFBcUU7QUFDckUsd0VBQXFFO0FBQ3JFLHVGQUFvRjtBQUNwRixpRUFBOEQ7QUFFOUQsTUFBYSxjQUFlLFNBQVEsaUJBQU87SUFDdkMsS0FBSyxDQUFDLE9BQXFCO1FBQ3ZCLElBQUksV0FBVyxHQUFnQixFQUFFLENBQUM7UUFFbEMsT0FBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUM7WUFDbEIsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLG1CQUFRLENBQUMsVUFBVSxDQUFDLEVBQUM7Z0JBQ2hDLE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxpRUFBK0IsRUFBRSxDQUFDO2dCQUN2RSxNQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRTNELFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDaEM7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLG1CQUFRLENBQUMsQ0FBQyxFQUFFLG1CQUFRLENBQUMsRUFBRSxDQUFDLEVBQUM7Z0JBQ2hELE1BQU0sZUFBZSxHQUFHLElBQUksK0NBQXNCLEVBQUUsQ0FBQztnQkFDckQsTUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFbEQsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNoQztpQkFBTSxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQVEsQ0FBQyxHQUFHLENBQUMsRUFBQztnQkFDaEMsTUFBTSxhQUFhLEdBQUcsSUFBSSwyQ0FBb0IsRUFBRSxDQUFDO2dCQUNqRCxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUVoRCwwRkFBMEY7Z0JBQzFGLHlEQUF5RDtnQkFFekQsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBRTNCLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDaEM7aUJBQUs7Z0JBQ0YsTUFBTSxJQUFJLG1DQUFnQixDQUFDLDJCQUEyQixPQUFPLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQzthQUNsRjtTQUNKO1FBRUQsT0FBTyxJQUFJLHFDQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDSjtBQWhDRCx3Q0FnQ0M7Ozs7QUMxQ0QsdUNBQW9DO0FBR3BDLG9EQUFpRDtBQUNqRCxnRUFBNkQ7QUFFN0QsTUFBYSxvQkFBcUIsU0FBUSxpQkFBTztJQUM3QyxLQUFLLENBQUMsT0FBcUI7UUFDdkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTdCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwQyxPQUFPLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUNKO0FBUkQsb0RBUUM7Ozs7QUNkRCx1Q0FBb0M7QUFHcEMsb0RBQWlEO0FBRWpELHdGQUFxRjtBQUNyRix1RUFBb0U7QUFHcEUscUVBQWtFO0FBRWxFLE1BQWEsc0JBQXVCLFNBQVEsaUJBQU87SUFDL0MsS0FBSyxDQUFDLE9BQXFCO1FBQ3ZCLE9BQU8sQ0FBQyxXQUFXLENBQUMsbUJBQVEsQ0FBQyxDQUFDLEVBQUUsbUJBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU3QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUV4QyxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFNUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU5QyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUUzQixNQUFNLE1BQU0sR0FBZ0MsRUFBRSxDQUFDO1FBRS9DLE9BQU8sT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFDO1lBQzNCLE1BQU0sWUFBWSxHQUFHLElBQUksaURBQXVCLEVBQUUsQ0FBQztZQUNuRCxNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTFDLE1BQU0sQ0FBQyxJQUFJLENBQTZCLEtBQUssQ0FBQyxDQUFDO1NBQ2xEO1FBRUQsTUFBTSxNQUFNLEdBQStCLEVBQUUsQ0FBQztRQUU5QyxPQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQztZQUM3QixNQUFNLFdBQVcsR0FBRyxJQUFJLCtDQUFzQixFQUFFLENBQUM7WUFDakQsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV4QyxNQUFNLENBQUMsSUFBSSxDQUE0QixJQUFJLENBQUMsQ0FBQztTQUNoRDtRQUVELE1BQU0sZUFBZSxHQUFHLElBQUkscURBQXlCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRFLGVBQWUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ2hDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRWhDLE9BQU8sZUFBZSxDQUFDO0lBQzNCLENBQUM7SUFFTyxjQUFjLENBQUMsT0FBb0I7UUFDdkMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLG1CQUFRLENBQUMsS0FBSyxFQUFFLG1CQUFRLENBQUMsSUFBSSxFQUFFLG1CQUFRLENBQUMsVUFBVSxDQUFDLEVBQUM7WUFDcEUsT0FBTyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztTQUN4QzthQUFNO1lBQ0gsT0FBTyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUNyQztJQUNMLENBQUM7Q0FDSjtBQWhERCx3REFnREM7Ozs7QUMzREQsdUNBQW9DO0FBR3BDLG9EQUFpRDtBQUNqRCwwR0FBdUc7QUFFdkcsTUFBYSwrQkFBZ0MsU0FBUSxpQkFBTztJQUN4RCxLQUFLLENBQUMsT0FBcUI7UUFDdkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXBDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVyQyxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFNUIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxtQkFBUSxDQUFDLFVBQVUsRUFDbkIsbUJBQVEsQ0FBQyxNQUFNLEVBQ2YsbUJBQVEsQ0FBQyxVQUFVLEVBQ25CLG1CQUFRLENBQUMsTUFBTSxFQUNmLG1CQUFRLENBQUMsU0FBUyxFQUNsQixtQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXZELE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRTNCLE9BQU8sSUFBSSx1RUFBa0MsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5RSxDQUFDO0NBQ0o7QUFuQkQsMEVBbUJDOzs7O0FDdEJELE1BQXNCLE9BQU87Q0FFNUI7QUFGRCwwQkFFQzs7OztBQ0xELHVDQUFvQztBQUdwQyxvREFBaUQ7QUFDakQsd0ZBQXFGO0FBR3JGLHFFQUFrRTtBQUVsRSxNQUFhLHNCQUF1QixTQUFRLGlCQUFPO0lBQy9DLEtBQUssQ0FBQyxPQUFxQjtRQUN2QixPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxNQUFNLENBQUMsbUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoQyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLG1CQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdkUsT0FBTyxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFFaEMsTUFBTSxjQUFjLEdBQUcsSUFBSSwrQ0FBc0IsRUFBRSxDQUFDO1FBQ3BELE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFOUMsT0FBTyxJQUFJLHFEQUF5QixDQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEYsQ0FBQztDQUVKO0FBaEJELHdEQWdCQzs7OztBQ3hCRCxnRkFBNkU7QUFDN0UsZ0dBQTZGO0FBQzdGLDJDQUF3QztBQUN4QyxtREFBZ0Q7QUFHaEQsTUFBYSxxQkFBcUI7SUFVOUIsWUFBNkIsR0FBVztRQUFYLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFSdkIsUUFBRyxHQUFHLElBQUkscURBQXlCLENBQUMsYUFBSyxDQUFDLE1BQU0sRUFBRSxhQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0QsZ0JBQVcsR0FBRyxJQUFJLHFEQUF5QixDQUFDLGFBQUssQ0FBQyxjQUFjLEVBQUUsYUFBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hGLFVBQUssR0FBRyxJQUFJLHFEQUF5QixDQUFDLGFBQUssQ0FBQyxRQUFRLEVBQUUsYUFBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVFLFNBQUksR0FBRyxJQUFJLHFEQUF5QixDQUFDLGFBQUssQ0FBQyxPQUFPLEVBQUUsYUFBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzFFLGdCQUFXLEdBQUcsSUFBSSxxREFBeUIsQ0FBQyxhQUFLLENBQUMsVUFBVSxFQUFFLGFBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RSxTQUFJLEdBQUcsSUFBSSxxREFBeUIsQ0FBQyxhQUFLLENBQUMsT0FBTyxFQUFFLGFBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRSxlQUFVLEdBQUcsSUFBSSxxREFBeUIsQ0FBQyxhQUFLLENBQUMsYUFBYSxFQUFFLGFBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUl2RyxDQUFDO0lBRUQsT0FBTyxDQUFDLFVBQXFCO1FBQ3pCLE1BQU0sS0FBSyxHQUErQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFakksSUFBSSxVQUFVLFlBQVkscUNBQWlCLEVBQUM7WUFDeEMsS0FBSSxJQUFJLEtBQUssSUFBSSxVQUFVLENBQUMsV0FBVyxFQUFDO2dCQUNwQyxJQUFJLEtBQUssWUFBWSxxREFBeUIsRUFBQztvQkFDM0MsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDckI7YUFDSjtTQUNKO1FBRUQsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQW9DLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVGLEtBQUksTUFBTSxXQUFXLElBQUksS0FBSyxFQUFDO1lBQzNCLE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQztZQUVoRCxJQUFJLFNBQVMsQ0FBQyxJQUFJLElBQUkscUJBQVMsQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBQztnQkFDeEUsTUFBTSxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ25DLFdBQVcsQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNoRDtpQkFBTTtnQkFDSCxXQUFXLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzNEO1lBRUQsS0FBSSxNQUFNLEtBQUssSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFDO2dCQUNsQyxLQUFLLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ2hEO1NBQ0o7UUFFRCxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDO0NBQ0o7QUE1Q0Qsc0RBNENDOzs7O0FDbkRELElBQVksNEJBR1g7QUFIRCxXQUFZLDRCQUE0QjtJQUNwQywrRUFBSSxDQUFBO0lBQ0osK0hBQTRCLENBQUE7QUFDaEMsQ0FBQyxFQUhXLDRCQUE0QixHQUE1QixvQ0FBNEIsS0FBNUIsb0NBQTRCLFFBR3ZDOzs7O0FDRkQsNENBQXlDO0FBQ3pDLGdGQUE2RTtBQUM3RSxxRUFBa0U7QUFDbEUsZ0dBQTZGO0FBQzdGLGtIQUErRztBQUMvRywrREFBNEQ7QUFDNUQsOENBQTJDO0FBQzNDLDJDQUF3QztBQUN4QywyREFBd0Q7QUFDeEQsK0NBQTRDO0FBQzVDLDJEQUF3RDtBQUN4RCx5REFBc0Q7QUFDdEQsNkNBQTBDO0FBQzFDLHlEQUFzRDtBQUN0RCw2Q0FBMEM7QUFDMUMsaURBQThDO0FBQzlDLHdFQUFxRTtBQUNyRSxnREFBNkM7QUFDN0MsMkNBQXdDO0FBQ3hDLDBEQUF1RDtBQUN2RCxzREFBbUQ7QUFDbkQsc0VBQW1FO0FBQ25FLDRGQUF5RjtBQUN6RixrRkFBK0U7QUFDL0Usa0dBQStGO0FBRS9GLGlEQUE4QztBQUM5QyxzREFBbUQ7QUFDbkQsaUZBQThFO0FBRTlFLHdGQUFxRjtBQUNyRixnRkFBNkU7QUFDN0UseURBQXNEO0FBRXRELE1BQWEsZ0JBQWdCO0lBQ3pCLFlBQTZCLEdBQVc7UUFBWCxRQUFHLEdBQUgsR0FBRyxDQUFRO0lBRXhDLENBQUM7SUFFTyxpQkFBaUI7UUFDckIsTUFBTSxLQUFLLEdBQVUsRUFBRSxDQUFDO1FBRXhCLDBHQUEwRztRQUUxRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksV0FBSSxDQUFDLFNBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQUksQ0FBQyx5QkFBVyxDQUFDLFFBQVEsRUFBRSx5QkFBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDdkUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQUksQ0FBQyxhQUFLLENBQUMsUUFBUSxFQUFFLGFBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQzNELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFJLENBQUMseUJBQVcsQ0FBQyxRQUFRLEVBQUUseUJBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFJLENBQUMsdUJBQVUsQ0FBQyxRQUFRLEVBQUUsdUJBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFJLENBQUMsdUJBQVUsQ0FBQyxRQUFRLEVBQUUsdUJBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFJLENBQUMsV0FBSSxDQUFDLFFBQVEsRUFBRSxXQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUN6RCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksV0FBSSxDQUFDLFdBQUksQ0FBQyxRQUFRLEVBQUUsV0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDekQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQUksQ0FBQyxlQUFNLENBQUMsUUFBUSxFQUFFLGVBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQzdELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFJLENBQUMsU0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUN2RCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksV0FBSSxDQUFDLHVCQUFVLENBQUMsUUFBUSxFQUFFLHVCQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUVyRSxPQUFPLElBQUksR0FBRyxDQUFlLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxTQUFTLENBQUMsVUFBcUI7UUFDM0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDN0MsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFFekIsSUFBSSxVQUFVLFlBQVkscUNBQWlCLEVBQUM7WUFDeEMsS0FBSSxNQUFNLEtBQUssSUFBSSxVQUFVLENBQUMsV0FBVyxFQUFDO2dCQUN0QyxJQUFJLEtBQUssWUFBWSx1RUFBa0MsRUFBQztvQkFFcEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFJLENBQUMsSUFBSSw2QkFBYSxDQUFDLFFBQVEsSUFBSSxnQkFBZ0IsRUFBRSxFQUFFLDZCQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRWhHLE1BQU0sTUFBTSxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7b0JBQzNCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsNkJBQWEsQ0FBQyxNQUFNLENBQUM7b0JBQ25DLE1BQU0sQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztvQkFFbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztvQkFDNUIsT0FBTyxDQUFDLElBQUksR0FBRyw2QkFBYSxDQUFDLE9BQU8sQ0FBQztvQkFDckMsT0FBTyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO29CQUVyQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRTFCLGdCQUFnQixFQUFFLENBQUM7b0JBRW5CLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDcEM7cUJBQU0sSUFBSSxLQUFLLFlBQVkscURBQXlCLEVBQUM7b0JBQ2xELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFekQsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUNwQzthQUNKO1lBRUQsS0FBSSxNQUFNLEtBQUssSUFBSSxVQUFVLENBQUMsV0FBVyxFQUFDO2dCQUN0QyxJQUFJLEtBQUssWUFBWSxxREFBeUIsRUFBQztvQkFDM0MsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRXpDLEtBQUksTUFBTSxlQUFlLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBQzt3QkFDdEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQzt3QkFDMUIsS0FBSyxDQUFDLElBQUksR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDO3dCQUNsQyxLQUFLLENBQUMsUUFBUSxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUM7d0JBQzFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBRXZELElBQUksZUFBZSxDQUFDLFlBQVksRUFBQzs0QkFDN0IsSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLHVCQUFVLENBQUMsUUFBUSxFQUFDO2dDQUN0QyxNQUFNLEtBQUssR0FBVyxlQUFlLENBQUMsWUFBWSxDQUFDO2dDQUNuRCxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQzs2QkFDOUI7aUNBQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLHVCQUFVLENBQUMsUUFBUSxFQUFDO2dDQUM3QyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dDQUNuRCxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQzs2QkFDOUI7aUNBQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLHlCQUFXLENBQUMsUUFBUSxFQUFDO2dDQUM5QyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dDQUNwRCxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQzs2QkFDOUI7aUNBQU07Z0NBQ0gsS0FBSyxDQUFDLFlBQVksR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDOzZCQUNyRDt5QkFDSjt3QkFFRCxJQUFJLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFDOzRCQUNqRCxNQUFNLFFBQVEsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDOzRCQUM5QixRQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDOzRCQUNyQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLHFCQUFTLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzRCQUNsRSxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7NEJBRXJDLEtBQUksTUFBTSxVQUFVLElBQUksZUFBZSxDQUFDLHFCQUFxQixFQUFDO2dDQUMxRCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDOzZCQUMvRDs0QkFFRCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx5QkFBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7NEJBRXpDLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTt5QkFDaEM7d0JBRUQsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO3FCQUM1QjtvQkFFRCxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7b0JBRTFCLEtBQUksSUFBSSxPQUFPLEdBQUcsSUFBSSxFQUNsQixPQUFPLEVBQ1AsT0FBTyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFDO3dCQUM1QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUkseUJBQVcsQ0FBQyxRQUFRLEVBQUM7NEJBQ3JDLGFBQWEsR0FBRyxJQUFJLENBQUM7NEJBQ3JCLE1BQU07eUJBQ1Q7cUJBQ1I7b0JBRUQsSUFBSSxhQUFhLEVBQUM7d0JBQ2QsTUFBTSxRQUFRLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQzt3QkFDOUIsUUFBUSxDQUFDLElBQUksR0FBRyx5QkFBVyxDQUFDLFFBQVEsQ0FBQzt3QkFDckMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQ2QseUJBQVcsQ0FBQyxRQUFRLEVBQUUsRUFDdEIseUJBQVcsQ0FBQyxZQUFZLENBQUMseUJBQVcsQ0FBQyxPQUFPLENBQUMsRUFDN0MseUJBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsRUFDcEMseUJBQVcsQ0FBQyxRQUFRLEVBQUUsRUFDdEIseUJBQVcsQ0FBQyxZQUFZLENBQUMseUJBQVcsQ0FBQyxXQUFXLENBQUMsRUFDakQseUJBQVcsQ0FBQyxLQUFLLEVBQUUsRUFDbkIseUJBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FDdkIsQ0FBQzt3QkFFRixJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7d0JBRTdCLE1BQU0sT0FBTyxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7d0JBQzdCLE9BQU8sQ0FBQyxJQUFJLEdBQUcseUJBQVcsQ0FBQyxPQUFPLENBQUM7d0JBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNiLHlCQUFXLENBQUMsUUFBUSxFQUFFLEVBQ3RCLHlCQUFXLENBQUMsWUFBWSxDQUFDLHlCQUFXLENBQUMsT0FBTyxDQUFDLEVBQzdDLHlCQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQ3BDLHlCQUFXLENBQUMsUUFBUSxFQUFFLEVBQ3RCLHlCQUFXLENBQUMsWUFBWSxDQUFDLHlCQUFXLENBQUMsV0FBVyxDQUFDLEVBQ2pELHlCQUFXLENBQUMsS0FBSyxFQUFFLEVBQ25CLHlCQUFXLENBQUMsTUFBTSxFQUFFLENBQ3ZCLENBQUM7d0JBRUYsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUU1QixJQUFJLEVBQUMsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLHlCQUFXLENBQUMsT0FBTyxFQUFDLEVBQUM7NEJBQ3ZELE1BQU0sT0FBTyxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7NEJBRTVCLE9BQU8sQ0FBQyxJQUFJLEdBQUcseUJBQVcsQ0FBQyxPQUFPLENBQUM7NEJBQ25DLE9BQU8sQ0FBQyxRQUFRLEdBQUcseUJBQVcsQ0FBQyxRQUFRLENBQUM7NEJBQ3hDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDOzRCQUU1QixJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7eUJBQzlCO3dCQUVELElBQUksRUFBQyxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUkseUJBQVcsQ0FBQyxRQUFRLEVBQUMsRUFBQzs0QkFDeEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQzs0QkFFN0IsUUFBUSxDQUFDLElBQUksR0FBRyx5QkFBVyxDQUFDLFFBQVEsQ0FBQzs0QkFDckMsUUFBUSxDQUFDLFFBQVEsR0FBRyxXQUFJLENBQUMsUUFBUSxDQUFDOzRCQUNsQyxRQUFRLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQzs0QkFFM0IsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO3lCQUMvQjt3QkFFRCxJQUFJLEVBQUMsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLHlCQUFXLENBQUMsV0FBVyxFQUFDLEVBQUM7NEJBQzNELE1BQU0sV0FBVyxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7NEJBRWhDLFdBQVcsQ0FBQyxJQUFJLEdBQUcseUJBQVcsQ0FBQyxXQUFXLENBQUM7NEJBQzNDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsdUJBQVUsQ0FBQyxRQUFRLENBQUM7NEJBQzNDLFdBQVcsQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDOzRCQUU5QixJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7eUJBQ2xDO3dCQUVELElBQUksbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO3dCQUU1QixLQUFLLE1BQU0sS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUM7NEJBQzdCLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7NEJBRTVCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsVUFBVSxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxTQUFTLElBQUksbUJBQW1CLEVBQUUsQ0FBQzs0QkFDaEYsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzRCQUU1RCxtQkFBbUIsRUFBRSxDQUFDOzRCQUV0QixNQUFNLE9BQU8sR0FBc0IsS0FBSyxDQUFDLE9BQU8sQ0FBQzs0QkFFakQsS0FBSSxNQUFNLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFDO2dDQUNoQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLDJEQUE0QixDQUFDLDRCQUE0QixDQUFDLENBQUM7Z0NBQ3pHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7NkJBQzdCOzRCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzs0QkFFdkMsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO3lCQUM5QjtxQkFDSjtpQkFDSjthQUNKO1lBRUQsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFlBQVksNkJBQWEsQ0FBQyxDQUFDO1lBRWxGLE1BQU0sSUFBSSxHQUFHLElBQUksV0FBSSxDQUFDLGFBQWEsRUFBRSxTQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFbkQsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUM1QixNQUFNLENBQUMsSUFBSSxHQUFHLFNBQUcsQ0FBQyxRQUFRLENBQUM7WUFDM0IsTUFBTSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFFdkIsTUFBTSxZQUFZLEdBQWlCLEVBQUUsQ0FBQztZQUV0QyxLQUFJLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBQztnQkFDeEIsTUFBTSxhQUFhLEdBQWtCLEdBQUcsQ0FBQztnQkFFekMsWUFBWSxDQUFDLElBQUksQ0FDYix5QkFBVyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQzFDLHlCQUFXLENBQUMsS0FBSyxFQUFFLENBQ3RCLENBQUM7YUFDTDtZQUVELFlBQVksQ0FBQyxJQUFJLENBQUMseUJBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBRXhDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDO1lBRTNCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTFCLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNwQzthQUFNO1lBQ0gsTUFBTSxJQUFJLG1DQUFnQixDQUFDLCtCQUErQixDQUFDLENBQUM7U0FDL0Q7UUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLFdBQVcsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDO1FBRXZELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRU8sa0JBQWtCLENBQUMsSUFBVztRQUNsQyxRQUFPLElBQUksRUFBQztZQUNSLEtBQUssbUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDakIsT0FBTyxxQkFBUyxDQUFDLGlCQUFpQixDQUFDO2FBQ3RDO1lBQ0QsS0FBSyxtQkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNoQixPQUFPLHFCQUFTLENBQUMsZ0JBQWdCLENBQUM7YUFDckM7WUFDRCxPQUFPLENBQUMsQ0FBQTtnQkFDSixNQUFNLElBQUksbUNBQWdCLENBQUMsK0NBQStDLElBQUksR0FBRyxDQUFDLENBQUM7YUFDdEY7U0FDSjtJQUNMLENBQUM7SUFFTyxtQkFBbUIsQ0FBQyxVQUFxQixFQUFFLElBQWtDO1FBQ2pGLE1BQU0sWUFBWSxHQUFpQixFQUFFLENBQUM7UUFFdEMsSUFBSSxVQUFVLFlBQVksMkJBQVksRUFBQztZQUNuQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzRSxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7WUFFbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbkUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFdkUsT0FBTyxDQUFDLElBQUksQ0FBQyx5QkFBVyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUUzRCxZQUFZLENBQUMsSUFBSSxDQUFDLHlCQUFXLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7WUFDcEUsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1lBQzlCLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztTQUNuQzthQUFNLElBQUksVUFBVSxZQUFZLDZCQUFhLEVBQUM7WUFDM0MsWUFBWSxDQUFDLElBQUksQ0FBQyx5QkFBVyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMzRCxZQUFZLENBQUMsSUFBSSxDQUFDLHlCQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUV2QyxJQUFJLElBQUksSUFBSSwyREFBNEIsQ0FBQyw0QkFBNEIsRUFBQztnQkFDbEUsWUFBWSxDQUFDLElBQUksQ0FBQyx5QkFBVyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUM5RDtTQUNKO2FBQU0sSUFBSSxVQUFVLFlBQVksdUNBQWtCLEVBQUM7WUFDaEQsWUFBWSxDQUFDLElBQUksQ0FDYix5QkFBVyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQ3hDLHlCQUFXLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFDM0MseUJBQVcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUMvQyx5QkFBVyxDQUFDLFNBQVMsQ0FBQyx5QkFBVyxDQUFDLFFBQVEsQ0FBQyxFQUMzQyx5QkFBVyxDQUFDLFlBQVksQ0FBQyxXQUFJLENBQUMsUUFBUSxDQUFDLENBQzFDLENBQUM7U0FFTDthQUFNLElBQUksVUFBVSxZQUFZLGlEQUF1QixFQUFDO1lBQ3JELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsSUFBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsS0FBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRWhFLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUMzQixZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDNUIsWUFBWSxDQUFDLElBQUksQ0FBQyx5QkFBVyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7U0FDaEQ7YUFBTSxJQUFJLFVBQVUsWUFBWSx1REFBMEIsRUFBQztZQUN4RCxZQUFZLENBQUMsSUFBSSxDQUNiLHlCQUFXLENBQUMsUUFBUSxFQUFFLEVBQ3RCLHlCQUFXLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FDekMsQ0FBQztTQUNMO2FBQU0sSUFBSSxVQUFVLFlBQVksNkNBQXFCLEVBQUM7WUFDbkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBRXhFLFlBQVksQ0FBQyxJQUFJLENBQ2IsR0FBRyxLQUFLLEVBQ1IseUJBQVcsQ0FBQyxRQUFRLEVBQUUsRUFDdEIseUJBQVcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxFQUM5Qyx5QkFBVyxDQUFDLE1BQU0sRUFBRSxDQUN2QixDQUFDO1NBQ0w7YUFBTSxJQUFJLFVBQVUsWUFBWSxxQ0FBaUIsRUFBQztZQUMvQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLElBQUksdUJBQVUsQ0FBQyxRQUFRLEVBQUM7Z0JBQzNDLFlBQVksQ0FBQyxJQUFJLENBQUMseUJBQVcsQ0FBQyxVQUFVLENBQVMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDdkU7aUJBQU0sSUFBSSxVQUFVLENBQUMsUUFBUSxJQUFJLHVCQUFVLENBQUMsUUFBUSxFQUFDO2dCQUNsRCxZQUFZLENBQUMsSUFBSSxDQUFDLHlCQUFXLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZFO2lCQUFNO2dCQUNILE1BQU0sSUFBSSxtQ0FBZ0IsQ0FBQyx1REFBdUQsVUFBVSxHQUFHLENBQUMsQ0FBQzthQUNwRztTQUNKO2FBQU07WUFDSCxNQUFNLElBQUksbUNBQWdCLENBQUMsNENBQTRDLENBQUMsQ0FBQztTQUM1RTtRQUVELE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7SUFFTywrQkFBK0IsQ0FBQyxVQUFvQztRQUN4RSxPQUFPLElBQUksV0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLFFBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRSxDQUFDO0NBQ0o7QUF6VEQsNENBeVRDOzs7O0FDNVZELDZDQUEwQztBQUUxQyxNQUFhLEdBQUc7O0FBQWhCLGtCQU1DO0FBTFUsa0JBQWMsR0FBVSxFQUFFLENBQUM7QUFDM0IsWUFBUSxHQUFVLE1BQU0sQ0FBQztBQUV6QixRQUFJLEdBQUcsT0FBTyxDQUFDO0FBQ2Ysa0JBQWMsR0FBRyx1QkFBVSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7OztBQ1B2RCwrQkFBNEI7QUFFNUIsTUFBYSxXQUFXOztBQUF4QixrQ0FHQztBQUZVLDBCQUFjLEdBQUcsU0FBRyxDQUFDLFFBQVEsQ0FBQztBQUM5QixvQkFBUSxHQUFHLFVBQVUsQ0FBQzs7OztBQ0pqQywrQ0FBNEM7QUFFNUMsTUFBYSxVQUFVOztBQUF2QixnQ0FHQztBQUZVLHlCQUFjLEdBQUcseUJBQVcsQ0FBQyxRQUFRLENBQUM7QUFDdEMsbUJBQVEsR0FBRyxhQUFhLENBQUM7Ozs7QUNKcEMsK0JBQTRCO0FBRTVCLE1BQWEsUUFBUTs7QUFBckIsNEJBR0M7QUFGVSxpQkFBUSxHQUFHLFdBQVcsQ0FBQztBQUN2Qix1QkFBYyxHQUFHLFNBQUcsQ0FBQyxRQUFRLENBQUM7Ozs7QUNKekMsTUFBYSxtQkFBbUI7SUFBaEM7UUFDSSxTQUFJLEdBQVUsYUFBYSxDQUFDO0lBQ2hDLENBQUM7Q0FBQTtBQUZELGtEQUVDOzs7O0FDRkQsTUFBYSxVQUFVO0lBUW5CLFlBQVksSUFBVyxFQUFFLEdBQUcsSUFBYTtRQUh6QyxTQUFJLEdBQVUsRUFBRSxDQUFDO1FBQ2pCLFNBQUksR0FBWSxFQUFFLENBQUM7UUFHZixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBVkQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFXLEVBQUUsR0FBRyxJQUFhO1FBQ25DLE9BQU8sSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQztDQVNKO0FBWkQsZ0NBWUM7Ozs7QUNaRCwrQ0FBNEM7QUFFNUMsTUFBYSxJQUFJOztBQUFqQixvQkFHQztBQUZtQixhQUFRLEdBQUcsT0FBTyxDQUFDO0FBQ25CLG1CQUFjLEdBQUcseUJBQVcsQ0FBQyxRQUFRLENBQUM7Ozs7QUNKMUQsK0JBQTRCO0FBRTVCLE1BQWEsSUFBSTs7QUFBakIsb0JBUUM7QUFQbUIsYUFBUSxHQUFHLE9BQU8sQ0FBQztBQUNuQixtQkFBYyxHQUFHLFNBQUcsQ0FBQyxRQUFRLENBQUM7QUFFOUIsYUFBUSxHQUFHLFdBQVcsQ0FBQztBQUV2QixzQkFBaUIsR0FBRyxXQUFXLENBQUM7QUFDaEMsbUJBQWMsR0FBRyxRQUFRLENBQUM7Ozs7QUNUOUMsK0JBQTRCO0FBRTVCLE1BQWEsVUFBVTs7QUFBdkIsZ0NBR0M7QUFGbUIsbUJBQVEsR0FBRyxTQUFTLENBQUM7QUFDckIseUJBQWMsR0FBRyxTQUFHLENBQUMsUUFBUSxDQUFDOzs7O0FDSmxELCtDQUE0QztBQUU1QyxNQUFhLEtBQUs7O0FBQWxCLHNCQUtDO0FBSlUsb0JBQWMsR0FBRyx5QkFBVyxDQUFDLFFBQVEsQ0FBQztBQUN0QyxjQUFRLEdBQUcsUUFBUSxDQUFDO0FBRXBCLG1CQUFhLEdBQUcsZ0JBQWdCLENBQUM7Ozs7QUNONUMsK0NBQTRDO0FBRTVDLE1BQWEsTUFBTTs7QUFBbkIsd0JBR0M7QUFGbUIsZUFBUSxHQUFHLFNBQVMsQ0FBQztBQUNyQixxQkFBYyxHQUFHLHlCQUFXLENBQUMsUUFBUSxDQUFDOzs7O0FDSjFELCtCQUE0QjtBQUU1QixNQUFhLEdBQUc7O0FBQWhCLGtCQUdDO0FBRm1CLFlBQVEsR0FBRyxNQUFNLENBQUM7QUFDbEIsa0JBQWMsR0FBRyxTQUFHLENBQUMsUUFBUSxDQUFDOzs7O0FDSmxELCtCQUE0QjtBQUU1QixNQUFhLFVBQVU7O0FBQXZCLGdDQUdDO0FBRlUseUJBQWMsR0FBRyxTQUFHLENBQUMsUUFBUSxDQUFDO0FBQzlCLG1CQUFRLEdBQUcsU0FBUyxDQUFDOzs7O0FDSmhDLCtCQUE0QjtBQUU1QixNQUFhLGFBQWE7O0FBQTFCLHNDQWFDO0FBWlUsNEJBQWMsR0FBRyxTQUFHLENBQUMsUUFBUSxDQUFDO0FBQzlCLHNCQUFRLEdBQUcsZ0JBQWdCLENBQUM7QUFFNUIsd0JBQVUsR0FBRyxhQUFhLENBQUM7QUFDM0Isb0JBQU0sR0FBRyxTQUFTLENBQUM7QUFDbkIsdUJBQVMsR0FBRyxZQUFZLENBQUM7QUFDekIsb0JBQU0sR0FBRyxTQUFTLENBQUM7QUFDbkIsdUJBQVMsR0FBRyxZQUFZLENBQUM7QUFDekIsc0JBQVEsR0FBRyxXQUFXLENBQUM7QUFFdkIsb0JBQU0sR0FBRyxTQUFTLENBQUM7QUFDbkIscUJBQU8sR0FBRyxVQUFVLENBQUM7Ozs7QUNkaEMsK0JBQTRCO0FBRTVCLE1BQWEsV0FBVzs7QUFBeEIsa0NBWUM7QUFYVSwwQkFBYyxHQUFHLFNBQUcsQ0FBQyxRQUFRLENBQUM7QUFDOUIsb0JBQVEsR0FBRyxjQUFjLENBQUM7QUFFMUIsdUJBQVcsR0FBRyxjQUFjLENBQUM7QUFDN0Isb0JBQVEsR0FBRyxXQUFXLENBQUM7QUFDdkIsdUJBQVcsR0FBRyxjQUFjLENBQUM7QUFFN0Isb0JBQVEsR0FBRyxXQUFXLENBQUM7QUFDdkIsbUJBQU8sR0FBRyxVQUFVLENBQUM7QUFFckIsbUJBQU8sR0FBRyxVQUFVLENBQUM7Ozs7QUNiaEMseUNBQXNDO0FBR3RDLElBQUksR0FBRyxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDOzs7O0FDSHpCLElBQVksZ0JBR1g7QUFIRCxXQUFZLGdCQUFnQjtJQUN4QiwrREFBUSxDQUFBO0lBQ1IsNkVBQWUsQ0FBQTtBQUNuQixDQUFDLEVBSFcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFHM0I7Ozs7QUNERCw2Q0FBMEM7QUFHMUMsd0RBQXFEO0FBRXJELE1BQWEsZ0JBQWdCO0lBNkJ6QixZQUFZLE1BQWE7UUExQnpCLFVBQUssR0FBZ0IsRUFBRSxDQUFDO1FBMkJwQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksdUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBM0JELFNBQVM7UUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJO1FBQ0EsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUM7WUFDdkIsTUFBTSxJQUFJLDJCQUFZLENBQUMsb0RBQW9ELENBQUMsQ0FBQztTQUNoRjtRQUVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsR0FBRztRQUNDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFDO1lBQ3ZCLE1BQU0sSUFBSSwyQkFBWSxDQUFDLG1EQUFtRCxDQUFDLENBQUM7U0FDL0U7UUFFRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksQ0FBQyxVQUFxQjtRQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBTUo7QUFqQ0QsNENBaUNDOzs7O0FDdkNELDZDQUEwQztBQUMxQyx5REFBc0Q7QUFFdEQsTUFBYSxhQUFhO0lBQTFCO1FBQ0ksU0FBSSxHQUFVLGVBQU0sQ0FBQyxJQUFJLENBQUM7SUFLOUIsQ0FBQztJQUhHLE1BQU0sQ0FBQyxNQUFhO1FBQ2hCLE9BQU8sbUNBQWdCLENBQUMsUUFBUSxDQUFDO0lBQ3JDLENBQUM7Q0FDSjtBQU5ELHNDQU1DOzs7O0FDVkQsaURBQThDO0FBRzlDLE1BQWEsVUFBVTtJQUluQixZQUFZLE1BQWE7UUFIekIsV0FBTSxHQUFjLEVBQUUsQ0FBQztRQUN2Qix1QkFBa0IsR0FBVSxDQUFDLENBQUMsQ0FBQztRQUczQixLQUFJLElBQUksU0FBUyxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUM7WUFDbkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUssQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzlCO0lBQ0wsQ0FBQztDQUNKO0FBVkQsZ0NBVUM7Ozs7QUNaRCxxQ0FBa0M7QUFDbEMsd0VBQXFFO0FBQ3JFLHdDQUFxQztBQUNyQyx5REFBc0Q7QUFDdEQseURBQXNEO0FBQ3RELDZDQUEwQztBQUUxQywwREFBdUQ7QUFFdkQsd0RBQXFEO0FBQ3JELG9FQUFpRTtBQUNqRSxzRUFBbUU7QUFFbkUsNENBQXlDO0FBQ3pDLGtFQUErRDtBQUMvRCx3RUFBcUU7QUFDckUsd0RBQXFEO0FBQ3JELDBFQUF1RTtBQUN2RSw0Q0FBeUM7QUFHekMsOENBQTJDO0FBRzNDLDREQUF5RDtBQUN6RCxvRUFBaUU7QUFDakUsd0RBQXFEO0FBRXJELHdFQUFxRTtBQUNyRSxvRUFBaUU7QUFDakUsd0VBQXFFO0FBQ3JFLHdFQUFxRTtBQUNyRSxrRUFBK0Q7QUFDL0Qsd0VBQXFFO0FBQ3JFLGtFQUErRDtBQUUvRCxnRUFBNkQ7QUFDN0QsNEVBQXlFO0FBQ3pFLDBGQUF1RjtBQUN2RixzRUFBbUU7QUFDbkUsNEVBQXlFO0FBQ3pFLDREQUF5RDtBQUN6RCw0RUFBeUU7QUFFekUsTUFBYSxZQUFZO0lBS3JCLFlBQTZCLFVBQWtCLEVBQW1CLFNBQXFCO1FBQTFELGVBQVUsR0FBVixVQUFVLENBQVE7UUFBbUIsY0FBUyxHQUFULFNBQVMsQ0FBWTtRQUYvRSxhQUFRLEdBQThCLElBQUksR0FBRyxFQUF5QixDQUFDO1FBRzNFLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBRTdCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSx5QkFBVyxFQUFFLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFNLENBQUMsVUFBVSxFQUFFLElBQUkscUNBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSwyQkFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBTSxDQUFDLFNBQVMsRUFBRSxJQUFJLG1DQUFnQixFQUFFLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFNLENBQUMsWUFBWSxFQUFFLElBQUkseUNBQW1CLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxhQUFhLEVBQUUsSUFBSSwyQ0FBb0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNuRixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFNLENBQUMsSUFBSSxFQUFFLElBQUkseUJBQVcsRUFBRSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLDZCQUFhLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxxQ0FBaUIsRUFBRSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLHlDQUFtQixFQUFFLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFNLENBQUMsVUFBVSxFQUFFLElBQUkscUNBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSx5Q0FBbUIsRUFBRSxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLHlDQUFtQixFQUFFLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFNLENBQUMsU0FBUyxFQUFFLElBQUksbUNBQWdCLEVBQUUsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSx5Q0FBbUIsRUFBRSxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBTSxDQUFDLFNBQVMsRUFBRSxJQUFJLG1DQUFnQixFQUFFLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFNLENBQUMsUUFBUSxFQUFFLElBQUksaUNBQWUsRUFBRSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBTSxDQUFDLGNBQWMsRUFBRSxJQUFJLDZDQUFxQixFQUFFLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFNLENBQUMscUJBQXFCLEVBQUUsSUFBSSwyREFBNEIsRUFBRSxDQUFDLENBQUM7UUFDcEYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBTSxDQUFDLFdBQVcsRUFBRSxJQUFJLHVDQUFrQixFQUFFLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFNLENBQUMsTUFBTSxFQUFFLElBQUksNkNBQXFCLEVBQUUsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSw2QkFBYSxFQUFFLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFNLENBQUMsY0FBYyxFQUFFLElBQUksNkNBQXFCLEVBQUUsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRCxLQUFLOztRQUNELElBQUksT0FBQSxJQUFJLENBQUMsTUFBTSwwQ0FBRSxRQUFRLENBQUMsTUFBTSxLQUFJLENBQUMsRUFBQztZQUNsQyxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRywwQ0FBRSxLQUFLLENBQUMsd0NBQXdDLEVBQUU7WUFDakUsT0FBTztTQUNWO1FBRUQsTUFBTSxNQUFNLFNBQUcsSUFBSSxDQUFDLE1BQU0sMENBQUUsUUFBUSxDQUNuQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxJQUFJLGFBQUssQ0FBQyxRQUFRLEVBQzVDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFnQixlQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0QsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUFrQixFQUFFLEVBQUUsV0FBQyxPQUFnQixPQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQUssQ0FBQyxhQUFhLENBQUMsMENBQUUsS0FBSyxDQUFDLENBQUEsRUFBQSxDQUFDO1FBQzlHLE1BQU0sYUFBYSxHQUFHLENBQUMsS0FBa0IsRUFBRSxFQUFFLFdBQUMsT0FBQSxPQUFBLGNBQWMsQ0FBQyxLQUFLLENBQUMsMENBQUUsS0FBSyxNQUFLLElBQUksQ0FBQSxFQUFBLENBQUM7UUFFcEYsTUFBTSxZQUFZLEdBQUcsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVqRCxJQUFJLENBQUMsTUFBTyxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFFekMsTUFBTSxNQUFNLEdBQUcsTUFBQSxJQUFJLENBQUMsTUFBTSwwQ0FBRSxVQUFVLENBQUMsR0FBRyxDQUFDLGVBQU0sQ0FBQyxRQUFRLENBQUUsQ0FBQztRQUU3RCxJQUFJLENBQUMsTUFBTyxDQUFDLGFBQWEsR0FBa0IsZUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVwRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUFJO0lBRUosQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFZOztRQUNqQixJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFDO1lBQ2xCLE1BQUEsSUFBSSxDQUFDLFNBQVMsMENBQUUsS0FBSyxDQUFDLGlEQUFpRCxFQUFFO1lBQ3pFLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsTUFBTSxXQUFXLEdBQUcsZUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1QyxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLFlBQVkseUNBQW1CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdILE1BQU0sVUFBVSxHQUFHLFVBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxTQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckUsTUFBTSxVQUFVLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxVQUFXLENBQUMsQ0FBQztRQUVyRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBRWpDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBWTtRQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFTyxPQUFPLENBQUMsT0FBYztRQUUxQiwrRkFBK0Y7O1FBRS9GLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRS9CLGlEQUFpRDtRQUVqRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTyxDQUFDLGtCQUFrQixDQUFDO1FBRXBELElBQUksQ0FBQSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsTUFBTSxLQUFJLGVBQU0sQ0FBQyxTQUFTLEVBQUM7WUFDeEMsTUFBTSxJQUFJLEdBQUcsZUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QyxNQUFBLElBQUksQ0FBQyxNQUFNLDBDQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBRXRDLE1BQUEsSUFBSSxDQUFDLE1BQU0sMENBQUUsUUFBUSxHQUFHO1NBQzNCO1FBRUQsSUFBSSxPQUFBLElBQUksQ0FBQyxNQUFNLDBDQUFFLGtCQUFrQixLQUFJLFNBQVMsRUFBQztZQUM3QyxNQUFBLElBQUksQ0FBQyxNQUFNLDBDQUFFLFFBQVEsR0FBRztTQUMzQjtRQUVELElBQUksT0FBQSxJQUFJLENBQUMsTUFBTSwwQ0FBRSxrQkFBa0IsS0FBSSxTQUFTLEVBQUM7WUFDN0MsTUFBTSxJQUFJLDJCQUFZLENBQUMsaURBQWlELENBQUMsQ0FBQztTQUM3RTtRQUVELElBQUc7WUFDQyxLQUFJLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQywwQkFBMEIsRUFBRSxFQUNuRCxXQUFXLElBQUksbUNBQWdCLENBQUMsUUFBUSxFQUN4QyxXQUFXLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEVBQUM7Z0JBRWhELE1BQUEsSUFBSSxDQUFDLE1BQU0sMENBQUUsUUFBUSxHQUFHO2FBQzNCO1NBQ0o7UUFBQyxPQUFNLEVBQUUsRUFBQztZQUNQLElBQUksRUFBRSxZQUFZLDJCQUFZLEVBQUM7Z0JBQzNCLE1BQUEsSUFBSSxDQUFDLFNBQVMsMENBQUUsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ3RELE1BQUEsSUFBSSxDQUFDLFNBQVMsMENBQUUsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7YUFDckQ7aUJBQU07Z0JBQ0gsTUFBQSxJQUFJLENBQUMsU0FBUywwQ0FBRSxLQUFLLENBQUMsZ0NBQWdDLEVBQUUsRUFBRSxFQUFFO2FBQy9EO1NBQ0o7SUFDTCxDQUFDO0lBRU8sMEJBQTBCOztRQUM5QixNQUFNLFdBQVcsU0FBRyxJQUFJLENBQUMsTUFBTSwwQ0FBRSxrQkFBa0IsQ0FBQztRQUVwRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsTUFBTyxDQUFDLENBQUM7UUFFeEQsSUFBSSxPQUFPLElBQUksU0FBUyxFQUFDO1lBQ3JCLE1BQU0sSUFBSSwyQkFBWSxDQUFDLG1DQUFtQyxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztTQUNyRjtRQUVELE9BQU8sT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTyxFQUFFO0lBQ3pDLENBQUM7Q0FDSjtBQXpJRCxvQ0F5SUM7Ozs7QUN0TEQseURBQXNEO0FBRXRELDREQUF5RDtBQUd6RCx5REFBc0Q7QUFJdEQsTUFBYSxNQUFNO0lBbUJmLFlBQVksS0FBWSxFQUFFLE1BQXVCO1FBbEJqRCxhQUFRLEdBQVUsRUFBRSxDQUFDO1FBQ3JCLGVBQVUsR0FBcUIsSUFBSSxHQUFHLEVBQWdCLENBQUM7UUFDdkQsd0JBQW1CLEdBQVUsRUFBRSxDQUFDO1FBQ2hDLGdCQUFXLEdBQWtCLEVBQUUsQ0FBQztRQUNoQyxZQUFPLEdBQXNCLEVBQUUsQ0FBQztRQWU1QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksR0FBRyxDQUFlLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksS0FBSyw2QkFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXhGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFmRCxJQUFJLGFBQWE7UUFDYixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELElBQUksa0JBQWtCOztRQUNsQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ3RDLGFBQU8sVUFBVSxDQUFDLE1BQU0sMENBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUU7SUFDN0UsQ0FBQztJQVVELGNBQWMsQ0FBQyxNQUFhOztRQUN4QixNQUFNLFVBQVUsR0FBRyxJQUFJLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFFbkMsTUFBQSxJQUFJLENBQUMsR0FBRywwQ0FBRSxLQUFLLENBQUMsR0FBRyxNQUFBLE9BQU8sQ0FBQyxNQUFNLDBDQUFFLElBQUksT0FBTyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFFN0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFRCxVQUFVLENBQUMsVUFBaUI7UUFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDO0lBQ2xFLENBQUM7SUFFRCx1QkFBdUI7O1FBQ25CLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFPLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztRQUNyRSxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRTFDLE1BQUEsSUFBSSxDQUFDLEdBQUcsMENBQUUsS0FBSyxDQUFDLEdBQUcsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sMENBQUUsSUFBSSxPQUFPLE1BQUEsY0FBYyxhQUFkLGNBQWMsdUJBQWQsY0FBYyxDQUFFLE1BQU0sMENBQUUsSUFBSSxFQUFFLEVBQUU7UUFFekYsSUFBSSxDQUFDLGdCQUFnQixFQUFDO1lBQ2xCLE9BQU8sSUFBSSwyQkFBWSxFQUFFLENBQUM7U0FDN0I7UUFFRCxNQUFNLFdBQVcsR0FBRyxjQUFjLGFBQWQsY0FBYyx1QkFBZCxjQUFjLENBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRWhELE9BQU8sV0FBWSxDQUFDO0lBQ3hCLENBQUM7Q0FDSjtBQTFERCx3QkEwREM7Ozs7QUNqRUQsK0NBQTRDO0FBQzVDLDBEQUF1RDtBQUN2RCx5REFBc0Q7QUFDdEQsa0RBQStDO0FBRS9DLHlEQUFzRDtBQUN0RCw0REFBeUQ7QUFDekQsMERBQXVEO0FBQ3ZELDhEQUEyRDtBQUMzRCwyREFBd0Q7QUFDeEQsOERBQTJEO0FBQzNELDZDQUEwQztBQUMxQyx3REFBcUQ7QUFDckQsNkNBQTBDO0FBQzFDLHdEQUFxRDtBQUNyRCxpREFBOEM7QUFDOUMsNERBQXlEO0FBQ3pELDJDQUF3QztBQUN4QyxzREFBbUQ7QUFFbkQsOERBQTJEO0FBQzNELHlEQUFzRDtBQUN0RCxvRUFBaUU7QUFDakUseURBQXNEO0FBRXRELE1BQWEsTUFBTTtJQUlmLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFXO1FBQ2pDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUM7WUFDcEMsTUFBTSxJQUFJLDJCQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUM5QztRQUVELElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7WUFDckIsTUFBTSxJQUFJLDJCQUFZLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztTQUM1RDtRQUVELE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQVk7UUFDekIsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBZSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4RSw2RUFBNkU7UUFFN0UsTUFBTSxLQUFLLEdBQUcsMkJBQVksQ0FBQyxJQUFJLENBQUM7UUFDaEMsTUFBTSxJQUFJLEdBQUcseUJBQVcsQ0FBQyxJQUFJLENBQUM7UUFDOUIsTUFBTSxNQUFNLEdBQUcsNkJBQWEsQ0FBQyxJQUFJLENBQUM7UUFDbEMsTUFBTSxVQUFVLEdBQUcscUNBQWlCLENBQUMsSUFBSSxDQUFDO1FBRTFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFcEQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsTUFBTSxDQUFDLGVBQWU7UUFDbEIsT0FBTyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFhO1FBQ2hDLE9BQU8sSUFBSSwrQkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQVk7UUFDOUIsT0FBTyxJQUFJLCtCQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBVztRQUM3QixPQUFPLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFTO1FBQ3JCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXRELFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztRQUV6QyxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRU8sTUFBTSxDQUFDLHNCQUFzQixDQUFDLEtBQVc7UUFFN0MsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JELFFBQVEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLDBCQUEwQixDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFakYsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFXO1FBQzVDLElBQUksS0FBSyxDQUFDLElBQUksRUFBQztZQUNYLE9BQU8sSUFBSSxtQkFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQy9DO1FBRUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXBELElBQUksQ0FBQyxJQUFJLEVBQUM7WUFDTixNQUFNLElBQUksMkJBQVksQ0FBQyxxQ0FBcUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7U0FDbEY7UUFFRCxPQUFPLElBQUksbUJBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTyxNQUFNLENBQUMsMEJBQTBCLENBQUMsUUFBaUIsRUFBRSxZQUE2QjtRQUV0RixRQUFPLFFBQVEsQ0FBQyxJQUFLLENBQUMsSUFBSSxFQUFDO1lBQ3ZCLEtBQUssdUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLElBQUksNkJBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFTLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0YsS0FBSyx5QkFBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sSUFBSSwrQkFBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQVUsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuRyxLQUFLLHVCQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxJQUFJLCtCQUFjLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBUyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdGLEtBQUssV0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sSUFBSSx5QkFBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBVyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0c7Z0JBQ0ksT0FBTyxJQUFJLDJCQUFZLEVBQUUsQ0FBQztTQUNqQztJQUNMLENBQUM7SUFFTyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQWM7UUFDekMsTUFBTSxZQUFZLEdBQWdCLEVBQUUsQ0FBQztRQUVyQyxLQUFJLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBQztZQUNwQixNQUFNLFFBQVEsR0FBYSxJQUFJLENBQUM7WUFDaEMsTUFBTSxLQUFLLEdBQVcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sUUFBUSxHQUFXLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVyQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUUsQ0FBQztZQUUvQyxLQUFJLElBQUksT0FBTyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFDO2dCQUM1QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQy9CO1NBQ0o7UUFFRCxPQUFPLFlBQVksQ0FBQztJQUN4QixDQUFDO0lBRU8sTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQVM7UUFFMUMsSUFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztRQUNsQyxJQUFJLGdCQUFnQixHQUFVLEVBQUUsQ0FBQztRQUVqQyxLQUFJLElBQUksT0FBTyxHQUFrQixJQUFJLEVBQ2pDLE9BQU8sRUFDUCxPQUFPLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFDO1lBRW5ELElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUM7Z0JBQzVCLE1BQU0sSUFBSSwyQkFBWSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7YUFDdkU7WUFFRCxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdEM7UUFFRCxNQUFNLDRCQUE0QixHQUFHLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVyRixJQUFJLDRCQUE0QixHQUFHLENBQUMsRUFBQztZQUNqQyxNQUFNLElBQUksMkJBQVksQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1NBQzdFO1FBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGdCQUFnQixDQUFDLDRCQUE0QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFcEcsUUFBUSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQzVDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBRTdDLCtDQUErQztRQUMvQywrREFBK0Q7UUFFL0QsaUZBQWlGO1FBRWpGLEtBQUksSUFBSSxDQUFDLEdBQUcsNEJBQTRCLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQztZQUNsRCxNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV4QyxLQUFJLE1BQU0sS0FBSyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUM7Z0JBQ2xDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEQsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzthQUM3QztZQUVELEtBQUksTUFBTSxNQUFNLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBQztnQkFDcEMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQzthQUM3QztTQUNKO1FBRUQsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVPLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxRQUFlO1FBQ25ELFFBQU8sUUFBUSxFQUFDO1lBQ1osS0FBSyxhQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxJQUFJLDJCQUFZLEVBQUUsQ0FBQztZQUMvQyxLQUFLLFdBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLElBQUkseUJBQVcsRUFBRSxDQUFDO1lBQzdDLEtBQUssZUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sSUFBSSw2QkFBYSxFQUFFLENBQUM7WUFDakQsS0FBSyxXQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxJQUFJLHlCQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDL0MsS0FBSyxTQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxJQUFJLHVCQUFVLEVBQUUsQ0FBQztZQUMzQyxLQUFLLHVCQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxJQUFJLHFDQUFpQixFQUFFLENBQUM7WUFDekQsT0FBTyxDQUFDLENBQUE7Z0JBQ0osTUFBTSxJQUFJLDJCQUFZLENBQUMsK0JBQStCLFFBQVEsR0FBRyxDQUFDLENBQUM7YUFDdEU7U0FDSjtJQUNMLENBQUM7O0FBbExMLHdCQW1MQztBQWxMa0Isa0JBQVcsR0FBRyxJQUFJLEdBQUcsRUFBZ0IsQ0FBQztBQUN0QyxXQUFJLEdBQUcsSUFBSSxHQUFHLEVBQXdCLENBQUM7Ozs7QUM3QjFELE1BQWEsWUFBYSxTQUFRLEtBQUs7SUFFbkMsWUFBWSxPQUFjO1FBQ3RCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQixDQUFDO0NBQ0o7QUFMRCxvQ0FLQzs7OztBQ0xELG9EQUFpRDtBQUVqRCw0REFBeUQ7QUFDekQseURBQXNEO0FBQ3RELDhEQUEyRDtBQUUzRCxNQUFhLHFCQUFzQixTQUFRLDZCQUFhO0lBQ3BELE1BQU0sQ0FBQyxNQUFhOztRQUNoQixNQUFBLE1BQU0sQ0FBQyxHQUFHLDBDQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUU7UUFFN0IsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM1QyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXpDLElBQUksUUFBUSxZQUFZLDZCQUFhLEVBQUM7WUFDbEMsUUFBUSxDQUFDLEtBQUssR0FBbUIsS0FBTSxDQUFDLEtBQUssQ0FBQztTQUNqRDthQUFNLElBQUksUUFBUSxZQUFZLCtCQUFjLEVBQUM7WUFDMUMsUUFBUSxDQUFDLEtBQUssR0FBb0IsS0FBTSxDQUFDLEtBQUssQ0FBQztTQUNsRDthQUFNO1lBQ0gsTUFBTSxJQUFJLDJCQUFZLENBQUMsMkNBQTJDLENBQUMsQ0FBQztTQUN2RTtRQUVELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0o7QUFqQkQsc0RBaUJDOzs7O0FDdkJELG9EQUFpRDtBQUdqRCxNQUFhLHFCQUFzQixTQUFRLDZCQUFhO0lBQ3BELE1BQU0sQ0FBQyxNQUFhOztRQUNoQixNQUFNLGNBQWMsR0FBRyxNQUFRLE1BQU0sQ0FBQyxrQkFBa0IsMENBQUUsS0FBSyxDQUFDO1FBRWhFLE1BQUEsTUFBTSxDQUFDLEdBQUcsMENBQUUsS0FBSyxDQUFDLFVBQVUsY0FBYyxFQUFFLEVBQUU7UUFFOUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsR0FBRyxjQUFjLENBQUMsQ0FBQztRQUV2RixPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNKO0FBVkQsc0RBVUM7Ozs7QUNiRCxvREFBaUQ7QUFJakQsTUFBYSw0QkFBNkIsU0FBUSw2QkFBYTtJQUMzRCxNQUFNLENBQUMsTUFBYTs7UUFDaEIsTUFBTSxjQUFjLEdBQUcsTUFBUSxNQUFNLENBQUMsa0JBQWtCLDBDQUFFLEtBQUssQ0FBQztRQUNoRSxNQUFNLEtBQUssR0FBbUIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUV6RCxNQUFBLE1BQU0sQ0FBQyxHQUFHLDBDQUFFLEtBQUssQ0FBQyxnQkFBZ0IsY0FBYyxPQUFPLEtBQUssRUFBRSxFQUFDO1FBRS9ELElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDO1lBQ2IsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsR0FBRyxjQUFjLENBQUMsQ0FBQztTQUMxRjtRQUVELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0o7QUFiRCxvRUFhQzs7OztBQ2pCRCxvREFBaUQ7QUFHakQsNkNBQTBDO0FBRTFDLE1BQWEsa0JBQW1CLFNBQVEsNkJBQWE7SUFDakQsTUFBTSxDQUFDLE1BQWE7O1FBQ2hCLE1BQU0sSUFBSSxHQUFrQixNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3ZELE1BQU0sS0FBSyxHQUFrQixNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXhELE1BQUEsTUFBTSxDQUFDLEdBQUcsMENBQUUsS0FBSyxDQUFDLFlBQVksS0FBSyxDQUFDLEtBQUssTUFBTSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUU7UUFFOUQsTUFBTSxZQUFZLEdBQUcsZUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0UsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFeEMsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDSjtBQWJELGdEQWFDOzs7O0FDbEJELG9EQUFpRDtBQVFqRCxNQUFhLG1CQUFvQixTQUFRLDZCQUFhO0lBRWxELE1BQU0sQ0FBQyxNQUFhOztRQUVoQixNQUFNLFVBQVUsR0FBVyxNQUFBLE1BQU0sQ0FBQyxrQkFBa0IsMENBQUUsS0FBTSxDQUFDO1FBRTdELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFNUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFTLEVBQVUsVUFBVSxDQUFDLENBQUM7UUFFbEUsTUFBQSxNQUFNLENBQUMsR0FBRywwQ0FBRSxLQUFLLENBQUMsaUJBQWlCLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxRQUFRLEtBQUssVUFBVSxPQUFPLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBRTtRQUU3RixNQUFNLElBQUksR0FBZ0IsRUFBRSxDQUFDO1FBRTdCLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO1lBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUcsQ0FBQyxDQUFDO1NBQzFDO1FBRUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUU5QyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVsQyxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVPLGNBQWMsQ0FBQyxRQUFlLEVBQUUsVUFBaUI7UUFDckQsT0FBb0IsUUFBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDSjtBQTVCRCxrREE0QkM7Ozs7QUNwQ0Qsb0RBQWlEO0FBR2pELHlEQUFzRDtBQUV0RCxNQUFhLFdBQVksU0FBUSw2QkFBYTtJQUMxQyxNQUFNLENBQUMsTUFBYTs7UUFFaEIsTUFBTSxpQkFBaUIsU0FBRyxNQUFNLENBQUMsa0JBQWtCLDBDQUFFLEtBQUssQ0FBQztRQUUzRCxJQUFJLE9BQU8saUJBQWlCLEtBQUssUUFBUSxFQUFDO1lBQ3RDLHlFQUF5RTtZQUN6RSxnRkFBZ0Y7WUFDaEYsTUFBQSxNQUFNLENBQUMsR0FBRywwQ0FBRSxLQUFLLENBQUMsT0FBTyxpQkFBaUIsRUFBRSxFQUFDO1lBRTdDLE1BQU0sQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDNUM7YUFBSztZQUNGLE1BQU0sSUFBSSwyQkFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDNUM7UUFFRCxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNKO0FBakJELGtDQWlCQzs7OztBQ3RCRCxvREFBaUQ7QUFFakQsOERBQTJEO0FBQzNELHlEQUFzRDtBQUN0RCwrREFBNEQ7QUFFNUQsZ0RBQTZDO0FBQzdDLHNFQUFtRTtBQUNuRSwyREFBd0Q7QUFHeEQsNkNBQTBDO0FBRzFDLDRDQUF5QztBQUV6QyxpREFBOEM7QUFLOUMsc0RBQW1EO0FBQ25ELGdFQUE2RDtBQUM3RCxrREFBK0M7QUFDL0Msd0RBQXFEO0FBRXJELE1BQWEsb0JBQXFCLFNBQVEsNkJBQWE7SUFDbkQsWUFBNkIsTUFBYztRQUN2QyxLQUFLLEVBQUUsQ0FBQztRQURpQixXQUFNLEdBQU4sTUFBTSxDQUFRO0lBRTNDLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBYTs7UUFFaEIsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUUzQyxJQUFJLENBQUMsQ0FBQyxPQUFPLFlBQVksK0JBQWMsQ0FBQyxFQUFDO1lBQ3JDLE1BQU0sSUFBSSwyQkFBWSxDQUFDLDBDQUEwQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQy9FO1FBRUQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU8sQ0FBQyxLQUFLLENBQUM7UUFDckMsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVcsQ0FBQyxLQUFLLENBQUM7UUFFN0MsTUFBQSxNQUFNLENBQUMsR0FBRywwQ0FBRSxLQUFLLENBQUMsZ0JBQWdCLE1BQU0sSUFBSSxVQUFVLEdBQUcsRUFBRTtRQUUzRCxNQUFNLHNCQUFzQixHQUFHLElBQUksR0FBRyxDQUFlLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBQyxPQUFBLENBQUMsTUFBQSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksNkJBQWEsQ0FBQyxNQUFNLENBQUMsMENBQUUsWUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFBLEVBQUEsQ0FBQyxDQUFDLENBQUM7UUFFMUssTUFBTSxhQUFhLEdBQUcsc0JBQXNCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXpELElBQUksQ0FBQyxhQUFhLEVBQUM7WUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1lBQ2xELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMvQjtRQUVELE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSw2QkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXJGLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBUyxZQUFZLGFBQVosWUFBWSx1QkFBWixZQUFZLENBQUUsWUFBYSxDQUFDLENBQUM7UUFDOUUsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFM0UsSUFBSSxDQUFDLGdCQUFnQixFQUFDO1lBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7WUFDNUQsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO1FBRUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUV2RCxJQUFJLENBQUMsTUFBTSxFQUFDO1lBQ1IsTUFBTSxJQUFJLDJCQUFZLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUNuRDtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXBFLElBQUksQ0FBQyxDQUFDLFFBQVEsWUFBWSx1Q0FBa0IsQ0FBQyxFQUFDO1lBQzFDLE1BQU0sSUFBSSwyQkFBWSxDQUFDLDZCQUE2QixDQUFDLENBQUM7U0FDekQ7UUFFRCxRQUFPLE9BQU8sRUFBQztZQUNYLEtBQUssaUJBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtnQkFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN2QyxNQUFNO2FBQ1Q7WUFDRCxLQUFLLGlCQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sU0FBUyxHQUFpQixRQUFRLENBQUM7Z0JBQ3pDLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7Z0JBRXpDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO2dCQUVoQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxxQkFBUyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ2hFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLFlBQWEsRUFBRSxxQkFBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ25FLE1BQU07YUFDVDtZQUNELEtBQUssaUJBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDakIsSUFBSSxDQUFDLENBQUMsUUFBUSxZQUFZLHlCQUFXLENBQUMsRUFBQztvQkFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztvQkFDeEMsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUMvQjtnQkFFRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsWUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3JELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFL0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLGFBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUMzRCxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFFL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLFlBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDbkQsTUFBTTthQUNUO1lBQ0QsS0FBSyxpQkFBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO2dCQUNuQixNQUFNLFNBQVMsR0FBbUIsUUFBUyxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQy9ELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ3pDLE1BQU07YUFDVDtZQUNELEtBQUssaUJBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtnQkFDbEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLGFBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN0RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRS9ELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxZQUFhLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDekQsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRTlCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxZQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ25ELE1BQU07YUFDVDtZQUNEO2dCQUNJLE1BQU0sSUFBSSwyQkFBWSxDQUFDLDJCQUEyQixDQUFDLENBQUM7U0FDM0Q7UUFFRCxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVPLFVBQVUsQ0FBQyxNQUFhLEVBQUUsUUFBcUIsRUFBRSxJQUFjO1FBQ25FLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUM7UUFFdkYsS0FBSSxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUM7WUFDdEIsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLElBQUksbUJBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxXQUFJLENBQUMsUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLFFBQVMsRUFBRSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsY0FBZSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUV0SCxNQUFNLFFBQVEsR0FBRyxJQUFJLGlDQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFN0MsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDdkM7SUFDTCxDQUFDO0lBRU8sb0JBQW9CLENBQUMsTUFBYSxFQUFFLE1BQVcsRUFBRSxPQUFlOztRQUNwRSxJQUFJLE9BQU8sS0FBSyxpQkFBTyxDQUFDLE1BQU0sRUFBQztZQUMzQixNQUFNLElBQUksR0FBRyxNQUFhLE1BQU0sQ0FBQyxZQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBVyxDQUFDLFFBQVEsQ0FBQywwQ0FBRSxLQUFLLENBQUM7WUFDdkYsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV6RSxJQUFJLGFBQWEsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFDO2dCQUMxQixPQUFPLFNBQVMsQ0FBQzthQUNwQjtZQUVELE9BQU8sYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNCO2FBQU0sSUFBSSxPQUFPLEtBQUssaUJBQU8sQ0FBQyxRQUFRLEVBQUM7WUFDcEMsTUFBTSxJQUFJLEdBQUcsTUFBYSxNQUFNLENBQUMsYUFBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQVcsQ0FBQyxRQUFRLENBQUMsMENBQUUsS0FBSyxDQUFDO1lBQ3hGLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFekUsSUFBSSxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBQztnQkFDMUIsT0FBTyxTQUFTLENBQUM7YUFDcEI7WUFFRCxPQUFPLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzQjthQUFNO1lBQ0gsT0FBTyxlQUFNLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pEO0lBQ0wsQ0FBQztJQUVPLGVBQWUsQ0FBQyxNQUFhLEVBQUUsVUFBaUIsRUFBRSxPQUFlOztRQUNyRSxJQUFJLE9BQU8sS0FBSyxpQkFBTyxDQUFDLE1BQU0sRUFBQztZQUMzQixNQUFNLFNBQVMsR0FBRyxZQUFlLE1BQU0sQ0FBQyxZQUFZLDBDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLEVBQUUsMkNBQUcsS0FBSyxDQUFDO1lBRTFGLElBQUksQ0FBQyxTQUFTLEVBQUM7Z0JBQ1gsT0FBTyxTQUFTLENBQUM7YUFDcEI7WUFFRCxPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUM7U0FDMUI7UUFFRCxJQUFJLE9BQU8sS0FBSyxpQkFBTyxDQUFDLFNBQVMsRUFBQztZQUM5QixPQUFPLGVBQU0sQ0FBQyxRQUFRLENBQUM7U0FDMUI7UUFFRCxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBRU8sUUFBUSxDQUFDLE1BQWEsRUFBRSxNQUF5QixFQUFFLG9CQUE0QjtRQUVuRixJQUFJLENBQUMsb0JBQW9CLEVBQUM7WUFDdEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyx5QkFBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTdELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDM0M7UUFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBVyxDQUFDLFFBQVEsQ0FBRSxDQUFDO1FBRTNELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxtQkFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLFdBQUksQ0FBQyxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsUUFBUyxFQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxjQUFlLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRXZILE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksaUNBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTyxPQUFPLENBQUMsTUFBYSxFQUFFLE1BQXlCO1FBQ3BELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUFXLENBQUMsT0FBTyxDQUFFLENBQUM7UUFFekQsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLG1CQUFRLENBQUMsT0FBTyxFQUFFLElBQUksV0FBSSxDQUFDLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxRQUFTLEVBQUUsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLGNBQWUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFdEgsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxpQ0FBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVPLGdCQUFnQixDQUFDLE1BQWEsRUFBRSxNQUFrQjtRQUN0RCxLQUFJLE1BQU0sSUFBSSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUM7WUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQXNCLElBQUksQ0FBQyxDQUFDO1NBQ2xEO0lBQ0wsQ0FBQztJQUVPLG1CQUFtQixDQUFDLE1BQWE7UUFDckMsTUFBTSxZQUFZLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUVsQyx1Q0FBdUM7UUFFdkMsUUFBTyxZQUFZLEVBQUM7WUFDaEIsS0FBSyw2QkFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8saUJBQU8sQ0FBQyxVQUFVLENBQUM7WUFDekQsS0FBSyw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8saUJBQU8sQ0FBQyxNQUFNLENBQUM7WUFDakQsS0FBSyw2QkFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8saUJBQU8sQ0FBQyxTQUFTLENBQUM7WUFDdkQsS0FBSyw2QkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8saUJBQU8sQ0FBQyxNQUFNLENBQUM7WUFDakQsS0FBSyw2QkFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8saUJBQU8sQ0FBQyxTQUFTLENBQUM7WUFDdkQsS0FBSyw2QkFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8saUJBQU8sQ0FBQyxRQUFRLENBQUM7WUFDckQ7Z0JBQ0ksT0FBTyxpQkFBTyxDQUFDLE1BQU0sQ0FBQztTQUM3QjtJQUNMLENBQUM7Q0FDSjtBQTFNRCxvREEwTUM7Ozs7QUNwT0Qsb0RBQWlEO0FBS2pELGtEQUErQztBQUcvQyw0Q0FBeUM7QUFFekMsTUFBYSxtQkFBb0IsU0FBUSw2QkFBYTtJQUNsRCxZQUFvQixVQUFrQjtRQUNsQyxLQUFLLEVBQUUsQ0FBQztRQURRLGVBQVUsR0FBVixVQUFVLENBQVE7SUFFdEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFhOztRQUVoQixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO1FBRXJDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFDO1lBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQVcsTUFBQSxNQUFNLENBQUMsa0JBQWtCLDBDQUFFLEtBQU0sQ0FBQztTQUMvRDtRQUVELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUUvQixNQUFNLE1BQU0sR0FBRyxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFFLENBQUM7UUFFdkQsTUFBQSxNQUFNLENBQUMsR0FBRywwQ0FBRSxLQUFLLENBQUMsZUFBZSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsUUFBUSxLQUFLLElBQUksQ0FBQyxVQUFVLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsRUFBRTtRQUUzRyxNQUFNLGVBQWUsR0FBYyxFQUFFLENBQUM7UUFFdEMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO1lBQzlDLE1BQU0sU0FBUyxHQUFHLE1BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRyxDQUFDO1lBQ2hDLE1BQU0sUUFBUSxHQUFHLElBQUksbUJBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFekUsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNsQztRQUVELGdGQUFnRjtRQUVoRixlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksbUJBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxXQUFJLENBQUMsUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLFFBQVMsRUFBRSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsY0FBZSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUVuSCxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsZUFBZSxDQUFDO1FBRTFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFOUIsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDSjtBQXZDRCxrREF1Q0M7Ozs7QUNqREQsb0RBQWlEO0FBRWpELGdFQUE2RDtBQUM3RCx5REFBc0Q7QUFFdEQsTUFBYSxxQkFBc0IsU0FBUSw2QkFBYTtJQUNwRCxNQUFNLENBQUMsTUFBYTs7UUFFaEIsTUFBQSxNQUFNLENBQUMsR0FBRywwQ0FBRSxLQUFLLENBQUMsZ0JBQWdCLEVBQUU7UUFFcEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUcsQ0FBQztRQUU3QyxJQUFJLFFBQVEsWUFBWSxpQ0FBZSxFQUFDO1lBQ3BDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3BFO2FBQU07WUFDSCxNQUFNLElBQUksMkJBQVksQ0FBQyx3REFBd0QsUUFBUSxHQUFHLENBQUMsQ0FBQztTQUMvRjtRQUVELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0o7QUFmRCxzREFlQzs7OztBQ3BCRCxvREFBaUQ7QUFHakQsTUFBYSxnQkFBaUIsU0FBUSw2QkFBYTtJQUMvQyxNQUFNLENBQUMsTUFBYTs7UUFDaEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM1QyxNQUFNLFNBQVMsR0FBVyxNQUFBLE1BQU0sQ0FBQyxrQkFBa0IsMENBQUUsS0FBTSxDQUFDO1FBRTVELE1BQU0sS0FBSyxHQUFHLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTlDLE1BQU0sS0FBSyxHQUFHLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxLQUFLLENBQUM7UUFFM0IsTUFBQSxNQUFNLENBQUMsR0FBRywwQ0FBRSxLQUFLLENBQUMsZ0JBQWdCLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxRQUFRLEtBQUssU0FBUyxPQUFPLEtBQUssRUFBRSxFQUFFO1FBRWxGLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQU0sQ0FBQyxDQUFDO1FBRWxDLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0o7QUFmRCw0Q0FlQzs7OztBQ2xCRCxvREFBaUQ7QUFFakQseURBQXNEO0FBRXRELE1BQWEsbUJBQW9CLFNBQVEsNkJBQWE7SUFDbEQsTUFBTSxDQUFDLE1BQWE7O1FBRWhCLE1BQU0sUUFBUSxHQUFHLE1BQUEsTUFBTSxDQUFDLGtCQUFrQiwwQ0FBRSxLQUFNLENBQUM7UUFFbkQsSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFDO1lBQ25CLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFhLENBQUM7WUFDckMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFbkMsTUFBQSxNQUFNLENBQUMsR0FBRywwQ0FBRSxLQUFLLENBQUMsZ0JBQWdCLEVBQUU7U0FDdkM7YUFBTTtZQUNILE1BQU0sSUFBSSwyQkFBWSxDQUFDLGlEQUFpRCxRQUFRLEdBQUcsQ0FBQyxDQUFDO1NBQ3hGO1FBRUQsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDSjtBQWhCRCxrREFnQkM7Ozs7QUNwQkQsb0RBQWlEO0FBR2pELE1BQWEsZ0JBQWlCLFNBQVEsNkJBQWE7SUFDL0MsTUFBTSxDQUFDLE1BQWE7O1FBRWhCLE1BQU0sU0FBUyxHQUFHLE1BQUEsTUFBTSxDQUFDLGtCQUFrQiwwQ0FBRSxLQUFNLENBQUM7UUFFcEQsTUFBTSxTQUFTLFNBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLDBDQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDLENBQUM7UUFFL0YsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxhQUFULFNBQVMsdUJBQVQsU0FBUyxDQUFFLEtBQU0sQ0FBQyxDQUFDO1FBRTdDLE1BQUEsTUFBTSxDQUFDLEdBQUcsMENBQUUsS0FBSyxDQUFDLGdCQUFnQixTQUFTLElBQUksU0FBUyxhQUFULFNBQVMsdUJBQVQsU0FBUyxDQUFFLEtBQUssRUFBRSxFQUFFO1FBRW5FLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0o7QUFiRCw0Q0FhQzs7OztBQ2hCRCxvREFBaUQ7QUFFakQsNkNBQTBDO0FBRTFDLE1BQWEsaUJBQWtCLFNBQVEsNkJBQWE7SUFDaEQsTUFBTSxDQUFDLE1BQWE7O1FBRWhCLE1BQU0sS0FBSyxHQUFXLE1BQUEsTUFBTSxDQUFDLGtCQUFrQiwwQ0FBRSxLQUFNLENBQUM7UUFDeEQsTUFBTSxZQUFZLEdBQUcsZUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsRCxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV4QyxNQUFBLE1BQU0sQ0FBQyxHQUFHLDBDQUFFLEtBQUssQ0FBQyxrQkFBa0IsS0FBSyxFQUFFLEVBQUU7UUFFN0MsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDSjtBQVpELDhDQVlDOzs7O0FDaEJELG9EQUFpRDtBQUlqRCwrREFBNEQ7QUFDNUQsdURBQW9EO0FBQ3BELDBEQUF1RDtBQUV2RCxNQUFhLG1CQUFvQixTQUFRLDZCQUFhO0lBQ2xELFlBQW9CLFNBQWlCO1FBQ2pDLEtBQUssRUFBRSxDQUFDO1FBRFEsY0FBUyxHQUFULFNBQVMsQ0FBUTtJQUVyQyxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQWE7O1FBRWhCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUM7WUFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBVyxNQUFBLE1BQU0sQ0FBQyxrQkFBa0IsMENBQUUsS0FBTSxDQUFDO1NBQzlEO1FBRUQsSUFBRztZQUNDLE1BQU0sS0FBSyxHQUFHLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUVuRCxNQUFNLEtBQUssR0FBRyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBTSxDQUFDO1lBRTVCLE1BQU0sUUFBUSxHQUFHLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFFakUsTUFBQSxNQUFNLENBQUMsR0FBRywwQ0FBRSxLQUFLLENBQUMsZUFBZSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsUUFBUSxLQUFLLElBQUksQ0FBQyxTQUFTLFNBQVMsUUFBUSxJQUFJLFNBQVMsUUFBUSxLQUFLLEVBQUUsRUFBRTtZQUVySCxJQUFJLFFBQVEsRUFBQztnQkFDVCxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFakMsTUFBTSxRQUFRLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7Z0JBQ3ZDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRXZDLElBQUksTUFBTSxJQUFJLG1DQUFnQixDQUFDLFFBQVEsRUFBQztvQkFDcEMsT0FBTyxNQUFNLENBQUM7aUJBQ2pCO2dCQUVELE1BQU0sT0FBTyxHQUFHLElBQUkseUNBQW1CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2RCxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUV2Qiw4RUFBOEU7Z0JBRTlFLGtDQUFrQzthQUNyQztpQkFBTTtnQkFDSCxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNwQztZQUVELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMvQjtnQkFBUTtZQUNMLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1NBQzlCO0lBQ0wsQ0FBQztDQUNKO0FBL0NELGtEQStDQzs7OztBQ3ZERCxvREFBaUQ7QUFFakQsNERBQXlEO0FBQ3pELHlEQUFzRDtBQUV0RCxNQUFhLGlCQUFrQixTQUFRLDZCQUFhO0lBQ2hELE1BQU0sQ0FBQyxNQUFhOztRQUNoQixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsa0JBQW1CLENBQUMsS0FBSyxDQUFDO1FBRS9DLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFDO1lBQzFCLE1BQU0sV0FBVyxHQUFHLElBQUksNkJBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUV2QyxNQUFBLE1BQU0sQ0FBQyxHQUFHLDBDQUFFLEtBQUssQ0FBQyxtQkFBbUIsS0FBSyxHQUFHLEVBQUU7U0FDbEQ7YUFBTTtZQUNILE1BQU0sSUFBSSwyQkFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDL0M7UUFFRCxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNKO0FBZkQsOENBZUM7Ozs7QUNwQkQsb0RBQWdEO0FBR2hELE1BQWEsZUFBZ0IsU0FBUSw2QkFBYTtJQUM5QyxNQUFNLENBQUMsTUFBYTs7UUFDaEIsTUFBTSxRQUFRLEdBQUcsTUFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sMENBQUUsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLEtBQU0sQ0FBQztRQUV6RSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVwQyxNQUFBLE1BQU0sQ0FBQyxHQUFHLDBDQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUU7UUFFOUIsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDSjtBQVZELDBDQVVDOzs7O0FDYkQsb0RBQWlEO0FBRWpELHlEQUFzRDtBQUN0RCw2Q0FBMEM7QUFFMUMsTUFBYSxrQkFBbUIsU0FBUSw2QkFBYTtJQUNqRCxNQUFNLENBQUMsTUFBYTs7UUFDaEIsTUFBTSxRQUFRLFNBQUcsTUFBTSxDQUFDLGtCQUFrQiwwQ0FBRSxLQUFLLENBQUM7UUFFbEQsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUM7WUFDN0IsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFN0MsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFDO2dCQUNiLE1BQU0sSUFBSSwyQkFBWSxDQUFDLHVCQUF1QixDQUFDLENBQUM7YUFDbkQ7WUFFRCxNQUFNLFFBQVEsR0FBRyxlQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXZDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3ZDO1FBRUQsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDSjtBQWxCRCxnREFrQkM7Ozs7QUN2QkQsb0RBQWlEO0FBRWpELDBEQUF1RDtBQUV2RCxNQUFhLFdBQVksU0FBUSw2QkFBYTtJQUMxQyxNQUFNLENBQUMsTUFBYTtRQUNoQixPQUFPLG1DQUFnQixDQUFDLFFBQVEsQ0FBQztJQUNyQyxDQUFDO0NBQ0o7QUFKRCxrQ0FJQzs7OztBQ1JELG9EQUFpRDtBQUVqRCw0REFBeUQ7QUFDekQseURBQXNEO0FBRXRELDZDQUEwQztBQUUxQyxNQUFhLG1CQUFvQixTQUFRLDZCQUFhO0lBQ2xELE1BQU0sQ0FBQyxNQUFhOztRQUNoQixNQUFBLE1BQU0sQ0FBQyxHQUFHLDBDQUFFLEtBQUssQ0FBQyxtQkFBbUIsRUFBRTtRQUV2QyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXhDLElBQUksSUFBSSxZQUFZLDZCQUFhLEVBQUM7WUFDOUIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUMvQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRS9DLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3RDO2FBQU07WUFDSCxNQUFNLElBQUksMkJBQVksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQ3JEO1FBRUQsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTyxZQUFZLENBQUMsSUFBVztRQUM1QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLE1BQU0sT0FBTyxHQUFHLGVBQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUV6QyxPQUFPLENBQUMsTUFBTSxHQUFHLGVBQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsT0FBTyxDQUFDLFVBQVUsR0FBRyxlQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7Q0FDSjtBQTNCRCxrREEyQkM7Ozs7QUNoQ0QsNERBQXlEO0FBQ3pELHlEQUFzRDtBQUV0RCxvREFBaUQ7QUFFakQsTUFBYSxZQUFhLFNBQVEsNkJBQWE7SUFHM0MsWUFBWSxNQUFjO1FBQ3RCLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFhOztRQUNoQixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXhDLElBQUksSUFBSSxZQUFZLDZCQUFhLEVBQUM7WUFDOUIsTUFBQSxNQUFNLENBQUMsR0FBRywwQ0FBRSxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNqQzthQUFNO1lBQ0gsTUFBTSxJQUFJLDJCQUFZLENBQUMsb0VBQW9FLENBQUMsQ0FBQztTQUNoRztRQUVELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0o7QUFwQkQsb0NBb0JDOzs7O0FDM0JELG9EQUFpRDtBQUVqRCwwREFBdUQ7QUFFdkQsTUFBYSxnQkFBaUIsU0FBUSw2QkFBYTtJQUMvQyxNQUFNLENBQUMsTUFBYTs7UUFDaEIsTUFBQSxNQUFNLENBQUMsR0FBRywwQ0FBRSxLQUFLLENBQUMsVUFBVSxFQUFFO1FBRTlCLE9BQU8sbUNBQWdCLENBQUMsZUFBZSxDQUFDO0lBQzVDLENBQUM7Q0FDSjtBQU5ELDRDQU1DOzs7O0FDVkQsb0RBQWlEO0FBRWpELDBEQUF1RDtBQUN2RCwwREFBdUQ7QUFDdkQseURBQXNEO0FBRXRELE1BQWEsYUFBYyxTQUFRLDZCQUFhO0lBQzVDLE1BQU0sQ0FBQyxNQUFhO1FBQ2hCLDRFQUE0RTs7UUFFNUUsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztRQUNyQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDakMsTUFBTSxhQUFhLEdBQUcsT0FBQSxPQUFPLENBQUMsTUFBTSwwQ0FBRSxVQUFVLEtBQUksRUFBRSxDQUFDO1FBRXZELElBQUksYUFBYSxFQUFDO1lBQ2QsSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFDO2dCQUNWLE1BQU0sSUFBSSwyQkFBWSxDQUFDLHNFQUFzRSxDQUFDLENBQUM7YUFDbEc7aUJBQU0sSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFDO2dCQUNoQixNQUFNLElBQUksMkJBQVksQ0FBQyxvQ0FBb0MsTUFBQSxPQUFPLENBQUMsTUFBTSwwQ0FBRSxJQUFJLFlBQVksSUFBSSxvQ0FBb0MsQ0FBQyxDQUFDO2FBQ3hJO1NBQ0o7YUFBTTtZQUNILElBQUksSUFBSSxHQUFHLENBQUMsRUFBQztnQkFDVCxNQUFNLElBQUksMkJBQVksQ0FBQyxvQ0FBb0MsTUFBQSxPQUFPLENBQUMsTUFBTSwwQ0FBRSxJQUFJLFlBQVksSUFBSSxxQ0FBcUMsQ0FBQyxDQUFDO2FBQ3pJO1NBQ0o7UUFFRCxNQUFNLFdBQVcsR0FBRyxNQUFPLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUV0RCxJQUFJLENBQUMsQ0FBQyxXQUFXLFlBQVksMkJBQVksQ0FBQyxFQUFDO1lBQ3ZDLE1BQUEsTUFBTSxDQUFDLEdBQUcsMENBQUUsS0FBSyxDQUFDLFdBQVcsV0FBVyxFQUFFLEVBQUU7WUFDNUMsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1NBQzNDO2FBQU07WUFDSCxNQUFBLE1BQU0sQ0FBQyxHQUFHLDBDQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUU7U0FDbEM7UUFFRCxPQUFPLG1DQUFnQixDQUFDLFFBQVEsQ0FBQztJQUNyQyxDQUFDO0NBQ0o7QUEvQkQsc0NBK0JDOzs7O0FDckNELG9EQUFpRDtBQUlqRCxNQUFhLGlCQUFrQixTQUFRLDZCQUFhO0lBQ2hELE1BQU0sQ0FBQyxNQUFhOztRQUNoQixNQUFNLFFBQVEsR0FBVyxNQUFBLE1BQU0sQ0FBQyxrQkFBa0IsMENBQUUsS0FBTSxDQUFDO1FBRTNELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbkMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3QixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUUsQ0FBQztRQUM5QyxNQUFNLE1BQU0sR0FBRyxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFFLENBQUM7UUFFL0QsTUFBQSxNQUFNLENBQUMsR0FBRywwQ0FBRSxLQUFLLENBQUMsaUJBQWlCLFFBQVEsS0FBSyxVQUFVLElBQUksRUFBRTtRQUVoRSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlCLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0o7QUFsQkQsOENBa0JDOzs7O0FDdEJELG9EQUFpRDtBQUVqRCw2Q0FBMEM7QUFFMUMsTUFBYSxhQUFjLFNBQVEsNkJBQWE7SUFDNUMsTUFBTSxDQUFDLE1BQWE7O1FBQ2hCLE1BQU0sUUFBUSxHQUFXLE1BQUEsTUFBTSxDQUFDLGtCQUFrQiwwQ0FBRSxLQUFNLENBQUM7UUFFM0QsTUFBQSxNQUFNLENBQUMsR0FBRywwQ0FBRSxLQUFLLENBQUMsV0FBVyxRQUFRLEVBQUUsRUFBRTtRQUV6QyxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxFQUFDO1lBQ3RDLE1BQU0sS0FBSyxHQUFHLGVBQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEM7YUFBTTtZQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFN0MsTUFBTSxNQUFNLEdBQUcsQ0FBQSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsUUFBUSxLQUFJLFFBQVEsQ0FBQztZQUM5QyxNQUFNLE1BQU0sR0FBRyxlQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTlDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3JDO1FBRUQsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDSjtBQXBCRCxzQ0FvQkM7Ozs7QUN4QkQsSUFBWSxPQVNYO0FBVEQsV0FBWSxPQUFPO0lBQ2YsaURBQVUsQ0FBQTtJQUNWLHlDQUFNLENBQUE7SUFDTix5Q0FBTSxDQUFBO0lBQ04sK0NBQVMsQ0FBQTtJQUNULCtDQUFTLENBQUE7SUFDVCw2Q0FBUSxDQUFBO0lBQ1IsNkNBQVEsQ0FBQTtJQUNSLHlDQUFNLENBQUE7QUFDVixDQUFDLEVBVFcsT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBU2xCOzs7O0FDVEQsMkNBQXdDO0FBSXhDLE1BQWEsVUFBVTtJQUF2QjtRQUNJLG1CQUFjLEdBQVUsRUFBRSxDQUFDO1FBQzNCLGFBQVEsR0FBVSxTQUFHLENBQUMsUUFBUSxDQUFDO1FBRS9CLFdBQU0sR0FBeUIsSUFBSSxHQUFHLEVBQW9CLENBQUM7UUFDM0QsWUFBTyxHQUF1QixJQUFJLEdBQUcsRUFBa0IsQ0FBQztJQUs1RCxDQUFDO0lBSEcsUUFBUTtRQUNKLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0NBQ0o7QUFWRCxnQ0FVQzs7OztBQ2RELDZDQUEwQztBQUUxQyxNQUFhLGNBQWUsU0FBUSx1QkFBVTtJQUMxQyxZQUFtQixLQUFhO1FBQzVCLEtBQUssRUFBRSxDQUFDO1FBRE8sVUFBSyxHQUFMLEtBQUssQ0FBUTtJQUVoQyxDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0NBQ0o7QUFSRCx3Q0FRQzs7OztBQ1ZELDZDQUEwQztBQUcxQyxNQUFhLGNBQWUsU0FBUSx1QkFBVTtJQUMxQyxZQUFtQixVQUF5QixFQUFTLE1BQXFCO1FBQ3RFLEtBQUssRUFBRSxDQUFDO1FBRE8sZUFBVSxHQUFWLFVBQVUsQ0FBZTtRQUFTLFdBQU0sR0FBTixNQUFNLENBQWU7SUFFMUUsQ0FBQztDQUNKO0FBSkQsd0NBSUM7Ozs7QUNQRCw2REFBMEQ7QUFDMUQseURBQXNEO0FBRXRELE1BQWEsaUJBQWtCLFNBQVEsdUNBQWtCO0lBQXpEOztRQUNJLG1CQUFjLEdBQUcsdUJBQVUsQ0FBQyxjQUFjLENBQUM7UUFDM0MsYUFBUSxHQUFHLHVCQUFVLENBQUMsUUFBUSxDQUFDO0lBQ25DLENBQUM7Q0FBQTtBQUhELDhDQUdDOzs7O0FDTkQsNkNBQTBDO0FBQzFDLDJDQUF3QztBQUN4QyxxREFBa0Q7QUFHbEQsTUFBYSxlQUFnQixTQUFRLHVCQUFVO0lBSTNDLFlBQTRCLGFBQW9CO1FBQzVDLEtBQUssRUFBRSxDQUFDO1FBRGdCLGtCQUFhLEdBQWIsYUFBYSxDQUFPO1FBSGhELG1CQUFjLEdBQUcsU0FBRyxDQUFDLFFBQVEsQ0FBQztRQUM5QixhQUFRLEdBQUcsbUJBQVEsQ0FBQyxRQUFRLENBQUM7SUFJN0IsQ0FBQztDQUNKO0FBUEQsMENBT0M7Ozs7QUNaRCw2Q0FBMEM7QUFDMUMsMkNBQXdDO0FBRXhDLE1BQWEsWUFBYSxTQUFRLHVCQUFVO0lBQTVDOztRQUNJLG1CQUFjLEdBQUcsU0FBRyxDQUFDLFFBQVEsQ0FBQztRQUM5QixhQUFRLEdBQUcsUUFBUSxDQUFDO0lBQ3hCLENBQUM7Q0FBQTtBQUhELG9DQUdDOzs7O0FDTkQsNkNBQTBDO0FBRTFDLE1BQWEsY0FBZSxTQUFRLHVCQUFVO0lBQzFDLFlBQW1CLEtBQVk7UUFDM0IsS0FBSyxFQUFFLENBQUM7UUFETyxVQUFLLEdBQUwsS0FBSyxDQUFPO0lBRS9CLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pDLENBQUM7Q0FDSjtBQVJELHdDQVFDOzs7O0FDVkQsNkRBQTBEO0FBQzFELDJEQUF3RDtBQUN4RCw2Q0FBMEM7QUFHMUMsTUFBYSxXQUFZLFNBQVEsdUNBQWtCO0lBQW5EOztRQUNJLG1CQUFjLEdBQUcseUJBQVcsQ0FBQyxRQUFRLENBQUM7UUFDdEMsYUFBUSxHQUFHLFdBQUksQ0FBQyxRQUFRLENBQUM7SUFTN0IsQ0FBQztJQVBHLE1BQU0sS0FBSyxJQUFJO1FBQ1gsTUFBTSxJQUFJLEdBQUcsdUNBQWtCLENBQUMsSUFBSSxDQUFDO1FBRXJDLElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBSSxDQUFDLFFBQVEsQ0FBQztRQUUxQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUFYRCxrQ0FXQzs7OztBQ2hCRCw2Q0FBMEM7QUFDMUMsNkNBQTBDO0FBQzFDLGdEQUE2QztBQUM3QyxzREFBbUQ7QUFDbkQseURBQXNEO0FBQ3RELHlEQUFzRDtBQUN0RCwwREFBdUQ7QUFHdkQsNkNBQTBDO0FBQzFDLDJEQUF3RDtBQUV4RCxNQUFhLFdBQVksU0FBUSx1QkFBVTtJQUN2QyxZQUFtQixLQUFrQjtRQUNqQyxLQUFLLEVBQUUsQ0FBQztRQURPLFVBQUssR0FBTCxLQUFLLENBQWE7UUFHakMsTUFBTSxRQUFRLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztRQUM5QixRQUFRLENBQUMsSUFBSSxHQUFHLFdBQUksQ0FBQyxRQUFRLENBQUM7UUFDOUIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQ3BCLElBQUkscUJBQVMsQ0FBQyxXQUFJLENBQUMsaUJBQWlCLEVBQUUsdUJBQVUsQ0FBQyxRQUFRLENBQUMsRUFDMUQsSUFBSSxxQkFBUyxDQUFDLFdBQUksQ0FBQyxjQUFjLEVBQUUsdUJBQVUsQ0FBQyxRQUFRLENBQUMsQ0FDMUQsQ0FBQztRQUVGLFFBQVEsQ0FBQyxVQUFVLEdBQUcseUJBQVcsQ0FBQyxRQUFRLENBQUM7UUFFM0MsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQ2QseUJBQVcsQ0FBQyxTQUFTLENBQUMsV0FBSSxDQUFDLGNBQWMsQ0FBQyxFQUMxQyx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxXQUFJLENBQUMsaUJBQWlCLENBQUMsRUFDN0MseUJBQVcsQ0FBQyxRQUFRLEVBQUUsRUFDdEIseUJBQVcsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLEVBQ3hDLHlCQUFXLENBQUMsTUFBTSxFQUFFLENBQ3ZCLENBQUM7UUFFRixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFTyxZQUFZLENBQUMsUUFBc0IsRUFBRSxLQUFvQjtRQUM3RCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQztRQUVoRCxPQUFPLGVBQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUNKO0FBOUJELGtDQThCQzs7OztBQzFDRCw2REFBMEQ7QUFDMUQsMkRBQXdEO0FBQ3hELCtDQUE0QztBQUc1QyxNQUFhLFlBQWEsU0FBUSx1Q0FBa0I7SUFBcEQ7O1FBQ0ksbUJBQWMsR0FBRyx5QkFBVyxDQUFDLGNBQWMsQ0FBQztRQUM1QyxhQUFRLEdBQUcsYUFBSyxDQUFDLFFBQVEsQ0FBQztJQVM5QixDQUFDO0lBUEcsTUFBTSxLQUFLLElBQUk7UUFDWCxNQUFNLElBQUksR0FBRyx1Q0FBa0IsQ0FBQyxJQUFJLENBQUM7UUFFckMsSUFBSSxDQUFDLElBQUksR0FBRyxhQUFLLENBQUMsUUFBUSxDQUFDO1FBRTNCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQVhELG9DQVdDOzs7O0FDaEJELDZEQUEwRDtBQUUxRCxpREFBOEM7QUFFOUMsTUFBYSxhQUFjLFNBQVEsdUNBQWtCO0lBQ2pELE1BQU0sS0FBSyxJQUFJO1FBQ1gsTUFBTSxJQUFJLEdBQUcsdUNBQWtCLENBQUMsSUFBSSxDQUFDO1FBRXJDLElBQUksQ0FBQyxJQUFJLEdBQUcsZUFBTSxDQUFDLFFBQVEsQ0FBQztRQUU1QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUFSRCxzQ0FRQzs7OztBQ1pELDZDQUEwQztBQUUxQyxNQUFhLFVBQVcsU0FBUSx1QkFBVTtJQUExQzs7UUFDSSxZQUFPLEdBQVUsRUFBRSxDQUFDO0lBQ3hCLENBQUM7Q0FBQTtBQUZELGdDQUVDOzs7O0FDSkQsNkNBQTBDO0FBQzFDLDJDQUF3QztBQUV4QyxNQUFhLGFBQWMsU0FBUSx1QkFBVTtJQUt6QyxZQUFZLEtBQVk7UUFDcEIsS0FBSyxFQUFFLENBQUM7UUFKWixtQkFBYyxHQUFHLFNBQUcsQ0FBQyxRQUFRLENBQUM7UUFDOUIsYUFBUSxHQUFHLFNBQVMsQ0FBQztRQUlqQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUM7SUFDN0IsQ0FBQztDQUNKO0FBYkQsc0NBYUM7Ozs7QUNoQkQsNkNBQTBDO0FBQzFDLDJEQUF3RDtBQUN4RCwyQ0FBd0M7QUFHeEMseURBQXNEO0FBRXRELDRDQUF5QztBQUN6Qyw4Q0FBMkM7QUFDM0MsNkNBQTBDO0FBQzFDLHlEQUFzRDtBQUV0RCxNQUFhLGtCQUFtQixTQUFRLHVCQUFVO0lBQWxEOztRQUNJLG1CQUFjLEdBQUcsU0FBRyxDQUFDLFFBQVEsQ0FBQztRQUM5QixhQUFRLEdBQUcseUJBQVcsQ0FBQyxRQUFRLENBQUM7SUEwQ3BDLENBQUM7SUF4Q0csTUFBTSxLQUFLLElBQUk7UUFDWCxNQUFNLElBQUksR0FBRyxJQUFJLFdBQUksQ0FBQyx5QkFBVyxDQUFDLFFBQVEsRUFBRSx5QkFBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXhFLE1BQU0sUUFBUSxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7UUFDN0IsUUFBUSxDQUFDLElBQUksR0FBRyx5QkFBVyxDQUFDLFFBQVEsQ0FBQztRQUNyQyxRQUFRLENBQUMsUUFBUSxHQUFHLFdBQUksQ0FBQyxRQUFRLENBQUM7UUFDbEMsUUFBUSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFFM0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztRQUNoQyxXQUFXLENBQUMsSUFBSSxHQUFHLHlCQUFXLENBQUMsV0FBVyxDQUFDO1FBQzNDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsdUJBQVUsQ0FBQyxRQUFRLENBQUM7UUFDM0MsV0FBVyxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFFOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFOUIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVPLG1CQUFtQixDQUFDLElBQVc7O1FBQ25DLE1BQU0sUUFBUSxTQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQywwQ0FBRSxLQUFLLENBQUM7UUFFOUMsSUFBSSxRQUFRLElBQUksU0FBUyxFQUFDO1lBQ3RCLE1BQU0sSUFBSSwyQkFBWSxDQUFDLDZDQUE2QyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1NBQ2hGO1FBRUQsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVELGdCQUFnQjtRQUNaLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyx5QkFBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxjQUFjLENBQUMsSUFBVztRQUN0QixPQUFvQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELGdCQUFnQixDQUFDLElBQVc7UUFDeEIsT0FBc0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0FDSjtBQTVDRCxnREE0Q0M7Ozs7QUNyREQsTUFBYSxRQUFRO0lBRWpCLFlBQTRCLElBQVcsRUFDWCxJQUFTLEVBQ2xCLEtBQWlCO1FBRlIsU0FBSSxHQUFKLElBQUksQ0FBTztRQUNYLFNBQUksR0FBSixJQUFJLENBQUs7UUFDbEIsVUFBSyxHQUFMLEtBQUssQ0FBWTtJQUNwQyxDQUFDO0NBQ0o7QUFORCw0QkFNQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgSUxvZ091dHB1dCB9IGZyb20gXCIuL3J1bnRpbWUvSUxvZ091dHB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhbmVPdXRwdXQgaW1wbGVtZW50cyBJT3V0cHV0LCBJTG9nT3V0cHV0e1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYW5lOkhUTUxEaXZFbGVtZW50KXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIoKXtcclxuICAgICAgICB0aGlzLnBhbmUuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBkZWJ1ZyhsaW5lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnBhbmUuaW5uZXJIVE1MICs9IGxpbmUgKyBcIjwvYnI+XCI7XHJcbiAgICB9XHJcblxyXG4gICAgd3JpdGUobGluZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wYW5lLmlubmVySFRNTCArPSBsaW5lICsgXCI8L2JyPlwiO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVGFsb25Db21waWxlciB9IGZyb20gXCIuL2NvbXBpbGVyL1RhbG9uQ29tcGlsZXJcIjtcclxuXHJcbmltcG9ydCB7IFBhbmVPdXRwdXQgfSBmcm9tIFwiLi9QYW5lT3V0cHV0XCI7XHJcblxyXG5pbXBvcnQgeyBUYWxvblJ1bnRpbWUgfSBmcm9tIFwiLi9ydW50aW1lL1RhbG9uUnVudGltZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4vY29tbW9uL1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvbklkZXtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29kZVBhbmU6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGdhbWVQYW5lOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21waWxhdGlvbk91dHB1dDpIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZ2FtZUxvZ091dHB1dDpIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZXhhbXBsZTFCdXR0b246SFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBpbGVCdXR0b246SFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHN0YXJ0TmV3R2FtZUJ1dHRvbjpIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgdXNlckNvbW1hbmRUZXh0OkhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNlbmRVc2VyQ29tbWFuZEJ1dHRvbjpIVE1MQnV0dG9uRWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBpbGF0aW9uT3V0cHV0UGFuZTpQYW5lT3V0cHV0O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBydW50aW1lT3V0cHV0UGFuZTpQYW5lT3V0cHV0O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBydW50aW1lTG9nT3V0cHV0UGFuZTpQYW5lT3V0cHV0O1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcGlsZXI6VGFsb25Db21waWxlcjtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcnVudGltZTpUYWxvblJ1bnRpbWU7XHJcbiAgICBcclxuICAgIHByaXZhdGUgY29tcGlsZWRUeXBlczpUeXBlW10gPSBbXTtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRCeUlkPFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4obmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiA8VD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY29kZVBhbmUgPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxEaXZFbGVtZW50PihcImNvZGUtcGFuZVwiKSE7XHJcbiAgICAgICAgdGhpcy5nYW1lUGFuZSA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTERpdkVsZW1lbnQ+KFwiZ2FtZS1wYW5lXCIpITtcclxuICAgICAgICB0aGlzLmNvbXBpbGF0aW9uT3V0cHV0ID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MRGl2RWxlbWVudD4oXCJjb21waWxhdGlvbi1vdXRwdXRcIikhO1xyXG4gICAgICAgIHRoaXMuZ2FtZUxvZ091dHB1dCA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTERpdkVsZW1lbnQ+KFwibG9nLXBhbmVcIikhO1xyXG4gICAgICAgIHRoaXMuZXhhbXBsZTFCdXR0b24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxCdXR0b25FbGVtZW50PihcImV4YW1wbGUxXCIpITtcclxuICAgICAgICB0aGlzLmNvbXBpbGVCdXR0b24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxCdXR0b25FbGVtZW50PihcImNvbXBpbGVcIikhO1xyXG4gICAgICAgIHRoaXMuc3RhcnROZXdHYW1lQnV0dG9uID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MQnV0dG9uRWxlbWVudD4oXCJzdGFydC1uZXctZ2FtZVwiKSE7XHJcbiAgICAgICAgdGhpcy51c2VyQ29tbWFuZFRleHQgPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxJbnB1dEVsZW1lbnQ+KFwidXNlci1jb21tYW5kLXRleHRcIikhO1xyXG4gICAgICAgIHRoaXMuc2VuZFVzZXJDb21tYW5kQnV0dG9uID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MQnV0dG9uRWxlbWVudD4oXCJzZW5kLXVzZXItY29tbWFuZFwiKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmV4YW1wbGUxQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB0aGlzLmxvYWRFeGFtcGxlKCkpO1xyXG4gICAgICAgIHRoaXMuY29tcGlsZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4gdGhpcy5jb21waWxlKCkpO1xyXG4gICAgICAgIHRoaXMuc3RhcnROZXdHYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB0aGlzLnN0YXJ0TmV3R2FtZSgpKTtcclxuICAgICAgICB0aGlzLnNlbmRVc2VyQ29tbWFuZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4gdGhpcy5zZW5kVXNlckNvbW1hbmQoKSk7XHJcbiAgICAgICAgdGhpcy51c2VyQ29tbWFuZFRleHQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykgeyAvLyBlbnRlciBrZXlcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFVzZXJDb21tYW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21waWxhdGlvbk91dHB1dFBhbmUgPSBuZXcgUGFuZU91dHB1dCh0aGlzLmNvbXBpbGF0aW9uT3V0cHV0KTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWVPdXRwdXRQYW5lID0gbmV3IFBhbmVPdXRwdXQodGhpcy5nYW1lUGFuZSk7XHJcbiAgICAgICAgdGhpcy5ydW50aW1lTG9nT3V0cHV0UGFuZSA9IG5ldyBQYW5lT3V0cHV0KHRoaXMuZ2FtZUxvZ091dHB1dCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tcGlsZXIgPSBuZXcgVGFsb25Db21waWxlcih0aGlzLmNvbXBpbGF0aW9uT3V0cHV0UGFuZSk7XHJcbiAgICAgICAgdGhpcy5ydW50aW1lID0gbmV3IFRhbG9uUnVudGltZSh0aGlzLnJ1bnRpbWVPdXRwdXRQYW5lLCB0aGlzLnJ1bnRpbWVMb2dPdXRwdXRQYW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbmRVc2VyQ29tbWFuZCgpe1xyXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLnVzZXJDb21tYW5kVGV4dC52YWx1ZTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWUuc2VuZENvbW1hbmQoY29tbWFuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb21waWxlKCl7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IHRoaXMuY29kZVBhbmUuaW5uZXJUZXh0O1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBpbGF0aW9uT3V0cHV0UGFuZS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuY29tcGlsZWRUeXBlcyA9IHRoaXMuY29tcGlsZXIuY29tcGlsZShjb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXJ0TmV3R2FtZSgpe1xyXG4gICAgICAgIHRoaXMucnVudGltZU91dHB1dFBhbmUuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWVMb2dPdXRwdXRQYW5lLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJ1bnRpbWUubG9hZEZyb20odGhpcy5jb21waWxlZFR5cGVzKSl7XHJcbiAgICAgICAgICAgIHRoaXMucnVudGltZS5zdGFydCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWRFeGFtcGxlKCl7XHJcbiAgICAgICAgICAgIHRoaXMuY29kZVBhbmUuaW5uZXJUZXh0ID0gXHJcbiAgICAgICAgICAgICAgICBcInNheSBcXFwiVGhpcyBpcyB0aGUgc3RhcnQuXFxcIi5cXG5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFwidW5kZXJzdGFuZCBcXFwibG9va1xcXCIgYXMgZGVzY3JpYmluZy4gXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJ1bmRlcnN0YW5kIFxcXCJub3J0aFxcXCIgYXMgZGlyZWN0aW9ucy4gXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJ1bmRlcnN0YW5kIFxcXCJzb3V0aFxcXCIgYXMgZGlyZWN0aW9ucy5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcImdvXFxcIiBhcyBtb3ZpbmcuIFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwidW5kZXJzdGFuZCBcXFwidGFrZVxcXCIgYXMgdGFraW5nLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcImludlxcXCIgYXMgaW52ZW50b3J5LiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcImRyb3BcXFwiIGFzIGRyb3BwaW5nLiBcXG5cXG5cIiArXHJcblxyXG4gICAgICAgICAgICAgICAgXCJhbiBJbm4gaXMgYSBraW5kIG9mIHBsYWNlLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGlzIHdoZXJlIHRoZSBwbGF5ZXIgc3RhcnRzLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGlzIGRlc2NyaWJlZCBhcyBcXFwiVGhlIGlubiBpcyBhIGNvenkgcGxhY2UsIHdpdGggYSBjcmFja2xpbmcgZmlyZSBvbiB0aGUgaGVhcnRoLiBUaGUgYmFydGVuZGVyIGlzIGJlaGluZCB0aGUgYmFyLiBBbiBvcGVuIGRvb3IgdG8gdGhlIG5vcnRoIGxlYWRzIG91dHNpZGUuXFxcIiBhbmQgaWYgaXQgY29udGFpbnMgMSBDb2luIHRoZW4gc2F5IFxcXCJUaGVyZSdzIGFsc28gYSBjb2luIGhlcmUuXFxcIiBlbHNlIHNheSBcXFwiVGhlcmUgaXMganVzdCBkdXN0LlxcXCIuXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJpdCBjb250YWlucyAxIENvaW4uXFxuXCIgKyBcclxuICAgICAgICAgICAgICAgIFwiaXQgY2FuIHJlYWNoIHRoZSBXYWxrd2F5IGJ5IGdvaW5nIFxcXCJub3J0aFxcXCIuIFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwiaXQgaGFzIGEgXFxcInZhbHVlXFxcIiB0aGF0IGlzIDEuIFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwid2hlbiB0aGUgcGxheWVyIGV4aXRzOiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInNheSBcXFwiVGhlIGJhcnRlbmRlciB3YXZlcyBnb29kYnllLlxcXCI7IFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwic2V0IFxcXCJ2YWx1ZVxcXCIgdG8gMjsgXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJhbmQgdGhlbiBzdG9wLiBcXG5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFwiYSBGaXJlcGxhY2UgaXMgYSBraW5kIG9mIGRlY29yYXRpb24uIFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwiaXQgaXMgZGVzY3JpYmVkIGFzIFxcXCJUaGUgZmlyZXBsYWNlIGNyYWNrbGVzLiBJdCdzIGZ1bGwgb2YgZmlyZS5cXFwiLiBcXG5cXG5cIiArXHJcblxyXG4gICAgICAgICAgICAgICAgXCJhIFdhbGt3YXkgaXMgYSBraW5kIG9mIHBsYWNlLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGlzIGRlc2NyaWJlZCBhcyBcXFwiVGhlIHdhbGt3YXkgaW4gZnJvbnQgb2YgdGhlIGlubiBpcyBlbXB0eSwganVzdCBhIGNvYmJsZXN0b25lIGVudHJhbmNlLiBUaGUgaW5uIGlzIHRvIHRoZSBzb3V0aC5cXFwiLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGNhbiByZWFjaCB0aGUgSW5uIGJ5IGdvaW5nIFxcXCJzb3V0aFxcXCIuIFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwid2hlbiB0aGUgcGxheWVyIGVudGVyczpcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInNheSBcXFwiWW91IHdhbGsgb250byB0aGUgY29iYmxlc3RvbmVzLiBUaGV5J3JlIG5pY2UsIGlmIHlvdSBsaWtlIHRoYXQgc29ydCBvZiB0aGluZy5cXFwiOyBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInNheSBcXFwiVGhlcmUncyBub2JvZHkgYXJvdW5kLiBUaGUgd2luZCB3aGlzdGxlcyBhIGxpdHRsZSBiaXQuXFxcIjsgXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJhbmQgdGhlbiBzdG9wLiBcXG5cXG5cIiArXHJcblxyXG4gICAgICAgICAgICAgICAgXCJzYXkgXFxcIlRoaXMgaXMgdGhlIG1pZGRsZS5cXFwiLlxcblxcblwiICtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXCJhIENvaW4gaXMgYSBraW5kIG9mIGl0ZW0uIFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwiaXQgaXMgZGVzY3JpYmVkIGFzIFxcXCJJdCdzIGEgc21hbGwgY29pbi5cXFwiLlxcblxcblwiICtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXCJzYXkgXFxcIlRoaXMgaXMgdGhlIGVuZC5cXFwiLlxcblwiO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gRXZlbnRUeXBle1xyXG4gICAgTm9uZSxcclxuICAgIFBsYXllckVudGVyc1BsYWNlLFxyXG4gICAgUGxheWVyRXhpdHNQbGFjZVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuL1R5cGVcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4vTWV0aG9kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRmllbGR7XHJcbiAgICBuYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICB0eXBlTmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgdHlwZT86VHlwZTtcclxuICAgIGRlZmF1bHRWYWx1ZT86T2JqZWN0O1xyXG59IiwiaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdHJ1Y3Rpb257XHJcbiAgICBzdGF0aWMgYXNzaWduKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuQXNzaWduKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaW52b2tlRGVsZWdhdGUoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5JbnZva2VEZWxlZ2F0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGlzVHlwZU9mKHR5cGVOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuVHlwZU9mLCB0eXBlTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWROdW1iZXIodmFsdWU6bnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkTnVtYmVyLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRTdHJpbmcodmFsdWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkU3RyaW5nLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRJbnN0YW5jZSh0eXBlTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRJbnN0YW5jZSwgdHlwZU5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkRmllbGQoZmllbGROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZEZpZWxkLCBmaWVsZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkUHJvcGVydHkoZmllbGROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZFByb3BlcnR5LCBmaWVsZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkTG9jYWwobG9jYWxOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZExvY2FsLCBsb2NhbE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkVGhpcygpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRUaGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaW5zdGFuY2VDYWxsKG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5JbnN0YW5jZUNhbGwsIG1ldGhvZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb25jYXRlbmF0ZSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkNvbmNhdGVuYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3RhdGljQ2FsbCh0eXBlTmFtZTpzdHJpbmcsIG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5TdGF0aWNDYWxsLCBgJHt0eXBlTmFtZX0uJHttZXRob2ROYW1lfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBleHRlcm5hbENhbGwobWV0aG9kTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkV4dGVybmFsQ2FsbCwgbWV0aG9kTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHByaW50KCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuUHJpbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZXR1cm4oKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5SZXR1cm4pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZWFkSW5wdXQoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5SZWFkSW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwYXJzZUNvbW1hbmQoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5QYXJzZUNvbW1hbmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBoYW5kbGVDb21tYW5kKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuSGFuZGxlQ29tbWFuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdvVG8obGluZU51bWJlcjpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkdvVG8sIGxpbmVOdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBicmFuY2hSZWxhdGl2ZShjb3VudDpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkJyYW5jaFJlbGF0aXZlLCBjb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGJyYW5jaFJlbGF0aXZlSWZGYWxzZShjb3VudDpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkJyYW5jaFJlbGF0aXZlSWZGYWxzZSwgY291bnQpO1xyXG4gICAgfVxyXG5cclxuICAgIG9wQ29kZTpPcENvZGUgPSBPcENvZGUuTm9PcDtcclxuICAgIHZhbHVlPzpPYmplY3Q7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3BDb2RlOk9wQ29kZSwgdmFsdWU/Ok9iamVjdCl7XHJcbiAgICAgICAgdGhpcy5vcENvZGUgPSBvcENvZGU7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUGFyYW1ldGVyIH0gZnJvbSBcIi4vUGFyYW1ldGVyXCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vcnVudGltZS9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IEV2ZW50VHlwZSB9IGZyb20gXCIuL0V2ZW50VHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1ldGhvZHtcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHBhcmFtZXRlcnM6UGFyYW1ldGVyW10gPSBbXTtcclxuICAgIGFjdHVhbFBhcmFtZXRlcnM6VmFyaWFibGVbXSA9IFtdO1xyXG4gICAgYm9keTpJbnN0cnVjdGlvbltdID0gW107XHJcbiAgICByZXR1cm5UeXBlOnN0cmluZyA9IFwiXCI7XHJcbiAgICBldmVudFR5cGU6RXZlbnRUeXBlID0gRXZlbnRUeXBlLk5vbmU7XHJcbn0iLCJleHBvcnQgZW51bSBPcENvZGUge1xyXG4gICAgTm9PcCxcclxuICAgIEFzc2lnbixcclxuICAgIFByaW50LFxyXG4gICAgTG9hZFN0cmluZyxcclxuICAgIE5ld0luc3RhbmNlLFxyXG4gICAgUGFyc2VDb21tYW5kLFxyXG4gICAgSGFuZGxlQ29tbWFuZCxcclxuICAgIFJlYWRJbnB1dCxcclxuICAgIEdvVG8sXHJcbiAgICBSZXR1cm4sXHJcbiAgICBCcmFuY2hSZWxhdGl2ZSxcclxuICAgIEJyYW5jaFJlbGF0aXZlSWZGYWxzZSxcclxuICAgIENvbmNhdGVuYXRlLFxyXG4gICAgTG9hZE51bWJlcixcclxuICAgIExvYWRGaWVsZCxcclxuICAgIExvYWRQcm9wZXJ0eSxcclxuICAgIExvYWRJbnN0YW5jZSxcclxuICAgIExvYWRMb2NhbCxcclxuICAgIExvYWRUaGlzLFxyXG4gICAgSW5zdGFuY2VDYWxsLFxyXG4gICAgU3RhdGljQ2FsbCxcclxuICAgIEV4dGVybmFsQ2FsbCxcclxuICAgIFR5cGVPZixcclxuICAgIEludm9rZURlbGVnYXRlXHJcbn0iLCJpbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhcmFtZXRlcntcclxuICAgIFxyXG4gICAgdHlwZT86VHlwZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbmFtZTpzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdHlwZU5hbWU6c3RyaW5nKXtcclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuL0ZpZWxkXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBBdHRyaWJ1dGUgfSBmcm9tIFwiLi9BdHRyaWJ1dGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBleyAgICAgIFxyXG4gICAgZmllbGRzOkZpZWxkW10gPSBbXTtcclxuICAgIG1ldGhvZHM6TWV0aG9kW10gPSBbXTsgXHJcbiAgICBhdHRyaWJ1dGVzOkF0dHJpYnV0ZVtdID0gW107XHJcblxyXG4gICAgZ2V0IGlzU3lzdGVtVHlwZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUuc3RhcnRzV2l0aChcIn5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzQW5vbnltb3VzVHlwZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUuc3RhcnRzV2l0aChcIjx+PlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTpzdHJpbmcsIHB1YmxpYyBiYXNlVHlwZU5hbWU6c3RyaW5nKXtcclxuXHJcbiAgICB9ICAgIFxyXG59IiwiZXhwb3J0IGNsYXNzIFZlcnNpb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbWFqb3I6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IG1pbm9yOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBwYXRjaDpudW1iZXIpe1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMubWFqb3J9LiR7dGhpcy5taW5vcn0uJHt0aGlzLnBhdGNofWA7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuLi9jb21tb24vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgRW50cnlQb2ludEF0dHJpYnV0ZSB9IGZyb20gXCIuLi9saWJyYXJ5L0VudHJ5UG9pbnRBdHRyaWJ1dGVcIjtcclxuaW1wb3J0IHsgVGFsb25MZXhlciB9IGZyb20gXCIuL2xleGluZy9UYWxvbkxleGVyXCI7XHJcbmltcG9ydCB7IFRhbG9uUGFyc2VyIH0gZnJvbSBcIi4vcGFyc2luZy9UYWxvblBhcnNlclwiO1xyXG5pbXBvcnQgeyBUYWxvblNlbWFudGljQW5hbHl6ZXIgfSBmcm9tIFwiLi9zZW1hbnRpY3MvVGFsb25TZW1hbnRpY0FuYWx5emVyXCI7XHJcbmltcG9ydCB7IFRhbG9uVHJhbnNmb3JtZXIgfSBmcm9tIFwiLi90cmFuc2Zvcm1pbmcvVGFsb25UcmFuc2Zvcm1lclwiO1xyXG5pbXBvcnQgeyBWZXJzaW9uIH0gZnJvbSBcIi4uL2NvbW1vbi9WZXJzaW9uXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgRGVsZWdhdGUgfSBmcm9tIFwiLi4vbGlicmFyeS9EZWxlZ2F0ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uQ29tcGlsZXJ7XHJcbiAgICBnZXQgbGFuZ3VhZ2VWZXJzaW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZXJzaW9uKDEsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB2ZXJzaW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZXJzaW9uKDEsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgb3V0OklPdXRwdXQpe1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBpbGUoY29kZTpzdHJpbmcpOlR5cGVbXXtcclxuICAgICAgICB0aGlzLm91dC53cml0ZShcIlN0YXJ0aW5nIGNvbXBpbGF0aW9uLi4uXCIpO1xyXG5cclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIGNvbnN0IGxleGVyID0gbmV3IFRhbG9uTGV4ZXIodGhpcy5vdXQpO1xyXG4gICAgICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgVGFsb25QYXJzZXIodGhpcy5vdXQpO1xyXG4gICAgICAgICAgICBjb25zdCBhbmFseXplciA9IG5ldyBUYWxvblNlbWFudGljQW5hbHl6ZXIodGhpcy5vdXQpO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1lciA9IG5ldyBUYWxvblRyYW5zZm9ybWVyKHRoaXMub3V0KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRva2VucyA9IGxleGVyLnRva2VuaXplKGNvZGUpO1xyXG4gICAgICAgICAgICBjb25zdCBhc3QgPSBwYXJzZXIucGFyc2UodG9rZW5zKTtcclxuICAgICAgICAgICAgY29uc3QgYW5hbHl6ZWRBc3QgPSBhbmFseXplci5hbmFseXplKGFzdCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVzID0gdHJhbnNmb3JtZXIudHJhbnNmb3JtKGFuYWx5emVkQXN0KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5UG9pbnQgPSB0aGlzLmNyZWF0ZUVudHJ5UG9pbnQoKTtcclxuXHJcbiAgICAgICAgICAgIHR5cGVzLnB1c2goZW50cnlQb2ludCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHlwZXM7XHJcbiAgICAgICAgfSBjYXRjaChleCl7XHJcbiAgICAgICAgICAgIGlmIChleCBpbnN0YW5jZW9mIENvbXBpbGF0aW9uRXJyb3Ipe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vdXQud3JpdGUoYEVycm9yOiAke2V4Lm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm91dC53cml0ZShgVW5oYW5kbGVkIEVycm9yOiAke2V4fWApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfSBmaW5hbGx5e1xyXG4gICAgICAgICAgICB0aGlzLm91dC53cml0ZShcIkNvbXBpbGF0aW9uIGNvbXBsZXRlLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVFbnRyeVBvaW50KCl7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IG5ldyBUeXBlKFwifmVudHJ5UG9pbnRcIiwgXCJ+ZW1wdHlcIik7XHJcblxyXG4gICAgICAgIHR5cGUuYXR0cmlidXRlcy5wdXNoKG5ldyBFbnRyeVBvaW50QXR0cmlidXRlKCkpO1xyXG5cclxuICAgICAgICBjb25zdCBtYWluID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgIG1haW4ubmFtZSA9IEFueS5tYWluO1xyXG4gICAgICAgIG1haW4uYm9keS5wdXNoKFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGBUYWxvbiBMYW5ndWFnZSB2LiR7dGhpcy5sYW5ndWFnZVZlcnNpb259LCBDb21waWxlciB2LiR7dGhpcy52ZXJzaW9ufWApLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLCAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIlwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uc3RhdGljQ2FsbChcIn5nbG9iYWxTYXlzXCIsIFwifnNheVwiKSwgICAgICAgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiV2hhdCB3b3VsZCB5b3UgbGlrZSB0byBkbz9cIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnJlYWRJbnB1dCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wYXJzZUNvbW1hbmQoKSwgICAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmhhbmRsZUNvbW1hbmQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uaXNUeXBlT2YoRGVsZWdhdGUudHlwZU5hbWUpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5icmFuY2hSZWxhdGl2ZUlmRmFsc2UoMiksICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmludm9rZURlbGVnYXRlKCksICAgICAgICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmUoLTQpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5nb1RvKDkpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdHlwZS5tZXRob2RzLnB1c2gobWFpbik7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENvbXBpbGF0aW9uRXJyb3J7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG1lc3NhZ2U6c3RyaW5nKXtcclxuXHJcbiAgICB9XHJcbn0iLCJpbnRlcmZhY2UgSW5kZXhhYmxle1xyXG4gICAgW2tleTpzdHJpbmddOmFueTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEtleXdvcmRze1xyXG4gICAgXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYW4gPSBcImFuXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYSA9IFwiYVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRoZSA9IFwidGhlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaXMgPSBcImlzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkga2luZCA9IFwia2luZFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG9mID0gXCJvZlwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBsYWNlID0gXCJwbGFjZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGl0ZW0gPSBcIml0ZW1cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpdCA9IFwiaXRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBoYXMgPSBcImhhc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGlmID0gXCJpZlwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRlc2NyaXB0aW9uID0gXCJkZXNjcmlwdGlvblwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHVuZGVyc3RhbmQgPSBcInVuZGVyc3RhbmRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBhcyA9IFwiYXNcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZXNjcmliaW5nID0gXCJkZXNjcmliaW5nXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGVzY3JpYmVkID0gXCJkZXNjcmliZWRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB3aGVyZSA9IFwid2hlcmVcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwbGF5ZXIgPSBcInBsYXllclwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHN0YXJ0cyA9IFwic3RhcnRzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY29udGFpbnMgPSBcImNvbnRhaW5zXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc2F5ID0gXCJzYXlcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkaXJlY3Rpb25zID0gXCJkaXJlY3Rpb25zXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgbW92aW5nID0gXCJtb3ZpbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0YWtpbmcgPSBcInRha2luZ1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGludmVudG9yeSA9IFwiaW52ZW50b3J5XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY2FuID0gXCJjYW5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSByZWFjaCA9IFwicmVhY2hcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBieSA9IFwiYnlcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBnb2luZyA9IFwiZ29pbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBhbmQgPSBcImFuZFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRoZW4gPSBcInRoZW5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBlbHNlID0gXCJlbHNlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgd2hlbiA9IFwid2hlblwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGVudGVycyA9IFwiZW50ZXJzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZXhpdHMgPSBcImV4aXRzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc3RvcCA9IFwic3RvcFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRyb3BwaW5nID0gXCJkcm9wcGluZ1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRoYXQgPSBcInRoYXRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBzZXQgPSBcInNldFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRvID0gXCJ0b1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRlY29yYXRpb24gPSBcImRlY29yYXRpb25cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB2aXNpYmxlID0gXCJ2aXNpYmxlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgbm90ID0gXCJub3RcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBvYnNlcnZlZCA9IFwib2JzZXJ2ZWRcIjtcclxuXHJcbiAgICBzdGF0aWMgZ2V0QWxsKCk6U2V0PHN0cmluZz57XHJcbiAgICAgICAgdHlwZSBLZXl3b3JkUHJvcGVydGllcyA9IGtleW9mIEtleXdvcmRzO1xyXG5cclxuICAgICAgICBjb25zdCBhbGxLZXl3b3JkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xyXG5cclxuICAgICAgICBjb25zdCBuYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEtleXdvcmRzKTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBrZXl3b3JkIG9mIG5hbWVzKXtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSAoS2V5d29yZHMgYXMgSW5kZXhhYmxlKVtrZXl3b3JkXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgdmFsdWUgIT0gXCJLZXl3b3Jkc1wiKXtcclxuICAgICAgICAgICAgICAgIGFsbEtleXdvcmRzLmFkZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhbGxLZXl3b3JkcztcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBQdW5jdHVhdGlvbntcclxuICAgIHN0YXRpYyByZWFkb25seSBwZXJpb2QgPSBcIi5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBjb2xvbiA9IFwiOlwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHNlbWljb2xvbiA9IFwiO1wiO1xyXG59IiwiaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi9Ub2tlblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFB1bmN0dWF0aW9uIH0gZnJvbSBcIi4vUHVuY3R1YXRpb25cIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25MZXhlcntcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGFsbEtleXdvcmRzID0gS2V5d29yZHMuZ2V0QWxsKCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXQ6SU91dHB1dCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRva2VuaXplKGNvZGU6c3RyaW5nKTpUb2tlbltde1xyXG4gICAgICAgIGxldCBjdXJyZW50TGluZSA9IDE7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRDb2x1bW4gPSAxO1xyXG5cclxuICAgICAgICBjb25zdCB0b2tlbnM6VG9rZW5bXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb2RlLmxlbmd0aDsgKXtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSBjb2RlLmNoYXJBdChpbmRleCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gXCIgXCIpe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvbHVtbisrO1xyXG4gICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gXCJcXG5cIil7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29sdW1uID0gMTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lKys7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB0b2tlblZhbHVlID0gdGhpcy5jb25zdW1lVG9rZW5DaGFyc0F0KGNvZGUsIGluZGV4KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0b2tlblZhbHVlLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBuZXcgVG9rZW4oY3VycmVudExpbmUsIGN1cnJlbnRDb2x1bW4sIHRva2VuVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50Q29sdW1uICs9IHRva2VuVmFsdWUubGVuZ3RoO1xyXG4gICAgICAgICAgICBpbmRleCArPSB0b2tlblZhbHVlLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzaWZ5KHRva2Vucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGFzc2lmeSh0b2tlbnM6VG9rZW5bXSk6VG9rZW5bXXtcclxuICAgICAgICBmb3IobGV0IHRva2VuIG9mIHRva2Vucyl7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PSBQdW5jdHVhdGlvbi5wZXJpb2Qpe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5UZXJtaW5hdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlID09IFB1bmN0dWF0aW9uLnNlbWljb2xvbil7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLlNlbWlUZXJtaW5hdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlID09IFB1bmN0dWF0aW9uLmNvbG9uKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuT3Blbk1ldGhvZEJsb2NrO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFRhbG9uTGV4ZXIuYWxsS2V5d29yZHMuaGFzKHRva2VuLnZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLktleXdvcmQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4udmFsdWUuc3RhcnRzV2l0aChcIlxcXCJcIikgJiYgdG9rZW4udmFsdWUuZW5kc1dpdGgoXCJcXFwiXCIpKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuU3RyaW5nO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFpc05hTihOdW1iZXIodG9rZW4udmFsdWUpKSkge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5OdW1iZXI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLklkZW50aWZpZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0b2tlbnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb25zdW1lVG9rZW5DaGFyc0F0KGNvZGU6c3RyaW5nLCBpbmRleDpudW1iZXIpOnN0cmluZ3tcclxuICAgICAgICBjb25zdCB0b2tlbkNoYXJzOnN0cmluZ1tdID0gW107XHJcbiAgICAgICAgY29uc3Qgc3RyaW5nRGVsaW1pdGVyID0gXCJcXFwiXCI7XHJcblxyXG4gICAgICAgIGxldCBpc0NvbnN1bWluZ1N0cmluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IobGV0IHJlYWRBaGVhZEluZGV4ID0gaW5kZXg7IHJlYWRBaGVhZEluZGV4IDwgY29kZS5sZW5ndGg7IHJlYWRBaGVhZEluZGV4Kyspe1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IGNvZGUuY2hhckF0KHJlYWRBaGVhZEluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpc0NvbnN1bWluZ1N0cmluZyAmJiBjdXJyZW50Q2hhciAhPSBzdHJpbmdEZWxpbWl0ZXIpe1xyXG4gICAgICAgICAgICAgICAgdG9rZW5DaGFycy5wdXNoKGN1cnJlbnRDaGFyKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gc3RyaW5nRGVsaW1pdGVyKXsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0b2tlbkNoYXJzLnB1c2goY3VycmVudENoYXIpOyAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICBpc0NvbnN1bWluZ1N0cmluZyA9ICFpc0NvbnN1bWluZ1N0cmluZztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNDb25zdW1pbmdTdHJpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q2hhciA9PSBcIiBcIiB8fCBjdXJyZW50Q2hhciA9PSBcIlxcblwiIHx8IGN1cnJlbnRDaGFyID09IFB1bmN0dWF0aW9uLnBlcmlvZCB8fCBjdXJyZW50Q2hhciA9PSBQdW5jdHVhdGlvbi5jb2xvbiB8fCBjdXJyZW50Q2hhciA9PSBQdW5jdHVhdGlvbi5zZW1pY29sb24pe1xyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuQ2hhcnMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuQ2hhcnMucHVzaChjdXJyZW50Q2hhcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdG9rZW5DaGFycy5wdXNoKGN1cnJlbnRDaGFyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0b2tlbkNoYXJzLmpvaW4oXCJcIik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9JdGVtXCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IERlY29yYXRpb24gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9EZWNvcmF0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVG9rZW57XHJcbiAgICBzdGF0aWMgZ2V0IGVtcHR5KCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihcIn5lbXB0eVwiLCBUb2tlblR5cGUuVW5rbm93bik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JBbnkoKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKEFueS50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yUGxhY2UoKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKFBsYWNlLnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JJdGVtKCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihJdGVtLnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JEZWNvcmF0aW9uKCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihEZWNvcmF0aW9uLnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JXb3JsZE9iamVjdCgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoV29ybGRPYmplY3QudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvckJvb2xlYW4oKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKEJvb2xlYW5UeXBlLnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JMaXN0KCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihMaXN0LnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0VG9rZW5XaXRoVHlwZU9mKG5hbWU6c3RyaW5nLCB0eXBlOlRva2VuVHlwZSl7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBuZXcgVG9rZW4oLTEsLTEsbmFtZSk7XHJcbiAgICAgICAgdG9rZW4udHlwZSA9IHR5cGU7XHJcbiAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgfVxyXG5cclxuICAgIHR5cGU6VG9rZW5UeXBlID0gVG9rZW5UeXBlLlVua25vd247XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGxpbmU6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGNvbHVtbjpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdmFsdWU6c3RyaW5nKXtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLmxpbmV9fCR7dGhpcy5jb2x1bW59OiBGb3VuZCB0b2tlbiAnJHt0aGlzLnZhbHVlfScgb2YgdHlwZSAnJHt0aGlzLnR5cGV9J2A7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBUb2tlblR5cGV7XHJcbiAgICBVbmtub3duLFxyXG4gICAgS2V5d29yZCxcclxuICAgIFRlcm1pbmF0b3IsXHJcbiAgICBTZW1pVGVybWluYXRvcixcclxuICAgIFN0cmluZyxcclxuICAgIElkZW50aWZpZXIsXHJcbiAgICBOdW1iZXIsXHJcbiAgICBPcGVuTWV0aG9kQmxvY2tcclxufSIsImltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4uL2xleGluZy9Ub2tlblwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4uL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvclwiO1xyXG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuVHlwZVwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uLy4uL3J1bnRpbWUvSU91dHB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhcnNlQ29udGV4dHtcclxuICAgIGluZGV4Om51bWJlciA9IDA7XHJcblxyXG4gICAgZ2V0IGlzRG9uZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ID49IHRoaXMudG9rZW5zLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudFRva2VuKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdG9rZW5zOlRva2VuW10sIHByaXZhdGUgcmVhZG9ubHkgb3V0OklPdXRwdXQpe1xyXG4gICAgICAgIHRoaXMub3V0LndyaXRlKGAke3Rva2Vucy5sZW5ndGh9IHRva2VucyBkaXNjb3ZlcmVkLCBwYXJzaW5nLi4uYCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3VtZUN1cnJlbnRUb2tlbigpe1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5jdXJyZW50VG9rZW47XHJcblxyXG4gICAgICAgIHRoaXMuaW5kZXgrKztcclxuXHJcbiAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgfVxyXG5cclxuICAgIGlzKHRva2VuVmFsdWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VG9rZW4/LnZhbHVlID09IHRva2VuVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNUeXBlT2YodHlwZTpUb2tlblR5cGUpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUb2tlbi50eXBlID09IHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNBbnlUeXBlT2YoLi4udHlwZXM6VG9rZW5UeXBlW10pe1xyXG4gICAgICAgIGZvcihjb25zdCB0eXBlIG9mIHR5cGVzKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNUeXBlT2YodHlwZSkpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0FueU9mKC4uLnRva2VuVmFsdWVzOnN0cmluZ1tdKXtcclxuICAgICAgICBmb3IobGV0IHZhbHVlIG9mIHRva2VuVmFsdWVzKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXModmFsdWUpKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaXNUZXJtaW5hdG9yKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRva2VuLnR5cGUgPT0gVG9rZW5UeXBlLlRlcm1pbmF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0QW55T2YoLi4udG9rZW5WYWx1ZXM6c3RyaW5nW10pe1xyXG4gICAgICAgIGlmICghdGhpcy5pc0FueU9mKC4uLnRva2VuVmFsdWVzKSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiRXhwZWN0ZWQgdG9rZW5zXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0KHRva2VuVmFsdWU6c3RyaW5nKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9rZW4udmFsdWUgIT0gdG9rZW5WYWx1ZSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKGBFeHBlY3RlZCB0b2tlbiAnJHt0b2tlblZhbHVlfSdgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RTdHJpbmcoKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9rZW4udHlwZSAhPSBUb2tlblR5cGUuU3RyaW5nKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJFeHBlY3RlZCBzdHJpbmdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG5cclxuICAgICAgICAvLyBXZSBuZWVkIHRvIHN0cmlwIG9mZiB0aGUgZG91YmxlIHF1b3RlcyBmcm9tIHRoZWlyIHN0cmluZyBhZnRlciB3ZSBjb25zdW1lIGl0LlxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBuZXcgVG9rZW4odG9rZW4ubGluZSwgdG9rZW4uY29sdW1uLCB0b2tlbi52YWx1ZS5zdWJzdHJpbmcoMSwgdG9rZW4udmFsdWUubGVuZ3RoIC0gMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdE51bWJlcigpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi50eXBlICE9IFRva2VuVHlwZS5OdW1iZXIpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIG51bWJlclwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RJZGVudGlmaWVyKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRva2VuLnR5cGUgIT0gVG9rZW5UeXBlLklkZW50aWZpZXIpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIGlkZW50aWZpZXJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0VGVybWluYXRvcigpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi50eXBlICE9IFRva2VuVHlwZS5UZXJtaW5hdG9yKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJFeHBlY3RlZCBleHByZXNzaW9uIHRlcm1pbmF0b3JcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0U2VtaVRlcm1pbmF0b3IoKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9rZW4udHlwZSAhPSBUb2tlblR5cGUuU2VtaVRlcm1pbmF0b3Ipe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIHNlbWkgZXhwcmVzc2lvbiB0ZXJtaW5hdG9yXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdE9wZW5NZXRob2RCbG9jaygpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi50eXBlICE9IFRva2VuVHlwZS5PcGVuTWV0aG9kQmxvY2spe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIG9wZW4gbWV0aG9kIGJsb2NrXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFByb2dyYW1WaXNpdG9yIH0gZnJvbSBcIi4vdmlzaXRvcnMvUHJvZ3JhbVZpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25QYXJzZXJ7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHBhcnNlKHRva2VuczpUb2tlbltdKTpFeHByZXNzaW9ue1xyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgUGFyc2VDb250ZXh0KHRva2VucywgdGhpcy5vdXQpO1xyXG4gICAgICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgUHJvZ3JhbVZpc2l0b3IoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFjdGlvbnNFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBhY3Rpb25zOkV4cHJlc3Npb25bXSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmluYXJ5RXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBsZWZ0PzpFeHByZXNzaW9uO1xyXG4gICAgcmlnaHQ/OkV4cHJlc3Npb247XHJcbn0iLCJpbXBvcnQgeyBCaW5hcnlFeHByZXNzaW9uIH0gZnJvbSBcIi4vQmluYXJ5RXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmNhdGVuYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgQmluYXJ5RXhwcmVzc2lvbntcclxuICAgIFxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb250YWluc0V4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHRhcmdldE5hbWU6c3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGNvdW50Om51bWJlciwgXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdHlwZU5hbWU6c3RyaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIEV4cHJlc3Npb257XHJcbiAgICBcclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEJpbmFyeUV4cHJlc3Npb24gfSBmcm9tIFwiLi9CaW5hcnlFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgdHlwZU5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIGluaXRpYWxWYWx1ZT86T2JqZWN0O1xyXG4gICAgdHlwZT86VHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbjtcclxuICAgIGFzc29jaWF0ZWRFeHByZXNzaW9uczpCaW5hcnlFeHByZXNzaW9uW10gPSBbXTtcclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSWZFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBjb25kaXRpb25hbDpFeHByZXNzaW9uLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGlmQmxvY2s6RXhwcmVzc2lvbixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBlbHNlQmxvY2s6RXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGl0ZXJhbEV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHR5cGVOYW1lOnN0cmluZywgcHVibGljIHJlYWRvbmx5IHZhbHVlOk9iamVjdCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZ3JhbUV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZXhwcmVzc2lvbnM6RXhwcmVzc2lvbltdKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTYXlFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZXh0OnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0VmFyaWFibGVFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBpbnN0YW5jZU5hbWU6c3RyaW5nfHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB2YXJpYWJsZU5hbWU6c3RyaW5nLCBcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBldmFsdWF0aW9uRXhwcmVzc2lvbjpFeHByZXNzaW9uKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4vRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuL1doZW5EZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIGJhc2VUeXBlPzpUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uO1xyXG4gICAgZmllbGRzOkZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuICAgIGV2ZW50czpXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZVRva2VuOlRva2VuLCByZWFkb25seSBiYXNlVHlwZU5hbWVUb2tlbjpUb2tlbil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lVG9rZW4udmFsdWU7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB2YWx1ZTpzdHJpbmcsIHB1YmxpYyByZWFkb25seSBtZWFuaW5nOnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgYWN0b3I6c3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGV2ZW50S2luZDpzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgYWN0aW9uczpFeHByZXNzaW9uKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQdW5jdHVhdGlvbiB9IGZyb20gXCIuLi8uLi9sZXhpbmcvUHVuY3R1YXRpb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IEFjdGlvbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0FjdGlvbnNFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRXZlbnRFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIEV4cHJlc3Npb25WaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDpQYXJzZUNvbnRleHQpOkV4cHJlc3Npb257XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgYWN0aW9uczpFeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUoIWNvbnRleHQuaXMoS2V5d29yZHMuYW5kKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbiA9IHN1cGVyLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goYWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0U2VtaVRlcm1pbmF0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmFuZCk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlbik7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuc3RvcCk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQWN0aW9uc0V4cHJlc3Npb24oYWN0aW9ucyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgSWZFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0lmRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi8uLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgQ29udGFpbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0NvbnRhaW5zRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBTYXlFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1NheUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xleGluZy9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgU2V0VmFyaWFibGVFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1NldFZhcmlhYmxlRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBMaXRlcmFsRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9MaXRlcmFsRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBOdW1iZXJUeXBlIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvTnVtYmVyVHlwZVwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmlmKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgSWZFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuaXQpKXtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXQpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5jb250YWlucyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IGNvbnRleHQuZXhwZWN0TnVtYmVyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVOYW1lID0gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbnRhaW5zRXhwcmVzc2lvbihcIn5pdFwiLCBOdW1iZXIoY291bnQudmFsdWUpLCB0eXBlTmFtZS52YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLnNldCkpe1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5zZXQpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHZhcmlhYmxlTmFtZTpzdHJpbmc7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuU3RyaW5nKSl7XHJcbiAgICAgICAgICAgICAgICB2YXJpYWJsZU5hbWUgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpLnZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogU3VwcG9ydCBkZXJlZmVyZW5jaW5nIGFyYml0cmFyeSBpbnN0YW5jZXMuXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkN1cnJlbnRseSB1bmFibGUgdG8gZGVyZWZlcmVuY2UgYSBmaWVsZCwgcGxhbm5lZCBmb3IgYSBmdXR1cmUgcmVsZWFzZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudG8pO1xyXG5cclxuICAgICAgICAgICAgbGV0IHZhbHVlOk9iamVjdDtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmlzVHlwZU9mKFRva2VuVHlwZS5TdHJpbmcpKXtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gbmV3IExpdGVyYWxFeHByZXNzaW9uKFN0cmluZ1R5cGUudHlwZU5hbWUsIGNvbnRleHQuZXhwZWN0U3RyaW5nKCkudmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLk51bWJlcikpe1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBuZXcgTGl0ZXJhbEV4cHJlc3Npb24oTnVtYmVyVHlwZS50eXBlTmFtZSwgY29udGV4dC5leHBlY3ROdW1iZXIoKS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBTdXBwb3J0IGRlcmVmZXJlbmNpbmcgYXJiaXRyYXJ5IGluc3RhbmNlcy5cclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiQ3VycmVudCB1bmFibGUgdG8gc3VwcG9ydCBhc3NpZ25pbmcgZnJvbSBkZXJlZmVuY2VkIGluc3RhbmNlcywgcGxhbm5lZCBmb3IgYSBmdXR1cmUgcmVsZWFzZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTZXRWYXJpYWJsZUV4cHJlc3Npb24odW5kZWZpbmVkLCB2YXJpYWJsZU5hbWUsIHZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuc2F5KSl7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnNheSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU2F5RXhwcmVzc2lvbih0ZXh0LnZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLlN0cmluZykpe1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IExpdGVyYWxFeHByZXNzaW9uKFN0cmluZ1R5cGUudHlwZU5hbWUsIHZhbHVlLnZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byBwYXJzZSBleHByZXNzaW9uXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgQW5kRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9BbmRFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xleGluZy9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGaWVsZERlY2xhcmF0aW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuXHJcbiAgICAgICAgY29uc3QgZmllbGQgPSBuZXcgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24oKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXQpO1xyXG5cclxuICAgICAgICBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5pcykpe1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5pc0FueU9mKEtleXdvcmRzLm5vdCwgS2V5d29yZHMudmlzaWJsZSkpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzVmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMubm90KSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMubm90KTtcclxuICAgICAgICAgICAgICAgICAgICBpc1Zpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy52aXNpYmxlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaWVsZC5uYW1lID0gV29ybGRPYmplY3QudmlzaWJsZTtcclxuICAgICAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gQm9vbGVhblR5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBpc1Zpc2libGU7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMub2JzZXJ2ZWQpKXtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLm9ic2VydmVkKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmFzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBvYnNlcnZhdGlvbiA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IFdvcmxkT2JqZWN0Lm9ic2VydmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gb2JzZXJ2YXRpb24udmFsdWU7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmRlc2NyaWJlZCkpe1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuZGVzY3JpYmVkKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmFzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IFdvcmxkT2JqZWN0LmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gZGVzY3JpcHRpb24udmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbnRleHQuaXMoS2V5d29yZHMuYW5kKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYW5kKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHByZXNzaW9uVmlzaXRvciA9IG5ldyBFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVmdEV4cHJlc3Npb24gPSAoZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zLmxlbmd0aCA9PSAwKSA/IGZpZWxkIDogZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zW2ZpZWxkLmFzc29jaWF0ZWRFeHByZXNzaW9ucy5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29uY2F0ID0gbmV3IENvbmNhdGVuYXRpb25FeHByZXNzaW9uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmNhdC5sZWZ0ID0gbGVmdEV4cHJlc3Npb247XHJcbiAgICAgICAgICAgICAgICAgICAgY29uY2F0LnJpZ2h0ID0gZXhwcmVzc2lvbjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zLnB1c2goY29uY2F0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy53aGVyZSkpe1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMud2hlcmUpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnBsYXllcik7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5zdGFydHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBQbGFjZS5pc1BsYXllclN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBCb29sZWFuVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byBkZXRlcm1pbmUgcHJvcGVydHkgZmllbGRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuaGFzKSl7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5oYXMpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhhdCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmlzKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmlzVHlwZU9mKFRva2VuVHlwZS5TdHJpbmcpKXtcclxuICAgICAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gU3RyaW5nVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCkudmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuTnVtYmVyKSl7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IE51bWJlclR5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBjb250ZXh0LmV4cGVjdE51bWJlcigpLnZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYEV4cGVjdGVkIGEgc3RyaW5nIG9yIGEgbnVtYmVyIGJ1dCBmb3VuZCAnJHtjb250ZXh0LmN1cnJlbnRUb2tlbi52YWx1ZX0nYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmaWVsZC5uYW1lID0gbmFtZS52YWx1ZTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmNvbnRhaW5zKSl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5jb250YWlucyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IGNvbnRleHQuZXhwZWN0TnVtYmVyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBjb250ZXh0LmV4cGVjdElkZW50aWZpZXIoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRPRE86IFN1cHBvcnQgbXVsdGlwbGUgY29udGVudCBlbnRyaWVzLlxyXG5cclxuICAgICAgICAgICAgZmllbGQubmFtZSA9IFdvcmxkT2JqZWN0LmNvbnRlbnRzO1xyXG4gICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IExpc3QudHlwZU5hbWU7XHJcbiAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IFtbTnVtYmVyKGNvdW50LnZhbHVlKSwgbmFtZS52YWx1ZV1dOyBcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuY2FuKSl7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5jYW4pO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5yZWFjaCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnRoZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwbGFjZU5hbWUgPSBjb250ZXh0LmV4cGVjdElkZW50aWZpZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmJ5KTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuZ29pbmcpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBgfiR7ZGlyZWN0aW9uLnZhbHVlfWA7XHJcbiAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gU3RyaW5nVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gYCR7cGxhY2VOYW1lLnZhbHVlfWA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJVbmFibGUgdG8gZGV0ZXJtaW5lIGZpZWxkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZpZWxkO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgSWZFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0lmRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIElmRXhwcmVzc2lvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaWYpO1xyXG5cclxuICAgICAgICBjb25zdCBleHByZXNzaW9uVmlzaXRvciA9IG5ldyBFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbmFsID0gZXhwcmVzc2lvblZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnRoZW4pO1xyXG5cclxuICAgICAgICBjb25zdCBpZkJsb2NrID0gZXhwcmVzc2lvblZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmVsc2UpKXtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuZWxzZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBlbHNlQmxvY2sgPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgSWZFeHByZXNzaW9uKGNvbmRpdGlvbmFsLCBpZkJsb2NrLCBlbHNlQmxvY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBJZkV4cHJlc3Npb24oY29uZGl0aW9uYWwsIGlmQmxvY2ssIG5ldyBFeHByZXNzaW9uKCkpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFR5cGVEZWNsYXJhdGlvblZpc2l0b3IgfSBmcm9tIFwiLi9UeXBlRGVjbGFyYXRpb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFByb2dyYW1FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1Byb2dyYW1FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3IgfSBmcm9tIFwiLi9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFNheUV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vU2F5RXhwcmVzc2lvblZpc2l0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9ncmFtVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBsZXQgZXhwcmVzc2lvbnM6RXhwcmVzc2lvbltdID0gW107XHJcblxyXG4gICAgICAgIHdoaWxlKCFjb250ZXh0LmlzRG9uZSl7XHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLnVuZGVyc3RhbmQpKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbiA9IG5ldyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gdW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc0FueU9mKEtleXdvcmRzLmEsIEtleXdvcmRzLmFuKSl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlRGVjbGFyYXRpb24gPSBuZXcgVHlwZURlY2xhcmF0aW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHR5cGVEZWNsYXJhdGlvbi52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuc2F5KSl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzYXlFeHByZXNzaW9uID0gbmV3IFNheUV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gc2F5RXhwcmVzc2lvbi52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBdCB0aGUgdG9wIGxldmVsLCBhIHNheSBleHByZXNzaW9uIG11c3QgaGF2ZSBhIHRlcm1pbmF0b3IuIFdlJ3JlIGV2YWx1YXRpbmcgaXQgb3V0IGhlcmVcclxuICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgYSBzYXkgZXhwcmVzc2lvbiBub3JtYWxseSBkb2Vzbid0IHJlcXVpcmUgb25lLlxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0VGVybWluYXRvcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKGBGb3VuZCB1bmV4cGVjdGVkIHRva2VuICcke2NvbnRleHQuY3VycmVudFRva2VufSdgKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9ncmFtRXhwcmVzc2lvbihleHByZXNzaW9ucyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgU2F5RXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9TYXlFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2F5RXhwcmVzc2lvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuc2F5KTtcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgU2F5RXhwcmVzc2lvbih0ZXh0LnZhbHVlKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuLi8uLi9sZXhpbmcvVG9rZW5cIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25WaXNpdG9yIH0gZnJvbSBcIi4vRmllbGREZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9XaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFdoZW5EZWNsYXJhdGlvblZpc2l0b3IgfSBmcm9tIFwiLi9XaGVuRGVjbGFyYXRpb25WaXNpdG9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHlwZURlY2xhcmF0aW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdEFueU9mKEtleXdvcmRzLmEsIEtleXdvcmRzLmFuKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pcyk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYSk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMua2luZCk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMub2YpO1xyXG5cclxuICAgICAgICBjb25zdCBiYXNlVHlwZSA9IHRoaXMuZXhwZWN0QmFzZVR5cGUoY29udGV4dCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGZpZWxkczpGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbltdID0gW107XHJcblxyXG4gICAgICAgIHdoaWxlIChjb250ZXh0LmlzKEtleXdvcmRzLml0KSl7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkVmlzaXRvciA9IG5ldyBGaWVsZERlY2xhcmF0aW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9IGZpZWxkVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKDxGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbj5maWVsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBldmVudHM6V2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbltdID0gW107XHJcblxyXG4gICAgICAgIHdoaWxlIChjb250ZXh0LmlzKEtleXdvcmRzLndoZW4pKXtcclxuICAgICAgICAgICAgY29uc3Qgd2hlblZpc2l0b3IgPSBuZXcgV2hlbkRlY2xhcmF0aW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICBjb25zdCB3aGVuID0gd2hlblZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICBldmVudHMucHVzaCg8V2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbj53aGVuKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHR5cGVEZWNsYXJhdGlvbiA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKG5hbWUsIGJhc2VUeXBlKTtcclxuXHJcbiAgICAgICAgdHlwZURlY2xhcmF0aW9uLmZpZWxkcyA9IGZpZWxkcztcclxuICAgICAgICB0eXBlRGVjbGFyYXRpb24uZXZlbnRzID0gZXZlbnRzO1xyXG5cclxuICAgICAgICByZXR1cm4gdHlwZURlY2xhcmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZXhwZWN0QmFzZVR5cGUoY29udGV4dDpQYXJzZUNvbnRleHQpe1xyXG4gICAgICAgIGlmIChjb250ZXh0LmlzQW55T2YoS2V5d29yZHMucGxhY2UsIEtleXdvcmRzLml0ZW0sIEtleXdvcmRzLmRlY29yYXRpb24pKXtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0LmV4cGVjdElkZW50aWZpZXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy51bmRlcnN0YW5kKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmFzKTtcclxuXHJcbiAgICAgICAgY29uc3QgbWVhbmluZyA9IGNvbnRleHQuZXhwZWN0QW55T2YoS2V5d29yZHMuZGVzY3JpYmluZywgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2V5d29yZHMubW92aW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEtleXdvcmRzLmRpcmVjdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2V5d29yZHMudGFraW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEtleXdvcmRzLmludmVudG9yeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy5kcm9wcGluZyk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0VGVybWluYXRvcigpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb24odmFsdWUudmFsdWUsIG1lYW5pbmcudmFsdWUpOyAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZpc2l0b3J7XHJcbiAgICBhYnN0cmFjdCB2aXNpdChjb250ZXh0OlBhcnNlQ29udGV4dCk6RXhwcmVzc2lvbjtcclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1doZW5EZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgUHVuY3R1YXRpb24gfSBmcm9tIFwiLi4vLi4vbGV4aW5nL1B1bmN0dWF0aW9uXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgRXZlbnRFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0V2ZW50RXhwcmVzc2lvblZpc2l0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXaGVuRGVjbGFyYXRpb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLndoZW4pO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnRoZSk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMucGxheWVyKTtcclxuXHJcbiAgICAgICAgY29uc3QgZXZlbnRLaW5kID0gY29udGV4dC5leHBlY3RBbnlPZihLZXl3b3Jkcy5lbnRlcnMsIEtleXdvcmRzLmV4aXRzKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3RPcGVuTWV0aG9kQmxvY2soKTtcclxuXHJcbiAgICAgICAgY29uc3QgYWN0aW9uc1Zpc2l0b3IgPSBuZXcgRXZlbnRFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgIGNvbnN0IGFjdGlvbnMgPSBhY3Rpb25zVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uKEtleXdvcmRzLnBsYXllciwgZXZlbnRLaW5kLnZhbHVlLCBhY3Rpb25zKTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQcm9ncmFtRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1Byb2dyYW1FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4uL2xleGluZy9Ub2tlblwiO1xyXG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuVHlwZVwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uLy4uL3J1bnRpbWUvSU91dHB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uU2VtYW50aWNBbmFseXplcntcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFueSA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvckFueSwgVG9rZW4uZW1wdHkpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSB3b3JsZE9iamVjdCA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvcldvcmxkT2JqZWN0LCBUb2tlbi5mb3JBbnkpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBwbGFjZSA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvclBsYWNlLCBUb2tlbi5mb3JXb3JsZE9iamVjdCk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGl0ZW0gPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JJdGVtLCBUb2tlbi5mb3JXb3JsZE9iamVjdCk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGJvb2xlYW5UeXBlID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yQm9vbGVhbiwgVG9rZW4uZm9yQW55KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgbGlzdCA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvckxpc3QsIFRva2VuLmZvckFueSk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRlY29yYXRpb24gPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JEZWNvcmF0aW9uLCBUb2tlbi5mb3JXb3JsZE9iamVjdCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXQ6SU91dHB1dCl7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhbmFseXplKGV4cHJlc3Npb246RXhwcmVzc2lvbik6RXhwcmVzc2lvbntcclxuICAgICAgICBjb25zdCB0eXBlczpUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbdGhpcy5hbnksIHRoaXMud29ybGRPYmplY3QsIHRoaXMucGxhY2UsIHRoaXMuYm9vbGVhblR5cGUsIHRoaXMuaXRlbSwgdGhpcy5kZWNvcmF0aW9uXTtcclxuXHJcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBQcm9ncmFtRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2hpbGQgb2YgZXhwcmVzc2lvbi5leHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHlwZXNCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbj4odHlwZXMubWFwKHggPT4gW3gubmFtZSwgeF0pKTtcclxuXHJcbiAgICAgICAgZm9yKGNvbnN0IGRlY2xhcmF0aW9uIG9mIHR5cGVzKXtcclxuICAgICAgICAgICAgY29uc3QgYmFzZVRva2VuID0gZGVjbGFyYXRpb24uYmFzZVR5cGVOYW1lVG9rZW47XHJcblxyXG4gICAgICAgICAgICBpZiAoYmFzZVRva2VuLnR5cGUgPT0gVG9rZW5UeXBlLktleXdvcmQgJiYgIWJhc2VUb2tlbi52YWx1ZS5zdGFydHNXaXRoKFwiflwiKSl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gYH4ke2Jhc2VUb2tlbi52YWx1ZX1gO1xyXG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb24uYmFzZVR5cGUgPSB0eXBlc0J5TmFtZS5nZXQobmFtZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbi5iYXNlVHlwZSA9IHR5cGVzQnlOYW1lLmdldChiYXNlVG9rZW4udmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgZmllbGQgb2YgZGVjbGFyYXRpb24uZmllbGRzKXtcclxuICAgICAgICAgICAgICAgIGZpZWxkLnR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoZmllbGQudHlwZU5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZXhwcmVzc2lvbjtcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIEV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGV7XHJcbiAgICBOb25lLFxyXG4gICAgSWdub3JlUmVzdWx0c09mU2F5RXhwcmVzc2lvblxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBQcm9ncmFtRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1Byb2dyYW1FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9VbmRlcnN0YW5kaW5nXCI7XHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IEJvb2xlYW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQm9vbGVhblR5cGVcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0l0ZW1cIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxheWVyXCI7XHJcbmltcG9ydCB7IFNheUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9TYXlFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IFNheSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1NheVwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuLi8uLi9jb21tb24vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgUGFyYW1ldGVyIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9QYXJhbWV0ZXJcIjtcclxuaW1wb3J0IHsgSWZFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvSWZFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IENvbmNhdGVuYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29udGFpbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29udGFpbnNFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQWN0aW9uc0V4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9BY3Rpb25zRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgRXZlbnRUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9FdmVudFR5cGVcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZSB9IGZyb20gXCIuL0V4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGVcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi8uLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgU2V0VmFyaWFibGVFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2V0VmFyaWFibGVFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IExpdGVyYWxFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvTGl0ZXJhbEV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgRGVjb3JhdGlvbiB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0RlY29yYXRpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvblRyYW5zZm9ybWVye1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXQ6SU91dHB1dCl7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZVN5c3RlbVR5cGVzKCl7XHJcbiAgICAgICAgY29uc3QgdHlwZXM6VHlwZVtdID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVGhlc2UgYXJlIG9ubHkgaGVyZSBhcyBzdHVicyBmb3IgZXh0ZXJuYWwgcnVudGltZSB0eXBlcyB0aGF0IGFsbG93IHVzIHRvIGNvcnJlY3RseSByZXNvbHZlIGZpZWxkIHR5cGVzLlxyXG5cclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKEFueS50eXBlTmFtZSwgQW55LnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShXb3JsZE9iamVjdC50eXBlTmFtZSwgV29ybGRPYmplY3QucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFBsYWNlLnR5cGVOYW1lLCBQbGFjZS5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoQm9vbGVhblR5cGUudHlwZU5hbWUsIEJvb2xlYW5UeXBlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShTdHJpbmdUeXBlLnR5cGVOYW1lLCBTdHJpbmdUeXBlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShOdW1iZXJUeXBlLnR5cGVOYW1lLCBOdW1iZXJUeXBlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShJdGVtLnR5cGVOYW1lLCBJdGVtLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShMaXN0LnR5cGVOYW1lLCBMaXN0LnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShQbGF5ZXIudHlwZU5hbWUsIFBsYXllci5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoU2F5LnR5cGVOYW1lLCBTYXkucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKERlY29yYXRpb24udHlwZU5hbWUsIERlY29yYXRpb24ucGFyZW50VHlwZU5hbWUpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXA8c3RyaW5nLCBUeXBlPih0eXBlcy5tYXAoeCA9PiBbeC5uYW1lLCB4XSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybShleHByZXNzaW9uOkV4cHJlc3Npb24pOlR5cGVbXXtcclxuICAgICAgICBjb25zdCB0eXBlc0J5TmFtZSA9IHRoaXMuY3JlYXRlU3lzdGVtVHlwZXMoKTtcclxuICAgICAgICBsZXQgZHluYW1pY1R5cGVDb3VudCA9IDA7XHJcblxyXG4gICAgICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgUHJvZ3JhbUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBmb3IoY29uc3QgY2hpbGQgb2YgZXhwcmVzc2lvbi5leHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoYH4ke1VuZGVyc3RhbmRpbmcudHlwZU5hbWV9XyR7ZHluYW1pY1R5cGVDb3VudH1gLCBVbmRlcnN0YW5kaW5nLnR5cGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb24gPSBuZXcgRmllbGQoKTtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24ubmFtZSA9IFVuZGVyc3RhbmRpbmcuYWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5kZWZhdWx0VmFsdWUgPSBjaGlsZC52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVhbmluZyA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lYW5pbmcubmFtZSA9IFVuZGVyc3RhbmRpbmcubWVhbmluZztcclxuICAgICAgICAgICAgICAgICAgICBtZWFuaW5nLmRlZmF1bHRWYWx1ZSA9IGNoaWxkLm1lYW5pbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZS5maWVsZHMucHVzaChhY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUuZmllbGRzLnB1c2gobWVhbmluZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWNUeXBlQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZXNCeU5hbWUuc2V0KHR5cGUubmFtZSwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMudHJhbnNmb3JtSW5pdGlhbFR5cGVEZWNsYXJhdGlvbihjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZXNCeU5hbWUuc2V0KHR5cGUubmFtZSwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgY2hpbGQgb2YgZXhwcmVzc2lvbi5leHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gdHlwZXNCeU5hbWUuZ2V0KGNoaWxkLm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IoY29uc3QgZmllbGRFeHByZXNzaW9uIG9mIGNoaWxkLmZpZWxkcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZEV4cHJlc3Npb24ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBmaWVsZEV4cHJlc3Npb24udHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLnR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoZmllbGRFeHByZXNzaW9uLnR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZC50eXBlTmFtZSA9PSBTdHJpbmdUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IDxzdHJpbmc+ZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZU5hbWUgPT0gTnVtYmVyVHlwZS50eXBlTmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBOdW1iZXIoZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGVOYW1lID09IEJvb2xlYW5UeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IEJvb2xlYW4oZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IGZpZWxkRXhwcmVzc2lvbi5pbml0aWFsVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZEV4cHJlc3Npb24uYXNzb2NpYXRlZEV4cHJlc3Npb25zLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2V0RmllbGQgPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5uYW1lID0gYH5nZXRfJHtmaWVsZC5uYW1lfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5wYXJhbWV0ZXJzLnB1c2gobmV3IFBhcmFtZXRlcihcIn52YWx1ZVwiLCBmaWVsZC50eXBlTmFtZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RmllbGQucmV0dXJuVHlwZSA9IGZpZWxkLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IoY29uc3QgYXNzb2NpYXRlZCBvZiBmaWVsZEV4cHJlc3Npb24uYXNzb2NpYXRlZEV4cHJlc3Npb25zKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5ib2R5LnB1c2goLi4udGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGFzc29jaWF0ZWQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5ib2R5LnB1c2goSW5zdHJ1Y3Rpb24ucmV0dXJuKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/Lm1ldGhvZHMucHVzaChnZXRGaWVsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/LmZpZWxkcy5wdXNoKGZpZWxkKTsgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpc1dvcmxkT2JqZWN0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgY3VycmVudCA9IHR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSB0eXBlc0J5TmFtZS5nZXQoY3VycmVudC5iYXNlVHlwZU5hbWUpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Lm5hbWUgPT0gV29ybGRPYmplY3QudHlwZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzV29ybGRPYmplY3QgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1dvcmxkT2JqZWN0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzY3JpYmUgPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaWJlLm5hbWUgPSBXb3JsZE9iamVjdC5kZXNjcmliZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpYmUuYm9keS5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRQcm9wZXJ0eShXb3JsZE9iamVjdC52aXNpYmxlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlSWZGYWxzZSgzKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkUHJvcGVydHkoV29ybGRPYmplY3QuZGVzY3JpcHRpb24pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLnJldHVybigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5tZXRob2RzLnB1c2goZGVzY3JpYmUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2JzZXJ2ZSA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZS5uYW1lID0gV29ybGRPYmplY3Qub2JzZXJ2ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZS5ib2R5LnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFByb3BlcnR5KFdvcmxkT2JqZWN0LnZpc2libGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmVJZkZhbHNlKDMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRQcm9wZXJ0eShXb3JsZE9iamVjdC5vYnNlcnZhdGlvbiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucmV0dXJuKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/Lm1ldGhvZHMucHVzaChvYnNlcnZlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdHlwZT8uZmllbGRzLmZpbmQoeCA9PiB4Lm5hbWUgPT0gV29ybGRPYmplY3QudmlzaWJsZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmlzaWJsZSA9IG5ldyBGaWVsZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGUubmFtZSA9IFdvcmxkT2JqZWN0LnZpc2libGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlLnR5cGVOYW1lID0gQm9vbGVhblR5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlLmRlZmF1bHRWYWx1ZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8uZmllbGRzLnB1c2godmlzaWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdHlwZT8uZmllbGRzLmZpbmQoeCA9PiB4Lm5hbWUgPT0gV29ybGRPYmplY3QuY29udGVudHMpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRzID0gbmV3IEZpZWxkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudHMubmFtZSA9IFdvcmxkT2JqZWN0LmNvbnRlbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudHMudHlwZU5hbWUgPSBMaXN0LnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudHMuZGVmYXVsdFZhbHVlID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8uZmllbGRzLnB1c2goY29udGVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXR5cGU/LmZpZWxkcy5maW5kKHggPT4geC5uYW1lID09IFdvcmxkT2JqZWN0Lm9ic2VydmF0aW9uKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvYnNlcnZhdGlvbiA9IG5ldyBGaWVsZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmF0aW9uLm5hbWUgPSBXb3JsZE9iamVjdC5vYnNlcnZhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmF0aW9uLnR5cGVOYW1lID0gU3RyaW5nVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmF0aW9uLmRlZmF1bHRWYWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8uZmllbGRzLnB1c2gob2JzZXJ2YXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZHVwbGljYXRlRXZlbnRDb3VudCA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIGNoaWxkLmV2ZW50cyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXRob2QgPSBuZXcgTWV0aG9kKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLm5hbWUgPSBgfmV2ZW50XyR7ZXZlbnQuYWN0b3J9XyR7ZXZlbnQuZXZlbnRLaW5kfV8ke2R1cGxpY2F0ZUV2ZW50Q291bnR9YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5ldmVudFR5cGUgPSB0aGlzLnRyYW5zZm9ybUV2ZW50S2luZChldmVudC5ldmVudEtpbmQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cGxpY2F0ZUV2ZW50Q291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb25zID0gPEFjdGlvbnNFeHByZXNzaW9uPmV2ZW50LmFjdGlvbnM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGNvbnN0IGFjdGlvbiBvZiBhY3Rpb25zLmFjdGlvbnMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oYWN0aW9uLCBFeHByZXNzaW9uVHJhbnNmb3JtYXRpb25Nb2RlLklnbm9yZVJlc3VsdHNPZlNheUV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5ib2R5LnB1c2goLi4uYm9keSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmJvZHkucHVzaChJbnN0cnVjdGlvbi5yZXR1cm4oKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8ubWV0aG9kcy5wdXNoKG1ldGhvZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBnbG9iYWxTYXlzID0gZXhwcmVzc2lvbi5leHByZXNzaW9ucy5maWx0ZXIoeCA9PiB4IGluc3RhbmNlb2YgU2F5RXhwcmVzc2lvbik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoYH5nbG9iYWxTYXlzYCwgU2F5LnR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1ldGhvZCA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICAgICAgbWV0aG9kLm5hbWUgPSBTYXkudHlwZU5hbWU7XHJcbiAgICAgICAgICAgIG1ldGhvZC5wYXJhbWV0ZXJzID0gW107XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbnN0cnVjdGlvbnM6SW5zdHJ1Y3Rpb25bXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IHNheSBvZiBnbG9iYWxTYXlzKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNheUV4cHJlc3Npb24gPSA8U2F5RXhwcmVzc2lvbj5zYXk7XHJcblxyXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhzYXlFeHByZXNzaW9uLnRleHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KClcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLnJldHVybigpKTtcclxuXHJcbiAgICAgICAgICAgIG1ldGhvZC5ib2R5ID0gaW5zdHJ1Y3Rpb25zO1xyXG5cclxuICAgICAgICAgICAgdHlwZS5tZXRob2RzLnB1c2gobWV0aG9kKTtcclxuXHJcbiAgICAgICAgICAgIHR5cGVzQnlOYW1lLnNldCh0eXBlLm5hbWUsIHR5cGUpOyAgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJVbmFibGUgdG8gcGFydGlhbGx5IHRyYW5zZm9ybVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMub3V0LndyaXRlKGBDcmVhdGVkICR7dHlwZXNCeU5hbWUuc2l6ZX0gdHlwZXMuLi5gKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0eXBlc0J5TmFtZS52YWx1ZXMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm1FdmVudEtpbmQoa2luZDpzdHJpbmcpe1xyXG4gICAgICAgIHN3aXRjaChraW5kKXtcclxuICAgICAgICAgICAgY2FzZSBLZXl3b3Jkcy5lbnRlcnM6e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEV2ZW50VHlwZS5QbGF5ZXJFbnRlcnNQbGFjZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIEtleXdvcmRzLmV4aXRzOntcclxuICAgICAgICAgICAgICAgIHJldHVybiBFdmVudFR5cGUuUGxheWVyRXhpdHNQbGFjZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OntcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKGBVbmFibGUgdG8gdHJhbnNmb3JtIHVuc3VwcG9ydGVkIGV2ZW50IGtpbmQgJyR7a2luZH0nYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb246RXhwcmVzc2lvbiwgbW9kZT86RXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZSl7XHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25zOkluc3RydWN0aW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBJZkV4cHJlc3Npb24peyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb25hbCA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmNvbmRpdGlvbmFsLCBtb2RlKTtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goLi4uY29uZGl0aW9uYWwpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaWZCbG9jayA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmlmQmxvY2ssIG1vZGUpO1xyXG4gICAgICAgICAgICBjb25zdCBlbHNlQmxvY2sgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5lbHNlQmxvY2ssIG1vZGUpO1xyXG5cclxuICAgICAgICAgICAgaWZCbG9jay5wdXNoKEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlKGVsc2VCbG9jay5sZW5ndGgpKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlSWZGYWxzZShpZkJsb2NrLmxlbmd0aCkpXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmlmQmxvY2spO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5lbHNlQmxvY2spO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIFNheUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGV4cHJlc3Npb24udGV4dCkpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5wcmludCgpKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtb2RlICE9IEV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGUuSWdub3JlUmVzdWx0c09mU2F5RXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGV4cHJlc3Npb24udGV4dCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgQ29udGFpbnNFeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkTnVtYmVyKGV4cHJlc3Npb24uY291bnQpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhleHByZXNzaW9uLnR5cGVOYW1lKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRJbnN0YW5jZShleHByZXNzaW9uLnRhcmdldE5hbWUpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEZpZWxkKFdvcmxkT2JqZWN0LmNvbnRlbnRzKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmluc3RhbmNlQ2FsbChMaXN0LmNvbnRhaW5zKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBDb25jYXRlbmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5sZWZ0ISwgbW9kZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24ucmlnaHQhLCBtb2RlKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmxlZnQpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5yaWdodCk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmNvbmNhdGVuYXRlKCkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEZpZWxkKGV4cHJlc3Npb24ubmFtZSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBTZXRWYXJpYWJsZUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBjb25zdCByaWdodCA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmV2YWx1YXRpb25FeHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgLi4ucmlnaHQsXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEZpZWxkKGV4cHJlc3Npb24udmFyaWFibGVOYW1lKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmFzc2lnbigpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgTGl0ZXJhbEV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpZiAoZXhwcmVzc2lvbi50eXBlTmFtZSA9PSBTdHJpbmdUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmxvYWRTdHJpbmcoPHN0cmluZz5leHByZXNzaW9uLnZhbHVlKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbi50eXBlTmFtZSA9PSBOdW1iZXJUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmxvYWROdW1iZXIoTnVtYmVyKGV4cHJlc3Npb24udmFsdWUpKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgVW5hYmxlIHRvIHRyYW5zZm9ybSB1bnN1cHBvcnRlZCBsaXRlcmFsIGV4cHJlc3Npb24gJyR7ZXhwcmVzc2lvbn0nYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byB0cmFuc2Zvcm0gdW5zdXBwb3J0ZWQgZXhwcmVzc2lvblwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVjdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm1Jbml0aWFsVHlwZURlY2xhcmF0aW9uKGV4cHJlc3Npb246VHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUeXBlKGV4cHJlc3Npb24ubmFtZSwgZXhwcmVzc2lvbi5iYXNlVHlwZSEubmFtZSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHRlcm5DYWxsIH0gZnJvbSBcIi4vRXh0ZXJuQ2FsbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFueXsgICAgICAgIFxyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWU6c3RyaW5nID0gXCJ+YW55XCI7ICBcclxuICAgIFxyXG4gICAgc3RhdGljIG1haW4gPSBcIn5tYWluXCI7XHJcbiAgICBzdGF0aWMgZXh0ZXJuVG9TdHJpbmcgPSBFeHRlcm5DYWxsLm9mKFwifnRvU3RyaW5nXCIpO1xyXG59XHJcbiIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJvb2xlYW5UeXBle1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+Ym9vbGVhblwiO1xyXG59IiwiaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi9Xb3JsZE9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlY29yYXRpb257XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC50eXBlTmFtZTtcclxuICAgIHN0YXRpYyB0eXBlTmFtZSA9IFwifmRlY29yYXRpb25cIjtcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlbGVnYXRle1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+ZGVsZWdhdGVcIjtcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxufSIsImV4cG9ydCBjbGFzcyBFbnRyeVBvaW50QXR0cmlidXRle1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIn5lbnRyeVBvaW50XCI7XHJcbn0iLCJleHBvcnQgY2xhc3MgRXh0ZXJuQ2FsbHtcclxuICAgIHN0YXRpYyBvZihuYW1lOnN0cmluZywgLi4uYXJnczpzdHJpbmdbXSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFeHRlcm5DYWxsKG5hbWUsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIGFyZ3M6c3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOnN0cmluZywgLi4uYXJnczpzdHJpbmdbXSl7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi9Xb3JsZE9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEl0ZW17XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWUgPSBcIn5pdGVtXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC50eXBlTmFtZTtcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExpc3R7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWUgPSBcIn5saXN0XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNvbnRhaW5zID0gXCJ+Y29udGFpbnNcIjtcclxuXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWVQYXJhbWV0ZXIgPSBcIn50eXBlTmFtZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNvdW50UGFyYW1ldGVyID0gXCJ+Y291bnRcIjtcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE51bWJlclR5cGV7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWUgPSBcIn5udW1iZXJcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxufSIsImltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vV29ybGRPYmplY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGFjZSB7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC50eXBlTmFtZTtcclxuICAgIHN0YXRpYyB0eXBlTmFtZSA9IFwifnBsYWNlXCI7XHJcblxyXG4gICAgc3RhdGljIGlzUGxheWVyU3RhcnQgPSBcIn5pc1BsYXllclN0YXJ0XCI7XHJcbn0iLCJpbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuL1dvcmxkT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVye1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lID0gXCJ+cGxheWVyXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC50eXBlTmFtZTsgICAgXHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTYXl7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWUgPSBcIn5zYXlcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0cmluZ1R5cGV7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn5zdHJpbmdcIjtcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVuZGVyc3RhbmRpbmd7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn51bmRlcnN0YW5kaW5nXCI7XHJcblxyXG4gICAgc3RhdGljIGRlc2NyaWJpbmcgPSBcIn5kZXNjcmliaW5nXCI7ICBcclxuICAgIHN0YXRpYyBtb3ZpbmcgPSBcIn5tb3ZpbmdcIjtcclxuICAgIHN0YXRpYyBkaXJlY3Rpb24gPSBcIn5kaXJlY3Rpb25cIjtcclxuICAgIHN0YXRpYyB0YWtpbmcgPSBcIn50YWtpbmdcIjtcclxuICAgIHN0YXRpYyBpbnZlbnRvcnkgPSBcIn5pbnZlbnRvcnlcIjtcclxuICAgIHN0YXRpYyBkcm9wcGluZyA9IFwifmRyb3BwaW5nXCI7XHJcblxyXG4gICAgc3RhdGljIGFjdGlvbiA9IFwifmFjdGlvblwiO1xyXG4gICAgc3RhdGljIG1lYW5pbmcgPSBcIn5tZWFuaW5nXCI7ICBcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkT2JqZWN0IHtcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHN0YXRpYyB0eXBlTmFtZSA9IFwifndvcmxkT2JqZWN0XCI7XHJcblxyXG4gICAgc3RhdGljIGRlc2NyaXB0aW9uID0gXCJ+ZGVzY3JpcHRpb25cIjtcclxuICAgIHN0YXRpYyBjb250ZW50cyA9IFwifmNvbnRlbnRzXCI7ICAgIFxyXG4gICAgc3RhdGljIG9ic2VydmF0aW9uID0gXCJ+b2JzZXJ2YXRpb25cIjtcclxuXHJcbiAgICBzdGF0aWMgZGVzY3JpYmUgPSBcIn5kZXNjcmliZVwiO1xyXG4gICAgc3RhdGljIG9ic2VydmUgPSBcIn5vYnNlcnZlXCI7XHJcbiAgICBcclxuICAgIHN0YXRpYyB2aXNpYmxlID0gXCJ+dmlzaWJsZVwiO1xyXG59IiwiaW1wb3J0IHsgVGFsb25JZGUgfSBmcm9tIFwiLi9UYWxvbklkZVwiO1xyXG5cclxuXHJcbnZhciBpZGUgPSBuZXcgVGFsb25JZGUoKTsiLCJleHBvcnQgZW51bSBFdmFsdWF0aW9uUmVzdWx0e1xyXG4gICAgQ29udGludWUsXHJcbiAgICBTdXNwZW5kRm9ySW5wdXRcclxufSIsImltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBTdGFja0ZyYW1lIH0gZnJvbSBcIi4vU3RhY2tGcmFtZVwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuLi9jb21tb24vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWV0aG9kQWN0aXZhdGlvbntcclxuICAgIG1ldGhvZD86TWV0aG9kO1xyXG4gICAgc3RhY2tGcmFtZTpTdGFja0ZyYW1lO1xyXG4gICAgc3RhY2s6UnVudGltZUFueVtdID0gW107XHJcblxyXG4gICAgc3RhY2tTaXplKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2subGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHBlZWsoKXtcclxuICAgICAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFN0YWNrIEltYmFsYW5jZSEgQXR0ZW1wdGVkIHRvIHBlZWsgYW4gZW1wdHkgc3RhY2suYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5zdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIDFdO1xyXG4gICAgfVxyXG5cclxuICAgIHBvcCgpe1xyXG4gICAgICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgU3RhY2sgSW1iYWxhbmNlISBBdHRlbXB0ZWQgdG8gcG9wIGFuIGVtcHR5IHN0YWNrLmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2sucG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVzaChydW50aW1lQW55OlJ1bnRpbWVBbnkpe1xyXG4gICAgICAgIHRoaXMuc3RhY2sucHVzaChydW50aW1lQW55KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXRob2Q6TWV0aG9kKXtcclxuICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcclxuICAgICAgICB0aGlzLnN0YWNrRnJhbWUgPSBuZXcgU3RhY2tGcmFtZShtZXRob2QpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgT3BDb2RlSGFuZGxlcntcclxuICAgIGNvZGU6T3BDb2RlID0gT3BDb2RlLk5vT3A7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIHJldHVybiBFdmFsdWF0aW9uUmVzdWx0LkNvbnRpbnVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vTWV0aG9kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhY2tGcmFtZXtcclxuICAgIGxvY2FsczpWYXJpYWJsZVtdID0gW107XHJcbiAgICBjdXJyZW50SW5zdHJ1Y3Rpb246bnVtYmVyID0gLTE7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWV0aG9kOk1ldGhvZCl7XHJcbiAgICAgICAgZm9yKHZhciBwYXJhbWV0ZXIgb2YgbWV0aG9kLnBhcmFtZXRlcnMpe1xyXG4gICAgICAgICAgICBjb25zdCB2YXJpYWJsZSA9IG5ldyBWYXJpYWJsZShwYXJhbWV0ZXIubmFtZSwgcGFyYW1ldGVyLnR5cGUhKTtcclxuICAgICAgICAgICAgdGhpcy5sb2NhbHMucHVzaCh2YXJpYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgRW50cnlQb2ludEF0dHJpYnV0ZSB9IGZyb20gXCIuLi9saWJyYXJ5L0VudHJ5UG9pbnRBdHRyaWJ1dGVcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi9NZXRob2RBY3RpdmF0aW9uXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFByaW50SGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1ByaW50SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4vSU91dHB1dFwiO1xyXG5pbXBvcnQgeyBOb09wSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL05vT3BIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRTdHJpbmdIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZFN0cmluZ0hhbmRsZXJcIjtcclxuaW1wb3J0IHsgTmV3SW5zdGFuY2VIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTmV3SW5zdGFuY2VIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVDb21tYW5kIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lQ29tbWFuZFwiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IFJlYWRJbnB1dEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9SZWFkSW5wdXRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29tbWFuZEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9QYXJzZUNvbW1hbmRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEdvVG9IYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvR29Ub0hhbmRsZXJcIjtcclxuaW1wb3J0IHsgSGFuZGxlQ29tbWFuZEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9IYW5kbGVDb21tYW5kSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGFjZSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZVBsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVCb29sZWFuIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lQm9vbGVhblwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgU2F5IH0gZnJvbSBcIi4uL2xpYnJhcnkvU2F5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFbXB0eSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZUVtcHR5XCI7XHJcbmltcG9ydCB7IFJldHVybkhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9SZXR1cm5IYW5kbGVyXCI7XHJcbmltcG9ydCB7IFN0YXRpY0NhbGxIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvU3RhdGljQ2FsbEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxheWVyIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lUGxheWVyXCI7XHJcbmltcG9ydCB7IExvYWRJbnN0YW5jZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkSW5zdGFuY2VIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWROdW1iZXJIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZE51bWJlckhhbmRsZXJcIjtcclxuaW1wb3J0IHsgSW5zdGFuY2VDYWxsSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0luc3RhbmNlQ2FsbEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZFByb3BlcnR5SGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRQcm9wZXJ0eUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZEZpZWxkSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRGaWVsZEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgRXh0ZXJuYWxDYWxsSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0V4dGVybmFsQ2FsbEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZExvY2FsSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRMb2NhbEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgSUxvZ091dHB1dCB9IGZyb20gXCIuL0lMb2dPdXRwdXRcIjtcclxuaW1wb3J0IHsgTG9hZFRoaXNIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZFRoaXNIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEJyYW5jaFJlbGF0aXZlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0JyYW5jaFJlbGF0aXZlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBCcmFuY2hSZWxhdGl2ZUlmRmFsc2VIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBDb25jYXRlbmF0ZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Db25jYXRlbmF0ZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgQXNzaWduVmFyaWFibGVIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvQXNzaWduVmFyaWFibGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFR5cGVPZkhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9UeXBlT2ZIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEludm9rZURlbGVnYXRlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0ludm9rZURlbGVnYXRlSGFuZGxlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uUnVudGltZXtcclxuXHJcbiAgICBwcml2YXRlIHRocmVhZD86VGhyZWFkO1xyXG4gICAgcHJpdmF0ZSBoYW5kbGVyczpNYXA8T3BDb2RlLCBPcENvZGVIYW5kbGVyPiA9IG5ldyBNYXA8T3BDb2RlLCBPcENvZGVIYW5kbGVyPigpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdXNlck91dHB1dDpJT3V0cHV0LCBwcml2YXRlIHJlYWRvbmx5IGxvZ091dHB1dD86SUxvZ091dHB1dCl7XHJcbiAgICAgICAgdGhpcy51c2VyT3V0cHV0ID0gdXNlck91dHB1dDtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLk5vT3AsIG5ldyBOb09wSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTG9hZFN0cmluZywgbmV3IExvYWRTdHJpbmdIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5QcmludCwgbmV3IFByaW50SGFuZGxlcih0aGlzLnVzZXJPdXRwdXQpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTmV3SW5zdGFuY2UsIG5ldyBOZXdJbnN0YW5jZUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLlJlYWRJbnB1dCwgbmV3IFJlYWRJbnB1dEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLlBhcnNlQ29tbWFuZCwgbmV3IFBhcnNlQ29tbWFuZEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkhhbmRsZUNvbW1hbmQsIG5ldyBIYW5kbGVDb21tYW5kSGFuZGxlcih0aGlzLnVzZXJPdXRwdXQpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuR29UbywgbmV3IEdvVG9IYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5SZXR1cm4sIG5ldyBSZXR1cm5IYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5TdGF0aWNDYWxsLCBuZXcgU3RhdGljQ2FsbEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRJbnN0YW5jZSwgbmV3IExvYWRJbnN0YW5jZUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWROdW1iZXIsIG5ldyBMb2FkTnVtYmVySGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuSW5zdGFuY2VDYWxsLCBuZXcgSW5zdGFuY2VDYWxsSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTG9hZFByb3BlcnR5LCBuZXcgTG9hZFByb3BlcnR5SGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTG9hZEZpZWxkLCBuZXcgTG9hZEZpZWxkSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuRXh0ZXJuYWxDYWxsLCBuZXcgRXh0ZXJuYWxDYWxsSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTG9hZExvY2FsLCBuZXcgTG9hZExvY2FsSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTG9hZFRoaXMsIG5ldyBMb2FkVGhpc0hhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkJyYW5jaFJlbGF0aXZlLCBuZXcgQnJhbmNoUmVsYXRpdmVIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5CcmFuY2hSZWxhdGl2ZUlmRmFsc2UsIG5ldyBCcmFuY2hSZWxhdGl2ZUlmRmFsc2VIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Db25jYXRlbmF0ZSwgbmV3IENvbmNhdGVuYXRlSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuQXNzaWduLCBuZXcgQXNzaWduVmFyaWFibGVIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5UeXBlT2YsIG5ldyBUeXBlT2ZIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5JbnZva2VEZWxlZ2F0ZSwgbmV3IEludm9rZURlbGVnYXRlSGFuZGxlcigpKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydCgpe1xyXG4gICAgICAgIGlmICh0aGlzLnRocmVhZD8uYWxsVHlwZXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICB0aGlzLnRocmVhZC5sb2c/LmRlYnVnKFwiVW5hYmxlIHRvIHN0YXJ0IHJ1bnRpbWUgd2l0aG91dCB0eXBlcy5cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBsYWNlcyA9IHRoaXMudGhyZWFkPy5hbGxUeXBlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHggPT4geC5iYXNlVHlwZU5hbWUgPT0gUGxhY2UudHlwZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoeCA9PiA8UnVudGltZVBsYXllcj5NZW1vcnkuYWxsb2NhdGUoeCkpO1xyXG5cclxuICAgICAgICBjb25zdCBnZXRQbGF5ZXJTdGFydCA9IChwbGFjZTpSdW50aW1lUGxhY2UpID0+IDxSdW50aW1lQm9vbGVhbj4ocGxhY2UuZmllbGRzLmdldChQbGFjZS5pc1BsYXllclN0YXJ0KT8udmFsdWUpO1xyXG4gICAgICAgIGNvbnN0IGlzUGxheWVyU3RhcnQgPSAocGxhY2U6UnVudGltZVBsYWNlKSA9PiBnZXRQbGF5ZXJTdGFydChwbGFjZSk/LnZhbHVlID09PSB0cnVlO1xyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50UGxhY2UgPSBwbGFjZXM/LmZpbmQoaXNQbGF5ZXJTdGFydCk7XHJcblxyXG4gICAgICAgIHRoaXMudGhyZWFkIS5jdXJyZW50UGxhY2UgPSBjdXJyZW50UGxhY2U7XHJcblxyXG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMudGhyZWFkPy5rbm93blR5cGVzLmdldChQbGF5ZXIudHlwZU5hbWUpITtcclxuXHJcbiAgICAgICAgdGhpcy50aHJlYWQhLmN1cnJlbnRQbGF5ZXIgPSA8UnVudGltZVBsYXllcj5NZW1vcnkuYWxsb2NhdGUocGxheWVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5ydW5XaXRoKFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZyb20odHlwZXM6VHlwZVtdKXtcclxuICAgICAgICBpZiAodHlwZXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICB0aGlzLmxvZ091dHB1dD8uZGVidWcoXCJObyB0eXBlcyB3ZXJlIHByb3ZpZGVkLCB1bmFibGUgdG8gbG9hZCBydW50aW1lIVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbG9hZGVkVHlwZXMgPSBNZW1vcnkubG9hZFR5cGVzKHR5cGVzKTtcclxuXHJcbiAgICAgICAgY29uc3QgZW50cnlQb2ludCA9IGxvYWRlZFR5cGVzLmZpbmQoeCA9PiB4LmF0dHJpYnV0ZXMuZmluZEluZGV4KGF0dHJpYnV0ZSA9PiBhdHRyaWJ1dGUgaW5zdGFuY2VvZiBFbnRyeVBvaW50QXR0cmlidXRlKSA+IC0xKTtcclxuICAgICAgICBjb25zdCBtYWluTWV0aG9kID0gZW50cnlQb2ludD8ubWV0aG9kcy5maW5kKHggPT4geC5uYW1lID09IEFueS5tYWluKTsgICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRpb24gPSBuZXcgTWV0aG9kQWN0aXZhdGlvbihtYWluTWV0aG9kISk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50aHJlYWQgPSBuZXcgVGhyZWFkKGxvYWRlZFR5cGVzLCBhY3RpdmF0aW9uKTsgIFxyXG4gICAgICAgIHRoaXMudGhyZWFkLmxvZyA9IHRoaXMubG9nT3V0cHV0OyAgICAgIFxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZW5kQ29tbWFuZChpbnB1dDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMucnVuV2l0aChpbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBydW5XaXRoKGNvbW1hbmQ6c3RyaW5nKXtcclxuICAgICAgICBcclxuICAgICAgICAvLyBXZSdyZSBnb2luZyB0byBrZWVwIHRoZWlyIGNvbW1hbmQgaW4gdGhlIHZpc3VhbCBoaXN0b3J5IHRvIG1ha2UgdGhpbmdzIGVhc2llciB0byB1bmRlcnN0YW5kLlxyXG5cclxuICAgICAgICB0aGlzLnVzZXJPdXRwdXQud3JpdGUoY29tbWFuZCk7XHJcblxyXG4gICAgICAgIC8vIE5vdyB3ZSBjYW4gZ28gYWhlYWQgYW5kIHByb2Nlc3MgdGhlaXIgY29tbWFuZC5cclxuXHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSB0aGlzLnRocmVhZCEuY3VycmVudEluc3RydWN0aW9uO1xyXG5cclxuICAgICAgICBpZiAoaW5zdHJ1Y3Rpb24/Lm9wQ29kZSA9PSBPcENvZGUuUmVhZElucHV0KXtcclxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhjb21tYW5kKTtcclxuICAgICAgICAgICAgdGhpcy50aHJlYWQ/LmN1cnJlbnRNZXRob2QucHVzaCh0ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGhyZWFkPy5tb3ZlTmV4dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMudGhyZWFkPy5jdXJyZW50SW5zdHJ1Y3Rpb24gPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhpcy50aHJlYWQ/Lm1vdmVOZXh0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50aHJlYWQ/LmN1cnJlbnRJbnN0cnVjdGlvbiA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGV4ZWN1dGUgY29tbWFuZCwgbm8gaW5zdHJ1Y3Rpb24gZm91bmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaW5zdHJ1Y3Rpb24gPSB0aGlzLmV2YWx1YXRlQ3VycmVudEluc3RydWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbiA9PSBFdmFsdWF0aW9uUmVzdWx0LkNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24gPSB0aGlzLmV2YWx1YXRlQ3VycmVudEluc3RydWN0aW9uKCkpe1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudGhyZWFkPy5tb3ZlTmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaChleCl7XHJcbiAgICAgICAgICAgIGlmIChleCBpbnN0YW5jZW9mIFJ1bnRpbWVFcnJvcil7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ091dHB1dD8uZGVidWcoYFJ1bnRpbWUgRXJyb3I6ICR7ZXgubWVzc2FnZX1gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nT3V0cHV0Py5kZWJ1ZyhgU3RhY2sgVHJhY2U6ICR7ZXguc3RhY2t9YCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ091dHB1dD8uZGVidWcoYEVuY291bnRlcmVkIHVuaGFuZGxlZCBlcnJvcjogJHtleH1gKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBldmFsdWF0ZUN1cnJlbnRJbnN0cnVjdGlvbigpe1xyXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uID0gdGhpcy50aHJlYWQ/LmN1cnJlbnRJbnN0cnVjdGlvbjtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHRoaXMuaGFuZGxlcnMuZ2V0KGluc3RydWN0aW9uPy5vcENvZGUhKTtcclxuXHJcbiAgICAgICAgaWYgKGhhbmRsZXIgPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgRW5jb3VudGVyZWQgdW5zdXBwb3J0ZWQgT3BDb2RlICcke2luc3RydWN0aW9uPy5vcENvZGV9J2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gaGFuZGxlcj8uaGFuZGxlKHRoaXMudGhyZWFkISk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9VbmRlcnN0YW5kaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGFjZSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZVBsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGF5ZXIgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZUVtcHR5IH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lRW1wdHlcIjtcclxuaW1wb3J0IHsgSUxvZ091dHB1dCB9IGZyb20gXCIuL0lMb2dPdXRwdXRcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9NZXRob2RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUaHJlYWR7XHJcbiAgICBhbGxUeXBlczpUeXBlW10gPSBbXTtcclxuICAgIGtub3duVHlwZXM6TWFwPHN0cmluZywgVHlwZT4gPSBuZXcgTWFwPHN0cmluZywgVHlwZT4oKTtcclxuICAgIGtub3duVW5kZXJzdGFuZGluZ3M6VHlwZVtdID0gW107XHJcbiAgICBrbm93blBsYWNlczpSdW50aW1lUGxhY2VbXSA9IFtdO1xyXG4gICAgbWV0aG9kczpNZXRob2RBY3RpdmF0aW9uW10gPSBbXTtcclxuICAgIGN1cnJlbnRQbGFjZT86UnVudGltZVBsYWNlO1xyXG4gICAgY3VycmVudFBsYXllcj86UnVudGltZVBsYXllcjtcclxuICAgIGxvZz86SUxvZ091dHB1dDtcclxuICAgIFxyXG4gICAgZ2V0IGN1cnJlbnRNZXRob2QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWV0aG9kc1t0aGlzLm1ldGhvZHMubGVuZ3RoIC0gMV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnJlbnRJbnN0cnVjdGlvbigpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gdGhpcy5jdXJyZW50TWV0aG9kO1xyXG4gICAgICAgIHJldHVybiBhY3RpdmF0aW9uLm1ldGhvZD8uYm9keVthY3RpdmF0aW9uLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uXTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlczpUeXBlW10sIG1ldGhvZDpNZXRob2RBY3RpdmF0aW9uKXtcclxuICAgICAgICB0aGlzLmFsbFR5cGVzID0gdHlwZXM7XHJcbiAgICAgICAgdGhpcy5rbm93blR5cGVzID0gbmV3IE1hcDxzdHJpbmcsIFR5cGU+KHR5cGVzLm1hcCh0eXBlID0+IFt0eXBlLm5hbWUsIHR5cGVdKSk7XHJcbiAgICAgICAgdGhpcy5rbm93blVuZGVyc3RhbmRpbmdzID0gdHlwZXMuZmlsdGVyKHggPT4geC5iYXNlVHlwZU5hbWUgPT09IFVuZGVyc3RhbmRpbmcudHlwZU5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5wdXNoKG1ldGhvZCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aXZhdGVNZXRob2QobWV0aG9kOk1ldGhvZCl7XHJcbiAgICAgICAgY29uc3QgYWN0aXZhdGlvbiA9IG5ldyBNZXRob2RBY3RpdmF0aW9uKG1ldGhvZCk7XHJcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMuY3VycmVudE1ldGhvZDtcclxuXHJcbiAgICAgICAgdGhpcy5sb2c/LmRlYnVnKGAke2N1cnJlbnQubWV0aG9kPy5uYW1lfSA9PiAke21ldGhvZC5uYW1lfWApO1xyXG5cclxuICAgICAgICB0aGlzLm1ldGhvZHMucHVzaChhY3RpdmF0aW9uKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbW92ZU5leHQoKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRNZXRob2Quc3RhY2tGcmFtZS5jdXJyZW50SW5zdHJ1Y3Rpb24rKztcclxuICAgIH1cclxuXHJcbiAgICBqdW1wVG9MaW5lKGxpbmVOdW1iZXI6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRNZXRob2Quc3RhY2tGcmFtZS5jdXJyZW50SW5zdHJ1Y3Rpb24gPSBsaW5lTnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybkZyb21DdXJyZW50TWV0aG9kKCl7XHJcbiAgICAgICAgY29uc3QgZXhwZWN0UmV0dXJuVHlwZSA9IHRoaXMuY3VycmVudE1ldGhvZC5tZXRob2QhLnJldHVyblR5cGUgIT0gXCJcIjtcclxuICAgICAgICBjb25zdCByZXR1cm5lZE1ldGhvZCA9IHRoaXMubWV0aG9kcy5wb3AoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2c/LmRlYnVnKGAke3RoaXMuY3VycmVudE1ldGhvZC5tZXRob2Q/Lm5hbWV9IDw9ICR7cmV0dXJuZWRNZXRob2Q/Lm1ldGhvZD8ubmFtZX1gKTtcclxuXHJcbiAgICAgICAgaWYgKCFleHBlY3RSZXR1cm5UeXBlKXtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lRW1wdHkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0gcmV0dXJuZWRNZXRob2Q/LnN0YWNrLnBvcCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZSE7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYWNlIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVBsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4uL2xpYnJhcnkvVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL0ZpZWxkXCI7XHJcbmltcG9ydCB7IFN0cmluZ1R5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9TdHJpbmdUeXBlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFbXB0eSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVFbXB0eVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQ29tbWFuZCB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVDb21tYW5kXCI7XHJcbmltcG9ydCB7IEJvb2xlYW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQm9vbGVhblR5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUJvb2xlYW4gfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQm9vbGVhblwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lTGlzdCB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVMaXN0XCI7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9JdGVtXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJdGVtIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUl0ZW1cIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxheWVyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGF5ZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lUGxheWVyXCI7XHJcbmltcG9ydCB7IFNheSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1NheVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU2F5IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVNheVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vLi4vY29tbW9uL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lSW50ZWdlciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJbnRlZ2VyXCI7XHJcbmltcG9ydCB7IE51bWJlclR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9OdW1iZXJUeXBlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVEZWNvcmF0aW9uIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZURlY29yYXRpb25cIjtcclxuaW1wb3J0IHsgRGVjb3JhdGlvbiB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0RlY29yYXRpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZW1vcnl7XHJcbiAgICBwcml2YXRlIHN0YXRpYyB0eXBlc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlPigpO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGVhcCA9IG5ldyBNYXA8c3RyaW5nLCBSdW50aW1lQW55W10+KCk7XHJcblxyXG4gICAgc3RhdGljIGZpbmRJbnN0YW5jZUJ5TmFtZShuYW1lOnN0cmluZyl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2VzID0gTWVtb3J5LmhlYXAuZ2V0KG5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoIWluc3RhbmNlcyB8fCBpbnN0YW5jZXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiT2JqZWN0IG5vdCBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZXMubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJMb2NhdGVkIG1vcmUgdGhhbiBvbmUgaW5zdGFuY2VcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2VzWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkVHlwZXModHlwZXM6VHlwZVtdKXtcclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgVHlwZT4odHlwZXMubWFwKHggPT4gW3gubmFtZSwgeF0pKTsgICBcclxuICAgICAgICBcclxuICAgICAgICAvLyBPdmVycmlkZSBhbnkgcHJvdmlkZWQgdHlwZSBzdHVicyB3aXRoIHRoZSBhY3R1YWwgcnVudGltZSB0eXBlIGRlZmluaXRpb25zLlxyXG5cclxuICAgICAgICBjb25zdCBwbGFjZSA9IFJ1bnRpbWVQbGFjZS50eXBlO1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBSdW50aW1lSXRlbS50eXBlO1xyXG4gICAgICAgIGNvbnN0IHBsYXllciA9IFJ1bnRpbWVQbGF5ZXIudHlwZTtcclxuICAgICAgICBjb25zdCBkZWNvcmF0aW9uID0gUnVudGltZURlY29yYXRpb24udHlwZTtcclxuXHJcbiAgICAgICAgTWVtb3J5LnR5cGVzQnlOYW1lLnNldChwbGFjZS5uYW1lLCBwbGFjZSk7XHJcbiAgICAgICAgTWVtb3J5LnR5cGVzQnlOYW1lLnNldChpdGVtLm5hbWUsIGl0ZW0pO1xyXG4gICAgICAgIE1lbW9yeS50eXBlc0J5TmFtZS5zZXQocGxheWVyLm5hbWUsIHBsYXllcik7ICBcclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUuc2V0KGRlY29yYXRpb24ubmFtZSwgZGVjb3JhdGlvbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oTWVtb3J5LnR5cGVzQnlOYW1lLnZhbHVlcygpKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGVDb21tYW5kKCk6UnVudGltZUNvbW1hbmR7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lQ29tbWFuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZUJvb2xlYW4odmFsdWU6Ym9vbGVhbik6UnVudGltZUJvb2xlYW57XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lQm9vbGVhbih2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG9jYXRlTnVtYmVyKHZhbHVlOm51bWJlcik6UnVudGltZUludGVnZXJ7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lSW50ZWdlcih2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG9jYXRlU3RyaW5nKHRleHQ6c3RyaW5nKTpSdW50aW1lU3RyaW5ne1xyXG4gICAgICAgIHJldHVybiBuZXcgUnVudGltZVN0cmluZyh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGUodHlwZTpUeXBlKTpSdW50aW1lQW55e1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gTWVtb3J5LmNvbnN0cnVjdEluc3RhbmNlRnJvbSh0eXBlKTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2VQb29sID0gTWVtb3J5LmhlYXAuZ2V0KHR5cGUubmFtZSkgfHwgW107XHJcblxyXG4gICAgICAgIGluc3RhbmNlUG9vbC5wdXNoKGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgTWVtb3J5LmhlYXAuc2V0KHR5cGUubmFtZSwgaW5zdGFuY2VQb29sKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluaXRpYWxpemVWYXJpYWJsZVdpdGgoZmllbGQ6RmllbGQpe1xyXG5cclxuICAgICAgICBjb25zdCB2YXJpYWJsZSA9IE1lbW9yeS5jb25zdHJ1Y3RWYXJpYWJsZUZyb20oZmllbGQpOyAgICAgICAgXHJcbiAgICAgICAgdmFyaWFibGUudmFsdWUgPSBNZW1vcnkuaW5zdGFudGlhdGVEZWZhdWx0VmFsdWVGb3IodmFyaWFibGUsIGZpZWxkLmRlZmF1bHRWYWx1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2YXJpYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjb25zdHJ1Y3RWYXJpYWJsZUZyb20oZmllbGQ6RmllbGQpe1xyXG4gICAgICAgIGlmIChmaWVsZC50eXBlKXtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZShmaWVsZC5uYW1lLCBmaWVsZC50eXBlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBNZW1vcnkudHlwZXNCeU5hbWUuZ2V0KGZpZWxkLnR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKCF0eXBlKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGNvbnN0cnVjdCB1bmtub3duIHR5cGUgJyR7ZmllbGQudHlwZU5hbWV9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZShmaWVsZC5uYW1lLCB0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW50aWF0ZURlZmF1bHRWYWx1ZUZvcih2YXJpYWJsZTpWYXJpYWJsZSwgZGVmYXVsdFZhbHVlOk9iamVjdHx1bmRlZmluZWQpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN3aXRjaCh2YXJpYWJsZS50eXBlIS5uYW1lKXtcclxuICAgICAgICAgICAgY2FzZSBTdHJpbmdUeXBlLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVTdHJpbmcoZGVmYXVsdFZhbHVlID8gPHN0cmluZz5kZWZhdWx0VmFsdWUgOiBcIlwiKTtcclxuICAgICAgICAgICAgY2FzZSBCb29sZWFuVHlwZS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lQm9vbGVhbihkZWZhdWx0VmFsdWUgPyA8Ym9vbGVhbj5kZWZhdWx0VmFsdWUgOiBmYWxzZSk7XHJcbiAgICAgICAgICAgIGNhc2UgTnVtYmVyVHlwZS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lSW50ZWdlcihkZWZhdWx0VmFsdWUgPyA8bnVtYmVyPmRlZmF1bHRWYWx1ZSA6IDApO1xyXG4gICAgICAgICAgICBjYXNlIExpc3QudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZUxpc3QoZGVmYXVsdFZhbHVlID8gdGhpcy5pbnN0YW50aWF0ZUxpc3QoPE9iamVjdFtdPmRlZmF1bHRWYWx1ZSkgOiBbXSk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVFbXB0eSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW50aWF0ZUxpc3QoaXRlbXM6T2JqZWN0W10pe1xyXG4gICAgICAgIGNvbnN0IHJ1bnRpbWVJdGVtczpSdW50aW1lQW55W10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGNvbnN0IGl0ZW0gb2YgaXRlbXMpe1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtTGlzdCA9IDxPYmplY3RbXT5pdGVtO1xyXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IDxudW1iZXI+aXRlbUxpc3RbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVOYW1lID0gPHN0cmluZz5pdGVtTGlzdFsxXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBNZW1vcnkudHlwZXNCeU5hbWUuZ2V0KHR5cGVOYW1lKSE7XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IGN1cnJlbnQgPSAwOyBjdXJyZW50IDwgY291bnQ7IGN1cnJlbnQrKyl7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBNZW1vcnkuYWxsb2NhdGUodHlwZSk7XHJcbiAgICAgICAgICAgICAgICBydW50aW1lSXRlbXMucHVzaChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydW50aW1lSXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY29uc3RydWN0SW5zdGFuY2VGcm9tKHR5cGU6VHlwZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNlZW5UeXBlcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xyXG4gICAgICAgIGxldCBpbmhlcml0YW5jZUNoYWluOlR5cGVbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGN1cnJlbnQ6VHlwZXx1bmRlZmluZWQgPSB0eXBlOyBcclxuICAgICAgICAgICAgY3VycmVudDsgXHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBNZW1vcnkudHlwZXNCeU5hbWUuZ2V0KGN1cnJlbnQuYmFzZVR5cGVOYW1lKSl7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChzZWVuVHlwZXMuaGFzKGN1cnJlbnQubmFtZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJZb3UgY2FuJ3QgaGF2ZSBjeWNsZXMgaW4gYSB0eXBlIGhpZXJhcmNoeVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZWVuVHlwZXMuYWRkKGN1cnJlbnQubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpbmhlcml0YW5jZUNoYWluLnB1c2goY3VycmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBmaXJzdFN5c3RlbVR5cGVBbmNlc3RvckluZGV4ID0gaW5oZXJpdGFuY2VDaGFpbi5maW5kSW5kZXgoeCA9PiB4LmlzU3lzdGVtVHlwZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICBpZiAoZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleCA8IDApe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVHlwZSBtdXN0IHVsdGltYXRlbHkgaW5oZXJpdCBmcm9tIGEgc3lzdGVtIHR5cGVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuYWxsb2NhdGVTeXN0ZW1UeXBlQnlOYW1lKGluaGVyaXRhbmNlQ2hhaW5bZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleF0ubmFtZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaW5zdGFuY2UucGFyZW50VHlwZU5hbWUgPSBpbnN0YW5jZS50eXBlTmFtZTtcclxuICAgICAgICBpbnN0YW5jZS50eXBlTmFtZSA9IGluaGVyaXRhbmNlQ2hhaW5bMF0ubmFtZTtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogSW5oZXJpdCBtb3JlIHRoYW4ganVzdCBmaWVsZHMvbWV0aG9kcy5cclxuICAgICAgICAvLyBUT0RPOiBUeXBlIGNoZWNrIGZpZWxkIGluaGVyaXRhbmNlIGZvciBzaGFkb3dpbmcvb3ZlcnJpZGluZy5cclxuXHJcbiAgICAgICAgLy8gSW5oZXJpdCBmaWVsZHMvbWV0aG9kcyBmcm9tIHR5cGVzIGluIHRoZSBoaWVyYXJjaHkgZnJvbSBsZWFzdCB0byBtb3N0IGRlcml2ZWQuXHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpID0gZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleDsgaSA+PSAwOyBpLS0pe1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VHlwZSA9IGluaGVyaXRhbmNlQ2hhaW5baV07XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgZmllbGQgb2YgY3VycmVudFR5cGUuZmllbGRzKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlID0gdGhpcy5pbml0aWFsaXplVmFyaWFibGVXaXRoKGZpZWxkKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmZpZWxkcy5zZXQoZmllbGQubmFtZSwgdmFyaWFibGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgbWV0aG9kIG9mIGN1cnJlbnRUeXBlLm1ldGhvZHMpe1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UubWV0aG9kcy5zZXQobWV0aG9kLm5hbWUsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGFsbG9jYXRlU3lzdGVtVHlwZUJ5TmFtZSh0eXBlTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHN3aXRjaCh0eXBlTmFtZSl7XHJcbiAgICAgICAgICAgIGNhc2UgUGxhY2UudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVBsYWNlKCk7XHJcbiAgICAgICAgICAgIGNhc2UgSXRlbS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lSXRlbSgpO1xyXG4gICAgICAgICAgICBjYXNlIFBsYXllci50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lUGxheWVyKCk7XHJcbiAgICAgICAgICAgIGNhc2UgTGlzdC50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lTGlzdChbXSk7ICAgICBcclxuICAgICAgICAgICAgY2FzZSBTYXkudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVNheSgpOyAgICBcclxuICAgICAgICAgICAgY2FzZSBEZWNvcmF0aW9uLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVEZWNvcmF0aW9uKCk7ICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6e1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGluc3RhbnRpYXRlIHR5cGUgJyR7dHlwZU5hbWV9J2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFJ1bnRpbWVFcnJvciBleHRlbmRzIEVycm9ye1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6c3RyaW5nKXtcclxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBc3NpZ25WYXJpYWJsZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKFwiLnN0LnZhclwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBSdW50aW1lU3RyaW5nKXtcclxuICAgICAgICAgICAgaW5zdGFuY2UudmFsdWUgPSAoPFJ1bnRpbWVTdHJpbmc+dmFsdWUpLnZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBSdW50aW1lSW50ZWdlcil7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnZhbHVlID0gKDxSdW50aW1lSW50ZWdlcj52YWx1ZSkudmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIkVuY291bnRlcmVkIHVuc3VwcG9ydGVkIHR5cGUgb24gdGhlIHN0YWNrXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCcmFuY2hSZWxhdGl2ZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aXZlQW1vdW50ID0gPG51bWJlcj50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYGJyLnJlbCAke3JlbGF0aXZlQW1vdW50fWApO1xyXG5cclxuICAgICAgICB0aHJlYWQuanVtcFRvTGluZSh0aHJlYWQuY3VycmVudE1ldGhvZC5zdGFja0ZyYW1lLmN1cnJlbnRJbnN0cnVjdGlvbiArIHJlbGF0aXZlQW1vdW50KTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQm9vbGVhbiB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVCb29sZWFuXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpdmVBbW91bnQgPSA8bnVtYmVyPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gPFJ1bnRpbWVCb29sZWFuPnRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgYnIucmVsLmZhbHNlICR7cmVsYXRpdmVBbW91bnR9IC8vICR7dmFsdWV9YClcclxuXHJcbiAgICAgICAgaWYgKCF2YWx1ZS52YWx1ZSl7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRocmVhZC5qdW1wVG9MaW5lKHRocmVhZC5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uICsgcmVsYXRpdmVBbW91bnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmNhdGVuYXRlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgbGFzdCA9IDxSdW50aW1lU3RyaW5nPnRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IGZpcnN0ID0gPFJ1bnRpbWVTdHJpbmc+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAuY29uY2F0ICcke2ZpcnN0LnZhbHVlfScgJyR7bGFzdC52YWx1ZX0nYCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmNhdGVuYXRlZCA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhmaXJzdC52YWx1ZSArIFwiIFwiICsgbGFzdC52YWx1ZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goY29uY2F0ZW5hdGVkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuXHJcbmludGVyZmFjZSBJSW5kZXhhYmxle1xyXG4gICAgW25hbWU6c3RyaW5nXTooLi4uYXJnczpSdW50aW1lQW55W10pPT5SdW50aW1lQW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRXh0ZXJuYWxDYWxsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IDxzdHJpbmc+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMubG9jYXRlRnVuY3Rpb24oaW5zdGFuY2UhLCA8c3RyaW5nPm1ldGhvZE5hbWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmNhbGwuZXh0ZXJuXFx0JHtpbnN0YW5jZT8udHlwZU5hbWV9Ojoke21ldGhvZE5hbWV9KC4uLiR7bWV0aG9kLmxlbmd0aH0pYCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGFyZ3M6UnVudGltZUFueVtdID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBtZXRob2QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBhcmdzLnB1c2godGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCkhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG1ldGhvZC5jYWxsKGluc3RhbmNlLCAuLi5hcmdzKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChyZXN1bHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb2NhdGVGdW5jdGlvbihpbnN0YW5jZTpPYmplY3QsIG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gKDxJSW5kZXhhYmxlPmluc3RhbmNlKVttZXRob2ROYW1lXTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHb1RvSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uTnVtYmVyID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgaW5zdHJ1Y3Rpb25OdW1iZXIgPT09IFwibnVtYmVyXCIpe1xyXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIGp1bXAgb25lIHByZXZpb3VzIHRvIHRoZSBkZXNpcmVkIGluc3RydWN0aW9uIGJlY2F1c2UgYWZ0ZXIgXHJcbiAgICAgICAgICAgIC8vIGV2YWx1YXRpbmcgdGhpcyBnb3RvIHdlJ2xsIG1vdmUgZm9yd2FyZCAod2hpY2ggd2lsbCBtb3ZlIHRvIHRoZSBkZXNpcmVkIG9uZSkuXHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAuYnIgJHtpbnN0cnVjdGlvbk51bWJlcn1gKVxyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmp1bXBUb0xpbmUoaW5zdHJ1Y3Rpb25OdW1iZXIgLSAxKTtcclxuICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gZ290b1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVDb21tYW5kIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUNvbW1hbmRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZyB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1VuZGVyc3RhbmRpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZVVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lVW5kZXJzdGFuZGluZ1wiO1xyXG5pbXBvcnQgeyBNZWFuaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvTWVhbmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgUnVudGltZUxpc3QgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lTGlzdFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxhY2UgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lUGxhY2VcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYXllciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgTG9hZFByb3BlcnR5SGFuZGxlciB9IGZyb20gXCIuL0xvYWRQcm9wZXJ0eUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUHJpbnRIYW5kbGVyIH0gZnJvbSBcIi4vUHJpbnRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9JbnN0YW5jZUNhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEV2ZW50VHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vRXZlbnRUeXBlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVEZWxlZ2F0ZSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVEZWxlZ2F0ZVwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJdGVtIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUl0ZW1cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBIYW5kbGVDb21tYW5kSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dHB1dDpJT3V0cHV0KXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjb21tYW5kID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGlmICghKGNvbW1hbmQgaW5zdGFuY2VvZiBSdW50aW1lQ29tbWFuZCkpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBVbmFibGUgdG8gaGFuZGxlIGEgbm9uLWNvbW1hbmQsIGZvdW5kICcke2NvbW1hbmR9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhY3Rpb24gPSBjb21tYW5kLmFjdGlvbiEudmFsdWU7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0TmFtZSA9IGNvbW1hbmQudGFyZ2V0TmFtZSEudmFsdWU7XHJcblxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAuaGFuZGxlLmNtZCAnJHthY3Rpb259ICR7dGFyZ2V0TmFtZX0nYCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVuZGVyc3RhbmRpbmdzQnlBY3Rpb24gPSBuZXcgTWFwPE9iamVjdCwgVHlwZT4odGhyZWFkLmtub3duVW5kZXJzdGFuZGluZ3MubWFwKHggPT4gW3guZmllbGRzLmZpbmQoZmllbGQgPT4gZmllbGQubmFtZSA9PSBVbmRlcnN0YW5kaW5nLmFjdGlvbik/LmRlZmF1bHRWYWx1ZSEsIHhdKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVuZGVyc3RhbmRpbmcgPSB1bmRlcnN0YW5kaW5nc0J5QWN0aW9uLmdldChhY3Rpb24pO1xyXG5cclxuICAgICAgICBpZiAoIXVuZGVyc3RhbmRpbmcpe1xyXG4gICAgICAgICAgICB0aGlzLm91dHB1dC53cml0ZShcIkkgZG9uJ3Qga25vdyBob3cgdG8gZG8gdGhhdC5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1lYW5pbmdGaWVsZCA9IHVuZGVyc3RhbmRpbmcuZmllbGRzLmZpbmQoeCA9PiB4Lm5hbWUgPT0gVW5kZXJzdGFuZGluZy5tZWFuaW5nKTtcclxuXHJcbiAgICAgICAgY29uc3QgbWVhbmluZyA9IHRoaXMuZGV0ZXJtaW5lTWVhbmluZ0Zvcig8c3RyaW5nPm1lYW5pbmdGaWVsZD8uZGVmYXVsdFZhbHVlISk7XHJcbiAgICAgICAgY29uc3QgYWN0dWFsVGFyZ2V0TmFtZSA9IHRoaXMuaW5mZXJUYXJnZXRGcm9tKHRocmVhZCwgdGFyZ2V0TmFtZSwgbWVhbmluZyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCFhY3R1YWxUYXJnZXROYW1lKXtcclxuICAgICAgICAgICAgdGhpcy5vdXRwdXQud3JpdGUoXCJJIGRvbid0IGtub3cgd2hhdCB5b3UncmUgcmVmZXJyaW5nIHRvLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhyZWFkLmtub3duVHlwZXMuZ2V0KGFjdHVhbFRhcmdldE5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoIXRhcmdldCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gbG9jYXRlIHR5cGVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMubG9jYXRlVGFyZ2V0SW5zdGFuY2UodGhyZWFkLCB0YXJnZXQsIG1lYW5pbmcpO1xyXG5cclxuICAgICAgICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIFJ1bnRpbWVXb3JsZE9iamVjdCkpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGxvY2F0ZSB3b3JsZCB0eXBlXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpdGNoKG1lYW5pbmcpe1xyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuRGVzY3JpYmluZzp7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaWJlKHRocmVhZCwgaW5zdGFuY2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTWVhbmluZy5Nb3Zpbmc6IHsgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0UGxhY2UgPSA8UnVudGltZVBsYWNlPmluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFBsYWNlID0gdGhyZWFkLmN1cnJlbnRQbGFjZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aHJlYWQuY3VycmVudFBsYWNlID0gbmV4dFBsYWNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaWJlKHRocmVhZCwgaW5zdGFuY2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmFpc2VFdmVudCh0aHJlYWQsIG5leHRQbGFjZSwgRXZlbnRUeXBlLlBsYXllckVudGVyc1BsYWNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmFpc2VFdmVudCh0aHJlYWQsIGN1cnJlbnRQbGFjZSEsIEV2ZW50VHlwZS5QbGF5ZXJFeGl0c1BsYWNlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTWVhbmluZy5UYWtpbmc6IHtcclxuICAgICAgICAgICAgICAgIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgUnVudGltZUl0ZW0pKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dC53cml0ZShcIkkgY2FuJ3QgdGFrZSB0aGF0LlwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IHRocmVhZC5jdXJyZW50UGxhY2UhLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgICAgIGxpc3QuaXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUgIT0gdGFyZ2V0Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnZlbnRvcnkgPSB0aHJlYWQuY3VycmVudFBsYXllciEuZ2V0Q29udGVudHNGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgaW52ZW50b3J5Lml0ZW1zLnB1c2goaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpYmUodGhyZWFkLCB0aHJlYWQuY3VycmVudFBsYWNlISwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBNZWFuaW5nLkludmVudG9yeTp7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnZlbnRvcnkgPSAoPFJ1bnRpbWVQbGF5ZXI+aW5zdGFuY2UpLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpYmVDb250ZW50cyh0aHJlYWQsIGludmVudG9yeSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuRHJvcHBpbmc6e1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IHRocmVhZC5jdXJyZW50UGxheWVyIS5nZXRDb250ZW50c0ZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICBsaXN0Lml0ZW1zID0gbGlzdC5pdGVtcy5maWx0ZXIoeCA9PiB4LnR5cGVOYW1lICE9IHRhcmdldC5uYW1lKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudHMgPSB0aHJlYWQuY3VycmVudFBsYWNlIS5nZXRDb250ZW50c0ZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50cy5pdGVtcy5wdXNoKGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaWJlKHRocmVhZCwgdGhyZWFkLmN1cnJlbnRQbGFjZSEsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5zdXBwb3J0ZWQgbWVhbmluZyBmb3VuZFwiKTtcclxuICAgICAgICB9ICBcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmFpc2VFdmVudCh0aHJlYWQ6VGhyZWFkLCBsb2NhdGlvbjpSdW50aW1lUGxhY2UsIHR5cGU6RXZlbnRUeXBlKXtcclxuICAgICAgICBjb25zdCBldmVudHMgPSBBcnJheS5mcm9tKGxvY2F0aW9uLm1ldGhvZHMudmFsdWVzKCkhKS5maWx0ZXIoeCA9PiB4LmV2ZW50VHlwZSA9PSB0eXBlKTtcclxuXHJcbiAgICAgICAgZm9yKGNvbnN0IGV2ZW50IG9mIGV2ZW50cyl7XHJcbiAgICAgICAgICAgIGNvbnN0IG1ldGhvZCA9IGxvY2F0aW9uLm1ldGhvZHMuZ2V0KGV2ZW50Lm5hbWUpITtcclxuICAgICAgICAgICAgbWV0aG9kLmFjdHVhbFBhcmFtZXRlcnMgPSBbbmV3IFZhcmlhYmxlKFwifnRoaXNcIiwgbmV3IFR5cGUobG9jYXRpb24/LnR5cGVOYW1lISwgbG9jYXRpb24/LnBhcmVudFR5cGVOYW1lISksIGxvY2F0aW9uKV07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IG5ldyBSdW50aW1lRGVsZWdhdGUobWV0aG9kKTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goZGVsZWdhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvY2F0ZVRhcmdldEluc3RhbmNlKHRocmVhZDpUaHJlYWQsIHRhcmdldDpUeXBlLCBtZWFuaW5nOk1lYW5pbmcpOlJ1bnRpbWVBbnl8dW5kZWZpbmVke1xyXG4gICAgICAgIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLlRha2luZyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSA8UnVudGltZUxpc3Q+dGhyZWFkLmN1cnJlbnRQbGFjZSEuZmllbGRzLmdldChXb3JsZE9iamVjdC5jb250ZW50cyk/LnZhbHVlO1xyXG4gICAgICAgICAgICBjb25zdCBtYXRjaGluZ0l0ZW1zID0gbGlzdC5pdGVtcy5maWx0ZXIoeCA9PiB4LnR5cGVOYW1lID09PSB0YXJnZXQubmFtZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAobWF0Y2hpbmdJdGVtcy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hpbmdJdGVtc1swXTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1lYW5pbmcgPT09IE1lYW5pbmcuRHJvcHBpbmcpe1xyXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gPFJ1bnRpbWVMaXN0PnRocmVhZC5jdXJyZW50UGxheWVyIS5maWVsZHMuZ2V0KFdvcmxkT2JqZWN0LmNvbnRlbnRzKT8udmFsdWU7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoaW5nSXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUgPT09IHRhcmdldC5uYW1lKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChtYXRjaGluZ0l0ZW1zLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGluZ0l0ZW1zWzBdO1xyXG4gICAgICAgIH0gZWxzZSB7ICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIE1lbW9yeS5maW5kSW5zdGFuY2VCeU5hbWUodGFyZ2V0Lm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluZmVyVGFyZ2V0RnJvbSh0aHJlYWQ6VGhyZWFkLCB0YXJnZXROYW1lOnN0cmluZywgbWVhbmluZzpNZWFuaW5nKXtcclxuICAgICAgICBpZiAobWVhbmluZyA9PT0gTWVhbmluZy5Nb3Zpbmcpe1xyXG4gICAgICAgICAgICBjb25zdCBwbGFjZU5hbWUgPSA8UnVudGltZVN0cmluZz50aHJlYWQuY3VycmVudFBsYWNlPy5maWVsZHMuZ2V0KGB+JHt0YXJnZXROYW1lfWApPy52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICghcGxhY2VOYW1lKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwbGFjZU5hbWUudmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobWVhbmluZyA9PT0gTWVhbmluZy5JbnZlbnRvcnkpe1xyXG4gICAgICAgICAgICByZXR1cm4gUGxheWVyLnR5cGVOYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRhcmdldE5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXNjcmliZSh0aHJlYWQ6VGhyZWFkLCB0YXJnZXQ6UnVudGltZVdvcmxkT2JqZWN0LCBpc1NoYWxsb3dEZXNjcmlwdGlvbjpib29sZWFuKXtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICghaXNTaGFsbG93RGVzY3JpcHRpb24pe1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50cyA9IHRhcmdldC5nZXRGaWVsZEFzTGlzdChXb3JsZE9iamVjdC5jb250ZW50cyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaWJlQ29udGVudHModGhyZWFkLCBjb250ZW50cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkZXNjcmliZSA9IHRhcmdldC5tZXRob2RzLmdldChXb3JsZE9iamVjdC5kZXNjcmliZSkhO1xyXG5cclxuICAgICAgICBkZXNjcmliZS5hY3R1YWxQYXJhbWV0ZXJzLnVuc2hpZnQobmV3IFZhcmlhYmxlKFwifnRoaXNcIiwgbmV3IFR5cGUodGFyZ2V0Py50eXBlTmFtZSEsIHRhcmdldD8ucGFyZW50VHlwZU5hbWUhKSwgdGFyZ2V0KSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2gobmV3IFJ1bnRpbWVEZWxlZ2F0ZShkZXNjcmliZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb2JzZXJ2ZSh0aHJlYWQ6VGhyZWFkLCB0YXJnZXQ6UnVudGltZVdvcmxkT2JqZWN0KXtcclxuICAgICAgICBjb25zdCBvYnNlcnZlID0gdGFyZ2V0Lm1ldGhvZHMuZ2V0KFdvcmxkT2JqZWN0Lm9ic2VydmUpITtcclxuXHJcbiAgICAgICAgb2JzZXJ2ZS5hY3R1YWxQYXJhbWV0ZXJzLnVuc2hpZnQobmV3IFZhcmlhYmxlKFwifnRoaXNcIiwgbmV3IFR5cGUodGFyZ2V0Py50eXBlTmFtZSEsIHRhcmdldD8ucGFyZW50VHlwZU5hbWUhKSwgdGFyZ2V0KSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2gobmV3IFJ1bnRpbWVEZWxlZ2F0ZShvYnNlcnZlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXNjcmliZUNvbnRlbnRzKHRocmVhZDpUaHJlYWQsIHRhcmdldDpSdW50aW1lTGlzdCl7XHJcbiAgICAgICAgZm9yKGNvbnN0IGl0ZW0gb2YgdGFyZ2V0Lml0ZW1zKXtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKHRocmVhZCwgPFJ1bnRpbWVXb3JsZE9iamVjdD5pdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXRlcm1pbmVNZWFuaW5nRm9yKGFjdGlvbjpzdHJpbmcpOk1lYW5pbmd7XHJcbiAgICAgICAgY29uc3Qgc3lzdGVtQWN0aW9uID0gYH4ke2FjdGlvbn1gO1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBTdXBwb3J0IGN1c3RvbSBhY3Rpb25zIGJldHRlci5cclxuXHJcbiAgICAgICAgc3dpdGNoKHN5c3RlbUFjdGlvbil7XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy5kZXNjcmliaW5nOiByZXR1cm4gTWVhbmluZy5EZXNjcmliaW5nO1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcubW92aW5nOiByZXR1cm4gTWVhbmluZy5Nb3Zpbmc7XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy5kaXJlY3Rpb246IHJldHVybiBNZWFuaW5nLkRpcmVjdGlvbjtcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLnRha2luZzogcmV0dXJuIE1lYW5pbmcuVGFraW5nO1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcuaW52ZW50b3J5OiByZXR1cm4gTWVhbmluZy5JbnZlbnRvcnk7XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy5kcm9wcGluZzogcmV0dXJuIE1lYW5pbmcuRHJvcHBpbmc7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWVhbmluZy5DdXN0b207XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdGFuY2VDYWxsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1ldGhvZE5hbWU/OnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aHJlYWQuY3VycmVudE1ldGhvZDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm1ldGhvZE5hbWUpe1xyXG4gICAgICAgICAgICB0aGlzLm1ldGhvZE5hbWUgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gY3VycmVudC5wb3AoKTtcclxuXHJcbiAgICAgICAgY29uc3QgbWV0aG9kID0gaW5zdGFuY2U/Lm1ldGhvZHMuZ2V0KHRoaXMubWV0aG9kTmFtZSkhO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmNhbGwuaW5zdFxcdCR7aW5zdGFuY2U/LnR5cGVOYW1lfTo6JHt0aGlzLm1ldGhvZE5hbWV9KC4uLiR7bWV0aG9kLnBhcmFtZXRlcnMubGVuZ3RofSlgKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBwYXJhbWV0ZXJWYWx1ZXM6VmFyaWFibGVbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWV0aG9kIS5wYXJhbWV0ZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgY29uc3QgcGFyYW1ldGVyID0gbWV0aG9kIS5wYXJhbWV0ZXJzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGN1cnJlbnQucG9wKCkhO1xyXG4gICAgICAgICAgICBjb25zdCB2YXJpYWJsZSA9IG5ldyBWYXJpYWJsZShwYXJhbWV0ZXIubmFtZSwgcGFyYW1ldGVyLnR5cGUhLCBpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICBwYXJhbWV0ZXJWYWx1ZXMucHVzaCh2YXJpYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEhBQ0s6IFdlIHNob3VsZG4ndCBjcmVhdGUgb3VyIG93biB0eXBlLCB3ZSBzaG91bGQgaW5oZXJlbnRseSBrbm93IHdoYXQgaXQgaXMuXHJcblxyXG4gICAgICAgIHBhcmFtZXRlclZhbHVlcy51bnNoaWZ0KG5ldyBWYXJpYWJsZShcIn50aGlzXCIsIG5ldyBUeXBlKGluc3RhbmNlPy50eXBlTmFtZSEsIGluc3RhbmNlPy5wYXJlbnRUeXBlTmFtZSEpLCBpbnN0YW5jZSkpO1xyXG5cclxuICAgICAgICBtZXRob2QuYWN0dWFsUGFyYW1ldGVycyA9IHBhcmFtZXRlclZhbHVlcztcclxuXHJcbiAgICAgICAgdGhyZWFkLmFjdGl2YXRlTWV0aG9kKG1ldGhvZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVEZWxlZ2F0ZSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVEZWxlZ2F0ZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEludm9rZURlbGVnYXRlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKFwiLmNhbGwuZGVsZWdhdGVcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKSE7XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJ1bnRpbWVEZWxlZ2F0ZSl7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2YXRpb24gPSB0aHJlYWQuYWN0aXZhdGVNZXRob2QoaW5zdGFuY2Uud3JhcHBlZE1ldGhvZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGludm9rZSBkZWxlZ2F0ZSBmb3Igbm9uLWRlbGVnYXRlIGluc3RhbmNlICcke2luc3RhbmNlfSdgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkRmllbGRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IGZpZWxkTmFtZSA9IDxzdHJpbmc+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICBjb25zdCBmaWVsZCA9IGluc3RhbmNlPy5maWVsZHMuZ2V0KGZpZWxkTmFtZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZmllbGQ/LnZhbHVlO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmxkLmZpZWxkXFx0XFx0JHtpbnN0YW5jZT8udHlwZU5hbWV9Ojoke2ZpZWxkTmFtZX0gLy8gJHt2YWx1ZX1gKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaCh2YWx1ZSEpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRJbnN0YW5jZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCB0eXBlTmFtZSA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVOYW1lID09PSBcIn5pdFwiKXtcclxuICAgICAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRocmVhZC5jdXJyZW50UGxhY2UhO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHN1YmplY3QpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoXCIubGQuY3Vyci5wbGFjZVwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBVbmFibGUgdG8gbG9hZCBpbnN0YW5jZSBmb3IgdW5zdXBwb3J0ZWQgdHlwZSAnJHt0eXBlTmFtZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRMb2NhbEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBsb2NhbE5hbWUgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmFtZXRlciA9IHRocmVhZC5jdXJyZW50TWV0aG9kLm1ldGhvZD8uYWN0dWFsUGFyYW1ldGVycy5maW5kKHggPT4geC5uYW1lID09IGxvY2FsTmFtZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2gocGFyYW1ldGVyPy52YWx1ZSEpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmxkLnBhcmFtXFx0XFx0JHtsb2NhbE5hbWV9PSR7cGFyYW1ldGVyPy52YWx1ZX1gKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkTnVtYmVySGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gPG51bWJlcj50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcbiAgICAgICAgY29uc3QgcnVudGltZVZhbHVlID0gTWVtb3J5LmFsbG9jYXRlTnVtYmVyKHZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChydW50aW1lVmFsdWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmxkLmNvbnN0Lm51bVxcdCR7dmFsdWV9YCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9JbnN0YW5jZUNhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRUaGlzSGFuZGxlciB9IGZyb20gXCIuL0xvYWRUaGlzSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkUHJvcGVydHlIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZmllbGROYW1lPzpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZmllbGROYW1lKXtcclxuICAgICAgICAgICAgdGhpcy5maWVsZE5hbWUgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeXtcclxuICAgICAgICAgICAgY29uc3QgZmllbGQgPSBpbnN0YW5jZT8uZmllbGRzLmdldCh0aGlzLmZpZWxkTmFtZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGZpZWxkPy52YWx1ZSE7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBnZXRGaWVsZCA9IGluc3RhbmNlPy5tZXRob2RzLmdldChgfmdldF8ke3RoaXMuZmllbGROYW1lfWApO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5sZC5wcm9wXFx0XFx0JHtpbnN0YW5jZT8udHlwZU5hbWV9Ojoke3RoaXMuZmllbGROYW1lfSB7Z2V0PSR7Z2V0RmllbGQgIT0gdW5kZWZpbmVkfX0gLy8gJHt2YWx1ZX1gKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChnZXRGaWVsZCl7XHJcbiAgICAgICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2FkVGhpcyA9IG5ldyBMb2FkVGhpc0hhbmRsZXIoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGxvYWRUaGlzLmhhbmRsZSh0aHJlYWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gRXZhbHVhdGlvblJlc3VsdC5Db250aW51ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IG5ldyBJbnN0YW5jZUNhbGxIYW5kbGVyKGdldEZpZWxkLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlci5oYW5kbGUodGhyZWFkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2dldEZpZWxkLmFjdHVhbFBhcmFtZXRlcnMucHVzaChuZXcgVmFyaWFibGUoXCJ+dmFsdWVcIiwgZmllbGQ/LnR5cGUhLCB2YWx1ZSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vdGhyZWFkLmFjdGl2YXRlTWV0aG9kKGdldEZpZWxkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICAgICAgfSBmaW5hbGx5e1xyXG4gICAgICAgICAgICB0aGlzLmZpZWxkTmFtZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRTdHJpbmdIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24hLnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKXtcclxuICAgICAgICAgICAgY29uc3Qgc3RyaW5nVmFsdWUgPSBuZXcgUnVudGltZVN0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goc3RyaW5nVmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5sZC5jb25zdC5zdHJcXHRcIiR7dmFsdWV9XCJgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiRXhwZWN0ZWQgYSBzdHJpbmdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIlxyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZFRoaXNIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLm1ldGhvZD8uYWN0dWFsUGFyYW1ldGVyc1swXS52YWx1ZSE7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmxkLnRoaXNgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOZXdJbnN0YW5jZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHR5cGVOYW1lID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdHlwZU5hbWUgPT09IFwic3RyaW5nXCIpe1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gdGhyZWFkLmtub3duVHlwZXMuZ2V0KHR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlID09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBsb2NhdGUgdHlwZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBNZW1vcnkuYWxsb2NhdGUodHlwZSk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKGluc3RhbmNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5vT3BIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICByZXR1cm4gRXZhbHVhdGlvblJlc3VsdC5Db250aW51ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVDb21tYW5kIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUNvbW1hbmRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJzZUNvbW1hbmRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmhhbmRsZS5jbWQucGFyc2VgKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB0ZXh0ID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0IGluc3RhbmNlb2YgUnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRUZXh0ID0gdGV4dC52YWx1ZTtcclxuICAgICAgICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMucGFyc2VDb21tYW5kKGNvbW1hbmRUZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goY29tbWFuZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBwYXJzZSBjb21tYW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VDb21tYW5kKHRleHQ6c3RyaW5nKTpSdW50aW1lQ29tbWFuZHtcclxuICAgICAgICBjb25zdCBwaWVjZXMgPSB0ZXh0LnNwbGl0KFwiIFwiKTtcclxuICAgICAgICBjb25zdCBjb21tYW5kID0gTWVtb3J5LmFsbG9jYXRlQ29tbWFuZCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbW1hbmQuYWN0aW9uID0gTWVtb3J5LmFsbG9jYXRlU3RyaW5nKHBpZWNlc1swXSk7XHJcbiAgICAgICAgY29tbWFuZC50YXJnZXROYW1lID0gTWVtb3J5LmFsbG9jYXRlU3RyaW5nKHBpZWNlc1sxXSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb21tYW5kO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcbmltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByaW50SGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcml2YXRlIG91dHB1dDpJT3V0cHV0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG91dHB1dDpJT3V0cHV0KXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMub3V0cHV0ID0gb3V0cHV0O1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0IGluc3RhbmNlb2YgUnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKFwiLnByaW50XCIpO1xyXG4gICAgICAgICAgICB0aGlzLm91dHB1dC53cml0ZSh0ZXh0LnZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIHByaW50LCBlbmNvdW50ZXJlZCBhIHR5cGUgb24gdGhlIHN0YWNrIG90aGVyIHRoYW4gc3RyaW5nXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVhZElucHV0SGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoXCIucmVhZC5pblwiKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gRXZhbHVhdGlvblJlc3VsdC5TdXNwZW5kRm9ySW5wdXQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVtcHR5IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUVtcHR5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmV0dXJuSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgLy8gVE9ETzogSGFuZGxlIHJldHVybmluZyB0b3AgdmFsdWUgb24gc3RhY2sgYmFzZWQgb24gcmV0dXJuIHR5cGUgb2YgbWV0aG9kLlxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aHJlYWQuY3VycmVudE1ldGhvZDtcclxuICAgICAgICBjb25zdCBzaXplID0gY3VycmVudC5zdGFja1NpemUoKTtcclxuICAgICAgICBjb25zdCBoYXNSZXR1cm5UeXBlID0gY3VycmVudC5tZXRob2Q/LnJldHVyblR5cGUgIT0gXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKGhhc1JldHVyblR5cGUpe1xyXG4gICAgICAgICAgICBpZiAoc2l6ZSA9PSAwKXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJFeHBlY3RlZCByZXR1cm4gdmFsdWUgZnJvbSBtZXRob2QgYnV0IGZvdW5kIG5vIGluc3RhbmNlIG9uIHRoZSBzdGFja1wiKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaXplID4gMSl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBTdGFjayBJbWJhbGFuY2UhIFJldHVybmluZyBmcm9tICcke2N1cnJlbnQubWV0aG9kPy5uYW1lfScgZm91bmQgJyR7c2l6ZX0nIGluc3RhbmNlcyBsZWZ0IGJ1dCBleHBlY3RlZCBvbmUuYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoc2l6ZSA+IDApe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgU3RhY2sgSW1iYWxhbmNlISBSZXR1cm5pbmcgZnJvbSAnJHtjdXJyZW50Lm1ldGhvZD8ubmFtZX0nIGZvdW5kICcke3NpemV9JyBpbnN0YW5jZXMgbGVmdCBidXQgZXhwZWN0ZWQgemVyby5gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSB0aHJlYWQhLnJldHVybkZyb21DdXJyZW50TWV0aG9kKCk7XHJcblxyXG4gICAgICAgIGlmICghKHJldHVyblZhbHVlIGluc3RhbmNlb2YgUnVudGltZUVtcHR5KSl7XHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAucmV0XFx0XFx0JHtyZXR1cm5WYWx1ZX1gKTtcclxuICAgICAgICAgICAgdGhyZWFkPy5jdXJyZW50TWV0aG9kLnB1c2gocmV0dXJuVmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKFwiLnJldCB2b2lkXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuQ29udGludWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4uL01ldGhvZEFjdGl2YXRpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdGF0aWNDYWxsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgY2FsbFRleHQgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuXHJcbiAgICAgICAgY29uc3QgcGllY2VzID0gY2FsbFRleHQuc3BsaXQoXCIuXCIpO1xyXG5cclxuICAgICAgICBjb25zdCB0eXBlTmFtZSA9IHBpZWNlc1swXTtcclxuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gcGllY2VzWzFdO1xyXG5cclxuICAgICAgICBjb25zdCB0eXBlID0gdGhyZWFkLmtub3duVHlwZXMuZ2V0KHR5cGVOYW1lKSE7XHJcbiAgICAgICAgY29uc3QgbWV0aG9kID0gdHlwZT8ubWV0aG9kcy5maW5kKHggPT4geC5uYW1lID09PSBtZXRob2ROYW1lKSE7ICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAuY2FsbC5zdGF0aWNcXHQke3R5cGVOYW1lfTo6JHttZXRob2ROYW1lfSgpYCk7XHJcblxyXG4gICAgICAgIHRocmVhZC5hY3RpdmF0ZU1ldGhvZChtZXRob2QpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFR5cGVPZkhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHR5cGVOYW1lID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAudHlwZW9mICR7dHlwZU5hbWV9YCk7XHJcblxyXG4gICAgICAgIGlmICh0aHJlYWQuY3VycmVudE1ldGhvZC5zdGFja1NpemUoKSA9PSAwKXtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBNZW1vcnkuYWxsb2NhdGVCb29sZWFuKGZhbHNlKTtcclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wZWVrKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpc1R5cGUgPSBpbnN0YW5jZT8udHlwZU5hbWUgPT0gdHlwZU5hbWU7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IE1lbW9yeS5hbGxvY2F0ZUJvb2xlYW4oaXNUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2gocmVzdWx0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIE1lYW5pbmd7XHJcbiAgICBEZXNjcmliaW5nLFxyXG4gICAgVGFraW5nLFxyXG4gICAgTW92aW5nLFxyXG4gICAgRGlyZWN0aW9uLFxyXG4gICAgSW52ZW50b3J5LFxyXG4gICAgRHJvcHBpbmcsXHJcbiAgICBRdWl0dGluZyxcclxuICAgIEN1c3RvbVxyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4vVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9NZXRob2RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lQW55e1xyXG4gICAgcGFyZW50VHlwZU5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHR5cGVOYW1lOnN0cmluZyA9IEFueS50eXBlTmFtZTtcclxuXHJcbiAgICBmaWVsZHM6TWFwPHN0cmluZywgVmFyaWFibGU+ID0gbmV3IE1hcDxzdHJpbmcsIFZhcmlhYmxlPigpO1xyXG4gICAgbWV0aG9kczpNYXA8c3RyaW5nLCBNZXRob2Q+ID0gbmV3IE1hcDxzdHJpbmcsIE1ldGhvZD4oKTtcclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnR5cGVOYW1lO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lQm9vbGVhbiBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6Ym9vbGVhbil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4vUnVudGltZVN0cmluZ1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVDb21tYW5kIGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0YXJnZXROYW1lPzpSdW50aW1lU3RyaW5nLCBwdWJsaWMgYWN0aW9uPzpSdW50aW1lU3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IERlY29yYXRpb24gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9EZWNvcmF0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZURlY29yYXRpb24gZXh0ZW5kcyBSdW50aW1lV29ybGRPYmplY3R7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IERlY29yYXRpb24ucGFyZW50VHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IERlY29yYXRpb24udHlwZU5hbWU7XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgRGVsZWdhdGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9EZWxlZ2F0ZVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vLi4vY29tbW9uL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVEZWxlZ2F0ZSBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gRGVsZWdhdGUudHlwZU5hbWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHdyYXBwZWRNZXRob2Q6TWV0aG9kKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUVtcHR5IGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBcIn5lbXB0eVwiO1xyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lSW50ZWdlciBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6bnVtYmVyKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVXb3JsZE9iamVjdCB9IGZyb20gXCIuL1J1bnRpbWVXb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9JdGVtXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lSXRlbSBleHRlbmRzIFJ1bnRpbWVXb3JsZE9iamVjdHtcclxuICAgIHBhcmVudFR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IEl0ZW0udHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIGdldCB0eXBlKCk6VHlwZXtcclxuICAgICAgICBjb25zdCB0eXBlID0gUnVudGltZVdvcmxkT2JqZWN0LnR5cGU7XHJcblxyXG4gICAgICAgIHR5cGUubmFtZSA9IEl0ZW0udHlwZU5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vLi4vY29tbW9uL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBQYXJhbWV0ZXIgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1BhcmFtZXRlclwiO1xyXG5pbXBvcnQgeyBOdW1iZXJUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTnVtYmVyVHlwZVwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuLi8uLi9jb21tb24vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuL1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUxpc3QgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGl0ZW1zOlJ1bnRpbWVBbnlbXSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGFpbnMgPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgY29udGFpbnMubmFtZSA9IExpc3QuY29udGFpbnM7XHJcbiAgICAgICAgY29udGFpbnMucGFyYW1ldGVycy5wdXNoKFxyXG4gICAgICAgICAgICBuZXcgUGFyYW1ldGVyKExpc3QudHlwZU5hbWVQYXJhbWV0ZXIsIFN0cmluZ1R5cGUudHlwZU5hbWUpLFxyXG4gICAgICAgICAgICBuZXcgUGFyYW1ldGVyKExpc3QuY291bnRQYXJhbWV0ZXIsIE51bWJlclR5cGUudHlwZU5hbWUpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29udGFpbnMucmV0dXJuVHlwZSA9IEJvb2xlYW5UeXBlLnR5cGVOYW1lO1xyXG5cclxuICAgICAgICBjb250YWlucy5ib2R5LnB1c2goXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRMb2NhbChMaXN0LmNvdW50UGFyYW1ldGVyKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZExvY2FsKExpc3QudHlwZU5hbWVQYXJhbWV0ZXIpLCAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmV4dGVybmFsQ2FsbChcImNvbnRhaW5zVHlwZVwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucmV0dXJuKClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLm1ldGhvZHMuc2V0KExpc3QuY29udGFpbnMsIGNvbnRhaW5zKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbnRhaW5zVHlwZSh0eXBlTmFtZTpSdW50aW1lU3RyaW5nLCBjb3VudDpSdW50aW1lSW50ZWdlcil7XHJcbiAgICAgICAgY29uc3QgZm91bmRJdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKHggPT4geC50eXBlTmFtZSA9PT0gdHlwZU5hbWUudmFsdWUpO1xyXG4gICAgICAgIGNvbnN0IGZvdW5kID0gZm91bmRJdGVtcy5sZW5ndGggPT09IGNvdW50LnZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gTWVtb3J5LmFsbG9jYXRlQm9vbGVhbihmb3VuZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lV29ybGRPYmplY3QgfSBmcm9tIFwiLi9SdW50aW1lV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lUGxhY2UgZXh0ZW5kcyBSdW50aW1lV29ybGRPYmplY3R7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnBhcmVudFR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBQbGFjZS50eXBlTmFtZTtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IHR5cGUoKTpUeXBle1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBSdW50aW1lV29ybGRPYmplY3QudHlwZTtcclxuXHJcbiAgICAgICAgdHlwZS5uYW1lID0gUGxhY2UudHlwZU5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lV29ybGRPYmplY3QgfSBmcm9tIFwiLi9SdW50aW1lV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lUGxheWVyIGV4dGVuZHMgUnVudGltZVdvcmxkT2JqZWN0e1xyXG4gICAgc3RhdGljIGdldCB0eXBlKCk6VHlwZXtcclxuICAgICAgICBjb25zdCB0eXBlID0gUnVudGltZVdvcmxkT2JqZWN0LnR5cGU7XHJcblxyXG4gICAgICAgIHR5cGUubmFtZSA9IFBsYXllci50eXBlTmFtZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVTYXkgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgbWVzc2FnZTpzdHJpbmcgPSBcIlwiO1xyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVN0cmluZyBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICB2YWx1ZTpzdHJpbmc7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gXCJ+c3RyaW5nXCI7XHJcblxyXG4gICAgY29uc3RydWN0b3IodmFsdWU6c3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiBgXCIke3RoaXMudmFsdWV9XCJgO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgUnVudGltZUxpc3QgfSBmcm9tIFwiLi9SdW50aW1lTGlzdFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4vUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuL1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL0ZpZWxkXCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IFN0cmluZ1R5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9TdHJpbmdUeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVdvcmxkT2JqZWN0IGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBXb3JsZE9iamVjdC50eXBlTmFtZTtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IHR5cGUoKTpUeXBle1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBuZXcgVHlwZShXb3JsZE9iamVjdC50eXBlTmFtZSwgV29ybGRPYmplY3QucGFyZW50VHlwZU5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRzID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgY29udGVudHMubmFtZSA9IFdvcmxkT2JqZWN0LmNvbnRlbnRzO1xyXG4gICAgICAgIGNvbnRlbnRzLnR5cGVOYW1lID0gTGlzdC50eXBlTmFtZTtcclxuICAgICAgICBjb250ZW50cy5kZWZhdWx0VmFsdWUgPSBbXTtcclxuXHJcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBuZXcgRmllbGQoKTtcclxuICAgICAgICBkZXNjcmlwdGlvbi5uYW1lID0gV29ybGRPYmplY3QuZGVzY3JpcHRpb247XHJcbiAgICAgICAgZGVzY3JpcHRpb24udHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uLmRlZmF1bHRWYWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIHR5cGUuZmllbGRzLnB1c2goY29udGVudHMpO1xyXG4gICAgICAgIHR5cGUuZmllbGRzLnB1c2goZGVzY3JpcHRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEZpZWxkVmFsdWVCeU5hbWUobmFtZTpzdHJpbmcpOlJ1bnRpbWVBbnl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmZpZWxkcy5nZXQobmFtZSk/LnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAoaW5zdGFuY2UgPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgQXR0ZW1wdGVkIGZpZWxkIGFjY2VzcyBmb3IgdW5rbm93biBmaWVsZCAnJHtuYW1lfSdgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb250ZW50c0ZpZWxkKCk6UnVudGltZUxpc3R7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RmllbGRBc0xpc3QoV29ybGRPYmplY3QuY29udGVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEZpZWxkQXNMaXN0KG5hbWU6c3RyaW5nKTpSdW50aW1lTGlzdHtcclxuICAgICAgICByZXR1cm4gPFJ1bnRpbWVMaXN0PnRoaXMuZ2V0RmllbGRWYWx1ZUJ5TmFtZShuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRGaWVsZEFzU3RyaW5nKG5hbWU6c3RyaW5nKTpSdW50aW1lU3RyaW5ne1xyXG4gICAgICAgIHJldHVybiA8UnVudGltZVN0cmluZz50aGlzLmdldEZpZWxkVmFsdWVCeU5hbWUobmFtZSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVmFyaWFibGV7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG5hbWU6c3RyaW5nLCBcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB0eXBlOlR5cGUsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgdmFsdWU/OlJ1bnRpbWVBbnkpe1xyXG4gICAgfVxyXG59Il19
