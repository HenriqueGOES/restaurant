const express = require ("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Cardapio = require('./models/cardapio');
const mongoose = require("mongoose");
const Usuario = require('./models/usuario')

const app = express();
app.use(bodyParser.json());


mongoose.connect("mongodb+srv://rikee:adm123@projetoback.orfnhhj.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    console.log("Conectado ao Mongo");
}).catch((error) => {
    console.log("Erro",error);
});

  app.get('/usuario', (req, res) => {
    Usuario.find()
    .then((usuarios) => {
        res.json(usuarios)
    })
    .catch((error) => {
        console.error('Erro ao obter usuário', error);
    });
  });
  
  /*app.post('/usuarios', async (req, res) => {
    const { nome, senha, email } = req.body;
    // Criar o novo usuário
      const newUsuario = await Usuario.create({
        nome,
        senha,
        email
      });
      res.redirect("/usuario", newUsuario);

    });*/
  app.post('/usuarios/registrados', async (req, res) => {
    const { nome, senha, email } = req.body;
  
    try {
      // Verificar se o usuário já existe
      const existeUsuario = await Usuario.findOne({ email });
      if (existeUsuario) {
        return res.status(409).json({ error: 'O usuário já está registrado' });
      }

      // Criar o novo usuário
      const newUsuario = await Usuario.create({
        nome,
        senha: hashedSenha,
        email
      });
  
      // Criptografar a senha
      const hashedSenha = await bcrypt.hash(senha, 10);
  
      // Gerar token JWT
      const token = jwt.sign({ id: newUsuario._id }, 'exemplo', { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  });

  app.post('/usuarios/login', async (req, res) => {
    const { email, senha } = req.body;
  
    try {
      // Verificar se o usuário existe
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
  
      // Verificar a senha
      const SenhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!SenhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
  
      // Gerar token JWT
      const token = jwt.sign({ id: usuario._id }, 'exemplo', { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
      res.status(500).json({ error: 'Erro ao autenticar usuário' });
    }
    res.redirect("/usuario");
  }); 

  // Rota para criar um novo item do cardápio
app.post('/cardapio', async (req, res) => {
  const { nome, descricao, preco,} = req.body;

  try {
    const novoItemCardapio = await Cardapio.create({
      nome,
      descricao,
      preco,
      
    });

    res.json(novoItemCardapio);
  } catch (error) {
    console.error('Erro ao criar um novo item do cardápio:', error);
    res.status(500).json({ error: 'Erro ao criar um novo item do cardápio' });
  }
});

  app.get('/', (req, res) => {
    Cardapio.find()
      .then((cardapio) => {
        res.json(cardapio);
      })
      .catch((error) => {
        console.error('Erro ao obter o cardápio:', error);})
      });

      const Pedido = require('./models/pedido');

      /*  Pedido.create({
          usuario: "", // Substitua pelo ID do usuário associado ao pedido
          items: [
            {
              cardapioItemId: "1", // Substitua pelo ID do item do cardápio
              quantidade: 2
            },
            {
              cardapioItemId: "2", // Substitua pelo ID do outro item do cardápio
              quantidade: 1
            }
          ],
          total: 34.50,
          status: 'pendente'
        }).then(() => {
          console.log('Pedido inserido com sucesso.');
        }).catch((error) => {
          console.error('Erro ao inserir pedido:', error);
        });  */

        app.post('/pedido', async (req, res) => {
          const { usuarioId, items } = req.body;
        
          try {
            // Verificar se o usuário existe
            const usuarioExiste = await Usuario.findById(usuarioId);
            if (!usuarioExiste) {
              return res.status(404).json({ error: 'Usuário não encontrado' });
            }
        
            // Verificar se os itens do cardápio existem
            const cardapioItems = await Cardapio.find({ _id: { $in: items.map(item => item.cardapioItemId) } });
            if (cardapioItems.length !== items.length) {
              return res.status(404).json({ error: 'Um ou mais itens do cardápio não encontrados' });
            }
        
            // Calcular o total do pedido
            const total = cardapioItems.reduce((acc, item) => {
              const pedidoItem = items.find(pedidoItem => pedidoItem.cardapioItemId === item._id.toString());
              return acc + item.preco * pedidoItem.quantidade;
            }, 0);
        
            // Criar o novo pedido
            const novoPedido = await Pedido.create({
              usuario: usuarioId,
              items: items,
              total: total,
              status: 'pendente'
            });
        
            res.json(novoPedido);
          } catch (error) {
            console.error('Erro ao criar um novo pedido:', error);
            res.status(500).json({ error: 'Erro ao criar um novo pedido' });
          }
        });



        app.get('/pedidos', (req, res) => {
        Pedido.find()
          .populate('usuario', 'nome')
          .populate('items.cardapioItemId', 'nome')
          .then((pedido) => {
            res.json(pedido);
          })
          .catch((error) => {
            console.error('Erro ao obter os pedidos:', error);
            res.status(500).json({ error: 'Erro ao obter os pedidos' });
          });
      });
      // Rota para visualizar pedidos de um usuário
      app.get('/usuario/:usuarioId/pedido', async (req, res) => {
        const usuarioId = req.params.usuarioId;
      
        try {
          const usuarioPedidos = await Pedido.find({ usuario: usuarioId });
          res.json(usuarioPedidos);
        } catch (error) {
          console.error('Erro ao obter os pedidos do usuário:', error);
          res.status(500).json({ error: 'Erro ao obter os pedidos do usuário' });
        }
      });

     // Rota para atualizar o status de um pedido
     app.put('/pedidos/:pedidoId/status', async (req, res) => {
      const { pedidoId } = req.params;
      const { status } = req.body;
    
      try {
        const pedido = await Pedido.findByIdAndUpdate(
          pedidoId,
          { status },
          { new: true }
        );
    
        res.json(pedido);
      } catch (error) {
        console.error('Erro ao atualizar o status do pedido:', error);
        res.status(500).json({ error: 'Erro ao atualizar o status do pedido' });
      }
    });






const port = 3000;
app.listen(port, () => {
    console.log("Rodandooooo!!")
})