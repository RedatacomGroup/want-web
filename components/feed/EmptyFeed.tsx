export function EmptyFeed({ onRefresh }: { onRefresh: () => void }) {
  return (
    <section className="empty-feed">
      <span className="eyebrow">YOU&apos;RE CAUGHT UP</span>

      <h2>Nothing left to judge.</h2>

      <p>
        Your feed currently has no unseen desires on this surface.
      </p>

      <button
        className="button"
        type="button"
        onClick={onRefresh}
      >
        Check again
      </button>
    </section>
  );
}