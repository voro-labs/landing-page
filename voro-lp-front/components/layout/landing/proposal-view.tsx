"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Check, Calendar, Clock, DollarSign, Mail, Phone, Building2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ProposalDto } from "@/types/DTOs/proposalDto.interface"
import { LandingPageSectionDto } from "@/types/DTOs/landingPageSectionDto.interface"
import { useState } from "react"
import { applyMask, phoneMasks } from "@/lib/mask-utils"
import { ProposalStatusEnum } from "@/types/Enums/proposalStatusEnum.enum"

interface ProposalViewProps {
  proposal: ProposalDto
  lpConfig: LandingPageSectionDto | undefined
}

export default function ProposalView({ proposal, lpConfig }: ProposalViewProps) {
  const [countryCode, setCountryCode] = useState("BR")
  const currentMask = phoneMasks[countryCode]

  const handleDownloadPDF = () => {
    alert("Funcionalidade de download PDF será implementada em breve!")
  }

  const getStatusColor = (status: ProposalStatusEnum) => {
    switch (status) {
      case ProposalStatusEnum.Approved:
        return "text-green-600 border-green-600"
      case ProposalStatusEnum.Rejected:
        return "text-red-600 border-red-600"
      case ProposalStatusEnum.Pending:
      case ProposalStatusEnum.UnderReview:
      case ProposalStatusEnum.OnHold:
        return "text-yellow-600 border-yellow-600"
      default:
        return "text-gray-600 border-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className={getStatusColor(proposal.proposal.status)}>
                {proposal.proposal.status}
              </Badge>
              <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Baixar PDF
              </Button>
              <Button size="sm" className="gap-2">
                <Check className="w-4 h-4" />
                Aprovar Proposta
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Proposta Comercial</h1>
              <p className="text-muted-foreground">#{proposal.proposal.number}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Data de Emissão</div>
              <div className="font-semibold">{new Date(proposal.proposal.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</div>
              <div className="text-sm text-muted-foreground mt-2">Válida até</div>
              <div className="font-semibold">{new Date(proposal.proposal.validUntil).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</div>
            </div>
          </div>

          {/* Client Info */}
          <Card className="p-6 bg-muted/50">
            <h2 className="text-lg font-semibold mb-4">Informações do Cliente</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {proposal.client.company && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Empresa</div>
                    <div className="font-semibold">{proposal.client.company}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Responsável</div>
                  <div className="font-semibold">{proposal.client.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-semibold">{proposal.client.email}</div>
                </div>
              </div>
              {proposal.client.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Telefone</div>
                    <div className="font-semibold">{proposal.client.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Project Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-8 mb-8">
            {proposal.project.package && (
              <div className="flex items-center gap-2 mb-4">
                <Badge className="text-sm">{proposal.project.package}</Badge>
              </div>
            )}
            <h2 className="text-2xl font-bold mb-4">{proposal.project.title}</h2>
            {proposal.project.description && (
              <p className="text-muted-foreground mb-6 leading-relaxed">{proposal.project.description}</p>
            )}

            <div className="grid md:grid-cols-3 gap-6 pt-6 border-t">
              {proposal.project.duration && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Duração</div>
                    <div className="font-semibold">{proposal.project.duration}</div>
                  </div>
                </div>
              )}
              {proposal.project.startDate && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Início Previsto</div>
                    <div className="font-semibold">{new Date(proposal.project.startDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</div>
                  </div>
                </div>
              )}
              {proposal.project.deliveryDate && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Entrega Prevista</div>
                    <div className="font-semibold">{new Date(proposal.project.deliveryDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Scope of Work */}
        {proposal.scope.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Escopo do Projeto</h2>
              <div className="space-y-6">
                {proposal.scope.map((section, index) => (
                  <div key={index} className="border-l-2 border-primary pl-6">
                    <h3 className="text-lg font-semibold mb-3">{section.category}</h3>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Timeline */}
        {proposal.timeline.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Cronograma de Desenvolvimento</h2>
              <div className="space-y-6">
                {proposal.timeline.map((phase, index) => (
                  <div key={index} className="relative pl-8 pb-6 last:pb-0">
                    {index < proposal.timeline.length - 1 && (
                      <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-border" />
                    )}
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{phase.phase}</h3>
                        <Badge variant="outline">{phase.duration}</Badge>
                      </div>
                      <ul className="space-y-1">
                        {phase.tasks.map((task, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Deliverables */}
        {proposal.deliverables.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Entregáveis</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {proposal.deliverables.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Investment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-8 bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <DollarSign className="w-7 h-7 text-primary" />
              Investimento
            </h2>

            <div className="space-y-4 mb-6">
              {proposal.investment.development > 0 && (
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-muted-foreground">Desenvolvimento</span>
                  <span className="font-semibold">
                    {proposal.investment.currency} {proposal.investment.development.toLocaleString("pt-BR")}
                  </span>
                </div>
              )}
              {proposal.investment.infrastructure > 0 && (
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-muted-foreground">Infraestrutura</span>
                  <span className="font-semibold">
                    {proposal.investment.currency} {proposal.investment.infrastructure.toLocaleString("pt-BR")}
                  </span>
                </div>
              )}
              {proposal.investment.training > 0 && (
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-muted-foreground">Treinamento</span>
                  <span className="font-semibold">
                    {proposal.investment.currency} {proposal.investment.training.toLocaleString("pt-BR")}
                  </span>
                </div>
              )}
              {proposal.investment.support > 0 && (
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-muted-foreground">Suporte</span>
                  <span className="font-semibold">
                    {proposal.investment.currency} {proposal.investment.support.toLocaleString("pt-BR")}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between py-4 text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">
                  {proposal.investment.currency} {proposal.investment.total.toLocaleString("pt-BR")}
                </span>
              </div>
            </div>

            {proposal.investment.paymentTerms.length > 0 && (
              <div className="bg-card rounded-lg p-6">
                <h3 className="font-semibold mb-4">Condições de Pagamento</h3>
                <ul className="space-y-2">
                  {proposal.investment.paymentTerms.map((term, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Button size="lg" className="gap-2 min-w-[200px]">
            <Check className="w-5 h-5" />
            Aprovar Proposta
          </Button>
          <Button size="lg" variant="outline" className="gap-2 min-w-[200px] bg-transparent">
            <Mail className="w-5 h-5" />
            Solicitar Ajustes
          </Button>
        </motion.div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Esta proposta é válida até {new Date(`${proposal.proposal.validUntil}`).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}.
            <br />
            Dúvidas? Entre em contato através do email{" "}
            <a href={`mailto:${lpConfig?.metaData?.email}`} className="text-primary hover:underline">
              {lpConfig?.metaData?.email}
            </a>{" "}
            ou telefone{" "}
            <a href={`tel:+${lpConfig?.metaData?.whatsapp}`} className="text-primary hover:underline">
              {applyMask(`${lpConfig?.metaData?.whatsapp.slice(2)}`, currentMask.mask)}
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
