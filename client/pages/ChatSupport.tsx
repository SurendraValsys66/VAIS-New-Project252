import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Send,
  Paperclip,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Bot,
  Copy,
  Download,
  Phone,
  Video,
  MoreVertical,
  MapPin,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "agent" | "system";
  message: string;
  timestamp: Date;
  attachments?: string[];
  senderName?: string;
}

// Sample ticket data (in real app, this would be fetched based on ID)
const sampleTickets: SupportTicket[] = [
  {
    id: "TICK-001",
    title: "Unable to export prospect results",
    description:
      "When I try to export my prospect search results, the download fails after a few seconds.",
    status: "open",
    priority: "high",
    category: "Export Issues",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z"),
  },
  {
    id: "TICK-002",
    title: "Credit usage not updating correctly",
    description:
      "My credit balance shows incorrect numbers after running multiple searches.",
    status: "in-progress",
    priority: "medium",
    category: "Billing",
    createdAt: new Date("2024-01-12T14:20:00Z"),
    updatedAt: new Date("2024-01-14T09:15:00Z"),
    assignedTo: "Super Admin",
  },
  {
    id: "TICK-003",
    title: "API integration documentation request",
    description:
      "Need detailed documentation for integrating with our CRM system.",
    status: "resolved",
    priority: "low",
    category: "Documentation",
    createdAt: new Date("2024-01-10T16:45:00Z"),
    updatedAt: new Date("2024-01-13T11:30:00Z"),
    assignedTo: "Technical Team",
  },
];

// Sample chat messages
const sampleChatMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "system",
    message: "Chat session started for ticket TICK-001",
    timestamp: new Date("2024-01-15T10:30:00Z"),
  },
  {
    id: "2",
    sender: "user",
    message:
      "Hello, I'm having trouble exporting my prospect results. The download keeps failing after a few seconds.",
    timestamp: new Date("2024-01-15T10:31:00Z"),
    senderName: "Daniel Wilson",
  },
  {
    id: "3",
    sender: "agent",
    message:
      "Hi Daniel! I'm from the support team. I understand you're experiencing issues with prospect result exports. Let me help you resolve this quickly.",
    timestamp: new Date("2024-01-15T10:32:00Z"),
    senderName: "Super Admin",
  },
  {
    id: "4",
    sender: "agent",
    message:
      "Can you please tell me approximately how many records you're trying to export? Also, which file format are you using (CSV, Excel, etc.)?",
    timestamp: new Date("2024-01-15T10:32:30Z"),
    senderName: "Super Admin",
  },
  {
    id: "5",
    sender: "user",
    message:
      "I'm trying to export about 2,500 prospect records in CSV format. It starts downloading but then stops around 30% completion.",
    timestamp: new Date("2024-01-15T10:35:00Z"),
    senderName: "Daniel Wilson",
  },
  {
    id: "6",
    sender: "agent",
    message:
      "Thank you for that information. This seems like a timeout issue with larger exports. Let me walk you through a solution that should resolve this immediately.",
    timestamp: new Date("2024-01-15T10:36:00Z"),
    senderName: "Super Admin",
  },
];

