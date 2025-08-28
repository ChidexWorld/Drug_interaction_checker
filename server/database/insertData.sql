-- Active: 1756157113533@@mysql-25e81406-chiderastanley272-ded0.c.aivencloud.com@23241@defaultdb
-- Drug Interaction Checker Database Data Insertion
-- This script populates the database with all required data and maintains foreign key relationships

USE defaultdb;

-- 1. Insert Drugs (base table)
INSERT INTO
    drug (
        id,
        generic_name,
        drug_class,
        brand_name_1,
        manufacturer_1,
        brand_name_2,
        manufacturer_2
    )
VALUES (
        1,
        'Lisinopril',
        'ACE Inhibitor',
        'Zestril',
        'Emzor',
        'Lisinace',
        'GlaxoSmithKline'
    ),
    (
        2,
        'Spironolactone',
        'Potassium-Sparing Diuretic',
        'Aldactone',
        'Pfizer',
        'Spirono-Emzor',
        'Emzor'
    ),
    (
        3,
        'Metformin',
        'Biguanide',
        'Glucophage',
        'Merck',
        'Metformax',
        'Emzor'
    ),
    (
        4,
        'Cimetidine',
        'H2 Receptor Antagonist',
        'Tagamet',
        'GlaxoSmithKline',
        'Cimetin',
        'Juhel'
    ),
    (
        5,
        'Salbutamol',
        'Beta-2 Agonist',
        'Ventolin',
        'GlaxoSmithKline',
        'Salbutol',
        'Emzor'
    ),
    (
        6,
        'Propanolol',
        'Non-selective Beta Blocker',
        'Inderal',
        'AstraZeneca',
        'Propan-Emzor',
        'Emzor'
    ),
    (
        7,
        'Methyldopa',
        'Alpha-2 Adrenergic Agonist',
        'Aldomet',
        'Merck',
        'Methyldopar',
        'Emzor'
    ),
    (
        8,
        'Iron Supplement',
        'Iron Preparation',
        'Ferrous Forte',
        'Emzor',
        'Feroglobin',
        'Vitabiotics'
    ),
    (
        9,
        'Rifampicin',
        'Rifamycin Antibiotic',
        'Rifadine',
        'Sanofi',
        'Rimactane',
        'Sandoz'
    ),
    (
        10,
        'Nevirapine',
        'NNRTI Antiretroviral',
        'Viramune',
        'Boehringer Ingelhim',
        'Neviprim',
        'Emzor'
    ),
    (
        11,
        'Levodopa',
        'Dopamine Precursor + Decarboxylase Inhibitor',
        'Sinemet',
        'Merck',
        'Duodopa',
        'Abbott'
    ),
    (
        12,
        'Metroclopramide',
        'Dopamine Antagonist / Antiemetic',
        'Maxolon',
        'Sanofi',
        'Plasil',
        'Juhel'
    ),
    (
        13,
        'Prednisolone',
        'Corticosteroid',
        'Predsol',
        'GlaxoSmithKline',
        'Cortipred',
        'Emzor'
    ),
    (
        14,
        'Ibuprofen',
        'NSAID',
        'Brufen',
        'Abbot',
        'Ibuflam',
        'Emzor'
    ),
    (
        15,
        'Enalapril',
        'ACE Inhibitor',
        'Vasotec',
        'Merck',
        'Enapril',
        'Emzor'
    ),
    (
        16,
        'Lithium',
        'Mood Stabilizer',
        'Camcolit',
        'Sanofi',
        'Lithicarb',
        'Juhel'
    ),
    (
        17,
        'Hydralazine',
        'Vasodilator',
        'Apresoline',
        'Novartis',
        'Hydravax',
        'Emzor'
    ),
    (
        18,
        'Procainamide',
        'Class la Antiarrhythmic',
        'Pronestyl',
        'Abbot',
        'Procaine-Emzor',
        'Emzor'
    ),
    (
        19,
        'Insulin',
        'Antidiabetic Hormone',
        'Actrapid',
        'Novo Nordisk',
        'Insuget',
        'May & Baker'
    ),
    (
        20,
        'Losartan',
        'Angiotensin II Receptor Blocker',
        'Cozaar',
        'Merck',
        'Losanorm',
        'Emzor'
    ),
    (
        21,
        'Glipizide',
        'Sulfonylurea',
        'Minidiab',
        'Pfizer',
        'Glipinorm',
        'Emzor'
    ),
    (
        22,
        'Ipratropium',
        'Anticholinergic Bronchodilator',
        'Atrovent',
        'Boehringer Ingelhim',
        'Ipravent',
        'Emzor'
    ),
    (
        23,
        'Nifedipine',
        'Calcium Channel Blocker',
        'Adalat',
        'Bayer',
        'Nifecard',
        'Emzor'
    ),
    (
        24,
        'Efavirenz',
        'NNRTI Antiretroviral',
        'Sustiva',
        'Bristol-Myers Squibb',
        'Efaviron',
        'Emzor'
    ),
    (
        25,
        'Pramipexole',
        'Dopamine Agonist',
        'Mirapex',
        'Boehringer Ingelhim',
        'Pramirol',
        'Emzor'
    ),
    (
        26,
        'Esomeprazole',
        'Proton Pump Inhibitor',
        'Nexium',
        'AstraZeneca',
        'Esoprax',
        'Emzor'
    ),
    (
        27,
        'Valsartan',
        'Angiotensin II Receptor Blocker',
        'Diovan',
        'Novartis',
        'Valmed',
        'Emzor'
    ),
    (
        28,
        'Isosorbide Dinitrate',
        'Nitrate Vasodilator',
        'Isordil',
        'Wyeth',
        'Isodin',
        'Emzor'
    ),
    (
        29,
        'Glimepiride',
        'Sulfonylurea',
        'Amaryl',
        'Sanofi',
        'Glimerol',
        'Emzor'
    );

