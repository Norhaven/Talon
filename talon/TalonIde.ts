import { TalonCompiler } from "./compiler/TalonCompiler";

import { PaneOutput } from "./PaneOutput";

import { TalonRuntime } from "./runtime/TalonRuntime";

export class TalonIde{
    gamePane:HTMLDivElement;

    constructor(){
        console.log("Creating IDE");
        this.gamePane = <HTMLDivElement> document.getElementById("game-pane");

        const button = document.getElementById("compile");
        
        button?.addEventListener('click', e => {
            this.run();
        });
    }

    run(){
        
        console.log("RUNNING");
    const compiler = new TalonCompiler();

    const types = compiler.compile("");

    const userOutput = new PaneOutput(this.gamePane);

    const runtime = new TalonRuntime(userOutput, undefined);

    runtime.loadFrom(types);
    runtime.sendCommand("");
    
    return "Compiled";
    }
}