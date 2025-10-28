// spermValuation.ts

// 1. Factor maps (straight from the spreadsheet "Data" sheet)
const FACTORS = {
  age: {
    "18-38": 1,
    "39-50": 0.75,
    "51+": 0.001,
  },
  education: {
    "Post-graduate": 1,
    Graduate: 1,
    College: 0.75,
    "High school": 0.25,
  },
  recipientFamilies: {
    "1": 1,
    "Up to 5": 0.1,
    "Any number": 0,
  },
  transparency: {
    // how much info donor is willing to share
    "Medical/full DNA/personal/contact": 1,
    "Medical/full DNA/personal, no name": 0.75,
    "Medical/DNA, screening only": 0.25,
    "Standard tests only": 0,
  },
  bmi: {
    "Underweight (<18.5)": 0.75,
    "Healthy weight (18.5-24.9)": 1,
    "Overweight (25-29.9)": 0.5,
    "Obese (30+)": 0.25,
  },
  testosteroneSupp: {
    "No supplements": 1,
    "Taking supplements": 0.25,
  },
  smokingDrugs: {
    "No smoking/drugs": 1,
    "Occasional smoking/drugs": 0.5,
    "Frequent smoking/drugs": 0,
  },
  stressLevel: {
    "Low stress": 1,
    "Medium stress": 0.75,
    "High stress": 0.25,
  },
  ejaculationFreq: {
    "Multiple/day": 0.25,
    Daily: 1,
    Weekly: 1,
    Rarely: 0.25,
  },
};

/**
 * Input type for the calculator.
 * All values must match one of the keys in the FACTORS maps above.
 */
export type DonorProfileInput = {
  ageRange: "18-38" | "39-50" | "51+";
  educationLevel: "Post-graduate" | "Graduate" | "College" | "High school";
  recipientFamilies: "1" | "Up to 5" | "Any number";
  transparencyLevel:
    | "Medical/full DNA/personal/contact"
    | "Medical/full DNA/personal, no name"
    | "Medical/DNA, screening only"
    | "Standard tests only";
  bmiRange:
    | "Underweight (<18.5)"
    | "Healthy weight (18.5-24.9)"
    | "Overweight (25-29.9)"
    | "Obese (30+)";
  testosteroneUse: "No supplements" | "Taking supplements";
  smokingDrugs:
    | "No smoking/drugs"
    | "Occasional smoking/drugs"
    | "Frequent smoking/drugs";
  stressLevel: "Low stress" | "Medium stress" | "High stress";
  ejaculationFreq: "Multiple/day" | "Daily" | "Weekly" | "Rarely";
  spermCountQuality?: string;
};

// 2. Weight of each criterion in the spreadsheet model
const WEIGHTS = {
  age: 0.15,
  education: 0.075,
  recipientFamilies: 0.25,
  transparency: 0.2,
  bmi: 0.075,
  testosteroneSupp: 0.05,
  smokingDrugs: 0.075,
  stressLevel: 0.075,
  ejaculationFreq: 0.025,
};

const DEMOGRAPHIC_WEIGHT_TOTAL = WEIGHTS.age + WEIGHTS.education; // 0.225
const INVOLVEMENT_WEIGHT_TOTAL =
  WEIGHTS.recipientFamilies + WEIGHTS.transparency; // 0.45
const SPERM_HEALTH_WEIGHT_TOTAL =
  WEIGHTS.bmi +
  WEIGHTS.testosteroneSupp +
  WEIGHTS.smokingDrugs +
  WEIGHTS.stressLevel +
  WEIGHTS.ejaculationFreq; // 0.3

// 3. Base max valuation
const BASE_VALUE = 70000;

/**
 * Core calculation
 */
export function calculateSpermValuation(input: DonorProfileInput) {
  const ageFactor = FACTORS.age[input.ageRange];
  const eduFactor = FACTORS.education[input.educationLevel];
  const famFactor = FACTORS.recipientFamilies[input.recipientFamilies];
  const transparencyFactor = FACTORS.transparency[input.transparencyLevel];
  const bmiFactor = FACTORS.bmi[input.bmiRange];
  const testoFactor = FACTORS.testosteroneSupp[input.testosteroneUse];
  const smokeFactor = FACTORS.smokingDrugs[input.smokingDrugs];
  const stressFactor = FACTORS.stressLevel[input.stressLevel];
  const ejFactor = FACTORS.ejaculationFreq[input.ejaculationFreq];

  // --- sub-scores ---
  const demographicScoreRaw =
    (ageFactor * WEIGHTS.age + eduFactor * WEIGHTS.education) /
    DEMOGRAPHIC_WEIGHT_TOTAL;

  const involvementScoreRaw =
    (famFactor * WEIGHTS.recipientFamilies +
      transparencyFactor * WEIGHTS.transparency) /
    INVOLVEMENT_WEIGHT_TOTAL;

  const spermHealthScoreRaw =
    (bmiFactor * WEIGHTS.bmi +
      testoFactor * WEIGHTS.testosteroneSupp +
      smokeFactor * WEIGHTS.smokingDrugs +
      stressFactor * WEIGHTS.stressLevel +
      ejFactor * WEIGHTS.ejaculationFreq) /
    SPERM_HEALTH_WEIGHT_TOTAL;

  // --- overall score ---
  const overallScore =
    demographicScoreRaw * DEMOGRAPHIC_WEIGHT_TOTAL +
    involvementScoreRaw * INVOLVEMENT_WEIGHT_TOTAL +
    spermHealthScoreRaw * SPERM_HEALTH_WEIGHT_TOTAL;

  const estimatedSpermValue = overallScore * BASE_VALUE;

  // --- advisory messages ---
  const messages: string[] = [];

  if (involvementScoreRaw < 0.55) {
    messages.push(
      "Your sperm could be worth more if you're willing to limit the number of recipient families and/or offer more transparency."
    );
  }

  if (spermHealthScoreRaw < 0.5) {
    messages.push(
      "Your sperm could be worth more if you improve lifestyle factors like smoking/drugs, stress, BMI, ejaculation frequency, or testosterone supplementation."
    );
  }

  return {
    demographicScore: round4(demographicScoreRaw),
    involvementScore: round4(involvementScoreRaw),
    spermHealthScore: round4(spermHealthScoreRaw),
    overallScore: round4(overallScore),
    estimatedSpermValue: round2(estimatedSpermValue),
    messages,
  };
}

function round4(n: number) {
  return Math.round(n * 10000) / 10000;
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// Helper to calculate BMI range from height/weight
export function calculateBMIRange(heightFeet: number, heightInches: number, weight: number): DonorProfileInput['bmiRange'] {
  const totalInches = heightFeet * 12 + heightInches;
  const heightMeters = totalInches * 0.0254;
  const weightKg = weight * 0.453592;
  const bmi = weightKg / (heightMeters * heightMeters);

  if (bmi < 18.5) return "Underweight (<18.5)";
  if (bmi < 25) return "Healthy weight (18.5-24.9)";
  if (bmi < 30) return "Overweight (25-29.9)";
  return "Obese (30+)";
}

// Helper to convert age to age range
export function getAgeRange(age: number): DonorProfileInput['ageRange'] {
  if (age >= 18 && age <= 38) return "18-38";
  if (age >= 39 && age <= 50) return "39-50";
  return "51+";
}
