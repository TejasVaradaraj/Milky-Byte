import { useState, useEffect } from 'react';
import { Search, MapPin, ArrowUpDown, Gauge, Calendar, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

const BASE_URL = 'http://localhost:8000';

interface Vehicle {
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  mpg_city: number;
  mpg_hwy: number;
  mpg_combined: number;
  horsepower: number;
  body_type: string;
  fuel_type: string;
  price: number;
  image?: string;
}

const getMileageCategory = (mileage: number): string => {
  if (mileage < 30000) return 'Low (< 30k mi)';
  if (mileage < 60000) return 'Medium (30k-60k mi)';
  return 'High (> 60k mi)';
};

const getMileageRange = (category: string): [number, number] => {
  switch(category) {
    case 'low': return [0, 30000];
    case 'medium': return [30000, 60000];
    case 'high': return [60000, 300000];
    default: return [0, 300000];
  }
};

export function SearchSection() {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [minHorsepower, setMinHorsepower] = useState('');
  const [year, setYear] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'year' | 'horsepower' | 'mileage'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filteredResults, setFilteredResults] = useState<Vehicle[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data on mount
  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (minPrice) params.append('price_min', minPrice);
      if (maxPrice) params.append('price_max', maxPrice);
      if (minHorsepower) params.append('hp_min', minHorsepower);
      if (year && year !== 'all') params.append('year', year);
      
      // Handle mileage range
      if (mileage && mileage !== 'all') {
        const [mil_min, mil_max] = getMileageRange(mileage);
        params.append('mil_min', mil_min.toString());
        params.append('mil_max', mil_max.toString());
      }
      
      params.append('sort_by', sortBy);
      params.append('order', sortOrder);
      params.append('limit', '50');

      const response = await fetch(`${BASE_URL}/filter?${params.toString()}`);
      const data = await response.json();
      
      setFilteredResults(data.results);
      setTotalCount(data.count);
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => {
      const newOrder = prev === 'asc' ? 'desc' : 'asc';
      return newOrder;
    });
  };

  const handleSortByChange = (value: 'price' | 'year' | 'horsepower' | 'mileage') => {
    setSortBy(value);
  };

  // Re-fetch when sort options change
  useEffect(() => {
    if (hasSearched) {
      handleSearch();
    }
  }, [sortBy, sortOrder]);

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
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2019">2019</SelectItem>
                  <SelectItem value="2018">2018</SelectItem>
                  <SelectItem value="2017">2017</SelectItem>
                  <SelectItem value="2016">2016</SelectItem>
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
              <span>Found {totalCount} vehicle{totalCount !== 1 ? 's' : ''} (showing {filteredResults.length})</span>
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
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-purple-200 text-xl">Loading vehicles...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredResults.map((vehicle, index) => (
              <div key={`${vehicle.year}-${vehicle.model}-${index}`} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-purple-300/30 hover:scale-105 transition-transform cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-purple-800/50 to-blue-800/50 flex items-center justify-center overflow-hidden">
                  {vehicle.image ? (
                    <img 
                      src={vehicle.image} 
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="text-6xl">🚗</div>';
                      }}
                    />
                  ) : (
                    <div className="text-6xl">🚗</div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{vehicle.year} {vehicle.make}</h3>
                    <Badge className="bg-purple-600/50 text-white border-purple-300/50">
                      {vehicle.fuel_type}
                    </Badge>
                  </div>
                  <p className="text-purple-200 mb-3 text-sm">{vehicle.model}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-300">Price:</span>
                      <span className="text-white font-semibold">${vehicle.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-300">Horsepower:</span>
                      <span className="text-white">{vehicle.horsepower} HP</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-300">Mileage:</span>
                      <span className="text-white">{vehicle.mileage.toLocaleString()} mi</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-300">MPG:</span>
                      <span className="text-white">{vehicle.mpg_combined} combined</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-300">Type:</span>
                      <span className="text-white text-xs">{vehicle.body_type}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-purple-300 text-purple-100 hover:bg-purple-800/50">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

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
