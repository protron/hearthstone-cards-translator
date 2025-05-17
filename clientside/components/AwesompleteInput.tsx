import React, { useEffect, useRef } from 'react';
import Awesomplete from 'awesomplete';

interface AwesompleteInputProps {
  onSelect: (value: string) => void;
  nameTranslations: {
    [key: string]: {
      [key: string]: string;
    };
  };
  placeholder?: string;
  className?: string;
}

export const AwesompleteInput: React.FC<AwesompleteInputProps> = ({
  onSelect,
  nameTranslations,
  placeholder = "Card name to translate",
  className = "awesomplete"
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const awesompleteRef = useRef<Awesomplete | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      // Initialize Awesomplete
      awesompleteRef.current = new Awesomplete(inputRef.current, {
        minChars: 1,
        autoFirst: true,
        list: Object.keys(nameTranslations)
      });

      // Add select event listener
      const handleSelect = () => {
        if (inputRef.current) {
          onSelect(inputRef.current.value);
        }
      };

      inputRef.current.addEventListener("awesomplete-selectcomplete", handleSelect);

      // Cleanup
      return () => {
        if (inputRef.current) {
          inputRef.current.removeEventListener("awesomplete-selectcomplete", handleSelect);
        }
      };
    }
  }, []); // Initialize only once

  useEffect(() => {
    // Update the list when nameTranslations changes
    if (awesompleteRef.current) {
      awesompleteRef.current.list = Object.keys(nameTranslations);
    }
  }, [nameTranslations]);

  return (
    <input
      ref={inputRef}
      className={className}
      placeholder={placeholder}
      size={25}
    />
  );
};
