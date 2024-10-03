import ical from "ical-generator";
import { Lesson } from "./lessons";

export function getCalendar(lessons: Lesson[]) {
  const cal = ical({
    prodId: {
      company: "peciak.xyz",
      product: "wat.peciak.xyz",
    },
    timezone: "Europe/Warsaw",
  });

  lessons.forEach((lesson) => {
    const start = new Date();
    start.setHours(lesson.block.from[0]);
    start.setMinutes(lesson.block.from[1]);
    start.setSeconds(0);
    start.setFullYear(parseInt(lesson.date[0]));
    start.setMonth(parseInt(lesson.date[1]) - 1);
    start.setDate(parseInt(lesson.date[2]));

    const end = new Date();
    end.setHours(lesson.block.to[0]);
    end.setMinutes(lesson.block.to[1]);
    end.setSeconds(0);
    end.setFullYear(parseInt(lesson.date[0]));
    end.setMonth(parseInt(lesson.date[1]) - 1);
    end.setDate(parseInt(lesson.date[2]));

    cal.createEvent({
      start: start,
      end: end,
      summary: lesson.name,
      description: `${lesson.type}\n${lesson.teacher}\n\n${lesson.data}`,
    });
  });

  return cal;
}
