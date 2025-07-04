type Props = {
  value?: string;
  onChange?: (val: string) => void;
  name?: string;
  onBlur?: () => void;
};

export default function FechaNacimientoInput({
  value = "",
  onChange,
  name,
  onBlur,
}: Props) {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // solo números
    if (val.length > 8) val = val.slice(0, 8);

    if (val.length >= 5) val = `${val.slice(0, 2)}-${val.slice(2, 4)}-${val.slice(4)}`;
    else if (val.length >= 3) val = `${val.slice(0, 2)}-${val.slice(2)}`;

    onChange?.(val);
  };

  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={handleInput}
      onBlur={onBlur}
      placeholder="dd-mm-yyyy"
      className="w-full border p-2 rounded"
      inputMode="numeric"
      maxLength={10}
    />
  );
}
