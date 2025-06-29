import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Calendar, TrendingUp, TrendingDown, Award } from 'lucide-react';

interface TimelineEvent {
  date: string;
  score: number;
  event: string;
  type: 'positive' | 'negative' | 'milestone';
  description: string;
}

interface ReputationTimelineProps {
  historicalData: Array<{
    totalScore: number;
    loanEligibility: number;
    factors: Array<{
      name: 'Transaction Consistency' | 'DeFi Footprint' | 'Asset Diversity' | 'Governance Activity';
      score: number;
      weight: number;
      summary: string;
    }>;
  }>;
  isVisible: boolean;
  onTimelineChange: (index: number) => void;
  currentIndex: number;
}

const ReputationTimeline: React.FC<ReputationTimelineProps> = ({
  historicalData,
  isVisible,
  onTimelineChange,
  currentIndex
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Mock timeline events for demonstration
  const timelineEvents: TimelineEvent[] = [
    {
      date: '2024-01-15',
      score: 650,
      event: 'First DeFi Interaction',
      type: 'positive',
      description: 'Started using Uniswap for token swaps'
    },
    {
      date: '2024-02-20',
      score: 680,
      event: 'DAO Governance Vote',
      type: 'positive',
      description: 'Participated in first governance proposal'
    },
    {
      date: '2024-03-10',
      score: 620,
      event: 'Liquidation Event',
      type: 'negative',
      description: 'Position liquidated due to market volatility'
    },
    {
      date: '2024-04-05',
      score: 720,
      event: 'Diversification Milestone',
      type: 'milestone',
      description: 'Portfolio reached 10+ different tokens'
    },
    {
      date: '2024-05-12',
      score: 785,
      event: 'Consistency Achievement',
      type: 'milestone',
      description: 'Maintained regular transactions for 90 days'
    }
  ];

  useEffect(() => {
    if (!timelineRef.current || !playheadRef.current || !trackRef.current) return;

    if (isVisible) {
      // Slide up animation
      gsap.fromTo(timelineRef.current,
        { y: "100%", opacity: 0 },
        { 
          y: "0%", 
          opacity: 1, 
          duration: 0.5, 
          ease: "power3.out" 
        }
      );

      // Initialize draggable playhead
      const draggable = Draggable.create(playheadRef.current, {
        type: "x",
        bounds: trackRef.current,
        onDrag: function() {
          setIsDragging(true);
          const progress = this.x / (trackRef.current!.offsetWidth - playheadRef.current!.offsetWidth);
          const index = Math.round(progress * (historicalData.length - 1));
          onTimelineChange(Math.max(0, Math.min(index, historicalData.length - 1)));
        },
        onDragEnd: function() {
          setIsDragging(false);
        }
      });

      return () => {
        draggable[0].kill();
      };
    } else {
      gsap.to(timelineRef.current, {
        y: "100%",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, [isVisible, historicalData.length, onTimelineChange]);

  // Update playhead position when currentIndex changes (not from dragging)
  useEffect(() => {
    if (!isDragging && playheadRef.current && trackRef.current) {
      const progress = currentIndex / (historicalData.length - 1);
      const targetX = progress * (trackRef.current.offsetWidth - playheadRef.current.offsetWidth);
      
      gsap.to(playheadRef.current, {
        x: targetX,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [currentIndex, isDragging, historicalData.length]);

  if (!isVisible) return null;

  const currentData = historicalData[currentIndex];
  const currentEvent = timelineEvents[currentIndex];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'milestone': return <Award className="w-4 h-4 text-gold-400" />;
      default: return <Calendar className="w-4 h-4 text-blue-400" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-green-400/30 bg-green-500/10';
      case 'negative': return 'border-red-400/30 bg-red-500/10';
      case 'milestone': return 'border-gold-400/30 bg-gold-500/10';
      default: return 'border-blue-400/30 bg-blue-500/10';
    }
  };

  return (
    <div
      ref={timelineRef}
      className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-2xl border-t border-white/20 p-6 z-40"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="text-xl font-bold text-white">Reputation Journey</h3>
              <p className="text-gray-300 text-sm">
                {currentEvent?.date} • Score: {currentData?.totalScore || 0}
              </p>
            </div>
          </div>
          
          {/* Current Event Info */}
          {currentEvent && (
            <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg border ${getEventColor(currentEvent.type)}`}>
              {getEventIcon(currentEvent.type)}
              <div>
                <div className="text-white font-medium text-sm">{currentEvent.event}</div>
                <div className="text-gray-400 text-xs">{currentEvent.description}</div>
              </div>
            </div>
          )}
        </div>

        {/* Timeline Track */}
        <div className="relative">
          <div
            ref={trackRef}
            className="relative h-2 bg-white/10 rounded-full mb-4"
          >
            {/* Progress fill */}
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentIndex / (historicalData.length - 1)) * 100}%` }}
            />
            
            {/* Event markers */}
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                  index <= currentIndex 
                    ? 'bg-white border-blue-400 scale-110' 
                    : 'bg-gray-600 border-gray-500'
                }`}
                style={{ left: `${(index / (historicalData.length - 1)) * 100}%` }}
                onClick={() => onTimelineChange(index)}
              />
            ))}
            
            {/* Draggable playhead */}
            <div
              ref={playheadRef}
              className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white cursor-grab active:cursor-grabbing shadow-lg"
              style={{ marginLeft: '-12px' }}
            >
              <div className="absolute inset-1 bg-white/30 rounded-full" />
            </div>
          </div>

          {/* Timeline labels */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>{timelineEvents[0]?.date}</span>
            <span>Historical Journey</span>
            <span>{timelineEvents[timelineEvents.length - 1]?.date}</span>
          </div>
        </div>

        {/* Score visualization */}
        <div className="flex items-center justify-center space-x-8 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{currentData?.totalScore || 0}</div>
            <div className="text-sm text-gray-400">Total Score</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-400">
              {currentData?.loanEligibility?.toLocaleString() || 0} ICP
            </div>
            <div className="text-sm text-gray-400">Loan Eligibility</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReputationTimeline;