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
    static readonly contains = "contains";
    static readonly say = "say";
    static readonly directions = "directions";
    static readonly moving = "moving";
    static readonly taking = "taking";
    static readonly inventory = "inventory";
    static readonly can = "can";
    static readonly reach = "reach";
    static readonly by = "by";
    static readonly going = "going";
    static readonly and = "and";
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