-- 2. Insert Conditions
INSERT INTO
    conditions (id, name, description)
VALUES (
        1,
        'Hypertension',
        'Hypertension, also known as high blood pressure, is a chronic medical condition in which the force of blood against artery walls remains consistently elevated. It is often asymptomatic in its early stages but increases the risk of heart disease, stroke, kidney damage, and other complications over time.\n\nWhy it matters in drug interactions:\nHypertensive patients are particularly vulnerable to adverse drug effects because certain medications can raise blood pressure, reduce the effectiveness of antihypertensive drugs, or stress cardiovascular function. Additionally, polypharmacy is common in hypertensive individuals, especially those with comorbidities like diabetes or chronic kidney disease, further increasing interaction risk.\n\nCommon causes or triggers:\n• Obesity\n• High salt intake\n• Sedentary lifestyle\n• Excessive alcohol consumption\n• Chronic stress\n• Family history\n• Underlying conditions (e.g., kidney disease)\n\nDrug classes to watch out for:\n• NSAIDs (e.g., ibuprofen, diclofenac): May reduce the effect of antihypertensives and increase blood pressure\n• Corticosteroids: Can cause fluid retention and raise BP\n• Decongestants (e.g., pseudoephedrine): Can trigger BP spikes\n• Oral contraceptives: May elevate BP in some patients\n• Certain antidepressants (e.g., venlafaxine, MAOIs): Can contribute to hypertensive episodes\n• Monoamine oxidase inhibitors (MAOIs): Risk of hypertensive crisis with tyramine-rich foods or interacting drugs'
    ),
    (
        2,
        'Diabetes Mellitus',
        'Diabetes mellitus is a chronic metabolic disorder characterized by high blood glucose levels (hyperglycemia) due to defects in insulin production, insulin action, or both. It is broadly categorized into Type 1 (autoimmune destruction of insulin-producing cells) and Type 2 (insulin resistance with eventual insulin deficiency). If poorly managed, diabetes can lead to complications affecting the eyes, kidneys, nerves, heart, and blood vessels.\n\nWhy it matters in drug interactions:\nDiabetic patients often take multiple medications, not just for blood sugar control, but also for hypertension, lipid disorders, or complications. This increases the risk of drug-drug interactions, particularly those that affect blood glucose levels, renal function, or cardiovascular safety. Some drugs may mask symptoms of hypoglycemia or exacerbate hyperglycemia. Also, insulin and oral antidiabetics have narrow therapeutic windows, so interactions can lead to dangerous glucose fluctuations.\n\nCommon causes or triggers:\n• Genetic predisposition\n• Obesity (especially central obesity)\n• Physical inactivity\n• Unhealthy diet (high in sugar and refined carbs)\n• Hormonal disorders (e.g., Cushing’s syndrome)\n• Certain medications (e.g., corticosteroids, antipsychotics)\n\nDrug classes to watch out for:\n• Beta-blockers: May mask hypoglycemia symptoms like palpitations\n• Corticosteroids: Can significantly raise blood glucose levels\n• Thiazide diuretics: May impair glucose tolerance\n• Antipsychotics (e.g., olanzapine, risperidone): Associated with hyperglycemia and weight gain\n• Fluoroquinolones: Can cause both hypo- and hyperglycemia\n• Alcohol: Risk of hypoglycemia, especially with insulin or sulfonylureas\n• ACE inhibitors and ARBs: Can enhance insulin sensitivity but may interact with antidiabetics or cause electrolyte imbalances'
    ),
    (
        3,
        'Asthma',
        'Asthma is a chronic inflammatory disorder of the airways characterized by episodes of wheezing, coughing, breathlessness, and chest tightness. These symptoms result from airway hyperresponsiveness and reversible bronchoconstriction, often triggered by allergens, infections, or environmental irritants. Asthma severity ranges from mild and occasional to severe and persistent, requiring long-term controller therapy.\n\nWhy it matters in drug interactions:\nAsthmatic patients often use a combination of quick-relief (rescue) inhalers and long-term control medications such as corticosteroids and leukotriene modifiers. Drug interactions can affect bronchodilator effectiveness, increase the risk of adverse cardiovascular effects, or worsen asthma control. Additionally, certain medications can induce bronchospasm or blunt the response to asthma treatment, posing a safety risk.\n\nCommon causes or triggers:\n• Allergens (dust mites, pollen, pet dander)\n• Respiratory infections (e.g., cold, flu)\n• Air pollution, smoke, or strong odors\n• Exercise (especially in cold weather)\n• Stress and strong emotions\n• Weather changes (especially cold air)\n• NSAIDs or beta-blockers in sensitive individuals\n\nDrug classes to watch out for:\n• Non-selective beta-blockers (e.g., propranolol): Can provoke bronchospasm and blunt the effect of β2-agonists\n• NSAIDs (e.g., aspirin, ibuprofen): May trigger asthma attacks in sensitive individuals (aspirin-sensitive asthma)\n• ACE inhibitors: Can cause persistent dry cough, worsening respiratory symptoms\n• Sedatives or opioids: May depress respiratory drive in severe cases\n• Theophylline: Has a narrow therapeutic window and interacts with many drugs (e.g., macrolides, ciprofloxacin)'
    ),
    (
        4,
        'Chronic Kidney Disease (CKD)',
        'Chronic Kidney Disease (CKD) is a progressive decline in kidney function, where the kidneys gradually lose the ability to filter waste and maintain fluid and electrolyte balance. It is staged from mild impairment to end-stage renal disease (ESRD), often requiring dialysis or kidney transplantation. CKD increases cardiovascular risk and complicates medication management due to altered drug clearance.\n\nWhy it matters in drug interactions:\nKidneys play a critical role in excreting many drugs and their metabolites. In CKD, impaired clearance can lead to drug accumulation and toxicity. Additionally, electrolyte imbalances common in CKD (e.g., hyperkalemia) can worsen the risks of certain medications. Polypharmacy is common in CKD patients, further raising interaction risks.\n\nCommon causes or triggers:\n• Diabetes\n• Hypertension\n• Glomerulonephritis\n• Polycystic kidney disease\n• Prolonged use of nephrotoxic drugs (e.g., NSAIDs, aminoglycosides)\n\nDrug classes to watch out for:\n• NSAIDs: Can worsen kidney function\n• ACE inhibitors and ARBs: Can raise potassium levels and impair renal function if not carefully monitored\n• Potassium-sparing diuretics: Risk of hyperkalemia\n• Aminoglycoside antibiotics: Nephrotoxic\n• Metformin: Risk of lactic acidosis in advanced CKD\n• Contrast agents (used in imaging): Can precipitate acute kidney injury'
    ),
    (
        5,
        'Liver Disease',
        'Liver disease includes a wide spectrum of conditions such as hepatitis, cirrhosis, fatty liver disease, and hepatocellular carcinoma. Since the liver is central to drug metabolism, liver disease alters how drugs are processed, potentially leading to drug accumulation, reduced therapeutic effect, or enhanced toxicity.\n\nWhy it matters in drug interactions:\nThe liver metabolizes most drugs through enzymatic pathways (e.g., cytochrome P450). Impaired liver function affects drug clearance, increases sensitivity to drug toxicity, and modifies drug-drug interactions. Patients with liver disease also have altered protein binding (hypoalbuminemia), affecting drug availability.\n\nCommon causes or triggers:\n• Viral hepatitis (Hepatitis B, C)\n• Alcohol abuse\n• Non-alcoholic fatty liver disease (NAFLD)\n• Autoimmune liver disease\n• Drug-induced liver injury\n\nDrug classes to watch out for:\n• Acetaminophen (paracetamol): Hepatotoxic in high doses\n• Statins: Risk of hepatotoxicity\n• Antifungal drugs (e.g., ketoconazole, itraconazole): Heavily metabolized by liver\n• Antiepileptics (e.g., valproate, carbamazepine): Hepatotoxic potential\n• Alcohol: Exacerbates liver damage\n• Certain antibiotics (e.g., isoniazid, rifampicin): Hepatotoxic risk'
    ),
    (
        6,
        'Pregnancy',
        'Pregnancy is a unique physiological state involving hormonal, cardiovascular, and metabolic changes that affect how drugs are absorbed, distributed, metabolized, and excreted. Medications can cross the placenta, potentially affecting fetal development. Some drugs are teratogenic (cause birth defects) or may harm the fetus during specific trimesters.\n\nWhy it matters in drug interactions:\nDrug safety in pregnancy is complex because medications must be safe for both the mother and the developing fetus. Many drugs lack sufficient safety data in pregnancy, and physiological changes (e.g., increased blood volume, altered kidney function) alter drug kinetics.\n\nCommon causes or triggers for complications:\n• Pre-existing conditions (e.g., diabetes, hypertension)\n• Infections\n• Nutritional deficiencies\n• Genetic disorders\n\nDrug classes to watch out for:\n• ACE inhibitors and ARBs: Teratogenic, especially in 2nd and 3rd trimesters\n• Warfarin: Teratogenic, can cause fetal bleeding\n• Certain antibiotics (e.g., tetracyclines, aminoglycosides): Risk of fetal toxicity\n• Antiepileptics (e.g., valproate): High teratogenic risk\n• Isotretinoin: Highly teratogenic\n• NSAIDs: Risk of premature ductus arteriosus closure in late pregnancy'
    ),
    (
        7,
        'Peptic Ulcer Disease (PUD)',
        'Peptic Ulcer Disease involves the formation of sores or erosions in the lining of the stomach or duodenum, often caused by Helicobacter pylori infection or prolonged NSAID use. Symptoms include burning abdominal pain, nausea, and bloating.\n\nWhy it matters in drug interactions:\nPUD patients are vulnerable to gastrointestinal irritation and bleeding, which certain medications can worsen. Additionally, acid-reducing therapies (e.g., proton pump inhibitors, H2 blockers) may alter the absorption of other drugs.\n\nCommon causes or triggers:\n• Helicobacter pylori infection\n• NSAID overuse\n• Smoking\n• Excessive alcohol use\n• Stress\n\nDrug classes to watch out for:\n• NSAIDs: Worsen ulcer formation and bleeding\n• Corticosteroids: Increase ulcer risk when combined with NSAIDs\n• Anticoagulants and antiplatelets (e.g., warfarin, aspirin, clopidogrel): Increased risk of GI bleeding\n• SSRIs: Associated with GI bleeding risk when combined with NSAIDs\n• Bisphosphonates: Cause GI irritation'
    ),
    (
        8,
        'HIV/AIDS',
        'HIV (Human Immunodeficiency Virus) attacks the immune system, specifically CD4 T-cells, leading to immunodeficiency. AIDS (Acquired Immunodeficiency Syndrome) represents the advanced stage of the infection, where opportunistic infections and cancers become common.\n\nWhy it matters in drug interactions:\nHIV patients typically receive lifelong antiretroviral therapy (ART), which involves multiple drugs with significant interaction potential. Many ART drugs are metabolized through liver enzymes (especially CYP450), leading to complex drug-drug interactions. Additionally, HIV patients may require treatment for opportunistic infections, further complicating therapy.\n\nCommon causes or triggers:\n• Transmission through blood, sexual contact, or perinatal exposure\n\nDrug classes to watch out for:\n• Rifampicin: Induces liver enzymes, reducing ART effectiveness\n• Antifungals (e.g., ketoconazole): Can raise ART levels, increasing toxicity\n• Anticonvulsants (e.g., phenytoin, carbamazepine): Reduce ART effectiveness\n• St. John’s Wort (herbal supplement): Reduces ART drug levels\n• Chemotherapy drugs: High risk of additive immunosuppression'
    ),
    (
        9,
        'Parkinson''s Disease',
        'Parkinson''s disease is a progressive neurodegenerative disorder characterized by the loss of dopamine-producing neurons in the brain. Symptoms include tremors, rigidity, bradykinesia (slowness of movement), and postural instability.\n\nWhy it matters in drug interactions:\nParkinson''s patients are highly dependent on dopaminergic therapy (e.g., levodopa). Drug interactions can block dopamine receptors, reduce levodopa effectiveness, or worsen motor and non-motor symptoms. Many elderly patients with Parkinson''s also take multiple medications, raising polypharmacy risks.\n\nCommon causes or triggers:\n• Mostly idiopathic (unknown cause)\n• Genetic predisposition\n• Environmental toxins\n\nDrug classes to watch out for:\n• Antipsychotics (e.g., haloperidol, risperidone): Block dopamine receptors, worsening symptoms\n• Metoclopramide: Dopamine antagonist, worsens motor symptoms\n• MAO inhibitors: Dangerous interactions with certain antidepressants\n• Anticholinergics: Can worsen cognitive decline in elderly patients'
    ),
    (
        10,
        'Systemic Lupus Erythematosus (SLE)',
        'SLE is a chronic autoimmune disease in which the immune system attacks multiple organ systems including skin, joints, kidneys, brain, and blood cells. It is characterized by flares and remissions, with symptoms ranging from mild (rash, joint pain) to severe (nephritis, neurological complications).\n\nWhy it matters in drug interactions:\nSLE patients often require long-term treatment with immunosuppressants, corticosteroids, and antimalarials. These therapies increase the risk of infections and drug-drug interactions. Additionally, women of childbearing age (most affected group) must be cautious with teratogenic medications.\n\nCommon causes or triggers:\n• Genetic susceptibility\n• Hormonal factors (estrogen)\n• Environmental triggers (sunlight, infections)\n• Certain drugs (drug-induced lupus)\n\nDrug classes to watch out for:\n• NSAIDs: Risk of renal impairment and GI bleeding\n• Corticosteroids: Long-term side effects, interact with multiple drugs\n• Immunosuppressants (e.g., azathioprine, methotrexate): High risk of infection and hepatotoxicity\n• Biologics (e.g., belimumab): May increase infection risk\n• Antimalarials (e.g., hydroxychloroquine): Retinal toxicity risk'
    );

