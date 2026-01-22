import fs from "node:fs";
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
	"5": { from: [16, 0], to: [17, 35] },
	"6": { from: [17, 50], to: [19, 25] },
	"7": { from: [19, 40], to: [21, 15] },
};

export type Filter = {
	key: keyof Lesson;
	value: string;
	inverted: boolean;
};

const CACHE_DIR = "./cache";

async function fetchLessons(id: string) {
	const URL = `https://planzajec.wcy.wat.edu.pl/pl/rozklad?date=1740351600&grupa_id=${id}`;

	try {
		const response = await fetch(URL, {
			method: "GET",
			headers: { "Content-Type": "text/html" },
		});

		const data = await response.text();
		const $ = cheerio.load(data);

		const lessons: Lesson[] = [];

		$("div.lesson").each((_, element) => {
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

			lessons.push(lesson);
		});

		return lessons;
	} catch (error) {
		console.error("Error fetching lessons:", error);
		return [];
	}
}

async function getCachedLessons(id: string) {
	return JSON.parse(fs.readFileSync(`${CACHE_DIR}/${id}.json`, "utf8"));
}

async function updateCache(id: string, lessons: Lesson[]) {
	if (!fs.existsSync(CACHE_DIR)) {
		fs.mkdirSync(CACHE_DIR, { recursive: true });
	}

	fs.writeFileSync(`${CACHE_DIR}/${id}.json`, JSON.stringify(lessons, null, 2));
}

function filterLessons(lessons: Lesson[], filters: Filter[]) {
	return lessons.filter((lesson) => {
		for (const filter of filters) {
			const lessonValue = lesson[filter.key].toString().toLowerCase();
			const filterValue = filter.value.toLowerCase();

			if (filter.inverted) {
				if (lessonValue === filterValue) {
					return false;
				}
			} else {
				if (lessonValue !== filterValue) {
					return false;
				}
			}
		}

		return true;
	});
}

export async function getLessons(id: string, filters: Filter[]) {
	let lessons = await fetchLessons(id);

	if (!lessons.length) {
		lessons = await getCachedLessons(id);
	} else {
		updateCache(id, lessons);
	}

	return filterLessons(lessons, filters);
}
