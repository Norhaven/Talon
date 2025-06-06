interface Indexable{
    [key:string]:any;
}

export class Keywords{
    
    static readonly an = "an";
    static readonly a = "a";
    static readonly the = "the";
    static readonly is = "is";
    static readonly kind = "kind";
    static readonly of = "of";
    static readonly place = "place";
    static readonly item = "item";
    static readonly it = "it";
    static readonly has = "has";
    static readonly if = "if";
    static readonly description = "description";
    static readonly understand = "understand";
    static readonly as = "as";
    static readonly describing = "describing";
    static readonly described = "described";
    static readonly where = "where";
    static readonly player = "player";
    static readonly starts = "starts";
    static readonly completes = "completes";
    static readonly ends = "ends";
    static readonly fails = "fails";
    static readonly wins = "wins";
    static readonly contains = "contains";
    static readonly contain = "contain";
    static readonly say = "say";
    static readonly directions = "directions";
    static readonly moving = "moving";
    static readonly move = "move";
    static readonly taking = "taking";
    static readonly inventory = "inventory";
    static readonly can = "can";
    static readonly reach = "reach";
    static readonly by = "by";
    static readonly going = "going";
    static readonly and = "and";
    static readonly or = "or";
    static readonly then = "then";
    static readonly else = "else";
    static readonly when = "when";
    static readonly enters = "enters";
    static readonly exits = "exits";
    static readonly stop = "stop";
    static readonly dropping = "dropping";
    static readonly that = "that";
    static readonly set = "set";
    static readonly to = "to";
    static readonly decoration = "decoration";
    static readonly visible = "visible";
    static readonly not = "not";
    static readonly observed = "observed";
    static readonly continue = "continue";
    static readonly true = "true";
    static readonly false = "false";
    static readonly taken = "taken";
    static readonly dropped = "dropped";
    static readonly using = "using";
    static readonly used = "used";
    static readonly with = "with";
    static readonly opening = "opening";
    static readonly closing = "closing";
    static readonly opened = "opened";
    static readonly closed = "closed";
    static readonly stateful = "stateful";
    static readonly abort = "abort";
    static readonly event = "event";
    static readonly be = "be";
    static readonly creature = "creature";
    static readonly also = "also";
    static readonly known = "known";
    static readonly combining = "combining";
    static readonly combined = "combined";
    static readonly replace = "replace";
    static readonly menu = "menu";
    static readonly option = "option";
    static readonly selected = "selected";
    static readonly presses = "presses";
    static readonly show = "show";
    static readonly hide = "hide";
    static readonly options = "options";
    static readonly called = "called";
    static readonly value = "value";
    static readonly this = "this";
    static readonly quit = "quit";
    static readonly add = "add";
    static readonly subtract = "subtract";
    static readonly from = "from";
    static readonly giving = "giving";
    static readonly given = "given";
    static readonly give = "give";
    static readonly anything = "anything";
    static readonly accepts = "accepts";
    static readonly everything = "everything";
    static readonly grouped = "grouped";
    static readonly group = "group";
    static readonly any = "any";
    static readonly listed = "listed";
    static readonly game = "game";
    static readonly holding = "holding";
    static readonly hold = "hold";
    static readonly held = "held";
    static readonly holds = "holds";
    static readonly empty = "empty";
    static readonly will = "will";
    static readonly cancel = "cancel";
    static readonly goes = "goes";
    static readonly players = "player's";
    static readonly in = "in";
    static readonly remove = "remove";
    static readonly its = "its";
    static readonly less = "less";
    static readonly greater = "greater";
    static readonly than = "than";

    static getAll():Set<string>{
        type KeywordProperties = keyof Keywords;

        const allKeywords = new Set<string>();

        const names = Object.getOwnPropertyNames(Keywords);

        for(let keyword of names){
            const value = (Keywords as Indexable)[keyword];

            if (typeof value === "string" && value != "Keywords"){
                allKeywords.add(value);
            }
        }

        return allKeywords;
    }
}