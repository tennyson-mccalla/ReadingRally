import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../common/Card';
import { CardBody } from '../common/Card';

interface AchievementUnlockProps {
  achievement: {
    name: string;
    description: string;
    icon: string;
  };
  onClose: () => void;
}

export const AchievementUnlock: React.FC<AchievementUnlockProps> = ({
  achievement,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, y: -50, scale: 0.3 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20,
          },
        }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      >
        <Card variant="achievement">
          <CardBody>
            <div className="flex items-center gap-4 p-2">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <motion.span
                  className="text-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  {achievement.icon}
                </motion.span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
                <p className="font-semibold text-accent">{achievement.name}</p>
                <p className="text-sm text-base-content/70">{achievement.description}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
