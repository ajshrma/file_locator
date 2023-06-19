var passport = require('passport');
var User = require('./models/user.schema');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJWT = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
	return jwt.sign(user, config.secretKey, { expiresIn: 86400 });
};

var opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
	new JwtStrategy(opts, (jwt_payload, done) => {
		User.findOne({ _id: jwt_payload._id }, (err, user) => {
			if (err) {
				return done(err, false);
			} else if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	}),
);

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyEmp = (req, res, next) => {
	if (req.user.role === 'emp') {
		next();
	} else {
		var err = new Error('You are not authorized to perform this operation!');
		err.status = 403;
		next(err);
	}
};

exports.verifyQrg = (req, res, next) => {
	if (req.user.role === 'qrg') {
		next();
	} else {
		var err = new Error('You are not authorized to perform this operation!');
		err.status = 403;
		next(err);
	}
};

exports.verifyEmpAndQrg = (req, res, next) => {
	if (req.user.role === 'qrg' || req.user.role === 'emp') {
		next();
	} else {
		var err = new Error('You are not authorized to perform this operation!');
		err.status = 403;
		next(err);
	}
};

exports.verifyEmpID = (req, res, next) => {
	const paramsId = Object.values(req.params)[0];
	if (JSON.stringify(paramsId) === JSON.stringify(req.user._id)) {
		next();
	} else {
		var err = new Error('You are not authorized to perform this operation!');
		err.status = 403;
		next(err);
	}
};

exports.verifyAdmin = (req, res, next) => {
	if (req.user.role === 'admin') {
		next();
	} else {
		var err = new Error('You are not authorized to perform this operation!');
		err.status = 403;
		next(err);
	}
};
