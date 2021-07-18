/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./out/build-info.json":
/*!*****************************!*\
  !*** ./out/build-info.json ***!
  \*****************************/
/***/ ((module) => {

module.exports = JSON.parse('{"major":1,"minor":0,"revision":23}');

/***/ }),

/***/ "./out/talon/PaneOutput.js":
/*!*********************************!*\
  !*** ./out/talon/PaneOutput.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
//# sourceMappingURL=../../ide/js/talon/PaneOutput.js.map

/***/ }),

/***/ "./out/talon/TalonIde.js":
/*!*******************************!*\
  !*** ./out/talon/TalonIde.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TalonIde = void 0;
const TalonCompiler_1 = __webpack_require__(/*! ./compiler/TalonCompiler */ "./out/talon/compiler/TalonCompiler.js");
const PaneOutput_1 = __webpack_require__(/*! ./PaneOutput */ "./out/talon/PaneOutput.js");
const TalonRuntime_1 = __webpack_require__(/*! ./runtime/TalonRuntime */ "./out/talon/runtime/TalonRuntime.js");
const AnalysisCoordinator_1 = __webpack_require__(/*! ./ide/AnalysisCoordinator */ "./out/talon/ide/AnalysisCoordinator.js");
const CodePaneAnalyzer_1 = __webpack_require__(/*! ./ide/analyzers/CodePaneAnalyzer */ "./out/talon/ide/analyzers/CodePaneAnalyzer.js");
const CodePaneStyleFormatter_1 = __webpack_require__(/*! ./ide/formatters/CodePaneStyleFormatter */ "./out/talon/ide/formatters/CodePaneStyleFormatter.js");
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
                "understand \"drop\" as dropping. \n" +
                "understand \"use\" as using.\n\n" +
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
                "it is described as \"The fireplace crackles. It's full of fire.\".\n" +
                "when it is used with a Coin:\n" +
                "    say \"The firelight flickers on the surface of the coin.\";\n" +
                "and then stop.\n\n" +
                "a Walkway is a kind of place. \n" +
                "it is described as \"The walkway in front of the inn is empty, just a cobblestone entrance. The inn is to the south.\". \n" +
                "it can reach the Inn by going \"south\". \n" +
                "when the player enters:\n" +
                "    say \"You walk onto the cobblestones. They're nice, if you like that sort of thing.\"; \n" +
                "    say \"There's nobody around. The wind whistles a little bit.\"; \n" +
                "and then stop. \n\n" +
                "say \"This is the middle.\".\n\n" +
                "a Coin is a kind of item. \n" +
                "it is described as \"It's a small coin.\".\n" +
                "when it is taken:\n" +
                "    say \"You got a coin!\";\n" +
                "and then stop.\n" +
                "when it is dropped:\n" +
                "    say \"You put the coin down!\";\n" +
                "and then stop.\n\n" +
                "when it is used:\n" +
                "    say \"You used the coin somehow!\";\n" +
                "and then stop.\n\n" +
                "say \"This is the end.\".\n";
    }
}
exports.TalonIde = TalonIde;
TalonIde.TalonCodeFileDescription = "Talon Code";
TalonIde.TalonCodeFileExtension = ".tln";
//# sourceMappingURL=../../ide/js/talon/TalonIde.js.map

/***/ }),

/***/ "./out/talon/common/EventType.js":
/*!***************************************!*\
  !*** ./out/talon/common/EventType.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType[EventType["None"] = 0] = "None";
    EventType[EventType["PlayerEntersPlace"] = 1] = "PlayerEntersPlace";
    EventType[EventType["PlayerExitsPlace"] = 2] = "PlayerExitsPlace";
    EventType[EventType["ItIsTaken"] = 3] = "ItIsTaken";
    EventType[EventType["ItIsDropped"] = 4] = "ItIsDropped";
    EventType[EventType["ItIsUsed"] = 5] = "ItIsUsed";
})(EventType = exports.EventType || (exports.EventType = {}));
//# sourceMappingURL=../../../ide/js/talon/common/EventType.js.map

/***/ }),

/***/ "./out/talon/common/Field.js":
/*!***********************************!*\
  !*** ./out/talon/common/Field.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Field = void 0;
class Field {
    constructor() {
        this.name = "";
        this.typeName = "";
    }
}
exports.Field = Field;
//# sourceMappingURL=../../../ide/js/talon/common/Field.js.map

/***/ }),

/***/ "./out/talon/common/Instruction.js":
/*!*****************************************!*\
  !*** ./out/talon/common/Instruction.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Instruction = void 0;
const OpCode_1 = __webpack_require__(/*! ./OpCode */ "./out/talon/common/OpCode.js");
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
    static ifTrueThen(...instructions) {
        const result = [];
        result.push(Instruction.branchRelativeIfFalse(instructions.length), ...instructions);
        return result;
    }
}
exports.Instruction = Instruction;
//# sourceMappingURL=../../../ide/js/talon/common/Instruction.js.map

/***/ }),

/***/ "./out/talon/common/Method.js":
/*!************************************!*\
  !*** ./out/talon/common/Method.js ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Method = void 0;
const EventType_1 = __webpack_require__(/*! ./EventType */ "./out/talon/common/EventType.js");
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
//# sourceMappingURL=../../../ide/js/talon/common/Method.js.map

/***/ }),

/***/ "./out/talon/common/OpCode.js":
/*!************************************!*\
  !*** ./out/talon/common/OpCode.js ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
//# sourceMappingURL=../../../ide/js/talon/common/OpCode.js.map

/***/ }),

/***/ "./out/talon/common/Parameter.js":
/*!***************************************!*\
  !*** ./out/talon/common/Parameter.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Parameter = void 0;
class Parameter {
    constructor(name, typeName) {
        this.name = name;
        this.typeName = typeName;
    }
}
exports.Parameter = Parameter;
//# sourceMappingURL=../../../ide/js/talon/common/Parameter.js.map

/***/ }),

/***/ "./out/talon/common/Type.js":
/*!**********************************!*\
  !*** ./out/talon/common/Type.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
//# sourceMappingURL=../../../ide/js/talon/common/Type.js.map

/***/ }),

/***/ "./out/talon/common/Version.js":
/*!*************************************!*\
  !*** ./out/talon/common/Version.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
//# sourceMappingURL=../../../ide/js/talon/common/Version.js.map

/***/ }),

/***/ "./out/talon/compiler/TalonCompiler.js":
/*!*********************************************!*\
  !*** ./out/talon/compiler/TalonCompiler.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TalonCompiler = void 0;
const Type_1 = __webpack_require__(/*! ../common/Type */ "./out/talon/common/Type.js");
const Method_1 = __webpack_require__(/*! ../common/Method */ "./out/talon/common/Method.js");
const Any_1 = __webpack_require__(/*! ../library/Any */ "./out/talon/library/Any.js");
const Instruction_1 = __webpack_require__(/*! ../common/Instruction */ "./out/talon/common/Instruction.js");
const EntryPointAttribute_1 = __webpack_require__(/*! ../library/EntryPointAttribute */ "./out/talon/library/EntryPointAttribute.js");
const TalonLexer_1 = __webpack_require__(/*! ./lexing/TalonLexer */ "./out/talon/compiler/lexing/TalonLexer.js");
const TalonParser_1 = __webpack_require__(/*! ./parsing/TalonParser */ "./out/talon/compiler/parsing/TalonParser.js");
const TalonSemanticAnalyzer_1 = __webpack_require__(/*! ./semantics/TalonSemanticAnalyzer */ "./out/talon/compiler/semantics/TalonSemanticAnalyzer.js");
const TalonTransformer_1 = __webpack_require__(/*! ./transforming/TalonTransformer */ "./out/talon/compiler/transforming/TalonTransformer.js");
const Version_1 = __webpack_require__(/*! ../common/Version */ "./out/talon/common/Version.js");
const CompilationError_1 = __webpack_require__(/*! ./exceptions/CompilationError */ "./out/talon/compiler/exceptions/CompilationError.js");
const Delegate_1 = __webpack_require__(/*! ../library/Delegate */ "./out/talon/library/Delegate.js");
const buildInfo = __importStar(__webpack_require__(/*! ../../build-info.json */ "./out/build-info.json"));
class TalonCompiler {
    constructor(out) {
        this.out = out;
    }
    get languageVersion() {
        return new Version_1.Version(1, 0, 0);
    }
    get version() {
        return new Version_1.Version(buildInfo.major, buildInfo.minor, buildInfo.revision);
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
//# sourceMappingURL=../../../ide/js/talon/compiler/TalonCompiler.js.map

/***/ }),

/***/ "./out/talon/compiler/exceptions/CompilationError.js":
/*!***********************************************************!*\
  !*** ./out/talon/compiler/exceptions/CompilationError.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompilationError = void 0;
class CompilationError {
    constructor(message) {
        this.message = message;
    }
}
exports.CompilationError = CompilationError;
//# sourceMappingURL=../../../../ide/js/talon/compiler/exceptions/CompilationError.js.map

/***/ }),

/***/ "./out/talon/compiler/lexing/Keywords.js":
/*!***********************************************!*\
  !*** ./out/talon/compiler/lexing/Keywords.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
Keywords.taken = "taken";
Keywords.dropped = "dropped";
Keywords.using = "using";
Keywords.used = "used";
Keywords.with = "with";
//# sourceMappingURL=../../../../ide/js/talon/compiler/lexing/Keywords.js.map

/***/ }),

/***/ "./out/talon/compiler/lexing/Punctuation.js":
/*!**************************************************!*\
  !*** ./out/talon/compiler/lexing/Punctuation.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Punctuation = void 0;
class Punctuation {
}
exports.Punctuation = Punctuation;
Punctuation.period = ".";
Punctuation.colon = ":";
Punctuation.semicolon = ";";
Punctuation.comma = ",";
//# sourceMappingURL=../../../../ide/js/talon/compiler/lexing/Punctuation.js.map

/***/ }),

/***/ "./out/talon/compiler/lexing/TalonLexer.js":
/*!*************************************************!*\
  !*** ./out/talon/compiler/lexing/TalonLexer.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TalonLexer = void 0;
const Token_1 = __webpack_require__(/*! ./Token */ "./out/talon/compiler/lexing/Token.js");
const Keywords_1 = __webpack_require__(/*! ./Keywords */ "./out/talon/compiler/lexing/Keywords.js");
const Punctuation_1 = __webpack_require__(/*! ./Punctuation */ "./out/talon/compiler/lexing/Punctuation.js");
const TokenType_1 = __webpack_require__(/*! ./TokenType */ "./out/talon/compiler/lexing/TokenType.js");
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
//# sourceMappingURL=../../../../ide/js/talon/compiler/lexing/TalonLexer.js.map

/***/ }),

/***/ "./out/talon/compiler/lexing/Token.js":
/*!********************************************!*\
  !*** ./out/talon/compiler/lexing/Token.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Token = void 0;
const TokenType_1 = __webpack_require__(/*! ./TokenType */ "./out/talon/compiler/lexing/TokenType.js");
const Place_1 = __webpack_require__(/*! ../../library/Place */ "./out/talon/library/Place.js");
const Any_1 = __webpack_require__(/*! ../../library/Any */ "./out/talon/library/Any.js");
const WorldObject_1 = __webpack_require__(/*! ../../library/WorldObject */ "./out/talon/library/WorldObject.js");
const BooleanType_1 = __webpack_require__(/*! ../../library/BooleanType */ "./out/talon/library/BooleanType.js");
const Item_1 = __webpack_require__(/*! ../../library/Item */ "./out/talon/library/Item.js");
const List_1 = __webpack_require__(/*! ../../library/List */ "./out/talon/library/List.js");
const Decoration_1 = __webpack_require__(/*! ../../library/Decoration */ "./out/talon/library/Decoration.js");
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
//# sourceMappingURL=../../../../ide/js/talon/compiler/lexing/Token.js.map

/***/ }),

