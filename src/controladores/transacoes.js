const { contas, saques, depositos, transferencias } = require('../dados/bancodedados')
const { encontrarConta, validarSenha } = require('./validacoes')


const depositarValor = (req, res) => {
    const { numero_conta, valor } = req.body

    if (!numero_conta || !valor) {
        return res.status(400).json({
            "mensagem": "O número da conta e o valor são obrigatórios!"
        })
    }

    encontrarConta(numero_conta)
    if (!contaEncontrada) {
        return res.status(400).json({
            "mensagem": "Conta não encontrada."
        })
    }


    if (valor <= 0) {
        return res.status(400).json({
            "mensagem": "Insira um valor válido."
        })
    }

    contaEncontrada.saldo += valor

    const registroDeposito = {
        "data": new Date().toLocaleString(),
        numero_conta,
        valor
    }
    depositos.push(registroDeposito)


    return res.status(204).json()
}


const sacarValor = (req, res) => {
    const { numero_conta, valor, senha } = req.body
    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({
            "mensagem": "O número da conta, o valor e a senha são obrigatórios!"
        })
    }

    encontrarConta(numero_conta)
    if (!contaEncontrada) {
        return res.status(400).json({
            "mensagem": "Conta não encontrada."
        })
    }

    if (!validarSenha(contaEncontrada, senha)) {
        return res.status(404).json({
            "mensagem": "Senha inválida."
        })
    }

    if (valor > contaEncontrada.saldo) {
        return res.status(404).json({
            "mensagem": "Saldo insuficiente."
        })
    }

    contaEncontrada.saldo -= valor

    const registroSaque = {
        "data": new Date().toLocaleString(),
        numero_conta,
        valor
    }
    saques.push(registroSaque)

    return res.status(204).json()
}


const transferirValor = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({
            "mensagem": "O número da conta de origem e destino, valor e senha são obrigatórios!"
        })
    }

    const contaOrigem = contas.find(conta => conta.numero === Number(numero_conta_origem))
    const contaDestino = contas.find(conta => conta.numero === Number(numero_conta_destino))

    if (!contaOrigem) {
        return res.status(400).json({
            "mensagem": "Conta de origem informada não existe."
        })
    }

    if (!contaDestino) {
        return res.status(400).json({
            "mensagem": "Conta de destino informada não existe."
        })
    }


    if (!validarSenha(contaOrigem, senha)) {
        return res.status(404).json({
            "mensagem": "Senha inválida."
        })
    }

    if (valor > contaOrigem.saldo) {
        return res.status(404).json({
            "mensagem": "Saldo insuficiente."
        })
    }

    contaOrigem.saldo -= valor
    contaDestino.saldo += valor

    const registroTransferencia = {
        "data": new Date().toLocaleString(),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }
    transferencias.push(registroTransferencia)

    return res.status(204).json()
}


module.exports = {
    depositarValor,
    sacarValor,
    transferirValor
}