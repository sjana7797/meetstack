import { ContactPage } from "@/features/contact/contact-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Support — Meetstack",
  description:
    "Get in touch with Meetstack engineering, enterprise sales, or security team. Average response time under 15 minutes.",
};

export default function Contact() {
  return <ContactPage />;
}
