import { NextResponse } from "next/server";

type GoogleReview = {
  author_name?: string;
  profile_photo_url?: string;
  rating?: number;
  relative_time_description?: string;
  text?: string;
  time?: number;
};

type PlaceDetailsResult = {
  name?: string;
  rating?: number;
  user_ratings_total?: number;
  url?: string;
  reviews?: GoogleReview[];
};

const BUSINESS_QUERY = "CARS of Novi, 24400 Novi Rd #102, Novi, MI 48375";

async function getPlaceId(apiKey: string, input: string) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
  url.searchParams.set("input", input);
  url.searchParams.set("inputtype", "textquery");
  url.searchParams.set("fields", "place_id");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: 21600 } });
  if (!res.ok) throw new Error("Failed finding place ID.");
  const data = await res.json();
  const placeId = data?.candidates?.[0]?.place_id as string | undefined;
  if (!placeId) throw new Error("No Google place found for provided business query.");
  return placeId;
}

async function getPlaceDetails(apiKey: string, placeId: string) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set(
    "fields",
    "name,rating,user_ratings_total,url,reviews"
  );
  url.searchParams.set("reviews_sort", "newest");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: 21600 } });
  if (!res.ok) throw new Error("Failed fetching Google place details.");
  const data = await res.json();
  if (data?.status !== "OK") {
    throw new Error(data?.error_message || `Google API error: ${data?.status || "unknown"}`);
  }
  return data?.result as PlaceDetailsResult | undefined;
}

export async function GET() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { success: false, message: "GOOGLE_MAPS_API_KEY is not configured." },
      { status: 500 }
    );
  }

  try {
    const configuredPlaceId = process.env.GOOGLE_PLACE_ID;
    const placeId = configuredPlaceId || (await getPlaceId(apiKey, BUSINESS_QUERY));
    const details = await getPlaceDetails(apiKey, placeId);
    const reviews = (details?.reviews || [])
      .filter((r) => (r.text || "").trim().length > 0)
      .sort((a, b) => (b.time || 0) - (a.time || 0))
      .slice(0, 6)
      .map((r) => ({
        authorName: r.author_name || "Google User",
        profilePhotoUrl: r.profile_photo_url || "",
        rating: r.rating || 5,
        relativeTime: r.relative_time_description || "",
        text: r.text || "",
      }));

    return NextResponse.json(
      {
        success: true,
        businessName: details?.name || "CARS of Novi",
        rating: details?.rating || 5,
        totalReviews: details?.user_ratings_total || reviews.length,
        placeUrl: details?.url || "",
        reviews,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

