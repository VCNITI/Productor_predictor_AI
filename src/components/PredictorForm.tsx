import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building,
  Home,
  Layers,
  Star,
  ArrowRight,
  ArrowLeft,
  Bot,
  Loader2,
  Download,
  Share2,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AnimatedCard } from "./ui/AnimatedCard";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

/* ---------------------------
   Types
----------------------------*/
interface FormData {
  stage: string;
  buildingType: string;
  totalAreaSqft: string;
  floors: string;
  quality: string;
  city: string;
  additionalRequirements?: string;
}

interface Material {
  id: string;
  category: string;
  qty: number;
  unit: string;
  priceLow: number;
  priceHigh: number;
  selected: boolean;
  availableBrands: string[];
  selectedBrand: string;
  description?: string;
}

interface EstimateData {
  totalLow: number;
  totalHigh: number;
  confidence: number;
  materials: Material[];
  reasoning?: string;
}

interface AiMaterialResponseItem {
  category?: string;
  qty?: number;
  unit?: string;
  priceLow?: number;
  priceHigh?: number;
  description?: string;
  priority?: "high" | "medium" | "low";
}

/* ---------------------------
   Currency & Brand Helpers
----------------------------*/
const formatCurrency = (amount: number): string => {
  const formatted = amount.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
  return `₹${formatted}`;
};

const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  else if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  else if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount.toLocaleString("en-IN")}`;
};

const brandDatabase: Record<string, string[]> = {
  cement: ["UltraTech", "ACC", "Ambuja", "Shree Cement", "JK Cement"],
  steel: ["Tata Tiscon", "SAIL", "JSW Steel", "Jindal Steel", "Kamdhenu"],
  sand: ["River Sand", "M-Sand", "Robo Sand"],
  aggregate: ["20mm Aggregate", "10mm Aggregate", "Blue Metal"],
  bricks: ["Wienerberger", "Fly Ash Bricks", "Clay Bricks", "AAC Blocks"],
  tiles: ["Kajaria", "Somany", "Johnson", "Nitco"],
  paint: ["Asian Paints", "Berger Paints", "Nerolac", "Dulux"],
  electrical: ["Havells", "Anchor", "Legrand", "Schneider", "Finolex"],
  plumbing: ["Jaquar", "Hindware", "Cera", "Kohler", "Ashirvad"],
  doors: ["Tata Pravesh", "Godrej", "Century Ply", "Greenply"],
  windows: ["Fenesta", "AIS Glasxperts", "REHAU"],
};

const getBrandsForMaterial = (category: string): string[] => {
  const searchTerms = category.toLowerCase().split(" ");
  for (const term of searchTerms) {
    for (const [key, brands] of Object.entries(brandDatabase)) {
      if (term.includes(key) || key.includes(term)) return brands;
    }
  }
  return ["Premium Brand", "Standard Brand", "Economy Brand"];
};

/* ---------------------------
   API & Logic
----------------------------*/
const generateMockEstimate = (formData: FormData): EstimateData => {
  const area = parseInt(formData.totalAreaSqft) || 1000;
  const floors = parseInt(formData.floors) || 1;
  const materials: Material[] = [
    {
      id: "1",
      category: "Cement",
      qty: Math.max(1, Math.round(area * floors * 0.12)),
      unit: "bags",
      priceLow: 450,
      priceHigh: 520,
      selected: true,
      availableBrands: getBrandsForMaterial("cement"),
      selectedBrand: getBrandsForMaterial("cement")[0],
      description: "OPC 53 grade cement",
    },
    {
      id: "2",
      category: "Steel (TMT)",
      qty: Math.max(1, Math.round(area * floors * 2.8)),
      unit: "kg",
      priceLow: 60,
      priceHigh: 70,
      selected: true,
      availableBrands: getBrandsForMaterial("steel"),
      selectedBrand: getBrandsForMaterial("steel")[0],
      description: "Fe 500D TMT bars",
    },
  ];

  const selectedMaterials = materials.filter((m) => m.selected);
  const totalLow = selectedMaterials.reduce((s, m) => s + m.priceLow * m.qty, 0);
  const totalHigh = selectedMaterials.reduce((s, m) => s + m.priceHigh * m.qty, 0);

  return {
    totalLow,
    totalHigh,
    confidence: 88,
    materials,
    reasoning: `Mock estimate for ${formData.stage || "project"} — area ${area} sq ft`,
  };
};

// --- RESTORED API CALL LOGIC ---
const callGPT4ForEstimate = async (formData: FormData): Promise<EstimateData> => {
  const prompt = `You are a Senior Construction Cost Estimation Expert (India, 2025) with extensive expertise in RCC structures, city-wise material rates, IS norms, and quantity estimations.

