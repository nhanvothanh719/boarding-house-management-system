import MainDashboard from "../pages/Dashboard/MainDashboard";
import RentersList from "../pages/Dashboard/RentersList";
import RenterDetails from "../pages/Dashboard/Form";
import CreateCategory from "../pages/Dashboard/CreateCategory";
import CategoriesList from "../pages/Dashboard/CategoriesList";

const routes = [
    { path: '/admin', exact: true, name: 'Admin' },
    { path: '/admin/dashboard', exact: true, name: 'Dashboard', component: MainDashboard },
    { path: '/admin/renters', exact: true, name: 'AllRenters', component: RentersList },
    { path: '/admin/renters/:renterID', exact: true, name: 'RenterDetails', component: RenterDetails },
    { path: '/admin/create-category', exact: true, name: 'CreateCategory', component: CreateCategory },
    { path: '/admin/view-all-categories', exact: true, name: 'ViewAllCategories', component: CategoriesList },
]

export default routes;