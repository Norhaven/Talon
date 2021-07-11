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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalonIde = void 0;
const TalonCompiler_1 = require("./compiler/TalonCompiler");
const PaneOutput_1 = require("./PaneOutput");
const TalonRuntime_1 = require("./runtime/TalonRuntime");
const AnalysisCoordinator_1 = require("./ide/AnalysisCoordinator");
const CodePaneAnalyzer_1 = require("./ide/analyzers/CodePaneAnalyzer");
const CodePaneStyleFormatter_1 = require("./ide/formatters/CodePaneStyleFormatter");
class TalonIde {
    constructor() {
        this.compiledTypes = [];
        this.codePane = TalonIde.getById("code-pane");
        this.gamePane = TalonIde.getById("game-pane");
        this.compilationOutput = TalonIde.getById("compilation-output");
        this.gameLogOutput = TalonIde.getById("log-pane");
        this.openButton = TalonIde.getById("open");
        this.saveButton = TalonIde.getById("save");
        this.example1Button = TalonIde.getById("example1");
        this.compileButton = TalonIde.getById("compile");
        this.startNewGameButton = TalonIde.getById("start-new-game");
        this.userCommandText = TalonIde.getById("user-command-text");
        this.sendUserCommandButton = TalonIde.getById("send-user-command");
        this.caretPosition = TalonIde.getById("caret-position");
        this.saveButton.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () { return yield this.saveCodeFile(this.codePane.innerText); }));
        this.openButton.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () { return yield this.openCodeFile(e); }));
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
        this.codePaneStyleFormatter = new CodePaneStyleFormatter_1.CodePaneStyleFormatter(this.codePane);
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
        this.runtime.stop();
        if (this.runtime.loadFrom(this.compiledTypes)) {
            this.runtime.start();
        }
    }
    openCodeFile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                types: [
                    {
                        description: TalonIde.TalonCodeFileDescription,
                        accept: {
                            'text/plain': [TalonIde.TalonCodeFileExtension]
                        }
                    },
                ],
                excludeAcceptAllOption: true,
                multiple: false
            };
            const handles = yield window.showOpenFilePicker(options);
            const file = yield handles[0].getFile();
            this.codePane.innerText = yield file.text();
        });
    }
    saveCodeFile(contents) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                types: [
                    {
                        description: TalonIde.TalonCodeFileDescription,
                        accept: {
                            'text/plain': [TalonIde.TalonCodeFileExtension],
                        },
                    },
                ],
            };
            const fileHandle = yield window.showSaveFilePicker(options);
            const writable = yield fileHandle.createWritable();
            yield writable.write(contents);
            yield writable.close();
        });
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
                "it is described as \"The inn is a cozy place, with a crackling fire on the hearth. The bartender is behind the bar. An open door to the north leads outside.\" \n" +
                "    and if it contains 1 Coin then \"There's also a coin here.\"; or else \"There is just dust.\"; and then continue.\n" +
                "it contains 1 Coin, 1 Fireplace.\n" +
                "it can reach the Walkway by going \"north\". \n" +
                "it has a value that is false. \n" +
                "when the player exits: \n" +
                "    if value is false then \n" +
                "        say \"The bartender waves goodbye.\"; \n" +
                "    or else \n" +
                "        say \"The bartender cleans the bar.\"; \n" +
                "    and then continue;\n" +
                "    set value to true; \n" +
                "and then stop. \n\n" +
                "a Fireplace is a kind of decoration. \n" +
                "it is described as \"The fireplace crackles. It's full of fire.\". \n\n" +
                "a Walkway is a kind of place. \n" +
                "it is described as \"The walkway in front of the inn is empty, just a cobblestone entrance. The inn is to the south.\". \n" +
                "it can reach the Inn by going \"south\". \n" +
                "when the player enters:\n" +
                "    say \"You walk onto the cobblestones. They're nice, if you like that sort of thing.\"; \n" +
                "    say \"There's nobody around. The wind whistles a little bit.\"; \n" +
                "and then stop. \n\n" +
                "say \"This is the middle.\".\n\n" +
                "a Coin is a kind of item. \n" +
                "it is described as \"It's a small coin.\".\n\n" +
                "say \"This is the end.\".\n";
    }
}
exports.TalonIde = TalonIde;
TalonIde.TalonCodeFileDescription = "Talon Code";
TalonIde.TalonCodeFileExtension = ".tln";
},{"./PaneOutput":1,"./compiler/TalonCompiler":11,"./ide/AnalysisCoordinator":52,"./ide/analyzers/CodePaneAnalyzer":54,"./ide/formatters/CodePaneStyleFormatter":55,"./runtime/TalonRuntime":78}],3:[function(require,module,exports){
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
    static loadBoolean(value) {
        return new Instruction(OpCode_1.OpCode.LoadBoolean, value);
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
    OpCode["LoadBoolean"] = ".load.bool";
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
},{"../common/Instruction":5,"../common/Method":6,"../common/Type":9,"../common/Version":10,"../library/Any":56,"../library/Delegate":60,"../library/EntryPointAttribute":61,"./exceptions/CompilationError":12,"./lexing/TalonLexer":15,"./parsing/TalonParser":19,"./semantics/TalonSemanticAnalyzer":49,"./transforming/TalonTransformer":51}],12:[function(require,module,exports){
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
Keywords.true = "true";
Keywords.false = "false";
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
            else if (token.value === Keywords_1.Keywords.true || token.value === Keywords_1.Keywords.false) {
                token.type = TokenType_1.TokenType.Boolean;
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
},{"../../library/Any":56,"../../library/BooleanType":57,"../../library/Decoration":59,"../../library/Item":63,"../../library/List":64,"../../library/Place":66,"../../library/WorldObject":71,"./TokenType":17}],17:[function(require,module,exports){
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
    TokenType["Boolean"] = "Boolean";
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
    expectBoolean() {
        return this.expectAndConsume(TokenType_1.TokenType.Boolean, "Expected boolean");
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
const BooleanType_1 = require("../../../library/BooleanType");
const Convert_1 = require("../../../library/Convert");
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
            return new LiteralExpression_1.LiteralExpression(NumberType_1.NumberType.typeName, Number(value.value));
        }
        else if (context.isTypeOf(TokenType_1.TokenType.Boolean)) {
            const value = context.expectBoolean();
            return new LiteralExpression_1.LiteralExpression(BooleanType_1.BooleanType.typeName, Convert_1.Convert.stringToBoolean(value.value));
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
},{"../../../library/BooleanType":57,"../../../library/Convert":58,"../../../library/NumberType":65,"../../../library/StringType":69,"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../../lexing/TokenType":17,"../expressions/ContainsExpression":24,"../expressions/ListExpression":29,"../expressions/LiteralExpression":30,"../expressions/SayExpression":32,"../expressions/SetVariableExpression":33,"./ComparisonExpressionVisitor":38,"./IfExpressionVisitor":42,"./Visitor":47}],41:[function(require,module,exports){
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
            else if (context.isTypeOf(TokenType_1.TokenType.Boolean)) {
                field.typeName = BooleanType_1.BooleanType.typeName;
                field.initialValue = context.expectBoolean().value;
            }
            else {
                throw new CompilationError_1.CompilationError(`Expected a string, number, or boolean but found '${context.currentToken.value}' of type '${context.currentToken.type}'`);
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
},{"../../../library/BooleanType":57,"../../../library/List":64,"../../../library/NumberType":65,"../../../library/Place":66,"../../../library/StringType":69,"../../../library/WorldObject":71,"../../exceptions/CompilationError":12,"../../lexing/Keywords":13,"../../lexing/TokenType":17,"../expressions/ConcatenationExpression":23,"../expressions/FieldDeclarationExpression":26,"./ExpressionVisitor":40,"./Visitor":47}],42:[function(require,module,exports){
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
const Convert_1 = require("../../library/Convert");
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
                                let value = false;
                                if (typeof fieldExpression.initialValue == 'string') {
                                    value = Convert_1.Convert.stringToBoolean(fieldExpression.initialValue);
                                }
                                else if (typeof fieldExpression.initialValue == 'boolean') {
                                    value = fieldExpression.initialValue;
                                }
                                else {
                                    throw new CompilationError_1.CompilationError(`Unable to transform field type`);
                                }
                                this.out.write(`INIT ${field.name}:${field.typeName} = (${value}:${typeof value})${fieldExpression.initialValue}:${typeof fieldExpression.initialValue}`);
                                field.defaultValue = value;
                                this.out.write(`VALUE IS ${field.defaultValue}:${typeof field.defaultValue}`);
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
            else if (expression.typeName == BooleanType_1.BooleanType.typeName) {
                instructions.push(Instruction_1.Instruction.loadBoolean((expression.value)));
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
},{"../../common/EventType":3,"../../common/Field":4,"../../common/Instruction":5,"../../common/Method":6,"../../common/Parameter":8,"../../common/Type":9,"../../library/Any":56,"../../library/BooleanType":57,"../../library/Convert":58,"../../library/Decoration":59,"../../library/Item":63,"../../library/List":64,"../../library/NumberType":65,"../../library/Place":66,"../../library/Player":67,"../../library/Say":68,"../../library/StringType":69,"../../library/Understanding":70,"../../library/WorldObject":71,"../exceptions/CompilationError":12,"../lexing/Keywords":13,"../parsing/expressions/ActionsExpression":20,"../parsing/expressions/ComparisonExpression":22,"../parsing/expressions/ConcatenationExpression":23,"../parsing/expressions/ContainsExpression":24,"../parsing/expressions/FieldDeclarationExpression":26,"../parsing/expressions/IdentifierExpression":27,"../parsing/expressions/IfExpression":28,"../parsing/expressions/LiteralExpression":30,"../parsing/expressions/ProgramExpression":31,"../parsing/expressions/SayExpression":32,"../parsing/expressions/SetVariableExpression":33,"../parsing/expressions/TypeDeclarationExpression":34,"../parsing/expressions/UnderstandingDeclarationExpression":35,"./ExpressionTransformationMode":50}],52:[function(require,module,exports){
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
exports.CodePaneStyleFormatter = void 0;
class CodePaneStyleFormatter {
    constructor(pane) {
        this.pane = pane;
        this.pane.addEventListener('keydown', e => {
            if (e.key === "Tab") {
                e.preventDefault();
            }
        });
        this.pane.addEventListener('keyup', e => {
            if (e.key === "Tab") {
                e.preventDefault();
                let selection = window.getSelection();
                selection.collapseToStart();
                let range = selection.getRangeAt(0);
                range.insertNode(document.createTextNode("    "));
                selection.collapseToEnd();
            }
        });
    }
    get currentPane() {
        return this.pane;
    }
}
exports.CodePaneStyleFormatter = CodePaneStyleFormatter;
},{}],56:[function(require,module,exports){
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
},{"./ExternCall":62}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanType = void 0;
const Any_1 = require("./Any");
class BooleanType {
}
exports.BooleanType = BooleanType;
BooleanType.parentTypeName = Any_1.Any.typeName;
BooleanType.typeName = "~boolean";
},{"./Any":56}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = void 0;
const Keywords_1 = require("../compiler/lexing/Keywords");
class Convert {
    static stringToNumber(value) {
        return Number(value);
    }
    static stringToBoolean(value) {
        return value.toLowerCase() == Keywords_1.Keywords.true;
    }
}
exports.Convert = Convert;
},{"../compiler/lexing/Keywords":13}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decoration = void 0;
const WorldObject_1 = require("./WorldObject");
class Decoration {
}
exports.Decoration = Decoration;
Decoration.parentTypeName = WorldObject_1.WorldObject.typeName;
Decoration.typeName = "~decoration";
},{"./WorldObject":71}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delegate = void 0;
const Any_1 = require("./Any");
class Delegate {
}
exports.Delegate = Delegate;
Delegate.typeName = "~delegate";
Delegate.parentTypeName = Any_1.Any.typeName;
},{"./Any":56}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryPointAttribute = void 0;
class EntryPointAttribute {
    constructor() {
        this.name = "~entryPoint";
    }
}
exports.EntryPointAttribute = EntryPointAttribute;
},{}],62:[function(require,module,exports){
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
},{}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const WorldObject_1 = require("./WorldObject");
class Item {
}
exports.Item = Item;
Item.typeName = "~item";
Item.parentTypeName = WorldObject_1.WorldObject.typeName;
},{"./WorldObject":71}],64:[function(require,module,exports){
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
},{"./Any":56}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberType = void 0;
const Any_1 = require("./Any");
class NumberType {
}
exports.NumberType = NumberType;
NumberType.typeName = "~number";
NumberType.parentTypeName = Any_1.Any.typeName;
},{"./Any":56}],66:[function(require,module,exports){
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
},{"./WorldObject":71}],67:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const WorldObject_1 = require("./WorldObject");
class Player {
}
exports.Player = Player;
Player.typeName = "~player";
Player.parentTypeName = WorldObject_1.WorldObject.typeName;
},{"./WorldObject":71}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Say = void 0;
const Any_1 = require("./Any");
class Say {
}
exports.Say = Say;
Say.typeName = "~say";
Say.parentTypeName = Any_1.Any.typeName;
},{"./Any":56}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringType = void 0;
const Any_1 = require("./Any");
class StringType {
}
exports.StringType = StringType;
StringType.parentTypeName = Any_1.Any.typeName;
StringType.typeName = "~string";
},{"./Any":56}],70:[function(require,module,exports){
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
},{"./Any":56}],71:[function(require,module,exports){
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
},{"./Any":56}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TalonIde_1 = require("./TalonIde");
var ide = new TalonIde_1.TalonIde();
},{"./TalonIde":2}],73:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationResult = void 0;
var EvaluationResult;
(function (EvaluationResult) {
    EvaluationResult[EvaluationResult["Continue"] = 0] = "Continue";
    EvaluationResult[EvaluationResult["SuspendForInput"] = 1] = "SuspendForInput";
})(EvaluationResult = exports.EvaluationResult || (exports.EvaluationResult = {}));
},{}],74:[function(require,module,exports){
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
},{"./StackFrame":77,"./errors/RuntimeError":83}],75:[function(require,module,exports){
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
},{"./EvaluationResult":73}],76:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeState = void 0;
var RuntimeState;
(function (RuntimeState) {
    RuntimeState[RuntimeState["Stopped"] = 0] = "Stopped";
    RuntimeState[RuntimeState["Loaded"] = 1] = "Loaded";
    RuntimeState[RuntimeState["Started"] = 2] = "Started";
})(RuntimeState = exports.RuntimeState || (exports.RuntimeState = {}));
},{}],77:[function(require,module,exports){
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
},{"./library/Variable":125}],78:[function(require,module,exports){
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
const RuntimeState_1 = require("./RuntimeState");
const StateMachine_1 = require("./common/StateMachine");
const State_1 = require("./common/State");
const LoadBooleanHandler_1 = require("./handlers/LoadBooleanHandler");
class TalonRuntime {
    constructor(userOutput, logOutput) {
        this.userOutput = userOutput;
        this.logOutput = logOutput;
        this.userOutput = userOutput;
        const handlerInstances = [
            new NoOpHandler_1.NoOpHandler(),
            new LoadStringHandler_1.LoadStringHandler(),
            new PrintHandler_1.PrintHandler(this.userOutput),
            new NewInstanceHandler_1.NewInstanceHandler(),
            new ReadInputHandler_1.ReadInputHandler(),
            new ParseCommandHandler_1.ParseCommandHandler(),
            new HandleCommandHandler_1.HandleCommandHandler(this.userOutput),
            new GoToHandler_1.GoToHandler(),
            new ReturnHandler_1.ReturnHandler(),
            new StaticCallHandler_1.StaticCallHandler(),
            new LoadInstanceHandler_1.LoadInstanceHandler(),
            new LoadNumberHandler_1.LoadNumberHandler(),
            new LoadBooleanHandler_1.LoadBooleanHandler(),
            new InstanceCallHandler_1.InstanceCallHandler(),
            new LoadPropertyHandler_1.LoadPropertyHandler(),
            new LoadFieldHandler_1.LoadFieldHandler(),
            new ExternalCallHandler_1.ExternalCallHandler(),
            new LoadLocalHandler_1.LoadLocalHandler(),
            new LoadThisHandler_1.LoadThisHandler(),
            new BranchRelativeHandler_1.BranchRelativeHandler(),
            new BranchRelativeIfFalseHandler_1.BranchRelativeIfFalseHandler(),
            new ConcatenateHandler_1.ConcatenateHandler(),
            new AssignVariableHandler_1.AssignVariableHandler(),
            new TypeOfHandler_1.TypeOfHandler(),
            new InvokeDelegateHandler_1.InvokeDelegateHandler(),
            new ComparisonHandler_1.ComparisonHandler()
        ];
        this.handlers = new Map(handlerInstances.map(x => [x.code, x]));
        this.state = new StateMachine_1.StateMachine(new State_1.State(RuntimeState_1.RuntimeState.Stopped, (current) => current.state !== RuntimeState_1.RuntimeState.Stopped), new State_1.State(RuntimeState_1.RuntimeState.Loaded, (current) => {
            var _a;
            if (current.state === RuntimeState_1.RuntimeState.Started) {
                (_a = this.logOutput) === null || _a === void 0 ? void 0 : _a.debug("The runtime has already been started and can't load more types.");
                return false;
            }
            return true;
        }), new State_1.State(RuntimeState_1.RuntimeState.Started, (current) => {
            var _a, _b;
            if (current.state === RuntimeState_1.RuntimeState.Started) {
                (_a = this.logOutput) === null || _a === void 0 ? void 0 : _a.debug("The runtime has already been started.");
                return false;
            }
            else if (current.state === RuntimeState_1.RuntimeState.Stopped) {
                (_b = this.logOutput) === null || _b === void 0 ? void 0 : _b.debug("The runtime must be loaded with types prior to being started.");
                return false;
            }
            return true;
        }));
    }
    start() {
        var _a, _b;
        if (!this.state.tryMoveTo(RuntimeState_1.RuntimeState.Started)) {
            return;
        }
        const places = (_a = this.thread) === null || _a === void 0 ? void 0 : _a.allTypes.filter(x => x.baseTypeName == Place_1.Place.typeName).map(x => Memory_1.Memory.allocate(x));
        const getPlayerStart = (place) => { var _a; return ((_a = place.fields.get(Place_1.Place.isPlayerStart)) === null || _a === void 0 ? void 0 : _a.value); };
        const isPlayerStart = (place) => { var _a; return ((_a = getPlayerStart(place)) === null || _a === void 0 ? void 0 : _a.value) === true; };
        const currentPlace = places === null || places === void 0 ? void 0 : places.find(isPlayerStart);
        this.thread.currentPlace = currentPlace;
        const player = (_b = this.thread) === null || _b === void 0 ? void 0 : _b.knownTypes.get(Player_1.Player.typeName);
        this.thread.currentPlayer = Memory_1.Memory.allocate(player);
        this.runWith("");
    }
    stop() {
        if (!this.state.tryMoveTo(RuntimeState_1.RuntimeState.Stopped)) {
            return;
        }
        Memory_1.Memory.clear();
        this.thread = undefined;
    }
    loadFrom(types) {
        var _a;
        if (types.length == 0) {
            (_a = this.logOutput) === null || _a === void 0 ? void 0 : _a.debug("No types were provided, unable to load runtime.");
            return false;
        }
        if (!this.state.tryMoveTo(RuntimeState_1.RuntimeState.Loaded)) {
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
},{"../common/OpCode":7,"../library/Any":56,"../library/EntryPointAttribute":61,"../library/Place":66,"../library/Player":67,"./EvaluationResult":73,"./MethodActivation":74,"./RuntimeState":76,"./Thread":79,"./common/Memory":80,"./common/State":81,"./common/StateMachine":82,"./errors/RuntimeError":83,"./handlers/AssignVariableHandler":84,"./handlers/BranchRelativeHandler":85,"./handlers/BranchRelativeIfFalseHandler":86,"./handlers/ComparisonHandler":87,"./handlers/ConcatenateHandler":88,"./handlers/ExternalCallHandler":89,"./handlers/GoToHandler":90,"./handlers/HandleCommandHandler":91,"./handlers/InstanceCallHandler":92,"./handlers/InvokeDelegateHandler":93,"./handlers/LoadBooleanHandler":94,"./handlers/LoadFieldHandler":95,"./handlers/LoadInstanceHandler":96,"./handlers/LoadLocalHandler":97,"./handlers/LoadNumberHandler":98,"./handlers/LoadPropertyHandler":99,"./handlers/LoadStringHandler":100,"./handlers/LoadThisHandler":101,"./handlers/NewInstanceHandler":102,"./handlers/NoOpHandler":103,"./handlers/ParseCommandHandler":104,"./handlers/PrintHandler":105,"./handlers/ReadInputHandler":106,"./handlers/ReturnHandler":107,"./handlers/StaticCallHandler":108,"./handlers/TypeOfHandler":109}],79:[function(require,module,exports){
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
},{"../library/Understanding":70,"./MethodActivation":74,"./library/RuntimeEmpty":116}],80:[function(require,module,exports){
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
},{"../../library/BooleanType":57,"../../library/Decoration":59,"../../library/Item":63,"../../library/List":64,"../../library/NumberType":65,"../../library/Place":66,"../../library/Player":67,"../../library/Say":68,"../../library/StringType":69,"../errors/RuntimeError":83,"../library/RuntimeBoolean":112,"../library/RuntimeCommand":113,"../library/RuntimeDecoration":114,"../library/RuntimeEmpty":116,"../library/RuntimeInteger":117,"../library/RuntimeItem":118,"../library/RuntimeList":119,"../library/RuntimePlace":120,"../library/RuntimePlayer":121,"../library/RuntimeSay":122,"../library/RuntimeString":123,"../library/Variable":125}],81:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
class State {
    constructor(state, ...preconditions) {
        this.state = state;
        this.preconditions = [];
        if (preconditions) {
            preconditions.forEach(x => this.preconditions.push(x));
        }
    }
    static empty() {
        return new State();
    }
}
exports.State = State;
},{}],82:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachine = void 0;
const RuntimeError_1 = require("../errors/RuntimeError");
const State_1 = require("./State");
class StateMachine {
    constructor(...states) {
        this.currentState = State_1.State.empty();
        this.statesByContent = new Map(states.map(x => [x.state, x]));
    }
    getState(state) {
        const current = this.statesByContent.get(state);
        if (!current) {
            throw new RuntimeError_1.RuntimeError(`Unable to get unknown state '${state}`);
        }
        return current;
    }
    initializeTo(state) {
        this.currentState = this.getState(state);
    }
    tryMoveTo(state) {
        const attemptedState = this.getState(state);
        if (!attemptedState.preconditions.every(x => x(this.currentState))) {
            return false;
        }
        this.currentState = attemptedState;
        return true;
    }
}
exports.StateMachine = StateMachine;
},{"../errors/RuntimeError":83,"./State":81}],83:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeError = void 0;
class RuntimeError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.RuntimeError = RuntimeError;
},{}],84:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignVariableHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeString_1 = require("../library/RuntimeString");
const RuntimeError_1 = require("../errors/RuntimeError");
const RuntimeInteger_1 = require("../library/RuntimeInteger");
const OpCode_1 = require("../../common/OpCode");
const RuntimeBoolean_1 = require("../library/RuntimeBoolean");
class AssignVariableHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.Assign;
    }
    handle(thread) {
        const instance = thread.currentMethod.pop();
        const value = thread.currentMethod.pop();
        this.logInteraction(thread, instance, value);
        if (instance instanceof RuntimeString_1.RuntimeString) {
            instance.value = value.value;
        }
        else if (instance instanceof RuntimeInteger_1.RuntimeInteger) {
            instance.value = value.value;
        }
        else if (instance instanceof RuntimeBoolean_1.RuntimeBoolean) {
            instance.value = value.value;
        }
        else {
            throw new RuntimeError_1.RuntimeError("Encountered unsupported type on the stack");
        }
        return super.handle(thread);
    }
}
exports.AssignVariableHandler = AssignVariableHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../errors/RuntimeError":83,"../library/RuntimeBoolean":112,"../library/RuntimeInteger":117,"../library/RuntimeString":123}],85:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75}],86:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75}],87:[function(require,module,exports){
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
        var instance = thread.currentMethod.pop();
        var comparand = thread.currentMethod.pop();
        this.logInteraction(thread, instance, comparand);
        if (instance instanceof RuntimeString_1.RuntimeString && comparand instanceof RuntimeString_1.RuntimeString) {
            var value = Memory_1.Memory.allocateBoolean(instance.value == comparand.value);
            thread.currentMethod.push(value);
        }
        else if (instance instanceof RuntimeInteger_1.RuntimeInteger && comparand instanceof RuntimeInteger_1.RuntimeInteger) {
            var value = Memory_1.Memory.allocateBoolean(instance.value == comparand.value);
            thread.currentMethod.push(value);
        }
        else if (instance instanceof RuntimeBoolean_1.RuntimeBoolean && comparand instanceof RuntimeBoolean_1.RuntimeBoolean) {
            var value = Memory_1.Memory.allocateBoolean(instance.value === comparand.value);
            this.logInteraction(thread, `LOG: ${instance.value}:${typeof instance.value} == ${comparand.value}:${typeof comparand.value} -> ${value}`);
            thread.currentMethod.push(value);
        }
        else {
            throw new RuntimeError_1.RuntimeError(`Encountered type mismatch on stack during comparison: ${instance === null || instance === void 0 ? void 0 : instance.typeName} == ${comparand === null || comparand === void 0 ? void 0 : comparand.typeName}`);
        }
        return super.handle(thread);
    }
}
exports.ComparisonHandler = ComparisonHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80,"../errors/RuntimeError":83,"../library/RuntimeBoolean":112,"../library/RuntimeInteger":117,"../library/RuntimeString":123}],88:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80}],89:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75}],90:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoToHandler = void 0;
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeError_1 = require("../errors/RuntimeError");
const OpCode_1 = require("../../common/OpCode");
class GoToHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.GoTo;
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../errors/RuntimeError":83}],91:[function(require,module,exports){
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
                this.nameAndTotalContents(thread, inventory);
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
    nameAndTotalContents(thread, contents) {
        const names = contents.items.map(x => x.typeName);
        const namesWithCount = new Map();
        for (const name of names) {
            if (!namesWithCount.has(name)) {
                namesWithCount.set(name, 1);
            }
            else {
                const count = namesWithCount.get(name);
                namesWithCount.set(name, count + 1);
            }
        }
        const namedValues = [];
        for (const [name, value] of namesWithCount) {
            namedValues.push(`${value} ${name}(s)`);
        }
        namedValues.forEach(x => this.output.write(x));
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
},{"../../common/EventType":3,"../../common/OpCode":7,"../../common/Type":9,"../../library/Player":67,"../../library/Understanding":70,"../../library/WorldObject":71,"../OpCodeHandler":75,"../common/Memory":80,"../errors/RuntimeError":83,"../library/Meaning":110,"../library/RuntimeCommand":113,"../library/RuntimeDelegate":115,"../library/RuntimeItem":118,"../library/RuntimeWorldObject":124,"../library/Variable":125}],92:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../../common/Type":9,"../OpCodeHandler":75,"../library/Variable":125}],93:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../errors/RuntimeError":83,"../library/RuntimeDelegate":115}],94:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadBooleanHandler = void 0;
const OpCode_1 = require("../../common/OpCode");
const Memory_1 = require("../common/Memory");
const OpCodeHandler_1 = require("../OpCodeHandler");
class LoadBooleanHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.LoadBoolean;
    }
    handle(thread) {
        var _a;
        const value = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const runtimeValue = Memory_1.Memory.allocateBoolean(value);
        thread.currentMethod.push(runtimeValue);
        this.logInteraction(thread, value);
        return super.handle(thread);
    }
}
exports.LoadBooleanHandler = LoadBooleanHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80}],95:[function(require,module,exports){
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
        this.logInteraction(thread, `${instance === null || instance === void 0 ? void 0 : instance.typeName}::${fieldName}:${field === null || field === void 0 ? void 0 : field.type.name}`, '//', typeof value, value);
        thread.currentMethod.push(value);
        return super.handle(thread);
    }
}
exports.LoadFieldHandler = LoadFieldHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":75}],96:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../errors/RuntimeError":83}],97:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75}],98:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80}],99:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../EvaluationResult":73,"../OpCodeHandler":75,"./InstanceCallHandler":92,"./LoadThisHandler":101}],100:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../errors/RuntimeError":83,"../library/RuntimeString":123}],101:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75}],102:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80,"../errors/RuntimeError":83}],103:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75}],104:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80,"../errors/RuntimeError":83,"../library/RuntimeString":123}],105:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../errors/RuntimeError":83,"../library/RuntimeString":123}],106:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../EvaluationResult":73,"../OpCodeHandler":75}],107:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../EvaluationResult":73,"../OpCodeHandler":75,"../errors/RuntimeError":83,"../library/RuntimeEmpty":116}],108:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75}],109:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80}],110:[function(require,module,exports){
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
},{}],111:[function(require,module,exports){
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
},{"../../library/Any":56}],112:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeBoolean = void 0;
const Any_1 = require("../../library/Any");
const BooleanType_1 = require("../../library/BooleanType");
const RuntimeAny_1 = require("./RuntimeAny");
class RuntimeBoolean extends RuntimeAny_1.RuntimeAny {
    constructor(value) {
        super();
        this.value = value;
        this.parentTypeName = Any_1.Any.typeName;
        this.typeName = BooleanType_1.BooleanType.typeName;
    }
    toString() {
        return `${this.value.toString()}:${this.typeName}`;
    }
}
exports.RuntimeBoolean = RuntimeBoolean;
},{"../../library/Any":56,"../../library/BooleanType":57,"./RuntimeAny":111}],113:[function(require,module,exports){
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
},{"./RuntimeAny":111}],114:[function(require,module,exports){
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
},{"../../library/Decoration":59,"./RuntimeWorldObject":124}],115:[function(require,module,exports){
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
},{"../../library/Any":56,"../../library/Delegate":60,"./RuntimeAny":111}],116:[function(require,module,exports){
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
},{"../../library/Any":56,"./RuntimeAny":111}],117:[function(require,module,exports){
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
},{"./RuntimeAny":111}],118:[function(require,module,exports){
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
},{"../../library/Item":63,"../../library/WorldObject":71,"./RuntimeWorldObject":124}],119:[function(require,module,exports){
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
},{"../../common/Instruction":5,"../../common/Method":6,"../../common/Parameter":8,"../../library/BooleanType":57,"../../library/List":64,"../../library/NumberType":65,"../../library/StringType":69,"../common/Memory":80,"./RuntimeAny":111}],120:[function(require,module,exports){
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
},{"../../library/Place":66,"../../library/WorldObject":71,"./RuntimeWorldObject":124}],121:[function(require,module,exports){
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
},{"../../library/Player":67,"./RuntimeWorldObject":124}],122:[function(require,module,exports){
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
},{"./RuntimeAny":111}],123:[function(require,module,exports){
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
},{"../../library/Any":56,"./RuntimeAny":111}],124:[function(require,module,exports){
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
},{"../../common/Field":4,"../../common/Type":9,"../../library/Any":56,"../../library/List":64,"../../library/StringType":69,"../../library/WorldObject":71,"../errors/RuntimeError":83,"./RuntimeAny":111}],125:[function(require,module,exports){
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
},{}]},{},[72])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL25vcmhhL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInRhbG9uL1BhbmVPdXRwdXQudHMiLCJ0YWxvbi9UYWxvbklkZS50cyIsInRhbG9uL2NvbW1vbi9FdmVudFR5cGUudHMiLCJ0YWxvbi9jb21tb24vRmllbGQudHMiLCJ0YWxvbi9jb21tb24vSW5zdHJ1Y3Rpb24udHMiLCJ0YWxvbi9jb21tb24vTWV0aG9kLnRzIiwidGFsb24vY29tbW9uL09wQ29kZS50cyIsInRhbG9uL2NvbW1vbi9QYXJhbWV0ZXIudHMiLCJ0YWxvbi9jb21tb24vVHlwZS50cyIsInRhbG9uL2NvbW1vbi9WZXJzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvVGFsb25Db21waWxlci50cyIsInRhbG9uL2NvbXBpbGVyL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvci50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9LZXl3b3Jkcy50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9QdW5jdHVhdGlvbi50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9UYWxvbkxleGVyLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1Rva2VuLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1Rva2VuVHlwZS50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvUGFyc2VDb250ZXh0LnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9UYWxvblBhcnNlci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvQWN0aW9uc0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0JpbmFyeUV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0NvbXBhcmlzb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Db25jYXRlbmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29udGFpbnNFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvSWRlbnRpZmllckV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0lmRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvTGlzdEV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0xpdGVyYWxFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Qcm9ncmFtRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2F5RXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2V0VmFyaWFibGVFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9XaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9CbG9ja0V4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9Db21wYXJpc29uRXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL0V2ZW50RXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL0V4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9GaWVsZERlY2xhcmF0aW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvSWZFeHByZXNzaW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvUHJvZ3JhbVZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1NheUV4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9UeXBlRGVjbGFyYXRpb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9XaGVuRGVjbGFyYXRpb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvc2VtYW50aWNzL1RhbG9uU2VtYW50aWNBbmFseXplci50cyIsInRhbG9uL2NvbXBpbGVyL3RyYW5zZm9ybWluZy9FeHByZXNzaW9uVHJhbnNmb3JtYXRpb25Nb2RlLnRzIiwidGFsb24vY29tcGlsZXIvdHJhbnNmb3JtaW5nL1RhbG9uVHJhbnNmb3JtZXIudHMiLCJ0YWxvbi9pZGUvQW5hbHlzaXNDb29yZGluYXRvci50cyIsInRhbG9uL2lkZS9DYXJldFBvc2l0aW9uLnRzIiwidGFsb24vaWRlL2FuYWx5emVycy9Db2RlUGFuZUFuYWx5emVyLnRzIiwidGFsb24vaWRlL2Zvcm1hdHRlcnMvQ29kZVBhbmVTdHlsZUZvcm1hdHRlci50cyIsInRhbG9uL2xpYnJhcnkvQW55LnRzIiwidGFsb24vbGlicmFyeS9Cb29sZWFuVHlwZS50cyIsInRhbG9uL2xpYnJhcnkvQ29udmVydC50cyIsInRhbG9uL2xpYnJhcnkvRGVjb3JhdGlvbi50cyIsInRhbG9uL2xpYnJhcnkvRGVsZWdhdGUudHMiLCJ0YWxvbi9saWJyYXJ5L0VudHJ5UG9pbnRBdHRyaWJ1dGUudHMiLCJ0YWxvbi9saWJyYXJ5L0V4dGVybkNhbGwudHMiLCJ0YWxvbi9saWJyYXJ5L0l0ZW0udHMiLCJ0YWxvbi9saWJyYXJ5L0xpc3QudHMiLCJ0YWxvbi9saWJyYXJ5L051bWJlclR5cGUudHMiLCJ0YWxvbi9saWJyYXJ5L1BsYWNlLnRzIiwidGFsb24vbGlicmFyeS9QbGF5ZXIudHMiLCJ0YWxvbi9saWJyYXJ5L1NheS50cyIsInRhbG9uL2xpYnJhcnkvU3RyaW5nVHlwZS50cyIsInRhbG9uL2xpYnJhcnkvVW5kZXJzdGFuZGluZy50cyIsInRhbG9uL2xpYnJhcnkvV29ybGRPYmplY3QudHMiLCJ0YWxvbi9tYWluLnRzIiwidGFsb24vcnVudGltZS9FdmFsdWF0aW9uUmVzdWx0LnRzIiwidGFsb24vcnVudGltZS9NZXRob2RBY3RpdmF0aW9uLnRzIiwidGFsb24vcnVudGltZS9PcENvZGVIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9SdW50aW1lU3RhdGUudHMiLCJ0YWxvbi9ydW50aW1lL1N0YWNrRnJhbWUudHMiLCJ0YWxvbi9ydW50aW1lL1RhbG9uUnVudGltZS50cyIsInRhbG9uL3J1bnRpbWUvVGhyZWFkLnRzIiwidGFsb24vcnVudGltZS9jb21tb24vTWVtb3J5LnRzIiwidGFsb24vcnVudGltZS9jb21tb24vU3RhdGUudHMiLCJ0YWxvbi9ydW50aW1lL2NvbW1vbi9TdGF0ZU1hY2hpbmUudHMiLCJ0YWxvbi9ydW50aW1lL2Vycm9ycy9SdW50aW1lRXJyb3IudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0Fzc2lnblZhcmlhYmxlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvQnJhbmNoUmVsYXRpdmVIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9CcmFuY2hSZWxhdGl2ZUlmRmFsc2VIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Db21wYXJpc29uSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvQ29uY2F0ZW5hdGVIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9FeHRlcm5hbENhbGxIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Hb1RvSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvSGFuZGxlQ29tbWFuZEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0luc3RhbmNlQ2FsbEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0ludm9rZURlbGVnYXRlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZEJvb2xlYW5IYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkRmllbGRIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkSW5zdGFuY2VIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkTG9jYWxIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkTnVtYmVySGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZFByb3BlcnR5SGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZFN0cmluZ0hhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRUaGlzSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTmV3SW5zdGFuY2VIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Ob09wSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvUGFyc2VDb21tYW5kSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvUHJpbnRIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9SZWFkSW5wdXRIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9SZXR1cm5IYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9TdGF0aWNDYWxsSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvVHlwZU9mSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9NZWFuaW5nLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVBbnkudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUJvb2xlYW4udHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUNvbW1hbmQudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZURlY29yYXRpb24udHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZURlbGVnYXRlLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVFbXB0eS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lSW50ZWdlci50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lSXRlbS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lTGlzdC50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lUGxhY2UudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVBsYXllci50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lU2F5LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVTdHJpbmcudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVdvcmxkT2JqZWN0LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1ZhcmlhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDR0EsTUFBYSxVQUFVO0lBQ25CLFlBQW9CLElBQW1CO1FBQW5CLFNBQUksR0FBSixJQUFJLENBQWU7SUFFdkMsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFZO1FBRWQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFDO1lBQ3JCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFOUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsS0FBSyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7WUFFMUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDMUI7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxLQUFLLENBQUMsSUFBWTtRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksR0FBRyxRQUFRLENBQUM7UUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbEQsQ0FBQztDQUNKO0FBM0JELGdDQTJCQzs7Ozs7Ozs7Ozs7Ozs7QUM5QkQsNERBQXlEO0FBRXpELDZDQUEwQztBQUUxQyx5REFBc0Q7QUFFdEQsbUVBQWdFO0FBQ2hFLHVFQUFvRTtBQUNwRSxvRkFBaUY7QUFHakYsTUFB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b290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgSUxvZ091dHB1dCB9IGZyb20gXCIuL3J1bnRpbWUvSUxvZ091dHB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhbmVPdXRwdXQgaW1wbGVtZW50cyBJT3V0cHV0LCBJTG9nT3V0cHV0e1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYW5lOkhUTUxEaXZFbGVtZW50KXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIoKXtcclxuICAgICAgICB0aGlzLnBhbmUuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBkZWJ1ZyhsaW5lOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLicpKXtcclxuICAgICAgICAgICAgY29uc3QgcGFydHMgPSBsaW5lLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBwYXJ0c1swXSA9IGA8c3Ryb25nPiR7cGFydHNbMF19PC9zdHJvbmc+YDtcclxuXHJcbiAgICAgICAgICAgIGxpbmUgPSBwYXJ0cy5qb2luKCcgJyk7XHJcbiAgICAgICAgfSBcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lLmlubmVySFRNTCArPSBsaW5lICsgXCI8YnIgLz5cIjtcclxuICAgICAgICB0aGlzLnBhbmUuc2Nyb2xsVG8oMCwgdGhpcy5wYW5lLnNjcm9sbEhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgd3JpdGUobGluZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wYW5lLmlubmVySFRNTCArPSBsaW5lICsgXCI8YnIgLz5cIjtcclxuICAgICAgICB0aGlzLnBhbmUuc2Nyb2xsVG8oMCwgdGhpcy5wYW5lLnNjcm9sbEhlaWdodCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUYWxvbkNvbXBpbGVyIH0gZnJvbSBcIi4vY29tcGlsZXIvVGFsb25Db21waWxlclwiO1xyXG5cclxuaW1wb3J0IHsgUGFuZU91dHB1dCB9IGZyb20gXCIuL1BhbmVPdXRwdXRcIjtcclxuXHJcbmltcG9ydCB7IFRhbG9uUnVudGltZSB9IGZyb20gXCIuL3J1bnRpbWUvVGFsb25SdW50aW1lXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBBbmFseXNpc0Nvb3JkaW5hdG9yIH0gZnJvbSBcIi4vaWRlL0FuYWx5c2lzQ29vcmRpbmF0b3JcIjtcclxuaW1wb3J0IHsgQ29kZVBhbmVBbmFseXplciB9IGZyb20gXCIuL2lkZS9hbmFseXplcnMvQ29kZVBhbmVBbmFseXplclwiO1xyXG5pbXBvcnQgeyBDb2RlUGFuZVN0eWxlRm9ybWF0dGVyIH0gZnJvbSBcIi4vaWRlL2Zvcm1hdHRlcnMvQ29kZVBhbmVTdHlsZUZvcm1hdHRlclwiO1xyXG5pbXBvcnQgeyBGaWxlSGFuZGxlIH0gZnJvbSBcImZzL3Byb21pc2VzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25JZGV7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgVGFsb25Db2RlRmlsZURlc2NyaXB0aW9uID0gXCJUYWxvbiBDb2RlXCI7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBUYWxvbkNvZGVGaWxlRXh0ZW5zaW9uID0gXCIudGxuXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb2RlUGFuZTpIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZ2FtZVBhbmU6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBpbGF0aW9uT3V0cHV0OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBnYW1lTG9nT3V0cHV0OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBvcGVuQnV0dG9uOkhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBzYXZlQnV0dG9uOkhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBleGFtcGxlMUJ1dHRvbjpIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcGlsZUJ1dHRvbjpIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RhcnROZXdHYW1lQnV0dG9uOkhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSB1c2VyQ29tbWFuZFRleHQ6SFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2VuZFVzZXJDb21tYW5kQnV0dG9uOkhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjYXJldFBvc2l0aW9uOkhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcGlsYXRpb25PdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJ1bnRpbWVPdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJ1bnRpbWVMb2dPdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb2RlUGFuZUFuYWx5emVyOkNvZGVQYW5lQW5hbHl6ZXI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFuYWx5c2lzQ29vcmRpbmF0b3I6QW5hbHlzaXNDb29yZGluYXRvcjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvZGVQYW5lU3R5bGVGb3JtYXR0ZXI6Q29kZVBhbmVTdHlsZUZvcm1hdHRlcjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBpbGVyOlRhbG9uQ29tcGlsZXI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJ1bnRpbWU6VGFsb25SdW50aW1lO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGNvbXBpbGVkVHlwZXM6VHlwZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0QnlJZDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KG5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gPFQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNvZGVQYW5lID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MRGl2RWxlbWVudD4oXCJjb2RlLXBhbmVcIikhO1xyXG4gICAgICAgIHRoaXMuZ2FtZVBhbmUgPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxEaXZFbGVtZW50PihcImdhbWUtcGFuZVwiKSE7XHJcbiAgICAgICAgdGhpcy5jb21waWxhdGlvbk91dHB1dCA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTERpdkVsZW1lbnQ+KFwiY29tcGlsYXRpb24tb3V0cHV0XCIpITtcclxuICAgICAgICB0aGlzLmdhbWVMb2dPdXRwdXQgPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxEaXZFbGVtZW50PihcImxvZy1wYW5lXCIpITtcclxuICAgICAgICB0aGlzLm9wZW5CdXR0b24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxCdXR0b25FbGVtZW50PihcIm9wZW5cIik7XHJcbiAgICAgICAgdGhpcy5zYXZlQnV0dG9uID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MQnV0dG9uRWxlbWVudD4oXCJzYXZlXCIpO1xyXG4gICAgICAgIHRoaXMuZXhhbXBsZTFCdXR0b24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxCdXR0b25FbGVtZW50PihcImV4YW1wbGUxXCIpITtcclxuICAgICAgICB0aGlzLmNvbXBpbGVCdXR0b24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxCdXR0b25FbGVtZW50PihcImNvbXBpbGVcIikhO1xyXG4gICAgICAgIHRoaXMuc3RhcnROZXdHYW1lQnV0dG9uID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MQnV0dG9uRWxlbWVudD4oXCJzdGFydC1uZXctZ2FtZVwiKSE7XHJcbiAgICAgICAgdGhpcy51c2VyQ29tbWFuZFRleHQgPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxJbnB1dEVsZW1lbnQ+KFwidXNlci1jb21tYW5kLXRleHRcIikhO1xyXG4gICAgICAgIHRoaXMuc2VuZFVzZXJDb21tYW5kQnV0dG9uID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MQnV0dG9uRWxlbWVudD4oXCJzZW5kLXVzZXItY29tbWFuZFwiKTtcclxuICAgICAgICB0aGlzLmNhcmV0UG9zaXRpb24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxEaXZFbGVtZW50PihcImNhcmV0LXBvc2l0aW9uXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2F2ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGUgPT4gYXdhaXQgdGhpcy5zYXZlQ29kZUZpbGUodGhpcy5jb2RlUGFuZS5pbm5lclRleHQpKTtcclxuICAgICAgICB0aGlzLm9wZW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBlID0+IGF3YWl0IHRoaXMub3BlbkNvZGVGaWxlKGUpKTtcclxuICAgICAgICB0aGlzLmV4YW1wbGUxQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB0aGlzLmxvYWRFeGFtcGxlKCkpO1xyXG4gICAgICAgIHRoaXMuY29tcGlsZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4gdGhpcy5jb21waWxlKCkpO1xyXG4gICAgICAgIHRoaXMuc3RhcnROZXdHYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB0aGlzLnN0YXJ0TmV3R2FtZSgpKTtcclxuICAgICAgICB0aGlzLnNlbmRVc2VyQ29tbWFuZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4gdGhpcy5zZW5kVXNlckNvbW1hbmQoKSk7XHJcbiAgICAgICAgdGhpcy51c2VyQ29tbWFuZFRleHQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIHsgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRVc2VyQ29tbWFuZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tcGlsYXRpb25PdXRwdXRQYW5lID0gbmV3IFBhbmVPdXRwdXQodGhpcy5jb21waWxhdGlvbk91dHB1dCk7XHJcbiAgICAgICAgdGhpcy5ydW50aW1lT3V0cHV0UGFuZSA9IG5ldyBQYW5lT3V0cHV0KHRoaXMuZ2FtZVBhbmUpO1xyXG4gICAgICAgIHRoaXMucnVudGltZUxvZ091dHB1dFBhbmUgPSBuZXcgUGFuZU91dHB1dCh0aGlzLmdhbWVMb2dPdXRwdXQpO1xyXG5cclxuICAgICAgICB0aGlzLmNvZGVQYW5lQW5hbHl6ZXIgPSBuZXcgQ29kZVBhbmVBbmFseXplcih0aGlzLmNvZGVQYW5lKTtcclxuICAgICAgICB0aGlzLmFuYWx5c2lzQ29vcmRpbmF0b3IgPSBuZXcgQW5hbHlzaXNDb29yZGluYXRvcih0aGlzLmNvZGVQYW5lQW5hbHl6ZXIsIHRoaXMuY2FyZXRQb3NpdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuY29kZVBhbmVTdHlsZUZvcm1hdHRlciA9IG5ldyBDb2RlUGFuZVN0eWxlRm9ybWF0dGVyKHRoaXMuY29kZVBhbmUpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBpbGVyID0gbmV3IFRhbG9uQ29tcGlsZXIodGhpcy5jb21waWxhdGlvbk91dHB1dFBhbmUpO1xyXG4gICAgICAgIHRoaXMucnVudGltZSA9IG5ldyBUYWxvblJ1bnRpbWUodGhpcy5ydW50aW1lT3V0cHV0UGFuZSwgdGhpcy5ydW50aW1lTG9nT3V0cHV0UGFuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZW5kVXNlckNvbW1hbmQoKXtcclxuICAgICAgICBjb25zdCBjb21tYW5kID0gdGhpcy51c2VyQ29tbWFuZFRleHQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5ydW50aW1lLnNlbmRDb21tYW5kKGNvbW1hbmQpO1xyXG5cclxuICAgICAgICB0aGlzLnVzZXJDb21tYW5kVGV4dC52YWx1ZSA9IFwiXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb21waWxlKCl7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IHRoaXMuY29kZVBhbmUuaW5uZXJUZXh0O1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBpbGF0aW9uT3V0cHV0UGFuZS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuY29tcGlsZWRUeXBlcyA9IHRoaXMuY29tcGlsZXIuY29tcGlsZShjb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXJ0TmV3R2FtZSgpe1xyXG4gICAgICAgIHRoaXMucnVudGltZU91dHB1dFBhbmUuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWVMb2dPdXRwdXRQYW5lLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIHRoaXMucnVudGltZS5zdG9wKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJ1bnRpbWUubG9hZEZyb20odGhpcy5jb21waWxlZFR5cGVzKSl7XHJcbiAgICAgICAgICAgIHRoaXMucnVudGltZS5zdGFydCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIG9wZW5Db2RlRmlsZShldmVudDpFdmVudCl7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgdHlwZXM6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogVGFsb25JZGUuVGFsb25Db2RlRmlsZURlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgYWNjZXB0OiB7XHJcbiAgICAgICAgICAgICAgICAgICd0ZXh0L3BsYWluJzogW1RhbG9uSWRlLlRhbG9uQ29kZUZpbGVFeHRlbnNpb25dXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgZXhjbHVkZUFjY2VwdEFsbE9wdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgbXVsdGlwbGU6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlcyA9IGF3YWl0ICh3aW5kb3cgYXMgYW55KS5zaG93T3BlbkZpbGVQaWNrZXIob3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgZmlsZSA9IGF3YWl0IGhhbmRsZXNbMF0uZ2V0RmlsZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNvZGVQYW5lLmlubmVyVGV4dCA9IGF3YWl0IGZpbGUudGV4dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgc2F2ZUNvZGVGaWxlKGNvbnRlbnRzOnN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHR5cGVzOiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFRhbG9uSWRlLlRhbG9uQ29kZUZpbGVEZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgICAgIGFjY2VwdDoge1xyXG4gICAgICAgICAgICAgICAgICAndGV4dC9wbGFpbic6IFtUYWxvbklkZS5UYWxvbkNvZGVGaWxlRXh0ZW5zaW9uXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9O1xyXG4gIFxyXG4gICAgICAgIGNvbnN0IGZpbGVIYW5kbGUgPSBhd2FpdCAod2luZG93IGFzIGFueSkuc2hvd1NhdmVGaWxlUGlja2VyKG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHdyaXRhYmxlID0gYXdhaXQgKGZpbGVIYW5kbGUgYXMgYW55KS5jcmVhdGVXcml0YWJsZSgpO1xyXG4gICAgICAgIGF3YWl0IHdyaXRhYmxlLndyaXRlKGNvbnRlbnRzKTtcclxuICAgICAgICBhd2FpdCB3cml0YWJsZS5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9hZEV4YW1wbGUoKXtcclxuICAgICAgICB0aGlzLmNvZGVQYW5lLmlubmVyVGV4dCA9IFxyXG4gICAgICAgICAgICBcInNheSBcXFwiVGhpcyBpcyB0aGUgc3RhcnQuXFxcIi5cXG5cXG5cIiArXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcImxvb2tcXFwiIGFzIGRlc2NyaWJpbmcuIFxcblwiICtcclxuICAgICAgICAgICAgXCJ1bmRlcnN0YW5kIFxcXCJub3J0aFxcXCIgYXMgZGlyZWN0aW9ucy4gXFxuXCIgK1xyXG4gICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcInNvdXRoXFxcIiBhcyBkaXJlY3Rpb25zLlxcblwiICtcclxuICAgICAgICAgICAgXCJ1bmRlcnN0YW5kIFxcXCJnb1xcXCIgYXMgbW92aW5nLiBcXG5cIiArXHJcbiAgICAgICAgICAgIFwidW5kZXJzdGFuZCBcXFwidGFrZVxcXCIgYXMgdGFraW5nLiBcXG5cIiArXHJcbiAgICAgICAgICAgIFwidW5kZXJzdGFuZCBcXFwiaW52XFxcIiBhcyBpbnZlbnRvcnkuIFxcblwiICtcclxuICAgICAgICAgICAgXCJ1bmRlcnN0YW5kIFxcXCJkcm9wXFxcIiBhcyBkcm9wcGluZy4gXFxuXFxuXCIgK1xyXG5cclxuICAgICAgICAgICAgXCJhbiBJbm4gaXMgYSBraW5kIG9mIHBsYWNlLiBcXG5cIiArXHJcbiAgICAgICAgICAgIFwiaXQgaXMgd2hlcmUgdGhlIHBsYXllciBzdGFydHMuIFxcblwiICtcclxuICAgICAgICAgICAgXCJpdCBpcyBkZXNjcmliZWQgYXMgXFxcIlRoZSBpbm4gaXMgYSBjb3p5IHBsYWNlLCB3aXRoIGEgY3JhY2tsaW5nIGZpcmUgb24gdGhlIGhlYXJ0aC4gVGhlIGJhcnRlbmRlciBpcyBiZWhpbmQgdGhlIGJhci4gQW4gb3BlbiBkb29yIHRvIHRoZSBub3J0aCBsZWFkcyBvdXRzaWRlLlxcXCIgXFxuXCIgK1xyXG4gICAgICAgICAgICBcIiAgICBhbmQgaWYgaXQgY29udGFpbnMgMSBDb2luIHRoZW4gXFxcIlRoZXJlJ3MgYWxzbyBhIGNvaW4gaGVyZS5cXFwiOyBvciBlbHNlIFxcXCJUaGVyZSBpcyBqdXN0IGR1c3QuXFxcIjsgYW5kIHRoZW4gY29udGludWUuXFxuXCIgK1xyXG4gICAgICAgICAgICBcIml0IGNvbnRhaW5zIDEgQ29pbiwgMSBGaXJlcGxhY2UuXFxuXCIgKyBcclxuICAgICAgICAgICAgXCJpdCBjYW4gcmVhY2ggdGhlIFdhbGt3YXkgYnkgZ29pbmcgXFxcIm5vcnRoXFxcIi4gXFxuXCIgK1xyXG4gICAgICAgICAgICBcIml0IGhhcyBhIHZhbHVlIHRoYXQgaXMgZmFsc2UuIFxcblwiICtcclxuICAgICAgICAgICAgXCJ3aGVuIHRoZSBwbGF5ZXIgZXhpdHM6IFxcblwiICtcclxuICAgICAgICAgICAgXCIgICAgaWYgdmFsdWUgaXMgZmFsc2UgdGhlbiBcXG5cIiArXHJcbiAgICAgICAgICAgIFwiICAgICAgICBzYXkgXFxcIlRoZSBiYXJ0ZW5kZXIgd2F2ZXMgZ29vZGJ5ZS5cXFwiOyBcXG5cIiArXHJcbiAgICAgICAgICAgIFwiICAgIG9yIGVsc2UgXFxuXCIgK1xyXG4gICAgICAgICAgICBcIiAgICAgICAgc2F5IFxcXCJUaGUgYmFydGVuZGVyIGNsZWFucyB0aGUgYmFyLlxcXCI7IFxcblwiICtcclxuICAgICAgICAgICAgXCIgICAgYW5kIHRoZW4gY29udGludWU7XFxuXCIgK1xyXG4gICAgICAgICAgICBcIiAgICBzZXQgdmFsdWUgdG8gdHJ1ZTsgXFxuXCIgK1xyXG4gICAgICAgICAgICBcImFuZCB0aGVuIHN0b3AuIFxcblxcblwiICtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFwiYSBGaXJlcGxhY2UgaXMgYSBraW5kIG9mIGRlY29yYXRpb24uIFxcblwiICtcclxuICAgICAgICAgICAgXCJpdCBpcyBkZXNjcmliZWQgYXMgXFxcIlRoZSBmaXJlcGxhY2UgY3JhY2tsZXMuIEl0J3MgZnVsbCBvZiBmaXJlLlxcXCIuIFxcblxcblwiICtcclxuXHJcbiAgICAgICAgICAgIFwiYSBXYWxrd2F5IGlzIGEga2luZCBvZiBwbGFjZS4gXFxuXCIgK1xyXG4gICAgICAgICAgICBcIml0IGlzIGRlc2NyaWJlZCBhcyBcXFwiVGhlIHdhbGt3YXkgaW4gZnJvbnQgb2YgdGhlIGlubiBpcyBlbXB0eSwganVzdCBhIGNvYmJsZXN0b25lIGVudHJhbmNlLiBUaGUgaW5uIGlzIHRvIHRoZSBzb3V0aC5cXFwiLiBcXG5cIiArXHJcbiAgICAgICAgICAgIFwiaXQgY2FuIHJlYWNoIHRoZSBJbm4gYnkgZ29pbmcgXFxcInNvdXRoXFxcIi4gXFxuXCIgK1xyXG4gICAgICAgICAgICBcIndoZW4gdGhlIHBsYXllciBlbnRlcnM6XFxuXCIgK1xyXG4gICAgICAgICAgICBcIiAgICBzYXkgXFxcIllvdSB3YWxrIG9udG8gdGhlIGNvYmJsZXN0b25lcy4gVGhleSdyZSBuaWNlLCBpZiB5b3UgbGlrZSB0aGF0IHNvcnQgb2YgdGhpbmcuXFxcIjsgXFxuXCIgK1xyXG4gICAgICAgICAgICBcIiAgICBzYXkgXFxcIlRoZXJlJ3Mgbm9ib2R5IGFyb3VuZC4gVGhlIHdpbmQgd2hpc3RsZXMgYSBsaXR0bGUgYml0LlxcXCI7IFxcblwiICtcclxuICAgICAgICAgICAgXCJhbmQgdGhlbiBzdG9wLiBcXG5cXG5cIiArXHJcblxyXG4gICAgICAgICAgICBcInNheSBcXFwiVGhpcyBpcyB0aGUgbWlkZGxlLlxcXCIuXFxuXFxuXCIgK1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXCJhIENvaW4gaXMgYSBraW5kIG9mIGl0ZW0uIFxcblwiICtcclxuICAgICAgICAgICAgXCJpdCBpcyBkZXNjcmliZWQgYXMgXFxcIkl0J3MgYSBzbWFsbCBjb2luLlxcXCIuXFxuXFxuXCIgK1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXCJzYXkgXFxcIlRoaXMgaXMgdGhlIGVuZC5cXFwiLlxcblwiO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gRXZlbnRUeXBle1xyXG4gICAgTm9uZSxcclxuICAgIFBsYXllckVudGVyc1BsYWNlLFxyXG4gICAgUGxheWVyRXhpdHNQbGFjZVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuL1R5cGVcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4vTWV0aG9kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRmllbGR7XHJcbiAgICBuYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICB0eXBlTmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgdHlwZT86VHlwZTtcclxuICAgIGRlZmF1bHRWYWx1ZT86T2JqZWN0O1xyXG59IiwiaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdHJ1Y3Rpb257XHJcbiAgICBzdGF0aWMgYXNzaWduKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuQXNzaWduKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY29tcGFyZUVxdWFsKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuQ29tcGFyZUVxdWFsKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaW52b2tlRGVsZWdhdGUoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5JbnZva2VEZWxlZ2F0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGlzVHlwZU9mKHR5cGVOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuVHlwZU9mLCB0eXBlTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWROdW1iZXIodmFsdWU6bnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkTnVtYmVyLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRCb29sZWFuKHZhbHVlOmJvb2xlYW4pe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRCb29sZWFuLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRTdHJpbmcodmFsdWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkU3RyaW5nLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRJbnN0YW5jZSh0eXBlTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRJbnN0YW5jZSwgdHlwZU5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkRmllbGQoZmllbGROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZEZpZWxkLCBmaWVsZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkUHJvcGVydHkoZmllbGROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZFByb3BlcnR5LCBmaWVsZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkTG9jYWwobG9jYWxOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZExvY2FsLCBsb2NhbE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkVGhpcygpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRUaGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaW5zdGFuY2VDYWxsKG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5JbnN0YW5jZUNhbGwsIG1ldGhvZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb25jYXRlbmF0ZSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkNvbmNhdGVuYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3RhdGljQ2FsbCh0eXBlTmFtZTpzdHJpbmcsIG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5TdGF0aWNDYWxsLCBgJHt0eXBlTmFtZX0uJHttZXRob2ROYW1lfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBleHRlcm5hbENhbGwobWV0aG9kTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkV4dGVybmFsQ2FsbCwgbWV0aG9kTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHByaW50KCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuUHJpbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZXR1cm4oKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5SZXR1cm4pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZWFkSW5wdXQoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5SZWFkSW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwYXJzZUNvbW1hbmQoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5QYXJzZUNvbW1hbmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBoYW5kbGVDb21tYW5kKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuSGFuZGxlQ29tbWFuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdvVG8obGluZU51bWJlcjpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkdvVG8sIGxpbmVOdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBicmFuY2hSZWxhdGl2ZShjb3VudDpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkJyYW5jaFJlbGF0aXZlLCBjb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGJyYW5jaFJlbGF0aXZlSWZGYWxzZShjb3VudDpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkJyYW5jaFJlbGF0aXZlSWZGYWxzZSwgY291bnQpO1xyXG4gICAgfVxyXG5cclxuICAgIG9wQ29kZTpPcENvZGUgPSBPcENvZGUuTm9PcDtcclxuICAgIHZhbHVlPzpPYmplY3Q7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3BDb2RlOk9wQ29kZSwgdmFsdWU/Ok9iamVjdCl7XHJcbiAgICAgICAgdGhpcy5vcENvZGUgPSBvcENvZGU7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUGFyYW1ldGVyIH0gZnJvbSBcIi4vUGFyYW1ldGVyXCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vcnVudGltZS9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IEV2ZW50VHlwZSB9IGZyb20gXCIuL0V2ZW50VHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1ldGhvZHtcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHBhcmFtZXRlcnM6UGFyYW1ldGVyW10gPSBbXTtcclxuICAgIGFjdHVhbFBhcmFtZXRlcnM6VmFyaWFibGVbXSA9IFtdO1xyXG4gICAgYm9keTpJbnN0cnVjdGlvbltdID0gW107XHJcbiAgICByZXR1cm5UeXBlOnN0cmluZyA9IFwiXCI7XHJcbiAgICBldmVudFR5cGU6RXZlbnRUeXBlID0gRXZlbnRUeXBlLk5vbmU7XHJcbn0iLCJleHBvcnQgZW51bSBPcENvZGUge1xyXG4gICAgTm9PcCA9ICcubm9vcCcsXHJcbiAgICBBc3NpZ24gPSAnLnNldC52YXInLFxyXG4gICAgQ29tcGFyZUVxdWFsID0gXCIuY29tcGFyZS5lcVwiLFxyXG4gICAgUHJpbnQgPSAnLnByaW50JyxcclxuICAgIExvYWRTdHJpbmcgPSAnLmxvYWQuc3RyJyxcclxuICAgIE5ld0luc3RhbmNlID0gJy5uZXcnLFxyXG4gICAgUGFyc2VDb21tYW5kID0gJy5wYXJzZS5jbWQnLFxyXG4gICAgSGFuZGxlQ29tbWFuZCA9ICcuaGFuZGxlLmNtZCcsXHJcbiAgICBSZWFkSW5wdXQgPSAnLnJlYWQuaW4nLFxyXG4gICAgR29UbyA9ICcuYnInLFxyXG4gICAgUmV0dXJuID0gJy5yZXQnLFxyXG4gICAgQnJhbmNoUmVsYXRpdmUgPSAnLmJyLnJlbCcsXHJcbiAgICBCcmFuY2hSZWxhdGl2ZUlmRmFsc2UgPSAnLmJyLnJlbC5mYWxzZScsXHJcbiAgICBDb25jYXRlbmF0ZSA9ICcuY29uY2F0JyxcclxuICAgIExvYWROdW1iZXIgPSAnLmxvYWQubnVtJyxcclxuICAgIExvYWRGaWVsZCA9ICcubG9hZC5mbGQnLFxyXG4gICAgTG9hZFByb3BlcnR5ID0gJy5sb2FkLnByb3AnLFxyXG4gICAgTG9hZEluc3RhbmNlID0gJy5sb2FkLmluc3QnLFxyXG4gICAgTG9hZExvY2FsID0gJy5sb2FkLmxvYycsXHJcbiAgICBMb2FkVGhpcyA9ICcubG9hZC50aGlzJyxcclxuICAgIEluc3RhbmNlQ2FsbCA9ICcuY2FsbC5pbnN0JyxcclxuICAgIFN0YXRpY0NhbGwgPSAnLmNhbGwuc3RhdGljJyxcclxuICAgIEV4dGVybmFsQ2FsbCA9ICcuY2FsbC5leHRlcm4nLFxyXG4gICAgVHlwZU9mID0gJy50eXBlb2YnLFxyXG4gICAgSW52b2tlRGVsZWdhdGUgPSAnLmNhbGwuZnVuYycsXHJcbiAgICBMb2FkQm9vbGVhbiA9IFwiLmxvYWQuYm9vbFwiXHJcbn0iLCJpbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhcmFtZXRlcntcclxuICAgIFxyXG4gICAgdHlwZT86VHlwZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbmFtZTpzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdHlwZU5hbWU6c3RyaW5nKXtcclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuL0ZpZWxkXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBBdHRyaWJ1dGUgfSBmcm9tIFwiLi9BdHRyaWJ1dGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBleyAgICAgIFxyXG4gICAgZmllbGRzOkZpZWxkW10gPSBbXTtcclxuICAgIG1ldGhvZHM6TWV0aG9kW10gPSBbXTsgXHJcbiAgICBhdHRyaWJ1dGVzOkF0dHJpYnV0ZVtdID0gW107XHJcblxyXG4gICAgZ2V0IGlzU3lzdGVtVHlwZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUuc3RhcnRzV2l0aChcIn5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzQW5vbnltb3VzVHlwZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUuc3RhcnRzV2l0aChcIjx+PlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTpzdHJpbmcsIHB1YmxpYyBiYXNlVHlwZU5hbWU6c3RyaW5nKXtcclxuXHJcbiAgICB9ICAgIFxyXG59IiwiZXhwb3J0IGNsYXNzIFZlcnNpb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbWFqb3I6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IG1pbm9yOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBwYXRjaDpudW1iZXIpe1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMubWFqb3J9LiR7dGhpcy5taW5vcn0uJHt0aGlzLnBhdGNofWA7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuLi9jb21tb24vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgRW50cnlQb2ludEF0dHJpYnV0ZSB9IGZyb20gXCIuLi9saWJyYXJ5L0VudHJ5UG9pbnRBdHRyaWJ1dGVcIjtcclxuaW1wb3J0IHsgVGFsb25MZXhlciB9IGZyb20gXCIuL2xleGluZy9UYWxvbkxleGVyXCI7XHJcbmltcG9ydCB7IFRhbG9uUGFyc2VyIH0gZnJvbSBcIi4vcGFyc2luZy9UYWxvblBhcnNlclwiO1xyXG5pbXBvcnQgeyBUYWxvblNlbWFudGljQW5hbHl6ZXIgfSBmcm9tIFwiLi9zZW1hbnRpY3MvVGFsb25TZW1hbnRpY0FuYWx5emVyXCI7XHJcbmltcG9ydCB7IFRhbG9uVHJhbnNmb3JtZXIgfSBmcm9tIFwiLi90cmFuc2Zvcm1pbmcvVGFsb25UcmFuc2Zvcm1lclwiO1xyXG5pbXBvcnQgeyBWZXJzaW9uIH0gZnJvbSBcIi4uL2NvbW1vbi9WZXJzaW9uXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgRGVsZWdhdGUgfSBmcm9tIFwiLi4vbGlicmFyeS9EZWxlZ2F0ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uQ29tcGlsZXJ7XHJcbiAgICBnZXQgbGFuZ3VhZ2VWZXJzaW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZXJzaW9uKDEsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB2ZXJzaW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZXJzaW9uKDEsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgb3V0OklPdXRwdXQpe1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBpbGUoY29kZTpzdHJpbmcpOlR5cGVbXXtcclxuICAgICAgICB0aGlzLm91dC53cml0ZShcIjxzdHJvbmc+U3RhcnRpbmcgY29tcGlsYXRpb24uLi48L3N0cm9uZz5cIik7XHJcblxyXG4gICAgICAgIHRyeXtcclxuICAgICAgICAgICAgY29uc3QgbGV4ZXIgPSBuZXcgVGFsb25MZXhlcih0aGlzLm91dCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBUYWxvblBhcnNlcih0aGlzLm91dCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuYWx5emVyID0gbmV3IFRhbG9uU2VtYW50aWNBbmFseXplcih0aGlzLm91dCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gbmV3IFRhbG9uVHJhbnNmb3JtZXIodGhpcy5vdXQpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdG9rZW5zID0gbGV4ZXIudG9rZW5pemUoY29kZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IHBhcnNlci5wYXJzZSh0b2tlbnMpO1xyXG4gICAgICAgICAgICBjb25zdCBhbmFseXplZEFzdCA9IGFuYWx5emVyLmFuYWx5emUoYXN0KTtcclxuICAgICAgICAgICAgY29uc3QgdHlwZXMgPSB0cmFuc2Zvcm1lci50cmFuc2Zvcm0oYW5hbHl6ZWRBc3QpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZW50cnlQb2ludCA9IHRoaXMuY3JlYXRlRW50cnlQb2ludCgpO1xyXG5cclxuICAgICAgICAgICAgdHlwZXMucHVzaChlbnRyeVBvaW50KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlcztcclxuICAgICAgICB9IGNhdGNoKGV4KXtcclxuICAgICAgICAgICAgaWYgKGV4IGluc3RhbmNlb2YgQ29tcGlsYXRpb25FcnJvcil7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm91dC53cml0ZShgPGVtPkVycm9yOiAke2V4Lm1lc3NhZ2V9PC9lbT5gKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3V0LndyaXRlKGA8ZW0+VW5oYW5kbGVkIEVycm9yOiAke2V4fTwvZW0+YCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9IGZpbmFsbHl7XHJcbiAgICAgICAgICAgIHRoaXMub3V0LndyaXRlKFwiPHN0cm9uZz5Db21waWxhdGlvbiBjb21wbGV0ZS48L3N0cm9uZz5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlRW50cnlQb2ludCgpe1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBuZXcgVHlwZShcIn5nYW1lXCIsIEFueS50eXBlTmFtZSk7XHJcblxyXG4gICAgICAgIHR5cGUuYXR0cmlidXRlcy5wdXNoKG5ldyBFbnRyeVBvaW50QXR0cmlidXRlKCkpO1xyXG5cclxuICAgICAgICBjb25zdCBtYWluID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgIG1haW4ubmFtZSA9IEFueS5tYWluO1xyXG4gICAgICAgIG1haW4uYm9keS5wdXNoKFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGBUYWxvbiBMYW5ndWFnZSB2LiR7dGhpcy5sYW5ndWFnZVZlcnNpb259LCBDb21waWxlciB2LiR7dGhpcy52ZXJzaW9ufWApLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLCAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIlwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uc3RhdGljQ2FsbChcIn5nbG9iYWxTYXlzXCIsIFwifnNheVwiKSwgICAgICAgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiV2hhdCB3b3VsZCB5b3UgbGlrZSB0byBkbz9cIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnJlYWRJbnB1dCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wYXJzZUNvbW1hbmQoKSwgICAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmhhbmRsZUNvbW1hbmQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uaXNUeXBlT2YoRGVsZWdhdGUudHlwZU5hbWUpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5icmFuY2hSZWxhdGl2ZUlmRmFsc2UoMiksICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmludm9rZURlbGVnYXRlKCksICAgICAgICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmUoLTQpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5nb1RvKDkpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdHlwZS5tZXRob2RzLnB1c2gobWFpbik7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENvbXBpbGF0aW9uRXJyb3J7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG1lc3NhZ2U6c3RyaW5nKXtcclxuXHJcbiAgICB9XHJcbn0iLCJpbnRlcmZhY2UgSW5kZXhhYmxle1xyXG4gICAgW2tleTpzdHJpbmddOmFueTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEtleXdvcmRze1xyXG4gICAgXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYW4gPSBcImFuXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYSA9IFwiYVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRoZSA9IFwidGhlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaXMgPSBcImlzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkga2luZCA9IFwia2luZFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG9mID0gXCJvZlwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBsYWNlID0gXCJwbGFjZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGl0ZW0gPSBcIml0ZW1cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpdCA9IFwiaXRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBoYXMgPSBcImhhc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGlmID0gXCJpZlwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRlc2NyaXB0aW9uID0gXCJkZXNjcmlwdGlvblwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHVuZGVyc3RhbmQgPSBcInVuZGVyc3RhbmRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBhcyA9IFwiYXNcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZXNjcmliaW5nID0gXCJkZXNjcmliaW5nXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGVzY3JpYmVkID0gXCJkZXNjcmliZWRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB3aGVyZSA9IFwid2hlcmVcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwbGF5ZXIgPSBcInBsYXllclwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHN0YXJ0cyA9IFwic3RhcnRzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY29udGFpbnMgPSBcImNvbnRhaW5zXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc2F5ID0gXCJzYXlcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkaXJlY3Rpb25zID0gXCJkaXJlY3Rpb25zXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgbW92aW5nID0gXCJtb3ZpbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0YWtpbmcgPSBcInRha2luZ1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGludmVudG9yeSA9IFwiaW52ZW50b3J5XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY2FuID0gXCJjYW5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSByZWFjaCA9IFwicmVhY2hcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBieSA9IFwiYnlcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBnb2luZyA9IFwiZ29pbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBhbmQgPSBcImFuZFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG9yID0gXCJvclwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRoZW4gPSBcInRoZW5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBlbHNlID0gXCJlbHNlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgd2hlbiA9IFwid2hlblwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGVudGVycyA9IFwiZW50ZXJzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZXhpdHMgPSBcImV4aXRzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc3RvcCA9IFwic3RvcFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRyb3BwaW5nID0gXCJkcm9wcGluZ1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRoYXQgPSBcInRoYXRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBzZXQgPSBcInNldFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRvID0gXCJ0b1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRlY29yYXRpb24gPSBcImRlY29yYXRpb25cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB2aXNpYmxlID0gXCJ2aXNpYmxlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgbm90ID0gXCJub3RcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBvYnNlcnZlZCA9IFwib2JzZXJ2ZWRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBjb250aW51ZSA9IFwiY29udGludWVcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0cnVlID0gXCJ0cnVlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZmFsc2UgPSBcImZhbHNlXCI7XHJcblxyXG4gICAgc3RhdGljIGdldEFsbCgpOlNldDxzdHJpbmc+e1xyXG4gICAgICAgIHR5cGUgS2V5d29yZFByb3BlcnRpZXMgPSBrZXlvZiBLZXl3b3JkcztcclxuXHJcbiAgICAgICAgY29uc3QgYWxsS2V5d29yZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhLZXl3b3Jkcyk7XHJcblxyXG4gICAgICAgIGZvcihsZXQga2V5d29yZCBvZiBuYW1lcyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gKEtleXdvcmRzIGFzIEluZGV4YWJsZSlba2V5d29yZF07XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmIHZhbHVlICE9IFwiS2V5d29yZHNcIil7XHJcbiAgICAgICAgICAgICAgICBhbGxLZXl3b3Jkcy5hZGQodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYWxsS2V5d29yZHM7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgUHVuY3R1YXRpb257XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGVyaW9kID0gXCIuXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY29sb24gPSBcIjpcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBzZW1pY29sb24gPSBcIjtcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBjb21tYSA9IFwiLFwiO1xyXG59IiwiaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi9Ub2tlblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFB1bmN0dWF0aW9uIH0gZnJvbSBcIi4vUHVuY3R1YXRpb25cIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25MZXhlcntcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGFsbEtleXdvcmRzID0gS2V5d29yZHMuZ2V0QWxsKCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXQ6SU91dHB1dCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRva2VuaXplKGNvZGU6c3RyaW5nKTpUb2tlbltde1xyXG4gICAgICAgIGxldCBjdXJyZW50TGluZSA9IDE7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRDb2x1bW4gPSAxO1xyXG5cclxuICAgICAgICBjb25zdCB0b2tlbnM6VG9rZW5bXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb2RlLmxlbmd0aDsgKXtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSBjb2RlLmNoYXJBdChpbmRleCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gXCIgXCIpe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvbHVtbisrO1xyXG4gICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gXCJcXG5cIil7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29sdW1uID0gMTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lKys7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB0b2tlblZhbHVlID0gdGhpcy5jb25zdW1lVG9rZW5DaGFyc0F0KGNvZGUsIGluZGV4KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0b2tlblZhbHVlLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBuZXcgVG9rZW4oY3VycmVudExpbmUsIGN1cnJlbnRDb2x1bW4sIHRva2VuVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50Q29sdW1uICs9IHRva2VuVmFsdWUubGVuZ3RoO1xyXG4gICAgICAgICAgICBpbmRleCArPSB0b2tlblZhbHVlLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzaWZ5KHRva2Vucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGFzc2lmeSh0b2tlbnM6VG9rZW5bXSk6VG9rZW5bXXtcclxuICAgICAgICBmb3IobGV0IHRva2VuIG9mIHRva2Vucyl7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PSBQdW5jdHVhdGlvbi5wZXJpb2Qpe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5UZXJtaW5hdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlID09IFB1bmN0dWF0aW9uLnNlbWljb2xvbil7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLlNlbWlUZXJtaW5hdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlID09IFB1bmN0dWF0aW9uLmNvbG9uKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuT3Blbk1ldGhvZEJsb2NrO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlID09IFB1bmN0dWF0aW9uLmNvbW1hKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuTGlzdFNlcGFyYXRvcjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbi52YWx1ZSA9PT0gS2V5d29yZHMudHJ1ZSB8fCB0b2tlbi52YWx1ZSA9PT0gS2V5d29yZHMuZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5Cb29sZWFuO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFRhbG9uTGV4ZXIuYWxsS2V5d29yZHMuaGFzKHRva2VuLnZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLktleXdvcmQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4udmFsdWUuc3RhcnRzV2l0aChcIlxcXCJcIikgJiYgdG9rZW4udmFsdWUuZW5kc1dpdGgoXCJcXFwiXCIpKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuU3RyaW5nO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFpc05hTihOdW1iZXIodG9rZW4udmFsdWUpKSkge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5OdW1iZXI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLklkZW50aWZpZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0b2tlbnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb25zdW1lVG9rZW5DaGFyc0F0KGNvZGU6c3RyaW5nLCBpbmRleDpudW1iZXIpOnN0cmluZ3tcclxuICAgICAgICBjb25zdCB0b2tlbkNoYXJzOnN0cmluZ1tdID0gW107XHJcbiAgICAgICAgY29uc3Qgc3RyaW5nRGVsaW1pdGVyID0gXCJcXFwiXCI7XHJcblxyXG4gICAgICAgIGxldCBpc0NvbnN1bWluZ1N0cmluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IobGV0IHJlYWRBaGVhZEluZGV4ID0gaW5kZXg7IHJlYWRBaGVhZEluZGV4IDwgY29kZS5sZW5ndGg7IHJlYWRBaGVhZEluZGV4Kyspe1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IGNvZGUuY2hhckF0KHJlYWRBaGVhZEluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpc0NvbnN1bWluZ1N0cmluZyAmJiBjdXJyZW50Q2hhciAhPSBzdHJpbmdEZWxpbWl0ZXIpe1xyXG4gICAgICAgICAgICAgICAgdG9rZW5DaGFycy5wdXNoKGN1cnJlbnRDaGFyKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gc3RyaW5nRGVsaW1pdGVyKXsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0b2tlbkNoYXJzLnB1c2goY3VycmVudENoYXIpOyAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICBpc0NvbnN1bWluZ1N0cmluZyA9ICFpc0NvbnN1bWluZ1N0cmluZztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNDb25zdW1pbmdTdHJpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q2hhciA9PSBcIiBcIiB8fCBcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDaGFyID09IFwiXFxuXCIgfHwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q2hhciA9PSBQdW5jdHVhdGlvbi5wZXJpb2QgfHwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q2hhciA9PSBQdW5jdHVhdGlvbi5jb2xvbiB8fCBcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDaGFyID09IFB1bmN0dWF0aW9uLnNlbWljb2xvbiB8fFxyXG4gICAgICAgICAgICAgICAgY3VycmVudENoYXIgPT0gUHVuY3R1YXRpb24uY29tbWEpe1xyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuQ2hhcnMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuQ2hhcnMucHVzaChjdXJyZW50Q2hhcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdG9rZW5DaGFycy5wdXNoKGN1cnJlbnRDaGFyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0b2tlbkNoYXJzLmpvaW4oXCJcIik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9JdGVtXCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IERlY29yYXRpb24gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9EZWNvcmF0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVG9rZW57XHJcbiAgICBzdGF0aWMgZ2V0IGVtcHR5KCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihcIn5lbXB0eVwiLCBUb2tlblR5cGUuVW5rbm93bik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JBbnkoKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKEFueS50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yUGxhY2UoKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKFBsYWNlLnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JJdGVtKCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihJdGVtLnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JEZWNvcmF0aW9uKCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihEZWNvcmF0aW9uLnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JXb3JsZE9iamVjdCgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoV29ybGRPYmplY3QudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvckJvb2xlYW4oKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKEJvb2xlYW5UeXBlLnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JMaXN0KCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihMaXN0LnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0VG9rZW5XaXRoVHlwZU9mKG5hbWU6c3RyaW5nLCB0eXBlOlRva2VuVHlwZSl7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBuZXcgVG9rZW4oLTEsLTEsbmFtZSk7XHJcbiAgICAgICAgdG9rZW4udHlwZSA9IHR5cGU7XHJcbiAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgfVxyXG5cclxuICAgIHR5cGU6VG9rZW5UeXBlID0gVG9rZW5UeXBlLlVua25vd247XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGxpbmU6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGNvbHVtbjpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdmFsdWU6c3RyaW5nKXtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLmxpbmV9LCAke3RoaXMuY29sdW1ufTogRm91bmQgdG9rZW4gJyR7dGhpcy52YWx1ZX0nIG9mIHR5cGUgJyR7dGhpcy50eXBlfSdgO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gVG9rZW5UeXBlIHtcclxuICAgIFVua25vd24gPSAnVW5rbm93bicsXHJcbiAgICBLZXl3b3JkID0gJ0tleXdvcmQnLFxyXG4gICAgVGVybWluYXRvciA9ICdUZXJtaW5hdG9yJyxcclxuICAgIFNlbWlUZXJtaW5hdG9yID0gJ1NlbWlUZXJtaW5hdG9yJyxcclxuICAgIFN0cmluZyA9ICdTdHJpbmcnLFxyXG4gICAgSWRlbnRpZmllciA9ICdJZGVudGlmaWVyJyxcclxuICAgIE51bWJlciA9ICdOdW1iZXInLFxyXG4gICAgQm9vbGVhbiA9IFwiQm9vbGVhblwiLFxyXG4gICAgT3Blbk1ldGhvZEJsb2NrID0gJ09wZW5NZXRob2RCbG9jaycsXHJcbiAgICBMaXN0U2VwYXJhdG9yID0gJ0xpc3RTZXBhcmF0b3InXHJcbn0iLCJpbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5cIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uL2xleGluZy9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi8uLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJzZUNvbnRleHR7XHJcbiAgICBpbmRleDpudW1iZXIgPSAwO1xyXG5cclxuICAgIGdldCBpc0RvbmUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleCA+PSB0aGlzLnRva2Vucy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnJlbnRUb2tlbigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmluZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbmV4dFRva2VuKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuaW5kZXggKyAxXTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHRva2VuczpUb2tlbltdLCBwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuICAgICAgICB0aGlzLm91dC53cml0ZShgJHt0b2tlbnMubGVuZ3RofSB0b2tlbnMgZGlzY292ZXJlZCwgcGFyc2luZy4uLmApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN1bWVDdXJyZW50VG9rZW4oKXtcclxuICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMuY3VycmVudFRva2VuO1xyXG5cclxuICAgICAgICB0aGlzLmluZGV4Kys7XHJcblxyXG4gICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH1cclxuXHJcbiAgICBpcyh0b2tlblZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRva2VuPy52YWx1ZSA9PSB0b2tlblZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzRm9sbG93ZWRCeSh0b2tlblZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dFRva2VuPy52YWx1ZSA9PSB0b2tlblZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVHlwZU9mKHR5cGU6VG9rZW5UeXBlKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VG9rZW4udHlwZSA9PSB0eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQW55VHlwZU9mKC4uLnR5cGVzOlRva2VuVHlwZVtdKXtcclxuICAgICAgICBmb3IoY29uc3QgdHlwZSBvZiB0eXBlcyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVHlwZU9mKHR5cGUpKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaXNBbnlPZiguLi50b2tlblZhbHVlczpzdHJpbmdbXSl7XHJcbiAgICAgICAgZm9yKGxldCB2YWx1ZSBvZiB0b2tlblZhbHVlcyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzKHZhbHVlKSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVGVybWluYXRvcigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUb2tlbi50eXBlID09IFRva2VuVHlwZS5UZXJtaW5hdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdEFueU9mKC4uLnRva2VuVmFsdWVzOnN0cmluZ1tdKXtcclxuICAgICAgICBpZiAoIXRoaXMuaXNBbnlPZiguLi50b2tlblZhbHVlcykpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIHRva2Vuc1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdCh0b2tlblZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRva2VuLnZhbHVlICE9IHRva2VuVmFsdWUpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgRXhwZWN0ZWQgdG9rZW4gJyR7dG9rZW5WYWx1ZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0U3RyaW5nKCl7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLmV4cGVjdEFuZENvbnN1bWUoVG9rZW5UeXBlLlN0cmluZywgXCJFeHBlY3RlZCBzdHJpbmdcIik7XHJcblxyXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gc3RyaXAgb2ZmIHRoZSBkb3VibGUgcXVvdGVzIGZyb20gdGhlaXIgc3RyaW5nIGFmdGVyIHdlIGNvbnN1bWUgaXQuXHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG5ldyBUb2tlbih0b2tlbi5saW5lLCB0b2tlbi5jb2x1bW4sIHRva2VuLnZhbHVlLnN1YnN0cmluZygxLCB0b2tlbi52YWx1ZS5sZW5ndGggLSAxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0TnVtYmVyKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwZWN0QW5kQ29uc3VtZShUb2tlblR5cGUuTnVtYmVyLCBcIkV4cGVjdGVkIG51bWJlclwiKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RCb29sZWFuKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwZWN0QW5kQ29uc3VtZShUb2tlblR5cGUuQm9vbGVhbiwgXCJFeHBlY3RlZCBib29sZWFuXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdElkZW50aWZpZXIoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5leHBlY3RBbmRDb25zdW1lKFRva2VuVHlwZS5JZGVudGlmaWVyLCBcIkV4cGVjdGVkIGlkZW50aWZpZXJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0VGVybWluYXRvcigpe1xyXG4gICAgICAgIHRoaXMuZXhwZWN0QW5kQ29uc3VtZShUb2tlblR5cGUuVGVybWluYXRvciwgXCJFeHBlY3RlZCBleHByZXNzaW9uIHRlcm1pbmF0b3JcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0U2VtaVRlcm1pbmF0b3IoKXtcclxuICAgICAgICB0aGlzLmV4cGVjdEFuZENvbnN1bWUoVG9rZW5UeXBlLlNlbWlUZXJtaW5hdG9yLCBcIkV4cGVjdGVkIHNlbWkgZXhwcmVzc2lvbiB0ZXJtaW5hdG9yXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdE9wZW5NZXRob2RCbG9jaygpe1xyXG4gICAgICAgIHRoaXMuZXhwZWN0QW5kQ29uc3VtZShUb2tlblR5cGUuT3Blbk1ldGhvZEJsb2NrLCBcIkV4cGVjdGVkIG9wZW4gbWV0aG9kIGJsb2NrXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZXhwZWN0QW5kQ29uc3VtZSh0b2tlblR5cGU6VG9rZW5UeXBlLCBlcnJvck1lc3NhZ2U6c3RyaW5nKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9rZW4udHlwZSAhPSB0b2tlblR5cGUpe1xyXG4gICAgICAgICAgICB0aHJvdyB0aGlzLmNyZWF0ZUNvbXBpbGF0aW9uRXJyb3JGb3JDdXJyZW50VG9rZW4oZXJyb3JNZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUNvbXBpbGF0aW9uRXJyb3JGb3JDdXJyZW50VG9rZW4obWVzc2FnZTpzdHJpbmcpOkNvbXBpbGF0aW9uRXJyb3J7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb21waWxhdGlvbkVycm9yKGAke21lc3NhZ2V9OiAke3RoaXMuY3VycmVudFRva2VufWApO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFByb2dyYW1WaXNpdG9yIH0gZnJvbSBcIi4vdmlzaXRvcnMvUHJvZ3JhbVZpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25QYXJzZXJ7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHBhcnNlKHRva2VuczpUb2tlbltdKTpFeHByZXNzaW9ue1xyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgUGFyc2VDb250ZXh0KHRva2VucywgdGhpcy5vdXQpO1xyXG4gICAgICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgUHJvZ3JhbVZpc2l0b3IoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFjdGlvbnNFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBhY3Rpb25zOkV4cHJlc3Npb25bXSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmluYXJ5RXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBsZWZ0PzpFeHByZXNzaW9uO1xyXG4gICAgcmlnaHQ/OkV4cHJlc3Npb247XHJcbn0iLCJpbXBvcnQgeyBCaW5hcnlFeHByZXNzaW9uIH0gZnJvbSBcIi4vQmluYXJ5RXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBJZGVudGlmaWVyRXhwcmVzc2lvbiB9IGZyb20gXCIuL0lkZW50aWZpZXJFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tcGFyaXNvbkV4cHJlc3Npb24gZXh0ZW5kcyBCaW5hcnlFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IoaWRlbnRpZmllcjpJZGVudGlmaWVyRXhwcmVzc2lvbiwgY29tcGFyZWRUbzpFeHByZXNzaW9uKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubGVmdCA9IGlkZW50aWZpZXI7XHJcbiAgICAgICAgdGhpcy5yaWdodCA9IGNvbXBhcmVkVG87XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBCaW5hcnlFeHByZXNzaW9uIH0gZnJvbSBcIi4vQmluYXJ5RXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmNhdGVuYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgQmluYXJ5RXhwcmVzc2lvbntcclxuICAgIFxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb250YWluc0V4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHRhcmdldE5hbWU6c3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGNvdW50Om51bWJlciwgXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdHlwZU5hbWU6c3RyaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIEV4cHJlc3Npb257XHJcbiAgICBcclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEJpbmFyeUV4cHJlc3Npb24gfSBmcm9tIFwiLi9CaW5hcnlFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgdHlwZU5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIGluaXRpYWxWYWx1ZT86T2JqZWN0O1xyXG4gICAgdHlwZT86VHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbjtcclxuICAgIGFzc29jaWF0ZWRFeHByZXNzaW9uczpCaW5hcnlFeHByZXNzaW9uW10gPSBbXTtcclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSWRlbnRpZmllckV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGluc3RhbmNlTmFtZTpzdHJpbmd8dW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHZhcmlhYmxlTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIElmRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgY29uZGl0aW9uYWw6RXhwcmVzc2lvbixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBpZkJsb2NrOkV4cHJlc3Npb24sXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgZWxzZUJsb2NrOkV4cHJlc3Npb258bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlzdEV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGl0ZW1zOkV4cHJlc3Npb25bXSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGl0ZXJhbEV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHR5cGVOYW1lOnN0cmluZywgcHVibGljIHJlYWRvbmx5IHZhbHVlOk9iamVjdCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZ3JhbUV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZXhwcmVzc2lvbnM6RXhwcmVzc2lvbltdKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTYXlFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZXh0OnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0VmFyaWFibGVFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBpbnN0YW5jZU5hbWU6c3RyaW5nfHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB2YXJpYWJsZU5hbWU6c3RyaW5nLCBcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBldmFsdWF0aW9uRXhwcmVzc2lvbjpFeHByZXNzaW9uKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4vRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuL1doZW5EZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIGJhc2VUeXBlPzpUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uO1xyXG4gICAgZmllbGRzOkZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuICAgIGV2ZW50czpXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZVRva2VuOlRva2VuLCByZWFkb25seSBiYXNlVHlwZU5hbWVUb2tlbjpUb2tlbil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lVG9rZW4udmFsdWU7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB2YWx1ZTpzdHJpbmcsIHB1YmxpYyByZWFkb25seSBtZWFuaW5nOnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgYWN0b3I6c3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGV2ZW50S2luZDpzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgYWN0aW9uczpFeHByZXNzaW9uKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IEFjdGlvbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0FjdGlvbnNFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCbG9ja0V4cHJlc3Npb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6UGFyc2VDb250ZXh0KTpFeHByZXNzaW9ue1xyXG5cclxuICAgICAgICBjb25zdCBhY3Rpb25zOkV4cHJlc3Npb25bXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb25WaXNpdG9yID0gbmV3IEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcblxyXG4gICAgICAgIHdoaWxlKCFjb250ZXh0LmlzKEtleXdvcmRzLmFuZCkgJiYgIWNvbnRleHQuaXMoS2V5d29yZHMub3IpKXtcclxuICAgICAgICAgICAgY29uc3QgYWN0aW9uID0gZXhwcmVzc2lvblZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaChhY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3RTZW1pVGVybWluYXRvcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBY3Rpb25zRXhwcmVzc2lvbihhY3Rpb25zKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBDb21wYXJpc29uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9Db21wYXJpc29uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgSWRlbnRpZmllckV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvSWRlbnRpZmllckV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0V4cHJlc3Npb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tcGFyaXNvbkV4cHJlc3Npb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSBjb250ZXh0LmV4cGVjdElkZW50aWZpZXIoKTtcclxuICAgICAgICBjb25zdCBpZGVudGlmaWVyRXhwcmVzc2lvbiA9IG5ldyBJZGVudGlmaWVyRXhwcmVzc2lvbih1bmRlZmluZWQsIGlkZW50aWZpZXIudmFsdWUpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pcyk7XHJcblxyXG4gICAgICAgIHZhciB2aXNpdG9yID0gbmV3IEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgdmFyIGNvbXBhcmVkVG8gPSB2aXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IENvbXBhcmlzb25FeHByZXNzaW9uKGlkZW50aWZpZXJFeHByZXNzaW9uLCBjb21wYXJlZFRvKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgUHVuY3R1YXRpb24gfSBmcm9tIFwiLi4vLi4vbGV4aW5nL1B1bmN0dWF0aW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBBY3Rpb25zRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9BY3Rpb25zRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV2ZW50RXhwcmVzc2lvblZpc2l0b3IgZXh0ZW5kcyBFeHByZXNzaW9uVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6UGFyc2VDb250ZXh0KTpFeHByZXNzaW9ue1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGFjdGlvbnM6RXhwcmVzc2lvbltdID0gW107XHJcblxyXG4gICAgICAgIHdoaWxlKCFjb250ZXh0LmlzKEtleXdvcmRzLmFuZCkpe1xyXG4gICAgICAgICAgICBjb25zdCBhY3Rpb24gPSBzdXBlci52aXNpdChjb250ZXh0KTtcclxuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKGFjdGlvbik7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdFNlbWlUZXJtaW5hdG9yKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hbmQpO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnRoZW4pO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnN0b3ApO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0VGVybWluYXRvcigpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFjdGlvbnNFeHByZXNzaW9uKGFjdGlvbnMpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IElmRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9JZkV4cHJlc3Npb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IENvbnRhaW5zRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9Db250YWluc0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgU2F5RXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9TYXlFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuLi8uLi9sZXhpbmcvVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IFNldFZhcmlhYmxlRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9TZXRWYXJpYWJsZUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgTGl0ZXJhbEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvTGl0ZXJhbEV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgTGlzdEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvTGlzdEV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29tcGFyaXNvbkV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vQ29tcGFyaXNvbkV4cHJlc3Npb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IEJvb2xlYW5UeXBlIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvQm9vbGVhblR5cGVcIjtcclxuaW1wb3J0IHsgQ29udmVydCB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L0NvbnZlcnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5pZikpe1xyXG4gICAgICAgICAgICBjb25zdCB2aXNpdG9yID0gbmV3IElmRXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLml0KSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLml0KTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuY29udGFpbnMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY291bnQgPSBjb250ZXh0LmV4cGVjdE51bWJlcigpO1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlTmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb250YWluc0V4cHJlc3Npb24oXCJ+aXRcIiwgTnVtYmVyKGNvdW50LnZhbHVlKSwgdHlwZU5hbWUudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5zZXQpKXtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuc2V0KTtcclxuXHJcbiAgICAgICAgICAgIGxldCB2YXJpYWJsZU5hbWU6c3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLklkZW50aWZpZXIpKXtcclxuICAgICAgICAgICAgICAgIHZhcmlhYmxlTmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpLnZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogU3VwcG9ydCBkZXJlZmVyZW5jaW5nIGFyYml0cmFyeSBpbnN0YW5jZXMuXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkN1cnJlbnRseSB1bmFibGUgdG8gZGVyZWZlcmVuY2UgYSBmaWVsZCwgcGxhbm5lZCBmb3IgYSBmdXR1cmUgcmVsZWFzZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudG8pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdmlzaXRvciA9IG5ldyBFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFNldFZhcmlhYmxlRXhwcmVzc2lvbih1bmRlZmluZWQsIHZhcmlhYmxlTmFtZSwgdmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5zYXkpKXtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuc2F5KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTYXlFeHByZXNzaW9uKHRleHQudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuU3RyaW5nKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGl0ZXJhbEV4cHJlc3Npb24oU3RyaW5nVHlwZS50eXBlTmFtZSwgdmFsdWUudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuTnVtYmVyKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dC5leHBlY3ROdW1iZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGl0ZXJhbEV4cHJlc3Npb24oTnVtYmVyVHlwZS50eXBlTmFtZSwgTnVtYmVyKHZhbHVlLnZhbHVlKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzVHlwZU9mKFRva2VuVHlwZS5Cb29sZWFuKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dC5leHBlY3RCb29sZWFuKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IExpdGVyYWxFeHByZXNzaW9uKEJvb2xlYW5UeXBlLnR5cGVOYW1lLCBDb252ZXJ0LnN0cmluZ1RvQm9vbGVhbih2YWx1ZS52YWx1ZSkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuTGlzdFNlcGFyYXRvcikpe1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtczpFeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLkxpc3RTZXBhcmF0b3IpKXtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMudmlzaXQoY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IExpc3RFeHByZXNzaW9uKGl0ZW1zKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXNGb2xsb3dlZEJ5KEtleXdvcmRzLmlzKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgQ29tcGFyaXNvbkV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKGBVbmFibGUgdG8gcGFyc2UgZXhwcmVzc2lvbiBhdCAke2NvbnRleHQuY3VycmVudFRva2VufWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgQW5kRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9BbmRFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xleGluZy9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGaWVsZERlY2xhcmF0aW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuXHJcbiAgICAgICAgY29uc3QgZmllbGQgPSBuZXcgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24oKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXQpO1xyXG5cclxuICAgICAgICBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5pcykpe1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5pc0FueU9mKEtleXdvcmRzLm5vdCwgS2V5d29yZHMudmlzaWJsZSkpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzVmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMubm90KSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMubm90KTtcclxuICAgICAgICAgICAgICAgICAgICBpc1Zpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy52aXNpYmxlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaWVsZC5uYW1lID0gV29ybGRPYmplY3QudmlzaWJsZTtcclxuICAgICAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gQm9vbGVhblR5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBpc1Zpc2libGU7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMub2JzZXJ2ZWQpKXtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLm9ic2VydmVkKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmFzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBvYnNlcnZhdGlvbiA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IFdvcmxkT2JqZWN0Lm9ic2VydmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gb2JzZXJ2YXRpb24udmFsdWU7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuZGVzY3JpYmVkKSl7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5kZXNjcmliZWQpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaWVsZC5uYW1lID0gV29ybGRPYmplY3QuZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IFN0cmluZ1R5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBkZXNjcmlwdGlvbi52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY29udGV4dC5pcyhLZXl3b3Jkcy5hbmQpKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb25WaXNpdG9yID0gbmV3IEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb25WaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0RXhwcmVzc2lvbiA9IChmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnMubGVuZ3RoID09IDApID8gZmllbGQgOiBmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnNbZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zLmxlbmd0aCAtIDFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25jYXQgPSBuZXcgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uY2F0LmxlZnQgPSBsZWZ0RXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgICAgICAgICBjb25jYXQucmlnaHQgPSBleHByZXNzaW9uO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnMucHVzaChjb25jYXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLndoZXJlKSl7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy53aGVyZSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy50aGUpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMucGxheWVyKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnN0YXJ0cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IFBsYWNlLmlzUGxheWVyU3RhcnQ7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IEJvb2xlYW5UeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiVW5hYmxlIHRvIGRldGVybWluZSBwcm9wZXJ0eSBmaWVsZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5oYXMpKXtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmhhcyk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmEpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhhdCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmlzKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmlzVHlwZU9mKFRva2VuVHlwZS5TdHJpbmcpKXtcclxuICAgICAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gU3RyaW5nVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCkudmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuTnVtYmVyKSl7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IE51bWJlclR5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBjb250ZXh0LmV4cGVjdE51bWJlcigpLnZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLkJvb2xlYW4pKXtcclxuICAgICAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gQm9vbGVhblR5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBjb250ZXh0LmV4cGVjdEJvb2xlYW4oKS52YWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKGBFeHBlY3RlZCBhIHN0cmluZywgbnVtYmVyLCBvciBib29sZWFuIGJ1dCBmb3VuZCAnJHtjb250ZXh0LmN1cnJlbnRUb2tlbi52YWx1ZX0nIG9mIHR5cGUgJyR7Y29udGV4dC5jdXJyZW50VG9rZW4udHlwZX0nYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmaWVsZC5uYW1lID0gbmFtZS52YWx1ZTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmNvbnRhaW5zKSl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5jb250YWlucyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBleHBlY3RQYWlyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY291bnQgPSBjb250ZXh0LmV4cGVjdE51bWJlcigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBbTnVtYmVyKGNvdW50LnZhbHVlKSwgbmFtZS52YWx1ZV07XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IFtleHBlY3RQYWlyKCldO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLkxpc3RTZXBhcmF0b3IpKXtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goZXhwZWN0UGFpcigpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmllbGQubmFtZSA9IFdvcmxkT2JqZWN0LmNvbnRlbnRzO1xyXG4gICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IExpc3QudHlwZU5hbWU7XHJcbiAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IGl0ZW1zOyBcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuY2FuKSl7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5jYW4pO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5yZWFjaCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnRoZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwbGFjZU5hbWUgPSBjb250ZXh0LmV4cGVjdElkZW50aWZpZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmJ5KTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuZ29pbmcpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBgfiR7ZGlyZWN0aW9uLnZhbHVlfWA7XHJcbiAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gU3RyaW5nVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gYCR7cGxhY2VOYW1lLnZhbHVlfWA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJVbmFibGUgdG8gZGV0ZXJtaW5lIGZpZWxkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZpZWxkO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgSWZFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0lmRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBCbG9ja0V4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vQmxvY2tFeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4uLy4uL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIElmRXhwcmVzc2lvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaWYpO1xyXG5cclxuICAgICAgICBjb25zdCBleHByZXNzaW9uVmlzaXRvciA9IG5ldyBFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbmFsID0gZXhwcmVzc2lvblZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnRoZW4pO1xyXG5cclxuICAgICAgICBjb25zdCBibG9ja1Zpc2l0b3IgPSBuZXcgQmxvY2tFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgIGNvbnN0IGlmQmxvY2sgPSBibG9ja1Zpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcbiAgICAgICAgY29uc3QgZWxzZUJsb2NrID0gdGhpcy50cnlWaXNpdEVsc2VCbG9jayhjb250ZXh0KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5hbmQpKXsgICAgICAgICAgICBcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYW5kKTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlbik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmNvbnRpbnVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgWW91IG5lZWQgdG8gZW5kIGFuICdpZicgZXhwcmVzc2lvbiBjb3JyZWN0bHksIG5vdCB3aXRoOiAke2NvbnRleHQuY3VycmVudFRva2VufWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBJZkV4cHJlc3Npb24oY29uZGl0aW9uYWwsIGlmQmxvY2ssIGVsc2VCbG9jayk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0cnlWaXNpdEVsc2VCbG9jayhjb250ZXh0OlBhcnNlQ29udGV4dCl7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0LmlzKEtleXdvcmRzLm9yKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGNvbnN0IGJsb2NrVmlzaXRvciA9IG5ldyBCbG9ja0V4cHJlc3Npb25WaXNpdG9yKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLm9yKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5lbHNlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJsb2NrVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBUeXBlRGVjbGFyYXRpb25WaXNpdG9yIH0gZnJvbSBcIi4vVHlwZURlY2xhcmF0aW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQcm9ncmFtRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9Qcm9ncmFtRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4uLy4uL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvclwiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25WaXNpdG9yIH0gZnJvbSBcIi4vVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBTYXlFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL1NheUV4cHJlc3Npb25WaXNpdG9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZ3JhbVZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgbGV0IGV4cHJlc3Npb25zOkV4cHJlc3Npb25bXSA9IFtdO1xyXG5cclxuICAgICAgICB3aGlsZSghY29udGV4dC5pc0RvbmUpe1xyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy51bmRlcnN0YW5kKSl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1bmRlcnN0YW5kaW5nRGVjbGFyYXRpb24gPSBuZXcgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbi52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXNBbnlPZihLZXl3b3Jkcy5hLCBLZXl3b3Jkcy5hbikpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZURlY2xhcmF0aW9uID0gbmV3IFR5cGVEZWNsYXJhdGlvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB0eXBlRGVjbGFyYXRpb24udmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLnNheSkpe1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2F5RXhwcmVzc2lvbiA9IG5ldyBTYXlFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHNheUV4cHJlc3Npb24udmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQXQgdGhlIHRvcCBsZXZlbCwgYSBzYXkgZXhwcmVzc2lvbiBtdXN0IGhhdmUgYSB0ZXJtaW5hdG9yLiBXZSdyZSBldmFsdWF0aW5nIGl0IG91dCBoZXJlXHJcbiAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIGEgc2F5IGV4cHJlc3Npb24gbm9ybWFsbHkgZG9lc24ndCByZXF1aXJlIG9uZS5cclxuXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgRm91bmQgdW5leHBlY3RlZCB0b2tlbiAnJHtjb250ZXh0LmN1cnJlbnRUb2tlbn0nYCk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvZ3JhbUV4cHJlc3Npb24oZXhwcmVzc2lvbnMpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFNheUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvU2F5RXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNheUV4cHJlc3Npb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnNheSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRleHQgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFNheUV4cHJlc3Npb24odGV4dC52YWx1ZSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBGaWVsZERlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL0ZpZWxkRGVjbGFyYXRpb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0ZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBXaGVuRGVjbGFyYXRpb25WaXNpdG9yIH0gZnJvbSBcIi4vV2hlbkRlY2xhcmF0aW9uVmlzaXRvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFR5cGVEZWNsYXJhdGlvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3RBbnlPZihLZXl3b3Jkcy5hLCBLZXl3b3Jkcy5hbik7XHJcblxyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBjb250ZXh0LmV4cGVjdElkZW50aWZpZXIoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXMpO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmEpO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmtpbmQpO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLm9mKTtcclxuXHJcbiAgICAgICAgY29uc3QgYmFzZVR5cGUgPSB0aGlzLmV4cGVjdEJhc2VUeXBlKGNvbnRleHQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0VGVybWluYXRvcigpO1xyXG5cclxuICAgICAgICBjb25zdCBmaWVsZHM6RmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25bXSA9IFtdO1xyXG5cclxuICAgICAgICB3aGlsZSAoY29udGV4dC5pcyhLZXl3b3Jkcy5pdCkpe1xyXG4gICAgICAgICAgICBjb25zdCBmaWVsZFZpc2l0b3IgPSBuZXcgRmllbGREZWNsYXJhdGlvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgY29uc3QgZmllbGQgPSBmaWVsZFZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICBmaWVsZHMucHVzaCg8RmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24+ZmllbGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZXZlbnRzOldoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb25bXSA9IFtdO1xyXG5cclxuICAgICAgICB3aGlsZSAoY29udGV4dC5pcyhLZXl3b3Jkcy53aGVuKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHdoZW5WaXNpdG9yID0gbmV3IFdoZW5EZWNsYXJhdGlvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgY29uc3Qgd2hlbiA9IHdoZW5WaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgZXZlbnRzLnB1c2goPFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24+d2hlbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0eXBlRGVjbGFyYXRpb24gPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihuYW1lLCBiYXNlVHlwZSk7XHJcblxyXG4gICAgICAgIHR5cGVEZWNsYXJhdGlvbi5maWVsZHMgPSBmaWVsZHM7XHJcbiAgICAgICAgdHlwZURlY2xhcmF0aW9uLmV2ZW50cyA9IGV2ZW50cztcclxuXHJcbiAgICAgICAgcmV0dXJuIHR5cGVEZWNsYXJhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4cGVjdEJhc2VUeXBlKGNvbnRleHQ6UGFyc2VDb250ZXh0KXtcclxuICAgICAgICBpZiAoY29udGV4dC5pc0FueU9mKEtleXdvcmRzLnBsYWNlLCBLZXl3b3Jkcy5pdGVtLCBLZXl3b3Jkcy5kZWNvcmF0aW9uKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0LmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudW5kZXJzdGFuZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1lYW5pbmcgPSBjb250ZXh0LmV4cGVjdEFueU9mKEtleXdvcmRzLmRlc2NyaWJpbmcsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEtleXdvcmRzLm1vdmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy5kaXJlY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEtleXdvcmRzLnRha2luZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy5pbnZlbnRvcnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2V5d29yZHMuZHJvcHBpbmcpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uKHZhbHVlLnZhbHVlLCBtZWFuaW5nLnZhbHVlKTsgICAgICAgIFxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWaXNpdG9ye1xyXG4gICAgYWJzdHJhY3QgdmlzaXQoY29udGV4dDpQYXJzZUNvbnRleHQpOkV4cHJlc3Npb247XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9XaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFB1bmN0dWF0aW9uIH0gZnJvbSBcIi4uLy4uL2xleGluZy9QdW5jdHVhdGlvblwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0V4cHJlc3Npb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IEV2ZW50RXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FdmVudEV4cHJlc3Npb25WaXNpdG9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV2hlbkRlY2xhcmF0aW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy53aGVuKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy50aGUpO1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnBsYXllcik7XHJcblxyXG4gICAgICAgIGNvbnN0IGV2ZW50S2luZCA9IGNvbnRleHQuZXhwZWN0QW55T2YoS2V5d29yZHMuZW50ZXJzLCBLZXl3b3Jkcy5leGl0cyk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0T3Blbk1ldGhvZEJsb2NrKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGFjdGlvbnNWaXNpdG9yID0gbmV3IEV2ZW50RXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICBjb25zdCBhY3Rpb25zID0gYWN0aW9uc1Zpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbihLZXl3b3Jkcy5wbGF5ZXIsIGV2ZW50S2luZC52YWx1ZSwgYWN0aW9ucyk7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgUHJvZ3JhbUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9Qcm9ncmFtRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5cIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uL2xleGluZy9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi8uLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvblNlbWFudGljQW5hbHl6ZXJ7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhbnkgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JBbnksIFRva2VuLmVtcHR5KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgd29ybGRPYmplY3QgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JXb3JsZE9iamVjdCwgVG9rZW4uZm9yQW55KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGxhY2UgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JQbGFjZSwgVG9rZW4uZm9yV29ybGRPYmplY3QpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBpdGVtID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9ySXRlbSwgVG9rZW4uZm9yV29ybGRPYmplY3QpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBib29sZWFuVHlwZSA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvckJvb2xlYW4sIFRva2VuLmZvckFueSk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxpc3QgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JMaXN0LCBUb2tlbi5mb3JBbnkpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWNvcmF0aW9uID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yRGVjb3JhdGlvbiwgVG9rZW4uZm9yV29ybGRPYmplY3QpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgb3V0OklPdXRwdXQpe1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgYW5hbHl6ZShleHByZXNzaW9uOkV4cHJlc3Npb24pOkV4cHJlc3Npb257XHJcbiAgICAgICAgY29uc3QgdHlwZXM6VHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbltdID0gW3RoaXMuYW55LCB0aGlzLndvcmxkT2JqZWN0LCB0aGlzLnBsYWNlLCB0aGlzLmJvb2xlYW5UeXBlLCB0aGlzLml0ZW0sIHRoaXMuZGVjb3JhdGlvbl07XHJcblxyXG4gICAgICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgUHJvZ3JhbUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBmb3IobGV0IGNoaWxkIG9mIGV4cHJlc3Npb24uZXhwcmVzc2lvbnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZXMucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHR5cGVzQnlOYW1lID0gbmV3IE1hcDxzdHJpbmcsIFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24+KHR5cGVzLm1hcCh4ID0+IFt4Lm5hbWUsIHhdKSk7XHJcblxyXG4gICAgICAgIGZvcihjb25zdCBkZWNsYXJhdGlvbiBvZiB0eXBlcyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGJhc2VUb2tlbiA9IGRlY2xhcmF0aW9uLmJhc2VUeXBlTmFtZVRva2VuO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJhc2VUb2tlbi50eXBlID09IFRva2VuVHlwZS5LZXl3b3JkICYmICFiYXNlVG9rZW4udmFsdWUuc3RhcnRzV2l0aChcIn5cIikpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGB+JHtiYXNlVG9rZW4udmFsdWV9YDtcclxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uLmJhc2VUeXBlID0gdHlwZXNCeU5hbWUuZ2V0KG5hbWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb24uYmFzZVR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoYmFzZVRva2VuLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IGZpZWxkIG9mIGRlY2xhcmF0aW9uLmZpZWxkcyl7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlID0gdHlwZXNCeU5hbWUuZ2V0KGZpZWxkLnR5cGVOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGV4cHJlc3Npb247XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBFeHByZXNzaW9uVHJhbnNmb3JtYXRpb25Nb2Rle1xyXG4gICAgTm9uZSxcclxuICAgIElnbm9yZVJlc3VsdHNPZlNheUV4cHJlc3Npb25cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUHJvZ3JhbUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9Qcm9ncmFtRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4uL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvclwiO1xyXG5pbXBvcnQgeyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvVW5kZXJzdGFuZGluZ1wiO1xyXG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuLi8uLi9jb21tb24vRmllbGRcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IFN0cmluZ1R5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9TdHJpbmdUeXBlXCI7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9JdGVtXCI7XHJcbmltcG9ydCB7IE51bWJlclR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9OdW1iZXJUeXBlXCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYXllclwiO1xyXG5pbXBvcnQgeyBTYXlFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2F5RXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vLi4vY29tbW9uL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBTYXkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9TYXlcIjtcclxuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tIFwiLi4vLi4vY29tbW9uL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IFBhcmFtZXRlciB9IGZyb20gXCIuLi8uLi9jb21tb24vUGFyYW1ldGVyXCI7XHJcbmltcG9ydCB7IElmRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0lmRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBDb25jYXRlbmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0NvbmNhdGVuYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IENvbnRhaW5zRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0NvbnRhaW5zRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0ZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEFjdGlvbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvQWN0aW9uc0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IEV2ZW50VHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vRXZlbnRUeXBlXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGUgfSBmcm9tIFwiLi9FeHByZXNzaW9uVHJhbnNmb3JtYXRpb25Nb2RlXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IFNldFZhcmlhYmxlRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1NldFZhcmlhYmxlRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBMaXRlcmFsRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0xpdGVyYWxFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IERlY29yYXRpb24gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9EZWNvcmF0aW9uXCI7XHJcbmltcG9ydCB7IENvbXBhcmlzb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29tcGFyaXNvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgSWRlbnRpZmllckV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9JZGVudGlmaWVyRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBDb252ZXJ0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQ29udmVydFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uVHJhbnNmb3JtZXJ7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgY3JlYXRlU3lzdGVtVHlwZXMoKXtcclxuICAgICAgICBjb25zdCB0eXBlczpUeXBlW10gPSBbXTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBUaGVzZSBhcmUgb25seSBoZXJlIGFzIHN0dWJzIGZvciBleHRlcm5hbCBydW50aW1lIHR5cGVzIHRoYXQgYWxsb3cgdXMgdG8gY29ycmVjdGx5IHJlc29sdmUgZmllbGQgdHlwZXMuXHJcblxyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoQW55LnR5cGVOYW1lLCBBbnkucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFdvcmxkT2JqZWN0LnR5cGVOYW1lLCBXb3JsZE9iamVjdC5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoUGxhY2UudHlwZU5hbWUsIFBsYWNlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShCb29sZWFuVHlwZS50eXBlTmFtZSwgQm9vbGVhblR5cGUucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFN0cmluZ1R5cGUudHlwZU5hbWUsIFN0cmluZ1R5cGUucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKE51bWJlclR5cGUudHlwZU5hbWUsIE51bWJlclR5cGUucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKEl0ZW0udHlwZU5hbWUsIEl0ZW0ucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKExpc3QudHlwZU5hbWUsIExpc3QucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFBsYXllci50eXBlTmFtZSwgUGxheWVyLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShTYXkudHlwZU5hbWUsIFNheS5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoRGVjb3JhdGlvbi50eXBlTmFtZSwgRGVjb3JhdGlvbi5wYXJlbnRUeXBlTmFtZSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IE1hcDxzdHJpbmcsIFR5cGU+KHR5cGVzLm1hcCh4ID0+IFt4Lm5hbWUsIHhdKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtKGV4cHJlc3Npb246RXhwcmVzc2lvbik6VHlwZVtde1xyXG4gICAgICAgIGNvbnN0IHR5cGVzQnlOYW1lID0gdGhpcy5jcmVhdGVTeXN0ZW1UeXBlcygpO1xyXG4gICAgICAgIGxldCBkeW5hbWljVHlwZUNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBQcm9ncmFtRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBjaGlsZCBvZiBleHByZXNzaW9uLmV4cHJlc3Npb25zKXtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBuZXcgVHlwZShgfiR7VW5kZXJzdGFuZGluZy50eXBlTmFtZX1fJHtkeW5hbWljVHlwZUNvdW50fWAsIFVuZGVyc3RhbmRpbmcudHlwZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5uYW1lID0gVW5kZXJzdGFuZGluZy5hY3Rpb247XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLmRlZmF1bHRWYWx1ZSA9IGNoaWxkLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZWFuaW5nID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVhbmluZy5uYW1lID0gVW5kZXJzdGFuZGluZy5tZWFuaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lYW5pbmcuZGVmYXVsdFZhbHVlID0gY2hpbGQubWVhbmluZztcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0eXBlLmZpZWxkcy5wdXNoKGFjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZS5maWVsZHMucHVzaChtZWFuaW5nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pY1R5cGVDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0eXBlc0J5TmFtZS5zZXQodHlwZS5uYW1lLCB0eXBlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gdGhpcy50cmFuc2Zvcm1Jbml0aWFsVHlwZURlY2xhcmF0aW9uKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0eXBlc0J5TmFtZS5zZXQodHlwZS5uYW1lLCB0eXBlKTtcclxuICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBjaGlsZCBvZiBleHByZXNzaW9uLmV4cHJlc3Npb25zKXtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoY2hpbGQubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvcihjb25zdCBmaWVsZEV4cHJlc3Npb24gb2YgY2hpbGQuZmllbGRzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGQgPSBuZXcgRmllbGQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IGZpZWxkRXhwcmVzc2lvbi5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IGZpZWxkRXhwcmVzc2lvbi50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQudHlwZSA9IHR5cGVzQnlOYW1lLmdldChmaWVsZEV4cHJlc3Npb24udHlwZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkRXhwcmVzc2lvbi5pbml0aWFsVmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkLnR5cGVOYW1lID09IFN0cmluZ1R5cGUudHlwZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gPHN0cmluZz5maWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC50eXBlTmFtZSA9PSBOdW1iZXJUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IE51bWJlcihmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZU5hbWUgPT0gQm9vbGVhblR5cGUudHlwZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZpZWxkRXhwcmVzc2lvbi5pbml0aWFsVmFsdWUgPT0gJ3N0cmluZycpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IENvbnZlcnQuc3RyaW5nVG9Cb29sZWFuKGZpZWxkRXhwcmVzc2lvbi5pbml0aWFsVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGZpZWxkRXhwcmVzc2lvbi5pbml0aWFsVmFsdWUgPT0gJ2Jvb2xlYW4nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKGBVbmFibGUgdG8gdHJhbnNmb3JtIGZpZWxkIHR5cGVgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3V0LndyaXRlKGBJTklUICR7ZmllbGQubmFtZX06JHtmaWVsZC50eXBlTmFtZX0gPSAoJHt2YWx1ZX06JHt0eXBlb2YgdmFsdWV9KSR7ZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZX06JHt0eXBlb2YgZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dC53cml0ZShgVkFMVUUgSVMgJHtmaWVsZC5kZWZhdWx0VmFsdWV9OiR7dHlwZW9mIGZpZWxkLmRlZmF1bHRWYWx1ZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkRXhwcmVzc2lvbi5hc3NvY2lhdGVkRXhwcmVzc2lvbnMubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnZXRGaWVsZCA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLm5hbWUgPSBgfmdldF8ke2ZpZWxkLm5hbWV9YDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLnBhcmFtZXRlcnMucHVzaChuZXcgUGFyYW1ldGVyKFwifnZhbHVlXCIsIGZpZWxkLnR5cGVOYW1lKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5yZXR1cm5UeXBlID0gZmllbGQudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihjb25zdCBhc3NvY2lhdGVkIG9mIGZpZWxkRXhwcmVzc2lvbi5hc3NvY2lhdGVkRXhwcmVzc2lvbnMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLmJvZHkucHVzaCguLi50aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oYXNzb2NpYXRlZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLmJvZHkucHVzaChJbnN0cnVjdGlvbi5yZXR1cm4oKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8ubWV0aG9kcy5wdXNoKGdldEZpZWxkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8uZmllbGRzLnB1c2goZmllbGQpOyAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzV29ybGRPYmplY3QgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBjdXJyZW50ID0gdHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IHR5cGVzQnlOYW1lLmdldChjdXJyZW50LmJhc2VUeXBlTmFtZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQubmFtZSA9PSBXb3JsZE9iamVjdC50eXBlTmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNXb3JsZE9iamVjdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzV29ybGRPYmplY3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmliZSA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpYmUubmFtZSA9IFdvcmxkT2JqZWN0LmRlc2NyaWJlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmliZS5ib2R5LnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFByb3BlcnR5KFdvcmxkT2JqZWN0LnZpc2libGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmVJZkZhbHNlKDMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRQcm9wZXJ0eShXb3JsZE9iamVjdC5kZXNjcmlwdGlvbiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucmV0dXJuKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/Lm1ldGhvZHMucHVzaChkZXNjcmliZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvYnNlcnZlID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlLm5hbWUgPSBXb3JsZE9iamVjdC5vYnNlcnZlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlLmJvZHkucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkUHJvcGVydHkoV29ybGRPYmplY3QudmlzaWJsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5icmFuY2hSZWxhdGl2ZUlmRmFsc2UoMyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFByb3BlcnR5KFdvcmxkT2JqZWN0Lm9ic2VydmF0aW9uKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5yZXR1cm4oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8ubWV0aG9kcy5wdXNoKG9ic2VydmUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlPy5maWVsZHMuZmluZCh4ID0+IHgubmFtZSA9PSBXb3JsZE9iamVjdC52aXNpYmxlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2aXNpYmxlID0gbmV3IEZpZWxkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZS5uYW1lID0gV29ybGRPYmplY3QudmlzaWJsZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGUudHlwZU5hbWUgPSBCb29sZWFuVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGUuZGVmYXVsdFZhbHVlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5maWVsZHMucHVzaCh2aXNpYmxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlPy5maWVsZHMuZmluZCh4ID0+IHgubmFtZSA9PSBXb3JsZE9iamVjdC5jb250ZW50cykpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudHMgPSBuZXcgRmllbGQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50cy5uYW1lID0gV29ybGRPYmplY3QuY29udGVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50cy50eXBlTmFtZSA9IExpc3QudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50cy5kZWZhdWx0VmFsdWUgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5maWVsZHMucHVzaChjb250ZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdHlwZT8uZmllbGRzLmZpbmQoeCA9PiB4Lm5hbWUgPT0gV29ybGRPYmplY3Qub2JzZXJ2YXRpb24pKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9ic2VydmF0aW9uID0gbmV3IEZpZWxkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2YXRpb24ubmFtZSA9IFdvcmxkT2JqZWN0Lm9ic2VydmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2YXRpb24udHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2YXRpb24uZGVmYXVsdFZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5maWVsZHMucHVzaChvYnNlcnZhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkdXBsaWNhdGVFdmVudENvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgY2hpbGQuZXZlbnRzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGhvZCA9IG5ldyBNZXRob2QoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QubmFtZSA9IGB+ZXZlbnRfJHtldmVudC5hY3Rvcn1fJHtldmVudC5ldmVudEtpbmR9XyR7ZHVwbGljYXRlRXZlbnRDb3VudH1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmV2ZW50VHlwZSA9IHRoaXMudHJhbnNmb3JtRXZlbnRLaW5kKGV2ZW50LmV2ZW50S2luZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVwbGljYXRlRXZlbnRDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGlvbnMgPSA8QWN0aW9uc0V4cHJlc3Npb24+ZXZlbnQuYWN0aW9ucztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IoY29uc3QgYWN0aW9uIG9mIGFjdGlvbnMuYWN0aW9ucyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYm9keSA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihhY3Rpb24sIEV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGUuSWdub3JlUmVzdWx0c09mU2F5RXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLmJvZHkucHVzaCguLi5ib2R5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QuYm9keS5wdXNoKEluc3RydWN0aW9uLnJldHVybigpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5tZXRob2RzLnB1c2gobWV0aG9kKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGdsb2JhbFNheXMgPSBleHByZXNzaW9uLmV4cHJlc3Npb25zLmZpbHRlcih4ID0+IHggaW5zdGFuY2VvZiBTYXlFeHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBuZXcgVHlwZShgfmdsb2JhbFNheXNgLCBTYXkudHlwZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgICAgICBtZXRob2QubmFtZSA9IFNheS50eXBlTmFtZTtcclxuICAgICAgICAgICAgbWV0aG9kLnBhcmFtZXRlcnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RydWN0aW9uczpJbnN0cnVjdGlvbltdID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3Qgc2F5IG9mIGdsb2JhbFNheXMpe1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2F5RXhwcmVzc2lvbiA9IDxTYXlFeHByZXNzaW9uPnNheTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKHNheUV4cHJlc3Npb24udGV4dCksXHJcbiAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24ucmV0dXJuKCkpO1xyXG5cclxuICAgICAgICAgICAgbWV0aG9kLmJvZHkgPSBpbnN0cnVjdGlvbnM7XHJcblxyXG4gICAgICAgICAgICB0eXBlLm1ldGhvZHMucHVzaChtZXRob2QpO1xyXG5cclxuICAgICAgICAgICAgdHlwZXNCeU5hbWUuc2V0KHR5cGUubmFtZSwgdHlwZSk7ICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byBwYXJ0aWFsbHkgdHJhbnNmb3JtXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5vdXQud3JpdGUoYENyZWF0ZWQgJHt0eXBlc0J5TmFtZS5zaXplfSB0eXBlcy4uLmApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHR5cGVzQnlOYW1lLnZhbHVlcygpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybUV2ZW50S2luZChraW5kOnN0cmluZyl7XHJcbiAgICAgICAgc3dpdGNoKGtpbmQpe1xyXG4gICAgICAgICAgICBjYXNlIEtleXdvcmRzLmVudGVyczp7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRXZlbnRUeXBlLlBsYXllckVudGVyc1BsYWNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgS2V5d29yZHMuZXhpdHM6e1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEV2ZW50VHlwZS5QbGF5ZXJFeGl0c1BsYWNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6e1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYFVuYWJsZSB0byB0cmFuc2Zvcm0gdW5zdXBwb3J0ZWQgZXZlbnQga2luZCAnJHtraW5kfSdgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbjpFeHByZXNzaW9ufG51bGwsIG1vZGU/OkV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGUpe1xyXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uczpJbnN0cnVjdGlvbltdID0gW107XHJcblxyXG4gICAgICAgIGlmIChleHByZXNzaW9uID09IG51bGwpe1xyXG4gICAgICAgICAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBJZkV4cHJlc3Npb24peyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb25hbCA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmNvbmRpdGlvbmFsLCBtb2RlKTtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goLi4uY29uZGl0aW9uYWwpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaWZCbG9jayA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmlmQmxvY2ssIG1vZGUpO1xyXG4gICAgICAgICAgICBjb25zdCBlbHNlQmxvY2sgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5lbHNlQmxvY2ssIG1vZGUpO1xyXG5cclxuICAgICAgICAgICAgaWZCbG9jay5wdXNoKEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlKGVsc2VCbG9jay5sZW5ndGgpKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlSWZGYWxzZShpZkJsb2NrLmxlbmd0aCkpXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmlmQmxvY2spO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5lbHNlQmxvY2spO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIFNheUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGV4cHJlc3Npb24udGV4dCkpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5wcmludCgpKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtb2RlICE9IEV4cHJlc3Npb25UcmFuc2Zvcm1hdGlvbk1vZGUuSWdub3JlUmVzdWx0c09mU2F5RXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGV4cHJlc3Npb24udGV4dCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgQ29udGFpbnNFeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkTnVtYmVyKGV4cHJlc3Npb24uY291bnQpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhleHByZXNzaW9uLnR5cGVOYW1lKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRJbnN0YW5jZShleHByZXNzaW9uLnRhcmdldE5hbWUpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEZpZWxkKFdvcmxkT2JqZWN0LmNvbnRlbnRzKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmluc3RhbmNlQ2FsbChMaXN0LmNvbnRhaW5zKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBDb25jYXRlbmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5sZWZ0ISwgbW9kZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24ucmlnaHQhLCBtb2RlKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmxlZnQpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5yaWdodCk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmNvbmNhdGVuYXRlKCkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEZpZWxkKGV4cHJlc3Npb24ubmFtZSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBTZXRWYXJpYWJsZUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBjb25zdCByaWdodCA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmV2YWx1YXRpb25FeHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgLi4ucmlnaHQsXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEZpZWxkKGV4cHJlc3Npb24udmFyaWFibGVOYW1lKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmFzc2lnbigpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgTGl0ZXJhbEV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpZiAoZXhwcmVzc2lvbi50eXBlTmFtZSA9PSBTdHJpbmdUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmxvYWRTdHJpbmcoPHN0cmluZz5leHByZXNzaW9uLnZhbHVlKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbi50eXBlTmFtZSA9PSBOdW1iZXJUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmxvYWROdW1iZXIoTnVtYmVyKGV4cHJlc3Npb24udmFsdWUpKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbi50eXBlTmFtZSA9PSBCb29sZWFuVHlwZS50eXBlTmFtZSl7XHJcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5sb2FkQm9vbGVhbig8Ym9vbGVhbj4oZXhwcmVzc2lvbi52YWx1ZSkpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKGBVbmFibGUgdG8gdHJhbnNmb3JtIHVuc3VwcG9ydGVkIGxpdGVyYWwgZXhwcmVzc2lvbiAnJHtleHByZXNzaW9ufSdgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIElkZW50aWZpZXJFeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEZpZWxkKGV4cHJlc3Npb24udmFyaWFibGVOYW1lKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgQ29tcGFyaXNvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBjb25zdCByaWdodCA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLnJpZ2h0ISk7XHJcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5sZWZ0ISk7XHJcblxyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChcclxuICAgICAgICAgICAgICAgIC4uLmxlZnQsXHJcbiAgICAgICAgICAgICAgICAuLi5yaWdodCxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmNvbXBhcmVFcXVhbCgpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgQWN0aW9uc0V4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBleHByZXNzaW9uLmFjdGlvbnMuZm9yRWFjaCh4ID0+IGluc3RydWN0aW9ucy5wdXNoKC4uLnRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbih4LCBtb2RlKSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKGBVbmFibGUgdG8gdHJhbnNmb3JtIHVuc3VwcG9ydGVkIGV4cHJlc3Npb246ICR7ZXhwcmVzc2lvbn1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVjdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm1Jbml0aWFsVHlwZURlY2xhcmF0aW9uKGV4cHJlc3Npb246VHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUeXBlKGV4cHJlc3Npb24ubmFtZSwgZXhwcmVzc2lvbi5iYXNlVHlwZSEubmFtZSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBJUGFuZUFuYWx5emVyIH0gZnJvbSBcIi4vYW5hbHl6ZXJzL0lQYW5lQW5hbHl6ZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBbmFseXNpc0Nvb3JkaW5hdG9yIHtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYW5hbHl6ZXI6IElQYW5lQW5hbHl6ZXIsIFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWFkb25seSBvdXRwdXQ6IEhUTUxEaXZFbGVtZW50KSB7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBhbmFseXplci5jdXJyZW50UGFuZS5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZSA9PiB0aGlzLnVwZGF0ZSgpKTtcclxuICAgICAgICBhbmFseXplci5jdXJyZW50UGFuZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB0aGlzLnVwZGF0ZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZSgpe1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ2FyZXRQb3NpdGlvblZhbHVlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlQ2FyZXRQb3NpdGlvblZhbHVlcygpe1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5hbmFseXplci5jdXJyZW50Q2FyZXRQb3NpdGlvbjtcclxuICAgICAgICBjb25zdCBmb3JtYXR0ZWRQb3NpdGlvbiA9IGBMaW5lICR7cG9zaXRpb24ucm93fSwgQ29sdW1uICR7cG9zaXRpb24uY29sdW1ufWA7XHJcblxyXG4gICAgICAgIHRoaXMub3V0cHV0LmlubmVySFRNTCA9IGZvcm1hdHRlZFBvc2l0aW9uO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENhcmV0UG9zaXRpb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgcm93Om51bWJlciwgcHVibGljIHJlYWRvbmx5IGNvbHVtbjpudW1iZXIpe1xyXG5cclxuICAgIH1cclxufSIsImltcG9ydCB7IElQYW5lQW5hbHl6ZXIgfSBmcm9tIFwiLi9JUGFuZUFuYWx5emVyXCI7XHJcbmltcG9ydCB7IENhcmV0UG9zaXRpb24gfSBmcm9tIFwiLi4vQ2FyZXRQb3NpdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvZGVQYW5lQW5hbHl6ZXIgaW1wbGVtZW50cyBJUGFuZUFuYWx5emVye1xyXG4gICAgcHJpdmF0ZSBjYXJldFJvdzpudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBjYXJldENvbHVtbjpudW1iZXIgPSAwO1xyXG5cclxuICAgIGdldCBjdXJyZW50Q2FyZXRQb3NpdGlvbigpOiBDYXJldFBvc2l0aW9ue1xyXG4gICAgICAgIHJldHVybiBuZXcgQ2FyZXRQb3NpdGlvbih0aGlzLmNhcmV0Um93LCB0aGlzLmNhcmV0Q29sdW1uKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudFBhbmUoKTpIVE1MRGl2RWxlbWVudHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYW5lO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcGFuZTpIVE1MRGl2RWxlbWVudCl7XHJcbiAgICAgICAgcGFuZS5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZSA9PiB0aGlzLnVwZGF0ZUN1cnJlbnRDYXJldFBvc2l0aW9uKCkpO1xyXG4gICAgICAgIHBhbmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4gdGhpcy51cGRhdGVDdXJyZW50Q2FyZXRQb3NpdGlvbigpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUN1cnJlbnRDYXJldFBvc2l0aW9uKCl7XHJcbiAgICAgICAgdmFyIHNlbCA9IGRvY3VtZW50LmdldFNlbGVjdGlvbigpIGFzIGFueTsgLy8gVXNpbmcgJ2FueScgYmVjYXVzZSAnbW9kaWZ5JyBpc24ndCBvZmZpY2lhbGx5IHN1cHBvcnRlZC5cclxuXHJcbiAgICAgICAgaWYgKHNlbC50b1N0cmluZygpLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWwubW9kaWZ5KFwiZXh0ZW5kXCIsIFwiYmFja3dhcmRcIiwgXCJsaW5lYm91bmRhcnlcIik7XHJcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gc2VsLnRvU3RyaW5nKCkubGVuZ3RoIGFzIG51bWJlcjtcclxuICAgICAgICBcclxuICAgICAgICBpZihzZWwuYW5jaG9yTm9kZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc2VsLmNvbGxhcHNlVG9FbmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jYXJldENvbHVtbiA9IHBvc2l0aW9uO1xyXG5cclxuICAgICAgICBzZWwgPSBkb2N1bWVudC5nZXRTZWxlY3Rpb24oKSBhcyBhbnk7XHJcbiAgICAgICAgc2VsLm1vZGlmeShcImV4dGVuZFwiLCBcImJhY2t3YXJkXCIsIFwiZG9jdW1lbnRib3VuZGFyeVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5jYXJldFJvdyA9ICgoc2VsLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDAsKSkuc3BsaXQoXCJcXG5cIikpLmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYoc2VsLmFuY2hvck5vZGUgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHNlbC5jb2xsYXBzZVRvRW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgSVBhbmVGb3JtYXR0ZXIgfSBmcm9tIFwiLi9JUGFuZUZvcm1hdHRlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvZGVQYW5lU3R5bGVGb3JtYXR0ZXIgaW1wbGVtZW50cyBJUGFuZUZvcm1hdHRlcntcclxuICAgIGdldCBjdXJyZW50UGFuZSgpOiBIVE1MRGl2RWxlbWVudHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYW5lO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcGFuZTpIVE1MRGl2RWxlbWVudCl7XHJcbiAgICAgICAgdGhpcy5wYW5lLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSBcIlRhYlwiKXtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBhbmUuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSBcIlRhYlwiKXtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGxldCBzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkhO1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uLmNvbGxhcHNlVG9TdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJhbmdlID0gc2VsZWN0aW9uLmdldFJhbmdlQXQoMCk7XHJcbiAgICAgICAgICAgICAgICByYW5nZS5pbnNlcnROb2RlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiICAgIFwiKSk7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24uY29sbGFwc2VUb0VuZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHRlcm5DYWxsIH0gZnJvbSBcIi4vRXh0ZXJuQ2FsbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFueXsgICAgICAgIFxyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWU6c3RyaW5nID0gXCJ+YW55XCI7ICBcclxuICAgIFxyXG4gICAgc3RhdGljIG1haW4gPSBcIn5tYWluXCI7XHJcbiAgICBzdGF0aWMgZXh0ZXJuVG9TdHJpbmcgPSBFeHRlcm5DYWxsLm9mKFwifnRvU3RyaW5nXCIpO1xyXG59XHJcbiIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJvb2xlYW5UeXBle1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+Ym9vbGVhblwiO1xyXG59IiwiaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vY29tcGlsZXIvbGV4aW5nL0tleXdvcmRzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udmVydHtcclxuICAgIHN0YXRpYyBzdHJpbmdUb051bWJlcih2YWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBOdW1iZXIodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzdHJpbmdUb0Jvb2xlYW4odmFsdWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKSA9PSBLZXl3b3Jkcy50cnVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi9Xb3JsZE9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlY29yYXRpb257XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC50eXBlTmFtZTtcclxuICAgIHN0YXRpYyB0eXBlTmFtZSA9IFwifmRlY29yYXRpb25cIjtcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlbGVnYXRle1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+ZGVsZWdhdGVcIjtcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxufSIsImV4cG9ydCBjbGFzcyBFbnRyeVBvaW50QXR0cmlidXRle1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIn5lbnRyeVBvaW50XCI7XHJcbn0iLCJleHBvcnQgY2xhc3MgRXh0ZXJuQ2FsbHtcclxuICAgIHN0YXRpYyBvZihuYW1lOnN0cmluZywgLi4uYXJnczpzdHJpbmdbXSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFeHRlcm5DYWxsKG5hbWUsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIGFyZ3M6c3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOnN0cmluZywgLi4uYXJnczpzdHJpbmdbXSl7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi9Xb3JsZE9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEl0ZW17XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWUgPSBcIn5pdGVtXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC50eXBlTmFtZTtcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExpc3R7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWUgPSBcIn5saXN0XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNvbnRhaW5zID0gXCJ+Y29udGFpbnNcIjtcclxuXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWVQYXJhbWV0ZXIgPSBcIn50eXBlTmFtZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNvdW50UGFyYW1ldGVyID0gXCJ+Y291bnRcIjtcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE51bWJlclR5cGV7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWUgPSBcIn5udW1iZXJcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxufSIsImltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vV29ybGRPYmplY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGFjZSB7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC50eXBlTmFtZTtcclxuICAgIHN0YXRpYyB0eXBlTmFtZSA9IFwifnBsYWNlXCI7XHJcblxyXG4gICAgc3RhdGljIGlzUGxheWVyU3RhcnQgPSBcIn5pc1BsYXllclN0YXJ0XCI7XHJcbn0iLCJpbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuL1dvcmxkT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVye1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lID0gXCJ+cGxheWVyXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC50eXBlTmFtZTsgICAgXHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTYXl7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWUgPSBcIn5zYXlcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0cmluZ1R5cGV7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn5zdHJpbmdcIjtcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVuZGVyc3RhbmRpbmd7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn51bmRlcnN0YW5kaW5nXCI7XHJcblxyXG4gICAgc3RhdGljIGRlc2NyaWJpbmcgPSBcIn5kZXNjcmliaW5nXCI7ICBcclxuICAgIHN0YXRpYyBtb3ZpbmcgPSBcIn5tb3ZpbmdcIjtcclxuICAgIHN0YXRpYyBkaXJlY3Rpb24gPSBcIn5kaXJlY3Rpb25cIjtcclxuICAgIHN0YXRpYyB0YWtpbmcgPSBcIn50YWtpbmdcIjtcclxuICAgIHN0YXRpYyBpbnZlbnRvcnkgPSBcIn5pbnZlbnRvcnlcIjtcclxuICAgIHN0YXRpYyBkcm9wcGluZyA9IFwifmRyb3BwaW5nXCI7XHJcblxyXG4gICAgc3RhdGljIGFjdGlvbiA9IFwifmFjdGlvblwiO1xyXG4gICAgc3RhdGljIG1lYW5pbmcgPSBcIn5tZWFuaW5nXCI7ICBcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdvcmxkT2JqZWN0IHtcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHN0YXRpYyB0eXBlTmFtZSA9IFwifndvcmxkT2JqZWN0XCI7XHJcblxyXG4gICAgc3RhdGljIGRlc2NyaXB0aW9uID0gXCJ+ZGVzY3JpcHRpb25cIjtcclxuICAgIHN0YXRpYyBjb250ZW50cyA9IFwifmNvbnRlbnRzXCI7ICAgIFxyXG4gICAgc3RhdGljIG9ic2VydmF0aW9uID0gXCJ+b2JzZXJ2YXRpb25cIjtcclxuXHJcbiAgICBzdGF0aWMgZGVzY3JpYmUgPSBcIn5kZXNjcmliZVwiO1xyXG4gICAgc3RhdGljIG9ic2VydmUgPSBcIn5vYnNlcnZlXCI7XHJcbiAgICBcclxuICAgIHN0YXRpYyB2aXNpYmxlID0gXCJ+dmlzaWJsZVwiO1xyXG59IiwiaW1wb3J0IHsgVGFsb25JZGUgfSBmcm9tIFwiLi9UYWxvbklkZVwiO1xyXG5cclxuXHJcbnZhciBpZGUgPSBuZXcgVGFsb25JZGUoKTsiLCJleHBvcnQgZW51bSBFdmFsdWF0aW9uUmVzdWx0e1xyXG4gICAgQ29udGludWUsXHJcbiAgICBTdXNwZW5kRm9ySW5wdXRcclxufSIsImltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBTdGFja0ZyYW1lIH0gZnJvbSBcIi4vU3RhY2tGcmFtZVwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuLi9jb21tb24vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWV0aG9kQWN0aXZhdGlvbntcclxuICAgIG1ldGhvZD86TWV0aG9kO1xyXG4gICAgc3RhY2tGcmFtZTpTdGFja0ZyYW1lO1xyXG4gICAgc3RhY2s6UnVudGltZUFueVtdID0gW107XHJcblxyXG4gICAgc3RhY2tTaXplKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2subGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHBlZWsoKXtcclxuICAgICAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFN0YWNrIEltYmFsYW5jZSEgQXR0ZW1wdGVkIHRvIHBlZWsgYW4gZW1wdHkgc3RhY2suYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5zdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIDFdO1xyXG4gICAgfVxyXG5cclxuICAgIHBvcCgpe1xyXG4gICAgICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgU3RhY2sgSW1iYWxhbmNlISBBdHRlbXB0ZWQgdG8gcG9wIGFuIGVtcHR5IHN0YWNrLmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2sucG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVzaChydW50aW1lQW55OlJ1bnRpbWVBbnkpe1xyXG4gICAgICAgIHRoaXMuc3RhY2sucHVzaChydW50aW1lQW55KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXRob2Q6TWV0aG9kKXtcclxuICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcclxuICAgICAgICB0aGlzLnN0YWNrRnJhbWUgPSBuZXcgU3RhY2tGcmFtZShtZXRob2QpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgT3BDb2RlSGFuZGxlcntcclxuICAgIFxyXG4gICAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGNvZGU6T3BDb2RlO1xyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgbG9nSW50ZXJhY3Rpb24odGhyZWFkOlRocmVhZCwgLi4ucGFyYW1ldGVyczphbnlbXSl7XHJcbiAgICAgICAgbGV0IGZvcm1hdHRlZExpbmUgPSB0aGlzLmNvZGUudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgaWYgKHBhcmFtZXRlcnMgJiYgcGFyYW1ldGVycy5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgZm9ybWF0dGVkTGluZSArPSAnICcgKyBwYXJhbWV0ZXJzLmpvaW4oJyAnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoZm9ybWF0dGVkTGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIHJldHVybiBFdmFsdWF0aW9uUmVzdWx0LkNvbnRpbnVlO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gUnVudGltZVN0YXRle1xyXG4gICAgU3RvcHBlZCxcclxuICAgIExvYWRlZCxcclxuICAgIFN0YXJ0ZWRcclxufSIsImltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0YWNrRnJhbWV7XHJcbiAgICBsb2NhbHM6VmFyaWFibGVbXSA9IFtdO1xyXG4gICAgY3VycmVudEluc3RydWN0aW9uOm51bWJlciA9IC0xO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1ldGhvZDpNZXRob2Qpe1xyXG4gICAgICAgIGZvcih2YXIgcGFyYW1ldGVyIG9mIG1ldGhvZC5wYXJhbWV0ZXJzKXtcclxuICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSBuZXcgVmFyaWFibGUocGFyYW1ldGVyLm5hbWUsIHBhcmFtZXRlci50eXBlISk7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYWxzLnB1c2godmFyaWFibGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IEVudHJ5UG9pbnRBdHRyaWJ1dGUgfSBmcm9tIFwiLi4vbGlicmFyeS9FbnRyeVBvaW50QXR0cmlidXRlXCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vY29tbW9uL09wQ29kZVwiO1xyXG5pbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBQcmludEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9QcmludEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgTm9PcEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Ob09wSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkU3RyaW5nSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRTdHJpbmdIYW5kbGVyXCI7XHJcbmltcG9ydCB7IE5ld0luc3RhbmNlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL05ld0luc3RhbmNlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQ29tbWFuZCB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZUNvbW1hbmRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBSZWFkSW5wdXRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvUmVhZElucHV0SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbW1hbmRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvUGFyc2VDb21tYW5kSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBHb1RvSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0dvVG9IYW5kbGVyXCI7XHJcbmltcG9ydCB7IEhhbmRsZUNvbW1hbmRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvSGFuZGxlQ29tbWFuZEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxhY2UgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVQbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQm9vbGVhbiB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZUJvb2xlYW5cIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUGxheWVyXCI7XHJcbmltcG9ydCB7IFNheSB9IGZyb20gXCIuLi9saWJyYXJ5L1NheVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRW1wdHkgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVFbXB0eVwiO1xyXG5pbXBvcnQgeyBSZXR1cm5IYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvUmV0dXJuSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBTdGF0aWNDYWxsSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1N0YXRpY0NhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYXllciB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZVBsYXllclwiO1xyXG5pbXBvcnQgeyBMb2FkSW5zdGFuY2VIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZEluc3RhbmNlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkTnVtYmVySGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWROdW1iZXJIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9JbnN0YW5jZUNhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRQcm9wZXJ0eUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkUHJvcGVydHlIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRGaWVsZEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkRmllbGRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEV4dGVybmFsQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9FeHRlcm5hbENhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRMb2NhbEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkTG9jYWxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IElMb2dPdXRwdXQgfSBmcm9tIFwiLi9JTG9nT3V0cHV0XCI7XHJcbmltcG9ydCB7IExvYWRUaGlzSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRUaGlzSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBCcmFuY2hSZWxhdGl2ZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9CcmFuY2hSZWxhdGl2ZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0JyYW5jaFJlbGF0aXZlSWZGYWxzZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgQ29uY2F0ZW5hdGVIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvQ29uY2F0ZW5hdGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEFzc2lnblZhcmlhYmxlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0Fzc2lnblZhcmlhYmxlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUeXBlT2ZIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvVHlwZU9mSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJbnZva2VEZWxlZ2F0ZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9JbnZva2VEZWxlZ2F0ZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgQ29tcGFyaXNvbkhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Db21wYXJpc29uSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RhdGUgfSBmcm9tIFwiLi9SdW50aW1lU3RhdGVcIjtcclxuaW1wb3J0IHsgU3RhdGVNYWNoaW5lIH0gZnJvbSBcIi4vY29tbW9uL1N0YXRlTWFjaGluZVwiO1xyXG5pbXBvcnQgeyBTdGF0ZSB9IGZyb20gXCIuL2NvbW1vbi9TdGF0ZVwiO1xyXG5pbXBvcnQgeyBMb2FkQm9vbGVhbkhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkQm9vbGVhbkhhbmRsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvblJ1bnRpbWV7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0ZTpTdGF0ZU1hY2hpbmU8UnVudGltZVN0YXRlPjtcclxuICAgIHByaXZhdGUgdGhyZWFkPzpUaHJlYWQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGhhbmRsZXJzOk1hcDxPcENvZGUsIE9wQ29kZUhhbmRsZXI+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdXNlck91dHB1dDpJT3V0cHV0LCBwcml2YXRlIHJlYWRvbmx5IGxvZ091dHB1dD86SUxvZ091dHB1dCl7XHJcbiAgICAgICAgdGhpcy51c2VyT3V0cHV0ID0gdXNlck91dHB1dDtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlckluc3RhbmNlczpPcENvZGVIYW5kbGVyW10gPSBbXHJcbiAgICAgICAgICAgIG5ldyBOb09wSGFuZGxlcigpLFxyXG4gICAgICAgICAgICBuZXcgTG9hZFN0cmluZ0hhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IFByaW50SGFuZGxlcih0aGlzLnVzZXJPdXRwdXQpLFxyXG4gICAgICAgICAgICBuZXcgTmV3SW5zdGFuY2VIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBSZWFkSW5wdXRIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBQYXJzZUNvbW1hbmRIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBIYW5kbGVDb21tYW5kSGFuZGxlcih0aGlzLnVzZXJPdXRwdXQpLFxyXG4gICAgICAgICAgICBuZXcgR29Ub0hhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IFJldHVybkhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IFN0YXRpY0NhbGxIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBMb2FkSW5zdGFuY2VIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBMb2FkTnVtYmVySGFuZGxlcigpLFxyXG4gICAgICAgICAgICBuZXcgTG9hZEJvb2xlYW5IYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBJbnN0YW5jZUNhbGxIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBMb2FkUHJvcGVydHlIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBMb2FkRmllbGRIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBFeHRlcm5hbENhbGxIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBMb2FkTG9jYWxIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBMb2FkVGhpc0hhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IEJyYW5jaFJlbGF0aXZlSGFuZGxlcigpLFxyXG4gICAgICAgICAgICBuZXcgQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlcigpLFxyXG4gICAgICAgICAgICBuZXcgQ29uY2F0ZW5hdGVIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBBc3NpZ25WYXJpYWJsZUhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IFR5cGVPZkhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IEludm9rZURlbGVnYXRlSGFuZGxlcigpLFxyXG4gICAgICAgICAgICBuZXcgQ29tcGFyaXNvbkhhbmRsZXIoKVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMgPSBuZXcgTWFwPE9wQ29kZSwgT3BDb2RlSGFuZGxlcj4oaGFuZGxlckluc3RhbmNlcy5tYXAoeCA9PiBbeC5jb2RlLCB4XSkpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0gbmV3IFN0YXRlTWFjaGluZTxSdW50aW1lU3RhdGU+KFxyXG4gICAgICAgICAgICBuZXcgU3RhdGU8UnVudGltZVN0YXRlPihcclxuICAgICAgICAgICAgICAgIFJ1bnRpbWVTdGF0ZS5TdG9wcGVkLFxyXG4gICAgICAgICAgICAgICAgKGN1cnJlbnQ6U3RhdGU8UnVudGltZVN0YXRlPikgPT4gY3VycmVudC5zdGF0ZSAhPT0gUnVudGltZVN0YXRlLlN0b3BwZWRcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgbmV3IFN0YXRlPFJ1bnRpbWVTdGF0ZT4oXHJcbiAgICAgICAgICAgICAgICBSdW50aW1lU3RhdGUuTG9hZGVkLFxyXG4gICAgICAgICAgICAgICAgKGN1cnJlbnQ6U3RhdGU8UnVudGltZVN0YXRlPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50LnN0YXRlID09PSBSdW50aW1lU3RhdGUuU3RhcnRlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nT3V0cHV0Py5kZWJ1ZyhcIlRoZSBydW50aW1lIGhhcyBhbHJlYWR5IGJlZW4gc3RhcnRlZCBhbmQgY2FuJ3QgbG9hZCBtb3JlIHR5cGVzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBuZXcgU3RhdGU8UnVudGltZVN0YXRlPihcclxuICAgICAgICAgICAgICAgIFJ1bnRpbWVTdGF0ZS5TdGFydGVkLFxyXG4gICAgICAgICAgICAgICAgKGN1cnJlbnQ6U3RhdGU8UnVudGltZVN0YXRlPikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50LnN0YXRlID09PSBSdW50aW1lU3RhdGUuU3RhcnRlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nT3V0cHV0Py5kZWJ1ZyhcIlRoZSBydW50aW1lIGhhcyBhbHJlYWR5IGJlZW4gc3RhcnRlZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnQuc3RhdGUgPT09IFJ1bnRpbWVTdGF0ZS5TdG9wcGVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dPdXRwdXQ/LmRlYnVnKFwiVGhlIHJ1bnRpbWUgbXVzdCBiZSBsb2FkZWQgd2l0aCB0eXBlcyBwcmlvciB0byBiZWluZyBzdGFydGVkLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydCgpeyAgICAgICAgXHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnRyeU1vdmVUbyhSdW50aW1lU3RhdGUuU3RhcnRlZCkpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwbGFjZXMgPSB0aGlzLnRocmVhZD8uYWxsVHlwZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcih4ID0+IHguYmFzZVR5cGVOYW1lID09IFBsYWNlLnR5cGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKHggPT4gPFJ1bnRpbWVQbGFjZT5NZW1vcnkuYWxsb2NhdGUoeCkpO1xyXG5cclxuICAgICAgICBjb25zdCBnZXRQbGF5ZXJTdGFydCA9IChwbGFjZTpSdW50aW1lUGxhY2UpID0+IDxSdW50aW1lQm9vbGVhbj4ocGxhY2UuZmllbGRzLmdldChQbGFjZS5pc1BsYXllclN0YXJ0KT8udmFsdWUpO1xyXG4gICAgICAgIGNvbnN0IGlzUGxheWVyU3RhcnQgPSAocGxhY2U6UnVudGltZVBsYWNlKSA9PiBnZXRQbGF5ZXJTdGFydChwbGFjZSk/LnZhbHVlID09PSB0cnVlO1xyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50UGxhY2UgPSBwbGFjZXM/LmZpbmQoaXNQbGF5ZXJTdGFydCk7XHJcblxyXG4gICAgICAgIHRoaXMudGhyZWFkIS5jdXJyZW50UGxhY2UgPSBjdXJyZW50UGxhY2U7XHJcblxyXG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMudGhyZWFkPy5rbm93blR5cGVzLmdldChQbGF5ZXIudHlwZU5hbWUpITtcclxuXHJcbiAgICAgICAgdGhpcy50aHJlYWQhLmN1cnJlbnRQbGF5ZXIgPSA8UnVudGltZVBsYXllcj5NZW1vcnkuYWxsb2NhdGUocGxheWVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5ydW5XaXRoKFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKXtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUudHJ5TW92ZVRvKFJ1bnRpbWVTdGF0ZS5TdG9wcGVkKSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE1lbW9yeS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMudGhyZWFkID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGcm9tKHR5cGVzOlR5cGVbXSk6Ym9vbGVhbntcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICh0eXBlcy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgIHRoaXMubG9nT3V0cHV0Py5kZWJ1ZyhcIk5vIHR5cGVzIHdlcmUgcHJvdmlkZWQsIHVuYWJsZSB0byBsb2FkIHJ1bnRpbWUuXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUudHJ5TW92ZVRvKFJ1bnRpbWVTdGF0ZS5Mb2FkZWQpKXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgTWVtb3J5LmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvYWRlZFR5cGVzID0gTWVtb3J5LmxvYWRUeXBlcyh0eXBlcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGVudHJ5UG9pbnQgPSBsb2FkZWRUeXBlcy5maW5kKHggPT4geC5hdHRyaWJ1dGVzLmZpbmRJbmRleChhdHRyaWJ1dGUgPT4gYXR0cmlidXRlIGluc3RhbmNlb2YgRW50cnlQb2ludEF0dHJpYnV0ZSkgPiAtMSk7XHJcbiAgICAgICAgY29uc3QgbWFpbk1ldGhvZCA9IGVudHJ5UG9pbnQ/Lm1ldGhvZHMuZmluZCh4ID0+IHgubmFtZSA9PSBBbnkubWFpbik7ICAgICAgICBcclxuICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gbmV3IE1ldGhvZEFjdGl2YXRpb24obWFpbk1ldGhvZCEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudGhyZWFkID0gbmV3IFRocmVhZChsb2FkZWRUeXBlcywgYWN0aXZhdGlvbik7ICBcclxuICAgICAgICB0aGlzLnRocmVhZC5sb2cgPSB0aGlzLmxvZ091dHB1dDsgICBcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2VuZENvbW1hbmQoaW5wdXQ6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLnJ1bldpdGgoaW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcnVuV2l0aChjb21tYW5kOnN0cmluZyl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gV2UncmUgZ29pbmcgdG8ga2VlcCB0aGVpciBjb21tYW5kIGluIHRoZSB2aXN1YWwgaGlzdG9yeSB0byBtYWtlIHRoaW5ncyBlYXNpZXIgdG8gdW5kZXJzdGFuZC5cclxuXHJcbiAgICAgICAgdGhpcy51c2VyT3V0cHV0LndyaXRlKGNvbW1hbmQpO1xyXG5cclxuICAgICAgICAvLyBOb3cgd2UgY2FuIGdvIGFoZWFkIGFuZCBwcm9jZXNzIHRoZWlyIGNvbW1hbmQuXHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uID0gdGhpcy50aHJlYWQhLmN1cnJlbnRJbnN0cnVjdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKGluc3RydWN0aW9uPy5vcENvZGUgPT0gT3BDb2RlLlJlYWRJbnB1dCl7XHJcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBNZW1vcnkuYWxsb2NhdGVTdHJpbmcoY29tbWFuZCk7XHJcbiAgICAgICAgICAgIHRoaXMudGhyZWFkPy5jdXJyZW50TWV0aG9kLnB1c2godGV4dCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRocmVhZD8ubW92ZU5leHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRocmVhZD8uY3VycmVudEluc3RydWN0aW9uID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRoaXMudGhyZWFkPy5tb3ZlTmV4dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMudGhyZWFkPy5jdXJyZW50SW5zdHJ1Y3Rpb24gPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBleGVjdXRlIGNvbW1hbmQsIG5vIGluc3RydWN0aW9uIGZvdW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICBmb3IobGV0IGluc3RydWN0aW9uID0gdGhpcy5ldmFsdWF0ZUN1cnJlbnRJbnN0cnVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24gPT0gRXZhbHVhdGlvblJlc3VsdC5Db250aW51ZTtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9uID0gdGhpcy5ldmFsdWF0ZUN1cnJlbnRJbnN0cnVjdGlvbigpKXtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRocmVhZD8ubW92ZU5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2goZXgpe1xyXG4gICAgICAgICAgICBpZiAoZXggaW5zdGFuY2VvZiBSdW50aW1lRXJyb3Ipe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dPdXRwdXQ/LmRlYnVnKGBSdW50aW1lIEVycm9yOiAke2V4Lm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ091dHB1dD8uZGVidWcoYFN0YWNrIFRyYWNlOiAke2V4LnN0YWNrfWApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2dPdXRwdXQ/LmRlYnVnKGBFbmNvdW50ZXJlZCB1bmhhbmRsZWQgZXJyb3I6ICR7ZXh9YCk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZXZhbHVhdGVDdXJyZW50SW5zdHJ1Y3Rpb24oKXtcclxuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IHRoaXMudGhyZWFkPy5jdXJyZW50SW5zdHJ1Y3Rpb247XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSB0aGlzLmhhbmRsZXJzLmdldChpbnN0cnVjdGlvbj8ub3BDb2RlISk7XHJcblxyXG4gICAgICAgIGlmIChoYW5kbGVyID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYEVuY291bnRlcmVkIHVuc3VwcG9ydGVkIE9wQ29kZSAnJHtpbnN0cnVjdGlvbj8ub3BDb2RlfSdgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGhhbmRsZXI/LmhhbmRsZSh0aGlzLnRocmVhZCEpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgTWV0aG9kQWN0aXZhdGlvbiB9IGZyb20gXCIuL01ldGhvZEFjdGl2YXRpb25cIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvVW5kZXJzdGFuZGluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxhY2UgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVQbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxheWVyIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lUGxheWVyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFbXB0eSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZUVtcHR5XCI7XHJcbmltcG9ydCB7IElMb2dPdXRwdXQgfSBmcm9tIFwiLi9JTG9nT3V0cHV0XCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vTWV0aG9kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGhyZWFke1xyXG4gICAgYWxsVHlwZXM6VHlwZVtdID0gW107XHJcbiAgICBrbm93blR5cGVzOk1hcDxzdHJpbmcsIFR5cGU+ID0gbmV3IE1hcDxzdHJpbmcsIFR5cGU+KCk7XHJcbiAgICBrbm93blVuZGVyc3RhbmRpbmdzOlR5cGVbXSA9IFtdO1xyXG4gICAga25vd25QbGFjZXM6UnVudGltZVBsYWNlW10gPSBbXTtcclxuICAgIG1ldGhvZHM6TWV0aG9kQWN0aXZhdGlvbltdID0gW107XHJcbiAgICBjdXJyZW50UGxhY2U/OlJ1bnRpbWVQbGFjZTtcclxuICAgIGN1cnJlbnRQbGF5ZXI/OlJ1bnRpbWVQbGF5ZXI7XHJcbiAgICBsb2c/OklMb2dPdXRwdXQ7XHJcbiAgICBcclxuICAgIGdldCBjdXJyZW50TWV0aG9kKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1ldGhvZHNbdGhpcy5tZXRob2RzLmxlbmd0aCAtIDFdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJyZW50SW5zdHJ1Y3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aXZhdGlvbiA9IHRoaXMuY3VycmVudE1ldGhvZDtcclxuICAgICAgICByZXR1cm4gYWN0aXZhdGlvbi5tZXRob2Q/LmJvZHlbYWN0aXZhdGlvbi5zdGFja0ZyYW1lLmN1cnJlbnRJbnN0cnVjdGlvbl07XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IodHlwZXM6VHlwZVtdLCBtZXRob2Q6TWV0aG9kQWN0aXZhdGlvbil7XHJcbiAgICAgICAgdGhpcy5hbGxUeXBlcyA9IHR5cGVzO1xyXG4gICAgICAgIHRoaXMua25vd25UeXBlcyA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlPih0eXBlcy5tYXAodHlwZSA9PiBbdHlwZS5uYW1lLCB0eXBlXSkpO1xyXG4gICAgICAgIHRoaXMua25vd25VbmRlcnN0YW5kaW5ncyA9IHR5cGVzLmZpbHRlcih4ID0+IHguYmFzZVR5cGVOYW1lID09PSBVbmRlcnN0YW5kaW5nLnR5cGVOYW1lKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm1ldGhvZHMucHVzaChtZXRob2QpO1xyXG4gICAgfVxyXG5cclxuICAgIGN1cnJlbnRJbnN0cnVjdGlvblZhbHVlQXM8VD4oKXtcclxuICAgICAgICByZXR1cm4gPFQ+dGhpcy5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgIH1cclxuXHJcbiAgICBhY3RpdmF0ZU1ldGhvZChtZXRob2Q6TWV0aG9kKXtcclxuICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gbmV3IE1ldGhvZEFjdGl2YXRpb24obWV0aG9kKTtcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5jdXJyZW50TWV0aG9kO1xyXG5cclxuICAgICAgICB0aGlzLmxvZz8uZGVidWcoYCR7Y3VycmVudC5tZXRob2Q/Lm5hbWV9ID0+ICR7bWV0aG9kLm5hbWV9YCk7XHJcblxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5wdXNoKGFjdGl2YXRpb24pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBtb3ZlTmV4dCgpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudE1ldGhvZC5zdGFja0ZyYW1lLmN1cnJlbnRJbnN0cnVjdGlvbisrO1xyXG4gICAgfVxyXG5cclxuICAgIGp1bXBUb0xpbmUobGluZU51bWJlcjpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudE1ldGhvZC5zdGFja0ZyYW1lLmN1cnJlbnRJbnN0cnVjdGlvbiA9IGxpbmVOdW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuRnJvbUN1cnJlbnRNZXRob2QoKXtcclxuICAgICAgICBjb25zdCBleHBlY3RSZXR1cm5UeXBlID0gdGhpcy5jdXJyZW50TWV0aG9kLm1ldGhvZCEucmV0dXJuVHlwZSAhPSBcIlwiO1xyXG4gICAgICAgIGNvbnN0IHJldHVybmVkTWV0aG9kID0gdGhpcy5tZXRob2RzLnBvcCgpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZz8uZGVidWcoYCR7dGhpcy5jdXJyZW50TWV0aG9kLm1ldGhvZD8ubmFtZX0gPD0gJHtyZXR1cm5lZE1ldGhvZD8ubWV0aG9kPy5uYW1lfWApO1xyXG5cclxuICAgICAgICBpZiAoIWV4cGVjdFJldHVyblR5cGUpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVFbXB0eSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSByZXR1cm5lZE1ldGhvZD8uc3RhY2sucG9wKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlITtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxhY2UgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lUGxhY2VcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuLi8uLi9jb21tb24vRmllbGRcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVtcHR5IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUVtcHR5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVDb21tYW5kIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUNvbW1hbmRcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQm9vbGVhbiB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVCb29sZWFuXCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVMaXN0IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUxpc3RcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0l0ZW1cIjtcclxuaW1wb3J0IHsgUnVudGltZUl0ZW0gfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSXRlbVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYXllciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgU2F5IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU2F5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTYXkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU2F5XCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZURlY29yYXRpb24gfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lRGVjb3JhdGlvblwiO1xyXG5pbXBvcnQgeyBEZWNvcmF0aW9uIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvRGVjb3JhdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lbW9yeXtcclxuICAgIHByaXZhdGUgc3RhdGljIHR5cGVzQnlOYW1lID0gbmV3IE1hcDxzdHJpbmcsIFR5cGU+KCk7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZWFwID0gbmV3IE1hcDxzdHJpbmcsIFJ1bnRpbWVBbnlbXT4oKTtcclxuXHJcbiAgICBzdGF0aWMgY2xlYXIoKXtcclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgVHlwZT4oKTtcclxuICAgICAgICBNZW1vcnkuaGVhcCA9IG5ldyBNYXA8c3RyaW5nLCBSdW50aW1lQW55W10+KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZpbmRJbnN0YW5jZUJ5TmFtZShuYW1lOnN0cmluZyl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2VzID0gTWVtb3J5LmhlYXAuZ2V0KG5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoIWluc3RhbmNlcyB8fCBpbnN0YW5jZXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiT2JqZWN0IG5vdCBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZXMubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJMb2NhdGVkIG1vcmUgdGhhbiBvbmUgaW5zdGFuY2VcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2VzWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkVHlwZXModHlwZXM6VHlwZVtdKXtcclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgVHlwZT4odHlwZXMubWFwKHggPT4gW3gubmFtZSwgeF0pKTsgICBcclxuICAgICAgICBcclxuICAgICAgICAvLyBPdmVycmlkZSBhbnkgcHJvdmlkZWQgdHlwZSBzdHVicyB3aXRoIHRoZSBhY3R1YWwgcnVudGltZSB0eXBlIGRlZmluaXRpb25zLlxyXG5cclxuICAgICAgICBjb25zdCBwbGFjZSA9IFJ1bnRpbWVQbGFjZS50eXBlO1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBSdW50aW1lSXRlbS50eXBlO1xyXG4gICAgICAgIGNvbnN0IHBsYXllciA9IFJ1bnRpbWVQbGF5ZXIudHlwZTtcclxuICAgICAgICBjb25zdCBkZWNvcmF0aW9uID0gUnVudGltZURlY29yYXRpb24udHlwZTtcclxuXHJcbiAgICAgICAgTWVtb3J5LnR5cGVzQnlOYW1lLnNldChwbGFjZS5uYW1lLCBwbGFjZSk7XHJcbiAgICAgICAgTWVtb3J5LnR5cGVzQnlOYW1lLnNldChpdGVtLm5hbWUsIGl0ZW0pO1xyXG4gICAgICAgIE1lbW9yeS50eXBlc0J5TmFtZS5zZXQocGxheWVyLm5hbWUsIHBsYXllcik7ICBcclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUuc2V0KGRlY29yYXRpb24ubmFtZSwgZGVjb3JhdGlvbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oTWVtb3J5LnR5cGVzQnlOYW1lLnZhbHVlcygpKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGVDb21tYW5kKCk6UnVudGltZUNvbW1hbmR7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lQ29tbWFuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZUJvb2xlYW4odmFsdWU6Ym9vbGVhbik6UnVudGltZUJvb2xlYW57XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lQm9vbGVhbih2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG9jYXRlTnVtYmVyKHZhbHVlOm51bWJlcik6UnVudGltZUludGVnZXJ7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lSW50ZWdlcih2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG9jYXRlU3RyaW5nKHRleHQ6c3RyaW5nKTpSdW50aW1lU3RyaW5ne1xyXG4gICAgICAgIHJldHVybiBuZXcgUnVudGltZVN0cmluZyh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGUodHlwZTpUeXBlKTpSdW50aW1lQW55e1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gTWVtb3J5LmNvbnN0cnVjdEluc3RhbmNlRnJvbSh0eXBlKTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2VQb29sID0gTWVtb3J5LmhlYXAuZ2V0KHR5cGUubmFtZSkgfHwgW107XHJcblxyXG4gICAgICAgIGluc3RhbmNlUG9vbC5wdXNoKGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgTWVtb3J5LmhlYXAuc2V0KHR5cGUubmFtZSwgaW5zdGFuY2VQb29sKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluaXRpYWxpemVWYXJpYWJsZVdpdGgoZmllbGQ6RmllbGQpe1xyXG5cclxuICAgICAgICBjb25zdCB2YXJpYWJsZSA9IE1lbW9yeS5jb25zdHJ1Y3RWYXJpYWJsZUZyb20oZmllbGQpOyAgICAgICAgXHJcbiAgICAgICAgdmFyaWFibGUudmFsdWUgPSBNZW1vcnkuaW5zdGFudGlhdGVEZWZhdWx0VmFsdWVGb3IodmFyaWFibGUsIGZpZWxkLmRlZmF1bHRWYWx1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2YXJpYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjb25zdHJ1Y3RWYXJpYWJsZUZyb20oZmllbGQ6RmllbGQpe1xyXG4gICAgICAgIGlmIChmaWVsZC50eXBlKXtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZShmaWVsZC5uYW1lLCBmaWVsZC50eXBlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBNZW1vcnkudHlwZXNCeU5hbWUuZ2V0KGZpZWxkLnR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKCF0eXBlKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGNvbnN0cnVjdCB1bmtub3duIHR5cGUgJyR7ZmllbGQudHlwZU5hbWV9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZShmaWVsZC5uYW1lLCB0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW50aWF0ZURlZmF1bHRWYWx1ZUZvcih2YXJpYWJsZTpWYXJpYWJsZSwgZGVmYXVsdFZhbHVlOk9iamVjdHx1bmRlZmluZWQpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN3aXRjaCh2YXJpYWJsZS50eXBlIS5uYW1lKXtcclxuICAgICAgICAgICAgY2FzZSBTdHJpbmdUeXBlLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVTdHJpbmcoZGVmYXVsdFZhbHVlID8gPHN0cmluZz5kZWZhdWx0VmFsdWUgOiBcIlwiKTtcclxuICAgICAgICAgICAgY2FzZSBCb29sZWFuVHlwZS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lQm9vbGVhbihkZWZhdWx0VmFsdWUgPyA8Ym9vbGVhbj5kZWZhdWx0VmFsdWUgOiBmYWxzZSk7XHJcbiAgICAgICAgICAgIGNhc2UgTnVtYmVyVHlwZS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lSW50ZWdlcihkZWZhdWx0VmFsdWUgPyA8bnVtYmVyPmRlZmF1bHRWYWx1ZSA6IDApO1xyXG4gICAgICAgICAgICBjYXNlIExpc3QudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZUxpc3QoZGVmYXVsdFZhbHVlID8gdGhpcy5pbnN0YW50aWF0ZUxpc3QoPE9iamVjdFtdPmRlZmF1bHRWYWx1ZSkgOiBbXSk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVFbXB0eSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW50aWF0ZUxpc3QoaXRlbXM6T2JqZWN0W10pe1xyXG4gICAgICAgIGNvbnN0IHJ1bnRpbWVJdGVtczpSdW50aW1lQW55W10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGNvbnN0IGl0ZW0gb2YgaXRlbXMpe1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtTGlzdCA9IDxPYmplY3RbXT5pdGVtO1xyXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IDxudW1iZXI+aXRlbUxpc3RbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVOYW1lID0gPHN0cmluZz5pdGVtTGlzdFsxXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBNZW1vcnkudHlwZXNCeU5hbWUuZ2V0KHR5cGVOYW1lKSE7XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IGN1cnJlbnQgPSAwOyBjdXJyZW50IDwgY291bnQ7IGN1cnJlbnQrKyl7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBNZW1vcnkuYWxsb2NhdGUodHlwZSk7XHJcbiAgICAgICAgICAgICAgICBydW50aW1lSXRlbXMucHVzaChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydW50aW1lSXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY29uc3RydWN0SW5zdGFuY2VGcm9tKHR5cGU6VHlwZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNlZW5UeXBlcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xyXG4gICAgICAgIGxldCBpbmhlcml0YW5jZUNoYWluOlR5cGVbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGN1cnJlbnQ6VHlwZXx1bmRlZmluZWQgPSB0eXBlOyBcclxuICAgICAgICAgICAgY3VycmVudDsgXHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBNZW1vcnkudHlwZXNCeU5hbWUuZ2V0KGN1cnJlbnQuYmFzZVR5cGVOYW1lKSl7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChzZWVuVHlwZXMuaGFzKGN1cnJlbnQubmFtZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJZb3UgY2FuJ3QgaGF2ZSBjeWNsZXMgaW4gYSB0eXBlIGhpZXJhcmNoeVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZWVuVHlwZXMuYWRkKGN1cnJlbnQubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpbmhlcml0YW5jZUNoYWluLnB1c2goY3VycmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBmaXJzdFN5c3RlbVR5cGVBbmNlc3RvckluZGV4ID0gaW5oZXJpdGFuY2VDaGFpbi5maW5kSW5kZXgoeCA9PiB4LmlzU3lzdGVtVHlwZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICBpZiAoZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleCA8IDApe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVHlwZSBtdXN0IHVsdGltYXRlbHkgaW5oZXJpdCBmcm9tIGEgc3lzdGVtIHR5cGVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuYWxsb2NhdGVTeXN0ZW1UeXBlQnlOYW1lKGluaGVyaXRhbmNlQ2hhaW5bZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleF0ubmFtZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaW5zdGFuY2UucGFyZW50VHlwZU5hbWUgPSBpbnN0YW5jZS50eXBlTmFtZTtcclxuICAgICAgICBpbnN0YW5jZS50eXBlTmFtZSA9IGluaGVyaXRhbmNlQ2hhaW5bMF0ubmFtZTtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogSW5oZXJpdCBtb3JlIHRoYW4ganVzdCBmaWVsZHMvbWV0aG9kcy5cclxuICAgICAgICAvLyBUT0RPOiBUeXBlIGNoZWNrIGZpZWxkIGluaGVyaXRhbmNlIGZvciBzaGFkb3dpbmcvb3ZlcnJpZGluZy5cclxuXHJcbiAgICAgICAgLy8gSW5oZXJpdCBmaWVsZHMvbWV0aG9kcyBmcm9tIHR5cGVzIGluIHRoZSBoaWVyYXJjaHkgZnJvbSBsZWFzdCB0byBtb3N0IGRlcml2ZWQuXHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpID0gZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleDsgaSA+PSAwOyBpLS0pe1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VHlwZSA9IGluaGVyaXRhbmNlQ2hhaW5baV07XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgZmllbGQgb2YgY3VycmVudFR5cGUuZmllbGRzKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlID0gdGhpcy5pbml0aWFsaXplVmFyaWFibGVXaXRoKGZpZWxkKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmZpZWxkcy5zZXQoZmllbGQubmFtZSwgdmFyaWFibGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgbWV0aG9kIG9mIGN1cnJlbnRUeXBlLm1ldGhvZHMpe1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UubWV0aG9kcy5zZXQobWV0aG9kLm5hbWUsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGFsbG9jYXRlU3lzdGVtVHlwZUJ5TmFtZSh0eXBlTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHN3aXRjaCh0eXBlTmFtZSl7XHJcbiAgICAgICAgICAgIGNhc2UgUGxhY2UudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVBsYWNlKCk7XHJcbiAgICAgICAgICAgIGNhc2UgSXRlbS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lSXRlbSgpO1xyXG4gICAgICAgICAgICBjYXNlIFBsYXllci50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lUGxheWVyKCk7XHJcbiAgICAgICAgICAgIGNhc2UgTGlzdC50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lTGlzdChbXSk7ICAgICBcclxuICAgICAgICAgICAgY2FzZSBTYXkudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVNheSgpOyAgICBcclxuICAgICAgICAgICAgY2FzZSBEZWNvcmF0aW9uLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVEZWNvcmF0aW9uKCk7ICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6e1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGluc3RhbnRpYXRlIHR5cGUgJyR7dHlwZU5hbWV9J2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFN0YXRlPFQ+eyAgIFxyXG4gICAgc3RhdGljIGVtcHR5PFU+KCk6U3RhdGU8VT57XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0ZTxVPigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlYWRvbmx5IHByZWNvbmRpdGlvbnM6KChjdXJyZW50U3RhdGU6U3RhdGU8VD4pPT5ib29sZWFuKVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHN0YXRlPzpULCBcclxuICAgICAgICAgICAgICAgIC4uLnByZWNvbmRpdGlvbnM6KChjdXJyZW50U3RhdGU6U3RhdGU8VD4pPT5ib29sZWFuKVtdKXtcclxuXHJcbiAgICAgICAgaWYgKHByZWNvbmRpdGlvbnMpe1xyXG4gICAgICAgICAgICBwcmVjb25kaXRpb25zLmZvckVhY2goeCA9PiB0aGlzLnByZWNvbmRpdGlvbnMucHVzaCh4KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgU3RhdGUgfSBmcm9tIFwiLi9TdGF0ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0YXRlTWFjaGluZTxUPntcclxuICAgIHByaXZhdGUgY3VycmVudFN0YXRlOlN0YXRlPFQ+O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBzdGF0ZXNCeUNvbnRlbnQ6TWFwPFR8dW5kZWZpbmVkLCBTdGF0ZTxUPj47XHJcblxyXG4gICAgY29uc3RydWN0b3IoLi4uc3RhdGVzOlN0YXRlPFQ+W10pe1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gU3RhdGUuZW1wdHk8VD4oKTtcclxuICAgICAgICB0aGlzLnN0YXRlc0J5Q29udGVudCA9IG5ldyBNYXA8VHx1bmRlZmluZWQsIFN0YXRlPFQ+PihzdGF0ZXMubWFwKHggPT4gW3guc3RhdGUsIHhdKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTdGF0ZShzdGF0ZTpUKXtcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5zdGF0ZXNCeUNvbnRlbnQuZ2V0KHN0YXRlKTtcclxuXHJcbiAgICAgICAgaWYgKCFjdXJyZW50KXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGdldCB1bmtub3duIHN0YXRlICcke3N0YXRlfWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdGlhbGl6ZVRvKHN0YXRlOlQpeyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSB0aGlzLmdldFN0YXRlKHN0YXRlKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlNb3ZlVG8oc3RhdGU6VCl7XHJcbiAgICAgICAgY29uc3QgYXR0ZW1wdGVkU3RhdGUgPSB0aGlzLmdldFN0YXRlKHN0YXRlKTtcclxuXHJcbiAgICAgICAgaWYgKCFhdHRlbXB0ZWRTdGF0ZS5wcmVjb25kaXRpb25zIS5ldmVyeSh4ID0+IHgodGhpcy5jdXJyZW50U3RhdGUpKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBhdHRlbXB0ZWRTdGF0ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgUnVudGltZUVycm9yIGV4dGVuZHMgRXJyb3J7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQm9vbGVhbiB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVCb29sZWFuXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQXNzaWduVmFyaWFibGVIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuQXNzaWduO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCwgaW5zdGFuY2UsIHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgUnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnZhbHVlID0gKDxSdW50aW1lU3RyaW5nPnZhbHVlKS52YWx1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgUnVudGltZUludGVnZXIpe1xyXG4gICAgICAgICAgICBpbnN0YW5jZS52YWx1ZSA9ICg8UnVudGltZUludGVnZXI+dmFsdWUpLnZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBSdW50aW1lQm9vbGVhbil7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnZhbHVlID0gKDxSdW50aW1lQm9vbGVhbj52YWx1ZSkudmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIkVuY291bnRlcmVkIHVuc3VwcG9ydGVkIHR5cGUgb24gdGhlIHN0YWNrXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcbmltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQnJhbmNoUmVsYXRpdmVIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuQnJhbmNoUmVsYXRpdmU7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aXZlQW1vdW50ID0gPG51bWJlcj50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIHJlbGF0aXZlQW1vdW50KTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmp1bXBUb0xpbmUodGhyZWFkLmN1cnJlbnRNZXRob2Quc3RhY2tGcmFtZS5jdXJyZW50SW5zdHJ1Y3Rpb24gKyByZWxhdGl2ZUFtb3VudCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUJvb2xlYW4gfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQm9vbGVhblwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJyYW5jaFJlbGF0aXZlSWZGYWxzZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5CcmFuY2hSZWxhdGl2ZUlmRmFsc2U7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aXZlQW1vdW50ID0gPG51bWJlcj50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IDxSdW50aW1lQm9vbGVhbj50aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIHJlbGF0aXZlQW1vdW50LCAnLy8nLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmICghdmFsdWUudmFsdWUpeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aHJlYWQuanVtcFRvTGluZSh0aHJlYWQuY3VycmVudE1ldGhvZC5zdGFja0ZyYW1lLmN1cnJlbnRJbnN0cnVjdGlvbiArIHJlbGF0aXZlQW1vdW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgUnVudGltZUJvb2xlYW4gfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQm9vbGVhblwiO1xyXG5pbXBvcnQgeyBSdW50aW1lSW50ZWdlciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJbnRlZ2VyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29tcGFyaXNvbkhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5Db21wYXJlRXF1YWw7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICB2YXIgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuICAgICAgICB2YXIgY29tcGFyYW5kID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCBpbnN0YW5jZSwgY29tcGFyYW5kKTtcclxuXHJcbiAgICAgICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgUnVudGltZVN0cmluZyAmJiBjb21wYXJhbmQgaW5zdGFuY2VvZiBSdW50aW1lU3RyaW5nKXtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gTWVtb3J5LmFsbG9jYXRlQm9vbGVhbihpbnN0YW5jZS52YWx1ZSA9PSBjb21wYXJhbmQudmFsdWUpO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgUnVudGltZUludGVnZXIgJiYgY29tcGFyYW5kIGluc3RhbmNlb2YgUnVudGltZUludGVnZXIpe1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBNZW1vcnkuYWxsb2NhdGVCb29sZWFuKGluc3RhbmNlLnZhbHVlID09IGNvbXBhcmFuZC52YWx1ZSk7XHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaW5zdGFuY2UgaW5zdGFuY2VvZiBSdW50aW1lQm9vbGVhbiAmJiBjb21wYXJhbmQgaW5zdGFuY2VvZiBSdW50aW1lQm9vbGVhbil7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBNZW1vcnkuYWxsb2NhdGVCb29sZWFuKGluc3RhbmNlLnZhbHVlID09PSBjb21wYXJhbmQudmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCwgYExPRzogJHtpbnN0YW5jZS52YWx1ZX06JHt0eXBlb2YgaW5zdGFuY2UudmFsdWV9ID09ICR7Y29tcGFyYW5kLnZhbHVlfToke3R5cGVvZiBjb21wYXJhbmQudmFsdWV9IC0+ICR7dmFsdWV9YCk7XHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYEVuY291bnRlcmVkIHR5cGUgbWlzbWF0Y2ggb24gc3RhY2sgZHVyaW5nIGNvbXBhcmlzb246ICR7aW5zdGFuY2U/LnR5cGVOYW1lfSA9PSAke2NvbXBhcmFuZD8udHlwZU5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmNhdGVuYXRlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLkNvbmNhdGVuYXRlO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBsYXN0ID0gPFJ1bnRpbWVTdHJpbmc+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcbiAgICAgICAgY29uc3QgZmlyc3QgPSA8UnVudGltZVN0cmluZz50aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGZpcnN0LnZhbHVlLCBsYXN0LnZhbHVlKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29uY2F0ZW5hdGVkID0gTWVtb3J5LmFsbG9jYXRlU3RyaW5nKGZpcnN0LnZhbHVlICsgXCIgXCIgKyBsYXN0LnZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChjb25jYXRlbmF0ZWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuaW50ZXJmYWNlIElJbmRleGFibGV7XHJcbiAgICBbbmFtZTpzdHJpbmddOiguLi5hcmdzOlJ1bnRpbWVBbnlbXSk9PlJ1bnRpbWVBbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFeHRlcm5hbENhbGxIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuRXh0ZXJuYWxDYWxsO1xyXG4gICAgXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMubG9jYXRlRnVuY3Rpb24oaW5zdGFuY2UhLCA8c3RyaW5nPm1ldGhvZE5hbWUpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCwgYCR7aW5zdGFuY2U/LnR5cGVOYW1lfTo6JHttZXRob2ROYW1lfSguLi4ke21ldGhvZC5sZW5ndGh9KWApO1xyXG5cclxuICAgICAgICBjb25zdCBhcmdzOlJ1bnRpbWVBbnlbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWV0aG9kLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgYXJncy5wdXNoKHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpISk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQgPSBtZXRob2QuY2FsbChpbnN0YW5jZSwgLi4uYXJncyk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2gocmVzdWx0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9jYXRlRnVuY3Rpb24oaW5zdGFuY2U6T2JqZWN0LCBtZXRob2ROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuICg8SUluZGV4YWJsZT5pbnN0YW5jZSlbbWV0aG9kTmFtZV07XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lSW50ZWdlciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJbnRlZ2VyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR29Ub0hhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5Hb1RvO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25OdW1iZXIgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGluc3RydWN0aW9uTnVtYmVyKTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBpbnN0cnVjdGlvbk51bWJlciA9PT0gXCJudW1iZXJcIil7XHJcbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8ganVtcCBvbmUgcHJldmlvdXMgdG8gdGhlIGRlc2lyZWQgaW5zdHJ1Y3Rpb24gYmVjYXVzZSBhZnRlciBcclxuICAgICAgICAgICAgLy8gZXZhbHVhdGluZyB0aGlzIGdvdG8gd2UnbGwgbW92ZSBmb3J3YXJkICh3aGljaCB3aWxsIG1vdmUgdG8gdGhlIGRlc2lyZWQgb25lKS5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRocmVhZC5qdW1wVG9MaW5lKGluc3RydWN0aW9uTnVtYmVyIC0gMSk7XHJcbiAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGdvdG9cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQ29tbWFuZCB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVDb21tYW5kXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9VbmRlcnN0YW5kaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVVbmRlcnN0YW5kaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVVuZGVyc3RhbmRpbmdcIjtcclxuaW1wb3J0IHsgTWVhbmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L01lYW5pbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVMaXN0IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUxpc3RcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYWNlIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVBsYWNlXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxheWVyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGF5ZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lUGxheWVyXCI7XHJcbmltcG9ydCB7IExvYWRQcm9wZXJ0eUhhbmRsZXIgfSBmcm9tIFwiLi9Mb2FkUHJvcGVydHlIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFByaW50SGFuZGxlciB9IGZyb20gXCIuL1ByaW50SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJbnN0YW5jZUNhbGxIYW5kbGVyIH0gZnJvbSBcIi4vSW5zdGFuY2VDYWxsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBFdmVudFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL0V2ZW50VHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRGVsZWdhdGUgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lRGVsZWdhdGVcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lSXRlbSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJdGVtXCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSGFuZGxlQ29tbWFuZEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5IYW5kbGVDb21tYW5kO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgb3V0cHV0OklPdXRwdXQpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgaWYgKCEoY29tbWFuZCBpbnN0YW5jZW9mIFJ1bnRpbWVDb21tYW5kKSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFVuYWJsZSB0byBoYW5kbGUgYSBub24tY29tbWFuZCwgZm91bmQgJyR7Y29tbWFuZH1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IGNvbW1hbmQuYWN0aW9uIS52YWx1ZTtcclxuICAgICAgICBjb25zdCB0YXJnZXROYW1lID0gY29tbWFuZC50YXJnZXROYW1lIS52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGAnJHthY3Rpb259ICR7dGFyZ2V0TmFtZX0nYCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVuZGVyc3RhbmRpbmdzQnlBY3Rpb24gPSBuZXcgTWFwPE9iamVjdCwgVHlwZT4odGhyZWFkLmtub3duVW5kZXJzdGFuZGluZ3MubWFwKHggPT4gW3guZmllbGRzLmZpbmQoZmllbGQgPT4gZmllbGQubmFtZSA9PSBVbmRlcnN0YW5kaW5nLmFjdGlvbik/LmRlZmF1bHRWYWx1ZSEsIHhdKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVuZGVyc3RhbmRpbmcgPSB1bmRlcnN0YW5kaW5nc0J5QWN0aW9uLmdldChhY3Rpb24pO1xyXG5cclxuICAgICAgICBpZiAoIXVuZGVyc3RhbmRpbmcpe1xyXG4gICAgICAgICAgICB0aGlzLm91dHB1dC53cml0ZShcIkkgZG9uJ3Qga25vdyBob3cgdG8gZG8gdGhhdC5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1lYW5pbmdGaWVsZCA9IHVuZGVyc3RhbmRpbmcuZmllbGRzLmZpbmQoeCA9PiB4Lm5hbWUgPT0gVW5kZXJzdGFuZGluZy5tZWFuaW5nKTtcclxuXHJcbiAgICAgICAgY29uc3QgbWVhbmluZyA9IHRoaXMuZGV0ZXJtaW5lTWVhbmluZ0Zvcig8c3RyaW5nPm1lYW5pbmdGaWVsZD8uZGVmYXVsdFZhbHVlISk7XHJcbiAgICAgICAgY29uc3QgYWN0dWFsVGFyZ2V0ID0gdGhpcy5pbmZlclRhcmdldEZyb20odGhyZWFkLCB0YXJnZXROYW1lLCBtZWFuaW5nKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoIWFjdHVhbFRhcmdldCl7XHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0LndyaXRlKFwiSSBkb24ndCBrbm93IHdoYXQgeW91J3JlIHJlZmVycmluZyB0by5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXRjaChtZWFuaW5nKXtcclxuICAgICAgICAgICAgY2FzZSBNZWFuaW5nLkRlc2NyaWJpbmc6e1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZSh0aHJlYWQsIGFjdHVhbFRhcmdldCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBNZWFuaW5nLk1vdmluZzogeyAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRQbGFjZSA9IDxSdW50aW1lUGxhY2U+YWN0dWFsVGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFBsYWNlID0gdGhyZWFkLmN1cnJlbnRQbGFjZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aHJlYWQuY3VycmVudFBsYWNlID0gbmV4dFBsYWNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaWJlKHRocmVhZCwgYWN0dWFsVGFyZ2V0LCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhaXNlRXZlbnQodGhyZWFkLCBuZXh0UGxhY2UsIEV2ZW50VHlwZS5QbGF5ZXJFbnRlcnNQbGFjZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhaXNlRXZlbnQodGhyZWFkLCBjdXJyZW50UGxhY2UhLCBFdmVudFR5cGUuUGxheWVyRXhpdHNQbGFjZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuVGFraW5nOiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIShhY3R1YWxUYXJnZXQgaW5zdGFuY2VvZiBSdW50aW1lSXRlbSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3V0cHV0LndyaXRlKFwiSSBjYW4ndCB0YWtlIHRoYXQuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gdGhyZWFkLmN1cnJlbnRQbGFjZSEuZ2V0Q29udGVudHNGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgbGlzdC5pdGVtcyA9IGxpc3QuaXRlbXMuZmlsdGVyKHggPT4geC50eXBlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSB0YXJnZXROYW1lLnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnZlbnRvcnkgPSB0aHJlYWQuY3VycmVudFBsYXllciEuZ2V0Q29udGVudHNGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgaW52ZW50b3J5Lml0ZW1zLnB1c2goYWN0dWFsVGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaWJlKHRocmVhZCwgdGhyZWFkLmN1cnJlbnRQbGFjZSEsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTWVhbmluZy5JbnZlbnRvcnk6e1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW52ZW50b3J5ID0gKDxSdW50aW1lUGxheWVyPmFjdHVhbFRhcmdldCkuZ2V0Q29udGVudHNGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYW1lQW5kVG90YWxDb250ZW50cyh0aHJlYWQsIGludmVudG9yeSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTWVhbmluZy5Ecm9wcGluZzp7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gdGhyZWFkLmN1cnJlbnRQbGF5ZXIhLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgICAgIGxpc3QuaXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGFyZ2V0TmFtZS50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgY29udGVudHMgPSB0aHJlYWQuY3VycmVudFBsYWNlIS5nZXRDb250ZW50c0ZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50cy5pdGVtcy5wdXNoKGFjdHVhbFRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZSh0aHJlYWQsIHRocmVhZC5jdXJyZW50UGxhY2UhLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuc3VwcG9ydGVkIG1lYW5pbmcgZm91bmRcIik7XHJcbiAgICAgICAgfSAgXHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJhaXNlRXZlbnQodGhyZWFkOlRocmVhZCwgbG9jYXRpb246UnVudGltZVBsYWNlLCB0eXBlOkV2ZW50VHlwZSl7XHJcbiAgICAgICAgY29uc3QgZXZlbnRzID0gQXJyYXkuZnJvbShsb2NhdGlvbi5tZXRob2RzLnZhbHVlcygpISkuZmlsdGVyKHggPT4geC5ldmVudFR5cGUgPT0gdHlwZSk7XHJcblxyXG4gICAgICAgIGZvcihjb25zdCBldmVudCBvZiBldmVudHMpe1xyXG4gICAgICAgICAgICBjb25zdCBtZXRob2QgPSBsb2NhdGlvbi5tZXRob2RzLmdldChldmVudC5uYW1lKSE7XHJcbiAgICAgICAgICAgIG1ldGhvZC5hY3R1YWxQYXJhbWV0ZXJzID0gW1ZhcmlhYmxlLmZvclRoaXMobmV3IFR5cGUobG9jYXRpb24/LnR5cGVOYW1lISwgbG9jYXRpb24/LnBhcmVudFR5cGVOYW1lISksIGxvY2F0aW9uKV07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IG5ldyBSdW50aW1lRGVsZWdhdGUobWV0aG9kKTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goZGVsZWdhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluZmVyVGFyZ2V0RnJvbSh0aHJlYWQ6VGhyZWFkLCB0YXJnZXROYW1lOnN0cmluZywgbWVhbmluZzpNZWFuaW5nKTpSdW50aW1lV29ybGRPYmplY3R8dW5kZWZpbmVke1xyXG4gICAgICAgIGNvbnN0IGxvb2t1cEluc3RhbmNlID0gKG5hbWU6c3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeXsgICAgIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDxSdW50aW1lV29ybGRPYmplY3Q+TWVtb3J5LmZpbmRJbnN0YW5jZUJ5TmFtZShuYW1lKTtcclxuICAgICAgICAgICAgfSBjYXRjaChleCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKG1lYW5pbmcgPT09IE1lYW5pbmcuTW92aW5nKXtcclxuICAgICAgICAgICAgY29uc3QgcGxhY2VOYW1lID0gPFJ1bnRpbWVTdHJpbmc+dGhyZWFkLmN1cnJlbnRQbGFjZT8uZmllbGRzLmdldChgfiR7dGFyZ2V0TmFtZX1gKT8udmFsdWU7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXBsYWNlTmFtZSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbG9va3VwSW5zdGFuY2UocGxhY2VOYW1lLnZhbHVlKTsgICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2UgaWYgKG1lYW5pbmcgPT09IE1lYW5pbmcuSW52ZW50b3J5KXtcclxuICAgICAgICAgICAgcmV0dXJuIGxvb2t1cEluc3RhbmNlKFBsYXllci50eXBlTmFtZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLkRlc2NyaWJpbmcpe1xyXG4gICAgICAgICAgICBpZiAoIXRhcmdldE5hbWUpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRocmVhZC5jdXJyZW50UGxhY2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlQ29udGVudHMgPSB0aHJlYWQuY3VycmVudFBsYWNlPy5nZXRDb250ZW50c0ZpZWxkKCkhO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaXRlbU9yRGVjb3JhdGlvbiA9IHBsYWNlQ29udGVudHMuaXRlbXMuZmluZCh4ID0+IHgudHlwZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gdGFyZ2V0TmFtZS50b0xvd2VyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtT3JEZWNvcmF0aW9uIGluc3RhbmNlb2YgUnVudGltZVdvcmxkT2JqZWN0KXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtT3JEZWNvcmF0aW9uO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbG9va3VwSW5zdGFuY2UodGhyZWFkLmN1cnJlbnRQbGFjZT8udHlwZU5hbWUhKTsgICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2UgaWYgKG1lYW5pbmcgPT09IE1lYW5pbmcuVGFraW5nKXtcclxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IHRocmVhZC5jdXJyZW50UGxhY2UhLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgY29uc3QgbWF0Y2hpbmdJdGVtcyA9IGxpc3QuaXRlbXMuZmlsdGVyKHggPT4geC50eXBlTmFtZS50b0xvd2VyQ2FzZSgpID09PSB0YXJnZXROYW1lLnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKG1hdGNoaW5nSXRlbXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIDxSdW50aW1lV29ybGRPYmplY3Q+bWF0Y2hpbmdJdGVtc1swXTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1lYW5pbmcgPT09IE1lYW5pbmcuRHJvcHBpbmcpe1xyXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gdGhyZWFkLmN1cnJlbnRQbGF5ZXIhLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgY29uc3QgbWF0Y2hpbmdJdGVtcyA9IGxpc3QuaXRlbXMuZmlsdGVyKHggPT4geC50eXBlTmFtZS50b0xvd2VyQ2FzZSgpID09PSB0YXJnZXROYW1lLnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKG1hdGNoaW5nSXRlbXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIDxSdW50aW1lV29ybGRPYmplY3Q+bWF0Y2hpbmdJdGVtc1swXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG5hbWVBbmRUb3RhbENvbnRlbnRzKHRocmVhZDpUaHJlYWQsIGNvbnRlbnRzOlJ1bnRpbWVMaXN0KXtcclxuICAgICAgICBjb25zdCBuYW1lcyA9IGNvbnRlbnRzLml0ZW1zLm1hcCh4ID0+IHgudHlwZU5hbWUpO1xyXG5cclxuICAgICAgICBjb25zdCBuYW1lc1dpdGhDb3VudCA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XHJcblxyXG4gICAgICAgIGZvcihjb25zdCBuYW1lIG9mIG5hbWVzKXtcclxuICAgICAgICAgICAgaWYgKCFuYW1lc1dpdGhDb3VudC5oYXMobmFtZSkpe1xyXG4gICAgICAgICAgICAgICAgbmFtZXNXaXRoQ291bnQuc2V0KG5hbWUsIDEpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY291bnQgPSBuYW1lc1dpdGhDb3VudC5nZXQobmFtZSkhO1xyXG4gICAgICAgICAgICAgICAgbmFtZXNXaXRoQ291bnQuc2V0KG5hbWUsIGNvdW50ICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5hbWVkVmFsdWVzOnN0cmluZ1tdID0gW107XHJcblxyXG4gICAgICAgIGZvcihjb25zdCBbbmFtZSwgdmFsdWVdIG9mIG5hbWVzV2l0aENvdW50KXtcclxuICAgICAgICAgICAgbmFtZWRWYWx1ZXMucHVzaChgJHt2YWx1ZX0gJHtuYW1lfShzKWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmFtZWRWYWx1ZXMuZm9yRWFjaCh4ID0+IHRoaXMub3V0cHV0LndyaXRlKHgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlc2NyaWJlKHRocmVhZDpUaHJlYWQsIHRhcmdldDpSdW50aW1lV29ybGRPYmplY3QsIGlzU2hhbGxvd0Rlc2NyaXB0aW9uOmJvb2xlYW4pe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKCFpc1NoYWxsb3dEZXNjcmlwdGlvbil7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRzID0gdGFyZ2V0LmdldEZpZWxkQXNMaXN0KFdvcmxkT2JqZWN0LmNvbnRlbnRzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpYmVDb250ZW50cyh0aHJlYWQsIGNvbnRlbnRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc2NyaWJlID0gdGFyZ2V0Lm1ldGhvZHMuZ2V0KFdvcmxkT2JqZWN0LmRlc2NyaWJlKSE7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlLmFjdHVhbFBhcmFtZXRlcnMudW5zaGlmdChWYXJpYWJsZS5mb3JUaGlzKG5ldyBUeXBlKHRhcmdldD8udHlwZU5hbWUhLCB0YXJnZXQ/LnBhcmVudFR5cGVOYW1lISksIHRhcmdldCkpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKG5ldyBSdW50aW1lRGVsZWdhdGUoZGVzY3JpYmUpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9ic2VydmUodGhyZWFkOlRocmVhZCwgdGFyZ2V0OlJ1bnRpbWVXb3JsZE9iamVjdCl7XHJcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZSA9IHRhcmdldC5tZXRob2RzLmdldChXb3JsZE9iamVjdC5vYnNlcnZlKSE7XHJcblxyXG4gICAgICAgIG9ic2VydmUuYWN0dWFsUGFyYW1ldGVycy51bnNoaWZ0KFZhcmlhYmxlLmZvclRoaXMobmV3IFR5cGUodGFyZ2V0Py50eXBlTmFtZSEsIHRhcmdldD8ucGFyZW50VHlwZU5hbWUhKSwgdGFyZ2V0KSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2gobmV3IFJ1bnRpbWVEZWxlZ2F0ZShvYnNlcnZlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXNjcmliZUNvbnRlbnRzKHRocmVhZDpUaHJlYWQsIHRhcmdldDpSdW50aW1lTGlzdCl7XHJcbiAgICAgICAgZm9yKGNvbnN0IGl0ZW0gb2YgdGFyZ2V0Lml0ZW1zKXtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKHRocmVhZCwgPFJ1bnRpbWVXb3JsZE9iamVjdD5pdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXRlcm1pbmVNZWFuaW5nRm9yKGFjdGlvbjpzdHJpbmcpOk1lYW5pbmd7XHJcbiAgICAgICAgY29uc3Qgc3lzdGVtQWN0aW9uID0gYH4ke2FjdGlvbn1gO1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBTdXBwb3J0IGN1c3RvbSBhY3Rpb25zIGJldHRlci5cclxuXHJcbiAgICAgICAgc3dpdGNoKHN5c3RlbUFjdGlvbil7XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy5kZXNjcmliaW5nOiByZXR1cm4gTWVhbmluZy5EZXNjcmliaW5nO1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcubW92aW5nOiByZXR1cm4gTWVhbmluZy5Nb3Zpbmc7XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy5kaXJlY3Rpb246IHJldHVybiBNZWFuaW5nLkRpcmVjdGlvbjtcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLnRha2luZzogcmV0dXJuIE1lYW5pbmcuVGFraW5nO1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcuaW52ZW50b3J5OiByZXR1cm4gTWVhbmluZy5JbnZlbnRvcnk7XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy5kcm9wcGluZzogcmV0dXJuIE1lYW5pbmcuRHJvcHBpbmc7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWVhbmluZy5DdXN0b207XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdGFuY2VDYWxsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLkluc3RhbmNlQ2FsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1ldGhvZE5hbWU/OnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aHJlYWQuY3VycmVudE1ldGhvZDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm1ldGhvZE5hbWUpe1xyXG4gICAgICAgICAgICB0aGlzLm1ldGhvZE5hbWUgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gY3VycmVudC5wb3AoKTtcclxuXHJcbiAgICAgICAgY29uc3QgbWV0aG9kID0gaW5zdGFuY2U/Lm1ldGhvZHMuZ2V0KHRoaXMubWV0aG9kTmFtZSkhO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCwgYCR7aW5zdGFuY2U/LnR5cGVOYW1lfTo6JHt0aGlzLm1ldGhvZE5hbWV9KC4uLiR7bWV0aG9kLnBhcmFtZXRlcnMubGVuZ3RofSlgKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBwYXJhbWV0ZXJWYWx1ZXM6VmFyaWFibGVbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWV0aG9kIS5wYXJhbWV0ZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgY29uc3QgcGFyYW1ldGVyID0gbWV0aG9kIS5wYXJhbWV0ZXJzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGN1cnJlbnQucG9wKCkhO1xyXG4gICAgICAgICAgICBjb25zdCB2YXJpYWJsZSA9IG5ldyBWYXJpYWJsZShwYXJhbWV0ZXIubmFtZSwgcGFyYW1ldGVyLnR5cGUhLCBpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICBwYXJhbWV0ZXJWYWx1ZXMucHVzaCh2YXJpYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEhBQ0s6IFdlIHNob3VsZG4ndCBjcmVhdGUgb3VyIG93biB0eXBlLCB3ZSBzaG91bGQgaW5oZXJlbnRseSBrbm93IHdoYXQgaXQgaXMuXHJcblxyXG4gICAgICAgIHBhcmFtZXRlclZhbHVlcy51bnNoaWZ0KFZhcmlhYmxlLmZvclRoaXMobmV3IFR5cGUoaW5zdGFuY2U/LnR5cGVOYW1lISwgaW5zdGFuY2U/LnBhcmVudFR5cGVOYW1lISksIGluc3RhbmNlKSk7XHJcblxyXG4gICAgICAgIG1ldGhvZC5hY3R1YWxQYXJhbWV0ZXJzID0gcGFyYW1ldGVyVmFsdWVzO1xyXG5cclxuICAgICAgICB0aHJlYWQuYWN0aXZhdGVNZXRob2QobWV0aG9kKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZURlbGVnYXRlIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZURlbGVnYXRlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW52b2tlRGVsZWdhdGVIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuSW52b2tlRGVsZWdhdGU7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKSE7XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJ1bnRpbWVEZWxlZ2F0ZSl7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2YXRpb24gPSB0aHJlYWQuYWN0aXZhdGVNZXRob2QoaW5zdGFuY2Uud3JhcHBlZE1ldGhvZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGludm9rZSBkZWxlZ2F0ZSBmb3Igbm9uLWRlbGVnYXRlIGluc3RhbmNlICcke2luc3RhbmNlfSdgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkQm9vbGVhbkhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5Mb2FkQm9vbGVhbjtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSA8Ym9vbGVhbj50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcbiAgICAgICAgY29uc3QgcnVudGltZVZhbHVlID0gTWVtb3J5LmFsbG9jYXRlQm9vbGVhbih2YWx1ZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2gocnVudGltZVZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIHZhbHVlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkRmllbGRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuTG9hZEZpZWxkO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IGZpZWxkTmFtZSA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb25WYWx1ZUFzPHN0cmluZz4oKTtcclxuXHJcbiAgICAgICAgY29uc3QgZmllbGQgPSBpbnN0YW5jZT8uZmllbGRzLmdldChmaWVsZE5hbWUpO1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGZpZWxkPy52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGAke2luc3RhbmNlPy50eXBlTmFtZX06OiR7ZmllbGROYW1lfToke2ZpZWxkPy50eXBlLm5hbWV9YCwgJy8vJywgdHlwZW9mIHZhbHVlLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkSW5zdGFuY2VIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuTG9hZEluc3RhbmNlO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCB0eXBlTmFtZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHR5cGVOYW1lID09PSBcIn5pdFwiKXtcclxuICAgICAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRocmVhZC5jdXJyZW50UGxhY2UhO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHN1YmplY3QpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFVuYWJsZSB0byBsb2FkIGluc3RhbmNlIGZvciB1bnN1cHBvcnRlZCB0eXBlICcke3R5cGVOYW1lfSdgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZExvY2FsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLkxvYWRMb2NhbDtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvY2FsTmFtZSA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICBjb25zdCBwYXJhbWV0ZXIgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5tZXRob2Q/LmFjdHVhbFBhcmFtZXRlcnMuZmluZCh4ID0+IHgubmFtZSA9PSBsb2NhbE5hbWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHBhcmFtZXRlcj8udmFsdWUhKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGxvY2FsTmFtZSwgJy8vJywgcGFyYW1ldGVyPy52YWx1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZE51bWJlckhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5Mb2FkTnVtYmVyO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSA8bnVtYmVyPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICBjb25zdCBydW50aW1lVmFsdWUgPSBNZW1vcnkuYWxsb2NhdGVOdW1iZXIodmFsdWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHJ1bnRpbWVWYWx1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9JbnN0YW5jZUNhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRUaGlzSGFuZGxlciB9IGZyb20gXCIuL0xvYWRUaGlzSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkUHJvcGVydHlIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuTG9hZFByb3BlcnR5O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZmllbGROYW1lPzpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZmllbGROYW1lKXtcclxuICAgICAgICAgICAgdGhpcy5maWVsZE5hbWUgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeXtcclxuICAgICAgICAgICAgY29uc3QgZmllbGQgPSBpbnN0YW5jZT8uZmllbGRzLmdldCh0aGlzLmZpZWxkTmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZmllbGQ/LnZhbHVlITtcclxuICAgICAgICAgICAgY29uc3QgZ2V0RmllbGQgPSBpbnN0YW5jZT8ubWV0aG9kcy5nZXQoYH5nZXRfJHt0aGlzLmZpZWxkTmFtZX1gKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCBgJHtpbnN0YW5jZT8udHlwZU5hbWV9Ojoke3RoaXMuZmllbGROYW1lfWAsIGB7Z2V0PSR7Z2V0RmllbGQgIT0gdW5kZWZpbmVkfX1gLCAnLy8nLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZ2V0RmllbGQpe1xyXG4gICAgICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaCh2YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9hZFRoaXMgPSBuZXcgTG9hZFRoaXNIYW5kbGVyKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBsb2FkVGhpcy5oYW5kbGUodGhyZWFkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IEV2YWx1YXRpb25SZXN1bHQuQ29udGludWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgSW5zdGFuY2VDYWxsSGFuZGxlcihnZXRGaWVsZC5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXIuaGFuZGxlKHRocmVhZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9nZXRGaWVsZC5hY3R1YWxQYXJhbWV0ZXJzLnB1c2gobmV3IFZhcmlhYmxlKFwifnZhbHVlXCIsIGZpZWxkPy50eXBlISwgdmFsdWUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3RocmVhZC5hY3RpdmF0ZU1ldGhvZChnZXRGaWVsZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgICAgIH0gZmluYWxseXtcclxuICAgICAgICAgICAgdGhpcy5maWVsZE5hbWUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkU3RyaW5nSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLkxvYWRTdHJpbmc7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbiEudmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpe1xyXG4gICAgICAgICAgICBjb25zdCBzdHJpbmdWYWx1ZSA9IG5ldyBSdW50aW1lU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChzdHJpbmdWYWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIkV4cGVjdGVkIGEgc3RyaW5nXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCJcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRUaGlzSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLkxvYWRUaGlzO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLm1ldGhvZD8uYWN0dWFsUGFyYW1ldGVyc1swXS52YWx1ZSE7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV3SW5zdGFuY2VIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuTmV3SW5zdGFuY2U7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHR5cGVOYW1lID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCB0eXBlTmFtZSk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdHlwZU5hbWUgPT09IFwic3RyaW5nXCIpe1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gdGhyZWFkLmtub3duVHlwZXMuZ2V0KHR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlID09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBsb2NhdGUgdHlwZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBNZW1vcnkuYWxsb2NhdGUodHlwZSk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKGluc3RhbmNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5vT3BIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuTm9PcDtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQ29tbWFuZCB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVDb21tYW5kXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyc2VDb21tYW5kSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLlBhcnNlQ29tbWFuZDtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB0ZXh0ID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGlmICh0ZXh0IGluc3RhbmNlb2YgUnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRUZXh0ID0gdGV4dC52YWx1ZTtcclxuICAgICAgICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMucGFyc2VDb21tYW5kKGNvbW1hbmRUZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goY29tbWFuZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBwYXJzZSBjb21tYW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VDb21tYW5kKHRleHQ6c3RyaW5nKTpSdW50aW1lQ29tbWFuZHtcclxuICAgICAgICBjb25zdCBwaWVjZXMgPSB0ZXh0LnNwbGl0KFwiIFwiKTtcclxuICAgICAgICBjb25zdCBjb21tYW5kID0gTWVtb3J5LmFsbG9jYXRlQ29tbWFuZCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbW1hbmQuYWN0aW9uID0gTWVtb3J5LmFsbG9jYXRlU3RyaW5nKHBpZWNlc1swXSk7XHJcbiAgICAgICAgY29tbWFuZC50YXJnZXROYW1lID0gTWVtb3J5LmFsbG9jYXRlU3RyaW5nKHBpZWNlc1sxXSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb21tYW5kO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcbmltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByaW50SGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLlByaW50O1xyXG5cclxuICAgIHByaXZhdGUgb3V0cHV0OklPdXRwdXQ7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3V0cHV0OklPdXRwdXQpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5vdXRwdXQgPSBvdXRwdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0ZXh0IGluc3RhbmNlb2YgUnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0LndyaXRlKHRleHQudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gcHJpbnQsIGVuY291bnRlcmVkIGEgdHlwZSBvbiB0aGUgc3RhY2sgb3RoZXIgdGhhbiBzdHJpbmdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWFkSW5wdXRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuUmVhZElucHV0O1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuU3VzcGVuZEZvcklucHV0O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFbXB0eSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVFbXB0eVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJldHVybkhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5SZXR1cm47XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSByZXR1cm5pbmcgdG9wIHZhbHVlIG9uIHN0YWNrIGJhc2VkIG9uIHJldHVybiB0eXBlIG9mIG1ldGhvZC5cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhyZWFkLmN1cnJlbnRNZXRob2Q7XHJcbiAgICAgICAgY29uc3Qgc2l6ZSA9IGN1cnJlbnQuc3RhY2tTaXplKCk7XHJcbiAgICAgICAgY29uc3QgaGFzUmV0dXJuVHlwZSA9IGN1cnJlbnQubWV0aG9kPy5yZXR1cm5UeXBlICE9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmIChoYXNSZXR1cm5UeXBlKXtcclxuICAgICAgICAgICAgaWYgKHNpemUgPT0gMCl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiRXhwZWN0ZWQgcmV0dXJuIHZhbHVlIGZyb20gbWV0aG9kIGJ1dCBmb3VuZCBubyBpbnN0YW5jZSBvbiB0aGUgc3RhY2tcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2l6ZSA+IDEpe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgU3RhY2sgSW1iYWxhbmNlISBSZXR1cm5pbmcgZnJvbSAnJHtjdXJyZW50Lm1ldGhvZD8ubmFtZX0nIGZvdW5kICcke3NpemV9JyBpbnN0YW5jZXMgbGVmdCBidXQgZXhwZWN0ZWQgb25lLmApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHNpemUgPiAwKXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFN0YWNrIEltYmFsYW5jZSEgUmV0dXJuaW5nIGZyb20gJyR7Y3VycmVudC5tZXRob2Q/Lm5hbWV9JyBmb3VuZCAnJHtzaXplfScgaW5zdGFuY2VzIGxlZnQgYnV0IGV4cGVjdGVkIHplcm8uYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0gdGhyZWFkIS5yZXR1cm5Gcm9tQ3VycmVudE1ldGhvZCgpO1xyXG5cclxuICAgICAgICBpZiAoIShyZXR1cm5WYWx1ZSBpbnN0YW5jZW9mIFJ1bnRpbWVFbXB0eSkpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIHJldHVyblZhbHVlKTtcclxuICAgICAgICAgICAgdGhyZWFkPy5jdXJyZW50TWV0aG9kLnB1c2gocmV0dXJuVmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCAndm9pZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuQ29udGludWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4uL01ldGhvZEFjdGl2YXRpb25cIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdGF0aWNDYWxsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLlN0YXRpY0NhbGw7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IGNhbGxUZXh0ID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIGNvbnN0IHBpZWNlcyA9IGNhbGxUZXh0LnNwbGl0KFwiLlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSBwaWVjZXNbMF07XHJcbiAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IHBpZWNlc1sxXTtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZSA9IHRocmVhZC5rbm93blR5cGVzLmdldCh0eXBlTmFtZSkhO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHR5cGU/Lm1ldGhvZHMuZmluZCh4ID0+IHgubmFtZSA9PT0gbWV0aG9kTmFtZSkhOyAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCwgYCR7dHlwZU5hbWV9Ojoke21ldGhvZE5hbWV9KClgKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmFjdGl2YXRlTWV0aG9kKG1ldGhvZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHlwZU9mSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLlR5cGVPZjtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIHR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKHRocmVhZC5jdXJyZW50TWV0aG9kLnN0YWNrU2l6ZSgpID09IDApe1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IE1lbW9yeS5hbGxvY2F0ZUJvb2xlYW4oZmFsc2UpO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBlZWsoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGlzVHlwZSA9IGluc3RhbmNlPy50eXBlTmFtZSA9PSB0eXBlTmFtZTtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gTWVtb3J5LmFsbG9jYXRlQm9vbGVhbihpc1R5cGUpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gTWVhbmluZ3tcclxuICAgIERlc2NyaWJpbmcsXHJcbiAgICBUYWtpbmcsXHJcbiAgICBNb3ZpbmcsXHJcbiAgICBEaXJlY3Rpb24sXHJcbiAgICBJbnZlbnRvcnksXHJcbiAgICBEcm9wcGluZyxcclxuICAgIFF1aXR0aW5nLFxyXG4gICAgQ3VzdG9tXHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vLi4vY29tbW9uL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVBbnl7XHJcbiAgICBwYXJlbnRUeXBlTmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgdHlwZU5hbWU6c3RyaW5nID0gQW55LnR5cGVOYW1lO1xyXG5cclxuICAgIGZpZWxkczpNYXA8c3RyaW5nLCBWYXJpYWJsZT4gPSBuZXcgTWFwPHN0cmluZywgVmFyaWFibGU+KCk7XHJcbiAgICBtZXRob2RzOk1hcDxzdHJpbmcsIE1ldGhvZD4gPSBuZXcgTWFwPHN0cmluZywgTWV0aG9kPigpO1xyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZU5hbWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVCb29sZWFuIGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBCb29sZWFuVHlwZS50eXBlTmFtZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6Ym9vbGVhbil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLnZhbHVlLnRvU3RyaW5nKCl9OiR7dGhpcy50eXBlTmFtZX1gO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuL1J1bnRpbWVTdHJpbmdcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lQ29tbWFuZCBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGFyZ2V0TmFtZT86UnVudGltZVN0cmluZywgcHVibGljIGFjdGlvbj86UnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVXb3JsZE9iamVjdCB9IGZyb20gXCIuL1J1bnRpbWVXb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBEZWNvcmF0aW9uIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvRGVjb3JhdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVEZWNvcmF0aW9uIGV4dGVuZHMgUnVudGltZVdvcmxkT2JqZWN0e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBEZWNvcmF0aW9uLnBhcmVudFR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBEZWNvcmF0aW9uLnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IERlbGVnYXRlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvRGVsZWdhdGVcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9NZXRob2RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lRGVsZWdhdGUgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IERlbGVnYXRlLnR5cGVOYW1lO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB3cmFwcGVkTWV0aG9kOk1ldGhvZCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVFbXB0eSBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gXCJ+ZW1wdHlcIjtcclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUludGVnZXIgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOm51bWJlcil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lV29ybGRPYmplY3QgfSBmcm9tIFwiLi9SdW50aW1lV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvSXRlbVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUl0ZW0gZXh0ZW5kcyBSdW50aW1lV29ybGRPYmplY3R7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBJdGVtLnR5cGVOYW1lO1xyXG5cclxuICAgIHN0YXRpYyBnZXQgdHlwZSgpOlR5cGV7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IFJ1bnRpbWVXb3JsZE9iamVjdC50eXBlO1xyXG5cclxuICAgICAgICB0eXBlLm5hbWUgPSBJdGVtLnR5cGVOYW1lO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9NZXRob2RcIjtcclxuaW1wb3J0IHsgUGFyYW1ldGVyIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9QYXJhbWV0ZXJcIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tIFwiLi4vLi4vY29tbW9uL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4vUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVMaXN0IGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpdGVtczpSdW50aW1lQW55W10pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5zID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgIGNvbnRhaW5zLm5hbWUgPSBMaXN0LmNvbnRhaW5zO1xyXG4gICAgICAgIGNvbnRhaW5zLnBhcmFtZXRlcnMucHVzaChcclxuICAgICAgICAgICAgbmV3IFBhcmFtZXRlcihMaXN0LnR5cGVOYW1lUGFyYW1ldGVyLCBTdHJpbmdUeXBlLnR5cGVOYW1lKSxcclxuICAgICAgICAgICAgbmV3IFBhcmFtZXRlcihMaXN0LmNvdW50UGFyYW1ldGVyLCBOdW1iZXJUeXBlLnR5cGVOYW1lKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5zLnJldHVyblR5cGUgPSBCb29sZWFuVHlwZS50eXBlTmFtZTtcclxuXHJcbiAgICAgICAgY29udGFpbnMuYm9keS5wdXNoKFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkTG9jYWwoTGlzdC5jb3VudFBhcmFtZXRlciksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRMb2NhbChMaXN0LnR5cGVOYW1lUGFyYW1ldGVyKSwgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5leHRlcm5hbENhbGwoXCJjb250YWluc1R5cGVcIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnJldHVybigpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tZXRob2RzLnNldChMaXN0LmNvbnRhaW5zLCBjb250YWlucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb250YWluc1R5cGUodHlwZU5hbWU6UnVudGltZVN0cmluZywgY291bnQ6UnVudGltZUludGVnZXIpe1xyXG4gICAgICAgIGNvbnN0IGZvdW5kSXRlbXMgPSB0aGlzLml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUgPT09IHR5cGVOYW1lLnZhbHVlKTtcclxuICAgICAgICBjb25zdCBmb3VuZCA9IGZvdW5kSXRlbXMubGVuZ3RoID09PSBjb3VudC52YWx1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIE1lbW9yeS5hbGxvY2F0ZUJvb2xlYW4oZm91bmQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVBsYWNlIGV4dGVuZHMgUnVudGltZVdvcmxkT2JqZWN0e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC5wYXJlbnRUeXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gUGxhY2UudHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIGdldCB0eXBlKCk6VHlwZXtcclxuICAgICAgICBjb25zdCB0eXBlID0gUnVudGltZVdvcmxkT2JqZWN0LnR5cGU7XHJcblxyXG4gICAgICAgIHR5cGUubmFtZSA9IFBsYWNlLnR5cGVOYW1lO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxheWVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVBsYXllciBleHRlbmRzIFJ1bnRpbWVXb3JsZE9iamVjdHtcclxuICAgIHN0YXRpYyBnZXQgdHlwZSgpOlR5cGV7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IFJ1bnRpbWVXb3JsZE9iamVjdC50eXBlO1xyXG5cclxuICAgICAgICB0eXBlLm5hbWUgPSBQbGF5ZXIudHlwZU5hbWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lU2F5IGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIG1lc3NhZ2U6c3RyaW5nID0gXCJcIjtcclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVTdHJpbmcgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgdmFsdWU6c3RyaW5nO1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IFwifnN0cmluZ1wiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gYFwiJHt0aGlzLnZhbHVlfVwiYDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVMaXN0IH0gZnJvbSBcIi4vUnVudGltZUxpc3RcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuL1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVXb3JsZE9iamVjdCBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIGdldCB0eXBlKCk6VHlwZXtcclxuICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoV29ybGRPYmplY3QudHlwZU5hbWUsIFdvcmxkT2JqZWN0LnBhcmVudFR5cGVOYW1lKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjb250ZW50cyA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgIGNvbnRlbnRzLm5hbWUgPSBXb3JsZE9iamVjdC5jb250ZW50cztcclxuICAgICAgICBjb250ZW50cy50eXBlTmFtZSA9IExpc3QudHlwZU5hbWU7XHJcbiAgICAgICAgY29udGVudHMuZGVmYXVsdFZhbHVlID0gW107XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgZGVzY3JpcHRpb24ubmFtZSA9IFdvcmxkT2JqZWN0LmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uLnR5cGVOYW1lID0gU3RyaW5nVHlwZS50eXBlTmFtZTtcclxuICAgICAgICBkZXNjcmlwdGlvbi5kZWZhdWx0VmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICB0eXBlLmZpZWxkcy5wdXNoKGNvbnRlbnRzKTtcclxuICAgICAgICB0eXBlLmZpZWxkcy5wdXNoKGRlc2NyaXB0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRGaWVsZFZhbHVlQnlOYW1lKG5hbWU6c3RyaW5nKTpSdW50aW1lQW55e1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5maWVsZHMuZ2V0KG5hbWUpPy52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGluc3RhbmNlID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYEF0dGVtcHRlZCBmaWVsZCBhY2Nlc3MgZm9yIHVua25vd24gZmllbGQgJyR7bmFtZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29udGVudHNGaWVsZCgpOlJ1bnRpbWVMaXN0e1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEZpZWxkQXNMaXN0KFdvcmxkT2JqZWN0LmNvbnRlbnRzKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRGaWVsZEFzTGlzdChuYW1lOnN0cmluZyk6UnVudGltZUxpc3R7XHJcbiAgICAgICAgcmV0dXJuIDxSdW50aW1lTGlzdD50aGlzLmdldEZpZWxkVmFsdWVCeU5hbWUobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RmllbGRBc1N0cmluZyhuYW1lOnN0cmluZyk6UnVudGltZVN0cmluZ3tcclxuICAgICAgICByZXR1cm4gPFJ1bnRpbWVTdHJpbmc+dGhpcy5nZXRGaWVsZFZhbHVlQnlOYW1lKG5hbWUpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZhcmlhYmxle1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IHRoaXNUeXBlTmFtZSA9IFwifnRoaXNcIjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbmFtZTpzdHJpbmcsIFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHR5cGU6VHlwZSxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyB2YWx1ZT86UnVudGltZUFueSl7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZvclRoaXModHlwZTpUeXBlLCB2YWx1ZT86UnVudGltZUFueSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZShWYXJpYWJsZS50aGlzVHlwZU5hbWUsIHR5cGUsIHZhbHVlKTtcclxuICAgIH1cclxufSJdfQ==
