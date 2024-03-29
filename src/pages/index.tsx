import { signIn, useSession } from "next-auth/react";
import Shell from "@/components/shell/shell.component";
import { HomeIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

import {
  ColGrid,
  Button,
  Card,
  Icon,
  Title,
  Text,
  Footer,
  ButtonInline,
} from "@tremor/react";
import { useRouter } from "next/router";
import Seo from "@/components/seo/seo.component";

const cards = [
  {
    title: "View all saldo items",
    text: "View all saldo items",
    icon: HomeIcon,
    path: "/saldo",
  },
];

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session)
    return (
      <Shell title="Not authenticated" text="To continue, you need to log in.">
        <Button marginTop="mt-6" onClick={() => signIn()}>
          Sign in
        </Button>
      </Shell>
    );

  return (
    <Shell title="Home" text={`Welcome ${session.user?.name},`}>
      <Seo title="Home" />
      <ColGrid numColsMd={2} gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-6">
        {cards.map((card) => (
          <Card key={card.title}>
            <Icon variant="light" icon={card.icon} size="lg" color="blue" />
            <Title marginTop="mt-6">{card.title}</Title>
            <Text marginTop="mt-2">{card.text}</Text>
            <Footer>
              <ButtonInline
                onClick={() => router.push(card.path)}
                size="sm"
                text="View"
                icon={ArrowRightIcon}
                iconPosition="right"
              />
            </Footer>
          </Card>
        ))}
      </ColGrid>
    </Shell>
  );
}