/***/ "./out/talon/compiler/lexing/TokenType.js":
/*!************************************************!*\
  !*** ./out/talon/compiler/lexing/TokenType.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
//# sourceMappingURL=../../../../ide/js/talon/compiler/lexing/TokenType.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/ParseContext.js":
/*!****************************************************!*\
  !*** ./out/talon/compiler/parsing/ParseContext.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ParseContext = void 0;
const Token_1 = __webpack_require__(/*! ../lexing/Token */ "./out/talon/compiler/lexing/Token.js");
const CompilationError_1 = __webpack_require__(/*! ../exceptions/CompilationError */ "./out/talon/compiler/exceptions/CompilationError.js");
const TokenType_1 = __webpack_require__(/*! ../lexing/TokenType */ "./out/talon/compiler/lexing/TokenType.js");
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
//# sourceMappingURL=../../../../ide/js/talon/compiler/parsing/ParseContext.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/TalonParser.js":
/*!***************************************************!*\
  !*** ./out/talon/compiler/parsing/TalonParser.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TalonParser = void 0;
const ProgramVisitor_1 = __webpack_require__(/*! ./visitors/ProgramVisitor */ "./out/talon/compiler/parsing/visitors/ProgramVisitor.js");
const ParseContext_1 = __webpack_require__(/*! ./ParseContext */ "./out/talon/compiler/parsing/ParseContext.js");
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
//# sourceMappingURL=../../../../ide/js/talon/compiler/parsing/TalonParser.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/ActionsExpression.js":
/*!*********************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/ActionsExpression.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActionsExpression = void 0;
const Expression_1 = __webpack_require__(/*! ./Expression */ "./out/talon/compiler/parsing/expressions/Expression.js");
class ActionsExpression extends Expression_1.Expression {
    constructor(actions) {
        super();
        this.actions = actions;
    }
}
exports.ActionsExpression = ActionsExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/ActionsExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/BinaryExpression.js":
/*!********************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/BinaryExpression.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BinaryExpression = void 0;
const Expression_1 = __webpack_require__(/*! ./Expression */ "./out/talon/compiler/parsing/expressions/Expression.js");
class BinaryExpression extends Expression_1.Expression {
}
exports.BinaryExpression = BinaryExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/BinaryExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/ComparisonExpression.js":
/*!************************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/ComparisonExpression.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComparisonExpression = void 0;
const BinaryExpression_1 = __webpack_require__(/*! ./BinaryExpression */ "./out/talon/compiler/parsing/expressions/BinaryExpression.js");
class ComparisonExpression extends BinaryExpression_1.BinaryExpression {
    constructor(identifier, comparedTo) {
        super();
        this.left = identifier;
        this.right = comparedTo;
    }
}
exports.ComparisonExpression = ComparisonExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/ComparisonExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/ConcatenationExpression.js":
/*!***************************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/ConcatenationExpression.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConcatenationExpression = void 0;
const BinaryExpression_1 = __webpack_require__(/*! ./BinaryExpression */ "./out/talon/compiler/parsing/expressions/BinaryExpression.js");
class ConcatenationExpression extends BinaryExpression_1.BinaryExpression {
}
exports.ConcatenationExpression = ConcatenationExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/ConcatenationExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/ContainsExpression.js":
/*!**********************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/ContainsExpression.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContainsExpression = void 0;
const Expression_1 = __webpack_require__(/*! ./Expression */ "./out/talon/compiler/parsing/expressions/Expression.js");
class ContainsExpression extends Expression_1.Expression {
    constructor(targetName, count, typeName) {
        super();
        this.targetName = targetName;
        this.count = count;
        this.typeName = typeName;
    }
}
exports.ContainsExpression = ContainsExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/ContainsExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/Expression.js":
/*!**************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/Expression.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Expression = void 0;
class Expression {
}
exports.Expression = Expression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/Expression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/FieldDeclarationExpression.js":
/*!******************************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/FieldDeclarationExpression.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FieldDeclarationExpression = void 0;
const Expression_1 = __webpack_require__(/*! ./Expression */ "./out/talon/compiler/parsing/expressions/Expression.js");
class FieldDeclarationExpression extends Expression_1.Expression {
    constructor() {
        super(...arguments);
        this.name = "";
        this.typeName = "";
        this.associatedExpressions = [];
    }
}
exports.FieldDeclarationExpression = FieldDeclarationExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/FieldDeclarationExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/IdentifierExpression.js":
/*!************************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/IdentifierExpression.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IdentifierExpression = void 0;
const Expression_1 = __webpack_require__(/*! ./Expression */ "./out/talon/compiler/parsing/expressions/Expression.js");
class IdentifierExpression extends Expression_1.Expression {
    constructor(instanceName, variableName) {
        super();
        this.instanceName = instanceName;
        this.variableName = variableName;
    }
}
exports.IdentifierExpression = IdentifierExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/IdentifierExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/IfExpression.js":
/*!****************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/IfExpression.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IfExpression = void 0;
const Expression_1 = __webpack_require__(/*! ./Expression */ "./out/talon/compiler/parsing/expressions/Expression.js");
class IfExpression extends Expression_1.Expression {
    constructor(conditional, ifBlock, elseBlock) {
        super();
        this.conditional = conditional;
        this.ifBlock = ifBlock;
        this.elseBlock = elseBlock;
    }
}
exports.IfExpression = IfExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/IfExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/ListExpression.js":
/*!******************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/ListExpression.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListExpression = void 0;
const Expression_1 = __webpack_require__(/*! ./Expression */ "./out/talon/compiler/parsing/expressions/Expression.js");
class ListExpression extends Expression_1.Expression {
    constructor(items) {
        super();
        this.items = items;
    }
}
exports.ListExpression = ListExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/ListExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/LiteralExpression.js":
/*!*********************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/LiteralExpression.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LiteralExpression = void 0;
const Expression_1 = __webpack_require__(/*! ./Expression */ "./out/talon/compiler/parsing/expressions/Expression.js");
class LiteralExpression extends Expression_1.Expression {
    constructor(typeName, value) {
        super();
        this.typeName = typeName;
        this.value = value;
    }
}
exports.LiteralExpression = LiteralExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/LiteralExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/ProgramExpression.js":
/*!*********************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/ProgramExpression.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProgramExpression = void 0;
const Expression_1 = __webpack_require__(/*! ./Expression */ "./out/talon/compiler/parsing/expressions/Expression.js");
class ProgramExpression extends Expression_1.Expression {
    constructor(expressions) {
        super();
        this.expressions = expressions;
    }
}
exports.ProgramExpression = ProgramExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/ProgramExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/SayExpression.js":
/*!*****************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/SayExpression.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SayExpression = void 0;
const Expression_1 = __webpack_require__(/*! ./Expression */ "./out/talon/compiler/parsing/expressions/Expression.js");
class SayExpression extends Expression_1.Expression {
    constructor(text) {
        super();
        this.text = text;
    }
}
exports.SayExpression = SayExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/SayExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/SetVariableExpression.js":
/*!*************************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/SetVariableExpression.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetVariableExpression = void 0;
const Expression_1 = __webpack_require__(/*! ./Expression */ "./out/talon/compiler/parsing/expressions/Expression.js");
class SetVariableExpression extends Expression_1.Expression {
    constructor(instanceName, variableName, evaluationExpression) {
        super();
        this.instanceName = instanceName;
        this.variableName = variableName;
        this.evaluationExpression = evaluationExpression;
    }
}
exports.SetVariableExpression = SetVariableExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/SetVariableExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/TypeDeclarationExpression.js":
/*!*****************************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/TypeDeclarationExpression.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeDeclarationExpression = void 0;
const Expression_1 = __webpack_require__(/*! ./Expression */ "./out/talon/compiler/parsing/expressions/Expression.js");
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
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/TypeDeclarationExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/UnderstandingDeclarationExpression.js":
/*!**************************************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/UnderstandingDeclarationExpression.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnderstandingDeclarationExpression = void 0;
const Expression_1 = __webpack_require__(/*! ./Expression */ "./out/talon/compiler/parsing/expressions/Expression.js");
class UnderstandingDeclarationExpression extends Expression_1.Expression {
    constructor(value, meaning) {
        super();
        this.value = value;
        this.meaning = meaning;
    }
}
exports.UnderstandingDeclarationExpression = UnderstandingDeclarationExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/UnderstandingDeclarationExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/expressions/WhenDeclarationExpression.js":
/*!*****************************************************************************!*\
  !*** ./out/talon/compiler/parsing/expressions/WhenDeclarationExpression.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WhenDeclarationExpression = void 0;
const Expression_1 = __webpack_require__(/*! ./Expression */ "./out/talon/compiler/parsing/expressions/Expression.js");
class WhenDeclarationExpression extends Expression_1.Expression {
    constructor(actor, eventKind, actions, target) {
        super();
        this.actor = actor;
        this.eventKind = eventKind;
        this.actions = actions;
        this.target = target;
    }
}
exports.WhenDeclarationExpression = WhenDeclarationExpression;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/expressions/WhenDeclarationExpression.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/visitors/BlockExpressionVisitor.js":
/*!***********************************************************************!*\
  !*** ./out/talon/compiler/parsing/visitors/BlockExpressionVisitor.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BlockExpressionVisitor = void 0;
const Keywords_1 = __webpack_require__(/*! ../../lexing/Keywords */ "./out/talon/compiler/lexing/Keywords.js");
const ActionsExpression_1 = __webpack_require__(/*! ../expressions/ActionsExpression */ "./out/talon/compiler/parsing/expressions/ActionsExpression.js");
const ExpressionVisitor_1 = __webpack_require__(/*! ./ExpressionVisitor */ "./out/talon/compiler/parsing/visitors/ExpressionVisitor.js");
const Visitor_1 = __webpack_require__(/*! ./Visitor */ "./out/talon/compiler/parsing/visitors/Visitor.js");
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
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/visitors/BlockExpressionVisitor.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/visitors/ComparisonExpressionVisitor.js":
/*!****************************************************************************!*\
  !*** ./out/talon/compiler/parsing/visitors/ComparisonExpressionVisitor.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComparisonExpressionVisitor = void 0;
const Keywords_1 = __webpack_require__(/*! ../../lexing/Keywords */ "./out/talon/compiler/lexing/Keywords.js");
const ComparisonExpression_1 = __webpack_require__(/*! ../expressions/ComparisonExpression */ "./out/talon/compiler/parsing/expressions/ComparisonExpression.js");
const IdentifierExpression_1 = __webpack_require__(/*! ../expressions/IdentifierExpression */ "./out/talon/compiler/parsing/expressions/IdentifierExpression.js");
const ExpressionVisitor_1 = __webpack_require__(/*! ./ExpressionVisitor */ "./out/talon/compiler/parsing/visitors/ExpressionVisitor.js");
const Visitor_1 = __webpack_require__(/*! ./Visitor */ "./out/talon/compiler/parsing/visitors/Visitor.js");
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
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/visitors/ComparisonExpressionVisitor.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/visitors/EventExpressionVisitor.js":
/*!***********************************************************************!*\
  !*** ./out/talon/compiler/parsing/visitors/EventExpressionVisitor.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventExpressionVisitor = void 0;
const ExpressionVisitor_1 = __webpack_require__(/*! ./ExpressionVisitor */ "./out/talon/compiler/parsing/visitors/ExpressionVisitor.js");
const Keywords_1 = __webpack_require__(/*! ../../lexing/Keywords */ "./out/talon/compiler/lexing/Keywords.js");
const ActionsExpression_1 = __webpack_require__(/*! ../expressions/ActionsExpression */ "./out/talon/compiler/parsing/expressions/ActionsExpression.js");
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
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/visitors/EventExpressionVisitor.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/visitors/ExpressionVisitor.js":
/*!******************************************************************!*\
  !*** ./out/talon/compiler/parsing/visitors/ExpressionVisitor.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExpressionVisitor = void 0;
const Visitor_1 = __webpack_require__(/*! ./Visitor */ "./out/talon/compiler/parsing/visitors/Visitor.js");
const Keywords_1 = __webpack_require__(/*! ../../lexing/Keywords */ "./out/talon/compiler/lexing/Keywords.js");
const IfExpressionVisitor_1 = __webpack_require__(/*! ./IfExpressionVisitor */ "./out/talon/compiler/parsing/visitors/IfExpressionVisitor.js");
const CompilationError_1 = __webpack_require__(/*! ../../exceptions/CompilationError */ "./out/talon/compiler/exceptions/CompilationError.js");
const ContainsExpression_1 = __webpack_require__(/*! ../expressions/ContainsExpression */ "./out/talon/compiler/parsing/expressions/ContainsExpression.js");
const SayExpression_1 = __webpack_require__(/*! ../expressions/SayExpression */ "./out/talon/compiler/parsing/expressions/SayExpression.js");
const TokenType_1 = __webpack_require__(/*! ../../lexing/TokenType */ "./out/talon/compiler/lexing/TokenType.js");
const SetVariableExpression_1 = __webpack_require__(/*! ../expressions/SetVariableExpression */ "./out/talon/compiler/parsing/expressions/SetVariableExpression.js");
const LiteralExpression_1 = __webpack_require__(/*! ../expressions/LiteralExpression */ "./out/talon/compiler/parsing/expressions/LiteralExpression.js");
const NumberType_1 = __webpack_require__(/*! ../../../library/NumberType */ "./out/talon/library/NumberType.js");
const StringType_1 = __webpack_require__(/*! ../../../library/StringType */ "./out/talon/library/StringType.js");
const ListExpression_1 = __webpack_require__(/*! ../expressions/ListExpression */ "./out/talon/compiler/parsing/expressions/ListExpression.js");
const ComparisonExpressionVisitor_1 = __webpack_require__(/*! ./ComparisonExpressionVisitor */ "./out/talon/compiler/parsing/visitors/ComparisonExpressionVisitor.js");
const BooleanType_1 = __webpack_require__(/*! ../../../library/BooleanType */ "./out/talon/library/BooleanType.js");
const Convert_1 = __webpack_require__(/*! ../../../library/Convert */ "./out/talon/library/Convert.js");
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
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/visitors/ExpressionVisitor.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/visitors/FieldDeclarationVisitor.js":
/*!************************************************************************!*\
  !*** ./out/talon/compiler/parsing/visitors/FieldDeclarationVisitor.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FieldDeclarationVisitor = void 0;
const Visitor_1 = __webpack_require__(/*! ./Visitor */ "./out/talon/compiler/parsing/visitors/Visitor.js");
const Keywords_1 = __webpack_require__(/*! ../../lexing/Keywords */ "./out/talon/compiler/lexing/Keywords.js");
const FieldDeclarationExpression_1 = __webpack_require__(/*! ../expressions/FieldDeclarationExpression */ "./out/talon/compiler/parsing/expressions/FieldDeclarationExpression.js");
const Place_1 = __webpack_require__(/*! ../../../library/Place */ "./out/talon/library/Place.js");
const BooleanType_1 = __webpack_require__(/*! ../../../library/BooleanType */ "./out/talon/library/BooleanType.js");
const CompilationError_1 = __webpack_require__(/*! ../../exceptions/CompilationError */ "./out/talon/compiler/exceptions/CompilationError.js");
const WorldObject_1 = __webpack_require__(/*! ../../../library/WorldObject */ "./out/talon/library/WorldObject.js");
const StringType_1 = __webpack_require__(/*! ../../../library/StringType */ "./out/talon/library/StringType.js");
const List_1 = __webpack_require__(/*! ../../../library/List */ "./out/talon/library/List.js");
const ExpressionVisitor_1 = __webpack_require__(/*! ./ExpressionVisitor */ "./out/talon/compiler/parsing/visitors/ExpressionVisitor.js");
const ConcatenationExpression_1 = __webpack_require__(/*! ../expressions/ConcatenationExpression */ "./out/talon/compiler/parsing/expressions/ConcatenationExpression.js");
const TokenType_1 = __webpack_require__(/*! ../../lexing/TokenType */ "./out/talon/compiler/lexing/TokenType.js");
const NumberType_1 = __webpack_require__(/*! ../../../library/NumberType */ "./out/talon/library/NumberType.js");
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
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/visitors/FieldDeclarationVisitor.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/visitors/IfExpressionVisitor.js":
/*!********************************************************************!*\
  !*** ./out/talon/compiler/parsing/visitors/IfExpressionVisitor.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IfExpressionVisitor = void 0;
const Visitor_1 = __webpack_require__(/*! ./Visitor */ "./out/talon/compiler/parsing/visitors/Visitor.js");
const Keywords_1 = __webpack_require__(/*! ../../lexing/Keywords */ "./out/talon/compiler/lexing/Keywords.js");
const ExpressionVisitor_1 = __webpack_require__(/*! ./ExpressionVisitor */ "./out/talon/compiler/parsing/visitors/ExpressionVisitor.js");
const IfExpression_1 = __webpack_require__(/*! ../expressions/IfExpression */ "./out/talon/compiler/parsing/expressions/IfExpression.js");
const BlockExpressionVisitor_1 = __webpack_require__(/*! ./BlockExpressionVisitor */ "./out/talon/compiler/parsing/visitors/BlockExpressionVisitor.js");
const CompilationError_1 = __webpack_require__(/*! ../../exceptions/CompilationError */ "./out/talon/compiler/exceptions/CompilationError.js");
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
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/visitors/IfExpressionVisitor.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/visitors/ProgramVisitor.js":
/*!***************************************************************!*\
  !*** ./out/talon/compiler/parsing/visitors/ProgramVisitor.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProgramVisitor = void 0;
const Visitor_1 = __webpack_require__(/*! ./Visitor */ "./out/talon/compiler/parsing/visitors/Visitor.js");
const Keywords_1 = __webpack_require__(/*! ../../lexing/Keywords */ "./out/talon/compiler/lexing/Keywords.js");
const TypeDeclarationVisitor_1 = __webpack_require__(/*! ./TypeDeclarationVisitor */ "./out/talon/compiler/parsing/visitors/TypeDeclarationVisitor.js");
const ProgramExpression_1 = __webpack_require__(/*! ../expressions/ProgramExpression */ "./out/talon/compiler/parsing/expressions/ProgramExpression.js");
const CompilationError_1 = __webpack_require__(/*! ../../exceptions/CompilationError */ "./out/talon/compiler/exceptions/CompilationError.js");
const UnderstandingDeclarationVisitor_1 = __webpack_require__(/*! ./UnderstandingDeclarationVisitor */ "./out/talon/compiler/parsing/visitors/UnderstandingDeclarationVisitor.js");
const SayExpressionVisitor_1 = __webpack_require__(/*! ./SayExpressionVisitor */ "./out/talon/compiler/parsing/visitors/SayExpressionVisitor.js");
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
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/visitors/ProgramVisitor.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/visitors/SayExpressionVisitor.js":
/*!*********************************************************************!*\
  !*** ./out/talon/compiler/parsing/visitors/SayExpressionVisitor.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SayExpressionVisitor = void 0;
const Visitor_1 = __webpack_require__(/*! ./Visitor */ "./out/talon/compiler/parsing/visitors/Visitor.js");
const Keywords_1 = __webpack_require__(/*! ../../lexing/Keywords */ "./out/talon/compiler/lexing/Keywords.js");
const SayExpression_1 = __webpack_require__(/*! ../expressions/SayExpression */ "./out/talon/compiler/parsing/expressions/SayExpression.js");
class SayExpressionVisitor extends Visitor_1.Visitor {
    visit(context) {
        context.expect(Keywords_1.Keywords.say);
        const text = context.expectString();
        return new SayExpression_1.SayExpression(text.value);
    }
}
exports.SayExpressionVisitor = SayExpressionVisitor;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/visitors/SayExpressionVisitor.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/visitors/TypeDeclarationVisitor.js":
/*!***********************************************************************!*\
  !*** ./out/talon/compiler/parsing/visitors/TypeDeclarationVisitor.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeDeclarationVisitor = void 0;
const Visitor_1 = __webpack_require__(/*! ./Visitor */ "./out/talon/compiler/parsing/visitors/Visitor.js");
const Keywords_1 = __webpack_require__(/*! ../../lexing/Keywords */ "./out/talon/compiler/lexing/Keywords.js");
const TypeDeclarationExpression_1 = __webpack_require__(/*! ../expressions/TypeDeclarationExpression */ "./out/talon/compiler/parsing/expressions/TypeDeclarationExpression.js");
const FieldDeclarationVisitor_1 = __webpack_require__(/*! ./FieldDeclarationVisitor */ "./out/talon/compiler/parsing/visitors/FieldDeclarationVisitor.js");
const WhenDeclarationVisitor_1 = __webpack_require__(/*! ./WhenDeclarationVisitor */ "./out/talon/compiler/parsing/visitors/WhenDeclarationVisitor.js");
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
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/visitors/TypeDeclarationVisitor.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/visitors/UnderstandingDeclarationVisitor.js":
/*!********************************************************************************!*\
  !*** ./out/talon/compiler/parsing/visitors/UnderstandingDeclarationVisitor.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnderstandingDeclarationVisitor = void 0;
const Visitor_1 = __webpack_require__(/*! ./Visitor */ "./out/talon/compiler/parsing/visitors/Visitor.js");
const Keywords_1 = __webpack_require__(/*! ../../lexing/Keywords */ "./out/talon/compiler/lexing/Keywords.js");
const UnderstandingDeclarationExpression_1 = __webpack_require__(/*! ../expressions/UnderstandingDeclarationExpression */ "./out/talon/compiler/parsing/expressions/UnderstandingDeclarationExpression.js");
class UnderstandingDeclarationVisitor extends Visitor_1.Visitor {
    visit(context) {
        context.expect(Keywords_1.Keywords.understand);
        const value = context.expectString();
        context.expect(Keywords_1.Keywords.as);
        const meaning = context.expectAnyOf(Keywords_1.Keywords.describing, Keywords_1.Keywords.moving, Keywords_1.Keywords.directions, Keywords_1.Keywords.taking, Keywords_1.Keywords.inventory, Keywords_1.Keywords.dropping, Keywords_1.Keywords.using);
        context.expectTerminator();
        return new UnderstandingDeclarationExpression_1.UnderstandingDeclarationExpression(value.value, meaning.value);
    }
}
exports.UnderstandingDeclarationVisitor = UnderstandingDeclarationVisitor;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/visitors/UnderstandingDeclarationVisitor.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/visitors/Visitor.js":
/*!********************************************************!*\
  !*** ./out/talon/compiler/parsing/visitors/Visitor.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Visitor = void 0;
class Visitor {
}
exports.Visitor = Visitor;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/visitors/Visitor.js.map

/***/ }),

