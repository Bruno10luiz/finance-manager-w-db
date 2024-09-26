import express from "express"
import userRoutes from "./routes/finance.js"
import cors from "cors"

const app = express()

app.use(express.json())

app.use(cors())

app.get("/", (_, res) => {
    res.json({ message: "API está funcionando" })
})

app.use("/items", userRoutes)

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')

})

