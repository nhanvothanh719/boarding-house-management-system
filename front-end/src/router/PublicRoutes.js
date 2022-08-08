import HomePage from "../pages/User/HomePage";
import FeaturesPage from "../pages/User/FeaturesPage";
import WhyChooseUsPage from "../pages/User/WhyChooseUsPage";
import ContactUsPage from "../pages/User/ContactUsPage";
import TermsAndConditionPage from "../pages/User/TermsAndConditionPage";
import PrivacyPolicyPage from "../pages/User/PrivacyPolicyPage";
import AvailableRoomsPage from "../pages/User/AvailableRoomsPage";
import AvailableRoomDetailsPage from "../pages/User/AvailableRoomDetailsPage";

const routes = [
    { path: '/', exact: true, name: 'Home', component: HomePage },
    { path: '/features', exact: true, name: 'FeaturesPage', component: FeaturesPage },
    { path: '/why-choose-us', exact: true, name: 'WhyChooseUsPage', component: WhyChooseUsPage },
    { path: '/contact-us', exact: true, name: 'ContactUsPage', component: ContactUsPage },
    { path: '/available-rooms', exact: true, name: 'AvailableRoomsPage', component: AvailableRoomsPage },
    { path: '/available-room-details/:roomID/:roomNumber', exact: true, name: 'AvailableRoomDetailsPage', component: AvailableRoomDetailsPage},
    { path: '/all-terms-and-condition', exact: true, name: 'TermsAndConditionPage', component: TermsAndConditionPage },
    { path: '/privacy-policy', exact: true, name: 'PrivacyPolicyPage', component: PrivacyPolicyPage },
    { path: '*', exact: true, name: 'PageNotFound', component: HomePage },
];

export default routes;