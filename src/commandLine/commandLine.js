import { futimes } from 'fs'
import { connect } from 'http2'
import * as readline from 'readline'
import { executeCommand } from '../commands/commands.js'
//const { resolve } = require('path');


const rl = readline.createInterface(process.stdin, process.stdout)

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

export const getCommands = (currUser, fileSystem, currentDirUrl, currentDir = null) => new Promise ((resolve, reject) => {
    rl.stdoutMuted = false
    
    if (currentDir == null) {
        currentDir = fileSystem
    }

    rl.question(currentDirUrl, (command) => {
        command = command.split(" ")
        if (command[0] === "mkdir" || command[0] === "rm") {
            [fileSystem, currentDir] = executeCommand(currUser, fileSystem, currentDir, currentDirUrl, command[0], command[1])
        } else if (command[0] === "cd"){
            [currentDir, currentDirUrl] = executeCommand(currUser, fileSystem, currentDir, currentDirUrl, command[0], command[1])
            
        } else {
            executeCommand(currUser, fileSystem, currentDir, currentDirUrl, command[0])
        }
        getCommands(currUser, fileSystem, currentDirUrl, currentDir)
    })


}) 

