import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  HomeModernIcon,
} from "@heroicons/react/24/solid";
import { Metric, Flex, Subtitle, Button } from "@tremor/react";
import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <Flex>
      <Flex justifyContent="justify-start" spaceX="space-x-4">
        <Button
          onClick={() => {
            router.back();
          }}
          icon={ArrowLeftIcon}
          variant="light"
          size="lg"
        ></Button>

        <Button
          onClick={() => {
            router.push("/");
          }}
          icon={HomeIcon}
          variant="light"
          size="lg"
        >
          fsaldo
        </Button>
      </Flex>
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
