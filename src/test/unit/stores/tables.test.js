import { expect, describe, beforeEach, it } from "vitest";
import { useFinancialStore } from "../../../stores/financial";
import { setActivePinia, createPinia } from "pinia";
import { useTablesStore } from "../../../stores/tables";
import { useGuestsStore } from "../../../stores/guests";

const defaultTable = {
  tablename: "",
  tablecapacity: null,
  guests: [],
};
const defaultTables = [];

describe("Table Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("returns the current table information", async () => {
    const tableStore = useTablesStore();
    expect(tableStore.table).toStrictEqual(defaultTable);
    expect(tableStore.tables).toStrictEqual(defaultTables);

    await tableStore.fillTables();
    expect(tableStore.tables.length).toBeGreaterThanOrEqual(1);
  });
});
