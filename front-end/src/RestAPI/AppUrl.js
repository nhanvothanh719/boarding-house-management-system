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

  static ShowRenters = this.BaseURL + "/all-renters";
  static StoreRenter = this.BaseURL + "/store-renter";
  static EditRenter = this.BaseURL + "/edit-renter/";
  static UpdateRenter = this.BaseURL + "/update-renter/";
  static DeleteRenter = this.BaseURL + "/delete-renter/";

  static ShowRoles = this.BaseURL + "/all-roles";
}

export default AppUrl;
