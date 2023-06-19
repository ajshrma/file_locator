var express = require('express');
const bodyParse = require('body-parser');
var User = require('../models/user.schema');
var passport = require('passport');
var authenticate = require('../authenticate');
var router = express.Router();
router.use(bodyParse.json());

/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, function(
	req,
	res,
	next,
) {
	User.find({})
		.then(
			users => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(users);
			},
			err => next(err),
		)
		.catch(err => next(err));
});

/* register a new user */
router.post('/signup', (req, res, next) => {
	User.register(
		new User({
			email: req.body.email,
			name: req.body.name,
			division: req.body.division,
		}),
		req.body.password,
		(err, user) => {
			if (err) {
				console.log(err);
				res.statusCode = 400;
				res.setHeader('Content-Type', 'application/json');
				res.json({ err: err });
			} else {
				if (req.body.designation) user.designation = req.body.designation;
				if (req.body.contact) user.contact = req.body.contact;
				if (
					req.body.role === 'emp' ||
					req.body.role === 'qrg' ||
					req.body.role === 'admin'
				)
					user.role = req.body.role;
				user.save((err, user) => {
					if (err) {
						res.statusCode = 500;
						res.setHeader('Content-Type', 'application/json');
						res.json({ err: err });
						return;
					}
					passport.authenticate('local')(req, res, () => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json({ success: true, status: 'Registration Successful!' });
					});
				});
			}
		},
	);
});

/* Login a user and identify role */
router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) return next(err);
		if (!user) {
			res.setHeader('Content-Type', 'application/json');
			res.statusCode = 401;
			const response = {
				success: false,
				status: 'Login unsuccessful!',
				err: info,
			};
			res.json(response);
			return;
		}

		req.logIn(user, err => {
			if (err) {
				res.statusCode = 401;
				res.setHeader('Content-Type', 'application/json');
				const response = {
					success: false,
					status: 'Login unsuccessful!',
					err: 'Could not log in user!',
				};
				res.json(response);
				return;
			}
		});

		var token = authenticate.getToken({ _id: req.user._id });
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		const response = {
			success: true,
			token,
			role: user.role,
			status: 'Logged in!',
		};
		res.json(response);
	})(req, res, next);
});

/* process JWT token */
router.get('/checkJWTToken', (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (err) return next(err);

		if (!user) {
			res.statusCode = 401;
			res.setHeader('Content-type', 'application/json');
			return res.json({ status: 'JWT invalid', success: false, err: info });
		} else {
			res.statusCode = 200;
			res.setHeader('Content-type', 'application/json');
			return res.json({ status: 'JWT valid', success: true, user });
		}
	})(req, res);
});

module.exports = router;
