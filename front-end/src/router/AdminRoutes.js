import MainDashboard from "../pages/Dashboard/MainDashboard";
import RentersList from "../pages/Dashboard/RentersList";
import RenterDetails from "../pages/Dashboard/Form";

const routes = [
    { path: '/admin', exact: true, name: 'Admin' },
    { path: '/admin/dashboard', exact: true, name: 'Dashboard', component: MainDashboard },
    { path: '/admin/renters', exact: true, name: 'AllRenters', component: RentersList },
    { path: '/admin/renters/:renterID', exact: true, name: 'RenterDetails', component: RenterDetails },
]

export default routes;