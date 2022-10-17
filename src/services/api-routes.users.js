import api from "./api.services";

class UsersDataService {
  getAllUsers() {
    return api.get("/admin/users/view");
  }

  getUserByID(guid) {
    return api.get(`/admin/users/view/${guid}`);
  }

  getUserInfo() {
    return api.get(`/admin/users/info`);
  }

  login() {
    return api.get("/admin/users/login");
  }

  logout() {
    return api.get("/admin/users/logout");
  }

  activate(guid) {
    return api.get(`/admin/users/activate/${guid}`);
  }

  getUserByRegistration(registrationID) {
    return api.get(`/users/${registrationID}`);
  }

  registerUser(data) {
    return api.post("/admin/users/register", data);
  }

  deleteUser(id) {
    return api.get(`/admin/users/delete/${id}`);
  }

  updateUser(id, data) {
    return api.post(`/admin/users/update/${id}`, data);
  }

  findBy(name) {
    return api.get(`/admin/users?firstname=${name}`);
  }
}
export default new UsersDataService();
