import React, { useState } from "react";
import { LandingPageBlock } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnhancedSettingsPanelProps {
  block: LandingPageBlock | null;
  onBlockUpdate: (block: LandingPageBlock) => void;
  onBlockDelete: () => void;
}

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label }) => (
  <div>
    <Label className="text-xs font-semibold text-gray-700 mb-2 block">
      {label}
    </Label>
    <div className="flex gap-2">
      <Input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-10 cursor-pointer"
      />
      <Input
        type="text"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 focus:ring-valasys-orange focus:ring-2"
        placeholder="#000000"
      />
    </div>
  </div>
);

const NumberInput: React.FC<{
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
}> = ({ label, value, onChange, unit = "", step = 1, min, max }) => (
  <div>
    <Label className="text-xs font-semibold text-gray-700 mb-2 block">
      {label}
    </Label>
    <div className="flex gap-2">
      <Input
        type="number"
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      {unit && <span className="flex items-center text-xs text-gray-500">{unit}</span>}
    </div>
  </div>
);

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
}

const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  accept = "image/*",
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("Image file selected:", file?.name);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        console.log("FileReader onload called, dataUrl length:", dataUrl?.length);
        onChange(dataUrl);
      };
      reader.onerror = () => {
        console.error("FileReader error");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Label className="text-xs font-semibold text-gray-700 mb-2 block">
        {label}
      </Label>
      <div className="space-y-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-3 py-2 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleImageUpload}
          className="hidden"
        />
        {value && (
          <div className="flex gap-2 items-center">
            <img
              src={value}
              alt="Preview"
              className="w-full h-32 object-cover rounded border border-gray-200"
            />
          </div>
        )}
        <div>
          <Label className="text-xs font-semibold text-gray-700 mb-2 block">
            Or paste URL
          </Label>
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="text-xs"
          />
        </div>
      </div>
    </div>
  );
};

const SpacingInput: React.FC<{
  label: string;
  fullLabel: string;
  value: string | number;
  unit: "px" | "%";
  onValueChange: (value: string) => void;
  onUnitChange: (unit: "px" | "%") => void;
}> = ({ label, fullLabel, value, unit, onValueChange, onUnitChange }) => {
  // Validate value based on unit
  const validateValue = (val: string, currentUnit: "px" | "%"): string => {
    const numVal = Number(val);
    if (isNaN(numVal)) return "0";

    // For percentage, cap at 0-100
    if (currentUnit === "%") {
      return String(Math.min(100, Math.max(0, numVal)));
    }
    // For px, allow any value including negative
    return String(numVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const current = Number(value || "0");
      const newVal = current + 1;
      const validated = validateValue(String(newVal), unit);
      onValueChange(validated);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const current = Number(value || "0");
      const newVal = Math.max(0, current - 1);
      const validated = validateValue(String(newVal), unit);
      onValueChange(validated);
    }
  };

  const handleInputChange = (inputValue: string) => {
    const validated = validateValue(inputValue, unit);
    onValueChange(validated);
  };

  const handleIncrement = () => {
    const current = Number(value || "0");
    const newVal = current + 1;
    const validated = validateValue(String(newVal), unit);
    onValueChange(validated);
  };

  const handleDecrement = () => {
    const current = Number(value || "0");
    const newVal = current - 1;
    const validated = validateValue(String(newVal), unit);
    onValueChange(validated);
  };

  return (
    <div className="flex items-center gap-2" title={fullLabel}>
      <span className="text-xs font-semibold text-gray-600 w-5">{label}</span>
      <Input
        type="number"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-20 text-xs h-8 text-center"
        placeholder="0"
      />
      <Select value={unit} onValueChange={(val) => onUnitChange(val as "px" | "%")}>
        <SelectTrigger className="w-20 h-8 text-xs">
          <SelectValue placeholder={unit} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="px">px</SelectItem>
          <SelectItem value="%">%</SelectItem>
        </SelectContent>
      </Select>
      <button
        onClick={handleIncrement}
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded text-sm"
        title="Increase"
      >
        ▲
      </button>
      <button
        onClick={handleDecrement}
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded text-sm"
        title="Decrease"
      >
        ▼
      </button>
    </div>
  );
};

