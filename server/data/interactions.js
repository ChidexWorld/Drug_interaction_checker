const interactions = [
  {
    id: 1,
    drug1_id: 1,
    drug2_id: 2,
    interaction_type: "Major",
    interaction_description:
      "Combined use increases risk of hyperkalemia, especially in renal or liver issues.",
    severity_score: 3,
    clinical_note_id: 1,
    alternative_id: 1,
  },
  {
    id: 2,
    drug1_id: 3,
    drug2_id: 4,
    interaction_type: "Moderate",
    interaction_description:
      "Cimetidine may raise metformin levels, increasing lactic acidosis risk.",
    severity_score: 2,
    clinical_note_id: 2,
    alternative_id: 2,
  },
  {
    id: 3,
    drug1_id: 5,
    drug2_id: 6,
    interaction_type: "Major",
    interaction_description:
      "Propranolol can block the effects of salbutamol, worsening asthma control.",
    severity_score: 3,
    clinical_note_id: 3,
    alternative_id: 3,
  },
  {
    id: 4,
    drug1_id: 7,
    drug2_id: 8,
    interaction_type: "Minor",
    interaction_description:
      "Iron may reduce methyldopa absorption, lowering its antihypertensive effect.",
    severity_score: 1,
    clinical_note_id: 4,
    alternative_id: 4,
  },
  {
    id: 5,
    drug1_id: 9,
    drug2_id: 10,
    interaction_type: "Major",
    interaction_description:
      "Rifampicin induces enzymes that lower nevirapine levels, risking HIV treatment failure.",
    severity_score: 3,
    clinical_note_id: 5,
    alternative_id: 5,
  },
  {
    id: 6,
    drug1_id: 11,
    drug2_id: 12,
    interaction_type: "Major",
    interaction_description:
      "Metoclopramide may block dopamine receptors, worsening Parkinson's symptoms.",
    severity_score: 3,
    clinical_note_id: 6,
    alternative_id: 6,
  },
  {
    id: 7,
    drug1_id: 13,
    drug2_id: 14,
    interaction_type: "Moderate",
    interaction_description:
      "Combined use increases risk of GI bleeding or ulceration, especially long-term.",
    severity_score: 2,
    clinical_note_id: 7,
    alternative_id: 7,
  },
  {
    id: 8,
    drug1_id: 15,
    drug2_id: 16,
    interaction_type: "Major",
    interaction_description:
      "Enalapril reduces lithium clearance, increasing toxicity risk.",
    severity_score: 3,
    clinical_note_id: 8,
    alternative_id: 8,
  },
  {
    id: 9,
    drug1_id: 17,
    drug2_id: 18,
    interaction_type: "Major",
    interaction_description:
      "Combo increases the risk of drug-induced lupus, especially in predisposed patients.",
    severity_score: 3,
    clinical_note_id: 9,
    alternative_id: 9,
  },
  {
    id: 10,
    drug1_id: 19,
    drug2_id: 6,
    interaction_type: "Moderate",
    interaction_description:
      "Propranolol may mask symptoms of hypoglycemia, delaying patient response.",
    severity_score: 2,
    clinical_note_id: 10,
    alternative_id: 10,
  },
];

module.exports = interactions;