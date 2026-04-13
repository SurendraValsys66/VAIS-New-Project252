import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Upload,
  X,
  Check,
  ChevronsUpDown,
  FileText,
  Trash2,
  Info,
  Globe,
  Users,
  Target,
  Briefcase,
  Download,
  ChevronRight,
  ChevronDown,
  Mail,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { AssetSelector, SelectedAsset } from "../campaigns/AssetSelector";
import { AIEmailGeneratorModal } from "../campaigns/AIEmailGeneratorModal";
import RecommendedCampaignType from "../campaigns/RecommendedCampaignType";

// Form validation schema
const campaignFormSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required"),
  jobTitles: z.array(z.string()).min(1, "At least one job title is required"),
  jobFunctions: z
    .array(z.string())
    .min(1, "At least one job function is required"),
  jobLevels: z.array(z.string()).min(1, "At least one job level is required"),
  geolocations: z.array(z.string()).min(1, "At least one location is required"),
  employeeSize: z
    .array(z.string())
    .min(1, "At least one employee size is required"),
  industries: z.array(z.string()).min(1, "At least one industry is required"),
  talFile: z.any().optional(),
  campaignAssets: z.array(z.any()).optional().default([]),
});

type CampaignFormData = z.infer<typeof campaignFormSchema>;

// Mock data
const jobTitleOptions = [
  "Software Engineer",
  "Product Manager",
  "Marketing Manager",
  "Sales Director",
  "Data Scientist",
  "UX Designer",
  "DevOps Engineer",
  "Business Analyst",
  "Customer Success Manager",
  "HR Manager",
  "Financial Analyst",
  "Project Manager",
];

const jobFunctionOptions = [
  "Engineering",
  "Product",
  "Marketing",
  "Sales",
  "Data & Analytics",
  "Design",
  "Operations",
  "Business Development",
  "Customer Success",
  "Human Resources",
  "Finance",
  "Management",
];

const jobLevelOptions = ["Entry", "Mid", "Senior", "Director", "VP", "C-Level"];

const geolocationOptions = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "India",
  "Singapore",
  "Japan",
  "Brazil",
  "Mexico",
];

const employeeSizeOptions = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5000+",
];

const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Education",
  "Government",
  "Real Estate",
  "Transportation",
  "Energy",
  "Media & Entertainment",
  "Telecommunications",
  "Agriculture",
  "Construction",
];

// Multi-select component
interface MultiSelectProps {
  options: string[];
  selected: string[];
  onSelectedChange: (selected: string[]) => void;
  placeholder: string;
  searchPlaceholder?: string;
  showSelectAll?: boolean;
}

