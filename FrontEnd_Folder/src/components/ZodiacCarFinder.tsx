import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Sparkles, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

interface ZodiacRecommendation {
  sign: string;
  dates: string;
  element: string;
  traits: string[];
  recommendedCar: string;
  reason: string;
  emoji: string;
  color: string;
}

const zodiacData: ZodiacRecommendation[] = [
  {
    sign: 'Aries',
    dates: 'March 21 - April 19',
    element: 'Fire',
    traits: ['Bold', 'Ambitious', 'Confident'],
    recommendedCar: 'Toyota GR Supra',
    reason: 'Your adventurous spirit and love for excitement make the powerful GR Supra your perfect match. Bold and fast, just like you!',
    emoji: '♈',
    color: 'from-red-500 to-orange-500'
  },
  {
    sign: 'Taurus',
    dates: 'April 20 - May 20',
    element: 'Earth',
    traits: ['Reliable', 'Patient', 'Practical'],
    recommendedCar: 'Toyota Camry',
    reason: 'Dependable and comfortable, the Camry matches your appreciation for quality and reliability. A timeless choice for a timeless sign.',
    emoji: '♉',
    color: 'from-green-500 to-emerald-500'
  },
  {
    sign: 'Gemini',
    dates: 'May 21 - June 20',
    element: 'Air',
    traits: ['Versatile', 'Curious', 'Adaptable'],
    recommendedCar: 'Toyota Prius',
    reason: 'Your dual nature loves the Prius\'s hybrid versatility. Innovative and efficient, perfect for your dynamic lifestyle.',
    emoji: '♊',
    color: 'from-yellow-500 to-amber-500'
  },
  {
    sign: 'Cancer',
    dates: 'June 21 - July 22',
    element: 'Water',
    traits: ['Nurturing', 'Protective', 'Loyal'],
    recommendedCar: 'Toyota Highlander',
    reason: 'Family-focused and protective, the spacious Highlander keeps your loved ones safe and comfortable on every journey.',
    emoji: '♋',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    sign: 'Leo',
    dates: 'July 23 - August 22',
    element: 'Fire',
    traits: ['Confident', 'Generous', 'Leader'],
    recommendedCar: 'Toyota Tundra',
    reason: 'Bold and commanding presence! The Tundra\'s power and style match your regal personality and leadership qualities.',
    emoji: '♌',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    sign: 'Virgo',
    dates: 'August 23 - September 22',
    element: 'Earth',
    traits: ['Analytical', 'Practical', 'Organized'],
    recommendedCar: 'Toyota Corolla',
    reason: 'Efficient and meticulously designed, the Corolla\'s practicality and attention to detail mirror your perfectionist nature.',
    emoji: '♍',
    color: 'from-teal-500 to-green-500'
  },
  {
    sign: 'Libra',
    dates: 'September 23 - October 22',
    element: 'Air',
    traits: ['Balanced', 'Harmonious', 'Diplomatic'],
    recommendedCar: 'Toyota Avalon',
    reason: 'Elegant and refined, the Avalon offers the perfect balance of luxury and practicality that speaks to your aesthetic sense.',
    emoji: '♎',
    color: 'from-pink-500 to-rose-500'
  },
  {
    sign: 'Scorpio',
    dates: 'October 23 - November 21',
    element: 'Water',
    traits: ['Intense', 'Passionate', 'Mysterious'],
    recommendedCar: 'Toyota 4Runner',
    reason: 'Powerful and enigmatic, the 4Runner\'s rugged capability matches your intense and adventurous spirit.',
    emoji: '♏',
    color: 'from-purple-500 to-pink-500'
  },
  {
    sign: 'Sagittarius',
    dates: 'November 22 - December 21',
    element: 'Fire',
    traits: ['Adventurous', 'Optimistic', 'Free-spirited'],
    recommendedCar: 'Toyota Tacoma',
    reason: 'Ready for any adventure! The Tacoma\'s go-anywhere attitude perfectly complements your wanderlust and love of freedom.',
    emoji: '♐',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    sign: 'Capricorn',
    dates: 'December 22 - January 19',
    element: 'Earth',
    traits: ['Ambitious', 'Disciplined', 'Responsible'],
    recommendedCar: 'Toyota Sequoia',
    reason: 'Strong and dependable, the Sequoia reflects your steadfast determination and ability to handle any responsibility.',
    emoji: '♑',
    color: 'from-slate-500 to-gray-500'
  },
  {
    sign: 'Aquarius',
    dates: 'January 20 - February 18',
    element: 'Air',
    traits: ['Innovative', 'Independent', 'Humanitarian'],
    recommendedCar: 'Toyota bZ4X',
    reason: 'Forward-thinking and eco-conscious, the electric bZ4X aligns with your innovative vision for a better future.',
    emoji: '♒',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    sign: 'Pisces',
    dates: 'February 19 - March 20',
    element: 'Water',
    traits: ['Intuitive', 'Compassionate', 'Artistic'],
    recommendedCar: 'Toyota RAV4',
    reason: 'Adaptable and intuitive, the RAV4\'s versatility matches your fluid nature and ability to navigate life\'s currents.',
    emoji: '♓',
    color: 'from-blue-500 to-indigo-500'
  }
];

