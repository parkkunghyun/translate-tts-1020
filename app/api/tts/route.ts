import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { text, lan } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    if (!text) {
        return NextResponse.json({ error: 'Text is missing' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: { text },
                voice: {
                    languageCode: lan ,
                    ssmlGender: 'FEMALE',
                },
                audioConfig: {
                    audioEncoding: 'MP3',
                },
            }),
        });
        const data = await response.json();

        if (response.ok && data.audioContent) {
            return NextResponse.json({
                audioUrl: `data:audio/mp3;base64,${data.audioContent}`,
            });
        } else {
            console.error('Text-to-Speech API Error:', data);
            return NextResponse.json({ error: 'Text-to-Speech API request failed', details: data }, { status: response.status });
        }
    }
    catch (error) {
        console.error('Error during Text-to-Speech request:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}