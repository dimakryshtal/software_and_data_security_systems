import { getCommands, getName, getPassword } from "./commandLine/commandLine.js"
import { users } from "./security/users.js"
import { existsSync } from "fs"
import { loadFileSystem, createFileSystem } from "./data/fileSystem.js"


const main = async () => {
    let userFound = null
    createFileSystem()
    
    while(userFound === null) {
        const name = await getName()
        const password = await getPassword()
        if(users.some(user => user.name === name && user.password === password)) {
            userFound = name
            console.log("success")
            console.log(name)
        }
    }
    let fileSystem = loadFileSystem()

    getCommands(userFound, fileSystem, "homeDir\\")


}

main()

