import { LoginRequired } from "@/components/auth/LoginRequired";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPostById } from "@/lib/api";
import { IMAGE_BASE_URL, postTypeLabelMap } from "@/lib/constants";
import { Post } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { BadgeCheck, Calendar, MapPin, PawPrint, Phone } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: { id: string };
}

function formatWeight(weight: unknown): string | null {
  if (typeof weight === "number" && Number.isFinite(weight)) {
    return `${weight} kg`;
  }

  if (typeof weight === "string" && weight.trim()) {
    return weight.trim();
  }

  if (weight && typeof weight === "object") {
    const candidate = weight as { value?: unknown; unit?: unknown };
    const value = candidate.value;
    const unit = candidate.unit;

    if (typeof value === "number" && Number.isFinite(value)) {
      return `${value}${unit ? ` ${String(unit)}` : ""}`.trim();
    }

    if (typeof value === "string" && value.trim()) {
      return `${value}${unit ? ` ${String(unit)}` : ""}`.trim();
    }
  }

  return null;
}

function getBreedNames(breedDetails: unknown): string[] {
  if (Array.isArray(breedDetails)) {
    return breedDetails
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item === "object") {
          const name = (item as { name?: unknown }).name;
          return typeof name === "string" ? name : null;
        }

        return null;
      })
      .filter((name): name is string => Boolean(name && name.trim()));
  }

  if (breedDetails && typeof breedDetails === "object") {
    const name = (breedDetails as { name?: unknown }).name;
    return typeof name === "string" && name.trim() ? [name] : [];
  }

  return [];
}

function getAnimalAvatarUrl(animalType?: string | null): string {
  return `https://petsetu-assets.s3.ap-south-1.amazonaws.com/pet-icons/petsetu-${(animalType || "").toLowerCase()}-icon.png`;
}

function formatDateValue(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}(T|$)/.test(trimmed)) {
    try {
      return format(parseISO(trimmed), "PP");
    } catch {
      return null;
    }
  }

  return null;
}

function formatDetailValue(value: unknown): string | null {
  if (value === undefined || value === null) return null;

  const formattedDate = formatDateValue(value);
  if (formattedDate) return formattedDate;

  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();

  if (Array.isArray(value)) {
    const joined = value
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const name = (item as { name?: unknown }).name;
          return typeof name === "string" ? name : null;
        }
        return null;
      })
      .filter((item): item is string => Boolean(item && item.trim()));

    return joined.length > 0 ? joined.join(", ") : null;
  }

  if (value && typeof value === "object") {
    const candidate = value as { value?: unknown; unit?: unknown; name?: unknown };
    if (candidate.name && typeof candidate.name === "string") {
      return candidate.name.trim();
    }

    if (candidate.value !== undefined) {
      const formatted = formatDetailValue(candidate.value);
      if (formatted) {
        return candidate.unit && typeof candidate.unit === "string" && candidate.unit.trim()
          ? `${formatted} ${candidate.unit.trim()}`
          : formatted;
      }
    }
  }

  return null;
}

