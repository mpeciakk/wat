import ical from "ical-generator";
import { Lesson } from "./scrapper";

export function getCalendar(lessons: Lesson[]) {
  const cal = ical({
    prodId: {
      company: "peciak.xyz",
      product: "wat.peciak.xyz",
    },
    timezone: "Europe/Warsaw",
  });

  lessons.forEach((lesson) => {
    const start = new Date(
      parseInt(lesson.date[0]),  // year
      parseInt(lesson.date[1]) - 1,  // month (0-based)
      parseInt(lesson.date[2]),  // day
      lesson.block.from[0],  // hours
      lesson.block.from[1],  // minutes
      0  // seconds
    );

    const end = new Date(
      parseInt(lesson.date[0]),  // year
      parseInt(lesson.date[1]) - 1,  // month (0-based)
      parseInt(lesson.date[2]),  // day
      lesson.block.to[0],  // hours
      lesson.block.to[1],  // minutes
      0  // seconds
    );

    cal.createEvent({
      start: start,
      end: end,
      summary: lesson.name,
      description: `${lesson.type}\n${lesson.teacher}\n\n${lesson.data}`,
    });
  });

  return cal;
}
