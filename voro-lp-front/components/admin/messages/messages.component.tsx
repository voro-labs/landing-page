"use client"

import { Loading } from "@/components/loading/loading.component"
import { ConversationList } from "./conversation-list"
import { ChatArea } from "./chat-area"
import { useEvolutionChat } from "@/hooks/use-evolution-chat.hook"
import { ErrorPopup } from "@/components/ui/custom/error-popup"

export default function Messages() {
  const {
    contacts,
    messages,
    selectedContactId,
    setSelectedContactId,
    fetchMessages,
    sendMessage,
    sendQuotedMessage,
    saveContact,
    updateContact,
    loading,
    error,
    setError,
  } = useEvolutionChat()

  // 🔹 Busca mensagens do contato selecionado
  const selectedMessages = selectedContactId ? messages[selectedContactId] || [] : []

  return (
    <div className="bg-background">
      <Loading isLoading={loading} />

      {error && (
        <ErrorPopup
          message={error}
          onClose={() => setError("")}
        />
      )}
      
      <div className="flex min-h-screen">
        {/* 🔹 Lista de conversas */}
        <ConversationList
          contacts={contacts}
          selectedId={selectedContactId}
          onSelect={(id) => {
            fetchMessages(id);
            setSelectedContactId(id);
          }}
          onAddContact={(name, phoneNumber) => {
            saveContact(name, phoneNumber, '')
          }}
        />

        <div className="h-screen w-full">
          {/* 🔹 Área do chat */}
          <ChatArea
            contact={contacts.find((c) => c.id === selectedContactId)}
            messages={selectedMessages}
            onSendMessage={(text, quotedMessageId) => {
              if (!selectedContactId) return;

              if (quotedMessageId) {
                sendQuotedMessage(selectedContactId, quotedMessageId, text)
                return;
              }

              sendMessage(selectedContactId, text)
            }}
            onEditContact={(contactId, name, phoneNumber, profilePicture) => {
              updateContact(contactId, name, phoneNumber, '', profilePicture)
            }}
          />
        </div>
      </div>
    </div>
  )
}
