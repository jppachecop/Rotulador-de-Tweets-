const client = require ('../connection');

//criação de um usuário
exports.create = async function (req, res, next) {

	if(req.body.email == '' || req.body.password == ''){   	
		res.render('signup', {message: 'E-mail ou password não foram informados!'});
		return;
    }

    try{
    	//await aguarda a resolução da promessa
		const result = await checkEmail(req.body.email);

		if(result.rowCount > 0){
			res.render('signup', {message: 'Email já existente'});
			return;
		}

		const validate = validateEmail(req.body.email);

		if(req.body.password.length < 6 || !validate){
			res.render('signup', {message: 'E-mail e/ou senha inválidos'});
			return;
		}

		//também está esperando uma promessa
		await client.query('INSERT INTO tweets_schema.login(email, password) VALUES($1, $2)', [req.body.email, req.body.password]);
       	res.redirect('/');
	}
	//caso ocorra um erro em relação ao acesso ao banco de dados
		catch(e){
			//console.log(e)
			next('1');
		}

};

//validação do email
const validateEmail = (email) => {
	const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
	return emailRegex.test(email);
};

//busca do e-mail no banco de dados
const checkEmail = (email) => {
	const checkE = client.query('SELECT id FROM tweets_schema.login WHERE email LIKE $1', [email]);
	return checkE;
};
