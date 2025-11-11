import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import OnboardingProgress from "@/components/OnboardingProgress";
import { useSession } from "@/hooks/SessionContext";

const timeOptions = [
  { id: "short", label: "Poco (15 min)" },
  { id: "medium", label: "Algo (30 min)" },
  { id: "long", label: "Mucho (+30 min)" },
];
const ageOptions = [3, 4, 5];

const Child = () => {
  const navigate = useNavigate();
  const { getSession, updateSession } = useSession();
  const [age, setAge] = useState<number | null>(null);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const loadSessionData = async () => {
      const session = await getSession();
      if (session) {
        setAge(session.child_age ? Number(session.child_age) : null);
        setTime(session.time_available || "");
      }
    };

    loadSessionData();
  }, [getSession]);

  const canContinue = age !== null && time !== "";

  const handleContinue = async () => {
    if (!canContinue) return;
    await updateSession({
      child_age: age,
      time_available: time,
    });
    navigate("/materials", { replace: true });
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start gap-4 bg-background p-4 pt-8 md:pt-12 animate-fade-in">
      <OnboardingProgress currentStep={2} totalSteps={6} backTo="/parent" />
      <Card className="w-full max-w-md flex flex-1 flex-col shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Sobre tu explorador</CardTitle>
          <CardDescription>Esto nos ayuda a elegir el ritmo perfecto.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center gap-8 text-center">
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">¿Qué edad tiene?</h3>
            <div className="flex justify-center gap-3">
              {ageOptions.map(a => (
                <Button key={a} variant={age === a ? "default" : "outline"} className="rounded-full h-16 w-16 text-xl" onClick={() => setAge(a)}>{a}</Button>
              ))}
              <Button variant={age && !ageOptions.includes(age) ? "default" : "outline"} className="rounded-full h-16 w-16 text-xl" onClick={() => setAge(6)}>+5</Button>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">¿Cuánto tiempo tienen hoy?</h3>
            <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
              {timeOptions.map(t => (
                <Button key={t.id} variant={time === t.id ? "default" : "outline"} className="rounded-full h-14 px-6 text-base" onClick={() => setTime(t.id)}>{t.label}</Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            disabled={!canContinue}
            size="lg"
            className="w-full h-14 text-xl rounded-full bg-secondary text-foreground"
            style={{ backgroundColor: "#FF8A6C" }}
            onClick={handleContinue}
          >
            Continuar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Child;