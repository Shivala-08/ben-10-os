'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllAliens } from '@/lib/api/ben10';
import { Alien } from '@/lib/api/types';

export type SeriesTab = 'All' | 'Original Series' | 'Alien Force' | 'Ultimate Alien' | 'Omniverse';

export function useCodex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<SeriesTab>('All');
  const [selectedAlien, setSelectedAlien] = useState<Alien | null>(null);

  // TanStack Query caching all 62 specimens
  const { data, isLoading, error } = useQuery({
    queryKey: ['aliens'],
    queryFn: fetchAllAliens,
    staleTime: Infinity, // Prevent redundant network requests
  });

  const aliens = data?.aliens || [];

  const filteredAliens = useMemo(() => {
    return aliens.filter((alien) => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = alien.general.name.toLowerCase().includes(searchLower);
      const speciesMatch = alien.general.species.toLowerCase().includes(searchLower);
      const worldMatch = alien.general.homeWorld.toLowerCase().includes(searchLower);
      const abilityMatch = alien.abilities.some((ab) => ab.toLowerCase().includes(searchLower));

      const matchesSearch = nameMatch || speciesMatch || worldMatch || abilityMatch;

      if (activeTab === 'All') return matchesSearch;

      const seriesLower = alien.series.toLowerCase();
      const activeLower = activeTab.toLowerCase();
      
      // Standardize tab series matches (Original vs Original Series etc.)
      const matchesTab = 
        seriesLower === activeLower ||
        (activeTab === 'Original Series' && (seriesLower === 'original' || seriesLower === 'original series'));

      return matchesSearch && matchesTab;
    });
  }, [aliens, searchTerm, activeTab]);

  return {
    aliens: filteredAliens,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    selectedAlien,
    setSelectedAlien
  };
}
export default useCodex;
