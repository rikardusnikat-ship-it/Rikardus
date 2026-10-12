import { Assignment, GradingResult, CriteriaScore } from './types';

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function analyzeVocabulary(text: string): number {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const uniqueWords = new Set(words);
  return uniqueWords.size / Math.max(words.length, 1);
}

function analyzeSentenceStructure(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;
  const lengths = sentences.map(s => s.trim().split(/\s+/).length);
  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, l) => sum + Math.pow(l - avgLength, 2), 0) / lengths.length;
  // Good variance means diverse sentence structures
  return Math.min(variance / 50, 1);
}

function checkParagraphStructure(text: string): number {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  if (paragraphs.length < 2) return 0.3;
  if (paragraphs.length >= 3) return 1;
  return 0.7;
}

function generateFeedback(totalScore: number, assignment: Assignment): string {
  if (totalScore >= 85) {
    return `Esai Anda menunjukkan pemahaman yang sangat baik terhadap topik "${assignment.title}". Argumentasi yang dibangun kuat dan didukung oleh contoh-contoh yang relevan. Struktur penulisan rapi dan mudah diikuti. Pertahankan kualitas ini dan terus kembangkan analisis kritis Anda.`;
  } else if (totalScore >= 70) {
    return `Esai Anda menunjukkan pemahaman yang baik terhadap topik yang dibahas. Namun, ada beberapa area yang perlu ditingkatkan terutama dalam kedalaman analisis dan penggunaan contoh yang lebih spesifik. Cobalah untuk mengembangkan argumen dengan lebih detail.`;
  } else if (totalScore >= 55) {
    return `Esai Anda menunjukkan pemahaman dasar yang cukup terhadap topik. Namun, analisis masih perlu diperdalam dan struktur penulisan perlu diperbaiki. Disarankan untuk membaca lebih banyak referensi terkait dan melatih kemampuan menulis akademis.`;
  } else {
    return `Esai Anda memerlukan perbaikan yang signifikan. Topik yang dibahas belum teranalisis dengan mendalam dan struktur penulisan kurang terorganisir. Sangat disarankan untuk merevisi dengan membaca literatur terkait lebih banyak dan berkonsultasi dengan dosen pembimbing.`;
  }
}

function generateStrengths(totalScore: number): string[] {
  const allStrengths = [
    'Penggunaan kosakata yang bervariasi dan tepat',
    'Struktur paragraf yang terorganisir dengan baik',
    'Argumentasi yang logis dan sistematis',
    'Pemilihan contoh yang relevan dengan topik',
    'Gaya penulisan yang mengalir dan mudah dipahami',
    'Kemampuan analisis kritis yang baik',
    'Penggunaan data dan fakta yang mendukung argumen',
    'Penyajian perspektif yang beragam',
  ];
  const count = totalScore >= 80 ? 4 : totalScore >= 60 ? 3 : 2;
  return allStrengths.sort(() => Math.random() - 0.5).slice(0, count);
}

function generateImprovements(totalScore: number): string[] {
  const allImprovements = [
    'Perdalam analisis dengan menambahkan perspektif teoritis',
    'Gunakan lebih banyak contoh konkret dan studi kasus',
    'Perbaiki transisi antar paragraf agar lebih koheren',
    'Kembangkan argumen dengan bukti empiris yang lebih kuat',
    'Tambahkan kesimpulan yang lebih komprehensif',
    'Perhatikan konsistensi gaya penulisan',
    'Perluas pembahasan dengan membandingkan berbagai sudut pandang',
    'Perkuat bagian pendahuluan untuk menarik perhatian pembaca',
  ];
  const count = totalScore >= 80 ? 1 : totalScore >= 60 ? 2 : 3;
  return allImprovements.sort(() => Math.random() - 0.5).slice(0, count);
}

export function gradeEssay(
  answer: string,
  assignment: Assignment,
  typingTime: number,
  pasteAttempts: number
): GradingResult {
  const wordCount = countWords(answer);
  const vocabScore = analyzeVocabulary(answer);
  const sentenceScore = analyzeSentenceStructure(answer);
  const paragraphScore = checkParagraphStructure(answer);

  // Integrity score based on typing behavior
  let integrityScore = 100;
  if (pasteAttempts > 0) {
    integrityScore -= pasteAttempts * 25;
  }
  // If typing time is too short for the word count, suspicious
  const wordsPerMinute = wordCount / Math.max(typingTime / 60, 0.1);
  if (wordsPerMinute > 100) {
    integrityScore -= 30;
  } else if (wordsPerMinute > 60) {
    integrityScore -= 15;
  }
  integrityScore = Math.max(0, Math.min(100, integrityScore));

  // Calculate criteria scores
  const criteriaScores: CriteriaScore[] = assignment.rubric.map((rubric) => {
    let baseScore = Math.random() * 0.3 + 0.5; // Base randomness 0.5-0.8

    // Word count impact
    const targetMin = 300;
    const targetMax = 600;
    if (wordCount < targetMin) {
      baseScore *= 0.6;
    } else if (wordCount > targetMax) {
      baseScore *= 0.9;
    }

    // Vocabulary richness
    baseScore += vocabScore * 0.15;

    // Sentence structure
    baseScore += sentenceScore * 0.1;

    // Paragraph structure
    baseScore += paragraphScore * 0.1;

    // Integrity impact
    if (integrityScore < 50) {
      baseScore *= 0.7;
    }

    const score = Math.round(Math.min(rubric.maxScore, Math.max(0, baseScore * rubric.maxScore)));

    let comment = '';
    const ratio = score / rubric.maxScore;
    if (ratio >= 0.8) {
      comment = `Sangat baik. ${rubric.criteria} menunjukkan kualitas tinggi.`;
    } else if (ratio >= 0.6) {
      comment = `Baik. ${rubric.criteria} cukup memadai namun masih dapat ditingkatkan.`;
    } else if (ratio >= 0.4) {
      comment = `Cukup. ${rubric.criteria} memerlukan perbaikan dan pendalaman.`;
    } else {
      comment = `Kurang. ${rubric.criteria} belum memenuhi standar yang diharapkan.`;
    }

    return { criteria: rubric.criteria, score, maxScore: rubric.maxScore, comment };
  });

  const totalScore = criteriaScores.reduce((sum, c) => sum + c.score, 0);

  let grade: string;
  if (totalScore >= 85) grade = 'A';
  else if (totalScore >= 75) grade = 'B+';
  else if (totalScore >= 65) grade = 'B';
  else if (totalScore >= 55) grade = 'C+';
  else if (totalScore >= 45) grade = 'C';
  else if (totalScore >= 35) grade = 'D';
  else grade = 'E';

  const feedback = generateFeedback(totalScore, assignment);
  const strengths = generateStrengths(totalScore);
  const improvements = generateImprovements(totalScore);
  const aiConfidence = Math.round(75 + Math.random() * 20);

  return {
    submissionId: '',
    totalScore,
    maxScore: assignment.maxScore,
    grade,
    criteriaScores,
    feedback,
    strengths,
    improvements,
    aiConfidence,
    integrityScore,
  };
}
