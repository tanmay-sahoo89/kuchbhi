import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { TrendingUp, Target, Award, Calendar, Flame, Zap, TreePine, Droplets } from 'lucide-react';
import { useStudent } from '../contexts/StudentContext';
import GlassCard from '../components/GlassCard';

const Dashboard: React.FC = () => {
  const { currentStudent, allChallenges, allBadges } = useStudent();
  const [showConfetti, setShowConfetti] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a recent achievement to celebrate
    const lastBadge = currentStudent.earnedBadges[currentStudent.earnedBadges.length - 1];
    if (lastBadge) {
      const timeSinceEarned = Date.now() - new Date(lastBadge.dateEarned).getTime();
      if (timeSinceEarned < 5000) { // Show confetti for achievements within last 5 seconds
        setShowConfetti(true);
        const badge = allBadges.find(b => b.id === lastBadge.badgeId);
        setRecentAchievement(badge?.name || '');
        setTimeout(() => {
          setShowConfetti(false);
          setRecentAchievement(null);
        }, 3000);
      }
    }
  }, [currentStudent.earnedBadges, allBadges]);

  const activeChallenges = allChallenges.filter(
    challenge => !currentStudent.completedChallenges.includes(challenge.id)
  ).slice(0, 3);

  const recentBadges = currentStudent.earnedBadges
    .slice(-3)
    .reverse()
    .map(earnedBadge => allBadges.find(badge => badge.id === earnedBadge.badgeId))
    .filter(Boolean);

  const levelProgress = (currentStudent.ecoPoints % 200) / 200 * 100;
  const weeklyProgress = (currentStudent.ecoPoints % currentStudent.weeklyGoal) / currentStudent.weeklyGoal * 100;

  const impactStats = [
    { icon: TreePine, label: 'Trees Planted', value: Math.floor(currentStudent.totalImpactScore / 50), color: 'text-[#F8D991]' },
    { icon: Droplets, label: 'Liters Saved', value: Math.floor(currentStudent.totalImpactScore * 10), color: 'text-[#F6B080]' },
    { icon: Zap, label: 'CO₂ Reduced (kg)', value: Math.floor(currentStudent.totalImpactScore * 2), color: 'text-[#F58B60]' },
  ];

  return (
    <div className="space-y-6">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome back, {currentStudent.name}! 🌱</h1>
              <p className="text-white/70 mt-2">
                You're at Level {currentStudent.level} with {currentStudent.ecoPoints} eco-points
              </p>
              <div className="mt-4 bg-white/20 rounded-full h-3 w-64">
                <motion.div
                  className="bg-gradient-to-r from-[#F6B080] to-[#F8D991] rounded-full h-3"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <p className="text-sm text-white/70 mt-2">
                {200 - (currentStudent.ecoPoints % 200)} points to next level
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-2xl font-bold text-white">
                <Flame className="h-6 w-6 text-[#E1664C]" />
                <span>{currentStudent.streak} day streak!</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Achievement Celebration */}
      <AnimatePresence>
        {recentAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
          >
            <GlassCard className="p-4 text-center border border-[#F8D991]/30">
              <Award className="h-12 w-12 text-[#F8D991] mx-auto mb-2" />
              <h3 className="text-xl font-bold text-white">🎉 New Badge Earned!</h3>
              <p className="text-[#F8D991]">{recentAchievement}</p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Eco Points</p>
                <p className="text-3xl font-bold text-[#F8D991]">{currentStudent.ecoPoints}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-[#F8D991] opacity-80" />
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Challenges Done</p>
                <p className="text-3xl font-bold text-[#F6B080]">{currentStudent.completedChallenges.length}</p>
              </div>
              <Target className="h-12 w-12 text-[#F6B080] opacity-80" />
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Badges Earned</p>
                <p className="text-3xl font-bold text-[#F58B60]">{currentStudent.earnedBadges.length}</p>
              </div>
              <Award className="h-12 w-12 text-[#F58B60] opacity-80" />
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Current Streak</p>
                <p className="text-3xl font-bold text-[#E1664C]">{currentStudent.streak} days</p>
              </div>
              <Calendar className="h-12 w-12 text-[#E1664C] opacity-80" />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Weekly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Weekly Goal Progress</h3>
          <div className="relative">
            <div className="bg-white/20 rounded-full h-4">
              <motion.div
                className="bg-gradient-to-r from-[#F6B080] to-[#F8D991] rounded-full h-4 flex items-center justify-end pr-2"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(weeklyProgress, 100)}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                {weeklyProgress > 20 && (
                  <span className="text-[#091D23] text-xs font-semibold">
                    {Math.floor(weeklyProgress)}%
                  </span>
                )}
              </motion.div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-white/70">
              <span>{currentStudent.ecoPoints % currentStudent.weeklyGoal} points</span>
              <span>{currentStudent.weeklyGoal} points goal</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Environmental Impact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Your Environmental Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {impactStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <Icon className={`h-12 w-12 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Active Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Active Challenges</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <GlassCard className="p-4" hover={false}>
                  <img
                    src={challenge.imageUrl}
                    alt={challenge.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-semibold text-white mb-2">{challenge.title}</h4>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{challenge.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${challenge.difficulty === 'Easy' ? 'bg-[#F8D991]/20 text-[#F8D991]' :
                        challenge.difficulty === 'Medium' ? 'bg-[#F6B080]/20 text-[#F6B080]' :
                        'bg-[#E1664C]/20 text-[#E1664C]'}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-[#F8D991] font-semibold">{challenge.points} pts</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">Recent Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentBadges.map((badge, index) => badge && (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <GlassCard className="p-3" hover={false}>
                    <div className="flex items-center space-x-3">
                      <img
                        src={badge.imageUrl}
                        alt={badge.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold text-white">{badge.name}</h4>
                        <p className="text-white/70 text-sm">{badge.tier} Badge</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;