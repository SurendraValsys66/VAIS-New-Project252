import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BuilderCanvas } from "@/components/builder/Canvas";
import { Button } from "@/components/ui/button";
import { Plus, Layout, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type View = "list" | "editor";

interface PageData {
  id: string;
  name: string;
  updatedAt: string;
  thumbnail?: string;
  templateImage?: string;
  category?: string;
}

const CATEGORIES = [
  "All Categories",
  "Click-through",
  "Coming Soon",
  "Discount",
  "Ebook",
  "Ecommerce",
  "Event",
  "Finance",
  "Holiday",
  "Information Technology",
  "Lead Generation",
  "Mobile App",
  "NewsLetter",
  "Online Course",
  "Real Estate",
  "Thank You",
  "Tourism",
  "Webinar",
];

export default function LandingPages() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedSidebarCategories, setSelectedSidebarCategories] = useState<
    Set<string>
  >(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState<PageData | null>(null);
  const [pages, setPages] = useState<PageData[]>([
    {
      id: "1",
      name: "Modern Hero Page",
      updatedAt: "2024-03-20T10:00:00Z",
      category: "Click-through",
      templateImage: "https://cdn.builder.io/api/v1/image/assets%2Fddd1f2eefed243f880ce4c077bf467dd%2Fc791842089ab4e8a8223fa1c37011b01?format=webp&width=800&height=1200"
    },
    {
      id: "2",
      name: "SaaS Product Landing",
      updatedAt: "2024-03-19T15:30:00Z",
      category: "Ecommerce",
      templateImage: "https://cdn.builder.io/api/v1/image/assets%2Fddd1f2eefed243f880ce4c077bf467dd%2Fce37966ddf2b45dca81b913547a9f779?format=webp&width=800&height=1200"
    },
    {
      id: "3",
      name: "Black Friday Sale",
      updatedAt: "2024-03-18T12:00:00Z",
      category: "Discount",
      templateImage: "https://cdn.builder.io/api/v1/image/assets%2Fddd1f2eefed243f880ce4c077bf467dd%2F122aa3a978f347f6ae8013a8201b7046?format=webp&width=800&height=1200"
    },
    {
      id: "4",
      name: "Sports Club",
      updatedAt: "2024-03-17T09:15:00Z",
      category: "Event",
      templateImage: "https://cdn.builder.io/api/v1/image/assets%2Fddd1f2eefed243f880ce4c077bf467dd%2Fa8f973a0ccc04d81a3e1de84669932c9?format=webp&width=800&height=1200"
    },
  ]);

  // Count templates by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      if (cat !== "All Categories") {
        counts[cat] = pages.filter((p) => p.category === cat).length;
      }
    });
    return counts;
  }, [pages]);

  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      const matchesCategory =
        selectedCategory === "All Categories" || page.category === selectedCategory;
      const matchesSearch = page.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [pages, selectedCategory, searchQuery]);

  const handleSidebarCategoryChange = (category: string) => {
    const newSet = new Set(selectedSidebarCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setSelectedSidebarCategories(newSet);
    // Update main dropdown if single category is selected
    if (newSet.size === 1) {
      const selected = Array.from(newSet)[0];
      setSelectedCategory(selected);
    } else if (newSet.size === 0) {
      setSelectedCategory("All Categories");
    }
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setView("editor");
  };

  const handleViewTemplates = (template: PageData) => {
    setSelectedTemplate(template);
    setView("editor");
  };

  const handleAIBuilder = () => {
    navigate("/ai-builder");
  };

  const handleBack = () => {
    setView("list");
  };

  // Editor View
  if (view === "editor") {
    return (
      <DndProvider backend={HTML5Backend}>
        <BuilderCanvas onBack={handleBack} template={selectedTemplate} />
      </DndProvider>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">
        <div className="space-y-8 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 bg-valasys-orange rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Layout className="w-6 h-6" />
                </div>
                Landing Pages
              </h1>
              <p className="text-gray-500 mt-1">Design, build and publish high-converting pages in minutes.</p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button onClick={handleAIBuilder} className="px-6 py-6 rounded-2xl shadow-md hover:shadow-lg transition-all font-bold text-base group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                AI Builder
              </Button>
              <Button onClick={handleCreateNew} className="bg-valasys-orange hover:bg-valasys-orange/90 text-white px-6 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all font-bold text-base group">
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Create New Page
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-valasys-orange transition-colors" />
                <Input
                  placeholder="Search your pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-7 rounded-2xl border-gray-100 shadow-sm focus:ring-valasys-orange focus:border-valasys-orange text-base"
                />
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-around">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{pages.length}</div>
                <div className="text-[10px] uppercase font-bold text-gray-400">Total Pages</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <div className="text-xl font-bold text-valasys-orange">12.4k</div>
                <div className="text-[10px] uppercase font-bold text-gray-400">Total Views</div>
              </div>
            </div>
          </div>

          {/* Predefine Landing page Template Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Predefine Landing page Template</h2>
            
            {/* Templates Section with Sidebar */}
            <div className="flex gap-6">
              {/* Categories Sidebar */}
              <div className="hidden lg:flex flex-col w-64 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-fit">
                <h3 className="text-lg font-bold text-purple-600 mb-6">Categories</h3>
                <div className="space-y-3">
                  {CATEGORIES.filter((cat) => cat !== "All Categories").map(
                    (category) => (
                      <div
                        key={category}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleSidebarCategoryChange(category)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Checkbox
                            checked={selectedSidebarCategories.has(category)}
                            onCheckedChange={() =>
                              handleSidebarCategoryChange(category)
                            }
                          />
                          <label className="text-sm text-gray-900 cursor-pointer font-medium">
                            {category}
                          </label>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {categoryCounts[category] || 0}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Templates Grid with Filter Controls */}
              <div className="flex-1">
                <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Filter by Category
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full py-6 rounded-2xl border-gray-200 shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{filteredPages.length}</div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">Templates</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Create new page button - first position */}
                  <button onClick={handleCreateNew} className="group rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 hover:border-valasys-orange hover:bg-valasys-orange/5 transition-all gap-4 text-gray-400 hover:text-valasys-orange h-64">
                    <div className="w-16 h-16 rounded-full bg-gray-50 group-hover:bg-valasys-orange/10 flex items-center justify-center transition-colors shadow-inner">
                      <Plus className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <div className="text-base font-bold">Create New Page</div>
                      <div className="text-xs font-medium opacity-60">Start with a blank canvas</div>
                    </div>
                  </button>

                  {/* Template cards */}
                  {filteredPages.map((page) => (
                    <div
                      key={page.id}
                      className="group rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border-b-4 border-b-transparent hover:border-b-valasys-orange"
                    >
                      <div className="relative h-64 overflow-hidden flex items-center justify-center bg-gray-50">
                        {/* Auto-scrolling template image */}
                        <div className="relative w-full h-full overflow-hidden">
                          <img
                            src={page.templateImage || "https://cdn.builder.io/api/v1/image/assets%2Fddd1f2eefed243f880ce4c077bf467dd%2Fc791842089ab4e8a8223fa1c37011b01?format=webp&width=800&height=1200"}
                            alt="Template preview"
                            className="w-full h-auto object-cover transition-transform duration-[60s] ease-linear group-hover:translate-y-[-600px]"
                          />
                        </div>

                        {/* Use this template button - appears on hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button onClick={() => handleViewTemplates(page)} className="bg-white text-valasys-orange hover:bg-gray-100 px-8 py-3 rounded-xl font-bold shadow-lg transition-all">
                            Use this template
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
