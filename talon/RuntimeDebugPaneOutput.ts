import { IOutput } from "./runtime/IOutput";

export class RuntimeDebugPaneOutput implements IOutput{

    get AreLogsDisabled():boolean {
        return this.disableLogs.checked;
    }

    constructor(private pane:HTMLDivElement, private disableLogs:HTMLInputElement){

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

        if (line.startsWith('.')){
            const parts = line.split(' ');
            
            parts[0] = `<strong>${parts[0]}</strong>`;

            line = parts.join(' ');
        } 

        this.pane.innerHTML += line + "<br />";
        this.pane.scrollTo(0, this.pane.scrollHeight);
    }
}