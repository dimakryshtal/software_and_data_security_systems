import { saveFileSystem, updateFileSystem} from "../data/fileSystem.js"
import { startTextEditor } from "../commandLine/commandLine.js"
import chalk from "chalk"


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

export const executeCommand = (user, fileSystem, currentDir, currentDirUrl, command, value = "") => new Promise(async(resolve, reject) => {
    switch(command) {
        case "pwd":
            console.log("\nPath:", currentDirUrl, "\n")
            resolve()
            
            break
        case "ls": {
            let filesAndDirs = currentDir.filesAndDirs
            const filteredDirsAndFiles = filesAndDirs.filter(obj => obj.readRights.includes(user))
            for(let obj of filteredDirsAndFiles) {
                if (obj.type === "directory"){
                    console.log(chalk.red(obj.name)) 
                } else {
                 console.log(chalk.yellow(obj.name))
                }
            }
        }
        resolve()
        break
        case "cd": {
            if (value === "..") {
                resolve(findDirectoryInFileSystem(fileSystem, currentDirUrl))       
            } else {
                let filesAndDirs = currentDir.filesAndDirs
                let directory = filesAndDirs.find(obj => obj.name === value) 
                if(directory !== undefined) {
                    resolve([directory, currentDirUrl + `${directory.name}\\`])
                } else {
                    console.log("The directory does not exit")
                }
            }
            break
        }
        case "mkdir": {
            const filesAndDirs = currentDir.filesAndDirs
            const oldDirsAndFiles = currentDir.filesAndDirs
            const newDir = {
                name : value,
                type: "directory",
                readRights: ["admin"],
                writeRights: ["admin"],
                filesAndDirs: []
            }
            if (user !== "admin") {
                newDir.readRights.push(name)
                newDir.writeRights.push(name)
            }
            filesAndDirs.push(newDir)
            currentDir.filesAndDirs = filesAndDirs
            updateFileSystem(fileSystem, oldDirsAndFiles, filesAndDirs)
            saveFileSystem(fileSystem)
            resolve([fileSystem, currentDir])
            break
        }
        case "vi": {
            const filesAndDirs = currentDir.filesAndDirs
            const oldDirsAndFiles = currentDir.filesAndDirs
            let getFile, index 
            getFile = filesAndDirs.find((obj, i) => {
                if (obj.name === value) {
                    index = i
                    return obj
                }
            })
            let text = (getFile === undefined ? "" : getFile.content)
            text = await startTextEditor(text)
            const newDir = {
                name : value,
                type: "file",
                readRights: ["admin"],
                writeRights: ["admin"],
                content: text
            }
            if (user !== "admin") {
                newDir.readRights.push(name)
                newDir.writeRights.push(name)
            }
            if (index !== undefined) {
                filesAndDirs[index] = newDir
            } else {
                filesAndDirs.push(newDir)
            }
            currentDir.filesAndDirs = filesAndDirs
            updateFileSystem(fileSystem, oldDirsAndFiles, filesAndDirs)
            saveFileSystem(fileSystem)
            resolve([fileSystem, currentDir])
            
            break
        }
        case "rm": {
            const filesAndDirs = currentDir.filesAndDirs
            const oldDirsAndFiles = currentDir.filesAndDirs
            const filteredArray = filesAndDirs.filter(obj => obj.name !== value)
            currentDir.filesAndDirs = filteredArray
            updateFileSystem(fileSystem, oldDirsAndFiles, filesAndDirs)
            saveFileSystem(fileSystem)
            resolve([fileSystem, currentDir])
            break
        }
        case "q": {
            saveFileSystem(fileSystem)
            break
        }
        default:
            console.log(`Incorrect command: ${command}`)
            resolve()
            break
    }
})

