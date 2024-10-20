"use client"

import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState("")
  const [translateText, setTranslateText] = useState("sdf")
  const [translateLan, setTranslateLan] = useState("en")


  const handleTranslate = async () => {
    if (!text || !translateLan) {
      console.error('Text or target language is missing');
      return;
    }
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,          // 번역할 텍스트
          transLan: translateLan, // 타겟 언어 코드
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const { translatedTextRes } = data;
        setTranslateText(translatedTextRes);
      } else {
        console.error('Translation API error:', data.error, data.details);
      }
    } catch (error) {
      console.error('Error during translation:', error);
    }
  };

  const handleTextToSpeech = async () => {
    if (!text) {
      console.error('Text is missing for speech')
      return;
    }

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: translateText,
          lan: translateLan,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        const audioUrl = data.audioUrl;
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        console.error('Text-toSpeech API error', data.error, data.details);
      }
    }
    catch (error) {
      console.error('Error during Text to Speech')
    }
  }


  return (
    <div className="h-screen gap-4 bg-[#101827] flex flex-col items-center justify-center">
      <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 ">Little PaPaGo</h1>

      <div className="flex flex-col gap-4 mt-8 md:flex-row">
        <div className="flex flex-col justify-center w-[400px] h-[400px]  border-4 border-white bg-white shadow-lg rounded-md">
          <div className='flex justify-between p-2 border-b-2'>
            <label htmlFor="language-select">PaPaGo</label>
          </div>
          <input value={text} onChange={(e) => setText(e.target.value)} type="text" className='flex-1 p-2 text-2xl focus:outline-none' placeholder='번역할 내용을 입럭하세요' />
          <div className='flex justify-between p-2 border-t-2'>
            <button onClick={handleTranslate}>번역하기</button>
          </div>
        </div>

        <div className="flex flex-col justify-center w-[400px] h-[400px]  border-4 border-white bg-white shadow-lg rounded-md">
          <div className='flex justify-between p-2 border-b-2'> 
            <label htmlFor="language-select">언어 선택:</label>
              <select
                value={translateLan}
                onChange={(e) => setTranslateLan(e.target.value)}
                name="languages"
                id="language-select">
              <option value="ko">한국어</option>
              <option value="en">영어</option>
              <option value="zh">중국어</option>
              <option value="ja">일본어</option>
            </select>
          </div>

          <div className='flex items-center flex-1 p-2 text-2xl'>{translateText}</div>
          <div className='flex justify-between p-2 border-t-2'>
            <button onClick={() => handleTextToSpeech()}>
              <VolumeUpIcon />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
