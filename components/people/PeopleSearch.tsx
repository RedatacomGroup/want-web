"use client";

import { FormEvent, useState } from "react";

type Props = {
  value: string;
  searching: boolean;
  onSearch: (value: string) => Promise<void>;
};

export function PeopleSearch({
  value,
  searching,
  onSearch,
}: Props) {
  const [input, setInput] = useState(value);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const clean = input.trim();

    if (clean.length < 2) {
      return;
    }

    void onSearch(clean);
  }

  return (
    <form
      className="people-search"
      onSubmit={submit}
    >
      <label htmlFor="people-query">
        Start Looking
      </label>

      <div>
        <input
          id="people-query"
          name="query"
          type="search"
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          placeholder="username or display name"
          minLength={2}
          autoComplete="off"
        />

        <button
          type="submit"
          className="button"
          disabled={
            searching ||
            input.trim().length < 2
          }
        >
          {searching
            ? "Searching…"
            : "Search"}
        </button>
      </div>
    </form>
  );
}