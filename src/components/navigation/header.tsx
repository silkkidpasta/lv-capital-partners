"use client";

import { NotificationsPanel } from "@/components/dashboard/notifications-panel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "Investments",
    href: "/investments",
    submenu: [
      { name: "Current Opportunities", href: "/investments/opportunities" },
      { name: "Deal Structure", href: "/investments/structure" },
      { name: "Investment Process", href: "/how-it-works" },
    ],
  },
  { name: "About", href: "/about" },
  { name: "Performance", href: "/reports" },
  { name: "Resources", href: "/resources" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-lg border-b border-border shadow-lg"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="md" variant={isScrolled ? "light" : "light"} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.submenu ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-foreground hover:text-primary font-medium flex items-center gap-1"
                      >
                        {item.name}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-card border border-border">
                      {item.submenu.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} asChild>
                          <Link
                            href={subItem.href}
                            className="cursor-pointer hover:bg-muted"
                          >
                            {subItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={item.href}
                    className="text-foreground hover:text-primary font-medium transition-colors duration-200 px-3 py-2 rounded-md"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Authentication Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <SignedOut>
              <Button variant="ghost" className="font-medium" asChild>
                <Link href="/sign-in">Investor Login</Link>
              </Button>
              <Button
                className="font-medium bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                asChild
              >
                <Link href="/sign-up">Apply Now</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button variant="ghost" className="font-medium" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <ThemeToggle />
              <NotificationsPanel />
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard:
                      "bg-white shadow-lg border border-gold/20",
                    userButtonPopoverActionButton:
                      "text-charcoal hover:bg-cream",
                  },
                }}
                afterSignOutUrl="/"
              />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-lg">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="ml-4 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-md"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Authentication */}
              <div className="pt-4 border-t border-border space-y-2">
                <SignedOut>
                  <Link
                    href="/sign-in"
                    className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Investor Login
                  </Link>
                  <Button
                    className="w-full font-medium bg-gradient-to-r from-primary to-accent"
                    asChild
                  >
                    <Link
                      href="/sign-up"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Apply Now
                    </Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="px-3 py-2">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                          userButtonPopoverCard:
                            "bg-white shadow-lg border border-gold/20",
                          userButtonPopoverActionButton:
                            "text-charcoal hover:bg-cream",
                        },
                      }}
                      afterSignOutUrl="/"
                    />
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
