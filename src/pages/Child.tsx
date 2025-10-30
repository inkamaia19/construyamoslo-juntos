import { useState, useEffect } from "react";
import FixedHeader from "@/components/FixedHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingSession } from "@/hooks/useOnboardingSession";
import { useNavigate } from "react-router-dom";

const quickAges = [3, 4, 5];
const timeOptions = [
  { id: "short", label: "Corto (≤15m)" },
  { id: "medium", label: "Medio (≤30m)" },
  { id: "long", label: "Largo (30m+)" },
];

const Child = () => {
  const navigate = useNavigate();
  const { getSession, updateSession } = useOnboardingSession();
  const [age, setAge] = useState<number | null>(null);
  const [customAge, setCustomAge] = useState<string>("");
  const [showCustomAge, setShowCustomAge] = useState(false);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const s = await getSession();
      if (s?.child_age) setAge(Number(s.child_age));
      if (s?.time_available) setTime(String(s.time_available));
    };
    load();
  }, []);

  const chooseAge = async (val: number) => {
    setAge(val);
    await updateSession({ child_age: val });
  };

  const applyCustomAge = async () => {
    const n = Number(customAge);
    if (!isNaN(n) && n > 0) {
      await chooseAge(n);
      setShowCustomAge(false);
    }
  };

  const chooseTime = async (val: string) => {
    setTime(val);
    await updateSession({ time_available: val });
  };

  const canContinue = age !== null && time !== "";

  return (
    <div className="min-h-screen p-6 pt-28 pb-40 animate-fade-in">
      <FixedHeader currentStep={1} totalSteps={5} backTo="/" title="Datos del niño" />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold">Conozcamos un poco a tu explorador</h2>
          <p className="text-lg text-muted-foreground">Así afinamos las propuestas y el ritmo</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-semibold">Edad</h3>
            <div className="flex gap-2 flex-wrap">
              {quickAges.map((a) => (
                <Button key={a} variant={age === a ? "default" : "outline"} className="rounded-full" onClick={() => chooseAge(a)}>
                  +{a}
                </Button>
              ))}
              <Button variant={showCustomAge ? "default" : "outline"} className="rounded-full" onClick={() => setShowCustomAge((v) => !v)}>
                Más…
              </Button>
            </div>
            {showCustomAge && (
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input type="number" min={1} max={10} placeholder="Edad en años" value={customAge} onChange={(e) => setCustomAge(e.target.value)} />
                </div>
                <Button onClick={applyCustomAge} className="rounded-full">Listo</Button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Tiempo disponible</h3>
            <div className="flex gap-2 flex-wrap">
              {timeOptions.map((t) => (
                <Button key={t.id} variant={time === t.id ? "default" : "outline"} className="rounded-full" onClick={() => chooseTime(t.id)}>
                  {t.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-sm sm:max-w-md mx-auto">
            <Button disabled={!canContinue} size="lg" className="w-full whitespace-normal break-words text-base sm:text-lg md:text-xl leading-snug py-4 px-5 sm:py-6 sm:px-8 rounded-full justify-center text-center" onClick={() => navigate("/materials", { replace: true })}>
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Child;
