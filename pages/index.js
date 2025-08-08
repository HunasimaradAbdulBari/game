// pages/index.js - Science Lab Quest Menu
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import LevelSelector from '../components/LevelSelector';
import Button from '../components/Button';
import { resetProgress, getCurrentLevel, getCurrentSubject, setCurrentSubject } from '../utils/storage';

export default function MenuPage() {
  const router = useRouter();
  const [currentScene, setCurrentScene] = useState('subject'); // 'subject' or 'level'
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const subjects = [
    {
      id: 'physics',
      name: 'Physics',
      icon: '⚡',
      description: 'Explore mechanics, electricity & waves'
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      icon: '🧪',
      description: 'Discover reactions & molecular science'
    },
    {
      id: 'electronics',
      name: 'Electronics',
      icon: '💡',
      description: 'Build circuits & digital systems'
    }
  ];

  const handleSubjectSelect = (subjectId) => {
    setCurrentSubject(subjectId);
    setSelectedSubject(subjectId);
    setCurrentScene('level');
  };

  const handleLevelSelect = (level) => {
    router.push('/restaurant');
  };

  const handleBackToSubjects = () => {
    setCurrentScene('subject');
    setSelectedSubject('');
  };

  const handleResetProgress = () => {
    if (typeof window !== 'undefined' && window.confirm) {
      const confirmReset = window.confirm('Are you sure you want to reset all progress? This cannot be undone.');
      if (confirmReset) {
        resetProgress();
        window.location.reload();
      }
    }
  };

  const handleShowInstructions = () => {
    setShowInstructions(true);
  };

  return (
    <Layout scene="menu">
      <div
        className="menu-scene"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center',
          position: 'relative',
          gap: 'clamp(12px, 3vw, 24px)',
          padding: 'clamp(8px, 2vw, 16px)',
        }}
      >
        {/* Floating Elements */}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="floating-particle"
            style={{
              position: 'absolute',
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              backgroundColor: '#33a3dc',
              borderRadius: '50%',
              opacity: Math.random() * 0.3 + 0.1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 12 + 8}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 4}s`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Title Section */}
        <div className="title-section" style={{ flexShrink: 0 }}>
          <h1
            style={{
              fontSize: 'clamp(28px, 8vw, 48px)',
              fontWeight: '800',
              color: '#1e293b',
              marginBottom: 'clamp(8px, 2vw, 16px)',
              textShadow: '0 2px 4px rgba(203, 213, 225, 0.8)',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Science Lab Quest
          </h1>
          <h2
            style={{
              fontSize: 'clamp(16px, 4vw, 24px)',
              fontWeight: '600',
              color: '#475569',
            }}
          >
            {currentScene === 'subject' ? 'Choose Your Subject' : `${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} - Select Level`}
          </h2>
        </div>

        {/* Content Section */}
        {currentScene === 'subject' ? (
          /* Subject Selection */
          <div
            className="subjects-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 25vw, 280px), 1fr))',
              gap: 'clamp(16px, 3vw, 24px)',
              maxWidth: '900px',
              width: '100%',
              padding: 'clamp(8px, 2vw, 16px)',
            }}
          >
            {subjects.map((subject, index) => (
              <div
                key={subject.id}
                className="container subject-button"
                onClick={() => handleSubjectSelect(subject.id)}
                style={{
                  position: 'relative',
                  padding: '3px',
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  borderRadius: '0.9em',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                  animation: `fadeIn 0.8s ease-out ${index * 0.2}s both`,
                }}
              >
                <div
                  className="subject-content"
                  style={{
                    fontSize: '1.2em',
                    padding: 'clamp(16px, 3vw, 24px)',
                    borderRadius: '0.7em',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#1e293b',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div style={{ fontSize: '2.5em', marginBottom: '8px' }}>
                    {subject.icon}
                  </div>
                  <h3 style={{ 
                    fontSize: 'clamp(16px, 3vw, 20px)', 
                    fontWeight: '700', 
                    marginBottom: '6px',
                    color: '#1e293b'
                  }}>
                    {subject.name}
                  </h3>
                  <p style={{ 
                    fontSize: 'clamp(12px, 2.5vw, 14px)', 
                    color: '#64748b',
                    fontWeight: '500'
                  }}>
                    {subject.description}
                  </p>
                </div>
                <div
                  className="container-before"
                  style={{
                    content: '""',
                    position: 'absolute',
                    inset: '0',
                    margin: 'auto',
                    borderRadius: '0.9em',
                    zIndex: '-10',
                    filter: 'blur(0)',
                    transition: 'filter 0.4s ease',
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Level Selection */
          <div className="level-section" style={{ flexShrink: 0 }}>
            <LevelSelector onLevelSelect={handleLevelSelect} subject={selectedSubject} />
            <Button
              variant="secondary"
              onClick={handleBackToSubjects}
              style={{ marginTop: '16px' }}
            >
              ← Back to Subjects
            </Button>
          </div>
        )}

        {/* Bottom Buttons */}
        <div
          className="bottom-buttons"
          style={{
            display: 'flex',
            gap: 'clamp(8px, 2vw, 16px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Button variant="secondary" onClick={handleResetProgress}>
            Reset Game
          </Button>
          <Button variant="secondary" onClick={handleShowInstructions}>
            How to Play
          </Button>
        </div>

        {/* Instructions Modal */}
        {showInstructions && (
          <div
            className="instructions-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              padding: 'clamp(8px, 2vw, 20px)',
            }}
            onClick={() => setShowInstructions(false)}
          >
            <div
              className="instructions-panel"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'clamp(12px, 2.5vw, 20px)',
                padding: 'clamp(16px, 4vw, 32px)',
                maxWidth: 'min(90vw, 600px)',
                maxHeight: '80vh',
                overflow: 'auto',
                border: '3px solid #2563eb',
                textAlign: 'left',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ color: '#1e293b', marginBottom: '20px', fontSize: '24px', fontWeight: '700' }}>
                🧪 HOW TO PLAY SCIENCE LAB QUEST
              </h3>

              <div style={{ marginBottom: '24px', lineHeight: '1.6' }}>
                <p><strong>1.</strong> Choose your subject: Physics, Chemistry, or Electronics</p>
                <p><strong>2.</strong> Select a difficulty level (1-3)</p>
                <p><strong>3.</strong> Read the experiment requirements from your teacher</p>
                <p><strong>4.</strong> Go to the lab equipment store and collect the right items</p>
                <p><strong>5.</strong> Drag items to your basket or tap to add them</p>
                <p><strong>6.</strong> Submit your equipment list to complete the experiment!</p>
                <p><strong>7.</strong> Get all items correct to unlock the next level!</p>
              </div>

              <Button
                variant="primary"
                onClick={() => setShowInstructions(false)}
                className="got-it-button"
                style={{ width: '100%' }}
              >
                GOT IT!
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }

        .subject-button:hover {
          transform: scale(1.05);
        }

        .subject-button:hover .container-before {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          filter: blur(1.2em);
        }

        .subject-button:active .container-before {
          filter: blur(0.2em);
        }

        @media (max-width: 768px) {
          .subjects-grid {
            grid-template-columns: 1fr;
            max-width: 350px;
          }
        }
      `}</style>
    </Layout>
  );
}
