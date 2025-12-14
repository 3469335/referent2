import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'url is required' }, { status: 400 });
    const { data: html } = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(html);

    // Заголовок
    const title = $("meta[property='og:title']").attr("content") || $("title").first().text().trim();

    // Дата
    let date = $("meta[property='article:published_time']").attr("content") ||
               $("time[datetime]").attr("datetime") ||
               $("time").attr("datetime") ||
               $("meta[name='pubdate']").attr("content") ||
               $("meta[name='date']").attr("content") ||
               $(".date").text().trim() || null;
    if (date && typeof date === 'string') date = date.split('T')[0]; // только дата

    // Контент
    let content = $("article").text().trim();
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

    // Сократим до 5000 символов максимум
    if (content.length > 5000) content = content.substring(0, 5000) + '...';

    return NextResponse.json({ date, title, content });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}
