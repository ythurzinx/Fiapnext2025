"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "alexa"
  content: string
  timestamp: Date
}

const houseData = {
  monthlyExpense: 285.5,
  highestConsumptionArea: "Garagem (carro elétrico)",
  batteryLevel: 85,
  batteryCapacity: 15.0, // kWh total
  currentBatteryCharge: 12.8, // kWh atual
  chargingRate: 3.2, // kW
}

export default function AlexaConversation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "alexa",
      content:
        "Olá! Sou seu assistente de energia inteligente. Posso responder sobre seus gastos mensais, consumo por área, nível da bateria e tempo de carregamento. Como posso ajudar?",
      timestamp: new Date(Date.now() - 60000),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAlexaResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Pergunta 1: Qual meu gasto mensal?
    if (
      lowerMessage.includes("gasto mensal") ||
      lowerMessage.includes("custo mensal") ||
      lowerMessage.includes("quanto gasto") ||
      lowerMessage.includes("valor mensal")
    ) {
      return `Seu gasto mensal com energia é de R$ ${houseData.monthlyExpense.toFixed(2)}. Este valor inclui o consumo da casa (R$ 156,30) e da garagem com o carro elétrico (R$ 129,20). Você economiza cerca de R$ 95,00 por mês com a geração solar.`
    }

    // Pergunta 2: Qual área da casa tem o maior gasto?
    if (
      lowerMessage.includes("maior gasto") ||
      lowerMessage.includes("área") ||
      lowerMessage.includes("onde gasto mais") ||
      lowerMessage.includes("consumo por área")
    ) {
      return `A ${houseData.highestConsumptionArea} tem o maior gasto de energia da sua propriedade, consumindo cerca de 7,2 kW durante o carregamento. Em segundo lugar está a casa principal com 2,4 kW de consumo médio, principalmente devido ao ar condicionado e aquecedor de água.`
    }

    // Pergunta 3: Qual o nível da bateria?
    if (
      lowerMessage.includes("nível da bateria") ||
      lowerMessage.includes("bateria") ||
      lowerMessage.includes("carga da bateria") ||
      lowerMessage.includes("quanto tem na bateria")
    ) {
      return `Sua bateria está com ${houseData.batteryLevel}% de carga, o que equivale a ${houseData.currentBatteryCharge} kWh de ${houseData.batteryCapacity} kWh totais. Com o consumo atual da casa, isso representa aproximadamente 5,3 horas de energia de backup.`
    }

    // Pergunta 4: Quanto falta para carregar completamente?
    if (
      lowerMessage.includes("falta para carregar") ||
      lowerMessage.includes("tempo para carregar") ||
      lowerMessage.includes("carregar completa") ||
      lowerMessage.includes("carregamento completo")
    ) {
      const remainingCapacity = houseData.batteryCapacity - houseData.currentBatteryCharge
      const timeToFull = remainingCapacity / houseData.chargingRate
      const hours = Math.floor(timeToFull)
      const minutes = Math.round((timeToFull - hours) * 60)

      return `Faltam ${remainingCapacity.toFixed(1)} kWh para carregar completamente sua bateria. Com a taxa atual de carregamento de ${houseData.chargingRate} kW, isso levará aproximadamente ${hours}h${minutes > 0 ? ` e ${minutes}min` : ""} para atingir 100% da capacidade.`
    }

    // Resposta padrão para outras perguntas
    return "Posso ajudar com informações específicas sobre: 1) Seu gasto mensal, 2) Qual área tem maior consumo, 3) Nível atual da bateria, 4) Tempo para carregamento completo. Sobre qual dessas informações você gostaria de saber?"
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsProcessing(true)

    setTimeout(() => {
      const response = generateAlexaResponse(currentInput)
      const alexaResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "alexa",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, alexaResponse])
      setIsProcessing(false)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isProcessing) {
      handleSendMessage()
    }
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false)
        setInputValue("Qual meu gasto mensal?")
      }, 2000)
    }
  }

  const quickQuestions = [
    "Qual meu gasto mensal?",
    "Qual área da casa tem o maior gasto?",
    "Qual o nível da bateria?",
    "Quanto falta para a bateria carregar uma carga completa?",
  ]

  return (
    <div className="space-y-6">
      {/* Cards de Status de Energia */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Mensal</CardTitle>
            <SimpleIcon className="text-muted-foreground">💰</SimpleIcon>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">R$ {houseData.monthlyExpense.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Total da propriedade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior Consumo</CardTitle>
            <SimpleIcon className="text-muted-foreground">🏠</SimpleIcon>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">Garagem</div>
            <p className="text-xs text-muted-foreground">Carro elétrico</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nível da Bateria</CardTitle>
            <SimpleIcon className="text-muted-foreground">🔋</SimpleIcon>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{houseData.batteryLevel}%</div>
            <p className="text-xs text-muted-foreground">{houseData.currentBatteryCharge} kWh restantes</p>
          </CardContent>
        </Card>
      </div>

      {/* Interface de Conversa */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Assistente de Energia</CardTitle>
              <p className="text-sm text-muted-foreground">Pergunte sobre gastos, consumo, bateria e carregamento</p>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {isProcessing ? "Processando..." : "Online"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mensagens */}
          <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/30 rounded-lg">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.type === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground border",
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-card text-card-foreground border rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                    <span className="text-sm text-muted-foreground ml-2">Analisando...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Área de Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pergunte sobre gastos, consumo, bateria ou carregamento..."
                className="pr-12"
                disabled={isProcessing}
              />
              <Button
                size="sm"
                variant="ghost"
                className={cn("absolute right-1 top-1 h-8 w-8 p-0", isListening && "text-red-500")}
                onClick={toggleListening}
                disabled={isProcessing}
              >
                <SimpleIcon>{isListening ? "🔇" : "🎤"}</SimpleIcon>
              </Button>
            </div>
            <Button onClick={handleSendMessage} size="sm" disabled={isProcessing}>
              <SimpleIcon>📤</SimpleIcon>
            </Button>
          </div>

          {isListening && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Ouvindo...
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(question)}
                disabled={isProcessing}
                className="text-left justify-start"
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const SimpleIcon = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center justify-center ${className}`}>{children}</span>
)
