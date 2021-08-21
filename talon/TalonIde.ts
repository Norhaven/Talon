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
    private readonly gameLogReadableOutput:HTMLDivElement;
    private readonly openButton:HTMLButtonElement;
    private readonly saveButton:HTMLButtonElement;
    private readonly example1Button:HTMLButtonElement;
    private readonly compileButton:HTMLButtonElement;
    private readonly startNewGameButton:HTMLButtonElement;
    private readonly toggleRuntimeLogs:HTMLButtonElement;
    private readonly userCommandText:HTMLInputElement;
    private readonly sendUserCommandButton:HTMLButtonElement;
    private readonly caretPosition:HTMLDivElement;

    private readonly compilationOutputPane:PaneOutput;
    private readonly runtimeOutputPane:PaneOutput;
    private readonly runtimeLogOutputPane:PaneOutput;
    private readonly runtimeLogReadableOutputPane:PaneOutput;

    private readonly codePaneAnalyzer:CodePaneAnalyzer;
    private readonly analysisCoordinator:AnalysisCoordinator;

    private readonly codePaneStyleFormatter:CodePaneStyleFormatter;

    private readonly compiler:TalonCompiler;
    private readonly runtime:TalonRuntime;

    private areLogsReadableFormat = true;
    
    private compiledTypes:Type[] = [];

    private static getById<T extends HTMLElement>(name:string){
        return <T>document.getElementById(name);
    }

    constructor(){
        
        this.codePane = TalonIde.getById<HTMLDivElement>("code-pane")!;
        this.gamePane = TalonIde.getById<HTMLDivElement>("game-pane")!;
        this.compilationOutput = TalonIde.getById<HTMLDivElement>("compilation-output")!;
        this.gameLogOutput = TalonIde.getById<HTMLDivElement>("log-pane")!;
        this.gameLogReadableOutput = TalonIde.getById<HTMLDivElement>("log-pane-readable")!;
        this.openButton = TalonIde.getById<HTMLButtonElement>("open");
        this.saveButton = TalonIde.getById<HTMLButtonElement>("save");
        this.example1Button = TalonIde.getById<HTMLButtonElement>("example1")!;
        this.compileButton = TalonIde.getById<HTMLButtonElement>("compile")!;
        this.startNewGameButton = TalonIde.getById<HTMLButtonElement>("start-new-game")!;
        this.toggleRuntimeLogs = TalonIde.getById<HTMLButtonElement>("toggle-runtime-logs");
        this.userCommandText = TalonIde.getById<HTMLInputElement>("user-command-text")!;
        this.sendUserCommandButton = TalonIde.getById<HTMLButtonElement>("send-user-command");
        this.caretPosition = TalonIde.getById<HTMLDivElement>("caret-position");
        
        this.saveButton.addEventListener('click', async e => await this.saveCodeFile(this.codePane.innerText));
        this.openButton.addEventListener('click', async e => await this.openCodeFile(e));
        this.example1Button.addEventListener('click', e => this.loadExample());
        this.compileButton.addEventListener('click', e => this.compile());
        this.startNewGameButton.addEventListener('click', e => this.startNewGame());
        this.toggleRuntimeLogs.addEventListener('click', e => this.toggleRuntimeLogView());
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
        this.runtimeLogReadableOutputPane = new PaneOutput(this.gameLogReadableOutput);

        this.codePaneAnalyzer = new CodePaneAnalyzer(this.codePane);
        this.analysisCoordinator = new AnalysisCoordinator(this.codePaneAnalyzer, this.caretPosition);

        this.codePaneStyleFormatter = new CodePaneStyleFormatter(this.codePane);

        this.compiler = new TalonCompiler(this.compilationOutputPane);
        this.runtime = new TalonRuntime(this.runtimeOutputPane, this.runtimeLogOutputPane, this.runtimeLogReadableOutputPane);
    }

    private sendUserCommand(){
        const command = this.userCommandText.value;
        this.runtime.sendCommand(command);

        this.userCommandText.value = "";
    }

    private toggleRuntimeLogView(){
        if (this.areLogsReadableFormat){
            this.gameLogReadableOutput.style.display = 'block';
            this.gameLogOutput.style.display = 'none';
        } else {
            this.gameLogReadableOutput.style.display = 'none';
            this.gameLogOutput.style.display = 'block';
        }

        this.areLogsReadableFormat = !this.areLogsReadableFormat;
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
            "understand \"drop\" as dropping. \n" +
            "understand \"use\" as using.\n" +
            "understand \"open\" as opening.\n" +
            "understand \"close\" as closing.\n" +
            "understand \"locked\" as stateful.\n\n" +

            "an Inn is a kind of place. \n" +
            "it is where the player starts. \n" +
            "it is described as \"The inn is a cozy place, with a crackling fire on the hearth. An open door to the north leads outside.\" \n" +
            "    and if it contains 1 Coin then \"There's also a coin here.\"; or else \"There is just dust.\"; and then continue.\n" +
            "it contains 1 Fireplace, 1 Chest, 1 Key, 1 Bartender.\n" + 
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
                        
            "a Key is a kind of item.\n" +
            "it is described as \"The key is small but sturdy.\".\n\n" +

            "a Fireplace is a kind of decoration. \n" +
            "it is described as \"The fireplace crackles. It's full of fire.\".\n" +
            "when it is used with a Coin:\n" +
            "    say \"The firelight flickers on the surface of the coin.\";\n" +
            "and then stop.\n\n" +

            "a Chest is a kind of Container.\n" +
            "it is described as \"The chest looks very heavy.\".\n" +
            "it is observed as \"A large chest sits in the corner.\".\n" +
            "it contains 1 Coin.\n" +
            "when it is opened:\n" +            
            "    if it is \"locked\" then\n" +
            "        say \"The lid won't budge.\";\n" +
            "        abort event;\n" +
            "    or else\n" +
            "        say \"The lid creaks with the effort.\";\n" +
            "    and then continue;\n" +
            "and then stop.\n" +
            "when it is closed:\n" +            
            "    say \"The lid slams closed.\";\n" +
            "and then stop.\n" +
            "when it is used with a Key:\n" +
            "    if it is \"opened\" then\n" +
            "        say \"You can't lock it when it's open.\";\n" +
            "        abort event;\n" +
            "    and then continue;\n" +
            "    say \"The key turns easily in the lock.\";\n" +
            "    if it is \"locked\" then\n" +
            "        set it to not \"locked\";\n" +
            "    or else\n" +
            "        set it to \"locked\";\n" +
            "    and then continue;\n" +
            "and then stop.\n\n" +

            "a Container is a kind of decoration.\n" +
            "it is described as \"It's a container.\".\n" +
            "when it is opened:\n" +
            "    if it is \"opened\" then\n" +
            "        say \"It's already open.\";\n" +
            "        abort event;\n" +
            "    and then continue;\n" +
            "and then stop.\n" +
            "when it is closed:\n" +
            "    if it is \"closed\" then\n" +
            "        say \"It's already closed.\";\n" +
            "        abort event;\n" +
            "    and then continue;\n" +
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
            "it is observed as \"You see a coin.\".\n" +
            "when it is taken:\n" +
            "    say \"You got a coin!\";\n" +
            "and then stop.\n" +
            "when it is dropped:\n" +
            "    say \"You put the coin down!\";\n" +
            "and then stop.\n" +
            "when it is used:\n" +
            "    say \"You used the coin somehow!\";\n" +
            "and then stop.\n\n" +

            "a Bartender is a kind of creature.\n" +
            "it is described as \"He's smiling and whistling a tune.\".\n" +
            "it is observed as \"A portly gentleman is behind the bar. He looks up as you come in.\".\n\n" +
                        
            "say \"This is the end.\".\n";
    }
}