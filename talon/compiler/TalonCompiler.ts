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
import { GlobalFields } from "../library/GlobalFields";
import { GlobalEvents } from "../library/GlobalEvents";
import { EventType } from "../common/EventType";

export class TalonCompiler{
    get languageVersion(){
        return new Version(1, 0, 0);
    }

    get version(){
        return new Version(buildInfo.major, buildInfo.minor, buildInfo.build);
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

            console.log(`Compiled ${types.length} types`);
            console.log(types);

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

        const main = new Method();
        main.name = Any.main;
        main.body.push(
            Instruction.loadString(`Talon Language v.${this.languageVersion}, Compiler v.${this.version}`),
            Instruction.print(),                            
            Instruction.loadString("================================="),
            Instruction.print(),
            Instruction.loadString(""),
            Instruction.print(),
            Instruction.staticCall("~globalSays", "~say", false),
            Instruction.loadString(""),
            Instruction.print(),            
            Instruction.loadInstance(GlobalEvents.typeName),
            Instruction.raiseEvent(EventType.GameIsStarted),
            ...Instruction.raiseAllEvents(),
            Instruction.loadString(""),
            Instruction.print(),
            Instruction.loadInstance(GlobalEvents.typeName),
            Instruction.raiseEvent(EventType.PlayerIsStarted),
            ...Instruction.raiseAllEvents(),
            Instruction.loadString(""),
            Instruction.print(),            
            Instruction.loadPlace(),
            Instruction.instanceCall(WorldObject.describe),
            Instruction.ignore(),  
            Instruction.loadBoolean(true),
            Instruction.assignStaticField("~globalProgramFields", GlobalFields.canRun),
            ...Instruction.while(
                Instruction.loadStaticField("~globalProgramFields", GlobalFields.canRun),

                Instruction.loadString(""),
                Instruction.print(),      
                Instruction.loadString("What would you like to do?"),
                Instruction.print(),
                Instruction.readInput(),
                Instruction.loadString(""),
                Instruction.print(),
                Instruction.parseCommand(),    
                Instruction.handleCommand(),
                ...Instruction.raiseAllEvents()
            ),
            Instruction.loadString(""),
            Instruction.print(),            
            Instruction.loadInstance(GlobalEvents.typeName),
            Instruction.raiseEvent(EventType.GameIsEnded),
            ...Instruction.raiseAllEvents(),
            Instruction.return()
        );

        type.methods.push(main);

        return type;
    }
}