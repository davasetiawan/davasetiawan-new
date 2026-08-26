"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import MobileTabBar from "./MobileTabBar";
import CursorFX from "./CursorFX";
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
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
    console.log(
      "%c[dava-portfolio]%c Tekan Ctrl+Shift+A atau ketik 'sudo' untuk membuka panel admin.",
      "color:#b5ff6d;font-weight:bold",
      "color:inherit"
    );
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
    <main className="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500 md:pb-0">
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <Navbar active={active} />
        <div id="home" />
        <CursorFX />
        <Hero />
        <TechLogosMarquee />
        <About />
        <ProjectsGrid />
        <ExperienceTimeline />
        <CertificatesList />
        <TechMarquee />
        <ContactFooter />
        <MobileTabBar active={active} />
      </motion.div>

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
