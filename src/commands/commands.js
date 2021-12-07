import { saveFileSystem, updateFileSystem} from "../data/fileSystem.js" 
import { require } from "../data/fileSystem.js"
const chalk = require("chalk")


const findDirectoryInFileSystem = (fileSystem, dirUrl) => {
    let newDirUrl = "homeDir\\"
    let arrayOfDirNames = dirUrl.split("\\").slice(0, -2)
    arrayOfDirNames.shift()
    while (arrayOfDirNames.length != 0) {
        let nextDir = arrayOfDirNames.shift()
        newDirUrl += `${nextDir.name}\\`
        fileSystem = fileSystem.find(obj => obj.name === nextDir)
    }
    return [fileSystem, newDirUrl]
}

export const executeCommand = (user, fileSystem, currentDir, currentDirUrl, command, value = "") => {
    switch(command) {
        case "pwd":
            console.log("\nPath:", currentDirUrl, "\n")
            break
        case "ls": {
            let dirsAndFiles = currentDir.filesAndDirs
            const filteredDirsAndFiles = dirsAndFiles.filter(obj => obj.readRights.includes(user))
            for(let obj of filteredDirsAndFiles) {
                if (obj.type === "directory"){
                    console.log(chalk.red(obj.name)) 
                } else {
                    console.log(chalk.yellow(obj.name))
                }
            }
        }
        break
        case "cd": {
            if (value === "..") {
                return findDirectoryInFileSystem(fileSystem, currentDirUrl)         
            } else {
                let dirsAndFiles = currentDir.filesAndDirs
                let directory = dirsAndFiles.find(obj => obj.name === value) 
                if(directory !== undefined) {
                    return [directory, currentDirUrl + `${directory.name}\\`]
                } else {
                    console.log("The directory does not exit")
                }
            }
        }
        break
        case "mkdir": {
            const dirsAndFiles = currentDir.filesAndDirs
            const oldDirsAndFiles = currentDir.filesAndDirs
            const newDir = {
                name : value,
                type: "directory",
                readRights: ["admin", user],
                writeRights: ["admin", user],
                filesAndDirs: []
            }
            dirsAndFiles.push(newDir)
            currentDir.dirsAndFiles = dirsAndFiles
            updateFileSystem(fileSystem, oldDirsAndFiles, dirsAndFiles)
            saveFileSystem(fileSystem)
            return [fileSystem, currentDir]
        }
        case "vi":
            break
        case "rm": {
            const dirsAndFiles = currentDir.filesAndDirs
            const oldDirsAndFiles = currentDir.filesAndDirs
            const filteredArray = dirsAndFiles.filter(obj => obj.name !== value)
            currentDir.filesAndDirs = filteredArray
            updateFileSystem(fileSystem, oldDirsAndFiles, dirsAndFiles)
            saveFileSystem(fileSystem)
            return [fileSystem, currentDir]
        }
        case "q": {
            saveFileSystem(fileSystem)
            break
        }
        default:
            console.log(`Incorrect command: ${command}`)
    }
}

