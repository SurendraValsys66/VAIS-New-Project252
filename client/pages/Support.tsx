import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { NextGenChatbot } from "@/components/ui/next-gen-chatbot";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Ticket,
  Plus,
  Search,
  Filter,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  FileText,
  Send,
  RefreshCw,
  ExternalLink,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "overdue" | "closed";
  priority: "low" | "medium" | "high";
  category: string;
  subCategory?: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  attachments?: { name: string; size: number; type: string }[];
  chatCount?: number;
}

// Sample support tickets
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
    chatCount: 5,
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
    assignedTo: "Sarah Mitchell",
    chatCount: 8,
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
    chatCount: 12,
  },
  {
    id: "TICK-004",
    title: "Weekly report email did not send",
    description:
      "The scheduled weekly report email did not reach recipients this Monday.",
    status: "overdue",
    priority: "high",
    category: "Notifications",
    createdAt: new Date("2024-01-08T08:00:00Z"),
    updatedAt: new Date("2024-01-16T09:00:00Z"),
    chatCount: 3,
  },
];

type AttachmentDropzoneProps = {
  files: File[];
  onFiles: (files: File[]) => void;
};

function AttachmentDropzone({ files, onFiles }: AttachmentDropzoneProps) {
  const file = files[0] ?? null;
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];

  const addFiles = (incoming: FileList | File[]) => {
    const incomingArr = Array.from(incoming);
    const filtered = incomingArr.filter(
      (f) =>
        accept.includes(f.type) ||
        /\.(xls|xlsx|csv|jpeg|jpg|png|gif|bmp|webp)$/i.test(f.name),
    );
    const underLimit = filtered.filter((f) => f.size <= 5 * 1024 * 1024);

    const first = underLimit[0];
    if (first) {
      onFiles([first]);
    } else {
      onFiles([]);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex flex-col items-center justify-center text-center rounded-lg border-2 border-dashed bg-gray-50 p-6 cursor-pointer",
          isDragActive
            ? "border-valasys-orange bg-orange-50/40"
            : "border-gray-300",
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragActive(false);
          if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
        }}
      >
        <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
        <div className="font-medium text-gray-800">
          Select/Drop file to upload
        </div>
        <div className="text-sm text-gray-600">
          Add a screenshot that describes your problem.
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Supports jpeg, png, gif, bmp, webp, xls, xlsx, csv formats
        </div>
        <div className="text-xs text-gray-500">Max size 5mb</div>
        <div className="mt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-valasys-gray-300"
            onClick={() => inputRef.current?.click()}
          >
            Browse
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".jpeg,.jpg,.png,.gif,.bmp,.webp,.xls,.xlsx,.csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
          }}
        />
      </div>

      {file && (
        <div className="space-y-2">
          <div className="text-xs text-gray-600">File attached</div>
          <div className="flex items-center max-w-full">
            <span className="inline-flex items-center max-w-[260px] truncate rounded-full border border-green-200 bg-green-100 text-green-800 px-3 py-1 text-sm">
              <FileText className="w-4 h-4 mr-2 text-green-600" />
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                aria-label="Remove attachment"
                className="ml-2 rounded-full p-0.5 hover:bg-red-50 text-red-600"
                onClick={() => onFiles([])}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Support() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<SupportTicket[]>(sampleTickets);
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [liveChatMinimized, setLiveChatMinimized] = useState(false);

  type NewTicketForm = {
    description: string;
    category: string;
    subCategory: string;
    priority: "" | "low" | "medium" | "high";
  };

  const [newTicket, setNewTicket] = useState<NewTicketForm>({
    description: "",
    category: "",
    subCategory: "",
    priority: "",
  });
  const [ticketFiles, setTicketFiles] = useState<File[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || ticket.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const totalItems = filteredTickets.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  const handleCreateTicket = () => {
    const trimmedDesc = newTicket.description.trim();

    if (!newTicket.category || !newTicket.subCategory || !newTicket.priority) {
      setShowValidation(true);
      return;
    }

    const shortDesc =
      trimmedDesc.length > 60 ? `${trimmedDesc.slice(0, 60)}...` : trimmedDesc;
    const generatedTitle = `${newTicket.category}${newTicket.subCategory ? " - " + newTicket.subCategory : ""}${shortDesc ? `: ${shortDesc}` : ""}`;

    const ticket: SupportTicket = {
      id: `TICK-${String(tickets.length + 1).padStart(3, "0")}`,
      title: generatedTitle,
      description: newTicket.description,
      category: newTicket.category,
      subCategory: newTicket.subCategory,
      priority: newTicket.priority,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
      chatCount: 0,
      attachments: ticketFiles.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      })),
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({
      description: "",
      category: "",
      subCategory: "",
      priority: "",
    });
    setTicketFiles([]);
    setShowValidation(false);
    setShowNewTicketDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
      case "overdue":
        return <AlertCircle className="w-4 h-4" />;
      case "closed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day",
    );
  };

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                  <Ticket className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Support Center
                </h1>
              </div>
              <p className="text-gray-600 mt-1">
                Get help and manage your support tickets
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                <Ticket className="w-3 h-3 mr-1" />
                Open Tickets:{" "}
                <span className="font-bold ml-1">
                  {tickets.filter((t) => t.status === "open").length}
                </span>
              </Badge>
              <Dialog
                open={showNewTicketDialog}
                onOpenChange={(open) => {
                  setShowNewTicketDialog(open);
                  if (!open) {
                    setTicketFiles([]);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-valasys-orange hover:bg-valasys-orange/90">
                    <Plus className="w-4 h-4 mr-2" />
                    New Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg w-[95vw] sm:w-full max-h-[85vh] p-0 overflow-hidden flex flex-col">
                  <DialogHeader className="sticky top-0 z-10 p-4 border-b bg-background">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <DialogTitle>Create Support Ticket</DialogTitle>
                        <DialogDescription>
                          Describe your issue and we'll help you resolve it
                          quickly.
                        </DialogDescription>
                      </div>
                      <DialogClose asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          aria-label="Close"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">
                          Category <span className="text-red-600">*</span>
                        </Label>
                        <Select
                          value={newTicket.category}
                          onValueChange={(value) => {
                            setNewTicket({ ...newTicket, category: value });
                            if (showValidation) setShowValidation(false);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technical Issue">
                              Technical Issue
                            </SelectItem>
                            <SelectItem value="Billing">Billing</SelectItem>
                            <SelectItem value="Feature Request">
                              Feature Request
                            </SelectItem>
                            <SelectItem value="Export Issues">
                              Export Issues
                            </SelectItem>
                            <SelectItem value="API Support">
                              API Support
                            </SelectItem>
                            <SelectItem value="Documentation">
                              Documentation
                            </SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {showValidation && !newTicket.category && (
                          <p className="text-xs text-red-600">
                            Category is required
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subcategory">
                          Sub category <span className="text-red-600">*</span>
                        </Label>
                        <Select
                          value={newTicket.subCategory}
                          onValueChange={(value) =>
                            setNewTicket({ ...newTicket, subCategory: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Authentication">
                              Authentication
                            </SelectItem>
                            <SelectItem value="Data Export">
                              Data Export
                            </SelectItem>
                            <SelectItem value="API">API</SelectItem>
                            <SelectItem value="Integrations">
                              Integrations
                            </SelectItem>
                            <SelectItem value="UI/UX">UI/UX</SelectItem>
                            <SelectItem value="Performance">
                              Performance
                            </SelectItem>
                            <SelectItem value="Invoices">Invoices</SelectItem>
                            <SelectItem value="Credits & Usage">
                              Credits & Usage
                            </SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {showValidation && !newTicket.subCategory && (
                          <p className="text-xs text-red-600">
                            Sub category is required
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">
                          Priority <span className="text-red-600">*</span>
                        </Label>
                        <Select
                          value={newTicket.priority}
                          onValueChange={(value: "low" | "medium" | "high") =>
                            setNewTicket({ ...newTicket, priority: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        {showValidation && !newTicket.priority && (
                          <p className="text-xs text-red-600">
                            Priority is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide detailed information about your issue..."
                        rows={4}
                        value={newTicket.description}
                        onChange={(e) =>
                          setNewTicket({
                            ...newTicket,
                            description: e.target.value,
                          })
                        }
                      />

                      {/* Attachments - Drag & Drop */}
                      <div className="space-y-2">
                        <Label htmlFor="ticket-attachments">Attachments</Label>
                        <AttachmentDropzone
                          onFiles={(files) => setTicketFiles(files)}
                          files={ticketFiles}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowNewTicketDialog(false);
                        setTicketFiles([]);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTicket}
                      className="bg-valasys-orange hover:bg-valasys-orange/90"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Create Ticket
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-valasys-orange" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Search & Filters
                  </h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={filterStatus}
                  onValueChange={(v) => {
                    setFilterStatus(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filterPriority}
                  onValueChange={(v) => {
                    setFilterPriority(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                    setFilterPriority("all");
                    setCurrentPage(1);
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status quick filters */}
          <div className="flex flex-wrap gap-2 -mt-2">
            {[
              { key: "all", label: "All" },
              { key: "open", label: "Open" },
              { key: "in-progress", label: "In Progress" },
              { key: "resolved", label: "Resolved" },
              { key: "overdue", label: "Overdue" },
              { key: "closed", label: "Closed" },
            ].map((s) => {
              const count =
                s.key === "all"
                  ? tickets.length
                  : tickets.filter((t) => t.status === (s.key as any)).length;
              const active = filterStatus === s.key;
              return (
                <button
                  key={s.key || "all"}
                  onClick={() => {
                    setFilterStatus(s.key);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm",
                    s.key && s.key !== "all"
                      ? getStatusColor(s.key)
                      : "bg-gray-50 text-gray-800 border-gray-200",
                    active && "ring-2 ring-ring",
                  )}
                >
                  <span className="flex items-center gap-1">
                    {s.key && s.key !== "all" ? (
                      getStatusIcon(s.key)
                    ) : (
                      <Ticket className="w-4 h-4" />
                    )}
                    {s.label}
                  </span>
                  <span className="font-medium">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Tickets Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle className="text-lg">Your Support Tickets</CardTitle>
                <div className="text-sm text-gray-600">
                  Total Records: {totalItems} • Page: {currentPage} of{" "}
                  {totalPages}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Chat Messages</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <TableCell className="font-mono text-sm">
                          {ticket.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {ticket.title}
                            </div>
                            <div className="text-sm text-gray-600 truncate max-w-xs">
                              {ticket.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-xs border",
                              getPriorityColor(ticket.priority),
                            )}
                          >
                            {ticket.priority.charAt(0).toUpperCase() +
                              ticket.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          {ticket.category}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(ticket.createdAt)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(ticket.updatedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() =>
                                navigate(`/chat-support/${ticket.id}`)
                              }
                              variant="ghost"
                              size="sm"
                              className="relative h-10 w-10 rounded-full bg-valasys-orange/10 hover:bg-valasys-orange/20 text-valasys-orange transition-colors duration-200"
                            >
                              <MessageCircle className="w-5 h-5" />
                              {ticket.chatCount && ticket.chatCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-valasys-orange text-white text-xs font-bold rounded-full border-2 border-white">
                                  {ticket.chatCount > 99 ? "99+" : ticket.chatCount}
                                </span>
                              )}
                            </Button>
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-gray-900">
                                {ticket.chatCount || 0}
                              </span>
                              <span className="text-xs text-gray-500">
                                message{ticket.chatCount !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {totalItems === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Ticket className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No tickets found matching your criteria</p>
                  </div>
                )}

                {/* Pagination controls */}
                {totalItems > 0 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
                    <div className="text-sm text-gray-600">
                      Showing {startItem} to {endItem} of {totalItems} tickets
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, idx) => {
                          const page = idx + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={cn(
                                "px-2 py-1 rounded-md text-sm",
                                page === currentPage
                                  ? "bg-valasys-orange text-white"
                                  : "bg-transparent text-gray-700 border border-transparent hover:bg-gray-100",
                              )}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next-Generation AI Chatbot */}
        <NextGenChatbot
          isOpen={liveChatOpen}
          onClose={() => {
            setLiveChatOpen(false);
            setLiveChatMinimized(false);
          }}
          isMinimized={liveChatMinimized}
          onMinimize={() => {
            if (liveChatMinimized) {
              setLiveChatMinimized(false);
              setLiveChatOpen(true);
            } else {
              setLiveChatMinimized(true);
              setLiveChatOpen(false);
            }
          }}
          aiFeatures={{
            sentimentAnalysis: true,
            smartSuggestions: true,
            autoComplete: true,
            languageDetection: true,
            spamDetection: true,
            intentRecognition: true,
          }}
          customization={{
            theme: "auto",
            primaryColor: "#FF6A00",
            accentColor: "#1A73E8",
            avatarUrl:
              "https://cdn.builder.io/api/v1/image/assets%2F0538ba3bdc324f4899388f668257c600%2F37bed042ad244f859c2992a4365a87f1?format=webp&width=800",
            welcomeMessage:
              "Hi Daniel, please select the topic for which you seek support.",
            sounds: true,
            animations: true,
            position: "bottom-right",
          }}
          enableAnalytics={true}
          enableFileSharing={true}
          enableVoiceChat={true}
          enableScreenShare={false}
          maxFileSize={10}
        />
      </DashboardLayout>
    </TooltipProvider>
  );
}
