import { TalonCompiler } from "./compiler/TalonCompiler";

import { RuntimeDebugPaneOutput } from "./RuntimeDebugPaneOutput";

import { TalonRuntime } from "./runtime/TalonRuntime";
import { Type } from "./common/Type";
import { AnalysisCoordinator } from "./ide/AnalysisCoordinator";
import { CodePaneAnalyzer } from "./ide/analyzers/CodePaneAnalyzer";
import { CodePaneStyleFormatter } from "./ide/formatters/CodePaneStyleFormatter";
import { DefaultPaneOutput } from "./DefaultPaneOutput";
import { IOutput } from "./runtime/IOutput";
import { LogOutput } from "./LogOutput";
import { ILog } from "./ILog";
import { Log } from "./Log";
import { ConsoleOutput } from "./ConsoleOutput";
import { TimeCollector } from "./TimeCollector";
import { PerformanceRuler } from "./PerformanceRuler";
import { getExampleLibraryCode, getExampleStoryCode, getExampleAdventureCode } from "./TalonExamples";

export class TalonIde{

    private static readonly TalonCodeFileDescription = "Talon Code";
    private static readonly TalonCodeFileExtension = ".tln";

    private readonly codePane:HTMLDivElement;
    private readonly libraryPane:HTMLDivElement;
    private readonly gamePane:HTMLDivElement;
    private readonly compilationOutput:HTMLDivElement;
    private readonly gameLogOutput:HTMLDivElement;
    private readonly gameLogReadableOutput:HTMLDivElement;
    private readonly openButton:HTMLButtonElement;
    private readonly saveButton:HTMLButtonElement;
    private readonly example1Button:HTMLButtonElement;
    private readonly example2Button:HTMLButtonElement;
    private readonly compileButton:HTMLButtonElement;
    private readonly startNewGameButton:HTMLButtonElement;
    private readonly toggleRuntimeLogs:HTMLButtonElement;
    private readonly userCommandText:HTMLInputElement;
    private readonly sendUserCommandButton:HTMLButtonElement;
    private readonly caretPosition:HTMLDivElement;
    private readonly showLibrary:HTMLButtonElement;
    private readonly showCodePane:HTMLButtonElement;
    private readonly disableLogsOption:HTMLInputElement;
    private readonly clearLogsButton:HTMLButtonElement;

    private readonly compilationOutputPane:DefaultPaneOutput;
    private readonly runtimeOutputPane:DefaultPaneOutput;
    private readonly runtimeLogOutputPane:RuntimeDebugPaneOutput;
    private readonly runtimeLogReadableOutputPane:DefaultPaneOutput;
    private readonly logOutput:IOutput;
    private readonly log:ILog;

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
        this.libraryPane = TalonIde.getById<HTMLDivElement>("library-pane")!;
        this.gamePane = TalonIde.getById<HTMLDivElement>("game-pane")!;
        this.compilationOutput = TalonIde.getById<HTMLDivElement>("compilation-output")!;
        this.gameLogOutput = TalonIde.getById<HTMLDivElement>("log-pane")!;
        this.gameLogReadableOutput = TalonIde.getById<HTMLDivElement>("log-pane-readable")!;
        this.openButton = TalonIde.getById<HTMLButtonElement>("open");
        this.saveButton = TalonIde.getById<HTMLButtonElement>("save");
        this.example1Button = TalonIde.getById<HTMLButtonElement>("example1")!;
        this.example2Button = TalonIde.getById<HTMLButtonElement>("example2")!;
        this.compileButton = TalonIde.getById<HTMLButtonElement>("compile")!;
        this.startNewGameButton = TalonIde.getById<HTMLButtonElement>("start-new-game")!;
        this.toggleRuntimeLogs = TalonIde.getById<HTMLButtonElement>("toggle-runtime-logs");
        this.userCommandText = TalonIde.getById<HTMLInputElement>("user-command-text")!;
        this.sendUserCommandButton = TalonIde.getById<HTMLButtonElement>("send-user-command");
        this.caretPosition = TalonIde.getById<HTMLDivElement>("caret-position");
        this.showLibrary = TalonIde.getById<HTMLButtonElement>("show-library");
        this.showCodePane = TalonIde.getById<HTMLButtonElement>("show-code-pane");
        this.disableLogsOption = TalonIde.getById<HTMLInputElement>("disable-logs");
        this.clearLogsButton = TalonIde.getById<HTMLButtonElement>("clear-runtime-logs");
        