/***/ "./out/talon/compiler/parsing/visitors/WhenDeclarationVisitor.js":
/*!***********************************************************************!*\
  !*** ./out/talon/compiler/parsing/visitors/WhenDeclarationVisitor.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WhenDeclarationVisitor = void 0;
const Visitor_1 = __webpack_require__(/*! ./Visitor */ "./out/talon/compiler/parsing/visitors/Visitor.js");
const Keywords_1 = __webpack_require__(/*! ../../lexing/Keywords */ "./out/talon/compiler/lexing/Keywords.js");
const WhenDeclarationExpression_1 = __webpack_require__(/*! ../expressions/WhenDeclarationExpression */ "./out/talon/compiler/parsing/expressions/WhenDeclarationExpression.js");
const EventExpressionVisitor_1 = __webpack_require__(/*! ./EventExpressionVisitor */ "./out/talon/compiler/parsing/visitors/EventExpressionVisitor.js");
class WhenDeclarationVisitor extends Visitor_1.Visitor {
    visit(context) {
        context.expect(Keywords_1.Keywords.when);
        let eventKind;
        let target = undefined;
        if (context.is(Keywords_1.Keywords.it)) {
            context.expect(Keywords_1.Keywords.it);
            context.expect(Keywords_1.Keywords.is);
            if (context.is(Keywords_1.Keywords.used)) {
                eventKind = context.expect(Keywords_1.Keywords.used);
                if (context.is(Keywords_1.Keywords.with)) {
                    context.expect(Keywords_1.Keywords.with);
                    context.expectAnyOf(Keywords_1.Keywords.a, Keywords_1.Keywords.an);
                    target = context.expectIdentifier();
                }
            }
            else {
                eventKind = context.expectAnyOf(Keywords_1.Keywords.taken, Keywords_1.Keywords.dropped);
            }
        }
        else {
            context.expect(Keywords_1.Keywords.the);
            context.expect(Keywords_1.Keywords.player);
            eventKind = context.expectAnyOf(Keywords_1.Keywords.enters, Keywords_1.Keywords.exits);
        }
        context.expectOpenMethodBlock();
        const actionsVisitor = new EventExpressionVisitor_1.EventExpressionVisitor();
        const actions = actionsVisitor.visit(context);
        return new WhenDeclarationExpression_1.WhenDeclarationExpression(Keywords_1.Keywords.player, eventKind.value, actions, target === null || target === void 0 ? void 0 : target.value);
    }
}
exports.WhenDeclarationVisitor = WhenDeclarationVisitor;
//# sourceMappingURL=../../../../../ide/js/talon/compiler/parsing/visitors/WhenDeclarationVisitor.js.map

/***/ }),

/***/ "./out/talon/compiler/semantics/TalonSemanticAnalyzer.js":
/*!***************************************************************!*\
  !*** ./out/talon/compiler/semantics/TalonSemanticAnalyzer.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TalonSemanticAnalyzer = void 0;
const ProgramExpression_1 = __webpack_require__(/*! ../parsing/expressions/ProgramExpression */ "./out/talon/compiler/parsing/expressions/ProgramExpression.js");
const TypeDeclarationExpression_1 = __webpack_require__(/*! ../parsing/expressions/TypeDeclarationExpression */ "./out/talon/compiler/parsing/expressions/TypeDeclarationExpression.js");
const Token_1 = __webpack_require__(/*! ../lexing/Token */ "./out/talon/compiler/lexing/Token.js");
const TokenType_1 = __webpack_require__(/*! ../lexing/TokenType */ "./out/talon/compiler/lexing/TokenType.js");
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
//# sourceMappingURL=../../../../ide/js/talon/compiler/semantics/TalonSemanticAnalyzer.js.map

/***/ }),

