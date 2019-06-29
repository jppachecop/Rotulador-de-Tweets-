exports.pageLogin = function(req, res, next) {
	res.render('home', {message: null});
}

exports.pageSignUp = function(req, res, next) {
	res.render('signup', {message: null});
}

exports.pageFilter = function(req, res, next) {
	res.render('filter', {message: null});
}

exports.pageEnd = function(req, res, next) {
	res.render('end', {message: null});
}