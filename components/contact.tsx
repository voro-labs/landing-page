"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageCircle, Send } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contact" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">Entre em Contato</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Pronto para transformar seu negócio? Fale conosco agora
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Envie uma Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      name="name"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-background/50"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Seu e-mail"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-background/50"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Sua mensagem"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="bg-background/50"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <a
                  href="https://wa.me/5511999999999?text=Olá!%20Tenho%20interesse%20em%20criar%20um%20sistema%20com%20a%20VoroLabs.%20Podemos%20conversar%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">WhatsApp</h3>
                    <p className="text-muted-foreground">Fale conosco agora</p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <a href="mailto:contato@vorolabs.app" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">E-mail</h3>
                    <p className="text-muted-foreground">contato@vorolabs.app</p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <div className="p-6 bg-linear-to-br from-primary/10 to-accent/10 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Responderemos sua mensagem o mais breve possível. Nosso horário de atendimento é de segunda a sexta, das
                9h às 18h.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
