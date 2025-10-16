"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { versoesApi } from "@/services/api";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";

interface HistoricoItem {
  id: number;
  statusAnterior: string | null;
  statusNovo: string;
  motivo?: string;
  criadoEm: string;
}

interface HistoricoVersaoProps {
  orcamentoId: number;
  versaoId: number;
}

export default function HistoricoVersao({
  orcamentoId,
  versaoId,
}: HistoricoVersaoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHistorico = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await versoesApi.getHistorico(orcamentoId, versaoId);
      setHistorico(response.data);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isExpanded && historico.length === 0) {
      loadHistorico();
    }
  }, [isExpanded]);

  const getStatusText = (status: string) => {
    const statusMap = {
      rascunho: "Rascunho",
      enviada: "Enviada",
      aprovada: "Aprovada",
      rejeitada: "Rejeitada",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Histórico de Alterações
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          {loading ? (
            <p className="text-sm text-gray-500">Carregando histórico...</p>
          ) : historico.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma alteração registrada</p>
          ) : (
            <div className="space-y-3">
              {historico.map((item, index) => (
                <div key={item.id} className="flex items-start gap-3 text-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    {index < historico.length - 1 && (
                      <div className="w-px h-6 bg-gray-300 mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {item.statusAnterior
                          ? `${getStatusText(item.statusAnterior)} → ${getStatusText(item.statusNovo)}`
                          : `Status alterado para ${getStatusText(item.statusNovo)}`}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.criadoEm).toLocaleString()}
                      </span>
                    </div>
                    {item.motivo && (
                      <p className="text-gray-600 mt-1">{item.motivo}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}