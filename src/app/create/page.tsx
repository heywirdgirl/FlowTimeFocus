import { CreateCycleForm } from "@/components/app/create-cycle-form";
import { Footer } from "@/components/app/footer";
import { Header } from "@/components/app/header";
import { CycleProvider } from "@/contexts/cycle-context";
import { SettingsProvider } from "@/contexts/settings-context";
import { TimerProvider } from "@/contexts/timer-context";

export default function CreateCyclePage() {
  return (
    <SettingsProvider>
      <CycleProvider>
        <TimerProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto max-w-4xl px-4 py-8 md:py-12">
                <CreateCycleForm />
            </main>
            <Footer />
          </div>
        </TimerProvider>
      </CycleProvider>
    </SettingsProvider>
  );
}
