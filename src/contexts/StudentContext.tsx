import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Challenge, Lesson, Badge } from '../types';
import { sampleStudents, challenges, lessons, badges } from '../data/sampleData';

interface StudentContextType {
  currentStudent: Student;
  updateStudent: (updates: Partial<Student>) => void;
  completeChallenge: (challengeId: string) => void;
  completeLesson: (lessonId: string) => void;
  awardBadge: (badgeId: string) => void;
  addPoints: (points: number) => void;
  playAchievementSound: () => void;
  purchaseItem: (itemId: string, price: number) => boolean;
  getOwnedItems: () => string[];
  allChallenges: Challenge[];
  allLessons: Lesson[];
  allBadges: Badge[];
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStudent, setCurrentStudent] = useState<Student>(sampleStudents[0]);
  const [ownedItems, setOwnedItems] = useState<string[]>([]);

  useEffect(() => {
    const savedStudent = localStorage.getItem('ecolearn_student');
    if (savedStudent) {
      setCurrentStudent(JSON.parse(savedStudent));
    }
    const savedItems = localStorage.getItem('ecolearn_owned_items');
    if (savedItems) {
      setOwnedItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ecolearn_student', JSON.stringify(currentStudent));
  }, [currentStudent]);

  useEffect(() => {
    localStorage.setItem('ecolearn_owned_items', JSON.stringify(ownedItems));
  }, [ownedItems]);

  const updateStudent = (updates: Partial<Student>) => {
    setCurrentStudent(prev => ({ ...prev, ...updates }));
  };

  const playAchievementSound = () => {
    // Create a simple achievement sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523.25; // C5
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const addPoints = (points: number) => {
    setCurrentStudent(prev => ({
      ...prev,
      ecoPoints: prev.ecoPoints + points,
      totalImpactScore: prev.totalImpactScore + points * 0.1
    }));
    playAchievementSound();
  };

  const purchaseItem = (itemId: string, price: number): boolean => {
    if (currentStudent.ecoPoints >= price && !ownedItems.includes(itemId)) {
      setCurrentStudent(prev => ({
        ...prev,
        ecoPoints: prev.ecoPoints - price
      }));
      setOwnedItems(prev => [...prev, itemId]);
      playAchievementSound();
      return true;
    }
    return false;
  };

  const getOwnedItems = (): string[] => {
    return ownedItems;
  };

  const completeChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    setCurrentStudent(prev => ({
      ...prev,
      completedChallenges: [...prev.completedChallenges, challengeId],
      ecoPoints: prev.ecoPoints + challenge.points,
      totalImpactScore: prev.totalImpactScore + challenge.points * 0.1
    }));
    
    playAchievementSound();
    checkForNewBadges(challengeId);
  };

  const completeLesson = (lessonId: string) => {
    setCurrentStudent(prev => ({
      ...prev,
      completedLessons: [...prev.completedLessons, lessonId],
      ecoPoints: prev.ecoPoints + 25
    }));
    playAchievementSound();
  };

  const awardBadge = (badgeId: string) => {
    setCurrentStudent(prev => ({
      ...prev,
      earnedBadges: [...prev.earnedBadges, { badgeId, dateEarned: new Date().toISOString() }]
    }));
    playAchievementSound();
  };

  const checkForNewBadges = (challengeId: string) => {
    // Check for specific badge criteria
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    // Tree-related challenges
    if (challenge.category === 'conservation' && !currentStudent.earnedBadges.find(b => b.badgeId === 'tree-hugger')) {
      awardBadge('tree-hugger');
    }

    // Waste-related challenges
    if (challenge.category === 'waste' && !currentStudent.earnedBadges.find(b => b.badgeId === 'waste-warrior')) {
      awardBadge('waste-warrior');
    }

    // Check for milestone badges based on total challenges completed
    const totalCompleted = currentStudent.completedChallenges.length + 1;
    if (totalCompleted === 5 && !currentStudent.earnedBadges.find(b => b.badgeId === 'eco-rookie')) {
      awardBadge('eco-rookie');
    }
    if (totalCompleted === 15 && !currentStudent.earnedBadges.find(b => b.badgeId === 'green-champion')) {
      awardBadge('green-champion');
    }
  };

  return (
    <StudentContext.Provider value={{
      currentStudent,
      updateStudent,
      completeChallenge,
      completeLesson,
      awardBadge,
      addPoints,
      playAchievementSound,
      purchaseItem,
      getOwnedItems,
      allChallenges: challenges,
      allLessons: lessons,
      allBadges: badges
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};