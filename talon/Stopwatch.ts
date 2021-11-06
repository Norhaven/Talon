import { IPerformanceRuler } from "./IPerformanceRuler";
import { ITimeOutput } from "./ITimeOutput";
import { TimeSnapshot } from "./TimeSnapshot";

export class Stopwatch{
    private static output:ITimeOutput;
    private static currentMeasurements:TimeSnapshot[] = [];
    private static ruler:IPerformanceRuler;

    static initialize(output:ITimeOutput, ruler:IPerformanceRuler){
        Stopwatch.output = output;
        Stopwatch.currentMeasurements = [];
        Stopwatch.ruler = ruler;
    }

    static measure<T>(title:string, measuredCall:()=>T){
        const inProgress = TimeSnapshot.start(title, Stopwatch.ruler);
        Stopwatch.currentMeasurements.push(inProgress);

        try{
            return measuredCall();
        } finally{
            const snapshot = inProgress.stop();

            Stopwatch.currentMeasurements.pop();
            Stopwatch.output.markTimeFor(snapshot);
        }
    }
}