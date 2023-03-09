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
import { useEffect, useState } from "react";
import Modal from "react-modal";
import Skeleton from "react-loading-skeleton";
import { getEndingSaldo } from "@/helpers/saldo.helper";
import { deleteSaldo, useGetSaldos } from "@/helpers/client-side.helper";
import { Saldo } from "@/models/saldo.model";
import { StringHelper } from "@/helpers/string.helper";
import Seo from "@/components/seo/seo.component";
import SaldoOverviewCard from "@/components/saldo-overview-card/saldo-overview-card.component";

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

  const [skeletonSaldos, setSkeletonSaldos] = useState<string[]>([]);

  const { data, error, isLoading, mutate } = useGetSaldos();
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    data?.forEach((d) => {
      if (skeletonSaldos.includes(d.id)) {
        setSkeletonSaldos((e) => e.filter((s) => s !== d.id));
      }
    });
  }, [data]);

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
        onRequestClose={() => setIsOpen(false)}
        isOpen={modalIsOpen}
      >
        <CreateSaldo
          saldo={selectedSaldo}
          onSubmit={() => {
            setIsOpen(false);

            if (selectedSaldo)
              setSkeletonSaldos([...skeletonSaldos, selectedSaldo.id]);
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
          <SaldoOverviewCard skeleton={true}></SaldoOverviewCard>
        )}
        {data?.map((saldo) => (
          <SaldoOverviewCard
            key={saldo.id}
            saldo={saldo}
            skeleton={skeletonSaldos.includes(saldo.id)}
            onEdit={(saldo) => {
              setSelectedSaldo(saldo);
              setIsOpen(true);
            }}
            onDelete={(saldo) => {
              setSkeletonSaldos([...skeletonSaldos, saldo.id]);
            }}
          />
        ))}
      </ColGrid>
    </Shell>
  );
}
