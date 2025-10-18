export function ScrollingBar() {
  const cities = [
    { name: 'Houston', icon: '🌟' },
    { name: 'Dallas', icon: '✨' },
    { name: 'Austin', icon: '💫' },
    { name: 'San Antonio', icon: '⭐' },
    { name: 'Fort Worth', icon: '🌟' },
    { name: 'El Paso', icon: '✨' },
    { name: 'Arlington', icon: '💫' },
    { name: 'Corpus Christi', icon: '⭐' },
  ];

  // Duplicate for seamless loop
  const duplicatedCities = [...cities, ...cities, ...cities];

  return (
    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 py-8 overflow-hidden border-y border-purple-500/30">
      <div className="relative">
        <div className="flex animate-scroll">
          {duplicatedCities.map((city, index) => (
            <div
              key={index}
              className="flex items-center gap-3 mx-8 whitespace-nowrap"
            >
              <span className="text-3xl">{city.icon}</span>
              <span className="text-2xl text-purple-100">{city.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
          display: flex;
          width: fit-content;
        }
      `}</style>
    </div>
  );
}
