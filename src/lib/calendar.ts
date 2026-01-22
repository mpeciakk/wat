import ical from "ical-generator";
import { DateTime } from "luxon";
import type { Lesson } from "./scrapper";

export function getCalendar(lessons: Lesson[]) {
	const cal = ical({
		prodId: {
			company: "peciak.xyz",
			product: "wat.peciak.xyz",
		},
	});

	lessons.forEach((lesson) => {
		const start = DateTime.fromObject(
			{
				year: parseInt(lesson.date[0], 10),
				month: parseInt(lesson.date[1], 10),
				day: parseInt(lesson.date[2], 10),
				hour: lesson.block.from[0],
				minute: lesson.block.from[1],
			},
			{ zone: "Europe/Warsaw" },
		);

		const end = DateTime.fromObject(
			{
				year: parseInt(lesson.date[0], 10),
				month: parseInt(lesson.date[1], 10),
				day: parseInt(lesson.date[2], 10),
				hour: lesson.block.to[0],
				minute: lesson.block.to[1],
			},
			{ zone: "Europe/Warsaw" },
		);

		cal.createEvent({
			start: start.toJSDate(),
			end: end.toJSDate(),
			summary: lesson.name,
			description: `${lesson.type}\n${lesson.teacher}\n\n${lesson.data}`,
		});
	});

	return cal;
}
