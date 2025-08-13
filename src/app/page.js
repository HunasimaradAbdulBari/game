// src/app/page.js - Science Lab Quest Menu - SCALING ISSUES FIXED
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Layout from '../components/Quest/Layout';
import LevelSelector from '../components/Quest/LevelSelector';
import Button from '../components/Quest/Button';
import { resetProgress, getCurrentLevel, getCurrentSubject, setCurrentSubject } from '../components/Quest/utils/storage';


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
   router.push('/components/Quest/restaurant');
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
         justifyContent: 'space-between',
         minHeight: '100dvh',  // FIXED: Use dvh for mobile compatibility
         height: '100dvh',     // FIXED: Use dvh instead of vh
         textAlign: 'center',
         position: 'relative',
         padding: 'clamp(8px, 2vh, 16px) clamp(8px, 2vw, 16px)',
         boxSizing: 'border-box',
         overflow: 'hidden',
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
       <div className="title-section" style={{ 
         flexShrink: 0,
         width: '100%',
         paddingTop: 'clamp(8px, 2vh, 20px)',
       }}>
         <h1
           style={{
             fontSize: 'clamp(22px, 5.5vh, 38px)',  // FIXED: Better scaling
             fontWeight: '800',
             color: '#1e293b',
             margin: '0',  // FIXED: Remove all margins
             marginBottom: 'clamp(6px, 1.2vh, 12px)',
             textShadow: '0 2px 4px rgba(203, 213, 225, 0.8)',
             background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent',
             backgroundClip: 'text',
             lineHeight: 1.1,
           }}
         >
           Science Lab Quest
         </h1>
         <h2
           style={{
             fontSize: 'clamp(13px, 2.8vh, 18px)',  // FIXED: Better scaling
             fontWeight: '600',
             color: '#475569',
             margin: '0',
           }}
         >
           {currentScene === 'subject' ? 'Choose Your Subject' : `${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} - Select Level`}
         </h2>
       </div>

       {/* Content Section */}
       <div style={{ 
         flex: '1 1 auto',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         width: '100%',
         minHeight: 0,
         padding: 'clamp(8px, 2vh, 16px) 0',
       }}>
         {currentScene === 'subject' ? (
           /* Subject Selection - FIXED LAYOUT */
           <div
             className="subjects-grid"
             style={{
               display: 'grid',  // FIXED: Use grid instead of flex
               gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(180px, 25vw, 240px), 1fr))',
               gap: 'clamp(12px, 2.5vh, 18px)',
               maxWidth: '600px',  // FIXED: Reduced max width
               width: '100%',
               padding: '0 clamp(8px, 2vw, 16px)',
               alignItems: 'center',
               justifyContent: 'center',
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
                     fontSize: '1.1em',  // FIXED: Slightly smaller
                     padding: 'clamp(12px, 2.8vh, 18px)',  // FIXED: Better scaling
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
                   <div style={{ fontSize: 'clamp(26px, 3.5vh, 36px)', marginBottom: 'clamp(4px, 0.8vh, 6px)' }}>
                     {subject.icon}
                   </div>
                   <h3 style={{ 
                     fontSize: 'clamp(13px, 2.2vh, 16px)', 
                     fontWeight: '700', 
                     marginBottom: 'clamp(3px, 0.6vh, 6px)',
                     margin: '0 0 clamp(3px, 0.6vh, 6px) 0',
                     color: '#1e293b'
                   }}>
                     {subject.name}
                   </h3>
                   <p style={{ 
                     fontSize: 'clamp(10px, 1.8vh, 12px)', 
                     color: '#64748b',
                     fontWeight: '500',
                     margin: '0',
                     lineHeight: 1.3,
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
           <div className="level-section" style={{ 
             flexShrink: 0,
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             gap: 'clamp(12px, 2vh, 16px)',
           }}>
             <LevelSelector onLevelSelect={handleLevelSelect} subject={selectedSubject} />
             <Button
               variant="secondary"
               onClick={handleBackToSubjects}
             >
               ← Back to Subjects
             </Button>
           </div>
         )}
       </div>

       {/* Bottom Buttons - COMPLETELY FIXED */}
       <div
         className="bottom-buttons"
         style={{
           marginBottom:'70px',
           display: 'flex',
           gap: 'clamp(8px, 2vw, 16px)',
           flexWrap: 'wrap',
           justifyContent: 'center',
           flexShrink: 0,  // FIXED: Prevent shrinking
           width: '100%',
           paddingBottom: 'clamp(8px, 1.5vh, 12px)',  // FIXED: Proper padding
           paddingTop: 'clamp(4px, 1vh, 8px)',  // FIXED: Add top padding
           zIndex: 10,
           // FIXED: Removed all negative margins
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

       /* FIXED: Better responsive breakpoints */
       @media (max-width: 768px) {
         .subjects-grid {
           grid-template-columns: 1fr;
           max-width: 320px;
           gap: clamp(10px, 2vh, 14px);
         }
       }

       /* FIXED: Better small screen handling */
       @media (max-height: 600px) {
         .menu-scene {
           justify-content: space-between;
           padding: clamp(4px, 1vh, 8px) clamp(4px, 1vw, 8px);
         }
         
         .bottom-buttons {
          margin-bottom: 140px;
           padding-bottom: clamp(12px, 1.3vh, 10px);
           padding-top: clamp(2px, 0.5vh, 4px);
         }
         
         .title-section {
           padding-top: clamp(4px, 1vh, 8px);
         }

         .subjects-grid {
           gap: clamp(8px, 1.5vh, 12px);
         }
       }

       /* FIXED: Very small screens */
       @media (max-height: 480px) {
         .title-section h1 {
           font-size: clamp(18px, 4vh, 26px);
         }
         
         .title-section h2 {
           font-size: clamp(11px, 2.2vh, 14px);
         }
       }
     `}</style>
   </Layout>
 );
}