-- 3. Insert Symptoms
INSERT INTO
    symptoms (symptom_id, name)
VALUES (1, 'Headache'),
    (2, 'Chest Pain'),
    (3, 'Frequent Urination'),
    (4, 'Fatigue'),
    (5, 'Shortness of Breath'),
    (6, 'Wheezing'),
    (7, 'Swollen Legs'),
    (8, 'Decreased Urine Output'),
    (9, 'Jaundice'),
    (10, 'Abdominal Swelling'),
    (11, 'Nausea'),
    (12, 'Breast Tenderness'),
    (13, 'Abdominal Pain'),
    (14, 'Heartburn'),
    (15, 'Weightloss'),
    (16, 'Night Sweats'),
    (17, 'Tremors'),
    (18, 'Difficulty Working'),
    (19, 'Joint Pain'),
    (20, 'Skin Rash'),
    (21, 'Blurred Vision'),
    (22, 'Nosebleeds'),
    (23, 'Increased Thirst'),
    (24, 'Slow-Healing Wounds'),
    (25, 'Coughing'),
    (26, 'Chest Tightness'),
    (27, 'Metallic Taste in Mouth'),
    (28, 'Dark Urine'),
    (29, 'Easy Bruising'),
    (30, 'Vomiting'),
    (31, 'Food Aversions'),
    (32, 'Indigestion'),
    (33, 'Nausea After Eating'),
    (34, 'Persistent Diarrhea'),
    (35, 'Recurrent Infections'),
    (36, 'Muscle Stiffness'),
    (37, 'Slowed Movements'),
    (38, 'Photosensitivity');

