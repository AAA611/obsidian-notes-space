const fs = require('fs')
const path = require('path')

fs.readdir('.', (err, fileList) => {
    fileList.forEach(file => {
        if (isDir(file)) {
            processDir(file)
        }
    })
})

function getFilenameWithoutExt(file) {
    return path.basename(file, path.extname(file))
}

function processDir(dirPath) {
    const indexFileStream = fs.createWriteStream('./index.md', { flag: 'a' })
    fs.readdir(dirPath, (err, fileList) => {
        fileList.forEach(file => {
            const filePath = path.resolve(dirPath, file)
            if (isDir(filePath)) {
                processDir(filePath)
            } else if (isUnCompleteFile(filePath)) {
                indexFileStream.write(`[[${getFilenameWithoutExt(file)}]]` + '\n')
            }
        })
    })
}

function isDir(path) {
    return fs.statSync(path).isDirectory()
}

function isFile(path) {
    return fs.statSync(path).isFile()
}

function isUnCompleteFile(path) {
    return isFile(path) && path.indexOf('❌') > -1
}