import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company info */}
          <div>
            <h3 className="text-lg font-bold mb-4">BDTRACKS</h3>
            <p className="text-muted-foreground">
              Bangladesh Commodity Tracker - providing real-time prices and insights for
              agricultural, industrial, and energy commodities across Bangladesh.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/commodities" label="Commodities" />
              <FooterLink to="/map" label="Regional Prices" />
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink to="/faq" label="FAQ" />
              <FooterLink to="/blog" label="Blog" />
              <FooterLink to="/api" label="API" />
              <FooterLink to="/contact" label="Contact" />
            </ul>
          </div>
        </div>

        {/* Copyright and social */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} BDTRACKS. All rights reserved.
          </p>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}

// Helper components to keep the main component cleaner
function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <Link to={to} className="text-muted-foreground hover:text-primary transition-colors">
        {label}
      </Link>
    </li>
  );
}

function SubscribeForm() {
  return (
    <div className="flex">
      <Input type="email" placeholder="Your email" className="flex-1 rounded-r-none" />
      <Button className="rounded-l-none">Subscribe</Button>
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="flex space-x-4 mt-4 md:mt-0">
      <SocialLink href="https://facebook.com" icon="facebook" />
      <SocialLink href="https://twitter.com" icon="twitter" />
      <SocialLink href="https://linkedin.com" icon="linkedin" />
    </div>
  );
}

function SocialLink({ href, icon }: { href: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-primary transition-colors"
    >
      <span className="material-icons">{icon}</span>
    </a>
  );
}
