import { Any } from "./Any";

export class GlobalEvents{
    static readonly typeName = "~globalEvents";
    static readonly parentTypeName = Any.typeName;

    static readonly gameStartsEvent = "~event_game_starts";
}