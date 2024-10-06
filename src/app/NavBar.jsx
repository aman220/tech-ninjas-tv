"use client";
import { Search, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";

const NavBar = () => {
  return (
    <header className="bg-purple-900 text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Menu className="h-6 w-6 md:hidden" />
            <h1 className="text-2xl font-bold">Tech Ninjas</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-purple-300">Home</a>
            <Link href={'/'} className=" border-purple-500">Live TV</Link>
            <Link href={"movies"} className="hover:text-purple-300">Movies</Link>
            <a href="#" className="hover:text-purple-300">Web Series</a>
            <a href="#" className="hover:text-purple-300">Hollywood</a>
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
  )
}

export default NavBar