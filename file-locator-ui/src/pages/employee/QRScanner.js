import React, { Component } from 'react';
import QrReader from 'react-qr-reader';
import axios from 'axios';
import EmpWrapper from '../../hoc/EmpWrapper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const url = process.env.REACT_APP_BASE_URL;

const styles = (theme) => ({
	qrScanner: {
		width: '90vw',
		height: '50vh',
		maxWidth: '600px',
		maxHeight: '600px',
		border: `1px solid ${theme.palette.primary.main}`,
	},
	qrContainer: {
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',

		'& > *': {
			margin: theme.spacing(2, 0),
		},
	},
});

class QrScanner extends Component {
	state = {
		show: true,
	};

	handleScan = (data) => {
		if (data) {
			this.setState((prev) => ({
				show: false,
			}));
			const parsedData = JSON.parse(data);
			const { fileId } = parsedData;
			const token = window.localStorage.getItem('token');
			// Scan Qr - it contains the fileId, send that file Id to server and file to employee
			axios
				.post(
					`${url}/file/employee/${fileId}`,
					{
						fileId,
					},
					{ headers: { Authorization: `bearer ${token}` } },
				)
				.then((res) => {
					this.props.history.push('/emp');
				})
				.catch((err) => {
					console.log('can not scan qr');
				});
		}
	};
	handleError = (err) => {
		console.error(err);
	};
	render() {
		const { classes } = this.props;
		return (
			<EmpWrapper>
				{this.state.show && (
					<div className={classes.qrContainer}>
						<Typography variant='h4' component='h1'>
							Scan QR Code
						</Typography>
						<QrReader
							onError={this.handleError}
							onScan={this.handleScan}
							facingMode='environment'
							className={classes.qrScanner}
						/>
					</div>
				)}
			</EmpWrapper>
		);
	}
}

export default withStyles(styles)(QrScanner);
