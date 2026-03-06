import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { useInterviewById } from "@/services/queries/interview.query";
import { useSubmitAnswers } from "@/services/mutations/interview.mutation";
import { useInterviewFormStore } from "@/stores/interview.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Send,
  Trophy,
} from "lucide-react";
import type { InterviewQuestion } from "@/@types/interview";

function QuestionCard({
  question,
  index,
  total,
  answer,
  onAnswer,
  disabled,
}: {
  question: InterviewQuestion;
  index: number;
  total: number;
  answer: string;
  onAnswer: (value: string) => void;
  disabled: boolean;
}) {
  const isCompleted = question.user_answer !== undefined;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            Pertanyaan {index + 1} dari {total}
          </Badge>
          {isCompleted && question.type === "multiple_choice" && (
            <Badge variant={question.is_correct ? "default" : "destructive"}>
              {question.is_correct ? (
                <CheckCircle2 className="mr-1 size-3" />
              ) : (
                <XCircle className="mr-1 size-3" />
              )}
              {question.is_correct ? "Benar" : "Salah"}
            </Badge>
          )}
          {isCompleted &&
            question.type === "essay" &&
            question.score !== undefined && (
              <Badge variant={question.score >= 70 ? "default" : "secondary"}>
                Skor: {question.score}
              </Badge>
            )}
        </div>
        <CardTitle className="text-base leading-relaxed">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {question.type === "multiple_choice" && question.options && (
          <div className="space-y-2">
            {question.options.map((option) => {
              const isSelected = answer === option.label;
              const isUserAnswer = question.user_answer === option.label;
              let optionClass =
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors";

              if (isCompleted) {
                if (isUserAnswer && question.is_correct) {
                  optionClass += " border-emerald-500 bg-emerald-50";
                } else if (isUserAnswer && !question.is_correct) {
                  optionClass += " border-red-500 bg-red-50";
                } else {
                  optionClass += " border-border opacity-60";
                }
              } else if (isSelected) {
                optionClass += " border-primary bg-accent";
              } else {
                optionClass +=
                  " border-border hover:border-primary/50 hover:bg-accent/50";
              }

              return (
                <button
                  key={option.label}
                  type="button"
                  className={optionClass}
                  onClick={() =>
                    !disabled && !isCompleted && onAnswer(option.label)
                  }
                  disabled={disabled || isCompleted}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium">
                    {option.label}
                  </span>
                  <span className="text-left text-sm">{option.text}</span>
                </button>
              );
            })}
          </div>
        )}

        {question.type === "essay" && (
          <Textarea
            placeholder="Tulis jawaban kamu di sini..."
            value={isCompleted ? (question.user_answer ?? "") : answer}
            onChange={(e) => onAnswer(e.target.value)}
            disabled={disabled || isCompleted}
            rows={6}
            className="resize-none"
          />
        )}

        {isCompleted && question.feedback && (
          <div className="mt-3 rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">Feedback:</p>
            <p className="text-sm text-muted-foreground">{question.feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InterviewResult({ score }: { score: number }) {
  let message = "Perlu lebih banyak latihan";
  let color = "text-red-600";

  if (score >= 80) {
    message = "Luar biasa! Kamu sangat siap!";
    color = "text-emerald-600";
  } else if (score >= 60) {
    message = "Cukup baik, terus berlatih!";
    color = "text-amber-600";
  }

  return (
    <Card className="mb-6">
      <CardContent className="flex flex-col items-center py-8">
        <Trophy className={`mb-4 size-12 ${color}`} />
        <h3 className={`text-4xl font-bold ${color}`}>{score}</h3>
        <p className="mt-1 text-muted-foreground">{message}</p>
        <Progress value={score} className="mt-4 w-full max-w-xs" />
      </CardContent>
    </Card>
  );
}

export default function InterviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useInterviewById(id);
  const submitMutation = useSubmitAnswers(id!);

  const answers = useInterviewFormStore((s) => s.answers);
  const currentQuestion = useInterviewFormStore((s) => s.currentQuestion);
  const setAnswer = useInterviewFormStore((s) => s.setAnswer);
  const setCurrentQuestion = useInterviewFormStore((s) => s.setCurrentQuestion);
  const reset = useInterviewFormStore((s) => s.reset);

  const interview = data?.data;

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="mb-4 text-muted-foreground">Interview tidak ditemukan</p>
        <Button asChild>
          <Link to="/dashboard/interviews">Kembali</Link>
        </Button>
      </div>
    );
  }

  const isCompleted = interview.status === "completed";
  const questions = interview.questions;
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;
  const currentQ = questions[currentQuestion];

  const handleSubmit = () => {
    const payload = questions.map((q) => ({
      question_id: q.id,
      answer: answers[q.id] ?? "",
    }));
    submitMutation.mutate({ answers: payload });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to="/dashboard/interviews">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {interview.job_position}
          </h2>
          <p className="text-muted-foreground">
            {totalQuestions} pertanyaan ·{" "}
            {questions[0]?.type === "multiple_choice"
              ? "Pilihan Ganda"
              : "Essay"}
          </p>
        </div>
        {isCompleted && (
          <Badge variant="default">
            <CheckCircle2 className="mr-1 size-3" />
            Selesai
          </Badge>
        )}
      </div>

      {isCompleted && interview.overall_score !== undefined && (
        <InterviewResult score={interview.overall_score} />
      )}

      {!isCompleted && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {answeredCount} dari {totalQuestions} dijawab
            </span>
            <span>{Math.round((answeredCount / totalQuestions) * 100)}%</span>
          </div>
          <Progress value={(answeredCount / totalQuestions) * 100} />
        </div>
      )}

      {isCompleted ? (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i}
              total={totalQuestions}
              answer=""
              onAnswer={() => {}}
              disabled
            />
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => (
              <Button
                key={q.id}
                variant={
                  currentQuestion === i
                    ? "default"
                    : answers[q.id]
                      ? "secondary"
                      : "outline"
                }
                size="sm"
                onClick={() => setCurrentQuestion(i)}
                className="size-9 p-0"
              >
                {i + 1}
              </Button>
            ))}
          </div>

          {currentQ && (
            <QuestionCard
              question={currentQ}
              index={currentQuestion}
              total={totalQuestions}
              answer={answers[currentQ.id] ?? ""}
              onAnswer={(value) => setAnswer(currentQ.id, value)}
              disabled={submitMutation.isPending}
            />
          )}

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
            >
              <ArrowLeft className="mr-2 size-4" />
              Sebelumnya
            </Button>

            {currentQuestion < totalQuestions - 1 ? (
              <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                Selanjutnya
                <ArrowRight className="ml-2 size-4" />
              </Button>
            ) : (
              <Button
                disabled={!allAnswered || submitMutation.isPending}
                onClick={handleSubmit}
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Mengevaluasi...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 size-4" />
                    Kirim Jawaban
                  </>
                )}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
