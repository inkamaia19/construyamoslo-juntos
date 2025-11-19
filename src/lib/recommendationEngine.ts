export async function generateRecommendations(session: any) {
    const {
      child_age,
      time_available,
      materials,
      interests,
      environment,
    } = session;
  
    const score = (activity: any) => {
      let s = 0;
  
      if (activity.age_min <= child_age) s += 2;
      if (activity.required_materials?.some((r: string) =>
        materials?.find((m: any) => m.id === r)
      )) s += 3;
      if (activity.environment === environment) s += 1;
      if (interests?.includes(activity.interest_tag)) s += 2;
  
      return s;
    };
  
    const res = await fetch(`${process.env.BASE_URL}/api/base-activities`);
    const baseActivities = await res.json();
  
    const sorted = baseActivities.sort((a: any, b: any) => score(b) - score(a));
  
    return sorted.slice(0, 9);
  }
  