/***/ "./out/talon/compiler/transforming/ExpressionTransformationMode.js":
/*!*************************************************************************!*\
  !*** ./out/talon/compiler/transforming/ExpressionTransformationMode.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExpressionTransformationMode = void 0;
var ExpressionTransformationMode;
(function (ExpressionTransformationMode) {
    ExpressionTransformationMode[ExpressionTransformationMode["None"] = 0] = "None";
    ExpressionTransformationMode[ExpressionTransformationMode["IgnoreResultsOfSayExpression"] = 1] = "IgnoreResultsOfSayExpression";
})(ExpressionTransformationMode = exports.ExpressionTransformationMode || (exports.ExpressionTransformationMode = {}));
//# sourceMappingURL=../../../../ide/js/talon/compiler/transforming/ExpressionTransformationMode.js.map

/***/ }),

/***/ "./out/talon/compiler/transforming/TalonTransformer.js":
/*!*************************************************************!*\
  !*** ./out/talon/compiler/transforming/TalonTransformer.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TalonTransformer = void 0;
const Type_1 = __webpack_require__(/*! ../../common/Type */ "./out/talon/common/Type.js");
const ProgramExpression_1 = __webpack_require__(/*! ../parsing/expressions/ProgramExpression */ "./out/talon/compiler/parsing/expressions/ProgramExpression.js");
const CompilationError_1 = __webpack_require__(/*! ../exceptions/CompilationError */ "./out/talon/compiler/exceptions/CompilationError.js");
const TypeDeclarationExpression_1 = __webpack_require__(/*! ../parsing/expressions/TypeDeclarationExpression */ "./out/talon/compiler/parsing/expressions/TypeDeclarationExpression.js");
const UnderstandingDeclarationExpression_1 = __webpack_require__(/*! ../parsing/expressions/UnderstandingDeclarationExpression */ "./out/talon/compiler/parsing/expressions/UnderstandingDeclarationExpression.js");
const Understanding_1 = __webpack_require__(/*! ../../library/Understanding */ "./out/talon/library/Understanding.js");
const Field_1 = __webpack_require__(/*! ../../common/Field */ "./out/talon/common/Field.js");
const Any_1 = __webpack_require__(/*! ../../library/Any */ "./out/talon/library/Any.js");
const WorldObject_1 = __webpack_require__(/*! ../../library/WorldObject */ "./out/talon/library/WorldObject.js");
const Place_1 = __webpack_require__(/*! ../../library/Place */ "./out/talon/library/Place.js");
const BooleanType_1 = __webpack_require__(/*! ../../library/BooleanType */ "./out/talon/library/BooleanType.js");
const StringType_1 = __webpack_require__(/*! ../../library/StringType */ "./out/talon/library/StringType.js");
const Item_1 = __webpack_require__(/*! ../../library/Item */ "./out/talon/library/Item.js");
const NumberType_1 = __webpack_require__(/*! ../../library/NumberType */ "./out/talon/library/NumberType.js");
const List_1 = __webpack_require__(/*! ../../library/List */ "./out/talon/library/List.js");
const Player_1 = __webpack_require__(/*! ../../library/Player */ "./out/talon/library/Player.js");
const SayExpression_1 = __webpack_require__(/*! ../parsing/expressions/SayExpression */ "./out/talon/compiler/parsing/expressions/SayExpression.js");
const Method_1 = __webpack_require__(/*! ../../common/Method */ "./out/talon/common/Method.js");
const Say_1 = __webpack_require__(/*! ../../library/Say */ "./out/talon/library/Say.js");
const Instruction_1 = __webpack_require__(/*! ../../common/Instruction */ "./out/talon/common/Instruction.js");
const Parameter_1 = __webpack_require__(/*! ../../common/Parameter */ "./out/talon/common/Parameter.js");
const IfExpression_1 = __webpack_require__(/*! ../parsing/expressions/IfExpression */ "./out/talon/compiler/parsing/expressions/IfExpression.js");
const ConcatenationExpression_1 = __webpack_require__(/*! ../parsing/expressions/ConcatenationExpression */ "./out/talon/compiler/parsing/expressions/ConcatenationExpression.js");
const ContainsExpression_1 = __webpack_require__(/*! ../parsing/expressions/ContainsExpression */ "./out/talon/compiler/parsing/expressions/ContainsExpression.js");
const FieldDeclarationExpression_1 = __webpack_require__(/*! ../parsing/expressions/FieldDeclarationExpression */ "./out/talon/compiler/parsing/expressions/FieldDeclarationExpression.js");
const ActionsExpression_1 = __webpack_require__(/*! ../parsing/expressions/ActionsExpression */ "./out/talon/compiler/parsing/expressions/ActionsExpression.js");
const Keywords_1 = __webpack_require__(/*! ../lexing/Keywords */ "./out/talon/compiler/lexing/Keywords.js");
const EventType_1 = __webpack_require__(/*! ../../common/EventType */ "./out/talon/common/EventType.js");
const ExpressionTransformationMode_1 = __webpack_require__(/*! ./ExpressionTransformationMode */ "./out/talon/compiler/transforming/ExpressionTransformationMode.js");
const SetVariableExpression_1 = __webpack_require__(/*! ../parsing/expressions/SetVariableExpression */ "./out/talon/compiler/parsing/expressions/SetVariableExpression.js");
const LiteralExpression_1 = __webpack_require__(/*! ../parsing/expressions/LiteralExpression */ "./out/talon/compiler/parsing/expressions/LiteralExpression.js");
const Decoration_1 = __webpack_require__(/*! ../../library/Decoration */ "./out/talon/library/Decoration.js");
const ComparisonExpression_1 = __webpack_require__(/*! ../parsing/expressions/ComparisonExpression */ "./out/talon/compiler/parsing/expressions/ComparisonExpression.js");
const IdentifierExpression_1 = __webpack_require__(/*! ../parsing/expressions/IdentifierExpression */ "./out/talon/compiler/parsing/expressions/IdentifierExpression.js");
const Convert_1 = __webpack_require__(/*! ../../library/Convert */ "./out/talon/library/Convert.js");
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
                        observe.body.push(Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadProperty(WorldObject_1.WorldObject.visible), ...Instruction_1.Instruction.ifTrueThen(Instruction_1.Instruction.loadThis(), Instruction_1.Instruction.loadProperty(WorldObject_1.WorldObject.observation), Instruction_1.Instruction.return()), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.return());
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
                            if (event.target) {
                                method.parameters.push(new Parameter_1.Parameter(WorldObject_1.WorldObject.contextParameter, event.target));
                            }
                            duplicateEventCount++;
                            const actions = event.actions;
                            for (const action of actions.actions) {
                                const body = this.transformExpression(action, ExpressionTransformationMode_1.ExpressionTransformationMode.IgnoreResultsOfSayExpression);
                                method.body.push(...body);
                            }
                            method.body.push(
                            // Instruction.loadString(''),
                            // Instruction.print(),
                            Instruction_1.Instruction.return());
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
            case Keywords_1.Keywords.taken: {
                return EventType_1.EventType.ItIsTaken;
            }
            case Keywords_1.Keywords.dropped: {
                return EventType_1.EventType.ItIsDropped;
            }
            case Keywords_1.Keywords.used: {
                return EventType_1.EventType.ItIsUsed;
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
//# sourceMappingURL=../../../../ide/js/talon/compiler/transforming/TalonTransformer.js.map

/***/ }),

/***/ "./out/talon/ide/AnalysisCoordinator.js":
/*!**********************************************!*\
  !*** ./out/talon/ide/AnalysisCoordinator.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
//# sourceMappingURL=../../../ide/js/talon/ide/AnalysisCoordinator.js.map

/***/ }),

/***/ "./out/talon/ide/CaretPosition.js":
/*!****************************************!*\
  !*** ./out/talon/ide/CaretPosition.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CaretPosition = void 0;
class CaretPosition {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
}
exports.CaretPosition = CaretPosition;
//# sourceMappingURL=../../../ide/js/talon/ide/CaretPosition.js.map

/***/ }),

/***/ "./out/talon/ide/analyzers/CodePaneAnalyzer.js":
/*!*****************************************************!*\
  !*** ./out/talon/ide/analyzers/CodePaneAnalyzer.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CodePaneAnalyzer = void 0;
const CaretPosition_1 = __webpack_require__(/*! ../CaretPosition */ "./out/talon/ide/CaretPosition.js");
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
//# sourceMappingURL=../../../../ide/js/talon/ide/analyzers/CodePaneAnalyzer.js.map

/***/ }),

/***/ "./out/talon/ide/formatters/CodePaneStyleFormatter.js":
/*!************************************************************!*\
  !*** ./out/talon/ide/formatters/CodePaneStyleFormatter.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
//# sourceMappingURL=../../../../ide/js/talon/ide/formatters/CodePaneStyleFormatter.js.map

/***/ }),

/***/ "./out/talon/library/Any.js":
/*!**********************************!*\
  !*** ./out/talon/library/Any.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Any = void 0;
const ExternCall_1 = __webpack_require__(/*! ./ExternCall */ "./out/talon/library/ExternCall.js");
class Any {
}
exports.Any = Any;
Any.parentTypeName = "";
Any.typeName = "~any";
Any.main = "~main";
Any.externToString = ExternCall_1.ExternCall.of("~toString");
//# sourceMappingURL=../../../ide/js/talon/library/Any.js.map

/***/ }),

/***/ "./out/talon/library/BooleanType.js":
/*!******************************************!*\
  !*** ./out/talon/library/BooleanType.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BooleanType = void 0;
const Any_1 = __webpack_require__(/*! ./Any */ "./out/talon/library/Any.js");
class BooleanType {
}
exports.BooleanType = BooleanType;
BooleanType.parentTypeName = Any_1.Any.typeName;
BooleanType.typeName = "~boolean";
//# sourceMappingURL=../../../ide/js/talon/library/BooleanType.js.map

/***/ }),

/***/ "./out/talon/library/Convert.js":
/*!**************************************!*\
  !*** ./out/talon/library/Convert.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Convert = void 0;
const Keywords_1 = __webpack_require__(/*! ../compiler/lexing/Keywords */ "./out/talon/compiler/lexing/Keywords.js");
class Convert {
    static stringToNumber(value) {
        return Number(value);
    }
    static stringToBoolean(value) {
        return value.toLowerCase() == Keywords_1.Keywords.true;
    }
}
exports.Convert = Convert;
//# sourceMappingURL=../../../ide/js/talon/library/Convert.js.map

/***/ }),

/***/ "./out/talon/library/Decoration.js":
/*!*****************************************!*\
  !*** ./out/talon/library/Decoration.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Decoration = void 0;
const WorldObject_1 = __webpack_require__(/*! ./WorldObject */ "./out/talon/library/WorldObject.js");
class Decoration {
}
exports.Decoration = Decoration;
Decoration.parentTypeName = WorldObject_1.WorldObject.typeName;
Decoration.typeName = "~decoration";
//# sourceMappingURL=../../../ide/js/talon/library/Decoration.js.map

/***/ }),

/***/ "./out/talon/library/Delegate.js":
/*!***************************************!*\
  !*** ./out/talon/library/Delegate.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Delegate = void 0;
const Any_1 = __webpack_require__(/*! ./Any */ "./out/talon/library/Any.js");
class Delegate {
}
exports.Delegate = Delegate;
Delegate.typeName = "~delegate";
Delegate.parentTypeName = Any_1.Any.typeName;
//# sourceMappingURL=../../../ide/js/talon/library/Delegate.js.map

/***/ }),

/***/ "./out/talon/library/EntryPointAttribute.js":
/*!**************************************************!*\
  !*** ./out/talon/library/EntryPointAttribute.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntryPointAttribute = void 0;
class EntryPointAttribute {
    constructor() {
        this.name = "~entryPoint";
    }
}
exports.EntryPointAttribute = EntryPointAttribute;
//# sourceMappingURL=../../../ide/js/talon/library/EntryPointAttribute.js.map

/***/ }),

/***/ "./out/talon/library/ExternCall.js":
/*!*****************************************!*\
  !*** ./out/talon/library/ExternCall.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
//# sourceMappingURL=../../../ide/js/talon/library/ExternCall.js.map

/***/ }),

/***/ "./out/talon/library/Item.js":
/*!***********************************!*\
  !*** ./out/talon/library/Item.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Item = void 0;
const WorldObject_1 = __webpack_require__(/*! ./WorldObject */ "./out/talon/library/WorldObject.js");
class Item {
}
exports.Item = Item;
Item.typeName = "~item";
Item.parentTypeName = WorldObject_1.WorldObject.typeName;
//# sourceMappingURL=../../../ide/js/talon/library/Item.js.map

/***/ }),

/***/ "./out/talon/library/List.js":
/*!***********************************!*\
  !*** ./out/talon/library/List.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.List = void 0;
const Any_1 = __webpack_require__(/*! ./Any */ "./out/talon/library/Any.js");
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
//# sourceMappingURL=../../../ide/js/talon/library/List.js.map

/***/ }),

