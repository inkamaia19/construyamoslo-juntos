import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import OnboardingProgress from "@/components/OnboardingProgress";
import { useSession } from "@/hooks/SessionContext";
import { Loader2 } from "lucide-react";

const Parent = () => {
  const navigate = useNavigate();
  const { getSession, updateSession } = useSession();
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  // La validación ahora es más estricta: exactamente 9 dígitos.
  const phoneValid = /^\d{9}$/.test(phone);
  const canContinue = firstName.trim().length > 1 && phoneValid;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Usamos una expresión regular para eliminar cualquier cosa que no sea un dígito.
    const numericValue = value.replace(/\D/g, '');
    // Limitamos la longitud a 9 caracteres.
    setPhone(numericValue.slice(0, 9));
  };

  const handleContinue = () => {
    if (!canContinue || isSaving) return;
    setIsSaving(true);
    navigate("/child", { replace: true });

    updateSession({
      parent_first_name: firstName.trim(),
      parent_phone: phone.trim(),
    }).finally(() => {
      setIsSaving(false); 
    });
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
            type="tel" // 'tel' es semánticamente correcto y ayuda a los móviles a mostrar el teclado numérico
            placeholder="Tu número de WhatsApp (9 dígitos)"
            className="h-14 text-lg text-center rounded-full"
            value={phone}
            onChange={handlePhoneChange} // Usamos la nueva función de manejo
            autoComplete="tel"
          />
        </CardContent>
        <CardFooter>
          <Button
            disabled={!canContinue || isSaving}
            size="lg"
            className="w-full h-14 text-xl rounded-full bg-secondary text-foreground"
            style={{ backgroundColor: "#FF8A6C" }}
            onClick={handleContinue}
          >
            {isSaving ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              "Continuar"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Parent;