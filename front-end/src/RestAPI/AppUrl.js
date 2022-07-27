class AppUrl {
  //Set base URL
  static BaseURL = "http://127.0.0.1:8000/api";

  static Login = this.BaseURL + "/login";
  static GetUserProfile = this.BaseURL + "/get-user-profile";

  static ContactUs = this.BaseURL + "/contact-us";

  static AvailableRooms = this.BaseURL + "/all-available-rooms";
  static AvailableRoomDetails = this.BaseURL + "/room-details/";

  static CheckAuthenticated = this.BaseURL + "/check-authenticated";

  static StoreCategory = this.BaseURL + "/store-category";
  static ShowCategories = this.BaseURL + "/all-categories";
  static EditCategory = this.BaseURL + "/edit-category/";
  static UpdateCategory = this.BaseURL + "/update-category/";
  static DeleteCategory = this.BaseURL + "/delete-category/";

  static StoreRoom = this.BaseURL + "/store-room";
  static ShowRooms = this.BaseURL + "/all-rooms";
  static EditRoom = this.BaseURL + "/edit-room/";
  static UpdateRoom = this.BaseURL + "/update-room/";
  static DeleteRoom = this.BaseURL + "/delete-room/";
  static GetAllStatuses = this.BaseURL + "/all-statuses";
  static GetAllRoomRents = this.BaseURL + "/all-room_rents";
  static RentRoom = this.BaseURL + "/rent-room";
  static CancelRentRoom = this.BaseURL + "/cancel-rent-room/";


  static ShowRenters = this.BaseURL + "/all-renters";
  static StoreRenter = this.BaseURL + "/store-renter";
  static EditRenter = this.BaseURL + "/edit-renter/";
  static UpdateRenter = this.BaseURL + "/update-renter/";
  static DeleteRenter = this.BaseURL + "/delete-renter/";

  static ShowRoles = this.BaseURL + "/all-roles";

  static ShowMotorbikes = this.BaseURL + "/all-motorbikes";
  static StoreMotorbike = this.BaseURL + "/store-motorbike";
  static EditMotorbike = this.BaseURL + "/edit-motorbike/";
  static UpdateMotorbike = this.BaseURL + "/update-motorbike/";
  static DeleteMotorbike = this.BaseURL + "/delete-motorbike/";
  static GetAllMotorbikeOwners = this.BaseURL + "/all-motorbike_owners";
  
  static FindName = this.BaseURL + "/get-name/";

  static ShowServices = this.BaseURL + "/all-services";
  static StoreService = this.BaseURL + "/store-service";
  static EditService = this.BaseURL + "/edit-service/";
  static UpdateService = this.BaseURL + "/update-service/";
  static DeleteService = this.BaseURL + "/delete-service/";
  static GetOptionalServices = this.BaseURL + "/all-optional-services";
  
  static ShowRegistrations = this.BaseURL + "/all-registrations";
  static RegisterService = this.BaseURL + "/register-service";
  static UnregisterService = this.BaseURL + "/unregister-service/";
}

export default AppUrl;
