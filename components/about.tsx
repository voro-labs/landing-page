"use client"

import { motion } from "framer-motion"

export function About() {
  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">Sobre a VoroLabs</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                A VoroLabs é uma empresa especializada em soluções digitais personalizadas, ajudando empresas e
                profissionais a expandirem seus negócios através da tecnologia.
              </p>
              <p>
                Nossa missão é transformar ideias em realidade digital, criando sistemas, páginas web e automações que
                realmente fazem diferença no dia a dia dos nossos clientes. Combinamos expertise técnica com compreensão
                profunda das necessidades do negócio.
              </p>
              <p>
                Com foco em qualidade, inovação e resultados, trabalhamos lado a lado com nossos parceiros para
                desenvolver soluções que não apenas atendem, mas superam expectativas.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
