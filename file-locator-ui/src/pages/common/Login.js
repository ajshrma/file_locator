import React from 'react';
import {
	Button,
	CssBaseline,
	TextField,
	Typography,
	Container,
	withStyles,
} from '@material-ui/core';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';

const url = process.env.REACT_APP_BASE_URL;

const styles = (theme) => ({
	container: {
		height: '100vh',
		maxHeight: '100vh',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItem: 'center',
	},
	form: {
		padding: '2rem',
		background: 'white',
		border: '1px solid #d5d5d5',
		borderRadius: '5px',
	},
});

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			redirect: false,
			redirectPath: '',
		};
	}

	handleInputChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();

		const { email, password } = this.state;

		const login = {
			email,
			password,
		};

		// User authentication
		axios.post(`${url}/users/login`, login).then((res) => {
			const token = res.data.token;
			const role = res.data.role;
			window.localStorage.setItem('token', token);
			if (role === 'admin') {
				this.setState({ redirect: true, redirectPath: '/admin' });
			} else if (role === 'emp') {
				this.setState({ redirect: true, redirectPath: '/emp' });
			} else if (role === 'qrg') {
				this.setState({ redirect: true, redirectPath: '/qrg' });
			}
		});
	};

	render() {
		const { classes } = this.props;
		if (!this.state.redirect) {
			return (
				<Container component='main' maxWidth='sm' className={classes.container}>
					<CssBaseline />

					<form
						noValidate
						onSubmit={this.handleSubmit}
						className={classes.form}
					>
						<Typography component='h1' variant='h5'>
							Log In
						</Typography>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							id='email'
							label='Email'
							type='email'
							name='email'
							autoComplete='email'
							autoFocus
							onChange={this.handleInputChange}
						/>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type='password'
							id='password'
							autoComplete='current-password'
							onChange={this.handleInputChange}
						/>
						<Button type='submit' fullWidth variant='contained' color='primary'>
							Log In
						</Button>
						<Typography variant='h6' component='p'>
							Not a user? <Link to='/signup'>Signup here</Link>
						</Typography>
					</form>
				</Container>
			);
		} else {
			return <Redirect push to={this.state.redirectPath} />;
		}
	}
}

export default withStyles(styles)(Login);
