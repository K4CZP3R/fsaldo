import Shell from "@/components/shell/shell.component";
import { getSaldos } from "@/helpers/client-side.helper";
import { Saldo } from "@/models/saldo.model";
import { Button, Card, ColGrid, Footer, Metric, Text } from "@tremor/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SaldoIndex() {
  const [saldos, setSaldos] = useState<Saldo[]>();
  const router = useRouter();

  useEffect(() => {
    getSaldos()
      .then((saldos) => setSaldos(saldos ?? []))
      .catch(() => console.log("errortjes"));
  }, []);

  return (
    <Shell title="Saldos" text="Create, view, delete your saldos.">
      <ColGrid
        numCols={2}
        numColsLg={3}
        gapX="gap-x-6"
        gapY="gap-y-6"
        marginTop="mt-6"
      >
        {saldos?.map((saldo) => (
          <Card key={saldo.id}>
            <Text>{saldo.name}</Text>
            <Metric>0,00</Metric>
            <Footer>
              <Button
                onClick={() => router.push(`/saldo/${saldo.id}`)}
                variant="light"
                size="sm"
                text="View"
              />
            </Footer>
          </Card>
        ))}
      </ColGrid>
    </Shell>
  );
}
