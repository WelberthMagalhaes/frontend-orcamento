'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import OrcamentoForm from '@/components/OrcamentoForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { orcamentosApi } from '@/services/api';
import { Orcamento } from '@/types';

export default function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrcamento, setEditingOrcamento] = useState<Orcamento | undefined>();

  useEffect(() => {
    loadOrcamentos();
  }, []);

  const loadOrcamentos = async () => {
    try {
      const response = await orcamentosApi.list();
      setOrcamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingOrcamento(undefined);
    loadOrcamentos();
  };

  const handleEdit = (orcamento: Orcamento) => {
    setEditingOrcamento(orcamento);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        await orcamentosApi.delete(id);
        loadOrcamentos();
      } catch (error) {
        console.error('Erro ao excluir orçamento:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rascunho': return 'text-gray-600';
      case 'enviado': return 'text-blue-600';
      case 'aprovado': return 'text-green-600';
      case 'rejeitado': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div>Carregando...</div>
      </AdminLayout>
    );
  }

  if (showForm) {
    return (
      <AdminLayout>
        <OrcamentoForm
          orcamento={editingOrcamento}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingOrcamento(undefined);
          }}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Orçamentos</h2>
          <Button onClick={() => setShowForm(true)}>Novo Orçamento</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {orcamentos.length === 0 ? (
              <p className="text-gray-500">Nenhum orçamento encontrado</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data Evento</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Pessoas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orcamentos.map((orcamento) => (
                    <TableRow key={orcamento.id}>
                      <TableCell>{orcamento.cliente?.nome || `Cliente ${orcamento.clienteId}`}</TableCell>
                      <TableCell>{new Date(orcamento.dataEvento).toLocaleString()}</TableCell>
                      <TableCell>{orcamento.localEvento}</TableCell>
                      <TableCell>{orcamento.numeroPessoas}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getStatusColor(orcamento.status)}`}>
                          {orcamento.status.charAt(0).toUpperCase() + orcamento.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `/orcamentos/${orcamento.id}`}
                          >
                            Ver
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(orcamento)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(orcamento.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
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