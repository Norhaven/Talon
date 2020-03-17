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
const TalonTransformer_1 = require("./tranforming/TalonTransformer");
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
},{"../common/Instruction":4,"../common/Method":5,"../common/Type":8,"../common/Version":9,"../library/Any":39,"../library/EntryPointAttribute":41,"./lexing/TalonLexer":14,"./parsing/TalonParser":18,"./semantics/TalonSemanticAnalyzer":37,"./tranforming/TalonTransformer":38}],11:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L1VzZXJzL25vcmhhL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInRhbG9uL1BhbmVPdXRwdXQudHMiLCJ0YWxvbi9UYWxvbklkZS50cyIsInRhbG9uL2NvbW1vbi9GaWVsZC50cyIsInRhbG9uL2NvbW1vbi9JbnN0cnVjdGlvbi50cyIsInRhbG9uL2NvbW1vbi9NZXRob2QudHMiLCJ0YWxvbi9jb21tb24vT3BDb2RlLnRzIiwidGFsb24vY29tbW9uL1BhcmFtZXRlci50cyIsInRhbG9uL2NvbW1vbi9UeXBlLnRzIiwidGFsb24vY29tbW9uL1ZlcnNpb24udHMiLCJ0YWxvbi9jb21waWxlci9UYWxvbkNvbXBpbGVyLnRzIiwidGFsb24vY29tcGlsZXIvZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL0tleXdvcmRzLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1B1bmN0dWF0aW9uLnRzIiwidGFsb24vY29tcGlsZXIvbGV4aW5nL1RhbG9uTGV4ZXIudHMiLCJ0YWxvbi9jb21waWxlci9sZXhpbmcvVG9rZW4udHMiLCJ0YWxvbi9jb21waWxlci9sZXhpbmcvVG9rZW5UeXBlLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9QYXJzZUNvbnRleHQudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL1RhbG9uUGFyc2VyLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9CaW5hcnlFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Db25jYXRlbmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29udGFpbnNFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9FeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvSWZFeHByZXNzaW9uLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy9leHByZXNzaW9ucy9Qcm9ncmFtRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvU2F5RXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvZXhwcmVzc2lvbnMvVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbi50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvRXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL0ZpZWxkRGVjbGFyYXRpb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9JZkV4cHJlc3Npb25WaXNpdG9yLnRzIiwidGFsb24vY29tcGlsZXIvcGFyc2luZy92aXNpdG9ycy9Qcm9ncmFtVmlzaXRvci50cyIsInRhbG9uL2NvbXBpbGVyL3BhcnNpbmcvdmlzaXRvcnMvU2F5RXhwcmVzc2lvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1R5cGVEZWNsYXJhdGlvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9wYXJzaW5nL3Zpc2l0b3JzL1Zpc2l0b3IudHMiLCJ0YWxvbi9jb21waWxlci9zZW1hbnRpY3MvVGFsb25TZW1hbnRpY0FuYWx5emVyLnRzIiwidGFsb24vY29tcGlsZXIvdHJhbmZvcm1pbmcvVGFsb25UcmFuc2Zvcm1lci50cyIsInRhbG9uL2xpYnJhcnkvQW55LnRzIiwidGFsb24vbGlicmFyeS9Cb29sZWFuVHlwZS50cyIsInRhbG9uL2xpYnJhcnkvRW50cnlQb2ludEF0dHJpYnV0ZS50cyIsInRhbG9uL2xpYnJhcnkvRXh0ZXJuQ2FsbC50cyIsInRhbG9uL2xpYnJhcnkvSXRlbS50cyIsInRhbG9uL2xpYnJhcnkvTGlzdC50cyIsInRhbG9uL2xpYnJhcnkvTnVtYmVyVHlwZS50cyIsInRhbG9uL2xpYnJhcnkvUGxhY2UudHMiLCJ0YWxvbi9saWJyYXJ5L1BsYXllci50cyIsInRhbG9uL2xpYnJhcnkvU2F5LnRzIiwidGFsb24vbGlicmFyeS9TdHJpbmdUeXBlLnRzIiwidGFsb24vbGlicmFyeS9VbmRlcnN0YW5kaW5nLnRzIiwidGFsb24vbGlicmFyeS9Xb3JsZE9iamVjdC50cyIsInRhbG9uL21haW4udHMiLCJ0YWxvbi9ydW50aW1lL0V2YWx1YXRpb25SZXN1bHQudHMiLCJ0YWxvbi9ydW50aW1lL01ldGhvZEFjdGl2YXRpb24udHMiLCJ0YWxvbi9ydW50aW1lL09wQ29kZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL1N0YWNrRnJhbWUudHMiLCJ0YWxvbi9ydW50aW1lL1RhbG9uUnVudGltZS50cyIsInRhbG9uL3J1bnRpbWUvVGhyZWFkLnRzIiwidGFsb24vcnVudGltZS9jb21tb24vTWVtb3J5LnRzIiwidGFsb24vcnVudGltZS9lcnJvcnMvUnVudGltZUVycm9yLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9CcmFuY2hSZWxhdGl2ZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0JyYW5jaFJlbGF0aXZlSWZGYWxzZUhhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0NvbmNhdGVuYXRlSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvRXh0ZXJuYWxDYWxsSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvR29Ub0hhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0hhbmRsZUNvbW1hbmRIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9JbnN0YW5jZUNhbGxIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkRmllbGRIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkSW5zdGFuY2VIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkTG9jYWxIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Mb2FkTnVtYmVySGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZFByb3BlcnR5SGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTG9hZFN0cmluZ0hhbmRsZXIudHMiLCJ0YWxvbi9ydW50aW1lL2hhbmRsZXJzL0xvYWRUaGlzSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvTmV3SW5zdGFuY2VIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9Ob09wSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvUGFyc2VDb21tYW5kSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvaGFuZGxlcnMvUHJpbnRIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9SZWFkSW5wdXRIYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9SZXR1cm5IYW5kbGVyLnRzIiwidGFsb24vcnVudGltZS9oYW5kbGVycy9TdGF0aWNDYWxsSGFuZGxlci50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9NZWFuaW5nLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVBbnkudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUJvb2xlYW4udHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUNvbW1hbmQudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZUVtcHR5LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVJbnRlZ2VyLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVJdGVtLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVMaXN0LnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVQbGFjZS50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lUGxheWVyLnRzIiwidGFsb24vcnVudGltZS9saWJyYXJ5L1J1bnRpbWVTYXkudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvUnVudGltZVN0cmluZy50cyIsInRhbG9uL3J1bnRpbWUvbGlicmFyeS9SdW50aW1lV29ybGRPYmplY3QudHMiLCJ0YWxvbi9ydW50aW1lL2xpYnJhcnkvVmFyaWFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBLE1BQWEsVUFBVTtJQUNuQixZQUFvQixJQUFtQjtRQUFuQixTQUFJLEdBQUosSUFBSSxDQUFlO0lBRXZDLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBWTtRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQztJQUNoQyxDQUFDO0NBQ0o7QUFSRCxnQ0FRQzs7OztBQ1ZELDREQUF5RDtBQUV6RCw2Q0FBMEM7QUFFMUMseURBQXNEO0FBRXRELE1BQWEsUUFBUTtJQUdqQjtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBb0IsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV0RSxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWxELE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxnQkFBZ0IsQ0FBQyxPQUFP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LENBQUMsSUFBVztRQUN4QixPQUFzQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQztDQUNKO0FBeENELGdEQXdDQzs7OztBQ2pERCxNQUFhLFFBQVE7SUFFakIsWUFBNEIsSUFBVyxFQUNYLElBQVMsRUFDbEIsS0FBaUI7UUFGUixTQUFJLEdBQUosSUFBSSxDQUFPO1FBQ1gsU0FBSSxHQUFKLElBQUksQ0FBSztRQUNsQixVQUFLLEdBQUwsS0FBSyxDQUFZO0lBQ3BDLENBQUM7Q0FDSjtBQU5ELDRCQU1DIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuL3J1bnRpbWUvSU91dHB1dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhbmVPdXRwdXQgaW1wbGVtZW50cyBJT3V0cHV0e1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYW5lOkhUTUxEaXZFbGVtZW50KXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgd3JpdGUobGluZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wYW5lLmlubmVySFRNTCArPSBsaW5lO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVGFsb25Db21waWxlciB9IGZyb20gXCIuL2NvbXBpbGVyL1RhbG9uQ29tcGlsZXJcIjtcclxuXHJcbmltcG9ydCB7IFBhbmVPdXRwdXQgfSBmcm9tIFwiLi9QYW5lT3V0cHV0XCI7XHJcblxyXG5pbXBvcnQgeyBUYWxvblJ1bnRpbWUgfSBmcm9tIFwiLi9ydW50aW1lL1RhbG9uUnVudGltZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uSWRle1xyXG4gICAgZ2FtZVBhbmU6SFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIElERVwiKTtcclxuICAgICAgICB0aGlzLmdhbWVQYW5lID0gPEhUTUxEaXZFbGVtZW50PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWUtcGFuZVwiKTtcclxuXHJcbiAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21waWxlXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGJ1dHRvbj8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ydW4oKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBydW4oKXtcclxuICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlJVTk5JTkdcIik7XHJcbiAgICBjb25zdCBjb21waWxlciA9IG5ldyBUYWxvbkNvbXBpbGVyKCk7XHJcblxyXG4gICAgY29uc3QgdHlwZXMgPSBjb21waWxlci5jb21waWxlKFwiXCIpO1xyXG5cclxuICAgIGNvbnN0IHVzZXJPdXRwdXQgPSBuZXcgUGFuZU91dHB1dCh0aGlzLmdhbWVQYW5lKTtcclxuXHJcbiAgICBjb25zdCBydW50aW1lID0gbmV3IFRhbG9uUnVudGltZSh1c2VyT3V0cHV0LCB1bmRlZmluZWQpO1xyXG5cclxuICAgIHJ1bnRpbWUubG9hZEZyb20odHlwZXMpO1xyXG4gICAgcnVudGltZS5zZW5kQ29tbWFuZChcIlwiKTtcclxuICAgIFxyXG4gICAgcmV0dXJuIFwiQ29tcGlsZWRcIjtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi9UeXBlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpZWxke1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgdHlwZU5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIHR5cGU/OlR5cGU7XHJcbiAgICBkZWZhdWx0VmFsdWU/Ok9iamVjdDtcclxufSIsImltcG9ydCB7IE9wQ29kZSB9IGZyb20gXCIuL09wQ29kZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEluc3RydWN0aW9ue1xyXG4gICAgc3RhdGljIGxvYWROdW1iZXIodmFsdWU6bnVtYmVyKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkTnVtYmVyLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRTdHJpbmcodmFsdWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5Mb2FkU3RyaW5nLCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGxvYWRJbnN0YW5jZSh0eXBlTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRJbnN0YW5jZSwgdHlwZU5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkRmllbGQoZmllbGROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZEZpZWxkLCBmaWVsZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkUHJvcGVydHkoZmllbGROYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZFByb3BlcnR5LCBmaWVsZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkTG9jYWwobG9jYWxOYW1lOnN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuTG9hZExvY2FsLCBsb2NhbE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkVGhpcygpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkxvYWRUaGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaW5zdGFuY2VDYWxsKG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5JbnN0YW5jZUNhbGwsIG1ldGhvZE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb25jYXRlbmF0ZSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkNvbmNhdGVuYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc3RhdGljQ2FsbCh0eXBlTmFtZTpzdHJpbmcsIG1ldGhvZE5hbWU6c3RyaW5nKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5TdGF0aWNDYWxsLCBgJHt0eXBlTmFtZX0uJHttZXRob2ROYW1lfWApO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBleHRlcm5hbENhbGwobWV0aG9kTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkV4dGVybmFsQ2FsbCwgbWV0aG9kTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHByaW50KCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuUHJpbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZXR1cm4oKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5SZXR1cm4pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyByZWFkSW5wdXQoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5SZWFkSW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwYXJzZUNvbW1hbmQoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKE9wQ29kZS5QYXJzZUNvbW1hbmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBoYW5kbGVDb21tYW5kKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihPcENvZGUuSGFuZGxlQ29tbWFuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdvVG8obGluZU51bWJlcjpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkdvVG8sIGxpbmVOdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBicmFuY2hSZWxhdGl2ZShjb3VudDpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkJyYW5jaFJlbGF0aXZlLCBjb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGJyYW5jaFJlbGF0aXZlSWZGYWxzZShjb3VudDpudW1iZXIpe1xyXG4gICAgICAgIHJldHVybiBuZXcgSW5zdHJ1Y3Rpb24oT3BDb2RlLkJyYW5jaFJlbGF0aXZlSWZGYWxzZSwgY291bnQpO1xyXG4gICAgfVxyXG5cclxuICAgIG9wQ29kZTpPcENvZGUgPSBPcENvZGUuTm9PcDtcclxuICAgIHZhbHVlPzpPYmplY3Q7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3BDb2RlOk9wQ29kZSwgdmFsdWU/Ok9iamVjdCl7XHJcbiAgICAgICAgdGhpcy5vcENvZGUgPSBvcENvZGU7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgUGFyYW1ldGVyIH0gZnJvbSBcIi4vUGFyYW1ldGVyXCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vcnVudGltZS9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWV0aG9ke1xyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgcGFyYW1ldGVyczpQYXJhbWV0ZXJbXSA9IFtdO1xyXG4gICAgYWN0dWFsUGFyYW1ldGVyczpWYXJpYWJsZVtdID0gW107XHJcbiAgICBib2R5Okluc3RydWN0aW9uW10gPSBbXTtcclxuICAgIHJldHVyblR5cGU6c3RyaW5nID0gXCJcIjtcclxufSIsImV4cG9ydCBlbnVtIE9wQ29kZXtcclxuICAgIE5vT3AsXHJcbiAgICBQcmludCxcclxuICAgIExvYWRTdHJpbmcsXHJcbiAgICBOZXdJbnN0YW5jZSxcclxuICAgIFBhcnNlQ29tbWFuZCxcclxuICAgIEhhbmRsZUNvbW1hbmQsXHJcbiAgICBSZWFkSW5wdXQsXHJcbiAgICBHb1RvLFxyXG4gICAgUmV0dXJuLFxyXG4gICAgQnJhbmNoUmVsYXRpdmUsXHJcbiAgICBCcmFuY2hSZWxhdGl2ZUlmRmFsc2UsXHJcbiAgICBDb25jYXRlbmF0ZSxcclxuICAgIExvYWROdW1iZXIsXHJcbiAgICBMb2FkRmllbGQsXHJcbiAgICBMb2FkUHJvcGVydHksXHJcbiAgICBMb2FkSW5zdGFuY2UsXHJcbiAgICBMb2FkTG9jYWwsXHJcbiAgICBMb2FkVGhpcyxcclxuICAgIEluc3RhbmNlQ2FsbCxcclxuICAgIFN0YXRpY0NhbGwsXHJcbiAgICBFeHRlcm5hbENhbGxcclxufSIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi9UeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyYW1ldGVye1xyXG4gICAgXHJcbiAgICB0eXBlPzpUeXBlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBuYW1lOnN0cmluZyxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB0eXBlTmFtZTpzdHJpbmcpe1xyXG5cclxuICAgIH1cclxufSIsImltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4vRmllbGRcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4vTWV0aG9kXCI7XHJcbmltcG9ydCB7IEF0dHJpYnV0ZSB9IGZyb20gXCIuL0F0dHJpYnV0ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFR5cGV7ICAgICAgXHJcbiAgICBmaWVsZHM6RmllbGRbXSA9IFtdO1xyXG4gICAgbWV0aG9kczpNZXRob2RbXSA9IFtdOyBcclxuICAgIGF0dHJpYnV0ZXM6QXR0cmlidXRlW10gPSBbXTtcclxuXHJcbiAgICBnZXQgaXNTeXN0ZW1UeXBlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZS5zdGFydHNXaXRoKFwiPD5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzQW5vbnltb3VzVHlwZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUuc3RhcnRzV2l0aChcIjx+PlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTpzdHJpbmcsIHB1YmxpYyBiYXNlVHlwZU5hbWU6c3RyaW5nKXtcclxuXHJcbiAgICB9ICAgIFxyXG59IiwiZXhwb3J0IGNsYXNzIFZlcnNpb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbWFqb3I6bnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IG1pbm9yOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBwYXRjaDpudW1iZXIpe1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMubWFqb3J9LiR7dGhpcy5taW5vcn0uJHt0aGlzLnBhdGNofWA7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuLi9jb21tb24vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgRW50cnlQb2ludEF0dHJpYnV0ZSB9IGZyb20gXCIuLi9saWJyYXJ5L0VudHJ5UG9pbnRBdHRyaWJ1dGVcIjtcclxuaW1wb3J0IHsgVG9rZW5pemVyIH0gZnJvbSBcIi4vbGV4aW5nL1RhbG9uTGV4ZXJcIjtcclxuaW1wb3J0IHsgVGFsb25QYXJzZXIgfSBmcm9tIFwiLi9wYXJzaW5nL1RhbG9uUGFyc2VyXCI7XHJcbmltcG9ydCB7IFRhbG9uU2VtYW50aWNBbmFseXplciB9IGZyb20gXCIuL3NlbWFudGljcy9UYWxvblNlbWFudGljQW5hbHl6ZXJcIjtcclxuaW1wb3J0IHsgVGFsb25UcmFuc2Zvcm1lciB9IGZyb20gXCIuL3RyYW5mb3JtaW5nL1RhbG9uVHJhbnNmb3JtZXJcIjtcclxuaW1wb3J0IHsgVmVyc2lvbiB9IGZyb20gXCIuLi9jb21tb24vVmVyc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uQ29tcGlsZXJ7XHJcbiAgICBcclxuICAgIGdldCBsYW5ndWFnZVZlcnNpb24oKXtcclxuICAgICAgICByZXR1cm4gbmV3IFZlcnNpb24oMSwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHZlcnNpb24oKXtcclxuICAgICAgICByZXR1cm4gbmV3IFZlcnNpb24oMSwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcGlsZShjb2RlOnN0cmluZyk6VHlwZVtde1xyXG4gICAgICAgIGNvbnN0IGxleGVyID0gbmV3IFRva2VuaXplcigpO1xyXG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBUYWxvblBhcnNlcigpO1xyXG4gICAgICAgIGNvbnN0IGFuYWx5emVyID0gbmV3IFRhbG9uU2VtYW50aWNBbmFseXplcigpO1xyXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gbmV3IFRhbG9uVHJhbnNmb3JtZXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgdG9rZW5zID0gbGV4ZXIudG9rZW5pemUoY29kZSk7XHJcbiAgICAgICAgY29uc3QgYXN0ID0gcGFyc2VyLnBhcnNlKHRva2Vucyk7XHJcbiAgICAgICAgY29uc3QgYW5hbHl6ZWRBc3QgPSBhbmFseXplci5hbmFseXplKGFzdCk7XHJcbiAgICAgICAgY29uc3QgdHlwZXMgPSB0cmFuc2Zvcm1lci50cmFuc2Zvcm0oYW5hbHl6ZWRBc3QpO1xyXG5cclxuICAgICAgICBjb25zdCBlbnRyeVBvaW50ID0gdGhpcy5jcmVhdGVFbnRyeVBvaW50KCk7XHJcblxyXG4gICAgICAgIHR5cGVzLnB1c2goZW50cnlQb2ludCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUVudHJ5UG9pbnQoKXtcclxuICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoXCI8PmVudHJ5UG9pbnRcIiwgXCI8PmVtcHR5XCIpO1xyXG5cclxuICAgICAgICB0eXBlLmF0dHJpYnV0ZXMucHVzaChuZXcgRW50cnlQb2ludEF0dHJpYnV0ZSgpKTtcclxuXHJcbiAgICAgICAgY29uc3QgbWFpbiA9IG5ldyBNZXRob2QoKTtcclxuICAgICAgICBtYWluLm5hbWUgPSBBbnkubWFpbjtcclxuICAgICAgICBtYWluLmJvZHkucHVzaChcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhgVGFsb24gTGFuZ3VhZ2Ugdi4ke3RoaXMubGFuZ3VhZ2VWZXJzaW9ufWApLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGBUYWxvbiBDb21waWxlciB2LiR7dGhpcy52ZXJzaW9ufWApLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLCAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhcIlwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uc3RhdGljQ2FsbChcIjx+Pmdsb2JhbFNheXNcIiwgXCI8PnNheVwiKSwgICAgICAgIFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiV2hhdCB3b3VsZCB5b3UgbGlrZSB0byBkbz9cIiksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLnJlYWRJbnB1dCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKFwiXCIpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wcmludCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5wYXJzZUNvbW1hbmQoKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uaGFuZGxlQ29tbWFuZCgpLFxyXG4gICAgICAgICAgICBJbnN0cnVjdGlvbi5nb1RvKDkpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdHlwZS5tZXRob2RzLnB1c2gobWFpbik7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIENvbXBpbGF0aW9uRXJyb3J7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG1lc3NhZ2U6c3RyaW5nKXtcclxuXHJcbiAgICB9XHJcbn0iLCJpbnRlcmZhY2UgSW5kZXhhYmxle1xyXG4gICAgW2tleTpzdHJpbmddOmFueTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEtleXdvcmRze1xyXG4gICAgXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYW4gPSBcImFuXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgYSA9IFwiYVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRoZSA9IFwidGhlXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaXMgPSBcImlzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkga2luZCA9IFwia2luZFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IG9mID0gXCJvZlwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBsYWNlID0gXCJwbGFjZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGl0ZW0gPSBcIml0ZW1cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBpdCA9IFwiaXRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBoYXMgPSBcImhhc1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGlmID0gXCJpZlwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGRlc2NyaXB0aW9uID0gXCJkZXNjcmlwdGlvblwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHVuZGVyc3RhbmQgPSBcInVuZGVyc3RhbmRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBhcyA9IFwiYXNcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkZXNjcmliaW5nID0gXCJkZXNjcmliaW5nXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgZGVzY3JpYmVkID0gXCJkZXNjcmliZWRcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB3aGVyZSA9IFwid2hlcmVcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwbGF5ZXIgPSBcInBsYXllclwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHN0YXJ0cyA9IFwic3RhcnRzXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY29udGFpbnMgPSBcImNvbnRhaW5zXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgc2F5ID0gXCJzYXlcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBkaXJlY3Rpb25zID0gXCJkaXJlY3Rpb25zXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgbW92aW5nID0gXCJtb3ZpbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSB0YWtpbmcgPSBcInRha2luZ1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGludmVudG9yeSA9IFwiaW52ZW50b3J5XCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgY2FuID0gXCJjYW5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSByZWFjaCA9IFwicmVhY2hcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBieSA9IFwiYnlcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBnb2luZyA9IFwiZ29pbmdcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBhbmQgPSBcImFuZFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHRoZW4gPSBcInRoZW5cIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBlbHNlID0gXCJlbHNlXCI7XHJcblxyXG4gICAgc3RhdGljIGdldEFsbCgpOlNldDxzdHJpbmc+e1xyXG4gICAgICAgIHR5cGUgS2V5d29yZFByb3BlcnRpZXMgPSBrZXlvZiBLZXl3b3JkcztcclxuXHJcbiAgICAgICAgY29uc3QgYWxsS2V5d29yZHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhLZXl3b3Jkcyk7XHJcblxyXG4gICAgICAgIGZvcihsZXQga2V5d29yZCBvZiBuYW1lcyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gKEtleXdvcmRzIGFzIEluZGV4YWJsZSlba2V5d29yZF07XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmIHZhbHVlICE9IFwiS2V5d29yZHNcIil7XHJcbiAgICAgICAgICAgICAgICBhbGxLZXl3b3Jkcy5hZGQodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYWxsS2V5d29yZHM7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgUHVuY3R1YXRpb257XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGVyaW9kID0gXCIuXCI7XHJcbn0iLCJpbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuL1Rva2VuXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4vS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgUHVuY3R1YXRpb24gfSBmcm9tIFwiLi9QdW5jdHVhdGlvblwiO1xyXG5pbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi9Ub2tlblR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUb2tlbml6ZXJ7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBhbGxLZXl3b3JkcyA9IEtleXdvcmRzLmdldEFsbCgpO1xyXG5cclxuICAgIHRva2VuaXplKGNvZGU6c3RyaW5nKTpUb2tlbltde1xyXG4gICAgICAgIGxldCBjdXJyZW50TGluZSA9IDE7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRDb2x1bW4gPSAxO1xyXG5cclxuICAgICAgICBjb25zdCB0b2tlbnM6VG9rZW5bXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb2RlLmxlbmd0aDsgKXtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudENoYXIgPSBjb2RlLmNoYXJBdChpbmRleCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gXCIgXCIpe1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvbHVtbisrO1xyXG4gICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoYXIgPT0gXCJcXG5cIil7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29sdW1uID0gMTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lKys7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB0b2tlblZhbHVlID0gdGhpcy5jb25zdW1lVG9rZW5DaGFyc0F0KGNvZGUsIGluZGV4KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0b2tlblZhbHVlLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBuZXcgVG9rZW4oY3VycmVudExpbmUsIGN1cnJlbnRDb2x1bW4sIHRva2VuVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50Q29sdW1uICs9IHRva2VuVmFsdWUubGVuZ3RoO1xyXG4gICAgICAgICAgICBpbmRleCArPSB0b2tlblZhbHVlLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzaWZ5KHRva2Vucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGFzc2lmeSh0b2tlbnM6VG9rZW5bXSk6VG9rZW5bXXtcclxuICAgICAgICBmb3IobGV0IHRva2VuIG9mIHRva2Vucyl7XHJcbiAgICAgICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PSBQdW5jdHVhdGlvbi5wZXJpb2Qpe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5UZXJtaW5hdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFRva2VuaXplci5hbGxLZXl3b3Jkcy5oYXModG9rZW4udmFsdWUpKXtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuS2V5d29yZDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbi52YWx1ZS5zdGFydHNXaXRoKFwiXFxcIlwiKSAmJiB0b2tlbi52YWx1ZS5lbmRzV2l0aChcIlxcXCJcIikpe1xyXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSA9IFRva2VuVHlwZS5TdHJpbmc7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWlzTmFOKE51bWJlcih0b2tlbi52YWx1ZSkpKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi50eXBlID0gVG9rZW5UeXBlLk51bWJlcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgPSBUb2tlblR5cGUuSWRlbnRpZmllcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRva2VucztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbnN1bWVUb2tlbkNoYXJzQXQoY29kZTpzdHJpbmcsIGluZGV4Om51bWJlcik6c3RyaW5ne1xyXG4gICAgICAgIGNvbnN0IHRva2VuQ2hhcnM6c3RyaW5nW10gPSBbXTtcclxuICAgICAgICBjb25zdCBzdHJpbmdEZWxpbWl0ZXIgPSBcIlxcXCJcIjtcclxuXHJcbiAgICAgICAgbGV0IGlzQ29uc3VtaW5nU3RyaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvcihsZXQgcmVhZEFoZWFkSW5kZXggPSBpbmRleDsgcmVhZEFoZWFkSW5kZXggPCBjb2RlLmxlbmd0aDsgcmVhZEFoZWFkSW5kZXgrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDaGFyID0gY29kZS5jaGFyQXQocmVhZEFoZWFkSW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlzQ29uc3VtaW5nU3RyaW5nICYmIGN1cnJlbnRDaGFyICE9IHN0cmluZ0RlbGltaXRlcil7XHJcbiAgICAgICAgICAgICAgICB0b2tlbkNoYXJzLnB1c2goY3VycmVudENoYXIpO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50Q2hhciA9PSBzdHJpbmdEZWxpbWl0ZXIpeyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRva2VuQ2hhcnMucHVzaChjdXJyZW50Q2hhcik7ICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGlzQ29uc3VtaW5nU3RyaW5nID0gIWlzQ29uc3VtaW5nU3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc0NvbnN1bWluZ1N0cmluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7ICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDaGFyID09IFwiIFwiIHx8IGN1cnJlbnRDaGFyID09IFwiXFxuXCIgfHwgY3VycmVudENoYXIgPT0gUHVuY3R1YXRpb24ucGVyaW9kKXtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbkNoYXJzLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbkNoYXJzLnB1c2goY3VycmVudENoYXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRva2VuQ2hhcnMucHVzaChjdXJyZW50Q2hhcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW5DaGFycy5qb2luKFwiXCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4vVG9rZW5UeXBlXCI7XHJcbmltcG9ydCB7IFBsYWNlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxhY2VcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBJdGVtIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvSXRlbVwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRva2Vue1xyXG4gICAgc3RhdGljIGdldCBlbXB0eSgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoXCI8PmVtcHR5XCIsIFRva2VuVHlwZS5Vbmtub3duKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvckFueSgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoQW55LnR5cGVOYW1lLCBUb2tlblR5cGUuS2V5d29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBmb3JQbGFjZSgpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoUGxhY2UudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvckl0ZW0oKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKEl0ZW0udHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvcldvcmxkT2JqZWN0KCk6VG9rZW57XHJcbiAgICAgICAgcmV0dXJuIFRva2VuLmdldFRva2VuV2l0aFR5cGVPZihXb3JsZE9iamVjdC50eXBlTmFtZSwgVG9rZW5UeXBlLktleXdvcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgZm9yQm9vbGVhbigpOlRva2Vue1xyXG4gICAgICAgIHJldHVybiBUb2tlbi5nZXRUb2tlbldpdGhUeXBlT2YoQm9vbGVhblR5cGUudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGZvckxpc3QoKTpUb2tlbntcclxuICAgICAgICByZXR1cm4gVG9rZW4uZ2V0VG9rZW5XaXRoVHlwZU9mKExpc3QudHlwZU5hbWUsIFRva2VuVHlwZS5LZXl3b3JkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRUb2tlbldpdGhUeXBlT2YobmFtZTpzdHJpbmcsIHR5cGU6VG9rZW5UeXBlKXtcclxuICAgICAgICBjb25zdCB0b2tlbiA9IG5ldyBUb2tlbigtMSwtMSxuYW1lKTtcclxuICAgICAgICB0b2tlbi50eXBlID0gdHlwZTtcclxuICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9XHJcblxyXG4gICAgdHlwZTpUb2tlblR5cGUgPSBUb2tlblR5cGUuVW5rbm93bjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbGluZTpudW1iZXIsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgY29sdW1uOm51bWJlcixcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB2YWx1ZTpzdHJpbmcpe1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gVG9rZW5UeXBle1xyXG4gICAgVW5rbm93bixcclxuICAgIEtleXdvcmQsXHJcbiAgICBUZXJtaW5hdG9yLFxyXG4gICAgU3RyaW5nLFxyXG4gICAgSWRlbnRpZmllcixcclxuICAgIE51bWJlclxyXG59IiwiaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5UeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGFyc2VDb250ZXh0e1xyXG4gICAgdG9rZW5zOlRva2VuW10gPSBbXTtcclxuICAgIGluZGV4Om51bWJlciA9IDA7XHJcblxyXG4gICAgZ2V0IGlzRG9uZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ID49IHRoaXMudG9rZW5zLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudFRva2VuKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRva2VuczpUb2tlbltdKXtcclxuICAgICAgICB0aGlzLnRva2VucyA9IHRva2VucztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdW1lQ3VycmVudFRva2VuKCl7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLmN1cnJlbnRUb2tlbjtcclxuXHJcbiAgICAgICAgdGhpcy5pbmRleCsrO1xyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9XHJcblxyXG4gICAgaXModG9rZW5WYWx1ZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUb2tlbj8udmFsdWUgPT0gdG9rZW5WYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpc0FueU9mKC4uLnRva2VuVmFsdWVzOnN0cmluZ1tdKXtcclxuICAgICAgICBmb3IobGV0IHZhbHVlIG9mIHRva2VuVmFsdWVzKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXModmFsdWUpKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0QW55T2YoLi4udG9rZW5WYWx1ZXM6c3RyaW5nW10pe1xyXG4gICAgICAgIGlmICghdGhpcy5pc0FueU9mKC4uLnRva2VuVmFsdWVzKSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiRXhwZWN0ZWQgdG9rZW5zXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0KHRva2VuVmFsdWU6c3RyaW5nKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9rZW4udmFsdWUgIT0gdG9rZW5WYWx1ZSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKGBFeHBlY3RlZCB0b2tlbiAnJHt0b2tlblZhbHVlfSdgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RTdHJpbmcoKXtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9rZW4udHlwZSAhPSBUb2tlblR5cGUuU3RyaW5nKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJFeHBlY3RlZCBzdHJpbmdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0b2tlbiA9IHRoaXMuY29uc3VtZUN1cnJlbnRUb2tlbigpO1xyXG5cclxuICAgICAgICAvLyBXZSBuZWVkIHRvIHN0cmlwIG9mZiB0aGUgZG91YmxlIHF1b3RlcyBmcm9tIHRoZWlyIHN0cmluZyBhZnRlciB3ZSBjb25zdW1lIGl0LlxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBuZXcgVG9rZW4odG9rZW4ubGluZSwgdG9rZW4uY29sdW1uLCB0b2tlbi52YWx1ZS5zdWJzdHJpbmcoMSwgdG9rZW4udmFsdWUubGVuZ3RoIC0gMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cGVjdE51bWJlcigpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi50eXBlICE9IFRva2VuVHlwZS5OdW1iZXIpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIG51bWJlclwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBlY3RJZGVudGlmaWVyKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRva2VuLnR5cGUgIT0gVG9rZW5UeXBlLklkZW50aWZpZXIpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkV4cGVjdGVkIGlkZW50aWZpZXJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0VGVybWluYXRvcigpe1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb2tlbi50eXBlICE9IFRva2VuVHlwZS5UZXJtaW5hdG9yKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJFeHBlY3RlZCBzdGF0ZW1lbnQgdGVybWluYXRvclwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN1bWVDdXJyZW50VG9rZW4oKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRva2VuIH0gZnJvbSBcIi4uL2xleGluZy9Ub2tlblwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQcm9ncmFtVmlzaXRvciB9IGZyb20gXCIuL3Zpc2l0b3JzL1Byb2dyYW1WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuL1BhcnNlQ29udGV4dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRhbG9uUGFyc2Vye1xyXG4gICAgcGFyc2UodG9rZW5zOlRva2VuW10pOkV4cHJlc3Npb257XHJcbiAgICAgICAgY29uc3QgY29udGV4dCA9IG5ldyBQYXJzZUNvbnRleHQodG9rZW5zKTtcclxuICAgICAgICBjb25zdCB2aXNpdG9yID0gbmV3IFByb2dyYW1WaXNpdG9yKCk7XHJcblxyXG4gICAgICAgIHJldHVybiB2aXNpdG9yLnZpc2l0KGNvbnRleHQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCaW5hcnlFeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGxlZnQ/OkV4cHJlc3Npb247XHJcbiAgICByaWdodD86RXhwcmVzc2lvbjtcclxufSIsImltcG9ydCB7IEJpbmFyeUV4cHJlc3Npb24gfSBmcm9tIFwiLi9CaW5hcnlFeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb24gZXh0ZW5kcyBCaW5hcnlFeHByZXNzaW9ue1xyXG4gICAgXHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbnRhaW5zRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdGFyZ2V0TmFtZTpzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgY291bnQ6bnVtYmVyLCBcclxuICAgICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSB0eXBlTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgRXhwcmVzc2lvbntcclxuICAgIFxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuL1R5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQmluYXJ5RXhwcmVzc2lvbiB9IGZyb20gXCIuL0JpbmFyeUV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBuYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICB0eXBlTmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgaW5pdGlhbFZhbHVlPzpPYmplY3Q7XHJcbiAgICB0eXBlPzpUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uO1xyXG4gICAgYXNzb2NpYXRlZEV4cHJlc3Npb25zOkJpbmFyeUV4cHJlc3Npb25bXSA9IFtdO1xyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJZkV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGNvbmRpdGlvbmFsOkV4cHJlc3Npb24sXHJcbiAgICAgICAgICAgICAgICBwdWJsaWMgcmVhZG9ubHkgaWZCbG9jazpFeHByZXNzaW9uLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IGVsc2VCbG9jazpFeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9ncmFtRXhwcmVzc2lvbiBleHRlbmRzIEV4cHJlc3Npb257XHJcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBleHByZXNzaW9uczpFeHByZXNzaW9uW10pe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4vRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNheUV4cHJlc3Npb24gZXh0ZW5kcyBFeHByZXNzaW9ue1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHRleHQ6c3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4vRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIGJhc2VUeXBlPzpUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uO1xyXG4gICAgZmllbGRzOkZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uW10gPSBbXTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZVRva2VuOlRva2VuLCByZWFkb25seSBiYXNlVHlwZU5hbWVUb2tlbjpUb2tlbil7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lVG9rZW4udmFsdWU7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuL0V4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uIGV4dGVuZHMgRXhwcmVzc2lvbntcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB2YWx1ZTpzdHJpbmcsIHB1YmxpYyByZWFkb25seSBtZWFuaW5nOnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBJZkV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vSWZFeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBDb21waWxhdGlvbkVycm9yIH0gZnJvbSBcIi4uLy4uL2V4Y2VwdGlvbnMvQ29tcGlsYXRpb25FcnJvclwiO1xyXG5pbXBvcnQgeyBDb250YWluc0V4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvQ29udGFpbnNFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFNheUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvU2F5RXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV4cHJlc3Npb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmlmKSl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgSWZFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuaXQpKXtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaXQpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5jb250YWlucyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IGNvbnRleHQuZXhwZWN0TnVtYmVyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVOYW1lID0gY29udGV4dC5leHBlY3RJZGVudGlmaWVyKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbnRhaW5zRXhwcmVzc2lvbihcIjw+aXRcIiwgTnVtYmVyKGNvdW50LnZhbHVlKSwgdHlwZU5hbWUudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5zYXkpKXtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuc2F5KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTYXlFeHByZXNzaW9uKHRleHQudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiVW5hYmxlIHRvIHBhcnNlIGV4cHJlc3Npb25cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9GaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi8uLi8uLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IEJvb2xlYW5UeXBlIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvQm9vbGVhblR5cGVcIjtcclxuaW1wb3J0IHsgQ29tcGlsYXRpb25FcnJvciB9IGZyb20gXCIuLi8uLi9leGNlcHRpb25zL0NvbXBpbGF0aW9uRXJyb3JcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBBbmRFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0FuZEV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvblZpc2l0b3IgfSBmcm9tIFwiLi9FeHByZXNzaW9uVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBDb25jYXRlbmF0aW9uRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9Db25jYXRlbmF0aW9uRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEZpZWxkRGVjbGFyYXRpb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG5cclxuICAgICAgICBjb25zdCBmaWVsZCA9IG5ldyBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbigpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pdCk7XHJcblxyXG4gICAgICAgIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmlzKSl7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmlzKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmRlc2NyaWJlZCkpe1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuZGVzY3JpYmVkKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmFzKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGNvbnRleHQuZXhwZWN0U3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZmllbGQubmFtZSA9IFdvcmxkT2JqZWN0LmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gZGVzY3JpcHRpb24udmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvbnRleHQuaXMoS2V5d29yZHMuYW5kKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYW5kKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHByZXNzaW9uVmlzaXRvciA9IG5ldyBFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGVmdEV4cHJlc3Npb24gPSAoZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zLmxlbmd0aCA9PSAwKSA/IGZpZWxkIDogZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zW2ZpZWxkLmFzc29jaWF0ZWRFeHByZXNzaW9ucy5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29uY2F0ID0gbmV3IENvbmNhdGVuYXRpb25FeHByZXNzaW9uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmNhdC5sZWZ0ID0gbGVmdEV4cHJlc3Npb247XHJcbiAgICAgICAgICAgICAgICAgICAgY29uY2F0LnJpZ2h0ID0gZXhwcmVzc2lvbjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGQuYXNzb2NpYXRlZEV4cHJlc3Npb25zLnB1c2goY29uY2F0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy53aGVyZSkpe1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMud2hlcmUpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnBsYXllcik7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5zdGFydHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBQbGFjZS5pc1BsYXllclN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBCb29sZWFuVHlwZS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgIGZpZWxkLmluaXRpYWxWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIlVuYWJsZSB0byBkZXRlcm1pbmUgcHJvcGVydHkgZmllbGRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuY29udGFpbnMpKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmNvbnRhaW5zKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gY29udGV4dC5leHBlY3ROdW1iZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgLy8gVE9ETzogU3VwcG9ydCBtdWx0aXBsZSBjb250ZW50IGVudHJpZXMuXHJcblxyXG4gICAgICAgICAgICBmaWVsZC5uYW1lID0gV29ybGRPYmplY3QuY29udGVudHM7XHJcbiAgICAgICAgICAgIGZpZWxkLnR5cGVOYW1lID0gTGlzdC50eXBlTmFtZTtcclxuICAgICAgICAgICAgZmllbGQuaW5pdGlhbFZhbHVlID0gW1tOdW1iZXIoY291bnQudmFsdWUpLCBuYW1lLnZhbHVlXV07IFxyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pcyhLZXl3b3Jkcy5jYW4pKXtcclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLmNhbik7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnJlYWNoKTtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMudGhlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlTmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYnkpO1xyXG4gICAgICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5nb2luZyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgZmllbGQubmFtZSA9IGA8PiR7ZGlyZWN0aW9uLnZhbHVlLnN1YnN0cmluZygxLCBkaXJlY3Rpb24udmFsdWUubGVuZ3RoIC0gMSl9YDtcclxuICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBTdHJpbmdUeXBlLnR5cGVOYW1lO1xyXG4gICAgICAgICAgICBmaWVsZC5pbml0aWFsVmFsdWUgPSBgXCIke3BsYWNlTmFtZS52YWx1ZX1cImA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJVbmFibGUgdG8gZGV0ZXJtaW5lIGZpZWxkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjb250ZXh0LmV4cGVjdFRlcm1pbmF0b3IoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZpZWxkO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vRXhwcmVzc2lvblZpc2l0b3JcIjtcclxuaW1wb3J0IHsgSWZFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0lmRXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIElmRXhwcmVzc2lvblZpc2l0b3IgZXh0ZW5kcyBWaXNpdG9ye1xyXG4gICAgdmlzaXQoY29udGV4dDogUGFyc2VDb250ZXh0KTogRXhwcmVzc2lvbiB7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuaWYpO1xyXG5cclxuICAgICAgICBjb25zdCBleHByZXNzaW9uVmlzaXRvciA9IG5ldyBFeHByZXNzaW9uVmlzaXRvcigpO1xyXG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbmFsID0gZXhwcmVzc2lvblZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnRoZW4pO1xyXG5cclxuICAgICAgICBjb25zdCBpZkJsb2NrID0gZXhwcmVzc2lvblZpc2l0b3IudmlzaXQoY29udGV4dCk7XHJcblxyXG4gICAgICAgIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLmVsc2UpKXtcclxuICAgICAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuZWxzZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBlbHNlQmxvY2sgPSBleHByZXNzaW9uVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgSWZFeHByZXNzaW9uKGNvbmRpdGlvbmFsLCBpZkJsb2NrLCBlbHNlQmxvY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBJZkV4cHJlc3Npb24oY29uZGl0aW9uYWwsIGlmQmxvY2ssIG5ldyBFeHByZXNzaW9uKCkpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFR5cGVEZWNsYXJhdGlvblZpc2l0b3IgfSBmcm9tIFwiLi9UeXBlRGVjbGFyYXRpb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFByb2dyYW1FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1Byb2dyYW1FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvblZpc2l0b3IgfSBmcm9tIFwiLi9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFNheUV4cHJlc3Npb25WaXNpdG9yIH0gZnJvbSBcIi4vU2F5RXhwcmVzc2lvblZpc2l0b3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9ncmFtVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBsZXQgZXhwcmVzc2lvbnM6RXhwcmVzc2lvbltdID0gW107XHJcblxyXG4gICAgICAgIHdoaWxlKCFjb250ZXh0LmlzRG9uZSl7XHJcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmlzKEtleXdvcmRzLnVuZGVyc3RhbmQpKXtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbiA9IG5ldyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gdW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uLnZpc2l0KGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5pc0FueU9mKEtleXdvcmRzLmEsIEtleXdvcmRzLmFuKSl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlRGVjbGFyYXRpb24gPSBuZXcgVHlwZURlY2xhcmF0aW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHR5cGVEZWNsYXJhdGlvbi52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQuaXMoS2V5d29yZHMuc2F5KSl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzYXlFeHByZXNzaW9uID0gbmV3IFNheUV4cHJlc3Npb25WaXNpdG9yKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gc2F5RXhwcmVzc2lvbi52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKGV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQ29tcGlsYXRpb25FcnJvcihcIkZvdW5kIHVuZXhwZWN0ZWQgdG9rZW5cIik7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvZ3JhbUV4cHJlc3Npb24oZXhwcmVzc2lvbnMpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgVmlzaXRvciB9IGZyb20gXCIuL1Zpc2l0b3JcIjtcclxuaW1wb3J0IHsgUGFyc2VDb250ZXh0IH0gZnJvbSBcIi4uL1BhcnNlQ29udGV4dFwiO1xyXG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgS2V5d29yZHMgfSBmcm9tIFwiLi4vLi4vbGV4aW5nL0tleXdvcmRzXCI7XHJcbmltcG9ydCB7IFNheUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvU2F5RXhwcmVzc2lvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNheUV4cHJlc3Npb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnNheSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRleHQgPSBjb250ZXh0LmV4cGVjdFN0cmluZygpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFNheUV4cHJlc3Npb24odGV4dC52YWx1ZSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBWaXNpdG9yIH0gZnJvbSBcIi4vVmlzaXRvclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbnRleHQgfSBmcm9tIFwiLi4vUGFyc2VDb250ZXh0XCI7XHJcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBLZXl3b3JkcyB9IGZyb20gXCIuLi8uLi9sZXhpbmcvS2V5d29yZHNcIjtcclxuaW1wb3J0IHsgVG9rZW4gfSBmcm9tIFwiLi4vLi4vbGV4aW5nL1Rva2VuXCI7XHJcbmltcG9ydCB7IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vZXhwcmVzc2lvbnMvVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBGaWVsZERlY2xhcmF0aW9uVmlzaXRvciB9IGZyb20gXCIuL0ZpZWxkRGVjbGFyYXRpb25WaXNpdG9yXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL0ZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHlwZURlY2xhcmF0aW9uVmlzaXRvciBleHRlbmRzIFZpc2l0b3J7XHJcbiAgICB2aXNpdChjb250ZXh0OiBQYXJzZUNvbnRleHQpOiBFeHByZXNzaW9uIHtcclxuICAgICAgICBjb250ZXh0LmV4cGVjdEFueU9mKEtleXdvcmRzLmEsIEtleXdvcmRzLmFuKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG5cclxuICAgICAgICBjb250ZXh0LmV4cGVjdChLZXl3b3Jkcy5pcyk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYSk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMua2luZCk7XHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMub2YpO1xyXG5cclxuICAgICAgICBjb25zdCBiYXNlVHlwZSA9IHRoaXMuZXhwZWN0QmFzZVR5cGUoY29udGV4dCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGZpZWxkczpGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbltdID0gW107XHJcblxyXG4gICAgICAgIHdoaWxlIChjb250ZXh0LmlzKEtleXdvcmRzLml0KSl7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkVmlzaXRvciA9IG5ldyBGaWVsZERlY2xhcmF0aW9uVmlzaXRvcigpO1xyXG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9IGZpZWxkVmlzaXRvci52aXNpdChjb250ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKDxGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbj5maWVsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0eXBlRGVjbGFyYXRpb24gPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihuYW1lLCBiYXNlVHlwZSk7XHJcblxyXG4gICAgICAgIHR5cGVEZWNsYXJhdGlvbi5maWVsZHMgPSBmaWVsZHM7XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlRGVjbGFyYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBleHBlY3RCYXNlVHlwZShjb250ZXh0OlBhcnNlQ29udGV4dCl7XHJcbiAgICAgICAgaWYgKGNvbnRleHQuaXNBbnlPZihLZXl3b3Jkcy5wbGFjZSwgS2V5d29yZHMuaXRlbSkpe1xyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5jb25zdW1lQ3VycmVudFRva2VuKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuZXhwZWN0SWRlbnRpZmllcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFZpc2l0b3IgfSBmcm9tIFwiLi9WaXNpdG9yXCI7XHJcbmltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEtleXdvcmRzIH0gZnJvbSBcIi4uLy4uL2xleGluZy9LZXl3b3Jkc1wiO1xyXG5pbXBvcnQgeyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL2V4cHJlc3Npb25zL1VuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25WaXNpdG9yIGV4dGVuZHMgVmlzaXRvcntcclxuICAgIHZpc2l0KGNvbnRleHQ6IFBhcnNlQ29udGV4dCk6IEV4cHJlc3Npb24ge1xyXG4gICAgICAgIGNvbnRleHQuZXhwZWN0KEtleXdvcmRzLnVuZGVyc3RhbmQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gY29udGV4dC5leHBlY3RTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3QoS2V5d29yZHMuYXMpO1xyXG5cclxuICAgICAgICBjb25zdCBtZWFuaW5nID0gY29udGV4dC5leHBlY3RBbnlPZihLZXl3b3Jkcy5kZXNjcmliaW5nLCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy5tb3ZpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2V5d29yZHMuZGlyZWN0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBLZXl3b3Jkcy50YWtpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgS2V5d29yZHMuaW52ZW50b3J5KTtcclxuXHJcbiAgICAgICAgY29udGV4dC5leHBlY3RUZXJtaW5hdG9yKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbih2YWx1ZS52YWx1ZSwgbWVhbmluZy52YWx1ZSk7ICAgICAgICBcclxuICAgIH1cclxufSIsImltcG9ydCB7IFBhcnNlQ29udGV4dCB9IGZyb20gXCIuLi9QYXJzZUNvbnRleHRcIjtcclxuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9leHByZXNzaW9ucy9FeHByZXNzaW9uXCI7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVmlzaXRvcntcclxuICAgIGFic3RyYWN0IHZpc2l0KGNvbnRleHQ6UGFyc2VDb250ZXh0KTpFeHByZXNzaW9uO1xyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgUHJvZ3JhbUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9Qcm9ncmFtRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvblwiO1xyXG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuLi9sZXhpbmcvVG9rZW5cIjtcclxuaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uL2xleGluZy9Ub2tlblR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvblNlbWFudGljQW5hbHl6ZXJ7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhbnkgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JBbnksIFRva2VuLmVtcHR5KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgd29ybGRPYmplY3QgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JXb3JsZE9iamVjdCwgVG9rZW4uZm9yQW55KTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGxhY2UgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JQbGFjZSwgVG9rZW4uZm9yV29ybGRPYmplY3QpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBpdGVtID0gbmV3IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24oVG9rZW4uZm9ySXRlbSwgVG9rZW4uZm9yV29ybGRPYmplY3QpO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBib29sZWFuVHlwZSA9IG5ldyBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKFRva2VuLmZvckJvb2xlYW4sIFRva2VuLmZvckFueSk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxpc3QgPSBuZXcgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbihUb2tlbi5mb3JMaXN0LCBUb2tlbi5mb3JBbnkpO1xyXG5cclxuICAgIGFuYWx5emUoZXhwcmVzc2lvbjpFeHByZXNzaW9uKTpFeHByZXNzaW9ue1xyXG4gICAgICAgIGNvbnN0IHR5cGVzOlR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb25bXSA9IFt0aGlzLmFueSwgdGhpcy53b3JsZE9iamVjdCwgdGhpcy5wbGFjZSwgdGhpcy5ib29sZWFuVHlwZSwgdGhpcy5pdGVtXTtcclxuXHJcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBQcm9ncmFtRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2hpbGQgb2YgZXhwcmVzc2lvbi5leHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlcy5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHlwZXNCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbj4odHlwZXMubWFwKHggPT4gW3gubmFtZSwgeF0pKTtcclxuXHJcbiAgICAgICAgZm9yKGNvbnN0IGRlY2xhcmF0aW9uIG9mIHR5cGVzKXtcclxuICAgICAgICAgICAgY29uc3QgYmFzZVRva2VuID0gZGVjbGFyYXRpb24uYmFzZVR5cGVOYW1lVG9rZW47XHJcblxyXG4gICAgICAgICAgICBpZiAoYmFzZVRva2VuLnR5cGUgPT0gVG9rZW5UeXBlLktleXdvcmQgJiYgIWJhc2VUb2tlbi52YWx1ZS5zdGFydHNXaXRoKFwiPD5cIikpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGA8PiR7YmFzZVRva2VuLnZhbHVlfWA7XHJcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbi5iYXNlVHlwZSA9IHR5cGVzQnlOYW1lLmdldChuYW1lKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uLmJhc2VUeXBlID0gdHlwZXNCeU5hbWUuZ2V0KGJhc2VUb2tlbi52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcihjb25zdCBmaWVsZCBvZiBkZWNsYXJhdGlvbi5maWVsZHMpe1xyXG4gICAgICAgICAgICAgICAgZmllbGQudHlwZSA9IHR5cGVzQnlOYW1lLmdldChmaWVsZC50eXBlTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBleHByZXNzaW9uO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL0V4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBQcm9ncmFtRXhwcmVzc2lvbiB9IGZyb20gXCIuLi9wYXJzaW5nL2V4cHJlc3Npb25zL1Byb2dyYW1FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IENvbXBpbGF0aW9uRXJyb3IgfSBmcm9tIFwiLi4vZXhjZXB0aW9ucy9Db21waWxhdGlvbkVycm9yXCI7XHJcbmltcG9ydCB7IFR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9UeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmdEZWNsYXJhdGlvbkV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9VbmRlcnN0YW5kaW5nRGVjbGFyYXRpb25FeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9VbmRlcnN0YW5kaW5nXCI7XHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IEJvb2xlYW5UeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQm9vbGVhblR5cGVcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0l0ZW1cIjtcclxuaW1wb3J0IHsgTnVtYmVyVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L051bWJlclR5cGVcIjtcclxuaW1wb3J0IHsgTGlzdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0xpc3RcIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxheWVyXCI7XHJcbmltcG9ydCB7IFNheUV4cHJlc3Npb24gfSBmcm9tIFwiLi4vcGFyc2luZy9leHByZXNzaW9ucy9TYXlFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IFNheSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1NheVwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuLi8uLi9jb21tb24vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgUGFyYW1ldGVyIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9QYXJhbWV0ZXJcIjtcclxuaW1wb3J0IHsgSWZFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvSWZFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IENvbmNhdGVuYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29uY2F0ZW5hdGlvbkV4cHJlc3Npb25cIjtcclxuaW1wb3J0IHsgQ29udGFpbnNFeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvQ29udGFpbnNFeHByZXNzaW9uXCI7XHJcbmltcG9ydCB7IEZpZWxkRGVjbGFyYXRpb25FeHByZXNzaW9uIH0gZnJvbSBcIi4uL3BhcnNpbmcvZXhwcmVzc2lvbnMvRmllbGREZWNsYXJhdGlvbkV4cHJlc3Npb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWxvblRyYW5zZm9ybWVye1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVTeXN0ZW1UeXBlcygpe1xyXG4gICAgICAgIGNvbnN0IHR5cGVzOlR5cGVbXSA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFRoZXNlIGFyZSBvbmx5IGhlcmUgYXMgc3R1YnMgZm9yIGV4dGVybmFsIHJ1bnRpbWUgdHlwZXMgdGhhdCBhbGxvdyB1cyB0byBjb3JyZWN0bHkgcmVzb2x2ZSBmaWVsZCB0eXBlcy5cclxuXHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShBbnkudHlwZU5hbWUsIEFueS5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoV29ybGRPYmplY3QudHlwZU5hbWUsIFdvcmxkT2JqZWN0LnBhcmVudFR5cGVOYW1lKSk7XHJcbiAgICAgICAgdHlwZXMucHVzaChuZXcgVHlwZShQbGFjZS50eXBlTmFtZSwgUGxhY2UucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKEJvb2xlYW5UeXBlLnR5cGVOYW1lLCBCb29sZWFuVHlwZS5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoU3RyaW5nVHlwZS50eXBlTmFtZSwgU3RyaW5nVHlwZS5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoSXRlbS50eXBlTmFtZSwgSXRlbS5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoTGlzdC50eXBlTmFtZSwgTGlzdC5wYXJlbnRUeXBlTmFtZSkpO1xyXG4gICAgICAgIHR5cGVzLnB1c2gobmV3IFR5cGUoUGxheWVyLnR5cGVOYW1lLCBQbGF5ZXIucGFyZW50VHlwZU5hbWUpKTtcclxuICAgICAgICB0eXBlcy5wdXNoKG5ldyBUeXBlKFNheS50eXBlTmFtZSwgU2F5LnBhcmVudFR5cGVOYW1lKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgTWFwPHN0cmluZywgVHlwZT4odHlwZXMubWFwKHggPT4gW3gubmFtZSwgeF0pKTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm0oZXhwcmVzc2lvbjpFeHByZXNzaW9uKTpUeXBlW117XHJcbiAgICAgICAgY29uc3QgdHlwZXNCeU5hbWUgPSB0aGlzLmNyZWF0ZVN5c3RlbVR5cGVzKCk7XHJcbiAgICAgICAgbGV0IGR5bmFtaWNUeXBlQ291bnQgPSAwO1xyXG5cclxuICAgICAgICBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIFByb2dyYW1FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgZm9yKGNvbnN0IGNoaWxkIG9mIGV4cHJlc3Npb24uZXhwcmVzc2lvbnMpe1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgVW5kZXJzdGFuZGluZ0RlY2xhcmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IG5ldyBUeXBlKGA8fj4ke1VuZGVyc3RhbmRpbmcudHlwZU5hbWV9XyR7ZHluYW1pY1R5cGVDb3VudH1gLCBVbmRlcnN0YW5kaW5nLnR5cGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb24gPSBuZXcgRmllbGQoKTtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24ubmFtZSA9IFVuZGVyc3RhbmRpbmcuYWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbi5kZWZhdWx0VmFsdWUgPSBjaGlsZC52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVhbmluZyA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lYW5pbmcubmFtZSA9IFVuZGVyc3RhbmRpbmcubWVhbmluZztcclxuICAgICAgICAgICAgICAgICAgICBtZWFuaW5nLmRlZmF1bHRWYWx1ZSA9IGNoaWxkLm1lYW5pbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZS5maWVsZHMucHVzaChhY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGUuZmllbGRzLnB1c2gobWVhbmluZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWNUeXBlQ291bnQrKztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZXNCeU5hbWUuc2V0KHR5cGUubmFtZSwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgVHlwZURlY2xhcmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMudHJhbnNmb3JtSW5pdGlhbFR5cGVEZWNsYXJhdGlvbihjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZXNCeU5hbWUuc2V0KHR5cGUubmFtZSwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IoY29uc3QgY2hpbGQgb2YgZXhwcmVzc2lvbi5leHByZXNzaW9ucyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBUeXBlRGVjbGFyYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gdHlwZXNCeU5hbWUuZ2V0KGNoaWxkLm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IoY29uc3QgZmllbGRFeHByZXNzaW9uIG9mIGNoaWxkLmZpZWxkcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLm5hbWUgPSBmaWVsZEV4cHJlc3Npb24ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQudHlwZU5hbWUgPSBmaWVsZEV4cHJlc3Npb24udHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLnR5cGUgPSB0eXBlc0J5TmFtZS5nZXQoZmllbGRFeHByZXNzaW9uLnR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZEV4cHJlc3Npb24uaW5pdGlhbFZhbHVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZC50eXBlTmFtZSA9PSBTdHJpbmdUeXBlLnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IDxzdHJpbmc+ZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZU5hbWUgPT0gTnVtYmVyVHlwZS50eXBlTmFtZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBOdW1iZXIoZmllbGRFeHByZXNzaW9uLmluaXRpYWxWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuZGVmYXVsdFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLmRlZmF1bHRWYWx1ZSA9IGZpZWxkRXhwcmVzc2lvbi5pbml0aWFsVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZEV4cHJlc3Npb24uYXNzb2NpYXRlZEV4cHJlc3Npb25zLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2V0RmllbGQgPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5uYW1lID0gYDw+Z2V0XyR7ZmllbGQubmFtZX1gO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RmllbGQucGFyYW1ldGVycy5wdXNoKG5ldyBQYXJhbWV0ZXIoXCI8PnZhbHVlXCIsIGZpZWxkLnR5cGVOYW1lKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5yZXR1cm5UeXBlID0gZmllbGQudHlwZU5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihjb25zdCBhc3NvY2lhdGVkIG9mIGZpZWxkRXhwcmVzc2lvbi5hc3NvY2lhdGVkRXhwcmVzc2lvbnMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihjb25zdCBpbnN0cnVjdGlvbiBvZiB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oYXNzb2NpYXRlZCkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5ib2R5LnB1c2goaW5zdHJ1Y3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaWVsZC5ib2R5LnB1c2goSW5zdHJ1Y3Rpb24ucmV0dXJuKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/Lm1ldGhvZHMucHVzaChnZXRGaWVsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU/LmZpZWxkcy5wdXNoKGZpZWxkKTsgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXNXb3JsZE9iamVjdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGN1cnJlbnQgPSB0eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gdHlwZXNCeU5hbWUuZ2V0KGN1cnJlbnQuYmFzZVR5cGVOYW1lKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudC5uYW1lID09IFdvcmxkT2JqZWN0LnR5cGVOYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1dvcmxkT2JqZWN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNXb3JsZE9iamVjdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NyaWJlID0gbmV3IE1ldGhvZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmliZS5uYW1lID0gV29ybGRPYmplY3QuZGVzY3JpYmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaWJlLmJvZHkucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkUHJvcGVydHkoV29ybGRPYmplY3QuZGVzY3JpcHRpb24pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucHJpbnQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLnJldHVybigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPy5tZXRob2RzLnB1c2goZGVzY3JpYmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGdsb2JhbFNheXMgPSBleHByZXNzaW9uLmV4cHJlc3Npb25zLmZpbHRlcih4ID0+IHggaW5zdGFuY2VvZiBTYXlFeHByZXNzaW9uKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChnbG9iYWxTYXlzLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IG5ldyBUeXBlKGA8fj5nbG9iYWxTYXlzYCwgU2F5LnR5cGVOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRob2QgPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgICAgICAgICBtZXRob2QubmFtZSA9IFNheS50eXBlTmFtZTtcclxuICAgICAgICAgICAgICAgIG1ldGhvZC5wYXJhbWV0ZXJzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25zOkluc3RydWN0aW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IoY29uc3Qgc2F5IG9mIGdsb2JhbFNheXMpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNheUV4cHJlc3Npb24gPSA8U2F5RXhwcmVzc2lvbj5zYXk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKHNheUV4cHJlc3Npb24udGV4dCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLnByaW50KClcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLnJldHVybigpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBtZXRob2QuYm9keSA9IGluc3RydWN0aW9ucztcclxuXHJcbiAgICAgICAgICAgICAgICB0eXBlLm1ldGhvZHMucHVzaChtZXRob2QpO1xyXG5cclxuICAgICAgICAgICAgICAgIHR5cGVzQnlOYW1lLnNldCh0eXBlLm5hbWUsIHR5cGUpOyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBDb21waWxhdGlvbkVycm9yKFwiVW5hYmxlIHRvIHBhcnRpYWxseSB0cmFuc2Zvcm1cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0eXBlc0J5TmFtZS52YWx1ZXMoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb246RXhwcmVzc2lvbil7XHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25zOkluc3RydWN0aW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBJZkV4cHJlc3Npb24peyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb25hbCA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmNvbmRpdGlvbmFsKTtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goLi4uY29uZGl0aW9uYWwpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaWZCbG9jayA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLmlmQmxvY2spO1xyXG4gICAgICAgICAgICBjb25zdCBlbHNlQmxvY2sgPSB0aGlzLnRyYW5zZm9ybUV4cHJlc3Npb24oZXhwcmVzc2lvbi5lbHNlQmxvY2spO1xyXG5cclxuICAgICAgICAgICAgaWZCbG9jay5wdXNoKEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlKGVsc2VCbG9jay5sZW5ndGgpKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKEluc3RydWN0aW9uLmJyYW5jaFJlbGF0aXZlSWZGYWxzZShpZkJsb2NrLmxlbmd0aCkpXHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKC4uLmlmQmxvY2spO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5lbHNlQmxvY2spO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIFNheUV4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGV4cHJlc3Npb24udGV4dCkpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5wcmludCgpKTtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goSW5zdHJ1Y3Rpb24ubG9hZFN0cmluZyhleHByZXNzaW9uLnRleHQpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBDb250YWluc0V4cHJlc3Npb24pe1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWROdW1iZXIoZXhwcmVzc2lvbi5jb3VudCksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkU3RyaW5nKGV4cHJlc3Npb24udHlwZU5hbWUpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEluc3RhbmNlKGV4cHJlc3Npb24udGFyZ2V0TmFtZSksXHJcbiAgICAgICAgICAgICAgICBJbnN0cnVjdGlvbi5sb2FkRmllbGQoV29ybGRPYmplY3QuY29udGVudHMpLFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24uaW5zdGFuY2VDYWxsKExpc3QuY29udGFpbnMpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXhwcmVzc2lvbiBpbnN0YW5jZW9mIENvbmNhdGVuYXRpb25FeHByZXNzaW9uKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIFRPRE86IExvYWQgdGhlIGxlZnQtaGFuZCBzaWRlIHNvIGl0IGNhbiBiZSBjb25jYXRlbmF0ZWQgd2hlbiB0aGUgcmlnaHQgc2lkZSBldmFsdWF0ZXMuXHJcblxyXG4gICAgICAgICAgICBjb25zdCBsZWZ0ID0gdGhpcy50cmFuc2Zvcm1FeHByZXNzaW9uKGV4cHJlc3Npb24ubGVmdCEpO1xyXG4gICAgICAgICAgICBjb25zdCByaWdodCA9IHRoaXMudHJhbnNmb3JtRXhwcmVzc2lvbihleHByZXNzaW9uLnJpZ2h0ISk7XHJcblxyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaCguLi5sZWZ0KTtcclxuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goLi4ucmlnaHQpO1xyXG4gICAgICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChJbnN0cnVjdGlvbi5jb25jYXRlbmF0ZSgpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb24gaW5zdGFuY2VvZiBGaWVsZERlY2xhcmF0aW9uRXhwcmVzc2lvbil7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZEluc3RhbmNlKFwiPD5pdFwiKSxcclxuICAgICAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRGaWVsZChleHByZXNzaW9uLm5hbWUpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IENvbXBpbGF0aW9uRXJyb3IoXCJVbmFibGUgdG8gdHJhbnNmb3JtIHVuc3VwcG9ydGVkIGV4cHJlc3Npb25cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdHJ1Y3Rpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdHJhbnNmb3JtSW5pdGlhbFR5cGVEZWNsYXJhdGlvbihleHByZXNzaW9uOlR5cGVEZWNsYXJhdGlvbkV4cHJlc3Npb24pe1xyXG4gICAgICAgIHJldHVybiBuZXcgVHlwZShleHByZXNzaW9uLm5hbWUsIGV4cHJlc3Npb24uYmFzZVR5cGUhLm5hbWUpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRXh0ZXJuQ2FsbCB9IGZyb20gXCIuL0V4dGVybkNhbGxcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBbnl7ICAgICAgICBcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lOnN0cmluZyA9IFwiPD5hbnlcIjsgIFxyXG4gICAgXHJcbiAgICBzdGF0aWMgbWFpbiA9IFwiPD5tYWluXCI7XHJcbiAgICBzdGF0aWMgZXh0ZXJuVG9TdHJpbmcgPSBFeHRlcm5DYWxsLm9mKFwiPD50b1N0cmluZ1wiKTtcclxufVxyXG4iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCb29sZWFuVHlwZXtcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHN0YXRpYyB0eXBlTmFtZSA9IFwiPD5ib29sZWFuXCI7XHJcbn0iLCJleHBvcnQgY2xhc3MgRW50cnlQb2ludEF0dHJpYnV0ZXtcclxuICAgIG5hbWU6c3RyaW5nID0gXCI8PmVudHJ5UG9pbnRcIjtcclxufSIsImV4cG9ydCBjbGFzcyBFeHRlcm5DYWxse1xyXG4gICAgc3RhdGljIG9mKG5hbWU6c3RyaW5nLCAuLi5hcmdzOnN0cmluZ1tdKXtcclxuICAgICAgICByZXR1cm4gbmV3IEV4dGVybkNhbGwobmFtZSwgLi4uYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgYXJnczpzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6c3RyaW5nLCAuLi5hcmdzOnN0cmluZ1tdKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuL1dvcmxkT2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbXtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwiPD5pdGVtXCI7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgcGFyZW50VHlwZU5hbWUgPSBXb3JsZE9iamVjdC50eXBlTmFtZTtcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExpc3R7XHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgdHlwZU5hbWUgPSBcIjw+bGlzdFwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSBjb250YWlucyA9IFwiPD5jb250YWluc1wiO1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZVBhcmFtZXRlciA9IFwiPD50eXBlTmFtZVwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IGNvdW50UGFyYW1ldGVyID0gXCI8PmNvdW50XCI7XHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBOdW1iZXJUeXBle1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHR5cGVOYW1lID0gXCI8Pm51bWJlclwiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG59IiwiaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi9Xb3JsZE9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYWNlIHtcclxuICAgIHN0YXRpYyBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCI8PnBsYWNlXCI7XHJcblxyXG4gICAgc3RhdGljIGlzUGxheWVyU3RhcnQgPSBcIjw+aXNQbGF5ZXJTdGFydFwiO1xyXG59IiwiaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi9Xb3JsZE9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllcntcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwiPD5wbGF5ZXJcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnR5cGVOYW1lOyAgICBcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNheXtcclxuICAgIHN0YXRpYyByZWFkb25seSB0eXBlTmFtZSA9IFwiPD5zYXlcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxufSIsImltcG9ydCB7IEFueSB9IGZyb20gXCIuL0FueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0cmluZ1R5cGV7XHJcbiAgICBzdGF0aWMgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICBzdGF0aWMgdHlwZU5hbWUgPSBcIjw+c3RyaW5nXCI7XHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmRlcnN0YW5kaW5ne1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCI8PnVuZGVyc3RhbmRpbmdcIjtcclxuXHJcbiAgICBzdGF0aWMgZGVzY3JpYmluZyA9IFwiPD5kZXNjcmliaW5nXCI7ICBcclxuICAgIHN0YXRpYyBtb3ZpbmcgPSBcIjw+bW92aW5nXCI7XHJcbiAgICBzdGF0aWMgZGlyZWN0aW9uID0gXCI8PmRpcmVjdGlvblwiO1xyXG4gICAgc3RhdGljIHRha2luZyA9IFwiPD50YWtpbmdcIjtcclxuICAgIHN0YXRpYyBpbnZlbnRvcnkgPSBcIjw+aW52ZW50b3J5XCI7XHJcblxyXG4gICAgc3RhdGljIGFjdGlvbiA9IFwiPD5hY3Rpb25cIjtcclxuICAgIHN0YXRpYyBtZWFuaW5nID0gXCI8Pm1lYW5pbmdcIjsgIFxyXG59IiwiaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4vQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV29ybGRPYmplY3Qge1xyXG4gICAgc3RhdGljIHBhcmVudFR5cGVOYW1lID0gQW55LnR5cGVOYW1lO1xyXG4gICAgc3RhdGljIHR5cGVOYW1lID0gXCI8PndvcmxkT2JqZWN0XCI7XHJcblxyXG4gICAgc3RhdGljIGRlc2NyaXB0aW9uID0gXCI8PmRlc2NyaXB0aW9uXCI7XHJcbiAgICBzdGF0aWMgY29udGVudHMgPSBcIjw+Y29udGVudHNcIjsgICAgXHJcblxyXG4gICAgc3RhdGljIGRlc2NyaWJlID0gXCI8PmRlc2NyaWJlXCI7XHJcbn0iLCJpbXBvcnQgeyBUYWxvbklkZSB9IGZyb20gXCIuL1RhbG9uSWRlXCI7XHJcblxyXG5cclxudmFyIGlkZSA9IG5ldyBUYWxvbklkZSgpOyIsImV4cG9ydCBlbnVtIEV2YWx1YXRpb25SZXN1bHR7XHJcbiAgICBDb250aW51ZSxcclxuICAgIFN1c3BlbmRGb3JJbnB1dFxyXG59IiwiaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9NZXRob2RcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcbmltcG9ydCB7IFN0YWNrRnJhbWUgfSBmcm9tIFwiLi9TdGFja0ZyYW1lXCI7XHJcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSBcIi4uL2NvbW1vbi9JbnN0cnVjdGlvblwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWV0aG9kQWN0aXZhdGlvbntcclxuICAgIG1ldGhvZD86TWV0aG9kO1xyXG4gICAgc3RhY2tGcmFtZTpTdGFja0ZyYW1lO1xyXG4gICAgc3RhY2s6UnVudGltZUFueVtdID0gW107XHJcblxyXG4gICAgc3RhY2tTaXplKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2subGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHBvcCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YWNrLnBvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1c2gocnVudGltZUFueTpSdW50aW1lQW55KXtcclxuICAgICAgICB0aGlzLnN0YWNrLnB1c2gocnVudGltZUFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IobWV0aG9kOk1ldGhvZCl7XHJcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XHJcbiAgICAgICAgdGhpcy5zdGFja0ZyYW1lID0gbmV3IFN0YWNrRnJhbWUobWV0aG9kKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vY29tbW9uL09wQ29kZVwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBjb2RlOk9wQ29kZSA9IE9wQ29kZS5Ob09wO1xyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICByZXR1cm4gRXZhbHVhdGlvblJlc3VsdC5Db250aW51ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vY29tbW9uL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0YWNrRnJhbWV7XHJcbiAgICBsb2NhbHM6VmFyaWFibGVbXSA9IFtdO1xyXG4gICAgY3VycmVudEluc3RydWN0aW9uOm51bWJlciA9IC0xO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1ldGhvZDpNZXRob2Qpe1xyXG4gICAgICAgIGZvcih2YXIgcGFyYW1ldGVyIG9mIG1ldGhvZC5wYXJhbWV0ZXJzKXtcclxuICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSBuZXcgVmFyaWFibGUocGFyYW1ldGVyLm5hbWUsIHBhcmFtZXRlci50eXBlISk7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYWxzLnB1c2godmFyaWFibGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IEVudHJ5UG9pbnRBdHRyaWJ1dGUgfSBmcm9tIFwiLi4vbGlicmFyeS9FbnRyeVBvaW50QXR0cmlidXRlXCI7XHJcbmltcG9ydCB7IEFueSB9IGZyb20gXCIuLi9saWJyYXJ5L0FueVwiO1xyXG5pbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5pbXBvcnQgeyBPcENvZGUgfSBmcm9tIFwiLi4vY29tbW9uL09wQ29kZVwiO1xyXG5pbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBQcmludEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9QcmludEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuL0lPdXRwdXRcIjtcclxuaW1wb3J0IHsgTm9PcEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Ob09wSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkU3RyaW5nSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRTdHJpbmdIYW5kbGVyXCI7XHJcbmltcG9ydCB7IE5ld0luc3RhbmNlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL05ld0luc3RhbmNlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQ29tbWFuZCB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZUNvbW1hbmRcIjtcclxuaW1wb3J0IHsgTWVtb3J5IH0gZnJvbSBcIi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBSZWFkSW5wdXRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvUmVhZElucHV0SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBQYXJzZUNvbW1hbmRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvUGFyc2VDb21tYW5kSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBHb1RvSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0dvVG9IYW5kbGVyXCI7XHJcbmltcG9ydCB7IEhhbmRsZUNvbW1hbmRIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvSGFuZGxlQ29tbWFuZEhhbmRsZXJcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxhY2UgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVQbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQm9vbGVhbiB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZUJvb2xlYW5cIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUGxheWVyXCI7XHJcbmltcG9ydCB7IFNheSB9IGZyb20gXCIuLi9saWJyYXJ5L1NheVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRW1wdHkgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVFbXB0eVwiO1xyXG5pbXBvcnQgeyBSZXR1cm5IYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvUmV0dXJuSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBTdGF0aWNDYWxsSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL1N0YXRpY0NhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYXllciB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZVBsYXllclwiO1xyXG5pbXBvcnQgeyBMb2FkSW5zdGFuY2VIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvTG9hZEluc3RhbmNlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBMb2FkTnVtYmVySGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWROdW1iZXJIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEluc3RhbmNlQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9JbnN0YW5jZUNhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRQcm9wZXJ0eUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkUHJvcGVydHlIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRGaWVsZEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkRmllbGRIYW5kbGVyXCI7XHJcbmltcG9ydCB7IEV4dGVybmFsQ2FsbEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9FeHRlcm5hbENhbGxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IExvYWRMb2NhbEhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9Mb2FkTG9jYWxIYW5kbGVyXCI7XHJcbmltcG9ydCB7IElMb2dPdXRwdXQgfSBmcm9tIFwiLi9JTG9nT3V0cHV0XCI7XHJcbmltcG9ydCB7IExvYWRUaGlzSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0xvYWRUaGlzSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBCcmFuY2hSZWxhdGl2ZUhhbmRsZXIgfSBmcm9tIFwiLi9oYW5kbGVycy9CcmFuY2hSZWxhdGl2ZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgQnJhbmNoUmVsYXRpdmVJZkZhbHNlSGFuZGxlciB9IGZyb20gXCIuL2hhbmRsZXJzL0JyYW5jaFJlbGF0aXZlSWZGYWxzZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgQ29uY2F0ZW5hdGVIYW5kbGVyIH0gZnJvbSBcIi4vaGFuZGxlcnMvQ29uY2F0ZW5hdGVIYW5kbGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVGFsb25SdW50aW1le1xyXG5cclxuICAgIHByaXZhdGUgdGhyZWFkPzpUaHJlYWQ7XHJcbiAgICBwcml2YXRlIGhhbmRsZXJzOk1hcDxPcENvZGUsIE9wQ29kZUhhbmRsZXI+ID0gbmV3IE1hcDxPcENvZGUsIE9wQ29kZUhhbmRsZXI+KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB1c2VyT3V0cHV0OklPdXRwdXQsIHByaXZhdGUgcmVhZG9ubHkgbG9nT3V0cHV0PzpJTG9nT3V0cHV0KXtcclxuICAgICAgICB0aGlzLnVzZXJPdXRwdXQgPSB1c2VyT3V0cHV0O1xyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTm9PcCwgbmV3IE5vT3BIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkU3RyaW5nLCBuZXcgTG9hZFN0cmluZ0hhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLlByaW50LCBuZXcgUHJpbnRIYW5kbGVyKHRoaXMudXNlck91dHB1dCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5OZXdJbnN0YW5jZSwgbmV3IE5ld0luc3RhbmNlSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuUmVhZElucHV0LCBuZXcgUmVhZElucHV0SGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuUGFyc2VDb21tYW5kLCBuZXcgUGFyc2VDb21tYW5kSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuSGFuZGxlQ29tbWFuZCwgbmV3IEhhbmRsZUNvbW1hbmRIYW5kbGVyKHRoaXMudXNlck91dHB1dCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Hb1RvLCBuZXcgR29Ub0hhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLlJldHVybiwgbmV3IFJldHVybkhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLlN0YXRpY0NhbGwsIG5ldyBTdGF0aWNDYWxsSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTG9hZEluc3RhbmNlLCBuZXcgTG9hZEluc3RhbmNlSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuTG9hZE51bWJlciwgbmV3IExvYWROdW1iZXJIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5JbnN0YW5jZUNhbGwsIG5ldyBJbnN0YW5jZUNhbGxIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkUHJvcGVydHksIG5ldyBMb2FkUHJvcGVydHlIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkRmllbGQsIG5ldyBMb2FkRmllbGRIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5FeHRlcm5hbENhbGwsIG5ldyBFeHRlcm5hbENhbGxIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkTG9jYWwsIG5ldyBMb2FkTG9jYWxIYW5kbGVyKCkpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KE9wQ29kZS5Mb2FkVGhpcywgbmV3IExvYWRUaGlzSGFuZGxlcigpKTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzLnNldChPcENvZGUuQnJhbmNoUmVsYXRpdmUsIG5ldyBCcmFuY2hSZWxhdGl2ZUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkJyYW5jaFJlbGF0aXZlSWZGYWxzZSwgbmV3IEJyYW5jaFJlbGF0aXZlSWZGYWxzZUhhbmRsZXIoKSk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVycy5zZXQoT3BDb2RlLkNvbmNhdGVuYXRlLCBuZXcgQ29uY2F0ZW5hdGVIYW5kbGVyKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCl7XHJcbiAgICAgICAgY29uc3QgcGxhY2VzID0gdGhpcy50aHJlYWQ/LmFsbFR5cGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LmJhc2VUeXBlTmFtZSA9PSBQbGFjZS50eXBlTmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCh4ID0+IDxSdW50aW1lUGxheWVyPk1lbW9yeS5hbGxvY2F0ZSh4KSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGdldFBsYXllclN0YXJ0ID0gKHBsYWNlOlJ1bnRpbWVQbGFjZSkgPT4gPFJ1bnRpbWVCb29sZWFuPihwbGFjZS5maWVsZHMuZ2V0KFBsYWNlLmlzUGxheWVyU3RhcnQpPy52YWx1ZSk7XHJcbiAgICAgICAgY29uc3QgaXNQbGF5ZXJTdGFydCA9IChwbGFjZTpSdW50aW1lUGxhY2UpID0+IGdldFBsYXllclN0YXJ0KHBsYWNlKT8udmFsdWUgPT09IHRydWU7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRQbGFjZSA9IHBsYWNlcz8uZmluZChpc1BsYXllclN0YXJ0KTtcclxuXHJcbiAgICAgICAgdGhpcy50aHJlYWQhLmN1cnJlbnRQbGFjZSA9IGN1cnJlbnRQbGFjZTtcclxuXHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy50aHJlYWQ/Lmtub3duVHlwZXMuZ2V0KFBsYXllci50eXBlTmFtZSkhO1xyXG5cclxuICAgICAgICB0aGlzLnRocmVhZCEuY3VycmVudFBsYXllciA9IDxSdW50aW1lUGxheWVyPk1lbW9yeS5hbGxvY2F0ZShwbGF5ZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnJ1bldpdGgoXCJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcCgpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBsb2FkRnJvbSh0eXBlczpUeXBlW10pe1xyXG4gICAgICAgIGNvbnN0IGxvYWRlZFR5cGVzID0gTWVtb3J5LmxvYWRUeXBlcyh0eXBlcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGVudHJ5UG9pbnQgPSBsb2FkZWRUeXBlcy5maW5kKHggPT4geC5hdHRyaWJ1dGVzLmZpbmRJbmRleChhdHRyaWJ1dGUgPT4gYXR0cmlidXRlIGluc3RhbmNlb2YgRW50cnlQb2ludEF0dHJpYnV0ZSkgPiAtMSk7XHJcbiAgICAgICAgY29uc3QgbWFpbk1ldGhvZCA9IGVudHJ5UG9pbnQ/Lm1ldGhvZHMuZmluZCh4ID0+IHgubmFtZSA9PSBBbnkubWFpbik7ICAgICAgICBcclxuICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gbmV3IE1ldGhvZEFjdGl2YXRpb24obWFpbk1ldGhvZCEpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudGhyZWFkID0gbmV3IFRocmVhZChsb2FkZWRUeXBlcywgYWN0aXZhdGlvbik7ICBcclxuICAgICAgICB0aGlzLnRocmVhZC5sb2cgPSB0aGlzLmxvZ091dHB1dDsgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBzZW5kQ29tbWFuZChpbnB1dDpzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMucnVuV2l0aChpbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBydW5XaXRoKGNvbW1hbmQ6c3RyaW5nKXtcclxuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IHRoaXMudGhyZWFkIS5jdXJyZW50SW5zdHJ1Y3Rpb247XHJcblxyXG4gICAgICAgIGlmIChpbnN0cnVjdGlvbj8ub3BDb2RlID09IE9wQ29kZS5SZWFkSW5wdXQpe1xyXG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gTWVtb3J5LmFsbG9jYXRlU3RyaW5nKGNvbW1hbmQpO1xyXG4gICAgICAgICAgICB0aGlzLnRocmVhZD8uY3VycmVudE1ldGhvZC5wdXNoKHRleHQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50aHJlYWQ/Lm1vdmVOZXh0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50aHJlYWQ/LmN1cnJlbnRJbnN0cnVjdGlvbiA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aGlzLnRocmVhZD8ubW92ZU5leHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRocmVhZD8uY3VycmVudEluc3RydWN0aW9uID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbmFibGUgdG8gZXhlY3V0ZSBjb21tYW5kLCBubyBpbnN0cnVjdGlvbiBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcihsZXQgaW5zdHJ1Y3Rpb24gPSB0aGlzLmV2YWx1YXRlQ3VycmVudEluc3RydWN0aW9uKCk7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9uID09IEV2YWx1YXRpb25SZXN1bHQuQ29udGludWU7XHJcbiAgICAgICAgICAgIGluc3RydWN0aW9uID0gdGhpcy5ldmFsdWF0ZUN1cnJlbnRJbnN0cnVjdGlvbigpKXtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGhyZWFkPy5tb3ZlTmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGV2YWx1YXRlQ3VycmVudEluc3RydWN0aW9uKCl7XHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSB0aGlzLnRocmVhZD8uY3VycmVudEluc3RydWN0aW9uO1xyXG5cclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5oYW5kbGVycy5nZXQoaW5zdHJ1Y3Rpb24/Lm9wQ29kZSEpO1xyXG5cclxuICAgICAgICBpZiAoaGFuZGxlciA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBFbmNvdW50ZXJlZCB1bnN1cHBvcnRlZCBPcENvZGUgJHtpbnN0cnVjdGlvbj8ub3BDb2RlfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gaGFuZGxlcj8uaGFuZGxlKHRoaXMudGhyZWFkISk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBNZXRob2RBY3RpdmF0aW9uIH0gZnJvbSBcIi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9VbmRlcnN0YW5kaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGFjZSB9IGZyb20gXCIuL2xpYnJhcnkvUnVudGltZVBsYWNlXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGF5ZXIgfSBmcm9tIFwiLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZUVtcHR5IH0gZnJvbSBcIi4vbGlicmFyeS9SdW50aW1lRW1wdHlcIjtcclxuaW1wb3J0IHsgSUxvZ091dHB1dCB9IGZyb20gXCIuL0lMb2dPdXRwdXRcIjtcclxuaW1wb3J0IHsgTWV0aG9kIH0gZnJvbSBcIi4uL2NvbW1vbi9NZXRob2RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUaHJlYWR7XHJcbiAgICBhbGxUeXBlczpUeXBlW10gPSBbXTtcclxuICAgIGtub3duVHlwZXM6TWFwPHN0cmluZywgVHlwZT4gPSBuZXcgTWFwPHN0cmluZywgVHlwZT4oKTtcclxuICAgIGtub3duVW5kZXJzdGFuZGluZ3M6VHlwZVtdID0gW107XHJcbiAgICBrbm93blBsYWNlczpSdW50aW1lUGxhY2VbXSA9IFtdO1xyXG4gICAgbWV0aG9kczpNZXRob2RBY3RpdmF0aW9uW10gPSBbXTtcclxuICAgIGN1cnJlbnRQbGFjZT86UnVudGltZVBsYWNlO1xyXG4gICAgY3VycmVudFBsYXllcj86UnVudGltZVBsYXllcjtcclxuICAgIGxvZz86SUxvZ091dHB1dDtcclxuICAgIFxyXG4gICAgZ2V0IGN1cnJlbnRNZXRob2QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWV0aG9kc1t0aGlzLm1ldGhvZHMubGVuZ3RoIC0gMV07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnJlbnRJbnN0cnVjdGlvbigpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmF0aW9uID0gdGhpcy5jdXJyZW50TWV0aG9kO1xyXG4gICAgICAgIHJldHVybiBhY3RpdmF0aW9uLm1ldGhvZD8uYm9keVthY3RpdmF0aW9uLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uXTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0eXBlczpUeXBlW10sIG1ldGhvZDpNZXRob2RBY3RpdmF0aW9uKXtcclxuICAgICAgICB0aGlzLmFsbFR5cGVzID0gdHlwZXM7XHJcbiAgICAgICAgdGhpcy5rbm93blR5cGVzID0gbmV3IE1hcDxzdHJpbmcsIFR5cGU+KHR5cGVzLm1hcCh0eXBlID0+IFt0eXBlLm5hbWUsIHR5cGVdKSk7XHJcbiAgICAgICAgdGhpcy5rbm93blVuZGVyc3RhbmRpbmdzID0gdHlwZXMuZmlsdGVyKHggPT4geC5iYXNlVHlwZU5hbWUgPT09IFVuZGVyc3RhbmRpbmcudHlwZU5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubWV0aG9kcy5wdXNoKG1ldGhvZCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aXZhdGVNZXRob2QobWV0aG9kOk1ldGhvZCl7XHJcbiAgICAgICAgY29uc3QgYWN0aXZhdGlvbiA9IG5ldyBNZXRob2RBY3RpdmF0aW9uKG1ldGhvZCk7XHJcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMuY3VycmVudE1ldGhvZDtcclxuXHJcbiAgICAgICAgdGhpcy5sb2c/LmRlYnVnKGAke2N1cnJlbnQubWV0aG9kPy5uYW1lfSA9PT4gJHttZXRob2QubmFtZX1gKTtcclxuXHJcbiAgICAgICAgdGhpcy5tZXRob2RzLnB1c2goYWN0aXZhdGlvbik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdmVOZXh0KCl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uKys7XHJcbiAgICB9XHJcblxyXG4gICAganVtcFRvTGluZShsaW5lTnVtYmVyOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uID0gbGluZU51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm5Gcm9tQ3VycmVudE1ldGhvZCgpe1xyXG4gICAgICAgIGNvbnN0IGV4cGVjdFJldHVyblR5cGUgPSB0aGlzLmN1cnJlbnRNZXRob2QubWV0aG9kIS5yZXR1cm5UeXBlICE9IFwiXCI7XHJcbiAgICAgICAgY29uc3QgcmV0dXJuZWRNZXRob2QgPSB0aGlzLm1ldGhvZHMucG9wKCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9nPy5kZWJ1ZyhgJHt0aGlzLmN1cnJlbnRNZXRob2QubWV0aG9kPy5uYW1lfSA8PT0gJHtyZXR1cm5lZE1ldGhvZD8ubWV0aG9kPy5uYW1lfWApO1xyXG5cclxuICAgICAgICBpZiAoIWV4cGVjdFJldHVyblR5cGUpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVFbXB0eSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSByZXR1cm5lZE1ldGhvZD8uc3RhY2sucG9wKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlITtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUGxhY2UgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGFjZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lUGxhY2UgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lUGxhY2VcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi4vbGlicmFyeS9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBGaWVsZCB9IGZyb20gXCIuLi8uLi9jb21tb24vRmllbGRcIjtcclxuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1N0cmluZ1R5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVtcHR5IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUVtcHR5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVDb21tYW5kIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUNvbW1hbmRcIjtcclxuaW1wb3J0IHsgQm9vbGVhblR5cGUgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Cb29sZWFuVHlwZVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQm9vbGVhbiB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVCb29sZWFuXCI7XHJcbmltcG9ydCB7IExpc3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9MaXN0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVMaXN0IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUxpc3RcIjtcclxuaW1wb3J0IHsgSXRlbSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0l0ZW1cIjtcclxuaW1wb3J0IHsgUnVudGltZUl0ZW0gfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSXRlbVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYXllciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVQbGF5ZXJcIjtcclxuaW1wb3J0IHsgU2F5IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU2F5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTYXkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU2F5XCI7XHJcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gXCIuLi8uLi9jb21tb24vTWV0aG9kXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVJbnRlZ2VyIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUludGVnZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZW1vcnl7XHJcbiAgICBwcml2YXRlIHN0YXRpYyB0eXBlc0J5TmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBUeXBlPigpO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGVhcCA9IG5ldyBNYXA8c3RyaW5nLCBSdW50aW1lQW55W10+KCk7XHJcblxyXG4gICAgc3RhdGljIGZpbmRJbnN0YW5jZUJ5TmFtZShuYW1lOnN0cmluZyl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2VzID0gTWVtb3J5LmhlYXAuZ2V0KG5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoIWluc3RhbmNlcyB8fCBpbnN0YW5jZXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiT2JqZWN0IG5vdCBmb3VuZFwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbnN0YW5jZXMubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJMb2NhdGVkIG1vcmUgdGhhbiBvbmUgaW5zdGFuY2VcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2VzWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBsb2FkVHlwZXModHlwZXM6VHlwZVtdKXtcclxuICAgICAgICBNZW1vcnkudHlwZXNCeU5hbWUgPSBuZXcgTWFwPHN0cmluZywgVHlwZT4odHlwZXMubWFwKHggPT4gW3gubmFtZSwgeF0pKTsgICBcclxuICAgICAgICBcclxuICAgICAgICAvLyBPdmVycmlkZSBhbnkgcHJvdmlkZWQgdHlwZSBzdHVicyB3aXRoIHRoZSBhY3R1YWwgcnVudGltZSB0eXBlIGRlZmluaXRpb25zLlxyXG5cclxuICAgICAgICBjb25zdCBwbGFjZSA9IFJ1bnRpbWVQbGFjZS50eXBlO1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBSdW50aW1lSXRlbS50eXBlO1xyXG4gICAgICAgIGNvbnN0IHBsYXllciA9IFJ1bnRpbWVQbGF5ZXIudHlwZTtcclxuXHJcbiAgICAgICAgTWVtb3J5LnR5cGVzQnlOYW1lLnNldChwbGFjZS5uYW1lLCBwbGFjZSk7XHJcbiAgICAgICAgTWVtb3J5LnR5cGVzQnlOYW1lLnNldChpdGVtLm5hbWUsIGl0ZW0pO1xyXG4gICAgICAgIE1lbW9yeS50eXBlc0J5TmFtZS5zZXQocGxheWVyLm5hbWUsIHBsYXllcik7ICBcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShNZW1vcnkudHlwZXNCeU5hbWUudmFsdWVzKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZUNvbW1hbmQoKTpSdW50aW1lQ29tbWFuZHtcclxuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVDb21tYW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG9jYXRlQm9vbGVhbih2YWx1ZTpib29sZWFuKTpSdW50aW1lQm9vbGVhbntcclxuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVCb29sZWFuKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGVOdW1iZXIodmFsdWU6bnVtYmVyKTpSdW50aW1lSW50ZWdlcntcclxuICAgICAgICByZXR1cm4gbmV3IFJ1bnRpbWVJbnRlZ2VyKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYWxsb2NhdGVTdHJpbmcodGV4dDpzdHJpbmcpOlJ1bnRpbWVTdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lU3RyaW5nKHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhbGxvY2F0ZSh0eXBlOlR5cGUpOlJ1bnRpbWVBbnl7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBNZW1vcnkuY29uc3RydWN0SW5zdGFuY2VGcm9tKHR5cGUpO1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZVBvb2wgPSBNZW1vcnkuaGVhcC5nZXQodHlwZS5uYW1lKSB8fCBbXTtcclxuXHJcbiAgICAgICAgaW5zdGFuY2VQb29sLnB1c2goaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICBNZW1vcnkuaGVhcC5zZXQodHlwZS5uYW1lLCBpbnN0YW5jZVBvb2wpO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5pdGlhbGl6ZVZhcmlhYmxlV2l0aChmaWVsZDpGaWVsZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhcmlhYmxlID0gTWVtb3J5LmNvbnN0cnVjdFZhcmlhYmxlRnJvbShmaWVsZCk7ICAgICAgICBcclxuICAgICAgICB2YXJpYWJsZS52YWx1ZSA9IE1lbW9yeS5pbnN0YW50aWF0ZURlZmF1bHRWYWx1ZUZvcih2YXJpYWJsZSwgZmllbGQuZGVmYXVsdFZhbHVlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZhcmlhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNvbnN0cnVjdFZhcmlhYmxlRnJvbShmaWVsZDpGaWVsZCl7XHJcbiAgICAgICAgaWYgKGZpZWxkLnR5cGUpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhcmlhYmxlKGZpZWxkLm5hbWUsIGZpZWxkLnR5cGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHlwZSA9IE1lbW9yeS50eXBlc0J5TmFtZS5nZXQoZmllbGQudHlwZU5hbWUpO1xyXG5cclxuICAgICAgICBpZiAoIXR5cGUpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKGBVbmFibGUgdG8gY29uc3RydWN0IHVua25vd24gdHlwZSAnJHtmaWVsZC50eXBlTmFtZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFZhcmlhYmxlKGZpZWxkLm5hbWUsIHR5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbnRpYXRlRGVmYXVsdFZhbHVlRm9yKHZhcmlhYmxlOlZhcmlhYmxlLCBkZWZhdWx0VmFsdWU6T2JqZWN0fHVuZGVmaW5lZCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3dpdGNoKHZhcmlhYmxlLnR5cGUhLm5hbWUpe1xyXG4gICAgICAgICAgICBjYXNlIFN0cmluZ1R5cGUudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVN0cmluZyhkZWZhdWx0VmFsdWUgPyA8c3RyaW5nPmRlZmF1bHRWYWx1ZSA6IFwiXCIpO1xyXG4gICAgICAgICAgICBjYXNlIEJvb2xlYW5UeXBlLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVCb29sZWFuKGRlZmF1bHRWYWx1ZSA/IDxib29sZWFuPmRlZmF1bHRWYWx1ZSA6IGZhbHNlKTtcclxuICAgICAgICAgICAgY2FzZSBMaXN0LnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVMaXN0KGRlZmF1bHRWYWx1ZSA/IHRoaXMuaW5zdGFudGlhdGVMaXN0KDxPYmplY3RbXT5kZWZhdWx0VmFsdWUpIDogW10pO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSdW50aW1lRW1wdHkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFudGlhdGVMaXN0KGl0ZW1zOk9iamVjdFtdKXtcclxuICAgICAgICBjb25zdCBydW50aW1lSXRlbXM6UnVudGltZUFueVtdID0gW107XHJcblxyXG4gICAgICAgIGZvcihjb25zdCBpdGVtIG9mIGl0ZW1zKXtcclxuICAgICAgICAgICAgY29uc3QgaXRlbUxpc3QgPSA8T2JqZWN0W10+aXRlbTtcclxuICAgICAgICAgICAgY29uc3QgY291bnQgPSA8bnVtYmVyPml0ZW1MaXN0WzBdO1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlTmFtZSA9IDxzdHJpbmc+aXRlbUxpc3RbMV07XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gTWVtb3J5LnR5cGVzQnlOYW1lLmdldCh0eXBlTmFtZSkhO1xyXG5cclxuICAgICAgICAgICAgZm9yKGxldCBjdXJyZW50ID0gMDsgY3VycmVudCA8IGNvdW50OyBjdXJyZW50KyspeyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gTWVtb3J5LmFsbG9jYXRlKHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgcnVudGltZUl0ZW1zLnB1c2goaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcnVudGltZUl0ZW1zO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNvbnN0cnVjdEluc3RhbmNlRnJvbSh0eXBlOlR5cGUpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzZWVuVHlwZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcclxuICAgICAgICBsZXQgaW5oZXJpdGFuY2VDaGFpbjpUeXBlW10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBjdXJyZW50OlR5cGV8dW5kZWZpbmVkID0gdHlwZTsgXHJcbiAgICAgICAgICAgIGN1cnJlbnQ7IFxyXG4gICAgICAgICAgICBjdXJyZW50ID0gTWVtb3J5LnR5cGVzQnlOYW1lLmdldChjdXJyZW50LmJhc2VUeXBlTmFtZSkpe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAoc2VlblR5cGVzLmhhcyhjdXJyZW50Lm5hbWUpKXtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiWW91IGNhbid0IGhhdmUgY3ljbGVzIGluIGEgdHlwZSBoaWVyYXJjaHlcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2VlblR5cGVzLmFkZChjdXJyZW50Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaW5oZXJpdGFuY2VDaGFpbi5wdXNoKGN1cnJlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZmlyc3RTeXN0ZW1UeXBlQW5jZXN0b3JJbmRleCA9IGluaGVyaXRhbmNlQ2hhaW4uZmluZEluZGV4KHggPT4geC5pc1N5c3RlbVR5cGUpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgaWYgKGZpcnN0U3lzdGVtVHlwZUFuY2VzdG9ySW5kZXggPCAwKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlR5cGUgbXVzdCB1bHRpbWF0ZWx5IGluaGVyaXQgZnJvbSBhIHN5c3RlbSB0eXBlXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmFsbG9jYXRlU3lzdGVtVHlwZUJ5TmFtZShpbmhlcml0YW5jZUNoYWluW2ZpcnN0U3lzdGVtVHlwZUFuY2VzdG9ySW5kZXhdLm5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGluc3RhbmNlLnBhcmVudFR5cGVOYW1lID0gaW5zdGFuY2UudHlwZU5hbWU7XHJcbiAgICAgICAgaW5zdGFuY2UudHlwZU5hbWUgPSBpbmhlcml0YW5jZUNoYWluWzBdLm5hbWU7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IEluaGVyaXQgbW9yZSB0aGFuIGp1c3QgZmllbGRzL21ldGhvZHMuXHJcbiAgICAgICAgLy8gVE9ETzogVHlwZSBjaGVjayBmaWVsZCBpbmhlcml0YW5jZSBmb3Igc2hhZG93aW5nL292ZXJyaWRpbmcuXHJcblxyXG4gICAgICAgIC8vIEluaGVyaXQgZmllbGRzL21ldGhvZHMgZnJvbSB0eXBlcyBpbiB0aGUgaGllcmFyY2h5IGZyb20gbGVhc3QgdG8gbW9zdCBkZXJpdmVkLlxyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgaSA9IGZpcnN0U3lzdGVtVHlwZUFuY2VzdG9ySW5kZXg7IGkgPj0gMDsgaS0tKXtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFR5cGUgPSBpbmhlcml0YW5jZUNoYWluW2ldO1xyXG5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IGZpZWxkIG9mIGN1cnJlbnRUeXBlLmZpZWxkcyl7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YXJpYWJsZSA9IHRoaXMuaW5pdGlhbGl6ZVZhcmlhYmxlV2l0aChmaWVsZCk7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5maWVsZHMuc2V0KGZpZWxkLm5hbWUsIHZhcmlhYmxlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IG1ldGhvZCBvZiBjdXJyZW50VHlwZS5tZXRob2RzKXtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLm1ldGhvZHMuc2V0KG1ldGhvZC5uYW1lLCBtZXRob2QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhbGxvY2F0ZVN5c3RlbVR5cGVCeU5hbWUodHlwZU5hbWU6c3RyaW5nKXtcclxuICAgICAgICBzd2l0Y2godHlwZU5hbWUpe1xyXG4gICAgICAgICAgICBjYXNlIFBsYWNlLnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVQbGFjZSgpO1xyXG4gICAgICAgICAgICBjYXNlIEl0ZW0udHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZUl0ZW0oKTtcclxuICAgICAgICAgICAgY2FzZSBQbGF5ZXIudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZVBsYXllcigpO1xyXG4gICAgICAgICAgICBjYXNlIExpc3QudHlwZU5hbWU6IHJldHVybiBuZXcgUnVudGltZUxpc3QoW10pOyAgICAgXHJcbiAgICAgICAgICAgIGNhc2UgU2F5LnR5cGVOYW1lOiByZXR1cm4gbmV3IFJ1bnRpbWVTYXkoKTsgICAgICAgXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6e1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihgVW5hYmxlIHRvIGluc3RhbnRpYXRlIHR5cGUgJyR7dHlwZU5hbWV9J2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFJ1bnRpbWVFcnJvcntcclxuICAgIG1lc3NhZ2U6c3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6c3RyaW5nKXtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCcmFuY2hSZWxhdGl2ZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aXZlQW1vdW50ID0gPG51bWJlcj50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmp1bXBUb0xpbmUodGhyZWFkLmN1cnJlbnRNZXRob2Quc3RhY2tGcmFtZS5jdXJyZW50SW5zdHJ1Y3Rpb24gKyByZWxhdGl2ZUFtb3VudCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUJvb2xlYW4gfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQm9vbGVhblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJyYW5jaFJlbGF0aXZlSWZGYWxzZUhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHJlbGF0aXZlQW1vdW50ID0gPG51bWJlcj50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IDxSdW50aW1lQm9vbGVhbj50aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgaWYgKCF2YWx1ZS52YWx1ZSl7XHJcbiAgICAgICAgICAgIHRocmVhZC5qdW1wVG9MaW5lKHRocmVhZC5jdXJyZW50TWV0aG9kLnN0YWNrRnJhbWUuY3VycmVudEluc3RydWN0aW9uICsgcmVsYXRpdmVBbW91bnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmNhdGVuYXRlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgbGFzdCA9IDxSdW50aW1lU3RyaW5nPnRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IGZpcnN0ID0gPFJ1bnRpbWVTdHJpbmc+dGhyZWFkLmN1cnJlbnRNZXRob2QucG9wKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmNhdGVuYXRlZCA9IE1lbW9yeS5hbGxvY2F0ZVN0cmluZyhmaXJzdC52YWx1ZSArIFwiIFwiICsgbGFzdC52YWx1ZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goY29uY2F0ZW5hdGVkKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuXHJcbmludGVyZmFjZSBJSW5kZXhhYmxle1xyXG4gICAgW25hbWU6c3RyaW5nXTooLi4uYXJnczpSdW50aW1lQW55W10pPT5SdW50aW1lQW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRXh0ZXJuYWxDYWxsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IDxzdHJpbmc+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMubG9jYXRlRnVuY3Rpb24oaW5zdGFuY2UhLCA8c3RyaW5nPm1ldGhvZE5hbWUpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgY2FsbC5leHRlcm5cXHQke2luc3RhbmNlPy50eXBlTmFtZX06OiR7bWV0aG9kTmFtZX0oLi4uJHttZXRob2QubGVuZ3RofSlgKTtcclxuXHJcbiAgICAgICAgY29uc3QgYXJnczpSdW50aW1lQW55W10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1ldGhvZC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGFyZ3MucHVzaCh0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKSEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gbWV0aG9kLmNhbGwoaW5zdGFuY2UsIC4uLmFyZ3MpO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHJlc3VsdCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvY2F0ZUZ1bmN0aW9uKGluc3RhbmNlOk9iamVjdCwgbWV0aG9kTmFtZTpzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiAoPElJbmRleGFibGU+aW5zdGFuY2UpW21ldGhvZE5hbWVdO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdvVG9IYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25OdW1iZXIgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBpbnN0cnVjdGlvbk51bWJlciA9PT0gXCJudW1iZXJcIil7XHJcbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdG8ganVtcCBvbmUgcHJldmlvdXMgdG8gdGhlIGRlc2lyZWQgaW5zdHJ1Y3Rpb24gYmVjYXVzZSBhZnRlciBcclxuICAgICAgICAgICAgLy8gZXZhbHVhdGluZyB0aGlzIGdvdG8gd2UnbGwgbW92ZSBmb3J3YXJkICh3aGljaCB3aWxsIG1vdmUgdG8gdGhlIGRlc2lyZWQgb25lKS5cclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5qdW1wVG9MaW5lKGluc3RydWN0aW9uTnVtYmVyIC0gMSk7XHJcbiAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGdvdG9cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lQ29tbWFuZCB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVDb21tYW5kXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcbmltcG9ydCB7IFVuZGVyc3RhbmRpbmcgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9VbmRlcnN0YW5kaW5nXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVVbmRlcnN0YW5kaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVVuZGVyc3RhbmRpbmdcIjtcclxuaW1wb3J0IHsgTWVhbmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L01lYW5pbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZVdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVdvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgSU91dHB1dCB9IGZyb20gXCIuLi9JT3V0cHV0XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lU3RyaW5nXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVMaXN0IH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZUxpc3RcIjtcclxuaW1wb3J0IHsgUnVudGltZVBsYWNlIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVBsYWNlXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvUGxheWVyXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVQbGF5ZXIgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lUGxheWVyXCI7XHJcbmltcG9ydCB7IExvYWRQcm9wZXJ0eUhhbmRsZXIgfSBmcm9tIFwiLi9Mb2FkUHJvcGVydHlIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFByaW50SGFuZGxlciB9IGZyb20gXCIuL1ByaW50SGFuZGxlclwiO1xyXG5pbXBvcnQgeyBJbnN0YW5jZUNhbGxIYW5kbGVyIH0gZnJvbSBcIi4vSW5zdGFuY2VDYWxsSGFuZGxlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhhbmRsZUNvbW1hbmRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgb3V0cHV0OklPdXRwdXQpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbW1hbmQgaW5zdGFuY2VvZiBSdW50aW1lQ29tbWFuZCl7XHJcbiAgICAgICAgICAgIGNvbnN0IGFjdGlvbiA9IGNvbW1hbmQuYWN0aW9uIS52YWx1ZTtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0TmFtZSA9IGNvbW1hbmQudGFyZ2V0TmFtZSEudmFsdWU7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB1bmRlcnN0YW5kaW5ncyA9IHRocmVhZC5rbm93blVuZGVyc3RhbmRpbmdzO1xyXG5cclxuICAgICAgICAgICAgZm9yKGNvbnN0IHR5cGUgb2YgdW5kZXJzdGFuZGluZ3Mpe1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aW9uRmllbGQgPSB0eXBlLmZpZWxkcy5maW5kKHggPT4geC5uYW1lID09IFVuZGVyc3RhbmRpbmcuYWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1lYW5pbmdGaWVsZCA9IHR5cGUuZmllbGRzLmZpbmQoeCA9PiB4Lm5hbWUgPT0gVW5kZXJzdGFuZGluZy5tZWFuaW5nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09IGFjdGlvbkZpZWxkPy5kZWZhdWx0VmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lYW5pbmcgPSB0aGlzLmRldGVybWluZU1lYW5pbmdGb3IoPHN0cmluZz5tZWFuaW5nRmllbGQ/LmRlZmF1bHRWYWx1ZSEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYWN0dWFsVGFyZ2V0TmFtZSA9IHRoaXMuaW5mZXJUYXJnZXRGcm9tKHRocmVhZCwgdGFyZ2V0TmFtZSwgbWVhbmluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhY3R1YWxUYXJnZXROYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vdXRwdXQud3JpdGUoXCJJIGRvbid0IGtub3cgaG93IHRvIGRvIHRoYXQuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRocmVhZC5rbm93blR5cGVzLmdldChhY3R1YWxUYXJnZXROYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0YXJnZXQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGxvY2F0ZSB0eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmxvY2F0ZVRhcmdldEluc3RhbmNlKHRocmVhZCwgdGFyZ2V0LCBtZWFuaW5nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBSdW50aW1lV29ybGRPYmplY3QpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBsb2NhdGUgd29ybGQgdHlwZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaChtZWFuaW5nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBNZWFuaW5nLkRlc2NyaWJpbmc6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZSh0aHJlYWQsIGluc3RhbmNlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgTWVhbmluZy5Nb3Zpbmc6IHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRQbGFjZSA9IDxSdW50aW1lUGxhY2U+aW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaWJlKHRocmVhZCwgaW5zdGFuY2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBNZWFuaW5nLlRha2luZzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IHRocmVhZC5jdXJyZW50UGxhY2UhLmdldEZpZWxkQXNMaXN0KFdvcmxkT2JqZWN0LmNvbnRlbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QuaXRlbXMgPSBsaXN0Lml0ZW1zLmZpbHRlcih4ID0+IHgudHlwZU5hbWUgIT0gdGFyZ2V0Lm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnZlbnRvcnkgPSB0aHJlYWQuY3VycmVudFBsYXllciEuZ2V0RmllbGRBc0xpc3QoV29ybGRPYmplY3QuY29udGVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52ZW50b3J5Lml0ZW1zLnB1c2goaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpYmUodGhyZWFkLCB0aHJlYWQuY3VycmVudFBsYWNlISwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIE1lYW5pbmcuSW52ZW50b3J5OntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGludmVudG9yeSA9ICg8UnVudGltZVBsYXllcj5pbnN0YW5jZSkuZ2V0RmllbGRBc0xpc3QoV29ybGRPYmplY3QuY29udGVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmliZUNvbnRlbnRzKHRocmVhZCwgaW52ZW50b3J5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXCJVbnN1cHBvcnRlZCBtZWFuaW5nIGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBleGVjdXRlIGNvbW1hbmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb2NhdGVUYXJnZXRJbnN0YW5jZSh0aHJlYWQ6VGhyZWFkLCB0YXJnZXQ6VHlwZSwgbWVhbmluZzpNZWFuaW5nKTpSdW50aW1lQW55fHVuZGVmaW5lZHtcclxuICAgICAgICBpZiAobWVhbmluZyA9PT0gTWVhbmluZy5UYWtpbmcpe1xyXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gPFJ1bnRpbWVMaXN0PnRocmVhZC5jdXJyZW50UGxhY2UhLmZpZWxkcy5nZXQoV29ybGRPYmplY3QuY29udGVudHMpPy52YWx1ZTtcclxuICAgICAgICAgICAgY29uc3QgbWF0Y2hpbmdJdGVtcyA9IGxpc3QuaXRlbXMuZmlsdGVyKHggPT4geC50eXBlTmFtZSA9PT0gdGFyZ2V0Lm5hbWUpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKG1hdGNoaW5nSXRlbXMubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoaW5nSXRlbXNbMF07XHJcbiAgICAgICAgfSBlbHNlIHsgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gTWVtb3J5LmZpbmRJbnN0YW5jZUJ5TmFtZSh0YXJnZXQubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5mZXJUYXJnZXRGcm9tKHRocmVhZDpUaHJlYWQsIHRhcmdldE5hbWU6c3RyaW5nLCBtZWFuaW5nOk1lYW5pbmcpe1xyXG4gICAgICAgIGlmIChtZWFuaW5nID09PSBNZWFuaW5nLk1vdmluZyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlTmFtZSA9IDxSdW50aW1lU3RyaW5nPnRocmVhZC5jdXJyZW50UGxhY2U/LmZpZWxkcy5nZXQoYDw+JHt0YXJnZXROYW1lfWApPy52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICghcGxhY2VOYW1lKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwbGFjZU5hbWUudmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobWVhbmluZyA9PT0gTWVhbmluZy5JbnZlbnRvcnkpe1xyXG4gICAgICAgICAgICByZXR1cm4gUGxheWVyLnR5cGVOYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRhcmdldE5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXNjcmliZSh0aHJlYWQ6VGhyZWFkLCB0YXJnZXQ6UnVudGltZVdvcmxkT2JqZWN0LCBpc1NoYWxsb3dEZXNjcmlwdGlvbjpib29sZWFuKXtcclxuICAgICAgICBcclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHRhcmdldCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc2NyaWJlVHlwZSA9IG5ldyBJbnN0YW5jZUNhbGxIYW5kbGVyKFdvcmxkT2JqZWN0LmRlc2NyaWJlKTtcclxuICAgICAgICBkZXNjcmliZVR5cGUuaGFuZGxlKHRocmVhZCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IGRlc2NyaXB0aW9uID0gdGFyZ2V0LmZpZWxkcy5nZXQoV29ybGRPYmplY3QuZGVzY3JpcHRpb24pPy52YWx1ZTtcclxuICAgICAgICAvLyBjb25zdCBjb250ZW50cyA9IHRhcmdldC5maWVsZHMuZ2V0KFdvcmxkT2JqZWN0LmNvbnRlbnRzKT8udmFsdWU7XHJcblxyXG4gICAgICAgIC8vIGlmICghKGRlc2NyaXB0aW9uIGluc3RhbmNlb2YgUnVudGltZVN0cmluZykpe1xyXG4gICAgICAgIC8vICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGRlc2NyaWJlIHdpdGhvdXQgYSBzdHJpbmdcIik7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvLyB0aGlzLm91dHB1dC53cml0ZShkZXNjcmlwdGlvbi52YWx1ZSk7XHJcblxyXG4gICAgICAgIC8vIGlmIChpc1NoYWxsb3dEZXNjcmlwdGlvbiB8fCBjb250ZW50cyA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgLy8gaWYgKCEoY29udGVudHMgaW5zdGFuY2VvZiBSdW50aW1lTGlzdCkpe1xyXG4gICAgICAgIC8vICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGRlc2NyaWJlIGNvbnRlbnRzIHdpdGhvdXQgYSBsaXN0XCIpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgLy8gdGhpcy5kZXNjcmliZUNvbnRlbnRzKGNvbnRlbnRzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlc2NyaWJlQ29udGVudHMoZXhlY3V0aW9uUG9pbnQ6VGhyZWFkLCB0YXJnZXQ6UnVudGltZUxpc3Qpe1xyXG4gICAgICAgIGZvcihjb25zdCBpdGVtIG9mIHRhcmdldC5pdGVtcyl7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpYmUoZXhlY3V0aW9uUG9pbnQsIDxSdW50aW1lV29ybGRPYmplY3Q+aXRlbSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGV0ZXJtaW5lTWVhbmluZ0ZvcihhY3Rpb246c3RyaW5nKTpNZWFuaW5ne1xyXG4gICAgICAgIGNvbnN0IHN5c3RlbUFjdGlvbiA9IGA8PiR7YWN0aW9ufWA7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IFN1cHBvcnQgY3VzdG9tIGFjdGlvbnMgYmV0dGVyLlxyXG5cclxuICAgICAgICBzd2l0Y2goc3lzdGVtQWN0aW9uKXtcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLmRlc2NyaWJpbmc6IHJldHVybiBNZWFuaW5nLkRlc2NyaWJpbmc7XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy5tb3Zpbmc6IHJldHVybiBNZWFuaW5nLk1vdmluZztcclxuICAgICAgICAgICAgY2FzZSBVbmRlcnN0YW5kaW5nLmRpcmVjdGlvbjogcmV0dXJuIE1lYW5pbmcuRGlyZWN0aW9uO1xyXG4gICAgICAgICAgICBjYXNlIFVuZGVyc3RhbmRpbmcudGFraW5nOiByZXR1cm4gTWVhbmluZy5UYWtpbmc7XHJcbiAgICAgICAgICAgIGNhc2UgVW5kZXJzdGFuZGluZy5pbnZlbnRvcnk6IHJldHVybiBNZWFuaW5nLkludmVudG9yeTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBNZWFuaW5nLkN1c3RvbTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lSW50ZWdlciB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVJbnRlZ2VyXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlIH0gZnJvbSBcIi4uL2xpYnJhcnkvVmFyaWFibGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgTWV0aG9kQWN0aXZhdGlvbiB9IGZyb20gXCIuLi9NZXRob2RBY3RpdmF0aW9uXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnN0YW5jZUNhbGxIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbWV0aG9kTmFtZT86c3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHRocmVhZC5jdXJyZW50TWV0aG9kO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMubWV0aG9kTmFtZSl7XHJcbiAgICAgICAgICAgIHRoaXMubWV0aG9kTmFtZSA9IDxzdHJpbmc+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjdXJyZW50LnBvcCgpO1xyXG5cclxuICAgICAgICBjb25zdCBtZXRob2QgPSBpbnN0YW5jZT8ubWV0aG9kcy5nZXQodGhpcy5tZXRob2ROYW1lKSE7XHJcblxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGBjYWxsLmluc3RcXHQke2luc3RhbmNlPy50eXBlTmFtZX06OiR7dGhpcy5tZXRob2ROYW1lfSguLi4ke21ldGhvZC5wYXJhbWV0ZXJzLmxlbmd0aH0pYCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgcGFyYW1ldGVyVmFsdWVzOlZhcmlhYmxlW10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG1ldGhvZCEucGFyYW1ldGVycy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlciA9IG1ldGhvZCEucGFyYW1ldGVyc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjdXJyZW50LnBvcCgpITtcclxuICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSBuZXcgVmFyaWFibGUocGFyYW1ldGVyLm5hbWUsIHBhcmFtZXRlci50eXBlISwgaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgcGFyYW1ldGVyVmFsdWVzLnB1c2godmFyaWFibGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBIQUNLOiBXZSBzaG91bGRuJ3QgY3JlYXRlIG91ciBvd24gdHlwZSwgd2Ugc2hvdWxkIGluaGVyZW50bHkga25vdyB3aGF0IGl0IGlzLlxyXG5cclxuICAgICAgICBwYXJhbWV0ZXJWYWx1ZXMudW5zaGlmdChuZXcgVmFyaWFibGUoXCI8PnRoaXNcIiwgbmV3IFR5cGUoaW5zdGFuY2U/LnR5cGVOYW1lISwgaW5zdGFuY2U/LnBhcmVudFR5cGVOYW1lISksIGluc3RhbmNlKSk7XHJcblxyXG4gICAgICAgIG1ldGhvZC5hY3R1YWxQYXJhbWV0ZXJzID0gcGFyYW1ldGVyVmFsdWVzO1xyXG5cclxuICAgICAgICB0aHJlYWQuYWN0aXZhdGVNZXRob2QobWV0aG9kKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkRmllbGRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLnBvcCgpO1xyXG4gICAgICAgIGNvbnN0IGZpZWxkTmFtZSA9IDxzdHJpbmc+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICBjb25zdCBmaWVsZCA9IGluc3RhbmNlPy5maWVsZHMuZ2V0KGZpZWxkTmFtZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZmllbGQ/LnZhbHVlO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgbGQuZmllbGRcXHRcXHQke2luc3RhbmNlPy50eXBlTmFtZX06OiR7ZmllbGROYW1lfSAvLyAke3ZhbHVlfWApO1xyXG5cclxuICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHZhbHVlISk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvUnVudGltZUVycm9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZEluc3RhbmNlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IHR5cGVOYW1lID0gdGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICBpZiAodHlwZU5hbWUgPT09IFwiPD5pdFwiKXtcclxuICAgICAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRocmVhZC5jdXJyZW50UGxhY2UhO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHN1YmplY3QpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoXCJsZC5jdXJyLnBsYWNlXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYFVuYWJsZSB0byBsb2FkIGluc3RhbmNlIGZvciB1bnN1cHBvcnRlZCB0eXBlICcke3R5cGVOYW1lfSdgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZExvY2FsSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvY2FsTmFtZSA9IHRocmVhZC5jdXJyZW50SW5zdHJ1Y3Rpb24/LnZhbHVlITtcclxuXHJcbiAgICAgICAgY29uc3QgcGFyYW1ldGVyID0gdGhyZWFkLmN1cnJlbnRNZXRob2QubWV0aG9kPy5hY3R1YWxQYXJhbWV0ZXJzLmZpbmQoeCA9PiB4Lm5hbWUgPT0gbG9jYWxOYW1lKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChwYXJhbWV0ZXI/LnZhbHVlISk7XHJcblxyXG4gICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGBsZC5wYXJhbVxcdFxcdCR7bG9jYWxOYW1lfT0ke3BhcmFtZXRlcj8udmFsdWV9YCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1lbW9yeSB9IGZyb20gXCIuLi9jb21tb24vTWVtb3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZE51bWJlckhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG5cclxuICAgICAgICBjb25zdCB2YWx1ZSA9IDxudW1iZXI+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG4gICAgICAgIGNvbnN0IHJ1bnRpbWVWYWx1ZSA9IE1lbW9yeS5hbGxvY2F0ZU51bWJlcih2YWx1ZSk7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2gocnVudGltZVZhbHVlKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYGxkLmNvbnN0Lm51bVxcdCR7dmFsdWV9YCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZSB9IGZyb20gXCIuLi9saWJyYXJ5L1ZhcmlhYmxlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZFByb3BlcnR5SGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZpZWxkTmFtZT86c3RyaW5nKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpZWxkTmFtZSl7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGROYW1lID0gPHN0cmluZz50aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZSE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBmaWVsZCA9IGluc3RhbmNlPy5maWVsZHMuZ2V0KHRoaXMuZmllbGROYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBmaWVsZD8udmFsdWUhO1xyXG5cclxuICAgICAgICBjb25zdCBnZXRGaWVsZCA9IGluc3RhbmNlPy5tZXRob2RzLmdldChgPD5nZXRfJHt0aGlzLmZpZWxkTmFtZX1gKTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYGxkLnByb3BcXHRcXHQke2luc3RhbmNlPy50eXBlTmFtZX06OiR7dGhpcy5maWVsZE5hbWV9IHtnZXQ9JHtnZXRGaWVsZCAhPSB1bmRlZmluZWR9fSAvLyAke3ZhbHVlfWApO1xyXG5cclxuICAgICAgICBpZiAoZ2V0RmllbGQpe1xyXG4gICAgICAgICAgICBnZXRGaWVsZC5hY3R1YWxQYXJhbWV0ZXJzLnB1c2gobmV3IFZhcmlhYmxlKFwiPD52YWx1ZVwiLCBmaWVsZD8udHlwZSEsIHZhbHVlKSk7XHJcblxyXG4gICAgICAgICAgICB0aHJlYWQuYWN0aXZhdGVNZXRob2QoZ2V0RmllbGQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMb2FkU3RyaW5nSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uIS52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIil7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0cmluZ1ZhbHVlID0gbmV3IFJ1bnRpbWVTdHJpbmcodmFsdWUpO1xyXG4gICAgICAgICAgICB0aHJlYWQuY3VycmVudE1ldGhvZC5wdXNoKHN0cmluZ1ZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKGBsZC5jb25zdC5zdHJcXHRcIiR7dmFsdWV9XCJgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiRXhwZWN0ZWQgYSBzdHJpbmdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIlxyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9hZFRoaXNIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRocmVhZC5jdXJyZW50TWV0aG9kLm1ldGhvZD8uYWN0dWFsUGFyYW1ldGVyc1swXS52YWx1ZSE7XHJcblxyXG4gICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgbGQudGhpc2ApO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBPcENvZGVIYW5kbGVyIH0gZnJvbSBcIi4uL09wQ29kZUhhbmRsZXJcIjtcclxuaW1wb3J0IHsgVGhyZWFkIH0gZnJvbSBcIi4uL1RocmVhZFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ld0luc3RhbmNlSGFuZGxlciBleHRlbmRzIE9wQ29kZUhhbmRsZXJ7XHJcbiAgICBoYW5kbGUodGhyZWFkOlRocmVhZCl7XHJcbiAgICAgICAgY29uc3QgdHlwZU5hbWUgPSB0aHJlYWQuY3VycmVudEluc3RydWN0aW9uPy52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0eXBlTmFtZSA9PT0gXCJzdHJpbmdcIil7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0aHJlYWQua25vd25UeXBlcy5nZXQodHlwZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIGxvY2F0ZSB0eXBlXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IE1lbW9yeS5hbGxvY2F0ZSh0eXBlKTtcclxuXHJcbiAgICAgICAgICAgIHRocmVhZC5jdXJyZW50TWV0aG9kLnB1c2goaW5zdGFuY2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgRXZhbHVhdGlvblJlc3VsdCB9IGZyb20gXCIuLi9FdmFsdWF0aW9uUmVzdWx0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTm9PcEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIHJldHVybiBFdmFsdWF0aW9uUmVzdWx0LkNvbnRpbnVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcbmltcG9ydCB7IFRocmVhZCB9IGZyb20gXCIuLi9UaHJlYWRcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuLi9saWJyYXJ5L1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgUnVudGltZUNvbW1hbmQgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lQ29tbWFuZFwiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBhcnNlQ29tbWFuZEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgaWYgKHRleHQgaW5zdGFuY2VvZiBSdW50aW1lU3RyaW5nKXtcclxuICAgICAgICAgICAgY29uc3QgY29tbWFuZFRleHQgPSB0ZXh0LnZhbHVlO1xyXG4gICAgICAgICAgICBjb25zdCBjb21tYW5kID0gdGhpcy5wYXJzZUNvbW1hbmQoY29tbWFuZFRleHQpO1xyXG5cclxuICAgICAgICAgICAgdGhyZWFkLmN1cnJlbnRNZXRob2QucHVzaChjb21tYW5kKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFwiVW5hYmxlIHRvIHBhcnNlIGNvbW1hbmRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaGFuZGxlKHRocmVhZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwYXJzZUNvbW1hbmQodGV4dDpzdHJpbmcpOlJ1bnRpbWVDb21tYW5ke1xyXG4gICAgICAgIGNvbnN0IHBpZWNlcyA9IHRleHQuc3BsaXQoXCIgXCIpO1xyXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBNZW1vcnkuYWxsb2NhdGVDb21tYW5kKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29tbWFuZC5hY3Rpb24gPSBNZW1vcnkuYWxsb2NhdGVTdHJpbmcocGllY2VzWzBdKTtcclxuICAgICAgICBjb21tYW5kLnRhcmdldE5hbWUgPSBNZW1vcnkuYWxsb2NhdGVTdHJpbmcocGllY2VzWzFdKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbW1hbmQ7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IElPdXRwdXQgfSBmcm9tIFwiLi4vSU91dHB1dFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lU3RyaW5nIH0gZnJvbSBcIi4uL2xpYnJhcnkvUnVudGltZVN0cmluZ1wiO1xyXG5pbXBvcnQgeyBSdW50aW1lRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL1J1bnRpbWVFcnJvclwiO1xyXG5pbXBvcnQgeyBFdmFsdWF0aW9uUmVzdWx0IH0gZnJvbSBcIi4uL0V2YWx1YXRpb25SZXN1bHRcIjtcclxuaW1wb3J0IHsgT3BDb2RlSGFuZGxlciB9IGZyb20gXCIuLi9PcENvZGVIYW5kbGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJpbnRIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIHByaXZhdGUgb3V0cHV0OklPdXRwdXQ7XHJcblxyXG4gICAgY29uc3RydWN0b3Iob3V0cHV0OklPdXRwdXQpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5vdXRwdXQgPSBvdXRwdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSB0aHJlYWQuY3VycmVudE1ldGhvZC5wb3AoKTtcclxuXHJcbiAgICAgICAgaWYgKHRleHQgaW5zdGFuY2VvZiBSdW50aW1lU3RyaW5nKXtcclxuICAgICAgICAgICAgdGhpcy5vdXRwdXQud3JpdGUodGV4dC52YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcIlVuYWJsZSB0byBwcmludCwgZW5jb3VudGVyZWQgYSB0eXBlIG9uIHRoZSBzdGFjayBvdGhlciB0aGFuIHN0cmluZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5oYW5kbGUodGhyZWFkKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlYWRJbnB1dEhhbmRsZXIgZXh0ZW5kcyBPcENvZGVIYW5kbGVye1xyXG4gICAgaGFuZGxlKHRocmVhZDpUaHJlYWQpe1xyXG4gICAgICAgIHJldHVybiBFdmFsdWF0aW9uUmVzdWx0LlN1c3BlbmRGb3JJbnB1dDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IEV2YWx1YXRpb25SZXN1bHQgfSBmcm9tIFwiLi4vRXZhbHVhdGlvblJlc3VsdFwiO1xyXG5pbXBvcnQgeyBSdW50aW1lRW1wdHkgfSBmcm9tIFwiLi4vbGlicmFyeS9SdW50aW1lRW1wdHlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZXR1cm5IYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgcmV0dXJuaW5nIHRvcCB2YWx1ZSBvbiBzdGFjayBiYXNlZCBvbiByZXR1cm4gdHlwZSBvZiBtZXRob2QuXHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHRocmVhZC5jdXJyZW50TWV0aG9kO1xyXG4gICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0gdGhyZWFkIS5yZXR1cm5Gcm9tQ3VycmVudE1ldGhvZCgpO1xyXG5cclxuICAgICAgICBpZiAoIShyZXR1cm5WYWx1ZSBpbnN0YW5jZW9mIFJ1bnRpbWVFbXB0eSkpe1xyXG4gICAgICAgICAgICB0aHJlYWQubG9nPy5kZWJ1ZyhgcmV0XFx0XFx0JHtyZXR1cm5WYWx1ZX1gKTtcclxuICAgICAgICAgICAgdGhyZWFkPy5jdXJyZW50TWV0aG9kLnB1c2gocmV0dXJuVmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRocmVhZC5sb2c/LmRlYnVnKFwicmV0IHZvaWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gRXZhbHVhdGlvblJlc3VsdC5Db250aW51ZTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IE9wQ29kZUhhbmRsZXIgfSBmcm9tIFwiLi4vT3BDb2RlSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBUaHJlYWQgfSBmcm9tIFwiLi4vVGhyZWFkXCI7XHJcbmltcG9ydCB7IE1ldGhvZEFjdGl2YXRpb24gfSBmcm9tIFwiLi4vTWV0aG9kQWN0aXZhdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0YXRpY0NhbGxIYW5kbGVyIGV4dGVuZHMgT3BDb2RlSGFuZGxlcntcclxuICAgIGhhbmRsZSh0aHJlYWQ6VGhyZWFkKXtcclxuICAgICAgICBjb25zdCBjYWxsVGV4dCA9IDxzdHJpbmc+dGhyZWFkLmN1cnJlbnRJbnN0cnVjdGlvbj8udmFsdWUhO1xyXG5cclxuICAgICAgICBjb25zdCBwaWVjZXMgPSBjYWxsVGV4dC5zcGxpdChcIi5cIik7XHJcblxyXG4gICAgICAgIGNvbnN0IHR5cGVOYW1lID0gcGllY2VzWzBdO1xyXG4gICAgICAgIGNvbnN0IG1ldGhvZE5hbWUgPSBwaWVjZXNbMV07XHJcblxyXG4gICAgICAgIGNvbnN0IHR5cGUgPSB0aHJlYWQua25vd25UeXBlcy5nZXQodHlwZU5hbWUpITtcclxuICAgICAgICBjb25zdCBtZXRob2QgPSB0eXBlPy5tZXRob2RzLmZpbmQoeCA9PiB4Lm5hbWUgPT09IG1ldGhvZE5hbWUpITsgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhyZWFkLmxvZz8uZGVidWcoYGNhbGwuc3RhdGljXFx0JHt0eXBlTmFtZX06OiR7bWV0aG9kTmFtZX0oKWApO1xyXG5cclxuICAgICAgICB0aHJlYWQuYWN0aXZhdGVNZXRob2QobWV0aG9kKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhbmRsZSh0aHJlYWQpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGVudW0gTWVhbmluZ3tcclxuICAgIERlc2NyaWJpbmcsXHJcbiAgICBUYWtpbmcsXHJcbiAgICBNb3ZpbmcsXHJcbiAgICBEaXJlY3Rpb24sXHJcbiAgICBJbnZlbnRvcnksXHJcbiAgICBEcm9wcGluZyxcclxuICAgIFF1aXR0aW5nLFxyXG4gICAgQ3VzdG9tXHJcbn0iLCJpbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vLi4vY29tbW9uL01ldGhvZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVBbnl7XHJcbiAgICBwYXJlbnRUeXBlTmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgdHlwZU5hbWU6c3RyaW5nID0gQW55LnR5cGVOYW1lO1xyXG5cclxuICAgIGZpZWxkczpNYXA8c3RyaW5nLCBWYXJpYWJsZT4gPSBuZXcgTWFwPHN0cmluZywgVmFyaWFibGU+KCk7XHJcbiAgICBtZXRob2RzOk1hcDxzdHJpbmcsIE1ldGhvZD4gPSBuZXcgTWFwPHN0cmluZywgTWV0aG9kPigpO1xyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZU5hbWU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVCb29sZWFuIGV4dGVuZHMgUnVudGltZUFueXtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTpib29sZWFuKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVTdHJpbmcgfSBmcm9tIFwiLi9SdW50aW1lU3RyaW5nXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUNvbW1hbmQgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHRhcmdldE5hbWU/OlJ1bnRpbWVTdHJpbmcsIHB1YmxpYyBhY3Rpb24/OlJ1bnRpbWVTdHJpbmcpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBBbnkgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9BbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lRW1wdHkgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgcGFyZW50VHlwZU5hbWUgPSBBbnkudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IFwiPD5lbXB0eVwiO1xyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lSW50ZWdlciBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdmFsdWU6bnVtYmVyKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVXb3JsZE9iamVjdCB9IGZyb20gXCIuL1J1bnRpbWVXb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBXb3JsZE9iamVjdCB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1dvcmxkT2JqZWN0XCI7XHJcbmltcG9ydCB7IEl0ZW0gfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9JdGVtXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lSXRlbSBleHRlbmRzIFJ1bnRpbWVXb3JsZE9iamVjdHtcclxuICAgIHBhcmVudFR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7XHJcbiAgICB0eXBlTmFtZSA9IEl0ZW0udHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIGdldCB0eXBlKCk6VHlwZXtcclxuICAgICAgICBjb25zdCB0eXBlID0gUnVudGltZVdvcmxkT2JqZWN0LnR5cGU7XHJcblxyXG4gICAgICAgIHR5cGUubmFtZSA9IEl0ZW0udHlwZU5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tIFwiLi4vLi4vY29tbW9uL01ldGhvZFwiO1xyXG5pbXBvcnQgeyBQYXJhbWV0ZXIgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1BhcmFtZXRlclwiO1xyXG5pbXBvcnQgeyBOdW1iZXJUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTnVtYmVyVHlwZVwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gXCIuLi8uLi9jb21tb24vSW5zdHJ1Y3Rpb25cIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuL1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUludGVnZXIgfSBmcm9tIFwiLi9SdW50aW1lSW50ZWdlclwiO1xyXG5pbXBvcnQgeyBNZW1vcnkgfSBmcm9tIFwiLi4vY29tbW9uL01lbW9yeVwiO1xyXG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L0Jvb2xlYW5UeXBlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZUxpc3QgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGl0ZW1zOlJ1bnRpbWVBbnlbXSl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29udGFpbnMgPSBuZXcgTWV0aG9kKCk7XHJcbiAgICAgICAgY29udGFpbnMubmFtZSA9IExpc3QuY29udGFpbnM7XHJcbiAgICAgICAgY29udGFpbnMucGFyYW1ldGVycy5wdXNoKFxyXG4gICAgICAgICAgICBuZXcgUGFyYW1ldGVyKExpc3QudHlwZU5hbWVQYXJhbWV0ZXIsIFN0cmluZ1R5cGUudHlwZU5hbWUpLFxyXG4gICAgICAgICAgICBuZXcgUGFyYW1ldGVyKExpc3QuY291bnRQYXJhbWV0ZXIsIE51bWJlclR5cGUudHlwZU5hbWUpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29udGFpbnMucmV0dXJuVHlwZSA9IEJvb2xlYW5UeXBlLnR5cGVOYW1lO1xyXG5cclxuICAgICAgICBjb250YWlucy5ib2R5LnB1c2goXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRMb2NhbChMaXN0LmNvdW50UGFyYW1ldGVyKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ubG9hZExvY2FsKExpc3QudHlwZU5hbWVQYXJhbWV0ZXIpLCAgXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmxvYWRUaGlzKCksXHJcbiAgICAgICAgICAgIEluc3RydWN0aW9uLmV4dGVybmFsQ2FsbChcImNvbnRhaW5zVHlwZVwiKSxcclxuICAgICAgICAgICAgSW5zdHJ1Y3Rpb24ucmV0dXJuKClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLm1ldGhvZHMuc2V0KExpc3QuY29udGFpbnMsIGNvbnRhaW5zKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvbnRhaW5zVHlwZSh0eXBlTmFtZTpSdW50aW1lU3RyaW5nLCBjb3VudDpSdW50aW1lSW50ZWdlcil7XHJcbiAgICAgICAgY29uc3QgZm91bmRJdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKHggPT4geC50eXBlTmFtZSA9PT0gdHlwZU5hbWUudmFsdWUpO1xyXG4gICAgICAgIGNvbnN0IGZvdW5kID0gZm91bmRJdGVtcy5sZW5ndGggPT09IGNvdW50LnZhbHVlO1xyXG5cclxuICAgICAgICByZXR1cm4gTWVtb3J5LmFsbG9jYXRlQm9vbGVhbihmb3VuZCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lV29ybGRPYmplY3QgfSBmcm9tIFwiLi9SdW50aW1lV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgV29ybGRPYmplY3QgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9Xb3JsZE9iamVjdFwiO1xyXG5pbXBvcnQgeyBQbGFjZSB9IGZyb20gXCIuLi8uLi9saWJyYXJ5L1BsYWNlXCI7XHJcbmltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lUGxhY2UgZXh0ZW5kcyBSdW50aW1lV29ybGRPYmplY3R7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IFdvcmxkT2JqZWN0LnBhcmVudFR5cGVOYW1lO1xyXG4gICAgdHlwZU5hbWUgPSBQbGFjZS50eXBlTmFtZTtcclxuXHJcbiAgICBzdGF0aWMgZ2V0IHR5cGUoKTpUeXBle1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBSdW50aW1lV29ybGRPYmplY3QudHlwZTtcclxuXHJcbiAgICAgICAgdHlwZS5uYW1lID0gUGxhY2UudHlwZU5hbWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lV29ybGRPYmplY3QgfSBmcm9tIFwiLi9SdW50aW1lV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgVHlwZSB9IGZyb20gXCIuLi8uLi9jb21tb24vVHlwZVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vbGlicmFyeS9QbGF5ZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSdW50aW1lUGxheWVyIGV4dGVuZHMgUnVudGltZVdvcmxkT2JqZWN0e1xyXG4gICAgc3RhdGljIGdldCB0eXBlKCk6VHlwZXtcclxuICAgICAgICBjb25zdCB0eXBlID0gUnVudGltZVdvcmxkT2JqZWN0LnR5cGU7XHJcblxyXG4gICAgICAgIHR5cGUubmFtZSA9IFBsYXllci50eXBlTmFtZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBSdW50aW1lQW55IH0gZnJvbSBcIi4vUnVudGltZUFueVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVTYXkgZXh0ZW5kcyBSdW50aW1lQW55e1xyXG4gICAgbWVzc2FnZTpzdHJpbmcgPSBcIlwiO1xyXG59IiwiaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUnVudGltZVN0cmluZyBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICB2YWx1ZTpzdHJpbmc7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gXCI8PnN0cmluZ1wiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOnN0cmluZyl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcoKXtcclxuICAgICAgICByZXR1cm4gYFwiJHt0aGlzLnZhbHVlfVwiYDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFJ1bnRpbWVBbnkgfSBmcm9tIFwiLi9SdW50aW1lQW55XCI7XHJcbmltcG9ydCB7IFdvcmxkT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvV29ybGRPYmplY3RcIjtcclxuaW1wb3J0IHsgQW55IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvQW55XCI7XHJcbmltcG9ydCB7IFJ1bnRpbWVMaXN0IH0gZnJvbSBcIi4vUnVudGltZUxpc3RcIjtcclxuaW1wb3J0IHsgUnVudGltZVN0cmluZyB9IGZyb20gXCIuL1J1bnRpbWVTdHJpbmdcIjtcclxuaW1wb3J0IHsgUnVudGltZUVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9SdW50aW1lRXJyb3JcIjtcclxuaW1wb3J0IHsgVmFyaWFibGUgfSBmcm9tIFwiLi9WYXJpYWJsZVwiO1xyXG5pbXBvcnQgeyBUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9UeXBlXCI7XHJcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9GaWVsZFwiO1xyXG5pbXBvcnQgeyBMaXN0IH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvTGlzdFwiO1xyXG5pbXBvcnQgeyBTdHJpbmdUeXBlIH0gZnJvbSBcIi4uLy4uL2xpYnJhcnkvU3RyaW5nVHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVXb3JsZE9iamVjdCBleHRlbmRzIFJ1bnRpbWVBbnl7XHJcbiAgICBwYXJlbnRUeXBlTmFtZSA9IEFueS50eXBlTmFtZTtcclxuICAgIHR5cGVOYW1lID0gV29ybGRPYmplY3QudHlwZU5hbWU7XHJcblxyXG4gICAgc3RhdGljIGdldCB0eXBlKCk6VHlwZXtcclxuICAgICAgICBjb25zdCB0eXBlID0gbmV3IFR5cGUoV29ybGRPYmplY3QudHlwZU5hbWUsIFdvcmxkT2JqZWN0LnBhcmVudFR5cGVOYW1lKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjb250ZW50cyA9IG5ldyBGaWVsZCgpO1xyXG4gICAgICAgIGNvbnRlbnRzLm5hbWUgPSBXb3JsZE9iamVjdC5jb250ZW50cztcclxuICAgICAgICBjb250ZW50cy50eXBlTmFtZSA9IExpc3QudHlwZU5hbWU7XHJcbiAgICAgICAgY29udGVudHMuZGVmYXVsdFZhbHVlID0gW107XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gbmV3IEZpZWxkKCk7XHJcbiAgICAgICAgZGVzY3JpcHRpb24ubmFtZSA9IFdvcmxkT2JqZWN0LmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uLnR5cGVOYW1lID0gU3RyaW5nVHlwZS50eXBlTmFtZTtcclxuICAgICAgICBkZXNjcmlwdGlvbi5kZWZhdWx0VmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICB0eXBlLmZpZWxkcy5wdXNoKGNvbnRlbnRzKTtcclxuICAgICAgICB0eXBlLmZpZWxkcy5wdXNoKGRlc2NyaXB0aW9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRGaWVsZFZhbHVlQnlOYW1lKG5hbWU6c3RyaW5nKTpSdW50aW1lQW55e1xyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5maWVsZHMuZ2V0KG5hbWUpPy52YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGluc3RhbmNlID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoYEF0dGVtcHRlZCBmaWVsZCBhY2Nlc3MgZm9yIHVua25vd24gZmllbGQgJyR7bmFtZX0nYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RmllbGRBc0xpc3QobmFtZTpzdHJpbmcpOlJ1bnRpbWVMaXN0e1xyXG4gICAgICAgIHJldHVybiA8UnVudGltZUxpc3Q+dGhpcy5nZXRGaWVsZFZhbHVlQnlOYW1lKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEZpZWxkQXNTdHJpbmcobmFtZTpzdHJpbmcpOlJ1bnRpbWVTdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIDxSdW50aW1lU3RyaW5nPnRoaXMuZ2V0RmllbGRWYWx1ZUJ5TmFtZShuYW1lKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFR5cGUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL1R5cGVcIjtcclxuaW1wb3J0IHsgUnVudGltZUFueSB9IGZyb20gXCIuL1J1bnRpbWVBbnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBWYXJpYWJsZXtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgbmFtZTpzdHJpbmcsIFxyXG4gICAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IHR5cGU6VHlwZSxcclxuICAgICAgICAgICAgICAgIHB1YmxpYyB2YWx1ZT86UnVudGltZUFueSl7XHJcbiAgICB9XHJcbn0iXX0=
