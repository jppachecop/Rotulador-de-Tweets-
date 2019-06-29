const client = require ('./connection')
const express = require ('express')
const bodyparser = require ('body-parser')
const morgan = require('morgan')
const app = express()
const cookieSession = require('cookie-session')

const home = require('./routes/home.route');
const page = require('./routes/pageView.route');
const label = require('./routes/labeling.route');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyparser.urlencoded({
  extended: false
}));

app.use(bodyparser.json())

// Logs das requisições
app.use(morgan('dev'));

app.use(cookieSession({
	name: 'session',
	secret: '',

	maxAge: 24 * 60 * 60 * 1000 // 24 h
}))

app.use('/', home);
app.use('/', page);
app.use('/', label);
app.use(function(req, res, next){
	next('2')
});
//toDo:função com o app.use para usar o handlle error
app.use(function(err, req, res, next){
	
	switch(err){
		case '1':
			res.render('error500')
		break;
		case '2':
			res.render('error404')
		break;
	}
});

client.promise.then(() => app.listen(8080,() => console.log('Express is running')))
