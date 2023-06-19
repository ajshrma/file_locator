const nodemailer = require('nodemailer');

module.exports = async function sendEmail(data) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: '2019pietcsajay13@poornima.org',
			pass: 'Poornima@013',
		},
	});

	// send mail with defined transport object
	const info = await transporter.sendMail({
		from: 'ksvkabra@gmail.com', // sender address
		to: data.to, // list of receivers
		subject: data.subject, // Subject line
		text: data.text, // plain text body
		attachments: [{ filename: data.filename, content: data.attachments }],
	});

	return data;
};
