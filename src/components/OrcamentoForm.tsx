"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientesApi, orcamentosApi } from "@/services/api";
import { Cliente, Orcamento } from "@/types";

const orcamentoSchema = z.object({
  clienteId: z.number().min(1, "Cliente é obrigatório"),
  dataEvento: z.string().min(1, "Data do evento é obrigatória"),
  horaEvento: z.string().min(1, "Hora do evento é obrigatória"),
  localEvento: z.string().min(1, "Local do evento é obrigatório"),
  numeroPessoas: z.number().min(1, "Número de pessoas é obrigatório"),
});

type OrcamentoFormData = z.infer<typeof orcamentoSchema>;

interface OrcamentoFormProps {
  orcamento?: Orcamento;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function OrcamentoForm({
  orcamento,
  onSuccess,
  onCancel,
}: OrcamentoFormProps) {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OrcamentoFormData>({
    resolver: zodResolver(orcamentoSchema),
    defaultValues: orcamento
      ? {
          clienteId: orcamento.clienteId,
          dataEvento: orcamento.dataEvento.split("T")[0],
          horaEvento: orcamento.dataEvento.split("T")[1]?.substring(0, 5) || "",
          localEvento: orcamento.localEvento,
          numeroPessoas: orcamento.numeroPessoas,
        }
      : undefined,
  });

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    if (orcamento && clientes.length > 0) {
      setValue("clienteId", orcamento.clienteId);
    }
  }, [orcamento, clientes, setValue]);

  const loadClientes = async () => {
    try {
      const response = await clientesApi.list();
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  const onSubmit = async (data: OrcamentoFormData) => {
    setLoading(true);
    try {
      const { horaEvento, ...restData } = data;
      const orcamentoData = {
        ...restData,
        dataEvento: `${data.dataEvento}T${horaEvento}:00.000Z`,
        status: "rascunho" as const,
      };

      if (orcamento) {
        await orcamentosApi.update(orcamento.id, orcamentoData);
      } else {
        await orcamentosApi.create(orcamentoData);
      }
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {orcamento ? "Editar Orçamento" : "Novo Orçamento"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="clienteId">Cliente</Label>
            <select
              id="clienteId"
              {...register("clienteId", { valueAsNumber: true })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
            {errors.clienteId && (
              <p className="text-sm text-red-600">{errors.clienteId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataEvento">Data do Evento</Label>
              <Input id="dataEvento" type="date" {...register("dataEvento")} />
              {errors.dataEvento && (
                <p className="text-sm text-red-600">
                  {errors.dataEvento.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="horaEvento">Hora do Evento</Label>
              <Input id="horaEvento" type="time" {...register("horaEvento")} />
              {errors.horaEvento && (
                <p className="text-sm text-red-600">
                  {errors.horaEvento.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="localEvento">Local do Evento</Label>
            <Input
              id="localEvento"
              {...register("localEvento")}
              placeholder="Local onde será realizado o evento"
            />
            {errors.localEvento && (
              <p className="text-sm text-red-600">
                {errors.localEvento.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="numeroPessoas">Número de Pessoas</Label>
            <Input
              id="numeroPessoas"
              type="number"
              {...register("numeroPessoas", { valueAsNumber: true })}
              placeholder="Quantidade de pessoas"
            />
            {errors.numeroPessoas && (
              <p className="text-sm text-red-600">
                {errors.numeroPessoas.message}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
