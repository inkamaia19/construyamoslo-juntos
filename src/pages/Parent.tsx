import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import OnboardingProgress from "@/components/OnboardingProgress";
import { useSession } from "@/hooks/SessionContext"; // <- CAMBIO IMPORTANTE

const Parent = () => {
  const navigate = useNavigate();
  // Ahora usamos el hook del contexto, que nos da el estado COMPARTIDO.
  const { getSession, updateSession } = useSession(); // <- CAMBIO IMPORTANTE
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadSessionData = async () => {
      const session = await getSession();
      if (session) {
        setFirstName(session.parent_first_name || "");
        setEmail(session.parent_email || "");
      }
    };
    loadSessionData();
  }, [getSession]);

  const emailValid = /.+@.+\..+/.test(email);
  const canContinue = firstName.trim().length > 1 && email.trim().length > 5 && emailValid;

  const handleContinue = async () => {
    if (!canContinue) return;
    await updateSession({
      parent_first_name: firstName.trim(),
      parent_last_name: firstName.trim(),
      parent_email: email.trim(),
    });
    navigate("/child", { replace: true });
  };

  // Ya no necesitamos la comprobación de 'isLoading' aquí,
  // porque el SessionProvider no renderizará esta página hasta que la carga haya terminado.

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start gap-4 bg-background p-4 pt-8 md:pt-12 animate-fade-in">
      <OnboardingProgress currentStep={1} totalSteps={6} backTo="/" />
      <Card className="w-full max-w-md flex flex-1 flex-col shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Hola, empecemos por ti</CardTitle>
          <CardDescription>Solo necesitamos tu nombre y email para empezar.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center gap-4">
          <Input
            type="text"
            placeholder="Tu nombre"
            className="h-14 text-lg text-center rounded-full"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Tu email de contacto"
            className="h-14 text-lg text-center rounded-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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