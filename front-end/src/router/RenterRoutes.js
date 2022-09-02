import RoomContract from "../pages/Renter/Room/RoomContract";
import RoomDetails from "../pages/Renter/Room/RoomDetails";
import InvoicesList from "../pages/Renter/Invoice/InvoicesList";
import Problems from "../pages/Renter/Problem/Problems";
import ServiceRegistration from "../pages/Renter/Service/ServiceRegistration";
import PaidInvoiceDetails from "../pages/Renter/Invoice/PaidInvoiceDetails";
import UnpaidInvoiceDetails from "../pages/Renter/Invoice/UnpaidInvoiceDetails";

const routes = [
    { path: '/renter', exact: true, name: 'Renter' },
    { path: '/renter/view-room-details', exact: true, name: 'RoomDetails', component: RoomDetails },
    { path: '/renter/view-room-contract', exact: true, name: 'RoomContract', component: RoomContract },
    { path: '/renter/view-all-invoices', exact: true, name: 'InvoicesList', component: InvoicesList },
    { path: '/renter/view-paid-invoice-details/:invoiceID', exact: true, name: 'PaidInvoiceDetails', component: PaidInvoiceDetails },
    { path: '/renter/view-unpaid-invoice-details/:invoiceID', exact: true, name: 'UnpaidInvoiceDetails', component: UnpaidInvoiceDetails },
    { path: '/renter/register-optional-service', exact: true, name: 'ServiceRegistration', component: ServiceRegistration },
    { path: '/renter/send-problem', exact: true, name: 'Problems', component: Problems },
]

export default routes;