const db = require('./db');  //vai vim pelo dados do sequilize do export feito em db.js

const Usuario = db.sequelize.define('usuario',{        //nossa tabela tem 3 colunas
    id: {
        type: db.Sequelize.INTEGER, //do tipo inteiro
        autoIncrement: true,   // sempre colocar um id a mais a cada registro
        allowNull: false,           //que o campo não pode ser nulo
        primaryKey: true
    },
    nome: {
        type: db.Sequelize.STRING, //do tipo string
        allowNull: false,  
    },
    email: {
        type: db.Sequelize.STRING, //do tipo string
        allowNull: false, 
    }
})
     //pode ser .update ou para destroir
Usuario.sync();        // que agente quer sicronizar com o banco de dados/ se não existir ele cria essa tabela

module.exports = Usuario;