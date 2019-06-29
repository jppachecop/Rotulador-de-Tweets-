const client = require ('../connection');

exports.filterTweets = function(req,res){

	if(!req.body.datIni || !req.body.datFim){
		res.render('filter', {message: 'As datas devem ser informadas!'});
		return;
	}

	const iniDat = new Date(req.body.datIni);
	const fimDat = new Date(req.body.datFim);

	if(Number.isNaN(iniDat.getTime()) || Number.isNaN(fimDat.getTime())){
		res.render('filter', {message: 'Insira datas corretas!'});
		return;
	}

	req.session.datIni = iniDat.toISOString();
	req.session.datFim = fimDat.toISOString();

	req.session.idsLabel = [];

	res.redirect('/labeling');
}

exports.showTweets = async function (req, res, next) {

	//evitar o acesso sem a informação dos filtros
	if(!req.session.datIni || !req.session.datFim){
		res.redirect('/filter');
		return;
	}

	if(!req.session.idsLabel){
		req.session.idsLabel = [];
	}

	try{

		//Seleção dos id's e texto dos tweets, com exceção das rotulações já feitas
		const result = await client.query(`
			SELECT id, tweet_text 
			FROM tweets_schema.tweets
			WHERE id NOT IN (
				SELECT tweets_id 
				FROM tweets_schema.labeling
			) AND date BETWEEN $1 AND $2
			LIMIT 1 
			OFFSET floor (random() * (
				SELECT COUNT(*) 
				FROM tweets_schema.tweets
				WHERE id NOT IN (
					SELECT tweets_id 
					FROM tweets_schema.labeling
				) AND date BETWEEN $1 AND $2
			))
		`, [req.session.datIni, req.session.datFim]); 

		const ids = await client.query('SELECT id, type FROM tweets_schema.evaluation');
		
		
		if(result.rowCount <= 0){
			throw 'error'
		}

		res.render('labeling',{tweet: result.rows[0], evaluations: ids.rows, count: req.session.idsLabel.length});

	}
	catch(e){
		next('1')
	}
};

exports.labelTweets = async function (req, res, next) {

	//console.log(req.query) para GET e POST
	//console.log(req.body) para POST

	//evitar crash do sistema
	if(!req.session.idsLabel){
		req.session.idsLabel = [];
	}

	//inserção das rotulãções
 	try{
		let resultado = await client.query('INSERT INTO tweets_schema.labeling(login_id, tweets_id, evaluation_id) VALUES(1, $1, $2) RETURNING id', [req.body.idTweet, req.body.polarizacao]);
		req.session.idsLabel.push(resultado.rows[0].id);
		exports.showTweets(req,res,next);
	}
	catch(e){
		next('1');
	}
}

exports.endOfLabel = async function (req, res, next) {

	try{

		if(!req.session.idsLabel){
			res.redirect('/end', {message: 'Você não rotulou nenhum tweet!'});
		}	

		//Seleção dos textos do tweet e da polarização de acordo com o id da rotulação
		let resultado = `SELECT tweet_text, type
						 FROM ((tweets_schema.labeling 
						 INNER JOIN tweets_schema.tweets ON tweets_schema.labeling.tweets_id = tweets_schema.tweets.id)
						 INNER JOIN tweets_schema.evaluation ON tweets_schema.labeling.evaluation_id = tweets_schema.evaluation.id)
						 WHERE tweets_schema.labeling.id IN ($1`;
		
		for(let i = 1;i<req.session.idsLabel.length;i++)
			resultado += `,$${i+1}`;

		resultado += ')';
		
		let text = await client.query(resultado,req.session.idsLabel);

		res.render('end',{message: null, tweets: text.rows});

		//zera o vetor de ids para uma nova rotulação
		req.session.idsLabel = [];

	}
	catch(e){
		next('1');
	}
}
