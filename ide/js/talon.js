(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaneOutput {
    constructor(pane) {
        this.pane = pane;
    }
    write(line) {
        this.pane.innerHTML += line;
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
        console.log("Creating IDE");
        this.gamePane = document.getElementById("game-pane");
        const button = document.getElementById("compile");
        button === null || button === void 0 ? void 0 : button.addEventListener('click', e => {
            this.run();
        });
    }
    run() {
        console.log("RUNNING");
        const compiler = new TalonCompiler_1.TalonCompiler();
        const types = compiler.compile("");
        const userOutput = new PaneOutput_1.PaneOutput(this.gamePane);
        const runtime = new TalonRuntime_1.TalonRuntime(userOutput, undefined);
        runtime.loadFrom(types);
        runtime.sendCommand("");
        return "Compiled";
    }
}
exports.TalonIde = TalonIde;
},{"./PaneOutput":1,"./compiler/TalonCompiler":10,"./runtime/TalonRuntime":57}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Field {
    constructor() {
        this.name = "";
        this.typeName = "";
    }
}
exports.Field = Field;
},{}],4:[function(require,module,exports){
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
},{"./OpCode":6}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Method {
    constructor() {
        this.name = "";
        this.parameters = [];
        this.actualParameters = [];
        this.body = [];
        this.returnType = "";
    }
}
exports.Method = Method;
},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parameter {
    constructor(name, typeName) {
        this.name = name;
        this.typeName = typeName;
    }
}
exports.Parameter = Parameter;
},{}],8:[function(require,module,exports){
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
        return this.name.startsWith("<>");
    }
    get isAnonymousType() {
        return this.name.startsWith("<~>");
    }
}
exports.Type = Type;
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
class TalonCompiler {
    get languageVersion() {
        return new Version_1.Version(1, 0, 0);
    }
    get version() {
        return new Version_1.Version(1, 0, 0);
    }
    compile(code) {
        const lexer = new TalonLexer_1.Tokenizer();
        const parser = new TalonParser_1.TalonParser();
        const analyzer = new TalonSemanticAnalyzer_1.TalonSemanticAnalyzer();
        const transformer = new TalonTransformer_1.TalonTransformer();
        const tokens = lexer.tokenize(code);
        const ast = parser.parse(tokens);
        const analyzedAst = analyzer.analyze(ast);
        const types = transformer.transform(analyzedAst);
        const entryPoint = this.createEntryPoint();
        types.push(entryPoint);
        return types;
    }
    createEntryPoint() {
        const type = new Type_1.Type("<>entryPoint", "<>empty");
        type.attributes.push(new EntryPointAttribute_1.EntryPointAttribute());
        const main = new Method_1.Method();
        main.name = Any_1.Any.main;
        main.body.push(Instruction_1.Instruction.loadString(`Talon Language v.${this.languageVersion}`), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString(`Talon Compiler v.${this.version}`), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString("================================="), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.staticCall("<~>globalSays", "<>say"), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.loadString("What would you like to do?"), Instruction_1.Instruction.print(), Instruction_1.Instruction.readInput(), Instruction_1.Instruction.loadString(""), Instruction_1.Instruction.print(), Instruction_1.Instruction.parseCommand(), Instruction_1.Instruction.handleCommand(), Instruction_1.Instruction.goTo(9));
        type.methods.push(main);
        return type;
    }
}
exports.TalonCompiler = TalonCompiler;
},{"../common/Instruction":4,"../common/Method":5,"../common/Type":8,"../common/Version":9,"../library/Any":39,"../library/EntryPointAttribute":41,"./lexing/TalonLexer":14,"./parsing/TalonParser":18,"./semantics/TalonSemanticAnalyzer":37,"./transforming/TalonTransformer":38}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompilationError {
    constructor(message) {
        this.message = message;
    }
}
exports.CompilationError = CompilationError;
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Punctuation {
}
exports.Punctuation = Punctuation;
Punctuation.period = ".";
},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("./Token");
const Keywords_1 = require("./Keywords");
const Punctuation_1 = require("./Punctuation");
const TokenType_1 = require("./TokenType");
class Tokenizer {
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
            else if (Tokenizer.allKeywords.has(token.value)) {
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
            if (currentChar == " " || currentChar == "\n" || currentChar == Punctuation_1.Punctuation.period) {
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
exports.Tokenizer = Tokenizer;
Tokenizer.allKeywords = Keywords_1.Keywords.getAll();
},{"./Keywords":12,"./Punctuation":13,"./Token":15,"./TokenType":16}],15:[function(require,module,exports){
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
        return Token.getTokenWithTypeOf("<>empty", TokenType_1.TokenType.Unknown);
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
},{"../../library/Any":39,"../../library/BooleanType":40,"../../library/Item":43,"../../library/List":44,"../../library/Place":46,"../../library/WorldObject":51,"./TokenType":16}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Unknown"] = 0] = "Unknown";
    TokenType[TokenType["Keyword"] = 1] = "Keyword";
    TokenType[TokenType["Terminator"] = 2] = "Terminator";
    TokenType[TokenType["String"] = 3] = "String";
    TokenType[TokenType["Identifier"] = 4] = "Identifier";
    TokenType[TokenType["Number"] = 5] = "Number";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("../lexing/Token");
const CompilationError_1 = require("../exceptions/CompilationError");
const TokenType_1 = require("../lexing/TokenType");
class ParseContext {
    constructor(tokens) {
        this.tokens = [];
        this.index = 0;
        this.tokens = tokens;
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
            throw new CompilationError_1.CompilationError("Expected statement terminator");
        }
        return this.consumeCurrentToken();
    }
}
exports.ParseContext = ParseContext;
},{"../exceptions/CompilationError":11,"../lexing/Token":15,"../lexing/TokenType":16}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramVisitor_1 = require("./visitors/ProgramVisitor");
const ParseContext_1 = require("./ParseContext");
class TalonParser {
    parse(tokens) {
        const context = new ParseContext_1.ParseContext(tokens);
        const visitor = new ProgramVisitor_1.ProgramVisitor();
        return visitor.visit(context);
    }
}
exports.TalonParser = TalonParser;
},{"./ParseContext":17,"./visitors/ProgramVisitor":32}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Expression_1 = require("./Expression");
class BinaryExpression extends Expression_1.Expression {
}
exports.BinaryExpression = BinaryExpression;
},{"./Expression":22}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinaryExpression_1 = require("./BinaryExpression");
class ConcatenationExpression extends BinaryExpression_1.BinaryExpression {
}
exports.ConcatenationExpression = ConcatenationExpression;
},{"./BinaryExpression":19}],21:[function(require,module,exports){
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
},{"./Expression":22}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Expression {
}
exports.Expression = Expression;
},{}],23:[function(require,module,exports){
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
},{"./Expression":22}],24:[function(require,module,exports){
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
},{"./Expression":22}],25:[function(require,module,exports){
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
},{"./Expression":22}],26:[function(require,module,exports){
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
},{"./Expression":22}],27:[function(require,module,exports){
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
        this.name = nameToken.value;
    }
}
exports.TypeDeclarationExpression = TypeDeclarationExpression;
},{"./Expression":22}],28:[function(require,module,exports){
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
},{"./Expression":22}],29:[function(require,module,exports){
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
            return new ContainsExpression_1.ContainsExpression("<>it", Number(count.value), typeName.value);
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
},{"../../exceptions/CompilationError":11,"../../lexing/Keywords":12,"../expressions/ContainsExpression":21,"../expressions/SayExpression":26,"./IfExpressionVisitor":31,"./Visitor":36}],30:[function(require,module,exports){
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
            field.name = `<>${direction.value.substring(1, direction.value.length - 1)}`;
            field.typeName = StringType_1.StringType.typeName;
            field.initialValue = `"${placeName.value}"`;
        }
        else {
            throw new CompilationError_1.CompilationError("Unable to determine field");
        }
        context.expectTerminator();
        return field;
    }
}
exports.FieldDeclarationVisitor = FieldDeclarationVisitor;
},{"../../../library/BooleanType":40,"../../../library/List":44,"../../../library/Place":46,"../../../library/StringType":49,"../../../library/WorldObject":51,"../../exceptions/CompilationError":11,"../../lexing/Keywords":12,"../expressions/ConcatenationExpression":20,"../expressions/FieldDeclarationExpression":23,"./ExpressionVisitor":29,"./Visitor":36}],31:[function(require,module,exports){
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
},{"../../lexing/Keywords":12,"../expressions/Expression":22,"../expressions/IfExpression":24,"./ExpressionVisitor":29,"./Visitor":36}],32:[function(require,module,exports){
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
                expressions.push(expression);
            }
            else {
                throw new CompilationError_1.CompilationError("Found unexpected token");
            }
        }
        return new ProgramExpression_1.ProgramExpression(expressions);
    }
}
exports.ProgramVisitor = ProgramVisitor;
},{"../../exceptions/CompilationError":11,"../../lexing/Keywords":12,"../expressions/ProgramExpression":25,"./SayExpressionVisitor":33,"./TypeDeclarationVisitor":34,"./UnderstandingDeclarationVisitor":35,"./Visitor":36}],33:[function(require,module,exports){
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
},{"../../lexing/Keywords":12,"../expressions/SayExpression":26,"./Visitor":36}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Visitor_1 = require("./Visitor");
const Keywords_1 = require("../../lexing/Keywords");
const TypeDeclarationExpression_1 = require("../expressions/TypeDeclarationExpression");
const FieldDeclarationVisitor_1 = require("./FieldDeclarationVisitor");
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
        const typeDeclaration = new TypeDeclarationExpression_1.TypeDeclarationExpression(name, baseType);
        typeDeclaration.fields = fields;
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
},{"../../lexing/Keywords":12,"../expressions/TypeDeclarationExpression":27,"./FieldDeclarationVisitor":30,"./Visitor":36}],35:[function(require,module,exports){
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
        const meaning = context.expectAnyOf(Keywords_1.Keywords.describing, Keywords_1.Keywords.moving, Keywords_1.Keywords.directions, Keywords_1.Keywords.taking, Keywords_1.Keywords.inventory);
        context.expectTerminator();
        return new UnderstandingDeclarationExpression_1.UnderstandingDeclarationExpression(value.value, meaning.value);
    }
}
exports.UnderstandingDeclarationVisitor = UnderstandingDeclarationVisitor;
},{"../../lexing/Keywords":12,"../expressions/UnderstandingDeclarationExpression":28,"./Visitor":36}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Visitor {
}
exports.Visitor = Visitor;
},{}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramExpression_1 = require("../parsing/expressions/ProgramExpression");
const TypeDeclarationExpression_1 = require("../parsing/expressions/TypeDeclarationExpression");
const Token_1 = require("../lexing/Token");
const TokenType_1 = require("../lexing/TokenType");
class TalonSemanticAnalyzer {
    constructor() {
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
            if (baseToken.type == TokenType_1.TokenType.Keyword && !baseToken.value.startsWith("<>")) {
                const name = `<>${baseToken.value}`;
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
},{"../lexing/Token":15,"../lexing/TokenType":16,"../parsing/expressions/ProgramExpression":25,"../parsing/expressions/TypeDeclarationExpression":27}],38:[function(require,module,exports){
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
class TalonTransformer {
    createSystemTypes() {
        const types = [];
        // These are only here as stubs for external runtime types that allow us to correctly resolve field types.
        types.push(new Type_1.Type(Any_1.Any.typeName, Any_1.Any.parentTypeName));
        types.push(new Type_1.Type(WorldObject_1.WorldObject.typeName, WorldObject_1.WorldObject.parentTypeName));
        types.push(new Type_1.Type(Place_1.Place.typeName, Place_1.Place.parentTypeName));
        types.push(new Type_1.Type(BooleanType_1.BooleanType.typeName, BooleanType_1.BooleanType.parentTypeName));
        types.push(new Type_1.Type(StringType_1.StringType.typeName, StringType_1.StringType.parentTypeName));
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
                    const type = new Type_1.Type(`<~>${Understanding_1.Understanding.typeName}_${dynamicTypeCount}`, Understanding_1.Understanding.typeName);
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
                            getField.name = `<>get_${field.name}`;
                            getField.parameters.push(new Parameter_1.Parameter("<>value", field.typeName));
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
                    }
                }
            }
            const globalSays = expression.expressions.filter(x => x instanceof SayExpression_1.SayExpression);
            if (globalSays.length > 0) {
                const type = new Type_1.Type(`<~>globalSays`, Say_1.Say.typeName);
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
        }
        else {
            throw new CompilationError_1.CompilationError("Unable to partially transform");
        }
        return Array.from(typesByName.values());
    }
    transformExpression(expression) {
        const instructions = [];
        if (expression instanceof IfExpression_1.IfExpression) {
            const conditional = this.transformExpression(expression.conditional);
            instructions.push(...conditional);
            const ifBlock = this.transformExpression(expression.ifBlock);
            const elseBlock = this.transformExpression(expression.elseBlock);
            ifBlock.push(Instruction_1.Instruction.branchRelative(elseBlock.length));
            instructions.push(Instruction_1.Instruction.branchRelativeIfFalse(ifBlock.length));
            instructions.push(...ifBlock);
            instructions.push(...elseBlock);
        }
        else if (expression instanceof SayExpression_1.SayExpression) {
            instructions.push(Instruction_1.Instruction.loadString(expression.text));
            instructions.push(Instruction_1.Instruction.print());
            instructions.push(Instruction_1.Instruction.loadString(expression.text));
        }
        else if (expression instanceof ContainsExpression_1.ContainsExpression) {
            instructions.push(Instruction_1.Instruction.loadNumber(expression.count), Instruction_1.Instruction.loadString(expression.typeName), Instruction_1.Instruction.loadInstance(expression.targetName), Instruction_1.Instruction.loadField(WorldObject_1.WorldObject.contents), Instruction_1.Instruction.instanceCall(List_1.List.contains));
        }
        else if (expression instanceof ConcatenationExpression_1.ConcatenationExpression) {
            // TODO: Load the left-hand side so it can be concatenated when the right side evaluates.
            const left = this.transformExpression(expression.left);
            const right = this.transformExpression(expression.right);
            instructions.push(...left);
            instructions.push(...right);
            instructions.push(Instruction_1.Instruction.concatenate());
        }
        else if (expression instanceof FieldDeclarationExpression_1.FieldDeclarationExpression) {
            instructions.push(Instruction_1.Instruction.loadInstance("<>it"), Instruction_1.Instruction.loadField(expression.name));
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
},{"../../common/Field":3,"../../common/Instruction":4,"../../common/Method":5,"../../common/Parameter":7,"../../common/Type":8,"../../library/Any":39,"../../library/BooleanType":40,"../../library/Item":43,"../../library/List":44,"../../library/NumberType":45,"../../library/Place":46,"../../library/Player":47,"../../library/Say":48,"../../library/StringType":49,"../../library/Understanding":50,"../../library/WorldObject":51,"../exceptions/CompilationError":11,"../parsing/expressions/ConcatenationExpression":20,"../parsing/expressions/ContainsExpression":21,"../parsing/expressions/FieldDeclarationExpression":23,"../parsing/expressions/IfExpression":24,"../parsing/expressions/ProgramExpression":25,"../parsing/expressions/SayExpression":26,"../parsing/expressions/TypeDeclarationExpression":27,"../parsing/expressions/UnderstandingDeclarationExpression":28}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExternCall_1 = require("./ExternCall");
class Any {
}
exports.Any = Any;
Any.parentTypeName = "";
Any.typeName = "<>any";
Any.main = "<>main";
Any.externToString = ExternCall_1.ExternCall.of("<>toString");
},{"./ExternCall":42}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class BooleanType {
}
exports.BooleanType = BooleanType;
BooleanType.parentTypeName = Any_1.Any.typeName;
BooleanType.typeName = "<>boolean";
},{"./Any":39}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntryPointAttribute {
    constructor() {
        this.name = "<>entryPoint";
    }
}
exports.EntryPointAttribute = EntryPointAttribute;
},{}],42:[function(require,module,exports){
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
},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Item {
}
exports.Item = Item;
Item.typeName = "<>item";
Item.parentTypeName = WorldObject_1.WorldObject.typeName;
},{"./WorldObject":51}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class List {
}
exports.List = List;
List.typeName = "<>list";
List.parentTypeName = Any_1.Any.typeName;
List.contains = "<>contains";
List.typeNameParameter = "<>typeName";
List.countParameter = "<>count";
},{"./Any":39}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class NumberType {
}
exports.NumberType = NumberType;
NumberType.typeName = "<>number";
NumberType.parentTypeName = Any_1.Any.typeName;
},{"./Any":39}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Place {
}
exports.Place = Place;
Place.parentTypeName = WorldObject_1.WorldObject.typeName;
Place.typeName = "<>place";
Place.isPlayerStart = "<>isPlayerStart";
},{"./WorldObject":51}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WorldObject_1 = require("./WorldObject");
class Player {
}
exports.Player = Player;
Player.typeName = "<>player";
Player.parentTypeName = WorldObject_1.WorldObject.typeName;
},{"./WorldObject":51}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class Say {
}
exports.Say = Say;
Say.typeName = "<>say";
Say.parentTypeName = Any_1.Any.typeName;
},{"./Any":39}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class StringType {
}
exports.StringType = StringType;
StringType.parentTypeName = Any_1.Any.typeName;
StringType.typeName = "<>string";
},{"./Any":39}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class Understanding {
}
exports.Understanding = Understanding;
Understanding.parentTypeName = Any_1.Any.typeName;
Understanding.typeName = "<>understanding";
Understanding.describing = "<>describing";
Understanding.moving = "<>moving";
Understanding.direction = "<>direction";
Understanding.taking = "<>taking";
Understanding.inventory = "<>inventory";
Understanding.action = "<>action";
Understanding.meaning = "<>meaning";
},{"./Any":39}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Any_1 = require("./Any");
class WorldObject {
}
exports.WorldObject = WorldObject;
WorldObject.parentTypeName = Any_1.Any.typeName;
WorldObject.typeName = "<>worldObject";
WorldObject.description = "<>description";
WorldObject.contents = "<>contents";
WorldObject.describe = "<>describe";
},{"./Any":39}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TalonIde_1 = require("./TalonIde");
var ide = new TalonIde_1.TalonIde();
},{"./TalonIde":2}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EvaluationResult;
(function (EvaluationResult) {
    EvaluationResult[EvaluationResult["Continue"] = 0] = "Continue";
    EvaluationResult[EvaluationResult["SuspendForInput"] = 1] = "SuspendForInput";
})(EvaluationResult = exports.EvaluationResult || (exports.EvaluationResult = {}));
},{}],54:[function(require,module,exports){
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
},{"./StackFrame":56}],55:[function(require,module,exports){
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
},{"../common/OpCode":6,"./EvaluationResult":53}],56:[function(require,module,exports){
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
},{"./library/Variable":95}],57:[function(require,module,exports){
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
        var _a, _b;
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
    }
    loadFrom(types) {
        const loadedTypes = Memory_1.Memory.loadTypes(types);
        const entryPoint = loadedTypes.find(x => x.attributes.findIndex(attribute => attribute instanceof EntryPointAttribute_1.EntryPointAttribute) > -1);
        const mainMethod = entryPoint === null || entryPoint === void 0 ? void 0 : entryPoint.methods.find(x => x.name == Any_1.Any.main);
        const activation = new MethodActivation_1.MethodActivation(mainMethod);
        this.thread = new Thread_1.Thread(loadedTypes, activation);
        this.thread.log = this.logOutput;
    }
    sendCommand(input) {
        this.runWith(input);
    }
    runWith(command) {
        var _a, _b, _c, _d, _e, _f;
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
        for (let instruction = this.evaluateCurrentInstruction(); instruction == EvaluationResult_1.EvaluationResult.Continue; instruction = this.evaluateCurrentInstruction()) {
            (_f = this.thread) === null || _f === void 0 ? void 0 : _f.moveNext();
        }
    }
    evaluateCurrentInstruction() {
        var _a;
        const instruction = (_a = this.thread) === null || _a === void 0 ? void 0 : _a.currentInstruction;
        const handler = this.handlers.get(instruction === null || instruction === void 0 ? void 0 : instruction.opCode);
        if (handler == undefined) {
            throw new RuntimeError_1.RuntimeError(`Encountered unsupported OpCode ${instruction === null || instruction === void 0 ? void 0 : instruction.opCode}`);
        }
        return handler === null || handler === void 0 ? void 0 : handler.handle(this.thread);
    }
}
exports.TalonRuntime = TalonRuntime;
},{"../common/OpCode":6,"../library/Any":39,"../library/EntryPointAttribute":41,"../library/Place":46,"../library/Player":47,"./EvaluationResult":53,"./MethodActivation":54,"./Thread":58,"./common/Memory":59,"./errors/RuntimeError":60,"./handlers/BranchRelativeHandler":61,"./handlers/BranchRelativeIfFalseHandler":62,"./handlers/ConcatenateHandler":63,"./handlers/ExternalCallHandler":64,"./handlers/GoToHandler":65,"./handlers/HandleCommandHandler":66,"./handlers/InstanceCallHandler":67,"./handlers/LoadFieldHandler":68,"./handlers/LoadInstanceHandler":69,"./handlers/LoadLocalHandler":70,"./handlers/LoadNumberHandler":71,"./handlers/LoadPropertyHandler":72,"./handlers/LoadStringHandler":73,"./handlers/LoadThisHandler":74,"./handlers/NewInstanceHandler":75,"./handlers/NoOpHandler":76,"./handlers/ParseCommandHandler":77,"./handlers/PrintHandler":78,"./handlers/ReadInputHandler":79,"./handlers/ReturnHandler":80,"./handlers/StaticCallHandler":81}],58:[function(require,module,exports){
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
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(`${(_b = current.method) === null || _b === void 0 ? void 0 : _b.name} ==> ${method.name}`);
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
        (_a = this.log) === null || _a === void 0 ? void 0 : _a.debug(`${(_b = this.currentMethod.method) === null || _b === void 0 ? void 0 : _b.name} <== ${(_c = returnedMethod === null || returnedMethod === void 0 ? void 0 : returnedMethod.method) === null || _c === void 0 ? void 0 : _c.name}`);
        if (!expectReturnType) {
            return new RuntimeEmpty_1.RuntimeEmpty();
        }
        const returnValue = returnedMethod === null || returnedMethod === void 0 ? void 0 : returnedMethod.stack.pop();
        return returnValue;
    }
}
exports.Thread = Thread;
},{"../library/Understanding":50,"./MethodActivation":54,"./library/RuntimeEmpty":86}],59:[function(require,module,exports){
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
},{"../../library/BooleanType":40,"../../library/Item":43,"../../library/List":44,"../../library/Place":46,"../../library/Player":47,"../../library/Say":48,"../../library/StringType":49,"../errors/RuntimeError":60,"../library/RuntimeBoolean":84,"../library/RuntimeCommand":85,"../library/RuntimeEmpty":86,"../library/RuntimeInteger":87,"../library/RuntimeItem":88,"../library/RuntimeList":89,"../library/RuntimePlace":90,"../library/RuntimePlayer":91,"../library/RuntimeSay":92,"../library/RuntimeString":93,"../library/Variable":95}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RuntimeError {
    constructor(message) {
        this.message = message;
    }
}
exports.RuntimeError = RuntimeError;
},{}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
class BranchRelativeHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a;
        const relativeAmount = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        thread.jumpToLine(thread.currentMethod.stackFrame.currentInstruction + relativeAmount);
        return super.handle(thread);
    }
}
exports.BranchRelativeHandler = BranchRelativeHandler;
},{"../OpCodeHandler":55}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
class BranchRelativeIfFalseHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a;
        const relativeAmount = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const value = thread.currentMethod.pop();
        if (!value.value) {
            thread.jumpToLine(thread.currentMethod.stackFrame.currentInstruction + relativeAmount);
        }
        return super.handle(thread);
    }
}
exports.BranchRelativeIfFalseHandler = BranchRelativeIfFalseHandler;
},{"../OpCodeHandler":55}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const Memory_1 = require("../common/Memory");
class ConcatenateHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        const last = thread.currentMethod.pop();
        const first = thread.currentMethod.pop();
        const concatenated = Memory_1.Memory.allocateString(first.value + " " + last.value);
        thread.currentMethod.push(concatenated);
        return super.handle(thread);
    }
}
exports.ConcatenateHandler = ConcatenateHandler;
},{"../OpCodeHandler":55,"../common/Memory":59}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
class ExternalCallHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b;
        const methodName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const instance = thread.currentMethod.pop();
        const method = this.locateFunction(instance, methodName);
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`call.extern\t${instance === null || instance === void 0 ? void 0 : instance.typeName}::${methodName}(...${method.length})`);
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
},{"../OpCodeHandler":55}],65:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeError_1 = require("../errors/RuntimeError");
class GoToHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a;
        const instructionNumber = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
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
},{"../OpCodeHandler":55,"../errors/RuntimeError":60}],66:[function(require,module,exports){
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
class HandleCommandHandler extends OpCodeHandler_1.OpCodeHandler {
    constructor(output) {
        super();
        this.output = output;
    }
    handle(thread) {
        const command = thread.currentMethod.pop();
        if (command instanceof RuntimeCommand_1.RuntimeCommand) {
            const action = command.action.value;
            const targetName = command.targetName.value;
            const understandings = thread.knownUnderstandings;
            for (const type of understandings) {
                const actionField = type.fields.find(x => x.name == Understanding_1.Understanding.action);
                const meaningField = type.fields.find(x => x.name == Understanding_1.Understanding.meaning);
                if (action == (actionField === null || actionField === void 0 ? void 0 : actionField.defaultValue)) {
                    const meaning = this.determineMeaningFor(meaningField === null || meaningField === void 0 ? void 0 : meaningField.defaultValue);
                    let actualTargetName = this.inferTargetFrom(thread, targetName, meaning);
                    if (!actualTargetName) {
                        this.output.write("I don't know how to do that.");
                        break;
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
                        case Meaning_1.Meaning.Describing:
                            {
                                this.describe(thread, instance, false);
                            }
                            break;
                        case Meaning_1.Meaning.Moving:
                            {
                                thread.currentPlace = instance;
                                this.describe(thread, instance, false);
                            }
                            break;
                        case Meaning_1.Meaning.Taking:
                            {
                                const list = thread.currentPlace.getFieldAsList(WorldObject_1.WorldObject.contents);
                                list.items = list.items.filter(x => x.typeName != target.name);
                                const inventory = thread.currentPlayer.getFieldAsList(WorldObject_1.WorldObject.contents);
                                inventory.items.push(instance);
                                this.describe(thread, thread.currentPlace, false);
                            }
                            break;
                        case Meaning_1.Meaning.Inventory:
                            {
                                const inventory = instance.getFieldAsList(WorldObject_1.WorldObject.contents);
                                this.describeContents(thread, inventory);
                            }
                            break;
                        default:
                            throw new RuntimeError_1.RuntimeError("Unsupported meaning found");
                    }
                }
            }
        }
        else {
            throw new RuntimeError_1.RuntimeError("Unable to execute command");
        }
        return super.handle(thread);
    }
    locateTargetInstance(thread, target, meaning) {
        var _a;
        if (meaning === Meaning_1.Meaning.Taking) {
            const list = (_a = thread.currentPlace.fields.get(WorldObject_1.WorldObject.contents)) === null || _a === void 0 ? void 0 : _a.value;
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
            const placeName = (_b = (_a = thread.currentPlace) === null || _a === void 0 ? void 0 : _a.fields.get(`<>${targetName}`)) === null || _b === void 0 ? void 0 : _b.value;
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
        const systemAction = `<>${action}`;
        // TODO: Support custom actions better.
        switch (systemAction) {
            case Understanding_1.Understanding.describing: return Meaning_1.Meaning.Describing;
            case Understanding_1.Understanding.moving: return Meaning_1.Meaning.Moving;
            case Understanding_1.Understanding.direction: return Meaning_1.Meaning.Direction;
            case Understanding_1.Understanding.taking: return Meaning_1.Meaning.Taking;
            case Understanding_1.Understanding.inventory: return Meaning_1.Meaning.Inventory;
            default:
                return Meaning_1.Meaning.Custom;
        }
    }
}
exports.HandleCommandHandler = HandleCommandHandler;
},{"../../library/Player":47,"../../library/Understanding":50,"../../library/WorldObject":51,"../OpCodeHandler":55,"../common/Memory":59,"../errors/RuntimeError":60,"../library/Meaning":82,"../library/RuntimeCommand":85,"../library/RuntimeWorldObject":94,"./InstanceCallHandler":67}],67:[function(require,module,exports){
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
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`call.inst\t${instance === null || instance === void 0 ? void 0 : instance.typeName}::${this.methodName}(...${method.parameters.length})`);
        const parameterValues = [];
        for (let i = 0; i < method.parameters.length; i++) {
            const parameter = method.parameters[i];
            const instance = current.pop();
            const variable = new Variable_1.Variable(parameter.name, parameter.type, instance);
            parameterValues.push(variable);
        }
        // HACK: We shouldn't create our own type, we should inherently know what it is.
        parameterValues.unshift(new Variable_1.Variable("<>this", new Type_1.Type(instance === null || instance === void 0 ? void 0 : instance.typeName, instance === null || instance === void 0 ? void 0 : instance.parentTypeName), instance));
        method.actualParameters = parameterValues;
        thread.activateMethod(method);
        return super.handle(thread);
    }
}
exports.InstanceCallHandler = InstanceCallHandler;
},{"../../common/Type":8,"../OpCodeHandler":55,"../library/Variable":95}],68:[function(require,module,exports){
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
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`ld.field\t\t${instance === null || instance === void 0 ? void 0 : instance.typeName}::${fieldName} // ${value}`);
        thread.currentMethod.push(value);
        return super.handle(thread);
    }
}
exports.LoadFieldHandler = LoadFieldHandler;
},{"../OpCodeHandler":55}],69:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeError_1 = require("../errors/RuntimeError");
class LoadInstanceHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b;
        const typeName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        if (typeName === "<>it") {
            const subject = thread.currentPlace;
            thread.currentMethod.push(subject);
            (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug("ld.curr.place");
        }
        else {
            throw new RuntimeError_1.RuntimeError(`Unable to load instance for unsupported type '${typeName}'`);
        }
        return super.handle(thread);
    }
}
exports.LoadInstanceHandler = LoadInstanceHandler;
},{"../OpCodeHandler":55,"../errors/RuntimeError":60}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
class LoadLocalHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b, _c;
        const localName = (_a = thread.currentInstruction) === null || _a === void 0 ? void 0 : _a.value;
        const parameter = (_b = thread.currentMethod.method) === null || _b === void 0 ? void 0 : _b.actualParameters.find(x => x.name == localName);
        thread.currentMethod.push(parameter === null || parameter === void 0 ? void 0 : parameter.value);
        (_c = thread.log) === null || _c === void 0 ? void 0 : _c.debug(`ld.param\t\t${localName}=${parameter === null || parameter === void 0 ? void 0 : parameter.value}`);
        return super.handle(thread);
    }
}
exports.LoadLocalHandler = LoadLocalHandler;
},{"../OpCodeHandler":55}],71:[function(require,module,exports){
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
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`ld.const.num\t${value}`);
        return super.handle(thread);
    }
}
exports.LoadNumberHandler = LoadNumberHandler;
},{"../OpCodeHandler":55,"../common/Memory":59}],72:[function(require,module,exports){
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
        const getField = instance === null || instance === void 0 ? void 0 : instance.methods.get(`<>get_${this.fieldName}`);
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`ld.prop\t\t${instance === null || instance === void 0 ? void 0 : instance.typeName}::${this.fieldName} {get=${getField != undefined}} // ${value}`);
        if (getField) {
            getField.actualParameters.push(new Variable_1.Variable("<>value", field === null || field === void 0 ? void 0 : field.type, value));
            thread.activateMethod(getField);
        }
        else {
            thread.currentMethod.push(value);
        }
        return super.handle(thread);
    }
}
exports.LoadPropertyHandler = LoadPropertyHandler;
},{"../OpCodeHandler":55,"../library/Variable":95}],73:[function(require,module,exports){
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
            (_a = thread.log) === null || _a === void 0 ? void 0 : _a.debug(`ld.const.str\t"${value}"`);
        }
        else {
            throw new RuntimeError_1.RuntimeError("Expected a string");
        }
        return super.handle(thread);
    }
}
exports.LoadStringHandler = LoadStringHandler;
},{"../OpCodeHandler":55,"../errors/RuntimeError":60,"../library/RuntimeString":93}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
class LoadThisHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        var _a, _b;
        const instance = (_a = thread.currentMethod.method) === null || _a === void 0 ? void 0 : _a.actualParameters[0].value;
        thread.currentMethod.push(instance);
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`ld.this`);
        return super.handle(thread);
    }
}
exports.LoadThisHandler = LoadThisHandler;
},{"../OpCodeHandler":55}],75:[function(require,module,exports){
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
},{"../OpCodeHandler":55,"../common/Memory":59,"../errors/RuntimeError":60}],76:[function(require,module,exports){
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
},{"../EvaluationResult":53,"../OpCodeHandler":55}],77:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const RuntimeString_1 = require("../library/RuntimeString");
const RuntimeError_1 = require("../errors/RuntimeError");
const Memory_1 = require("../common/Memory");
class ParseCommandHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
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
},{"../OpCodeHandler":55,"../common/Memory":59,"../errors/RuntimeError":60,"../library/RuntimeString":93}],78:[function(require,module,exports){
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
        const text = thread.currentMethod.pop();
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
},{"../OpCodeHandler":55,"../errors/RuntimeError":60,"../library/RuntimeString":93}],79:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const EvaluationResult_1 = require("../EvaluationResult");
class ReadInputHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        return EvaluationResult_1.EvaluationResult.SuspendForInput;
    }
}
exports.ReadInputHandler = ReadInputHandler;
},{"../EvaluationResult":53,"../OpCodeHandler":55}],80:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OpCodeHandler_1 = require("../OpCodeHandler");
const EvaluationResult_1 = require("../EvaluationResult");
const RuntimeEmpty_1 = require("../library/RuntimeEmpty");
class ReturnHandler extends OpCodeHandler_1.OpCodeHandler {
    handle(thread) {
        // TODO: Handle returning top value on stack based on return type of method.
        var _a, _b;
        const current = thread.currentMethod;
        const returnValue = thread.returnFromCurrentMethod();
        if (!(returnValue instanceof RuntimeEmpty_1.RuntimeEmpty)) {
            (_a = thread.log) === null || _a === void 0 ? void 0 : _a.debug(`ret\t\t${returnValue}`);
            thread === null || thread === void 0 ? void 0 : thread.currentMethod.push(returnValue);
        }
        else {
            (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug("ret void");
        }
        return EvaluationResult_1.EvaluationResult.Continue;
    }
}
exports.ReturnHandler = ReturnHandler;
},{"../EvaluationResult":53,"../OpCodeHandler":55,"../library/RuntimeEmpty":86}],81:[function(require,module,exports){
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
        (_b = thread.log) === null || _b === void 0 ? void 0 : _b.debug(`call.static\t${typeName}::${methodName}()`);
        thread.activateMethod(method);
        return super.handle(thread);
    }
}
exports.StaticCallHandler = StaticCallHandler;
},{"../OpCodeHandler":55}],82:[function(require,module,exports){
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
},{}],83:[function(require,module,exports){
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
},{"../../library/Any":39}],84:[function(require,module,exports){
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
},{"./RuntimeAny":83}],85:[function(require,module,exports){
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
},{"./RuntimeAny":83}],86:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeAny_1 = require("./RuntimeAny");
const Any_1 = require("../../library/Any");
class RuntimeEmpty extends RuntimeAny_1.RuntimeAny {
    constructor() {
        super(...arguments);
        this.parentTypeName = Any_1.Any.typeName;
        this.typeName = "<>empty";
    }
}
exports.RuntimeEmpty = RuntimeEmpty;
},{"../../library/Any":39,"./RuntimeAny":83}],87:[function(require,module,exports){
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
},{"./RuntimeAny":83}],88:[function(require,module,exports){
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
},{"../../library/Item":43,"../../library/WorldObject":51,"./RuntimeWorldObject":94}],89:[function(require,module,exports){
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
},{"../../common/Instruction":4,"../../common/Method":5,"../../common/Parameter":7,"../../library/BooleanType":40,"../../library/List":44,"../../library/NumberType":45,"../../library/StringType":49,"../common/Memory":59,"./RuntimeAny":83}],90:[function(require,module,exports){
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
},{"../../library/Place":46,"../../library/WorldObject":51,"./RuntimeWorldObject":94}],91:[function(require,module,exports){
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
},{"../../library/Player":47,"./RuntimeWorldObject":94}],92:[function(require,module,exports){
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
},{"./RuntimeAny":83}],93:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuntimeAny_1 = require("./RuntimeAny");
const Any_1 = require("../../library/Any");
class RuntimeString extends RuntimeAny_1.RuntimeAny {
    constructor(value) {
        super();
        this.parentTypeName = Any_1.Any.typeName;
        this.typeName = "<>string";
        this.value = value;
    }
    toString() {
        return `"${this.value}"`;
    }
}
exports.RuntimeString = RuntimeString;
},{"../../library/Any":39,"./RuntimeAny":83}],94:[function(require,module,exports){
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
    getFieldAsList(name) {
        return this.getFieldValueByName(name);
    }
    getFieldAsString(name) {
        return this.getFieldValueByName(name);
    }
}
exports.RuntimeWorldObject = RuntimeWorldObject;
},{"../../common/Field":3,"../../common/Type":8,"../../library/Any":39,"../../library/List":44,"../../library/StringType":49,"../../library/WorldObject":51,"../errors/RuntimeError":60,"./RuntimeAny":83}],95:[function(require,module,exports){
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
},{}]},{},[52])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL25vcmhhL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInRhbG9uL1BhbmVPdXRwdXQudHMiLCJ0YWxvbi9UYWxvbklkZS50cyIsInRhbG9uL2NvbW1vbi9GaWVsZC50cyIsInRhbG9uL2NvbW1vbi9JbnN0cnVjdGlvbi50cyIsInRhbG9uL2NvbW1vbi9NZXRob2QudHMiLCJ0YWxvbi9jb21tb24vT3BDb2RlLnRzIiwidGFsb24vY29tbW9uL1BhcmFtZXRlci50cyIsInRhbG9uL2NvbW1vbi9UeXBlLnRzIiwidGFsb24vY29tbW9uL1ZlcnNpb24udHMiLCJ0YWxvbi9jb21waWxlci9UYWxvbkNvbXBpbGVyLnRzIiwidGFsb24vY29tcGlsZXIvZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL0tleXdvcmRzLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1B1bmN0dWF0aW9uLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1RhbG9uTGV4ZXIudHMiLCJ0YWxvbi9jb21waWxlci9sZXhpbmcvVG9rZW4udHMiLCJ0YWxvbi9jb21waWxlci9sZXhpbmcvVG9rZW5UeXBlLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9QYXJzZUNvbnRleHQudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL1RhbG9uUGFyc2VyLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9CaW5hcnlFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Db25jYXRlbmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29udGFpbnNFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvSWZFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Qcm9ncmFtRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2F5RXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvRXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL0ZpZWxkRGVjbGFyYXRpb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9JZkV4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9Qcm9ncmFtVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvU2F5RXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1R5cGVEZWNsYXJhdGlvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1Zpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9zZW1hbnRpY3MvVGFsb25TZW1hbnRpY0FuYWx5emVyLnRzIiwidGFsb24vY29tcGlsZXIvdHJhbnNmb3JtaW5nL1RhbG9uVHJhbnNmb3JtZXIudHMiLCJ0YWxvbi9saWJyYXJ5L0FueS50cyIsInRhbG9uL2xpYnJhcnkvQm9vbGVhblR5cGUudHMiLCJ0YWxvbi9saWJyYXJ5L0VudHJ5UG9pbnRBdHRyaWJ1dGUudHMiLCJ0YWxvbi9saWJyYXJ5L0V4dGVybkNhbGwudHMiLCJ0YWxvbi9saWJyYXJ5L0l0ZW0udHMiLCJ0YWxvbi9saWJyYXJ5L0xpc3QudHMiLCJ0YWxvbi9saWJyYXJ5L051bWJlclR5cGUudHMiLCJ0YWxvbi9saWJyYXJ5L1BsYWNlLnRzIiwidGFsb24vbGlicmFyeS9QbGF5ZXIudHMiLCJ0YWxvbi9saWJyYXJ5L1NheS50cyIsInRhbG9uL2xpYnJhcnkvU3RyaW5nVHlwZS50cyIsInRhbG9uL2xpYnJhcnkvVW5kZXJzdGFuZGluZy50cyIsInRhbG9uL2xpYnJhcnkvV29ybGRPYmplY3QudHMiLCJ0YWxvbi9tYWluLnRzIiwidGFsb24vcnVudGltZS9FdmFsdWF0aW9uUmVzdWx0LnRzIiwidGFsb24vcnVudGltZS9NZXRob2RBY3RpdmF0aW9uLnRzIiwidGFsb24vcnVudGltZS9PcENvZGVIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9TdGFja0ZyYW1lLnRzIiwidGFsb24vcnVudGltZS9UYWxvblJ1bnRpbWUudHMiLCJ0YWxvbi9ydW50aW1lL1RocmVhZC50cyIsInRhbG9uL3J1bnRpbWUvY29tbW9uL01lbW9yeS50cyIsInRhbG9uL3J1bnRpbWUvZXJyb3JzL1J1bnRpbWVFcnJvci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvQnJhbmNoUmVsYXRpdmVIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9CcmFuY2hSZWxhdGl2ZUlmRmFsc2VIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Db25jYXRlbmF0ZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0V4dGVybmFsQ2FsbEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0dvVG9IYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9IYW5kbGVDb21tYW5kSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvSW5zdGFuY2VDYWxsSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZEZpZWxkSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZEluc3RhbmNlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZExvY2FsSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZE51bWJlckhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRQcm9wZXJ0eUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRTdHJpbmdIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkVGhpc0hhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL05ld0luc3RhbmNlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTm9PcEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1BhcnNlQ29tbWFuZEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL1ByaW50SGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvUmVhZElucHV0SGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvUmV0dXJuSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvU3RhdGljQ2FsbEhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvTWVhbmluZy50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lQW55LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVCb29sZWFuLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVDb21tYW5kLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVFbXB0eS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lSW50ZWdlci50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lSXRlbS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lTGlzdC50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lUGxhY2UudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVBsYXllci50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lU2F5LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVTdHJpbmcudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVdvcmxkT2JqZWN0LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1ZhcmlhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNFQSxNQUFhLFVBQVU7SUFDbkIsWUFBb0IsSUFBbUI7UUFBbkIsU0FBSSxHQUFKLElBQUksQ0FBZTtJQUV2QyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQVk7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUM7SUFDaEMsQ0FBQztDQUNKO0FBUkQsZ0NBUUM7Ozs7QUNWRCw0REFBeUQ7QUFFekQsNkNBQTBDO0FBRTFDLHlEQUFzRDtBQUV0RCxNQUFhLFFBQVE7SUFHakI7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxRQUFRLEdBQW9CLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFdEUsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVsRCxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsZ0JBQWdCLENBQUMsT0FB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QixDQUFDLElBQVc7UUFDeEIsT0FBc0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7Q0FDSjtBQXhDRCxnREF3Q0M7Ozs7QUNqREQsTUFBYSxRQUFRO0lBRWpCLFlBQTRCLElBQVcsRUFDWCxJQUFTLEVBQ2xCLEtBQWlCO1FBRlIsU0FBSSxHQUFKLElBQUksQ0FBTztRQUNYLFNBQUksR0FBSixJQUFJLENBQUs7UUFDbEIsVUFBSyxHQUFMLEtBQUssQ0FBWTtJQUNwQyxDQUFDO0NBQ0o7QUFORCw0QkFNQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi9ydW50aW1lL0lPdXRwdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYW5lT3V0cHV0IGltcGxlbWVudHMgSU91dHB1dHtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFuZTpIVE1MRGl2RWxlbWVudCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHdyaXRlKGxpbmU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucGFuZS5pbm5lckhUTUwgKz0gbGluZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRhbG9uQ29tcGlsZXIgfSBmcm9tIFwiLi9jb21waWxlci9UYWxvbkNvbXBpbGVyXCI7XHJcblxyXG5pbXBvcnQgeyBQYW5lT3V0cHV0IH0gZnJvbSBcIi4vUGFuZU91dHB1dFwiO1xyXG5cclxuaW1wb3J0IHsgVGFsb25SdW50aW1lIH0gZnJvbSBcIi4vcnVudGltZS9UYWxvblJ1bnRpbWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvbklkZXtcclxuICAgIGdhbWVQYW5lOkhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDcmVhdGluZyBJREVcIik7XHJcbiAgICAgICAgdGhpcy5nYW1lUGFuZSA9IDxIVE1MRGl2RWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lLXBhbmVcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tcGlsZVwiKTtcclxuICAgICAgICBcclxuICAgICAgICBidXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucnVuKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcnVuKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJSVU5OSU5HXCIpO1xyXG4gICAgY29uc3QgY29tcGlsZXIgPSBuZXcgVGFsb25Db21waWxlcigpO1xyXG5cclxuICAgIGNvbnN0IHR5cGVzID0gY29tcGlsZXIuY29tcGlsZShcIlwiKTtcclxuXHJcbiAgICBjb25zdCB1c2VyT3V0cHV0ID0gbmV3IFBhbmVPdXRwdXQodGhpcy5nYW1lUGFuZSk7XHJcblxyXG4gICAgY29uc3QgcnVudGltZSA9IG5ldyBUYWxvblJ1bnRpbWUodXNlck91dHB1dCwgdW5kZWZpbmVkKTtcclxuXHJcbiAgICBydW50aW1lLmxvYWRGcm9tKHR5cGVzKTtcclxuICAgIHJ1bnRpbWUuc2VuZENvbW1hbmQoXCJcIik7XHJcbiAgICBcclxuICAgIHJldHVybiBcIkNvbXBpbGVkXCI7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4vVHlwZVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi9NZXRob2RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGaWVsZHtcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHR5cGVOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICB0eXBlPzpUeXBlO1xyXG4gICAgZGVmYXVsdFZhbHVlPzpPYmplY3Q7XHJcbn0iLCJpbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi9PcENvZGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnN0cnVjdGlvbntcclxuICAgIHN0YXRpYyBsb2FkTnVtYmVyKHZhbHVlOm51bWJlcil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZE51bWJlciwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkU3RyaW5nKHZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZFN0cmluZywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkSW5zdGFuY2UodHlwZU5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkSW5zdGFuY2UsIHR5cGVOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZEZpZWxkKGZpZWxkTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRGaWVsZCwgZmllbGROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZFByb3BlcnR5KGZpZWxkTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRQcm9wZXJ0eSwgZmllbGROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZExvY2FsKGxvY2FsTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRMb2NhbCwgbG9jYWxOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgbG9hZFRoaXMoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkVGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGluc3RhbmNlQ2FsbChtZXRob2ROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuSW5zdGFuY2VDYWxsLCBtZXRob2ROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY29uY2F0ZW5hdGUoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Db25jYXRlbmF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHN0YXRpY0NhbGwodHlwZU5hbWU6c3RyaW5nLCBtZXRob2ROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuU3RhdGljQ2FsbCwgYCR7dHlwZU5hbWV9LiR7bWV0aG9kTmFtZX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZXh0ZXJuYWxDYWxsKG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5FeHRlcm5hbENhbGwsIG1ldGhvZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwcmludCgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLlByaW50KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmV0dXJuKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuUmV0dXJuKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcmVhZElucHV0KCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuUmVhZElucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcGFyc2VDb21tYW5kKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuUGFyc2VDb21tYW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaGFuZGxlQ29tbWFuZCgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkhhbmRsZUNvbW1hbmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnb1RvKGxpbmVOdW1iZXI6bnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Hb1RvLCBsaW5lTnVtYmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYnJhbmNoUmVsYXRpdmUoY291bnQ6bnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5CcmFuY2hSZWxhdGl2ZSwgY291bnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBicmFuY2hSZWxhdGl2ZUlmRmFsc2UoY291bnQ6bnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5CcmFuY2hSZWxhdGl2ZUlmRmFsc2UsIGNvdW50KTtcclxuICAgIH1cclxuXHJcbiAgICBvcENvZGU6T3BDb2RlID0gT3BDb2RlLk5vT3A7XHJcbiAgICB2YWx1ZT86T2JqZWN0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wQ29kZTpPcENvZGUsIHZhbHVlPzpPYmplY3Qpe1xyXG4gICAgICAgIHRoaXMub3BDb2RlID0gb3BDb2RlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFBhcmFtZXRlciB9IGZyb20gXCIuL1BhcmFtZXRlclwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4uL3J1bnRpbWUvbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1ldGhvZHtcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHBhcmFtZXRlcnM6UGFyYW1ldGVyW10gPSBbXTtcclxuICAgIGFjdHVhbFBhcmFtZXRlcnM6VmFyaWFibGVbXSA9IFtdO1xyXG4gICAgYm9keTpJbnN0cnVjdGlvbltdID0gW107XHJcbiAgICByZXR1cm5UeXBlOnN0cmluZyA9IFwiXCI7XHJcbn0iLCJleHBvcnQgZW51bSBPcENvZGV7XHJcbiAgICBOb09wLFxyXG4gICAgUHJpbnQsXHJcbiAgICBMb2FkU3RyaW5nLFxyXG4gICAgTmV3SW5zdGFuY2UsXHJcbiAgICBQYXJzZUNvbW1hbmQsXHJcbiAgICBIYW5kbGVDb21tYW5kLFxyXG4gICAgUmVhZElucHV0LFxyXG4gICAgR29UbyxcclxuICAgIFJldHVybixcclxuICAgIEJyYW5jaFJlbGF0aXZlLFxyXG4gICAgQnJhbmNoUmVsYXRpdmVJZkZhbHNlLFxyXG4gICAgQ29uY2F0ZW5hdGUsXHJcbiAgICBMb2FkTnVtYmVyLFxyXG4gICAgTG9hZEZpZWxkLFxyXG4gICAgTG9hZFByb3BlcnR5LFxyXG4gICAgTG9hZEluc3RhbmNlLFxyXG4gICAgTG9hZExvY2FsLFxyXG4gICAgTG9hZFRoaXMsXHJcbiAgICBJbnN0YW5jZUNhbGwsXHJcbiAgICBTdGF0aWNDYWxsLFxyXG4gICAgRXh0ZXJuYWxDYWxsXHJcbn0iLCJpbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhcmFtZXRlcntcclxuICAgIFxyXG4gICAgdHlwZT86VHlwZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbmFtZTpzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdHlwZU5hbWU6c3RyaW5nKXtcclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuL0ZpZWxkXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBBdHRyaWJ1dGUgfSBmcm9tIFwiLi9BdHRyaWJ1dGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBleyAgICAgIFxyXG4gICAgZmllbGRzOkZpZWxkW10gPSBbXTtcclxuICAgIG1ldGhvZHM6TWV0aG9kW10gPSBbXTsgXHJcbiAgICBhdHRyaWJ1dGVzOkF0dHJpYnV0ZVtdID0gW107XHJcblxyXG4gICAgZ2V0IGlzU3lzdGVtVHlwZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUuc3RhcnRzV2l0aChcIjw+XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0Fub255bW91c1R5cGUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5uYW1lLnN0YXJ0c1dpdGgoXCI8fj5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6c3RyaW5nLCBwdWJsaWMgYmFzZVR5cGVOYW1lOnN0cmluZyl7XHJcblxyXG4gICAgfSAgICBcclxufSIsImV4cG9ydCBjbGFzcyBWZXJzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG1ham9yOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBtaW5vcjpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgcGF0Y2g6bnVtYmVyKXtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLm1ham9yfS4ke3RoaXMubWlub3J9LiR7dGhpcy5wYXRjaH1gO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tIFwiLi4vY29tbW9uL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IEVudHJ5UG9pbnRBdHRyaWJ1dGUgfSBmcm9tIFwiLi4vbGlicmFyeS9FbnRyeVBvaW50QXR0cmlidXRlXCI7XHJcbmltcG9ydCB7IFRva2VuaXplciB9IGZyb20gXCIuL2xleGluZy9UYWxvbkxleGVyXCI7XHJcbmltcG9ydCB7IFRhbG9uUGFyc2VyIH0gZnJvbSBcIi4vcGFyc2luZy9UYWxvblBhcnNlclwiO1xyXG5pbXBvcnQgeyBUYWxvblNlbWFudGljQW5hbHl6ZXIgfSBmcm9tIFwiLi9zZW1hbnRpY3MvVGFsb25TZW1hbnRpY0FuYWx5emVyXCI7XHJcbmltcG9ydCB7IFRhbG9uVHJhbnNmb3JtZXIgfSBmcm9tIFwiLi90cmFuc2Zvcm1pbmcvVGFsb25UcmFuc2Zvcm1lclwiO1xyXG5pbXBvcnQgeyBWZXJzaW9uIH0gZnJvbSBcIi4uL2NvbW1vbi9WZXJzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25Db21waWxlcntcclxuICAgIFxyXG4gICAgZ2V0IGxhbmd1YWdlVmVyc2lvbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVyc2lvbigxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmVyc2lvbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVyc2lvbigxLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21waWxlKGNvZGU6c3RyaW5nKTpUeXBlW117XHJcbiAgICAgICAgY29uc3QgbGV4ZXIgPSBuZXcgVG9rZW5pemVyKCk7XHJcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IFRhbG9uUGFyc2VyKCk7XHJcbiAgICAgICAgY29uc3QgYW5hbHl6ZXIgPSBuZXcgVGFsb25TZW1hbnRpY0FuYWx5emVyKCk7XHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSBuZXcgVGFsb25UcmFuc2Zvcm1lcigpO1xyXG5cclxuICAgICAgICBjb25zdCB0b2tlbnMgPSBsZXhlci50b2tlbml6ZShjb2RlKTtcclxuICAgICAgICBjb25zdCBhc3QgPSBwYXJzZXIucGFyc2UodG9rZW5zKTtcclxuICAgICAgICBjb25zdCBhbmFseXplZEFzdCA9IGFuYWx5emVyLmFuYWx5emUoYXN0KTtcclxuICAgICAgICBjb25zdCB0eXBlcyA9IHRyYW5zZm9ybWVyLnRyYW5zZm9ybShhbmFseXplZEFzdCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGVudHJ5UG9pbnQgPSB0aGlzLmNyZWF0ZUVudHJ5UG9pbnQoKTtcclxuXHJcbiAgICAgICAgdHlwZXMucHVzaChlbnRyeVBvaW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHR5cGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlRW50cnlQb2ludCgpe1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBuZXcgVHlwZShcIjw+ZW50cnlQb2ludFwiLCBcIjw+ZW1wdHlcIik7XHJcblxyXG4gICAgICAgIHR5cGUuYXR0cmlidXRlcy5wdXNoKG5ldyBFbnRyeVBvaW50QXR0cmlidXRlKCkpO1xyXG5cclxuICAgICAgICBjb25zdCBtYWluID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgIG1haW4ubmFtZSA9IEFueS5tYWluO1xyXG4gICAgICAgIG1haW4uYm9keS5wdXNoKFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGBUYWxvbiBMYW5ndWFnZSB2LiR7dGhpcy5sYW5ndWFnZVZlcnNpb259YCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoYFRhbG9uIENvbXBpbGVyIHYuJHt0aGlzLnZlcnNpb259YCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5zdGF0aWNDYWxsKFwiPH4+Z2xvYmFsU2F5c1wiLCBcIjw+c2F5XCIpLCAgICAgICAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoXCJcIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoXCJXaGF0IHdvdWxkIHlvdSBsaWtlIHRvIGRvP1wiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucmVhZElucHV0KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoXCJcIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnBhcnNlQ29tbWFuZCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5oYW5kbGVDb21tYW5kKCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmdvVG8oOSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0eXBlLm1ldGhvZHMucHVzaChtYWluKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgQ29tcGlsYXRpb25FcnJvcntcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbWVzc2FnZTpzdHJpbmcpe1xyXG5cclxuICAgIH1cclxufSIsImludGVyZmFjZSBJbmRleGFibGV7XHJcbiAgICBba2V5OnN0cmluZ106YW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgS2V5d29yZHN7XHJcbiAgICBcclxuICAgIHN0YXRpYyByZWFkb25seSBhbiA9IFwiYW5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBhID0gXCJhXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdGhlID0gXCJ0aGVcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpcyA9IFwiaXNcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBraW5kID0gXCJraW5kXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgb2YgPSBcIm9mXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGxhY2UgPSBcInBsYWNlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaXRlbSA9IFwiaXRlbVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGl0ID0gXCJpdFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGhhcyA9IFwiaGFzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaWYgPSBcImlmXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGVzY3JpcHRpb24gPSBcImRlc2NyaXB0aW9uXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdW5kZXJzdGFuZCA9IFwidW5kZXJzdGFuZFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGFzID0gXCJhc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRlc2NyaWJpbmcgPSBcImRlc2NyaWJpbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZXNjcmliZWQgPSBcImRlc2NyaWJlZFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHdoZXJlID0gXCJ3aGVyZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBsYXllciA9IFwicGxheWVyXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc3RhcnRzID0gXCJzdGFydHNcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBjb250YWlucyA9IFwiY29udGFpbnNcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBzYXkgPSBcInNheVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRpcmVjdGlvbnMgPSBcImRpcmVjdGlvbnNcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBtb3ZpbmcgPSBcIm1vdmluZ1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRha2luZyA9IFwidGFraW5nXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaW52ZW50b3J5ID0gXCJpbnZlbnRvcnlcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBjYW4gPSBcImNhblwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHJlYWNoID0gXCJyZWFjaFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGJ5ID0gXCJieVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGdvaW5nID0gXCJnb2luZ1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGFuZCA9IFwiYW5kXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdGhlbiA9IFwidGhlblwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGVsc2UgPSBcImVsc2VcIjtcclxuXHJcbiAgICBzdGF0aWMgZ2V0QWxsKCk6U2V0PHN0cmluZz57XHJcbiAgICAgICAgdHlwZSBLZXl3b3JkUHJvcGVydGllcyA9IGtleW9mIEtleXdvcmRzO1xyXG5cclxuICAgICAgICBjb25zdCBhbGxLZXl3b3JkcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xyXG5cclxuICAgICAgICBjb25zdCBuYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKEtleXdvcmRzKTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBrZXl3b3JkIG9mIG5hbWVzKXtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSAoS2V5d29yZHMgYXMgSW5kZXhhYmxlKVtrZXl3b3JkXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgdmFsdWUgIT0gXCJLZXl3b3Jkc1wiKXtcclxuICAgICAgICAgICAgICAgIGFsbEtleXdvcmRzLmFkZCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhbGxLZXl3b3JkcztcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBQdW5jdHVhdGlvbntcclxuICAgIHN0YXRpYyByZWFkb25seSBwZXJpb2QgPSBcIi5cIjtcclxufSIsImltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4vVG9rZW5cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBQdW5jdHVhdGlvbiB9IGZyb20gXCIuL1B1bmN0dWF0aW9uXCI7XHJcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuL1Rva2VuVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRva2VuaXplcntcclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGFsbEtleXdvcmRzID0gS2V5d29yZHMuZ2V0QWxsKCk7XHJcblxyXG4gICAgdG9rZW5pemUoY29kZTpzdHJpbmcpOlRva2VuW117XHJcbiAgICAgICAgbGV0IGN1cnJlbnRMaW5lID0gMTtcclxuICAgICAgICBsZXQgY3VycmVudENvbHVtbiA9IDE7XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuczpUb2tlbltdID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNvZGUubGVuZ3RoOyApe1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Q2hhciA9IGNvZGUuY2hhckF0KGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q2hhciA9PSBcIiBcIil7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29sdW1uKys7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q2hhciA9PSBcIlxcblwiKXtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb2x1bW4gPSAxO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudExpbmUrKztcclxuICAgICAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHRva2VuVmFsdWUgPSB0aGlzLmNvbnN1bWVUb2tlbkNoYXJzQXQoY29kZSwgaW5kZXgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHRva2VuVmFsdWUubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IG5ldyBUb2tlbihjdXJyZW50TGluZSwgY3VycmVudENvbHVtbiwgdG9rZW5WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnRDb2x1bW4gKz0gdG9rZW5WYWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGluZGV4ICs9IHRva2VuVmFsdWUubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NpZnkodG9rZW5zKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsYXNzaWZ5KHRva2VuczpUb2tlbltdKTpUb2tlbltde1xyXG4gICAgICAgIGZvcihsZXQgdG9rZW4gb2YgdG9rZW5zKXtcclxuICAgICAgICAgICAgaWYgKHRva2VuLnZhbHVlID09IFB1bmN0dWF0aW9uLnBlcmlvZCl7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLlRlcm1pbmF0b3I7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVG9rZW5pemVyLmFsbEtleXdvcmRzLmhhcyh0b2tlbi52YWx1ZSkpe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5LZXl3b3JkO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnZhbHVlLnN0YXJ0c1dpdGgoXCJcXFwiXCIpICYmIHRva2VuLnZhbHVlLmVuZHNXaXRoKFwiXFxcIlwiKSl7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLlN0cmluZztcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghaXNOYU4oTnVtYmVyKHRva2VuLnZhbHVlKSkpIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuTnVtYmVyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5JZGVudGlmaWVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW5zO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29uc3VtZVRva2VuQ2hhcnNBdChjb2RlOnN0cmluZywgaW5kZXg6bnVtYmVyKTpzdHJpbmd7XHJcbiAgICAgICAgY29uc3QgdG9rZW5DaGFyczpzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHN0cmluZ0RlbGltaXRlciA9IFwiXFxcIlwiO1xyXG5cclxuICAgICAgICBsZXQgaXNDb25zdW1pbmdTdHJpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yKGxldCByZWFkQWhlYWRJbmRleCA9IGluZGV4OyByZWFkQWhlYWRJbmRleCA8IGNvZGUubGVuZ3RoOyByZWFkQWhlYWRJbmRleCsrKXtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSBjb2RlLmNoYXJBdChyZWFkQWhlYWRJbmRleCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNDb25zdW1pbmdTdHJpbmcgJiYgY3VycmVudENoYXIgIT0gc3RyaW5nRGVsaW1pdGVyKXtcclxuICAgICAgICAgICAgICAgIHRva2VuQ2hhcnMucHVzaChjdXJyZW50Q2hhcik7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDaGFyID09IHN0cmluZ0RlbGltaXRlcil7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdG9rZW5DaGFycy5wdXNoKGN1cnJlbnRDaGFyKTsgICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgaXNDb25zdW1pbmdTdHJpbmcgPSAhaXNDb25zdW1pbmdTdHJpbmc7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzQ29uc3VtaW5nU3RyaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gXCIgXCIgfHwgY3VycmVudENoYXIgPT0gXCJcXG5cIiB8fCBjdXJyZW50Q2hhciA9PSBQdW5jdHVhdGlvbi5wZXJpb2Qpe1xyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuQ2hhcnMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuQ2hhcnMucHVzaChjdXJyZW50Q2hhcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdG9rZW5DaGFycy5wdXNoKGN1cnJlbnRDaGFyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0b2tlbkNoYXJzLmpvaW4oXCJcIik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi9Ub2tlblR5cGVcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9JdGVtXCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVG9rZW57XHJcbiAgICBzdGF0aWMgZ2V0IGVtcHR5KCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihcIjw+ZW1wdHlcIiwgVG9rZW5UeXBlLlVua25vd24pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yQW55KCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihBbnkudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvclBsYWNlKCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihQbGFjZS50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9ySXRlbSgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoSXRlbS50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yV29ybGRPYmplY3QoKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKFdvcmxkT2JqZWN0LnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JCb29sZWFuKCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihCb29sZWFuVHlwZS50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yTGlzdCgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoTGlzdC50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldFRva2VuV2l0aFR5cGVPZihuYW1lOnN0cmluZywgdHlwZTpUb2tlblR5cGUpe1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gbmV3IFRva2VuKC0xLC0xLG5hbWUpO1xyXG4gICAgICAgIHRva2VuLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH1cclxuXHJcbiAgICB0eXBlOlRva2VuVHlwZSA9IFRva2VuVHlwZS5Vbmtub3duO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBsaW5lOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBjb2x1bW46bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHZhbHVlOnN0cmluZyl7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBUb2tlblR5cGV7XHJcbiAgICBVbmtub3duLFxyXG4gICAgS2V5d29yZCxcclxuICAgIFRlcm1pbmF0b3IsXHJcbiAgICBTdHJpbmcsXHJcbiAgICBJZGVudGlmaWVyLFxyXG4gICAgTnVtYmVyXHJcbn0iLCJpbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5cIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uL2xleGluZy9Ub2tlblR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJzZUNvbnRleHR7XHJcbiAgICB0b2tlbnM6VG9rZW5bXSA9IFtdO1xyXG4gICAgaW5kZXg6bnVtYmVyID0gMDtcclxuXHJcbiAgICBnZXQgaXNEb25lKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXggPj0gdGhpcy50b2tlbnMubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJyZW50VG9rZW4oKXtcclxuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5pbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IodG9rZW5zOlRva2VuW10pe1xyXG4gICAgICAgIHRoaXMudG9rZW5zID0gdG9rZW5zO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN1bWVDdXJyZW50VG9rZW4oKXtcclxuICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMuY3VycmVudFRva2VuO1xyXG5cclxuICAgICAgICB0aGlzLmluZGV4Kys7XHJcblxyXG4gICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH1cclxuXHJcbiAgICBpcyh0b2tlblZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRva2VuPy52YWx1ZSA9PSB0b2tlblZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQW55T2YoLi4udG9rZW5WYWx1ZXM6c3RyaW5nW10pe1xyXG4gICAgICAgIGZvcihsZXQgdmFsdWUgb2YgdG9rZW5WYWx1ZXMpe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pcyh2YWx1ZSkpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RBbnlPZiguLi50b2tlblZhbHVlczpzdHJpbmdbXSl7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzQW55T2YoLi4udG9rZW5WYWx1ZXMpKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJFeHBlY3RlZCB0b2tlbnNcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3QodG9rZW5WYWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi52YWx1ZSAhPSB0b2tlblZhbHVlKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoYEV4cGVjdGVkIHRva2VuICcke3Rva2VuVmFsdWV9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdFN0cmluZygpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi50eXBlICE9IFRva2VuVHlwZS5TdHJpbmcpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIHN0cmluZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcblxyXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gc3RyaXAgb2ZmIHRoZSBkb3VibGUgcXVvdGVzIGZyb20gdGhlaXIgc3RyaW5nIGFmdGVyIHdlIGNvbnN1bWUgaXQuXHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG5ldyBUb2tlbih0b2tlbi5saW5lLCB0b2tlbi5jb2x1bW4sIHRva2VuLnZhbHVlLnN1YnN0cmluZygxLCB0b2tlbi52YWx1ZS5sZW5ndGggLSAxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0TnVtYmVyKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRva2VuLnR5cGUgIT0gVG9rZW5UeXBlLk51bWJlcil7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiRXhwZWN0ZWQgbnVtYmVyXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdElkZW50aWZpZXIoKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9rZW4udHlwZSAhPSBUb2tlblR5cGUuSWRlbnRpZmllcil7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiRXhwZWN0ZWQgaWRlbnRpZmllclwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RUZXJtaW5hdG9yKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRva2VuLnR5cGUgIT0gVG9rZW5UeXBlLlRlcm1pbmF0b3Ipe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIHN0YXRlbWVudCB0ZXJtaW5hdG9yXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFByb2dyYW1WaXNpdG9yIH0gZnJvbSBcIi4vdmlzaXRvcnMvUHJvZ3JhbVZpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4vUGFyc2VDb250ZXh0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25QYXJzZXJ7XHJcbiAgICBwYXJzZSh0b2tlbnM6VG9rZW5bXSk6RXhwcmVzc2lvbntcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gbmV3IFBhcnNlQ29udGV4dCh0b2tlbnMpO1xyXG4gICAgICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgUHJvZ3JhbVZpc2l0b3IoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJpbmFyeUV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgbGVmdD86RXhwcmVzc2lvbjtcclxuICAgIHJpZ2h0PzpFeHByZXNzaW9uO1xyXG59IiwiaW1wb3J0IHsgQmluYXJ5RXhwcmVzc2lvbiB9IGZyb20gXCIuL0JpbmFyeUV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb25jYXRlbmF0aW9uRXhwcmVzc2lvbiBleHRlbmRzIEJpbmFyeUV4cHJlc3Npb257XHJcbiAgICBcclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udGFpbnNFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB0YXJnZXROYW1lOnN0cmluZyxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBjb3VudDpudW1iZXIsIFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHR5cGVOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBFeHByZXNzaW9ue1xyXG4gICAgXHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4vVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBCaW5hcnlFeHByZXNzaW9uIH0gZnJvbSBcIi4vQmluYXJ5RXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHR5cGVOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICBpbml0aWFsVmFsdWU/Ok9iamVjdDtcclxuICAgIHR5cGU/OlR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb247XHJcbiAgICBhc3NvY2lhdGVkRXhwcmVzc2lvbnM6QmluYXJ5RXhwcmVzc2lvbltdID0gW107XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIElmRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgY29uZGl0aW9uYWw6RXhwcmVzc2lvbixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBpZkJsb2NrOkV4cHJlc3Npb24sXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgZWxzZUJsb2NrOkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb2dyYW1FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGV4cHJlc3Npb25zOkV4cHJlc3Npb25bXSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2F5RXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGV4dDpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuLi8uLi9sZXhpbmcvVG9rZW5cIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgYmFzZVR5cGU/OlR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb247XHJcbiAgICBmaWVsZHM6RmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25bXSA9IFtdO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBuYW1lVG9rZW46VG9rZW4sIHJlYWRvbmx5IGJhc2VUeXBlTmFtZVRva2VuOlRva2VuKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWVUb2tlbi52YWx1ZTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHZhbHVlOnN0cmluZywgcHVibGljIHJlYWRvbmx5IG1lYW5pbmc6c3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IElmRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9JZkV4cHJlc3Npb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IENvbnRhaW5zRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9Db250YWluc0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgU2F5RXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9TYXlFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRXhwcmVzc2lvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuaWYpKXtcclxuICAgICAgICAgICAgY29uc3QgdmlzaXRvciA9IG5ldyBJZkV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5pdCkpe1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pdCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmNvbnRhaW5zKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gY29udGV4dC5leHBlY3ROdW1iZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgdHlwZU5hbWUgPSBjb250ZXh0LmV4cGVjdElkZW50aWZpZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udGFpbnNFeHByZXNzaW9uKFwiPD5pdFwiLCBOdW1iZXIoY291bnQudmFsdWUpLCB0eXBlTmFtZS52YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLnNheSkpe1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5zYXkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFNheUV4cHJlc3Npb24odGV4dC52YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJVbmFibGUgdG8gcGFyc2UgZXhwcmVzc2lvblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0ZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4uLy4uL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvclwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFN0cmluZ1R5cGUgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9TdHJpbmdUeXBlXCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IEFuZEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvQW5kRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uVmlzaXRvciB9IGZyb20gXCIuL0V4cHJlc3Npb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IENvbmNhdGVuYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0NvbmNhdGVuYXRpb25FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRmllbGREZWNsYXJhdGlvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZpZWxkID0gbmV3IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLml0KTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuaXMpKXtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuZGVzY3JpYmVkKSl7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5kZXNjcmliZWQpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYXMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmaWVsZC5uYW1lID0gV29ybGRPYmplY3QuZGVzY3JpcHRpb247XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IFN0cmluZ1R5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBkZXNjcmlwdGlvbi52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoY29udGV4dC5pcyhLZXl3b3Jkcy5hbmQpKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb25WaXNpdG9yID0gbmV3IEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb25WaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsZWZ0RXhwcmVzc2lvbiA9IChmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnMubGVuZ3RoID09IDApID8gZmllbGQgOiBmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnNbZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zLmxlbmd0aCAtIDFdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25jYXQgPSBuZXcgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uY2F0LmxlZnQgPSBsZWZ0RXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgICAgICAgICBjb25jYXQucmlnaHQgPSBleHByZXNzaW9uO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmaWVsZC5hc3NvY2lhdGVkRXhwcmVzc2lvbnMucHVzaChjb25jYXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLndoZXJlKSl7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy53aGVyZSk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy50aGUpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMucGxheWVyKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnN0YXJ0cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IFBsYWNlLmlzUGxheWVyU3RhcnQ7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IEJvb2xlYW5UeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiVW5hYmxlIHRvIGRldGVybWluZSBwcm9wZXJ0eSBmaWVsZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5jb250YWlucykpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuY29udGFpbnMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY291bnQgPSBjb250ZXh0LmV4cGVjdE51bWJlcigpO1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBUT0RPOiBTdXBwb3J0IG11bHRpcGxlIGNvbnRlbnQgZW50cmllcy5cclxuXHJcbiAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBXb3JsZE9iamVjdC5jb250ZW50cztcclxuICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBMaXN0LnR5cGVOYW1lO1xyXG4gICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBbW051bWJlcihjb3VudC52YWx1ZSksIG5hbWUudmFsdWVdXTsgXHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmNhbikpe1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuY2FuKTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMucmVhY2gpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy50aGUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcGxhY2VOYW1lID0gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcblxyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5ieSk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmdvaW5nKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICBmaWVsZC5uYW1lID0gYDw+JHtkaXJlY3Rpb24udmFsdWUuc3Vic3RyaW5nKDEsIGRpcmVjdGlvbi52YWx1ZS5sZW5ndGggLSAxKX1gO1xyXG4gICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IFN0cmluZ1R5cGUudHlwZU5hbWU7XHJcbiAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IGBcIiR7cGxhY2VOYW1lLnZhbHVlfVwiYDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byBkZXRlcm1pbmUgZmllbGRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0VGVybWluYXRvcigpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmllbGQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBJZkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvSWZFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSWZFeHByZXNzaW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pZik7XHJcblxyXG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb25WaXNpdG9yID0gbmV3IEV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgY29uc3QgY29uZGl0aW9uYWwgPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlbik7XHJcblxyXG4gICAgICAgIGNvbnN0IGlmQmxvY2sgPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuZWxzZSkpe1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5lbHNlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGVsc2VCbG9jayA9IGV4cHJlc3Npb25WaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBJZkV4cHJlc3Npb24oY29uZGl0aW9uYWwsIGlmQmxvY2ssIGVsc2VCbG9jayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IElmRXhwcmVzc2lvbihjb25kaXRpb25hbCwgaWZCbG9jaywgbmV3IEV4cHJlc3Npb24oKSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL1R5cGVEZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgUHJvZ3JhbUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvUHJvZ3JhbUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi8uLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgU2F5RXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9TYXlFeHByZXNzaW9uVmlzaXRvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb2dyYW1WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGxldCBleHByZXNzaW9uczpFeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUoIWNvbnRleHQuaXNEb25lKXtcclxuICAgICAgICAgICAgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMudW5kZXJzdGFuZCkpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uID0gbmV3IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB1bmRlcnN0YW5kaW5nRGVjbGFyYXRpb24udmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0LmlzQW55T2YoS2V5d29yZHMuYSwgS2V5d29yZHMuYW4pKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGVEZWNsYXJhdGlvbiA9IG5ldyBUeXBlRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gdHlwZURlY2xhcmF0aW9uLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5zYXkpKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNheUV4cHJlc3Npb24gPSBuZXcgU2F5RXhwcmVzc2lvblZpc2l0b3IoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBzYXlFeHByZXNzaW9uLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiRm91bmQgdW5leHBlY3RlZCB0b2tlblwiKTtcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9ncmFtRXhwcmVzc2lvbihleHByZXNzaW9ucyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgU2F5RXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9TYXlFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2F5RXhwcmVzc2lvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuc2F5KTtcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgU2F5RXhwcmVzc2lvbih0ZXh0LnZhbHVlKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuLi8uLi9sZXhpbmcvVG9rZW5cIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25WaXNpdG9yIH0gZnJvbSBcIi4vRmllbGREZWNsYXJhdGlvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBlRGVjbGFyYXRpb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0QW55T2YoS2V5d29yZHMuYSwgS2V5d29yZHMuYW4pO1xyXG5cclxuICAgICAgICBjb25zdCBuYW1lID0gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmlzKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5raW5kKTtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5vZik7XHJcblxyXG4gICAgICAgIGNvbnN0IGJhc2VUeXBlID0gdGhpcy5leHBlY3RCYXNlVHlwZShjb250ZXh0KTtcclxuICAgICAgICBcclxuICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZmllbGRzOkZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGNvbnRleHQuaXMoS2V5d29yZHMuaXQpKXtcclxuICAgICAgICAgICAgY29uc3QgZmllbGRWaXNpdG9yID0gbmV3IEZpZWxkRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gZmllbGRWaXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgZmllbGRzLnB1c2goPEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uPmZpZWxkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHR5cGVEZWNsYXJhdGlvbiA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKG5hbWUsIGJhc2VUeXBlKTtcclxuXHJcbiAgICAgICAgdHlwZURlY2xhcmF0aW9uLmZpZWxkcyA9IGZpZWxkcztcclxuXHJcbiAgICAgICAgcmV0dXJuIHR5cGVEZWNsYXJhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV4cGVjdEJhc2VUeXBlKGNvbnRleHQ6UGFyc2VDb250ZXh0KXtcclxuICAgICAgICBpZiAoY29udGV4dC5pc0FueU9mKEtleXdvcmRzLnBsYWNlLCBLZXl3b3Jkcy5pdGVtKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0LmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudW5kZXJzdGFuZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5hcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1lYW5pbmcgPSBjb250ZXh0LmV4cGVjdEFueU9mKEtleXdvcmRzLmRlc2NyaWJpbmcsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEtleXdvcmRzLm1vdmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy5kaXJlY3Rpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEtleXdvcmRzLnRha2luZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy5pbnZlbnRvcnkpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uKHZhbHVlLnZhbHVlLCBtZWFuaW5nLnZhbHVlKTsgICAgICAgIFxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWaXNpdG9ye1xyXG4gICAgYWJzdHJhY3QgdmlzaXQoY29udGV4dDpQYXJzZUNvbnRleHQpOkV4cHJlc3Npb247XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQcm9ncmFtRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1Byb2dyYW1FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4uL2xleGluZy9Ub2tlblwiO1xyXG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uU2VtYW50aWNBbmFseXplcntcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFueSA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvckFueSwgVG9rZW4uZW1wdHkpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSB3b3JsZE9iamVjdCA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvcldvcmxkT2JqZWN0LCBUb2tlbi5mb3JBbnkpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBwbGFjZSA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvclBsYWNlLCBUb2tlbi5mb3JXb3JsZE9iamVjdCk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGl0ZW0gPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JJdGVtLCBUb2tlbi5mb3JXb3JsZE9iamVjdCk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGJvb2xlYW5UeXBlID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9yQm9vbGVhbiwgVG9rZW4uZm9yQW55KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgbGlzdCA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvckxpc3QsIFRva2VuLmZvckFueSk7XHJcblxyXG4gICAgYW5hbHl6ZShleHByZXNzaW9uOkV4cHJlc3Npb24pOkV4cHJlc3Npb257XHJcbiAgICAgICAgY29uc3QgdHlwZXM6VHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbltdID0gW3RoaXMuYW55LCB0aGlzLndvcmxkT2JqZWN0LCB0aGlzLnBsYWNlLCB0aGlzLmJvb2xlYW5UeXBlLCB0aGlzLml0ZW1dO1xyXG5cclxuICAgICAgICBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIFByb2dyYW1FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgZm9yKGxldCBjaGlsZCBvZiBleHByZXNzaW9uLmV4cHJlc3Npb25zKXtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVzLnB1c2goY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0eXBlc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uPih0eXBlcy5tYXAoeCA9PiBbeC5uYW1lLCB4XSkpO1xyXG5cclxuICAgICAgICBmb3IoY29uc3QgZGVjbGFyYXRpb24gb2YgdHlwZXMpe1xyXG4gICAgICAgICAgICBjb25zdCBiYXNlVG9rZW4gPSBkZWNsYXJhdGlvbi5iYXNlVHlwZU5hbWVUb2tlbjtcclxuXHJcbiAgICAgICAgICAgIGlmIChiYXNlVG9rZW4udHlwZSA9PSBUb2tlblR5cGUuS2V5d29yZCAmJiAhYmFzZVRva2VuLnZhbHVlLnN0YXJ0c1dpdGgoXCI8PlwiKSl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gYDw+JHtiYXNlVG9rZW4udmFsdWV9YDtcclxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uLmJhc2VUeXBlID0gdHlwZXNCeU5hbWUuZ2V0KG5hbWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVjbGFyYXRpb24uYmFzZVR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoYmFzZVRva2VuLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IGZpZWxkIG9mIGRlY2xhcmF0aW9uLmZpZWxkcyl7XHJcbiAgICAgICAgICAgICAgICBmaWVsZC50eXBlID0gdHlwZXNCeU5hbWUuZ2V0KGZpZWxkLnR5cGVOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGV4cHJlc3Npb247XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFByb2dyYW1FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvUHJvZ3JhbUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1R5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZyB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1VuZGVyc3RhbmRpbmdcIjtcclxuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL0ZpZWxkXCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvSXRlbVwiO1xyXG5pbXBvcnQgeyBOdW1iZXJUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTnVtYmVyVHlwZVwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgU2F5RXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1NheUV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9NZXRob2RcIjtcclxuaW1wb3J0IHsgU2F5IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU2F5XCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9JbnN0cnVjdGlvblwiO1xyXG5pbXBvcnQgeyBQYXJhbWV0ZXIgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1BhcmFtZXRlclwiO1xyXG5pbXBvcnQgeyBJZkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9JZkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9Db25jYXRlbmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBDb250YWluc0V4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9Db250YWluc0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uVHJhbnNmb3JtZXJ7XHJcbiAgICBwcml2YXRlIGNyZWF0ZVN5c3RlbVR5cGVzKCl7XHJcbiAgICAgICAgY29uc3QgdHlwZXM6VHlwZVtdID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVGhlc2UgYXJlIG9ubHkgaGVyZSBhcyBzdHVicyBmb3IgZXh0ZXJuYWwgcnVudGltZSB0eXBlcyB0aGF0IGFsbG93IHVzIHRvIGNvcnJlY3RseSByZXNvbHZlIGZpZWxkIHR5cGVzLlxyXG5cclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKEFueS50eXBlTmFtZSwgQW55LnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShXb3JsZE9iamVjdC50eXBlTmFtZSwgV29ybGRPYmplY3QucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFBsYWNlLnR5cGVOYW1lLCBQbGFjZS5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoQm9vbGVhblR5cGUudHlwZU5hbWUsIEJvb2xlYW5UeXBlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShTdHJpbmdUeXBlLnR5cGVOYW1lLCBTdHJpbmdUeXBlLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShJdGVtLnR5cGVOYW1lLCBJdGVtLnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShMaXN0LnR5cGVOYW1lLCBMaXN0LnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShQbGF5ZXIudHlwZU5hbWUsIFBsYXllci5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoU2F5LnR5cGVOYW1lLCBTYXkucGFyZW50VHlwZU5hbWUpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXA8c3RyaW5nLCBUeXBlPih0eXBlcy5tYXAoeCA9PiBbeC5uYW1lLCB4XSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybShleHByZXNzaW9uOkV4cHJlc3Npb24pOlR5cGVbXXtcclxuICAgICAgICBjb25zdCB0eXBlc0J5TmFtZSA9IHRoaXMuY3JlYXRlU3lzdGVtVHlwZXMoKTtcclxuICAgICAgICBsZXQgZHluYW1pY1R5cGVDb3VudCA9IDA7XHJcblxyXG4gICAgICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgUHJvZ3JhbUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBmb3IoY29uc3QgY2hpbGQgb2YgZXhwcmVzc2lvbi5leHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoYDx+PiR7VW5kZXJzdGFuZGluZy50eXBlTmFtZX1fJHtkeW5hbWljVHlwZUNvdW50fWAsIFVuZGVyc3RhbmRpbmcudHlwZU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5uYW1lID0gVW5kZXJzdGFuZGluZy5hY3Rpb247XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLmRlZmF1bHRWYWx1ZSA9IGNoaWxkLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZWFuaW5nID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVhbmluZy5uYW1lID0gVW5kZXJzdGFuZGluZy5tZWFuaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lYW5pbmcuZGVmYXVsdFZhbHVlID0gY2hpbGQubWVhbmluZztcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0eXBlLmZpZWxkcy5wdXNoKGFjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZS5maWVsZHMucHVzaChtZWFuaW5nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pY1R5cGVDb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0eXBlc0J5TmFtZS5zZXQodHlwZS5uYW1lLCB0eXBlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gdGhpcy50cmFuc2Zvcm1Jbml0aWFsVHlwZURlY2xhcmF0aW9uKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0eXBlc0J5TmFtZS5zZXQodHlwZS5uYW1lLCB0eXBlKTtcclxuICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBjaGlsZCBvZiBleHByZXNzaW9uLmV4cHJlc3Npb25zKXtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoY2hpbGQubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvcihjb25zdCBmaWVsZEV4cHJlc3Npb24gb2YgY2hpbGQuZmllbGRzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmllbGQgPSBuZXcgRmllbGQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IGZpZWxkRXhwcmVzc2lvbi5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC50eXBlTmFtZSA9IGZpZWxkRXhwcmVzc2lvbi50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQudHlwZSA9IHR5cGVzQnlOYW1lLmdldChmaWVsZEV4cHJlc3Npb24udHlwZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkRXhwcmVzc2lvbi5pbml0aWFsVmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkLnR5cGVOYW1lID09IFN0cmluZ1R5cGUudHlwZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gPHN0cmluZz5maWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZC50eXBlTmFtZSA9PSBOdW1iZXJUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IE51bWJlcihmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkRXhwcmVzc2lvbi5hc3NvY2lhdGVkRXhwcmVzc2lvbnMubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnZXRGaWVsZCA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLm5hbWUgPSBgPD5nZXRfJHtmaWVsZC5uYW1lfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5wYXJhbWV0ZXJzLnB1c2gobmV3IFBhcmFtZXRlcihcIjw+dmFsdWVcIiwgZmllbGQudHlwZU5hbWUpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLnJldHVyblR5cGUgPSBmaWVsZC50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGNvbnN0IGFzc29jaWF0ZWQgb2YgZmllbGRFeHByZXNzaW9uLmFzc29jaWF0ZWRFeHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGNvbnN0IGluc3RydWN0aW9uIG9mIHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihhc3NvY2lhdGVkKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLmJvZHkucHVzaChpbnN0cnVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZpZWxkLmJvZHkucHVzaChJbnN0cnVjdGlvbi5yZXR1cm4oKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8ubWV0aG9kcy5wdXNoKGdldEZpZWxkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT8uZmllbGRzLnB1c2goZmllbGQpOyAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpc1dvcmxkT2JqZWN0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgY3VycmVudCA9IHR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSB0eXBlc0J5TmFtZS5nZXQoY3VycmVudC5iYXNlVHlwZU5hbWUpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50Lm5hbWUgPT0gV29ybGRPYmplY3QudHlwZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzV29ybGRPYmplY3QgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1dvcmxkT2JqZWN0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzY3JpYmUgPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaWJlLm5hbWUgPSBXb3JsZE9iamVjdC5kZXNjcmliZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpYmUuYm9keS5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRQcm9wZXJ0eShXb3JsZE9iamVjdC5kZXNjcmlwdGlvbiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucmV0dXJuKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/Lm1ldGhvZHMucHVzaChkZXNjcmliZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZ2xvYmFsU2F5cyA9IGV4cHJlc3Npb24uZXhwcmVzc2lvbnMuZmlsdGVyKHggPT4geCBpbnN0YW5jZW9mIFNheUV4cHJlc3Npb24pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGdsb2JhbFNheXMubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoYDx+Pmdsb2JhbFNheXNgLCBTYXkudHlwZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGhvZCA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICAgICAgICAgIG1ldGhvZC5uYW1lID0gU2F5LnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kLnBhcmFtZXRlcnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0cnVjdGlvbnM6SW5zdHJ1Y3Rpb25bXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvcihjb25zdCBzYXkgb2YgZ2xvYmFsU2F5cyl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2F5RXhwcmVzc2lvbiA9IDxTYXlFeHByZXNzaW9uPnNheTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoc2F5RXhwcmVzc2lvbi50ZXh0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24ucmV0dXJuKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgIG1ldGhvZC5ib2R5ID0gaW5zdHJ1Y3Rpb25zO1xyXG5cclxuICAgICAgICAgICAgICAgIHR5cGUubWV0aG9kcy5wdXNoKG1ldGhvZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdHlwZXNCeU5hbWUuc2V0KHR5cGUubmFtZSwgdHlwZSk7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJVbmFibGUgdG8gcGFydGlhbGx5IHRyYW5zZm9ybVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHR5cGVzQnlOYW1lLnZhbHVlcygpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbjpFeHByZXNzaW9uKXtcclxuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbnM6SW5zdHJ1Y3Rpb25bXSA9IFtdO1xyXG5cclxuICAgICAgICBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIElmRXhwcmVzc2lvbil7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbmFsID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24uY29uZGl0aW9uYWwpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5jb25kaXRpb25hbCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpZkJsb2NrID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24uaWZCbG9jayk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsc2VCbG9jayA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmVsc2VCbG9jayk7XHJcblxyXG4gICAgICAgICAgICBpZkJsb2NrLnB1c2goSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmUoZWxzZUJsb2NrLmxlbmd0aCkpO1xyXG5cclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24uYnJhbmNoUmVsYXRpdmVJZkZhbHNlKGlmQmxvY2subGVuZ3RoKSlcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goLi4uaWZCbG9jayk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmVsc2VCbG9jayk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgU2F5RXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmxvYWRTdHJpbmcoZXhwcmVzc2lvbi50ZXh0KSk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLnByaW50KCkpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGV4cHJlc3Npb24udGV4dCkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIENvbnRhaW5zRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZE51bWJlcihleHByZXNzaW9uLmNvdW50KSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRTdHJpbmcoZXhwcmVzc2lvbi50eXBlTmFtZSksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkSW5zdGFuY2UoZXhwcmVzc2lvbi50YXJnZXROYW1lKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRGaWVsZChXb3JsZE9iamVjdC5jb250ZW50cyksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5pbnN0YW5jZUNhbGwoTGlzdC5jb250YWlucylcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gVE9ETzogTG9hZCB0aGUgbGVmdC1oYW5kIHNpZGUgc28gaXQgY2FuIGJlIGNvbmNhdGVuYXRlZCB3aGVuIHRoZSByaWdodCBzaWRlIGV2YWx1YXRlcy5cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5sZWZ0ISk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24ucmlnaHQhKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmxlZnQpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5yaWdodCk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmNvbmNhdGVuYXRlKCkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkSW5zdGFuY2UoXCI8Pml0XCIpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEZpZWxkKGV4cHJlc3Npb24ubmFtZSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byB0cmFuc2Zvcm0gdW5zdXBwb3J0ZWQgZXhwcmVzc2lvblwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0cnVjdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm1Jbml0aWFsVHlwZURlY2xhcmF0aW9uKGV4cHJlc3Npb246VHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUeXBlKGV4cHJlc3Npb24ubmFtZSwgZXhwcmVzc2lvbi5iYXNlVHlwZSEubmFtZSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHRlcm5DYWxsIH0gZnJvbSBcIi4vRXh0ZXJuQ2FsbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFueXsgICAgICAgIFxyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWU6c3RyaW5nID0gXCI8PmFueVwiOyAgXHJcbiAgICBcclxuICAgIHN0YXRpYyBtYWluID0gXCI8Pm1haW5cIjtcclxuICAgIHN0YXRpYyBleHRlcm5Ub1N0cmluZyA9IEV4dGVybkNhbGwub2YoXCI8PnRvU3RyaW5nXCIpO1xyXG59XHJcbiIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJvb2xlYW5UeXBle1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCI8PmJvb2xlYW5cIjtcclxufSIsImV4cG9ydCBjbGFzcyBFbnRyeVBvaW50QXR0cmlidXRle1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIjw+ZW50cnlQb2ludFwiO1xyXG59IiwiZXhwb3J0IGNsYXNzIEV4dGVybkNhbGx7XHJcbiAgICBzdGF0aWMgb2YobmFtZTpzdHJpbmcsIC4uLmFyZ3M6c3RyaW5nW10pe1xyXG4gICAgICAgIHJldHVybiBuZXcgRXh0ZXJuQ2FsbChuYW1lLCAuLi5hcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICBuYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICBhcmdzOnN0cmluZ1tdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTpzdHJpbmcsIC4uLmFyZ3M6c3RyaW5nW10pe1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcclxuICAgIH1cclxufSIsImltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vV29ybGRPYmplY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJdGVte1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lID0gXCI8Pml0ZW1cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlzdHtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwiPD5saXN0XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNvbnRhaW5zID0gXCI8PmNvbnRhaW5zXCI7XHJcblxyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lUGFyYW1ldGVyID0gXCI8PnR5cGVOYW1lXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY291bnRQYXJhbWV0ZXIgPSBcIjw+Y291bnRcIjtcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE51bWJlclR5cGV7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWUgPSBcIjw+bnVtYmVyXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbn0iLCJpbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuL1dvcmxkT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxhY2Uge1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIjw+cGxhY2VcIjtcclxuXHJcbiAgICBzdGF0aWMgaXNQbGF5ZXJTdGFydCA9IFwiPD5pc1BsYXllclN0YXJ0XCI7XHJcbn0iLCJpbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuL1dvcmxkT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVye1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lID0gXCI8PnBsYXllclwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBhcmVudFR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7ICAgIFxyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2F5e1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lID0gXCI8PnNheVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RyaW5nVHlwZXtcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHN0YXRpYyB0eXBlTmFtZSA9IFwiPD5zdHJpbmdcIjtcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVuZGVyc3RhbmRpbmd7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIjw+dW5kZXJzdGFuZGluZ1wiO1xyXG5cclxuICAgIHN0YXRpYyBkZXNjcmliaW5nID0gXCI8PmRlc2NyaWJpbmdcIjsgIFxyXG4gICAgc3RhdGljIG1vdmluZyA9IFwiPD5tb3ZpbmdcIjtcclxuICAgIHN0YXRpYyBkaXJlY3Rpb24gPSBcIjw+ZGlyZWN0aW9uXCI7XHJcbiAgICBzdGF0aWMgdGFraW5nID0gXCI8PnRha2luZ1wiO1xyXG4gICAgc3RhdGljIGludmVudG9yeSA9IFwiPD5pbnZlbnRvcnlcIjtcclxuXHJcbiAgICBzdGF0aWMgYWN0aW9uID0gXCI8PmFjdGlvblwiO1xyXG4gICAgc3RhdGljIG1lYW5pbmcgPSBcIjw+bWVhbmluZ1wiOyAgXHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZE9iamVjdCB7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIjw+d29ybGRPYmplY3RcIjtcclxuXHJcbiAgICBzdGF0aWMgZGVzY3JpcHRpb24gPSBcIjw+ZGVzY3JpcHRpb25cIjtcclxuICAgIHN0YXRpYyBjb250ZW50cyA9IFwiPD5jb250ZW50c1wiOyAgICBcclxuXHJcbiAgICBzdGF0aWMgZGVzY3JpYmUgPSBcIjw+ZGVzY3JpYmVcIjtcclxufSIsImltcG9ydCB7IFRhbG9uSWRlIH0gZnJvbSBcIi4vVGFsb25JZGVcIjtcclxuXHJcblxyXG52YXIgaWRlID0gbmV3IFRhbG9uSWRlKCk7IiwiZXhwb3J0IGVudW0gRXZhbHVhdGlvblJlc3VsdHtcclxuICAgIENvbnRpbnVlLFxyXG4gICAgU3VzcGVuZEZvcklucHV0XHJcbn0iLCJpbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuL2xpYnJhcnkvVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgU3RhY2tGcmFtZSB9IGZyb20gXCIuL1N0YWNrRnJhbWVcIjtcclxuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tIFwiLi4vY29tbW9uL0luc3RydWN0aW9uXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZXRob2RBY3RpdmF0aW9ue1xyXG4gICAgbWV0aG9kPzpNZXRob2Q7XHJcbiAgICBzdGFja0ZyYW1lOlN0YWNrRnJhbWU7XHJcbiAgICBzdGFjazpSdW50aW1lQW55W10gPSBbXTtcclxuXHJcbiAgICBzdGFja1NpemUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdGFjay5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcG9wKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2sucG9wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVzaChydW50aW1lQW55OlJ1bnRpbWVBbnkpe1xyXG4gICAgICAgIHRoaXMuc3RhY2sucHVzaChydW50aW1lQW55KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihtZXRob2Q6TWV0aG9kKXtcclxuICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcclxuICAgICAgICB0aGlzLnN0YWNrRnJhbWUgPSBuZXcgU3RhY2tGcmFtZShtZXRob2QpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgT3BDb2RlSGFuZGxlcntcclxuICAgIGNvZGU6T3BDb2RlID0gT3BDb2RlLk5vT3A7XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIHJldHVybiBFdmFsdWF0aW9uUmVzdWx0LkNvbnRpbnVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vTWV0aG9kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhY2tGcmFtZXtcclxuICAgIGxvY2FsczpWYXJpYWJsZVtdID0gW107XHJcbiAgICBjdXJyZW50SW5zdHJ1Y3Rpb246bnVtYmVyID0gLTE7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWV0aG9kOk1ldGhvZCl7XHJcbiAgICAgICAgZm9yKHZhciBwYXJhbWV0ZXIgb2YgbWV0aG9kLnBhcmFtZXRlcnMpe1xyXG4gICAgICAgICAgICBjb25zdCB2YXJpYWJsZSA9IG5ldyBWYXJpYWJsZShwYXJhbWV0ZXIubmFtZSwgcGFyYW1ldGVyLnR5cGUhKTtcclxuICAgICAgICAgICAgdGhpcy5sb2NhbHMucHVzaCh2YXJpYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgRW50cnlQb2ludEF0dHJpYnV0ZSB9IGZyb20gXCIuLi9saWJyYXJ5L0VudHJ5UG9pbnRBdHRyaWJ1dGVcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi9NZXRob2RBY3RpdmF0aW9uXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcbmltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuLi9jb21tb24vT3BDb2RlXCI7XHJcbmltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFByaW50SGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1ByaW50SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4vSU91dHB1dFwiO1xyXG5pbXBvcnQgeyBOb09wSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL05vT3BIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRTdHJpbmdIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZFN0cmluZ0hhbmRsZXJcIjtcclxuaW1wb3J0IHsgTmV3SW5zdGFuY2VIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTmV3SW5zdGFuY2VIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVDb21tYW5kIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lQ29tbWFuZFwiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IFJlYWRJbnB1dEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9SZWFkSW5wdXRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29tbWFuZEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9QYXJzZUNvbW1hbmRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEdvVG9IYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvR29Ub0hhbmRsZXJcIjtcclxuaW1wb3J0IHsgSGFuZGxlQ29tbWFuZEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9IYW5kbGVDb21tYW5kSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGFjZSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZVBsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVCb29sZWFuIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lQm9vbGVhblwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgU2F5IH0gZnJvbSBcIi4uL2xpYnJhcnkvU2F5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFbXB0eSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZUVtcHR5XCI7XHJcbmltcG9ydCB7IFJldHVybkhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9SZXR1cm5IYW5kbGVyXCI7XHJcbmltcG9ydCB7IFN0YXRpY0NhbGxIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvU3RhdGljQ2FsbEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxheWVyIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lUGxheWVyXCI7XHJcbmltcG9ydCB7IExvYWRJbnN0YW5jZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkSW5zdGFuY2VIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWROdW1iZXJIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZE51bWJlckhhbmRsZXJcIjtcclxuaW1wb3J0IHsgSW5zdGFuY2VDYWxsSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0luc3RhbmNlQ2FsbEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZFByb3BlcnR5SGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRQcm9wZXJ0eUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZEZpZWxkSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRGaWVsZEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgRXh0ZXJuYWxDYWxsSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0V4dGVybmFsQ2FsbEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgTG9hZExvY2FsSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRMb2NhbEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgSUxvZ091dHB1dCB9IGZyb20gXCIuL0lMb2dPdXRwdXRcIjtcclxuaW1wb3J0IHsgTG9hZFRoaXNIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZFRoaXNIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEJyYW5jaFJlbGF0aXZlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0JyYW5jaFJlbGF0aXZlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBCcmFuY2hSZWxhdGl2ZUlmRmFsc2VIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBDb25jYXRlbmF0ZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Db25jYXRlbmF0ZUhhbmRsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvblJ1bnRpbWV7XHJcblxyXG4gICAgcHJpdmF0ZSB0aHJlYWQ/OlRocmVhZDtcclxuICAgIHByaXZhdGUgaGFuZGxlcnM6TWFwPE9wQ29kZSwgT3BDb2RlSGFuZGxlcj4gPSBuZXcgTWFwPE9wQ29kZSwgT3BDb2RlSGFuZGxlcj4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHVzZXJPdXRwdXQ6SU91dHB1dCwgcHJpdmF0ZSByZWFkb25seSBsb2dPdXRwdXQ/OklMb2dPdXRwdXQpe1xyXG4gICAgICAgIHRoaXMudXNlck91dHB1dCA9IHVzZXJPdXRwdXQ7XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Ob09wLCBuZXcgTm9PcEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRTdHJpbmcsIG5ldyBMb2FkU3RyaW5nSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuUHJpbnQsIG5ldyBQcmludEhhbmRsZXIodGhpcy51c2VyT3V0cHV0KSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLk5ld0luc3RhbmNlLCBuZXcgTmV3SW5zdGFuY2VIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5SZWFkSW5wdXQsIG5ldyBSZWFkSW5wdXRIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5QYXJzZUNvbW1hbmQsIG5ldyBQYXJzZUNvbW1hbmRIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5IYW5kbGVDb21tYW5kLCBuZXcgSGFuZGxlQ29tbWFuZEhhbmRsZXIodGhpcy51c2VyT3V0cHV0KSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkdvVG8sIG5ldyBHb1RvSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuUmV0dXJuLCBuZXcgUmV0dXJuSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuU3RhdGljQ2FsbCwgbmV3IFN0YXRpY0NhbGxIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkSW5zdGFuY2UsIG5ldyBMb2FkSW5zdGFuY2VIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkTnVtYmVyLCBuZXcgTG9hZE51bWJlckhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkluc3RhbmNlQ2FsbCwgbmV3IEluc3RhbmNlQ2FsbEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRQcm9wZXJ0eSwgbmV3IExvYWRQcm9wZXJ0eUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRGaWVsZCwgbmV3IExvYWRGaWVsZEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkV4dGVybmFsQ2FsbCwgbmV3IEV4dGVybmFsQ2FsbEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRMb2NhbCwgbmV3IExvYWRMb2NhbEhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkxvYWRUaGlzLCBuZXcgTG9hZFRoaXNIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5CcmFuY2hSZWxhdGl2ZSwgbmV3IEJyYW5jaFJlbGF0aXZlSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuQnJhbmNoUmVsYXRpdmVJZkZhbHNlLCBuZXcgQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuQ29uY2F0ZW5hdGUsIG5ldyBDb25jYXRlbmF0ZUhhbmRsZXIoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQoKXtcclxuICAgICAgICBjb25zdCBwbGFjZXMgPSB0aGlzLnRocmVhZD8uYWxsVHlwZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcih4ID0+IHguYmFzZVR5cGVOYW1lID09IFBsYWNlLnR5cGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKHggPT4gPFJ1bnRpbWVQbGF5ZXI+TWVtb3J5LmFsbG9jYXRlKHgpKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2V0UGxheWVyU3RhcnQgPSAocGxhY2U6UnVudGltZVBsYWNlKSA9PiA8UnVudGltZUJvb2xlYW4+KHBsYWNlLmZpZWxkcy5nZXQoUGxhY2UuaXNQbGF5ZXJTdGFydCk/LnZhbHVlKTtcclxuICAgICAgICBjb25zdCBpc1BsYXllclN0YXJ0ID0gKHBsYWNlOlJ1bnRpbWVQbGFjZSkgPT4gZ2V0UGxheWVyU3RhcnQocGxhY2UpPy52YWx1ZSA9PT0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudFBsYWNlID0gcGxhY2VzPy5maW5kKGlzUGxheWVyU3RhcnQpO1xyXG5cclxuICAgICAgICB0aGlzLnRocmVhZCEuY3VycmVudFBsYWNlID0gY3VycmVudFBsYWNlO1xyXG5cclxuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLnRocmVhZD8ua25vd25UeXBlcy5nZXQoUGxheWVyLnR5cGVOYW1lKSE7XHJcblxyXG4gICAgICAgIHRoaXMudGhyZWFkIS5jdXJyZW50UGxheWVyID0gPFJ1bnRpbWVQbGF5ZXI+TWVtb3J5LmFsbG9jYXRlKHBsYXllcik7XHJcblxyXG4gICAgICAgIHRoaXMucnVuV2l0aChcIlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGxvYWRGcm9tKHR5cGVzOlR5cGVbXSl7XHJcbiAgICAgICAgY29uc3QgbG9hZGVkVHlwZXMgPSBNZW1vcnkubG9hZFR5cGVzKHR5cGVzKTtcclxuXHJcbiAgICAgICAgY29uc3QgZW50cnlQb2ludCA9IGxvYWRlZFR5cGVzLmZpbmQoeCA9PiB4LmF0dHJpYnV0ZXMuZmluZEluZGV4KGF0dHJpYnV0ZSA9PiBhdHRyaWJ1dGUgaW5zdGFuY2VvZiBFbnRyeVBvaW50QXR0cmlidXRlKSA+IC0xKTtcclxuICAgICAgICBjb25zdCBtYWluTWV0aG9kID0gZW50cnlQb2ludD8ubWV0aG9kcy5maW5kKHggPT4geC5uYW1lID09IEFueS5tYWluKTsgICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRpb24gPSBuZXcgTWV0aG9kQWN0aXZhdGlvbihtYWluTWV0aG9kISk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50aHJlYWQgPSBuZXcgVGhyZWFkKGxvYWRlZFR5cGVzLCBhY3RpdmF0aW9uKTsgIFxyXG4gICAgICAgIHRoaXMudGhyZWFkLmxvZyA9IHRoaXMubG9nT3V0cHV0OyAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHNlbmRDb21tYW5kKGlucHV0OnN0cmluZyl7XHJcbiAgICAgICAgdGhpcy5ydW5XaXRoKGlucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJ1bldpdGgoY29tbWFuZDpzdHJpbmcpe1xyXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uID0gdGhpcy50aHJlYWQhLmN1cnJlbnRJbnN0cnVjdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKGluc3RydWN0aW9uPy5vcENvZGUgPT0gT3BDb2RlLlJlYWRJbnB1dCl7XHJcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBNZW1vcnkuYWxsb2NhdGVTdHJpbmcoY29tbWFuZCk7XHJcbiAgICAgICAgICAgIHRoaXMudGhyZWFkPy5jdXJyZW50TWV0aG9kLnB1c2godGV4dCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRocmVhZD8ubW92ZU5leHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRocmVhZD8uY3VycmVudEluc3RydWN0aW9uID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRoaXMudGhyZWFkPy5tb3ZlTmV4dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMudGhyZWFkPy5jdXJyZW50SW5zdHJ1Y3Rpb24gPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBleGVjdXRlIGNvbW1hbmQsIG5vIGluc3RydWN0aW9uIGZvdW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yKGxldCBpbnN0cnVjdGlvbiA9IHRoaXMuZXZhbHVhdGVDdXJyZW50SW5zdHJ1Y3Rpb24oKTtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb24gPT0gRXZhbHVhdGlvblJlc3VsdC5Db250aW51ZTtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb24gPSB0aGlzLmV2YWx1YXRlQ3VycmVudEluc3RydWN0aW9uKCkpe1xyXG5cclxuICAgICAgICAgICAgdGhpcy50aHJlYWQ/Lm1vdmVOZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZXZhbHVhdGVDdXJyZW50SW5zdHJ1Y3Rpb24oKXtcclxuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IHRoaXMudGhyZWFkPy5jdXJyZW50SW5zdHJ1Y3Rpb247XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSB0aGlzLmhhbmRsZXJzLmdldChpbnN0cnVjdGlvbj8ub3BDb2RlISk7XHJcblxyXG4gICAgICAgIGlmIChoYW5kbGVyID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYEVuY291bnRlcmVkIHVuc3VwcG9ydGVkIE9wQ29kZSAke2luc3RydWN0aW9uPy5vcENvZGV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBoYW5kbGVyPy5oYW5kbGUodGhpcy50aHJlYWQhKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi9NZXRob2RBY3RpdmF0aW9uXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1VuZGVyc3RhbmRpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYWNlIH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lUGxhY2VcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYXllciB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZVBsYXllclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRW1wdHkgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVFbXB0eVwiO1xyXG5pbXBvcnQgeyBJTG9nT3V0cHV0IH0gZnJvbSBcIi4vSUxvZ091dHB1dFwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRocmVhZHtcclxuICAgIGFsbFR5cGVzOlR5cGVbXSA9IFtdO1xyXG4gICAga25vd25UeXBlczpNYXA8c3RyaW5nLCBUeXBlPiA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlPigpO1xyXG4gICAga25vd25VbmRlcnN0YW5kaW5nczpUeXBlW10gPSBbXTtcclxuICAgIGtub3duUGxhY2VzOlJ1bnRpbWVQbGFjZVtdID0gW107XHJcbiAgICBtZXRob2RzOk1ldGhvZEFjdGl2YXRpb25bXSA9IFtdO1xyXG4gICAgY3VycmVudFBsYWNlPzpSdW50aW1lUGxhY2U7XHJcbiAgICBjdXJyZW50UGxheWVyPzpSdW50aW1lUGxheWVyO1xyXG4gICAgbG9nPzpJTG9nT3V0cHV0O1xyXG4gICAgXHJcbiAgICBnZXQgY3VycmVudE1ldGhvZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tZXRob2RzW3RoaXMubWV0aG9kcy5sZW5ndGggLSAxXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudEluc3RydWN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRpb24gPSB0aGlzLmN1cnJlbnRNZXRob2Q7XHJcbiAgICAgICAgcmV0dXJuIGFjdGl2YXRpb24ubWV0aG9kPy5ib2R5W2FjdGl2YXRpb24uc3RhY2tGcmFtZS5jdXJyZW50SW5zdHJ1Y3Rpb25dO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHR5cGVzOlR5cGVbXSwgbWV0aG9kOk1ldGhvZEFjdGl2YXRpb24pe1xyXG4gICAgICAgIHRoaXMuYWxsVHlwZXMgPSB0eXBlcztcclxuICAgICAgICB0aGlzLmtub3duVHlwZXMgPSBuZXcgTWFwPHN0cmluZywgVHlwZT4odHlwZXMubWFwKHR5cGUgPT4gW3R5cGUubmFtZSwgdHlwZV0pKTtcclxuICAgICAgICB0aGlzLmtub3duVW5kZXJzdGFuZGluZ3MgPSB0eXBlcy5maWx0ZXIoeCA9PiB4LmJhc2VUeXBlTmFtZSA9PT0gVW5kZXJzdGFuZGluZy50eXBlTmFtZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tZXRob2RzLnB1c2gobWV0aG9kKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3RpdmF0ZU1ldGhvZChtZXRob2Q6TWV0aG9kKXtcclxuICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gbmV3IE1ldGhvZEFjdGl2YXRpb24obWV0aG9kKTtcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5jdXJyZW50TWV0aG9kO1xyXG5cclxuICAgICAgICB0aGlzLmxvZz8uZGVidWcoYCR7Y3VycmVudC5tZXRob2Q/Lm5hbWV9ID09PiAke21ldGhvZC5uYW1lfWApO1xyXG5cclxuICAgICAgICB0aGlzLm1ldGhvZHMucHVzaChhY3RpdmF0aW9uKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbW92ZU5leHQoKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRNZXRob2Quc3RhY2tGcmFtZS5jdXJyZW50SW5zdHJ1Y3Rpb24rKztcclxuICAgIH1cclxuXHJcbiAgICBqdW1wVG9MaW5lKGxpbmVOdW1iZXI6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRNZXRob2Quc3RhY2tGcmFtZS5jdXJyZW50SW5zdHJ1Y3Rpb24gPSBsaW5lTnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybkZyb21DdXJyZW50TWV0aG9kKCl7XHJcbiAgICAgICAgY29uc3QgZXhwZWN0UmV0dXJuVHlwZSA9IHRoaXMuY3VycmVudE1ldGhvZC5tZXRob2QhLnJldHVyblR5cGUgIT0gXCJcIjtcclxuICAgICAgICBjb25zdCByZXR1cm5lZE1ldGhvZCA9IHRoaXMubWV0aG9kcy5wb3AoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2c/LmRlYnVnKGAke3RoaXMuY3VycmVudE1ldGhvZC5tZXRob2Q/Lm5hbWV9IDw9PSAke3JldHVybmVkTWV0aG9kPy5tZXRob2Q/Lm5hbWV9YCk7XHJcblxyXG4gICAgICAgIGlmICghZXhwZWN0UmV0dXJuVHlwZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUnVudGltZUVtcHR5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXR1cm5WYWx1ZSA9IHJldHVybmVkTWV0aG9kPy5zdGFjay5wb3AoKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWUhO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGFjZSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVQbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRW1wdHkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lRW1wdHlcIjtcclxuaW1wb3J0IHsgUnVudGltZUNvbW1hbmQgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQ29tbWFuZFwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVCb29sZWFuIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUJvb2xlYW5cIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgUnVudGltZUxpc3QgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lTGlzdFwiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvSXRlbVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lSXRlbSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJdGVtXCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYXllclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxheWVyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVBsYXllclwiO1xyXG5pbXBvcnQgeyBTYXkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9TYXlcIjtcclxuaW1wb3J0IHsgUnVudGltZVNheSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTYXlcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9NZXRob2RcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSW50ZWdlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lbW9yeXtcclxuICAgIHByaXZhdGUgc3RhdGljIHR5cGVzQnlOYW1lID0gbmV3IE1hcDxzdHJpbmcsIFR5cGU+KCk7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZWFwID0gbmV3IE1hcDxzdHJpbmcsIFJ1bnRpbWVBbnlbXT4oKTtcclxuXHJcbiAgICBzdGF0aWMgZmluZEluc3RhbmNlQnlOYW1lKG5hbWU6c3RyaW5nKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZXMgPSBNZW1vcnkuaGVhcC5nZXQobmFtZSk7XHJcblxyXG4gICAgICAgIGlmICghaW5zdGFuY2VzIHx8IGluc3RhbmNlcy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJPYmplY3Qgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGluc3RhbmNlcy5sZW5ndGggPiAxKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIkxvY2F0ZWQgbW9yZSB0aGFuIG9uZSBpbnN0YW5jZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZXNbMF07XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRUeXBlcyh0eXBlczpUeXBlW10pe1xyXG4gICAgICAgIE1lbW9yeS50eXBlc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlPih0eXBlcy5tYXAoeCA9PiBbeC5uYW1lLCB4XSkpOyAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIE92ZXJyaWRlIGFueSBwcm92aWRlZCB0eXBlIHN0dWJzIHdpdGggdGhlIGFjdHVhbCBydW50aW1lIHR5cGUgZGVmaW5pdGlvbnMuXHJcblxyXG4gICAgICAgIGNvbnN0IHBsYWNlID0gUnVudGltZVBsYWNlLnR5cGU7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IFJ1bnRpbWVJdGVtLnR5cGU7XHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gUnVudGltZVBsYXllci50eXBlO1xyXG5cclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUuc2V0KHBsYWNlLm5hbWUsIHBsYWNlKTtcclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUuc2V0KGl0ZW0ubmFtZSwgaXRlbSk7XHJcbiAgICAgICAgTWVtb3J5LnR5cGVzQnlOYW1lLnNldChwbGF5ZXIubmFtZSwgcGxheWVyKTsgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKE1lbW9yeS50eXBlc0J5TmFtZS52YWx1ZXMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG9jYXRlQ29tbWFuZCgpOlJ1bnRpbWVDb21tYW5ke1xyXG4gICAgICAgIHJldHVybiBuZXcgUnVudGltZUNvbW1hbmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGVCb29sZWFuKHZhbHVlOmJvb2xlYW4pOlJ1bnRpbWVCb29sZWFue1xyXG4gICAgICAgIHJldHVybiBuZXcgUnVudGltZUJvb2xlYW4odmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZU51bWJlcih2YWx1ZTpudW1iZXIpOlJ1bnRpbWVJbnRlZ2Vye1xyXG4gICAgICAgIHJldHVybiBuZXcgUnVudGltZUludGVnZXIodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZVN0cmluZyh0ZXh0OnN0cmluZyk6UnVudGltZVN0cmluZ3tcclxuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVTdHJpbmcodGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG9jYXRlKHR5cGU6VHlwZSk6UnVudGltZUFueXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IE1lbW9yeS5jb25zdHJ1Y3RJbnN0YW5jZUZyb20odHlwZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlUG9vbCA9IE1lbW9yeS5oZWFwLmdldCh0eXBlLm5hbWUpIHx8IFtdO1xyXG5cclxuICAgICAgICBpbnN0YW5jZVBvb2wucHVzaChpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgIE1lbW9yeS5oZWFwLnNldCh0eXBlLm5hbWUsIGluc3RhbmNlUG9vbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbml0aWFsaXplVmFyaWFibGVXaXRoKGZpZWxkOkZpZWxkKXtcclxuXHJcbiAgICAgICAgY29uc3QgdmFyaWFibGUgPSBNZW1vcnkuY29uc3RydWN0VmFyaWFibGVGcm9tKGZpZWxkKTsgICAgICAgIFxyXG4gICAgICAgIHZhcmlhYmxlLnZhbHVlID0gTWVtb3J5Lmluc3RhbnRpYXRlRGVmYXVsdFZhbHVlRm9yKHZhcmlhYmxlLCBmaWVsZC5kZWZhdWx0VmFsdWUpO1xyXG5cclxuICAgICAgICByZXR1cm4gdmFyaWFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY29uc3RydWN0VmFyaWFibGVGcm9tKGZpZWxkOkZpZWxkKXtcclxuICAgICAgICBpZiAoZmllbGQudHlwZSl7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFyaWFibGUoZmllbGQubmFtZSwgZmllbGQudHlwZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0eXBlID0gTWVtb3J5LnR5cGVzQnlOYW1lLmdldChmaWVsZC50eXBlTmFtZSk7XHJcblxyXG4gICAgICAgIGlmICghdHlwZSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFVuYWJsZSB0byBjb25zdHJ1Y3QgdW5rbm93biB0eXBlICcke2ZpZWxkLnR5cGVOYW1lfSdgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVmFyaWFibGUoZmllbGQubmFtZSwgdHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFudGlhdGVEZWZhdWx0VmFsdWVGb3IodmFyaWFibGU6VmFyaWFibGUsIGRlZmF1bHRWYWx1ZTpPYmplY3R8dW5kZWZpbmVkKXtcclxuICAgICAgICBcclxuICAgICAgICBzd2l0Y2godmFyaWFibGUudHlwZSEubmFtZSl7XHJcbiAgICAgICAgICAgIGNhc2UgU3RyaW5nVHlwZS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lU3RyaW5nKGRlZmF1bHRWYWx1ZSA/IDxzdHJpbmc+ZGVmYXVsdFZhbHVlIDogXCJcIik7XHJcbiAgICAgICAgICAgIGNhc2UgQm9vbGVhblR5cGUudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZUJvb2xlYW4oZGVmYXVsdFZhbHVlID8gPGJvb2xlYW4+ZGVmYXVsdFZhbHVlIDogZmFsc2UpO1xyXG4gICAgICAgICAgICBjYXNlIExpc3QudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZUxpc3QoZGVmYXVsdFZhbHVlID8gdGhpcy5pbnN0YW50aWF0ZUxpc3QoPE9iamVjdFtdPmRlZmF1bHRWYWx1ZSkgOiBbXSk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVFbXB0eSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW50aWF0ZUxpc3QoaXRlbXM6T2JqZWN0W10pe1xyXG4gICAgICAgIGNvbnN0IHJ1bnRpbWVJdGVtczpSdW50aW1lQW55W10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGNvbnN0IGl0ZW0gb2YgaXRlbXMpe1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtTGlzdCA9IDxPYmplY3RbXT5pdGVtO1xyXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IDxudW1iZXI+aXRlbUxpc3RbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVOYW1lID0gPHN0cmluZz5pdGVtTGlzdFsxXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBNZW1vcnkudHlwZXNCeU5hbWUuZ2V0KHR5cGVOYW1lKSE7XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IGN1cnJlbnQgPSAwOyBjdXJyZW50IDwgY291bnQ7IGN1cnJlbnQrKyl7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBNZW1vcnkuYWxsb2NhdGUodHlwZSk7XHJcbiAgICAgICAgICAgICAgICBydW50aW1lSXRlbXMucHVzaChpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydW50aW1lSXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY29uc3RydWN0SW5zdGFuY2VGcm9tKHR5cGU6VHlwZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNlZW5UeXBlcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xyXG4gICAgICAgIGxldCBpbmhlcml0YW5jZUNoYWluOlR5cGVbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGN1cnJlbnQ6VHlwZXx1bmRlZmluZWQgPSB0eXBlOyBcclxuICAgICAgICAgICAgY3VycmVudDsgXHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBNZW1vcnkudHlwZXNCeU5hbWUuZ2V0KGN1cnJlbnQuYmFzZVR5cGVOYW1lKSl7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmIChzZWVuVHlwZXMuaGFzKGN1cnJlbnQubmFtZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJZb3UgY2FuJ3QgaGF2ZSBjeWNsZXMgaW4gYSB0eXBlIGhpZXJhcmNoeVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZWVuVHlwZXMuYWRkKGN1cnJlbnQubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpbmhlcml0YW5jZUNoYWluLnB1c2goY3VycmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBmaXJzdFN5c3RlbVR5cGVBbmNlc3RvckluZGV4ID0gaW5oZXJpdGFuY2VDaGFpbi5maW5kSW5kZXgoeCA9PiB4LmlzU3lzdGVtVHlwZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICBpZiAoZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleCA8IDApe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVHlwZSBtdXN0IHVsdGltYXRlbHkgaW5oZXJpdCBmcm9tIGEgc3lzdGVtIHR5cGVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuYWxsb2NhdGVTeXN0ZW1UeXBlQnlOYW1lKGluaGVyaXRhbmNlQ2hhaW5bZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleF0ubmFtZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaW5zdGFuY2UucGFyZW50VHlwZU5hbWUgPSBpbnN0YW5jZS50eXBlTmFtZTtcclxuICAgICAgICBpbnN0YW5jZS50eXBlTmFtZSA9IGluaGVyaXRhbmNlQ2hhaW5bMF0ubmFtZTtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogSW5oZXJpdCBtb3JlIHRoYW4ganVzdCBmaWVsZHMvbWV0aG9kcy5cclxuICAgICAgICAvLyBUT0RPOiBUeXBlIGNoZWNrIGZpZWxkIGluaGVyaXRhbmNlIGZvciBzaGFkb3dpbmcvb3ZlcnJpZGluZy5cclxuXHJcbiAgICAgICAgLy8gSW5oZXJpdCBmaWVsZHMvbWV0aG9kcyBmcm9tIHR5cGVzIGluIHRoZSBoaWVyYXJjaHkgZnJvbSBsZWFzdCB0byBtb3N0IGRlcml2ZWQuXHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBpID0gZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleDsgaSA+PSAwOyBpLS0pe1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VHlwZSA9IGluaGVyaXRhbmNlQ2hhaW5baV07XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgZmllbGQgb2YgY3VycmVudFR5cGUuZmllbGRzKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhcmlhYmxlID0gdGhpcy5pbml0aWFsaXplVmFyaWFibGVXaXRoKGZpZWxkKTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmZpZWxkcy5zZXQoZmllbGQubmFtZSwgdmFyaWFibGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgbWV0aG9kIG9mIGN1cnJlbnRUeXBlLm1ldGhvZHMpe1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UubWV0aG9kcy5zZXQobWV0aG9kLm5hbWUsIG1ldGhvZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGFsbG9jYXRlU3lzdGVtVHlwZUJ5TmFtZSh0eXBlTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHN3aXRjaCh0eXBlTmFtZSl7XHJcbiAgICAgICAgICAgIGNhc2UgUGxhY2UudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVBsYWNlKCk7XHJcbiAgICAgICAgICAgIGNhc2UgSXRlbS50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lSXRlbSgpO1xyXG4gICAgICAgICAgICBjYXNlIFBsYXllci50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lUGxheWVyKCk7XHJcbiAgICAgICAgICAgIGNhc2UgTGlzdC50eXBlTmFtZTogcmV0dXJuIG5ldyBSdW50aW1lTGlzdChbXSk7ICAgICBcclxuICAgICAgICAgICAgY2FzZSBTYXkudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVNheSgpOyAgICAgICBcclxuICAgICAgICAgICAgZGVmYXVsdDp7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBVbmFibGUgdG8gaW5zdGFudGlhdGUgdHlwZSAnJHt0eXBlTmFtZX0nYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgUnVudGltZUVycm9ye1xyXG4gICAgbWVzc2FnZTpzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJyYW5jaFJlbGF0aXZlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpdmVBbW91bnQgPSA8bnVtYmVyPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlO1xyXG5cclxuICAgICAgICB0aHJlYWQuanVtcFRvTGluZSh0aHJlYWQuY3VycmVudE1ldGhvZC5zdGFja0ZyYW1lLmN1cnJlbnRJbnN0cnVjdGlvbiArIHJlbGF0aXZlQW1vdW50KTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQm9vbGVhbiB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVCb29sZWFuXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgcmVsYXRpdmVBbW91bnQgPSA8bnVtYmVyPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gPFJ1bnRpbWVCb29sZWFuPnRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAoIXZhbHVlLnZhbHVlKXtcclxuICAgICAgICAgICAgdGhyZWFkLmp1bXBUb0xpbmUodGhyZWFkLmN1cnJlbnRNZXRob2Quc3RhY2tGcmFtZS5jdXJyZW50SW5zdHJ1Y3Rpb24gKyByZWxhdGl2ZUFtb3VudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29uY2F0ZW5hdGVIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBsYXN0ID0gPFJ1bnRpbWVTdHJpbmc+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcbiAgICAgICAgY29uc3QgZmlyc3QgPSA8UnVudGltZVN0cmluZz50aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29uY2F0ZW5hdGVkID0gTWVtb3J5LmFsbG9jYXRlU3RyaW5nKGZpcnN0LnZhbHVlICsgXCIgXCIgKyBsYXN0LnZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChjb25jYXRlbmF0ZWQpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5cclxuaW50ZXJmYWNlIElJbmRleGFibGV7XHJcbiAgICBbbmFtZTpzdHJpbmddOiguLi5hcmdzOlJ1bnRpbWVBbnlbXSk9PlJ1bnRpbWVBbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFeHRlcm5hbENhbGxIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIFxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBtZXRob2ROYW1lID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgbWV0aG9kID0gdGhpcy5sb2NhdGVGdW5jdGlvbihpbnN0YW5jZSEsIDxzdHJpbmc+bWV0aG9kTmFtZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGBjYWxsLmV4dGVyblxcdCR7aW5zdGFuY2U/LnR5cGVOYW1lfTo6JHttZXRob2ROYW1lfSguLi4ke21ldGhvZC5sZW5ndGh9KWApO1xyXG5cclxuICAgICAgICBjb25zdCBhcmdzOlJ1bnRpbWVBbnlbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWV0aG9kLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgYXJncy5wdXNoKHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpISk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQgPSBtZXRob2QuY2FsbChpbnN0YW5jZSwgLi4uYXJncyk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2gocmVzdWx0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9jYXRlRnVuY3Rpb24oaW5zdGFuY2U6T2JqZWN0LCBtZXRob2ROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuICg8SUluZGV4YWJsZT5pbnN0YW5jZSlbbWV0aG9kTmFtZV07XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lSW50ZWdlciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJbnRlZ2VyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR29Ub0hhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbk51bWJlciA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGluc3RydWN0aW9uTnVtYmVyID09PSBcIm51bWJlclwiKXtcclxuICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBqdW1wIG9uZSBwcmV2aW91cyB0byB0aGUgZGVzaXJlZCBpbnN0cnVjdGlvbiBiZWNhdXNlIGFmdGVyIFxyXG4gICAgICAgICAgICAvLyBldmFsdWF0aW5nIHRoaXMgZ290byB3ZSdsbCBtb3ZlIGZvcndhcmQgKHdoaWNoIHdpbGwgbW92ZSB0byB0aGUgZGVzaXJlZCBvbmUpLlxyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmp1bXBUb0xpbmUoaW5zdHJ1Y3Rpb25OdW1iZXIgLSAxKTtcclxuICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gZ290b1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVDb21tYW5kIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUNvbW1hbmRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgVW5kZXJzdGFuZGluZyB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1VuZGVyc3RhbmRpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZVVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lVW5kZXJzdGFuZGluZ1wiO1xyXG5pbXBvcnQgeyBNZWFuaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvTWVhbmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBJT3V0cHV0IH0gZnJvbSBcIi4uL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuaW1wb3J0IHsgUnVudGltZUxpc3QgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lTGlzdFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxhY2UgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lUGxhY2VcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYXllciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgTG9hZFByb3BlcnR5SGFuZGxlciB9IGZyb20gXCIuL0xvYWRQcm9wZXJ0eUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUHJpbnRIYW5kbGVyIH0gZnJvbSBcIi4vUHJpbnRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9JbnN0YW5jZUNhbGxIYW5kbGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSGFuZGxlQ29tbWFuZEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBvdXRwdXQ6SU91dHB1dCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAoY29tbWFuZCBpbnN0YW5jZW9mIFJ1bnRpbWVDb21tYW5kKXtcclxuICAgICAgICAgICAgY29uc3QgYWN0aW9uID0gY29tbWFuZC5hY3Rpb24hLnZhbHVlO1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXROYW1lID0gY29tbWFuZC50YXJnZXROYW1lIS52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVuZGVyc3RhbmRpbmdzID0gdGhyZWFkLmtub3duVW5kZXJzdGFuZGluZ3M7XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgdHlwZSBvZiB1bmRlcnN0YW5kaW5ncyl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb25GaWVsZCA9IHR5cGUuZmllbGRzLmZpbmQoeCA9PiB4Lm5hbWUgPT0gVW5kZXJzdGFuZGluZy5hY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWVhbmluZ0ZpZWxkID0gdHlwZS5maWVsZHMuZmluZCh4ID0+IHgubmFtZSA9PSBVbmRlcnN0YW5kaW5nLm1lYW5pbmcpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT0gYWN0aW9uRmllbGQ/LmRlZmF1bHRWYWx1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVhbmluZyA9IHRoaXMuZGV0ZXJtaW5lTWVhbmluZ0Zvcig8c3RyaW5nPm1lYW5pbmdGaWVsZD8uZGVmYXVsdFZhbHVlISk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBhY3R1YWxUYXJnZXROYW1lID0gdGhpcy5pbmZlclRhcmdldEZyb20odGhyZWFkLCB0YXJnZXROYW1lLCBtZWFuaW5nKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWFjdHVhbFRhcmdldE5hbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm91dHB1dC53cml0ZShcIkkgZG9uJ3Qga25vdyBob3cgdG8gZG8gdGhhdC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhyZWFkLmtub3duVHlwZXMuZ2V0KGFjdHVhbFRhcmdldE5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRhcmdldCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gbG9jYXRlIHR5cGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMubG9jYXRlVGFyZ2V0SW5zdGFuY2UodGhyZWFkLCB0YXJnZXQsIG1lYW5pbmcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIFJ1bnRpbWVXb3JsZE9iamVjdCkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGxvY2F0ZSB3b3JsZCB0eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoKG1lYW5pbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIE1lYW5pbmcuRGVzY3JpYmluZzp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaWJlKHRocmVhZCwgaW5zdGFuY2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBNZWFuaW5nLk1vdmluZzogeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJlYWQuY3VycmVudFBsYWNlID0gPFJ1bnRpbWVQbGFjZT5pbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpYmUodGhyZWFkLCBpbnN0YW5jZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIE1lYW5pbmcuVGFraW5nOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsaXN0ID0gdGhyZWFkLmN1cnJlbnRQbGFjZSEuZ2V0RmllbGRBc0xpc3QoV29ybGRPYmplY3QuY29udGVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5pdGVtcyA9IGxpc3QuaXRlbXMuZmlsdGVyKHggPT4geC50eXBlTmFtZSAhPSB0YXJnZXQubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGludmVudG9yeSA9IHRocmVhZC5jdXJyZW50UGxheWVyIS5nZXRGaWVsZEFzTGlzdChXb3JsZE9iamVjdC5jb250ZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZlbnRvcnkuaXRlbXMucHVzaChpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZSh0aHJlYWQsIHRocmVhZC5jdXJyZW50UGxhY2UhLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgTWVhbmluZy5JbnZlbnRvcnk6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW52ZW50b3J5ID0gKDxSdW50aW1lUGxheWVyPmluc3RhbmNlKS5nZXRGaWVsZEFzTGlzdChXb3JsZE9iamVjdC5jb250ZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaWJlQ29udGVudHModGhyZWFkLCBpbnZlbnRvcnkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuc3VwcG9ydGVkIG1lYW5pbmcgZm91bmRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGV4ZWN1dGUgY29tbWFuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvY2F0ZVRhcmdldEluc3RhbmNlKHRocmVhZDpUaHJlYWQsIHRhcmdldDpUeXBlLCBtZWFuaW5nOk1lYW5pbmcpOlJ1bnRpbWVBbnl8dW5kZWZpbmVke1xyXG4gICAgICAgIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLlRha2luZyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSA8UnVudGltZUxpc3Q+dGhyZWFkLmN1cnJlbnRQbGFjZSEuZmllbGRzLmdldChXb3JsZE9iamVjdC5jb250ZW50cyk/LnZhbHVlO1xyXG4gICAgICAgICAgICBjb25zdCBtYXRjaGluZ0l0ZW1zID0gbGlzdC5pdGVtcy5maWx0ZXIoeCA9PiB4LnR5cGVOYW1lID09PSB0YXJnZXQubmFtZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAobWF0Y2hpbmdJdGVtcy5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hpbmdJdGVtc1swXTtcclxuICAgICAgICB9IGVsc2UgeyAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBNZW1vcnkuZmluZEluc3RhbmNlQnlOYW1lKHRhcmdldC5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbmZlclRhcmdldEZyb20odGhyZWFkOlRocmVhZCwgdGFyZ2V0TmFtZTpzdHJpbmcsIG1lYW5pbmc6TWVhbmluZyl7XHJcbiAgICAgICAgaWYgKG1lYW5pbmcgPT09IE1lYW5pbmcuTW92aW5nKXtcclxuICAgICAgICAgICAgY29uc3QgcGxhY2VOYW1lID0gPFJ1bnRpbWVTdHJpbmc+dGhyZWFkLmN1cnJlbnRQbGFjZT8uZmllbGRzLmdldChgPD4ke3RhcmdldE5hbWV9YCk/LnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFwbGFjZU5hbWUpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHBsYWNlTmFtZS52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLkludmVudG9yeSl7XHJcbiAgICAgICAgICAgIHJldHVybiBQbGF5ZXIudHlwZU5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGFyZ2V0TmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlc2NyaWJlKHRocmVhZDpUaHJlYWQsIHRhcmdldDpSdW50aW1lV29ybGRPYmplY3QsIGlzU2hhbGxvd0Rlc2NyaXB0aW9uOmJvb2xlYW4pe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godGFyZ2V0KTtcclxuXHJcbiAgICAgICAgY29uc3QgZGVzY3JpYmVUeXBlID0gbmV3IEluc3RhbmNlQ2FsbEhhbmRsZXIoV29ybGRPYmplY3QuZGVzY3JpYmUpO1xyXG4gICAgICAgIGRlc2NyaWJlVHlwZS5oYW5kbGUodGhyZWFkKTtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgZGVzY3JpcHRpb24gPSB0YXJnZXQuZmllbGRzLmdldChXb3JsZE9iamVjdC5kZXNjcmlwdGlvbik/LnZhbHVlO1xyXG4gICAgICAgIC8vIGNvbnN0IGNvbnRlbnRzID0gdGFyZ2V0LmZpZWxkcy5nZXQoV29ybGRPYmplY3QuY29udGVudHMpPy52YWx1ZTtcclxuXHJcbiAgICAgICAgLy8gaWYgKCEoZGVzY3JpcHRpb24gaW5zdGFuY2VvZiBSdW50aW1lU3RyaW5nKSl7XHJcbiAgICAgICAgLy8gICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gZGVzY3JpYmUgd2l0aG91dCBhIHN0cmluZ1wiKTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIC8vIHRoaXMub3V0cHV0LndyaXRlKGRlc2NyaXB0aW9uLnZhbHVlKTtcclxuXHJcbiAgICAgICAgLy8gaWYgKGlzU2hhbGxvd0Rlc2NyaXB0aW9uIHx8IGNvbnRlbnRzID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIC8vICAgICByZXR1cm47XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvLyBpZiAoIShjb250ZW50cyBpbnN0YW5jZW9mIFJ1bnRpbWVMaXN0KSl7XHJcbiAgICAgICAgLy8gICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gZGVzY3JpYmUgY29udGVudHMgd2l0aG91dCBhIGxpc3RcIik7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvLyB0aGlzLmRlc2NyaWJlQ29udGVudHMoY29udGVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVzY3JpYmVDb250ZW50cyhleGVjdXRpb25Qb2ludDpUaHJlYWQsIHRhcmdldDpSdW50aW1lTGlzdCl7XHJcbiAgICAgICAgZm9yKGNvbnN0IGl0ZW0gb2YgdGFyZ2V0Lml0ZW1zKXtcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmliZShleGVjdXRpb25Qb2ludCwgPFJ1bnRpbWVXb3JsZE9iamVjdD5pdGVtLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXRlcm1pbmVNZWFuaW5nRm9yKGFjdGlvbjpzdHJpbmcpOk1lYW5pbmd7XHJcbiAgICAgICAgY29uc3Qgc3lzdGVtQWN0aW9uID0gYDw+JHthY3Rpb259YDtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogU3VwcG9ydCBjdXN0b20gYWN0aW9ucyBiZXR0ZXIuXHJcblxyXG4gICAgICAgIHN3aXRjaChzeXN0ZW1BY3Rpb24pe1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcuZGVzY3JpYmluZzogcmV0dXJuIE1lYW5pbmcuRGVzY3JpYmluZztcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLm1vdmluZzogcmV0dXJuIE1lYW5pbmcuTW92aW5nO1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcuZGlyZWN0aW9uOiByZXR1cm4gTWVhbmluZy5EaXJlY3Rpb247XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy50YWtpbmc6IHJldHVybiBNZWFuaW5nLlRha2luZztcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLmludmVudG9yeTogcmV0dXJuIE1lYW5pbmcuSW52ZW50b3J5O1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1lYW5pbmcuQ3VzdG9tO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4uL01ldGhvZEFjdGl2YXRpb25cIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RhbmNlQ2FsbEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBtZXRob2ROYW1lPzpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhyZWFkLmN1cnJlbnRNZXRob2Q7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5tZXRob2ROYW1lKXtcclxuICAgICAgICAgICAgdGhpcy5tZXRob2ROYW1lID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGN1cnJlbnQucG9wKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGluc3RhbmNlPy5tZXRob2RzLmdldCh0aGlzLm1ldGhvZE5hbWUpITtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYGNhbGwuaW5zdFxcdCR7aW5zdGFuY2U/LnR5cGVOYW1lfTo6JHt0aGlzLm1ldGhvZE5hbWV9KC4uLiR7bWV0aG9kLnBhcmFtZXRlcnMubGVuZ3RofSlgKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBwYXJhbWV0ZXJWYWx1ZXM6VmFyaWFibGVbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgbWV0aG9kIS5wYXJhbWV0ZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgY29uc3QgcGFyYW1ldGVyID0gbWV0aG9kIS5wYXJhbWV0ZXJzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGN1cnJlbnQucG9wKCkhO1xyXG4gICAgICAgICAgICBjb25zdCB2YXJpYWJsZSA9IG5ldyBWYXJpYWJsZShwYXJhbWV0ZXIubmFtZSwgcGFyYW1ldGVyLnR5cGUhLCBpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICBwYXJhbWV0ZXJWYWx1ZXMucHVzaCh2YXJpYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEhBQ0s6IFdlIHNob3VsZG4ndCBjcmVhdGUgb3VyIG93biB0eXBlLCB3ZSBzaG91bGQgaW5oZXJlbnRseSBrbm93IHdoYXQgaXQgaXMuXHJcblxyXG4gICAgICAgIHBhcmFtZXRlclZhbHVlcy51bnNoaWZ0KG5ldyBWYXJpYWJsZShcIjw+dGhpc1wiLCBuZXcgVHlwZShpbnN0YW5jZT8udHlwZU5hbWUhLCBpbnN0YW5jZT8ucGFyZW50VHlwZU5hbWUhKSwgaW5zdGFuY2UpKTtcclxuXHJcbiAgICAgICAgbWV0aG9kLmFjdHVhbFBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJWYWx1ZXM7XHJcblxyXG4gICAgICAgIHRocmVhZC5hY3RpdmF0ZU1ldGhvZChtZXRob2QpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRGaWVsZEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcbiAgICAgICAgY29uc3QgZmllbGROYW1lID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIGNvbnN0IGZpZWxkID0gaW5zdGFuY2U/LmZpZWxkcy5nZXQoZmllbGROYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBmaWVsZD8udmFsdWU7XHJcblxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGBsZC5maWVsZFxcdFxcdCR7aW5zdGFuY2U/LnR5cGVOYW1lfTo6JHtmaWVsZE5hbWV9IC8vICR7dmFsdWV9YCk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkSW5zdGFuY2VIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIGlmICh0eXBlTmFtZSA9PT0gXCI8Pml0XCIpe1xyXG4gICAgICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhyZWFkLmN1cnJlbnRQbGFjZSE7XHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goc3ViamVjdCk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhcImxkLmN1cnIucGxhY2VcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGxvYWQgaW5zdGFuY2UgZm9yIHVuc3VwcG9ydGVkIHR5cGUgJyR7dHlwZU5hbWV9J2ApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkTG9jYWxIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgbG9jYWxOYW1lID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICBjb25zdCBwYXJhbWV0ZXIgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5tZXRob2Q/LmFjdHVhbFBhcmFtZXRlcnMuZmluZCh4ID0+IHgubmFtZSA9PSBsb2NhbE5hbWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHBhcmFtZXRlcj8udmFsdWUhKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYGxkLnBhcmFtXFx0XFx0JHtsb2NhbE5hbWV9PSR7cGFyYW1ldGVyPy52YWx1ZX1gKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4uL2NvbW1vbi9NZW1vcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkTnVtYmVySGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gPG51bWJlcj50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcbiAgICAgICAgY29uc3QgcnVudGltZVZhbHVlID0gTWVtb3J5LmFsbG9jYXRlTnVtYmVyKHZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChydW50aW1lVmFsdWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgbGQuY29uc3QubnVtXFx0JHt2YWx1ZX1gKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgTWV0aG9kQWN0aXZhdGlvbiB9IGZyb20gXCIuLi9NZXRob2RBY3RpdmF0aW9uXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4uL2xpYnJhcnkvVmFyaWFibGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkUHJvcGVydHlIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZmllbGROYW1lPzpzdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZmllbGROYW1lKXtcclxuICAgICAgICAgICAgdGhpcy5maWVsZE5hbWUgPSA8c3RyaW5nPnRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGZpZWxkID0gaW5zdGFuY2U/LmZpZWxkcy5nZXQodGhpcy5maWVsZE5hbWUpO1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGZpZWxkPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIGNvbnN0IGdldEZpZWxkID0gaW5zdGFuY2U/Lm1ldGhvZHMuZ2V0KGA8PmdldF8ke3RoaXMuZmllbGROYW1lfWApO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgbGQucHJvcFxcdFxcdCR7aW5zdGFuY2U/LnR5cGVOYW1lfTo6JHt0aGlzLmZpZWxkTmFtZX0ge2dldD0ke2dldEZpZWxkICE9IHVuZGVmaW5lZH19IC8vICR7dmFsdWV9YCk7XHJcblxyXG4gICAgICAgIGlmIChnZXRGaWVsZCl7XHJcbiAgICAgICAgICAgIGdldEZpZWxkLmFjdHVhbFBhcmFtZXRlcnMucHVzaChuZXcgVmFyaWFibGUoXCI8PnZhbHVlXCIsIGZpZWxkPy50eXBlISwgdmFsdWUpKTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5hY3RpdmF0ZU1ldGhvZChnZXRGaWVsZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvYWRTdHJpbmdIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24hLnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKXtcclxuICAgICAgICAgICAgY29uc3Qgc3RyaW5nVmFsdWUgPSBuZXcgUnVudGltZVN0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goc3RyaW5nVmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYGxkLmNvbnN0LnN0clxcdFwiJHt2YWx1ZX1cImApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJFeHBlY3RlZCBhIHN0cmluZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiXHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkVGhpc0hhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhyZWFkLmN1cnJlbnRNZXRob2QubWV0aG9kPy5hY3R1YWxQYXJhbWV0ZXJzWzBdLnZhbHVlITtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGBsZC50aGlzYCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV3SW5zdGFuY2VIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCB0eXBlTmFtZSA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHR5cGVOYW1lID09PSBcInN0cmluZ1wiKXtcclxuICAgICAgICAgICAgY29uc3QgdHlwZSA9IHRocmVhZC5rbm93blR5cGVzLmdldCh0eXBlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZSA9PSBudWxsKXtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gbG9jYXRlIHR5cGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gTWVtb3J5LmFsbG9jYXRlKHR5cGUpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChpbnN0YW5jZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOb09wSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuQ29udGludWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQ29tbWFuZCB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVDb21tYW5kXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyc2VDb21tYW5kSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAodGV4dCBpbnN0YW5jZW9mIFJ1bnRpbWVTdHJpbmcpe1xyXG4gICAgICAgICAgICBjb25zdCBjb21tYW5kVGV4dCA9IHRleHQudmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLnBhcnNlQ29tbWFuZChjb21tYW5kVGV4dCk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKGNvbW1hbmQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gcGFyc2UgY29tbWFuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBhcnNlQ29tbWFuZCh0ZXh0OnN0cmluZyk6UnVudGltZUNvbW1hbmR7XHJcbiAgICAgICAgY29uc3QgcGllY2VzID0gdGV4dC5zcGxpdChcIiBcIik7XHJcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IE1lbW9yeS5hbGxvY2F0ZUNvbW1hbmQoKTtcclxuICAgICAgICBcclxuICAgICAgICBjb21tYW5kLmFjdGlvbiA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhwaWVjZXNbMF0pO1xyXG4gICAgICAgIGNvbW1hbmQudGFyZ2V0TmFtZSA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhwaWVjZXNbMV0pO1xyXG5cclxuICAgICAgICByZXR1cm4gY29tbWFuZDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5pbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQcmludEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgcHJpdmF0ZSBvdXRwdXQ6SU91dHB1dDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvdXRwdXQ6SU91dHB1dCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm91dHB1dCA9IG91dHB1dDtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG5cclxuICAgICAgICBpZiAodGV4dCBpbnN0YW5jZW9mIFJ1bnRpbWVTdHJpbmcpe1xyXG4gICAgICAgICAgICB0aGlzLm91dHB1dC53cml0ZSh0ZXh0LnZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIHByaW50LCBlbmNvdW50ZXJlZCBhIHR5cGUgb24gdGhlIHN0YWNrIG90aGVyIHRoYW4gc3RyaW5nXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVhZElucHV0SGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgcmV0dXJuIEV2YWx1YXRpb25SZXN1bHQuU3VzcGVuZEZvcklucHV0O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFbXB0eSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVFbXB0eVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJldHVybkhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSByZXR1cm5pbmcgdG9wIHZhbHVlIG9uIHN0YWNrIGJhc2VkIG9uIHJldHVybiB0eXBlIG9mIG1ldGhvZC5cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhyZWFkLmN1cnJlbnRNZXRob2Q7XHJcbiAgICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSB0aHJlYWQhLnJldHVybkZyb21DdXJyZW50TWV0aG9kKCk7XHJcblxyXG4gICAgICAgIGlmICghKHJldHVyblZhbHVlIGluc3RhbmNlb2YgUnVudGltZUVtcHR5KSl7XHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGByZXRcXHRcXHQke3JldHVyblZhbHVlfWApO1xyXG4gICAgICAgICAgICB0aHJlYWQ/LmN1cnJlbnRNZXRob2QucHVzaChyZXR1cm5WYWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoXCJyZXQgdm9pZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBFdmFsdWF0aW9uUmVzdWx0LkNvbnRpbnVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgTWV0aG9kQWN0aXZhdGlvbiB9IGZyb20gXCIuLi9NZXRob2RBY3RpdmF0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhdGljQ2FsbEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IGNhbGxUZXh0ID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcblxyXG4gICAgICAgIGNvbnN0IHBpZWNlcyA9IGNhbGxUZXh0LnNwbGl0KFwiLlwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSBwaWVjZXNbMF07XHJcbiAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IHBpZWNlc1sxXTtcclxuXHJcbiAgICAgICAgY29uc3QgdHlwZSA9IHRocmVhZC5rbm93blR5cGVzLmdldCh0eXBlTmFtZSkhO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHR5cGU/Lm1ldGhvZHMuZmluZCh4ID0+IHgubmFtZSA9PT0gbWV0aG9kTmFtZSkhOyAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgY2FsbC5zdGF0aWNcXHQke3R5cGVOYW1lfTo6JHttZXRob2ROYW1lfSgpYCk7XHJcblxyXG4gICAgICAgIHRocmVhZC5hY3RpdmF0ZU1ldGhvZChtZXRob2QpO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBNZWFuaW5ne1xyXG4gICAgRGVzY3JpYmluZyxcclxuICAgIFRha2luZyxcclxuICAgIE1vdmluZyxcclxuICAgIERpcmVjdGlvbixcclxuICAgIEludmVudG9yeSxcclxuICAgIERyb3BwaW5nLFxyXG4gICAgUXVpdHRpbmcsXHJcbiAgICBDdXN0b21cclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuL1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUFueXtcclxuICAgIHBhcmVudFR5cGVOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICB0eXBlTmFtZTpzdHJpbmcgPSBBbnkudHlwZU5hbWU7XHJcblxyXG4gICAgZmllbGRzOk1hcDxzdHJpbmcsIFZhcmlhYmxlPiA9IG5ldyBNYXA8c3RyaW5nLCBWYXJpYWJsZT4oKTtcclxuICAgIG1ldGhvZHM6TWFwPHN0cmluZywgTWV0aG9kPiA9IG5ldyBNYXA8c3RyaW5nLCBNZXRob2Q+KCk7XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy50eXBlTmFtZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUJvb2xlYW4gZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOmJvb2xlYW4pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuL1J1bnRpbWVTdHJpbmdcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lQ29tbWFuZCBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGFyZ2V0TmFtZT86UnVudGltZVN0cmluZywgcHVibGljIGFjdGlvbj86UnVudGltZVN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVFbXB0eSBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gXCI8PmVtcHR5XCI7XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVJbnRlZ2VyIGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB2YWx1ZTpudW1iZXIpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4vUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0l0ZW1cIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVJdGVtIGV4dGVuZHMgUnVudGltZVdvcmxkT2JqZWN0e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gSXRlbS50eXBlTmFtZTtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IHR5cGUoKTpUeXBle1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBSdW50aW1lV29ybGRPYmplY3QudHlwZTtcclxuXHJcbiAgICAgICAgdHlwZS5uYW1lID0gSXRlbS50eXBlTmFtZTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IFBhcmFtZXRlciB9IGZyb20gXCIuLi8uLi9jb21tb24vUGFyYW1ldGVyXCI7XHJcbmltcG9ydCB7IE51bWJlclR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9OdW1iZXJUeXBlXCI7XHJcbmltcG9ydCB7IFN0cmluZ1R5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9TdHJpbmdUeXBlXCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9JbnN0cnVjdGlvblwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4vUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lSW50ZWdlciB9IGZyb20gXCIuL1J1bnRpbWVJbnRlZ2VyXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IEJvb2xlYW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQm9vbGVhblR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lTGlzdCBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaXRlbXM6UnVudGltZUFueVtdKXtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICBjb25zdCBjb250YWlucyA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICBjb250YWlucy5uYW1lID0gTGlzdC5jb250YWlucztcclxuICAgICAgICBjb250YWlucy5wYXJhbWV0ZXJzLnB1c2goXHJcbiAgICAgICAgICAgIG5ldyBQYXJhbWV0ZXIoTGlzdC50eXBlTmFtZVBhcmFtZXRlciwgU3RyaW5nVHlwZS50eXBlTmFtZSksXHJcbiAgICAgICAgICAgIG5ldyBQYXJhbWV0ZXIoTGlzdC5jb3VudFBhcmFtZXRlciwgTnVtYmVyVHlwZS50eXBlTmFtZSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb250YWlucy5yZXR1cm5UeXBlID0gQm9vbGVhblR5cGUudHlwZU5hbWU7XHJcblxyXG4gICAgICAgIGNvbnRhaW5zLmJvZHkucHVzaChcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZExvY2FsKExpc3QuY291bnRQYXJhbWV0ZXIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkTG9jYWwoTGlzdC50eXBlTmFtZVBhcmFtZXRlciksICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFRoaXMoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uZXh0ZXJuYWxDYWxsKFwiY29udGFpbnNUeXBlXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5yZXR1cm4oKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5zZXQoTGlzdC5jb250YWlucywgY29udGFpbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29udGFpbnNUeXBlKHR5cGVOYW1lOlJ1bnRpbWVTdHJpbmcsIGNvdW50OlJ1bnRpbWVJbnRlZ2VyKXtcclxuICAgICAgICBjb25zdCBmb3VuZEl0ZW1zID0gdGhpcy5pdGVtcy5maWx0ZXIoeCA9PiB4LnR5cGVOYW1lID09PSB0eXBlTmFtZS52YWx1ZSk7XHJcbiAgICAgICAgY29uc3QgZm91bmQgPSBmb3VuZEl0ZW1zLmxlbmd0aCA9PT0gY291bnQudmFsdWU7XHJcblxyXG4gICAgICAgIHJldHVybiBNZW1vcnkuYWxsb2NhdGVCb29sZWFuKGZvdW5kKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVXb3JsZE9iamVjdCB9IGZyb20gXCIuL1J1bnRpbWVXb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVQbGFjZSBleHRlbmRzIFJ1bnRpbWVXb3JsZE9iamVjdHtcclxuICAgIHBhcmVudFR5cGVOYW1lID0gV29ybGRPYmplY3QucGFyZW50VHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IFBsYWNlLnR5cGVOYW1lO1xyXG5cclxuICAgIHN0YXRpYyBnZXQgdHlwZSgpOlR5cGV7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IFJ1bnRpbWVXb3JsZE9iamVjdC50eXBlO1xyXG5cclxuICAgICAgICB0eXBlLm5hbWUgPSBQbGFjZS50eXBlTmFtZTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVXb3JsZE9iamVjdCB9IGZyb20gXCIuL1J1bnRpbWVXb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYXllclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVQbGF5ZXIgZXh0ZW5kcyBSdW50aW1lV29ybGRPYmplY3R7XHJcbiAgICBzdGF0aWMgZ2V0IHR5cGUoKTpUeXBle1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBSdW50aW1lV29ybGRPYmplY3QudHlwZTtcclxuXHJcbiAgICAgICAgdHlwZS5uYW1lID0gUGxheWVyLnR5cGVOYW1lO1xyXG5cclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVNheSBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBtZXNzYWdlOnN0cmluZyA9IFwiXCI7XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lU3RyaW5nIGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIHZhbHVlOnN0cmluZztcclxuICAgIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBcIjw+c3RyaW5nXCI7XHJcblxyXG4gICAgY29uc3RydWN0b3IodmFsdWU6c3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZygpe1xyXG4gICAgICAgIHJldHVybiBgXCIke3RoaXMudmFsdWV9XCJgO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgUnVudGltZUxpc3QgfSBmcm9tIFwiLi9SdW50aW1lTGlzdFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4vUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuL1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgRmllbGQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL0ZpZWxkXCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IFN0cmluZ1R5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9TdHJpbmdUeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVdvcmxkT2JqZWN0IGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBXb3JsZE9iamVjdC50eXBlTmFtZTtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IHR5cGUoKTpUeXBle1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBuZXcgVHlwZShXb3JsZE9iamVjdC50eXBlTmFtZSwgV29ybGRPYmplY3QucGFyZW50VHlwZU5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRzID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgY29udGVudHMubmFtZSA9IFdvcmxkT2JqZWN0LmNvbnRlbnRzO1xyXG4gICAgICAgIGNvbnRlbnRzLnR5cGVOYW1lID0gTGlzdC50eXBlTmFtZTtcclxuICAgICAgICBjb250ZW50cy5kZWZhdWx0VmFsdWUgPSBbXTtcclxuXHJcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBuZXcgRmllbGQoKTtcclxuICAgICAgICBkZXNjcmlwdGlvbi5uYW1lID0gV29ybGRPYmplY3QuZGVzY3JpcHRpb247XHJcbiAgICAgICAgZGVzY3JpcHRpb24udHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uLmRlZmF1bHRWYWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIHR5cGUuZmllbGRzLnB1c2goY29udGVudHMpO1xyXG4gICAgICAgIHR5cGUuZmllbGRzLnB1c2goZGVzY3JpcHRpb24pO1xyXG5cclxuICAgICAgICByZXR1cm4gdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEZpZWxkVmFsdWVCeU5hbWUobmFtZTpzdHJpbmcpOlJ1bnRpbWVBbnl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmZpZWxkcy5nZXQobmFtZSk/LnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAoaW5zdGFuY2UgPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgQXR0ZW1wdGVkIGZpZWxkIGFjY2VzcyBmb3IgdW5rbm93biBmaWVsZCAnJHtuYW1lfSdgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRGaWVsZEFzTGlzdChuYW1lOnN0cmluZyk6UnVudGltZUxpc3R7XHJcbiAgICAgICAgcmV0dXJuIDxSdW50aW1lTGlzdD50aGlzLmdldEZpZWxkVmFsdWVCeU5hbWUobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RmllbGRBc1N0cmluZyhuYW1lOnN0cmluZyk6UnVudGltZVN0cmluZ3tcclxuICAgICAgICByZXR1cm4gPFJ1bnRpbWVTdHJpbmc+dGhpcy5nZXRGaWVsZFZhbHVlQnlOYW1lKG5hbWUpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZhcmlhYmxle1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBuYW1lOnN0cmluZywgXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdHlwZTpUeXBlLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHZhbHVlPzpSdW50aW1lQW55KXtcclxuICAgIH1cclxufSJdfQ==