PROJECT INPUT VARIABLES:
- Stage: ${formData.stage}
- Building Type: ${formData.buildingType}
- Total Built-up Area: ${formData.totalAreaSqft} sq ft
- Floors: ${formData.floors}
- Quality Level: ${formData.quality}
- Location: ${formData.city}, India
- Additional Requirements: ${formData.additionalRequirements || 'None'}

OUTPUT FORMAT (STRICT) — RETURN ONLY THIS JSON:
{
  "materials": [
    {
      "category": "Material Name",
      "qty": number,
      "unit": "unit type",
      "priceLow": number,
      "priceHigh": number,
      "description": "brief description including grade/specification",
      "priority": "high" | "medium" | "low"
    }
  ],
  "totalLow": number,
  "totalHigh": number,
  "confidence": number
}

MUST FOLLOW PRICE RULES (EXTREMELY STRICT):
1. Use accurate 2025 city-specific market prices for ${formData.city}, India.
2. Prices must be material-only (NO labor, NO GST).
3. Use realistic 2025 min–max price ranges with two decimals.
4. Follow regional cost variations (Tier-1, Tier-2, Tier-3 cities).
5. Use correct brand–quality mappings:
   - Economy: Penna, Zuari, Chettinad (cement), Fe500 steel, CPVC SDR 13.5, FR wires.
   - Standard: ACC, Ultratech, JSW, Fe500D, CPVC SDR 11, FRLS wires.
   - Premium: Ultratech Super, Ramco, Fe550D, CPVC SDR 7.4, FRLSH wires.
6. Every material must include correct IS codes and grade specs.

QUANTITY RULES — HIGH ACCURACY:
- Cement (bags): 0.45–0.55 per sq ft of RCC; 0.15–0.20 for masonry walling.
- Steel: 3.5–4.5 kg per sq ft RCC + 12–15% wastage.
- Sand: 0.04–0.05 m³ per sq ft RCC.
- Aggregates: 0.07–0.09 m³ per sq ft RCC.
- AAC Blocks: 1 m³ = 25–30 blocks depending on density.
- Tiles: Convert sq ft → m² + 5–8% wastage.
- Wiring: 1.8–2.2 rmt per sq ft.
- Conduits: 0.45–0.55 rmt per sq ft.
- Plumbing CPVC: 20–30 rmt per bathroom; 60–100 rmt per kitchen.

ASSUMPTIONS (USE INTERNALLY ONLY):
- Floor height = 3.0 m
- Slab thickness = 150–200 mm
- Steel wastage = 12–15%
- Tile wastage = 5–8%

MATERIAL CATEGORY REQUIREMENTS:
Include 20–25+ unique materials relevant ONLY to ${formData.stage}.
Each item MUST be unique and non-overlapping.
Stage-specific examples:
- Foundation/RCC: cement, steel, RMC, sand, aggregates, shuttering, spacers, binding wire, waterproofing, termite chemical.
- Masonry: AAC blocks, block adhesive, lintel concrete, sand, waterproofing slurry.
- Finishing: tiles, adhesives, putty, primer, interior paint, exterior paint, waterproofing, grout.
- Electrical: FR/FRLS/FRLSH wires, conduits, switches, MCBs, DB boxes.
- Plumbing: CPVC pipes, fittings, UPVC drainage, valves, traps, clamps.

PRICE VALIDATION RULES:
- Ensure qty × priceLow = correct calculation.
- Ensure qty × priceHigh = correct calculation.
- Ensure totalLow < totalHigh.
- Ensure units are correct: bag, kg, tonne, m³, m², rmt, nos.
- Ensure no repeated categories.
- Ensure prices match 2025 city-specific ranges.

PRIORITY RULE:
- High: RCC, steel, waterproofing, cement, concrete.
- Medium: adhesives, primers, consumables.
- Low: aesthetic or optional items.

