import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@/tests/utils/render";
import type { Session } from "@/types/session";

import SessionDetailPage from "./page";

const { fetchSessionById, notFound } = vi.hoisted(() => ({
  fetchSessionById: vi.fn<(id: string) => Promise<Session | null>>(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// The real service talks to Supabase through Next's cache.
vi.mock("@/services/sessions", () => ({
  fetchSessionById,
  fetchSessions: vi.fn(),
}));

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  notFound,
}));

const session: Session = {
  id: "build-your-agentic-workflow",
  title: "Build Your Agentic Workflow",
  speaker: "Evangelia Mitsopoulou",
  track: "Agentic AI",
  level: "intermediate",
  room: "Workshop Room A",
  startTime: "09:45",
  durationMinutes: 180,
  description: "Hands-on workshop.",
};

function renderPage(id: string) {
  return SessionDetailPage({ params: Promise.resolve({ id }) });
}

describe("SessionDetailPage", () => {
  it("shows the track and the level as badges next to each other", async () => {
    fetchSessionById.mockResolvedValue(session);

    render(await renderPage(session.id));

    const track = screen.getByText("Agentic AI");
    const level = screen.getByText("Intermediate");
    expect(track.nextElementSibling).toBe(level);
    expect(
      screen.getByRole("heading", { level: 1, name: session.title }),
    ).toBeInTheDocument();
  });

  it("renders the not-found page for an unknown id", async () => {
    fetchSessionById.mockResolvedValue(null);

    await expect(renderPage("does-not-exist")).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
    expect(notFound).toHaveBeenCalled();
  });
});
