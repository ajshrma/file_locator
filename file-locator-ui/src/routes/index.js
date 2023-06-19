import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from '../pages/common/Login';
import Signup from '../pages/common/Signup';
import ProcessList from '../pages/admin/ProcessList';
import AddProcess from '../pages/admin/AddProcess';
import EmployeeList from '../pages/admin/EmployeeList';
import VerifyEmployee from '../pages/admin/VerifyEmployee';
import AdminFileList from '../pages/admin/FileList';
import UpdateProcess from '../pages/admin/UpdateProcess';
import GenerateQR from '../pages/qrg/QrGenerator';
import ViewFilesQRG from '../pages/qrg/ViewFiles';
import EmpFileList from '../pages/employee/FileList';
import QrScanner from '../pages/employee/QRScanner';

function Routes() {
	return (
		<Switch>
			<Route exact path='/signup' component={Signup} />
			<Route exact path='/admin' component={ProcessList} />
			<Route exact path='/admin/new-process' component={AddProcess} />
			<Route exact path='/admin/employee' component={EmployeeList} />
			<Route exact path='/admin/employee/verify' component={VerifyEmployee} />
			<Route exact path='/admin/process-list' component={ProcessList} />
			<Route exact path='/admin/file-list' component={AdminFileList} />
			<Route
				exact
				path='/admin/process/update/:pid'
				component={UpdateProcess}
			/>
			<Route exact path='/qrg' component={GenerateQR} />
			<Route exact path='/qrg/generate-qr' component={GenerateQR} />
			<Route exact path='/qrg/files' component={ViewFilesQRG} />
			<Route exact path='/emp/scanner' component={QrScanner} />
			<Route exact path='/emp' component={EmpFileList} />
			<Route exact path='/' component={Login} />
			<Redirect exact from='/login' to='/' />
		</Switch>
	);
}

export default Routes;
