import { Type } from "../common/Type";
import { Method } from "../common/Method";
import { Any } from "../library/Any";
import { Instruction } from "../common/Instruction";
import { EntryPointAttribute } from "../library/EntryPointAttribute";
import { Tokenizer } from "./lexing/TalonLexer";
import { TalonParser } from "./parsing/TalonParser";
import { TalonSemanticAnalyzer } from "./semantics/TalonSemanticAnalyzer";
import { TalonTransformer } from "./tranforming/TalonTransformer";
import { Version } from "../common/Version";

export class TalonCompiler{
    
    get languageVersion(){
        return new Version(1, 0, 0);
    }

    get version(){
        return new Version(1, 0, 0);
    }

    compile(code:string):Type[]{
        const lexer = new Tokenizer();
        const parser = new TalonParser();
        const analyzer = new TalonSemanticAnalyzer();
        const transformer = new TalonTransformer();

        const tokens = lexer.tokenize(code);
        const ast = parser.parse(tokens);
        const analyzedAst = analyzer.analyze(ast);
        const types = transformer.transform(analyzedAst);

        const entryPoint = this.createEntryPoint();

        types.push(entryPoint);

        return types;
    }

    private createEntryPoint(){
        const type = new Type("<>entryPoint", "<>empty");

        type.attributes.push(new EntryPointAttribute());

        const main = new Method();
        main.name = Any.main;
        main.body.push(
            Instruction.loadString(`Talon Language v.${this.languageVersion}`),
            Instruction.print(),
            Instruction.loadString(`Talon Compiler v.${this.version}`),
            Instruction.print(),                            
            Instruction.loadString("================================="),
            Instruction.print(),
            Instruction.loadString(""),
            Instruction.print(),
            Instruction.staticCall("<~>globalSays", "<>say"),        
            Instruction.loadString(""),
            Instruction.print(),
            Instruction.loadString("What would you like to do?"),
            Instruction.print(),
            Instruction.readInput(),
            Instruction.loadString(""),
            Instruction.print(),
            Instruction.parseCommand(),
            Instruction.handleCommand(),
            Instruction.goTo(9)
        );

        type.methods.push(main);

        return type;
    }
}