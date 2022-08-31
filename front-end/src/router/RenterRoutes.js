import InvoicePayment from "../pages/Renter/InvoicePayment";
import Problems from "../pages/Renter/Problems";
import RoomContract from "../pages/Renter/RoomContract";
import RoomDetails from "../pages/Renter/RoomDetails";
import ServiceRegistration from "../pages/Renter/ServiceRegistration";

const routes = [
    { path: '/renter', exact: true, name: 'Renter' },
    { path: '/renter/view-room-details', exact: true, name: 'RoomDetails', component: RoomDetails },
    { path: '/renter/view-room-contract', exact: true, name: 'RoomContract', component: RoomContract },
    { path: '/renter/pay-invoice', exact: true, name: 'InvoicePayment', component: InvoicePayment },
    { path: '/renter/register-optional-service', exact: true, name: 'ServiceRegistration', component: ServiceRegistration },
    { path: '/renter/send-problem', exact: true, name: 'Problems', component: Problems },
]

export default routes;