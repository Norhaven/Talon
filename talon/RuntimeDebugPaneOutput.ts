import { IOutput } from "./runtime/IOutput";

export class RuntimeDebugPaneOutput implements IOutput{
    constructor(private pane:HTMLDivElement){

    }

    clear(){
        this.pane.innerHTML = "";
    }

    write(line: string): void {

        if (line.startsWith('.')){
            const parts = line.split(' ');
            
            parts[0] = `<strong>${parts[0]}</strong>`;

            line = parts.join(' ');
        } 

        this.pane.innerHTML += line + "<br />";
        this.pane.scrollTo(0, this.pane.scrollHeight);
    }
}