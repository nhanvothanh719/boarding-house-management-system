import RoomDetails from "../pages/Renter/Room/RoomDetails";
import InvoicesList from "../pages/Renter/Invoice/InvoicesList";
import ServiceRegistration from "../pages/Renter/Service/ServiceRegistration";
import PaidInvoiceDetails from "../pages/Renter/Invoice/PaidInvoiceDetails";
import UnpaidInvoiceDetails from "../pages/Renter/Invoice/UnpaidInvoiceDetails";
import ProblemsList from "../pages/Renter/Problem/ProblemsList";
import RoomContractDetails from "../pages/Renter/RoomContract/RoomContractDetails";
import BreachHistoriesList from "../pages/Renter/Breach/BreachHistoriesList";

const routes = [
    { path: '/renter', exact: true, name: 'Renter' },
    { path: '/renter/view-room-details', exact: true, name: 'RoomDetails', component: RoomDetails },
    { path: '/renter/view-room-contract', exact: true, name: 'RoomContract', component: RoomContractDetails },
    { path: '/renter/view-all-breach-histories', exact: true, name: 'BreachHistoriesList', component: BreachHistoriesList },
    { path: '/renter/view-all-invoices', exact: true, name: 'InvoicesList', component: InvoicesList },
    { path: '/renter/view-paid-invoice-details/:invoiceID', exact: true, name: 'PaidInvoiceDetails', component: PaidInvoiceDetails },
    { path: '/renter/view-unpaid-invoice-details/:invoiceID', exact: true, name: 'UnpaidInvoiceDetails', component: UnpaidInvoiceDetails },
    { path: '/renter/register-optional-service', exact: true, name: 'ServiceRegistration', component: ServiceRegistration },
    { path: '/renter/send-problem', exact: true, name: 'Problems', component: ProblemsList },
]

export default routes;