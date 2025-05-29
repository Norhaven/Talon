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
import { getExampleLibraryCode, getExamplePlaygroundCode, getExampleAdventureCode } from "./TalonExamples";

export class TalonIde{

    private static readonly TalonCodeFileDescription = "Talon Code";
    private static readonly TalonCodeFileExtension = ".tln";

    private static readonly GlobalPane = "global-code-pane";
    private static readonly PlacesPane = "places-code-pane";
    private static readonly ItemsPane = "items-code-pane";
    private static readonly CreaturesPane = "creatures-code-pane";
    private static readonly DecorationsPane = "decorations-code-pane";
    private static readonly LibraryPane = "library-code-pane";

    private static readonly GlobalButton = "show-global-code-pane";
    private static readonly PlacesButton = "show-places-code-pane";
    private static readonly ItemsButton = "show-items-code-pane";
    private static readonly CreaturesButton = "show-creatures-code-pane";
    private static readonly DecorationsButton = "show-decorations-code-pane";
    private static readonly LibraryButton = "show-library-code-pane";

    private readonly codePanes = new Map<string, HTMLDivElement>();

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

    //private readonly codePaneStyleFormatter:CodePaneStyleFormatter;

    private readonly compiler:TalonCompiler;
    private readonly runtime:TalonRuntime;

    private areLogsReadableFormat = true;
    
    private compiledTypes:Type[] = [];

    private activeCodePane!:HTMLDivElement;

    private static getById<T extends HTMLElement>(name:string){
        return <T>document.getElementById(name);
    }

    constructor(){
        
        this.loadCodePaneFor(
            [TalonIde.GlobalPane, TalonIde.GlobalButton],
            [TalonIde.PlacesPane, TalonIde.PlacesButton],
            [TalonIde.ItemsPane, TalonIde.ItemsButton],
            [TalonIde.CreaturesPane, TalonIde.CreaturesButton],
            [TalonIde.DecorationsPane, TalonIde.DecorationsButton],
            [TalonIde.LibraryPane, TalonIde.LibraryButton]
        );

        this.toggleCodePaneView(TalonIde.GlobalPane);

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
        this.disableLogsOption = TalonIde.getById<HTMLInputElement>("disable-logs");
        this.clearLogsButton = TalonIde.getById<HTMLButtonElement>("clear-runtime-logs");
        
        this.saveButton.addEventListener('click', async e => await this.saveCodeFile(this.activeCodePane.innerText));
        this.openButton.addEventListener('click', async e => await this.openCodeFile(e));
        this.example1Button.addEventListener('click', e => this.loadExample1());
        this.example2Button.addEventListener('click', e => this.loadExample2());
        this.compileButton.addEventListener('click', e => this.compile());
        this.startNewGameButton.addEventListener('click', e => this.startNewGame());
        this.toggleRuntimeLogs.addEventListener('click', e => this.toggleRuntimeLogView());
        this.sendUserCommandButton.addEventListener('click', e => this.sendUserCommand());
        this.clearLogsButton.addEventListener('click', e => this.clearLogs());
        this.userCommandText.addEventListener('keyup', e => {
            if (e.key === "Enter") { 
                this.sendUserCommand();
            }
        });

        this.allowUserToSendCommands(false);
        this.loadExample2();

        this.compilationOutputPane = new DefaultPaneOutput(this.compilationOutput);
        this.runtimeOutputPane = new DefaultPaneOutput(this.gamePane);
        this.runtimeLogOutputPane = new RuntimeDebugPaneOutput(this.gameLogOutput, this.disableLogsOption);
        this.runtimeLogReadableOutputPane = new DefaultPaneOutput(this.gameLogReadableOutput, this.disableLogsOption);

        this.codePaneAnalyzer = new CodePaneAnalyzer(Array.from(this.codePanes.values()));
        this.analysisCoordinator = new AnalysisCoordinator(this.codePaneAnalyzer, this.caretPosition);

        //this.codePaneStyleFormatter = new CodePaneStyleFormatter(this.codePane);

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

    private loadCodePaneFor(...paneNames:[string, string][]){
        for(const [name, buttonName] of paneNames){
            const pane = TalonIde.getById<HTMLDivElement>(name);
            const button = TalonIde.getById<HTMLButtonElement>(buttonName);

            button.addEventListener('click', e => this.toggleCodePaneView(name));

            this.codePanes.set(name, pane);
        }
    }

    private clearAllCodePanes(){
        for(const [_, pane] of this.codePanes){
            pane.innerText = "";
        }
    }

    private setCodePaneTextFor(paneName:string, text:string){
        const pane = this.codePanes.get(paneName);

        if (!pane){
            return;
        }

        pane.innerText = text;
    }

    private getCodePaneTextFor(paneName:string){
        return this.codePanes.get(paneName)?.innerText;
    }

    toggleCodePaneView(paneName:string){
        for(const [name, pane] of this.codePanes){
            if (name == paneName){
                pane.style.display = 'block';
                this.activeCodePane = pane;
            } else {
                pane.style.display = 'none';
            }
        }
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
        const sources = [
            this.getCodePaneTextFor(TalonIde.GlobalPane),
            this.getCodePaneTextFor(TalonIde.PlacesPane),
            this.getCodePaneTextFor(TalonIde.ItemsPane),
            this.getCodePaneTextFor(TalonIde.CreaturesPane),
            this.getCodePaneTextFor(TalonIde.DecorationsPane),
            this.getCodePaneTextFor(TalonIde.LibraryPane)
        ];

        const source = sources.join('\n\n\n');

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

        this.activeCodePane.innerText = await file.text();
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

    private loadExample1(){
        this.clearAllCodePanes();
        this.setCodePaneTextFor(TalonIde.LibraryPane, getExampleLibraryCode());
        this.setCodePaneTextFor(TalonIde.GlobalPane, getExamplePlaygroundCode());
    }

    private loadExample2(){
        this.clearAllCodePanes();
        this.setCodePaneTextFor(TalonIde.LibraryPane, getExampleLibraryCode());

        const adventureCode = getExampleAdventureCode();

        const sectionsRegex = new RegExp(/###(\w+)###/g);
        const sections = Array.from(adventureCode.matchAll(sectionsRegex));
        const sectionsByHeaderAndIndex = sections.map(x => [x.index, x[1]]);

        for(let i = 0, j = 1; i < sectionsByHeaderAndIndex.length; i++, j++){
            const first = sectionsByHeaderAndIndex[i];
            const second = j >= sectionsByHeaderAndIndex.length ? [adventureCode.length - 1] : sectionsByHeaderAndIndex[j];

            const section = adventureCode.substring(Number(first[0]), Number(second[0]));
            const headerEndIndex = section.indexOf("\n") + 1;
            const content = section.substring(headerEndIndex);            
            const paneName = this.getPaneNameFor(first[1].toString());

            this.setCodePaneTextFor(paneName, content);
        }
    }

    private getPaneNameFor(name:string){
        switch(name){
            case "GLOBAL": return TalonIde.GlobalPane;
            case "PLACES": return TalonIde.PlacesPane;
            case "ITEMS": return TalonIde.ItemsPane;
            case "CREATURES": return TalonIde.CreaturesPane;
            case "DECORATIONS": return TalonIde.DecorationsPane;
            case "LIBRARY": return TalonIde.LibraryPane;
            default:
                throw new Error(`Unable to get header name for '${name}'`);
        }
    }
}