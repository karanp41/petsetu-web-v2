"use client";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginRequired } from "@/components/auth/LoginRequired";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { IMAGE_BASE_URL, PET_CATEGORY_ID_MAP } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ImagePlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Client-visible API base for fetch calls
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const categoryOptions = [
  { label: "Dog", key: "dog" },
  { label: "Cat", key: "cat" },
  { label: "Bunny", key: "bunny" },
];

const currencyOptions = ["AED", "INR", "USD", "EUR", "SAR"] as const;
type Currency = (typeof currencyOptions)[number];

// ArcGIS for address suggestions (reused from ContactForm)
const ARCGIS_FIND_URL =
  "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates";
const ARCGIS_TOKEN =
  "AAPKee8ef60b4d4744be99e3e48116dfbb9fHeatIpw7_iOCSEa87bNen6biiCFsHQ51X63YbUvbajg44q0UV-eQrTsW1HxkaFsW";

const formSchema = z
  .object({
    // Step 1
    petCategoryKey: z.enum(["dog", "cat", "bunny"], {
      required_error: "Select a category",
    }),
    name: z.string().min(1, "Pet name is required"),
    sex: z.enum(["m", "f"], { required_error: "Select sex" }),
    age: z
      .number({ invalid_type_error: "Age must be a number" })
      .int()
      .min(0)
      .max(600)
      .default(0),
    weight: z
      .number({ invalid_type_error: "Weight must be a number" })
      .min(0)
      .max(200)
      .optional(),
    isVaccinationDone: z.boolean().default(false),
    knowEssentialCommands: z.boolean().default(false),

    // Step 2
    isNewBreed: z.boolean().default(false),
    petBreed: z.string().optional(),
    newBreedName: z.string().optional(),

    // Step 3
    title: z.string().min(3, "Title is too short"),
    description: z.string().min(10, "Description is too short"),
    phone: z.string().min(8, "Phone is required"),
    address1: z.string().min(1, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    pincode: z.string().min(2, "Pincode is required"),
    // Hidden fields: populated via ArcGIS suggestion
    latitude: z
      .number({ invalid_type_error: "Latitude must be a number" })
      .min(-90)
      .max(90)
      .optional(),
    longitude: z
      .number({ invalid_type_error: "Longitude must be a number" })
      .min(-180)
      .max(180)
      .optional(),
    // Only for Sell
    price: z
      .number({ invalid_type_error: "Price must be a number" })
      .nonnegative()
      .optional(),
    currency: z.enum(currencyOptions as any).optional(),
    postType: z.enum(["breed", "sell", "adopt"]).default("breed"),

    // Photos are uploaded upfront via media API; not part of this schema
  })
  .superRefine((data, ctx) => {
    // Breed rules
    if (data.isNewBreed) {
      if (!data.newBreedName || data.newBreedName.trim().length < 2) {
        ctx.addIssue({
          path: ["newBreedName"],
          code: z.ZodIssueCode.custom,
          message: "Enter new breed name",
        });
      }
    } else {
      if (!data.petBreed) {
        ctx.addIssue({
          path: ["petBreed"],
          code: z.ZodIssueCode.custom,
          message: "Select a breed",
        });
      }
    }
    // Price & currency required if selling
    if (data.postType === "sell") {
      if (typeof data.price !== "number" || data.price <= 0) {
        ctx.addIssue({
          path: ["price"],
          code: z.ZodIssueCode.custom,
          message: "Enter a valid price",
        });
      }
      if (!data.currency) {
        ctx.addIssue({
          path: ["currency"],
          code: z.ZodIssueCode.custom,
          message: "Select currency",
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

export default function NewPostPage() {
  const { user, tokens, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [breedOptions, setBreedOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [breedsLoading, setBreedsLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  // Store uploaded items with a local blob preview URL to avoid cross-origin preview issues
  const [uploadedItems, setUploadedItems] = useState<
    { fileName: string; previewUrl: string }[]
  >([]);
  const previewUrlsRef = useRef<string[]>([]);
  const [uploading, setUploading] = useState(false);
  // Address search state
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<
    { address: string; location: { x: number; y: number } }[]
  >([]);
  const [loadingSugg, setLoadingSugg] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petCategoryKey: "dog",
      name: "",
      sex: "m",
      age: 0,
      weight: undefined,
      isVaccinationDone: false,
      knowEssentialCommands: false,
      isNewBreed: false,
      petBreed: "",
      newBreedName: "",
      title: "",
      description: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      latitude: undefined,
      longitude: undefined,
      price: undefined,
      currency: undefined,
      postType: "adopt",
    },
  });

  const token = tokens?.access?.token;

  const petCategoryKey = form.watch("petCategoryKey");
  const petCategoryId = useMemo(() => {
    return PET_CATEGORY_ID_MAP[petCategoryKey];
  }, [petCategoryKey]);

  // Debounce helper for address query
  const debouncedQ = useMemo(() => {
    let handle: any;
    return (val: string, cb: (v: string) => void) => {
      if (handle) clearTimeout(handle);
      handle = setTimeout(() => cb(val), 350);
    };
  }, []);

  useEffect(() => {
    async function loadBreeds() {
      if (!API_BASE || !petCategoryId || !token) {
        setBreedOptions([]);
        return;
      }
      setBreedsLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/pets/pet-breeds/${petCategoryId}?limit=200&page=1`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to load breeds");
        const data = await res.json();
        const items: { id: string; name: string }[] = data?.results || [];
        setBreedOptions(items);
      } catch (e: any) {
        setBreedOptions([]);
        toast({ title: "Breed list error", description: e?.message });
      } finally {
        setBreedsLoading(false);
      }
    }
    loadBreeds();
  }, [petCategoryId, token, toast]);

  // Address suggestions via ArcGIS
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
        const cands: { address: string; location: { x: number; y: number } }[] =
          Array.isArray(data?.candidates)
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

  function onSelectSuggestion(c: {
    address: string;
    location: { x: number; y: number };
  }) {
    form.setValue("address1", c.address || "");
    const firstToken = c.address?.split(",")[0]?.trim() || "";
    if (firstToken) form.setValue("city", firstToken);
    form.setValue(
      "longitude",
      typeof c.location?.x === "number" ? c.location.x : undefined
    );
    form.setValue(
      "latitude",
      typeof c.location?.y === "number" ? c.location.y : undefined
    );
    setQ(c.address || "");
    setSuggestions([]);
  }

  // Clear opposite breed field when toggling new breed
  useEffect(() => {
    const sub = form.watch((values, { name }) => {
      if (name === "isNewBreed") {
        const v = (values as any).isNewBreed as boolean;
        if (v) {
          form.setValue("petBreed", "");
        } else {
          form.setValue("newBreedName", "");
        }
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  // Defer auth gate until after hooks to avoid conditional hook execution

  const onNext = async () => {
    console.log("Validating step", step);
    // Validate current step subset before moving forward
    let fields: (keyof FormValues)[] = [];
    if (step === 0) {
      fields = [
        "petCategoryKey",
        "name",
        "sex",
        "age",
        "weight",
        "isVaccinationDone",
        "knowEssentialCommands",
      ];
    } else if (step === 1) {
      fields = ["isNewBreed", "petBreed", "newBreedName"];
    } else if (step === 2) {
      fields = [
        "title",
        "description",
        "phone",
        "postType",
        "address1",
        "city",
        "state",
        "country",
        "pincode",
      ];
      if (form.getValues("postType") === "sell") {
        fields.push("price", "currency");
      }
    }

    const valid = await form.trigger(fields as any);
    if (!valid) return;
    // Clear any errors set by resolver for non-current fields to avoid showing
    // step 3 errors (e.g., title) before users reach that step.
    form.clearErrors();
    setStep((s) => Math.min(2, s + 1));
  };

  const onBack = () => setStep((s) => Math.max(0, s - 1));

  // Build absolute URL for an uploaded image file name; URL-encode path safely
  const makeImageUrl = (p: string) => {
    if (!p) return "";
    if (/^https?:\/\//i.test(p)) return p;
    const base = IMAGE_BASE_URL.replace(/\/$/, "");
    const clean = p.replace(/^\//, "");
    // Encode each path segment to avoid ORB/CORS heuristics triggered by special chars
    const encoded = clean
      .split("/")
      .map((seg) => encodeURIComponent(seg))
      .join("/");
    return `${base}/${encoded}`;
  };

  const removePhoto = (idx: number) => {
    setUploadedItems((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(idx, 1);
      // Revoke the object URL to free memory
      try {
        if (removed?.previewUrl) {
          URL.revokeObjectURL(removed.previewUrl);
          previewUrlsRef.current = previewUrlsRef.current.filter(
            (u) => u !== removed.previewUrl
          );
        }
      } catch {}
      return copy;
    });
  };

  // Cleanup all object URLs on unmount
  useEffect(() => {
    return () => {
      try {
        previewUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
        previewUrlsRef.current = [];
      } catch {}
    };
  }, []);

  const uploadSelectedFiles = async (files: File[]) => {
    if (!files.length) return;
    if (!API_BASE || !token) {
      toast({ title: "Auth required", description: "Please login again" });
      return;
    }
    setUploading(true);
    try {
      const results: { fileName: string; previewUrl: string }[] = [];
      for (const f of files) {
        // Create a local preview URL immediately; will be shown after upload completes
        const previewUrl = URL.createObjectURL(f);
        previewUrlsRef.current.push(previewUrl);
        const fd = new FormData();
        fd.append("file", f);
        const up = await fetch(`${API_BASE}/media/upload`, {
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
          body: fd,
        });
        if (!up.ok) {
          const t = await up.text();
          throw new Error(t || "Upload failed");
        }
        const resp = await up.json();
        // Prefer absolute URL fields if provided by backend
        const absolute = resp?.url || resp?.fileUrl || resp?.Location;
        const fileName: string = absolute?.startsWith?.("http")
          ? absolute
          : resp?.fileName;
        if (fileName) {
          results.push({ fileName, previewUrl });
        } else {
          // If no usable identifier returned, revoke preview and skip
          try {
            URL.revokeObjectURL(previewUrl);
          } catch {}
        }
      }
      if (results.length) {
        setUploadedItems((prev) => [...prev, ...results]);
        toast({
          title: "Uploaded",
          description: `${results.length} photo(s) added`,
        });
      }
    } catch (err: any) {
      toast({
        title: "Upload error",
        description: err?.message || String(err),
      });
    } finally {
      setUploading(false);
    }
  };

  const doSubmit = form.handleSubmit(async (values) => {
    if (!API_BASE) {
      toast({ title: "Config error", description: "API base not set" });
      return;
    }
    if (!token || !user?.id) {
      toast({ title: "Auth required", description: "Please login again" });
      return;
    }
    setCreating(true);
    try {
      const payload: any = {
        // Pet specifics
        name: values.name,
        age: values.age,
        sex: values.sex,
        weight: values.weight,
        isVaccinationDone: values.isVaccinationDone,
        knowEssentialCommands: values.knowEssentialCommands,
        petCategory: petCategoryId, // keep both for backend expectations
        isNewBreed: values.isNewBreed,
        ...(values.isNewBreed
          ? { newBreedName: values.newBreedName }
          : { petBreed: values.petBreed }),

        // Post specifics
        title: values.title,
        description: values.description,
        phone: values.phone,
        address1: values.address1,
        address2: values.address2,
        city: values.city,
        state: values.state,
        country: values.country,
        pincode: values.pincode,
        ...(typeof values.latitude === "number" &&
        typeof values.longitude === "number"
          ? {
              loc: {
                type: "Point",
                coordinates: [values.longitude, values.latitude],
              },
            }
          : {}),
        price: values.price,
        currency: values.currency,
        postType: values.postType,
        ...(uploadedItems.length
          ? { photos: uploadedItems.map((i) => i.fileName) }
          : {}),

        // Owner/Poster
        ownerId: user.id,
        postedBy: user.id,
        ...(user?.sellerType ? { sellerType: user.sellerType } : {}),

        // Source
        source: "web",
      };

      const res = await fetch(`${API_BASE}/post/combined`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Create failed: ${res.status}`);
      }
      const created = await res.json();
      const postId =
        created?.post?.id || created?.post?._id || created?.id || created?._id;
      if (!postId) throw new Error("Missing post id in response");

      toast({ title: "Ad posted", description: "Your ad is live." });
      router.push(`/post/${postId}`);
    } catch (e: any) {
      toast({ title: "Failed to post", description: e?.message });
      setStep(0);
    } finally {
      setCreating(false);
    }
  });

  // Show login prompt after all hooks have been declared
  if (!loading && !user) {
    return <LoginRequired message="Login to place your ad." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Place Free Ad</h1>
      <p className="text-sm text-gray-600 mb-6">
        A quick 3-step form to post your pet ad.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left vertical stepper */}
        <aside className="md:col-span-4">
          <div className="relative rounded-2xl border border-gray-200/70 shadow-sm bg-gradient-to-b from-white to-orange-50/40 p-5">
            {/* Vertical line aligned to center of the markers */}
            <div className="absolute left-[34px] top-0 bottom-0 w-px bg-gray-200" />
            <ol className="space-y-6">
              {[
                { title: "Pet", desc: "Basics about your pet" },
                { title: "Breed", desc: "Choose or add breed" },
                { title: "Ad Details", desc: "Details, address & photos" },
              ].map((s, i) => {
                const completed = step > i;
                const current = step === i;
                return (
                  <li
                    key={s.title}
                    className={`relative pl-10 ${i === 2 ? "pb-0" : "pb-6"}`}
                  >
                    <span
                      className={`absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${
                        completed
                          ? "bg-green-100 border-green-200 text-green-700"
                          : current
                          ? "bg-orange-100 border-orange-200 text-orange-700"
                          : "bg-gray-100 border-gray-200 text-gray-500"
                      }`}
                    >
                      {completed ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    <div className="text-sm font-medium leading-5">
                      {s.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.desc}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>

        {/* Right form content */}
        <div className="md:col-span-8 rounded-2xl border border-gray-200/70 shadow-sm bg-gradient-to-b from-white to-orange-50/30 p-6">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                // Only allow explicit click on the final submit button to submit
                const submitter = (e as any).nativeEvent?.submitter as
                  | HTMLButtonElement
                  | undefined;
                if (!submitter || submitter.name !== "finalSubmit") {
                  e.preventDefault();
                  if (step < 2) onNext();
                  return;
                }
                e.preventDefault();
                if (step === 2) {
                  doSubmit();
                }
              }}
              className="space-y-6"
            >
              {/* Step 1: Pet basics */}
              {step === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="petCategoryKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(v) => field.onChange(v)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryOptions.map((c) => (
                              <SelectItem value={c.key} key={c.key}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Buddy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sex</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(v) => field.onChange(v)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="m">Male</SelectItem>
                            <SelectItem value="f">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (months)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="numeric"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="decimal"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 gap-3 col-span-1 md:col-span-2">
                    <FormField
                      control={form.control}
                      name="isVaccinationDone"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <Checkbox
                              className="h-5 w-5 md:h-6 md:w-6 border-2 rounded-md shadow-sm"
                              checked={field.value}
                              onCheckedChange={(v) =>
                                field.onChange(Boolean(v))
                              }
                            />
                          </FormControl>
                          <FormLabel className="!m-0">
                            Vaccination Done
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="knowEssentialCommands"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <Checkbox
                              className="h-5 w-5 md:h-6 md:w-6 border-2 rounded-md shadow-sm"
                              checked={field.value}
                              onCheckedChange={(v) =>
                                field.onChange(Boolean(v))
                              }
                            />
                          </FormControl>
                          <FormLabel className="!m-0">
                            Knows Essential Commands
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Breed */}
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Breed dropdown first */}
                  {!form.watch("isNewBreed") && (
                    <FormField
                      control={form.control}
                      name="petBreed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Breed</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(v) => field.onChange(v)}
                            disabled={breedsLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    breedsLoading
                                      ? "Loading..."
                                      : "Select breed"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {breedOptions.map((b) => (
                                <SelectItem key={b.id} value={b.id}>
                                  {b.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {form.watch("isNewBreed") && (
                    <FormField
                      control={form.control}
                      name="newBreedName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>New Breed Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Desi Bunny" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {/* Checkbox below dropdown */}
                  <FormField
                    control={form.control}
                    name="isNewBreed"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3 md:col-span-2">
                        <FormControl>
                          <Checkbox
                            className="h-5 w-5 md:h-6 md:w-6 border-2 rounded-md shadow-sm"
                            checked={field.value}
                            onCheckedChange={(v) => field.onChange(Boolean(v))}
                          />
                        </FormControl>
                        <FormLabel className="!m-0">
                          I can&apos;t find my breed
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Post details */}
              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Short catchy title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Describe your pet"
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
                          <Input placeholder="+91-XXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Post Type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(v) => field.onChange(v)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="breed">Breed</SelectItem>
                            <SelectItem value="sell">Sell</SelectItem>
                            <SelectItem value="adopt">Adopt</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Price & currency only for Sell; placed before address */}
                  {form.watch("postType") === "sell" && (
                    <>
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                inputMode="decimal"
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select
                              value={(field.value as string) ?? ""}
                              onValueChange={(v) => field.onChange(v)}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {currencyOptions.map((c) => (
                                  <SelectItem key={c} value={c}>
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Address group */}
                  <div className="md:col-span-2 mt-2 p-5 border rounded-xl bg-white/60 shadow-xs">
                    <div className="font-medium mb-3">Address</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Search with suggestions */}
                      <div className="md:col-span-2">
                        <FormLabel>Search Location</FormLabel>
                        <div className="relative">
                          <Input
                            placeholder="Search location (e.g. Dubai)"
                            value={q}
                            onChange={(e) => {
                              const v = e.target.value;
                              setQ(v);
                              debouncedQ(v, (vv) => setQ(vv));
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
                      </div>
                      <FormField
                        control={form.control}
                        name="address1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address 1</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address 2</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* latitude/longitude remain hidden in state */}
                  </div>
                </div>
              )}

              {/* Photo upload now part of Step 3 */}
              {step === 2 && (
                <div className="md:col-span-2 space-y-3">
                  <div
                    className="relative rounded-2xl border border-dashed bg-white/70 p-6 transition hover:shadow-sm"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (uploading || creating) return;
                      const files = Array.from(
                        e.dataTransfer.files || []
                      ).filter((f) => f.type.startsWith("image/"));
                      void uploadSelectedFiles(files as File[]);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        <ImagePlus className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Upload photos</div>
                        <div className="text-xs text-muted-foreground">
                          PNG, JPG up to ~5MB each. Drag and drop or click to
                          choose.
                        </div>
                      </div>
                      <label className="inline-flex cursor-pointer items-center rounded-md border bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition hover:bg-gray-50">
                        Choose files
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={uploading || creating}
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            await uploadSelectedFiles(files as File[]);
                            if (e.target) e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                    {uploading && (
                      <div className="absolute inset-0 grid place-items-center rounded-2xl bg-white/60 text-xs text-muted-foreground">
                        Uploading…
                      </div>
                    )}
                  </div>

                  {uploadedItems.length > 0 && (
                    <div>
                      <div className="mb-2 text-xs text-muted-foreground">
                        {uploadedItems.length} photo(s) ready
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                        {uploadedItems.map((item, idx) => (
                          <div
                            key={`${item.fileName}-${idx}`}
                            className="group relative overflow-hidden rounded-xl border bg-white shadow-xs"
                          >
                            <div className="aspect-square w-full bg-gray-50">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={
                                  item.previewUrl || makeImageUrl(item.fileName)
                                }
                                alt="Uploaded"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target =
                                    e.currentTarget as HTMLImageElement;
                                  const fallback = makeImageUrl(item.fileName);
                                  if (target.src !== fallback)
                                    target.src = fallback;
                                }}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow ring-1 ring-black/5 opacity-0 transition group-hover:opacity-100"
                              title="Remove"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Nav buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={step === 0 || creating}
                >
                  Back
                </Button>
                {step < 2 ? (
                  <Button type="button" onClick={onNext} disabled={creating}>
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    name="finalSubmit"
                    onClick={doSubmit}
                    disabled={creating || uploading}
                  >
                    {creating
                      ? "Posting..."
                      : uploading
                      ? "Uploading..."
                      : "Post Ad"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
