class AppUrl {
  //Set base URL
  static BaseURL = "http://127.0.0.1:8000/api";

  static Login = this.BaseURL + "/login";
  static GetUserProfile = this.BaseURL + "/get-user-profile";

  static ContactUs = this.BaseURL + "/contact-us";

  static AvailableRooms = this.BaseURL + "/all-available-rooms";
  static AvailableRoomDetails = this.BaseURL + "/available-room-details/";

  static CheckAdminAuthenticated = this.BaseURL + "/check-admin-authenticated";
  static GetAllUsers = this.BaseURL + "/all-users";

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
  static GetRoomDetails = this.BaseURL + "/room-details/";

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

  static GetRegisteredServices = this.BaseURL + "/all-registered_services/";
  static CreateTemporaryInvoice = this.BaseURL + "/create-temporary-invoice/";
  static ShowInvoices = this.BaseURL + "/all-invoices";
  static StoreInvoice = this.BaseURL + "/store-invoice/";
  static InvoiceDetails = this.BaseURL + "/edit-invoice/";
  static UpdateInvoice = this.BaseURL + "/update-invoice/";
  static DeleteInvoice = this.BaseURL + "/delete-invoice/";
  static SendInvoice = this.BaseURL + "/send-invoice/";
  static GetRenterInvoices = this.BaseURL + "/get-renter-invoices/";

  static MakeInvoicePayment = this.BaseURL + "/make-payment/";

  static SendAnnouncement = this.BaseURL + "/send-announcement";

  static GetBalance = this.BaseURL + "/get-balance";
  static UpdateBalance = this.BaseURL + "/update-balance";
  static GetRecentBalanceChanges = this.BaseURL + "/recent-balance-changes";
  static GetPieChartData = this.BaseURL + "/get-pie-chart-data";
  static UpdateBalanceChange = this.BaseURL + "/update-balance-change/";
  static DeleteBalanceChange = this.BaseURL + "/delete-balance-change/";

  static ShowBreaches = this.BaseURL + "/all-breaches";
  static StoreBreach = this.BaseURL + "/store-breach";
  static UpdateBreach = this.BaseURL + "/update-breach/";
  static DeleteBreach = this.BaseURL + "/delete-breach/";

  static ShowBreachHistories = this.BaseURL + "/all-breach-histories";
  static StoreBreachHistory = this.BaseURL + "/store-breach-history";
  static DeleteBreachHistory = this.BaseURL + "/delete-breach-history/";

  static GetTotalNumberBreachMade = this.BaseURL + "/get-total-number-breach-made";
  static GetRenterTotalNumberBreachMade = this.BaseURL + "/get-renter-total-number-breach-made";
  static GetRenterBreaches = this.BaseURL + "/get-all-renter-breaches/";
  static CountRenterBreaches = this.BaseURL + "/count-renter-breaches/";

  static ShowRoomContracts = this.BaseURL + "/all-room-contracts";
  static StoreRoomContract = this.BaseURL + "/store-room-contract";
  static UpdateRoomContract = this.BaseURL + "/update-room-contract/";
  static DeleteRoomContract = this.BaseURL + "/delete-room-contract/";
  static GetRoomContractDetails = this.BaseURL + "/get-room-contract-details/";
  static UpdateSignatures = this.BaseURL + "/update-signatures/";

  static CountRentersByGender = this.BaseURL + "/count-renters-by-gender";
  static CountRoomsByStatus = this.BaseURL + "/count-rooms-by-status";
  static CountUsedServices = this.BaseURL + "/count-used-services";
  static GetPaidInvoicesRate = this.BaseURL + "/get-paid-invoices-rate";
  static ReportBreaches = this.BaseURL + "/report-breaches";

  static ShowProblems = this.BaseURL + "/all-problems";
  
  static ReplyProblem = this.BaseURL + "/reply-problem/";
  static DeleteProblem = this.BaseURL + "/delete-problem/";
  static GetProblemDetails = this.BaseURL + "/get-problem-details/";
  static UpdateProblemStatus = this.BaseURL + "/update-problem-status/";
}

export default AppUrl;