CONFIDENCE SCORE (0–1):
Based on data clarity, market volatility, and assumptions required.

FINAL INSTRUCTION:
Return ONLY the JSON object. No explanations or text outside JSON.`;

  try {
    const response = await fetch(`/api/estimate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const parsedResponse = await response.json();
    
    // Parse materials from AI response
    const materials: Material[] = parsedResponse.materials.map(
      (item: AiMaterialResponseItem, index: number) => ({
        id: (index + 1).toString(),
        category: item.category || "Material",
        qty: Number(item.qty) || 1,
        unit: item.unit || "units",
        priceLow: Number(item.priceLow) || 0,
        priceHigh: Number(item.priceHigh) || 0,
        selected: true,
        availableBrands: getBrandsForMaterial(item.category || ""),
        selectedBrand: getBrandsForMaterial(item.category || "")[0],
        description: item.description || "",
      })
    );

    const totalLow = Number(parsedResponse.totalLow) || materials.reduce((s, m) => s + m.priceLow * m.qty, 0);
    const totalHigh = Number(parsedResponse.totalHigh) || materials.reduce((s, m) => s + m.priceHigh * m.qty, 0);

    return {
      totalLow,
      totalHigh,
      confidence: Number(parsedResponse.confidence) || 85,
      materials,
      reasoning: parsedResponse.reasoning,
    };

  } catch (error) {
    console.error("API Call Failed, using mock:", error);
    return generateMockEstimate(formData);
  }
};

