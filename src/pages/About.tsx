import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building,
  Calculator,
  Users,
  Award,
  Target,
  Lightbulb,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import constructionHero from "@/assets/construction-hero.jpg";
import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/ui/AnimatedCard";

const About = () => {
  const services = [
    {
      icon: Calculator,
      title: "Cost Calculator",
      description: "AI-powered estimation for accurate project costing",
    },
    {
      icon: Building,
      title: "Material Sourcing",
      description: "Connect with verified suppliers and get best rates",
    },
    {
      icon: Users,
      title: "Supplier Network",
      description: "Access to 1000+ trusted suppliers across India",
    },
    {
      icon: Award,
      title: "Project Management",
      description: "End-to-end project tracking and management tools",
    },
  ];

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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="py-20 px-4 gradient-surface"
        >
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div variants={itemVariants}>
              <Badge variant="secondary" className="px-6 py-2">
                <Target className="w-4 h-4 mr-2" />
                About VCNITI
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              Transforming Construction
              <span className="text-primary gradient-hero bg-clip-text text-transparent">
                {" "}
                Material Sourcing
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              AI-powered Q-commerce platform revolutionizing how construction
              materials are sourced, estimated, and procured across India.
            </motion.p>

            <motion.div variants={itemVariants}>
              <Button variant="hero" size="lg" asChild>
                <a href="https://www.vcniti.com/">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Explore Our Platform
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Company Overview */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="py-20 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">
                  About VCNITI Technologies
                </h2>
                <p className="text-lg text-muted-foreground">
                  VCNITI Technologies Private Limited is pioneering the future
                  of construction material procurement through innovative
                  technology solutions. Our AI-powered platform transforms how
                  builders, contractors, and project managers estimate, source,
                  and procure construction materials.
                </p>
                <p className="text-muted-foreground">
                  Founded with the vision to digitize and streamline the
                  construction supply chain, we combine advanced algorithms with
                  real-time market data to provide accurate cost estimates,
                  connect buyers with trusted suppliers, and enable seamless
                  project execution.
                </p>

                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      10,000+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Projects Estimated
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      1,000+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Verified Suppliers
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <img
                  src={constructionHero}
                  alt="Construction site"
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg"></div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section
          id="services"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.2 }}
          className="py-20 px-4 bg-muted/30"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold">Our Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive solutions for all your construction material needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <AnimatedCard>
                    <Card className="text-center shadow-card h-full">
                      <CardHeader>
                        <div className="w-16 h-16 mx-auto gradient-hero rounded-full flex items-center justify-center mb-4">
                          <service.icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-lg">
                          {service.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.2 }}
          className="py-20 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold">Platform Features</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need for efficient construction material
                management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={itemVariants}>
                <AnimatedCard>
                  <Card className="shadow-card h-full">
                    <CardHeader>
                      <CardTitle>BOQ Generator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Generate detailed Bill of Quantities with accurate
                        material requirements, recommended brands, and cost
                        estimations based on real-time market data.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Automated quantity calculations</li>
                        <li>• Brand recommendations from trusted suppliers</li>
                        <li>• Real-time pricing updates</li>
                        <li>• Downloadable detailed reports</li>
                      </ul>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={itemVariants}>
                <AnimatedCard>
                  <Card className="shadow-card h-full">
                    <CardHeader>
                      <CardTitle>AI Cost Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Advanced AI algorithms analyze project specifications
                        and market conditions to provide highly accurate cost
                        estimates with confidence levels.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Machine learning-powered estimations</li>
                        <li>• Location-based pricing variations</li>
                        <li>• Quality grade considerations</li>
                        <li>• Scenario comparison tools</li>
                      </ul>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={itemVariants}>
                <AnimatedCard>
                  <Card className="shadow-card h-full">
                    <CardHeader>
                      <CardTitle>Brand Matching</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Intelligent brand recommendation system that matches the
                        best available brands for each material type based on
                        quality, availability, and pricing.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Trusted brand partnerships</li>
                        <li>• Quality-based recommendations</li>
                        <li>• Regional availability mapping</li>
                        <li>• Price comparison across brands</li>
                      </ul>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </motion.div>

              <motion.div variants={itemVariants}>
                <AnimatedCard>
                  <Card className="shadow-card h-full">
                    <CardHeader>
                      <CardTitle>Eco-Friendly Alternatives</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Discover sustainable and environmentally friendly
                        material alternatives that reduce carbon footprint
                        without compromising on quality or cost.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Green material options</li>
                        <li>• Carbon footprint analysis</li>
                        <li>• Sustainability scoring</li>
                        <li>• Eco-certification verification</li>
                      </ul>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
