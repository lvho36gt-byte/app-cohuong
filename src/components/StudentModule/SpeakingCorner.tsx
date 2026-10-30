import React, { useState, useRef } from 'react';
import { Assignment, Submission } from '../../types';
import { Mic, MicOff, Play, Square, Send, CheckCircle, Volume2, FileText, AlertCircle, Info } from 'lucide-react';

interface SpeakingCornerProps {
  assignments: Assignment[];
  activeStudentCode: string;
  onRefreshData: () => void;
}

export const SpeakingCorner: React.FC<SpeakingCornerProps> = ({
  assignments,
  activeStudentCode,
  onRefreshData
}) => {
  const speakingAssignments = assignments.filter(a => a.type === 'speaking');
  const currentAssignment = speakingAssignments[0];

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcriptText, setTranscriptText] = useState('');
  const [useTextAlternative, setUseTextAlternative] = useState(false);
  const [selfReflection, setSelfReflection] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setRecordedAudioUrl(reader.result as string);
        };
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Không thể kích hoạt micro (có thể do trình duyệt chưa cấp quyền). Em có thể sử dụng hình thức "Nộp bài chuẩn bị bằng văn bản" ở bên dưới nhé!');
      setUseTextAlternative(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const handleSubmit = async () => {
    if (!recordedAudioUrl && !transcriptText.trim()) {
      alert('Vui lòng ghi âm hoặc nhập bản chuẩn bị bài nói trước khi nộp!');
      return;
    }

    setSubmitting(true);
    const payload = {
      assignmentId: currentAssignment?.id || 'assign-003',
      studentId: activeStudentCode,
      studentDisplayName: `Học sinh ${activeStudentCode}`,
      classId: currentAssignment?.classId || 'class-6a',
      type: 'speaking',
      status: 'submitted',
      audioDataUrl: recordedAudioUrl || undefined,
      transcriptText: transcriptText || undefined,
      speakingSelfReflection: selfReflection || undefined
    };

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSubmitted(true);
        onRefreshData();
      } else {
        alert('Lỗi nộp bài. Vui lòng thử lại!');
      }
    } catch {
      alert('Không thể kết nối máy chủ.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
          Rèn luyện năng lực Nói và Nghe
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
          Góc "Em kể chuyện"
        </h2>
        <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
          Tập làm chủ giọng nói, ngữ điệu và chia sẻ câu chuyện bản làng thân yêu.
        </p>
      </div>

      {/* Speaking Prompt Card */}
      <div className="bg-emerald-900/5 dark:bg-emerald-950/20 border border-emerald-900/20 dark:border-emerald-800/40 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 font-serif font-bold text-lg text-emerald-950 dark:text-emerald-100">
          <Volume2 className="w-5 h-5 text-emerald-700" />
          <span>Đề bài: Giới thiệu nét đẹp văn hóa hoặc phong cảnh Quản Bạ</span>
        </div>
        
        <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
          {currentAssignment?.instructions || 'Em hãy chuẩn bị một bài nói ngắn (1 đến 2 phút) kể về một cảnh đẹp, một kỉ niệm hoặc nét độc đáo của nghề truyền thống quê em.'}
        </p>

        <div className="pt-2">
          <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
            Gợi ý các phần bài nói:
          </div>
          <ul className="list-disc list-inside text-xs text-stone-600 dark:text-stone-300 space-y-0.5">
            <li><strong>Mở đầu:</strong> Lời chào trang trọng, giới thiệu họ tên, lớp và đối tượng muốn giới thiệu.</li>
            <li><strong>Nội dung:</strong> Miêu tả điểm nổi bật nhất (màu sắc, âm thanh, không khí vùng cao) kết hợp bộc lộ cảm xúc tự hào.</li>
            <li><strong>Kết thúc:</strong> Tóm tắt tình cảm và lời mời bạn bè đến trải nghiệm Quản Bạ.</li>
          </ul>
        </div>
      </div>

      {/* Sư phạm & Bảo mật disclaimer */}
      <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Quy chuẩn sư phạm:</strong> Hệ thống không tự động chấm cảm xúc hay giọng địa phương; Thầy/Cô bộ môn sẽ trực tiếp lắng nghe bản thu âm hoặc bản chuẩn bị của em để nhận xét và cho điểm chính thức.
        </p>
      </div>

      {/* Input Mode Selector */}
      <div className="flex items-center gap-3 text-xs">
        <button
          onClick={() => setUseTextAlternative(false)}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            !useTextAlternative ? 'bg-emerald-800 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
          }`}
        >
          Hình thức 1: Ghi âm giọng nói
        </button>
        <button
          onClick={() => setUseTextAlternative(true)}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            useTextAlternative ? 'bg-emerald-800 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
          }`}
        >
          Hình thức 2: Nộp bản chuẩn bị bằng chữ viết
        </button>
      </div>

      {/* Audio Recorder Module */}
      {!useTextAlternative && (
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 text-center space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Phòng thu âm bài nói
            </h3>
            <p className="text-xs text-stone-500">
              Nhấn nút ghi âm và tự tin trình bày bài nói của em trong vòng 1-2 phút.
            </p>
          </div>

          <div className="text-3xl font-mono font-bold text-stone-800 dark:text-stone-200 py-2">
            {formatTime(recordingSeconds)}
          </div>

          <div className="flex justify-center gap-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Bắt đầu ghi âm</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer animate-pulse"
              >
                <Square className="w-4 h-4" />
                <span>Dừng ghi âm</span>
              </button>
            )}
          </div>

          {/* Audio Player Preview */}
          {recordedAudioUrl && (
            <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 max-w-md mx-auto space-y-2">
              <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                Nghe lại bản thu âm của em:
              </div>
              <audio src={recordedAudioUrl} controls className="w-full" />
            </div>
          )}
        </div>
      )}

      {/* Text Alternative Option */}
      {useTextAlternative && (
        <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-3">
          <div className="flex items-center gap-2 font-serif font-bold text-base text-stone-900 dark:text-stone-100">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Bản chuẩn bị bài nói (Văn bản thay thế)</span>
          </div>
          <p className="text-xs text-stone-500">
            Em hãy ghi lại lời giới thiệu và các ý chính mà em dự định trình bày trước lớp:
          </p>
          <textarea
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            rows={8}
            placeholder="Kính chào Thầy/Cô và các bạn, hôm nay em xin đại diện nhóm giới thiệu về nét đẹp..."
            className="w-full p-3.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 text-sm leading-relaxed text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-serif"
          />
        </div>
      )}

      {/* Self-Reflection Note */}
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 space-y-2">
        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
          Tự đánh giá của em (Em thấy mình nói to, rõ ràng chưa? Có chi tiết nào em muốn kể hay hơn?):
        </label>
        <input
          type="text"
          value={selfReflection}
          onChange={(e) => setSelfReflection(e.target.value)}
          placeholder="Ví dụ: Em đã nói to rõ ràng, lần sau em sẽ miêu tả kĩ hơn màu sắc của trang phục lanh..."
          className="w-full p-2.5 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-stone-500">Mã học sinh: {activeStudentCode}</span>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{submitting ? 'Đang gửi bài...' : 'Nộp bài nói cho Giáo viên'}</span>
        </button>
      </div>

      {submitted && (
        <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-400 text-emerald-950 dark:text-emerald-100 rounded-xl flex items-center gap-2 text-xs">
          <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>Bài nói của em đã được gửi thành công! Thầy cô sẽ sớm lắng nghe và phản hồi cho em.</span>
        </div>
      )}
    </div>
  );
};
