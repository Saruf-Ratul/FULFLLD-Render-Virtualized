import React, { useState, useEffect, useRef } from "react";
import { useDictionary } from "../hooks/useDictionary";
import { SafelyRenderChildren } from "./SafelyRenderChildren";
import "./VirtualizedList.css"; // Import CSS file for styling
import { css } from "@emotion/react";

const ITEM_HEIGHT = 40; // Increased height for a more modern look
const MAX_ITEMS = 2500; // Maximum number of items to render at once

const VirtualizedList = () => {
  const dictionary = useDictionary();
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: MAX_ITEMS });
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Calculate total height of the list
  const totalHeight = dictionary.length * ITEM_HEIGHT;

  // Calculate visible range of items based on scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const newScrollTop = container.scrollTop;
      const start = Math.floor(newScrollTop / ITEM_HEIGHT);
      const end = Math.min(start + MAX_ITEMS, dictionary.length);
      setVisibleRange({ start, end });
      setScrollTop(newScrollTop);
    }
  }, [scrollTop, dictionary]);

  // Handle scroll event
  const handleScroll = () => {
    setScrollTop(containerRef.current.scrollTop);
  };

  // Handle search input change
  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  // Filter dictionary based on search query
  const filteredDictionary = dictionary.filter((word) =>
    word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render list items
  const renderItems = () => {
    const visibleItems = filteredDictionary.slice(visibleRange.start, visibleRange.end);
    return (
      <SafelyRenderChildren>
        {visibleItems.map((word, index) => (
          <div key={index} className="list-item">
            {word}
          </div>
        ))}
      </SafelyRenderChildren>
    );
  };


  return (
    <div className="virtualized-list">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className="search-input"
      />
      <div
        ref={containerRef}
        className="list-container"
        onScroll={handleScroll}
      >
        <div className="list">
          {renderItems()}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedList;
