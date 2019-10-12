// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');// call express

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;        // set our port

var moment = require('moment');
var Plant = require('./models/plant');
var Water = require('./models/water');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/plant')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var plant = new Plant();      // create a new instance of the Bear model

        plant.chipcode = req.body.chipcode;
        plant.soilMoisture = req.body.soilMoisture;
        plant.time = Date.now();

        console.log(plant)

        // save the bear and check for errors
        plant.save(function(err) {

            if (err)
                res.send(err);

            res.json({ message: 'datatapoint created!' });

        });

    }).get(function(req, res) {


    Plant.find(function(err, data){
        res.json(data)
    })


});

router.route('/editplant')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .get(function(req, res) {

        var plant = new Plant;

        Plant.find(function(err, plant){

            console.log(plant.length)

            currenttime = moment();

            timepassed = (30 * plant.length);

            for(i = 0; i < plant.length; i++){

                plant[i].time = moment(currenttime).subtract(timepassed, 's')

                plant[i].save();

                timepassed = timepassed - 30;

            }

            console.log(plant)


        })



    });

router.route('/addwater')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var water = new Water();      // create a new instance of the Bear model

        water.water = false;
        water.time = Date.now();

        console.log(water)

        // save the bear and check for errors
        water.save(function(err) {

            if (err)
                res.send(err);

            res.json({ message: 'water created!' });

        });
});

router.route('/editwater')
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var water = new Water();

        Water.find(function (err, data) {

            water.water = req.body.water;
            water.time = Date.now();

            console.log(water);

            water.save();

        })

    });




// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
var mongoose   = require('mongoose');
mongoose.connect('mongodb://178.62.194.135/greenhouse'); // connect to our database
/*mongodb://ip/database*/