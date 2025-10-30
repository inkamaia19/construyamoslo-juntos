import { useEffect, useState } from "react";
import FixedHeader from "@/components/FixedHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOnboardingSession } from "@/hooks/useOnboardingSession";
import { useNavigate } from "react-router-dom";

const Parent = () => {
  const navigate = useNavigate();
  const { getSession, updateSession } = useOnboardingSession();
  const [email, setEmail] = useState("");
  const [context, setContext] = useState("");
  const [consent, setConsent] = useState(false);
  const [emailValid, setEmailValid] = useState(true);

  useEffect(() => {
    const load = async () => {
      const s = await getSession();
      if (s?.parent_email) setEmail(String(s.parent_email));
      if (s?.parent_context) setContext(String(s.parent_context));
    };
    load();
  }, []);

  const validateEmail = (val: string) => /.+@.+\..+/.test(val);
  useEffect(() => {
    setEmailValid(email.length === 0 || validateEmail(email));
  }, [email]);

  const canContinue = validateEmail(email.trim()) && consent;

  const handleContinue = async () => {
    await updateSession({ parent_email: email.trim(), parent_context: context.trim() });
    navigate("/child", { replace: true });
  };

  return (
    <div className="min-h-screen p-6 pt-24 pb-40 animate-fade-in">
      <FixedHeader currentStep={1} totalSteps={6} backTo="/intro" title="Datos del padre/madre" />
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl md:text-5xl font-bold">Para acompañarte mejor</h2>
          <p className="text-muted-foreground">Cuéntanos cómo contactarte y qué buscas</p>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email de contacto</Label>
            <Input
              id="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={!emailValid ? "border-destructive" : undefined}
            />
            {!emailValid && (
              <p className="text-xs text-destructive">Ingresa un email válido.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="context">¿Qué te gustaría lograr?</Label>
            <Textarea id="context" placeholder="Cuéntanos brevemente objetivos, horarios o expectativas" value={context} onChange={(e) => setContext(e.target.value)} />
          </div>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
            />
            <span>
              Acepto ser contactada/o para recibir apoyo y sugerencias personalizadas.
            </span>
          </label>
        </div>

        <div className="p-6">
          <div className="max-w-sm sm:max-w-md mx-auto">
            <Button disabled={!canContinue} size="lg" className="w-full rounded-full text-base sm:text-lg md:text-xl py-4 sm:py-6" onClick={handleContinue}>
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parent;
