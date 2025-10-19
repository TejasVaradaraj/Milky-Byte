import { useState, useEffect } from 'react';
import { GitCompare, Mail, Check, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const BASE_URL = 'http://localhost:8000';

interface Vehicle {
  id: number;
  year: number;
  make: string;
  model: string;
  price: number;
  horsepower: number;
  mileage: number;
  mpg_combined: number;
  image?: string;
  fuel_type?: string;
  body_type?: string;
}

interface FinanceData {
  apr_percent: number;
  months: number;
  downpayment: number;
  monthly_payment: number;
  total_paid: number;
}

interface ComparisonResult {
  inputs: {
    credit_score: number;
    months: number;
    downpayment: number;
  };
  carA: Vehicle;
  financeA: FinanceData;
  carB: Vehicle;
  financeB: FinanceData;
  diffs: {
    price_diff: number;
    mpg_combined_diff: number;
    horsepower_diff: number;
    mileage_diff: number;
    year_diff: number;
    monthly_payment_diff: number;
  };
}

export function ComparePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleA, setVehicleA] = useState<string>('');
  const [vehicleB, setVehicleB] = useState<string>('');
  const [creditScore, setCreditScore] = useState('720');
  const [loanTerm, setLoanTerm] = useState('60');
  const [downPayment, setDownPayment] = useState('5000');
  const [userEmail, setUserEmail] = useState('');
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [emailStatus, setEmailStatus] = useState<string>('');

  // Load vehicles on mount
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const response = await fetch(`${BASE_URL}/filter?limit=100`);
      const data = await response.json();
      setVehicles(data.results);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  const handleCompare = async () => {
    if (!vehicleA || !vehicleB) {
      alert('Please select two vehicles to compare');
      return;
    }

    try {
      const params = new URLSearchParams({
        id1: vehicleA,
        id2: vehicleB,
        credit_score: creditScore,
        months: loanTerm,
        downpayment: downPayment,
      });

      const response = await fetch(`${BASE_URL}/compare?${params.toString()}`);
      const data = await response.json();

      if (data.error) {
        alert('Error: ' + data.error);
        return;
      }

      setComparisonResult(data);
    } catch (error) {
      console.error('Error comparing vehicles:', error);
      alert('Failed to compare vehicles');
    }
  };

  const handleSendEmail = async () => {
    if (!userEmail) {
      alert('Please enter your email address');
      return;
    }

    if (!comparisonResult) {
      alert('Please compare vehicles first');
      return;
    }

    setEmailStatus('Sending...');

    try {
      // Create a formatted comparison email body
      const emailBody = `
Vehicle Comparison Results

Vehicle A: ${comparisonResult.carA.year} ${comparisonResult.carA.make} ${comparisonResult.carA.model}
Price: $${comparisonResult.carA.price.toLocaleString()}
Monthly Payment: $${comparisonResult.financeA.monthly_payment}
MPG: ${comparisonResult.carA.mpg_combined}
Horsepower: ${comparisonResult.carA.horsepower}

Vehicle B: ${comparisonResult.carB.year} ${comparisonResult.carB.make} ${comparisonResult.carB.model}
Price: $${comparisonResult.carB.price.toLocaleString()}
Monthly Payment: $${comparisonResult.financeB.monthly_payment}
MPG: ${comparisonResult.carB.mpg_combined}
Horsepower: ${comparisonResult.carB.horsepower}

Credit Score: ${comparisonResult.inputs.credit_score}
Loan Term: ${comparisonResult.inputs.months} months
Down Payment: $${comparisonResult.inputs.downpayment}

— Sent via Toyota Galaxy Comparison Tool ⚝
      `;

      const subject = 'Your Toyota Vehicle Comparison';
      const mailtoLink = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      
      window.open(mailtoLink);
      setEmailStatus('Email client opened! ✓');
      
      setTimeout(() => setEmailStatus(''), 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailStatus('Failed to send email');
    }
  };

  const getDiffColor = (diff: number) => {
    if (diff > 0) return 'text-green-400';
    if (diff < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getDiffIcon = (diff: number) => {
    if (diff > 0) return '↑';
    if (diff < 0) return '↓';
    return '=';
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white flex items-center justify-center gap-3">
            <GitCompare className="w-12 h-12 text-purple-400" />
            Compare Vehicles
          </h1>
          <p className="text-xl text-purple-200">
            Compare two Toyota vehicles side-by-side with finance calculations
          </p>
        </div>

        {/* Comparison Inputs */}
        <div className="max-w-6xl mx-auto mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-purple-300/30 text-white">
            <CardHeader>
              <CardTitle>Select Vehicles & Finance Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle A */}
                <div className="space-y-4">
                  <Label className="text-purple-200 text-lg">Vehicle A</Label>
                  <Select value={vehicleA} onValueChange={setVehicleA}>
                    <SelectTrigger className="bg-white/20 border-purple-300/50 text-white">
                      <SelectValue placeholder="Select first vehicle" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id.toString()}>
                          {v.year} {v.make} {v.model} - ${v.price.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Vehicle B */}
                <div className="space-y-4">
                  <Label className="text-purple-200 text-lg">Vehicle B</Label>
                  <Select value={vehicleB} onValueChange={setVehicleB}>
                    <SelectTrigger className="bg-white/20 border-purple-300/50 text-white">
                      <SelectValue placeholder="Select second vehicle" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id.toString()}>
                          {v.year} {v.make} {v.model} - ${v.price.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Finance Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-purple-300/30">
                <div>
                  <Label htmlFor="credit" className="text-purple-200">Credit Score</Label>
                  <Input
                    id="credit"
                    type="number"
                    value={creditScore}
                    onChange={(e) => setCreditScore(e.target.value)}
                    className="bg-white/20 border-purple-300/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="term" className="text-purple-200">Loan Term (months)</Label>
                  <Input
                    id="term"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="bg-white/20 border-purple-300/50 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="down" className="text-purple-200">Down Payment ($)</Label>
                  <Input
                    id="down"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    className="bg-white/20 border-purple-300/50 text-white"
                  />
                </div>
              </div>

              <Button
                onClick={handleCompare}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg"
              >
                <GitCompare className="w-5 h-5 mr-2" />
                Compare Vehicles
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Results */}
        {comparisonResult && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Side-by-side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle A Card */}
              <Card className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-md border-blue-300/30 text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Vehicle A</CardTitle>
                    <Badge className="bg-blue-600/50 text-white">Selected</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {comparisonResult.carA.image && (
                    <div className="h-48 bg-gradient-to-br from-blue-800/30 to-purple-800/30 rounded-lg flex items-center justify-center p-2">
                      <img 
                        src={comparisonResult.carA.image} 
                        alt={`${comparisonResult.carA.year} ${comparisonResult.carA.model}`}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<div class="text-6xl">🚗</div>';
                        }}
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold">
                    {comparisonResult.carA.year} {comparisonResult.carA.make} {comparisonResult.carA.model}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Price:</span>
                      <span className="font-semibold">${comparisonResult.carA.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Monthly Payment:</span>
                      <span className="font-semibold text-green-400">${comparisonResult.financeA.monthly_payment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">MPG Combined:</span>
                      <span className="font-semibold">{comparisonResult.carA.mpg_combined}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Horsepower:</span>
                      <span className="font-semibold">{comparisonResult.carA.horsepower} HP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Mileage:</span>
                      <span className="font-semibold">{comparisonResult.carA.mileage.toLocaleString()} mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">APR:</span>
                      <span className="font-semibold">{comparisonResult.financeA.apr_percent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Total Paid:</span>
                      <span className="font-semibold">${comparisonResult.financeA.total_paid.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle B Card */}
              <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-md border-purple-300/30 text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Vehicle B</CardTitle>
                    <Badge className="bg-purple-600/50 text-white">Selected</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {comparisonResult.carB.image && (
                    <div className="h-48 bg-gradient-to-br from-purple-800/30 to-pink-800/30 rounded-lg flex items-center justify-center p-2">
                      <img 
                        src={comparisonResult.carB.image} 
                        alt={`${comparisonResult.carB.year} ${comparisonResult.carB.model}`}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<div class="text-6xl">🚗</div>';
                        }}
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold">
                    {comparisonResult.carB.year} {comparisonResult.carB.make} {comparisonResult.carB.model}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Price:</span>
                      <span className="font-semibold">${comparisonResult.carB.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Monthly Payment:</span>
                      <span className="font-semibold text-green-400">${comparisonResult.financeB.monthly_payment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">MPG Combined:</span>
                      <span className="font-semibold">{comparisonResult.carB.mpg_combined}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Horsepower:</span>
                      <span className="font-semibold">{comparisonResult.carB.horsepower} HP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Mileage:</span>
                      <span className="font-semibold">{comparisonResult.carB.mileage.toLocaleString()} mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">APR:</span>
                      <span className="font-semibold">{comparisonResult.financeB.apr_percent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Total Paid:</span>
                      <span className="font-semibold">${comparisonResult.financeB.total_paid.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Differences Summary */}
            <Card className="bg-white/10 backdrop-blur-md border-purple-300/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="w-6 h-6" />
                  Differences (Vehicle A vs Vehicle B)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-purple-300 mb-1">Price Difference</div>
                    <div className={`text-2xl font-bold ${getDiffColor(comparisonResult.diffs.price_diff)}`}>
                      {getDiffIcon(comparisonResult.diffs.price_diff)} ${Math.abs(comparisonResult.diffs.price_diff).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-purple-300 mb-1">Monthly Payment</div>
                    <div className={`text-2xl font-bold ${getDiffColor(comparisonResult.diffs.monthly_payment_diff)}`}>
                      {getDiffIcon(comparisonResult.diffs.monthly_payment_diff)} ${Math.abs(comparisonResult.diffs.monthly_payment_diff)}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-purple-300 mb-1">MPG Difference</div>
                    <div className={`text-2xl font-bold ${getDiffColor(comparisonResult.diffs.mpg_combined_diff)}`}>
                      {getDiffIcon(comparisonResult.diffs.mpg_combined_diff)} {Math.abs(comparisonResult.diffs.mpg_combined_diff)}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-purple-300 mb-1">Horsepower</div>
                    <div className={`text-2xl font-bold ${getDiffColor(comparisonResult.diffs.horsepower_diff)}`}>
                      {getDiffIcon(comparisonResult.diffs.horsepower_diff)} {Math.abs(comparisonResult.diffs.horsepower_diff)} HP
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-purple-300 mb-1">Year Difference</div>
                    <div className={`text-2xl font-bold ${getDiffColor(comparisonResult.diffs.year_diff)}`}>
                      {getDiffIcon(comparisonResult.diffs.year_diff)} {Math.abs(comparisonResult.diffs.year_diff)} years
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-purple-300 mb-1">Mileage</div>
                    <div className={`text-2xl font-bold ${getDiffColor(-comparisonResult.diffs.mileage_diff)}`}>
                      {getDiffIcon(-comparisonResult.diffs.mileage_diff)} {Math.abs(comparisonResult.diffs.mileage_diff).toLocaleString()} mi
                    </div>
                  </div>
                </div>
                <p className="text-xs text-purple-300 mt-4 text-center">
                  ↑ = Vehicle A is higher | ↓ = Vehicle B is higher | = Same value
                </p>
              </CardContent>
            </Card>

            {/* Email Section */}
            <Card className="bg-white/10 backdrop-blur-md border-purple-300/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-6 h-6" />
                  Email Comparison Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-purple-200">Your Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-white/20 border-purple-300/50 text-white placeholder:text-purple-300/50"
                  />
                </div>
                <Button
                  onClick={handleSendEmail}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4"
                >
                  {emailStatus ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      {emailStatus}
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Send to My Email
                    </>
                  )}
                </Button>
                <p className="text-xs text-purple-300 text-center">
                  Your default email client will open with the comparison details pre-filled
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

