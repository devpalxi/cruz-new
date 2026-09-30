// Static — this prototype's mock tables are small enough to fit on one page.
export default function Pagination() {
  return (
    <div className="mt-8 flex justify-center">
      <div className="flex overflow-hidden rounded-xl border border-line-soft bg-field">
        <button type="button" disabled className="px-6 py-3 text-base text-muted disabled:cursor-not-allowed">
          Previous
        </button>
        <button
          type="button"
          disabled
          className="border-l border-line-soft px-6 py-3 text-base text-muted disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
