import { IOutput } from "./runtime/IOutput";

export class PaneOutput implements IOutput{
    constructor(private pane:HTMLDivElement){

    }

    write(line: string): void {
        this.pane.innerHTML += line;
    }
}