"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async (action: string) => {
    setLoading(true);
    setResult("");
    try {
      const { data } = await axios.post("/api/extractor", { url });
      if (data.error) throw new Error(data.error);
      setResult(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setResult("Ошибка: " + (e.message || e.toString()));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">Англоязычные статьи AI</h1>
        <div className="flex gap-2 items-center">
          <input
            type="url"
            placeholder="Введите ссылку на статью (англ.)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
          />
          <button
            type="button"
            aria-label="Старт парсинга"
            className="min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            disabled={!url || loading}
            onClick={() => handleClick("parse")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6 4.5v11l9-5.5-9-5.5z" /></svg>
            Старт
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={!url || loading}
            onClick={() => handleClick("О чем статья?")}
          >
            О чем статья?
          </button>
          <button
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            disabled={!url || loading}
            onClick={() => handleClick("Тезисы")}
          >
            Тезисы
          </button>
          <button
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            disabled={!url || loading}
            onClick={() => handleClick("Пост для Telegram")}
          >
            Пост для Telegram
          </button>
        </div>
        <div className="min-h-[80px] bg-gray-50 rounded-lg p-4 border border-gray-200 mt-2 text-gray-800 whitespace-pre-line">
          {loading ? "AI генерирует ответ..." : result ? result : "Здесь появится результат."}
        </div>
      </div>
    </main>
  );
}
