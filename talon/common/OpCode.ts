export enum OpCode{
    NoOp,
    Print,
    LoadString,
    NewInstance,
    ParseCommand,
    HandleCommand,
    ReadInput,
    GoTo,
    Return,
    BranchRelative,
    BranchRelativeIfFalse,
    Concatenate,
    LoadNumber,
    LoadField,
    LoadProperty,
    LoadInstance,
    LoadLocal,
    LoadThis,
    InstanceCall,
    StaticCall,
    ExternalCall
}