'use client';
import { useState, useEffect } from "react";
import Image from 'next/image';
import styles from './CreatePage.module.css';
import QuestionOption from "../components/QuestionOption";
import Question from "../../api/models/question";
import { saveSurvey, saveSurveyAsDraft } from "../../api/services/surveyService";

interface QuestionInterface {
  id: string;
  type: 'text' | 'multiple' | 'four_choice' | 'two_choice' | 'progress';
  question: string;
  options: string[];
  minValue?: number;
  maxValue?: number;
}

export default function CreatePage() {
  const [questions, setQuestions] = useState<QuestionInterface[]>([]);
  const [surveyTitle, setSurveyTitle] = useState<string>('');
  const [timeLimit, setTimeLimit] = useState<number>(0); // 0 = kein Zeitlimit
  const [points, setPoints] = useState<number>(100); // Standard 100 Punkte (Minimum)
  const [showSurveySettings, setShowSurveySettings] = useState<boolean>(false); // Einstellungen einklappbar
  const [currentQuestion, setCurrentQuestion] = useState<QuestionInterface>({
    id: '1',
    type: 'text',
    question: '',
    options: ['']
  });
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('1');
  const [showExitPopup, setShowExitPopup] = useState<boolean>(false);

  const questionTypes = [
    { value: 'text', label: 'Text Antwort' },
    { value: 'multiple', label: 'Mehrfach Antwort' },
    { value: 'four_choice', label: '4 Auswahlmöglichkeiten' },
    { value: 'two_choice', label: '2 Auswahlmöglichkeiten' },
    { value: 'progress', label: 'Progressbar (1-10)' }
  ];

  // Automatically save current question when it changes
  useEffect(() => {
    if (currentQuestion.question.trim() !== '') {
      saveCurrentQuestion();
    }
  }, [currentQuestion.question, currentQuestion.type, currentQuestion.options, currentQuestion.minValue, currentQuestion.maxValue]);

  // Calculate points based on number of questions
  const calculatePoints = (questionCount: number): number => {
    const basePoints = Math.max(100, questionCount * 50); // Minimum 100, otherwise 50 per question
    return basePoints;
  };

  // Update points when questions change
  useEffect(() => {
    const calculatedPoints = calculatePoints(questions.length);
    setPoints(calculatedPoints);
  }, [questions.length]);

  const renderQuestionPreview = (question: QuestionInterface) => {
    switch (question.type) {
      case 'text':
        return (
          <div className={styles.slidePreview}>
            <div className={styles.slidePreviewTitle}>Vorschau</div>
            <div className={styles.slidePreviewContent}>
              <div style={{ background: 'white', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                [Textantwort hier eingeben...]
              </div>
            </div>
          </div>
        );

      case 'multiple':
        return (
          <div className={styles.slidePreview}>
            <div className={styles.slidePreviewTitle}>Vorschau</div>
            <div className={styles.slidePreviewContent}>
              {question.options.slice(0, 2).map((option, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #d1d5db', borderRadius: '3px' }}></div>
                  <span style={{ fontSize: '0.8rem' }}>{option || `Option ${index + 1}`}</span>
                </div>
              ))}
              {question.options.length > 2 && (
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  +{question.options.length - 2} weitere Optionen
                </div>
              )}
            </div>
          </div>
        );

      case 'four_choice':
        return (
          <div className={styles.slidePreview}>
            <div className={styles.slidePreviewTitle}>Vorschau</div>
            <div className={styles.slidePreviewContent}>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #d1d5db', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.8rem' }}>{question.options[index] || `Option ${index + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'two_choice':
        return (
          <div className={styles.slidePreview}>
            <div className={styles.slidePreviewTitle}>Vorschau</div>
            <div className={styles.slidePreviewContent}>
              {[0, 1].map((index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #d1d5db', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.8rem' }}>{question.options[index] || `Option ${index + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className={styles.slidePreview}>
            <div className={styles.slidePreviewTitle}>Vorschau</div>
            <div className={styles.slidePreviewContent}>
              <div style={{ background: '#f3f4f6', height: '8px', borderRadius: '4px', marginBottom: '0.25rem' }}>
                <div style={{
                  width: '50%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #a4247d, #7df2ff)',
                  borderRadius: '4px'
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                <span>{question.minValue || 1}</span>
                <span>{question.maxValue || 10}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const saveCurrentQuestion = () => {
    // Don't save empty questions
    if (!currentQuestion.question.trim()) return;

    const existingIndex = questions.findIndex(q => q.id === currentQuestion.id);
    if (existingIndex >= 0) {
      const updatedQuestions = [...questions];
      updatedQuestions[existingIndex] = { ...currentQuestion };
      setQuestions(updatedQuestions);
    }
  };

  const addQuestion = () => {
    // Save current question before adding new one
    if (currentQuestion.question.trim()) {
      saveCurrentQuestion();
    }

    const newId = (questions.length + 2).toString();
    const newQuestion: QuestionInterface = {
      id: newId,
      type: 'text',
      question: '',
      options: ['']
    };
    
    // Add the new question immediately to the questions list
    setQuestions([...questions, newQuestion]);
    setCurrentQuestion(newQuestion);
    setSelectedQuestionId(newId);
  };

  const deleteQuestion = (id: string) => {
    const filteredQuestions = questions.filter(q => q.id !== id);
    setQuestions(filteredQuestions);

    if (selectedQuestionId === id) {
      if (filteredQuestions.length > 0) {
        setCurrentQuestion(filteredQuestions[0]);
        setSelectedQuestionId(filteredQuestions[0].id);
      } else {
        // If no questions left, create a new empty one
        const newQuestion: QuestionInterface = {
          id: '1',
          type: 'text',
          question: '',
          options: ['']
        };
        setCurrentQuestion(newQuestion);
        setSelectedQuestionId('1');
      }
    }
  };

  const copyQuestion = (id: string) => {
    const questionToCopy = questions.find(q => q.id === id);
    if (questionToCopy) {
      const newId = (questions.length + 2).toString();
      const copiedQuestion = { ...questionToCopy, id: newId };
      setQuestions([...questions, copiedQuestion]);
    }
  };

  const selectQuestion = (id: string) => {
    // Save current question before switching
    if (currentQuestion.question.trim()) {
      saveCurrentQuestion();
    }

    const question = questions.find(q => q.id === id);
    if (question) {
      setCurrentQuestion(question);
      setSelectedQuestionId(id);
    }
  };

  const updateCurrentQuestion = (field: keyof QuestionInterface, value: any) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const updateQuestionOption = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    updateCurrentQuestion('options', newOptions);
  };

  const addOption = () => {
    updateCurrentQuestion('options', [...currentQuestion.options, '']);
  };

  const removeOption = (index: number) => {
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    updateCurrentQuestion('options', newOptions);
  };

  const saveQuestion = async () => {
    saveCurrentQuestion();
    
    // Konvertiere Fragen zu Question Models
    const questionModels = questions.map(q => new (Question as any)({
      id: q.id,
      questionText: q.question,
      type: q.type,
      options: q.options,
      minValue: q.minValue,
      maxValue: q.maxValue,
      answerSubmissions: []
    }));

    const surveyData = {
      title: surveyTitle,
      description: "Eine neue Umfrage",
      questions: questionModels,
      genre: "General",
      time_limit: timeLimit,
      points: points
    };

    try {
      const savedSurvey = await saveSurvey(surveyData);
      console.log('Survey saved successfully:', savedSurvey);
      // Hier könnte man zur Survey-Übersicht weiterleiten
    } catch (error) {
      console.error('Error saving survey:', error);
    }
  };

  const saveAsDraft = async () => {
    saveCurrentQuestion();
    
    const questionModels = questions.map(q => new (Question as any)({
      id: q.id,
      questionText: q.question,
      type: q.type,
      options: q.options,
      minValue: q.minValue,
      maxValue: q.maxValue,
      answerSubmissions: []
    }));

    const surveyData = {
      title: surveyTitle || "Unbenannter Entwurf",
      description: "Entwurf einer Umfrage",
      questions: questionModels,
      genre: "General",
      is_draft: true,
      time_limit: timeLimit,
      points: points
    };

    try {
      const draftSurvey = await saveSurveyAsDraft(surveyData);
      console.log('Draft saved successfully:', draftSurvey);
      // Hier könnte man zur Draft-Übersicht weiterleiten
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleClose = () => {
    if (questions.length > 0 || surveyTitle.trim() !== '' || timeLimit > 0 || points !== 100) {
      setShowExitPopup(true);
    } else {
      // Direkt verlassen wenn nichts geändert wurde
      window.history.back();
    }
  };

  const handleExitWithoutSaving = () => {
    setShowExitPopup(false);
    window.history.back();
  };

  const handleSaveAndExit = async () => {
    setShowExitPopup(false);
    await saveAsDraft();
    window.history.back();
  };

  const renderQuestionEditor = () => {
    switch (currentQuestion.type) {
      case 'text':
        return (
          <div className={styles.questionEditor}>
            <h3>Text Antwort</h3>
            <p>Die Teilnehmer können eine freie Textantwort eingeben. Perfekt für offene Fragen und detaillierte Antworten.</p>
          </div>
        );

      case 'multiple':
        return (
          <div className={styles.questionEditor}>
            <h3>Mehrfach Antwort</h3>
            <p>Erstelle eine Liste von Optionen, aus denen die Teilnehmer mehrere auswählen können.</p>
            <div className={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <QuestionOption 
                  key={index}
                  index={index} 
                  currentQuestion={currentQuestion} 
                  updateQuestionOption={updateQuestionOption}
                  showRemoveButton={currentQuestion.options.length > 1}
                  onRemove={removeOption}
                />
              ))}
              <button onClick={addOption} className={styles.addOption}>
                + Option hinzufügen
              </button>
            </div>
          </div>
        );

      case 'four_choice':
        return (
          <div className={styles.questionEditor}>
            <h3>4 Auswahlmöglichkeiten</h3>
            <p>Erstelle genau 4 Antwortoptionen für eine ausgewogene Auswahl.</p>
            <div className={styles.optionsContainer}>
              {[0, 1, 2, 3].map((index) => (
                <QuestionOption index={index} currentQuestion={currentQuestion} updateQuestionOption={updateQuestionOption} />
              ))}
            </div>
          </div>
        );

      case 'two_choice':
        return (
          <div className={styles.questionEditor}>
            <h3>2 Auswahlmöglichkeiten</h3>
            <p>Perfekt für Ja/Nein Fragen oder einfache Entscheidungen.</p>
            <div className={styles.optionsContainer}>
              {[0, 1].map((index) => (
                <QuestionOption index={index} currentQuestion={currentQuestion} updateQuestionOption={updateQuestionOption} />
              ))}
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className={styles.questionEditor}>
            <h3>Progressbar Bewertung</h3>
            <p>Erstelle eine Bewertungsskala für quantitative Antworten.</p>
            <div className={styles.progressSettings}>
              <div className={styles.rangeInput}>
                <label>Minimaler Wert:</label>
                <input
                  type="number"
                  value={currentQuestion.minValue || 1}
                  onChange={(e) => updateCurrentQuestion('minValue', parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
              <div className={styles.rangeInput}>
                <label>Maximaler Wert:</label>
                <input
                  type="number"
                  value={currentQuestion.maxValue || 10}
                  onChange={(e) => updateCurrentQuestion('maxValue', parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
            </div>
            <div className={styles.progressPreview}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill}></div>
              </div>
              <div className={styles.progressLabels}>
                <span>{currentQuestion.minValue || 1}</span>
                <span>{currentQuestion.maxValue || 10}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.createPageContainer}>
      <div className={styles.container}>
        {/* Custom Navbar */}
        <nav className={styles.createNavbar}>
          <div className={styles.navbarLeft}>
            <Image src="/logo.png" alt="Oponion Logo" width={32} height={32} />
            <span className={styles.brandName}>OPONION</span>
          </div>
          <div className={styles.navbarRight}>
            <button className={styles.closeButton} onClick={handleClose}>✕</button>
            <button className={styles.saveButton} onClick={saveQuestion}>Speichern</button>
          </div>
        </nav>

        <div className={styles.mainContent}>
          <div className={styles.leftColumn}>
            <div className={styles.titleContainer}>
              <input
                type="text"
                placeholder="Titel der Umfrage"
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
              />
            </div>
            
            <div className={styles.surveySettingsContainer}>
              <button 
                className={styles.settingsToggle}
                onClick={() => setShowSurveySettings(!showSurveySettings)}
              >
                <span>Umfrage-Einstellungen</span>
                <span className={styles.toggleIcon}>
                  {showSurveySettings ? '▼' : '▶'}
                </span>
              </button>
              
              {showSurveySettings && (
                <div className={styles.surveySettings}>
                  <div className={styles.settingRow}>
                    <div className={styles.settingItem}>
                      <label>Zeitlimit (Minuten):</label>
                      <input
                        type="number"
                        min="0"
                        max="120"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                        placeholder="0 = kein Zeitlimit"
                      />
                      <span className={styles.settingHint}>
                        {timeLimit === 0 ? 'Kein Zeitlimit' : `${timeLimit} Minuten`}
                      </span>
                    </div>
                    
                    <div className={styles.settingItem}>
                      <label>Punkte für Teilnahme:</label>
                      <div className={styles.pointsInputContainer}>
                        <input
                          type="number"
                          min="100"
                          max="1000"
                          value={points}
                          onChange={(e) => setPoints(parseInt(e.target.value) || 100)}
                          placeholder="Auto"
                        />
                        <button 
                          className={styles.autoButton}
                          onClick={() => setPoints(calculatePoints(questions.length))}
                          title="Automatische Berechnung wiederherstellen"
                        >
                          Auto
                        </button>
                      </div>
                      <span className={styles.settingHint}>
                        {points} Punkte (Auto: {calculatePoints(questions.length)}P)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.questionsOverview}>
              <h3>Fragen Übersicht</h3>
              <div className={styles.questionsList}>
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`${styles.questionSlide} ${selectedQuestionId === question.id ? styles.selected : ''}`}
                    onClick={() => selectQuestion(question.id)}
                  >
                    <div className={styles.slideHeader}>
                      <div className={styles.slideHeaderContainer}>
                        <span className={styles.slideNumber}>
                          {index + 1}
                        </span>
                        <div className={styles.slideContent}>
                          {question.question || 'Keine Frage definiert'}
                        </div>
                      </div>
                      <div className={styles.slideActions}>
                        <button onClick={(e) => { e.stopPropagation(); copyQuestion(question.id); }}>📋</button>
                        <button onClick={(e) => { e.stopPropagation(); deleteQuestion(question.id); }}>🗑️</button>
                      </div>
                    </div>

                    {renderQuestionPreview(question)}
                  </div>
                ))}
                <button onClick={addQuestion} className={styles.addQuestionButton}>
                  + Frage hinzufügen
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Question Editor */}
          <div className={styles.rightColumn}>
            <div className={styles.questionForm}>
              <div className={styles.questionHeader}>
                <input
                  type="text"
                  value={currentQuestion.question}
                  onChange={(e) => updateCurrentQuestion('question', e.target.value)}
                  placeholder="Frage eingeben..."
                  className={styles.questionInput}
                />
                <select
                  value={currentQuestion.type}
                  onChange={(e) => updateCurrentQuestion('type', e.target.value)}
                  className={styles.questionTypeSelect}
                >
                  {questionTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {renderQuestionEditor()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Exit Popup */}
      {showExitPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>Änderungen speichern?</h3>
            <p>Möchtest du deine Änderungen als Entwurf speichern, bevor du gehst?</p>
            <div className={styles.popupButtons}>
              <button onClick={handleExitWithoutSaving} className={styles.popupButtonSecondary}>
                Verwerfen
              </button>
              <button onClick={handleSaveAndExit} className={styles.popupButtonPrimary}>
                Als Entwurf speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 