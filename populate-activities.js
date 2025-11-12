import fs from 'fs';

// Función para escapar comillas simples en el texto para SQL
function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

// Función para formatear arrays para SQL
function formatSqlArray(arr) {
  if (!arr || arr.length === 0) return 'NULL';
  const escapedItems = arr.map(item => `"${item.replace(/"/g, '""')}"`).join(',');
  return `ARRAY[${escapedItems}]`;
}

const activities = JSON.parse(fs.readFileSync('./activities.json', 'utf-8'));
const sqlInserts = [];

sqlInserts.push('DELETE FROM public.activities;'); // Limpia la tabla antes de insertar

for (const activity of activities) {
  const values = [
    escapeSql(activity.id),
    escapeSql(activity.title),
    escapeSql(activity.difficulty),
    formatSqlArray(activity.required_materials),
    formatSqlArray(activity.interests),
    formatSqlArray(activity.environments),
    formatSqlArray(activity.optional_materials),
    escapeSql(activity.objective),
    activity.duration_minutes || 'NULL',
    activity.age_min || 'NULL',
    activity.age_max || 'NULL',
    formatSqlArray(activity.steps),
    formatSqlArray(activity.tips),
    formatSqlArray(activity.safety),
    escapeSql(activity.image_url) // Aunque no lo usemos ahora, lo incluimos por si acaso
  ].join(', ');

  const insertStatement = `INSERT INTO public.activities (id, title, difficulty, required_materials, interests, environments, optional_materials, objective, duration_minutes, age_min, age_max, steps, tips, safety, image_url) VALUES (${values});`;
  sqlInserts.push(insertStatement);
}

const finalSql = sqlInserts.join('\n');
fs.writeFileSync('./generated_activities_inserts.sql', finalSql, 'utf-8');

console.log(`¡Éxito! Se ha generado el archivo 'generated_activities_inserts.sql'.`);
console.log("Copia su contenido y ejecútalo en NeonDB para llenar tu 'biblioteca' de actividades.");