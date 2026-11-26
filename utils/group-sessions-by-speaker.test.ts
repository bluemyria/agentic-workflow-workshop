import { describe, expect, it } from "vitest";

import type { Session } from "@/types/session";

import { groupSessionsBySpeaker } from "./group-sessions-by-speaker";

function session(overrides: Partial<Session>): Session {
  return {
    id: "id",
    title: "Title",
    speaker: "Speaker",
    track: "React",
    level: "beginner",
    room: "Main Hall",
    startTime: "09:00",
    durationMinutes: 45,
    description: "",
    ...overrides,
  };
}

describe("groupSessionsBySpeaker", () => {
  it("returns one entry per speaker, sorted by name", () => {
    const result = groupSessionsBySpeaker([
      session({ id: "a", speaker: "Sofia Almeida" }),
      session({ id: "b", speaker: "Diego Castellanos" }),
      session({ id: "c", speaker: "Iker Otxoa" }),
    ]);

    expect(result.map((speaker) => speaker.name)).toEqual([
      "Diego Castellanos",
      "Iker Otxoa",
      "Sofia Almeida",
    ]);
  });

  it("puts every session of a speaker on that speaker, by start time", () => {
    const result = groupSessionsBySpeaker([
      session({ id: "late", speaker: "Iker Otxoa", startTime: "15:00" }),
      session({ id: "other", speaker: "Naia Etxeberria" }),
      session({ id: "early", speaker: "Iker Otxoa", startTime: "10:15" }),
    ]);

    const iker = result.find((speaker) => speaker.name === "Iker Otxoa");
    expect(iker?.sessions.map((s) => s.id)).toEqual(["early", "late"]);
  });

  it("leaves out the closing panel's group speaker", () => {
    const result = groupSessionsBySpeaker([
      session({ id: "keynote", speaker: "Marta Fernandez" }),
      session({ id: "closing-panel", speaker: "Full speaker lineup" }),
    ]);

    expect(result.map((speaker) => speaker.name)).toEqual(["Marta Fernandez"]);
  });

  it("returns an empty list when there are no sessions", () => {
    expect(groupSessionsBySpeaker([])).toEqual([]);
  });
});