        this.saveButton.addEventListener('click', async e => await this.saveCodeFile(this.codePane.innerText));
        this.openButton.addEventListener('click', async e => await this.openCodeFile(e));
        this.example1Button.addEventListener('click', e => this.loadExample1());
        this.example2Button.addEventListener('click', e => this.loadExample2());
        this.compileButton.addEventListener('click', e => this.compile());
        this.startNewGameButton.addEventListener('click', e => this.startNewGame());
        this.toggleRuntimeLogs.addEventListener('click', e => this.toggleRuntimeLogView());
        this.sendUserCommandButton.addEventListener('click', e => this.sendUserCommand());
        this.showLibrary.addEventListener('click', e => this.toggleLibraryView());
        this.showCodePane.addEventListener('click', e => this.toggleCodePaneView());
        this.clearLogsButton.addEventListener('click', e => this.clearLogs());
        this.userCommandText.addEventListener('keyup', e => {
            if (e.key === "Enter") { 
                this.sendUserCommand();
            }
        });

        this.allowUserToSendCommands(false);

        this.loadLibrary();
        this.loadExample2();

        this.compilationOutputPane = new DefaultPaneOutput(this.compilationOutput);
        this.runtimeOutputPane = new DefaultPaneOutput(this.gamePane);
        this.runtimeLogOutputPane = new RuntimeDebugPaneOutput(this.gameLogOutput, this.disableLogsOption);
        this.runtimeLogReadableOutputPane = new DefaultPaneOutput(this.gameLogReadableOutput, this.disableLogsOption);

        this.codePaneAnalyzer = new CodePaneAnalyzer(this.codePane);
        this.analysisCoordinator = new AnalysisCoordinator(this.codePaneAnalyzer, this.caretPosition);

        this.codePaneStyleFormatter = new CodePaneStyleFormatter(this.codePane);

        this.logOutput = new LogOutput();
        this.log = new Log(this.runtimeLogOutputPane, this.logOutput, this.runtimeLogReadableOutputPane, new ConsoleOutput());
        
        this.compiler = new TalonCompiler(this.compilationOutputPane);
        this.runtime = new TalonRuntime(this.runtimeOutputPane, this.log, new TimeCollector(this.log), new PerformanceRuler());
    }

    private sendUserCommand(){
        const command = this.userCommandText.value;
        
        if (!this.runtime.sendCommand(command)){
            this.allowUserToSendCommands(false);
        }

        this.userCommandText.value = "";
    }

    private allowUserToSendCommands(allow:boolean){
        this.userCommandText.disabled = !allow;
        this.sendUserCommandButton.disabled = !allow;
    }

    private toggleLibraryView(){
        this.codePane.style.display = 'none';
        this.libraryPane.style.display = 'block';
    }

    private toggleCodePaneView(){
        this.codePane.style.display = 'block';
        this.libraryPane.style.display = 'none';
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

    private clearLogs(){
        this.gameLogOutput.innerText = "";
        this.gameLogReadableOutput.innerText = "";
    }

    private compile(){
        const library = this.libraryPane.innerText;
        const code = this.codePane.innerText;

        const source = `${library} ${code}`;

        this.compilationOutputPane.clear();
        this.compiledTypes = this.compiler.compile(source);
    }

    private startNewGame(){
        this.runtimeOutputPane.clear();
        this.runtimeLogOutputPane.clear();

        this.runtime.stop();

        if (this.runtime.loadFrom(this.compiledTypes)){
            this.runtime.start();
        }

        this.userCommandText.value = "look";

        this.allowUserToSendCommands(true);
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

    private loadLibrary(){
        this.libraryPane.innerText = getExampleLibraryCode();
    }

    private loadExample1(){
        this.codePane.innerText = getExampleStoryCode();
    }

    private loadExample2(){
        this.codePane.innerText = getExampleAdventureCode();
    }
}