/***/ "./out/talon/library/NumberType.js":
/*!*****************************************!*\
  !*** ./out/talon/library/NumberType.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NumberType = void 0;
const Any_1 = __webpack_require__(/*! ./Any */ "./out/talon/library/Any.js");
class NumberType {
}
exports.NumberType = NumberType;
NumberType.typeName = "~number";
NumberType.parentTypeName = Any_1.Any.typeName;
//# sourceMappingURL=../../../ide/js/talon/library/NumberType.js.map

/***/ }),

/***/ "./out/talon/library/Place.js":
/*!************************************!*\
  !*** ./out/talon/library/Place.js ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Place = void 0;
const WorldObject_1 = __webpack_require__(/*! ./WorldObject */ "./out/talon/library/WorldObject.js");
class Place {
}
exports.Place = Place;
Place.parentTypeName = WorldObject_1.WorldObject.typeName;
Place.typeName = "~place";
Place.isPlayerStart = "~isPlayerStart";
//# sourceMappingURL=../../../ide/js/talon/library/Place.js.map

/***/ }),

/***/ "./out/talon/library/Player.js":
/*!*************************************!*\
  !*** ./out/talon/library/Player.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = void 0;
const WorldObject_1 = __webpack_require__(/*! ./WorldObject */ "./out/talon/library/WorldObject.js");
class Player {
}
exports.Player = Player;
Player.typeName = "~player";
Player.parentTypeName = WorldObject_1.WorldObject.typeName;
//# sourceMappingURL=../../../ide/js/talon/library/Player.js.map

/***/ }),

/***/ "./out/talon/library/Say.js":
/*!**********************************!*\
  !*** ./out/talon/library/Say.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Say = void 0;
const Any_1 = __webpack_require__(/*! ./Any */ "./out/talon/library/Any.js");
class Say {
}
exports.Say = Say;
Say.typeName = "~say";
Say.parentTypeName = Any_1.Any.typeName;
//# sourceMappingURL=../../../ide/js/talon/library/Say.js.map

/***/ }),

/***/ "./out/talon/library/StringType.js":
/*!*****************************************!*\
  !*** ./out/talon/library/StringType.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StringType = void 0;
const Any_1 = __webpack_require__(/*! ./Any */ "./out/talon/library/Any.js");
class StringType {
}
exports.StringType = StringType;
StringType.parentTypeName = Any_1.Any.typeName;
StringType.typeName = "~string";
//# sourceMappingURL=../../../ide/js/talon/library/StringType.js.map

/***/ }),

/***/ "./out/talon/library/Understanding.js":
/*!********************************************!*\
  !*** ./out/talon/library/Understanding.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Understanding = void 0;
const Any_1 = __webpack_require__(/*! ./Any */ "./out/talon/library/Any.js");
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
Understanding.using = "~using";
Understanding.action = "~action";
Understanding.meaning = "~meaning";
//# sourceMappingURL=../../../ide/js/talon/library/Understanding.js.map

/***/ }),

/***/ "./out/talon/library/WorldObject.js":
/*!******************************************!*\
  !*** ./out/talon/library/WorldObject.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorldObject = void 0;
const Any_1 = __webpack_require__(/*! ./Any */ "./out/talon/library/Any.js");
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
WorldObject.contextParameter = "~context";
//# sourceMappingURL=../../../ide/js/talon/library/WorldObject.js.map

/***/ }),

/***/ "./out/talon/runtime/EvaluationResult.js":
/*!***********************************************!*\
  !*** ./out/talon/runtime/EvaluationResult.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EvaluationResult = void 0;
var EvaluationResult;
(function (EvaluationResult) {
    EvaluationResult[EvaluationResult["Continue"] = 0] = "Continue";
    EvaluationResult[EvaluationResult["SuspendForInput"] = 1] = "SuspendForInput";
})(EvaluationResult = exports.EvaluationResult || (exports.EvaluationResult = {}));
//# sourceMappingURL=../../../ide/js/talon/runtime/EvaluationResult.js.map

/***/ }),

/***/ "./out/talon/runtime/MethodActivation.js":
/*!***********************************************!*\
  !*** ./out/talon/runtime/MethodActivation.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MethodActivation = void 0;
const StackFrame_1 = __webpack_require__(/*! ./StackFrame */ "./out/talon/runtime/StackFrame.js");
const RuntimeError_1 = __webpack_require__(/*! ./errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
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
//# sourceMappingURL=../../../ide/js/talon/runtime/MethodActivation.js.map

/***/ }),

/***/ "./out/talon/runtime/OpCodeHandler.js":
/*!********************************************!*\
  !*** ./out/talon/runtime/OpCodeHandler.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OpCodeHandler = void 0;
const EvaluationResult_1 = __webpack_require__(/*! ./EvaluationResult */ "./out/talon/runtime/EvaluationResult.js");
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
//# sourceMappingURL=../../../ide/js/talon/runtime/OpCodeHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/RuntimeState.js":
/*!*******************************************!*\
  !*** ./out/talon/runtime/RuntimeState.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeState = void 0;
var RuntimeState;
(function (RuntimeState) {
    RuntimeState[RuntimeState["Stopped"] = 0] = "Stopped";
    RuntimeState[RuntimeState["Loaded"] = 1] = "Loaded";
    RuntimeState[RuntimeState["Started"] = 2] = "Started";
})(RuntimeState = exports.RuntimeState || (exports.RuntimeState = {}));
//# sourceMappingURL=../../../ide/js/talon/runtime/RuntimeState.js.map

/***/ }),

/***/ "./out/talon/runtime/StackFrame.js":
/*!*****************************************!*\
  !*** ./out/talon/runtime/StackFrame.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StackFrame = void 0;
const Variable_1 = __webpack_require__(/*! ./library/Variable */ "./out/talon/runtime/library/Variable.js");
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
//# sourceMappingURL=../../../ide/js/talon/runtime/StackFrame.js.map

/***/ }),

/***/ "./out/talon/runtime/TalonRuntime.js":
/*!*******************************************!*\
  !*** ./out/talon/runtime/TalonRuntime.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TalonRuntime = void 0;
const Thread_1 = __webpack_require__(/*! ./Thread */ "./out/talon/runtime/Thread.js");
const EntryPointAttribute_1 = __webpack_require__(/*! ../library/EntryPointAttribute */ "./out/talon/library/EntryPointAttribute.js");
const Any_1 = __webpack_require__(/*! ../library/Any */ "./out/talon/library/Any.js");
const MethodActivation_1 = __webpack_require__(/*! ./MethodActivation */ "./out/talon/runtime/MethodActivation.js");
const EvaluationResult_1 = __webpack_require__(/*! ./EvaluationResult */ "./out/talon/runtime/EvaluationResult.js");
const OpCode_1 = __webpack_require__(/*! ../common/OpCode */ "./out/talon/common/OpCode.js");
const PrintHandler_1 = __webpack_require__(/*! ./handlers/PrintHandler */ "./out/talon/runtime/handlers/PrintHandler.js");
const NoOpHandler_1 = __webpack_require__(/*! ./handlers/NoOpHandler */ "./out/talon/runtime/handlers/NoOpHandler.js");
const LoadStringHandler_1 = __webpack_require__(/*! ./handlers/LoadStringHandler */ "./out/talon/runtime/handlers/LoadStringHandler.js");
const NewInstanceHandler_1 = __webpack_require__(/*! ./handlers/NewInstanceHandler */ "./out/talon/runtime/handlers/NewInstanceHandler.js");
const Memory_1 = __webpack_require__(/*! ./common/Memory */ "./out/talon/runtime/common/Memory.js");
const ReadInputHandler_1 = __webpack_require__(/*! ./handlers/ReadInputHandler */ "./out/talon/runtime/handlers/ReadInputHandler.js");
const ParseCommandHandler_1 = __webpack_require__(/*! ./handlers/ParseCommandHandler */ "./out/talon/runtime/handlers/ParseCommandHandler.js");
const GoToHandler_1 = __webpack_require__(/*! ./handlers/GoToHandler */ "./out/talon/runtime/handlers/GoToHandler.js");
const HandleCommandHandler_1 = __webpack_require__(/*! ./handlers/HandleCommandHandler */ "./out/talon/runtime/handlers/HandleCommandHandler.js");
const Place_1 = __webpack_require__(/*! ../library/Place */ "./out/talon/library/Place.js");
const Player_1 = __webpack_require__(/*! ../library/Player */ "./out/talon/library/Player.js");
const ReturnHandler_1 = __webpack_require__(/*! ./handlers/ReturnHandler */ "./out/talon/runtime/handlers/ReturnHandler.js");
const StaticCallHandler_1 = __webpack_require__(/*! ./handlers/StaticCallHandler */ "./out/talon/runtime/handlers/StaticCallHandler.js");
const RuntimeError_1 = __webpack_require__(/*! ./errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const LoadInstanceHandler_1 = __webpack_require__(/*! ./handlers/LoadInstanceHandler */ "./out/talon/runtime/handlers/LoadInstanceHandler.js");
const LoadNumberHandler_1 = __webpack_require__(/*! ./handlers/LoadNumberHandler */ "./out/talon/runtime/handlers/LoadNumberHandler.js");
const InstanceCallHandler_1 = __webpack_require__(/*! ./handlers/InstanceCallHandler */ "./out/talon/runtime/handlers/InstanceCallHandler.js");
const LoadPropertyHandler_1 = __webpack_require__(/*! ./handlers/LoadPropertyHandler */ "./out/talon/runtime/handlers/LoadPropertyHandler.js");
const LoadFieldHandler_1 = __webpack_require__(/*! ./handlers/LoadFieldHandler */ "./out/talon/runtime/handlers/LoadFieldHandler.js");
const ExternalCallHandler_1 = __webpack_require__(/*! ./handlers/ExternalCallHandler */ "./out/talon/runtime/handlers/ExternalCallHandler.js");
const LoadLocalHandler_1 = __webpack_require__(/*! ./handlers/LoadLocalHandler */ "./out/talon/runtime/handlers/LoadLocalHandler.js");
const LoadThisHandler_1 = __webpack_require__(/*! ./handlers/LoadThisHandler */ "./out/talon/runtime/handlers/LoadThisHandler.js");
const BranchRelativeHandler_1 = __webpack_require__(/*! ./handlers/BranchRelativeHandler */ "./out/talon/runtime/handlers/BranchRelativeHandler.js");
const BranchRelativeIfFalseHandler_1 = __webpack_require__(/*! ./handlers/BranchRelativeIfFalseHandler */ "./out/talon/runtime/handlers/BranchRelativeIfFalseHandler.js");
const ConcatenateHandler_1 = __webpack_require__(/*! ./handlers/ConcatenateHandler */ "./out/talon/runtime/handlers/ConcatenateHandler.js");
const AssignVariableHandler_1 = __webpack_require__(/*! ./handlers/AssignVariableHandler */ "./out/talon/runtime/handlers/AssignVariableHandler.js");
const TypeOfHandler_1 = __webpack_require__(/*! ./handlers/TypeOfHandler */ "./out/talon/runtime/handlers/TypeOfHandler.js");
const InvokeDelegateHandler_1 = __webpack_require__(/*! ./handlers/InvokeDelegateHandler */ "./out/talon/runtime/handlers/InvokeDelegateHandler.js");
const ComparisonHandler_1 = __webpack_require__(/*! ./handlers/ComparisonHandler */ "./out/talon/runtime/handlers/ComparisonHandler.js");
const RuntimeState_1 = __webpack_require__(/*! ./RuntimeState */ "./out/talon/runtime/RuntimeState.js");
const StateMachine_1 = __webpack_require__(/*! ./common/StateMachine */ "./out/talon/runtime/common/StateMachine.js");
const State_1 = __webpack_require__(/*! ./common/State */ "./out/talon/runtime/common/State.js");
const LoadBooleanHandler_1 = __webpack_require__(/*! ./handlers/LoadBooleanHandler */ "./out/talon/runtime/handlers/LoadBooleanHandler.js");
const CreateDelegateHandler_1 = __webpack_require__(/*! ./handlers/CreateDelegateHandler */ "./out/talon/runtime/handlers/CreateDelegateHandler.js");
const CompareLessThanHandler_1 = __webpack_require__(/*! ./handlers/CompareLessThanHandler */ "./out/talon/runtime/handlers/CompareLessThanHandler.js");
const AddHandler_1 = __webpack_require__(/*! ./handlers/AddHandler */ "./out/talon/runtime/handlers/AddHandler.js");
const LoadElementHandler_1 = __webpack_require__(/*! ./handlers/LoadElementHandler */ "./out/talon/runtime/handlers/LoadElementHandler.js");
const SetLocalHandler_1 = __webpack_require__(/*! ./handlers/SetLocalHandler */ "./out/talon/runtime/handlers/SetLocalHandler.js");
const LoadEmptyHandler_1 = __webpack_require__(/*! ./handlers/LoadEmptyHandler */ "./out/talon/runtime/handlers/LoadEmptyHandler.js");
const InvokeDelegateOnInstanceHandler_1 = __webpack_require__(/*! ./handlers/InvokeDelegateOnInstanceHandler */ "./out/talon/runtime/handlers/InvokeDelegateOnInstanceHandler.js");
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
//# sourceMappingURL=../../../ide/js/talon/runtime/TalonRuntime.js.map

