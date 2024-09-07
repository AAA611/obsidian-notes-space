const fs = require('fs')
const path = require('path')

const ignoreList = ['node_modules', '.git', 'dist', '.obsidian', '.trash', 'Assets', 'Excalidraw', '我的简历', 'index.md']

fs.readdir(process.cwd(), (err, fileList) => {
    if (!err) {
        fileList.forEach(file => {
            if (ignoreList.includes(file)) {
                return
            }
            if (isDir(file)) {
                processDir(file)
            }
        })
    }
})

function getFilenameWithoutExt(file) {
    return path.basename(file, path.extname(file))
}

function processDir(dirPath) {
    fs.readdir(dirPath, (err, fileList) => {
        if (fileList.length === 0) return
        const indexFilePath = path.resolve(dirPath, './index.md')
        // const indexFileStream = fs.createWriteStream(indexFilePath, { flag: 'a' })
        let hasWrite = false
        fileList.forEach(file => {
            const filePath = path.resolve(dirPath, file)
            if (isDir(filePath)) {
                processDir(filePath)
            } else if (isUnCompleteFile(filePath)) {
                hasWrite = true
                // indexFileStream.write(`[[${getFilenameWithoutExt(file)}]]` + '\n')
            }
        })
        // console.log('📘', dirPath, hasWrite);

        fs.unlink(indexFilePath, (err) => {
            if (!err) {
                console.log('✅', indexFilePath);
            } else {
                console.log('❌', indexFilePath, err);
            }
        })
        return
        // indexFileStream.end()
        if (fs.existsSync(indexFilePath) && !hasWrite) {
            // console.log('📘', dirPath, hasWrite, indexFilePath);

            fs.unlink(indexFilePath, (err) => {
                if (!err) {
                    console.log('✅', indexFilePath);
                } else {
                    console.log('❌', indexFilePath, err);
                }
            })
        }
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