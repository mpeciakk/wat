import { getCalendar } from "@/lib/calendar";
import { getLessons } from "@/lib/lessons";

export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  return new Response(getCalendar(await getLessons(id)).toString());
}
