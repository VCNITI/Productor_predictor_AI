import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Clock, Shield } from "lucide-react";
import { AnimatedCard } from "./ui/AnimatedCard";

const AboutAIPlanner = () => {
  const [isPdfReady, setIsPdfReady] = useState(false);

  // Dynamically load jsPDF and AutoTable from CDN in the correct order
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const initPdfLibraries = async () => {
      try {
        // 1. Load jsPDF first
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
        );

        // 2. IMPORTANT: Shim window.jsPDF so the autoTable plugin can find it.
        // jsPDF UMD module exports to window.jspdf, but many plugins expect window.jsPDF.
        if (window.jspdf && window.jspdf.jsPDF) {
          window.jsPDF = window.jspdf.jsPDF;
        }

        // 3. Load jspdf-autotable *after* jsPDF is ready and shimmed
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js",
        );

        setIsPdfReady(true);
      } catch (err) {
        console.error("Failed to load PDF libraries", err);
      }
    };

    initPdfLibraries();
  }, []);

  const downloadSampleReport = () => {
    if (!isPdfReady || !window.jspdf) {
      alert("PDF Generator is still loading. Please try again in a moment.");
      return;
    }

    // Access jsPDF from the namespace
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Verify autoTable is available
    if (typeof doc.autoTable !== "function") {
      console.error("AutoTable plugin not correctly loaded on jsPDF instance.");
      alert(
        "Error: PDF Table generator not ready. Please refresh and try again.",
      );
      return;
    }

    // --- 1. HEADER SECTION ---
    // Company Name
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185); // Blue branding color
    doc.text("Vcniti Technologies Private Limited", 105, 15, {
      align: "center",
    });

    // Company Details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("CIN No. U47912KA2025PTC205758", 105, 22, { align: "center" });
    doc.text(
      "E-Mail: info@vcniti.com | Website: www.vcniti.com | Phone: +91 9740059699",
      105, 
      27,
      { align: "center" },
    );
    doc.text(
      "Office: 48, Church St, Haridevpur, Shanthala Nagar, Ashok Nagar, Bengaluru, KA 560001",
      105, 
      32,
      { align: "center" },
    );

    // Divider Line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 36, 196, 36);

    // Report Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Construction Material Estimate Report", 14, 45);

    // --- 2. PROJECT METADATA ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Left Column
    doc.text("Project Stage: Foundation", 14, 53);
    doc.text("Building Type: Residential", 14, 59);
    doc.text("Total Area: 1200 sq ft", 14, 65);
    doc.text("Number of Floors: 6", 14, 71);

    // Right Column
    doc.text("Quality Level: Premium", 120, 53);
    doc.text("Location: Bengaluru", 120, 59);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 120, 65);

    // --- 3. THE TABLE (BOQ) ---
    const tableColumn = [
      "S.No",
      "Material / Brand",
      "Quantity",
      "Unit Cost Range (Rs.)",
      "Total Cost (Avg Rs.)",
    ];

    const tableRows = [
      ["1", "Cement\n(UltraTech)", "750 bags", "350 - 400", "2,81,250"],
      [
        "2",
        "Steel Reinforcement\n(Tata Tiscon)",
        "1800 kg",
        "60 - 70",
        "1,17,000",
      ],
      [
        "3",
        "Coarse Aggregate\n(20mm Aggregate)",
        "20 m3",
        "1,200 - 1,500",
        "27,000",
      ],
      ["4", "Fine Aggregate\n(M-Sand)", "15 m3", "800 - 1,000", "13,500"],
      [
        "5",
        "Waterproofing Compound\n(Tata BlueScope)",
        "10 kg",
        "200 - 250",
        "2,250",
      ],
      [
        "6",
        "Formwork Plywood\n(Premium Brand)",
        "150 sqm",
        "70 - 90",
        "12,000",
      ],
      ["7", "Adhesive for Tiles\n(Fevicol)", "20 kg", "300 - 350", "6,500"],
      ["8", "Brick\n(Wienerberger)", "6000 nos", "15 - 17", "96,000"],
      [
        "9",
        "Concrete Mix\n(Ready Mix Concrete)",
        "30 m3",
        "5,500 - 6,500",
        "1,80,000",
      ],
      ["10", "CPVC Pipes\n(Premium Brand)", "100 rmt", "25 - 30", "2,750"],
      ["11", "Electrical Conduit\n(Havells)", "200 rmt", "20 - 25", "4,500"],
      [
        "12",
        "Reinforcement Mesh\n(UltraTech)",
        "100 sqm",
        "150 - 200",
        "17,500",
      ],
      [
        "13",
        "Expansion Joints\n(Premium Brand)",
        "50 nos",
        "100 - 120",
        "5,500",
      ],
      ["14", "Curing Compound\n(Premium Brand)", "20 kg", "150 - 200", "3,500"],
      ["15", "Gravel\n(Premium Brand)", "10 m3", "1,200 - 1,500", "13,500"],
      ["16", "Anchor Bolts\n(Premium Brand)", "100 nos", "20 - 25", "2,250"],
      [
        "17",
        "Damp Proof Course\n(Dr. Fixit)",
        "100 sqm",
        "150 - 170",
        "16,000",
      ],
      ["18", "Sealant\n(Premium Brand)", "20 kg", "250 - 300", "5,500"],
      ["19", "Screed Mix\n(Premium Brand)", "10 m3", "4,000 - 5,000", "45,000"],
    ];

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 78,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        valign: "middle",
        halign: "left",
        textColor: [0, 0, 0], // Force black text
      },
      headStyles: {
        fillColor: [240, 240, 240], // Light gray header
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 15 }, // S.No
        2: { halign: "center" }, // Quantity
        3: { halign: "right" }, // Cost
        4: { halign: "right" }, // Total
      },
    });

    // --- 4. SUMMARY / FOOTER ---
    // Retrieve the Y position where the table ended (check if lastAutoTable exists)
    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 200;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Final Estimate Summary", 14, finalY + 10);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Total Materials: 19 items", 14, finalY + 18);
    doc.text(
      "Estimated Cost Range: Rs. 7,12,500 - Rs. 8,48,500",
      14,
      finalY + 24,
    );
    doc.text("AI Confidence Level: 90%", 14, finalY + 30);

    // Disclaimer
    doc.setFontSize(8);
    doc.setTextColor(100);
    const disclaimer =
      "Note: This estimate is generated using AI analysis and current market rates. Actual costs may vary based on market conditions and specific project requirements.";
    doc.text(disclaimer, 14, finalY + 40, { maxWidth: 180 });

    // Footer Page Number
    doc.text("Page 1/1", 180, 290);

    doc.save("vcniti-construction-estimate.pdf");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center gradient-surface px-4 py-20">
      {/* Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center space-y-8"
      >
        {/* Badge */}
        <motion.div variants={itemVariants}>
          <Badge variant="secondary" className="px-6 py-2 text-sm font-medium">
            <Shield className="w-4 h-4 mr-2" />
            Trusted by 100+ builders across India
          </Badge>
        </motion.div>

        {/* Heading */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            VCNITI Building Material Planner
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-primary">
            Estimate materials & cost in{" "}
            <span className="gradient-hero bg-clip-text text-transparent">
              60 seconds
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-manrope">
            AI-powered Q-commerce platform transforming construction material
            sourcing. Get accurate BOQ and pricing with brand recommendations,
            eco-friendly alternatives, and instant supplier connections.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            variant="hero"
            size="xl"
            className="w-full sm:w-auto"
            onClick={() => {
              const predictorSection = 
                document.getElementById("prediction-form");
              predictorSection?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Calculator className="w-5 h-5 mr-2" />
            Start Free Estimate
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="w-full sm:w-auto"
            onClick={downloadSampleReport}
            disabled={!isPdfReady}
          >
            <Clock className="w-5 h-5 mr-2" />
            {isPdfReady ? "View Sample Report" : "Loading Report..."}
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          <AnimatedCard>
            <Card className="p-6 shadow-card hover:shadow-accent transition-smooth">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">92%</div>
                <div className="text-sm text-muted-foreground">
                  Accuracy Rate
                </div>
              </div>
            </Card>
          </AnimatedCard>
          <AnimatedCard>
            <Card className="p-6 shadow-card hover:shadow-accent transition-smooth">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">₹2.5L</div>
                <div className="text-sm text-muted-foreground">
                  Avg. Savings
                </div>
              </div>
            </Card>
          </AnimatedCard>
          <AnimatedCard>
            <Card className="p-6 shadow-card hover:shadow-accent transition-smooth">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">24hrs</div>
                <div className="text-sm text-muted-foreground">
                  Fresh Pricing
                </div>
              </div>
            </Card>
          </AnimatedCard>
        </motion.div>

        {/* How it works */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
              1
            </div>
            <h3 className="text-lg font-semibold">Input Project Details</h3>
            <p className="text-muted-foreground">
              Share your project size, type, and quality preferences
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
              2
            </div>
            <h3 className="text-lg font-semibold">Get Instant BOQ</h3>
            <p className="text-muted-foreground">
              AI generates detailed material quantities and cost ranges
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
              3
            </div>
            <h3 className="text-lg font-semibold">Compare & Procure</h3>
            <p className="text-muted-foreground">
              View scenarios, find suppliers, and add to cart
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-3 bg-primary rounded-full mt-2"
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutAIPlanner;
