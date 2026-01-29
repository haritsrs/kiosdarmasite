"use client";

import { useState } from "react";
import { useAuth } from "~/contexts/AuthContext";

export default function SupportPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.displayName ?? "",
    email: user?.email ?? "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/support/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Gagal mengirim pesan");
      }

      setSubmitStatus("success");
      setFormData({
        name: user?.displayName ?? "",
        email: user?.email ?? "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      setSubmitStatus("error");
      setErrorMessage(error.message ?? "Terjadi kesalahan saat mengirim pesan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Dukungan & Kontak</h1>
        <p className="mt-2 text-neutral-600">
          Kirimkan pertanyaan atau masalah Anda. Kami akan merespons secepat mungkin melalui email.
        </p>
      </header>

      {submitStatus === "success" && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          <p className="font-semibold">Pesan berhasil dikirim!</p>
          <p className="mt-1">Kami akan merespons melalui email Anda segera.</p>
        </div>
      )}

      {submitStatus === "error" && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <p className="font-semibold">Gagal mengirim pesan</p>
          <p className="mt-1">{errorMessage}</p>
        </div>
      )}

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-neutral-900">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="Nama lengkap Anda"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-neutral-900">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="nama@contoh.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-neutral-900">
              Subjek <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="Ringkasan masalah atau pertanyaan Anda"
              maxLength={200}
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-semibold text-neutral-900">
              Pesan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={8}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="Jelaskan masalah atau pertanyaan Anda secara detail..."
              minLength={10}
              maxLength={5000}
            />
            <p className="mt-1 text-xs text-neutral-500">
              {formData.message.length} / 5000 karakter
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-neutral-900">Informasi Kontak</h2>
        <div className="space-y-2 text-sm text-neutral-600">
          <p>
            <strong>Email:</strong> haritssetiono2304@gmail.com
          </p>
          <p className="mt-2">
            Kami biasanya merespons dalam waktu 24-48 jam pada hari kerja.
          </p>
        </div>
      </section>
    </main>
  );
}
