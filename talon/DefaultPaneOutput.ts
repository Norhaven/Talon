import { IOutput } from "./runtime/IOutput";
import { Stopwatch } from "./Stopwatch";

export class DefaultPaneOutput implements IOutput{
    constructor(private pane:HTMLDivElement){

    }
    
    clear(){
        this.pane.innerHTML = "";
    }

    writeError(error: any, line: string, ...parameters: any[]): void {
        this.pane.innerHTML += line + "<br />";
        this.pane.scrollTo(0, this.pane.scrollHeight);
    }

    write(line: string): void {
        Stopwatch.measure("DefaultPaneOutput", () => {
            this.pane.innerHTML += line + "<br />";
            this.pane.scrollTo(0, this.pane.scrollHeight);
        });
    }
}