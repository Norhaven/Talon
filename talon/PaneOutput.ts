import { IOutput } from "./runtime/IOutput";
import { ILogOutput } from "./runtime/ILogOutput";

export class PaneOutput implements IOutput, ILogOutput{
    constructor(private pane:HTMLDivElement){

    }

    clear(){
        this.pane.innerHTML = "";
    }

    debug(line: string): void {

        if (line.startsWith('.')){
            const parts = line.split(' ');
            
            parts[0] = `<strong>${parts[0]}</strong>`;

            line = parts.join(' ');
        } 

        this.pane.innerHTML += line + "<br />";
        this.pane.scrollTo(0, this.pane.scrollHeight);
    }

    write(line: string): void {
        this.pane.innerHTML += line + "<br />";
        this.pane.scrollTo(0, this.pane.scrollHeight);
    }
}