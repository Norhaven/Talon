import { IPaneAnalyzer } from "./analyzers/IPaneAnalyzer";

export class AnalysisCoordinator {
    constructor(private readonly analyzer: IPaneAnalyzer, private readonly output: HTMLDivElement) {                    
        for(const pane of this.analyzer.panes){
            pane.addEventListener("keyup", e => this.update());
            pane.addEventListener("click", e => this.update());
        }
    }

    private update(){
        this.updateCaretPositionValues();
    }

    private updateCaretPositionValues(){
        const position = this.analyzer.currentCaretPosition;
        const formattedPosition = `Line ${position.row}, Column ${position.column}`;

        this.output.innerHTML = formattedPosition;
    }
}