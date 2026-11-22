import React from "react";
import { formatDiaryDate } from "./diaryDate";

function NoteDate({ createdAt }) {
  const dateText = formatDiaryDate(createdAt);
  if (!dateText) {
    return <span className="diary-note__date">Ohne Datum</span>;
  }

  const date = new Date(createdAt);
  const timeText = date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <time className="diary-note__date" dateTime={date.toISOString()}>
      {dateText} · {timeText}
    </time>
  );
}

export default NoteDate;
