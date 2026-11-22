import React from "react";
import { formatDiaryDate } from "./diaryDate";

function formatTime(date) {
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NoteDate({ createdAt, updatedAt }) {
  const dateText = formatDiaryDate(createdAt);
  if (!dateText) {
    return <span className="diary-note__date">Ohne Datum</span>;
  }

  const date = new Date(createdAt);
  const updatedDateText = formatDiaryDate(updatedAt);
  const updatedDate = updatedDateText ? new Date(updatedAt) : null;

  return (
    <div className="diary-note__timestamps">
      <span className="diary-note__date">
        Erstellt: <time dateTime={date.toISOString()}>{dateText} · {formatTime(date)}</time>
      </span>
      {updatedDate && updatedDate.getTime() > date.getTime() && (
        <span className="diary-note__date">
          Zuletzt geändert: <time dateTime={updatedDate.toISOString()}>{updatedDateText} · {formatTime(updatedDate)}</time>
        </span>
      )}
    </div>
  );
}

export default NoteDate;
