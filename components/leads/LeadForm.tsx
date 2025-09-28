"use client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Validation schema matching the required payload
const leadSchema = z.object({
  title: z.string().min(3, "Title is required"),
  leadType: z.enum(["POST_NEW_REQUIREMENT"]).default("POST_NEW_REQUIREMENT"),
  description: z.string().min(10, "Please add a brief description"),
  customerPersonalDetails: z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(8, "Enter a valid phone number"),
    age: z.string().optional(),
    gender: z.enum(["m", "f", "o"]).optional(),
  }),
  customerAddressDetails: z.object({
    address1: z.string().optional().or(z.literal("")),
    address2: z.string().optional().or(z.literal("")),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required").default("India"),
    pincode: z
      .union([z.string(), z.number()])
      .optional()
      .transform((v) =>
        v === undefined ? "" : typeof v === "string" ? v.trim() : String(v)
      ),
    lat: z.string().optional().or(z.literal("")),
    lng: z.string().optional().or(z.literal("")),
  }),
  leadAdditionalDetails: z.object({
    petType: z.string().min(2, "Pet type is required"),
    requirementType: z
      .enum(["adopt", "sell", "breed", "lost", "found"])
      .default("adopt"),
  }),
});

type LeadFormValues = z.infer<typeof leadSchema>;

// Reads client-visible API base (must be configured in env)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export function LeadForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const { toast } = useToast();
  const { user, tokens } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      title: "",
      leadType: "POST_NEW_REQUIREMENT",
      description: "",
      customerPersonalDetails: {
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        age: "",
        gender: undefined,
      },
      customerAddressDetails: {
        address1: "",
        address2: "",
        city: user?.city || "",
        state: "",
        country: user?.country || "India",
        pincode: user?.pincode ? String(user.pincode) : "",
        lat: user?.loc?.coordinates?.[1] ? String(user.loc.coordinates[1]) : "",
        lng: user?.loc?.coordinates?.[0] ? String(user.loc.coordinates[0]) : "",
      },
      leadAdditionalDetails: {
        petType: "",
        requirementType: "adopt",
      },
    },
  });

  // Rehydrate fields when user changes (after login)
  useEffect(() => {
    if (user) {
      form.setValue("customerPersonalDetails.name", user.name || "");
      form.setValue("customerPersonalDetails.email", user.email || "");
      form.setValue("customerPersonalDetails.phone", user.phone || "");
      form.setValue("customerAddressDetails.city", user.city || "");
      form.setValue("customerAddressDetails.country", user.country || "India");
      if (user.pincode)
        form.setValue("customerAddressDetails.pincode", String(user.pincode));
      if (user.loc?.coordinates) {
        form.setValue(
          "customerAddressDetails.lng",
          String(user.loc.coordinates[0] ?? "")
        );
        form.setValue(
          "customerAddressDetails.lat",
          String(user.loc.coordinates[1] ?? "")
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // We'll construct headers on submit to avoid typing issues

  async function onSubmit(values: LeadFormValues) {
    if (!API_BASE) {
      toast({
        title: "Configuration error",
        description: "API base URL is not set.",
        variant: "destructive" as any,
      });
      return;
    }
    setSubmitting(true);
    try {
      // Build backend payload
      const coords =
        values.customerAddressDetails.lat && values.customerAddressDetails.lng
          ? [
              Number(values.customerAddressDetails.lng),
              Number(values.customerAddressDetails.lat),
            ]
          : undefined;

      const payload: any = {
        title: values.title,
        leadType: values.leadType,
        description: values.description,
        customerPersonalDetails: {
          ...values.customerPersonalDetails,
        },
        customerAddressDetails: {
          address1: values.customerAddressDetails.address1,
          address2: values.customerAddressDetails.address2 || undefined,
          city: values.customerAddressDetails.city,
          state: values.customerAddressDetails.state,
          country: values.customerAddressDetails.country,
          pincode: Number(values.customerAddressDetails.pincode),
          ...(coords
            ? {
                loc: { type: "Point", coordinates: coords as [number, number] },
              }
            : {}),
        },
        leadAdditionalDetails: {
          ...values.leadAdditionalDetails,
        },
      };

      const headers: Record<string, string> = {
        "content-type": "application/json",
      };
      const token = tokens?.access?.token;
      if (token) headers.authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`${res.status} ${res.statusText} - ${body}`);
      }

      toast({
        title: "Requirement submitted",
        description: "Thanks! We'll start matching and contact you shortly.",
      });
      form.reset();
      onSubmitted?.();
    } catch (e: any) {
      const message = e?.message || "Failed to submit requirement";
      toast({
        title: "Submission failed",
        description: message,
        variant: "destructive" as any,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Essentials */}
        <div className="grid md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="leadAdditionalDetails.requirementType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requirement</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="adopt">Adopt</SelectItem>
                    <SelectItem value="sell">Buy</SelectItem>
                    <SelectItem value="breed">Breed</SelectItem>
                    <SelectItem value="lost">Lost Pet</SelectItem>
                    <SelectItem value="found">Found Pet</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="leadAdditionalDetails.petType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pet Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Dog, Cat, Bunny" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="customerAddressDetails.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerAddressDetails.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerAddressDetails.pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 249403" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Looking to adopt a friendly rabbit"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Share key details (age, temperament, timeline, etc.)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="customerPersonalDetails.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerPersonalDetails.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. +91-98xxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerPersonalDetails.email"
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
        </div>

        {/* Advanced (optional) */}
        <Collapsible>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              More details (optional)
            </p>
            <CollapsibleTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                Show / Hide
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="grid md:grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="customerPersonalDetails.age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="Your age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerPersonalDetails.gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="m">Male</SelectItem>
                        <SelectItem value="f">Female</SelectItem>
                        <SelectItem value="o">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="customerAddressDetails.address1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Address line 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerAddressDetails.address2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Address line 2 (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="customerAddressDetails.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerAddressDetails.lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 30.121212" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerAddressDetails.lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 77.43234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="pt-1">
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Requirement"}
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Free to post. Our team will connect you with the best matches.
          </p>
        </div>
      </form>
    </Form>
  );
}

export default LeadForm;
