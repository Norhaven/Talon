import { TalonCompiler } from "./compiler/TalonCompiler";

import { PaneOutput } from "./PaneOutput";

import { TalonRuntime } from "./runtime/TalonRuntime";
import { Type } from "./common/Type";
import { AnalysisCoordinator } from "./ide/AnalysisCoordinator";
import { CodePaneAnalyzer } from "./ide/analyzers/CodePaneAnalyzer";
import { CodePaneStyleFormatter } from "./ide/formatters/CodePaneStyleFormatter";
import { FileHandle } from "fs/promises";

export class TalonIde{

    private static readonly TalonCodeFileDescription = "Talon Code";
    private static readonly TalonCodeFileExtension = ".tln";

    private readonly codePane:HTMLDivElement;
    private readonly gamePane:HTMLDivElement;
    private readonly compilationOutput:HTMLDivElement;
    private readonly gameLogOutput:HTMLDivElement;
    private readonly openButton:HTMLButtonElement;
    private readonly saveButton:HTMLButtonElement;
    private readonly example1Button:HTMLButtonElement;
    private readonly compileButton:HTMLButtonElement;
    private readonly startNewGameButton:HTMLButtonElement;
    private readonly userCommandText:HTMLInputElement;
    private readonly sendUserCommandButton:HTMLButtonElement;
    private readonly caretPosition:HTMLDivElement;

    private readonly compilationOutputPane:PaneOutput;
    private readonly runtimeOutputPane:PaneOutput;
    private readonly runtimeLogOutputPane:PaneOutput;

    private readonly codePaneAnalyzer:CodePaneAnalyzer;
    private readonly analysisCoordinator:AnalysisCoordinator;

    private readonly codePaneStyleFormatter:CodePaneStyleFormatter;

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
        this.openButton = TalonIde.getById<HTMLButtonElement>("open");
        this.saveButton = TalonIde.getById<HTMLButtonElement>("save");
        this.example1Button = TalonIde.getById<HTMLButtonElement>("example1")!;
        this.compileButton = TalonIde.getById<HTMLButtonElement>("compile")!;
        this.startNewGameButton = TalonIde.getById<HTMLButtonElement>("start-new-game")!;
        this.userCommandText = TalonIde.getById<HTMLInputElement>("user-command-text")!;
        this.sendUserCommandButton = TalonIde.getById<HTMLButtonElement>("send-user-command");
        this.caretPosition = TalonIde.getById<HTMLDivElement>("caret-position");
        
        this.saveButton.addEventListener('click', async e => await this.saveCodeFile(this.codePane.innerText));
        this.openButton.addEventListener('click', async e => await this.openCodeFile(e));
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
        
        this.compilationOutputPane = new PaneOutput(this.compilationOutput);
        this.runtimeOutputPane = new PaneOutput(this.gamePane);
        this.runtimeLogOutputPane = new PaneOutput(this.gameLogOutput);

        this.codePaneAnalyzer = new CodePaneAnalyzer(this.codePane);
        this.analysisCoordinator = new AnalysisCoordinator(this.codePaneAnalyzer, this.caretPosition);

        this.codePaneStyleFormatter = new CodePaneStyleFormatter(this.codePane);

        this.compiler = new TalonCompiler(this.compilationOutputPane);
        this.runtime = new TalonRuntime(this.runtimeOutputPane, this.runtimeLogOutputPane);
    }

    private sendUserCommand(){
        const command = this.userCommandText.value;
        this.runtime.sendCommand(command);

        this.userCommandText.value = "";
    }

    private compile(){
        const code = this.codePane.innerText;

        this.compilationOutputPane.clear();
        this.compiledTypes = this.compiler.compile(code);
    }

    private startNewGame(){
        this.runtimeOutputPane.clear();
        this.runtimeLogOutputPane.clear();

        this.runtime.stop();

        if (this.runtime.loadFrom(this.compiledTypes)){
            this.runtime.start();
        }
    }

    private async openCodeFile(event:Event){
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

        const handles = await (window as any).showOpenFilePicker(options);
        const file = await handles[0].getFile();

        this.codePane.innerText = await file.text();
    }

    private async saveCodeFile(contents:string) {
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
  
        const fileHandle = await (window as any).showSaveFilePicker(options);
        const writable = await (fileHandle as any).createWritable();
        await writable.write(contents);
        await writable.close();
    }

    private loadExample(){
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