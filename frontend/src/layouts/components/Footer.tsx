import { Link } from "react-router-dom";
import { Container } from "@/components/ui/container";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container>
        <div className="py-8">
          {/* Copyright and social */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} BDTRACKS
              </p>
              <div className="flex space-x-6">
                <FooterLink to="/faq" label="FAQ" />
                <FooterLink to="/terms" label="Terms & Conditions" />
                <FooterLink to="/privacy" label="Privacy Policy" />
              </div>
            </div>
            <SocialLinks />
          </div>
        </div>
      </Container>
    </footer>
  );
}

// Helper components to keep the main component cleaner
function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="text-muted-foreground hover:text-primary transition-colors text-sm">
      {label}
    </Link>
  );
}

function SocialLinks() {
  return (
    <div className="flex space-x-4 mt-4 md:mt-0">
      <SocialLink href="https://facebook.com" icon="facebook" label="Facebook" />
      {/* <SocialLink href="https://linkedin.com" icon="linkedin" label="LinkedIn" /> */}
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
      aria-label={label}
    >
      <span className="material-icons text-xl">{icon}</span>
    </a>
  );
}
