const Sequelize = require('sequelize');           //configuração com o banco de dados
const sequelize = new Sequelize('node_exemplo','root','',{    //metodo de conexão/usuario=root e senha = ''
    host: '127.0.0.1', //do xampp
    dialect: 'mysql', //qual tipo de banco que estamos trabalhando
    define: { //opcional
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true

    },
    logging: false
})       

/*
//testando a conexão com o banco
sequelize.authenticate().then(function(){ //se deu certo
    console.log('Conectado no banco com sucesso!');
}).catch(function(err){ //se deu errrado
    console.log('Falha ao se conectar:'+err);
})
*/

module.exports = {Sequelize, sequelize};