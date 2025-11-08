"use client"

import { motion } from "framer-motion"
import { Code, Globe, Zap, Smartphone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    icon: Code,
    title: "Desenvolvimento de Sistemas",
    description: "Sistemas web e painéis administrativos personalizados para gerenciar seu negócio com eficiência.",
  },
  {
    icon: Globe,
    title: "Páginas e Landing Pages",
    description: "Sites institucionais e landing pages otimizadas para conversão e performance.",
  },
  {
    icon: Zap,
    title: "Automações Inteligentes",
    description: "Integração com WhatsApp, Telegram, Instagram, e-mail e outros canais para automatizar processos.",
  },
  {
    icon: Smartphone,
    title: "Aplicativos Mobile",
    description: "Apps nativos para Android e iOS conectados ao seu sistema, expandindo seu alcance.",
  },
]

export function Services() {
  return (
    <section id="services" className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">Nossos Serviços</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Soluções completas para transformar a presença digital do seu negócio
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
