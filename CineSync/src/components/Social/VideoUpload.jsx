import { useRef } from 'react';

export default function VideoUpload() {
  // 1. Create the reference
  const mainPageRef = useRef(null);

  const handleScroll = () => {
    // 2. Trigger the scroll
    mainPageRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  return (
    <div>
      {/* The Clickable Icon */}
      <div style={{ height: '100vh' }}>
        <h1>Welcome</h1>
     
        <button onClick={handleScroll} 
          style={{ cursor: 'pointer', fontSize: '2rem' }} 
        >Click</button>
      </div>

      {/* The Target Section */}
      <div 
        id="main-page" 
        ref={mainPageRef} 
        style={{ height: '100vh', backgroundColor: '#f0f0f0' }}
      >
        <h2>You've arrived at the Main Page</h2>
      </div>
    </div>
  );
}