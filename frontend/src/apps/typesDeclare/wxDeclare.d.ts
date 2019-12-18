interface WXAPILIST {
    requestSubscribeMessage(obj: {
        tmplIds: Array<string>
        success?(res: any): void
        fail?(res: any): void
        complete?(): void
    })
    env: {USER_DATA_PATH: string}
    getFileSystemManager(): FileSystemManager
}

interface FileSystemManager{
    writeFileSync(filePath: string, data: string|ArrayBuffer, encoding: 'binary' | 'utf-8')
    appendFileSync(filePath: string, data: string|ArrayBuffer, encoding: 'binary' | 'utf-8')
}

declare var wx: WXAPILIST;