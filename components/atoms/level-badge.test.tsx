import { describe, expect, it } from "vitest";

import { render, screen } from "@/tests/utils/render";

import { LevelBadge } from "./level-badge";

describe("LevelBadge", () => {
  it.each([
    ["beginner", "Beginner"],
    ["intermediate", "Intermediate"],
    ["advanced", "Advanced"],
  ] as const)("shows the translated label for %s", (level, label) => {
    render(<LevelBadge level={level} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
