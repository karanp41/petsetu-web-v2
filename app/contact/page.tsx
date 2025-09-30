import petHero from "@/assets/contact_us/dog-contact-us.jpg";
import ContactForm from "@/components/contact/ContactForm";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact Us | PetSetu",
  description:
    "Do you have any query? Feel free to reach us out. We're here to help with adoptions, breeding, lost & found, and general questions.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 md:gap-12 md:grid-cols-2 items-start">
        {/* Left content */}
        <section className="space-y-4">
          <div>
            <span className="inline-block rounded-full border px-3 py-1 text-xs text-muted-foreground">
              Contact us
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            Let’s Get In Touch.
          </h1>
          <p className="text-muted-foreground">
            Do you have any query? Feel free to reach us out. We’re here to help
            with adoptions, breeding, lost &amp; found, and general questions.
          </p>
          <div className="pt-2 text-sm">
            Or just reach out manually at{" "}
            <a className="underline" href="mailto:petsetu@gmail.com">
              petsetu@gmail.com
            </a>
          </div>
          <div className="pt-4">
            <Image
              src={petHero}
              alt="Happy pet – we’re here to help"
              className="rounded-lg border shadow object-cover w-full h-auto"
              sizes="(min-width: 768px) 40vw, 100vw"
              priority
            />
          </div>
        </section>

        {/* Right form */}
        <section className="h-full">
          <div className="rounded-lg border p-5 shadow-sm bg-white mt-0 h-full">
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
