import { Calendar } from "@/components/calendar/Calendar";

export default function HomePage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-[#F6F8FB] px-6 py-6 text-gray-900">
      <div className="mx-auto max-w-7xl">
        <Calendar />
      </div>
    </main>
  );
}
