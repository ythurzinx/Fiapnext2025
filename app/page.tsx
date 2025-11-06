"use client"

import type React from "react"
import { useState, Suspense, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"

const House3DModel = dynamic(() => import("@/components/house-3d-model"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-muted rounded-lg">
      <p className="text-muted-foreground">Carregando modelo 3D...</p>
    </div>
  ),
})

const AlexaConversation = dynamic(() => import("@/components/alexa-conversation"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-muted rounded-lg">
      <p className="text-muted-foreground">Carregando conversa...</p>
    </div>
  ),
})

const SimpleIcon = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center justify-center ${className}`}>{children}</span>
)

const mockData = [
  { time: "06:00", Pac: 0.85, Eday: 0.85, Cbattery1: 64 },
  { time: "07:00", Pac: 1.5, Eday: 2.03, Cbattery1: 66 },
  { time: "08:00", Pac: 2.22, Eday: 3.89, Cbattery1: 68 },
  { time: "09:00", Pac: 2.69, Eday: 6.34, Cbattery1: 70 },
  { time: "10:00", Pac: 2.83, Eday: 9.1, Cbattery1: 72 },
  { time: "11:00", Pac: 3.02, Eday: 12.03, Cbattery1: 74 },
  { time: "12:00", Pac: 3.64, Eday: 15.35, Cbattery1: 76 },
  { time: "13:00", Pac: 4.44, Eday: 19.39, Cbattery1: 78 },
  { time: "14:00", Pac: 4.7, Eday: 23.97, Cbattery1: 80 },
  { time: "15:00", Pac: 4.07, Eday: 28.35, Cbattery1: 82 },
  { time: "16:00", Pac: 2.97, Eday: 31.87, Cbattery1: 84 },
  { time: "17:00", Pac: 2.09, Eday: 34.4, Cbattery1: 86 },
  { time: "18:00", Pac: 1.65, Eday: 36.27, Cbattery1: 88 },
]

const hourlyEnergyData = mockData.map((data, index) => ({
  time: data.time,
  usage: Math.max(0.5, data.Pac * 8 + Math.sin(index) * 2), // Consumo baseado na potência
  solar: data.Pac * 20, // Geração solar baseada na potência AC
  battery: data.Cbattery1, // Nível da bateria real
  garage: Math.max(0.2, data.Pac * 3 + Math.cos(index) * 1.5), // Consumo da garagem
}))

const weeklyEnergyData = [
  { day: "Seg", usage: 68, solar: 85, garage: 25 },
  { day: "Ter", usage: 72, solar: 88, garage: 28 },
  { day: "Qua", usage: 65, solar: 82, garage: 22 },
  { day: "Qui", usage: 70, solar: 90, garage: 26 },
  { day: "Sex", usage: 74, solar: 87, garage: 30 },
  { day: "Sáb", usage: 58, solar: 78, garage: 32 },
  { day: "Dom", usage: 55, solar: 75, garage: 35 },
]

export default function EnergyMonitorPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [hoveredData, setHoveredData] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <SimpleIcon className="text-2xl">⚡</SimpleIcon>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">EnergyFlow</h1>
                <p className="text-lg text-muted-foreground">Monitor Inteligente de Energia Residencial</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground text-lg px-4 py-2">
              Ao Vivo • {currentTime.toLocaleTimeString("pt-BR")}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-14">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 text-lg">
              <SimpleIcon>🏠</SimpleIcon>
              Painel de Energia
            </TabsTrigger>
            <TabsTrigger value="alexa" className="flex items-center gap-2 text-lg">
              <SimpleIcon>💬</SimpleIcon>
              Assistente de Energia
            </TabsTrigger>
            <TabsTrigger value="3d-model" className="flex items-center gap-2 text-lg">
              <SimpleIcon>☀️</SimpleIcon>
              Modelo 3D da Casa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              {/* Energy Usage Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Consumo Atual</CardTitle>
                  <SimpleIcon className="text-muted-foreground text-xl">🏠</SimpleIcon>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {mockData[mockData.length - 1]?.Pac.toFixed(1)} kW
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <SimpleIcon className="text-red-500">↗️</SimpleIcon>
                    +12% em relação a ontem
                  </p>
                </CardContent>
              </Card>

              {/* Solar Generation Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Geração Solar</CardTitle>
                  <SimpleIcon className="text-muted-foreground text-xl">☀️</SimpleIcon>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-accent">
                    {Math.max(...mockData.map((d) => d.Pac)).toFixed(1)} kW
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <SimpleIcon className="text-green-500">↗️</SimpleIcon>
                    Pico: {Math.max(...mockData.map((d) => d.Pac)).toFixed(1)} kW hoje
                  </p>
                </CardContent>
              </Card>

              {/* Battery Storage Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Armazenamento da Bateria</CardTitle>
                  <SimpleIcon className="text-muted-foreground text-xl">🔋</SimpleIcon>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{mockData[mockData.length - 1]?.Cbattery1.toFixed(2)}%</div>
                  <p className="text-sm text-muted-foreground">
                    {((mockData[mockData.length - 1]?.Cbattery1 || 88) * 0.15).toFixed(1)} kWh restantes
                  </p>
                </CardContent>
              </Card>

              {/* Garage Usage Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Consumo da Garagem</CardTitle>
                  <SimpleIcon className="text-muted-foreground text-xl">🚗</SimpleIcon>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-orange-600">1,8 kW</div>
                  <p className="text-sm text-muted-foreground">Carregamento do carro elétrico ativo</p>
                </CardContent>
              </Card>
            </div>

            <Card className="col-span-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Fluxo de Energia em Tempo Real</CardTitle>
                <CardDescription className="text-lg">
                  Monitoramento ao vivo do consumo de energia, geração solar e consumo da garagem
                  {hoveredData && (
                    <span className="ml-4 text-primary font-medium">
                      {hoveredData.time}: Casa {hoveredData.usage.toFixed(1)}kW, Solar{" "}
                      {(hoveredData.solar * 0.05).toFixed(1)}kW, Garagem {(hoveredData.garage * 0.05).toFixed(1)}kW
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 p-4">
                  <div className="relative h-full">
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      <defs>
                        <linearGradient id="solarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="usageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="garageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(249, 115, 22)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="rgb(249, 115, 22)" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>

                      {/* Grid lines */}
                      {[0, 25, 50, 75, 100].map((y) => (
                        <line
                          key={y}
                          x1="0"
                          y1={200 - y * 2}
                          x2="400"
                          y2={200 - y * 2}
                          stroke="hsl(var(--muted-foreground))"
                          strokeOpacity="0.2"
                          strokeDasharray="2,2"
                        />
                      ))}

                      {/* Solar Generation Line */}
                      <polyline
                        fill="url(#solarGradient)"
                        stroke="rgb(34, 197, 94)"
                        strokeWidth="3"
                        points={hourlyEnergyData
                          .map(
                            (data, index) => `${(index * 400) / (hourlyEnergyData.length - 1)},${200 - data.solar * 2}`,
                          )
                          .join(" ")}
                      />

                      {/* House Usage Line */}
                      <polyline
                        fill="none"
                        stroke="rgb(59, 130, 246)"
                        strokeWidth="3"
                        points={hourlyEnergyData
                          .map(
                            (data, index) => `${(index * 400) / (hourlyEnergyData.length - 1)},${200 - data.usage * 2}`,
                          )
                          .join(" ")}
                      />

                      {/* Garage Usage Line */}
                      <polyline
                        fill="none"
                        stroke="rgb(249, 115, 22)"
                        strokeWidth="3"
                        points={hourlyEnergyData
                          .map(
                            (data, index) =>
                              `${(index * 400) / (hourlyEnergyData.length - 1)},${200 - data.garage * 2}`,
                          )
                          .join(" ")}
                      />

                      {/* Data points for Solar */}
                      {hourlyEnergyData.map((data, index) => (
                        <circle
                          key={`solar-${index}`}
                          cx={(index * 400) / (hourlyEnergyData.length - 1)}
                          cy={200 - data.solar * 2}
                          r="4"
                          fill="rgb(34, 197, 94)"
                          stroke="white"
                          strokeWidth="2"
                          className="hover:r-6 transition-all cursor-pointer"
                          onMouseEnter={() => setHoveredData(data)}
                          onMouseLeave={() => setHoveredData(null)}
                        >
                          <title>{`${data.time}: Solar ${(data.solar * 0.05).toFixed(1)} kW`}</title>
                        </circle>
                      ))}

                      {/* Data points for Usage */}
                      {hourlyEnergyData.map((data, index) => (
                        <circle
                          key={`usage-${index}`}
                          cx={(index * 400) / (hourlyEnergyData.length - 1)}
                          cy={200 - data.usage * 2}
                          r="4"
                          fill="rgb(59, 130, 246)"
                          stroke="white"
                          strokeWidth="2"
                          className="hover:r-6 transition-all cursor-pointer"
                          onMouseEnter={() => setHoveredData(data)}
                          onMouseLeave={() => setHoveredData(null)}
                        >
                          <title>{`${data.time}: Usage ${(data.usage * 0.05).toFixed(1)} kW`}</title>
                        </circle>
                      ))}

                      {/* Data points for Garage */}
                      {hourlyEnergyData.map((data, index) => (
                        <circle
                          key={`garage-${index}`}
                          cx={(index * 400) / (hourlyEnergyData.length - 1)}
                          cy={200 - data.garage * 2}
                          r="4"
                          fill="rgb(249, 115, 22)"
                          stroke="white"
                          strokeWidth="2"
                          className="hover:r-6 transition-all cursor-pointer"
                          onMouseEnter={() => setHoveredData(data)}
                          onMouseLeave={() => setHoveredData(null)}
                        >
                          <title>{`${data.time}: Garage ${(data.garage * 0.05).toFixed(1)} kW`}</title>
                        </circle>
                      ))}
                    </svg>

                    {/* Time labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-muted-foreground font-medium">
                      <span>00:00</span>
                      <span>06:00</span>
                      <span>12:00</span>
                      <span>18:00</span>
                      <span>24:00</span>
                    </div>

                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-sm text-muted-foreground font-medium">
                      <span>{Math.max(...hourlyEnergyData.map((d) => d.solar * 0.05)).toFixed(1)}kW</span>
                      <span>{(Math.max(...hourlyEnergyData.map((d) => d.solar * 0.05)) * 0.75).toFixed(1)}kW</span>
                      <span>{(Math.max(...hourlyEnergyData.map((d) => d.solar * 0.05)) * 0.5).toFixed(1)}kW</span>
                      <span>{(Math.max(...hourlyEnergyData.map((d) => d.solar * 0.05)) * 0.25).toFixed(1)}kW</span>
                      <span>0kW</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-lg font-medium">Geração Solar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-lg font-medium">Consumo da Casa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="text-lg font-medium">Consumo da Garagem</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Resumo Semanal de Energia</CardTitle>
                  <CardDescription className="text-lg">
                    Consumo diário vs geração incluindo consumo da garagem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72 p-4">
                    <div className="relative h-full">
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        <defs>
                          <linearGradient id="weeklySolarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.1" />
                          </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map((y) => (
                          <line
                            key={y}
                            x1="0"
                            y1={200 - y * 2}
                            x2="400"
                            y2={200 - y * 2}
                            stroke="hsl(var(--muted-foreground))"
                            strokeOpacity="0.2"
                            strokeDasharray="2,2"
                          />
                        ))}

                        {/* House Usage Line */}
                        <polyline
                          fill="none"
                          stroke="rgb(59, 130, 246)"
                          strokeWidth="3"
                          points={weeklyEnergyData
                            .map(
                              (data, index) =>
                                `${(index * 400) / (weeklyEnergyData.length - 1)},${200 - data.usage * 2}`,
                            )
                            .join(" ")}
                        />

                        {/* Garage Usage Line */}
                        <polyline
                          fill="none"
                          stroke="rgb(249, 115, 22)"
                          strokeWidth="3"
                          points={weeklyEnergyData
                            .map(
                              (data, index) =>
                                `${(index * 400) / (weeklyEnergyData.length - 1)},${200 - data.garage * 2}`,
                            )
                            .join(" ")}
                        />

                        {/* Solar Generation Line */}
                        <polyline
                          fill="url(#weeklySolarGradient)"
                          stroke="rgb(34, 197, 94)"
                          strokeWidth="3"
                          points={weeklyEnergyData
                            .map(
                              (data, index) =>
                                `${(index * 400) / (weeklyEnergyData.length - 1)},${200 - data.solar * 2}`,
                            )
                            .join(" ")}
                        />

                        {/* Data points */}
                        {weeklyEnergyData.map((data, index) => (
                          <g key={index}>
                            <circle
                              cx={(index * 400) / (weeklyEnergyData.length - 1)}
                              cy={200 - data.usage * 2}
                              r="4"
                              fill="rgb(59, 130, 246)"
                              stroke="white"
                              strokeWidth="2"
                              className="hover:r-6 transition-all cursor-pointer"
                              onMouseEnter={() => setHoveredData({ ...data, type: "weekly" })}
                              onMouseLeave={() => setHoveredData(null)}
                            >
                              <title>{`${data.day}: House ${data.usage} kWh`}</title>
                            </circle>
                            <circle
                              cx={(index * 400) / (weeklyEnergyData.length - 1)}
                              cy={200 - data.garage * 2}
                              r="4"
                              fill="rgb(249, 115, 22)"
                              stroke="white"
                              strokeWidth="2"
                              className="hover:r-6 transition-all cursor-pointer"
                              onMouseEnter={() => setHoveredData({ ...data, type: "weekly" })}
                              onMouseLeave={() => setHoveredData(null)}
                            >
                              <title>{`${data.day}: Garage ${data.garage} kWh`}</title>
                            </circle>
                            <circle
                              cx={(index * 400) / (weeklyEnergyData.length - 1)}
                              cy={200 - data.solar * 2}
                              r="4"
                              fill="rgb(34, 197, 94)"
                              stroke="white"
                              strokeWidth="2"
                              className="hover:r-6 transition-all cursor-pointer"
                              onMouseEnter={() => setHoveredData({ ...data, type: "weekly" })}
                              onMouseLeave={() => setHoveredData(null)}
                            >
                              <title>{`${data.day}: Solar ${data.solar} kWh`}</title>
                            </circle>
                          </g>
                        ))}
                      </svg>

                      {/* Day labels */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-muted-foreground font-medium">
                        {weeklyEnergyData.map((data) => (
                          <span key={data.day}>{data.day}</span>
                        ))}
                      </div>

                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-sm text-muted-foreground font-medium">
                        <span>100kWh</span>
                        <span>75kWh</span>
                        <span>50kWh</span>
                        <span>25kWh</span>
                        <span>0kWh</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-lg font-medium">Casa (kWh)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span className="text-lg font-medium">Garagem (kWh)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-lg font-medium">Solar (kWh)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Tendências do Nível da Bateria</CardTitle>
                  <CardDescription className="text-lg">
                    Padrões de carga/descarga de 24 horas
                    <span className="ml-4 text-primary font-medium">
                      Atual:{" "}
                      {mockData[Math.min(Math.floor(currentTime.getHours() - 6), mockData.length - 1)]?.Cbattery1 || 88}
                      %
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72 p-4">
                    <div className="relative h-full">
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        <defs>
                          <linearGradient id="batteryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgb(234, 179, 8)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="rgb(234, 179, 8)" stopOpacity="0.1" />
                          </linearGradient>
                        </defs>
                        {[0, 25, 50, 75, 100].map((y) => (
                          <line
                            key={y}
                            x1="0"
                            y1={200 - y * 2}
                            x2="400"
                            y2={200 - y * 2}
                            stroke="hsl(var(--muted-foreground))"
                            strokeOpacity="0.2"
                            strokeDasharray="2,2"
                          />
                        ))}
                        <polyline
                          fill="url(#batteryGradient)"
                          stroke="rgb(234, 179, 8)"
                          strokeWidth="3"
                          points={hourlyEnergyData
                            .map(
                              (data, index) =>
                                `${(index * 400) / (hourlyEnergyData.length - 1)},${200 - data.battery * 2}`,
                            )
                            .join(" ")}
                        />
                        {hourlyEnergyData.map((data, index) => (
                          <circle
                            key={index}
                            cx={(index * 400) / (hourlyEnergyData.length - 1)}
                            cy={200 - data.battery * 2}
                            r="4"
                            fill="rgb(234, 179, 8)"
                            stroke="white"
                            strokeWidth="2"
                            className="hover:r-8 transition-all cursor-pointer animate-pulse"
                            style={{ animationDelay: `${index * 200}ms` }}
                          >
                            <title>{`${data.time}: ${data.battery.toFixed(2)}%`}</title>
                          </circle>
                        ))}
                      </svg>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-muted-foreground font-medium">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>24:00</span>
                      </div>
                      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-sm text-muted-foreground font-medium">
                        <span>100%</span>
                        <span>75%</span>
                        <span>50%</span>
                        <span>25%</span>
                        <span>0%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alexa" className="space-y-6">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <p className="text-muted-foreground">Carregando assistente de energia...</p>
                </div>
              }
            >
              <AlexaConversation />
            </Suspense>
          </TabsContent>

          <TabsContent value="3d-model" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Modelo 3D Interativo da Casa</CardTitle>
                <CardDescription className="text-lg">
                  Visualize o fluxo de energia em toda a sua casa - arraste para girar, role para ampliar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] w-full rounded-lg overflow-hidden bg-gradient-to-b from-blue-100 to-green-100 dark:from-blue-950 dark:to-green-950">
                  <Suspense
                    fallback={
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">Carregando visualização 3D...</p>
                      </div>
                    }
                  >
                    <House3DModel />
                  </Suspense>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Controles do Modelo 3D</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <strong>Girar:</strong> Clique e arraste
                  </p>
                  <p>
                    <strong>Ampliar:</strong> Roda do mouse
                  </p>
                  <p>
                    <strong>Mover:</strong> Clique direito e arraste
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Legenda do Fluxo de Energia</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>
                    <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>Solar para Bateria
                  </p>
                  <p>
                    <span className="inline-block w-3 h-3 bg-red-400 rounded-full mr-2"></span>Bateria para Casa
                  </p>
                  <p>
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>Painéis Solares
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Dados em Tempo Real</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>Solar: {mockData[mockData.length - 1]?.Pac.toFixed(1)} kW gerando</p>
                  <p>Bateria: {mockData[mockData.length - 1]?.Cbattery1.toFixed(2)}% carregada</p>
                  <p>Casa: {(mockData[mockData.length - 1]?.Pac * 0.7).toFixed(1)} kW consumindo</p>
                  <p>Garagem: {(mockData[mockData.length - 1]?.Pac * 0.3).toFixed(1)} kW consumindo</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
