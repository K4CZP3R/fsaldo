import CreateSaldo from "@/components/create-saldo/create-saldo.component";
import Shell from "@/components/shell/shell.component";
// import { deleteSaldo, getSaldos } from "@/helpers/client-side.helper";
// import { Saldo } from "@/models/saldo.model";
import useSWR from "swr";
import {
  Button,
  Callout,
  Card,
  ColGrid,
  Flex,
  Footer,
  Metric,
  Text,
} from "@tremor/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from "react-modal";
import Skeleton from "react-loading-skeleton";
import { getEndingSaldo } from "@/helpers/saldo.helper";
import { deleteSaldo, useGetSaldos } from "@/helpers/client-side.helper";
import { Saldo } from "@/models/saldo.model";
import { StringHelper } from "@/helpers/string.helper";
import Seo from "@/components/seo/seo.component";

const customStyles = {
  content: {
    height: "fit-content",
    top: "50%",
    bottom: "auto",
    transform: "translateY(-50%)",
  },
};

export default function SaldoIndex() {
  const [selectedSaldo, setSelectedSaldo] = useState<Saldo>();
  const router = useRouter();

  const { data, error, isLoading, mutate } = useGetSaldos();
  const [modalIsOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
    mutate();
  }

  function onDeleteSaldo(id: string) {
    deleteSaldo(id).then(() => mutate(data?.filter((s) => s.id !== id)));
  }

  return (
    <Shell title="Saldos" text="Create, view, delete your saldos. ">
      <Seo title="Saldos" />
      {error && <Callout title="error" text={error.message} color="red" />}
      <Button
        text="Create saldo"
        onClick={() => {
          setSelectedSaldo(undefined);
          setIsOpen(true);
        }}
      />
      <Modal
        style={customStyles}
        onRequestClose={closeModal}
        isOpen={modalIsOpen}
      >
        <CreateSaldo
          saldo={selectedSaldo}
          onSubmit={() => {
            closeModal();
          }}
        ></CreateSaldo>
      </Modal>
      <ColGrid
        numColsSm={1}
        numColsMd={2}
        numColsLg={3}
        gapX="gap-x-6"
        gapY="gap-y-6"
        marginTop="mt-6"
      >
        {isLoading && !error && (
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
        {data?.map((saldo) => (
          <Card key={saldo.id}>
            <Text>{saldo.name}</Text>
            <Metric>
              {StringHelper.valuta(getEndingSaldo(saldo.saldoEntry))}
            </Metric>
            <Text>
              {saldo.debitLimit
                ? `Debit limit of ${StringHelper.valuta(saldo.debitLimit)}`
                : "No debit limit"}
            </Text>
            <Footer>
              <Flex>
                <Button
                  onClick={() => router.push(`/saldo/${saldo.id}`)}
                  variant="light"
                  size="sm"
                  text="View"
                />
                <Button
                  onClick={() => {
                    setSelectedSaldo(saldo);
                    setIsOpen(true);
                  }}
                  variant="light"
                  size="sm"
                  text="Edit"
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
