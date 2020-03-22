import { TalonCompiler } from "./compiler/TalonCompiler";

import { PaneOutput } from "./PaneOutput";

import { TalonRuntime } from "./runtime/TalonRuntime";
import { Type } from "./common/Type";

export class TalonIde{
    private readonly codePane:HTMLDivElement;
    private readonly gamePane:HTMLDivElement;
    private readonly compilationOutput:HTMLDivElement;
    private readonly gameLogOutput:HTMLDivElement;
    private readonly example1Button:HTMLButtonElement;
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
        this.example1Button = TalonIde.getById<HTMLButtonElement>("example1")!;
        this.compileButton = TalonIde.getById<HTMLButtonElement>("compile")!;
        this.startNewGameButton = TalonIde.getById<HTMLButtonElement>("start-new-game")!;
        this.userCommandText = TalonIde.getById<HTMLInputElement>("user-command-text")!;
        this.sendUserCommandButton = TalonIde.getById<HTMLButtonElement>("send-user-command");
        
        this.example1Button.addEventListener('click', e => this.loadExample());
        this.compileButton.addEventListener('click', e => this.compile());
        this.startNewGameButton.addEventListener('click', e => this.startNewGame());
        this.sendUserCommandButton.addEventListener('click', e => this.sendUserCommand());
        this.userCommandText.addEventListener('keyup', e => {
            if (e.keyCode == 13) { // enter key
                this.sendUserCommand();
            }
        });

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

    private loadExample(){
            this.codePane.innerText = 
                "say \"This is the start.\".\n\n" +
                
                "understand \"look\" as describing. \n" +
                "understand \"north\" as directions. \n" +
                "understand \"go\" as moving. \n" +
                "understand \"take\" as taking. \n" +
                "understand \"inv\" as inventory. \n" +
                "understand \"drop\" as dropping. \n\n" +

                "an Inn is a kind of place. \n" +
                "it is where the player starts. \n" +
                "it is described as \"The inn is a cozy place, with a crackling fire on the hearth. An open door to the north leads outside.\" and if it contains 1 Coin then say \"There's also a coin here.\" else say \"There is just dust.\".\n" +
                "it contains 1 Coin.\n" + 
                "it can reach the inn by going \"north\". \n" +
                "it has a \"value\" that is 1. \n" +
                "when the player exits: \n" +
                "say \"Goodbye!\"; \n" +
                "set \"value\" to 2; \n" +
                "and then stop. \n\n" +
                
                "a inn is a kind of place. \n" +
                "it is described as \"It's an inn.\". \n" +
                "it can reach the test by going \"north\". \n" +
                "when the player enters:\n" +
                "say \"You walk into the inn.\"; \n" +
                "say \"It looks deserted.\"; \n" +
                "and then stop. \n\n" +

                "say \"This is the middle.\".\n\n" +
                
                "a Coin is a kind of item. \n" +
                "it is described as \"It's a small coin.\".\n\n" +
                
                "say \"This is the end.\".\n";
    }
}