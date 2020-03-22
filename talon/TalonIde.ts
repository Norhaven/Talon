import { TalonCompiler } from "./compiler/TalonCompiler";

import { PaneOutput } from "./PaneOutput";

import { TalonRuntime } from "./runtime/TalonRuntime";
import { Type } from "./common/Type";

export class TalonIde{
    private readonly codePane:HTMLDivElement;
    private readonly gamePane:HTMLDivElement;
    private readonly compilationOutput:HTMLDivElement;
    private readonly gameLogOutput:HTMLDivElement;
    private readonly compileButton:HTMLButtonElement;
    private readonly startNewGameButton:HTMLButtonElement;
    private readonly userCommandText:HTMLInputElement;
    private readonly sendUserCommandButton:HTMLButtonElement;

    private readonly compilationOutputPane:PaneOutput;
    private readonly runtimeOutputPane:PaneOutput;
    private readonly runtimeLogOutputPane:PaneOutput;

    private readonly compiler:TalonCompiler;
    private readonly runtime:TalonRuntime;
    
    private compiledTypes:Type[] = [];

    private static getById<T extends HTMLElement>(name:string){
        return <T>document.getElementById(name);
    }

    constructor(){
        
        this.codePane = TalonIde.getById<HTMLDivElement>("code-pane")!;
        this.gamePane = TalonIde.getById<HTMLDivElement>("game-pane")!;
        this.compilationOutput = TalonIde.getById<HTMLDivElement>("compilation-output")!;
        this.gameLogOutput = TalonIde.getById<HTMLDivElement>("log-pane")!;
        this.compileButton = TalonIde.getById<HTMLButtonElement>("compile")!;
        this.startNewGameButton = TalonIde.getById<HTMLButtonElement>("start-new-game")!;
        this.userCommandText = TalonIde.getById<HTMLInputElement>("user-command-text")!;
        this.sendUserCommandButton = TalonIde.getById<HTMLButtonElement>("send-user-command");
        
        this.compileButton.addEventListener('click', e => this.compile());
        this.startNewGameButton.addEventListener('click', e => this.startNewGame());
        this.sendUserCommandButton.addEventListener('click', e => this.sendUserCommand());

        this.compilationOutputPane = new PaneOutput(this.compilationOutput);
        this.runtimeOutputPane = new PaneOutput(this.gamePane);
        this.runtimeLogOutputPane = new PaneOutput(this.gameLogOutput);

        this.compiler = new TalonCompiler(this.compilationOutputPane);
        this.runtime = new TalonRuntime(this.runtimeOutputPane, this.runtimeLogOutputPane);
    }

    private sendUserCommand(){
        const command = this.userCommandText.value;
        this.runtime.sendCommand(command);
    }

    private compile(){
        const code = this.codePane.innerText;

        this.compilationOutputPane.clear();
        this.compiledTypes = this.compiler.compile(code);
    }

    private startNewGame(){
        this.runtimeOutputPane.clear();
        this.runtimeLogOutputPane.clear();

        if (this.runtime.loadFrom(this.compiledTypes)){
            this.runtime.start();
        }
    }
}