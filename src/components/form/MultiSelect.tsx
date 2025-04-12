import React, { useEffect, useState } from "react";

interface Option {
  value: string;
  text: string;
  selected: boolean;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  defaultSelected?: string[];
  placeholder?: string;
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
  searchable?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  placeholder = "Selecciona una opción",
  onChange,
  disabled = false,
  searchable = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (optionValue: string) => {
    const newSelectedOptions = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((val) => val !== optionValue)
      : [...selectedOptions, optionValue];

    setSelectedOptions(newSelectedOptions);
    setIsOpen(false); // ✅ Cierra al seleccionar
    if (onChange) onChange(newSelectedOptions);
  };

  const removeOption = (index: number, value: string) => {
    const newSelectedOptions = selectedOptions.filter((opt) => opt !== value);
    setSelectedOptions(newSelectedOptions);
    if (onChange) onChange(newSelectedOptions);
  };

  const selectedValuesText = selectedOptions.map(
    (value) => options.find((option) => option.value === value)?.text || ""
  );

  const filteredOptions = options.filter((option) =>
    option.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Limpiar búsqueda cuando se cierra el dropdown
  useEffect(() => {
    if (!isOpen) setSearchTerm("");
  }, [isOpen]);

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>

      <div className="relative z-20 w-full">
        <div onClick={toggleDropdown} className="w-full cursor-pointer">
          <div className="mb-2 flex min-h-[44px] flex-wrap items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            {selectedValuesText.length > 0 ? (
              selectedValuesText.map((text, index) => (
                <div
                  key={index}
                  className="group flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 dark:bg-gray-800 dark:text-white/90"
                >

                  <div className="flex items-center gap-1 h-full">
                    <span className="">{text}</span>
                    <p
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(index, selectedOptions[index]);
                      }}
                      className="text-gray-500 md:hover:text-red-500 text-2xl font-light dark:text-gray-400"
                    >
                      ×
                    </p>
                  </div>

                </div>
              ))
            ) : (
              <span className="text-sm text-gray-400 dark:text-white/60">{placeholder}</span>
            )}

            <div className="ml-auto flex items-center">
              <svg
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {isOpen && (
          <div
            className="absolute left-0 top-full z-50 w-full max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col">
              {searchable && (
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}

              {filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${selectedOptions.includes(option.value) ? "bg-primary/10" : ""
                    }`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.text}
                </div>
              ))}

              {filteredOptions.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No hay resultados
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
