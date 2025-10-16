"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { versoesApi } from "@/services/api";
import { VersaoOrcamento } from "@/types";
import { CheckCircle, XCircle, Clock, Edit, RotateCcw } from "lucide-react";

interface VersaoOrcamentoActionsProps {
  versao: VersaoOrcamento;
  orcamentoId: number;
  onUpdate: () => void;
}

export default function VersaoOrcamentoActions({
  versao,
  orcamentoId,
  onUpdate,
}: VersaoOrcamentoActionsProps) {
  const [isReabrirModalOpen, setIsReabrirModalOpen] = useState(false);
  const [motivo, setMotivo] = useState("");

  const getStatusBadge = (status: string) => {
    const configs = {
      rascunho: { color: "secondary", icon: Edit, text: "Rascunho" },
      enviada: { color: "default", icon: Clock, text: "Enviada" },
      aprovada: { color: "default", icon: CheckCircle, text: "Aprovada" },
      rejeitada: { color: "destructive", icon: XCircle, text: "Rejeitada" },
    };

    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;

    return (
      <Badge variant={config.color as "default" | "secondary" | "destructive"} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const aprovarVersao = async () => {
    const confirmMsg = `⚠️ Confirmar aprovação desta versão?

Após aprovar:
• Esta versão será marcada como aprovada
• Você poderá reabrir posteriormente se necessário
• Todo o histórico será mantido`;

    if (!confirm(confirmMsg)) return;

    try {
      await versoesApi.aprovar(orcamentoId, versao.id);
      onUpdate();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      alert(`Erro: ${errorMessage}`);
    }
  };

  const rejeitarVersao = async () => {
    if (!confirm("Tem certeza que deseja rejeitar esta versão?")) return;

    try {
      await versoesApi.rejeitar(orcamentoId, versao.id);
      onUpdate();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      alert(`Erro: ${errorMessage}`);
    }
  };

  const reabrirVersao = async () => {
    try {
      await versoesApi.reabrir(orcamentoId, versao.id, motivo || undefined);
      setIsReabrirModalOpen(false);
      setMotivo("");
      onUpdate();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      alert(`Erro: ${errorMessage}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getStatusBadge(versao.status)}

      {versao.status === "enviada" && (
        <>
          <Button size="sm" onClick={aprovarVersao}>
            Aprovar
          </Button>
          <Button variant="destructive" size="sm" onClick={rejeitarVersao}>
            Rejeitar
          </Button>
        </>
      )}

      {(versao.status === "aprovada" || versao.status === "rejeitada") && (
        <Dialog open={isReabrirModalOpen} onOpenChange={setIsReabrirModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reabrir para Revisão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reabrir Versão para Revisão</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Esta versão será reaberta como rascunho e poderá ser editada
                novamente.
              </p>
              <div>
                <label className="text-sm font-medium">
                  Motivo da reabertura (opcional):
                </label>
                <Textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ex: Correção de valores, alteração de itens..."
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsReabrirModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={reabrirVersao}>Reabrir Versão</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
