import { apiClient } from "./api";

export interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  senderId: string;
  receiverId: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface Conversation {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  lastMessage: Message;
  unreadCount: number;
  messages: Message[];
}

export const messageService = {
  // Récupérer tous les messages
  async getMessages(limit = 50, offset = 0) {
    return apiClient.get<Message[]>(`/messages?limit=${limit}&offset=${offset}`);
  },

  // Récupérer la liste des conversations
  async getConversations() {
    return apiClient.get<Conversation[]>("/messages/conversations");
  },

  // Récupérer une conversation spécifique
  async getConversation(userId: string) {
    return apiClient.get<Message[]>(`/messages/conversation/${userId}`);
  },

  // Envoyer un message
  async sendMessage(receiverId: string, content: string) {
    return apiClient.post<Message>("/messages", { receiverId, content });
  },

  // Marquer un message comme lu
  async markAsRead(messageId: string) {
    return apiClient.put<Message>(`/messages/${messageId}/read`, {});
  },

  // Compter les messages non lus
  async getUnreadCount() {
    return apiClient.get<{ count: number }>("/messages/unread/count");
  },

  // Supprimer un message
  async deleteMessage(messageId: string) {
    return apiClient.delete(`/messages/${messageId}`);
  },
};
