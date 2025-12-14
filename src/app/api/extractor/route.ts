import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

// Функция для форматирования контента по 60 символов в строке
function formatContent(text: string, lineLength: number = 60): string {
  if (!text) return '';
  const lines: string[] = [];
  let currentLine = '';
  
  // Разбиваем текст на слова
  const words = text.split(/\s+/);
  
  for (const word of words) {
    // Если слово само по себе длиннее лимита, разбиваем его
    if (word.length > lineLength) {
      if (currentLine) {
        lines.push(currentLine.trim());
        currentLine = '';
      }
      // Разбиваем длинное слово на части
      for (let i = 0; i < word.length; i += lineLength) {
        lines.push(word.substring(i, i + lineLength));
      }
    } else {
      // Проверяем, поместится ли слово в текущую строку
      if (currentLine.length + word.length + 1 <= lineLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) {
          lines.push(currentLine.trim());
        }
        currentLine = word;
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine.trim());
  }
  
  return lines.join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'url is required' }, { status: 400 });
    const { data: html } = await axios.get(url, { timeout: 20000 });

    // Ограничение объема HTML для защиты от ошибок и DoS
    if (!html || html.length > 300_000) {
      return NextResponse.json({ error: 'Страница слишком большая или не содержит данных', length: html && html.length }, { status: 500 });
    }

    let $, title = '', date = null, content = '';
    try {
      $ = cheerio.load(html);
      // Заголовок
      title = $("meta[property='og:title']").attr("content") || $("title").first().text().trim();
      // Дата
      date = $("meta[property='article:published_time']").attr("content") ||
             $("time[datetime]").attr("datetime") ||
             $("time").attr("datetime") ||
             $("meta[name='pubdate']").attr("content") ||
             $("meta[name='date']").attr("content") ||
             $(".date").text().trim() || null;
      if (date && typeof date === 'string') date = date.split('T')[0]; // только дата
      // Контент
      content = $("article").text().trim();
      if (!content || content.length < 100) {
        content = $(".post").text().trim();
      }
      if (!content || content.length < 100) {
        content = $(".content").text().trim();
      }
      if (!content || content.length < 100) {
        content = $("main").text().trim();
      }
      if (!content || content.length < 100) {
        content = $('body').text().trim();
      }
      if (content.length > 5000) content = content.substring(0, 5000) + '...';
      // Убираем первый "{" и последний "}" из контента, если они есть
      if (content.startsWith('{')) content = content.substring(1);
      if (content.endsWith('}')) content = content.slice(0, -1);
      // Форматируем контент по 60 символов в строке
      content = formatContent(content, 60);
    } catch (err: any) {
      return NextResponse.json({ error: 'Ошибка парсинга HTML', details: err.message || err, stack: err.stack }, { status: 500 });
    }
    return NextResponse.json({ date, title, content });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error", stack: e.stack }, { status: 500 });
  }
}
