import { CaretPosition } from "../CaretPosition";

export interface IPaneAnalyzer{
    panes:HTMLDivElement[];
    currentCaretPosition:CaretPosition;
}