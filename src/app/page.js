"use client";

import { useState, useEffect } from "react";
import NavBar from "./NavBar"


// Function to parse the M3U data
const parseChannelsData = async () => {
  const response = await fetch("https://tech-ninjas-tv.vercel.app/channels.txt");
  const data = await response.text();

  const lines = data.split("\n").filter(line => line.trim() !== "");
  const channels = [];
  let currentChannel = {};
  lines.forEach(line => {
    if (line.startsWith('#EXTINF')) {
      const parts = line.split(',');
      const infoParts = parts[0].split(' ');
      currentChannel.name = parts[1];
      infoParts.forEach(part => {
        if (part.startsWith('tvg-logo=')) {
          currentChannel.logo = part.split('=')[1].replace(/"/g, '');
        }
      });
    } else if (line.startsWith('http')) {
      currentChannel.url = line;
      channels.push(currentChannel);
      currentChannel = {};
    }
  });
  console.log(channels);

  return channels;
};

export default function Home() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    parseChannelsData().then((parsedChannels) => {
      setChannels(parsedChannels);
    });
  }, []);

  const openPlayer = (url) => {
    const playerWindow = window.open(`/Player?url=${encodeURIComponent(url)}`, '_blank');
    if (playerWindow) {
      playerWindow.focus();
    } else {
      alert('Please allow popups for this website');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar></NavBar>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-purple-900 mb-6">Your Loved Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {channels.length > 0 ? (
            channels.map((channel, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105"
                onClick={() => openPlayer(channel.url)} // Open player in a new window
              >
                <div className="p-4 flex items-center justify-center h-40 bg-gray-50">
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-center text-gray-800 mb-1 truncate">
                    {channel.name}
                  </h3>
                  <p className="text-sm text-gray-500 text-center">{channel.category}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Loading channels...</p>
          )}
        </div>
      </main>
    </div>
  );
}
