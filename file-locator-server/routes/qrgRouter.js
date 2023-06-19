var express = require('express');
const bodyParse = require('body-parser');
var Process = require('../models/process.schema');
var qrgRouter = express.Router();

qrgRouter.use(bodyParse.json());

/* Get all processes, with data updated */
qrgRouter.route('/process').get((req, res, next) => {
	/* Properties present with value one value will be present
		in the processes data i.e. name and title, other properties
		which are either not in list or with value 0 will not be
		present in the results
	*/
	Process.find({}, { name: 1, title: 1, _id: 0 })
		.then(
			processes => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(processes);
			},
			err => next(err),
		)
		.catch(err => next(err));
});

module.exports = qrgRouter;
