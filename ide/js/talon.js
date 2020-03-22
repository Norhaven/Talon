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
                "understand \"go\" as moving. \n" +
                "understand \"take\" as taking. \n" +
                "understand \"inv\" as inventory. \n" +
                "understand \"drop\" as dropping. \n\n" +
                "a test is a kind of place. \n" +
                "it is where the player starts. \n" +
                "it is described as \"It looks like a room.\" and if it contains 1 Coin then say \"There's also a coin here.\" else say \"There is just dust.\".\n" +
                "it contains 1 Coin.\n" +
                "it can reach the inn by going \"north\". \n" +
                "it has a \"value\" that is 1. \n" +
                "when the player exits: \n" +
                "say \"Goodbye!\"; \n" +
                "set \"value\" to 2; \n" +
                "and then stop. \n\n" +
                "a inn is a kind of place. \n" +
                "it is described as \"It's an inn.\". \n" +
                "it can reach the test by going \"north\". \n" +
                "when the player enters:\n" +
                "say \"You walk into the inn.\"; \n" +
                "say \"It looks deserted.\"; \n" +
                "and then stop. \n\n" +
                "say \"This is the middle.\".\n\n" +
                "a Coin is a kind of item. \n" +
                "it is described as \"It's a small coin.\".\n\n" +
                "say \"This is the end.\".\n";
    }
}
exports.TalonIde = TalonIde;
},{"./PaneOutput":1,"./compiler/TalonCompiler":11,"./runtime/TalonRuntime":66}],3:[function(require,module,exports){
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
},{"../common/Instruction":5,"../common/Method":6,"../common/Type":9,"../common/Version":10,"../library/Any":47,"../library/Delegate":49,"../library/EntryPointAttribute":50,"./exceptions/CompilationError":12,"./lexing/TalonLexer":15,"./parsing/TalonParser":19,"./semantics/TalonSemanticAnalyzer":44,"./transforming/TalonTransformer":46}],12:[function(require,module,exports){
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
}
exports.Token = Token;
},{"../../library/Any":47,"../../library/BooleanType":48,"../../library/Item":52,"../../library/List":53,"../../library/Place":55,"../../library/WorldObject":60,"./TokenType":17}],17:[function(require,module,exports){
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
        else {
            throw new CompilationError_1.CompilationError("Unable to parse expression");
        }
    }
}
exports.ExpressionVisitor = ExpressionVisitor;
},{"../../../library/NumberType":54,"../../../library/StringType":58,"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../../lexing/TokenType":17,"../expressions/ContainsExpression":23,"../expressions/LiteralExpression":27,"../expressions/SayExpression":29,"../expressions/SetVariableExpression":30,"./IfExpressionVisitor":37,"./Visitor":42}],36:[function(require,module,exports){
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
            if (context.is(Keywords_1.Keywords.described)) {
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
},{"../../../library/BooleanType":48,"../../../library/List":53,"../../../library/NumberType":54,"../../../library/Place":55,"../../../library/StringType":58,"../../../library/WorldObject":60,"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../../lexing/TokenType":17,"../expressions/ConcatenationExpression":22,"../expressions/FieldDeclarationExpression":25,"./ExpressionVisitor":35,"./Visitor":42}],37:[function(require,module,exports){
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
                throw new CompilationError_1.CompilationError(`Found unexpected token '${context.currentToken.value}'`);
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
        if (context.isAnyOf(Keywords_1.Keywords.place, Keywords_1.Keywords.item)) {
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
    }
    analyze(expression) {
        const types = [this.any, this.worldObject, this.place, this.booleanType, this.item];
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
                        describe.body.push(Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadProperty(WorldObject_1.WorldObject.description), Instruction_1.Instruction.print(), Instruction_1.Instruction.return());
                        type === null || type === void 0 ? void 0 : type.methods.push(describe);
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
},{"../../common/EventType":3,"../../common/Field":4,"../../common/Instruction":5,"../../common/Method":6,"../../common/Parameter":8,"../../common/Type":9,"../../library/Any":47,"../../library/BooleanType":48,"../../library/Item":52,"../../library/List":53,"../../library/NumberType":54,"../../library/Place":55,"../../library/Player":56,"../../library/Say":57,"../../library/StringType":58,"../../library/Understanding":59,"../../library/WorldObject":60,"../exceptions/CompilationError":12,"../lexing/Keywords":13,"../parsing/expressions/ConcatenationExpression":22,"../parsing/expressions/ContainsExpression":23,"../parsing/expressions/FieldDeclarationExpression":25,"../parsing/expressions/IfExpression":26,"../parsing/expressions/LiteralExpression":27,"../parsing/expressions/ProgramExpression":28,"../parsing/expressions/SayExpression":29,"../parsing/expressions/SetVariableExpression":30,"../parsing/expressions/TypeDeclarationExpression":31,"../parsing/expressions/UnderstandingDeclarationExpression":32,"./ExpressionTransformationMode":45}],47:[function(require,module,exports){
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
},{"./ExternCall":51}],48:[function(require,module,exports){
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
const Any_1 = require("./Any");
class Delegate {
}
exports.Delegate = Delegate;
Delegate.typeName = "~delegate";
Delegate.parentTypeName = Any_1.Any.typeName;
},{"./Any":47}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntryPointAttribute {
    constructor() {
        this.name = "~entryPoint";
    }
}
exports.EntryPointAttribute = EntryPointAttribute;
},{}],51:[function(require,module,exports){
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
},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Item {
}
exports.Item = Item;
Item.typeName = "~item";
Item.parentTypeName = WorldObject_1.WorldObject.typeName;
},{"./WorldObject":60}],53:[function(require,module,exports){
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
},{"./Any":47}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class NumberType {
}
exports.NumberType = NumberType;
NumberType.typeName = "~number";
NumberType.parentTypeName = Any_1.Any.typeName;
},{"./Any":47}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Place {
}
exports.Place = Place;
Place.parentTypeName = WorldObject_1.WorldObject.typeName;
Place.typeName = "~place";
Place.isPlayerStart = "~isPlayerStart";
},{"./WorldObject":60}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Player {
}
exports.Player = Player;
Player.typeName = "~player";
Player.parentTypeName = WorldObject_1.WorldObject.typeName;
},{"./WorldObject":60}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class Say {
}
exports.Say = Say;
Say.typeName = "~say";
Say.parentTypeName = Any_1.Any.typeName;
},{"./Any":47}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class StringType {
}
exports.StringType = StringType;
StringType.parentTypeName = Any_1.Any.typeName;
StringType.typeName = "~string";
},{"./Any":47}],59:[function(require,module,exports){
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
},{"./Any":47}],60:[function(require,module,exports){
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
WorldObject.describe = "~describe";
},{"./Any":47}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TalonIde_1 = require("./TalonIde");
var ide = new TalonIde_1.TalonIde();
},{"./TalonIde":2}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EvaluationResult;
(function (EvaluationResult) {
    EvaluationResult[EvaluationResult["Continue"] = 0] = "Continue";
    EvaluationResult[EvaluationResult["SuspendForInput"] = 1] = "SuspendForInput";
})(EvaluationResult = exports.EvaluationResult || (exports.EvaluationResult = {}));
},{}],63:[function(require,module,exports){
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
},{"./StackFrame":65,"./errors/RuntimeError":69}],64:[function(require,module,exports){
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
},{"../common/OpCode":7,"./EvaluationResult":62}],65:[function(require,module,exports){
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
},{"./library/Variable":108}],66:[function(require,module,exports){
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
},{"../common/OpCode":7,"../library/Any":47,"../library/EntryPointAttribute":50,"../library/Place":55,"../library/Player":56,"./EvaluationResult":62,"./MethodActivation":63,"./Thread":67,"./common/Memory":68,"./errors/RuntimeError":69,"./handlers/AssignVariableHandler":70,"./handlers/BranchRelativeHandler":71,"./handlers/BranchRelativeIfFalseHandler":72,"./handlers/ConcatenateHandler":73,"./handlers/ExternalCallHandler":74,"./handlers/GoToHandler":75,"./handlers/HandleCommandHandler":76,"./handlers/InstanceCallHandler":77,"./handlers/InvokeDelegateHandler":78,"./handlers/LoadFieldHandler":79,"./handlers/LoadInstanceHandler":80,"./handlers/LoadLocalHandler":81,"./handlers/LoadNumberHandler":82,"./handlers/LoadPropertyHandler":83,"./handlers/LoadStringHandler":84,"./handlers/LoadThisHandler":85,"./handlers/NewInstanceHandler":86,"./handlers/NoOpHandler":87,"./handlers/ParseCommandHandler":88,"./handlers/PrintHandler":89,"./handlers/ReadInputHandler":90,"./handlers/ReturnHandler":91,"./handlers/StaticCallHandler":92,"./handlers/TypeOfHandler":93}],67:[function(require,module,exports){
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
},{"../library/Understanding":59,"./MethodActivation":63,"./library/RuntimeEmpty":99}],68:[function(require,module,exports){
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
        Memory.typesByName.set(place.name, place);
        Memory.typesByName.set(item.name, item);
        Memory.typesByName.set(player.name, player);
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
            default: {
                throw new RuntimeError_1.RuntimeError(`Unable to instantiate type '${typeName}'`);
            }
        }
    }
}
exports.Memory = Memory;
Memory.typesByName = new Map();
Memory.heap = new Map();
},{"../../library/BooleanType":48,"../../library/Item":52,"../../library/List":53,"../../library/NumberType":54,"../../library/Place":55,"../../library/Player":56,"../../library/Say":57,"../../library/StringType":58,"../errors/RuntimeError":69,"../library/RuntimeBoolean":96,"../library/RuntimeCommand":97,"../library/RuntimeEmpty":99,"../library/RuntimeInteger":100,"../library/RuntimeItem":101,"../library/RuntimeList":102,"../library/RuntimePlace":103,"../library/RuntimePlayer":104,"../library/RuntimeSay":105,"../library/RuntimeString":106,"../library/Variable":108}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RuntimeError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.RuntimeError = RuntimeError;
},{}],70:[function(require,module,exports){
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
},{"../OpCodeHandler":64,"../errors/RuntimeError":69,"../library/RuntimeInteger":100,"../library/RuntimeString":106}],71:[function(require,module,exports){
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
},{"../OpCodeHandler":64}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
class BranchRelativeIfFalseHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b;
        const relativeAmount = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const value = thread.currentMethod.pop();
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`br.rel.false ${relativeAmount}`);
        if (!value.value) {
            thread.jumpToLine(thread.currentMethod.stackFrame.currentInstruction + relativeAmount);
        }
        return super.handle(thread);
    }
}
exports.BranchRelativeIfFalseHandler = BranchRelativeIfFalseHandler;
},{"../OpCodeHandler":64}],73:[function(require,module,exports){
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
},{"../OpCodeHandler":64,"../common/Memory":68}],74:[function(require,module,exports){
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
},{"../OpCodeHandler":64}],75:[function(require,module,exports){
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
},{"../OpCodeHandler":64,"../errors/RuntimeError":69}],76:[function(require,module,exports){
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
        thread.currentMethod.push(target);
        const describe = target.methods.get(WorldObject_1.WorldObject.describe);
        describe.actualParameters.unshift(new Variable_1.Variable("~this", new Type_1.Type(target === null || target === void 0 ? void 0 : target.typeName, target === null || target === void 0 ? void 0 : target.parentTypeName), target));
        thread.currentMethod.push(new RuntimeDelegate_1.RuntimeDelegate(describe));
    }
    describeContents(executionPoint, target) {
        for (const item of target.items) {
            this.describe(executionPoint, item, true);
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
},{"../../common/EventType":3,"../../common/Type":9,"../../library/Player":56,"../../library/Understanding":59,"../../library/WorldObject":60,"../OpCodeHandler":64,"../common/Memory":68,"../errors/RuntimeError":69,"../library/Meaning":94,"../library/RuntimeCommand":97,"../library/RuntimeDelegate":98,"../library/RuntimeWorldObject":107,"../library/Variable":108}],77:[function(require,module,exports){
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
},{"../../common/Type":9,"../OpCodeHandler":64,"../library/Variable":108}],78:[function(require,module,exports){
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
},{"../OpCodeHandler":64,"../errors/RuntimeError":69,"../library/RuntimeDelegate":98}],79:[function(require,module,exports){
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
},{"../OpCodeHandler":64}],80:[function(require,module,exports){
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
},{"../OpCodeHandler":64,"../errors/RuntimeError":69}],81:[function(require,module,exports){
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
},{"../OpCodeHandler":64}],82:[function(require,module,exports){
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
},{"../OpCodeHandler":64,"../common/Memory":68}],83:[function(require,module,exports){
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
}
exports.LoadPropertyHandler = LoadPropertyHandler;
},{"../EvaluationResult":62,"../OpCodeHandler":64,"./InstanceCallHandler":77,"./LoadThisHandler":85}],84:[function(require,module,exports){
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
},{"../OpCodeHandler":64,"../errors/RuntimeError":69,"../library/RuntimeString":106}],85:[function(require,module,exports){
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
},{"../OpCodeHandler":64}],86:[function(require,module,exports){
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
},{"../OpCodeHandler":64,"../common/Memory":68,"../errors/RuntimeError":69}],87:[function(require,module,exports){
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
},{"../EvaluationResult":62,"../OpCodeHandler":64}],88:[function(require,module,exports){
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
},{"../OpCodeHandler":64,"../common/Memory":68,"../errors/RuntimeError":69,"../library/RuntimeString":106}],89:[function(require,module,exports){
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
},{"../OpCodeHandler":64,"../errors/RuntimeError":69,"../library/RuntimeString":106}],90:[function(require,module,exports){
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
},{"../EvaluationResult":62,"../OpCodeHandler":64}],91:[function(require,module,exports){
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
},{"../EvaluationResult":62,"../OpCodeHandler":64,"../errors/RuntimeError":69,"../library/RuntimeEmpty":99}],92:[function(require,module,exports){
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
},{"../OpCodeHandler":64}],93:[function(require,module,exports){
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
},{"../OpCodeHandler":64,"../common/Memory":68}],94:[function(require,module,exports){
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
},{}],95:[function(require,module,exports){
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
},{"../../library/Any":47}],96:[function(require,module,exports){
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
},{"./RuntimeAny":95}],97:[function(require,module,exports){
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
},{"./RuntimeAny":95}],98:[function(require,module,exports){
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
},{"../../library/Any":47,"../../library/Delegate":49,"./RuntimeAny":95}],99:[function(require,module,exports){
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
},{"../../library/Any":47,"./RuntimeAny":95}],100:[function(require,module,exports){
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
},{"./RuntimeAny":95}],101:[function(require,module,exports){
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
},{"../../library/Item":52,"../../library/WorldObject":60,"./RuntimeWorldObject":107}],102:[function(require,module,exports){
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
},{"../../common/Instruction":5,"../../common/Method":6,"../../common/Parameter":8,"../../library/BooleanType":48,"../../library/List":53,"../../library/NumberType":54,"../../library/StringType":58,"../common/Memory":68,"./RuntimeAny":95}],103:[function(require,module,exports){
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
},{"../../library/Place":55,"../../library/WorldObject":60,"./RuntimeWorldObject":107}],104:[function(require,module,exports){
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
},{"../../library/Player":56,"./RuntimeWorldObject":107}],105:[function(require,module,exports){
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
},{"./RuntimeAny":95}],106:[function(require,module,exports){
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
},{"../../library/Any":47,"./RuntimeAny":95}],107:[function(require,module,exports){
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
},{"../../common/Field":4,"../../common/Type":9,"../../library/Any":47,"../../library/List":53,"../../library/StringType":58,"../../library/WorldObject":60,"../errors/RuntimeError":69,"./RuntimeAny":95}],108:[function(require,module,exports){
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
},{}]},{},[61])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL25vcmhhL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInRhbG9uL1BhbmVPdXRwdXQudHMiLCJ0YWxvbi9UYWxvbklkZS50cyIsInRhbG9uL2NvbW1vbi9FdmVudFR5cGUudHMiLCJ0YWxvbi9jb21tb24vRmllbGQudHMiLCJ0YWxvbi9jb21tb24vSW5zdHJ1Y3Rpb24udHMiLCJ0YWxvbi9jb21tb24vTWV0aG9kLnRzIiwidGFsb24vY29tbW9uL09wQ29kZS50cyIsInRhbG9uL2NvbW1vbi9QYXJhbWV0ZXIudHMiLCJ0YWxvbi9jb21tb24vVHlwZS50cyIsInRhbG9uL2NvbW1vbi9WZXJzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvVGFsb25Db21waWxlci50cyIsInRhbG9uL2NvbXBpbGVyL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvci50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9LZXl3b3Jkcy50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9QdW5jdHVhdGlvbi50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9UYWxvbkxleGVyLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1Rva2VuLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1Rva2VuVHlwZS50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvUGFyc2VDb250ZXh0LnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9UYWxvblBhcnNlci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvQWN0aW9uc0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0JpbmFyeUV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0NvbmNhdGVuYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Db250YWluc0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0ZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9JZkV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0xpdGVyYWxFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Qcm9ncmFtRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2F5RXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2V0VmFyaWFibGVFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9XaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9FdmVudEV4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9FeHByZXNzaW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvRmllbGREZWNsYXJhdGlvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL0lmRXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1Byb2dyYW1WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9TYXlFeHByZXNzaW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvVHlwZURlY2xhcmF0aW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvV2hlbkRlY2xhcmF0aW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3NlbWFudGljcy9UYWxvblNlbWFudGljQW5hbHl6ZXIudHMiLCJ0YWxvbi9jb21waWxlci90cmFuc2Zvcm1pbmcvRXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZS50cyIsInRhbG9uL2NvbXBpbGVyL3RyYW5zZm9ybWluZy9UYWxvblRyYW5zZm9ybWVyLnRzIiwidGFsb24vbGlicmFyeS9BbnkudHMiLCJ0YWxvbi9saWJyYXJ5L0Jvb2xlYW5UeXBlLnRzIiwidGFsb24vbGlicmFyeS9EZWxlZ2F0ZS50cyIsInRhbG9uL2xpYnJhcnkvRW50cnlQb2ludEF0dHJpYnV0ZS50cyIsInRhbG9uL2xpYnJhcnkvRXh0ZXJuQ2FsbC50cyIsInRhbG9uL2xpYnJhcnkvSXRlbS50cyIsInRhbG9uL2xpYnJhcnkvTGlzdC50cyIsInRhbG9uL2xpYnJhcnkvTnVtYmVyVHlwZS50cyIsInRhbG9uL2xpYnJhcnkvUGxhY2UudHMiLCJ0YWxvbi9saWJyYXJ5L1BsYXllci50cyIsInRhbG9uL2xpYnJhcnkvU2F5LnRzIiwidGFsb24vbGlicmFyeS9TdHJpbmdUeXBlLnRzIiwidGFsb24vbGlicmFyeS9VbmRlcnN0YW5kaW5nLnRzIiwidGFsb24vbGlicmFyeS9Xb3JsZE9iamVjdC50cyIsInRhbG9uL21haW4udHMiLCJ0YWxvbi9ydW50aW1lL0V2YWx1YXRpb25SZXN1bHQudHMiLCJ0YWxvbi9ydW50aW1lL01ldGhvZEFjdGl2YXRpb24udHMiLCJ0YWxvbi9ydW50aW1lL09wQ29kZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL1N0YWNrRnJhbWUudHMiLCJ0YWxvbi9ydW50aW1lL1RhbG9uUnVudGltZS50cyIsInRhbG9uL3J1bnRpbWUvVGhyZWFkLnRzIiwidGFsb24vcnVudGltZS9jb21tb24vTWVtb3J5LnRzIiwidGFsb24vcnVudGltZS9lcnJvcnMvUnVudGltZUVycm9yLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Bc3NpZ25WYXJpYWJsZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0JyYW5jaFJlbGF0aXZlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvQ29uY2F0ZW5hdGVIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9FeHRlcm5hbENhbGxIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Hb1RvSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvSGFuZGxlQ29tbWFuZEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0luc3RhbmNlQ2FsbEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0ludm9rZURlbGVnYXRlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZEZpZWxkSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZEluc3RhbmNlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZExvY2FsSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZE51bWJlckhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRQcm9wZXJ0eUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRTdHJpbmdIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkVGhpc0hhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL05ld0luc3RhbmNlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTm9PcEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1BhcnNlQ29tbWFuZEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1ByaW50SGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvUmVhZElucHV0SGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvUmV0dXJuSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvU3RhdGljQ2FsbEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1R5cGVPZkhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvTWVhbmluZy50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lQW55LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVCb29sZWFuLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVDb21tYW5kLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVEZWxlZ2F0ZS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lRW1wdHkudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUludGVnZXIudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUl0ZW0udHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUxpc3QudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVBsYWNlLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVQbGF5ZXIudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVNheS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lU3RyaW5nLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVXb3JsZE9iamVjdC50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9WYXJpYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0EsTUFBYSxVQUFVO0lBQ25CLFlBQW9CLElBQW1CO1FBQW5CLFNBQUksR0FBSixJQUFJLENBQWU7SUFFdkMsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFZO1FBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQztJQUMxQyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQVk7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDO0lBQzFDLENBQUM7Q0FDSjtBQWhCRCxnQ0FnQkM7Ozs7QUNuQkQsNERBQXlEO0FBRXpELDZDQUEwQztBQUUxQyx5REFBc0Q7QUFHdEQsTUFBYSxRQUFRO0lBd0JqQjtRQU5RLGtCQUFhLEdBQVUsRUFBRSxDQUFDO1FBUTlCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBaUIsV0FBVyxDQUFFLENBQUM7UUFDL0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFpQixXQUFXLENBQUUsQ0FBQztRQUMvRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBaUIsb0JBQW9CLENBQUUsQ0FBQztRQUNqRixJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQWlCLFVBQVUsQ0FBRSxDQUFD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QztJQUN2RCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsSUFBVztRQUN4QixPQUFzQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQztDQUNKO0FBNUNELGdEQTRDQzs7OztBQ3JERCxNQUFhLFFBQVE7SUFFakIsWUFBNEIsSUFBVyxFQUNYLElBQVMsRUFDbEIsS0FBaUI7UUFGUixTQUFJLEdBQUosSUFBSSxDQUFPO1FBQ1gsU0FBSSxHQUFKLElBQUksQ0FBSztRQUNsQixVQUFLLEdBQUwsS0FBSyxDQUFZO0lBQ3BDLENBQUM7Q0FDSjtBQU5ELDRCQU1DIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuL3J1bnRpbWUvSU91dHB1dFwiO1xyXG5pbXBvcnQgeyBJTG9nT3V0cHV0IH0gZnJvbSBcIi4vcnVudGltZS9JTG9nT3V0cHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFuZU91dHB1dCBpbXBsZW1lbnRzIElPdXRwdXQsIElMb2dPdXRwdXR7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhbmU6SFRNTERpdkVsZW1lbnQpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBjbGVhcigpe1xyXG4gICAgICAgIHRoaXMucGFuZS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGRlYnVnKGxpbmU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucGFuZS5pbm5lckhUTUwgKz0gbGluZSArIFwiPC9icj5cIjtcclxuICAgIH1cclxuXHJcbiAgICB3cml0ZShsaW5lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnBhbmUuaW5uZXJIVE1MICs9IGxpbmUgKyBcIjwvYnI+XCI7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUYWxvbkNvbXBpbGVyIH0gZnJvbSBcIi4vY29tcGlsZXIvVGFsb25Db21waWxlclwiO1xyXG5cclxuaW1wb3J0IHsgUGFuZU91dHB1dCB9IGZyb20gXCIuL1BhbmVPdXRwdXRcIjtcclxuXHJcbmltcG9ydCB7IFRhbG9uUnVudGltZSB9IGZyb20gXCIuL3J1bnRpbWUvVGFsb25SdW50aW1lXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi9jb21tb24vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uSWRle1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb2RlUGFuZTpIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZ2FtZVBhbmU6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBpbGF0aW9uT3V0cHV0OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBnYW1lTG9nT3V0cHV0OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBleGFtcGxlMUJ1dHRvbjpIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcGlsZUJ1dHRvbjpIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RhcnROZXdHYW1lQnV0dG9uOkhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSB1c2VyQ29tbWFuZFRleHQ6SFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2VuZFVzZXJDb21tYW5kQnV0dG9uOkhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcGlsYXRpb25PdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJ1bnRpbWVPdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJ1bnRpbWVMb2dPdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21waWxlcjpUYWxvbkNvbXBpbGVyO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBydW50aW1lOlRhbG9uUnVudGltZTtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBjb21waWxlZFR5cGVzOlR5cGVbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldEJ5SWQ8VCBleHRlbmRzIEhUTUxFbGVtZW50PihuYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIDxUPmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb2RlUGFuZSA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTERpdkVsZW1lbnQ+KFwiY29kZS1wYW5lXCIpITtcclxuICAgICAgICB0aGlzLmdhbWVQYW5lID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MRGl2RWxlbWVudD4oXCJnYW1lLXBhbmVcIikhO1xyXG4gICAgICAgIHRoaXMuY29tcGlsYXRpb25PdXRwdXQgPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxEaXZFbGVtZW50PihcImNvbXBpbGF0aW9uLW91dHB1dFwiKSE7XHJcbiAgICAgICAgdGhpcy5nYW1lTG9nT3V0cHV0ID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MRGl2RWxlbWVudD4oXCJsb2ctcGFuZVwiKSE7XHJcbiAgICAgICAgdGhpcy5leGFtcGxlMUJ1dHRvbiA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiZXhhbXBsZTFcIikhO1xyXG4gICAgICAgIHRoaXMuY29tcGlsZUJ1dHRvbiA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwiY29tcGlsZVwiKSE7XHJcbiAgICAgICAgdGhpcy5zdGFydE5ld0dhbWVCdXR0b24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxCdXR0b25FbGVtZW50PihcInN0YXJ0LW5ldy1nYW1lXCIpITtcclxuICAgICAgICB0aGlzLnVzZXJDb21tYW5kVGV4dCA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTElucHV0RWxlbWVudD4oXCJ1c2VyLWNvbW1hbmQtdGV4dFwiKSE7XHJcbiAgICAgICAgdGhpcy5zZW5kVXNlckNvbW1hbmRCdXR0b24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxCdXR0b25FbGVtZW50PihcInNlbmQtdXNlci1jb21tYW5kXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZXhhbXBsZTFCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHRoaXMubG9hZEV4YW1wbGUoKSk7XHJcbiAgICAgICAgdGhpcy5jb21waWxlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB0aGlzLmNvbXBpbGUoKSk7XHJcbiAgICAgICAgdGhpcy5zdGFydE5ld0dhbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHRoaXMuc3RhcnROZXdHYW1lKCkpO1xyXG4gICAgICAgIHRoaXMuc2VuZFVzZXJDb21tYW5kQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB0aGlzLnNlbmRVc2VyQ29tbWFuZCgpKTtcclxuICAgICAgICB0aGlzLnVzZXJDb21tYW5kVGV4dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGUgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7IC8vIGVudGVyIGtleVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kVXNlckNvbW1hbmQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBpbGF0aW9uT3V0cHV0UGFuZSA9IG5ldyBQYW5lT3V0cHV0KHRoaXMuY29tcGlsYXRpb25PdXRwdXQpO1xyXG4gICAgICAgIHRoaXMucnVudGltZU91dHB1dFBhbmUgPSBuZXcgUGFuZU91dHB1dCh0aGlzLmdhbWVQYW5lKTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWVMb2dPdXRwdXRQYW5lID0gbmV3IFBhbmVPdXRwdXQodGhpcy5nYW1lTG9nT3V0cHV0KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21waWxlciA9IG5ldyBUYWxvbkNvbXBpbGVyKHRoaXMuY29tcGlsYXRpb25PdXRwdXRQYW5lKTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWUgPSBuZXcgVGFsb25SdW50aW1lKHRoaXMucnVudGltZU91dHB1dFBhbmUsIHRoaXMucnVudGltZUxvZ091dHB1dFBhbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VuZFVzZXJDb21tYW5kKCl7XHJcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMudXNlckNvbW1hbmRUZXh0LnZhbHVlO1xyXG4gICAgICAgIHRoaXMucnVudGltZS5zZW5kQ29tbWFuZChjb21tYW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbXBpbGUoKXtcclxuICAgICAgICBjb25zdCBjb2RlID0gdGhpcy5jb2RlUGFuZS5pbm5lclRleHQ7XHJcblxyXG4gICAgICAgIHRoaXMuY29tcGlsYXRpb25PdXRwdXRQYW5lLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5jb21waWxlZFR5cGVzID0gdGhpcy5jb21waWxlci5jb21waWxlKGNvZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhcnROZXdHYW1lKCl7XHJcbiAgICAgICAgdGhpcy5ydW50aW1lT3V0cHV0UGFuZS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMucnVudGltZUxvZ091dHB1dFBhbmUuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucnVudGltZS5sb2FkRnJvbSh0aGlzLmNvbXBpbGVkVHlwZXMpKXtcclxuICAgICAgICAgICAgdGhpcy5ydW50aW1lLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9hZEV4YW1wbGUoKXtcclxuICAgICAgICAgICAgdGhpcy5jb2RlUGFuZS5pbm5lclRleHQgPSBcclxuICAgICAgICAgICAgICAgIFwic2F5IFxcXCJUaGlzIGlzIHRoZSBzdGFydC5cXFwiLlxcblxcblwiICtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXCJ1bmRlcnN0YW5kIFxcXCJsb29rXFxcIiBhcyBkZXNjcmliaW5nLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcIm5vcnRoXFxcIiBhcyBkaXJlY3Rpb25zLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcImdvXFxcIiBhcyBtb3ZpbmcuIFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwidW5kZXJzdGFuZCBcXFwidGFrZVxcXCIgYXMgdGFraW5nLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcImludlxcXCIgYXMgaW52ZW50b3J5LiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcImRyb3BcXFwiIGFzIGRyb3BwaW5nLiBcXG5cXG5cIiArXHJcblxyXG4gICAgICAgICAgICAgICAgXCJhIHRlc3QgaXMgYSBraW5kIG9mIHBsYWNlLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGlzIHdoZXJlIHRoZSBwbGF5ZXIgc3RhcnRzLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGlzIGRlc2NyaWJlZCBhcyBcXFwiSXQgbG9va3MgbGlrZSBhIHJvb20uXFxcIiBhbmQgaWYgaXQgY29udGFpbnMgMSBDb2luIHRoZW4gc2F5IFxcXCJUaGVyZSdzIGFsc28gYSBjb2luIGhlcmUuXFxcIiBlbHNlIHNheSBcXFwiVGhlcmUgaXMganVzdCBkdXN0LlxcXCIuXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJpdCBjb250YWlucyAxIENvaW4uXFxuXCIgKyBcclxuICAgICAgICAgICAgICAgIFwiaXQgY2FuIHJlYWNoIHRoZSBpbm4gYnkgZ29pbmcgXFxcIm5vcnRoXFxcIi4gXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJpdCBoYXMgYSBcXFwidmFsdWVcXFwiIHRoYXQgaXMgMS4gXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJ3aGVuIHRoZSBwbGF5ZXIgZXhpdHM6IFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwic2F5IFxcXCJHb29kYnllIVxcXCI7IFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwic2V0IFxcXCJ2YWx1ZVxcXCIgdG8gMjsgXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJhbmQgdGhlbiBzdG9wLiBcXG5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFwiYSBpbm4gaXMgYSBraW5kIG9mIHBsYWNlLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGlzIGRlc2NyaWJlZCBhcyBcXFwiSXQncyBhbiBpbm4uXFxcIi4gXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJpdCBjYW4gcmVhY2ggdGhlIHRlc3QgYnkgZ29pbmcgXFxcIm5vcnRoXFxcIi4gXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJ3aGVuIHRoZSBwbGF5ZXIgZW50ZXJzOlxcblwiICtcclxuICAgICAgICAgICAgICAgIFwic2F5IFxcXCJZb3Ugd2FsayBpbnRvIHRoZSBpbm4uXFxcIjsgXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgXCJzYXkgXFxcIkl0IGxvb2tzIGRlc2VydGVkLlxcXCI7IFxcblwiICtcclxuICAgICAgICAgICAgICAgIFwiYW5kIHRoZW4gc3RvcC4gXFxuXFxuXCIgK1xyXG5cclxuICAgICAgICAgICAgICAgIFwic2F5IFxcXCJUaGlzIGlzIHRoZSBtaWRkbGUuXFxcIi5cXG5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFwiYSBDb2luIGlzIGEga2luZCBvZiBpdGVtLiBcXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcIml0IGlzIGRlc2NyaWJlZCBhcyBcXFwiSXQncyBhIHNtYWxsIGNvaW4uXFxcIi5cXG5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFwic2F5IFxcXCJUaGlzIGlzIHRoZSBlbmQuXFxcIi5cXG5cIjtcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIEV2ZW50VHlwZXtcclxuICAgIE5vbmUsXHJcbiAgICBQbGF5ZXJFbnRlcnNQbGFjZSxcclxuICAgIFBsYXllckV4aXRzUGxhY2VcclxufSIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi9UeXBlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpZWxke1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgdHlwZU5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHR5cGU/OlR5cGU7XHJcbiAgICBkZWZhdWx0VmFsdWU/Ok9iamVjdDtcclxufSIsImltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydWN0aW9ue1xyXG4gICAgc3RhdGljIGFzc2lnbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkFzc2lnbik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGludm9rZURlbGVnYXRlKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuSW52b2tlRGVsZWdhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpc1R5cGVPZih0eXBlTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLlR5cGVPZiwgdHlwZU5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkTnVtYmVyKHZhbHVlOm51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZE51bWJlciwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkU3RyaW5nKHZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZFN0cmluZywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkSW5zdGFuY2UodHlwZU5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkSW5zdGFuY2UsIHR5cGVOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZEZpZWxkKGZpZWxkTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRGaWVsZCwgZmllbGROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZFByb3BlcnR5KGZpZWxkTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRQcm9wZXJ0eSwgZmllbGROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZExvY2FsKGxvY2FsTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRMb2NhbCwgbG9jYWxOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZFRoaXMoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkVGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGluc3RhbmNlQ2FsbChtZXRob2ROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuSW5zdGFuY2VDYWxsLCBtZXRob2ROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY29uY2F0ZW5hdGUoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Db25jYXRlbmF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN0YXRpY0NhbGwodHlwZU5hbWU6c3RyaW5nLCBtZXRob2ROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuU3RhdGljQ2FsbCwgYCR7dHlwZU5hbWV9LiR7bWV0aG9kTmFtZX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZXh0ZXJuYWxDYWxsKG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5FeHRlcm5hbENhbGwsIG1ldGhvZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwcmludCgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLlByaW50KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmV0dXJuKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuUmV0dXJuKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmVhZElucHV0KCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuUmVhZElucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcGFyc2VDb21tYW5kKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuUGFyc2VDb21tYW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaGFuZGxlQ29tbWFuZCgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkhhbmRsZUNvbW1hbmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnb1RvKGxpbmVOdW1iZXI6bnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Hb1RvLCBsaW5lTnVtYmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYnJhbmNoUmVsYXRpdmUoY291bnQ6bnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5CcmFuY2hSZWxhdGl2ZSwgY291bnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBicmFuY2hSZWxhdGl2ZUlmRmFsc2UoY291bnQ6bnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5CcmFuY2hSZWxhdGl2ZUlmRmFsc2UsIGNvdW50KTtcclxuICAgIH1cclxuXHJcbiAgICBvcENvZGU6T3BDb2RlID0gT3BDb2RlLk5vT3A7XHJcbiAgICB2YWx1ZT86T2JqZWN0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wQ29kZTpPcENvZGUsIHZhbHVlPzpPYmplY3Qpe1xyXG4gICAgICAgIHRoaXMub3BDb2RlID0gb3BDb2RlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFBhcmFtZXRlciB9IGZyb20gXCIuL1BhcmFtZXRlclwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4uL3J1bnRpbWUvbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBFdmVudFR5cGUgfSBmcm9tIFwiLi9FdmVudFR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZXRob2R7XHJcbiAgICBuYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICBwYXJhbWV0ZXJzOlBhcmFtZXRlcltdID0gW107XHJcbiAgICBhY3R1YWxQYXJhbWV0ZXJzOlZhcmlhYmxlW10gPSBbXTtcclxuICAgIGJvZHk6SW5zdHJ1Y3Rpb25bXSA9IFtdO1xyXG4gICAgcmV0dXJuVHlwZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgZXZlbnRUeXBlOkV2ZW50VHlwZSA9IEV2ZW50VHlwZS5Ob25lO1xyXG59IiwiZXhwb3J0IGVudW0gT3BDb2RlIHtcclxuICAgIE5vT3AsXHJcbiAgICBBc3NpZ24sXHJcbiAgICBQcmludCxcclxuICAgIExvYWRTdHJpbmcsXHJcbiAgICBOZXdJbnN0YW5jZSxcclxuICAgIFBhcnNlQ29tbWFuZCxcclxuICAgIEhhbmRsZUNvbW1hbmQsXHJcbiAgICBSZWFkSW5wdXQsXHJcbiAgICBHb1RvLFxyXG4gICAgUmV0dXJuLFxyXG4gICAgQnJhbmNoUmVsYXRpdmUsXHJcbiAgICBCcmFuY2hSZWxhdGl2ZUlmRmFsc2UsXHJcbiAgICBDb25jYXRlbmF0ZSxcclxuICAgIExvYWROdW1iZXIsXHJcbiAgICBMb2FkRmllbGQsXHJcbiAgICBMb2FkUHJvcGVydHksXHJcbiAgICBMb2FkSW5zdGFuY2UsXHJcbiAgICBMb2FkTG9jYWwsXHJcbiAgICBMb2FkVGhpcyxcclxuICAgIEluc3RhbmNlQ2FsbCxcclxuICAgIFN0YXRpY0NhbGwsXHJcbiAgICBFeHRlcm5hbENhbGwsXHJcbiAgICBUeXBlT2YsXHJcbiAgICBJbnZva2VEZWxlZ2F0ZVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuL1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJhbWV0ZXJ7XHJcbiAgICBcclxuICAgIHR5cGU/OlR5cGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG5hbWU6c3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHR5cGVOYW1lOnN0cmluZyl7XHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi9NZXRob2RcIjtcclxuaW1wb3J0IHsgQXR0cmlidXRlIH0gZnJvbSBcIi4vQXR0cmlidXRlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHlwZXsgICAgICBcclxuICAgIGZpZWxkczpGaWVsZFtdID0gW107XHJcbiAgICBtZXRob2RzOk1ldGhvZFtdID0gW107IFxyXG4gICAgYXR0cmlidXRlczpBdHRyaWJ1dGVbXSA9IFtdO1xyXG5cclxuICAgIGdldCBpc1N5c3RlbVR5cGUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5uYW1lLnN0YXJ0c1dpdGgoXCJ+XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0Fub255bW91c1R5cGUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5uYW1lLnN0YXJ0c1dpdGgoXCI8fj5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6c3RyaW5nLCBwdWJsaWMgYmFzZVR5cGVOYW1lOnN0cmluZyl7XHJcblxyXG4gICAgfSAgICBcclxufSIsImV4cG9ydCBjbGFzcyBWZXJzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG1ham9yOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBtaW5vcjpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgcGF0Y2g6bnVtYmVyKXtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLm1ham9yfS4ke3RoaXMubWlub3J9LiR7dGhpcy5wYXRjaH1gO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tIFwiLi4vY29tbW9uL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IEVudHJ5UG9pbnRBdHRyaWJ1dGUgfSBmcm9tIFwiLi4vbGlicmFyeS9FbnRyeVBvaW50QXR0cmlidXRlXCI7XHJcbmltcG9ydCB7IFRhbG9uTGV4ZXIgfSBmcm9tIFwiLi9sZXhpbmcvVGFsb25MZXhlclwiO1xyXG5pbXBvcnQgeyBUYWxvblBhcnNlciB9IGZyb20gXCIuL3BhcnNpbmcvVGFsb25QYXJzZXJcIjtcclxuaW1wb3J0IHsgVGFsb25TZW1hbnRpY0FuYWx5emVyIH0gZnJvbSBcIi4vc2VtYW50aWNzL1RhbG9uU2VtYW50aWNBbmFseXplclwiO1xyXG5pbXBvcnQgeyBUYWxvblRyYW5zZm9ybWVyIH0gZnJvbSBcIi4vdHJhbnNmb3JtaW5nL1RhbG9uVHJhbnNmb3JtZXJcIjtcclxuaW1wb3J0IHsgVmVyc2lvbiB9IGZyb20gXCIuLi9jb21tb24vVmVyc2lvblwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uL3J1bnRpbWUvSU91dHB1dFwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IERlbGVnYXRlIH0gZnJvbSBcIi4uL2xpYnJhcnkvRGVsZWdhdGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvbkNvbXBpbGVye1xyXG4gICAgZ2V0IGxhbmd1YWdlVmVyc2lvbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVyc2lvbigxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmVyc2lvbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVyc2lvbigxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuICAgIH1cclxuXHJcbiAgICBjb21waWxlKGNvZGU6c3RyaW5nKTpUeXBlW117XHJcbiAgICAgICAgdGhpcy5vdXQud3JpdGUoXCJTdGFydGluZyBjb21waWxhdGlvbi4uLlwiKTtcclxuXHJcbiAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICBjb25zdCBsZXhlciA9IG5ldyBUYWxvbkxleGVyKHRoaXMub3V0KTtcclxuICAgICAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IFRhbG9uUGFyc2VyKHRoaXMub3V0KTtcclxuICAgICAgICAgICAgY29uc3QgYW5hbHl6ZXIgPSBuZXcgVGFsb25TZW1hbnRpY0FuYWx5emVyKHRoaXMub3V0KTtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSBuZXcgVGFsb25UcmFuc2Zvcm1lcih0aGlzLm91dCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0b2tlbnMgPSBsZXhlci50b2tlbml6ZShjb2RlKTtcclxuICAgICAgICAgICAgY29uc3QgYXN0ID0gcGFyc2VyLnBhcnNlKHRva2Vucyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuYWx5emVkQXN0ID0gYW5hbHl6ZXIuYW5hbHl6ZShhc3QpO1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRyYW5zZm9ybWVyLnRyYW5zZm9ybShhbmFseXplZEFzdCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBlbnRyeVBvaW50ID0gdGhpcy5jcmVhdGVFbnRyeVBvaW50KCk7XHJcblxyXG4gICAgICAgICAgICB0eXBlcy5wdXNoKGVudHJ5UG9pbnQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVzO1xyXG4gICAgICAgIH0gY2F0Y2goZXgpe1xyXG4gICAgICAgICAgICBpZiAoZXggaW5zdGFuY2VvZiBDb21waWxhdGlvbkVycm9yKXtcclxuICAgICAgICAgICAgICAgIHRoaXMub3V0LndyaXRlKGBFcnJvcjogJHtleC5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfSBmaW5hbGx5e1xyXG4gICAgICAgICAgICB0aGlzLm91dC53cml0ZShcIkNvbXBpbGF0aW9uIGNvbXBsZXRlLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVFbnRyeVBvaW50KCl7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IG5ldyBUeXBlKFwifmVudHJ5UG9pbnRcIiwgXCJ+ZW1wdHlcIik7XHJcblxyXG4gICAgICAgIHR5cGUuYXR0cmlidXRlcy5wdXNoKG5ldyBFbnRyeVBvaW50QXR0cmlidXRlKCkpO1xyXG5cclxuICAgICAgICBjb25zdCBtYWluID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgIG1haW4ubmFtZSA9IEFueS5tYWluO1xyXG4gICAgICAgIG1haW4uYm9keS5wdXNoKFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGBUYWxvbiBMYW5ndWFnZSB2LiR7dGhpcy5sYW5ndWFnZVZlcnNpb259LCBDb21waWxlciB2LiR7dGhpcy52ZXJzaW9ufWApLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLCAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIlwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uc3RhdGljQ2FsbChcIn5nbG9iYWxTYXlzXCIsIFwifnNheVwiKSwgICAgICAgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiV2hhdCB3b3VsZCB5b3UgbGlrZSB0byBkbz9cIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnJlYWRJbnB1dCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wYXJzZUNvbW1hbmQoKSwgICAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmhhbmRsZUNvbW1hbmQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uaXNUeXBlT2YoRGVsZWdhdGUudHlwZU5hbWUpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5icmFuY2hSZWxhdGl2ZUlmRmFsc2UoMiksICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmludm9rZURlbGVnYXRlKCksICAgICAgICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmUoLTQpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5nb1RvKDkpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdHlwZS5tZXRob2RzLnB1c2gobWFpbik7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENvbXBpbGF0aW9uRXJyb3J7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG1lc3NhZ2U6c3RyaW5nKXtcclxuXHJcbiAgICB9XHJcbn0iLCJpbnRlcmZhY2UgSW5kZXhhYmxle1xyXG4gICAgW2tleTpzdHJpbmddOmFueTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEtleXdvcmRze1xyXG4gICAgXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYW4gPSBcImFuXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYSA9IFwiYVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRoZSA9IFwidGhlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaXMgPSBcImlzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkga2luZCA9IFwia2luZFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG9mID0gXCJvZlwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBsYWNlID0gXCJwbGFjZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGl0ZW0gPSBcIml0ZW1cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpdCA9IFwiaXRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBoYXMgPSBcImhhc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGlmID0gXCJpZlwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRlc2NyaXB0aW9uID0gXCJkZXNjcmlwdGlvblwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHVuZGVyc3RhbmQgPSBcInVuZGVyc3RhbmRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBhcyA9IFwiYXNcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZXNjcmliaW5nID0gXCJkZXNjcmliaW5nXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGVzY3JpYmVkID0gXCJkZXNjcmliZWRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB3aGVyZSA9IFwid2hlcmVcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwbGF5ZXIgPSBcInBsYXllclwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHN0YXJ0cyA9IFwic3RhcnRzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY29udGFpbnMgPSBcImNvbnRhaW5zXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc2F5ID0gXCJzYXlcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkaXJlY3Rpb25zID0gXCJkaXJlY3Rpb25zXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgbW92aW5nID0gXCJtb3ZpbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0YWtpbmcgPSBcInRha2luZ1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGludmVudG9yeSA9IFwiaW52ZW50b3J5XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY2FuID0gXCJjYW5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSByZWFjaCA9IFwicmVhY2hcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBieSA9IFwiYnlcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBnb2luZyA9IFwiZ29pbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBhbmQgPSBcImFuZFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRoZW4gPSBcInRoZW5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBlbHNlID0gXCJlbHNlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgd2hlbiA9IFwid2hlblwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGVudGVycyA9IFwiZW50ZXJzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZXhpdHMgPSBcImV4aXRzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc3RvcCA9IFwic3RvcFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRyb3BwaW5nID0gXCJkcm9wcGluZ1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRoYXQgPSBcInRoYXRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBzZXQgPSBcInNldFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRvID0gXCJ0b1wiO1xyXG5cclxuICAgIHN0YXRpYyBnZXRBbGwoKTpTZXQ8c3RyaW5nPntcclxuICAgICAgICB0eXBlIEtleXdvcmRQcm9wZXJ0aWVzID0ga2V5b2YgS2V5d29yZHM7XHJcblxyXG4gICAgICAgIGNvbnN0IGFsbEtleXdvcmRzID0gbmV3IFNldDxzdHJpbmc+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoS2V5d29yZHMpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGtleXdvcmQgb2YgbmFtZXMpe1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IChLZXl3b3JkcyBhcyBJbmRleGFibGUpW2tleXdvcmRdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZSAhPSBcIktleXdvcmRzXCIpe1xyXG4gICAgICAgICAgICAgICAgYWxsS2V5d29yZHMuYWRkKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFsbEtleXdvcmRzO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFB1bmN0dWF0aW9ue1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBlcmlvZCA9IFwiLlwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNvbG9uID0gXCI6XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc2VtaWNvbG9uID0gXCI7XCI7XHJcbn0iLCJpbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuL1Rva2VuXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4vS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgUHVuY3R1YXRpb24gfSBmcm9tIFwiLi9QdW5jdHVhdGlvblwiO1xyXG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi8uLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvbkxleGVye1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgYWxsS2V5d29yZHMgPSBLZXl3b3Jkcy5nZXRBbGwoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdG9rZW5pemUoY29kZTpzdHJpbmcpOlRva2VuW117XHJcbiAgICAgICAgbGV0IGN1cnJlbnRMaW5lID0gMTtcclxuICAgICAgICBsZXQgY3VycmVudENvbHVtbiA9IDE7XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuczpUb2tlbltdID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNvZGUubGVuZ3RoOyApe1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IGNvZGUuY2hhckF0KGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q2hhciA9PSBcIiBcIil7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29sdW1uKys7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q2hhciA9PSBcIlxcblwiKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb2x1bW4gPSAxO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUrKztcclxuICAgICAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHRva2VuVmFsdWUgPSB0aGlzLmNvbnN1bWVUb2tlbkNoYXJzQXQoY29kZSwgaW5kZXgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHRva2VuVmFsdWUubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IG5ldyBUb2tlbihjdXJyZW50TGluZSwgY3VycmVudENvbHVtbiwgdG9rZW5WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnRDb2x1bW4gKz0gdG9rZW5WYWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGluZGV4ICs9IHRva2VuVmFsdWUubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NpZnkodG9rZW5zKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsYXNzaWZ5KHRva2VuczpUb2tlbltdKTpUb2tlbltde1xyXG4gICAgICAgIGZvcihsZXQgdG9rZW4gb2YgdG9rZW5zKXtcclxuICAgICAgICAgICAgaWYgKHRva2VuLnZhbHVlID09IFB1bmN0dWF0aW9uLnBlcmlvZCl7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLlRlcm1pbmF0b3I7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4udmFsdWUgPT0gUHVuY3R1YXRpb24uc2VtaWNvbG9uKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuU2VtaVRlcm1pbmF0b3I7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4udmFsdWUgPT0gUHVuY3R1YXRpb24uY29sb24pe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5PcGVuTWV0aG9kQmxvY2s7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVGFsb25MZXhlci5hbGxLZXl3b3Jkcy5oYXModG9rZW4udmFsdWUpKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuS2V5d29yZDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbi52YWx1ZS5zdGFydHNXaXRoKFwiXFxcIlwiKSAmJiB0b2tlbi52YWx1ZS5lbmRzV2l0aChcIlxcXCJcIikpe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5TdHJpbmc7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWlzTmFOKE51bWJlcih0b2tlbi52YWx1ZSkpKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLk51bWJlcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuSWRlbnRpZmllcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRva2VucztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbnN1bWVUb2tlbkNoYXJzQXQoY29kZTpzdHJpbmcsIGluZGV4Om51bWJlcik6c3RyaW5ne1xyXG4gICAgICAgIGNvbnN0IHRva2VuQ2hhcnM6c3RyaW5nW10gPSBbXTtcclxuICAgICAgICBjb25zdCBzdHJpbmdEZWxpbWl0ZXIgPSBcIlxcXCJcIjtcclxuXHJcbiAgICAgICAgbGV0IGlzQ29uc3VtaW5nU3RyaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvcihsZXQgcmVhZEFoZWFkSW5kZXggPSBpbmRleDsgcmVhZEFoZWFkSW5kZXggPCBjb2RlLmxlbmd0aDsgcmVhZEFoZWFkSW5kZXgrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDaGFyID0gY29kZS5jaGFyQXQocmVhZEFoZWFkSW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlzQ29uc3VtaW5nU3RyaW5nICYmIGN1cnJlbnRDaGFyICE9IHN0cmluZ0RlbGltaXRlcil7XHJcbiAgICAgICAgICAgICAgICB0b2tlbkNoYXJzLnB1c2goY3VycmVudENoYXIpO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q2hhciA9PSBzdHJpbmdEZWxpbWl0ZXIpeyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRva2VuQ2hhcnMucHVzaChjdXJyZW50Q2hhcik7ICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGlzQ29uc3VtaW5nU3RyaW5nID0gIWlzQ29uc3VtaW5nU3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc0NvbnN1bWluZ1N0cmluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7ICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDaGFyID09IFwiIFwiIHx8IGN1cnJlbnRDaGFyID09IFwiXFxuXCIgfHwgY3VycmVudENoYXIgPT0gUHVuY3R1YXRpb24ucGVyaW9kIHx8IGN1cnJlbnRDaGFyID09IFB1bmN0dWF0aW9uLmNvbG9uIHx8IGN1cnJlbnRDaGFyID09IFB1bmN0dWF0aW9uLnNlbWljb2xvbil7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW5DaGFycy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5DaGFycy5wdXNoKGN1cnJlbnRDaGFyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0b2tlbkNoYXJzLnB1c2goY3VycmVudENoYXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRva2VuQ2hhcnMuam9pbihcIlwiKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL1Rva2VuVHlwZVwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IEJvb2xlYW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQm9vbGVhblR5cGVcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0l0ZW1cIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUb2tlbntcclxuICAgIHN0YXRpYyBnZXQgZW1wdHkoKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKFwifmVtcHR5XCIsIFRva2VuVHlwZS5Vbmtub3duKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvckFueSgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoQW55LnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JQbGFjZSgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoUGxhY2UudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvckl0ZW0oKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKEl0ZW0udHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvcldvcmxkT2JqZWN0KCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihXb3JsZE9iamVjdC50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yQm9vbGVhbigpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoQm9vbGVhblR5cGUudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvckxpc3QoKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKExpc3QudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRUb2tlbldpdGhUeXBlT2YobmFtZTpzdHJpbmcsIHR5cGU6VG9rZW5UeXBlKXtcclxuICAgICAgICBjb25zdCB0b2tlbiA9IG5ldyBUb2tlbigtMSwtMSxuYW1lKTtcclxuICAgICAgICB0b2tlbi50eXBlID0gdHlwZTtcclxuICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9XHJcblxyXG4gICAgdHlwZTpUb2tlblR5cGUgPSBUb2tlblR5cGUuVW5rbm93bjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbGluZTpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgY29sdW1uOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB2YWx1ZTpzdHJpbmcpe1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gVG9rZW5UeXBle1xyXG4gICAgVW5rbm93bixcclxuICAgIEtleXdvcmQsXHJcbiAgICBUZXJtaW5hdG9yLFxyXG4gICAgU2VtaVRlcm1pbmF0b3IsXHJcbiAgICBTdHJpbmcsXHJcbiAgICBJZGVudGlmaWVyLFxyXG4gICAgTnVtYmVyLFxyXG4gICAgT3Blbk1ldGhvZEJsb2NrXHJcbn0iLCJpbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5cIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uL2xleGluZy9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi8uLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJzZUNvbnRleHR7XHJcbiAgICBpbmRleDpudW1iZXIgPSAwO1xyXG5cclxuICAgIGdldCBpc0RvbmUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleCA+PSB0aGlzLnRva2Vucy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnJlbnRUb2tlbigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmluZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHRva2VuczpUb2tlbltdLCBwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuICAgICAgICB0aGlzLm91dC53cml0ZShgJHt0b2tlbnMubGVuZ3RofSB0b2tlbnMgZGlzY292ZXJlZCwgcGFyc2luZy4uLmApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN1bWVDdXJyZW50VG9rZW4oKXtcclxuICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMuY3VycmVudFRva2VuO1xyXG5cclxuICAgICAgICB0aGlzLmluZGV4Kys7XHJcblxyXG4gICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH1cclxuXHJcbiAgICBpcyh0b2tlblZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRva2VuPy52YWx1ZSA9PSB0b2tlblZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVHlwZU9mKHR5cGU6VG9rZW5UeXBlKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VG9rZW4udHlwZSA9PSB0eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQW55VHlwZU9mKC4uLnR5cGVzOlRva2VuVHlwZVtdKXtcclxuICAgICAgICBmb3IoY29uc3QgdHlwZSBvZiB0eXBlcyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVHlwZU9mKHR5cGUpKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaXNBbnlPZiguLi50b2tlblZhbHVlczpzdHJpbmdbXSl7XHJcbiAgICAgICAgZm9yKGxldCB2YWx1ZSBvZiB0b2tlblZhbHVlcyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzKHZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVGVybWluYXRvcigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUb2tlbi50eXBlID09IFRva2VuVHlwZS5UZXJtaW5hdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdEFueU9mKC4uLnRva2VuVmFsdWVzOnN0cmluZ1tdKXtcclxuICAgICAgICBpZiAoIXRoaXMuaXNBbnlPZiguLi50b2tlblZhbHVlcykpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIHRva2Vuc1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdCh0b2tlblZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRva2VuLnZhbHVlICE9IHRva2VuVmFsdWUpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgRXhwZWN0ZWQgdG9rZW4gJyR7dG9rZW5WYWx1ZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0U3RyaW5nKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRva2VuLnR5cGUgIT0gVG9rZW5UeXBlLlN0cmluZyl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiRXhwZWN0ZWQgc3RyaW5nXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuXHJcbiAgICAgICAgLy8gV2UgbmVlZCB0byBzdHJpcCBvZmYgdGhlIGRvdWJsZSBxdW90ZXMgZnJvbSB0aGVpciBzdHJpbmcgYWZ0ZXIgd2UgY29uc3VtZSBpdC5cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gbmV3IFRva2VuKHRva2VuLmxpbmUsIHRva2VuLmNvbHVtbiwgdG9rZW4udmFsdWUuc3Vic3RyaW5nKDEsIHRva2VuLnZhbHVlLmxlbmd0aCAtIDEpKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3ROdW1iZXIoKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9rZW4udHlwZSAhPSBUb2tlblR5cGUuTnVtYmVyKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJFeHBlY3RlZCBudW1iZXJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0SWRlbnRpZmllcigpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi50eXBlICE9IFRva2VuVHlwZS5JZGVudGlmaWVyKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJFeHBlY3RlZCBpZGVudGlmaWVyXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdFRlcm1pbmF0b3IoKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9rZW4udHlwZSAhPSBUb2tlblR5cGUuVGVybWluYXRvcil7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiRXhwZWN0ZWQgZXhwcmVzc2lvbiB0ZXJtaW5hdG9yXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdFNlbWlUZXJtaW5hdG9yKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRva2VuLnR5cGUgIT0gVG9rZW5UeXBlLlNlbWlUZXJtaW5hdG9yKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJFeHBlY3RlZCBzZW1pIGV4cHJlc3Npb24gdGVybWluYXRvclwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RPcGVuTWV0aG9kQmxvY2soKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9rZW4udHlwZSAhPSBUb2tlblR5cGUuT3Blbk1ldGhvZEJsb2NrKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJFeHBlY3RlZCBvcGVuIG1ldGhvZCBibG9ja1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4uL2xleGluZy9Ub2tlblwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQcm9ncmFtVmlzaXRvciB9IGZyb20gXCIuL3Zpc2l0b3JzL1Byb2dyYW1WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uLy4uL3J1bnRpbWUvSU91dHB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uUGFyc2Vye1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXQ6SU91dHB1dCl7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwYXJzZSh0b2tlbnM6VG9rZW5bXSk6RXhwcmVzc2lvbntcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gbmV3IFBhcnNlQ29udGV4dCh0b2tlbnMsIHRoaXMub3V0KTtcclxuICAgICAgICBjb25zdCB2aXNpdG9yID0gbmV3IFByb2dyYW1WaXNpdG9yKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBY3Rpb25zRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgYWN0aW9uczpFeHByZXNzaW9uW10pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJpbmFyeUV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgbGVmdD86RXhwcmVzc2lvbjtcclxuICAgIHJpZ2h0PzpFeHByZXNzaW9uO1xyXG59IiwiaW1wb3J0IHsgQmluYXJ5RXhwcmVzc2lvbiB9IGZyb20gXCIuL0JpbmFyeUV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb25jYXRlbmF0aW9uRXhwcmVzc2lvbiBleHRlbmRzIEJpbmFyeUV4cHJlc3Npb257XHJcbiAgICBcclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udGFpbnNFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB0YXJnZXROYW1lOnN0cmluZyxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBjb3VudDpudW1iZXIsIFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHR5cGVOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBFeHByZXNzaW9ue1xyXG4gICAgXHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4vVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBCaW5hcnlFeHByZXNzaW9uIH0gZnJvbSBcIi4vQmluYXJ5RXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHR5cGVOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICBpbml0aWFsVmFsdWU/Ok9iamVjdDtcclxuICAgIHR5cGU/OlR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb247XHJcbiAgICBhc3NvY2lhdGVkRXhwcmVzc2lvbnM6QmluYXJ5RXhwcmVzc2lvbltdID0gW107XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIElmRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgY29uZGl0aW9uYWw6RXhwcmVzc2lvbixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBpZkJsb2NrOkV4cHJlc3Npb24sXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgZWxzZUJsb2NrOkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExpdGVyYWxFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB0eXBlTmFtZTpzdHJpbmcsIHB1YmxpYyByZWFkb25seSB2YWx1ZTpPYmplY3Qpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb2dyYW1FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGV4cHJlc3Npb25zOkV4cHJlc3Npb25bXSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2F5RXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGV4dDpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNldFZhcmlhYmxlRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgaW5zdGFuY2VOYW1lOnN0cmluZ3x1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdmFyaWFibGVOYW1lOnN0cmluZywgXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgZXZhbHVhdGlvbkV4cHJlc3Npb246RXhwcmVzc2lvbil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4uLy4uL2xleGluZy9Ub2tlblwiO1xyXG5pbXBvcnQgeyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuL0ZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi9XaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBuYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICBiYXNlVHlwZT86VHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbjtcclxuICAgIGZpZWxkczpGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbltdID0gW107XHJcbiAgICBldmVudHM6V2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbltdID0gW107XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWVUb2tlbjpUb2tlbiwgcmVhZG9ubHkgYmFzZVR5cGVOYW1lVG9rZW46VG9rZW4pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZVRva2VuLnZhbHVlO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdmFsdWU6c3RyaW5nLCBwdWJsaWMgcmVhZG9ubHkgbWVhbmluZzpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGFjdG9yOnN0cmluZyxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBldmVudEtpbmQ6c3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGFjdGlvbnM6RXhwcmVzc2lvbil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgUHVuY3R1YXRpb24gfSBmcm9tIFwiLi4vLi4vbGV4aW5nL1B1bmN0dWF0aW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBBY3Rpb25zRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9BY3Rpb25zRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV2ZW50RXhwcmVzc2lvblZpc2l0b3IgZXh0ZW5kcyBFeHByZXNzaW9uVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6UGFyc2VDb250ZXh0KTpFeHByZXNzaW9ue1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGFjdGlvbnM6RXhwcmVzc2lvbltdID0gW107XHJcblxyXG4gICAgICAgIHdoaWxlKCFjb250ZXh0LmlzKEtleXdvcmRzLmFuZCkpe1xyXG4gICAgICAgICAgICBjb25zdCBhY3Rpb24gPSBzdXBlci52aXNpdChjb250ZXh0KTtcclxuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKGFjdGlvbik7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdFNlbWlUZXJtaW5hdG9yKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hbmQpO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnRoZW4pO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnN0b3ApO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0VGVybWluYXRvcigpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFjdGlvbnNFeHByZXNzaW9uKGFjdGlvbnMpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IElmRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9JZkV4cHJlc3Npb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IENvbnRhaW5zRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9Db250YWluc0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgU2F5RXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9TYXlFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuLi8uLi9sZXhpbmcvVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IFNldFZhcmlhYmxlRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9TZXRWYXJpYWJsZUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgTGl0ZXJhbEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvTGl0ZXJhbEV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5pZikpe1xyXG4gICAgICAgICAgICBjb25zdCB2aXNpdG9yID0gbmV3IElmRXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLml0KSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLml0KTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuY29udGFpbnMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY291bnQgPSBjb250ZXh0LmV4cGVjdE51bWJlcigpO1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlTmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb250YWluc0V4cHJlc3Npb24oXCJ+aXRcIiwgTnVtYmVyKGNvdW50LnZhbHVlKSwgdHlwZU5hbWUudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5zZXQpKXtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuc2V0KTtcclxuXHJcbiAgICAgICAgICAgIGxldCB2YXJpYWJsZU5hbWU6c3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLlN0cmluZykpe1xyXG4gICAgICAgICAgICAgICAgdmFyaWFibGVOYW1lID0gY29udGV4dC5leHBlY3RTdHJpbmcoKS52YWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IFN1cHBvcnQgZGVyZWZlcmVuY2luZyBhcmJpdHJhcnkgaW5zdGFuY2VzLlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJDdXJyZW50bHkgdW5hYmxlIHRvIGRlcmVmZXJlbmNlIGEgZmllbGQsIHBsYW5uZWQgZm9yIGEgZnV0dXJlIHJlbGVhc2VcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnRvKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB2YWx1ZTpPYmplY3Q7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuU3RyaW5nKSl7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG5ldyBMaXRlcmFsRXhwcmVzc2lvbihTdHJpbmdUeXBlLnR5cGVOYW1lLCBjb250ZXh0LmV4cGVjdFN0cmluZygpLnZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzVHlwZU9mKFRva2VuVHlwZS5OdW1iZXIpKXtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gbmV3IExpdGVyYWxFeHByZXNzaW9uKE51bWJlclR5cGUudHlwZU5hbWUsIGNvbnRleHQuZXhwZWN0TnVtYmVyKCkudmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogU3VwcG9ydCBkZXJlZmVyZW5jaW5nIGFyYml0cmFyeSBpbnN0YW5jZXMuXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkN1cnJlbnQgdW5hYmxlIHRvIHN1cHBvcnQgYXNzaWduaW5nIGZyb20gZGVyZWZlbmNlZCBpbnN0YW5jZXMsIHBsYW5uZWQgZm9yIGEgZnV0dXJlIHJlbGVhc2VcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU2V0VmFyaWFibGVFeHByZXNzaW9uKHVuZGVmaW5lZCwgdmFyaWFibGVOYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLnNheSkpe1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5zYXkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFNheUV4cHJlc3Npb24odGV4dC52YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJVbmFibGUgdG8gcGFyc2UgZXhwcmVzc2lvblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0ZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4uLy4uL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvclwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFN0cmluZ1R5cGUgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9TdHJpbmdUeXBlXCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IEFuZEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvQW5kRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0V4cHJlc3Npb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IENvbmNhdGVuYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0NvbmNhdGVuYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuLi8uLi9sZXhpbmcvVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IE51bWJlclR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9OdW1iZXJUeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRmllbGREZWNsYXJhdGlvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZpZWxkID0gbmV3IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLml0KTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuaXMpKXtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuZGVzY3JpYmVkKSl7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5kZXNjcmliZWQpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaWVsZC5uYW1lID0gV29ybGRPYmplY3QuZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IFN0cmluZ1R5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBkZXNjcmlwdGlvbi52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY29udGV4dC5pcyhLZXl3b3Jkcy5hbmQpKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb25WaXNpdG9yID0gbmV3IEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb25WaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0RXhwcmVzc2lvbiA9IChmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnMubGVuZ3RoID09IDApID8gZmllbGQgOiBmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnNbZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zLmxlbmd0aCAtIDFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25jYXQgPSBuZXcgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uY2F0LmxlZnQgPSBsZWZ0RXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgICAgICAgICBjb25jYXQucmlnaHQgPSBleHByZXNzaW9uO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnMucHVzaChjb25jYXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLndoZXJlKSl7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy53aGVyZSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy50aGUpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMucGxheWVyKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnN0YXJ0cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IFBsYWNlLmlzUGxheWVyU3RhcnQ7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IEJvb2xlYW5UeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiVW5hYmxlIHRvIGRldGVybWluZSBwcm9wZXJ0eSBmaWVsZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5oYXMpKXtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmhhcyk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmEpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy50aGF0KTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLlN0cmluZykpe1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gY29udGV4dC5leHBlY3RTdHJpbmcoKS52YWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzVHlwZU9mKFRva2VuVHlwZS5OdW1iZXIpKXtcclxuICAgICAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gTnVtYmVyVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IGNvbnRleHQuZXhwZWN0TnVtYmVyKCkudmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgRXhwZWN0ZWQgYSBzdHJpbmcgb3IgYSBudW1iZXIgYnV0IGZvdW5kICcke2NvbnRleHQuY3VycmVudFRva2VuLnZhbHVlfSdgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBuYW1lLnZhbHVlO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuY29udGFpbnMpKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmNvbnRhaW5zKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gY29udGV4dC5leHBlY3ROdW1iZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgLy8gVE9ETzogU3VwcG9ydCBtdWx0aXBsZSBjb250ZW50IGVudHJpZXMuXHJcblxyXG4gICAgICAgICAgICBmaWVsZC5uYW1lID0gV29ybGRPYmplY3QuY29udGVudHM7XHJcbiAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gTGlzdC50eXBlTmFtZTtcclxuICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gW1tOdW1iZXIoY291bnQudmFsdWUpLCBuYW1lLnZhbHVlXV07IFxyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5jYW4pKXtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmNhbik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnJlYWNoKTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlTmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYnkpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5nb2luZyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgZmllbGQubmFtZSA9IGB+JHtkaXJlY3Rpb24udmFsdWV9YDtcclxuICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBgJHtwbGFjZU5hbWUudmFsdWV9YDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byBkZXRlcm1pbmUgZmllbGRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0VGVybWluYXRvcigpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmllbGQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBJZkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvSWZFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSWZFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pZik7XHJcblxyXG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb25WaXNpdG9yID0gbmV3IEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgY29uc3QgY29uZGl0aW9uYWwgPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlbik7XHJcblxyXG4gICAgICAgIGNvbnN0IGlmQmxvY2sgPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuZWxzZSkpe1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5lbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGVsc2VCbG9jayA9IGV4cHJlc3Npb25WaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBJZkV4cHJlc3Npb24oY29uZGl0aW9uYWwsIGlmQmxvY2ssIGVsc2VCbG9jayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IElmRXhwcmVzc2lvbihjb25kaXRpb25hbCwgaWZCbG9jaywgbmV3IEV4cHJlc3Npb24oKSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL1R5cGVEZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgUHJvZ3JhbUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvUHJvZ3JhbUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi8uLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgU2F5RXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9TYXlFeHByZXNzaW9uVmlzaXRvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb2dyYW1WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGxldCBleHByZXNzaW9uczpFeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUoIWNvbnRleHQuaXNEb25lKXtcclxuICAgICAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMudW5kZXJzdGFuZCkpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uID0gbmV3IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB1bmRlcnN0YW5kaW5nRGVjbGFyYXRpb24udmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzQW55T2YoS2V5d29yZHMuYSwgS2V5d29yZHMuYW4pKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVEZWNsYXJhdGlvbiA9IG5ldyBUeXBlRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gdHlwZURlY2xhcmF0aW9uLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5zYXkpKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNheUV4cHJlc3Npb24gPSBuZXcgU2F5RXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBzYXlFeHByZXNzaW9uLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEF0IHRoZSB0b3AgbGV2ZWwsIGEgc2F5IGV4cHJlc3Npb24gbXVzdCBoYXZlIGEgdGVybWluYXRvci4gV2UncmUgZXZhbHVhdGluZyBpdCBvdXQgaGVyZVxyXG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSBhIHNheSBleHByZXNzaW9uIG5vcm1hbGx5IGRvZXNuJ3QgcmVxdWlyZSBvbmUuXHJcblxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYEZvdW5kIHVuZXhwZWN0ZWQgdG9rZW4gJyR7Y29udGV4dC5jdXJyZW50VG9rZW4udmFsdWV9J2ApO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb2dyYW1FeHByZXNzaW9uKGV4cHJlc3Npb25zKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBTYXlFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1NheUV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTYXlFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5zYXkpO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0ID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBTYXlFeHByZXNzaW9uKHRleHQudmFsdWUpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4uLy4uL2xleGluZy9Ub2tlblwiO1xyXG5pbXBvcnQgeyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1R5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvblZpc2l0b3IgfSBmcm9tIFwiLi9GaWVsZERlY2xhcmF0aW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1doZW5EZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgV2hlbkRlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL1doZW5EZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBlRGVjbGFyYXRpb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0QW55T2YoS2V5d29yZHMuYSwgS2V5d29yZHMuYW4pO1xyXG5cclxuICAgICAgICBjb25zdCBuYW1lID0gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmlzKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5raW5kKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5vZik7XHJcblxyXG4gICAgICAgIGNvbnN0IGJhc2VUeXBlID0gdGhpcy5leHBlY3RCYXNlVHlwZShjb250ZXh0KTtcclxuICAgICAgICBcclxuICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZmllbGRzOkZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGNvbnRleHQuaXMoS2V5d29yZHMuaXQpKXtcclxuICAgICAgICAgICAgY29uc3QgZmllbGRWaXNpdG9yID0gbmV3IEZpZWxkRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gZmllbGRWaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgZmllbGRzLnB1c2goPEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uPmZpZWxkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGV2ZW50czpXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGNvbnRleHQuaXMoS2V5d29yZHMud2hlbikpe1xyXG4gICAgICAgICAgICBjb25zdCB3aGVuVmlzaXRvciA9IG5ldyBXaGVuRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHdoZW4gPSB3aGVuVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIGV2ZW50cy5wdXNoKDxXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uPndoZW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHlwZURlY2xhcmF0aW9uID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24obmFtZSwgYmFzZVR5cGUpO1xyXG5cclxuICAgICAgICB0eXBlRGVjbGFyYXRpb24uZmllbGRzID0gZmllbGRzO1xyXG4gICAgICAgIHR5cGVEZWNsYXJhdGlvbi5ldmVudHMgPSBldmVudHM7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlRGVjbGFyYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBleHBlY3RCYXNlVHlwZShjb250ZXh0OlBhcnNlQ29udGV4dCl7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXNBbnlPZihLZXl3b3Jkcy5wbGFjZSwgS2V5d29yZHMuaXRlbSkpe1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnVuZGVyc3RhbmQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYXMpO1xyXG5cclxuICAgICAgICBjb25zdCBtZWFuaW5nID0gY29udGV4dC5leHBlY3RBbnlPZihLZXl3b3Jkcy5kZXNjcmliaW5nLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy5tb3ZpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2V5d29yZHMuZGlyZWN0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy50YWtpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2V5d29yZHMuaW52ZW50b3J5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEtleXdvcmRzLmRyb3BwaW5nKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbih2YWx1ZS52YWx1ZSwgbWVhbmluZy52YWx1ZSk7ICAgICAgICBcclxuICAgIH1cclxufSIsImltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVmlzaXRvcntcclxuICAgIGFic3RyYWN0IHZpc2l0KGNvbnRleHQ6UGFyc2VDb250ZXh0KTpFeHByZXNzaW9uO1xyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQdW5jdHVhdGlvbiB9IGZyb20gXCIuLi8uLi9sZXhpbmcvUHVuY3R1YXRpb25cIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBFdmVudEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXZlbnRFeHByZXNzaW9uVmlzaXRvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoZW5EZWNsYXJhdGlvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMud2hlbik7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5wbGF5ZXIpO1xyXG5cclxuICAgICAgICBjb25zdCBldmVudEtpbmQgPSBjb250ZXh0LmV4cGVjdEFueU9mKEtleXdvcmRzLmVudGVycywgS2V5d29yZHMuZXhpdHMpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdE9wZW5NZXRob2RCbG9jaygpO1xyXG5cclxuICAgICAgICBjb25zdCBhY3Rpb25zVmlzaXRvciA9IG5ldyBFdmVudEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IGFjdGlvbnNWaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24oS2V5d29yZHMucGxheWVyLCBldmVudEtpbmQudmFsdWUsIGFjdGlvbnMpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFByb2dyYW1FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvUHJvZ3JhbUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1R5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25TZW1hbnRpY0FuYWx5emVye1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYW55ID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yQW55LCBUb2tlbi5lbXB0eSk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHdvcmxkT2JqZWN0ID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yV29ybGRPYmplY3QsIFRva2VuLmZvckFueSk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBsYWNlID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yUGxhY2UsIFRva2VuLmZvcldvcmxkT2JqZWN0KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgaXRlbSA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvckl0ZW0sIFRva2VuLmZvcldvcmxkT2JqZWN0KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYm9vbGVhblR5cGUgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JCb29sZWFuLCBUb2tlbi5mb3JBbnkpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBsaXN0ID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yTGlzdCwgVG9rZW4uZm9yQW55KTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFuYWx5emUoZXhwcmVzc2lvbjpFeHByZXNzaW9uKTpFeHByZXNzaW9ue1xyXG4gICAgICAgIGNvbnN0IHR5cGVzOlR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25bXSA9IFt0aGlzLmFueSwgdGhpcy53b3JsZE9iamVjdCwgdGhpcy5wbGFjZSwgdGhpcy5ib29sZWFuVHlwZSwgdGhpcy5pdGVtXTtcclxuXHJcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBQcm9ncmFtRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2hpbGQgb2YgZXhwcmVzc2lvbi5leHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHlwZXNCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbj4odHlwZXMubWFwKHggPT4gW3gubmFtZSwgeF0pKTtcclxuXHJcbiAgICAgICAgZm9yKGNvbnN0IGRlY2xhcmF0aW9uIG9mIHR5cGVzKXtcclxuICAgICAgICAgICAgY29uc3QgYmFzZVRva2VuID0gZGVjbGFyYXRpb24uYmFzZVR5cGVOYW1lVG9rZW47XHJcblxyXG4gICAgICAgICAgICBpZiAoYmFzZVRva2VuLnR5cGUgPT0gVG9rZW5UeXBlLktleXdvcmQgJiYgIWJhc2VUb2tlbi52YWx1ZS5zdGFydHNXaXRoKFwiflwiKSl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gYH4ke2Jhc2VUb2tlbi52YWx1ZX1gO1xyXG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb24uYmFzZVR5cGUgPSB0eXBlc0J5TmFtZS5nZXQobmFtZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbi5iYXNlVHlwZSA9IHR5cGVzQnlOYW1lLmdldChiYXNlVG9rZW4udmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgZmllbGQgb2YgZGVjbGFyYXRpb24uZmllbGRzKXtcclxuICAgICAgICAgICAgICAgIGZpZWxkLnR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoZmllbGQudHlwZU5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZXhwcmVzc2lvbjtcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIEV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGV7XHJcbiAgICBOb25lLFxyXG4gICAgSWdub3JlUmVzdWx0c09mU2F5RXhwcmVzc2lvblxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBQcm9ncmFtRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1Byb2dyYW1FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9VbmRlcnN0YW5kaW5nXCI7XHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IEJvb2xlYW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQm9vbGVhblR5cGVcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0l0ZW1cIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxheWVyXCI7XHJcbmltcG9ydCB7IFNheUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9TYXlFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IFNheSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1NheVwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuLi8uLi9jb21tb24vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgUGFyYW1ldGVyIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9QYXJhbWV0ZXJcIjtcclxuaW1wb3J0IHsgSWZFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvSWZFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IENvbmNhdGVuYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29udGFpbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29udGFpbnNFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQWN0aW9uc0V4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9BY3Rpb25zRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgRXZlbnRUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9FdmVudFR5cGVcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZSB9IGZyb20gXCIuL0V4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGVcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi8uLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgU2V0VmFyaWFibGVFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2V0VmFyaWFibGVFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IExpdGVyYWxFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvTGl0ZXJhbEV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvblRyYW5zZm9ybWVye1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXQ6SU91dHB1dCl7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZVN5c3RlbVR5cGVzKCl7XHJcbiAgICAgICAgY29uc3QgdHlwZXM6VHlwZVtdID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVGhlc2UgYXJlIG9ubHkgaGVyZSBhcyBzdHVicyBmb3IgZXh0ZXJuYWwgcnVudGltZSB0eXBlcyB0aGF0IGFsbG93IHVzIHRvIGNvcnJlY3RseSByZXNvbHZlIGZpZWxkIHR5cGVzLlxyXG5cclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKEFueS50eXBlTmFtZSwgQW55LnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShXb3JsZE9iamVjdC50eXBlTmFtZSwgV29ybGRPYmplY3QucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFBsYWNlLnR5cGVOYW1lLCBQbGFjZS5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoQm9vbGVhblR5cGUudHlwZU5hbWUsIEJvb2xlYW5UeXBlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShTdHJpbmdUeXBlLnR5cGVOYW1lLCBTdHJpbmdUeXBlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShOdW1iZXJUeXBlLnR5cGVOYW1lLCBOdW1iZXJUeXBlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShJdGVtLnR5cGVOYW1lLCBJdGVtLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShMaXN0LnR5cGVOYW1lLCBMaXN0LnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShQbGF5ZXIudHlwZU5hbWUsIFBsYXllci5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoU2F5LnR5cGVOYW1lLCBTYXkucGFyZW50VHlwZU5hbWUpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXA8c3RyaW5nLCBUeXBlPih0eXBlcy5tYXAoeCA9PiBbeC5uYW1lLCB4XSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybShleHByZXNzaW9uOkV4cHJlc3Npb24pOlR5cGVbXXtcclxuICAgICAgICBjb25zdCB0eXBlc0J5TmFtZSA9IHRoaXMuY3JlYXRlU3lzdGVtVHlwZXMoKTtcclxuICAgICAgICBsZXQgZHluYW1pY1R5cGVDb3VudCA9IDA7XHJcblxyXG4gICAgICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgUHJvZ3JhbUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBmb3IoY29uc3QgY2hpbGQgb2YgZXhwcmVzc2lvbi5leHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoYH4ke1VuZGVyc3RhbmRpbmcudHlwZU5hbWV9XyR7ZHluYW1pY1R5cGVDb3VudH1gLCBVbmRlcnN0YW5kaW5nLnR5cGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb24gPSBuZXcgRmllbGQoKTtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24ubmFtZSA9IFVuZGVyc3RhbmRpbmcuYWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5kZWZhdWx0VmFsdWUgPSBjaGlsZC52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVhbmluZyA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lYW5pbmcubmFtZSA9IFVuZGVyc3RhbmRpbmcubWVhbmluZztcclxuICAgICAgICAgICAgICAgICAgICBtZWFuaW5nLmRlZmF1bHRWYWx1ZSA9IGNoaWxkLm1lYW5pbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZS5maWVsZHMucHVzaChhY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUuZmllbGRzLnB1c2gobWVhbmluZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWNUeXBlQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZXNCeU5hbWUuc2V0KHR5cGUubmFtZSwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMudHJhbnNmb3JtSW5pdGlhbFR5cGVEZWNsYXJhdGlvbihjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZXNCeU5hbWUuc2V0KHR5cGUubmFtZSwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgY2hpbGQgb2YgZXhwcmVzc2lvbi5leHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gdHlwZXNCeU5hbWUuZ2V0KGNoaWxkLm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IoY29uc3QgZmllbGRFeHByZXNzaW9uIG9mIGNoaWxkLmZpZWxkcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZEV4cHJlc3Npb24ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBmaWVsZEV4cHJlc3Npb24udHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLnR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoZmllbGRFeHByZXNzaW9uLnR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZC50eXBlTmFtZSA9PSBTdHJpbmdUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IDxzdHJpbmc+ZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZU5hbWUgPT0gTnVtYmVyVHlwZS50eXBlTmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBOdW1iZXIoZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IGZpZWxkRXhwcmVzc2lvbi5pbml0aWFsVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZEV4cHJlc3Npb24uYXNzb2NpYXRlZEV4cHJlc3Npb25zLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2V0RmllbGQgPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5uYW1lID0gYH5nZXRfJHtmaWVsZC5uYW1lfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5wYXJhbWV0ZXJzLnB1c2gobmV3IFBhcmFtZXRlcihcIn52YWx1ZVwiLCBmaWVsZC50eXBlTmFtZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RmllbGQucmV0dXJuVHlwZSA9IGZpZWxkLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IoY29uc3QgYXNzb2NpYXRlZCBvZiBmaWVsZEV4cHJlc3Npb24uYXNzb2NpYXRlZEV4cHJlc3Npb25zKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5ib2R5LnB1c2goLi4udGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGFzc29jaWF0ZWQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5ib2R5LnB1c2goSW5zdHJ1Y3Rpb24ucmV0dXJuKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/Lm1ldGhvZHMucHVzaChnZXRGaWVsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/LmZpZWxkcy5wdXNoKGZpZWxkKTsgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpc1dvcmxkT2JqZWN0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgY3VycmVudCA9IHR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSB0eXBlc0J5TmFtZS5nZXQoY3VycmVudC5iYXNlVHlwZU5hbWUpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Lm5hbWUgPT0gV29ybGRPYmplY3QudHlwZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzV29ybGRPYmplY3QgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1dvcmxkT2JqZWN0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzY3JpYmUgPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaWJlLm5hbWUgPSBXb3JsZE9iamVjdC5kZXNjcmliZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpYmUuYm9keS5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRQcm9wZXJ0eShXb3JsZE9iamVjdC5kZXNjcmlwdGlvbiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucmV0dXJuKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/Lm1ldGhvZHMucHVzaChkZXNjcmliZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZHVwbGljYXRlRXZlbnRDb3VudCA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIGNoaWxkLmV2ZW50cyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXRob2QgPSBuZXcgTWV0aG9kKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLm5hbWUgPSBgfmV2ZW50XyR7ZXZlbnQuYWN0b3J9XyR7ZXZlbnQuZXZlbnRLaW5kfV8ke2R1cGxpY2F0ZUV2ZW50Q291bnR9YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5ldmVudFR5cGUgPSB0aGlzLnRyYW5zZm9ybUV2ZW50S2luZChldmVudC5ldmVudEtpbmQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cGxpY2F0ZUV2ZW50Q291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb25zID0gPEFjdGlvbnNFeHByZXNzaW9uPmV2ZW50LmFjdGlvbnM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGNvbnN0IGFjdGlvbiBvZiBhY3Rpb25zLmFjdGlvbnMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oYWN0aW9uLCBFeHByZXNzaW9uVHJhbnNmb3JtYXRpb25Nb2RlLklnbm9yZVJlc3VsdHNPZlNheUV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5ib2R5LnB1c2goLi4uYm9keSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmJvZHkucHVzaChJbnN0cnVjdGlvbi5yZXR1cm4oKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8ubWV0aG9kcy5wdXNoKG1ldGhvZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBnbG9iYWxTYXlzID0gZXhwcmVzc2lvbi5leHByZXNzaW9ucy5maWx0ZXIoeCA9PiB4IGluc3RhbmNlb2YgU2F5RXhwcmVzc2lvbik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoYH5nbG9iYWxTYXlzYCwgU2F5LnR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1ldGhvZCA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICAgICAgbWV0aG9kLm5hbWUgPSBTYXkudHlwZU5hbWU7XHJcbiAgICAgICAgICAgIG1ldGhvZC5wYXJhbWV0ZXJzID0gW107XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbnN0cnVjdGlvbnM6SW5zdHJ1Y3Rpb25bXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IHNheSBvZiBnbG9iYWxTYXlzKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNheUV4cHJlc3Npb24gPSA8U2F5RXhwcmVzc2lvbj5zYXk7XHJcblxyXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhzYXlFeHByZXNzaW9uLnRleHQpLFxyXG4gICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KClcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLnJldHVybigpKTtcclxuXHJcbiAgICAgICAgICAgIG1ldGhvZC5ib2R5ID0gaW5zdHJ1Y3Rpb25zO1xyXG5cclxuICAgICAgICAgICAgdHlwZS5tZXRob2RzLnB1c2gobWV0aG9kKTtcclxuXHJcbiAgICAgICAgICAgIHR5cGVzQnlOYW1lLnNldCh0eXBlLm5hbWUsIHR5cGUpOyAgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJVbmFibGUgdG8gcGFydGlhbGx5IHRyYW5zZm9ybVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMub3V0LndyaXRlKGBDcmVhdGVkICR7dHlwZXNCeU5hbWUuc2l6ZX0gdHlwZXMuLi5gKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0eXBlc0J5TmFtZS52YWx1ZXMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm1FdmVudEtpbmQoa2luZDpzdHJpbmcpe1xyXG4gICAgICAgIHN3aXRjaChraW5kKXtcclxuICAgICAgICAgICAgY2FzZSBLZXl3b3Jkcy5lbnRlcnM6e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEV2ZW50VHlwZS5QbGF5ZXJFbnRlcnNQbGFjZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIEtleXdvcmRzLmV4aXRzOntcclxuICAgICAgICAgICAgICAgIHJldHVybiBFdmVudFR5cGUuUGxheWVyRXhpdHNQbGFjZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OntcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKGBVbmFibGUgdG8gdHJhbnNmb3JtIHVuc3VwcG9ydGVkIGV2ZW50IGtpbmQgJyR7a2luZH0nYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb246RXhwcmVzc2lvbiwgbW9kZT86RXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZSl7XHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25zOkluc3RydWN0aW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBJZkV4cHJlc3Npb24peyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb25hbCA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmNvbmRpdGlvbmFsLCBtb2RlKTtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goLi4uY29uZGl0aW9uYWwpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaWZCbG9jayA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmlmQmxvY2ssIG1vZGUpO1xyXG4gICAgICAgICAgICBjb25zdCBlbHNlQmxvY2sgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5lbHNlQmxvY2ssIG1vZGUpO1xyXG5cclxuICAgICAgICAgICAgaWZCbG9jay5wdXNoKEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlKGVsc2VCbG9jay5sZW5ndGgpKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlSWZGYWxzZShpZkJsb2NrLmxlbmd0aCkpXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmlmQmxvY2spO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5lbHNlQmxvY2spO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIFNheUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGV4cHJlc3Npb24udGV4dCkpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5wcmludCgpKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtb2RlICE9IEV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGUuSWdub3JlUmVzdWx0c09mU2F5RXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGV4cHJlc3Npb24udGV4dCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgQ29udGFpbnNFeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkTnVtYmVyKGV4cHJlc3Npb24uY291bnQpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhleHByZXNzaW9uLnR5cGVOYW1lKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRJbnN0YW5jZShleHByZXNzaW9uLnRhcmdldE5hbWUpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEZpZWxkKFdvcmxkT2JqZWN0LmNvbnRlbnRzKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmluc3RhbmNlQ2FsbChMaXN0LmNvbnRhaW5zKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBDb25jYXRlbmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5sZWZ0ISwgbW9kZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24ucmlnaHQhLCBtb2RlKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmxlZnQpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5yaWdodCk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmNvbmNhdGVuYXRlKCkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEZpZWxkKGV4cHJlc3Npb24ubmFtZSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBTZXRWYXJpYWJsZUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBjb25zdCByaWdodCA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmV2YWx1YXRpb25FeHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgLi4ucmlnaHQsXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEZpZWxkKGV4cHJlc3Npb24udmFyaWFibGVOYW1lKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmFzc2lnbigpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgTGl0ZXJhbEV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpZiAoZXhwcmVzc2lvbi50eXBlTmFtZSA9PSBTdHJpbmdUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmxvYWRTdHJpbmcoPHN0cmluZz5leHByZXNzaW9uLnZhbHVlKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbi50eXBlTmFtZSA9PSBOdW1iZXJUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmxvYWROdW1iZXIoTnVtYmVyKGV4cHJlc3Npb24udmFsdWUpKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgVW5hYmxlIHRvIHRyYW5zZm9ybSB1bnN1cHBvcnRlZCBsaXRlcmFsIGV4cHJlc3Npb24gJyR7ZXhwcmVzc2lvbn0nYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byB0cmFuc2Zvcm0gdW5zdXBwb3J0ZWQgZXhwcmVzc2lvblwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVjdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm1Jbml0aWFsVHlwZURlY2xhcmF0aW9uKGV4cHJlc3Npb246VHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUeXBlKGV4cHJlc3Npb24ubmFtZSwgZXhwcmVzc2lvbi5iYXNlVHlwZSEubmFtZSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHRlcm5DYWxsIH0gZnJvbSBcIi4vRXh0ZXJuQ2FsbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFueXsgICAgICAgIFxyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWU6c3RyaW5nID0gXCJ+YW55XCI7ICBcclxuICAgIFxyXG4gICAgc3RhdGljIG1haW4gPSBcIn5tYWluXCI7XHJcbiAgICBzdGF0aWMgZXh0ZXJuVG9TdHJpbmcgPSBFeHRlcm5DYWxsLm9mKFwifnRvU3RyaW5nXCIpO1xyXG59XHJcbiIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJvb2xlYW5UeXBle1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+Ym9vbGVhblwiO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRGVsZWdhdGV7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn5kZWxlZ2F0ZVwiO1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG59IiwiZXhwb3J0IGNsYXNzIEVudHJ5UG9pbnRBdHRyaWJ1dGV7XHJcbiAgICBuYW1lOnN0cmluZyA9IFwifmVudHJ5UG9pbnRcIjtcclxufSIsImV4cG9ydCBjbGFzcyBFeHRlcm5DYWxse1xyXG4gICAgc3RhdGljIG9mKG5hbWU6c3RyaW5nLCAuLi5hcmdzOnN0cmluZ1tdKXtcclxuICAgICAgICByZXR1cm4gbmV3IEV4dGVybkNhbGwobmFtZSwgLi4uYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgYXJnczpzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6c3RyaW5nLCAuLi5hcmdzOnN0cmluZ1tdKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuL1dvcmxkT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbXtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifml0ZW1cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlzdHtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifmxpc3RcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY29udGFpbnMgPSBcIn5jb250YWluc1wiO1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZVBhcmFtZXRlciA9IFwifnR5cGVOYW1lXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY291bnRQYXJhbWV0ZXIgPSBcIn5jb3VudFwiO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTnVtYmVyVHlwZXtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifm51bWJlclwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi9Xb3JsZE9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYWNlIHtcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+cGxhY2VcIjtcclxuXHJcbiAgICBzdGF0aWMgaXNQbGF5ZXJTdGFydCA9IFwifmlzUGxheWVyU3RhcnRcIjtcclxufSIsImltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vV29ybGRPYmplY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5ZXJ7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWUgPSBcIn5wbGF5ZXJcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lOyAgICBcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNheXtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifnNheVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RyaW5nVHlwZXtcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHN0YXRpYyB0eXBlTmFtZSA9IFwifnN0cmluZ1wiO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVW5kZXJzdGFuZGluZ3tcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHN0YXRpYyB0eXBlTmFtZSA9IFwifnVuZGVyc3RhbmRpbmdcIjtcclxuXHJcbiAgICBzdGF0aWMgZGVzY3JpYmluZyA9IFwifmRlc2NyaWJpbmdcIjsgIFxyXG4gICAgc3RhdGljIG1vdmluZyA9IFwifm1vdmluZ1wiO1xyXG4gICAgc3RhdGljIGRpcmVjdGlvbiA9IFwifmRpcmVjdGlvblwiO1xyXG4gICAgc3RhdGljIHRha2luZyA9IFwifnRha2luZ1wiO1xyXG4gICAgc3RhdGljIGludmVudG9yeSA9IFwifmludmVudG9yeVwiO1xyXG4gICAgc3RhdGljIGRyb3BwaW5nID0gXCJ+ZHJvcHBpbmdcIjtcclxuXHJcbiAgICBzdGF0aWMgYWN0aW9uID0gXCJ+YWN0aW9uXCI7XHJcbiAgICBzdGF0aWMgbWVhbmluZyA9IFwifm1lYW5pbmdcIjsgIFxyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRPYmplY3Qge1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+d29ybGRPYmplY3RcIjtcclxuXHJcbiAgICBzdGF0aWMgZGVzY3JpcHRpb24gPSBcIn5kZXNjcmlwdGlvblwiO1xyXG4gICAgc3RhdGljIGNvbnRlbnRzID0gXCJ+Y29udGVudHNcIjsgICAgXHJcblxyXG4gICAgc3RhdGljIGRlc2NyaWJlID0gXCJ+ZGVzY3JpYmVcIjtcclxufSIsImltcG9ydCB7IFRhbG9uSWRlIH0gZnJvbSBcIi4vVGFsb25JZGVcIjtcclxuXHJcblxyXG52YXIgaWRlID0gbmV3IFRhbG9uSWRlKCk7IiwiZXhwb3J0IGVudW0gRXZhbHVhdGlvblJlc3VsdHtcclxuICAgIENvbnRpbnVlLFxyXG4gICAgU3VzcGVuZEZvcklucHV0XHJcbn0iLCJpbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuL2xpYnJhcnkvVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgU3RhY2tGcmFtZSB9IGZyb20gXCIuL1N0YWNrRnJhbWVcIjtcclxuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tIFwiLi4vY29tbW9uL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1ldGhvZEFjdGl2YXRpb257XHJcbiAgICBtZXRob2Q/Ok1ldGhvZDtcclxuICAgIHN0YWNrRnJhbWU6U3RhY2tGcmFtZTtcclxuICAgIHN0YWNrOlJ1bnRpbWVBbnlbXSA9IFtdO1xyXG5cclxuICAgIHN0YWNrU2l6ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YWNrLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBwZWVrKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBTdGFjayBJbWJhbGFuY2UhIEF0dGVtcHRlZCB0byBwZWVrIGFuIGVtcHR5IHN0YWNrLmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2tbdGhpcy5zdGFjay5sZW5ndGggLSAxXTtcclxuICAgIH1cclxuXHJcbiAgICBwb3AoKXtcclxuICAgICAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFN0YWNrIEltYmFsYW5jZSEgQXR0ZW1wdGVkIHRvIHBvcCBhbiBlbXB0eSBzdGFjay5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YWNrLnBvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1c2gocnVudGltZUFueTpSdW50aW1lQW55KXtcclxuICAgICAgICB0aGlzLnN0YWNrLnB1c2gocnVudGltZUFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IobWV0aG9kOk1ldGhvZCl7XHJcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XHJcbiAgICAgICAgdGhpcy5zdGFja0ZyYW1lID0gbmV3IFN0YWNrRnJhbWUobWV0aG9kKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vY29tbW9uL09wQ29kZVwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBjb2RlOk9wQ29kZSA9IE9wQ29kZS5Ob09wO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICByZXR1cm4gRXZhbHVhdGlvblJlc3VsdC5Db250aW51ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0YWNrRnJhbWV7XHJcbiAgICBsb2NhbHM6VmFyaWFibGVbXSA9IFtdO1xyXG4gICAgY3VycmVudEluc3RydWN0aW9uOm51bWJlciA9IC0xO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1ldGhvZDpNZXRob2Qpe1xyXG4gICAgICAgIGZvcih2YXIgcGFyYW1ldGVyIG9mIG1ldGhvZC5wYXJhbWV0ZXJzKXtcclxuICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSBuZXcgVmFyaWFibGUocGFyYW1ldGVyLm5hbWUsIHBhcmFtZXRlci50eXBlISk7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYWxzLnB1c2godmFyaWFibGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IEVudHJ5UG9pbnRBdHRyaWJ1dGUgfSBmcm9tIFwiLi4vbGlicmFyeS9FbnRyeVBvaW50QXR0cmlidXRlXCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vY29tbW9uL09wQ29kZVwiO1xyXG5pbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBQcmludEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9QcmludEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgTm9PcEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Ob09wSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkU3RyaW5nSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRTdHJpbmdIYW5kbGVyXCI7XHJcbmltcG9ydCB7IE5ld0luc3RhbmNlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL05ld0luc3RhbmNlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQ29tbWFuZCB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZUNvbW1hbmRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBSZWFkSW5wdXRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvUmVhZElucHV0SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbW1hbmRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvUGFyc2VDb21tYW5kSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBHb1RvSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0dvVG9IYW5kbGVyXCI7XHJcbmltcG9ydCB7IEhhbmRsZUNvbW1hbmRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvSGFuZGxlQ29tbWFuZEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxhY2UgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVQbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQm9vbGVhbiB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZUJvb2xlYW5cIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUGxheWVyXCI7XHJcbmltcG9ydCB7IFNheSB9IGZyb20gXCIuLi9saWJyYXJ5L1NheVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRW1wdHkgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVFbXB0eVwiO1xyXG5pbXBvcnQgeyBSZXR1cm5IYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvUmV0dXJuSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBTdGF0aWNDYWxsSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1N0YXRpY0NhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYXllciB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZVBsYXllclwiO1xyXG5pbXBvcnQgeyBMb2FkSW5zdGFuY2VIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZEluc3RhbmNlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkTnVtYmVySGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWROdW1iZXJIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9JbnN0YW5jZUNhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRQcm9wZXJ0eUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkUHJvcGVydHlIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRGaWVsZEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkRmllbGRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEV4dGVybmFsQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9FeHRlcm5hbENhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRMb2NhbEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkTG9jYWxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IElMb2dPdXRwdXQgfSBmcm9tIFwiLi9JTG9nT3V0cHV0XCI7XHJcbmltcG9ydCB7IExvYWRUaGlzSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRUaGlzSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBCcmFuY2hSZWxhdGl2ZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9CcmFuY2hSZWxhdGl2ZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0JyYW5jaFJlbGF0aXZlSWZGYWxzZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgQ29uY2F0ZW5hdGVIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvQ29uY2F0ZW5hdGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEFzc2lnblZhcmlhYmxlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0Fzc2lnblZhcmlhYmxlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUeXBlT2ZIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvVHlwZU9mSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJbnZva2VEZWxlZ2F0ZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9JbnZva2VEZWxlZ2F0ZUhhbmRsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvblJ1bnRpbWV7XHJcblxyXG4gICAgcHJpdmF0ZSB0aHJlYWQ/OlRocmVhZDtcclxuICAgIHByaXZhdGUgaGFuZGxlcnM6TWFwPE9wQ29kZSwgT3BDb2RlSGFuZGxlcj4gPSBuZXcgTWFwPE9wQ29kZSwgT3BDb2RlSGFuZGxlcj4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHVzZXJPdXRwdXQ6SU91dHB1dCwgcHJpdmF0ZSByZWFkb25seSBsb2dPdXRwdXQ/OklMb2dPdXRwdXQpe1xyXG4gICAgICAgIHRoaXMudXNlck91dHB1dCA9IHVzZXJPdXRwdXQ7XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Ob09wLCBuZXcgTm9PcEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRTdHJpbmcsIG5ldyBMb2FkU3RyaW5nSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuUHJpbnQsIG5ldyBQcmludEhhbmRsZXIodGhpcy51c2VyT3V0cHV0KSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLk5ld0luc3RhbmNlLCBuZXcgTmV3SW5zdGFuY2VIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5SZWFkSW5wdXQsIG5ldyBSZWFkSW5wdXRIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5QYXJzZUNvbW1hbmQsIG5ldyBQYXJzZUNvbW1hbmRIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5IYW5kbGVDb21tYW5kLCBuZXcgSGFuZGxlQ29tbWFuZEhhbmRsZXIodGhpcy51c2VyT3V0cHV0KSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkdvVG8sIG5ldyBHb1RvSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuUmV0dXJuLCBuZXcgUmV0dXJuSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuU3RhdGljQ2FsbCwgbmV3IFN0YXRpY0NhbGxIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkSW5zdGFuY2UsIG5ldyBMb2FkSW5zdGFuY2VIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkTnVtYmVyLCBuZXcgTG9hZE51bWJlckhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkluc3RhbmNlQ2FsbCwgbmV3IEluc3RhbmNlQ2FsbEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRQcm9wZXJ0eSwgbmV3IExvYWRQcm9wZXJ0eUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRGaWVsZCwgbmV3IExvYWRGaWVsZEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkV4dGVybmFsQ2FsbCwgbmV3IEV4dGVybmFsQ2FsbEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRMb2NhbCwgbmV3IExvYWRMb2NhbEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRUaGlzLCBuZXcgTG9hZFRoaXNIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5CcmFuY2hSZWxhdGl2ZSwgbmV3IEJyYW5jaFJlbGF0aXZlSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuQnJhbmNoUmVsYXRpdmVJZkZhbHNlLCBuZXcgQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuQ29uY2F0ZW5hdGUsIG5ldyBDb25jYXRlbmF0ZUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkFzc2lnbiwgbmV3IEFzc2lnblZhcmlhYmxlSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuVHlwZU9mLCBuZXcgVHlwZU9mSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuSW52b2tlRGVsZWdhdGUsIG5ldyBJbnZva2VEZWxlZ2F0ZUhhbmRsZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQoKXtcclxuICAgICAgICBpZiAodGhpcy50aHJlYWQ/LmFsbFR5cGVzLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgdGhpcy50aHJlYWQubG9nPy5kZWJ1ZyhcIlVuYWJsZSB0byBzdGFydCBydW50aW1lIHdpdGhvdXQgdHlwZXMuXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwbGFjZXMgPSB0aGlzLnRocmVhZD8uYWxsVHlwZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcih4ID0+IHguYmFzZVR5cGVOYW1lID09IFBsYWNlLnR5cGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKHggPT4gPFJ1bnRpbWVQbGF5ZXI+TWVtb3J5LmFsbG9jYXRlKHgpKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2V0UGxheWVyU3RhcnQgPSAocGxhY2U6UnVudGltZVBsYWNlKSA9PiA8UnVudGltZUJvb2xlYW4+KHBsYWNlLmZpZWxkcy5nZXQoUGxhY2UuaXNQbGF5ZXJTdGFydCk/LnZhbHVlKTtcclxuICAgICAgICBjb25zdCBpc1BsYXllclN0YXJ0ID0gKHBsYWNlOlJ1bnRpbWVQbGFjZSkgPT4gZ2V0UGxheWVyU3RhcnQocGxhY2UpPy52YWx1ZSA9PT0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudFBsYWNlID0gcGxhY2VzPy5maW5kKGlzUGxheWVyU3RhcnQpO1xyXG5cclxuICAgICAgICB0aGlzLnRocmVhZCEuY3VycmVudFBsYWNlID0gY3VycmVudFBsYWNlO1xyXG5cclxuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLnRocmVhZD8ua25vd25UeXBlcy5nZXQoUGxheWVyLnR5cGVOYW1lKSE7XHJcblxyXG4gICAgICAgIHRoaXMudGhyZWFkIS5jdXJyZW50UGxheWVyID0gPFJ1bnRpbWVQbGF5ZXI+TWVtb3J5LmFsbG9jYXRlKHBsYXllcik7XHJcblxyXG4gICAgICAgIHRoaXMucnVuV2l0aChcIlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGcm9tKHR5cGVzOlR5cGVbXSl7XHJcbiAgICAgICAgaWYgKHR5cGVzLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgdGhpcy5sb2dPdXRwdXQ/LmRlYnVnKFwiTm8gdHlwZXMgd2VyZSBwcm92aWRlZCwgdW5hYmxlIHRvIGxvYWQgcnVudGltZSFcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRlZFR5cGVzID0gTWVtb3J5LmxvYWRUeXBlcyh0eXBlcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGVudHJ5UG9pbnQgPSBsb2FkZWRUeXBlcy5maW5kKHggPT4geC5hdHRyaWJ1dGVzLmZpbmRJbmRleChhdHRyaWJ1dGUgPT4gYXR0cmlidXRlIGluc3RhbmNlb2YgRW50cnlQb2ludEF0dHJpYnV0ZSkgPiAtMSk7XHJcbiAgICAgICAgY29uc3QgbWFpbk1ldGhvZCA9IGVudHJ5UG9pbnQ/Lm1ldGhvZHMuZmluZCh4ID0+IHgubmFtZSA9PSBBbnkubWFpbik7ICAgICAgICBcclxuICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gbmV3IE1ldGhvZEFjdGl2YXRpb24obWFpbk1ldGhvZCEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudGhyZWFkID0gbmV3IFRocmVhZChsb2FkZWRUeXBlcywgYWN0aXZhdGlvbik7ICBcclxuICAgICAgICB0aGlzLnRocmVhZC5sb2cgPSB0aGlzLmxvZ091dHB1dDsgICAgICBcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2VuZENvbW1hbmQoaW5wdXQ6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLnJ1bldpdGgoaW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcnVuV2l0aChjb21tYW5kOnN0cmluZyl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gV2UncmUgZ29pbmcgdG8ga2VlcCB0aGVpciBjb21tYW5kIGluIHRoZSB2aXN1YWwgaGlzdG9yeSB0byBtYWtlIHRoaW5ncyBlYXNpZXIgdG8gdW5kZXJzdGFuZC5cclxuXHJcbiAgICAgICAgdGhpcy51c2VyT3V0cHV0LndyaXRlKGNvbW1hbmQpO1xyXG5cclxuICAgICAgICAvLyBOb3cgd2UgY2FuIGdvIGFoZWFkIGFuZCBwcm9jZXNzIHRoZWlyIGNvbW1hbmQuXHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uID0gdGhpcy50aHJlYWQhLmN1cnJlbnRJbnN0cnVjdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKGluc3RydWN0aW9uPy5vcENvZGUgPT0gT3BDb2RlLlJlYWRJbnB1dCl7XHJcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBNZW1vcnkuYWxsb2NhdGVTdHJpbmcoY29tbWFuZCk7XHJcbiAgICAgICAgICAgIHRoaXMudGhyZWFkPy5jdXJyZW50TWV0aG9kLnB1c2godGV4dCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRocmVhZD8ubW92ZU5leHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRocmVhZD8uY3VycmVudEluc3RydWN0aW9uID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRoaXMudGhyZWFkPy5tb3ZlTmV4dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMudGhyZWFkPy5jdXJyZW50SW5zdHJ1Y3Rpb24gPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBleGVjdXRlIGNvbW1hbmQsIG5vIGluc3RydWN0aW9uIGZvdW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICBmb3IobGV0IGluc3RydWN0aW9uID0gdGhpcy5ldmFsdWF0ZUN1cnJlbnRJbnN0cnVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24gPT0gRXZhbHVhdGlvblJlc3VsdC5Db250aW51ZTtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9uID0gdGhpcy5ldmFsdWF0ZUN1cnJlbnRJbnN0cnVjdGlvbigpKXtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRocmVhZD8ubW92ZU5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2goZXgpe1xyXG4gICAgICAgICAgICBpZiAoZXggaW5zdGFuY2VvZiBSdW50aW1lRXJyb3Ipe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dPdXRwdXQ/LmRlYnVnKGBSdW50aW1lIEVycm9yOiAke2V4Lm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ091dHB1dD8uZGVidWcoYFN0YWNrIFRyYWNlOiAke2V4LnN0YWNrfWApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dPdXRwdXQ/LmRlYnVnKGBFbmNvdW50ZXJlZCB1bmhhbmRsZWQgZXJyb3I6ICR7ZXh9YCk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZXZhbHVhdGVDdXJyZW50SW5zdHJ1Y3Rpb24oKXtcclxuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IHRoaXMudGhyZWFkPy5jdXJyZW50SW5zdHJ1Y3Rpb247XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSB0aGlzLmhhbmRsZXJzLmdldChpbnN0cnVjdGlvbj8ub3BDb2RlISk7XHJcblxyXG4gICAgICAgIGlmIChoYW5kbGVyID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYEVuY291bnRlcmVkIHVuc3VwcG9ydGVkIE9wQ29kZSAnJHtpbnN0cnVjdGlvbj8ub3BDb2RlfSdgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGhhbmRsZXI/LmhhbmRsZSh0aGlzLnRocmVhZCEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgTWV0aG9kQWN0aXZhdGlvbiB9IGZyb20gXCIuL01ldGhvZEFjdGl2YXRpb25cIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvVW5kZXJzdGFuZGluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxhY2UgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVQbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxheWVyIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lUGxheWVyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFbXB0eSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZUVtcHR5XCI7XHJcbmltcG9ydCB7IElMb2dPdXRwdXQgfSBmcm9tIFwiLi9JTG9nT3V0cHV0XCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vTWV0aG9kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGhyZWFke1xyXG4gICAgYWxsVHlwZXM6VHlwZVtdID0gW107XHJcbiAgICBrbm93blR5cGVzOk1hcDxzdHJpbmcsIFR5cGU+ID0gbmV3IE1hcDxzdHJpbmcsIFR5cGU+KCk7XHJcbiAgICBrbm93blVuZGVyc3RhbmRpbmdzOlR5cGVbXSA9IFtdO1xyXG4gICAga25vd25QbGFjZXM6UnVudGltZVBsYWNlW10gPSBbXTtcclxuICAgIG1ldGhvZHM6TWV0aG9kQWN0aXZhdGlvbltdID0gW107XHJcbiAgICBjdXJyZW50UGxhY2U/OlJ1bnRpbWVQbGFjZTtcclxuICAgIGN1cnJlbnRQbGF5ZXI/OlJ1bnRpbWVQbGF5ZXI7XHJcbiAgICBsb2c/OklMb2dPdXRwdXQ7XHJcbiAgICBcclxuICAgIGdldCBjdXJyZW50TWV0aG9kKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1ldGhvZHNbdGhpcy5tZXRob2RzLmxlbmd0aCAtIDFdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJyZW50SW5zdHJ1Y3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aXZhdGlvbiA9IHRoaXMuY3VycmVudE1ldGhvZDtcclxuICAgICAgICByZXR1cm4gYWN0aXZhdGlvbi5tZXRob2Q/LmJvZHlbYWN0aXZhdGlvbi5zdGFja0ZyYW1lLmN1cnJlbnRJbnN0cnVjdGlvbl07XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IodHlwZXM6VHlwZVtdLCBtZXRob2Q6TWV0aG9kQWN0aXZhdGlvbil7XHJcbiAgICAgICAgdGhpcy5hbGxUeXBlcyA9IHR5cGVzO1xyXG4gICAgICAgIHRoaXMua25vd25UeXBlcyA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlPih0eXBlcy5tYXAodHlwZSA9PiBbdHlwZS5uYW1lLCB0eXBlXSkpO1xyXG4gICAgICAgIHRoaXMua25vd25VbmRlcnN0YW5kaW5ncyA9IHR5cGVzLmZpbHRlcih4ID0+IHguYmFzZVR5cGVOYW1lID09PSBVbmRlcnN0YW5kaW5nLnR5cGVOYW1lKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm1ldGhvZHMucHVzaChtZXRob2QpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGl2YXRlTWV0aG9kKG1ldGhvZDpNZXRob2Qpe1xyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRpb24gPSBuZXcgTWV0aG9kQWN0aXZhdGlvbihtZXRob2QpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmN1cnJlbnRNZXRob2Q7XHJcblxyXG4gICAgICAgIHRoaXMubG9nPy5kZWJ1ZyhgJHtjdXJyZW50Lm1ldGhvZD8ubmFtZX0gPT4gJHttZXRob2QubmFtZX1gKTtcclxuXHJcbiAgICAgICAgdGhpcy5tZXRob2RzLnB1c2goYWN0aXZhdGlvbik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdmVOZXh0KCl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uKys7XHJcbiAgICB9XHJcblxyXG4gICAganVtcFRvTGluZShsaW5lTnVtYmVyOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uID0gbGluZU51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm5Gcm9tQ3VycmVudE1ldGhvZCgpe1xyXG4gICAgICAgIGNvbnN0IGV4cGVjdFJldHVyblR5cGUgPSB0aGlzLmN1cnJlbnRNZXRob2QubWV0aG9kIS5yZXR1cm5UeXBlICE9IFwiXCI7XHJcbiAgICAgICAgY29uc3QgcmV0dXJuZWRNZXRob2QgPSB0aGlzLm1ldGhvZHMucG9wKCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9nPy5kZWJ1ZyhgJHt0aGlzLmN1cnJlbnRNZXRob2QubWV0aG9kPy5uYW1lfSA8PSAke3JldHVybmVkTWV0aG9kPy5tZXRob2Q/Lm5hbWV9YCk7XHJcblxyXG4gICAgICAgIGlmICghZXhwZWN0UmV0dXJuVHlwZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUnVudGltZUVtcHR5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXR1cm5WYWx1ZSA9IHJldHVybmVkTWV0aG9kPy5zdGFjay5wb3AoKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWUhO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGFjZSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVQbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRW1wdHkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lRW1wdHlcIjtcclxuaW1wb3J0IHsgUnVudGltZUNvbW1hbmQgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQ29tbWFuZFwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVCb29sZWFuIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUJvb2xlYW5cIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgUnVudGltZUxpc3QgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lTGlzdFwiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvSXRlbVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lSXRlbSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJdGVtXCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYXllclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxheWVyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVBsYXllclwiO1xyXG5pbXBvcnQgeyBTYXkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9TYXlcIjtcclxuaW1wb3J0IHsgUnVudGltZVNheSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTYXlcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9NZXRob2RcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBOdW1iZXJUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTnVtYmVyVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lbW9yeXtcclxuICAgIHByaXZhdGUgc3RhdGljIHR5cGVzQnlOYW1lID0gbmV3IE1hcDxzdHJpbmcsIFR5cGU+KCk7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZWFwID0gbmV3IE1hcDxzdHJpbmcsIFJ1bnRpbWVBbnlbXT4oKTtcclxuXHJcbiAgICBzdGF0aWMgZmluZEluc3RhbmNlQnlOYW1lKG5hbWU6c3RyaW5nKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZXMgPSBNZW1vcnkuaGVhcC5nZXQobmFtZSk7XHJcblxyXG4gICAgICAgIGlmICghaW5zdGFuY2VzIHx8IGluc3RhbmNlcy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJPYmplY3Qgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGluc3RhbmNlcy5sZW5ndGggPiAxKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIkxvY2F0ZWQgbW9yZSB0aGFuIG9uZSBpbnN0YW5jZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZXNbMF07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRUeXBlcyh0eXBlczpUeXBlW10pe1xyXG4gICAgICAgIE1lbW9yeS50eXBlc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlPih0eXBlcy5tYXAoeCA9PiBbeC5uYW1lLCB4XSkpOyAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIE92ZXJyaWRlIGFueSBwcm92aWRlZCB0eXBlIHN0dWJzIHdpdGggdGhlIGFjdHVhbCBydW50aW1lIHR5cGUgZGVmaW5pdGlvbnMuXHJcblxyXG4gICAgICAgIGNvbnN0IHBsYWNlID0gUnVudGltZVBsYWNlLnR5cGU7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IFJ1bnRpbWVJdGVtLnR5cGU7XHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gUnVudGltZVBsYXllci50eXBlO1xyXG5cclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUuc2V0KHBsYWNlLm5hbWUsIHBsYWNlKTtcclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUuc2V0KGl0ZW0ubmFtZSwgaXRlbSk7XHJcbiAgICAgICAgTWVtb3J5LnR5cGVzQnlOYW1lLnNldChwbGF5ZXIubmFtZSwgcGxheWVyKTsgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKE1lbW9yeS50eXBlc0J5TmFtZS52YWx1ZXMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG9jYXRlQ29tbWFuZCgpOlJ1bnRpbWVDb21tYW5ke1xyXG4gICAgICAgIHJldHVybiBuZXcgUnVudGltZUNvbW1hbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGVCb29sZWFuKHZhbHVlOmJvb2xlYW4pOlJ1bnRpbWVCb29sZWFue1xyXG4gICAgICAgIHJldHVybiBuZXcgUnVudGltZUJvb2xlYW4odmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZU51bWJlcih2YWx1ZTpudW1iZXIpOlJ1bnRpbWVJbnRlZ2Vye1xyXG4gICAgICAgIHJldHVybiBuZXcgUnVudGltZUludGVnZXIodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZVN0cmluZyh0ZXh0OnN0cmluZyk6UnVudGltZVN0cmluZ3tcclxuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVTdHJpbmcodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG9jYXRlKHR5cGU6VHlwZSk6UnVudGltZUFueXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IE1lbW9yeS5jb25zdHJ1Y3RJbnN0YW5jZUZyb20odHlwZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlUG9vbCA9IE1lbW9yeS5oZWFwLmdldCh0eXBlLm5hbWUpIHx8IFtdO1xyXG5cclxuICAgICAgICBpbnN0YW5jZVBvb2wucHVzaChpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgIE1lbW9yeS5oZWFwLnNldCh0eXBlLm5hbWUsIGluc3RhbmNlUG9vbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbml0aWFsaXplVmFyaWFibGVXaXRoKGZpZWxkOkZpZWxkKXtcclxuXHJcbiAgICAgICAgY29uc3QgdmFyaWFibGUgPSBNZW1vcnkuY29uc3RydWN0VmFyaWFibGVGcm9tKGZpZWxkKTsgICAgICAgIFxyXG4gICAgICAgIHZhcmlhYmxlLnZhbHVlID0gTWVtb3J5Lmluc3RhbnRpYXRlRGVmYXVsdFZhbHVlRm9yKHZhcmlhYmxlLCBmaWVsZC5kZWZhdWx0VmFsdWUpO1xyXG5cclxuICAgICAgICByZXR1cm4gdmFyaWFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY29uc3RydWN0VmFyaWFibGVGcm9tKGZpZWxkOkZpZWxkKXtcclxuICAgICAgICBpZiAoZmllbGQudHlwZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFyaWFibGUoZmllbGQubmFtZSwgZmllbGQudHlwZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0eXBlID0gTWVtb3J5LnR5cGVzQnlOYW1lLmdldChmaWVsZC50eXBlTmFtZSk7XHJcblxyXG4gICAgICAgIGlmICghdHlwZSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFVuYWJsZSB0byBjb25zdHJ1Y3QgdW5rbm93biB0eXBlICcke2ZpZWxkLnR5cGVOYW1lfSdgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVmFyaWFibGUoZmllbGQubmFtZSwgdHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFudGlhdGVEZWZhdWx0VmFsdWVGb3IodmFyaWFibGU6VmFyaWFibGUsIGRlZmF1bHRWYWx1ZTpPYmplY3R8dW5kZWZpbmVkKXtcclxuICAgICAgICBcclxuICAgICAgICBzd2l0Y2godmFyaWFibGUudHlwZSEubmFtZSl7XHJcbiAgICAgICAgICAgIGNhc2UgU3RyaW5nVHlwZS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lU3RyaW5nKGRlZmF1bHRWYWx1ZSA/IDxzdHJpbmc+ZGVmYXVsdFZhbHVlIDogXCJcIik7XHJcbiAgICAgICAgICAgIGNhc2UgQm9vbGVhblR5cGUudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZUJvb2xlYW4oZGVmYXVsdFZhbHVlID8gPGJvb2xlYW4+ZGVmYXVsdFZhbHVlIDogZmFsc2UpO1xyXG4gICAgICAgICAgICBjYXNlIE51bWJlclR5cGUudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZUludGVnZXIoZGVmYXVsdFZhbHVlID8gPG51bWJlcj5kZWZhdWx0VmFsdWUgOiAwKTtcclxuICAgICAgICAgICAgY2FzZSBMaXN0LnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVMaXN0KGRlZmF1bHRWYWx1ZSA/IHRoaXMuaW5zdGFudGlhdGVMaXN0KDxPYmplY3RbXT5kZWZhdWx0VmFsdWUpIDogW10pO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lRW1wdHkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFudGlhdGVMaXN0KGl0ZW1zOk9iamVjdFtdKXtcclxuICAgICAgICBjb25zdCBydW50aW1lSXRlbXM6UnVudGltZUFueVtdID0gW107XHJcblxyXG4gICAgICAgIGZvcihjb25zdCBpdGVtIG9mIGl0ZW1zKXtcclxuICAgICAgICAgICAgY29uc3QgaXRlbUxpc3QgPSA8T2JqZWN0W10+aXRlbTtcclxuICAgICAgICAgICAgY29uc3QgY291bnQgPSA8bnVtYmVyPml0ZW1MaXN0WzBdO1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlTmFtZSA9IDxzdHJpbmc+aXRlbUxpc3RbMV07XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gTWVtb3J5LnR5cGVzQnlOYW1lLmdldCh0eXBlTmFtZSkhO1xyXG5cclxuICAgICAgICAgICAgZm9yKGxldCBjdXJyZW50ID0gMDsgY3VycmVudCA8IGNvdW50OyBjdXJyZW50KyspeyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gTWVtb3J5LmFsbG9jYXRlKHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgcnVudGltZUl0ZW1zLnB1c2goaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcnVudGltZUl0ZW1zO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNvbnN0cnVjdEluc3RhbmNlRnJvbSh0eXBlOlR5cGUpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzZWVuVHlwZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcclxuICAgICAgICBsZXQgaW5oZXJpdGFuY2VDaGFpbjpUeXBlW10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBjdXJyZW50OlR5cGV8dW5kZWZpbmVkID0gdHlwZTsgXHJcbiAgICAgICAgICAgIGN1cnJlbnQ7IFxyXG4gICAgICAgICAgICBjdXJyZW50ID0gTWVtb3J5LnR5cGVzQnlOYW1lLmdldChjdXJyZW50LmJhc2VUeXBlTmFtZSkpe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VlblR5cGVzLmhhcyhjdXJyZW50Lm5hbWUpKXtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiWW91IGNhbid0IGhhdmUgY3ljbGVzIGluIGEgdHlwZSBoaWVyYXJjaHlcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2VlblR5cGVzLmFkZChjdXJyZW50Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaW5oZXJpdGFuY2VDaGFpbi5wdXNoKGN1cnJlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleCA9IGluaGVyaXRhbmNlQ2hhaW4uZmluZEluZGV4KHggPT4geC5pc1N5c3RlbVR5cGUpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKGZpcnN0U3lzdGVtVHlwZUFuY2VzdG9ySW5kZXggPCAwKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlR5cGUgbXVzdCB1bHRpbWF0ZWx5IGluaGVyaXQgZnJvbSBhIHN5c3RlbSB0eXBlXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmFsbG9jYXRlU3lzdGVtVHlwZUJ5TmFtZShpbmhlcml0YW5jZUNoYWluW2ZpcnN0U3lzdGVtVHlwZUFuY2VzdG9ySW5kZXhdLm5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGluc3RhbmNlLnBhcmVudFR5cGVOYW1lID0gaW5zdGFuY2UudHlwZU5hbWU7XHJcbiAgICAgICAgaW5zdGFuY2UudHlwZU5hbWUgPSBpbmhlcml0YW5jZUNoYWluWzBdLm5hbWU7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IEluaGVyaXQgbW9yZSB0aGFuIGp1c3QgZmllbGRzL21ldGhvZHMuXHJcbiAgICAgICAgLy8gVE9ETzogVHlwZSBjaGVjayBmaWVsZCBpbmhlcml0YW5jZSBmb3Igc2hhZG93aW5nL292ZXJyaWRpbmcuXHJcblxyXG4gICAgICAgIC8vIEluaGVyaXQgZmllbGRzL21ldGhvZHMgZnJvbSB0eXBlcyBpbiB0aGUgaGllcmFyY2h5IGZyb20gbGVhc3QgdG8gbW9zdCBkZXJpdmVkLlxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaSA9IGZpcnN0U3lzdGVtVHlwZUFuY2VzdG9ySW5kZXg7IGkgPj0gMDsgaS0tKXtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFR5cGUgPSBpbmhlcml0YW5jZUNoYWluW2ldO1xyXG5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IGZpZWxkIG9mIGN1cnJlbnRUeXBlLmZpZWxkcyl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YXJpYWJsZSA9IHRoaXMuaW5pdGlhbGl6ZVZhcmlhYmxlV2l0aChmaWVsZCk7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5maWVsZHMuc2V0KGZpZWxkLm5hbWUsIHZhcmlhYmxlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IG1ldGhvZCBvZiBjdXJyZW50VHlwZS5tZXRob2RzKXtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLm1ldGhvZHMuc2V0KG1ldGhvZC5uYW1lLCBtZXRob2QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhbGxvY2F0ZVN5c3RlbVR5cGVCeU5hbWUodHlwZU5hbWU6c3RyaW5nKXtcclxuICAgICAgICBzd2l0Y2godHlwZU5hbWUpe1xyXG4gICAgICAgICAgICBjYXNlIFBsYWNlLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVQbGFjZSgpO1xyXG4gICAgICAgICAgICBjYXNlIEl0ZW0udHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZUl0ZW0oKTtcclxuICAgICAgICAgICAgY2FzZSBQbGF5ZXIudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVBsYXllcigpO1xyXG4gICAgICAgICAgICBjYXNlIExpc3QudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZUxpc3QoW10pOyAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgU2F5LnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVTYXkoKTsgICAgICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6e1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGluc3RhbnRpYXRlIHR5cGUgJyR7dHlwZU5hbWV9J2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFJ1bnRpbWVFcnJvciBleHRlbmRzIEVycm9ye1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6c3RyaW5nKXtcclxuICAgICAgICBzdXBlcihtZXNzYWdlKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBc3NpZ25WYXJpYWJsZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKFwiLnN0LnZhclwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBSdW50aW1lU3RyaW5nKXtcclxuICAgICAgICAgICAgaW5zdGFuY2UudmFsdWUgPSAoPFJ1bnRpbWVTdHJpbmc+dmFsdWUpLnZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBSdW50aW1lSW50ZWdlcil7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnZhbHVlID0gKDxSdW50aW1lSW50ZWdlcj52YWx1ZSkudmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIkVuY291bnRlcmVkIHVuc3VwcG9ydGVkIHR5cGUgb24gdGhlIHN0YWNrXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCcmFuY2hSZWxhdGl2ZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aXZlQW1vdW50ID0gPG51bWJlcj50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYGJyLnJlbCAke3JlbGF0aXZlQW1vdW50fWApO1xyXG5cclxuICAgICAgICB0aHJlYWQuanVtcFRvTGluZSh0aHJlYWQuY3VycmVudE1ldGhvZC5zdGFja0ZyYW1lLmN1cnJlbnRJbnN0cnVjdGlvbiArIHJlbGF0aXZlQW1vdW50KTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQm9vbGVhbiB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVCb29sZWFuXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpdmVBbW91bnQgPSA8bnVtYmVyPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gPFJ1bnRpbWVCb29sZWFuPnRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgYnIucmVsLmZhbHNlICR7cmVsYXRpdmVBbW91bnR9YClcclxuXHJcbiAgICAgICAgaWYgKCF2YWx1ZS52YWx1ZSl7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRocmVhZC5qdW1wVG9MaW5lKHRocmVhZC5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uICsgcmVsYXRpdmVBbW91bnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmNhdGVuYXRlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgbGFzdCA9IDxSdW50aW1lU3RyaW5nPnRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IGZpcnN0ID0gPFJ1bnRpbWVTdHJpbmc+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAuY29uY2F0ICcke2ZpcnN0LnZhbHVlfScgJyR7bGFzdC52YWx1ZX0nYCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmNhdGVuYXRlZCA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhmaXJzdC52YWx1ZSArIFwiIFwiICsgbGFzdC52YWx1ZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goY29uY2F0ZW5hdGVkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuXHJcbmludGVyZmFjZSBJSW5kZXhhYmxle1xyXG4gICAgW25hbWU6c3RyaW5nXTooLi4uYXJnczpSdW50aW1lQW55W10pPT5SdW50aW1lQW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRXh0ZXJuYWxDYWxsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IDxzdHJpbmc+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMubG9jYXRlRnVuY3Rpb24oaW5zdGFuY2UhLCA8c3RyaW5nPm1ldGhvZE5hbWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmNhbGwuZXh0ZXJuXFx0JHtpbnN0YW5jZT8udHlwZU5hbWV9Ojoke21ldGhvZE5hbWV9KC4uLiR7bWV0aG9kLmxlbmd0aH0pYCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGFyZ3M6UnVudGltZUFueVtdID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBtZXRob2QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBhcmdzLnB1c2godGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCkhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG1ldGhvZC5jYWxsKGluc3RhbmNlLCAuLi5hcmdzKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChyZXN1bHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb2NhdGVGdW5jdGlvbihpbnN0YW5jZTpPYmplY3QsIG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gKDxJSW5kZXhhYmxlPmluc3RhbmNlKVttZXRob2ROYW1lXTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHb1RvSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uTnVtYmVyID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgaW5zdHJ1Y3Rpb25OdW1iZXIgPT09IFwibnVtYmVyXCIpe1xyXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIGp1bXAgb25lIHByZXZpb3VzIHRvIHRoZSBkZXNpcmVkIGluc3RydWN0aW9uIGJlY2F1c2UgYWZ0ZXIgXHJcbiAgICAgICAgICAgIC8vIGV2YWx1YXRpbmcgdGhpcyBnb3RvIHdlJ2xsIG1vdmUgZm9yd2FyZCAod2hpY2ggd2lsbCBtb3ZlIHRvIHRoZSBkZXNpcmVkIG9uZSkuXHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAuYnIgJHtpbnN0cnVjdGlvbk51bWJlcn1gKVxyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmp1bXBUb0xpbmUoaW5zdHJ1Y3Rpb25OdW1iZXIgLSAxKTtcclxuICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gZ290b1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVDb21tYW5kIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUNvbW1hbmRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZyB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1VuZGVyc3RhbmRpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZVVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lVW5kZXJzdGFuZGluZ1wiO1xyXG5pbXBvcnQgeyBNZWFuaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvTWVhbmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgUnVudGltZUxpc3QgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lTGlzdFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxhY2UgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lUGxhY2VcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYXllciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgTG9hZFByb3BlcnR5SGFuZGxlciB9IGZyb20gXCIuL0xvYWRQcm9wZXJ0eUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUHJpbnRIYW5kbGVyIH0gZnJvbSBcIi4vUHJpbnRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9JbnN0YW5jZUNhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEV2ZW50VHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vRXZlbnRUeXBlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVEZWxlZ2F0ZSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVEZWxlZ2F0ZVwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSGFuZGxlQ29tbWFuZEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXRwdXQ6SU91dHB1dCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAoIShjb21tYW5kIGluc3RhbmNlb2YgUnVudGltZUNvbW1hbmQpKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGhhbmRsZSBhIG5vbi1jb21tYW5kLCBmb3VuZCAnJHtjb21tYW5kfWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0gY29tbWFuZC5hY3Rpb24hLnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHRhcmdldE5hbWUgPSBjb21tYW5kLnRhcmdldE5hbWUhLnZhbHVlO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmhhbmRsZS5jbWQgJyR7YWN0aW9ufSAke3RhcmdldE5hbWV9J2ApO1xyXG5cclxuICAgICAgICBjb25zdCB1bmRlcnN0YW5kaW5nc0J5QWN0aW9uID0gbmV3IE1hcDxPYmplY3QsIFR5cGU+KHRocmVhZC5rbm93blVuZGVyc3RhbmRpbmdzLm1hcCh4ID0+IFt4LmZpZWxkcy5maW5kKGZpZWxkID0+IGZpZWxkLm5hbWUgPT0gVW5kZXJzdGFuZGluZy5hY3Rpb24pPy5kZWZhdWx0VmFsdWUhLCB4XSkpO1xyXG5cclxuICAgICAgICBjb25zdCB1bmRlcnN0YW5kaW5nID0gdW5kZXJzdGFuZGluZ3NCeUFjdGlvbi5nZXQoYWN0aW9uKTtcclxuXHJcbiAgICAgICAgaWYgKCF1bmRlcnN0YW5kaW5nKXtcclxuICAgICAgICAgICAgdGhpcy5vdXRwdXQud3JpdGUoXCJJIGRvbid0IGtub3cgaG93IHRvIGRvIHRoYXQuXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtZWFuaW5nRmllbGQgPSB1bmRlcnN0YW5kaW5nLmZpZWxkcy5maW5kKHggPT4geC5uYW1lID09IFVuZGVyc3RhbmRpbmcubWVhbmluZyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1lYW5pbmcgPSB0aGlzLmRldGVybWluZU1lYW5pbmdGb3IoPHN0cmluZz5tZWFuaW5nRmllbGQ/LmRlZmF1bHRWYWx1ZSEpO1xyXG4gICAgICAgIGNvbnN0IGFjdHVhbFRhcmdldE5hbWUgPSB0aGlzLmluZmVyVGFyZ2V0RnJvbSh0aHJlYWQsIHRhcmdldE5hbWUsIG1lYW5pbmcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghYWN0dWFsVGFyZ2V0TmFtZSl7XHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0LndyaXRlKFwiSSBkb24ndCBrbm93IHdoYXQgeW91J3JlIHJlZmVycmluZyB0by5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRocmVhZC5rbm93blR5cGVzLmdldChhY3R1YWxUYXJnZXROYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKCF0YXJnZXQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGxvY2F0ZSB0eXBlXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmxvY2F0ZVRhcmdldEluc3RhbmNlKHRocmVhZCwgdGFyZ2V0LCBtZWFuaW5nKTtcclxuXHJcbiAgICAgICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBSdW50aW1lV29ybGRPYmplY3QpKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBsb2NhdGUgd29ybGQgdHlwZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXRjaChtZWFuaW5nKXtcclxuICAgICAgICAgICAgY2FzZSBNZWFuaW5nLkRlc2NyaWJpbmc6e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZSh0aHJlYWQsIGluc3RhbmNlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuTW92aW5nOiB7ICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dFBsYWNlID0gPFJ1bnRpbWVQbGFjZT5pbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQbGFjZSA9IHRocmVhZC5jdXJyZW50UGxhY2U7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRQbGFjZSA9IG5leHRQbGFjZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZSh0aHJlYWQsIGluc3RhbmNlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhaXNlRXZlbnQodGhyZWFkLCBuZXh0UGxhY2UsIEV2ZW50VHlwZS5QbGF5ZXJFbnRlcnNQbGFjZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhaXNlRXZlbnQodGhyZWFkLCBjdXJyZW50UGxhY2UhLCBFdmVudFR5cGUuUGxheWVyRXhpdHNQbGFjZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuVGFraW5nOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gdGhyZWFkLmN1cnJlbnRQbGFjZSEuZ2V0Q29udGVudHNGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgbGlzdC5pdGVtcyA9IGxpc3QuaXRlbXMuZmlsdGVyKHggPT4geC50eXBlTmFtZSAhPSB0YXJnZXQubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGludmVudG9yeSA9IHRocmVhZC5jdXJyZW50UGxheWVyIS5nZXRDb250ZW50c0ZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICBpbnZlbnRvcnkuaXRlbXMucHVzaChpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZSh0aHJlYWQsIHRocmVhZC5jdXJyZW50UGxhY2UhLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuSW52ZW50b3J5OntcclxuICAgICAgICAgICAgICAgIGNvbnN0IGludmVudG9yeSA9ICg8UnVudGltZVBsYXllcj5pbnN0YW5jZSkuZ2V0Q29udGVudHNGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZUNvbnRlbnRzKHRocmVhZCwgaW52ZW50b3J5KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTWVhbmluZy5Ecm9wcGluZzp7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gdGhyZWFkLmN1cnJlbnRQbGF5ZXIhLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgICAgIGxpc3QuaXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUgIT0gdGFyZ2V0Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50cyA9IHRocmVhZC5jdXJyZW50UGxhY2UhLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRzLml0ZW1zLnB1c2goaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpYmUodGhyZWFkLCB0aHJlYWQuY3VycmVudFBsYWNlISwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbnN1cHBvcnRlZCBtZWFuaW5nIGZvdW5kXCIpO1xyXG4gICAgICAgIH0gIFxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByYWlzZUV2ZW50KHRocmVhZDpUaHJlYWQsIGxvY2F0aW9uOlJ1bnRpbWVQbGFjZSwgdHlwZTpFdmVudFR5cGUpe1xyXG4gICAgICAgIGNvbnN0IGV2ZW50cyA9IEFycmF5LmZyb20obG9jYXRpb24ubWV0aG9kcy52YWx1ZXMoKSEpLmZpbHRlcih4ID0+IHguZXZlbnRUeXBlID09IHR5cGUpO1xyXG5cclxuICAgICAgICBmb3IoY29uc3QgZXZlbnQgb2YgZXZlbnRzKXtcclxuICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gbG9jYXRpb24ubWV0aG9kcy5nZXQoZXZlbnQubmFtZSkhO1xyXG4gICAgICAgICAgICBtZXRob2QuYWN0dWFsUGFyYW1ldGVycyA9IFtuZXcgVmFyaWFibGUoXCJ+dGhpc1wiLCBuZXcgVHlwZShsb2NhdGlvbj8udHlwZU5hbWUhLCBsb2NhdGlvbj8ucGFyZW50VHlwZU5hbWUhKSwgbG9jYXRpb24pXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRlID0gbmV3IFJ1bnRpbWVEZWxlZ2F0ZShtZXRob2QpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChkZWxlZ2F0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9jYXRlVGFyZ2V0SW5zdGFuY2UodGhyZWFkOlRocmVhZCwgdGFyZ2V0OlR5cGUsIG1lYW5pbmc6TWVhbmluZyk6UnVudGltZUFueXx1bmRlZmluZWR7XHJcbiAgICAgICAgaWYgKG1lYW5pbmcgPT09IE1lYW5pbmcuVGFraW5nKXtcclxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IDxSdW50aW1lTGlzdD50aHJlYWQuY3VycmVudFBsYWNlIS5maWVsZHMuZ2V0KFdvcmxkT2JqZWN0LmNvbnRlbnRzKT8udmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoaW5nSXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUgPT09IHRhcmdldC5uYW1lKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChtYXRjaGluZ0l0ZW1zLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGluZ0l0ZW1zWzBdO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobWVhbmluZyA9PT0gTWVhbmluZy5Ecm9wcGluZyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSA8UnVudGltZUxpc3Q+dGhyZWFkLmN1cnJlbnRQbGF5ZXIhLmZpZWxkcy5nZXQoV29ybGRPYmplY3QuY29udGVudHMpPy52YWx1ZTsgICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbWF0Y2hpbmdJdGVtcyA9IGxpc3QuaXRlbXMuZmlsdGVyKHggPT4geC50eXBlTmFtZSA9PT0gdGFyZ2V0Lm5hbWUpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKG1hdGNoaW5nSXRlbXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoaW5nSXRlbXNbMF07XHJcbiAgICAgICAgfSBlbHNlIHsgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gTWVtb3J5LmZpbmRJbnN0YW5jZUJ5TmFtZSh0YXJnZXQubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5mZXJUYXJnZXRGcm9tKHRocmVhZDpUaHJlYWQsIHRhcmdldE5hbWU6c3RyaW5nLCBtZWFuaW5nOk1lYW5pbmcpe1xyXG4gICAgICAgIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLk1vdmluZyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlTmFtZSA9IDxSdW50aW1lU3RyaW5nPnRocmVhZC5jdXJyZW50UGxhY2U/LmZpZWxkcy5nZXQoYH4ke3RhcmdldE5hbWV9YCk/LnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwbGFjZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBsYWNlTmFtZS52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLkludmVudG9yeSl7XHJcbiAgICAgICAgICAgIHJldHVybiBQbGF5ZXIudHlwZU5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGFyZ2V0TmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlc2NyaWJlKHRocmVhZDpUaHJlYWQsIHRhcmdldDpSdW50aW1lV29ybGRPYmplY3QsIGlzU2hhbGxvd0Rlc2NyaXB0aW9uOmJvb2xlYW4pe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godGFyZ2V0KTtcclxuXHJcbiAgICAgICAgY29uc3QgZGVzY3JpYmUgPSB0YXJnZXQubWV0aG9kcy5nZXQoV29ybGRPYmplY3QuZGVzY3JpYmUpITtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUuYWN0dWFsUGFyYW1ldGVycy51bnNoaWZ0KG5ldyBWYXJpYWJsZShcIn50aGlzXCIsIG5ldyBUeXBlKHRhcmdldD8udHlwZU5hbWUhLCB0YXJnZXQ/LnBhcmVudFR5cGVOYW1lISksIHRhcmdldCkpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKG5ldyBSdW50aW1lRGVsZWdhdGUoZGVzY3JpYmUpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlc2NyaWJlQ29udGVudHMoZXhlY3V0aW9uUG9pbnQ6VGhyZWFkLCB0YXJnZXQ6UnVudGltZUxpc3Qpe1xyXG4gICAgICAgIGZvcihjb25zdCBpdGVtIG9mIHRhcmdldC5pdGVtcyl7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpYmUoZXhlY3V0aW9uUG9pbnQsIDxSdW50aW1lV29ybGRPYmplY3Q+aXRlbSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGV0ZXJtaW5lTWVhbmluZ0ZvcihhY3Rpb246c3RyaW5nKTpNZWFuaW5ne1xyXG4gICAgICAgIGNvbnN0IHN5c3RlbUFjdGlvbiA9IGB+JHthY3Rpb259YDtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogU3VwcG9ydCBjdXN0b20gYWN0aW9ucyBiZXR0ZXIuXHJcblxyXG4gICAgICAgIHN3aXRjaChzeXN0ZW1BY3Rpb24pe1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcuZGVzY3JpYmluZzogcmV0dXJuIE1lYW5pbmcuRGVzY3JpYmluZztcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLm1vdmluZzogcmV0dXJuIE1lYW5pbmcuTW92aW5nO1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcuZGlyZWN0aW9uOiByZXR1cm4gTWVhbmluZy5EaXJlY3Rpb247XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy50YWtpbmc6IHJldHVybiBNZWFuaW5nLlRha2luZztcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLmludmVudG9yeTogcmV0dXJuIE1lYW5pbmcuSW52ZW50b3J5O1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcuZHJvcHBpbmc6IHJldHVybiBNZWFuaW5nLkRyb3BwaW5nO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1lYW5pbmcuQ3VzdG9tO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4uL01ldGhvZEFjdGl2YXRpb25cIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RhbmNlQ2FsbEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBtZXRob2ROYW1lPzpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhyZWFkLmN1cnJlbnRNZXRob2Q7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5tZXRob2ROYW1lKXtcclxuICAgICAgICAgICAgdGhpcy5tZXRob2ROYW1lID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGN1cnJlbnQucG9wKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGluc3RhbmNlPy5tZXRob2RzLmdldCh0aGlzLm1ldGhvZE5hbWUpITtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5jYWxsLmluc3RcXHQke2luc3RhbmNlPy50eXBlTmFtZX06OiR7dGhpcy5tZXRob2ROYW1lfSguLi4ke21ldGhvZC5wYXJhbWV0ZXJzLmxlbmd0aH0pYCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgcGFyYW1ldGVyVmFsdWVzOlZhcmlhYmxlW10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1ldGhvZCEucGFyYW1ldGVycy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlciA9IG1ldGhvZCEucGFyYW1ldGVyc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjdXJyZW50LnBvcCgpITtcclxuICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSBuZXcgVmFyaWFibGUocGFyYW1ldGVyLm5hbWUsIHBhcmFtZXRlci50eXBlISwgaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgcGFyYW1ldGVyVmFsdWVzLnB1c2godmFyaWFibGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBIQUNLOiBXZSBzaG91bGRuJ3QgY3JlYXRlIG91ciBvd24gdHlwZSwgd2Ugc2hvdWxkIGluaGVyZW50bHkga25vdyB3aGF0IGl0IGlzLlxyXG5cclxuICAgICAgICBwYXJhbWV0ZXJWYWx1ZXMudW5zaGlmdChuZXcgVmFyaWFibGUoXCJ+dGhpc1wiLCBuZXcgVHlwZShpbnN0YW5jZT8udHlwZU5hbWUhLCBpbnN0YW5jZT8ucGFyZW50VHlwZU5hbWUhKSwgaW5zdGFuY2UpKTtcclxuXHJcbiAgICAgICAgbWV0aG9kLmFjdHVhbFBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJWYWx1ZXM7XHJcblxyXG4gICAgICAgIHRocmVhZC5hY3RpdmF0ZU1ldGhvZChtZXRob2QpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRGVsZWdhdGUgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lRGVsZWdhdGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnZva2VEZWxlZ2F0ZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhcIi5jYWxsLmRlbGVnYXRlXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCkhO1xyXG5cclxuICAgICAgICBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBSdW50aW1lRGVsZWdhdGUpe1xyXG4gICAgICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gdGhyZWFkLmFjdGl2YXRlTWV0aG9kKGluc3RhbmNlLndyYXBwZWRNZXRob2QpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFVuYWJsZSB0byBpbnZva2UgZGVsZWdhdGUgZm9yIG5vbi1kZWxlZ2F0ZSBpbnN0YW5jZSAnJHtpbnN0YW5jZX0nYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZEZpZWxkSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuICAgICAgICBjb25zdCBmaWVsZE5hbWUgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuXHJcbiAgICAgICAgY29uc3QgZmllbGQgPSBpbnN0YW5jZT8uZmllbGRzLmdldChmaWVsZE5hbWUpO1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGZpZWxkPy52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5sZC5maWVsZFxcdFxcdCR7aW5zdGFuY2U/LnR5cGVOYW1lfTo6JHtmaWVsZE5hbWV9IC8vICR7dmFsdWV9YCk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkSW5zdGFuY2VIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIGlmICh0eXBlTmFtZSA9PT0gXCJ+aXRcIil7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aHJlYWQuY3VycmVudFBsYWNlITtcclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChzdWJqZWN0KTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKFwiLmxkLmN1cnIucGxhY2VcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGxvYWQgaW5zdGFuY2UgZm9yIHVuc3VwcG9ydGVkIHR5cGUgJyR7dHlwZU5hbWV9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkTG9jYWxIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgbG9jYWxOYW1lID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICBjb25zdCBwYXJhbWV0ZXIgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5tZXRob2Q/LmFjdHVhbFBhcmFtZXRlcnMuZmluZCh4ID0+IHgubmFtZSA9PSBsb2NhbE5hbWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHBhcmFtZXRlcj8udmFsdWUhKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5sZC5wYXJhbVxcdFxcdCR7bG9jYWxOYW1lfT0ke3BhcmFtZXRlcj8udmFsdWV9YCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZE51bWJlckhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZSA9IDxudW1iZXI+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG4gICAgICAgIGNvbnN0IHJ1bnRpbWVWYWx1ZSA9IE1lbW9yeS5hbGxvY2F0ZU51bWJlcih2YWx1ZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2gocnVudGltZVZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5sZC5jb25zdC5udW1cXHQke3ZhbHVlfWApO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4uL01ldGhvZEFjdGl2YXRpb25cIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBJbnN0YW5jZUNhbGxIYW5kbGVyIH0gZnJvbSBcIi4vSW5zdGFuY2VDYWxsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkVGhpc0hhbmRsZXIgfSBmcm9tIFwiLi9Mb2FkVGhpc0hhbmRsZXJcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZFByb3BlcnR5SGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZpZWxkTmFtZT86c3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpZWxkTmFtZSl7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGROYW1lID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBmaWVsZCA9IGluc3RhbmNlPy5maWVsZHMuZ2V0KHRoaXMuZmllbGROYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBmaWVsZD8udmFsdWUhO1xyXG5cclxuICAgICAgICBjb25zdCBnZXRGaWVsZCA9IGluc3RhbmNlPy5tZXRob2RzLmdldChgfmdldF8ke3RoaXMuZmllbGROYW1lfWApO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmxkLnByb3BcXHRcXHQke2luc3RhbmNlPy50eXBlTmFtZX06OiR7dGhpcy5maWVsZE5hbWV9IHtnZXQ9JHtnZXRGaWVsZCAhPSB1bmRlZmluZWR9fSAvLyAke3ZhbHVlfWApO1xyXG5cclxuICAgICAgICBpZiAoZ2V0RmllbGQpe1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGxvYWRUaGlzID0gbmV3IExvYWRUaGlzSGFuZGxlcigpO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBsb2FkVGhpcy5oYW5kbGUodGhyZWFkKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gRXZhbHVhdGlvblJlc3VsdC5Db250aW51ZSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gbmV3IEluc3RhbmNlQ2FsbEhhbmRsZXIoZ2V0RmllbGQubmFtZSk7XHJcbiAgICAgICAgICAgIGhhbmRsZXIuaGFuZGxlKHRocmVhZCk7XHJcblxyXG4gICAgICAgICAgICAvL2dldEZpZWxkLmFjdHVhbFBhcmFtZXRlcnMucHVzaChuZXcgVmFyaWFibGUoXCJ+dmFsdWVcIiwgZmllbGQ/LnR5cGUhLCB2YWx1ZSkpO1xyXG5cclxuICAgICAgICAgICAgLy90aHJlYWQuYWN0aXZhdGVNZXRob2QoZ2V0RmllbGQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkU3RyaW5nSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uIS52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIil7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0cmluZ1ZhbHVlID0gbmV3IFJ1bnRpbWVTdHJpbmcodmFsdWUpO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHN0cmluZ1ZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAubGQuY29uc3Quc3RyXFx0XCIke3ZhbHVlfVwiYCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIkV4cGVjdGVkIGEgc3RyaW5nXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCJcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRUaGlzSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5tZXRob2Q/LmFjdHVhbFBhcmFtZXRlcnNbMF0udmFsdWUhO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5sZC50aGlzYCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV3SW5zdGFuY2VIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCB0eXBlTmFtZSA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHR5cGVOYW1lID09PSBcInN0cmluZ1wiKXtcclxuICAgICAgICAgICAgY29uc3QgdHlwZSA9IHRocmVhZC5rbm93blR5cGVzLmdldCh0eXBlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZSA9PSBudWxsKXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gbG9jYXRlIHR5cGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gTWVtb3J5LmFsbG9jYXRlKHR5cGUpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChpbnN0YW5jZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOb09wSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuQ29udGludWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQ29tbWFuZCB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVDb21tYW5kXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyc2VDb21tYW5kSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5oYW5kbGUuY21kLnBhcnNlYCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgdGV4dCA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAodGV4dCBpbnN0YW5jZW9mIFJ1bnRpbWVTdHJpbmcpe1xyXG4gICAgICAgICAgICBjb25zdCBjb21tYW5kVGV4dCA9IHRleHQudmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLnBhcnNlQ29tbWFuZChjb21tYW5kVGV4dCk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKGNvbW1hbmQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gcGFyc2UgY29tbWFuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBhcnNlQ29tbWFuZCh0ZXh0OnN0cmluZyk6UnVudGltZUNvbW1hbmR7XHJcbiAgICAgICAgY29uc3QgcGllY2VzID0gdGV4dC5zcGxpdChcIiBcIik7XHJcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IE1lbW9yeS5hbGxvY2F0ZUNvbW1hbmQoKTtcclxuICAgICAgICBcclxuICAgICAgICBjb21tYW5kLmFjdGlvbiA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhwaWVjZXNbMF0pO1xyXG4gICAgICAgIGNvbW1hbmQudGFyZ2V0TmFtZSA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhwaWVjZXNbMV0pO1xyXG5cclxuICAgICAgICByZXR1cm4gY29tbWFuZDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5pbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQcmludEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHJpdmF0ZSBvdXRwdXQ6SU91dHB1dDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvdXRwdXQ6SU91dHB1dCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm91dHB1dCA9IG91dHB1dDtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAodGV4dCBpbnN0YW5jZW9mIFJ1bnRpbWVTdHJpbmcpe1xyXG4gICAgICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhcIi5wcmludFwiKTtcclxuICAgICAgICAgICAgdGhpcy5vdXRwdXQud3JpdGUodGV4dC52YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBwcmludCwgZW5jb3VudGVyZWQgYSB0eXBlIG9uIHRoZSBzdGFjayBvdGhlciB0aGFuIHN0cmluZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlYWRJbnB1dEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKFwiLnJlYWQuaW5cIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuU3VzcGVuZEZvcklucHV0O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFbXB0eSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVFbXB0eVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJldHVybkhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSByZXR1cm5pbmcgdG9wIHZhbHVlIG9uIHN0YWNrIGJhc2VkIG9uIHJldHVybiB0eXBlIG9mIG1ldGhvZC5cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhyZWFkLmN1cnJlbnRNZXRob2Q7XHJcbiAgICAgICAgY29uc3Qgc2l6ZSA9IGN1cnJlbnQuc3RhY2tTaXplKCk7XHJcbiAgICAgICAgY29uc3QgaGFzUmV0dXJuVHlwZSA9IGN1cnJlbnQubWV0aG9kPy5yZXR1cm5UeXBlICE9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmIChoYXNSZXR1cm5UeXBlKXtcclxuICAgICAgICAgICAgaWYgKHNpemUgPT0gMCl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiRXhwZWN0ZWQgcmV0dXJuIHZhbHVlIGZyb20gbWV0aG9kIGJ1dCBmb3VuZCBubyBpbnN0YW5jZSBvbiB0aGUgc3RhY2tcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2l6ZSA+IDEpe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgU3RhY2sgSW1iYWxhbmNlISBSZXR1cm5pbmcgZnJvbSAnJHtjdXJyZW50Lm1ldGhvZD8ubmFtZX0nIGZvdW5kICcke3NpemV9JyBpbnN0YW5jZXMgbGVmdCBidXQgZXhwZWN0ZWQgb25lLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHNpemUgPiAwKXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFN0YWNrIEltYmFsYW5jZSEgUmV0dXJuaW5nIGZyb20gJyR7Y3VycmVudC5tZXRob2Q/Lm5hbWV9JyBmb3VuZCAnJHtzaXplfScgaW5zdGFuY2VzIGxlZnQgYnV0IGV4cGVjdGVkIHplcm8uYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0gdGhyZWFkIS5yZXR1cm5Gcm9tQ3VycmVudE1ldGhvZCgpO1xyXG5cclxuICAgICAgICBpZiAoIShyZXR1cm5WYWx1ZSBpbnN0YW5jZW9mIFJ1bnRpbWVFbXB0eSkpe1xyXG4gICAgICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLnJldFxcdFxcdCR7cmV0dXJuVmFsdWV9YCk7XHJcbiAgICAgICAgICAgIHRocmVhZD8uY3VycmVudE1ldGhvZC5wdXNoKHJldHVyblZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhcIi5yZXQgdm9pZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBFdmFsdWF0aW9uUmVzdWx0LkNvbnRpbnVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgTWV0aG9kQWN0aXZhdGlvbiB9IGZyb20gXCIuLi9NZXRob2RBY3RpdmF0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhdGljQ2FsbEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IGNhbGxUZXh0ID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIGNvbnN0IHBpZWNlcyA9IGNhbGxUZXh0LnNwbGl0KFwiLlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSBwaWVjZXNbMF07XHJcbiAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IHBpZWNlc1sxXTtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZSA9IHRocmVhZC5rbm93blR5cGVzLmdldCh0eXBlTmFtZSkhO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHR5cGU/Lm1ldGhvZHMuZmluZCh4ID0+IHgubmFtZSA9PT0gbWV0aG9kTmFtZSkhOyAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmNhbGwuc3RhdGljXFx0JHt0eXBlTmFtZX06OiR7bWV0aG9kTmFtZX0oKWApO1xyXG5cclxuICAgICAgICB0aHJlYWQuYWN0aXZhdGVNZXRob2QobWV0aG9kKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBlT2ZIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCB0eXBlTmFtZSA9IDxzdHJpbmc+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLnR5cGVvZiAke3R5cGVOYW1lfWApO1xyXG5cclxuICAgICAgICBpZiAodGhyZWFkLmN1cnJlbnRNZXRob2Quc3RhY2tTaXplKCkgPT0gMCl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gTWVtb3J5LmFsbG9jYXRlQm9vbGVhbihmYWxzZSk7XHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucGVlaygpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaXNUeXBlID0gaW5zdGFuY2U/LnR5cGVOYW1lID09IHR5cGVOYW1lO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBNZW1vcnkuYWxsb2NhdGVCb29sZWFuKGlzVHlwZSk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBNZWFuaW5ne1xyXG4gICAgRGVzY3JpYmluZyxcclxuICAgIFRha2luZyxcclxuICAgIE1vdmluZyxcclxuICAgIERpcmVjdGlvbixcclxuICAgIEludmVudG9yeSxcclxuICAgIERyb3BwaW5nLFxyXG4gICAgUXVpdHRpbmcsXHJcbiAgICBDdXN0b21cclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuL1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUFueXtcclxuICAgIHBhcmVudFR5cGVOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICB0eXBlTmFtZTpzdHJpbmcgPSBBbnkudHlwZU5hbWU7XHJcblxyXG4gICAgZmllbGRzOk1hcDxzdHJpbmcsIFZhcmlhYmxlPiA9IG5ldyBNYXA8c3RyaW5nLCBWYXJpYWJsZT4oKTtcclxuICAgIG1ldGhvZHM6TWFwPHN0cmluZywgTWV0aG9kPiA9IG5ldyBNYXA8c3RyaW5nLCBNZXRob2Q+KCk7XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy50eXBlTmFtZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUJvb2xlYW4gZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOmJvb2xlYW4pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuL1J1bnRpbWVTdHJpbmdcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lQ29tbWFuZCBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGFyZ2V0TmFtZT86UnVudGltZVN0cmluZywgcHVibGljIGFjdGlvbj86UnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBEZWxlZ2F0ZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0RlbGVnYXRlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZURlbGVnYXRlIGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBEZWxlZ2F0ZS50eXBlTmFtZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgd3JhcHBlZE1ldGhvZDpNZXRob2Qpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lRW1wdHkgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IFwifmVtcHR5XCI7XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVJbnRlZ2VyIGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTpudW1iZXIpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0l0ZW1cIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVJdGVtIGV4dGVuZHMgUnVudGltZVdvcmxkT2JqZWN0e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gSXRlbS50eXBlTmFtZTtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IHR5cGUoKTpUeXBle1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBSdW50aW1lV29ybGRPYmplY3QudHlwZTtcclxuXHJcbiAgICAgICAgdHlwZS5uYW1lID0gSXRlbS50eXBlTmFtZTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IFBhcmFtZXRlciB9IGZyb20gXCIuLi8uLi9jb21tb24vUGFyYW1ldGVyXCI7XHJcbmltcG9ydCB7IE51bWJlclR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9OdW1iZXJUeXBlXCI7XHJcbmltcG9ydCB7IFN0cmluZ1R5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9TdHJpbmdUeXBlXCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9JbnN0cnVjdGlvblwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4vUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lSW50ZWdlciB9IGZyb20gXCIuL1J1bnRpbWVJbnRlZ2VyXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IEJvb2xlYW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQm9vbGVhblR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lTGlzdCBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaXRlbXM6UnVudGltZUFueVtdKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250YWlucyA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICBjb250YWlucy5uYW1lID0gTGlzdC5jb250YWlucztcclxuICAgICAgICBjb250YWlucy5wYXJhbWV0ZXJzLnB1c2goXHJcbiAgICAgICAgICAgIG5ldyBQYXJhbWV0ZXIoTGlzdC50eXBlTmFtZVBhcmFtZXRlciwgU3RyaW5nVHlwZS50eXBlTmFtZSksXHJcbiAgICAgICAgICAgIG5ldyBQYXJhbWV0ZXIoTGlzdC5jb3VudFBhcmFtZXRlciwgTnVtYmVyVHlwZS50eXBlTmFtZSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb250YWlucy5yZXR1cm5UeXBlID0gQm9vbGVhblR5cGUudHlwZU5hbWU7XHJcblxyXG4gICAgICAgIGNvbnRhaW5zLmJvZHkucHVzaChcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZExvY2FsKExpc3QuY291bnRQYXJhbWV0ZXIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkTG9jYWwoTGlzdC50eXBlTmFtZVBhcmFtZXRlciksICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uZXh0ZXJuYWxDYWxsKFwiY29udGFpbnNUeXBlXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5yZXR1cm4oKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5zZXQoTGlzdC5jb250YWlucywgY29udGFpbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29udGFpbnNUeXBlKHR5cGVOYW1lOlJ1bnRpbWVTdHJpbmcsIGNvdW50OlJ1bnRpbWVJbnRlZ2VyKXtcclxuICAgICAgICBjb25zdCBmb3VuZEl0ZW1zID0gdGhpcy5pdGVtcy5maWx0ZXIoeCA9PiB4LnR5cGVOYW1lID09PSB0eXBlTmFtZS52YWx1ZSk7XHJcbiAgICAgICAgY29uc3QgZm91bmQgPSBmb3VuZEl0ZW1zLmxlbmd0aCA9PT0gY291bnQudmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiBNZW1vcnkuYWxsb2NhdGVCb29sZWFuKGZvdW5kKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVXb3JsZE9iamVjdCB9IGZyb20gXCIuL1J1bnRpbWVXb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVQbGFjZSBleHRlbmRzIFJ1bnRpbWVXb3JsZE9iamVjdHtcclxuICAgIHBhcmVudFR5cGVOYW1lID0gV29ybGRPYmplY3QucGFyZW50VHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IFBsYWNlLnR5cGVOYW1lO1xyXG5cclxuICAgIHN0YXRpYyBnZXQgdHlwZSgpOlR5cGV7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IFJ1bnRpbWVXb3JsZE9iamVjdC50eXBlO1xyXG5cclxuICAgICAgICB0eXBlLm5hbWUgPSBQbGFjZS50eXBlTmFtZTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVXb3JsZE9iamVjdCB9IGZyb20gXCIuL1J1bnRpbWVXb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYXllclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVQbGF5ZXIgZXh0ZW5kcyBSdW50aW1lV29ybGRPYmplY3R7XHJcbiAgICBzdGF0aWMgZ2V0IHR5cGUoKTpUeXBle1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBSdW50aW1lV29ybGRPYmplY3QudHlwZTtcclxuXHJcbiAgICAgICAgdHlwZS5uYW1lID0gUGxheWVyLnR5cGVOYW1lO1xyXG5cclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVNheSBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBtZXNzYWdlOnN0cmluZyA9IFwiXCI7XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lU3RyaW5nIGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIHZhbHVlOnN0cmluZztcclxuICAgIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBcIn5zdHJpbmdcIjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIGBcIiR7dGhpcy52YWx1ZX1cImA7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lTGlzdCB9IGZyb20gXCIuL1J1bnRpbWVMaXN0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4vVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuLi8uLi9jb21tb24vRmllbGRcIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lV29ybGRPYmplY3QgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG5cclxuICAgIHN0YXRpYyBnZXQgdHlwZSgpOlR5cGV7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IG5ldyBUeXBlKFdvcmxkT2JqZWN0LnR5cGVOYW1lLCBXb3JsZE9iamVjdC5wYXJlbnRUeXBlTmFtZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY29udGVudHMgPSBuZXcgRmllbGQoKTtcclxuICAgICAgICBjb250ZW50cy5uYW1lID0gV29ybGRPYmplY3QuY29udGVudHM7XHJcbiAgICAgICAgY29udGVudHMudHlwZU5hbWUgPSBMaXN0LnR5cGVOYW1lO1xyXG4gICAgICAgIGNvbnRlbnRzLmRlZmF1bHRWYWx1ZSA9IFtdO1xyXG5cclxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uLm5hbWUgPSBXb3JsZE9iamVjdC5kZXNjcmlwdGlvbjtcclxuICAgICAgICBkZXNjcmlwdGlvbi50eXBlTmFtZSA9IFN0cmluZ1R5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgZGVzY3JpcHRpb24uZGVmYXVsdFZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgdHlwZS5maWVsZHMucHVzaChjb250ZW50cyk7XHJcbiAgICAgICAgdHlwZS5maWVsZHMucHVzaChkZXNjcmlwdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0RmllbGRWYWx1ZUJ5TmFtZShuYW1lOnN0cmluZyk6UnVudGltZUFueXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZmllbGRzLmdldChuYW1lKT8udmFsdWU7XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZSA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBBdHRlbXB0ZWQgZmllbGQgYWNjZXNzIGZvciB1bmtub3duIGZpZWxkICcke25hbWV9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnRlbnRzRmllbGQoKTpSdW50aW1lTGlzdHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRGaWVsZEFzTGlzdChXb3JsZE9iamVjdC5jb250ZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RmllbGRBc0xpc3QobmFtZTpzdHJpbmcpOlJ1bnRpbWVMaXN0e1xyXG4gICAgICAgIHJldHVybiA8UnVudGltZUxpc3Q+dGhpcy5nZXRGaWVsZFZhbHVlQnlOYW1lKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEZpZWxkQXNTdHJpbmcobmFtZTpzdHJpbmcpOlJ1bnRpbWVTdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIDxSdW50aW1lU3RyaW5nPnRoaXMuZ2V0RmllbGRWYWx1ZUJ5TmFtZShuYW1lKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWYXJpYWJsZXtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbmFtZTpzdHJpbmcsIFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHR5cGU6VHlwZSxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyB2YWx1ZT86UnVudGltZUFueSl7XHJcbiAgICB9XHJcbn0iXX0=
