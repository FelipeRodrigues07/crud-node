//express
const express = require('express');
const app = express();
const hbs =require('express-handlebars');
const bodyParser = require('body-parser'); //modulo para pegar as info, vem com express
const session = require('express-session');
//config
const PORT = process.env.Port || 3000;

//configuração do handlebars
app.engine('hbs',hbs.engine({
    extname: 'hbs', // em vez de usar .handlebars
    defaultLayout: 'main'
}));app.set('view engine','hbs');


app.use(express.static('public'));// trabalhar com paginas estatiscas css

app.use(bodyParser.urlencoded({extended:false}));//rodar o bodyparser junto com express

//importar Models usuarios(banco de dados,tabelas,usuario.js)
const Usuario = require('./models/Usuario');

//configuração das sessions
app.use(session({
   secret: 'CriarUmaChaveQualquer1234!',
   resave: false,
   saveUninitialized: true
}))


app.get('/',(req,res)=>{           
   if(req.session.errors){
      var arrayErros = req.session.errors;
      req.session.errors = "";
      return  res.render('index',{NavActiveCad:true, error:arrayErros});
   }   
   if(req.session.success){
      req.session.success = false;
      return  res.render('index',{NavActiveCad:true, MsgSuccess:true});
   }   
   res.render('index',{NavActiveCad:true});
});

app.get('/users',(req,res)=>{   
   Usuario.findAll().then((valores)=>{  //receber os valores do banco de dados
      //console.log(valores.map(valores => valores.toJSON()));
      if(valores.length > 0){
        return res.render('users',{NavActiveUsers:true, table:true, usuarios:valores.map(valores => valores.toJSON()) });
      }else{
         res.render('users',{NavActiveUsers:true, table:false});
      }
   }).catch(()=>{
      console.log(`Houve um problema: ${err}`);
   })            
   //res.render('users',{NavActiveUsers:true});
});

app.post('/editar',(req,res)=>{   
   var id = req.body.id;
   Usuario.findByPk(id).then((dados)=>{     //puxar um registro unico findBYPk
      return res.render('editar',{error:false, id: dados.id, nome: dados.nome, email: dados.email});
   }).catch((err)=>{
      console.log(err);
      return res.render('editar',{error:true, problema: 'Não é possivel editar esse registro'});
   })           
  // res.render('editar');
});

app.post('/cad',(req,res)=>{              
   //valores vindos do formulario
    var nome = req.body.nome; //lá do formulario name
    var email = req.body.email; 


   //array que vai conter os erros
   const erros =[];

   //Remover os espaços em brancos antes e depois
   nome = nome.trim();
   email = email.trim();

   //limpar o nome de caracteres especiais (apenas letras)
   nome = nome.replace(/[^A-zÀ-ú\s]/gi,''); //expressão regular,regex
   nome = nome.trim();
   //console.log(nome);

   //verificar se está vazio ou não o nosso campo
   if(nome =='' || typeof nome == undefined || nome == null){
      erros.push({mensagem: "Campo nome não pode ser vazio!"})
   }

   //verificar se o campo nome é valido (apenas letras)
   if(!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)){
      erros.push({mensagem:"Nome inválido!"});
   }

    //verificar se está vazio ou não o nosso campo
    if(email =='' || typeof email == undefined || email == null){
      erros.push({mensagem: "Campo email não pode ser vazio!"})
   }

   //verificar se email é valido
   if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      erros.push({mensagem:"Campo email inválido!"});
   }

   if(erros.length > 0){              //se tiver pelo menos 1 erro ele coloca na seção erro
      console.log(erros);
      req.session.errors = erros;
      req.session.sucess = false;    //o sucesso foi falso
      return res.redirect('/');  //redirecionar o usuário para a pagina inicial
   }

   //sucesso se não tiver erro
   //salvar no banco de dados
   Usuario.create({
      nome: nome,           // a colunas da nossa tabela recebe um valor
      email: email.toLowerCase()
   }).then(function(){ // se deu certo
      console.log('Cadastrado com sucesso!');
      req.session.success = true;
      return res.redirect('/');
   }).catch(function(erro){
      console.log(`Ops, houve um erro: ${erro}`)
   })

  

})

app.post('/update',(req,res)=>{
   //valores vindos do formulario
   var nome = req.body.nome; //lá do formulario name
   var email = req.body.email; 


  //array que vai conter os erros
  const erros =[];

  //Remover os espaços em brancos antes e depois
  nome = nome.trim();
  email = email.trim();

  //limpar o nome de caracteres especiais (apenas letras)
  nome = nome.replace(/[^A-zÀ-ú\s]/gi,''); //expressão regular,regex
  nome = nome.trim();
  //console.log(nome);

  //verificar se está vazio ou não o nosso campo
  if(nome =='' || typeof nome == undefined || nome == null){
     erros.push({mensagem: "Campo nome não pode ser vazio!"})
  }

  //verificar se o campo nome é valido (apenas letras)
  if(!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)){
     erros.push({mensagem:"Nome inválido!"});
  }

   //verificar se está vazio ou não o nosso campo
   if(email =='' || typeof email == undefined || email == null){
     erros.push({mensagem: "Campo email não pode ser vazio!"})
  }

  //verificar se email é valido
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
     erros.push({mensagem:"Campo email inválido!"});
  }

  if(erros.length > 0){              //se tiver pelo menos 1 erro ele manda por parametro
     console.log(erros);
     return res.status(400).send({status:400, erro: erros});
  }

  //sucesso se não tiver erro
  //atualizar registro no banco de dados
  //metodo do sequelize
  Usuario.update({
      nome: nome,
      email: email.toLowerCase()
      },
      {
         where: {  //do sequelize onde fazer essa alteração
            id: req.body.id
         }
      }).then((resultado)=>{
         console.log(resultado);
         return res.redirect('/users');
      }).catch((err)=>{
         console.log(err);
      })
})

app.post('/del', (req, res) => {
   Usuario.destroy({
      where: {
         id: req.body.id
      }
   }).then((retorno)=>{
      return  res.redirect('/users')
   }).catch((err)=>{
      console.log(err);
   })
});



app.listen(PORT, ()=>{
    console.log('Servidor rodando em http://localhost:' +PORT)
});

