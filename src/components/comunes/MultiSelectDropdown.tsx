import { useEffect, useRef, useState } from "react";
import { FieldValues, Path, PathValue, UseFormRegister, UseFormSetValue } from "react-hook-form";

type Props<T extends FieldValues> = {
  formFieldName: Path<T>;
  options: string[];
  register: UseFormRegister<T>;
  selectedValues: string[];
  setValue: UseFormSetValue<T>;
};

export default function MultiSelectDropdown<T extends FieldValues>({
  formFieldName,
  options,
  register,
  selectedValues,
  setValue,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    const nuevosValores = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    setValue(formFieldName, nuevosValores as PathValue<T, typeof formFieldName>, {
        shouldValidate: true,
    });
  };

  return (
    <div className="relative mt-6 mb-2" ref={dropdownRef}>
        <p className="mb-1 font-medium text-white">Seleccionar rol/roles</p>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className='w-full text-white border px-4 py-1 rounded flex justify-between items-center'
      >
        <div className="flex flex-wrap gap-2 flex-grow">
            {selectedValues.length > 0 && (
                selectedValues.map((rol) => (
                    <span
                    key={rol}
                    className="bg-amber-800 text-white px-2 py-1 rounded text-sm"
                    >
                        {rol}
                    </span>
                ))
            )}

        </div>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-8 w-8 text-white  transform transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
        viewBox="0 0 20 20"
        fill="currentColor"
        >
        <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
        />
        </svg>
      </button>

      {open && (
        <div className="absolute bg-black text-white border mt-1 z-10 w-full rounded shadow">
          <ul>
            {options.map((option) => (
              <li key={option}>
                <label className="flex items-center gap-2 px-3 py-2 hover:bg-amber-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={() => toggleOption(option)}
                    className="cursor-pointer"
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
