import { IPaneAnalyzer } from "./IPaneAnalyzer";
import { CaretPosition } from "../CaretPosition";

export class CodePaneAnalyzer implements IPaneAnalyzer{
    private caretRow:number = 0;
    private caretColumn:number = 0;

    get currentCaretPosition(): CaretPosition{
        return new CaretPosition(this.caretRow, this.caretColumn);
    }

    get currentPane():HTMLDivElement{
        return this.pane;
    }

    constructor(private readonly pane:HTMLDivElement){
        pane.addEventListener("keyup", e => this.updateCurrentCaretPosition());
        pane.addEventListener("click", e => this.updateCurrentCaretPosition());
    }

    private updateCurrentCaretPosition(){
        var sel = document.getSelection() as any; // Using 'any' because 'modify' isn't officially supported.

        if (sel.toString().length > 0){
            return;
        }

        sel.modify("extend", "backward", "lineboundary");
        var position = sel.toString().length as number;
        
        if(sel.anchorNode != undefined) {
            sel.collapseToEnd();
        }
        
        this.caretColumn = position;

        sel = document.getSelection() as any;
        sel.modify("extend", "backward", "documentboundary");

        this.caretRow = ((sel.toString().substring(0,)).split("\n")).length;

        if(sel.anchorNode != undefined) {
            sel.collapseToEnd();
        }
    }
}