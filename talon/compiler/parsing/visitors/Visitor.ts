import { ParseContext } from "../ParseContext";
import { Expression } from "../expressions/Expression";

export abstract class Visitor{
    abstract visit(context:ParseContext):Expression;
}