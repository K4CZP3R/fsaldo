import CreateSaldo from "@/components/create-saldo/create-saldo.component";
import Shell from "@/components/shell/shell.component";
import { deleteSaldo, getSaldos } from "@/helpers/client-side.helper";
import { Saldo } from "@/models/saldo.model";
import {
  Button,
  Card,
  ColGrid,
  Flex,
  Footer,
  Metric,
  Text,
} from "@tremor/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import Skeleton from "react-loading-skeleton";

const customStyles = {
  content: {
    height: "fit-content",
    top: "50%",
    bottom: "auto",
    transform: "translateY(-50%)",
  },
};

export default function SaldoIndex() {
  const [saldos, setSaldos] = useState<Saldo[]>();
  const router = useRouter();

  useEffect(() => {
    fetchSaldos();
  }, []);

  const fetchSaldos = useCallback(async () => {
    getSaldos()
      .then((saldos) => setSaldos(saldos ?? []))
      .catch(() => console.log("errortjes"));
  }, []);

  const [modalIsOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
    fetchSaldos();
  }

  function onDeleteSaldo(id: string) {
    deleteSaldo(id).then(() => fetchSaldos());
  }

  return (
    <Shell title="Saldos" text="Create, view, delete your saldos.">
      <Button text="Create saldo" onClick={() => setIsOpen(true)} />
      <Modal
        style={customStyles}
        onRequestClose={closeModal}
        isOpen={modalIsOpen}
      >
        <CreateSaldo
          onSubmit={() => {
            closeModal();
          }}
        ></CreateSaldo>
      </Modal>

      <ColGrid
        numCols={2}
        numColsLg={3}
        gapX="gap-x-6"
        gapY="gap-y-6"
        marginTop="mt-6"
      >
        {!saldos && (
          <>
            <Card>
              <Text>
                <Skeleton />
              </Text>
              <Metric>
                <Skeleton />
              </Metric>
            </Card>
          </>
        )}
        {saldos?.map((saldo) => (
          <Card key={saldo.id}>
            <Text>{saldo.name}</Text>
            <Metric>0,00</Metric>
            <Footer>
              <Flex>
                <Button
                  onClick={() => router.push(`/saldo/${saldo.id}`)}
                  variant="light"
                  size="sm"
                  text="View"
                />

                <Button
                  onClick={() => onDeleteSaldo(saldo.id)}
                  variant="light"
                  size="sm"
                  color="red"
                  text="Delete"
                />
              </Flex>
            </Footer>
          </Card>
        ))}
      </ColGrid>
    </Shell>
  );
}
