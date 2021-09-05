import { GlobalEvents } from "../../library/GlobalEvents";
import { RuntimeAny } from "./RuntimeAny";

export class RuntimeGlobalEvents extends RuntimeAny{
    parentTypeName = GlobalEvents.parentTypeName;
    typeName = GlobalEvents.typeName;
}