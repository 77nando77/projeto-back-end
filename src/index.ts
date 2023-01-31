import express, { Request, Response } from "express";
import cors from "cors"
import { db } from "./database/knex"
import { Video } from "./models/videos";
import { TVideo } from "./types";

const app = express();

app.use(express.json())

app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get('/ping', (req: Request, res: Response) => {
    res.send("pong!")
})

app.get("/videos", async (req: Request, res: Response) => {
    try {

        const result = await db("videos")

        const videos: Video[] = result.map((video) => new Video(
            video.id,
            video.title,
            video.duration,
            video.uploaded_at
        ))

        res.status(200).send(videos)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/videos", async (req: Request, res: Response) => {
    try {
        const { id, title, duration } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("O id deve ser um texto");
        }

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("o título deve ser um texto");
        }

        if (typeof duration !== "number") {
            res.status(400)
            throw new Error("A duração deve ser um número");
        }

        const [idExist] = await db("videos").where({ id })

        if (idExist) {
            res.status(400)
            throw new Error("O id já existe");
        }

        const newVideo = new Video(
            id,
            title,
            duration,
            new Date().toISOString()
        )

        const newVideoDB:TVideo = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            uploaded_at: newVideo.getUploadedAt()
        }

        await db("videos").insert(newVideoDB)

        res.status(201).send(newVideo)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put("/videos/:id", async (req: Request, res: Response) => {
    try {
        const videoId = req.params.id

        const {id, title, duration} = req.body


        const [video] = await db("videos")

        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("O id deve ser um texto");
            }
        }

        if (title !== undefined) {
            if (typeof title !== "string") {
                res.status(400)
                throw new Error("o título deve ser um texto");
            }
        }

        if (duration !== undefined) {
            if (typeof duration !== "number") {
                res.status(400)
                throw new Error("A duração deve ser um número");
            }
        }

        const newVideo = new Video(
            id || videoId,
            title || video.title ,
            duration || video.duration,
            new Date().toISOString()
        )

        if (video){
            const newVideoDB:TVideo = {
                id: newVideo.getId(),
                title: newVideo.getTitle(),
                duration: newVideo.getDuration(),
                uploaded_at: newVideo.getUploadedAt()
            }
            await db("videos").update(newVideoDB).where({id: videoId})
            res.status(200).send("Vídeo editado com sucesso")
        }else{
            res.status(404).send("Vídeo não encontrado")
        }

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.delete("/videos/:id", async (req: Request, res: Response) =>{
    try {
        const id = req.params.id

        const [existId] = await db("videos").where({id: id})

        if(!existId){
            res.status(400)
            throw new Error("id não existe");
        }

        await db("videos").del().where({id:id})
        res.status(200).send("video deletado com sucesso")

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})