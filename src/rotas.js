const express = require('express')
const { listarContas, adicionarContas, atualizarUsuario, deletarConta, consultarSaldo, consultarExtrato } = require('./controladores/contas')
const { depositarValor, sacarValor, transferirValor } = require('./controladores/transacoes')

const rotas = express()


rotas.post('/transacoes/depositar', depositarValor)
rotas.post('/transacoes/sacar', sacarValor)
rotas.post('/transacoes/transferir', transferirValor)

rotas.get('/contas', listarContas)
rotas.post('/contas', adicionarContas)
rotas.get('/contas/saldo', consultarSaldo)
rotas.get('/contas/extrato', consultarExtrato)
rotas.put('/contas/:numeroConta/usuario', atualizarUsuario)
rotas.delete('/contas/:numeroConta', deletarConta)




module.exports = rotas