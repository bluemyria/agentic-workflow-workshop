import { Card, CardContent, CardTitle } from "@/components/atoms/card";
import { Link } from "@/i18n/navigation";
import type { Session } from "@/types/session";
import { Flex, Text } from "@chakra-ui/react";

export type SpeakerSession = Pick<Session, "id" | "title" | "startTime">;

interface SpeakerCardProps {
  name: string;
  sessions: SpeakerSession[];
}

export function SpeakerCard({ name, sessions }: SpeakerCardProps) {
  return (
    <Card height="full">
      <CardContent gap="4">
        <CardTitle as="h2" fontSize="lg" fontWeight="bold">
          {name}
        </CardTitle>

        {/* role="list": WebKit drops the list role when list-style is none. */}
        <Flex
          as="ul"
          role="list"
          direction="column"
          gap="3"
          listStyleType="none"
        >
          {sessions.map((session) => (
            <li key={session.id}>
              <Link href={`/sessions/${session.id}`}>
                <Flex
                  as="span"
                  data-group
                  direction="column"
                  gap="1"
                  fontSize="sm"
                >
                  <Text asChild color="var(--text-muted)">
                    <time dateTime={session.startTime}>
                      {session.startTime}
                    </time>
                  </Text>
                  <Text
                    as="span"
                    fontWeight="medium"
                    css={{
                      "[data-group]:hover &": { textDecoration: "underline" },
                    }}
                  >
                    {session.title}
                  </Text>
                </Flex>
              </Link>
            </li>
          ))}
        </Flex>
      </CardContent>
    </Card>
  );
}
