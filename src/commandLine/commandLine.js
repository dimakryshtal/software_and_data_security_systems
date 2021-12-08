import * as readline from 'readline'
import { executeCommand } from '../commands/commands.js'


const rl = readline.createInterface(process.stdin, process.stdout)


readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);

export const getName = () => new Promise((resolve, reject) => {
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    rl.question("Enter your username: ", userName => {
        resolve(userName)
    });  
})

export const getPassword = () => new Promise((resolve, reject) => {
    const question = "Enter your password: "
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    
    rl.stdoutMuted = true
    rl.question(question, pw => {
        readline.cursorTo(process.stdout, 0, 0)
        readline.clearScreenDown(process.stdout)
        resolve(pw)
    });

    rl._writeToOutput = function _writeToOutput(stringToWrite) {
        if (rl.stdoutMuted) {
            rl.output.write("*");

        }

        else
            rl.output.write(stringToWrite);
    };
    
    
})

export const getCommands = (currUser, fileSystem, currentDirUrl, currentDir = null) => {
    
    rl.stdoutMuted = false
    
    if (currentDir == null) {
        currentDir = fileSystem
    }

    rl.question(currentDirUrl, async(command) => {
        command = command.split(" ")
        if (command[0] === "mkdir" || command[0] === "rm" || command[0] == "vi") {
            [fileSystem, currentDir] = await executeCommand(currUser, fileSystem, currentDir, currentDirUrl, command[0], command[1])
        } else if (command[0] === "cd"){
            [currentDir, currentDirUrl] = await executeCommand(currUser, fileSystem, currentDir, currentDirUrl, command[0], command[1])
        } else {
            await executeCommand(currUser, fileSystem, currentDir, currentDirUrl, command[0])
        }
        getCommands(currUser, fileSystem, currentDirUrl, currentDir)
    })

    rl.on("SIGINT", () => {
        
    })
}

export const startTextEditor = (oldString = "") => new Promise((resolve, reject) => {
    let string = oldString
    rl.question(oldString, (inputLine) => {
        string += inputLine
        resolve(string)
    });
    
})

