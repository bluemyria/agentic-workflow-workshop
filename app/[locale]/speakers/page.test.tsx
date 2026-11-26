import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@/tests/utils/render";
import type { Session } from "@/types/session";

import SpeakersPage from "./page";

const { fetchSessions } = vi.hoisted(() => ({
  fetchSessions: vi.fn<() => Promise<Session[]>>(),
}));

// The real service talks to Supabase through Next's cache.
vi.mock("@/services/sessions", () => ({ fetchSessions }));

// The server translation helpers need a Next request; the mock returns the key.
vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
  setRequestLocale: vi.fn(),
}));

function session(overrides: Partial<Session>): Session {
  return {
    id: "id",
    title: "Title",
    speaker: "Speaker",
    track: "React",
    room: "Main Hall",
    startTime: "09:00",
    durationMinutes: 45,
    description: "",
    ...overrides,
  };
}

async function renderPage() {
  render(await SpeakersPage({ params: Promise.resolve({ locale: "en" }) }));
}

describe("SpeakersPage", () => {
  it("renders one card per speaker under the page heading", async () => {
    fetchSessions.mockResolvedValue([
      session({ id: "keynote", speaker: "Marta Fernandez" }),
      session({ id: "rsc", speaker: "Naia Etxeberria" }),
      session({ id: "closing-panel", speaker: "Full speaker lineup" }),
    ]);

    await renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "title" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual(["Marta Fernandez", "Naia Etxeberria"]);
    expect(screen.queryByText("empty")).not.toBeInTheDocument();
  });

  it("shows the empty message when there are no sessions", async () => {
    fetchSessions.mockResolvedValue([]);

    await renderPage();

    expect(screen.getByText("empty")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });
});
