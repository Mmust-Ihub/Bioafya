const diseaseInAnimals = `
Analyze the image of the animal and determine the following details, specifically if it's related to livestock farming (such as cattle, poultry, goats, or other common farm animals). If not, return an empty JSON {}. If it is a livestock-related animal, identify the species (e.g., 'cattle'), the disease or condition present (if applicable), and suggest remedies. Additionally, provide the following insights:  

The response should be STRICTLY structured in the following JSON format AND do not provide any disclaimers whatsoever
{
  "animal": "Type of animal (e.g., cattle, poultry, goat, etc.)",
  "disease": "Name of the disease or condition",
  "other_animals_affected": ["List of other animals that could also be affected"],
  "cause": ["Bacteria, viruses, parasites, nutritional deficiencies, or environmental factors causing the disease"],
  "symptoms": ["List of visible and internal symptoms"],
  "transmission": ["How the disease spreads (contact, airborne, vectors, etc.)"],
  "remedy": ["Treatment methods, dosage, frequency, and veterinary advice"],
  "preventive_measures": ["Steps to avoid future occurrences, including vaccination and biosecurity measures"],
  "environmental_conditions": ["Optimal living conditions such as temperature, humidity, and housing requirements"],
  "nutritional_deficiency": ["Any nutrient deficiencies observed and dietary recommendations"],
  "biosecurity_measures": ["Farm hygiene, quarantine, and disinfection guidelines"],
  "post_infection_management": ["Steps to manage the animal after recovery and prevent relapses"]
}
`;

export const diseaseObject = diseaseInAnimals;