/***/ }),

/***/ "./out/talon/runtime/Thread.js":
/*!*************************************!*\
  !*** ./out/talon/runtime/Thread.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Thread = void 0;
const MethodActivation_1 = __webpack_require__(/*! ./MethodActivation */ "./out/talon/runtime/MethodActivation.js");
const Understanding_1 = __webpack_require__(/*! ../library/Understanding */ "./out/talon/library/Understanding.js");
const RuntimeEmpty_1 = __webpack_require__(/*! ./library/RuntimeEmpty */ "./out/talon/runtime/library/RuntimeEmpty.js");
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
//# sourceMappingURL=../../../ide/js/talon/runtime/Thread.js.map

/***/ }),

/***/ "./out/talon/runtime/common/Memory.js":
/*!********************************************!*\
  !*** ./out/talon/runtime/common/Memory.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Memory = void 0;
const Place_1 = __webpack_require__(/*! ../../library/Place */ "./out/talon/library/Place.js");
const RuntimePlace_1 = __webpack_require__(/*! ../library/RuntimePlace */ "./out/talon/runtime/library/RuntimePlace.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const Variable_1 = __webpack_require__(/*! ../library/Variable */ "./out/talon/runtime/library/Variable.js");
const StringType_1 = __webpack_require__(/*! ../../library/StringType */ "./out/talon/library/StringType.js");
const RuntimeString_1 = __webpack_require__(/*! ../library/RuntimeString */ "./out/talon/runtime/library/RuntimeString.js");
const RuntimeEmpty_1 = __webpack_require__(/*! ../library/RuntimeEmpty */ "./out/talon/runtime/library/RuntimeEmpty.js");
const RuntimeCommand_1 = __webpack_require__(/*! ../library/RuntimeCommand */ "./out/talon/runtime/library/RuntimeCommand.js");
const BooleanType_1 = __webpack_require__(/*! ../../library/BooleanType */ "./out/talon/library/BooleanType.js");
const RuntimeBoolean_1 = __webpack_require__(/*! ../library/RuntimeBoolean */ "./out/talon/runtime/library/RuntimeBoolean.js");
const List_1 = __webpack_require__(/*! ../../library/List */ "./out/talon/library/List.js");
const RuntimeList_1 = __webpack_require__(/*! ../library/RuntimeList */ "./out/talon/runtime/library/RuntimeList.js");
const Item_1 = __webpack_require__(/*! ../../library/Item */ "./out/talon/library/Item.js");
const RuntimeItem_1 = __webpack_require__(/*! ../library/RuntimeItem */ "./out/talon/runtime/library/RuntimeItem.js");
const Player_1 = __webpack_require__(/*! ../../library/Player */ "./out/talon/library/Player.js");
const RuntimePlayer_1 = __webpack_require__(/*! ../library/RuntimePlayer */ "./out/talon/runtime/library/RuntimePlayer.js");
const Say_1 = __webpack_require__(/*! ../../library/Say */ "./out/talon/library/Say.js");
const RuntimeSay_1 = __webpack_require__(/*! ../library/RuntimeSay */ "./out/talon/runtime/library/RuntimeSay.js");
const RuntimeInteger_1 = __webpack_require__(/*! ../library/RuntimeInteger */ "./out/talon/runtime/library/RuntimeInteger.js");
const NumberType_1 = __webpack_require__(/*! ../../library/NumberType */ "./out/talon/library/NumberType.js");
const RuntimeDecoration_1 = __webpack_require__(/*! ../library/RuntimeDecoration */ "./out/talon/runtime/library/RuntimeDecoration.js");
const Decoration_1 = __webpack_require__(/*! ../../library/Decoration */ "./out/talon/library/Decoration.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/common/Memory.js.map

/***/ }),

/***/ "./out/talon/runtime/common/State.js":
/*!*******************************************!*\
  !*** ./out/talon/runtime/common/State.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/common/State.js.map

/***/ }),

/***/ "./out/talon/runtime/common/StateMachine.js":
/*!**************************************************!*\
  !*** ./out/talon/runtime/common/StateMachine.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StateMachine = void 0;
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const State_1 = __webpack_require__(/*! ./State */ "./out/talon/runtime/common/State.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/common/StateMachine.js.map

/***/ }),

/***/ "./out/talon/runtime/errors/RuntimeError.js":
/*!**************************************************!*\
  !*** ./out/talon/runtime/errors/RuntimeError.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeError = void 0;
class RuntimeError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.RuntimeError = RuntimeError;
//# sourceMappingURL=../../../../ide/js/talon/runtime/errors/RuntimeError.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/AddHandler.js":
/*!**************************************************!*\
  !*** ./out/talon/runtime/handlers/AddHandler.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddHandler = void 0;
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
const Memory_1 = __webpack_require__(/*! ../common/Memory */ "./out/talon/runtime/common/Memory.js");
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/AddHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/AssignVariableHandler.js":
/*!*************************************************************!*\
  !*** ./out/talon/runtime/handlers/AssignVariableHandler.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssignVariableHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const RuntimeString_1 = __webpack_require__(/*! ../library/RuntimeString */ "./out/talon/runtime/library/RuntimeString.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const RuntimeInteger_1 = __webpack_require__(/*! ../library/RuntimeInteger */ "./out/talon/runtime/library/RuntimeInteger.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
const RuntimeBoolean_1 = __webpack_require__(/*! ../library/RuntimeBoolean */ "./out/talon/runtime/library/RuntimeBoolean.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/AssignVariableHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/BranchRelativeHandler.js":
/*!*************************************************************!*\
  !*** ./out/talon/runtime/handlers/BranchRelativeHandler.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BranchRelativeHandler = void 0;
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/BranchRelativeHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/BranchRelativeIfFalseHandler.js":
/*!********************************************************************!*\
  !*** ./out/talon/runtime/handlers/BranchRelativeIfFalseHandler.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BranchRelativeIfFalseHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/BranchRelativeIfFalseHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/CompareLessThanHandler.js":
/*!**************************************************************!*\
  !*** ./out/talon/runtime/handlers/CompareLessThanHandler.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompareLessThanHandler = void 0;
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
const Memory_1 = __webpack_require__(/*! ../common/Memory */ "./out/talon/runtime/common/Memory.js");
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/CompareLessThanHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/ComparisonHandler.js":
/*!*********************************************************!*\
  !*** ./out/talon/runtime/handlers/ComparisonHandler.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComparisonHandler = void 0;
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
const Memory_1 = __webpack_require__(/*! ../common/Memory */ "./out/talon/runtime/common/Memory.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const RuntimeBoolean_1 = __webpack_require__(/*! ../library/RuntimeBoolean */ "./out/talon/runtime/library/RuntimeBoolean.js");
const RuntimeInteger_1 = __webpack_require__(/*! ../library/RuntimeInteger */ "./out/talon/runtime/library/RuntimeInteger.js");
const RuntimeString_1 = __webpack_require__(/*! ../library/RuntimeString */ "./out/talon/runtime/library/RuntimeString.js");
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/ComparisonHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/ConcatenateHandler.js":
/*!**********************************************************!*\
  !*** ./out/talon/runtime/handlers/ConcatenateHandler.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConcatenateHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const Memory_1 = __webpack_require__(/*! ../common/Memory */ "./out/talon/runtime/common/Memory.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/ConcatenateHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/CreateDelegateHandler.js":
/*!*************************************************************!*\
  !*** ./out/talon/runtime/handlers/CreateDelegateHandler.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateDelegateHandler = void 0;
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
const Memory_1 = __webpack_require__(/*! ../common/Memory */ "./out/talon/runtime/common/Memory.js");
const RuntimeDelegate_1 = __webpack_require__(/*! ../library/RuntimeDelegate */ "./out/talon/runtime/library/RuntimeDelegate.js");
const Variable_1 = __webpack_require__(/*! ../library/Variable */ "./out/talon/runtime/library/Variable.js");
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/CreateDelegateHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/ExternalCallHandler.js":
/*!***********************************************************!*\
  !*** ./out/talon/runtime/handlers/ExternalCallHandler.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExternalCallHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/ExternalCallHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/GoToHandler.js":
/*!***************************************************!*\
  !*** ./out/talon/runtime/handlers/GoToHandler.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoToHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/GoToHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/HandleCommandHandler.js":
/*!************************************************************!*\
  !*** ./out/talon/runtime/handlers/HandleCommandHandler.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HandleCommandHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const RuntimeCommand_1 = __webpack_require__(/*! ../library/RuntimeCommand */ "./out/talon/runtime/library/RuntimeCommand.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const Understanding_1 = __webpack_require__(/*! ../../library/Understanding */ "./out/talon/library/Understanding.js");
