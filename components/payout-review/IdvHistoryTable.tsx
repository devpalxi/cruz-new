type IdvRow = { country: string; dateTime: string; result: string };

// A passed check is shown in the success tone, in capitals, as on the live site
const isPass = (result: string) => result.trim().toLowerCase() === "pass";

const headers = ["Country + Document + IDV", "Date & Time", "Result"];

type IdvHistoryTableProps = {
  rows: IdvRow[];
  // CRP-186: shown when this payout re-used an earlier identity check instead of running a new one
  reusedNote?: string;
};

export default function IdvHistoryTable({ rows, reusedNote }: IdvHistoryTableProps) {
  return (
    <div className="rounded-xl bg-table-head px-[1.25rem] py-[1.5rem]">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-line-soft text-[0.8125rem] font-semibold uppercase tracking-wide text-label">
            <th className="w-[47%] pb-3 font-semibold">{headers[0]}</th>
            <th className="w-[37%] pb-3 font-semibold">{headers[1]}</th>
            <th className="pb-3 font-semibold">{headers[2]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.dateTime} className="text-base text-ink">
              <td className="pt-5">{row.country}</td>
              <td className="pt-5">{row.dateTime}</td>
              <td className={`pt-5 ${isPass(row.result) ? "font-semibold uppercase text-success-ink" : "text-muted"}`}>
                {row.result}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {reusedNote && <p className="mt-5 border-t border-line-soft pt-4 text-base text-subtle">{reusedNote}</p>}
    </div>
  );
}
