"use client";

import { useState } from "react";
import { CycleGrid } from "./cycle-grid";
import { FeaturedTemplates } from "./featured-templates";
import { FilterBar } from "./filter-bar";
import { HeroSection } from "./hero-section";
import { usePublicCycles } from "../hooks/use-public-cycles";
import { useCloneCycle } from "../hooks/use-clone-cycle";
import { CycleDetailModal } from "./cycle-detail-modal";

export function FeedPage() {
  // State
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { cycles, loading: cyclesLoading, error: cyclesError } = usePublicCycles(category, searchQuery);
  const { clone, loading: cloneLoading, error: cloneError } = useCloneCycle();
  const [selectedCycleId, setSelectedCycleId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Handlers
  const handleClone = (cycleId) => {
    // TODO: get authenticated user
    const userId = ""; 
    if (!userId) {
      // TODO: redirect to login
      return;
    }
    clone(userId, cycleId)
  };

  const handleViewDetails = (cycleId) => {
    setSelectedCycleId(cycleId);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <FilterBar 
        category={category} 
        onCategoryChange={setCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {/* <FeaturedTemplates templates={templates} /> */}
      <CycleGrid cycles={cycles} onClone={handleClone} onViewDetails={handleViewDetails} />
      <CycleDetailModal 
        cycleId={selectedCycleId} 
        open={isDetailModalOpen} 
        onOpenChange={setIsDetailModalOpen} 
        onClone={handleClone} 
      />
    </div>
  );
}
