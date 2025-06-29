import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { X, Loader } from 'lucide-react';

interface AIModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  isLoading: boolean;
  onClose: () => void;
}

const AIModal: React.FC<AIModalProps> = ({
  isOpen,
  title,
  content,
  isLoading,
  onClose
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalRef.current || !backdropRef.current) return;

    if (isOpen) {
      // Scale up animation from center
      gsap.fromTo(modalRef.current,
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.4, 
          ease: "back.out(1.7)" 
        }
      );

      // Backdrop blur animation
      gsap.fromTo(backdropRef.current,
        { opacity: 0, backdropFilter: "blur(0px)" },
        { 
          opacity: 1, 
          backdropFilter: "blur(20px)", 
          duration: 0.3 
        }
      );

      // Content reveal animation (when not loading)
      if (!isLoading && content && contentRef.current) {
        // Split content into paragraphs for staggered animation
        const paragraphs = content.split('\n').filter(p => p.trim());
        contentRef.current.innerHTML = paragraphs
          .map(p => `<p class="mb-4 opacity-0">${p}</p>`)
          .join('');

        const pElements = contentRef.current.children;
        gsap.to(pElements, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          delay: 0.5,
          ease: "power2.out"
        });
      }
    } else {
      // Scale down animation
      gsap.to(modalRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      });

      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3
      });
    }
  }, [isOpen, content, isLoading]);

  if (!isOpen) return null;

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="text-gray-300 leading-relaxed">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-blue-400" />
              <span className="ml-3 text-white">AI is analyzing your data...</span>
            </div>
          ) : (
            <div ref={contentRef} className="space-y-4">
              {content || "No content available."}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400 text-center">
              Powered by AI • OnChainScore Analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIModal;