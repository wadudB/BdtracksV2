import { FC } from "react";
import { Link } from "react-router-dom";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Database, Eye, MapPin, Settings, Shield, Users } from "lucide-react";

const PrivacyPolicy: FC = () => {
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
            Privacy Policy
          </Heading>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Introduction</h2>
              </div>
              <div className="space-y-4 text-sm">
                <p>
                  BDTracks is committed to protecting your privacy. This
                  Privacy Policy explains how we collect, use, disclose, and safeguard your
                  information when you visit our website bdtracks.com and use our services.
                </p>
                <p>
                  Please read this Privacy Policy carefully. If you do not agree with the terms of
                  this Privacy Policy, please do not access or use our services.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Information We Collect</h2>
              </div>
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">User Account Information</h3>
                <p>When you create an account or contribute data, we collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Username:</strong> Unique identifier for your account
                  </li>
                  <li>
                    <strong>Email address:</strong> For account verification and communication
                  </li>
                  <li>
                    <strong>Full name:</strong> Optional display name
                  </li>
                  <li>
                    <strong>Password:</strong> Stored as encrypted hash for security
                  </li>
                  <li>
                    <strong>User role:</strong> Admin, data_entry, or viewer permissions
                  </li>
                  <li>
                    <strong>Account status:</strong> Active/inactive status
                  </li>
                  <li>
                    <strong>Last login time:</strong> For security and analytics
                  </li>
                </ul>

                <h3 className="font-semibold mt-6">Price Data Contributions</h3>
                <p>When you contribute commodity price data, we store:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Commodity information:</strong> Type, category, and unit of measurement
                  </li>
                  <li>
                    <strong>Price data:</strong> Actual price values in Bangladeshi Taka
                  </li>
                  <li>
                    <strong>Regional information:</strong> District/region where price was recorded
                  </li>
                  <li>
                    <strong>Location details:</strong> Specific place name, address, and coordinates
                  </li>
                  <li>
                    <strong>Source information:</strong> Where you obtained the price (optional)
                  </li>
                  <li>
                    <strong>Recording date:</strong> When the price was observed
                  </li>
                  <li>
                    <strong>Notes:</strong> Any additional context you provide
                  </li>
                  <li>
                    <strong>Contributor ID:</strong> Link to your account for data attribution
                  </li>
                </ul>

                <h3 className="font-semibold mt-6">Location Information</h3>
                <p>With your permission, we collect and store:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>GPS coordinates:</strong> Latitude and longitude for price locations
                  </li>
                  <li>
                    <strong>Place names:</strong> Market names, shop names, or area names
                  </li>
                  <li>
                    <strong>Addresses:</strong> Full or partial addresses of price locations
                  </li>
                  <li>
                    <strong>Google Place IDs:</strong> For integration with Google Maps services
                  </li>
                  <li>
                    <strong>Point of Interest IDs:</strong> For location reference
                  </li>
                </ul>

                <h3 className="font-semibold mt-6">Automatically Collected Information</h3>
                <p>When you visit our website, we automatically collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, clicks)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Referral information (how you found our website)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Sources and Processing */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Data Sources and Processing</h2>
              </div>
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">Accident Data Collection</h3>
                <p>We automatically collect road accident data from public sources:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>News websites:</strong> New Age Bangladesh, Daily Star Bangladesh
                  </li>
                  <li>
                    <strong>Google Alerts:</strong> Automated news monitoring for accident reports
                  </li>
                  <li>
                    <strong>Article content:</strong> Full text of news articles for analysis
                  </li>
                  <li>
                    <strong>Publication dates:</strong> When articles were published
                  </li>
                  <li>
                    <strong>Source URLs:</strong> Original article links for verification
                  </li>
                  <li>
                    <strong>GPT-4 Analysis:</strong> AI processing to extract structured data from
                    articles
                  </li>
                </ul>

                <h3 className="font-semibold mt-6">Processed Accident Information</h3>
                <p>From news articles, we extract and store:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Accident type (road, train, waterways, plane)</li>
                  <li>Location details (exact location, area, district, division)</li>
                  <li>Casualty information (deaths, injuries)</li>
                  <li>Vehicle types involved</li>
                  <li>Accident causes and circumstances</li>
                  <li>Date and time of incidents</li>
                  <li>Age information of victims (when available)</li>
                </ul>

                <h3 className="font-semibold mt-6">AI and Machine Learning</h3>
                <p>We use artificial intelligence services for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>OpenAI GPT-4:</strong> Processing news articles to extract accident data
                  </li>
                  <li>
                    <strong>Text analysis:</strong> Identifying relevant accident information
                  </li>
                  <li>
                    <strong>Data standardization:</strong> Converting unstructured text to
                    structured data
                  </li>
                  <li>
                    <strong>Duplicate detection:</strong> Preventing duplicate accident records
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">Service Provision</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Display commodity prices and trends across Bangladesh</li>
                  <li>Provide location-based price search functionality</li>
                  <li>Show road accident statistics and analytics</li>
                  <li>Enable user data contributions and verification</li>
                  <li>Generate regional price comparisons and maps</li>
                </ul>

                <h3 className="font-semibold mt-6">Data Quality and Accuracy</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Validate and verify user-contributed price data</li>
                  <li>Cross-reference data with official sources (TCB)</li>
                  <li>Detect and prevent duplicate or fraudulent data</li>
                  <li>Calculate price trends and statistical summaries</li>
                </ul>

                <h3 className="font-semibold mt-6">Platform Improvement</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Analyze usage patterns to improve our services</li>
                  <li>Develop new features and functionality</li>
                  <li>Enhance user experience and interface design</li>
                  <li>Optimize data collection and processing algorithms</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Third-Party Services</h2>
              </div>
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">Google Services</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Google Maps Platform:</strong> Location services, geocoding, and map
                    display
                  </li>
                  <li>
                    <strong>Google Places API:</strong> Location search and place information
                  </li>
                  <li>
                    <strong>Google Sheets API:</strong> Data import and processing (accident data)
                  </li>
                </ul>

                <h3 className="font-semibold mt-6">AI Services</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>OpenAI GPT-4:</strong> News article processing and data extraction
                  </li>
                  <li>
                    <strong>Data processing:</strong> Converting unstructured text to structured
                    data
                  </li>
                </ul>

                <h3 className="font-semibold mt-6">News Sources</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>New Age Bangladesh:</strong> Accident news scraping
                  </li>
                  <li>
                    <strong>Daily Star Bangladesh:</strong> Accident news scraping
                  </li>
                  <li>
                    <strong>Google Alerts:</strong> Automated news monitoring
                  </li>
                </ul>

                <p className="mt-4">
                  <strong>Note:</strong> When using these services, their respective privacy
                  policies also apply. We recommend reviewing their privacy policies for complete
                  information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Information Sharing and Disclosure</h2>
              </div>
              <div className="space-y-4 text-sm">
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may
                  share information in the following circumstances:
                </p>

                <h3 className="font-semibold">Public Data Display</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Commodity prices:</strong> Your contributed price data is displayed
                    publicly for community benefit
                  </li>
                  <li>
                    <strong>Location information:</strong> General location data (market names,
                    areas) is shown publicly
                  </li>
                  <li>
                    <strong>Attribution:</strong> Your username may be shown as the data contributor
                  </li>
                  <li>
                    <strong>Accident statistics:</strong> Aggregated accident data is displayed
                    publicly
                  </li>
                </ul>

                <h3 className="font-semibold mt-6">Service Providers</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Google Maps Platform for location services</li>
                  <li>OpenAI for AI-powered data processing</li>
                  <li>Hosting and infrastructure providers</li>
                  <li>Database and analytics services</li>
                </ul>

                <h3 className="font-semibold mt-6">Legal Requirements</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>When required by law or legal process</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>To protect the rights, property, or safety of our users</li>
                  <li>To prevent fraud or abuse of our services</li>
                </ul>

                <h3 className="font-semibold mt-6">Aggregated Data</h3>
                <p>
                  We may share aggregated, non-personally identifiable information for research,
                  analysis, or public interest purposes, such as market trends and economic
                  indicators.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Data Security</h2>
              </div>
              <div className="space-y-4 text-sm">
                <p>
                  We implement appropriate technical and organizational security measures to protect
                  your personal information against unauthorized access, alteration, disclosure, or
                  destruction.
                </p>

                <h3 className="font-semibold">Security Measures</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Password encryption:</strong> All passwords are stored as encrypted
                    hashes
                  </li>
                  <li>
                    <strong>Database security:</strong> MySQL database with access controls
                  </li>
                  <li>
                    <strong>API security:</strong> Secure FastAPI endpoints with authentication
                  </li>
                  <li>
                    <strong>Data validation:</strong> Input validation and sanitization
                  </li>
                  <li>
                    <strong>Regular updates:</strong> Security patches and system updates
                  </li>
                  <li>
                    <strong>Access controls:</strong> Role-based permissions (admin, data_entry,
                    viewer)
                  </li>
                </ul>

                <p className="mt-4">
                  However, no method of transmission over the Internet or electronic storage is 100%
                  secure. While we strive to protect your personal information, we cannot guarantee
                  absolute security.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Data Retention</h2>
              <div className="space-y-4 text-sm">
                <p>
                  We retain your personal information only for as long as necessary to fulfill the
                  purposes outlined in this Privacy Policy, unless a longer retention period is
                  required or permitted by law.
                </p>

                <h3 className="font-semibold">Retention Periods</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>User accounts:</strong> Retained while account is active, deleted upon
                    request
                  </li>
                  <li>
                    <strong>Price data:</strong> Retained indefinitely for historical analysis and
                    public benefit
                  </li>
                  <li>
                    <strong>Accident data:</strong> Retained indefinitely for safety research and
                    statistics
                  </li>
                  <li>
                    <strong>Location data:</strong> Retained while associated with price records
                  </li>
                  <li>
                    <strong>Usage analytics:</strong> Typically retained for 2 years
                  </li>
                  <li>
                    <strong>News articles:</strong> Retained for accident data source verification
                  </li>
                </ul>

                <h3 className="font-semibold mt-6">Data Anonymization</h3>
                <p>
                  When personal data is no longer needed for its original purpose, we may anonymize
                  it for continued use in research and analytics.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Privacy Rights</h2>
              <div className="space-y-4 text-sm">
                <p>You have the following rights regarding your personal information:</p>

                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Access:</strong> Request information about the personal data we hold
                    about you
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of inaccurate or incomplete data
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal data (subject to
                    public data considerations)
                  </li>
                  <li>
                    <strong>Portability:</strong> Request a copy of your data in a structured format
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to certain types of data processing
                  </li>
                  <li>
                    <strong>Withdrawal:</strong> Withdraw consent for location data collection
                  </li>
                  <li>
                    <strong>Account deactivation:</strong> Deactivate your account at any time
                  </li>
                </ul>

                <h3 className="font-semibold mt-6">Important Note</h3>
                <p>
                  Due to the public nature of price data contributions, some information may remain
                  visible for community benefit even after account deletion. However, we will remove
                  personal identifiers where possible.
                </p>

                <p className="mt-4">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Cookies and Tracking Technologies</h2>
              </div>
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">What We Use</h3>
                <p>We use cookies and similar tracking technologies to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Remember your login session and preferences</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Improve website functionality and performance</li>
                  <li>Provide personalized content and features</li>
                  <li>Remember your location preferences for price searches</li>
                </ul>

                <h3 className="font-semibold mt-6">Types of Cookies</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Essential Cookies:</strong> Required for basic website functionality and
                    user authentication
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how visitors use our site
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> Remember your preferences and choices
                  </li>
                  <li>
                    <strong>Third-party Cookies:</strong> Google Maps and other integrated services
                  </li>
                </ul>

                <h3 className="font-semibold mt-6">Cookie Control</h3>
                <p>
                  You can control and manage cookies through your browser settings. Note that
                  disabling certain cookies may affect website functionality, especially
                  location-based features.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Changes to This Privacy Policy</h2>
              <div className="space-y-4 text-sm">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any
                  changes by posting the new Privacy Policy on this page and updating the "Last
                  updated" date.
                </p>
                <p>
                  We encourage you to review this Privacy Policy periodically for any changes.
                  Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <div className="space-y-4 text-sm">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please
                  contact us:
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>Email:</strong> privacy@bdtracks.com
                  </li>
                  <li>
                    <strong>Website:</strong> bdtracks.com
                  </li>
                  <li>
                    <strong>Address:</strong> Dhaka, Bangladesh
                  </li>
                </ul>
                <p className="mt-4">
                  We will respond to your inquiry within a reasonable timeframe.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
};

export default PrivacyPolicy;
