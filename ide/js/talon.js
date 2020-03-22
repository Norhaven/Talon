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
        this.compileButton = TalonIde.getById("compile");
        this.startNewGameButton = TalonIde.getById("start-new-game");
        this.userCommandText = TalonIde.getById("user-command-text");
        this.sendUserCommandButton = TalonIde.getById("send-user-command");
        this.compileButton.addEventListener('click', e => this.compile());
        this.startNewGameButton.addEventListener('click', e => this.startNewGame());
        this.sendUserCommandButton.addEventListener('click', e => this.sendUserCommand());
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
}
exports.TalonIde = TalonIde;
},{"./PaneOutput":1,"./compiler/TalonCompiler":11,"./runtime/TalonRuntime":63}],3:[function(require,module,exports){
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
    OpCode[OpCode["Print"] = 1] = "Print";
    OpCode[OpCode["LoadString"] = 2] = "LoadString";
    OpCode[OpCode["NewInstance"] = 3] = "NewInstance";
    OpCode[OpCode["ParseCommand"] = 4] = "ParseCommand";
    OpCode[OpCode["HandleCommand"] = 5] = "HandleCommand";
    OpCode[OpCode["ReadInput"] = 6] = "ReadInput";
    OpCode[OpCode["GoTo"] = 7] = "GoTo";
    OpCode[OpCode["Return"] = 8] = "Return";
    OpCode[OpCode["BranchRelative"] = 9] = "BranchRelative";
    OpCode[OpCode["BranchRelativeIfFalse"] = 10] = "BranchRelativeIfFalse";
    OpCode[OpCode["Concatenate"] = 11] = "Concatenate";
    OpCode[OpCode["LoadNumber"] = 12] = "LoadNumber";
    OpCode[OpCode["LoadField"] = 13] = "LoadField";
    OpCode[OpCode["LoadProperty"] = 14] = "LoadProperty";
    OpCode[OpCode["LoadInstance"] = 15] = "LoadInstance";
    OpCode[OpCode["LoadLocal"] = 16] = "LoadLocal";
    OpCode[OpCode["LoadThis"] = 17] = "LoadThis";
    OpCode[OpCode["InstanceCall"] = 18] = "InstanceCall";
    OpCode[OpCode["StaticCall"] = 19] = "StaticCall";
    OpCode[OpCode["ExternalCall"] = 20] = "ExternalCall";
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
        main.body.push(Instruction_1.Instruction.loadString(`Talon Language v.${this.languageVersion}, Compiler v.${this.version}`), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString("================================="), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.staticCall("~globalSays", "~say"), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString("What would you like to do?"), Instruction_1.Instruction.print(), Instruction_1.Instruction.readInput(), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.parseCommand(), Instruction_1.Instruction.handleCommand(), Instruction_1.Instruction.goTo(9));
        type.methods.push(main);
        return type;
    }
}
exports.TalonCompiler = TalonCompiler;
},{"../common/Instruction":5,"../common/Method":6,"../common/Type":9,"../common/Version":10,"../library/Any":45,"../library/EntryPointAttribute":47,"./exceptions/CompilationError":12,"./lexing/TalonLexer":15,"./parsing/TalonParser":19,"./semantics/TalonSemanticAnalyzer":42,"./transforming/TalonTransformer":44}],12:[function(require,module,exports){
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
},{"../../library/Any":45,"../../library/BooleanType":46,"../../library/Item":49,"../../library/List":50,"../../library/Place":52,"../../library/WorldObject":57,"./TokenType":17}],17:[function(require,module,exports){
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
},{"./ParseContext":18,"./visitors/ProgramVisitor":36}],20:[function(require,module,exports){
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
class ProgramExpression extends Expression_1.Expression {
    constructor(expressions) {
        super();
        this.expressions = expressions;
    }
}
exports.ProgramExpression = ProgramExpression;
},{"./Expression":24}],28:[function(require,module,exports){
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
},{"./Expression":24}],29:[function(require,module,exports){
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
},{"./Expression":24}],30:[function(require,module,exports){
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
},{"./Expression":24}],31:[function(require,module,exports){
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
},{"./Expression":24}],32:[function(require,module,exports){
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
},{"../../lexing/Keywords":13,"../expressions/ActionsExpression":20,"./ExpressionVisitor":33}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Visitor_1 = require("./Visitor");
const Keywords_1 = require("../../lexing/Keywords");
const IfExpressionVisitor_1 = require("./IfExpressionVisitor");
const CompilationError_1 = require("../../exceptions/CompilationError");
const ContainsExpression_1 = require("../expressions/ContainsExpression");
const SayExpression_1 = require("../expressions/SayExpression");
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
},{"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../expressions/ContainsExpression":23,"../expressions/SayExpression":28,"./IfExpressionVisitor":35,"./Visitor":40}],34:[function(require,module,exports){
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
},{"../../../library/BooleanType":46,"../../../library/List":50,"../../../library/Place":52,"../../../library/StringType":55,"../../../library/WorldObject":57,"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../expressions/ConcatenationExpression":22,"../expressions/FieldDeclarationExpression":25,"./ExpressionVisitor":33,"./Visitor":40}],35:[function(require,module,exports){
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
},{"../../lexing/Keywords":13,"../expressions/Expression":24,"../expressions/IfExpression":26,"./ExpressionVisitor":33,"./Visitor":40}],36:[function(require,module,exports){
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
},{"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../expressions/ProgramExpression":27,"./SayExpressionVisitor":37,"./TypeDeclarationVisitor":38,"./UnderstandingDeclarationVisitor":39,"./Visitor":40}],37:[function(require,module,exports){
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
},{"../../lexing/Keywords":13,"../expressions/SayExpression":28,"./Visitor":40}],38:[function(require,module,exports){
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
},{"../../lexing/Keywords":13,"../expressions/TypeDeclarationExpression":29,"./FieldDeclarationVisitor":34,"./Visitor":40,"./WhenDeclarationVisitor":41}],39:[function(require,module,exports){
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
},{"../../lexing/Keywords":13,"../expressions/UnderstandingDeclarationExpression":30,"./Visitor":40}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Visitor {
}
exports.Visitor = Visitor;
},{}],41:[function(require,module,exports){
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
},{"../../lexing/Keywords":13,"../expressions/WhenDeclarationExpression":31,"./EventExpressionVisitor":32,"./Visitor":40}],42:[function(require,module,exports){
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
},{"../lexing/Token":16,"../lexing/TokenType":17,"../parsing/expressions/ProgramExpression":27,"../parsing/expressions/TypeDeclarationExpression":29}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExpressionTransformationMode;
(function (ExpressionTransformationMode) {
    ExpressionTransformationMode[ExpressionTransformationMode["None"] = 0] = "None";
    ExpressionTransformationMode[ExpressionTransformationMode["IgnoreResultsOfSayExpression"] = 1] = "IgnoreResultsOfSayExpression";
})(ExpressionTransformationMode = exports.ExpressionTransformationMode || (exports.ExpressionTransformationMode = {}));
},{}],44:[function(require,module,exports){
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
                                for (const instruction of this.transformExpression(associated)) {
                                    getField.body.push(instruction);
                                }
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
            // TODO: Load the left-hand side so it can be concatenated when the right side evaluates.
            const left = this.transformExpression(expression.left, mode);
            const right = this.transformExpression(expression.right, mode);
            instructions.push(...left);
            instructions.push(...right);
            instructions.push(Instruction_1.Instruction.concatenate());
        }
        else if (expression instanceof FieldDeclarationExpression_1.FieldDeclarationExpression) {
            instructions.push(Instruction_1.Instruction.loadInstance("~it"), Instruction_1.Instruction.loadField(expression.name));
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
},{"../../common/EventType":3,"../../common/Field":4,"../../common/Instruction":5,"../../common/Method":6,"../../common/Parameter":8,"../../common/Type":9,"../../library/Any":45,"../../library/BooleanType":46,"../../library/Item":49,"../../library/List":50,"../../library/NumberType":51,"../../library/Place":52,"../../library/Player":53,"../../library/Say":54,"../../library/StringType":55,"../../library/Understanding":56,"../../library/WorldObject":57,"../exceptions/CompilationError":12,"../lexing/Keywords":13,"../parsing/expressions/ConcatenationExpression":22,"../parsing/expressions/ContainsExpression":23,"../parsing/expressions/FieldDeclarationExpression":25,"../parsing/expressions/IfExpression":26,"../parsing/expressions/ProgramExpression":27,"../parsing/expressions/SayExpression":28,"../parsing/expressions/TypeDeclarationExpression":29,"../parsing/expressions/UnderstandingDeclarationExpression":30,"./ExpressionTransformationMode":43}],45:[function(require,module,exports){
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
},{"./ExternCall":48}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class BooleanType {
}
exports.BooleanType = BooleanType;
BooleanType.parentTypeName = Any_1.Any.typeName;
BooleanType.typeName = "~boolean";
},{"./Any":45}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntryPointAttribute {
    constructor() {
        this.name = "~entryPoint";
    }
}
exports.EntryPointAttribute = EntryPointAttribute;
},{}],48:[function(require,module,exports){
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
},{}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Item {
}
exports.Item = Item;
Item.typeName = "~item";
Item.parentTypeName = WorldObject_1.WorldObject.typeName;
},{"./WorldObject":57}],50:[function(require,module,exports){
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
},{"./Any":45}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class NumberType {
}
exports.NumberType = NumberType;
NumberType.typeName = "~number";
NumberType.parentTypeName = Any_1.Any.typeName;
},{"./Any":45}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Place {
}
exports.Place = Place;
Place.parentTypeName = WorldObject_1.WorldObject.typeName;
Place.typeName = "~place";
Place.isPlayerStart = "~isPlayerStart";
},{"./WorldObject":57}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Player {
}
exports.Player = Player;
Player.typeName = "~player";
Player.parentTypeName = WorldObject_1.WorldObject.typeName;
},{"./WorldObject":57}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class Say {
}
exports.Say = Say;
Say.typeName = "~say";
Say.parentTypeName = Any_1.Any.typeName;
},{"./Any":45}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class StringType {
}
exports.StringType = StringType;
StringType.parentTypeName = Any_1.Any.typeName;
StringType.typeName = "~string";
},{"./Any":45}],56:[function(require,module,exports){
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
},{"./Any":45}],57:[function(require,module,exports){
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
},{"./Any":45}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TalonIde_1 = require("./TalonIde");
var ide = new TalonIde_1.TalonIde();
},{"./TalonIde":2}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EvaluationResult;
(function (EvaluationResult) {
    EvaluationResult[EvaluationResult["Continue"] = 0] = "Continue";
    EvaluationResult[EvaluationResult["SuspendForInput"] = 1] = "SuspendForInput";
})(EvaluationResult = exports.EvaluationResult || (exports.EvaluationResult = {}));
},{}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StackFrame_1 = require("./StackFrame");
class MethodActivation {
    constructor(method) {
        this.stack = [];
        this.method = method;
        this.stackFrame = new StackFrame_1.StackFrame(method);
    }
    stackSize() {
        return this.stack.length;
    }
    pop() {
        return this.stack.pop();
    }
    push(runtimeAny) {
        this.stack.push(runtimeAny);
    }
}
exports.MethodActivation = MethodActivation;
},{"./StackFrame":62}],61:[function(require,module,exports){
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
},{"../common/OpCode":7,"./EvaluationResult":59}],62:[function(require,module,exports){
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
},{"./library/Variable":101}],63:[function(require,module,exports){
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
        var _a, _b, _c, _d, _e, _f, _g;
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
},{"../common/OpCode":7,"../library/Any":45,"../library/EntryPointAttribute":47,"../library/Place":52,"../library/Player":53,"./EvaluationResult":59,"./MethodActivation":60,"./Thread":64,"./common/Memory":65,"./errors/RuntimeError":66,"./handlers/BranchRelativeHandler":67,"./handlers/BranchRelativeIfFalseHandler":68,"./handlers/ConcatenateHandler":69,"./handlers/ExternalCallHandler":70,"./handlers/GoToHandler":71,"./handlers/HandleCommandHandler":72,"./handlers/InstanceCallHandler":73,"./handlers/LoadFieldHandler":74,"./handlers/LoadInstanceHandler":75,"./handlers/LoadLocalHandler":76,"./handlers/LoadNumberHandler":77,"./handlers/LoadPropertyHandler":78,"./handlers/LoadStringHandler":79,"./handlers/LoadThisHandler":80,"./handlers/NewInstanceHandler":81,"./handlers/NoOpHandler":82,"./handlers/ParseCommandHandler":83,"./handlers/PrintHandler":84,"./handlers/ReadInputHandler":85,"./handlers/ReturnHandler":86,"./handlers/StaticCallHandler":87}],64:[function(require,module,exports){
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
},{"../library/Understanding":56,"./MethodActivation":60,"./library/RuntimeEmpty":92}],65:[function(require,module,exports){
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
},{"../../library/BooleanType":46,"../../library/Item":49,"../../library/List":50,"../../library/Place":52,"../../library/Player":53,"../../library/Say":54,"../../library/StringType":55,"../errors/RuntimeError":66,"../library/RuntimeBoolean":90,"../library/RuntimeCommand":91,"../library/RuntimeEmpty":92,"../library/RuntimeInteger":93,"../library/RuntimeItem":94,"../library/RuntimeList":95,"../library/RuntimePlace":96,"../library/RuntimePlayer":97,"../library/RuntimeSay":98,"../library/RuntimeString":99,"../library/Variable":101}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RuntimeError {
    constructor(message) {
        this.message = message;
    }
}
exports.RuntimeError = RuntimeError;
},{}],67:[function(require,module,exports){
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
},{"../OpCodeHandler":61}],68:[function(require,module,exports){
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
},{"../OpCodeHandler":61}],69:[function(require,module,exports){
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
},{"../OpCodeHandler":61,"../common/Memory":65}],70:[function(require,module,exports){
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
},{"../OpCodeHandler":61}],71:[function(require,module,exports){
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
},{"../OpCodeHandler":61,"../errors/RuntimeError":66}],72:[function(require,module,exports){
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
const Player_1 = require("../../library/Player");
const InstanceCallHandler_1 = require("./InstanceCallHandler");
const EventType_1 = require("../../common/EventType");
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
                this.raiseEvent(thread, EventType_1.EventType.PlayerExitsPlace);
                thread.currentPlace = nextPlace;
                this.describe(thread, instance, false);
                this.raiseEvent(thread, EventType_1.EventType.PlayerEntersPlace);
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
    raiseEvent(thread, type) {
        var _a;
        const events = Array.from((_a = thread.currentPlace) === null || _a === void 0 ? void 0 : _a.methods.values()).filter(x => x.eventType == type);
        for (const event of events) {
            thread.currentMethod.push(thread.currentPlace);
            const eventCall = new InstanceCallHandler_1.InstanceCallHandler(event.name);
            eventCall.handle(thread);
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
        const describeType = new InstanceCallHandler_1.InstanceCallHandler(WorldObject_1.WorldObject.describe);
        describeType.handle(thread);
        // const description = target.fields.get(WorldObject.description)?.value;
        // const contents = target.fields.get(WorldObject.contents)?.value;
        // if (!(description instanceof RuntimeString)){
        //     throw new RuntimeError("Unable to describe without a string");
        // }
        // this.output.write(description.value);
        // if (isShallowDescription || contents === undefined){
        //     return;
        // }
        // if (!(contents instanceof RuntimeList)){
        //     throw new RuntimeError("Unable to describe contents without a list");
        // }
        // this.describeContents(contents);
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
},{"../../common/EventType":3,"../../library/Player":53,"../../library/Understanding":56,"../../library/WorldObject":57,"../OpCodeHandler":61,"../common/Memory":65,"../errors/RuntimeError":66,"../library/Meaning":88,"../library/RuntimeCommand":91,"../library/RuntimeWorldObject":100,"./InstanceCallHandler":73}],73:[function(require,module,exports){
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
},{"../../common/Type":9,"../OpCodeHandler":61,"../library/Variable":101}],74:[function(require,module,exports){
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
},{"../OpCodeHandler":61}],75:[function(require,module,exports){
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
},{"../OpCodeHandler":61,"../errors/RuntimeError":66}],76:[function(require,module,exports){
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
},{"../OpCodeHandler":61}],77:[function(require,module,exports){
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
},{"../OpCodeHandler":61,"../common/Memory":65}],78:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const Variable_1 = require("../library/Variable");
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
            getField.actualParameters.push(new Variable_1.Variable("~value", field === null || field === void 0 ? void 0 : field.type, value));
            thread.activateMethod(getField);
        }
        else {
            thread.currentMethod.push(value);
        }
        return super.handle(thread);
    }
}
exports.LoadPropertyHandler = LoadPropertyHandler;
},{"../OpCodeHandler":61,"../library/Variable":101}],79:[function(require,module,exports){
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
},{"../OpCodeHandler":61,"../errors/RuntimeError":66,"../library/RuntimeString":99}],80:[function(require,module,exports){
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
},{"../OpCodeHandler":61}],81:[function(require,module,exports){
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
},{"../OpCodeHandler":61,"../common/Memory":65,"../errors/RuntimeError":66}],82:[function(require,module,exports){
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
},{"../EvaluationResult":59,"../OpCodeHandler":61}],83:[function(require,module,exports){
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
},{"../OpCodeHandler":61,"../common/Memory":65,"../errors/RuntimeError":66,"../library/RuntimeString":99}],84:[function(require,module,exports){
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
            this.output.write(text.value);
            (_a = thread.log) === null || _a === void 0 ? void 0 : _a.debug(".print");
        }
        else {
            throw new RuntimeError_1.RuntimeError("Unable to print, encountered a type on the stack other than string");
        }
        return super.handle(thread);
    }
}
exports.PrintHandler = PrintHandler;
},{"../OpCodeHandler":61,"../errors/RuntimeError":66,"../library/RuntimeString":99}],85:[function(require,module,exports){
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
},{"../EvaluationResult":59,"../OpCodeHandler":61}],86:[function(require,module,exports){
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
},{"../EvaluationResult":59,"../OpCodeHandler":61,"../errors/RuntimeError":66,"../library/RuntimeEmpty":92}],87:[function(require,module,exports){
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
},{"../OpCodeHandler":61}],88:[function(require,module,exports){
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
},{}],89:[function(require,module,exports){
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
},{"../../library/Any":45}],90:[function(require,module,exports){
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
},{"./RuntimeAny":89}],91:[function(require,module,exports){
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
},{"./RuntimeAny":89}],92:[function(require,module,exports){
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
},{"../../library/Any":45,"./RuntimeAny":89}],93:[function(require,module,exports){
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
},{"./RuntimeAny":89}],94:[function(require,module,exports){
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
},{"../../library/Item":49,"../../library/WorldObject":57,"./RuntimeWorldObject":100}],95:[function(require,module,exports){
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
},{"../../common/Instruction":5,"../../common/Method":6,"../../common/Parameter":8,"../../library/BooleanType":46,"../../library/List":50,"../../library/NumberType":51,"../../library/StringType":55,"../common/Memory":65,"./RuntimeAny":89}],96:[function(require,module,exports){
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
},{"../../library/Place":52,"../../library/WorldObject":57,"./RuntimeWorldObject":100}],97:[function(require,module,exports){
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
},{"../../library/Player":53,"./RuntimeWorldObject":100}],98:[function(require,module,exports){
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
},{"./RuntimeAny":89}],99:[function(require,module,exports){
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
},{"../../library/Any":45,"./RuntimeAny":89}],100:[function(require,module,exports){
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
},{"../../common/Field":4,"../../common/Type":9,"../../library/Any":45,"../../library/List":50,"../../library/StringType":55,"../../library/WorldObject":57,"../errors/RuntimeError":66,"./RuntimeAny":89}],101:[function(require,module,exports){
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
},{}]},{},[58])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL25vcmhhL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInRhbG9uL1BhbmVPdXRwdXQudHMiLCJ0YWxvbi9UYWxvbklkZS50cyIsInRhbG9uL2NvbW1vbi9FdmVudFR5cGUudHMiLCJ0YWxvbi9jb21tb24vRmllbGQudHMiLCJ0YWxvbi9jb21tb24vSW5zdHJ1Y3Rpb24udHMiLCJ0YWxvbi9jb21tb24vTWV0aG9kLnRzIiwidGFsb24vY29tbW9uL09wQ29kZS50cyIsInRhbG9uL2NvbW1vbi9QYXJhbWV0ZXIudHMiLCJ0YWxvbi9jb21tb24vVHlwZS50cyIsInRhbG9uL2NvbW1vbi9WZXJzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvVGFsb25Db21waWxlci50cyIsInRhbG9uL2NvbXBpbGVyL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvci50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9LZXl3b3Jkcy50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9QdW5jdHVhdGlvbi50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9UYWxvbkxleGVyLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1Rva2VuLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1Rva2VuVHlwZS50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvUGFyc2VDb250ZXh0LnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9UYWxvblBhcnNlci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvQWN0aW9uc0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0JpbmFyeUV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0NvbmNhdGVuYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Db250YWluc0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0ZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9JZkV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL1Byb2dyYW1FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9TYXlFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9XaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9FdmVudEV4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9FeHByZXNzaW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvRmllbGREZWNsYXJhdGlvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL0lmRXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1Byb2dyYW1WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9TYXlFeHByZXNzaW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvVHlwZURlY2xhcmF0aW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvV2hlbkRlY2xhcmF0aW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3NlbWFudGljcy9UYWxvblNlbWFudGljQW5hbHl6ZXIudHMiLCJ0YWxvbi9jb21waWxlci90cmFuc2Zvcm1pbmcvRXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZS50cyIsInRhbG9uL2NvbXBpbGVyL3RyYW5zZm9ybWluZy9UYWxvblRyYW5zZm9ybWVyLnRzIiwidGFsb24vbGlicmFyeS9BbnkudHMiLCJ0YWxvbi9saWJyYXJ5L0Jvb2xlYW5UeXBlLnRzIiwidGFsb24vbGlicmFyeS9FbnRyeVBvaW50QXR0cmlidXRlLnRzIiwidGFsb24vbGlicmFyeS9FeHRlcm5DYWxsLnRzIiwidGFsb24vbGlicmFyeS9JdGVtLnRzIiwidGFsb24vbGlicmFyeS9MaXN0LnRzIiwidGFsb24vbGlicmFyeS9OdW1iZXJUeXBlLnRzIiwidGFsb24vbGlicmFyeS9QbGFjZS50cyIsInRhbG9uL2xpYnJhcnkvUGxheWVyLnRzIiwidGFsb24vbGlicmFyeS9TYXkudHMiLCJ0YWxvbi9saWJyYXJ5L1N0cmluZ1R5cGUudHMiLCJ0YWxvbi9saWJyYXJ5L1VuZGVyc3RhbmRpbmcudHMiLCJ0YWxvbi9saWJyYXJ5L1dvcmxkT2JqZWN0LnRzIiwidGFsb24vbWFpbi50cyIsInRhbG9uL3J1bnRpbWUvRXZhbHVhdGlvblJlc3VsdC50cyIsInRhbG9uL3J1bnRpbWUvTWV0aG9kQWN0aXZhdGlvbi50cyIsInRhbG9uL3J1bnRpbWUvT3BDb2RlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvU3RhY2tGcmFtZS50cyIsInRhbG9uL3J1bnRpbWUvVGFsb25SdW50aW1lLnRzIiwidGFsb24vcnVudGltZS9UaHJlYWQudHMiLCJ0YWxvbi9ydW50aW1lL2NvbW1vbi9NZW1vcnkudHMiLCJ0YWxvbi9ydW50aW1lL2Vycm9ycy9SdW50aW1lRXJyb3IudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0JyYW5jaFJlbGF0aXZlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvQ29uY2F0ZW5hdGVIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9FeHRlcm5hbENhbGxIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Hb1RvSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvSGFuZGxlQ29tbWFuZEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0luc3RhbmNlQ2FsbEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRGaWVsZEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRJbnN0YW5jZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRMb2NhbEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWROdW1iZXJIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkUHJvcGVydHlIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkU3RyaW5nSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZFRoaXNIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9OZXdJbnN0YW5jZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL05vT3BIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9QYXJzZUNvbW1hbmRIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9QcmludEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1JlYWRJbnB1dEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1JldHVybkhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1N0YXRpY0NhbGxIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L01lYW5pbmcudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUFueS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lQm9vbGVhbi50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lQ29tbWFuZC50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lRW1wdHkudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUludGVnZXIudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUl0ZW0udHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUxpc3QudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVBsYWNlLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVQbGF5ZXIudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVNheS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lU3RyaW5nLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVXb3JsZE9iamVjdC50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9WYXJpYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0EsTUFBYSxVQUFVO0lBQ25CLFlBQW9CLElBQW1CO1FBQW5CLFNBQUksR0FBSixJQUFJLENBQWU7SUFFdkMsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsSUFBSSxD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eEIsT0FBc0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0FDSjtBQTVDRCxnREE0Q0M7Ozs7QUNyREQsTUFBYSxRQUFRO0lBRWpCLFlBQTRCLElBQVcsRUFDWCxJQUFTLEVBQ2xCLEtBQWlCO1FBRlIsU0FBSSxHQUFKLElBQUksQ0FBTztRQUNYLFNBQUksR0FBSixJQUFJLENBQUs7UUFDbEIsVUFBSyxHQUFMLEtBQUssQ0FBWTtJQUNwQyxDQUFDO0NBQ0o7QUFORCw0QkFNQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgSUxvZ091dHB1dCB9IGZyb20gXCIuL3J1bnRpbWUvSUxvZ091dHB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhbmVPdXRwdXQgaW1wbGVtZW50cyBJT3V0cHV0LCBJTG9nT3V0cHV0e1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYW5lOkhUTUxEaXZFbGVtZW50KXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIoKXtcclxuICAgICAgICB0aGlzLnBhbmUuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBkZWJ1ZyhsaW5lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnBhbmUuaW5uZXJIVE1MICs9IGxpbmUgKyBcIjwvYnI+XCI7XHJcbiAgICB9XHJcblxyXG4gICAgd3JpdGUobGluZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wYW5lLmlubmVySFRNTCArPSBsaW5lICsgXCI8L2JyPlwiO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVGFsb25Db21waWxlciB9IGZyb20gXCIuL2NvbXBpbGVyL1RhbG9uQ29tcGlsZXJcIjtcclxuXHJcbmltcG9ydCB7IFBhbmVPdXRwdXQgfSBmcm9tIFwiLi9QYW5lT3V0cHV0XCI7XHJcblxyXG5pbXBvcnQgeyBUYWxvblJ1bnRpbWUgfSBmcm9tIFwiLi9ydW50aW1lL1RhbG9uUnVudGltZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4vY29tbW9uL1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvbklkZXtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29kZVBhbmU6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGdhbWVQYW5lOkhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21waWxhdGlvbk91dHB1dDpIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZ2FtZUxvZ091dHB1dDpIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcGlsZUJ1dHRvbjpIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RhcnROZXdHYW1lQnV0dG9uOkhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSB1c2VyQ29tbWFuZFRleHQ6SFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2VuZFVzZXJDb21tYW5kQnV0dG9uOkhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcGlsYXRpb25PdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJ1bnRpbWVPdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJ1bnRpbWVMb2dPdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21waWxlcjpUYWxvbkNvbXBpbGVyO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBydW50aW1lOlRhbG9uUnVudGltZTtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBjb21waWxlZFR5cGVzOlR5cGVbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldEJ5SWQ8VCBleHRlbmRzIEhUTUxFbGVtZW50PihuYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIDxUPmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb2RlUGFuZSA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTERpdkVsZW1lbnQ+KFwiY29kZS1wYW5lXCIpITtcclxuICAgICAgICB0aGlzLmdhbWVQYW5lID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MRGl2RWxlbWVudD4oXCJnYW1lLXBhbmVcIikhO1xyXG4gICAgICAgIHRoaXMuY29tcGlsYXRpb25PdXRwdXQgPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxEaXZFbGVtZW50PihcImNvbXBpbGF0aW9uLW91dHB1dFwiKSE7XHJcbiAgICAgICAgdGhpcy5nYW1lTG9nT3V0cHV0ID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MRGl2RWxlbWVudD4oXCJsb2ctcGFuZVwiKSE7XHJcbiAgICAgICAgdGhpcy5jb21waWxlQnV0dG9uID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MQnV0dG9uRWxlbWVudD4oXCJjb21waWxlXCIpITtcclxuICAgICAgICB0aGlzLnN0YXJ0TmV3R2FtZUJ1dHRvbiA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwic3RhcnQtbmV3LWdhbWVcIikhO1xyXG4gICAgICAgIHRoaXMudXNlckNvbW1hbmRUZXh0ID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MSW5wdXRFbGVtZW50PihcInVzZXItY29tbWFuZC10ZXh0XCIpITtcclxuICAgICAgICB0aGlzLnNlbmRVc2VyQ29tbWFuZEJ1dHRvbiA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KFwic2VuZC11c2VyLWNvbW1hbmRcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb21waWxlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB0aGlzLmNvbXBpbGUoKSk7XHJcbiAgICAgICAgdGhpcy5zdGFydE5ld0dhbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHRoaXMuc3RhcnROZXdHYW1lKCkpO1xyXG4gICAgICAgIHRoaXMuc2VuZFVzZXJDb21tYW5kQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB0aGlzLnNlbmRVc2VyQ29tbWFuZCgpKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21waWxhdGlvbk91dHB1dFBhbmUgPSBuZXcgUGFuZU91dHB1dCh0aGlzLmNvbXBpbGF0aW9uT3V0cHV0KTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWVPdXRwdXRQYW5lID0gbmV3IFBhbmVPdXRwdXQodGhpcy5nYW1lUGFuZSk7XHJcbiAgICAgICAgdGhpcy5ydW50aW1lTG9nT3V0cHV0UGFuZSA9IG5ldyBQYW5lT3V0cHV0KHRoaXMuZ2FtZUxvZ091dHB1dCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tcGlsZXIgPSBuZXcgVGFsb25Db21waWxlcih0aGlzLmNvbXBpbGF0aW9uT3V0cHV0UGFuZSk7XHJcbiAgICAgICAgdGhpcy5ydW50aW1lID0gbmV3IFRhbG9uUnVudGltZSh0aGlzLnJ1bnRpbWVPdXRwdXRQYW5lLCB0aGlzLnJ1bnRpbWVMb2dPdXRwdXRQYW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbmRVc2VyQ29tbWFuZCgpe1xyXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLnVzZXJDb21tYW5kVGV4dC52YWx1ZTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWUuc2VuZENvbW1hbmQoY29tbWFuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb21waWxlKCl7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IHRoaXMuY29kZVBhbmUuaW5uZXJUZXh0O1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBpbGF0aW9uT3V0cHV0UGFuZS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuY29tcGlsZWRUeXBlcyA9IHRoaXMuY29tcGlsZXIuY29tcGlsZShjb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXJ0TmV3R2FtZSgpe1xyXG4gICAgICAgIHRoaXMucnVudGltZU91dHB1dFBhbmUuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWVMb2dPdXRwdXRQYW5lLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJ1bnRpbWUubG9hZEZyb20odGhpcy5jb21waWxlZFR5cGVzKSl7XHJcbiAgICAgICAgICAgIHRoaXMucnVudGltZS5zdGFydCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIEV2ZW50VHlwZXtcclxuICAgIE5vbmUsXHJcbiAgICBQbGF5ZXJFbnRlcnNQbGFjZSxcclxuICAgIFBsYXllckV4aXRzUGxhY2VcclxufSIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi9UeXBlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpZWxke1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgdHlwZU5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHR5cGU/OlR5cGU7XHJcbiAgICBkZWZhdWx0VmFsdWU/Ok9iamVjdDtcclxufSIsImltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydWN0aW9ue1xyXG4gICAgc3RhdGljIGxvYWROdW1iZXIodmFsdWU6bnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkTnVtYmVyLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRTdHJpbmcodmFsdWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkU3RyaW5nLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRJbnN0YW5jZSh0eXBlTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRJbnN0YW5jZSwgdHlwZU5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkRmllbGQoZmllbGROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZEZpZWxkLCBmaWVsZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkUHJvcGVydHkoZmllbGROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZFByb3BlcnR5LCBmaWVsZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkTG9jYWwobG9jYWxOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZExvY2FsLCBsb2NhbE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkVGhpcygpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRUaGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaW5zdGFuY2VDYWxsKG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5JbnN0YW5jZUNhbGwsIG1ldGhvZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb25jYXRlbmF0ZSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkNvbmNhdGVuYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3RhdGljQ2FsbCh0eXBlTmFtZTpzdHJpbmcsIG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5TdGF0aWNDYWxsLCBgJHt0eXBlTmFtZX0uJHttZXRob2ROYW1lfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBleHRlcm5hbENhbGwobWV0aG9kTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkV4dGVybmFsQ2FsbCwgbWV0aG9kTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHByaW50KCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuUHJpbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZXR1cm4oKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5SZXR1cm4pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZWFkSW5wdXQoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5SZWFkSW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwYXJzZUNvbW1hbmQoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5QYXJzZUNvbW1hbmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBoYW5kbGVDb21tYW5kKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuSGFuZGxlQ29tbWFuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdvVG8obGluZU51bWJlcjpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkdvVG8sIGxpbmVOdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBicmFuY2hSZWxhdGl2ZShjb3VudDpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkJyYW5jaFJlbGF0aXZlLCBjb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGJyYW5jaFJlbGF0aXZlSWZGYWxzZShjb3VudDpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkJyYW5jaFJlbGF0aXZlSWZGYWxzZSwgY291bnQpO1xyXG4gICAgfVxyXG5cclxuICAgIG9wQ29kZTpPcENvZGUgPSBPcENvZGUuTm9PcDtcclxuICAgIHZhbHVlPzpPYmplY3Q7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3BDb2RlOk9wQ29kZSwgdmFsdWU/Ok9iamVjdCl7XHJcbiAgICAgICAgdGhpcy5vcENvZGUgPSBvcENvZGU7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUGFyYW1ldGVyIH0gZnJvbSBcIi4vUGFyYW1ldGVyXCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vcnVudGltZS9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IEV2ZW50VHlwZSB9IGZyb20gXCIuL0V2ZW50VHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1ldGhvZHtcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHBhcmFtZXRlcnM6UGFyYW1ldGVyW10gPSBbXTtcclxuICAgIGFjdHVhbFBhcmFtZXRlcnM6VmFyaWFibGVbXSA9IFtdO1xyXG4gICAgYm9keTpJbnN0cnVjdGlvbltdID0gW107XHJcbiAgICByZXR1cm5UeXBlOnN0cmluZyA9IFwiXCI7XHJcbiAgICBldmVudFR5cGU6RXZlbnRUeXBlID0gRXZlbnRUeXBlLk5vbmU7XHJcbn0iLCJleHBvcnQgZW51bSBPcENvZGV7XHJcbiAgICBOb09wLFxyXG4gICAgUHJpbnQsXHJcbiAgICBMb2FkU3RyaW5nLFxyXG4gICAgTmV3SW5zdGFuY2UsXHJcbiAgICBQYXJzZUNvbW1hbmQsXHJcbiAgICBIYW5kbGVDb21tYW5kLFxyXG4gICAgUmVhZElucHV0LFxyXG4gICAgR29UbyxcclxuICAgIFJldHVybixcclxuICAgIEJyYW5jaFJlbGF0aXZlLFxyXG4gICAgQnJhbmNoUmVsYXRpdmVJZkZhbHNlLFxyXG4gICAgQ29uY2F0ZW5hdGUsXHJcbiAgICBMb2FkTnVtYmVyLFxyXG4gICAgTG9hZEZpZWxkLFxyXG4gICAgTG9hZFByb3BlcnR5LFxyXG4gICAgTG9hZEluc3RhbmNlLFxyXG4gICAgTG9hZExvY2FsLFxyXG4gICAgTG9hZFRoaXMsXHJcbiAgICBJbnN0YW5jZUNhbGwsXHJcbiAgICBTdGF0aWNDYWxsLFxyXG4gICAgRXh0ZXJuYWxDYWxsXHJcbn0iLCJpbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhcmFtZXRlcntcclxuICAgIFxyXG4gICAgdHlwZT86VHlwZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbmFtZTpzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdHlwZU5hbWU6c3RyaW5nKXtcclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuL0ZpZWxkXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBBdHRyaWJ1dGUgfSBmcm9tIFwiLi9BdHRyaWJ1dGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBleyAgICAgIFxyXG4gICAgZmllbGRzOkZpZWxkW10gPSBbXTtcclxuICAgIG1ldGhvZHM6TWV0aG9kW10gPSBbXTsgXHJcbiAgICBhdHRyaWJ1dGVzOkF0dHJpYnV0ZVtdID0gW107XHJcblxyXG4gICAgZ2V0IGlzU3lzdGVtVHlwZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUuc3RhcnRzV2l0aChcIn5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzQW5vbnltb3VzVHlwZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUuc3RhcnRzV2l0aChcIjx+PlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTpzdHJpbmcsIHB1YmxpYyBiYXNlVHlwZU5hbWU6c3RyaW5nKXtcclxuXHJcbiAgICB9ICAgIFxyXG59IiwiZXhwb3J0IGNsYXNzIFZlcnNpb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbWFqb3I6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IG1pbm9yOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBwYXRjaDpudW1iZXIpe1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMubWFqb3J9LiR7dGhpcy5taW5vcn0uJHt0aGlzLnBhdGNofWA7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuLi9jb21tb24vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgRW50cnlQb2ludEF0dHJpYnV0ZSB9IGZyb20gXCIuLi9saWJyYXJ5L0VudHJ5UG9pbnRBdHRyaWJ1dGVcIjtcclxuaW1wb3J0IHsgVGFsb25MZXhlciB9IGZyb20gXCIuL2xleGluZy9UYWxvbkxleGVyXCI7XHJcbmltcG9ydCB7IFRhbG9uUGFyc2VyIH0gZnJvbSBcIi4vcGFyc2luZy9UYWxvblBhcnNlclwiO1xyXG5pbXBvcnQgeyBUYWxvblNlbWFudGljQW5hbHl6ZXIgfSBmcm9tIFwiLi9zZW1hbnRpY3MvVGFsb25TZW1hbnRpY0FuYWx5emVyXCI7XHJcbmltcG9ydCB7IFRhbG9uVHJhbnNmb3JtZXIgfSBmcm9tIFwiLi90cmFuc2Zvcm1pbmcvVGFsb25UcmFuc2Zvcm1lclwiO1xyXG5pbXBvcnQgeyBWZXJzaW9uIH0gZnJvbSBcIi4uL2NvbW1vbi9WZXJzaW9uXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvbkNvbXBpbGVye1xyXG4gICAgZ2V0IGxhbmd1YWdlVmVyc2lvbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVyc2lvbigxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmVyc2lvbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVyc2lvbigxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuICAgIH1cclxuXHJcbiAgICBjb21waWxlKGNvZGU6c3RyaW5nKTpUeXBlW117XHJcbiAgICAgICAgdGhpcy5vdXQud3JpdGUoXCJTdGFydGluZyBjb21waWxhdGlvbi4uLlwiKTtcclxuXHJcbiAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICBjb25zdCBsZXhlciA9IG5ldyBUYWxvbkxleGVyKHRoaXMub3V0KTtcclxuICAgICAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IFRhbG9uUGFyc2VyKHRoaXMub3V0KTtcclxuICAgICAgICAgICAgY29uc3QgYW5hbHl6ZXIgPSBuZXcgVGFsb25TZW1hbnRpY0FuYWx5emVyKHRoaXMub3V0KTtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSBuZXcgVGFsb25UcmFuc2Zvcm1lcih0aGlzLm91dCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0b2tlbnMgPSBsZXhlci50b2tlbml6ZShjb2RlKTtcclxuICAgICAgICAgICAgY29uc3QgYXN0ID0gcGFyc2VyLnBhcnNlKHRva2Vucyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuYWx5emVkQXN0ID0gYW5hbHl6ZXIuYW5hbHl6ZShhc3QpO1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRyYW5zZm9ybWVyLnRyYW5zZm9ybShhbmFseXplZEFzdCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBlbnRyeVBvaW50ID0gdGhpcy5jcmVhdGVFbnRyeVBvaW50KCk7XHJcblxyXG4gICAgICAgICAgICB0eXBlcy5wdXNoKGVudHJ5UG9pbnQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVzO1xyXG4gICAgICAgIH0gY2F0Y2goZXgpe1xyXG4gICAgICAgICAgICBpZiAoZXggaW5zdGFuY2VvZiBDb21waWxhdGlvbkVycm9yKXtcclxuICAgICAgICAgICAgICAgIHRoaXMub3V0LndyaXRlKGBFcnJvcjogJHtleC5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfSBmaW5hbGx5e1xyXG4gICAgICAgICAgICB0aGlzLm91dC53cml0ZShcIkNvbXBpbGF0aW9uIGNvbXBsZXRlLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVFbnRyeVBvaW50KCl7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IG5ldyBUeXBlKFwifmVudHJ5UG9pbnRcIiwgXCJ+ZW1wdHlcIik7XHJcblxyXG4gICAgICAgIHR5cGUuYXR0cmlidXRlcy5wdXNoKG5ldyBFbnRyeVBvaW50QXR0cmlidXRlKCkpO1xyXG5cclxuICAgICAgICBjb25zdCBtYWluID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgIG1haW4ubmFtZSA9IEFueS5tYWluO1xyXG4gICAgICAgIG1haW4uYm9keS5wdXNoKFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGBUYWxvbiBMYW5ndWFnZSB2LiR7dGhpcy5sYW5ndWFnZVZlcnNpb259LCBDb21waWxlciB2LiR7dGhpcy52ZXJzaW9ufWApLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLCAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIlwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uc3RhdGljQ2FsbChcIn5nbG9iYWxTYXlzXCIsIFwifnNheVwiKSwgICAgICAgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiV2hhdCB3b3VsZCB5b3UgbGlrZSB0byBkbz9cIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnJlYWRJbnB1dCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wYXJzZUNvbW1hbmQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uaGFuZGxlQ29tbWFuZCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5nb1RvKDkpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdHlwZS5tZXRob2RzLnB1c2gobWFpbik7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENvbXBpbGF0aW9uRXJyb3J7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG1lc3NhZ2U6c3RyaW5nKXtcclxuXHJcbiAgICB9XHJcbn0iLCJpbnRlcmZhY2UgSW5kZXhhYmxle1xyXG4gICAgW2tleTpzdHJpbmddOmFueTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEtleXdvcmRze1xyXG4gICAgXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYW4gPSBcImFuXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYSA9IFwiYVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRoZSA9IFwidGhlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaXMgPSBcImlzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkga2luZCA9IFwia2luZFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG9mID0gXCJvZlwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBsYWNlID0gXCJwbGFjZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGl0ZW0gPSBcIml0ZW1cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpdCA9IFwiaXRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBoYXMgPSBcImhhc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGlmID0gXCJpZlwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRlc2NyaXB0aW9uID0gXCJkZXNjcmlwdGlvblwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHVuZGVyc3RhbmQgPSBcInVuZGVyc3RhbmRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBhcyA9IFwiYXNcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZXNjcmliaW5nID0gXCJkZXNjcmliaW5nXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGVzY3JpYmVkID0gXCJkZXNjcmliZWRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB3aGVyZSA9IFwid2hlcmVcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwbGF5ZXIgPSBcInBsYXllclwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHN0YXJ0cyA9IFwic3RhcnRzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY29udGFpbnMgPSBcImNvbnRhaW5zXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc2F5ID0gXCJzYXlcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkaXJlY3Rpb25zID0gXCJkaXJlY3Rpb25zXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgbW92aW5nID0gXCJtb3ZpbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0YWtpbmcgPSBcInRha2luZ1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGludmVudG9yeSA9IFwiaW52ZW50b3J5XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY2FuID0gXCJjYW5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSByZWFjaCA9IFwicmVhY2hcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBieSA9IFwiYnlcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBnb2luZyA9IFwiZ29pbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBhbmQgPSBcImFuZFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRoZW4gPSBcInRoZW5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBlbHNlID0gXCJlbHNlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgd2hlbiA9IFwid2hlblwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGVudGVycyA9IFwiZW50ZXJzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZXhpdHMgPSBcImV4aXRzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc3RvcCA9IFwic3RvcFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRyb3BwaW5nID0gXCJkcm9wcGluZ1wiO1xyXG5cclxuICAgIHN0YXRpYyBnZXRBbGwoKTpTZXQ8c3RyaW5nPntcclxuICAgICAgICB0eXBlIEtleXdvcmRQcm9wZXJ0aWVzID0ga2V5b2YgS2V5d29yZHM7XHJcblxyXG4gICAgICAgIGNvbnN0IGFsbEtleXdvcmRzID0gbmV3IFNldDxzdHJpbmc+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoS2V5d29yZHMpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGtleXdvcmQgb2YgbmFtZXMpe1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IChLZXl3b3JkcyBhcyBJbmRleGFibGUpW2tleXdvcmRdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZSAhPSBcIktleXdvcmRzXCIpe1xyXG4gICAgICAgICAgICAgICAgYWxsS2V5d29yZHMuYWRkKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFsbEtleXdvcmRzO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFB1bmN0dWF0aW9ue1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBlcmlvZCA9IFwiLlwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNvbG9uID0gXCI6XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc2VtaWNvbG9uID0gXCI7XCI7XHJcbn0iLCJpbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuL1Rva2VuXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4vS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgUHVuY3R1YXRpb24gfSBmcm9tIFwiLi9QdW5jdHVhdGlvblwiO1xyXG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi8uLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvbkxleGVye1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgYWxsS2V5d29yZHMgPSBLZXl3b3Jkcy5nZXRBbGwoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdG9rZW5pemUoY29kZTpzdHJpbmcpOlRva2VuW117XHJcbiAgICAgICAgbGV0IGN1cnJlbnRMaW5lID0gMTtcclxuICAgICAgICBsZXQgY3VycmVudENvbHVtbiA9IDE7XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuczpUb2tlbltdID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNvZGUubGVuZ3RoOyApe1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IGNvZGUuY2hhckF0KGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q2hhciA9PSBcIiBcIil7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29sdW1uKys7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q2hhciA9PSBcIlxcblwiKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb2x1bW4gPSAxO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUrKztcclxuICAgICAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHRva2VuVmFsdWUgPSB0aGlzLmNvbnN1bWVUb2tlbkNoYXJzQXQoY29kZSwgaW5kZXgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHRva2VuVmFsdWUubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IG5ldyBUb2tlbihjdXJyZW50TGluZSwgY3VycmVudENvbHVtbiwgdG9rZW5WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnRDb2x1bW4gKz0gdG9rZW5WYWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGluZGV4ICs9IHRva2VuVmFsdWUubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NpZnkodG9rZW5zKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsYXNzaWZ5KHRva2VuczpUb2tlbltdKTpUb2tlbltde1xyXG4gICAgICAgIGZvcihsZXQgdG9rZW4gb2YgdG9rZW5zKXtcclxuICAgICAgICAgICAgaWYgKHRva2VuLnZhbHVlID09IFB1bmN0dWF0aW9uLnBlcmlvZCl7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLlRlcm1pbmF0b3I7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4udmFsdWUgPT0gUHVuY3R1YXRpb24uc2VtaWNvbG9uKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuU2VtaVRlcm1pbmF0b3I7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4udmFsdWUgPT0gUHVuY3R1YXRpb24uY29sb24pe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5PcGVuTWV0aG9kQmxvY2s7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVGFsb25MZXhlci5hbGxLZXl3b3Jkcy5oYXModG9rZW4udmFsdWUpKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuS2V5d29yZDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbi52YWx1ZS5zdGFydHNXaXRoKFwiXFxcIlwiKSAmJiB0b2tlbi52YWx1ZS5lbmRzV2l0aChcIlxcXCJcIikpe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5TdHJpbmc7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWlzTmFOKE51bWJlcih0b2tlbi52YWx1ZSkpKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLk51bWJlcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuSWRlbnRpZmllcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRva2VucztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbnN1bWVUb2tlbkNoYXJzQXQoY29kZTpzdHJpbmcsIGluZGV4Om51bWJlcik6c3RyaW5ne1xyXG4gICAgICAgIGNvbnN0IHRva2VuQ2hhcnM6c3RyaW5nW10gPSBbXTtcclxuICAgICAgICBjb25zdCBzdHJpbmdEZWxpbWl0ZXIgPSBcIlxcXCJcIjtcclxuXHJcbiAgICAgICAgbGV0IGlzQ29uc3VtaW5nU3RyaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvcihsZXQgcmVhZEFoZWFkSW5kZXggPSBpbmRleDsgcmVhZEFoZWFkSW5kZXggPCBjb2RlLmxlbmd0aDsgcmVhZEFoZWFkSW5kZXgrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDaGFyID0gY29kZS5jaGFyQXQocmVhZEFoZWFkSW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlzQ29uc3VtaW5nU3RyaW5nICYmIGN1cnJlbnRDaGFyICE9IHN0cmluZ0RlbGltaXRlcil7XHJcbiAgICAgICAgICAgICAgICB0b2tlbkNoYXJzLnB1c2goY3VycmVudENoYXIpO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q2hhciA9PSBzdHJpbmdEZWxpbWl0ZXIpeyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRva2VuQ2hhcnMucHVzaChjdXJyZW50Q2hhcik7ICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGlzQ29uc3VtaW5nU3RyaW5nID0gIWlzQ29uc3VtaW5nU3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc0NvbnN1bWluZ1N0cmluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7ICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDaGFyID09IFwiIFwiIHx8IGN1cnJlbnRDaGFyID09IFwiXFxuXCIgfHwgY3VycmVudENoYXIgPT0gUHVuY3R1YXRpb24ucGVyaW9kIHx8IGN1cnJlbnRDaGFyID09IFB1bmN0dWF0aW9uLmNvbG9uIHx8IGN1cnJlbnRDaGFyID09IFB1bmN0dWF0aW9uLnNlbWljb2xvbil7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW5DaGFycy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5DaGFycy5wdXNoKGN1cnJlbnRDaGFyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0b2tlbkNoYXJzLnB1c2goY3VycmVudENoYXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRva2VuQ2hhcnMuam9pbihcIlwiKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL1Rva2VuVHlwZVwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IEJvb2xlYW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQm9vbGVhblR5cGVcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0l0ZW1cIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUb2tlbntcclxuICAgIHN0YXRpYyBnZXQgZW1wdHkoKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKFwifmVtcHR5XCIsIFRva2VuVHlwZS5Vbmtub3duKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvckFueSgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoQW55LnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JQbGFjZSgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoUGxhY2UudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvckl0ZW0oKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKEl0ZW0udHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvcldvcmxkT2JqZWN0KCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihXb3JsZE9iamVjdC50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yQm9vbGVhbigpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoQm9vbGVhblR5cGUudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvckxpc3QoKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKExpc3QudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRUb2tlbldpdGhUeXBlT2YobmFtZTpzdHJpbmcsIHR5cGU6VG9rZW5UeXBlKXtcclxuICAgICAgICBjb25zdCB0b2tlbiA9IG5ldyBUb2tlbigtMSwtMSxuYW1lKTtcclxuICAgICAgICB0b2tlbi50eXBlID0gdHlwZTtcclxuICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9XHJcblxyXG4gICAgdHlwZTpUb2tlblR5cGUgPSBUb2tlblR5cGUuVW5rbm93bjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbGluZTpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgY29sdW1uOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB2YWx1ZTpzdHJpbmcpe1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gVG9rZW5UeXBle1xyXG4gICAgVW5rbm93bixcclxuICAgIEtleXdvcmQsXHJcbiAgICBUZXJtaW5hdG9yLFxyXG4gICAgU2VtaVRlcm1pbmF0b3IsXHJcbiAgICBTdHJpbmcsXHJcbiAgICBJZGVudGlmaWVyLFxyXG4gICAgTnVtYmVyLFxyXG4gICAgT3Blbk1ldGhvZEJsb2NrXHJcbn0iLCJpbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5cIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uL2xleGluZy9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi8uLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJzZUNvbnRleHR7XHJcbiAgICBpbmRleDpudW1iZXIgPSAwO1xyXG5cclxuICAgIGdldCBpc0RvbmUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleCA+PSB0aGlzLnRva2Vucy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnJlbnRUb2tlbigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmluZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHRva2VuczpUb2tlbltdLCBwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuICAgICAgICB0aGlzLm91dC53cml0ZShgJHt0b2tlbnMubGVuZ3RofSB0b2tlbnMgZGlzY292ZXJlZCwgcGFyc2luZy4uLmApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN1bWVDdXJyZW50VG9rZW4oKXtcclxuICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMuY3VycmVudFRva2VuO1xyXG5cclxuICAgICAgICB0aGlzLmluZGV4Kys7XHJcblxyXG4gICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH1cclxuXHJcbiAgICBpcyh0b2tlblZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRva2VuPy52YWx1ZSA9PSB0b2tlblZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQW55T2YoLi4udG9rZW5WYWx1ZXM6c3RyaW5nW10pe1xyXG4gICAgICAgIGZvcihsZXQgdmFsdWUgb2YgdG9rZW5WYWx1ZXMpe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pcyh2YWx1ZSkpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpc1Rlcm1pbmF0b3IoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VG9rZW4udHlwZSA9PSBUb2tlblR5cGUuVGVybWluYXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RBbnlPZiguLi50b2tlblZhbHVlczpzdHJpbmdbXSl7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzQW55T2YoLi4udG9rZW5WYWx1ZXMpKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJFeHBlY3RlZCB0b2tlbnNcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3QodG9rZW5WYWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi52YWx1ZSAhPSB0b2tlblZhbHVlKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYEV4cGVjdGVkIHRva2VuICcke3Rva2VuVmFsdWV9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdFN0cmluZygpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi50eXBlICE9IFRva2VuVHlwZS5TdHJpbmcpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIHN0cmluZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcblxyXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gc3RyaXAgb2ZmIHRoZSBkb3VibGUgcXVvdGVzIGZyb20gdGhlaXIgc3RyaW5nIGFmdGVyIHdlIGNvbnN1bWUgaXQuXHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG5ldyBUb2tlbih0b2tlbi5saW5lLCB0b2tlbi5jb2x1bW4sIHRva2VuLnZhbHVlLnN1YnN0cmluZygxLCB0b2tlbi52YWx1ZS5sZW5ndGggLSAxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0TnVtYmVyKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRva2VuLnR5cGUgIT0gVG9rZW5UeXBlLk51bWJlcil7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiRXhwZWN0ZWQgbnVtYmVyXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdElkZW50aWZpZXIoKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9rZW4udHlwZSAhPSBUb2tlblR5cGUuSWRlbnRpZmllcil7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiRXhwZWN0ZWQgaWRlbnRpZmllclwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RUZXJtaW5hdG9yKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRva2VuLnR5cGUgIT0gVG9rZW5UeXBlLlRlcm1pbmF0b3Ipe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIGV4cHJlc3Npb24gdGVybWluYXRvclwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RTZW1pVGVybWluYXRvcigpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi50eXBlICE9IFRva2VuVHlwZS5TZW1pVGVybWluYXRvcil7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiRXhwZWN0ZWQgc2VtaSBleHByZXNzaW9uIHRlcm1pbmF0b3JcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0T3Blbk1ldGhvZEJsb2NrKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRva2VuLnR5cGUgIT0gVG9rZW5UeXBlLk9wZW5NZXRob2RCbG9jayl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiRXhwZWN0ZWQgb3BlbiBtZXRob2QgYmxvY2tcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5cIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgUHJvZ3JhbVZpc2l0b3IgfSBmcm9tIFwiLi92aXNpdG9ycy9Qcm9ncmFtVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi8uLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvblBhcnNlcntcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgb3V0OklPdXRwdXQpe1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgcGFyc2UodG9rZW5zOlRva2VuW10pOkV4cHJlc3Npb257XHJcbiAgICAgICAgY29uc3QgY29udGV4dCA9IG5ldyBQYXJzZUNvbnRleHQodG9rZW5zLCB0aGlzLm91dCk7XHJcbiAgICAgICAgY29uc3QgdmlzaXRvciA9IG5ldyBQcm9ncmFtVmlzaXRvcigpO1xyXG5cclxuICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQWN0aW9uc0V4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGFjdGlvbnM6RXhwcmVzc2lvbltdKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCaW5hcnlFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGxlZnQ/OkV4cHJlc3Npb247XHJcbiAgICByaWdodD86RXhwcmVzc2lvbjtcclxufSIsImltcG9ydCB7IEJpbmFyeUV4cHJlc3Npb24gfSBmcm9tIFwiLi9CaW5hcnlFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24gZXh0ZW5kcyBCaW5hcnlFeHByZXNzaW9ue1xyXG4gICAgXHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbnRhaW5zRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdGFyZ2V0TmFtZTpzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgY291bnQ6bnVtYmVyLCBcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB0eXBlTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgRXhwcmVzc2lvbntcclxuICAgIFxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuL1R5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQmluYXJ5RXhwcmVzc2lvbiB9IGZyb20gXCIuL0JpbmFyeUV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBuYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICB0eXBlTmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgaW5pdGlhbFZhbHVlPzpPYmplY3Q7XHJcbiAgICB0eXBlPzpUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uO1xyXG4gICAgYXNzb2NpYXRlZEV4cHJlc3Npb25zOkJpbmFyeUV4cHJlc3Npb25bXSA9IFtdO1xyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJZkV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGNvbmRpdGlvbmFsOkV4cHJlc3Npb24sXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgaWZCbG9jazpFeHByZXNzaW9uLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGVsc2VCbG9jazpFeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9ncmFtRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBleHByZXNzaW9uczpFeHByZXNzaW9uW10pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNheUV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHRleHQ6c3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4vRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuL1doZW5EZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIGJhc2VUeXBlPzpUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uO1xyXG4gICAgZmllbGRzOkZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuICAgIGV2ZW50czpXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZVRva2VuOlRva2VuLCByZWFkb25seSBiYXNlVHlwZU5hbWVUb2tlbjpUb2tlbil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lVG9rZW4udmFsdWU7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB2YWx1ZTpzdHJpbmcsIHB1YmxpYyByZWFkb25seSBtZWFuaW5nOnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgYWN0b3I6c3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGV2ZW50S2luZDpzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgYWN0aW9uczpFeHByZXNzaW9uKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQdW5jdHVhdGlvbiB9IGZyb20gXCIuLi8uLi9sZXhpbmcvUHVuY3R1YXRpb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IEFjdGlvbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0FjdGlvbnNFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRXZlbnRFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIEV4cHJlc3Npb25WaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDpQYXJzZUNvbnRleHQpOkV4cHJlc3Npb257XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgYWN0aW9uczpFeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUoIWNvbnRleHQuaXMoS2V5d29yZHMuYW5kKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbiA9IHN1cGVyLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goYWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0U2VtaVRlcm1pbmF0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmFuZCk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlbik7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuc3RvcCk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQWN0aW9uc0V4cHJlc3Npb24oYWN0aW9ucyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgSWZFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0lmRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi8uLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgQ29udGFpbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0NvbnRhaW5zRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBTYXlFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1NheUV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5pZikpe1xyXG4gICAgICAgICAgICBjb25zdCB2aXNpdG9yID0gbmV3IElmRXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLml0KSl7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLml0KTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuY29udGFpbnMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY291bnQgPSBjb250ZXh0LmV4cGVjdE51bWJlcigpO1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlTmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb250YWluc0V4cHJlc3Npb24oXCJ+aXRcIiwgTnVtYmVyKGNvdW50LnZhbHVlKSwgdHlwZU5hbWUudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5zYXkpKXtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuc2F5KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTYXlFeHByZXNzaW9uKHRleHQudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiVW5hYmxlIHRvIHBhcnNlIGV4cHJlc3Npb25cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IEJvb2xlYW5UeXBlIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvQm9vbGVhblR5cGVcIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi8uLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBBbmRFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0FuZEV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBDb25jYXRlbmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9Db25jYXRlbmF0aW9uRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpZWxkRGVjbGFyYXRpb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG5cclxuICAgICAgICBjb25zdCBmaWVsZCA9IG5ldyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbigpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pdCk7XHJcblxyXG4gICAgICAgIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmlzKSl7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmlzKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmRlc2NyaWJlZCkpe1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuZGVzY3JpYmVkKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmFzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IFdvcmxkT2JqZWN0LmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gZGVzY3JpcHRpb24udmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbnRleHQuaXMoS2V5d29yZHMuYW5kKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYW5kKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHByZXNzaW9uVmlzaXRvciA9IG5ldyBFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVmdEV4cHJlc3Npb24gPSAoZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zLmxlbmd0aCA9PSAwKSA/IGZpZWxkIDogZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zW2ZpZWxkLmFzc29jaWF0ZWRFeHByZXNzaW9ucy5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29uY2F0ID0gbmV3IENvbmNhdGVuYXRpb25FeHByZXNzaW9uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmNhdC5sZWZ0ID0gbGVmdEV4cHJlc3Npb247XHJcbiAgICAgICAgICAgICAgICAgICAgY29uY2F0LnJpZ2h0ID0gZXhwcmVzc2lvbjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zLnB1c2goY29uY2F0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy53aGVyZSkpe1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMud2hlcmUpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnBsYXllcik7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5zdGFydHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBQbGFjZS5pc1BsYXllclN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBCb29sZWFuVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byBkZXRlcm1pbmUgcHJvcGVydHkgZmllbGRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuY29udGFpbnMpKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmNvbnRhaW5zKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gY29udGV4dC5leHBlY3ROdW1iZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgLy8gVE9ETzogU3VwcG9ydCBtdWx0aXBsZSBjb250ZW50IGVudHJpZXMuXHJcblxyXG4gICAgICAgICAgICBmaWVsZC5uYW1lID0gV29ybGRPYmplY3QuY29udGVudHM7XHJcbiAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gTGlzdC50eXBlTmFtZTtcclxuICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gW1tOdW1iZXIoY291bnQudmFsdWUpLCBuYW1lLnZhbHVlXV07IFxyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5jYW4pKXtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmNhbik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnJlYWNoKTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlTmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYnkpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5nb2luZyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgZmllbGQubmFtZSA9IGB+JHtkaXJlY3Rpb24udmFsdWV9YDtcclxuICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBgJHtwbGFjZU5hbWUudmFsdWV9YDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byBkZXRlcm1pbmUgZmllbGRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0VGVybWluYXRvcigpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmllbGQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBJZkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvSWZFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSWZFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pZik7XHJcblxyXG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb25WaXNpdG9yID0gbmV3IEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgY29uc3QgY29uZGl0aW9uYWwgPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlbik7XHJcblxyXG4gICAgICAgIGNvbnN0IGlmQmxvY2sgPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuZWxzZSkpe1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5lbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGVsc2VCbG9jayA9IGV4cHJlc3Npb25WaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBJZkV4cHJlc3Npb24oY29uZGl0aW9uYWwsIGlmQmxvY2ssIGVsc2VCbG9jayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IElmRXhwcmVzc2lvbihjb25kaXRpb25hbCwgaWZCbG9jaywgbmV3IEV4cHJlc3Npb24oKSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL1R5cGVEZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgUHJvZ3JhbUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvUHJvZ3JhbUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi8uLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgU2F5RXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9TYXlFeHByZXNzaW9uVmlzaXRvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb2dyYW1WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGxldCBleHByZXNzaW9uczpFeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUoIWNvbnRleHQuaXNEb25lKXtcclxuICAgICAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMudW5kZXJzdGFuZCkpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uID0gbmV3IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB1bmRlcnN0YW5kaW5nRGVjbGFyYXRpb24udmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzQW55T2YoS2V5d29yZHMuYSwgS2V5d29yZHMuYW4pKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVEZWNsYXJhdGlvbiA9IG5ldyBUeXBlRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gdHlwZURlY2xhcmF0aW9uLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5zYXkpKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNheUV4cHJlc3Npb24gPSBuZXcgU2F5RXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBzYXlFeHByZXNzaW9uLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEF0IHRoZSB0b3AgbGV2ZWwsIGEgc2F5IGV4cHJlc3Npb24gbXVzdCBoYXZlIGEgdGVybWluYXRvci4gV2UncmUgZXZhbHVhdGluZyBpdCBvdXQgaGVyZVxyXG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSBhIHNheSBleHByZXNzaW9uIG5vcm1hbGx5IGRvZXNuJ3QgcmVxdWlyZSBvbmUuXHJcblxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYEZvdW5kIHVuZXhwZWN0ZWQgdG9rZW4gJyR7Y29udGV4dC5jdXJyZW50VG9rZW4udmFsdWV9J2ApO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb2dyYW1FeHByZXNzaW9uKGV4cHJlc3Npb25zKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBTYXlFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1NheUV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTYXlFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5zYXkpO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0ID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBTYXlFeHByZXNzaW9uKHRleHQudmFsdWUpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4uLy4uL2xleGluZy9Ub2tlblwiO1xyXG5pbXBvcnQgeyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1R5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvblZpc2l0b3IgfSBmcm9tIFwiLi9GaWVsZERlY2xhcmF0aW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1doZW5EZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgV2hlbkRlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL1doZW5EZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBlRGVjbGFyYXRpb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0QW55T2YoS2V5d29yZHMuYSwgS2V5d29yZHMuYW4pO1xyXG5cclxuICAgICAgICBjb25zdCBuYW1lID0gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmlzKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5raW5kKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5vZik7XHJcblxyXG4gICAgICAgIGNvbnN0IGJhc2VUeXBlID0gdGhpcy5leHBlY3RCYXNlVHlwZShjb250ZXh0KTtcclxuICAgICAgICBcclxuICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZmllbGRzOkZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGNvbnRleHQuaXMoS2V5d29yZHMuaXQpKXtcclxuICAgICAgICAgICAgY29uc3QgZmllbGRWaXNpdG9yID0gbmV3IEZpZWxkRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gZmllbGRWaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgZmllbGRzLnB1c2goPEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uPmZpZWxkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGV2ZW50czpXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGNvbnRleHQuaXMoS2V5d29yZHMud2hlbikpe1xyXG4gICAgICAgICAgICBjb25zdCB3aGVuVmlzaXRvciA9IG5ldyBXaGVuRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHdoZW4gPSB3aGVuVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIGV2ZW50cy5wdXNoKDxXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uPndoZW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHlwZURlY2xhcmF0aW9uID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24obmFtZSwgYmFzZVR5cGUpO1xyXG5cclxuICAgICAgICB0eXBlRGVjbGFyYXRpb24uZmllbGRzID0gZmllbGRzO1xyXG4gICAgICAgIHR5cGVEZWNsYXJhdGlvbi5ldmVudHMgPSBldmVudHM7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlRGVjbGFyYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBleHBlY3RCYXNlVHlwZShjb250ZXh0OlBhcnNlQ29udGV4dCl7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXNBbnlPZihLZXl3b3Jkcy5wbGFjZSwgS2V5d29yZHMuaXRlbSkpe1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnVuZGVyc3RhbmQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYXMpO1xyXG5cclxuICAgICAgICBjb25zdCBtZWFuaW5nID0gY29udGV4dC5leHBlY3RBbnlPZihLZXl3b3Jkcy5kZXNjcmliaW5nLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy5tb3ZpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2V5d29yZHMuZGlyZWN0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy50YWtpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2V5d29yZHMuaW52ZW50b3J5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEtleXdvcmRzLmRyb3BwaW5nKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbih2YWx1ZS52YWx1ZSwgbWVhbmluZy52YWx1ZSk7ICAgICAgICBcclxuICAgIH1cclxufSIsImltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVmlzaXRvcntcclxuICAgIGFic3RyYWN0IHZpc2l0KGNvbnRleHQ6UGFyc2VDb250ZXh0KTpFeHByZXNzaW9uO1xyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQdW5jdHVhdGlvbiB9IGZyb20gXCIuLi8uLi9sZXhpbmcvUHVuY3R1YXRpb25cIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBFdmVudEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXZlbnRFeHByZXNzaW9uVmlzaXRvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoZW5EZWNsYXJhdGlvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMud2hlbik7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5wbGF5ZXIpO1xyXG5cclxuICAgICAgICBjb25zdCBldmVudEtpbmQgPSBjb250ZXh0LmV4cGVjdEFueU9mKEtleXdvcmRzLmVudGVycywgS2V5d29yZHMuZXhpdHMpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdE9wZW5NZXRob2RCbG9jaygpO1xyXG5cclxuICAgICAgICBjb25zdCBhY3Rpb25zVmlzaXRvciA9IG5ldyBFdmVudEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IGFjdGlvbnNWaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24oS2V5d29yZHMucGxheWVyLCBldmVudEtpbmQudmFsdWUsIGFjdGlvbnMpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFByb2dyYW1FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvUHJvZ3JhbUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1R5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25TZW1hbnRpY0FuYWx5emVye1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYW55ID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yQW55LCBUb2tlbi5lbXB0eSk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHdvcmxkT2JqZWN0ID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yV29ybGRPYmplY3QsIFRva2VuLmZvckFueSk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBsYWNlID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yUGxhY2UsIFRva2VuLmZvcldvcmxkT2JqZWN0KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgaXRlbSA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvckl0ZW0sIFRva2VuLmZvcldvcmxkT2JqZWN0KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYm9vbGVhblR5cGUgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JCb29sZWFuLCBUb2tlbi5mb3JBbnkpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBsaXN0ID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yTGlzdCwgVG9rZW4uZm9yQW55KTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFuYWx5emUoZXhwcmVzc2lvbjpFeHByZXNzaW9uKTpFeHByZXNzaW9ue1xyXG4gICAgICAgIGNvbnN0IHR5cGVzOlR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25bXSA9IFt0aGlzLmFueSwgdGhpcy53b3JsZE9iamVjdCwgdGhpcy5wbGFjZSwgdGhpcy5ib29sZWFuVHlwZSwgdGhpcy5pdGVtXTtcclxuXHJcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBQcm9ncmFtRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2hpbGQgb2YgZXhwcmVzc2lvbi5leHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHlwZXNCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbj4odHlwZXMubWFwKHggPT4gW3gubmFtZSwgeF0pKTtcclxuXHJcbiAgICAgICAgZm9yKGNvbnN0IGRlY2xhcmF0aW9uIG9mIHR5cGVzKXtcclxuICAgICAgICAgICAgY29uc3QgYmFzZVRva2VuID0gZGVjbGFyYXRpb24uYmFzZVR5cGVOYW1lVG9rZW47XHJcblxyXG4gICAgICAgICAgICBpZiAoYmFzZVRva2VuLnR5cGUgPT0gVG9rZW5UeXBlLktleXdvcmQgJiYgIWJhc2VUb2tlbi52YWx1ZS5zdGFydHNXaXRoKFwiflwiKSl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gYH4ke2Jhc2VUb2tlbi52YWx1ZX1gO1xyXG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb24uYmFzZVR5cGUgPSB0eXBlc0J5TmFtZS5nZXQobmFtZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbi5iYXNlVHlwZSA9IHR5cGVzQnlOYW1lLmdldChiYXNlVG9rZW4udmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgZmllbGQgb2YgZGVjbGFyYXRpb24uZmllbGRzKXtcclxuICAgICAgICAgICAgICAgIGZpZWxkLnR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoZmllbGQudHlwZU5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZXhwcmVzc2lvbjtcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIEV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGV7XHJcbiAgICBOb25lLFxyXG4gICAgSWdub3JlUmVzdWx0c09mU2F5RXhwcmVzc2lvblxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBQcm9ncmFtRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1Byb2dyYW1FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9VbmRlcnN0YW5kaW5nXCI7XHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IEJvb2xlYW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQm9vbGVhblR5cGVcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0l0ZW1cIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxheWVyXCI7XHJcbmltcG9ydCB7IFNheUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9TYXlFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IFNheSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1NheVwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuLi8uLi9jb21tb24vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgUGFyYW1ldGVyIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9QYXJhbWV0ZXJcIjtcclxuaW1wb3J0IHsgSWZFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvSWZFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IENvbmNhdGVuYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29udGFpbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29udGFpbnNFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQWN0aW9uc0V4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9BY3Rpb25zRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgRXZlbnRUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9FdmVudFR5cGVcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZSB9IGZyb20gXCIuL0V4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGVcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi8uLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvblRyYW5zZm9ybWVye1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXQ6SU91dHB1dCl7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZVN5c3RlbVR5cGVzKCl7XHJcbiAgICAgICAgY29uc3QgdHlwZXM6VHlwZVtdID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVGhlc2UgYXJlIG9ubHkgaGVyZSBhcyBzdHVicyBmb3IgZXh0ZXJuYWwgcnVudGltZSB0eXBlcyB0aGF0IGFsbG93IHVzIHRvIGNvcnJlY3RseSByZXNvbHZlIGZpZWxkIHR5cGVzLlxyXG5cclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKEFueS50eXBlTmFtZSwgQW55LnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShXb3JsZE9iamVjdC50eXBlTmFtZSwgV29ybGRPYmplY3QucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFBsYWNlLnR5cGVOYW1lLCBQbGFjZS5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoQm9vbGVhblR5cGUudHlwZU5hbWUsIEJvb2xlYW5UeXBlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShTdHJpbmdUeXBlLnR5cGVOYW1lLCBTdHJpbmdUeXBlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShOdW1iZXJUeXBlLnR5cGVOYW1lLCBOdW1iZXJUeXBlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShJdGVtLnR5cGVOYW1lLCBJdGVtLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShMaXN0LnR5cGVOYW1lLCBMaXN0LnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShQbGF5ZXIudHlwZU5hbWUsIFBsYXllci5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoU2F5LnR5cGVOYW1lLCBTYXkucGFyZW50VHlwZU5hbWUpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXA8c3RyaW5nLCBUeXBlPih0eXBlcy5tYXAoeCA9PiBbeC5uYW1lLCB4XSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybShleHByZXNzaW9uOkV4cHJlc3Npb24pOlR5cGVbXXtcclxuICAgICAgICBjb25zdCB0eXBlc0J5TmFtZSA9IHRoaXMuY3JlYXRlU3lzdGVtVHlwZXMoKTtcclxuICAgICAgICBsZXQgZHluYW1pY1R5cGVDb3VudCA9IDA7XHJcblxyXG4gICAgICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgUHJvZ3JhbUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBmb3IoY29uc3QgY2hpbGQgb2YgZXhwcmVzc2lvbi5leHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoYH4ke1VuZGVyc3RhbmRpbmcudHlwZU5hbWV9XyR7ZHluYW1pY1R5cGVDb3VudH1gLCBVbmRlcnN0YW5kaW5nLnR5cGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb24gPSBuZXcgRmllbGQoKTtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24ubmFtZSA9IFVuZGVyc3RhbmRpbmcuYWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5kZWZhdWx0VmFsdWUgPSBjaGlsZC52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVhbmluZyA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lYW5pbmcubmFtZSA9IFVuZGVyc3RhbmRpbmcubWVhbmluZztcclxuICAgICAgICAgICAgICAgICAgICBtZWFuaW5nLmRlZmF1bHRWYWx1ZSA9IGNoaWxkLm1lYW5pbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZS5maWVsZHMucHVzaChhY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUuZmllbGRzLnB1c2gobWVhbmluZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWNUeXBlQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZXNCeU5hbWUuc2V0KHR5cGUubmFtZSwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMudHJhbnNmb3JtSW5pdGlhbFR5cGVEZWNsYXJhdGlvbihjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZXNCeU5hbWUuc2V0KHR5cGUubmFtZSwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgY2hpbGQgb2YgZXhwcmVzc2lvbi5leHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gdHlwZXNCeU5hbWUuZ2V0KGNoaWxkLm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IoY29uc3QgZmllbGRFeHByZXNzaW9uIG9mIGNoaWxkLmZpZWxkcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZEV4cHJlc3Npb24ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBmaWVsZEV4cHJlc3Npb24udHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLnR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoZmllbGRFeHByZXNzaW9uLnR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZC50eXBlTmFtZSA9PSBTdHJpbmdUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IDxzdHJpbmc+ZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZU5hbWUgPT0gTnVtYmVyVHlwZS50eXBlTmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBOdW1iZXIoZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IGZpZWxkRXhwcmVzc2lvbi5pbml0aWFsVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZEV4cHJlc3Npb24uYXNzb2NpYXRlZEV4cHJlc3Npb25zLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2V0RmllbGQgPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5uYW1lID0gYH5nZXRfJHtmaWVsZC5uYW1lfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5wYXJhbWV0ZXJzLnB1c2gobmV3IFBhcmFtZXRlcihcIn52YWx1ZVwiLCBmaWVsZC50eXBlTmFtZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RmllbGQucmV0dXJuVHlwZSA9IGZpZWxkLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IoY29uc3QgYXNzb2NpYXRlZCBvZiBmaWVsZEV4cHJlc3Npb24uYXNzb2NpYXRlZEV4cHJlc3Npb25zKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IoY29uc3QgaW5zdHJ1Y3Rpb24gb2YgdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGFzc29jaWF0ZWQpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RmllbGQuYm9keS5wdXNoKGluc3RydWN0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RmllbGQuYm9keS5wdXNoKEluc3RydWN0aW9uLnJldHVybigpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5tZXRob2RzLnB1c2goZ2V0RmllbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5maWVsZHMucHVzaChmaWVsZCk7ICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXNXb3JsZE9iamVjdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGN1cnJlbnQgPSB0eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gdHlwZXNCeU5hbWUuZ2V0KGN1cnJlbnQuYmFzZVR5cGVOYW1lKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudC5uYW1lID09IFdvcmxkT2JqZWN0LnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1dvcmxkT2JqZWN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNXb3JsZE9iamVjdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NyaWJlID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmliZS5uYW1lID0gV29ybGRPYmplY3QuZGVzY3JpYmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaWJlLmJvZHkucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkUHJvcGVydHkoV29ybGRPYmplY3QuZGVzY3JpcHRpb24pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLnJldHVybigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5tZXRob2RzLnB1c2goZGVzY3JpYmUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGR1cGxpY2F0ZUV2ZW50Q291bnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBldmVudCBvZiBjaGlsZC5ldmVudHMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gbmV3IE1ldGhvZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5uYW1lID0gYH5ldmVudF8ke2V2ZW50LmFjdG9yfV8ke2V2ZW50LmV2ZW50S2luZH1fJHtkdXBsaWNhdGVFdmVudENvdW50fWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QuZXZlbnRUeXBlID0gdGhpcy50cmFuc2Zvcm1FdmVudEtpbmQoZXZlbnQuZXZlbnRLaW5kKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXBsaWNhdGVFdmVudENvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aW9ucyA9IDxBY3Rpb25zRXhwcmVzc2lvbj5ldmVudC5hY3Rpb25zO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihjb25zdCBhY3Rpb24gb2YgYWN0aW9ucy5hY3Rpb25zKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGFjdGlvbiwgRXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZS5JZ25vcmVSZXN1bHRzT2ZTYXlFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QuYm9keS5wdXNoKC4uLmJvZHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5ib2R5LnB1c2goSW5zdHJ1Y3Rpb24ucmV0dXJuKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/Lm1ldGhvZHMucHVzaChtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZ2xvYmFsU2F5cyA9IGV4cHJlc3Npb24uZXhwcmVzc2lvbnMuZmlsdGVyKHggPT4geCBpbnN0YW5jZW9mIFNheUV4cHJlc3Npb24pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHlwZSA9IG5ldyBUeXBlKGB+Z2xvYmFsU2F5c2AsIFNheS50eXBlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtZXRob2QgPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgICAgIG1ldGhvZC5uYW1lID0gU2F5LnR5cGVOYW1lO1xyXG4gICAgICAgICAgICBtZXRob2QucGFyYW1ldGVycyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25zOkluc3RydWN0aW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBzYXkgb2YgZ2xvYmFsU2F5cyl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzYXlFeHByZXNzaW9uID0gPFNheUV4cHJlc3Npb24+c2F5O1xyXG5cclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoc2F5RXhwcmVzc2lvbi50ZXh0KSxcclxuICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5yZXR1cm4oKSk7XHJcblxyXG4gICAgICAgICAgICBtZXRob2QuYm9keSA9IGluc3RydWN0aW9ucztcclxuXHJcbiAgICAgICAgICAgIHR5cGUubWV0aG9kcy5wdXNoKG1ldGhvZCk7XHJcblxyXG4gICAgICAgICAgICB0eXBlc0J5TmFtZS5zZXQodHlwZS5uYW1lLCB0eXBlKTsgIFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiVW5hYmxlIHRvIHBhcnRpYWxseSB0cmFuc2Zvcm1cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm91dC53cml0ZShgQ3JlYXRlZCAke3R5cGVzQnlOYW1lLnNpemV9IHR5cGVzLi4uYCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odHlwZXNCeU5hbWUudmFsdWVzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtRXZlbnRLaW5kKGtpbmQ6c3RyaW5nKXtcclxuICAgICAgICBzd2l0Y2goa2luZCl7XHJcbiAgICAgICAgICAgIGNhc2UgS2V5d29yZHMuZW50ZXJzOntcclxuICAgICAgICAgICAgICAgIHJldHVybiBFdmVudFR5cGUuUGxheWVyRW50ZXJzUGxhY2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBLZXl3b3Jkcy5leGl0czp7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRXZlbnRUeXBlLlBsYXllckV4aXRzUGxhY2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDp7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgVW5hYmxlIHRvIHRyYW5zZm9ybSB1bnN1cHBvcnRlZCBldmVudCBraW5kICcke2tpbmR9J2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uOkV4cHJlc3Npb24sIG1vZGU/OkV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGUpe1xyXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uczpJbnN0cnVjdGlvbltdID0gW107XHJcblxyXG4gICAgICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgSWZFeHByZXNzaW9uKXsgICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgY29uZGl0aW9uYWwgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5jb25kaXRpb25hbCwgbW9kZSk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmNvbmRpdGlvbmFsKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGlmQmxvY2sgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5pZkJsb2NrLCBtb2RlKTtcclxuICAgICAgICAgICAgY29uc3QgZWxzZUJsb2NrID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24uZWxzZUJsb2NrLCBtb2RlKTtcclxuXHJcbiAgICAgICAgICAgIGlmQmxvY2sucHVzaChJbnN0cnVjdGlvbi5icmFuY2hSZWxhdGl2ZShlbHNlQmxvY2subGVuZ3RoKSk7XHJcblxyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5icmFuY2hSZWxhdGl2ZUlmRmFsc2UoaWZCbG9jay5sZW5ndGgpKVxyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5pZkJsb2NrKTtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goLi4uZWxzZUJsb2NrKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBTYXlFeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhleHByZXNzaW9uLnRleHQpKTtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24ucHJpbnQoKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAobW9kZSAhPSBFeHByZXNzaW9uVHJhbnNmb3JtYXRpb25Nb2RlLklnbm9yZVJlc3VsdHNPZlNheUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhleHByZXNzaW9uLnRleHQpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIENvbnRhaW5zRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZE51bWJlcihleHByZXNzaW9uLmNvdW50KSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoZXhwcmVzc2lvbi50eXBlTmFtZSksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkSW5zdGFuY2UoZXhwcmVzc2lvbi50YXJnZXROYW1lKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRGaWVsZChXb3JsZE9iamVjdC5jb250ZW50cyksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5pbnN0YW5jZUNhbGwoTGlzdC5jb250YWlucylcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gVE9ETzogTG9hZCB0aGUgbGVmdC1oYW5kIHNpZGUgc28gaXQgY2FuIGJlIGNvbmNhdGVuYXRlZCB3aGVuIHRoZSByaWdodCBzaWRlIGV2YWx1YXRlcy5cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5sZWZ0ISwgbW9kZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24ucmlnaHQhLCBtb2RlKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmxlZnQpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5yaWdodCk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmNvbmNhdGVuYXRlKCkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkSW5zdGFuY2UoXCJ+aXRcIiksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkRmllbGQoZXhwcmVzc2lvbi5uYW1lKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiVW5hYmxlIHRvIHRyYW5zZm9ybSB1bnN1cHBvcnRlZCBleHByZXNzaW9uXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RydWN0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybUluaXRpYWxUeXBlRGVjbGFyYXRpb24oZXhwcmVzc2lvbjpUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICByZXR1cm4gbmV3IFR5cGUoZXhwcmVzc2lvbi5uYW1lLCBleHByZXNzaW9uLmJhc2VUeXBlIS5uYW1lKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4dGVybkNhbGwgfSBmcm9tIFwiLi9FeHRlcm5DYWxsXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQW55eyAgICAgICAgXHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHN0YXRpYyB0eXBlTmFtZTpzdHJpbmcgPSBcIn5hbnlcIjsgIFxyXG4gICAgXHJcbiAgICBzdGF0aWMgbWFpbiA9IFwifm1haW5cIjtcclxuICAgIHN0YXRpYyBleHRlcm5Ub1N0cmluZyA9IEV4dGVybkNhbGwub2YoXCJ+dG9TdHJpbmdcIik7XHJcbn1cclxuIiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQm9vbGVhblR5cGV7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn5ib29sZWFuXCI7XHJcbn0iLCJleHBvcnQgY2xhc3MgRW50cnlQb2ludEF0dHJpYnV0ZXtcclxuICAgIG5hbWU6c3RyaW5nID0gXCJ+ZW50cnlQb2ludFwiO1xyXG59IiwiZXhwb3J0IGNsYXNzIEV4dGVybkNhbGx7XHJcbiAgICBzdGF0aWMgb2YobmFtZTpzdHJpbmcsIC4uLmFyZ3M6c3RyaW5nW10pe1xyXG4gICAgICAgIHJldHVybiBuZXcgRXh0ZXJuQ2FsbChuYW1lLCAuLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBuYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICBhcmdzOnN0cmluZ1tdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTpzdHJpbmcsIC4uLmFyZ3M6c3RyaW5nW10pe1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcclxuICAgIH1cclxufSIsImltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vV29ybGRPYmplY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJdGVte1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lID0gXCJ+aXRlbVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBhcmVudFR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7XHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMaXN0e1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lID0gXCJ+bGlzdFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSBjb250YWlucyA9IFwifmNvbnRhaW5zXCI7XHJcblxyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lUGFyYW1ldGVyID0gXCJ+dHlwZU5hbWVcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBjb3VudFBhcmFtZXRlciA9IFwifmNvdW50XCI7XHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOdW1iZXJUeXBle1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lID0gXCJ+bnVtYmVyXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbn0iLCJpbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuL1dvcmxkT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxhY2Uge1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn5wbGFjZVwiO1xyXG5cclxuICAgIHN0YXRpYyBpc1BsYXllclN0YXJ0ID0gXCJ+aXNQbGF5ZXJTdGFydFwiO1xyXG59IiwiaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi9Xb3JsZE9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllcntcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifnBsYXllclwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBhcmVudFR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7ICAgIFxyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2F5e1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lID0gXCJ+c2F5XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdHJpbmdUeXBle1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+c3RyaW5nXCI7XHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmRlcnN0YW5kaW5ne1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+dW5kZXJzdGFuZGluZ1wiO1xyXG5cclxuICAgIHN0YXRpYyBkZXNjcmliaW5nID0gXCJ+ZGVzY3JpYmluZ1wiOyAgXHJcbiAgICBzdGF0aWMgbW92aW5nID0gXCJ+bW92aW5nXCI7XHJcbiAgICBzdGF0aWMgZGlyZWN0aW9uID0gXCJ+ZGlyZWN0aW9uXCI7XHJcbiAgICBzdGF0aWMgdGFraW5nID0gXCJ+dGFraW5nXCI7XHJcbiAgICBzdGF0aWMgaW52ZW50b3J5ID0gXCJ+aW52ZW50b3J5XCI7XHJcbiAgICBzdGF0aWMgZHJvcHBpbmcgPSBcIn5kcm9wcGluZ1wiO1xyXG5cclxuICAgIHN0YXRpYyBhY3Rpb24gPSBcIn5hY3Rpb25cIjtcclxuICAgIHN0YXRpYyBtZWFuaW5nID0gXCJ+bWVhbmluZ1wiOyAgXHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZE9iamVjdCB7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn53b3JsZE9iamVjdFwiO1xyXG5cclxuICAgIHN0YXRpYyBkZXNjcmlwdGlvbiA9IFwifmRlc2NyaXB0aW9uXCI7XHJcbiAgICBzdGF0aWMgY29udGVudHMgPSBcIn5jb250ZW50c1wiOyAgICBcclxuXHJcbiAgICBzdGF0aWMgZGVzY3JpYmUgPSBcIn5kZXNjcmliZVwiO1xyXG59IiwiaW1wb3J0IHsgVGFsb25JZGUgfSBmcm9tIFwiLi9UYWxvbklkZVwiO1xyXG5cclxuXHJcbnZhciBpZGUgPSBuZXcgVGFsb25JZGUoKTsiLCJleHBvcnQgZW51bSBFdmFsdWF0aW9uUmVzdWx0e1xyXG4gICAgQ29udGludWUsXHJcbiAgICBTdXNwZW5kRm9ySW5wdXRcclxufSIsImltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBTdGFja0ZyYW1lIH0gZnJvbSBcIi4vU3RhY2tGcmFtZVwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuLi9jb21tb24vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1ldGhvZEFjdGl2YXRpb257XHJcbiAgICBtZXRob2Q/Ok1ldGhvZDtcclxuICAgIHN0YWNrRnJhbWU6U3RhY2tGcmFtZTtcclxuICAgIHN0YWNrOlJ1bnRpbWVBbnlbXSA9IFtdO1xyXG5cclxuICAgIHN0YWNrU2l6ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YWNrLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBwb3AoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdGFjay5wb3AoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdXNoKHJ1bnRpbWVBbnk6UnVudGltZUFueSl7XHJcbiAgICAgICAgdGhpcy5zdGFjay5wdXNoKHJ1bnRpbWVBbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1ldGhvZDpNZXRob2Qpe1xyXG4gICAgICAgIHRoaXMubWV0aG9kID0gbWV0aG9kO1xyXG4gICAgICAgIHRoaXMuc3RhY2tGcmFtZSA9IG5ldyBTdGFja0ZyYW1lKG1ldGhvZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBPcENvZGVIYW5kbGVye1xyXG4gICAgY29kZTpPcENvZGUgPSBPcENvZGUuTm9PcDtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuQ29udGludWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuL2xpYnJhcnkvVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9NZXRob2RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdGFja0ZyYW1le1xyXG4gICAgbG9jYWxzOlZhcmlhYmxlW10gPSBbXTtcclxuICAgIGN1cnJlbnRJbnN0cnVjdGlvbjpudW1iZXIgPSAtMTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXRob2Q6TWV0aG9kKXtcclxuICAgICAgICBmb3IodmFyIHBhcmFtZXRlciBvZiBtZXRob2QucGFyYW1ldGVycyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlID0gbmV3IFZhcmlhYmxlKHBhcmFtZXRlci5uYW1lLCBwYXJhbWV0ZXIudHlwZSEpO1xyXG4gICAgICAgICAgICB0aGlzLmxvY2Fscy5wdXNoKHZhcmlhYmxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBFbnRyeVBvaW50QXR0cmlidXRlIH0gZnJvbSBcIi4uL2xpYnJhcnkvRW50cnlQb2ludEF0dHJpYnV0ZVwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgTWV0aG9kQWN0aXZhdGlvbiB9IGZyb20gXCIuL01ldGhvZEFjdGl2YXRpb25cIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUHJpbnRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvUHJpbnRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IE5vT3BIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTm9PcEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZFN0cmluZ0hhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkU3RyaW5nSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBOZXdJbnN0YW5jZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9OZXdJbnN0YW5jZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZUNvbW1hbmQgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVDb21tYW5kXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgUmVhZElucHV0SGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1JlYWRJbnB1dEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUGFyc2VDb21tYW5kSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1BhcnNlQ29tbWFuZEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgR29Ub0hhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Hb1RvSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBIYW5kbGVDb21tYW5kSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0hhbmRsZUNvbW1hbmRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYWNlIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lUGxhY2VcIjtcclxuaW1wb3J0IHsgUnVudGltZUJvb2xlYW4gfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVCb29sZWFuXCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuLi9saWJyYXJ5L1BsYXllclwiO1xyXG5pbXBvcnQgeyBTYXkgfSBmcm9tIFwiLi4vbGlicmFyeS9TYXlcIjtcclxuaW1wb3J0IHsgUnVudGltZUVtcHR5IH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lRW1wdHlcIjtcclxuaW1wb3J0IHsgUmV0dXJuSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1JldHVybkhhbmRsZXJcIjtcclxuaW1wb3J0IHsgU3RhdGljQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9TdGF0aWNDYWxsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGF5ZXIgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgTG9hZEluc3RhbmNlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRJbnN0YW5jZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZE51bWJlckhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkTnVtYmVySGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJbnN0YW5jZUNhbGxIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvSW5zdGFuY2VDYWxsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkUHJvcGVydHlIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZFByb3BlcnR5SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkRmllbGRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZEZpZWxkSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBFeHRlcm5hbENhbGxIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvRXh0ZXJuYWxDYWxsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkTG9jYWxIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZExvY2FsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJTG9nT3V0cHV0IH0gZnJvbSBcIi4vSUxvZ091dHB1dFwiO1xyXG5pbXBvcnQgeyBMb2FkVGhpc0hhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkVGhpc0hhbmRsZXJcIjtcclxuaW1wb3J0IHsgQnJhbmNoUmVsYXRpdmVIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvQnJhbmNoUmVsYXRpdmVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEJyYW5jaFJlbGF0aXZlSWZGYWxzZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9CcmFuY2hSZWxhdGl2ZUlmRmFsc2VIYW5kbGVyXCI7XHJcbmltcG9ydCB7IENvbmNhdGVuYXRlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0NvbmNhdGVuYXRlSGFuZGxlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uUnVudGltZXtcclxuXHJcbiAgICBwcml2YXRlIHRocmVhZD86VGhyZWFkO1xyXG4gICAgcHJpdmF0ZSBoYW5kbGVyczpNYXA8T3BDb2RlLCBPcENvZGVIYW5kbGVyPiA9IG5ldyBNYXA8T3BDb2RlLCBPcENvZGVIYW5kbGVyPigpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdXNlck91dHB1dDpJT3V0cHV0LCBwcml2YXRlIHJlYWRvbmx5IGxvZ091dHB1dD86SUxvZ091dHB1dCl7XHJcbiAgICAgICAgdGhpcy51c2VyT3V0cHV0ID0gdXNlck91dHB1dDtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLk5vT3AsIG5ldyBOb09wSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTG9hZFN0cmluZywgbmV3IExvYWRTdHJpbmdIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5QcmludCwgbmV3IFByaW50SGFuZGxlcih0aGlzLnVzZXJPdXRwdXQpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTmV3SW5zdGFuY2UsIG5ldyBOZXdJbnN0YW5jZUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLlJlYWRJbnB1dCwgbmV3IFJlYWRJbnB1dEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLlBhcnNlQ29tbWFuZCwgbmV3IFBhcnNlQ29tbWFuZEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkhhbmRsZUNvbW1hbmQsIG5ldyBIYW5kbGVDb21tYW5kSGFuZGxlcih0aGlzLnVzZXJPdXRwdXQpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuR29UbywgbmV3IEdvVG9IYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5SZXR1cm4sIG5ldyBSZXR1cm5IYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5TdGF0aWNDYWxsLCBuZXcgU3RhdGljQ2FsbEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRJbnN0YW5jZSwgbmV3IExvYWRJbnN0YW5jZUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWROdW1iZXIsIG5ldyBMb2FkTnVtYmVySGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuSW5zdGFuY2VDYWxsLCBuZXcgSW5zdGFuY2VDYWxsSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTG9hZFByb3BlcnR5LCBuZXcgTG9hZFByb3BlcnR5SGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTG9hZEZpZWxkLCBuZXcgTG9hZEZpZWxkSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuRXh0ZXJuYWxDYWxsLCBuZXcgRXh0ZXJuYWxDYWxsSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTG9hZExvY2FsLCBuZXcgTG9hZExvY2FsSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTG9hZFRoaXMsIG5ldyBMb2FkVGhpc0hhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkJyYW5jaFJlbGF0aXZlLCBuZXcgQnJhbmNoUmVsYXRpdmVIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5CcmFuY2hSZWxhdGl2ZUlmRmFsc2UsIG5ldyBCcmFuY2hSZWxhdGl2ZUlmRmFsc2VIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Db25jYXRlbmF0ZSwgbmV3IENvbmNhdGVuYXRlSGFuZGxlcigpKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydCgpe1xyXG4gICAgICAgIGlmICh0aGlzLnRocmVhZD8uYWxsVHlwZXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICB0aGlzLnRocmVhZC5sb2c/LmRlYnVnKFwiVW5hYmxlIHRvIHN0YXJ0IHJ1bnRpbWUgd2l0aG91dCB0eXBlcy5cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBsYWNlcyA9IHRoaXMudGhyZWFkPy5hbGxUeXBlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHggPT4geC5iYXNlVHlwZU5hbWUgPT0gUGxhY2UudHlwZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoeCA9PiA8UnVudGltZVBsYXllcj5NZW1vcnkuYWxsb2NhdGUoeCkpO1xyXG5cclxuICAgICAgICBjb25zdCBnZXRQbGF5ZXJTdGFydCA9IChwbGFjZTpSdW50aW1lUGxhY2UpID0+IDxSdW50aW1lQm9vbGVhbj4ocGxhY2UuZmllbGRzLmdldChQbGFjZS5pc1BsYXllclN0YXJ0KT8udmFsdWUpO1xyXG4gICAgICAgIGNvbnN0IGlzUGxheWVyU3RhcnQgPSAocGxhY2U6UnVudGltZVBsYWNlKSA9PiBnZXRQbGF5ZXJTdGFydChwbGFjZSk/LnZhbHVlID09PSB0cnVlO1xyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50UGxhY2UgPSBwbGFjZXM/LmZpbmQoaXNQbGF5ZXJTdGFydCk7XHJcblxyXG4gICAgICAgIHRoaXMudGhyZWFkIS5jdXJyZW50UGxhY2UgPSBjdXJyZW50UGxhY2U7XHJcblxyXG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMudGhyZWFkPy5rbm93blR5cGVzLmdldChQbGF5ZXIudHlwZU5hbWUpITtcclxuXHJcbiAgICAgICAgdGhpcy50aHJlYWQhLmN1cnJlbnRQbGF5ZXIgPSA8UnVudGltZVBsYXllcj5NZW1vcnkuYWxsb2NhdGUocGxheWVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5ydW5XaXRoKFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZyb20odHlwZXM6VHlwZVtdKXtcclxuICAgICAgICBpZiAodHlwZXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICB0aGlzLmxvZ091dHB1dD8uZGVidWcoXCJObyB0eXBlcyB3ZXJlIHByb3ZpZGVkLCB1bmFibGUgdG8gbG9hZCBydW50aW1lIVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbG9hZGVkVHlwZXMgPSBNZW1vcnkubG9hZFR5cGVzKHR5cGVzKTtcclxuXHJcbiAgICAgICAgY29uc3QgZW50cnlQb2ludCA9IGxvYWRlZFR5cGVzLmZpbmQoeCA9PiB4LmF0dHJpYnV0ZXMuZmluZEluZGV4KGF0dHJpYnV0ZSA9PiBhdHRyaWJ1dGUgaW5zdGFuY2VvZiBFbnRyeVBvaW50QXR0cmlidXRlKSA+IC0xKTtcclxuICAgICAgICBjb25zdCBtYWluTWV0aG9kID0gZW50cnlQb2ludD8ubWV0aG9kcy5maW5kKHggPT4geC5uYW1lID09IEFueS5tYWluKTsgICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRpb24gPSBuZXcgTWV0aG9kQWN0aXZhdGlvbihtYWluTWV0aG9kISk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50aHJlYWQgPSBuZXcgVGhyZWFkKGxvYWRlZFR5cGVzLCBhY3RpdmF0aW9uKTsgIFxyXG4gICAgICAgIHRoaXMudGhyZWFkLmxvZyA9IHRoaXMubG9nT3V0cHV0OyAgICAgIFxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZW5kQ29tbWFuZChpbnB1dDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMucnVuV2l0aChpbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBydW5XaXRoKGNvbW1hbmQ6c3RyaW5nKXtcclxuICAgICAgICBcclxuICAgICAgICAvLyBXZSdyZSBnb2luZyB0byBrZWVwIHRoZWlyIGNvbW1hbmQgaW4gdGhlIHZpc3VhbCBoaXN0b3J5IHRvIG1ha2UgdGhpbmdzIGVhc2llciB0byB1bmRlcnN0YW5kLlxyXG5cclxuICAgICAgICB0aGlzLnVzZXJPdXRwdXQud3JpdGUoY29tbWFuZCk7XHJcblxyXG4gICAgICAgIC8vIE5vdyB3ZSBjYW4gZ28gYWhlYWQgYW5kIHByb2Nlc3MgdGhlaXIgY29tbWFuZC5cclxuXHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSB0aGlzLnRocmVhZCEuY3VycmVudEluc3RydWN0aW9uO1xyXG5cclxuICAgICAgICBpZiAoaW5zdHJ1Y3Rpb24/Lm9wQ29kZSA9PSBPcENvZGUuUmVhZElucHV0KXtcclxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhjb21tYW5kKTtcclxuICAgICAgICAgICAgdGhpcy50aHJlYWQ/LmN1cnJlbnRNZXRob2QucHVzaCh0ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGhyZWFkPy5tb3ZlTmV4dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMudGhyZWFkPy5jdXJyZW50SW5zdHJ1Y3Rpb24gPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhpcy50aHJlYWQ/Lm1vdmVOZXh0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50aHJlYWQ/LmN1cnJlbnRJbnN0cnVjdGlvbiA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGV4ZWN1dGUgY29tbWFuZCwgbm8gaW5zdHJ1Y3Rpb24gZm91bmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaW5zdHJ1Y3Rpb24gPSB0aGlzLmV2YWx1YXRlQ3VycmVudEluc3RydWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbiA9PSBFdmFsdWF0aW9uUmVzdWx0LkNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24gPSB0aGlzLmV2YWx1YXRlQ3VycmVudEluc3RydWN0aW9uKCkpe1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudGhyZWFkPy5tb3ZlTmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaChleCl7XHJcbiAgICAgICAgICAgIGlmIChleCBpbnN0YW5jZW9mIFJ1bnRpbWVFcnJvcil7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ091dHB1dD8uZGVidWcoYFJ1bnRpbWUgRXJyb3I6ICR7ZXgubWVzc2FnZX1gKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV2YWx1YXRlQ3VycmVudEluc3RydWN0aW9uKCl7XHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSB0aGlzLnRocmVhZD8uY3VycmVudEluc3RydWN0aW9uO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5oYW5kbGVycy5nZXQoaW5zdHJ1Y3Rpb24/Lm9wQ29kZSEpO1xyXG5cclxuICAgICAgICBpZiAoaGFuZGxlciA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBFbmNvdW50ZXJlZCB1bnN1cHBvcnRlZCBPcENvZGUgJyR7aW5zdHJ1Y3Rpb24/Lm9wQ29kZX0nYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBoYW5kbGVyPy5oYW5kbGUodGhpcy50aHJlYWQhKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi9NZXRob2RBY3RpdmF0aW9uXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1VuZGVyc3RhbmRpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYWNlIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lUGxhY2VcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYXllciB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZVBsYXllclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRW1wdHkgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVFbXB0eVwiO1xyXG5pbXBvcnQgeyBJTG9nT3V0cHV0IH0gZnJvbSBcIi4vSUxvZ091dHB1dFwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRocmVhZHtcclxuICAgIGFsbFR5cGVzOlR5cGVbXSA9IFtdO1xyXG4gICAga25vd25UeXBlczpNYXA8c3RyaW5nLCBUeXBlPiA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlPigpO1xyXG4gICAga25vd25VbmRlcnN0YW5kaW5nczpUeXBlW10gPSBbXTtcclxuICAgIGtub3duUGxhY2VzOlJ1bnRpbWVQbGFjZVtdID0gW107XHJcbiAgICBtZXRob2RzOk1ldGhvZEFjdGl2YXRpb25bXSA9IFtdO1xyXG4gICAgY3VycmVudFBsYWNlPzpSdW50aW1lUGxhY2U7XHJcbiAgICBjdXJyZW50UGxheWVyPzpSdW50aW1lUGxheWVyO1xyXG4gICAgbG9nPzpJTG9nT3V0cHV0O1xyXG4gICAgXHJcbiAgICBnZXQgY3VycmVudE1ldGhvZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tZXRob2RzW3RoaXMubWV0aG9kcy5sZW5ndGggLSAxXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudEluc3RydWN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRpb24gPSB0aGlzLmN1cnJlbnRNZXRob2Q7XHJcbiAgICAgICAgcmV0dXJuIGFjdGl2YXRpb24ubWV0aG9kPy5ib2R5W2FjdGl2YXRpb24uc3RhY2tGcmFtZS5jdXJyZW50SW5zdHJ1Y3Rpb25dO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHR5cGVzOlR5cGVbXSwgbWV0aG9kOk1ldGhvZEFjdGl2YXRpb24pe1xyXG4gICAgICAgIHRoaXMuYWxsVHlwZXMgPSB0eXBlcztcclxuICAgICAgICB0aGlzLmtub3duVHlwZXMgPSBuZXcgTWFwPHN0cmluZywgVHlwZT4odHlwZXMubWFwKHR5cGUgPT4gW3R5cGUubmFtZSwgdHlwZV0pKTtcclxuICAgICAgICB0aGlzLmtub3duVW5kZXJzdGFuZGluZ3MgPSB0eXBlcy5maWx0ZXIoeCA9PiB4LmJhc2VUeXBlTmFtZSA9PT0gVW5kZXJzdGFuZGluZy50eXBlTmFtZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tZXRob2RzLnB1c2gobWV0aG9kKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3RpdmF0ZU1ldGhvZChtZXRob2Q6TWV0aG9kKXtcclxuICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gbmV3IE1ldGhvZEFjdGl2YXRpb24obWV0aG9kKTtcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5jdXJyZW50TWV0aG9kO1xyXG5cclxuICAgICAgICB0aGlzLmxvZz8uZGVidWcoYCR7Y3VycmVudC5tZXRob2Q/Lm5hbWV9ID0+ICR7bWV0aG9kLm5hbWV9YCk7XHJcblxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5wdXNoKGFjdGl2YXRpb24pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBtb3ZlTmV4dCgpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudE1ldGhvZC5zdGFja0ZyYW1lLmN1cnJlbnRJbnN0cnVjdGlvbisrO1xyXG4gICAgfVxyXG5cclxuICAgIGp1bXBUb0xpbmUobGluZU51bWJlcjpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudE1ldGhvZC5zdGFja0ZyYW1lLmN1cnJlbnRJbnN0cnVjdGlvbiA9IGxpbmVOdW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuRnJvbUN1cnJlbnRNZXRob2QoKXtcclxuICAgICAgICBjb25zdCBleHBlY3RSZXR1cm5UeXBlID0gdGhpcy5jdXJyZW50TWV0aG9kLm1ldGhvZCEucmV0dXJuVHlwZSAhPSBcIlwiO1xyXG4gICAgICAgIGNvbnN0IHJldHVybmVkTWV0aG9kID0gdGhpcy5tZXRob2RzLnBvcCgpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZz8uZGVidWcoYCR7dGhpcy5jdXJyZW50TWV0aG9kLm1ldGhvZD8ubmFtZX0gPD0gJHtyZXR1cm5lZE1ldGhvZD8ubWV0aG9kPy5uYW1lfWApO1xyXG5cclxuICAgICAgICBpZiAoIWV4cGVjdFJldHVyblR5cGUpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVFbXB0eSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSByZXR1cm5lZE1ldGhvZD8uc3RhY2sucG9wKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlITtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxhY2UgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lUGxhY2VcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuLi8uLi9jb21tb24vRmllbGRcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVtcHR5IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUVtcHR5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVDb21tYW5kIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUNvbW1hbmRcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQm9vbGVhbiB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVCb29sZWFuXCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVMaXN0IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUxpc3RcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0l0ZW1cIjtcclxuaW1wb3J0IHsgUnVudGltZUl0ZW0gfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSXRlbVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYXllciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgU2F5IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU2F5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTYXkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU2F5XCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZW1vcnl7XHJcbiAgICBwcml2YXRlIHN0YXRpYyB0eXBlc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlPigpO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGVhcCA9IG5ldyBNYXA8c3RyaW5nLCBSdW50aW1lQW55W10+KCk7XHJcblxyXG4gICAgc3RhdGljIGZpbmRJbnN0YW5jZUJ5TmFtZShuYW1lOnN0cmluZyl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2VzID0gTWVtb3J5LmhlYXAuZ2V0KG5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoIWluc3RhbmNlcyB8fCBpbnN0YW5jZXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiT2JqZWN0IG5vdCBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZXMubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJMb2NhdGVkIG1vcmUgdGhhbiBvbmUgaW5zdGFuY2VcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2VzWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkVHlwZXModHlwZXM6VHlwZVtdKXtcclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgVHlwZT4odHlwZXMubWFwKHggPT4gW3gubmFtZSwgeF0pKTsgICBcclxuICAgICAgICBcclxuICAgICAgICAvLyBPdmVycmlkZSBhbnkgcHJvdmlkZWQgdHlwZSBzdHVicyB3aXRoIHRoZSBhY3R1YWwgcnVudGltZSB0eXBlIGRlZmluaXRpb25zLlxyXG5cclxuICAgICAgICBjb25zdCBwbGFjZSA9IFJ1bnRpbWVQbGFjZS50eXBlO1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBSdW50aW1lSXRlbS50eXBlO1xyXG4gICAgICAgIGNvbnN0IHBsYXllciA9IFJ1bnRpbWVQbGF5ZXIudHlwZTtcclxuXHJcbiAgICAgICAgTWVtb3J5LnR5cGVzQnlOYW1lLnNldChwbGFjZS5uYW1lLCBwbGFjZSk7XHJcbiAgICAgICAgTWVtb3J5LnR5cGVzQnlOYW1lLnNldChpdGVtLm5hbWUsIGl0ZW0pO1xyXG4gICAgICAgIE1lbW9yeS50eXBlc0J5TmFtZS5zZXQocGxheWVyLm5hbWUsIHBsYXllcik7ICBcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShNZW1vcnkudHlwZXNCeU5hbWUudmFsdWVzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZUNvbW1hbmQoKTpSdW50aW1lQ29tbWFuZHtcclxuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVDb21tYW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG9jYXRlQm9vbGVhbih2YWx1ZTpib29sZWFuKTpSdW50aW1lQm9vbGVhbntcclxuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVCb29sZWFuKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGVOdW1iZXIodmFsdWU6bnVtYmVyKTpSdW50aW1lSW50ZWdlcntcclxuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVJbnRlZ2VyKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGVTdHJpbmcodGV4dDpzdHJpbmcpOlJ1bnRpbWVTdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lU3RyaW5nKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZSh0eXBlOlR5cGUpOlJ1bnRpbWVBbnl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBNZW1vcnkuY29uc3RydWN0SW5zdGFuY2VGcm9tKHR5cGUpO1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZVBvb2wgPSBNZW1vcnkuaGVhcC5nZXQodHlwZS5uYW1lKSB8fCBbXTtcclxuXHJcbiAgICAgICAgaW5zdGFuY2VQb29sLnB1c2goaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICBNZW1vcnkuaGVhcC5zZXQodHlwZS5uYW1lLCBpbnN0YW5jZVBvb2wpO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5pdGlhbGl6ZVZhcmlhYmxlV2l0aChmaWVsZDpGaWVsZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhcmlhYmxlID0gTWVtb3J5LmNvbnN0cnVjdFZhcmlhYmxlRnJvbShmaWVsZCk7ICAgICAgICBcclxuICAgICAgICB2YXJpYWJsZS52YWx1ZSA9IE1lbW9yeS5pbnN0YW50aWF0ZURlZmF1bHRWYWx1ZUZvcih2YXJpYWJsZSwgZmllbGQuZGVmYXVsdFZhbHVlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZhcmlhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNvbnN0cnVjdFZhcmlhYmxlRnJvbShmaWVsZDpGaWVsZCl7XHJcbiAgICAgICAgaWYgKGZpZWxkLnR5cGUpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhcmlhYmxlKGZpZWxkLm5hbWUsIGZpZWxkLnR5cGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHlwZSA9IE1lbW9yeS50eXBlc0J5TmFtZS5nZXQoZmllbGQudHlwZU5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoIXR5cGUpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBVbmFibGUgdG8gY29uc3RydWN0IHVua25vd24gdHlwZSAnJHtmaWVsZC50eXBlTmFtZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFZhcmlhYmxlKGZpZWxkLm5hbWUsIHR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbnRpYXRlRGVmYXVsdFZhbHVlRm9yKHZhcmlhYmxlOlZhcmlhYmxlLCBkZWZhdWx0VmFsdWU6T2JqZWN0fHVuZGVmaW5lZCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3dpdGNoKHZhcmlhYmxlLnR5cGUhLm5hbWUpe1xyXG4gICAgICAgICAgICBjYXNlIFN0cmluZ1R5cGUudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVN0cmluZyhkZWZhdWx0VmFsdWUgPyA8c3RyaW5nPmRlZmF1bHRWYWx1ZSA6IFwiXCIpO1xyXG4gICAgICAgICAgICBjYXNlIEJvb2xlYW5UeXBlLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVCb29sZWFuKGRlZmF1bHRWYWx1ZSA/IDxib29sZWFuPmRlZmF1bHRWYWx1ZSA6IGZhbHNlKTtcclxuICAgICAgICAgICAgY2FzZSBMaXN0LnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVMaXN0KGRlZmF1bHRWYWx1ZSA/IHRoaXMuaW5zdGFudGlhdGVMaXN0KDxPYmplY3RbXT5kZWZhdWx0VmFsdWUpIDogW10pO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lRW1wdHkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFudGlhdGVMaXN0KGl0ZW1zOk9iamVjdFtdKXtcclxuICAgICAgICBjb25zdCBydW50aW1lSXRlbXM6UnVudGltZUFueVtdID0gW107XHJcblxyXG4gICAgICAgIGZvcihjb25zdCBpdGVtIG9mIGl0ZW1zKXtcclxuICAgICAgICAgICAgY29uc3QgaXRlbUxpc3QgPSA8T2JqZWN0W10+aXRlbTtcclxuICAgICAgICAgICAgY29uc3QgY291bnQgPSA8bnVtYmVyPml0ZW1MaXN0WzBdO1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlTmFtZSA9IDxzdHJpbmc+aXRlbUxpc3RbMV07XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gTWVtb3J5LnR5cGVzQnlOYW1lLmdldCh0eXBlTmFtZSkhO1xyXG5cclxuICAgICAgICAgICAgZm9yKGxldCBjdXJyZW50ID0gMDsgY3VycmVudCA8IGNvdW50OyBjdXJyZW50KyspeyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gTWVtb3J5LmFsbG9jYXRlKHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgcnVudGltZUl0ZW1zLnB1c2goaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcnVudGltZUl0ZW1zO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNvbnN0cnVjdEluc3RhbmNlRnJvbSh0eXBlOlR5cGUpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzZWVuVHlwZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcclxuICAgICAgICBsZXQgaW5oZXJpdGFuY2VDaGFpbjpUeXBlW10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBjdXJyZW50OlR5cGV8dW5kZWZpbmVkID0gdHlwZTsgXHJcbiAgICAgICAgICAgIGN1cnJlbnQ7IFxyXG4gICAgICAgICAgICBjdXJyZW50ID0gTWVtb3J5LnR5cGVzQnlOYW1lLmdldChjdXJyZW50LmJhc2VUeXBlTmFtZSkpe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VlblR5cGVzLmhhcyhjdXJyZW50Lm5hbWUpKXtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiWW91IGNhbid0IGhhdmUgY3ljbGVzIGluIGEgdHlwZSBoaWVyYXJjaHlcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2VlblR5cGVzLmFkZChjdXJyZW50Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaW5oZXJpdGFuY2VDaGFpbi5wdXNoKGN1cnJlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleCA9IGluaGVyaXRhbmNlQ2hhaW4uZmluZEluZGV4KHggPT4geC5pc1N5c3RlbVR5cGUpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKGZpcnN0U3lzdGVtVHlwZUFuY2VzdG9ySW5kZXggPCAwKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlR5cGUgbXVzdCB1bHRpbWF0ZWx5IGluaGVyaXQgZnJvbSBhIHN5c3RlbSB0eXBlXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmFsbG9jYXRlU3lzdGVtVHlwZUJ5TmFtZShpbmhlcml0YW5jZUNoYWluW2ZpcnN0U3lzdGVtVHlwZUFuY2VzdG9ySW5kZXhdLm5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGluc3RhbmNlLnBhcmVudFR5cGVOYW1lID0gaW5zdGFuY2UudHlwZU5hbWU7XHJcbiAgICAgICAgaW5zdGFuY2UudHlwZU5hbWUgPSBpbmhlcml0YW5jZUNoYWluWzBdLm5hbWU7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IEluaGVyaXQgbW9yZSB0aGFuIGp1c3QgZmllbGRzL21ldGhvZHMuXHJcbiAgICAgICAgLy8gVE9ETzogVHlwZSBjaGVjayBmaWVsZCBpbmhlcml0YW5jZSBmb3Igc2hhZG93aW5nL292ZXJyaWRpbmcuXHJcblxyXG4gICAgICAgIC8vIEluaGVyaXQgZmllbGRzL21ldGhvZHMgZnJvbSB0eXBlcyBpbiB0aGUgaGllcmFyY2h5IGZyb20gbGVhc3QgdG8gbW9zdCBkZXJpdmVkLlxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaSA9IGZpcnN0U3lzdGVtVHlwZUFuY2VzdG9ySW5kZXg7IGkgPj0gMDsgaS0tKXtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFR5cGUgPSBpbmhlcml0YW5jZUNoYWluW2ldO1xyXG5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IGZpZWxkIG9mIGN1cnJlbnRUeXBlLmZpZWxkcyl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YXJpYWJsZSA9IHRoaXMuaW5pdGlhbGl6ZVZhcmlhYmxlV2l0aChmaWVsZCk7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5maWVsZHMuc2V0KGZpZWxkLm5hbWUsIHZhcmlhYmxlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IG1ldGhvZCBvZiBjdXJyZW50VHlwZS5tZXRob2RzKXtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLm1ldGhvZHMuc2V0KG1ldGhvZC5uYW1lLCBtZXRob2QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhbGxvY2F0ZVN5c3RlbVR5cGVCeU5hbWUodHlwZU5hbWU6c3RyaW5nKXtcclxuICAgICAgICBzd2l0Y2godHlwZU5hbWUpe1xyXG4gICAgICAgICAgICBjYXNlIFBsYWNlLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVQbGFjZSgpO1xyXG4gICAgICAgICAgICBjYXNlIEl0ZW0udHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZUl0ZW0oKTtcclxuICAgICAgICAgICAgY2FzZSBQbGF5ZXIudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVBsYXllcigpO1xyXG4gICAgICAgICAgICBjYXNlIExpc3QudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZUxpc3QoW10pOyAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgU2F5LnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVTYXkoKTsgICAgICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6e1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGluc3RhbnRpYXRlIHR5cGUgJyR7dHlwZU5hbWV9J2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFJ1bnRpbWVFcnJvcntcclxuICAgIG1lc3NhZ2U6c3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCcmFuY2hSZWxhdGl2ZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aXZlQW1vdW50ID0gPG51bWJlcj50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYGJyLnJlbCAke3JlbGF0aXZlQW1vdW50fWApO1xyXG5cclxuICAgICAgICB0aHJlYWQuanVtcFRvTGluZSh0aHJlYWQuY3VycmVudE1ldGhvZC5zdGFja0ZyYW1lLmN1cnJlbnRJbnN0cnVjdGlvbiArIHJlbGF0aXZlQW1vdW50KTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQm9vbGVhbiB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVCb29sZWFuXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpdmVBbW91bnQgPSA8bnVtYmVyPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gPFJ1bnRpbWVCb29sZWFuPnRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgYnIucmVsLmZhbHNlICR7cmVsYXRpdmVBbW91bnR9YClcclxuXHJcbiAgICAgICAgaWYgKCF2YWx1ZS52YWx1ZSl7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRocmVhZC5qdW1wVG9MaW5lKHRocmVhZC5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uICsgcmVsYXRpdmVBbW91bnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmNhdGVuYXRlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgbGFzdCA9IDxSdW50aW1lU3RyaW5nPnRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IGZpcnN0ID0gPFJ1bnRpbWVTdHJpbmc+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAuY29uY2F0ICcke2ZpcnN0LnZhbHVlfScgJyR7bGFzdC52YWx1ZX0nYCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmNhdGVuYXRlZCA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhmaXJzdC52YWx1ZSArIFwiIFwiICsgbGFzdC52YWx1ZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goY29uY2F0ZW5hdGVkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuXHJcbmludGVyZmFjZSBJSW5kZXhhYmxle1xyXG4gICAgW25hbWU6c3RyaW5nXTooLi4uYXJnczpSdW50aW1lQW55W10pPT5SdW50aW1lQW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRXh0ZXJuYWxDYWxsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IDxzdHJpbmc+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMubG9jYXRlRnVuY3Rpb24oaW5zdGFuY2UhLCA8c3RyaW5nPm1ldGhvZE5hbWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmNhbGwuZXh0ZXJuXFx0JHtpbnN0YW5jZT8udHlwZU5hbWV9Ojoke21ldGhvZE5hbWV9KC4uLiR7bWV0aG9kLmxlbmd0aH0pYCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGFyZ3M6UnVudGltZUFueVtdID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBtZXRob2QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBhcmdzLnB1c2godGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCkhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG1ldGhvZC5jYWxsKGluc3RhbmNlLCAuLi5hcmdzKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChyZXN1bHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb2NhdGVGdW5jdGlvbihpbnN0YW5jZTpPYmplY3QsIG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gKDxJSW5kZXhhYmxlPmluc3RhbmNlKVttZXRob2ROYW1lXTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHb1RvSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uTnVtYmVyID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgaW5zdHJ1Y3Rpb25OdW1iZXIgPT09IFwibnVtYmVyXCIpe1xyXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIGp1bXAgb25lIHByZXZpb3VzIHRvIHRoZSBkZXNpcmVkIGluc3RydWN0aW9uIGJlY2F1c2UgYWZ0ZXIgXHJcbiAgICAgICAgICAgIC8vIGV2YWx1YXRpbmcgdGhpcyBnb3RvIHdlJ2xsIG1vdmUgZm9yd2FyZCAod2hpY2ggd2lsbCBtb3ZlIHRvIHRoZSBkZXNpcmVkIG9uZSkuXHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAuYnIgJHtpbnN0cnVjdGlvbk51bWJlcn1gKVxyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmp1bXBUb0xpbmUoaW5zdHJ1Y3Rpb25OdW1iZXIgLSAxKTtcclxuICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gZ290b1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVDb21tYW5kIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUNvbW1hbmRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZyB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1VuZGVyc3RhbmRpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZVVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lVW5kZXJzdGFuZGluZ1wiO1xyXG5pbXBvcnQgeyBNZWFuaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvTWVhbmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgUnVudGltZUxpc3QgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lTGlzdFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxhY2UgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lUGxhY2VcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYXllciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgTG9hZFByb3BlcnR5SGFuZGxlciB9IGZyb20gXCIuL0xvYWRQcm9wZXJ0eUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUHJpbnRIYW5kbGVyIH0gZnJvbSBcIi4vUHJpbnRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9JbnN0YW5jZUNhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEV2ZW50VHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vRXZlbnRUeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSGFuZGxlQ29tbWFuZEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXRwdXQ6SU91dHB1dCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAoIShjb21tYW5kIGluc3RhbmNlb2YgUnVudGltZUNvbW1hbmQpKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGhhbmRsZSBhIG5vbi1jb21tYW5kLCBmb3VuZCAnJHtjb21tYW5kfWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0gY29tbWFuZC5hY3Rpb24hLnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHRhcmdldE5hbWUgPSBjb21tYW5kLnRhcmdldE5hbWUhLnZhbHVlO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmhhbmRsZS5jbWQgJyR7YWN0aW9ufSAke3RhcmdldE5hbWV9J2ApO1xyXG5cclxuICAgICAgICBjb25zdCB1bmRlcnN0YW5kaW5nc0J5QWN0aW9uID0gbmV3IE1hcDxPYmplY3QsIFR5cGU+KHRocmVhZC5rbm93blVuZGVyc3RhbmRpbmdzLm1hcCh4ID0+IFt4LmZpZWxkcy5maW5kKGZpZWxkID0+IGZpZWxkLm5hbWUgPT0gVW5kZXJzdGFuZGluZy5hY3Rpb24pPy5kZWZhdWx0VmFsdWUhLCB4XSkpO1xyXG5cclxuICAgICAgICBjb25zdCB1bmRlcnN0YW5kaW5nID0gdW5kZXJzdGFuZGluZ3NCeUFjdGlvbi5nZXQoYWN0aW9uKTtcclxuXHJcbiAgICAgICAgaWYgKCF1bmRlcnN0YW5kaW5nKXtcclxuICAgICAgICAgICAgdGhpcy5vdXRwdXQud3JpdGUoXCJJIGRvbid0IGtub3cgaG93IHRvIGRvIHRoYXQuXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtZWFuaW5nRmllbGQgPSB1bmRlcnN0YW5kaW5nLmZpZWxkcy5maW5kKHggPT4geC5uYW1lID09IFVuZGVyc3RhbmRpbmcubWVhbmluZyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1lYW5pbmcgPSB0aGlzLmRldGVybWluZU1lYW5pbmdGb3IoPHN0cmluZz5tZWFuaW5nRmllbGQ/LmRlZmF1bHRWYWx1ZSEpO1xyXG4gICAgICAgIGNvbnN0IGFjdHVhbFRhcmdldE5hbWUgPSB0aGlzLmluZmVyVGFyZ2V0RnJvbSh0aHJlYWQsIHRhcmdldE5hbWUsIG1lYW5pbmcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghYWN0dWFsVGFyZ2V0TmFtZSl7XHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0LndyaXRlKFwiSSBkb24ndCBrbm93IHdoYXQgeW91J3JlIHJlZmVycmluZyB0by5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRocmVhZC5rbm93blR5cGVzLmdldChhY3R1YWxUYXJnZXROYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKCF0YXJnZXQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGxvY2F0ZSB0eXBlXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmxvY2F0ZVRhcmdldEluc3RhbmNlKHRocmVhZCwgdGFyZ2V0LCBtZWFuaW5nKTtcclxuXHJcbiAgICAgICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBSdW50aW1lV29ybGRPYmplY3QpKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBsb2NhdGUgd29ybGQgdHlwZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXRjaChtZWFuaW5nKXtcclxuICAgICAgICAgICAgY2FzZSBNZWFuaW5nLkRlc2NyaWJpbmc6e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZSh0aHJlYWQsIGluc3RhbmNlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuTW92aW5nOiB7ICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dFBsYWNlID0gPFJ1bnRpbWVQbGFjZT5pbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmFpc2VFdmVudCh0aHJlYWQsIEV2ZW50VHlwZS5QbGF5ZXJFeGl0c1BsYWNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aHJlYWQuY3VycmVudFBsYWNlID0gbmV4dFBsYWNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaWJlKHRocmVhZCwgaW5zdGFuY2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmFpc2VFdmVudCh0aHJlYWQsIEV2ZW50VHlwZS5QbGF5ZXJFbnRlcnNQbGFjZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuVGFraW5nOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gdGhyZWFkLmN1cnJlbnRQbGFjZSEuZ2V0Q29udGVudHNGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgbGlzdC5pdGVtcyA9IGxpc3QuaXRlbXMuZmlsdGVyKHggPT4geC50eXBlTmFtZSAhPSB0YXJnZXQubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGludmVudG9yeSA9IHRocmVhZC5jdXJyZW50UGxheWVyIS5nZXRDb250ZW50c0ZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICBpbnZlbnRvcnkuaXRlbXMucHVzaChpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZSh0aHJlYWQsIHRocmVhZC5jdXJyZW50UGxhY2UhLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuSW52ZW50b3J5OntcclxuICAgICAgICAgICAgICAgIGNvbnN0IGludmVudG9yeSA9ICg8UnVudGltZVBsYXllcj5pbnN0YW5jZSkuZ2V0Q29udGVudHNGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZUNvbnRlbnRzKHRocmVhZCwgaW52ZW50b3J5KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTWVhbmluZy5Ecm9wcGluZzp7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gdGhyZWFkLmN1cnJlbnRQbGF5ZXIhLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgICAgIGxpc3QuaXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUgIT0gdGFyZ2V0Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50cyA9IHRocmVhZC5jdXJyZW50UGxhY2UhLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRzLml0ZW1zLnB1c2goaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpYmUodGhyZWFkLCB0aHJlYWQuY3VycmVudFBsYWNlISwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbnN1cHBvcnRlZCBtZWFuaW5nIGZvdW5kXCIpO1xyXG4gICAgICAgIH0gIFxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByYWlzZUV2ZW50KHRocmVhZDpUaHJlYWQsIHR5cGU6RXZlbnRUeXBlKXtcclxuICAgICAgICBjb25zdCBldmVudHMgPSBBcnJheS5mcm9tKHRocmVhZC5jdXJyZW50UGxhY2U/Lm1ldGhvZHMudmFsdWVzKCkhKS5maWx0ZXIoeCA9PiB4LmV2ZW50VHlwZSA9PSB0eXBlKTtcclxuXHJcbiAgICAgICAgZm9yKGNvbnN0IGV2ZW50IG9mIGV2ZW50cyl7XHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godGhyZWFkLmN1cnJlbnRQbGFjZSEpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZXZlbnRDYWxsID0gbmV3IEluc3RhbmNlQ2FsbEhhbmRsZXIoZXZlbnQubmFtZSk7XHJcbiAgICAgICAgICAgIGV2ZW50Q2FsbC5oYW5kbGUodGhyZWFkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb2NhdGVUYXJnZXRJbnN0YW5jZSh0aHJlYWQ6VGhyZWFkLCB0YXJnZXQ6VHlwZSwgbWVhbmluZzpNZWFuaW5nKTpSdW50aW1lQW55fHVuZGVmaW5lZHtcclxuICAgICAgICBpZiAobWVhbmluZyA9PT0gTWVhbmluZy5UYWtpbmcpe1xyXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gPFJ1bnRpbWVMaXN0PnRocmVhZC5jdXJyZW50UGxhY2UhLmZpZWxkcy5nZXQoV29ybGRPYmplY3QuY29udGVudHMpPy52YWx1ZTtcclxuICAgICAgICAgICAgY29uc3QgbWF0Y2hpbmdJdGVtcyA9IGxpc3QuaXRlbXMuZmlsdGVyKHggPT4geC50eXBlTmFtZSA9PT0gdGFyZ2V0Lm5hbWUpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKG1hdGNoaW5nSXRlbXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoaW5nSXRlbXNbMF07XHJcbiAgICAgICAgfSBlbHNlIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLkRyb3BwaW5nKXtcclxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IDxSdW50aW1lTGlzdD50aHJlYWQuY3VycmVudFBsYXllciEuZmllbGRzLmdldChXb3JsZE9iamVjdC5jb250ZW50cyk/LnZhbHVlOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBtYXRjaGluZ0l0ZW1zID0gbGlzdC5pdGVtcy5maWx0ZXIoeCA9PiB4LnR5cGVOYW1lID09PSB0YXJnZXQubmFtZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAobWF0Y2hpbmdJdGVtcy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hpbmdJdGVtc1swXTtcclxuICAgICAgICB9IGVsc2UgeyAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBNZW1vcnkuZmluZEluc3RhbmNlQnlOYW1lKHRhcmdldC5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbmZlclRhcmdldEZyb20odGhyZWFkOlRocmVhZCwgdGFyZ2V0TmFtZTpzdHJpbmcsIG1lYW5pbmc6TWVhbmluZyl7XHJcbiAgICAgICAgaWYgKG1lYW5pbmcgPT09IE1lYW5pbmcuTW92aW5nKXtcclxuICAgICAgICAgICAgY29uc3QgcGxhY2VOYW1lID0gPFJ1bnRpbWVTdHJpbmc+dGhyZWFkLmN1cnJlbnRQbGFjZT8uZmllbGRzLmdldChgfiR7dGFyZ2V0TmFtZX1gKT8udmFsdWU7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXBsYWNlTmFtZSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcGxhY2VOYW1lLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1lYW5pbmcgPT09IE1lYW5pbmcuSW52ZW50b3J5KXtcclxuICAgICAgICAgICAgcmV0dXJuIFBsYXllci50eXBlTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0YXJnZXROYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVzY3JpYmUodGhyZWFkOlRocmVhZCwgdGFyZ2V0OlJ1bnRpbWVXb3JsZE9iamVjdCwgaXNTaGFsbG93RGVzY3JpcHRpb246Ym9vbGVhbil7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaCh0YXJnZXQpO1xyXG5cclxuICAgICAgICBjb25zdCBkZXNjcmliZVR5cGUgPSBuZXcgSW5zdGFuY2VDYWxsSGFuZGxlcihXb3JsZE9iamVjdC5kZXNjcmliZSk7XHJcbiAgICAgICAgZGVzY3JpYmVUeXBlLmhhbmRsZSh0aHJlYWQpO1xyXG5cclxuICAgICAgICAvLyBjb25zdCBkZXNjcmlwdGlvbiA9IHRhcmdldC5maWVsZHMuZ2V0KFdvcmxkT2JqZWN0LmRlc2NyaXB0aW9uKT8udmFsdWU7XHJcbiAgICAgICAgLy8gY29uc3QgY29udGVudHMgPSB0YXJnZXQuZmllbGRzLmdldChXb3JsZE9iamVjdC5jb250ZW50cyk/LnZhbHVlO1xyXG5cclxuICAgICAgICAvLyBpZiAoIShkZXNjcmlwdGlvbiBpbnN0YW5jZW9mIFJ1bnRpbWVTdHJpbmcpKXtcclxuICAgICAgICAvLyAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBkZXNjcmliZSB3aXRob3V0IGEgc3RyaW5nXCIpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgLy8gdGhpcy5vdXRwdXQud3JpdGUoZGVzY3JpcHRpb24udmFsdWUpO1xyXG5cclxuICAgICAgICAvLyBpZiAoaXNTaGFsbG93RGVzY3JpcHRpb24gfHwgY29udGVudHMgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgLy8gICAgIHJldHVybjtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIC8vIGlmICghKGNvbnRlbnRzIGluc3RhbmNlb2YgUnVudGltZUxpc3QpKXtcclxuICAgICAgICAvLyAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBkZXNjcmliZSBjb250ZW50cyB3aXRob3V0IGEgbGlzdFwiKTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIC8vIHRoaXMuZGVzY3JpYmVDb250ZW50cyhjb250ZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXNjcmliZUNvbnRlbnRzKGV4ZWN1dGlvblBvaW50OlRocmVhZCwgdGFyZ2V0OlJ1bnRpbWVMaXN0KXtcclxuICAgICAgICBmb3IoY29uc3QgaXRlbSBvZiB0YXJnZXQuaXRlbXMpe1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaWJlKGV4ZWN1dGlvblBvaW50LCA8UnVudGltZVdvcmxkT2JqZWN0Pml0ZW0sIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRldGVybWluZU1lYW5pbmdGb3IoYWN0aW9uOnN0cmluZyk6TWVhbmluZ3tcclxuICAgICAgICBjb25zdCBzeXN0ZW1BY3Rpb24gPSBgfiR7YWN0aW9ufWA7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IFN1cHBvcnQgY3VzdG9tIGFjdGlvbnMgYmV0dGVyLlxyXG5cclxuICAgICAgICBzd2l0Y2goc3lzdGVtQWN0aW9uKXtcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLmRlc2NyaWJpbmc6IHJldHVybiBNZWFuaW5nLkRlc2NyaWJpbmc7XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy5tb3Zpbmc6IHJldHVybiBNZWFuaW5nLk1vdmluZztcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLmRpcmVjdGlvbjogcmV0dXJuIE1lYW5pbmcuRGlyZWN0aW9uO1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcudGFraW5nOiByZXR1cm4gTWVhbmluZy5UYWtpbmc7XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy5pbnZlbnRvcnk6IHJldHVybiBNZWFuaW5nLkludmVudG9yeTtcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLmRyb3BwaW5nOiByZXR1cm4gTWVhbmluZy5Ecm9wcGluZztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBNZWFuaW5nLkN1c3RvbTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lSW50ZWdlciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJbnRlZ2VyXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4uL2xpYnJhcnkvVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgTWV0aG9kQWN0aXZhdGlvbiB9IGZyb20gXCIuLi9NZXRob2RBY3RpdmF0aW9uXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnN0YW5jZUNhbGxIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbWV0aG9kTmFtZT86c3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHRocmVhZC5jdXJyZW50TWV0aG9kO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMubWV0aG9kTmFtZSl7XHJcbiAgICAgICAgICAgIHRoaXMubWV0aG9kTmFtZSA9IDxzdHJpbmc+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjdXJyZW50LnBvcCgpO1xyXG5cclxuICAgICAgICBjb25zdCBtZXRob2QgPSBpbnN0YW5jZT8ubWV0aG9kcy5nZXQodGhpcy5tZXRob2ROYW1lKSE7XHJcblxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAuY2FsbC5pbnN0XFx0JHtpbnN0YW5jZT8udHlwZU5hbWV9Ojoke3RoaXMubWV0aG9kTmFtZX0oLi4uJHttZXRob2QucGFyYW1ldGVycy5sZW5ndGh9KWApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHBhcmFtZXRlclZhbHVlczpWYXJpYWJsZVtdID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBtZXRob2QhLnBhcmFtZXRlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBjb25zdCBwYXJhbWV0ZXIgPSBtZXRob2QhLnBhcmFtZXRlcnNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gY3VycmVudC5wb3AoKSE7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlID0gbmV3IFZhcmlhYmxlKHBhcmFtZXRlci5uYW1lLCBwYXJhbWV0ZXIudHlwZSEsIGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgICAgIHBhcmFtZXRlclZhbHVlcy5wdXNoKHZhcmlhYmxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gSEFDSzogV2Ugc2hvdWxkbid0IGNyZWF0ZSBvdXIgb3duIHR5cGUsIHdlIHNob3VsZCBpbmhlcmVudGx5IGtub3cgd2hhdCBpdCBpcy5cclxuXHJcbiAgICAgICAgcGFyYW1ldGVyVmFsdWVzLnVuc2hpZnQobmV3IFZhcmlhYmxlKFwifnRoaXNcIiwgbmV3IFR5cGUoaW5zdGFuY2U/LnR5cGVOYW1lISwgaW5zdGFuY2U/LnBhcmVudFR5cGVOYW1lISksIGluc3RhbmNlKSk7XHJcblxyXG4gICAgICAgIG1ldGhvZC5hY3R1YWxQYXJhbWV0ZXJzID0gcGFyYW1ldGVyVmFsdWVzO1xyXG5cclxuICAgICAgICB0aHJlYWQuYWN0aXZhdGVNZXRob2QobWV0aG9kKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkRmllbGRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IGZpZWxkTmFtZSA9IDxzdHJpbmc+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICBjb25zdCBmaWVsZCA9IGluc3RhbmNlPy5maWVsZHMuZ2V0KGZpZWxkTmFtZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZmllbGQ/LnZhbHVlO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmxkLmZpZWxkXFx0XFx0JHtpbnN0YW5jZT8udHlwZU5hbWV9Ojoke2ZpZWxkTmFtZX0gLy8gJHt2YWx1ZX1gKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaCh2YWx1ZSEpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRJbnN0YW5jZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCB0eXBlTmFtZSA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVOYW1lID09PSBcIn5pdFwiKXtcclxuICAgICAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRocmVhZC5jdXJyZW50UGxhY2UhO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHN1YmplY3QpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoXCIubGQuY3Vyci5wbGFjZVwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBVbmFibGUgdG8gbG9hZCBpbnN0YW5jZSBmb3IgdW5zdXBwb3J0ZWQgdHlwZSAnJHt0eXBlTmFtZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRMb2NhbEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBsb2NhbE5hbWUgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmFtZXRlciA9IHRocmVhZC5jdXJyZW50TWV0aG9kLm1ldGhvZD8uYWN0dWFsUGFyYW1ldGVycy5maW5kKHggPT4geC5uYW1lID09IGxvY2FsTmFtZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2gocGFyYW1ldGVyPy52YWx1ZSEpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmxkLnBhcmFtXFx0XFx0JHtsb2NhbE5hbWV9PSR7cGFyYW1ldGVyPy52YWx1ZX1gKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkTnVtYmVySGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gPG51bWJlcj50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcbiAgICAgICAgY29uc3QgcnVudGltZVZhbHVlID0gTWVtb3J5LmFsbG9jYXRlTnVtYmVyKHZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChydW50aW1lVmFsdWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmxkLmNvbnN0Lm51bVxcdCR7dmFsdWV9YCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZFByb3BlcnR5SGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZpZWxkTmFtZT86c3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpZWxkTmFtZSl7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGROYW1lID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBmaWVsZCA9IGluc3RhbmNlPy5maWVsZHMuZ2V0KHRoaXMuZmllbGROYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBmaWVsZD8udmFsdWUhO1xyXG5cclxuICAgICAgICBjb25zdCBnZXRGaWVsZCA9IGluc3RhbmNlPy5tZXRob2RzLmdldChgfmdldF8ke3RoaXMuZmllbGROYW1lfWApO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmxkLnByb3BcXHRcXHQke2luc3RhbmNlPy50eXBlTmFtZX06OiR7dGhpcy5maWVsZE5hbWV9IHtnZXQ9JHtnZXRGaWVsZCAhPSB1bmRlZmluZWR9fSAvLyAke3ZhbHVlfWApO1xyXG5cclxuICAgICAgICBpZiAoZ2V0RmllbGQpe1xyXG4gICAgICAgICAgICBnZXRGaWVsZC5hY3R1YWxQYXJhbWV0ZXJzLnB1c2gobmV3IFZhcmlhYmxlKFwifnZhbHVlXCIsIGZpZWxkPy50eXBlISwgdmFsdWUpKTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5hY3RpdmF0ZU1ldGhvZChnZXRGaWVsZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRTdHJpbmdIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24hLnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKXtcclxuICAgICAgICAgICAgY29uc3Qgc3RyaW5nVmFsdWUgPSBuZXcgUnVudGltZVN0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goc3RyaW5nVmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYC5sZC5jb25zdC5zdHJcXHRcIiR7dmFsdWV9XCJgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiRXhwZWN0ZWQgYSBzdHJpbmdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIlxyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZFRoaXNIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLm1ldGhvZD8uYWN0dWFsUGFyYW1ldGVyc1swXS52YWx1ZSE7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmxkLnRoaXNgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOZXdJbnN0YW5jZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHR5cGVOYW1lID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdHlwZU5hbWUgPT09IFwic3RyaW5nXCIpe1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gdGhyZWFkLmtub3duVHlwZXMuZ2V0KHR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlID09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBsb2NhdGUgdHlwZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBNZW1vcnkuYWxsb2NhdGUodHlwZSk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKGluc3RhbmNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5vT3BIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICByZXR1cm4gRXZhbHVhdGlvblJlc3VsdC5Db250aW51ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVDb21tYW5kIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUNvbW1hbmRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJzZUNvbW1hbmRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgLmhhbmRsZS5jbWQucGFyc2VgKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB0ZXh0ID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0IGluc3RhbmNlb2YgUnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRUZXh0ID0gdGV4dC52YWx1ZTtcclxuICAgICAgICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMucGFyc2VDb21tYW5kKGNvbW1hbmRUZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goY29tbWFuZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBwYXJzZSBjb21tYW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VDb21tYW5kKHRleHQ6c3RyaW5nKTpSdW50aW1lQ29tbWFuZHtcclxuICAgICAgICBjb25zdCBwaWVjZXMgPSB0ZXh0LnNwbGl0KFwiIFwiKTtcclxuICAgICAgICBjb25zdCBjb21tYW5kID0gTWVtb3J5LmFsbG9jYXRlQ29tbWFuZCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbW1hbmQuYWN0aW9uID0gTWVtb3J5LmFsbG9jYXRlU3RyaW5nKHBpZWNlc1swXSk7XHJcbiAgICAgICAgY29tbWFuZC50YXJnZXROYW1lID0gTWVtb3J5LmFsbG9jYXRlU3RyaW5nKHBpZWNlc1sxXSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb21tYW5kO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcbmltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByaW50SGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwcml2YXRlIG91dHB1dDpJT3V0cHV0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG91dHB1dDpJT3V0cHV0KXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMub3V0cHV0ID0gb3V0cHV0O1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0IGluc3RhbmNlb2YgUnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0LndyaXRlKHRleHQudmFsdWUpO1xyXG4gICAgICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhcIi5wcmludFwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIHByaW50LCBlbmNvdW50ZXJlZCBhIHR5cGUgb24gdGhlIHN0YWNrIG90aGVyIHRoYW4gc3RyaW5nXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVhZElucHV0SGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoXCIucmVhZC5pblwiKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gRXZhbHVhdGlvblJlc3VsdC5TdXNwZW5kRm9ySW5wdXQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVtcHR5IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUVtcHR5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmV0dXJuSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgLy8gVE9ETzogSGFuZGxlIHJldHVybmluZyB0b3AgdmFsdWUgb24gc3RhY2sgYmFzZWQgb24gcmV0dXJuIHR5cGUgb2YgbWV0aG9kLlxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aHJlYWQuY3VycmVudE1ldGhvZDtcclxuICAgICAgICBjb25zdCBzaXplID0gY3VycmVudC5zdGFja1NpemUoKTtcclxuICAgICAgICBjb25zdCBoYXNSZXR1cm5UeXBlID0gY3VycmVudC5tZXRob2Q/LnJldHVyblR5cGUgIT0gXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKGhhc1JldHVyblR5cGUpe1xyXG4gICAgICAgICAgICBpZiAoc2l6ZSA9PSAwKXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJFeHBlY3RlZCByZXR1cm4gdmFsdWUgZnJvbSBtZXRob2QgYnV0IGZvdW5kIG5vIGluc3RhbmNlIG9uIHRoZSBzdGFja1wiKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaXplID4gMSl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBTdGFjayBJbWJhbGFuY2UhIFJldHVybmluZyBmcm9tICcke2N1cnJlbnQubWV0aG9kPy5uYW1lfScgZm91bmQgJyR7c2l6ZX0nIGluc3RhbmNlcyBsZWZ0IGJ1dCBleHBlY3RlZCBvbmUuYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoc2l6ZSA+IDApe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgU3RhY2sgSW1iYWxhbmNlISBSZXR1cm5pbmcgZnJvbSAnJHtjdXJyZW50Lm1ldGhvZD8ubmFtZX0nIGZvdW5kICcke3NpemV9JyBpbnN0YW5jZXMgbGVmdCBidXQgZXhwZWN0ZWQgemVyby5gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSB0aHJlYWQhLnJldHVybkZyb21DdXJyZW50TWV0aG9kKCk7XHJcblxyXG4gICAgICAgIGlmICghKHJldHVyblZhbHVlIGluc3RhbmNlb2YgUnVudGltZUVtcHR5KSl7XHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAucmV0XFx0XFx0JHtyZXR1cm5WYWx1ZX1gKTtcclxuICAgICAgICAgICAgdGhyZWFkPy5jdXJyZW50TWV0aG9kLnB1c2gocmV0dXJuVmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKFwiLnJldCB2b2lkXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuQ29udGludWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4uL01ldGhvZEFjdGl2YXRpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdGF0aWNDYWxsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgY2FsbFRleHQgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuXHJcbiAgICAgICAgY29uc3QgcGllY2VzID0gY2FsbFRleHQuc3BsaXQoXCIuXCIpO1xyXG5cclxuICAgICAgICBjb25zdCB0eXBlTmFtZSA9IHBpZWNlc1swXTtcclxuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gcGllY2VzWzFdO1xyXG5cclxuICAgICAgICBjb25zdCB0eXBlID0gdGhyZWFkLmtub3duVHlwZXMuZ2V0KHR5cGVOYW1lKSE7XHJcbiAgICAgICAgY29uc3QgbWV0aG9kID0gdHlwZT8ubWV0aG9kcy5maW5kKHggPT4geC5uYW1lID09PSBtZXRob2ROYW1lKSE7ICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGAuY2FsbC5zdGF0aWNcXHQke3R5cGVOYW1lfTo6JHttZXRob2ROYW1lfSgpYCk7XHJcblxyXG4gICAgICAgIHRocmVhZC5hY3RpdmF0ZU1ldGhvZChtZXRob2QpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBNZWFuaW5ne1xyXG4gICAgRGVzY3JpYmluZyxcclxuICAgIFRha2luZyxcclxuICAgIE1vdmluZyxcclxuICAgIERpcmVjdGlvbixcclxuICAgIEludmVudG9yeSxcclxuICAgIERyb3BwaW5nLFxyXG4gICAgUXVpdHRpbmcsXHJcbiAgICBDdXN0b21cclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuL1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUFueXtcclxuICAgIHBhcmVudFR5cGVOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICB0eXBlTmFtZTpzdHJpbmcgPSBBbnkudHlwZU5hbWU7XHJcblxyXG4gICAgZmllbGRzOk1hcDxzdHJpbmcsIFZhcmlhYmxlPiA9IG5ldyBNYXA8c3RyaW5nLCBWYXJpYWJsZT4oKTtcclxuICAgIG1ldGhvZHM6TWFwPHN0cmluZywgTWV0aG9kPiA9IG5ldyBNYXA8c3RyaW5nLCBNZXRob2Q+KCk7XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy50eXBlTmFtZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUJvb2xlYW4gZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOmJvb2xlYW4pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuL1J1bnRpbWVTdHJpbmdcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lQ29tbWFuZCBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGFyZ2V0TmFtZT86UnVudGltZVN0cmluZywgcHVibGljIGFjdGlvbj86UnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVFbXB0eSBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gXCJ+ZW1wdHlcIjtcclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUludGVnZXIgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHZhbHVlOm51bWJlcil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lV29ybGRPYmplY3QgfSBmcm9tIFwiLi9SdW50aW1lV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvSXRlbVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUl0ZW0gZXh0ZW5kcyBSdW50aW1lV29ybGRPYmplY3R7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBJdGVtLnR5cGVOYW1lO1xyXG5cclxuICAgIHN0YXRpYyBnZXQgdHlwZSgpOlR5cGV7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IFJ1bnRpbWVXb3JsZE9iamVjdC50eXBlO1xyXG5cclxuICAgICAgICB0eXBlLm5hbWUgPSBJdGVtLnR5cGVOYW1lO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9NZXRob2RcIjtcclxuaW1wb3J0IHsgUGFyYW1ldGVyIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9QYXJhbWV0ZXJcIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tIFwiLi4vLi4vY29tbW9uL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4vUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVMaXN0IGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpdGVtczpSdW50aW1lQW55W10pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5zID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgIGNvbnRhaW5zLm5hbWUgPSBMaXN0LmNvbnRhaW5zO1xyXG4gICAgICAgIGNvbnRhaW5zLnBhcmFtZXRlcnMucHVzaChcclxuICAgICAgICAgICAgbmV3IFBhcmFtZXRlcihMaXN0LnR5cGVOYW1lUGFyYW1ldGVyLCBTdHJpbmdUeXBlLnR5cGVOYW1lKSxcclxuICAgICAgICAgICAgbmV3IFBhcmFtZXRlcihMaXN0LmNvdW50UGFyYW1ldGVyLCBOdW1iZXJUeXBlLnR5cGVOYW1lKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5zLnJldHVyblR5cGUgPSBCb29sZWFuVHlwZS50eXBlTmFtZTtcclxuXHJcbiAgICAgICAgY29udGFpbnMuYm9keS5wdXNoKFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkTG9jYWwoTGlzdC5jb3VudFBhcmFtZXRlciksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRMb2NhbChMaXN0LnR5cGVOYW1lUGFyYW1ldGVyKSwgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5leHRlcm5hbENhbGwoXCJjb250YWluc1R5cGVcIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnJldHVybigpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tZXRob2RzLnNldChMaXN0LmNvbnRhaW5zLCBjb250YWlucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb250YWluc1R5cGUodHlwZU5hbWU6UnVudGltZVN0cmluZywgY291bnQ6UnVudGltZUludGVnZXIpe1xyXG4gICAgICAgIGNvbnN0IGZvdW5kSXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUgPT09IHR5cGVOYW1lLnZhbHVlKTtcclxuICAgICAgICBjb25zdCBmb3VuZCA9IGZvdW5kSXRlbXMubGVuZ3RoID09PSBjb3VudC52YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIE1lbW9yeS5hbGxvY2F0ZUJvb2xlYW4oZm91bmQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVBsYWNlIGV4dGVuZHMgUnVudGltZVdvcmxkT2JqZWN0e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC5wYXJlbnRUeXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gUGxhY2UudHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIGdldCB0eXBlKCk6VHlwZXtcclxuICAgICAgICBjb25zdCB0eXBlID0gUnVudGltZVdvcmxkT2JqZWN0LnR5cGU7XHJcblxyXG4gICAgICAgIHR5cGUubmFtZSA9IFBsYWNlLnR5cGVOYW1lO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxheWVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVBsYXllciBleHRlbmRzIFJ1bnRpbWVXb3JsZE9iamVjdHtcclxuICAgIHN0YXRpYyBnZXQgdHlwZSgpOlR5cGV7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IFJ1bnRpbWVXb3JsZE9iamVjdC50eXBlO1xyXG5cclxuICAgICAgICB0eXBlLm5hbWUgPSBQbGF5ZXIudHlwZU5hbWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lU2F5IGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIG1lc3NhZ2U6c3RyaW5nID0gXCJcIjtcclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVTdHJpbmcgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgdmFsdWU6c3RyaW5nO1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IFwifnN0cmluZ1wiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gYFwiJHt0aGlzLnZhbHVlfVwiYDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVMaXN0IH0gZnJvbSBcIi4vUnVudGltZUxpc3RcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuL1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVXb3JsZE9iamVjdCBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIGdldCB0eXBlKCk6VHlwZXtcclxuICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoV29ybGRPYmplY3QudHlwZU5hbWUsIFdvcmxkT2JqZWN0LnBhcmVudFR5cGVOYW1lKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjb250ZW50cyA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgIGNvbnRlbnRzLm5hbWUgPSBXb3JsZE9iamVjdC5jb250ZW50cztcclxuICAgICAgICBjb250ZW50cy50eXBlTmFtZSA9IExpc3QudHlwZU5hbWU7XHJcbiAgICAgICAgY29udGVudHMuZGVmYXVsdFZhbHVlID0gW107XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgZGVzY3JpcHRpb24ubmFtZSA9IFdvcmxkT2JqZWN0LmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uLnR5cGVOYW1lID0gU3RyaW5nVHlwZS50eXBlTmFtZTtcclxuICAgICAgICBkZXNjcmlwdGlvbi5kZWZhdWx0VmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICB0eXBlLmZpZWxkcy5wdXNoKGNvbnRlbnRzKTtcclxuICAgICAgICB0eXBlLmZpZWxkcy5wdXNoKGRlc2NyaXB0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRGaWVsZFZhbHVlQnlOYW1lKG5hbWU6c3RyaW5nKTpSdW50aW1lQW55e1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5maWVsZHMuZ2V0KG5hbWUpPy52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGluc3RhbmNlID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYEF0dGVtcHRlZCBmaWVsZCBhY2Nlc3MgZm9yIHVua25vd24gZmllbGQgJyR7bmFtZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29udGVudHNGaWVsZCgpOlJ1bnRpbWVMaXN0e1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEZpZWxkQXNMaXN0KFdvcmxkT2JqZWN0LmNvbnRlbnRzKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRGaWVsZEFzTGlzdChuYW1lOnN0cmluZyk6UnVudGltZUxpc3R7XHJcbiAgICAgICAgcmV0dXJuIDxSdW50aW1lTGlzdD50aGlzLmdldEZpZWxkVmFsdWVCeU5hbWUobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RmllbGRBc1N0cmluZyhuYW1lOnN0cmluZyk6UnVudGltZVN0cmluZ3tcclxuICAgICAgICByZXR1cm4gPFJ1bnRpbWVTdHJpbmc+dGhpcy5nZXRGaWVsZFZhbHVlQnlOYW1lKG5hbWUpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZhcmlhYmxle1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBuYW1lOnN0cmluZywgXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdHlwZTpUeXBlLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHZhbHVlPzpSdW50aW1lQW55KXtcclxuICAgIH1cclxufSJdfQ==
