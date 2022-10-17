import { expect, describe, beforeEach, it } from "vitest";
import apiRoutesUsers from "../../../services/api-routes.users";
import apiRoutesServices from "../../../services/api-routes.services";
import apiRoutesTables from "../../../services/api-routes.tables";
import apiRoutesEventsettings from "../../../services/api-routes.eventsettings";

describe("API Testing", () => {
  it("accesses user information", async () => {
    expect(await apiRoutesUsers.getAllUsers()).toHaveProperty("status", 200);
  });
  it("accesses guest information", async () => {
    expect(await apiRoutesServices.getAllGuests()).toHaveProperty(
      "status",
      200
    );
  });
  it("accesses financial registration information", async () => {
    expect(await apiRoutesServices.getAllRegistrations()).toHaveProperty(
      "status",
      200
    );
  });
  it("accesses table information", async () => {
    expect(await apiRoutesTables.getAllTables()).toHaveProperty("status", 200);
  });
  it("accesses event settings information", async () => {
    expect(await apiRoutesEventsettings.getSettings()).toHaveProperty(
      "status",
      200
    );
  });
});
