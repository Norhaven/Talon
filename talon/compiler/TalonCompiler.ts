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
import * as buildInfo from "../../build-info.json";
import { List } from "../library/List";
import { WorldObject } from "../library/WorldObject";

export class TalonCompiler{
    get languageVersion(){
        return new Version(1, 0, 0);
    }

    get version(){
        return new Version(buildInfo.major, buildInfo.minor, buildInfo.revision);
    }

    constructor(private readonly out:IOutput){
    }

    compile(code:string):Type[]{
        this.out.write("<strong>Starting compilation...</strong>");

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
                this.out.write(`<em>Error: ${ex.message}</em>`);
            } else {
                this.out.write(`<em>Unhandled Error: ${ex}</em>`);
            }

            return [];
        } finally{
            this.out.write("<strong>Compilation complete.</strong>");
        }
    }

    private createEntryPoint(){
        const type = new Type("~game", Any.typeName);

        type.attributes.push(new EntryPointAttribute());

        const handledCommandLocal = "~handledCommand";

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
            Instruction.loadPlace(),
            Instruction.instanceCall(WorldObject.describe),  
            Instruction.loadString(""),
            Instruction.print(),      
            Instruction.loadString("What would you like to do?"),
            Instruction.print(),
            Instruction.readInput(),
            Instruction.loadString(""),
            Instruction.print(),
            Instruction.parseCommand(),    
            Instruction.handleCommand(),
            Instruction.setLocal(handledCommandLocal),
            Instruction.loadLocal(handledCommandLocal),
            Instruction.isTypeOf(Delegate.typeName),
            ...Instruction.ifTrueThen(
                Instruction.invokeDelegate(),
                Instruction.goTo(7)
            ),
            Instruction.loadLocal(handledCommandLocal),
            Instruction.isTypeOf(List.typeName),
            ...Instruction.ifTrueThen(
                Instruction.loadLocal(handledCommandLocal),
                Instruction.instanceCall(List.count),
                Instruction.loadNumber(0),
                Instruction.compareEqual(),
                ...Instruction.ifTrueThen(
                    Instruction.loadString("I don't know how to do that."),
                    Instruction.print(),
                    Instruction.goTo(7)
                ),
                ...Instruction.forEach(
                    Instruction.invokeDelegate()
                )
            ),
            Instruction.goTo(7)
        );

        type.methods.push(main);

        return type;
    }
}