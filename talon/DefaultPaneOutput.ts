import { IOutput } from "./runtime/IOutput";

export class DefaultPaneOutput implements IOutput{
        constructor(private pane:HTMLDivElement){
    
        }
    
        clear(){
            this.pane.innerHTML = "";
        }

    write(line: string): void {
        this.pane.innerHTML += line + "<br />";
        this.pane.scrollTo(0, this.pane.scrollHeight);
    }
}