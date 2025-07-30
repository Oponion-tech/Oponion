'use client';
import Navbar from "./components/Navbar";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import styles from './components/SurveyCard.module.css';
import Image from "next/image";
import SurveyCard from "./components/SurveyCard";
import { getDiscorverSurveys, getRecentAnsweredSurveys, getSurveyOfTheDay } from "../api/services/surveyService";
import { getUserInformation } from "../api/services/userInformationService";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [discoverSurveys, setDiscoverSurveys] = useState<any>([]);
  const [recentlyAnswered, setRecentlyAnswered] = useState<any>([]);
  const [surveyOfTheDay, setSurveyOfTheDay] = useState<any>([]);
  const [surveysLeftHalf, setSurveysLeftHalf] = useState<any>([]);
  const [surveysRightHalf, setSurveysRightHalf] = useState<any>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [discoverData, recentData, userData, surveyOfTheDayData] = await Promise.all([
          getDiscorverSurveys(),
          getRecentAnsweredSurveys(),
          getUserInformation(),
          getSurveyOfTheDay()
        ]);
        setDiscoverSurveys(discoverData);
        setRecentlyAnswered(recentData);
        setUserInfo(userData);
        setSurveyOfTheDay(surveyOfTheDayData);
        
        const totalSurveys = Array.isArray(discoverData) ? discoverData.length : 0;
        const leftHalfCount = Math.ceil(totalSurveys * 0.625);
        
        if (Array.isArray(discoverData)) {
          setSurveysLeftHalf(discoverData.slice(0, leftHalfCount));
          setSurveysRightHalf(discoverData.slice(leftHalfCount));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div >
      <Navbar />
      {/* Hero Section */}
      <div className="hero-section-container">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-greeting">
              Hi {userInfo ? userInfo.name : 'User'}!
            </h1>
            <p className="hero-subtitle">Ready for new surveys?</p>
            <button className="create-survey-btn" onClick={() => router.push('/create')}>
              Create Survey
            </button>
          </div>
          <div className="recently-answered">
            <h3>Recently Answered</h3>
            {loading ? (
              <p>Loading recent surveys...</p>
            ) : (
              (recentlyAnswered as any[]).map((survey) => (
                <SurveyCard
                  key={survey.id}
                  survey={survey}
                  className=""
                />
              ))
            )}
          </div>
        </div>
      </section>
      </div>
      {/* Discover Section */}
      <section className="discover-section">
        <div className="discover-container">
          <div className="discover-header">
            <h2 className="discover-title">Discover</h2>
            <p className="discover-subtitle">Explore trending surveys and share your opinion</p>
          </div>
            <div className="survey-container">
              <div className="survey-left-container">
              {loading ? (
                  <p>Loading surveys...</p>
                ) : (
                  (surveysLeftHalf as any[]).map((survey) => (
                    <SurveyCard
                    key={survey.id}
                    survey={survey}
                    className=""
                    />
                  ))
                )}

              </div>
              <div className="survey-right-container">
              {surveyOfTheDay && (
                  <SurveyCard
                    key={surveyOfTheDay.id}
                    survey={surveyOfTheDay}
                    icon="📋"
                    className="survey-of-the-day"
                    children={<div className={styles["survey-of-the-day-label"]}>Survey of the Day</div>}
                  >
                  </SurveyCard>
                )}
                {loading ? (
                  <p>Loading surveys...</p>
                ) : (
                  (surveysRightHalf as any[]).map((survey) => (
                    <SurveyCard
                      key={survey.id}
                      survey={survey}
                      className=""
                    />
                  ))
                )}
              </div>
            </div>
          </div>
      </section>
    </div>
  );
}
