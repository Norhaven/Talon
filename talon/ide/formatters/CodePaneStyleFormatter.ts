import { IPaneFormatter } from "./IPaneFormatter";

export class CodePaneStyleFormatter implements IPaneFormatter{
    get currentPane(): HTMLDivElement{
        return this.pane;
    }

    constructor(private readonly pane:HTMLDivElement){
        this.pane.addEventListener('keydown', e => {
            if (e.key === "Tab"){
                e.preventDefault();
            }
        });

        this.pane.addEventListener('keyup', e => {
            if (e.key === "Tab"){
                e.preventDefault();
                let selection = window.getSelection()!;
                selection.collapseToStart();
                let range = selection.getRangeAt(0);
                range.insertNode(document.createTextNode("    "));
                selection.collapseToEnd();
            }
        });
    }
}