import { LoginRequired } from "@/components/auth/LoginRequired";
import { fetchPostById } from "@/lib/api";
import { IMAGE_BASE_URL } from "@/lib/constants";
import { Post } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { BadgeCheck, Calendar, MapPin, PawPrint, Phone } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: { id: string };
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

  const photos = post.photos || [];
  const primary = photos[0];
  const rest = photos.slice(1);
  const title = post.title; // stable non-null after earlier notFound guard
  const toUrl = (p: string) =>
    p.startsWith("http")
      ? p
      : `${IMAGE_BASE_URL.replace(/\/$/, "")}/${p.replace(/^\//, "")}`;

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
            <PawPrint className="h-4 w-4" /> {post.postType}
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
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
              {post.description || "No description provided."}
            </p>
          </section>

          {post.petDetails && (
            <section className="space-y-2">
              <h2 className="text-lg font-semibold">Pet Details</h2>
              <ul className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                {post.petDetails.name && (
                  <li>
                    <span className="font-medium">Name:</span>{" "}
                    {post.petDetails.name}
                  </li>
                )}
                {post.petDetails.age !== undefined && (
                  <li>
                    <span className="font-medium">Age:</span>{" "}
                    {post.petDetails.age} months
                  </li>
                )}
                {post.petDetails.sex && (
                  <li>
                    <span className="font-medium">Sex:</span>{" "}
                    {post.petDetails.sex}
                  </li>
                )}
                {post.petDetails.weight !== undefined && (
                  <li>
                    <span className="font-medium">Weight:</span>{" "}
                    {post.petDetails.weight} kg
                  </li>
                )}
                {post.petDetails.isVaccinationDone !== undefined && (
                  <li>
                    <span className="font-medium">Vaccinated:</span>{" "}
                    {post.petDetails.isVaccinationDone ? "Yes" : "No"}
                  </li>
                )}
                {post.petDetails.knowEssentialCommands !== undefined && (
                  <li>
                    <span className="font-medium">Knows Commands:</span>{" "}
                    {post.petDetails.knowEssentialCommands ? "Yes" : "No"}
                  </li>
                )}
                {post.petDetails.breedDetails?.length && (
                  <li className="col-span-full">
                    <span className="font-medium">Breeds:</span>{" "}
                    {post.petDetails.breedDetails
                      .map((b) => b.name)
                      .filter(Boolean)
                      .join(", ")}
                  </li>
                )}
              </ul>
            </section>
          )}
        </div>
        <aside className="space-y-6">
          <div className="p-4 rounded border space-y-2">
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
            <div className="p-4 rounded border space-y-2">
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
