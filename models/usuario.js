const mongoose = require('mongoose');

var usuarioSchema = new mongoose.Schema(
    {
      //_id: String,
      nome: String,
      senha: String,
      email: String
    }
  );

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;