interface WXAPILIST{
    requestSubscribeMessage(obj: {
        tmplIds: Array<string>
        success?(res: any): void
        fail?(res: any): void
        complete?(): void
    })
}

declare var wx: WXAPILIST;