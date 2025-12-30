"use client";

import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/sangam-kunwar-14b89834a/",
      label: "LinkedIn",
    },
    { icon: Github, href: "https://github.com/sangamkunwar-dv", label: "GitHub" },
    { icon: Mail, href: "mailto:sangamkunwar48@gmail.com", label: "Email" },
  ];

  return (
    <footer id="contact" className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* Grid: Brand + Contact + Social */}
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">Sangam Kunwar</h3>
            <p className="text-sm text-muted-foreground">
              Full-stack developer building beautiful digital experiences with modern web technologies.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail size={16} />
                <a href="mailto:sangamkunwar48@gmail.com"
                  className="hover:text-foreground transition-colors">
                  sangamkunwar48@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} />
                <a
                  href="https://wa.me/9779701024066?text=Hello%20Friends,%20you%20want%20to%20connect%20with%20me"
                  className="hover:text-foreground transition-colors"
                >
                  +977 9701024066
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} />
                <span>Tilottama-8, Rupandehi, Nepal</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* ⭐ Google Map Added Here */}
        <div className="w-full h-[350px] rounded-xl overflow-hidden mb-10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!3m2!1sen!2snp!4v1764999556749!5m2!1sen!2snp!6m8!1m7!1s2lDLB_vM1bFkr-2HpjxJog!2m2!1d27.62617227068209!2d83.50039042112363!3f261.10538!4f0!5f0.7820865974627469"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {currentYear} Sangam Kunwar. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