-- 4. Insert symptomToconditions
INSERT INTO
    symptomToconditions (symptom_id, condition_id)
VALUES (1, 1),
    (2, 1),
    (3, 2),
    (4, 2),
    (5, 3),
    (6, 3),
    (7, 4),
    (8, 4),
    (9, 5),
    (10, 5),
    (11, 6),
    (12, 6),
    (13, 7),
    (14, 7),
    (15, 8),
    (16, 8),
    (17, 9),
    (18, 9),
    (19, 10),
    (20, 10),
    (21, 1),
    (22, 1),
    (23, 2),
    (24, 2),
    (25, 3),
    (26, 3),
    (11, 4),
    (27, 4),
    (28, 5),
    (29, 5),
    (30, 6),
    (31, 6),
    (32, 7),
    (33, 7),
    (34, 8),
    (35, 8),
    (36, 9),
    (37, 9),
    (4, 10),
    (38, 10);

--5. insert interactions 

INSERT INTO
    interactions (
        id,
        drug1_id,
        drug2_id,
        interaction_type,
        interaction_description,
        severity_score,
        clinical_note_id,
        alternative_id
    )
VALUES (
        1,
        1,
        2,
        'Major',
        'Combined use increases risk of hyperkalemia, especially in renal or liver issues.',
        3,
        1,
        1
    ),
    (
        2,
        3,
        4,
        'Moderate',
        'Cimetidine may raise metformin levels, increasing lactic acidosis risk.',
        2,
        2,
        2
    ),
    (
        3,
        5,
        6,
        'Major',
        'Propranolol can block the effects of salbutamol, worsening asthma control.',
        3,
        3,
        3
    ),
    (
        4,
        7,
        8,
        'Minor',
        'Iron may reduce methyldopa absorption, lowering its antihypertensive effect.',
        1,
        4,
        4
    ),
    (
        5,
        9,
        10,
        'Major',
        'Rifampicin induces enzymes that lower nevirapine levels, risking HIV treatment failure.',
        3,
        5,
        5
    ),
    (
        6,
        11,
        12,
        'Major',
        'Metoclopramide may block dopamine receptors, worsening Parkinson’s symptoms.',
        3,
        6,
        6
    ),
    (
        7,
        13,
        14,
        'Moderate',
        'Combined use increases risk of GI bleeding or ulceration, especially long-term.',
        2,
        7,
        7
    ),
    (
        8,
        15,
        16,
        'Major',
        'Enalapril reduces lithium clearance, increasing toxicity risk.',
        3,
        8,
        8
    ),
    (
        9,
        17,
        18,
        'Major',
        'Combo increases the risk of drug-induced lupus, especially in predisposed patients.',
        3,
        9,
        9
    ),
    (
        10,
        19,
        6,
        'Moderate',
        'Propranolol may mask symptoms of hypoglycemia, delaying patient response.',
        2,
        10,
        10
    );

