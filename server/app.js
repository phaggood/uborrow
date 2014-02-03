
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var express = require('express');
//var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('production' == app.get('env')) {
    mongoose.connect('mongodb://nodejitsu_phaggood:8t0quk4kl4lurnl60rok3th1el@ds061548.mongolab.com:61548/nodejitsu_phaggood_nodejitsudb2211351557');
    console.log("connected to production database");
}

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var Cabinet = mongoose.model('Cabinet', require('./models/cabinet').schema);
var Item = mongoose.model('Item', require('./models/item').schema);

var handlers = {};

handlers.cabinet = require('./handlers/cabinetHandler')(Cabinet);
handlers.items = require('./handlers/itemHandler')(Item);

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', function(req,res) {
    res.send(200,"UBorrow API v2.3");
});

// cabinet routes
//app.post('/cabinets', handlers.cabinet.processCabinet(Cabinet)); // createCabinet, add/Remove borrower
//app.post('/cabinets/items', handlers.cabinet.processItem(Item));  // createItem, add/remvoe from cabinet

app.get('/uborrow/cabinets', handlers.cabinet.getCabinets);
app.post('/uborrow/cabinets', handlers.cabinet.processCabinet);
app.get('/uborrow/cabinets/:id', handlers.cabinet.getCabinetById);

app.get('/uborrow/items/:id', handlers.items.getItemById);
app.post('/uborrow/items', handlers.items.processItem);

app.get( '/uborrow/cabinets/:cabinetid/items', handlers.items.getCabinetItems);
app.post('/uborrow/cabinets/:cabinetid/items', handlers.items.processCabinetItem);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


module.exports = app;