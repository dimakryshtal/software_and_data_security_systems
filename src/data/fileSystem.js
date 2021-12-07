import {readFileSync, writeFileSync} from 'fs'
import { createRequire } from "module";
export const require = createRequire(import.meta.url);


export const createFileSystem = () => {
    const fileSystemData = require("./fileSystem.json")

    writeFileSync("EncodedData", JSON.stringify(fileSystemData), { flag: 'w' })
}

export const loadFileSystem = () => {
    const file = readFileSync("EncodedData")
    const json = JSON.parse(file)
    return json
}

export const saveFileSystem = (json) => {
    writeFileSync("./data/fileSystem.json", JSON.stringify(json))
}

export const updateFileSystem = (json, oldDir, newDir) => {
    const jsonString = JSON.stringify(json);
    const oldDirString = JSON.stringify(oldDir)
    const newDirString = JSON.stringify(newDir)
    const newJson = jsonString.replace(oldDirString, newDirString)

    return JSON.parse(newJson)
}