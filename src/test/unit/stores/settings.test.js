import { expect, describe, beforeEach, it } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useSettingsStore } from "../../../stores/settings";

const defaultSettings = {
  year: null,
  salesopen: "",
  salesclose: "",
};

const date1 = new Date("2022-10-01");
const date2 = new Date("2022-10-01");

const newSettings = {
  year: 2024,
  salesopen: date1,
  salesclose: date2,
};

describe("Settings Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("returns the current settings information", async () => {
    const settingStore = useSettingsStore();

    expect(settingStore.settings).toStrictEqual(defaultSettings);
  });

  it("updates the current settings", async () => {
    const settingStore = useSettingsStore();
    await settingStore.fillSettings();
    expect(settingStore.settings).not.toStrictEqual(defaultSettings);
  });
});
