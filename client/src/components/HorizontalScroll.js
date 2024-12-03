import React, { useRef, useEffect } from 'react';
import '../css/HorizontalScroll.css'; // Make sure to create and link this CSS file

const HorizontalScroll = ({ children }) => {
  const scrollRef = useRef(null);

  const leftScroll = () => {
    scrollRef.current.scrollBy({
      left: -200, // Adjust the scroll amount as needed
      behavior: "smooth"
    });
  };

  const rightScroll = () => {
    scrollRef.current.scrollBy({
      left: 200, // Adjust the scroll amount as needed
      behavior: "smooth"
    });
  };

  return (
    <div className="horizontal-scroll-container">
      <button className="scroll-button left" onClick={leftScroll}>
        &lt; {/* Replace with your preferred icon */}
      </button>
      <div className="scrollable-content" ref={scrollRef}>
        {children}
      </div>
      <button className="scroll-button right" onClick={rightScroll}>
        &gt; {/* Replace with your preferred icon */}
      </button>
    </div>
  );
};

export default HorizontalScroll;
