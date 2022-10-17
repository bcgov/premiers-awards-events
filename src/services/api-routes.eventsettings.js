import api from "./api.services";
class SettingsDataService {
  getSettings() {
    return api.get("/tables/settings");
  }

  updateSettings(data) {
    return api.post("/tables/settings", data);
  }
}
export default new SettingsDataService();
