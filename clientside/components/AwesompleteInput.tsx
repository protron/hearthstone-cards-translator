import React, { useEffect, useRef } from 'react';
import Awesomplete from 'awesomplete';

interface AwesompleteInputProps {
  onSelect: (value: string) => void;
  list: string[];
  placeholder?: string;
  className?: string;
}

export const AwesompleteInput: React.FC<AwesompleteInputProps> = ({
  onSelect,
  list,
  className,
  placeholder = "Card name to translate",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const awesompleteRef = useRef<Awesomplete | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      // Initialize Awesomplete
      awesompleteRef.current = new Awesomplete(inputRef.current, {
        minChars: 1,
        autoFirst: true,
        list: list
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
    if (awesompleteRef.current) {
      awesompleteRef.current.list = list;
    }
  }, [list]);

  return (
    <input
      ref={inputRef}
      className={"awesomplete " + className}
      placeholder={placeholder}
      size={25}
    />
  );
};
