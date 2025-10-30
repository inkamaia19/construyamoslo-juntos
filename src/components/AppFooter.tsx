import { useLocation } from "react-router-dom";

const messages: Record<string, string> = {
  child: "Estos datos ayudan a proponer actividades adecuadas a su ritmo.",
  materials: "Saber qué hay disponible nos ayuda a sugerir actividades con lo cotidiano.",
  evaluation: "Evaluar el estado permite proponer actividades seguras y alcanzables.",
  space: "El lugar define el tipo de movimiento y materiales adecuados.",
  interest: "Partimos del interés del niño para sostener la motivación y la autonomía.",
  results: "Te mostramos sugerencias basadas en tu selección.",
  activity: "Detalle de actividad con pasos y recomendaciones.",
};

const getKey = (pathname: string) => {
  if (pathname.startsWith("/child")) return "child";
  if (pathname.startsWith("/materials")) return "materials";
  if (pathname.startsWith("/evaluation")) return "evaluation";
  if (pathname.startsWith("/space")) return "space";
  if (pathname.startsWith("/interest")) return "interest";
  if (pathname.startsWith("/activity")) return "activity";
  if (pathname.startsWith("/results")) return "results";
  return "";
};

const AppFooter = () => {
  const { pathname } = useLocation();
  const key = getKey(pathname);
  const text = key ? messages[key] : "";
  if (!text) return null;
  return (
    <div id="app-footer" className="sticky bottom-0 left-0 right-0 z-20">
      <div className="max-w-4xl mx-auto px-4 pb-3">
        <div className="rounded-2xl border bg-card/60 backdrop-blur px-4 py-3 text-xs text-muted-foreground">
          <span className="font-semibold">¿Por qué te preguntamos esto?</span> {text}
        </div>
      </div>
    </div>
  );
};

export default AppFooter;
