"use client";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: "", color: "" };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score, label: "Lemah", color: "bg-red-500" };
    if (score <= 4) return { score, label: "Sedang", color: "bg-yellow-500" };
    return { score, label: "Kuat", color: "bg-green-500" };
  };

  const strength = getStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
          <div
            className={`h-full transition-all ${strength.color}`}
            style={{ width: `${(strength.score / 6) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-semibold ${strength.color.replace("bg-", "text-")}`}>
          {strength.label}
        </span>
      </div>
      <ul className="text-xs text-neutral-600">
        <li className={password.length >= 8 ? "text-green-600" : ""}>
          {password.length >= 8 ? "✓" : "○"} Minimal 8 karakter
        </li>
        <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
          {/[A-Z]/.test(password) ? "✓" : "○"} Huruf besar
        </li>
        <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>
          {/[a-z]/.test(password) ? "✓" : "○"} Huruf kecil
        </li>
        <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
          {/[0-9]/.test(password) ? "✓" : "○"} Angka
        </li>
      </ul>
    </div>
  );
}


