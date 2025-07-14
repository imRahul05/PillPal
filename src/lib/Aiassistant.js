import { queryGemini, generateAdherenceInsights, generateInteractionWarnings, generateDosageOptimizations } from "./gemini";

export const loadAllInsights = async (medications) => {
  const medicationsForAI = prepareMedicationsForAI(medications);
  const takenCount = medications.filter((med) => med.taken).length;
  const missedCount = medications.filter((med) => med.missed).length;

  const insights = await loadInsights(medicationsForAI, takenCount, missedCount);
  const interactions = await loadInteractions(medicationsForAI);
  const optimizations = await loadOptimizations(medicationsForAI);

  return { insights, interactions, optimizations };
};

export const prepareMedicationsForAI = (medications) => {
  return medications
    .filter((med) => med.status === "active")
    .map((med) => ({
      name: med.name,
      dosage: med.dosage,
      category: med.category,
      schedule: med.schedule,
      startDate: med.startDate,
      renewalDate: med.renewalDate,
      endDate: med.endDate,
      time: med.time,
      reason: med.reason,
    }));
};

export const loadInsights = async (medicationsForAI, takenCount, missedCount) => {
  try {
    const response = await generateAdherenceInsights(medicationsForAI, takenCount, missedCount);
    return {
      text: response.error
        ? "Unable to generate insights at this time. Please try again later."
        : response.text,
      loading: false,
    };
  } catch (error) {
    console.error("Error generating insights:", error);
    return {
      text: "Unable to generate insights at this time. Please try again later.",
      loading: false,
    };
  }
};

export const loadInteractions = async (medicationsForAI) => {
  try {
    const response = await generateInteractionWarnings(medicationsForAI);
    return {
      text: response.error
        ? "Unable to analyze medication interactions at this time. Please try again later."
        : response.text,
      loading: false,
    };
  } catch (error) {
    console.error("Error generating interaction warnings:", error);
    return {
      text: "Unable to analyze medication interactions at this time. Please try again later.",
      loading: false,
    };
  }
};

export const loadOptimizations = async (medicationsForAI) => {
  try {
    const response = await generateDosageOptimizations(medicationsForAI);
    return {
      text: response.error
        ? "Unable to generate optimization suggestions at this time. Please try again later."
        : response.text,
      loading: false,
    };
  } catch (error) {
    console.error("Error generating dosage optimizations:", error);
    return {
      text: "Unable to generate optimization suggestions at this time. Please try again later.",
      loading: false,
    };
  }
};

export const handleAIQuery = async (inputValue, medications) => {
  try {
    const medicationsForAI = prepareMedicationsForAI(medications);
    const response = await queryGemini(inputValue, medicationsForAI);

    if (response.error) {
      return {
        error: true,
        message: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
      };
    }

    return {
      error: false,
      message: response.text,
    };
  } catch (error) {
    console.error("Error querying Gemini:", error);
    return {
      error: true,
      message: "I'm sorry, I encountered an error while processing your question. Please try again.",
    };
  }
};
