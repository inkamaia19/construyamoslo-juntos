import fs from 'fs';

// --- TRADUCTOR ---
// Mapea los IDs del JSON a los nombres de tus archivos de imagen.
const interestMap = {
  "art_coloring": "arte",
  "water_bubbles": "agua",
  "discover": "descubrimiento",
  "sounds_rhythm": "sonidos",
  "building": "construccion" // Nota: Usamos "construccion" sin tilde, que es lo estándar para nombres de archivo.
};

const environmentMap = {
  "floor": "floor",
  "garden": "garden",
  "living_room": "living-room", // Traduce el guion bajo a guion
  "table": "table"
};
// --- FIN DEL TRADUCTOR ---

const activities = JSON.parse(fs.readFileSync('./activities.json', 'utf-8'));
const sqlInserts = [];

// Primero, borramos los datos antiguos para evitar duplicados.
sqlInserts.push('DELETE FROM public.onboarding_activities;');

for (const activity of activities) {
  if (activity.interests && activity.environments) {
    for (const interestId of activity.interests) {
      for (const environmentId of activity.environments) {
        
        // Usamos el traductor para obtener los nombres correctos para los archivos.
        const interestFileName = interestMap[interestId];
        const environmentFileName = environmentMap[environmentId];

        // Solo procedemos si encontramos una traducción válida.
        if (interestFileName && environmentFileName) {
          const newId = `${activity.id}-${interestId}-${environmentId}`;
          const imageUrl = `/activities/${interestFileName}-${environmentFileName}.webp`;
          const title = activity.title;
          const baseActivityId = activity.id;

          const insertStatement = `INSERT INTO public.onboarding_activities (id, title, image_url, interest_tag, environment_tag, base_activity_id) VALUES ('${newId}', '${title.replace(/'/g, "''")}', '${imageUrl}', '${interestId}', '${environmentId}', '${baseActivityId}');`;
          
          sqlInserts.push(insertStatement);
        }
      }
    }
  }
}

const finalSql = sqlInserts.join('\n');
fs.writeFileSync('./generated_inserts.sql', finalSql, 'utf-8');

console.log(`¡Éxito! Se ha generado el archivo 'generated_inserts.sql' con la convención de nombres correcta.`);
console.log("Copia el contenido y ejecútalo en tu base de datos NeonDB.");