# Transit — AIoT & LLM Research Assistant

A retrieval-augmented generation (RAG) chatbot grounded in the research paper
*"A Systematic Review of AIoT and Large Language Model Applications in Smart Urban Transport"*
(ITNAF National Conference, ISC-indexed, 2024).

- **Retrieval:** client-side TF-IDF + cosine similarity over paper chunks (no external service needed)
- **Generation:** Claude (Anthropic API), called through a secure serverless backend so the API key is never exposed in the browser

---

## راهنمای دیپلوی (فارسی)

### مرحله ۱ — گرفتن API Key از Anthropic

1. برو به [console.anthropic.com](https://console.anthropic.com) و یه حساب بساز (یا وارد شو)
2. از منو سمت چپ، بخش **API Keys** رو باز کن
3. روی **Create Key** بزن، یه اسم بهش بده (مثلاً `transit-demo`) و کپی‌اش کن
4. ⚠️ این کلید رو جایی امن ذخیره کن — دیگه نمی‌تونی دوباره ببینیش، فقط دوباره می‌تونی یه کلید جدید بسازی
5. تو بخش **Billing** حتماً یه مقدار کم اعتبار (مثلاً ۵ دلار) شارژ کن، چون بدون اون کلید کار نمی‌کنه

### مرحله ۲ — آپلود پروژه روی GitHub

1. برو به [github.com](https://github.com) و یه ریپوی جدید بساز (مثلاً `transit-research-assistant`)
2. تمام فایل‌های این پوشه (`api/`, `public/`, `vercel.json`, `package.json`) رو آپلود کن
   - ساده‌ترین راه: تو صفحه‌ی ریپو، دکمه‌ی **Add file → Upload files** رو بزن و فایل‌ها رو بکش‌وبنداز

### مرحله ۳ — دیپلوی روی Vercel (رایگان، بدون کارت اعتباری)

1. برو به [vercel.com](https://vercel.com) و با حساب GitHub‌ات وارد شو
2. روی **Add New → Project** بزن
3. ریپوی `transit-research-assistant` رو انتخاب کن و **Import** بزن
4. قبل از دکمه‌ی Deploy، بخش **Environment Variables** رو باز کن و اضافه کن:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** همون کلیدی که از مرحله‌ی ۱ کپی کردی
5. روی **Deploy** بزن و چند ثانیه صبر کن
6. یه لینک عمومی بهت میده (مثلاً `transit-research-assistant.vercel.app`) — این لینک نهایی توئه که می‌تونی تو رزومه بذاری! 🎉

### تست کردن

بعد از دیپلوی، وارد لینک بشو و یکی از سوال‌های پیشنهادی رو بزن. اگه خطا گرفتی:
- مطمئن شو `ANTHROPIC_API_KEY` رو درست تو تنظیمات Vercel (بخش Settings → Environment Variables) گذاشتی
- مطمئن شو تو حساب Anthropic اعتبار (Billing) داری

---

## Local development (optional)

```bash
npm install -g vercel
vercel dev
```

Then set your API key locally:
```bash
export ANTHROPIC_API_KEY=your_key_here
```
