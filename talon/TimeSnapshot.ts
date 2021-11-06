import { IPerformanceRuler } from "./IPerformanceRuler";

export class TimeSnapshot{
    static start(title:string, ruler:IPerformanceRuler){
        const id = Math.random().toString();
        ruler.mark(id);
        return new TimeSnapshot(id, title, ruler);
    }

    get durationInSeconds(){
        return this.durationInMilliseconds / 1000;
    }

    private constructor(private readonly id:string, public readonly title:string, private readonly ruler:IPerformanceRuler, public readonly durationInMilliseconds = 0){

    }

    stop(){
        const endMark = `${this.id}-end`;
        this.ruler.mark(endMark);

        const duration = this.ruler.measure(this.id, endMark);

        return new TimeSnapshot(this.id, this.title, this.ruler, duration);
    }
}