function getZodiacSign(date: Date): ZodiacRecommendation {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacData[0]; // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacData[1]; // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacData[2]; // Gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacData[3]; // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacData[4]; // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacData[5]; // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacData[6]; // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacData[7]; // Scorpio
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacData[8]; // Sagittarius
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacData[9]; // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacData[10]; // Aquarius
  return zodiacData[11]; // Pisces
}

export function ZodiacCarFinder() {
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [recommendation, setRecommendation] = useState<ZodiacRecommendation | null>(null);

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const getDaysInMonth = (m: number, y: number) => {
    return new Date(y, m, 0).getDate();
  };

  const generateDays = () => {
    if (!month) return Array.from({ length: 31 }, (_, i) => i + 1);
    const m = parseInt(month);
    const y = year ? parseInt(year) : 2000;
    const daysInMonth = getDaysInMonth(m, y);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const generateYears = () => {
    const currentYear = 2025;
    const years = [];
    for (let i = currentYear; i >= 1940; i--) {
      years.push(i);
    }
    return years;
  };

  const findYourCar = () => {
    if (month && day && year) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const zodiac = getZodiacSign(date);
      setRecommendation(zodiac);
    }
  };

  const isFormComplete = month && day && year;

  return (
    <div className="bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-8 h-8 text-purple-300 animate-pulse" />
            <h2 className="text-5xl text-white">
              Cosmic Car Match
            </h2>
            <Star className="w-8 h-8 text-purple-300 animate-pulse" />
          </div>
          <p className="text-xl text-purple-200">
            Let the stars guide you to your perfect Toyota
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-md border-purple-300/30 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl justify-center">
                <Sparkles className="w-6 h-6 text-purple-300" />
                Enter Your Birthday
                <Sparkles className="w-6 h-6 text-purple-300" />
              </CardTitle>
              <p className="text-purple-200 text-center">
                Discover which Toyota aligns with your zodiac personality
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-md space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="month" className="text-purple-200 mb-2 block">Month</Label>
                      <Select value={month} onValueChange={setMonth}>
                        <SelectTrigger id="month" className="bg-white/20 border-purple-300/50 text-white">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="day" className="text-purple-200 mb-2 block">Day</Label>
                      <Select value={day} onValueChange={setDay}>
                        <SelectTrigger id="day" className="bg-white/20 border-purple-300/50 text-white">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateDays().map((d) => (
                            <SelectItem key={d} value={d.toString()}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="year" className="text-purple-200 mb-2 block">Year</Label>
                      <Select value={year} onValueChange={setYear}>
                        <SelectTrigger id="year" className="bg-white/20 border-purple-300/50 text-white">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateYears().map((y) => (
                            <SelectItem key={y} value={y.toString()}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={findYourCar}
                  disabled={!isFormComplete}
                  className="w-full max-w-md bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg shadow-lg shadow-purple-500/50 disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Reveal My Cosmic Match
                </Button>
              </div>

              {recommendation && (
                <div className="mt-8 space-y-6 animate-in fade-in duration-500">
                  {/* Zodiac Sign Header */}
                  <div className={`bg-gradient-to-r ${recommendation.color} p-8 rounded-xl text-center`}>
                    <div className="text-6xl mb-3">{recommendation.emoji}</div>
                    <h3 className="text-3xl mb-2">{recommendation.sign}</h3>
                    <p className="text-white/90">{recommendation.dates}</p>
                    <div className="mt-3">
                      <span className="inline-block bg-white/30 px-4 py-1 rounded-full">
                        {recommendation.element} Sign
                      </span>
                    </div>
                  </div>

                  {/* Personality Traits */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-300/30">
                    <h4 className="text-xl mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-300" />
                      Your Cosmic Traits
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.traits.map((trait, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-600/50 px-4 py-2 rounded-full border border-purple-300/50"
                        >
                          ✨ {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Car Recommendation */}
                  <div className={`bg-gradient-to-br ${recommendation.color} p-8 rounded-xl border-2 border-white/30`}>
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">🚗</div>
                      <h4 className="text-3xl mb-2">Your Perfect Match</h4>
                      <p className="text-4xl mb-6">{recommendation.recommendedCar}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg">
                      <p className="text-lg leading-relaxed">
                        {recommendation.reason}
                      </p>
                    </div>
                    <div className="mt-6 flex gap-4 justify-center">
                      <Button
                        variant="outline"
                        className="border-white text-white hover:bg-white/20"
                        onClick={() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Search This Model
                      </Button>
                      <Button
                        className="bg-white text-purple-900 hover:bg-white/90"
                        onClick={() => document.getElementById('calculators')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Calculate Payment
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
