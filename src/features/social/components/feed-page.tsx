"use client";

import { useState } from "react";
import { CycleGrid } from "./cycle-grid";
import { FeaturedTemplates } from "./featured-templates";
import { FilterBar } from "./filter-bar";
import { HeroSection } from "./hero-section";
import { usePublicCycles } from "../hooks/use-public-cycles";
import { useCloneCycle } from "../hooks/use-clone-cycle";
import { CycleDetailModal } from "./cycle-detail-modal";
import type { PublicCycle } from "../types";

export function FeedPage() {
  // State
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { cycles, loading: cyclesLoading, error: cyclesError } = usePublicCycles(category, searchQuery);
  const { clone, loading: cloneLoading, error: cloneError } = useCloneCycle();
  const [selectedCycleId, setSelectedCycleId] = useState<string>('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Handlers
  const handleClone = (cycleId: string) => {
    // TODO: get authenticated user
    const userId = ""; 
    if (!userId) {
      // TODO: redirect to login
      return;
    }
    clone(userId, cycleId)
  };

  const handleViewDetails = (cycleId: string) => {
    setSelectedCycleId(cycleId);
    setIsDetailModalOpen(true);
  };
  
  const onModalOpenChange = (open: boolean) => {
    setIsDetailModalOpen(open);
    if (!open) {
        setSelectedCycleId('');
    }
  }

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
      <CycleGrid cycles={cycles as PublicCycle[]} onClone={handleClone} onViewDetails={handleViewDetails} />
      <CycleDetailModal 
        cycleId={selectedCycleId} 
        open={isDetailModalOpen} 
        onOpenChange={onModalOpenChange} 
        onClone={handleClone} 
      />
    </div>
  );
}
