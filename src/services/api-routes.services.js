import api from "./api.services";
class RegistrationsDataService {
  getAllGuests() {
    return api.get("/tables/guests");
  }

  getGuest(id) {
    return api.get(`/tables/guests/${id}`);
  }

  getGuestsByRegistration(registrationID) {
    return api.get(`/tables/registrations/${registrationID}/guests`);
  }

  createGuest(data) {
    return api.post("/tables/guests", data);
  }

  deleteGuest(id) {
    return api.post(`/tables/guests/delete/${id}`);
  }

  updateGuest(id, data) {
    return api.post(`/tables/guests/${id}`, data);
  }

  getAllRegistrations() {
    return api.get("/tables/registrations");
  }

  getRegistration(guid) {
    return api.get(`/tables/registrations/${guid}`);
  }

  createRegistration(data) {
    return api.post("/tables/registrations", data);
  }

  updateRegistration(id, data) {
    return api.post(`/tables/registrations/${id}`, data);
  }

  pushToRegistration(id, data) {
    return api.post(`/tables/registrations/${id}/push`, data);
  }

  pullFromRegistration(id, data) {
    return api.post(`/tables/registrations/${id}/pull`, data);
  }

  deleteRegistration(id) {
    return api.post(`/tables/registrations/delete/${id}`);
  }
  findBy(name) {
    return api.get(`/tables/guests?name=${name}`);
  }
}
export default new RegistrationsDataService();
