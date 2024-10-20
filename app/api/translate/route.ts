import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { text, transLan } = await req.json();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  // 입력값이 제대로 전달되었는지 확인
  if (!text || !transLan) {
    return NextResponse.json({ error: 'Text or target language is missing' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,         // 번역할 텍스트
          target: transLan, // 목표 언어 코드
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.data) {
      return NextResponse.json({
        translatedTextRes: data.data.translations[0].translatedText,
      });
    } else {
      // Google Translate API 오류 세부사항 출력
      console.error('Google Translate API Error:', data);
      return NextResponse.json(
        { error: 'Translation API request failed', details: data },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error during translation request:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
