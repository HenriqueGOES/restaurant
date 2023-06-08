const jwt = require('jsonwebtoken');

const secreto = "exemplo"; // Substitua pela sua chave secreta

function geradorToken(usuario) {
  const payload = {
    id: usuario._id,
    nome: usuario.nome,
    email: usuario.email
  };

  const token = jwt.sign(payload, secreto, { expiresIn: '1h' });

  return token;
}

function verificarToken(token) {
  try {
    const decoded = jwt.verificar(token, secreto);
    return decoded;
  } catch (error) {
    throw new Error('Token inválido');
  }
}

module.exports = {
  geradorToken, verificarToken
};