--6. Insert condition Intearactions

INSERT INTO
    conditionInteraction (
        map_id,
        interaction_id,
        condition_id,
        adjusted_interaction_type,
        severity_score
    )
VALUES (1, 1, 1, 'Major', 3),
    (2, 1, 2, 'Moderate', 2),
    (3, 1, 3, 'Minor', 1),
    (4, 1, 4, 'Contraindicated', 4),
    (5, 1, 5, 'Contraindicated', 4),
    (6, 1, 6, 'Major', 3),
    (7, 1, 7, 'Minor', 1),
    (8, 1, 8, 'Moderate', 2),
    (9, 1, 9, 'Minor', 1),
    (10, 1, 10, 'Moderate', 2),
    (11, 2, 1, 'Moderate', 2),
    (12, 2, 2, 'Major', 3),
    (13, 2, 3, 'Moderate', 2),
    (14, 2, 4, 'Major', 3),
    (15, 2, 5, 'Major', 3),
    (16, 2, 6, 'Major', 3),
    (17, 2, 7, 'Moderate', 2),
    (18, 2, 8, 'Moderate', 2),
    (19, 2, 9, 'Minor', 1),
    (20, 2, 10, 'Moderate', 2),
    (21, 3, 1, 'Moderate', 2),
    (22, 3, 2, 'Moderate', 2),
    (23, 3, 3, 'Major', 3),
    (24, 3, 4, 'Moderate', 2),
    (25, 3, 5, 'Moderate', 2),
    (26, 3, 6, 'Moderate', 2),
    (27, 3, 7, 'Minor', 1),
    (28, 3, 8, 'Moderate', 2),
    (29, 3, 9, 'Moderate', 2),
    (30, 3, 10, 'Minor', 1),
    (31, 4, 1, 'Moderate', 2),
    (32, 4, 2, 'Minor', 1),
    (33, 4, 3, 'Minor', 1),
    (34, 4, 4, 'Moderate', 2),
    (35, 4, 5, 'Moderate', 2),
    (36, 4, 6, 'Moderate', 2),
    (37, 4, 7, 'Minor', 1),
    (38, 4, 8, 'Minor', 1),
    (39, 4, 9, 'Minor', 1),
    (40, 4, 10, 'Minor', 1),
    (41, 5, 1, 'Minor', 1),
    (42, 5, 2, 'Minor', 1),
    (43, 5, 3, 'Minor', 1),
    (44, 5, 4, 'Moderate', 2),
    (45, 5, 5, 'Moderate', 2),
    (46, 5, 6, 'Moderate', 2),
    (47, 5, 7, 'Minor', 1),
    (48, 5, 8, 'Major', 3),
    (49, 5, 9, 'Moderate', 2),
    (50, 5, 10, 'Moderate', 2),
    (51, 6, 1, 'Minor', 1),
    (52, 6, 2, 'Minor', 1),
    (53, 6, 3, 'Minor', 1),
    (54, 6, 4, 'Moderate', 2),
    (55, 6, 5, 'Moderate', 2),
    (56, 6, 6, 'Minor', 1),
    (57, 6, 7, 'Minor', 1),
    (58, 6, 8, 'Moderate', 2),
    (59, 6, 9, 'Major', 3),
    (60, 6, 10, 'Moderate', 2),
    (61, 7, 1, 'Moderate', 2),
    (62, 7, 2, 'Moderate', 2),
    (63, 7, 3, 'Moderate', 2),
    (64, 7, 4, 'Moderate', 2),
    (65, 7, 5, 'Major', 3),
    (66, 7, 6, 'Major', 3),
    (67, 7, 7, 'Major', 3),
    (68, 7, 8, 'Moderate', 2),
    (69, 7, 9, 'Moderate', 2),
    (70, 7, 10, 'Moderate', 2),
    (71, 8, 1, 'Major', 3),
    (72, 8, 2, 'Major', 3),
    (73, 8, 3, 'Moderate', 2),
    (74, 8, 4, 'Major', 3),
    (75, 8, 5, 'Major', 3),
    (76, 8, 6, 'Moderate', 2),
    (77, 8, 7, 'Moderate', 2),
    (78, 8, 8, 'Moderate', 2),
    (79, 8, 9, 'Major', 3),
    (80, 8, 10, 'Major', 3),
    (81, 9, 1, 'Moderate', 2),
    (82, 9, 2, 'Moderate', 2),
    (83, 9, 3, 'Moderate', 2),
    (84, 9, 4, 'Major', 3),
    (85, 9, 5, 'Major', 3),
    (86, 9, 6, 'Minor', 1),
    (87, 9, 7, 'Moderate', 2),
    (88, 9, 8, 'Major', 3),
    (89, 9, 9, 'Major', 3),
    (90, 9, 10, 'Major', 3),
    (91, 10, 1, 'Major', 3),
    (92, 10, 2, 'Major', 3),
    (93, 10, 3, 'Moderate', 2),
    (94, 10, 4, 'Moderate', 2),
    (95, 10, 5, 'Moderate', 2),
    (96, 10, 6, 'Minor', 1),
    (97, 10, 7, 'Minor', 1),
    (98, 10, 8, 'Moderate', 2),
    (99, 10, 9, 'Minor', 1),
    (100, 10, 10, 'Minor', 1);

