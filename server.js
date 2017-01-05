const express = require('express');
const hbs = require('hbs');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();
hbs.registerPartials(path.join(__dirname, '/views/partials'));
app.set('view engine', 'hbs');
// edit more to set a custom views directory
app.set('views', path.join(__dirname ,'/views'));

// overwrites all router functionality for maintenance page
// app.use((req,res, next) => {
// 	res.render('maintenance.hbs');
// });

app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;
	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log');
		}
	});
	next();
});

app.use(express.static(__dirname + '/public'));

// OWN: if wrong url
// app.use((req,res, next) => {
// 	// console.log(req);
// 	console.log(res);
// 	if (req.statusCode == null || req.statusCode == undefined) {
// 		return res.render('maintenance.hbs');
// 	}
// 	next();
// });



hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

app.get('/', (req,res) => {
	// res.send('<h1>Hello Express!</h1>');
	res.render('index.hbs', {
		pageTitle: 'Homepage',
		welcomeMessage: 'Oh, hello there'
	});
});

app.get('/about', (req,res) => {
	res.render('about.hbs', {
		pageTitle: 'About Page',
	});
});

app.get('/projects', (req, res) => {
	res.render('projects.hbs', {
		pageTitle: 'Portfolio Page'
	});
});

app.get('/bad', (req,res) => {
	res.send({
		errorMessage: 'bad url'
	});
});

app.listen(port, () => {
	console.log('Server is up on port ' + port);
});