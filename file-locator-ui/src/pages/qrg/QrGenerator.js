import React from 'react';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddFile from './AddFile';
import QRGWrapper from '../../hoc/QRGWrapper';
import axios from 'axios';

const styles = (theme) => ({
	qr: {
		textAlign: 'center',
		margin: theme.spacing(2),
		border: `1px solid ${theme.palette.primary.light}`,
		padding: theme.spacing(2, 0),
	},
	a: {
		cursor: 'pointer',
	},
});

const url = process.env.REACT_APP_BASE_URL;

class QrGenerator extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			processName: '',
			isSubmitted: false,
			qrPath: '',
			nextDivision: '',
		};
	}

	handleInputChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { name, processName } = this.state;
		const token = window.localStorage.getItem('token');
		const fileData = {
			name,
			processName,
		};
		// Generate Qr and send that generated qr to the clerk in email
		axios
			.post(`${url}/files`, fileData, {
				headers: { Authorization: `bearer ${token}` },
			})
			.then((res) => {
				const { qr, nextDivision } = res.data;
				this.setState({
					qrPath: qr,
					isSubmitted: true,
					name: '',
					nextDivision,
				});
			})
			.catch((err) => console.log('can not generate qr', err));
	};

	render() {
		const { classes } = this.props;
		return (
			<QRGWrapper>
				<div>
					<AddFile
						handleInputChange={this.handleInputChange}
						handleSubmit={this.handleSubmit}
						post={this.state}
					/>

					{this.state.isSubmitted ? (
						<div className={classes.qr}>
							<Typography variant='h5' component='p'>
								Next Step: {this.state.nextDivision}
							</Typography>
							<a href={this.state.qrPath} download>
								<img src={this.state.qrPath} alt='qr code' />
							</a>
							<div>
								<Button
									variant='contained'
									color='primary'
									component='a'
									href={this.state.qrPath}
									target='_blank'
									download='qr.png'
									rel='noopener'
								>
									Download QR Code
								</Button>
							</div>
						</div>
					) : null}
				</div>
			</QRGWrapper>
		);
	}
}

export default withStyles(styles)(QrGenerator);
