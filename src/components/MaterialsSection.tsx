import { FileText, Headphones, Download } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface Material {
  type: 'pdf' | 'audio';
  title: string;
  description: string;
  url?: string;
}

const materials: Material[] = [
  {
    type: 'pdf',
    title: 'Resumo da Aula',
    description: 'Pontos-chave e exercícios práticos',
  },
  {
    type: 'pdf',
    title: 'Checklist de Aplicação',
    description: 'Passo a passo para aplicar o que aprendeu',
  },
  {
    type: 'audio',
    title: 'Versão em Áudio (Podcast)',
    description: 'Ouça enquanto faz outras atividades',
  },
];

export const MaterialsSection = () => {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-xl font-bold text-foreground">📚 Materiais de Apoio</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((material, index) => (
          <Card key={index} className="p-4 transition-colors hover:border-primary/50">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/20 p-2">
                {material.type === 'pdf' ? (
                  <FileText className="h-5 w-5 text-primary" />
                ) : (
                  <Headphones className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="mb-1 font-semibold text-foreground">{material.title}</h4>
                <p className="mb-3 text-sm text-muted-foreground">{material.description}</p>
                <Button variant="outline" size="sm" className="gap-2" disabled={!material.url}>
                  <Download className="h-4 w-4" />
                  {material.url ? 'Baixar' : 'Em breve'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