--7 insert clinical note 
INSERT INTO
    clinicalNote (
        clinical_note_id,
        clinical_note
    )
VALUES (
        1,
        'Monitor serum potassium closely when ACE inhibitors like Lisinopril are combined with potassium-sparing diuretics such as Spironolactone. Risk of life-threatening hyperkalemia increases, especially in patients with renal or liver impairment'
    ),
    (
        2,
        'Avoid using cimetidine with metformin unless absolutely necessary. If used, monitor renal function and for signs of lactic acidosis. Consider using ranitidine instead.'
    ),
    (
        3,
        'Non-selective beta-blockers like propranolol can antagonize bronchodilation from salbutamol. Avoid co-administration in patients with asthma or reactive airway disease.'
    ),
    (
        4,
        'To reduce interaction, stagger dosing times between iron supplements and methyldopa by at least 2 hours. Watch for loss of antihypertensive effect.'
    ),
    (
        5,
        'Rifampicin induces hepatic enzymes, lowering plasma levels of nevirapine. Consider alternative ART regimens or monitor HIV viral load closely.'
    ),
    (
        6,
        'Avoid concurrent use of metoclopramide with levodopa/carbidopa due to antagonism at dopamine receptors, which may worsen Parkinsonian symptoms.'
    ),
    (
        7,
        'Concurrent use of NSAIDs with corticosteroids increases GI ulcer risk. Prescribe gastroprotective agents like PPIs if co-administration is unavoidable.'
    ),
    (
        8,
        'ACE inhibitors reduce lithium clearance, increasing the risk of lithium toxicity. Monitor lithium levels regularly if concurrent use is required.'
    ),
    (
        9,
        'Hydralazine and procainamide combination may cause drug-induced lupus erythematosus. Avoid in patients with autoimmune predispositions. Monitor for ANA titers.'
    ),
    (
        10,
        'Beta-blockers may mask typical symptoms of hypoglycemia such as tremors and palpitations in insulin-treated diabetics. Educate patients to monitor glucose closely.'
    );

