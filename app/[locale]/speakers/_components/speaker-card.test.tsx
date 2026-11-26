import { describe, expect, it } from "vitest";

import { render, screen } from "@/tests/utils/render";

import { SpeakerCard } from "./speaker-card";

const sessions = [
  { id: "opening-keynote", title: "Opening Keynote", startTime: "09:00" },
  {
    id: "rsc-diet",
    title: "Keeping Your RSC Payload on a Diet",
    startTime: "11:15",
  },
];

describe("SpeakerCard", () => {
  it("shows the speaker's name as a heading", () => {
    render(<SpeakerCard name="Marta Fernandez" sessions={sessions} />);

    expect(
      screen.getByRole("heading", { name: "Marta Fernandez" }),
    ).toBeInTheDocument();
  });

  it("lists every session with its start time and a link to its page", () => {
    render(<SpeakerCard name="Marta Fernandez" sessions={sessions} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent("09:00");
    expect(links[0]).toHaveTextContent("Opening Keynote");
    expect(links[0]).toHaveAttribute("href", "/en/sessions/opening-keynote");
    expect(links[1]).toHaveAttribute("href", "/en/sessions/rsc-diet");

    // The start time is machine-readable, not just text.
    expect(screen.getByText("09:00").tagName).toBe("TIME");
    expect(screen.getByText("09:00")).toHaveAttribute("datetime", "09:00");
  });

  it("keeps the session list a list in every browser", () => {
    render(<SpeakerCard name="Marta Fernandez" sessions={sessions} />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
