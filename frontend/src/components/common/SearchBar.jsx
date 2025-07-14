import { X } from 'lucide-react';
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchQuery } from '../../store/slices/userSlice';

function SearchBar({ setSearchOpen }) {
  const { searchQuery } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setSearchOpen(false);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(''));

    // focus input 
    if (containerRef.current) {
      const input = containerRef.current.querySelector('input');
      input?.focus();
    }
  };

  return (
    <div ref={containerRef} className="py-8 px-5 md:px-15">
      <form
        onSubmit={handleSearchSubmit}
        className="flex relative items-center gap-2 mx-auto"
      >
        <input
          type="text"
          autoFocus
          placeholder="What are you looking for?"
          value={searchQuery}
          maxLength={128}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="w-full border-b outline-none py-2 pe-10 text-sm uppercase font-light"
        />

        {searchQuery.length > 0 && <button type='button' className='absolute right-0 top-1/2 -translate-y-1/2' onClick={handleClear}>
          <X className="w-6 h-6" strokeWidth={1} />
        </button>}

      </form>
    </div>
  )
}

export default SearchBar