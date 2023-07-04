//@ts-nocheck
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image'

export default function SearchFn ({data}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const resultsRef = useRef(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClickOutside = (event) => {
    if (resultsRef.current && !resultsRef.current.contains(event.target)) {
      setAutocompleteResults([]);
    }
  };

  useEffect(() => {
    const fetchAutocompleteResults = async () => {
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            searchQuery
          )}&key=b71bc74a04ea4621a789730a47d99d68&limit=5&no_annotations=1&countrycode=br`
        );
        const data = await response.json();
        const results = data.results.map((result) => ({
          formatted: result.formatted,
          latitude: result.geometry.lat,
          longitude: result.geometry.lng,
        }));
        setAutocompleteResults(results);
      } catch (error) {
        console.log('Erro ao buscar resultados de autocompletar:', error);
      }
    };

    if (searchQuery.trim() !== '') {
      fetchAutocompleteResults();
    } else {
      setAutocompleteResults([]);
    }
  }, [searchQuery]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    data(location);
    setAutocompleteResults([]);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  return (
    <nav className="navbar navbar-expand-lg navbar-fixed-top">
      <div className="container-fluid">
        <div className="col-md-3mb-md-0 d-sm-none d-md-block d-lg-none">
          <a href="#!" className="d-inline-flex link-body-emphasis text-decoration-none logo">
            <Image src="/logo.webp" width={101} height={101} className="logo" alt="logo" />
          </a>
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="navbar" className="collapse navbar-collapse flex flex-wrap align-items-center justify-content-center py-4 mb-4">    
          <div className="col-md-1 mb-2 mb-md-0 d-none d-sm-none d-md-none d-lg-block">
            <a href="#!" className="d-inline-flex link-body-emphasis text-decoration-none logo">
              <Image src="/logo.webp" width={101} height={101} className="logo" alt="logo" />
            </a>
          </div>
          <ul className="nav col-12 col-md-auto mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar cidade"
          />
          {autocompleteResults.length > 0 && (
            <ul className="result-search">
              {autocompleteResults.map((result) => (
                <li key={result.formatted} onClick={() => handleLocationSelect(result)}>
                  {result.formatted}
                </li>
              ))}
            </ul>
          )}          
          </ul>
        </div>
      </div>
    </nav>
  )
}