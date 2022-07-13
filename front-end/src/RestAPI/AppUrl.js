class AppUrl {
  //Set base URL
  static BaseURL = "http://127.0.0.1:8000/api";
  
  static ContactUs = this.BaseURL + '/contact-us';

  static AvailableRooms = this.BaseURL + '/all-available-rooms';
  static AvailableRoomDetails = this.BaseURL + '/room-details/';

  static CheckAuthenticated = this.BaseURL + '/check-authenticated';

  static StoreCategory = this.BaseURL + '/store-category';
}

export default AppUrl;
