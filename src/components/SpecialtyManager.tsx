
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, X } from 'lucide-react';

interface SpecialtyManagerProps {
  specialties: string[];
  onAddSpecialty: (specialty: string) => void;
  onRemoveSpecialty: (specialty: string) => void;
  error?: string;
}

const SpecialtyManager: React.FC<SpecialtyManagerProps> = ({
  specialties,
  onAddSpecialty,
  onRemoveSpecialty,
  error
}) => {
  const [newSpecialty, setNewSpecialty] = React.useState('');
  const [customSpecialty, setCustomSpecialty] = React.useState('');

  const availableSpecialties = [
    'Musculação', 'Crossfit', 'Yoga', 'Pilates', 'Funcional',
    'Natação', 'Hidroginástica', 'Spinning', 'Zumba', 'Boxe',
    'Muay Thai', 'Dança', 'Step', 'Aeróbica'
  ];

  const handleAddPredefined = () => {
    if (newSpecialty && !specialties.includes(newSpecialty)) {
      onAddSpecialty(newSpecialty);
      setNewSpecialty('');
    }
  };

  const handleAddCustom = () => {
    if (customSpecialty.trim() && !specialties.includes(customSpecialty.trim())) {
      onAddSpecialty(customSpecialty.trim());
      setCustomSpecialty('');
    }
  };

  const handleCustomKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Especialidades *</label>
      <div className="space-y-3">
        {/* Select predefinido */}
        <div className="flex space-x-2">
          <Select value={newSpecialty} onValueChange={setNewSpecialty}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione uma especialidade" />
            </SelectTrigger>
            <SelectContent>
              {availableSpecialties
                .filter(specialty => !specialties.includes(specialty))
                .map(specialty => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={handleAddPredefined}
            disabled={!newSpecialty || specialties.includes(newSpecialty)}
            variant="outline"
          >
            <Plus size={16} />
          </Button>
        </div>

        {/* Input para especialidade customizada */}
        <div className="flex space-x-2">
          <Input
            value={customSpecialty}
            onChange={(e) => setCustomSpecialty(e.target.value)}
            placeholder="Digite uma especialidade personalizada"
            onKeyPress={handleCustomKeyPress}
          />
          <Button
            type="button"
            onClick={handleAddCustom}
            disabled={!customSpecialty.trim() || specialties.includes(customSpecialty.trim())}
            variant="outline"
          >
            <Plus size={16} />
          </Button>
        </div>

        {/* Lista de especialidades adicionadas */}
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty) => (
            <Badge
              key={specialty}
              variant="secondary"
              className="flex items-center space-x-1 px-3 py-1"
            >
              <span>{specialty}</span>
              <button
                type="button"
                onClick={() => onRemoveSpecialty(specialty)}
                className="ml-1 hover:text-red-500"
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default SpecialtyManager;
