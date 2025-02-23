import { IOutput } from "./runtime/IOutput";
import { Stopwatch } from "./Stopwatch";

export class DefaultPaneOutput implements IOutput{

    get AreLogsDisabled():boolean {
        return this.disableLogs?.checked == true;
    }

    constructor(private pane:HTMLDivElement, private disableLogs?:HTMLInputElement){

    }
    
    clear(){
        this.pane.innerHTML = "";
    }

    writeError(error: any, line: string, ...parameters: any[]): void {
        if (this.AreLogsDisabled){
            return;
        }

        this.pane.innerHTML += line + "<br />";
        this.pane.scrollTo(0, this.pane.scrollHeight);
    }

    write(line: string): void {
        if (this.AreLogsDisabled){
            return;
        }

        Stopwatch.measure("DefaultPaneOutput", () => {
            this.pane.innerHTML += line + "<br />";
            this.pane.scrollTo(0, this.pane.scrollHeight);
        });
    }
}