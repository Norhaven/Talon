import { TimeSnapshot } from "./TimeSnapshot";

export interface ITimeOutput{
    markTimeFor(snapshot:TimeSnapshot):void;
}