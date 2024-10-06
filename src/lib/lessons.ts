import * as cheerio from "cheerio";

export type LessonBlock = {
  from: [number, number];
  to: [number, number];
};

export type Lesson = {
  name: string;
  type: string;
  teacher: string;
  date: string[];
  block: LessonBlock;
  data: string;
};

const blocks: { [key: string]: LessonBlock } = {
  "1": { from: [8, 0], to: [9, 35] },
  "2": { from: [9, 50], to: [11, 25] },
  "3": { from: [11, 40], to: [13, 15] },
  "4": { from: [13, 30], to: [15, 5] },
  "5": { from: [15, 45], to: [17, 20] },
  "6": { from: [17, 35], to: [19, 10] },
  "7": { from: [19, 25], to: [21, 0] },
};

export type Filter = {
  key: keyof Lesson;
  value: string;
  inverted: boolean;
};

export async function getLessons(
  id: string,
  filters: Filter[]
): Promise<Lesson[]> {
  const URL = `https://planzajec.wcy.wat.edu.pl/pl/rozklad?date=1727647200&grupa_id=${id}`;

  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: { "Content-Type": "text/html" },
    });

    const data = await response.text();
    const $ = cheerio.load(data);

    const lessons: Lesson[] = [];

    $("div.lesson").each((index, element) => {
      const date = $(element).find("span.date").text().trim().split("_");
      const blockId = $(element)
        .find("span.block_id")
        .text()
        .trim()
        .replace("block", "");
      const block = blocks[blockId];
      const name = $(element).find("span.name").text();
      const info = $(element).find("span.info").text().trim().split("-");

      const lessonName = info[0].trim();
      const lessonType = info[1].trim().replace("(", "").replace(")", "");
      const teacher = info.length > 2 ? info[2] : "";

      const lesson: Lesson = {
        name: lessonName,
        type: lessonType,
        teacher,
        date,
        block,
        data: name,
      };

      let pass = true;
      for (const filter of filters) {
        if (filter.inverted) {
          if (
            lesson[filter.key].toString().toLowerCase() ==
            filter.value.toLowerCase()
          ) {
            pass = false;
            break;
          }
        } else {
          if (
            lesson[filter.key].toString().toLowerCase() !=
            filter.value.toLowerCase()
          ) {
            pass = false;
            break;
          }
        }
      }

      if (pass) {
        lessons.push(lesson);
      }
    });

    return lessons;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
}
