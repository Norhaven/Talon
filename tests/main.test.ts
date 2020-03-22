import { TalonCompiler } from '../talon/compiler/TalonCompiler';
import { PaneOutput } from '../talon/PaneOutput';
import { TalonRuntime } from '../talon/runtime/TalonRuntime';
import { ConsoleOutput } from '../talon/ConsoleOutput';
import { ConsoleLogOutput } from '../talon/ConsoleLogOutput';

describe('run', () => {
    // it('everything', () => {
    //     const compiler = new TalonCompiler();

    // const types = compiler.compile("");

    // const output = new ConsoleOutput();
    
    // const runtime = new TalonRuntime(output);

    // runtime.loadFrom(types);
    // runtime.sendCommand("");
    // });

    it('type compile', () => {
        const compiler = new TalonCompiler(new ConsoleOutput());
        const runtime = new TalonRuntime(new ConsoleOutput(), new ConsoleLogOutput());

        const types = compiler.compile(
            "say \"This is the start.\"." +
            
            "understand \"look\" as describing. " +
            "understand \"north\" as directions. " +
            "understand \"go\" as moving. " +
            "understand \"take\" as taking. " +
            "understand \"inv\" as inventory. " +
            "understand \"drop\" as dropping. " +

            "a test is a kind of place. " +
            "it is where the player starts. " +
            "it is described as \"It looks like a room.\" and if it contains 1 Coin then say \"There's also a coin here.\" else say \"There is just dust.\"." +
            "it contains 1 Coin." + 
            "it can reach the inn by going \"north\". " +
            "it has a \"value\" that is 1. " +
            "when the player exits: " +
            "say \"Goodbye!\"; " +
            "set \"value\" to 2; " +
            "and then stop. " +
            
            "a inn is a kind of place. " +
            "it is described as \"It's an inn.\". " +
            "it can reach the test by going \"north\". " +
            "when the player enters:" +
            "say \"You walk into the inn.\"; " +
            "say \"It looks deserted.\"; " +
            "and then stop. " +

            "say \"This is the middle.\"." +
            
            "a Coin is a kind of item. " +
            "it is described as \"It's a small coin.\"." +
            
            "say \"This is the end.\".");

        runtime.loadFrom(types);
        runtime.start();
        runtime.sendCommand("look test");
        runtime.sendCommand("take Coin");
        runtime.sendCommand("look test");
        runtime.sendCommand("inv");
        runtime.sendCommand("drop Coin");
        runtime.sendCommand("inv");
        runtime.sendCommand("look test");
        runtime.sendCommand("go north");
        runtime.sendCommand("look inn");
    });
});