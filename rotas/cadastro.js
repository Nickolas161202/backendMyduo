const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const jwt = require('jsonwebtoken')
const pg = require('pg')


const pool = new pg.Pool({connectionString:process.env.DATABASE_URL})

router.post('/', (req, res, release) => {
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send({message:"Conexão não autorizada", erro: err.message})
        }
       client.query('select * from usuarios where email = $1', [req.body.email], (error, result) => {
            if (error) {
                return res.status(401).send('Operação não autorizada')
            }

            if (result.rowCount > 0) {
                return res.status(200).send('Registro já existe')
            }
            bcrypt.hash(req.body.senha, 10, (error, hash) => {              
                var sql = 'insert into usuarios(nome, email, senha, perfil) values ($1,$2,$3, $4)'
                client.query(sql, [req.body.nome, req.body.email, hash, req.body.perfil], (error, result) => {
                    release()
                    if (error) {
                        return res.status(403).send({message:'operação não permitida' , erro: error.message})
                    }
                    return res.status(201).send({
                        mensagem: 'criado com sucesso',
                        status: 201
                    })
                })
            })
        })
        
    })
})


module.exports = router