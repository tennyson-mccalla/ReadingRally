import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../../store/rewardsStore';

interface RewardAnimationProps {
  points?: number;
  badge?: Badge;
  onComplete: () => void;
}

export const RewardAnimation: React.FC<RewardAnimationProps> = ({
  points,
  badge,
  onComplete,
}) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const rarityColors = {
    common: 'bg-neutral',
    rare: 'bg-primary',
    epic: 'bg-secondary',
    legendary: 'bg-accent',
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <motion.div
          className="flex flex-col items-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.5, 1.2, 1],
            opacity: [0, 1, 1],
          }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{
            duration: 0.5,
            times: [0, 0.7, 1],
            ease: "easeOut",
          }}
        >
          {points && (
            <motion.div
              className="text-4xl font-bold text-primary mb-4"
              animate={{
                y: [-50, 0],
                opacity: [0, 1],
              }}
              transition={{ delay: 0.2 }}
            >
              +{points} points!
            </motion.div>
          )}

          {badge && (
            <motion.div
              className={`p-8 rounded-full ${rarityColors[badge.rarity]} text-6xl flex items-center justify-center`}
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.5,
                times: [0, 0.2, 0.8, 1],
                repeat: 2,
              }}
            >
              {badge.icon}
            </motion.div>
          )}

          {badge && (
            <motion.div
              className="text-center mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-1">{badge.name}</h3>
              <p className="text-base-content/70">{badge.description}</p>
              <div className={`badge ${rarityColors[badge.rarity]} mt-2`}>
                {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
              </div>
            </motion.div>
          )}

          <motion.div
            className="absolute inset-0 bg-base-100/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
