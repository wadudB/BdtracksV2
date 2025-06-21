import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "data" | "privacy" | "technical";
}

const faqData: FAQItem[] = [
  {
    category: "general",
    question: "What is BDTracks?",
    answer:
      "BDTracks is a comprehensive data tracking platform for Bangladesh that provides real-time commodity prices, road accident statistics, regional price comparisons, and various analytics tools to help users make informed decisions.",
  },
  {
    category: "general",
    question: "Is BDTracks free to use?",
    answer:
      "Yes, BDTracks is completely free to use. All our data tracking services, including commodity prices, accident statistics, and regional maps, are available at no cost to users.",
  },
  {
    category: "data",
    question: "How accurate is the commodity price data?",
    answer:
      "Our commodity price data comes from official sources including the Trading Corporation of Bangladesh (TCB) and user contributions. While we strive for accuracy, we recommend verifying prices locally before making purchasing decisions.",
  },
  {
    category: "data",
    question: "How often is the data updated?",
    answer:
      "Commodity prices are updated daily based on TCB data and user contributions. Road accident data is updated regularly as new information becomes available from official sources.",
  },
  {
    category: "data",
    question: "Can I contribute data to BDTracks?",
    answer:
      "Yes! You can contribute commodity price data from your local market. Currently, data contribution is available for the Commodity Price Tracker. Simply visit the commodities page and click 'Add New Price Data' to contribute.",
  },
  {
    category: "data",
    question: "What regions does BDTracks cover?",
    answer:
      "BDTracks covers all 64 districts of Bangladesh. Our platform provides data and services for urban and rural areas across the country, with ongoing efforts to expand coverage.",
  },
  {
    category: "technical",
    question: "Why do I need to allow location access?",
    answer:
      "Location access allows us to show you commodity prices and services near your area, provide regional price comparisons, and enhance map-based features. Location access is optional and can be disabled at any time.",
  },
  {
    category: "technical",
    question: "Which browsers are supported?",
    answer:
      "BDTracks works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your preferred browser.",
  },
  {
    category: "technical",
    question: "Can I use BDTracks on mobile devices?",
    answer:
      "Yes, BDTracks is fully responsive and works on smartphones and tablets. Our mobile interface is optimized for easy navigation and data viewing on smaller screens.",
  },
  {
    category: "privacy",
    question: "What data do you collect about users?",
    answer:
      "We collect minimal data necessary for service provision, including location data (with permission), usage analytics, and any information you voluntarily provide. See our Privacy Policy for complete details.",
  },
  {
    category: "privacy",
    question: "Do you share my data with third parties?",
    answer:
      "We do not sell or trade your personal information. We only share data with service providers (like Google Maps) necessary for platform functionality, and only as described in our Privacy Policy.",
  },
  {
    category: "privacy",
    question: "How can I delete my data?",
    answer:
      "You can request data deletion by contacting us at privacy@bdtracks.com. We will process your request in accordance with applicable privacy laws and our Privacy Policy.",
  },
  {
    category: "general",
    question: "How can I report incorrect data?",
    answer:
      "If you notice incorrect data on our platform, please contact us with details about the issue. You can reach us through our contact information or submit a correction through the relevant data page.",
  },
  {
    category: "technical",
    question: "What should I do if the website isn't working properly?",
    answer:
      "Try refreshing the page, clearing your browser cache, or using a different browser. If problems persist, please contact us with details about the issue you're experiencing.",
  },
  {
    category: "data",
    question: "Can I use BDTracks data for commercial purposes?",
    answer:
      "Commercial use of our data requires prior written permission. Please contact us to discuss licensing arrangements for commercial use of BDTracks data.",
  },
];

const categories = {
  general: { label: "General", icon: "help_outline" },
  data: { label: "Data & Services", icon: "storage" },
  technical: { label: "Technical", icon: "settings" },
  privacy: { label: "Privacy & Security", icon: "shield" },
};

const FAQ: FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqData.filter((faq) => faq.category === activeCategory);

  return (
    <Section>
      <Container>
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Heading size="lg" className="mb-2">
            Frequently Asked Questions
          </Heading>
          <p className="text-muted-foreground">
            Find answers to common questions about BDTracks platform and services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {Object.entries(categories).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setActiveCategory(key)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                        activeCategory === key
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <span className="material-icons text-sm">{category.icon}</span>
                      {category.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="material-icons">
                  {categories[activeCategory as keyof typeof categories].icon}
                </span>
                {categories[activeCategory as keyof typeof categories].label}
              </h2>

              {filteredFAQs.map((faq) => {
                const globalIndex = faqData.indexOf(faq);
                const isExpanded = expandedItems.has(globalIndex);

                return (
                  <Card key={globalIndex}>
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full text-left p-4 hover:bg-muted/50 transition-colors flex items-center justify-between"
                      >
                        <span className="font-medium pr-4">{faq.question}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4">
                          <div className="border-t pt-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find the answer you're looking for? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/privacy" className="text-primary hover:underline text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary hover:underline text-sm">
                Terms & Conditions
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              For additional support, contact us at: <strong>support@bdtracks.com</strong>
            </p>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
};

export default FAQ;
