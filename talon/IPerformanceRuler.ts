export interface IPerformanceRuler{
    mark(name:string):void;
    measure(startMarkName:string, endMarkName:string):number;
}