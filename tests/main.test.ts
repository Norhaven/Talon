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
            "say \"This is the start.\".\n\n" +
            
            "understand \"look\" as describing. \n" +
            "understand \"north\" as directions. \n" +
            "understand \"go\" as moving. \n" +
            "understand \"take\" as taking. \n" +
            "understand \"inv\" as inventory. \n" +
            "understand \"drop\" as dropping. \n\n" +

            "a test is a kind of place. \n" +
            "it is where the player starts. \n" +
            "it is described as \"It looks like a room.\" and if it contains 1 Coin then \"There's also a coin here.\" else \"There is just dust.\".\n" +
            "it contains 1 Coin, 1 fireplace.\n" + 
            "it can reach the inn by going \"north\". \n" +
            "it has a \"value\" that is 1. \n" +
            "when the player exits: \n" +
            "say \"Goodbye!\"; \n" +
            "set \"value\" to 2; \n" +
            "and then stop. \n\n" +
            
            "an inn is a kind of place. \n" +
            "it is described as \"It's an inn.\". \n" +
            "it can reach the test by going \"north\". \n" +
            "it contains 1 fireplace. \n" +
            "when the player enters:\n" +
            "say \"You walk into the inn.\"; \n" +
            "say \"It looks deserted.\"; \n" +
            "and then stop. \n\n" +

            "a fireplace is a kind of decoration. \n" +
            "it is observed as \"There is a small fireplace in the corner.\". \n" +
            "it is described as \"The fireplace is burning brightly. It's full of fire.\". \n\n" +

            "say \"This is the middle.\".\n\n" +
            
            "a Coin is a kind of item. \n" +
            "it is described as \"It's a small coin.\".\n\n" +
            
            "say \"This is the end.\".\n");

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
        runtime.sendCommand("look fireplace");
    });
});