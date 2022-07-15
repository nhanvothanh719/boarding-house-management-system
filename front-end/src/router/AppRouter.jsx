import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgetPassword from "../pages/ForgetPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import UserProfile from "../components/UserProfile";
import HomePage from "../pages/HomePage";
import FeaturesPage from "../pages/FeaturesPage";
import WhyChooseUsPage from "../pages/WhyChooseUsPage";
import ContactUsPage from "../pages/ContactUsPage";
import TermsAndConditionPage from "../pages/TermsAndConditionPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import AvailableRoomsPage from "../pages/AvailableRoomsPage";
import AvailableRoomDetailsPage from "../pages/AvailableRoomDetailsPage";
import AdminPrivateRoute from "./AdminPrivateRoute";
import Error_403 from "../pages/Error_403";
import Error_404 from "../pages/Error_404";
import { useState } from "react";

function AppRouter() {
  const [user, setCurrentUser] = useState({});
  useEffect(() => {
    //Get user credentials
    axios
      .get("/get-user-profile")
      .then((response) => {
        console.log(response.data);
        setCurrentUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  const setUser = (user) => {
    setCurrentUser(user);
  };

  
  return (
    <div>
      <Switch>
        {/* Home page */}
        <Route exact path="/" component={() => <HomePage user={user} />} />
        <Redirect from="/home" to="/" />
        {/* Features page */}
        <Route exact path="/features" component={() => <FeaturesPage user={user} />} />
        {/* Why choose us page */}
        <Route exact path="/why-choose-us" component={() => <WhyChooseUsPage user={user} />}  />
        {/* Contact us page */}
        <Route exact path="/contact-us" component={() => <ContactUsPage user={user} />} />
        {/* Available rooms */}
        <Route exact path="/available-rooms" component={() => <AvailableRoomsPage user={user} />} />
        {/* Available room details */}
        <Route
          exact
          path="/available-room-details/:roomID/:roomNumber"
          component={AvailableRoomDetailsPage}
        />
        {/* Other pages */}
        <Route
          exact
          path="/all-terms-and-condition"
          component={() => <TermsAndConditionPage user={user} />}
        />
        <Route exact path="/privacy-policy" component={() => <PrivacyPolicyPage user={user} />} />
        {/* Login */}
        <Route
          exact
          path="/login"
          component={() => <LoginPage user={user} setUser={setUser} />}
        />
        {/* Register */}
        <Route exact path="/register" component={() => <RegisterPage user={user} />} />
        {/* Forget and Reset password */}
        <Route exact path="/forget-password" component={() => <ForgetPassword user={user} />} />
        <Route
          exact
          path="/reset-password/:token"
          component={() => <ResetPasswordPage user={user} />}
        />
        {/* Current user profile */}
        <Route
          exact
          path="/user-profile"
          component={() => <UserProfile user={user} />}
        />
        {/* Dashboard */}
        {/* <Route path="/admin" name="Admin" component={(props) => (<MasterLayout {...props} />)} /> */}
        {/* Private routes for admin */}
        <AdminPrivateRoute path="/admin" name="Admin" />
        {/* Errors */}
        <Route exact path="/error-403" component={Error_403} />
        <Route exact path="/error-404" component={Error_404} />
      </Switch>
    </div>
  );
}

export default AppRouter;
