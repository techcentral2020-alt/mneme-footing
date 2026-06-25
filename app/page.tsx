import { ForensicCanvas } from "@/src/components/ForensicCanvas";
import { PerspectiveSlider } from "@/src/components/PerspectiveSlider";
import { TransparencyToggle } from "@/src/components/TransparencyToggle";
import { truckerPathPayload } from "@/src/data/truckerPath";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <header className="shrink-0 bg-surface/80 px-6 py-4 backdrop-blur-sm">
        <PerspectiveSlider />
      </header>

      <main className="min-h-0 flex-1 overflow-hidden px-6 py-5">
        <ForensicCanvas payload={truckerPathPayload} />
      </main>

      <TransparencyToggle />
    </div>
  );
}
