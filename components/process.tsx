"use client"

import { motion } from "framer-motion"
import { Search, Code2, Rocket } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Entendimento da necessidade",
    description: "Analisamos profundamente suas demandas e objetivos para criar a solução ideal.",
  },
  {
    icon: Code2,
    title: "Desenvolvimento personalizado",
    description: "Construímos sua solução com tecnologias modernas e práticas recomendadas.",
  },
  {
    icon: Rocket,
    title: "Entrega e suporte contínuo",
    description: "Lançamos seu projeto e oferecemos suporte para garantir o sucesso contínuo.",
  },
]

export function Process() {
  return (
    <section className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">Como Trabalhamos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Um processo transparente e eficiente do início ao fim
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-linear-to-r from-primary to-transparent" />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
