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
        this.userCommandText.value = "look";
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
    static compareLessThan() {
        return new Instruction(OpCode_1.OpCode.CompareLessThan);
    }
    static add() {
        return new Instruction(OpCode_1.OpCode.Add);
    }
    static loadElement() {
        return new Instruction(OpCode_1.OpCode.LoadElement);
    }
    static setLocal(name) {
        return new Instruction(OpCode_1.OpCode.SetLocal, name);
    }
    static createDelegate(typeName, methodName) {
        return new Instruction(OpCode_1.OpCode.CreateDelegate, `${typeName}:${methodName}`);
    }
    static loadEmpty() {
        return new Instruction(OpCode_1.OpCode.LoadEmpty);
    }
    static newInstance(typeName) {
        return new Instruction(OpCode_1.OpCode.NewInstance, typeName);
    }
    static invokeDelegateOnInstance() {
        return new Instruction(OpCode_1.OpCode.InvokeDelegateOnInstance);
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
    OpCode["CompareLessThan"] = ".compare.lt";
    OpCode["Add"] = ".add";
    OpCode["LoadElement"] = ".load.elem";
    OpCode["SetLocal"] = ".set.local";
    OpCode["CreateDelegate"] = ".new.dlgt";
    OpCode["LoadEmpty"] = ".load.empty";
    OpCode["InvokeDelegateOnInstance"] = ".call.func.inst";
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
        main.body.push(Instruction_1.Instruction.loadString(`Talon Language v.${this.languageVersion}, Compiler v.${this.version}`), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString("================================="), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.staticCall("~globalSays", "~say"), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString("What would you like to do?"), Instruction_1.Instruction.print(), Instruction_1.Instruction.readInput(), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.parseCommand(), Instruction_1.Instruction.handleCommand(), Instruction_1.Instruction.isTypeOf(Delegate_1.Delegate.typeName), Instruction_1.Instruction.branchRelativeIfFalse(2), Instruction_1.Instruction.invokeDelegate(), Instruction_1.Instruction.branchRelative(-4), Instruction_1.Instruction.goTo(7));
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
                        describe.body.push(Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadProperty(WorldObject_1.WorldObject.visible), Instruction_1.Instruction.branchRelativeIfFalse(10), Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadProperty(WorldObject_1.WorldObject.description), Instruction_1.Instruction.loadString(' '), Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.createDelegate(type === null || type === void 0 ? void 0 : type.name, WorldObject_1.WorldObject.observe), Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadProperty(WorldObject_1.WorldObject.contents), Instruction_1.Instruction.instanceCall(List_1.List.map), Instruction_1.Instruction.instanceCall(List_1.List.join), Instruction_1.Instruction.concatenate(), Instruction_1.Instruction.print(), Instruction_1.Instruction.return());
                        type === null || type === void 0 ? void 0 : type.methods.push(describe);
                        const observe = new Method_1.Method();
                        observe.name = WorldObject_1.WorldObject.observe;
                        observe.returnType = StringType_1.StringType.typeName;
                        observe.body.push(Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadProperty(WorldObject_1.WorldObject.visible), Instruction_1.Instruction.branchRelativeIfFalse(4), Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadProperty(WorldObject_1.WorldObject.observation), Instruction_1.Instruction.return(), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.return());
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
List.count = "~count";
List.add = "~add";
List.map = "~map";
List.contains = "~contains";
List.join = "~join";
List.separatorParameter = "~separator";
List.instanceParameter = "~instance";
List.delegateParameter = "~delegate";
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
},{"./library/Variable":132}],78:[function(require,module,exports){
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
const CreateDelegateHandler_1 = require("./handlers/CreateDelegateHandler");
const CompareLessThanHandler_1 = require("./handlers/CompareLessThanHandler");
const AddHandler_1 = require("./handlers/AddHandler");
const LoadElementHandler_1 = require("./handlers/LoadElementHandler");
const SetLocalHandler_1 = require("./handlers/SetLocalHandler");
const LoadEmptyHandler_1 = require("./handlers/LoadEmptyHandler");
const InvokeDelegateOnInstanceHandler_1 = require("./handlers/InvokeDelegateOnInstanceHandler");
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
            new ComparisonHandler_1.ComparisonHandler(),
            new CreateDelegateHandler_1.CreateDelegateHandler(),
            new CompareLessThanHandler_1.CompareLessThanHandler(),
            new AddHandler_1.AddHandler(),
            new LoadElementHandler_1.LoadElementHandler(),
            new SetLocalHandler_1.SetLocalHandler(),
            new LoadEmptyHandler_1.LoadEmptyHandler(),
            new InvokeDelegateOnInstanceHandler_1.InvokeDelegateOnInstanceHandler()
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
},{"../common/OpCode":7,"../library/Any":56,"../library/EntryPointAttribute":61,"../library/Place":66,"../library/Player":67,"./EvaluationResult":73,"./MethodActivation":74,"./RuntimeState":76,"./Thread":79,"./common/Memory":80,"./common/State":81,"./common/StateMachine":82,"./errors/RuntimeError":83,"./handlers/AddHandler":84,"./handlers/AssignVariableHandler":85,"./handlers/BranchRelativeHandler":86,"./handlers/BranchRelativeIfFalseHandler":87,"./handlers/CompareLessThanHandler":88,"./handlers/ComparisonHandler":89,"./handlers/ConcatenateHandler":90,"./handlers/CreateDelegateHandler":91,"./handlers/ExternalCallHandler":92,"./handlers/GoToHandler":93,"./handlers/HandleCommandHandler":94,"./handlers/InstanceCallHandler":95,"./handlers/InvokeDelegateHandler":96,"./handlers/InvokeDelegateOnInstanceHandler":97,"./handlers/LoadBooleanHandler":98,"./handlers/LoadElementHandler":99,"./handlers/LoadEmptyHandler":100,"./handlers/LoadFieldHandler":101,"./handlers/LoadInstanceHandler":102,"./handlers/LoadLocalHandler":103,"./handlers/LoadNumberHandler":104,"./handlers/LoadPropertyHandler":105,"./handlers/LoadStringHandler":106,"./handlers/LoadThisHandler":107,"./handlers/NewInstanceHandler":108,"./handlers/NoOpHandler":109,"./handlers/ParseCommandHandler":110,"./handlers/PrintHandler":111,"./handlers/ReadInputHandler":112,"./handlers/ReturnHandler":113,"./handlers/SetLocalHandler":114,"./handlers/StaticCallHandler":115,"./handlers/TypeOfHandler":116}],79:[function(require,module,exports){
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
},{"../library/Understanding":70,"./MethodActivation":74,"./library/RuntimeEmpty":123}],80:[function(require,module,exports){
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
    static findTypeByName(name) {
        if (!this.typesByName.has(name)) {
            throw new RuntimeError_1.RuntimeError(`Unable to locate type '${name}'`);
        }
        return this.typesByName.get(name);
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
},{"../../library/BooleanType":57,"../../library/Decoration":59,"../../library/Item":63,"../../library/List":64,"../../library/NumberType":65,"../../library/Place":66,"../../library/Player":67,"../../library/Say":68,"../../library/StringType":69,"../errors/RuntimeError":83,"../library/RuntimeBoolean":119,"../library/RuntimeCommand":120,"../library/RuntimeDecoration":121,"../library/RuntimeEmpty":123,"../library/RuntimeInteger":124,"../library/RuntimeItem":125,"../library/RuntimeList":126,"../library/RuntimePlace":127,"../library/RuntimePlayer":128,"../library/RuntimeSay":129,"../library/RuntimeString":130,"../library/Variable":132}],81:[function(require,module,exports){
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
exports.AddHandler = void 0;
const OpCode_1 = require("../../common/OpCode");
const Memory_1 = require("../common/Memory");
const OpCodeHandler_1 = require("../OpCodeHandler");
class AddHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.Add;
    }
    handle(thread) {
        this.logInteraction(thread);
        const first = thread.currentMethod.pop();
        const second = thread.currentMethod.pop();
        const added = Memory_1.Memory.allocateNumber(first.value + second.value);
        thread.currentMethod.push(added);
        return super.handle(thread);
    }
}
exports.AddHandler = AddHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80}],85:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../errors/RuntimeError":83,"../library/RuntimeBoolean":119,"../library/RuntimeInteger":124,"../library/RuntimeString":130}],86:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75}],87:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75}],88:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareLessThanHandler = void 0;
const OpCode_1 = require("../../common/OpCode");
const Memory_1 = require("../common/Memory");
const OpCodeHandler_1 = require("../OpCodeHandler");
class CompareLessThanHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.CompareLessThan;
    }
    handle(thread) {
        this.logInteraction(thread);
        const firstValue = thread.currentMethod.pop();
        const secondValue = thread.currentMethod.pop();
        const isLessThan = Memory_1.Memory.allocateBoolean(firstValue.value < secondValue.value);
        thread.currentMethod.push(isLessThan);
        return super.handle(thread);
    }
}
exports.CompareLessThanHandler = CompareLessThanHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80}],89:[function(require,module,exports){
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
            thread.currentMethod.push(value);
        }
        else {
            throw new RuntimeError_1.RuntimeError(`Encountered type mismatch on stack during comparison: ${instance === null || instance === void 0 ? void 0 : instance.typeName} == ${comparand === null || comparand === void 0 ? void 0 : comparand.typeName}`);
        }
        return super.handle(thread);
    }
}
exports.ComparisonHandler = ComparisonHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80,"../errors/RuntimeError":83,"../library/RuntimeBoolean":119,"../library/RuntimeInteger":124,"../library/RuntimeString":130}],90:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80}],91:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDelegateHandler = void 0;
const OpCode_1 = require("../../common/OpCode");
const Memory_1 = require("../common/Memory");
const RuntimeDelegate_1 = require("../library/RuntimeDelegate");
const Variable_1 = require("../library/Variable");
const OpCodeHandler_1 = require("../OpCodeHandler");
class CreateDelegateHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.CreateDelegate;
    }
    handle(thread) {
        const typeAndMethod = thread.currentInstructionValueAs();
        const implicitThis = thread.currentMethod.pop();
        this.logInteraction(thread, typeAndMethod);
        const parts = typeAndMethod.split(':');
        const typeName = parts[0];
        const methodName = parts[1];
        const type = Memory_1.Memory.findTypeByName(typeName);
        const method = type.methods.find(method => method.name == methodName);
        method.actualParameters.push(Variable_1.Variable.forThis(type, implicitThis));
        const delegate = new RuntimeDelegate_1.RuntimeDelegate(method);
        thread.currentMethod.push(delegate);
        return super.handle(thread);
    }
}
exports.CreateDelegateHandler = CreateDelegateHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80,"../library/RuntimeDelegate":122,"../library/Variable":132}],92:[function(require,module,exports){
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
        if (result) {
            thread.currentMethod.push(result);
        }
        return super.handle(thread);
    }
    locateFunction(instance, methodName) {
        return instance[methodName];
    }
}
exports.ExternalCallHandler = ExternalCallHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":75}],93:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../errors/RuntimeError":83}],94:[function(require,module,exports){
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
},{"../../common/EventType":3,"../../common/OpCode":7,"../../common/Type":9,"../../library/Player":67,"../../library/Understanding":70,"../../library/WorldObject":71,"../OpCodeHandler":75,"../common/Memory":80,"../errors/RuntimeError":83,"../library/Meaning":117,"../library/RuntimeCommand":120,"../library/RuntimeDelegate":122,"../library/RuntimeItem":125,"../library/RuntimeWorldObject":131,"../library/Variable":132}],95:[function(require,module,exports){
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
        try {
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
        }
        finally {
            this.methodName = undefined;
        }
        return super.handle(thread);
    }
}
exports.InstanceCallHandler = InstanceCallHandler;
},{"../../common/OpCode":7,"../../common/Type":9,"../OpCodeHandler":75,"../library/Variable":132}],96:[function(require,module,exports){
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
        const delegate = thread.currentMethod.pop();
        if (delegate instanceof RuntimeDelegate_1.RuntimeDelegate) {
            const activation = thread.activateMethod(delegate.wrappedMethod);
        }
        else {
            throw new RuntimeError_1.RuntimeError(`Unable to invoke delegate for non-delegate instance '${delegate}'`);
        }
        return super.handle(thread);
    }
}
exports.InvokeDelegateHandler = InvokeDelegateHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../errors/RuntimeError":83,"../library/RuntimeDelegate":122}],97:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvokeDelegateOnInstanceHandler = void 0;
const OpCode_1 = require("../../common/OpCode");
const Memory_1 = require("../common/Memory");
const RuntimeError_1 = require("../errors/RuntimeError");
const RuntimeDelegate_1 = require("../library/RuntimeDelegate");
const Variable_1 = require("../library/Variable");
const OpCodeHandler_1 = require("../OpCodeHandler");
class InvokeDelegateOnInstanceHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.InvokeDelegateOnInstance;
    }
    handle(thread) {
        const delegate = thread.currentMethod.pop();
        const instance = thread.currentMethod.pop();
        this.logInteraction(thread, `~anon(${instance.typeName})`);
        if (delegate instanceof RuntimeDelegate_1.RuntimeDelegate) {
            const type = Memory_1.Memory.findTypeByName(instance.typeName);
            const actualParametersWithoutThis = delegate.wrappedMethod.actualParameters.filter(x => x.name != "~this");
            actualParametersWithoutThis.push(Variable_1.Variable.forThis(type, instance));
            delegate.wrappedMethod.actualParameters = actualParametersWithoutThis;
            const activation = thread.activateMethod(delegate.wrappedMethod);
        }
        else {
            throw new RuntimeError_1.RuntimeError(`Unable to invoke delegate for non-delegate instance '${delegate}'`);
        }
        return super.handle(thread);
    }
}
exports.InvokeDelegateOnInstanceHandler = InvokeDelegateOnInstanceHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80,"../errors/RuntimeError":83,"../library/RuntimeDelegate":122,"../library/Variable":132}],98:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80}],99:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadElementHandler = void 0;
const OpCode_1 = require("../../common/OpCode");
const OpCodeHandler_1 = require("../OpCodeHandler");
class LoadElementHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.LoadElement;
    }
    handle(thread) {
        this.logInteraction(thread);
        const elementNumber = thread.currentMethod.pop();
        const list = thread.currentMethod.pop();
        const item = list.items[elementNumber.value];
        thread.currentMethod.push(item);
        return super.handle(thread);
    }
}
exports.LoadElementHandler = LoadElementHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":75}],100:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadEmptyHandler = void 0;
const OpCode_1 = require("../../common/OpCode");
const RuntimeEmpty_1 = require("../library/RuntimeEmpty");
const OpCodeHandler_1 = require("../OpCodeHandler");
class LoadEmptyHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.LoadEmpty;
    }
    handle(thread) {
        this.logInteraction(thread);
        thread.currentMethod.push(new RuntimeEmpty_1.RuntimeEmpty());
        return super.handle(thread);
    }
}
exports.LoadEmptyHandler = LoadEmptyHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../library/RuntimeEmpty":123}],101:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75}],102:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../errors/RuntimeError":83}],103:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75}],104:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80}],105:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../EvaluationResult":73,"../OpCodeHandler":75,"./InstanceCallHandler":95,"./LoadThisHandler":107}],106:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../errors/RuntimeError":83,"../library/RuntimeString":130}],107:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75}],108:[function(require,module,exports){
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
            if (!type) {
                throw new RuntimeError_1.RuntimeError("Unable to locate type");
            }
            const instance = Memory_1.Memory.allocate(type);
            thread.currentMethod.push(instance);
        }
        return super.handle(thread);
    }
}
exports.NewInstanceHandler = NewInstanceHandler;
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80,"../errors/RuntimeError":83}],109:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75}],110:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80,"../errors/RuntimeError":83,"../library/RuntimeString":130}],111:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../errors/RuntimeError":83,"../library/RuntimeString":130}],112:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../EvaluationResult":73,"../OpCodeHandler":75}],113:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../EvaluationResult":73,"../OpCodeHandler":75,"../errors/RuntimeError":83,"../library/RuntimeEmpty":123}],114:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetLocalHandler = void 0;
const OpCode_1 = require("../../common/OpCode");
const Type_1 = require("../../common/Type");
const RuntimeAny_1 = require("../library/RuntimeAny");
const Variable_1 = require("../library/Variable");
const OpCodeHandler_1 = require("../OpCodeHandler");
class SetLocalHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor() {
        super(...arguments);
        this.code = OpCode_1.OpCode.SetLocal;
    }
    handle(thread) {
        var _a, _b, _c;
        const localName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const value = thread.currentMethod.pop();
        this.logInteraction(thread, localName);
        let parameter = (_b = thread.currentMethod.method) === null || _b === void 0 ? void 0 : _b.actualParameters.find(x => x.name == localName);
        if (!parameter) {
            parameter = new Variable_1.Variable(localName, new Type_1.Type(RuntimeAny_1.RuntimeAny.name, ""), undefined);
            (_c = thread.currentMethod.method) === null || _c === void 0 ? void 0 : _c.actualParameters.push(parameter);
        }
        parameter.value = value;
        return super.handle(thread);
    }
}
exports.SetLocalHandler = SetLocalHandler;
},{"../../common/OpCode":7,"../../common/Type":9,"../OpCodeHandler":75,"../library/RuntimeAny":118,"../library/Variable":132}],115:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75}],116:[function(require,module,exports){
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
},{"../../common/OpCode":7,"../OpCodeHandler":75,"../common/Memory":80}],117:[function(require,module,exports){
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
},{}],118:[function(require,module,exports){
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
},{"../../library/Any":56}],119:[function(require,module,exports){
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
},{"../../library/Any":56,"../../library/BooleanType":57,"./RuntimeAny":118}],120:[function(require,module,exports){
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
},{"./RuntimeAny":118}],121:[function(require,module,exports){
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
},{"../../library/Decoration":59,"./RuntimeWorldObject":131}],122:[function(require,module,exports){
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
},{"../../library/Any":56,"../../library/Delegate":60,"./RuntimeAny":118}],123:[function(require,module,exports){
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
},{"../../library/Any":56,"./RuntimeAny":118}],124:[function(require,module,exports){
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
},{"./RuntimeAny":118}],125:[function(require,module,exports){
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
},{"../../library/Item":63,"../../library/WorldObject":71,"./RuntimeWorldObject":131}],126:[function(require,module,exports){
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
const RuntimeString_1 = require("./RuntimeString");
const RuntimeInteger_1 = require("./RuntimeInteger");
const Memory_1 = require("../common/Memory");
const BooleanType_1 = require("../../library/BooleanType");
const Any_1 = require("../../library/Any");
const RuntimeDelegate_1 = require("./RuntimeDelegate");
const RuntimeError_1 = require("../errors/RuntimeError");
class RuntimeList extends RuntimeAny_1.RuntimeAny {
    constructor(items) {
        super();
        this.items = items;
        this.typeName = List_1.List.typeName;
        this.parentTypeName = Any_1.Any.typeName;
        this.defineContainsMethod();
        this.defineMapMethod();
        this.defineAddMethod();
        this.defineCountMethod();
        this.defineJoinMethod();
    }
    defineJoinMethod() {
        const join = new Method_1.Method();
        join.name = List_1.List.join;
        join.parameters.push(new Parameter_1.Parameter(List_1.List.separatorParameter, RuntimeString_1.RuntimeString.name));
        join.returnType = RuntimeString_1.RuntimeString.name;
        join.body.push(Instruction_1.Instruction.loadLocal(List_1.List.separatorParameter), Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.externalCall("joinList"), Instruction_1.Instruction.return());
        this.methods.set(List_1.List.join, join);
    }
    defineCountMethod() {
        const count = new Method_1.Method();
        count.name = List_1.List.count;
        count.returnType = RuntimeInteger_1.RuntimeInteger.name;
        count.body.push(Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.externalCall("countItems"), Instruction_1.Instruction.return());
        this.methods.set(List_1.List.count, count);
    }
    defineAddMethod() {
        const add = new Method_1.Method();
        add.name = List_1.List.add;
        add.parameters.push(new Parameter_1.Parameter(List_1.List.instanceParameter, RuntimeAny_1.RuntimeAny.name));
        add.body.push(Instruction_1.Instruction.loadLocal(List_1.List.instanceParameter), Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.externalCall("addInstance"), Instruction_1.Instruction.return());
        this.methods.set(List_1.List.add, add);
    }
    defineMapMethod() {
        const map = new Method_1.Method();
        map.name = List_1.List.map;
        map.parameters.push(new Parameter_1.Parameter(List_1.List.delegateParameter, RuntimeDelegate_1.RuntimeDelegate.name));
        map.returnType = this.typeName;
        map.body.push(Instruction_1.Instruction.loadNumber(0), Instruction_1.Instruction.setLocal("~localCount"), Instruction_1.Instruction.newInstance(this.typeName), Instruction_1.Instruction.setLocal("~results"), Instruction_1.Instruction.loadLocal("~localCount"), Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.instanceCall(List_1.List.count), Instruction_1.Instruction.compareEqual(), Instruction_1.Instruction.branchRelativeIfFalse(2), Instruction_1.Instruction.loadLocal("~results"), Instruction_1.Instruction.return(), Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadLocal("~localCount"), Instruction_1.Instruction.loadElement(), Instruction_1.Instruction.loadLocal(List_1.List.delegateParameter), Instruction_1.Instruction.invokeDelegateOnInstance(), Instruction_1.Instruction.loadLocal("~results"), Instruction_1.Instruction.instanceCall(List_1.List.add), Instruction_1.Instruction.loadLocal("~localCount"), Instruction_1.Instruction.loadNumber(1), Instruction_1.Instruction.add(), Instruction_1.Instruction.setLocal("~localCount"), Instruction_1.Instruction.goTo(4));
        this.methods.set(List_1.List.map, map);
    }
    defineContainsMethod() {
        const contains = new Method_1.Method();
        contains.name = List_1.List.contains;
        contains.parameters.push(new Parameter_1.Parameter(List_1.List.typeNameParameter, StringType_1.StringType.typeName), new Parameter_1.Parameter(List_1.List.countParameter, NumberType_1.NumberType.typeName));
        contains.returnType = BooleanType_1.BooleanType.typeName;
        contains.body.push(Instruction_1.Instruction.loadLocal(List_1.List.countParameter), Instruction_1.Instruction.loadLocal(List_1.List.typeNameParameter), Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.externalCall("containsType"), Instruction_1.Instruction.return());
        this.methods.set(List_1.List.contains, contains);
    }
    addInstance(instance) {
        this.items.push(instance);
    }
    countItems() {
        return Memory_1.Memory.allocateNumber(this.items.length);
    }
    containsType(typeName, count) {
        const foundItems = this.items.filter(x => x.typeName === typeName.value);
        const found = foundItems.length === count.value;
        return Memory_1.Memory.allocateBoolean(found);
    }
    joinList(separator) {
        if (!this.items.every(x => x instanceof RuntimeString_1.RuntimeString)) {
            throw new RuntimeError_1.RuntimeError("Attempted to join a list with conflicting data types");
        }
        const values = this.items.map(x => x.value);
        if (values.length == 0 || values.every(x => x === '')) {
            return Memory_1.Memory.allocateString('');
        }
        const joinedValue = values.join(separator.value);
        return Memory_1.Memory.allocateString(joinedValue);
    }
}
exports.RuntimeList = RuntimeList;
},{"../../common/Instruction":5,"../../common/Method":6,"../../common/Parameter":8,"../../library/Any":56,"../../library/BooleanType":57,"../../library/List":64,"../../library/NumberType":65,"../../library/StringType":69,"../common/Memory":80,"../errors/RuntimeError":83,"./RuntimeAny":118,"./RuntimeDelegate":122,"./RuntimeInteger":124,"./RuntimeString":130}],127:[function(require,module,exports){
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
},{"../../library/Place":66,"../../library/WorldObject":71,"./RuntimeWorldObject":131}],128:[function(require,module,exports){
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
},{"../../library/Player":67,"./RuntimeWorldObject":131}],129:[function(require,module,exports){
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
},{"./RuntimeAny":118}],130:[function(require,module,exports){
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
},{"../../library/Any":56,"./RuntimeAny":118}],131:[function(require,module,exports){
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
},{"../../common/Field":4,"../../common/Type":9,"../../library/Any":56,"../../library/List":64,"../../library/StringType":69,"../../library/WorldObject":71,"../errors/RuntimeError":83,"./RuntimeAny":118}],132:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL25vcmhhL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInRhbG9uL1BhbmVPdXRwdXQudHMiLCJ0YWxvbi9UYWxvbklkZS50cyIsInRhbG9uL2NvbW1vbi9FdmVudFR5cGUudHMiLCJ0YWxvbi9jb21tb24vRmllbGQudHMiLCJ0YWxvbi9jb21tb24vSW5zdHJ1Y3Rpb24udHMiLCJ0YWxvbi9jb21tb24vTWV0aG9kLnRzIiwidGFsb24vY29tbW9uL09wQ29kZS50cyIsInRhbG9uL2NvbW1vbi9QYXJhbWV0ZXIudHMiLCJ0YWxvbi9jb21tb24vVHlwZS50cyIsInRhbG9uL2NvbW1vbi9WZXJzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvVGFsb25Db21waWxlci50cyIsInRhbG9uL2NvbXBpbGVyL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvci50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9LZXl3b3Jkcy50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9QdW5jdHVhdGlvbi50cyIsInRhbG9uL2NvbXBpbGVyL2xleGluZy9UYWxvbkxleGVyLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1Rva2VuLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1Rva2VuVHlwZS50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvUGFyc2VDb250ZXh0LnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9UYWxvblBhcnNlci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvQWN0aW9uc0V4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0JpbmFyeUV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0NvbXBhcmlzb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Db25jYXRlbmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29udGFpbnNFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvSWRlbnRpZmllckV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0lmRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvTGlzdEV4cHJlc3Npb24udHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL2V4cHJlc3Npb25zL0xpdGVyYWxFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Qcm9ncmFtRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2F5RXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2V0VmFyaWFibGVFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9XaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9CbG9ja0V4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9Db21wYXJpc29uRXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL0V2ZW50RXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL0V4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9GaWVsZERlY2xhcmF0aW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvSWZFeHByZXNzaW9uVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvUHJvZ3JhbVZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1NheUV4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9UeXBlRGVjbGFyYXRpb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9XaGVuRGVjbGFyYXRpb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvc2VtYW50aWNzL1RhbG9uU2VtYW50aWNBbmFseXplci50cyIsInRhbG9uL2NvbXBpbGVyL3RyYW5zZm9ybWluZy9FeHByZXNzaW9uVHJhbnNmb3JtYXRpb25Nb2RlLnRzIiwidGFsb24vY29tcGlsZXIvdHJhbnNmb3JtaW5nL1RhbG9uVHJhbnNmb3JtZXIudHMiLCJ0YWxvbi9pZGUvQW5hbHlzaXNDb29yZGluYXRvci50cyIsInRhbG9uL2lkZS9DYXJldFBvc2l0aW9uLnRzIiwidGFsb24vaWRlL2FuYWx5emVycy9Db2RlUGFuZUFuYWx5emVyLnRzIiwidGFsb24vaWRlL2Zvcm1hdHRlcnMvQ29kZVBhbmVTdHlsZUZvcm1hdHRlci50cyIsInRhbG9uL2xpYnJhcnkvQW55LnRzIiwidGFsb24vbGlicmFyeS9Cb29sZWFuVHlwZS50cyIsInRhbG9uL2xpYnJhcnkvQ29udmVydC50cyIsInRhbG9uL2xpYnJhcnkvRGVjb3JhdGlvbi50cyIsInRhbG9uL2xpYnJhcnkvRGVsZWdhdGUudHMiLCJ0YWxvbi9saWJyYXJ5L0VudHJ5UG9pbnRBdHRyaWJ1dGUudHMiLCJ0YWxvbi9saWJyYXJ5L0V4dGVybkNhbGwudHMiLCJ0YWxvbi9saWJyYXJ5L0l0ZW0udHMiLCJ0YWxvbi9saWJyYXJ5L0xpc3QudHMiLCJ0YWxvbi9saWJyYXJ5L051bWJlclR5cGUudHMiLCJ0YWxvbi9saWJyYXJ5L1BsYWNlLnRzIiwidGFsb24vbGlicmFyeS9QbGF5ZXIudHMiLCJ0YWxvbi9saWJyYXJ5L1NheS50cyIsInRhbG9uL2xpYnJhcnkvU3RyaW5nVHlwZS50cyIsInRhbG9uL2xpYnJhcnkvVW5kZXJzdGFuZGluZy50cyIsInRhbG9uL2xpYnJhcnkvV29ybGRPYmplY3QudHMiLCJ0YWxvbi9tYWluLnRzIiwidGFsb24vcnVudGltZS9FdmFsdWF0aW9uUmVzdWx0LnRzIiwidGFsb24vcnVudGltZS9NZXRob2RBY3RpdmF0aW9uLnRzIiwidGFsb24vcnVudGltZS9PcENvZGVIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9SdW50aW1lU3RhdGUudHMiLCJ0YWxvbi9ydW50aW1lL1N0YWNrRnJhbWUudHMiLCJ0YWxvbi9ydW50aW1lL1RhbG9uUnVudGltZS50cyIsInRhbG9uL3J1bnRpbWUvVGhyZWFkLnRzIiwidGFsb24vcnVudGltZS9jb21tb24vTWVtb3J5LnRzIiwidGFsb24vcnVudGltZS9jb21tb24vU3RhdGUudHMiLCJ0YWxvbi9ydW50aW1lL2NvbW1vbi9TdGF0ZU1hY2hpbmUudHMiLCJ0YWxvbi9ydW50aW1lL2Vycm9ycy9SdW50aW1lRXJyb3IudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0FkZEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0Fzc2lnblZhcmlhYmxlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvQnJhbmNoUmVsYXRpdmVIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9CcmFuY2hSZWxhdGl2ZUlmRmFsc2VIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Db21wYXJlTGVzc1RoYW5IYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Db21wYXJpc29uSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvQ29uY2F0ZW5hdGVIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9DcmVhdGVEZWxlZ2F0ZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0V4dGVybmFsQ2FsbEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0dvVG9IYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9IYW5kbGVDb21tYW5kSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvSW5zdGFuY2VDYWxsSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvSW52b2tlRGVsZWdhdGVIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9JbnZva2VEZWxlZ2F0ZU9uSW5zdGFuY2VIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkQm9vbGVhbkhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRFbGVtZW50SGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZEVtcHR5SGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZEZpZWxkSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZEluc3RhbmNlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZExvY2FsSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZE51bWJlckhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRQcm9wZXJ0eUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRTdHJpbmdIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkVGhpc0hhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL05ld0luc3RhbmNlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTm9PcEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1BhcnNlQ29tbWFuZEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1ByaW50SGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvUmVhZElucHV0SGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvUmV0dXJuSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvU2V0TG9jYWxIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9TdGF0aWNDYWxsSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvVHlwZU9mSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9NZWFuaW5nLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVBbnkudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUJvb2xlYW4udHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUNvbW1hbmQudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZURlY29yYXRpb24udHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZURlbGVnYXRlLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVFbXB0eS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lSW50ZWdlci50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lSXRlbS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lTGlzdC50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lUGxhY2UudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVBsYXllci50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lU2F5LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVTdHJpbmcudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVdvcmxkT2JqZWN0LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1ZhcmlhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDR0EsTUFBYSxVQUFVO0lBQ25CLFlBQW9CLElBQW1CO1FBQW5CLFNBQUksR0FBSixJQUFJLENBQWU7SUFFdkMsQ0FBQztJQUVELEtBQUs7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFZO1FBRWQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFDO1lBQ3JCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFOUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsS0FBSyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7WUFFMUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDMUI7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMs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LENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUQsQ0FBQzs7QUFYTCw0QkFZQztBQVYyQixxQkFBWSxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgSUxvZ091dHB1dCB9IGZyb20gXCIuL3J1bnRpbWUvSUxvZ091dHB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhbmVPdXRwdXQgaW1wbGVtZW50cyBJT3V0cHV0LCBJTG9nT3V0cHV0e1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYW5lOkhUTUxEaXZFbGVtZW50KXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIoKXtcclxuICAgICAgICB0aGlzLnBhbmUuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBkZWJ1ZyhsaW5lOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKGxpbmUuc3RhcnRzV2l0aCgnLicpKXtcclxuICAgICAgICAgICAgY29uc3QgcGFydHMgPSBsaW5lLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBwYXJ0c1swXSA9IGA8c3Ryb25nPiR7cGFydHNbMF19PC9zdHJvbmc+YDtcclxuXHJcbiAgICAgICAgICAgIGxpbmUgPSBwYXJ0cy5qb2luKCcgJyk7XHJcbiAgICAgICAgfSBcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lLmlubmVySFRNTCArPSBsaW5lICsgXCI8YnIgLz5cIjtcclxuICAgICAgICB0aGlzLnBhbmUuc2Nyb2xsVG8oMCwgdGhpcy5wYW5lLnNjcm9sbEhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgd3JpdGUobGluZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wYW5lLmlubmVySFRNTCArPSBsaW5lICsgXCI8YnIgLz5cIjtcclxuICAgICAgICB0aGlzLnBhbmUuc2Nyb2xsVG8oMCwgdGhpcy5wYW5lLnNjcm9sbEhlaWdodCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUYWxvbkNvbXBpbGVyIH0gZnJvbSBcIi4vY29tcGlsZXIvVGFsb25Db21waWxlclwiO1xyXG5cclxuaW1wb3J0IHsgUGFuZU91dHB1dCB9IGZyb20gXCIuL1BhbmVPdXRwdXRcIjtcclxuXHJcbmltcG9ydCB7IFRhbG9uUnVudGltZSB9IGZyb20gXCIuL3J1bnRpbWUvVGFsb25SdW50aW1lXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBBbmFseXNpc0Nvb3JkaW5hdG9yIH0gZnJvbSBcIi4vaWRlL0FuYWx5c2lzQ29vcmRpbmF0b3JcIjtcclxuaW1wb3J0IHsgQ29kZVBhbmVBbmFseXplciB9IGZyb20gXCIuL2lkZS9hbmFseXplcnMvQ29kZVBhbmVBbmFseXplclwiO1xyXG5pbXBvcnQgeyBDb2RlUGFuZVN0eWxlRm9ybWF0dGVyIH0gZnJvbSBcIi4vaWRlL2Zvcm1hdHRlcnMvQ29kZVBhbmVTdHlsZUZvcm1hdHRlclwiO1xyXG5pbXBvcnQgeyBGaWxlSGFuZGxlIH0gZnJvbSBcImZzL3Byb21pc2VzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25JZGV7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgVGFsb25Db2RlRmlsZURlc2NyaXB0aW9uID0gXCJUYWxvbiBDb2RlXCI7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBUYWxvbkNvZGVGaWxlRXh0ZW5zaW9uID0gXCIudGxuXCI7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb2RlUGFuZTpIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZ2FtZVBhbmU6SFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBpbGF0aW9uT3V0cHV0OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBnYW1lTG9nT3V0cHV0OkhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBvcGVuQnV0dG9uOkhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBzYXZlQnV0dG9uOkhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBleGFtcGxlMUJ1dHRvbjpIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcGlsZUJ1dHRvbjpIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc3RhcnROZXdHYW1lQnV0dG9uOkhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSB1c2VyQ29tbWFuZFRleHQ6SFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2VuZFVzZXJDb21tYW5kQnV0dG9uOkhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjYXJldFBvc2l0aW9uOkhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcGlsYXRpb25PdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJ1bnRpbWVPdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJ1bnRpbWVMb2dPdXRwdXRQYW5lOlBhbmVPdXRwdXQ7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb2RlUGFuZUFuYWx5emVyOkNvZGVQYW5lQW5hbHl6ZXI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFuYWx5c2lzQ29vcmRpbmF0b3I6QW5hbHlzaXNDb29yZGluYXRvcjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvZGVQYW5lU3R5bGVGb3JtYXR0ZXI6Q29kZVBhbmVTdHlsZUZvcm1hdHRlcjtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBpbGVyOlRhbG9uQ29tcGlsZXI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJ1bnRpbWU6VGFsb25SdW50aW1lO1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGNvbXBpbGVkVHlwZXM6VHlwZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0QnlJZDxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+KG5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gPFQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNvZGVQYW5lID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MRGl2RWxlbWVudD4oXCJjb2RlLXBhbmVcIikhO1xyXG4gICAgICAgIHRoaXMuZ2FtZVBhbmUgPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxEaXZFbGVtZW50PihcImdhbWUtcGFuZVwiKSE7XHJcbiAgICAgICAgdGhpcy5jb21waWxhdGlvbk91dHB1dCA9IFRhbG9uSWRlLmdldEJ5SWQ8SFRNTERpdkVsZW1lbnQ+KFwiY29tcGlsYXRpb24tb3V0cHV0XCIpITtcclxuICAgICAgICB0aGlzLmdhbWVMb2dPdXRwdXQgPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxEaXZFbGVtZW50PihcImxvZy1wYW5lXCIpITtcclxuICAgICAgICB0aGlzLm9wZW5CdXR0b24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxCdXR0b25FbGVtZW50PihcIm9wZW5cIik7XHJcbiAgICAgICAgdGhpcy5zYXZlQnV0dG9uID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MQnV0dG9uRWxlbWVudD4oXCJzYXZlXCIpO1xyXG4gICAgICAgIHRoaXMuZXhhbXBsZTFCdXR0b24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxCdXR0b25FbGVtZW50PihcImV4YW1wbGUxXCIpITtcclxuICAgICAgICB0aGlzLmNvbXBpbGVCdXR0b24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxCdXR0b25FbGVtZW50PihcImNvbXBpbGVcIikhO1xyXG4gICAgICAgIHRoaXMuc3RhcnROZXdHYW1lQnV0dG9uID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MQnV0dG9uRWxlbWVudD4oXCJzdGFydC1uZXctZ2FtZVwiKSE7XHJcbiAgICAgICAgdGhpcy51c2VyQ29tbWFuZFRleHQgPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxJbnB1dEVsZW1lbnQ+KFwidXNlci1jb21tYW5kLXRleHRcIikhO1xyXG4gICAgICAgIHRoaXMuc2VuZFVzZXJDb21tYW5kQnV0dG9uID0gVGFsb25JZGUuZ2V0QnlJZDxIVE1MQnV0dG9uRWxlbWVudD4oXCJzZW5kLXVzZXItY29tbWFuZFwiKTtcclxuICAgICAgICB0aGlzLmNhcmV0UG9zaXRpb24gPSBUYWxvbklkZS5nZXRCeUlkPEhUTUxEaXZFbGVtZW50PihcImNhcmV0LXBvc2l0aW9uXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2F2ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGUgPT4gYXdhaXQgdGhpcy5zYXZlQ29kZUZpbGUodGhpcy5jb2RlUGFuZS5pbm5lclRleHQpKTtcclxuICAgICAgICB0aGlzLm9wZW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBlID0+IGF3YWl0IHRoaXMub3BlbkNvZGVGaWxlKGUpKTtcclxuICAgICAgICB0aGlzLmV4YW1wbGUxQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB0aGlzLmxvYWRFeGFtcGxlKCkpO1xyXG4gICAgICAgIHRoaXMuY29tcGlsZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4gdGhpcy5jb21waWxlKCkpO1xyXG4gICAgICAgIHRoaXMuc3RhcnROZXdHYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB0aGlzLnN0YXJ0TmV3R2FtZSgpKTtcclxuICAgICAgICB0aGlzLnNlbmRVc2VyQ29tbWFuZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4gdGhpcy5zZW5kVXNlckNvbW1hbmQoKSk7XHJcbiAgICAgICAgdGhpcy51c2VyQ29tbWFuZFRleHQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIHsgXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRVc2VyQ29tbWFuZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudXNlckNvbW1hbmRUZXh0LnZhbHVlID0gXCJsb29rXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb21waWxhdGlvbk91dHB1dFBhbmUgPSBuZXcgUGFuZU91dHB1dCh0aGlzLmNvbXBpbGF0aW9uT3V0cHV0KTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWVPdXRwdXRQYW5lID0gbmV3IFBhbmVPdXRwdXQodGhpcy5nYW1lUGFuZSk7XHJcbiAgICAgICAgdGhpcy5ydW50aW1lTG9nT3V0cHV0UGFuZSA9IG5ldyBQYW5lT3V0cHV0KHRoaXMuZ2FtZUxvZ091dHB1dCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29kZVBhbmVBbmFseXplciA9IG5ldyBDb2RlUGFuZUFuYWx5emVyKHRoaXMuY29kZVBhbmUpO1xyXG4gICAgICAgIHRoaXMuYW5hbHlzaXNDb29yZGluYXRvciA9IG5ldyBBbmFseXNpc0Nvb3JkaW5hdG9yKHRoaXMuY29kZVBhbmVBbmFseXplciwgdGhpcy5jYXJldFBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2RlUGFuZVN0eWxlRm9ybWF0dGVyID0gbmV3IENvZGVQYW5lU3R5bGVGb3JtYXR0ZXIodGhpcy5jb2RlUGFuZSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tcGlsZXIgPSBuZXcgVGFsb25Db21waWxlcih0aGlzLmNvbXBpbGF0aW9uT3V0cHV0UGFuZSk7XHJcbiAgICAgICAgdGhpcy5ydW50aW1lID0gbmV3IFRhbG9uUnVudGltZSh0aGlzLnJ1bnRpbWVPdXRwdXRQYW5lLCB0aGlzLnJ1bnRpbWVMb2dPdXRwdXRQYW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbmRVc2VyQ29tbWFuZCgpe1xyXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLnVzZXJDb21tYW5kVGV4dC52YWx1ZTtcclxuICAgICAgICB0aGlzLnJ1bnRpbWUuc2VuZENvbW1hbmQoY29tbWFuZCk7XHJcblxyXG4gICAgICAgIHRoaXMudXNlckNvbW1hbmRUZXh0LnZhbHVlID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbXBpbGUoKXtcclxuICAgICAgICBjb25zdCBjb2RlID0gdGhpcy5jb2RlUGFuZS5pbm5lclRleHQ7XHJcblxyXG4gICAgICAgIHRoaXMuY29tcGlsYXRpb25PdXRwdXRQYW5lLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5jb21waWxlZFR5cGVzID0gdGhpcy5jb21waWxlci5jb21waWxlKGNvZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhcnROZXdHYW1lKCl7XHJcbiAgICAgICAgdGhpcy5ydW50aW1lT3V0cHV0UGFuZS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMucnVudGltZUxvZ091dHB1dFBhbmUuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ydW50aW1lLnN0b3AoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucnVudGltZS5sb2FkRnJvbSh0aGlzLmNvbXBpbGVkVHlwZXMpKXtcclxuICAgICAgICAgICAgdGhpcy5ydW50aW1lLnN0YXJ0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgb3BlbkNvZGVGaWxlKGV2ZW50OkV2ZW50KXtcclxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICB0eXBlczogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBUYWxvbklkZS5UYWxvbkNvZGVGaWxlRGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICBhY2NlcHQ6IHtcclxuICAgICAgICAgICAgICAgICAgJ3RleHQvcGxhaW4nOiBbVGFsb25JZGUuVGFsb25Db2RlRmlsZUV4dGVuc2lvbl1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBleGNsdWRlQWNjZXB0QWxsT3B0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICBtdWx0aXBsZTogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVzID0gYXdhaXQgKHdpbmRvdyBhcyBhbnkpLnNob3dPcGVuRmlsZVBpY2tlcihvcHRpb25zKTtcclxuICAgICAgICBjb25zdCBmaWxlID0gYXdhaXQgaGFuZGxlc1swXS5nZXRGaWxlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY29kZVBhbmUuaW5uZXJUZXh0ID0gYXdhaXQgZmlsZS50ZXh0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBzYXZlQ29kZUZpbGUoY29udGVudHM6c3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgdHlwZXM6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogVGFsb25JZGUuVGFsb25Db2RlRmlsZURlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgYWNjZXB0OiB7XHJcbiAgICAgICAgICAgICAgICAgICd0ZXh0L3BsYWluJzogW1RhbG9uSWRlLlRhbG9uQ29kZUZpbGVFeHRlbnNpb25dLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH07XHJcbiAgXHJcbiAgICAgICAgY29uc3QgZmlsZUhhbmRsZSA9IGF3YWl0ICh3aW5kb3cgYXMgYW55KS5zaG93U2F2ZUZpbGVQaWNrZXIob3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3Qgd3JpdGFibGUgPSBhd2FpdCAoZmlsZUhhbmRsZSBhcyBhbnkpLmNyZWF0ZVdyaXRhYmxlKCk7XHJcbiAgICAgICAgYXdhaXQgd3JpdGFibGUud3JpdGUoY29udGVudHMpO1xyXG4gICAgICAgIGF3YWl0IHdyaXRhYmxlLmNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb2FkRXhhbXBsZSgpe1xyXG4gICAgICAgIHRoaXMuY29kZVBhbmUuaW5uZXJUZXh0ID0gXHJcbiAgICAgICAgICAgIFwic2F5IFxcXCJUaGlzIGlzIHRoZSBzdGFydC5cXFwiLlxcblxcblwiICtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFwidW5kZXJzdGFuZCBcXFwibG9va1xcXCIgYXMgZGVzY3JpYmluZy4gXFxuXCIgK1xyXG4gICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcIm5vcnRoXFxcIiBhcyBkaXJlY3Rpb25zLiBcXG5cIiArXHJcbiAgICAgICAgICAgIFwidW5kZXJzdGFuZCBcXFwic291dGhcXFwiIGFzIGRpcmVjdGlvbnMuXFxuXCIgK1xyXG4gICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcImdvXFxcIiBhcyBtb3ZpbmcuIFxcblwiICtcclxuICAgICAgICAgICAgXCJ1bmRlcnN0YW5kIFxcXCJ0YWtlXFxcIiBhcyB0YWtpbmcuIFxcblwiICtcclxuICAgICAgICAgICAgXCJ1bmRlcnN0YW5kIFxcXCJpbnZcXFwiIGFzIGludmVudG9yeS4gXFxuXCIgK1xyXG4gICAgICAgICAgICBcInVuZGVyc3RhbmQgXFxcImRyb3BcXFwiIGFzIGRyb3BwaW5nLiBcXG5cXG5cIiArXHJcblxyXG4gICAgICAgICAgICBcImFuIElubiBpcyBhIGtpbmQgb2YgcGxhY2UuIFxcblwiICtcclxuICAgICAgICAgICAgXCJpdCBpcyB3aGVyZSB0aGUgcGxheWVyIHN0YXJ0cy4gXFxuXCIgK1xyXG4gICAgICAgICAgICBcIml0IGlzIGRlc2NyaWJlZCBhcyBcXFwiVGhlIGlubiBpcyBhIGNvenkgcGxhY2UsIHdpdGggYSBjcmFja2xpbmcgZmlyZSBvbiB0aGUgaGVhcnRoLiBUaGUgYmFydGVuZGVyIGlzIGJlaGluZCB0aGUgYmFyLiBBbiBvcGVuIGRvb3IgdG8gdGhlIG5vcnRoIGxlYWRzIG91dHNpZGUuXFxcIiBcXG5cIiArXHJcbiAgICAgICAgICAgIFwiICAgIGFuZCBpZiBpdCBjb250YWlucyAxIENvaW4gdGhlbiBcXFwiVGhlcmUncyBhbHNvIGEgY29pbiBoZXJlLlxcXCI7IG9yIGVsc2UgXFxcIlRoZXJlIGlzIGp1c3QgZHVzdC5cXFwiOyBhbmQgdGhlbiBjb250aW51ZS5cXG5cIiArXHJcbiAgICAgICAgICAgIFwiaXQgY29udGFpbnMgMSBDb2luLCAxIEZpcmVwbGFjZS5cXG5cIiArIFxyXG4gICAgICAgICAgICBcIml0IGNhbiByZWFjaCB0aGUgV2Fsa3dheSBieSBnb2luZyBcXFwibm9ydGhcXFwiLiBcXG5cIiArXHJcbiAgICAgICAgICAgIFwiaXQgaGFzIGEgdmFsdWUgdGhhdCBpcyBmYWxzZS4gXFxuXCIgK1xyXG4gICAgICAgICAgICBcIndoZW4gdGhlIHBsYXllciBleGl0czogXFxuXCIgK1xyXG4gICAgICAgICAgICBcIiAgICBpZiB2YWx1ZSBpcyBmYWxzZSB0aGVuIFxcblwiICtcclxuICAgICAgICAgICAgXCIgICAgICAgIHNheSBcXFwiVGhlIGJhcnRlbmRlciB3YXZlcyBnb29kYnllLlxcXCI7IFxcblwiICtcclxuICAgICAgICAgICAgXCIgICAgb3IgZWxzZSBcXG5cIiArXHJcbiAgICAgICAgICAgIFwiICAgICAgICBzYXkgXFxcIlRoZSBiYXJ0ZW5kZXIgY2xlYW5zIHRoZSBiYXIuXFxcIjsgXFxuXCIgK1xyXG4gICAgICAgICAgICBcIiAgICBhbmQgdGhlbiBjb250aW51ZTtcXG5cIiArXHJcbiAgICAgICAgICAgIFwiICAgIHNldCB2YWx1ZSB0byB0cnVlOyBcXG5cIiArXHJcbiAgICAgICAgICAgIFwiYW5kIHRoZW4gc3RvcC4gXFxuXFxuXCIgK1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXCJhIEZpcmVwbGFjZSBpcyBhIGtpbmQgb2YgZGVjb3JhdGlvbi4gXFxuXCIgK1xyXG4gICAgICAgICAgICBcIml0IGlzIGRlc2NyaWJlZCBhcyBcXFwiVGhlIGZpcmVwbGFjZSBjcmFja2xlcy4gSXQncyBmdWxsIG9mIGZpcmUuXFxcIi4gXFxuXFxuXCIgK1xyXG5cclxuICAgICAgICAgICAgXCJhIFdhbGt3YXkgaXMgYSBraW5kIG9mIHBsYWNlLiBcXG5cIiArXHJcbiAgICAgICAgICAgIFwiaXQgaXMgZGVzY3JpYmVkIGFzIFxcXCJUaGUgd2Fsa3dheSBpbiBmcm9udCBvZiB0aGUgaW5uIGlzIGVtcHR5LCBqdXN0IGEgY29iYmxlc3RvbmUgZW50cmFuY2UuIFRoZSBpbm4gaXMgdG8gdGhlIHNvdXRoLlxcXCIuIFxcblwiICtcclxuICAgICAgICAgICAgXCJpdCBjYW4gcmVhY2ggdGhlIElubiBieSBnb2luZyBcXFwic291dGhcXFwiLiBcXG5cIiArXHJcbiAgICAgICAgICAgIFwid2hlbiB0aGUgcGxheWVyIGVudGVyczpcXG5cIiArXHJcbiAgICAgICAgICAgIFwiICAgIHNheSBcXFwiWW91IHdhbGsgb250byB0aGUgY29iYmxlc3RvbmVzLiBUaGV5J3JlIG5pY2UsIGlmIHlvdSBsaWtlIHRoYXQgc29ydCBvZiB0aGluZy5cXFwiOyBcXG5cIiArXHJcbiAgICAgICAgICAgIFwiICAgIHNheSBcXFwiVGhlcmUncyBub2JvZHkgYXJvdW5kLiBUaGUgd2luZCB3aGlzdGxlcyBhIGxpdHRsZSBiaXQuXFxcIjsgXFxuXCIgK1xyXG4gICAgICAgICAgICBcImFuZCB0aGVuIHN0b3AuIFxcblxcblwiICtcclxuXHJcbiAgICAgICAgICAgIFwic2F5IFxcXCJUaGlzIGlzIHRoZSBtaWRkbGUuXFxcIi5cXG5cXG5cIiArXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcImEgQ29pbiBpcyBhIGtpbmQgb2YgaXRlbS4gXFxuXCIgK1xyXG4gICAgICAgICAgICBcIml0IGlzIGRlc2NyaWJlZCBhcyBcXFwiSXQncyBhIHNtYWxsIGNvaW4uXFxcIi5cXG5cXG5cIiArXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcInNheSBcXFwiVGhpcyBpcyB0aGUgZW5kLlxcXCIuXFxuXCI7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBFdmVudFR5cGV7XHJcbiAgICBOb25lLFxyXG4gICAgUGxheWVyRW50ZXJzUGxhY2UsXHJcbiAgICBQbGF5ZXJFeGl0c1BsYWNlXHJcbn0iLCJpbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4vVHlwZVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi9NZXRob2RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGaWVsZHtcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHR5cGVOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICB0eXBlPzpUeXBlO1xyXG4gICAgZGVmYXVsdFZhbHVlPzpPYmplY3Q7XHJcbn0iLCJpbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnN0cnVjdGlvbntcclxuICAgIHN0YXRpYyBhc3NpZ24oKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Bc3NpZ24pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb21wYXJlRXF1YWwoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Db21wYXJlRXF1YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbnZva2VEZWxlZ2F0ZSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkludm9rZURlbGVnYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaXNUeXBlT2YodHlwZU5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5UeXBlT2YsIHR5cGVOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZE51bWJlcih2YWx1ZTpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWROdW1iZXIsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZEJvb2xlYW4odmFsdWU6Ym9vbGVhbil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZEJvb2xlYW4sIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZFN0cmluZyh2YWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRTdHJpbmcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZEluc3RhbmNlKHR5cGVOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZEluc3RhbmNlLCB0eXBlTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRGaWVsZChmaWVsZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkRmllbGQsIGZpZWxkTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRQcm9wZXJ0eShmaWVsZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkUHJvcGVydHksIGZpZWxkTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRMb2NhbChsb2NhbE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkTG9jYWwsIGxvY2FsTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRUaGlzKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZFRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbnN0YW5jZUNhbGwobWV0aG9kTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkluc3RhbmNlQ2FsbCwgbWV0aG9kTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbmNhdGVuYXRlKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuQ29uY2F0ZW5hdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzdGF0aWNDYWxsKHR5cGVOYW1lOnN0cmluZywgbWV0aG9kTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLlN0YXRpY0NhbGwsIGAke3R5cGVOYW1lfS4ke21ldGhvZE5hbWV9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGV4dGVybmFsQ2FsbChtZXRob2ROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuRXh0ZXJuYWxDYWxsLCBtZXRob2ROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcHJpbnQoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5QcmludCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJldHVybigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLlJldHVybik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHJlYWRJbnB1dCgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLlJlYWRJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHBhcnNlQ29tbWFuZCgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLlBhcnNlQ29tbWFuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGhhbmRsZUNvbW1hbmQoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5IYW5kbGVDb21tYW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ29UbyhsaW5lTnVtYmVyOm51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuR29UbywgbGluZU51bWJlcik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGJyYW5jaFJlbGF0aXZlKGNvdW50Om51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuQnJhbmNoUmVsYXRpdmUsIGNvdW50KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYnJhbmNoUmVsYXRpdmVJZkZhbHNlKGNvdW50Om51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuQnJhbmNoUmVsYXRpdmVJZkZhbHNlLCBjb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNvbXBhcmVMZXNzVGhhbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkNvbXBhcmVMZXNzVGhhbik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFkZCgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkFkZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRFbGVtZW50KCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZEVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZXRMb2NhbChuYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuU2V0TG9jYWwsIG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVEZWxlZ2F0ZSh0eXBlTmFtZTpzdHJpbmcsIG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5DcmVhdGVEZWxlZ2F0ZSwgYCR7dHlwZU5hbWV9OiR7bWV0aG9kTmFtZX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZEVtcHR5KCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZEVtcHR5KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbmV3SW5zdGFuY2UodHlwZU5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5OZXdJbnN0YW5jZSwgdHlwZU5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbnZva2VEZWxlZ2F0ZU9uSW5zdGFuY2UoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5JbnZva2VEZWxlZ2F0ZU9uSW5zdGFuY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIG9wQ29kZTpPcENvZGUgPSBPcENvZGUuTm9PcDtcclxuICAgIHZhbHVlPzpPYmplY3Q7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3BDb2RlOk9wQ29kZSwgdmFsdWU/Ok9iamVjdCl7XHJcbiAgICAgICAgdGhpcy5vcENvZGUgPSBvcENvZGU7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUGFyYW1ldGVyIH0gZnJvbSBcIi4vUGFyYW1ldGVyXCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vcnVudGltZS9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IEV2ZW50VHlwZSB9IGZyb20gXCIuL0V2ZW50VHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1ldGhvZHtcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHBhcmFtZXRlcnM6UGFyYW1ldGVyW10gPSBbXTtcclxuICAgIGFjdHVhbFBhcmFtZXRlcnM6VmFyaWFibGVbXSA9IFtdO1xyXG4gICAgYm9keTpJbnN0cnVjdGlvbltdID0gW107XHJcbiAgICByZXR1cm5UeXBlOnN0cmluZyA9IFwiXCI7XHJcbiAgICBldmVudFR5cGU6RXZlbnRUeXBlID0gRXZlbnRUeXBlLk5vbmU7XHJcbn0iLCJleHBvcnQgZW51bSBPcENvZGUge1xyXG4gICAgTm9PcCA9ICcubm9vcCcsXHJcbiAgICBBc3NpZ24gPSAnLnNldC52YXInLFxyXG4gICAgQ29tcGFyZUVxdWFsID0gXCIuY29tcGFyZS5lcVwiLFxyXG4gICAgUHJpbnQgPSAnLnByaW50JyxcclxuICAgIExvYWRTdHJpbmcgPSAnLmxvYWQuc3RyJyxcclxuICAgIE5ld0luc3RhbmNlID0gJy5uZXcnLFxyXG4gICAgUGFyc2VDb21tYW5kID0gJy5wYXJzZS5jbWQnLFxyXG4gICAgSGFuZGxlQ29tbWFuZCA9ICcuaGFuZGxlLmNtZCcsXHJcbiAgICBSZWFkSW5wdXQgPSAnLnJlYWQuaW4nLFxyXG4gICAgR29UbyA9ICcuYnInLFxyXG4gICAgUmV0dXJuID0gJy5yZXQnLFxyXG4gICAgQnJhbmNoUmVsYXRpdmUgPSAnLmJyLnJlbCcsXHJcbiAgICBCcmFuY2hSZWxhdGl2ZUlmRmFsc2UgPSAnLmJyLnJlbC5mYWxzZScsXHJcbiAgICBDb25jYXRlbmF0ZSA9ICcuY29uY2F0JyxcclxuICAgIExvYWROdW1iZXIgPSAnLmxvYWQubnVtJyxcclxuICAgIExvYWRGaWVsZCA9ICcubG9hZC5mbGQnLFxyXG4gICAgTG9hZFByb3BlcnR5ID0gJy5sb2FkLnByb3AnLFxyXG4gICAgTG9hZEluc3RhbmNlID0gJy5sb2FkLmluc3QnLFxyXG4gICAgTG9hZExvY2FsID0gJy5sb2FkLmxvYycsXHJcbiAgICBMb2FkVGhpcyA9ICcubG9hZC50aGlzJyxcclxuICAgIEluc3RhbmNlQ2FsbCA9ICcuY2FsbC5pbnN0JyxcclxuICAgIFN0YXRpY0NhbGwgPSAnLmNhbGwuc3RhdGljJyxcclxuICAgIEV4dGVybmFsQ2FsbCA9ICcuY2FsbC5leHRlcm4nLFxyXG4gICAgVHlwZU9mID0gJy50eXBlb2YnLFxyXG4gICAgSW52b2tlRGVsZWdhdGUgPSAnLmNhbGwuZnVuYycsXHJcbiAgICBMb2FkQm9vbGVhbiA9IFwiLmxvYWQuYm9vbFwiLFxyXG4gICAgQ29tcGFyZUxlc3NUaGFuID0gXCIuY29tcGFyZS5sdFwiLFxyXG4gICAgQWRkID0gXCIuYWRkXCIsXHJcbiAgICBMb2FkRWxlbWVudCA9IFwiLmxvYWQuZWxlbVwiLFxyXG4gICAgU2V0TG9jYWwgPSBcIi5zZXQubG9jYWxcIixcclxuICAgIENyZWF0ZURlbGVnYXRlID0gXCIubmV3LmRsZ3RcIixcclxuICAgIExvYWRFbXB0eSA9IFwiLmxvYWQuZW1wdHlcIixcclxuICAgIEludm9rZURlbGVnYXRlT25JbnN0YW5jZSA9IFwiLmNhbGwuZnVuYy5pbnN0XCJcclxufSIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi9UeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyYW1ldGVye1xyXG4gICAgXHJcbiAgICB0eXBlPzpUeXBlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBuYW1lOnN0cmluZyxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB0eXBlTmFtZTpzdHJpbmcpe1xyXG5cclxuICAgIH1cclxufSIsImltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4vRmllbGRcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4vTWV0aG9kXCI7XHJcbmltcG9ydCB7IEF0dHJpYnV0ZSB9IGZyb20gXCIuL0F0dHJpYnV0ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFR5cGV7ICAgICAgXHJcbiAgICBmaWVsZHM6RmllbGRbXSA9IFtdO1xyXG4gICAgbWV0aG9kczpNZXRob2RbXSA9IFtdOyBcclxuICAgIGF0dHJpYnV0ZXM6QXR0cmlidXRlW10gPSBbXTtcclxuXHJcbiAgICBnZXQgaXNTeXN0ZW1UeXBlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZS5zdGFydHNXaXRoKFwiflwiKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNBbm9ueW1vdXNUeXBlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZS5zdGFydHNXaXRoKFwiPH4+XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOnN0cmluZywgcHVibGljIGJhc2VUeXBlTmFtZTpzdHJpbmcpe1xyXG5cclxuICAgIH0gICAgXHJcbn0iLCJleHBvcnQgY2xhc3MgVmVyc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBtYWpvcjpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgbWlub3I6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHBhdGNoOm51bWJlcil7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gYCR7dGhpcy5tYWpvcn0uJHt0aGlzLm1pbm9yfS4ke3RoaXMucGF0Y2h9YDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9NZXRob2RcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4uL2NvbW1vbi9JbnN0cnVjdGlvblwiO1xyXG5pbXBvcnQgeyBFbnRyeVBvaW50QXR0cmlidXRlIH0gZnJvbSBcIi4uL2xpYnJhcnkvRW50cnlQb2ludEF0dHJpYnV0ZVwiO1xyXG5pbXBvcnQgeyBUYWxvbkxleGVyIH0gZnJvbSBcIi4vbGV4aW5nL1RhbG9uTGV4ZXJcIjtcclxuaW1wb3J0IHsgVGFsb25QYXJzZXIgfSBmcm9tIFwiLi9wYXJzaW5nL1RhbG9uUGFyc2VyXCI7XHJcbmltcG9ydCB7IFRhbG9uU2VtYW50aWNBbmFseXplciB9IGZyb20gXCIuL3NlbWFudGljcy9UYWxvblNlbWFudGljQW5hbHl6ZXJcIjtcclxuaW1wb3J0IHsgVGFsb25UcmFuc2Zvcm1lciB9IGZyb20gXCIuL3RyYW5zZm9ybWluZy9UYWxvblRyYW5zZm9ybWVyXCI7XHJcbmltcG9ydCB7IFZlcnNpb24gfSBmcm9tIFwiLi4vY29tbW9uL1ZlcnNpb25cIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvclwiO1xyXG5pbXBvcnQgeyBEZWxlZ2F0ZSB9IGZyb20gXCIuLi9saWJyYXJ5L0RlbGVnYXRlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25Db21waWxlcntcclxuICAgIGdldCBsYW5ndWFnZVZlcnNpb24oKXtcclxuICAgICAgICByZXR1cm4gbmV3IFZlcnNpb24oMSwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHZlcnNpb24oKXtcclxuICAgICAgICByZXR1cm4gbmV3IFZlcnNpb24oMSwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXQ6SU91dHB1dCl7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcGlsZShjb2RlOnN0cmluZyk6VHlwZVtde1xyXG4gICAgICAgIHRoaXMub3V0LndyaXRlKFwiPHN0cm9uZz5TdGFydGluZyBjb21waWxhdGlvbi4uLjwvc3Ryb25nPlwiKTtcclxuXHJcbiAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICBjb25zdCBsZXhlciA9IG5ldyBUYWxvbkxleGVyKHRoaXMub3V0KTtcclxuICAgICAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IFRhbG9uUGFyc2VyKHRoaXMub3V0KTtcclxuICAgICAgICAgICAgY29uc3QgYW5hbHl6ZXIgPSBuZXcgVGFsb25TZW1hbnRpY0FuYWx5emVyKHRoaXMub3V0KTtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSBuZXcgVGFsb25UcmFuc2Zvcm1lcih0aGlzLm91dCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0b2tlbnMgPSBsZXhlci50b2tlbml6ZShjb2RlKTtcclxuICAgICAgICAgICAgY29uc3QgYXN0ID0gcGFyc2VyLnBhcnNlKHRva2Vucyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuYWx5emVkQXN0ID0gYW5hbHl6ZXIuYW5hbHl6ZShhc3QpO1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlcyA9IHRyYW5zZm9ybWVyLnRyYW5zZm9ybShhbmFseXplZEFzdCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBlbnRyeVBvaW50ID0gdGhpcy5jcmVhdGVFbnRyeVBvaW50KCk7XHJcblxyXG4gICAgICAgICAgICB0eXBlcy5wdXNoKGVudHJ5UG9pbnQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVzO1xyXG4gICAgICAgIH0gY2F0Y2goZXgpe1xyXG4gICAgICAgICAgICBpZiAoZXggaW5zdGFuY2VvZiBDb21waWxhdGlvbkVycm9yKXtcclxuICAgICAgICAgICAgICAgIHRoaXMub3V0LndyaXRlKGA8ZW0+RXJyb3I6ICR7ZXgubWVzc2FnZX08L2VtPmApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vdXQud3JpdGUoYDxlbT5VbmhhbmRsZWQgRXJyb3I6ICR7ZXh9PC9lbT5gKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH0gZmluYWxseXtcclxuICAgICAgICAgICAgdGhpcy5vdXQud3JpdGUoXCI8c3Ryb25nPkNvbXBpbGF0aW9uIGNvbXBsZXRlLjwvc3Ryb25nPlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVFbnRyeVBvaW50KCl7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IG5ldyBUeXBlKFwifmdhbWVcIiwgQW55LnR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgdHlwZS5hdHRyaWJ1dGVzLnB1c2gobmV3IEVudHJ5UG9pbnRBdHRyaWJ1dGUoKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1haW4gPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgbWFpbi5uYW1lID0gQW55Lm1haW47XHJcbiAgICAgICAgbWFpbi5ib2R5LnB1c2goXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoYFRhbG9uIExhbmd1YWdlIHYuJHt0aGlzLmxhbmd1YWdlVmVyc2lvbn0sIENvbXBpbGVyIHYuJHt0aGlzLnZlcnNpb259YCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5zdGF0aWNDYWxsKFwifmdsb2JhbFNheXNcIiwgXCJ+c2F5XCIpLCAgICAgICAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoXCJcIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoXCJXaGF0IHdvdWxkIHlvdSBsaWtlIHRvIGRvP1wiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucmVhZElucHV0KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoXCJcIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnBhcnNlQ29tbWFuZCgpLCAgICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uaGFuZGxlQ29tbWFuZCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5pc1R5cGVPZihEZWxlZ2F0ZS50eXBlTmFtZSksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlSWZGYWxzZSgyKSwgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5pbnZva2VEZWxlZ2F0ZSgpLCAgICAgICAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlKC00KSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uZ29Ubyg3KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHR5cGUubWV0aG9kcy5wdXNoKG1haW4pO1xyXG5cclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBDb21waWxhdGlvbkVycm9ye1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBtZXNzYWdlOnN0cmluZyl7XHJcblxyXG4gICAgfVxyXG59IiwiaW50ZXJmYWNlIEluZGV4YWJsZXtcclxuICAgIFtrZXk6c3RyaW5nXTphbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBLZXl3b3Jkc3tcclxuICAgIFxyXG4gICAgc3RhdGljIHJlYWRvbmx5IGFuID0gXCJhblwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGEgPSBcImFcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0aGUgPSBcInRoZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGlzID0gXCJpc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGtpbmQgPSBcImtpbmRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBvZiA9IFwib2ZcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwbGFjZSA9IFwicGxhY2VcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpdGVtID0gXCJpdGVtXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaXQgPSBcIml0XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaGFzID0gXCJoYXNcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpZiA9IFwiaWZcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZXNjcmlwdGlvbiA9IFwiZGVzY3JpcHRpb25cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB1bmRlcnN0YW5kID0gXCJ1bmRlcnN0YW5kXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYXMgPSBcImFzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGVzY3JpYmluZyA9IFwiZGVzY3JpYmluZ1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRlc2NyaWJlZCA9IFwiZGVzY3JpYmVkXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgd2hlcmUgPSBcIndoZXJlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGxheWVyID0gXCJwbGF5ZXJcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBzdGFydHMgPSBcInN0YXJ0c1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNvbnRhaW5zID0gXCJjb250YWluc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHNheSA9IFwic2F5XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGlyZWN0aW9ucyA9IFwiZGlyZWN0aW9uc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG1vdmluZyA9IFwibW92aW5nXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdGFraW5nID0gXCJ0YWtpbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpbnZlbnRvcnkgPSBcImludmVudG9yeVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNhbiA9IFwiY2FuXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcmVhY2ggPSBcInJlYWNoXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYnkgPSBcImJ5XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZ29pbmcgPSBcImdvaW5nXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYW5kID0gXCJhbmRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBvciA9IFwib3JcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0aGVuID0gXCJ0aGVuXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZWxzZSA9IFwiZWxzZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHdoZW4gPSBcIndoZW5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBlbnRlcnMgPSBcImVudGVyc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGV4aXRzID0gXCJleGl0c1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHN0b3AgPSBcInN0b3BcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkcm9wcGluZyA9IFwiZHJvcHBpbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0aGF0ID0gXCJ0aGF0XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc2V0ID0gXCJzZXRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0byA9IFwidG9cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZWNvcmF0aW9uID0gXCJkZWNvcmF0aW9uXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdmlzaWJsZSA9IFwidmlzaWJsZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG5vdCA9IFwibm90XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgb2JzZXJ2ZWQgPSBcIm9ic2VydmVkXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY29udGludWUgPSBcImNvbnRpbnVlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHJ1ZSA9IFwidHJ1ZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGZhbHNlID0gXCJmYWxzZVwiO1xyXG5cclxuICAgIHN0YXRpYyBnZXRBbGwoKTpTZXQ8c3RyaW5nPntcclxuICAgICAgICB0eXBlIEtleXdvcmRQcm9wZXJ0aWVzID0ga2V5b2YgS2V5d29yZHM7XHJcblxyXG4gICAgICAgIGNvbnN0IGFsbEtleXdvcmRzID0gbmV3IFNldDxzdHJpbmc+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IG5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoS2V5d29yZHMpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGtleXdvcmQgb2YgbmFtZXMpe1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IChLZXl3b3JkcyBhcyBJbmRleGFibGUpW2tleXdvcmRdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZSAhPSBcIktleXdvcmRzXCIpe1xyXG4gICAgICAgICAgICAgICAgYWxsS2V5d29yZHMuYWRkKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFsbEtleXdvcmRzO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFB1bmN0dWF0aW9ue1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBlcmlvZCA9IFwiLlwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNvbG9uID0gXCI6XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc2VtaWNvbG9uID0gXCI7XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY29tbWEgPSBcIixcIjtcclxufSIsImltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4vVG9rZW5cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBQdW5jdHVhdGlvbiB9IGZyb20gXCIuL1B1bmN0dWF0aW9uXCI7XHJcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL1Rva2VuVHlwZVwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uLy4uL3J1bnRpbWUvSU91dHB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uTGV4ZXJ7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBhbGxLZXl3b3JkcyA9IEtleXdvcmRzLmdldEFsbCgpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgb3V0OklPdXRwdXQpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB0b2tlbml6ZShjb2RlOnN0cmluZyk6VG9rZW5bXXtcclxuICAgICAgICBsZXQgY3VycmVudExpbmUgPSAxO1xyXG4gICAgICAgIGxldCBjdXJyZW50Q29sdW1uID0gMTtcclxuXHJcbiAgICAgICAgY29uc3QgdG9rZW5zOlRva2VuW10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY29kZS5sZW5ndGg7ICl7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDaGFyID0gY29kZS5jaGFyQXQoaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDaGFyID09IFwiIFwiKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb2x1bW4rKztcclxuICAgICAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDaGFyID09IFwiXFxuXCIpe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvbHVtbiA9IDE7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50TGluZSsrO1xyXG4gICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgdG9rZW5WYWx1ZSA9IHRoaXMuY29uc3VtZVRva2VuQ2hhcnNBdChjb2RlLCBpbmRleCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodG9rZW5WYWx1ZS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRva2VuID0gbmV3IFRva2VuKGN1cnJlbnRMaW5lLCBjdXJyZW50Q29sdW1uLCB0b2tlblZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3VycmVudENvbHVtbiArPSB0b2tlblZhbHVlLmxlbmd0aDtcclxuICAgICAgICAgICAgaW5kZXggKz0gdG9rZW5WYWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc2lmeSh0b2tlbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2xhc3NpZnkodG9rZW5zOlRva2VuW10pOlRva2VuW117XHJcbiAgICAgICAgZm9yKGxldCB0b2tlbiBvZiB0b2tlbnMpe1xyXG4gICAgICAgICAgICBpZiAodG9rZW4udmFsdWUgPT0gUHVuY3R1YXRpb24ucGVyaW9kKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuVGVybWluYXRvcjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbi52YWx1ZSA9PSBQdW5jdHVhdGlvbi5zZW1pY29sb24pe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5TZW1pVGVybWluYXRvcjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbi52YWx1ZSA9PSBQdW5jdHVhdGlvbi5jb2xvbil7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLk9wZW5NZXRob2RCbG9jaztcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbi52YWx1ZSA9PSBQdW5jdHVhdGlvbi5jb21tYSl7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLkxpc3RTZXBhcmF0b3I7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4udmFsdWUgPT09IEtleXdvcmRzLnRydWUgfHwgdG9rZW4udmFsdWUgPT09IEtleXdvcmRzLmZhbHNlKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuQm9vbGVhbjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChUYWxvbkxleGVyLmFsbEtleXdvcmRzLmhhcyh0b2tlbi52YWx1ZSkpe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5LZXl3b3JkO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlLnN0YXJ0c1dpdGgoXCJcXFwiXCIpICYmIHRva2VuLnZhbHVlLmVuZHNXaXRoKFwiXFxcIlwiKSl7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLlN0cmluZztcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghaXNOYU4oTnVtYmVyKHRva2VuLnZhbHVlKSkpIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuTnVtYmVyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5JZGVudGlmaWVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW5zO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29uc3VtZVRva2VuQ2hhcnNBdChjb2RlOnN0cmluZywgaW5kZXg6bnVtYmVyKTpzdHJpbmd7XHJcbiAgICAgICAgY29uc3QgdG9rZW5DaGFyczpzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHN0cmluZ0RlbGltaXRlciA9IFwiXFxcIlwiO1xyXG5cclxuICAgICAgICBsZXQgaXNDb25zdW1pbmdTdHJpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yKGxldCByZWFkQWhlYWRJbmRleCA9IGluZGV4OyByZWFkQWhlYWRJbmRleCA8IGNvZGUubGVuZ3RoOyByZWFkQWhlYWRJbmRleCsrKXtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSBjb2RlLmNoYXJBdChyZWFkQWhlYWRJbmRleCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNDb25zdW1pbmdTdHJpbmcgJiYgY3VycmVudENoYXIgIT0gc3RyaW5nRGVsaW1pdGVyKXtcclxuICAgICAgICAgICAgICAgIHRva2VuQ2hhcnMucHVzaChjdXJyZW50Q2hhcik7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDaGFyID09IHN0cmluZ0RlbGltaXRlcil7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdG9rZW5DaGFycy5wdXNoKGN1cnJlbnRDaGFyKTsgICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgaXNDb25zdW1pbmdTdHJpbmcgPSAhaXNDb25zdW1pbmdTdHJpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzQ29uc3VtaW5nU3RyaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gXCIgXCIgfHwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q2hhciA9PSBcIlxcblwiIHx8IFxyXG4gICAgICAgICAgICAgICAgY3VycmVudENoYXIgPT0gUHVuY3R1YXRpb24ucGVyaW9kIHx8IFxyXG4gICAgICAgICAgICAgICAgY3VycmVudENoYXIgPT0gUHVuY3R1YXRpb24uY29sb24gfHwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q2hhciA9PSBQdW5jdHVhdGlvbi5zZW1pY29sb24gfHxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDaGFyID09IFB1bmN0dWF0aW9uLmNvbW1hKXtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbkNoYXJzLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbkNoYXJzLnB1c2goY3VycmVudENoYXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRva2VuQ2hhcnMucHVzaChjdXJyZW50Q2hhcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW5DaGFycy5qb2luKFwiXCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvSXRlbVwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBEZWNvcmF0aW9uIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvRGVjb3JhdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRva2Vue1xyXG4gICAgc3RhdGljIGdldCBlbXB0eSgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoXCJ+ZW1wdHlcIiwgVG9rZW5UeXBlLlVua25vd24pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yQW55KCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihBbnkudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvclBsYWNlKCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihQbGFjZS50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9ySXRlbSgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoSXRlbS50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yRGVjb3JhdGlvbigpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoRGVjb3JhdGlvbi50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yV29ybGRPYmplY3QoKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKFdvcmxkT2JqZWN0LnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JCb29sZWFuKCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihCb29sZWFuVHlwZS50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yTGlzdCgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoTGlzdC50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldFRva2VuV2l0aFR5cGVPZihuYW1lOnN0cmluZywgdHlwZTpUb2tlblR5cGUpe1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gbmV3IFRva2VuKC0xLC0xLG5hbWUpO1xyXG4gICAgICAgIHRva2VuLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH1cclxuXHJcbiAgICB0eXBlOlRva2VuVHlwZSA9IFRva2VuVHlwZS5Vbmtub3duO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBsaW5lOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBjb2x1bW46bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHZhbHVlOnN0cmluZyl7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gYCR7dGhpcy5saW5lfSwgJHt0aGlzLmNvbHVtbn06IEZvdW5kIHRva2VuICcke3RoaXMudmFsdWV9JyBvZiB0eXBlICcke3RoaXMudHlwZX0nYDtcclxuICAgIH1cclxufSIsImV4cG9ydCBlbnVtIFRva2VuVHlwZSB7XHJcbiAgICBVbmtub3duID0gJ1Vua25vd24nLFxyXG4gICAgS2V5d29yZCA9ICdLZXl3b3JkJyxcclxuICAgIFRlcm1pbmF0b3IgPSAnVGVybWluYXRvcicsXHJcbiAgICBTZW1pVGVybWluYXRvciA9ICdTZW1pVGVybWluYXRvcicsXHJcbiAgICBTdHJpbmcgPSAnU3RyaW5nJyxcclxuICAgIElkZW50aWZpZXIgPSAnSWRlbnRpZmllcicsXHJcbiAgICBOdW1iZXIgPSAnTnVtYmVyJyxcclxuICAgIEJvb2xlYW4gPSBcIkJvb2xlYW5cIixcclxuICAgIE9wZW5NZXRob2RCbG9jayA9ICdPcGVuTWV0aG9kQmxvY2snLFxyXG4gICAgTGlzdFNlcGFyYXRvciA9ICdMaXN0U2VwYXJhdG9yJ1xyXG59IiwiaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyc2VDb250ZXh0e1xyXG4gICAgaW5kZXg6bnVtYmVyID0gMDtcclxuXHJcbiAgICBnZXQgaXNEb25lKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXggPj0gdGhpcy50b2tlbnMubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJyZW50VG9rZW4oKXtcclxuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5pbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG5leHRUb2tlbigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmluZGV4ICsgMV07XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB0b2tlbnM6VG9rZW5bXSwgcHJpdmF0ZSByZWFkb25seSBvdXQ6SU91dHB1dCl7XHJcbiAgICAgICAgdGhpcy5vdXQud3JpdGUoYCR7dG9rZW5zLmxlbmd0aH0gdG9rZW5zIGRpc2NvdmVyZWQsIHBhcnNpbmcuLi5gKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdW1lQ3VycmVudFRva2VuKCl7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLmN1cnJlbnRUb2tlbjtcclxuXHJcbiAgICAgICAgdGhpcy5pbmRleCsrO1xyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9XHJcblxyXG4gICAgaXModG9rZW5WYWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUb2tlbj8udmFsdWUgPT0gdG9rZW5WYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0ZvbGxvd2VkQnkodG9rZW5WYWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5leHRUb2tlbj8udmFsdWUgPT0gdG9rZW5WYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc1R5cGVPZih0eXBlOlRva2VuVHlwZSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRva2VuLnR5cGUgPT0gdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0FueVR5cGVPZiguLi50eXBlczpUb2tlblR5cGVbXSl7XHJcbiAgICAgICAgZm9yKGNvbnN0IHR5cGUgb2YgdHlwZXMpe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1R5cGVPZih0eXBlKSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQW55T2YoLi4udG9rZW5WYWx1ZXM6c3RyaW5nW10pe1xyXG4gICAgICAgIGZvcihsZXQgdmFsdWUgb2YgdG9rZW5WYWx1ZXMpe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pcyh2YWx1ZSkpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpc1Rlcm1pbmF0b3IoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VG9rZW4udHlwZSA9PSBUb2tlblR5cGUuVGVybWluYXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RBbnlPZiguLi50b2tlblZhbHVlczpzdHJpbmdbXSl7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzQW55T2YoLi4udG9rZW5WYWx1ZXMpKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJFeHBlY3RlZCB0b2tlbnNcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3QodG9rZW5WYWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi52YWx1ZSAhPSB0b2tlblZhbHVlKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYEV4cGVjdGVkIHRva2VuICcke3Rva2VuVmFsdWV9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdFN0cmluZygpe1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5leHBlY3RBbmRDb25zdW1lKFRva2VuVHlwZS5TdHJpbmcsIFwiRXhwZWN0ZWQgc3RyaW5nXCIpO1xyXG5cclxuICAgICAgICAvLyBXZSBuZWVkIHRvIHN0cmlwIG9mZiB0aGUgZG91YmxlIHF1b3RlcyBmcm9tIHRoZWlyIHN0cmluZyBhZnRlciB3ZSBjb25zdW1lIGl0LlxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBuZXcgVG9rZW4odG9rZW4ubGluZSwgdG9rZW4uY29sdW1uLCB0b2tlbi52YWx1ZS5zdWJzdHJpbmcoMSwgdG9rZW4udmFsdWUubGVuZ3RoIC0gMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdE51bWJlcigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4cGVjdEFuZENvbnN1bWUoVG9rZW5UeXBlLk51bWJlciwgXCJFeHBlY3RlZCBudW1iZXJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0Qm9vbGVhbigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV4cGVjdEFuZENvbnN1bWUoVG9rZW5UeXBlLkJvb2xlYW4sIFwiRXhwZWN0ZWQgYm9vbGVhblwiKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RJZGVudGlmaWVyKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwZWN0QW5kQ29uc3VtZShUb2tlblR5cGUuSWRlbnRpZmllciwgXCJFeHBlY3RlZCBpZGVudGlmaWVyXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdFRlcm1pbmF0b3IoKXtcclxuICAgICAgICB0aGlzLmV4cGVjdEFuZENvbnN1bWUoVG9rZW5UeXBlLlRlcm1pbmF0b3IsIFwiRXhwZWN0ZWQgZXhwcmVzc2lvbiB0ZXJtaW5hdG9yXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdFNlbWlUZXJtaW5hdG9yKCl7XHJcbiAgICAgICAgdGhpcy5leHBlY3RBbmRDb25zdW1lKFRva2VuVHlwZS5TZW1pVGVybWluYXRvciwgXCJFeHBlY3RlZCBzZW1pIGV4cHJlc3Npb24gdGVybWluYXRvclwiKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RPcGVuTWV0aG9kQmxvY2soKXtcclxuICAgICAgICB0aGlzLmV4cGVjdEFuZENvbnN1bWUoVG9rZW5UeXBlLk9wZW5NZXRob2RCbG9jaywgXCJFeHBlY3RlZCBvcGVuIG1ldGhvZCBibG9ja1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4cGVjdEFuZENvbnN1bWUodG9rZW5UeXBlOlRva2VuVHlwZSwgZXJyb3JNZXNzYWdlOnN0cmluZyl7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRva2VuLnR5cGUgIT0gdG9rZW5UeXBlKXtcclxuICAgICAgICAgICAgdGhyb3cgdGhpcy5jcmVhdGVDb21waWxhdGlvbkVycm9yRm9yQ3VycmVudFRva2VuKGVycm9yTWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVDb21waWxhdGlvbkVycm9yRm9yQ3VycmVudFRva2VuKG1lc3NhZ2U6c3RyaW5nKTpDb21waWxhdGlvbkVycm9ye1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29tcGlsYXRpb25FcnJvcihgJHttZXNzYWdlfTogJHt0aGlzLmN1cnJlbnRUb2tlbn1gKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4uL2xleGluZy9Ub2tlblwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQcm9ncmFtVmlzaXRvciB9IGZyb20gXCIuL3Zpc2l0b3JzL1Byb2dyYW1WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uLy4uL3J1bnRpbWUvSU91dHB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uUGFyc2Vye1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXQ6SU91dHB1dCl7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwYXJzZSh0b2tlbnM6VG9rZW5bXSk6RXhwcmVzc2lvbntcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gbmV3IFBhcnNlQ29udGV4dCh0b2tlbnMsIHRoaXMub3V0KTtcclxuICAgICAgICBjb25zdCB2aXNpdG9yID0gbmV3IFByb2dyYW1WaXNpdG9yKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBY3Rpb25zRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgYWN0aW9uczpFeHByZXNzaW9uW10pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJpbmFyeUV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgbGVmdD86RXhwcmVzc2lvbjtcclxuICAgIHJpZ2h0PzpFeHByZXNzaW9uO1xyXG59IiwiaW1wb3J0IHsgQmluYXJ5RXhwcmVzc2lvbiB9IGZyb20gXCIuL0JpbmFyeUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgSWRlbnRpZmllckV4cHJlc3Npb24gfSBmcm9tIFwiLi9JZGVudGlmaWVyRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbXBhcmlzb25FeHByZXNzaW9uIGV4dGVuZHMgQmluYXJ5RXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKGlkZW50aWZpZXI6SWRlbnRpZmllckV4cHJlc3Npb24sIGNvbXBhcmVkVG86RXhwcmVzc2lvbil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmxlZnQgPSBpZGVudGlmaWVyO1xyXG4gICAgICAgIHRoaXMucmlnaHQgPSBjb21wYXJlZFRvO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQmluYXJ5RXhwcmVzc2lvbiB9IGZyb20gXCIuL0JpbmFyeUV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb25jYXRlbmF0aW9uRXhwcmVzc2lvbiBleHRlbmRzIEJpbmFyeUV4cHJlc3Npb257XHJcbiAgICBcclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udGFpbnNFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB0YXJnZXROYW1lOnN0cmluZyxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBjb3VudDpudW1iZXIsIFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHR5cGVOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBFeHByZXNzaW9ue1xyXG4gICAgXHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4vVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBCaW5hcnlFeHByZXNzaW9uIH0gZnJvbSBcIi4vQmluYXJ5RXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHR5cGVOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICBpbml0aWFsVmFsdWU/Ok9iamVjdDtcclxuICAgIHR5cGU/OlR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb247XHJcbiAgICBhc3NvY2lhdGVkRXhwcmVzc2lvbnM6QmluYXJ5RXhwcmVzc2lvbltdID0gW107XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIElkZW50aWZpZXJFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBpbnN0YW5jZU5hbWU6c3RyaW5nfHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB2YXJpYWJsZU5hbWU6c3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJZkV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGNvbmRpdGlvbmFsOkV4cHJlc3Npb24sXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgaWZCbG9jazpFeHByZXNzaW9uLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGVsc2VCbG9jazpFeHByZXNzaW9ufG51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExpc3RFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpdGVtczpFeHByZXNzaW9uW10pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExpdGVyYWxFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB0eXBlTmFtZTpzdHJpbmcsIHB1YmxpYyByZWFkb25seSB2YWx1ZTpPYmplY3Qpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb2dyYW1FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGV4cHJlc3Npb25zOkV4cHJlc3Npb25bXSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2F5RXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGV4dDpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNldFZhcmlhYmxlRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgaW5zdGFuY2VOYW1lOnN0cmluZ3x1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdmFyaWFibGVOYW1lOnN0cmluZywgXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgZXZhbHVhdGlvbkV4cHJlc3Npb246RXhwcmVzc2lvbil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4uLy4uL2xleGluZy9Ub2tlblwiO1xyXG5pbXBvcnQgeyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuL0ZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi9XaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBuYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICBiYXNlVHlwZT86VHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbjtcclxuICAgIGZpZWxkczpGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbltdID0gW107XHJcbiAgICBldmVudHM6V2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvbltdID0gW107XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWVUb2tlbjpUb2tlbiwgcmVhZG9ubHkgYmFzZVR5cGVOYW1lVG9rZW46VG9rZW4pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZVRva2VuLnZhbHVlO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdmFsdWU6c3RyaW5nLCBwdWJsaWMgcmVhZG9ubHkgbWVhbmluZzpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGFjdG9yOnN0cmluZyxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBldmVudEtpbmQ6c3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGFjdGlvbnM6RXhwcmVzc2lvbil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBBY3Rpb25zRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9BY3Rpb25zRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0V4cHJlc3Npb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmxvY2tFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OlBhcnNlQ29udGV4dCk6RXhwcmVzc2lvbntcclxuXHJcbiAgICAgICAgY29uc3QgYWN0aW9uczpFeHByZXNzaW9uW10gPSBbXTtcclxuICAgICAgICBjb25zdCBleHByZXNzaW9uVmlzaXRvciA9IG5ldyBFeHByZXNzaW9uVmlzaXRvcigpO1xyXG5cclxuICAgICAgICB3aGlsZSghY29udGV4dC5pcyhLZXl3b3Jkcy5hbmQpICYmICFjb250ZXh0LmlzKEtleXdvcmRzLm9yKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbiA9IGV4cHJlc3Npb25WaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goYWN0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0U2VtaVRlcm1pbmF0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQWN0aW9uc0V4cHJlc3Npb24oYWN0aW9ucyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgQ29tcGFyaXNvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvQ29tcGFyaXNvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IElkZW50aWZpZXJFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0lkZW50aWZpZXJFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbXBhcmlzb25FeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcbiAgICAgICAgY29uc3QgaWRlbnRpZmllckV4cHJlc3Npb24gPSBuZXcgSWRlbnRpZmllckV4cHJlc3Npb24odW5kZWZpbmVkLCBpZGVudGlmaWVyLnZhbHVlKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXMpO1xyXG5cclxuICAgICAgICB2YXIgdmlzaXRvciA9IG5ldyBFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgIHZhciBjb21wYXJlZFRvID0gdmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb21wYXJpc29uRXhwcmVzc2lvbihpZGVudGlmaWVyRXhwcmVzc2lvbiwgY29tcGFyZWRUbyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0V4cHJlc3Npb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFB1bmN0dWF0aW9uIH0gZnJvbSBcIi4uLy4uL2xleGluZy9QdW5jdHVhdGlvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgQWN0aW9uc0V4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvQWN0aW9uc0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBFdmVudEV4cHJlc3Npb25WaXNpdG9yIGV4dGVuZHMgRXhwcmVzc2lvblZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OlBhcnNlQ29udGV4dCk6RXhwcmVzc2lvbntcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBhY3Rpb25zOkV4cHJlc3Npb25bXSA9IFtdO1xyXG5cclxuICAgICAgICB3aGlsZSghY29udGV4dC5pcyhLZXl3b3Jkcy5hbmQpKXtcclxuICAgICAgICAgICAgY29uc3QgYWN0aW9uID0gc3VwZXIudmlzaXQoY29udGV4dCk7XHJcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaChhY3Rpb24pO1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3RTZW1pVGVybWluYXRvcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYW5kKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy50aGVuKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5zdG9wKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBY3Rpb25zRXhwcmVzc2lvbihhY3Rpb25zKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBJZkV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vSWZFeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4uLy4uL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvclwiO1xyXG5pbXBvcnQgeyBDb250YWluc0V4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvQ29udGFpbnNFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFNheUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvU2F5RXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL1Rva2VuVHlwZVwiO1xyXG5pbXBvcnQgeyBTZXRWYXJpYWJsZUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvU2V0VmFyaWFibGVFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IExpdGVyYWxFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0xpdGVyYWxFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IE51bWJlclR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9OdW1iZXJUeXBlXCI7XHJcbmltcG9ydCB7IFN0cmluZ1R5cGUgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9TdHJpbmdUeXBlXCI7XHJcbmltcG9ydCB7IExpc3RFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0xpc3RFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IENvbXBhcmlzb25FeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0NvbXBhcmlzb25FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IENvbnZlcnQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9Db252ZXJ0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRXhwcmVzc2lvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuaWYpKXtcclxuICAgICAgICAgICAgY29uc3QgdmlzaXRvciA9IG5ldyBJZkV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5pdCkpe1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pdCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmNvbnRhaW5zKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gY29udGV4dC5leHBlY3ROdW1iZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgdHlwZU5hbWUgPSBjb250ZXh0LmV4cGVjdElkZW50aWZpZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbnNFeHByZXNzaW9uKFwifml0XCIsIE51bWJlcihjb3VudC52YWx1ZSksIHR5cGVOYW1lLnZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuc2V0KSl7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnNldCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgdmFyaWFibGVOYW1lOnN0cmluZztcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmlzVHlwZU9mKFRva2VuVHlwZS5JZGVudGlmaWVyKSl7XHJcbiAgICAgICAgICAgICAgICB2YXJpYWJsZU5hbWUgPSBjb250ZXh0LmV4cGVjdElkZW50aWZpZXIoKS52YWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IFN1cHBvcnQgZGVyZWZlcmVuY2luZyBhcmJpdHJhcnkgaW5zdGFuY2VzLlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJDdXJyZW50bHkgdW5hYmxlIHRvIGRlcmVmZXJlbmNlIGEgZmllbGQsIHBsYW5uZWQgZm9yIGEgZnV0dXJlIHJlbGVhc2VcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnRvKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgRXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2aXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTZXRWYXJpYWJsZUV4cHJlc3Npb24odW5kZWZpbmVkLCB2YXJpYWJsZU5hbWUsIHZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuc2F5KSl7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnNheSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU2F5RXhwcmVzc2lvbih0ZXh0LnZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLlN0cmluZykpe1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IExpdGVyYWxFeHByZXNzaW9uKFN0cmluZ1R5cGUudHlwZU5hbWUsIHZhbHVlLnZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLk51bWJlcikpe1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnRleHQuZXhwZWN0TnVtYmVyKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IExpdGVyYWxFeHByZXNzaW9uKE51bWJlclR5cGUudHlwZU5hbWUsIE51bWJlcih2YWx1ZS52YWx1ZSkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuQm9vbGVhbikpe1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbnRleHQuZXhwZWN0Qm9vbGVhbigpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBMaXRlcmFsRXhwcmVzc2lvbihCb29sZWFuVHlwZS50eXBlTmFtZSwgQ29udmVydC5zdHJpbmdUb0Jvb2xlYW4odmFsdWUudmFsdWUpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLkxpc3RTZXBhcmF0b3IpKXtcclxuICAgICAgICAgICAgY29uc3QgaXRlbXM6RXhwcmVzc2lvbltdID0gW107XHJcblxyXG4gICAgICAgICAgICB3aGlsZShjb250ZXh0LmlzVHlwZU9mKFRva2VuVHlwZS5MaXN0U2VwYXJhdG9yKSl7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBMaXN0RXhwcmVzc2lvbihpdGVtcyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzRm9sbG93ZWRCeShLZXl3b3Jkcy5pcykpe1xyXG4gICAgICAgICAgICBjb25zdCB2aXNpdG9yID0gbmV3IENvbXBhcmlzb25FeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgVW5hYmxlIHRvIHBhcnNlIGV4cHJlc3Npb24gYXQgJHtjb250ZXh0LmN1cnJlbnRUb2tlbn1gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0ZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4uLy4uL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvclwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFN0cmluZ1R5cGUgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9TdHJpbmdUeXBlXCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IEFuZEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvQW5kRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0V4cHJlc3Npb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IENvbmNhdGVuYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0NvbmNhdGVuYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuLi8uLi9sZXhpbmcvVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IE51bWJlclR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9OdW1iZXJUeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRmllbGREZWNsYXJhdGlvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZpZWxkID0gbmV3IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLml0KTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuaXMpKXtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRleHQuaXNBbnlPZihLZXl3b3Jkcy5ub3QsIEtleXdvcmRzLnZpc2libGUpKXtcclxuICAgICAgICAgICAgICAgIGxldCBpc1Zpc2libGUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLm5vdCkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLm5vdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNWaXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudmlzaWJsZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IFdvcmxkT2JqZWN0LnZpc2libGU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IEJvb2xlYW5UeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gaXNWaXNpYmxlO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLm9ic2VydmVkKSl7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5vYnNlcnZlZCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2JzZXJ2YXRpb24gPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBXb3JsZE9iamVjdC5vYnNlcnZhdGlvbjtcclxuICAgICAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gU3RyaW5nVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IG9ic2VydmF0aW9uLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmRlc2NyaWJlZCkpe1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuZGVzY3JpYmVkKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmFzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IFdvcmxkT2JqZWN0LmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gZGVzY3JpcHRpb24udmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbnRleHQuaXMoS2V5d29yZHMuYW5kKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYW5kKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHByZXNzaW9uVmlzaXRvciA9IG5ldyBFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVmdEV4cHJlc3Npb24gPSAoZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zLmxlbmd0aCA9PSAwKSA/IGZpZWxkIDogZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zW2ZpZWxkLmFzc29jaWF0ZWRFeHByZXNzaW9ucy5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29uY2F0ID0gbmV3IENvbmNhdGVuYXRpb25FeHByZXNzaW9uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmNhdC5sZWZ0ID0gbGVmdEV4cHJlc3Npb247XHJcbiAgICAgICAgICAgICAgICAgICAgY29uY2F0LnJpZ2h0ID0gZXhwcmVzc2lvbjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zLnB1c2goY29uY2F0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy53aGVyZSkpe1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMud2hlcmUpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnBsYXllcik7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5zdGFydHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBQbGFjZS5pc1BsYXllclN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBCb29sZWFuVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byBkZXRlcm1pbmUgcHJvcGVydHkgZmllbGRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuaGFzKSl7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5oYXMpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBjb250ZXh0LmV4cGVjdElkZW50aWZpZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnRoYXQpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29udGV4dC5pc1R5cGVPZihUb2tlblR5cGUuU3RyaW5nKSl7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IFN0cmluZ1R5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpLnZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXNUeXBlT2YoVG9rZW5UeXBlLk51bWJlcikpe1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBOdW1iZXJUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gY29udGV4dC5leHBlY3ROdW1iZXIoKS52YWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzVHlwZU9mKFRva2VuVHlwZS5Cb29sZWFuKSl7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IEJvb2xlYW5UeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gY29udGV4dC5leHBlY3RCb29sZWFuKCkudmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgRXhwZWN0ZWQgYSBzdHJpbmcsIG51bWJlciwgb3IgYm9vbGVhbiBidXQgZm91bmQgJyR7Y29udGV4dC5jdXJyZW50VG9rZW4udmFsdWV9JyBvZiB0eXBlICcke2NvbnRleHQuY3VycmVudFRva2VuLnR5cGV9J2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgZmllbGQubmFtZSA9IG5hbWUudmFsdWU7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5jb250YWlucykpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuY29udGFpbnMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZXhwZWN0UGFpciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gY29udGV4dC5leHBlY3ROdW1iZXIoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBjb250ZXh0LmV4cGVjdElkZW50aWZpZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW051bWJlcihjb3VudC52YWx1ZSksIG5hbWUudmFsdWVdO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBbZXhwZWN0UGFpcigpXTtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChjb250ZXh0LmlzVHlwZU9mKFRva2VuVHlwZS5MaXN0U2VwYXJhdG9yKSl7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGV4cGVjdFBhaXIoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBXb3JsZE9iamVjdC5jb250ZW50cztcclxuICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBMaXN0LnR5cGVOYW1lO1xyXG4gICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBpdGVtczsgXHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmNhbikpe1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuY2FuKTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMucmVhY2gpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy50aGUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcGxhY2VOYW1lID0gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5ieSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmdvaW5nKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICBmaWVsZC5uYW1lID0gYH4ke2RpcmVjdGlvbi52YWx1ZX1gO1xyXG4gICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IFN0cmluZ1R5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IGAke3BsYWNlTmFtZS52YWx1ZX1gO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiVW5hYmxlIHRvIGRldGVybWluZSBmaWVsZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBmaWVsZDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0V4cHJlc3Npb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IElmRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9JZkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQmxvY2tFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0Jsb2NrRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi8uLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJZkV4cHJlc3Npb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmlmKTtcclxuXHJcbiAgICAgICAgY29uc3QgZXhwcmVzc2lvblZpc2l0b3IgPSBuZXcgRXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICBjb25zdCBjb25kaXRpb25hbCA9IGV4cHJlc3Npb25WaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy50aGVuKTtcclxuXHJcbiAgICAgICAgY29uc3QgYmxvY2tWaXNpdG9yID0gbmV3IEJsb2NrRXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICBjb25zdCBpZkJsb2NrID0gYmxvY2tWaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgIGNvbnN0IGVsc2VCbG9jayA9IHRoaXMudHJ5VmlzaXRFbHNlQmxvY2soY29udGV4dCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuYW5kKSl7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmFuZCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnRoZW4pO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5jb250aW51ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYFlvdSBuZWVkIHRvIGVuZCBhbiAnaWYnIGV4cHJlc3Npb24gY29ycmVjdGx5LCBub3Qgd2l0aDogJHtjb250ZXh0LmN1cnJlbnRUb2tlbn1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgSWZFeHByZXNzaW9uKGNvbmRpdGlvbmFsLCBpZkJsb2NrLCBlbHNlQmxvY2spO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdHJ5VmlzaXRFbHNlQmxvY2soY29udGV4dDpQYXJzZUNvbnRleHQpe1xyXG4gICAgICAgIGlmICghY29udGV4dC5pcyhLZXl3b3Jkcy5vcikpe1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBjb25zdCBibG9ja1Zpc2l0b3IgPSBuZXcgQmxvY2tFeHByZXNzaW9uVmlzaXRvcigpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5vcik7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuZWxzZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBibG9ja1Zpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL1R5cGVEZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgUHJvZ3JhbUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvUHJvZ3JhbUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi8uLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgU2F5RXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9TYXlFeHByZXNzaW9uVmlzaXRvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb2dyYW1WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGxldCBleHByZXNzaW9uczpFeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUoIWNvbnRleHQuaXNEb25lKXtcclxuICAgICAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMudW5kZXJzdGFuZCkpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uID0gbmV3IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB1bmRlcnN0YW5kaW5nRGVjbGFyYXRpb24udmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzQW55T2YoS2V5d29yZHMuYSwgS2V5d29yZHMuYW4pKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVEZWNsYXJhdGlvbiA9IG5ldyBUeXBlRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gdHlwZURlY2xhcmF0aW9uLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5zYXkpKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNheUV4cHJlc3Npb24gPSBuZXcgU2F5RXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBzYXlFeHByZXNzaW9uLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEF0IHRoZSB0b3AgbGV2ZWwsIGEgc2F5IGV4cHJlc3Npb24gbXVzdCBoYXZlIGEgdGVybWluYXRvci4gV2UncmUgZXZhbHVhdGluZyBpdCBvdXQgaGVyZVxyXG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSBhIHNheSBleHByZXNzaW9uIG5vcm1hbGx5IGRvZXNuJ3QgcmVxdWlyZSBvbmUuXHJcblxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYEZvdW5kIHVuZXhwZWN0ZWQgdG9rZW4gJyR7Y29udGV4dC5jdXJyZW50VG9rZW59J2ApO1xyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb2dyYW1FeHByZXNzaW9uKGV4cHJlc3Npb25zKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBTYXlFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1NheUV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTYXlFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5zYXkpO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0ID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBTYXlFeHByZXNzaW9uKHRleHQudmFsdWUpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4uLy4uL2xleGluZy9Ub2tlblwiO1xyXG5pbXBvcnQgeyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1R5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvblZpc2l0b3IgfSBmcm9tIFwiLi9GaWVsZERlY2xhcmF0aW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1doZW5EZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgV2hlbkRlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL1doZW5EZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBlRGVjbGFyYXRpb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0QW55T2YoS2V5d29yZHMuYSwgS2V5d29yZHMuYW4pO1xyXG5cclxuICAgICAgICBjb25zdCBuYW1lID0gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmlzKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5raW5kKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5vZik7XHJcblxyXG4gICAgICAgIGNvbnN0IGJhc2VUeXBlID0gdGhpcy5leHBlY3RCYXNlVHlwZShjb250ZXh0KTtcclxuICAgICAgICBcclxuICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZmllbGRzOkZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGNvbnRleHQuaXMoS2V5d29yZHMuaXQpKXtcclxuICAgICAgICAgICAgY29uc3QgZmllbGRWaXNpdG9yID0gbmV3IEZpZWxkRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gZmllbGRWaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgZmllbGRzLnB1c2goPEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uPmZpZWxkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGV2ZW50czpXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGNvbnRleHQuaXMoS2V5d29yZHMud2hlbikpe1xyXG4gICAgICAgICAgICBjb25zdCB3aGVuVmlzaXRvciA9IG5ldyBXaGVuRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHdoZW4gPSB3aGVuVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIGV2ZW50cy5wdXNoKDxXaGVuRGVjbGFyYXRpb25FeHByZXNzaW9uPndoZW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHlwZURlY2xhcmF0aW9uID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24obmFtZSwgYmFzZVR5cGUpO1xyXG5cclxuICAgICAgICB0eXBlRGVjbGFyYXRpb24uZmllbGRzID0gZmllbGRzO1xyXG4gICAgICAgIHR5cGVEZWNsYXJhdGlvbi5ldmVudHMgPSBldmVudHM7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlRGVjbGFyYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBleHBlY3RCYXNlVHlwZShjb250ZXh0OlBhcnNlQ29udGV4dCl7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXNBbnlPZihLZXl3b3Jkcy5wbGFjZSwgS2V5d29yZHMuaXRlbSwgS2V5d29yZHMuZGVjb3JhdGlvbikpe1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnVuZGVyc3RhbmQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYXMpO1xyXG5cclxuICAgICAgICBjb25zdCBtZWFuaW5nID0gY29udGV4dC5leHBlY3RBbnlPZihLZXl3b3Jkcy5kZXNjcmliaW5nLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy5tb3ZpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2V5d29yZHMuZGlyZWN0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy50YWtpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2V5d29yZHMuaW52ZW50b3J5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEtleXdvcmRzLmRyb3BwaW5nKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbih2YWx1ZS52YWx1ZSwgbWVhbmluZy52YWx1ZSk7ICAgICAgICBcclxuICAgIH1cclxufSIsImltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVmlzaXRvcntcclxuICAgIGFic3RyYWN0IHZpc2l0KGNvbnRleHQ6UGFyc2VDb250ZXh0KTpFeHByZXNzaW9uO1xyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvV2hlbkRlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQdW5jdHVhdGlvbiB9IGZyb20gXCIuLi8uLi9sZXhpbmcvUHVuY3R1YXRpb25cIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBFdmVudEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXZlbnRFeHByZXNzaW9uVmlzaXRvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoZW5EZWNsYXJhdGlvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMud2hlbik7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5wbGF5ZXIpO1xyXG5cclxuICAgICAgICBjb25zdCBldmVudEtpbmQgPSBjb250ZXh0LmV4cGVjdEFueU9mKEtleXdvcmRzLmVudGVycywgS2V5d29yZHMuZXhpdHMpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdE9wZW5NZXRob2RCbG9jaygpO1xyXG5cclxuICAgICAgICBjb25zdCBhY3Rpb25zVmlzaXRvciA9IG5ldyBFdmVudEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IGFjdGlvbnNWaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFdoZW5EZWNsYXJhdGlvbkV4cHJlc3Npb24oS2V5d29yZHMucGxheWVyLCBldmVudEtpbmQudmFsdWUsIGFjdGlvbnMpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFByb2dyYW1FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvUHJvZ3JhbUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1R5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vLi4vcnVudGltZS9JT3V0cHV0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25TZW1hbnRpY0FuYWx5emVye1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYW55ID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yQW55LCBUb2tlbi5lbXB0eSk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHdvcmxkT2JqZWN0ID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yV29ybGRPYmplY3QsIFRva2VuLmZvckFueSk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IHBsYWNlID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yUGxhY2UsIFRva2VuLmZvcldvcmxkT2JqZWN0KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgaXRlbSA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvckl0ZW0sIFRva2VuLmZvcldvcmxkT2JqZWN0KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgYm9vbGVhblR5cGUgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JCb29sZWFuLCBUb2tlbi5mb3JBbnkpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBsaXN0ID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yTGlzdCwgVG9rZW4uZm9yQW55KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGVjb3JhdGlvbiA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvckRlY29yYXRpb24sIFRva2VuLmZvcldvcmxkT2JqZWN0KTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dDpJT3V0cHV0KXtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFuYWx5emUoZXhwcmVzc2lvbjpFeHByZXNzaW9uKTpFeHByZXNzaW9ue1xyXG4gICAgICAgIGNvbnN0IHR5cGVzOlR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25bXSA9IFt0aGlzLmFueSwgdGhpcy53b3JsZE9iamVjdCwgdGhpcy5wbGFjZSwgdGhpcy5ib29sZWFuVHlwZSwgdGhpcy5pdGVtLCB0aGlzLmRlY29yYXRpb25dO1xyXG5cclxuICAgICAgICBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIFByb2dyYW1FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgZm9yKGxldCBjaGlsZCBvZiBleHByZXNzaW9uLmV4cHJlc3Npb25zKXtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVzLnB1c2goY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0eXBlc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uPih0eXBlcy5tYXAoeCA9PiBbeC5uYW1lLCB4XSkpO1xyXG5cclxuICAgICAgICBmb3IoY29uc3QgZGVjbGFyYXRpb24gb2YgdHlwZXMpe1xyXG4gICAgICAgICAgICBjb25zdCBiYXNlVG9rZW4gPSBkZWNsYXJhdGlvbi5iYXNlVHlwZU5hbWVUb2tlbjtcclxuXHJcbiAgICAgICAgICAgIGlmIChiYXNlVG9rZW4udHlwZSA9PSBUb2tlblR5cGUuS2V5d29yZCAmJiAhYmFzZVRva2VuLnZhbHVlLnN0YXJ0c1dpdGgoXCJ+XCIpKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBgfiR7YmFzZVRva2VuLnZhbHVlfWA7XHJcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbi5iYXNlVHlwZSA9IHR5cGVzQnlOYW1lLmdldChuYW1lKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uLmJhc2VUeXBlID0gdHlwZXNCeU5hbWUuZ2V0KGJhc2VUb2tlbi52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBmaWVsZCBvZiBkZWNsYXJhdGlvbi5maWVsZHMpe1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZSA9IHR5cGVzQnlOYW1lLmdldChmaWVsZC50eXBlTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBleHByZXNzaW9uO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gRXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZXtcclxuICAgIE5vbmUsXHJcbiAgICBJZ25vcmVSZXN1bHRzT2ZTYXlFeHByZXNzaW9uXHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFByb2dyYW1FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvUHJvZ3JhbUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1R5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZyB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1VuZGVyc3RhbmRpbmdcIjtcclxuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL0ZpZWxkXCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvSXRlbVwiO1xyXG5pbXBvcnQgeyBOdW1iZXJUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTnVtYmVyVHlwZVwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgU2F5RXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1NheUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9NZXRob2RcIjtcclxuaW1wb3J0IHsgU2F5IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU2F5XCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9JbnN0cnVjdGlvblwiO1xyXG5pbXBvcnQgeyBQYXJhbWV0ZXIgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1BhcmFtZXRlclwiO1xyXG5pbXBvcnQgeyBJZkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9JZkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9Db25jYXRlbmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBDb250YWluc0V4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9Db250YWluc0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBBY3Rpb25zRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0FjdGlvbnNFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBFdmVudFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL0V2ZW50VHlwZVwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uVHJhbnNmb3JtYXRpb25Nb2RlIH0gZnJvbSBcIi4vRXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZVwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uLy4uL3J1bnRpbWUvSU91dHB1dFwiO1xyXG5pbXBvcnQgeyBTZXRWYXJpYWJsZUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9TZXRWYXJpYWJsZUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgTGl0ZXJhbEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9MaXRlcmFsRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBEZWNvcmF0aW9uIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvRGVjb3JhdGlvblwiO1xyXG5pbXBvcnQgeyBDb21wYXJpc29uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0NvbXBhcmlzb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IElkZW50aWZpZXJFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvSWRlbnRpZmllckV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29udmVydCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0NvbnZlcnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvblRyYW5zZm9ybWVye1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXQ6SU91dHB1dCl7XHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGNyZWF0ZVN5c3RlbVR5cGVzKCl7XHJcbiAgICAgICAgY29uc3QgdHlwZXM6VHlwZVtdID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVGhlc2UgYXJlIG9ubHkgaGVyZSBhcyBzdHVicyBmb3IgZXh0ZXJuYWwgcnVudGltZSB0eXBlcyB0aGF0IGFsbG93IHVzIHRvIGNvcnJlY3RseSByZXNvbHZlIGZpZWxkIHR5cGVzLlxyXG5cclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKEFueS50eXBlTmFtZSwgQW55LnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShXb3JsZE9iamVjdC50eXBlTmFtZSwgV29ybGRPYmplY3QucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFBsYWNlLnR5cGVOYW1lLCBQbGFjZS5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoQm9vbGVhblR5cGUudHlwZU5hbWUsIEJvb2xlYW5UeXBlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShTdHJpbmdUeXBlLnR5cGVOYW1lLCBTdHJpbmdUeXBlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShOdW1iZXJUeXBlLnR5cGVOYW1lLCBOdW1iZXJUeXBlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShJdGVtLnR5cGVOYW1lLCBJdGVtLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShMaXN0LnR5cGVOYW1lLCBMaXN0LnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShQbGF5ZXIudHlwZU5hbWUsIFBsYXllci5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoU2F5LnR5cGVOYW1lLCBTYXkucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKERlY29yYXRpb24udHlwZU5hbWUsIERlY29yYXRpb24ucGFyZW50VHlwZU5hbWUpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXA8c3RyaW5nLCBUeXBlPih0eXBlcy5tYXAoeCA9PiBbeC5uYW1lLCB4XSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybShleHByZXNzaW9uOkV4cHJlc3Npb24pOlR5cGVbXXtcclxuICAgICAgICBjb25zdCB0eXBlc0J5TmFtZSA9IHRoaXMuY3JlYXRlU3lzdGVtVHlwZXMoKTtcclxuICAgICAgICBsZXQgZHluYW1pY1R5cGVDb3VudCA9IDA7XHJcblxyXG4gICAgICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgUHJvZ3JhbUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBmb3IoY29uc3QgY2hpbGQgb2YgZXhwcmVzc2lvbi5leHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoYH4ke1VuZGVyc3RhbmRpbmcudHlwZU5hbWV9XyR7ZHluYW1pY1R5cGVDb3VudH1gLCBVbmRlcnN0YW5kaW5nLnR5cGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb24gPSBuZXcgRmllbGQoKTtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24ubmFtZSA9IFVuZGVyc3RhbmRpbmcuYWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5kZWZhdWx0VmFsdWUgPSBjaGlsZC52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVhbmluZyA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lYW5pbmcubmFtZSA9IFVuZGVyc3RhbmRpbmcubWVhbmluZztcclxuICAgICAgICAgICAgICAgICAgICBtZWFuaW5nLmRlZmF1bHRWYWx1ZSA9IGNoaWxkLm1lYW5pbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZS5maWVsZHMucHVzaChhY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUuZmllbGRzLnB1c2gobWVhbmluZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWNUeXBlQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZXNCeU5hbWUuc2V0KHR5cGUubmFtZSwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMudHJhbnNmb3JtSW5pdGlhbFR5cGVEZWNsYXJhdGlvbihjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZXNCeU5hbWUuc2V0KHR5cGUubmFtZSwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgY2hpbGQgb2YgZXhwcmVzc2lvbi5leHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gdHlwZXNCeU5hbWUuZ2V0KGNoaWxkLm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IoY29uc3QgZmllbGRFeHByZXNzaW9uIG9mIGNoaWxkLmZpZWxkcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZEV4cHJlc3Npb24ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBmaWVsZEV4cHJlc3Npb24udHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLnR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoZmllbGRFeHByZXNzaW9uLnR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZC50eXBlTmFtZSA9PSBTdHJpbmdUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IDxzdHJpbmc+ZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZU5hbWUgPT0gTnVtYmVyVHlwZS50eXBlTmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBOdW1iZXIoZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGVOYW1lID09IEJvb2xlYW5UeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlID09ICdzdHJpbmcnKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBDb252ZXJ0LnN0cmluZ1RvQm9vbGVhbihmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlID09ICdib29sZWFuJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgVW5hYmxlIHRvIHRyYW5zZm9ybSBmaWVsZCB0eXBlYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSBmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmllbGRFeHByZXNzaW9uLmFzc29jaWF0ZWRFeHByZXNzaW9ucy5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdldEZpZWxkID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RmllbGQubmFtZSA9IGB+Z2V0XyR7ZmllbGQubmFtZX1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RmllbGQucGFyYW1ldGVycy5wdXNoKG5ldyBQYXJhbWV0ZXIoXCJ+dmFsdWVcIiwgZmllbGQudHlwZU5hbWUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLnJldHVyblR5cGUgPSBmaWVsZC50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGNvbnN0IGFzc29jaWF0ZWQgb2YgZmllbGRFeHByZXNzaW9uLmFzc29jaWF0ZWRFeHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RmllbGQuYm9keS5wdXNoKC4uLnRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihhc3NvY2lhdGVkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RmllbGQuYm9keS5wdXNoKEluc3RydWN0aW9uLnJldHVybigpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5tZXRob2RzLnB1c2goZ2V0RmllbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5maWVsZHMucHVzaChmaWVsZCk7ICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXNXb3JsZE9iamVjdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGN1cnJlbnQgPSB0eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gdHlwZXNCeU5hbWUuZ2V0KGN1cnJlbnQuYmFzZVR5cGVOYW1lKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudC5uYW1lID09IFdvcmxkT2JqZWN0LnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1dvcmxkT2JqZWN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNXb3JsZE9iamVjdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NyaWJlID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmliZS5uYW1lID0gV29ybGRPYmplY3QuZGVzY3JpYmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaWJlLmJvZHkucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkUHJvcGVydHkoV29ybGRPYmplY3QudmlzaWJsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5icmFuY2hSZWxhdGl2ZUlmRmFsc2UoMTApLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkUHJvcGVydHkoV29ybGRPYmplY3QuZGVzY3JpcHRpb24pLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoJyAnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5jcmVhdGVEZWxlZ2F0ZSh0eXBlPy5uYW1lISwgV29ybGRPYmplY3Qub2JzZXJ2ZSksXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRQcm9wZXJ0eShXb3JsZE9iamVjdC5jb250ZW50cyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5pbnN0YW5jZUNhbGwoTGlzdC5tYXApLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmluc3RhbmNlQ2FsbChMaXN0LmpvaW4pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uY29uY2F0ZW5hdGUoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5yZXR1cm4oKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8ubWV0aG9kcy5wdXNoKGRlc2NyaWJlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9ic2VydmUgPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmUubmFtZSA9IFdvcmxkT2JqZWN0Lm9ic2VydmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmUucmV0dXJuVHlwZSA9IFN0cmluZ1R5cGUudHlwZU5hbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlLmJvZHkucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkUHJvcGVydHkoV29ybGRPYmplY3QudmlzaWJsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5icmFuY2hSZWxhdGl2ZUlmRmFsc2UoNCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFByb3BlcnR5KFdvcmxkT2JqZWN0Lm9ic2VydmF0aW9uKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLnJldHVybigpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIlwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLnJldHVybigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5tZXRob2RzLnB1c2gob2JzZXJ2ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXR5cGU/LmZpZWxkcy5maW5kKHggPT4geC5uYW1lID09IFdvcmxkT2JqZWN0LnZpc2libGUpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZpc2libGUgPSBuZXcgRmllbGQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlLm5hbWUgPSBXb3JsZE9iamVjdC52aXNpYmxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZS50eXBlTmFtZSA9IEJvb2xlYW5UeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZS5kZWZhdWx0VmFsdWUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/LmZpZWxkcy5wdXNoKHZpc2libGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXR5cGU/LmZpZWxkcy5maW5kKHggPT4geC5uYW1lID09IFdvcmxkT2JqZWN0LmNvbnRlbnRzKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50cyA9IG5ldyBGaWVsZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzLm5hbWUgPSBXb3JsZE9iamVjdC5jb250ZW50cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzLnR5cGVOYW1lID0gTGlzdC50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzLmRlZmF1bHRWYWx1ZSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/LmZpZWxkcy5wdXNoKGNvbnRlbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlPy5maWVsZHMuZmluZCh4ID0+IHgubmFtZSA9PSBXb3JsZE9iamVjdC5vYnNlcnZhdGlvbikpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2JzZXJ2YXRpb24gPSBuZXcgRmllbGQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZhdGlvbi5uYW1lID0gV29ybGRPYmplY3Qub2JzZXJ2YXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZhdGlvbi50eXBlTmFtZSA9IFN0cmluZ1R5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZhdGlvbi5kZWZhdWx0VmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/LmZpZWxkcy5wdXNoKG9ic2VydmF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGR1cGxpY2F0ZUV2ZW50Q291bnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBldmVudCBvZiBjaGlsZC5ldmVudHMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gbmV3IE1ldGhvZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5uYW1lID0gYH5ldmVudF8ke2V2ZW50LmFjdG9yfV8ke2V2ZW50LmV2ZW50S2luZH1fJHtkdXBsaWNhdGVFdmVudENvdW50fWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QuZXZlbnRUeXBlID0gdGhpcy50cmFuc2Zvcm1FdmVudEtpbmQoZXZlbnQuZXZlbnRLaW5kKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXBsaWNhdGVFdmVudENvdW50Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aW9ucyA9IDxBY3Rpb25zRXhwcmVzc2lvbj5ldmVudC5hY3Rpb25zO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihjb25zdCBhY3Rpb24gb2YgYWN0aW9ucy5hY3Rpb25zKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGFjdGlvbiwgRXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZS5JZ25vcmVSZXN1bHRzT2ZTYXlFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QuYm9keS5wdXNoKC4uLmJvZHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZC5ib2R5LnB1c2goSW5zdHJ1Y3Rpb24ucmV0dXJuKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/Lm1ldGhvZHMucHVzaChtZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZ2xvYmFsU2F5cyA9IGV4cHJlc3Npb24uZXhwcmVzc2lvbnMuZmlsdGVyKHggPT4geCBpbnN0YW5jZW9mIFNheUV4cHJlc3Npb24pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHlwZSA9IG5ldyBUeXBlKGB+Z2xvYmFsU2F5c2AsIFNheS50eXBlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtZXRob2QgPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgICAgIG1ldGhvZC5uYW1lID0gU2F5LnR5cGVOYW1lO1xyXG4gICAgICAgICAgICBtZXRob2QucGFyYW1ldGVycyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25zOkluc3RydWN0aW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBzYXkgb2YgZ2xvYmFsU2F5cyl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzYXlFeHByZXNzaW9uID0gPFNheUV4cHJlc3Npb24+c2F5O1xyXG5cclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoc2F5RXhwcmVzc2lvbi50ZXh0KSxcclxuICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5yZXR1cm4oKSk7XHJcblxyXG4gICAgICAgICAgICBtZXRob2QuYm9keSA9IGluc3RydWN0aW9ucztcclxuXHJcbiAgICAgICAgICAgIHR5cGUubWV0aG9kcy5wdXNoKG1ldGhvZCk7XHJcblxyXG4gICAgICAgICAgICB0eXBlc0J5TmFtZS5zZXQodHlwZS5uYW1lLCB0eXBlKTsgIFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiVW5hYmxlIHRvIHBhcnRpYWxseSB0cmFuc2Zvcm1cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm91dC53cml0ZShgQ3JlYXRlZCAke3R5cGVzQnlOYW1lLnNpemV9IHR5cGVzLi4uYCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odHlwZXNCeU5hbWUudmFsdWVzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtRXZlbnRLaW5kKGtpbmQ6c3RyaW5nKXtcclxuICAgICAgICBzd2l0Y2goa2luZCl7XHJcbiAgICAgICAgICAgIGNhc2UgS2V5d29yZHMuZW50ZXJzOntcclxuICAgICAgICAgICAgICAgIHJldHVybiBFdmVudFR5cGUuUGxheWVyRW50ZXJzUGxhY2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBLZXl3b3Jkcy5leGl0czp7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRXZlbnRUeXBlLlBsYXllckV4aXRzUGxhY2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDp7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihgVW5hYmxlIHRvIHRyYW5zZm9ybSB1bnN1cHBvcnRlZCBldmVudCBraW5kICcke2tpbmR9J2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uOkV4cHJlc3Npb258bnVsbCwgbW9kZT86RXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZSl7XHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25zOkluc3RydWN0aW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gPT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHJldHVybiBpbnN0cnVjdGlvbnM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIElmRXhwcmVzc2lvbil7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbmFsID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24uY29uZGl0aW9uYWwsIG1vZGUpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5jb25kaXRpb25hbCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpZkJsb2NrID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24uaWZCbG9jaywgbW9kZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsc2VCbG9jayA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmVsc2VCbG9jaywgbW9kZSk7XHJcblxyXG4gICAgICAgICAgICBpZkJsb2NrLnB1c2goSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmUoZWxzZUJsb2NrLmxlbmd0aCkpO1xyXG5cclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmVJZkZhbHNlKGlmQmxvY2subGVuZ3RoKSlcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goLi4uaWZCbG9jayk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmVsc2VCbG9jayk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgU2F5RXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmxvYWRTdHJpbmcoZXhwcmVzc2lvbi50ZXh0KSk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLnByaW50KCkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1vZGUgIT0gRXhwcmVzc2lvblRyYW5zZm9ybWF0aW9uTW9kZS5JZ25vcmVSZXN1bHRzT2ZTYXlFeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmxvYWRTdHJpbmcoZXhwcmVzc2lvbi50ZXh0KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBDb250YWluc0V4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWROdW1iZXIoZXhwcmVzc2lvbi5jb3VudCksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGV4cHJlc3Npb24udHlwZU5hbWUpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEluc3RhbmNlKGV4cHJlc3Npb24udGFyZ2V0TmFtZSksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkRmllbGQoV29ybGRPYmplY3QuY29udGVudHMpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uaW5zdGFuY2VDYWxsKExpc3QuY29udGFpbnMpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIENvbmNhdGVuYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgY29uc3QgbGVmdCA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmxlZnQhLCBtb2RlKTtcclxuICAgICAgICAgICAgY29uc3QgcmlnaHQgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5yaWdodCEsIG1vZGUpO1xyXG5cclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goLi4ubGVmdCk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLnJpZ2h0KTtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24uY29uY2F0ZW5hdGUoKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkRmllbGQoZXhwcmVzc2lvbi5uYW1lKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIFNldFZhcmlhYmxlRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24uZXZhbHVhdGlvbkV4cHJlc3Npb24pO1xyXG5cclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICAuLi5yaWdodCxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkRmllbGQoZXhwcmVzc2lvbi52YXJpYWJsZU5hbWUpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uYXNzaWduKClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBMaXRlcmFsRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGlmIChleHByZXNzaW9uLnR5cGVOYW1lID09IFN0cmluZ1R5cGUudHlwZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyg8c3RyaW5nPmV4cHJlc3Npb24udmFsdWUpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uLnR5cGVOYW1lID09IE51bWJlclR5cGUudHlwZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24ubG9hZE51bWJlcihOdW1iZXIoZXhwcmVzc2lvbi52YWx1ZSkpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uLnR5cGVOYW1lID09IEJvb2xlYW5UeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmxvYWRCb29sZWFuKDxib29sZWFuPihleHByZXNzaW9uLnZhbHVlKSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYFVuYWJsZSB0byB0cmFuc2Zvcm0gdW5zdXBwb3J0ZWQgbGl0ZXJhbCBleHByZXNzaW9uICcke2V4cHJlc3Npb259J2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgSWRlbnRpZmllckV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkRmllbGQoZXhwcmVzc2lvbi52YXJpYWJsZU5hbWUpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBDb21wYXJpc29uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24ucmlnaHQhKTtcclxuICAgICAgICAgICAgY29uc3QgbGVmdCA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmxlZnQhKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgLi4ubGVmdCxcclxuICAgICAgICAgICAgICAgIC4uLnJpZ2h0LFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uY29tcGFyZUVxdWFsKClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBBY3Rpb25zRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGV4cHJlc3Npb24uYWN0aW9ucy5mb3JFYWNoKHggPT4gaW5zdHJ1Y3Rpb25zLnB1c2goLi4udGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKHgsIG1vZGUpKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYFVuYWJsZSB0byB0cmFuc2Zvcm0gdW5zdXBwb3J0ZWQgZXhwcmVzc2lvbjogJHtleHByZXNzaW9ufWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RydWN0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybUluaXRpYWxUeXBlRGVjbGFyYXRpb24oZXhwcmVzc2lvbjpUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICByZXR1cm4gbmV3IFR5cGUoZXhwcmVzc2lvbi5uYW1lLCBleHByZXNzaW9uLmJhc2VUeXBlIS5uYW1lKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IElQYW5lQW5hbHl6ZXIgfSBmcm9tIFwiLi9hbmFseXplcnMvSVBhbmVBbmFseXplclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFuYWx5c2lzQ29vcmRpbmF0b3Ige1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBhbmFseXplcjogSVBhbmVBbmFseXplciwgXHJcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IG91dHB1dDogSFRNTERpdkVsZW1lbnQpIHsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGFuYWx5emVyLmN1cnJlbnRQYW5lLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBlID0+IHRoaXMudXBkYXRlKCkpO1xyXG4gICAgICAgIGFuYWx5emVyLmN1cnJlbnRQYW5lLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHRoaXMudXBkYXRlKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlKCl7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDYXJldFBvc2l0aW9uVmFsdWVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVDYXJldFBvc2l0aW9uVmFsdWVzKCl7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmFuYWx5emVyLmN1cnJlbnRDYXJldFBvc2l0aW9uO1xyXG4gICAgICAgIGNvbnN0IGZvcm1hdHRlZFBvc2l0aW9uID0gYExpbmUgJHtwb3NpdGlvbi5yb3d9LCBDb2x1bW4gJHtwb3NpdGlvbi5jb2x1bW59YDtcclxuXHJcbiAgICAgICAgdGhpcy5vdXRwdXQuaW5uZXJIVE1MID0gZm9ybWF0dGVkUG9zaXRpb247XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgQ2FyZXRQb3NpdGlvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSByb3c6bnVtYmVyLCBwdWJsaWMgcmVhZG9ubHkgY29sdW1uOm51bWJlcil7XHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgSVBhbmVBbmFseXplciB9IGZyb20gXCIuL0lQYW5lQW5hbHl6ZXJcIjtcclxuaW1wb3J0IHsgQ2FyZXRQb3NpdGlvbiB9IGZyb20gXCIuLi9DYXJldFBvc2l0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29kZVBhbmVBbmFseXplciBpbXBsZW1lbnRzIElQYW5lQW5hbHl6ZXJ7XHJcbiAgICBwcml2YXRlIGNhcmV0Um93Om51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGNhcmV0Q29sdW1uOm51bWJlciA9IDA7XHJcblxyXG4gICAgZ2V0IGN1cnJlbnRDYXJldFBvc2l0aW9uKCk6IENhcmV0UG9zaXRpb257XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDYXJldFBvc2l0aW9uKHRoaXMuY2FyZXRSb3csIHRoaXMuY2FyZXRDb2x1bW4pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJyZW50UGFuZSgpOkhUTUxEaXZFbGVtZW50e1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhbmU7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwYW5lOkhUTUxEaXZFbGVtZW50KXtcclxuICAgICAgICBwYW5lLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBlID0+IHRoaXMudXBkYXRlQ3VycmVudENhcmV0UG9zaXRpb24oKSk7XHJcbiAgICAgICAgcGFuZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB0aGlzLnVwZGF0ZUN1cnJlbnRDYXJldFBvc2l0aW9uKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlQ3VycmVudENhcmV0UG9zaXRpb24oKXtcclxuICAgICAgICB2YXIgc2VsID0gZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKCkgYXMgYW55OyAvLyBVc2luZyAnYW55JyBiZWNhdXNlICdtb2RpZnknIGlzbid0IG9mZmljaWFsbHkgc3VwcG9ydGVkLlxyXG5cclxuICAgICAgICBpZiAoc2VsLnRvU3RyaW5nKCkubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbC5tb2RpZnkoXCJleHRlbmRcIiwgXCJiYWNrd2FyZFwiLCBcImxpbmVib3VuZGFyeVwiKTtcclxuICAgICAgICB2YXIgcG9zaXRpb24gPSBzZWwudG9TdHJpbmcoKS5sZW5ndGggYXMgbnVtYmVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHNlbC5hbmNob3JOb2RlICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzZWwuY29sbGFwc2VUb0VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNhcmV0Q29sdW1uID0gcG9zaXRpb247XHJcblxyXG4gICAgICAgIHNlbCA9IGRvY3VtZW50LmdldFNlbGVjdGlvbigpIGFzIGFueTtcclxuICAgICAgICBzZWwubW9kaWZ5KFwiZXh0ZW5kXCIsIFwiYmFja3dhcmRcIiwgXCJkb2N1bWVudGJvdW5kYXJ5XCIpO1xyXG5cclxuICAgICAgICB0aGlzLmNhcmV0Um93ID0gKChzZWwudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwpKS5zcGxpdChcIlxcblwiKSkubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZihzZWwuYW5jaG9yTm9kZSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc2VsLmNvbGxhcHNlVG9FbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBJUGFuZUZvcm1hdHRlciB9IGZyb20gXCIuL0lQYW5lRm9ybWF0dGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29kZVBhbmVTdHlsZUZvcm1hdHRlciBpbXBsZW1lbnRzIElQYW5lRm9ybWF0dGVye1xyXG4gICAgZ2V0IGN1cnJlbnRQYW5lKCk6IEhUTUxEaXZFbGVtZW50e1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhbmU7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwYW5lOkhUTUxEaXZFbGVtZW50KXtcclxuICAgICAgICB0aGlzLnBhbmUuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09IFwiVGFiXCIpe1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucGFuZS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGUgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09IFwiVGFiXCIpe1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKSE7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24uY29sbGFwc2VUb1N0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmFuZ2UgPSBzZWxlY3Rpb24uZ2V0UmFuZ2VBdCgwKTtcclxuICAgICAgICAgICAgICAgIHJhbmdlLmluc2VydE5vZGUoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCIgICAgXCIpKTtcclxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5jb2xsYXBzZVRvRW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4dGVybkNhbGwgfSBmcm9tIFwiLi9FeHRlcm5DYWxsXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQW55eyAgICAgICAgXHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHN0YXRpYyB0eXBlTmFtZTpzdHJpbmcgPSBcIn5hbnlcIjsgIFxyXG4gICAgXHJcbiAgICBzdGF0aWMgbWFpbiA9IFwifm1haW5cIjtcclxuICAgIHN0YXRpYyBleHRlcm5Ub1N0cmluZyA9IEV4dGVybkNhbGwub2YoXCJ+dG9TdHJpbmdcIik7XHJcbn1cclxuIiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQm9vbGVhblR5cGV7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn5ib29sZWFuXCI7XHJcbn0iLCJpbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi9jb21waWxlci9sZXhpbmcvS2V5d29yZHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb252ZXJ0e1xyXG4gICAgc3RhdGljIHN0cmluZ1RvTnVtYmVyKHZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcih2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN0cmluZ1RvQm9vbGVhbih2YWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiB2YWx1ZS50b0xvd2VyQ2FzZSgpID09IEtleXdvcmRzLnRydWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuL1dvcmxkT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRGVjb3JhdGlvbntcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+ZGVjb3JhdGlvblwiO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRGVsZWdhdGV7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn5kZWxlZ2F0ZVwiO1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG59IiwiZXhwb3J0IGNsYXNzIEVudHJ5UG9pbnRBdHRyaWJ1dGV7XHJcbiAgICBuYW1lOnN0cmluZyA9IFwifmVudHJ5UG9pbnRcIjtcclxufSIsImV4cG9ydCBjbGFzcyBFeHRlcm5DYWxse1xyXG4gICAgc3RhdGljIG9mKG5hbWU6c3RyaW5nLCAuLi5hcmdzOnN0cmluZ1tdKXtcclxuICAgICAgICByZXR1cm4gbmV3IEV4dGVybkNhbGwobmFtZSwgLi4uYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgYXJnczpzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6c3RyaW5nLCAuLi5hcmdzOnN0cmluZ1tdKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuL1dvcmxkT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbXtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifml0ZW1cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlzdHtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifmxpc3RcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY291bnQgPSBcIn5jb3VudFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGFkZCA9IFwifmFkZFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG1hcCA9IFwifm1hcFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNvbnRhaW5zID0gXCJ+Y29udGFpbnNcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBqb2luID0gXCJ+am9pblwiO1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSBzZXBhcmF0b3JQYXJhbWV0ZXIgPSBcIn5zZXBhcmF0b3JcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpbnN0YW5jZVBhcmFtZXRlciA9IFwifmluc3RhbmNlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGVsZWdhdGVQYXJhbWV0ZXIgPSBcIn5kZWxlZ2F0ZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lUGFyYW1ldGVyID0gXCJ+dHlwZU5hbWVcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBjb3VudFBhcmFtZXRlciA9IFwifmNvdW50XCI7XHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOdW1iZXJUeXBle1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lID0gXCJ+bnVtYmVyXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbn0iLCJpbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuL1dvcmxkT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxhY2Uge1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn5wbGFjZVwiO1xyXG5cclxuICAgIHN0YXRpYyBpc1BsYXllclN0YXJ0ID0gXCJ+aXNQbGF5ZXJTdGFydFwiO1xyXG59IiwiaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi9Xb3JsZE9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllcntcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwifnBsYXllclwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBhcmVudFR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7ICAgIFxyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2F5e1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lID0gXCJ+c2F5XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdHJpbmdUeXBle1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+c3RyaW5nXCI7XHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmRlcnN0YW5kaW5ne1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCJ+dW5kZXJzdGFuZGluZ1wiO1xyXG5cclxuICAgIHN0YXRpYyBkZXNjcmliaW5nID0gXCJ+ZGVzY3JpYmluZ1wiOyAgXHJcbiAgICBzdGF0aWMgbW92aW5nID0gXCJ+bW92aW5nXCI7XHJcbiAgICBzdGF0aWMgZGlyZWN0aW9uID0gXCJ+ZGlyZWN0aW9uXCI7XHJcbiAgICBzdGF0aWMgdGFraW5nID0gXCJ+dGFraW5nXCI7XHJcbiAgICBzdGF0aWMgaW52ZW50b3J5ID0gXCJ+aW52ZW50b3J5XCI7XHJcbiAgICBzdGF0aWMgZHJvcHBpbmcgPSBcIn5kcm9wcGluZ1wiO1xyXG5cclxuICAgIHN0YXRpYyBhY3Rpb24gPSBcIn5hY3Rpb25cIjtcclxuICAgIHN0YXRpYyBtZWFuaW5nID0gXCJ+bWVhbmluZ1wiOyAgXHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZE9iamVjdCB7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIn53b3JsZE9iamVjdFwiO1xyXG5cclxuICAgIHN0YXRpYyBkZXNjcmlwdGlvbiA9IFwifmRlc2NyaXB0aW9uXCI7XHJcbiAgICBzdGF0aWMgY29udGVudHMgPSBcIn5jb250ZW50c1wiOyAgICBcclxuICAgIHN0YXRpYyBvYnNlcnZhdGlvbiA9IFwifm9ic2VydmF0aW9uXCI7XHJcblxyXG4gICAgc3RhdGljIGRlc2NyaWJlID0gXCJ+ZGVzY3JpYmVcIjtcclxuICAgIHN0YXRpYyBvYnNlcnZlID0gXCJ+b2JzZXJ2ZVwiO1xyXG4gICAgXHJcbiAgICBzdGF0aWMgdmlzaWJsZSA9IFwifnZpc2libGVcIjtcclxufSIsImltcG9ydCB7IFRhbG9uSWRlIH0gZnJvbSBcIi4vVGFsb25JZGVcIjtcclxuXHJcblxyXG52YXIgaWRlID0gbmV3IFRhbG9uSWRlKCk7IiwiZXhwb3J0IGVudW0gRXZhbHVhdGlvblJlc3VsdHtcclxuICAgIENvbnRpbnVlLFxyXG4gICAgU3VzcGVuZEZvcklucHV0XHJcbn0iLCJpbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuL2xpYnJhcnkvVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgU3RhY2tGcmFtZSB9IGZyb20gXCIuL1N0YWNrRnJhbWVcIjtcclxuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tIFwiLi4vY29tbW9uL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1ldGhvZEFjdGl2YXRpb257XHJcbiAgICBtZXRob2Q/Ok1ldGhvZDtcclxuICAgIHN0YWNrRnJhbWU6U3RhY2tGcmFtZTtcclxuICAgIHN0YWNrOlJ1bnRpbWVBbnlbXSA9IFtdO1xyXG5cclxuICAgIHN0YWNrU2l6ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YWNrLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBwZWVrKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBTdGFjayBJbWJhbGFuY2UhIEF0dGVtcHRlZCB0byBwZWVrIGFuIGVtcHR5IHN0YWNrLmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2tbdGhpcy5zdGFjay5sZW5ndGggLSAxXTtcclxuICAgIH1cclxuXHJcbiAgICBwb3AoKXtcclxuICAgICAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFN0YWNrIEltYmFsYW5jZSEgQXR0ZW1wdGVkIHRvIHBvcCBhbiBlbXB0eSBzdGFjay5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YWNrLnBvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1c2gocnVudGltZUFueTpSdW50aW1lQW55KXtcclxuICAgICAgICB0aGlzLnN0YWNrLnB1c2gocnVudGltZUFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IobWV0aG9kOk1ldGhvZCl7XHJcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XHJcbiAgICAgICAgdGhpcy5zdGFja0ZyYW1lID0gbmV3IFN0YWNrRnJhbWUobWV0aG9kKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vY29tbW9uL09wQ29kZVwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBcclxuICAgIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBjb2RlOk9wQ29kZTtcclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIGxvZ0ludGVyYWN0aW9uKHRocmVhZDpUaHJlYWQsIC4uLnBhcmFtZXRlcnM6YW55W10pe1xyXG4gICAgICAgIGxldCBmb3JtYXR0ZWRMaW5lID0gdGhpcy5jb2RlLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgIGlmIChwYXJhbWV0ZXJzICYmIHBhcmFtZXRlcnMubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIGZvcm1hdHRlZExpbmUgKz0gJyAnICsgcGFyYW1ldGVycy5qb2luKCcgJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGZvcm1hdHRlZExpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXsgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuQ29udGludWU7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBSdW50aW1lU3RhdGV7XHJcbiAgICBTdG9wcGVkLFxyXG4gICAgTG9hZGVkLFxyXG4gICAgU3RhcnRlZFxyXG59IiwiaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vTWV0aG9kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhY2tGcmFtZXtcclxuICAgIGxvY2FsczpWYXJpYWJsZVtdID0gW107XHJcbiAgICBjdXJyZW50SW5zdHJ1Y3Rpb246bnVtYmVyID0gLTE7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWV0aG9kOk1ldGhvZCl7XHJcbiAgICAgICAgZm9yKHZhciBwYXJhbWV0ZXIgb2YgbWV0aG9kLnBhcmFtZXRlcnMpe1xyXG4gICAgICAgICAgICBjb25zdCB2YXJpYWJsZSA9IG5ldyBWYXJpYWJsZShwYXJhbWV0ZXIubmFtZSwgcGFyYW1ldGVyLnR5cGUhKTtcclxuICAgICAgICAgICAgdGhpcy5sb2NhbHMucHVzaCh2YXJpYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgRW50cnlQb2ludEF0dHJpYnV0ZSB9IGZyb20gXCIuLi9saWJyYXJ5L0VudHJ5UG9pbnRBdHRyaWJ1dGVcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi9NZXRob2RBY3RpdmF0aW9uXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFByaW50SGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1ByaW50SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4vSU91dHB1dFwiO1xyXG5pbXBvcnQgeyBOb09wSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL05vT3BIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRTdHJpbmdIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZFN0cmluZ0hhbmRsZXJcIjtcclxuaW1wb3J0IHsgTmV3SW5zdGFuY2VIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTmV3SW5zdGFuY2VIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVDb21tYW5kIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lQ29tbWFuZFwiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IFJlYWRJbnB1dEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9SZWFkSW5wdXRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29tbWFuZEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9QYXJzZUNvbW1hbmRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEdvVG9IYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvR29Ub0hhbmRsZXJcIjtcclxuaW1wb3J0IHsgSGFuZGxlQ29tbWFuZEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9IYW5kbGVDb21tYW5kSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGFjZSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZVBsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVCb29sZWFuIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lQm9vbGVhblwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgU2F5IH0gZnJvbSBcIi4uL2xpYnJhcnkvU2F5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFbXB0eSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZUVtcHR5XCI7XHJcbmltcG9ydCB7IFJldHVybkhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9SZXR1cm5IYW5kbGVyXCI7XHJcbmltcG9ydCB7IFN0YXRpY0NhbGxIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvU3RhdGljQ2FsbEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxheWVyIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lUGxheWVyXCI7XHJcbmltcG9ydCB7IExvYWRJbnN0YW5jZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkSW5zdGFuY2VIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWROdW1iZXJIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZE51bWJlckhhbmRsZXJcIjtcclxuaW1wb3J0IHsgSW5zdGFuY2VDYWxsSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0luc3RhbmNlQ2FsbEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZFByb3BlcnR5SGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRQcm9wZXJ0eUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZEZpZWxkSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRGaWVsZEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgRXh0ZXJuYWxDYWxsSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0V4dGVybmFsQ2FsbEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZExvY2FsSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRMb2NhbEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgSUxvZ091dHB1dCB9IGZyb20gXCIuL0lMb2dPdXRwdXRcIjtcclxuaW1wb3J0IHsgTG9hZFRoaXNIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZFRoaXNIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEJyYW5jaFJlbGF0aXZlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0JyYW5jaFJlbGF0aXZlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBCcmFuY2hSZWxhdGl2ZUlmRmFsc2VIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBDb25jYXRlbmF0ZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Db25jYXRlbmF0ZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgQXNzaWduVmFyaWFibGVIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvQXNzaWduVmFyaWFibGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFR5cGVPZkhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9UeXBlT2ZIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEludm9rZURlbGVnYXRlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0ludm9rZURlbGVnYXRlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBDb21wYXJpc29uSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0NvbXBhcmlzb25IYW5kbGVyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdGF0ZSB9IGZyb20gXCIuL1J1bnRpbWVTdGF0ZVwiO1xyXG5pbXBvcnQgeyBTdGF0ZU1hY2hpbmUgfSBmcm9tIFwiLi9jb21tb24vU3RhdGVNYWNoaW5lXCI7XHJcbmltcG9ydCB7IFN0YXRlIH0gZnJvbSBcIi4vY29tbW9uL1N0YXRlXCI7XHJcbmltcG9ydCB7IExvYWRCb29sZWFuSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRCb29sZWFuSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBDcmVhdGVEZWxlZ2F0ZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9DcmVhdGVEZWxlZ2F0ZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgQ29tcGFyZUxlc3NUaGFuSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0NvbXBhcmVMZXNzVGhhbkhhbmRsZXJcIjtcclxuaW1wb3J0IHsgQWRkSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0FkZEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZEVsZW1lbnRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZEVsZW1lbnRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFNldExvY2FsSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1NldExvY2FsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkRW1wdHlIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZEVtcHR5SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJbnZva2VEZWxlZ2F0ZU9uSW5zdGFuY2VIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvSW52b2tlRGVsZWdhdGVPbkluc3RhbmNlSGFuZGxlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uUnVudGltZXtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRlOlN0YXRlTWFjaGluZTxSdW50aW1lU3RhdGU+O1xyXG4gICAgcHJpdmF0ZSB0aHJlYWQ/OlRocmVhZDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgaGFuZGxlcnM6TWFwPE9wQ29kZSwgT3BDb2RlSGFuZGxlcj47XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB1c2VyT3V0cHV0OklPdXRwdXQsIHByaXZhdGUgcmVhZG9ubHkgbG9nT3V0cHV0PzpJTG9nT3V0cHV0KXtcclxuICAgICAgICB0aGlzLnVzZXJPdXRwdXQgPSB1c2VyT3V0cHV0O1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVySW5zdGFuY2VzOk9wQ29kZUhhbmRsZXJbXSA9IFtcclxuICAgICAgICAgICAgbmV3IE5vT3BIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBMb2FkU3RyaW5nSGFuZGxlcigpLFxyXG4gICAgICAgICAgICBuZXcgUHJpbnRIYW5kbGVyKHRoaXMudXNlck91dHB1dCksXHJcbiAgICAgICAgICAgIG5ldyBOZXdJbnN0YW5jZUhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IFJlYWRJbnB1dEhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IFBhcnNlQ29tbWFuZEhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IEhhbmRsZUNvbW1hbmRIYW5kbGVyKHRoaXMudXNlck91dHB1dCksXHJcbiAgICAgICAgICAgIG5ldyBHb1RvSGFuZGxlcigpLFxyXG4gICAgICAgICAgICBuZXcgUmV0dXJuSGFuZGxlcigpLFxyXG4gICAgICAgICAgICBuZXcgU3RhdGljQ2FsbEhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IExvYWRJbnN0YW5jZUhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IExvYWROdW1iZXJIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBMb2FkQm9vbGVhbkhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IEluc3RhbmNlQ2FsbEhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IExvYWRQcm9wZXJ0eUhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IExvYWRGaWVsZEhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IEV4dGVybmFsQ2FsbEhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IExvYWRMb2NhbEhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IExvYWRUaGlzSGFuZGxlcigpLFxyXG4gICAgICAgICAgICBuZXcgQnJhbmNoUmVsYXRpdmVIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBCcmFuY2hSZWxhdGl2ZUlmRmFsc2VIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBDb25jYXRlbmF0ZUhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IEFzc2lnblZhcmlhYmxlSGFuZGxlcigpLFxyXG4gICAgICAgICAgICBuZXcgVHlwZU9mSGFuZGxlcigpLFxyXG4gICAgICAgICAgICBuZXcgSW52b2tlRGVsZWdhdGVIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBDb21wYXJpc29uSGFuZGxlcigpLFxyXG4gICAgICAgICAgICBuZXcgQ3JlYXRlRGVsZWdhdGVIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBDb21wYXJlTGVzc1RoYW5IYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBBZGRIYW5kbGVyKCksXHJcbiAgICAgICAgICAgIG5ldyBMb2FkRWxlbWVudEhhbmRsZXIoKSxcclxuICAgICAgICAgICAgbmV3IFNldExvY2FsSGFuZGxlcigpLFxyXG4gICAgICAgICAgICBuZXcgTG9hZEVtcHR5SGFuZGxlcigpLFxyXG4gICAgICAgICAgICBuZXcgSW52b2tlRGVsZWdhdGVPbkluc3RhbmNlSGFuZGxlcigpXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IG5ldyBNYXA8T3BDb2RlLCBPcENvZGVIYW5kbGVyPihoYW5kbGVySW5zdGFuY2VzLm1hcCh4ID0+IFt4LmNvZGUsIHhdKSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBuZXcgU3RhdGVNYWNoaW5lPFJ1bnRpbWVTdGF0ZT4oXHJcbiAgICAgICAgICAgIG5ldyBTdGF0ZTxSdW50aW1lU3RhdGU+KFxyXG4gICAgICAgICAgICAgICAgUnVudGltZVN0YXRlLlN0b3BwZWQsXHJcbiAgICAgICAgICAgICAgICAoY3VycmVudDpTdGF0ZTxSdW50aW1lU3RhdGU+KSA9PiBjdXJyZW50LnN0YXRlICE9PSBSdW50aW1lU3RhdGUuU3RvcHBlZFxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBuZXcgU3RhdGU8UnVudGltZVN0YXRlPihcclxuICAgICAgICAgICAgICAgIFJ1bnRpbWVTdGF0ZS5Mb2FkZWQsXHJcbiAgICAgICAgICAgICAgICAoY3VycmVudDpTdGF0ZTxSdW50aW1lU3RhdGU+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQuc3RhdGUgPT09IFJ1bnRpbWVTdGF0ZS5TdGFydGVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dPdXRwdXQ/LmRlYnVnKFwiVGhlIHJ1bnRpbWUgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkIGFuZCBjYW4ndCBsb2FkIG1vcmUgdHlwZXMuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIG5ldyBTdGF0ZTxSdW50aW1lU3RhdGU+KFxyXG4gICAgICAgICAgICAgICAgUnVudGltZVN0YXRlLlN0YXJ0ZWQsXHJcbiAgICAgICAgICAgICAgICAoY3VycmVudDpTdGF0ZTxSdW50aW1lU3RhdGU+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQuc3RhdGUgPT09IFJ1bnRpbWVTdGF0ZS5TdGFydGVkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dPdXRwdXQ/LmRlYnVnKFwiVGhlIHJ1bnRpbWUgaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudC5zdGF0ZSA9PT0gUnVudGltZVN0YXRlLlN0b3BwZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ091dHB1dD8uZGVidWcoXCJUaGUgcnVudGltZSBtdXN0IGJlIGxvYWRlZCB3aXRoIHR5cGVzIHByaW9yIHRvIGJlaW5nIHN0YXJ0ZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCl7ICAgICAgICBcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUudHJ5TW92ZVRvKFJ1bnRpbWVTdGF0ZS5TdGFydGVkKSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBsYWNlcyA9IHRoaXMudGhyZWFkPy5hbGxUeXBlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHggPT4geC5iYXNlVHlwZU5hbWUgPT0gUGxhY2UudHlwZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoeCA9PiA8UnVudGltZVBsYWNlPk1lbW9yeS5hbGxvY2F0ZSh4KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGdldFBsYXllclN0YXJ0ID0gKHBsYWNlOlJ1bnRpbWVQbGFjZSkgPT4gPFJ1bnRpbWVCb29sZWFuPihwbGFjZS5maWVsZHMuZ2V0KFBsYWNlLmlzUGxheWVyU3RhcnQpPy52YWx1ZSk7XHJcbiAgICAgICAgY29uc3QgaXNQbGF5ZXJTdGFydCA9IChwbGFjZTpSdW50aW1lUGxhY2UpID0+IGdldFBsYXllclN0YXJ0KHBsYWNlKT8udmFsdWUgPT09IHRydWU7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRQbGFjZSA9IHBsYWNlcz8uZmluZChpc1BsYXllclN0YXJ0KTtcclxuXHJcbiAgICAgICAgdGhpcy50aHJlYWQhLmN1cnJlbnRQbGFjZSA9IGN1cnJlbnRQbGFjZTtcclxuXHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy50aHJlYWQ/Lmtub3duVHlwZXMuZ2V0KFBsYXllci50eXBlTmFtZSkhO1xyXG5cclxuICAgICAgICB0aGlzLnRocmVhZCEuY3VycmVudFBsYXllciA9IDxSdW50aW1lUGxheWVyPk1lbW9yeS5hbGxvY2F0ZShwbGF5ZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnJ1bldpdGgoXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcCgpe1xyXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS50cnlNb3ZlVG8oUnVudGltZVN0YXRlLlN0b3BwZWQpKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgTWVtb3J5LmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy50aHJlYWQgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZEZyb20odHlwZXM6VHlwZVtdKTpib29sZWFue1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKHR5cGVzLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgdGhpcy5sb2dPdXRwdXQ/LmRlYnVnKFwiTm8gdHlwZXMgd2VyZSBwcm92aWRlZCwgdW5hYmxlIHRvIGxvYWQgcnVudGltZS5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS50cnlNb3ZlVG8oUnVudGltZVN0YXRlLkxvYWRlZCkpe1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBNZW1vcnkuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgbG9hZGVkVHlwZXMgPSBNZW1vcnkubG9hZFR5cGVzKHR5cGVzKTtcclxuXHJcbiAgICAgICAgY29uc3QgZW50cnlQb2ludCA9IGxvYWRlZFR5cGVzLmZpbmQoeCA9PiB4LmF0dHJpYnV0ZXMuZmluZEluZGV4KGF0dHJpYnV0ZSA9PiBhdHRyaWJ1dGUgaW5zdGFuY2VvZiBFbnRyeVBvaW50QXR0cmlidXRlKSA+IC0xKTtcclxuICAgICAgICBjb25zdCBtYWluTWV0aG9kID0gZW50cnlQb2ludD8ubWV0aG9kcy5maW5kKHggPT4geC5uYW1lID09IEFueS5tYWluKTsgICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRpb24gPSBuZXcgTWV0aG9kQWN0aXZhdGlvbihtYWluTWV0aG9kISk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50aHJlYWQgPSBuZXcgVGhyZWFkKGxvYWRlZFR5cGVzLCBhY3RpdmF0aW9uKTsgIFxyXG4gICAgICAgIHRoaXMudGhyZWFkLmxvZyA9IHRoaXMubG9nT3V0cHV0OyAgIFxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZW5kQ29tbWFuZChpbnB1dDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMucnVuV2l0aChpbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBydW5XaXRoKGNvbW1hbmQ6c3RyaW5nKXtcclxuICAgICAgICBcclxuICAgICAgICAvLyBXZSdyZSBnb2luZyB0byBrZWVwIHRoZWlyIGNvbW1hbmQgaW4gdGhlIHZpc3VhbCBoaXN0b3J5IHRvIG1ha2UgdGhpbmdzIGVhc2llciB0byB1bmRlcnN0YW5kLlxyXG5cclxuICAgICAgICB0aGlzLnVzZXJPdXRwdXQud3JpdGUoY29tbWFuZCk7XHJcblxyXG4gICAgICAgIC8vIE5vdyB3ZSBjYW4gZ28gYWhlYWQgYW5kIHByb2Nlc3MgdGhlaXIgY29tbWFuZC5cclxuXHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSB0aGlzLnRocmVhZCEuY3VycmVudEluc3RydWN0aW9uO1xyXG5cclxuICAgICAgICBpZiAoaW5zdHJ1Y3Rpb24/Lm9wQ29kZSA9PSBPcENvZGUuUmVhZElucHV0KXtcclxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhjb21tYW5kKTtcclxuICAgICAgICAgICAgdGhpcy50aHJlYWQ/LmN1cnJlbnRNZXRob2QucHVzaCh0ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGhyZWFkPy5tb3ZlTmV4dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMudGhyZWFkPy5jdXJyZW50SW5zdHJ1Y3Rpb24gPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhpcy50aHJlYWQ/Lm1vdmVOZXh0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50aHJlYWQ/LmN1cnJlbnRJbnN0cnVjdGlvbiA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGV4ZWN1dGUgY29tbWFuZCwgbm8gaW5zdHJ1Y3Rpb24gZm91bmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaW5zdHJ1Y3Rpb24gPSB0aGlzLmV2YWx1YXRlQ3VycmVudEluc3RydWN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbiA9PSBFdmFsdWF0aW9uUmVzdWx0LkNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24gPSB0aGlzLmV2YWx1YXRlQ3VycmVudEluc3RydWN0aW9uKCkpe1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudGhyZWFkPy5tb3ZlTmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaChleCl7XHJcbiAgICAgICAgICAgIGlmIChleCBpbnN0YW5jZW9mIFJ1bnRpbWVFcnJvcil7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ091dHB1dD8uZGVidWcoYFJ1bnRpbWUgRXJyb3I6ICR7ZXgubWVzc2FnZX1gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9nT3V0cHV0Py5kZWJ1ZyhgU3RhY2sgVHJhY2U6ICR7ZXguc3RhY2t9YCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ091dHB1dD8uZGVidWcoYEVuY291bnRlcmVkIHVuaGFuZGxlZCBlcnJvcjogJHtleH1gKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBldmFsdWF0ZUN1cnJlbnRJbnN0cnVjdGlvbigpe1xyXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uID0gdGhpcy50aHJlYWQ/LmN1cnJlbnRJbnN0cnVjdGlvbjtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHRoaXMuaGFuZGxlcnMuZ2V0KGluc3RydWN0aW9uPy5vcENvZGUhKTtcclxuXHJcbiAgICAgICAgaWYgKGhhbmRsZXIgPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgRW5jb3VudGVyZWQgdW5zdXBwb3J0ZWQgT3BDb2RlICcke2luc3RydWN0aW9uPy5vcENvZGV9J2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gaGFuZGxlcj8uaGFuZGxlKHRoaXMudGhyZWFkISk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9VbmRlcnN0YW5kaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGFjZSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZVBsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGF5ZXIgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZUVtcHR5IH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lRW1wdHlcIjtcclxuaW1wb3J0IHsgSUxvZ091dHB1dCB9IGZyb20gXCIuL0lMb2dPdXRwdXRcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9NZXRob2RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUaHJlYWR7XHJcbiAgICBhbGxUeXBlczpUeXBlW10gPSBbXTtcclxuICAgIGtub3duVHlwZXM6TWFwPHN0cmluZywgVHlwZT4gPSBuZXcgTWFwPHN0cmluZywgVHlwZT4oKTtcclxuICAgIGtub3duVW5kZXJzdGFuZGluZ3M6VHlwZVtdID0gW107XHJcbiAgICBrbm93blBsYWNlczpSdW50aW1lUGxhY2VbXSA9IFtdO1xyXG4gICAgbWV0aG9kczpNZXRob2RBY3RpdmF0aW9uW10gPSBbXTtcclxuICAgIGN1cnJlbnRQbGFjZT86UnVudGltZVBsYWNlO1xyXG4gICAgY3VycmVudFBsYXllcj86UnVudGltZVBsYXllcjtcclxuICAgIGxvZz86SUxvZ091dHB1dDtcclxuICAgIFxyXG4gICAgZ2V0IGN1cnJlbnRNZXRob2QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWV0aG9kc1t0aGlzLm1ldGhvZHMubGVuZ3RoIC0gMV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnJlbnRJbnN0cnVjdGlvbigpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gdGhpcy5jdXJyZW50TWV0aG9kO1xyXG4gICAgICAgIHJldHVybiBhY3RpdmF0aW9uLm1ldGhvZD8uYm9keVthY3RpdmF0aW9uLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uXTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlczpUeXBlW10sIG1ldGhvZDpNZXRob2RBY3RpdmF0aW9uKXtcclxuICAgICAgICB0aGlzLmFsbFR5cGVzID0gdHlwZXM7XHJcbiAgICAgICAgdGhpcy5rbm93blR5cGVzID0gbmV3IE1hcDxzdHJpbmcsIFR5cGU+KHR5cGVzLm1hcCh0eXBlID0+IFt0eXBlLm5hbWUsIHR5cGVdKSk7XHJcbiAgICAgICAgdGhpcy5rbm93blVuZGVyc3RhbmRpbmdzID0gdHlwZXMuZmlsdGVyKHggPT4geC5iYXNlVHlwZU5hbWUgPT09IFVuZGVyc3RhbmRpbmcudHlwZU5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5wdXNoKG1ldGhvZCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3VycmVudEluc3RydWN0aW9uVmFsdWVBczxUPigpe1xyXG4gICAgICAgIHJldHVybiA8VD50aGlzLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGl2YXRlTWV0aG9kKG1ldGhvZDpNZXRob2Qpe1xyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRpb24gPSBuZXcgTWV0aG9kQWN0aXZhdGlvbihtZXRob2QpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmN1cnJlbnRNZXRob2Q7XHJcblxyXG4gICAgICAgIHRoaXMubG9nPy5kZWJ1ZyhgJHtjdXJyZW50Lm1ldGhvZD8ubmFtZX0gPT4gJHttZXRob2QubmFtZX1gKTtcclxuXHJcbiAgICAgICAgdGhpcy5tZXRob2RzLnB1c2goYWN0aXZhdGlvbik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdmVOZXh0KCl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uKys7XHJcbiAgICB9XHJcblxyXG4gICAganVtcFRvTGluZShsaW5lTnVtYmVyOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uID0gbGluZU51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm5Gcm9tQ3VycmVudE1ldGhvZCgpe1xyXG4gICAgICAgIGNvbnN0IGV4cGVjdFJldHVyblR5cGUgPSB0aGlzLmN1cnJlbnRNZXRob2QubWV0aG9kIS5yZXR1cm5UeXBlICE9IFwiXCI7XHJcbiAgICAgICAgY29uc3QgcmV0dXJuZWRNZXRob2QgPSB0aGlzLm1ldGhvZHMucG9wKCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9nPy5kZWJ1ZyhgJHt0aGlzLmN1cnJlbnRNZXRob2QubWV0aG9kPy5uYW1lfSA8PSAke3JldHVybmVkTWV0aG9kPy5tZXRob2Q/Lm5hbWV9YCk7XHJcblxyXG4gICAgICAgIGlmICghZXhwZWN0UmV0dXJuVHlwZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUnVudGltZUVtcHR5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXR1cm5WYWx1ZSA9IHJldHVybmVkTWV0aG9kPy5zdGFjay5wb3AoKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWUhO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGFjZSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVQbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRW1wdHkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lRW1wdHlcIjtcclxuaW1wb3J0IHsgUnVudGltZUNvbW1hbmQgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQ29tbWFuZFwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVCb29sZWFuIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUJvb2xlYW5cIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgUnVudGltZUxpc3QgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lTGlzdFwiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvSXRlbVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lSXRlbSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJdGVtXCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYXllclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxheWVyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVBsYXllclwiO1xyXG5pbXBvcnQgeyBTYXkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9TYXlcIjtcclxuaW1wb3J0IHsgUnVudGltZVNheSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTYXlcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9NZXRob2RcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBOdW1iZXJUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTnVtYmVyVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRGVjb3JhdGlvbiB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVEZWNvcmF0aW9uXCI7XHJcbmltcG9ydCB7IERlY29yYXRpb24gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9EZWNvcmF0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWVtb3J5e1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdHlwZXNCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgVHlwZT4oKTtcclxuICAgIHByaXZhdGUgc3RhdGljIGhlYXAgPSBuZXcgTWFwPHN0cmluZywgUnVudGltZUFueVtdPigpO1xyXG5cclxuICAgIHN0YXRpYyBjbGVhcigpe1xyXG4gICAgICAgIE1lbW9yeS50eXBlc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlPigpO1xyXG4gICAgICAgIE1lbW9yeS5oZWFwID0gbmV3IE1hcDxzdHJpbmcsIFJ1bnRpbWVBbnlbXT4oKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZmluZFR5cGVCeU5hbWUobmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIGlmICghdGhpcy50eXBlc0J5TmFtZS5oYXMobmFtZSkpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBVbmFibGUgdG8gbG9jYXRlIHR5cGUgJyR7bmFtZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50eXBlc0J5TmFtZS5nZXQobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZpbmRJbnN0YW5jZUJ5TmFtZShuYW1lOnN0cmluZyl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2VzID0gTWVtb3J5LmhlYXAuZ2V0KG5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoIWluc3RhbmNlcyB8fCBpbnN0YW5jZXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiT2JqZWN0IG5vdCBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZXMubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJMb2NhdGVkIG1vcmUgdGhhbiBvbmUgaW5zdGFuY2VcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2VzWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkVHlwZXModHlwZXM6VHlwZVtdKXtcclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgVHlwZT4odHlwZXMubWFwKHggPT4gW3gubmFtZSwgeF0pKTsgICBcclxuICAgICAgICBcclxuICAgICAgICAvLyBPdmVycmlkZSBhbnkgcHJvdmlkZWQgdHlwZSBzdHVicyB3aXRoIHRoZSBhY3R1YWwgcnVudGltZSB0eXBlIGRlZmluaXRpb25zLlxyXG5cclxuICAgICAgICBjb25zdCBwbGFjZSA9IFJ1bnRpbWVQbGFjZS50eXBlO1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBSdW50aW1lSXRlbS50eXBlO1xyXG4gICAgICAgIGNvbnN0IHBsYXllciA9IFJ1bnRpbWVQbGF5ZXIudHlwZTtcclxuICAgICAgICBjb25zdCBkZWNvcmF0aW9uID0gUnVudGltZURlY29yYXRpb24udHlwZTtcclxuXHJcbiAgICAgICAgTWVtb3J5LnR5cGVzQnlOYW1lLnNldChwbGFjZS5uYW1lLCBwbGFjZSk7XHJcbiAgICAgICAgTWVtb3J5LnR5cGVzQnlOYW1lLnNldChpdGVtLm5hbWUsIGl0ZW0pO1xyXG4gICAgICAgIE1lbW9yeS50eXBlc0J5TmFtZS5zZXQocGxheWVyLm5hbWUsIHBsYXllcik7ICBcclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUuc2V0KGRlY29yYXRpb24ubmFtZSwgZGVjb3JhdGlvbik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oTWVtb3J5LnR5cGVzQnlOYW1lLnZhbHVlcygpKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGVDb21tYW5kKCk6UnVudGltZUNvbW1hbmR7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lQ29tbWFuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZUJvb2xlYW4odmFsdWU6Ym9vbGVhbik6UnVudGltZUJvb2xlYW57XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lQm9vbGVhbih2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG9jYXRlTnVtYmVyKHZhbHVlOm51bWJlcik6UnVudGltZUludGVnZXJ7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lSW50ZWdlcih2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG9jYXRlU3RyaW5nKHRleHQ6c3RyaW5nKTpSdW50aW1lU3RyaW5ne1xyXG4gICAgICAgIHJldHVybiBuZXcgUnVudGltZVN0cmluZyh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGUodHlwZTpUeXBlKTpSdW50aW1lQW55e1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gTWVtb3J5LmNvbnN0cnVjdEluc3RhbmNlRnJvbSh0eXBlKTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2VQb29sID0gTWVtb3J5LmhlYXAuZ2V0KHR5cGUubmFtZSkgfHwgW107XHJcblxyXG4gICAgICAgIGluc3RhbmNlUG9vbC5wdXNoKGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgTWVtb3J5LmhlYXAuc2V0KHR5cGUubmFtZSwgaW5zdGFuY2VQb29sKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluaXRpYWxpemVWYXJpYWJsZVdpdGgoZmllbGQ6RmllbGQpe1xyXG5cclxuICAgICAgICBjb25zdCB2YXJpYWJsZSA9IE1lbW9yeS5jb25zdHJ1Y3RWYXJpYWJsZUZyb20oZmllbGQpOyAgICAgICAgXHJcbiAgICAgICAgdmFyaWFibGUudmFsdWUgPSBNZW1vcnkuaW5zdGFudGlhdGVEZWZhdWx0VmFsdWVGb3IodmFyaWFibGUsIGZpZWxkLmRlZmF1bHRWYWx1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2YXJpYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjb25zdHJ1Y3RWYXJpYWJsZUZyb20oZmllbGQ6RmllbGQpe1xyXG4gICAgICAgIGlmIChmaWVsZC50eXBlKXtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZShmaWVsZC5uYW1lLCBmaWVsZC50eXBlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBNZW1vcnkudHlwZXNCeU5hbWUuZ2V0KGZpZWxkLnR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKCF0eXBlKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGNvbnN0cnVjdCB1bmtub3duIHR5cGUgJyR7ZmllbGQudHlwZU5hbWV9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZShmaWVsZC5uYW1lLCB0eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW50aWF0ZURlZmF1bHRWYWx1ZUZvcih2YXJpYWJsZTpWYXJpYWJsZSwgZGVmYXVsdFZhbHVlOk9iamVjdHx1bmRlZmluZWQpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN3aXRjaCh2YXJpYWJsZS50eXBlIS5uYW1lKXtcclxuICAgICAgICAgICAgY2FzZSBTdHJpbmdUeXBlLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVTdHJpbmcoZGVmYXVsdFZhbHVlID8gPHN0cmluZz5kZWZhdWx0VmFsdWUgOiBcIlwiKTtcclxuICAgICAgICAgICAgY2FzZSBCb29sZWFuVHlwZS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lQm9vbGVhbihkZWZhdWx0VmFsdWUgPyA8Ym9vbGVhbj5kZWZhdWx0VmFsdWUgOiBmYWxzZSk7XHJcbiAgICAgICAgICAgIGNhc2UgTnVtYmVyVHlwZS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lSW50ZWdlcihkZWZhdWx0VmFsdWUgPyA8bnVtYmVyPmRlZmF1bHRWYWx1ZSA6IDApO1xyXG4gICAgICAgICAgICBjYXNlIExpc3QudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZUxpc3QoZGVmYXVsdFZhbHVlID8gdGhpcy5pbnN0YW50aWF0ZUxpc3QoPE9iamVjdFtdPmRlZmF1bHRWYWx1ZSkgOiBbXSk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVFbXB0eSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW50aWF0ZUxpc3QoaXRlbXM6T2JqZWN0W10pe1xyXG4gICAgICAgIGNvbnN0IHJ1bnRpbWVJdGVtczpSdW50aW1lQW55W10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGNvbnN0IGl0ZW0gb2YgaXRlbXMpe1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtTGlzdCA9IDxPYmplY3RbXT5pdGVtO1xyXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IDxudW1iZXI+aXRlbUxpc3RbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVOYW1lID0gPHN0cmluZz5pdGVtTGlzdFsxXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBNZW1vcnkudHlwZXNCeU5hbWUuZ2V0KHR5cGVOYW1lKSE7XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IGN1cnJlbnQgPSAwOyBjdXJyZW50IDwgY291bnQ7IGN1cnJlbnQrKyl7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBNZW1vcnkuYWxsb2NhdGUodHlwZSk7XHJcbiAgICAgICAgICAgICAgICBydW50aW1lSXRlbXMucHVzaChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydW50aW1lSXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY29uc3RydWN0SW5zdGFuY2VGcm9tKHR5cGU6VHlwZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNlZW5UeXBlcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xyXG4gICAgICAgIGxldCBpbmhlcml0YW5jZUNoYWluOlR5cGVbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGN1cnJlbnQ6VHlwZXx1bmRlZmluZWQgPSB0eXBlOyBcclxuICAgICAgICAgICAgY3VycmVudDsgXHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBNZW1vcnkudHlwZXNCeU5hbWUuZ2V0KGN1cnJlbnQuYmFzZVR5cGVOYW1lKSl7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChzZWVuVHlwZXMuaGFzKGN1cnJlbnQubmFtZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJZb3UgY2FuJ3QgaGF2ZSBjeWNsZXMgaW4gYSB0eXBlIGhpZXJhcmNoeVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZWVuVHlwZXMuYWRkKGN1cnJlbnQubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpbmhlcml0YW5jZUNoYWluLnB1c2goY3VycmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBmaXJzdFN5c3RlbVR5cGVBbmNlc3RvckluZGV4ID0gaW5oZXJpdGFuY2VDaGFpbi5maW5kSW5kZXgoeCA9PiB4LmlzU3lzdGVtVHlwZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICBpZiAoZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleCA8IDApe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVHlwZSBtdXN0IHVsdGltYXRlbHkgaW5oZXJpdCBmcm9tIGEgc3lzdGVtIHR5cGVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuYWxsb2NhdGVTeXN0ZW1UeXBlQnlOYW1lKGluaGVyaXRhbmNlQ2hhaW5bZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleF0ubmFtZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaW5zdGFuY2UucGFyZW50VHlwZU5hbWUgPSBpbnN0YW5jZS50eXBlTmFtZTtcclxuICAgICAgICBpbnN0YW5jZS50eXBlTmFtZSA9IGluaGVyaXRhbmNlQ2hhaW5bMF0ubmFtZTtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogSW5oZXJpdCBtb3JlIHRoYW4ganVzdCBmaWVsZHMvbWV0aG9kcy5cclxuICAgICAgICAvLyBUT0RPOiBUeXBlIGNoZWNrIGZpZWxkIGluaGVyaXRhbmNlIGZvciBzaGFkb3dpbmcvb3ZlcnJpZGluZy5cclxuXHJcbiAgICAgICAgLy8gSW5oZXJpdCBmaWVsZHMvbWV0aG9kcyBmcm9tIHR5cGVzIGluIHRoZSBoaWVyYXJjaHkgZnJvbSBsZWFzdCB0byBtb3N0IGRlcml2ZWQuXHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpID0gZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleDsgaSA+PSAwOyBpLS0pe1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VHlwZSA9IGluaGVyaXRhbmNlQ2hhaW5baV07XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgZmllbGQgb2YgY3VycmVudFR5cGUuZmllbGRzKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlID0gdGhpcy5pbml0aWFsaXplVmFyaWFibGVXaXRoKGZpZWxkKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmZpZWxkcy5zZXQoZmllbGQubmFtZSwgdmFyaWFibGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgbWV0aG9kIG9mIGN1cnJlbnRUeXBlLm1ldGhvZHMpe1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UubWV0aG9kcy5zZXQobWV0aG9kLm5hbWUsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGFsbG9jYXRlU3lzdGVtVHlwZUJ5TmFtZSh0eXBlTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHN3aXRjaCh0eXBlTmFtZSl7XHJcbiAgICAgICAgICAgIGNhc2UgUGxhY2UudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVBsYWNlKCk7XHJcbiAgICAgICAgICAgIGNhc2UgSXRlbS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lSXRlbSgpO1xyXG4gICAgICAgICAgICBjYXNlIFBsYXllci50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lUGxheWVyKCk7XHJcbiAgICAgICAgICAgIGNhc2UgTGlzdC50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lTGlzdChbXSk7ICAgICBcclxuICAgICAgICAgICAgY2FzZSBTYXkudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVNheSgpOyAgICBcclxuICAgICAgICAgICAgY2FzZSBEZWNvcmF0aW9uLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVEZWNvcmF0aW9uKCk7ICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6e1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGluc3RhbnRpYXRlIHR5cGUgJyR7dHlwZU5hbWV9J2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFN0YXRlPFQ+eyAgIFxyXG4gICAgc3RhdGljIGVtcHR5PFU+KCk6U3RhdGU8VT57XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0ZTxVPigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlYWRvbmx5IHByZWNvbmRpdGlvbnM6KChjdXJyZW50U3RhdGU6U3RhdGU8VD4pPT5ib29sZWFuKVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHN0YXRlPzpULCBcclxuICAgICAgICAgICAgICAgIC4uLnByZWNvbmRpdGlvbnM6KChjdXJyZW50U3RhdGU6U3RhdGU8VD4pPT5ib29sZWFuKVtdKXtcclxuXHJcbiAgICAgICAgaWYgKHByZWNvbmRpdGlvbnMpe1xyXG4gICAgICAgICAgICBwcmVjb25kaXRpb25zLmZvckVhY2goeCA9PiB0aGlzLnByZWNvbmRpdGlvbnMucHVzaCh4KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgU3RhdGUgfSBmcm9tIFwiLi9TdGF0ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0YXRlTWFjaGluZTxUPntcclxuICAgIHByaXZhdGUgY3VycmVudFN0YXRlOlN0YXRlPFQ+O1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBzdGF0ZXNCeUNvbnRlbnQ6TWFwPFR8dW5kZWZpbmVkLCBTdGF0ZTxUPj47XHJcblxyXG4gICAgY29uc3RydWN0b3IoLi4uc3RhdGVzOlN0YXRlPFQ+W10pe1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gU3RhdGUuZW1wdHk8VD4oKTtcclxuICAgICAgICB0aGlzLnN0YXRlc0J5Q29udGVudCA9IG5ldyBNYXA8VHx1bmRlZmluZWQsIFN0YXRlPFQ+PihzdGF0ZXMubWFwKHggPT4gW3guc3RhdGUsIHhdKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRTdGF0ZShzdGF0ZTpUKXtcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5zdGF0ZXNCeUNvbnRlbnQuZ2V0KHN0YXRlKTtcclxuXHJcbiAgICAgICAgaWYgKCFjdXJyZW50KXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGdldCB1bmtub3duIHN0YXRlICcke3N0YXRlfWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdGlhbGl6ZVRvKHN0YXRlOlQpeyAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSB0aGlzLmdldFN0YXRlKHN0YXRlKTtcclxuICAgIH1cclxuXHJcbiAgICB0cnlNb3ZlVG8oc3RhdGU6VCl7XHJcbiAgICAgICAgY29uc3QgYXR0ZW1wdGVkU3RhdGUgPSB0aGlzLmdldFN0YXRlKHN0YXRlKTtcclxuXHJcbiAgICAgICAgaWYgKCFhdHRlbXB0ZWRTdGF0ZS5wcmVjb25kaXRpb25zIS5ldmVyeSh4ID0+IHgodGhpcy5jdXJyZW50U3RhdGUpKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBhdHRlbXB0ZWRTdGF0ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgUnVudGltZUVycm9yIGV4dGVuZHMgRXJyb3J7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFkZEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5BZGQ7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkKTtcclxuXHJcbiAgICAgICAgY29uc3QgZmlyc3QgPSA8UnVudGltZUludGVnZXI+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kID0gPFJ1bnRpbWVJbnRlZ2VyPnRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBjb25zdCBhZGRlZCA9IE1lbW9yeS5hbGxvY2F0ZU51bWJlcihmaXJzdC52YWx1ZSArIHNlY29uZC52YWx1ZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goYWRkZWQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUJvb2xlYW4gfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQm9vbGVhblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFzc2lnblZhcmlhYmxlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLkFzc2lnbjtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGluc3RhbmNlLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJ1bnRpbWVTdHJpbmcpe1xyXG4gICAgICAgICAgICBpbnN0YW5jZS52YWx1ZSA9ICg8UnVudGltZVN0cmluZz52YWx1ZSkudmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJ1bnRpbWVJbnRlZ2VyKXtcclxuICAgICAgICAgICAgaW5zdGFuY2UudmFsdWUgPSAoPFJ1bnRpbWVJbnRlZ2VyPnZhbHVlKS52YWx1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgUnVudGltZUJvb2xlYW4pe1xyXG4gICAgICAgICAgICBpbnN0YW5jZS52YWx1ZSA9ICg8UnVudGltZUJvb2xlYW4+dmFsdWUpLnZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJFbmNvdW50ZXJlZCB1bnN1cHBvcnRlZCB0eXBlIG9uIHRoZSBzdGFja1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5pbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJyYW5jaFJlbGF0aXZlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLkJyYW5jaFJlbGF0aXZlO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCByZWxhdGl2ZUFtb3VudCA9IDxudW1iZXI+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCByZWxhdGl2ZUFtb3VudCk7XHJcblxyXG4gICAgICAgIHRocmVhZC5qdW1wVG9MaW5lKHRocmVhZC5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uICsgcmVsYXRpdmVBbW91bnQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVCb29sZWFuIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUJvb2xlYW5cIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCcmFuY2hSZWxhdGl2ZUlmRmFsc2VIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuQnJhbmNoUmVsYXRpdmVJZkZhbHNlO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCByZWxhdGl2ZUFtb3VudCA9IDxudW1iZXI+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWU7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSA8UnVudGltZUJvb2xlYW4+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCByZWxhdGl2ZUFtb3VudCwgJy8vJywgdmFsdWUpO1xyXG5cclxuICAgICAgICBpZiAoIXZhbHVlLnZhbHVlKXsgICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhyZWFkLmp1bXBUb0xpbmUodGhyZWFkLmN1cnJlbnRNZXRob2Quc3RhY2tGcmFtZS5jdXJyZW50SW5zdHJ1Y3Rpb24gKyByZWxhdGl2ZUFtb3VudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21wYXJlTGVzc1RoYW5IYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyBjb2RlOiBPcENvZGUgPSBPcENvZGUuQ29tcGFyZUxlc3NUaGFuO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGZpcnN0VmFsdWUgPSA8UnVudGltZUludGVnZXI+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kVmFsdWUgPSA8UnVudGltZUludGVnZXI+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGlzTGVzc1RoYW4gPSBNZW1vcnkuYWxsb2NhdGVCb29sZWFuKGZpcnN0VmFsdWUudmFsdWUgPCBzZWNvbmRWYWx1ZS52YWx1ZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goaXNMZXNzVGhhbik7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVCb29sZWFuIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUJvb2xlYW5cIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbXBhcmlzb25IYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuQ29tcGFyZUVxdWFsO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgdmFyIGluc3RhbmNlID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcbiAgICAgICAgdmFyIGNvbXBhcmFuZCA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCwgaW5zdGFuY2UsIGNvbXBhcmFuZCk7XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJ1bnRpbWVTdHJpbmcgJiYgY29tcGFyYW5kIGluc3RhbmNlb2YgUnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IE1lbW9yeS5hbGxvY2F0ZUJvb2xlYW4oaW5zdGFuY2UudmFsdWUgPT0gY29tcGFyYW5kLnZhbHVlKTtcclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpbnN0YW5jZSBpbnN0YW5jZW9mIFJ1bnRpbWVJbnRlZ2VyICYmIGNvbXBhcmFuZCBpbnN0YW5jZW9mIFJ1bnRpbWVJbnRlZ2VyKXtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gTWVtb3J5LmFsbG9jYXRlQm9vbGVhbihpbnN0YW5jZS52YWx1ZSA9PSBjb21wYXJhbmQudmFsdWUpO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgUnVudGltZUJvb2xlYW4gJiYgY29tcGFyYW5kIGluc3RhbmNlb2YgUnVudGltZUJvb2xlYW4peyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBNZW1vcnkuYWxsb2NhdGVCb29sZWFuKGluc3RhbmNlLnZhbHVlID09PSBjb21wYXJhbmQudmFsdWUpO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBFbmNvdW50ZXJlZCB0eXBlIG1pc21hdGNoIG9uIHN0YWNrIGR1cmluZyBjb21wYXJpc29uOiAke2luc3RhbmNlPy50eXBlTmFtZX0gPT0gJHtjb21wYXJhbmQ/LnR5cGVOYW1lfWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb25jYXRlbmF0ZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5Db25jYXRlbmF0ZTtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgbGFzdCA9IDxSdW50aW1lU3RyaW5nPnRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IGZpcnN0ID0gPFJ1bnRpbWVTdHJpbmc+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCBmaXJzdC52YWx1ZSwgbGFzdC52YWx1ZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmNhdGVuYXRlZCA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhmaXJzdC52YWx1ZSArIFwiIFwiICsgbGFzdC52YWx1ZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goY29uY2F0ZW5hdGVkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgUnVudGltZURlbGVnYXRlIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZURlbGVnYXRlXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4uL2xpYnJhcnkvVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDcmVhdGVEZWxlZ2F0ZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5DcmVhdGVEZWxlZ2F0ZTtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IHR5cGVBbmRNZXRob2QgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uVmFsdWVBczxzdHJpbmc+KCk7XHJcbiAgICAgICAgY29uc3QgaW1wbGljaXRUaGlzID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIHR5cGVBbmRNZXRob2QpO1xyXG5cclxuICAgICAgICBjb25zdCBwYXJ0cyA9IHR5cGVBbmRNZXRob2Quc3BsaXQoJzonKTtcclxuICAgICAgICBjb25zdCB0eXBlTmFtZSA9IHBhcnRzWzBdO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSBwYXJ0c1sxXTtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZSA9IE1lbW9yeS5maW5kVHlwZUJ5TmFtZSh0eXBlTmFtZSkhO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHR5cGUubWV0aG9kcy5maW5kKG1ldGhvZCA9PiBtZXRob2QubmFtZSA9PSBtZXRob2ROYW1lKSE7XHJcblxyXG4gICAgICAgIG1ldGhvZC5hY3R1YWxQYXJhbWV0ZXJzLnB1c2goXHJcbiAgICAgICAgICAgIFZhcmlhYmxlLmZvclRoaXModHlwZSwgaW1wbGljaXRUaGlzKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRlbGVnYXRlID0gbmV3IFJ1bnRpbWVEZWxlZ2F0ZShtZXRob2QpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKGRlbGVnYXRlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmludGVyZmFjZSBJSW5kZXhhYmxle1xyXG4gICAgW25hbWU6c3RyaW5nXTooLi4uYXJnczpSdW50aW1lQW55W10pPT5SdW50aW1lQW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRXh0ZXJuYWxDYWxsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLkV4dGVybmFsQ2FsbDtcclxuICAgIFxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBtZXRob2QgPSB0aGlzLmxvY2F0ZUZ1bmN0aW9uKGluc3RhbmNlISwgPHN0cmluZz5tZXRob2ROYW1lKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGAke2luc3RhbmNlPy50eXBlTmFtZX06OiR7bWV0aG9kTmFtZX0oLi4uJHttZXRob2QubGVuZ3RofSlgKTtcclxuXHJcbiAgICAgICAgY29uc3QgYXJnczpSdW50aW1lQW55W10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1ldGhvZC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGFyZ3MucHVzaCh0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKSEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gbWV0aG9kLmNhbGwoaW5zdGFuY2UsIC4uLmFyZ3MpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0KXtcclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9jYXRlRnVuY3Rpb24oaW5zdGFuY2U6T2JqZWN0LCBtZXRob2ROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuICg8SUluZGV4YWJsZT5pbnN0YW5jZSlbbWV0aG9kTmFtZV07XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lSW50ZWdlciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJbnRlZ2VyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR29Ub0hhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5Hb1RvO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25OdW1iZXIgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGluc3RydWN0aW9uTnVtYmVyKTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBpbnN0cnVjdGlvbk51bWJlciA9PT0gXCJudW1iZXJcIil7XHJcbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8ganVtcCBvbmUgcHJldmlvdXMgdG8gdGhlIGRlc2lyZWQgaW5zdHJ1Y3Rpb24gYmVjYXVzZSBhZnRlciBcclxuICAgICAgICAgICAgLy8gZXZhbHVhdGluZyB0aGlzIGdvdG8gd2UnbGwgbW92ZSBmb3J3YXJkICh3aGljaCB3aWxsIG1vdmUgdG8gdGhlIGRlc2lyZWQgb25lKS5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRocmVhZC5qdW1wVG9MaW5lKGluc3RydWN0aW9uTnVtYmVyIC0gMSk7XHJcbiAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGdvdG9cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQ29tbWFuZCB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVDb21tYW5kXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9VbmRlcnN0YW5kaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVVbmRlcnN0YW5kaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVVuZGVyc3RhbmRpbmdcIjtcclxuaW1wb3J0IHsgTWVhbmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L01lYW5pbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVMaXN0IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUxpc3RcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYWNlIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVBsYWNlXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxheWVyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGF5ZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lUGxheWVyXCI7XHJcbmltcG9ydCB7IExvYWRQcm9wZXJ0eUhhbmRsZXIgfSBmcm9tIFwiLi9Mb2FkUHJvcGVydHlIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFByaW50SGFuZGxlciB9IGZyb20gXCIuL1ByaW50SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJbnN0YW5jZUNhbGxIYW5kbGVyIH0gZnJvbSBcIi4vSW5zdGFuY2VDYWxsSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBFdmVudFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL0V2ZW50VHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRGVsZWdhdGUgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lRGVsZWdhdGVcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lSXRlbSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJdGVtXCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9JbnN0cnVjdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhhbmRsZUNvbW1hbmRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuSGFuZGxlQ29tbWFuZDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG91dHB1dDpJT3V0cHV0KXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjb21tYW5kID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGlmICghKGNvbW1hbmQgaW5zdGFuY2VvZiBSdW50aW1lQ29tbWFuZCkpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBVbmFibGUgdG8gaGFuZGxlIGEgbm9uLWNvbW1hbmQsIGZvdW5kICcke2NvbW1hbmR9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhY3Rpb24gPSBjb21tYW5kLmFjdGlvbiEudmFsdWU7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0TmFtZSA9IGNvbW1hbmQudGFyZ2V0TmFtZSEudmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCBgJyR7YWN0aW9ufSAke3RhcmdldE5hbWV9J2ApO1xyXG5cclxuICAgICAgICBjb25zdCB1bmRlcnN0YW5kaW5nc0J5QWN0aW9uID0gbmV3IE1hcDxPYmplY3QsIFR5cGU+KHRocmVhZC5rbm93blVuZGVyc3RhbmRpbmdzLm1hcCh4ID0+IFt4LmZpZWxkcy5maW5kKGZpZWxkID0+IGZpZWxkLm5hbWUgPT0gVW5kZXJzdGFuZGluZy5hY3Rpb24pPy5kZWZhdWx0VmFsdWUhLCB4XSkpO1xyXG5cclxuICAgICAgICBjb25zdCB1bmRlcnN0YW5kaW5nID0gdW5kZXJzdGFuZGluZ3NCeUFjdGlvbi5nZXQoYWN0aW9uKTtcclxuXHJcbiAgICAgICAgaWYgKCF1bmRlcnN0YW5kaW5nKXtcclxuICAgICAgICAgICAgdGhpcy5vdXRwdXQud3JpdGUoXCJJIGRvbid0IGtub3cgaG93IHRvIGRvIHRoYXQuXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtZWFuaW5nRmllbGQgPSB1bmRlcnN0YW5kaW5nLmZpZWxkcy5maW5kKHggPT4geC5uYW1lID09IFVuZGVyc3RhbmRpbmcubWVhbmluZyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1lYW5pbmcgPSB0aGlzLmRldGVybWluZU1lYW5pbmdGb3IoPHN0cmluZz5tZWFuaW5nRmllbGQ/LmRlZmF1bHRWYWx1ZSEpO1xyXG4gICAgICAgIGNvbnN0IGFjdHVhbFRhcmdldCA9IHRoaXMuaW5mZXJUYXJnZXRGcm9tKHRocmVhZCwgdGFyZ2V0TmFtZSwgbWVhbmluZyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCFhY3R1YWxUYXJnZXQpe1xyXG4gICAgICAgICAgICB0aGlzLm91dHB1dC53cml0ZShcIkkgZG9uJ3Qga25vdyB3aGF0IHlvdSdyZSByZWZlcnJpbmcgdG8uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2l0Y2gobWVhbmluZyl7XHJcbiAgICAgICAgICAgIGNhc2UgTWVhbmluZy5EZXNjcmliaW5nOntcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpYmUodGhyZWFkLCBhY3R1YWxUYXJnZXQsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTWVhbmluZy5Nb3Zpbmc6IHsgICAgXHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0UGxhY2UgPSA8UnVudGltZVBsYWNlPmFjdHVhbFRhcmdldDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQbGFjZSA9IHRocmVhZC5jdXJyZW50UGxhY2U7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRQbGFjZSA9IG5leHRQbGFjZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZSh0aHJlYWQsIGFjdHVhbFRhcmdldCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYWlzZUV2ZW50KHRocmVhZCwgbmV4dFBsYWNlLCBFdmVudFR5cGUuUGxheWVyRW50ZXJzUGxhY2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYWlzZUV2ZW50KHRocmVhZCwgY3VycmVudFBsYWNlISwgRXZlbnRUeXBlLlBsYXllckV4aXRzUGxhY2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBNZWFuaW5nLlRha2luZzoge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEoYWN0dWFsVGFyZ2V0IGluc3RhbmNlb2YgUnVudGltZUl0ZW0pKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dC53cml0ZShcIkkgY2FuJ3QgdGFrZSB0aGF0LlwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IHRocmVhZC5jdXJyZW50UGxhY2UhLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgICAgIGxpc3QuaXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGFyZ2V0TmFtZS50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW52ZW50b3J5ID0gdGhyZWFkLmN1cnJlbnRQbGF5ZXIhLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgICAgIGludmVudG9yeS5pdGVtcy5wdXNoKGFjdHVhbFRhcmdldCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZSh0aHJlYWQsIHRocmVhZC5jdXJyZW50UGxhY2UhLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuSW52ZW50b3J5OntcclxuICAgICAgICAgICAgICAgIGNvbnN0IGludmVudG9yeSA9ICg8UnVudGltZVBsYXllcj5hY3R1YWxUYXJnZXQpLmdldENvbnRlbnRzRmllbGQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubmFtZUFuZFRvdGFsQ29udGVudHModGhyZWFkLCBpbnZlbnRvcnkpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1lYW5pbmcuRHJvcHBpbmc6e1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IHRocmVhZC5jdXJyZW50UGxheWVyIS5nZXRDb250ZW50c0ZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICBsaXN0Lml0ZW1zID0gbGlzdC5pdGVtcy5maWx0ZXIoeCA9PiB4LnR5cGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09IHRhcmdldE5hbWUudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRzID0gdGhyZWFkLmN1cnJlbnRQbGFjZSEuZ2V0Q29udGVudHNGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgY29udGVudHMuaXRlbXMucHVzaChhY3R1YWxUYXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpYmUodGhyZWFkLCB0aHJlYWQuY3VycmVudFBsYWNlISwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbnN1cHBvcnRlZCBtZWFuaW5nIGZvdW5kXCIpO1xyXG4gICAgICAgIH0gIFxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByYWlzZUV2ZW50KHRocmVhZDpUaHJlYWQsIGxvY2F0aW9uOlJ1bnRpbWVQbGFjZSwgdHlwZTpFdmVudFR5cGUpe1xyXG4gICAgICAgIGNvbnN0IGV2ZW50cyA9IEFycmF5LmZyb20obG9jYXRpb24ubWV0aG9kcy52YWx1ZXMoKSEpLmZpbHRlcih4ID0+IHguZXZlbnRUeXBlID09IHR5cGUpO1xyXG5cclxuICAgICAgICBmb3IoY29uc3QgZXZlbnQgb2YgZXZlbnRzKXtcclxuICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gbG9jYXRpb24ubWV0aG9kcy5nZXQoZXZlbnQubmFtZSkhO1xyXG4gICAgICAgICAgICBtZXRob2QuYWN0dWFsUGFyYW1ldGVycyA9IFtWYXJpYWJsZS5mb3JUaGlzKG5ldyBUeXBlKGxvY2F0aW9uPy50eXBlTmFtZSEsIGxvY2F0aW9uPy5wYXJlbnRUeXBlTmFtZSEpLCBsb2NhdGlvbildO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGVsZWdhdGUgPSBuZXcgUnVudGltZURlbGVnYXRlKG1ldGhvZCk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKGRlbGVnYXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbmZlclRhcmdldEZyb20odGhyZWFkOlRocmVhZCwgdGFyZ2V0TmFtZTpzdHJpbmcsIG1lYW5pbmc6TWVhbmluZyk6UnVudGltZVdvcmxkT2JqZWN0fHVuZGVmaW5lZHtcclxuICAgICAgICBjb25zdCBsb29rdXBJbnN0YW5jZSA9IChuYW1lOnN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICB0cnl7ICAgICBcclxuICAgICAgICAgICAgICAgIHJldHVybiA8UnVudGltZVdvcmxkT2JqZWN0Pk1lbW9yeS5maW5kSW5zdGFuY2VCeU5hbWUobmFtZSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2goZXgpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLk1vdmluZyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlTmFtZSA9IDxSdW50aW1lU3RyaW5nPnRocmVhZC5jdXJyZW50UGxhY2U/LmZpZWxkcy5nZXQoYH4ke3RhcmdldE5hbWV9YCk/LnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwbGFjZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGxvb2t1cEluc3RhbmNlKHBsYWNlTmFtZS52YWx1ZSk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfSBlbHNlIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLkludmVudG9yeSl7XHJcbiAgICAgICAgICAgIHJldHVybiBsb29rdXBJbnN0YW5jZShQbGF5ZXIudHlwZU5hbWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobWVhbmluZyA9PT0gTWVhbmluZy5EZXNjcmliaW5nKXtcclxuICAgICAgICAgICAgaWYgKCF0YXJnZXROYW1lKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aHJlYWQuY3VycmVudFBsYWNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwbGFjZUNvbnRlbnRzID0gdGhyZWFkLmN1cnJlbnRQbGFjZT8uZ2V0Q29udGVudHNGaWVsZCgpITtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1PckRlY29yYXRpb24gPSBwbGFjZUNvbnRlbnRzLml0ZW1zLmZpbmQoeCA9PiB4LnR5cGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IHRhcmdldE5hbWUudG9Mb3dlckNhc2UoKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXRlbU9yRGVjb3JhdGlvbiBpbnN0YW5jZW9mIFJ1bnRpbWVXb3JsZE9iamVjdCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbU9yRGVjb3JhdGlvbjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGxvb2t1cEluc3RhbmNlKHRocmVhZC5jdXJyZW50UGxhY2U/LnR5cGVOYW1lISk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfSBlbHNlIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLlRha2luZyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSB0aHJlYWQuY3VycmVudFBsYWNlIS5nZXRDb250ZW50c0ZpZWxkKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoaW5nSXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gdGFyZ2V0TmFtZS50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChtYXRjaGluZ0l0ZW1zLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8UnVudGltZVdvcmxkT2JqZWN0Pm1hdGNoaW5nSXRlbXNbMF07XHJcbiAgICAgICAgfSBlbHNlIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLkRyb3BwaW5nKXtcclxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IHRocmVhZC5jdXJyZW50UGxheWVyIS5nZXRDb250ZW50c0ZpZWxkKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoaW5nSXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gdGFyZ2V0TmFtZS50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChtYXRjaGluZ0l0ZW1zLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8UnVudGltZVdvcmxkT2JqZWN0Pm1hdGNoaW5nSXRlbXNbMF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBuYW1lQW5kVG90YWxDb250ZW50cyh0aHJlYWQ6VGhyZWFkLCBjb250ZW50czpSdW50aW1lTGlzdCl7XHJcbiAgICAgICAgY29uc3QgbmFtZXMgPSBjb250ZW50cy5pdGVtcy5tYXAoeCA9PiB4LnR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZXNXaXRoQ291bnQgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xyXG5cclxuICAgICAgICBmb3IoY29uc3QgbmFtZSBvZiBuYW1lcyl7XHJcbiAgICAgICAgICAgIGlmICghbmFtZXNXaXRoQ291bnQuaGFzKG5hbWUpKXtcclxuICAgICAgICAgICAgICAgIG5hbWVzV2l0aENvdW50LnNldChuYW1lLCAxKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gbmFtZXNXaXRoQ291bnQuZ2V0KG5hbWUpITtcclxuICAgICAgICAgICAgICAgIG5hbWVzV2l0aENvdW50LnNldChuYW1lLCBjb3VudCArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuYW1lZFZhbHVlczpzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IoY29uc3QgW25hbWUsIHZhbHVlXSBvZiBuYW1lc1dpdGhDb3VudCl7XHJcbiAgICAgICAgICAgIG5hbWVkVmFsdWVzLnB1c2goYCR7dmFsdWV9ICR7bmFtZX0ocylgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5hbWVkVmFsdWVzLmZvckVhY2goeCA9PiB0aGlzLm91dHB1dC53cml0ZSh4KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXNjcmliZSh0aHJlYWQ6VGhyZWFkLCB0YXJnZXQ6UnVudGltZVdvcmxkT2JqZWN0LCBpc1NoYWxsb3dEZXNjcmlwdGlvbjpib29sZWFuKXtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIGlmICghaXNTaGFsbG93RGVzY3JpcHRpb24pe1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50cyA9IHRhcmdldC5nZXRGaWVsZEFzTGlzdChXb3JsZE9iamVjdC5jb250ZW50cyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaWJlQ29udGVudHModGhyZWFkLCBjb250ZW50cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkZXNjcmliZSA9IHRhcmdldC5tZXRob2RzLmdldChXb3JsZE9iamVjdC5kZXNjcmliZSkhO1xyXG5cclxuICAgICAgICBkZXNjcmliZS5hY3R1YWxQYXJhbWV0ZXJzLnVuc2hpZnQoVmFyaWFibGUuZm9yVGhpcyhuZXcgVHlwZSh0YXJnZXQ/LnR5cGVOYW1lISwgdGFyZ2V0Py5wYXJlbnRUeXBlTmFtZSEpLCB0YXJnZXQpKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChuZXcgUnVudGltZURlbGVnYXRlKGRlc2NyaWJlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvYnNlcnZlKHRocmVhZDpUaHJlYWQsIHRhcmdldDpSdW50aW1lV29ybGRPYmplY3Qpe1xyXG4gICAgICAgIGNvbnN0IG9ic2VydmUgPSB0YXJnZXQubWV0aG9kcy5nZXQoV29ybGRPYmplY3Qub2JzZXJ2ZSkhO1xyXG5cclxuICAgICAgICBvYnNlcnZlLmFjdHVhbFBhcmFtZXRlcnMudW5zaGlmdChWYXJpYWJsZS5mb3JUaGlzKG5ldyBUeXBlKHRhcmdldD8udHlwZU5hbWUhLCB0YXJnZXQ/LnBhcmVudFR5cGVOYW1lISksIHRhcmdldCkpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKG5ldyBSdW50aW1lRGVsZWdhdGUob2JzZXJ2ZSkpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXNjcmliZUNvbnRlbnRzKHRocmVhZDpUaHJlYWQsIHRhcmdldDpSdW50aW1lTGlzdCl7XHJcbiAgICAgICAgZm9yKGNvbnN0IGl0ZW0gb2YgdGFyZ2V0Lml0ZW1zKXtcclxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlKHRocmVhZCwgPFJ1bnRpbWVXb3JsZE9iamVjdD5pdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXRlcm1pbmVNZWFuaW5nRm9yKGFjdGlvbjpzdHJpbmcpOk1lYW5pbmd7XHJcbiAgICAgICAgY29uc3Qgc3lzdGVtQWN0aW9uID0gYH4ke2FjdGlvbn1gO1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBTdXBwb3J0IGN1c3RvbSBhY3Rpb25zIGJldHRlci5cclxuXHJcbiAgICAgICAgc3dpdGNoKHN5c3RlbUFjdGlvbil7XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy5kZXNjcmliaW5nOiByZXR1cm4gTWVhbmluZy5EZXNjcmliaW5nO1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcubW92aW5nOiByZXR1cm4gTWVhbmluZy5Nb3Zpbmc7XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy5kaXJlY3Rpb246IHJldHVybiBNZWFuaW5nLkRpcmVjdGlvbjtcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLnRha2luZzogcmV0dXJuIE1lYW5pbmcuVGFraW5nO1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcuaW52ZW50b3J5OiByZXR1cm4gTWVhbmluZy5JbnZlbnRvcnk7XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy5kcm9wcGluZzogcmV0dXJuIE1lYW5pbmcuRHJvcHBpbmc7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWVhbmluZy5DdXN0b207XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW5zdGFuY2VDYWxsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLkluc3RhbmNlQ2FsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1ldGhvZE5hbWU/OnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aHJlYWQuY3VycmVudE1ldGhvZDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm1ldGhvZE5hbWUpe1xyXG4gICAgICAgICAgICB0aGlzLm1ldGhvZE5hbWUgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeXtcclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjdXJyZW50LnBvcCgpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWV0aG9kID0gaW5zdGFuY2U/Lm1ldGhvZHMuZ2V0KHRoaXMubWV0aG9kTmFtZSkhO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGAke2luc3RhbmNlPy50eXBlTmFtZX06OiR7dGhpcy5tZXRob2ROYW1lfSguLi4ke21ldGhvZC5wYXJhbWV0ZXJzLmxlbmd0aH0pYCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBwYXJhbWV0ZXJWYWx1ZXM6VmFyaWFibGVbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1ldGhvZCEucGFyYW1ldGVycy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbWV0ZXIgPSBtZXRob2QhLnBhcmFtZXRlcnNbaV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGN1cnJlbnQucG9wKCkhO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSBuZXcgVmFyaWFibGUocGFyYW1ldGVyLm5hbWUsIHBhcmFtZXRlci50eXBlISwgaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIHBhcmFtZXRlclZhbHVlcy5wdXNoKHZhcmlhYmxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gSEFDSzogV2Ugc2hvdWxkbid0IGNyZWF0ZSBvdXIgb3duIHR5cGUsIHdlIHNob3VsZCBpbmhlcmVudGx5IGtub3cgd2hhdCBpdCBpcy5cclxuXHJcbiAgICAgICAgICAgIHBhcmFtZXRlclZhbHVlcy51bnNoaWZ0KFZhcmlhYmxlLmZvclRoaXMobmV3IFR5cGUoaW5zdGFuY2U/LnR5cGVOYW1lISwgaW5zdGFuY2U/LnBhcmVudFR5cGVOYW1lISksIGluc3RhbmNlKSk7XHJcblxyXG4gICAgICAgICAgICBtZXRob2QuYWN0dWFsUGFyYW1ldGVycyA9IHBhcmFtZXRlclZhbHVlcztcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5hY3RpdmF0ZU1ldGhvZChtZXRob2QpO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIHRoaXMubWV0aG9kTmFtZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVEZWxlZ2F0ZSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVEZWxlZ2F0ZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnZva2VEZWxlZ2F0ZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5JbnZva2VEZWxlZ2F0ZTtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpITtcclxuXHJcbiAgICAgICAgaWYgKGRlbGVnYXRlIGluc3RhbmNlb2YgUnVudGltZURlbGVnYXRlKXtcclxuICAgICAgICAgICAgY29uc3QgYWN0aXZhdGlvbiA9IHRocmVhZC5hY3RpdmF0ZU1ldGhvZChkZWxlZ2F0ZS53cmFwcGVkTWV0aG9kKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBVbmFibGUgdG8gaW52b2tlIGRlbGVnYXRlIGZvciBub24tZGVsZWdhdGUgaW5zdGFuY2UgJyR7ZGVsZWdhdGV9J2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRGVsZWdhdGUgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lRGVsZWdhdGVcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEludm9rZURlbGVnYXRlT25JbnN0YW5jZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5JbnZva2VEZWxlZ2F0ZU9uSW5zdGFuY2U7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpITtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpITtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGB+YW5vbigke2luc3RhbmNlLnR5cGVOYW1lfSlgKTtcclxuXHJcbiAgICAgICAgaWYgKGRlbGVnYXRlIGluc3RhbmNlb2YgUnVudGltZURlbGVnYXRlKXtcclxuICAgICAgICAgICAgY29uc3QgdHlwZSA9IE1lbW9yeS5maW5kVHlwZUJ5TmFtZShpbnN0YW5jZS50eXBlTmFtZSkhO1xyXG4gICAgICAgICAgICBjb25zdCBhY3R1YWxQYXJhbWV0ZXJzV2l0aG91dFRoaXMgPSBkZWxlZ2F0ZS53cmFwcGVkTWV0aG9kLmFjdHVhbFBhcmFtZXRlcnMuZmlsdGVyKHggPT4geC5uYW1lICE9IFwifnRoaXNcIik7XHJcblxyXG4gICAgICAgICAgICBhY3R1YWxQYXJhbWV0ZXJzV2l0aG91dFRoaXMucHVzaChcclxuICAgICAgICAgICAgICAgIFZhcmlhYmxlLmZvclRoaXModHlwZSwgaW5zdGFuY2UpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBkZWxlZ2F0ZS53cmFwcGVkTWV0aG9kLmFjdHVhbFBhcmFtZXRlcnMgPSBhY3R1YWxQYXJhbWV0ZXJzV2l0aG91dFRoaXM7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gdGhyZWFkLmFjdGl2YXRlTWV0aG9kKGRlbGVnYXRlLndyYXBwZWRNZXRob2QpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFVuYWJsZSB0byBpbnZva2UgZGVsZWdhdGUgZm9yIG5vbi1kZWxlZ2F0ZSBpbnN0YW5jZSAnJHtkZWxlZ2F0ZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRCb29sZWFuSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgY29kZTogT3BDb2RlID0gT3BDb2RlLkxvYWRCb29sZWFuO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IDxib29sZWFuPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICBjb25zdCBydW50aW1lVmFsdWUgPSBNZW1vcnkuYWxsb2NhdGVCb29sZWFuKHZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChydW50aW1lVmFsdWUpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCwgdmFsdWUpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lSW50ZWdlciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJbnRlZ2VyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVMaXN0IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUxpc3RcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkRWxlbWVudEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5Mb2FkRWxlbWVudDtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQpO1xyXG5cclxuICAgICAgICBjb25zdCBlbGVtZW50TnVtYmVyID0gPFJ1bnRpbWVJbnRlZ2VyPnRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSA8UnVudGltZUxpc3Q+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBsaXN0Lml0ZW1zW2VsZW1lbnROdW1iZXIudmFsdWVdO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKGl0ZW0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRW1wdHkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lRW1wdHlcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkRW1wdHlIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyBjb2RlOiBPcENvZGUgPSBPcENvZGUuTG9hZEVtcHR5O1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2gobmV3IFJ1bnRpbWVFbXB0eSgpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkRmllbGRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuTG9hZEZpZWxkO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IGZpZWxkTmFtZSA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb25WYWx1ZUFzPHN0cmluZz4oKTtcclxuXHJcbiAgICAgICAgY29uc3QgZmllbGQgPSBpbnN0YW5jZT8uZmllbGRzLmdldChmaWVsZE5hbWUpO1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGZpZWxkPy52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGAke2luc3RhbmNlPy50eXBlTmFtZX06OiR7ZmllbGROYW1lfToke2ZpZWxkPy50eXBlLm5hbWV9YCwgJy8vJywgdHlwZW9mIHZhbHVlLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkSW5zdGFuY2VIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuTG9hZEluc3RhbmNlO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCB0eXBlTmFtZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHR5cGVOYW1lID09PSBcIn5pdFwiKXtcclxuICAgICAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRocmVhZC5jdXJyZW50UGxhY2UhO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHN1YmplY3QpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFVuYWJsZSB0byBsb2FkIGluc3RhbmNlIGZvciB1bnN1cHBvcnRlZCB0eXBlICcke3R5cGVOYW1lfSdgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZExvY2FsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLkxvYWRMb2NhbDtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvY2FsTmFtZSA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICBjb25zdCBwYXJhbWV0ZXIgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5tZXRob2Q/LmFjdHVhbFBhcmFtZXRlcnMuZmluZCh4ID0+IHgubmFtZSA9PSBsb2NhbE5hbWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHBhcmFtZXRlcj8udmFsdWUhKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsIGxvY2FsTmFtZSwgJy8vJywgcGFyYW1ldGVyPy52YWx1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZE51bWJlckhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5Mb2FkTnVtYmVyO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSA8bnVtYmVyPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICBjb25zdCBydW50aW1lVmFsdWUgPSBNZW1vcnkuYWxsb2NhdGVOdW1iZXIodmFsdWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHJ1bnRpbWVWYWx1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9JbnN0YW5jZUNhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRUaGlzSGFuZGxlciB9IGZyb20gXCIuL0xvYWRUaGlzSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkUHJvcGVydHlIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuTG9hZFByb3BlcnR5O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZmllbGROYW1lPzpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZmllbGROYW1lKXtcclxuICAgICAgICAgICAgdGhpcy5maWVsZE5hbWUgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeXtcclxuICAgICAgICAgICAgY29uc3QgZmllbGQgPSBpbnN0YW5jZT8uZmllbGRzLmdldCh0aGlzLmZpZWxkTmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZmllbGQ/LnZhbHVlITtcclxuICAgICAgICAgICAgY29uc3QgZ2V0RmllbGQgPSBpbnN0YW5jZT8ubWV0aG9kcy5nZXQoYH5nZXRfJHt0aGlzLmZpZWxkTmFtZX1gKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCBgJHtpbnN0YW5jZT8udHlwZU5hbWV9Ojoke3RoaXMuZmllbGROYW1lfWAsIGB7Z2V0PSR7Z2V0RmllbGQgIT0gdW5kZWZpbmVkfX1gLCAnLy8nLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZ2V0RmllbGQpe1xyXG4gICAgICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaCh2YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9hZFRoaXMgPSBuZXcgTG9hZFRoaXNIYW5kbGVyKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBsb2FkVGhpcy5oYW5kbGUodGhyZWFkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9IEV2YWx1YXRpb25SZXN1bHQuQ29udGludWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgSW5zdGFuY2VDYWxsSGFuZGxlcihnZXRGaWVsZC5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXIuaGFuZGxlKHRocmVhZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9nZXRGaWVsZC5hY3R1YWxQYXJhbWV0ZXJzLnB1c2gobmV3IFZhcmlhYmxlKFwifnZhbHVlXCIsIGZpZWxkPy50eXBlISwgdmFsdWUpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL3RocmVhZC5hY3RpdmF0ZU1ldGhvZChnZXRGaWVsZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgICAgIH0gZmluYWxseXtcclxuICAgICAgICAgICAgdGhpcy5maWVsZE5hbWUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkU3RyaW5nSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLkxvYWRTdHJpbmc7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbiEudmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCB2YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpe1xyXG4gICAgICAgICAgICBjb25zdCBzdHJpbmdWYWx1ZSA9IG5ldyBSdW50aW1lU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChzdHJpbmdWYWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIkV4cGVjdGVkIGEgc3RyaW5nXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCJcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRUaGlzSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLkxvYWRUaGlzO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLm1ldGhvZD8uYWN0dWFsUGFyYW1ldGVyc1swXS52YWx1ZSE7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV3SW5zdGFuY2VIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuTmV3SW5zdGFuY2U7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHR5cGVOYW1lID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWU7XHJcblxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCB0eXBlTmFtZSk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdHlwZU5hbWUgPT09IFwic3RyaW5nXCIpe1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gdGhyZWFkLmtub3duVHlwZXMuZ2V0KHR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghdHlwZSl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGxvY2F0ZSB0eXBlXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IE1lbW9yeS5hbGxvY2F0ZSh0eXBlKTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goaW5zdGFuY2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTm9PcEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5Ob09wO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVDb21tYW5kIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUNvbW1hbmRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJzZUNvbW1hbmRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuUGFyc2VDb21tYW5kO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHRleHQgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgaWYgKHRleHQgaW5zdGFuY2VvZiBSdW50aW1lU3RyaW5nKXtcclxuICAgICAgICAgICAgY29uc3QgY29tbWFuZFRleHQgPSB0ZXh0LnZhbHVlO1xyXG4gICAgICAgICAgICBjb25zdCBjb21tYW5kID0gdGhpcy5wYXJzZUNvbW1hbmQoY29tbWFuZFRleHQpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChjb21tYW5kKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIHBhcnNlIGNvbW1hbmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwYXJzZUNvbW1hbmQodGV4dDpzdHJpbmcpOlJ1bnRpbWVDb21tYW5ke1xyXG4gICAgICAgIGNvbnN0IHBpZWNlcyA9IHRleHQuc3BsaXQoXCIgXCIpO1xyXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBNZW1vcnkuYWxsb2NhdGVDb21tYW5kKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29tbWFuZC5hY3Rpb24gPSBNZW1vcnkuYWxsb2NhdGVTdHJpbmcocGllY2VzWzBdKTtcclxuICAgICAgICBjb21tYW5kLnRhcmdldE5hbWUgPSBNZW1vcnkuYWxsb2NhdGVTdHJpbmcocGllY2VzWzFdKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vSU91dHB1dFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJpbnRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuUHJpbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBvdXRwdXQ6SU91dHB1dDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvdXRwdXQ6SU91dHB1dCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm91dHB1dCA9IG91dHB1dDtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRleHQgaW5zdGFuY2VvZiBSdW50aW1lU3RyaW5nKXtcclxuICAgICAgICAgICAgdGhpcy5vdXRwdXQud3JpdGUodGV4dC52YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBwcmludCwgZW5jb3VudGVyZWQgYSB0eXBlIG9uIHRoZSBzdGFjayBvdGhlciB0aGFuIHN0cmluZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlYWRJbnB1dEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGNvZGU6IE9wQ29kZSA9IE9wQ29kZS5SZWFkSW5wdXQ7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gRXZhbHVhdGlvblJlc3VsdC5TdXNwZW5kRm9ySW5wdXQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVtcHR5IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUVtcHR5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmV0dXJuSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgY29kZTogT3BDb2RlID0gT3BDb2RlLlJldHVybjtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgLy8gVE9ETzogSGFuZGxlIHJldHVybmluZyB0b3AgdmFsdWUgb24gc3RhY2sgYmFzZWQgb24gcmV0dXJuIHR5cGUgb2YgbWV0aG9kLlxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aHJlYWQuY3VycmVudE1ldGhvZDtcclxuICAgICAgICBjb25zdCBzaXplID0gY3VycmVudC5zdGFja1NpemUoKTtcclxuICAgICAgICBjb25zdCBoYXNSZXR1cm5UeXBlID0gY3VycmVudC5tZXRob2Q/LnJldHVyblR5cGUgIT0gXCJcIjtcclxuXHJcbiAgICAgICAgaWYgKGhhc1JldHVyblR5cGUpe1xyXG4gICAgICAgICAgICBpZiAoc2l6ZSA9PSAwKXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJFeHBlY3RlZCByZXR1cm4gdmFsdWUgZnJvbSBtZXRob2QgYnV0IGZvdW5kIG5vIGluc3RhbmNlIG9uIHRoZSBzdGFja1wiKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaXplID4gMSl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBTdGFjayBJbWJhbGFuY2UhIFJldHVybmluZyBmcm9tICcke2N1cnJlbnQubWV0aG9kPy5uYW1lfScgZm91bmQgJyR7c2l6ZX0nIGluc3RhbmNlcyBsZWZ0IGJ1dCBleHBlY3RlZCBvbmUuYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoc2l6ZSA+IDApe1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgU3RhY2sgSW1iYWxhbmNlISBSZXR1cm5pbmcgZnJvbSAnJHtjdXJyZW50Lm1ldGhvZD8ubmFtZX0nIGZvdW5kICcke3NpemV9JyBpbnN0YW5jZXMgbGVmdCBidXQgZXhwZWN0ZWQgemVyby5gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSB0aHJlYWQhLnJldHVybkZyb21DdXJyZW50TWV0aG9kKCk7XHJcblxyXG4gICAgICAgIGlmICghKHJldHVyblZhbHVlIGluc3RhbmNlb2YgUnVudGltZUVtcHR5KSl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCwgcmV0dXJuVmFsdWUpO1xyXG4gICAgICAgICAgICB0aHJlYWQ/LmN1cnJlbnRNZXRob2QucHVzaChyZXR1cm5WYWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sb2dJbnRlcmFjdGlvbih0aHJlYWQsICd2b2lkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gRXZhbHVhdGlvblJlc3VsdC5Db250aW51ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi8uLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNldExvY2FsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBwdWJsaWMgY29kZTogT3BDb2RlID0gT3BDb2RlLlNldExvY2FsO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgbG9jYWxOYW1lID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSA8UnVudGltZUFueT50aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCwgbG9jYWxOYW1lKTtcclxuXHJcbiAgICAgICAgbGV0IHBhcmFtZXRlciA9IHRocmVhZC5jdXJyZW50TWV0aG9kLm1ldGhvZD8uYWN0dWFsUGFyYW1ldGVycy5maW5kKHggPT4geC5uYW1lID09IGxvY2FsTmFtZSkhO1xyXG5cclxuICAgICAgICBpZiAoIXBhcmFtZXRlcil7XHJcbiAgICAgICAgICAgIHBhcmFtZXRlciA9IG5ldyBWYXJpYWJsZShsb2NhbE5hbWUsIG5ldyBUeXBlKFJ1bnRpbWVBbnkubmFtZSwgXCJcIiksIHVuZGVmaW5lZCk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5tZXRob2Q/LmFjdHVhbFBhcmFtZXRlcnMucHVzaChwYXJhbWV0ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGFyYW1ldGVyLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0YXRpY0NhbGxIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuU3RhdGljQ2FsbDtcclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgY2FsbFRleHQgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuXHJcbiAgICAgICAgY29uc3QgcGllY2VzID0gY2FsbFRleHQuc3BsaXQoXCIuXCIpO1xyXG5cclxuICAgICAgICBjb25zdCB0eXBlTmFtZSA9IHBpZWNlc1swXTtcclxuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gcGllY2VzWzFdO1xyXG5cclxuICAgICAgICBjb25zdCB0eXBlID0gdGhyZWFkLmtub3duVHlwZXMuZ2V0KHR5cGVOYW1lKSE7XHJcbiAgICAgICAgY29uc3QgbWV0aG9kID0gdHlwZT8ubWV0aG9kcy5maW5kKHggPT4geC5uYW1lID09PSBtZXRob2ROYW1lKSE7ICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubG9nSW50ZXJhY3Rpb24odGhyZWFkLCBgJHt0eXBlTmFtZX06OiR7bWV0aG9kTmFtZX0oKWApO1xyXG5cclxuICAgICAgICB0aHJlYWQuYWN0aXZhdGVNZXRob2QobWV0aG9kKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgT3BDb2RlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBlT2ZIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHB1YmxpYyByZWFkb25seSBjb2RlOiBPcENvZGUgPSBPcENvZGUuVHlwZU9mO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCB0eXBlTmFtZSA9IDxzdHJpbmc+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ0ludGVyYWN0aW9uKHRocmVhZCwgdHlwZU5hbWUpO1xyXG5cclxuICAgICAgICBpZiAodGhyZWFkLmN1cnJlbnRNZXRob2Quc3RhY2tTaXplKCkgPT0gMCl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gTWVtb3J5LmFsbG9jYXRlQm9vbGVhbihmYWxzZSk7XHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucGVlaygpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaXNUeXBlID0gaW5zdGFuY2U/LnR5cGVOYW1lID09IHR5cGVOYW1lO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBNZW1vcnkuYWxsb2NhdGVCb29sZWFuKGlzVHlwZSk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBNZWFuaW5ne1xyXG4gICAgRGVzY3JpYmluZyxcclxuICAgIFRha2luZyxcclxuICAgIE1vdmluZyxcclxuICAgIERpcmVjdGlvbixcclxuICAgIEludmVudG9yeSxcclxuICAgIERyb3BwaW5nLFxyXG4gICAgUXVpdHRpbmcsXHJcbiAgICBDdXN0b21cclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuL1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUFueXtcclxuICAgIHBhcmVudFR5cGVOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICB0eXBlTmFtZTpzdHJpbmcgPSBBbnkudHlwZU5hbWU7XHJcblxyXG4gICAgZmllbGRzOk1hcDxzdHJpbmcsIFZhcmlhYmxlPiA9IG5ldyBNYXA8c3RyaW5nLCBWYXJpYWJsZT4oKTtcclxuICAgIG1ldGhvZHM6TWFwPHN0cmluZywgTWV0aG9kPiA9IG5ldyBNYXA8c3RyaW5nLCBNZXRob2Q+KCk7XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy50eXBlTmFtZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUJvb2xlYW4gZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IEJvb2xlYW5UeXBlLnR5cGVOYW1lO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTpib29sZWFuKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMudmFsdWUudG9TdHJpbmcoKX06JHt0aGlzLnR5cGVOYW1lfWA7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4vUnVudGltZVN0cmluZ1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVDb21tYW5kIGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0YXJnZXROYW1lPzpSdW50aW1lU3RyaW5nLCBwdWJsaWMgYWN0aW9uPzpSdW50aW1lU3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IERlY29yYXRpb24gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9EZWNvcmF0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZURlY29yYXRpb24gZXh0ZW5kcyBSdW50aW1lV29ybGRPYmplY3R7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IERlY29yYXRpb24ucGFyZW50VHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IERlY29yYXRpb24udHlwZU5hbWU7XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgRGVsZWdhdGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9EZWxlZ2F0ZVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vLi4vY29tbW9uL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVEZWxlZ2F0ZSBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gRGVsZWdhdGUudHlwZU5hbWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHdyYXBwZWRNZXRob2Q6TWV0aG9kKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUVtcHR5IGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBcIn5lbXB0eVwiO1xyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lSW50ZWdlciBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6bnVtYmVyKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVXb3JsZE9iamVjdCB9IGZyb20gXCIuL1J1bnRpbWVXb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9JdGVtXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lSXRlbSBleHRlbmRzIFJ1bnRpbWVXb3JsZE9iamVjdHtcclxuICAgIHBhcmVudFR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IEl0ZW0udHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIGdldCB0eXBlKCk6VHlwZXtcclxuICAgICAgICBjb25zdCB0eXBlID0gUnVudGltZVdvcmxkT2JqZWN0LnR5cGU7XHJcblxyXG4gICAgICAgIHR5cGUubmFtZSA9IEl0ZW0udHlwZU5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vLi4vY29tbW9uL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBQYXJhbWV0ZXIgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1BhcmFtZXRlclwiO1xyXG5pbXBvcnQgeyBOdW1iZXJUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTnVtYmVyVHlwZVwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuLi8uLi9jb21tb24vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuL1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRGVsZWdhdGUgfSBmcm9tIFwiLi9SdW50aW1lRGVsZWdhdGVcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUxpc3QgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgdHlwZU5hbWUgPSBMaXN0LnR5cGVOYW1lO1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIGl0ZW1zOlJ1bnRpbWVBbnlbXSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5kZWZpbmVDb250YWluc01ldGhvZCgpO1xyXG4gICAgICAgIHRoaXMuZGVmaW5lTWFwTWV0aG9kKCk7XHJcbiAgICAgICAgdGhpcy5kZWZpbmVBZGRNZXRob2QoKTtcclxuICAgICAgICB0aGlzLmRlZmluZUNvdW50TWV0aG9kKCk7XHJcbiAgICAgICAgdGhpcy5kZWZpbmVKb2luTWV0aG9kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWZpbmVKb2luTWV0aG9kKCl7XHJcbiAgICAgICAgY29uc3Qgam9pbiA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICBqb2luLm5hbWUgPSBMaXN0LmpvaW47XHJcbiAgICAgICAgam9pbi5wYXJhbWV0ZXJzLnB1c2goXHJcbiAgICAgICAgICAgIG5ldyBQYXJhbWV0ZXIoTGlzdC5zZXBhcmF0b3JQYXJhbWV0ZXIsIFJ1bnRpbWVTdHJpbmcubmFtZSlcclxuICAgICAgICApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGpvaW4ucmV0dXJuVHlwZSA9IFJ1bnRpbWVTdHJpbmcubmFtZTtcclxuICAgICAgICBcclxuICAgICAgICBqb2luLmJvZHkucHVzaChcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZExvY2FsKExpc3Quc2VwYXJhdG9yUGFyYW1ldGVyKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uZXh0ZXJuYWxDYWxsKFwiam9pbkxpc3RcIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnJldHVybigpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5tZXRob2RzLnNldChMaXN0LmpvaW4sIGpvaW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVmaW5lQ291bnRNZXRob2QoKXtcclxuICAgICAgICBjb25zdCBjb3VudCA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICBjb3VudC5uYW1lID0gTGlzdC5jb3VudDtcclxuICAgICAgICBjb3VudC5yZXR1cm5UeXBlID0gUnVudGltZUludGVnZXIubmFtZTtcclxuXHJcbiAgICAgICAgY291bnQuYm9keS5wdXNoKFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5leHRlcm5hbENhbGwoXCJjb3VudEl0ZW1zXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5yZXR1cm4oKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5zZXQoTGlzdC5jb3VudCwgY291bnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVmaW5lQWRkTWV0aG9kKCl7XHJcbiAgICAgICAgY29uc3QgYWRkID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgIGFkZC5uYW1lID0gTGlzdC5hZGQ7ICAgICAgICBcclxuICAgICAgICBhZGQucGFyYW1ldGVycy5wdXNoKFxyXG4gICAgICAgICAgICBuZXcgUGFyYW1ldGVyKExpc3QuaW5zdGFuY2VQYXJhbWV0ZXIsIFJ1bnRpbWVBbnkubmFtZSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBhZGQuYm9keS5wdXNoKFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkTG9jYWwoTGlzdC5pbnN0YW5jZVBhcmFtZXRlciksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmV4dGVybmFsQ2FsbChcImFkZEluc3RhbmNlXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5yZXR1cm4oKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5zZXQoTGlzdC5hZGQsIGFkZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWZpbmVNYXBNZXRob2QoKXtcclxuICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgbWFwLm5hbWUgPSBMaXN0Lm1hcDtcclxuICAgICAgICBtYXAucGFyYW1ldGVycy5wdXNoKFxyXG4gICAgICAgICAgICBuZXcgUGFyYW1ldGVyKExpc3QuZGVsZWdhdGVQYXJhbWV0ZXIsIFJ1bnRpbWVEZWxlZ2F0ZS5uYW1lKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgbWFwLnJldHVyblR5cGUgPSB0aGlzLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgbWFwLmJvZHkucHVzaChcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZE51bWJlcigwKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uc2V0TG9jYWwoXCJ+bG9jYWxDb3VudFwiKSwgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5uZXdJbnN0YW5jZSh0aGlzLnR5cGVOYW1lKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uc2V0TG9jYWwoXCJ+cmVzdWx0c1wiKSwgICAgICBcclxuXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRMb2NhbChcIn5sb2NhbENvdW50XCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkVGhpcygpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5pbnN0YW5jZUNhbGwoTGlzdC5jb3VudCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmNvbXBhcmVFcXVhbCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5icmFuY2hSZWxhdGl2ZUlmRmFsc2UoMiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRMb2NhbChcIn5yZXN1bHRzXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5yZXR1cm4oKSwgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZExvY2FsKFwifmxvY2FsQ291bnRcIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRFbGVtZW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRMb2NhbChMaXN0LmRlbGVnYXRlUGFyYW1ldGVyKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uaW52b2tlRGVsZWdhdGVPbkluc3RhbmNlKCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRMb2NhbChcIn5yZXN1bHRzXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5pbnN0YW5jZUNhbGwoTGlzdC5hZGQpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkTG9jYWwoXCJ+bG9jYWxDb3VudFwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZE51bWJlcigxKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uYWRkKCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnNldExvY2FsKFwifmxvY2FsQ291bnRcIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmdvVG8oNClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLm1ldGhvZHMuc2V0KExpc3QubWFwLCBtYXApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVmaW5lQ29udGFpbnNNZXRob2QoKXtcclxuICAgICAgICBjb25zdCBjb250YWlucyA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICBjb250YWlucy5uYW1lID0gTGlzdC5jb250YWlucztcclxuICAgICAgICBjb250YWlucy5wYXJhbWV0ZXJzLnB1c2goXHJcbiAgICAgICAgICAgIG5ldyBQYXJhbWV0ZXIoTGlzdC50eXBlTmFtZVBhcmFtZXRlciwgU3RyaW5nVHlwZS50eXBlTmFtZSksXHJcbiAgICAgICAgICAgIG5ldyBQYXJhbWV0ZXIoTGlzdC5jb3VudFBhcmFtZXRlciwgTnVtYmVyVHlwZS50eXBlTmFtZSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb250YWlucy5yZXR1cm5UeXBlID0gQm9vbGVhblR5cGUudHlwZU5hbWU7XHJcblxyXG4gICAgICAgIGNvbnRhaW5zLmJvZHkucHVzaChcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZExvY2FsKExpc3QuY291bnRQYXJhbWV0ZXIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkTG9jYWwoTGlzdC50eXBlTmFtZVBhcmFtZXRlciksICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uZXh0ZXJuYWxDYWxsKFwiY29udGFpbnNUeXBlXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5yZXR1cm4oKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5zZXQoTGlzdC5jb250YWlucywgY29udGFpbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkSW5zdGFuY2UoaW5zdGFuY2U6UnVudGltZUFueSl7XHJcbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKGluc3RhbmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvdW50SXRlbXMoKXtcclxuICAgICAgICByZXR1cm4gTWVtb3J5LmFsbG9jYXRlTnVtYmVyKHRoaXMuaXRlbXMubGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbnRhaW5zVHlwZSh0eXBlTmFtZTpSdW50aW1lU3RyaW5nLCBjb3VudDpSdW50aW1lSW50ZWdlcil7XHJcbiAgICAgICAgY29uc3QgZm91bmRJdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKHggPT4geC50eXBlTmFtZSA9PT0gdHlwZU5hbWUudmFsdWUpO1xyXG4gICAgICAgIGNvbnN0IGZvdW5kID0gZm91bmRJdGVtcy5sZW5ndGggPT09IGNvdW50LnZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gTWVtb3J5LmFsbG9jYXRlQm9vbGVhbihmb3VuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBqb2luTGlzdChzZXBhcmF0b3I6UnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgaWYgKCF0aGlzLml0ZW1zLmV2ZXJ5KHggPT4geCBpbnN0YW5jZW9mIFJ1bnRpbWVTdHJpbmcpKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIkF0dGVtcHRlZCB0byBqb2luIGEgbGlzdCB3aXRoIGNvbmZsaWN0aW5nIGRhdGEgdHlwZXNcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLml0ZW1zLm1hcCh4ID0+ICg8UnVudGltZVN0cmluZz54KS52YWx1ZSk7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09IDAgfHwgdmFsdWVzLmV2ZXJ5KHggPT4geCA9PT0gJycpKXtcclxuICAgICAgICAgICAgcmV0dXJuIE1lbW9yeS5hbGxvY2F0ZVN0cmluZygnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBqb2luZWRWYWx1ZSA9IHZhbHVlcy5qb2luKHNlcGFyYXRvci52YWx1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBNZW1vcnkuYWxsb2NhdGVTdHJpbmcoam9pbmVkVmFsdWUpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVBsYWNlIGV4dGVuZHMgUnVudGltZVdvcmxkT2JqZWN0e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC5wYXJlbnRUeXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gUGxhY2UudHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIGdldCB0eXBlKCk6VHlwZXtcclxuICAgICAgICBjb25zdCB0eXBlID0gUnVudGltZVdvcmxkT2JqZWN0LnR5cGU7XHJcblxyXG4gICAgICAgIHR5cGUubmFtZSA9IFBsYWNlLnR5cGVOYW1lO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxheWVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVBsYXllciBleHRlbmRzIFJ1bnRpbWVXb3JsZE9iamVjdHtcclxuICAgIHN0YXRpYyBnZXQgdHlwZSgpOlR5cGV7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IFJ1bnRpbWVXb3JsZE9iamVjdC50eXBlO1xyXG5cclxuICAgICAgICB0eXBlLm5hbWUgPSBQbGF5ZXIudHlwZU5hbWU7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lU2F5IGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIG1lc3NhZ2U6c3RyaW5nID0gXCJcIjtcclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVTdHJpbmcgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgdmFsdWU6c3RyaW5nO1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IFwifnN0cmluZ1wiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gYFwiJHt0aGlzLnZhbHVlfVwiYDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVMaXN0IH0gZnJvbSBcIi4vUnVudGltZUxpc3RcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuL1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVXb3JsZE9iamVjdCBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIGdldCB0eXBlKCk6VHlwZXtcclxuICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoV29ybGRPYmplY3QudHlwZU5hbWUsIFdvcmxkT2JqZWN0LnBhcmVudFR5cGVOYW1lKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjb250ZW50cyA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgIGNvbnRlbnRzLm5hbWUgPSBXb3JsZE9iamVjdC5jb250ZW50cztcclxuICAgICAgICBjb250ZW50cy50eXBlTmFtZSA9IExpc3QudHlwZU5hbWU7XHJcbiAgICAgICAgY29udGVudHMuZGVmYXVsdFZhbHVlID0gW107XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgZGVzY3JpcHRpb24ubmFtZSA9IFdvcmxkT2JqZWN0LmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uLnR5cGVOYW1lID0gU3RyaW5nVHlwZS50eXBlTmFtZTtcclxuICAgICAgICBkZXNjcmlwdGlvbi5kZWZhdWx0VmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICB0eXBlLmZpZWxkcy5wdXNoKGNvbnRlbnRzKTtcclxuICAgICAgICB0eXBlLmZpZWxkcy5wdXNoKGRlc2NyaXB0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRGaWVsZFZhbHVlQnlOYW1lKG5hbWU6c3RyaW5nKTpSdW50aW1lQW55e1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5maWVsZHMuZ2V0KG5hbWUpPy52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGluc3RhbmNlID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYEF0dGVtcHRlZCBmaWVsZCBhY2Nlc3MgZm9yIHVua25vd24gZmllbGQgJyR7bmFtZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q29udGVudHNGaWVsZCgpOlJ1bnRpbWVMaXN0e1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEZpZWxkQXNMaXN0KFdvcmxkT2JqZWN0LmNvbnRlbnRzKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRGaWVsZEFzTGlzdChuYW1lOnN0cmluZyk6UnVudGltZUxpc3R7XHJcbiAgICAgICAgcmV0dXJuIDxSdW50aW1lTGlzdD50aGlzLmdldEZpZWxkVmFsdWVCeU5hbWUobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RmllbGRBc1N0cmluZyhuYW1lOnN0cmluZyk6UnVudGltZVN0cmluZ3tcclxuICAgICAgICByZXR1cm4gPFJ1bnRpbWVTdHJpbmc+dGhpcy5nZXRGaWVsZFZhbHVlQnlOYW1lKG5hbWUpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZhcmlhYmxle1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IHRoaXNUeXBlTmFtZSA9IFwifnRoaXNcIjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbmFtZTpzdHJpbmcsIFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHR5cGU6VHlwZSxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyB2YWx1ZT86UnVudGltZUFueSl7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGZvclRoaXModHlwZTpUeXBlLCB2YWx1ZT86UnVudGltZUFueSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWYXJpYWJsZShWYXJpYWJsZS50aGlzVHlwZU5hbWUsIHR5cGUsIHZhbHVlKTtcclxuICAgIH1cclxufSJdfQ==
