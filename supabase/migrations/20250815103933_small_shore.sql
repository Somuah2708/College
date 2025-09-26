/*
  # Create aptitude questions table

  1. New Tables
    - `aptitude_questions`
      - `id` (uuid, primary key)
      - `question` (text, the question text)
      - `options` (jsonb, array of answer options)
      - `correct_answer` (integer, index of correct option)
      - `category` (text, question category)
      - `difficulty` (text, difficulty level)
      - `explanation` (text, optional explanation)
      - `time_limit` (integer, seconds allowed)
      - `order_index` (integer, for ordering)
      - `active` (boolean, whether question is active)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `aptitude_questions` table
    - Add policy for public read access to active questions

  3. Sample Data
    - Insert comprehensive set of aptitude questions across categories
*/

CREATE TABLE IF NOT EXISTS aptitude_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer integer NOT NULL,
  category text NOT NULL DEFAULT 'logical',
  difficulty text NOT NULL DEFAULT 'medium',
  explanation text DEFAULT '',
  time_limit integer DEFAULT 120,
  order_index integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE aptitude_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aptitude questions are publicly readable"
  ON aptitude_questions
  FOR SELECT
  TO public
  USING (active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_aptitude_questions_category ON aptitude_questions(category);
CREATE INDEX IF NOT EXISTS idx_aptitude_questions_difficulty ON aptitude_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_aptitude_questions_active ON aptitude_questions(active);
CREATE INDEX IF NOT EXISTS idx_aptitude_questions_order ON aptitude_questions(order_index);

-- Insert comprehensive sample questions
INSERT INTO aptitude_questions (question, options, correct_answer, category, difficulty, explanation, time_limit, order_index) VALUES
-- Logical Reasoning Questions
('What comes next in this sequence: 2, 4, 8, 16, ?', '["24", "32", "20", "28"]', 1, 'logical', 'easy', 'This is a geometric sequence where each number is doubled.', 60, 1),
('If all Bloops are Razzles and all Razzles are Lazzles, then all Bloops are definitely Lazzles.', '["True", "False", "Cannot be determined", "Sometimes true"]', 0, 'logical', 'medium', 'This follows the transitive property of logical statements.', 90, 2),
('All cats are animals. Some animals are dogs. Therefore, some cats are dogs.', '["True", "False", "Cannot be determined", "Sometimes true"]', 1, 'logical', 'medium', 'This is a logical fallacy. The conclusion does not follow from the premises.', 90, 3),
('If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?', '["5 minutes", "20 minutes", "100 minutes", "500 minutes"]', 0, 'logical', 'hard', 'Each machine makes 1 widget in 5 minutes, regardless of how many machines there are.', 120, 4),
('If some Glips are Flops and no Flops are Mops, then some Glips are definitely not Mops.', '["True", "False", "Cannot be determined", "Sometimes false"]', 0, 'logical', 'hard', 'Since some Glips are Flops and no Flops are Mops, those Glips that are Flops cannot be Mops.', 120, 5),

-- Mathematical Questions
('What is 15% of 240?', '["36", "32", "40", "38"]', 0, 'mathematical', 'medium', '15% of 240 = 0.15 × 240 = 36', 90, 6),
('What is the next number in the sequence: 1, 1, 2, 3, 5, 8, ?', '["11", "13", "15", "10"]', 1, 'mathematical', 'hard', 'This is the Fibonacci sequence where each number is the sum of the two preceding ones.', 120, 7),
('If x + 5 = 12, what is x - 3?', '["4", "5", "6", "7"]', 0, 'mathematical', 'easy', 'First solve for x: x = 12 - 5 = 7. Then x - 3 = 7 - 3 = 4', 60, 8),
('What is 2³ × 3²?', '["72", "54", "36", "48"]', 0, 'mathematical', 'medium', '2³ = 8, 3² = 9, so 8 × 9 = 72', 90, 9),
('If a train travels 120 miles in 2 hours, what is its average speed in miles per hour?', '["60", "50", "70", "80"]', 0, 'mathematical', 'easy', 'Speed = Distance ÷ Time = 120 ÷ 2 = 60 mph', 60, 10),

-- Verbal Reasoning Questions
('Which word does not belong: Apple, Orange, Banana, Carrot, Grape', '["Apple", "Orange", "Carrot", "Grape"]', 2, 'verbal', 'easy', 'Carrot is a vegetable while the others are fruits.', 60, 11),
('Complete the analogy: Book is to Reading as Fork is to ?', '["Kitchen", "Eating", "Spoon", "Food"]', 1, 'verbal', 'easy', 'A book is used for reading, just as a fork is used for eating.', 60, 12),
('Which word is the odd one out: Run, Jump, Swim, Think, Walk', '["Run", "Jump", "Think", "Walk"]', 2, 'verbal', 'medium', 'Think is a mental activity while the others are physical activities.', 90, 13),
('What comes next: Monday, Wednesday, Friday, ?', '["Saturday", "Sunday", "Tuesday", "Thursday"]', 1, 'verbal', 'easy', 'The pattern skips one day each time: Mon, Wed, Fri, Sun', 60, 14),
('Synonym for "Ubiquitous": ', '["Rare", "Everywhere", "Hidden", "Temporary"]', 1, 'verbal', 'hard', 'Ubiquitous means existing or being everywhere at the same time.', 120, 15),

-- Spatial Reasoning Questions
('If you fold a piece of paper in half 3 times, how many sections will you have?', '["6", "8", "9", "12"]', 1, 'spatial', 'medium', 'Each fold doubles the sections: 1→2→4→8 sections', 90, 16),
('How many cubes are in a 3×3×3 cube structure?', '["9", "18", "27", "36"]', 2, 'spatial', 'easy', '3 × 3 × 3 = 27 cubes', 60, 17),
('Which shape would complete the pattern? [Triangle pointing up, down, left, ?]', '["Triangle pointing up", "Triangle pointing down", "Triangle pointing left", "Triangle pointing right"]', 3, 'spatial', 'medium', 'The pattern rotates 90 degrees clockwise each time.', 90, 18),
('If you rotate a square 45 degrees, what shape do you see?', '["Rectangle", "Diamond", "Circle", "Triangle"]', 1, 'spatial', 'easy', 'A square rotated 45 degrees appears as a diamond shape.', 60, 19),
('How many faces does a cube have?', '["4", "6", "8", "12"]', 1, 'spatial', 'easy', 'A cube has 6 faces: top, bottom, front, back, left, and right.', 60, 20),

-- Abstract Reasoning Questions
('In a sequence of shapes, if circle becomes square, and square becomes triangle, what does triangle become?', '["Circle", "Rectangle", "Pentagon", "Diamond"]', 0, 'abstract', 'medium', 'Following the pattern: circle→square→triangle→circle', 90, 21),
('If RED = 123, BLUE = 1234, what does GREEN equal?', '["12345", "54321", "13245", "15432"]', 0, 'abstract', 'hard', 'Each letter is assigned a number based on its position in the word.', 120, 22),
('Pattern: ○●○●○ What comes next?', '["○", "●", "○●", "●○"]', 1, 'abstract', 'easy', 'The pattern alternates between empty and filled circles.', 60, 23),

-- Critical Thinking Questions
('A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?', '["$0.10", "$0.05", "$0.15", "$0.20"]', 1, 'critical_thinking', 'hard', 'If ball costs x, then bat costs x+1. So x + (x+1) = 1.10, which gives x = 0.05', 150, 24),
('In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take for the patch to cover half the lake?', '["24 days", "47 days", "46 days", "25 days"]', 1, 'critical_thinking', 'hard', 'If the patch doubles each day and covers the whole lake on day 48, it covered half on day 47.', 150, 25),

-- Pattern Recognition Questions
('What number should replace the question mark: 2, 6, 12, 20, 30, ?', '["42", "40", "38", "44"]', 0, 'pattern_recognition', 'medium', 'The differences are 4, 6, 8, 10, so next difference is 12: 30 + 12 = 42', 90, 26),
('Complete the series: A1, C3, E5, G7, ?', '["I9", "H8", "I8", "J10"]', 0, 'pattern_recognition', 'medium', 'Letters skip one (A,C,E,G,I) and numbers increase by 2 (1,3,5,7,9)', 90, 27),

-- Memory and Attention Questions
('Study this sequence for 5 seconds: 7, 3, 9, 1, 5. What was the third number?', '["7", "3", "9", "1"]', 2, 'memory', 'medium', 'The sequence was 7, 3, 9, 1, 5 - the third number is 9', 30, 28),
('How many times does the letter "F" appear in this sentence: "The quick brown fox jumps over the lazy dog"?', '["0", "1", "2", "3"]', 1, 'attention', 'easy', 'The letter F appears once in "fox"', 60, 29),

-- Quantitative Reasoning Questions
('If 3 apples cost $2.40, how much do 8 apples cost?', '["$6.40", "$5.60", "$7.20", "$6.00"]', 0, 'quantitative', 'medium', 'Cost per apple = $2.40 ÷ 3 = $0.80. So 8 apples = 8 × $0.80 = $6.40', 90, 30);