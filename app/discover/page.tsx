'use client';

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SurveyCard from "../components/SurveyCard";
import RangeSlider from "../components/RangeSlider";
import {
  getPaginatedSurveys,
  getSurveyOfTheDay,
  getHighestPointsValue,
  getHighestVotesValue,
  getLowestPointsValue,
  getLowestVotesValue
} from "../../api/services/surveyService";
import { getAvailableCategories } from "../../api/services/categoryService";
import styles from './DiscoverPage.module.css';
import surveyOfTheDayStyles from '../components/SurveyCard.module.css';

export default function DiscoverPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [surveyOfTheDay, setSurveyOfTheDay] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [pointsRange, setPointsRange] = useState<[number, number]>([0, 1000]);
  const [votesRange, setVotesRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [rangeLimits, setRangeLimits] = useState({
    points: { min: 0, max: 1000 },
    votes: { min: 0, max: 10000 }
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Sorting state
  const [sortBy, setSortBy] = useState('votes'); // Default: sort by votes
  const [sortOrder, setSortOrder] = useState('desc'); // Default: descending

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          surveyOfTheDayData,
          categoriesData,
          highestPoints,
          highestVotes,
          lowestPoints,
          lowestVotes
        ] = await Promise.all([
          getSurveyOfTheDay(),
          getAvailableCategories(),
          getHighestPointsValue(),
          getHighestVotesValue(),
          getLowestPointsValue(),
          getLowestVotesValue()
        ]);

        setSurveyOfTheDay(surveyOfTheDayData);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        // Set range limits and initial values
        const pointsLimits = { min: lowestPoints, max: highestPoints };
        const votesLimits = { min: lowestVotes, max: highestVotes };

        setRangeLimits({
          points: pointsLimits,
          votes: votesLimits
        });

        setPointsRange([lowestPoints, highestPoints] as [number, number]);
        setVotesRange([lowestVotes, highestVotes] as [number, number]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load surveys with pagination
  const loadSurveys = async (page: number, append: boolean = false) => {
    try {
      const filters = {
        searchTerm,
        categories: selectedCategories,
        pointsRange,
        votesRange,
        sortBy,
        sortOrder
      };

      const response = await getPaginatedSurveys(page, 20, filters);
      
      // Ensure surveys is always an array
      const surveysArray = Array.isArray(response.surveys) ? response.surveys : [response.surveys];
      
      if (append) {
        // Verhindere Duplikate beim Hinzufügen
        setSurveys(prev => {
          const existingIds = new Set(prev.map(survey => survey.id));
          const newSurveys = surveysArray.filter(survey => !existingIds.has(survey.id));
          return [...prev, ...newSurveys];
        });
      } else {
        setSurveys(surveysArray);
      }
      
      setCurrentPage(response.pagination.currentPage);
      setHasNextPage(response.pagination.hasNextPage);
      setTotalCount(response.pagination.totalCount);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Error loading surveys:', error);
    }
  };

  // Handle sorting
  const handleSort = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field with default descending order
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // Load initial surveys
  useEffect(() => {
    if (!loading) {
      setCurrentPage(1);
      loadSurveys(1, false);
    }
  }, [loading]);

  // Load more surveys
  const loadMoreSurveys = async () => {
    if (hasNextPage && !loadingMore) {
      setLoadingMore(true);
      await loadSurveys(currentPage + 1, true);
      setLoadingMore(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = () => {
    setCurrentPage(1);
    loadSurveys(1, false);
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilterChange();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle other filter changes
  useEffect(() => {
    handleFilterChange();
  }, [selectedCategories, pointsRange, votesRange]);

  // Handle sort changes
  useEffect(() => {
    handleFilterChange();
  }, [sortBy, sortOrder]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setPointsRange([rangeLimits.points.min, rangeLimits.points.max] as [number, number]);
    setVotesRange([rangeLimits.votes.min, rangeLimits.votes.max] as [number, number]);
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerWrapper}>
            <div className={styles.headerText}>
              <h1>Discover Surveys</h1>
            </div>
            <div className={styles.surveyofTheDayWrapper}>
              {/* Survey of the Day */}
              {surveyOfTheDay && (
                <div className={styles.surveyOfTheDaySection}>
                  <div className={styles.surveyOfTheDayCard}>
                  <SurveyCard
                    key={surveyOfTheDay.id}
                    survey={surveyOfTheDay}
                    icon="📋"
                    className="survey-of-the-day"
                    children={<div className={surveyOfTheDayStyles["survey-of-the-day-label"]}>Survey of the Day</div>}
                  >
                  </SurveyCard>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.contentWrapper}>
        {/* Search and Filters Bar */}
        <div className={styles.searchFiltersBar}>
          {/* First Row: Search + Filters */}
          <div className={styles.topRow}>
            <input
              type="text"
              placeholder="Search surveys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button
              className={styles.filterToggle}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className={styles.filtersPanel}>
            {/* Horizontal Filter Layout */}
            <div className={styles.filtersRow}>
              {/* Sorting Section */}
              <div className={styles.filterColumn}>
                <h3>Sort by</h3>
                <div className={styles.sortingContainer}>
                  <button
                    className={`${styles.sortButton} ${sortBy === 'votes' ? styles.activeSort : ''}`}
                    onClick={() => handleSort('votes')}
                  >
                    Votes {sortBy === 'votes' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </button>
                  <button
                    className={`${styles.sortButton} ${sortBy === 'points' ? styles.activeSort : ''}`}
                    onClick={() => handleSort('points')}
                  >
                    Points {sortBy === 'points' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </button>
                  <button
                    className={`${styles.sortButton} ${sortBy === 'created_at' ? styles.activeSort : ''}`}
                    onClick={() => handleSort('created_at')}
                  >
                    Newest {sortBy === 'created_at' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </button>
                  <button
                    className={`${styles.sortButton} ${sortBy === 'estimated_time' ? styles.activeSort : ''}`}
                    onClick={() => handleSort('estimated_time')}
                  >
                    Time {sortBy === 'estimated_time' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>

              {/* Categories Section */}
              <div className={styles.filterColumn}>
                <h3>Categories</h3>
                <div className={styles.categoriesGrid}>
                  {categories.map(category => (
                    <label key={category.id} className={styles.categoryCheckbox}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => handleCategoryToggle(category.name)}
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Points Range Section */}
              <div className={styles.filterColumn}>
                <h3>Points Range</h3>
                <RangeSlider
                  label=""
                  min={rangeLimits.points.min}
                  max={rangeLimits.points.max}
                  values={pointsRange}
                  onChange={setPointsRange}
                  unit=" pts"
                />
              </div>

              {/* Votes Range Section */}
              <div className={styles.filterColumn}>
                <h3>Votes Range</h3>
                <RangeSlider
                  label=""
                  min={rangeLimits.votes.min}
                  max={rangeLimits.votes.max}
                  values={votesRange}
                  onChange={setVotesRange}
                  unit=" votes"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className={styles.clearFiltersContainer}>
              <button onClick={clearFilters} className={styles.clearFilters}>
                Clear All Filters
              </button>
            </div>
          </div>
        )}
        {/* Results Count */}
        <div className={styles.resultsInfo}>
          <h3>Available Surveys ({totalCount})</h3>
          {selectedCategories.length > 0 && (
            <span className={styles.activeFilters}>
              Active filters: {selectedCategories.join(', ')}
            </span>
          )}
          {surveys.length > 0 && (
            <span className={styles.paginationInfo}>
              Showing {surveys.length} of {totalCount} surveys
            </span>
          )}
        </div>

        {/* Surveys Grid */}
        <div className={styles.surveysGrid}>
          {loading ? (
            <div className={styles.loading}>Loading surveys...</div>
          ) : surveys.length > 0 ? (
            <>
              {surveys.map((survey) => (
                <SurveyCard
                  key={survey.id}
                  survey={survey}
                  className=""
                  icon="📋"
                />
              ))}
              
              {/* Load More Button */}
              {hasNextPage && (
                <div className={styles.loadMoreContainer}>
                  <button 
                    onClick={loadMoreSurveys} 
                    className={styles.loadMoreButton}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Loading...' : `Load More (${totalCount - surveys.length} remaining)`}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noResults}>
              <p>No surveys found matching your criteria.</p>
              <button onClick={clearFilters} className={styles.clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
} 