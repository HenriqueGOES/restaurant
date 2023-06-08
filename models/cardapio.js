const mongoose = require('mongoose');

const cardapioSchema = new mongoose.Schema(
    {
    nome:String, 
    descricao: String, 
    preco:Number
});

const Cardapio = mongoose.model('Cardapio', cardapioSchema);

module.exports = Cardapio;