"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Client-visible API base (must be set in .env.local in development or provided at runtime)
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://petsetu-api.onrender.com/v1";

// ArcGIS findAddressCandidates endpoint with static token provided in the task description
const ARCGIS_FIND_URL =
  "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates";
const ARCGIS_TOKEN =
  "AAPKee8ef60b4d4744be99e3e48116dfbb9fHeatIpw7_iOCSEa87bNen6biiCFsHQ51X63YbUvbajg44q0UV-eQrTsW1HxkaFsW";

// Validation schema for Contact form
const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(5, "Enter a valid phone number"),
  message: z.string().min(5, "Please add a brief message"),
  addressQuery: z.string().optional().default(""),
  address1: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
});

type ContactValues = z.infer<typeof schema>;

type ArcGISCandidate = {
  address: string;
  location: { x: number; y: number };
};

export default function ContactForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<ArcGISCandidate[]>([]);
  const [loadingSugg, setLoadingSugg] = useState(false);

  const form = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      addressQuery: "",
      address1: "",
      city: "",
      lat: null,
      lng: null,
    },
  });

  // Debounce query
  const debouncedQ = useMemo(() => {
    let handle: any;
    return (val: string, cb: (v: string) => void) => {
      if (handle) clearTimeout(handle);
      handle = setTimeout(() => cb(val), 350);
    };
  }, []);

  useEffect(() => {
    if (!q || q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setLoadingSugg(true);
    const encoded = encodeURIComponent(q.trim());
    const url = `${ARCGIS_FIND_URL}?address=${encoded}&f=json&token=${ARCGIS_TOKEN}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const cands: ArcGISCandidate[] = Array.isArray(data?.candidates)
          ? data.candidates.map((c: any) => ({
              address: c?.address ?? "",
              location: { x: c?.location?.x, y: c?.location?.y },
            }))
          : [];
        setSuggestions(cands.slice(0, 8));
      })
      .catch(() => setSuggestions([]))
      .finally(() => setLoadingSugg(false));
  }, [q]);

  function onSelectSuggestion(c: ArcGISCandidate) {
    form.setValue("address1", c.address || "");
    // Heuristic for city: if address has commas, pick the first token as city candidate
    const firstToken = c.address?.split(",")[0]?.trim() || "";
    if (firstToken) form.setValue("city", firstToken);
    form.setValue(
      "lng",
      typeof c.location?.x === "number" ? c.location.x : null
    );
    form.setValue(
      "lat",
      typeof c.location?.y === "number" ? c.location.y : null
    );
    form.setValue("addressQuery", c.address || "");
    setQ(c.address || "");
    setSuggestions([]);
  }

  async function onSubmit(values: ContactValues) {
    setSubmitting(true);
    try {
      if (!API_BASE) throw new Error("API base not configured");

      const coords =
        typeof values.lng === "number" && typeof values.lat === "number"
          ? [values.lng, values.lat]
          : [null, null];

      const payload = {
        title: "Contact us - General enquiry",
        description: values.message,
        leadType: "GENERIC_ENQUIRY",
        source: "web",
        customerPersonalDetails: {
          phone: values.phone,
          email: values.email,
          name: values.name,
        },
        customerAddressDetails: {
          address1: values.address1 || values.addressQuery || "",
          city: values.city || values.addressQuery || "",
          loc: {
            type: "Point",
            coordinates: coords as [number | null, number | null],
          },
        },
      };

      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText} - ${text}`);
      }

      toast({
        title: "Message sent",
        description: "Thanks! We'll get back to you soon.",
      });
      form.reset();
      setQ("");
      setSuggestions([]);
    } catch (e: any) {
      toast({
        title: "Submission failed",
        description: e?.message || "Please try again later.",
        variant: "destructive" as any,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. +971-5x-xxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="How can we help you?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location search */}
        <div className="grid md:grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="addressQuery"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Search location (e.g. Dubai)"
                      value={q}
                      onChange={(e) => {
                        const v = e.target.value;
                        setQ(v);
                        debouncedQ(v, (vv) => setQ(vv));
                        field.onChange(v);
                      }}
                    />
                    {loadingSugg && (
                      <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                        Loading…
                      </div>
                    )}
                    {suggestions.length > 0 && (
                      <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow z-10">
                        {suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => onSelectSuggestion(s)}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                          >
                            {s.address}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="address1"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Address (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Address line" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-xs text-muted-foreground flex items-end">
            Coordinates: {form.watch("lat") ?? "–"}, {form.watch("lng") ?? "–"}
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Sending…" : "Send message"}
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            We typically respond within 24–48 hours.
          </p>
        </div>
      </form>
    </Form>
  );
}
