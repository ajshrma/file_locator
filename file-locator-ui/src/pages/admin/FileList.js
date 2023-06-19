import React from 'react';
import MaterialTable from 'material-table';
import { Container, withStyles } from '@material-ui/core';
import { tableIcons } from '../../components/TableIcons';
import axios from 'axios';
import AdminWrapper from '../../hoc/AdminWrapper';
import FileDetails from './fileDetails';
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
	},
});

function checkStatus(processStarted, fileStatus) {
	if (!processStarted) return 'Not Yet Started';
	if (processStarted && !fileStatus) return 'In Progress';
	if (fileStatus) return 'Completed';
}

class ViewFiles extends React.Component {
	state = {
		files: [],
		processes: [],
	};
	handleClick = (e) => {
		this.setState({
			open: true,
		});
	};

	handleClose = (e) => {
		this.setState({
			open: false,
		});
	};

	handleEdit = (e) => {};
	componentDidMount() {
		const token = window.localStorage.getItem('token');

		// Get processes
		axios.get(`${url}/qrg/process`).then((res) => {
			this.setState({
				processes: res.data,
			});
		});

		// API to get all files
		axios
			.get(`${url}/files`, {
				headers: {
					Authorization: `bearer ${token}`,
				},
			})
			.then((res) => {
				this.setState({
					files: res.data,
				});
			})
			.catch((err) => console.log('can not get files', err));
	}
	render() {
		const { files, processes } = this.state;

		const data = files.map((file) => {
			const {
				name,
				processName,
				processTitle,
				steps,
				_id: id,
				isProcessStarted,
				status,
			} = file;
			const fileStatus = checkStatus(isProcessStarted, status);
			return {
				name,
				processName,
				processTitle,
				steps,
				fileStatus,
				id,
			};
		});
		const processData = processes.reduce((acc, cur) => {
			acc[cur.name] = cur.title;
			return acc;
		}, {});
		return (
			<AdminWrapper>
				<Container component='main' maxWidth='md'>
					<MaterialTable
						icons={tableIcons}
						title='File List'
						columns={[
							{ title: 'File Name', field: 'name', editable: 'onUpdate' },
							{
								title: 'Process Name',
								field: 'processName',
								editable: 'onUpdate',
								lookup: processData,
							},
							{ title: 'Status', field: 'fileStatus' },
						]}
						data={data}
						detailPanel={(rowData) => <FileDetails steps={rowData.steps} />}
						editable={{
							onRowUpdate: (newData, oldData) => {
								const token = window.localStorage.getItem('token');
								return new Promise((resolve, reject) => {
									// Update file status
									axios
										.put(
											`${url}/files/${newData.id}`,
											{
												name: newData.name,
												processName: newData.processName,
											},
											{
												headers: {
													Authorization: `bearer ${token}`,
												},
											},
										)
										.then((res) => {
											window.location.reload();
											resolve();
										})
										.catch((err) => {
											reject();
										});
								});
							},
							onRowDelete: (oldData) => {
								const token = window.localStorage.getItem('token');
								return new Promise((resolve, reject) => {
									// Delete file
									axios
										.delete(`${url}/files/${oldData.id}`, {
											headers: {
												Authorization: `bearer ${token}`,
											},
										})
										.then((res) => {
											this.setState((prev) => ({
												files: prev.files.filter(
													(file) => file._id !== oldData.id,
												),
											}));
											resolve();
										})
										.catch((err) => {
											reject();
										});
								});
							},
						}}
					/>
				</Container>
			</AdminWrapper>
		);
	}
}

export default withStyles(styles)(ViewFiles);
