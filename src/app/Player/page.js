"use client";
import React, { useEffect } from 'react';

const Player = () => {
  const playerRef = React.useRef(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const videoUrl = queryParams.get('url');



    // Load JW Player script dynamically
    const loadJWPlayer = () => {
      const script = document.createElement('script');
      script.src = "https://content.jwplatform.com/libraries/KB5zFt7A.js";
      script.async = true;
      document.body.appendChild(script);
      return script;
    };

    const initializePlayer = () => {
      if (window.jwplayer) {
        window.jwplayer.key = 'Khpp2dHxlBJHC8MCmLnBuV2jK/DwDnJMniwF6EO9HC/riJ712ZmbHg==';
        window.jwplayer(playerRef.current).setup({
          file: videoUrl, // Use the provided .ts stream URL
          width: '100%',
          height: '100%',
          autostart: true,
          type: 'mp2t', // Specify type for MPEG-TS
        });
      }
    };

    const script = loadJWPlayer();

    // Initialize the player when the script loads
    script.onload = initializePlayer;

    // Clean up the script and player when unmounting
    return () => {
      if (script) {
        document.body.removeChild(script);
      }
      if (window.jwplayer) {
        window.jwplayer(playerRef.current).remove();
      }
    };
  }, []);

  return (
    <div className="media-player-container" style={{ width: '100%', height: '100vh' }}>
      <div ref={playerRef} style={{ margin: '12px' }}></div>
    </div>
  );
};

export default Player;