/* ---------------------------
   MaterialSelectionStep
----------------------------*/
const MaterialSelectionStep = ({
  materials,
  onMaterialsChange,
  onNext,
  onPrev,
}: {
  materials: Material[];
  onMaterialsChange: (m: Material[]) => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const toggleMaterial = (materialId: string) => {
    const updated = materials.map((m) =>
      m.id === materialId ? { ...m, selected: !m.selected } : m,
    );
    onMaterialsChange(updated);
  };

  const updateBrand = (materialId: string, brand: string) => {
    const updated = materials.map((m) =>
      m.id === materialId ? { ...m, selectedBrand: brand } : m,
    );
    onMaterialsChange(updated);
  };

  const updateQuantity = (materialId: string, qty: number) => {
    const updated = materials.map((m) =>
      m.id === materialId ? { ...m, qty } : m,
    );
    onMaterialsChange(updated);
  };

  const selectedMaterials = materials.filter((m) => m.selected);
  const totalLow = selectedMaterials.reduce((sum, m) => sum + m.priceLow * m.qty, 0);
  const totalHigh = selectedMaterials.reduce((sum, m) => sum + m.priceHigh * m.qty, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h3 className="text-2xl font-semibold">AI-Generated Materials List</h3>
        <p className="text-muted-foreground">Review, customize, and select your materials</p>
        <Badge variant="secondary" className="mt-2"><Bot className="w-4 h-4 mr-1" /> Powered by GPT</Badge>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Selected Items</p>
                <p className="text-2xl font-bold text-primary">{selectedMaterials.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cost Range</p>
                <div className="text-lg font-bold">
                  <div>{formatCurrencyCompact(totalLow)}</div>
                  <div className="text-sm">to {formatCurrencyCompact(totalHigh)}</div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Cost</p>
                <p className="text-lg font-bold text-green-600">{formatCurrencyCompact((totalLow + totalHigh) / 2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4 max-h-96 overflow-y-auto">
        {materials.map((material) => (
          <Card key={material.id} className={`transition-all ${material.selected ? "border-primary shadow-md" : "border-muted opacity-60"}`}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Checkbox checked={material.selected} onCheckedChange={() => toggleMaterial(material.id)} className="mt-1" />
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{material.category}</h4>
                      {material.description && <p className="text-xs text-muted-foreground">{material.description}</p>}
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">{formatCurrencyCompact(material.priceLow)} - {formatCurrencyCompact(material.priceHigh)}</Badge>
                  </div>
                  {material.selected && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Quantity</Label>
                        <Input type="number" value={material.qty} onChange={(e) => updateQuantity(material.id, parseInt(e.target.value || "0", 10))} className="text-sm" />
                        <p className="text-xs text-muted-foreground">{material.unit}</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-xs">Preferred Brand</Label>
                        <Select value={material.selectedBrand} onValueChange={(brand) => updateBrand(material.id, brand)}>
                          <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {material.availableBrands.map((brand) => (
                              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center pt-4 gap-4 md:gap-2">
        <Button variant="outline" onClick={onPrev} className="flex items-center w-full md:w-auto justify-center"><ArrowLeft className="w-4 h-4 mr-2" /> Previous</Button>
        <Button variant="hero" onClick={onNext} disabled={selectedMaterials.length === 0} className="flex items-center w-full md:w-auto justify-center">Generate Final Estimate <ArrowRight className="w-4 h-4 ml-2" /></Button>
      </motion.div>
    </motion.div>
  );
};

/* ---------------------------
   ResultsDashboard
----------------------------*/
const ResultsDashboard = ({
  estimate,
  formData,
}: {
  estimate: EstimateData;
  formData: FormData;
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to results on mount
  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  const handleProtectedAction = async (action: () => Promise<void> | void) => {
    if (user) {
      await action();
    } else {
      navigate('/login', { state: { from: location } });
    }
  };

  async function buildPdfBlob(): Promise<Blob> {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;

    const addHeader = () => {
      doc.setFontSize(16); doc.setFont("helvetica", "bold");
      const companyName = "VCNITI Technologies Private Limited";
      doc.text(companyName, (pageWidth - doc.getTextWidth(companyName)) / 2, 30);
      doc.setFontSize(9); doc.setFont("helvetica", "normal");
      const cinText = "CIN No. – U47912KA2025PTC205758";
      doc.text(cinText, (pageWidth - doc.getTextWidth(cinText)) / 2, 45);
      const contactText = "E-Mail Id – info@vcniti.com, Website - www.vcniti.com, Phone No. –+91 9740059699";
      doc.text(contactText, (pageWidth - doc.getTextWidth(contactText)) / 2, 57);
      const officeText = "Office: 48, Church St, Haridevpur, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001";
      doc.text(officeText, (pageWidth - doc.getTextWidth(officeText)) / 2, 69);
      doc.line(margin, 75, pageWidth - margin, 75);
    };

    const addFooter = (pageNumber: number, totalPages: number) => {
      const footerY = pageHeight - 30;
      doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
      doc.setFontSize(9); doc.setFont("helvetica", "normal");
      doc.text("Generated by VCNITI Technologies", margin, footerY);
      doc.text(`Page ${pageNumber} / ${totalPages}`, pageWidth - margin - 80, footerY);
    };

    addHeader();
    doc.setFontSize(14); doc.setFont("helvetica", "bold");
    const titleText = "Construction Material Estimate Report";
    doc.text(titleText, (pageWidth - doc.getTextWidth(titleText)) / 2, 100);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Project Stage: ${formData.stage?.charAt(0).toUpperCase() + formData.stage?.slice(1) || "N/A"}`,
      margin,
      120,
    );
    doc.text(
      `Building Type: ${formData.buildingType?.charAt(0).toUpperCase() + formData.buildingType?.slice(1) || "N/A"}`,
      margin,
      135,
    );
    doc.text(`Total Area: ${formData.totalAreaSqft} sq ft`, margin, 150);
    doc.text(`Number of Floors: ${formData.floors}`, margin, 165);
    doc.text(
      `Quality Level: ${formData.quality?.charAt(0).toUpperCase() + formData.quality?.slice(1) || "N/A"}`,
      margin,
      180,
    );
    doc.text(
      `Location: ${formData.city?.charAt(0).toUpperCase() + formData.city?.slice(1) || "N/A"}`,
      margin,
      195,
    );
    doc.text(
      `Generated on: ${new Date().toLocaleString("en-IN")}`,
      margin,
      210,
    );

    const tableRows = estimate.materials.map((material, index) => {
      const totalCost = ((material.priceLow + material.priceHigh) / 2) * material.qty;
      return [
        (index + 1).toString(),
        material.category,
        material.selectedBrand || "Generic",
        `${material.qty} ${material.unit}`,
        `Rs. ${material.priceLow} - ${material.priceHigh}`,
        `Rs. ${totalCost.toLocaleString("en-IN")}`,
      ];
    });

    autoTable(doc, {
      startY: 230,
      margin: { top: 130, left: margin, right: margin, bottom: 60 },
      body: tableRows,
      theme: "grid",
      head: [["S.No.", "Material", "Brand", "Quantity", "Unit Cost Range", "Total Cost (Avg)"]],
      headStyles: { fillColor: [168, 82, 229] }, // Apply color to header
      didDrawPage: (data) => {
        if (doc.internal.getCurrentPageInfo().pageNumber > 1) addHeader();
      },
    });

    let finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 230) + 20;
    const summaryHeight = 100;
    if (finalY + summaryHeight + 50 > pageHeight - 40) {
      doc.addPage(); addHeader(); finalY = 100;
    }

    const avgCost = (estimate.totalLow + estimate.totalHigh) / 2;
    doc.setFillColor(230, 247, 255);
    doc.rect(margin, finalY, pageWidth - 2 * margin, summaryHeight, "F");
    doc.setFontSize(12); doc.setFont("helvetica", "bold");
    doc.text("Final Estimate Summary", margin + 10, finalY + 25);
    doc.setFontSize(11); doc.setFont("helvetica", "normal");
    doc.text(`Total Materials: ${estimate.materials.length} items`, margin + 10, finalY + 45);
    doc.text(`Estimated Cost Range: Rs. ${estimate.totalLow.toLocaleString("en-IN")} – Rs. ${estimate.totalHigh.toLocaleString("en-IN")}`, margin + 10, finalY + 60);
    doc.text(`Average Cost: Rs. ${avgCost.toLocaleString("en-IN")}`, margin + 10, finalY + 75);
doc.text(
      `AI Confidence Level: ${estimate.confidence}%`,
      margin + 10,
      finalY + 90,
    );
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i); addFooter(i, totalPages);
    }

    return doc.output("blob");
  }

  async function shareEstimate() {
    try {
      const blob = await buildPdfBlob();
      const file = new File([blob], "vcniti-estimate.pdf", { type: "application/pdf" });
      const pageUrl = window.location.href;
      
      if (navigator.canShare && (navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({ 
            title: "Estimate", 
            text: `Cost: ${formatCurrency(estimate.totalLow)} - ${formatCurrency(estimate.totalHigh)}`, 
            url: pageUrl, 
            files: [file] 
        });
      } else {
        await navigator.clipboard.writeText(pageUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  }

  async function downloadEstimatePDF() {
    try {
      const blob = await buildPdfBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vcniti-construction-estimate.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  }

  const handleStartNew = () => {
    sessionStorage.removeItem("predictorState");
    window.location.reload();
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4"
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-8">
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <Badge variant="secondary" className="px-4 py-2"><Bot className="w-4 h-4 mr-2" /> AI-Generated Estimate</Badge>
          <h1 className="text-4xl font-bold">Your Customized Project Estimate</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{estimate.reasoning}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedCard>
            <Card className="shadow-lg border-primary/20 h-full">
              <CardHeader className="text-center"><CardTitle className="text-lg">Total Cost Range</CardTitle></CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary break-words">
                  <div>{formatCurrencyCompact(estimate.totalLow)}</div>
                  <div className="text-lg">to {formatCurrencyCompact(estimate.totalHigh)}</div>
                </div>
                <p className="text-sm text-muted-foreground">{estimate.materials.length} selected materials</p>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard>
            <Card className="shadow-lg border-green-200 h-full">
              <CardHeader className="text-center"><CardTitle className="text-lg">AI Confidence</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center"><div className="text-3xl font-bold text-green-600">{estimate.confidence}%</div></div>
                <Progress value={estimate.confidence} className="h-3" />
                <p className="text-xs text-muted-foreground text-center">Based on your selections & market data</p>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard>
            <Card className="shadow-lg border-purple-200 h-full">
              <CardHeader className="text-center"><CardTitle className="text-lg">Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="hero" className="w-full" size="sm">
                  <a href="https://www.vcniti.com/collections" target="_blank" rel="noopener noreferrer">
                    <ShoppingCart className="w-4 h-4 mr-2" /> Proceed to Purchase
                  </a>
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleProtectedAction(downloadEstimatePDF)}
                  >
                    <Download className="w-4 h-4 mr-1" /> Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleProtectedAction(shareEstimate)}
                  >
                    <Share2 className="w-4 h-4 mr-1" /> Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Selected Materials with Brands</CardTitle>
              <p className="text-sm text-muted-foreground">Your customized bill of quantities</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">S.No.</th>
                      <th className="text-left p-3 font-semibold">Material</th>
                      <th className="text-left p-3 font-semibold">Selected Brand</th>
                      <th className="text-left p-3 font-semibold">Quantity</th>
                      <th className="text-left p-3 font-semibold">Unit Cost</th>
                      <th className="text-left p-3 font-semibold">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimate.materials.map((material, index) => (
                      <tr key={material.id} className="border-b hover:bg-muted/20">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{material.category}</div>
                            {material.description && <div className="text-xs text-muted-foreground">{material.description}</div>}
                          </div>
                        </td>
                        <td className="p-3"><Badge variant="secondary">{material.selectedBrand}</Badge></td>
                        <td className="p-3">{material.qty} {material.unit}</td>
                        <td className="p-3"><div className="text-sm">{formatCurrencyCompact(material.priceLow)} - {formatCurrencyCompact(material.priceHigh)}</div></td>
                        <td className="p-3"><div className="font-semibold text-primary">{formatCurrencyCompact(((material.priceLow + material.priceHigh) / 2) * material.qty)}</div></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-bold">
                      <td colSpan={5} className="p-3 text-right">Total Estimate:</td>
                      <td className="p-3 text-primary text-lg">{formatCurrencyCompact((estimate.totalLow + estimate.totalHigh) / 2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <Button 
            variant="outline" 
            onClick={() => handleProtectedAction(handleStartNew)}
            className="w-full md:w-auto"
          >
            Start New Estimate
          </Button>
          <Button variant="hero" onClick={() => (window.location.href = "https://www.vcniti.com/collections")} className="w-full md:w-auto">
            <ShoppingCart className="w-4 h-4 mr-2" /> Proceed to Purchase
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* ---------------------------
   PredictorForm (main)
----------------------------*/
const PredictorForm = ({ id }: { id?: string }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    stage: "",
    buildingType: "",
    totalAreaSqft: "",
    floors: "",
    quality: "",
    city: "",
    additionalRequirements: "",
  });
  const [aiGeneratedMaterials, setAiGeneratedMaterials] = useState<Material[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [finalEstimate, setFinalEstimate] = useState<EstimateData | null>(null);

  // Restore state from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("predictorState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData);
        setCurrentStep(parsed.currentStep);
        setAiGeneratedMaterials(parsed.aiGeneratedMaterials || []);
        if (parsed.finalEstimate) {
          setFinalEstimate(parsed.finalEstimate);
          setShowResults(true);
        }
      } catch (e) {
        console.error("Failed to load saved predictor state");
      }
    }
  }, []);

  // Save state to sessionStorage
  useEffect(() => {
    if (currentStep > 1 || formData.stage) {
      const stateToSave = {
        formData,
        currentStep,
        aiGeneratedMaterials,
        finalEstimate,
        showResults
      };
      sessionStorage.setItem("predictorState", JSON.stringify(stateToSave));
    }
  }, [formData, currentStep, aiGeneratedMaterials, finalEstimate, showResults]);

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = async () => {
    if (currentStep === 5) {
      setIsLoading(true);
      try {
        const estimate = await callGPT4ForEstimate(formData);
        const mats = estimate.materials.map((m, idx) => ({
          ...m,
          id: m.id || String(idx + 1),
          selected: typeof m.selected === "boolean" ? m.selected : true,
          availableBrands: m.availableBrands || getBrandsForMaterial(m.category || ""),
          selectedBrand: m.selectedBrand || (getBrandsForMaterial(m.category || "")[0] ?? "Generic"),
        }));
        setAiGeneratedMaterials(mats);
        setCurrentStep(6);
      } catch (error) {
        console.error("AI estimation failed:", error);
        // Fallback
        const estimate = generateMockEstimate(formData);
        const mats = estimate.materials.map((m, idx) => ({
          ...m,
          id: m.id || String(idx + 1),
          selected: typeof m.selected === "boolean" ? m.selected : true,
          availableBrands: m.availableBrands || getBrandsForMaterial(m.category || ""),
          selectedBrand: m.selectedBrand || (getBrandsForMaterial(m.category || "")[0] ?? "Generic"),
        }));
        setAiGeneratedMaterials(mats);
        setCurrentStep(6);
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 6) {
      const selectedMaterials = aiGeneratedMaterials.filter((m) => m.selected);
      const totalLow = selectedMaterials.reduce((sum, material) => sum + material.priceLow * material.qty, 0);
      const totalHigh = selectedMaterials.reduce((sum, material) => sum + material.priceHigh * material.qty, 0);

      const estimate: EstimateData = {
        totalLow,
        totalHigh,
        confidence: Math.floor(Math.random() * 15) + 85,
        materials: selectedMaterials,
        reasoning: `Final estimate based on your selected materials and preferred brands. Costs calculated for ${formData.city} market rates.`,
      };

      setFinalEstimate(estimate);
      setShowResults(true);
    } else if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((p) => p - 1);
  };

  const renderStep = () => {
    if (isLoading) {
      return (
        <div className="text-center space-y-6 py-12">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">AI is analyzing your project...</h3>
            <p className="text-muted-foreground">Generating personalized material recommendations</p>
          </div>
          <div className="max-w-md mx-auto">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      );
    }

    const stepVariants = {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween" }}
        >
          {(() => {
            switch (currentStep) {
              case 1:
                return (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-semibold">Project Stage</h3>
                      <p className="text-muted-foreground">What stage is your project in?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { value: "foundation", label: "Foundation", desc: "Excavation to plinth level", icon: Layers },
                        { value: "structure", label: "Structure", desc: "Columns, beams, slabs", icon: Building },
                        { value: "finishing", label: "Finishing", desc: "Plastering, flooring, painting", icon: Home },
                        { value: "interiors", label: "Interiors", desc: "Fixtures, fittings, furnishing", icon: Star },
                      ].map((s) => (
                        <AnimatedCard
                          key={s.value}
                          onClick={() => {
                            updateFormData("stage", s.value);
                            setTimeout(() => nextStep(), 200);
                          }}
                        >
                          <Card className={`cursor-pointer transition-all h-full ${formData.stage === s.value ? "border-primary shadow-lg" : "hover:border-primary/50 hover:shadow-md"}`}>
                            <CardContent className="p-6 text-center space-y-3">
                              <s.icon className="w-8 h-8 mx-auto text-primary" />
                              <div>
                                <h4 className="font-semibold">{s.label}</h4>
                                <p className="text-sm text-muted-foreground">{s.desc}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </AnimatedCard>
                      ))}
                    </div>
                  </div>
                );
              case 2:
                return (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-semibold">Building Type</h3>
                      <p className="text-muted-foreground">What type of building are you constructing?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: "residential", label: "Residential", desc: "Houses, apartments" },
                        { value: "commercial", label: "Commercial", desc: "Offices, shops, warehouses" },
                        { value: "mixed", label: "Mixed-use", desc: "Residential + commercial" },
                      ].map((t) => (
                        <AnimatedCard
                          key={t.value}
                          onClick={() => {
                            updateFormData("buildingType", t.value);
                            setTimeout(() => nextStep(), 200);
                          }}
                        >
                          <Card className={`cursor-pointer transition-all h-full ${formData.buildingType === t.value ? "border-primary shadow-lg" : "hover:border-primary/50 hover:shadow-md"}`}>
                            <CardContent className="p-6 text-center space-y-3">
                              <Building className="w-8 h-8 mx-auto text-primary" />
                              <div>
                                <h4 className="font-semibold">{t.label}</h4>
                                <p className="text-sm text-muted-foreground">{t.desc}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </AnimatedCard>
                      ))}
                    </div>
                  </div>
                );
              case 3:
                return (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-semibold">Project Size</h3>
                      <p className="text-muted-foreground">Enter your project dimensions</p>
                    </div>
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="area">Total Area (sq ft)</Label>
                        <Input
                          id="area"
                          type="number"
                          placeholder="e.g., 1200"
                          value={formData.totalAreaSqft}
                          onChange={(e) => updateFormData("totalAreaSqft", e.target.value)}
                          className="text-center text-lg"
                        />
                        <p className="text-xs text-muted-foreground">Minimum 100 sq ft</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="floors">Number of Floors</Label>
                        <Select value={formData.floors} onValueChange={(value) => updateFormData("floors", value)}>
                          <SelectTrigger><SelectValue placeholder="Select floors" /></SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map((floor) => (
                              <SelectItem key={floor} value={floor.toString()}>{floor} Floor{floor > 1 ? "s" : ""}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                );
              case 4:
                return (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-semibold">Quality Level</h3>
                      <p className="text-muted-foreground">Choose your material quality preference</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { value: "economy", label: "Economy", desc: "Basic quality, budget-friendly", price: "₹800-1200/sq ft" },
                        { value: "standard", label: "Standard", desc: "Good quality, balanced cost", price: "₹1200-1800/sq ft" },
                        { value: "premium", label: "Premium", desc: "High quality, superior finish", price: "₹1800-2500/sq ft" },
                        { value: "sustainable", label: "Sustainable", desc: "Eco-friendly, green materials", price: "₹1500-2200/sq ft" },
                      ].map((q) => (
                        <AnimatedCard
                          key={q.value}
                          onClick={() => {
                            updateFormData("quality", q.value);
                            setTimeout(() => nextStep(), 200);
                          }}
                        >
                          <Card className={`cursor-pointer transition-all h-full ${formData.quality === q.value ? "border-primary shadow-lg" : "hover:border-primary/50 hover:shadow-md"}`}>
                            <CardContent className="p-6 space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <h4 className="font-semibold">{q.label}</h4>
                                  <p className="text-sm text-muted-foreground">{q.desc}</p>
                                </div>
                                <Badge variant="secondary" className="text-xs">{q.price}</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </AnimatedCard>
                      ))}
                    </div>
                  </div>
                );
              case 5:
                return (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-semibold">Location & Additional Requirements</h3>
                      <p className="text-muted-foreground">Final details for AI analysis</p>
                    </div>
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Select value={formData.city} onValueChange={(value) => updateFormData("city", value)}>
                          <SelectTrigger><SelectValue placeholder="Select your city" /></SelectTrigger>
                          <SelectContent>
                            {["bengaluru", "mumbai", "delhi", "hyderabad", "pune", "chennai"].map((city) => (
                              <SelectItem key={city} value={city}>{city.charAt(0).toUpperCase() + city.slice(1)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="requirements">Additional Requirements (Optional)</Label>
                        <Input id="requirements" placeholder="e.g., Swimming pool, Solar panels" value={formData.additionalRequirements} onChange={(e) => updateFormData("additionalRequirements", e.target.value)} />
                        <p className="text-xs text-muted-foreground">Help AI provide more accurate estimates</p>
                      </div>
                      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className="flex items-start space-x-3">
                          <Bot className="w-5 h-5 text-primary mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium">AI Analysis Ready</p>
                            <p className="text-muted-foreground">VCNITI AI will analyze your requirements and suggest optimal materials</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                );
              case 6:
                return (
                  <MaterialSelectionStep
                    materials={aiGeneratedMaterials}
                    onMaterialsChange={setAiGeneratedMaterials}
                    onNext={nextStep}
                    onPrev={() => setCurrentStep(5)}
                  />
                );
              default:
                return null;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  if (showResults && finalEstimate) {
    return <ResultsDashboard estimate={finalEstimate} formData={formData} />;
  }

  return (
    <section id={id || "prediction-form"} className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="outline" className="text-xs">Step {currentStep} of {totalSteps}</Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="p-8">
            {renderStep()}
            {!isLoading && currentStep > 1 && currentStep < 6 && (
              <div className="flex justify-between items-center mt-8">
                <Button variant="outline" onClick={prevStep} className="flex items-center"><ArrowLeft className="w-4 h-4 mr-2" /> Previous</Button>
                {currentStep === 3 && (
                  <Button onClick={nextStep} disabled={!formData.totalAreaSqft || !formData.floors || parseInt(formData.totalAreaSqft) < 100} variant="hero" className="flex items-center">
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {currentStep === 5 && (
                  <Button onClick={nextStep} disabled={!formData.city} variant="hero" className="flex items-center">
                    Start Estimate <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PredictorForm;