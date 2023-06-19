var express = require('express');
const bodyParse = require('body-parser');
var Process = require('../models/process.schema');
var processRouter = express.Router();
const authenticate = require('../authenticate');

processRouter.use(bodyParse.json());
processRouter.use(authenticate.verifyUser);

/* GET processes listing. */
processRouter
	.route('/')
	.get(authenticate.verifyAdmin, (req, res, next) => {
		Process.find()
			.then(
				processes => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(processes);
				},
				err => next(err),
			)
			.catch(err => next(err));
	})
	/* Add a process */
	.post(authenticate.verifyAdmin, (req, res, next) => {
		if (req.body != null) {
			Process.create(req.body)
				.then(
					process => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(process);
					},
					err => next(err),
				)
				.catch(err => next(err));
		} else {
			err = new Error('Process not found in request body');
			err.status = 404;
			return next(err);
		}
	})
	/* Update a process */
	.put((req, res, next) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /processes/');
	})
	/* Delete a process */
	.delete(authenticate.verifyAdmin, (req, res, next) => {
		Process.remove({})
			.then(
				resp => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(resp);
				},
				err => next(err),
			)
			.catch(err => next(err));
	});

processRouter
	.route('/:processId')
	/* Get process using processId */
	.get((req, res, next) => {
		Process.findById(req.params.processId)
			.then(
				process => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(process);
				},
				err => next(err),
			)
			.catch(err => next(err));
	})
	.post((req, res, next) => {
		res.statusCode = 403;
		res.end(
			'POST operation not supported on /processes/' + req.params.processId,
		);
	})
	/* Update a process using processId */
	.put(authenticate.verifyAdmin, (req, res, next) => {
		Process.findById(req.params.processId)
			.then(
				process => {
					if (process != null) {
						/* adding new returns the updated object */
						Process.findByIdAndUpdate(
							req.params.processId,
							{
								$set: req.body,
							},
							{ new: true },
						).then(
							process => {
								res.statusCode = 200;
								res.setHeader('Content-Type', 'application/json');
								res.json(process);
							},
							err => next(err),
						);
					} else {
						err = new Error('Process ' + req.params.processId + ' not found');
						err.status = 404;
						return next(err);
					}
				},
				err => next(err),
			)
			.catch(err => next(err));
	})
	/* Delete a process using process Id */
	.delete(authenticate.verifyAdmin, (req, res, next) => {
		Process.findByIdAndRemove(req.params.processId)
			.then(
				resp => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(resp);
				},
				err => next(err),
			)
			.catch(err => next(err));
	});
module.exports = processRouter;
