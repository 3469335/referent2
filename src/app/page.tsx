"use client";

import { useState } from "react";
import axios from "axios";
import React from "react";

function TextResult({ value }: { value: string }) {
  if (!value) return null;
  let formatted;
  try {
    const parsed = JSON.parse(value);
    // Форматируем в текстовый формат
    const lines: string[] = [];
    if (parsed.date) {
      lines.push(`Дата: ${parsed.date}`);
    }
    if (parsed.title) {
      lines.push(`Заголовок: ${parsed.title}`);
    }
    if (parsed.content) {
      lines.push(`Контент:`);
      lines.push(parsed.content);
    }
    formatted = lines.join('\n\n');
  } catch {
    formatted = value;
  }
  return (
    <pre className="bg-gray-900 text-green-200 text-sm rounded-lg p-4 whitespace-pre-wrap break-all font-mono shadow-inner border border-gray-800 w-full overflow-visible">
      {formatted}
    </pre>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async (action: string) => {
    setLoading(true);
    setResult("");
    try {
      if (action === "parse") {
        const { data } = await axios.post("/api/extractor", { url });
        if (data.error) throw new Error(data.error);
        // Форматируем вывод так, чтобы контент отображался правильно
        const formatted = {
          date: data.date,
          title: data.title,
          content: data.content // content уже отформатирован по 60 символов на сервере
        };
        setResult(JSON.stringify(formatted, null, 2));
      } else {
        setResult(`Выполнено действие: ${action}\nдля статьи: ${url}`);
      }
    } catch (e: any) {
      setResult("Ошибка: " + (e.message || e.toString()));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-100 py-8 px-2">
      <div className="w-full max-w-xl bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 border border-indigo-100">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-800 text-center tracking-tight leading-tight mb-2 drop-shadow">AI парсер статей</h1>
        <p className="text-md text-gray-600 text-center mb-4">Вставьте ссылку на англоязычную статью и нажмите <b>Старт</b>. Остальные кнопки — для демонстрации!</p>
        <div className="flex gap-2 items-center w-full">
          <input
            type="url"
            placeholder="Введите ссылку на статью (на англ.)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-3 border border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 transition shadow-sm bg-white/80 text-gray-900"
          />
          <button
            type="button"
            aria-label="Старт парсинга"
            className="min-w-[110px] flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-500 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:brightness-110 transition disabled:opacity-50"
            disabled={!url || loading}
            onClick={() => handleClick("parse")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6 4.5v11l9-5.5-9-5.5z" /></svg>
            Старт
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-1">
          <button
            className="flex-1 px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-full border border-blue-200 hover:bg-blue-200 hover:scale-[1.03] transition disabled:opacity-60"
            disabled={!url || loading}
            onClick={() => handleClick("О чем статья?")}
          >
            О чем статья?
          </button>
          <button
            className="flex-1 px-4 py-2 bg-green-100 text-green-900 font-semibold rounded-full border border-green-200 hover:bg-green-200 hover:scale-[1.03] transition disabled:opacity-60"
            disabled={!url || loading}
            onClick={() => handleClick("Тезисы")}
          >
            Тезисы
          </button>
          <button
            className="flex-1 px-4 py-2 bg-purple-100 text-purple-900 font-semibold rounded-full border border-purple-200 hover:bg-purple-200 hover:scale-[1.03] transition disabled:opacity-60"
            disabled={!url || loading}
            onClick={() => handleClick("Пост для Telegram")}
          >
            Пост для Telegram
          </button>
        </div>
        <div className="min-h-[80px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200 mt-3 text-gray-800 shadow-inner transition-all">
          {loading
            ? <div className="flex items-center gap-3 text-indigo-500 animate-pulse"><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> AI генерирует ответ...</div>
            : result
              ? <TextResult value={result} />
              : <div className="text-gray-400 text-center">Здесь появится результат.</div>
          }
        </div>
      </div>
    </main>
  );
}
