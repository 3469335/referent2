"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = (action: string) => {
    setLoading(true);
    setResult("");
    // TODO: добавить реальный вызов API. Сейчас только тестовый результат.
    setTimeout(() => {
      setResult(`Выполнено действие: ${action}\nдля статьи: ${url}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">Англоязычные статьи AI</h1>
        <input
          type="url"
          placeholder="Введите ссылку на статью (англ.)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
        />
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
