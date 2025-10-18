import { useState } from 'react';
import { Search, MapPin, ArrowUpDown, Gauge, Calendar, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

interface Vehicle {
  id: number;
  model: string;
  year: number;
  price: number;
  horsepower: number;
  mileage: 'low' | 'medium' | 'high';
  city: string;
  color: string;
}

const mockVehicles: Vehicle[] = [
  { id: 1, model: 'Camry', year: 2025, price: 28500, horsepower: 203, mileage: 'low', city: 'Houston', color: 'Silver' },
  { id: 2, model: 'Camry', year: 2024, price: 26800, horsepower: 203, mileage: 'medium', city: 'Dallas', color: 'Blue' },
  { id: 3, model: 'Corolla', year: 2025, price: 22500, horsepower: 169, mileage: 'low', city: 'Austin', color: 'White' },
  { id: 4, model: 'Corolla', year: 2023, price: 20100, horsepower: 169, mileage: 'high', city: 'San Antonio', color: 'Red' },
  { id: 5, model: 'RAV4', year: 2025, price: 32500, horsepower: 203, mileage: 'low', city: 'Houston', color: 'Black' },
  { id: 6, model: 'RAV4', year: 2024, price: 30200, horsepower: 203, mileage: 'medium', city: 'Fort Worth', color: 'Gray' },
  { id: 7, model: 'Highlander', year: 2025, price: 42500, horsepower: 295, mileage: 'low', city: 'Dallas', color: 'White' },
  { id: 8, model: 'Highlander', year: 2023, price: 38900, horsepower: 295, mileage: 'medium', city: 'Austin', color: 'Blue' },
  { id: 9, model: 'Tacoma', year: 2025, price: 35800, horsepower: 278, mileage: 'low', city: 'San Antonio', color: 'Green' },
  { id: 10, model: 'Tacoma', year: 2024, price: 33500, horsepower: 278, mileage: 'medium', city: 'El Paso', color: 'Silver' },
  { id: 11, model: 'Tundra', year: 2025, price: 48900, horsepower: 389, mileage: 'low', city: 'Houston', color: 'Black' },
  { id: 12, model: 'Tundra', year: 2023, price: 44200, horsepower: 389, mileage: 'high', city: 'Dallas', color: 'Red' },
  { id: 13, model: 'Prius', year: 2025, price: 28400, horsepower: 194, mileage: 'low', city: 'Austin', color: 'Blue' },
  { id: 14, model: 'Prius', year: 2024, price: 26500, horsepower: 194, mileage: 'medium', city: 'Plano', color: 'White' },
  { id: 15, model: '4Runner', year: 2025, price: 45600, horsepower: 270, mileage: 'low', city: 'Fort Worth', color: 'Gray' },
  { id: 16, model: '4Runner', year: 2024, price: 42800, horsepower: 270, mileage: 'medium', city: 'Houston', color: 'Black' },
  { id: 17, model: 'Camry', year: 2022, price: 24500, horsepower: 203, mileage: 'high', city: 'Arlington', color: 'Silver' },
  { id: 18, model: 'Corolla', year: 2024, price: 21800, horsepower: 169, mileage: 'medium', city: 'Laredo', color: 'Blue' },
  { id: 19, model: 'RAV4', year: 2023, price: 28900, horsepower: 203, mileage: 'high', city: 'Corpus Christi', color: 'Red' },
  { id: 20, model: 'Highlander', year: 2024, price: 40500, horsepower: 295, mileage: 'low', city: 'El Paso', color: 'White' },
];

const getMileageValue = (mileage: 'low' | 'medium' | 'high'): number => {
  const values = { low: 1, medium: 2, high: 3 };
  return values[mileage];
};

const getMileageDisplay = (mileage: 'low' | 'medium' | 'high'): string => {
  const displays = { low: 'Low (0-30k mi)', medium: 'Medium (30-60k mi)', high: 'High (60k+ mi)' };
  return displays[mileage];
};

export function SearchSection() {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [minHorsepower, setMinHorsepower] = useState('');
  const [year, setYear] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'year' | 'horsepower' | 'mileage'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filteredResults, setFilteredResults] = useState<Vehicle[]>(mockVehicles);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    let results = [...mockVehicles];

    // Apply filters
    if (minPrice) {
      results = results.filter(v => v.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      results = results.filter(v => v.price <= parseFloat(maxPrice));
    }
    if (mileage) {
      results = results.filter(v => v.mileage === mileage);
    }
    if (minHorsepower) {
      results = results.filter(v => v.horsepower >= parseFloat(minHorsepower));
    }
    if (year) {
      results = results.filter(v => v.year === parseInt(year));
    }

    // Apply sorting
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'year':
          comparison = a.year - b.year;
          break;
        case 'horsepower':
          comparison = a.horsepower - b.horsepower;
          break;
        case 'mileage':
          comparison = getMileageValue(a.mileage) - getMileageValue(b.mileage);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredResults(results);
    setHasSearched(true);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    if (hasSearched) {
      const results = [...filteredResults].reverse();
      setFilteredResults(results);
    }
  };

  const handleSortByChange = (value: 'price' | 'year' | 'horsepower' | 'mileage') => {
    setSortBy(value);
    if (hasSearched) {
      handleSearch();
    }
  };

  return (
    <div id="search" className="bg-gradient-to-b from-indigo-900 via-purple-950 to-indigo-950 py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-5xl mb-4 text-white">
            Find Your Perfect Toyota
          </h2>
          <p className="text-xl text-purple-200">
            Search available vehicles with customizable filters
          </p>
        </div>

        {/* Search Filters */}
        <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-300/30 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="min-price" className="text-purple-200 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Min Price
              </Label>
              <Input
                id="min-price"
                type="number"
                placeholder="e.g., 20000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-white/20 border-purple-300/50 text-white placeholder:text-purple-300"
              />
            </div>

            <div>
              <Label htmlFor="max-price" className="text-purple-200 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Max Price
              </Label>
              <Input
                id="max-price"
                type="number"
                placeholder="e.g., 50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-white/20 border-purple-300/50 text-white placeholder:text-purple-300"
              />
            </div>

            <div>
              <Label htmlFor="mileage" className="text-purple-200 mb-2">Mileage</Label>
              <Select value={mileage} onValueChange={setMileage}>
                <SelectTrigger id="mileage" className="bg-white/20 border-purple-300/50 text-white">
                  <SelectValue placeholder="Any mileage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any mileage</SelectItem>
                  <SelectItem value="low">Low (0-30k mi)</SelectItem>
                  <SelectItem value="medium">Medium (30-60k mi)</SelectItem>
                  <SelectItem value="high">High (60k+ mi)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="horsepower" className="text-purple-200 mb-2 flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Min Horsepower
              </Label>
              <Input
                id="horsepower"
                type="number"
                placeholder="e.g., 200"
                value={minHorsepower}
                onChange={(e) => setMinHorsepower(e.target.value)}
                className="bg-white/20 border-purple-300/50 text-white placeholder:text-purple-300"
              />
            </div>

            <div>
              <Label htmlFor="year" className="text-purple-200 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Year
              </Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="year" className="bg-white/20 border-purple-300/50 text-white">
                  <SelectValue placeholder="Any year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any year</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg shadow-lg shadow-purple-500/50"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Vehicles
          </Button>
        </div>

        {/* Sort Controls */}
        {hasSearched && (
          <div className="max-w-5xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-purple-300/30">
            <div className="flex items-center gap-2 text-purple-200">
              <span>Found {filteredResults.length} vehicle{filteredResults.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-purple-200">Sort by:</Label>
              <Select value={sortBy} onValueChange={handleSortByChange}>
                <SelectTrigger className="w-40 bg-white/20 border-purple-300/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="horsepower">Horsepower</SelectItem>
                  <SelectItem value="mileage">Mileage</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSortOrder}
                className="border-purple-300 text-purple-100 hover:bg-purple-800/50"
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredResults.map((vehicle) => (
            <div key={vehicle.id} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-purple-300/30 hover:scale-105 transition-transform cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-purple-800/50 to-blue-800/50 flex items-center justify-center text-6xl">
                🚗
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl text-white">{vehicle.model} {vehicle.year}</h3>
                  <Badge className="bg-purple-600/50 text-white border-purple-300/50">
                    {vehicle.color}
                  </Badge>
                </div>
                <div className="flex items-center text-purple-200 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{vehicle.city}, TX</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-300">Price:</span>
                    <span className="text-white">${vehicle.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-300">Horsepower:</span>
                    <span className="text-white">{vehicle.horsepower} HP</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-300">Mileage:</span>
                    <span className="text-white capitalize">{getMileageDisplay(vehicle.mileage)}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-purple-300 text-purple-100 hover:bg-purple-800/50">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {hasSearched && filteredResults.length === 0 && (
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-12 border border-purple-300/30 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl text-white mb-3">No vehicles found</h3>
            <p className="text-purple-200">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  );
}
