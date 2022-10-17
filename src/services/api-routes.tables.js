import api from "./api.services";
class SeatingDataService {
  getAllTables() {
    return api.get("/tables/seating/");
  }

  getTable(guid) {
    return api.get(`/tables/seating/${guid}`);
  }

  getGuestsByTable(guid) {
    return api.get(`/tables/seating/${guid}/guests`);
  }

  createTable(data) {
    return api.post("/tables/seating/", data);
  }

  createDefaultArrangment() {
    return api.post("/tables/seating/generate");
  }

  updateTable(id, data) {
    return api.post(`/tables/seating/${id}`, data);
  }
  deleteTable(id) {
    return api.post(`/tables/seating/delete/${id}`);
  }
  deleteAll() {
    return api.post(`/tables/seating/deleteall`);
  }
}
export default new SeatingDataService();
