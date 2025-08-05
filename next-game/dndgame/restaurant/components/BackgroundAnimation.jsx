// components/BackgroundAnimation.jsx
export default function BackgroundAnimation() {
  return (
    <div className="background-animation-container">
      {/* Floating Bubbles */}
      <div className="bubble-container">
        <div className="bubble">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="bubble">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Floating Pyramids */}
      <div className="pyramid-loader pyramid-1">
        <div className="wrapper">
          <span className="side side1"></span>
          <span className="side side2"></span>
          <span className="side side3"></span>
          <span className="side side4"></span>
          <span className="shadow"></span>
        </div>
      </div>

      <div className="pyramid-loader pyramid-2">
        <div className="wrapper">
          <span className="side side1"></span>
          <span className="side side2"></span>
          <span className="side side3"></span>
          <span className="side side4"></span>
          <span className="shadow"></span>
        </div>
      </div>

      <style jsx>{`
        .background-animation-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(135deg, #e3f2fd 0%, #f8fdff 50%, #ffffff 100%);
        }

        /* Original rotating gradient background */
        .background-animation-container::before,
        .background-animation-container::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg,
            rgba(187, 222, 251, 0.3),
            rgba(144, 202, 249, 0.4),
            rgba(100, 181, 246, 0.3),
            rgba(66, 165, 245, 0.2),
            rgba(33, 150, 243, 0.3),
            rgba(30, 136, 229, 0.4),
            rgba(25, 118, 210, 0.3),
            rgba(187, 222, 251, 0.3)
          );
          transform: translate(-50%, -50%);
          animation: rotate 15s linear infinite;
          filter: blur(80px);
          opacity: 0.4;
        }

        .background-animation-container::after {
          width: 180%;
          height: 180%;
          animation: rotate-reverse 20s linear infinite;
          opacity: 0.3;
        }

        /* Bubble Container */
        .bubble-container {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        /* Enhanced Bubbles with Light Theme */
        .bubble {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          box-shadow: inset 0 0 25px rgba(33, 150, 243, 0.1);
          animation: bubble-float 10s ease-in-out infinite;
          opacity: 0.6;
        }

        .bubble:nth-child(1) {
          top: 10%;
          left: 10%;
          zoom: 0.6;
          animation-delay: 0s;
        }

        .bubble:nth-child(2) {
          top: 20%;
          right: 15%;
          zoom: 0.4;
          animation-delay: -2s;
        }

        .bubble:nth-child(3) {
          top: 60%;
          left: 20%;
          zoom: 0.5;
          animation-delay: -4s;
        }

        .bubble:nth-child(4) {
          bottom: 20%;
          right: 20%;
          zoom: 0.3;
          animation-delay: -6s;
        }

        .bubble:nth-child(5) {
          bottom: 10%;
          left: 50%;
          zoom: 0.45;
          animation-delay: -8s;
        }

        @keyframes bubble-float {
          0%, 100% {
            transform: translateY(-30px) translateX(-10px) scale(1);
          }
          25% {
            transform: translateY(20px) translateX(15px) scale(1.1);
          }
          50% {
            transform: translateY(30px) translateX(-5px) scale(0.9);
          }
          75% {
            transform: translateY(-10px) translateX(20px) scale(1.05);
          }
        }

        .bubble::before {
          content: '';
          position: absolute;
          top: 30px;
          left: 35px;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.8);
          z-index: 10;
          filter: blur(1px);
        }

        .bubble::after {
          content: '';
          position: absolute;
          top: 50px;
          left: 60px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          z-index: 10;
          filter: blur(1px);
        }

        .bubble span {
          position: absolute;
          border-radius: 50%;
        }

        .bubble span:nth-child(1) {
          inset: 8px;
          border-left: 10px solid rgba(33, 150, 243, 0.3);
          filter: blur(6px);
        }

        .bubble span:nth-child(2) {
          inset: 8px;
          border-right: 10px solid rgba(100, 181, 246, 0.4);
          filter: blur(6px);
        }

        .bubble span:nth-child(3) {
          inset: 8px;
          border-top: 10px solid rgba(187, 222, 251, 0.5);
          filter: blur(6px);
        }

        .bubble span:nth-child(4) {
          inset: 20px;
          border-left: 10px solid rgba(144, 202, 249, 0.3);
          filter: blur(8px);
        }

        .bubble span:nth-child(5) {
          inset: 8px;
          border-bottom: 8px solid rgba(255, 255, 255, 0.4);
          filter: blur(6px);
          transform: rotate(330deg);
        }

        /* Enhanced Pyramids with Light Theme */
        .pyramid-loader {
          position: absolute;
          width: 80px;
          height: 80px;
          display: block;
          transform-style: preserve-3d;
          transform: rotateX(-20deg);
          opacity: 0.4;
          pointer-events: none;
        }

        .pyramid-1 {
          top: 15%;
          right: 25%;
          animation: pyramid-drift 12s ease-in-out infinite;
        }

        .pyramid-2 {
          bottom: 25%;
          left: 15%;
          animation: pyramid-drift 15s ease-in-out infinite reverse;
          animation-delay: -5s;
        }

        @keyframes pyramid-drift {
          0%, 100% {
            transform: rotateX(-20deg) translateY(-20px) translateX(-10px);
          }
          33% {
            transform: rotateX(-15deg) translateY(15px) translateX(20px);
          }
          66% {
            transform: rotateX(-25deg) translateY(25px) translateX(-15px);
          }
        }

        .wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          100% {
            transform: rotateY(360deg);
          }
        }

        .pyramid-loader .wrapper .side {
          width: 50px;
          height: 50px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          transform-origin: center top;
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }

        .pyramid-loader .wrapper .side1 {
          transform: rotateZ(-30deg) rotateY(90deg);
          background: conic-gradient(
            rgba(33, 150, 243, 0.4),
            rgba(100, 181, 246, 0.3),
            rgba(187, 222, 251, 0.4),
            rgba(144, 202, 249, 0.3)
          );
        }

        .pyramid-loader .wrapper .side2 {
          transform: rotateZ(30deg) rotateY(90deg);
          background: conic-gradient(
            rgba(144, 202, 249, 0.3),
            rgba(187, 222, 251, 0.4),
            rgba(100, 181, 246, 0.3),
            rgba(33, 150, 243, 0.4)
          );
        }

        .pyramid-loader .wrapper .side3 {
          transform: rotateX(30deg);
          background: conic-gradient(
            rgba(187, 222, 251, 0.4),
            rgba(144, 202, 249, 0.3),
            rgba(33, 150, 243, 0.3),
            rgba(100, 181, 246, 0.4)
          );
        }

        .pyramid-loader .wrapper .side4 {
          transform: rotateX(-30deg);
          background: conic-gradient(
            rgba(100, 181, 246, 0.4),
            rgba(33, 150, 243, 0.3),
            rgba(187, 222, 251, 0.3),
            rgba(144, 202, 249, 0.4)
          );
        }

        .pyramid-loader .wrapper .shadow {
          width: 40px;
          height: 40px;
          background: rgba(33, 150, 243, 0.2);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          transform: rotateX(90deg) translateZ(-30px);
          filter: blur(8px);
        }

        /* Original keyframes */
        @keyframes rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes rotate-reverse {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(-360deg);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .bubble {
            width: 100px;
            height: 100px;
          }
          
          .pyramid-loader {
            width: 60px;
            height: 60px;
          }
          
          .pyramid-loader .wrapper .side {
            width: 35px;
            height: 35px;
          }
        }

        @media (max-width: 480px) {
          .bubble {
            width: 80px;
            height: 80px;
          }
          
          .pyramid-loader {
            width: 50px;
            height: 50px;
          }
          
          .pyramid-loader .wrapper .side {
            width: 30px;
            height: 30px;
          }
        }
      `}</style>
    </div>
  );
}
