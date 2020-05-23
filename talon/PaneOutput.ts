import { IOutput } from "./runtime/IOutput";
import { ILogOutput } from "./runtime/ILogOutput";

export class PaneOutput implements IOutput, ILogOutput{
    constructor(private pane:HTMLDivElement){

    }

    clear(){
        this.pane.innerText = "";
    }

    debug(line: string): void {
        this.pane.innerText += line + "\n";
        this.pane.scrollTo(0, this.pane.scrollHeight);
    }

    write(line: string): void {
        this.pane.innerText += line + "\n";
        this.pane.scrollTo(0, this.pane.scrollHeight);
    }
}