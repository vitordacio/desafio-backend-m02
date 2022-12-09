const { validarCPF, validarEmail, encontrarConta, validarSenha } = require('./validacoes')
const { banco, contas, saques, depositos, transferencias } = require('../dados/bancodedados')


const listarContas = (req, res) => {
    const { senha_banco } = req.query
    if (!senha_banco) {
        return res.status(400).json({
            "mensagem": "Você deve informar a senha_banco como query params."
        })
    }
    if (senha_banco !== banco.senha) {
        return res.status(403).json({
            "mensagem": "A senha do banco informada é inválida!"
        })
    }
    return res.json(contas)
}

let idConta = 1
const adicionarContas = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({
            "mensagem": "Todos os campos devem ser informados. (Nome, CPF, Data de Nascimento, Telefone, Email e Senha)"
        })
    }

    validarCPF(cpf)
    if (cpfEncontrado) {
        return res.status(400).json({
            "mensagem": "Já existe uma conta com o cpf informado!"
        })
    }

    validarEmail(email)
    if (emailEncontrado) {
        return res.status(400).json({
            "mensagem": "Já existe uma conta com o e-mail informado!"
        })
    }

    const novaConta = {
        numero: idConta,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }
    contas.push(novaConta)
    idConta++

    return res.status(201).json()
}


const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (isNaN(Number(numeroConta))) {
        return res.status(400).json({
            "mensagem": "O número da conta não é válido."
        })
    }

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({
            "mensagem": "Todos os campos devem ser informados. (Nome, CPF, Data de Nascimento, Telefone, Email e Senha)"
        })
    }

    validarCPF(cpf)
    if (cpfEncontrado) {
        return res.status(400).json({
            "mensagem": "Já existe uma conta com o cpf informado!"
        })
    }
    validarEmail(email)
    if (emailEncontrado) {
        return res.status(400).json({
            "mensagem": "Já existe uma conta com o e-mail informado!"
        })
    }
    encontrarConta(numeroConta)
    if (!contaEncontrada) {
        return res.status(400).json({
            "mensagem": "Conta não encontrada."
        })
    }

    contaEncontrada.usuario.nome = nome
    contaEncontrada.usuario.cpf = cpf
    contaEncontrada.usuario.data_nascimento = data_nascimento
    contaEncontrada.usuario.telefone = telefone
    contaEncontrada.usuario.email = email
    contaEncontrada.usuario.senha = senha

    return res.status(204).json()
}


const deletarConta = (req, res) => {
    const { numeroConta } = req.params

    if (isNaN(Number(numeroConta))) {
        return res.status(400).json({
            "mensagem": "O número da conta não é válido."
        })
    }

    const indiceContaEncontrada = contas.findIndex((conta) => conta.numero === Number(numeroConta))

    if (indiceContaEncontrada < 0) {
        return res.status(400).json({
            "mensagem": "Conta bancária não encontada!"
        })
    }

    if (contas[indiceContaEncontrada].saldo !== 0) {
        return res.status(404).json({
            "mensagem": "A conta só pode ser removida se o saldo for zero!"
        })
    }

    contas.splice(indiceContaEncontrada, 1)

    return res.status(204).json()
}


const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
        return res.status(400).json({
            "mensagem": "O numero_conta e senha devem ser informados como query params."
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

    res.json({
        "saldo": contaEncontrada.saldo
    })
}

const consultarExtrato = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
        return res.status(400).json({
            "mensagem": "O numero_conta e senha devem ser informados como query params."
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



    const relatorio = {
        depositos: depositos.filter(deposito => deposito.numero_conta === numero_conta),
        saques: saques.filter(saque => saque.numero_conta === numero_conta),
        transferenciasEnviadas: transferencias.filter(transferencia => transferencia.numero_conta_origem === numero_conta),
        transferenciasRecebidas: transferencias.filter(transferencia => transferencia.numero_conta_destino === numero_conta)
    }

    res.json(relatorio)
}



module.exports = {
    listarContas,
    adicionarContas,
    atualizarUsuario,
    deletarConta,
    consultarSaldo,
    consultarExtrato
}