const Meaning_1 = __webpack_require__(/*! ../library/Meaning */ "./out/talon/runtime/library/Meaning.js");
const RuntimeWorldObject_1 = __webpack_require__(/*! ../library/RuntimeWorldObject */ "./out/talon/runtime/library/RuntimeWorldObject.js");
const WorldObject_1 = __webpack_require__(/*! ../../library/WorldObject */ "./out/talon/library/WorldObject.js");
const Memory_1 = __webpack_require__(/*! ../common/Memory */ "./out/talon/runtime/common/Memory.js");
const Type_1 = __webpack_require__(/*! ../../common/Type */ "./out/talon/common/Type.js");
const RuntimeAny_1 = __webpack_require__(/*! ../library/RuntimeAny */ "./out/talon/runtime/library/RuntimeAny.js");
const Player_1 = __webpack_require__(/*! ../../library/Player */ "./out/talon/library/Player.js");
const EventType_1 = __webpack_require__(/*! ../../common/EventType */ "./out/talon/common/EventType.js");
const RuntimeDelegate_1 = __webpack_require__(/*! ../library/RuntimeDelegate */ "./out/talon/runtime/library/RuntimeDelegate.js");
const Variable_1 = __webpack_require__(/*! ../library/Variable */ "./out/talon/runtime/library/Variable.js");
const RuntimeItem_1 = __webpack_require__(/*! ../library/RuntimeItem */ "./out/talon/runtime/library/RuntimeItem.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
class HandleCommandHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor(output) {
        super();
        this.output = output;
        this.code = OpCode_1.OpCode.HandleCommand;
    }
    handle(thread) {
        var _a, _b;
        const command = thread.currentMethod.pop();
        if (!(command instanceof RuntimeCommand_1.RuntimeCommand)) {
            throw new RuntimeError_1.RuntimeError(`Unable to handle a non-command, found '${command}`);
        }
        const action = command.action.value;
        const actor = (_a = command.actorName) === null || _a === void 0 ? void 0 : _a.value;
        const targetName = (_b = command.targetName) === null || _b === void 0 ? void 0 : _b.value;
        this.logInteraction(thread, `'${action} ${actor} ${targetName}'`);
        const understandingsByAction = new Map(thread.knownUnderstandings.map(x => { var _a; return [(_a = x.fields.find(field => field.name == Understanding_1.Understanding.action)) === null || _a === void 0 ? void 0 : _a.defaultValue, x]; }));
        const understanding = understandingsByAction.get(action);
        if (!understanding) {
            this.output.write("I don't know how to do that.");
            return super.handle(thread);
        }
        const meaningField = understanding.fields.find(x => x.name == Understanding_1.Understanding.meaning);
        const meaning = this.determineMeaningFor(meaningField === null || meaningField === void 0 ? void 0 : meaningField.defaultValue);
        const actualActor = this.inferTargetFrom(thread, actor, meaning);
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
                this.raisePlaceEvent(thread, nextPlace, EventType_1.EventType.PlayerEntersPlace);
                this.raisePlaceEvent(thread, currentPlace, EventType_1.EventType.PlayerExitsPlace);
                break;
            }
            case Meaning_1.Meaning.Taking: {
                if (!(actualTarget instanceof RuntimeItem_1.RuntimeItem)) {
                    this.output.write("I can't take that.");
                    return super.handle(thread);
                }
                const list = thread.currentPlace.getContentsField();
                list.items = list.items.filter(x => x.typeName.toLowerCase() !== (targetName === null || targetName === void 0 ? void 0 : targetName.toLowerCase()));
                const inventory = thread.currentPlayer.getContentsField();
                inventory.items.push(actualTarget);
                this.describe(thread, thread.currentPlace, false);
                this.tryRaiseItemEvents(thread, thread.currentPlace, EventType_1.EventType.ItIsTaken, actualTarget);
                break;
            }
            case Meaning_1.Meaning.Inventory: {
                const inventory = actualTarget.getContentsField();
                this.nameAndTotalContents(thread, inventory);
                break;
            }
            case Meaning_1.Meaning.Dropping: {
                const list = thread.currentPlayer.getContentsField();
                list.items = list.items.filter(x => x.typeName.toLowerCase() !== (targetName === null || targetName === void 0 ? void 0 : targetName.toLowerCase()));
                const contents = thread.currentPlace.getContentsField();
                contents.items.push(actualTarget);
                this.describe(thread, thread.currentPlace, false);
                this.tryRaiseItemEvents(thread, thread.currentPlace, EventType_1.EventType.ItIsDropped, actualTarget);
                break;
            }
            case Meaning_1.Meaning.Using: {
                if (actualActor) {
                    this.tryRaiseContextualItemEvents(thread, thread.currentPlace, EventType_1.EventType.ItIsUsed, actualActor, actualTarget);
                    this.tryRaiseItemEvents(thread, thread.currentPlace, EventType_1.EventType.ItIsUsed, actualActor);
                }
                else {
                    this.tryRaiseItemEvents(thread, thread.currentPlace, EventType_1.EventType.ItIsUsed, actualTarget);
                }
                break;
            }
            default:
                throw new RuntimeError_1.RuntimeError("Unsupported meaning found");
        }
        return super.handle(thread);
    }
    tryRaiseContextualItemEvents(thread, location, type, actor, target) {
        const actorEvents = Array.from(actor.methods.values()).filter(x => x.eventType == type && x.parameters.length > 0 && x.parameters[0].typeName === target.typeName);
        const targetEvents = Array.from(target.methods.values()).filter(x => x.eventType == type && x.parameters.length > 0 && x.parameters[0].typeName === actor.typeName);
        const actorThis = Variable_1.Variable.forThis(new Type_1.Type(actor.typeName, actor.parentTypeName), actor);
        const targetThis = Variable_1.Variable.forThis(new Type_1.Type(target.typeName, target.parentTypeName), target);
        for (const event of actorEvents) {
            event.actualParameters = [
                actorThis,
                new Variable_1.Variable(WorldObject_1.WorldObject.contextParameter, new Type_1.Type(RuntimeItem_1.RuntimeItem.name, RuntimeAny_1.RuntimeAny.name), target)
            ];
            const delegate = new RuntimeDelegate_1.RuntimeDelegate(event);
            thread.currentMethod.push(delegate);
        }
        for (const event of targetEvents) {
            event.actualParameters = [
                targetThis,
                new Variable_1.Variable(WorldObject_1.WorldObject.contextParameter, new Type_1.Type(RuntimeItem_1.RuntimeItem.name, RuntimeAny_1.RuntimeAny.name), actor)
            ];
            const delegate = new RuntimeDelegate_1.RuntimeDelegate(event);
            thread.currentMethod.push(delegate);
        }
    }
    tryRaiseItemEvents(thread, location, type, target) {
        const events = Array.from(target.methods.values()).filter(x => x.eventType == type && x.parameters.length === 0);
        for (const event of events) {
            event.actualParameters = [
                Variable_1.Variable.forThis(new Type_1.Type(target.typeName, target.parentTypeName), target)
            ];
            const delegate = new RuntimeDelegate_1.RuntimeDelegate(event);
            thread.currentMethod.push(delegate);
        }
    }
    raisePlaceEvent(thread, location, type) {
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
            const itemOrDecoration = placeContents.items.find(x => x.typeName.toLowerCase() === (targetName === null || targetName === void 0 ? void 0 : targetName.toLowerCase()));
            if (itemOrDecoration instanceof RuntimeWorldObject_1.RuntimeWorldObject) {
                return itemOrDecoration;
            }
            return lookupInstance((_d = thread.currentPlace) === null || _d === void 0 ? void 0 : _d.typeName);
        }
        else if (meaning === Meaning_1.Meaning.Taking) {
            const list = thread.currentPlace.getContentsField();
            const matchingItems = list.items.filter(x => x.typeName.toLowerCase() === (targetName === null || targetName === void 0 ? void 0 : targetName.toLowerCase()));
            if (matchingItems.length == 0) {
                return undefined;
            }
            return matchingItems[0];
        }
        else if (meaning === Meaning_1.Meaning.Dropping) {
            const list = thread.currentPlayer.getContentsField();
            const matchingItems = list.items.filter(x => x.typeName.toLowerCase() === (targetName === null || targetName === void 0 ? void 0 : targetName.toLowerCase()));
            if (matchingItems.length == 0) {
                return undefined;
            }
            return matchingItems[0];
        }
        else if (meaning === Meaning_1.Meaning.Using) {
            const list = thread.currentPlayer.getContentsField();
            const matchingInventoryItems = list.items.filter(x => x.typeName.toLowerCase() === (targetName === null || targetName === void 0 ? void 0 : targetName.toLowerCase()));
            if (matchingInventoryItems.length > 0) {
                return matchingInventoryItems[0];
            }
            const contents = thread.currentPlace.getContentsField();
            const matchingPlaceItems = contents.items.filter(x => x.typeName.toLowerCase() === (targetName === null || targetName === void 0 ? void 0 : targetName.toLowerCase()));
            if (matchingPlaceItems.length > 0) {
                return matchingPlaceItems[0];
            }
            return undefined;
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
            case Understanding_1.Understanding.using: return Meaning_1.Meaning.Using;
            default:
                return Meaning_1.Meaning.Custom;
        }
    }
}
exports.HandleCommandHandler = HandleCommandHandler;
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/HandleCommandHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/InstanceCallHandler.js":
/*!***********************************************************!*\
  !*** ./out/talon/runtime/handlers/InstanceCallHandler.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstanceCallHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const Variable_1 = __webpack_require__(/*! ../library/Variable */ "./out/talon/runtime/library/Variable.js");
const Type_1 = __webpack_require__(/*! ../../common/Type */ "./out/talon/common/Type.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/InstanceCallHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/InvokeDelegateHandler.js":
/*!*************************************************************!*\
  !*** ./out/talon/runtime/handlers/InvokeDelegateHandler.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvokeDelegateHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const RuntimeDelegate_1 = __webpack_require__(/*! ../library/RuntimeDelegate */ "./out/talon/runtime/library/RuntimeDelegate.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/InvokeDelegateHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/InvokeDelegateOnInstanceHandler.js":
/*!***********************************************************************!*\
  !*** ./out/talon/runtime/handlers/InvokeDelegateOnInstanceHandler.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvokeDelegateOnInstanceHandler = void 0;
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
const Memory_1 = __webpack_require__(/*! ../common/Memory */ "./out/talon/runtime/common/Memory.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const RuntimeDelegate_1 = __webpack_require__(/*! ../library/RuntimeDelegate */ "./out/talon/runtime/library/RuntimeDelegate.js");
const Variable_1 = __webpack_require__(/*! ../library/Variable */ "./out/talon/runtime/library/Variable.js");
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/InvokeDelegateOnInstanceHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/LoadBooleanHandler.js":
/*!**********************************************************!*\
  !*** ./out/talon/runtime/handlers/LoadBooleanHandler.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadBooleanHandler = void 0;
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
const Memory_1 = __webpack_require__(/*! ../common/Memory */ "./out/talon/runtime/common/Memory.js");
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/LoadBooleanHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/LoadElementHandler.js":
/*!**********************************************************!*\
  !*** ./out/talon/runtime/handlers/LoadElementHandler.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadElementHandler = void 0;
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/LoadElementHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/LoadEmptyHandler.js":
/*!********************************************************!*\
  !*** ./out/talon/runtime/handlers/LoadEmptyHandler.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadEmptyHandler = void 0;
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
const RuntimeEmpty_1 = __webpack_require__(/*! ../library/RuntimeEmpty */ "./out/talon/runtime/library/RuntimeEmpty.js");
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/LoadEmptyHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/LoadFieldHandler.js":
/*!********************************************************!*\
  !*** ./out/talon/runtime/handlers/LoadFieldHandler.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadFieldHandler = void 0;
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/LoadFieldHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/LoadInstanceHandler.js":
/*!***********************************************************!*\
  !*** ./out/talon/runtime/handlers/LoadInstanceHandler.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadInstanceHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/LoadInstanceHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/LoadLocalHandler.js":
/*!********************************************************!*\
  !*** ./out/talon/runtime/handlers/LoadLocalHandler.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadLocalHandler = void 0;
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/LoadLocalHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/LoadNumberHandler.js":
/*!*********************************************************!*\
  !*** ./out/talon/runtime/handlers/LoadNumberHandler.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadNumberHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const Memory_1 = __webpack_require__(/*! ../common/Memory */ "./out/talon/runtime/common/Memory.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/LoadNumberHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/LoadPropertyHandler.js":
/*!***********************************************************!*\
  !*** ./out/talon/runtime/handlers/LoadPropertyHandler.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadPropertyHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const InstanceCallHandler_1 = __webpack_require__(/*! ./InstanceCallHandler */ "./out/talon/runtime/handlers/InstanceCallHandler.js");
const LoadThisHandler_1 = __webpack_require__(/*! ./LoadThisHandler */ "./out/talon/runtime/handlers/LoadThisHandler.js");
const EvaluationResult_1 = __webpack_require__(/*! ../EvaluationResult */ "./out/talon/runtime/EvaluationResult.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/LoadPropertyHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/LoadStringHandler.js":
/*!*********************************************************!*\
  !*** ./out/talon/runtime/handlers/LoadStringHandler.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadStringHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const RuntimeString_1 = __webpack_require__(/*! ../library/RuntimeString */ "./out/talon/runtime/library/RuntimeString.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/LoadStringHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/LoadThisHandler.js":
/*!*******************************************************!*\
  !*** ./out/talon/runtime/handlers/LoadThisHandler.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadThisHandler = void 0;
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/LoadThisHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/NewInstanceHandler.js":
/*!**********************************************************!*\
  !*** ./out/talon/runtime/handlers/NewInstanceHandler.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NewInstanceHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const Memory_1 = __webpack_require__(/*! ../common/Memory */ "./out/talon/runtime/common/Memory.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/NewInstanceHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/NoOpHandler.js":
/*!***************************************************!*\
  !*** ./out/talon/runtime/handlers/NoOpHandler.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoOpHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/NoOpHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/ParseCommandHandler.js":
/*!***********************************************************!*\
  !*** ./out/talon/runtime/handlers/ParseCommandHandler.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ParseCommandHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const RuntimeString_1 = __webpack_require__(/*! ../library/RuntimeString */ "./out/talon/runtime/library/RuntimeString.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const Memory_1 = __webpack_require__(/*! ../common/Memory */ "./out/talon/runtime/common/Memory.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
        if (pieces.length == 2) {
            command.targetName = Memory_1.Memory.allocateString(pieces[1]);
        }
        else if (pieces.length == 4) {
            command.actorName = Memory_1.Memory.allocateString(pieces[1]);
            command.targetName = Memory_1.Memory.allocateString(pieces[3]);
        }
        return command;
    }
}
exports.ParseCommandHandler = ParseCommandHandler;
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/ParseCommandHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/PrintHandler.js":
/*!****************************************************!*\
  !*** ./out/talon/runtime/handlers/PrintHandler.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrintHandler = void 0;
const RuntimeString_1 = __webpack_require__(/*! ../library/RuntimeString */ "./out/talon/runtime/library/RuntimeString.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/PrintHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/ReadInputHandler.js":
/*!********************************************************!*\
  !*** ./out/talon/runtime/handlers/ReadInputHandler.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReadInputHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const EvaluationResult_1 = __webpack_require__(/*! ../EvaluationResult */ "./out/talon/runtime/EvaluationResult.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/ReadInputHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/ReturnHandler.js":
/*!*****************************************************!*\
  !*** ./out/talon/runtime/handlers/ReturnHandler.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReturnHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const EvaluationResult_1 = __webpack_require__(/*! ../EvaluationResult */ "./out/talon/runtime/EvaluationResult.js");
const RuntimeEmpty_1 = __webpack_require__(/*! ../library/RuntimeEmpty */ "./out/talon/runtime/library/RuntimeEmpty.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/ReturnHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/SetLocalHandler.js":
/*!*******************************************************!*\
  !*** ./out/talon/runtime/handlers/SetLocalHandler.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetLocalHandler = void 0;
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
const Type_1 = __webpack_require__(/*! ../../common/Type */ "./out/talon/common/Type.js");
const RuntimeAny_1 = __webpack_require__(/*! ../library/RuntimeAny */ "./out/talon/runtime/library/RuntimeAny.js");
const Variable_1 = __webpack_require__(/*! ../library/Variable */ "./out/talon/runtime/library/Variable.js");
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/SetLocalHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/StaticCallHandler.js":
/*!*********************************************************!*\
  !*** ./out/talon/runtime/handlers/StaticCallHandler.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StaticCallHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/StaticCallHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/handlers/TypeOfHandler.js":
/*!*****************************************************!*\
  !*** ./out/talon/runtime/handlers/TypeOfHandler.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeOfHandler = void 0;
const OpCodeHandler_1 = __webpack_require__(/*! ../OpCodeHandler */ "./out/talon/runtime/OpCodeHandler.js");
const Memory_1 = __webpack_require__(/*! ../common/Memory */ "./out/talon/runtime/common/Memory.js");
const OpCode_1 = __webpack_require__(/*! ../../common/OpCode */ "./out/talon/common/OpCode.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/handlers/TypeOfHandler.js.map

/***/ }),

