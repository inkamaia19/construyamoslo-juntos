import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import OnboardingProgress from "@/components/OnboardingProgress";
import { useSession } from "@/hooks/SessionContext";

const Parent = () => {
  const navigate = useNavigate();
  const { getSession, updateSession } = useSession();
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const loadSessionData = async () => {
      const session = await getSession();
      if (session) {
        setFirstName(session.parent_first_name || "");
        setPhone(session.parent_phone || "");
      }
    };
    loadSessionData();
  }, [getSession]);

  // Validación simple: al menos 5 dígitos para el teléfono.
  // Puedes hacerla más estricta si lo necesitas.
  const phoneValid = /^\d{5,}$/.test(phone.replace(/\s/g, ''));
  const canContinue = firstName.trim().length > 1 && phoneValid;

  const handleContinue = async () => {
    if (!canContinue) return;
    await updateSession({
      parent_first_name: firstName.trim(),
      parent_phone: phone.trim(),
      // Opcional: podrías guardar el email como vacío o nulo si lo tenías antes
      // parent_email: null, 
    });
    navigate("/child", { replace: true });
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start gap-4 bg-background p-4 pt-8 md:pt-12 animate-fade-in">
      <OnboardingProgress currentStep={1} totalSteps={6} backTo="/" />
      <Card className="w-full max-w-md flex flex-1 flex-col shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Hola, empecemos por ti</CardTitle>
          <CardDescription>Necesitamos tu nombre y WhatsApp para continuar.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center gap-4">
          <Input
            type="text"
            placeholder="Tu nombre"
            className="h-14 text-lg text-center rounded-full"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="name"
          />
          <Input
            type="tel"
            placeholder="Tu número de WhatsApp"
            className="h-14 text-lg text-center rounded-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
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

export default Parent;