import { Any } from "./Any";

export class Enumerator{
    static typeName = "~enumerator";
    static parentTypeName = Any.typeName;

    static moveNext = "~moveNext";
    static current = "~current";
}