/***/ "./out/talon/runtime/library/Meaning.js":
/*!**********************************************!*\
  !*** ./out/talon/runtime/library/Meaning.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Meaning = void 0;
var Meaning;
(function (Meaning) {
    Meaning[Meaning["Describing"] = 0] = "Describing";
    Meaning[Meaning["Taking"] = 1] = "Taking";
    Meaning[Meaning["Moving"] = 2] = "Moving";
    Meaning[Meaning["Direction"] = 3] = "Direction";
    Meaning[Meaning["Inventory"] = 4] = "Inventory";
    Meaning[Meaning["Dropping"] = 5] = "Dropping";
    Meaning[Meaning["Using"] = 6] = "Using";
    Meaning[Meaning["Quitting"] = 7] = "Quitting";
    Meaning[Meaning["Custom"] = 8] = "Custom";
})(Meaning = exports.Meaning || (exports.Meaning = {}));
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/Meaning.js.map

/***/ }),

/***/ "./out/talon/runtime/library/RuntimeAny.js":
/*!*************************************************!*\
  !*** ./out/talon/runtime/library/RuntimeAny.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeAny = void 0;
const Any_1 = __webpack_require__(/*! ../../library/Any */ "./out/talon/library/Any.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/RuntimeAny.js.map

/***/ }),

/***/ "./out/talon/runtime/library/RuntimeBoolean.js":
/*!*****************************************************!*\
  !*** ./out/talon/runtime/library/RuntimeBoolean.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeBoolean = void 0;
const Any_1 = __webpack_require__(/*! ../../library/Any */ "./out/talon/library/Any.js");
const BooleanType_1 = __webpack_require__(/*! ../../library/BooleanType */ "./out/talon/library/BooleanType.js");
const RuntimeAny_1 = __webpack_require__(/*! ./RuntimeAny */ "./out/talon/runtime/library/RuntimeAny.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/RuntimeBoolean.js.map

/***/ }),

/***/ "./out/talon/runtime/library/RuntimeCommand.js":
/*!*****************************************************!*\
  !*** ./out/talon/runtime/library/RuntimeCommand.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeCommand = void 0;
const RuntimeAny_1 = __webpack_require__(/*! ./RuntimeAny */ "./out/talon/runtime/library/RuntimeAny.js");
class RuntimeCommand extends RuntimeAny_1.RuntimeAny {
    constructor(targetName, actorName, action) {
        super();
        this.targetName = targetName;
        this.actorName = actorName;
        this.action = action;
    }
}
exports.RuntimeCommand = RuntimeCommand;
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/RuntimeCommand.js.map

/***/ }),

/***/ "./out/talon/runtime/library/RuntimeDecoration.js":
/*!********************************************************!*\
  !*** ./out/talon/runtime/library/RuntimeDecoration.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeDecoration = void 0;
const RuntimeWorldObject_1 = __webpack_require__(/*! ./RuntimeWorldObject */ "./out/talon/runtime/library/RuntimeWorldObject.js");
const Decoration_1 = __webpack_require__(/*! ../../library/Decoration */ "./out/talon/library/Decoration.js");
class RuntimeDecoration extends RuntimeWorldObject_1.RuntimeWorldObject {
    constructor() {
        super(...arguments);
        this.parentTypeName = Decoration_1.Decoration.parentTypeName;
        this.typeName = Decoration_1.Decoration.typeName;
    }
}
exports.RuntimeDecoration = RuntimeDecoration;
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/RuntimeDecoration.js.map

/***/ }),

/***/ "./out/talon/runtime/library/RuntimeDelegate.js":
/*!******************************************************!*\
  !*** ./out/talon/runtime/library/RuntimeDelegate.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeDelegate = void 0;
const RuntimeAny_1 = __webpack_require__(/*! ./RuntimeAny */ "./out/talon/runtime/library/RuntimeAny.js");
const Any_1 = __webpack_require__(/*! ../../library/Any */ "./out/talon/library/Any.js");
const Delegate_1 = __webpack_require__(/*! ../../library/Delegate */ "./out/talon/library/Delegate.js");
class RuntimeDelegate extends RuntimeAny_1.RuntimeAny {
    constructor(wrappedMethod) {
        super();
        this.wrappedMethod = wrappedMethod;
        this.parentTypeName = Any_1.Any.typeName;
        this.typeName = Delegate_1.Delegate.typeName;
    }
}
exports.RuntimeDelegate = RuntimeDelegate;
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/RuntimeDelegate.js.map

/***/ }),

/***/ "./out/talon/runtime/library/RuntimeEmpty.js":
/*!***************************************************!*\
  !*** ./out/talon/runtime/library/RuntimeEmpty.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeEmpty = void 0;
const RuntimeAny_1 = __webpack_require__(/*! ./RuntimeAny */ "./out/talon/runtime/library/RuntimeAny.js");
const Any_1 = __webpack_require__(/*! ../../library/Any */ "./out/talon/library/Any.js");
class RuntimeEmpty extends RuntimeAny_1.RuntimeAny {
    constructor() {
        super(...arguments);
        this.parentTypeName = Any_1.Any.typeName;
        this.typeName = "~empty";
    }
}
exports.RuntimeEmpty = RuntimeEmpty;
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/RuntimeEmpty.js.map

/***/ }),

/***/ "./out/talon/runtime/library/RuntimeInteger.js":
/*!*****************************************************!*\
  !*** ./out/talon/runtime/library/RuntimeInteger.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeInteger = void 0;
const RuntimeAny_1 = __webpack_require__(/*! ./RuntimeAny */ "./out/talon/runtime/library/RuntimeAny.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/RuntimeInteger.js.map

/***/ }),

/***/ "./out/talon/runtime/library/RuntimeItem.js":
/*!**************************************************!*\
  !*** ./out/talon/runtime/library/RuntimeItem.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeItem = void 0;
const RuntimeWorldObject_1 = __webpack_require__(/*! ./RuntimeWorldObject */ "./out/talon/runtime/library/RuntimeWorldObject.js");
const WorldObject_1 = __webpack_require__(/*! ../../library/WorldObject */ "./out/talon/library/WorldObject.js");
const Item_1 = __webpack_require__(/*! ../../library/Item */ "./out/talon/library/Item.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/RuntimeItem.js.map

/***/ }),

/***/ "./out/talon/runtime/library/RuntimeList.js":
/*!**************************************************!*\
  !*** ./out/talon/runtime/library/RuntimeList.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeList = void 0;
const RuntimeAny_1 = __webpack_require__(/*! ./RuntimeAny */ "./out/talon/runtime/library/RuntimeAny.js");
const List_1 = __webpack_require__(/*! ../../library/List */ "./out/talon/library/List.js");
const Method_1 = __webpack_require__(/*! ../../common/Method */ "./out/talon/common/Method.js");
const Parameter_1 = __webpack_require__(/*! ../../common/Parameter */ "./out/talon/common/Parameter.js");
const NumberType_1 = __webpack_require__(/*! ../../library/NumberType */ "./out/talon/library/NumberType.js");
const StringType_1 = __webpack_require__(/*! ../../library/StringType */ "./out/talon/library/StringType.js");
const Instruction_1 = __webpack_require__(/*! ../../common/Instruction */ "./out/talon/common/Instruction.js");
const RuntimeString_1 = __webpack_require__(/*! ./RuntimeString */ "./out/talon/runtime/library/RuntimeString.js");
const RuntimeInteger_1 = __webpack_require__(/*! ./RuntimeInteger */ "./out/talon/runtime/library/RuntimeInteger.js");
const Memory_1 = __webpack_require__(/*! ../common/Memory */ "./out/talon/runtime/common/Memory.js");
const BooleanType_1 = __webpack_require__(/*! ../../library/BooleanType */ "./out/talon/library/BooleanType.js");
const Any_1 = __webpack_require__(/*! ../../library/Any */ "./out/talon/library/Any.js");
const RuntimeDelegate_1 = __webpack_require__(/*! ./RuntimeDelegate */ "./out/talon/runtime/library/RuntimeDelegate.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/RuntimeList.js.map

/***/ }),

/***/ "./out/talon/runtime/library/RuntimePlace.js":
/*!***************************************************!*\
  !*** ./out/talon/runtime/library/RuntimePlace.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimePlace = void 0;
const RuntimeWorldObject_1 = __webpack_require__(/*! ./RuntimeWorldObject */ "./out/talon/runtime/library/RuntimeWorldObject.js");
const WorldObject_1 = __webpack_require__(/*! ../../library/WorldObject */ "./out/talon/library/WorldObject.js");
const Place_1 = __webpack_require__(/*! ../../library/Place */ "./out/talon/library/Place.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/RuntimePlace.js.map

/***/ }),

/***/ "./out/talon/runtime/library/RuntimePlayer.js":
/*!****************************************************!*\
  !*** ./out/talon/runtime/library/RuntimePlayer.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimePlayer = void 0;
const RuntimeWorldObject_1 = __webpack_require__(/*! ./RuntimeWorldObject */ "./out/talon/runtime/library/RuntimeWorldObject.js");
const Player_1 = __webpack_require__(/*! ../../library/Player */ "./out/talon/library/Player.js");
class RuntimePlayer extends RuntimeWorldObject_1.RuntimeWorldObject {
    static get type() {
        const type = RuntimeWorldObject_1.RuntimeWorldObject.type;
        type.name = Player_1.Player.typeName;
        return type;
    }
}
exports.RuntimePlayer = RuntimePlayer;
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/RuntimePlayer.js.map

/***/ }),

/***/ "./out/talon/runtime/library/RuntimeSay.js":
/*!*************************************************!*\
  !*** ./out/talon/runtime/library/RuntimeSay.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeSay = void 0;
const RuntimeAny_1 = __webpack_require__(/*! ./RuntimeAny */ "./out/talon/runtime/library/RuntimeAny.js");
class RuntimeSay extends RuntimeAny_1.RuntimeAny {
    constructor() {
        super(...arguments);
        this.message = "";
    }
}
exports.RuntimeSay = RuntimeSay;
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/RuntimeSay.js.map

/***/ }),

/***/ "./out/talon/runtime/library/RuntimeString.js":
/*!****************************************************!*\
  !*** ./out/talon/runtime/library/RuntimeString.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeString = void 0;
const RuntimeAny_1 = __webpack_require__(/*! ./RuntimeAny */ "./out/talon/runtime/library/RuntimeAny.js");
const Any_1 = __webpack_require__(/*! ../../library/Any */ "./out/talon/library/Any.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/RuntimeString.js.map

/***/ }),

/***/ "./out/talon/runtime/library/RuntimeWorldObject.js":
/*!*********************************************************!*\
  !*** ./out/talon/runtime/library/RuntimeWorldObject.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RuntimeWorldObject = void 0;
const RuntimeAny_1 = __webpack_require__(/*! ./RuntimeAny */ "./out/talon/runtime/library/RuntimeAny.js");
const WorldObject_1 = __webpack_require__(/*! ../../library/WorldObject */ "./out/talon/library/WorldObject.js");
const Any_1 = __webpack_require__(/*! ../../library/Any */ "./out/talon/library/Any.js");
const RuntimeError_1 = __webpack_require__(/*! ../errors/RuntimeError */ "./out/talon/runtime/errors/RuntimeError.js");
const Type_1 = __webpack_require__(/*! ../../common/Type */ "./out/talon/common/Type.js");
const Field_1 = __webpack_require__(/*! ../../common/Field */ "./out/talon/common/Field.js");
const List_1 = __webpack_require__(/*! ../../library/List */ "./out/talon/library/List.js");
const StringType_1 = __webpack_require__(/*! ../../library/StringType */ "./out/talon/library/StringType.js");
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/RuntimeWorldObject.js.map

/***/ }),

/***/ "./out/talon/runtime/library/Variable.js":
/*!***********************************************!*\
  !*** ./out/talon/runtime/library/Variable.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
//# sourceMappingURL=../../../../ide/js/talon/runtime/library/Variable.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!***************************!*\
  !*** ./out/talon/main.js ***!
  \***************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const TalonIde_1 = __webpack_require__(/*! ./TalonIde */ "./out/talon/TalonIde.js");
var ide = new TalonIde_1.TalonIde();
//# sourceMappingURL=../../ide/js/talon/main.js.map
})();

/******/ })()
;
//# sourceMappingURL=talon.js.map