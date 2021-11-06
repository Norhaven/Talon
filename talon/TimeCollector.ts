import { ILog } from "./ILog";
import { ITimeOutput } from "./ITimeOutput";
import { TimeSnapshot } from "./TimeSnapshot";

export class TimeCollector implements ITimeOutput{
    private readonly times = new Map<string, TimeSnapshot[]>();

    constructor(private readonly log:ILog){

    }

    markTimeFor(snapshot:TimeSnapshot): void {
        const values = this.getOrAddValuesFor(snapshot.title);

        values.push(snapshot);

        this.log.writeStructured("[{EventKind}] {Title} {Time}s {@Snapshot}", "TIME", snapshot.title, snapshot.durationInSeconds, snapshot);
    }

    private getOrAddValuesFor(title:string){
        if (this.times.has(title)){
            return this.times.get(title)!;
        }

        const values:TimeSnapshot[] = [];

        this.times.set(title, values);

        return values;
    }
}