export default function ChatSupport() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>(sampleChatMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<"open" | "in-progress" | "resolved" | "closed">("open");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find the ticket based on ID
  let ticket = sampleTickets.find((t) => t.id === ticketId);

  // Initialize ticketStatus with the ticket's current status
  useEffect(() => {
    if (ticket) {
      setTicketStatus(ticket.status);
    }
  }, [ticketId]);

  // Apply the local state status to the ticket
  if (ticket) {
    ticket = { ...ticket, status: ticketStatus };
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Ticket Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The support ticket you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/support")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Support
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      case "closed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: "user",
        message: newMessage,
        timestamp: new Date(),
        senderName: "Daniel Wilson",
      };
      setMessages([...messages, message]);
      setNewMessage("");

      // Simulate agent typing
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Add auto-response (simulated)
        const autoResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          message:
            "Thank you for your message. Let me check on that for you right away.",
          timestamp: new Date(),
          senderName: "Super Admin",
        };
        setMessages((prev) => [...prev, autoResponse]);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const handleCloseTicket = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmClose = () => {
    setTicketStatus("closed");
    // Add system message to chat
    const systemMessage: ChatMessage = {
      id: (Date.now() + 2).toString(),
      sender: "system",
      message: "Ticket has been marked as resolved and closed.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, systemMessage]);
    setShowConfirmDialog(false);
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/support")}
              className="text-valasys-orange hover:bg-valasys-orange hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tickets
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <MessageCircle className="w-6 h-6 mr-3 text-valasys-orange" />
                Chat Support - {ticket.id}
              </h1>
              <p className="text-gray-600 mt-1">
                Live chat support for your ticket
              </p>
            </div>
          </div>
          {ticketStatus !== "closed" && (
            <Button
              onClick={handleCloseTicket}
              className="font-semibold transition-all duration-200 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Close Ticket
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket Information Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-valasys-orange" />
                    Ticket Details
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      className={cn(
                        "text-xs border",
                        getStatusColor(ticket.status),
                      )}
                    >
                      <div className="flex items-center">
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1 capitalize">
                          {ticket.status.replace("-", " ")}
                        </span>
                      </div>
                    </Badge>
                    <Badge
                      className={cn(
                        "text-xs border",
                        getPriorityColor(ticket.priority),
                      )}
                    >
                      {ticket.priority.charAt(0).toUpperCase() +
                        ticket.priority.slice(1)}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {ticket.title}
                  </h3>
                  <p className="text-sm text-gray-600">{ticket.description}</p>
                </div>

                <hr className="border-gray-200" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Category</div>
                    <div className="text-sm font-medium">{ticket.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Ticket ID</div>
                    <div className="text-sm font-medium">718271</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Created</div>
                    <div className="text-sm">
                      {ticket.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Last Update
                    </div>
                    <div className="text-sm">08/05/2025</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Location
                    </div>
                    <div className="text-sm font-medium">
                      801, 8th Floor, United State
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Department</div>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                      Business Analyst
                    </Badge>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div>
                  <div className="text-sm text-gray-600 mb-2 flex items-center">
                    <Paperclip className="w-3 h-3 mr-1" />
                    Attachments
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-700">
                        Documentation-Screenshot.jpg
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-700">
                        Login-Screenshot.jpg
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-700">
                        Documentation-Screenshot.jpg
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-700">
                        Login-Screenshot.jpg
                      </span>
                    </div>
                  </div>
                </div>

                {ticket.assignedTo && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Assigned To
                    </div>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-valasys-orange text-white text-xs">
                          {ticket.assignedTo
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {ticket.assignedTo}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-200px)] flex flex-col">
              <CardHeader className="border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Live Chat Support</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Online</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] flex items-start space-x-2",
                        message.sender === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : "",
                      )}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        {message.sender === "user" ? (
                          <AvatarFallback className="bg-valasys-blue text-white">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        ) : message.sender === "agent" ? (
                          <AvatarFallback className="bg-valasys-orange text-white">
                            {message.senderName
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "A"}
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-gray-500 text-white">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        {message.senderName && (
                          <div
                            className={cn(
                              "text-xs text-gray-500 mb-1",
                              message.sender === "user"
                                ? "text-right"
                                : "text-left",
                            )}
                          >
                            {message.senderName}
                          </div>
                        )}
                        <div
                          className={cn(
                            "px-4 py-2 rounded-lg text-sm",
                            message.sender === "user"
                              ? "bg-valasys-orange text-white"
                              : message.sender === "agent"
                                ? "bg-white border border-gray-200"
                                : "bg-gray-100 text-gray-600 italic",
                          )}
                        >
                          {message.message}
                        </div>
                        <div
                          className={cn(
                            "text-xs text-gray-400 mt-1",
                            message.sender === "user"
                              ? "text-right"
                              : "text-left",
                          )}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 max-w-[70%]">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-valasys-orange text-white">
                          SM
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-end space-x-2">
                  <Button variant="outline" size="sm" className="flex-shrink-0">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="resize-none min-h-[40px] max-h-[120px]"
                      rows={1}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-valasys-orange hover:bg-valasys-orange/90 flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Press Enter to send, Shift + Enter for new line
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Close Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this ticket? Once closed, it will be marked as resolved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmClose}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
