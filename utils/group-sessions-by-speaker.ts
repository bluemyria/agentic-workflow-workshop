import type { Session } from "@/types/session";

export interface SpeakerWithSessions {
  name: string;
  sessions: Session[];
}

/**
 * `speaker` values that name a group rather than one person — the closing
 * panel is listed as "Full speaker lineup". They are not shown as speakers.
 */
const NON_PERSON_SPEAKERS = new Set(["Full speaker lineup"]);

/**
 * Groups sessions by speaker. Speakers are sorted by name, and each speaker's
 * sessions by start time.
 */
export function groupSessionsBySpeaker(
  sessions: Session[],
): SpeakerWithSessions[] {
  const bySpeaker = new Map<string, Session[]>();

  for (const session of sessions) {
    if (NON_PERSON_SPEAKERS.has(session.speaker)) continue;

    const speakerSessions = bySpeaker.get(session.speaker) ?? [];
    speakerSessions.push(session);
    bySpeaker.set(session.speaker, speakerSessions);
  }

  return Array.from(bySpeaker, ([name, speakerSessions]) => ({
    name,
    sessions: speakerSessions.toSorted((a, b) =>
      a.startTime.localeCompare(b.startTime),
    ),
  })).sort((a, b) => a.name.localeCompare(b.name));
}
