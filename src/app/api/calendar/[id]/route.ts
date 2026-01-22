import type { NextRequest } from "next/server";
import { getCalendar } from "@/lib/calendar";
import { type Filter, getLessons, type Lesson } from "@/lib/scrapper";

export const revalidate = 0;

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
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

	return new Response(getCalendar(await getLessons(id, filters)).toString(), {
		headers: {
			"Content-Type": "text/calendar; charset=utf-8",
			"Content-Disposition": 'inline; filename="calendar.ics"',
			"Cache-Control": "no-cache, no-store, must-revalidate",
			Pragma: "no-cache",
			Expires: "0",
		},
	});
}
