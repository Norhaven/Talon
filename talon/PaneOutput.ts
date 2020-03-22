import { IOutput } from "./runtime/IOutput";
import { ILogOutput } from "./runtime/ILogOutput";

export class PaneOutput implements IOutput, ILogOutput{
    constructor(private pane:HTMLDivElement){

    }

    clear(){
        this.pane.innerHTML = "";
    }

    debug(line: string): void {
        this.pane.innerHTML += line + "</br>";
    }

    write(line: string): void {
        this.pane.innerHTML += line + "</br>";
    }
}