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
  TurnoContainer,
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
  const [selectedTurnos, setSelectedTurnos] = useState<string[]>([])
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [funcionarioSearch, setFuncionarioSearch] = useState('')
  const [obraSearch, setObraSearch] = useState('')
  const [isFuncionarioDropdownOpen, setIsFuncionarioDropdownOpen] = useState(false)
  const [isObraDropdownOpen, setIsObraDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Refs para detectar cliques fora dos dropdowns
  const funcionarioRef = useRef<HTMLDivElement>(null)
  const obraRef = useRef<HTMLDivElement>(null)

  const turnos = ['Manhã', 'Tarde', 'Noite']

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

  const handleTurnoToggle = (turno: string) => {
    setSelectedTurnos(prev =>
      prev.includes(turno)
        ? prev.filter(t => t !== turno)
        : [...prev, turno]
    )
  }

  const handleDateToggle = (date: string) => {
    setSelectedDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    )
  }

  const handleSubmit = async () => {
    if (selectedFuncionarios.length === 0 || !selectedObra || selectedTurnos.length === 0 || selectedDates.length === 0) {
      setError('Por favor, selecione funcionários, obra, turnos e datas')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Criar planejamentos para cada combinação
      for (const funcionarioId of selectedFuncionarios) {
        for (const date of selectedDates) {
          for (const turno of selectedTurnos) {
            const funcionario = funcionarios.find(f => f.id === funcionarioId)
            const obra = obras.find(o => o.id === selectedObra)
            
            if (funcionario && obra) {
              const horario = turno === 'Manhã' ? '08:00' : turno === 'Tarde' ? '14:00' : '20:00'
              
              const novoPlanejamento: PlanejamentoCreate = {
                data_trabalho: date,
                horario_inicio: horario,
                funcionario_nome: funcionario.nome,
                obra_nome: obra.nome,
              }

              await Api.createPlanejamento(novoPlanejamento)
            }
          }
        }
      }

      // Limpar seleções
      setSelectedFuncionarios([])
      setSelectedObra(null)
      setSelectedTurnos([])
      setSelectedDates([])
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
          <label>Turnos:</label>
          <TurnoContainer>
            <div className="turno-options">
              {turnos.map(turno => (
                <CheckboxOption key={turno}>
                  <input
                    type="checkbox"
                    id={`turno-${turno}`}
                    checked={selectedTurnos.includes(turno)}
                    onChange={() => handleTurnoToggle(turno)}
                  />
                  <label htmlFor={`turno-${turno}`}>{turno}</label>
                </CheckboxOption>
              ))}
            </div>
          </TurnoContainer>
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
            {isLoading ? 'Registrando...' : `Registrar Planejamento (${selectedFuncionarios.length} funcionário${selectedFuncionarios.length !== 1 ? 's' : ''}, ${selectedDates.length} dia${selectedDates.length !== 1 ? 's' : ''})`}
          </button>
        </ButtonGroup>
      </FormContainer>

      <PlanningCardContainer>
        {planejamentos.map((plano) => (
          <PlanningCard key={plano.id}>
            <h3>Planejamento #{plano.id}</h3>
            <div className="planejamento-grupo">
              <div className="obra-header">
                <div className="obra-info">
                  <div className="obra">
                    {plano.obra.nome}
                  </div>
                  <div className="turno">
                    {new Date(plano.data_trabalho + 'T00:00:00').toLocaleDateString('pt-BR')} - {plano.horario_inicio}
                  </div>
                </div>
              </div>
              <ul className="funcionarios">
                <li>{plano.funcionario.nome}</li>
              </ul>
            </div>
          </PlanningCard>
        ))}
      </PlanningCardContainer>
    </Container>
  )
}