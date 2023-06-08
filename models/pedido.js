const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  items: [{
    cardapioItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cardapio',
      required: true
    },
    quantidade: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pendente', 'em preparação', 'pronto'],
    default: 'pendente'
  }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;