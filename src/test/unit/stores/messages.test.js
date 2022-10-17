import { expect, describe, beforeEach, it } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useMessageStore } from "../../../stores/messages";

const defaultMessage = {
  text: "",
  type: "",
  spinner: false,
};

const newMessage = {
  text: "Testing Message",
  type: "Warning",
  spinner: true,
};

describe("Messages Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("returns the current message information", async () => {
    const messageStore = useMessageStore();

    expect(messageStore.message).toStrictEqual(defaultMessage);
  });

  it("updates the current message", async () => {
    const messageStore = useMessageStore();
    expect(messageStore.message).toStrictEqual(defaultMessage);

    messageStore.setMessage(newMessage);

    expect(messageStore.message).toStrictEqual({
      text: "Testing Message",
      type: "Warning",
      spinner: true,
    });
  });
});