function MultiSelect({
  options,
  selected,
  onSelectedChange,
  placeholder,
  searchPlaceholder = "Search...",
  showSelectAll = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleUnselect = (item: string) => {
    onSelectedChange(selected.filter((i) => i !== item));
  };

  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onSelectedChange([]);
    } else {
      onSelectedChange([...options]);
    }
  };

  const isAllSelected =
    selected.length === options.length && options.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10"
        >
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map((item) => (
                <Badge key={item} variant="secondary" className="mr-1 mb-1">
                  {item}
                  <span
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnselect(item);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </span>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {showSelectAll && (
                <CommandItem
                  onSelect={handleSelectAll}
                  className="font-medium bg-gray-50 hover:bg-blue-50"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isAllSelected ? "opacity-100" : "opacity-0",
                    )}
                  />
                  Select All
                </CommandItem>
              )}
              {options.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => {
                    if (selected.includes(option)) {
                      handleUnselect(option);
                    } else {
                      onSelectedChange([...selected, option]);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// File upload component
interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  file: File | null;
}

function FileUpload({ onFileChange, file }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors bg-white",
        dragActive ? "border-primary bg-primary/5" : "border-gray-200",
        "hover:border-primary hover:bg-primary/5",
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        accept=".csv,.xlsx,.xls"
        onChange={handleChange}
        className="hidden"
      />

      {file ? (
        <div className="flex items-center justify-center space-x-3">
          <FileText className="h-8 w-8 text-primary" />
          <div className="text-left">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onFileChange(null)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div>
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Upload TAL File
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            .csv, .xlsx, .xls — max 3 MB
          </p>
          <label htmlFor="file-upload">
            <Button
              type="button"
              variant="outline"
              asChild
              className="text-orange-500 border-orange-500"
            >
              <span className="cursor-pointer">Choose File</span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
}

// Deliverables Dialog component
interface DeliverablesDialogProps {
  jobTitles: string[];
  jobFunctions: string[];
  jobLevels: string[];
  geolocations: string[];
  industries: string[];
  campaignName: string;
  employeeSize: string[];
  userHasFullPermission?: boolean;
  isFormValid?: boolean;
  selectedAssets?: SelectedAsset[];
  onCampaignAccepted?: () => void;
}

type CampaignStatus = "pending" | "accepted" | "declined";

function DeliverablesDialog({
  jobTitles,
  jobFunctions,
  jobLevels,
  geolocations,
  industries,
  campaignName,
  employeeSize,
  userHasFullPermission = true,
  isFormValid = true,
  selectedAssets = [],
  onCampaignAccepted,
}: DeliverablesDialogProps) {
  const [open, setOpen] = useState(false);
  const [campaignStatus, setCampaignStatus] =
    useState<CampaignStatus>("pending");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Region mappings
  const regionMap: { [key: string]: string } = {
    "United States": "United States",
    Canada: "Canada",
    Mexico: "LATAM",
    Brazil: "LATAM",
    "United Kingdom": "EMEA",
    Germany: "EMEA",
    France: "EMEA",
    Australia: "APAC",
    India: "APAC",
    Singapore: "APAC",
    Japan: "APAC",
  };

  // Limit geolocations to top 5
  const selectedGeolocations = geolocations.slice(0, 5);

  // Use only selected job levels (no limit)
  const selectedJobLevels =
    jobLevels.length > 0
      ? jobLevels
      : ["C-Level", "Vice President", "Director", "Manager", "Staff"];

  // Generate Database Reach data by Job Level
  const generateJobLevelData = () => {
    const data: { [key: string]: { [key: string]: number } } = {};

    selectedJobLevels.forEach((level) => {
      data[level] = {};
      selectedGeolocations.forEach((geo) => {
        data[level][geo] = Math.floor(Math.random() * 50) + 30;
      });
    });

    return data;
  };

  const jobLevelData = generateJobLevelData();

  // Calculate Job Level total count
  const jobLevelTotal = selectedJobLevels.reduce((sum, level) => {
    const levelTotal = selectedGeolocations.reduce(
      (geoSum, geo) => geoSum + (jobLevelData[level]?.[geo] || 0),
      0,
    );
    return sum + levelTotal;
  }, 0);

  const deliverableColumns = [
    "United States",
    "Canada",
    "LATAM",
    "EMEA",
    "APAC",
  ];

  // Calculate deliverables by region/column
  const monthlyDeliverablesData: {
    [key: string]: { [key: string]: number };
  } = {
    CS: {},
    MQL: {},
    HQL: {},
    BANT: {},
    Webinar: {},
  };

  const deliverableRatios = {
    CS: 1.0,
    MQL: 0.75,
    HQL: 0.45,
    BANT: 0.26,
    Webinar: 0.61,
  };

  // Populate CS counts (Base Reach) based on jobLevelTotal
  // Increase it significantly to match the image's scale
  const baseReachTotal = Math.max(jobLevelTotal * 12, 10000);

  deliverableColumns.forEach((col) => {
    const isSelected = geolocations.some((geo) => regionMap[geo] === col);

    if (isSelected) {
      const regionWeight =
        col === "United States"
          ? 0.46
          : col === "EMEA"
            ? 0.31
            : col === "APAC"
              ? 0.15
              : col === "Canada"
                ? 0.04
                : 0.04;
      const variation = 0.9 + Math.random() * 0.2;
      const count = Math.floor(baseReachTotal * regionWeight * variation);
      monthlyDeliverablesData.CS[col] = Math.max(50, count);
    } else {
      monthlyDeliverablesData.CS[col] = 0;
    }
  });

  // If no geolocations, provide exact image counts as fallback
  if (geolocations.length === 0) {
    monthlyDeliverablesData.CS["United States"] = 7621;
    monthlyDeliverablesData.CS["Canada"] = 620;
    monthlyDeliverablesData.CS["LATAM"] = 570;
    monthlyDeliverablesData.CS["EMEA"] = 5121;
    monthlyDeliverablesData.CS["APAC"] = 2561;
  }

  // Calculate other deliverables based on CS
  Object.keys(deliverableRatios).forEach((type) => {
    if (type === "CS") return;
    const ratio = deliverableRatios[type as keyof typeof deliverableRatios];
    deliverableColumns.forEach((col) => {
      monthlyDeliverablesData[type][col] = Math.floor(
        monthlyDeliverablesData.CS[col] * ratio,
      );
    });
  });

  const getRowTotal = (data: { [key: string]: number }) =>
    Object.values(data).reduce((a, b) => a + b, 0);

  const getColTotal = (
    data: { [key: string]: { [key: string]: number } },
    col: string,
  ) => Object.keys(data).reduce((sum, type) => sum + data[type][col], 0);

  const totalMonthlyCS = getRowTotal(monthlyDeliverablesData.CS);
  const totalDeliverables = totalMonthlyCS;

  // Use only selected employee sizes (no limit)
  const selectedEmployeeSizeList =
    employeeSize && employeeSize.length > 0
      ? employeeSize
      : [
          "1-10",
          "11-50",
          "51-200",
          "201-500",
          "501-1000",
          "1001-5000",
          "5001-10,000",
          "10,000+",
        ];

  // Generate Database Reach data by Employee Size
  const generateEmployeeSizeData = () => {
    const data: { [key: string]: { [key: string]: number } } = {};

    selectedEmployeeSizeList.forEach((size) => {
      data[size] = {};
      selectedGeolocations.forEach((geo) => {
        data[size][geo] = Math.floor(Math.random() * 200) + 100;
      });
    });

    return data;
  };

  const employeeSizeData = generateEmployeeSizeData();

  // Calculate Employee Size total count
  const employeeSizeTotal = selectedEmployeeSizeList.reduce((sum, size) => {
    const sizeTotal = selectedGeolocations.reduce(
      (geoSum, geo) => geoSum + (employeeSizeData[size]?.[geo] || 0),
      0,
    );
    return sum + sizeTotal;
  }, 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          disabled={!isFormValid}
          className="text-sm font-semibold bg-orange-500 text-white border-orange-500 hover:bg-orange-600 flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed h-12 px-8"
        >
          <Info className="w-5 h-5" />
          Check Deliverables
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl overflow-y-auto bg-gray-50/50 p-0">
        <div className="bg-white border-b sticky top-0 z-10 px-6 py-4 flex flex-col gap-1">
          <SheetHeader className="space-y-0">
            <div className="flex items-center justify-between gap-4">
              <SheetTitle className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                Deliverables Overview
              </SheetTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                  onClick={() => {
                    // Export functionality placeholder
                    console.log("Export data triggered");
                  }}
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <SheetClose asChild>
                  <button
                    className="h-8 w-8 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
                    aria-label="Close panel"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </SheetClose>
              </div>
            </div>
            <SheetDescription className="text-sm text-gray-500 font-medium">
              {campaignName || "Your Campaign"} • Database Reach Analysis & Campaign Projections
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Campaign Intelligence Section - Sleek & Compact */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Compact Header with Gradient Accent */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-orange-50/30">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Campaign Intelligence</h3>
                <p className="text-xs text-gray-500 font-medium">Metrics & AI-Powered Recommendation</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Compact KPI Metrics */}
              <div className="grid grid-cols-3 gap-3">
                {/* Monthly Volume */}
                <div className="text-center p-4 rounded-lg bg-orange-50/50 border border-orange-100 hover:border-orange-200 transition-colors">
                  <Mail className="w-4 h-4 text-orange-600 mx-auto mb-2" />
                  <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">Monthly</p>
                  <p className="text-2xl font-black text-gray-900">{(totalMonthlyCS / 1000).toFixed(1)}k</p>
                  <p className="text-[10px] text-gray-500 mt-1">deliverables</p>
                </div>

                {/* Quarterly Volume */}
                <div className="text-center p-4 rounded-lg bg-blue-50/50 border border-blue-100 hover:border-blue-200 transition-colors">
                  <Briefcase className="w-4 h-4 text-blue-600 mx-auto mb-2" />
                  <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">Quarterly</p>
                  <p className="text-2xl font-black text-gray-900">{((totalMonthlyCS * 3) / 1000).toFixed(1)}k</p>
                  <p className="text-[10px] text-gray-500 mt-1">forecast</p>
                </div>

                {/* Database Reach */}
                <div className="text-center p-4 rounded-lg bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 transition-colors">
                  <Users className="w-4 h-4 text-emerald-600 mx-auto mb-2" />
                  <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">Database</p>
                  <p className="text-2xl font-black text-gray-900">{(jobLevelTotal / 1000).toFixed(1)}k</p>
                  <p className="text-[10px] text-gray-500 mt-1">profiles</p>
                </div>
              </div>

              {/* Recommendation */}
              <div className="pt-2 border-t border-gray-100">
                <RecommendedCampaignType
                  jobTitles={jobTitles}
                  jobFunctions={jobFunctions}
                  jobLevels={jobLevels}
                  geolocations={geolocations}
                  employeeSize={employeeSize}
                  industries={industries}
                  totalDeliverables={totalDeliverables}
                  campaignAssets={selectedAssets}
                />
              </div>
            </div>
          </div>

          <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-6">
            {/* 1) Quarterly Deliverables */}
            <AccordionItem value="item-1" className="border-none rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:ring-blue-200">
              <AccordionTrigger className="px-6 py-5 hover:no-underline group transition-all">
                <div className="flex items-center gap-4 text-left w-full">
                  <div className="p-2.5 bg-blue-50 rounded-xl group-data-[state=open]:bg-blue-600 group-data-[state=open]:text-white transition-colors">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-gray-900 uppercase tracking-tight">
                        Quarterly Deliverables
                      </h4>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 font-bold text-[10px] uppercase px-2 py-0">
                        3-Month Forecast
                      </Badge>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">ESTIMATED PROJECTION BASED ON CURRENT SELECTIONS</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0 border-t border-gray-50">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80">
                        <th className="px-6 py-3.5 text-left text-[11px] font-black text-gray-500 bg-gray-100/50 uppercase tracking-widest border-r border-gray-100">Deliverable Type</th>
                        {deliverableColumns.map((col) => (
                          <th key={col} className="px-6 py-3.5 text-center text-[11px] font-black text-gray-500 uppercase tracking-widest border-r border-gray-100">
                            {col}
                          </th>
                        ))}
                        <th className="px-6 py-3.5 text-center text-[11px] font-black text-blue-600 bg-blue-50/50 uppercase tracking-widest">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Object.keys(monthlyDeliverablesData).map((type) => (
                        <tr key={type} className="hover:bg-blue-50/40 transition-colors group">
                          <td className="px-6 py-4 text-sm font-extrabold text-gray-900 bg-gray-50 group-hover:bg-blue-50 border-r border-gray-200 min-w-[140px]">
                            {type}
                          </td>
                          {deliverableColumns.map((col) => (
                            <td key={col} className="px-6 py-4 text-sm text-center text-gray-600 font-medium border-r border-gray-50 group-hover:text-gray-900">
                              {(monthlyDeliverablesData[type][col] * 3).toLocaleString()}
                            </td>
                          ))}
                          <td className="px-6 py-4 text-sm text-center font-black text-blue-700 bg-blue-50/30 group-hover:bg-blue-50">
                            {(getRowTotal(monthlyDeliverablesData[type]) * 3).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2) Monthly Deliverables */}
            <AccordionItem value="item-2" className="border-none rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:ring-orange-200">
              <AccordionTrigger className="px-6 py-5 hover:no-underline group transition-all">
                <div className="flex items-center gap-4 text-left w-full">
                  <div className="p-2.5 bg-orange-50 rounded-xl group-data-[state=open]:bg-orange-600 group-data-[state=open]:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-gray-900 uppercase tracking-tight">
                        Monthly Deliverables
                      </h4>
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-50 font-bold text-[10px] uppercase px-2 py-0">
                        Monthly Pace
                      </Badge>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">PROPOSED DELIVERY CAPACITY PER CALENDAR MONTH</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0 border-t border-gray-50">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80">
                        <th className="px-6 py-3.5 text-left text-[11px] font-black text-gray-500 bg-gray-100/50 uppercase tracking-widest border-r border-gray-100">Deliverable Type</th>
                        {deliverableColumns.map((col) => (
                          <th key={col} className="px-6 py-3.5 text-center text-[11px] font-black text-gray-500 uppercase tracking-widest border-r border-gray-100">
                            {col}
                          </th>
                        ))}
                        <th className="px-6 py-3.5 text-center text-[11px] font-black text-orange-600 bg-orange-50/50 uppercase tracking-widest">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Object.keys(monthlyDeliverablesData).map((type) => (
                        <tr key={type} className="hover:bg-orange-50/40 transition-colors group">
                          <td className="px-6 py-4 text-sm font-extrabold text-gray-900 bg-gray-50 group-hover:bg-orange-50 border-r border-gray-200 min-w-[140px]">
                            {type}
                          </td>
                          {deliverableColumns.map((col) => (
                            <td key={col} className="px-6 py-4 text-sm text-center text-gray-600 font-medium border-r border-gray-50 group-hover:text-gray-900">
                              {monthlyDeliverablesData[type][col].toLocaleString()}
                            </td>
                          ))}
                          <td className="px-6 py-4 text-sm text-center font-black text-orange-700 bg-orange-50/30 group-hover:bg-orange-50">
                            {getRowTotal(monthlyDeliverablesData[type]).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3) Database Reach by Job Level */}
            <AccordionItem value="item-3" className="border-none rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:ring-indigo-200">
              <AccordionTrigger className="px-6 py-5 hover:no-underline group transition-all">
                <div className="flex items-center gap-4 text-left w-full">
                  <div className="p-2.5 bg-indigo-50 rounded-xl group-data-[state=open]:bg-indigo-600 group-data-[state=open]:text-white transition-colors">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-gray-900 uppercase tracking-tight">
                        Reach by Job Level
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 font-bold text-[10px] uppercase px-2 py-0">
                          {jobLevelTotal.toLocaleString()} Profiles
                        </Badge>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">PROFILE DISTRIBUTION ACROSS SELECTED GEOGRAPHIES</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0 border-t border-gray-50">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/80">
                        <th className="px-6 py-3.5 text-left text-[11px] font-black text-gray-500 bg-gray-100/50 uppercase tracking-widest border-r border-gray-100">Level Name</th>
                        {selectedGeolocations.map((geo) => (
                          <th key={geo} className="px-6 py-3.5 text-center text-[11px] font-black text-gray-500 uppercase tracking-widest border-r border-gray-100">
                            {geo}
                          </th>
                        ))}
                        <th className="px-6 py-3.5 text-center text-[11px] font-black text-indigo-600 bg-indigo-50/50 uppercase tracking-widest">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedJobLevels.map((level, index) => {
                        const levelTotal = selectedGeolocations.reduce(
                          (sum, geo) => sum + (jobLevelData[level]?.[geo] || 0),
                          0,
                        );
                        return (
                          <tr key={level} className="hover:bg-indigo-50/40 transition-colors group">
                            <td className="px-6 py-4 text-sm font-extrabold text-gray-900 bg-gray-50 group-hover:bg-indigo-50 border-r border-gray-200">
                              {level}
                            </td>
                            {selectedGeolocations.map((geo) => (
                              <td key={geo} className="px-6 py-4 text-sm text-center text-gray-600 font-medium border-r border-gray-50 group-hover:text-gray-900">
                                {jobLevelData[level]?.[geo] || 0}
                              </td>
                            ))}
                            <td className="px-6 py-4 text-sm text-center font-black text-indigo-700 bg-indigo-50/30 group-hover:bg-indigo-50">
                              {levelTotal.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 4) Database Reach by Employee Size */}
            <AccordionItem value="item-4" className="border-none rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:ring-emerald-200">
              <AccordionTrigger className="px-6 py-5 hover:no-underline group transition-all">
                <div className="flex items-center gap-4 text-left w-full">
                  <div className="p-2.5 bg-emerald-50 rounded-xl group-data-[state=open]:bg-emerald-600 group-data-[state=open]:text-white transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-gray-900 uppercase tracking-tight">
                        Reach by Employee Size
                      </h4>
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 font-bold text-[10px] uppercase px-2 py-0">
                        {employeeSizeTotal.toLocaleString()} Profiles
                      </Badge>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">COMPANY SCALE DISTRIBUTION ACROSS GEOGRAPHIES</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0 border-t border-gray-50">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/80">
                        <th className="px-6 py-3.5 text-left text-[11px] font-black text-gray-500 bg-gray-100/50 uppercase tracking-widest border-r border-gray-100">Size Range</th>
                        {selectedGeolocations.map((geo) => (
                          <th key={geo} className="px-6 py-3.5 text-center text-[11px] font-black text-gray-500 uppercase tracking-widest border-r border-gray-100">
                            {geo}
                          </th>
                        ))}
                        <th className="px-6 py-3.5 text-center text-[11px] font-black text-emerald-600 bg-emerald-50/50 uppercase tracking-widest">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedEmployeeSizeList.map((size, index) => {
                        const sizeTotal = selectedGeolocations.reduce(
                          (sum, geo) =>
                            sum + (employeeSizeData[size]?.[geo] || 0),
                          0,
                        );
                        return (
                          <tr key={size} className="hover:bg-emerald-50/40 transition-colors group">
                            <td className="px-6 py-4 text-sm font-extrabold text-gray-900 bg-gray-50 group-hover:bg-emerald-50 border-r border-gray-200">
                              {size}
                            </td>
                            {selectedGeolocations.map((geo) => (
                              <td key={geo} className="px-6 py-4 text-sm text-center text-gray-600 font-medium border-r border-gray-50 group-hover:text-gray-900">
                                {employeeSizeData[size]?.[geo] || 0}
                              </td>
                            ))}
                            <td className="px-6 py-4 text-sm text-center font-black text-emerald-700 bg-emerald-50/30 group-hover:bg-emerald-50">
                              {sizeTotal.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="pt-4 pb-8 space-y-8">
            {/* Campaign Actions */}
            {userHasFullPermission && (
              <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm bg-gradient-to-br from-white to-amber-50/30">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Briefcase className="w-5 h-5 text-amber-600" />
                    </div>
                    Campaign Decision
                  </h3>
                  {campaignStatus === "pending" && (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">Needs Review</Badge>
                  )}
                </div>

                {campaignStatus === "pending" && (
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      Based on the reach analysis and projected deliverables above, would you like to proceed with this campaign request?
                    </p>
                    <div className="flex gap-3 justify-end pt-2">
                      <Button
                        type="button"
                        onClick={() => setCampaignStatus("declined")}
                        variant="outline"
                        className="font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all px-6"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowConfirmation(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold transition-all px-8 shadow-sm hover:shadow-md"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept Campaign
                      </Button>
                    </div>
                  </div>
                )}

                {campaignStatus === "accepted" && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="p-2 bg-green-100 rounded-full mt-0.5">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-extrabold text-green-900 text-base">Campaign Accepted</p>
                      <p className="text-sm text-green-700 mt-1 font-medium leading-relaxed">
                        Excellent choice! Your campaign has been queued. Our expert strategy team will review the parameters and contact you within 24 hours to begin execution.
                      </p>
                    </div>
                  </div>
                )}

                {campaignStatus === "declined" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="p-2 bg-red-100 rounded-full mt-0.5">
                      <X className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-extrabold text-red-900 text-base">Campaign Declined</p>
                      <p className="text-sm text-red-700 mt-1 font-medium leading-relaxed">
                        This campaign request has been marked as declined. You can adjust your criteria or assets and check deliverables again to submit a revised request.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Important Information */}
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-sm font-extrabold text-blue-900 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                Strategic Insights & Guidelines
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex gap-3 text-gray-700">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  </div>
                  <span className="text-xs font-medium leading-relaxed">
                    Estimated counts are based on current verified database records.
                  </span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  </div>
                  <span className="text-xs font-medium leading-relaxed">
                    Final delivery numbers may vary by ±5% based on real-time engagement.
                  </span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  </div>
                  <span className="text-xs font-medium leading-relaxed">
                    Data includes 100% verified emails and professional background data.
                  </span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  </div>
                  <span className="text-xs font-medium leading-relaxed">
                    Full campaign reports available for export in multiple formats.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </SheetContent>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              Confirm Campaign Acceptance
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Please review the campaign details before accepting:
            </p>

            <div className="space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Quarterly Volume</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Projected deliverables based on your targeting criteria
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Database Reach</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Total contacts available matching your audience selection
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Campaign Assets</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Your email templates and landing pages are ready
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              By accepting, you agree to proceed with this campaign. You can track progress and manage campaign requests in the Campaign Requests tab.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setCampaignStatus("accepted");
                setShowConfirmation(false);
                setOpen(false);
                onCampaignAccepted?.();
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Confirm Acceptance
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}

interface CampaignRequestFormProps {
  onCampaignAccepted?: () => void;
}

export default function CampaignRequestForm({ onCampaignAccepted }: CampaignRequestFormProps) {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<SelectedAsset[]>([]);
  const [emailGeneratorOpen, setEmailGeneratorOpen] = useState(false);
  const [landingPageDropdownOpen, setLandingPageDropdownOpen] = useState(false);
  const [campaignMode, setCampaignMode] = useState<"live" | "tal">("live");
  const [campaignSubmitted, setCampaignSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds

  // Handle countdown timer for TAL mode
  React.useEffect(() => {
    if (!campaignSubmitted || campaignMode !== "tal" || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [campaignSubmitted, campaignMode, timeRemaining]);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      campaignName: "",
      jobTitles: [],
      jobFunctions: [],
      jobLevels: [],
      geolocations: [],
      employeeSize: [],
      industries: [],
      campaignAssets: [],
    },
  });

  const onSubmit = (data: CampaignFormData) => {
    if (campaignMode === "tal") {
      console.log("TAL Campaign submitted:", data);
      console.log("Uploaded file:", uploadedFile);
      setCampaignSubmitted(true);
      setTimeRemaining(7200); // Reset 2-hour timer (120 seconds for demo)
    } else {
      console.log("Live Campaign submitted:", data);
      console.log("Selected assets:", selectedAssets);
    }
  };

  const isFormValid = () => {
    const values = form.watch();
    return (
      values.campaignName &&
      values.jobTitles?.length > 0 &&
      values.jobFunctions?.length > 0 &&
      values.jobLevels?.length > 0 &&
      values.geolocations?.length > 0 &&
      values.industries?.length > 0 &&
      values.employeeSize?.length > 0
    );
  };

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Premium Header Section */}
        <div className="mb-8 bg-gradient-to-r from-orange-50 via-white to-orange-50 rounded-2xl p-8 border border-orange-100 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1 w-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"></div>
                <span className="text-sm font-semibold text-orange-600 uppercase tracking-widest">Campaign Setup</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Create Your Campaign
              </h2>
              <p className="text-base text-gray-600 max-w-lg leading-relaxed">
                Set up your targeting criteria and choose how you want to manage your campaign—either live analytics or bulk file uploads.
              </p>
            </div>
            <div className="flex flex-col items-end gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Campaign Mode</span>
                <ToggleGroup
                  type="single"
                  value={campaignMode}
                  onValueChange={(value) => {
                    if (value) setCampaignMode(value as "live" | "tal");
                  }}
                  className="bg-white border border-orange-200 rounded-xl p-1 shadow-sm"
                >
                  <ToggleGroupItem
                    value="live"
                    aria-label="Live mode"
                    className="text-sm font-semibold px-5 py-2.5 rounded-lg data-[state=on]:bg-orange-500 data-[state=on]:text-white data-[state=off]:text-gray-600 transition-all duration-200"
                  >
                    Live
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="tal"
                    aria-label="TAL File mode"
                    className="text-sm font-semibold px-5 py-2.5 rounded-lg data-[state=on]:bg-orange-500 data-[state=on]:text-white data-[state=off]:text-gray-600 transition-all duration-200"
                  >
                    TAL File
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Card - Single Card Layout */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="space-y-6">
            {/* Form Content in 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign Name */}
              <FormField
                control={form.control}
                name="campaignName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Campaign Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Q2 SaaS Decision Makers Push"
                        {...field}
                        className="h-10 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Employee Size */}
              <FormField
                control={form.control}
                name="employeeSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Employee Size *
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={employeeSizeOptions}
                        selected={field.value}
                        onSelectedChange={field.onChange}
                        placeholder="Select employee size ranges"
                        searchPlaceholder="Search..."
                        showSelectAll={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Title */}
              <FormField
                control={form.control}
                name="jobTitles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Job Title
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={jobTitleOptions}
                        selected={field.value}
                        onSelectedChange={field.onChange}
                        placeholder="Select job titles"
                        searchPlaceholder="Search..."
                        showSelectAll={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Function */}
              <FormField
                control={form.control}
                name="jobFunctions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Job Function *
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={jobFunctionOptions}
                        selected={field.value}
                        onSelectedChange={field.onChange}
                        placeholder="Select job functions"
                        searchPlaceholder="Search..."
                        showSelectAll={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Level */}
              <FormField
                control={form.control}
                name="jobLevels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Job Level *
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={jobLevelOptions}
                        selected={field.value}
                        onSelectedChange={field.onChange}
                        placeholder="Select levels"
                        showSelectAll={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Geolocation */}
              <FormField
                control={form.control}
                name="geolocations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-900">
                      Geolocation *
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={geolocationOptions}
                        selected={field.value}
                        onSelectedChange={field.onChange}
                        placeholder="Select locations"
                        searchPlaceholder="Search..."
                        showSelectAll={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Industry - Full Width */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="industries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-900">
                        Industry
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={industryOptions}
                          selected={field.value}
                          onSelectedChange={field.onChange}
                          placeholder="Select industries"
                          searchPlaceholder="Search..."
                          showSelectAll={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* File Upload - Only shown in TAL mode - Full Width */}
              {campaignMode === "tal" && (
                <div className="md:col-span-2">
                  <div className="mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Upload TAL File
                    </h4>
                  </div>
                  <FileUpload onFileChange={setUploadedFile} file={uploadedFile} />
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Campaign Deliverables Section */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-500">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {campaignMode === "live"
                      ? "Live Campaign Deliverables"
                      : "TAL File Campaign Request"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {campaignMode === "live"
                      ? "View live campaign deliverables and reach analytics in real-time."
                      : "Submit your TAL file and we'll prepare all deliverables for you."}
                  </p>

                  {campaignMode === "live" ? (
                    // LIVE MODE - Show Check Deliverables Button
                    <DeliverablesDialog
                      jobTitles={form.watch("jobTitles")}
                      jobFunctions={form.watch("jobFunctions")}
                      jobLevels={form.watch("jobLevels")}
                      geolocations={form.watch("geolocations")}
                      industries={form.watch("industries")}
                      campaignName={form.watch("campaignName")}
                      employeeSize={form.watch("employeeSize")}
                      isFormValid={isFormValid()}
                      selectedAssets={selectedAssets}
                      onCampaignAccepted={onCampaignAccepted}
                    />
                  ) : (
                    // TAL FILE MODE - Show Submit Button or Countdown
                    <>
                      {!campaignSubmitted ? (
                        <>
                          <Button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold h-12 px-8"
                            disabled={!isFormValid()}
                          >
                            Submit Campaign Request
                          </Button>
                          <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <Info className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 mb-2">
                                  Your request will be processed by our data team.
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-gray-600">Estimated Processing Time:</span>
                                  <span className="text-sm font-bold text-orange-600">⏱ ~2 Hours</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-green-900 mb-1">
                                  Campaign Request Submitted!
                                </h4>
                                <p className="text-xs text-green-800 mb-3">
                                  Your campaign request has been received. We will prepare all deliverables and notify you when they are ready.
                                </p>
                                <div className="bg-white rounded border border-green-200 p-3">
                                  <p className="text-xs font-medium text-gray-600 mb-1">
                                    Time until deliverables are ready:
                                  </p>
                                  <p className="text-lg font-bold text-green-700">
                                    {formatTimeRemaining(timeRemaining)}
                                  </p>
                                  {timeRemaining === 0 && (
                                    <p className="text-xs text-green-700 mt-2 font-semibold">
                                      ✓ All deliverables are ready for download!
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {timeRemaining === 0 && (
                            <Button
                              type="button"
                              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium h-10"
                              onClick={() => {
                                setCampaignSubmitted(false);
                                form.reset();
                              }}
                            >
                              Download Deliverables
                            </Button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Asset Buttons - Below Deliverables Section - Only in Live mode */}
              {campaignMode === "live" && (
              <div className="mt-6 pt-6 border-t border-orange-200">
                <p className="text-sm text-gray-600 mb-4 font-medium">
                  Add Campaign Assets (Optional)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* AI Email Generator Button */}
                  <button
                    type="button"
                    onClick={() => setEmailGeneratorOpen(true)}
                    className={cn(
                      "py-2 px-3 rounded-lg text-xs font-medium transition-all border-2 flex items-center justify-center gap-2 hidden",
                      selectedAssets.some((a) => a.id === "email-gen")
                        ? "bg-blue-100 border-blue-500 text-blue-900"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-300",
                    )}
                  >
                    <Mail className="w-3 h-3" />
                    <span>AI Email Generator</span>
                    {selectedAssets.some((a) => a.id === "email-gen") && (
                      <Check className="w-3 h-3 ml-auto" />
                    )}
                  </button>

                  {/* Landing Page Dropdown Button */}
                  <Popover
                    open={landingPageDropdownOpen}
                    onOpenChange={setLandingPageDropdownOpen}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "py-2 px-3 rounded-lg text-xs font-medium transition-all border-2 flex items-center justify-center gap-2 w-full",
                          "bg-gray-50 border-gray-200 text-gray-700 hover:border-purple-300",
                        )}
                      >
                        <Globe className="w-3 h-3" />
                        <span>Landing Page</span>
                        <ChevronDown className="w-3 h-3 ml-auto" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0">
                      <div className="flex flex-col">
                        {/* Email Template Builder Option */}
                        <button
                          type="button"
                          onClick={() => {
                            setLandingPageDropdownOpen(false);
                            navigate("/templates");
                          }}
                          className="px-4 py-3 text-xs text-left hover:bg-purple-50 border-b border-gray-200 flex items-center gap-2 transition-colors"
                        >
                          <Mail className="w-4 h-4 text-purple-600" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              Email Template Builder
                            </p>
                            <p className="text-xs text-gray-600">
                              Design custom email templates
                            </p>
                          </div>
                        </button>

                        {/* Landing Page Builder Option */}
                        <button
                          type="button"
                          onClick={() => {
                            setLandingPageDropdownOpen(false);
                            navigate("/landing-pages");
                          }}
                          className="px-4 py-3 text-xs text-left hover:bg-purple-50 flex items-center gap-2 transition-colors"
                        >
                          <Globe className="w-4 h-4 text-purple-600" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              Landing Page Builder
                            </p>
                            <p className="text-xs text-gray-600">
                              Create conversion-optimized pages
                            </p>
                          </div>
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Upload Template Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const templateAsset: SelectedAsset = {
                        id: "template-upload",
                        type: "template",
                        name: "Upload Template",
                        description:
                          "Upload your existing email or page templates",
                        config: {},
                      };
                      if (
                        selectedAssets.some((a) => a.id === templateAsset.id)
                      ) {
                        setSelectedAssets(
                          selectedAssets.filter(
                            (a) => a.id !== templateAsset.id,
                          ),
                        );
                      } else {
                        setSelectedAssets([...selectedAssets, templateAsset]);
                      }
                    }}
                    className={cn(
                      "py-2 px-3 rounded-lg text-xs font-medium transition-all border-2 flex items-center justify-center gap-2 hidden",
                      selectedAssets.some((a) => a.id === "template-upload")
                        ? "bg-amber-100 border-amber-500 text-amber-900"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-amber-300",
                    )}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Template</span>
                    {selectedAssets.some((a) => a.id === "template-upload") && (
                      <Check className="w-3 h-3 ml-auto" />
                    )}
                  </button>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* AI Email Generator Modal */}
      <AIEmailGeneratorModal
        isOpen={emailGeneratorOpen}
        onClose={() => setEmailGeneratorOpen(false)}
        campaignName={form.watch("campaignName")}
        jobTitles={form.watch("jobTitles")}
        jobFunctions={form.watch("jobFunctions")}
        jobLevels={form.watch("jobLevels")}
        geolocations={form.watch("geolocations")}
        industries={form.watch("industries")}
      />
    </Form>
  );
}
