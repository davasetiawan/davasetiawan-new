"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Navbar from "./Navbar";
import MobileTabBar from "./MobileTabBar";
import CursorFX from "./CursorFX";
import FloatingDots from "./FloatingDots";
import Hero from "./Hero";
import TechLogosMarquee from "./TechLogosMarquee";
import TechMarquee from "./TechMarquee";
import About from "./About";
import ProjectsGrid from "./ProjectsGrid";
import ExperienceTimeline from "./ExperienceTimeline";
import CertificatesList from "./CertificatesList";
import ContactFooter from "./ContactFooter";
import AdminAuth from "./admin/AdminAuth";
import AdminPanel from "./admin/AdminPanel";
import { NAV_ITEMS } from "../lib/nav";

function useActiveSection() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 150;
      let currentSection = "home";
      NAV_ITEMS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) {
          if (el.offsetTop <= scrollPos) {
            currentSection = id;
          }
        }
      });
      setActive(currentSection);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // init
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return active;
}

export default function Portfolio() {
  const [authOpen, setAuthOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const sudoBuffer = useRef("");
  const active = useActiveSection();

  useEffect(() => {
    setAuthed(sessionStorage.getItem("dava-admin-auth") === "1");
  }, []);

  const openAdmin = useCallback(() => {
    if (authed) setPanelOpen(true);
    else setAuthOpen(true);
  }, [authed]);

  useEffect(() => {
    const onKey = (e) => {
      const target = e.target;
      const inField =
        target instanceof Element &&
        (target.closest("input, textarea, select") || target.isContentEditable);

      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        openAdmin();
        return;
      }

      if (inField || e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key.length === 1) {
        sudoBuffer.current = (
          sudoBuffer.current + e.key.toLowerCase()
        ).slice(-8);
        if (sudoBuffer.current.endsWith("sudo")) {
          sudoBuffer.current = "";
          openAdmin();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAdmin]);

  return (
    <main className="relative z-0 min-h-screen w-full overflow-x-hidden bg-transparent text-[var(--foreground)] transition-colors duration-500">
      <FloatingDots />
      <Navbar active={active} />
      <div className="relative z-10">
        <div id="home">
          <Hero />
        </div>
        <TechLogosMarquee />
        <div id="about">
          <About />
        </div>
        <div id="projects">
          <ProjectsGrid />
        </div>
        <div id="experience">
          <ExperienceTimeline />
        </div>
        <div id="certificates">
          <CertificatesList />
        </div>
        <TechMarquee />
        <div id="contact">
          <ContactFooter />
        </div>
      </div>
      
      <MobileTabBar active={active} />

      <a
        href="#contact"
        aria-label="Hubungi saya"
        className="fixed bottom-6 right-6 z-40 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-[var(--highlight)] text-[var(--highlight-foreground)] shadow-[0_0_20px_var(--highlight)] transition-transform duration-300 hover:scale-110"
      >
        <MessageCircle size={20} />
      </a>

      {authOpen && !authed ? (
        <AdminAuth
          onSuccess={() => {
            setAuthed(true);
            setAuthOpen(false);
            setPanelOpen(true);
          }}
          onClose={() => setAuthOpen(false)}
        />
      ) : null}

      {panelOpen && authed ? (
        <AdminPanel
          onClose={() => setPanelOpen(false)}
          onLogout={() => {
            sessionStorage.removeItem("dava-admin-auth");
            setAuthed(false);
            setPanelOpen(false);
          }}
        />
      ) : null}
    </main>
  );
}
