const express = require('express')
const app = express()
const cors = require('cors')
const cadastro  = require("./rotas/cadastro")
const port = process.env.port



app.use(express.json())
app.use(cors)

app.use('/cadastro',  cadastro)

app.listen(port, ()=>{
    console.log(`Executando em http://localhost:${port}`);
})