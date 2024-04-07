import type { Story } from "~/commons/types";

const STORY_DB_NAME = "stories";
const STORY_STORE_NAME = "stories";
const STORY_DB_VERSION = 1;

let storyDb: IDBDatabase | null;

async function openStoryDb(): Promise<IDBDatabase> {
	if (storyDb) {
		return storyDb;
	}

	return new Promise((resolve, reject) => {
		const storyDbRequest = indexedDB.open(STORY_DB_NAME, STORY_DB_VERSION);

		storyDbRequest.onerror = (error) => {
			console.error("Failed to initialize database", error);
			reject(error);
		};

		storyDbRequest.onupgradeneeded = () => {
			console.debug("Ugrading database...");
			const db = storyDbRequest.result;

			db.createObjectStore(STORY_STORE_NAME);
		};

		storyDbRequest.onsuccess = (event) => {
			console.debug("Database opened successfully");
			storyDb = storyDbRequest.result;
			resolve(storyDb);
		};
	});
}

function storyKey(id: Story["id"]) {
	return `story:${id}`;
}

export async function storyCreate(story: Omit<Story, "id">): Promise<Story> {
	const createdStory: Story = {
		...story,
		id: Date.now(),
	};

	const db = await openStoryDb();
	const store = db
		.transaction(STORY_STORE_NAME, "readwrite")
		.objectStore(STORY_STORE_NAME);

	return new Promise((resolve, reject) => {
		const request = store.add(createdStory, storyKey(createdStory.id));

		request.onerror = (error) => {
			console.error("Failed to create story", error);
			reject(error);
		};

		request.onsuccess = () => {
			console.debug(`Story with ID=${createdStory.id} created`);
			resolve(createdStory);
		};
	});
}

export async function storyFindById(id: Story["id"]): Promise<Story | null> {
	const db = await openStoryDb();
	const store = db
		.transaction(STORY_STORE_NAME, "readwrite")
		.objectStore(STORY_STORE_NAME);

	return new Promise((resolve, reject) => {
		const request = store.get(storyKey(id));

		request.onerror = (error) => {
			console.error("Failed to create story", error);
			reject(error);
		};

		request.onsuccess = () => {
			resolve(request.result || null);
		};
	});
}

export async function storyUpdate(
	storyData: Pick<Story, "id"> & Partial<Story>,
): Promise<Story | null> {
	const story = await storyFindById(storyData.id);
	if (!story) {
		return null;
	}

	const updatedStory: Story = {
		...story,
		...storyData,
	};

	const db = await openStoryDb();
	const store = db
		.transaction(STORY_STORE_NAME, "readwrite")
		.objectStore(STORY_STORE_NAME);

	return new Promise((resolve, reject) => {
		const request = store.put(updatedStory, storyKey(updatedStory.id));

		request.onerror = (error) => {
			console.error("Failed to create story", error);
			reject(error);
		};

		request.onsuccess = () => {
			console.debug(`Story with ID=${updatedStory.id} updated`);
			resolve(updatedStory);
		};
	});
}
