import { Metric, Flex, Subtitle, Button } from "@tremor/react";
import { useSession, signOut, signIn } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  return (
    <Flex>
      <Metric color="gray" truncate={false} marginTop="mt-0">
        fsaldo
      </Metric>
      {session?.user && (
        <Flex justifyContent="justify-end" spaceX="space-x-5">
          <Subtitle marginTop="mt-0">{session?.user?.name}</Subtitle>
          <Button
            onClick={() => {
              signOut();
            }}
            variant="light"
            size="sm"
            marginTop="mt-0"
          >
            Sign out
          </Button>
        </Flex>
      )}

      {!session && (
        <Button
          onClick={() => {
            signIn();
          }}
          variant="light"
          size="sm"
          marginTop="mt-0"
        >
          Sign in
        </Button>
      )}
    </Flex>
  );
}
