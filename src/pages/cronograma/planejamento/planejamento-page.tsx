import { useState, useEffect, useRef } from 'react'
import {
  Container,
  FormContainer,
  FormField,
  SelectGroup,
  ButtonGroup,
  Calendar,
  CalendarContainer,
  DayCell,
  CheckboxOption,
  SearchInput,
  PlanningCardContainer,
  PlanningCard,
  DropdownContainer,
  DropdownList,
  DropdownOption,
} from './styles'
import { Api } from '../../../services/api/api'
import type { Planejamento, PlanejamentoCreate, Funcionario, Obra } from '../../../services/api/types'

export function CronogramaPlanejamento() {
  const [planejamentos, setPlanejamentos] = useState<Planejamento[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [obras, setObras] = useState<Obra[]>([])
  const [selectedFuncionarios, setSelectedFuncionarios] = useState<number[]>([])
  const [selectedObra, setSelectedObra] = useState<number | null>(null)
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [horaInicio, setHoraInicio] = useState<string>('08:00')
  const [funcionarioSearch, setFuncionarioSearch] = useState('')
  const [obraSearch, setObraSearch] = useState('')
  const [isFuncionarioDropdownOpen, setIsFuncionarioDropdownOpen] = useState(false)
  const [isObraDropdownOpen, setIsObraDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Refs para detectar cliques fora dos dropdowns
  const funcionarioRef = useRef<HTMLDivElement>(null)
  const obraRef = useRef<HTMLDivElement>(null)

  // Fechar dropdowns quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (funcionarioRef.current && !funcionarioRef.current.contains(event.target as Node)) {
        setIsFuncionarioDropdownOpen(false)
      }
      if (obraRef.current && !obraRef.current.contains(event.target as Node)) {
        setIsObraDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Gerar próximos 14 dias
  const getNext14Days = () => {
    const days = []
    const today = new Date()
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: dayNames[date.getDay()],
        dayNumber: date.getDate().toString().padStart(2, '0'),
        monthNumber: (date.getMonth() + 1).toString().padStart(2, '0'),
        isWeekend
      })
    }
    
    return days
  }

  const days = getNext14Days()

  // Buscar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [funcionariosRes, obrasRes, planejamentosRes] = await Promise.all([
          Api.getFuncionarios(),
          Api.getObras(),
          Api.getPlanejamentos()
        ])
        
        setFuncionarios(funcionariosRes.data)
        setObras(obrasRes.data)
        setPlanejamentos(planejamentosRes.data)
      } catch (err) {
        console.error('Erro ao buscar dados:', err)
        setError('Erro ao carregar dados')
      }
    }

    fetchData()
  }, [])

  // Filtrar funcionários
  const filteredFuncionarios = funcionarios.filter(func =>
    func.nome.toLowerCase().includes(funcionarioSearch.toLowerCase())
  )

  // Filtrar obras
  const filteredObras = obras.filter(obra =>
    obra.nome.toLowerCase().includes(obraSearch.toLowerCase())
  )

  const handleFuncionarioToggle = (funcionarioId: number) => {
    setSelectedFuncionarios(prev =>
      prev.includes(funcionarioId)
        ? prev.filter(id => id !== funcionarioId)
        : [...prev, funcionarioId]
    )
  }

  const handleObraSelect = (obraId: number) => {
    setSelectedObra(obraId)
    const obra = obras.find(o => o.id === obraId)
    setObraSearch(obra?.nome || '')
    setIsObraDropdownOpen(false)
  }

  const handleDateToggle = (date: string) => {
    setSelectedDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    )
  }

  // Função para formatar o título da obra
  const formatObraTitle = (obraNome: string, horario: string) => {
    const obraPrefix = obraNome.includes('-') ? obraNome.split('-')[0].trim().substring(0, 4) : obraNome.substring(0, 4)
    return `${obraNome} (${horario}) CC ${obraPrefix}`
  }

  // Função para formatar o título do planejamento
  const formatPlanejamentoTitle = (dataTrabalho: string) => {
    const date = new Date(dataTrabalho + 'T00:00:00')
    const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']
    const diaSemana = diasSemana[date.getDay()]
    const dataFormatada = date.toLocaleDateString('pt-BR')
    return `Planejamento diário ${diaSemana} (${dataFormatada})`
  }

  // Tipos para agrupamento
  interface HorarioGroup {
    horario_inicio: string;
    funcionarios: { id: number; nome: string; }[];
  }

  interface PlanejamentoGroup {
    data_trabalho: string;
    obra: { id: number; nome: string; };
    horarios: HorarioGroup[];
  }

  // Agrupar planejamentos por data e obra
  const groupedPlanejamentos = planejamentos.reduce((groups, plano) => {
    const key = `${plano.data_trabalho}-${plano.obra.id}`
    if (!groups[key]) {
      groups[key] = {
        data_trabalho: plano.data_trabalho,
        obra: plano.obra,
        horarios: []
      }
    }
    
    // Verificar se já existe um horário igual
    const existingHorario = groups[key].horarios.find((h: HorarioGroup) => h.horario_inicio === plano.horario_inicio)
    if (existingHorario) {
      existingHorario.funcionarios.push(plano.funcionario)
    } else {
      groups[key].horarios.push({
        horario_inicio: plano.horario_inicio,
        funcionarios: [plano.funcionario]
      })
    }
    
    return groups
  }, {} as Record<string, PlanejamentoGroup>)

  const handleSubmit = async () => {
    if (selectedFuncionarios.length === 0 || !selectedObra || selectedDates.length === 0 || !horaInicio) {
      setError('Por favor, selecione funcionários, obra, horário de início e datas')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Criar planejamentos para cada combinação
      for (const funcionarioId of selectedFuncionarios) {
        for (const date of selectedDates) {
          const funcionario = funcionarios.find(f => f.id === funcionarioId)
          const obra = obras.find(o => o.id === selectedObra)
          
          if (funcionario && obra) {
            const novoPlanejamento: PlanejamentoCreate = {
              data_trabalho: date,
              horario_inicio: horaInicio,
              funcionario_nome: funcionario.nome,
              obra_nome: obra.nome,
            }

            await Api.createPlanejamento(novoPlanejamento)
          }
        }
      }

      // Limpar seleções
      setSelectedFuncionarios([])
      setSelectedObra(null)
      setSelectedDates([])
      setHoraInicio('08:00')
      setFuncionarioSearch('')
      setObraSearch('')
      
      // Recarregar planejamentos
      const response = await Api.getPlanejamentos()
      setPlanejamentos(response.data)
      
    } catch (err: any) {
      console.error('Erro ao criar planejamento:', err)
      setError(err.response?.data?.detail || 'Erro ao criar planejamento')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <FormContainer>
        <h2>Planejamento de Cronograma</h2>
        
        <SelectGroup>
          <FormField>
            <label>Funcionários:</label>
            <DropdownContainer ref={funcionarioRef}>
              <SearchInput
                placeholder="Buscar funcionário..."
                value={funcionarioSearch}
                onChange={(e) => setFuncionarioSearch(e.target.value)}
                onFocus={() => setIsFuncionarioDropdownOpen(true)}
              />
              <DropdownList isOpen={isFuncionarioDropdownOpen}>
                {filteredFuncionarios.map(funcionario => (
                  <CheckboxOption key={funcionario.id}>
                    <input
                      type="checkbox"
                      id={`func-${funcionario.id}`}
                      checked={selectedFuncionarios.includes(funcionario.id)}
                      onChange={() => handleFuncionarioToggle(funcionario.id)}
                    />
                    <label htmlFor={`func-${funcionario.id}`}>
                      {funcionario.nome}
                    </label>
                  </CheckboxOption>
                ))}
                {filteredFuncionarios.length === 0 && (
                  <DropdownOption>
                    Nenhum funcionário encontrado
                  </DropdownOption>
                )}
              </DropdownList>
              <small>
                {selectedFuncionarios.length === 0 
                  ? 'Nenhum funcionário selecionado' 
                  : `${selectedFuncionarios.length} funcionário(s) selecionado(s)`
                }
              </small>
            </DropdownContainer>
          </FormField>

          <FormField>
            <label>Obra:</label>
            <DropdownContainer ref={obraRef}>
              <SearchInput
                placeholder="Buscar obra por nome ou código..."
                value={obraSearch}
                onChange={(e) => {
                  setObraSearch(e.target.value)
                  setSelectedObra(null)
                }}
                onFocus={() => setIsObraDropdownOpen(true)}
              />
              <DropdownList isOpen={isObraDropdownOpen}>
                {filteredObras.map(obra => (
                  <DropdownOption
                    key={obra.id}
                    onClick={() => handleObraSelect(obra.id)}
                  >
                    {obra.nome}
                  </DropdownOption>
                ))}
                {filteredObras.length === 0 && (
                  <DropdownOption>Nenhuma obra encontrada</DropdownOption>
                )}
              </DropdownList>
            </DropdownContainer>
          </FormField>
        </SelectGroup>

        <FormField>
          <label>Hora de Início:</label>
          <SearchInput
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            style={{ width: '150px' }}
          />
        </FormField>

        <CalendarContainer>
          <Calendar>
            {days.map(day => (
              <DayCell
                key={day.date}
                isSelected={selectedDates.includes(day.date)}
                isWeekend={day.isWeekend}
                onClick={() => handleDateToggle(day.date)}
              >
                <span className="weekday">{day.dayName}</span>
                <span className="date">{day.dayNumber}/{day.monthNumber}</span>
              </DayCell>
            ))}
          </Calendar>
        </CalendarContainer>

        {error && (
          <div style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <ButtonGroup>
          <button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Criando...' : `Criar Planejamento`}
          </button>
        </ButtonGroup>
      </FormContainer>

      <PlanningCardContainer>
        {Object.values(groupedPlanejamentos).map((grupo: PlanejamentoGroup, index) => (
          <PlanningCard key={`${grupo.data_trabalho}-${grupo.obra.id}-${index}`}>
            <h3>{formatPlanejamentoTitle(grupo.data_trabalho)}</h3>
            <div className="planejamento-grupo">
              {grupo.horarios.map((horario: HorarioGroup, horarioIndex: number) => (
                <div key={horarioIndex} className="obra-header">
                  <div className="obra-info">
                    <div className="obra">
                      {formatObraTitle(grupo.obra.nome, horario.horario_inicio)}
                    </div>
                  </div>
                  <ul className="funcionarios">
                    {horario.funcionarios.map((funcionario: { id: number; nome: string; }, funcIndex: number) => (
                      <li key={funcIndex}>{funcionario.nome}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </PlanningCard>
        ))}
      </PlanningCardContainer>
    </Container>
  )
}