export const EnhancedSettingsPanel: React.FC<EnhancedSettingsPanelProps> = ({
  block,
  onBlockUpdate,
  onBlockDelete,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["content"])
  );

  if (!block) {
    return (
      <div className="bg-white border-l border-gray-200 p-4 h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm text-center">
          Select a block to edit properties and styling
        </p>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const props = block.properties;

  const renderContentSettings = () => {
    switch (block.type) {
      case "header":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Logo Text
              </Label>
              <Input
                type="text"
                value={props.logoText || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, logoText: e.target.value },
                  })
                }
                placeholder="Your Logo"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                CTA Button Text
              </Label>
              <Input
                type="text"
                value={props.ctaButtonText || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, ctaButtonText: e.target.value },
                  })
                }
                placeholder="Get Started"
              />
            </div>
          </div>
        );

      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Headline
              </Label>
              <Input
                type="text"
                value={props.headline || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, headline: e.target.value },
                  })
                }
                placeholder="Your Headline"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Subheading
              </Label>
              <Input
                type="text"
                value={props.subheading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, subheading: e.target.value },
                  })
                }
                placeholder="Your subheading"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                CTA Button Text
              </Label>
              <Input
                type="text"
                value={props.ctaButtonText || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, ctaButtonText: e.target.value },
                  })
                }
                placeholder="Learn More"
              />
            </div>
          </div>
        );

      case "features":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Heading
              </Label>
              <Input
                type="text"
                value={props.heading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, heading: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Description
              </Label>
              <textarea
                value={props.description || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, description: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Number of Columns
              </Label>
              <Select
                value={String(props.columns || 4)}
                onValueChange={(val) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, columns: parseInt(val) },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Section Heading
              </Label>
              <Input
                type="text"
                value={props.heading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, heading: e.target.value },
                  })
                }
                placeholder="What Our Clients Say"
              />
            </div>
            {props.testimonials && props.testimonials.length > 0 && (
              <div className="border-t pt-4">
                <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Testimonials Avatar Images
                </Label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload images for each testimonial
                </p>
                {props.testimonials.map((testimonial: any, index: number) => (
                  <div key={testimonial.id} className="mb-3 p-2 bg-gray-50 rounded">
                    <Label className="text-xs font-semibold text-gray-600 mb-2 block">
                      {testimonial.author || `Testimonial ${index + 1}`}
                    </Label>
                    <button
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const dataUrl = event.target?.result as string;
                              const updatedTestimonials = props.testimonials.map(
                                (t: any, i: number) =>
                                  i === index ? { ...t, avatarUrl: dataUrl } : t
                              );
                              onBlockUpdate({
                                ...block,
                                properties: { ...props, testimonials: updatedTestimonials },
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-3 h-3" />
                      {testimonial.avatarUrl ? "Change Image" : "Upload Avatar"}
                    </button>
                    {testimonial.avatarUrl && (
                      <img
                        src={testimonial.avatarUrl}
                        alt={testimonial.author}
                        className="w-16 h-16 rounded-full object-cover mt-2 border border-gray-200"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "about":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Heading
              </Label>
              <Input
                type="text"
                value={props.heading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, heading: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Content
              </Label>
              <textarea
                value={props.content || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, content: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                rows={3}
              />
            </div>
            <div>
              <ImageUploadInput
                label="Section Image"
                value={props.imageUrl || ""}
                onChange={(value) => {
                  console.log("About block image onChange called, imageUrl:", value?.substring?.(0, 50));
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, imageUrl: value },
                  });
                }}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Image Position
              </Label>
              <Select
                value={props.imagePosition || "left"}
                onValueChange={(val) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, imagePosition: val },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "contact-form":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Heading
              </Label>
              <Input
                type="text"
                value={props.heading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, heading: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Description
              </Label>
              <Input
                type="text"
                value={props.description || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, description: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Submit Button Text
              </Label>
              <Input
                type="text"
                value={props.submitButtonText || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, submitButtonText: e.target.value },
                  })
                }
              />
            </div>
          </div>
        );

      case "footer":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Company Name
              </Label>
              <Input
                type="text"
                value={props.companyName || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, companyName: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Description
              </Label>
              <textarea
                value={props.companyDescription || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, companyDescription: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-valasys-orange"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Email
              </Label>
              <Input
                type="email"
                value={props.email || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, email: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Phone
              </Label>
              <Input
                type="tel"
                value={props.phone || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, phone: e.target.value },
                  })
                }
              />
            </div>
          </div>
        );

      case "pricing":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Section Heading
              </Label>
              <Input
                type="text"
                value={props.heading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, heading: e.target.value },
                  })
                }
                placeholder="Our Pricing"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Subheading
              </Label>
              <Input
                type="text"
                value={props.subheading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, subheading: e.target.value },
                  })
                }
                placeholder="Choose the right plan for your needs"
              />
            </div>
          </div>
        );

      case "faq":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Section Heading
              </Label>
              <Input
                type="text"
                value={props.heading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, heading: e.target.value },
                  })
                }
                placeholder="Frequently Asked Questions"
              />
            </div>
          </div>
        );

      case "signup":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Heading
              </Label>
              <Input
                type="text"
                value={props.heading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, heading: e.target.value },
                  })
                }
                placeholder="Sign Up Today"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Subheading
              </Label>
              <Input
                type="text"
                value={props.subheading || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, subheading: e.target.value },
                  })
                }
                placeholder="Get started with our service"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Button Text
              </Label>
              <Input
                type="text"
                value={props.buttonText || ""}
                onChange={(e) =>
                  onBlockUpdate({
                    ...block,
                    properties: { ...props, buttonText: e.target.value },
                  })
                }
                placeholder="Get Started"
              />
            </div>
          </div>
        );

      case "section":
      case "row":
      case "column":
        return (
          <div className="space-y-2 text-sm text-gray-500">
            <p>Layout blocks use styling controls below.</p>
            <p>Adjust colors, spacing, and dimensions in the Styling & Spacing tabs.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <h3 className="font-semibold text-gray-900 text-sm capitalize">
          {block.type.replace("-", " ")} Settings
        </h3>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
          onClick={onBlockDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto relative">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-gray-50 px-4 h-10">
            <TabsTrigger value="content" className="rounded-none border-b-2">
              Content
            </TabsTrigger>
            <TabsTrigger value="styling" className="rounded-none border-b-2">
              Styling
            </TabsTrigger>
            <TabsTrigger value="spacing" className="rounded-none border-b-2">
              Spacing
            </TabsTrigger>
            <TabsTrigger value="visibility" className="rounded-none border-b-2">
              Visibility
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="p-4 space-y-4">
            {renderContentSettings()}
          </TabsContent>

          {/* Styling Tab */}
          <TabsContent value="styling" className="p-4 space-y-4">
            {/* Colors Section */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer mb-3 pb-3 border-b"
                onClick={() => toggleSection("colors")}
              >
                <span className="text-xs font-semibold text-gray-700">
                  Colors
                </span>
                {expandedSections.has("colors") ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              {expandedSections.has("colors") && (
                <div className="space-y-3">
                  <ColorPicker
                    label="Background Color"
                    value={props.backgroundColor || "#ffffff"}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, backgroundColor: value },
                      })
                    }
                  />
                  <ColorPicker
                    label="Text Color"
                    value={props.textColor || "#000000"}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, textColor: value },
                      })
                    }
                  />
                  <ColorPicker
                    label="Button Color"
                    value={props.submitButtonColor || "#FF6A00"}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, submitButtonColor: value },
                      })
                    }
                  />
                  <ColorPicker
                    label="Border Color"
                    value={props.borderColor || "#e5e7eb"}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, borderColor: value },
                      })
                    }
                  />
                </div>
              )}
            </div>

            {/* Images Section */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer mb-3 pb-3 border-b"
                onClick={() => toggleSection("images")}
              >
                <span className="text-xs font-semibold text-gray-700">
                  Background Image
                </span>
                {expandedSections.has("images") ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              {expandedSections.has("images") && (
                <div className="space-y-3">
                  <ImageUploadInput
                    label="Background Image"
                    value={props.backgroundImageUrl || ""}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, backgroundImageUrl: value },
                      })
                    }
                  />
                  {props.backgroundImageUrl && (
                    <>
                      <div>
                        <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                          Background Size
                        </Label>
                        <Select
                          value={props.backgroundSize || "cover"}
                          onValueChange={(value) =>
                            onBlockUpdate({
                              ...block,
                              properties: { ...props, backgroundSize: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cover">Cover</SelectItem>
                            <SelectItem value="contain">Contain</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                          Background Position
                        </Label>
                        <Select
                          value={props.backgroundPosition || "center"}
                          onValueChange={(value) =>
                            onBlockUpdate({
                              ...block,
                              properties: { ...props, backgroundPosition: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top">Top</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="bottom">Bottom</SelectItem>
                            <SelectItem value="top-left">Top Left</SelectItem>
                            <SelectItem value="top-right">Top Right</SelectItem>
                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                          Repeat
                        </Label>
                        <Select
                          value={props.backgroundRepeat || "no-repeat"}
                          onValueChange={(value) =>
                            onBlockUpdate({
                              ...block,
                              properties: { ...props, backgroundRepeat: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-repeat">No Repeat</SelectItem>
                            <SelectItem value="repeat">Repeat</SelectItem>
                            <SelectItem value="repeat-x">Repeat X</SelectItem>
                            <SelectItem value="repeat-y">Repeat Y</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                          Attachment
                        </Label>
                        <Select
                          value={props.backgroundAttachment || "scroll"}
                          onValueChange={(value) =>
                            onBlockUpdate({
                              ...block,
                              properties: { ...props, backgroundAttachment: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scroll">Scroll</SelectItem>
                            <SelectItem value="fixed">Fixed (Parallax)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Typography Section */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer mb-3 pb-3 border-b"
                onClick={() => toggleSection("typography")}
              >
                <span className="text-xs font-semibold text-gray-700">
                  Typography
                </span>
                {expandedSections.has("typography") ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              {expandedSections.has("typography") && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                      Font Family
                    </Label>
                    <Select
                      value={props.fontFamily || "system"}
                      onValueChange={(value) =>
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, fontFamily: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System (Sans-serif)</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="mono">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <NumberInput
                    label="Font Size"
                    value={props.fontSize || "16"}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, fontSize: value },
                      })
                    }
                    unit="px"
                  />
                  <div>
                    <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                      Font Weight
                    </Label>
                    <Select
                      value={props.fontWeight || "400"}
                      onValueChange={(value) =>
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, fontWeight: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">Light</SelectItem>
                        <SelectItem value="400">Regular</SelectItem>
                        <SelectItem value="600">Semibold</SelectItem>
                        <SelectItem value="700">Bold</SelectItem>
                        <SelectItem value="900">Black</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <NumberInput
                    label="Line Height"
                    value={props.lineHeight || "1.5"}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, lineHeight: value },
                      })
                    }
                    step={0.1}
                  />
                  <NumberInput
                    label="Letter Spacing"
                    value={props.letterSpacing || "0"}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, letterSpacing: value },
                      })
                    }
                    unit="px"
                  />
                  <div>
                    <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                      Text Align
                    </Label>
                    <Select
                      value={props.textAlign || "left"}
                      onValueChange={(value) =>
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, textAlign: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="justify">Justify</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                      Text Transform
                    </Label>
                    <Select
                      value={props.textTransform || "none"}
                      onValueChange={(value) =>
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, textTransform: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="uppercase">Uppercase</SelectItem>
                        <SelectItem value="lowercase">Lowercase</SelectItem>
                        <SelectItem value="capitalize">Capitalize</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* Borders Section */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer mb-3 pb-3 border-b"
                onClick={() => toggleSection("borders")}
              >
                <span className="text-xs font-semibold text-gray-700">
                  Borders
                </span>
                {expandedSections.has("borders") ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              {expandedSections.has("borders") && (
                <div className="space-y-3">
                  <NumberInput
                    label="Border Width"
                    value={props.borderWidth || "0"}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, borderWidth: value },
                      })
                    }
                    unit="px"
                  />
                  <div>
                    <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                      Border Style
                    </Label>
                    <Select
                      value={props.borderStyle || "solid"}
                      onValueChange={(value) =>
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, borderStyle: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="dashed">Dashed</SelectItem>
                        <SelectItem value="dotted">Dotted</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <NumberInput
                    label="Border Radius"
                    value={props.borderRadius || "0"}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, borderRadius: value },
                      })
                    }
                    unit="px"
                  />
                </div>
              )}
            </div>

            {/* Effects Section */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer mb-3 pb-3 border-b"
                onClick={() => toggleSection("effects")}
              >
                <span className="text-xs font-semibold text-gray-700">
                  Effects
                </span>
                {expandedSections.has("effects") ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              {expandedSections.has("effects") && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                      Shadow
                    </Label>
                    <Select
                      value={props.shadow || "none"}
                      onValueChange={(value) =>
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, shadow: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                        <SelectItem value="xl">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <NumberInput
                    label="Opacity"
                    value={props.opacity || "100"}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, opacity: value },
                      })
                    }
                    unit="%"
                    min={0}
                    max={100}
                  />
                </div>
              )}
            </div>

            {/* Dimensions Section */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer mb-3 pb-3 border-b"
                onClick={() => toggleSection("dimensions")}
              >
                <span className="text-xs font-semibold text-gray-700">
                  Dimensions
                </span>
                {expandedSections.has("dimensions") ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              {expandedSections.has("dimensions") && (
                <div className="space-y-3">
                  <NumberInput
                    label="Min Height"
                    value={props.minHeight || "auto"}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, minHeight: value },
                      })
                    }
                    unit="px"
                  />
                  <NumberInput
                    label="Max Height"
                    value={props.maxHeight || "auto"}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, maxHeight: value },
                      })
                    }
                    unit="px"
                  />
                  <NumberInput
                    label="Width"
                    value={props.width || "auto"}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, width: value },
                      })
                    }
                    unit="px"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Spacing Tab */}
          <TabsContent value="spacing" className="p-4 space-y-4">
            {/* Padding Section */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer mb-3 pb-3 border-b"
                onClick={() => toggleSection("padding")}
              >
                <span className="text-xs font-semibold text-gray-700">
                  Padding
                </span>
                {expandedSections.has("padding") ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              {expandedSections.has("padding") && (
                <div className="space-y-2">
                  {/* Top */}
                  <SpacingInput
                    key="paddingTop"
                    label="⬆"
                    fullLabel="Padding Top"
                    value={
                      typeof props["paddingTop"] === "string"
                        ? (props["paddingTop"] as string).replace(/[%px]/g, "")
                        : props["paddingTop"] || "0"
                    }
                    unit={
                      typeof props["paddingTop"] === "string" &&
                      (props["paddingTop"] as string).includes("%")
                        ? "%"
                        : "px"
                    }
                    onValueChange={(value) => {
                      const unit =
                        typeof props["paddingTop"] === "string" &&
                        (props["paddingTop"] as string).includes("%")
                          ? "%"
                          : "px";
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, paddingTop: `${value}${unit}` },
                      });
                    }}
                    onUnitChange={(newUnit) => {
                      const value =
                        typeof props["paddingTop"] === "string"
                          ? (props["paddingTop"] as string).replace(/[%px]/g, "")
                          : props["paddingTop"] || "0";
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, paddingTop: `${value}${newUnit}` },
                      });
                    }}
                  />

                  {/* Right & Left */}
                  <div className="grid grid-cols-2 gap-3">
                    <SpacingInput
                      key="paddingLeft"
                      label="⬅"
                      fullLabel="Padding Left"
                      value={
                        typeof props["paddingLeft"] === "string"
                          ? (props["paddingLeft"] as string).replace(/[%px]/g, "")
                          : props["paddingLeft"] || "0"
                      }
                      unit={
                        typeof props["paddingLeft"] === "string" &&
                        (props["paddingLeft"] as string).includes("%")
                          ? "%"
                          : "px"
                      }
                      onValueChange={(value) => {
                        const unit =
                          typeof props["paddingLeft"] === "string" &&
                          (props["paddingLeft"] as string).includes("%")
                            ? "%"
                            : "px";
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, paddingLeft: `${value}${unit}` },
                        });
                      }}
                      onUnitChange={(newUnit) => {
                        const value =
                          typeof props["paddingLeft"] === "string"
                            ? (props["paddingLeft"] as string).replace(/[%px]/g, "")
                            : props["paddingLeft"] || "0";
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, paddingLeft: `${value}${newUnit}` },
                        });
                      }}
                    />
                    <SpacingInput
                      key="paddingRight"
                      label="➡"
                      fullLabel="Padding Right"
                      value={
                        typeof props["paddingRight"] === "string"
                          ? (props["paddingRight"] as string).replace(/[%px]/g, "")
                          : props["paddingRight"] || "0"
                      }
                      unit={
                        typeof props["paddingRight"] === "string" &&
                        (props["paddingRight"] as string).includes("%")
                          ? "%"
                          : "px"
                      }
                      onValueChange={(value) => {
                        const unit =
                          typeof props["paddingRight"] === "string" &&
                          (props["paddingRight"] as string).includes("%")
                            ? "%"
                            : "px";
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, paddingRight: `${value}${unit}` },
                        });
                      }}
                      onUnitChange={(newUnit) => {
                        const value =
                          typeof props["paddingRight"] === "string"
                            ? (props["paddingRight"] as string).replace(/[%px]/g, "")
                            : props["paddingRight"] || "0";
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, paddingRight: `${value}${newUnit}` },
                        });
                      }}
                    />
                  </div>

                  {/* Bottom */}
                  <SpacingInput
                    key="paddingBottom"
                    label="⬇"
                    fullLabel="Padding Bottom"
                    value={
                      typeof props["paddingBottom"] === "string"
                        ? (props["paddingBottom"] as string).replace(/[%px]/g, "")
                        : props["paddingBottom"] || "0"
                    }
                    unit={
                      typeof props["paddingBottom"] === "string" &&
                      (props["paddingBottom"] as string).includes("%")
                        ? "%"
                        : "px"
                    }
                    onValueChange={(value) => {
                      const unit =
                        typeof props["paddingBottom"] === "string" &&
                        (props["paddingBottom"] as string).includes("%")
                          ? "%"
                          : "px";
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, paddingBottom: `${value}${unit}` },
                      });
                    }}
                    onUnitChange={(newUnit) => {
                      const value =
                        typeof props["paddingBottom"] === "string"
                          ? (props["paddingBottom"] as string).replace(/[%px]/g, "")
                          : props["paddingBottom"] || "0";
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, paddingBottom: `${value}${newUnit}` },
                      });
                    }}
                  />
                </div>
              )}
            </div>

            {/* Margin Section */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer mb-3 pb-3 border-b"
                onClick={() => toggleSection("margin")}
              >
                <span className="text-xs font-semibold text-gray-700">
                  Margin
                </span>
                {expandedSections.has("margin") ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              {expandedSections.has("margin") && (
                <div className="space-y-2">
                  {/* Top */}
                  <SpacingInput
                    key="marginTop"
                    label="⬆"
                    fullLabel="Margin Top"
                    value={
                      typeof props["marginTop"] === "string"
                        ? (props["marginTop"] as string).replace(/[%px]/g, "")
                        : props["marginTop"] || "0"
                    }
                    unit={
                      typeof props["marginTop"] === "string" &&
                      (props["marginTop"] as string).includes("%")
                        ? "%"
                        : "px"
                    }
                    onValueChange={(value) => {
                      const unit =
                        typeof props["marginTop"] === "string" &&
                        (props["marginTop"] as string).includes("%")
                          ? "%"
                          : "px";
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, marginTop: `${value}${unit}` },
                      });
                    }}
                    onUnitChange={(newUnit) => {
                      const value =
                        typeof props["marginTop"] === "string"
                          ? (props["marginTop"] as string).replace(/[%px]/g, "")
                          : props["marginTop"] || "0";
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, marginTop: `${value}${newUnit}` },
                      });
                    }}
                  />

                  {/* Left & Right */}
                  <div className="grid grid-cols-2 gap-3">
                    <SpacingInput
                      key="marginLeft"
                      label="⬅"
                      fullLabel="Margin Left"
                      value={
                        typeof props["marginLeft"] === "string"
                          ? (props["marginLeft"] as string).replace(/[%px]/g, "")
                          : props["marginLeft"] || "0"
                      }
                      unit={
                        typeof props["marginLeft"] === "string" &&
                        (props["marginLeft"] as string).includes("%")
                          ? "%"
                          : "px"
                      }
                      onValueChange={(value) => {
                        const unit =
                          typeof props["marginLeft"] === "string" &&
                          (props["marginLeft"] as string).includes("%")
                            ? "%"
                            : "px";
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, marginLeft: `${value}${unit}` },
                        });
                      }}
                      onUnitChange={(newUnit) => {
                        const value =
                          typeof props["marginLeft"] === "string"
                            ? (props["marginLeft"] as string).replace(/[%px]/g, "")
                            : props["marginLeft"] || "0";
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, marginLeft: `${value}${newUnit}` },
                        });
                      }}
                    />
                    <SpacingInput
                      key="marginRight"
                      label="➡"
                      fullLabel="Margin Right"
                      value={
                        typeof props["marginRight"] === "string"
                          ? (props["marginRight"] as string).replace(/[%px]/g, "")
                          : props["marginRight"] || "0"
                      }
                      unit={
                        typeof props["marginRight"] === "string" &&
                        (props["marginRight"] as string).includes("%")
                          ? "%"
                          : "px"
                      }
                      onValueChange={(value) => {
                        const unit =
                          typeof props["marginRight"] === "string" &&
                          (props["marginRight"] as string).includes("%")
                            ? "%"
                            : "px";
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, marginRight: `${value}${unit}` },
                        });
                      }}
                      onUnitChange={(newUnit) => {
                        const value =
                          typeof props["marginRight"] === "string"
                            ? (props["marginRight"] as string).replace(/[%px]/g, "")
                            : props["marginRight"] || "0";
                        onBlockUpdate({
                          ...block,
                          properties: { ...props, marginRight: `${value}${newUnit}` },
                        });
                      }}
                    />
                  </div>

                  {/* Bottom */}
                  <SpacingInput
                    key="marginBottom"
                    label="⬇"
                    fullLabel="Margin Bottom"
                    value={
                      typeof props["marginBottom"] === "string"
                        ? (props["marginBottom"] as string).replace(/[%px]/g, "")
                        : props["marginBottom"] || "0"
                    }
                    unit={
                      typeof props["marginBottom"] === "string" &&
                      (props["marginBottom"] as string).includes("%")
                        ? "%"
                        : "px"
                    }
                    onValueChange={(value) => {
                      const unit =
                        typeof props["marginBottom"] === "string" &&
                        (props["marginBottom"] as string).includes("%")
                          ? "%"
                          : "px";
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, marginBottom: `${value}${unit}` },
                      });
                    }}
                    onUnitChange={(newUnit) => {
                      const value =
                        typeof props["marginBottom"] === "string"
                          ? (props["marginBottom"] as string).replace(/[%px]/g, "")
                          : props["marginBottom"] || "0";
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, marginBottom: `${value}${newUnit}` },
                      });
                    }}
                  />
                </div>
              )}
            </div>

            {/* Gap Section */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer mb-3 pb-3 border-b"
                onClick={() => toggleSection("gap")}
              >
                <span className="text-xs font-semibold text-gray-700">
                  Gap (for rows/flex)
                </span>
                {expandedSections.has("gap") ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              {expandedSections.has("gap") && (
                <div className="space-y-3">
                  <NumberInput
                    label="Gap"
                    value={props.gap || "12"}
                    onChange={(value) =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, gap: value },
                      })
                    }
                    unit="px"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Visibility Tab */}
          <TabsContent value="visibility" className="p-4 space-y-4">
            {/* Content Visibility Section */}
            <div>
              <div className="mb-4">
                <Label className="text-xs font-semibold text-gray-700 block mb-3">
                  Display or hide content based on device type
                </Label>

                <p className="text-xs text-gray-600 mb-3">Show on:</p>

                {/* Device Options */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, showOn: "all-devices" },
                      })
                    }
                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                      (props.showOn === "all-devices" || !props.showOn)
                        ? "bg-valasys-orange text-white border-valasys-orange"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    All devices
                  </button>
                  <button
                    onClick={() =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, showOn: "desktop-only" },
                      })
                    }
                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                      props.showOn === "desktop-only"
                        ? "bg-valasys-orange text-white border-valasys-orange"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Only on desktop
                  </button>
                  <button
                    onClick={() =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, showOn: "mobile-only" },
                      })
                    }
                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                      props.showOn === "mobile-only"
                        ? "bg-valasys-orange text-white border-valasys-orange"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Only on mobile
                  </button>
                  <button
                    onClick={() =>
                      onBlockUpdate({
                        ...block,
                        properties: { ...props, showOn: "tablet-only" },
                      })
                    }
                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                      props.showOn === "tablet-only"
                        ? "bg-valasys-orange text-white border-valasys-orange"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Only on tablet
                  </button>
                </div>
              </div>

              {/* Display Conditions Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-xs font-semibold text-gray-700">
                    Display conditions
                  </Label>
                  <button
                    onClick={() => {
                      const conditions = props.displayConditions || [];
                      const newCondition = {
                        id: `condition-${Date.now()}`,
                        type: "custom" as const,
                        operator: "and" as const,
                        value: "",
                      };
                      onBlockUpdate({
                        ...block,
                        properties: {
                          ...props,
                          displayConditions: [...conditions, newCondition],
                        },
                      });
                    }}
                    className="text-xs font-medium text-valasys-orange hover:text-orange-600 flex items-center gap-1"
                  >
                    + Add condition
                  </button>
                </div>

                {/* Display Conditions List */}
                {props.displayConditions && props.displayConditions.length > 0 && (
                  <div className="space-y-2">
                    {props.displayConditions.map(
                      (condition: any, index: number) => (
                        <div
                          key={condition.id}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200"
                        >
                          {index > 0 && (
                            <Select
                              value={condition.operator || "and"}
                              onValueChange={(value) => {
                                const updatedConditions = [
                                  ...props.displayConditions,
                                ];
                                updatedConditions[index].operator = value;
                                onBlockUpdate({
                                  ...block,
                                  properties: {
                                    ...props,
                                    displayConditions: updatedConditions,
                                  },
                                });
                              }}
                            >
                              <SelectTrigger className="w-16 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="and">AND</SelectItem>
                                <SelectItem value="or">OR</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          <Input
                            type="text"
                            value={condition.value || ""}
                            onChange={(e) => {
                              const updatedConditions = [
                                ...props.displayConditions,
                              ];
                              updatedConditions[index].value = e.target.value;
                              onBlockUpdate({
                                ...block,
                                properties: {
                                  ...props,
                                  displayConditions: updatedConditions,
                                },
                              });
                            }}
                            placeholder="Enter condition..."
                            className="flex-1 h-8 text-xs"
                          />
                          <button
                            onClick={() => {
                              const updatedConditions =
                                props.displayConditions.filter(
                                  (_: any, i: number) => i !== index
                                );
                              onBlockUpdate({
                                ...block,
                                properties: {
                                  ...props,
                                  displayConditions: updatedConditions,
                                },
                              });
                            }}
                            className="text-red-600 hover:text-red-700 text-xs font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
