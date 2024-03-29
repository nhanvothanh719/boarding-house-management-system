import MainDashboard from "../pages/Admin/Dashboard/MainPage/MainDashboard";
import CategoriesList from "../pages/Admin/Dashboard/Category/CategoriesList";
import RoomsList from "../pages/Admin/Dashboard/Room/RoomsList";
import EditRoom from "../pages/Admin/Dashboard/Room/EditRoom";
import UsersList from "../pages/Admin/Dashboard/User/UsersList";
import EditUser from "../pages/Admin/Dashboard/User/EditUser";
import MotorbikesList from "../pages/Admin/Dashboard/Motorbike/MotorbikesList";
import ServicesList from "../pages/Admin/Dashboard/Service/ServicesList";
import RegisterService from "../pages/Admin/Dashboard/Service/RegisterService";
import RentRoom from "../pages/Admin/Dashboard/Room/RentRoom";
import InvoicesList from "../pages/Admin/Dashboard/Invoice/InvoicesList";
import CreateInvoice from "../pages/Admin/Dashboard/Invoice/CreateInvoice";
import InvoiceDetails from "../pages/Admin/Dashboard/Invoice/InvoiceDetails";
import RenterInvoicesList from "../pages/Admin/Dashboard/Invoice/RenterInvoicesList";
import CreateAnnouncement from "../pages/Admin/Dashboard/Announcement/CreateAnnouncement";
import BalanceDetails from "../pages/Admin/Dashboard/Balance/BalanceDetails";
import BreachesList from "../pages/Admin/Dashboard/Breach/BreachesList";
import BreachHistories from "../pages/Admin/Dashboard/Breach/BreachHistories";
import RenterBreachDetails from "../pages/Admin/Dashboard/Breach/RenterBreachDetails";
import RoomContractsList from "../pages/Admin/Dashboard/RoomContract/RoomContractsList";
import RoomContractDetails from "../pages/Admin/Dashboard/RoomContract/RoomContractDetails";
import ProblemsList from "../pages/Admin/Dashboard/Problem/ProblemsList";
import RoomRentRegistrationsList from "../pages/Admin/Dashboard/RoomRentRegistration/RoomRentRegistrationsList";

const routes = [
    { path: '/admin', exact: true, name: 'Admin' },
    { path: '/admin/dashboard', exact: true, name: 'MainDashboard', component: MainDashboard },
    //{ path: '/admin/renters/:renterID', exact: true, name: 'Example', component: Example },
    //Category
    { path: '/admin/view-all-categories', exact: true, name: 'CategoriesList', component: CategoriesList },
    //Room
    { path: '/admin/rent-room', exact: true, name: 'RentRoom', component: RentRoom },
    { path: '/admin/view-all-rooms', exact: true, name: 'RoomsList', component: RoomsList },
    { path: '/admin/edit-room/:roomID', exact: true, name: 'EditRoom', component: EditRoom },
    //Renter
    { path: '/admin/view-all-users', exact: true, name: 'UsersList', component: UsersList },
    { path: '/admin/edit-user/:userID', exact: true, name: 'EditUser', component: EditUser },
    //Motorbike
    { path: '/admin/view-all-motorbikes', exact: true, name: 'MotorbikesList', component: MotorbikesList },
    //Service
    { path: '/admin/view-all-services', exact: true, name: 'ServicesList', component: ServicesList },
    { path: '/admin/register-service', exact: true, name: 'RegisterService', component: RegisterService },
    //Invoice
    { path: '/admin/view-all-renters-with-invoices', exact: true, name: 'InvoicesList', component: InvoicesList },
    { path: '/admin/create-invoice/:renterID', exact: true, name: 'CreateInvoice', component: CreateInvoice },
    { path: '/admin/invoice-details/:invoiceID', exact: true, name: 'InvoiceDetails', component: InvoiceDetails },
    { path: '/admin/view-all-invoices-of-renter/:renterID', exact: true, name: 'RenterInvoicesList', component: RenterInvoicesList },
    //Announcement
    { path: '/admin/create-announcement', exact: true, name: 'CreateAnnouncement', component: CreateAnnouncement},
    //Balance
    { path: '/admin/view-balance-details', exact: true, name: 'BalanceDetails', component: BalanceDetails},
    //Breach
    { path: '/admin/view-all-breaches', exact: true, name: 'BreachesList', component: BreachesList },
    { path: '/admin/view-all-breach-histories', exact: true, name: 'BreachHistories', component: BreachHistories },
    { path: '/admin/view-renter-breach-details/:renterID', exact: true, name: 'RenterBreachDetails', component: RenterBreachDetails },
    //Room contract
    { path: '/admin/view-all-room-contracts', exact: true, name: 'RoomContractsList', component: RoomContractsList },
    { path: '/admin/view-room-contract-details/:roomContractID', exact: true, name: 'RoomContractDetails', component: RoomContractDetails },
    //Problem
    { path: '/admin/view-all-problems', exact: true, name: 'ProblemsList', component: ProblemsList },
    //Room rent registration
    { path: '/admin/view-all-room-rent-registrations', exact: true, name: 'RoomRentRegistrationsList', component: RoomRentRegistrationsList },
    
]

export default routes;