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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [emailValid, setEmailValid] = useState(true);

  useEffect(() => {
    const load = async () => {
      const s = await getSession();
      if (s?.parent_first_name) setFirstName(String(s.parent_first_name));
      if (s?.parent_last_name) setLastName(String(s.parent_last_name));
      if (s?.parent_phone) setPhone(String(s.parent_phone));
      if (s?.parent_email) setEmail(String(s.parent_email));
    };
    load();
  }, []);

  const validateEmail = (val: string) => /.+@.+\..+/.test(val);
  useEffect(() => {
    setEmailValid(email.length === 0 || validateEmail(email));
  }, [email]);

  const phoneValid = phone.length === 0 || /[0-9+\-()\s]{7,}/.test(phone);
  const canContinue = firstName.trim().length > 1 && lastName.trim().length > 1 && phoneValid && validateEmail(email.trim()) && consent;

  const handleContinue = async () => {
    await updateSession({
      parent_first_name: firstName.trim(),
      parent_last_name: lastName.trim(),
      parent_phone: phone.trim(),
      parent_email: email.trim(),
    });
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
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first">Nombre</Label>
              <Input id="first" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last">Apellido</Label>
              <Input id="last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" placeholder="Ej: +51 900 000 000" value={phone} onChange={(e) => setPhone(e.target.value)} className={!phoneValid ? "border-destructive" : undefined} />
            {!phoneValid && <p className="text-xs text-destructive">Ingresa un teléfono válido.</p>}
          </div>
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
