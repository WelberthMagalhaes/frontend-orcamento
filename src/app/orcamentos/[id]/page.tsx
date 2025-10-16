"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orcamentosApi, versoesApi } from "@/services/api";
import { Orcamento, VersaoOrcamento } from "@/types";
import VersaoOrcamentoActions from "@/components/VersaoOrcamentoActions";
import HistoricoVersao from "@/components/HistoricoVersao";

export default function OrcamentoDetalhePage() {
  const params = useParams();
  const orcamentoId = Number(params.id);

  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [versoes, setVersoes] = useState<VersaoOrcamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orcamentoId) {
      loadOrcamento();
      loadVersoes();
    }
  }, [orcamentoId]);

  const loadOrcamento = async () => {
    try {
      const response = await orcamentosApi.getById(orcamentoId);
      setOrcamento(response.data);
    } catch (error) {
      console.error("Erro ao carregar orçamento:", error);
    }
  };

  const loadVersoes = async () => {
    try {
      const response = await versoesApi.list(orcamentoId);
      setVersoes(response.data);
    } catch (error) {
      console.error("Erro ao carregar versões:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewVersion = async () => {
    try {
      await versoesApi.create(orcamentoId);
      loadVersoes();
    } catch (error) {
      console.error("Erro ao criar nova versão:", error);
    }
  };

  const enviarVersao = async (versaoId: number) => {
    if (
      confirm(
        "Tem certeza que deseja enviar esta versão? Ela será congelada para edição."
      )
    ) {
      try {
        await versoesApi.enviar(orcamentoId, versaoId);
        loadVersoes();
      } catch (error) {
        console.error("Erro ao enviar versão:", error);
      }
    }
  };



  if (loading) {
    return (
      <AdminLayout>
        <div>Carregando...</div>
      </AdminLayout>
    );
  }

  if (!orcamento) {
    return (
      <AdminLayout>
        <div>Orçamento não encontrado</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Orçamento #{orcamento.id} - {orcamento.cliente?.nome}
          </h2>
          <Button onClick={createNewVersion}>Nova Versão</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Orçamento</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Cliente:</strong> {orcamento.cliente?.nome}
              </p>
              <p>
                <strong>Data do Evento:</strong>{" "}
                {new Date(orcamento.dataEvento).toLocaleString()}
              </p>
            </div>
            <div>
              <p>
                <strong>Local:</strong> {orcamento.localEvento}
              </p>
              <p>
                <strong>Pessoas:</strong> {orcamento.numeroPessoas}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Versões do Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            {versoes.length === 0 ? (
              <p className="text-gray-500">Nenhuma versão encontrada</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Versão</TableHead>
                    <TableHead>Status & Ações</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead>Outras Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versoes.map((versao) => (
                    <React.Fragment key={versao.id}>
                      <TableRow>
                        <TableCell>Versão {versao.numero}</TableCell>
                        <TableCell>
                          <VersaoOrcamentoActions
                            versao={versao}
                            orcamentoId={orcamentoId}
                            onUpdate={loadVersoes}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(versao.criadaEm).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Ver Itens
                            </Button>
                            {versao.status === "rascunho" && (
                              <>
                                <Button variant="outline" size="sm">
                                  Editar
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => enviarVersao(versao.id)}
                                >
                                  Enviar
                                </Button>
                              </>
                            )}
                            {versao.status === "enviada" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={createNewVersion}
                              >
                                Nova Versão
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} className="p-0">
                          <HistoricoVersao
                            orcamentoId={orcamentoId}
                            versaoId={versao.id}
                          />
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
