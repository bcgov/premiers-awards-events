import api from "./api.services";

class UsersDataService {
  getAllUsers() {
    return api.get("/users/view");
  }

  getUserByID(guid) {
    return api.get(`/users/view/${guid}`);
  }

  getUserInfo() {
    return api.get(`users/info`);
  }

  login() {
    return api.get("users/login");
  }

  logout() {
    return api.get("users/logout");
  }

  activate(guid) {
    return api.get(`users/activate/${guid}`);
  }

  getUserByRegistration(registrationID) {
    return api.get(`/users/${registrationID}`);
  }

  registerUser(data) {
    return api.post("users/register", data);
  }

  deleteUser(id) {
    return api.get(`/users/delete/${id}`);
  }

  updateUser(id, data) {
    return api.post(`/users/update/${id}`, data);
  }

  findBy(name) {
    return api.get(`/users?firstname=${name}`);
  }
}
export default new UsersDataService();
