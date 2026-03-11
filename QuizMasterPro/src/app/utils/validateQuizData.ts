// Utility to validate quiz data structure and completeness
import { questions, categories } from '../data/quizData';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalQuestions: number;
    categoryBreakdown: Record<string, Record<string, number>>;
  };
}

export function validateQuizData(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const categoryBreakdown: Record<string, Record<string, number>> = {};

  // Initialize category breakdown
  categories.forEach(cat => {
    categoryBreakdown[cat.id] = { easy: 0, medium: 0, hard: 0 };
  });

  // Count questions per category and difficulty
  questions.forEach((q, index) => {
    // Validate question structure
    if (!q.id) errors.push(`Question at index ${index} is missing an ID`);
    if (!q.question || q.question.trim() === '') {
      errors.push(`Question ID ${q.id} has an empty question text`);
    }
    if (!q.options || q.options.length !== 4) {
      errors.push(`Question ID ${q.id} must have exactly 4 options`);
    }
    if (q.correctAnswer < 0 || q.correctAnswer > 3) {
      errors.push(`Question ID ${q.id} has invalid correctAnswer index: ${q.correctAnswer}`);
    }
    if (!q.category) {
      errors.push(`Question ID ${q.id} is missing a category`);
    }
    if (!q.difficulty || !['easy', 'medium', 'hard'].includes(q.difficulty)) {
      errors.push(`Question ID ${q.id} has invalid difficulty: ${q.difficulty}`);
    }

    // Count for stats
    if (q.category && q.difficulty && categoryBreakdown[q.category]) {
      categoryBreakdown[q.category][q.difficulty] = 
        (categoryBreakdown[q.category][q.difficulty] || 0) + 1;
    }
  });

  // Check for duplicate IDs
  const ids = questions.map(q => q.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate question IDs found: ${duplicateIds.join(', ')}`);
  }

  // Validate category requirements
  Object.entries(categoryBreakdown).forEach(([category, difficulties]) => {
    const { easy, medium, hard } = difficulties;
    
    if (easy < 3) {
      warnings.push(`${category}: Only ${easy} easy questions (minimum 3 recommended)`);
    }
    if (medium < 3) {
      warnings.push(`${category}: Only ${medium} medium questions (minimum 3 recommended)`);
    }
    if (hard < 2) {
      warnings.push(`${category}: Only ${hard} hard questions (minimum 2 recommended)`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalQuestions: questions.length,
      categoryBreakdown
    }
  };
}

// Run validation on import in development mode
if (process.env.NODE_ENV === 'development') {
  const result = validateQuizData();
  
  if (!result.isValid) {
    console.error('❌ Quiz Data Validation FAILED:');
    result.errors.forEach(err => console.error(`  - ${err}`));
  } else {
    console.log('✅ Quiz Data Validation PASSED');
  }
  
  if (result.warnings.length > 0) {
    console.warn('⚠️  Warnings:');
    result.warnings.forEach(warn => console.warn(`  - ${warn}`));
  }
  
  console.log('\n📊 Quiz Statistics:');
  console.log(`  Total Questions: ${result.stats.totalQuestions}`);
  console.log('\n  Category Breakdown:');
  Object.entries(result.stats.categoryBreakdown).forEach(([cat, diff]) => {
    console.log(`    ${cat}: Easy(${diff.easy}) Medium(${diff.medium}) Hard(${diff.hard})`);
  });
}
