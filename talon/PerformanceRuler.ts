import { IPerformanceRuler } from "./IPerformanceRuler";

export class PerformanceRuler implements IPerformanceRuler{
    mark(name: string): void {
        performance.mark(name);
    }

    measure(startMarkName: string, endMarkName: string): number {        
        const measurementName = `${startMarkName}-measure`;
        performance.measure(measurementName, startMarkName, endMarkName);

        const measurement = performance.getEntriesByName(measurementName)[0];

        return measurement.duration;
    }
}