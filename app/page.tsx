import { ForensicCanvas } from "@/src/components/ForensicCanvas";
import { PerspectiveSlider } from "@/src/components/PerspectiveSlider";
import { TransparencyToggle } from "@/src/components/TransparencyToggle";
import { truckerPathPayload } from "@/src/data/truckerPath";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border bg-surface px-4 py-3">
        <PerspectiveSlider />
      </header>

      <main className="flex-1 p-4">
        <ForensicCanvas payload={truckerPathPayload} />
      </main>

      <TransparencyToggle />
    </div>
  );
}