function getPetDetailsItems(petDetails: Record<string, any> | undefined) {
  if (!petDetails || typeof petDetails !== "object") return [];

  const items: Array<{ label: string; value: string }> = [];
  const excludedKeys = new Set(["_id", "ownerid", "ownerId", "createdAt", "createdat", "created", "owner_id", "owner-id"]);
  const addItem = (label: string, value: unknown) => {
    const formatted = formatDetailValue(value);
    if (formatted) {
      items.push({ label, value: formatted });
    }
  };

  addItem("Name", petDetails.name);
  addItem("Age", petDetails.age !== undefined ? `${petDetails.age} months` : null);
  addItem("Sex", petDetails.sex);
  addItem("Weight", formatWeight(petDetails.weight));
  addItem("Vaccinated", petDetails.health?.isVaccinated ?? petDetails.isVaccinationDone);
  addItem("Knows Commands", petDetails.knowEssentialCommands);
  addItem("Breeds", getBreedNames(petDetails.breedDetails));

  Object.entries(petDetails).forEach(([key, value]) => {
    const normalizedKey = key.toLowerCase();

    if (["name", "age", "sex", "weight", "health", "knowEssentialCommands", "isVaccinationDone", "breedDetails"].includes(key)) {
      return;
    }

    if (key === "isVaccinated" || excludedKeys.has(normalizedKey)) {
      return;
    }

    const formatted = formatDetailValue(value);
    if (formatted) {
      const label = key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      items.push({ label, value: formatted });
    }
  });

  return items;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = params;
  let post: Post | null = null;

  try {
    post = await fetchPostById(id);
  } catch (e: any) {
    if (e?.status === 401) {
      return <LoginRequired message="Please login to view this post." />;
    }
    return notFound();
  }
  if (!post) return notFound();

  const postedDate = post.createdAt
    ? (() => {
      try {
        return format(parseISO(post.createdAt), "PP");
      } catch {
        return null;
      }
    })()
    : null;

  const location = [post.address1, post.city, post.state, post.country]
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .join(", ");

  const photos = Array.isArray(post.photos) ? post.photos : [];
  const primary = photos[0];
  const rest = photos.slice(1);
  const title = post.title; // stable non-null after earlier notFound guard
  const petDetails = post.petDetails as Record<string, any> | undefined;
  const petTypeLabel = post.petCategoryDetails?.petCategory || post.postType || "Pet";
  const petAvatarUrl = getAnimalAvatarUrl(petTypeLabel);
  const petDetailItems = getPetDetailsItems(petDetails);

  const petDisplayName =
    typeof petDetails?.name === "string" && petDetails.name.trim()
      ? petDetails.name.trim()
      : petTypeLabel;
  const toUrl = (p?: string | null) =>
    p && p.startsWith("http")
      ? p
      : `${IMAGE_BASE_URL.replace(/\/$/, "")}/${(p || "").replace(/^\//, "")}`;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
          {post.title}
          {post.isFeatured && (
            <span className="bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded">
              Featured
            </span>
          )}
        </h1>
        {location && (
          <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4" /> {location}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          {postedDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Posted {postedDate}
            </span>
          )}
          <span className="inline-flex items-center gap-1 capitalize">
            <PawPrint className="h-4 w-4" /> {postTypeLabelMap[post.postType] || post.postType}
          </span>
          {post.petCategoryDetails?.petCategory && (
            <span className="inline-flex items-center gap-1">
              <BadgeCheck className="h-4 w-4" />{" "}
              {post.petCategoryDetails.petCategory}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {primary ? (
            <div className="relative w-full aspect-video rounded overflow-hidden bg-gray-100">
              <Image
                src={toUrl(primary)}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="flex items-center justify-center aspect-video w-full rounded bg-gray-100 text-gray-400">
              <PawPrint className="h-12 w-12" />
            </div>
          )}
          {rest.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {rest.map((p, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded overflow-hidden bg-gray-100"
                >
                  <Image
                    src={toUrl(p)}
                    alt={`${title} ${i + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          <section className="space-y-2">
            <Card className="border border-border/60 bg-card/90 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
                  {post.description || "No description provided."}
                </p>
              </CardContent>
            </Card>
          </section>

          {petDetailItems.length > 0 && (
            <section className="space-y-3">
              <Card className="border border-border/60 bg-card/90 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                        <AvatarImage src={petAvatarUrl} alt={petTypeLabel} />
                        <AvatarFallback>{petTypeLabel.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">Pet Details</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {petDisplayName}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{petTypeLabel}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {petDetailItems.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg border border-border/70 bg-background/70 p-3"
                      >
                        <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
                          {item.label}
                        </div>
                        <div className="mt-1 text-sm font-medium text-foreground">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
        <aside className="space-y-6">
          <div className="p-4 rounded border border-muted bg-card shadow-sm transition-shadow transition-transform duration-200 hover:shadow-md hover:-translate-y-0.5 space-y-2">
            <div className="text-2xl font-semibold">
              {post.currency || "INR"} {post.price ?? "—"}
            </div>
            {postedDate && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Posted {postedDate}
              </div>
            )}
            {location && (
              <div className="text-sm flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4" /> {location}
              </div>
            )}
          </div>
          {post.ownerDetails && (
            <div className="p-4 rounded border border-muted bg-card shadow-sm transition-shadow transition-transform duration-200 hover:shadow-md hover:-translate-y-0.5 space-y-2">
              <h2 className="text-lg font-semibold">Owner</h2>
              {post.ownerDetails.name && (
                <p className="text-sm">{post.ownerDetails.name}</p>
              )}
              {post.ownerDetails.phone && (
                <a
                  href={`tel:${post.ownerDetails.phone}`}
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <Phone className="h-4 w-4" /> {post.ownerDetails.phone}
                </a>
              )}
              {post.ownerDetails.email && (
                <a
                  href={`mailto:${post.ownerDetails.email}`}
                  className="block text-xs text-gray-500 hover:underline"
                >
                  {post.ownerDetails.email}
                </a>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
