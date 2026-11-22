import { diaryPreview, DIARY_PREVIEW_LENGTH } from "./diaryPreview";

test("keeps short formatted content and image-only entries unchanged", () => {
  expect(diaryPreview(`<p>${"a".repeat(DIARY_PREVIEW_LENGTH)}</p>`)).toBeNull();
  expect(diaryPreview('<p><img src="image.png" alt="Karte"></p>')).toBeNull();
});

test("truncates rich text without breaking markup or splitting Unicode characters", () => {
  const html = `<p><strong>${"a".repeat(599)}🐉</strong></p><p><a href="/later">Später</a></p>`;
  const preview = document.createElement("div");
  preview.innerHTML = diaryPreview(html);
  expect(preview.textContent).toBe(`${"a".repeat(599)}🐉…`);
  expect(preview.querySelector("strong")).not.toBeNull();
  expect(preview.querySelector("a")).toBeNull();
});

test("avoids cutting a word in the middle when there is a nearby word boundary", () => {
  const preview = document.createElement("div");
  preview.innerHTML = diaryPreview(`<p>${"a".repeat(590)} Drache erwartet euch.</p>`);
  expect(preview.textContent).toBe(`${"a".repeat(590)} Drache…`);
});
