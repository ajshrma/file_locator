import React from 'react';
import MaterialTable from 'material-table';
import { Container, withStyles, Typography } from '@material-ui/core';
import { tableIcons } from '../../components/TableIcons';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import EmpWrapper from '../../hoc/EmpWrapper';

const url = process.env.REACT_APP_BASE_URL;

const styles = (theme) => ({
	form: {
		display: 'flex',
		flexDirection: 'column',
		'& > *': {
			marginTop: theme.spacing(1.5),
		},
		textAlign: 'center',
	},
	title: {
		padding: `${theme.spacing(1.25)}px 0px`,
	},
	button: {
		textTransform: 'none',
		margin: theme.spacing(2, 0),
	},
	fileDetail: {
		padding: theme.spacing(3),
		backgroundColor: '#f8f8f8',
	},
});

class FileList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			response: [],
			updateFiles: [],
		};
	}

	handleChecked = (e) => {
		let userId;
		if (e.target.checked) {
			userId = e.target.value;
		} else {
			const index = this.state.updateFiles.indexOf(e.target.value);
			if (index > -1) {
				this.state.updateFiles.splice(index, 1);
			}
		}

		if (typeof userId === 'undefined') {
		} else {
			this.setState((prevState) => ({
				updateFiles: [...prevState.updateFiles, userId],
			}));
		}
	};

	componentDidMount() {
		const token = window.localStorage.getItem('token');

		// Get all the files of an employee
		axios
			.get(`${url}/file/employee`, {
				headers: { Authorization: `bearer ${token}` },
			})
			.then((res) => {
				this.setState({
					response: res.data,
				});
			})
			.catch((err) => console.log(`can not display files`, err));
	}

	handleUpdateFiles = (e) => {
		e.preventDefault();
		const fileIds = this.state.updateFiles;
		const token = window.localStorage.getItem('token');
		console.log(token);
		if (fileIds.length === 1) {
			// Update files - one at a time
			axios
				.put(`${url}/file/employee/${fileIds[0]}`, ' ', {
					headers: { Authorization: `bearer ${token}` },
				})
				.then((res) => {
					this.setState((prev) => ({
						response: prev.response.filter((file) => file._id !== fileIds[0]),
					}));
				})
				.catch((err) => console.log('can not update status'));
		} else {
			// update multiple files
			axios
				.put(`${url}/file/employee`, fileIds, {
					headers: { Authorization: `bearer ${token}` },
				})
				.then((res) => {
					window.location.reload();
				})
				.catch((err) => console.log('can not update status'));
		}
	};

	render() {
		const { classes } = this.props;
		const data = this.state.response.map((file) => {
			const {
				name,
				_id: id,
				processTitle,
				step: { title, desc, deadline },
				nextStep,
			} = file;
			return {
				name,
				id,
				processTitle,
				title,
				desc,
				deadline,
				nextStep,
			};
		});
		return (
			<EmpWrapper>
				<Container component='main' maxWidth='md'>
					<MaterialTable
						icons={tableIcons}
						title='File List'
						columns={[
							{
								title: 'File Name',
								field: 'name',
							},
							{
								title: 'Process Name',
								field: 'processTitle',
							},
							{
								title: 'Deadline',
								field: 'deadline',
							},
							{
								title: 'Next Step',
								field: 'nextStep',
							},
							{
								title: 'Completed',
								field: 'checkbox',
								render: (rowData) => (
									<input
										type='checkbox'
										onChange={this.handleChecked}
										value={rowData.id}
									/>
								),
							},
						]}
						data={data}
						detailPanel={(rowData) => (
							<div className={classes.fileDetail}>
								<Typography variant='h5' component='h1'>
									{rowData.title}
								</Typography>
								<Typography variant='body2' component='p' paragraph>
									{rowData.desc}
								</Typography>
							</div>
						)}
					/>
					<Button
						variant='contained'
						color='primary'
						className={classes.button}
						onClick={this.handleUpdateFiles}
					>
						Update Status
					</Button>
				</Container>
			</EmpWrapper>
		);
	}
}

export default withStyles(styles)(FileList);
