import MainDashboard from "../pages/Dashboard/MainDashboard";
//import RentersList from "../pages/Dashboard/RentersList";
import RenterDetails from "../pages/Dashboard/Form";
import CreateCategory from "../pages/Dashboard/Category/CreateCategory";
import CategoriesList from "../pages/Dashboard/Category/CategoriesList";
import EditCategory from "../pages/Dashboard/Category/EditCategory";
import CreateRoom from "../pages/Dashboard/Room/CreateRoom";
import RoomsList from "../pages/Dashboard/Room/RoomsList";
import EditRoom from "../pages/Dashboard/Room/EditRoom";
import RentersList from "../pages/Dashboard/Renter/RentersList";

const routes = [
    { path: '/admin', exact: true, name: 'Admin' },
    { path: '/admin/dashboard', exact: true, name: 'Dashboard', component: MainDashboard },
    { path: '/admin/renters', exact: true, name: 'AllRenters', component: RentersList },
    { path: '/admin/renters/:renterID', exact: true, name: 'RenterDetails', component: RenterDetails },
    //Category
    { path: '/admin/create-category', exact: true, name: 'CreateCategory', component: CreateCategory },
    { path: '/admin/view-all-categories', exact: true, name: 'CategoriesList', component: CategoriesList },
    { path: '/admin/edit-category/:categoryID', exact: true, name: 'EditCategory', component: EditCategory },
    //Room
    { path: '/admin/create-room', exact: true, name: 'CreateRoom', component: CreateRoom },
    { path: '/admin/view-all-rooms', exact: true, name: 'RoomsList', component: RoomsList },
    { path: '/admin/edit-room/:roomID', exact: true, name: 'EditRoom', component: EditRoom },
]

export default routes;