import { IPaneAnalyzer } from "./analyzers/IPaneAnalyzer";

export class AnalysisCoordinator {
    constructor(private readonly analyzer: IPaneAnalyzer, 
                private readonly output: HTMLDivElement) {                    
        
        analyzer.currentPane.addEventListener("keyup", e => this.update());
        analyzer.currentPane.addEventListener("click", e => this.update());
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