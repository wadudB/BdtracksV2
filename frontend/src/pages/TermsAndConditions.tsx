import { FC } from "react";
import { Link } from "react-router-dom";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Database, FileText, Gavel, Shield, Users } from "lucide-react";

const TermsAndConditions: FC = () => {
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
            Terms and Conditions
          </Heading>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Agreement to Terms</h2>
              </div>
              <div className="space-y-4 text-sm">
                <p>
                  Welcome to BDTracks ("we", "our", or "us"). These Terms and Conditions ("Terms")
                  govern your use of our website bdtracks.com and related services (collectively,
                  the "Service").
                </p>
                <p>
                  By accessing or using our Service, you agree to be bound by these Terms. If you
                  disagree with any part of these Terms, then you may not access the Service.
                </p>
                <p>
                  These Terms apply to all visitors, users, and others who access or use the
                  Service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Service Description</h2>
              </div>
              <div className="space-y-4 text-sm">
                <p>
                  BDTracks is a comprehensive data tracking platform for Bangladesh that provides:
                </p>

                <h3 className="font-semibold">Commodity Price Tracking</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Price Database:</strong> Real-time commodity prices across Bangladesh
                  </li>
                  <li>
                    <strong>Regional Comparisons:</strong> Price variations across different
                    districts and regions
                  </li>
                  <li>
                    <strong>Historical Trends:</strong> Price history and trend analysis
                  </li>
                  <li>
                    <strong>Location-Based Search:</strong> Find prices near specific locations
                  </li>
                  <li>
                    <strong>User Contributions:</strong> Community-driven price data collection
                  </li>
                  <li>
                    <strong>TCB Integration:</strong> Official Trading Corporation of Bangladesh
                    data
                  </li>
                </ul>

                <h3 className="font-semibold mt-6">Road Accident Analytics</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Accident Statistics:</strong> Comprehensive road accident data and
                    trends
                  </li>
                  <li>
                    <strong>Geographic Analysis:</strong> District-wise accident hotspots
                  </li>
                  <li>
                    <strong>Vehicle Analysis:</strong> Types of vehicles involved in accidents
                  </li>
                  <li>
                    <strong>Casualty Tracking:</strong> Death and injury statistics
                  </li>
                  <li>
                    <strong>Automated Data Collection:</strong> News-based accident data scraping
                  </li>
                  <li>
                    <strong>AI Processing:</strong> GPT-4 powered data extraction from news articles
                  </li>
                </ul>

                <h3 className="font-semibold mt-6">Interactive Features</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Interactive Maps:</strong> Google Maps integration for location services
                  </li>
                  <li>
                    <strong>Data Visualization:</strong> Charts, graphs, and analytics dashboards
                  </li>
                  <li>
                    <strong>Search and Filter:</strong> Advanced search capabilities
                  </li>
                  <li>
                    <strong>Responsive Design:</strong> Mobile and desktop compatibility
                  </li>
                  <li>
                    <strong>Real-time Updates:</strong> Live data updates and notifications
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts and Registration */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">User Accounts and Registration</h2>
              </div>
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">Account Creation</h3>
                <p>To contribute data to our platform, you must create an account by providing:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>A unique username</li>
                  <li>A valid email address</li>
                  <li>A secure password</li>
                  <li>Your full name (optional)</li>
                </ul>

                <h3 className="font-semibold mt-6">Account Types and Permissions</h3>
                <p>We offer different account types with varying permissions:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Viewer:</strong> Browse and view all public data
                  </li>
                  <li>
                    <strong>Data Entry:</strong> Contribute commodity price data
                  </li>
                  <li>
                    <strong>Admin:</strong> Full platform access and management capabilities
                  </li>
                </ul>

                <h3 className="font-semibold mt-6">Account Security</h3>
                <p>You are responsible for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Providing accurate and up-to-date information</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Contribution and User Responsibilities */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  Data Contribution and User Responsibilities
                </h2>
              </div>
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">Data Accuracy</h3>
                <p>When contributing commodity price data, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and truthful price information</li>
                  <li>Verify prices from reliable sources</li>
                  <li>Include relevant context and location details</li>
                  <li>Update or correct inaccurate data when possible</li>
                  <li>Not submit false, misleading, or fraudulent information</li>
                </ul>

                <h3 className="font-semibold mt-6">Location Data</h3>
                <p>When providing location information, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate GPS coordinates and addresses</li>
                  <li>Respect privacy when recording locations</li>
                  <li>Not include sensitive or private location information</li>
                  <li>Ensure you have permission to share location data</li>
                </ul>

                <h3 className="font-semibold mt-6">Public Nature of Contributions</h3>
                <p>You understand and agree that:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your contributed data will be publicly displayed</li>
                  <li>Your username may be shown as the data contributor</li>
                  <li>Data contributions are for the public benefit</li>
                  <li>You cannot retract data that has been integrated into our database</li>
                  <li>Data may be used for research and analysis purposes</li>
                </ul>

                <h3 className="font-semibold mt-6">Prohibited Activities</h3>
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Submit false, inaccurate, or misleading data</li>
                  <li>Attempt to manipulate or spam our systems</li>
                  <li>Use automated tools to submit data without permission</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Interfere with other users' ability to use the service</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Sources and Disclaimers */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Data Sources and Disclaimers</h2>
              </div>
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">Data Sources</h3>
                <p>Our platform aggregates data from multiple sources:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Official Sources:</strong> Trading Corporation of Bangladesh (TCB)
                  </li>
                  <li>
                    <strong>User Contributions:</strong> Community-submitted price data
                  </li>
                  <li>
                    <strong>News Sources:</strong> New Age Bangladesh, Daily Star Bangladesh
                  </li>
                  <li>
                    <strong>Automated Collection:</strong> Google Alerts and web scraping
                  </li>
                  <li>
                    <strong>AI Processing:</strong> GPT-4 analysis of news articles
                  </li>
                </ul>

                <h3 className="font-semibold mt-6">Data Accuracy Disclaimer</h3>
                <p>
                  While we strive to provide accurate information, we cannot guarantee the accuracy,
                  completeness, or timeliness of all data. Users should:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Verify important information from multiple sources</li>
                  <li>Use data as a reference, not as the sole basis for decisions</li>
                  <li>Understand that prices may vary by location and time</li>
                  <li>Consider market conditions and seasonal variations</li>
                </ul>

                <h3 className="font-semibold mt-6">Accident Data Disclaimer</h3>
                <p>
                  Road accident data is collected from public news sources and processed using AI.
                  This data may not be complete or official. For official accident statistics,
                  consult relevant government authorities.
                </p>

                <h3 className="font-semibold mt-6">Third-Party Data</h3>
                <p>
                  We use third-party services including Google Maps, OpenAI, and news websites. We
                  are not responsible for the accuracy or availability of third-party data or
                  services.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Gavel className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Intellectual Property Rights</h2>
              </div>
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">Platform Ownership</h3>
                <p>
                  The BDTracks platform, including its design, features, code, and original content,
                  is owned by BDTracks and protected by intellectual property laws.
                </p>

                <h3 className="font-semibold mt-6">User-Generated Content</h3>
                <p>When you contribute data to our platform, you:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Retain ownership of your contributed data</li>
                  <li>Grant us a license to use, display, and distribute your data</li>
                  <li>Allow us to process and analyze your data for platform improvement</li>
                  <li>Permit us to make your data publicly available for community benefit</li>
                </ul>

                <h3 className="font-semibold mt-6">Third-Party Content</h3>
                <p>
                  News articles and other third-party content are used under fair use principles for
                  informational and analytical purposes. Original sources are credited where
                  possible.
                </p>

                <h3 className="font-semibold mt-6">Permitted Use</h3>
                <p>You may use our platform for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Personal, non-commercial research and analysis</li>
                  <li>Educational purposes</li>
                  <li>News reporting and journalism (with proper attribution)</li>
                  <li>Academic research (with proper citation)</li>
                </ul>

                <h3 className="font-semibold mt-6">Commercial Use</h3>
                <p>
                  Commercial use of our data or platform requires explicit written permission.
                  Contact us for licensing arrangements for commercial applications.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data Protection */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Privacy and Data Protection</h2>
              <div className="space-y-4 text-sm">
                <p>
                  Your privacy is important to us. Our collection, use, and protection of your
                  personal information is governed by our Privacy Policy, which is incorporated into
                  these Terms by reference.
                </p>

                <h3 className="font-semibold">Key Privacy Points</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We collect only necessary information for service provision</li>
                  <li>Location data is collected with your explicit consent</li>
                  <li>User passwords are encrypted and stored securely</li>
                  <li>You can control your privacy settings and data sharing preferences</li>
                  <li>You have rights to access, correct, and delete your personal data</li>
                </ul>

                <p className="mt-4">
                  Please review our{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  for detailed information about our data practices.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Service Availability and Modifications</h2>
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">Service Availability</h3>
                <p>
                  We strive to provide continuous service availability, but we cannot guarantee
                  uninterrupted access. Service may be temporarily unavailable due to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Scheduled maintenance and updates</li>
                  <li>Technical difficulties or server issues</li>
                  <li>Third-party service disruptions (Google Maps, OpenAI, etc.)</li>
                  <li>Force majeure events</li>
                </ul>

                <h3 className="font-semibold mt-6">Service Modifications</h3>
                <p>We reserve the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Modify, suspend, or discontinue any part of our service</li>
                  <li>Update our data collection and processing methods</li>
                  <li>Change our user interface and features</li>
                  <li>Implement new policies and procedures</li>
                </ul>

                <h3 className="font-semibold mt-6">Data Backup and Recovery</h3>
                <p>
                  While we maintain regular backups of our data, we cannot guarantee complete data
                  recovery in case of system failures. Users are encouraged to maintain their own
                  records of important data.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Limitation of Liability</h2>
              </div>
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">Service Disclaimer</h3>
                <p>
                  Our service is provided "as is" and "as available" without warranties of any kind,
                  either express or implied. We do not warrant that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The service will be uninterrupted or error-free</li>
                  <li>All data will be accurate, complete, or up-to-date</li>
                  <li>The service will meet your specific requirements</li>
                  <li>Any defects will be corrected</li>
                </ul>

                <h3 className="font-semibold mt-6">Limitation of Damages</h3>
                <p>To the fullest extent permitted by law, BDTracks shall not be liable for any:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Direct, indirect, incidental, or consequential damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Damages resulting from use of inaccurate data</li>
                  <li>Damages from service interruptions or technical issues</li>
                  <li>Damages from third-party services or content</li>
                </ul>

                <h3 className="font-semibold mt-6">User Responsibility</h3>
                <p>
                  Users are responsible for their own decisions based on information obtained from
                  our platform. We recommend verifying critical information from multiple sources.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Termination</h2>
              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">Termination by User</h3>
                <p>You may terminate your account at any time by:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Contacting us to request account deletion</li>
                  <li>Ceasing to use our services</li>
                </ul>

                <h3 className="font-semibold mt-6">Termination by BDTracks</h3>
                <p>We may terminate or suspend your account if you:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violate these Terms and Conditions</li>
                  <li>Provide false or misleading information</li>
                  <li>Engage in prohibited activities</li>
                  <li>Abuse our services or systems</li>
                  <li>Violate applicable laws or regulations</li>
                </ul>

                <h3 className="font-semibold mt-6">Effect of Termination</h3>
                <p>Upon termination:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your access to the service will be discontinued</li>
                  <li>Your personal account information will be removed</li>
                  <li>Previously contributed data may remain for public benefit</li>
                  <li>These Terms will continue to apply to past use of the service</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Governing Law and Jurisdiction</h2>
              <div className="space-y-4 text-sm">
                <p>
                  These Terms and Conditions are governed by and construed in accordance with the
                  laws of Bangladesh, without regard to its conflict of law principles.
                </p>
                <p>
                  Any disputes arising out of or relating to these Terms or the use of our service
                  shall be subject to the exclusive jurisdiction of the courts of Bangladesh.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Changes to Terms</h2>
              <div className="space-y-4 text-sm">
                <p>
                  We reserve the right to modify or replace these Terms at any time. If a revision
                  is material, we will try to provide at least 30 days notice prior to any new terms
                  taking effect.
                </p>
                <p>
                  What constitutes a material change will be determined at our sole discretion. By
                  continuing to access or use our service after those revisions become effective,
                  you agree to be bound by the revised terms.
                </p>
                <p>If you do not agree to the new terms, please stop using the service.</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4 text-sm">
                <p>
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>Email:</strong> legal@bdtracks.com
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

export default TermsAndConditions;
