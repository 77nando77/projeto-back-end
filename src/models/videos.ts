export class Video {
    constructor(
        private id: string,
        private title: string,
        private duration: number,
        private uploadedAt: string
    ){}
    
    public getId(){
        return this.id
    }
    public setId(newId:string):void{
        this.id = newId
    }

    public getTitle(){
        return this.title
    }
    public setTitle(newTitle:string):void{
        this.title = newTitle
    }

    public getDuration(){
        return this.duration
    }
    public setDuration(newDuration:number):void{
        this.duration = newDuration
    }

    public getUploadedAt(){
        return this.uploadedAt
    }
    public setUploadedAt(newUploadedAt:string):void{
        this.uploadedAt = newUploadedAt
    }

}