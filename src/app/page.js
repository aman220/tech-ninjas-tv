"use client";
import { Search, Menu, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

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
      <header className="bg-purple-900 text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Menu className="h-6 w-6 md:hidden" />
            <h1 className="text-2xl font-bold">Tech Ninjas</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-purple-300">Home</a>
            <a href="#" className="border-b-2 border-purple-500">Live TV</a>
            <a href="#" className="hover:text-purple-300">On Demand</a>
            <a href="#" className="hover:text-purple-300">Watchlist</a>
            <a href="#" className="hover:text-purple-300">My Box</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5" />
            <div className="flex items-center">
              <span>A</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <img src="/placeholder.svg?height=32&width=32" alt="User" className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </header>
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
