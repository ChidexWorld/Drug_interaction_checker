const conditions = [
  {
    id: 1,
    name: "Hypertension",
    description: `Hypertension, also known as high blood pressure, is a chronic medical condition in which the force of blood against artery walls remains consistently elevated. It is often asymptomatic in its early stages but increases the risk of heart disease, stroke, kidney damage, and other complications over time.

Why it matters in drug interactions:
Hypertensive patients are particularly vulnerable to adverse drug effects because certain medications can raise blood pressure, reduce the effectiveness of antihypertensive drugs, or stress cardiovascular function. Additionally, polypharmacy is common in hypertensive individuals, especially those with comorbidities like diabetes or chronic kidney disease, further increasing interaction risk.

Common causes or triggers:
    •    Obesity
    •    High salt intake
    •    Sedentary lifestyle
    •    Excessive alcohol consumption
    •    Chronic stress
    •    Family history
    •    Underlying conditions (e.g., kidney disease)

Drug classes to watch out for:
    •    NSAIDs (e.g., ibuprofen, diclofenac): May reduce the effect of antihypertensives and increase blood pressure
    •    Corticosteroids: Can cause fluid retention and raise BP
    •    Decongestants (e.g., pseudoephedrine): Can trigger BP spikes
    •    Oral contraceptives: May elevate BP in some patients
    •    Certain antidepressants (e.g., venlafaxine, MAOIs): Can contribute to hypertensive episodes
    •    Monoamine oxidase inhibitors (MAOIs): Risk of hypertensive crisis with tyramine-rich foods or interacting drugs`,
  },
  {
    id: 2,
    name: "Diabetes Mellitus",
    description: `Diabetes mellitus is a chronic metabolic disorder characterized by high blood glucose levels (hyperglycemia) due to defects in insulin production, insulin action, or both. It is broadly categorized into Type 1 (autoimmune destruction of insulin-producing cells) and Type 2 (insulin resistance with eventual insulin deficiency). If poorly managed, diabetes can lead to complications affecting the eyes, kidneys, nerves, heart, and blood vessels.

Why it matters in drug interactions:
Diabetic patients often take multiple medications , not just for blood sugar control, but also for hypertension, lipid disorders, or complications. This increases the risk of drug-drug interactions, particularly those that affect blood glucose levels, renal function, or cardiovascular safety. Some drugs may mask symptoms of hypoglycemia or exacerbate hyperglycemia. Also, insulin and oral antidiabetics have narrow therapeutic windows, so interactions can lead to dangerous glucose fluctuations.

Common causes or triggers:
    •    Genetic predisposition
    •    Obesity (especially central obesity)
    •    Physical inactivity
    •    Unhealthy diet (high in sugar and refined carbs)
    •    Hormonal disorders (e.g., Cushing's syndrome)
    •    Certain medications (e.g., corticosteroids, antipsychotics)

Drug classes to watch out for:
    •    Beta-blockers: May mask hypoglycemia symptoms like palpitations
    •    Corticosteroids: Can significantly raise blood glucose levels
    •    Thiazide diuretics: May impair glucose tolerance
    •    Antipsychotics (e.g., olanzapine, risperidone): Associated with hyperglycemia and weight gain
    •    Fluoroquinolones: Can cause both hypo- and hyperglycemia
    •    Alcohol: Risk of hypoglycemia, especially with insulin or sulfonylureas
    •    ACE inhibitors and ARBs: Can enhance insulin sensitivity but may interact with antidiabetics or cause electrolyte imbalances`,
  },
  {
    id: 3,
    name: "Asthma",
    description: `Asthma is a chronic inflammatory disorder of the airways characterized by episodes of wheezing, coughing, breathlessness, and chest tightness. These symptoms result from airway hyperresponsiveness and reversible bronchoconstriction, often triggered by allergens, infections, or environmental irritants. Asthma severity ranges from mild and occasional to severe and persistent, requiring long-term controller therapy.

Why it matters in drug interactions:
Asthmatic patients often use a combination of quick-relief (rescue) inhalers and long-term control medications such as corticosteroids and leukotriene modifiers. Drug interactions can affect bronchodilator effectiveness, increase the risk of adverse cardiovascular effects, or worsen asthma control. Additionally, certain medications can induce bronchospasm or blunt the response to asthma treatment, posing a safety risk.

Common causes or triggers:
    •    Allergens (dust mites, pollen, pet dander)
    •    Respiratory infections (e.g., cold, flu)
    •    Air pollution, smoke, or strong odors
    •    Exercise (especially in cold weather)
    •    Stress and strong emotions
    •    Weather changes (especially cold air)
    •    NSAIDs or beta-blockers in sensitive individuals

Drug classes to watch out for:
    •    Non-selective beta-blockers (e.g., propranolol): Can provoke bronchospasm and blunt the effect of β2-agonists
    •    NSAIDs (e.g., aspirin, ibuprofen): May trigger asthma attacks in sensitive individuals (aspirin-sensitive asthma)
    •    ACE inhibitors: Can cause persistent dry cough, worsening respiratory symptoms
    •    Sedatives or opioids: May depress respiratory drive in severe cases
    •    Theophylline: Has a narrow therapeutic window and interacts with many drugs (e.g., macrolides, ciprofloxacin)`,
  },
  {
    id: 4,
    name: "Chronic Kidney Disease",
    description: `Chronic Kidney Disease is a progressive loss of kidney function over time, typically measured by a decrease in glomerular filtration rate (GFR). It is classified into five stages based on severity, with end-stage renal disease (ESRD) requiring dialysis or transplantation. CKD interferes with the kidneys' ability to filter waste, balance electrolytes, and regulate blood pressure.

Why it matters in drug interactions:
The kidneys are a major route of drug excretion. In CKD, reduced clearance can lead to drug accumulation and toxicity. Dose adjustments are often required, and nephrotoxic drugs must be avoided. CKD also alters drug metabolism and protein binding, increasing the risk of adverse drug reactions (ADRs), especially when polypharmacy is involved.

Common causes or triggers:
    •    Diabetes mellitus
    •    Hypertension
    •    Glomerulonephritis
    •    Recurrent urinary tract infections
    •    Polycystic kidney disease
    •    Long-term use of nephrotoxic drugs (e.g., NSAIDs)
    •    Obstructive uropathy or prolonged dehydration

Drug classes to watch out for:
    •    NSAIDs: Reduce renal perfusion and can worsen CKD
    •    ACE inhibitors / ARBs: May cause hyperkalemia or worsen renal function if not monitored
    •    Diuretics: Electrolyte imbalance, dehydration
    •    Aminoglycosides (e.g., gentamicin): High nephrotoxic potential
    •    Metformin: Risk of lactic acidosis in advanced CKD
    •    Contrast agents: Can induce contrast-induced nephropathy
    •    Digoxin: Narrow therapeutic index; dose must be adjusted`,
  },
  {
    id: 5,
    name: "Liver Disease",
    description: `Liver disease refers to any condition that impairs the function or structure of the liver. It can range from mild hepatitis to severe cirrhosis or liver failure. The liver plays a central role in drug metabolism, detoxification, and protein synthesis, making liver health critical for safe pharmacotherapy.

Why it matters in drug interactions:
Impaired liver function alters how drugs are metabolized, especially those that undergo first-pass metabolism or require hepatic enzymes like CYP450 for clearance. This can lead to drug accumulation, prolonged half-lives, increased toxicity, or reduced therapeutic effect. Many drugs need dose adjustments or complete avoidance in liver disease.

Common causes or triggers:
    •    Hepatitis B or C infections
    •    Excessive alcohol intake
    •    Non-alcoholic fatty liver disease (NAFLD)
    •    Cirrhosis
    •    Autoimmune hepatitis
    •    Drug-induced liver injury (e.g., paracetamol overdose, isoniazid, methotrexate)
    •    Liver tumors or cancer

Drug classes to watch out for:
    •    Paracetamol (Acetaminophen): Hepatotoxic at high doses
    •    Statins: Risk of liver enzyme elevation (use with caution)
    •    Antitubercular drugs (e.g., isoniazid, rifampicin): Hepatotoxic
    •    Antiretrovirals: Some cause liver enzyme elevations or hepatotoxicity
    •    NSAIDs: May worsen liver inflammation and affect clotting
    •    Sedatives & Benzodiazepines: Slower metabolism in liver disease → increased sedation
    •    Oral contraceptives & hormone therapy: Altered metabolism; avoid in severe liver disease`,
  },
  {
    id: 6,
    name: "Pregnancy",
    description: `Pregnancy is a physiological state marked by significant hormonal, metabolic, and physiological changes that affect nearly every organ system in the body. These changes influence how drugs are absorbed, distributed, metabolized, and excreted, making medication use during pregnancy particularly sensitive.

Why it matters in drug interactions:
During pregnancy, both the mother and fetus are at risk from adverse drug effects. Some drugs cross the placenta and may cause teratogenic effects, fetal toxicity, or developmental complications. The mother's altered renal function, plasma volume, and liver enzyme activity can also change drug behavior. Therefore, some drugs are contraindicated, others require dose adjustment, and polypharmacy should be minimized.

Common causes or triggers:
    •    Not applicable as pregnancy is a natural physiological state, but comorbidities during pregnancy (e.g., hypertension, gestational diabetes, infections) may complicate medication safety.
    •    Unplanned medication exposure
    •    Use of herbal or over-the-counter drugs without medical advice

Drug classes to watch out for:
    •    ACE inhibitors and ARBs (e.g., lisinopril, losartan): Can cause fetal kidney damage and developmental issues
    •    Tetracyclines (e.g., doxycycline): Risk of fetal bone and teeth discoloration
    •    Fluoroquinolones (e.g., ciprofloxacin): Possible cartilage damage
    •    NSAIDs (especially in 3rd trimester): May cause premature closure of fetal ductus arteriosus
    •    Warfarin: High risk of fetal malformations
    •    Isotretinoin and Thalidomide: Strongly teratogenic
    •    Anti-epileptics (e.g., valproate): Risk of neural tube defects
    •    Some antibiotics and antifungals (e.g., fluconazole in high doses): Teratogenic risk`,
  },
  {
    id: 7,
    name: "Peptic Ulcer Disease",
    description: `Peptic Ulcer Disease refers to open sores or lesions that develop in the lining of the stomach (gastric ulcer) or the first part of the small intestine (duodenal ulcer), primarily due to an imbalance between aggressive factors (like gastric acid and pepsin) and protective mechanisms (like mucus and bicarbonate). It is often caused by Helicobacter pylori infection or prolonged use of NSAIDs.

Why it matters in drug interactions:
Many commonly used medications can worsen ulcers, delay healing, or trigger bleeding in patients with PUD. Drug interaction checkers must take this condition into account because certain combinations (e.g., NSAIDs + corticosteroids or NSAIDs + anticoagulants) can greatly increase the risk of gastrointestinal bleeding, perforation, or erosion. Additionally, acid-reducing agents may alter the absorption or efficacy of other medications.

Common causes or triggers:
    •    Long-term or high-dose NSAID use (e.g., ibuprofen, diclofenac)
    •    Infection with Helicobacter pylori
    •    Corticosteroids, especially when combined with NSAIDs
    •    Stress (especially in hospitalized or critically ill patients)
    •    Smoking, alcohol, and spicy foods (can worsen symptoms, not direct causes)
    •    Zollinger-Ellison Syndrome (rare, hypersecretory condition)

Drug classes to watch out for:
    •    NSAIDs (e.g., ibuprofen, aspirin, naproxen): Can cause mucosal injury and ulcer formation
    •    Corticosteroids (e.g., prednisolone): Increase risk of GI bleeding when used with NSAIDs
    •    Anticoagulants (e.g., warfarin, rivaroxaban): Heightened bleeding risk in presence of ulcers
    •    SSRIs (e.g., fluoxetine): May increase GI bleeding risk, especially with NSAIDs
    •    Bisphosphonates (e.g., alendronate): Can irritate the esophagus and stomach lining
    •    Potassium supplements (oral tablets): May cause direct mucosal irritation
    •    Certain antibiotics (e.g., clarithromycin) used in H. pylori regimens can interact with other drugs

Recommended drug classes for treatment:
    •    Proton Pump Inhibitors (PPIs) (e.g., omeprazole, pantoprazole): Promote healing and reduce acid
    •    H2-receptor antagonists (e.g., ranitidine, though now less used)
    •    Antacids and cytoprotective agents (e.g., sucralfate)
    •    H. pylori eradication regimens (typically triple therapy: PPI + 2 antibiotics)`,
  },
  {
    id: 8,
    name: "HIV/AIDS",
    description: `HIV is a chronic viral infection that progressively damages the immune system by targeting CD4+ T cells, making the body vulnerable to opportunistic infections and certain cancers. Without treatment, it advances to AIDS, the most severe stage, characterized by severe immune suppression and life-threatening complications. Effective antiretroviral therapy (ART) can suppress the virus and prevent progression.

Why it matters in drug interactions:
People living with HIV often take multiple long-term medications, including antiretrovirals (ARVs), which have a high potential for drug-drug interactions. Many ARVs are metabolized via the cytochrome P450 (CYP) system, especially CYP3A4, and may act as inhibitors or inducers, affecting the metabolism of co-administered drugs. Some drugs can reduce ARV levels (leading to resistance), while others can increase toxicity. Interaction awareness is critical to avoid therapeutic failure or adverse effects.

Common complications or triggers for interaction concern:
    •    Polypharmacy, especially in co-infected individuals (e.g., with TB, hepatitis)
    •    Use of enzyme-inducing drugs (e.g., rifampicin, carbamazepine)
    •    Use of acid reducers (e.g., PPIs) affecting absorption of certain ARVs
    •    Herbal remedies (e.g., St. John's Wort) which may dangerously lower ARV levels
    •    Opportunistic infection treatments (e.g., antifungals, antibiotics) which often interact with ART

Drug classes to watch out for:
    •    Rifampicin: Can drastically reduce the effectiveness of certain ARVs (e.g., protease inhibitors)
    •    Azole antifungals (e.g., ketoconazole): May increase toxicity when combined with ARVs
    •    Macrolide antibiotics (e.g., clarithromycin): Interaction risk with protease inhibitors
    •    Anticonvulsants (e.g., phenytoin, carbamazepine): Alter ARV levels
    •    Acid-reducing agents (e.g., omeprazole, antacids): Affect absorption of drugs like atazanavir
    •    Statins (e.g., simvastatin): Risk of severe toxicity due to ARV inhibition of metabolism
    •    Oral contraceptives: Some ARVs reduce contraceptive effectiveness
    •    Benzodiazepines & opioids: Can be dangerously potentiated by certain ARVs

Recommended drug classes for treatment (ART):
    •    Nucleoside Reverse Transcriptase Inhibitors (NRTIs) (e.g., tenofovir, lamivudine)
    •    Non-Nucleoside Reverse Transcriptase Inhibitors (NNRTIs) (e.g., efavirenz)
    •    Protease Inhibitors (PIs) (e.g., lopinavir, ritonavir)
    •    Integrase Inhibitors (e.g., dolutegravir, raltegravir)
    •    Fixed-dose combinations to improve adherence (e.g., TLD: tenofovir, lamivudine, dolutegravir)`,
  },
  {
    id: 9,
    name: "Parkinson's Disease",
    description: `Parkinson's disease is a progressive neurodegenerative disorder that primarily affects dopaminergic neurons in the substantia nigra of the brain. It is characterized by motor symptoms such as tremors, rigidity, bradykinesia (slowness of movement), and postural instability, as well as non-motor symptoms like cognitive decline, mood changes, and sleep disturbances. It typically affects older adults and worsens over time.

Why it matters in drug interactions:
Patients with Parkinson's are usually on long-term dopaminergic therapy, particularly levodopa-based regimens, which are highly sensitive to drug interactions. Some medications can worsen motor symptoms, block dopamine receptors, or reduce the effectiveness of Parkinson's drugs. Others may intensify side effects like confusion, hallucinations, or hypotension. These patients are also more vulnerable to CNS depressants and anticholinergic burden, which can exacerbate their condition or cause falls.

Common complications or triggers for interaction concern:
    •    Use of dopamine antagonists (e.g., some antipsychotics, antiemetics)
    •    Polypharmacy in elderly patients (higher risk of falls, cognitive issues)
    •    Concomitant use of MAO-B inhibitors with serotonergic drugs (risk of serotonin syndrome)
    •    Orthostatic hypotension worsened by antihypertensives or diuretics
    •    Sedation or delirium from benzodiazepines, opioids, or anticholinergics

Drug classes to avoid or monitor closely:
    •    Typical antipsychotics (e.g., haloperidol, chlorpromazine): Worsen motor symptoms
    •    Atypical antipsychotics (e.g., risperidone, olanzapine): Also dopamine antagonists
    •    Antiemetics (e.g., metoclopramide, prochlorperazine): Block dopamine receptors
    •    MAO inhibitors (e.g., selegiline, rasagiline) + SSRIs/SNRIs: Risk of serotonin syndrome
    •    Anticholinergics (e.g., amitriptyline, diphenhydramine): Worsen confusion, constipation
    •    CNS depressants (e.g., benzodiazepines, opioids): Increase fall risk and sedation

Safe or preferred drug options:
    •    Levodopa/carbidopa: First-line for symptomatic relief
    •    Dopamine agonists (e.g., pramipexole, ropinirole): Alternative or adjunct therapy
    •    MAO-B inhibitors (e.g., selegiline, rasagiline): Mild symptom control
    •    COMT inhibitors (e.g., entacapone): Prolong levodopa action
    •    Anticholinergics (cautiously in younger patients only)
    •    Amantadine: Sometimes used for dyskinesia or mild symptoms`,
  },
  {
    id: 10,
    name: "Systemic Lupus Erythematosus (SLE)",
    description: `Systemic Lupus Erythematosus (SLE) is a chronic autoimmune disorder in which the body's immune system mistakenly attacks its own tissues and organs, leading to widespread inflammation. It can affect the skin, joints, kidneys, lungs, heart, and central nervous system. Symptoms are highly variable and may include fatigue, joint pain, rashes, anemia, and organ dysfunction. SLE is more common in women of childbearing age and can range from mild to life-threatening.

Why it matters in drug interactions:
SLE patients are often on long-term immunosuppressants, corticosteroids, and sometimes biologic therapies, which carry significant interaction risks. They are more susceptible to renal and hepatic toxicity, infections, and bleeding complications. Certain drugs can trigger lupus flares or interact with immunosuppressants, altering their effectiveness or increasing toxicity. Additionally, kidney involvement (lupus nephritis) may affect drug clearance.

Common complications or triggers for interaction concern:
    •    NSAIDs (commonly used for pain) may worsen renal function
    •    Corticosteroids interact with a wide range of drugs (e.g., anticoagulants, diuretics)
    •    Hydroxychloroquine and immunosuppressants (e.g., azathioprine, mycophenolate) have narrow therapeutic windows
    •    Risk of QT prolongation with multiple drugs used together
    •    Some antibiotics (e.g., sulfonamides) may trigger flares

Drug classes to avoid or monitor closely:
    •    Sulfonamide antibiotics (e.g., cotrimoxazole): May trigger lupus flares
    •    Phenytoin and hydralazine: Known to cause drug-induced lupus
    •    Live vaccines: Contraindicated during immunosuppressive therapy
    •    NSAIDs: Risk of GI bleeding and kidney injury, especially with steroids
    •    Methotrexate or biologics: Interaction with other immunosuppressants or hepatotoxic drugs
    •    CYP-interacting drugs: May affect metabolism of immunosuppressants

Safe or preferred drug options:
    •    Hydroxychloroquine: First-line maintenance treatment
    •    Mycophenolate mofetil, azathioprine, or methotrexate: Immunosuppressants for organ involvement
    •    Corticosteroids: For acute flares (use lowest effective dose)
    •    Belimumab or rituximab (biologics): For refractory cases
    •    Acetaminophen (paracetamol): Safer option for pain management compared to NSAIDs
    •    Antihypertensives like ACE inhibitors (especially in lupus nephritis)`,
  },
];

module.exports = conditions;