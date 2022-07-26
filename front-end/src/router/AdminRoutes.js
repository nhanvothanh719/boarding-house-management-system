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
import CreateRenter from "../pages/Dashboard/Renter/CreateRenter";
import EditRenter from "../pages/Dashboard/Renter/EditRenter";
import MotorbikesList from "../pages/Dashboard/Motorbike/MotorbikesList";
import CreateMotorbike from "../pages/Dashboard/Motorbike/CreateMotorbike";
import EditMotorbike from "../pages/Dashboard/Motorbike/EditMotorbike";
import CreateService from "../pages/Dashboard/Service/CreateService";
import ServicesList from "../pages/Dashboard/Service/ServicesList";
import EditService from "../pages/Dashboard/Service/EditService";

const routes = [
    { path: '/admin', exact: true, name: 'Admin' },
    { path: '/admin/dashboard', exact: true, name: 'Dashboard', component: MainDashboard },
    //{ path: '/admin/renters', exact: true, name: 'AllRenters', component: RentersList },
    { path: '/admin/renters/:renterID', exact: true, name: 'RenterDetails', component: RenterDetails },
    //Category
    { path: '/admin/create-category', exact: true, name: 'CreateCategory', component: CreateCategory },
    { path: '/admin/view-all-categories', exact: true, name: 'CategoriesList', component: CategoriesList },
    { path: '/admin/edit-category/:categoryID', exact: true, name: 'EditCategory', component: EditCategory },
    //Room
    { path: '/admin/create-room', exact: true, name: 'CreateRoom', component: CreateRoom },
    { path: '/admin/view-all-rooms', exact: true, name: 'RoomsList', component: RoomsList },
    { path: '/admin/edit-room/:roomID', exact: true, name: 'EditRoom', component: EditRoom },
    //Renter
    { path: '/admin/create-renter', exact: true, name: 'CreateRenter', component: CreateRenter },
    { path: '/admin/view-all-renters', exact: true, name: 'RentersList', component: RentersList },
    { path: '/admin/edit-renter/:renterID', exact: true, name: 'EditRenter', component: EditRenter },
    //Motorbike
    { path: '/admin/create-motorbike', exact: true, name: 'CreateMotorbike', component: CreateMotorbike },
    { path: '/admin/view-all-motorbikes', exact: true, name: 'MotorbikesList', component: MotorbikesList },
    { path: '/admin/edit-motorbike/:motorbikeID', exact: true, name: 'EditMotorbike', component: EditMotorbike },
    //Service
    { path: '/admin/create-service', exact: true, name: 'CreateService', component: CreateService },
    { path: '/admin/view-all-services', exact: true, name: 'ServicesList', component: ServicesList },
    { path: '/admin/edit-service/:serviceID', exact: true, name: 'EditService', component: EditService },
]

export default routes;