import { getCalendar } from "@/lib/calendar";
import { Filter, getLessons, Lesson } from "@/lib/lessons";
import { NextRequest } from "next/server";

export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const searchParams = request.nextUrl.searchParams;

  const filters: Filter[] = [];
  searchParams.forEach((value, key) => {
    filters.push({
      key: key.replace("!", "") as keyof Lesson,
      value: value,
      inverted: key.endsWith("!"),
    });
  });

  return new Response(getCalendar(await getLessons(id, filters)).toString());
}