-- 7. Insert alternative drugs 
INSERT INTO
    alternativeDrugs (
        alternative_id,
        replaced_drug_id,
        alternative_drug_id
    )
VALUES (1, 1, 20),
    (2, 3, 21),
    (3, 5, 22),
    (4, 7, 23),
    (5, 10, 24),
    (6, 11, 25),
    (7, 14, 26),
    (8, 15, 27),
    (9, 17, 28),
    (10, 19, 29);

    conditionInteraction (
        map_id,
        interaction_id,
        condition_id,
        adjusted_interaction_type,
        severity_score
    )
VALUES (1, 1, 1, 'Major', 3),
    (2, 1, 2, 'Moderate', 2),
    (3, 1, 3, 'Minor', 1),
    (4, 1, 4, 'Contraindicated', 4),
    (5, 1, 5, 'Contraindicated', 4),
    (6, 1, 6, 'Major', 3),
    (7, 1, 7, 'Minor', 1),
    (8, 1, 8, 'Moderate', 2),
    (9, 1, 9, 'Minor', 1),
    (10, 1, 10, 'Moderate', 2),
    (11, 2, 1, 'Moderate', 2),
    (12, 2, 2, 'Major', 3),
    (13, 2, 3, 'Moderate', 2),
    (14, 2, 4, 'Major', 3),
    (15, 2, 5, 'Major', 3),
    (16, 2, 6, 'Major', 3),
    (17, 2, 7, 'Moderate', 2),
    (18, 2, 8, 'Moderate', 2),
    (19, 2, 9, 'Minor', 1),
    (20, 2, 10, 'Moderate', 2),
    (21, 3, 1, 'Moderate', 2),
    (22, 3, 2, 'Moderate', 2),
    (23, 3, 3, 'Major', 3),
    (24, 3, 4, 'Moderate', 2),
    (25, 3, 5, 'Moderate', 2),
    (26, 3, 6, 'Moderate', 2),
    (27, 3, 7, 'Minor', 1),
    (28, 3, 8, 'Moderate', 2),
    (29, 3, 9, 'Moderate', 2),
    (30, 3, 10, 'Minor', 1),
    (31, 4, 1, 'Moderate', 2),
    (32, 4, 2, 'Minor', 1),
    (33, 4, 3, 'Minor', 1),
    (34, 4, 4, 'Moderate', 2),
    (35, 4, 5, 'Moderate', 2),
    (36, 4, 6, 'Moderate', 2),
    (37, 4, 7, 'Minor', 1),
    (38, 4, 8, 'Minor', 1),
    (39, 4, 9, 'Minor', 1),
    (40, 4, 10, 'Minor', 1),
    (41, 5, 1, 'Minor', 1),
    (42, 5, 2, 'Minor', 1),
    (43, 5, 3, 'Minor', 1),
    (44, 5, 4, 'Moderate', 2),
    (45, 5, 5, 'Moderate', 2),
    (46, 5, 6, 'Moderate', 2),
    (47, 5, 7, 'Minor', 1),
    (48, 5, 8, 'Major', 3),
    (49, 5, 9, 'Moderate', 2),
    (50, 5, 10, 'Moderate', 2),
    (51, 6, 1, 'Minor', 1),
    (52, 6, 2, 'Minor', 1),
    (53, 6, 3, 'Minor', 1),
    (54, 6, 4, 'Moderate', 2),
    (55, 6, 5, 'Moderate', 2),
    (56, 6, 6, 'Minor', 1),
    (57, 6, 7, 'Minor', 1),
    (58, 6, 8, 'Moderate', 2),
    (59, 6, 9, 'Major', 3),
    (60, 6, 10, 'Moderate', 2),
    (61, 7, 1, 'Moderate', 2),
    (62, 7, 2, 'Moderate', 2),
    (63, 7, 3, 'Moderate', 2),
    (64, 7, 4, 'Moderate', 2),
    (65, 7, 5, 'Major', 3),
    (66, 7, 6, 'Major', 3),
    (67, 7, 7, 'Major', 3),
    (68, 7, 8, 'Moderate', 2),
    (69, 7, 9, 'Moderate', 2),
    (70, 7, 10, 'Moderate', 2),
    (71, 8, 1, 'Major', 3),
    (72, 8, 2, 'Major', 3),
    (73, 8, 3, 'Moderate', 2),
    (74, 8, 4, 'Major', 3),
    (75, 8, 5, 'Major', 3),
    (76, 8, 6, 'Moderate', 2),
    (77, 8, 7, 'Moderate', 2),
    (78, 8, 8, 'Moderate', 2),
    (79, 8, 9, 'Major', 3),
    (80, 8, 10, 'Major', 3),
    (81, 9, 1, 'Moderate', 2),
    (82, 9, 2, 'Moderate', 2),
    (83, 9, 3, 'Moderate', 2),
    (84, 9, 4, 'Major', 3),
    (85, 9, 5, 'Major', 3),
    (86, 9, 6, 'Minor', 1),
    (87, 9, 7, 'Moderate', 2),
    (88, 9, 8, 'Major', 3),
    (89, 9, 9, 'Major', 3),
    (90, 9, 10, 'Major', 3),
    (91, 10, 1, 'Major', 3),
    (92, 10, 2, 'Major', 3),
    (93, 10, 3, 'Moderate', 2),
    (94, 10, 4, 'Moderate', 2),
    (95, 10, 5, 'Moderate', 2),
    (96, 10, 6, 'Minor', 1),
    (97, 10, 7, 'Minor', 1),
    (98, 10, 8, 'Moderate', 2),
    (99, 10, 9, 'Minor', 1),
    (100, 10, 10, 'Minor', 1);