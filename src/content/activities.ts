export type ActivityContent = {
  id: string;
  title: string;
  duration: string;
  age: string;
  objective: string;
  required: string[];
  optional?: string[];
  steps: string[];
  tips?: string[];
  safety?: string[];
  imageId?: string; // map to local hero by id
};

const t = (m: string) => ({
  paint: "Pinturas",
  bottles: "Botellas",
  water: "Agua",
  sticks: "Palitos",
  cardboard: "Cartón",
  scissors: "Tijeras",
  plants: "Plantas",
  toys: "Juguetes",
  fabrics: "Telas",
  flashlight: "Linterna",
}[m as keyof any] || m);

export const materialLabel = (m: string) => t(m);

export const activitiesContent: Record<string, ActivityContent> = {
  "water-colors": {
    id: "water-colors",
    title: "Explora colores con agua",
    duration: "10–20 min",
    age: "3+ años",
    objective: "Explorar mezclas y transparencias jugando con agua y color.",
    required: ["paint", "bottles", "water"],
    steps: [
      "Llena 2–3 botellas con agua.",
      "Agrega una gota de pintura a cada una y agita.",
      "Observan cómo cambia el color al mezclar contenidos.",
      "Prueben a trasvasar entre botellas para crear nuevos tonos.",
    ],
    tips: [
      "Usa una bandeja para contener derrames.",
      "Si no hay pinturas, usa colorantes o té.",
    ],
    safety: ["Supervisa el manejo de líquidos cerca de enchufes."],
    imageId: "water-colors",
  },
  "bottle-sounds": {
    id: "bottle-sounds",
    title: "Crea sonidos con botellas",
    duration: "10–15 min",
    age: "3+ años",
    objective: "Explorar ritmo y sonido con materiales cotidianos.",
    required: ["bottles", "sticks"],
    steps: [
      "Coloca las botellas vacías en fila.",
      "Golpea suavemente con los palitos para descubrir sonidos.",
      "Varíen la fuerza y el ritmo; inventen una melodía.",
    ],
    tips: ["Cambiar el nivel de agua cambia el tono."],
    safety: ["Evita golpes fuertes que rompan plástico o vidrio."],
    imageId: "bottle-sounds",
  },
  "cardboard-construction": {
    id: "cardboard-construction",
    title: "Construye con cartón",
    duration: "20–30 min",
    age: "4+ años",
    objective: "Desarrollar pensamiento espacial construyendo con formas de cartón.",
    required: ["cardboard", "scissors"],
    optional: ["paint"],
    steps: [
      "Recorta piezas (rectángulos, triángulos) con ayuda.",
      "Ensambla torres o figuras encastrando ranuras.",
      "Decoren con pintura si quieren.",
    ],
    tips: ["Usa cajas de cereales para piezas más firmes."],
    safety: ["Supervisa el uso de tijeras."],
    imageId: "cardboard-construction",
  },
  "color-mosaics": {
    id: "color-mosaics",
    title: "Mosaicos de color con papel",
    duration: "10–20 min",
    age: "3+ años",
    objective: "Explorar patrones y composición con color.",
    required: ["paint"],
    steps: [
      "Pinta pequeños recortes de papel con distintos colores.",
      "Compongan figuras pegando piezas sobre una base.",
    ],
  },
  "shadow-paint": {
    id: "shadow-paint",
    title: "Pinta sombras con linterna",
    duration: "15–25 min",
    age: "4+ años",
    objective: "Observar luz y sombra proyectando figuras.",
    required: ["flashlight", "paint"],
    steps: [
      "Apunta la linterna a un objeto para proyectar su sombra.",
      "Traza el contorno y pinta dentro con libertad.",
    ],
  },
  "bubble-music": {
    id: "bubble-music",
    title: "Música de burbujas en botellas",
    duration: "10–15 min",
    age: "3+ años",
    objective: "Explorar tonos haciendo burbujas en agua.",
    required: ["bottles", "water"],
    steps: [
      "Llena botellas con distintos niveles de agua.",
      "Sopla con una pajita para hacer burbujas y oír el tono.",
    ],
  },
  "water-paths": {
    id: "water-paths",
    title: "Caminos de agua y color",
    duration: "15–25 min",
    age: "3+ años",
    objective: "Observar el flujo del agua y mezcla de colores.",
    required: ["bottles", "paint", "sticks"],
    steps: [
      "Crea canales con cartón/palitos en una bandeja.",
      "Viertan agua coloreada y sigan los caminos.",
    ],
  },
  "nature-hunt": {
    id: "nature-hunt",
    title: "Exploración de tesoros naturales",
    duration: "15–30 min",
    age: "3+ años",
    objective: "Observar texturas y formas en elementos naturales.",
    required: ["plants", "sticks"],
    steps: [
      "Recolecten hojas, piedras y palitos en el jardín.",
      "Clasifiquen por color, tamaño o textura.",
    ],
  },
  "light-lab": {
    id: "light-lab",
    title: "Laboratorio de luces y sombras",
    duration: "15–25 min",
    age: "4+ años",
    objective: "Explorar luz a través de telas y objetos.",
    required: ["flashlight", "fabrics"],
    steps: [
      "Proyecta la luz a través de telas de distintos colores.",
      "Comparen cómo cambia la luz y qué sombras aparecen.",
    ],
  },
  "stick-percussion": {
    id: "stick-percussion",
    title: "Percusión con palitos y botellas",
    duration: "10–15 min",
    age: "3+ años",
    objective: "Jugar con ritmos y matices de sonido.",
    required: ["sticks", "bottles"],
    steps: [
      "Golpea superficies con distintos materiales para comparar sonidos.",
    ],
  },
  "texture-orchestra": {
    id: "texture-orchestra",
    title: "Orquesta de texturas",
    duration: "15–25 min",
    age: "3+ años",
    objective: "Relacionar textura con sonido y movimiento.",
    required: ["fabrics", "cardboard"],
    steps: [
      "Rasga cartón y frota telas para crear una orquesta de sonidos.",
    ],
  },
  "tower-challenge": {
    id: "tower-challenge",
    title: "Reto de torres con cartón",
    duration: "15–25 min",
    age: "4+ años",
    objective: "Desarrollar equilibrio y diseño de estructuras.",
    required: ["cardboard"],
    steps: [
      "Construyan la torre más alta con piezas de cartón.",
    ],
  },
  "bridge-builder": {
    id: "bridge-builder",
    title: "Puentes y caminos",
    duration: "20–30 min",
    age: "5+ años",
    objective: "Pensamiento ingenieril creando puentes estables.",
    required: ["cardboard", "sticks", "scissors"],
    steps: [
      "Diseña un puente que soporte un juguete.",
    ],
  },
  "fabric-fort": {
    id: "fabric-fort",
    title: "Fuerte con telas",
    duration: "10–20 min",
    age: "3+ años",
    objective: "Crear un refugio y juego simbólico.",
    required: ["fabrics"],
    steps: [
      "Cuelga telas entre sillas para formar un fuerte.",
    ],
  },
  "toy-theatre": {
    id: "toy-theatre",
    title: "Teatro con juguetes y cartón",
    duration: "20–30 min",
    age: "4+ años",
    objective: "Narrar historias montando escenario simple.",
    required: ["toys", "cardboard", "paint"],
    steps: [
      "Crea un escenario con cartón y pinta el fondo.",
      "Usa juguetes como personajes y representen una escena.",
    ],
  },
};

