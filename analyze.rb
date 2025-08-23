require 'csv'

# The goal here is to find potential letter combinations to be used in spelling games.
# We can leverage a scrabble dictionary to do this analysis. We'd like every game to have 
# a pangram, so we start by finding all the words which have seven unique letters to use 
# as candidates. We also need to make sure that there are enough potential words to find,
# and what the max possible score is. We also need to do this for each possible choice of 
# the central letter.
#
# Unfortunately, this computation would take several days if done the brute-force way.
# Here's a faster way to do it:
# - We only need to know the *unique* letters of a word to find out if it's valid in a given game.
# - We can represent the "fingerprint" of a word this way, so that similar words can be combined
#   - E.g. APPLE and LEAP both become AELP
# - We can use these fingerprints as keys in a hashmap, where the values are Scores
#   - A Score object just tracks the number of words and total possible score for a fingerprint
# - Once we have a list of 7-letter combination candidates (Combos), we can figure out
#   all possible fingerprints and check then against the hash
#   - Crucially, there can only be 127 of these (2^7 - 1 for the empty string)
#   - These scores can be added up for each of the 7 central letter choices where they are valid
#
# This approach reduces the time complexity from O(n^2) to O(n) and takes seconds instead of days

# Class that runs the algorithm described above
class Analyzer
  def initialize(dict_file, out_file, min_words = 30, max_words = 60)
    @dict_file = dict_file
    @out_file = out_file
    @min_words = min_words
    @max_words = max_words
  end

  def run
    start = Time.now

    precompute_fingerprints_and_combos!
    compute_combo_stats!
    write_to_csv!
    # pretty_print

    puts "Finished in #{Time.now - start}s"
  end

  def precompute_fingerprints_and_combos!
    @fingerprint_map = Hash.new(Score.new(0, 0))
    combo_map = {}

    File.open(@dict_file).each_line.map do |line|
      word = Word.new(line)

      next unless word.valid?

      @fingerprint_map[word.fingerprint] += word.score
      combo_map[word.fingerprint] = Combo.new(word.fingerprint) if word.fingerprint.size == 7
    end

    @combos = combo_map.values
  end

  def compute_combo_stats!
    @combos.each do |combo|
      combo.possible_fingerprints.each do |fingerprint|
        fingerprint_score = @fingerprint_map[fingerprint]

        fingerprint.chars.each do |central_letter|
          combo.central_letter_scores[central_letter] += fingerprint_score
        end
      end
    end
  end

  def pretty_print
    @combos.first(10).each do |combo|
      combo.central_letter_scores.each do |central_letter, score|
        puts "#{combo.fingerprint} | #{central_letter} | #{score.words} | #{score.points}"
      end
    end
  end

  def write_to_csv!
    valid_count = 0

    CSV.open(@out_file, 'wb') do |csv|
      csv << ['Letters', 'Central Letter', 'Total Words', 'Total Points']

      @combos.each do |combo|
        combo.central_letter_scores.each do |central_letter, score|
          next unless score.words >= @min_words && score.words <= @max_words
          csv << [combo.fingerprint, central_letter, score.words, score.points]

          valid_count +=1
        end
      end
    end

    puts "Combo stats written to #{@out_file} - #{valid_count} rows"
  end
end


# Represents a dictionary word
class Word
  def initialize(word)
    @chars = word.strip.upcase.chars
  end

  def valid?
    @chars.size >= 4 && fingerprint.size <= 7 && fingerprint =~ /\A[A-Z]*\z/
  end

  def fingerprint
    @fingerprint ||= @chars.uniq.sort.join
  end

  def score
    points = @chars.size == 4 ? 1 : @chars.size
    points += 7 if fingerprint.size == 7

    Score.new(1, points)
  end

  def to_s
    @chars.join
  end
end

# Represents a 7-letter combination as a candidate for a Spelling Bee game.
# Tracks possible word count and points separately for each choice of a central letter
class Combo
  attr_reader :fingerprint, :central_letter_scores

  def initialize(fingerprint)
    raise "Not seven unique characters" unless fingerprint.size == 7

    @fingerprint = fingerprint
    @central_letter_scores = Hash.new(Score.new(0,0))
  end

  def possible_fingerprints(chars = fingerprint, prefix = '')
    if chars.empty? && prefix.empty?
      []
    elsif chars.empty?
      [prefix]
    else
      next_char = chars[0]
      rest = chars[1..-1]

      possible_fingerprints(rest, prefix) + possible_fingerprints(rest, prefix + next_char)
    end
  end
end

# Convenience object for tracking words and points so they can be easily added
class Score
  attr_reader :words, :points

  def initialize(words, points)
    @words = words
    @points = points
  end

  def +(other) 
    Score.new(other.words + words, other.points + points)
  end
end

Analyzer.new('dictionary.csv', 'game_stats.csv', 30, 60).run


