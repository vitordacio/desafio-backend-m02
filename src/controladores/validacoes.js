const { contas } = require('../dados/bancodedados')

const validarCPF = (cpfInformado) => {
    return cpfEncontrado = contas.find(conta => conta.usuario.cpf === cpfInformado)
}

const validarEmail = (email) => {
    return emailEncontrado = contas.find(conta => conta.usuario.email === email)
}

const encontrarConta = (numero_conta) => {
    return contaEncontrada = contas.find(conta => conta.numero === Number(numero_conta))
}

const validarSenha = (conta, senha) => {
    if (conta.usuario.senha !== senha) {
        return false
    }
    return true
}

module.exports = {
    validarCPF,
    validarEmail,
    encontrarConta,
    validarSenha
}