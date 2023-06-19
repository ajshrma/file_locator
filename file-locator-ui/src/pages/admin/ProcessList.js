import React from 'react';
import { withStyles, Button, Typography, Grid } from '@material-ui/core';
import axios from 'axios';
import ProcessDetails from './processDetails';
import { Link } from 'react-router-dom';
import AdminWrapper from '../../hoc/AdminWrapper';

const url = process.env.REACT_APP_BASE_URL;

const styles = (theme) => ({
	headingContainer: {
		padding: theme.spacing(2),
		margin: theme.spacing(2, 0),
	},
});
class ProcessList extends React.Component {
	state = {
		processList: [],
		expanded: false,
	};

	handleOpenProcess = (name) => (e, isExpanded) => {
		this.setState({
			expanded: isExpanded ? name : false,
		});
	};

	handleProcessDelete = (id) => () => {
		const token = window.localStorage.getItem('token');
		// Delete a process
		axios
			.delete(`${url}/processes/${id}`, {
				headers: { Authorization: `bearer ${token}` },
			})
			.then((res) => {
				this.setState((prev) => ({
					processList: prev.processList.filter((p) => p._id !== id),
				}));
			})
			.catch((err) => console.log(`cannot delete process`, err));
	};

	componentDidMount() {
		const token = window.localStorage.getItem('token');
		// Get all processes
		axios
			.get(`${url}/processes`, {
				headers: { Authorization: `bearer ${token}` },
			})
			.then((res) => {
				this.setState({
					processList: res.data,
				});
			})
			.catch((err) => console.log('cannot get process list', err));
	}
	render() {
		const { processList } = this.state;
		const { classes } = this.props;
		return (
			<AdminWrapper>
				<Grid
					container
					justify='space-between'
					direction='row'
					alignItems='center'
					className={classes.headingContainer}
				>
					<Grid item>
						<Typography variant='h4' component='h1'>
							All Processes
						</Typography>
					</Grid>
					<Grid item>
						<Button
							component={Link}
							to='/admin/new-process'
							variant='contained'
							color='primary'
						>
							Add new process
						</Button>
					</Grid>
				</Grid>
				{processList.map((process) => (
					<ProcessDetails
						data={process}
						key={process.name}
						expanded={this.state.expanded}
						onChange={this.handleOpenProcess(process.name)}
						onDelete={this.handleProcessDelete(process._id)}
					/>
				))}
			</AdminWrapper>
		);
	}
}

export default withStyles(styles)(ProcessList);
