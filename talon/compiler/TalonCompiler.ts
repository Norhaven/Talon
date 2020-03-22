import { Type } from "../common/Type";
import { Method } from "../common/Method";
import { Any } from "../library/Any";
import { Instruction } from "../common/Instruction";
import { EntryPointAttribute } from "../library/EntryPointAttribute";
import { TalonLexer } from "./lexing/TalonLexer";
import { TalonParser } from "./parsing/TalonParser";
import { TalonSemanticAnalyzer } from "./semantics/TalonSemanticAnalyzer";
import { TalonTransformer } from "./transforming/TalonTransformer";
import { Version } from "../common/Version";
import { IOutput } from "../runtime/IOutput";
import { CompilationError } from "./exceptions/CompilationError";
import { Delegate } from "../library/Delegate";

export class TalonCompiler{
    get languageVersion(){
        return new Version(1, 0, 0);
    }

    get version(){
        return new Version(1, 0, 0);
    }

    constructor(private readonly out:IOutput){
    }

    compile(code:string):Type[]{
        this.out.write("Starting compilation...");

        try{
            const lexer = new TalonLexer(this.out);
            const parser = new TalonParser(this.out);
            const analyzer = new TalonSemanticAnalyzer(this.out);
            const transformer = new TalonTransformer(this.out);

            const tokens = lexer.tokenize(code);
            const ast = parser.parse(tokens);
            const analyzedAst = analyzer.analyze(ast);
            const types = transformer.transform(analyzedAst);

            const entryPoint = this.createEntryPoint();

            types.push(entryPoint);

            return types;
        } catch(ex){
            if (ex instanceof CompilationError){
                this.out.write(`Error: ${ex.message}`);
            }

            return [];
        } finally{
            this.out.write("Compilation complete.");
        }
    }

    private createEntryPoint(){
        const type = new Type("~entryPoint", "~empty");

        type.attributes.push(new EntryPointAttribute());

        const main = new Method();
        main.name = Any.main;
        main.body.push(
            Instruction.loadString(`Talon Language v.${this.languageVersion}, Compiler v.${this.version}`),
            Instruction.print(),                            
            Instruction.loadString("================================="),
            Instruction.print(),
            Instruction.loadString(""),
            Instruction.print(),
            Instruction.staticCall("~globalSays", "~say"),        
            Instruction.loadString(""),
            Instruction.print(),
            Instruction.loadString("What would you like to do?"),
            Instruction.print(),
            Instruction.readInput(),
            Instruction.loadString(""),
            Instruction.print(),
            Instruction.parseCommand(),    
            Instruction.handleCommand(),
            Instruction.isTypeOf(Delegate.typeName),
            Instruction.branchRelativeIfFalse(2),            
            Instruction.invokeDelegate(),        
            Instruction.branchRelative(-4),
            Instruction.goTo(9)
        );

        type.methods.push(main);

        return type;
    }
}